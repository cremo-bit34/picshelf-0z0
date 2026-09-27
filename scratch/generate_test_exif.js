const fs = require('fs');

// Extract the functions from web/app.js to test them in isolation
const appJs = fs.readFileSync('web/app.js', 'utf8');

// Function to generate a minimal JPEG with EXIF APP1 containing GPS tags
function createJpegWithGps(lat, lon, latRef = 'N', lonRef = 'E') {
  // We will build a valid EXIF buffer
  // TIFF header: 0x4949 (II, Little Endian), 0x002A (42), 0x00000008 (IFD0 offset)
  // IFD0 has 1 entry: tag 0x8825 (GPS IFD), offset to GPS IFD
  // GPS IFD has entries:
  // 0x0001 (GPSLatitudeRef): ASCII, count 2, value "N\0"
  // 0x0002 (GPSLatitude): RATIONAL, count 3, offset to values
  // 0x0003 (GPSLongitudeRef): ASCII, count 2, value "E\0"
  // 0x0004 (GPSLongitude): RATIONAL, count 3, offset to values

  const tiffBuffer = Buffer.alloc(256);
  let p = 0;
  // TIFF Header
  tiffBuffer.write('II', p); p += 2; // Little Endian
  tiffBuffer.writeUInt16LE(42, p); p += 2;
  tiffBuffer.writeUInt32LE(8, p); p += 4; // IFD0 at offset 8

  // IFD0 at offset 8:
  // num entries = 1
  tiffBuffer.writeUInt16LE(1, p); p += 2;
  // Entry 1: 0x8825 (GPSInfo)
  tiffBuffer.writeUInt16LE(0x8825, p); p += 2; // Tag
  tiffBuffer.writeUInt16LE(4, p); p += 2; // LONG
  tiffBuffer.writeUInt32LE(1, p); p += 4; // count 1
  const gpsIfdOffset = 26; // right after IFD0 (8 + 2 + 12 + 4 = 26)
  tiffBuffer.writeUInt32LE(gpsIfdOffset, p); p += 4; // value offset
  tiffBuffer.writeUInt32LE(0, p); p += 4; // next IFD = 0

  // GPS IFD at offset 26:
  p = gpsIfdOffset;
  tiffBuffer.writeUInt16LE(4, p); p += 2; // 4 entries: latRef, lat, lonRef, lon

  // 1. GPSLatitudeRef (0x0001)
  tiffBuffer.writeUInt16LE(0x0001, p); p += 2;
  tiffBuffer.writeUInt16LE(2, p); p += 2; // ASCII
  tiffBuffer.writeUInt32LE(2, p); p += 4; // count 2
  tiffBuffer.write(latRef, p, 1, 'ascii'); p += 4; // 'N\0' in 4 bytes

  // 2. GPSLatitude (0x0002)
  const latDataOffset = 90;
  tiffBuffer.writeUInt16LE(0x0002, p); p += 2;
  tiffBuffer.writeUInt16LE(5, p); p += 2; // RATIONAL
  tiffBuffer.writeUInt32LE(3, p); p += 4; // count 3
  tiffBuffer.writeUInt32LE(latDataOffset, p); p += 4;

  // 3. GPSLongitudeRef (0x0003)
  tiffBuffer.writeUInt16LE(0x0003, p); p += 2;
  tiffBuffer.writeUInt16LE(2, p); p += 2; // ASCII
  tiffBuffer.writeUInt32LE(2, p); p += 4; // count 2
  tiffBuffer.write(lonRef, p, 1, 'ascii'); p += 4; // 'E\0' in 4 bytes

  // 4. GPSLongitude (0x0004)
  const lonDataOffset = latDataOffset + 24;
  tiffBuffer.writeUInt16LE(0x0004, p); p += 2;
  tiffBuffer.writeUInt16LE(5, p); p += 2; // RATIONAL
  tiffBuffer.writeUInt32LE(3, p); p += 4; // count 3
  tiffBuffer.writeUInt32LE(lonDataOffset, p); p += 4;
  tiffBuffer.writeUInt32LE(0, p); p += 4; // next IFD = 0

  // Write Latitude Rationals (deg, min, sec) at latDataOffset:
  const absLat = Math.abs(lat);
  const latD = Math.floor(absLat);
  const latM = Math.floor((absLat - latD) * 60);
  const latS = Math.round(((absLat - latD) * 60 - latM) * 60 * 1000);

  p = latDataOffset;
  tiffBuffer.writeUInt32LE(latD, p); p += 4; tiffBuffer.writeUInt32LE(1, p); p += 4;
  tiffBuffer.writeUInt32LE(latM, p); p += 4; tiffBuffer.writeUInt32LE(1, p); p += 4;
  tiffBuffer.writeUInt32LE(latS, p); p += 4; tiffBuffer.writeUInt32LE(1000, p); p += 4;

  // Write Longitude Rationals at lonDataOffset:
  const absLon = Math.abs(lon);
  const lonD = Math.floor(absLon);
  const lonM = Math.floor((absLon - lonD) * 60);
  const lonS = Math.round(((absLon - lonD) * 60 - lonM) * 60 * 1000);

  p = lonDataOffset;
  tiffBuffer.writeUInt32LE(lonD, p); p += 4; tiffBuffer.writeUInt32LE(1, p); p += 4;
  tiffBuffer.writeUInt32LE(lonM, p); p += 4; tiffBuffer.writeUInt32LE(1, p); p += 4;
  tiffBuffer.writeUInt32LE(lonS, p); p += 4; tiffBuffer.writeUInt32LE(1000, p); p += 4;

  // Now create APP1 segment
  // Header: 0xFFD8 (SOI)
  // Marker: 0xFFE1 (APP1)
  // Length: 2 + 6 (Exif\0\0) + tiffLength
  const exifHeader = Buffer.from('Exif\0\0', 'ascii');
  const tiffSlice = tiffBuffer.slice(0, lonDataOffset + 24);
  const app1Payload = Buffer.concat([exifHeader, tiffSlice]);
  const app1Length = app1Payload.length + 2;

  const app1Buf = Buffer.alloc(4);
  app1Buf.writeUInt16BE(0xFFE1, 0);
  app1Buf.writeUInt16BE(app1Length, 2);

  const soi = Buffer.from([0xFF, 0xD8]);
  const eoi = Buffer.from([0xFF, 0xD9]);

  return Buffer.concat([soi, app1Buf, app1Payload, eoi]);
}

const testJpeg = createJpegWithGps(48.8584, 2.2945, 'N', 'E');
fs.writeFileSync('scratch/test_gps.jpg', testJpeg);
console.log('Created scratch/test_gps.jpg, size:', testJpeg.length);
