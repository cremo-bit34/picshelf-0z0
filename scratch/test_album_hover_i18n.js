const fs = require('fs');

const i18nContent = fs.readFileSync('web/i18n.js', 'utf8');
const fakeWindow = {};
eval('(function(window){' + i18nContent + '})(fakeWindow)');
const langs = Object.keys(fakeWindow.I18N_TRANSLATIONS);
console.log('Available languages:', langs);

const requiredKeys = [
  'album_btn_fav_add', 'album_btn_fav_remove', 'album_btn_fav_aria', 'album_btn_import_vip', 'album_btn_import_aria',
  'album_btn_surface_pro', 'album_btn_surface_vip', 'album_btn_surface_aria', 'album_btn_download_zip',
  'album_btn_download_aria', 'album_btn_share', 'album_btn_share_aria', 'album_btn_organize_vip',
  'album_btn_organize_aria', 'album_btn_vip_dot', 'album_btn_delete', 'album_btn_delete_aria',
  'album_btn_fav_download_zip', 'album_btn_fav_share', 'album_fav_card_title', 'album_fav_cherished_singular',
  'album_fav_cherished_plural', 'album_fav_priority_sub', 'album_fav_featured_priority', 'album_fav_featured_pill',
  'album_btn_rename_tag', 'album_btn_delete_tag', 'albums_btn_create_title', 'albums_btn_3d_title',
  'albums_sort_recent_title', 'albums_sort_most_title', 'albums_sort_alpha_title', 'albums_search_clear_title',
  'album_banner_import_title', 'album_fab_import_title'
];

let allOk = true;
for (const lang of langs) {
  const dict = fakeWindow.I18N_TRANSLATIONS[lang];
  const missing = requiredKeys.filter(k => !dict[k]);
  if (missing.length > 0) {
    console.error(`Lang ${lang} missing keys:`, missing);
    allOk = false;
  }
}
if (allOk) {
  console.log(`PASS: All 10 languages have all ${requiredKeys.length} album hover keys!`);
}

const appJs = fs.readFileSync('web/app.js', 'utf8');
const checks = [
  'lblFavBtn', 'lblFavAria', 'lblImport', 'lblImportAria', 'lblSurface',
  'lblDownload', 'lblShare', 'lblOrganize', 'lblVipDot', 'lblDelete',
  'lblFavDownload', 'lblFavShare'
];
for (const c of checks) {
  if (!appJs.includes(c)) {
    console.error('Missing in app.js: ' + c);
    allOk = false;
  }
}
if (allOk) {
  console.log('PASS: app.js contains all localized hover title variables!');
}

const indexHtml = fs.readFileSync('web/index.html', 'utf8');
const htmlAttrChecks = [
  'data-i18n-title="albums_btn_create_title"',
  'data-i18n-title="albums_search_clear_title"',
  'data-i18n-title="albums_btn_3d_title"',
  'data-i18n-title="albums_sort_recent_title"',
  'data-i18n-title="albums_sort_most_title"',
  'data-i18n-title="albums_sort_alpha_title"',
  'data-i18n-title="album_banner_import_title"',
  'data-i18n-title="album_fab_import_title"'
];
for (const h of htmlAttrChecks) {
  if (!indexHtml.includes(h)) {
    console.error('Missing in index.html: ' + h);
    allOk = false;
  }
}
if (allOk) {
  console.log('PASS: index.html contains all data-i18n-title attributes for album buttons!');
}

// Sample Hindi output
console.log('\nHindi sample button tooltips:');
console.log('- Download Album:', fakeWindow.I18N_TRANSLATIONS.hi.album_btn_download_zip);
console.log('- Share Album:', fakeWindow.I18N_TRANSLATIONS.hi.album_btn_share);
console.log('- Organize Album:', fakeWindow.I18N_TRANSLATIONS.hi.album_btn_organize_vip);
console.log('- Delete Album:', fakeWindow.I18N_TRANSLATIONS.hi.album_btn_delete);
console.log('- Import Photos:', fakeWindow.I18N_TRANSLATIONS.hi.album_btn_import_vip);
console.log('- Customize 3D Surface:', fakeWindow.I18N_TRANSLATIONS.hi.album_btn_surface_pro);
