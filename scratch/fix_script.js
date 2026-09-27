const fs = require('fs');

const s = fs.readFileSync('scratch/apply_gps_metadata_fix.js', 'utf8');
const lines = s.split('\n');
let inBt = false;
let escape = false;

for (let i = 0; i < s.length; i++) {
  const c = s[i];
  if (c === '\\') {
    escape = !escape;
  } else {
    if (c === '`' && !escape) {
      inBt = !inBt;
      const lineNum = s.slice(0, i).split('\n').length;
      console.log(`Line ${lineNum}: inBt = ${inBt}`);
    }
    escape = false;
  }
}
console.log('Final inBt:', inBt);
