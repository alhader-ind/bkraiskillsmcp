export async function onRequest(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);
  const tag = url.searchParams.get("tag");
  const keyword = url.searchParams.get("keyword");
  const id = url.searchParams.get("id");

  try {
    // The llms.json is accessible via the same domain under /llms.json
    // in Cloudflare Pages.
    const manifestUrl = new URL("/llms.json", request.url);
    const manifestResponse = await fetch(manifestUrl);
    
    if (!manifestResponse.ok) {
      return new Response(JSON.stringify({ error: "Manifest not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    const data = await manifestResponse.json();
    let filtered: any = data;

    if (id) {
      const skillId = String(id);
      const skill = data.find((s: any) => s.path === `/skills/${skillId}.md` || s.name === skillId);
      
      if (!skill) {
        return new Response(JSON.stringify({ error: "Skill not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }

      // Fetch the actual markdown content
      const mdUrl = new URL(skill.path, request.url);
      const mdResponse = await fetch(mdUrl);
      const content = mdResponse.ok ? await mdResponse.text() : "";

      return new Response(JSON.stringify({ ...skill, content }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    if (tag) {
      const tagQuery = String(tag).toLowerCase();
      filtered = filtered.filter((s: any) => 
        s.tags && s.tags.some((t: string) => t.toLowerCase().includes(tagQuery))
      );
    }

    if (keyword) {
      const kwQuery = String(keyword).toLowerCase();
      filtered = filtered.filter((s: any) => 
        s.name.toLowerCase().includes(kwQuery) || 
        s.description.toLowerCase().includes(kwQuery) ||
        (s.tags && s.tags.some((t: string) => t.toLowerCase().includes(kwQuery)))
      );
    }

    return new Response(JSON.stringify({
      total: filtered.length,
      results: filtered
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
