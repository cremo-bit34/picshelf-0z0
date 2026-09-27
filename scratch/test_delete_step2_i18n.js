const fs = require('fs');
const vm = require('vm');

const i18nContent = fs.readFileSync('web/i18n.js', 'utf8');
const sandbox = {
  window: {},
  document: {
    querySelectorAll: () => [],
    getElementById: () => null
  },
  localStorage: {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); }
  }
};

vm.createContext(sandbox);
vm.runInContext(i18nContent, sandbox);

const translations = sandbox.window.I18N_TRANSLATIONS;
const languages = ['en', 'hi', 'bn', 'te', 'ta', 'mr', 'gu', 'kn', 'ml', 'pa'];

const requiredKeys = [
  'albums_delete_step2_eyebrow',
  'albums_delete_step2_eyebrow_trash',
  'albums_delete_step2_eyebrow_perm',
  'albums_delete_step2_title_empty',
  'albums_delete_step2_title_keep',
  'albums_delete_step2_title_trash',
  'albums_delete_step2_title_perm',
  'albums_delete_row_album_to_delete',
  'albums_delete_row_album_to_recycle',
  'albums_delete_row_photos_in_album',
  'albums_delete_row_photo_retention',
  'albums_delete_row_data_safety',
  'albums_delete_row_photos_to_trash',
  'albums_delete_row_retention_period',
  'albums_delete_row_permanent_destruction',
  'albums_delete_row_recovery_status',
  'albums_delete_val_empty_photos',
  'albums_delete_val_photos_saved_singular',
  'albums_delete_val_photos_saved_plural',
  'albums_delete_val_safety_guarantee',
  'albums_delete_val_trash_period',
  'albums_delete_val_destruction_singular',
  'albums_delete_val_destruction_plural',
  'albums_delete_val_cannot_undo',
  'albums_delete_unit_photo_singular',
  'albums_delete_unit_photo_plural',
  'albums_delete_desc_empty',
  'albums_delete_desc_keep_singular',
  'albums_delete_desc_keep_plural',
  'albums_delete_desc_trash_singular',
  'albums_delete_desc_trash_plural',
  'albums_delete_desc_perm_warn_singular',
  'albums_delete_desc_perm_warn_plural',
  'albums_delete_checkbox_confirm_singular',
  'albums_delete_checkbox_confirm_plural',
  'albums_delete_btn_empty',
  'albums_delete_btn_keep',
  'albums_delete_btn_trash',
  'albums_delete_btn_perm',
  'albums_delete_back_btn',
  'albums_delete_toast_trash',
  'albums_delete_toast_trash_1',
  'albums_delete_toast_discard',
  'albums_delete_toast_discard_1',
  'albums_delete_toast_keep'
];

let hasErrors = false;

console.log('Checking all 10 languages for all ' + requiredKeys.length + ' delete Step 2 keys...');
languages.forEach(lang => {
  const dict = translations[lang];
  if (!dict) {
    console.error(`Missing language dictionary: ${lang}`);
    hasErrors = true;
    return;
  }
  const missing = requiredKeys.filter(k => !dict[k]);
  if (missing.length > 0) {
    console.error(`Language ${lang} is missing keys:`, missing);
    hasErrors = true;
  } else {
    console.log(`[PASS] ${lang} has all ${requiredKeys.length} keys.`);
  }
});

if (hasErrors) {
  process.exit(1);
}

// Sample rendering test for Hindi and Tamil for the exact screen in user's screenshot
console.log('\n--- Simulation: Permanent Destruction Warning for "Trip" (1 photo) ---');
['en', 'hi', 'ta', 'te', 'bn'].forEach(lang => {
  sandbox.window.setAppLanguage(lang, false);
  const t = sandbox.window.t;
  console.log(`\n[${lang.toUpperCase()}]`);
  console.log('Eyebrow:', t('albums_delete_step2_eyebrow_perm'));
  console.log('Title:  ', t('albums_delete_step2_title_perm'));
  console.log('Row 1:  ', t('albums_delete_row_album_to_delete'), 'Trip');
  console.log('Row 2:  ', t('albums_delete_row_permanent_destruction'), t('albums_delete_val_destruction_singular'));
  console.log('Row 3:  ', t('albums_delete_row_recovery_status'), t('albums_delete_val_cannot_undo'));
  console.log('Warning:', t('albums_delete_desc_perm_warn_singular'));
  console.log('Checkbox:', t('albums_delete_checkbox_confirm_singular'));
  console.log('Back:   ', t('albums_delete_back_btn'));
  console.log('Confirm:', t('albums_delete_btn_perm'));
});

console.log('\nAll tests passed successfully!');
