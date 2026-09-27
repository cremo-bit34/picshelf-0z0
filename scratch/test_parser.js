const fs = require('fs');

const appJs = fs.readFileSync('web/app.js', 'utf8');

// Extract extractFullExifFromBuffer and its helper functions
const fnStart = appJs.indexOf('function extractFullExifFromBuffer(buffer) {');
const fnEnd = appJs.indexOf('function extractExifGpsFromBuffer(buffer) {');
const extractedCode = appJs.slice(fnStart, fnEnd);

const evalCode = `
${extractedCode}
module.exports = { extractFullExifFromBuffer };
`;

fs.writeFileSync('scratch/test_parser_runner.js', evalCode);
const { extractFullExifFromBuffer } = require('./scratch/test_parser_runner.js');

const buf = fs.readFileSync('scratch/test_gps.jpg');
const arrBuf = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

const result = extractFullExifFromBuffer(arrBuf);
console.log('Result on test_gps.jpg:', JSON.stringify(result, null, 2));
