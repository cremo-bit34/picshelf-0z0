const fs = require('fs');
const vm = require('vm');

const appJsContent = fs.readFileSync('c:/Users/svika/Downloads/AI/photoorganizer/web/app.js', 'utf8');

const domMock = {
  elements: {},
  getElementById(id) {
    if (!this.elements[id]) {
      this.elements[id] = {
        id,
        style: {},
        value: '',
        textContent: '',
        classList: {
          classes: new Set(),
          add(c) { this.classes.add(c); },
          remove(c) { this.classes.delete(c); },
          toggle(c, val) { if (val) this.classes.add(c); else this.classes.delete(c); },
          contains(c) { return this.classes.has(c); }
        },
        querySelectorAll() { return []; },
        addEventListener() {},
        focus() {}
      };
    }
    return this.elements[id];
  },
  querySelector() { return null; },
  querySelectorAll() { return []; }
};

const windowMock = {
  addEventListener() {},
  matchMedia() { return { matches: true }; },
  localStorage: {
    data: {},
    getItem(k) { return this.data[k] || null; },
    setItem(k, v) { this.data[k] = String(v); },
    removeItem(k) { delete this.data[k]; }
  }
};

const documentMock = {
  ...domMock,
  addEventListener() {},
  documentElement: {
    style: { setProperty() {} }
  },
  body: {
    classList: { add() {}, remove() {}, contains() { return false; } }
  }
};

const context = {
  window: windowMock,
  document: documentMock,
  localStorage: windowMock.localStorage,
  setTimeout: setTimeout,
  setInterval: setInterval,
  console: console
};

vm.createContext(context);
vm.runInContext(appJsContent, context);
vm.runInContext('window.renderGallery = renderGallery; window.handleGallerySearch = handleGallerySearch; window.clearGallerySearch = clearGallerySearch; window.state = state;', context);

const { state, renderGallery, handleGallerySearch, clearGallerySearch } = context.window;

// Setup test photos
state.tags = [
  { name: 'Wedding', color: '#f43f5e' },
  { name: 'Birthday', color: '#ff2a6d' },
  { name: 'Job Offer', color: '#00e599' },
  { name: 'Dinner with Family', color: '#7928ca' },
  { name: 'Trip', color: '#00d2ff' }
];

state.photos = [
  { id: '1', displayName: 'Wedding Vows Exchange', category: 'Wedding', tags: ['Wedding'], isPending: false, isFavorite: false, deletedAt: null, createdAt: 1000 },
  { id: '2', displayName: 'First Dance Magic', category: 'Wedding', tags: ['Wedding'], isPending: false, isFavorite: false, deletedAt: null, createdAt: 2000 },
  { id: '3', displayName: '20th Birthday Bash', category: 'Birthday', tags: ['Birthday', 'Dinner with Family'], isPending: false, isFavorite: true, deletedAt: null, createdAt: 3000 },
  { id: '4', displayName: 'Birthday Party Surprises', category: 'Birthday', tags: ['Birthday'], isPending: false, isFavorite: true, deletedAt: null, createdAt: 4000 },
  { id: '5', displayName: 'Excited First Day at Work', category: 'Job Offer', tags: ['Job Offer'], isPending: false, isFavorite: true, deletedAt: null, createdAt: 5000 },
  { id: '6', displayName: "Grandma's Sunday Dinner", category: 'Family', tags: ['Dinner with Family'], isPending: false, isFavorite: false, deletedAt: null, createdAt: 6000 },
  { id: '7', displayName: 'Rocky Mountain Sunset', category: 'Trip', tags: ['Trip'], isPending: false, isFavorite: false, deletedAt: null, createdAt: 7000 },
  { id: '8', displayName: 'Pending Dock Photo', category: 'Dock', tags: [], isPending: true, isFavorite: false, deletedAt: null, createdAt: 8000 }
];

const gridEl = documentMock.getElementById('galleryPhotoGrid');
const countEl = documentMock.getElementById('galleryCountText');

console.log('--- TEST 1: Initial gallery render (7 valid photos) ---');
renderGallery();
console.assert(countEl.textContent === '7 photos found', `Count text was: ${countEl.textContent}`);
console.log('Initial render count text passed!');

console.log('\n--- TEST 2: Search for "Wedding" ---');
handleGallerySearch('Wedding');
console.assert(countEl.textContent === '2 photos matching "Wedding"', `Count was: ${countEl.textContent}`);
console.assert(gridEl.innerHTML.includes('Wedding Vows Exchange') && gridEl.innerHTML.includes('First Dance Magic'), 'Contains both wedding photos');
console.assert(!gridEl.innerHTML.includes('Birthday'), 'Does not contain birthday');
console.log('Search "Wedding" passed!');

console.log('\n--- TEST 3: Search with multi-word terms "dinner family" ---');
handleGallerySearch('dinner family');
console.assert(countEl.textContent === '2 photos matching "dinner family"', `Count was: ${countEl.textContent}`);
console.assert(gridEl.innerHTML.includes("Grandma's Sunday Dinner"), "Matches Grandma's Sunday Dinner");
console.assert(gridEl.innerHTML.includes("20th Birthday Bash"), "Matches 20th Birthday Bash (has Dinner with Family tag)");
console.log('Multi-word search passed!');

console.log('\n--- TEST 4: Search for "favorites" keyword ---');
handleGallerySearch('favorites');
console.assert(countEl.textContent === '3 photos matching "favorites"', `Count was: ${countEl.textContent}`);
console.assert(gridEl.innerHTML.includes('20th Birthday Bash') && gridEl.innerHTML.includes('Birthday Party Surprises') && gridEl.innerHTML.includes('Excited First Day at Work'), 'Matches all 3 favorite photos');
console.log('Search "favorites" passed!');

console.log('\n--- TEST 5: Search with trailing space and uppercase "BIRTHDAY  " ---');
handleGallerySearch('BIRTHDAY  ');
console.assert(countEl.textContent === '2 photos matching "BIRTHDAY"', `Count was: ${countEl.textContent}`);
console.log('Case-insensitive trim search passed!');

console.log('\n--- TEST 6: Clear search ---');
clearGallerySearch();
console.assert(state.searchQuery === '', 'searchQuery is empty string');
console.assert(countEl.textContent === '7 photos found', `Count restored: ${countEl.textContent}`);
console.log('Clear search passed!');

console.log('\n--- TEST 7: Search with active tag filter does not trap or break search ---');
state.selectedFilterTags.add('Wedding');
handleGallerySearch('Mountain');
console.assert(countEl.textContent === '1 photo matching "Mountain"', `Count was: ${countEl.textContent}`);
console.assert(gridEl.innerHTML.includes('Rocky Mountain Sunset'), 'Finds Mountain Sunset photo');
console.log('Search priority over stale tag filters passed!');

console.log('\nALL GALLERY SEARCH TESTS PASSED SUCCESSFULLY!');
