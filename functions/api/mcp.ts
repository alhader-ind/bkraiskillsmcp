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

  // 2. Define Resources (The Skills)
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: [
        {
          uri: "skill://surgical-debugger",
          name: "Surgical Debugger",
          description: "Targeted code fixes for breaking bugs",
          mimeType: "text/markdown",
        },
        {
          uri: "skill://systems-architect",
          name: "Systems Architect",
          description: "High-level planning for repo structures",
          mimeType: "text/markdown",
        }
      ],
    };
  });

  // 3. Define Resource Content Handler
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;
    
    // In a real implementation, we would fetch from the KV or static host
    // For this POC, we return high-impact templates
    if (uri === "skill://surgical-debugger") {
      return {
        contents: [{
          uri,
          mimeType: "text/markdown",
          text: "# Surgical Debugger\nRole: Senior Debugger...\n" 
        }]
      };
    }
    
    throw new Error("Resource not found");
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
