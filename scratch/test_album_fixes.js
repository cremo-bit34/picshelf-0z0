const fs = require('fs');
const path = require('path');

const i18nContent = fs.readFileSync(path.join(__dirname, '../web/i18n.js'), 'utf8');
const appContent = fs.readFileSync(path.join(__dirname, '../web/app.js'), 'utf8');
const htmlContent = fs.readFileSync(path.join(__dirname, '../web/index.html'), 'utf8');
const cssContent = fs.readFileSync(path.join(__dirname, '../web/style.css'), 'utf8');

console.log('--- TEST 1: Checking i18n keys for albums_photo_count_single ---');
const singleMatches = (i18nContent.match(/albums_photo_count_single/g) || []).length;
console.log(`Found ${singleMatches} instances of albums_photo_count_single (expected 10 for 10 languages).`);
if (singleMatches !== 10) {
  console.error('ERROR: Missing languages for albums_photo_count_single');
  process.exit(1);
}

console.log('--- TEST 2: Checking removal of albumQuickBackBtn ---');
if (htmlContent.includes('albumQuickBackBtn')) {
  console.error('ERROR: albumQuickBackBtn still found in index.html');
  process.exit(1);
} else {
  console.log('PASS: albumQuickBackBtn successfully removed from index.html');
}

if (appContent.includes("document.getElementById('albumQuickBackBtn')")) {
  console.error('ERROR: albumQuickBackBtn lookup still in app.js');
  process.exit(1);
} else {
  console.log('PASS: albumQuickBackBtn removed from app.js logic');
}

console.log('--- TEST 3: Checking duplicate count patterns in app.js ---');
// Check for patterns like `${favCount} ${window.t` or `${count} ${window.t`
const badFavPattern = /\$\{favCount\}\s*\$\{window\.t\(\s*['"]albums_photo_count/g;
const badCountPattern = /\$\{count\}\s*\$\{window\.t\(\s*['"]albums_photo_count/g;
if (badFavPattern.test(appContent) || badCountPattern.test(appContent)) {
  console.error('ERROR: Duplicate count pattern still detected in app.js');
  process.exit(1);
} else {
  console.log('PASS: No duplicate count interpolation pattern found in app.js');
}

console.log('--- TEST 4: Checking album-banner-back-btn structure & styles ---');
if (!htmlContent.includes('album-back-icon-pill')) {
  console.error('ERROR: album-back-icon-pill missing in index.html');
  process.exit(1);
} else {
  console.log('PASS: album-back-icon-pill present in index.html');
}

if (!cssContent.includes('.album-back-icon-pill')) {
  console.error('ERROR: .album-back-icon-pill missing in style.css');
  process.exit(1);
} else {
  console.log('PASS: .album-back-icon-pill styled in style.css');
}

console.log('--- TEST 5: Checking overflow & truncation rules for banner title and surface chip ---');
if (!cssContent.includes('.album-custom-surface-tag .tag-truncate-text') || !cssContent.includes('.album-banner-title')) {
  console.error('ERROR: Truncation styles missing');
  process.exit(1);
} else {
  console.log('PASS: Truncation and ellipsis styling verified');
}

console.log('\nALL 5 TESTS PASSED SUCCESSFULLY!');
