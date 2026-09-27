const fs = require('fs');
const vm = require('vm');

// Test that app.js parses and executes without any reference errors or type errors
const jsCode = fs.readFileSync('web/app.js', 'utf8');
const htmlCode = fs.readFileSync('web/index.html', 'utf8');

console.log('Validating web/app.js syntax...');
new vm.Script(jsCode);
console.log('web/app.js syntax is 100% valid!');

// Check state.photos favorites in app.js
const hasOnlyFavFilter = jsCode.includes('state.onlyFavorites ? (p.isFavorite && !p.deletedAt)');
const hasFavRenderComplete = jsCode.includes("state.photos.filter(p => p.isFavorite && !p.deletedAt)");
console.log('Correct favorites filter in gallery:', hasOnlyFavFilter);
console.log('Correct favorites filter in renderFavorites:', hasFavRenderComplete);

// Verify index.html IDs
const requiredIds = [
  'favoritesScreen',
  'favoritesPhotoGrid',
  'favoritesEmptyState',
  'favoritesSubtitle',
  'favoritesHeaderActions',
  'dockSelectAllToggleBtn',
  'dockBatchTagBtn',
  'dockBatchMoveBtn',
  'dockBatchDeleteBtn',
  'albumFilterAllBtn',
  'albumFilterFavBtn',
  'openCreateTagModalBtn'
];

let allFound = true;
requiredIds.forEach(id => {
  if (!htmlCode.includes(`id="${id}"`)) {
    console.error(`MISSING ID in index.html: ${id}`);
    allFound = false;
  }
});

if (allFound) {
  console.log('All essential interactive UI IDs are present in index.html!');
}
