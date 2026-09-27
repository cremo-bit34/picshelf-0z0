const fs = require('fs');

const css = fs.readFileSync('web/style.css', 'utf8');

const checks = [
  {
    name: 'Expanded tags wrapper is capped at 80px max-height to protect photo dimensions',
    pass: css.includes('.detail-bottom-sheet.expanded .detail-tags-row-wrapper {\n  max-height: 80px;\n  overflow-y: auto;\n  overflow-x: hidden;')
  },
  {
    name: 'Visible custom scrollbar configured on the right side for tags',
    pass: css.includes('.detail-bottom-sheet.expanded .detail-tags-row-wrapper::-webkit-scrollbar {\n  width: 5px;\n  display: block !important;\n}') &&
          css.includes('.detail-bottom-sheet.expanded .detail-tags-row-wrapper::-webkit-scrollbar-thumb')
  },
  {
    name: 'Expanded bottom sheet capped to 220px instead of 48vh so photo is never squashed',
    pass: css.includes('.detail-bottom-sheet.expanded {\n  max-height: 220px;\n  overflow-y: auto;')
  },
  {
    name: 'Location suggestions chips also capped with dedicated scrollbar',
    pass: css.includes('.location-suggestions-chips {\n  max-height: 68px;\n  overflow-y: auto;\n  overflow-x: hidden;') &&
          css.includes('.location-suggestions-chips::-webkit-scrollbar {\n  width: 4px;\n  display: block !important;\n}')
  },
  {
    name: 'Detail image stage maintains max-height: 100% and object-fit: contain',
    pass: css.includes('.detail-image-stage img {\n  max-width: 100%;\n  max-height: 100%;\n  width: auto;\n  height: auto;\n  object-fit: contain;')
  }
];

let allPassed = true;
checks.forEach(c => {
  console.log(`${c.pass ? '✅ PASS' : '❌ FAIL'}: ${c.name}`);
  if (!c.pass) allPassed = false;
});

if (allPassed) {
  console.log('\n🌟 All tag scrollbar & photo dimension checks PASSED!');
} else {
  console.error('\n⚠️ Checks failed');
  process.exit(1);
}
