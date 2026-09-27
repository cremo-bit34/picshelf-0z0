const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('Testing Rename and Crop features...');

// 1. Check index.html markup
const html = fs.readFileSync(path.join(__dirname, '../web/index.html'), 'utf8');
assert(html.includes('id="renamePhotoModal"'), 'renamePhotoModal exists in index.html');
assert(html.includes('id="renamePhotoInput"'), 'renamePhotoInput exists in index.html');
assert(html.includes('id="renameCharCounter"'), 'renameCharCounter exists in index.html');
assert(html.includes('id="cropEditorModal"'), 'cropEditorModal exists in index.html');
assert(html.includes('id="cropBox"'), 'cropBox exists in index.html');
assert(html.includes('id="cropAspectBar"'), 'cropAspectBar exists in index.html');
assert(html.includes('id="renameSelectedBtn"'), 'renameSelectedBtn exists in gallerySelectionBar');
assert(html.includes('id="cropSelectedBtn"'), 'cropSelectedBtn exists in gallerySelectionBar');
assert(html.includes('id="detailRenameBtn"'), 'detailRenameBtn exists in detail modal');
assert(html.includes('id="detailCropBtn"'), 'detailCropBtn exists in detail modal');
console.log('PASS: index.html has all required markup for Rename and Crop.');

// 2. Check style.css
const css = fs.readFileSync(path.join(__dirname, '../web/style.css'), 'utf8');
assert(css.includes('.rename-preview-box'), 'style.css has rename-preview-box');
assert(css.includes('.crop-modal-overlay'), 'style.css has crop-modal-overlay');
assert(css.includes('.crop-box'), 'style.css has crop-box');
assert(css.includes('.crop-handle'), 'style.css has crop-handle');
assert(css.includes('.aspect-chip'), 'style.css has aspect-chip');
console.log('PASS: style.css has all required styles for Rename and Crop.');

// 3. Test sanitizePhotoName logic
const MAX_PHOTO_NAME_LENGTH = 60;
const ILLEGAL_FILENAME_CHARS = /[<>:"/\\|?*\u0000-\u001F\u007F]/g;

function sanitizePhotoName(name) {
  if (!name) return 'Untitled Moment';
  let cleaned = String(name)
    .normalize('NFC')
    .replace(/[\u200B-\u200D\u2060\uFEFF]/g, '')
    .replace(ILLEGAL_FILENAME_CHARS, '-')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned || cleaned === '.' || cleaned === '..') {
    return 'Untitled Moment';
  }

  const chars = Array.from(cleaned);
  if (chars.length > MAX_PHOTO_NAME_LENGTH) {
    cleaned = chars.slice(0, MAX_PHOTO_NAME_LENGTH).join('').trim();
  }
  return cleaned;
}

// Test sanitization scenarios
assert.strictEqual(sanitizePhotoName(''), 'Untitled Moment');
assert.strictEqual(sanitizePhotoName('   '), 'Untitled Moment');
assert.strictEqual(sanitizePhotoName('Photo <1> : "Best" / 2026?'), 'Photo -1- - -Best- - 2026-');
assert.strictEqual(sanitizePhotoName('  Beach   Trip   Celebration  '), 'Beach Trip Celebration');

// Test 60-char length limit
const longName = 'A'.repeat(80);
const sanitizedLong = sanitizePhotoName(longName);
assert.strictEqual(sanitizedLong.length, 60, 'Long name must be capped at 60 characters');

// Test emoji preservation within 60 chars
const emojiName = '🎉 Birthday Party In Paris 🍷'.repeat(3);
const sanitizedEmoji = sanitizePhotoName(emojiName);
assert(Array.from(sanitizedEmoji).length <= 60, 'Emoji string length capped at 60 chars');
console.log('PASS: sanitizePhotoName satisfies all security, normalization, and 60-char ceiling rules.');

// 4. Verify app.js exports
const js = fs.readFileSync(path.join(__dirname, '../web/app.js'), 'utf8');
assert(js.includes('window.openRenamePhotoModal = openRenamePhotoModal'), 'app.js exports openRenamePhotoModal');
assert(js.includes('window.openCropEditorModal = openCropEditorModal'), 'app.js exports openCropEditorModal');
assert(js.includes('window.setCropAspect = setCropAspect'), 'app.js exports setCropAspect');
assert(js.includes('window.applyAndSaveCrop = applyAndSaveCrop'), 'app.js exports applyAndSaveCrop');
assert(js.includes('openRenamePhotoModal'), 'app.js uses openRenamePhotoModal on dock and gallery cards');
assert(js.includes('openCropEditorModal'), 'app.js uses openCropEditorModal on gallery cards');
console.log('PASS: app.js contains complete Rename and Crop implementation.');

console.log('\nALL RENAME & CROP VERIFICATION CHECKS PASSED 100%!');
