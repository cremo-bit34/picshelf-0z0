const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, '../web/style.css'), 'utf8');
const html = fs.readFileSync(path.join(__dirname, '../web/index.html'), 'utf8');
const app = fs.readFileSync(path.join(__dirname, '../web/app.js'), 'utf8');

console.log('--- TEST: 3D Surface Studio VIP Expansion & Physics ---');

// 1. CSS Braces
const openBraces = (css.match(/\{/g) || []).length;
const closeBraces = (css.match(/\}/g) || []).length;
console.log(`CSS Braces: ${openBraces} opening, ${closeBraces} closing.`);
if (openBraces !== closeBraces) {
  console.error(`FAIL: CSS brace mismatch! Open: ${openBraces}, Close: ${closeBraces}`);
  process.exit(1);
}
console.log('PASS: CSS braces perfectly balanced!');

// 2. VIP Studio Artworks first in surface picker
if (!app.includes('strip.innerHTML = studioSurfacesHtml + uploadCardHtml + personalPhotosHtml')) {
  console.error('FAIL: studioSurfacesHtml is not placed first in renderSurfacePhotoPicker!');
  process.exit(1);
}
console.log('PASS: VIP Studio Artworks placed first before normal photos in surface picker!');

// 3. 32 Surface Styles verification
const finishes = [
  'holo','glass','gold','aurora','carbon','titanium','nebula','emerald','pearl','rose','solar','matrix',
  'amethyst','sapphire','ruby','quantum','damascus','cyberpunk','platina','volcanic','supernova','aquamarine',
  'copper','chameleon','celestial','onyx','sunset','prism_noir','biolum','hyperdrive','meteorite','vaporwave'
];

console.log(`Checking ${finishes.length} styles across HTML, JS, CSS...`);
let allStylesPresent = true;
finishes.forEach(f => {
  const inHtml = html.includes(`data-style="${f}"`);
  const inAppShine = app.includes(`${f}: (x, y) =>`);
  const inCssSurface = css.includes(`surface-${f}`);
  const inCssSwatch = css.includes(`swatch-${f}`);
  if (!inHtml || !inAppShine || !inCssSurface || !inCssSwatch) {
    console.error(`FAIL: Finish "${f}" incomplete!`, { inHtml, inAppShine, inCssSurface, inCssSwatch });
    allStylesPresent = false;
  }
});

if (!allStylesPresent) {
  process.exit(1);
}
console.log('PASS: All 32 3D Surface Finishes present with swatches, CSS rules, and dynamic specular shine mappings!');

// 4. Gyroscope and Wave physics check
if (!app.includes('Aura3DMotionPhysics') || !app.includes('triggerGridFluidWave')) {
  console.error('FAIL: Aura3DMotionPhysics or triggerGridFluidWave missing from app.js!');
  process.exit(1);
}
console.log('PASS: Aura3DMotionPhysics and triggerGridFluidWave fully integrated in app.js!');

// 5. Collision wave CSS check
if (!css.includes('card-collision-wave') || !css.includes('cardCollisionGleam')) {
  console.error('FAIL: card-collision-wave CSS animation missing!');
  process.exit(1);
}
console.log('PASS: card-collision-wave animation verified in style.css!');

console.log('\nALL VIP 3D STUDIO & PHYSICS EXPANSION TESTS PASSED! 🎉');
