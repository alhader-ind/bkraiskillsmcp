import { AgentConfig, SwarmMessage, AgentCapability, AgentContext } from "../types";
import { GoogleGenAI, Type } from "@google/genai";
import { skillsData } from "../../skillsData";

/**
 * Base Agent Class representing a single node in the swarm architecture.
 */
export class Agent {
  public name: string;
  public role: string;
  public skills: string[];
  public instructions: string;
  public model: string;
  public capabilities: AgentCapability[];
  private ai: GoogleGenAI;

  constructor(config: AgentConfig, apiKey?: string) {
    this.name = config.name;
    this.role = config.role;
    this.skills = config.skills || [];
    this.instructions = config.instructions || "You are a helpful AI assistant.";
    this.model = config.model || "gemini-3.1-pro-preview";
    this.capabilities = [];
    
    // Initialize Gemini API (Uses provided apiKey or falls back to env variable)
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("No GEMINI_API_KEY found. LLM calls will fail.");
    }
    this.ai = new GoogleGenAI({ apiKey: key });
  }

  /**
   * Loads specific capabilities / tools into the agent.
   */
  public registerCapability(capability: AgentCapability) {
    this.capabilities.push(capability);
  }

  /**
   * Fetches the content of skills based on ID strings.
   */
  private buildSystemInstruction(context: AgentContext): string {
    let instruction = `You are ${this.name}. Role: ${this.role}\n\n${this.instructions}\n\n`;
    
    // Inject shared memory snapshot
    const memorySnapshot = context.memory.getSnapshot(this.name);
    instruction += `[SHARED MEMORY CONTEXT]\n${JSON.stringify(memorySnapshot, null, 2)}\n\n`;

    if (this.skills.length > 0) {
      instruction += `You have the following skills integrated:\n`;
      for (const skillId of this.skills) {
        let skillContent = skillsData[skillId];
        if (skillContent) {
           instruction += `\n--- SKILL: ${skillId} ---\n${skillContent}\n`;
        } else {
           instruction += `\n--- SKILL: ${skillId} (Content not found) ---\n`;
        }
      }
    }

    return instruction;
  }

  /**
   * In a complete implementation, this handles the prompt execution.
   */
  public async execute(messages: SwarmMessage[], context: AgentContext): Promise<SwarmMessage> {
    console.log(`[Agent: ${this.name}] Executing logic with ${this.skills.length} skills...`);
    
    // Wire up tools
    const toolDeclarations = this.capabilities.map(cap => ({
      name: cap.name,
      description: cap.description,
      parameters: cap.parameters || { type: Type.OBJECT, properties: {} }
    }));
    
    // Convert generic SwarmMessages to Gemini API format
    // Note: This is an overly simplified mapping.
    let contents = messages.map(msg => {
      return {
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: `[${msg.name || msg.role}]: ${msg.content}` }]
      }
    });

    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: contents,
      config: {
        systemInstruction: this.buildSystemInstruction(context),
        tools: toolDeclarations.length > 0 ? [{ functionDeclarations: toolDeclarations }] : undefined
      }
    });
    
    // Handle function calls
    const functionCalls = response.functionCalls;
    if (functionCalls && functionCalls.length > 0) {
      console.log(`[Agent: ${this.name}] Handing function calls: ${functionCalls.map(f => f.name).join(', ')}`);
      // Execution logic goes here.
      for (const call of functionCalls) {
        const capability = this.capabilities.find(c => c.name === call.name);
        if (capability) {
          const result = await capability.execute(call.args, context, this.name);
          console.log(`[Agent: ${this.name}] Executed ${call.name} -> result:`, result);
          
          if (call.name === 'handoffToAnotherAgent' && result.transferTo) {
             context.memory.setNextAgent(result.transferTo);
          }
        } else {
          console.warn(`[Agent: ${this.name}] Capability ${call.name} not found.`);
        }
      }
    }

    return {
      role: "assistant",
      content: response.text || "No text generated.",
      name: this.name
    };
  }
}
