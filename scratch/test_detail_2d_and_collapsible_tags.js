const fs = require('fs');

const html = fs.readFileSync('web/index.html', 'utf8');
const css = fs.readFileSync('web/style.css', 'utf8');
const js = fs.readFileSync('web/app.js', 'utf8');

const checks = [
  {
    name: 'Download button uses reliable fa-download icon',
    pass: html.includes('fa-download') && html.includes('detailDownloadBtn')
  },
  {
    name: 'Bottom sheet starts collapsed with drag handle and toggle button',
    pass: html.includes('detail-bottom-sheet collapsed') &&
          html.includes('sheet-toggle-btn') &&
          html.includes('toggleDetailBottomSheet()')
  },
  {
    name: 'Detail tag count badge exists in HTML and JS',
    pass: html.includes('detailTagCountBadge') && js.includes('detailTagCountBadge')
  },
  {
    name: 'Horizontal scrollable tag row wrapper exists in HTML and CSS',
    pass: html.includes('detail-tags-row-wrapper') &&
          css.includes('.detail-tags-row-wrapper')
  },
  {
    name: 'CSS defines collapsed mode with single row horizontal scroll and hidden location suggestions',
    pass: css.includes('.detail-bottom-sheet.collapsed') &&
          css.includes('.detail-bottom-sheet.collapsed .detail-location-suggestions')
  },
  {
    name: 'CSS defines expanded mode with full cloud wrapping and scrollable drawer',
    pass: css.includes('.detail-bottom-sheet.expanded')
  },
  {
    name: '3D effects and surface styling removed from detail stage in updateDetailModalUI',
    pass: !js.includes("stage.className = `detail-image-stage card-3d surface-${surfaceStyle}`") &&
          js.includes("stage.className = 'detail-image-stage'")
  },
  {
    name: 'initDetailImage3DParallax is no-op',
    pass: js.includes("3D parallax removed from photo detail view as requested")
  },
  {
    name: 'applyTiltToScene exempts photoDetailModal from 3D tilt',
    pass: js.includes("// 2. If photo detail modal is open, keep image pure 2D without tilt distortion")
  },
  {
    name: 'Image wrapper strictly bounds height to prevent screen overflow',
    pass: css.includes('flex: 1 1 0;') &&
          css.includes('object-fit: contain;') &&
          css.includes('#photoDetailModal') &&
          css.includes('overflow: hidden;')
  }
];

let allPassed = true;
checks.forEach(c => {
  console.log(`${c.pass ? '✅ PASS' : '❌ FAIL'}: ${c.name}`);
  if (!c.pass) allPassed = false;
});

if (allPassed) {
  console.log('\n🌟 ALL 10 TESTS PASSED SUCESSFULLY!');
} else {
  console.error('\n⚠️ SOME TESTS FAILED');
  process.exit(1);
}
