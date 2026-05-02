import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const SRC_DIR = './src/raw-skills';
const DEST_DIR = './public/skills';
const LLMS_TXT_PATH = './public/llms.txt';
const LLMS_FULL_PATH = './public/llms-full.txt';
const LLMS_JSON_PATH = './public/llms.json';

const REMOTE_SOURCES = [
  {
    name: 'Cloudflare',
    repo: 'cloudflare/skills',
    branch: 'main',
    basePath: ''
  },
  {
    name: 'Vercel',
    repo: 'vercel-labs/agent-skills',
    branch: 'main',
    basePath: 'src/skills'
  }
];

async function fetchRemoteSkills() {
  console.log('Fetching remote skills...');
  
  for (const source of REMOTE_SOURCES) {
    try {
      // Use GitHub API to list files in the skills directory
      // Note: In a real environment we might need a token, but for public repos simple fetch often works for small scale
      const apiUrl = `https://api.github.com/repos/${source.repo}/contents/${source.basePath}?ref=${source.branch}`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        console.error(`Failed to fetch file list for ${source.name}: ${response.statusText}`);
        continue;
      }

      const files = await response.json();
      const mdFiles = files.filter(f => f.name.endsWith('.md') && f.type === 'file');

      for (const file of mdFiles) {
        const localPath = path.join(SRC_DIR, `${source.name.toLowerCase()}-${file.name}`);
        
        // Skip if local already exists to prevent accidental overwrite of customized local skills
        // or to speed up build (optional: could check hash)
        if (fs.existsSync(localPath)) {
          // console.log(`Skipping existing remote skill: ${file.name}`);
          // continue;
        }

        const fileResponse = await fetch(file.download_url);
        if (fileResponse.ok) {
          let content = await fileResponse.text();
          
          // Ensure frontmatter for our system if missing
          if (!content.includes('name:')) {
            const skillName = file.name.replace('.md', '');
            content = `---\nname: ${source.name} ${skillName}\ndescription: Imported skill from ${source.name} repository.\n---\n\n${content}`;
          }
          
          fs.writeFileSync(localPath, content);
          console.log(`Imported: ${source.name} - ${file.name}`);
        }
      }
    } catch (err) {
      console.error(`Error syncing ${source.name}:`, err.message);
    }
  }
}

async function runSync() {
  // First, fetch remote ones
  await fetchRemoteSkills();

  // Ensure destination exists
  if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
  }

  const skills = fs.readdirSync(SRC_DIR).filter(file => file.endsWith('.md'));
  const manifesto = [];
  let fullContent = `# SkillsGem AI - Full Knowledge Base\n\nThis document contains the full text of all AI technical skills for one-shot ingestion.\n\n`;

  console.log(`Processing ${skills.length} skills (local + imported)...`);

  skills.forEach(file => {
    const content = fs.readFileSync(path.join(SRC_DIR, file), 'utf-8');
    
    // Basic frontmatter extraction
    const matchName = content.match(/name:\s*(.*)/);
    const matchDesc = content.match(/description:\s*(.*)/);
    
    const name = matchName ? matchName[1].trim() : file.replace('.md', '');
    const description = matchDesc ? matchDesc[1].trim() : '';

    // Append to full content
    fullContent += `\n---\n\n# Skill: ${name}\nDescription: ${description}\n\n${content}\n`;

    // Context bloat optimization
    const estimatedTokens = Math.ceil(content.length / 4);
    const categories = content.match(/#+.*(Frontend|Backend|Security|Database|QA|Testing|Middleware|API|Auth|UI)/i) 
                        ? content.match(/#+.*(Frontend|Backend|Security|Database|QA|Testing|Middleware|API|Auth|UI)/ig).map(m => m.replace(/#+\s*/, '')) 
                        : ["General"];
    
    // Copy file to public
    fs.writeFileSync(path.join(DEST_DIR, file), content);
    
    manifesto.push({
      name,
      description,
      estimatedTokens,
      tags: categories,
      path: `/skills/${file}`,
      rawUrl: `https://bkraiskillsmcp.pages.dev/skills/${file}`
    });
  });

  // Generate llms.txt
  let llmsTxt = `# SkillsGem AI Knowledge Base\n\n> [!IMPORTANT]\n> This is a machine-readable index of high-fidelity AI System Instructions (Skills). \n> These instructions are designed to be ingested by LLMs to augment their capabilities in specific technical domains.\n\n`;
  llmsTxt += `> [!CRITICAL] CONTEXT BLOAT & COST OPTIMIZATION\n> Avoid ingesting the monolithic \`/llms-full.txt\` unless your context window exceeds 128k tokens.\n> **Recommended Protocol for Autonomous Agents:**\n> 1. Read \`/llms.json\` for semantic discovery and token estimation.\n> 2. Use \`/api/skills?tag=[category]\` or \`/api/skills?keyword=[problem]\` to find relevant competencies.\n> 3. Fetch specific skill instructions via \`/api/skills?id=[skill-id]\` to maintain high focus and low token cost.\n\n`;
  llmsTxt += `## Primary Manifests\n\n- [Full Knowledge Base (Monolith)](/llms-full.txt): Total platform state (Verbatim content).\n- [Dynamic Manifest (JSON)](/llms.json): Full metadata, tags, and token counts for programmatic ingestion.\n\n## Available Competencies\n\n`;

  manifesto.forEach(s => {
    const id = s.path.split('/').pop().replace('.md', '');
    llmsTxt += `### [${s.name}](/skills/${id}.md)\n- **Description**: ${s.description}\n- **Tags**: ${s.tags.join(', ')}\n- **Tokens**: ~${s.estimatedTokens}\n- **Granular API**: \`/api/skills?id=${id}\`\n\n`;
  });

  fs.writeFileSync(LLMS_TXT_PATH, llmsTxt);
  fs.writeFileSync(LLMS_FULL_PATH, fullContent);
  fs.writeFileSync(LLMS_JSON_PATH, JSON.stringify(manifesto, null, 2));

  // Create .well-known directory and copy llms.txt
  const WELL_KNOWN_DIR = './public/.well-known';
  if (!fs.existsSync(WELL_KNOWN_DIR)) {
    fs.mkdirSync(WELL_KNOWN_DIR, { recursive: true });
  }
  fs.writeFileSync(path.join(WELL_KNOWN_DIR, 'llms.txt'), llmsTxt);

  console.log('Sync complete. Index generated at /llms.txt and /.well-known/llms.txt');
}

runSync();
