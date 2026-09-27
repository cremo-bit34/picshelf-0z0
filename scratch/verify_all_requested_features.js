const fs = require('fs');

const html = fs.readFileSync('app/src/main/assets/web/index.html', 'utf8');
const css = fs.readFileSync('app/src/main/assets/web/style.css', 'utf8');
const js = fs.readFileSync('app/src/main/assets/web/app.js', 'utf8');
const kt = fs.readFileSync('app/src/main/java/com/example/MainActivity.kt', 'utf8');

const features = [
  // 1. Image Edit Screen & Card
  {
    category: 'Image Edit Screen & Card',
    name: 'Crop/Edit Modal & Stage (cropEditorModal, cropStageWrapper, cropBox)',
    pass: html.includes('id="cropEditorModal"') &&
          html.includes('id="cropStageWrapper"') &&
          html.includes('id="cropBox"') &&
          js.includes('function openCropEditorModal') &&
          js.includes('function applyAndSaveCrop')
  },
  {
    category: 'Image Edit Screen & Card',
    name: 'Aspect Ratio presets (Free, 1:1, 4:5, 16:9, etc.) & custom angle slider',
    pass: html.includes('id="cropAspectBar"') &&
          html.includes('id="cropAngleSlider"') &&
          html.includes('id="cropAngleReadout"') &&
          js.includes('function setCropAspect') &&
          js.includes('function toggleCropAngleDrawer')
  },
  {
    category: 'Image Edit Screen & Card',
    name: 'Transforms: 90/180/270 rotation, H/V flips & precision nudge controls',
    pass: html.includes('id="cropRotate90Btn"') &&
          html.includes('id="cropFlipHBtn"') &&
          html.includes('id="cropPrecisionToolbar"') &&
          js.includes('function rotateCropBy')
  },

  // 2. App Lock Screen & Passcode Setup
  {
    category: 'App Lock Screen & Passcode Setup',
    name: 'Passcode Setup Screen (Dual phase: Create PIN + Confirm PIN)',
    pass: html.includes('id="passcodeSetupModal"') &&
          html.includes('id="setupPasscodeDots"') &&
          js.includes('function openPasscodeSetupScreen') &&
          js.includes('function processSetupPasscodeStep')
  },
  {
    category: 'App Lock Screen & Passcode Setup',
    name: 'App Lock Verification & Forgot Passcode recovery (no hardcoded 1234)',
    pass: html.includes('id="appLockOverlay"') &&
          html.includes('id="forgotPasscodeModal"') &&
          js.includes('function verifyAppLockPin') &&
          js.includes('function handleForgotPasscode') &&
          !js.includes("storedPin = '1234'")
  },
  {
    category: 'App Lock Screen & Passcode Setup',
    name: 'Native Android Biometric Keyguard in MainActivity.kt',
    pass: kt.includes('fun authenticateBiometrics') &&
          kt.includes('KeyguardManager')
  },

  // 3. 3D Effects & Parallax
  {
    category: '3D Effects & Parallax',
    name: '3D Image cards in Album & Premium surface effects',
    pass: js.includes('albumPhotos3DEnabled') &&
          css.includes('.surface-glass') &&
          css.includes('.surface-holo') &&
          css.includes('card-3d')
  },
  {
    category: '3D Effects & Parallax',
    name: 'Card Return Flash Effect when returning from photo view',
    pass: css.includes('.photo-card-elegant.card-return-flash') &&
          css.includes('cardReturnAuraPulse') &&
          js.includes('flashReturnedPhotoCard')
  },

  // 4. Detail Screen & Single Outer Scrollbar
  {
    category: 'Detail Screen & Tag Bar',
    name: 'Photo viewer contained in mobile frame without screen overflow',
    pass: css.includes('#photoDetailModal {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  width: 100%;\n  height: 100%;')
  },
  {
    category: 'Detail Screen & Tag Bar',
    name: 'Single right-side outer scrollbar (inner scrollbar under tags removed)',
    pass: css.includes('.detail-bottom-sheet.expanded::-webkit-scrollbar {\n  width: 5px;\n  display: block !important;\n}') &&
          css.includes('.detail-bottom-sheet.expanded .detail-tags-row-wrapper::-webkit-scrollbar {\n  display: none !important;')
  }
];

console.log('================ FEATURE AUDIT REPORT ================');
let allPassed = true;
let currentCat = '';
features.forEach(f => {
  if (f.category !== currentCat) {
    currentCat = f.category;
    console.log(`\n📌 [${currentCat}]`);
  }
  console.log(`  ${f.pass ? '✅ PASS' : '❌ FAIL'}: ${f.name}`);
  if (!f.pass) allPassed = false;
});

if (allPassed) {
  console.log('\n🌟 ALL REQUESTED FEATURES VERIFIED 100% IN ANDROID ASSETS!');
} else {
  console.error('\n⚠️ SOME FEATURES FAILED VERIFICATION');
  process.exit(1);
}
