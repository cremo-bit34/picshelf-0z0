const fs = require('fs');

// 1. Verify CSS
const css = fs.readFileSync('web/style.css', 'utf8');
const hasDockGrid = css.includes('grid-template-columns: repeat(4, minmax(0, 1fr))');
const hasDockBoxSizing = css.includes('box-sizing: border-box') && css.includes('.dock-card-actions');
const hasDockLabelMedia = css.includes('.btn-dock-action .dock-btn-label');

// 2. Verify Kotlin Bridge
const kt = fs.readFileSync('app/src/main/java/com/example/MainActivity.kt', 'utf8');
const hasSharePhoto = kt.includes('fun sharePhoto(base64DataUrl: String, title: String)');
const hasShareMulti = kt.includes('fun shareMultiplePhotos(photosJson: String, albumTitle: String)');
const hasDownloadPhoto = kt.includes('fun downloadPhoto(base64DataUrl: String, fileName: String)');
const hasDownloadZip = kt.includes('fun downloadZip(base64ZipData: String, zipFileName: String)');
const hasMediaStoreQ = kt.includes('MediaStore.Images.Media.RELATIVE_PATH');
const hasPicturesFolder = kt.includes('Pictures/AuraPhotoOrganizer');

// 3. Verify JS Bridge calls
const js = fs.readFileSync('web/app.js', 'utf8');
const hasJsSharePhoto = js.includes('AndroidApp.sharePhoto');
const hasJsShareMulti = js.includes('AndroidApp.shareMultiplePhotos');
const hasJsDownloadPhoto = js.includes('AndroidApp.downloadPhoto');
const hasJsDownloadZip = js.includes('AndroidApp.downloadZip');
const hasDockBtnLabel = js.includes('dock-btn-label');

const results = {
  css: { hasDockGrid, hasDockBoxSizing, hasDockLabelMedia },
  kotlin: { hasSharePhoto, hasShareMulti, hasDownloadPhoto, hasDownloadZip, hasMediaStoreQ, hasPicturesFolder },
  js: { hasJsSharePhoto, hasJsShareMulti, hasJsDownloadPhoto, hasJsDownloadZip, hasDockBtnLabel }
};

console.log('Verification Results:', JSON.stringify(results, null, 2));

for (const [section, checks] of Object.entries(results)) {
  for (const [key, val] of Object.entries(checks)) {
    if (!val) {
      console.error(`FAILED: ${section}.${key}`);
      process.exit(1);
    }
  }
}

console.log('ALL VERIFICATIONS PASSED 100%!');
