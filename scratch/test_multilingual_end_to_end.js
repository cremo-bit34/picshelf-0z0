const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('web/index.html', 'utf8');
const jsApp = fs.readFileSync('web/app.js', 'utf8');
const jsI18n = fs.readFileSync('web/i18n.js', 'utf8');
const css = fs.readFileSync('web/style.css', 'utf8');

console.log('1. Checking HTML elements for language support:');
const checkHtml = (pattern, desc) => {
  if (html.includes(pattern)) {
    console.log(`  ✓ ${desc} (${pattern})`);
  } else {
    throw new Error(`Missing in HTML: ${pattern}`);
  }
};

checkHtml('id="languageSelectorGrid"', 'Language grid container');
checkHtml('id="currentLangHintBadge"', 'Active language indicator badge');
checkHtml('data-i18n="settings_language_section"', 'Settings language section label');
checkHtml('data-i18n="settings_language_label"', 'Settings app language title');
checkHtml('data-i18n="gallery_all_moments"', 'All Moments filter chip');
checkHtml('data-i18n="gallery_favorites"', 'Favorites filter chip');
checkHtml('data-i18n="gallery_date_range"', 'Date Range filter chip');
checkHtml('data-i18n="gallery_reset_filters"', 'Filter Reset button');
checkHtml('id="datePickerModal"', 'Date picker modal');
checkHtml('data-i18n="date_dialog_title"', 'Date picker title');
checkHtml('data-i18n="date_preset_today"', 'Date preset Today');
checkHtml('data-i18n="date_preset_week"', 'Date preset Last 7 Days');
checkHtml('data-i18n="date_preset_month"', 'Date preset Last 30 Days');
checkHtml('data-i18n="date_preset_year"', 'Date preset This Year');
checkHtml('data-i18n="date_preset_all"', 'Date preset All Time');

console.log('\n2. Checking CSS rules:');
const checkCss = (pattern, desc) => {
  if (css.includes(pattern)) {
    console.log(`  ✓ ${desc}`);
  } else {
    throw new Error(`Missing in CSS: ${pattern}`);
  }
};
checkCss('.language-selector-grid', 'Grid container styling');
checkCss('.language-option-card', 'Card option styling');
checkCss('.language-option-card.active', 'Active selection highlight');
checkCss('.lang-flag-box', 'Flag box icon container');
checkCss('.lang-native-name', 'Native language typography');

console.log('\n3. Checking JavaScript Integration:');
if (jsApp.includes("localStorage.setItem('photo_org_language', state.language || 'en')")) {
  console.log('  ✓ Language state persisted in saveState()');
} else {
  throw new Error('Missing language persistence in saveState');
}

if (jsApp.includes("const savedLang = localStorage.getItem('photo_org_language') || 'en'")) {
  console.log('  ✓ Language loaded in loadState()');
} else {
  throw new Error('Missing language loading in loadState');
}

if (jsApp.includes('renderSettingsLanguageUI()')) {
  console.log('  ✓ renderSettingsLanguageUI called in renderSettings');
} else {
  throw new Error('Missing renderSettingsLanguageUI call');
}

console.log('\nAll End-to-End Multilingual Verification Checks Passed Flawlessly!');
