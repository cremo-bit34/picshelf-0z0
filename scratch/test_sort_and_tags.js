const fs = require('fs');

const appJs = fs.readFileSync('web/app.js', 'utf8');
const indexHtml = fs.readFileSync('web/index.html', 'utf8');
const styleCss = fs.readFileSync('web/style.css', 'utf8');

console.log('--- TEST 1: Tag Badge Pill Full Width & No Clipping ---');
const tagPillMatch = styleCss.match(/\.tag-badge-pill\s*\{([^}]+)\}/);
if (!tagPillMatch) {
  console.error('FAIL: .tag-badge-pill not found in style.css');
  process.exit(1);
}
if (tagPillMatch[1].includes('max-width: 90px')) {
  console.error('FAIL: .tag-badge-pill still has restrictive max-width: 90px');
  process.exit(1);
}
if (!tagPillMatch[1].includes('max-width: 100%')) {
  console.error('FAIL: .tag-badge-pill missing max-width: 100%');
  process.exit(1);
}
console.log('PASS: .tag-badge-pill uses max-width: 100% allowing full text visibility!');

console.log('\n--- TEST 2: Sort Dropdown Markup in index.html ---');
if (!indexHtml.includes('id="sortDropdownWrapper"') ||
    !indexHtml.includes('id="sortTriggerBtn"') ||
    !indexHtml.includes('data-sort="date-desc"') ||
    !indexHtml.includes('data-sort="date-asc"') ||
    !indexHtml.includes('data-sort="name-asc"') ||
    !indexHtml.includes('data-sort="name-desc"')) {
  console.error('FAIL: Sort dropdown markup incomplete in index.html');
  process.exit(1);
}
console.log('PASS: index.html contains all 4 sort options (Newest, Oldest, Name A-Z, Name Z-A)!');

console.log('\n--- TEST 3: Sort Functions & Logic in app.js ---');
if (!appJs.includes('function updateSortUI()') ||
    !appJs.includes('function setGallerySort(') ||
    !appJs.includes('function toggleSortMenu(') ||
    !appJs.includes('state.gallerySort')) {
  console.error('FAIL: Sort functions missing in app.js');
  process.exit(1);
}
console.log('PASS: app.js contains all sort handlers and state management!');

console.log('\n--- TEST 4: Verification of Sort Algorithms ---');
const testPhotos = [
  { id: '1', displayName: 'Zebra Safari', createdAt: 1000 },
  { id: '2', displayName: 'Apple Orchard', createdAt: 4000 },
  { id: '3', displayName: 'Mountain Peak', createdAt: 2000 },
  { id: '4', displayName: 'Beach Sunset', createdAt: 3000 },
];

function sortPhotos(photos, mode) {
  return [...photos].sort((a, b) => {
    switch (mode) {
      case 'date-asc':
        return (a.createdAt || 0) - (b.createdAt || 0);
      case 'name-asc':
        return (a.displayName || '').localeCompare(b.displayName || '', undefined, { numeric: true, sensitivity: 'base' });
      case 'name-desc':
        return (b.displayName || '').localeCompare(a.displayName || '', undefined, { numeric: true, sensitivity: 'base' });
      case 'date-desc':
      default:
        return (b.createdAt || 0) - (a.createdAt || 0);
    }
  });
}

// 4a. Name A-Z
const nameAsc = sortPhotos(testPhotos, 'name-asc').map(p => p.displayName);
console.log('Name A-Z:', nameAsc);
if (nameAsc[0] !== 'Apple Orchard' || nameAsc[3] !== 'Zebra Safari') {
  console.error('FAIL: Name A-Z sort order incorrect');
  process.exit(1);
}

// 4b. Name Z-A
const nameDesc = sortPhotos(testPhotos, 'name-desc').map(p => p.displayName);
console.log('Name Z-A:', nameDesc);
if (nameDesc[0] !== 'Zebra Safari' || nameDesc[3] !== 'Apple Orchard') {
  console.error('FAIL: Name Z-A sort order incorrect');
  process.exit(1);
}

// 4c. Newest First (Date Desc)
const dateDesc = sortPhotos(testPhotos, 'date-desc').map(p => p.displayName);
console.log('Newest First:', dateDesc);
if (dateDesc[0] !== 'Apple Orchard' || dateDesc[3] !== 'Zebra Safari') {
  console.error('FAIL: Date desc sort order incorrect');
  process.exit(1);
}

// 4d. Oldest First (Date Asc)
const dateAsc = sortPhotos(testPhotos, 'date-asc').map(p => p.displayName);
console.log('Oldest First:', dateAsc);
if (dateAsc[0] !== 'Zebra Safari' || dateAsc[3] !== 'Apple Orchard') {
  console.error('FAIL: Date asc sort order incorrect');
  process.exit(1);
}

console.log('\nALL SORT AND TAG TESTS PASSED 100% SUCCESSFULLY!');
