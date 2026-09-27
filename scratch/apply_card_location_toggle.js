const fs = require('fs');

console.log('--- Applying Gallery Card Location Toggle (Disabled by default) ---');

// 1. Update web/index.html to add the setting row
let indexHtml = fs.readFileSync('web/index.html', 'utf8');

const locationTagsToggleEndAnchor = `                <label class="switch-toggle">
                  <input type="checkbox" id="locationTagsToggle" onchange="toggleLocationTagsSetting(this.checked)">
                  <span class="switch-slider"></span>
                </label>
              </div>`;

const newSettingRowHtml = `                <label class="switch-toggle">
                  <input type="checkbox" id="locationTagsToggle" onchange="toggleLocationTagsSetting(this.checked)">
                  <span class="switch-slider"></span>
                </label>
              </div>

              <!-- Toggle 3: Show Location on Gallery Cards (Default: OFF) -->
              <div class="settings-row" style="border-top: 1px solid var(--border-subtle);">
                <div class="settings-row-icon" style="background: rgba(14, 165, 233, 0.15); color: #0ea5e9;">
                  <i class="fa-solid fa-map-pin"></i>
                </div>
                <div class="settings-row-text">
                  <span class="settings-row-title" data-i18n="settings_gallery_location_badges">Show Location on Cards</span>
                  <span class="settings-row-desc" data-i18n="settings_gallery_location_badges_desc">Display location badge on photo cards in gallery (Disabled by default)</span>
                </div>
                <label class="switch-toggle">
                  <input type="checkbox" id="galleryLocationBadgeToggle" onchange="toggleGalleryLocationBadgeSetting(this.checked)">
                  <span class="switch-slider"></span>
                </label>
              </div>`;

if (indexHtml.includes(locationTagsToggleEndAnchor)) {
  indexHtml = indexHtml.replace(locationTagsToggleEndAnchor, newSettingRowHtml);
  fs.writeFileSync('web/index.html', indexHtml, 'utf8');
  console.log('1. Added galleryLocationBadgeToggle row to web/index.html');
} else {
  console.warn('1. Could not find locationTagsToggleEndAnchor in web/index.html');
}

// 2. Update web/app.js
let appJs = fs.readFileSync('web/app.js', 'utf8');

// A. Add galleryShowLocationBadge to state
const stateLocAnchor = `  locationTagCountry: (function() {
    try { return localStorage.getItem('aura_loc_tag_country') !== 'false'; } catch(e) { return true; }
  })()`;

const stateLocReplacement = `  locationTagCountry: (function() {
    try { return localStorage.getItem('aura_loc_tag_country') !== 'false'; } catch(e) { return true; }
  })(),
  galleryShowLocationBadge: (function() {
    try { return localStorage.getItem('aura_gallery_show_location_badge') === 'true'; } catch(e) { return false; }
  })()`;

if (appJs.includes(stateLocAnchor)) {
  appJs = appJs.replace(stateLocAnchor, stateLocReplacement);
  console.log('2A. Added galleryShowLocationBadge to initial state (default: false)');
}

// B. Load setting in loadSettings / loadState
const loadSettingsAnchor = `  const savedCountry = localStorage.getItem('aura_loc_tag_country');
  if (savedCountry !== null) state.locationTagCountry = savedCountry !== 'false';`;

const loadSettingsReplacement = `  const savedCountry = localStorage.getItem('aura_loc_tag_country');
  if (savedCountry !== null) state.locationTagCountry = savedCountry !== 'false';
  const savedGalleryLoc = localStorage.getItem('aura_gallery_show_location_badge');
  state.galleryShowLocationBadge = savedGalleryLoc === 'true';`;

if (appJs.includes(loadSettingsAnchor)) {
  appJs = appJs.replace(loadSettingsAnchor, loadSettingsReplacement);
  console.log('2B. Added galleryShowLocationBadge load in loadSettings');
}

// Clean up previously auto-injected location tags in loadState
const loadStateAnchor = `function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);`;

const loadStateReplacement = `function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    // Cleanup any previously auto-injected location tags from photo.tags
    if (parsed && Array.isArray(parsed.photos)) {
      const knownAlbums = Array.isArray(parsed.tags) ? parsed.tags.map(t => (t.name || '').toLowerCase()) : [];
      parsed.photos.forEach(p => {
        if (p && p.location && Array.isArray(p.tags) && p.tags.length > 0) {
          const locNames = [p.location.country, p.location.city, p.location.place]
            .filter(Boolean)
            .map(s => s.toLowerCase());
          p.tags = p.tags.filter(t => {
            const isLoc = locNames.includes(t.toLowerCase());
            const isAlbum = knownAlbums.includes(t.toLowerCase());
            return !isLoc || isAlbum;
          });
        }
      });
    }`;

if (appJs.includes(loadStateAnchor)) {
  appJs = appJs.replace(loadStateAnchor, loadStateReplacement);
  console.log('2C. Added auto-location tags cleanup in loadState');
}

// C. Save setting in saveState
const saveSettingsAnchor = `  localStorage.setItem('aura_loc_tag_country', state.locationTagCountry !== false ? 'true' : 'false');`;
const saveSettingsReplacement = `  localStorage.setItem('aura_loc_tag_country', state.locationTagCountry !== false ? 'true' : 'false');
  localStorage.setItem('aura_gallery_show_location_badge', state.galleryShowLocationBadge === true ? 'true' : 'false');`;

if (appJs.includes(saveSettingsAnchor)) {
  appJs = appJs.replace(saveSettingsAnchor, saveSettingsReplacement);
  console.log('2D. Added galleryShowLocationBadge save in saveState');
}

// D. Sync UI toggle in renderSettings / setup
const countryToggleUiAnchor = `  const countryToggle = document.getElementById('locationTagCountryToggle');
  if (countryToggle) {
    countryToggle.checked = state.locationTagCountry !== false;
  }`;

const countryToggleUiReplacement = `  const countryToggle = document.getElementById('locationTagCountryToggle');
  if (countryToggle) {
    countryToggle.checked = state.locationTagCountry !== false;
  }
  const galleryLocBadgeToggle = document.getElementById('galleryLocationBadgeToggle');
  if (galleryLocBadgeToggle) {
    galleryLocBadgeToggle.checked = state.galleryShowLocationBadge === true;
  }`;

if (appJs.includes(countryToggleUiAnchor)) {
  appJs = appJs.replace(countryToggleUiAnchor, countryToggleUiReplacement);
  console.log('2E. Added toggle synchronization in settings UI');
}

// E. Add toggleGalleryLocationBadgeSetting function
const windowFuncAnchor = `  window.toggleLocationTagSubSetting = toggleLocationTagSubSetting;`;
const windowFuncReplacement = `  window.toggleLocationTagSubSetting = toggleLocationTagSubSetting;

  window.toggleGalleryLocationBadgeSetting = function(checked) {
    state.galleryShowLocationBadge = !!checked;
    saveState();
    renderGallery();
    renderDock();
    showToast(state.galleryShowLocationBadge ? 'Location badges on cards enabled' : 'Location badges on cards hidden');
  };`;

if (appJs.includes(windowFuncAnchor)) {
  appJs = appJs.replace(windowFuncAnchor, windowFuncReplacement);
  console.log('2F. Added window.toggleGalleryLocationBadgeSetting handler');
}

// F. Update renderGallery card to ONLY show location pill if state.galleryShowLocationBadge === true
const galleryCardPillAnchor = `            \${(photo.location && typeof photo.location.latitude === 'number') ? \`
              <span class="card-loc-pill" title="Location: \${escapeHtml(photo.location.city || photo.location.place || photo.location.country || photo.location.displayCoords || formatDisplayCoords(photo.location.latitude, photo.location.longitude))}" onclick="event.stopPropagation(); openPhotoDetail('\${photo.id}')">
                <i class="fa-solid fa-location-dot"></i> \${escapeHtml(photo.location.city || photo.location.place || photo.location.country || photo.location.displayCoords || formatDisplayCoords(photo.location.latitude, photo.location.longitude))}
              </span>
            \` : ''}`;

const galleryCardPillReplacement = `            \${(state.galleryShowLocationBadge === true && photo.location && typeof photo.location.latitude === 'number') ? \`
              <span class="card-loc-pill" title="Location: \${escapeHtml(photo.location.city || photo.location.place || photo.location.country || photo.location.displayCoords || formatDisplayCoords(photo.location.latitude, photo.location.longitude))}" onclick="event.stopPropagation(); openPhotoDetail('\${photo.id}')">
                <i class="fa-solid fa-location-dot"></i> \${escapeHtml(photo.location.city || photo.location.place || photo.location.country || photo.location.displayCoords || formatDisplayCoords(photo.location.latitude, photo.location.longitude))}
              </span>
            \` : ''}`;

if (appJs.includes(galleryCardPillAnchor)) {
  appJs = appJs.replace(galleryCardPillAnchor, galleryCardPillReplacement);
  console.log('2G. Updated gallery card to strictly respect state.galleryShowLocationBadge === true');
} else {
  console.warn('2G. Could not find galleryCardPillAnchor');
}

// G. Update dock card to also respect state.galleryShowLocationBadge === true
const dockCardPillAnchor = `            \${(photo.location && typeof photo.location.latitude === 'number') ? \`
              <span class="dock-location-pill" title="Location: \${escapeHtml(photo.location.city || photo.location.place || photo.location.country || photo.location.displayCoords || formatDisplayCoords(photo.location.latitude, photo.location.longitude))}">
                <i class="fa-solid fa-location-dot"></i> \${escapeHtml(photo.location.city || photo.location.place || photo.location.country || photo.location.displayCoords || formatDisplayCoords(photo.location.latitude, photo.location.longitude))}
              </span>
            \` : ''}`;

const dockCardPillReplacement = `            \${(state.galleryShowLocationBadge === true && photo.location && typeof photo.location.latitude === 'number') ? \`
              <span class="dock-location-pill" title="Location: \${escapeHtml(photo.location.city || photo.location.place || photo.location.country || photo.location.displayCoords || formatDisplayCoords(photo.location.latitude, photo.location.longitude))}">
                <i class="fa-solid fa-location-dot"></i> \${escapeHtml(photo.location.city || photo.location.place || photo.location.country || photo.location.displayCoords || formatDisplayCoords(photo.location.latitude, photo.location.longitude))}
              </span>
            \` : ''}`;

if (appJs.includes(dockCardPillAnchor)) {
  appJs = appJs.replace(dockCardPillAnchor, dockCardPillReplacement);
  console.log('2H. Updated dock card to strictly respect state.galleryShowLocationBadge === true');
} else {
  console.warn('2H. Could not find dockCardPillAnchor');
}

// H. Remove auto-pushing of location tags into photo.tags on import
// In onNativePhotoCaptured:
const capturedAutoTagsAnchor = `    // Automatically populate initial location tags if GPS enabled
    const initialTags = [];
    if (loc && state.locationTagsEnabled !== false) {
      if (state.locationTagCity !== false && loc.city) initialTags.push(loc.city);
      else if (state.locationTagPlace !== false && loc.place) initialTags.push(loc.place);
      else if (state.locationTagCountry !== false && loc.country) initialTags.push(loc.country);
    }

    const newPhoto = {
      id: newPhotoId,
      displayName: photoName || \`Camera Shot #\${state.photos.length + 1}\`,
      category: 'Camera',
      isPending: true,
      isFavorite: false,
      deletedAt: null,
      createdAt: photoCreated || timestamp,
      cameraModel: camera,
      tags: initialTags,
      dataUrl: dataUrl,
      location: loc
    };`;

const capturedAutoTagsReplacement = `    const newPhoto = {
      id: newPhotoId,
      displayName: photoName || \`Camera Shot #\${state.photos.length + 1}\`,
      category: 'Camera',
      isPending: true,
      isFavorite: false,
      deletedAt: null,
      createdAt: photoCreated || timestamp,
      cameraModel: camera,
      tags: [],
      dataUrl: dataUrl,
      location: loc
    };`;

if (appJs.includes(capturedAutoTagsAnchor)) {
  appJs = appJs.replace(capturedAutoTagsAnchor, capturedAutoTagsReplacement);
  console.log('2I. Removed auto-tag injection from onNativePhotoCaptured');
}

// In onNativePhotosImported:
const importedAutoTagsAnchor = `      // Automatically populate initial location tags if GPS enabled
      const initialTags = [];
      if (loc && state.locationTagsEnabled !== false) {
        if (state.locationTagCity !== false && loc.city) initialTags.push(loc.city);
        else if (state.locationTagPlace !== false && loc.place) initialTags.push(loc.place);
        else if (state.locationTagCountry !== false && loc.country) initialTags.push(loc.country);
      }

      const newPhoto = {
        id: newPhotoId,
        displayName: item.displayName || \`Moment #\${state.photos.length + 1}\`,
        category: 'Import',
        isPending: true,
        isFavorite: false,
        deletedAt: null,
        createdAt: photoCreated || (timestamp + index),
        cameraModel: camera,
        tags: initialTags,
        dataUrl: item.dataUrl,
        location: loc
      };`;

const importedAutoTagsReplacement = `      const newPhoto = {
        id: newPhotoId,
        displayName: item.displayName || \`Moment #\${state.photos.length + 1}\`,
        category: 'Import',
        isPending: true,
        isFavorite: false,
        deletedAt: null,
        createdAt: photoCreated || (timestamp + index),
        cameraModel: camera,
        tags: [],
        dataUrl: item.dataUrl,
        location: loc
      };`;

if (appJs.includes(importedAutoTagsAnchor)) {
  appJs = appJs.replace(importedAutoTagsAnchor, importedAutoTagsReplacement);
  console.log('2J. Removed auto-tag injection from onNativePhotosImported');
}

// In onNativePhotosImportedToAlbum:
const albumAutoTagsAnchor = `      const albumTags = [targetAlbum];
      if (loc && state.locationTagsEnabled !== false) {
        const locTag = (state.locationTagCity !== false && loc.city) ? loc.city :
                       ((state.locationTagPlace !== false && loc.place) ? loc.place :
                       ((state.locationTagCountry !== false && loc.country) ? loc.country : null));
        if (locTag && !albumTags.some(t => t.toLowerCase() === locTag.toLowerCase())) {
          albumTags.push(locTag);
        }
      }

      const newPhoto = {
        id: newPhotoId,
        displayName: item.displayName || \`Moment #\${state.photos.length + 1}\`,
        category: targetAlbum,
        isPending: false, // Placed directly into album; bypasses dock!
        isFavorite: false,
        deletedAt: null,
        createdAt: photoCreated || (timestamp + index),
        cameraModel: camera,
        tags: albumTags,
        dataUrl: item.dataUrl,
        location: loc
      };`;

const albumAutoTagsReplacement = `      const newPhoto = {
        id: newPhotoId,
        displayName: item.displayName || \`Moment #\${state.photos.length + 1}\`,
        category: targetAlbum,
        isPending: false, // Placed directly into album; bypasses dock!
        isFavorite: false,
        deletedAt: null,
        createdAt: photoCreated || (timestamp + index),
        cameraModel: camera,
        tags: [targetAlbum],
        dataUrl: item.dataUrl,
        location: loc
      };`;

if (appJs.includes(albumAutoTagsAnchor)) {
  appJs = appJs.replace(albumAutoTagsAnchor, albumAutoTagsReplacement);
  console.log('2K. Removed auto-tag injection from onNativePhotosImportedToAlbum');
}

// In background resolution callbacks:
const bgTagAnchor1 = `            if (p) {
              p.location = resolved;
              if (state.locationTagsEnabled !== false && resolved && resolved.city) {
                if (!p.tags.some(t => t.toLowerCase() === resolved.city.toLowerCase())) {
                  p.tags.push(resolved.city);
                }
              }
              saveState();`;

const bgTagReplacement1 = `            if (p) {
              p.location = resolved;
              saveState();`;

if (appJs.includes(bgTagAnchor1)) {
  appJs = appJs.split(bgTagAnchor1).join(bgTagReplacement1);
  console.log('2L. Removed auto-tag push in background geocoding callback');
}

fs.writeFileSync('web/app.js', appJs, 'utf8');
console.log('Saved web/app.js successfully!');

// 3. Add translations to web/i18n.js
let i18nJs = fs.readFileSync('web/i18n.js', 'utf8');

const i18nAdditions = {
  en: {
    settings_gallery_location_badges: 'Show Location on Cards',
    settings_gallery_location_badges_desc: 'Display location badge on photo cards in gallery (Disabled by default)'
  },
  hi: {
    settings_gallery_location_badges: 'कार्ड पर स्थान दिखाएं',
    settings_gallery_location_badges_desc: 'गैलरी में फोटो कार्ड पर स्थान बैज दिखाएं (डिफ़ॉल्ट रूप से बंद)'
  },
  te: {
    settings_gallery_location_badges: 'కార్డులపై స్థానాన్ని చూపించు',
    settings_gallery_location_badges_desc: 'గ్యాలరీ ఫోటో కార్డులపై లొకేషన్ బ్యాడ్జ్‌ని చూపించు (డిఫాల్ట్‌గా ఆఫ్‌లో ఉంది)'
  },
  ta: {
    settings_gallery_location_badges: 'கார்டுகளில் இருப்பிடத்தைக் காட்டு',
    settings_gallery_location_badges_desc: 'கேலரி கார்டுகளில் இருப்பிட பேட்ஜைக் காட்டு (இயல்பாக முடக்கப்பட்டுள்ளது)'
  },
  mr: {
    settings_gallery_location_badges: 'कार्डवर स्थान दाखवा',
    settings_gallery_location_badges_desc: 'गॅलरी फोटो कार्डवर स्थान बॅज दाखवा (डीफॉल्टनुसार बंद)'
  },
  gu: {
    settings_gallery_location_badges: 'કાર્ડ પર સ્થાન બતાવો',
    settings_gallery_location_badges_desc: 'ગેલેરી ફોટો કાર્ડ્સ પર સ્થાન બેજ બતાવો (ડિફૉલ્ટ રૂપે બંધ)'
  },
  kn: {
    settings_gallery_location_badges: 'ಕಾರ್ಡ್‌ಗಳಲ್ಲಿ ಸ್ಥಳವನ್ನು ತೋರಿಸಿ',
    settings_gallery_location_badges_desc: 'ಗ್ಯಾಲರಿ ಫೋಟೋ ಕಾರ್ಡ್‌ಗಳಲ್ಲಿ ಸ್ಥಳದ ಬ್ಯಾಡ್ಜ್ ತೋರಿಸಿ (ಪೂರ್ವನಿಯೋಜಿತವಾಗಿ ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ)'
  },
  ml: {
    settings_gallery_location_badges: 'കാർഡുകളിൽ ലൊക്കേഷൻ കാണിക്കുക',
    settings_gallery_location_badges_desc: 'ഗാലറി ഫോട്ടോ കാർഡുകളിൽ ലൊക്കേഷൻ ബാഡ്ജ് കാണിക്കുക (സ്ഥിരസ്ഥിതിയായി ഓഫാണ്)'
  },
  pa: {
    settings_gallery_location_badges: 'ਕਾਰਡਾਂ ਉੱਤੇ ਸਥਾਨ ਦਿਖਾਓ',
    settings_gallery_location_badges_desc: 'ਗੈਲਰੀ ਫੋਟੋ ਕਾਰਡਾਂ ਉੱਤੇ ਸਥਾਨ ਬੈਜ ਦਿਖਾਓ (ਮੂਲ ਰੂਪ ਵਿੱਚ ਬੰਦ)'
  }
};

for (const [lang, trans] of Object.entries(i18nAdditions)) {
  const anchor = `settings_location_tags_desc:`;
  const langMatch = i18nJs.indexOf(`${lang}: {`);
  if (langMatch !== -1) {
    const nextAnchor = i18nJs.indexOf(anchor, langMatch);
    if (nextAnchor !== -1) {
      const lineEnd = i18nJs.indexOf('\n', nextAnchor);
      const toInject = `\n    settings_gallery_location_badges: '${trans.settings_gallery_location_badges}',\n    settings_gallery_location_badges_desc: '${trans.settings_gallery_location_badges_desc}',`;
      i18nJs = i18nJs.slice(0, lineEnd) + toInject + i18nJs.slice(lineEnd);
    }
  }
}

fs.writeFileSync('web/i18n.js', i18nJs, 'utf8');
console.log('3. Added translations to web/i18n.js');

console.log('--- ALL UPDATES APPLIED SUCCESSFULLY ---');
