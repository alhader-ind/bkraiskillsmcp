const fetch = require('node-fetch');

async function checkUrl(url) {
  const res = await fetch(url);
  const text = await res.text();
  console.log(url, res.status, text.startsWith('<') ? 'HTML' : 'Markdown');
}

async function run() {
  await checkUrl('https://bkraiskillsmcp.pages.dev/api/skills?id=api-function-caller&mode=text');
  await checkUrl('https://bkraiskillsmcp.pages.dev/api/skills?id=code-refactoring-specialist&mode=text');
}

run();
