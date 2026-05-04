import { Hono } from 'hono';

type Bindings = {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
};

const app = new Hono<{ Bindings: Bindings }>();

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ListResourcesRequestSchema } from "@modelcontextprotocol/sdk/types.js";

// Healthcheck
app.get('/api/health', (c) => c.json({ status: 'ok', framework: 'hono' }));

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
