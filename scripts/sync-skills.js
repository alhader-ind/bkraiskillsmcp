import fs from 'fs';
import path from 'path';

const SRC_DIR = './src/raw-skills';
const DEST_DIR = './public/skills';
const LLMS_TXT_PATH = './public/llms.txt';
const LLMS_FULL_PATH = './public/llms-full.txt';
const LLMS_JSON_PATH = './public/llms.json';

// Ensure destination exists
if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true });
}

const skills = fs.readdirSync(SRC_DIR).filter(file => file.endsWith('.md'));
const manifesto = [];
let fullContent = `# SkillsGem AI - Full Knowledge Base\n\nThis document contains the full text of all AI technical skills for one-shot ingestion.\n\n`;

console.log(`Syncing ${skills.length} skills...`);

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
let llmsTxt = `# SkillsGem AI Knowledge Base\n\n> Machine-readable index of AI System Instructions and technical skills.\n\n`;
llmsTxt += `> [!CRITICAL] CONTEXT BLOAT WARNING\n> Do NOT ingest the full knowledge base unless your context window exceeds 100k tokens.\n> Recommended approach: Read this index or \`/llms.json\` and dynamically fetch ONLY the specific \`[skill].md\` URLs required for your current task.\n\n`;
llmsTxt += `## Documents\n\n- [Full Knowledge Base](/llms-full.txt): Use ONLY if full context is strictly required (high token cost).\n\n## Available Granular Skills\n\n`;

manifesto.forEach(s => {
  llmsTxt += `- [${s.name}](${s.path}): ${s.description} (Tokens: ~${s.estimatedTokens})\n`;
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
