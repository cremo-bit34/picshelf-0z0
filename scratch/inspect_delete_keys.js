const fs = require('fs');
const content = fs.readFileSync('web/i18n.js', 'utf8');

const vm = require('vm');
const sandbox = { window: {}, localStorage: { setItem: () => {}, getItem: () => null }, document: { querySelectorAll: () => [] } };
vm.createContext(sandbox);
vm.runInContext(content, sandbox);

const en = sandbox.window.I18N_TRANSLATIONS ? sandbox.window.I18N_TRANSLATIONS.en : null;
if (!en) {
  console.log('Could not find I18N_TRANSLATIONS');
} else {
  const deleteKeys = Object.keys(en).filter(k => k.toLowerCase().includes('delete') || k.toLowerCase().includes('album'));
  console.log('Matching keys in en (' + deleteKeys.length + '):');
  deleteKeys.forEach(k => console.log(`  ${k}: "${en[k]}"`));
}
