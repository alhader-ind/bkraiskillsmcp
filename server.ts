import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import workerApp from './src/worker.js';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const app = new Hono();

// Serve static files from /dist FIRST
app.use('/*', serveStatic({ root: './dist' }));

// Dedicated Node.js ESLint Compiler Check Route
app.get('/api/lint', async (c) => {
  try {
    const { stdout, stderr } = await execAsync('npx eslint . -f json').catch((err) => {
      // ESLint returns non-zero code on rule warnings/errors, use captured stdout/stderr
      return err;
    });

    const output = (stdout || '').toString();
    if (!output.trim()) {
      return c.json({
        success: false,
        error: 'ESLint returned empty output',
        details: stderr ? stderr.toString() : 'Unknown lint execution issue'
      }, 500);
    }

    try {
      const results = JSON.parse(output);
      const totalErrors = results.reduce((sum: number, r: any) => sum + r.errorCount, 0);
      const totalWarnings = results.reduce((sum: number, r: any) => sum + r.warningCount, 0);

      const reports = results
        .filter((r: any) => r.errorCount > 0 || r.warningCount > 0)
        .map((r: any) => ({
          filePath: path.relative(process.cwd(), r.filePath),
          errorCount: r.errorCount,
          warningCount: r.warningCount,
          messages: r.messages.map((m: any) => ({
            line: m.line,
            column: m.column,
            severity: m.severity === 2 ? 'error' : 'warning',
            ruleId: m.ruleId,
            message: m.message
          }))
        }));

      return c.json({
        success: totalErrors === 0,
        summary: {
          totalErrors,
          totalWarnings,
          fileCount: results.length
        },
        reports
      });
    } catch (parseError: any) {
      return c.json({
        success: false,
        error: 'Failed to parse ESLint JSON stream',
        rawOutput: output.substring(0, 500) + (output.length > 500 ? '...' : ''),
        details: parseError.message
      }, 500);
    }
  } catch (error: any) {
    return c.json({
      success: false,
      error: 'Exception raised executing workspace lint run',
      details: error.message
    }, 500);
  }
});

// Add the worker API routes
app.route('/', workerApp);

// SPA Fallback for non-API routes
app.get('*', async (c) => {
  if (!c.req.path.startsWith('/api/')) {
    try {
      const indexPath = path.resolve('dist/index.html');
      if (fs.existsSync(indexPath)) {
        const html = fs.readFileSync(indexPath, 'utf-8');
        return c.html(html);
      }
    } catch {
      console.error("Index HTML not found.");
    }
  }
  return c.notFound();
});

// Start Node server on port 3000
serve({
  fetch: app.fetch,
  port: 3000,
}, (info) => {
  console.log(`Node Server (Prod) running on http://localhost:${info.port}`);
});
