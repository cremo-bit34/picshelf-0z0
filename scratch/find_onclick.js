const fs = require('fs');
const html = fs.readFileSync('web/index.html', 'utf8');
const lines = html.split('\n');
lines.forEach((line, i) => {
  if (line.includes('getElementById')) {
    console.log(`Line ${i + 1}: ${line.trim()}`);
  }
});
