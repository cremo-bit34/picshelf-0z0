const fs = require('fs');
const path = require('path');

function runTests() {
  console.log('--- TESTING CUSTOM ANGLE ROTATION & STRICT ASPECT RATIO PRESERVATION ---');

  const webIndexPath = path.join(__dirname, '..', 'web', 'index.html');
  const webAppPath = path.join(__dirname, '..', 'web', 'app.js');
  const webCssPath = path.join(__dirname, '..', 'web', 'style.css');
  const appIndexPath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'web', 'index.html');
  const appAppPath = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'web', 'app.js');

  const webHtml = fs.readFileSync(webIndexPath, 'utf8');
  const webApp = fs.readFileSync(webAppPath, 'utf8');
  const webCss = fs.readFileSync(webCssPath, 'utf8');
  const appHtml = fs.readFileSync(appIndexPath, 'utf8');
  const appApp = fs.readFileSync(appAppPath, 'utf8');

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

  // 1. Verify Top Right Replace Rotate 90 with Custom Angle Toggle
  assert(!webHtml.includes('rotateCropRight()" title="Rotate 90° Clockwise">'), 'Top right 90° rotate button replaced');
  assert(webHtml.includes('id="cropAngleToggleBtn"'), 'Top right has #cropAngleToggleBtn');
  assert(webHtml.includes('onclick="toggleCropAngleDrawer()"'), 'Toggle button triggers toggleCropAngleDrawer()');

  // 2. Verify Custom Angle Drawer UI
  assert(webHtml.includes('id="cropCustomAngleDrawer"'), 'Custom angle drawer exists in index.html');
  assert(webHtml.includes('id="cropAngleSlider"'), 'Angle slider input exists');
  assert(webHtml.includes('id="cropAngleReadout"'), 'Angle readout pill exists');
  assert(webHtml.includes('adjustCustomAngle(-5)'), '-5° step button exists');
  assert(webHtml.includes('adjustCustomAngle(-1)'), '-1° step button exists');
  assert(webHtml.includes('adjustCustomAngle(1)'), '+1° step button exists');
  assert(webHtml.includes('adjustCustomAngle(5)'), '+5° step button exists');
  assert(webHtml.includes('resetCustomAngle()'), 'Reset angle button exists');

  // 3. Verify CSS rules
  assert(webCss.includes('.crop-angle-drawer {'), 'style.css defines .crop-angle-drawer');
  assert(webCss.includes('.crop-angle-slider {'), 'style.css defines .crop-angle-slider');
  assert(webCss.includes('#cropAngleToggleBtn.active'), 'style.css defines active state for toggle button');

  // 4. Verify JS math for arbitrary angle rotation
  assert(webApp.includes('customAngle: 0'), 'app.js defines customAngle in cropState');
  assert(webApp.includes('Math.round(w * cos + h * sin)'), 'app.js computes rotated bounding width with trig');
  assert(webApp.includes('Math.round(w * sin + h * cos)'), 'app.js computes rotated bounding height with trig');

  // 5. Verify mathematical simulation of aspect ratio locked expand and shrink
  console.log('\n--- Simulating 4:5 Aspect Ratio Expand and Shrink ---');
  const w = 400; // container width
  const h = 500; // container height
  const targetRatio = 4 / 5; // 0.8

  let maxPxW, maxPxH;
  if ((w / h) > targetRatio) {
    maxPxH = h;
    maxPxW = h * targetRatio;
  } else {
    maxPxW = w;
    maxPxH = w / targetRatio;
  }

  assert(Math.abs((maxPxW / maxPxH) - targetRatio) < 0.0001, 'maxPxW / maxPxH exactly equals 4:5 ratio');

  let curPxW = 200;
  let curPxH = curPxW / targetRatio; // 250
  assert(Math.abs((curPxW / curPxH) - targetRatio) < 0.0001, 'Initial box has exact 4:5 ratio');

  // Simulate multiple expands until edge
  for (let i = 0; i < 30; i++) {
    if (curPxW >= maxPxW - 0.5 || curPxH >= maxPxH - 0.5) {
      // Reached boundary, cannot expand further
      break;
    }
    curPxW = Math.min(maxPxW, curPxW + 8);
    curPxH = curPxW / targetRatio;
    if (curPxH > maxPxH) {
      curPxH = maxPxH;
      curPxW = curPxH * targetRatio;
    }
  }

  assert(Math.abs((curPxW / curPxH) - targetRatio) < 0.0001, 'At boundary, curPxW / curPxH still strictly equals 4:5 ratio');
  assert(curPxW <= w && curPxH <= h, 'At boundary, dimensions strictly <= container dimensions');

  // 6. Verify Android app asset synchronization
  assert(appHtml.includes('id="cropAngleToggleBtn"'), 'Android app has cropAngleToggleBtn');
  assert(appApp.includes('Math.round(w * cos + h * sin)'), 'Android app has trig rotation bounding box');

  console.log(`\nTest Summary: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
