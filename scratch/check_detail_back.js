const fs = require('fs');
const content = fs.readFileSync('web/i18n.js', 'utf8');

const vm = require('vm');
const sandbox = { window: {}, localStorage: { setItem: () => {}, getItem: () => null }, document: { querySelectorAll: () => [] } };
vm.createContext(sandbox);
vm.runInContext(content, sandbox);

const t = sandbox.window.I18N_TRANSLATIONS;
for (const [lang, dict] of Object.entries(t)) {
  console.log(`${lang}: detail_back = "${dict.detail_back}"`);
}
