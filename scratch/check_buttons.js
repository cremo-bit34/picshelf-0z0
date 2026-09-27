const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'web', 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, '..', 'web', 'app.js'), 'utf8');

// Check getElementById in JS
const getElemMatches = [...js.matchAll(/getElementById\(['"]([^'"]+)['"]\)/g)].map(m => m[1]);
const uniqueIds = [...new Set(getElemMatches)];
console.log('Total getElementById searched:', uniqueIds.length);
const missingIds = uniqueIds.filter(id => !html.includes('id="' + id + '"') && !html.includes("id='" + id + "'"));
console.log('Missing IDs in HTML:', missingIds);

// Check onclick handlers in HTML
const onclickMatches = [...html.matchAll(/onclick=["']([^()"' ]+)\(/g)].map(m => m[1]);
const uniqueOnclicks = [...new Set(onclickMatches)];
console.log('Total onclick functions:', uniqueOnclicks.length);
const missingFunctions = uniqueOnclicks.filter(fn => !js.includes('function ' + fn) && !js.includes(fn + ' =') && !js.includes('window.' + fn));
console.log('Missing JS functions for onclick in HTML:', missingFunctions);

// Check addEventListener on elements
const addEventMatches = [...js.matchAll(/getElementById\(['"]([^'"]+)['"]\)\.(addEventListener)/g)].map(m => m[1]);
console.log('addEventListener elements:', addEventMatches.length);
const missingListeners = addEventMatches.filter(id => !html.includes('id="' + id + '"') && !html.includes("id='" + id + "'"));
console.log('IDs with addEventListener missing in HTML (will throw null crash!):', missingListeners);
