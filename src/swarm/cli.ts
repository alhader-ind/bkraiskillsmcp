#!/usr/bin/env node
import { Swarm } from "./core/Swarm";
import { Agent } from "./core/Agent";

console.log("🚀 Agent Swarm CLI Initialized");

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("\n⚠️  No GEMINI_API_KEY detected in environment variables.");
  console.log("You can provide it when instantiating Agents, or set it in your environment.");
}

async function runDemo() {
  console.log("\n🧪 Running Swarm diagnostic check...");
  
  try {
    const defaultSwarm = new Swarm();
    console.log("✅ Swarm instance created.");
    
    // Creating a mock or real demo agent requires providing config
    console.log("\nTo start building: \n");
    console.log("1. Import: import { Swarm, Agent } from 'your-package-name';");
    console.log("2. Define: const agent = new Agent({ name: 'Worker', role: '...', instructions: '...' });");
    console.log("3. Execute: swarm.run('Worker', [{ role: 'user', content: 'Do task' }]);");
    
    console.log("\nSetup is Complete! You successfully triggered this via npx.");
  } catch (error) {
    console.error("❌ Swarm initialization failed:", error);
  }
}

runDemo();
