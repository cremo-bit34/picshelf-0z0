const fs = require('fs');

const i18nContent = fs.readFileSync('web/i18n.js', 'utf8');
const fakeWindow = {};
eval('(function(window){' + i18nContent + '})(fakeWindow)');
const langs = Object.keys(fakeWindow.I18N_TRANSLATIONS);
console.log('Available languages:', langs);

const requiredKeys = [
  'surface_3d_eyebrow', 'surface_3d_title', 'surface_3d_vip_feature', 'surface_3d_vip_desc',
  'surface_3d_tester_btn', 'surface_3d_upgrade_btn', 'surface_3d_tag_album', 'surface_3d_moment_singular',
  'surface_3d_moment_plural', 'surface_3d_hint', 'surface_3d_sec1_title', 'surface_3d_default_cover',
  'surface_3d_default_cover_title', 'surface_3d_sec1_desc', 'surface_3d_upload', 'surface_3d_sec2_title',
  'surface_3d_sec2_desc', 'surface_3d_apply', 'surface_3d_tester_unlock', 'surface_3d_unlock_vip',
  'mat_holo_title', 'mat_holo_sub', 'mat_glass_title', 'mat_glass_sub', 'mat_gold_title', 'mat_gold_sub',
  'mat_aurora_title', 'mat_aurora_sub', 'mat_carbon_title', 'mat_carbon_sub', 'mat_titanium_title', 'mat_titanium_sub',
  'mat_nebula_title', 'mat_nebula_sub', 'mat_emerald_title', 'mat_emerald_sub', 'mat_pearl_title', 'mat_pearl_sub',
  'mat_rose_title', 'mat_rose_sub', 'mat_solar_title', 'mat_solar_sub', 'mat_matrix_title', 'mat_matrix_sub'
];

let allOk = true;
for (const lang of langs) {
  const dict = fakeWindow.I18N_TRANSLATIONS[lang];
  const missing = requiredKeys.filter(k => !dict[k]);
  if (missing.length > 0) {
    console.error('Lang ' + lang + ' missing keys:', missing);
    allOk = false;
  }
}
if (allOk) console.log('PASS: All 10 languages have all 44 3D Surface Studio keys!');

const html = fs.readFileSync('web/index.html', 'utf8');
const modalIndex = html.indexOf('id="album3DSurfaceModal"');
if (modalIndex === -1) {
  console.error('FAIL: album3DSurfaceModal not found in web/index.html');
  process.exit(1);
}
const modalSnippet = html.slice(modalIndex, modalIndex + 12000);

for (const key of [
  'surface_3d_eyebrow', 'surface_3d_tag_album', 'surface_3d_hint',
  'surface_3d_sec1_title', 'surface_3d_default_cover', 'surface_3d_sec1_desc',
  'surface_3d_sec2_title', 'surface_3d_sec2_desc',
  'mat_holo_title', 'mat_holo_sub',
  'mat_glass_title', 'mat_glass_sub',
  'mat_gold_title', 'mat_gold_sub',
  'mat_aurora_title', 'mat_aurora_sub',
  'mat_carbon_title', 'mat_carbon_sub',
  'mat_titanium_title', 'mat_titanium_sub',
  'mat_nebula_title', 'mat_nebula_sub',
  'mat_emerald_title', 'mat_emerald_sub',
  'mat_pearl_title', 'mat_pearl_sub',
  'mat_rose_title', 'mat_rose_sub',
  'mat_solar_title', 'mat_solar_sub',
  'mat_matrix_title', 'mat_matrix_sub'
]) {
  if (!modalSnippet.includes('data-i18n="' + key + '"')) {
    console.error('Missing data-i18n for: ' + key);
    allOk = false;
  }
}
if (allOk) console.log('PASS: index.html contains all data-i18n attributes for 3D Surface Studio!');
