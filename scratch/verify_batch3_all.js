const fs = require('fs');
const html = fs.readFileSync('web/index.html', 'utf8');
const i18nContent = fs.readFileSync('web/i18n.js', 'utf8');

const vm = require('vm');
const sandbox = {
  window: {},
  localStorage: { getItem: () => 'hi', setItem: () => {} },
  document: {
    documentElement: { lang: '' },
    querySelectorAll: () => []
  }
};
vm.createContext(sandbox);
vm.runInContext(i18nContent, sandbox);

const I18N = sandbox.window.I18N_TRANSLATIONS;
const languages = sandbox.window.I18N_LANGUAGES.map(l => l.code);

const newKeys = [
  'create_album_desc',
  'create_album_title_label',
  'create_album_placeholder',
  'create_album_palette_label',
  'create_album_import_vip',
  'create_album_create_empty',

  'organize_vip_eyebrow',
  'organize_photos_title',
  'organize_album_title',
  'organize_source_album',
  'organize_selected_badge',
  'organize_copy_photos',
  'organize_move_photos',
  'organize_copy_album',
  'organize_move_album',
  'organize_copy_hint_source',
  'organize_copy_hint_general',
  'organize_move_hint_source',
  'organize_move_hint_general',
  'organize_copy_album_hint',
  'organize_move_album_hint',
  'organize_remove_source_check',
  'organize_search_placeholder',
  'organize_source_tag',
  'organize_select_dest',
  'organize_copy_to',
  'organize_move_to',
  'organize_photo_singular',
  'organize_photos_plural',
  'organize_selected_from',
  'organize_selected_organize',
  'organize_all_from_album',
  'organize_create_prefix',

  'gallery_albums_badge_unit',
  'gallery_all_photos',
  'gallery_moments_count',
  'gallery_carousel_show',
  'gallery_carousel_hide',

  'albums_delete_title',
  'albums_delete_step1_eyebrow',
  'albums_delete_step2_eyebrow',
  'albums_delete_step2_title',
  'albums_delete_prompt',
  'albums_delete_opt_trash',
  'albums_delete_opt_trash_desc',
  'albums_delete_badge_safe',
  'albums_delete_badge_recovery',
  'albums_delete_badge_danger',
  'albums_delete_continue',
  'albums_delete_confirm_btn'
];

let allLangsPass = true;
for (const lang of languages) {
  const dict = I18N[lang];
  if (!dict) {
    console.error('Missing dict for lang:', lang);
    allLangsPass = false;
    continue;
  }
  const missing = newKeys.filter(k => !dict[k]);
  if (missing.length > 0) {
    console.error(`Lang ${lang} missing ${missing.length} keys:`, missing);
    allLangsPass = false;
  }
}

if (allLangsPass) {
  console.log(`PASS: All ${newKeys.length} new keys present in all ${languages.length} languages!`);
}

// Check HTML markers
const htmlChecks = [
  'data-i18n="create_album_desc"',
  'data-i18n="create_album_title_label"',
  'data-i18n-placeholder="create_album_placeholder"',
  'data-i18n="create_album_palette_label"',
  'data-i18n="create_album_import_vip"',
  'data-i18n="create_album_create_empty"',
  'data-i18n="organize_vip_eyebrow"',
  'data-i18n="organize_photos_title"',
  'data-i18n="organize_source_album"',
  'data-i18n="organize_copy_photos"',
  'data-i18n="organize_move_photos"',
  'data-i18n="organize_remove_source_check"',
  'data-i18n-placeholder="organize_search_placeholder"',
  'data-i18n="organize_select_dest"',
  'data-i18n-title="gallery_albums_menu_title"',
  'data-i18n="albums_delete_title"',
  'data-i18n="albums_delete_step1_eyebrow"',
  'data-i18n="albums_delete_prompt"',
  'data-i18n="albums_delete_badge_safe"',
  'data-i18n="albums_delete_opt_trash"',
  'data-i18n="albums_delete_badge_recovery"',
  'data-i18n="albums_delete_badge_danger"',
  'data-i18n="albums_delete_continue"',
  'data-i18n="albums_delete_step2_eyebrow"',
  'data-i18n="albums_delete_step2_title"',
  'data-i18n="albums_delete_confirm_btn"'
];

let htmlPass = true;
for (const p of htmlChecks) {
  if (!html.includes(p)) {
    console.error('HTML missing pattern:', p);
    htmlPass = false;
  }
}

if (htmlPass) {
  console.log(`PASS: All ${htmlChecks.length} HTML i18n markers verified!`);
}

console.log('\n--- Sample Hindi Verification ---');
console.log('Organize Photos Title:', I18N['hi']['organize_photos_title']);
console.log('Source Album Label:', I18N['hi']['organize_source_album']);
console.log('Copy Photos Button:', I18N['hi']['organize_copy_photos']);
console.log('Move Photos Button:', I18N['hi']['organize_move_photos']);
console.log('Select Dest Button:', I18N['hi']['organize_select_dest']);
console.log('Create Album Desc:', I18N['hi']['create_album_desc']);
console.log('Create & Import VIP:', I18N['hi']['create_album_import_vip']);
console.log('Browse Albums Title:', I18N['hi']['gallery_albums_menu_title']);
console.log('All Photos:', I18N['hi']['gallery_all_photos']);
console.log('Moments Unit:', I18N['hi']['gallery_moments_count']);
console.log('Show Carousel:', I18N['hi']['gallery_carousel_show']);
