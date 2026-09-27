const fs = require('fs');
const vm = require('vm');

console.log('--- TESTING DYNAMIC LANGUAGE SWITCHING & COLOR PALETTE LOCALIZATION ---');

const domElements = {};
function createMockElement(id, tag = 'div') {
  return {
    id,
    tagName: tag.toUpperCase(),
    textContent: '',
    innerHTML: '',
    className: '',
    style: {},
    classList: {
      add(c) { this._set.add(c); },
      remove(c) { this._set.delete(c); },
      toggle(c, v) { if (v) this._set.add(c); else this._set.delete(c); },
      contains(c) { return this._set.has(c); },
      _set: new Set()
    },
    querySelectorAll() { return []; },
    querySelector() { return null; },
    setAttribute(k, v) { this[k] = v; },
    getAttribute(k) { return this[k] || null; }
  };
}

const windowMock = {
  localStorage: {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); }
  },
  document: {
    querySelectorAll() { return []; },
    getElementById(id) {
      if (!domElements[id]) domElements[id] = createMockElement(id);
      return domElements[id];
    },
    addEventListener() {},
    documentElement: { style: { setProperty() {} } }
  },
  console: console
};
windowMock.window = windowMock;

const context = vm.createContext(windowMock);
const i18nCode = fs.readFileSync('web/i18n.js', 'utf8');
vm.runInContext(i18nCode, context);
const appCode = fs.readFileSync('web/app.js', 'utf8');
vm.runInContext(appCode, context);

// 1. Test language switching updates state & selection highlight position
console.log('\n1. Testing Language Selection Highlighting:');
const testLangs = ['en', 'hi', 'bn', 'te', 'ta', 'mr', 'gu', 'kn', 'ml', 'pa'];

for (const lang of testLangs) {
  windowMock.setAppLanguage(lang, false);
  if (windowMock.state.language !== lang) {
    throw new Error(`Failed to update state.language for ${lang}`);
  }
  windowMock.renderSettingsLanguageUI();
  const grid = domElements['languageSelectorGrid'];
  if (!grid.innerHTML.includes(`language-option-card active"\n        onclick="setAppLanguage('${lang}')"`)) {
    throw new Error(`Highlighted selection card did not move to ${lang}!`);
  }
  console.log(`PASS: Language switched to '${lang}', active highlighted card matches correctly!`);
}

// 2. Test Palette localization in Hindi
console.log('\n2. Testing Palette Studio & Color Section in Hindi:');
windowMock.setAppLanguage('hi', false);
const hiPaletteHtml = windowMock.buildCategorizedPaletteHtml({
  presetColors: ['#f43f5e'],
  selectedColor: '#f43f5e',
  savedColors: [],
  onSelectFn: 'setAppAccentColor',
  customInputId: 'customIn',
  customSwatchId: 'customSw'
});

if (!hiPaletteHtml.includes('क्युरेट किए गए प्रीसेट')) {
  throw new Error('Curated presets not translated to Hindi in buildCategorizedPaletteHtml');
}
if (!hiPaletteHtml.includes('आपके रंग पैलेट')) {
  throw new Error('Your Color Palettes not translated to Hindi in buildCategorizedPaletteHtml');
}
if (!hiPaletteHtml.includes('सहेजे गए एवं कस्टम')) {
  throw new Error('Saved & Custom not translated to Hindi in buildCategorizedPaletteHtml');
}
if (!hiPaletteHtml.includes('कलर स्टूडियो खोलें')) {
  throw new Error('Open Color Studio title not translated to Hindi in buildCategorizedPaletteHtml');
}
console.log('PASS: Hindi Palette HTML includes:');
console.log(' - क्युरेट किए गए प्रीसेट');
console.log(' - आपके रंग पैलेट');
console.log(' - सहेजे गए एवं कस्टम');
console.log(' - कलर स्टूडियो खोलें');

// 3. Test Custom Color Modal & Tag Manager in index.html
console.log('\n3. Testing customColorPickerModal & renameTagModal data-i18n attributes:');
const html = fs.readFileSync('web/index.html', 'utf8');
const requiredAttrs = [
  'data-i18n="color_modal_eyebrow"',
  'data-i18n="color_modal_title"',
  'data-i18n="color_modal_desc"',
  'data-i18n="color_modal_compare"',
  'data-i18n="color_modal_spectrum_label"',
  'data-i18n="color_modal_spectrum_hint"',
  'data-i18n="color_modal_hex_label"',
  'data-i18n="color_modal_tones_label"',
  'data-i18n="color_modal_apply"',
  'data-i18n="tags_create_title"',
  'data-i18n-placeholder="tags_input_placeholder"',
  'data-i18n="tags_create_btn"',
  'data-i18n="tags_palette_color"',
  'data-i18n="tags_rename_or_delete"',
  'data-i18n="tags_edit_eyebrow"',
  'data-i18n="tags_edit_title"',
  'data-i18n="tags_edit_name_label"',
  'data-i18n="tags_edit_palette_label"',
  'data-i18n="tags_edit_save_btn"'
];

for (const attr of requiredAttrs) {
  if (!html.includes(attr)) {
    throw new Error(`Missing required attribute in index.html: ${attr}`);
  }
}
console.log(`PASS: All ${requiredAttrs.length} data-i18n attributes verified in index.html!`);

console.log('\n*** ALL TESTS PASSED WITH 100% SUCCESS! ***');
