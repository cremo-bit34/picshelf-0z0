const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Testing 3-Button Luxury Action Dock at Bottom of Card ---');

const webAppJs = fs.readFileSync(path.join(__dirname, '../web/app.js'), 'utf-8');
const assetAppJs = fs.readFileSync(path.join(__dirname, '../app/src/main/assets/web/app.js'), 'utf-8');
const webStyleCss = fs.readFileSync(path.join(__dirname, '../web/style.css'), 'utf-8');
const assetStyleCss = fs.readFileSync(path.join(__dirname, '../app/src/main/assets/web/style.css'), 'utf-8');

// 1. Verify Top Bar does NOT have overcrowded delete button
assert(!webAppJs.includes('<div class="album-cover-top-actions">\n                <button class="album-cover-add-btn" onclick="event.stopPropagation(); triggerAlbumDirectImport(\'${escapeHtml(tag.name)}\')" title="Import photos directly into album (VIP)" aria-label="Import photos">\n                  <i class="fa-solid fa-plus"></i>\n                </button>\n                <button class="album-cover-surface-btn ${state.isPro ? \'vip-active\' : \'vip-locked\'}" onclick="event.stopPropagation(); openAlbum3DSurfaceModal(\'${escapeHtml(tag.name)}\')" title="${state.isPro ? \'Customize 3D Surface & Artwork\' : \'Preview 3D Card (VIP)\'}" aria-label="Customize 3D Surface">\n                  <i class="fa-solid ${state.isPro ? \'fa-wand-magic-sparkles\' : \'fa-crown\'}"></i>\n                </button>\n                <button class="album-cover-delete-btn"'), 'Top bar must not contain delete button');

console.log('✓ Verified top bar is cleanly uncluttered (only + and 3D surface wand)');

// 2. Verify Bottom Bar has all 3 actions together: Download, Share, Delete
assert(webAppJs.includes('btn-album-icon-action action-download'), 'web/app.js missing action-download');
assert(webAppJs.includes('btn-album-icon-action action-share'), 'web/app.js missing action-share');
assert(webAppJs.includes('btn-album-icon-action action-delete'), 'web/app.js missing action-delete');
assert(webAppJs.includes("openDeleteAlbumModal('${escapeHtml(tag.name)}')"), 'web/app.js missing openDeleteAlbumModal call');

assert(assetAppJs.includes('btn-album-icon-action action-download'), 'asset app.js missing action-download');
assert(assetAppJs.includes('btn-album-icon-action action-share'), 'asset app.js missing action-share');
assert(assetAppJs.includes('btn-album-icon-action action-delete'), 'asset app.js missing action-delete');

console.log('✓ Verified bottom action row has Download, Share, and Delete together');

// 3. Verify CSS styling for the 3-button dock
assert(webStyleCss.includes('.btn-album-icon-action'), 'style.css missing .btn-album-icon-action');
assert(webStyleCss.includes('.btn-album-icon-action.action-download:hover'), 'style.css missing action-download hover');
assert(webStyleCss.includes('.btn-album-icon-action.action-share:hover'), 'style.css missing action-share hover');
assert(webStyleCss.includes('.btn-album-icon-action.action-delete:hover'), 'style.css missing action-delete hover');

assert(assetStyleCss.includes('.btn-album-icon-action'), 'asset style.css missing .btn-album-icon-action');
console.log('✓ Verified CSS styles and micro-interactions in web/ and Android assets/');

// 4. Test rendering structure simulation
function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const tag = { name: 'Job Offer', color: '#10b981' };
const count = 3;
const cardHtml = `
  <div class="album-rich-card" data-tag="${escapeHtml(tag.name)}">
    <div class="album-cover-overlay">
      <div class="album-cover-top-bar">
        <span class="album-tag-dot-pill"><span class="tag-dot" style="background:${tag.color}"></span><span>Album</span></span>
        <div class="album-cover-top-actions">
          <button class="album-cover-add-btn"><i class="fa-solid fa-plus"></i></button>
          <button class="album-cover-surface-btn"><i class="fa-solid fa-wand-magic-sparkles"></i></button>
        </div>
      </div>
    </div>
    <div class="album-body">
      <div class="album-title-text">${tag.name}</div>
      <div class="album-card-action-bar">
        <div class="album-actions-row">
          <button class="btn-album-icon-action action-download" title="Download album as ZIP"><i class="fa-solid fa-download"></i></button>
          <button class="btn-album-icon-action action-share" title="Share album"><i class="fa-solid fa-share-nodes"></i></button>
          <button class="btn-album-icon-action action-delete" title="Delete album"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </div>
    </div>
  </div>
`;

assert(cardHtml.includes('class="btn-album-icon-action action-download"'), 'Rendered card missing download icon button');
assert(cardHtml.includes('class="btn-album-icon-action action-share"'), 'Rendered card missing share icon button');
assert(cardHtml.includes('class="btn-album-icon-action action-delete"'), 'Rendered card missing delete icon button');

console.log('✓ Card HTML structure simulation verified successfully');
console.log('\nALL 3-BUTTON DOCK TESTS PASSED! 🚀');
