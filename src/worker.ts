import { Hono } from 'hono';

type Bindings = {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
  AI?: any; // Cloudflare Workers AI Binding
  BKRAISKILLSMCP_ENGINE?: any; // Cloudflare Analytics Engine
  API_KEY?: string; // Private Skills API Key
  RATE_LIMIT?: number; // Configurable window limit
};

const app = new Hono<{ Bindings: Bindings }>();

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ListResourcesRequestSchema } from "@modelcontextprotocol/sdk/types.js";

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
  throw new Error("Tool not found");
});

app.get('/api/mcp', async (c) => {
  const { readable, writable } = new TransformStream();
  // Here we would connect transport to writable stream in a real robust setup
  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
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
