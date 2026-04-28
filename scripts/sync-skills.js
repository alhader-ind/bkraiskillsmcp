import fs from 'fs';
import path from 'path';

const SRC_DIR = './src/raw-skills';
const DEST_DIR = './public/skills';
const LLMS_TXT_PATH = './public/llms.txt';
const LLMS_JSON_PATH = './public/llms.json';

// Ensure destination exists
if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true });
}

const skills = fs.readdirSync(SRC_DIR).filter(file => file.endsWith('.md'));
const manifesto = [];

console.log(`Syncing ${skills.length} skills...`);

skills.forEach(file => {
  const content = fs.readFileSync(path.join(SRC_DIR, file), 'utf-8');
  
  // Basic frontmatter extraction
  const matchName = content.match(/name:\s*(.*)/);
  const matchDesc = content.match(/description:\s*(.*)/);
  
  const name = matchName ? matchName[1].trim() : file.replace('.md', '');
  const description = matchDesc ? matchDesc[1].trim() : '';

  // Copy file to public
  fs.writeFileSync(path.join(DEST_DIR, file), content);
  
  manifesto.push({
    name,
    description,
    path: `/skills/${file}`,
    rawUrl: `https://bkraiskillsmcp.pages.dev/skills/${file}`
  });
});

// Generate llms.txt
let llmsTxt = `# SkillsGem AI Knowledge Base\n\n> Machine-readable index of AI System Instructions and technical skills.\n\n`;
llmsTxt += `## Available Skills\n\n`;

manifesto.forEach(s => {
  llmsTxt += `- [${s.name}](${s.path}): ${s.description}\n`;
});

fs.writeFileSync(LLMS_TXT_PATH, llmsTxt);
fs.writeFileSync(LLMS_JSON_PATH, JSON.stringify(manifesto, null, 2));

// Create .well-known directory and copy llms.txt
const WELL_KNOWN_DIR = './public/.well-known';
if (!fs.existsSync(WELL_KNOWN_DIR)) {
  fs.mkdirSync(WELL_KNOWN_DIR, { recursive: true });
}
fs.writeFileSync(path.join(WELL_KNOWN_DIR, 'llms.txt'), llmsTxt);

console.log('Sync complete. Index generated at /llms.txt and /.well-known/llms.txt');
