export async function onRequest(context: any) {
  const { request, env } = context;
  
  try {
    const response = await env.ASSETS.fetch(request);
    
    const clone = response.clone();
    const text = await clone.text();
    
    // If the text is the Vite index.html SPA fallback, we reject it as 404
    if (text.trim().toLowerCase().startsWith('<!doctype html')) {
      return new Response(JSON.stringify({ error: "Skill not found or misnamed in URL." }), { 
        status: 404, 
        headers: { "Content-Type": "application/json" } 
      });
    }
    
    // Otherwise, explicitly serve it as markdown to prevent LLMs or browsers from misinterpreting
    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600"
      }
    });

  } catch (err) {
    return new Response("Internal Error", { status: 500 });
  }
}
