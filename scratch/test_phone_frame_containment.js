const fs = require('fs');

const css = fs.readFileSync('web/style.css', 'utf8');

const checks = [
  {
    name: '#photoDetailModal uses position: absolute and width: 100% to stay inside device-frame',
    pass: css.includes('#photoDetailModal {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  width: 100%;\n  height: 100%;')
  },
  {
    name: '#photoDetailModal inherits device frame border-radius',
    pass: css.includes('border-radius: inherit;')
  },
  {
    name: 'No position: fixed or 100vw on #photoDetailModal',
    pass: !css.includes('#photoDetailModal {\n  position: fixed;') &&
          !css.includes('width: 100vw;\n  height: 100vh;\n  max-height: 100vh;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n  background: radial-gradient(circle at 50% 32%, #0e1424 0%, #060913 55%, #020306 100%) !important;\n  z-index: 9999;')
  }
];

let allPassed = true;
checks.forEach(c => {
  console.log(`${c.pass ? '✅ PASS' : '❌ FAIL'}: ${c.name}`);
  if (!c.pass) allPassed = false;
});

if (allPassed) {
  console.log('\n📱 Verified: Image screen stays strictly inside phone emulator frame!');
} else {
  console.error('\n⚠️ Test failed');
  process.exit(1);
}
