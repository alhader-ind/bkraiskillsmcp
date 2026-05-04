const fs = require('fs');

const agentsMd = fs.readFileSync('AGENTS.md', 'utf-8');
const skillsList = agentsMd.match(/\/skills\/[a-zA-Z0-9_-]+\.md/g) || [];

const publicSkills = fs.readdirSync('public/skills').map(f => `/skills/${f}`);

console.log('URLs in AGENTS.md but missing in public/skills:');
const missing = skillsList.filter(s => !publicSkills.includes(s));
missing.forEach(s => console.log(s));
