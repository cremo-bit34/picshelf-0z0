
const fs = require('fs');

// We will build a robust multi-format EXIF & XMP extractor
function extractFullMetadata(buffer) {
  if (!buffer || buffer.byteLength < 12) return null;
  const view = new DataView(buffer);
  const u8 = new Uint8Array(buffer);

  // 1. Check for JPEG (SOI: 0xFFD8)
  if (view.getUint16(0, false) === 0xFFD8) {
    return parseJpeg(view, u8);
  }

  // 2. Check for PNG (\x89PNG\r\n\x1a\n)
  if (view.getUint32(0, false) === 0x89504E47 && view.getUint32(4, false) === 0x0D0A1A0A) {
    return parsePng(view, u8);
  }

  // 3. Check for WebP (RIFF....WEBP)
  if (view.getUint32(0, false) === 0x52494646 && view.getUint32(8, false) === 0x57454250) {
    return parseWebP(view, u8);
  }

  // 4. Check for HEIC / AVIF / QuickTime (ftyp)
  if (view.getUint32(4, false) === 0x66747970) {
    return parseIsoBmff(view, u8);
  }

  // Fallback: search for Exif header in the first 64KB
  return scanForTiffHeader(view, u8);
}

// -------------------------------------------------------------
// JPEG Parser: Handles fill bytes, APP1 Exif & APP1 XMP
// -------------------------------------------------------------
function parseJpeg(view, u8) {
  let offset = 2;
  let exifResult = null;
  let xmpResult = null;

  while (offset < view.byteLength - 4) {
    // Skip fill bytes 0xFF
    if (u8[offset] !== 0xFF) {
      offset++;
      continue;
    }
    while (offset < view.byteLength && u8[offset] === 0xFF) {
      offset++;
    }
    if (offset >= view.byteLength) break;

    const marker = u8[offset++];
    if (marker === 0xDA || marker === 0xD9) break; // SOS (Start of Scan) or EOI

    if (offset + 2 > view.byteLength) break;
    const size = view.getUint16(offset, false);
    if (size < 2 || offset + size > view.byteLength) break;

    if (marker === 0xE1) { // APP1
      // Check for Exif\0\0
      if (offset + 8 <= view.byteLength &&
          u8[offset + 2] === 0x45 && u8[offset + 3] === 0x78 &&
          u8[offset + 4] === 0x69 && u8[offset + 5] === 0x66 &&
          u8[offset + 6] === 0x00 && u8[offset + 7] === 0x00) {
        const tiffStart = offset + 8;
        exifResult = parseTiff(view, tiffStart);
      } else {
        // Check for XMP: http://ns.adobe.com/xap/1.0/\0
        const xmpHeader = 'http://ns.adobe.com/xap/1.0/';
        let isXmp = true;
        for (let i = 0; i < xmpHeader.length; i++) {
          if (u8[offset + 2 + i] !== xmpHeader.charCodeAt(i)) {
            isXmp = false;
            break;
          }
        }
        if (isXmp) {
          const xmpStart = offset + 2 + xmpHeader.length + 1;
          const xmpLen = size - 2 - xmpHeader.length - 1;
          xmpResult = parseXmpString(u8, xmpStart, xmpLen);
        }
      }
    }
    offset += size;
  }

  return mergeMetadata(exifResult, xmpResult);
}

// -------------------------------------------------------------
// PNG Parser: Checks eXIf chunk and XMP text chunks
// -------------------------------------------------------------
function parsePng(view, u8) {
  let offset = 8;
  let exifResult = null;
  let xmpResult = null;

  while (offset < view.byteLength - 8) {
    const len = view.getUint32(offset, false);
    const chunkType = String.fromCharCode(u8[offset + 4], u8[offset + 5], u8[offset + 6], u8[offset + 7]);
    const dataOffset = offset + 8;

    if (chunkType === 'eXIf' && dataOffset + len <= view.byteLength) {
      exifResult = parseTiff(view, dataOffset);
    } else if ((chunkType === 'iTXt' || chunkType === 'tEXt') && dataOffset + len <= view.byteLength) {
      const text = decodeUtf8(u8, dataOffset, len);
      if (text.includes('xmp') || text.includes('GPS')) {
        xmpResult = parseXmpText(text);
      }
    }
    offset += 12 + len;
  }
  return mergeMetadata(exifResult, xmpResult);
}

// -------------------------------------------------------------
// WebP Parser: Checks EXIF chunk & XMP chunk
// -------------------------------------------------------------
function parseWebP(view, u8) {
  let offset = 12; // after RIFF + size + WEBP
  let exifResult = null;
  let xmpResult = null;

  while (offset < view.byteLength - 8) {
    const chunkTag = String.fromCharCode(u8[offset], u8[offset + 1], u8[offset + 2], u8[offset + 3]);
    const chunkSize = view.getUint32(offset + 4, true); // Little endian
    const dataOffset = offset + 8;

    if (chunkTag === 'EXIF' && dataOffset + chunkSize <= view.byteLength) {
      // Sometimes WebP prepends Exif\0\0
      let tiffOffset = dataOffset;
      if (u8[dataOffset] === 0x45 && u8[dataOffset + 1] === 0x78) {
        tiffOffset += 6;
      }
      exifResult = parseTiff(view, tiffOffset);
    } else if (chunkTag === 'XMP ' && dataOffset + chunkSize <= view.byteLength) {
      const text = decodeUtf8(u8, dataOffset, chunkSize);
      xmpResult = parseXmpText(text);
    }
    offset += 8 + chunkSize + (chunkSize % 2); // padded to even
  }
  return mergeMetadata(exifResult, xmpResult);
}

// -------------------------------------------------------------
// ISO-BMFF (HEIC / AVIF) Parser: Scans meta box -> Exif
// -------------------------------------------------------------
function parseIsoBmff(view, u8) {
  return scanForTiffHeader(view, u8);
}

// Fallback TIFF scanner
function scanForTiffHeader(view, u8) {
  const maxScan = Math.min(view.byteLength - 16, 262144);
  for (let i = 0; i < maxScan; i++) {
    // Look for 'II*\0' or 'MM\0*'
    if ((u8[i] === 0x49 && u8[i + 1] === 0x49 && u8[i + 2] === 0x2A && u8[i + 3] === 0x00) ||
        (u8[i] === 0x4D && u8[i + 1] === 0x4D && u8[i + 2] === 0x00 && u8[i + 3] === 0x2A)) {
      const res = parseTiff(view, i);
      if (res && (res.coords || res.cameraModel || res.timestamp)) return res;
    }
  }
  return null;
}

// -------------------------------------------------------------
// TIFF Header & IFD Parser
// -------------------------------------------------------------
function parseTiff(view, tiffStart) {
  if (tiffStart + 8 > view.byteLength) return null;
  const isLittleEndian = view.getUint16(tiffStart, false) === 0x4949;
  const magic = view.getUint16(tiffStart + 2, isLittleEndian);
  if (magic !== 42) return null;

  const ifd0Offset = view.getUint32(tiffStart + 4, isLittleEndian);
  let ifdOffset = tiffStart + ifd0Offset;
  if (ifdOffset + 2 > view.byteLength) return null;

  function readStr(offset, count) {
    let s = '';
    for (let i = 0; i < count; i++) {
      const c = view.getUint8(offset + i);
      if (c === 0) break;
      s += String.fromCharCode(c);
    }
    return s.trim();
  }

  function readRationals(offset, count = 3) {
    const vals = [];
    for (let i = 0; i < count; i++) {
      const num = view.getUint32(offset + (i * 8), isLittleEndian);
      const den = view.getUint32(offset + (i * 8) + 4, isLittleEndian);
      vals.push(den ? (num / den) : 0);
    }
    return vals;
  }

  const numEntries = view.getUint16(ifdOffset, isLittleEndian);
  let make = '', model = '', dateTaken = null, exifSubOffset = null, gpsIfdOffset = null;

  for (let i = 0; i < numEntries; i++) {
    const entry = ifdOffset + 2 + (i * 12);
    if (entry + 12 > view.byteLength) break;
    const tag = view.getUint16(entry, isLittleEndian);
    const type = view.getUint16(entry + 2, isLittleEndian);
    const count = view.getUint32(entry + 4, isLittleEndian);

    const valOffset = (type === 1 || type === 2 || type === 7) && count <= 4
      ? (entry + 8)
      : (type === 3 && count <= 2)
      ? (entry + 8)
      : (type === 4 && count === 1)
      ? (entry + 8)
      : (tiffStart + view.getUint32(entry + 8, isLittleEndian));

    if (tag === 0x010F && valOffset + count <= view.byteLength) { // Make
      make = readStr(valOffset, count);
    } else if (tag === 0x0110 && valOffset + count <= view.byteLength) { // Model
      model = readStr(valOffset, count);
    } else if (tag === 0x0132 && valOffset + count <= view.byteLength) { // DateTime
      dateTaken = readStr(valOffset, count);
    } else if (tag === 0x8769) { // Exif SubIFD
      exifSubOffset = view.getUint32(entry + 8, isLittleEndian);
    } else if (tag === 0x8825) { // GPS Info IFD
      gpsIfdOffset = view.getUint32(entry + 8, isLittleEndian);
    }
  }

  // Parse SubIFD for original date
  if (exifSubOffset !== null && tiffStart + exifSubOffset + 2 <= view.byteLength) {
    const subOffset = tiffStart + exifSubOffset;
    const subEntries = view.getUint16(subOffset, isLittleEndian);
    for (let i = 0; i < subEntries; i++) {
      const entry = subOffset + 2 + (i * 12);
      if (entry + 12 > view.byteLength) break;
      const tag = view.getUint16(entry, isLittleEndian);
      const count = view.getUint32(entry + 4, isLittleEndian);
      if (tag === 0x9003 || (!dateTaken && tag === 0x9004)) { // DateTimeOriginal / DateTimeDigitized
        const valOffset = count <= 4 ? (entry + 8) : (tiffStart + view.getUint32(entry + 8, isLittleEndian));
        if (valOffset + count <= view.byteLength) {
          const s = readStr(valOffset, count);
          if (s) dateTaken = s;
        }
      }
    }
  }

  // Parse GPS IFD
  let coords = null;
  if (gpsIfdOffset !== null && tiffStart + gpsIfdOffset + 2 <= view.byteLength) {
    const gpsOffset = tiffStart + gpsIfdOffset;
    const gpsEntries = view.getUint16(gpsOffset, isLittleEndian);
    let latRef = 'N', lonRef = 'E';
    let latValues = null, lonValues = null;

    for (let i = 0; i < gpsEntries; i++) {
      const entry = gpsOffset + 2 + (i * 12);
      if (entry + 12 > view.byteLength) break;
      const tag = view.getUint16(entry, isLittleEndian);
      const count = view.getUint32(entry + 4, isLittleEndian);

      if (tag === 0x0001) { // GPSLatitudeRef
        latRef = String.fromCharCode(view.getUint8(entry + 8)).toUpperCase();
      } else if (tag === 0x0002) { // GPSLatitude
        const valOffset = tiffStart + view.getUint32(entry + 8, isLittleEndian);
        if (valOffset + (count * 8) <= view.byteLength) {
          latValues = readRationals(valOffset, Math.min(count, 3));
        }
      } else if (tag === 0x0003) { // GPSLongitudeRef
        lonRef = String.fromCharCode(view.getUint8(entry + 8)).toUpperCase();
      } else if (tag === 0x0004) { // GPSLongitude
        const valOffset = tiffStart + view.getUint32(entry + 8, isLittleEndian);
        if (valOffset + (count * 8) <= view.byteLength) {
          lonValues = readRationals(valOffset, Math.min(count, 3));
        }
      }
    }

    if (latValues && lonValues && latValues.length >= 1 && lonValues.length >= 1) {
      let lat = latValues[0] + (latValues[1] ? latValues[1] / 60 : 0) + (latValues[2] ? latValues[2] / 3600 : 0);
      let lon = lonValues[0] + (lonValues[1] ? lonValues[1] / 60 : 0) + (lonValues[2] ? lonValues[2] / 3600 : 0);
      if (latRef === 'S') lat = -lat;
      if (lonRef === 'W') lon = -lon;
      if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180 && !(lat === 0 && lon === 0)) {
        coords = { latitude: lat, longitude: lon };
      }
    }
  }

  let timestamp = null;
  if (dateTaken) {
    const m = dateTaken.match(/^([0-9]{4})[:\/]([0-9]{2})[:\/]([0-9]{2})\s+([0-9]{2}):([0-9]{2}):([0-9]{2})/);
    if (m) {
      timestamp = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]), parseInt(m[4]), parseInt(m[5]), parseInt(m[6])).getTime();
    }
  }

  let cameraModel = '';
  if (make && model) {
    cameraModel = model.toLowerCase().startsWith(make.toLowerCase()) ? model : `${make} ${model}`;
  } else if (model) {
    cameraModel = model;
  } else if (make) {
    cameraModel = make;
  }

  return {
    coords,
    cameraModel: cameraModel.trim() || null,
    dateTakenStr: dateTaken,
    timestamp
  };
}

// -------------------------------------------------------------
// XMP Packet XML Parser (Handles Adobe / Smartphone XMP GPS)
// -------------------------------------------------------------
function parseXmpString(u8, start, len) {
  const text = decodeUtf8(u8, start, len);
  return parseXmpText(text);
}

function parseXmpText(text) {
  if (!text) return null;
  let coords = null;
  let cameraModel = null;
  let timestamp = null;

  // 1. Check for exif:GPSLatitude & exif:GPSLongitude
  const latMatch = text.match(/(?:exif:GPSLatitude|GPSLatitude)=["']([^"']+)["']/i);
  const lonMatch = text.match(/(?:exif:GPSLongitude|GPSLongitude)=["']([^"']+)["']/i);

  if (latMatch && lonMatch) {
    const lat = parseXmpCoord(latMatch[1]);
    const lon = parseXmpCoord(lonMatch[1]);
    if (lat !== null && lon !== null) {
      coords = { latitude: lat, longitude: lon };
    }
  }

  // 2. Check camera make and model in XMP
  const makeMatch = text.match(/(?:tiff:Make|Make)=["']([^"']+)["']/i) || text.match(/<tiff:Make>([^<]+)<\/tiff:Make>/i);
  const modelMatch = text.match(/(?:tiff:Model|Model)=["']([^"']+)["']/i) || text.match(/<tiff:Model>([^<]+)<\/tiff:Model>/i);
  if (makeMatch || modelMatch) {
    const make = makeMatch ? makeMatch[1].trim() : '';
    const model = modelMatch ? modelMatch[1].trim() : '';
    cameraModel = make && model ? (model.startsWith(make) ? model : `${make} ${model}`) : (model || make);
  }

  // 3. Check date in XMP
  const dateMatch = text.match(/(?:exif:DateTimeOriginal|xmp:CreateDate|photoshop:DateCreated)=["']([^"']+)["']/i) ||
                    text.match(/<(?:exif:DateTimeOriginal|xmp:CreateDate)>([^<]+)<\//i);
  if (dateMatch) {
    const d = new Date(dateMatch[1]);
    if (!isNaN(d.getTime())) timestamp = d.getTime();
  }

  return { coords, cameraModel, timestamp };
}

function parseXmpCoord(str) {
  str = str.trim();
  // Format 1: 48,51.4883N or 48,51,29.3N
  const dms = str.match(/^([0-9.]+)[, ]+([0-9.]+)(?:[, ]+([0-9.]+))?([NSEW])?$/i);
  if (dms) {
    let d = parseFloat(dms[1]) || 0;
    let m = parseFloat(dms[2]) || 0;
    let s = parseFloat(dms[3]) || 0;
    let ref = (dms[4] || '').toUpperCase();
    let val = d + (m / 60) + (s / 3600);
    if (ref === 'S' || ref === 'W') val = -val;
    return val;
  }
  // Format 2: Direct decimal -48.8584
  const dec = parseFloat(str);
  return isNaN(dec) ? null : dec;
}

function decodeUtf8(u8, start, len) {
  try {
    const slice = u8.subarray(start, Math.min(start + len, u8.length));
    return new TextDecoder('utf-8', { fatal: false }).decode(slice);
  } catch (_) {
    let s = '';
    const end = Math.min(start + len, u8.length);
    for (let i = start; i < end; i++) s += String.fromCharCode(u8[i]);
    return s;
  }
}

function mergeMetadata(exif, xmp) {
  if (!exif && !xmp) return null;
  return {
    coords: (exif && exif.coords) || (xmp && xmp.coords) || null,
    cameraModel: (exif && exif.cameraModel) || (xmp && xmp.cameraModel) || null,
    timestamp: (exif && exif.timestamp) || (xmp && xmp.timestamp) || null,
    dateTakenStr: (exif && exif.dateTakenStr) || null
  };
}

// Test with our generated test_gps.jpg
const testBuf = fs.readFileSync('scratch/test_gps.jpg');
const res = extractFullMetadata(testBuf.buffer.slice(testBuf.byteOffset, testBuf.byteOffset + testBuf.byteLength));
console.log('Result on test_gps.jpg:', res);

// Test with XMP String
const sampleXmp = `
  <x:xmpmeta xmlns:x="adobe:ns:meta/">
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
      <rdf:Description rdf:about=""
        xmlns:exif="http://ns.adobe.com/exif/1.0/"
        xmlns:tiff="http://ns.adobe.com/tiff/1.0/"
        exif:GPSLatitude="48,51.4883N"
        exif:GPSLongitude="2,17.6367E"
        tiff:Make="Apple"
        tiff:Model="iPhone 15 Pro">
      </rdf:Description>
    </rdf:RDF>
  </x:xmpmeta>
`;
const xmpRes = parseXmpText(sampleXmp);
console.log('Result on XMP text:', xmpRes);

const webpBuf = fs.readFileSync('scratch/test_gps.webp');
const webpRes = extractFullMetadata(webpBuf.buffer.slice(webpBuf.byteOffset, webpBuf.byteOffset + webpBuf.byteLength));
console.log('Result on WebP:', webpRes);
