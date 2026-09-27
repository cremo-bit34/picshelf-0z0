const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('AUDIT: EMPTY ALBUM LOCALIZATION & FIREBASE FEEDBACK');
console.log('====================================================\n');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  [PASS] ${message}`);
  } else {
    failedChecks++;
    console.error(`  [FAIL] ${message}`);
  }
}

// 1. Audit i18n keys across all 10 languages
console.log('--- 1. AUDITING ALL 10 REGIONAL LANGUAGES ---');
const i18nContent = fs.readFileSync(path.join(__dirname, '..', 'web', 'i18n.js'), 'utf8');

// Sandbox execution of i18n.js to load dictionaries
const sandbox = {
  window: {},
  document: {
    documentElement: {},
    querySelectorAll: () => []
  },
  localStorage: {
    getItem: () => 'en',
    setItem: () => {}
  }
};
const vm = require('vm');
vm.createContext(sandbox);
vm.runInContext(i18nContent, sandbox);

const languages = ['en', 'hi', 'bn', 'te', 'ta', 'mr', 'gu', 'kn', 'ml', 'pa'];
const requiredEmptyAlbumKeys = [
  'gallery_empty_album_title',
  'gallery_empty_album_desc',
  'album_banner_import_btn',
  'album_back_to_all_photos',
  'gallery_empty_title',
  'gallery_empty_desc',
  'gallery_reset_filters',
  'gallery_album_empty_count',
  'gallery_photos_in_album_single',
  'gallery_photos_in_album_plural',
  'gallery_favorites_count',
  'gallery_search_count'
];

const requiredFeedbackKeys = [
  'settings_feedback_section',
  'settings_feedback_title',
  'settings_feedback_desc',
  'settings_feedback_btn',
  'feedback_modal_eyebrow',
  'feedback_modal_title',
  'feedback_type_label',
  'feedback_type_bug',
  'feedback_type_feature',
  'feedback_type_general',
  'feedback_subject_label',
  'feedback_subject_placeholder',
  'feedback_desc_label',
  'feedback_desc_placeholder',
  'feedback_contact_label',
  'feedback_contact_placeholder',
  'feedback_submit_btn',
  'feedback_toast_success',
  'feedback_toast_queued'
];

languages.forEach(lang => {
  const dict = sandbox.window.I18N_TRANSLATIONS[lang];
  assert(!!dict, `Language dictionary exists for '${lang}'`);

  let missingEmptyKeys = requiredEmptyAlbumKeys.filter(k => !dict || !dict[k]);
  assert(missingEmptyKeys.length === 0, `All ${requiredEmptyAlbumKeys.length} empty-album keys exist in '${lang}' (Missing: ${missingEmptyKeys.join(', ') || 'none'})`);

  let missingFeedbackKeys = requiredFeedbackKeys.filter(k => !dict || !dict[k]);
  assert(missingFeedbackKeys.length === 0, `All ${requiredFeedbackKeys.length} feedback keys exist in '${lang}' (Missing: ${missingFeedbackKeys.join(', ') || 'none'})`);

  // Verify NO user-facing string mentions Firebase
  const descText = (dict && dict.settings_feedback_desc) || '';
  const btnText = (dict && dict.feedback_submit_btn) || '';
  const toastText = (dict && dict.feedback_toast_success) || '';
  assert(!descText.toLowerCase().includes('firebase'), `'${lang}' settings_feedback_desc does not mention Firebase ("${descText}")`);
  assert(!btnText.toLowerCase().includes('firebase'), `'${lang}' feedback_submit_btn does not mention Firebase ("${btnText}")`);
  assert(!toastText.toLowerCase().includes('firebase'), `'${lang}' feedback_toast_success does not mention Firebase ("${toastText}")`);
});

// Test formatting interpolation
const testAlbum = 'Bow Bridge, Central Park';
const formattedEmptyCountEn = sandbox.window.t('gallery_album_empty_count', { album: testAlbum }, 'en');
assert(formattedEmptyCountEn === '0 photos in Bow Bridge, Central Park', `En album empty format: "${formattedEmptyCountEn}"`);

const formattedEmptyCountHi = sandbox.window.t('gallery_album_empty_count', { album: testAlbum }, 'hi');
assert(formattedEmptyCountHi.includes(testAlbum), `Hi album empty format: "${formattedEmptyCountHi}"`);

// 2. Audit HTML and DOM elements
console.log('\n--- 2. AUDITING HTML DOM ELEMENTS ---');
const htmlContent = fs.readFileSync(path.join(__dirname, '..', 'web', 'index.html'), 'utf8');

assert(htmlContent.includes('id="feedbackModal"'), 'HTML contains #feedbackModal');
assert(htmlContent.includes('id="feedbackForm"'), 'HTML contains #feedbackForm');
assert(htmlContent.includes('id="feedbackSubjectInput"'), 'HTML contains #feedbackSubjectInput');
assert(htmlContent.includes('id="feedbackMessageInput"'), 'HTML contains #feedbackMessageInput');
assert(htmlContent.includes('id="feedbackContactInput"'), 'HTML contains #feedbackContactInput');
assert(htmlContent.includes('id="submitFeedbackBtn"'), 'HTML contains #submitFeedbackBtn');
assert(htmlContent.includes('id="feedbackTypeBugBtn"'), 'HTML contains category pill #feedbackTypeBugBtn');
assert(htmlContent.includes('id="galleryEmptyTitle"'), 'HTML contains #galleryEmptyTitle');
assert(htmlContent.includes('id="galleryEmptyDesc"'), 'HTML contains #galleryEmptyDesc');
assert(htmlContent.includes('id="albumEmptyImportBtn"'), 'HTML contains #albumEmptyImportBtn');
assert(htmlContent.includes('id="clearAllFiltersBtn"'), 'HTML contains #clearAllFiltersBtn');
assert(htmlContent.includes('id="openFeedbackBtn"'), 'HTML contains #openFeedbackBtn');
assert(htmlContent.includes('openFeedbackModal()'), 'HTML Settings row calls openFeedbackModal()');

// Check that index.html has 0 unclosed divs (depth === 0)
let htmlDepth = 0;
htmlContent.split('\n').forEach(line => {
  const o = (line.match(/<div[ >]/g) || []).length;
  const c = (line.match(/<\/div>/g) || []).length;
  htmlDepth += (o - c);
});
assert(htmlDepth === 0, `HTML div hierarchy is perfectly balanced (Depth: ${htmlDepth})`);

// 3. Audit JavaScript Implementation
console.log('\n--- 3. AUDITING JAVASCRIPT APP LOGIC ---');
const appContent = fs.readFileSync(path.join(__dirname, '..', 'web', 'app.js'), 'utf8');

assert(appContent.includes('function openFeedbackModal()'), 'app.js implements openFeedbackModal()');
assert(appContent.includes('function closeFeedbackModal()'), 'app.js implements closeFeedbackModal()');
assert(appContent.includes('function selectFeedbackType('), 'app.js implements selectFeedbackType()');
assert(appContent.includes('function submitUserFeedback('), 'app.js implements submitUserFeedback()');
assert(appContent.includes('aura_submitted_feedback'), 'app.js caches submitted feedback locally in localStorage');
assert(appContent.includes('window.AndroidApp.submitFeedbackToFirebase'), 'app.js invokes native bridge submitFeedbackToFirebase');
assert(appContent.includes('gallery_album_empty_count'), 'app.js uses gallery_album_empty_count in renderGallery');
assert(appContent.includes('gallery_empty_album_title'), 'app.js updates gallery_empty_album_title when album has 0 photos');

// 4. Audit Native Android Bridge & Firebase Backend
console.log('\n--- 4. AUDITING NATIVE ANDROID BRIDGE & FIREBASE BACKEND ---');
const ktContent = fs.readFileSync(path.join(__dirname, '..', 'app', 'src', 'main', 'java', 'com', 'example', 'MainActivity.kt'), 'utf8');

assert(ktContent.includes('@JavascriptInterface'), 'MainActivity.kt contains JavascriptInterface annotations');
assert(ktContent.includes('fun submitFeedbackToFirebase(feedbackJson: String)'), 'MainActivity.kt contains submitFeedbackToFirebase method');
assert(ktContent.includes('File(cacheDir, "feedback")'), 'MainActivity.kt creates permanent local feedback directory');
assert(ktContent.includes('.firebaseio.com/feedback.json'), 'MainActivity.kt targets Firebase Realtime Database endpoint');
assert(ktContent.includes('conn.requestMethod = "POST"'), 'MainActivity.kt dispatches HTTP POST');

const googleServicesExists = fs.existsSync(path.join(__dirname, '..', 'app', 'google-services.json'));
assert(googleServicesExists, 'app/google-services.json exists');
if (googleServicesExists) {
  const gsContent = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'app', 'google-services.json'), 'utf8'));
  assert(!!gsContent.project_info && !!gsContent.project_info.project_id, `Firebase project ID present: ${gsContent.project_info?.project_id}`);
}

// 5. Audit Asset Synchronization
console.log('\n--- 5. AUDITING ASSET SYNCHRONIZATION ---');
const webAppJs = fs.readFileSync(path.join(__dirname, '..', 'web', 'app.js'), 'utf8');
const assetAppJs = fs.readFileSync(path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'web', 'app.js'), 'utf8');
assert(webAppJs === assetAppJs, 'web/app.js is identical to app/src/main/assets/web/app.js');

const webI18nJs = fs.readFileSync(path.join(__dirname, '..', 'web', 'i18n.js'), 'utf8');
const assetI18nJs = fs.readFileSync(path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'web', 'i18n.js'), 'utf8');
assert(webI18nJs === assetI18nJs, 'web/i18n.js is identical to app/src/main/assets/web/i18n.js');

const webIndexHtml = fs.readFileSync(path.join(__dirname, '..', 'web', 'index.html'), 'utf8');
const assetIndexHtml = fs.readFileSync(path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'web', 'index.html'), 'utf8');
assert(webIndexHtml === assetIndexHtml, 'web/index.html is identical to app/src/main/assets/web/index.html');

console.log('\n====================================================');
console.log(`AUDIT RESULTS: ${passedChecks}/${totalChecks} PASSED (${failedChecks} FAILED)`);
console.log('====================================================');

process.exit(failedChecks > 0 ? 1 : 0);
