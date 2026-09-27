const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'web', 'style.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Replace .album-rich-card.card-3d.surface- with .card-3d.surface-
const beforeCount = (css.match(/\.album-rich-card\.card-3d\.surface-/g) || []).length;
console.log('Original .album-rich-card.card-3d.surface- matches:', beforeCount);

css = css.replace(/\.album-rich-card\.card-3d\.surface-/g, '.card-3d.surface-');

// 2. Add photo-card-elegant 3D geometry rules right before /* 2. VIP 3D Badge & Top Overlay Action Buttons */
const photo3DRules = `
/* 1b. Photo Card 3D Geometry & Parallax Depth Layering */
.photo-card-elegant.card-3d {
  transform-style: preserve-3d;
  will-change: transform;
  transition: transform 0.12s ease-out, box-shadow 0.25s ease, border-color 0.25s ease;
  position: relative;
}

.photo-card-elegant.card-3d .card-image-box {
  transform-style: preserve-3d;
  position: relative;
  overflow: hidden;
  border-radius: calc(var(--radius-lg) - 1px) calc(var(--radius-lg) - 1px) 0 0;
}

.photo-card-elegant.card-3d .card-image-box img {
  transform: translateZ(10px);
  transition: transform 0.35s ease;
}

.photo-card-elegant.card-3d:hover .card-image-box img {
  transform: translateZ(16px) scale(1.06);
}

.photo-card-elegant.card-3d .card-select-btn {
  transform: translateZ(26px);
  z-index: 10;
}

.photo-card-elegant.card-3d .card-fav-btn {
  transform: translateZ(26px);
  z-index: 10;
}

.photo-card-elegant.card-3d .card-content {
  transform: translateZ(14px);
  transform-style: preserve-3d;
}

.photo-card-elegant.card-3d .card-title-text {
  transform: translateZ(6px);
}

.photo-card-elegant.card-3d .card-meta-row {
  transform: translateZ(8px);
}

.photo-card-elegant.card-3d .card-hover-actions {
  transform: translateZ(18px);
  z-index: 12;
}

.photo-card-elegant.card-3d:hover .album-3d-shine,
.photo-card-elegant.card-3d.tilting .album-3d-shine {
  opacity: 1;
}
`;

if (!css.includes('.photo-card-elegant.card-3d')) {
  css = css.replace(
    '/* 2. VIP 3D Badge & Top Overlay Action Buttons */',
    photo3DRules + '\n/* 2. VIP 3D Badge & Top Overlay Action Buttons */'
  );
}

// 3. Add .album-banner-3d-toggle-btn styles right before /* ULTRA-LUXURY SATISFYING ALBUM CARD RETURN HIGHLIGHT
const toggleBtnStyles = `
/* VIP 3D Card FX Toggle Button in Album Active View Banner */
.album-banner-3d-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 11px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #cbd5e1;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  user-select: none;
  white-space: nowrap;
}

.album-banner-3d-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.35);
  color: #ffffff;
  transform: translateY(-1px);
}

.album-banner-3d-toggle-btn.active {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.28) 0%, rgba(244, 63, 94, 0.22) 100%);
  border: 1px solid rgba(192, 132, 252, 0.6);
  color: #f3e8ff;
  box-shadow: 0 0 16px rgba(168, 85, 247, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.25);
}

.album-banner-3d-toggle-btn.active .fa-cube {
  color: #c084fc;
  filter: drop-shadow(0 0 6px rgba(192, 132, 252, 0.8));
  animation: auraCubePulse 2.4s ease-in-out infinite;
}

@keyframes auraCubePulse {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.15) rotate(6deg); }
}

.album-banner-3d-toggle-btn:active {
  transform: scale(0.96);
}

body.light-mode .album-banner-3d-toggle-btn {
  background: rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.12);
  color: #475569;
}

body.light-mode .album-banner-3d-toggle-btn:hover {
  background: rgba(0, 0, 0, 0.09);
  color: #0f172a;
}

body.light-mode .album-banner-3d-toggle-btn.active {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.18) 0%, rgba(244, 63, 94, 0.14) 100%);
  border-color: rgba(168, 85, 247, 0.45);
  color: #7c3aed;
}
`;

if (!css.includes('.album-banner-3d-toggle-btn')) {
  css = css.replace(
    '/* ------------------------------------------------------------- */\n/* ULTRA-LUXURY SATISFYING ALBUM CARD RETURN HIGHLIGHT',
    toggleBtnStyles + '\n/* ------------------------------------------------------------- */\n/* ULTRA-LUXURY SATISFYING ALBUM CARD RETURN HIGHLIGHT'
  );
}

// 4. Hide .test-shake-btn and .browser-only in native-app-mode and mobile touch
const nativeShakeRules = `
html.native-app-mode .test-shake-btn,
body.native-app-mode .test-shake-btn,
.native-app-mode .test-shake-btn,
html.native-app-mode .browser-only,
body.native-app-mode .browser-only,
.native-app-mode .browser-only {
  display: none !important;
}

@media (hover: none) and (pointer: coarse) {
  .test-shake-btn,
  .browser-only {
    display: none !important;
  }
}
`;

if (!css.includes('html.native-app-mode .test-shake-btn')) {
  css = css.replace(
    'html.native-app-mode .preview-header,\nbody.native-app-mode .preview-header {',
    nativeShakeRules + '\nhtml.native-app-mode .preview-header,\nbody.native-app-mode .preview-header {'
  );
}

// Write back
fs.writeFileSync(cssPath, css, 'utf8');

// Verify brace balance
let open = 0, close = 0;
for (const c of css) {
  if (c === '{') open++;
  if (c === '}') close++;
}
console.log('Final CSS Brace Count: open =', open, 'close =', close);
if (open !== close) {
  console.error('ERROR: CSS braces unbalanced!');
  process.exit(1);
} else {
  console.log('SUCCESS: CSS braces balanced perfectly at', open);
}
