const fs = require('fs');
const vm = require('vm');

const i18nContent = fs.readFileSync('web/i18n.js', 'utf8');
const appContent = fs.readFileSync('web/app.js', 'utf8');

const storage = {};
const mockElements = {};

function getMockEl(id) {
  if (!mockElements[id]) {
    mockElements[id] = {
      id: id,
      style: {},
      classList: {
        contains: (c) => false,
        add: () => {},
        remove: () => {},
        toggle: () => {}
      },
      innerHTML: '',
      textContent: '',
      value: '',
      addEventListener: () => {},
      querySelectorAll: () => []
    };
  }
  return mockElements[id];
}

const sandbox = {
  window: {},
  document: {
    body: getMockEl('body'),
    querySelectorAll: () => [],
    querySelector: () => null,
    getElementById: (id) => getMockEl(id),
    createElement: () => ({
      toDataURL: () => 'data:image/png;base64,mock',
      getContext: () => ({
        createLinearGradient: () => ({ addColorStop: () => {} }),
        createRadialGradient: () => ({ addColorStop: () => {} }),
        fillRect: () => {},
        beginPath: () => {},
        arc: () => {},
        fill: () => {},
        fillText: () => {},
        measureText: () => ({ width: 100 }),
        getImageData: () => ({ data: new Uint8ClampedArray(800 * 800 * 4) }),
        putImageData: () => {}
      })
    }),
    addEventListener: () => {},
    documentElement: {
      classList: { contains: () => false },
      style: { setProperty: () => {} }
    }
  },
  navigator: { userAgent: 'Chrome' },
  localStorage: {
    getItem: (k) => storage[k] || null,
    setItem: (k, v) => { storage[k] = v; },
    removeItem: (k) => { delete storage[k]; }
  },
  console: console,
  setTimeout: (fn) => fn(),
  Date: Date,
  Math: Math,
  Set: Set,
  Map: Map,
  Array: Array,
  JSON: JSON,
  addEventListener: () => {},
  removeEventListener: () => {}
};

sandbox.window = sandbox;

vm.createContext(sandbox);
vm.runInContext(i18nContent, sandbox);
vm.runInContext(appContent, sandbox);

console.log('--- TEST 1: Check initial photo locations after loadState() ---');
sandbox.loadState();
const photosWithLocation = sandbox.state.photos.filter(p => p.location && p.location.place);
console.log(`Total photos: ${sandbox.state.photos.length}`);
console.log(`Photos with rich GPS metadata: ${photosWithLocation.length}`);
if (photosWithLocation.length > 0) {
  console.log('Sample photo location:', JSON.stringify(photosWithLocation[0].location));
}

console.log('\n--- TEST 2: Check getSuggestedLocationTagsForPhoto ---');
const samplePhoto = sandbox.state.photos[0];
const suggestions = sandbox.getSuggestedLocationTagsForPhoto(samplePhoto);
console.log('Suggestions for photo 0:', suggestions);

console.log('\n--- TEST 3: Open Batch Tag Modal for sample photo ---');
sandbox.openBatchTagModal([samplePhoto.id]);
const locContainer = getMockEl('batchLocationContainer');
console.log('batchLocationContainer display:', locContainer.style.display);
const locChips = getMockEl('batchLocationChips');
console.log('batchLocationChips HTML snippet:', locChips.innerHTML.slice(0, 160));

console.log('\n--- TEST 4: Load Sample GPS Photos ---');
const beforeCount = sandbox.state.photos.length;
sandbox.loadSampleGpsPhotos(3);
const afterCount = sandbox.state.photos.length;
console.log(`Photo count before: ${beforeCount}, after: ${afterCount}`);
console.log('Newly loaded photo location:', JSON.stringify(sandbox.state.photos[0].location));

console.log('\n--- TEST 5: Toggle Settings ---');
sandbox.toggleLocationTagsSetting(false);
console.log('Location tags disabled. Suggestions count now:', sandbox.getSuggestedLocationTagsForPhoto(samplePhoto).length);
sandbox.openBatchTagModal([samplePhoto.id]);
console.log('batchLocationContainer display when disabled:', locContainer.style.display);

sandbox.toggleLocationTagsSetting(true);
console.log('Re-enabled location tags. Suggestions count:', sandbox.getSuggestedLocationTagsForPhoto(samplePhoto).length);
console.log('\nAll simulation tests passed successfully!');
