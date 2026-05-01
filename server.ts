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
      const llmsJsonPath = path.resolve(__dirname, process.env.NODE_ENV === "production" ? "public/llms.json" : "public/llms.json");
      
      // In production (dist/server.cjs), __dirname is dist, so we need to step back or copy public
      // Actually dist includes the built assets but public is copied to dist.
      // So in prod it's path.resolve(__dirname, "llms.json") 
      // Let's resolve safely:
      const publicDir = process.env.NODE_ENV === "production" ? __dirname : path.resolve(__dirname, "public");
      const jsonPath = path.join(publicDir, "llms.json");

      if (!fs.existsSync(jsonPath)) {
        return res.status(404).json({ error: "Manifest not found. Run sync-skills." });
      }

      const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
      
      const { tag, keyword, id } = req.query;
      
      let filtered = data;

      if (id) {
        // Find single skill by ID
        const skillId = String(id);
        const skill = data.find((s: any) => s.path === `/skills/${skillId}.md` || s.name === skillId);
        
        if (!skill) {
          return res.status(404).json({ error: "Skill not found" });
        }
        
        // Load the actual markdown content using the path from the manifest
        const manifestPath = skill.path.startsWith('/') ? skill.path.slice(1) : skill.path; // e.g., 'skills/file.md'
        
        const mdPath = process.env.NODE_ENV === "production" 
          ? path.join(__dirname, manifestPath)
          : path.join(__dirname, "public", manifestPath);
          
        let content = "";
        if (fs.existsSync(mdPath)) {
          content = fs.readFileSync(mdPath, "utf-8");
        }

        return res.json({
          ...skill,
          content
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

      res.json({
        total: filtered.length,
        results: filtered
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
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
