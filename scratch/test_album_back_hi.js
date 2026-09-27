const fs = require('fs');
const vm = require('vm');

const i18nContent = fs.readFileSync('web/i18n.js', 'utf8');
const storage = {};
const sandbox = {
  window: {},
  document: { querySelectorAll: () => [], getElementById: () => null },
  localStorage: {
    getItem: (k) => storage[k] || null,
    setItem: (k, v) => { storage[k] = v; }
  }
};
vm.createContext(sandbox);
vm.runInContext(i18nContent, sandbox);

console.log('--- Simulation output in Hindi (matching user screenshot) ---');
sandbox.window.setAppLanguage('hi', false);
const t = sandbox.window.t;
console.log('Banner Back Button Title:', t('album_back_to_albums'));
console.log('Banner Back Button Text: ', t('album_back_btn'));
console.log('Banner Add Photos Button:', t('album_banner_add_photos'));
console.log('Viewing Toast:           ', t('album_viewing_toast', { name: 'Birthday' }));
