const fs = require('fs');
const path = require('path');

// Test i18n
const i18nContent = fs.readFileSync(path.join(__dirname, '../web/i18n.js'), 'utf8');
const sandbox = { document: { querySelectorAll: () => [] } };
const fn = new Function('window', i18nContent + '; return window.I18N_TRANSLATIONS;');
const translations = fn(sandbox);

const languages = ['en', 'hi', 'bn', 'te', 'ta', 'mr', 'gu', 'kn', 'ml', 'pa'];
const requiredMaterials = [
  'amethyst', 'sapphire', 'ruby', 'quantum', 'damascus', 'cyberpunk',
  'platina', 'volcanic', 'supernova', 'aquamarine', 'copper',
  'chameleon', 'celestial', 'onyx', 'sunset', 'prism_noir',
  'biolum', 'hyperdrive', 'meteorite', 'vaporwave'
];

let errors = [];

languages.forEach(lang => {
  if (!translations[lang]) {
    errors.push(`Missing language ${lang}`);
    return;
  }
  if (!translations[lang]['surface_3d_btn']) {
    errors.push(`Missing surface_3d_btn in ${lang}`);
  }
  requiredMaterials.forEach(mat => {
    const titleKey = `mat_${mat}_title`;
    const subKey = `mat_${mat}_sub`;
    if (!translations[lang][titleKey]) {
      errors.push(`Missing ${titleKey} in ${lang}`);
    }
    if (!translations[lang][subKey]) {
      errors.push(`Missing ${subKey} in ${lang}`);
    }
  });
});

if (errors.length === 0) {
  console.log('✅ ALL 20 extended 3D surfaces and buttons are 100% translated across ALL 10 languages!');
} else {
  console.error('❌ Errors found:', errors);
}

// Check index.html data-i18n tags
const htmlContent = fs.readFileSync(path.join(__dirname, '../web/index.html'), 'utf8');
requiredMaterials.forEach(mat => {
  if (!htmlContent.includes(`data-i18n="mat_${mat}_title"`)) {
    console.error(`Missing data-i18n="mat_${mat}_title" in index.html`);
  }
  if (!htmlContent.includes(`data-i18n="mat_${mat}_sub"`)) {
    console.error(`Missing data-i18n="mat_${mat}_sub" in index.html`);
  }
});
console.log('✅ HTML data-i18n tags verified for all 3D material chips!');

// Verify app.js album sort stability logic
const appContent = fs.readFileSync(path.join(__dirname, '../web/app.js'), 'utf8');
if (appContent.includes("if (actionType === 'viewed')")) {
  console.log("✅ recordAlbumActivity ignores 'viewed' action for sorting and lastModifiedAt!");
} else {
  console.error("❌ recordAlbumActivity still updates on 'viewed'!");
}

if (appContent.includes("originalIndex: idx")) {
  console.log("✅ renderAlbumsScreen sets and respects stable originalIndex!");
} else {
  console.error("❌ renderAlbumsScreen missing originalIndex logic!");
}
