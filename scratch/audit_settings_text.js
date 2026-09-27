const fs = require('fs');
const code = fs.readFileSync('web/i18n.js', 'utf8');
const vm = require('vm');
const sandbox = { window: {}, document: { querySelectorAll: () => [] }, localStorage: { getItem: () => null, setItem: () => {} } };
vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const dict = sandbox.window.I18N_TRANSLATIONS;

const keywords = ['cloud', 'sync', 'server', 'online', 'remote', 'hyperlink', 'url', 'web', 'upload to', 'drive'];
const indicKeywords = ['क्लाउड', 'ক্লাউড', 'క్లౌడ్', 'கிளவுட்', 'કલાઉડ', 'ക്ലൗഡ്', 'ਕਲਾਊਡ', 'ಕ್ಲೌಡ್'];

console.log("=== AUDITING SETTINGS STRINGS IN ALL LANGUAGES ===");
for (const lang of Object.keys(dict)) {
  for (const [k, v] of Object.entries(dict[lang])) {
    if (k.startsWith('settings_') && typeof v === 'string') {
      const lower = v.toLowerCase();
      const hasEngMatch = keywords.some(kw => lower.includes(kw));
      const hasIndicMatch = indicKeywords.some(kw => v.includes(kw));
      if (hasEngMatch || hasIndicMatch) {
        console.log(`[${lang}] ${k} => "${v}"`);
      }
    }
  }
}
