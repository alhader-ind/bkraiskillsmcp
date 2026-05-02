import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Dynamic API Endpoint for fetching skills
  app.get("/api/skills", (req, res) => {
    try {
      const publicDir = process.env.NODE_ENV === "production" ? __dirname : path.resolve(__dirname, "public");
      const jsonPath = path.join(publicDir, "llms.json");

      if (!fs.existsSync(jsonPath)) {
        return res.status(404).json({ error: "Manifest not found. Ensure build process completed successfully." });
      }

      const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
      const { tag, keyword, id, search } = req.query;
      
      let filtered = data;

      // 1. Exact ID Retrieval (High Fidelity)
      if (id) {
        const skillId = String(id);
        const skill = data.find((s: any) => s.path.includes(skillId) || s.name.toLowerCase() === skillId.toLowerCase());
        
        if (!skill) return res.status(404).json({ error: `Skill '${skillId}' not found.` });
        
        const mdPath = process.env.NODE_ENV === "production" 
          ? path.join(__dirname, skill.path.startsWith('/') ? skill.path.slice(1) : skill.path)
          : path.join(__dirname, "public", skill.path.startsWith('/') ? skill.path.slice(1) : skill.path);
          
        if (fs.existsSync(mdPath)) {
          return res.json({ ...skill, content: fs.readFileSync(mdPath, "utf-8") });
        }
        return res.status(404).json({ error: "Instruction file missing from storage." });
      }

      // 2. Semantic/Keyword Search
      const query = (search || keyword || "").toString().toLowerCase();
      if (query) {
        filtered = filtered.filter((s: any) => 
          s.name.toLowerCase().includes(query) || 
          s.description.toLowerCase().includes(query) ||
          (s.tags && s.tags.some((t: string) => t.toLowerCase().includes(query)))
        );
      }

      // 3. Tag Filtering
      if (tag) {
        const tagQuery = String(tag).toLowerCase();
        filtered = filtered.filter((s: any) => 
          s.tags && s.tags.some((t: string) => t.toLowerCase().includes(tagQuery))
        );
      }

      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.json({
        info: "SkillsGem AI Context API - Use 'id' for content, 'search' for discovery.",
        count: filtered.length,
        results: filtered
      });

    } catch (err) {
      res.status(500).json({ error: "Internal registry error during skill resolution." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    const distPath = __dirname;
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
