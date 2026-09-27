const fs = require('fs');

console.log('Starting GPS Metadata & Multi-Format EXIF Engine Injection...');

// 1. Read web/app.js
let appJs = fs.readFileSync('web/app.js', 'utf8');

// Build the multi-format extractor code string
const multiFormatExtractorCode = `
  // -------------------------------------------------------------
  // UNIVERSAL MULTI-FORMAT EXIF & XMP EXTRACTION ENGINE
  // Supports: JPEG (with marker padding/fill bytes & APP1/XMP),
  //           PNG (eXIf & iTXt/tEXt chunks),
  //           WebP (EXIF & XMP chunks),
  //           TIFF / DNG / RAW (II/MM headers),
  //           ISO-BMFF (HEIC / AVIF).
  // -------------------------------------------------------------
  function extractFullMetadata(buffer) {
    if (!buffer || buffer.byteLength < 12) return null;
    try {
      const view = new DataView(buffer);
      const u8 = new Uint8Array(buffer);

      // 1. Check for JPEG (SOI: 0xFFD8)
      if (view.getUint16(0, false) === 0xFFD8) {
        return parseJpegMetadata(view, u8);
      }

      // 2. Check for PNG (\x89PNG\r\n\x1a\n)
      if (view.getUint32(0, false) === 0x89504E47 && view.getUint32(4, false) === 0x0D0A1A0A) {
        return parsePngMetadata(view, u8);
      }

      // 3. Check for WebP (RIFF....WEBP)
      if (view.getUint32(0, false) === 0x52494646 && view.getUint32(8, false) === 0x57454250) {
        return parseWebPMetadata(view, u8);
      }

      // 4. Fallback: TIFF Header or ISO-BMFF search
      return scanForTiffHeader(view, u8);
    } catch (e) {
      console.warn('Metadata extraction error:', e);
      return null;
    }
  }

  function parseJpegMetadata(view, u8) {
    let offset = 2;
    let exifResult = null;
    let xmpResult = null;

    while (offset < view.byteLength - 4) {
      if (u8[offset] !== 0xFF) {
        offset++;
        continue;
      }
      while (offset < view.byteLength && u8[offset] === 0xFF) {
        offset++;
      }
      if (offset >= view.byteLength) break;

      const marker = u8[offset++];
      if (marker === 0xDA || marker === 0xD9) break; // SOS or EOI

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
          exifResult = parseTiffStructure(view, tiffStart);
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

    return mergeMetadataResults(exifResult, xmpResult);
  }

  function parsePngMetadata(view, u8) {
    let offset = 8;
    let exifResult = null;
    let xmpResult = null;

    while (offset < view.byteLength - 8) {
      const len = view.getUint32(offset, false);
      const chunkType = String.fromCharCode(u8[offset + 4], u8[offset + 5], u8[offset + 6], u8[offset + 7]);
      const dataOffset = offset + 8;

      if (chunkType === 'eXIf' && dataOffset + len <= view.byteLength) {
        exifResult = parseTiffStructure(view, dataOffset);
      } else if ((chunkType === 'iTXt' || chunkType === 'tEXt') && dataOffset + len <= view.byteLength) {
        const text = decodeUtf8Safe(u8, dataOffset, len);
        if (text.includes('xmp') || text.includes('GPS')) {
          xmpResult = parseXmpText(text);
        }
      }
      offset += 12 + len;
    }
    return mergeMetadataResults(exifResult, xmpResult);
  }

  function parseWebPMetadata(view, u8) {
    let offset = 12;
    let exifResult = null;
    let xmpResult = null;

    while (offset < view.byteLength - 8) {
      const chunkTag = String.fromCharCode(u8[offset], u8[offset + 1], u8[offset + 2], u8[offset + 3]);
      const chunkSize = view.getUint32(offset + 4, true);
      const dataOffset = offset + 8;

      if (chunkTag === 'EXIF' && dataOffset + chunkSize <= view.byteLength) {
        let tiffOffset = dataOffset;
        if (u8[dataOffset] === 0x45 && u8[dataOffset + 1] === 0x78) {
          tiffOffset += 6;
        }
        exifResult = parseTiffStructure(view, tiffOffset);
      } else if (chunkTag === 'XMP ' && dataOffset + chunkSize <= view.byteLength) {
        const text = decodeUtf8Safe(u8, dataOffset, chunkSize);
        xmpResult = parseXmpText(text);
      }
      offset += 8 + chunkSize + (chunkSize % 2);
    }
    return mergeMetadataResults(exifResult, xmpResult);
  }

  function scanForTiffHeader(view, u8) {
    const maxScan = Math.min(view.byteLength - 16, 262144);
    for (let i = 0; i < maxScan; i++) {
      if ((u8[i] === 0x49 && u8[i + 1] === 0x49 && u8[i + 2] === 0x2A && u8[i + 3] === 0x00) ||
          (u8[i] === 0x4D && u8[i + 1] === 0x4D && u8[i + 2] === 0x00 && u8[i + 3] === 0x2A)) {
        const res = parseTiffStructure(view, i);
        if (res && (res.coords || res.cameraModel || res.timestamp)) return res;
      }
    }
    return null;
  }

  function parseTiffStructure(view, tiffStart) {
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

      if (tag === 0x010F && valOffset + count <= view.byteLength) {
        make = readStr(valOffset, count);
      } else if (tag === 0x0110 && valOffset + count <= view.byteLength) {
        model = readStr(valOffset, count);
      } else if (tag === 0x0132 && valOffset + count <= view.byteLength) {
        dateTaken = readStr(valOffset, count);
      } else if (tag === 0x8769) {
        exifSubOffset = view.getUint32(entry + 8, isLittleEndian);
      } else if (tag === 0x8825) {
        gpsIfdOffset = view.getUint32(entry + 8, isLittleEndian);
      }
    }

    // SubIFD for original date
    if (exifSubOffset !== null && tiffStart + exifSubOffset + 2 <= view.byteLength) {
      const subOffset = tiffStart + exifSubOffset;
      const subEntries = view.getUint16(subOffset, isLittleEndian);
      for (let i = 0; i < subEntries; i++) {
        const entry = subOffset + 2 + (i * 12);
        if (entry + 12 > view.byteLength) break;
        const tag = view.getUint16(entry, isLittleEndian);
        const count = view.getUint32(entry + 4, isLittleEndian);
        if (tag === 0x9003 || (!dateTaken && tag === 0x9004)) {
          const valOffset = count <= 4 ? (entry + 8) : (tiffStart + view.getUint32(entry + 8, isLittleEndian));
          if (valOffset + count <= view.byteLength) {
            const s = readStr(valOffset, count);
            if (s) dateTaken = s;
          }
        }
      }
    }

    // GPS Info IFD
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

        if (tag === 0x0001) {
          latRef = String.fromCharCode(view.getUint8(entry + 8)).toUpperCase();
        } else if (tag === 0x0002) {
          const valOffset = tiffStart + view.getUint32(entry + 8, isLittleEndian);
          if (valOffset + (count * 8) <= view.byteLength) {
            latValues = readRationals(valOffset, Math.min(count, 3));
          }
        } else if (tag === 0x0003) {
          lonRef = String.fromCharCode(view.getUint8(entry + 8)).toUpperCase();
        } else if (tag === 0x0004) {
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
      const m = dateTaken.match(/^([0-9]{4})[:\/]([0-9]{2})[:\/]([0-9]{2})\\s+([0-9]{2}):([0-9]{2}):([0-9]{2})/);
      if (m) {
        timestamp = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]), parseInt(m[4]), parseInt(m[5]), parseInt(m[6])).getTime();
      }
    }

    let cameraModel = '';
    if (make && model) {
      cameraModel = model.toLowerCase().startsWith(make.toLowerCase()) ? model : \`\${make} \${model}\`;
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

  function parseXmpString(u8, start, len) {
    const text = decodeUtf8Safe(u8, start, len);
    return parseXmpText(text);
  }

  function parseXmpText(text) {
    if (!text) return null;
    let coords = null;
    let cameraModel = null;
    let timestamp = null;

    const latMatch = text.match(/(?:exif:GPSLatitude|GPSLatitude)=["']([^"']+)["']/i);
    const lonMatch = text.match(/(?:exif:GPSLongitude|GPSLongitude)=["']([^"']+)["']/i);

    if (latMatch && lonMatch) {
      const lat = parseXmpCoord(latMatch[1]);
      const lon = parseXmpCoord(lonMatch[1]);
      if (lat !== null && lon !== null) {
        coords = { latitude: lat, longitude: lon };
      }
    }

    const makeMatch = text.match(/(?:tiff:Make|Make)=["']([^"']+)["']/i) || text.match(/<tiff:Make>([^<]+)<\\/tiff:Make>/i);
    const modelMatch = text.match(/(?:tiff:Model|Model)=["']([^"']+)["']/i) || text.match(/<tiff:Model>([^<]+)<\\/tiff:Model>/i);
    if (makeMatch || modelMatch) {
      const make = makeMatch ? makeMatch[1].trim() : '';
      const model = modelMatch ? modelMatch[1].trim() : '';
      cameraModel = make && model ? (model.startsWith(make) ? model : \`\${make} \${model}\`) : (model || make);
    }

    const dateMatch = text.match(/(?:exif:DateTimeOriginal|xmp:CreateDate|photoshop:DateCreated)=["']([^"']+)["']/i) ||
                      text.match(/<(?:exif:DateTimeOriginal|xmp:CreateDate)>([^<]+)<\\//i);
    if (dateMatch) {
      const d = new Date(dateMatch[1]);
      if (!isNaN(d.getTime())) timestamp = d.getTime();
    }

    return { coords, cameraModel, timestamp };
  }

  function parseXmpCoord(str) {
    str = str.trim();
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
    const dec = parseFloat(str);
    return isNaN(dec) ? null : dec;
  }

  function decodeUtf8Safe(u8, start, len) {
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

  function mergeMetadataResults(exif, xmp) {
    if (!exif && !xmp) return null;
    return {
      coords: (exif && exif.coords) || (xmp && xmp.coords) || null,
      cameraModel: (exif && exif.cameraModel) || (xmp && xmp.cameraModel) || null,
      timestamp: (exif && exif.timestamp) || (xmp && xmp.timestamp) || null,
      dateTakenStr: (exif && exif.dateTakenStr) || null
    };
  }

  function extractFullExifFromBuffer(buffer) {
    return extractFullMetadata(buffer);
  }

  function extractExifGpsFromBuffer(buffer) {
    const full = extractFullMetadata(buffer);
    return full ? full.coords : null;
  }

  function extractFullExifFromBase64(dataUrl) {
    if (!dataUrl) return null;
    try {
      const commaIdx = dataUrl.indexOf(',');
      const base64Str = commaIdx !== -1 ? dataUrl.slice(commaIdx + 1) : dataUrl;
      const safeLen = Math.min(base64Str.length, 524288);
      const validLen = safeLen - (safeLen % 4);
      const raw = atob(base64Str.slice(0, validLen));
      const len = raw.length;
      const u8 = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        u8[i] = raw.charCodeAt(i);
      }
      return extractFullMetadata(u8.buffer);
    } catch (_) {
      return null;
    }
  }

  function extractGpsFromBase64(dataUrl) {
    const full = extractFullExifFromBase64(dataUrl);
    return full ? full.coords : null;
  }

  function formatDisplayCoords(lat, lon) {
    if (typeof lat !== 'number' || typeof lon !== 'number' || isNaN(lat) || isNaN(lon)) return '';
    const latRef = lat >= 0 ? 'N' : 'S';
    const lonRef = lon >= 0 ? 'E' : 'W';
    return \`\${Math.abs(lat).toFixed(4)}° \${latRef}, \${Math.abs(lon).toFixed(4)}° \${lonRef}\`;
  }

  // -------------------------------------------------------------
  // INSTANT OFFLINE REVERSE GEOCODER DICTIONARY (0ms response)
  // Ensures photos IMMEDIATELY have city & country even offline!
  // -------------------------------------------------------------
  const OFFLINE_PLACES = [
    // Europe
    { place: 'Eiffel Tower', city: 'Paris', country: 'France', lat: 48.8584, lon: 2.2945, r: 0.25 },
    { place: 'Central Paris', city: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522, r: 0.5 },
    { place: 'Big Ben & Westminster', city: 'London', country: 'United Kingdom', lat: 51.4995, lon: -0.1248, r: 0.25 },
    { place: 'Greater London', city: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278, r: 0.6 },
    { place: 'Colosseum', city: 'Rome', country: 'Italy', lat: 41.8902, lon: 12.4922, r: 0.25 },
    { place: 'Central Rome', city: 'Rome', country: 'Italy', lat: 41.9028, lon: 12.4964, r: 0.4 },
    { place: 'Sagrada Familia', city: 'Barcelona', country: 'Spain', lat: 41.4036, lon: 2.1744, r: 0.25 },
    { place: 'Barcelona', city: 'Barcelona', country: 'Spain', lat: 41.3879, lon: 2.1699, r: 0.4 },
    { place: 'Madrid', city: 'Madrid', country: 'Spain', lat: 40.4168, lon: -3.7038, r: 0.5 },
    { place: 'Brandenburg Gate', city: 'Berlin', country: 'Germany', lat: 52.5163, lon: 13.3777, r: 0.3 },
    { place: 'Berlin', city: 'Berlin', country: 'Germany', lat: 52.5200, lon: 13.4050, r: 0.5 },
    { place: 'Amsterdam Canals', city: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lon: 4.9041, r: 0.35 },
    { place: 'Vienna', city: 'Vienna', country: 'Austria', lat: 48.2082, lon: 16.3738, r: 0.35 },
    { place: 'Prague Castle', city: 'Prague', country: 'Czechia', lat: 50.0755, lon: 14.4378, r: 0.35 },
    { place: 'Zurich', city: 'Zurich', country: 'Switzerland', lat: 47.3769, lon: 8.5417, r: 0.35 },
    { place: 'Athens Acropolis', city: 'Athens', country: 'Greece', lat: 37.9715, lon: 23.7257, r: 0.35 },

    // North America
    { place: 'Times Square & Manhattan', city: 'New York', country: 'United States', lat: 40.7580, lon: -73.9855, r: 0.25 },
    { place: 'New York City', city: 'New York', country: 'United States', lat: 40.7128, lon: -74.0060, r: 0.6 },
    { place: 'Golden Gate Bridge', city: 'San Francisco', country: 'United States', lat: 37.8199, lon: -122.4783, r: 0.25 },
    { place: 'San Francisco', city: 'San Francisco', country: 'United States', lat: 37.7749, lon: -122.4194, r: 0.4 },
    { place: 'Hollywood & Downtown', city: 'Los Angeles', country: 'United States', lat: 34.0522, lon: -118.2437, r: 0.8 },
    { place: 'Las Vegas Strip', city: 'Las Vegas', country: 'United States', lat: 36.1699, lon: -115.1398, r: 0.4 },
    { place: 'Chicago Loop', city: 'Chicago', country: 'United States', lat: 41.8781, lon: -87.6298, r: 0.5 },
    { place: 'Seattle Space Needle', city: 'Seattle', country: 'United States', lat: 47.6062, lon: -122.3321, r: 0.4 },
    { place: 'Miami Beach', city: 'Miami', country: 'United States', lat: 25.7617, lon: -80.1918, r: 0.4 },
    { place: 'Toronto Downtown', city: 'Toronto', country: 'Canada', lat: 43.6532, lon: -79.3832, r: 0.5 },
    { place: 'Vancouver', city: 'Vancouver', country: 'Canada', lat: 49.2827, lon: -123.1207, r: 0.4 },
    { place: 'Montreal', city: 'Montreal', country: 'Canada', lat: 45.5017, lon: -73.5673, r: 0.4 },
    { place: 'Mexico City', city: 'Mexico City', country: 'Mexico', lat: 19.4326, lon: -99.1332, r: 0.6 },
    { place: 'Cancún', city: 'Cancún', country: 'Mexico', lat: 21.1619, lon: -86.8515, r: 0.35 },

    // Asia & Middle East
    { place: 'Tokyo Tower & Shibuya', city: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503, r: 0.6 },
    { place: 'Kyoto Temples', city: 'Kyoto', country: 'Japan', lat: 35.0116, lon: 135.7681, r: 0.35 },
    { place: 'Osaka Dotonbori', city: 'Osaka', country: 'Japan', lat: 34.6937, lon: 135.5023, r: 0.35 },
    { place: 'Seoul Gangnam', city: 'Seoul', country: 'South Korea', lat: 37.5665, lon: 126.9780, r: 0.5 },
    { place: 'Marina Bay Sands', city: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198, r: 0.35 },
    { place: 'Victoria Harbour', city: 'Hong Kong', country: 'Hong Kong', lat: 22.3193, lon: 114.1694, r: 0.35 },
    { place: 'Bangkok Grand Palace', city: 'Bangkok', country: 'Thailand', lat: 13.7563, lon: 100.5018, r: 0.5 },
    { place: 'Phuket Beach', city: 'Phuket', country: 'Thailand', lat: 7.8804, lon: 98.3923, r: 0.4 },
    { place: 'Bali Ubud', city: 'Bali', country: 'Indonesia', lat: -8.4095, lon: 115.1889, r: 0.5 },
    { place: 'Burj Khalifa', city: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lon: 55.2708, r: 0.4 },
    { place: 'Abu Dhabi', city: 'Abu Dhabi', country: 'United Arab Emirates', lat: 24.4539, lon: 54.3773, r: 0.4 },
    { place: 'Doha Corniche', city: 'Doha', country: 'Qatar', lat: 25.2854, lon: 51.5310, r: 0.35 },

    // India
    { place: 'Taj Mahal Palace', city: 'Mumbai', country: 'India', lat: 18.9220, lon: 72.8347, r: 0.4 },
    { place: 'India Gate & Connaught Place', city: 'New Delhi', country: 'India', lat: 28.6139, lon: 77.2090, r: 0.5 },
    { place: 'Bengaluru Tech Corridor', city: 'Bengaluru', country: 'India', lat: 12.9716, lon: 77.5946, r: 0.5 },
    { place: 'Hyderabad Hitec City', city: 'Hyderabad', country: 'India', lat: 17.3850, lon: 78.4867, r: 0.5 },
    { place: 'Chennai Marina Beach', city: 'Chennai', country: 'India', lat: 13.0827, lon: 80.2707, r: 0.5 },
    { place: 'Kolkata Howrah', city: 'Kolkata', country: 'India', lat: 22.5726, lon: 88.3639, r: 0.5 },
    { place: 'Taj Mahal', city: 'Agra', country: 'India', lat: 27.1751, lon: 78.0421, r: 0.3 },
    { place: 'Hawa Mahal', city: 'Jaipur', country: 'India', lat: 26.9124, lon: 75.7873, r: 0.4 },
    { place: 'Goa Coast', city: 'Goa', country: 'India', lat: 15.2993, lon: 74.1240, r: 0.5 },

    // Oceania, South America & Africa
    { place: 'Sydney Opera House', city: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093, r: 0.5 },
    { place: 'Melbourne Central', city: 'Melbourne', country: 'Australia', lat: -37.8136, lon: 144.9631, r: 0.5 },
    { place: 'Auckland Harbour', city: 'Auckland', country: 'New Zealand', lat: -36.8485, lon: 174.7633, r: 0.4 },
    { place: 'Christchurch', city: 'Christchurch', country: 'New Zealand', lat: -43.5321, lon: 172.6362, r: 0.4 },
    { place: 'Copacabana Beach', city: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lon: -43.1729, r: 0.5 },
    { place: 'São Paulo', city: 'São Paulo', country: 'Brazil', lat: -23.5505, lon: -46.6333, r: 0.6 },
    { place: 'Buenos Aires', city: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lon: -58.3816, r: 0.5 },
    { place: 'Table Mountain', city: 'Cape Town', country: 'South Africa', lat: -33.9249, lon: 18.4241, r: 0.4 },
    { place: 'Giza Pyramids', city: 'Cairo', country: 'Egypt', lat: 30.0444, lon: 31.2357, r: 0.5 }
  ];

  function resolveLocationOffline(lat, lon) {
    if (typeof lat !== 'number' || typeof lon !== 'number' || isNaN(lat) || isNaN(lon)) return null;
    let closest = null;
    let minD = Infinity;

    for (const p of OFFLINE_PLACES) {
      const d = Math.hypot(lat - p.lat, lon - p.lon);
      if (d <= p.r && d < minD) {
        minD = d;
        closest = p;
      }
    }

    if (closest) {
      return {
        place: closest.place,
        city: closest.city,
        country: closest.country
      };
    }

    // Macro continental / regional fallbacks
    if (lat >= 24 && lat <= 50 && lon >= -125 && lon <= -66) return { place: '', city: '', country: 'United States' };
    if (lat >= 45 && lat <= 70 && lon >= -140 && lon <= -55) return { place: '', city: '', country: 'Canada' };
    if (lat >= 35 && lat <= 70 && lon >= -10 && lon <= 40) return { place: '', city: '', country: 'Europe' };
    if (lat >= 8 && lat <= 37 && lon >= 68 && lon <= 97) return { place: '', city: '', country: 'India' };
    if (lat >= 20 && lat <= 46 && lon >= 122 && lon <= 150) return { place: '', city: '', country: 'Japan' };
    if (lat >= -44 && lat <= -10 && lon >= 113 && lon <= 154) return { place: '', city: '', country: 'Australia' };

    return null;
  }

  const clientGeocodeCache = new Map();
  async function resolveLocationFromCoords(lat, lon) {
    if (typeof lat !== 'number' || typeof lon !== 'number' || isNaN(lat) || isNaN(lon)) {
      return { latitude: lat, longitude: lon, displayCoords: '', place: '', city: '', country: '' };
    }
    const displayCoords = formatDisplayCoords(lat, lon);
    const key = \`\${lat.toFixed(3)},\${lon.toFixed(3)}\`;
    if (clientGeocodeCache.has(key)) return clientGeocodeCache.get(key);

    const offlineDefault = resolveLocationOffline(lat, lon);
    let place = offlineDefault ? offlineDefault.place : '';
    let city = offlineDefault ? offlineDefault.city : '';
    let country = offlineDefault ? offlineDefault.country : '';

    // Provider 1: BigDataCloud Reverse Geocode Client (Free, browser CORS, ultra-fast)
    try {
      const res = await fetch(\`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=\${lat}&longitude=\${lon}&localityLanguage=en\`, {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const d = await res.json();
        let netPlace = d.locality || '';
        if (!netPlace && d.localityInfo && Array.isArray(d.localityInfo.administrative)) {
          netPlace = d.localityInfo.administrative[0]?.name || '';
        }
        let netCity = d.city || d.principalSubdivision || '';
        let netCountry = d.countryName || '';
        if (netCountry.includes('United Kingdom')) netCountry = 'United Kingdom';
        if (netCountry.includes('United States')) netCountry = 'United States';

        if (netCity || netCountry || netPlace) {
          const loc = {
            latitude: lat,
            longitude: lon,
            displayCoords: displayCoords,
            place: (netPlace || netCity || place).trim(),
            city: (netCity || netPlace || city).trim(),
            country: (netCountry || country).trim()
          };
          clientGeocodeCache.set(key, loc);
          return loc;
        }
      }
    } catch (_) {}

    // Provider 2: Photon Komoot Reverse (OpenStreetMap data, CORS-enabled backup)
    try {
      const res = await fetch(\`https://photon.komoot.io/reverse?lat=\${lat}&lon=\${lon}\`);
      if (res.ok) {
        const d = await res.json();
        const f = d.features && d.features[0] && d.features[0].properties;
        if (f) {
          const loc = {
            latitude: lat,
            longitude: lon,
            displayCoords: displayCoords,
            place: (f.name || f.district || f.suburb || f.locality || place).trim(),
            city: (f.city || f.town || f.county || f.state || city).trim(),
            country: (f.country || country).trim()
          };
          if (loc.place || loc.city || loc.country) {
            clientGeocodeCache.set(key, loc);
            return loc;
          }
        }
      }
    } catch (_) {}

    // Provider 3: Nominatim OpenStreetMap (Tertiary fallback)
    try {
      const res = await fetch(\`https://nominatim.openstreetmap.org/reverse?format=json&lat=\${lat}&lon=\${lon}&zoom=14&addressdetails=1\`, {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        const loc = {
          latitude: lat,
          longitude: lon,
          displayCoords: displayCoords,
          place: (addr.attraction || addr.suburb || addr.neighbourhood || addr.amenity || addr.tourism || addr.road || place).trim(),
          city: (addr.city || addr.town || addr.village || addr.county || city).trim(),
          country: (addr.country || country).trim()
        };
        clientGeocodeCache.set(key, loc);
        return loc;
      }
    } catch (_) {}

    const loc = {
      latitude: lat,
      longitude: lon,
      displayCoords: displayCoords,
      place: place,
      city: city,
      country: country
    };
    clientGeocodeCache.set(key, loc);
    return loc;
  }

  async function extractMetadataFromBlob(file) {
    if (state.gpsMetadataEnabled === false) return { location: null, createdAt: null, cameraModel: null };
    try {
      const buffer = await file.arrayBuffer();
      const meta = extractFullMetadata(buffer);
      if (!meta) return { location: null, createdAt: null, cameraModel: null };

      let location = null;
      if (meta.coords && typeof meta.coords.latitude === 'number' && typeof meta.coords.longitude === 'number') {
        const displayCoords = formatDisplayCoords(meta.coords.latitude, meta.coords.longitude);
        const offlineMatch = resolveLocationOffline(meta.coords.latitude, meta.coords.longitude);
        location = {
          latitude: meta.coords.latitude,
          longitude: meta.coords.longitude,
          displayCoords: displayCoords,
          place: offlineMatch ? (offlineMatch.place || '') : '',
          city: offlineMatch ? (offlineMatch.city || '') : '',
          country: offlineMatch ? (offlineMatch.country || '') : ''
        };
      }
      return {
        location,
        createdAt: meta.timestamp || null,
        cameraModel: meta.cameraModel || null
      };
    } catch (_) {
      return { location: null, createdAt: null, cameraModel: null };
    }
  }

  async function extractLocationFromBlob(file) {
    const meta = await extractMetadataFromBlob(file);
    return meta ? meta.location : null;
  }
`;

// Locate start of old extractFullExifFromBuffer:
const oldExtractorAnchor = '  // Pure-JS Full EXIF parser & robust multi-provider reverse geocoder for browser / web';
const oldExtractorEndAnchor = '  // Camera Input Change Listener (Mobile Browser / Fallback)';

const startIdx = appJs.indexOf(oldExtractorAnchor);
const endIdx = appJs.indexOf(oldExtractorEndAnchor);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not locate old extractor anchor points!', { startIdx, endIdx });
  process.exit(1);
}

console.log('Replacing old EXIF extractor block with universal multi-format engine...');
appJs = appJs.slice(0, startIdx) + multiFormatExtractorCode + '\n  ' + appJs.slice(endIdx);

// 2. Enhance onNativePhotoCaptured, onNativePhotosImported, and onNativePhotosImportedToAlbum
// Let's inspect onNativePhotoCaptured
const capturedAnchor = `      const newPhoto = {
      id: newPhotoId,
      displayName: photoName || \`Camera Shot #\${state.photos.length + 1}\`,
      category: 'Camera',
      isPending: true,
      isFavorite: false,
      deletedAt: null,
      createdAt: photoCreated || timestamp,
      cameraModel: camera,
      tags: [],
      dataUrl: dataUrl,
      location: loc
    };`;

const capturedReplacement = `      // Automatically populate initial location tags if GPS enabled
      const initialTags = [];
      if (loc && state.locationTagsEnabled !== false) {
        if (state.locationTagCity !== false && loc.city) initialTags.push(loc.city);
        else if (state.locationTagPlace !== false && loc.place) initialTags.push(loc.place);
        else if (state.locationTagCountry !== false && loc.country) initialTags.push(loc.country);
      }

      const newPhoto = {
      id: newPhotoId,
      displayName: photoName || \`Camera Shot #\${state.photos.length + 1}\`,
      category: 'Camera',
      isPending: true,
      isFavorite: false,
      deletedAt: null,
      createdAt: photoCreated || timestamp,
      cameraModel: camera,
      tags: initialTags,
      dataUrl: dataUrl,
      location: loc
    };`;

if (appJs.includes(capturedAnchor)) {
  appJs = appJs.replace(capturedAnchor, capturedReplacement);
  console.log('Enhanced onNativePhotoCaptured with auto location tags!');
} else {
  console.warn('Could not find capturedAnchor');
}

// In onNativePhotosImported
const importedAnchor = `      const newPhoto = {
        id: newPhotoId,
        displayName: item.displayName || \`Moment #\${state.photos.length + 1}\`,
        category: 'Import',
        isPending: true,
        isFavorite: false,
        deletedAt: null,
        createdAt: photoCreated || (timestamp + index),
        cameraModel: camera,
        tags: [],
        dataUrl: item.dataUrl,
        location: loc
      };`;

const importedReplacement = `      // Automatically populate initial location tags if GPS enabled
      const initialTags = [];
      if (loc && state.locationTagsEnabled !== false) {
        if (state.locationTagCity !== false && loc.city) initialTags.push(loc.city);
        else if (state.locationTagPlace !== false && loc.place) initialTags.push(loc.place);
        else if (state.locationTagCountry !== false && loc.country) initialTags.push(loc.country);
      }

      const newPhoto = {
        id: newPhotoId,
        displayName: item.displayName || \`Moment #\${state.photos.length + 1}\`,
        category: 'Import',
        isPending: true,
        isFavorite: false,
        deletedAt: null,
        createdAt: photoCreated || (timestamp + index),
        cameraModel: camera,
        tags: initialTags,
        dataUrl: item.dataUrl,
        location: loc
      };`;

if (appJs.includes(importedAnchor)) {
  appJs = appJs.replace(importedAnchor, importedReplacement);
  console.log('Enhanced onNativePhotosImported with auto location tags!');
} else {
  console.warn('Could not find importedAnchor');
}

// In onNativePhotosImportedToAlbum
const albumImportAnchor = `      const newPhoto = {
        id: newPhotoId,
        displayName: item.displayName || \`Moment #\${state.photos.length + 1}\`,
        category: targetAlbum,
        isPending: false, // Placed directly into album; bypasses dock!
        isFavorite: false,
        deletedAt: null,
        createdAt: photoCreated || (timestamp + index),
        cameraModel: camera,
        tags: [targetAlbum],
        dataUrl: item.dataUrl,
        location: loc
      };`;

const albumImportReplacement = `      const albumTags = [targetAlbum];
      if (loc && state.locationTagsEnabled !== false) {
        const locTag = (state.locationTagCity !== false && loc.city) ? loc.city :
                       ((state.locationTagPlace !== false && loc.place) ? loc.place :
                       ((state.locationTagCountry !== false && loc.country) ? loc.country : null));
        if (locTag && !albumTags.some(t => t.toLowerCase() === locTag.toLowerCase())) {
          albumTags.push(locTag);
        }
      }

      const newPhoto = {
        id: newPhotoId,
        displayName: item.displayName || \`Moment #\${state.photos.length + 1}\`,
        category: targetAlbum,
        isPending: false, // Placed directly into album; bypasses dock!
        isFavorite: false,
        deletedAt: null,
        createdAt: photoCreated || (timestamp + index),
        cameraModel: camera,
        tags: albumTags,
        dataUrl: item.dataUrl,
        location: loc
      };`;

if (appJs.includes(albumImportAnchor)) {
  appJs = appJs.replace(albumImportAnchor, albumImportReplacement);
  console.log('Enhanced onNativePhotosImportedToAlbum with auto location tags!');
} else {
  console.warn('Could not find albumImportAnchor');
}

// 3. Make sure on background reverse geocode resolution, if new tags are discovered, they get added to photo.tags
const resolveDockUpdateAnchor = `            if (p) {
              p.location = resolved;
              saveState();`;

const resolveDockUpdateReplacement = `            if (p) {
              p.location = resolved;
              if (state.locationTagsEnabled !== false && resolved && resolved.city) {
                if (!p.tags.some(t => t.toLowerCase() === resolved.city.toLowerCase())) {
                  p.tags.push(resolved.city);
                }
              }
              saveState();`;

if (appJs.includes(resolveDockUpdateAnchor)) {
  appJs = appJs.replace(resolveDockUpdateAnchor, resolveDockUpdateReplacement);
  console.log('Enhanced background reverse geocoding tag updates!');
}

// 4. Update getSuggestedLocationTagsForPhoto so that coords are suggested if place/city are empty
const getSuggestedAnchor = `  // Only trigger background reverse geocoding if GPS is ON, Location Tags is ON, and at least one sub-tag is enabled
  const isAnyLocTagEnabled = state.locationTagPlace !== false || state.locationTagCity !== false || state.locationTagCountry !== false;`;

const getSuggestedReplacement = `  // If coordinates exist and no named suggestion was found yet, offer coordinate tag
  if (suggestions.length === 0 && typeof loc.latitude === 'number' && typeof loc.longitude === 'number') {
    const coordsStr = loc.displayCoords || formatDisplayCoords(loc.latitude, loc.longitude);
    if (coordsStr) {
      suggestions.push({ type: 'coords', label: coordsStr });
    }
  }

  // Only trigger background reverse geocoding if GPS is ON, Location Tags is ON, and at least one sub-tag is enabled
  const isAnyLocTagEnabled = state.locationTagPlace !== false || state.locationTagCity !== false || state.locationTagCountry !== false;`;

if (appJs.includes(getSuggestedAnchor)) {
  appJs = appJs.replace(getSuggestedAnchor, getSuggestedReplacement);
  console.log('Enhanced getSuggestedLocationTagsForPhoto with coordinate fallback suggestion!');
}

// 5. Update updateDetailModalUI location header display
const detailDateAnchor = `    let locName = '';
    if (state.gpsMetadataEnabled !== false && state.locationTagsEnabled !== false && photo.location) {
      if (state.locationTagCity !== false && photo.location.city) {
        locName = photo.location.city;
      } else if (state.locationTagPlace !== false && photo.location.place) {
        locName = photo.location.place;
      } else if (state.locationTagCountry !== false && photo.location.country) {
        locName = photo.location.country;
      }
    }
    const locSuffix = locName ? \` · 📍 \${locName}\` : '';`;

const detailDateReplacement = `    let locName = '';
    if (state.gpsMetadataEnabled !== false && photo.location) {
      if (photo.location.city) {
        locName = photo.location.country ? \`\${photo.location.city}, \${photo.location.country}\` : photo.location.city;
      } else if (photo.location.place) {
        locName = photo.location.country ? \`\${photo.location.place}, \${photo.location.country}\` : photo.location.place;
      } else if (photo.location.country) {
        locName = photo.location.country;
      } else if (photo.location.displayCoords) {
        locName = photo.location.displayCoords;
      } else if (typeof photo.location.latitude === 'number' && typeof photo.location.longitude === 'number') {
        locName = formatDisplayCoords(photo.location.latitude, photo.location.longitude);
      }
    }
    const locSuffix = locName ? \` · 📍 \${locName}\` : '';`;

if (appJs.includes(detailDateAnchor)) {
  appJs = appJs.replace(detailDateAnchor, detailDateReplacement);
  console.log('Enhanced updateDetailModalUI location header display!');
}

// 6. Update renderDetailTags location chips container to handle coords & non-empty coordinates
const detailChipsAnchor = `        const typeIcon = s.type === 'place' ? 'fa-landmark' : (s.type === 'city' ? 'fa-city' : 'fa-earth-americas');
        const typeLabel = s.type === 'place' ? (window.t ? window.t('settings_loc_place') : 'Place')
                        : (s.type === 'city' ? (window.t ? window.t('settings_loc_city') : 'City')
                        : (window.t ? window.t('settings_loc_country') : 'Country'));`;

const detailChipsReplacement = `        const typeIcon = s.type === 'place' ? 'fa-landmark' : (s.type === 'city' ? 'fa-city' : (s.type === 'coords' ? 'fa-crosshairs' : 'fa-earth-americas'));
        const typeLabel = s.type === 'place' ? (window.t ? window.t('settings_loc_place') : 'Place')
                        : (s.type === 'city' ? (window.t ? window.t('settings_loc_city') : 'City')
                        : (s.type === 'coords' ? 'GPS' : (window.t ? window.t('settings_loc_country') : 'Country')));`;

if (appJs.includes(detailChipsAnchor)) {
  appJs = appJs.replace(detailChipsAnchor, detailChipsReplacement);
  console.log('Enhanced detailChips with GPS coordinate icon!');
}

// 7. Update renderDock card to display dock-location-pill if photo has location
const dockCardImageAnchor = `          <div class="card-image-box">
            <img src="\${photo.dataUrl}" alt="\${escapeHtml(photo.displayName)}" loading="lazy">
            <span class="dock-staging-pill">
              <span class="staging-pulse-dot"></span>
              <span>\${pendingLabel}</span>
            </span>`;

const dockCardImageReplacement = `          <div class="card-image-box">
            <img src="\${photo.dataUrl}" alt="\${escapeHtml(photo.displayName)}" loading="lazy">
            <span class="dock-staging-pill">
              <span class="staging-pulse-dot"></span>
              <span>\${pendingLabel}</span>
            </span>
            \${(photo.location && typeof photo.location.latitude === 'number') ? \`
              <span class="dock-location-pill" title="Location: \${escapeHtml(photo.location.city || photo.location.place || photo.location.country || photo.location.displayCoords || formatDisplayCoords(photo.location.latitude, photo.location.longitude))}">
                <i class="fa-solid fa-location-dot"></i> \${escapeHtml(photo.location.city || photo.location.place || photo.location.country || photo.location.displayCoords || formatDisplayCoords(photo.location.latitude, photo.location.longitude))}
              </span>
            \` : ''}`;

if (appJs.includes(dockCardImageAnchor)) {
  appJs = appJs.replace(dockCardImageAnchor, dockCardImageReplacement);
  console.log('Added dock-location-pill to dock card!');
}

// 8. Update renderGallery card to display card-loc-pill if photo has location
const galleryMetaRowAnchor = `          <div class="card-meta-row">
            \${photo.tags.length > 0 ? \``;

const galleryMetaRowReplacement = `          <div class="card-meta-row">
            \${(photo.location && typeof photo.location.latitude === 'number') ? \`
              <span class="card-loc-pill" title="Location: \${escapeHtml(photo.location.city || photo.location.place || photo.location.country || photo.location.displayCoords || formatDisplayCoords(photo.location.latitude, photo.location.longitude))}" onclick="event.stopPropagation(); openPhotoDetail('\${photo.id}')">
                <i class="fa-solid fa-location-dot"></i> \${escapeHtml(photo.location.city || photo.location.place || photo.location.country || photo.location.displayCoords || formatDisplayCoords(photo.location.latitude, photo.location.longitude))}
              </span>
            \` : ''}
            \${photo.tags.length > 0 ? \``;

if (appJs.includes(galleryMetaRowAnchor)) {
  appJs = appJs.replace(galleryMetaRowAnchor, galleryMetaRowReplacement);
  console.log('Added card-loc-pill to gallery card!');
}

fs.writeFileSync('web/app.js', appJs, 'utf8');
console.log('Successfully written updated web/app.js!');

// Now update web/style.css to include .dock-location-pill and .card-loc-pill
let styleCss = fs.readFileSync('web/style.css', 'utf8');
if (!styleCss.includes('.dock-location-pill')) {
  const cssToAdd = `
/* -------------------------------------------------------------
 * GPS Location Badges on Dock and Gallery Cards
 * ------------------------------------------------------------- */
.dock-location-pill {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(15, 23, 42, 0.78);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(56, 189, 248, 0.4);
  border-radius: 9999px;
  padding: 3px 9px;
  font-size: 10px;
  font-weight: 600;
  color: #38bdf8;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  max-width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  z-index: 3;
}

.dock-location-pill i {
  font-size: 9px;
  color: #38bdf8;
}

.card-loc-pill {
  background: rgba(14, 165, 233, 0.14);
  border: 1px solid rgba(56, 189, 248, 0.35);
  border-radius: 9999px;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 600;
  color: #38bdf8;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 130px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-loc-pill:hover {
  background: rgba(14, 165, 233, 0.28);
  border-color: #38bdf8;
  color: #ffffff;
  transform: translateY(-1px);
}

body.light-mode .dock-location-pill {
  background: rgba(255, 255, 255, 0.88);
  border-color: rgba(2, 132, 199, 0.35);
  color: #0284c7;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

body.light-mode .dock-location-pill i {
  color: #0284c7;
}

body.light-mode .card-loc-pill {
  background: rgba(2, 132, 199, 0.08);
  border-color: rgba(2, 132, 199, 0.25);
  color: #0284c7;
}

body.light-mode .card-loc-pill:hover {
  background: rgba(2, 132, 199, 0.18);
  border-color: #0284c7;
  color: #0369a1;
};
`;
  styleCss += '\n' + cssToAdd;
  fs.writeFileSync('web/style.css', styleCss, 'utf8');
  console.log('Added CSS for .dock-location-pill and .card-loc-pill to web/style.css!');
}

console.log('All updates complete!');
