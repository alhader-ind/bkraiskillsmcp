import { Agent } from "./Agent";
import { SwarmConfig, SwarmMessage, AgentContext } from "../types";
import { MemoryManager } from "./MemoryManager";
import { Type } from "@google/genai";

export class Swarm {
  private baseConfig: SwarmConfig;
  private agents: Map<string, Agent>;
  private memory: MemoryManager;

  constructor(config: SwarmConfig = {}) {
    this.baseConfig = { maxIter: 10, ...config };
    this.agents = new Map();
    this.memory = new MemoryManager();
  }

  public registerAgent(agent: Agent) {
    this.agents.set(agent.name, agent);
  }

  public getAgent(name: string): Agent | undefined {
    return this.agents.get(name);
  }

  /**
   * Main entry point to orchestrate a swarm task.
   */
  public async run(startingAgentName: string, initialMessages: SwarmMessage[]): Promise<SwarmMessage[]> {
    let currentAgent = this.agents.get(startingAgentName);
    if (!currentAgent) {
      throw new Error(`Agent ${startingAgentName} not found.`);
    }

    let iterations = 0;
    const history = [...initialMessages];
    const maxIter = this.baseConfig.maxIter!;
    const context: AgentContext = { history, memory: this.memory };

    while (iterations < maxIter) {
      console.log(`[Swarm] Iteration ${iterations} - Current Agent: ${currentAgent.name}`);
      
      // Ensure the agent has standard base capabilities
      if (!currentAgent.capabilities.some(cap => cap.name === 'handoffToAnotherAgent')) {
        currentAgent.registerCapability({
          name: "handoffToAnotherAgent",
          description: `Hand off task control to another agent. Available agents: ${Array.from(this.agents.keys()).join(', ')}`,
          parameters: {
            type: Type.OBJECT,
            properties: {
              handoffTo: { type: Type.STRING, description: "Name of the agent to hand off to" }
            },
            required: ["handoffTo"]
          },
          execute: async (args: any) => {
             return { transferTo: args.handoffTo };
          }
        });
      }

      if (!currentAgent.capabilities.some(cap => cap.name === 'writeGlobalMemory')) {
        currentAgent.registerCapability({
          name: "writeGlobalMemory",
          description: "Write securely to the global shared memory that all agents can read.",
          parameters: {
            type: Type.OBJECT,
            properties: {
               key: { type: Type.STRING, description: "Shared memory key to write" },
               value: { type: Type.STRING, description: "Value to write (best stored as JSON string if complex)" }
            },
            required: ["key", "value"]
          },
          execute: async (args: any, ctx: AgentContext, agentName?: string) => {
             ctx.memory.setGlobal(args.key, args.value, agentName || 'unknown');
             return { status: "Success", key: args.key };
          }
        });
      }

      // Send task to the current agent
      const response = await currentAgent.execute(history, context);
      history.push(response);

      // Check if the response contains a handoff instruction.
      // In a real implementation this is driven by function/tool parsing from execute()
      // Let's assume the Agent appends the tool call responses to history and handles it natively,
      // or returns a specific control signal if a handoff was requested.
      
      // Alternatively, the agent execution could attach a "handoff" attribute 
      // if the tool was called. We'll simulate reading it from the Agent's state or sharedState
      const nextAgentName = context.memory.getNextAgent();
      if (nextAgentName) {
         context.memory.clearNextAgent();
      }

      if (nextAgentName && this.agents.has(nextAgentName)) {
         console.log(`[Swarm] Agent ${currentAgent.name} handed off to ${nextAgentName}`);
         currentAgent = this.agents.get(nextAgentName)!;
      } else {
         // Stop condition: Agent did not hand off.
         console.log(`[Swarm] Swarm task completed by ${currentAgent.name}`);
         break;
      }
      
      iterations++;
    }

    return history;
  }
}
