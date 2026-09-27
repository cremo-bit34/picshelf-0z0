const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Verifying Button Text Overlay and Overflow Fix');

const webHtml = fs.readFileSync(path.join(__dirname, '..', 'web', 'index.html'), 'utf8');
const assetHtml = fs.readFileSync(path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'web', 'index.html'), 'utf8');
const webCss = fs.readFileSync(path.join(__dirname, '..', 'web', 'style.css'), 'utf8');
const assetCss = fs.readFileSync(path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'web', 'style.css'), 'utf8');
const webAppJs = fs.readFileSync(path.join(__dirname, '..', 'web', 'app.js'), 'utf8');
const assetAppJs = fs.readFileSync(path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'web', 'app.js'), 'utf8');

// 1. Verify CSS overflow protection
assert(webCss.includes('#confirmMoveCopyBtn'), 'Missing #confirmMoveCopyBtn in style.css');
assert(webCss.includes('#confirmMoveCopyText'), 'Missing #confirmMoveCopyText in style.css');
assert(webCss.includes('text-overflow: ellipsis'), 'Missing text-overflow: ellipsis in style.css');
assert(webCss.includes('white-space: nowrap'), 'Missing white-space: nowrap in style.css');
assert(assetCss.includes('#confirmMoveCopyBtn'), 'Missing #confirmMoveCopyBtn in asset style.css');
assert(assetCss.includes('text-overflow: ellipsis'), 'Missing text-overflow: ellipsis in asset style.css');
console.log('  ✅ CSS overflow rules verified');

// 2. Verify HTML flex proportions
assert(webHtml.includes('flex: 0 0 90px; height: 48px;'), 'Cancel button should have fixed flex basis');
assert(webHtml.includes('flex: 1; min-width: 0; height: 48px;'), 'Confirm button should have flex 1 and min-width 0');
assert(assetHtml.includes('flex: 0 0 90px; height: 48px;'), 'Asset Cancel button should have fixed flex basis');
console.log('  ✅ HTML flex layout verified');

// 3. Verify App.js label logic
assert(webAppJs.includes("text.textContent = `${modeVerb} to '${dest}'`;"), 'app.js should use concise label Move/Copy to destination');
assert(assetAppJs.includes("text.textContent = `${modeVerb} to '${dest}'`;"), 'asset app.js should use concise label Move/Copy to destination');
console.log('  ✅ Action label logic verified');

console.log('🎉 ALL OVERFLOW FIX VERIFICATIONS PASSED!');
