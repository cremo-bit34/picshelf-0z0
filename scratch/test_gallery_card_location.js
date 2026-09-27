const fs = require('fs');

console.log('--- Testing Gallery Card Location Display Toggle ---');

const appJs = fs.readFileSync('web/app.js', 'utf8');

// Check that state.galleryShowLocationBadge is false by default
if (!appJs.includes("galleryShowLocationBadge: (function() {") || !appJs.includes("return false;")) {
  throw new Error('galleryShowLocationBadge is not default false!');
}
console.log('1. Confirmed galleryShowLocationBadge defaults to false.');

// Check that renderGallery checks state.galleryShowLocationBadge === true
if (!appJs.includes("state.galleryShowLocationBadge === true && photo.location")) {
  throw new Error('renderGallery does not check state.galleryShowLocationBadge === true!');
}
console.log('2. Confirmed renderGallery strictly checks state.galleryShowLocationBadge === true.');

// Check that onNativePhotosImported has tags: [] without auto-tagging
if (appJs.includes("initialTags.push(loc.city)")) {
  throw new Error('Found lingering initialTags.push(loc.city)!');
}
console.log('3. Confirmed onNativePhotosImported does not inject auto location tags.');

// Check that index.html contains galleryLocationBadgeToggle
const indexHtml = fs.readFileSync('web/index.html', 'utf8');
if (!indexHtml.includes('id="galleryLocationBadgeToggle"')) {
  throw new Error('index.html missing galleryLocationBadgeToggle!');
}
console.log('4. Confirmed index.html contains galleryLocationBadgeToggle.');

console.log('--- ALL CHECKS PASSED: Location is strictly hidden from gallery cards by default! ---');
