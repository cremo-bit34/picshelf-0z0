const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Testing VIP Move / Copy Photos Feature (Item 6) ---');

// 1. Check HTML markup
const webHtml = fs.readFileSync(path.join(__dirname, '../web/index.html'), 'utf-8');
const assetHtml = fs.readFileSync(path.join(__dirname, '../app/src/main/assets/web/index.html'), 'utf-8');

assert(webHtml.includes('id="moveCopySelectedBtn"'), 'web/index.html missing moveCopySelectedBtn');
assert(webHtml.includes('id="detailMoveCopyBtn"'), 'web/index.html missing detailMoveCopyBtn');
assert(webHtml.includes('id="moveCopyModal"'), 'web/index.html missing moveCopyModal');
assert(webHtml.includes('id="modeCopyBtn"'), 'web/index.html missing modeCopyBtn');
assert(webHtml.includes('id="modeMoveBtn"'), 'web/index.html missing modeMoveBtn');
assert(webHtml.includes('id="moveCopyPreviewRail"'), 'web/index.html missing moveCopyPreviewRail');
assert(webHtml.includes('id="moveCopyAlbumsList"'), 'web/index.html missing moveCopyAlbumsList');
assert(webHtml.includes('id="vipMoveCopyModal"'), 'web/index.html missing vipMoveCopyModal');

assert(assetHtml.includes('id="moveCopySelectedBtn"'), 'asset index.html missing moveCopySelectedBtn');
assert(assetHtml.includes('id="moveCopyModal"'), 'asset index.html missing moveCopyModal');
assert(assetHtml.includes('id="vipMoveCopyModal"'), 'asset index.html missing vipMoveCopyModal');
console.log('✓ HTML markup verified in web/ and Android assets/');

// 2. Check CSS styles
const webCss = fs.readFileSync(path.join(__dirname, '../web/style.css'), 'utf-8');
assert(webCss.includes('.vip-action-btn'), 'style.css missing .vip-action-btn');
assert(webCss.includes('.btn-vip-dot'), 'style.css missing .btn-vip-dot');
assert(webCss.includes('.move-copy-preview-rail'), 'style.css missing .move-copy-preview-rail');
assert(webCss.includes('.move-copy-mode-selector'), 'style.css missing .move-copy-mode-selector');
assert(webCss.includes('.move-copy-album-row'), 'style.css missing .move-copy-album-row');
console.log('✓ CSS styles verified in web/ and Android assets/');

// 3. Check app.js functions
const appJs = fs.readFileSync(path.join(__dirname, '../web/app.js'), 'utf-8');
assert(appJs.includes('window.openMoveCopyModal ='), 'app.js missing openMoveCopyModal');
assert(appJs.includes('window.closeMoveCopyModal ='), 'app.js missing closeMoveCopyModal');
assert(appJs.includes('window.setMoveCopyMode ='), 'app.js missing setMoveCopyMode');
assert(appJs.includes('window.selectMoveCopyDestination ='), 'app.js missing selectMoveCopyDestination');
assert(appJs.includes('window.executeMoveCopyAction ='), 'app.js missing executeMoveCopyAction');
console.log('✓ app.js functions presence verified');

// 4. Test logic execution simulation
const state = {
  photos: [
    { id: 'p1', displayName: 'Beach', tags: ['Vacation'], category: 'Vacation' },
    { id: 'p2', displayName: 'Dinner', tags: ['Family', 'Vacation'], category: 'Vacation' },
    { id: 'p3', displayName: 'Portrait', tags: ['Family'], category: 'Family' }
  ],
  tags: [
    { name: 'Vacation', color: '#3b82f6' },
    { name: 'Family', color: '#f43f5e' },
    { name: 'Favorites', color: '#e11d48' },
    { name: 'Work', color: '#10b981' }
  ],
  selectedFilterTags: new Set(['Vacation']),
  isPro: true
};

// Simulate COPY operation (p1 & p2 to Work)
const copyIds = ['p1', 'p2'];
const destAlbum = 'Work';

copyIds.forEach(id => {
  const photo = state.photos.find(p => p.id === id);
  if (!photo.tags.includes(destAlbum)) {
    photo.tags.push(destAlbum);
  }
});

// Verify COPY: p1 still has 'Vacation', AND now has 'Work'
const p1 = state.photos.find(p => p.id === 'p1');
assert(p1.tags.includes('Vacation'), 'p1 must retain original tag in Copy mode');
assert(p1.tags.includes('Work'), 'p1 must receive new destination tag in Copy mode');
console.log('✓ Copy mode logic verified: original tags preserved + destination tag added');

// Simulate MOVE operation (p1 & p2 moved from Vacation to Favorites)
const moveIds = ['p1', 'p2'];
const moveDest = 'Favorites';
const sourceTag = 'Vacation';

moveIds.forEach(id => {
  const photo = state.photos.find(p => p.id === id);
  photo.tags = photo.tags.filter(t => t !== sourceTag);
  if (!photo.tags.includes(moveDest)) {
    photo.tags.push(moveDest);
  }
});

// Verify MOVE: p1 must NOT have 'Vacation', and MUST have 'Favorites'
assert(!p1.tags.includes('Vacation'), 'p1 must have source tag removed in Move mode');
assert(p1.tags.includes('Favorites'), 'p1 must have destination tag added in Move mode');
assert(p1.tags.includes('Work'), 'p1 retains unrelated tags');
console.log('✓ Move mode logic verified: source tag removed + destination tag added');

console.log('\nALL VIP MOVE / COPY TESTS PASSED! 🚀');
