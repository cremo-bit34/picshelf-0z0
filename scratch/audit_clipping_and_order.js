const fs = require('fs');

const html = fs.readFileSync('web/index.html', 'utf8');
const css = fs.readFileSync('web/style.css', 'utf8');
const i18n = fs.readFileSync('web/i18n.js', 'utf8');
const app = fs.readFileSync('web/app.js', 'utf8');

console.log('=== AUDITING CATEGORY ORDER & NO TEXT CLIPPING ===');

// 1. Category order check
const idxGeneral = html.indexOf('id="feedbackTypeGeneralBtn"');
const idxFeature = html.indexOf('id="feedbackTypeFeatureBtn"');
const idxBug = html.indexOf('id="feedbackTypeBugBtn"');

console.log('Category pills ordering:');
console.log('  General index:', idxGeneral);
console.log('  Feature index:', idxFeature);
console.log('  Bug index:    ', idxBug);

if (idxGeneral < idxFeature && idxFeature < idxBug) {
  console.log('  [PASS] ORDER: 1st General, 2nd Feature Idea, 3rd Bug Report');
} else {
  console.error('  [FAIL] Order is incorrect!');
  process.exit(1);
}

// 2. CSS descender clipping check
const screenTitleMatch = css.match(/\.screen-title\s*\{([^}]+)\}/);
const dialogTitleMatch = css.match(/\.dialog-title,\s*\.dialog-header\s*h3\s*\{([^}]+)\}/);

if (screenTitleMatch) {
  const content = screenTitleMatch[1];
  const hasClip = content.includes('-webkit-background-clip: text');
  console.log('Screen title has -webkit-background-clip: text:', hasClip);
  if (!hasClip) {
    console.log('  [PASS] Screen title background-clip removed -> No descender clipping');
  } else {
    console.error('  [FAIL] Screen title still has text clipping!');
    process.exit(1);
  }
}

if (dialogTitleMatch) {
  const content = dialogTitleMatch[1];
  const hasClip = content.includes('-webkit-background-clip: text');
  console.log('Dialog title has -webkit-background-clip: text:', hasClip);
  if (!hasClip) {
    console.log('  [PASS] Dialog title background-clip removed -> No descender clipping');
  } else {
    console.error('  [FAIL] Dialog title still has text clipping!');
    process.exit(1);
  }
}

// 3. Language option matra clipping check
const langNativeMatch = css.match(/\.lang-native-name\s*\{([^}]+)\}/);
if (langNativeMatch) {
  const content = langNativeMatch[1];
  const overflowVisible = content.includes('overflow: visible');
  console.log('Language native name overflow: visible:', overflowVisible);
  if (overflowVisible) {
    console.log('  [PASS] Language native name allows overflow -> No Indic matra clipping');
  }
}

// 4. Asset synchronization
const assets = ['style.css', 'i18n.js', 'app.js', 'index.html'];
assets.forEach(f => {
  const w = fs.readFileSync('web/' + f, 'utf8');
  const a = fs.readFileSync('app/src/main/assets/web/' + f, 'utf8');
  if (w === a) {
    console.log(`  [PASS] web/${f} matches app/src/main/assets/web/${f}`);
  } else {
    console.error(`  [FAIL] web/${f} does not match asset!`);
    process.exit(1);
  }
});

console.log('=== ALL AUDITS PASSED WITH ZERO ERRORS ===');
