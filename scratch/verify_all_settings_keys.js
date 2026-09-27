const fs = require('fs');
const code = fs.readFileSync('web/i18n.js', 'utf8');
const vm = require('vm');
const sandbox = { window: {}, document: { querySelectorAll: () => [] }, localStorage: { getItem: () => null, setItem: () => {} } };
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const dict = sandbox.window.I18N_TRANSLATIONS;
const enKeys = Object.keys(dict.en).filter(k => k.startsWith('settings_'));
let allOk = true;
for (const lang of Object.keys(dict)) {
  let missing = [];
  for (const k of enKeys) {
    if (!dict[lang][k]) missing.push(k);
  }
  if (missing.length > 0) {
    console.log(`[${lang}] Missing keys: ${missing.join(', ')}`);
    allOk = false;
  } else {
    console.log(`[${lang}] All ${enKeys.length} settings keys present and verified!`);
  }
}
if (allOk) {
  console.log("100% PERFECT: All settings keys verified across all 10 languages!");
}
