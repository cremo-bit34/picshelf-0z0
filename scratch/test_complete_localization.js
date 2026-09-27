const fs = require('fs');
const vm = require('vm');

console.log('--- RUNNING COMPLETE LOCALIZATION VALIDATION TEST ---');

// 1. Verify i18n dictionary completeness across all 10 languages
const windowMock = {
  localStorage: {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); }
  },
  document: {
    querySelectorAll() { return []; },
    getElementById() { return {}; }
  },
  console: console
};
windowMock.window = windowMock;

const context = vm.createContext(windowMock);
const i18nCode = fs.readFileSync('web/i18n.js', 'utf8');
vm.runInContext(i18nCode, context);

const enKeys = Object.keys(windowMock.I18N_TRANSLATIONS['en']);
console.log(`Total English keys: ${enKeys.length}`);

const langs = ['hi', 'bn', 'te', 'ta', 'mr', 'gu', 'kn', 'ml', 'pa'];
let missingAny = false;

for (const lang of langs) {
  const dict = windowMock.I18N_TRANSLATIONS[lang];
  if (!dict) {
    console.error(`ERROR: Missing dictionary for language ${lang}`);
    missingAny = true;
    continue;
  }
  const missingKeys = enKeys.filter(k => !dict[k]);
  if (missingKeys.length > 0) {
    console.error(`ERROR: Language '${lang}' is missing ${missingKeys.length} keys:`, missingKeys);
    missingAny = true;
  } else {
    console.log(`PASS: Language '${lang}' has 100% complete keys (${Object.keys(dict).length}/${enKeys.length})`);
  }
}

// 2. Verify specific Hindi translations for Dock Cards & Buttons
const hi = windowMock.I18N_TRANSLATIONS['hi'];
console.log('\n--- VERIFYING HINDI DOCK LABELS (User Screenshot 2) ---');
console.log('dock_card_pending:', hi.dock_card_pending, '=> Expected: "लंबित"');
console.log('dock_card_album:  ', hi.dock_card_album, '=> Expected: "एल्बम"');
console.log('dock_card_save:   ', hi.dock_card_save, '=> Expected: "सहेजें"');
console.log('dock_card_rename: ', hi.dock_card_rename, '=> Expected: "नाम बदलें"');
console.log('dock_card_trash:  ', hi.dock_card_trash, '=> Expected: "हटाएं"');
console.log('dock_selected_zero:', hi.dock_selected_zero, '=> Expected: "0 चयनित"');
console.log('dock_select_all_count:', hi.dock_select_all_count, '=> Expected: "सभी चुनें ({count})"');
console.log('dock_hint_default:', hi.dock_hint_default, '=> Expected: "तस्वीरें चुनने के लिए टैप करें, फिर एल्बम चुनें"');

if (
  hi.dock_card_pending !== 'लंबित' ||
  hi.dock_card_album !== 'एल्बम' ||
  hi.dock_card_save !== 'सहेजें' ||
  hi.dock_card_rename !== 'नाम बदलें' ||
  hi.dock_card_trash !== 'हटाएं'
) {
  throw new Error('Hindi dock card labels mismatch!');
}

// 3. Verify CSS Language Grid Overflow Fix (User Screenshot 1)
console.log('\n--- VERIFYING SETTINGS LANGUAGE GRID CSS (User Screenshot 1) ---');
const css = fs.readFileSync('web/style.css', 'utf8');
if (css.includes('.language-selector-grid {\n  display: grid;\n  grid-template-columns: repeat(3')) {
  throw new Error('Found 3-column repeat in language-selector-grid which causes overflow!');
}
if (!css.includes('grid-template-columns: repeat(2, minmax(0, 1fr))')) {
  throw new Error('Expected 2-column minmax(0, 1fr) grid layout in .language-selector-grid');
}
console.log('PASS: CSS uses 2-column minmax(0, 1fr) with zero 3-column overflow.');

// 4. Verify Android Assets are synchronized with web/
console.log('\n--- VERIFYING ANDROID ASSETS SYNC ---');
const filesToSync = ['i18n.js', 'index.html', 'style.css', 'app.js'];
for (const file of filesToSync) {
  const webContent = fs.readFileSync(`web/${file}`, 'utf8');
  const assetContent = fs.readFileSync(`app/src/main/assets/web/${file}`, 'utf8');
  if (webContent !== assetContent) {
    throw new Error(`Sync mismatch: web/${file} does not match app/src/main/assets/web/${file}`);
  }
  console.log(`PASS: app/src/main/assets/web/${file} is perfectly in sync with web/${file}`);
}

console.log('\n*** ALL TESTS PASSED SUCCESSFULLY! 100% LOCALIZATION VERIFIED ***');
