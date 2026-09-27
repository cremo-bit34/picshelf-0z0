const fs = require('fs');
const code = fs.readFileSync('web/i18n.js', 'utf8');
const vm = require('vm');
const sandbox = { window: {}, document: { querySelectorAll: () => [] }, localStorage: { getItem: () => null, setItem: () => {} } };
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const dict = sandbox.window.I18N_TRANSLATIONS;

console.log("=== AUDITING ALL BUTTON TEXTS ACROSS ALL 10 LANGUAGES ===");
const btnKeys = new Set();
for (const [k, v] of Object.entries(dict.en)) {
  if (k.includes('btn') || k.includes('button') || k.startsWith('dock_btn_') || k.startsWith('gallery_btn_') || k.includes('cancel') || k.includes('apply') || k.includes('save') || k.includes('confirm')) {
    btnKeys.add(k);
  }
}

const longEntries = [];

for (const lang of Object.keys(dict)) {
  for (const k of btnKeys) {
    const val = dict[lang][k];
    if (val && typeof val === 'string') {
      if (val.length > 25) {
        longEntries.push({ lang, key: k, len: val.length, text: val });
      }
    }
  }
}

console.log(`Found ${btnKeys.size} button keys.`);
console.log(`Found ${longEntries.length} entries with length > 25 characters:`);
longEntries.sort((a, b) => b.len - a.len);
for (const e of longEntries) {
  console.log(`[${e.lang}] (${e.len} ch) ${e.key} => "${e.text}"`);
}
