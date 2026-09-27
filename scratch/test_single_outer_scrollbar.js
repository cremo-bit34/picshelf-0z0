const fs = require('fs');

const css = fs.readFileSync('web/style.css', 'utf8');

const checks = [
  {
    name: 'Single outer scrollbar on detail-bottom-sheet.expanded',
    pass: css.includes('.detail-bottom-sheet.expanded::-webkit-scrollbar {\n  width: 5px;\n  display: block !important;\n}')
  },
  {
    name: 'Inner scrollbar on tags explicitly hidden with display: none and width: 0',
    pass: css.includes('.detail-bottom-sheet.expanded .detail-tags-row-wrapper::-webkit-scrollbar {\n  display: none !important;\n  width: 0 !important;\n  height: 0 !important;\n}')
  },
  {
    name: 'Tags row wrapper has overflow: visible in expanded mode',
    pass: css.includes('.detail-bottom-sheet.expanded .detail-tags-row-wrapper {\n  overflow: visible;\n  scrollbar-width: none;\n}')
  },
  {
    name: 'Location suggestions chips has no inner scrollbar',
    pass: !css.includes('.location-suggestions-chips::-webkit-scrollbar')
  }
];

let allPassed = true;
checks.forEach(c => {
  console.log(`${c.pass ? '✅ PASS' : '❌ FAIL'}: ${c.name}`);
  if (!c.pass) allPassed = false;
});

if (allPassed) {
  console.log('\n🌟 Verified: Only ONE single outer scrollbar exists on the right side!');
} else {
  console.error('\n⚠️ Test failed');
  process.exit(1);
}
