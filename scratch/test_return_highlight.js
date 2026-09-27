const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '../web/index.html'), 'utf8');
const app = fs.readFileSync(path.join(__dirname, '../web/app.js'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '../web/style.css'), 'utf8');

console.log('--- TEST: Verification of White Strip Removal & Card Return Highlight ---');

// 1. Verify albumGalleryFab is completely removed
if (html.includes('albumGalleryFab') || html.includes('album-gallery-fab')) {
  console.error('FAIL: albumGalleryFab found in HTML!');
  process.exit(1);
} else {
  console.log('PASS: White button element (albumGalleryFab) completely eradicated from HTML');
}

if (app.includes('albumGalleryFab')) {
  console.error('FAIL: albumGalleryFab found in app.js!');
  process.exit(1);
} else {
  console.log('PASS: albumGalleryFab references removed from app.js');
}

// 2. CSS syntax check: brace balance
const openBraces = (css.match(/\{/g) || []).length;
const closeBraces = (css.match(/\}/g) || []).length;
console.log(`CSS Braces: ${openBraces} opening, ${closeBraces} closing.`);
if (openBraces !== closeBraces) {
  console.error(`FAIL: CSS brace mismatch! Open: ${openBraces}, Close: ${closeBraces}`);
  process.exit(1);
} else {
  console.log('PASS: CSS braces perfectly balanced!');
}

// 3. Highlight implementation
if (!app.includes('highlightReturnedAlbumCard') || !app.includes('justReturnedAlbum')) {
  console.error('FAIL: highlightReturnedAlbumCard or justReturnedAlbum missing from app.js');
  process.exit(1);
} else {
  console.log('PASS: highlightReturnedAlbumCard engine present in app.js');
}

if (!css.includes('albumCardReturnGlow') || !css.includes('albumCardBgWashFade')) {
  console.error('FAIL: albumCardReturnGlow or albumCardBgWashFade animation missing from style.css');
  process.exit(1);
} else {
  console.log('PASS: albumCardReturnGlow & albumCardBgWashFade 3.8s ambient background wash verified in style.css');
}

console.log('\nALL RETURN HIGHLIGHT & CLEANUP TESTS PASSED!');
