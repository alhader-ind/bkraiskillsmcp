import { Hono } from 'hono';
import { GitHubAuthService } from './services/githubAuth.js';
import { GitHubPRService } from './services/githubPRService.js';

type Bindings = {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
  AI?: any; // Cloudflare Workers AI Binding
  BKRAISKILLSMCP_ENGINE?: any; // Cloudflare Analytics Engine
  API_KEY?: string; // Private Skills API Key
  RATE_LIMIT?: number; // Configurable window limit
  GITHUB_WEBHOOK_SECRET?: string;
  GITHUB_APP_ID?: string;
  GITHUB_PRIVATE_KEY?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Capture env globally for non-route handlers (e.g. MCP Server)
let _workerEnv: Bindings | null = null;
app.use('*', async (c, next) => {
  if (!_workerEnv) _workerEnv = c.env;
  await next();
});

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ListResourcesRequestSchema } from "@modelcontextprotocol/sdk/types.js";

// Global reference for Edge Isolate testing (not strictly durable across CF instances)
let isolateGlobalTransport: WebStandardStreamableHTTPServerTransport | null = null;

// Healthcheck
app.get('/api/health', (c) => c.json({ status: 'ok', framework: 'hono' }));

// --- PHASE 3: MIDDLEWARE ORCHESTRATION ---

// 1. In-Memory Rate Limiter (Isolate-Local for Edge)
const edgeRateLimitCache = new Map<string, number>();
app.use('/api/*', async (c, next) => {
  const ip = c.req.header('cf-connecting-ip') || '127.0.0.1';
  // Use bound limit or default to 100
  const limit = c.env?.RATE_LIMIT || 100;
  const current = edgeRateLimitCache.get(ip) || 0;
  
  if (current >= limit) {
    return c.json({ error: 'Too Many Requests (Rate Limited)', code: 429 }, 429);
  }
  edgeRateLimitCache.set(ip, current + 1);
  await next();
});

// 2. Analytics Telemetry (Cloudflare Analytics Engine)
app.use('/api/skills/*', async (c, next) => {
  await next();
  if (c.env?.BKRAISKILLSMCP_ENGINE && c.res.status === 200) {
    const url = new URL(c.req.url);
    const skillPath = url.pathname;
    const ip = c.req.header('cf-connecting-ip') || 'unknown';
    
    try {
      c.env.BKRAISKILLSMCP_ENGINE.writeDataPoint({
        blobs: [skillPath, ip],
        doubles: [1],
        indexes: [skillPath]
      });
    } catch (e) {
      console.warn("Analytics write failure:", e);
    }
  }
});

// 3. Multi-Tenant / Private Skills Guard (Bearer Token Auth)
app.use('/api/private/*', async (c, next) => {
  const auth = c.req.header('Authorization');
  const expectedKey = c.env?.API_KEY || 'default_dev_key';

  if (!auth || auth !== `Bearer ${expectedKey}`) {
    return c.json({ error: 'Unauthorized. Invalid or missing API Key.', code: 401 }, 401);
  }
  await next();
});

app.get('/api/private/status', (c) => {
  return c.json({ status: "Private zone accessed securely.", authenticated: true });
});

// --- PHASE 4: GITHUB APP INTEGRATION (Webhook Interception) ---

async function verifyGitHubSignature(secret: string, signature: string, payload: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify", "sign"]
  );
  const sigBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const hexSig = Array.from(new Uint8Array(sigBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  const expected = `sha256=${hexSig}`;
  
  if (signature.length !== expected.length) return false;
  let isEqual = true;
  for (let i = 0; i < signature.length; i++) {
    if (signature[i] !== expected[i]) isEqual = false;
  }
  return isEqual;
}

app.post('/api/github/webhook', async (c) => {
  const signature = c.req.header('x-hub-signature-256');
  const event = c.req.header('x-github-event');
  const secret = c.env?.GITHUB_WEBHOOK_SECRET;

  if (!secret) {
    return c.json({ error: 'GitHub Integration not configured: Missing Secret' }, 501);
  }

  if (!signature || !event) {
    return c.json({ error: 'Missing GitHub Webhook Headers' }, 400);
  }

  const payload = await c.req.text();
  
  const isValid = await verifyGitHubSignature(secret, signature, payload);
  if (!isValid) {
    return c.json({ error: 'Invalid Webhook Signature' }, 401);
  }

  const data = JSON.parse(payload);

  // GitHub Ping Event
  if (event === 'ping') {
    return c.json({ status: 'pong', message: 'Webhook connection established!' });
  }

  // Handle PR actions, Issues, etc., in future milestones
  if (event === 'pull_request') {
    console.log(`Received PR interaction: ${data.action} - ${data.pull_request?.title}`);
  }

  return c.json({ status: 'received', event });
});

app.get('/api/github/test-auth', async (c) => {
  const appId = c.env?.GITHUB_APP_ID;
  const privateKey = c.env?.GITHUB_PRIVATE_KEY;

  if (!appId || !privateKey) {
    return c.json({ error: 'Missing GitHub Auth Configuration (App ID or Private Key)' }, 501);
  }

  try {
    const authService = new GitHubAuthService(appId, privateKey);
    // 1. Test JWT Generation
    const jwt = await authService.generateAppJWT();
    
    // 2. Test Installation Token Generation (resolves first installation)
    const installationToken = await authService.getInstallationAccessToken();

    return c.json({
      status: 'success',
      message: 'Successfully authenticated as GitHub App and resolved installation token.',
      jwt_preview: jwt.substring(0, 20) + '...', // Don't leak full JWT
      token_preview: installationToken.substring(0, 15) + '...',
      installation_access_granted: true
    });
  } catch (error: any) {
    console.error('GitHub Auth Test Failed:', error);
    return c.json({
      error: 'GitHub Authentication Failed',
      message: error.message
    }, 500);
  }
});

// ------------------------------------------

// Set up MCP Server globally
const mcpServer = new Server(
  {
    name: "skillsgem-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

mcpServer.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "https://bkraiskillsmcp.pages.dev/api/context",
        name: "Technical Memory Continuity Matrix",
        description: "Aggregate repository context (MEMORY, ROADMAP, CHANGELOG, AGENTS) for absolute session handover.",
        mimeType: "text/plain",
      },
      {
        uri: "https://bkraiskillsmcp.pages.dev/llms-full.txt",
        name: "All Skills (Full Text)",
        description: "A single document containing all system instruction templates.",
        mimeType: "text/plain",
      },
      {
        uri: "https://bkraiskillsmcp.pages.dev/llms.txt",
        name: "Skills Index",
        description: "Machine-readable list of available skills.",
        mimeType: "text/plain",
      }
    ],
  };
});

mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_skill",
        description: "Fetch the raw system instruction for a specific skill.",
        inputSchema: {
          type: "object",
          properties: {
            skill_id: { 
              type: "string", 
              description: "The filename of the skill (e.g., 'surgical-debugger')" 
            },
          },
          required: ["skill_id"],
        },
      },
      {
        name: "github_create_pull_request",
        description: "Creates a GitHub Pull Request with multiple file changes by generating a new git commit and branch.",
        inputSchema: {
          type: "object",
          properties: {
            owner: { type: "string" },
            repo: { type: "string" },
            baseBranch: { type: "string", description: "The branch you want to merge into (e.g., main)." },
            newBranch: { type: "string", description: "The name of the new branch to create." },
            title: { type: "string", description: "Title of the Pull Request." },
            body: { type: "string", description: "Markdown description body of the PR." },
            files: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  path: { type: "string", description: "Repository path (e.g., src/index.ts)" },
                  content: { type: "string", description: "Raw content for the file" }
                },
                required: ["path", "content"]
              }
            }
          },
          required: ["owner", "repo", "baseBranch", "newBranch", "title", "body", "files"]
        }
      }
    ],
  };
});

mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_skill") {
    const skillId = request.params.arguments?.skill_id;
    return {
      content: [
        {
          type: "text",
          text: `To use this skill, please visit: https://bkraiskillsmcp.pages.dev/skills/${skillId}.md`
        },
      ],
    };
  }
  
  if (request.params.name === "github_create_pull_request") {
    if (!_workerEnv?.GITHUB_APP_ID || !_workerEnv?.GITHUB_PRIVATE_KEY) {
      return {
        isError: true,
        content: [{ type: "text", text: "GitHub Integration not configured: Missing App ID or Private Key bindings." }]
      };
    }
    try {
      const prService = new GitHubPRService(_workerEnv.GITHUB_APP_ID, _workerEnv.GITHUB_PRIVATE_KEY);
      const args = request.params.arguments as any;
      const res = await prService.createPullRequest({
        owner: args.owner,
        repo: args.repo,
        baseBranch: args.baseBranch,
        newBranch: args.newBranch,
        title: args.title,
        body: args.body,
        files: args.files
      });
      return {
        content: [
          { type: "text", text: `Pull Request created successfully!\nURL: ${res.pr_url}\nNumber: #${res.pr_number}\nBranch: ${res.branch}` }
        ]
      };
    } catch (e: any) {
      return {
        isError: true,
        content: [{ type: "text", text: `Failed to create PR: ${e.message}` }]
      };
    }
  }

  throw new Error("Tool not found");
});

app.all('/api/mcp', async (c) => {
  if (!isolateGlobalTransport) {
    isolateGlobalTransport = new WebStandardStreamableHTTPServerTransport();
    await mcpServer.connect(isolateGlobalTransport);
  }
  return await isolateGlobalTransport.handleRequest(c.req.raw);
});

app.post('/api/mcp/messages', async (c) => {
  if (isolateGlobalTransport) {
    return await isolateGlobalTransport.handleRequest(c.req.raw);
  }
  return c.json({ status: "message endpoint active, but no global transport in ISOLATE" }, 503);
});

// Alternative: Temporary REST Test Route for immediate Cloudflare Curl Testing
app.post('/api/test-pr', async (c) => {
  if (!_workerEnv?.GITHUB_APP_ID || !_workerEnv?.GITHUB_PRIVATE_KEY) {
    return c.json({ error: 'Missing GitHub credentials' }, 501);
  }
  try {
    const payload = await c.req.json().catch(() => ({}));
    const prService = new GitHubPRService(_workerEnv.GITHUB_APP_ID, _workerEnv.GITHUB_PRIVATE_KEY);
    const res = await prService.createPullRequest({
      owner: payload.owner || "org",
      repo: payload.repo || "test-repo",
      baseBranch: payload.baseBranch || "main",
      newBranch: payload.newBranch || `feature/test-${Date.now()}`,
      title: payload.title || "Test Pull Request",
      body: payload.body || "Adds a test file with Hello World content.",
      files: payload.files || [{ path: `test-${Date.now()}.txt`, content: "Hello World testing from REST" }]
    });
    return c.json(res);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});


// Skills API Ported
app.get('/api/skills', async (c) => {
  try {
    const url = new URL(c.req.url);
    const tag = url.searchParams.get('tag');
    const keyword = url.searchParams.get('keyword');
    const id = url.searchParams.get('id');
    const search = url.searchParams.get('search');

    // Fetch the llms.json manifest either from ASSETS in CF or locally
    // If we're on Node.js / Vite, the Vite dev server or Node server will handle this URL
    // For CF Pages, fetching a local route calls the Worker itself, so we can fetch '/llms.json'
    // But fetch('/llms.json') requires absolute URL in Workers
    const origin = url.origin;
    const manifestUrl = new URL('/llms.json', origin).toString();
    
    // In CF environment c.env.ASSETS is available. In Dev, we might just use global fetch.
    let manifestResponse;
    if (c.env?.ASSETS) {
      manifestResponse = await c.env.ASSETS.fetch(new Request(manifestUrl));
    } else {
      manifestResponse = await fetch(manifestUrl);
    }

    if (!manifestResponse.ok) {
      return c.json({ error: 'Manifest not found. Ensure build process completed successfully.' }, 404);
    }

    const data = await manifestResponse.json() as any[];

    if (id) {
      const skillId = String(id);
      const skill = data.find((s: any) => s.path.includes(skillId) || s.name.toLowerCase() === skillId.toLowerCase());
      
      if (!skill) return c.json({ error: "Skill not found" }, 404);

      const skillUrl = new URL(skill.path, origin).toString();
      let mdResponse;
      if (c.env?.ASSETS) {
        mdResponse = await c.env.ASSETS.fetch(new Request(skillUrl));
      } else {
        mdResponse = await fetch(skillUrl);
      }
      
      const content = mdResponse.ok ? await mdResponse.text() : "";
      return c.json({ ...skill, content });
    }

    let filtered = data;
    const query = (search || keyword || "").toLowerCase();
    if (query) {
      filtered = filtered.filter((s: any) => 
        s.name.toLowerCase().includes(query) || 
        s.description.toLowerCase().includes(query) ||
        (s.tags && s.tags.some((t: string) => t.toLowerCase().includes(query)))
      );
    }

    if (tag) {
      const tagQuery = tag.toLowerCase();
      filtered = filtered.filter((s: any) => 
        s.tags && s.tags.some((t: string) => t.toLowerCase().includes(tagQuery))
      );
    }

    c.header('Cache-Control', 'public, max-age=3600');
    return c.json({
      info: "SkillsGem AI Context API - Use 'id' for content, 'search' for discovery.",
      count: filtered.length,
      results: filtered
    });

  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// --- PHASE 3: SEMANTIC SEARCH ENDPOINT ---
app.get('/api/skills/semantic-search', async (c) => {
  const query = c.req.query('q');
  if (!query) {
    return c.json({ error: 'Query parameter "q" is required (e.g., ?q=database migration)' }, 400);
  }

  try {
    if (!c.env?.AI) {
      return c.json({ 
        error: 'Cloudflare Workers AI binding is not configured. Run "wrangler deployment" with [ai].',
        code: 501 
      }, 501);
    }

    // 1. Generate text embeddings via BGE Base En v1.5
    const embeddingsResponse = await c.env.AI.run('@cf/baai/bge-base-en-v1.5', {
      text: query,
    });
    
    // 2. Normally this embeddings array is cross-referenced with a Vectorize index.
    // (Vectorize binding requires explicit indexing process).
    // For this milestone, we output the abstraction layout and mock the vector DB retrieval output.
    
    return c.json({
      query,
      vector_shape: embeddingsResponse.shape,
      matches: [
        { skill: 'backend-engineer', similarity_score: 0.89 },
        { skill: 'database-architect', similarity_score: 0.85 },
        { skill: 'api-route-orchestrator', similarity_score: 0.77 }
      ],
      notice: "Real semantic retrieval requires Cloudflare Vectorize DB indexing over llms.txt."
    });
  } catch (error: any) {
    console.error('Semantic search failed:', error);
    return c.json({ error: 'Semantic search execution failed', details: error.message }, 500);
  }
});

// ZERO-FRICTION HANDOVER: Context Continuity Endpoint
app.get('/api/context', async (c) => {
  try {
    const origin = new URL(c.req.url).origin;
    const memoryFiles = ['MEMORY.md', 'ROADMAP.md', 'CHANGELOG.md', 'APP_ANALYSIS_REPORT.md', 'AGENTS.md'];
    
    let bundledContext = `# SkillsGem AI - Absolute Context Continuity (Zero-Friction Handover)\n`;
    bundledContext += `\n> [!NOTE]\n> This endpoint dynamically aggregates the Project's Technical Memory Matrix for immediate ingestion by remote LLMs.\n\n`;

    const contextData: Record<string, string> = {};

    for (const file of memoryFiles) {
      const fileUrl = new URL(`/${file}`, origin).toString();
      let response;
      if (c.env?.ASSETS) {
        response = await c.env.ASSETS.fetch(new Request(fileUrl));
      } else {
        response = await fetch(fileUrl);
      }

      if (response.ok) {
        const content = await response.text();
        contextData[file] = content;
        bundledContext += `\n---\n## 📂 File: ${file}\n---\n${content}\n`;
      } else {
        contextData[file] = `[File Not Found: Ensure the build pipeline successfully copied ${file} to public/]`;
      }
    }

    const mode = c.req.query('mode') || 'text';
    
    if (mode === 'json') {
       return c.json({
         schema: 'Technical Memory Continuity Matrix',
         version: '1.0',
         files: contextData
       });
    }

    c.header('Content-Type', 'text/plain; charset=utf-8');
    c.header('Cache-Control', 'no-store, no-cache, must-revalidate'); // Guarantee fresh handovers 
    return c.text(bundledContext);

  } catch (error: any) {
    console.error('Context Endpoint Error:', error);
    return c.json({ error: "Failed to generate context matrix", details: error.message }, 500);
  }
});

app.get('*', async (c, next) => {
  if (c.env?.ASSETS) {
    let response = await c.env.ASSETS.fetch(c.req.raw);
    if (!response.ok && response.status === 404 && !c.req.path.startsWith('/api/')) {
        const url = new URL(c.req.url);
        url.pathname = '/index.html';
        response = await c.env.ASSETS.fetch(new Request(url.toString(), c.req.raw));
    }
    return response;
  }
  
  await next();
});

export default app;
