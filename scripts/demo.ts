import { Swarm, Agent } from "../dist/lib/index.js";

async function runDemo() {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️ No GEMINI_API_KEY found in environment. The API call will likely fail unless your environment automatically injects it.");
  }

  console.log("🤖 Initializing Swarm Demo...");

  // Initialize a new Swarm with a maximum of 5 iterations
  const swarm = new Swarm({ maxIter: 5 });

  // 1. The Researcher Agent
  const researcher = new Agent({
    name: "Researcher",
    role: "Fact Finder & Analyzer",
    instructions: "You are the Researcher. The user will ask for information about the current weather. " + 
                  "Since you are an AI without real-time internet access in this context, mock the weather data as " +
                  "'75 degrees Fahrenheit, sunny with a light breeze'.\n" +
                  "Your strict sequence of actions MUST be:\n" +
                  "1. Use the 'writeGlobalMemory' tool to save { key: 'weather_fact', value: '75F, sunny, light breeze' }.\n" +
                  "2. Use the 'handoffToAnotherAgent' tool with handoffTo='Writer' to pass control to the Writer agent.\n" +
                  "Do not ask the user for confirmation, just execute the two function calls immediately.",
  });

  // 2. The Writer Agent
  const writer = new Agent({
    name: "Writer",
    role: "Creative Poet",
    instructions: "You are the Writer. Check the [SHARED MEMORY CONTEXT] inside your system instructions. " +
                  "There should be a 'weather_fact' stored in global memory by the Researcher.\n" +
                  "Your task is to write a beautiful 4-line poem about that exact weather fact and reply to the user.\n" +
                  "Do NOT use any handoff tools when you are done. Your response will conclude the swarm execution.",
  });

  // Register both agents to the swarm
  swarm.registerAgent(researcher);
  swarm.registerAgent(writer);

  console.log("\n🚀 Starting task with the Researcher: 'Please find the weather and write a short poem about it.'\n");
  
  try {
    const history = await swarm.run("Researcher", [
      { role: "user", content: "Please find out the current weather and write a short poem about it." }
    ]);

    console.log("\n✅ Swarm execution complete! Final Conversation History:");
    console.log("=====================================================");
    for (const msg of history) {
      console.log(`\n[${msg.name || msg.role | "unknown"}]`);
      console.log(`${msg.content}`);
    }
    console.log("=====================================================\n");
  } catch (error) {
    console.error("❌ Execution failed:", error);
  }
}

runDemo();
