const fs = require('fs');

const appJs = fs.readFileSync('web/app.js', 'utf8');
const indexHtml = fs.readFileSync('web/index.html', 'utf8');

// Find all document.getElementById('...')
const getByIdMatches = appJs.match(/document\.getElementById\(['"]([^'"]+)['"]\)/g) || [];
const uniqueIds = [...new Set(getByIdMatches.map(m => m.match(/['"]([^'"]+)['"]/)[1]))];

console.log('Total unique IDs referenced via getElementById in app.js:', uniqueIds.length);

const missingInHtml = uniqueIds.filter(id => !indexHtml.includes(`id="${id}"`));
console.log('IDs in app.js missing from index.html:');
missingInHtml.forEach(id => {
  // check where it is in app.js
  const lines = appJs.split('\n');
  lines.forEach((l, idx) => {
    if (l.includes(`'${id}'`) || l.includes(`"${id}"`)) {
      console.log(`  - ${id} at line ${idx+1}: ${l.trim()}`);
    }
  });
});

// Check all unsafe .addEventListener calls without optional chaining
const unsafeListeners = [];
const lines = appJs.split('\n');
lines.forEach((l, idx) => {
  if (l.includes(').addEventListener(')) {
    unsafeListeners.push({ line: idx + 1, code: l.trim() });
  }
});
console.log('\nUnsafe .addEventListener (without ?. optional chaining):', unsafeListeners.length);
unsafeListeners.forEach(u => console.log(`  Line ${u.line}: ${u.code}`));
