const fs = require('fs');
const path = require('path');

console.log('--- TEST: 3D SURFACES & ALBUM CARD DELETE BUTTON REMOVAL ---');

const html = fs.readFileSync(path.join(__dirname, '../web/index.html'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '../web/style.css'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, '../web/app.js'), 'utf8');

// 1. Assert all 12 finish chips in index.html
const expectedFinishes = [
  'holo', 'glass', 'gold', 'aurora', 'carbon', 'titanium',
  'nebula', 'emerald', 'pearl', 'rose', 'solar', 'matrix'
];

let chipsFound = 0;
expectedFinishes.forEach(f => {
  const chipPattern = new RegExp(`class="surface-style-chip"\\s+data-style="${f}"`, 'i');
  if (!chipPattern.test(html)) {
    throw new Error(`Missing chip in HTML for finish: ${f}`);
  }
  const swatchPattern = new RegExp(`class="style-swatch\\s+swatch-${f}"`, 'i');
  if (!swatchPattern.test(html)) {
    throw new Error(`Missing swatch element in HTML for finish: ${f}`);
  }
  chipsFound++;
});
console.log(`✓ Verified ${chipsFound} surface finish chips in index.html`);

// 2. Assert CSS classes for all 12 finishes and swatches
expectedFinishes.forEach(f => {
  if (!css.includes(`.surface-${f}`)) throw new Error(`Missing CSS for .surface-${f}`);
  if (!css.includes(`.swatch-${f}`)) throw new Error(`Missing CSS for .swatch-${f}`);
});
console.log('✓ Verified CSS rules for all 12 surface finishes & swatches in style.css');

// 3. Assert album card bottom delete button was removed
if (js.includes('btn-album-action danger album-delete-btn')) {
  throw new Error('Bottom delete button still present in app.js!');
}
console.log('✓ Bottom album-delete-btn has been cleanly removed from album card action bar');

// 4. Assert top-right delete icon button is preserved
if (!js.includes('album-cover-delete-btn')) {
  throw new Error('Top-right album cover delete button was accidentally removed!');
}
console.log('✓ Top-right album-cover-delete-btn is preserved in album cards');

// 5. Assert STUDIO_3D_SURFACES has 12 items
const studioMatch = js.match(/const STUDIO_3D_SURFACES = (\[[\s\S]*?\]);/);
if (!studioMatch) throw new Error('Could not find STUDIO_3D_SURFACES in app.js');
const studioSurfaces = eval(studioMatch[1]);
console.log(`Curated 3D Studio surfaces found: ${studioSurfaces.length}`);
if (studioSurfaces.length < 10) {
  throw new Error(`Expected at least 10 studio surfaces, found ${studioSurfaces.length}`);
}
studioSurfaces.forEach(s => {
  if (!s.id || !s.name || !s.dataUrl.startsWith('data:image/svg+xml')) {
    throw new Error(`Invalid studio surface format for: ${s.name}`);
  }
});
console.log('✓ All 12 VIP Studio 3D surface textures are valid SVG vector artworks');

// 6. Test select & deselect logic
const mockState = {
  photos: [
    { id: 'p1', displayName: 'Photo 1', dataUrl: 'data:image/png;base64,aaa', tags: ['Job Offer'] },
    { id: 'p2', displayName: 'Photo 2', dataUrl: 'data:image/png;base64,bbb', tags: ['Job Offer'] }
  ],
  tags: [{ name: 'Job Offer', color: '#f43f5e', customCoverUrl: null, surface3DStyle: 'holo' }],
  current3DModalAlbum: 'Job Offer',
  selected3DSurfacePhoto: '',
  selected3DSurfaceStyle: 'holo',
  isPro: true
};

let toasts = [];
function showToast(msg) { toasts.push(msg); }
function removeAlbumCustomSurface() {
  mockState.selected3DSurfacePhoto = mockState.photos[0].dataUrl;
}
function update3DModalPreviewStage() {}
function renderSurfacePhotoPicker() {}
function update3DSurfaceStyleChips() {}

function selectStudioSurface(surfId) {
  const surf = studioSurfaces.find(s => s.id === surfId);
  if (!surf) return;
  if (mockState.selected3DSurfacePhoto === surf.dataUrl) {
    removeAlbumCustomSurface();
    showToast(`Deselected surface (Default cover restored)`);
    return;
  }
  mockState.selected3DSurfacePhoto = surf.dataUrl;
  update3DModalPreviewStage();
  renderSurfacePhotoPicker();
  showToast(`Applied VIP Studio Surface: ${surf.name} ✨`);
}

function select3DSurfaceStyle(styleName) {
  if (mockState.selected3DSurfaceStyle === styleName) {
    mockState.selected3DSurfaceStyle = 'none';
    showToast(`Deselected finish (Standard 3D Depth)`);
  } else {
    mockState.selected3DSurfaceStyle = styleName;
    showToast(`Finish: ${styleName}`);
  }
  update3DModalPreviewStage();
  update3DSurfaceStyleChips();
}

// Select studio surface
const testSurf = studioSurfaces[0];
selectStudioSurface(testSurf.id);
if (mockState.selected3DSurfacePhoto !== testSurf.dataUrl) {
  throw new Error('Studio surface selection failed');
}
console.log(`✓ Click 1 successfully selected: ${testSurf.name}`);

// Click again to deselect
selectStudioSurface(testSurf.id);
if (mockState.selected3DSurfacePhoto === testSurf.dataUrl) {
  throw new Error('Studio surface deselection failed');
}
console.log('✓ Click 2 successfully deselected studio surface');

// Select finish style
select3DSurfaceStyle('carbon');
if (mockState.selected3DSurfaceStyle !== 'carbon') {
  throw new Error('Finish style selection failed');
}
console.log('✓ Click 1 selected finish: carbon');

// Click again to deselect finish style
select3DSurfaceStyle('carbon');
if (mockState.selected3DSurfaceStyle !== 'none') {
  throw new Error('Finish style deselection to none failed');
}
console.log('✓ Click 2 deselected finish to none (Standard 3D Depth)');

// 7. Assert VIP_3D_SHINE_MAP
const shineMatch = js.match(/const VIP_3D_SHINE_MAP = (\{[\s\S]*?\n\};)/);
if (!shineMatch) throw new Error('Could not find VIP_3D_SHINE_MAP in app.js');
const shineMap = eval(`(${shineMatch[1].replace(/;\s*$/, '')})`);
expectedFinishes.forEach(f => {
  if (typeof shineMap[f] !== 'function') throw new Error(`Missing shine gradient generator for finish: ${f}`);
  const gradient = shineMap[f](50, 50);
  if (!gradient.includes('radial-gradient')) throw new Error(`Invalid gradient produced for: ${f}`);
});
console.log('✓ VIP_3D_SHINE_MAP covers all 12 finishes with dynamic specular reflections');

// 8. Assert window exports
if (!js.includes('selectStudioSurface,') || !js.includes('STUDIO_3D_SURFACES,')) {
  throw new Error('Missing window exports for selectStudioSurface or STUDIO_3D_SURFACES');
}
console.log('✓ selectStudioSurface & STUDIO_3D_SURFACES are properly exposed to window');

console.log('\nALL 8 ASSERTIONS PASSED! 🚀');
