---
name: cloudflare-agents-sdk
description: Expertise in building stateful AI agents on Cloudflare using the Agents SDK, Durable Objects, and MCP.
---

# Cloudflare Agents SDK & Stateful Agents

The Cloudflare Agents SDK enables building "Stateful Agents"—long-running AI entities with persistent memory, scheduling, and real-time connectivity (WebSockets).

## 1. Core Architecture
- **Agents:** Built on top of Durable Objects, providing per-agent consistency and storage.
- **State:** Persistent private storage for each agent instance.
- **Communication:** Supports RPC (between agents), WebSockets (real-time chat), and standard HTTP.

## 2. Defining an Agent
Agents are defined by extending the base Agent class from the SDK.

```typescript
import { Agent } from "@cloudflare/agents";

export class MyAssistant extends Agent {
  async onMessage(message: string) {
    // Access persistent state via this.state
    const history = await this.state.get("history") || [];
    
    // Logic here...
    const response = "Hello World";
    
    await this.state.put("history", [...history, message]);
    return response;
  }
}
```

## 3. Persistent State & Storage
Every Agent has an associated `state` object (backed by Durable Objects storage).
- `await this.state.get(key)`
- `await this.state.put(key, value)`
- `await this.state.list()`

## 4. Scheduling & Alarms
Agents can schedule future tasks using the Alarms API.
- `await this.ctx.storage.setAlarm(Date.now() + 10000)`
- Handle the event via the `alarm()` method.

## 5. Deployment
Deploy using Wrangler:
```bash
npx wrangler deploy
```
Ensure `wrangler.toml` includes correct Durable Object and Agent bindings.

## 6. Integration with MCP (Model Context Protocol)
Cloudflare Agents can act as MCP hosts or clients, enabling standardized tool discovery and execution.
- Use `this.mcp` to register tools or connect to remote servers.
- Compatible with Claude Code and other MCP-enabled IDEs.
