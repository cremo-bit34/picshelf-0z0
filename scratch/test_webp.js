// Add WebP and PNG chunk tests
const fs = require('fs');

function createWebpWithExif(lat, lon) {
  // RIFF size WEBP VP8X size EXIF size ...
  const tiff = fs.readFileSync('scratch/test_gps.jpg').slice(12, 12 + 136); // extract TIFF payload
  const exifChunk = Buffer.concat([
    Buffer.from('EXIF'),
    Buffer.alloc(4),
    Buffer.from('Exif\0\0'),
    tiff
  ]);
  exifChunk.writeUInt32LE(exifChunk.length - 8, 4);

  const riff = Buffer.concat([
    Buffer.from('RIFF'),
    Buffer.alloc(4),
    Buffer.from('WEBP'),
    Buffer.from([0x56, 0x50, 0x38, 0x58, 0x0A, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
    exifChunk
  ]);
  riff.writeUInt32LE(riff.length - 8, 4);
  return riff;
}

const webp = createWebpWithExif(48.8584, 2.2945);
fs.writeFileSync('scratch/test_gps.webp', webp);

// Test parser on WebP
const { execSync } = require('child_process');
const parserScript = fs.readFileSync('scratch/test_comprehensive_exif.js', 'utf8');
const testWebpCode = `
${parserScript}
const webpBuf = fs.readFileSync('scratch/test_gps.webp');
const webpRes = extractFullMetadata(webpBuf.buffer.slice(webpBuf.byteOffset, webpBuf.byteOffset + webpBuf.byteLength));
console.log('Result on WebP:', webpRes);
`;
fs.writeFileSync('scratch/test_webp_runner.js', testWebpCode);
console.log(execSync('node scratch/test_webp_runner.js').toString());
