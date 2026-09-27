const fs = require('fs');

const html = fs.readFileSync('web/index.html', 'utf8');
const css = fs.readFileSync('web/style.css', 'utf8');
const js = fs.readFileSync('web/app.js', 'utf8');

console.log('detailAmbientGlow HTML:', html.includes('id="detailAmbientGlow"'));
console.log('drag handle HTML:', html.includes('sheet-drag-handle'));
console.log('ambient glow CSS:', css.includes('.detail-ambient-glow'));
console.log('floating dock CSS:', css.includes('.detail-floating-dock'));
console.log('ambient glow JS:', js.includes('detailAmbientGlow'));
