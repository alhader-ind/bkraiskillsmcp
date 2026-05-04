const fetch = require('node-fetch');

async function checkUrl(url) {
  const res = await fetch(url);
  const text = await res.text();
  console.log(url, res.status, text.startsWith('<') ? 'HTML' : 'Markdown');
}

async function run() {
  await checkUrl('https://bkraiskillsmcp.pages.dev/skills/api-function-caller.md');
  await checkUrl('https://bkraiskillsmcp.pages.dev/skills/clean-coder.md');
}

run();
