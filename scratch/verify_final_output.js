const fs = require('fs');
const jsdom = (() => {
  // Simple regex-based DOM mock if jsdom isn't installed
  return null;
})();

const htmlContent = fs.readFileSync('web/index.html', 'utf8');
const i18nContent = fs.readFileSync('web/i18n.js', 'utf8');

// Parse i18n
const vm = require('vm');
const sandbox = {
  window: {},
  localStorage: {
    getItem: () => 'bn',
    setItem: () => {}
  },
  document: {
    documentElement: { lang: '' },
    querySelectorAll: (selector) => {
      // Mock selector queries for data-i18n, data-i18n-placeholder
      return [];
    }
  }
};
vm.createContext(sandbox);
vm.runInContext(i18nContent, sandbox);

const t = sandbox.window.t;
const I18N = sandbox.window.I18N_TRANSLATIONS;

console.log('Testing localization strings for Bengali (bn):');
console.log('1. Crop Screen:');
console.log('   - Header:', I18N['bn']['crop_title']);
console.log('   - Fine Rotation:', I18N['bn']['crop_fine_rotation']);
console.log('   - Free Aspect:', I18N['bn']['crop_free']);

console.log('2. Photo Rename Modal:');
console.log('   - Eyebrow:', I18N['bn']['rename_modal_eyebrow']);
console.log('   - Description:', I18N['bn']['rename_modal_desc']);
console.log('   - Label:', I18N['bn']['rename_modal_input_label']);
console.log('   - Placeholder:', I18N['bn']['rename_modal_placeholder']);
console.log('   - Max chars hint:', I18N['bn']['rename_modal_max_chars']);

console.log('3. Albums Screen & Filter Chips:');
console.log('   - Header Title:', I18N['bn']['albums_my_albums']);
console.log('   - Tag Manager Tab:', I18N['bn']['albums_tag_manager_tab']);
console.log('   - All Albums Chip:', I18N['bn']['albums_filter_all']);
console.log('   - Favorites Chip:', I18N['bn']['favorites_title']);
console.log('   - With Photos Chip:', I18N['bn']['albums_filter_with_photos']);
console.log('   - 3D Cards Chip:', I18N['bn']['albums_filter_3d']);

console.log('\nTesting localization strings for Hindi (hi):');
console.log('1. Crop Screen:');
console.log('   - Header:', I18N['hi']['crop_title']);
console.log('   - Fine Rotation:', I18N['hi']['crop_fine_rotation']);
console.log('   - Free Aspect:', I18N['hi']['crop_free']);

console.log('2. Photo Rename Modal:');
console.log('   - Eyebrow:', I18N['hi']['rename_modal_eyebrow']);
console.log('   - Description:', I18N['hi']['rename_modal_desc']);
console.log('   - Label:', I18N['hi']['rename_modal_input_label']);
console.log('   - Placeholder:', I18N['hi']['rename_modal_placeholder']);
console.log('   - Max chars hint:', I18N['hi']['rename_modal_max_chars']);

console.log('3. Albums Screen & Filter Chips:');
console.log('   - Header Title:', I18N['hi']['albums_my_albums']);
console.log('   - Tag Manager Tab:', I18N['hi']['albums_tag_manager_tab']);
console.log('   - All Albums Chip:', I18N['hi']['albums_filter_all']);
console.log('   - Favorites Chip:', I18N['hi']['favorites_title']);
console.log('   - With Photos Chip:', I18N['hi']['albums_filter_with_photos']);
console.log('   - 3D Cards Chip:', I18N['hi']['albums_filter_3d']);
