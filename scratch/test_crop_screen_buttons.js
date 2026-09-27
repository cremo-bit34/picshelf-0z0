const fs = require('fs');
const path = require('path');

function runTests() {
  console.log('--- TESTING CROP SCREEN BUTTONS & ARRANGEMENT ---');

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

  // 1. Verify redundant text labels are removed from transform bar
  assert(!webHtml.includes('Rotate:</span>'), 'web/index.html does not contain redundant "Rotate:" label');
  assert(!webHtml.includes('Flip:</span>'), 'web/index.html does not contain redundant "Flip:" label');
  assert(!webHtml.includes('Flip H\n'), 'web/index.html does not contain redundant "Flip H" text');
  assert(!webHtml.includes('Flip V\n'), 'web/index.html does not contain redundant "Flip V" text');

  // 2. Verify transform buttons have icons and titles
  assert(webHtml.includes('id="cropRotate90Btn"') && webHtml.includes('title="Rotate 90° Clockwise"'), 'cropRotate90Btn has title and ID');
  assert(webHtml.includes('id="cropRotate180Btn"') && webHtml.includes('title="Rotate 180° (Half Turn)"'), 'cropRotate180Btn has title and ID');
  assert(webHtml.includes('id="cropRotate270Btn"') && webHtml.includes('title="Rotate 270° (90° Left)"'), 'cropRotate270Btn has title and ID');
  assert(webHtml.includes('id="cropFlipHBtn"') && webHtml.includes('title="Flip Horizontal (Mirror Across Y-Axis)"'), 'cropFlipHBtn has title and ID');
  assert(webHtml.includes('id="cropFlipVBtn"') && webHtml.includes('title="Flip Vertical (Mirror Across X-Axis)"'), 'cropFlipVBtn has title and ID');

  // 3. Verify precision toolbar in bottom bar
  assert(!webHtml.includes('Nudge:</span>'), 'web/index.html does not contain redundant "Nudge:" label');
  assert(!webHtml.includes('> Center</button>'), 'web/index.html does not contain literal " Center" text in center button');
  assert(webHtml.includes('onclick="centerCropBox()" title="Center Crop Box"'), 'centerCropBox has clean icon and title');
  assert(webHtml.includes('onclick="nudgeCrop(\'left\')" title="Nudge Left 1px"'), 'nudgeCrop left has title');
  assert(webHtml.includes('onclick="nudgeCrop(\'expand\')" title="Expand Crop Box (+4px)"'), 'nudgeCrop expand has title');

  // 4. Verify aspect ratio bar
  assert(webHtml.includes('data-aspect="1:1"'), 'aspect bar has 1:1');
  assert(webHtml.includes('data-aspect="4:5"'), 'aspect bar has 4:5');
  assert(webHtml.includes('data-aspect="3:4"'), 'aspect bar has 3:4');
  assert(webHtml.includes('data-aspect="16:9"'), 'aspect bar has 16:9');

  // 5. Verify CSS rules
  assert(webCss.includes('.crop-transform-bar {') && webCss.includes('justify-content: center;'), 'web/style.css centers crop-transform-bar');
  assert(webCss.includes('.transform-icon-btn {'), 'web/style.css defines .transform-icon-btn');
  assert(webCss.includes('.crop-precision-toolbar {'), 'web/style.css defines .crop-precision-toolbar');
  assert(webCss.includes('.precision-btn {') && webCss.includes('width: 32px;'), 'web/style.css defines precision-btn with 32px width');

  // 6. Verify Android app asset sync
  assert(appHtml.includes('id="cropRotate90Btn"'), 'app index.html has cropRotate90Btn');
  assert(!appHtml.includes('Nudge:</span>'), 'app index.html does not have Nudge label');
  assert(appCss.includes('.transform-icon-btn {'), 'app style.css defines .transform-icon-btn');

  console.log(`\nTest Summary: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
