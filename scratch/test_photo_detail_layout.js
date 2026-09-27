const fs = require('fs');
const path = require('path');

function runTests() {
  console.log('--- TESTING PHOTO DETAIL MODAL LAYOUT & BUTTON ARRANGEMENT ---');

  const webIndexPath = path.join(__dirname, '..', 'web', 'index.html');
  const webCssPath = path.join(__dirname, '..', 'web', 'style.css');
  const appIndexPath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'web', 'index.html');
  const appCssPath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'web', 'style.css');

  const webHtml = fs.readFileSync(webIndexPath, 'utf8');
  const webCss = fs.readFileSync(webCssPath, 'utf8');
  const appHtml = fs.readFileSync(appIndexPath, 'utf8');
  const appCss = fs.readFileSync(appCssPath, 'utf8');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Check Top Bar elements in web
  assert(webHtml.includes('class="detail-top-bar"'), 'web/index.html contains .detail-top-bar');
  assert(webHtml.includes('id="closeDetailBtn"'), 'web/index.html contains #closeDetailBtn');
  assert(webHtml.includes('class="detail-title-block"'), 'web/index.html contains .detail-title-block');
  assert(webHtml.includes('id="detailPhotoTitle"'), 'web/index.html contains #detailPhotoTitle');
  assert(webHtml.includes('id="detailPhotoDate"'), 'web/index.html contains #detailPhotoDate');
  assert(webHtml.includes('class="detail-top-actions"'), 'web/index.html contains .detail-top-actions');
  assert(webHtml.includes('id="detailRenameBtn"'), 'web/index.html contains #detailRenameBtn');
  assert(webHtml.includes('id="detailFavoriteBtn"'), 'web/index.html contains #detailFavoriteBtn');

  // 2. Check Floating Action Dock in web
  assert(webHtml.includes('id="detailFloatingDock"'), 'web/index.html contains #detailFloatingDock');
  assert(webHtml.includes('id="detailCropBtn"'), 'web/index.html contains #detailCropBtn');
  assert(webHtml.includes('id="detailMoveCopyBtn"'), 'web/index.html contains #detailMoveCopyBtn');
  assert(webHtml.includes('id="detailShareBtn"'), 'web/index.html contains #detailShareBtn');
  assert(webHtml.includes('id="detailDownloadBtn"'), 'web/index.html contains #detailDownloadBtn');
  assert(webHtml.includes('id="detailDeleteBtn"'), 'web/index.html contains #detailDeleteBtn');

  // 3. Check CSS styling in web
  assert(webCss.includes('.detail-top-bar {'), 'web/style.css defines .detail-top-bar');
  assert(webCss.includes('.detail-title-block {'), 'web/style.css defines .detail-title-block');
  assert(webCss.includes('.detail-floating-dock {'), 'web/style.css defines .detail-floating-dock');
  assert(webCss.includes('.detail-dock-btn {'), 'web/style.css defines .detail-dock-btn');
  assert(webCss.includes('.dock-btn-label {'), 'web/style.css defines .dock-btn-label');

  // 4. Parity with app assets
  assert(appHtml.includes('id="detailFloatingDock"'), 'app/src/main/assets/web/index.html contains #detailFloatingDock');
  assert(appCss.includes('.detail-floating-dock {'), 'app/src/main/assets/web/style.css defines .detail-floating-dock');

  console.log(`\nTest Summary: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
