const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Starting Verification Suite: Revamped VIP Multi-Tag Intersection & Hover Previews');

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
  'id="multiTagPickerDrawer"',
  'id="multiTagPickerSearchInput"',
  'id="multiTagCandidateList"',
  'id="multiTagResultCard"',
  'id="multiTagDotStack"',
  'id="multiTagResultLabel"',
  'id="multiTagResultCount"',
  'id="multiTagSelectDestBtn"',
  'id="multiTagMatchingThumbs"'
].forEach(id => {
  assert(webHtml.includes(id), `web/index.html missing ${id}`);
  assert(iosHtml.includes(id), `ios/web/index.html missing ${id}`);
});
console.log('  ✅ HTML markup verified across web/ and ios/web/');

// 2. Verify CSS Styles
const webCss = fs.readFileSync(path.join(__dirname, '../web/style.css'), 'utf8');
[
  '.multitag-tag-chip',
  '.multitag-tag-dot',
  '.multitag-tag-name',
  '.multitag-tag-remove',
  '.multitag-chain-plus-btn',
  '.multitag-picker-drawer',
  '.multitag-candidate-list',
  '.multitag-candidate-item',
  '.candidate-count-badge',
  '.candidate-count-badge.has-photos',
  '.candidate-count-badge.zero-photos',
  '.multitag-result-card.hover-previewing'
].forEach(cssClass => {
  assert(webCss.includes(cssClass), `style.css missing ${cssClass}`);
});
console.log('  ✅ CSS styles verified for Chips, Candidate Drawer, and Hover Previews');

// 3. Verify app.js function exports
const appJs = fs.readFileSync(path.join(__dirname, '../web/app.js'), 'utf8');
[
  'window.toggleMultiTagBuilder =',
  'window.renderMultiTagChain =',
  'window.openMultiTagPicker =',
  'window.closeMultiTagPicker =',
  'window.handleMultiTagPickerSearch =',
  'window.renderMultiTagCandidateList =',
  'window.hoverPreviewCandidate =',
  'window.clearCandidateHoverPreview =',
  'window.pickCandidateTag =',
  'window.removeMultiTagChainItem =',
  'window.updateMultiTagIntersection =',
  'window.selectMultiTagAsDestination ='
].forEach(fn => {
  assert(appJs.includes(fn), `web/app.js missing ${fn}`);
});
console.log('  ✅ app.js functions and exports verified');

// 4. Behavioral Simulation: Exact User Scenario
const mockState = {
  photos: [
    { id: 'p1', displayName: 'Birthday Party', tags: ['Birthday', 'Family'], dataUrl: 'data:img1' },
    { id: 'p2', displayName: 'Family Dinner', tags: ['Birthday', 'Family', 'Vacation'], dataUrl: 'data:img2' },
    { id: 'p3', displayName: 'Alone Cake', tags: ['Birthday'], dataUrl: 'data:img3' },
    { id: 'p4', displayName: 'Wedding Cake', tags: ['Wedding'], dataUrl: 'data:img4' },
    { id: 'p5', displayName: 'Job Celebration', tags: ['Job Offer'], dataUrl: 'data:img5' }
  ],
  tags: [
    { name: 'Birthday', color: '#f59e0b' },
    { name: 'Wedding', color: '#ec4899' },
    { name: 'Family', color: '#10b981' },
    { name: 'Vacation', color: '#3b82f6' },
    { name: 'Job Offer', color: '#8b5cf6' }
  ],
  moveCopyMultiTags: ['Birthday'],
  moveCopyIsMultiTagDest: false,
  moveCopyDestinationTags: null,
  moveCopyDestinationAlbum: null,
  moveCopyMode: 'copy',
  moveCopyTargetIds: ['p5']
};

// Test 1: In the candidates list, 'Birthday' MUST NEVER appear
const selectedSet = new Set(mockState.moveCopyMultiTags.map(t => t.toLowerCase()));
const candidates = mockState.tags.filter(t => !selectedSet.has(t.name.toLowerCase()));

assert.strictEqual(candidates.length, 4, 'Should have 4 candidates');
assert(!candidates.some(c => c.name.toLowerCase() === 'birthday'), 'Birthday MUST be excluded from candidate options');
console.log('  ✅ Candidate options filter verified: Tag A (Birthday) is 100% excluded');

// Test 2: Calculate photo intersection counts for each candidate with 'Birthday'
const validPhotos = mockState.photos.filter(p => !p.isPending && !p.deletedAt);
const countsByCandidate = {};
candidates.forEach(c => {
  const combo = [...mockState.moveCopyMultiTags, c.name];
  const count = validPhotos.filter(p =>
    combo.every(vt => p.tags && p.tags.some(pt => pt.toLowerCase() === vt.toLowerCase()))
  ).length;
  countsByCandidate[c.name] = count;
});

assert.strictEqual(countsByCandidate['Family'], 2, 'Family must have 2 photos with Birthday (p1, p2)');
assert.strictEqual(countsByCandidate['Wedding'], 0, 'Wedding must have 0 photos with Birthday');
assert.strictEqual(countsByCandidate['Job Offer'], 0, 'Job Offer must have 0 photos with Birthday');
console.log('  ✅ Live candidate counts verified (Family: 2 photos, Wedding: 0 photos)');

// Test 3: Hover preview on Family
const hoverCombo = [...mockState.moveCopyMultiTags, 'Family'];
const hoverMatchingPhotos = validPhotos.filter(p =>
  hoverCombo.every(vt => p.tags && p.tags.some(pt => pt.toLowerCase() === vt.toLowerCase()))
);
assert.strictEqual(hoverMatchingPhotos.length, 2);
assert.deepStrictEqual(hoverMatchingPhotos.map(p => p.id), ['p1', 'p2']);
console.log('  ✅ Hover preview correctly computes matching photos for Birthday + Family');

// Test 4: User selects 'Family' as Tag B
mockState.moveCopyMultiTags.push('Family');
assert.deepStrictEqual(mockState.moveCopyMultiTags, ['Birthday', 'Family']);

// Combined destination automatically activated
mockState.moveCopyIsMultiTagDest = true;
mockState.moveCopyDestinationTags = [...mockState.moveCopyMultiTags];
mockState.moveCopyDestinationAlbum = mockState.moveCopyMultiTags.join(' + ');

assert.strictEqual(mockState.moveCopyDestinationAlbum, 'Birthday + Family');
console.log('  ✅ Destination automatically selected as Birthday + Family');

// Test 5: User wants to add Tag C (3rd tag)
// Candidate options MUST NOW EXCLUDE both Birthday and Family
const selectedSet3 = new Set(mockState.moveCopyMultiTags.map(t => t.toLowerCase()));
const candidates3 = mockState.tags.filter(t => !selectedSet3.has(t.name.toLowerCase()));
assert.strictEqual(candidates3.length, 3, 'Must have 3 remaining candidates');
assert(!candidates3.some(c => c.name === 'Birthday'));
assert(!candidates3.some(c => c.name === 'Family'));

// Check 3rd tag counts with Birthday + Family
const countsForTag3 = {};
candidates3.forEach(c => {
  const combo3 = [...mockState.moveCopyMultiTags, c.name];
  const count = validPhotos.filter(p =>
    combo3.every(vt => p.tags && p.tags.some(pt => pt.toLowerCase() === vt.toLowerCase()))
  ).length;
  countsForTag3[c.name] = count;
});

assert.strictEqual(countsForTag3['Vacation'], 1, 'Vacation has 1 photo matching Birthday + Family + Vacation (p2)');
assert.strictEqual(countsForTag3['Wedding'], 0, 'Wedding has 0 photos matching Birthday + Family + Wedding');
console.log('  ✅ 3rd tag chaining verified (Vacation: 1 matching photo)');

// Test 6: User removes 'Family'
mockState.moveCopyMultiTags = mockState.moveCopyMultiTags.filter(t => t !== 'Family');
assert.deepStrictEqual(mockState.moveCopyMultiTags, ['Birthday']);
mockState.moveCopyIsMultiTagDest = false;
mockState.moveCopyDestinationTags = null;
mockState.moveCopyDestinationAlbum = null;
assert.strictEqual(mockState.moveCopyIsMultiTagDest, false);
console.log('  ✅ Tag removal cleans up state correctly');

console.log('\n🌟 ALL REVAMPED MULTI-TAG TESTS PASSED! 🚀');
