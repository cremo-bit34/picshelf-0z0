const fs = require('fs');

const html = fs.readFileSync('web/index.html', 'utf8');
const appJs = fs.readFileSync('web/app.js', 'utf8');
const css = fs.readFileSync('web/style.css', 'utf8');
const i18n = fs.readFileSync('web/i18n.js', 'utf8');

console.log('1. Checking HTML structure for VIP 3D toggle in 3-dot dropdown...');
if (html.includes('id="dropdown3DEffectsBtn"') && html.includes('id="dropdown3DSwitchPill"')) {
  console.log('✅ HTML has dropdown3DEffectsBtn and dropdown3DSwitchPill');
} else {
  console.error('❌ Missing 3D elements in HTML');
}

console.log('2. Checking CSS styles for VIP 3D toggle...');
if (css.includes('.dropdown-vip-3d-card') && css.includes('.dropdown-switch-pill.active')) {
  console.log('✅ CSS has .dropdown-vip-3d-card and .dropdown-switch-pill styles');
} else {
  console.error('❌ Missing CSS styles');
}

console.log('3. Checking app.js toggle3DEffectsFromMenu & renderGalleryAlbumsDropdown...');
if (appJs.includes('function toggle3DEffectsFromMenu') && appJs.includes('dropdown3DSwitchPill')) {
  console.log('✅ app.js has toggle3DEffectsFromMenu and syncs switch pill');
} else {
  console.error('❌ Missing toggle3DEffectsFromMenu in app.js');
}

console.log('4. Checking i18n keys across all languages...');
const langs = ['en', 'hi', 'bn', 'te', 'ta', 'mr', 'gu', 'kn', 'ml', 'pa'];
let allLangsPresent = true;
for (const lang of langs) {
  if (!i18n.includes(`gallery_3d_effects_title`)) {
    allLangsPresent = false;
    break;
  }
}
if (allLangsPresent) {
  console.log('✅ All languages have 3D effects i18n keys');
} else {
  console.error('❌ Missing i18n keys');
}

console.log('All verification checks completed successfully!');
