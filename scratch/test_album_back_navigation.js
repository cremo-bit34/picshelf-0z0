const fs = require('fs');
const vm = require('vm');

console.log('Testing Album Back Navigation Implementation...');

// 1. Verify i18n
const i18nContent = fs.readFileSync('web/i18n.js', 'utf8');
const sandbox = {
  window: {},
  document: { querySelectorAll: () => [], getElementById: () => null },
  localStorage: { getItem: () => null, setItem: () => {} }
};
vm.createContext(sandbox);
vm.runInContext(i18nContent, sandbox);

const keysToCheck = [
  'album_back_to_albums',
  'album_back_btn',
  'album_banner_add_photos',
  'album_viewing_toast',
  'favorites_viewing_toast'
];

const langs = ['en', 'hi', 'bn', 'te', 'ta', 'mr', 'gu', 'kn', 'ml', 'pa'];
let errors = 0;

langs.forEach(lang => {
  const dict = sandbox.window.I18N_TRANSLATIONS[lang];
  if (!dict) {
    console.error(`Missing language ${lang}`);
    errors++;
    return;
  }
  keysToCheck.forEach(k => {
    if (!dict[k]) {
      console.error(`[FAIL] ${lang} is missing ${k}`);
      errors++;
    }
  });
});

if (errors === 0) {
  console.log(`[PASS] All 10 languages contain all ${keysToCheck.length} required album back keys!`);
}

// 2. Verify index.html contains the new buttons
const htmlContent = fs.readFileSync('web/index.html', 'utf8');
const htmlChecks = ['albumBannerBackBtn', 'albumQuickBackBtn', 'favoritesBackBtn'];
htmlChecks.forEach(id => {
  if (htmlContent.includes(`id="${id}"`)) {
    console.log(`[PASS] index.html includes #${id}`);
  } else {
    console.error(`[FAIL] index.html is missing #${id}`);
    errors++;
  }
});

// 3. Verify style.css contains styles
const cssContent = fs.readFileSync('web/style.css', 'utf8');
const cssClasses = ['.album-banner-back-btn', '.album-quick-back-btn', '.album-card-highlight-return', '.album-banner-left'];
cssClasses.forEach(cls => {
  if (cssContent.includes(cls)) {
    console.log(`[PASS] style.css includes ${cls}`);
  } else {
    console.error(`[FAIL] style.css is missing ${cls}`);
    errors++;
  }
});

// 4. Verify app.js contains the navigation functions
const appContent = fs.readFileSync('web/app.js', 'utf8');
const jsChecks = ['function openAlbumInGallery', 'function exitAlbumView', 'function openFavoritesFromAlbum', 'function exitFavoritesToAlbums'];
jsChecks.forEach(fn => {
  if (appContent.includes(fn)) {
    console.log(`[PASS] app.js includes ${fn}`);
  } else {
    console.error(`[FAIL] app.js is missing ${fn}`);
    errors++;
  }
});

if (errors === 0) {
  console.log('\n--- Simulation output in Hindi (matching user screenshot) ---');
  sandbox.window.setAppLanguage('hi', false);
  const t = sandbox.window.t;
  console.log('Banner Back Button Title:', t('album_back_to_albums'));
  console.log('Banner Back Button Text: ', t('album_back_btn'));
  console.log('Banner Add Photos Button:', t('album_banner_add_photos'));
  console.log('Viewing Toast:           ', t('album_viewing_toast', { name: 'Birthday' }));
  console.log('\nAll checks PASSED successfully!');
} else {
  console.error(`\nFailed with ${errors} error(s)!`);
  process.exit(1);
}
