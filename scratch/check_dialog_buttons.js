const fs = require('fs');
const html = fs.readFileSync('web/index.html', 'utf8');
const regex = /<div class="dialog-buttons([^"]*)"[^>]*>([\s\S]*?)<\/div>/g;
let match;
let count = 0;
while ((match = regex.exec(html)) !== null) {
  count++;
  console.log(`\n=== Dialog buttons #${count} (class="dialog-buttons${match[1]}") ===`);
  const lines = match[0].split('\n').map(l => l.trim()).filter(Boolean);
  console.log(lines.slice(0, 10).join('\n'));
}
console.log(`\nTotal dialog button groups: ${count}`);
