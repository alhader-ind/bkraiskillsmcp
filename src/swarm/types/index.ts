import { MemoryManager } from "./core/MemoryManager";
import { Schema } from "@google/genai";

export interface SwarmConfig {
  defaultModel?: string;
  maxIter?: number;
}

export interface AgentConfig {
  name: string;
  role: string;
  skills: string[]; // List of skill IDs to load
  instructions?: string;
  model?: string;
}

export interface SwarmMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  name?: string;
}

export interface AgentContext {
  history: SwarmMessage[];
  memory: MemoryManager;
}

export interface AgentCapability {
  name: string;
  description: string;
  parameters?: Schema;
  execute: (args: any, context: AgentContext, agentName?: string) => Promise<any>;
}
