const fs = require('fs');
const code = fs.readFileSync('web/app.js', 'utf8');

const startIdx = code.indexOf('function renderFavorites()');
const endIdx = code.indexOf('function renderTrash()');
const favSection = code.substring(startIdx, endIdx);

const checks = {
  hasCrop: favSection.includes("openCropEditorModal"),
  hasRename: favSection.includes("openRenamePhotoModal"),
  hasBtnLabel: favSection.includes("card-btn-label"),
  hasTapRename: favSection.includes("Tap to rename:"),
  hasTagTooltip: favSection.includes("toggleTagsTooltip")
};

console.log('Favorites Card Parity Checks:', JSON.stringify(checks, null, 2));

for (const [k, v] of Object.entries(checks)) {
  if (!v) {
    console.error(`FAILED CHECK: ${k}`);
    process.exit(1);
  }
}

console.log('SUCCESS: All 5 parity checks passed!');
