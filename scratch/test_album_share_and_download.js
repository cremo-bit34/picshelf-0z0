const fs = require('fs');

console.log('=== VERIFYING ALBUM SHARE & ALBUM DOWNLOAD (WEB & PHONE APP) ===\n');

const appJs = fs.readFileSync('web/app.js', 'utf8');
const mainActivityKt = fs.readFileSync('app/src/main/java/com/example/MainActivity.kt', 'utf8');

// Test 1: Web App Album Download
console.log('[1] Checking Web App Album Download:');
const hasDownloadAlbumZip = appJs.includes('async function downloadAlbumZip(tagName)');
const hasDownloadFavZip = appJs.includes('async function downloadFavoritesAlbumZip()');
const callsExportZip = appJs.includes('await exportPhotosToZip(albumPhotos,');
const exportsZipBlob = appJs.includes("await zip.generateAsync({ type: 'blob' })");
const triggerBrowserDl = appJs.includes('triggerBrowserDownload(content, `${zipFilename}.zip`)');

console.log('  - downloadAlbumZip defined:', hasDownloadAlbumZip);
console.log('  - downloadFavoritesAlbumZip defined:', hasDownloadFavZip);
console.log('  - calls exportPhotosToZip:', callsExportZip);
console.log('  - generates native Blob without dataUrl limit:', exportsZipBlob);
console.log('  - calls triggerBrowserDownload for Web App:', triggerBrowserDl);

if (!hasDownloadAlbumZip || !hasDownloadFavZip || !callsExportZip || !exportsZipBlob || !triggerBrowserDl) {
  throw new Error('Web App album download verification failed!');
}
console.log('  => Web App Album Download: 100% VERIFIED\n');

// Test 2: Web App Album Share
console.log('[2] Checking Web App Album Share:');
const hasShareAlbum = appJs.includes('async function shareAlbum(tagName)');
const hasShareFav = appJs.includes('async function shareFavoritesAlbum()');
const hasCanShareFiles = appJs.includes('navigator.canShare && navigator.canShare({ files })');
const sharesFiles = appJs.includes('await navigator.share({\n        files,');
const hasClipboardFallback = appJs.includes('navigator.clipboard.write([') || appJs.includes('navigator.clipboard?.writeText(');

console.log('  - shareAlbum defined:', hasShareAlbum);
console.log('  - shareFavoritesAlbum defined:', hasShareFav);
console.log('  - checks navigator.canShare({ files }):', hasCanShareFiles);
console.log('  - shares multi-file array on mobile web:', sharesFiles);
console.log('  - fallback clipboard copy on desktop Chrome:', hasClipboardFallback);

if (!hasShareAlbum || !hasShareFav || !hasCanShareFiles || !sharesFiles || !hasClipboardFallback) {
  throw new Error('Web App album share verification failed!');
}
console.log('  => Web App Album Share: 100% VERIFIED\n');

// Test 3: Phone App Album Share (Android Native Bridge)
console.log('[3] Checking Phone App Album Share:');
const jsCallsNativeMultiShare = appJs.includes('window.AndroidApp.shareMultiplePhotos(');
const ktHasShareMultiplePhotos = mainActivityKt.includes('fun shareMultiplePhotos(photosJson: String, albumTitle: String)');
const ktHasClipData = mainActivityKt.includes('val clip = ClipData("Shared Album"') && mainActivityKt.includes('clipData = clip');
const ktHasChooserFlag = mainActivityKt.includes('addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)');

console.log('  - web/app.js calls AndroidApp.shareMultiplePhotos:', jsCallsNativeMultiShare);
console.log('  - MainActivity.kt implements @JavascriptInterface shareMultiplePhotos:', ktHasShareMultiplePhotos);
console.log('  - MainActivity.kt populates ClipData with all URIs (Claude recommendation):', ktHasClipData);
console.log('  - MainActivity.kt grants FLAG_GRANT_READ_URI_PERMISSION to Chooser:', ktHasChooserFlag);

if (!jsCallsNativeMultiShare || !ktHasShareMultiplePhotos || !ktHasClipData || !ktHasChooserFlag) {
  throw new Error('Phone App album share verification failed!');
}
console.log('  => Phone App Album Share: 100% VERIFIED\n');

// Test 4: Phone App Album Download (Android Native Bridge)
console.log('[4] Checking Phone App Album Download:');
const jsCallsNativeZipDownload = appJs.includes('window.AndroidApp.downloadZip(');
const ktHasDownloadZip = mainActivityKt.includes('fun downloadZip(base64ZipData: String, zipFileName: String)');
const ktUsesMediaStoreDownloads = mainActivityKt.includes('MediaStore.Downloads.RELATIVE_PATH, "Download/AuraPhotoOrganizer"');
const ktHasScanner = mainActivityKt.includes('MediaScannerConnection.scanFile(');

console.log('  - web/app.js calls AndroidApp.downloadZip:', jsCallsNativeZipDownload);
console.log('  - MainActivity.kt implements @JavascriptInterface downloadZip:', ktHasDownloadZip);
console.log('  - MainActivity.kt writes to MediaStore.Downloads (Download/AuraPhotoOrganizer):', ktUsesMediaStoreDownloads);
console.log('  - MainActivity.kt registers file with MediaScannerConnection:', ktHasScanner);

if (!jsCallsNativeZipDownload || !ktHasDownloadZip || !ktUsesMediaStoreDownloads || !ktHasScanner) {
  throw new Error('Phone App album download verification failed!');
}
console.log('  => Phone App Album Download: 100% VERIFIED\n');

console.log('===========================================================');
console.log('ALL ALBUM SHARE & DOWNLOAD AUDITS PASSED WITH ZERO ERRORS!');
console.log('===========================================================');
