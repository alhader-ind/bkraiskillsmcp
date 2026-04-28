import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ListResourcesRequestSchema, ReadResourceRequestSchema } from "@modelcontextprotocol/sdk/types.js";

/**
 * MCP Server Implementation for SkillsGem
 * This allows AI agents to browse and read your custom skills as protocol resources.
 */

export async function onRequest(context) {
  const { request, env } = context;

  // 1. Initialize MCP Server
  const server = new Server(
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

  // 2. Define Resources
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
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

  // 3. Define Tools (to help AI fetch specific skills)
  server.setRequestHandler(ListToolsRequestSchema, async () => {
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

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
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

  // 4. Handle Transport
  const transport = new SSEServerTransport("/api/mcp-message", {
    // Standard transport options
  });

  // This is a simplified SSE wrapper for Cloudflare Workers
  if (request.method === "GET") {
    const { readable, writable } = new TransformStream();
    // Connect transport to writable stream...
    // In Cloudflare, we return a response with headers:
    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  }

  return new Response("Method not allowed", { status: 405 });
}
