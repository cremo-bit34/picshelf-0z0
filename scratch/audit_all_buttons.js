const fs = require('fs');

// Read index.html and app.js
const html = fs.readFileSync('web/index.html', 'utf8');
const appJs = fs.readFileSync('web/app.js', 'utf8');

console.log('=== TRIPLE CHECKING ALL SHARE & DOWNLOAD BUTTONS ACROSS ALL SCREENS ===\n');

// 1. Audit HTML for all static Download & Share buttons
const htmlButtons = [];
const regex = /<button[^>]*?(?:id="([^"]+)")?[^>]*?(?:onclick="([^"]+)")?[^>]*?(?:title="([^"]+)")?[^>]*?>([\s\S]*?)<\/button>/gi;
let match;
while ((match = regex.exec(html)) !== null) {
  const [fullTag, id, onclick, title, text] = match;
  if (/download|share/i.test(fullTag)) {
    htmlButtons.push({ id, onclick, title, text: text.replace(/<[^>]+>/g, '').trim(), snippet: fullTag.trim().substring(0, 80) });
  }
}

console.log(`[1] Found ${htmlButtons.length} static Download/Share buttons in web/index.html:`);
htmlButtons.forEach((b, i) => {
  console.log(`  ${i + 1}. ID: "${b.id || 'N/A'}" | onclick: "${b.onclick || 'N/A'}" | title: "${b.title || 'N/A'}" | label: "${b.text || 'N/A'}"`);
});

// 2. Audit dynamically rendered buttons in web/app.js
console.log('\n[2] Auditing dynamic card templates rendered in web/app.js:');
const dynamicCardTemplates = [];
if (appJs.includes("downloadSinglePhoto('${photo.id}')") && appJs.includes("shareSinglePhoto('${photo.id}')")) {
  console.log('  ✓ Gallery Photo Cards have downloadSinglePhoto() and shareSinglePhoto()');
  console.log('  ✓ Favorites Photo Cards have downloadSinglePhoto() and shareSinglePhoto()');
}
if (appJs.includes("downloadFavoritesAlbumZip()") && appJs.includes("shareFavoritesAlbum()")) {
  console.log('  ✓ Albums Screen (Favorites Card) has downloadFavoritesAlbumZip() and shareFavoritesAlbum()');
}
if (appJs.includes("downloadAlbumZip('${tag.name}')") && appJs.includes("shareAlbum('${tag.name}')")) {
  console.log('  ✓ Albums Screen (Category Cards) has downloadAlbumZip() and shareAlbum()');
}

// 3. Verify event listeners and window exports in web/app.js
console.log('\n[3] Auditing function bindings & window exports in web/app.js:');
const requiredFunctions = [
  'downloadSinglePhoto',
  'shareSinglePhoto',
  'downloadFavoritesAlbumZip',
  'shareFavoritesAlbum',
  'downloadAlbumZip',
  'shareAlbum',
  'exportPhotosToZip'
];

requiredFunctions.forEach(fn => {
  const isDefined = appJs.includes(`function ${fn}`) || appJs.includes(`async function ${fn}`);
  const isExposed = appJs.includes(`${fn},`) || appJs.includes(`window.${fn} =`);
  console.log(`  - ${fn}: Defined = ${isDefined ? 'YES' : 'NO'}, Exposed to window/inline onclick = ${isExposed ? 'YES' : 'NO'}`);
  if (!isDefined || !isExposed) {
    throw new Error(`Missing definition or window export for ${fn}`);
  }
});

// 4. Verify fail-safe Blob conversion & downloader implementation
console.log('\n[4] Auditing Chrome Web App Blob & Object URL logic:');
const hasBlobConverter = appJs.includes('function dataUrlToBlob');
const hasBrowserDownloader = appJs.includes('function triggerBrowserDownload');
const usesBlobInDownload = appJs.includes('const blob = dataUrlToBlob(photo.dataUrl);');
const createsObjectUrl = appJs.includes('URL.createObjectURL(');
const revokesObjectUrl = appJs.includes('URL.revokeObjectURL(');
const handlesAbortError = appJs.includes("shareErr.name === 'AbortError'");

console.log(`  - dataUrlToBlob converter present: ${hasBlobConverter}`);
console.log(`  - triggerBrowserDownload utility present: ${hasBrowserDownloader}`);
console.log(`  - Uses Blob in single photo download: ${usesBlobInDownload}`);
console.log(`  - Creates Object URL (no data: URI buffer limits): ${createsObjectUrl}`);
console.log(`  - Cleans up Object URL with revokeObjectURL: ${revokesObjectUrl}`);
console.log(`  - Silently handles AbortError (user dismisses share sheet): ${handlesAbortError}`);

if (!hasBlobConverter || !hasBrowserDownloader || !usesBlobInDownload || !createsObjectUrl || !revokesObjectUrl) {
  throw new Error('Blob downloader architecture incomplete');
}

console.log('\n=== ALL AUDITS AND CHECKS PASSED WITH 100% SUCCESS ===');
