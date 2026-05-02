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
    const { tag, keyword, id, search } = url.searchParams;
    let filtered: any = data;

    if (id) {
      const skillId = String(id);
      const skill = data.find((s: any) => s.path.includes(skillId) || s.name.toLowerCase() === skillId.toLowerCase());
      
      if (!skill) return new Response(JSON.stringify({ error: "Skill not found" }), { status: 404 });

      const mdResponse = await fetch(new URL(skill.path, request.url));
      const content = mdResponse.ok ? await mdResponse.text() : "";
      return new Response(JSON.stringify({ ...skill, content }), { headers: { "Content-Type": "application/json" } });
    }

    const query = (search || keyword || "").toLowerCase();
    if (query) {
      filtered = filtered.filter((s: any) => 
        s.name.toLowerCase().includes(query) || 
        s.description.toLowerCase().includes(query) ||
        (s.tags && s.tags.some((t: string) => t.toLowerCase().includes(query)))
      );
    }

    if (tag) {
      const tagQuery = tag.toLowerCase();
      filtered = filtered.filter((s: any) => 
        s.tags && s.tags.some((t: string) => t.toLowerCase().includes(tagQuery))
      );
    }

    return new Response(JSON.stringify({
      info: "SkillsGem AI - Dynamic Edge Registry",
      count: filtered.length,
      results: filtered
    }), { headers: { "Content-Type": "application/json" } });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
