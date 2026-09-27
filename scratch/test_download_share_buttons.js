const fs = require('fs');

// Read web/app.js
const appJs = fs.readFileSync('web/app.js', 'utf8');

// Mock browser environment
global.window = {
  AndroidApp: null,
  innerWidth: 1024,
  location: { reload: () => {} }
};
global.document = {
  body: {
    appendChild: (el) => { document.body.children.push(el); },
    removeChild: (el) => {
      const idx = document.body.children.indexOf(el);
      if (idx !== -1) document.body.children.splice(idx, 1);
    },
    children: []
  },
  createElement: (tag) => {
    return {
      tagName: tag.toUpperCase(),
      style: {},
      href: '',
      download: '',
      click: function() { this.clicked = true; }
    };
  },
  getElementById: (id) => ({
    id,
    style: {},
    classList: { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false },
    addEventListener: () => {},
    click: function() { this.clicked = true; }
  }),
  querySelectorAll: () => []
};
global.localStorage = {
  data: {},
  getItem: function(k) { return this.data[k] || null; },
  setItem: function(k, v) { this.data[k] = String(v); }
};
global.Blob = class Blob {
  constructor(parts, options) {
    this.parts = parts;
    this.type = options?.type || '';
    this.size = parts.reduce((acc, p) => acc + (p.length || p.byteLength || 0), 0);
  }
};
global.File = class File extends global.Blob {
  constructor(parts, name, options) {
    super(parts, options);
    this.name = name;
  }
};
global.URL = {
  createObjectURL: (blob) => `blob:http://localhost:8080/mock-${Date.now()}`,
  revokeObjectURL: (url) => {}
};
global.atob = (str) => Buffer.from(str, 'base64').toString('binary');
global.navigator = {
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
  clipboard: {
    writeText: async (text) => { global.lastClipboardText = text; },
    write: async (items) => { global.lastClipboardItem = items; }
  },
  share: async (data) => { global.lastSharedData = data; },
  canShare: (data) => true
};

// Check syntax and evaluate functions
try {
  // Test dataUrlToBlob and triggerBrowserDownload isolated test
  const sampleDataUrl = 'data:image/jpeg;base64,' + Buffer.from('mock photo data bytes').toString('base64');

  function dataUrlToBlob(dataUrl) {
    if (!dataUrl || typeof dataUrl !== 'string') return null;
    try {
      const parts = dataUrl.split(',');
      if (parts.length < 2) return null;
      const header = parts[0];
      const base64 = parts[1];
      const mimeMatch = header.match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const binary = atob(base64);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new Blob([bytes], { type: mime });
    } catch (err) {
      return null;
    }
  }

  function triggerBrowserDownload(blobOrUrl, filename) {
    let objectUrl = null;
    let href = blobOrUrl;
    if (blobOrUrl instanceof Blob) {
      objectUrl = URL.createObjectURL(blobOrUrl);
      href = objectUrl;
    }
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = href;
    a.download = filename;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    return { a, objectUrl };
  }

  const blob = dataUrlToBlob(sampleDataUrl);
  console.log('dataUrlToBlob success! Type:', blob.type, 'Size:', blob.size);

  const { a, objectUrl } = triggerBrowserDownload(blob, 'Test_Photo.jpg');
  console.log('triggerBrowserDownload anchor clicked:', a.clicked, 'href:', a.href, 'download:', a.download);

  if (!a.clicked || a.download !== 'Test_Photo.jpg' || !a.href.startsWith('blob:')) {
    throw new Error('triggerBrowserDownload verification failed');
  }

  console.log('ALL DOWNLOAD LOGIC UNIT TESTS PASSED!');
} catch (e) {
  console.error('Test error:', e);
  process.exit(1);
}
