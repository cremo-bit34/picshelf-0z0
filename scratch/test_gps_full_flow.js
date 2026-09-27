const fs = require('fs');

console.log('--- RUNNING FULL GPS METADATA & PARSING VALIDATION ---');

// Read app.js
const appJs = fs.readFileSync('web/app.js', 'utf8');

// Check that new functions exist
console.log('1. Checking function definitions in web/app.js:');
const checks = [
  'extractFullMetadata',
  'parseJpegMetadata',
  'parsePngMetadata',
  'parseWebPMetadata',
  'scanForTiffHeader',
  'resolveLocationOffline',
  'formatDisplayCoords',
  'resolveLocationFromCoords',
  'dock-location-pill',
  'card-loc-pill'
];

checks.forEach(fn => {
  const found = appJs.includes(fn);
  console.log(` - ${fn}: ${found ? 'FOUND' : 'MISSING'}`);
  if (!found) throw new Error(`Missing ${fn} in web/app.js!`);
});

// Check test_gps.jpg parsing
console.log('\n2. Testing extraction on synthetic test_gps.jpg:');
const testBuf = fs.readFileSync('scratch/test_gps.jpg');

// Extract the parser functions using eval in isolated scope
const sandbox = {};
const parserSnippet = appJs.substring(
  appJs.indexOf('function extractFullMetadata(buffer)'),
  appJs.indexOf('async function extractMetadataFromBlob(file)')
);

new Function('sandbox', `
  with(sandbox) {
    ${parserSnippet}
    sandbox.extractFullMetadata = extractFullMetadata;
    sandbox.extractFullExifFromBase64 = extractFullExifFromBase64;
    sandbox.formatDisplayCoords = formatDisplayCoords;
    sandbox.resolveLocationOffline = resolveLocationOffline;
  }
`)(sandbox);

const meta = sandbox.extractFullMetadata(testBuf.buffer.slice(testBuf.byteOffset, testBuf.byteOffset + testBuf.byteLength));
console.log('Extracted Metadata:', meta);

if (!meta || !meta.coords) {
  throw new Error('Failed to extract GPS coordinates from test_gps.jpg!');
}

console.log(`Lat: ${meta.coords.latitude}, Lon: ${meta.coords.longitude}`);
const formatted = sandbox.formatDisplayCoords(meta.coords.latitude, meta.coords.longitude);
console.log('Formatted Coords:', formatted);

const offlineLoc = sandbox.resolveLocationOffline(meta.coords.latitude, meta.coords.longitude);
console.log('Offline Location Result:', offlineLoc);

if (!offlineLoc || offlineLoc.city !== 'Paris') {
  throw new Error('Offline geocoder did not return Paris for 48.8584, 2.2945!');
}

// Test base64 extraction
const dataUrl = 'data:image/jpeg;base64,' + testBuf.toString('base64');
const base64Meta = sandbox.extractFullExifFromBase64(dataUrl);
console.log('Base64 Extraction Result:', base64Meta);

if (!base64Meta || !base64Meta.coords) {
  throw new Error('Failed to extract GPS from base64 data URL!');
}

console.log('\n--- ALL GPS METADATA VALIDATION CHECKS PASSED PERFECTLY ---');
