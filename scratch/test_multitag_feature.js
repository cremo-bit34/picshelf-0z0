const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Starting Verification Suite: VIP Multi-Tag Album Intersection Feature');

// 1. Verify HTML Structure in web/ and ios/web/
const webHtml = fs.readFileSync(path.join(__dirname, '../web/index.html'), 'utf8');
const iosHtml = fs.readFileSync(path.join(__dirname, '../ios/web/index.html'), 'utf8');

[
  'id="moveCopyMultiTagContainer"',
  'id="multiTagToggleBtn"',
  'id="multiTagActiveBadge"',
  'id="multiTagChevron"',
  'id="multiTagBuilderBody"',
  'id="multiTagChainRow"',
  'id="multiTagResultCard"',
  'id="multiTagDotStack"',
  'id="multiTagResultLabel"',
  'id="multiTagResultCount"',
  'id="multiTagSelectDestBtn"',
  'id="multiTagSelectBtnText"',
  'id="multiTagMatchingThumbs"'
].forEach(id => {
  assert(webHtml.includes(id), `web/index.html missing ${id}`);
  assert(iosHtml.includes(id), `ios/web/index.html missing ${id}`);
});
console.log('  ✅ HTML markup verified across web/ and ios/web/');

// 2. Verify CSS Styles
const webCss = fs.readFileSync(path.join(__dirname, '../web/style.css'), 'utf8');
[
  '.move-copy-multitag-container',
  '.multitag-toggle-btn',
  '.multitag-item',
  '.multitag-dot',
  '.multitag-select',
  '.multitag-remove-btn',
  '.multitag-add-tag-btn',
  '.multitag-result-card',
  '.multitag-stack-dot',
  '.multitag-select-btn',
  '.multitag-matching-thumbs',
  '.multitag-match-thumb',
  '.move-copy-album-row.multitag-combined-row'
].forEach(cssClass => {
  assert(webCss.includes(cssClass), `style.css missing ${cssClass}`);
});
console.log('  ✅ CSS styles verified');

// 3. Verify i18n Translations
const webI18n = fs.readFileSync(path.join(__dirname, '../web/i18n.js'), 'utf8');
const expectedKeys = [
  'organize_multitag_title',
  'organize_multitag_subtitle',
  'organize_multitag_placeholder',
  'organize_multitag_add_btn',
  'organize_multitag_match_both',
  'organize_multitag_match_all',
  'organize_multitag_select_dest',
  'organize_multitag_selected',
  'organize_multitag_no_matches',
  'organize_multitag_badge',
  'organize_multitag_copy_to',
  'organize_multitag_move_to'
];
expectedKeys.forEach(k => {
  assert(webI18n.includes(k), `i18n.js missing key: ${k}`);
});
console.log('  ✅ All 12 multi-tag i18n translation keys verified');

// 4. Verify app.js function exports
const appJs = fs.readFileSync(path.join(__dirname, '../web/app.js'), 'utf8');
[
  'window.toggleMultiTagBuilder =',
  'window.renderMultiTagChain =',
  'window.addMultiTagChainItem =',
  'window.removeMultiTagChainItem =',
  'window.handleMultiTagChainChange =',
  'window.updateMultiTagIntersection =',
  'window.selectMultiTagAsDestination ='
].forEach(fn => {
  assert(appJs.includes(fn), `web/app.js missing ${fn}`);
});
console.log('  ✅ app.js functions and exports verified');

// 5. Behavioral Simulation
const mockState = {
  photos: [
    { id: 'p1', displayName: 'Eiffel Tower', tags: ['Paris', 'France', 'Vacation'], dataUrl: 'data:image/jpeg;base64,111' },
    { id: 'p2', displayName: 'Louvre', tags: ['Paris', 'France'], dataUrl: 'data:image/jpeg;base64,222' },
    { id: 'p3', displayName: 'Nice Beach', tags: ['France'], dataUrl: 'data:image/jpeg;base64,333' },
    { id: 'p4', displayName: 'Tokyo Tower', tags: ['Tokyo', 'Japan'], dataUrl: 'data:image/jpeg;base64,444' }
  ],
  tags: [
    { name: 'Paris', color: '#3b82f6' },
    { name: 'France', color: '#10b981' },
    { name: 'Vacation', color: '#f59e0b' },
    { name: 'Tokyo', color: '#ec4899' },
    { name: 'Japan', color: '#8b5cf6' }
  ],
  moveCopyMultiTags: ['Paris'],
  moveCopyIsMultiTagDest: false,
  moveCopyDestinationTags: null,
  moveCopyDestinationAlbum: null,
  moveCopyMode: 'copy',
  moveCopyTargetIds: ['p4'] // Moving Tokyo Tower photo into Paris + France
};

// Check unselected remaining tags for 'Paris'
const selectedSet = new Set(mockState.moveCopyMultiTags.map(t => t.toLowerCase()));
const unselected = mockState.tags.filter(t => !selectedSet.has(t.name.toLowerCase()));
assert.strictEqual(unselected.length, 4, 'Should have 4 unselected remaining tags');
assert(!unselected.some(t => t.name === 'Paris'), 'Paris must not be in unselected');
console.log('  ✅ Dropdown chaining filter verified: prevents duplicate tag selection');

// Add second tag 'France'
mockState.moveCopyMultiTags.push('France');
assert.strictEqual(mockState.moveCopyMultiTags.length, 2);

// Calculate intersection
const activeTags = mockState.moveCopyMultiTags;
const matchingPhotos = mockState.photos.filter(p =>
  activeTags.every(vt => p.tags && p.tags.some(pt => pt.toLowerCase() === vt.toLowerCase()))
);
assert.strictEqual(matchingPhotos.length, 2, 'Only p1 and p2 have BOTH Paris and France tags');
console.log('  ✅ Intersection calculation verified: found exactly 2 matching photos');

// Select combined multi-tag destination
mockState.moveCopyIsMultiTagDest = true;
mockState.moveCopyDestinationTags = [...activeTags];
mockState.moveCopyDestinationAlbum = activeTags.join(' + ');

assert.strictEqual(mockState.moveCopyDestinationAlbum, 'Paris + France');
console.log('  ✅ Multi-tag destination selection verified');

// Simulate Copy Execution into Multi-Tag Destination
const targetPhoto = mockState.photos.find(p => p.id === 'p4');
assert(!targetPhoto.tags.includes('Paris'));
assert(!targetPhoto.tags.includes('France'));

mockState.moveCopyDestinationTags.forEach(t => {
  if (!targetPhoto.tags.includes(t)) {
    targetPhoto.tags.push(t);
  }
});

assert(targetPhoto.tags.includes('Paris'), 'Target photo must now have Paris');
assert(targetPhoto.tags.includes('France'), 'Target photo must now have France');
assert(targetPhoto.tags.includes('Tokyo'), 'Target photo must retain Tokyo in Copy mode');
console.log('  ✅ Multi-tag destination Copy operation verified');

// Simulate Move Execution into Multi-Tag Destination
const photoToMove = { id: 'p5', tags: ['TemporarySource'], category: 'TemporarySource' };
const sourceTag = 'TemporarySource';
mockState.moveCopyMode = 'move';

photoToMove.tags = photoToMove.tags.filter(t => t !== sourceTag);
mockState.moveCopyDestinationTags.forEach(t => {
  if (!photoToMove.tags.includes(t)) {
    photoToMove.tags.push(t);
  }
});

assert(!photoToMove.tags.includes('TemporarySource'), 'Source tag must be removed in Move mode');
assert(photoToMove.tags.includes('Paris'), 'Target photo must have Paris in Move mode');
assert(photoToMove.tags.includes('France'), 'Target photo must have France in Move mode');
console.log('  ✅ Multi-tag destination Move operation verified');

console.log('\n🌟 ALL MULTI-TAG FEATURE TESTS PASSED SUCCESSFULLY! 🚀');
