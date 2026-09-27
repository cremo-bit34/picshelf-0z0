const fs = require('fs');
const html = fs.readFileSync('web/index.html', 'utf8');

const checks = [
  { name: 'Crop title', pattern: 'data-i18n="crop_title"' },
  { name: 'Crop fine rotation', pattern: 'data-i18n="crop_fine_rotation"' },
  { name: 'Crop free chip', pattern: 'data-i18n="crop_free"' },
  { name: 'Rename eyebrow', pattern: 'data-i18n="rename_modal_eyebrow"' },
  { name: 'Rename desc', pattern: 'data-i18n="rename_modal_desc"' },
  { name: 'Rename label', pattern: 'data-i18n="rename_modal_input_label"' },
  { name: 'Rename placeholder', pattern: 'data-i18n-placeholder="rename_modal_placeholder"' },
  { name: 'Rename max chars', pattern: 'data-i18n="rename_modal_max_chars"' },
  { name: 'Albums header title', pattern: 'data-i18n="albums_my_albums"' },
  { name: 'Tag manager tab', pattern: 'data-i18n="albums_tag_manager_tab"' },
  { name: 'Filter all chip', pattern: 'data-i18n="albums_filter_all"' },
  { name: 'Filter fav chip', pattern: 'data-i18n="favorites_title"' },
  { name: 'Filter with photos chip', pattern: 'data-i18n="albums_filter_with_photos"' },
  { name: 'Filter 3D chip', pattern: 'data-i18n="albums_filter_3d"' }
];

let failed = 0;
for (const c of checks) {
  if (html.includes(c.pattern)) {
    console.log('[PASS]', c.name, '-> found:', c.pattern);
  } else {
    console.error('[FAIL]', c.name, '-> missing pattern:', c.pattern);
    failed++;
  }
}

if (failed === 0) {
  console.log('\nAll 14 UI elements verified successfully in web/index.html!');
} else {
  process.exit(1);
}
