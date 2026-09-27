const fs = require('fs');
const js = fs.readFileSync('web/app.js', 'utf8');
const css = fs.readFileSync('web/style.css', 'utf8');
const html = fs.readFileSync('web/index.html', 'utf8');

const tests = [
  { name: 'favorites3DStyle in state', pass: js.includes('favorites3DStyle') },
  { name: 'favoritesCustomCover in state', pass: js.includes('favoritesCustomCover') },
  { name: 'openAlbum3DSurfaceModal supports favorites', pass: js.includes("isFavorites = (tagName === 'favorites')") },
  { name: 'saveAlbum3DSurface supports favorites', pass: js.includes("if (tagName === 'favorites')") },
  { name: 'removeAlbumCustomSurface supports favorites', pass: js.includes("if (state.current3DModalAlbum === 'favorites')") },
  { name: 'fav-pill has max-width: none !important', pass: css.includes('.album-rich-card.favorites-album-card .album-tag-dot-pill.fav-pill') && css.includes('max-width: none !important;') },
  { name: 'fav-pill text-truncate has overflow: visible', pass: css.includes('overflow: visible !important;') },
  { name: 'album-active-banner has flex-wrap: wrap', pass: css.includes('flex-wrap: wrap;') },
  { name: 'album-banner-back-btn has white-space: nowrap', pass: css.includes('white-space: nowrap;') },
  { name: 'album-banner responsive mobile rule exists', pass: css.includes('@media (max-width: 540px)') },
  { name: 'favoritesHeaderActions has 3D Studio button', pass: html.includes("openAlbum3DSurfaceModal('favorites')") },
  { name: 'favoritesCardHtml has openAlbum3DSurfaceModal', pass: js.includes("openAlbum3DSurfaceModal('favorites')") }
];

console.table(tests);
const allPassed = tests.every(t => t.pass);
console.log('All tests passed:', allPassed);
if (!allPassed) process.exit(1);
