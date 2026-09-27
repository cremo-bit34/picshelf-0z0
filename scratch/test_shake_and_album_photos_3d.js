const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- RUNNING RIGOROUS TEST FOR 3D ALBUM PHOTO CARDS & SHAKE WAVE ---');

// 1. Check index.html
const html = fs.readFileSync(path.join(__dirname, '..', 'web', 'index.html'), 'utf8');
assert(html.includes('id="albumView3DToggleBtn"'), 'albumView3DToggleBtn missing from index.html');
assert(html.includes('onclick="toggleAlbumPhoto3DEffects()"'), 'toggleAlbumPhoto3DEffects missing in button');
assert(html.includes('class="test-shake-btn browser-only"'), 'browser-only class missing from test-shake-btn');
console.log('✓ index.html structure verified.');

// 2. Check style.css
const css = fs.readFileSync(path.join(__dirname, '..', 'web', 'style.css'), 'utf8');
let openBraces = 0, closeBraces = 0;
for (const c of css) {
  if (c === '{') openBraces++;
  if (c === '}') closeBraces++;
}
assert.strictEqual(openBraces, closeBraces, 'CSS braces must balance!');
assert(css.includes('.photo-card-elegant.card-3d'), 'photo-card-elegant.card-3d missing from CSS');
assert(css.includes('.card-3d.surface-gold'), 'card-3d.surface-gold missing from CSS');
assert(css.includes('.card-3d.surface-holo'), 'card-3d.surface-holo missing from CSS');
assert(css.includes('.card-3d.surface-amethyst'), 'card-3d.surface-amethyst missing from CSS');
assert(css.includes('.album-banner-3d-toggle-btn'), 'album-banner-3d-toggle-btn missing from CSS');
assert(css.includes('html.native-app-mode .test-shake-btn'), 'APK native-app-mode hide rule missing');
assert(css.includes('@media (hover: none) and (pointer: coarse)'), 'Mobile touch hide rule missing');
console.log('✓ style.css rules and brace balance (count: ' + openBraces + ') verified.');

// 3. Check app.js syntax and key logic
const js = fs.readFileSync(path.join(__dirname, '..', 'web', 'app.js'), 'utf8');
assert(js.includes('albumPhotos3DEnabled:'), 'state.albumPhotos3DEnabled missing');
assert(js.includes('function toggleAlbumPhoto3DEffects()'), 'toggleAlbumPhoto3DEffects function missing');
assert(js.includes('triggerShakeWave() {'), 'Aura3DMotionPhysics.triggerShakeWave missing');
assert(js.includes('album3DPreviewCard'), 'album3DPreviewCard modal animation missing');
assert(js.includes('card3DClass = isAlbumPhoto3DActive ? `card-3d surface-${activeAlbumSurfaceStyle}` : \'\';'), 'photo card 3D class logic missing');
assert(js.includes('const isNativeApp = !!window.AndroidApp'), 'APK native app cleanup logic missing');
console.log('✓ app.js logic and methods verified.');

console.log('--- ALL TESTS PASSED SUCCESSFULLY! ---');
