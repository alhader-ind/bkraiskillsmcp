import fs from 'fs';

const agentsMd = fs.readFileSync('AGENTS.md', 'utf-8');
const llmsJson = JSON.parse(fs.readFileSync('public/llms.json', 'utf-8'));

const sections = {};
for (const skill of llmsJson) {
  let category = skill.tags[0] || 'General';
  // Standardize categories slightly if needed, but keeping them as is works.
  if (category === 'Frontend') category = 'Frontend Frameworks & UI Engineering';
  if (category === 'Backend') category = 'API, Integration & Backend Engineering';
  if (category === 'Security') category = 'Security & Operations';
  if (category === 'Database') category = 'Data, Databases & Extraction';
  if (category === 'QA') category = 'Testing, Debugging & Quality Assurance';
  
  if (!sections[category]) {
    sections[category] = [];
  }
  const slug = skill.path.replace('/skills/', '').replace('.md', '');
  sections[category].push(`${slug} ${skill.path} ${skill.description}`);
}

let newSection3 = `SECTION 3: Complete Skill Catalog\n\nBelow is the full remote skill inventory from https://bkraiskillsmcp.pages.dev/llms.txt. Use this as your first-pass matching reference. When a remote match is found, fetch the full skill instructions using the \`read_url_content\` tool on \`https://bkraiskillsmcp.pages.dev/api/skills?id=[skill-slug]&mode=text\`.\n\n`;

for (const [cat, items] of Object.entries(sections)) {
  newSection3 += `${cat}\n\nSkill Path Use When...\n`;
  for (const item of items) {
    newSection3 += `${item}\n`;
  }
  newSection3 += `\n`;
}

newSection3 += `---`;

const startIndex = agentsMd.indexOf('SECTION 3: Complete Skill Catalog');
const endIndexStr = '\n---\n\nSECTION 4: Skill Matching Heuristics';
const endIndex = agentsMd.indexOf(endIndexStr);

if (startIndex !== -1 && endIndex !== -1) {
  // Extract and replace
  const updatedAgents = agentsMd.substring(0, startIndex) + newSection3 + agentsMd.substring(endIndex);
  fs.writeFileSync('AGENTS.md', updatedAgents);
  console.log('AGENTS.md SECTION 3 updated.');
} else {
  console.log('Could not find markers in AGENTS.md');
}
