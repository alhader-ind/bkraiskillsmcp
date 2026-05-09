import fetch from 'node-fetch';

async function main() {
  console.log("Transmitting payload to https://bkraiskillsmcp.pages.dev/api/mcp...");
  
  const payload = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "github_create_pull_request",
      arguments: {
        owner: "alhader-ind",
        repo: "bkraiskillsmcp",
        baseBranch: "main",
        newBranch: "feature/edge-test",
        title: "Automated Edge Test",
        body: "Hello from Cloudflare Workers edge!",
        files: [{"path": "test.txt", "content": "Hello World"}]
      }
    }
  };

  try {
    const res = await fetch("https://bkraiskillsmcp.pages.dev/api/mcp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream"
      },
      body: JSON.stringify(payload)
    });
    
    console.log(`Status: ${res.status} ${res.statusText}`);
    const text = await res.text();
    console.log(`Response: ${text}`);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

main();
