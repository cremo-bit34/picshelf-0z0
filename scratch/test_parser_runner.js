
function extractFullExifFromBuffer(buffer) {
    try {
      const view = new DataView(buffer);
      if (view.byteLength < 14 || view.getUint16(0, false) !== 0xFFD8) return null;
      let offset = 2;
      while (offset < view.byteLength) {
        if (view.getUint8(offset) !== 0xFF) break;
        const marker = view.getUint8(offset + 1);
        const size = view.getUint16(offset + 2, false);
        if (marker === 0xE1) { // APP1 Exif
          if (view.getUint32(offset + 4, false) === 0x45786966 && view.getUint16(offset + 8, false) === 0x0000) {
            const tiffStart = offset + 10;
            return parseTiffHeader(view, tiffStart);
          }
        }
        offset += 2 + size;
      }
    } catch (_) {}
    return null;
  }

  function parseTiffHeader(view, tiffStart) {
    const isLittleEndian = view.getUint16(tiffStart, false) === 0x4949;
    const ifd0Offset = view.getUint32(tiffStart + 4, isLittleEndian);

    function readString(offset, count) {
      let s = '';
      for (let i = 0; i < count; i++) {
        const c = view.getUint8(offset + i);
        if (c === 0) break;
        s += String.fromCharCode(c);
      }
      return s.trim();
    }

    function readGpsCoords(offset) {
      const vals = [];
      for (let i = 0; i < 3; i++) {
        const num = view.getUint32(offset + (i * 8), isLittleEndian);
        const den = view.getUint32(offset + (i * 8) + 4, isLittleEndian);
        vals.push(den ? (num / den) : 0);
      }
      return vals;
    }

    let ifdOffset = tiffStart + ifd0Offset;
    if (ifdOffset + 2 > view.byteLength) return null;
    const numEntries = view.getUint16(ifdOffset, isLittleEndian);
    let make = '', model = '', dateTaken = null, exifSubOffset = null, gpsIfdOffset = null;

    for (let i = 0; i < numEntries; i++) {
      const entryOffset = ifdOffset + 2 + (i * 12);
      if (entryOffset + 12 > view.byteLength) break;
      const tag = view.getUint16(entryOffset, isLittleEndian);
      const count = view.getUint32(entryOffset + 4, isLittleEndian);

      if (tag === 0x010F) { // Make
        const valOffset = count > 4 ? (tiffStart + view.getUint32(entryOffset + 8, isLittleEndian)) : (entryOffset + 8);
        if (valOffset + count <= view.byteLength) make = readString(valOffset, count);
      } else if (tag === 0x0110) { // Model
        const valOffset = count > 4 ? (tiffStart + view.getUint32(entryOffset + 8, isLittleEndian)) : (entryOffset + 8);
        if (valOffset + count <= view.byteLength) model = readString(valOffset, count);
      } else if (tag === 0x0132) { // DateTime
        const valOffset = count > 4 ? (tiffStart + view.getUint32(entryOffset + 8, isLittleEndian)) : (entryOffset + 8);
        if (valOffset + count <= view.byteLength) dateTaken = readString(valOffset, count);
      } else if (tag === 0x8769) { // Exif SubIFD
        exifSubOffset = view.getUint32(entryOffset + 8, isLittleEndian);
      } else if (tag === 0x8825) { // GPS Info IFD
        gpsIfdOffset = view.getUint32(entryOffset + 8, isLittleEndian);
      }
    }

    if (exifSubOffset !== null && tiffStart + exifSubOffset + 2 <= view.byteLength) {
      const subOffset = tiffStart + exifSubOffset;
      const subEntries = view.getUint16(subOffset, isLittleEndian);
      for (let i = 0; i < subEntries; i++) {
        const entryOffset = subOffset + 2 + (i * 12);
        if (entryOffset + 12 > view.byteLength) break;
        const tag = view.getUint16(entryOffset, isLittleEndian);
        const count = view.getUint32(entryOffset + 4, isLittleEndian);
        if (tag === 0x9003 || (!dateTaken && tag === 0x9004)) { // DateTimeOriginal / DateTimeDigitized
          const valOffset = count > 4 ? (tiffStart + view.getUint32(entryOffset + 8, isLittleEndian)) : (entryOffset + 8);
          if (valOffset + count <= view.byteLength) {
            const subDate = readString(valOffset, count);
            if (subDate) dateTaken = subDate;
          }
        }
      }
    }

    let coords = null;
    if (gpsIfdOffset !== null && tiffStart + gpsIfdOffset + 2 <= view.byteLength) {
      const gpsOffset = tiffStart + gpsIfdOffset;
      const gpsEntries = view.getUint16(gpsOffset, isLittleEndian);
      let latRef = 'N', lonRef = 'E';
      let latValues = null, lonValues = null;
      for (let i = 0; i < gpsEntries; i++) {
        const entryOffset = gpsOffset + 2 + (i * 12);
        if (entryOffset + 12 > view.byteLength) break;
        const tag = view.getUint16(entryOffset, isLittleEndian);
        if (tag === 0x0001) {
          latRef = String.fromCharCode(view.getUint8(entryOffset + 8));
        } else if (tag === 0x0002) {
          const valOffset = tiffStart + view.getUint32(entryOffset + 8, isLittleEndian);
          if (valOffset + 24 <= view.byteLength) latValues = readGpsCoords(valOffset);
        } else if (tag === 0x0003) {
          lonRef = String.fromCharCode(view.getUint8(entryOffset + 8));
        } else if (tag === 0x0004) {
          const valOffset = tiffStart + view.getUint32(entryOffset + 8, isLittleEndian);
          if (valOffset + 24 <= view.byteLength) lonValues = readGpsCoords(valOffset);
        }
      }
      if (latValues && lonValues) {
        let lat = latValues[0] + (latValues[1] / 60) + (latValues[2] / 3600);
        let lon = lonValues[0] + (lonValues[1] / 60) + (lonValues[2] / 3600);
        if (latRef === 'S') lat = -lat;
        if (lonRef === 'W') lon = -lon;
        coords = { latitude: lat, longitude: lon };
      }
    }

    let parsedTimestamp = null;
    if (dateTaken) {
      const m = dateTaken.match(/^([0-9]{4})[:\/]([0-9]{2})[:\/]([0-9]{2})\s+([0-9]{2}):([0-9]{2}):([0-9]{2})/);
      if (m) {
        parsedTimestamp = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]), parseInt(m[4]), parseInt(m[5]), parseInt(m[6])).getTime();
      }
    }

    let cameraModel = '';
    if (make && model) {
      cameraModel = model.toLowerCase().startsWith(make.toLowerCase()) ? model : (make + ' ' + model);
    } else if (model) {
      cameraModel = model;
    } else if (make) {
      cameraModel = make;
    }

    return {
      coords,
      cameraModel: cameraModel.trim() || null,
      dateTakenStr: dateTaken,
      timestamp: parsedTimestamp
    };
  }

  
module.exports = { extractFullExifFromBuffer };
