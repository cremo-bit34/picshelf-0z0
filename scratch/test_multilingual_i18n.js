const fs = require('fs');
const vm = require('vm');

// Mock browser window environment
const domElements = {};
function createMockElement(id, tag = 'div') {
  return {
    id,
    tagName: tag.toUpperCase(),
    textContent: '',
    innerHTML: '',
    className: '',
    classList: {
      add: function(c) { this._classes.add(c); },
      remove: function(c) { this._classes.delete(c); },
      toggle: function(c, val) { if (val) this.add(c); else this.remove(c); },
      contains: function(c) { return this._classes.has(c); },
      _classes: new Set()
    },
    style: {},
    dataset: {},
    setAttribute: function(k, v) { this[k] = v; },
    getAttribute: function(k) { return this[k] || null; }
  };
}

const windowMock = {
  localStorage: {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); }
  },
  document: {
    querySelectorAll(selector) {
      return [];
    },
    getElementById(id) {
      if (!domElements[id]) domElements[id] = createMockElement(id);
      return domElements[id];
    }
  },
  console: console
};
windowMock.window = windowMock;

const context = vm.createContext(windowMock);
const i18nCode = fs.readFileSync('web/i18n.js', 'utf8');
vm.runInContext(i18nCode, context);

console.log('Testing Languages list:');
console.log(windowMock.I18N_LANGUAGES.map(l => `${l.code}: ${l.native} (${l.name})`));

const requiredLangs = ['en', 'hi', 'bn', 'te', 'ta', 'mr', 'gu', 'kn', 'ml', 'pa'];
for (const lang of requiredLangs) {
  if (!windowMock.I18N_TRANSLATIONS[lang]) {
    throw new Error(`Missing language: ${lang}`);
  }
}
console.log('All 10 required Indian regional + English languages present!');

// Test translation function
console.log('\n--- Sample Translations for Filter & Settings ---');
['en', 'hi', 'bn', 'te', 'ta', 'mr', 'gu', 'kn', 'ml', 'pa'].forEach(code => {
  windowMock.setAppLanguage(code, false);
  console.log(`[${code}] Filter date: "${windowMock.t('gallery_date_range')}" | All moments: "${windowMock.t('gallery_all_moments')}" | Language Section: "${windowMock.t('settings_language_section')}"`);
});

console.log('\nAll i18n tests completed successfully!');
