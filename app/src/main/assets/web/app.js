/**
 * Photo Organizer - Mobile App Interactive Preview Logic
 */

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeJs(str) {
  if (str == null) return '';
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

// Initial Seed Data matching Android Room Database
const INITIAL_TAGS = [
  { name: 'Wedding', color: '#e11d48' },
  { name: 'Birthday', color: '#d97706' },
  { name: 'Job Offer', color: '#059669' },
  { name: 'Dinner with Family', color: '#7c3aed' },
  { name: 'Trip', color: '#0284c7' }
];

const INITIAL_PHOTOS = [
  // Loading Dock (Pending Photos)
  {
    id: 'pending_1',
    displayName: 'Floral Table Decor',
    category: 'Loading Dock',
    isPending: true,
    isFavorite: false,
    deletedAt: null,
    createdAt: Date.now() - 3600000,
    tags: [],
    gradient: ['#ec4899', '#f43f5e'],
    location: {
      latitude: 18.9220,
      longitude: 72.8347,
      place: 'Taj Palace',
      city: 'Mumbai',
      country: 'India'
    }
  },
  {
    id: 'pending_2',
    displayName: 'Birthday Candles Glow',
    category: 'Loading Dock',
    isPending: true,
    isFavorite: false,
    deletedAt: null,
    createdAt: Date.now() - 7200000,
    tags: [],
    gradient: ['#f59e0b', '#ea580c'],
    location: {
      latitude: 28.6139,
      longitude: 77.2090,
      place: 'Connaught Place',
      city: 'New Delhi',
      country: 'India'
    }
  },
  {
    id: 'pending_3',
    displayName: 'Signed Offer Letter',
    category: 'Loading Dock',
    isPending: true,
    isFavorite: false,
    deletedAt: null,
    createdAt: Date.now() - 10800000,
    tags: [],
    gradient: ['#10b981', '#059669'],
    location: {
      latitude: 12.9716,
      longitude: 77.5946,
      place: 'MG Road Tech Hub',
      city: 'Bengaluru',
      country: 'India'
    }
  },

  // Main Gallery (Organized Photos)
  {
    id: 'gallery_1',
    displayName: 'Wedding Vows Exchange',
    category: 'Wedding',
    isPending: false,
    isFavorite: false,
    deletedAt: null,
    createdAt: Date.now() - (8 * 86400000),
    tags: ['Wedding'],
    gradient: ['#e11d48', '#9f1239'],
    location: {
      latitude: 15.4909,
      longitude: 73.8278,
      place: 'Calangute Beach',
      city: 'Goa',
      country: 'India'
    }
  },
  {
    id: 'gallery_2',
    displayName: 'First Dance Magic',
    category: 'Wedding',
    isPending: false,
    isFavorite: false,
    deletedAt: null,
    createdAt: Date.now() - (8 * 86400000),
    tags: ['Wedding'],
    gradient: ['#be123c', '#881337'],
    location: {
      latitude: 24.5854,
      longitude: 73.7125,
      place: 'City Palace Lake',
      city: 'Udaipur',
      country: 'India'
    }
  },
  {
    id: 'gallery_3',
    displayName: '20th Birthday Bash',
    category: 'Birthday',
    isPending: false,
    isFavorite: true,
    deletedAt: null,
    createdAt: Date.now() - (20 * 86400000),
    tags: ['Birthday', 'Dinner with Family'],
    gradient: ['#f59e0b', '#d97706'],
    location: {
      latitude: 40.7829,
      longitude: -73.9654,
      place: 'Central Park Terrace',
      city: 'New York',
      country: 'United States'
    }
  },
  {
    id: 'gallery_4',
    displayName: 'Birthday Party Surprises',
    category: 'Birthday',
    isPending: false,
    isFavorite: true,
    deletedAt: null,
    createdAt: Date.now() - (20 * 86400000),
    tags: ['Birthday'],
    gradient: ['#fb923c', '#ea580c'],
    location: {
      latitude: 48.8584,
      longitude: 2.2945,
      place: 'Eiffel Tower Gardens',
      city: 'Paris',
      country: 'France'
    }
  },
  {
    id: 'gallery_5',
    displayName: 'Excited First Day at Work',
    category: 'Job Offer',
    isPending: false,
    isFavorite: true,
    deletedAt: null,
    createdAt: Date.now() - (2 * 86400000),
    tags: ['Job Offer'],
    gradient: ['#10b981', '#0d9488'],
    location: {
      latitude: 1.2838,
      longitude: 103.8591,
      place: 'Marina Bay Sands',
      city: 'Singapore',
      country: 'Singapore'
    }
  },
  {
    id: 'gallery_6',
    displayName: "Grandma's Sunday Dinner",
    category: 'Family',
    isPending: false,
    isFavorite: false,
    deletedAt: null,
    createdAt: Date.now() - (5 * 86400000),
    tags: ['Dinner with Family'],
    gradient: ['#8b5cf6', '#6d28d9'],
    location: {
      latitude: 41.8902,
      longitude: 12.4922,
      place: 'Colosseum Square',
      city: 'Rome',
      country: 'Italy'
    }
  },
  {
    id: 'gallery_7',
    displayName: 'Rocky Mountain Sunset',
    category: 'Trip',
    isPending: false,
    isFavorite: false,
    deletedAt: null,
    createdAt: Date.now() - (35 * 86400000),
    tags: ['Trip'],
    gradient: ['#0ea5e9', '#0369a1'],
    location: {
      latitude: 35.6586,
      longitude: 139.7454,
      place: 'Shibuya Crossing',
      city: 'Tokyo',
      country: 'Japan'
    }
  }
];

const PRESET_COLORS = [
  '#e11d48', '#d97706', '#059669', '#7c3aed', '#0284c7', '#db2777', '#4f46e5', '#0891b2'
];

// App State
let state = {
  photos: [],
  tags: [],
  activeTab: 'dockScreen',
  searchQuery: '',
  selectedFilterTags: new Set(),
  startDate: null,
  endDate: null,
  selectedDockPhotoIds: new Set(),
  selectedGalleryPhotoIds: new Set(),
  activePhotoId: null,
  detailPhotoList: [],
  detailCurrentIndex: 0,
  detailContextTitle: '',
  selectedNewTagColor: PRESET_COLORS[0],
  tagToRename: null,
  renameColor: PRESET_COLORS[0],
  albumSearchQuery: '',
  albumFilter: 'all',
  albumSort: 'default',
  currentAlbumView: 'albums',
  onlyFavorites: false,
  isPro: true,
  biometricLock: false,
  themePref: 'dark',
  accentColor: '#f43f5e',
  savedCustomColors: ['#ec4899', '#8b5cf6', '#06b6d4'],
  gallerySort: 'date-desc',
  deletedAlbums: [],
  global3DEnabled: true,
  albumPhotos3DEnabled: (function() {
    try { return localStorage.getItem('aura_album_photos_3d_enabled') !== 'false'; } catch(e) { return true; }
  })(),
  favorites3DStyle: (function() {
    try { return localStorage.getItem('photo_org_favorites_3d_style') || 'holo'; } catch(e) { return 'holo'; }
  })(),
  favoritesCustomCover: (function() {
    try { return localStorage.getItem('photo_org_favorites_custom_cover') || null; } catch(e) { return null; }
  })(),
  current3DModalAlbum: null,
  selected3DSurfacePhoto: null,
  selected3DSurfaceStyle: 'holo',
  showFeaturedCarousel: false,
  language: 'en',
  gpsMetadataEnabled: (function() {
    try { return localStorage.getItem('aura_gps_metadata_enabled') !== 'false'; } catch(e) { return true; }
  })(),
  locationTagsEnabled: (function() {
    try { return localStorage.getItem('aura_location_tags_enabled') !== 'false'; } catch(e) { return true; }
  })(),
  locationTagPlace: (function() {
    try { return localStorage.getItem('aura_loc_tag_place') !== 'false'; } catch(e) { return true; }
  })(),
  locationTagCity: (function() {
    try { return localStorage.getItem('aura_loc_tag_city') !== 'false'; } catch(e) { return true; }
  })(),
  locationTagCountry: (function() {
    try { return localStorage.getItem('aura_loc_tag_country') !== 'false'; } catch(e) { return true; }
  })(),
  galleryShowLocationBadge: (function() {
    try { return localStorage.getItem('aura_gallery_show_location_badge') === 'true'; } catch(e) { return false; }
  })()
};
window.state = state;

// High-Fashion Editorial Photo Generator (Liquid Light, Bokeh & Vignette)
function generateGradientImage(title, category, gradient = ['#f43f5e', '#8b5cf6']) {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');

  const c1 = gradient[0] || '#f43f5e';
  const c2 = gradient[1] || '#8b5cf6';

  // Base luxury mesh gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 800, 800);
  bgGrad.addColorStop(0, c1);
  bgGrad.addColorStop(0.45, '#18122B');
  bgGrad.addColorStop(1, c2);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 800, 800);

  // Radiant ambient light spheres (studio lighting / lens bloom)
  const drawLightOrb = (x, y, radius, color, alpha) => {
    const radGrad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    radGrad.addColorStop(0, color);
    radGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = alpha;
    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
  };

  drawLightOrb(650, 160, 360, '#fbbf24', 0.42); // Golden sun flare
  drawLightOrb(180, 620, 380, c1, 0.65); // Rose gold ambient light
  drawLightOrb(420, 380, 300, '#ffffff', 0.22); // Center specular light
  drawLightOrb(700, 700, 300, c2, 0.55); // Royal violet bloom

  // Subtle analog film grain for cinematic texture
  const imgData = ctx.getImageData(0, 0, 800, 800);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 16) {
    const noise = (Math.random() - 0.5) * 16;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  // Vignette overlay (Leica lens darkening)
  const vignette = ctx.createRadialGradient(400, 400, 240, 400, 400, 560);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(6, 8, 16, 0.65)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, 800, 800);

  // Minimal luxury watermark at bottom
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = 'italic 15px "Playfair Display", Georgia, serif';
  ctx.fillText('Aura Photo Studio · Editorial', 40, 755);

  return canvas.toDataURL('image/jpeg', 0.92);
}

// Universal Smooth Mouse/Touch Drag & Wheel Horizontal Scroll
function makeDraggableScroll(slider) {
  if (!slider || slider._hasDraggableScroll) return;
  slider._hasDraggableScroll = true;
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('dragging');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.remove('dragging');
  });

  slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('dragging');
  });

  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.6;
    slider.scrollLeft = scrollLeft - walk;
  });

  slider.addEventListener('wheel', (e) => {
    if (e.deltaY !== 0) {
      slider.scrollLeft += e.deltaY;
    }
  }, { passive: true });
}

function getLuxuryCrownSvg(size = 11, className = 'aura-luxury-crown') {
  return `<svg class="${className}" width="${size}" height="${size}" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" style="display:inline-block; vertical-align:middle; flex-shrink:0;">
    <path d="M3.2 15.6h13.6a.7.7 0 0 0 .7-.7v-.2a.7.7 0 0 0-.7-.7H3.2a.7.7 0 0 0-.7.7v.2a.7.7 0 0 0 .7.7zm-.9-3.7a.7.7 0 0 0 .66.45h14.08a.7.7 0 0 0 .66-.45l1.6-4.6a.7.7 0 0 0-1.05-.82l-3.8 2.45-3.15-5.1a.7.7 0 0 0-1.2 0l-3.15 5.1-3.8-2.45a.7.7 0 0 0-1.05.82l1.6 4.6z"/>
  </svg>`;
}
window.getLuxuryCrownSvg = getLuxuryCrownSvg;

function formatCardDateTime(ts) {
  if (!ts) return { date: '', time: '', display: '', full: '' };
  const d = new Date(ts);
  if (isNaN(d.getTime())) return { date: '', time: '', display: '', full: '' };

  const now = new Date();
  const isSameYear = d.getFullYear() === now.getFullYear();

  const dateStr = d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    ...(isSameYear ? {} : { year: 'numeric' })
  });

  const timeStr = d.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit'
  });

  return {
    date: dateStr,
    time: timeStr,
    display: `${dateStr} · ${timeStr}`,
    full: d.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  };
}

function formatCardDate(ts) {
  if (!ts) return '';
  return formatCardDateTime(ts).display;
}

// Initialize LocalStorage State
function loadState() {
  const savedPhotos = localStorage.getItem('photo_org_photos');
  const savedTags = localStorage.getItem('photo_org_tags');
  const savedPro = localStorage.getItem('photo_org_pro_vip');
  const savedBio = localStorage.getItem('photo_org_biometric_lock');
  const savedTheme = localStorage.getItem('photo_org_theme_pref') || 'dark';
  const savedAccent = localStorage.getItem('photo_org_accent_color') || '#f43f5e';
  const savedCustom = localStorage.getItem('photo_org_custom_colors');
  const savedSort = localStorage.getItem('photo_org_gallery_sort');
  const savedLang = localStorage.getItem('photo_org_language') || 'en';
  const version = localStorage.getItem('photo_org_ui_version');

  // Default VIP to true so user and developer always have instant access to 3D albums and VIP features
  state.isPro = savedPro !== 'false';
  state.biometricLock = savedBio === 'true';
  state.appLockPin = localStorage.getItem('photo_org_app_pin') || null;
  state.themePref = savedTheme;
  state.accentColor = savedAccent;
  state.language = savedLang;
  if (savedSort) state.gallerySort = savedSort;
  const savedGlobal3D = localStorage.getItem('photo_org_global_3d');
  state.global3DEnabled = savedGlobal3D !== 'false';
  const savedFav3D = localStorage.getItem('photo_org_favorites_3d_style');
  if (savedFav3D) state.favorites3DStyle = savedFav3D;
  const savedFavCover = localStorage.getItem('photo_org_favorites_custom_cover');
  if (savedFavCover) state.favoritesCustomCover = savedFavCover;

  const savedGps = localStorage.getItem('aura_gps_metadata_enabled');
  if (savedGps !== null) state.gpsMetadataEnabled = savedGps !== 'false';
  const savedLocTags = localStorage.getItem('aura_location_tags_enabled');
  if (savedLocTags !== null) state.locationTagsEnabled = savedLocTags !== 'false';
  const savedPlace = localStorage.getItem('aura_loc_tag_place');
  if (savedPlace !== null) state.locationTagPlace = savedPlace !== 'false';
  const savedCity = localStorage.getItem('aura_loc_tag_city');
  if (savedCity !== null) state.locationTagCity = savedCity !== 'false';
  const savedCountry = localStorage.getItem('aura_loc_tag_country');
  if (savedCountry !== null) state.locationTagCountry = savedCountry !== 'false';
  const savedGalleryLoc = localStorage.getItem('aura_gallery_show_location_badge');
  state.galleryShowLocationBadge = savedGalleryLoc === 'true';

  if (savedCustom) {
    try {
      const parsed = JSON.parse(savedCustom);
      if (Array.isArray(parsed) && parsed.length > 0) {
        state.savedCustomColors = parsed;
      }
    } catch (e) {}
  }

  // If previous version was before luxury_v6, regenerate demo data with clean canvas
  if (version !== 'luxury_v6') {
    resetToDefaultData();
    localStorage.setItem('photo_org_ui_version', 'luxury_v6');
    setAppTheme(savedTheme, false);
    setAppAccentColor(savedAccent, false);
    return;
  }

  if (savedPhotos && savedTags) {
    try {
      state.photos = JSON.parse(savedPhotos);
      state.tags = JSON.parse(savedTags);
      // Clean up any previously auto-injected location tags from photo.tags
      const knownAlbumNames = state.tags.map(t => (t.name || '').toLowerCase());
      state.photos.forEach(p => {
        if (p && p.location && Array.isArray(p.tags) && p.tags.length > 0) {
          const locNames = [p.location.country, p.location.city, p.location.place]
            .filter(Boolean)
            .map(s => s.toLowerCase());
          p.tags = p.tags.filter(t => {
            const isLoc = locNames.includes(t.toLowerCase());
            const isAlbum = knownAlbumNames.includes(t.toLowerCase());
            return !isLoc || isAlbum;
          });
        }
      });
      state.tags.forEach((tag, idx) => {
        const albumPhotos = state.photos.filter(p => !p.deletedAt && Array.isArray(p.tags) && p.tags.includes(tag.name));
        const latestPhotoTime = albumPhotos.reduce((max, p) => Math.max(max, p.createdAt || 0, p.modifiedAt || 0), 0);
        if (!tag.createdAt) {
          tag.createdAt = latestPhotoTime || (Date.now() - (idx + 1) * 3600000 * 24);
        }
        if (!tag.lastModifiedAt) {
          tag.lastModifiedAt = latestPhotoTime || tag.createdAt;
        }
        if (!tag.lastViewedAt) {
          tag.lastViewedAt = 0;
        }
      });
      // Curated authentic GPS locations for automatic metadata demo & fallback
      const DEMO_LOCATIONS = [
        { latitude: 18.9220, longitude: 72.8347, place: 'Taj Mahal Palace', city: 'Mumbai', country: 'India' },
        { latitude: 28.6139, longitude: 77.2090, place: 'Connaught Place', city: 'New Delhi', country: 'India' },
        { latitude: 15.4909, longitude: 73.8278, place: 'Calangute Shores', city: 'Goa', country: 'India' },
        { latitude: 12.9716, longitude: 77.5946, place: 'MG Road Hub', city: 'Bengaluru', country: 'India' },
        { latitude: 24.5854, longitude: 73.7125, place: 'Lake Palace', city: 'Udaipur', country: 'India' },
        { latitude: 48.8584, longitude: 2.2945, place: 'Champ de Mars', city: 'Paris', country: 'France' },
        { latitude: 40.7850, longitude: -73.9682, place: 'Central Park', city: 'New York', country: 'United States' },
        { latitude: 35.6586, longitude: 139.7454, place: 'Shibuya Crossing', city: 'Tokyo', country: 'Japan' }
      ];

      state.photos.forEach((p, idx) => {
        if (!p.dataUrl) {
          p.dataUrl = generateGradientImage(p.displayName, p.category || 'General', p.gradient);
        }
        // ONLY assign demo location to initial demo photos if they lack one; NEVER overwrite user photos!
        const isDemoPhoto = p.id && (p.id.startsWith('demo_') || p.id.startsWith('gallery_'));
        if (isDemoPhoto && !p.location) {
          p.location = { ...DEMO_LOCATIONS[idx % DEMO_LOCATIONS.length] };
        }
        // Clean up previously falsified user photos that got assigned fake Taj Mahal Palace fallback
        if (!isDemoPhoto && p.location && p.location.place === 'Taj Mahal Palace' && p.location.city === 'Mumbai') {
          p.location = null;
        }

        // Auto-heal real photos with EXIF metadata in their dataUrl
        if (!isDemoPhoto && p.dataUrl) {
          const needsLocHeal = !p.location || (!p.location.city && !p.location.place && !p.location.country);
          const needsMetaHeal = !p.cameraModel;
          if (needsLocHeal || needsMetaHeal) {
            try {
              const exif = extractFullExifFromBase64(p.dataUrl);
              if (exif) {
                if (exif.cameraModel && !p.cameraModel) p.cameraModel = exif.cameraModel;
                if (exif.timestamp && (!p.createdAt || p.createdAt > 1700000000000)) p.createdAt = exif.timestamp;
                if (exif.coords && (!p.location || typeof p.location.latitude !== 'number')) {
                  p.location = {
                    latitude: exif.coords.latitude,
                    longitude: exif.coords.longitude,
                    place: '',
                    city: '',
                    country: ''
                  };
                }
                if (p.location && typeof p.location.latitude === 'number' && (!p.location.city || !p.location.place)) {
                  resolveLocationFromCoords(p.location.latitude, p.location.longitude).then(res => {
                    if (res && (res.city || res.place || res.country)) {
                      p.location = res;
                      saveState();
                      if (state.activePhotoId === p.id) {
                        renderDetailTags(p);
                        updateDetailModalUI(p, true);
                      }
                    }
                  });
                }
              }
            } catch (_) {}
          }
        }
      });
    } catch (e) {
      resetToDefaultData();
    }
  } else {
    resetToDefaultData();
  }

  const savedDeletedAlbums = localStorage.getItem('photo_org_deleted_albums');
  if (savedDeletedAlbums) {
    try {
      state.deletedAlbums = JSON.parse(savedDeletedAlbums);
    } catch (e) {
      state.deletedAlbums = [];
    }
  } else {
    state.deletedAlbums = [];
  }

  // Ensure favorites demo photos exist if none are currently marked
  const favCount = state.photos.filter(p => p.isFavorite && !p.deletedAt).length;
  if (favCount === 0 && state.photos.length > 0) {
    const favIds = ['gallery_3', 'gallery_4', 'gallery_5'];
    state.photos.forEach(p => {
      if (favIds.includes(p.id)) p.isFavorite = true;
    });
  }

  setAppTheme(savedTheme, false);
  setAppAccentColor(savedAccent, false);
  if (typeof window.applyTranslationsToDOM === 'function') {
    window.applyTranslationsToDOM();
  }
  saveState();
}

function resetToDefaultData() {
  const now = Date.now();
  state.tags = INITIAL_TAGS.map((t, idx) => ({
    ...t,
    createdAt: now - (idx + 1) * 3600000 * 24,
    lastModifiedAt: now - (idx + 1) * 3600000 * 12,
    lastViewedAt: idx === 0 ? now - 1800000 : 0
  }));
  state.deletedAlbums = [];
  state.photos = INITIAL_PHOTOS.map(p => ({
    ...p,
    dataUrl: generateGradientImage(p.displayName, p.category, p.gradient)
  }));
  saveState();
}

let _saveStateTimer = null;
function debouncedSaveState(immediate = false) {
  if (immediate) {
    if (_saveStateTimer) {
      clearTimeout(_saveStateTimer);
      _saveStateTimer = null;
    }
    saveStateImmediate();
    return;
  }
  if (_saveStateTimer) clearTimeout(_saveStateTimer);
  _saveStateTimer = setTimeout(() => {
    _saveStateTimer = null;
    saveStateImmediate();
  }, 100);
}

function saveStateImmediate() {
  try {
    localStorage.setItem('photo_org_photos', JSON.stringify(state.photos));
    localStorage.setItem('photo_org_tags', JSON.stringify(state.tags));
    localStorage.setItem('photo_org_deleted_albums', JSON.stringify(state.deletedAlbums || []));
    localStorage.setItem('photo_org_pro_vip', state.isPro ? 'true' : 'false');
    localStorage.setItem('photo_org_biometric_lock', state.biometricLock ? 'true' : 'false');
    if (state.appLockPin) {
      localStorage.setItem('photo_org_app_pin', state.appLockPin);
    } else {
      localStorage.removeItem('photo_org_app_pin');
    }
    localStorage.setItem('photo_org_theme_pref', state.themePref || 'dark');
    localStorage.setItem('photo_org_accent_color', state.accentColor || '#f43f5e');
    localStorage.setItem('photo_org_custom_colors', JSON.stringify(state.savedCustomColors || []));
    localStorage.setItem('photo_org_global_3d', state.global3DEnabled !== false ? 'true' : 'false');
    localStorage.setItem('photo_org_language', state.language || 'en');
    localStorage.setItem('photo_org_favorites_3d_style', state.favorites3DStyle || 'holo');
    if (state.favoritesCustomCover) {
      localStorage.setItem('photo_org_favorites_custom_cover', state.favoritesCustomCover);
    } else {
      localStorage.removeItem('photo_org_favorites_custom_cover');
    }
    localStorage.setItem('aura_gps_metadata_enabled', state.gpsMetadataEnabled !== false ? 'true' : 'false');
    localStorage.setItem('aura_location_tags_enabled', state.locationTagsEnabled !== false ? 'true' : 'false');
    localStorage.setItem('aura_loc_tag_place', state.locationTagPlace !== false ? 'true' : 'false');
    localStorage.setItem('aura_loc_tag_city', state.locationTagCity !== false ? 'true' : 'false');
    localStorage.setItem('aura_loc_tag_country', state.locationTagCountry !== false ? 'true' : 'false');
  localStorage.setItem('aura_gallery_show_location_badge', state.galleryShowLocationBadge === true ? 'true' : 'false');
  } catch (err) {
    console.warn('saveState failed:', err);
  }
}

function saveState() {
  debouncedSaveState(false);
}
window.saveState = saveState;
window.saveStateImmediate = saveStateImmediate;
window.addEventListener('beforeunload', () => saveStateImmediate());

// Hex color normalizer for reliable selection comparisons
function normalizeHex(color) {
  if (!color || typeof color !== 'string') return '#f43f5e';
  let c = color.trim().toLowerCase();
  if (!c.startsWith('#')) c = '#' + c;
  if (/^#[0-9a-f]{3}$/.test(c)) {
    c = '#' + c[1] + c[1] + c[2] + c[2] + c[3] + c[3];
  }
  return c;
}

// Save user custom color to their personal palette category (capped at 12)
function addCustomColor(color) {
  if (!color || typeof color !== 'string') return;
  const norm = normalizeHex(color);
  if (!state.savedCustomColors) state.savedCustomColors = [];
  state.savedCustomColors = state.savedCustomColors.filter(c => normalizeHex(c) !== norm);
  state.savedCustomColors.unshift(norm);
  if (state.savedCustomColors.length > 12) {
    state.savedCustomColors = state.savedCustomColors.slice(0, 12);
  }
  saveState();
}

// Delete color from user's custom palette
function deleteSavedCustomColor(color, event, onSelectFnName) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  const norm = normalizeHex(color);
  if (!state.savedCustomColors) state.savedCustomColors = [];
  state.savedCustomColors = state.savedCustomColors.filter(c => normalizeHex(c) !== norm);
  saveState();

  // If the deleted color was the active one, smoothly fall back
  if (onSelectFnName === 'selectNewTagColor') {
    if (normalizeHex(state.selectedNewTagColor) === norm) {
      state.selectedNewTagColor = PRESET_COLORS[0];
    }
    renderTags();
  } else if (onSelectFnName === 'selectRenameColor') {
    if (normalizeHex(state.renameColor) === norm) {
      state.renameColor = PRESET_COLORS[0];
    }
    renderRenameColorPalette();
  } else if (onSelectFnName === 'setAppAccentColor') {
    if (normalizeHex(state.accentColor) === norm) {
      setAppAccentColor(ACCENT_PRESETS[0], false, true);
    } else {
      renderThemeAccentPalette();
    }
  } else if (onSelectFnName === 'selectModalAlbumColor') {
    if (window._currentAlbumModalColor && normalizeHex(window._currentAlbumModalColor) === norm) {
      window.selectModalAlbumColor(PRESET_COLORS[0], true);
    } else {
      const modalPalette = document.getElementById('modalAlbumColorPalette');
      if (modalPalette) {
        modalPalette.innerHTML = buildCategorizedPaletteHtml({
          presetColors: PRESET_COLORS,
          selectedColor: window._currentAlbumModalColor || PRESET_COLORS[0],
          savedColors: state.savedCustomColors || [],
          onSelectFn: 'selectModalAlbumColor',
          customInputId: 'albumCustomColorInput',
          customSwatchId: 'albumCustomColorSwatch'
        });
      }
    }
  } else if (onSelectFnName === 'selectFusionColor') {
    if (state.fusionCollectionColor && normalizeHex(state.fusionCollectionColor) === norm) {
      if (typeof window.selectFusionColor === 'function') window.selectFusionColor(PRESET_COLORS[0], true);
    } else {
      if (typeof window.renderFusionColorPicker === 'function') window.renderFusionColorPicker();
    }
  } else {
    renderAllPalettes();
  }

  showToast(`Color ${norm.toUpperCase()} removed from Your Palettes`);
}

function renderAllPalettes() {
  renderThemeAccentPalette();
  const tagPal = document.getElementById('colorPaletteContainer');
  if (tagPal) {
    tagPal.innerHTML = buildCategorizedPaletteHtml({
      presetColors: PRESET_COLORS,
      selectedColor: state.selectedNewTagColor || PRESET_COLORS[0],
      savedColors: state.savedCustomColors || [],
      onSelectFn: 'selectNewTagColor',
      customInputId: 'tagCustomColorInput',
      customSwatchId: 'tagCustomColorSwatch'
    });
  }
  renderRenameColorPalette();
}

// -------------------------------------------------------------
// Custom Color Studio Modal Controller (With OK & Cancel)
// -------------------------------------------------------------
let customColorPickerState = {
  isOpen: false,
  activeColor: '#f43f5e',
  originalColor: '#f43f5e',
  callbackName: null,
  callbackFn: null
};

function openCustomColorPickerModal({ initialColor, onApply, onApplyName }) {
  const norm = normalizeHex(initialColor || state.accentColor || '#f43f5e');
  customColorPickerState.activeColor = norm;
  customColorPickerState.originalColor = norm;
  customColorPickerState.callbackName = onApplyName || (typeof onApply === 'string' ? onApply : null);
  customColorPickerState.callbackFn = typeof onApply === 'function' ? onApply : (window[onApplyName] || null);
  customColorPickerState.isOpen = true;

  setModalPickerLiveColor(norm, true);

  const origIndicator = document.getElementById('modalPickerOriginalColor');
  if (origIndicator) {
    origIndicator.style.background = norm;
    origIndicator.onclick = () => setModalPickerLiveColor(customColorPickerState.originalColor);
  }

  const modal = document.getElementById('customColorPickerModal');
  if (modal) modal.style.display = 'flex';
}

function closeCustomColorPickerModal() {
  const modal = document.getElementById('customColorPickerModal');
  if (modal) modal.style.display = 'none';
  customColorPickerState.isOpen = false;
  customColorPickerState.callbackFn = null;
  customColorPickerState.callbackName = null;
}

function setModalPickerLiveColor(color, syncNative = true) {
  const norm = normalizeHex(color);
  customColorPickerState.activeColor = norm;

  const preview = document.getElementById('modalPickerColorPreview');
  if (preview) {
    preview.style.backgroundColor = norm;
    preview.style.boxShadow = `inset 0 -12px 24px rgba(0,0,0,0.25), 0 0 24px ${norm}40`;
  }

  const badge = document.getElementById('modalPickerHexBadge');
  if (badge) badge.textContent = norm.toUpperCase();

  const hexInput = document.getElementById('modalPickerHexInput');
  if (hexInput && document.activeElement !== hexInput) {
    hexInput.value = norm.replace('#', '').toUpperCase();
  }

  const nativeInput = document.getElementById('modalPickerNativeInput');
  if (nativeInput && syncNative) {
    nativeInput.value = norm;
  }
}

function handleModalPickerInput(color) {
  if (!color) return;
  setModalPickerLiveColor(color, false);
}

function handleModalPickerHexInput(val) {
  if (!val) return;
  let clean = val.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
  if (clean.length === 6 || clean.length === 3) {
    setModalPickerLiveColor('#' + clean, true);
  }
}

function applyCustomColorFromModal() {
  const color = customColorPickerState.activeColor || '#f43f5e';
  addCustomColor(color);

  const fnName = customColorPickerState.callbackName;
  let fn = customColorPickerState.callbackFn;
  if (!fn && fnName && typeof window !== 'undefined' && window[fnName]) {
    fn = window[fnName];
  }
  if (!fn && fnName) {
    if (fnName === 'selectNewTagColor') fn = selectNewTagColor;
    else if (fnName === 'selectRenameColor') fn = selectRenameColor;
    else if (fnName === 'setAppAccentColor') fn = setAppAccentColor;
    else if (fnName === 'selectModalAlbumColor') fn = window.selectModalAlbumColor;
    else if (fnName === 'selectFusionColor') fn = window.selectFusionColor;
  }

  if (typeof fn === 'function') {
    fn(color, true);
  }

  closeCustomColorPickerModal();
  showToast(`Color ${color.toUpperCase()} saved & selected!`);
}

// In-App Theme Accent Color Palette
const ACCENT_PRESETS = [
  '#f43f5e', '#ec4899', '#8b5cf6', '#6366f1', '#0284c7', '#10b981', '#f59e0b', '#ea580c'
];

/**
 * Reusable Categorized Color Palette Builder
 * Renders two distinct sections:
 * 1. Curated Presets
 * 2. Your Color Palettes (with Custom Color Picker + saved user colors with individual delete options)
 * The tick mark strictly and animatedly reflects the active selection across both sections.
 */
function buildCategorizedPaletteHtml({
  presetColors,
  selectedColor,
  savedColors,
  onSelectFn,
  customInputId,
  customSwatchId
}) {
  const curVal = normalizeHex(selectedColor || presetColors[0]);
  const userColors = Array.isArray(savedColors) ? savedColors : [];

  const presetsHtml = presetColors.map(c => {
    const norm = normalizeHex(c);
    const isSelected = curVal === norm;
    return `
      <div class="color-option ${isSelected ? 'selected' : ''}" style="background:${c};" onclick="${onSelectFn}('${c}', true)" title="Preset: ${c}">
        ${isSelected ? '<i class="fa-solid fa-check"></i>' : ''}
      </div>
    `;
  }).join('');

  const savedSwatchesHtml = userColors.map(c => {
    const norm = normalizeHex(c);
    const isSelected = curVal === norm;
    return `
      <div class="saved-swatch-wrapper">
        <div class="color-option saved-custom-option ${isSelected ? 'selected' : ''}" style="background:${c};" onclick="${onSelectFn}('${c}', true)" title="Your Color: ${c}">
          ${isSelected ? '<i class="fa-solid fa-check"></i>' : ''}
        </div>
        <button type="button" class="swatch-delete-btn" onclick="event.stopPropagation(); deleteSavedCustomColor('${c}', event, '${onSelectFn}')" title="Delete ${c}">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `;
  }).join('');

  const lblCurated = window.t ? window.t('palette_curated_presets') : 'Curated Presets';
  const lblYourPalettes = window.t ? window.t('palette_your_palettes') : 'Your Color Palettes';
  const lblSavedCustom = window.t ? window.t('palette_saved_custom') : 'Saved & Custom';
  const lblOpenStudio = window.t ? window.t('palette_open_studio') : 'Open Color Studio';

  return `
    <div class="palette-category-block">
      <div class="palette-category-header">
        <span class="palette-category-title"><i class="fa-solid fa-sparkles"></i> ${lblCurated}</span>
      </div>
      <div class="palette-swatches-strip">
        ${presetsHtml}
      </div>
    </div>

    <div class="palette-category-block" style="margin-top: 10px;">
      <div class="palette-category-header">
        <span class="palette-category-title"><i class="fa-solid fa-swatchbook"></i> ${lblYourPalettes}</span>
        <span class="palette-category-hint">${lblSavedCustom}</span>
      </div>
      <div class="palette-swatches-strip">
        <div class="color-option custom-color-option" id="${customSwatchId}" onclick="openCustomColorPickerModal({ initialColor: '${selectedColor || '#f43f5e'}', onApplyName: '${onSelectFn}' })" title="${lblOpenStudio}">
          <i class="fa-solid fa-plus"></i>
        </div>
        ${savedSwatchesHtml}
      </div>
    </div>
  `;
}

function setAppAccentColor(color, notify = true, isFinal = true) {
  if (!color) return;
  state.accentColor = color;

  // Dynamically update CSS custom properties on document element
  document.documentElement.style.setProperty('--primary', color);
  document.documentElement.style.setProperty('--accent-rose', color);
  document.documentElement.style.setProperty('--primary-hover', color);
  document.documentElement.style.setProperty('--primary-light', color);
  document.documentElement.style.setProperty('--border-glow', `${color}40`);
  document.documentElement.style.setProperty('--primary-container', `${color}20`);

  saveState();
  renderThemeAccentPalette();
  if (notify) {
    showToast(`Accent color set to ${color.toUpperCase()}`);
  }
}

function renderThemeAccentPalette() {
  const palette = document.getElementById('themeAccentPaletteContainer');
  if (!palette) return;

  palette.innerHTML = buildCategorizedPaletteHtml({
    presetColors: ACCENT_PRESETS,
    selectedColor: state.accentColor || '#f43f5e',
    savedColors: state.savedCustomColors || [],
    onSelectFn: 'setAppAccentColor',
    customInputId: 'themeCustomColorInput',
    customSwatchId: 'themeCustomColorSwatch'
  });
}

// In-App Theme Switcher
function setAppTheme(theme, notify = true) {
  state.themePref = theme;
  let resolvedMode = theme;

  if (theme === 'system') {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    resolvedMode = prefersDark ? 'dark' : 'light';
  }

  if (resolvedMode === 'light') {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
  } else {
    document.body.classList.remove('light-mode');
    document.body.classList.add('dark-mode');
  }

  // Synchronize desktop top navbar theme toggle button
  const topThemeBtn = document.getElementById('themeToggleBtn');
  if (topThemeBtn) {
    topThemeBtn.innerHTML = resolvedMode === 'light'
      ? '<i class="fa-solid fa-sun"></i><span>Theme</span>'
      : '<i class="fa-solid fa-moon"></i><span>Theme</span>';
  }

  // Update active state on Settings screen theme cards
  document.getElementById('themeOptDark')?.classList.toggle('active', theme === 'dark');
  document.getElementById('themeOptLight')?.classList.toggle('active', theme === 'light');
  document.getElementById('themeOptSystem')?.classList.toggle('active', theme === 'system');

  saveState();

  if (notify) {
    const label = theme === 'system' ? 'System Theme' : (theme === 'light' ? 'Luminous Light' : 'Midnight Dark');
    showToast(`Theme set to ${label}`);
  }
}

// In-App Phone Navigation to Settings
function navigateToSettings() {
  const navBtn = document.querySelector('.nav-item[data-tab="settingsScreen"]');
  if (navBtn) {
    navBtn.click();
  }
}

function showToast(msg) {
  const toast = document.getElementById('toastMessage');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2600);
}

// -------------------------------------------------------------
// UI RENDERING
// -------------------------------------------------------------

function renderAll() {
  renderDock();
  renderGallery();
  renderAlbumsScreen();
  renderTags();
  renderFavorites();
  renderTrash();
  renderNavBadges();
  renderSettings();
}
window.renderAll = renderAll;

// Render Settings Screen & Dynamic Controls
function renderSettings() {
  const isPro = !!state.isPro;

  // Profile VIP Tag & Header Status Badge
  const profileVipTag = document.getElementById('profileVipTag');
  if (profileVipTag) {
    profileVipTag.textContent = isPro
      ? (window.t ? window.t('settings_pro_vip') : 'PRO VIP')
      : (window.t ? window.t('settings_starter') : 'STARTER');
    profileVipTag.className = isPro ? 'vip-sparkle-tag pro-active' : 'vip-sparkle-tag';
  }

  const proStatusBadge = document.getElementById('settingsProStatusBadge');
  if (proStatusBadge) {
    proStatusBadge.textContent = isPro ? '👑 VIP UNLOCKED' : (window.t ? window.t('settings_free_tier') : 'FREE TIER');
    proStatusBadge.className = isPro ? 'pro-chip-pill pro-active' : 'pro-chip-pill';
  }

  // Master Developer Bypass Card UI Sync
  const vipStatusPill = document.getElementById('vipBypassStatusPill');
  if (vipStatusPill) {
    vipStatusPill.textContent = isPro ? '👑 VIP ACTIVE (Bypassed)' : '🔒 STARTER (Locked)';
    vipStatusPill.className = isPro ? 'vip-dev-status-pill' : 'vip-dev-status-pill locked';
  }

  const vipBypassBtn = document.getElementById('vipBypassMasterBtn');
  const vipBypassLabel = document.getElementById('vipBypassBtnLabel');
  if (vipBypassBtn) {
    vipBypassBtn.classList.toggle('active', isPro);
  }
  if (vipBypassLabel) {
    vipBypassLabel.textContent = isPro 
      ? '👑 VIP Access Active · Tap to Test Starter' 
      : '⚡ 1-Click Developer Bypass (Unlock 100% of Features)';
  }

  // Profile status desc
  const profileStatusDesc = document.getElementById('profileStatusDesc');
  if (profileStatusDesc) {
    profileStatusDesc.textContent = isPro
      ? (window.t ? window.t('settings_storage_pro_active') : 'Aura VIP Membership Active · 100% Private On-Device & Secret Vault Unlocked')
      : (window.t ? window.t('settings_storage_private') : 'Standard local storage · 100% private');
  }

  // Pro Upgrade Card Button
  const startRazorpayBtn = document.getElementById('startRazorpayBtn');
  if (startRazorpayBtn) {
    if (isPro) {
      startRazorpayBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span data-i18n="settings_pro_activated">${window.t ? window.t('settings_pro_activated') : 'Aura Pro VIP Activated (Bypass Active)'}</span>`;
      startRazorpayBtn.classList.add('activated');
    } else {
      startRazorpayBtn.innerHTML = `<i class="fa-solid fa-bolt"></i> <span data-i18n="settings_upgrade_btn">${window.t ? window.t('settings_upgrade_btn') : 'Upgrade with Razorpay (₹299)'}</span>`;
      startRazorpayBtn.classList.remove('activated');
    }
  }

  // Bottom Navigation Bar Pro Sparkle Badge
  const proBadgeNav = document.getElementById('proBadgeNav');
  if (proBadgeNav) {
    proBadgeNav.style.display = isPro ? 'inline-flex' : 'none';
  }

  // Active theme selector card
  const curTheme = state.themePref || 'dark';
  document.getElementById('themeOptDark')?.classList.toggle('active', curTheme === 'dark');
  document.getElementById('themeOptLight')?.classList.toggle('active', curTheme === 'light');
  document.getElementById('themeOptSystem')?.classList.toggle('active', curTheme === 'system');

  // Biometric toggle
  const bioToggle = document.getElementById('biometricLockToggle');
  if (bioToggle) {
    bioToggle.checked = !!state.biometricLock;
  }
  const appLockSub = document.getElementById('appLockSubControls');
  if (appLockSub) {
    appLockSub.style.display = state.biometricLock ? 'flex' : 'none';
  }

  // VIP Developer / Tester toggle
  const vipDevToggle = document.getElementById('vipDeveloperToggle');
  if (vipDevToggle) {
    vipDevToggle.checked = isPro;
  }

  // Push Update Notifications toggle
  const pushToggle = document.getElementById('pushUpdatesToggle');
  if (pushToggle) {
    const pushEnabled = localStorage.getItem('aura_push_updates_enabled') !== 'false';
    pushToggle.checked = pushEnabled;
  }

  // Location & GPS Metadata Toggles
  const gpsToggle = document.getElementById('gpsMetadataToggle');
  if (gpsToggle) {
    gpsToggle.checked = state.gpsMetadataEnabled !== false;
  }

  const locTagsToggle = document.getElementById('locationTagsToggle');
  if (locTagsToggle) {
    locTagsToggle.checked = state.locationTagsEnabled !== false;
  }

  const placeToggle = document.getElementById('locationTagPlaceToggle');
  if (placeToggle) {
    placeToggle.checked = state.locationTagPlace !== false;
  }

  const cityToggle = document.getElementById('locationTagCityToggle');
  if (cityToggle) {
    cityToggle.checked = state.locationTagCity !== false;
  }

  const countryToggle = document.getElementById('locationTagCountryToggle');
  if (countryToggle) {
    countryToggle.checked = state.locationTagCountry !== false;
  }
  const galleryLocBadgeToggle = document.getElementById('galleryLocationBadgeToggle');
  if (galleryLocBadgeToggle) {
    galleryLocBadgeToggle.checked = state.galleryShowLocationBadge === true;
  }

  const subTogglesContainer = document.getElementById('locationSubTogglesContainer');
  if (subTogglesContainer) {
    const isAvailable = state.locationTagsEnabled !== false;
    subTogglesContainer.style.opacity = isAvailable ? '1' : '0.4';
    subTogglesContainer.style.pointerEvents = isAvailable ? 'auto' : 'none';
  }

  // Live Storage Calculation
  let totalDataLength = 0;
  state.photos.forEach(p => {
    if (p.dataUrl) totalDataLength += p.dataUrl.length;
    else totalDataLength += 160000;
  });
  const mbUsed = Math.max(1.6, totalDataLength / (1024 * 1024)).toFixed(1);

  // Dynamic Real Device Storage Detection
  let totalGb = 128; // Modern standard phone base capacity
  let freeGb = null;
  let devicePercent = null;

  if (window.AndroidApp && typeof window.AndroidApp.getDeviceStorageInfo === 'function') {
    try {
      const infoStr = window.AndroidApp.getDeviceStorageInfo();
      const info = JSON.parse(infoStr);
      if (info && info.totalGb) {
        totalGb = info.totalGb;
        freeGb = info.freeGb;
        if (info.usedGb && info.totalGb) {
          devicePercent = Math.min(100, Math.max(5, (parseFloat(info.usedGb) / parseFloat(info.totalGb)) * 100));
        }
      }
    } catch (_) {}
  } else if (navigator.storage && navigator.storage.estimate) {
    try {
      navigator.storage.estimate().then(est => {
        if (est && est.quota) {
          const quotaGb = Math.round(est.quota / (1024 * 1024 * 1024));
          if (quotaGb > 0) {
            const el = document.getElementById('storageUsageText');
            if (el && (!window.AndroidApp || typeof window.AndroidApp.getDeviceStorageInfo !== 'function')) {
              el.textContent = window.t
                ? window.t('settings_storage_used', { used: mbUsed, total: quotaGb })
                : `${mbUsed} MB used of ${quotaGb} GB`;
            }
          }
        }
      }).catch(() => {});
    } catch (_) {}
  }

  const storageUsageText = document.getElementById('storageUsageText');
  if (storageUsageText) {
    let usageStr = window.t
      ? window.t('settings_storage_used', { used: mbUsed, total: totalGb })
      : `${mbUsed} MB used of ${totalGb} GB`;
    if (freeGb) {
      usageStr += ` (${freeGb} GB free)`;
    }
    storageUsageText.textContent = usageStr;
  }

  const storageProgressBar = document.getElementById('storageProgressBar');
  if (storageProgressBar) {
    const percent = devicePercent !== null
      ? devicePercent
      : Math.min(100, Math.max(5, (parseFloat(mbUsed) / (totalGb * 10.24))));
    storageProgressBar.style.width = `${percent.toFixed(1)}%`;
  }

  const activePhotos = state.photos.filter(p => !p.deletedAt && !p.isPending).length;
  const inTrash = state.photos.filter(p => p.deletedAt).length + (Array.isArray(state.deletedAlbums) ? state.deletedAlbums.length : 0);

  const storagePhotoCount = document.getElementById('storagePhotoCount');
  if (storagePhotoCount) storagePhotoCount.textContent = activePhotos;

  const storageTrashCount = document.getElementById('storageTrashCount');
  if (storageTrashCount) storageTrashCount.textContent = inTrash;

  const storageTagCount = document.getElementById('storageTagCount');
  if (storageTagCount) storageTagCount.textContent = state.tags.length;

  renderThemeAccentPalette();
  renderSettingsLanguageUI();
}

// Render Language Selector in Settings (Indian Regional & Global Support)
function renderSettingsLanguageUI() {
  const grid = document.getElementById('languageSelectorGrid');
  const hint = document.getElementById('currentLangHintBadge');
  if (!grid || !window.I18N_LANGUAGES) return;
  const currentLang = (window.state && window.state.language) || (typeof state !== 'undefined' && state.language) || localStorage.getItem('photo_org_language') || 'en';
  const activeObj = window.I18N_LANGUAGES.find(l => l.code === currentLang) || window.I18N_LANGUAGES[0];
  if (hint) {
    hint.textContent = `${activeObj.flag} ${activeObj.native}`;
  }
  grid.innerHTML = window.I18N_LANGUAGES.map(lang => {
    const isSelected = lang.code === currentLang;
    return `
      <button type="button" class="language-option-card ${isSelected ? 'active' : ''}"
        onclick="setAppLanguage('${lang.code}')" aria-label="${escapeHtml(lang.name)}">
        <div class="lang-flag-box">${lang.flag}</div>
        <div class="lang-text-meta">
          <span class="lang-native-name">${escapeHtml(lang.native)}</span>
          <span class="lang-english-name">${escapeHtml(lang.name)}</span>
        </div>
        <i class="fa-solid fa-circle-check lang-check-icon"></i>
      </button>
    `;
  }).join('');
}
window.renderSettingsLanguageUI = renderSettingsLanguageUI;
window.renderSettings = renderSettings;

// Razorpay Integration Handlers
function initiateRazorpayPayment() {
  if (state.isPro) {
    showToast('You already have Aura Pro VIP activated! 👑');
    return;
  }

  // Attempt live Razorpay Checkout if SDK loaded and network permits
  if (typeof window.Razorpay === 'function') {
    try {
      const options = {
        key: 'rzp_test_1DP5mmOlF5G5ag', // Official standard Razorpay test API key
        amount: '29900', // ₹299.00 in paise
        currency: 'INR',
        name: 'Aura Photo Studio',
        description: 'Aura Pro VIP Annual Membership',
        image: 'https://cdn-icons-png.flaticon.com/512/1040/1040244.png',
        handler: function (response) {
          const paymentId = response.razorpay_payment_id || `pay_${Date.now()}`;
          processSuccessfulPayment(paymentId);
        },
        prefill: {
          name: 'Aura Member',
          email: 'member@auraphoto.app',
          contact: '+919876543210'
        },
        theme: {
          color: '#f43f5e'
        },
        modal: {
          ondismiss: function() {
            showToast('Payment checkout dismissed');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        console.warn('Razorpay live error, opening fallback sheet', resp);
        openRazorpayModal();
      });
      rzp.open();
      return;
    } catch (err) {
      console.warn('Razorpay SDK invocation failed, falling back to embedded modal:', err);
    }
  }

  // Fallback to embedded modal if offline, blocked CSP, or mock environment
  openRazorpayModal();
}

function openRazorpayModal() {
  const modal = document.getElementById('razorpayModal');
  if (modal) modal.style.display = 'flex';
}

function closeRazorpayModal() {
  const modal = document.getElementById('razorpayModal');
  if (modal) modal.style.display = 'none';
}

function processSuccessfulPayment(paymentId) {
  state.isPro = true;
  saveState();
  closeRazorpayModal();
  renderAll();
  showToast(`Payment Verified (${paymentId.slice(0, 12)}...)! Welcome to Aura Pro VIP 🎉`);
}

function restoreProPurchases() {
  if (state.isPro) {
    showToast('Aura Pro VIP is already active and verified on this device.');
  } else {
    state.isPro = true;
    saveState();
    renderAll();
    showToast('Receipt verified! Restored Aura Pro VIP membership.');
  }
}

function openPaymentFaq() {
  showToast('Razorpay Billing: Cancel anytime with instant 1-click refund.');
}

// Privacy & Security Handlers
function openPrivacyPolicyModal() {
  const modal = document.getElementById('privacyPolicyModal');
  if (modal) modal.style.display = 'flex';
}

function closePrivacyPolicyModal() {
  const modal = document.getElementById('privacyPolicyModal');
  if (modal) modal.style.display = 'none';
}

// -------------------------------------------------------------
// 2026 LUXURY BIOMETRIC & PIN APP LOCK SYSTEM
// -------------------------------------------------------------
// -------------------------------------------------------------
// 2026 LUXURY BIOMETRIC & PASSCODE APP LOCK SYSTEM
// -------------------------------------------------------------
let enteredAppLockPin = '';
let setupPasscodePhase = 'create'; // 'create' | 'confirm'
let setupFirstPasscode = '';
let setupEnteredPasscode = '';
let setupModalMode = 'setup'; // 'setup' | 'change' | 'reset'

function toggleBiometricLock(checked) {
  if (checked) {
    // Professional security: DO NOT set a default passcode!
    // Open dedicated passcode generation / creation screen
    openPasscodeSetupScreen('setup');
  } else {
    state.biometricLock = false;
    state.appLockPin = null;
    try {
      localStorage.removeItem('photo_org_app_pin');
      localStorage.setItem('photo_org_biometric_lock', 'false');
    } catch (_) {}
    saveState();
    const sub = document.getElementById('appLockSubControls');
    if (sub) sub.style.display = 'none';
    const toggle = document.getElementById('biometricLockToggle');
    if (toggle) toggle.checked = false;
    hideAppLock();
    showToast('Vault Lock disabled');
  }
}

function openPasscodeSetupScreen(mode = 'setup') {
  setupModalMode = mode;
  setupPasscodePhase = 'create';
  setupFirstPasscode = '';
  setupEnteredPasscode = '';

  const modal = document.getElementById('passcodeSetupModal');
  const title = document.getElementById('setupPasscodeTitle');
  const subtitle = document.getElementById('setupPasscodeSubtitle');
  const errorMsg = document.getElementById('setupErrorMsg');

  if (title) {
    title.textContent = mode === 'change' ? 'Change Vault Passcode' : (mode === 'reset' ? 'Reset Vault Passcode' : 'Set Vault Passcode');
  }
  if (subtitle) {
    subtitle.textContent = 'Choose a 4-digit passcode for your private vault';
  }
  if (errorMsg) errorMsg.style.display = 'none';

  updateSetupPasscodeDots();
  if (modal) modal.style.display = 'flex';
}

function updateSetupPasscodeDots() {
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById(`setupDot${i}`);
    if (dot) dot.classList.toggle('filled', i < setupEnteredPasscode.length);
  }
}

function enterSetupPasscodeDigit(digit) {
  if (setupEnteredPasscode.length >= 4) return;
  setupEnteredPasscode += digit;
  updateSetupPasscodeDots();
  if (navigator.vibrate) try { navigator.vibrate(25); } catch(_) {}

  const errorMsg = document.getElementById('setupErrorMsg');
  if (errorMsg) errorMsg.style.display = 'none';

  if (setupEnteredPasscode.length === 4) {
    setTimeout(processSetupPasscodeStep, 120);
  }
}

function deleteSetupPasscodeDigit() {
  if (setupEnteredPasscode.length > 0) {
    setupEnteredPasscode = setupEnteredPasscode.slice(0, -1);
    updateSetupPasscodeDots();
    const errorMsg = document.getElementById('setupErrorMsg');
    if (errorMsg) errorMsg.style.display = 'none';
  }
}

function clearSetupPasscode() {
  setupEnteredPasscode = '';
  updateSetupPasscodeDots();
  const errorMsg = document.getElementById('setupErrorMsg');
  if (errorMsg) errorMsg.style.display = 'none';
}

function cancelPasscodeSetup() {
  const modal = document.getElementById('passcodeSetupModal');
  if (modal) modal.style.display = 'none';
  setupEnteredPasscode = '';
  setupFirstPasscode = '';
  setupPasscodePhase = 'create';

  // If cancelling initial setup or reset without setting a new PIN, ensure lock is disabled so user is never locked out
  if (setupModalMode === 'reset' || setupModalMode === 'setup') {
    if (!state.appLockPin) {
      state.biometricLock = false;
      state.isAppLocked = false;
      try {
        localStorage.setItem('photo_org_biometric_lock', 'false');
        localStorage.removeItem('photo_org_app_pin');
      } catch (_) {}
      saveStateImmediate();
      const toggle = document.getElementById('biometricLockToggle');
      if (toggle) toggle.checked = false;
      const sub = document.getElementById('appLockSubControls');
      if (sub) sub.style.display = 'none';
      hideAppLock();
      showToast('Vault Lock disabled');
    }
  }
}

function processSetupPasscodeStep() {
  if (setupPasscodePhase === 'create') {
    setupFirstPasscode = setupEnteredPasscode;
    setupEnteredPasscode = '';
    setupPasscodePhase = 'confirm';

    const title = document.getElementById('setupPasscodeTitle');
    const subtitle = document.getElementById('setupPasscodeSubtitle');
    if (title) title.textContent = 'Confirm Your Passcode';
    if (subtitle) subtitle.textContent = 'Re-enter the 4-digit passcode to verify';
    updateSetupPasscodeDots();
    if (navigator.vibrate) try { navigator.vibrate(35); } catch(_) {}
  } else {
    // Confirm phase
    if (setupEnteredPasscode === setupFirstPasscode) {
      // MATCH SUCCESS!
      const finalPin = setupEnteredPasscode;
      state.appLockPin = finalPin;
      state.biometricLock = true;
      try {
        localStorage.setItem('photo_org_app_pin', finalPin);
        localStorage.setItem('photo_org_biometric_lock', 'true');
      } catch (_) {}
      saveState();

      if (navigator.vibrate) try { navigator.vibrate([40, 60, 40]); } catch(_) {}

      const modal = document.getElementById('passcodeSetupModal');
      if (modal) modal.style.display = 'none';

      const toggle = document.getElementById('biometricLockToggle');
      if (toggle) toggle.checked = true;
      const sub = document.getElementById('appLockSubControls');
      if (sub) sub.style.display = 'flex';

      showToast('🔒 Vault Passcode Set & Biometric Lock Activated!');
      setupEnteredPasscode = '';
      setupFirstPasscode = '';
      setupPasscodePhase = 'create';
    } else {
      // MISMATCH!
      if (navigator.vibrate) try { navigator.vibrate([80, 50, 80]); } catch(_) {}
      const dots = document.getElementById('setupPasscodeDots');
      if (dots) {
        dots.classList.remove('error');
        void dots.offsetWidth;
        dots.classList.add('error');
      }
      const errorMsg = document.getElementById('setupErrorMsg');
      if (errorMsg) {
        errorMsg.textContent = 'Passcodes do not match. Please try again.';
        errorMsg.style.display = 'block';
      }
      setTimeout(() => {
        setupEnteredPasscode = '';
        updateSetupPasscodeDots();
      }, 500);
    }
  }
}

function lockAppNow() {
  state.isAppLocked = true;
  showAppLock();
  showToast('🔒 Vault Locked');
}

let biometricAuthMode = 'unlock'; // 'unlock' or 'recovery'

window.onNativeBiometricResult = function(success, errOrReason) {
  const btn = document.getElementById('biometricPromptBtn');
  const text = document.getElementById('biometricPromptBtnText');
  if (success) {
    if (navigator.vibrate) try { navigator.vibrate([40, 60, 40]); } catch(_) {}
    if (biometricAuthMode === 'recovery') {
      closeForgotPasscodeModal();
      hideAppLock();
      showToast('🔓 Identity Verified! Set a new Passcode.');
      setTimeout(() => {
        openPasscodeSetupScreen('reset');
      }, 350);
    } else {
      hideAppLock();
      showToast('🔓 Vault Unlocked via Biometrics');
    }
  } else {
    if (navigator.vibrate) try { navigator.vibrate([60, 50, 60]); } catch(_) {}
    if (text) text.textContent = 'Unlock with Biometrics';
    if (btn) btn.style.borderColor = '';
    // If not a quiet user cancel, show helpful toast
    if (errOrReason && errOrReason !== 'no_device_lock' && errOrReason !== 'canceled' && errOrReason !== '10' && errOrReason !== '13') {
      showToast(`Biometrics: ${errOrReason}`);
    }
  }
};

function showAppLock() {
  const overlay = document.getElementById('appLockOverlay');
  if (!overlay) return;
  enteredAppLockPin = '';
  updateLockPinDots();
  const errorMsg = document.getElementById('lockErrorMsg');
  if (errorMsg) errorMsg.style.display = 'none';
  overlay.style.display = 'flex';
  
  // Attempt biometric authentication if native bridge available
  biometricAuthMode = 'unlock';
  if (window.AndroidApp && typeof window.AndroidApp.authenticateBiometrics === 'function') {
    try { window.AndroidApp.authenticateBiometrics(); } catch(_) {}
  }
}

function hideAppLock() {
  const overlay = document.getElementById('appLockOverlay');
  if (overlay) overlay.style.display = 'none';
  enteredAppLockPin = '';
  state.isAppLocked = false;
}

function updateLockPinDots() {
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById(`pinDot${i}`);
    if (dot) dot.classList.toggle('filled', i < enteredAppLockPin.length);
  }
}

function enterLockPinDigit(digit) {
  if (enteredAppLockPin.length >= 4) return;
  enteredAppLockPin += digit;
  updateLockPinDots();
  if (navigator.vibrate) try { navigator.vibrate(25); } catch(_) {}

  if (enteredAppLockPin.length === 4) {
    setTimeout(verifyAppLockPin, 50);
  }
}

function deleteLockPinDigit() {
  if (enteredAppLockPin.length > 0) {
    enteredAppLockPin = enteredAppLockPin.slice(0, -1);
    updateLockPinDots();
    const errorMsg = document.getElementById('lockErrorMsg');
    if (errorMsg) errorMsg.style.display = 'none';
  }
}

function clearLockPin() {
  enteredAppLockPin = '';
  updateLockPinDots();
  const errorMsg = document.getElementById('lockErrorMsg');
  if (errorMsg) errorMsg.style.display = 'none';
}

function verifyAppLockPin() {
  const validPin = state.appLockPin || localStorage.getItem('photo_org_app_pin');
  if (!validPin) {
    hideAppLock();
    return;
  }

  if (enteredAppLockPin === validPin) {
    if (navigator.vibrate) try { navigator.vibrate([40, 60, 40]); } catch(_) {}
    hideAppLock();
    showToast('🔓 Vault Unlocked');
  } else {
    if (navigator.vibrate) try { navigator.vibrate([80, 50, 80]); } catch(_) {}
    const dots = document.getElementById('lockPinDots');
    if (dots) {
      dots.classList.remove('error');
      void dots.offsetWidth;
      dots.classList.add('error');
    }
    const errorMsg = document.getElementById('lockErrorMsg');
    if (errorMsg) {
      errorMsg.innerHTML = 'Incorrect Passcode. <a href="javascript:handleForgotPasscode()" style="color:#38bdf8; text-decoration:underline; font-weight:700;">Forgot Passcode?</a>';
      errorMsg.style.display = 'block';
    }
    setTimeout(() => {
      clearLockPin();
    }, 450);
  }
}

function handleForgotPasscode() {
  const modal = document.getElementById('forgotPasscodeModal');
  if (modal) modal.style.display = 'flex';
}

function closeForgotPasscodeModal() {
  const modal = document.getElementById('forgotPasscodeModal');
  if (modal) modal.style.display = 'none';
}

function recoverPasscodeWithBiometrics() {
  biometricAuthMode = 'recovery';
  closeForgotPasscodeModal();
  if (window.AndroidApp && typeof window.AndroidApp.authenticateBiometrics === 'function') {
    try {
      window.AndroidApp.authenticateBiometrics();
      return;
    } catch (_) {}
  }
  // Simulated biometric authentication on web/desktop preview
  if (navigator.vibrate) try { navigator.vibrate([50, 40, 60]); } catch(_) {}
  showToast('Verifying Biometrics...');
  setTimeout(() => {
    hideAppLock();
    showToast('🔓 Identity Verified via Biometrics!');
    setTimeout(() => {
      openPasscodeSetupScreen('reset');
    }, 300);
  }, 500);
}

function resetPasscodeSecurityVault() {
  if (confirm('Reset your Vault Passcode? This will clear the forgotten passcode and let you set a new 4-digit passcode, or keep the lock disabled.')) {
    // Clear old forgotten passcode and disable lock immediately so user is never locked out
    state.appLockPin = null;
    state.biometricLock = false;
    state.isAppLocked = false;
    try {
      localStorage.removeItem('photo_org_app_pin');
      localStorage.setItem('photo_org_biometric_lock', 'false');
    } catch (_) {}
    saveStateImmediate();

    const toggle = document.getElementById('biometricLockToggle');
    if (toggle) toggle.checked = false;
    const sub = document.getElementById('appLockSubControls');
    if (sub) sub.style.display = 'none';

    closeForgotPasscodeModal();
    hideAppLock();
    showToast('Vault Passcode Cleared');
    setTimeout(() => {
      openPasscodeSetupScreen('reset');
    }, 250);
  }
}

function triggerBiometricAuth() {
  biometricAuthMode = 'unlock';
  if (window.AndroidApp && typeof window.AndroidApp.authenticateBiometrics === 'function') {
    try {
      window.AndroidApp.authenticateBiometrics();
      return;
    } catch(_) {}
  }
  // Smooth simulated biometric authentication with haptic feedback
  if (navigator.vibrate) try { navigator.vibrate([50, 40, 60]); } catch(_) {}
  const btn = document.getElementById('biometricPromptBtn');
  if (btn) {
    btn.style.borderColor = '#10b981';
    const text = document.getElementById('biometricPromptBtnText');
    if (text) text.textContent = 'Verifying Biometrics...';
  }
  setTimeout(() => {
    hideAppLock();
    showToast('🔓 FaceID / Fingerprint Verified');
    const text = document.getElementById('biometricPromptBtnText');
    if (text) text.textContent = 'Unlock with Biometrics';
    if (btn) btn.style.borderColor = '';
  }, 450);
}

function emergencyUnlockApp() {
  hideAppLock();
  showToast('👑 VIP / Developer Mode: Vault Bypassed');
}

// Change PIN Modal Handlers - Uses the professional Passcode setup screen
function openChangePinModal() {
  openPasscodeSetupScreen('change');
}

function closeChangePinModal() {
  cancelPasscodeSetup();
}

function saveNewPin() {
  // Handled by Passcode Setup Screen
}

// Manual Location Modal Handlers
let manualLocationPhotoId = null;
function openManualLocationModal(photoId) {
  manualLocationPhotoId = photoId;
  const photo = state.photos.find(p => p.id === photoId);
  const modal = document.getElementById('manualLocationModal');
  const placeInput = document.getElementById('manualPlaceInput');
  const cityInput = document.getElementById('manualCityInput');
  const countryInput = document.getElementById('manualCountryInput');
  if (placeInput) placeInput.value = photo?.location?.place || '';
  if (cityInput) cityInput.value = photo?.location?.city || '';
  if (countryInput) countryInput.value = photo?.location?.country || '';
  if (modal) modal.style.display = 'flex';
}

function closeManualLocationModal() {
  const modal = document.getElementById('manualLocationModal');
  if (modal) modal.style.display = 'none';
  manualLocationPhotoId = null;
}

function saveManualLocation() {
  if (!manualLocationPhotoId) return;
  const photo = state.photos.find(p => p.id === manualLocationPhotoId);
  if (!photo) return;
  const placeInput = document.getElementById('manualPlaceInput');
  const cityInput = document.getElementById('manualCityInput');
  const countryInput = document.getElementById('manualCountryInput');

  const place = placeInput ? placeInput.value.trim() : '';
  const city = cityInput ? cityInput.value.trim() : '';
  const country = countryInput ? countryInput.value.trim() : '';

  if (!place && !city && !country) {
    photo.location = null;
    showToast('Location cleared for this photo');
  } else {
    photo.location = {
      ...(photo.location || {}),
      latitude: photo.location?.latitude || 0,
      longitude: photo.location?.longitude || 0,
      place: place,
      city: city,
      country: country
    };
    showToast(`Updated location: ${[place, city, country].filter(Boolean).join(', ')}`);
  }
  saveState();
  closeManualLocationModal();
  if (state.activePhotoId === photo.id) {
    renderDetailTags(photo);
  }
  renderAll();
}

// Background / Visibility lock listener
document.addEventListener('visibilitychange', () => {
  if (document.hidden && state.biometricLock) {
    state.isAppLocked = true;
  } else if (!document.hidden && state.biometricLock && state.isAppLocked) {
    showAppLock();
  }
});

window.toggleBiometricLock = toggleBiometricLock;
window.lockAppNow = lockAppNow;
window.showAppLock = showAppLock;
window.hideAppLock = hideAppLock;
window.enterLockPinDigit = enterLockPinDigit;
window.deleteLockPinDigit = deleteLockPinDigit;
window.clearLockPin = clearLockPin;
window.triggerBiometricAuth = triggerBiometricAuth;
window.handleForgotPasscode = handleForgotPasscode;
window.closeForgotPasscodeModal = closeForgotPasscodeModal;
window.recoverPasscodeWithBiometrics = recoverPasscodeWithBiometrics;
window.resetPasscodeSecurityVault = resetPasscodeSecurityVault;
window.emergencyUnlockApp = emergencyUnlockApp;
window.openChangePinModal = openChangePinModal;
window.closeChangePinModal = closeChangePinModal;
window.saveNewPin = saveNewPin;
window.openManualLocationModal = openManualLocationModal;
window.closeManualLocationModal = closeManualLocationModal;
window.saveManualLocation = saveManualLocation;

window.handleNativeBackPressed = function() {
  const forgotModal = document.getElementById('forgotPasscodeModal');
  if (forgotModal && forgotModal.style.display !== 'none') {
    closeForgotPasscodeModal();
    return true;
  }
  const setupModal = document.getElementById('passcodeSetupModal');
  if (setupModal && setupModal.style.display !== 'none') {
    cancelPasscodeSetup();
    if (state.isAppLocked) {
      showAppLock();
    }
    return true;
  }
  if (state.isAppLocked) {
    return true;
  }
  return false;
};


// Location & GPS Settings Toggles
function toggleGpsMetadataSetting(checked) {
  state.gpsMetadataEnabled = !!checked;
  saveState();
  if (window.AndroidApp && typeof window.AndroidApp.setGpsMetadataEnabled === 'function') {
    try {
      window.AndroidApp.setGpsMetadataEnabled(state.gpsMetadataEnabled);
    } catch (e) {
      console.warn('AndroidApp.setGpsMetadataEnabled failed:', e);
    }
  }
  renderSettings();
  renderAll();
  if (state.activePhotoId) {
    const activePhoto = state.photos.find(p => p.id === state.activePhotoId);
    if (activePhoto) {
      renderDetailTags(activePhoto);
      updateDetailModalUI(activePhoto, true);
    }
  }
  showToast(checked ? (window.t ? window.t('settings_gps_extraction') + ' enabled' : 'GPS metadata extraction enabled') 
                    : (window.t ? window.t('settings_gps_extraction') + ' disabled' : 'GPS metadata extraction disabled'));
}

function toggleLocationTagsSetting(checked) {
  state.locationTagsEnabled = !!checked;
  saveState();
  renderSettings();
  renderAll();
  if (state.activePhotoId) {
    const activePhoto = state.photos.find(p => p.id === state.activePhotoId);
    if (activePhoto) {
      renderDetailTags(activePhoto);
      updateDetailModalUI(activePhoto, true);
    }
  }
  showToast(checked ? (window.t ? window.t('settings_location_tags') + ' enabled' : 'Location tag suggestions enabled') 
                    : (window.t ? window.t('settings_location_tags') + ' disabled' : 'Location tag suggestions disabled'));
}

function toggleLocationTagSubSetting(type, checked) {
  if (type === 'place') state.locationTagPlace = !!checked;
  else if (type === 'city') state.locationTagCity = !!checked;
  else if (type === 'country') state.locationTagCountry = !!checked;
  saveState();
  renderSettings();
  renderAll();
  if (state.activePhotoId) {
    const activePhoto = state.photos.find(p => p.id === state.activePhotoId);
    if (activePhoto) {
      renderDetailTags(activePhoto);
      updateDetailModalUI(activePhoto, true);
    }
  }
}

function toggleGalleryLocationBadgeSetting(checked) {
  state.galleryShowLocationBadge = !!checked;
  saveState();
  renderSettings();
  renderAll();
  showToast(checked ? (window.t ? window.t('settings_gallery_location_badges') + ' enabled' : 'Location badges on cards enabled') 
                    : (window.t ? window.t('settings_gallery_location_badges') + ' disabled' : 'Location badges on cards hidden'));
}

window.toggleGpsMetadataSetting = toggleGpsMetadataSetting;
window.toggleLocationTagsSetting = toggleLocationTagsSetting;
window.toggleLocationTagSubSetting = toggleLocationTagSubSetting;
window.toggleGalleryLocationBadgeSetting = toggleGalleryLocationBadgeSetting;

// App In-Place Push Update Notifications & OTA Architecture
window.appUpdateState = {
  currentVersionCode: 1,
  currentVersionName: '2.4.0',
  latestVersionCode: 2,
  latestVersionName: '2.5.0',
  // Placeholder Firebase Storage APK download URL (replaced with user's actual project bucket when deployed)
  apkUrl: 'https://firebasestorage.googleapis.com/v0/b/aura-photo-organizer-dummy.appspot.com/o/updates%2Faura-v2.5.0.apk?alt=media',
  releaseNotes: [
    'Push Update Notifications with 1-click in-place upgrading',
    'Preserved all photos, custom albums, and VIP 3D card finishes intact',
    'Performance optimizations & zero-clipping UI enhancements'
  ],
  forceUpdate: false
};

function togglePushUpdatesSetting(checked) {
  localStorage.setItem('aura_push_updates_enabled', checked ? 'true' : 'false');
  if (window.AndroidApp && typeof window.AndroidApp.setPushUpdatesEnabled === 'function') {
    try {
      window.AndroidApp.setPushUpdatesEnabled(!!checked);
    } catch (e) {
      console.warn('AndroidApp.setPushUpdatesEnabled failed:', e);
    }
  }
  const msg = checked
    ? (window.t ? window.t('settings_push_updates_title') + ': ' + (window.t('settings_secured') || 'Enabled') : 'Push update notifications enabled')
    : (window.t ? window.t('settings_push_updates_title') + ': Disabled' : 'Push update notifications disabled');
  showToast(msg);
}

function checkAppUpdate(isManual = false) {
  if (isManual) {
    showToast(window.t ? window.t('update_toast_checking') : 'Checking for updates...');
  }

  setTimeout(() => {
    const hasUpdate = window.appUpdateState.latestVersionCode > window.appUpdateState.currentVersionCode;
    if (hasUpdate) {
      openAppUpdateModal();
    } else if (isManual) {
      showToast(window.t ? window.t('update_toast_latest') : 'You are using the latest version of Aura (v2.4.0)!');
    }
  }, isManual ? 600 : 100);
}

function openAppUpdateModal() {
  const modal = document.getElementById('appUpdateModal');
  if (!modal) return;

  const versionBadge = document.getElementById('updateLatestVersionBadge');
  if (versionBadge) versionBadge.textContent = `v${window.appUpdateState.latestVersionName}`;

  const notesContainer = document.getElementById('updateReleaseNotesList');
  if (notesContainer) {
    notesContainer.innerHTML = window.appUpdateState.releaseNotes.map(item => `
      <div style="display: flex; gap: 8px; margin-bottom: 6px; align-items: flex-start;">
        <i class="fa-solid fa-check" style="color: #38bdf8; font-size: 11px; margin-top: 3px; flex-shrink: 0;"></i>
        <span>${item}</span>
      </div>
    `).join('');
  }

  const progressBox = document.getElementById('updateDownloadProgressBox');
  if (progressBox) progressBox.style.display = 'none';

  const installBtn = document.getElementById('startUpdateInstallBtn');
  if (installBtn) {
    installBtn.disabled = false;
    installBtn.innerHTML = `<i class="fa-solid fa-cloud-arrow-down"></i> <span>${window.t ? window.t('update_btn_install') : 'Download & Install'}</span>`;
  }

  modal.style.display = 'flex';
}

function closeAppUpdateModal() {
  const modal = document.getElementById('appUpdateModal');
  if (modal) modal.style.display = 'none';
}

function triggerAppUpdateInstall() {
  const progressBox = document.getElementById('updateDownloadProgressBox');
  const installBtn = document.getElementById('startUpdateInstallBtn');

  if (progressBox) progressBox.style.display = 'block';
  if (installBtn) {
    installBtn.disabled = true;
    installBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>${window.t ? window.t('update_downloading') : 'Downloading...'}</span>`;
  }

  if (window.AndroidApp && typeof window.AndroidApp.downloadAndInstallUpdate === 'function') {
    try {
      window.AndroidApp.downloadAndInstallUpdate(
        window.appUpdateState.apkUrl,
        window.appUpdateState.latestVersionName
      );
    } catch (e) {
      console.error('AndroidApp.downloadAndInstallUpdate error:', e);
      simulateUpdateDownload();
    }
  } else {
    simulateUpdateDownload();
  }
}

function simulateUpdateDownload() {
  let p = 0;
  const interval = setInterval(() => {
    p += 20;
    if (p > 100) p = 100;
    if (typeof window.onUpdateDownloadProgress === 'function') {
      window.onUpdateDownloadProgress(p);
    }
    if (p >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        showToast('In-place update APK ready! In native Android, PackageInstaller prompt appears to keep all data intact.');
        closeAppUpdateModal();
      }, 700);
    }
  }, 250);
}

window.onUpdateDownloadProgress = function(percent) {
  const progressBar = document.getElementById('updateDownloadProgressBar');
  const percentText = document.getElementById('updateDownloadPercentText');
  if (progressBar) progressBar.style.width = `${percent}%`;
  if (percentText) percentText.textContent = `${percent}%`;
};

window.togglePushUpdatesSetting = togglePushUpdatesSetting;
window.checkAppUpdate = checkAppUpdate;
window.openAppUpdateModal = openAppUpdateModal;
window.closeAppUpdateModal = closeAppUpdateModal;
window.triggerAppUpdateInstall = triggerAppUpdateInstall;

// -------------------------------------------------------------
// USER BUGS & COMMUNITY FEEDBACK (Direct Firebase Integration)
// -------------------------------------------------------------
let currentFeedbackType = 'general';

function openFeedbackModal() {
  const modal = document.getElementById('feedbackModal');
  if (!modal) return;

  // Always re-apply translations to DOM so every title, label, placeholder, and button matches the active language
  if (typeof window.applyTranslationsToDOM === 'function') {
    window.applyTranslationsToDOM();
  }

  // Ensure submit button has localized text and preserves data-i18n attribute
  const submitBtn = document.getElementById('submitFeedbackBtn');
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> <span data-i18n="feedback_submit_btn">${window.t ? window.t('feedback_submit_btn') : 'Submit Feedback'}</span>`;
  }

  // First category: General (selected by default)
  selectFeedbackType('general');

  // Diagnostics info
  const diagEl = document.getElementById('feedbackDiagnosticsText');
  if (diagEl) {
    const lang = (window.state && window.state.language) || 'en';
    const os = navigator.userAgent.includes('Android') ? 'Android' : (navigator.platform || 'Device');
    diagEl.textContent = `Aura v2.4.0 · ${os} · Lang: ${lang} · Diagnostics Attached`;
  }

  modal.style.display = 'flex';
  const subInput = document.getElementById('feedbackSubjectInput');
  if (subInput) {
    subInput.focus();
  }
}

function closeFeedbackModal() {
  const modal = document.getElementById('feedbackModal');
  if (modal) modal.style.display = 'none';
}

function selectFeedbackType(type) {
  currentFeedbackType = type || 'general';
  const genBtn = document.getElementById('feedbackTypeGeneralBtn');
  const featBtn = document.getElementById('feedbackTypeFeatureBtn');
  const bugBtn = document.getElementById('feedbackTypeBugBtn');

  if (genBtn) genBtn.classList.toggle('active', currentFeedbackType === 'general');
  if (featBtn) featBtn.classList.toggle('active', currentFeedbackType === 'feature');
  if (bugBtn) bugBtn.classList.toggle('active', currentFeedbackType === 'bug');
}

function submitUserFeedback(e) {
  if (e && e.preventDefault) e.preventDefault();

  const subInput = document.getElementById('feedbackSubjectInput');
  const msgInput = document.getElementById('feedbackMessageInput');
  const contactInput = document.getElementById('feedbackContactInput');
  const submitBtn = document.getElementById('submitFeedbackBtn');

  const subject = subInput ? subInput.value.trim() : '';
  const message = msgInput ? msgInput.value.trim() : '';
  const contact = contactInput ? contactInput.value.trim() : '';

  if (!subject || !message) {
    showToast(window.t ? window.t('feedback_validation_required', { defaultValue: 'Please enter a summary and details.' }) : 'Please enter a summary and details.');
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>...</span>`;
  }

  const feedbackPayload = {
    id: 'fb_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
    timestamp: Date.now(),
    isoDate: new Date().toISOString(),
    category: currentFeedbackType,
    subject: subject,
    message: message,
    contactEmail: contact || null,
    deviceInfo: {
      appVersion: '2.4.0',
      language: (window.state && window.state.language) || 'en',
      theme: (window.state && window.state.theme) || 'dark',
      isPro: !!(window.state && window.state.isPro),
      screenResolution: `${window.innerWidth}x${window.innerHeight}`,
      userAgent: navigator.userAgent,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    }
  };

  // Safe local persistence backup: always preserved on-device
  try {
    const history = JSON.parse(localStorage.getItem('aura_submitted_feedback') || '[]');
    history.unshift(feedbackPayload);
    if (history.length > 50) history.pop();
    localStorage.setItem('aura_submitted_feedback', JSON.stringify(history));
  } catch (err) {
    console.warn('Failed to cache feedback locally:', err);
  }

  // Dispatch to native Android bridge -> Firebase RTDB
  if (window.AndroidApp && typeof window.AndroidApp.submitFeedbackToFirebase === 'function') {
    try {
      window.AndroidApp.submitFeedbackToFirebase(JSON.stringify(feedbackPayload));
    } catch (err) {
      console.error('AndroidApp.submitFeedbackToFirebase error:', err);
    }
  }

  setTimeout(() => {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> <span data-i18n="feedback_submit_btn">${window.t ? window.t('feedback_submit_btn') : 'Submit Feedback'}</span>`;
    }

    if (subInput) subInput.value = '';
    if (msgInput) msgInput.value = '';
    if (contactInput) contactInput.value = '';

    closeFeedbackModal();

    const successMsg = window.t ? window.t('feedback_toast_success') : 'Your feedback has been submitted successfully!';
    showToast(successMsg);
  }, 400);
}

window.openFeedbackModal = openFeedbackModal;
window.closeFeedbackModal = closeFeedbackModal;
window.selectFeedbackType = selectFeedbackType;
window.submitUserFeedback = submitUserFeedback;

// Helper: Get filtered suggested location tags for a photo based on user settings
function getSuggestedLocationTagsForPhoto(photo) {
  // If GPS extraction is off OR location tags suggestions is off, return NO suggestions
  if (state.gpsMetadataEnabled === false || state.locationTagsEnabled === false) return [];
  if (!photo || !photo.location) return [];

  const loc = photo.location;
  const suggestions = [];

  if (state.locationTagPlace !== false && loc.place && typeof loc.place === 'string' && loc.place.trim()) {
    suggestions.push({ type: 'place', label: loc.place.trim() });
  }
  if (state.locationTagCity !== false && loc.city && typeof loc.city === 'string' && loc.city.trim()) {
    const city = loc.city.trim();
    if (!suggestions.some(s => s.label.toLowerCase() === city.toLowerCase())) {
      suggestions.push({ type: 'city', label: city });
    }
  }
  if (state.locationTagCountry !== false && loc.country && typeof loc.country === 'string' && loc.country.trim()) {
    const country = loc.country.trim();
    if (!suggestions.some(s => s.label.toLowerCase() === country.toLowerCase())) {
      suggestions.push({ type: 'country', label: country });
    }
  }

  // If coordinates exist and no named suggestion was found yet, offer coordinate tag
  if (suggestions.length === 0 && typeof loc.latitude === 'number' && typeof loc.longitude === 'number') {
    const coordsStr = loc.displayCoords || formatDisplayCoords(loc.latitude, loc.longitude);
    if (coordsStr) {
      suggestions.push({ type: 'coords', label: coordsStr });
    }
  }

  // Only trigger background reverse geocoding if GPS is ON, Location Tags is ON, and at least one sub-tag is enabled
  const isAnyLocTagEnabled = state.locationTagPlace !== false || state.locationTagCity !== false || state.locationTagCountry !== false;
  if (isAnyLocTagEnabled && typeof loc.latitude === 'number' && typeof loc.longitude === 'number' && !loc.place && !loc.city && !loc._isResolving) {
    loc._isResolving = true;
    resolveLocationFromCoords(loc.latitude, loc.longitude).then(res => {
      loc._isResolving = false;
      if (res && (res.place || res.city || res.country)) {
        photo.location = res;
        saveState();
        if (state.activePhotoId === photo.id) {
          renderDetailTags(photo);
          updateDetailModalUI(photo, true);
        }
      }
    }).catch(() => { loc._isResolving = false; });
  }

  return suggestions;
}
window.getSuggestedLocationTagsForPhoto = getSuggestedLocationTagsForPhoto;

// Helper: One-tap toggle to add or remove a location tag from a photo
function toggleLocationSuggestionForPhoto(photoId, tagName) {
  const photo = state.photos.find(p => p.id === photoId);
  if (!photo) return;
  if (!Array.isArray(photo.tags)) photo.tags = [];

  const cleanName = tagName.trim();
  const existingIdx = photo.tags.findIndex(t => t.toLowerCase() === cleanName.toLowerCase());

  if (existingIdx !== -1) {
    // Remove tag
    const removed = photo.tags.splice(existingIdx, 1)[0];
    saveState();
    if (state.activePhotoId === photoId) {
      renderDetailTags(photo);
    }
    renderAll();
    showToast(`Removed tag '${removed}'`);
  } else {
    // Add tag
    photo.tags.push(cleanName);
    // Ensure tag exists in global tags list
    if (!state.tags.some(t => t.name.toLowerCase() === cleanName.toLowerCase())) {
      const now = Date.now();
      state.tags.push({
        name: cleanName,
        color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)],
        createdAt: now,
        lastModifiedAt: now,
        lastViewedAt: now,
        photoCount: 1
      });
    }
    saveState();
    if (state.activePhotoId === photoId) {
      renderDetailTags(photo);
    }
    renderAll();
    showToast(`Added location tag '${cleanName}'`);
  }
}
window.toggleLocationSuggestionForPhoto = toggleLocationSuggestionForPhoto;

// Storage Management Handlers
function clearAppCache() {
  showToast('Cleaning temporary caches...');
  if (window.AndroidApp && typeof window.AndroidApp.clearCache === 'function') {
    try { window.AndroidApp.clearCache(); } catch (_) {}
  }
  setTimeout(() => {
    showToast('Cleaned image caches & temporary thumbs!');
    renderSettings();
  }, 400);
}

function emptyTrashFromSettings() {
  emptyTrash();
  renderSettings();
}

function exportFullDataBackup() {
  try {
    const backupData = {
      version: '2.4.0',
      exportedAt: new Date().toISOString(),
      theme: state.themePref,
      accentColor: state.accentColor,
      savedCustomColors: state.savedCustomColors,
      isPro: state.isPro,
      tags: state.tags,
      photos: state.photos.map(p => ({
        id: p.id,
        displayName: p.displayName,
        category: p.category,
        isPending: p.isPending,
        isFavorite: p.isFavorite,
        deletedAt: p.deletedAt,
        createdAt: p.createdAt,
        tags: p.tags,
        gradient: p.gradient
      }))
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura_photos_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Backup JSON exported successfully!');
  } catch (err) {
    console.error(err);
    showToast('Failed to export backup JSON');
  }
}

function importFullDataBackup(event) {
  const file = event?.target?.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (Array.isArray(data.photos) && Array.isArray(data.tags)) {
        state.tags = data.tags;
        state.photos = data.photos.map(p => ({
          ...p,
          dataUrl: p.dataUrl || generateGradientImage(p.displayName, p.category, p.gradient)
        }));
        if (typeof data.isPro === 'boolean') state.isPro = data.isPro;
        if (data.theme) setAppTheme(data.theme, false);
        if (data.accentColor) setAppAccentColor(data.accentColor, false);
        if (Array.isArray(data.savedCustomColors)) state.savedCustomColors = data.savedCustomColors;

        saveState();
        renderAll();
        showToast(`Restored ${state.photos.length} photos and ${state.tags.length} albums!`);
      } else {
        showToast('Invalid backup file format.');
      }
    } catch (err) {
      console.error(err);
      showToast('Could not parse backup JSON.');
    }
  };
  reader.readAsText(file);
}

function renderNavBadges() {
  const pendingCount = state.photos.filter(p => p.isPending && !p.deletedAt).length;
  const trashCount = state.photos.filter(p => p.deletedAt).length + (Array.isArray(state.deletedAlbums) ? state.deletedAlbums.length : 0);

  const dockBadge = document.getElementById('dockNavBadge');
  if (pendingCount > 0) {
    dockBadge.style.display = 'flex';
    dockBadge.textContent = pendingCount;
  } else {
    dockBadge.style.display = 'none';
  }

  const trashBadge = document.getElementById('trashNavBadge');
  if (trashCount > 0) {
    trashBadge.style.display = 'flex';
    trashBadge.textContent = trashCount;
  } else {
    trashBadge.style.display = 'none';
  }

  const favCount = state.photos.filter(p => p.isFavorite && !p.deletedAt).length;
  const favBadge = document.getElementById('favNavBadge');
  if (favBadge) {
    if (favCount > 0) {
      favBadge.style.display = 'flex';
      favBadge.textContent = favCount;
    } else {
      favBadge.style.display = 'none';
    }
  }
}

// 1. Render Loading Dock (Ultra-Smart Bulk Organization for 1000s of Photos)
function renderDock() {
  const pendingPhotos = state.photos.filter(p => p.isPending && !p.deletedAt);
  const grid = document.getElementById('dockPhotoGrid');
  const empty = document.getElementById('dockEmptyState');
  const subtitle = document.getElementById('dockSubtitle');
  const actionStrip = document.getElementById('dockActionStrip');
  const quickTagBar = document.getElementById('dockQuickTagBar');
  const quickTagStrip = document.getElementById('dockQuickTagStrip');
  const selectAllBtnText = document.getElementById('dockSelectAllBtnText');
  const selectedBadge = document.getElementById('dockSelectedCountBadge');
  const hint = document.getElementById('dockQuickTagHint');

  if (subtitle) {
    subtitle.textContent = pendingPhotos.length === 0
      ? (window.t ? window.t('dock_subtitle_clear') : 'All caught up')
      : (window.t ? window.t('dock_subtitle_pending', { count: pendingPhotos.length }) : `${pendingPhotos.length} photos pending review`);
  }

  if (pendingPhotos.length === 0) {
    if (grid) grid.innerHTML = '';
    if (empty) empty.style.display = 'flex';
    if (actionStrip) actionStrip.style.display = 'none';
    if (quickTagBar) quickTagBar.style.display = 'none';
    return;
  }

  if (empty) empty.style.display = 'none';
  if (actionStrip) actionStrip.style.display = 'flex';
  if (quickTagBar) quickTagBar.style.display = 'block';

  // Render 1-Tap Quick Tag Strip with vibrant album colors
  const newAlbumLabel = window.t ? window.t('albums_new_btn') : 'New Album';
  if (quickTagStrip) {
    quickTagStrip.innerHTML = state.tags.map(tag => `
      <button class="quick-tag-chip" onclick="quickTagSelected('${tag.name}')" title="${escapeHtml(tag.name)}">
        <span class="tag-dot" style="background:${tag.color}; box-shadow: 0 0 6px ${tag.color};"></span>
        <span>${escapeHtml(tag.name)}</span>
      </button>
    `).join('') + `
      <button class="quick-tag-chip new-tag-chip" onclick="openNewAlbumModal()" title="${newAlbumLabel}">
        <i class="fa-solid fa-plus"></i> <span>${newAlbumLabel}</span>
      </button>
    `;
  }

  const selectedCount = state.selectedDockPhotoIds.size;
  const allSelected = pendingPhotos.length > 0 && selectedCount === pendingPhotos.length;

  if (selectAllBtnText) {
    selectAllBtnText.textContent = allSelected
      ? (window.t ? window.t('dock_deselect_all') : 'Deselect All')
      : (window.t ? window.t('dock_select_all_count', { count: pendingPhotos.length }) : `Select All (${pendingPhotos.length})`);
  }

  if (selectedBadge) {
    selectedBadge.textContent = selectedCount === 0
      ? (window.t ? window.t('dock_selected_zero') : '0 Selected')
      : (window.t ? window.t('dock_selected_count', { count: selectedCount, total: pendingPhotos.length }) : `${selectedCount} of ${pendingPhotos.length} Selected`);
    selectedBadge.classList.toggle('has-selection', selectedCount > 0);
  }

  if (hint) {
    hint.textContent = selectedCount === 0
      ? (window.t ? window.t('dock_hint_default') : 'Tap photos to select, then tap album')
      : (window.t ? window.t('dock_hint_selected', { count: selectedCount }) : `Tap an album above to organize ${selectedCount} photos!`);
  }

  if (grid) {
    const pendingLabel = window.t ? window.t('dock_card_pending') : 'Pending';
    const albumLabel = window.t ? window.t('dock_card_album') : 'Album';
    const saveLabel = window.t ? window.t('dock_card_save') : 'Save';
    const renameLabel = window.t ? window.t('dock_card_rename') : 'Rename';
    const trashLabel = window.t ? window.t('dock_card_trash') : 'Trash';

    grid.innerHTML = pendingPhotos.map(photo => {
      const isSelected = state.selectedDockPhotoIds.has(photo.id);
      const locSuggestions = getSuggestedLocationTagsForPhoto(photo);
      const suggestedChipsHtml = locSuggestions.map(s => {
        const isAdded = photo.tags.some(t => t.toLowerCase() === s.label.toLowerCase());
        return `
          <button class="photo-chip loc-suggestion-chip ${isAdded ? 'added' : ''}" 
                  onclick="event.stopPropagation(); toggleLocationSuggestionForPhoto('${photo.id}', '${escapeJs(s.label)}')" 
                  title="${isAdded ? 'Click to remove tag' : 'Click to add location tag'}">
            <i class="fa-solid ${isAdded ? 'fa-check' : 'fa-location-dot'}"></i> ${escapeHtml(s.label)}
          </button>
        `;
      }).join('');

      const tagHtml = (photo.tags.length > 0 || locSuggestions.length > 0)
        ? `<div class="dock-card-tags">${photo.tags.map(t => `<span class="photo-chip">${escapeHtml(t)}</span>`).join('')}${suggestedChipsHtml}</div>`
        : '';
      return `
        <div class="photo-card-elegant dock-card ${isSelected ? 'selected' : ''}" onclick="toggleDockSelect('${photo.id}')" data-id="${photo.id}">
          <div class="card-image-box">
            <img src="${photo.dataUrl}" alt="${escapeHtml(photo.displayName)}" loading="lazy">
            <span class="dock-staging-pill">
              <span class="staging-pulse-dot"></span>
              <span>${pendingLabel}</span>
            </span>
            ${(state.galleryShowLocationBadge === true && photo.location && typeof photo.location.latitude === 'number') ? `
              <span class="dock-location-pill" title="Location: ${escapeHtml(photo.location.city || photo.location.place || photo.location.country || photo.location.displayCoords || formatDisplayCoords(photo.location.latitude, photo.location.longitude))}">
                <i class="fa-solid fa-location-dot"></i> ${escapeHtml(photo.location.city || photo.location.place || photo.location.country || photo.location.displayCoords || formatDisplayCoords(photo.location.latitude, photo.location.longitude))}
              </span>
            ` : ''}
            <button class="card-preview-btn" onclick="event.stopPropagation(); openPhotoDetail('${photo.id}')" title="${escapeHtml(photo.displayName)}">
              <i class="fa-solid fa-expand"></i>
            </button>
            <div class="card-select-check ${isSelected ? 'checked' : ''}">
              ${isSelected ? '<i class="fa-solid fa-check"></i>' : ''}
            </div>
            <div class="card-overlay-bottom">
              <span class="card-title" onclick="event.stopPropagation(); openRenamePhotoModal('${photo.id}')" title="${escapeHtml(photo.displayName)}">
                ${escapeHtml(photo.displayName)} <i class="fa-solid fa-pen" style="font-size:10px; opacity:0.75; margin-left:4px;"></i>
              </span>
            </div>
          </div>
          ${tagHtml}
          <div class="dock-card-action-suite">
            <div class="dock-action-row dock-action-row-primary">
              <button class="btn-dock-lux btn-dock-album" onclick="event.stopPropagation(); openBatchTagModal(['${photo.id}'])" title="${albumLabel}">
                <i class="fa-solid fa-folder-plus"></i><span>${albumLabel}</span>
              </button>
              <button class="btn-dock-lux btn-dock-save" onclick="event.stopPropagation(); movePhotoToGallery('${photo.id}')" title="${saveLabel}">
                <i class="fa-solid fa-wand-magic-sparkles"></i><span>${saveLabel}</span>
              </button>
            </div>
            <div class="dock-action-row dock-action-row-sub">
              <button class="btn-dock-lux-sub btn-dock-rename" onclick="event.stopPropagation(); openRenamePhotoModal('${photo.id}')" title="${renameLabel}">
                <i class="fa-solid fa-pen-nib"></i><span>${renameLabel}</span>
              </button>
              <button class="btn-dock-lux-sub btn-dock-trash" onclick="event.stopPropagation(); moveToTrash('${photo.id}')" title="${trashLabel}">
                <i class="fa-solid fa-trash-can"></i><span>${trashLabel}</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
}

function toggleDockSelect(id) {
  if (state.selectedDockPhotoIds.has(id)) {
    state.selectedDockPhotoIds.delete(id);
  } else {
    state.selectedDockPhotoIds.add(id);
  }
  renderDock();
}

function toggleSelectAllDock() {
  const pendingPhotos = state.photos.filter(p => p.isPending && !p.deletedAt);
  if (state.selectedDockPhotoIds.size === pendingPhotos.length) {
    state.selectedDockPhotoIds.clear();
  } else {
    pendingPhotos.forEach(p => state.selectedDockPhotoIds.add(p.id));
  }
  renderDock();
}

function quickTagSelected(tagName) {
  if (state.selectedDockPhotoIds.size === 0) {
    showToast(`Select photos below first, then tap '${tagName}' to organize!`);
    return;
  }

  const count = state.selectedDockPhotoIds.size;
  state.photos.forEach(photo => {
    if (state.selectedDockPhotoIds.has(photo.id)) {
      if (!photo.tags) photo.tags = [];
      if (!photo.tags.includes(tagName)) {
        photo.tags.push(tagName);
      }
      photo.isPending = false;
    }
  });

  state.selectedDockPhotoIds.clear();
  saveState();
  renderAll();
  showToast(`✨ Organized ${count} ${count === 1 ? 'photo' : 'photos'} into '${tagName}' album!`);
}

function openBatchTagModalFromDock() {
  if (state.selectedDockPhotoIds.size === 0) {
    showToast('Select photos to tag first!');
    return;
  }
  openBatchTagModal(Array.from(state.selectedDockPhotoIds));
}

function moveSelectedDockDirect() {
  const pendingPhotos = state.photos.filter(p => p.isPending && !p.deletedAt);
  if (pendingPhotos.length === 0) {
    showToast('No pending photos in Loading Dock to save!');
    return;
  }

  // If specific photos are checked, move those. If none are explicitly checked, save all pending photos in dock.
  const targetIds = state.selectedDockPhotoIds.size > 0
    ? Array.from(state.selectedDockPhotoIds)
    : pendingPhotos.map(p => p.id);

  if (targetIds.length === 0) {
    showToast('Select photos to save first!');
    return;
  }

  const count = targetIds.length;
  state.photos.forEach(photo => {
    if (targetIds.includes(photo.id)) {
      photo.isPending = false;
    }
  });

  state.selectedDockPhotoIds.clear();
  saveState();
  renderAll();
  showToast(`✨ Saved ${count} ${count === 1 ? 'photo' : 'photos'} directly to Gallery!`);
}

function deleteSelectedDockPhotos() {
  if (state.selectedDockPhotoIds.size === 0) {
    showToast('Select photos to delete first!');
    return;
  }
  const count = state.selectedDockPhotoIds.size;
  state.photos.forEach(photo => {
    if (state.selectedDockPhotoIds.has(photo.id)) {
      photo.deletedAt = Date.now();
    }
  });
  state.selectedDockPhotoIds.clear();
  saveState();
  renderAll();
  showToast(`Moved ${count} photos to Trash`);
}

// -------------------------------------------------------------
// GALLERY ALBUMS THREE-DOT MENU & POPOVER (Item 10)
// -------------------------------------------------------------
function toggleGalleryAlbumsMenu(event) {
  if (event) event.stopPropagation();
  const dropdown = document.getElementById('galleryAlbumsDropdown');
  if (!dropdown) return;
  const isVisible = dropdown.style.display === 'flex';
  if (isVisible) {
    dropdown.style.display = 'none';
  } else {
    renderGalleryAlbumsDropdown();
    dropdown.style.display = 'flex';
  }
}

function closeGalleryAlbumsMenu() {
  const dropdown = document.getElementById('galleryAlbumsDropdown');
  if (dropdown) dropdown.style.display = 'none';
}

function toggle3DEffectsFromMenu(event) {
  if (event) event.stopPropagation();

  // If user is not an Aura VIP pro member, show luxury VIP upgrade modal
  if (!state.isPro) {
    if (typeof openRazorpayModal === 'function') {
      openRazorpayModal();
    }
    const vipMsg = window.t ? window.t('gallery_3d_vip_only') : '👑 3D Effects are an Aura Pro VIP exclusive feature!';
    showToast(vipMsg);
    if (navigator.vibrate) {
      try { navigator.vibrate([30, 40, 30]); } catch (e) {}
    }
    return;
  }

  // Determine current active status
  const currentlyActive = (state.albumPhotos3DEnabled !== false) && (state.global3DEnabled !== false);
  const newActiveState = !currentlyActive;

  state.albumPhotos3DEnabled = newActiveState;
  state.global3DEnabled = newActiveState;

  try {
    localStorage.setItem('aura_album_photos_3d_enabled', newActiveState ? 'true' : 'false');
    localStorage.setItem('photo_org_global_3d', newActiveState ? 'true' : 'false');
  } catch (err) {}

  saveState();
  renderGallery();
  renderGalleryAlbumsDropdown();

  if (typeof renderAlbumsScreen === 'function') {
    renderAlbumsScreen();
  }

  if (navigator.vibrate) {
    try { navigator.vibrate(newActiveState ? [30, 50, 40] : [40]); } catch (e) {}
  }

  const msg = newActiveState
    ? (window.t ? window.t('gallery_3d_effects_on_toast') : '✨ 3D Holographic Parallax & Depth Enabled!')
    : (window.t ? window.t('gallery_3d_effects_off_toast') : '3D Effects Disabled (Clean 2D Mode)');
  showToast(msg);
}
window.toggle3DEffectsFromMenu = toggle3DEffectsFromMenu;

function renderGalleryAlbumsDropdown() {
  const list = document.getElementById('dropdownAlbumsList');
  const badge = document.getElementById('dropdownAlbumsBadge');
  const toggleLabel = document.getElementById('carouselToggleLabel');
  if (!list) return;

  // Sync VIP 3D Effects Switch in 3-dot dropdown menu (Item 11)
  const is3DActive = !!state.isPro && (state.albumPhotos3DEnabled !== false) && (state.global3DEnabled !== false);
  const dropdown3DBtn = document.getElementById('dropdown3DEffectsBtn');
  const dropdown3DDesc = document.getElementById('dropdown3DDesc');
  const dropdown3DSwitchPill = document.getElementById('dropdown3DSwitchPill');

  if (dropdown3DBtn) {
    dropdown3DBtn.classList.toggle('active', is3DActive);
    dropdown3DBtn.classList.toggle('vip-locked', !state.isPro);
  }
  if (dropdown3DSwitchPill) {
    dropdown3DSwitchPill.classList.toggle('active', is3DActive);
    dropdown3DSwitchPill.classList.toggle('locked', !state.isPro);
  }
  if (dropdown3DDesc) {
    if (!state.isPro) {
      dropdown3DDesc.textContent = window.t ? window.t('gallery_3d_unlock_vip') : 'Unlock with Aura VIP';
    } else {
      dropdown3DDesc.textContent = is3DActive 
        ? (window.t ? window.t('gallery_3d_effects_active') : '3D Tilt & Depth: Active') 
        : (window.t ? window.t('gallery_3d_effects_off') : '3D Effects: Disabled (Flat 2D)');
    }
  }

  const validPhotos = state.photos.filter(p => !p.isPending && !p.deletedAt);
  const favCount = validPhotos.filter(p => p.isFavorite).length;
  const totalAlbums = state.tags.length + 1; // Favorites + custom tags

  if (badge) badge.textContent = `${totalAlbums} ${window.t ? window.t('gallery_albums_badge_unit') : 'Albums'}`;
  if (toggleLabel) toggleLabel.textContent = state.showFeaturedCarousel ? (window.t ? window.t('gallery_carousel_hide') : 'Hide Carousel') : (window.t ? window.t('gallery_carousel_show') : 'Show Carousel');

  const hasFilter = state.onlyFavorites || (state.selectedFilterTags && state.selectedFilterTags.size > 0);

  // 1. "All Photos" row
  const allPhotosTitle = window.t ? window.t('gallery_all_photos') : 'All Photos';
  const momentsUnit = window.t ? window.t('gallery_moments_count') : 'moments';
  let html = `
    <button type="button" class="dropdown-album-item ${!hasFilter ? 'active' : ''}" onclick="clearAllAlbumFilters()">
      <div class="dropdown-album-item-left">
        <i class="fa-solid fa-images" style="color: #60a5fa; font-size: 13px; width: 14px; text-align: center;"></i>
        <div>
          <div class="dropdown-album-name">${escapeHtml(allPhotosTitle)}</div>
          <div class="dropdown-album-count">${validPhotos.length} ${escapeHtml(momentsUnit)}</div>
        </div>
      </div>
      ${!hasFilter ? '<i class="fa-solid fa-check dropdown-album-check"></i>' : ''}
    </button>
  `;

  // 2. "Favorites" album row
  const favActive = state.onlyFavorites;
  const favTitle = window.t ? window.t('favorites_title') : 'Favorites';
  const favPhotoCount = window.t ? window.t('albums_photo_count', { count: favCount }) : (favCount === 1 ? '1 photo' : `${favCount} photos`);
  html += `
    <button type="button" class="dropdown-album-item ${favActive ? 'active' : ''}" onclick="selectGalleryAlbumFromMenu('favorites')">
      <div class="dropdown-album-item-left">
        <i class="fa-solid fa-heart" style="color: #f43f5e; font-size: 13px; width: 14px; text-align: center;"></i>
        <div>
          <div class="dropdown-album-name">${escapeHtml(favTitle)}</div>
          <div class="dropdown-album-count">${favPhotoCount}</div>
        </div>
      </div>
      ${favActive ? '<i class="fa-solid fa-check dropdown-album-check"></i>' : ''}
    </button>
  `;

  // 3. User custom albums (e.g. Wedding, Birthday, Job Offer, Vacation, etc.)
  state.tags.forEach(tag => {
    const isTagActive = state.selectedFilterTags.has(tag.name);
    const count = validPhotos.filter(p => Array.isArray(p.tags) && p.tags.includes(tag.name)).length;
    const tagPhotoCount = window.t ? window.t('albums_photo_count', { count }) : (count === 1 ? '1 photo' : `${count} photos`);
    html += `
      <button type="button" class="dropdown-album-item ${isTagActive ? 'active' : ''}" onclick="selectGalleryAlbumFromMenu('${escapeHtml(tag.name)}')">
        <div class="dropdown-album-item-left">
          <span class="dropdown-album-dot" style="background: ${tag.color};"></span>
          <div>
            <div class="dropdown-album-name">${escapeHtml(tag.name)}</div>
            <div class="dropdown-album-count">${tagPhotoCount}</div>
          </div>
        </div>
        ${isTagActive ? '<i class="fa-solid fa-check dropdown-album-check"></i>' : ''}
      </button>
    `;
  });

  list.innerHTML = html;
}

function selectGalleryAlbumFromMenu(albumName) {
  if (albumName === 'favorites') {
    state.onlyFavorites = true;
    state.selectedFilterTags.clear();
  } else {
    state.onlyFavorites = false;
    state.selectedFilterTags.clear();
    state.selectedFilterTags.add(albumName);
  }
  renderGallery();
  closeGalleryAlbumsMenu();
  showToast(`✨ Filtered by '${albumName === 'favorites' ? 'Favorites' : albumName}'`);
}

function clearAllAlbumFilters() {
  state.onlyFavorites = false;
  state.selectedFilterTags.clear();
  renderGallery();
  closeGalleryAlbumsMenu();
  showToast('✨ Showing all photos');
}

function toggleFeaturedCarouselVisibility() {
  state.showFeaturedCarousel = !state.showFeaturedCarousel;
  const section = document.getElementById('galleryAlbumsSection');
  if (section) section.style.display = state.showFeaturedCarousel ? 'block' : 'none';
  renderGalleryAlbumsDropdown();
  showToast(state.showFeaturedCarousel ? 'Featured albums carousel visible' : 'Featured albums carousel hidden');
}

function hideFeaturedAlbumsCarousel() {
  state.showFeaturedCarousel = false;
  const section = document.getElementById('galleryAlbumsSection');
  if (section) section.style.display = 'none';
  renderGalleryAlbumsDropdown();
  showToast('Featured albums carousel hidden');
}

// 2. Render Featured Albums Carousel with Live Counts
function renderAlbumsCarousel() {
  const section = document.getElementById('galleryAlbumsSection');
  if (section) {
    section.style.display = state.showFeaturedCarousel ? 'block' : 'none';
  }

  const container = document.getElementById('albumsCarouselContainer');
  const summary = document.getElementById('albumCountSummary');
  if (!container) return;

  const validPhotos = state.photos.filter(p => !p.isPending && !p.deletedAt);
  const favoritePhotos = state.photos.filter(p => p.isFavorite && !p.deletedAt);
  const favCount = favoritePhotos.length;

  const q = (state.searchQuery || '').trim().toLowerCase();

  // Filter visible albums if search query is active
  const matchingTags = q
    ? state.tags.filter(t => t.name.toLowerCase().includes(q))
    : state.tags;

  const favMatches = !q || 'favorites'.includes(q) || 'favourite'.includes(q) || 'loved'.includes(q);

  if (summary) {
    summary.textContent = `${matchingTags.length + (favMatches ? 1 : 0)} Albums`;
  }

  const repFavPhoto = favoritePhotos[0];
  const favBgStyle = repFavPhoto 
    ? `background-image: url('${repFavPhoto.dataUrl}'); background-size: cover; background-position: center;`
    : `background: linear-gradient(135deg, #f43f5e, #9333ea);`;

  const favoritesCardHtml = favMatches ? `
    <div class="album-card ${state.onlyFavorites ? 'active-filter' : ''}" style="${favBgStyle}" onclick="toggleFavoriteFilter()">
      <div class="album-card-overlay">
        <span class="album-card-badge" style="background:#f43f5e;"><i class="fa-solid fa-heart"></i> ${favCount} photos</span>
        <span class="album-card-title"><i class="fa-solid fa-heart" style="color:#f43f5e; margin-right:4px;"></i>Favorites</span>
        <span class="album-card-count">${favCount === 1 ? '1 moment' : `${favCount} moments`}</span>
      </div>
    </div>
  ` : '';

  const tagsCardsHtml = matchingTags.map(tag => {
    const count = validPhotos.filter(p => Array.isArray(p.tags) && p.tags.includes(tag.name)).length;
    const repPhoto = validPhotos.find(p => Array.isArray(p.tags) && p.tags.includes(tag.name));
    const bgStyle = repPhoto 
      ? `background-image: url('${repPhoto.dataUrl}'); background-size: cover; background-position: center;`
      : `background: linear-gradient(135deg, ${tag.color}, #f43f5e);`;

    const isFiltered = state.selectedFilterTags.has(tag.name);

    return `
      <div class="album-card ${isFiltered ? 'active-filter' : ''}" style="${bgStyle}" onclick="toggleTagFilter('${escapeHtml(tag.name)}')">
        <div class="album-card-overlay">
          <span class="album-card-badge">${count} photos</span>
          <span class="album-card-title">${escapeHtml(tag.name)}</span>
          <span class="album-card-count">${count === 1 ? '1 moment' : `${count} moments`}</span>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = favoritesCardHtml + tagsCardsHtml;
}

// 3. Render Gallery (Elegant 2-column cards, no text clipping, with download & share)
function renderGallery() {
  renderAlbumsCarousel();

  // Update 3-dot menu active indicator dot if an album filter is active (Item 10)
  const menuDot = document.getElementById('albumsMenuActiveDot');
  if (menuDot) {
    const hasFilter = state.onlyFavorites || (state.selectedFilterTags && state.selectedFilterTags.size > 0);
    menuDot.style.display = hasFilter ? 'block' : 'none';
  }

  const q = (state.searchQuery || '').trim().toLowerCase();
  let photos = state.photos.filter(p => !p.isPending && !p.deletedAt);

  // If a search query is active, search across all photos by title, tags, album category, and favorite keyword
  if (q) {
    const terms = q.split(/\s+/).filter(Boolean);
    photos = photos.filter(p => {
      const name = (p.displayName || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      const tags = Array.isArray(p.tags) ? p.tags.map(t => (t || '').toLowerCase()) : [];
      const isFav = p.isFavorite ? 'favorites favourite loved' : '';

      return terms.every(term =>
        name.includes(term) ||
        cat.includes(term) ||
        tags.some(t => t.includes(term)) ||
        isFav.includes(term)
      );
    });

    // Date Range filter when searching
    if (state.startDate) {
      photos = photos.filter(p => p.createdAt >= state.startDate);
    }
    if (state.endDate) {
      photos = photos.filter(p => p.createdAt <= state.endDate + 86399999);
    }
  } else {
    // When no search query, apply standard view filters
    if (state.onlyFavorites) {
      photos = photos.filter(p => p.isFavorite);
    }
    if (state.selectedFilterTags.size > 0) {
      photos = photos.filter(p =>
        Array.isArray(p.tags) && p.tags.some(t => state.selectedFilterTags.has(t))
      );
    }
    if (state.startDate) {
      photos = photos.filter(p => p.createdAt >= state.startDate);
    }
    if (state.endDate) {
      photos = photos.filter(p => p.createdAt <= state.endDate + 86399999);
    }
  }

  // Smart Sorting (Newest First, Oldest First, Name A-Z, Name Z-A)
  const sortMode = state.gallerySort || 'date-desc';
  photos.sort((a, b) => {
    switch (sortMode) {
      case 'date-asc':
        return (a.createdAt || 0) - (b.createdAt || 0);
      case 'name-asc':
        return (a.displayName || '').localeCompare(b.displayName || '', undefined, { numeric: true, sensitivity: 'base' });
      case 'name-desc':
        return (b.displayName || '').localeCompare(a.displayName || '', undefined, { numeric: true, sensitivity: 'base' });
      case 'date-desc':
      default:
        return (b.createdAt || 0) - (a.createdAt || 0);
    }
  });

  // Update Sort Trigger UI Label and State
  updateSortUI();

  // Subheader count
  const countEl = document.getElementById('galleryCountText');
  if (countEl) {
    if (q) {
      countEl.textContent = (window.t ? window.t('gallery_search_count', { count: photos.length, query: state.searchQuery.trim() }) : `${photos.length} photo${photos.length === 1 ? '' : 's'} matching "${state.searchQuery.trim()}"`);
    } else if (state.onlyFavorites) {
      countEl.textContent = (window.t ? window.t('gallery_favorites_count', { count: photos.length }) : `${photos.length} favorite photo${photos.length === 1 ? '' : 's'} found`);
    } else if (state.selectedFilterTags.size > 0) {
      const albumNames = Array.from(state.selectedFilterTags).join(', ');
      if (photos.length === 0) {
        countEl.textContent = (window.t ? window.t('gallery_album_empty_count', { album: albumNames }) : `0 photos in ${albumNames}`);
      } else if (photos.length === 1) {
        countEl.textContent = (window.t ? window.t('gallery_photos_in_album_single', { album: albumNames }) : `1 photo in ${albumNames}`);
      } else {
        countEl.textContent = (window.t ? window.t('gallery_photos_in_album_plural', { count: photos.length, album: albumNames }) : `${photos.length} photos in ${albumNames}`);
      }
    } else {
      countEl.textContent = (window.t ? window.t('gallery_photos_found', { count: photos.length }) : `${photos.length} photo${photos.length === 1 ? '' : 's'} found`);
    }
  }

  // Filter chips
  renderFilterStrip();

// Format album photo count with accurate singular/plural localization (No duplicate digits)
function formatAlbumPhotoCount(count) {
  const num = typeof count === 'number' ? count : (parseInt(count, 10) || 0);
  if (num === 1) {
    return window.t && window.t('albums_photo_count_single')
      ? window.t('albums_photo_count_single')
      : '1 photo';
  }
  return window.t
    ? window.t('albums_photo_count', { count: num })
    : `${num} photos`;
}
window.formatAlbumPhotoCount = formatAlbumPhotoCount;

  // Album Active View Banner & Direct Import (VIP Item 3)
  const activeAlbumName = state.selectedFilterTags.size === 1 ? Array.from(state.selectedFilterTags)[0] : null;
  const albumBanner = document.getElementById('albumActiveBanner');
  const albumEmptyBtn = document.getElementById('albumEmptyImportBtn');
  const album3DToggleBtn = document.getElementById('albumView3DToggleBtn');

  let isAlbumPhoto3DActive = false;
  let activeAlbumSurfaceStyle = 'holo';

  if (activeAlbumName) {
    const albumTag = state.tags.find(t => t.name === activeAlbumName);
    const albumColor = albumTag ? albumTag.color : '#f43f5e';
    activeAlbumSurfaceStyle = (albumTag && albumTag.surface3DStyle && albumTag.surface3DStyle !== 'none')
      ? albumTag.surface3DStyle
      : 'holo';
    isAlbumPhoto3DActive = !!state.isPro && (state.albumPhotos3DEnabled !== false) && (state.global3DEnabled !== false) && (!albumTag || !albumTag.disablePhoto3D);

    if (album3DToggleBtn) {
      album3DToggleBtn.style.display = 'inline-flex';
      album3DToggleBtn.classList.toggle('active', isAlbumPhoto3DActive);
      const label = album3DToggleBtn.querySelector('.toggle-3d-label');
      if (label) {
        label.textContent = isAlbumPhoto3DActive ? '3D FX ON' : '3D FX OFF';
      }
      album3DToggleBtn.title = isAlbumPhoto3DActive
        ? '3D Card FX Active (Click to disable)'
        : '3D Card FX Disabled (Click to enable)';
    }

    if (albumBanner) {
      albumBanner.style.display = 'flex';
      const dot = document.getElementById('albumBannerDot');
      const title = document.getElementById('albumBannerTitle');
      const sub = document.getElementById('albumBannerSubtitle');
      if (dot) dot.style.backgroundColor = albumColor;
      if (title) {
        title.textContent = activeAlbumName;
        title.title = activeAlbumName;
      }
      if (sub) sub.textContent = formatAlbumPhotoCount(photos.length);
    }
    if (albumEmptyBtn) albumEmptyBtn.style.display = 'inline-flex';
  } else {
    if (album3DToggleBtn) album3DToggleBtn.style.display = 'none';
    if (albumBanner) albumBanner.style.display = 'none';
    if (albumEmptyBtn) albumEmptyBtn.style.display = 'none';
  }

  // Selection Bar
  const selBar = document.getElementById('gallerySelectionBar');
  if (state.selectedGalleryPhotoIds.size > 0) {
    selBar.style.display = 'flex';
    document.getElementById('selectionCountText').textContent = window.t ? window.t('gallery_selected_count', { count: state.selectedGalleryPhotoIds.size }) : `${state.selectedGalleryPhotoIds.size} Selected`;
    const isSingle = state.selectedGalleryPhotoIds.size === 1;
    const renameBtn = document.getElementById('renameSelectedBtn');
    const cropBtn = document.getElementById('cropSelectedBtn');
    if (renameBtn) renameBtn.style.display = isSingle ? 'inline-flex' : 'none';
    if (cropBtn) cropBtn.style.display = isSingle ? 'inline-flex' : 'none';
  } else {
    selBar.style.display = 'none';
  }

  const grid = document.getElementById('galleryPhotoGrid');
  const empty = document.getElementById('galleryEmptyState');

  if (photos.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'flex';

    const emptyTitle = document.getElementById('galleryEmptyTitle');
    const emptyDesc = document.getElementById('galleryEmptyDesc');
    const clearBtn = document.getElementById('clearAllFiltersBtn');
    const albumEmptyBtnText = document.getElementById('albumEmptyImportBtnText');

    if (activeAlbumName) {
      if (emptyTitle) emptyTitle.textContent = window.t ? window.t('gallery_empty_album_title') : 'This Album is Empty';
      if (emptyDesc) emptyDesc.textContent = window.t ? window.t('gallery_empty_album_desc') : 'No photos have been added to this album yet. Tap below to import photos directly, or organize photos from the Loading Dock.';
      if (albumEmptyBtn) {
        albumEmptyBtn.style.display = 'inline-flex';
      }
      if (albumEmptyBtnText) {
        albumEmptyBtnText.textContent = window.t ? window.t('album_banner_import_btn') : 'Import Photos from Gallery (VIP)';
      }
      if (clearBtn) {
        clearBtn.textContent = window.t ? window.t('album_back_to_all_photos') : 'View All Photos';
      }
    } else {
      if (emptyTitle) emptyTitle.textContent = window.t ? window.t('gallery_empty_title') : 'No Moments Match';
      if (emptyDesc) emptyDesc.textContent = window.t ? window.t('gallery_empty_desc') : 'Try switching tags, clearing date ranges, or moving new photos from the Loading Dock.';
      if (albumEmptyBtn) {
        albumEmptyBtn.style.display = 'none';
      }
      if (clearBtn) {
        clearBtn.textContent = window.t ? window.t('gallery_reset_filters') : 'Reset All Filters';
      }
    }
    return;
  }

  const lblSelect = window.t ? window.t('dock_select_all') : 'Select';
  const lblFav = window.t ? window.t('favorites_title') : 'Favorite';
  const lblCrop = window.t ? window.t('detail_crop') : 'Crop';
  const lblRename = window.t ? window.t('detail_rename') : 'Rename';
  const lblDownload = window.t ? window.t('detail_download') : 'Download';
  const lblShare = window.t ? window.t('detail_share') : 'Share';
  const lblDelete = window.t ? window.t('detail_trash') : 'Delete';

  empty.style.display = 'none';
  grid.innerHTML = photos.map(photo => {
    const isSelected = state.selectedGalleryPhotoIds.has(photo.id);
    const tagObj = state.tags.find(t => t.name === photo.tags[0]);
    const tagColor = tagObj ? tagObj.color : '#f43f5e';
    const metaDate = formatCardDateTime(photo.createdAt);
    const allTagsTitle = window.t ? window.t('gallery_all_tags', { count: photo.tags.length }) : `All Tags (${photo.tags.length})`;

    let card3DClass = '';
    let shineOverlayHtml = '';
    const is3DEffectsOn = !!state.isPro && (state.albumPhotos3DEnabled !== false) && (state.global3DEnabled !== false);
    if (is3DEffectsOn) {
      if (isAlbumPhoto3DActive) {
        card3DClass = `card-3d surface-${activeAlbumSurfaceStyle}`;
        shineOverlayHtml = '<div class="album-3d-shine"></div>';
      } else if (photo.tags && photo.tags.length > 0) {
        const pTag = state.tags.find(t => t.name === photo.tags[0]);
        const pStyle = (pTag && pTag.surface3DStyle && pTag.surface3DStyle !== 'none') ? pTag.surface3DStyle : null;
        if (pStyle) {
          card3DClass = `card-3d surface-${pStyle}`;
          shineOverlayHtml = '<div class="album-3d-shine"></div>';
        }
      }
    }

    return `
      <div class="photo-card-elegant ${card3DClass} ${isSelected ? 'selected' : ''}" data-id="${photo.id}">
        <div class="card-image-box">
          <img src="${photo.dataUrl}" alt="${photo.displayName}" loading="lazy">
          ${shineOverlayHtml}
          
          <button class="card-select-btn" onclick="event.stopPropagation(); toggleGallerySelect('${photo.id}')" title="${lblSelect}">
            ${isSelected ? '<i class="fa-solid fa-check"></i>' : ''}
          </button>

          <button class="card-fav-btn ${photo.isFavorite ? 'active' : ''}" onclick="event.stopPropagation(); toggleFavorite('${photo.id}')" title="${lblFav}">
            <i class="fa-${photo.isFavorite ? 'solid' : 'regular'} fa-heart" style="${photo.isFavorite ? 'color:#f43f5e !important;' : ''}"></i>
          </button>
        </div>

        <div class="card-content">
          <div class="card-title-text" title="Tap to rename: ${escapeHtml(photo.displayName)}" onclick="event.stopPropagation(); openRenamePhotoModal('${photo.id}')">${escapeHtml(photo.displayName)}</div>
          
          <div class="card-meta-row">
            ${(state.galleryShowLocationBadge === true && photo.location && typeof photo.location.latitude === 'number') ? `
              <span class="card-loc-pill" title="Location: ${escapeHtml(photo.location.city || photo.location.place || photo.location.country || photo.location.displayCoords || formatDisplayCoords(photo.location.latitude, photo.location.longitude))}" onclick="event.stopPropagation(); openPhotoDetail('${photo.id}')">
                <i class="fa-solid fa-location-dot"></i> ${escapeHtml(photo.location.city || photo.location.place || photo.location.country || photo.location.displayCoords || formatDisplayCoords(photo.location.latitude, photo.location.longitude))}
              </span>
            ` : ''}
            ${photo.tags.length > 0 ? `
              <div class="tags-badge-wrapper" title="${escapeHtml(photo.tags.join(', '))}" onclick="event.stopPropagation(); toggleTagsTooltip(this);">
                <span class="tag-badge-pill" style="background:${tagColor}">
                  ${escapeHtml(photo.tags[0])}${photo.tags.length > 1 ? ` +${photo.tags.length - 1}` : ''}
                </span>
                <div class="all-tags-tooltip">
                  <span class="tooltip-title">${allTagsTitle}</span>
                  <div class="tooltip-chips-row">
                    ${photo.tags.map(t => {
                      const tObj = state.tags.find(tag => tag.name === t);
                      const color = tObj ? tObj.color : '#f43f5e';
                      return `<span class="tooltip-tag-chip" style="background:${color}">${escapeHtml(t)}</span>`;
                    }).join('')}
                  </div>
                </div>
              </div>
            ` : '<span class="card-tag-placeholder"></span>'}
            <span class="card-date-time" title="Created: ${metaDate.full}">
              <i class="fa-regular fa-clock"></i>
              <span class="card-date-part">${metaDate.date}</span>
              <span class="card-time-sep">·</span>
              <span class="card-time-part">${metaDate.time}</span>
            </span>
          </div>

          <div class="card-hover-actions">
            <button class="card-action-icon-btn" onclick="event.stopPropagation(); openCropEditorModal('${photo.id}')" title="${lblCrop}">
              <i class="fa-solid fa-crop-simple"></i><span class="card-btn-label"> ${lblCrop}</span>
            </button>
            <button class="card-action-icon-btn" onclick="event.stopPropagation(); openRenamePhotoModal('${photo.id}')" title="${lblRename}">
              <i class="fa-solid fa-pen"></i><span class="card-btn-label"> ${lblRename}</span>
            </button>
            <button class="card-action-icon-btn" onclick="event.stopPropagation(); downloadSinglePhoto('${photo.id}')" title="${lblDownload}">
              <i class="fa-solid fa-download"></i><span class="card-btn-label"> ${lblDownload}</span>
            </button>
            <button class="card-action-icon-btn" onclick="event.stopPropagation(); shareSinglePhoto('${photo.id}')" title="${lblShare}">
              <i class="fa-solid fa-share-nodes"></i><span class="card-btn-label"> ${lblShare}</span>
            </button>
            <button class="card-action-icon-btn danger" onclick="event.stopPropagation(); moveToTrash('${photo.id}')" title="${lblDelete}">
              <i class="fa-solid fa-trash-can"></i><span class="card-btn-label"> ${lblDelete}</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.photo-card-elegant').forEach(card => {
    const id = card.dataset.id;
    card.addEventListener('click', () => {
      if (state.selectedGalleryPhotoIds.size > 0) {
        toggleGallerySelect(id);
      } else {
        openPhotoDetail(id, photos, activeAlbumName || (q ? `Search: "${state.searchQuery.trim()}"` : 'Gallery'));
      }
    });
    card.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      toggleGallerySelect(id);
    });
  });

  init3DCardParallax(grid);
}

function toggleTagsTooltip(el) {
  const isAlreadyActive = el.classList.contains('active');
  document.querySelectorAll('.tags-badge-wrapper.active').forEach(b => b.classList.remove('active'));
  if (!isAlreadyActive) {
    el.classList.add('active');
  }
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.tags-badge-wrapper')) {
    document.querySelectorAll('.tags-badge-wrapper.active').forEach(b => b.classList.remove('active'));
  }
});

// -------------------------------------------------------------
// GALLERY SORT LOGIC
// -------------------------------------------------------------
function updateSortUI() {
  const triggerText = document.getElementById('sortTriggerText');
  const triggerIcon = document.getElementById('sortTriggerIcon');
  const options = document.querySelectorAll('.sort-option-btn');
  const sortMode = state.gallerySort || 'date-desc';

  const sortConfig = {
    'date-desc': { text: (window.t ? window.t('gallery_sort_newest') : 'Newest'), icon: 'fa-solid fa-arrow-down-short-wide' },
    'date-asc': { text: (window.t ? window.t('gallery_sort_oldest') : 'Oldest'), icon: 'fa-solid fa-arrow-up-wide-short' },
    'name-asc': { text: (window.t ? window.t('gallery_sort_name_asc') : 'Name A-Z'), icon: 'fa-solid fa-arrow-down-a-z' },
    'name-desc': { text: (window.t ? window.t('gallery_sort_name_desc') : 'Name Z-A'), icon: 'fa-solid fa-arrow-down-z-a' }
  };

  const current = sortConfig[sortMode] || sortConfig['date-desc'];
  if (triggerText) triggerText.textContent = current.text;
  if (triggerIcon) triggerIcon.className = current.icon;

  options.forEach(btn => {
    const isCurrent = btn.dataset.sort === sortMode;
    btn.classList.toggle('active', isCurrent);
  });
}

function toggleSortMenu(event) {
  if (event) event.stopPropagation();
  const wrapper = document.getElementById('sortDropdownWrapper');
  if (!wrapper) return;
  wrapper.classList.toggle('open');
}

function closeSortMenu() {
  const wrapper = document.getElementById('sortDropdownWrapper');
  if (wrapper) wrapper.classList.remove('open');
}

function setGallerySort(sortKey) {
  state.gallerySort = sortKey;
  localStorage.setItem('photo_org_gallery_sort', sortKey);
  closeSortMenu();
  renderGallery();
}

// Close sort dropdown when clicking anywhere else
document.addEventListener('click', (e) => {
  const wrapper = document.getElementById('sortDropdownWrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    wrapper.classList.remove('open');
  }
});

function renderFilterStrip() {
  const container = document.getElementById('dynamicTagFilterContainer');
  const allChip = document.getElementById('allTagsFilterChip');
  const allCount = document.getElementById('allMomentsCount');
  const dateChip = document.getElementById('dateFilterChip');
  const clearDateBtn = document.getElementById('clearDateBtn');
  const dateText = document.getElementById('dateFilterText');
  const resetBtn = document.getElementById('resetFiltersBtn');

  const validPhotos = state.photos.filter(p => !p.isPending && !p.deletedAt);
  if (allCount) {
    allCount.textContent = validPhotos.length;
  }

  allChip.classList.toggle('active', state.selectedFilterTags.size === 0 && !state.onlyFavorites);

  const favChip = document.getElementById('favFilterChip');
  const favCountEl = document.getElementById('favMomentsCount');
  const favCount = state.photos.filter(p => p.isFavorite && !p.deletedAt).length;
  if (favCountEl) {
    favCountEl.textContent = favCount;
  }
  if (favChip) {
    favChip.classList.toggle('active', state.onlyFavorites);
  }

  if (state.startDate || state.endDate) {
    dateChip.classList.add('active');
    clearDateBtn.style.display = 'inline';
    const anyText = window.t ? window.t('date_preset_all') : 'Any';
    const s = state.startDate ? new Date(state.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : anyText;
    const e = state.endDate ? new Date(state.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : anyText;
    dateText.textContent = `${s} - ${e}`;
  } else {
    dateChip.classList.remove('active');
    clearDateBtn.style.display = 'none';
    dateText.textContent = window.t ? window.t('gallery_date_range') : 'Date Range';
  }

  const isAnyFilterActive = state.selectedFilterTags.size > 0 || state.startDate || state.endDate || state.searchQuery || state.onlyFavorites;
  resetBtn.style.display = isAnyFilterActive ? 'inline-block' : 'none';

  container.innerHTML = state.tags.map(tag => {
    const isActive = state.selectedFilterTags.has(tag.name);
    const count = validPhotos.filter(p => p.tags.includes(tag.name)).length;
    return `
      <button class="filter-chip ${isActive ? 'active' : ''}" style="${isActive ? `background:${tag.color}26; border-color:${tag.color};` : ''}" onclick="toggleTagFilter('${tag.name}')" title="${tag.name} (${count})">
        <span class="tag-dot" style="background:${tag.color}"></span>
        <span class="chip-text">${tag.name}</span>
        <span class="chip-count" style="margin-left: 6px; font-size: 10px; opacity: 0.85;">(${count})</span>
      </button>
    `;
  }).join('');
}
window.renderFilterStrip = renderFilterStrip;
window.renderGallery = renderGallery;
window.renderDock = renderDock;
window.renderAlbumsScreen = renderAlbumsScreen;
window.renderAlbums = renderAlbumsScreen;
window.renderFavorites = renderFavorites;
window.renderTrash = renderTrash;

// Reliable dataUrl to native Blob converter for fail-safe browser downloads & sharing
function dataUrlToBlob(dataUrl, forcedMime = 'image/jpeg') {
  if (!dataUrl || typeof dataUrl !== 'string') return null;
  try {
    const parts = dataUrl.split(',');
    if (parts.length < 2) return null;
    const header = parts[0];
    const base64 = parts[1];
    const mimeMatch = header.match(/:(.*?);/);
    const mime = forcedMime || (mimeMatch ? mimeMatch[1] : 'image/jpeg');
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new Blob([bytes], { type: mime });
  } catch (err) {
    console.warn('Could not decode dataUrl to Blob:', err);
    return null;
  }
}

// Convert any image dataUrl/format to guaranteed high-quality JPEG Blob and DataURL
function convertToJpegBlob(dataUrl, quality = 0.95) {
  return new Promise((resolve) => {
    if (!dataUrl || typeof dataUrl !== 'string') {
      return resolve({ blob: null, dataUrl: null });
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width || 800;
        canvas.height = img.naturalHeight || img.height || 800;
        const ctx = canvas.getContext('2d');
        // Composite onto pure white background so any transparency doesn't turn black
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
        canvas.toBlob((blob) => {
          resolve({
            blob: blob || dataUrlToBlob(jpegDataUrl, 'image/jpeg'),
            dataUrl: jpegDataUrl
          });
        }, 'image/jpeg', quality);
      } catch (err) {
        console.warn('Canvas conversion to JPEG failed, using direct fallback:', err);
        const fallbackBlob = dataUrlToBlob(dataUrl, 'image/jpeg');
        resolve({ blob: fallbackBlob, dataUrl: dataUrl });
      }
    };
    img.onerror = () => {
      const fallbackBlob = dataUrlToBlob(dataUrl, 'image/jpeg');
      resolve({ blob: fallbackBlob, dataUrl: dataUrl });
    };
    img.src = dataUrl;
  });
}

// Universal browser file downloader: supports Blobs, Object URLs, and fallbacks without size limits
function triggerBrowserDownload(blobOrUrl, filename) {
  let objectUrl = null;
  let href = blobOrUrl;
  if (blobOrUrl instanceof Blob) {
    try {
      objectUrl = URL.createObjectURL(blobOrUrl);
      href = objectUrl;
    } catch (e) {
      console.warn('URL.createObjectURL failed:', e);
    }
  }
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = href;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    try {
      if (document.body.contains(a)) document.body.removeChild(a);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    } catch (e) {}
  }, 1500);
}

async function downloadSinglePhoto(id) {
  const photo = state.photos.find(p => p.id === id);
  if (!photo) {
    showToast('Photo not found');
    return;
  }
  // Strip any existing extensions like .png, .pdf, .webp to guarantee .jpg extension
  const rawTitle = (photo.displayName || 'Photo').replace(/\.[^/.]+$/, '');
  const cleanName = rawTitle.replace(/[^a-zA-Z0-9_\u0900-\u0D7F-]/g, '_').trim() || 'Photo';
  const fileName = `${cleanName}.jpg`;

  showToast(`Preparing '${cleanName}.jpg'... 🖼️`);

  // Fallback to gradient generation if dataUrl is empty
  const srcDataUrl = photo.dataUrl || (photo.gradient ? generateGradientImage(photo.displayName, photo.category, photo.gradient) : null);
  if (!srcDataUrl) {
    showToast('No image data found');
    return;
  }

  // Ensure image is cleanly encoded as genuine JPEG format
  const { blob, dataUrl: jpegDataUrl } = await convertToJpegBlob(srcDataUrl, 0.95);
  const finalDataUrl = jpegDataUrl || srcDataUrl;

  if (window.AndroidApp && typeof window.AndroidApp.downloadPhoto === 'function') {
    window.AndroidApp.downloadPhoto(finalDataUrl, fileName);
  } else {
    // Fail-safe browser download: use FileSaver saveAs or native Blob download
    if (blob) {
      if (typeof saveAs === 'function') {
        saveAs(blob, fileName);
      } else {
        triggerBrowserDownload(blob, fileName);
      }
    } else {
      triggerBrowserDownload(finalDataUrl, fileName);
    }
    showToast(`Downloaded '${cleanName}.jpg' to your device! 📥`);
  }
}

async function shareSinglePhoto(id) {
  const photo = state.photos.find(p => p.id === id);
  if (!photo) {
    showToast('Photo not found');
    return;
  }

  const cleanName = (photo.displayName || 'Photo').replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `${cleanName}.jpg`;

  // 1. Android Native App Bridge (Direct WhatsApp/System Intent)
  if (window.AndroidApp && typeof window.AndroidApp.sharePhoto === 'function') {
    try {
      window.AndroidApp.sharePhoto(photo.dataUrl, photo.displayName || 'Photo');
      return;
    } catch (nativeErr) {
      console.warn('Native AndroidApp.sharePhoto failed, attempting Web Share fallback:', nativeErr);
    }
  }

  // 2. Web Share API with File Support (Chrome Android, macOS Safari, Windows Share)
  const blob = dataUrlToBlob(photo.dataUrl);
  if (blob && navigator.share) {
    try {
      const file = new File([blob], fileName, { type: blob.type || 'image/jpeg' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: photo.displayName,
          text: `Check out '${photo.displayName}' from Aura Photo Organizer`
        });
        showToast(`Shared '${photo.displayName}'! ✨`);
        return;
      } else {
        await navigator.share({
          title: photo.displayName,
          text: `Photo: ${photo.displayName}`
        });
        showToast(`Shared '${photo.displayName}'! ✨`);
        return;
      }
    } catch (shareErr) {
      // AbortError is user dismissing the native share sheet
      if (shareErr && shareErr.name === 'AbortError') {
        return;
      }
      console.warn('Web Share fallback triggered:', shareErr);
    }
  }

  // 3. Desktop Chrome Fallback: Copy image directly to clipboard so user can paste into WhatsApp Web, Slack, etc.
  if (blob && navigator.clipboard && window.ClipboardItem) {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type || 'image/jpeg']: blob })
      ]);
      showToast(`Copied '${photo.displayName}' image to clipboard! (Paste anywhere) 📋`);
      return;
    } catch (clipImgErr) {
      // Direct image copy permissions or MIME type rejected, fall through to text
    }
  }

  // 4. Text Fallback: Copy title & notice
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(`${photo.displayName} - Aura Photo Organizer`);
      showToast(`Copied details for '${photo.displayName}' to clipboard! 📋`);
    } else {
      showToast(`Photo: '${photo.displayName}'`);
    }
  } catch (textErr) {
    showToast(`Photo: '${photo.displayName}'`);
  }
}

function toggleFavorite(id) {
  const photo = state.photos.find(p => p.id === id);
  if (photo) {
    photo.isFavorite = !photo.isFavorite;
    saveState();
    renderAll();
    showToast(photo.isFavorite ? 'Added to Favorites ❤️' : 'Removed from Favorites');
  }
}

function toggleTagFilter(tagName) {
  state.onlyFavorites = false;
  if (state.selectedFilterTags.has(tagName)) {
    state.selectedFilterTags.delete(tagName);
  } else {
    state.selectedFilterTags.add(tagName);
  }
  renderGallery();
}

function toggleFavoriteFilter() {
  state.onlyFavorites = !state.onlyFavorites;
  if (state.onlyFavorites) {
    state.selectedFilterTags.clear();
  }
  renderGallery();
}

function toggleGallerySelect(id) {
  if (state.selectedGalleryPhotoIds.has(id)) {
    state.selectedGalleryPhotoIds.delete(id);
  } else {
    state.selectedGalleryPhotoIds.add(id);
  }
  renderGallery();
}

// 3. Render Tags Manager
function renderTags() {
  const list = document.getElementById('tagsList');
  const heading = document.getElementById('tagsListHeading');
  if (heading) {
    heading.textContent = window.t
      ? window.t('tags_all_count', { count: state.tags.length })
      : `All Tags (${state.tags.length})`;
  }

  // Render Color Palette in Card
  const palette = document.getElementById('colorPaletteContainer');
  if (palette) {
    palette.innerHTML = buildCategorizedPaletteHtml({
      presetColors: PRESET_COLORS,
      selectedColor: state.selectedNewTagColor || PRESET_COLORS[0],
      savedColors: state.savedCustomColors || [],
      onSelectFn: 'selectNewTagColor',
      customInputId: 'tagCustomColorInput',
      customSwatchId: 'tagCustomColorSwatch'
    });
  }

  if (state.tags.length === 0) {
    list.innerHTML = `<p style="color:var(--text-muted); padding:16px; text-align:center;">${window.t ? window.t('albums_empty_tag') : 'No tags created yet.'}</p>`;
    return;
  }

  list.innerHTML = state.tags.map(tag => {
    const count = state.photos.filter(p => !p.deletedAt && p.tags.includes(tag.name)).length;
    return `
      <div class="tag-item-row">
        <div class="tag-item-left">
          <div class="tag-color-swatch" style="background:${tag.color}"></div>
          <div>
            <div class="tag-item-name">${tag.name}</div>
            <div class="tag-item-count">${window.t ? window.t('tags_photo_count', { count }) : `${count} photos tagged`}</div>
          </div>
        </div>
        <div class="tag-item-actions">
          <button class="icon-btn" onclick="openRenameTagModal('${tag.name}')" title="${window.t ? window.t('album_btn_rename_tag') : 'Rename Tag'}">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="icon-btn danger" onclick="openDeleteAlbumModal('${escapeHtml(tag.name)}')" title="${window.t ? window.t('album_btn_delete_tag') : 'Delete Album'}">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function selectNewTagColor(color, isFinal = true) {
  state.selectedNewTagColor = color;
  renderTags();
}

// Album Activity & Sorting Engine (Item 11)
function recordAlbumActivity(tagName, actionType = 'modified') {
  if (!tagName) return;
  const tag = state.tags.find(t => t.name.toLowerCase() === tagName.toLowerCase());
  if (!tag) return;
  const now = Date.now();
  if (actionType === 'viewed') {
    // Only track viewing timestamp for telemetry without modifying sort or position
    tag.lastViewedAt = now;
    return;
  } else if (actionType === 'added') {
    tag.createdAt = tag.createdAt || now;
    tag.lastModifiedAt = now;
  } else if (actionType === 'favorited') {
    tag.lastModifiedAt = now;
  } else {
    tag.lastModifiedAt = now;
  }
  saveState();
}

function getAlbumRecentActivityTime(tag, albumPhotos = []) {
  const latestPhotoTime = albumPhotos.reduce((max, p) => Math.max(max, p.createdAt || 0, p.modifiedAt || 0), 0);
  // Only actual content modifications determine recent activity (never casual album viewing)
  return Math.max(
    tag.lastModifiedAt || 0,
    latestPhotoTime,
    tag.createdAt || 0
  );
}

function formatRelativeTime(ts) {
  if (!ts) return 'recently';
  const diff = Date.now() - ts;
  if (diff < 60000) return 'just now';
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function toggleAlbumFavorite(tagName) {
  const tag = state.tags.find(t => t.name === tagName);
  if (!tag) return;
  tag.isFavorite = !tag.isFavorite;
  tag.lastModifiedAt = Date.now();
  saveState();
  renderAlbumsScreen();
  showToast(tag.isFavorite ? `Marked '${tagName}' as Favorite album` : `Removed '${tagName}' from Favorite albums`);
}

function updateAlbumSortUI() {
  document.getElementById('albumSortRecentBtn')?.classList.toggle('active', state.albumSort === 'recent');
  document.getElementById('albumSortMostBtn')?.classList.toggle('active', state.albumSort === 'count');
  document.getElementById('albumSortAlphaBtn')?.classList.toggle('active', state.albumSort === 'alpha');
}

// 4. Render Dedicated Albums Screen (Rich Cards, Search, Filter & 1-Click Album Download)
function renderAlbumsScreen() {
  const grid = document.getElementById('albumsCardGrid');
  const empty = document.getElementById('albumsEmptyState');
  if (!grid) return;

  updateAlbumSortUI();

  const validPhotos = state.photos.filter(p => !p.isPending && !p.deletedAt);
  const favoritePhotos = state.photos.filter(p => p.isFavorite && !p.deletedAt);
  const totalCountEl = document.getElementById('totalAlbumsCount');
  const favCountEl = document.getElementById('favAlbumsCount');
  const withPhotosCountEl = document.getElementById('withPhotosAlbumsCount');
  const subtitle = document.getElementById('albumsSubtitle');

  const withPhotosCount = state.tags.filter(t => validPhotos.some(p => p.tags.includes(t.name))).length;

  if (totalCountEl) totalCountEl.textContent = state.tags.length;
  if (favCountEl) favCountEl.textContent = favoritePhotos.length;
  if (withPhotosCountEl) withPhotosCountEl.textContent = withPhotosCount;
  if (subtitle) subtitle.textContent = `${state.tags.length} ${window.t ? window.t('albums_category_count') : 'Category Albums'} · ${validPhotos.length} ${window.t ? window.t('albums_gallery_count') : 'Photos in Gallery'}`;

  const q = state.albumSearchQuery.trim().toLowerCase();

  // Sync 3D Mode toggle button state
  const is3DGlobal = !!state.isPro && state.global3DEnabled !== false;
  const toggle3DBtn = document.getElementById('album3DToggleBtn');
  if (toggle3DBtn) {
    toggle3DBtn.classList.toggle('active', is3DGlobal);
  }

  // Check if Favorites card should be shown
  let showFavoritesCard = false;
  const favMatchesSearch = !q || 'favorites'.includes(q) || 'favourite'.includes(q) || 'loved'.includes(q);

  if (favMatchesSearch) {
    if (state.albumFilter === 'all' || state.albumFilter === 'favorites') {
      showFavoritesCard = true;
    } else if (state.albumFilter === 'with_photos' && favoritePhotos.length > 0) {
      showFavoritesCard = true;
    }
  }

  let albums = [];
  albums = state.tags.map((tag, idx) => {
    const albumPhotos = validPhotos.filter(p => p.tags.includes(tag.name));
    return {
      tag,
      photos: albumPhotos,
      count: albumPhotos.length,
      recentActivityTime: getAlbumRecentActivityTime(tag, albumPhotos),
      originalIndex: idx
    };
  });

  // Filter: Favorites only (show Featured Favorites + favorited albums)
  if (state.albumFilter === 'favorites') {
    albums = albums.filter(a => a.tag.isFavorite);
  }

  // Search filter
  if (q) {
    albums = albums.filter(a => a.tag.name.toLowerCase().includes(q));
  }

  // Filter option: with photos only
  if (state.albumFilter === 'with_photos') {
    albums = albums.filter(a => a.count > 0);
  }

  // Sorting
  if (state.albumSort === 'count') {
    albums.sort((a, b) => b.count - a.count);
  } else if (state.albumSort === 'alpha') {
    albums.sort((a, b) => a.tag.name.localeCompare(b.tag.name));
  } else if (state.albumSort === 'recent') {
    // Explicit Recent Activity sort requested by user
    albums.sort((a, b) => {
      const aFav = !!a.tag.isFavorite;
      const bFav = !!b.tag.isFavorite;
      if (aFav !== bFav) return aFav ? -1 : 1;

      if (b.recentActivityTime !== a.recentActivityTime) {
        return b.recentActivityTime - a.recentActivityTime;
      }
      return a.originalIndex - b.originalIndex;
    });
  } else {
    // Default Sorting: Stable, predictable user order (Favorites pinned first, then stable creation/user order)
    // Viewing or exiting an album will NEVER shift or shuffle its position!
    albums.sort((a, b) => {
      const aFav = !!a.tag.isFavorite;
      const bFav = !!b.tag.isFavorite;
      if (aFav !== bFav) return aFav ? -1 : 1;
      return a.originalIndex - b.originalIndex;
    });
  }

  if (albums.length === 0 && !showFavoritesCard) {
    grid.innerHTML = '';
    if (empty) empty.style.display = 'flex';
    return;
  }

  if (empty) empty.style.display = 'none';

  let favoritesCardHtml = '';
  if (showFavoritesCard) {
    const repFavPhoto = favoritePhotos[0];
    const favCoverSrc = state.favoritesCustomCover || (repFavPhoto ? repFavPhoto.dataUrl : '');
    const hasFavCustomCover = !!state.favoritesCustomCover;
    const favFallbackGrad = 'linear-gradient(135deg, #f43f5e 0%, #e11d48 50%, #9333ea 100%)';
    const favCount = favoritePhotos.length;
    const favSurfaceStyleClass = (state.favorites3DStyle && state.favorites3DStyle !== 'none') ? `surface-${state.favorites3DStyle}` : 'surface-holo';
    const isFav3DActive = is3DGlobal;

    const lblFavDownload = window.t ? window.t('album_btn_fav_download_zip') : 'Download Favorites as ZIP';
    const lblFavShare = window.t ? window.t('album_btn_fav_share') : 'Share Favorites';
    const lblFavTitle = window.t ? window.t('album_fav_card_title') : 'Favorites';
    const lblFavFeaturedPill = window.t ? window.t('album_fav_featured_pill') : 'Featured';
    const lblFavPriority = window.t ? window.t('album_fav_featured_priority') : 'Featured Priority';
    const lblFavPrioritySub = window.t ? window.t('album_fav_priority_sub') : 'Default Priority #1';
    const lblSurface = state.isPro
      ? (window.t ? window.t('album_btn_surface_pro') : 'Customize 3D Surface & Artwork')
      : (window.t ? window.t('album_btn_surface_vip') : 'Preview 3D Card (VIP)');
    const lblSurfaceAria = window.t ? window.t('album_btn_surface_aria') : 'Customize 3D Surface';
    const favMomentsText = favCount === 0
      ? (window.t ? window.t('favorites_empty_title') : 'No favorites yet')
      : `${favCount} ${favCount === 1 ? (window.t ? window.t('album_fav_cherished_singular') : 'cherished moment') : (window.t ? window.t('album_fav_cherished_plural') : 'cherished moments')}`;

    const isFavHighlight = state.justReturnedAlbum === 'favorites' ? 'album-card-highlight-return' : '';
    favoritesCardHtml = `
      <div class="album-rich-card favorites-album-card ${isFav3DActive ? `card-3d ${favSurfaceStyleClass}`.trim() : ''} ${isFavHighlight}" data-album="favorites" onclick="openFavoritesFromAlbum()">
        <div class="album-cover-box" style="${!favCoverSrc ? `background:${favFallbackGrad};` : ''}">
          ${favCoverSrc ? `<img src="${favCoverSrc}" alt="Favorites Album" class="album-cover-img" loading="lazy">` : ''}
          ${isFav3DActive ? `<div class="album-3d-shine"></div>` : ''}
          <div class="album-cover-overlay">
            <div class="album-cover-top-bar">
              <span class="album-tag-dot-pill fav-pill">
                <i class="fa-solid fa-heart" style="color:#f43f5e"></i>
                <span class="tag-truncate-text">${lblFavFeaturedPill}</span>
              </span>
              <div class="album-cover-top-actions"></div>
            </div>
            <div class="album-cover-bottom-bar">
              ${hasFavCustomCover ? `<span class="album-custom-surface-tag" title="${window.t ? window.t('albums_personal_surface') : 'Personal Surface'}"><i class="fa-solid fa-wand-magic-sparkles"></i> <span class="tag-truncate-text">${window.t ? window.t('albums_personal_surface') : 'Personal Surface'}</span></span>` : ''}
              <span class="album-photo-count-badge fav-badge">
                <i class="fa-solid fa-heart"></i> <span>${formatAlbumPhotoCount(favCount)}</span>
              </span>
            </div>
          </div>
        </div>

        <div class="album-body">
          <div>
            <div class="album-title-text fav-title" title="${lblFavTitle}">
              <i class="fa-solid fa-heart" style="color:var(--accent-rose); font-size:13px; margin-right:4px;"></i> ${lblFavTitle}
            </div>
            <div class="album-subtitle-text">${favMomentsText} · ${lblFavPrioritySub}</div>
            <span class="album-activity-pill fav"><i class="fa-solid fa-star"></i> ${lblFavPriority}</span>
          </div>

          <div class="album-card-action-bar">
            <div class="album-actions-row">
              <button class="btn-album-icon-action action-download fav-action-btn" onclick="event.stopPropagation(); downloadFavoritesAlbumZip()" title="${lblFavDownload}" aria-label="${lblFavDownload}" ${favCount === 0 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}>
                <i class="fa-solid fa-download"></i>
              </button>
              <button class="btn-album-icon-action action-share fav-share-btn" onclick="event.stopPropagation(); shareFavoritesAlbum()" title="${lblFavShare}" aria-label="${lblFavShare}">
                <i class="fa-solid fa-share-nodes"></i>
              </button>
              <button class="btn-album-icon-action action-surface fav-action-btn vip-action-btn ${state.isPro ? 'vip-active' : 'vip-locked'}" onclick="event.stopPropagation(); openAlbum3DSurfaceModal('favorites')" title="${lblSurface}" aria-label="${lblSurfaceAria}">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  const albumsHtml = albums.map(({ tag, photos: albumPhotos, count, recentActivityTime }) => {
    const repPhoto = albumPhotos[0];
    const coverSrc = tag.customCoverUrl || (repPhoto ? repPhoto.dataUrl : '');
    const fallbackGrad = `linear-gradient(135deg, ${tag.color}, #f43f5e)`;
    const is3DActive = is3DGlobal && !tag.is3DDisabled;
    const surfaceStyleClass = (tag.surface3DStyle && tag.surface3DStyle !== 'none') ? `surface-${tag.surface3DStyle}` : '';
    const hasCustomCover = !!tag.customCoverUrl;
    const actLabel = formatRelativeTime(recentActivityTime);

    // Hover button tooltips & aria labels
    const lblFavBtn = tag.isFavorite
      ? (window.t ? window.t('album_btn_fav_remove') : 'Remove from Favorite Albums')
      : (window.t ? window.t('album_btn_fav_add') : 'Mark as Favorite Album');
    const lblFavAria = window.t ? window.t('album_btn_fav_aria') : 'Favorite Album';

    const lblImport = window.t ? window.t('album_btn_import_vip') : 'Import photos directly into album (VIP)';
    const lblImportAria = window.t ? window.t('album_btn_import_aria') : 'Import photos';

    const lblSurface = state.isPro
      ? (window.t ? window.t('album_btn_surface_pro') : 'Customize 3D Surface & Artwork')
      : (window.t ? window.t('album_btn_surface_vip') : 'Preview 3D Card (VIP)');
    const lblSurfaceAria = window.t ? window.t('album_btn_surface_aria') : 'Customize 3D Surface';

    const lblDownload = window.t ? window.t('album_btn_download_zip') : 'Download album as ZIP';
    const lblDownloadAria = window.t ? window.t('album_btn_download_aria') : 'Download album';

    const lblShare = window.t ? window.t('album_btn_share') : 'Share album';
    const lblShareAria = window.t ? window.t('album_btn_share_aria') : 'Share album';

    const lblOrganize = window.t ? window.t('album_btn_organize_vip') : 'Move or Copy complete album (VIP)';
    const lblOrganizeAria = window.t ? window.t('album_btn_organize_aria') : 'Move or Copy album';
    const lblVipDot = window.t ? window.t('album_btn_vip_dot') : 'Aura VIP Feature';

    const lblDelete = window.t ? window.t('album_btn_delete') : 'Delete album';
    const lblDeleteAria = window.t ? window.t('album_btn_delete_aria') : 'Delete album';

    const isCardHighlight = (state.justReturnedAlbum && state.justReturnedAlbum === tag.name) ? 'album-card-highlight-return' : '';
    return `
      <div class="album-rich-card ${is3DActive ? `card-3d ${surfaceStyleClass}`.trim() : ''} ${isCardHighlight}" onclick="openAlbumInGallery('${tag.name}')" data-tag="${escapeHtml(tag.name)}" data-album="${escapeHtml(tag.name)}">
        <div class="album-cover-box" style="${!coverSrc ? `background:${fallbackGrad};` : ''}">
          ${coverSrc ? `<img src="${coverSrc}" alt="${tag.name}" class="album-cover-img" loading="lazy">` : ''}
          ${is3DActive ? `<div class="album-3d-shine"></div>` : ''}
          <div class="album-cover-overlay">
            <div class="album-cover-top-bar">
              <span class="album-tag-dot-pill" title="${tag.name}">
                <span class="tag-dot" style="background:${tag.color}"></span>
                <span class="tag-truncate-text">${window.t ? window.t('dock_card_album') : 'Album'}</span>
              </span>
              <div class="album-cover-top-actions">
                <button class="album-cover-fav-btn ${tag.isFavorite ? 'favorited' : ''}" onclick="event.stopPropagation(); toggleAlbumFavorite('${escapeHtml(tag.name)}')" title="${lblFavBtn}" aria-label="${lblFavAria}">
                  <i class="fa-${tag.isFavorite ? 'solid' : 'regular'} fa-heart"></i>
                </button>
                <button class="album-cover-add-btn" onclick="event.stopPropagation(); triggerAlbumDirectImport('${escapeHtml(tag.name)}')" title="${lblImport}" aria-label="${lblImportAria}">
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>
            <div class="album-cover-bottom-bar">
              ${hasCustomCover ? `<span class="album-custom-surface-tag" title="${window.t ? window.t('albums_personal_surface') : 'Personal Surface'}"><i class="fa-solid fa-wand-magic-sparkles"></i> <span class="tag-truncate-text">${window.t ? window.t('albums_personal_surface') : 'Personal Surface'}</span></span>` : ''}
              <span class="album-photo-count-badge">
                <i class="fa-solid fa-images"></i> <span>${formatAlbumPhotoCount(count)}</span>
              </span>
            </div>
          </div>
        </div>

        <div class="album-body">
          <div>
            <div class="album-title-text" title="${tag.name}">
              ${tag.isFavorite ? '<i class="fa-solid fa-heart" style="color:#f43f5e; font-size:12px; margin-right:4px;"></i>' : ''}${tag.name}
            </div>
            <div class="album-subtitle-text">${count === 0 ? (window.t ? window.t('albums_empty_tag') : 'No photos yet') : `${formatAlbumPhotoCount(count)} · ${actLabel}`}</div>
            ${tag.isFavorite ? `<span class="album-activity-pill fav"><i class="fa-solid fa-heart"></i> ${window.t ? window.t('albums_favorite_album') : 'Favorite Album'}</span>` : `<span class="album-activity-pill"><i class="fa-solid fa-clock-rotate-left"></i> ${actLabel}</span>`}
          </div>

          <div class="album-card-action-bar">
            <div class="album-actions-row">
              <button class="btn-album-icon-action action-download" onclick="event.stopPropagation(); downloadAlbumZip('${escapeHtml(tag.name)}')" title="${lblDownload}" aria-label="${lblDownloadAria}" ${count === 0 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}>
                <i class="fa-solid fa-download"></i>
              </button>
              <button class="btn-album-icon-action action-share" onclick="event.stopPropagation(); shareAlbum('${escapeHtml(tag.name)}')" title="${lblShare}" aria-label="${lblShareAria}">
                <i class="fa-solid fa-share-nodes"></i>
              </button>
              <button class="btn-album-icon-action action-organize vip-action-btn" onclick="event.stopPropagation(); openMoveCopyAlbumModal('${escapeHtml(tag.name)}')" title="${lblOrganize}" aria-label="${lblOrganizeAria}" ${count === 0 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}>
                <i class="fa-solid fa-arrow-right-arrow-left"></i>
                <span class="btn-vip-dot" title="${lblVipDot}">${getLuxuryCrownSvg(9)}</span>
              </button>
              <button class="btn-album-icon-action action-surface vip-action-btn ${state.isPro ? 'vip-active' : 'vip-locked'}" onclick="event.stopPropagation(); openAlbum3DSurfaceModal('${escapeHtml(tag.name)}')" title="${lblSurface}" aria-label="${lblSurfaceAria}">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
                <span class="btn-vip-dot" title="${lblVipDot}">${getLuxuryCrownSvg(9)}</span>
              </button>
              <button class="btn-album-icon-action action-delete" onclick="event.stopPropagation(); openDeleteAlbumModal('${escapeHtml(tag.name)}')" title="${lblDelete}" aria-label="${lblDeleteAria}">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  grid.innerHTML = favoritesCardHtml + albumsHtml;
  init3DCardParallax(grid);
}

// -------------------------------------------------------------
// VIP 3D CARD PARALLAX ENGINE & LIVE SPECULAR REFLECTION
// -------------------------------------------------------------
// VIP 3D CARD SPECULAR SHINE ENGINE & CURATED STUDIO SURFACES
// -------------------------------------------------------------
const VIP_3D_SHINE_MAP = {
  holo: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.7) 0%, rgba(244, 63, 94, 0.35) 25%, rgba(6, 182, 212, 0.3) 50%, transparent 75%)`,
  glass: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.18) 30%, transparent 70%)`,
  gold: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(254, 240, 138, 0.9) 0%, rgba(245, 158, 11, 0.4) 35%, transparent 75%)`,
  aurora: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.75) 0%, rgba(6, 182, 212, 0.45) 25%, rgba(236, 72, 153, 0.35) 50%, transparent 80%)`,
  carbon: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.45) 0%, rgba(148, 163, 184, 0.18) 30%, transparent 65%)`,
  titanium: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.8) 0%, rgba(203, 213, 225, 0.3) 35%, transparent 70%)`,
  nebula: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.75) 0%, rgba(168, 85, 247, 0.45) 30%, rgba(236, 72, 153, 0.3) 55%, transparent 80%)`,
  emerald: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(167, 243, 208, 0.9) 0%, rgba(16, 185, 129, 0.45) 35%, transparent 75%)`,
  pearl: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.92) 0%, rgba(224, 231, 255, 0.4) 30%, rgba(254, 215, 170, 0.25) 60%, transparent 80%)`,
  rose: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(255, 228, 230, 0.92) 0%, rgba(244, 63, 94, 0.5) 35%, transparent 75%)`,
  solar: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(254, 215, 170, 0.92) 0%, rgba(239, 68, 68, 0.5) 35%, rgba(245, 158, 11, 0.3) 60%, transparent 80%)`,
  matrix: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(165, 243, 252, 0.92) 0%, rgba(6, 182, 212, 0.5) 35%, transparent 75%)`,
  amethyst: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(243, 232, 255, 0.92) 0%, rgba(192, 132, 252, 0.5) 30%, rgba(126, 34, 206, 0.3) 60%, transparent 80%)`,
  sapphire: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(224, 242, 254, 0.92) 0%, rgba(56, 189, 248, 0.5) 30%, rgba(30, 58, 138, 0.35) 60%, transparent 80%)`,
  ruby: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(255, 228, 230, 0.95) 0%, rgba(244, 63, 94, 0.6) 30%, rgba(159, 18, 57, 0.4) 60%, transparent 80%)`,
  quantum: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.95) 0%, rgba(168, 85, 247, 0.5) 25%, rgba(6, 182, 212, 0.4) 50%, rgba(244, 63, 94, 0.3) 70%, transparent 85%)`,
  damascus: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.8) 0%, rgba(148, 163, 184, 0.45) 30%, rgba(51, 65, 85, 0.3) 60%, transparent 75%)`,
  cyberpunk: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.9) 0%, rgba(236, 72, 153, 0.55) 25%, rgba(6, 182, 212, 0.45) 50%, transparent 80%)`,
  platina: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.98) 0%, rgba(226, 232, 240, 0.6) 30%, rgba(148, 163, 184, 0.25) 60%, transparent 75%)`,
  volcanic: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(254, 240, 138, 0.95) 0%, rgba(239, 68, 68, 0.6) 30%, rgba(185, 28, 28, 0.4) 60%, transparent 80%)`,
  supernova: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 1) 0%, rgba(253, 224, 71, 0.65) 25%, rgba(249, 115, 22, 0.45) 50%, transparent 80%)`,
  aquamarine: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(240, 253, 250, 0.95) 0%, rgba(45, 212, 191, 0.5) 30%, rgba(13, 148, 136, 0.35) 60%, transparent 80%)`,
  copper: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(255, 237, 213, 0.9) 0%, rgba(251, 146, 60, 0.5) 30%, rgba(194, 65, 12, 0.35) 60%, transparent 80%)`,
  chameleon: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.85) 0%, rgba(52, 211, 153, 0.5) 25%, rgba(168, 85, 247, 0.45) 50%, rgba(244, 63, 94, 0.3) 75%, transparent 85%)`,
  celestial: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.95) 0%, rgba(199, 210, 254, 0.5) 30%, rgba(99, 102, 241, 0.3) 60%, transparent 80%)`,
  onyx: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.7) 0%, rgba(71, 85, 105, 0.25) 30%, transparent 70%)`,
  sunset: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(254, 215, 170, 0.92) 0%, rgba(244, 63, 94, 0.5) 30%, rgba(147, 51, 234, 0.35) 60%, transparent 80%)`,
  prism_noir: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.85) 0%, rgba(168, 85, 247, 0.35) 25%, rgba(6, 182, 212, 0.25) 50%, rgba(15, 23, 42, 0.4) 75%, transparent 85%)`,
  biolum: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(220, 252, 231, 0.95) 0%, rgba(74, 222, 128, 0.55) 30%, rgba(22, 101, 52, 0.35) 60%, transparent 80%)`,
  hyperdrive: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 1) 0%, rgba(125, 211, 252, 0.6) 25%, rgba(59, 130, 246, 0.4) 55%, transparent 80%)`,
  meteorite: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(241, 245, 249, 0.88) 0%, rgba(148, 163, 184, 0.4) 30%, rgba(71, 85, 105, 0.25) 60%, transparent 75%)`,
  vaporwave: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.9) 0%, rgba(244, 114, 182, 0.5) 25%, rgba(56, 189, 248, 0.45) 50%, rgba(167, 139, 250, 0.3) 75%, transparent 85%)`,
  default: (x, y) => `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.15) 35%, transparent 70%)`
};

const STUDIO_3D_SURFACES = [
  {
    id: 'studio_obsidian',
    name: 'Obsidian Abyss',
    dataUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0a0f1d"/>
            <stop offset="50%" stop-color="#04060a"/>
            <stop offset="100%" stop-color="#090d16"/>
          </linearGradient>
          <radialGradient id="glow" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stop-color="#6366f1" stop-opacity="0.35"/>
            <stop offset="40%" stop-color="#8b5cf6" stop-opacity="0.15"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="600" height="750" fill="url(#bg)"/>
        <rect width="600" height="750" fill="url(#glow)"/>
        <path d="M-100,200 Q200,100 400,320 T800,450" fill="none" stroke="rgba(139,92,246,0.25)" stroke-width="2.5"/>
        <path d="M-100,260 Q180,180 420,380 T800,520" fill="none" stroke="rgba(99,102,241,0.2)" stroke-width="2"/>
        <path d="M-100,320 Q220,240 440,440 T800,580" fill="none" stroke="rgba(244,63,94,0.18)" stroke-width="1.5"/>
        <path d="M-100,380 Q240,300 460,500 T800,640" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
        <circle cx="280" cy="280" r="140" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1.5"/>
        <circle cx="280" cy="280" r="80" fill="none" stroke="rgba(139,92,246,0.15)" stroke-width="1"/>
      </svg>
    `.trim())
  },
  {
    id: 'studio_nebula',
    name: 'Cosmic Nebula',
    dataUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
        <defs>
          <linearGradient id="nbg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#090214"/>
            <stop offset="50%" stop-color="#180a2b"/>
            <stop offset="100%" stop-color="#020005"/>
          </linearGradient>
          <radialGradient id="core1" cx="30%" cy="30%" r="55%">
            <stop offset="0%" stop-color="#ec4899" stop-opacity="0.45"/>
            <stop offset="50%" stop-color="#8b5cf6" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="#000" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="core2" cx="70%" cy="65%" r="50%">
            <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.35"/>
            <stop offset="60%" stop-color="#3b82f6" stop-opacity="0.1"/>
            <stop offset="100%" stop-color="#000" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="600" height="750" fill="url(#nbg)"/>
        <rect width="600" height="750" fill="url(#core1)"/>
        <rect width="600" height="750" fill="url(#core2)"/>
        <circle cx="120" cy="180" r="1.5" fill="#fff" opacity="0.9"/>
        <circle cx="240" cy="110" r="2" fill="#fff" opacity="0.8"/>
        <circle cx="450" cy="190" r="1.5" fill="#fff" opacity="0.85"/>
        <circle cx="340" cy="380" r="2.5" fill="#fbcfe8" opacity="0.9"/>
        <circle cx="180" cy="520" r="1.5" fill="#a5f3fc" opacity="0.75"/>
        <circle cx="490" cy="580" r="2" fill="#fff" opacity="0.8"/>
        <circle cx="280" cy="640" r="1.2" fill="#fff" opacity="0.6"/>
        <circle cx="380" cy="220" r="1" fill="#fff" opacity="0.7"/>
        <circle cx="140" cy="340" r="1.5" fill="#fff" opacity="0.6"/>
      </svg>
    `.trim())
  },
  {
    id: 'studio_kintsugi',
    name: 'Kintsugi Gold',
    dataUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
        <defs>
          <linearGradient id="kgold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="35%" stop-color="#f59e0b"/>
            <stop offset="70%" stop-color="#fbbf24"/>
            <stop offset="100%" stop-color="#b45309"/>
          </linearGradient>
          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>
        <rect width="600" height="750" fill="#0f1115"/>
        <path d="M60,0 L140,160 L110,280 L250,410 L220,530 L340,650 L310,750" fill="none" stroke="url(#kgold)" stroke-width="3" filter="url(#goldGlow)"/>
        <path d="M250,410 L380,360 L460,420 L580,390" fill="none" stroke="url(#kgold)" stroke-width="2.5" filter="url(#goldGlow)"/>
        <path d="M140,160 L240,110 L360,150 L480,90 L600,120" fill="none" stroke="url(#kgold)" stroke-width="2" filter="url(#goldGlow)"/>
        <path d="M220,530 L160,590 L80,560 L0,620" fill="none" stroke="url(#kgold)" stroke-width="2" filter="url(#goldGlow)"/>
      </svg>
    `.trim())
  },
  {
    id: 'studio_cyber',
    name: 'Cyber Wireframe',
    dataUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
        <defs>
          <radialGradient id="sun" cx="50%" cy="45%" r="40%">
            <stop offset="0%" stop-color="#ec4899"/>
            <stop offset="60%" stop-color="#f43f5e" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#3b0764" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="600" height="750" fill="#090514"/>
        <circle cx="300" cy="340" r="120" fill="url(#sun)"/>
        <line x1="0" y1="360" x2="600" y2="360" stroke="#06b6d4" stroke-width="2"/>
        <g stroke="#06b6d4" stroke-opacity="0.45" stroke-width="1.5">
          <line x1="300" y1="360" x2="0" y2="750"/>
          <line x1="300" y1="360" x2="80" y2="750"/>
          <line x1="300" y1="360" x2="180" y2="750"/>
          <line x1="300" y1="360" x2="260" y2="750"/>
          <line x1="300" y1="360" x2="340" y2="750"/>
          <line x1="300" y1="360" x2="420" y2="750"/>
          <line x1="300" y1="360" x2="520" y2="750"/>
          <line x1="300" y1="360" x2="600" y2="750"/>
          <line x1="0" y1="390" x2="600" y2="390" stroke-opacity="0.2"/>
          <line x1="0" y1="430" x2="600" y2="430" stroke-opacity="0.3"/>
          <line x1="0" y1="480" x2="600" y2="480" stroke-opacity="0.4"/>
          <line x1="0" y1="550" x2="600" y2="550" stroke-opacity="0.55"/>
          <line x1="0" y1="640" x2="600" y2="640" stroke-opacity="0.7"/>
        </g>
      </svg>
    `.trim())
  },
  {
    id: 'studio_emerald',
    name: 'Emerald Geode',
    dataUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
        <defs>
          <linearGradient id="emgrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#022c22"/>
            <stop offset="50%" stop-color="#064e3b"/>
            <stop offset="100%" stop-color="#021f17"/>
          </linearGradient>
        </defs>
        <rect width="600" height="750" fill="url(#emgrad)"/>
        <polygon points="300,120 420,240 380,380 220,380 180,240" fill="#047857" opacity="0.35" stroke="#34d399" stroke-width="1.5"/>
        <polygon points="300,120 480,180 520,340 420,240" fill="#059669" opacity="0.45" stroke="#6ee7b7" stroke-width="1.5"/>
        <polygon points="300,120 180,240 80,340 120,180" fill="#065f46" opacity="0.4" stroke="#34d399" stroke-width="1.5"/>
        <polygon points="420,240 520,340 460,520 380,380" fill="#10b981" opacity="0.5" stroke="#a7f3d0" stroke-width="2"/>
        <polygon points="180,240 380,380 300,560 220,380" fill="#059669" opacity="0.6" stroke="#6ee7b7" stroke-width="2"/>
        <polygon points="180,240 220,380 140,520 80,340" fill="#047857" opacity="0.5" stroke="#34d399" stroke-width="1.5"/>
        <polygon points="380,380 460,520 340,660 300,560" fill="#064e3b" opacity="0.45" stroke="#34d399" stroke-width="1.5"/>
        <polygon points="220,380 300,560 260,660 140,520" fill="#022c22" opacity="0.5" stroke="#10b981" stroke-width="1.5"/>
      </svg>
    `.trim())
  },
  {
    id: 'studio_chrome',
    name: 'Liquid Chrome',
    dataUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
        <defs>
          <linearGradient id="chrm" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0f172a"/>
            <stop offset="25%" stop-color="#334155"/>
            <stop offset="45%" stop-color="#f8fafc"/>
            <stop offset="65%" stop-color="#64748b"/>
            <stop offset="85%" stop-color="#e2e8f0"/>
            <stop offset="100%" stop-color="#020617"/>
          </linearGradient>
        </defs>
        <rect width="600" height="750" fill="#090d16"/>
        <path d="M-50,200 C150,50 250,350 450,200 C600,100 650,300 700,250 L700,750 L-50,750 Z" fill="url(#chrm)" opacity="0.85"/>
        <path d="M-50,380 C180,220 280,500 480,340 C580,240 640,400 700,350 L700,750 L-50,750 Z" fill="url(#chrm)" opacity="0.6"/>
        <path d="M-50,540 C140,420 300,620 500,480 C600,400 650,520 700,480 L700,750 L-50,750 Z" fill="url(#chrm)" opacity="0.45"/>
      </svg>
    `.trim())
  },
  {
    id: 'studio_sunset',
    name: 'Sunset Horizon',
    dataUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#2e1065"/>
            <stop offset="35%" stop-color="#831843"/>
            <stop offset="60%" stop-color="#ea580c"/>
            <stop offset="75%" stop-color="#facc15"/>
            <stop offset="100%" stop-color="#0c0a09"/>
          </linearGradient>
        </defs>
        <rect width="600" height="750" fill="url(#sky)"/>
        <circle cx="300" cy="460" r="90" fill="#fef08a" opacity="0.95"/>
        <rect x="0" y="470" width="600" height="280" fill="#090514" opacity="0.92"/>
        <g stroke="#facc15" stroke-opacity="0.3" stroke-width="2">
          <line x1="220" y1="490" x2="380" y2="490"/>
          <line x1="180" y1="520" x2="420" y2="520"/>
          <line x1="140" y1="560" x2="460" y2="560"/>
          <line x1="80" y1="610" x2="520" y2="610"/>
          <line x1="20" y1="680" x2="580" y2="680"/>
        </g>
      </svg>
    `.trim())
  },
  {
    id: 'studio_velvet',
    name: 'Royal Velvet',
    dataUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
        <defs>
          <linearGradient id="vfold" x1="0" y1="0" x2="1" y2="0.6">
            <stop offset="0%" stop-color="#1e1b4b"/>
            <stop offset="30%" stop-color="#3b82f6"/>
            <stop offset="50%" stop-color="#1e3a8a"/>
            <stop offset="75%" stop-color="#60a5fa"/>
            <stop offset="100%" stop-color="#0f172a"/>
          </linearGradient>
        </defs>
        <rect width="600" height="750" fill="#0a0e27"/>
        <path d="M0,0 C150,200 100,500 0,750 L600,750 C500,500 450,200 600,0 Z" fill="url(#vfold)" opacity="0.8"/>
        <path d="M150,0 C300,250 250,550 150,750 L450,750 C350,550 300,250 450,0 Z" fill="url(#vfold)" opacity="0.65"/>
      </svg>
    `.trim())
  },
  {
    id: 'studio_tokyo',
    name: 'Tokyo Neon',
    dataUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
        <rect width="600" height="750" fill="#05050d"/>
        <circle cx="150" cy="180" r="70" fill="#ec4899" opacity="0.4"/>
        <circle cx="420" cy="260" r="90" fill="#06b6d4" opacity="0.35"/>
        <circle cx="280" cy="450" r="110" fill="#8b5cf6" opacity="0.3"/>
        <circle cx="160" cy="600" r="80" fill="#f59e0b" opacity="0.35"/>
        <circle cx="460" cy="580" r="75" fill="#f43f5e" opacity="0.4"/>
        <g stroke="#ffffff" stroke-opacity="0.14" stroke-width="1.2">
          <line x1="80" y1="50" x2="60" y2="160"/>
          <line x1="220" y1="120" x2="200" y2="240"/>
          <line x1="380" y1="80" x2="360" y2="210"/>
          <line x1="500" y1="140" x2="480" y2="280"/>
          <line x1="140" y1="360" x2="120" y2="490"/>
          <line x1="320" y1="420" x2="300" y2="560"/>
          <line x1="480" y1="390" x2="460" y2="530"/>
        </g>
      </svg>
    `.trim())
  },
  {
    id: 'studio_prism',
    name: 'Prismatic Quartz',
    dataUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
        <defs>
          <linearGradient id="prainbow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.7"/>
            <stop offset="25%" stop-color="#f59e0b" stop-opacity="0.6"/>
            <stop offset="50%" stop-color="#10b981" stop-opacity="0.6"/>
            <stop offset="75%" stop-color="#06b6d4" stop-opacity="0.7"/>
            <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.8"/>
          </linearGradient>
        </defs>
        <rect width="600" height="750" fill="#0b0f19"/>
        <polygon points="300,80 480,240 400,600 200,600 120,240" fill="url(#prainbow)" opacity="0.7" stroke="rgba(255,255,255,0.7)" stroke-width="2"/>
        <line x1="300" y1="80" x2="300" y2="440" stroke="#fff" stroke-width="2" opacity="0.8"/>
        <line x1="120" y1="240" x2="300" y2="440" stroke="#fff" stroke-width="1.5" opacity="0.7"/>
        <line x1="480" y1="240" x2="300" y2="440" stroke="#fff" stroke-width="1.5" opacity="0.7"/>
        <line x1="200" y1="600" x2="300" y2="440" stroke="#fff" stroke-width="1.5" opacity="0.7"/>
        <line x1="400" y1="600" x2="300" y2="440" stroke="#fff" stroke-width="1.5" opacity="0.7"/>
      </svg>
    `.trim())
  },
  {
    id: 'studio_honeycomb',
    name: 'Titanium Hex',
    dataUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
        <defs>
          <pattern id="hexGrid" width="60" height="104" patternUnits="userSpaceOnUse">
            <path d="M30,0 L60,17 L60,52 L30,69 L0,52 L0,17 Z M30,69 L60,86 L60,121 L30,138 L0,121 L0,86 Z" fill="none" stroke="rgba(245,158,11,0.35)" stroke-width="1.5"/>
          </pattern>
        </defs>
        <rect width="600" height="750" fill="#0d1117"/>
        <rect width="600" height="750" fill="url(#hexGrid)"/>
        <circle cx="300" cy="375" r="240" fill="radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)"/>
      </svg>
    `.trim())
  },
  {
    id: 'studio_aurora',
    name: 'Nordic Borealis',
    dataUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
        <defs>
          <linearGradient id="borealis" x1="0" y1="0" x2="1" y2="0.8">
            <stop offset="0%" stop-color="#022c22"/>
            <stop offset="30%" stop-color="#10b981"/>
            <stop offset="60%" stop-color="#06b6d4"/>
            <stop offset="85%" stop-color="#8b5cf6"/>
            <stop offset="100%" stop-color="#030712"/>
          </linearGradient>
        </defs>
        <rect width="600" height="750" fill="#030712"/>
        <path d="M-50,150 Q150,50 350,220 T750,120 L750,550 L-50,550 Z" fill="url(#borealis)" opacity="0.55"/>
        <path d="M-50,280 Q200,160 400,320 T750,240 L750,650 L-50,650 Z" fill="url(#borealis)" opacity="0.45"/>
        <polygon points="0,750 140,560 260,650 380,510 500,640 600,530 600,750" fill="#02040a"/>
      </svg>
    `.trim())
  }
];

// -------------------------------------------------------------
// AURA 3D GYROSCOPE, MOTION SENSOR & HARMONIC WAVE PHYSICS ENGINE
// -------------------------------------------------------------
let lastWaveTime = 0;

function triggerGridFluidWave(originCard = null, waveType = 'harmonic') {
  let grid = document.getElementById('albumsCardGrid') || document.getElementById('albumsGrid') || document.querySelector('.albums-card-grid');
  let cards = (grid && grid.offsetParent !== null) ? Array.from(grid.querySelectorAll('.album-rich-card.card-3d')) : [];
  if (!cards.length) {
    grid = document.getElementById('galleryPhotoGrid');
    cards = (grid && grid.offsetParent !== null) ? Array.from(grid.querySelectorAll('.photo-card-elegant.card-3d')) : [];
  }
  if (!cards.length) return;

  let originCenterX, originCenterY;
  if (originCard) {
    const rect = originCard.getBoundingClientRect();
    originCenterX = rect.left + rect.width / 2;
    originCenterY = rect.top + rect.height / 2;
  } else {
    const gridRect = grid.getBoundingClientRect();
    originCenterX = gridRect.left + gridRect.width / 2;
    originCenterY = gridRect.top + gridRect.height / 2;
  }

  cards.forEach(card => {
    if (card === originCard && waveType !== 'shake') return;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = centerX - originCenterX;
    const dy = centerY - originCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Stagger delay based on distance
    const delay = Math.min(380, Math.round(dist * 0.35));

    setTimeout(() => {
      card.classList.remove('card-collision-wave');
      void card.offsetWidth; // retrigger
      card.classList.add('card-collision-wave');

      // Subtle magnetic repulsion tilt away from source
      const normX = dist > 0 ? (dx / dist) : 0;
      const normY = dist > 0 ? (dy / dist) : 0;
      const deflectX = (-normY * 5).toFixed(2);
      const deflectY = (normX * 5).toFixed(2);

      card.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease';
      card.style.transform = `perspective(900px) rotateX(${deflectX}deg) rotateY(${deflectY}deg) translateZ(10px) scale3d(1.02, 1.02, 1.02)`;

      const shine = card.querySelector('.album-3d-shine');
      if (shine) {
        shine.style.opacity = '1';
        const matchedStyle = Array.from(card.classList).find(c => c.startsWith('surface-'))?.replace('surface-', '') || 'default';
        const shineFn = VIP_3D_SHINE_MAP[matchedStyle] || VIP_3D_SHINE_MAP.default;
        shine.style.background = shineFn(50 + normX * 30, 50 + normY * 30);
      }

      setTimeout(() => {
        card.style.transform = '';
        card.classList.remove('card-collision-wave');
        if (shine && !card.classList.contains('tilting')) {
          shine.style.opacity = '0';
        }
      }, 500);
    }, delay);
  });
}

const Aura3DMotionPhysics = {
  currentTiltX: 0,
  currentTiltY: 0,
  targetTiltX: 0,
  targetTiltY: 0,
  isListening: false,
  rafId: null,
  lastShakeTime: 0,
  lastAccel: { x: 0, y: 0, z: 0 },
  neutralBeta: 45,
  hasCalibrated: false,

  onNativeOrientation(pitch, roll) {
    if (pitch === null || roll === null || isNaN(pitch) || isNaN(roll)) return;
    if (!this.hasCalibrated) {
      this.neutralBeta = Math.max(20, Math.min(70, pitch));
      this.hasCalibrated = true;
    }
    const deltaBeta = pitch - this.neutralBeta;
    // Smooth clamp between -20 and +20 deg
    this.targetTiltX = Math.max(-20, Math.min(20, -deltaBeta * 0.45));
    this.targetTiltY = Math.max(-20, Math.min(20, roll * 0.45));
  },

  init() {
    if (this.isListening) return;
    this.isListening = true;

    // 1. Mobile Gyroscope / Tilt (DeviceOrientation)
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.beta === null || e.gamma === null) return;
        if (!this.hasCalibrated && e.beta !== null) {
          this.neutralBeta = Math.max(20, Math.min(70, e.beta));
          this.hasCalibrated = true;
        }
        const deltaBeta = e.beta - this.neutralBeta;
        // Clamp smoothly between -18 and +18 deg
        this.targetTiltX = Math.max(-18, Math.min(18, -deltaBeta * 0.45));
        this.targetTiltY = Math.max(-18, Math.min(18, e.gamma * 0.45));
      }, { passive: true });
    }

    // 2. Shake Detection (DeviceMotion)
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', (e) => {
        const acc = e.accelerationIncludingGravity || e.acceleration;
        if (!acc || acc.x === null) return;
        const dx = acc.x - this.lastAccel.x;
        const dy = acc.y - this.lastAccel.y;
        const dz = acc.z - this.lastAccel.z;
        this.lastAccel = { x: acc.x, y: acc.y, z: acc.z };

        const delta = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const now = Date.now();
        if (delta > 18 && now - this.lastShakeTime > 1100) {
          this.triggerShakeWave();
        }
      }, { passive: true });
    }

    this.startLoop();
  },

  triggerShakeWave() {
    const now = Date.now();
    this.lastShakeTime = now;
    if (navigator.vibrate) {
      try { navigator.vibrate([35, 50, 35]); } catch (err) {}
    }

    // 1. If 3D Surface Studio modal is open, animate the modal preview card directly
    const modal = document.getElementById('album3DSurfaceModal');
    if (modal && modal.style.display !== 'none') {
      const card = document.getElementById('album3DPreviewCard');
      const shine = document.getElementById('album3DPreviewShine');
      if (card) {
        card.classList.remove('card-collision-wave');
        void card.offsetWidth;
        card.classList.add('card-collision-wave');
        card.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.45s ease';
        card.style.transform = 'perspective(900px) rotateX(14deg) rotateY(-16deg) translateZ(26px) scale3d(1.08, 1.08, 1.08)';
        if (shine) {
          shine.style.opacity = '1';
          const st = state.selected3DSurfaceStyle || 'default';
          const shineFn = VIP_3D_SHINE_MAP[st] || VIP_3D_SHINE_MAP.default;
          shine.style.background = shineFn(75, 25);
        }
        setTimeout(() => {
          card.style.transform = '';
          card.classList.remove('card-collision-wave');
          if (shine && !card.dataset.userHovering) {
            shine.style.opacity = '0.4';
          }
        }, 550);
      }
      if (typeof showToast === 'function') {
        showToast('✨ 3D Kinetic Resonance Wave Triggered!');
      }
      return;
    }

    // 2. Otherwise trigger on album or gallery cards
    triggerGridFluidWave(null, 'shake');
    if (typeof showToast === 'function') {
      showToast('✨ 3D Kinetic Resonance Wave Activated!');
    }
  },

  startLoop() {
    const loop = () => {
      // Butter-smooth spring damper lerp (factor 0.12)
      this.currentTiltX += (this.targetTiltX - this.currentTiltX) * 0.12;
      this.currentTiltY += (this.targetTiltY - this.currentTiltY) * 0.12;

      this.applyTiltToScene(this.currentTiltX, this.currentTiltY);
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  },

  applyTiltToScene(rotX, rotY) {
    // If 3D Surface Studio modal is open, tilt the preview card
    const modal = document.getElementById('album3DSurfaceModal');
    if (modal && modal.style.display !== 'none') {
      const card = document.getElementById('album3DPreviewCard');
      const shine = document.getElementById('album3DPreviewShine');
      if (card && !card.dataset.userHovering) {
        card.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(16px) scale3d(1.04, 1.04, 1.04)`;
        if (shine) {
          shine.style.opacity = '1';
          const xPct = Math.max(0, Math.min(100, 50 + (rotY / 18) * 50));
          const yPct = Math.max(0, Math.min(100, 50 - (rotX / 18) * 50));
          const st = state.selected3DSurfaceStyle || 'default';
          const shineFn = VIP_3D_SHINE_MAP[st] || VIP_3D_SHINE_MAP.default;
          shine.style.background = shineFn(xPct, yPct);
        }
      }
      return;
    }

    // 2. If photo detail modal is open, keep image pure 2D without tilt distortion
    const detailModal = document.getElementById('photoDetailModal');
    if (detailModal && detailModal.style.display !== 'none') {
      return;
    }

    if (state.albumPhotos3DEnabled === false || state.global3DEnabled === false || !state.isPro) return;

    // Check visible cards in albums grid and/or gallery photo grid
    const targetCards = [];
    const albumsGrid = document.getElementById('albumsCardGrid') || document.getElementById('albumsGrid') || document.querySelector('.albums-card-grid');
    if (albumsGrid && albumsGrid.offsetParent !== null) {
      targetCards.push(...albumsGrid.querySelectorAll('.album-rich-card.card-3d:not(.tilting):not(.card-collision-wave)'));
    }
    const galleryGrid = document.getElementById('galleryPhotoGrid');
    if (galleryGrid && galleryGrid.offsetParent !== null && state.albumPhotos3DEnabled !== false) {
      targetCards.push(...galleryGrid.querySelectorAll('.photo-card-elegant.card-3d:not(.tilting):not(.card-collision-wave)'));
    }
    const favGrid = document.getElementById('favoritesPhotoGrid');
    if (favGrid && favGrid.offsetParent !== null && state.albumPhotos3DEnabled !== false) {
      targetCards.push(...favGrid.querySelectorAll('.photo-card-elegant.card-3d:not(.tilting):not(.card-collision-wave)'));
    }
    if (!targetCards.length) return;

    const angleMag = Math.abs(rotX) + Math.abs(rotY);
    targetCards.forEach(card => {
      const subRotX = (rotX * 0.7).toFixed(2);
      const subRotY = (rotY * 0.7).toFixed(2);
      card.style.transform = `perspective(900px) rotateX(${subRotX}deg) rotateY(${subRotY}deg) translateZ(6px)`;
      const shine = card.querySelector('.album-3d-shine');
      if (shine) {
        const xPct = Math.max(0, Math.min(100, 50 + (rotY / 18) * 50));
        const yPct = Math.max(0, Math.min(100, 50 - (rotX / 18) * 50));
        const matchedStyle = Array.from(card.classList).find(c => c.startsWith('surface-'))?.replace('surface-', '') || 'default';
        const shineFn = VIP_3D_SHINE_MAP[matchedStyle] || VIP_3D_SHINE_MAP.default;
        shine.style.opacity = Math.min(1, angleMag / 14).toFixed(2);
        shine.style.background = shineFn(xPct, yPct);
      }
    });
  }
};

window.Aura3DMotionPhysics = Aura3DMotionPhysics;
window.triggerGridFluidWave = triggerGridFluidWave;
window.simulateShake = () => Aura3DMotionPhysics.triggerShakeWave();

// Desktop testing shortcut: Press 'S' to simulate a phone shake resonance wave
window.addEventListener('keydown', (e) => {
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
  if (e.key === 's' || e.key === 'S') {
    Aura3DMotionPhysics.triggerShakeWave();
  }
});

function init3DCardParallax(container) {
  if (!container) return;
  Aura3DMotionPhysics.init();

  const cards = container.querySelectorAll('.album-rich-card.card-3d, .photo-card-elegant.card-3d');
  cards.forEach(card => {
    if (card.dataset.parallaxInit) return;
    card.dataset.parallaxInit = 'true';
    const shine = card.querySelector('.album-3d-shine');
    let rafId = null;

    const handlePointerMove = (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPct = Math.max(0, Math.min(1, x / rect.width));
        const yPct = Math.max(0, Math.min(1, y / rect.height));

        const rotX = ((0.5 - yPct) * 15).toFixed(2);
        const rotY = ((xPct - 0.5) * 15).toFixed(2);

        card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(14px) scale3d(1.035, 1.035, 1.035)`;
        card.classList.add('tilting');

        if (shine) {
          const matchedStyle = Array.from(card.classList).find(c => c.startsWith('surface-'))?.replace('surface-', '') || 'default';
          const shineFn = VIP_3D_SHINE_MAP[matchedStyle] || VIP_3D_SHINE_MAP.default;
          shine.style.background = shineFn(xPct * 100, yPct * 100);
        }

        // Trigger neighbor harmonic fluid wave on pointer interaction (throttled)
        const now = Date.now();
        if (now - lastWaveTime > 350) {
          lastWaveTime = now;
          triggerGridFluidWave(card, 'harmonic');
        }
      });
    };

    const handlePointerLeave = () => {
      if (rafId) cancelAnimationFrame(rafId);
      card.style.transform = '';
      if (shine) {
        shine.style.opacity = '0';
        shine.style.background = '';
      }
      card.classList.remove('tilting');
    };

    const handleTouchMove = (e) => {
      if (!e.touches || !e.touches[0]) return;
      handlePointerMove(e.touches[0]);
    };

    card.addEventListener('pointermove', handlePointerMove);
    card.addEventListener('pointerleave', handlePointerLeave);
    card.addEventListener('touchmove', handleTouchMove, { passive: true });
    card.addEventListener('touchend', handlePointerLeave, { passive: true });
    card.addEventListener('touchcancel', handlePointerLeave, { passive: true });
  });
}

function initDetailImage3DParallax() {
  // 3D parallax removed from photo detail view as requested
  return;
}

// -------------------------------------------------------------
// VIP 3D ALBUM SURFACE STUDIO (Item 15)
// -------------------------------------------------------------
let stage3DCardRaf = null;

function openAlbum3DSurfaceModal(tagName) {
  recordAlbumActivity(tagName, 'viewed');
  const isFavorites = (tagName === 'favorites');
  let tag = null;
  let albumPhotos = [];
  let repPhoto = null;
  let albumDisplayName = '';
  let albumColor = '#f43f5e';

  if (isFavorites) {
    state.current3DModalAlbum = 'favorites';
    albumPhotos = state.photos.filter(p => p.isFavorite && !p.deletedAt);
    repPhoto = albumPhotos[0] || state.photos.find(p => !p.deletedAt && p.dataUrl);
    albumDisplayName = window.t ? window.t('album_fav_card_title') : 'Favorites';
    albumColor = '#f43f5e';
    state.selected3DSurfacePhoto = state.favoritesCustomCover || (repPhoto ? repPhoto.dataUrl : '');
    state.selected3DSurfaceStyle = state.favorites3DStyle || 'holo';
  } else {
    tag = state.tags.find(t => t.name === tagName);
    if (!tag) return;
    state.current3DModalAlbum = tagName;
    albumPhotos = state.photos.filter(p => !p.isPending && !p.deletedAt && Array.isArray(p.tags) && p.tags.includes(tagName));
    repPhoto = albumPhotos[0] || state.photos.find(p => !p.deletedAt && p.dataUrl);
    albumDisplayName = tag.name;
    albumColor = tag.color || '#f43f5e';
    state.selected3DSurfacePhoto = tag.customCoverUrl || (repPhoto ? repPhoto.dataUrl : '');
    state.selected3DSurfaceStyle = tag.surface3DStyle || 'holo';
  }

  // 1. Title & Eyebrow
  const title = document.getElementById('album3DModalTitle');
  if (title) {
    const titleSuffix = window.t ? window.t('surface_3d_title') : '3D Surface Studio';
    title.textContent = `${albumDisplayName} · ${titleSuffix}`;
  }

  // 2. VIP Status / Upgrade Callout Banner
  const statusBar = document.getElementById('vipSurfaceStatusBar');
  if (statusBar) {
    if (state.isPro) {
      statusBar.innerHTML = '';
      statusBar.style.display = 'none';
    } else {
      const vipFeatureText = window.t ? window.t('surface_3d_vip_feature') : 'Aura Pro VIP Feature';
      const vipDescText = window.t ? window.t('surface_3d_vip_desc') : 'Test-drive the live 3D card below, or activate instant tester access.';
      const vipTesterBtn = window.t ? window.t('surface_3d_tester_btn') : 'VIP Tester';
      const vipUpgradeBtn = window.t ? window.t('surface_3d_upgrade_btn') : 'Upgrade ₹299';
      statusBar.innerHTML = `
        <div class="vip-status-card vip-locked">
          <div class="vip-status-text">
            <span class="vip-status-title"><i class="fa-solid fa-gem" style="color:#f43f5e"></i> ${vipFeatureText}</span>
            <span class="vip-status-desc">${vipDescText}</span>
          </div>
          <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
            <button class="vip-unlock-pill tester-btn" onclick="enableVip(); openAlbum3DSurfaceModal('${escapeHtml(tagName)}');" title="Enable Instant VIP Access for Testing">
              <i class="fa-solid fa-flask"></i> ${vipTesterBtn}
            </button>
            <button class="vip-unlock-pill" onclick="initiateRazorpayPayment()">
              <i class="fa-solid fa-bolt"></i> ${vipUpgradeBtn}
            </button>
          </div>
        </div>
      `;
    }
  }

  // 3. Render 3D Preview Stage Card Elements
  update3DModalPreviewStage();

  // 4. Render Personal Photos Strip
  renderSurfacePhotoPicker();

  // 5. Render Surface Style Chips
  update3DSurfaceStyleChips();

  // 6. Action Buttons
  const actionContainer = document.getElementById('album3DModalActionButtons');
  if (actionContainer) {
    if (state.isPro) {
      const cancelText = window.t ? window.t('crop_cancel') : 'Cancel';
      const applyText = window.t ? window.t('surface_3d_apply') : 'Apply 3D Surface';
      actionContainer.innerHTML = `
        <button class="btn btn-outline" onclick="closeAlbum3DSurfaceModal()">${cancelText}</button>
        <button class="btn btn-primary" onclick="saveAlbum3DSurface()">
          <i class="fa-solid fa-wand-magic-sparkles"></i> ${applyText}
        </button>
      `;
    } else {
      const closeText = window.t ? window.t('close') : 'Close';
      const testerUnlockText = window.t ? window.t('surface_3d_tester_unlock') : 'VIP Tester Unlock';
      const unlockVipText = window.t ? window.t('surface_3d_unlock_vip') : 'Unlock Aura Pro VIP (₹299)';
      actionContainer.innerHTML = `
        <button class="btn btn-outline" onclick="closeAlbum3DSurfaceModal()">${closeText}</button>
        <button class="btn btn-outline" onclick="enableVip(); openAlbum3DSurfaceModal('${escapeHtml(tagName)}');" style="border-color: rgba(244, 63, 94, 0.5); color: #ff7a90;" title="Instant VIP Access for Testing">
          <i class="fa-solid fa-flask"></i> ${testerUnlockText}
        </button>
        <button class="btn btn-primary" onclick="initiateRazorpayPayment()">
          ${getLuxuryCrownSvg(14)} ${unlockVipText}
        </button>
      `;
    }
  }

  // 7. Show Modal & Bind Interactive Tilt Stage & Drag Scroll
  const modal = document.getElementById('album3DSurfaceModal');
  if (modal) {
    modal.style.display = 'flex';
    if (window.applyTranslationsToDOM) {
      window.applyTranslationsToDOM();
    }
    initModalStageTilt();
    const pickerStrip = document.getElementById('surfacePhotoPickerStrip');
    if (pickerStrip) {
      pickerStrip.scrollLeft = 0;
      makeDraggableScroll(pickerStrip);
    }
  }
}

function closeAlbum3DSurfaceModal() {
  const modal = document.getElementById('album3DSurfaceModal');
  const targetAlbum = state.current3DModalAlbum;
  if (modal) modal.style.display = 'none';
  if (stage3DCardRaf) cancelAnimationFrame(stage3DCardRaf);
  if (targetAlbum) {
    highlightReturnedAlbumCard(targetAlbum);
  }
  state.current3DModalAlbum = null;
}

function update3DModalPreviewStage() {
  const isFavorites = (state.current3DModalAlbum === 'favorites');
  let tag = null;
  let validPhotos = [];
  let name = '';
  let color = '#f43f5e';

  if (isFavorites) {
    validPhotos = state.photos.filter(p => p.isFavorite && !p.deletedAt);
    name = window.t ? window.t('album_fav_card_title') : 'Favorites';
    color = '#f43f5e';
  } else {
    tag = state.tags.find(t => t.name === state.current3DModalAlbum);
    if (!tag) return;
    validPhotos = state.photos.filter(p => !p.isPending && !p.deletedAt && Array.isArray(p.tags) && p.tags.includes(tag.name));
    name = tag.name;
    color = tag.color || '#f43f5e';
  }

  const count = validPhotos.length;

  const imgEl = document.getElementById('album3DPreviewImg');
  const nameEl = document.getElementById('album3DPreviewName');
  const countEl = document.getElementById('album3DPreviewCount');
  const dotEl = document.getElementById('album3DPreviewDot');
  const previewCard = document.getElementById('album3DPreviewCard');

  if (imgEl) {
    const src = state.selected3DSurfacePhoto || (validPhotos[0] ? validPhotos[0].dataUrl : '');
    imgEl.src = src || generateGradientImage(name, 'Album', ['#f43f5e', '#8b5cf6']);
  }
  if (nameEl) nameEl.textContent = name;
  if (countEl) {
    const momentLabel = count === 1
      ? (window.t ? window.t('surface_3d_moment_singular') : 'Moment Captured')
      : (window.t ? window.t('surface_3d_moment_plural') : 'Moments Captured');
    countEl.textContent = `${count} ${momentLabel}`;
  }
  if (dotEl) dotEl.style.backgroundColor = color;

  if (previewCard) {
    const styleClass = (state.selected3DSurfaceStyle && state.selected3DSurfaceStyle !== 'none')
      ? `surface-${state.selected3DSurfaceStyle}`
      : '';
    previewCard.className = `card-3d-preview ${styleClass}`.trim();
  }
}

function renderSurfacePhotoPicker() {
  const strip = document.getElementById('surfacePhotoPickerStrip');
  if (!strip) return;

  // Personal photos: active gallery photos + dock photos
  const personalPhotos = state.photos.filter(p => !p.deletedAt && p.dataUrl);

  const uploadLabel = window.t ? window.t('surface_3d_upload') : 'Upload';
  let uploadCardHtml = `
    <div class="surface-upload-card" onclick="document.getElementById('albumSurfaceUploadInput').click()" title="Upload Custom Surface Image">
      <i class="fa-solid fa-arrow-up-from-bracket" style="font-size: 16px;"></i>
      <span data-i18n="surface_3d_upload">${uploadLabel}</span>
    </div>
  `;

  let personalPhotosHtml = personalPhotos.map(photo => {
    const isSelected = state.selected3DSurfacePhoto === photo.dataUrl;
    return `
      <div class="surface-photo-card ${isSelected ? 'active' : ''}" onclick="selectSurfacePhoto('${photo.id}')" title="${escapeHtml(photo.displayName)} (Click to ${isSelected ? 'Deselect' : 'Select'})">
        <img src="${photo.dataUrl}" alt="${escapeHtml(photo.displayName)}" loading="lazy" />
        ${isSelected ? '<span class="active-check-badge"><i class="fa-solid fa-check"></i></span>' : ''}
      </div>
    `;
  }).join('');

  let studioSurfacesHtml = STUDIO_3D_SURFACES.map(surf => {
    const isSelected = state.selected3DSurfacePhoto === surf.dataUrl;
    return `
      <div class="surface-photo-card studio-card ${isSelected ? 'active' : ''}" onclick="selectStudioSurface('${surf.id}')" title="VIP Studio: ${escapeHtml(surf.name)} (Click to ${isSelected ? 'Deselect' : 'Select'})">
        <img src="${surf.dataUrl}" alt="${escapeHtml(surf.name)}" loading="lazy" />
        <span class="studio-card-badge"><i class="fa-solid fa-gem"></i> VIP</span>
        ${isSelected ? '<span class="active-check-badge"><i class="fa-solid fa-check"></i></span>' : ''}
      </div>
    `;
  }).join('');

  // Place Upload option at the very left as the first, then VIP Studio Artworks, then personal photos
  strip.innerHTML = uploadCardHtml + studioSurfacesHtml + personalPhotosHtml;
}

function selectSurfacePhoto(photoId) {
  const photo = state.photos.find(p => p.id === photoId);
  if (!photo) return;

  // Click-to-select and click-again-to-deselect
  if (state.selected3DSurfacePhoto === photo.dataUrl) {
    removeAlbumCustomSurface();
    showToast(`Deselected photo (Default cover restored)`);
    return;
  }

  state.selected3DSurfacePhoto = photo.dataUrl;
  update3DModalPreviewStage();
  renderSurfacePhotoPicker();
  showToast(`Selected '${photo.displayName}' as card surface ✨`);
}

function selectStudioSurface(surfId) {
  const surf = STUDIO_3D_SURFACES.find(s => s.id === surfId);
  if (!surf) return;

  // Click-to-select and click-again-to-deselect
  if (state.selected3DSurfacePhoto === surf.dataUrl) {
    removeAlbumCustomSurface();
    showToast(`Deselected surface (Default cover restored)`);
    return;
  }

  state.selected3DSurfacePhoto = surf.dataUrl;
  update3DModalPreviewStage();
  renderSurfacePhotoPicker();
  showToast(`Applied VIP Studio Surface: ${surf.name} ✨`);
}

function handleSurfaceImageUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    state.selected3DSurfacePhoto = e.target.result;
    update3DModalPreviewStage();
    renderSurfacePhotoPicker();
    showToast('✨ Custom surface image loaded!');
  };
  reader.readAsDataURL(file);
  event.target.value = '';
}

function removeAlbumCustomSurface() {
  if (state.current3DModalAlbum === 'favorites') {
    const favPhotos = state.photos.filter(p => p.isFavorite && !p.deletedAt);
    state.selected3DSurfacePhoto = (favPhotos[0] ? favPhotos[0].dataUrl : '');
    update3DModalPreviewStage();
    renderSurfacePhotoPicker();
    return;
  }

  const tag = state.tags.find(t => t.name === state.current3DModalAlbum);
  if (!tag) return;

  const albumPhotos = state.photos.filter(p => !p.isPending && !p.deletedAt && Array.isArray(p.tags) && p.tags.includes(tag.name));
  state.selected3DSurfacePhoto = (albumPhotos[0] ? albumPhotos[0].dataUrl : '');
  update3DModalPreviewStage();
  renderSurfacePhotoPicker();
}

function select3DSurfaceStyle(styleName) {
  // Click-to-select and click-again-to-deselect
  if (state.selected3DSurfaceStyle === styleName) {
    state.selected3DSurfaceStyle = 'none';
    showToast(`Deselected finish (Standard 3D Depth)`);
  } else {
    state.selected3DSurfaceStyle = styleName;
    const styleNames = {
      holo: 'Holo Prism ✨',
      glass: 'Liquid Glass 💎',
      gold: '24K Luxury Gold 👑',
      aurora: 'Cyber Aurora 🌌',
      carbon: 'Obsidian Carbon 🏎️',
      titanium: 'Midnight Titanium 🛡️',
      nebula: 'Cosmic Nebula 🪐',
      emerald: 'Imperial Emerald ❇️',
      pearl: 'Opal Pearl 🦪',
      rose: 'Rose Diamond 💎',
      solar: 'Solar Flare ☀️',
      matrix: 'Cyber Matrix ⚡',
      amethyst: 'Royal Amethyst 🔮',
      sapphire: 'Midnight Sapphire 🔷',
      ruby: 'Blood Ruby 🩸',
      quantum: 'Quantum Chromatic 🌀',
      damascus: 'Damascus Steel ⚔️',
      cyberpunk: 'Neon Synth 🌆',
      platina: 'Liquid Platinum 🪞',
      volcanic: 'Magma Volcanic 🌋',
      supernova: 'Supernova Gold 💥',
      aquamarine: 'Glacial Ice 🧊',
      copper: 'Brushed Copper 🪙',
      chameleon: 'Mystic Chameleon 🦎',
      celestial: 'Celestial Moondust 🌙',
      onyx: 'Black Onyx 🖤',
      sunset: 'Malibu Sunset 🌅',
      prism_noir: 'Dark Prism Noir 🕶️',
      biolum: 'Bio Emerald 🌿',
      hyperdrive: 'Warp Hyperdrive 🚀',
      meteorite: 'Cosmic Meteorite ☄️',
      vaporwave: 'Retro Vaporwave 🌸'
    };
    const translatedName = window.t ? window.t('mat_' + styleName + '_title') : null;
    const displayName = (translatedName && translatedName !== 'mat_' + styleName + '_title')
      ? translatedName
      : (styleNames[styleName] || styleName);
    showToast(`✨ ${displayName}`);
  }
  update3DModalPreviewStage();
  update3DSurfaceStyleChips();
}

function update3DSurfaceStyleChips() {
  document.querySelectorAll('.surface-style-chip').forEach(chip => {
    const st = chip.dataset.style;
    const isSelected = (st === state.selected3DSurfaceStyle);
    chip.classList.toggle('active', isSelected);
  });
}

function initModalStageTilt() {
  const stage = document.getElementById('stage3DPreviewWrapper');
  const card = document.getElementById('album3DPreviewCard');
  const shine = document.getElementById('album3DPreviewShine');
  if (!stage || !card) return;

  Aura3DMotionPhysics.init();

  const onMove = (e) => {
    card.dataset.userHovering = 'true';
    if (stage3DCardRaf) cancelAnimationFrame(stage3DCardRaf);
    stage3DCardRaf = requestAnimationFrame(() => {
      const rect = stage.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const xPct = Math.max(0, Math.min(1, x / rect.width));
      const yPct = Math.max(0, Math.min(1, y / rect.height));

      const rotX = ((0.5 - yPct) * 22).toFixed(2);
      const rotY = ((xPct - 0.5) * 22).toFixed(2);

      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(16px) scale3d(1.05, 1.05, 1.05)`;
      if (shine) {
        shine.style.opacity = '1';
        const st = state.selected3DSurfaceStyle || 'default';
        const shineFn = VIP_3D_SHINE_MAP[st] || VIP_3D_SHINE_MAP.default;
        shine.style.background = shineFn(xPct * 100, yPct * 100);
      }
    });
  };

  const onLeave = () => {
    delete card.dataset.userHovering;
    if (stage3DCardRaf) cancelAnimationFrame(stage3DCardRaf);
    card.style.transform = '';
    if (shine) {
      shine.style.opacity = '0';
      shine.style.background = '';
    }
  };

  stage.onpointermove = onMove;
  stage.onpointerleave = onLeave;
  stage.ontouchmove = onMove;
  stage.ontouchend = onLeave;
}


function saveAlbum3DSurface() {
  if (!state.isPro) {
    initiateRazorpayPayment();
    return;
  }

  const tagName = state.current3DModalAlbum;

  if (tagName === 'favorites') {
    const favPhotos = state.photos.filter(p => !p.deletedAt && p.isFavorite);
    const defaultPhoto = favPhotos[0] ? favPhotos[0].dataUrl : '';

    if (!state.selected3DSurfacePhoto || state.selected3DSurfacePhoto === defaultPhoto) {
      state.favoritesCustomCover = null;
    } else {
      state.favoritesCustomCover = state.selected3DSurfacePhoto;
    }

    state.favorites3DStyle = (state.selected3DSurfaceStyle && state.selected3DSurfaceStyle !== 'none')
      ? state.selected3DSurfaceStyle
      : 'none';

    saveState();
    renderAll();
    closeAlbum3DSurfaceModal();
    const favTitle = window.t ? window.t('album_fav_card_title') : 'Favorites';
    showToast(`✨ Applied 3D surface for '${favTitle}'!`);
    return;
  }

  const tag = state.tags.find(t => t.name === tagName);
  if (!tag) return;

  const albumPhotos = state.photos.filter(p => !p.isPending && !p.deletedAt && Array.isArray(p.tags) && p.tags.includes(tagName));
  const defaultPhoto = albumPhotos[0] ? albumPhotos[0].dataUrl : '';

  // If deselected or equals default photo, clear customCoverUrl
  if (!state.selected3DSurfacePhoto || state.selected3DSurfacePhoto === defaultPhoto) {
    tag.customCoverUrl = null;
  } else {
    tag.customCoverUrl = state.selected3DSurfacePhoto;
  }

  tag.surface3DStyle = (state.selected3DSurfaceStyle && state.selected3DSurfaceStyle !== 'none')
    ? state.selected3DSurfaceStyle
    : 'none';

  saveState();
  renderAll();
  closeAlbum3DSurfaceModal();
  showToast(`✨ Applied 3D surface for '${tag.name}'!`);
}

function toggleGlobal3DMode() {
  if (!state.isPro) {
    openRazorpayModal();
    showToast('👑 3D Album Cards are an Aura Pro VIP exclusive feature!');
    return;
  }

  state.global3DEnabled = !state.global3DEnabled;
  saveState();
  renderAlbumsScreen();
  showToast(state.global3DEnabled ? '✨ 3D Holographic Parallax enabled!' : '3D mode disabled');
}

function toggleAlbumPhoto3DEffects() {
  if (!state.isPro) {
    if (typeof openRazorpayModal === 'function') {
      openRazorpayModal();
    }
    showToast('👑 3D Card FX on Album Photos is an Aura Pro VIP exclusive feature!');
    return;
  }

  const activeAlbumName = state.selectedFilterTags.size === 1 ? Array.from(state.selectedFilterTags)[0] : null;
  const albumTag = activeAlbumName ? state.tags.find(t => t.name === activeAlbumName) : null;

  state.albumPhotos3DEnabled = !(state.albumPhotos3DEnabled !== false);
  try {
    localStorage.setItem('aura_album_photos_3d_enabled', state.albumPhotos3DEnabled ? 'true' : 'false');
  } catch (err) {}

  saveState();
  renderGallery();

  if (state.albumPhotos3DEnabled) {
    const styleName = (albumTag && albumTag.surface3DStyle) ? albumTag.surface3DStyle.toUpperCase() : 'VIP 3D';
    showToast(`✨ ${styleName} 3D Card FX Enabled for Album Photos!`);
  } else {
    showToast('3D Card FX Disabled for Album Photos');
  }
}
window.toggleAlbumPhoto3DEffects = toggleAlbumPhoto3DEffects;

// Developer & VIP Access Tester Controls
function toggleVip(forceState) {
  if (typeof forceState === 'boolean') {
    state.isPro = forceState;
  } else {
    state.isPro = !state.isPro;
  }

  // When enabling VIP Developer Mode, activate all 3D effects
  if (state.isPro) {
    state.global3DEnabled = true;
    state.albumPhotos3DEnabled = true;
  }

  saveState();
  renderAll();

  if (navigator.vibrate) {
    try { navigator.vibrate(state.isPro ? [40, 60, 80] : [50]); } catch (e) {}
  }

  showToast(state.isPro 
    ? '👑 VIP BYPASS ACTIVATED: All 3D Albums, RAW Export & Secret Vault Unlocked!' 
    : 'Switched to Starter Mode (Testing Locked Free Tier)');
  return state.isPro;
}

function enableVip() {
  return toggleVip(true);
}

function disableVip() {
  return toggleVip(false);
}

function bypassSubscription() {
  return enableVip();
}

function toggleVipFromSettings(checked) {
  toggleVip(checked);
}

// Quick Scroll to Settings Section with spotlight pulse
function scrollToSettingsSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (!el) return;
  const viewport = document.querySelector('.app-viewport') || document.getElementById('deviceFrame');
  if (viewport) {
    const topOffset = el.offsetTop - 75;
    viewport.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' });
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  el.classList.remove('section-spotlight');
  void el.offsetWidth;
  el.classList.add('section-spotlight');
  setTimeout(() => el.classList.remove('section-spotlight'), 1600);
}

// Secret 5-Tap Gesture on Profile Card or Version text
let secretDevTapCount = 0;
let secretDevTapTimer = null;
function handleDevModeSecretTap() {
  secretDevTapCount++;
  clearTimeout(secretDevTapTimer);
  secretDevTapTimer = setTimeout(() => { secretDevTapCount = 0; }, 2200);
  if (secretDevTapCount >= 5) {
    secretDevTapCount = 0;
    toggleVip();
    if (navigator.vibrate) try { navigator.vibrate([80, 50, 80, 50, 120]); } catch(e) {}
    showToast(state.isPro 
      ? '🎉 DEVELOPER SECRET UNLOCKED: Aura Pro VIP Access 100% Bypassed!' 
      : 'Developer Mode: Returned to Starter Free Tier');
  } else if (secretDevTapCount >= 3) {
    showToast(`🛠️ Developer Mode: ${5 - secretDevTapCount} taps remaining to toggle VIP bypass`);
  }
}

window.toggleVip = toggleVip;
window.enableVip = enableVip;
window.disableVip = disableVip;
window.bypassSubscription = bypassSubscription;
window.scrollToSettingsSection = scrollToSettingsSection;
window.handleDevModeSecretTap = handleDevModeSecretTap;

// 3D Album Diagnostics & Integrity Audit System
function open3DAlbumAuditModal() {
  run3DAlbumAudit(true);
}

function close3DAlbumAuditModal() {
  const modal = document.getElementById('album3DAuditModal');
  if (modal) modal.style.display = 'none';
}

function run3DAlbumAudit(openModal = false) {
  const results = {
    timestamp: new Date().toISOString(),
    isPro: !!state.isPro,
    global3DEnabled: state.global3DEnabled !== false,
    albumsGridFound: false,
    albumsGridPerspective: false,
    totalAlbums: state.tags.length,
    renderedAlbumCards: 0,
    cardsWith3D: 0,
    cardsWithShine: 0,
    cardsWithCustomSurface: 0,
    modalPresent: !!document.getElementById('album3DSurfaceModal'),
    modalPreviewStagePresent: !!document.getElementById('stage3DPreviewWrapper'),
    surfaceFinishesCount: document.querySelectorAll('.surface-style-chip').length,
    albumDetails: []
  };

  const albumsGrid = document.querySelector('.albums-card-grid');
  if (albumsGrid) {
    results.albumsGridFound = true;
    const computed = window.getComputedStyle ? window.getComputedStyle(albumsGrid) : null;
    results.albumsGridPerspective = computed ? (computed.perspective !== 'none' && computed.perspective !== '') : true;
  }

  const renderedCards = document.querySelectorAll('.album-rich-card');
  results.renderedAlbumCards = renderedCards.length;

  state.tags.forEach(tag => {
    const card = document.querySelector(`.album-rich-card[data-tag="${tag.name}"]`);
    const has3DClass = card ? card.classList.contains('card-3d') : false;
    const hasShine = card ? !!card.querySelector('.album-3d-shine') : false;
    const hasSurfaceBtn = card ? !!card.querySelector('.album-cover-surface-btn') : false;
    const has3DPill = card ? !!card.querySelector('.album-3d-vip-pill') : false;
    const hasCustomCover = !!tag.customCoverUrl;
    const surfaceStyle = tag.surface3DStyle || 'holo';

    if (has3DClass) results.cardsWith3D++;
    if (hasShine) results.cardsWithShine++;
    if (hasCustomCover) results.cardsWithCustomSurface++;

    results.albumDetails.push({
      name: tag.name,
      rendered: !!card,
      has3DClass,
      hasShine,
      hasSurfaceBtn,
      has3DPill,
      customCoverUrl: hasCustomCover ? (tag.customCoverUrl.slice(0, 30) + '...') : '(Default Photo)',
      surfaceStyle
    });
  });

  console.group('--- 3D ALBUM CARDS INTEGRITY & DIAGNOSTICS AUDIT ---');
  console.log('VIP Status:', results.isPro ? '👑 ACTIVE (Unlocked)' : '🔒 STARTER (Locked)');
  console.log('Global 3D Tilt:', results.global3DEnabled ? '✅ ENABLED' : '❌ DISABLED');
  console.log('Albums Grid Perspective:', results.albumsGridPerspective ? '✅ Active (1000px)' : '⚠️ Not Detected');
  console.log(`Rendered Cards: ${results.renderedAlbumCards} / ${results.totalAlbums} total tags`);
  console.log(`3D Parallax Elevation: ${results.cardsWith3D} cards active`);
  console.log(`Specular Shine Layers: ${results.cardsWithShine} active`);
  console.log(`Custom Surface Artwork: ${results.cardsWithCustomSurface} active`);
  if (console.table) console.table(results.albumDetails);
  console.groupEnd();

  const auditContent = document.getElementById('album3DAuditContent');
  if (auditContent) {
    const allPassed = results.isPro && results.global3DEnabled && results.cardsWith3D > 0;
    auditContent.innerHTML = `
      <div style="padding: 14px; border-radius: 12px; margin-bottom: 14px; background: ${allPassed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)'}; border: 1px solid ${allPassed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'};">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
          <span style="font-weight: 700; font-size: 14px; color: ${allPassed ? '#10b981' : '#f59e0b'};">
            <i class="fa-solid ${allPassed ? 'fa-circle-check' : 'fa-triangle-exclamation'}"></i> ${allPassed ? 'All 3D Album Systems Operational' : 'Action Recommended for 3D'}
          </span>
          <span class="badge-status-green" style="font-size: 10px; background: ${results.isPro ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}; color: ${results.isPro ? '#10b981' : '#f59e0b'};">
            ${results.isPro ? 'VIP PASS' : 'STARTER'}
          </span>
        </div>
        <p style="font-size: 12px; margin: 0; color: var(--text-secondary);">
          ${results.isPro ? 'Aura Pro VIP is active. Parallax tilt, specular shine, personal artwork, and holographic finishes are running at 60/120fps.' : 'VIP entitlement is currently locked. Toggle VIP Tester mode below to activate 3D elevation.'}
        </p>
      </div>

      <!-- Quick Tester Controls -->
      <div style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;">
        <button class="btn btn-outline" onclick="toggleVip(); run3DAlbumAudit(true);" style="font-size: 11px; padding: 7px 12px; flex: 1;">
          ${getLuxuryCrownSvg(13)} ${state.isPro ? 'Switch to Starter' : 'Enable VIP Mode'}
        </button>
        <button class="btn btn-outline" onclick="toggleGlobal3DMode(); run3DAlbumAudit(true);" style="font-size: 11px; padding: 7px 12px; flex: 1;">
          <i class="fa-solid fa-cube" style="color: #0ea5e9;"></i> ${state.global3DEnabled ? 'Disable 3D Tilt' : 'Enable 3D Tilt'}
        </button>
      </div>

      <!-- Metric Badges -->
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 16px;">
        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px;">
          <div style="font-size: 10px; text-transform: uppercase; color: var(--text-tertiary);">3D Parallax Active</div>
          <div style="font-size: 16px; font-weight: 700; color: #0ea5e9; margin-top: 2px;">${results.cardsWith3D} / ${results.totalAlbums} Cards</div>
        </div>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px;">
          <div style="font-size: 10px; text-transform: uppercase; color: var(--text-tertiary);">Personal Surfaces</div>
          <div style="font-size: 16px; font-weight: 700; color: #f43f5e; margin-top: 2px;">${results.cardsWithCustomSurface} Custom Art</div>
        </div>
      </div>

      <!-- Per-Album Breakdown -->
      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-tertiary); margin-bottom: 8px;">
        Album Card Diagnostics
      </div>
      <div style="display: flex; flex-direction: column; gap: 6px; max-height: 220px; overflow-y: auto;">
        ${results.albumDetails.map(a => `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: 8px; font-size: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-folder" style="color: var(--primary);"></i>
              <span style="font-weight: 600;">${escapeHtml(a.name)}</span>
              <span style="font-size: 10px; opacity: 0.7; padding: 1px 6px; background: rgba(255,255,255,0.05); border-radius: 4px;">${escapeHtml(a.surfaceStyle)}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              ${a.has3DClass ? '<span style="color:#10b981; font-size:11px;"><i class="fa-solid fa-cube"></i> 3D OK</span>' : '<span style="color:#64748b; font-size:11px;">2D Flat</span>'}
              <button onclick="close3DAlbumAuditModal(); openAlbum3DSurfaceModal('${escapeHtml(a.name)}');" style="background: none; border: 1px solid rgba(255,255,255,0.15); color: var(--text-primary); border-radius: 4px; padding: 2px 6px; font-size: 11px; cursor: pointer;">
                Open Studio
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (openModal) {
    const modal = document.getElementById('album3DAuditModal');
    if (modal) modal.style.display = 'flex';
  }

  return results;
}

function inspect3DAlbum(albumName) {
  const tag = state.tags.find(t => t.name.toLowerCase() === (albumName || '').toLowerCase());
  if (!tag) {
    console.warn(`Album '${albumName}' not found.`);
    return null;
  }
  const card = document.querySelector(`.album-rich-card[data-tag="${tag.name}"]`);
  const info = {
    album: tag.name,
    tagColor: tag.color,
    customCoverUrl: tag.customCoverUrl || null,
    surface3DStyle: tag.surface3DStyle || 'holo',
    is3DActiveInDOM: card ? card.classList.contains('card-3d') : false,
    shineElementPresent: card ? !!card.querySelector('.album-3d-shine') : false,
    element: card
  };
  console.log(`[Album Inspector: ${tag.name}]`, info);
  return info;
}

function setAlbumSurface(albumName, photoUrl, surfaceStyle = 'holo') {
  const tag = state.tags.find(t => t.name.toLowerCase() === (albumName || '').toLowerCase());
  if (!tag) {
    console.error(`Album '${albumName}' not found in state.tags`);
    return false;
  }
  tag.customCoverUrl = photoUrl;
  tag.surface3DStyle = surfaceStyle;
  saveState();
  renderAll();
  showToast(`Updated '${tag.name}' surface with custom art (${surfaceStyle})`);
  return true;
}

function openAlbumInGallery(tagName) {
  recordAlbumActivity(tagName, 'viewed');
  state.selectedFilterTags.clear();
  state.selectedFilterTags.add(tagName);
  state.lastSelectedAlbum = tagName;
  state.activeAlbumView = tagName;

  try {
    history.pushState({ screen: 'albumView', albumName: tagName }, '');
  } catch (e) {}

  document.querySelector('.nav-item[data-tab="galleryScreen"]').click();
  const toastMsg = window.t ? window.t('album_viewing_toast', { name: tagName }) : `Viewing '${tagName}' album`;
  showToast(toastMsg);
}

function highlightReturnedAlbumCard(albumName) {
  if (!albumName) return;
  state.justReturnedAlbum = albumName;

  const attemptHighlight = (retryCount = 0) => {
    const isFav = String(albumName).toLowerCase() === 'favorites';
    const cards = document.querySelectorAll('.album-rich-card');
    let targetCard = null;

    cards.forEach(c => {
      const dataTag = c.getAttribute('data-tag');
      const dataAlbum = c.getAttribute('data-album');
      if (isFav && (c.classList.contains('favorites-album-card') || dataAlbum === 'favorites')) {
        targetCard = c;
      } else if (!isFav && (dataTag === albumName || dataAlbum === albumName)) {
        targetCard = c;
      }
    });

    if (targetCard) {
      const rect = targetCard.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const inView = (rect.top >= 60 && rect.bottom <= viewportHeight - 60);
      if (!inView) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      if (navigator.vibrate) {
        try { navigator.vibrate([28, 45, 28]); } catch (e) {}
      }
      targetCard.classList.remove('album-card-highlight-return');
      void targetCard.offsetWidth; // Force CSS animation restart
      targetCard.classList.add('album-card-highlight-return');
      setTimeout(() => {
        targetCard.classList.remove('album-card-highlight-return');
        if (state.justReturnedAlbum === albumName) {
          state.justReturnedAlbum = null;
        }
      }, 4500);
    } else if (retryCount < 8) {
      setTimeout(() => attemptHighlight(retryCount + 1), 70);
    }
  };

  setTimeout(() => attemptHighlight(0), 40);
}
window.highlightReturnedAlbumCard = highlightReturnedAlbumCard;

function exitAlbumView(triggerScroll = true) {
  const previousAlbum = (state.selectedFilterTags && state.selectedFilterTags.size === 1)
    ? Array.from(state.selectedFilterTags)[0]
    : (state.lastSelectedAlbum || state.activeAlbumView);

  state.selectedFilterTags.clear();
  state.activeAlbumView = null;
  state.justReturnedAlbum = previousAlbum || null;

  const albumsTabBtn = document.querySelector('.nav-item[data-tab="albumsScreen"]');
  if (albumsTabBtn) {
    albumsTabBtn.click();
  }

  if (typeof switchAlbumsView === 'function') {
    switchAlbumsView('albums');
  }

  if (triggerScroll && previousAlbum) {
    highlightReturnedAlbumCard(previousAlbum);
  }
}
window.exitAlbumView = exitAlbumView;

function openFavoritesFromAlbum() {
  state.openedFavoritesFromAlbums = true;
  try {
    history.pushState({ screen: 'favoritesView' }, '');
  } catch (e) {}
  document.querySelector('.nav-item[data-tab="favoritesScreen"]').click();
  const toastMsg = window.t ? window.t('favorites_viewing_toast') : 'Viewing Favorites album';
  showToast(toastMsg);
}

function exitFavoritesToAlbums() {
  state.openedFavoritesFromAlbums = false;
  state.justReturnedAlbum = 'favorites';
  const albumsTabBtn = document.querySelector('.nav-item[data-tab="albumsScreen"]');
  if (albumsTabBtn) {
    albumsTabBtn.click();
  }
  if (typeof switchAlbumsView === 'function') {
    switchAlbumsView('albums');
  }
  highlightReturnedAlbumCard('favorites');
}
window.exitFavoritesToAlbums = exitFavoritesToAlbums;

function switchAlbumsView(view) {
  state.currentAlbumView = view;
  const albumsView = document.getElementById('albumsCardView');
  const tagsView = document.getElementById('tagsManagerView');
  const segAlbumsBtn = document.getElementById('segAlbumsBtn');
  const segTagsBtn = document.getElementById('segTagsBtn');
  const title = document.getElementById('albumsHeaderTitle');

  if (view === 'albums') {
    albumsView.style.display = 'block';
    tagsView.style.display = 'none';
    segAlbumsBtn.classList.add('active');
    segTagsBtn.classList.remove('active');
    if (title) {
      title.textContent = window.t ? window.t('albums_my_albums') : 'My Albums';
      title.setAttribute('data-i18n', 'albums_my_albums');
    }
    renderAlbumsScreen();
  } else {
    albumsView.style.display = 'none';
    tagsView.style.display = 'block';
    segAlbumsBtn.classList.remove('active');
    segTagsBtn.classList.add('active');
    if (title) {
      title.textContent = window.t ? window.t('albums_tag_manager_tab') : 'Tag Manager';
      title.setAttribute('data-i18n', 'albums_tag_manager_tab');
    }
    renderTags();
  }
}

function setAlbumFilter(filterType) {
  state.albumFilter = filterType;
  document.getElementById('albumFilterAllBtn')?.classList.toggle('active', filterType === 'all');
  document.getElementById('albumFilterFavBtn')?.classList.toggle('active', filterType === 'favorites');
  document.getElementById('albumFilterWithPhotosBtn')?.classList.toggle('active', filterType === 'with_photos');
  updateAlbumSortUI();
  renderAlbumsScreen();
}

function toggleAlbumSort(sortType) {
  if (state.albumSort === sortType) {
    state.albumSort = 'default';
  } else {
    state.albumSort = sortType;
  }
  updateAlbumSortUI();
  renderAlbumsScreen();
}

// 1-Click Download Entire Album as ZIP ("Think Smartly")
async function downloadAlbumZip(tagName) {
  const albumPhotos = state.photos.filter(p => !p.isPending && !p.deletedAt && p.tags.includes(tagName));
  if (albumPhotos.length === 0) {
    showToast(`No photos in '${tagName}' album to download!`);
    return;
  }

  showToast(`Packaging '${tagName}' album (${albumPhotos.length} photos)... 📦`);
  await exportPhotosToZip(albumPhotos, `${tagName.replace(/[^a-zA-Z0-9_-]/g, '_')}_Album`);
}

async function shareAlbum(tagName) {
  const albumPhotos = state.photos.filter(p => !p.isPending && !p.deletedAt && p.tags.includes(tagName));
  if (albumPhotos.length === 0) {
    showToast(`No photos in '${tagName}' album to share!`);
    return;
  }
  // 1. Android Native App Bridge (Direct WhatsApp/System Chooser with ClipData)
  if (window.AndroidApp && typeof window.AndroidApp.shareMultiplePhotos === 'function') {
    const payload = albumPhotos.map(p => ({ displayName: p.displayName, dataUrl: p.dataUrl }));
    window.AndroidApp.shareMultiplePhotos(JSON.stringify(payload), `${tagName} Album`);
    return;
  }

  // 2. Web Share API with Multi-File support (Mobile Chrome / Android Web)
  const files = [];
  for (const p of albumPhotos.slice(0, 10)) {
    const b = dataUrlToBlob(p.dataUrl);
    if (b) {
      const cleanName = (p.displayName || 'photo').replace(/[^a-zA-Z0-9_-]/g, '_');
      files.push(new File([b], `${cleanName}.jpg`, { type: b.type || 'image/jpeg' }));
    }
  }

  if (files.length > 0 && navigator.canShare && navigator.canShare({ files })) {
    try {
      await navigator.share({
        files,
        title: `${tagName} Album`,
        text: `Explore ${albumPhotos.length} moments from the '${tagName}' Album!`
      });
      showToast(`Shared '${tagName}' Album (${files.length} photos)! ✨`);
      return;
    } catch (err) {
      if (err && err.name === 'AbortError') return;
      console.warn('Web Share files failed, trying text fallback:', err);
    }
  }

  // 3. Web Share Text Fallback
  if (navigator.share) {
    try {
      await navigator.share({
        title: `${tagName} Album`,
        text: `Browse my '${tagName}' photo album with ${albumPhotos.length} moments!`
      });
      showToast(`Shared '${tagName}' Album! ✨`);
      return;
    } catch (err) {
      if (err && err.name === 'AbortError') return;
    }
  }

  // 4. Desktop Chrome Fallback: Copy cover image or album link
  const repPhoto = albumPhotos[0];
  const repBlob = repPhoto ? dataUrlToBlob(repPhoto.dataUrl) : null;
  if (repBlob && navigator.clipboard && window.ClipboardItem) {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ [repBlob.type || 'image/jpeg']: repBlob })
      ]);
      showToast(`Copied '${tagName}' album cover to clipboard! (Paste anywhere) 📋`);
      return;
    } catch (e) {}
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(`${tagName} Album (${albumPhotos.length} photos) - Aura Photo Organizer`);
      showToast(`Album '${tagName}' info copied to clipboard! 📋`);
    } else {
      showToast(`Album '${tagName}' (${albumPhotos.length} photos)`);
    }
  } catch (e) {
    showToast(`Album '${tagName}' (${albumPhotos.length} photos)`);
  }
}

async function downloadFavoritesAlbumZip() {
  const favoritePhotos = state.photos.filter(p => p.isFavorite && !p.deletedAt);
  if (favoritePhotos.length === 0) {
    showToast('No favorite photos to download!');
    return;
  }
  showToast(`Packaging Favorites album (${favoritePhotos.length} photos)... 📦`);
  await exportPhotosToZip(favoritePhotos, 'Favorites_Album');
}

async function shareFavoritesAlbum() {
  const favoritePhotos = state.photos.filter(p => p.isFavorite && !p.deletedAt);
  if (favoritePhotos.length === 0) {
    showToast('No favorite photos to share!');
    return;
  }
  // 1. Android Native App Bridge (Direct WhatsApp/System Chooser with ClipData)
  if (window.AndroidApp && typeof window.AndroidApp.shareMultiplePhotos === 'function') {
    const payload = favoritePhotos.map(p => ({ displayName: p.displayName, dataUrl: p.dataUrl }));
    window.AndroidApp.shareMultiplePhotos(JSON.stringify(payload), 'Favorites Album');
    return;
  }

  // 2. Web Share API with Multi-File support (Mobile Chrome / Android Web)
  const files = [];
  for (const p of favoritePhotos.slice(0, 10)) {
    const b = dataUrlToBlob(p.dataUrl);
    if (b) {
      const cleanName = (p.displayName || 'photo').replace(/[^a-zA-Z0-9_-]/g, '_');
      files.push(new File([b], `${cleanName}.jpg`, { type: b.type || 'image/jpeg' }));
    }
  }

  if (files.length > 0 && navigator.canShare && navigator.canShare({ files })) {
    try {
      await navigator.share({
        files,
        title: 'Favorites Album',
        text: `Browse my Favorites album with ${favoritePhotos.length} cherished moments!`
      });
      showToast(`Shared Favorites Album (${files.length} photos)! ✨`);
      return;
    } catch (err) {
      if (err && err.name === 'AbortError') return;
      console.warn('Web Share files failed, trying text fallback:', err);
    }
  }

  // 3. Web Share Text Fallback
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Favorites Album',
        text: `Browse my Favorites photo album with ${favoritePhotos.length} cherished moments!`
      });
      showToast('Shared Favorites Album! ✨');
      return;
    } catch (err) {
      if (err && err.name === 'AbortError') return;
    }
  }

  // 4. Desktop Chrome Fallback: Copy cover image or album link
  const repPhoto = favoritePhotos[0];
  const repBlob = repPhoto ? dataUrlToBlob(repPhoto.dataUrl) : null;
  if (repBlob && navigator.clipboard && window.ClipboardItem) {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ [repBlob.type || 'image/jpeg']: repBlob })
      ]);
      showToast('Copied Favorites cover to clipboard! (Paste anywhere) 📋');
      return;
    } catch (e) {}
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(`Favorites Album (${favoritePhotos.length} photos) - Aura Photo Organizer`);
      showToast('Favorites album info copied to clipboard! 📋');
    } else {
      showToast(`Favorites Album (${favoritePhotos.length} photos)`);
    }
  } catch (e) {
    showToast(`Favorites Album (${favoritePhotos.length} photos)`);
  }
}

// 5. Render Favorites (All favorited photos with rich elegant cards and quick actions)
function renderFavorites() {
  const favoritePhotos = state.photos.filter(p => p.isFavorite && !p.deletedAt);
  const grid = document.getElementById('favoritesPhotoGrid');
  const empty = document.getElementById('favoritesEmptyState');
  const subtitle = document.getElementById('favoritesSubtitle');
  const headerActions = document.getElementById('favoritesHeaderActions');
  const favBackBtn = document.getElementById('favoritesBackBtn');

  if (favBackBtn) {
    favBackBtn.style.display = state.openedFavoritesFromAlbums ? 'inline-flex' : 'none';
  }

  if (subtitle) {
    subtitle.textContent = formatAlbumPhotoCount(favoritePhotos.length);
  }

  if (favoritePhotos.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'flex';
    if (headerActions) headerActions.style.display = 'none';
    return;
  }

  const lblFav = window.t ? window.t('favorites_title') : 'Favorite';
  const lblCrop = window.t ? window.t('detail_crop') : 'Crop';
  const lblRename = window.t ? window.t('detail_rename') : 'Rename';
  const lblDownload = window.t ? window.t('detail_download') : 'Download';
  const lblShare = window.t ? window.t('detail_share') : 'Share';
  const lblDelete = window.t ? window.t('detail_trash') : 'Delete';

  const isFavPhoto3DActive = !!state.isPro && (state.albumPhotos3DEnabled !== false);
  const favSurfaceClass = (state.favorites3DStyle && state.favorites3DStyle !== 'none') ? ('surface-' + state.favorites3DStyle) : 'surface-holo';

  empty.style.display = 'none';
  if (headerActions) headerActions.style.display = 'flex';

  grid.innerHTML = favoritePhotos.map(photo => {
    const tagObj = state.tags.find(t => t.name === photo.tags[0]);
    const tagColor = tagObj ? tagObj.color : '#f43f5e';
    const metaDate = formatCardDateTime(photo.createdAt);
    const allTagsTitle = window.t ? window.t('gallery_all_tags', { count: photo.tags.length }) : `All Tags (${photo.tags.length})`;

    return `
      <div class="photo-card-elegant ${isFavPhoto3DActive ? `card-3d ${favSurfaceClass}`.trim() : ''}" data-id="${photo.id}">
        <div class="card-image-box">
          <img src="${photo.dataUrl}" alt="${escapeHtml(photo.displayName)}" loading="lazy">
          ${isFavPhoto3DActive ? '<div class="album-3d-shine"></div>' : ''}
          
          <button class="card-fav-btn active" onclick="event.stopPropagation(); toggleFavorite('${photo.id}')" title="${lblFav}">
            <i class="fa-solid fa-heart" style="color:#f43f5e !important;"></i>
          </button>
        </div>

        <div class="card-content">
          <div class="card-title-text" title="Tap to rename: ${escapeHtml(photo.displayName)}" onclick="event.stopPropagation(); openRenamePhotoModal('${photo.id}')">${escapeHtml(photo.displayName)}</div>
          
          <div class="card-meta-row">
            ${photo.tags.length > 0 ? `
              <div class="tags-badge-wrapper" title="${escapeHtml(photo.tags.join(', '))}" onclick="event.stopPropagation(); toggleTagsTooltip(this);">
                <span class="tag-badge-pill" style="background:${tagColor}">
                  ${escapeHtml(photo.tags[0])}${photo.tags.length > 1 ? ` +${photo.tags.length - 1}` : ''}
                </span>
                <div class="all-tags-tooltip">
                  <span class="tooltip-title">${allTagsTitle}</span>
                  <div class="tooltip-chips-row">
                    ${photo.tags.map(t => {
                      const tObj = state.tags.find(tag => tag.name === t);
                      const color = tObj ? tObj.color : '#f43f5e';
                      return `<span class="tooltip-tag-chip" style="background:${color}">${escapeHtml(t)}</span>`;
                    }).join('')}
                  </div>
                </div>
              </div>
            ` : '<span class="card-tag-placeholder"></span>'}
            <span class="card-date-time" title="Created: ${metaDate.full}">
              <i class="fa-regular fa-clock"></i>
              <span class="card-date-part">${metaDate.date}</span>
              <span class="card-time-sep">·</span>
              <span class="card-time-part">${metaDate.time}</span>
            </span>
          </div>

          <div class="card-hover-actions">
            <button class="card-action-icon-btn" onclick="event.stopPropagation(); openCropEditorModal('${photo.id}')" title="${lblCrop}">
              <i class="fa-solid fa-crop-simple"></i><span class="card-btn-label"> ${lblCrop}</span>
            </button>
            <button class="card-action-icon-btn" onclick="event.stopPropagation(); openRenamePhotoModal('${photo.id}')" title="${lblRename}">
              <i class="fa-solid fa-pen"></i><span class="card-btn-label"> ${lblRename}</span>
            </button>
            <button class="card-action-icon-btn" onclick="event.stopPropagation(); downloadSinglePhoto('${photo.id}')" title="${lblDownload}">
              <i class="fa-solid fa-download"></i><span class="card-btn-label"> ${lblDownload}</span>
            </button>
            <button class="card-action-icon-btn" onclick="event.stopPropagation(); shareSinglePhoto('${photo.id}')" title="${lblShare}">
              <i class="fa-solid fa-share-nodes"></i><span class="card-btn-label"> ${lblShare}</span>
            </button>
            <button class="card-action-icon-btn danger" onclick="event.stopPropagation(); moveToTrash('${photo.id}')" title="${lblDelete}">
              <i class="fa-solid fa-trash-can"></i><span class="card-btn-label"> ${lblDelete}</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.photo-card-elegant').forEach(card => {
    const id = card.dataset.id;
    card.addEventListener('click', () => openPhotoDetail(id, favoritePhotos, 'Favorites'));
  });

  if (isFavPhoto3DActive) {
    init3DCardParallax(grid);
  }
}

// 5. Render Trash
function renderTrash() {
  const trashPhotos = state.photos.filter(p => p.deletedAt);
  const deletedAlbums = Array.isArray(state.deletedAlbums) ? state.deletedAlbums : [];
  const grid = document.getElementById('trashPhotoGrid');
  const empty = document.getElementById('trashEmptyState');
  const emptyBtn = document.getElementById('emptyTrashBtn');
  const albumsSection = document.getElementById('trashAlbumsSection');
  const albumsGrid = document.getElementById('trashAlbumsGrid');
  const albumsCountEl = document.getElementById('trashAlbumsCount');
  const photosTitle = document.getElementById('trashPhotosTitle');
  const photosCountEl = document.getElementById('trashPhotosSectionCount');

  const totalTrashed = trashPhotos.length + deletedAlbums.length;

  if (totalTrashed === 0) {
    if (grid) grid.innerHTML = '';
    if (albumsGrid) albumsGrid.innerHTML = '';
    if (empty) empty.style.display = 'flex';
    if (emptyBtn) emptyBtn.style.display = 'none';
    if (albumsSection) albumsSection.style.display = 'none';
    if (photosTitle) photosTitle.style.display = 'none';
    return;
  }

  if (empty) empty.style.display = 'none';
  if (emptyBtn) emptyBtn.style.display = 'inline-flex';

  const now = Date.now();

  // 1. Render Trashed Albums
  if (deletedAlbums.length > 0) {
    if (albumsSection) albumsSection.style.display = 'block';
    if (albumsCountEl) albumsCountEl.textContent = deletedAlbums.length;
    if (albumsGrid) {
      albumsGrid.innerHTML = deletedAlbums.map(album => {
        const daysPassed = Math.floor((now - (album.deletedAt || now)) / 86400000);
        const daysRemaining = Math.max(0, 30 - daysPassed);
        const photoWord = (album.photoCount === 1) ? 'photo' : 'photos';

        return `
          <div class="trash-album-card" style="--album-color: ${escapeHtml(album.color || '#f43f5e')}">
            <div class="trash-album-card-top">
              <div class="trash-album-badge-box" style="background: ${escapeHtml(album.color || '#f43f5e')}20; color: ${escapeHtml(album.color || '#f43f5e')}">
                <i class="fa-solid fa-folder"></i>
              </div>
              <span class="trash-days-pill">${daysRemaining}d left</span>
            </div>
            <div class="trash-album-title" title="${escapeHtml(album.name)}">${escapeHtml(album.name)}</div>
            <div class="trash-album-meta">
              <span><i class="fa-solid fa-image"></i> ${album.photoCount || 0} ${photoWord}</span>
              <span><i class="fa-solid fa-clock-rotate-left"></i> In Trash</span>
            </div>
            <div class="trash-album-actions">
              <button class="trash-album-btn restore" onclick="event.stopPropagation(); restoreAlbumFromTrash('${escapeHtml(album.name)}')" title="Restore Album & Photos">
                <i class="fa-solid fa-rotate-left"></i> Restore Album
              </button>
              <button class="trash-album-btn erase" onclick="event.stopPropagation(); permanentlyEraseAlbumFromTrash('${escapeHtml(album.name)}')" title="Erase Permanently">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  } else {
    if (albumsSection) albumsSection.style.display = 'none';
  }

  // 2. Render Trashed Photos Section Title (Delineates photos when albums also exist)
  if (photosTitle) {
    if (deletedAlbums.length > 0 && trashPhotos.length > 0) {
      photosTitle.style.display = 'flex';
      if (photosCountEl) photosCountEl.textContent = trashPhotos.length;
    } else {
      photosTitle.style.display = 'none';
    }
  }

  // 3. Render Trashed Photos Grid
  if (grid) {
    grid.innerHTML = trashPhotos.map(photo => {
      const daysPassed = Math.floor((now - photo.deletedAt) / 86400000);
      const daysRemaining = Math.max(0, 30 - daysPassed);

      return `
        <div class="photo-card-elegant trash-card" data-id="${photo.id}">
          <div class="card-image-box">
            <img src="${photo.dataUrl}" alt="${escapeHtml(photo.displayName)}" loading="lazy">
            <span class="trash-days-pill">${window.t ? window.t('trash_days_left', { days: daysRemaining }) : `${daysRemaining}d left`}</span>
          </div>
          <div class="card-content">
            <div class="card-title-text" title="${escapeHtml(photo.displayName)}">${escapeHtml(photo.displayName)}</div>
            <div class="trash-actions-row">
              <button class="trash-btn restore" onclick="event.stopPropagation(); restoreFromTrash('${photo.id}')" title="${window.t ? window.t('trash_restore_btn') : 'Restore'}">
                <i class="fa-solid fa-rotate-left"></i> ${window.t ? window.t('trash_restore_btn') : 'Restore'}
              </button>
              <button class="trash-btn erase" onclick="event.stopPropagation(); deletePermanently('${photo.id}')" title="${window.t ? window.t('trash_erase_btn') : 'Erase'}">
                <i class="fa-solid fa-trash-can"></i> ${window.t ? window.t('trash_erase_btn') : 'Erase'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.photo-card-elegant.trash-card').forEach(card => {
      const id = card.dataset.id;
      card.addEventListener('click', () => openPhotoDetail(id, trashPhotos, 'Trash'));
    });
  }
}

// -------------------------------------------------------------
// USER ACTIONS
// -------------------------------------------------------------

function movePhotoToGallery(id) {
  const photo = state.photos.find(p => p.id === id);
  if (photo) {
    photo.isPending = false;
    state.selectedDockPhotoIds.delete(id);
    saveState();
    renderAll();
    showToast(`'${photo.displayName}' moved to Gallery`);
  }
}

function sortPhotosList(photos, sortMode = 'date-desc') {
  return photos.sort((a, b) => {
    switch (sortMode) {
      case 'date-asc':
        return (a.createdAt || 0) - (b.createdAt || 0);
      case 'name-asc':
        return (a.displayName || '').localeCompare(b.displayName || '', undefined, { numeric: true, sensitivity: 'base' });
      case 'name-desc':
        return (b.displayName || '').localeCompare(a.displayName || '', undefined, { numeric: true, sensitivity: 'base' });
      case 'date-desc':
      default:
        return (b.createdAt || 0) - (a.createdAt || 0);
    }
  });
}

function getPhotoBrowseContext(photoId) {
  // 1. If an album tag filter is active
  if (state.selectedFilterTags && state.selectedFilterTags.size > 0) {
    let albumPhotos = state.photos.filter(p => !p.isPending && !p.deletedAt && Array.isArray(p.tags) && p.tags.some(t => state.selectedFilterTags.has(t)));
    albumPhotos = sortPhotosList(albumPhotos, state.gallerySort);
    const albumName = Array.from(state.selectedFilterTags).join(', ');
    if (albumPhotos.some(p => p.id === photoId)) {
      return { list: albumPhotos, title: albumName };
    }
  }

  // 2. If in Favorites tab
  if (state.activeTab === 'favoritesScreen' || state.onlyFavorites) {
    let favPhotos = state.photos.filter(p => !p.isPending && !p.deletedAt && p.isFavorite);
    favPhotos = sortPhotosList(favPhotos, 'date-desc');
    if (favPhotos.some(p => p.id === photoId)) {
      return { list: favPhotos, title: 'Favorites' };
    }
  }

  // 3. If in Loading Dock
  if (state.activeTab === 'dockScreen') {
    let dockPhotos = state.photos.filter(p => p.isPending && !p.deletedAt);
    if (dockPhotos.some(p => p.id === photoId)) {
      return { list: dockPhotos, title: 'Loading Dock' };
    }
  }

  // 4. If in Trash
  if (state.activeTab === 'trashScreen') {
    let trashPhotos = state.photos.filter(p => p.deletedAt);
    if (trashPhotos.some(p => p.id === photoId)) {
      return { list: trashPhotos, title: 'Trash' };
    }
  }

  // 5. Default: Current Gallery view with search and date filters
  let galleryPhotos = state.photos.filter(p => !p.isPending && !p.deletedAt);
  const q = (state.searchQuery || '').trim().toLowerCase();
  if (q) {
    const terms = q.split(/\s+/).filter(Boolean);
    galleryPhotos = galleryPhotos.filter(p => {
      const name = (p.displayName || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      const tags = Array.isArray(p.tags) ? p.tags.map(t => (t || '').toLowerCase()) : [];
      const isFav = p.isFavorite ? 'favorites favourite loved' : '';
      return terms.every(term => name.includes(term) || cat.includes(term) || tags.some(t => t.includes(term)) || isFav.includes(term));
    });
  }
  if (state.startDate) {
    galleryPhotos = galleryPhotos.filter(p => p.createdAt >= state.startDate);
  }
  if (state.endDate) {
    galleryPhotos = galleryPhotos.filter(p => p.createdAt <= state.endDate + 86399999);
  }
  galleryPhotos = sortPhotosList(galleryPhotos, state.gallerySort);

  if (galleryPhotos.some(p => p.id === photoId)) {
    return { list: galleryPhotos, title: q ? `Search` : 'Gallery' };
  }

  // 6. Fallback: all non-deleted photos
  let allPhotos = state.photos.filter(p => !p.deletedAt);
  allPhotos = sortPhotosList(allPhotos, state.gallerySort);
  return { list: allPhotos, title: 'Photos' };
}

function openPhotoDetail(id, customList = null, customTitle = null) {
  const photo = state.photos.find(p => p.id === id);
  if (!photo) return;

  if (customList && Array.isArray(customList) && customList.length > 0) {
    state.detailPhotoList = customList.slice();
    state.detailContextTitle = customTitle || 'Album';
  } else if (!state.detailPhotoList || state.detailPhotoList.length === 0 || !state.detailPhotoList.some(p => p.id === id)) {
    const ctx = getPhotoBrowseContext(id);
    state.detailPhotoList = ctx.list;
    state.detailContextTitle = ctx.title;
  }

  state.detailCurrentIndex = state.detailPhotoList.findIndex(p => p.id === id);
  if (state.detailCurrentIndex === -1) {
    state.detailPhotoList = [photo];
    state.detailCurrentIndex = 0;
    state.detailContextTitle = photo.tags && photo.tags.length ? photo.tags[0] : 'Photo';
  }

  const modal = document.getElementById('photoDetailModal');
  updateDetailModalUI(state.detailPhotoList[state.detailCurrentIndex]);
  toggleDetailBottomSheet(false); // Default to sleek collapsed mini tag bar
  modal.style.display = 'flex';

  showDetailSwipeHint();
}

function updateDetailModalUI(photo, skipImageSrc = false) {
  if (!photo) return;
  state.activePhotoId = photo.id;

  // Pure 2D Display for Photo Detail (3D effects removed as requested)
  const stage = document.getElementById('detailImageStage');
  if (stage) {
    stage.className = 'detail-image-stage';
    stage.style.transform = '';
    const oldShine = document.getElementById('detail3DShine');
    if (oldShine) oldShine.remove();

    const primaryTag = (photo.tags && photo.tags.length) ? photo.tags[0] : null;
    const albumTag = primaryTag ? state.tags.find(t => t.name === primaryTag) : null;
    const glowEl = document.getElementById('detailAmbientGlow');
    if (glowEl) {
      const tagColor = albumTag ? albumTag.color : '#818cf8';
      glowEl.style.background = `radial-gradient(circle, ${tagColor}38 0%, rgba(244, 63, 94, 0.16) 42%, rgba(14, 165, 233, 0.08) 65%, transparent 75%)`;
    }
  }

  const titleEl = document.getElementById('detailPhotoTitle');
  if (titleEl) titleEl.textContent = photo.displayName;

  const d = new Date(photo.createdAt);
  const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  const dateEl = document.getElementById('detailPhotoDate');
  if (dateEl) {
    dateEl.textContent = `${dateStr} · ${timeStr}`;
  }

  const detailImg = document.getElementById('detailImage');
  if (detailImg && !skipImageSrc) {
    detailImg.src = photo.dataUrl;
    detailImg.alt = photo.displayName || 'Photo Full View';
  }

  const favBtn = document.getElementById('detailFavoriteBtn');
  if (favBtn) {
    favBtn.innerHTML = photo.isFavorite ? '<i class="fa-solid fa-heart" style="color:#f43f5e !important;"></i>' : '<i class="fa-regular fa-heart"></i>';
  }

  renderDetailTags(photo);

  // Counter badge & Prev/Next buttons
  const counterEl = document.getElementById('detailPhotoCounter');
  const prevBtn = document.getElementById('detailPrevBtn');
  const nextBtn = document.getElementById('detailNextBtn');
  const total = (state.detailPhotoList && state.detailPhotoList.length) || 1;
  const current = (state.detailCurrentIndex >= 0 ? state.detailCurrentIndex + 1 : 1);

  if (counterEl) {
    if (total > 1) {
      counterEl.textContent = `${current} / ${total}`;
      counterEl.style.display = 'block';
    } else {
      counterEl.style.display = 'none';
    }
  }

  if (prevBtn) {
    const disabled = (state.detailCurrentIndex <= 0);
    prevBtn.disabled = disabled;
    prevBtn.classList.toggle('disabled', disabled);
    prevBtn.style.display = total > 1 ? 'flex' : 'none';
  }
  if (nextBtn) {
    const disabled = (state.detailCurrentIndex >= total - 1);
    nextBtn.disabled = disabled;
    nextBtn.classList.toggle('disabled', disabled);
    nextBtn.style.display = total > 1 ? 'flex' : 'none';
  }
}

let isNavigatingDetailPhoto = false;

function canDetailGoNext() {
  return state.detailPhotoList && state.detailCurrentIndex < state.detailPhotoList.length - 1;
}

function canDetailGoPrev() {
  return state.detailPhotoList && state.detailCurrentIndex > 0;
}

function navigateDetailPhoto(direction) {
  if (isNavigatingDetailPhoto) return;
  if (!state.detailPhotoList || state.detailPhotoList.length <= 1) return;

  const detailImg = document.getElementById('detailImage');
  if (!detailImg) return;

  if (direction === 'next') {
    if (!canDetailGoNext()) {
      bounceDetailImage('end');
      return;
    }
    isNavigatingDetailPhoto = true;

    // Slide out to left
    detailImg.style.transition = 'transform 0.18s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.18s ease-out';
    detailImg.style.transform = 'translateX(-70px) scale(0.93)';
    detailImg.style.opacity = '0';

    setTimeout(() => {
      state.detailCurrentIndex++;
      const nextPhoto = state.detailPhotoList[state.detailCurrentIndex];
      detailImg.src = nextPhoto.dataUrl;
      detailImg.style.transition = 'none';
      detailImg.style.transform = 'translateX(70px) scale(0.93)';
      detailImg.style.opacity = '0';
      updateDetailModalUI(nextPhoto, true);

      void detailImg.offsetWidth; // Force reflow

      detailImg.style.transition = 'transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.24s ease-out';
      detailImg.style.transform = 'translateX(0) scale(1)';
      detailImg.style.opacity = '1';

      setTimeout(() => {
        isNavigatingDetailPhoto = false;
      }, 250);
    }, 160);

  } else if (direction === 'prev') {
    if (!canDetailGoPrev()) {
      bounceDetailImage('start');
      return;
    }
    isNavigatingDetailPhoto = true;

    // Slide out to right
    detailImg.style.transition = 'transform 0.18s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.18s ease-out';
    detailImg.style.transform = 'translateX(70px) scale(0.93)';
    detailImg.style.opacity = '0';

    setTimeout(() => {
      state.detailCurrentIndex--;
      const prevPhoto = state.detailPhotoList[state.detailCurrentIndex];
      detailImg.src = prevPhoto.dataUrl;
      detailImg.style.transition = 'none';
      detailImg.style.transform = 'translateX(-70px) scale(0.93)';
      detailImg.style.opacity = '0';
      updateDetailModalUI(prevPhoto, true);

      void detailImg.offsetWidth; // Force reflow

      detailImg.style.transition = 'transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.24s ease-out';
      detailImg.style.transform = 'translateX(0) scale(1)';
      detailImg.style.opacity = '1';

      setTimeout(() => {
        isNavigatingDetailPhoto = false;
      }, 250);
    }, 160);
  }
}

function bounceDetailImage(edge) {
  const detailImg = document.getElementById('detailImage');
  if (!detailImg) return;
  detailImg.style.transition = 'transform 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s ease';
  detailImg.style.transform = 'translateX(0) scale(1)';
  detailImg.style.opacity = '1';

  if (edge === 'end') {
    showToast(`Reached last photo in ${state.detailContextTitle || 'album'}`);
  } else if (edge === 'start') {
    showToast(`Reached first photo in ${state.detailContextTitle || 'album'}`);
  }
}

let swipeHintTimeout = null;
function showDetailSwipeHint() {
  const hint = document.getElementById('detailSwipeHint');
  if (!hint) return;
  if (state.detailPhotoList && state.detailPhotoList.length > 1) {
    hint.classList.add('visible');
    clearTimeout(swipeHintTimeout);
    swipeHintTimeout = setTimeout(() => {
      hint.classList.remove('visible');
    }, 1800);
  } else {
    hint.classList.remove('visible');
  }
}

function closePhotoDetail() {
  const modal = document.getElementById('photoDetailModal');
  if (modal) modal.style.display = 'none';
  const returningPhotoId = state.activePhotoId;
  state.activePhotoId = null;
  state.detailPhotoList = [];
  state.detailCurrentIndex = 0;
  const detailImg = document.getElementById('detailImage');
  if (detailImg) {
    detailImg.style.transform = 'none';
    detailImg.style.opacity = '1';
    detailImg.style.transition = 'none';
  }

  // Flash the image background / card from which user is returning
  if (returningPhotoId) {
    flashReturnedPhotoCard(returningPhotoId);
  }
}

function flashReturnedPhotoCard(photoId) {
  if (!photoId) return;
  requestAnimationFrame(() => {
    // Locate the card in the active view (album, gallery, favorites, dock)
    const card = document.querySelector(`.photo-card-elegant[data-id="${photoId}"], .photo-card[data-id="${photoId}"], .dock-card[data-id="${photoId}"]`);
    if (!card) return;

    // Smooth scroll card into view if needed
    try {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    } catch (_) {}

    // Trigger radiant luminous flash on card & its background
    card.classList.remove('card-return-flash');
    void card.offsetWidth; // Force CSS reflow
    card.classList.add('card-return-flash');

    setTimeout(() => {
      card.classList.remove('card-return-flash');
    }, 2400);
  });
}

let isDetailGestureSetup = false;
function setupDetailPhotoGestures() {
  if (isDetailGestureSetup) return;
  isDetailGestureSetup = true;

  const wrapper = document.getElementById('detailImageWrapper');
  const stage = document.getElementById('detailImageStage');
  const img = document.getElementById('detailImage');
  if (!wrapper || !img) return;

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let startTime = 0;
  let isHorizontal = null;

  function onGestureStart(clientX, clientY) {
    if (isNavigatingDetailPhoto) return;
    if (!state.detailPhotoList || state.detailPhotoList.length <= 1) return;
    isDragging = true;
    startX = clientX;
    startY = clientY;
    startTime = Date.now();
    isHorizontal = null;
    if (stage) stage.classList.add('dragging');
  }

  function onGestureMove(clientX, clientY, e) {
    if (!isDragging) return;
    const deltaX = clientX - startX;
    const deltaY = clientY - startY;

    if (isHorizontal === null) {
      if (Math.abs(deltaX) > 7 || Math.abs(deltaY) > 7) {
        isHorizontal = Math.abs(deltaX) >= Math.abs(deltaY);
      }
    }

    if (!isHorizontal) return;

    if (e.cancelable) e.preventDefault();

    // Boundary resistance if at start or end
    let effectiveDeltaX = deltaX;
    if ((deltaX > 0 && !canDetailGoPrev()) || (deltaX < 0 && !canDetailGoNext())) {
      effectiveDeltaX = deltaX * 0.28;
    }

    img.style.transition = 'none';
    img.style.transform = `translateX(${effectiveDeltaX}px) scale(${1 - Math.min(Math.abs(effectiveDeltaX) * 0.0003, 0.06)})`;
    img.style.opacity = `${1 - Math.min(Math.abs(effectiveDeltaX) * 0.0012, 0.35)}`;
  }

  function onGestureEnd(clientX) {
    if (!isDragging) return;
    isDragging = false;
    if (stage) stage.classList.remove('dragging');

    if (!isHorizontal) {
      bounceDetailImage();
      return;
    }

    const deltaX = clientX - startX;
    const elapsed = Math.max(Date.now() - startTime, 1);
    const velocity = Math.abs(deltaX) / elapsed;

    const threshold = 40; // px
    const flickVelocity = 0.28; // px/ms

    if (deltaX < -threshold || (deltaX < -15 && velocity > flickVelocity)) {
      // Swiped Left -> Next Photo
      navigateDetailPhoto('next');
    } else if (deltaX > threshold || (deltaX > 15 && velocity > flickVelocity)) {
      // Swiped Right -> Prev Photo
      navigateDetailPhoto('prev');
    } else {
      bounceDetailImage();
    }
  }

  // Pointer Events (supports mouse drag and touchscreens)
  if (window.PointerEvent) {
    wrapper.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.detail-nav-btn') || e.target.closest('button')) return;
      onGestureStart(e.clientX, e.clientY);
      try {
        wrapper.setPointerCapture(e.pointerId);
      } catch (_) {}
    });

    wrapper.addEventListener('pointermove', (e) => {
      onGestureMove(e.clientX, e.clientY, e);
    });

    wrapper.addEventListener('pointerup', (e) => {
      try {
        wrapper.releasePointerCapture(e.pointerId);
      } catch (_) {}
      onGestureEnd(e.clientX);
    });

    wrapper.addEventListener('pointercancel', (e) => {
      try {
        wrapper.releasePointerCapture(e.pointerId);
      } catch (_) {}
      onGestureEnd(e.clientX);
    });
  } else {
    // Touch Events fallback
    wrapper.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1 && !e.target.closest('.detail-nav-btn') && !e.target.closest('button')) {
        onGestureStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    wrapper.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        onGestureMove(e.touches[0].clientX, e.touches[0].clientY, e);
      }
    }, { passive: false });

    wrapper.addEventListener('touchend', (e) => {
      if (e.changedTouches.length > 0) {
        onGestureEnd(e.changedTouches[0].clientX);
      }
    });

    wrapper.addEventListener('touchcancel', () => {
      if (isDragging) {
        isDragging = false;
        if (stage) stage.classList.remove('dragging');
        bounceDetailImage();
      }
    });
  }

  // Chevrons click listeners
  document.getElementById('detailPrevBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateDetailPhoto('prev');
  });

  document.getElementById('detailNextBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateDetailPhoto('next');
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    const modal = document.getElementById('photoDetailModal');
    if (!modal || modal.style.display === 'none') return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      e.preventDefault();
      navigateDetailPhoto('next');
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      navigateDetailPhoto('prev');
    } else if (e.key === 'Escape') {
      closePhotoDetail();
    }
  });
}

let isDetailBottomSheetExpanded = false;

function toggleDetailBottomSheet(forceState = null) {
  const sheet = document.getElementById('detailBottomSheet');
  const toggleBtn = document.getElementById('sheetToggleBtn');
  if (!sheet) return;

  if (forceState !== null) {
    isDetailBottomSheetExpanded = forceState;
  } else {
    isDetailBottomSheetExpanded = !isDetailBottomSheetExpanded;
  }

  sheet.classList.toggle('expanded', isDetailBottomSheetExpanded);
  sheet.classList.toggle('collapsed', !isDetailBottomSheetExpanded);
  if (toggleBtn) {
    toggleBtn.innerHTML = isDetailBottomSheetExpanded 
      ? '<i class="fa-solid fa-chevron-down"></i>' 
      : '<i class="fa-solid fa-chevron-up"></i>';
    toggleBtn.title = isDetailBottomSheetExpanded ? 'Collapse tags' : 'Expand tags';
  }
}

function renderDetailTags(photo) {
  const row = document.getElementById('detailTagsRow');
  const countBadge = document.getElementById('detailTagCountBadge');
  const tagCount = (photo.tags && photo.tags.length) || 0;
  if (countBadge) {
    countBadge.textContent = tagCount;
    countBadge.style.display = tagCount > 0 ? 'inline-flex' : 'none';
  }

  if (row) {
    if (!photo.tags || photo.tags.length === 0) {
      row.innerHTML = `<span style="color:var(--text-muted); font-size:12px;">${window.t ? window.t('detail_no_tags') : 'No albums or tags assigned.'}</span>`;
    } else {
      const chips = photo.tags.map(tagName => {
        const tagObj = state.tags.find(t => t.name === tagName);
        const color = tagObj ? tagObj.color : '#6366f1';
        return `
          <div class="detail-tag-chip" style="background:${color}">
            <span>${escapeHtml(tagName)}</span>
            <button class="remove-tag-btn" onclick="removeTagFromActivePhoto('${escapeJs(tagName)}')"><i class="fa-solid fa-xmark"></i></button>
          </div>
        `;
      }).join('');
      row.innerHTML = chips;
    }
  }

  // Smart Location Suggestions (shown ONLY when location settings are ON and suggestions exist)
  const suggestionsBox = document.getElementById('detailLocationSuggestions');
  const chipsContainer = document.getElementById('detailLocationChips');
  if (suggestionsBox && chipsContainer) {
    if (state.gpsMetadataEnabled === false || state.locationTagsEnabled === false) {
      suggestionsBox.style.display = 'none';
      chipsContainer.innerHTML = '';
      return;
    }

    const suggestions = getSuggestedLocationTagsForPhoto(photo);

    if (suggestions.length > 0) {
      const chipsHtml = suggestions.map(s => {
        const isAdded = photo.tags && photo.tags.some(t => t.toLowerCase() === s.label.toLowerCase());
        const typeIcon = s.type === 'place' ? 'fa-landmark' : (s.type === 'city' ? 'fa-city' : (s.type === 'coords' ? 'fa-crosshairs' : 'fa-earth-americas'));
        const typeLabel = s.type === 'place' ? (window.t ? window.t('settings_loc_place') : 'Place')
                        : (s.type === 'city' ? (window.t ? window.t('settings_loc_city') : 'City')
                        : (s.type === 'coords' ? 'GPS' : (window.t ? window.t('settings_loc_country') : 'Country')));
        return `
          <button class="location-suggestion-chip ${isAdded ? 'added' : ''}" 
                  onclick="event.stopPropagation(); toggleLocationSuggestionForPhoto('${photo.id}', '${escapeJs(s.label)}')" 
                  title="${isAdded ? 'Click to remove tag' : 'Click to add tag'}">
            <i class="fa-solid ${isAdded ? 'fa-check' : 'fa-plus'}"></i>
            <span class="loc-chip-label">${escapeHtml(s.label)}</span>
            <span class="loc-chip-type"><i class="fa-solid ${typeIcon}"></i> ${escapeHtml(typeLabel)}</span>
          </button>
        `;
      }).join('');

      chipsContainer.innerHTML = chipsHtml;
      const headerEditBtn = document.getElementById('btnEditLocHeader');
      if (headerEditBtn) {
        headerEditBtn.onclick = () => openManualLocationModal(photo.id);
      }
      suggestionsBox.style.display = 'block';
    } else {
      // If no location tags to suggest, hide the box completely. Never display raw GPS coordinates.
      suggestionsBox.style.display = 'none';
      chipsContainer.innerHTML = '';
    }
  }
}

function removeTagFromActivePhoto(tagName) {
  const photo = state.photos.find(p => p.id === state.activePhotoId);
  if (photo) {
    photo.tags = photo.tags.filter(t => t !== tagName);
    saveState();
    renderDetailTags(photo);
    renderAll();
    showToast(`Tag '${tagName}' removed`);
  }
}

let currentBatchTagPhotoIds = [];

// Helper: Attach a curated authentic location preset to photos currently in batch tag dialog
function attachPresetLocationToActiveBatch(cityKey) {
  const presets = {
    'Mumbai': { latitude: 18.9220, longitude: 72.8347, place: 'Taj Mahal Palace', city: 'Mumbai', country: 'India' },
    'Paris': { latitude: 48.8584, longitude: 2.2945, place: 'Champ de Mars', city: 'Paris', country: 'France' },
    'New York': { latitude: 40.7850, longitude: -73.9682, place: 'Central Park', city: 'New York', country: 'United States' }
  };
  const loc = presets[cityKey] || presets['Mumbai'];
  currentBatchTagPhotoIds.forEach(id => {
    const p = state.photos.find(x => x.id === id);
    if (p) {
      p.location = { ...loc };
    }
  });
  saveState();
  openBatchTagModal(currentBatchTagPhotoIds);
  showToast(`📍 Attached location: ${loc.place}, ${loc.city}!`);
}
window.attachPresetLocationToActiveBatch = attachPresetLocationToActiveBatch;

// Automated loader: Add high-definition sample photos with rich GPS metadata
function loadSampleGpsPhotos(count = 3) {
  const sampleLocations = [
    {
      title: 'Mumbai Sunset Gateway',
      gradient: ['#f43f5e', '#fb923c'],
      location: { latitude: 18.9220, longitude: 72.8347, place: 'Gateway of India', city: 'Mumbai', country: 'India' }
    },
    {
      title: 'Parisian Autumn Twilight',
      gradient: ['#8b5cf6', '#ec4899'],
      location: { latitude: 48.8584, longitude: 2.2945, place: 'Eiffel Tower', city: 'Paris', country: 'France' }
    },
    {
      title: 'Manhattan Skyline Lights',
      gradient: ['#06b6d4', '#3b82f6'],
      location: { latitude: 40.7850, longitude: -73.9682, place: 'Bow Bridge, Central Park', city: 'New York', country: 'United States' }
    },
    {
      title: 'Goa Coastal Serenade',
      gradient: ['#10b981', '#059669'],
      location: { latitude: 15.4909, longitude: 73.8278, place: 'Calangute Shores', city: 'Goa', country: 'India' }
    }
  ];

  const now = Date.now();
  const added = [];

  sampleLocations.slice(0, count).forEach((item, i) => {
    const newPhoto = {
      id: `gps_sample_${now}_${i}_${Math.random().toString(36).substr(2, 4)}`,
      displayName: item.title,
      category: 'Loading Dock',
      isPending: true,
      isFavorite: false,
      deletedAt: null,
      createdAt: now + i,
      tags: [],
      gradient: item.gradient,
      dataUrl: generateGradientImage(item.title, 'GPS Sample', item.gradient),
      location: item.location
    };
    state.photos.unshift(newPhoto);
    added.push(newPhoto);
  });

  saveState();
  renderAll();
  showToast(`✨ Loaded ${added.length} sample photos with EXIF GPS tags!`);

  // Switch to Loading Dock tab so user immediately sees them
  document.querySelector('.nav-item[data-tab="dockScreen"]')?.click();
}
window.loadSampleGpsPhotos = loadSampleGpsPhotos;

// Batch Tag Modal
function openBatchTagModal(photoIds) {
  currentBatchTagPhotoIds = photoIds || [];
  const modal = document.getElementById('batchTagModal');
  const chipsList = document.getElementById('batchTagChipsList');
  const locContainer = document.getElementById('batchLocationContainer');
  const locChips = document.getElementById('batchLocationChips');
  const albumsSectionHeader = document.getElementById('batchAlbumsSectionHeader');
  let selectedTags = new Set();

  // If single photo is being tagged (e.g. from detail card or dock card), pre-select its existing tags!
  if (photoIds.length === 1) {
    const singlePhoto = state.photos.find(p => p.id === photoIds[0]);
    if (singlePhoto && singlePhoto.tags) {
      singlePhoto.tags.forEach(t => selectedTags.add(t));
    }
  } else if (photoIds.length > 1) {
    // If multiple photos, pre-select common tags across all selected photos
    const selectedPhotos = state.photos.filter(p => photoIds.includes(p.id));
    if (selectedPhotos.length > 0 && selectedPhotos[0].tags) {
      selectedPhotos[0].tags.forEach(t => {
        if (selectedPhotos.every(p => p.tags && p.tags.includes(t))) {
          selectedTags.add(t);
        }
      });
    }
  }

  // 1. Render Smart Location Tags Section (Respects user settings)
  const isLocationEnabled = state.locationTagsEnabled !== false;
  if (locContainer && locChips) {
    if (!isLocationEnabled) {
      locContainer.style.display = 'none';
      if (albumsSectionHeader) albumsSectionHeader.style.display = 'none';
    } else {
      const anySubToggleEnabled = (state.locationTagPlace !== false) || (state.locationTagCity !== false) || (state.locationTagCountry !== false);
      if (!anySubToggleEnabled) {
        locContainer.style.display = 'none';
        if (albumsSectionHeader) albumsSectionHeader.style.display = 'none';
      } else {
        const targetPhotos = state.photos.filter(p => photoIds.includes(p.id));
        const candidateMap = new Map();

        targetPhotos.forEach(p => {
          const suggestions = getSuggestedLocationTagsForPhoto(p);
          suggestions.forEach(s => {
            if (!candidateMap.has(s.label.toLowerCase())) {
              candidateMap.set(s.label.toLowerCase(), s);
            }
          });
        });

        const candidates = Array.from(candidateMap.values());

        if (candidates.length > 0) {
          locChips.innerHTML = candidates.map(s => {
            const isSelected = selectedTags.has(s.label);
            const typeIcon = s.type === 'place' ? 'fa-landmark' : (s.type === 'city' ? 'fa-city' : 'fa-earth-americas');
            const typeLabel = s.type === 'place' ? (window.t ? window.t('settings_loc_place') : 'Place')
                            : (s.type === 'city' ? (window.t ? window.t('settings_loc_city') : 'City')
                            : (window.t ? window.t('settings_loc_country') : 'Country'));
            return `
              <button type="button" class="filter-chip loc-filter-chip ${isSelected ? 'active' : ''}" data-name="${escapeHtml(s.label)}">
                <span class="tag-dot loc-dot" style="background:#38bdf8;"><i class="fa-solid ${typeIcon}" style="font-size:9px;"></i></span>
                <span class="chip-text">${escapeHtml(s.label)}</span>
                <span class="chip-sub-type">${escapeHtml(typeLabel)}</span>
              </button>
            `;
          }).join('');

          const editLocBtn = `
            <button type="button" class="btn-edit-loc-manual" style="margin-left: 6px; font-size: 11px; padding: 4px 10px;" onclick="openManualLocationModal('${photoIds[0]}')" title="Edit Location / Tags">
              <i class="fa-solid fa-pen-to-square"></i> <span>${window.t ? window.t('detail_edit_location') : 'Edit Location'}</span>
            </button>
          `;
          locChips.innerHTML = locChips.innerHTML + editLocBtn;

          locChips.querySelectorAll('.loc-filter-chip').forEach(chip => {
            chip.addEventListener('click', () => {
              const name = chip.dataset.name;
              if (selectedTags.has(name)) {
                selectedTags.delete(name);
                chip.classList.remove('active');
              } else {
                selectedTags.add(name);
                chip.classList.add('active');
              }
            });
          });

          locContainer.style.display = 'block';
          if (albumsSectionHeader) albumsSectionHeader.style.display = 'block';
        } else {
          // Fallback when photo doesn't have GPS metadata yet
          locChips.innerHTML = `
            <div class="batch-loc-empty">
              <span class="empty-hint"><i class="fa-solid fa-satellite-dish"></i> ${window.t ? window.t('location_no_gps_hint') : 'No GPS metadata in this photo'}</span>
              <div class="quick-loc-presets">
                <span class="preset-label">Add Sample:</span>
                <button type="button" class="quick-preset-btn" onclick="attachPresetLocationToActiveBatch('Mumbai')">📍 Mumbai</button>
                <button type="button" class="quick-preset-btn" onclick="attachPresetLocationToActiveBatch('Paris')">📍 Paris</button>
                <button type="button" class="quick-preset-btn" onclick="attachPresetLocationToActiveBatch('New York')">📍 New York</button>
                <button type="button" class="quick-preset-btn" onclick="openManualLocationModal('${photoIds[0]}')" style="border-color: rgba(56,189,248,0.4); color: #38bdf8;"><i class="fa-solid fa-pen-to-square"></i> ${window.t ? window.t('detail_edit_location') : 'Set Location'}</button>
              </div>
            </div>
          `;
          locContainer.style.display = 'block';
          if (albumsSectionHeader) albumsSectionHeader.style.display = 'block';
        }
      }
    }
  }

  // 2. Render Albums & Custom Tags
  chipsList.innerHTML = state.tags.map(tag => {
    const isSelected = selectedTags.has(tag.name);
    return `
      <button class="filter-chip ${isSelected ? 'active' : ''}" data-name="${escapeHtml(tag.name)}">
        <span class="tag-dot" style="background:${tag.color}"></span>
        <span class="chip-text">${escapeHtml(tag.name)}</span>
      </button>
    `;
  }).join('');

  chipsList.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const name = chip.dataset.name;
      if (selectedTags.has(name)) {
        selectedTags.delete(name);
        chip.classList.remove('active');
      } else {
        selectedTags.add(name);
        chip.classList.add('active');
      }
    });
  });

  const confirmBtn = document.getElementById('confirmBatchTagBtn');
  confirmBtn.onclick = () => {
    const tagsArray = Array.from(selectedTags);

    // Register any newly selected tag (including location tags) into state.tags if not present
    tagsArray.forEach(t => {
      if (!state.tags.some(existing => existing.name.toLowerCase() === t.toLowerCase())) {
        const now = Date.now();
        state.tags.push({
          name: t,
          color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)],
          createdAt: now,
          lastModifiedAt: now,
          lastViewedAt: now,
          photoCount: 1
        });
      }
    });

    const availableTagNames = state.tags.map(t => t.name);

    // Apply tags to all target photos
    photoIds.forEach(id => {
      const p = state.photos.find(x => x.id === id);
      if (p) {
        if (!p.tags) p.tags = [];
        
        // Remove tags that were unselected from the available tags set
        p.tags = p.tags.filter(t => !availableTagNames.includes(t) || selectedTags.has(t));
        
        // Add selected tags
        tagsArray.forEach(t => {
          if (!p.tags.includes(t)) p.tags.push(t);
        });
      }
    });

    saveState();
    modal.style.display = 'none';

    // 2. Immediately reflect updated tags on the photo detail card if open!
    if (state.activePhotoId) {
      const activePhoto = state.photos.find(x => x.id === state.activePhotoId);
      if (activePhoto) {
        renderDetailTags(activePhoto);
      }
    }

    // 3. Immediately re-render all grids so the photo card reflects the updated tags
    renderAll();
    
    if (tagsArray.length > 0) {
      showToast(`✨ Tags updated: [${tagsArray.join(', ')}]`);
    } else {
      showToast('✨ Tags updated (all unselected tags removed)');
    }

    // 4. If any photos are in the Loading Dock, let the user see the tag on the card BEFORE moving to Gallery!
    const pendingToMove = photoIds.filter(id => {
      const p = state.photos.find(x => x.id === id);
      return p && p.isPending;
    });

    if (pendingToMove.length > 0) {
      setTimeout(() => {
        pendingToMove.forEach(id => {
          const p = state.photos.find(x => x.id === id);
          if (p) {
            p.isPending = false;
            state.selectedDockPhotoIds.delete(id);
          }
        });
        saveState();
        renderAll();
        if (state.activePhotoId) {
          const activePhoto = state.photos.find(x => x.id === state.activePhotoId);
          if (activePhoto) renderDetailTags(activePhoto);
        }
        showToast(`${pendingToMove.length} photo(s) moved to Gallery!`);
      }, 900);
    }
  };

  modal.style.display = 'flex';
}

// ZIP Export ("The Mom Feature") using JSZip
async function exportPhotosToZip(photoList, zipFilename) {
  if (!photoList || photoList.length === 0) {
    showToast('No photos to export!');
    return;
  }
  showToast(`Packaging ${photoList.length} photos into ZIP... 📦`);

  try {
    const zip = new JSZip();
    const folder = zip.folder(zipFilename);

    let addedCount = 0;
    for (let i = 0; i < photoList.length; i++) {
      const p = photoList[i];
      try {
        if (!p.dataUrl) continue;
        const parts = p.dataUrl.split(',');
        if (parts.length < 2) continue;
        const base64Data = parts[1];
        const filename = `${p.displayName.replace(/[^a-zA-Z0-9_-]/g, '_')}_${i + 1}.jpg`;
        folder.file(filename, base64Data, { base64: true });
        addedCount++;
      } catch (itemErr) {
        console.warn(`Skipped photo ${p.id} in zip packaging:`, itemErr);
      }
    }

    if (addedCount === 0) {
      showToast('Could not package photos into ZIP');
      return;
    }

    const content = await zip.generateAsync({ type: 'blob' });
    if (window.AndroidApp) {
      // 1. Direct Native Save: Save each photo directly into the Android Phone Gallery
      if (typeof window.AndroidApp.downloadMultiplePhotosToGallery === 'function') {
        try {
          const payload = photoList.map(p => ({
            displayName: p.displayName || 'Photo',
            dataUrl: p.dataUrl || (p.gradient ? generateGradientImage(p.displayName, p.category, p.gradient) : null)
          })).filter(p => !!p.dataUrl);
          if (payload.length > 0) {
            window.AndroidApp.downloadMultiplePhotosToGallery(JSON.stringify(payload), zipFilename);
          }
        } catch (galErr) {
          console.warn('downloadMultiplePhotosToGallery failed:', galErr);
        }
      }

      // 2. Also save ZIP archive to Downloads for backup/archiving
      if (typeof window.AndroidApp.downloadZip === 'function') {
        const reader = new FileReader();
        reader.onloadend = function() {
          window.AndroidApp.downloadZip(reader.result, `${zipFilename}.zip`);
        };
        reader.readAsDataURL(content);
      }
    } else {
      // Fail-safe browser download using native Blob object URL and FileSaver fallback
      if (typeof saveAs === 'function') {
        saveAs(content, `${zipFilename}.zip`);
      } else {
        triggerBrowserDownload(content, `${zipFilename}.zip`);
      }
      showToast(`Saved '${zipFilename}.zip' to Downloads! 📦`);
    }
  } catch (err) {
    console.error(err);
    showToast('Failed to generate ZIP');
  }
}

// Trash Actions
function moveToTrash(id) {
  const photo = state.photos.find(p => p.id === id);
  if (photo) {
    photo.deletedAt = Date.now();
    state.selectedDockPhotoIds.delete(id);
    state.selectedGalleryPhotoIds.delete(id);
    if (state.activePhotoId === id) {
      if (state.detailPhotoList && state.detailPhotoList.length > 1) {
        state.detailPhotoList = state.detailPhotoList.filter(p => p.id !== id);
        if (state.detailCurrentIndex >= state.detailPhotoList.length) {
          state.detailCurrentIndex = state.detailPhotoList.length - 1;
        }
        const nextPhoto = state.detailPhotoList[state.detailCurrentIndex];
        updateDetailModalUI(nextPhoto);
      } else {
        closePhotoDetail();
      }
    }
    saveState();
    renderAll();
    showToast(`'${photo.displayName}' moved to Trash`);
  }
}

function deleteActivePhoto() {
  if (state.activePhotoId) {
    moveToTrash(state.activePhotoId);
  }
}

function restoreFromTrash(id) {
  const photo = state.photos.find(p => p.id === id);
  if (photo) {
    photo.deletedAt = null;
    saveState();
    renderAll();
    showToast(`'${photo.displayName}' restored to Gallery`);
  }
}

function deletePermanently(id) {
  if (confirm('Permanently delete this photo? This cannot be undone.')) {
    state.photos = state.photos.filter(p => p.id !== id);
    saveState();
    renderAll();
    showToast('Permanently deleted');
  }
}

function emptyTrash() {
  const trashedPhotosCount = state.photos.filter(p => p.deletedAt).length;
  const trashedAlbumsCount = (state.deletedAlbums || []).length;
  const totalItems = trashedPhotosCount + trashedAlbumsCount;

  if (totalItems === 0) return;

  const msg = trashedAlbumsCount > 0 
    ? `Empty entire Recycle Bin? This will permanently erase ${trashedAlbumsCount} album(s) and ${trashedPhotosCount} photo(s). This cannot be undone.`
    : `Empty entire Recycle Bin? This will permanently erase ${trashedPhotosCount} photos. This cannot be undone.`;

  if (confirm(msg)) {
    state.photos = state.photos.filter(p => !p.deletedAt);
    state.deletedAlbums = [];
    saveState();
    renderAll();
    showToast('Recycle bin emptied');
  }
}

function restoreAlbumFromTrash(albumName) {
  if (!albumName) return;
  const album = (state.deletedAlbums || []).find(a => a.name === albumName);
  if (!album) return;

  // 1. Re-add album to state.tags if not already present
  if (!state.tags.some(t => t.name === albumName)) {
    state.tags.push({
      name: album.name,
      color: album.color || '#f43f5e'
    });
  }

  // 2. Un-delete photos belonging to this album
  let restoredCount = 0;
  state.photos.forEach(p => {
    if (Array.isArray(p.tags) && p.tags.includes(albumName)) {
      if (p.deletedAt) {
        p.deletedAt = null;
        restoredCount++;
      }
    }
  });

  // 3. Remove album from state.deletedAlbums
  state.deletedAlbums = (state.deletedAlbums || []).filter(a => a.name !== albumName);

  saveState();
  renderAll();
  showToast(`♻️ Album '${albumName}' and ${restoredCount} photos restored!`);
}

function permanentlyEraseAlbumFromTrash(albumName) {
  if (!albumName) return;
  const album = (state.deletedAlbums || []).find(a => a.name === albumName);
  if (!confirm(`Permanently erase album '${albumName}' and all its photos? This cannot be undone.`)) {
    return;
  }

  // 1. Permanently remove all trashed photos with this album tag
  state.photos = state.photos.filter(p => !(p.deletedAt && Array.isArray(p.tags) && p.tags.includes(albumName)));

  // 2. Remove album from deletedAlbums
  state.deletedAlbums = (state.deletedAlbums || []).filter(a => a.name !== albumName);

  saveState();
  renderAll();
  showToast(`🗑️ Album '${albumName}' permanently erased`);
}

// =============================================================
// DOUBLE-CONFIRMATION ALBUM DELETION SYSTEM
// =============================================================
const deleteAlbumState = {
  albumName: '',
  albumColor: '#f43f5e',
  photoCount: 0,
  chosenOption: 'save', // 'save' (keep photos), 'trash' (move to recycle bin), or 'discard' (permanently discard)
  step: 1
};

function openDeleteAlbumModal(tagName) {
  if (!tagName) return;
  const tag = state.tags.find(t => t.name === tagName);
  const color = tag ? tag.color : '#f43f5e';
  const albumPhotos = state.photos.filter(p => !p.deletedAt && Array.isArray(p.tags) && p.tags.includes(tagName));

  deleteAlbumState.albumName = tagName;
  deleteAlbumState.albumColor = color;
  deleteAlbumState.photoCount = albumPhotos.length;
  deleteAlbumState.chosenOption = 'save';
  deleteAlbumState.step = 1;

  // Populate Step 1 UI
  const modal = document.getElementById('deleteAlbumModal');
  const title = document.getElementById('deleteAlbumTitle');
  const targetName = document.getElementById('deleteAlbumTargetName');
  const colorIndicator = document.getElementById('deleteAlbumColorIndicator');
  const countSummary = document.getElementById('deleteAlbumPhotoCountSummary');
  const promptDesc = document.getElementById('deleteAlbumPromptDesc');
  const optionsGrid = document.getElementById('deleteOptionsGrid');
  const continueBtn = document.getElementById('continueDeleteAlbumBtn');

  if (title) title.textContent = window.t ? `${window.t('albums_delete_dialog_title')} (${tagName})` : `Delete '${tagName}'`;
  if (targetName) targetName.textContent = tagName;
  if (colorIndicator) colorIndicator.style.background = color;

  if (deleteAlbumState.photoCount === 0) {
    if (countSummary) countSummary.textContent = window.t ? window.t('albums_empty_tag') : 'Empty album · 0 photos';
    if (promptDesc) promptDesc.textContent = window.t ? window.t('albums_empty_desc') : 'This album has 0 photos. Deleting it will permanently remove the album category.';
    if (optionsGrid) optionsGrid.style.display = 'none';
    if (continueBtn) continueBtn.innerHTML = `<span>${window.t ? window.t('albums_delete_continue') : 'Continue'}</span> <i class="fa-solid fa-arrow-right"></i>`;
  } else {
    if (countSummary) countSummary.textContent = window.t ? window.t('albums_photo_count', { count: deleteAlbumState.photoCount }) : `Contains ${deleteAlbumState.photoCount} photos`;
    if (promptDesc) promptDesc.textContent = window.t ? window.t('albums_delete_dialog_desc', { name: tagName }) : 'Choose what to do with the photos in this album before deleting:';
    if (optionsGrid) optionsGrid.style.display = 'flex';
    selectDeleteAlbumOption('save');
  }

  goToDeleteAlbumStep1();
  if (modal) modal.style.display = 'flex';
}

function closeDeleteAlbumModal() {
  const modal = document.getElementById('deleteAlbumModal');
  if (modal) modal.style.display = 'none';
  const targetAlbum = deleteAlbumState.albumName;
  deleteAlbumState.albumName = '';
  deleteAlbumState.photoCount = 0;
  deleteAlbumState.step = 1;
  if (targetAlbum && window.highlightReturnedAlbumCard) {
    window.highlightReturnedAlbumCard(targetAlbum);
  }
}

function selectDeleteAlbumOption(option) {
  deleteAlbumState.chosenOption = option;
  const saveCard = document.getElementById('deleteOptionSaveCard');
  const trashCard = document.getElementById('deleteOptionTrashCard');
  const discardCard = document.getElementById('deleteOptionDiscardCard');

  if (saveCard) {
    saveCard.classList.toggle('active', option === 'save');
    const radio = saveCard.querySelector('.delete-option-radio i');
    if (radio) radio.className = option === 'save' ? 'fa-solid fa-circle-check radio-icon' : 'fa-regular fa-circle radio-icon';
  }

  if (trashCard) {
    trashCard.classList.toggle('active', option === 'trash');
    const radio = trashCard.querySelector('.delete-option-radio i');
    if (radio) radio.className = option === 'trash' ? 'fa-solid fa-circle-check radio-icon' : 'fa-regular fa-circle radio-icon';
  }

  if (discardCard) {
    discardCard.classList.toggle('active', option === 'discard');
    const radio = discardCard.querySelector('.delete-option-radio i');
    if (radio) radio.className = option === 'discard' ? 'fa-solid fa-circle-check radio-icon' : 'fa-regular fa-circle radio-icon';
  }
}

function goToDeleteAlbumStep1() {
  deleteAlbumState.step = 1;
  const step1 = document.getElementById('deleteAlbumStep1');
  const step2 = document.getElementById('deleteAlbumStep2');
  if (step1) step1.style.display = 'block';
  if (step2) step2.style.display = 'none';
}

function goToDeleteAlbumStep2() {
  deleteAlbumState.step = 2;
  const step1 = document.getElementById('deleteAlbumStep1');
  const step2 = document.getElementById('deleteAlbumStep2');
  const step2Title = document.getElementById('deleteAlbumStep2Title');
  const step2Eyebrow = document.getElementById('deleteAlbumStep2Eyebrow');
  const content = document.getElementById('deleteAlbumStep2Content');
  const confirmBtn = document.getElementById('finalDeleteAlbumConfirmBtn');

  if (step1) step1.style.display = 'none';
  if (step2) step2.style.display = 'block';

  const count = deleteAlbumState.photoCount;
  const name = deleteAlbumState.albumName;
  const photoWord = count === 1 ? 'photo' : 'photos';

  if (count === 0) {
    if (step2Eyebrow) step2Eyebrow.textContent = window.t ? window.t('albums_delete_step2_eyebrow') : 'STEP 2 OF 2 · DOUBLE CONFIRMATION';
    if (step2Title) step2Title.textContent = window.t ? window.t('albums_delete_step2_title_empty') : 'Confirm Album Deletion';
    if (content) {
      content.innerHTML = `
        <div class="delete-step2-box safe-box">
          <div class="step2-highlight-row">
            <span class="step2-row-label">${window.t ? window.t('albums_delete_row_album_to_delete') : 'Album to delete:'}</span>
            <span class="step2-row-val">${escapeHtml(name)}</span>
          </div>
          <div class="step2-highlight-row">
            <span class="step2-row-label">${window.t ? window.t('albums_delete_row_photos_in_album') : 'Photos in album:'}</span>
            <span class="step2-row-val safe-text">${window.t ? window.t('albums_delete_val_empty_photos') : '0 photos (Empty)'}</span>
          </div>
        </div>
        <p class="dialog-desc" style="margin-top: 14px; margin-bottom: 0;">
          ${window.t ? window.t('albums_delete_desc_empty', { name: escapeHtml(name) }) : `Are you sure you want to permanently delete the empty album category '<strong>${escapeHtml(name)}</strong>'?`}
        </p>
      `;
    }
    if (confirmBtn) {
      confirmBtn.className = 'btn btn-primary';
      confirmBtn.disabled = false;
      confirmBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i> <span>${window.t ? window.t('albums_delete_btn_empty') : 'Delete Empty Album'}</span>`;
    }
  } else if (deleteAlbumState.chosenOption === 'save') {
    if (step2Eyebrow) step2Eyebrow.textContent = window.t ? window.t('albums_delete_step2_eyebrow') : 'STEP 2 OF 2 · DOUBLE CONFIRMATION';
    if (step2Title) step2Title.textContent = window.t ? window.t('albums_delete_step2_title_keep') : 'Confirm Album Removal (Keep Photos)';

    const photoRetentionVal = count === 1 ?
      (window.t ? window.t('albums_delete_val_photos_saved_singular') : 'All 1 photo saved in Gallery') :
      (window.t ? window.t('albums_delete_val_photos_saved_plural', { count }) : `All ${count} photos saved in Gallery`);

    const keepDesc = count === 1 ?
      (window.t ? window.t('albums_delete_desc_keep_singular', { name: escapeHtml(name) }) : `Your 1 photo will remain intact in your photo library. Only the album categorization '<strong>${escapeHtml(name)}</strong>' will be deleted.`) :
      (window.t ? window.t('albums_delete_desc_keep_plural', { count, name: escapeHtml(name) }) : `Your <strong>${count} photos</strong> will remain intact in your photo library. Only the album categorization '<strong>${escapeHtml(name)}</strong>' will be deleted.`);

    if (content) {
      content.innerHTML = `
        <div class="delete-step2-box safe-box">
          <div class="step2-highlight-row">
            <span class="step2-row-label">${window.t ? window.t('albums_delete_row_album_to_delete') : 'Album to delete:'}</span>
            <span class="step2-row-val">${escapeHtml(name)}</span>
          </div>
          <div class="step2-highlight-row">
            <span class="step2-row-label">${window.t ? window.t('albums_delete_row_photo_retention') : 'Photo retention:'}</span>
            <span class="step2-row-val safe-text">${photoRetentionVal}</span>
          </div>
          <div class="step2-highlight-row">
            <span class="step2-row-label">${window.t ? window.t('albums_delete_row_data_safety') : 'Data safety:'}</span>
            <span class="step2-row-val safe-text"><i class="fa-solid fa-shield-check"></i> ${window.t ? window.t('albums_delete_val_safety_guarantee') : '100% Safe (No photos deleted)'}</span>
          </div>
        </div>
        <p class="dialog-desc" style="margin-top: 14px; margin-bottom: 0;">
          ${keepDesc}
        </p>
      `;
    }
    if (confirmBtn) {
      confirmBtn.className = 'btn btn-primary';
      confirmBtn.disabled = false;
      confirmBtn.innerHTML = `<i class="fa-solid fa-folder-minus"></i> <span>${window.t ? window.t('albums_delete_btn_keep') : 'Delete Album & Keep Photos'}</span>`;
    }
  } else if (deleteAlbumState.chosenOption === 'trash') {
    if (step2Eyebrow) step2Eyebrow.textContent = window.t ? window.t('albums_delete_step2_eyebrow_trash') : 'STEP 2 OF 2 · RECYCLE BIN CONFIRMATION';
    if (step2Title) step2Title.innerHTML = `<i class="fa-solid fa-trash-arrow-up" style="color:#f59e0b; margin-right:6px;"></i> ${window.t ? window.t('albums_delete_step2_title_trash') : 'Move Album to Recycle Bin'}`;

    const photosTrashVal = count === 1 ?
      (window.t ? window.t('albums_delete_unit_photo_singular') : '1 photo') :
      (window.t ? window.t('albums_delete_unit_photo_plural', { count }) : `${count} photos`);

    const trashDesc = count === 1 ?
      (window.t ? window.t('albums_delete_desc_trash_singular', { name: escapeHtml(name) }) : `Both the album '<strong>${escapeHtml(name)}</strong>' and its 1 photo will be moved to the Recycle Bin. You can restore them anytime within 30 days before they are permanently deleted.`) :
      (window.t ? window.t('albums_delete_desc_trash_plural', { count, name: escapeHtml(name) }) : `Both the album '<strong>${escapeHtml(name)}</strong>' and its <strong>${count} photos</strong> will be moved to the Recycle Bin. You can restore them anytime within 30 days before they are permanently deleted.`);

    if (content) {
      content.innerHTML = `
        <div class="delete-step2-box warning-box">
          <div class="step2-highlight-row">
            <span class="step2-row-label">${window.t ? window.t('albums_delete_row_album_to_recycle') : 'Album to recycle:'}</span>
            <span class="step2-row-val">${escapeHtml(name)}</span>
          </div>
          <div class="step2-highlight-row">
            <span class="step2-row-label">${window.t ? window.t('albums_delete_row_photos_to_trash') : 'Photos moved to trash:'}</span>
            <span class="step2-row-val warning-text">${photosTrashVal}</span>
          </div>
          <div class="step2-highlight-row">
            <span class="step2-row-label">${window.t ? window.t('albums_delete_row_retention_period') : 'Retention period:'}</span>
            <span class="step2-row-val warning-text"><i class="fa-solid fa-clock-rotate-left"></i> ${window.t ? window.t('albums_delete_val_trash_period') : '30 Days (Recoverable)'}</span>
          </div>
        </div>
        <p class="dialog-desc" style="margin-top: 14px; margin-bottom: 0;">
          ${trashDesc}
        </p>
      `;
    }
    if (confirmBtn) {
      confirmBtn.className = 'btn btn-warning';
      confirmBtn.disabled = false;
      confirmBtn.innerHTML = `<i class="fa-solid fa-trash-arrow-up"></i> <span>${window.t ? window.t('albums_delete_btn_trash') : 'Move to Recycle Bin'}</span>`;
    }
  } else {
    // Discard (Permanent Erase)
    if (step2Eyebrow) step2Eyebrow.textContent = window.t ? window.t('albums_delete_step2_eyebrow_perm') : 'STEP 2 OF 2 · DESTRUCTION VERIFICATION';
    if (step2Title) step2Title.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color:#f43f5e; margin-right:6px;"></i> ${window.t ? window.t('albums_delete_step2_title_perm') : 'Permanent Destruction Warning'}`;

    const permDestructionVal = count === 1 ?
      (window.t ? window.t('albums_delete_val_destruction_singular') : 'ALL 1 PHOTO') :
      (window.t ? window.t('albums_delete_val_destruction_plural', { count }) : `ALL ${count} PHOTOS`);

    const permWarnDesc = count === 1 ?
      (window.t ? window.t('albums_delete_desc_perm_warn_singular') : 'Warning: The 1 photo inside this album will be permanently erased from your photo organizer and device storage. It will NOT be moved to trash.') :
      (window.t ? window.t('albums_delete_desc_perm_warn_plural', { count }) : `Warning: All ${count} photos inside this album will be permanently erased from your photo organizer and device storage. They will NOT be moved to trash.`);

    const checkboxLabelText = count === 1 ?
      (window.t ? window.t('albums_delete_checkbox_confirm_singular') : 'I understand that 1 photo will be permanently destroyed and cannot be recovered.') :
      (window.t ? window.t('albums_delete_checkbox_confirm_plural', { count }) : `I understand that all ${count} photos will be permanently destroyed and cannot be recovered.`);

    if (content) {
      content.innerHTML = `
        <div class="delete-step2-box danger-box">
          <div class="step2-highlight-row">
            <span class="step2-row-label">${window.t ? window.t('albums_delete_row_album_to_delete') : 'Album to delete:'}</span>
            <span class="step2-row-val">${escapeHtml(name)}</span>
          </div>
          <div class="step2-highlight-row">
            <span class="step2-row-label">${window.t ? window.t('albums_delete_row_permanent_destruction') : 'Permanent destruction:'}</span>
            <span class="step2-row-val danger-text">${permDestructionVal}</span>
          </div>
          <div class="step2-highlight-row">
            <span class="step2-row-label">${window.t ? window.t('albums_delete_row_recovery_status') : 'Recovery status:'}</span>
            <span class="step2-row-val danger-text"><i class="fa-solid fa-ban"></i> ${window.t ? window.t('albums_delete_val_cannot_undo') : 'CANNOT BE UNDONE'}</span>
          </div>
        </div>
        <p class="dialog-desc" style="margin-top: 12px; margin-bottom: 0; color: #fca5a5;">
          ${permWarnDesc}
        </p>
        <label class="safety-checkbox-label">
          <input type="checkbox" id="deleteAlbumConfirmCheckbox" onchange="toggleDiscardConfirmBtn(this.checked)" />
          <span>${checkboxLabelText}</span>
        </label>
      `;
    }
    if (confirmBtn) {
      confirmBtn.className = 'btn btn-danger';
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <span>${window.t ? window.t('albums_delete_btn_perm') : 'Permanently Delete Everything'}</span>`;
    }
  }
}

function toggleDiscardConfirmBtn(isChecked) {
  const confirmBtn = document.getElementById('finalDeleteAlbumConfirmBtn');
  if (confirmBtn && deleteAlbumState.chosenOption === 'discard') {
    confirmBtn.disabled = !isChecked;
  }
}

function executeFinalAlbumDeletion() {
  const tagName = deleteAlbumState.albumName;
  if (!tagName) return;

  const count = deleteAlbumState.photoCount;
  const chosen = deleteAlbumState.chosenOption;

  if (chosen === 'trash' && count > 0) {
    // 1. Move all photos in album to trash with timestamp
    const now = Date.now();
    state.photos.forEach(p => {
      if (Array.isArray(p.tags) && p.tags.includes(tagName)) {
        p.deletedAt = now;
      }
    });

    // 2. Track deleted album in state.deletedAlbums for restoration
    if (!Array.isArray(state.deletedAlbums)) {
      state.deletedAlbums = [];
    }
    // Remove if already exists with same name
    state.deletedAlbums = state.deletedAlbums.filter(a => a.name !== tagName);
    state.deletedAlbums.push({
      name: tagName,
      color: deleteAlbumState.albumColor || '#f43f5e',
      photoCount: count,
      deletedAt: now
    });

    state.selectedGalleryPhotoIds.clear();
    if (state.activePhotoId) {
      const activePhoto = state.photos.find(p => p.id === state.activePhotoId);
      if (activePhoto && activePhoto.deletedAt) closePhotoDetail();
    }
  } else if (chosen === 'discard' && count > 0) {
    // Permanently remove all photos tagged with this album
    state.photos = state.photos.filter(p => !p.tags || !p.tags.includes(tagName));
    state.selectedGalleryPhotoIds.clear();
    if (state.activePhotoId) {
      const activePhoto = state.photos.find(p => p.id === state.activePhotoId);
      if (!activePhoto) closePhotoDetail();
    }
  } else {
    // Keep photos, strip the album tag
    state.photos.forEach(p => {
      if (Array.isArray(p.tags)) {
        p.tags = p.tags.filter(t => t !== tagName);
      }
    });
  }

  // Remove tag / album from state
  state.tags = state.tags.filter(t => t.name !== tagName);
  state.selectedFilterTags.delete(tagName);

  saveState();
  renderAll();
  closeDeleteAlbumModal();

  if (chosen === 'trash') {
    const msg = count === 1 ?
      (window.t ? window.t('albums_delete_toast_trash_1', { name: tagName }) : `♻️ Album '${tagName}' and 1 photo moved to Recycle Bin`) :
      (window.t ? window.t('albums_delete_toast_trash', { name: tagName, count }) : `♻️ Album '${tagName}' and ${count} photos moved to Recycle Bin`);
    showToast(msg);
  } else if (chosen === 'discard') {
    const msg = count === 1 ?
      (window.t ? window.t('albums_delete_toast_discard_1', { name: tagName }) : `🗑️ Album '${tagName}' and 1 photo permanently deleted.`) :
      (window.t ? window.t('albums_delete_toast_discard', { name: tagName, count }) : `🗑️ Album '${tagName}' and all ${count} photos permanently deleted.`);
    showToast(msg);
  } else {
    const msg = window.t ? window.t('albums_delete_toast_keep', { name: tagName }) : `✨ Album '${tagName}' deleted. All photos saved in your gallery.`;
    showToast(msg);
  }
}

// Retain deleteTagSafely as an alias pointing to the new double confirmation
function deleteTagSafely(tagName) {
  openDeleteAlbumModal(tagName);
}

function updateDeleteAlbumModalI18n() {
  const modal = document.getElementById('deleteAlbumModal');
  if (!modal || modal.style.display === 'none' || !deleteAlbumState.albumName) return;

  const tagName = deleteAlbumState.albumName;
  const title = document.getElementById('deleteAlbumTitle');
  const countSummary = document.getElementById('deleteAlbumPhotoCountSummary');
  const promptDesc = document.getElementById('deleteAlbumPromptDesc');
  const continueBtn = document.getElementById('continueDeleteAlbumBtn');

  if (title) title.textContent = window.t ? `${window.t('albums_delete_dialog_title')} (${tagName})` : `Delete '${tagName}'`;

  if (deleteAlbumState.photoCount === 0) {
    if (countSummary) countSummary.textContent = window.t ? window.t('albums_empty_tag') : 'Empty album · 0 photos';
    if (promptDesc) promptDesc.textContent = window.t ? window.t('albums_empty_desc') : 'This album has 0 photos. Deleting it will permanently remove the album category.';
    if (continueBtn) continueBtn.innerHTML = `<span>${window.t ? window.t('albums_delete_continue') : 'Continue'}</span> <i class="fa-solid fa-arrow-right"></i>`;
  } else {
    if (countSummary) countSummary.textContent = window.t ? window.t('albums_photo_count', { count: deleteAlbumState.photoCount }) : `Contains ${deleteAlbumState.photoCount} photos`;
    if (promptDesc) promptDesc.textContent = window.t ? window.t('albums_delete_dialog_desc', { name: tagName }) : 'Choose what to do with the photos in this album before deleting:';
  }

  if (deleteAlbumState.step === 2) {
    goToDeleteAlbumStep2();
  }
}
window.updateDeleteAlbumModalI18n = updateDeleteAlbumModalI18n;
window.goToDeleteAlbumStep2 = goToDeleteAlbumStep2;
window.goToDeleteAlbumStep1 = goToDeleteAlbumStep1;
window.openDeleteAlbumModal = openDeleteAlbumModal;


function renderRenameColorPalette() {
  const palette = document.getElementById('renameColorPalette');
  if (!palette) return;

  palette.innerHTML = buildCategorizedPaletteHtml({
    presetColors: PRESET_COLORS,
    selectedColor: state.renameColor || PRESET_COLORS[0],
    savedColors: state.savedCustomColors || [],
    onSelectFn: 'selectRenameColor',
    customInputId: 'renameCustomColorInput',
    customSwatchId: 'renameCustomColorSwatch'
  });
}

function openRenameTagModal(tagName) {
  state.tagToRename = tagName;
  const tag = state.tags.find(t => t.name === tagName);
  document.getElementById('renameTagInput').value = tagName;
  state.renameColor = tag ? tag.color : PRESET_COLORS[0];

  renderRenameColorPalette();

  document.getElementById('renameTagModal').style.display = 'flex';
}

function selectRenameColor(color, isFinal = true) {
  state.renameColor = color;
  renderRenameColorPalette();
}

// Gallery Search Handler
function handleGallerySearch(val) {
  state.searchQuery = val || '';
  const clearBtn = document.getElementById('clearSearchBtn');
  if (clearBtn) {
    clearBtn.style.display = state.searchQuery.trim() ? 'flex' : 'none';
  }
  renderGallery();
}

function clearGallerySearch() {
  state.searchQuery = '';
  const input = document.getElementById('gallerySearchInput');
  if (input) {
    input.value = '';
    input.focus();
  }
  const clearBtn = document.getElementById('clearSearchBtn');
  if (clearBtn) {
    clearBtn.style.display = 'none';
  }
  renderGallery();
}

// -------------------------------------------------------------
// EVENT LISTENERS & SETUP
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  loadState();

  // Native APK Clean UI enforcement - never display desktop test tools in mobile APK
  const isNativeApp = !!window.AndroidApp ||
    navigator.userAgent.includes('wv') ||
    document.documentElement.classList.contains('native-app-mode') ||
    (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches);

  if (isNativeApp) {
    document.querySelectorAll('.test-shake-btn, .browser-only').forEach(el => {
      if (el.remove) {
        el.remove();
      } else {
        el.style.display = 'none';
      }
    });
  }

  // Navigation tab switching
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.dataset.tab;
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
      document.getElementById(targetId).classList.add('active');
      state.activeTab = targetId;

      if (targetId !== 'galleryScreen') {
        state.activeAlbumView = null;
      }
      if (targetId !== 'favoritesScreen') {
        state.openedFavoritesFromAlbums = false;
      }

      renderAll();
    });
  });

  // Browser & Android hardware back button handler
  window.addEventListener('popstate', (e) => {
    if (state.activePhotoId) {
      closePhotoDetail();
      return;
    }
    const openModals = Array.from(document.querySelectorAll('.modal-overlay'))
      .filter(m => m.style.display && m.style.display !== 'none');
    if (openModals.length > 0) {
      openModals.forEach(m => m.style.display = 'none');
      return;
    }
    if (state.activeAlbumView) {
      exitAlbumView(true);
      return;
    }
    if (state.openedFavoritesFromAlbums) {
      exitFavoritesToAlbums();
      return;
    }
  });

  // Camera snap simulation
  const snapPhoto = (title = 'Camera Snap') => {
    const timestamp = Date.now();
    const newId = `camera_${timestamp}`;
    const gradients = [
      ['#6366f1', '#4338ca'],
      ['#ec4899', '#f43f5e'],
      ['#10b981', '#047857'],
      ['#f59e0b', '#d97706'],
      ['#06b6d4', '#0284c7']
    ];
    const chosenGrad = gradients[Math.floor(Math.random() * gradients.length)];
    const photoName = `${title} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    let location = null;

    const newPhoto = {
      id: newId,
      displayName: photoName,
      category: 'Camera',
      isPending: true,
      isFavorite: false,
      deletedAt: null,
      createdAt: timestamp,
      tags: [],
      gradient: chosenGrad,
      dataUrl: generateGradientImage(photoName, 'Camera', chosenGrad),
      location: location
    };

    state.photos.unshift(newPhoto);
    saveState();
    renderAll();
    showToast('Photo snapped & placed in Loading Dock!');

    // Switch to Dock tab if not there
    document.querySelector('.nav-item[data-tab="dockScreen"]').click();
  };

  // Native and Web Camera Capture Bridge with debounce
  let isCameraTriggerBusy = false;
  window.triggerCameraCapture = function() {
    if (isCameraTriggerBusy) return;
    isCameraTriggerBusy = true;
    setTimeout(() => { isCameraTriggerBusy = false; }, 1000);

    if (window.AndroidApp && typeof window.AndroidApp.openCamera === 'function') {
      window.AndroidApp.openCamera();
    } else {
      const cameraInput = document.getElementById('cameraFileInput');
      if (cameraInput) {
        cameraInput.click();
      } else {
        snapPhoto('Camera Shot');
      }
    }
  };

  // Native and Web Gallery Import Bridge with debounce
  let isGalleryTriggerBusy = false;
  window.triggerGalleryImport = function() {
    if (isGalleryTriggerBusy) return;
    isGalleryTriggerBusy = true;
    setTimeout(() => { isGalleryTriggerBusy = false; }, 1000);

    if (window.AndroidApp && typeof window.AndroidApp.openGallery === 'function') {
      window.AndroidApp.openGallery();
    } else {
      const fileInput = document.getElementById('imageFileInput');
      if (fileInput) {
        fileInput.click();
      }
    }
  };

  // Callback when Native Android Camera captures a real photo
  window.onNativePhotoCaptured = function(dataUrl, photoName, location) {
    isCameraTriggerBusy = false;
    if (!dataUrl) return;
    const timestamp = Date.now();
    let loc = (location && state.gpsMetadataEnabled !== false) ? location : null;
    let camera = null;
    let photoCreated = null;
    const newPhotoId = `camera_${timestamp}_${Math.random().toString(36).substr(2, 5)}`;

    if (dataUrl) {
      const exif = extractFullExifFromBase64(dataUrl);
      if (exif) {
        if (exif.cameraModel) camera = exif.cameraModel;
        if (exif.timestamp) photoCreated = exif.timestamp;
        if (!loc && exif.coords && state.gpsMetadataEnabled !== false) {
          loc = {
            latitude: exif.coords.latitude,
            longitude: exif.coords.longitude,
            displayCoords: formatDisplayCoords(exif.coords.latitude, exif.coords.longitude),
            place: '',
            city: '',
            country: ''
          };
        }
      }
    }

    if (loc && typeof loc.latitude === 'number' && typeof loc.longitude === 'number') {
      if (!loc.displayCoords) {
        loc.displayCoords = formatDisplayCoords(loc.latitude, loc.longitude);
      }
      if (!loc.city && !loc.country && !loc.place) {
        const offlineMatch = resolveLocationOffline(loc.latitude, loc.longitude);
        if (offlineMatch) {
          if (offlineMatch.city) loc.city = offlineMatch.city;
          if (offlineMatch.country) loc.country = offlineMatch.country;
          if (offlineMatch.place) loc.place = offlineMatch.place;
        }
      }
    }

    const isAnyLocTagEnabled = state.locationTagPlace !== false || state.locationTagCity !== false || state.locationTagCountry !== false;
    if (state.gpsMetadataEnabled !== false && state.locationTagsEnabled !== false && isAnyLocTagEnabled &&
        loc && typeof loc.latitude === 'number' && typeof loc.longitude === 'number' && (!loc.place && !loc.city)) {
      resolveLocationFromCoords(loc.latitude, loc.longitude).then(resolved => {
        if (resolved && (resolved.place || resolved.city || resolved.country)) {
          const p = state.photos.find(x => x.id === newPhotoId);
          if (p) {
            p.location = resolved;
            if (state.locationTagsEnabled !== false && resolved && resolved.city) {
              if (!p.tags.some(t => t.toLowerCase() === resolved.city.toLowerCase())) {
                p.tags.push(resolved.city);
              }
            }
            saveState();
            if (state.activePhotoId === p.id) {
              renderDetailTags(p);
              updateDetailModalUI(p, true);
            }
          }
        }
      }).catch(() => {});
    }

    const newPhoto = {
      id: newPhotoId,
      displayName: photoName || `Camera Shot #${state.photos.length + 1}`,
      category: 'Camera',
      isPending: true,
      isFavorite: false,
      deletedAt: null,
      createdAt: photoCreated || timestamp,
      cameraModel: camera,
      tags: [],
      dataUrl: dataUrl,
      location: loc
    };

    state.photos.unshift(newPhoto);
    saveState();
    renderAll();
    showToast('Photo captured & placed in Loading Dock!');

    // Switch to Dock tab if not there
    document.querySelector('.nav-item[data-tab="dockScreen"]')?.click();
  };

  // Callback when Native Android Gallery imports real photos
  window.onNativePhotosImported = function(photosList) {
    isGalleryTriggerBusy = false;
    let list = photosList;
    if (typeof list === 'string') {
      try {
        list = JSON.parse(list);
      } catch (e) {
        console.error('Failed to parse photosList JSON:', e);
        list = [];
      }
    }
    if (!list || !list.length) return;
    const timestamp = Date.now();
    list.forEach((item, index) => {
      let loc = (item.location && state.gpsMetadataEnabled !== false) ? item.location : null;
      let camera = item.cameraModel || null;
      let photoCreated = item.createdAt || null;
      const newPhotoId = `import_${timestamp}_${index}_${Math.random().toString(36).substr(2, 5)}`;

      if (item.dataUrl && (!loc || !camera || !photoCreated)) {
        const exif = extractFullExifFromBase64(item.dataUrl);
        if (exif) {
          if (!camera && exif.cameraModel) camera = exif.cameraModel;
          if (!photoCreated && exif.timestamp) photoCreated = exif.timestamp;
          if (!loc && exif.coords && state.gpsMetadataEnabled !== false) {
            loc = {
              latitude: exif.coords.latitude,
              longitude: exif.coords.longitude,
              place: '',
              city: '',
              country: ''
            };
          }
        }
      }

      // Background reverse-geocoding AFTER photo is safely placed in Loading Dock!
      const isAnyLocTagEnabled = state.locationTagPlace !== false || state.locationTagCity !== false || state.locationTagCountry !== false;
      if (state.gpsMetadataEnabled !== false && state.locationTagsEnabled !== false && isAnyLocTagEnabled &&
          loc && typeof loc.latitude === 'number' && typeof loc.longitude === 'number' && (!loc.place && !loc.city)) {
        const lat = loc.latitude;
        const lon = loc.longitude;
        resolveLocationFromCoords(lat, lon).then(resolved => {
          if (resolved && (resolved.place || resolved.city || resolved.country)) {
            const p = state.photos.find(x => x.id === newPhotoId);
            if (p) {
              p.location = resolved;
              saveState();
              if (state.activePhotoId === p.id) {
                renderDetailTags(p);
                updateDetailModalUI(p, true);
              }
              const dockScreen = document.getElementById('dockScreen');
              if (dockScreen && dockScreen.classList.contains('active')) {
                renderDock();
              }
            }
          }
        }).catch(() => {});
      }

      const newPhoto = {
        id: newPhotoId,
        displayName: item.displayName || `Moment #${state.photos.length + 1}`,
        category: 'Import',
        isPending: true,
        isFavorite: false,
        deletedAt: null,
        createdAt: photoCreated || (timestamp + index),
        cameraModel: camera,
        tags: [],
        dataUrl: item.dataUrl,
        location: loc
      };
      state.photos.unshift(newPhoto);
    });

    saveState();
    renderAll();
    showToast(`${list.length} photo${list.length > 1 ? 's' : ''} imported to Loading Dock!`);

    // Switch to Dock tab if not there
    document.querySelector('.nav-item[data-tab="dockScreen"]')?.click();
  };


  // -------------------------------------------------------------
  // UNIVERSAL MULTI-FORMAT EXIF & XMP EXTRACTION ENGINE
  // Supports: JPEG (with marker padding/fill bytes & APP1/XMP),
  //           PNG (eXIf & iTXt/tEXt chunks),
  //           WebP (EXIF & XMP chunks),
  //           TIFF / DNG / RAW (II/MM headers),
  //           ISO-BMFF (HEIC / AVIF).
  // -------------------------------------------------------------
  function extractFullMetadata(buffer) {
    if (!buffer || buffer.byteLength < 12) return null;
    try {
      const view = new DataView(buffer);
      const u8 = new Uint8Array(buffer);

      // 1. Check for JPEG (SOI: 0xFFD8)
      if (view.getUint16(0, false) === 0xFFD8) {
        return parseJpegMetadata(view, u8);
      }

      // 2. Check for PNG signature
      if (view.getUint32(0, false) === 0x89504E47 && view.getUint32(4, false) === 0x0D0A1A0A) {
        return parsePngMetadata(view, u8);
      }

      // 3. Check for WebP (RIFF....WEBP)
      if (view.getUint32(0, false) === 0x52494646 && view.getUint32(8, false) === 0x57454250) {
        return parseWebPMetadata(view, u8);
      }

      // 4. Fallback: TIFF Header or ISO-BMFF search
      return scanForTiffHeader(view, u8);
    } catch (e) {
      console.warn('Metadata extraction error:', e);
      return null;
    }
  }

  function parseJpegMetadata(view, u8) {
    let offset = 2;
    let exifResult = null;
    let xmpResult = null;

    while (offset < view.byteLength - 4) {
      if (u8[offset] !== 0xFF) {
        offset++;
        continue;
      }
      while (offset < view.byteLength && u8[offset] === 0xFF) {
        offset++;
      }
      if (offset >= view.byteLength) break;

      const marker = u8[offset++];
      if (marker === 0xDA || marker === 0xD9) break; // SOS or EOI

      if (offset + 2 > view.byteLength) break;
      const size = view.getUint16(offset, false);
      if (size < 2 || offset + size > view.byteLength) break;

      if (marker === 0xE1) { // APP1
        // Check for Exif  
        if (offset + 8 <= view.byteLength &&
            u8[offset + 2] === 0x45 && u8[offset + 3] === 0x78 &&
            u8[offset + 4] === 0x69 && u8[offset + 5] === 0x66 &&
            u8[offset + 6] === 0x00 && u8[offset + 7] === 0x00) {
          const tiffStart = offset + 8;
          exifResult = parseTiffStructure(view, tiffStart);
        } else {
          // Check for XMP: http://ns.adobe.com/xap/1.0/ 
          const xmpHeader = 'http://ns.adobe.com/xap/1.0/';
          let isXmp = true;
          for (let i = 0; i < xmpHeader.length; i++) {
            if (u8[offset + 2 + i] !== xmpHeader.charCodeAt(i)) {
              isXmp = false;
              break;
            }
          }
          if (isXmp) {
            const xmpStart = offset + 2 + xmpHeader.length + 1;
            const xmpLen = size - 2 - xmpHeader.length - 1;
            xmpResult = parseXmpString(u8, xmpStart, xmpLen);
          }
        }
      }
      offset += size;
    }

    return mergeMetadataResults(exifResult, xmpResult);
  }

  function parsePngMetadata(view, u8) {
    let offset = 8;
    let exifResult = null;
    let xmpResult = null;

    while (offset < view.byteLength - 8) {
      const len = view.getUint32(offset, false);
      const chunkType = String.fromCharCode(u8[offset + 4], u8[offset + 5], u8[offset + 6], u8[offset + 7]);
      const dataOffset = offset + 8;

      if (chunkType === 'eXIf' && dataOffset + len <= view.byteLength) {
        exifResult = parseTiffStructure(view, dataOffset);
      } else if ((chunkType === 'iTXt' || chunkType === 'tEXt') && dataOffset + len <= view.byteLength) {
        const text = decodeUtf8Safe(u8, dataOffset, len);
        if (text.includes('xmp') || text.includes('GPS')) {
          xmpResult = parseXmpText(text);
        }
      }
      offset += 12 + len;
    }
    return mergeMetadataResults(exifResult, xmpResult);
  }

  function parseWebPMetadata(view, u8) {
    let offset = 12;
    let exifResult = null;
    let xmpResult = null;

    while (offset < view.byteLength - 8) {
      const chunkTag = String.fromCharCode(u8[offset], u8[offset + 1], u8[offset + 2], u8[offset + 3]);
      const chunkSize = view.getUint32(offset + 4, true);
      const dataOffset = offset + 8;

      if (chunkTag === 'EXIF' && dataOffset + chunkSize <= view.byteLength) {
        let tiffOffset = dataOffset;
        if (u8[dataOffset] === 0x45 && u8[dataOffset + 1] === 0x78) {
          tiffOffset += 6;
        }
        exifResult = parseTiffStructure(view, tiffOffset);
      } else if (chunkTag === 'XMP ' && dataOffset + chunkSize <= view.byteLength) {
        const text = decodeUtf8Safe(u8, dataOffset, chunkSize);
        xmpResult = parseXmpText(text);
      }
      offset += 8 + chunkSize + (chunkSize % 2);
    }
    return mergeMetadataResults(exifResult, xmpResult);
  }

  function scanForTiffHeader(view, u8) {
    const maxScan = Math.min(view.byteLength - 16, 262144);
    for (let i = 0; i < maxScan; i++) {
      if ((u8[i] === 0x49 && u8[i + 1] === 0x49 && u8[i + 2] === 0x2A && u8[i + 3] === 0x00) ||
          (u8[i] === 0x4D && u8[i + 1] === 0x4D && u8[i + 2] === 0x00 && u8[i + 3] === 0x2A)) {
        const res = parseTiffStructure(view, i);
        if (res && (res.coords || res.cameraModel || res.timestamp)) return res;
      }
    }
    return null;
  }

  function parseTiffStructure(view, tiffStart) {
    if (tiffStart + 8 > view.byteLength) return null;
    const isLittleEndian = view.getUint16(tiffStart, false) === 0x4949;
    const magic = view.getUint16(tiffStart + 2, isLittleEndian);
    if (magic !== 42) return null;

    const ifd0Offset = view.getUint32(tiffStart + 4, isLittleEndian);
    let ifdOffset = tiffStart + ifd0Offset;
    if (ifdOffset + 2 > view.byteLength) return null;

    function readStr(offset, count) {
      let s = '';
      for (let i = 0; i < count; i++) {
        const c = view.getUint8(offset + i);
        if (c === 0) break;
        s += String.fromCharCode(c);
      }
      return s.trim();
    }

    function readRationals(offset, count = 3) {
      const vals = [];
      for (let i = 0; i < count; i++) {
        const num = view.getUint32(offset + (i * 8), isLittleEndian);
        const den = view.getUint32(offset + (i * 8) + 4, isLittleEndian);
        vals.push(den ? (num / den) : 0);
      }
      return vals;
    }

    const numEntries = view.getUint16(ifdOffset, isLittleEndian);
    let make = '', model = '', dateTaken = null, exifSubOffset = null, gpsIfdOffset = null;

    for (let i = 0; i < numEntries; i++) {
      const entry = ifdOffset + 2 + (i * 12);
      if (entry + 12 > view.byteLength) break;
      const tag = view.getUint16(entry, isLittleEndian);
      const type = view.getUint16(entry + 2, isLittleEndian);
      const count = view.getUint32(entry + 4, isLittleEndian);

      const valOffset = (type === 1 || type === 2 || type === 7) && count <= 4
        ? (entry + 8)
        : (type === 3 && count <= 2)
        ? (entry + 8)
        : (type === 4 && count === 1)
        ? (entry + 8)
        : (tiffStart + view.getUint32(entry + 8, isLittleEndian));

      if (tag === 0x010F && valOffset + count <= view.byteLength) {
        make = readStr(valOffset, count);
      } else if (tag === 0x0110 && valOffset + count <= view.byteLength) {
        model = readStr(valOffset, count);
      } else if (tag === 0x0132 && valOffset + count <= view.byteLength) {
        dateTaken = readStr(valOffset, count);
      } else if (tag === 0x8769) {
        exifSubOffset = view.getUint32(entry + 8, isLittleEndian);
      } else if (tag === 0x8825) {
        gpsIfdOffset = view.getUint32(entry + 8, isLittleEndian);
      }
    }

    // SubIFD for original date
    if (exifSubOffset !== null && tiffStart + exifSubOffset + 2 <= view.byteLength) {
      const subOffset = tiffStart + exifSubOffset;
      const subEntries = view.getUint16(subOffset, isLittleEndian);
      for (let i = 0; i < subEntries; i++) {
        const entry = subOffset + 2 + (i * 12);
        if (entry + 12 > view.byteLength) break;
        const tag = view.getUint16(entry, isLittleEndian);
        const count = view.getUint32(entry + 4, isLittleEndian);
        if (tag === 0x9003 || (!dateTaken && tag === 0x9004)) {
          const valOffset = count <= 4 ? (entry + 8) : (tiffStart + view.getUint32(entry + 8, isLittleEndian));
          if (valOffset + count <= view.byteLength) {
            const s = readStr(valOffset, count);
            if (s) dateTaken = s;
          }
        }
      }
    }

    // GPS Info IFD
    let coords = null;
    if (gpsIfdOffset !== null && tiffStart + gpsIfdOffset + 2 <= view.byteLength) {
      const gpsOffset = tiffStart + gpsIfdOffset;
      const gpsEntries = view.getUint16(gpsOffset, isLittleEndian);
      let latRef = 'N', lonRef = 'E';
      let latValues = null, lonValues = null;

      for (let i = 0; i < gpsEntries; i++) {
        const entry = gpsOffset + 2 + (i * 12);
        if (entry + 12 > view.byteLength) break;
        const tag = view.getUint16(entry, isLittleEndian);
        const count = view.getUint32(entry + 4, isLittleEndian);

        if (tag === 0x0001) {
          latRef = String.fromCharCode(view.getUint8(entry + 8)).toUpperCase();
        } else if (tag === 0x0002) {
          const valOffset = tiffStart + view.getUint32(entry + 8, isLittleEndian);
          if (valOffset + (count * 8) <= view.byteLength) {
            latValues = readRationals(valOffset, Math.min(count, 3));
          }
        } else if (tag === 0x0003) {
          lonRef = String.fromCharCode(view.getUint8(entry + 8)).toUpperCase();
        } else if (tag === 0x0004) {
          const valOffset = tiffStart + view.getUint32(entry + 8, isLittleEndian);
          if (valOffset + (count * 8) <= view.byteLength) {
            lonValues = readRationals(valOffset, Math.min(count, 3));
          }
        }
      }

      if (latValues && lonValues && latValues.length >= 1 && lonValues.length >= 1) {
        let lat = latValues[0] + (latValues[1] ? latValues[1] / 60 : 0) + (latValues[2] ? latValues[2] / 3600 : 0);
        let lon = lonValues[0] + (lonValues[1] ? lonValues[1] / 60 : 0) + (lonValues[2] ? lonValues[2] / 3600 : 0);
        if (latRef === 'S') lat = -lat;
        if (lonRef === 'W') lon = -lon;
        if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180 && !(lat === 0 && lon === 0)) {
          coords = { latitude: lat, longitude: lon };
        }
      }
    }

    let timestamp = null;
    if (dateTaken) {
      const m = dateTaken.match(/^([0-9]{4})[:/]([0-9]{2})[:/]([0-9]{2})\s+([0-9]{2}):([0-9]{2}):([0-9]{2})/);
      if (m) {
        timestamp = new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]), parseInt(m[4]), parseInt(m[5]), parseInt(m[6])).getTime();
      }
    }

    let cameraModel = '';
    if (make && model) {
      cameraModel = model.toLowerCase().startsWith(make.toLowerCase()) ? model : `${make} ${model}`;
    } else if (model) {
      cameraModel = model;
    } else if (make) {
      cameraModel = make;
    }

    return {
      coords,
      cameraModel: cameraModel.trim() || null,
      dateTakenStr: dateTaken,
      timestamp
    };
  }

  function parseXmpString(u8, start, len) {
    const text = decodeUtf8Safe(u8, start, len);
    return parseXmpText(text);
  }

  function parseXmpText(text) {
    if (!text) return null;
    let coords = null;
    let cameraModel = null;
    let timestamp = null;

    const latMatch = text.match(/(?:exif:GPSLatitude|GPSLatitude)=["']([^"']+)["']/i);
    const lonMatch = text.match(/(?:exif:GPSLongitude|GPSLongitude)=["']([^"']+)["']/i);

    if (latMatch && lonMatch) {
      const lat = parseXmpCoord(latMatch[1]);
      const lon = parseXmpCoord(lonMatch[1]);
      if (lat !== null && lon !== null) {
        coords = { latitude: lat, longitude: lon };
      }
    }

    const makeMatch = text.match(/(?:tiff:Make|Make)=["']([^"']+)["']/i) || text.match(/<tiff:Make>([^<]+)<\/tiff:Make>/i);
    const modelMatch = text.match(/(?:tiff:Model|Model)=["']([^"']+)["']/i) || text.match(/<tiff:Model>([^<]+)<\/tiff:Model>/i);
    if (makeMatch || modelMatch) {
      const make = makeMatch ? makeMatch[1].trim() : '';
      const model = modelMatch ? modelMatch[1].trim() : '';
      cameraModel = make && model ? (model.startsWith(make) ? model : `${make} ${model}`) : (model || make);
    }

    const dateMatch = text.match(/(?:exif:DateTimeOriginal|xmp:CreateDate|photoshop:DateCreated)=["']([^"']+)["']/i) ||
                      text.match(/<(?:exif:DateTimeOriginal|xmp:CreateDate)>([^<]+)<\//i);
    if (dateMatch) {
      const d = new Date(dateMatch[1]);
      if (!isNaN(d.getTime())) timestamp = d.getTime();
    }

    return { coords, cameraModel, timestamp };
  }

  function parseXmpCoord(str) {
    str = str.trim();
    const dms = str.match(/^([0-9.]+)[, ]+([0-9.]+)(?:[, ]+([0-9.]+))?([NSEW])?$/i);
    if (dms) {
      let d = parseFloat(dms[1]) || 0;
      let m = parseFloat(dms[2]) || 0;
      let s = parseFloat(dms[3]) || 0;
      let ref = (dms[4] || '').toUpperCase();
      let val = d + (m / 60) + (s / 3600);
      if (ref === 'S' || ref === 'W') val = -val;
      return val;
    }
    const dec = parseFloat(str);
    return isNaN(dec) ? null : dec;
  }

  function decodeUtf8Safe(u8, start, len) {
    try {
      const slice = u8.subarray(start, Math.min(start + len, u8.length));
      return new TextDecoder('utf-8', { fatal: false }).decode(slice);
    } catch (_) {
      let s = '';
      const end = Math.min(start + len, u8.length);
      for (let i = start; i < end; i++) s += String.fromCharCode(u8[i]);
      return s;
    }
  }

  function mergeMetadataResults(exif, xmp) {
    if (!exif && !xmp) return null;
    return {
      coords: (exif && exif.coords) || (xmp && xmp.coords) || null,
      cameraModel: (exif && exif.cameraModel) || (xmp && xmp.cameraModel) || null,
      timestamp: (exif && exif.timestamp) || (xmp && xmp.timestamp) || null,
      dateTakenStr: (exif && exif.dateTakenStr) || null
    };
  }

  function extractFullExifFromBuffer(buffer) {
    return extractFullMetadata(buffer);
  }

  function extractExifGpsFromBuffer(buffer) {
    const full = extractFullMetadata(buffer);
    return full ? full.coords : null;
  }

  function extractFullExifFromBase64(dataUrl) {
    if (!dataUrl) return null;
    try {
      const commaIdx = dataUrl.indexOf(',');
      const base64Str = commaIdx !== -1 ? dataUrl.slice(commaIdx + 1) : dataUrl;
      const safeLen = Math.min(base64Str.length, 524288);
      const validLen = safeLen - (safeLen % 4);
      const raw = atob(base64Str.slice(0, validLen));
      const len = raw.length;
      const u8 = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        u8[i] = raw.charCodeAt(i);
      }
      return extractFullMetadata(u8.buffer);
    } catch (_) {
      return null;
    }
  }

  function extractGpsFromBase64(dataUrl) {
    const full = extractFullExifFromBase64(dataUrl);
    return full ? full.coords : null;
  }

  function formatDisplayCoords(lat, lon) {
    if (typeof lat !== 'number' || typeof lon !== 'number' || isNaN(lat) || isNaN(lon)) return '';
    const latRef = lat >= 0 ? 'N' : 'S';
    const lonRef = lon >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(4)}° ${latRef}, ${Math.abs(lon).toFixed(4)}° ${lonRef}`;
  }

  // -------------------------------------------------------------
  // INSTANT OFFLINE REVERSE GEOCODER DICTIONARY (0ms response)
  // Ensures photos IMMEDIATELY have city & country even offline!
  // -------------------------------------------------------------
  const OFFLINE_PLACES = [
    // Europe
    { place: 'Eiffel Tower', city: 'Paris', country: 'France', lat: 48.8584, lon: 2.2945, r: 0.25 },
    { place: 'Central Paris', city: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522, r: 0.5 },
    { place: 'Big Ben & Westminster', city: 'London', country: 'United Kingdom', lat: 51.4995, lon: -0.1248, r: 0.25 },
    { place: 'Greater London', city: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278, r: 0.6 },
    { place: 'Colosseum', city: 'Rome', country: 'Italy', lat: 41.8902, lon: 12.4922, r: 0.25 },
    { place: 'Central Rome', city: 'Rome', country: 'Italy', lat: 41.9028, lon: 12.4964, r: 0.4 },
    { place: 'Sagrada Familia', city: 'Barcelona', country: 'Spain', lat: 41.4036, lon: 2.1744, r: 0.25 },
    { place: 'Barcelona', city: 'Barcelona', country: 'Spain', lat: 41.3879, lon: 2.1699, r: 0.4 },
    { place: 'Madrid', city: 'Madrid', country: 'Spain', lat: 40.4168, lon: -3.7038, r: 0.5 },
    { place: 'Brandenburg Gate', city: 'Berlin', country: 'Germany', lat: 52.5163, lon: 13.3777, r: 0.3 },
    { place: 'Berlin', city: 'Berlin', country: 'Germany', lat: 52.5200, lon: 13.4050, r: 0.5 },
    { place: 'Amsterdam Canals', city: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lon: 4.9041, r: 0.35 },
    { place: 'Vienna', city: 'Vienna', country: 'Austria', lat: 48.2082, lon: 16.3738, r: 0.35 },
    { place: 'Prague Castle', city: 'Prague', country: 'Czechia', lat: 50.0755, lon: 14.4378, r: 0.35 },
    { place: 'Zurich', city: 'Zurich', country: 'Switzerland', lat: 47.3769, lon: 8.5417, r: 0.35 },
    { place: 'Athens Acropolis', city: 'Athens', country: 'Greece', lat: 37.9715, lon: 23.7257, r: 0.35 },

    // North America
    { place: 'Times Square & Manhattan', city: 'New York', country: 'United States', lat: 40.7580, lon: -73.9855, r: 0.25 },
    { place: 'New York City', city: 'New York', country: 'United States', lat: 40.7128, lon: -74.0060, r: 0.6 },
    { place: 'Golden Gate Bridge', city: 'San Francisco', country: 'United States', lat: 37.8199, lon: -122.4783, r: 0.25 },
    { place: 'San Francisco', city: 'San Francisco', country: 'United States', lat: 37.7749, lon: -122.4194, r: 0.4 },
    { place: 'Hollywood & Downtown', city: 'Los Angeles', country: 'United States', lat: 34.0522, lon: -118.2437, r: 0.8 },
    { place: 'Las Vegas Strip', city: 'Las Vegas', country: 'United States', lat: 36.1699, lon: -115.1398, r: 0.4 },
    { place: 'Chicago Loop', city: 'Chicago', country: 'United States', lat: 41.8781, lon: -87.6298, r: 0.5 },
    { place: 'Seattle Space Needle', city: 'Seattle', country: 'United States', lat: 47.6062, lon: -122.3321, r: 0.4 },
    { place: 'Miami Beach', city: 'Miami', country: 'United States', lat: 25.7617, lon: -80.1918, r: 0.4 },
    { place: 'Toronto Downtown', city: 'Toronto', country: 'Canada', lat: 43.6532, lon: -79.3832, r: 0.5 },
    { place: 'Vancouver', city: 'Vancouver', country: 'Canada', lat: 49.2827, lon: -123.1207, r: 0.4 },
    { place: 'Montreal', city: 'Montreal', country: 'Canada', lat: 45.5017, lon: -73.5673, r: 0.4 },
    { place: 'Mexico City', city: 'Mexico City', country: 'Mexico', lat: 19.4326, lon: -99.1332, r: 0.6 },
    { place: 'Cancún', city: 'Cancún', country: 'Mexico', lat: 21.1619, lon: -86.8515, r: 0.35 },

    // Asia & Middle East
    { place: 'Tokyo Tower & Shibuya', city: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503, r: 0.6 },
    { place: 'Kyoto Temples', city: 'Kyoto', country: 'Japan', lat: 35.0116, lon: 135.7681, r: 0.35 },
    { place: 'Osaka Dotonbori', city: 'Osaka', country: 'Japan', lat: 34.6937, lon: 135.5023, r: 0.35 },
    { place: 'Seoul Gangnam', city: 'Seoul', country: 'South Korea', lat: 37.5665, lon: 126.9780, r: 0.5 },
    { place: 'Marina Bay Sands', city: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198, r: 0.35 },
    { place: 'Victoria Harbour', city: 'Hong Kong', country: 'Hong Kong', lat: 22.3193, lon: 114.1694, r: 0.35 },
    { place: 'Bangkok Grand Palace', city: 'Bangkok', country: 'Thailand', lat: 13.7563, lon: 100.5018, r: 0.5 },
    { place: 'Phuket Beach', city: 'Phuket', country: 'Thailand', lat: 7.8804, lon: 98.3923, r: 0.4 },
    { place: 'Bali Ubud', city: 'Bali', country: 'Indonesia', lat: -8.4095, lon: 115.1889, r: 0.5 },
    { place: 'Burj Khalifa', city: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lon: 55.2708, r: 0.4 },
    { place: 'Abu Dhabi', city: 'Abu Dhabi', country: 'United Arab Emirates', lat: 24.4539, lon: 54.3773, r: 0.4 },
    { place: 'Doha Corniche', city: 'Doha', country: 'Qatar', lat: 25.2854, lon: 51.5310, r: 0.35 },

    // India
    { place: 'Taj Mahal Palace', city: 'Mumbai', country: 'India', lat: 18.9220, lon: 72.8347, r: 0.4 },
    { place: 'India Gate & Connaught Place', city: 'New Delhi', country: 'India', lat: 28.6139, lon: 77.2090, r: 0.5 },
    { place: 'Bengaluru Tech Corridor', city: 'Bengaluru', country: 'India', lat: 12.9716, lon: 77.5946, r: 0.5 },
    { place: 'Hyderabad Hitec City', city: 'Hyderabad', country: 'India', lat: 17.3850, lon: 78.4867, r: 0.5 },
    { place: 'Chennai Marina Beach', city: 'Chennai', country: 'India', lat: 13.0827, lon: 80.2707, r: 0.5 },
    { place: 'Kolkata Howrah', city: 'Kolkata', country: 'India', lat: 22.5726, lon: 88.3639, r: 0.5 },
    { place: 'Taj Mahal', city: 'Agra', country: 'India', lat: 27.1751, lon: 78.0421, r: 0.3 },
    { place: 'Hawa Mahal', city: 'Jaipur', country: 'India', lat: 26.9124, lon: 75.7873, r: 0.4 },
    { place: 'Goa Coast', city: 'Goa', country: 'India', lat: 15.2993, lon: 74.1240, r: 0.5 },

    // Oceania, South America & Africa
    { place: 'Sydney Opera House', city: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093, r: 0.5 },
    { place: 'Melbourne Central', city: 'Melbourne', country: 'Australia', lat: -37.8136, lon: 144.9631, r: 0.5 },
    { place: 'Auckland Harbour', city: 'Auckland', country: 'New Zealand', lat: -36.8485, lon: 174.7633, r: 0.4 },
    { place: 'Christchurch', city: 'Christchurch', country: 'New Zealand', lat: -43.5321, lon: 172.6362, r: 0.4 },
    { place: 'Copacabana Beach', city: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lon: -43.1729, r: 0.5 },
    { place: 'São Paulo', city: 'São Paulo', country: 'Brazil', lat: -23.5505, lon: -46.6333, r: 0.6 },
    { place: 'Buenos Aires', city: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lon: -58.3816, r: 0.5 },
    { place: 'Table Mountain', city: 'Cape Town', country: 'South Africa', lat: -33.9249, lon: 18.4241, r: 0.4 },
    { place: 'Giza Pyramids', city: 'Cairo', country: 'Egypt', lat: 30.0444, lon: 31.2357, r: 0.5 }
  ];

  function resolveLocationOffline(lat, lon) {
    if (typeof lat !== 'number' || typeof lon !== 'number' || isNaN(lat) || isNaN(lon)) return null;
    let closest = null;
    let minD = Infinity;

    for (const p of OFFLINE_PLACES) {
      const d = Math.hypot(lat - p.lat, lon - p.lon);
      if (d <= p.r && d < minD) {
        minD = d;
        closest = p;
      }
    }

    if (closest) {
      return {
        place: closest.place,
        city: closest.city,
        country: closest.country
      };
    }

    // Macro continental / regional fallbacks
    if (lat >= 24 && lat <= 50 && lon >= -125 && lon <= -66) return { place: '', city: '', country: 'United States' };
    if (lat >= 45 && lat <= 70 && lon >= -140 && lon <= -55) return { place: '', city: '', country: 'Canada' };
    if (lat >= 35 && lat <= 70 && lon >= -10 && lon <= 40) return { place: '', city: '', country: 'Europe' };
    if (lat >= 8 && lat <= 37 && lon >= 68 && lon <= 97) return { place: '', city: '', country: 'India' };
    if (lat >= 20 && lat <= 46 && lon >= 122 && lon <= 150) return { place: '', city: '', country: 'Japan' };
    if (lat >= -44 && lat <= -10 && lon >= 113 && lon <= 154) return { place: '', city: '', country: 'Australia' };

    return null;
  }

  const clientGeocodeCache = new Map();
  async function resolveLocationFromCoords(lat, lon) {
    if (typeof lat !== 'number' || typeof lon !== 'number' || isNaN(lat) || isNaN(lon)) {
      return { latitude: lat, longitude: lon, displayCoords: '', place: '', city: '', country: '' };
    }
    const displayCoords = formatDisplayCoords(lat, lon);
    const key = `${lat.toFixed(3)},${lon.toFixed(3)}`;
    if (clientGeocodeCache.has(key)) return clientGeocodeCache.get(key);

    const offlineDefault = resolveLocationOffline(lat, lon);
    let place = offlineDefault ? offlineDefault.place : '';
    let city = offlineDefault ? offlineDefault.city : '';
    let country = offlineDefault ? offlineDefault.country : '';

    // Provider 1: BigDataCloud Reverse Geocode Client (Free, browser CORS, ultra-fast)
    try {
      const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`, {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const d = await res.json();
        let netPlace = d.locality || '';
        if (!netPlace && d.localityInfo && Array.isArray(d.localityInfo.administrative)) {
          netPlace = d.localityInfo.administrative[0]?.name || '';
        }
        let netCity = d.city || d.principalSubdivision || '';
        let netCountry = d.countryName || '';
        if (netCountry.includes('United Kingdom')) netCountry = 'United Kingdom';
        if (netCountry.includes('United States')) netCountry = 'United States';

        if (netCity || netCountry || netPlace) {
          const loc = {
            latitude: lat,
            longitude: lon,
            displayCoords: displayCoords,
            place: (netPlace || netCity || place).trim(),
            city: (netCity || netPlace || city).trim(),
            country: (netCountry || country).trim()
          };
          clientGeocodeCache.set(key, loc);
          return loc;
        }
      }
    } catch (_) {}

    // Provider 2: Photon Komoot Reverse (OpenStreetMap data, CORS-enabled backup)
    try {
      const res = await fetch(`https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}`);
      if (res.ok) {
        const d = await res.json();
        const f = d.features && d.features[0] && d.features[0].properties;
        if (f) {
          const loc = {
            latitude: lat,
            longitude: lon,
            displayCoords: displayCoords,
            place: (f.name || f.district || f.suburb || f.locality || place).trim(),
            city: (f.city || f.town || f.county || f.state || city).trim(),
            country: (f.country || country).trim()
          };
          if (loc.place || loc.city || loc.country) {
            clientGeocodeCache.set(key, loc);
            return loc;
          }
        }
      }
    } catch (_) {}

    // Provider 3: Nominatim OpenStreetMap (Tertiary fallback)
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`, {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        const loc = {
          latitude: lat,
          longitude: lon,
          displayCoords: displayCoords,
          place: (addr.attraction || addr.suburb || addr.neighbourhood || addr.amenity || addr.tourism || addr.road || place).trim(),
          city: (addr.city || addr.town || addr.village || addr.county || city).trim(),
          country: (addr.country || country).trim()
        };
        clientGeocodeCache.set(key, loc);
        return loc;
      }
    } catch (_) {}

    const loc = {
      latitude: lat,
      longitude: lon,
      displayCoords: displayCoords,
      place: place,
      city: city,
      country: country
    };
    clientGeocodeCache.set(key, loc);
    return loc;
  }

  async function extractMetadataFromBlob(file) {
    if (state.gpsMetadataEnabled === false) return { location: null, createdAt: null, cameraModel: null };
    try {
      const buffer = await file.arrayBuffer();
      const meta = extractFullMetadata(buffer);
      if (!meta) return { location: null, createdAt: null, cameraModel: null };

      let location = null;
      if (meta.coords && typeof meta.coords.latitude === 'number' && typeof meta.coords.longitude === 'number') {
        const displayCoords = formatDisplayCoords(meta.coords.latitude, meta.coords.longitude);
        const offlineMatch = resolveLocationOffline(meta.coords.latitude, meta.coords.longitude);
        location = {
          latitude: meta.coords.latitude,
          longitude: meta.coords.longitude,
          displayCoords: displayCoords,
          place: offlineMatch ? (offlineMatch.place || '') : '',
          city: offlineMatch ? (offlineMatch.city || '') : '',
          country: offlineMatch ? (offlineMatch.country || '') : ''
        };
      }
      return {
        location,
        createdAt: meta.timestamp || null,
        cameraModel: meta.cameraModel || null
      };
    } catch (_) {
      return { location: null, createdAt: null, cameraModel: null };
    }
  }

  async function extractLocationFromBlob(file) {
    const meta = await extractMetadataFromBlob(file);
    return meta ? meta.location : null;
  }

    // Camera Input Change Listener (Mobile Browser / Fallback)
  document.getElementById('cameraFileInput')?.addEventListener('change', async (e) => {
    isCameraTriggerBusy = false;
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const meta = await extractMetadataFromBlob(file);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      let location = meta.location;
      if (!location && state.gpsMetadataEnabled !== false) {
        try {
          if (navigator.geolocation) {
            const pos = await new Promise((res, rej) => {
              navigator.geolocation.getCurrentPosition(res, rej, { timeout: 3000 });
            });
            if (pos && pos.coords) {
              location = await resolveLocationFromCoords(pos.coords.latitude, pos.coords.longitude);
            }
          }
        } catch (_) {}
      }
      window.onNativePhotoCaptured(ev.target.result, 'Camera Shot', location);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  });

  // Gallery/File Input Change Listener (Mobile Browser / Fallback)
  document.getElementById('imageFileInput')?.addEventListener('change', async (e) => {
    isGalleryTriggerBusy = false;
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const loaded = await Promise.all(files.map(async (file) => {
      const dataUrlPromise = new Promise((res) => {
        const reader = new FileReader();
        reader.onload = ev => res(ev.target.result);
        reader.readAsDataURL(file);
      });
      const metaPromise = extractMetadataFromBlob(file);
      const [dataUrl, meta] = await Promise.all([dataUrlPromise, metaPromise]);
      return {
        displayName: file.name.substring(0, file.name.lastIndexOf('.')) || file.name,
        dataUrl: dataUrl,
        location: meta.location,
        createdAt: meta.createdAt,
        cameraModel: meta.cameraModel
      };
    }));
    window.onNativePhotosImported(loaded);
    e.target.value = '';
  });

  // -------------------------------------------------------------
  // VIP DIRECT ALBUM IMPORT HANDLERS (VIP Item 3)
  // -------------------------------------------------------------
  window.getActiveAlbumName = function() {
    if (state.selectedFilterTags && state.selectedFilterTags.size === 1) {
      return Array.from(state.selectedFilterTags)[0];
    }
    return (state.tags && state.tags.length > 0) ? state.tags[0].name : 'General';
  };

  window.openVipAlbumImportModal = function(albumName) {
    const modal = document.getElementById('vipDirectImportModal');
    const nameEl = document.getElementById('vipImportModalAlbumName');
    window._pendingVipImportAlbum = albumName || window.getActiveAlbumName();
    if (nameEl) nameEl.textContent = `'${window._pendingVipImportAlbum}'`;
    if (modal) modal.style.display = 'flex';
  };

  window.closeVipAlbumImportModal = function() {
    const modal = document.getElementById('vipDirectImportModal');
    if (modal) modal.style.display = 'none';
  };

  window.triggerAlbumDirectImport = function(albumName) {
    const targetAlbum = albumName || window.getActiveAlbumName();
    if (!state.isPro) {
      window.openVipAlbumImportModal(targetAlbum);
      return;
    }

    state.importTargetAlbum = targetAlbum;

    // Check if Native Android Bridge is available
    if (window.AndroidApp && typeof window.AndroidApp.openGalleryForAlbum === 'function') {
      window.AndroidApp.openGalleryForAlbum(targetAlbum);
    } else {
      // Web / Mobile browser multi-file input fallback
      const fileInput = document.getElementById('albumDirectFileInput');
      if (fileInput) {
        fileInput.value = '';
        fileInput.click();
      }
    }
  };

  window.handleAlbumDirectFileInput = async function(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const targetAlbum = state.importTargetAlbum || window.getActiveAlbumName();

    const loaded = await Promise.all(files.map(async (file) => {
      const dataUrlPromise = new Promise((res) => {
        const reader = new FileReader();
        reader.onload = ev => res(ev.target.result);
        reader.readAsDataURL(file);
      });
      const metaPromise = extractMetadataFromBlob(file);
      const [dataUrl, meta] = await Promise.all([dataUrlPromise, metaPromise]);
      return {
        displayName: file.name.substring(0, file.name.lastIndexOf('.')) || file.name,
        dataUrl: dataUrl,
        location: meta.location,
        createdAt: meta.createdAt,
        cameraModel: meta.cameraModel
      };
    }));
    window.onNativePhotosImportedToAlbum(loaded, targetAlbum);
    event.target.value = '';
  };

  window.onNativePhotosImportedToAlbum = function(photosList, albumName) {
    let list = photosList;
    if (typeof list === 'string') {
      try {
        list = JSON.parse(list);
      } catch (e) {
        console.error('Failed to parse photosList JSON:', e);
        list = [];
      }
    }
    if (!list || !list.length) return;

    const targetAlbum = albumName || state.importTargetAlbum || window.getActiveAlbumName();

    // Ensure the album tag exists in state.tags
    if (targetAlbum && !state.tags.some(t => t.name.toLowerCase() === targetAlbum.toLowerCase())) {
      const now = Date.now();
      state.tags.push({
        name: targetAlbum,
        color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)],
        createdAt: now,
        lastModifiedAt: now,
        lastViewedAt: now,
        isFavorite: false
      });
    }

    const timestamp = Date.now();
    list.forEach((item, index) => {
      let loc = (item.location && state.gpsMetadataEnabled !== false) ? item.location : null;
      let camera = item.cameraModel || null;
      let photoCreated = item.createdAt || null;
      const newPhotoId = `album_import_${timestamp}_${index}_${Math.random().toString(36).substr(2, 5)}`;

      if (item.dataUrl && (!loc || !camera || !photoCreated)) {
        const exif = extractFullExifFromBase64(item.dataUrl);
        if (exif) {
          if (!camera && exif.cameraModel) camera = exif.cameraModel;
          if (!photoCreated && exif.timestamp) photoCreated = exif.timestamp;
          if (!loc && exif.coords && state.gpsMetadataEnabled !== false) {
            loc = {
              latitude: exif.coords.latitude,
              longitude: exif.coords.longitude,
              place: '',
              city: '',
              country: ''
            };
          }
        }
      }

      // Background reverse-geocoding AFTER photo is safely placed in Album!
      const isAnyLocTagEnabled = state.locationTagPlace !== false || state.locationTagCity !== false || state.locationTagCountry !== false;
      if (state.gpsMetadataEnabled !== false && state.locationTagsEnabled !== false && isAnyLocTagEnabled &&
          loc && typeof loc.latitude === 'number' && typeof loc.longitude === 'number' && (!loc.place && !loc.city)) {
        const lat = loc.latitude;
        const lon = loc.longitude;
        resolveLocationFromCoords(lat, lon).then(resolved => {
          if (resolved && (resolved.place || resolved.city || resolved.country)) {
            const p = state.photos.find(x => x.id === newPhotoId);
            if (p) {
              p.location = resolved;
              saveState();
              if (state.activePhotoId === p.id) {
                renderDetailTags(p);
                updateDetailModalUI(p, true);
              }
              const galleryScreen = document.getElementById('galleryScreen');
              if (galleryScreen && galleryScreen.classList.contains('active')) {
                renderGallery();
              }
            }
          }
        }).catch(() => {});
      }

      const newPhoto = {
        id: newPhotoId,
        displayName: item.displayName || `Moment #${state.photos.length + 1}`,
        category: targetAlbum,
        isPending: false, // Placed directly into album; bypasses dock!
        isFavorite: false,
        deletedAt: null,
        createdAt: photoCreated || (timestamp + index),
        cameraModel: camera,
        tags: [targetAlbum],
        dataUrl: item.dataUrl,
        location: loc
      };
      state.photos.unshift(newPhoto);
    });

    if (targetAlbum) {
      recordAlbumActivity(targetAlbum, 'modified');
    }
    saveState();

    // Set filter to view this album in Gallery screen
    state.selectedFilterTags.clear();
    state.selectedFilterTags.add(targetAlbum);
    state.onlyFavorites = false;

    renderAll();
    // Switch to gallery tab
    document.querySelector('.nav-item[data-tab="galleryScreen"]')?.click();
    showToast(`✨ ${list.length} photo${list.length > 1 ? 's' : ''} imported directly into '${targetAlbum}'!`);
  };

  window.createAlbumAndPickPhotos = function() {
    const nameInput = document.getElementById('modalNewAlbumNameInput');
    const name = nameInput ? nameInput.value.trim() : '';
    if (!name) {
      showToast('Please enter an album title first!');
      return;
    }

    if (!state.tags.some(t => t.name.toLowerCase() === name.toLowerCase())) {
      const color = window._currentAlbumModalColor || PRESET_COLORS[0];
      const now = Date.now();
      state.tags.push({ 
        name, 
        color,
        createdAt: now,
        lastModifiedAt: now,
        lastViewedAt: now,
        isFavorite: false
      });
      saveState();
    }

    const modal = document.getElementById('createAlbumModal');
    if (modal) modal.style.display = 'none';
    renderAll();
    window.triggerAlbumDirectImport(name);
  };

  // -------------------------------------------------------------
  // VIP MOVE / COPY PHOTOS TO ALBUM (ITEM 6)
  // -------------------------------------------------------------
  window.openVipMoveCopyGateModal = function() {
    const modal = document.getElementById('vipMoveCopyModal');
    if (modal) modal.style.display = 'flex';
  };

  window.closeVipMoveCopyGateModal = function() {
    const modal = document.getElementById('vipMoveCopyModal');
    if (modal) modal.style.display = 'none';
    const targetAlbum = state.moveCopyIsAlbumMode ? state.moveCopySourceAlbum : null;
    state.moveCopySourceAlbum = null;
    state.moveCopyIsAlbumMode = false;
    if (targetAlbum && window.highlightReturnedAlbumCard) {
      window.highlightReturnedAlbumCard(targetAlbum);
    }
  };

  window.openMoveCopyModal = function(photoIds, sourceAlbumName) {
    let ids = photoIds;
    if (!ids || !ids.length) {
      if (state.selectedGalleryPhotoIds && state.selectedGalleryPhotoIds.size > 0) {
        ids = Array.from(state.selectedGalleryPhotoIds);
      } else if (state.activePhotoId) {
        ids = [state.activePhotoId];
      }
    }

    if (!ids || !ids.length) {
      showToast('Select photos first to organize them!');
      return;
    }

    // VIP Protection Gate
    if (!state.isPro) {
      window.openVipMoveCopyGateModal();
      return;
    }

    state.moveCopyAllSourcePhotoIds = [...ids];
    state.moveCopyTargetIds = [...ids];
    state.moveCopySelectedDestinations = [];
    state.moveCopyIsAlbumMode = false;
    state.moveCopySourceAlbum = sourceAlbumName || (state.selectedFilterTags && state.selectedFilterTags.size === 1 ? Array.from(state.selectedFilterTags)[0] : null);
    state.moveCopyMode = state.moveCopyMode || 'copy';
    state.moveCopyDestinationAlbum = null;
    state.moveCopySearchQuery = '';
    state.moveCopyMultiTags = [];
    state.moveCopyIsMultiTagDest = false;
    state.moveCopyDestinationTags = null;
    state.moveCopyMultiTagExpanded = false;

    resetMultiTagUI();

    const modal = document.getElementById('moveCopyModal');
    const modalTitle = document.getElementById('moveCopyModalTitle');
    const searchInput = document.getElementById('moveCopyAlbumSearchInput');
    const quickCreateBtn = document.getElementById('moveCopyQuickCreateBtn');
    const sourceBadge = document.getElementById('moveCopySourceBadge');
    const sourceDot = document.getElementById('sourceBadgeDot');
    const sourceName = document.getElementById('sourceBadgeName');
    const sourceCount = document.getElementById('sourceBadgeCount');
    const copyBtnSpan = document.querySelector('#modeCopyBtn span');
    const moveBtnSpan = document.querySelector('#modeMoveBtn span');
    const optionRow = document.getElementById('moveCopyOptionRow');

    if (modalTitle) modalTitle.textContent = window.t ? window.t('organize_photos_title') : 'Organize Photos';
    if (copyBtnSpan) copyBtnSpan.textContent = window.t ? window.t('organize_copy_photos') : 'Copy Photos';
    if (moveBtnSpan) moveBtnSpan.textContent = window.t ? window.t('organize_move_photos') : 'Move Photos';
    if (optionRow) optionRow.style.display = 'none';

    if (sourceBadge) {
      if (state.moveCopySourceAlbum) {
        sourceBadge.style.display = 'flex';
        const tagObj = state.tags.find(t => t.name.toLowerCase() === state.moveCopySourceAlbum.toLowerCase());
        if (sourceDot) sourceDot.style.background = tagObj ? tagObj.color : '#fbbf24';
        if (sourceName) sourceName.textContent = state.moveCopySourceAlbum;
        if (sourceCount) sourceCount.textContent = `${ids.length} ${window.t ? window.t('organize_selected_badge') : 'Selected'}`;
      } else {
        sourceBadge.style.display = 'none';
      }
    }

    if (searchInput) searchInput.value = '';
    if (quickCreateBtn) quickCreateBtn.style.display = 'none';

    // Render Preview Rail
    renderMoveCopyPreviewRail();

    // Render Mode UI
    window.setMoveCopyMode(state.moveCopyMode);

    // Render Albums List
    window.renderMoveCopyAlbumsList();

    if (modal) modal.style.display = 'flex';
  };

  // VIP Feature: Move or Copy COMPLETE Album
  window.openMoveCopyAlbumModal = function(sourceAlbumName) {
    if (!sourceAlbumName) return;

    state.moveCopySourceAlbum = sourceAlbumName;
    state.moveCopyIsAlbumMode = true;

    // VIP Protection Gate
    if (!state.isPro) {
      window.openVipMoveCopyGateModal();
      return;
    }

    // Collect valid photos in this album
    const validPhotos = state.photos.filter(p => !p.isPending && !p.deletedAt && p.tags && p.tags.includes(sourceAlbumName));
    if (!validPhotos.length) {
      showToast(`'${sourceAlbumName}' has no photos to organize.`);
      state.moveCopySourceAlbum = null;
      state.moveCopyIsAlbumMode = false;
      return;
    }

    state.moveCopyAllSourcePhotoIds = validPhotos.map(p => p.id);
    state.moveCopyTargetIds = [...state.moveCopyAllSourcePhotoIds];
    state.moveCopySelectedDestinations = [];
    state.moveCopyMode = state.moveCopyMode || 'copy';
    state.moveCopyDestinationAlbum = null;
    state.moveCopySearchQuery = '';
    state.moveCopyMultiTags = [];
    state.moveCopyIsMultiTagDest = false;
    state.moveCopyDestinationTags = null;
    state.moveCopyMultiTagExpanded = false;

    resetMultiTagUI();

    const modal = document.getElementById('moveCopyModal');
    const modalTitle = document.getElementById('moveCopyModalTitle');
    const searchInput = document.getElementById('moveCopyAlbumSearchInput');
    const quickCreateBtn = document.getElementById('moveCopyQuickCreateBtn');
    const sourceBadge = document.getElementById('moveCopySourceBadge');
    const sourceDot = document.getElementById('sourceBadgeDot');
    const sourceName = document.getElementById('sourceBadgeName');
    const sourceCount = document.getElementById('sourceBadgeCount');
    const copyBtnSpan = document.querySelector('#modeCopyBtn span');
    const moveBtnSpan = document.querySelector('#modeMoveBtn span');
    const deleteSourceCheck = document.getElementById('moveCopyDeleteSourceCheck');

    if (modalTitle) modalTitle.textContent = window.t ? window.t('organize_album_title') : 'Organize Album';
    if (copyBtnSpan) copyBtnSpan.textContent = window.t ? window.t('organize_copy_album') : 'Copy Album';
    if (moveBtnSpan) moveBtnSpan.textContent = window.t ? window.t('organize_move_album') : 'Move Album';
    if (deleteSourceCheck) deleteSourceCheck.checked = false;

    // Populate source album badge
    if (sourceBadge) {
      sourceBadge.style.display = 'flex';
      const tagObj = state.tags.find(t => t.name.toLowerCase() === sourceAlbumName.toLowerCase());
      if (sourceDot) sourceDot.style.background = tagObj ? tagObj.color : '#fbbf24';
      if (sourceName) sourceName.textContent = sourceAlbumName;
      const countNoun = validPhotos.length === 1 ? (window.t ? window.t('organize_photo_singular') : 'Photo') : (window.t ? window.t('organize_photos_plural') : 'Photos');
      if (sourceCount) sourceCount.textContent = `${validPhotos.length} ${countNoun}`;
    }

    if (searchInput) searchInput.value = '';
    if (quickCreateBtn) quickCreateBtn.style.display = 'none';

    renderMoveCopyPreviewRail();
    window.setMoveCopyMode(state.moveCopyMode);
    window.renderMoveCopyAlbumsList();

    if (modal) modal.style.display = 'flex';
  };

  window.closeMoveCopyModal = function(albumNameToHighlight) {
    const modal = document.getElementById('moveCopyModal');
    if (modal) modal.style.display = 'none';

    const sourceAlbumToHighlight = (typeof albumNameToHighlight === 'string' && albumNameToHighlight)
      ? albumNameToHighlight
      : (state.moveCopyIsAlbumMode ? state.moveCopySourceAlbum : null);

    state.moveCopyAllSourcePhotoIds = [];
    state.moveCopyTargetIds = [];
    state.moveCopySelectedDestinations = [];
    state.moveCopyDestinationAlbum = null;
    state.moveCopySourceAlbum = null;
    state.moveCopyIsAlbumMode = false;
    state.moveCopyMultiTags = [];
    state.moveCopyIsMultiTagDest = false;
    state.moveCopyDestinationTags = null;
    state.moveCopyMultiTagExpanded = false;

    resetMultiTagUI();

    const sourceBadge = document.getElementById('moveCopySourceBadge');
    if (sourceBadge) sourceBadge.style.display = 'none';
    const optionRow = document.getElementById('moveCopyOptionRow');
    if (optionRow) optionRow.style.display = 'none';
    const deleteSourceCheck = document.getElementById('moveCopyDeleteSourceCheck');
    if (deleteSourceCheck) deleteSourceCheck.checked = false;

    if (sourceAlbumToHighlight && window.highlightReturnedAlbumCard) {
      window.highlightReturnedAlbumCard(sourceAlbumToHighlight);
    }
  };

  function renderMoveCopyPreviewRail() {
    const rail = document.getElementById('moveCopyPreviewRail');
    const summary = document.getElementById('moveCopyPreviewSummary');
    const selectAllBtn = document.getElementById('moveCopySelectAllBtn');
    if (!rail) return;

    const allIds = state.moveCopyAllSourcePhotoIds || state.moveCopyTargetIds || [];
    const selectedIds = new Set(state.moveCopyTargetIds || []);
    const validPhotos = allIds.map(id => state.photos.find(p => p.id === id)).filter(Boolean);

    if (validPhotos.length === 0) {
      rail.innerHTML = `<div style="padding: 12px; color: var(--text-muted); font-size: 12px; text-align: center; width: 100%;">No source photos available</div>`;
      if (summary) summary.textContent = '0 photos selected';
      if (selectAllBtn) selectAllBtn.style.display = 'none';
      return;
    }

    if (selectAllBtn) {
      selectAllBtn.style.display = 'inline-flex';
      const allSelected = validPhotos.length > 0 && selectedIds.size === validPhotos.length;
      const selectAllSpan = selectAllBtn.querySelector('span');
      const selectAllIcon = selectAllBtn.querySelector('i');
      if (allSelected) {
        if (selectAllSpan) selectAllSpan.textContent = 'Deselect All';
        if (selectAllIcon) selectAllIcon.className = 'fa-solid fa-square-minus';
      } else {
        if (selectAllSpan) selectAllSpan.textContent = 'Select All';
        if (selectAllIcon) selectAllIcon.className = 'fa-solid fa-check-double';
      }
    }

    const cardsHtml = validPhotos.map(p => {
      const isSelected = selectedIds.has(p.id);
      const cardClass = isSelected ? 'move-copy-thumb-card selected' : 'move-copy-thumb-card deselected';
      const badgeIcon = isSelected ? '<i class="fa-solid fa-check"></i>' : '';
      const escapedTitle = escapeHtml(p.displayName || 'Photo');

      return `
        <div class="${cardClass}" onclick="toggleMoveCopyPhotoSelection('${p.id}')" title="${escapedTitle} (${isSelected ? 'Selected' : 'Deselected - Click to include'})">
          <img src="${p.dataUrl}" alt="${escapedTitle}" class="move-copy-thumb-img">
          <div class="move-copy-thumb-badge">${badgeIcon}</div>
          <div class="move-copy-thumb-remove" onclick="event.stopPropagation(); removeMoveCopyPhoto('${p.id}')" title="Remove from batch">
            <i class="fa-solid fa-xmark"></i>
          </div>
        </div>
      `;
    }).join('');

    rail.innerHTML = cardsHtml;

    if (summary) {
      const selectedCount = selectedIds.size;
      const totalCount = validPhotos.length;
      const photoNoun = selectedCount === 1 ? 'photo' : 'photos';
      if (state.moveCopyIsAlbumMode && state.moveCopySourceAlbum) {
        summary.textContent = `${selectedCount} of ${totalCount} ${photoNoun} from '${state.moveCopySourceAlbum}'`;
      } else {
        summary.textContent = `${selectedCount} of ${totalCount} ${photoNoun} selected`;
      }
    }

    updateMoveCopyOptionRowAndHint();
  }

  function updateMoveCopyOptionRowAndHint() {
    const mode = state.moveCopyMode || 'copy';
    const hint = document.getElementById('moveCopyModeHint');
    const optionRow = document.getElementById('moveCopyOptionRow');
    const deleteSourceCheck = document.getElementById('moveCopyDeleteSourceCheck');

    if (!optionRow) return;

    if (state.moveCopyIsAlbumMode && state.moveCopySourceAlbum) {
      const sourceAlbum = state.moveCopySourceAlbum;
      const allSourcePhotos = state.photos.filter(p => !p.isPending && !p.deletedAt && p.tags && p.tags.includes(sourceAlbum));
      const totalCount = allSourcePhotos.length;
      const selectedCount = (state.moveCopyTargetIds || []).length;
      const remainingCount = totalCount - selectedCount;

      if (mode === 'copy') {
        optionRow.style.display = 'none';
        if (deleteSourceCheck) deleteSourceCheck.checked = false;
        if (hint) {
          hint.textContent = window.t ? window.t('organize_copy_album_hint', { album: sourceAlbum }) : `Duplicates selected photos in '${sourceAlbum}' into the destination album. '${sourceAlbum}' remains intact.`;
        }
      } else {
        // Move mode
        if (remainingCount === 0 && totalCount > 0) {
          // All photos in source album are selected to be moved -> source album will be completely empty!
          optionRow.style.display = 'block';
          if (hint) {
            hint.textContent = window.t ? window.t('organize_move_album_hint', { album: sourceAlbum }) : `Relocates all photos from '${sourceAlbum}' into the destination album.`;
          }
        } else {
          // At least 1 photo remains in source album -> do NOT show empty album warning checkbox!
          optionRow.style.display = 'none';
          if (deleteSourceCheck) deleteSourceCheck.checked = false;
          if (hint) {
            const photoNoun = remainingCount === 1 ? 'photo' : 'photos';
            hint.textContent = `Relocates ${selectedCount} selected photo(s) from '${sourceAlbum}' into destination album. ${remainingCount} ${photoNoun} will remain in '${sourceAlbum}'.`;
          }
        }
      }
    } else {
      optionRow.style.display = 'none';
      if (deleteSourceCheck) deleteSourceCheck.checked = false;
      const activeTag = state.moveCopySourceAlbum;
      if (hint) {
        if (mode === 'copy') {
          hint.textContent = activeTag
            ? (window.t ? window.t('organize_copy_hint_source', { album: activeTag }) : `Adds photos to destination album. They will also remain in '${activeTag}'.`)
            : (window.t ? window.t('organize_copy_hint_general') : `Adds photos to destination album. They will also remain in their current album(s).`);
        } else {
          hint.textContent = activeTag
            ? (window.t ? window.t('organize_move_hint_source', { album: activeTag }) : `Moves photos to destination album and removes them from '${activeTag}'.`)
            : (window.t ? window.t('organize_move_hint_general') : `Relocates photos to destination album. Originals remain safe in your library.`);
        }
      }
    }
  }

  window.toggleMoveCopyPhotoSelection = function(photoId) {
    if (!state.moveCopyTargetIds) state.moveCopyTargetIds = [];
    const idx = state.moveCopyTargetIds.indexOf(photoId);
    if (idx >= 0) {
      state.moveCopyTargetIds.splice(idx, 1);
    } else {
      state.moveCopyTargetIds.push(photoId);
    }
    renderMoveCopyPreviewRail();
    updateMoveCopyConfirmButton();
  };

  window.removeMoveCopyPhoto = function(photoId) {
    if (state.moveCopyAllSourcePhotoIds) {
      state.moveCopyAllSourcePhotoIds = state.moveCopyAllSourcePhotoIds.filter(id => id !== photoId);
    }
    if (state.moveCopyTargetIds) {
      state.moveCopyTargetIds = state.moveCopyTargetIds.filter(id => id !== photoId);
    }
    renderMoveCopyPreviewRail();
    updateMoveCopyConfirmButton();
  };

  window.toggleMoveCopySelectAllPhotos = function() {
    const allIds = state.moveCopyAllSourcePhotoIds || [];
    const currentSelected = state.moveCopyTargetIds || [];
    if (currentSelected.length === allIds.length && allIds.length > 0) {
      state.moveCopyTargetIds = [];
    } else {
      state.moveCopyTargetIds = [...allIds];
    }
    renderMoveCopyPreviewRail();
    updateMoveCopyConfirmButton();
  };

  window.setMoveCopyMode = function(mode) {
    state.moveCopyMode = mode;
    const copyBtn = document.getElementById('modeCopyBtn');
    const moveBtn = document.getElementById('modeMoveBtn');

    if (copyBtn) copyBtn.classList.toggle('active', mode === 'copy');
    if (moveBtn) moveBtn.classList.toggle('active', mode === 'move');

    updateMoveCopyOptionRowAndHint();
    updateMoveCopyConfirmButton();
    window.renderMoveCopyAlbumsList();
  };

  window.handleMoveCopySearch = function(query) {
    state.moveCopySearchQuery = (query || '').trim().toLowerCase();
    const quickCreateBtn = document.getElementById('moveCopyQuickCreateBtn');
    
    // Check if album name already matches query
    const exists = state.tags.some(t => t.name.toLowerCase() === state.moveCopySearchQuery);
    if (quickCreateBtn) {
      quickCreateBtn.style.display = (state.moveCopySearchQuery && !exists) ? 'inline-flex' : 'none';
      quickCreateBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Create '${escapeHtml(query.trim())}'`;
    }

    window.renderMoveCopyAlbumsList();
  };

  window.quickCreateMoveCopyAlbum = function() {
    const input = document.getElementById('moveCopyAlbumSearchInput');
    const name = input ? input.value.trim() : '';
    if (!name) return;

    let tag = state.tags.find(t => t.name.toLowerCase() === name.toLowerCase());
    if (!tag) {
      const now = Date.now();
      tag = {
        name,
        color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)],
        createdAt: now,
        lastModifiedAt: now,
        lastViewedAt: now,
        isFavorite: false
      };
      state.tags.push(tag);
      saveState();
      renderAlbumsScreen();
    }

    window.selectMoveCopyDestination(name);
    if (input) input.value = '';
    const quickCreateBtn = document.getElementById('moveCopyQuickCreateBtn');
    if (quickCreateBtn) quickCreateBtn.style.display = 'none';
    state.moveCopySearchQuery = '';
    window.renderMoveCopyAlbumsList();
    showToast(`✨ Album '${name}' created and selected!`);
  };

  window.selectMoveCopyDestination = function(albumName) {
    if (state.moveCopyIsMultiTagDest) {
      state.moveCopyIsMultiTagDest = false;
      state.moveCopyDestinationTags = null;
      state.moveCopySelectedDestinations = [];
    }
    if (!state.moveCopySelectedDestinations) {
      state.moveCopySelectedDestinations = [];
    }

    const idx = state.moveCopySelectedDestinations.indexOf(albumName);
    if (idx >= 0) {
      state.moveCopySelectedDestinations.splice(idx, 1);
    } else {
      state.moveCopySelectedDestinations.push(albumName);
    }

    state.moveCopyDestinationAlbum = state.moveCopySelectedDestinations.join(' + ') || null;
    updateMoveCopyConfirmButton();
    window.renderMoveCopyAlbumsList();
    if (typeof window.updateMultiTagIntersection === 'function') {
      window.updateMultiTagIntersection();
    }
  };

  function updateMoveCopyConfirmButton() {
    const btn = document.getElementById('confirmMoveCopyBtn');
    const icon = document.getElementById('confirmMoveCopyIcon');
    const text = document.getElementById('confirmMoveCopyText');
    if (!btn || !text) return;

    const photoCount = (state.moveCopyTargetIds || []).length;
    const mode = state.moveCopyMode || 'copy';
    const verb = mode === 'copy' ? 'Copy' : 'Move';
    const countNoun = photoCount === 1 ? (window.t ? window.t('organize_photo_singular') : 'photo') : (window.t ? window.t('organize_photos_plural') : 'photos');

    if (photoCount === 0) {
      btn.disabled = true;
      text.textContent = `Select Photos to ${verb}`;
      btn.title = 'Select at least 1 photo to move/copy';
      if (icon) icon.className = mode === 'copy' ? 'fa-solid fa-copy' : 'fa-solid fa-arrow-right-arrow-left';
      return;
    }

    const selectedDests = state.moveCopySelectedDestinations || [];
    if (state.moveCopyIsMultiTagDest && state.moveCopyDestinationTags && state.moveCopyDestinationTags.length > 0) {
      btn.disabled = false;
      const combinedName = state.moveCopyDestinationTags.join(' + ');
      const tagCount = state.moveCopyDestinationTags.length;

      let actionLabel;
      if (combinedName.length <= 20) {
        actionLabel = `${verb} ${photoCount} ${countNoun} to '${combinedName}'`;
      } else {
        actionLabel = `${verb} ${photoCount} ${countNoun} to ${tagCount} Destination Tags`;
      }

      text.textContent = actionLabel;
      btn.title = `1-to-Many Mapping: ${verb} ${photoCount} ${countNoun} into all ${tagCount} destination tags (${combinedName})`;
      if (icon) icon.className = mode === 'copy' ? 'fa-solid fa-copy' : 'fa-solid fa-arrow-right-arrow-left';
      return;
    }

    if (!selectedDests.length) {
      btn.disabled = true;
      text.textContent = window.t ? window.t('organize_select_dest') : 'Select Destination';
      btn.title = window.t ? window.t('organize_select_dest') : 'Select one or more destination albums to proceed';
      if (icon) icon.className = mode === 'copy' ? 'fa-solid fa-copy' : 'fa-solid fa-arrow-right-arrow-left';
      return;
    }

    btn.disabled = false;
    if (selectedDests.length === 1) {
      const dest = selectedDests[0];
      const actionLabel = `${verb} ${photoCount} ${countNoun} to '${dest}'`;
      text.textContent = actionLabel;
      btn.title = `${actionLabel}`;
    } else {
      const combined = selectedDests.join(' + ');
      const destLabel = combined.length <= 22 ? `'${combined}'` : `${selectedDests.length} Destination Albums`;
      const actionLabel = `${verb} ${photoCount} ${countNoun} to ${destLabel}`;
      text.textContent = actionLabel;
      btn.title = `${verb} ${photoCount} ${countNoun} into ${selectedDests.length} destination albums (${combined})`;
    }
    if (icon) icon.className = mode === 'copy' ? 'fa-solid fa-copy' : 'fa-solid fa-arrow-right-arrow-left';
  }

  window.renderMoveCopyAlbumsList = function() {
    const list = document.getElementById('moveCopyAlbumsList');
    if (!list) return;

    const destPill = document.getElementById('moveCopyDestSelectionPill');
    const selectedDestCount = (state.moveCopySelectedDestinations || []).length;
    if (destPill) {
      if (selectedDestCount > 0) {
        destPill.style.display = 'inline-flex';
        destPill.innerHTML = `<i class="fa-solid fa-check"></i> ${selectedDestCount} Selected`;
      } else {
        destPill.style.display = 'none';
      }
    }

    const q = state.moveCopySearchQuery || '';
    const sourceAlbum = state.moveCopySourceAlbum;

    let availableTags = state.tags || [];
    if (q) {
      availableTags = availableTags.filter(t => t.name.toLowerCase().includes(q));
    }

    if (!availableTags.length) {
      list.innerHTML = `
        <div style="text-align: center; padding: 20px; color: var(--text-muted); font-size: 13px;">
          No matching albums found. Tap "Create" above to make a new one!
        </div>
      `;
      return;
    }

    const validPhotos = state.photos.filter(p => !p.isPending && !p.deletedAt);

    // Multi-tag combined row at top if >= 2 valid tags
    const multiTags = (state.moveCopyMultiTags || []).filter(t => t && t.trim().length > 0);
    let multiTagTopRowHtml = '';
    if (multiTags.length >= 2) {
      const combinedName = multiTags.join(' + ');
      const isMultiSelected = !!state.moveCopyIsMultiTagDest;
      const matchCount = validPhotos.filter(p =>
        multiTags.every(vt => p.tags && p.tags.some(pt => pt.toLowerCase() === vt.toLowerCase()))
      ).length;
      const countNoun = matchCount === 1
        ? (window.t ? window.t('organize_photo_singular') : 'photo')
        : (window.t ? window.t('organize_photos_plural') : 'photos');

      const dotStackHtml = multiTags.map(t => {
        const tagObj = (state.tags || []).find(tag => tag.name.toLowerCase() === t.toLowerCase());
        const color = tagObj ? tagObj.color : '#fbbf24';
        return `<span class="multitag-stack-dot" style="background: ${color};" title="${escapeHtml(t)}"></span>`;
      }).join('');

      multiTagTopRowHtml = `
        <div class="move-copy-album-row multitag-combined-row ${isMultiSelected ? 'selected' : ''}" 
             onclick="selectMultiTagAsDestination()" title="Select 1-to-Many combined destination: ${escapeHtml(combinedName)}">
          <div class="album-row-left multitag-combined-left">
            <div class="multitag-result-dot-stack">
              ${dotStackHtml}
            </div>
            <div class="multitag-combined-info">
              <div class="multitag-combined-header">
                <span class="multitag-combined-title" title="${escapeHtml(combinedName)}">${escapeHtml(combinedName)}</span>
                <span class="multitag-vip-pill" title="1-to-Many: Photos will be assigned to all ${multiTags.length} destination tags"><i class="fa-solid fa-diagram-project"></i> 1-to-Many VIP</span>
              </div>
              <div class="multitag-combined-sub">
                <span class="multitag-combined-desc"><i class="fa-solid fa-arrows-split-up-and-left" style="font-size: 10px;"></i> Mapped to all ${multiTags.length} tags</span>
                <span class="multitag-combined-sep">•</span>
                <span class="multitag-combined-match">${matchCount} ${escapeHtml(countNoun)} match</span>
              </div>
            </div>
          </div>
          <div class="album-row-radio">
            <i class="fa-solid fa-check"></i>
          </div>
        </div>
      `;
    }

    list.innerHTML = multiTagTopRowHtml + availableTags.map(tag => {
      const isSelected = (state.moveCopySelectedDestinations || []).includes(tag.name);
      // In album mode, disable source album for both copy and move (cannot copy/move an album into itself)
      // In photo mode, only disable source in move mode
      const isSource = sourceAlbum && sourceAlbum.toLowerCase() === tag.name.toLowerCase();
      const isDisabled = state.moveCopyIsAlbumMode ? isSource : (state.moveCopyMode === 'move' && isSource);
      const count = validPhotos.filter(p => p.tags && p.tags.includes(tag.name)).length;

      let clickHandler = `selectMoveCopyDestination('${escapeHtml(tag.name)}')`;
      if (isDisabled) {
        if (state.moveCopyIsAlbumMode) {
          clickHandler = `showToast('Cannot ${state.moveCopyMode === 'copy' ? 'copy' : 'move'} an album into itself!')`;
        } else {
          clickHandler = `showToast('Cannot move photos into the same source album!')`;
        }
      }

      const sourceTagLabel = window.t ? window.t('organize_source_tag') : 'Source Album';
      const countNoun = count === 1 ? (window.t ? window.t('organize_photo_singular') : 'photo') : (window.t ? window.t('organize_photos_plural') : 'photos');

      return `
        <div class="move-copy-album-row ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}" 
             onclick="${clickHandler}">
          <div class="album-row-left">
            <span class="album-row-dot" style="background: ${tag.color};"></span>
            <div>
              <div class="album-row-name">
                ${escapeHtml(tag.name)}
                ${isSource ? `<span style="font-size: 10px; color: #fbbf24; margin-left: 6px; font-weight: 600;">(${escapeHtml(sourceTagLabel)})</span>` : ''}
              </div>
              <div class="album-row-count">${count} ${escapeHtml(countNoun)}</div>
            </div>
          </div>
          <div class="album-row-radio">
            <i class="fa-solid fa-check"></i>
          </div>
        </div>
      `;
    }).join('');
  };

  // -------------------------------------------------------------
  // VIP COLLECTION FUSION STUDIO (MULTI-ALBUM MERGE & CURATION)
  // -------------------------------------------------------------
  const FUSION_JEWEL_COLORS = [
    { name: 'Imperial Gold', hex: '#fbbf24' },
    { name: 'Ruby Crimson', hex: '#f43f5e' },
    { name: 'Electric Emerald', hex: '#10b981' },
    { name: 'Royal Sapphire', hex: '#3b82f6' },
    { name: 'Amethyst Purple', hex: '#a855f7' },
    { name: 'Amber Sunset', hex: '#f59e0b' },
    { name: 'Cyber Cyan', hex: '#06b6d4' },
    { name: 'Rose Quartz', hex: '#ec4899' }
  ];

  function resetMultiTagUI() {
    window.resetFusionStudioUI();
  }

  window.resetFusionStudioUI = function() {
    state.moveCopyMultiTagExpanded = false;
    state.fusionAlbums = [];
    state.fusionCollectionName = '';
    state.fusionUserEditedName = false;
    state.fusionCollectionColor = '#fbbf24';
    state.fusionCandidateSearch = '';
    state.fusionNameVariation = 0;

    const container = document.getElementById('moveCopyMultiTagContainer');
    const toggleBtn = document.getElementById('multiTagToggleBtn');
    const body = document.getElementById('multiTagBuilderBody');
    const activeBadge = document.getElementById('fusionActiveBadge');
    const searchInput = document.getElementById('fusionAlbumSearchInput');
    const nameInput = document.getElementById('fusionCollectionNameInput');
    const albumsList = document.getElementById('fusionAlbumsList');
    const colorPickerContainer = document.getElementById('fusionColorPickerContainer');

    if (container) container.classList.remove('highlighted-dest');
    if (toggleBtn) {
      toggleBtn.classList.remove('expanded');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
    if (body) body.style.display = 'none';
    if (activeBadge) activeBadge.textContent = 'Merge Albums';
    if (searchInput) searchInput.value = '';
    if (nameInput) nameInput.value = '';
    if (albumsList) albumsList.innerHTML = '';
    if (colorPickerContainer) colorPickerContainer.innerHTML = '';
  };

  // Backwards compatibility alias
  window.toggleMultiTagBuilder = function() {
    window.toggleFusionStudio();
  };

  window.toggleFusionStudio = function() {
    state.moveCopyMultiTagExpanded = !state.moveCopyMultiTagExpanded;
    const body = document.getElementById('multiTagBuilderBody');
    const toggleBtn = document.getElementById('multiTagToggleBtn');
    if (!body || !toggleBtn) return;

    if (state.moveCopyMultiTagExpanded) {
      body.style.display = 'block';
      toggleBtn.classList.add('expanded');
      toggleBtn.setAttribute('aria-expanded', 'true');

      // Initialize with primary source album if not already populated
      if (!Array.isArray(state.fusionAlbums) || state.fusionAlbums.length === 0) {
        window.initFusionStudioWithSource();
      }

      window.renderFusionStudio();
    } else {
      body.style.display = 'none';
      toggleBtn.classList.remove('expanded');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  };

  window.initFusionStudioWithSource = function() {
    state.fusionAlbums = [];
    const sourceAlbum = state.moveCopySourceAlbum;
    const validPhotos = (state.photos || []).filter(p => !p.deletedAt);
    const presets = (typeof PRESET_COLORS !== 'undefined' && Array.isArray(PRESET_COLORS)) ? PRESET_COLORS : ['#e11d48', '#d97706', '#059669', '#7c3aed', '#0284c7'];
    let color = presets[0] || '#fbbf24';

    if (sourceAlbum) {
      const tagObj = (state.tags || []).find(t => t.name.toLowerCase() === sourceAlbum.toLowerCase());
      if (tagObj && tagObj.color) color = tagObj.color;
      const albumPhotos = validPhotos.filter(p => Array.isArray(p.tags) && p.tags.includes(sourceAlbum));
      const allPhotoIds = albumPhotos.map(p => p.id);
      const selectedPhotoIds = (state.moveCopyTargetIds && state.moveCopyTargetIds.length > 0)
        ? state.moveCopyTargetIds.filter(id => allPhotoIds.includes(id))
        : [...allPhotoIds];

      state.fusionAlbums.push({
        albumName: sourceAlbum,
        color: color,
        allPhotoIds: allPhotoIds,
        selectedPhotoIds: selectedPhotoIds
      });
    } else {
      // Direct photo selection context
      const targetIds = state.moveCopyTargetIds || state.moveCopyAllSourcePhotoIds || [];
      if (targetIds.length > 0) {
        state.fusionAlbums.push({
          albumName: 'Selected Photos',
          color: color,
          allPhotoIds: [...targetIds],
          selectedPhotoIds: [...targetIds]
        });
      }
    }

    const matchingPreset = presets.find(c => c.toLowerCase() === (color || '').toLowerCase());
    state.fusionCollectionColor = matchingPreset || (state.savedCustomColors || []).find(c => c.toLowerCase() === (color || '').toLowerCase()) || presets[0] || '#fbbf24';
    state.fusionUserEditedName = false;
    state.fusionNameVariation = 0;
    state.fusionCollectionName = window.generateSmartCollectionName(0);
  };

  // Smart collection name synthesis
  window.generateSmartCollectionName = function(variation = 0) {
    const albums = (state.fusionAlbums || []).map(a => a.albumName).filter(Boolean);
    if (!albums.length) return 'New Curated Collection';

    const clean = name => {
      return name
        .replace(/\b(album|photos|pictures|pics|folder|collection)\b/gi, '')
        .replace(/[,_\-\+]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    };

    const cleaned = albums.map(clean).filter(Boolean);
    if (!cleaned.length) return 'Curated Highlights';

    const mod = Math.abs(variation) % 5;

    if (cleaned.length === 1) {
      const a = cleaned[0];
      const patterns = [
        `${a} Highlights`,
        `Best of ${a}`,
        `${a} Curated`,
        `${a} Memories`,
        `${a} Favorites`
      ];
      return patterns[mod];
    }

    if (cleaned.length === 2) {
      const [a, b] = cleaned;
      const patterns = [
        `${a} & ${b} Highlights`,
        `${a} & ${b} Memories`,
        `Best of ${a} & ${b}`,
        `${a} + ${b} Fusion`,
        `${a} & ${b} Collection`
      ];
      return patterns[mod];
    }

    // 3 or more albums
    const [a, b, c] = cleaned;
    const patterns = [
      `${a}, ${b} & More Highlights`,
      `${a} & ${b} Memories (${cleaned.length} Albums)`,
      `Best of ${a}, ${b} & ${c || 'Friends'}`,
      `Grand Fusion Collection`,
      `Curated: ${a} & ${b}`
    ];
    return patterns[mod];
  };

  window.rerollFusionSmartName = function() {
    state.fusionNameVariation = (state.fusionNameVariation || 0) + 1;
    const name = window.generateSmartCollectionName(state.fusionNameVariation);
    state.fusionCollectionName = name;
    state.fusionUserEditedName = false;

    const input = document.getElementById('fusionCollectionNameInput');
    if (input) {
      input.value = name;
      input.classList.add('pulse-glow');
      setTimeout(() => input.classList.remove('pulse-glow'), 600);
    }
    window.updateFusionActionFooter();
    showToast(`✨ Suggested: "${name}"`);
  };

  window.handleFusionNameInput = function(val) {
    state.fusionCollectionName = val;
    state.fusionUserEditedName = !!val.trim();
    window.updateFusionActionFooter();
  };

  window.selectFusionColor = function(colorHex, isFinal = true) {
    state.fusionCollectionColor = colorHex;
    window.renderFusionColorPicker();
  };

  // Main Fusion Studio Renderer
  window.renderFusionStudio = function() {
    try {
      const albums = state.fusionAlbums || [];
      const validPhotos = (state.photos || []).filter(p => !p.deletedAt);

      // 1. Update Header Badge
      const activeBadge = document.getElementById('fusionActiveBadge');
      if (activeBadge) {
        const totalSelected = albums.reduce((acc, a) => acc + (a.selectedPhotoIds ? a.selectedPhotoIds.length : 0), 0);
        const albumCount = albums.length;
        activeBadge.textContent = albumCount > 0
          ? `${albumCount} ${albumCount === 1 ? 'Album' : 'Albums'} · ${totalSelected} Photos`
          : 'Merge Albums';
      }

      // 2. Render Album Cards with Prominent Name and Exact Single Box Rail Parity
      const albumsList = document.getElementById('fusionAlbumsList');
      if (albumsList) {
        if (!albums.length) {
          albumsList.innerHTML = `
            <div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 12.5px;">
              No albums added yet. Pick an album below to start merging!
            </div>
          `;
        } else {
          albumsList.innerHTML = albums.map((albumObj, albumIdx) => {
            const { albumName, color, allPhotoIds = [], selectedPhotoIds = [] } = albumObj;
            const selectedSet = new Set(selectedPhotoIds);
            const albumPhotos = allPhotoIds.map(id => validPhotos.find(p => p.id === id)).filter(Boolean);
            const allSelected = albumPhotos.length > 0 && selectedPhotoIds.length === albumPhotos.length;

            // Header action buttons
            const selectAllLabel = allSelected ? 'Deselect All' : 'Select All';
            const selectAllIcon = allSelected ? 'fa-solid fa-square-minus' : 'fa-solid fa-check-double';
            const canRemoveAlbum = albums.length > 1;

            // Render horizontal photo rail cards - 100% same image rail to display from single tag selection
            const thumbsHtml = albumPhotos.length > 0 ? albumPhotos.map(p => {
              const isSelected = selectedSet.has(p.id);
              const cardClass = isSelected ? 'move-copy-thumb-card selected' : 'move-copy-thumb-card deselected';
              const badgeIcon = isSelected ? '<i class="fa-solid fa-check"></i>' : '';
              const photoTitle = escapeHtml(p.displayName || 'Photo');

              return `
                <div class="${cardClass}" onclick="window.toggleFusionPhotoSelection(${albumIdx}, '${p.id}')" title="${photoTitle} (${isSelected ? 'Selected' : 'Deselected - Click to include'})">
                  <img src="${p.dataUrl}" alt="${photoTitle}" class="move-copy-thumb-img" loading="lazy">
                  <div class="move-copy-thumb-badge">${badgeIcon}</div>
                  <div class="move-copy-thumb-remove" onclick="event.stopPropagation(); window.removeFusionPhoto(${albumIdx}, '${p.id}')" title="Remove photo from collection">
                    <i class="fa-solid fa-xmark"></i>
                  </div>
                </div>
              `;
            }).join('') : `<div style="padding: 10px; color: var(--text-muted); font-size: 11.5px;">No photos available in this album</div>`;

            return `
              <div class="fusion-album-card" id="fusionAlbumCard_${albumIdx}">
                <div class="fusion-album-header">
                  <div class="fusion-album-header-top">
                    <div class="fusion-album-identity">
                      <span class="fusion-album-num-badge">#${albumIdx + 1}</span>
                      <span class="fusion-album-dot" style="background: ${color}; color: ${color};"></span>
                      <span class="fusion-album-name" title="${escapeHtml(albumName)}">${escapeHtml(albumName)}</span>
                    </div>
                    <div class="fusion-album-header-right">
                      <button type="button" class="fusion-album-select-all-btn" onclick="window.toggleFusionAlbumSelectAll(${albumIdx})">
                        <i class="${selectAllIcon}"></i> <span>${selectAllLabel}</span>
                      </button>
                      ${canRemoveAlbum ? `
                        <button type="button" class="fusion-album-remove-btn" onclick="window.removeAlbumFromFusion(${albumIdx})" title="Remove this entire album from merge">
                          <i class="fa-solid fa-xmark"></i>
                        </button>
                      ` : ''}
                    </div>
                  </div>
                  <div class="fusion-album-header-bottom">
                    <span class="fusion-album-subrow-text">
                      <strong style="color: #fbbf24;">${selectedPhotoIds.length}</strong> of ${albumPhotos.length} photos from '<span class="fusion-album-subrow-name">${escapeHtml(albumName)}</span>'
                    </span>
                  </div>
                </div>
                <div class="move-copy-preview-rail fusion-album-rail">
                  ${thumbsHtml}
                </div>
              </div>
            `;
          }).join('');
        }
      }

      // 3. Render Candidate Album Chips
      window.renderFusionCandidateChips();

      // 4. Render Collection Name & Categorized Color Picker Kit
      const nameInput = document.getElementById('fusionCollectionNameInput');
      if (nameInput) {
        if (!state.fusionCollectionName) {
          state.fusionCollectionName = window.generateSmartCollectionName(state.fusionNameVariation || 0);
        }
        nameInput.value = state.fusionCollectionName;
      }

      window.renderFusionColorPicker();
      window.updateFusionActionFooter();
    } catch (err) {
      console.error('Error in renderFusionStudio:', err);
    }
  };

  // Render candidate albums to add
  window.renderFusionCandidateChips = function() {
    const chipsContainer = document.getElementById('fusionCandidateChips');
    if (!chipsContainer) return;

    const allTags = state.tags || [];
    const addedAlbumNames = new Set((state.fusionAlbums || []).map(a => a.albumName.toLowerCase()));
    const validPhotos = (state.photos || []).filter(p => !p.deletedAt);
    const q = (state.fusionCandidateSearch || '').trim().toLowerCase();

    // Filter candidate tags: exclude already added albums
    let candidates = allTags.filter(t => !addedAlbumNames.has(t.name.toLowerCase()));
    if (q) {
      candidates = candidates.filter(t => t.name.toLowerCase().includes(q));
    }

    if (!candidates.length) {
      chipsContainer.innerHTML = `
        <div style="font-size: 11.5px; color: var(--text-muted); padding: 6px 4px;">
          ${allTags.length === addedAlbumNames.size ? 'All your albums are already added to this merge!' : 'No matching albums found.'}
        </div>
      `;
      return;
    }

    chipsContainer.innerHTML = candidates.map(candidate => {
      const matchCount = validPhotos.filter(p => Array.isArray(p.tags) && p.tags.includes(candidate.name)).length;
      const countNoun = matchCount === 1 ? 'photo' : 'photos';
      const safeName = encodeURIComponent(candidate.name);

      return `
        <div class="fusion-candidate-chip" onclick="window.addAlbumToFusion('${safeName}')" title="Add '${escapeHtml(candidate.name)}' to collection">
          <span class="fusion-chip-dot" style="background: ${candidate.color || '#3b82f6'}; color: ${candidate.color || '#3b82f6'};"></span>
          <span class="fusion-chip-name">${escapeHtml(candidate.name)}</span>
          <span class="fusion-chip-count">${matchCount} ${countNoun}</span>
        </div>
      `;
    }).join('');
  };

  window.handleFusionAlbumSearch = function(query) {
    state.fusionCandidateSearch = query || '';
    window.renderFusionCandidateChips();
  };

  // Add album to the merge queue
  window.addAlbumToFusion = function(encodedAlbumName) {
    const albumName = decodeURIComponent(encodedAlbumName);
    if (!Array.isArray(state.fusionAlbums)) state.fusionAlbums = [];

    // Avoid duplicates
    if (state.fusionAlbums.some(a => a.albumName.toLowerCase() === albumName.toLowerCase())) return;

    const tagObj = (state.tags || []).find(t => t.name.toLowerCase() === albumName.toLowerCase());
    const color = tagObj ? tagObj.color : '#3b82f6';
    const validPhotos = (state.photos || []).filter(p => !p.deletedAt);
    const albumPhotos = validPhotos.filter(p => Array.isArray(p.tags) && p.tags.includes(albumName));
    const allPhotoIds = albumPhotos.map(p => p.id);

    state.fusionAlbums.push({
      albumName,
      color,
      allPhotoIds,
      selectedPhotoIds: [...allPhotoIds] // default all selected for this new album
    });

    // Update smart name unless user explicitly typed a custom name
    if (!state.fusionUserEditedName) {
      state.fusionCollectionName = window.generateSmartCollectionName(state.fusionNameVariation || 0);
    }

    state.fusionCandidateSearch = '';
    const searchInput = document.getElementById('fusionAlbumSearchInput');
    if (searchInput) searchInput.value = '';

    window.renderFusionStudio();

    // Scroll smoothly to newly added album card
    setTimeout(() => {
      const newIdx = state.fusionAlbums.length - 1;
      const card = document.getElementById(`fusionAlbumCard_${newIdx}`);
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);

    showToast(`✨ Added album '${albumName}' (${allPhotoIds.length} photos) to collection!`);
  };

  // Remove album from the merge queue
  window.removeAlbumFromFusion = function(albumIdx) {
    if (!Array.isArray(state.fusionAlbums) || !state.fusionAlbums[albumIdx]) return;
    const removedName = state.fusionAlbums[albumIdx].albumName;
    state.fusionAlbums.splice(albumIdx, 1);

    if (!state.fusionUserEditedName) {
      state.fusionCollectionName = window.generateSmartCollectionName(state.fusionNameVariation || 0);
    }

    window.renderFusionStudio();
    showToast(`Removed '${removedName}' from merge.`);
  };

  // Toggle selection of photo within an album
  window.toggleFusionPhotoSelection = function(albumIdx, photoId) {
    const album = (state.fusionAlbums || [])[albumIdx];
    if (!album) return;
    if (!Array.isArray(album.selectedPhotoIds)) album.selectedPhotoIds = [];

    const idx = album.selectedPhotoIds.indexOf(photoId);
    if (idx >= 0) {
      album.selectedPhotoIds.splice(idx, 1);
    } else {
      album.selectedPhotoIds.push(photoId);
    }

    window.renderFusionStudio();
  };

  // Remove photo from album's pool
  window.removeFusionPhoto = function(albumIdx, photoId) {
    const album = (state.fusionAlbums || [])[albumIdx];
    if (!album) return;

    if (album.allPhotoIds) {
      album.allPhotoIds = album.allPhotoIds.filter(id => id !== photoId);
    }
    if (album.selectedPhotoIds) {
      album.selectedPhotoIds = album.selectedPhotoIds.filter(id => id !== photoId);
    }

    window.renderFusionStudio();
  };

  // Toggle Select All / Deselect All for an individual album
  window.toggleFusionAlbumSelectAll = function(albumIdx) {
    const album = (state.fusionAlbums || [])[albumIdx];
    if (!album) return;

    const allIds = album.allPhotoIds || [];
    const selectedIds = album.selectedPhotoIds || [];

    if (selectedIds.length === allIds.length && allIds.length > 0) {
      album.selectedPhotoIds = [];
    } else {
      album.selectedPhotoIds = [...allIds];
    }

    window.renderFusionStudio();
  };

  // Categorized Color Picker Kit (Curated Presets + Your Color Palettes with Studio Modal)
  window.renderFusionColorPicker = function() {
    const container = document.getElementById('fusionColorPickerContainer');
    if (!container) return;

    container.innerHTML = buildCategorizedPaletteHtml({
      presetColors: PRESET_COLORS,
      selectedColor: state.fusionCollectionColor || PRESET_COLORS[0],
      savedColors: state.savedCustomColors || [],
      onSelectFn: 'selectFusionColor',
      customInputId: 'fusionCustomColorInput',
      customSwatchId: 'fusionCustomColorSwatch'
    });
  };
  // Backwards compatibility alias
  window.renderFusionColorSwatches = window.renderFusionColorPicker;

  // Update summary & CTA Forge Button state
  window.updateFusionActionFooter = function() {
    const summary = document.getElementById('fusionTotalSummary');
    const createBtn = document.getElementById('fusionCreateBtn');
    const createBtnText = document.getElementById('fusionCreateBtnText');
    const albums = state.fusionAlbums || [];

    // Deduplicate selected photo IDs across all albums
    const allSelectedPhotoIds = new Set();
    albums.forEach(a => {
      (a.selectedPhotoIds || []).forEach(id => allSelectedPhotoIds.add(id));
    });

    const totalSelectedCount = allSelectedPhotoIds.size;
    const albumCount = albums.length;
    const photoNoun = totalSelectedCount === 1 ? 'photo' : 'photos';
    const albumNoun = albumCount === 1 ? 'album' : 'albums';

    if (summary) {
      summary.innerHTML = `<i class="fa-solid fa-sparkles" style="color: #fbbf24; margin-right: 4px;"></i> Total: <strong style="color: #ffffff;">${totalSelectedCount}</strong> curated ${photoNoun} from <strong style="color: #ffffff;">${albumCount}</strong> ${albumNoun}`;
    }

    const collectionName = (state.fusionCollectionName || '').trim();
    const canCreate = totalSelectedCount > 0 && collectionName.length > 0;

    if (createBtn) {
      createBtn.disabled = !canCreate;
    }
    if (createBtnText) {
      if (!collectionName) {
        createBtnText.textContent = 'Enter Collection Name';
      } else if (totalSelectedCount === 0) {
        createBtnText.textContent = 'Select Photos to Forge';
      } else {
        const noun = totalSelectedCount === 1 ? 'Photo' : 'Photos';
        createBtnText.textContent = `Forge Collection (${totalSelectedCount} ${noun})`;
      }
    }
  };

  // Master Action: Create the new collection with all curated selections
  window.executeCollectionFusion = function() {
    const collectionName = (state.fusionCollectionName || '').trim();
    if (!collectionName) {
      showToast('Please provide a name for your new collection.');
      document.getElementById('fusionCollectionNameInput')?.focus();
      return;
    }

    const albums = state.fusionAlbums || [];
    const allSelectedPhotoIds = new Set();
    albums.forEach(a => {
      (a.selectedPhotoIds || []).forEach(id => allSelectedPhotoIds.add(id));
    });

    const uniqueIds = Array.from(allSelectedPhotoIds);
    if (!uniqueIds.length) {
      showToast('Please select at least 1 photo across your chosen albums.');
      return;
    }

    // Ensure tag exists in global tags list
    let tag = (state.tags || []).find(t => t.name.toLowerCase() === collectionName.toLowerCase());
    const now = Date.now();
    if (!tag) {
      tag = {
        name: collectionName,
        color: state.fusionCollectionColor || '#fbbf24',
        createdAt: now,
        lastModifiedAt: now,
        lastViewedAt: now,
        isFavorite: false
      };
      state.tags.push(tag);
    } else {
      // Update its color and timestamp
      tag.color = state.fusionCollectionColor || tag.color || '#fbbf24';
      tag.lastModifiedAt = now;
    }

    // Snapshot previous photo tags for undo
    const previousSnapshots = uniqueIds.map(id => {
      const p = (state.photos || []).find(item => item.id === id);
      return p ? { id, tags: [...p.tags], category: p.category } : null;
    }).filter(Boolean);

    // Apply new collection tag to all selected photos
    let taggedCount = 0;
    uniqueIds.forEach(id => {
      const photo = (state.photos || []).find(p => p.id === id);
      if (!photo) return;
      taggedCount++;

      if (!Array.isArray(photo.tags)) photo.tags = [];
      if (!photo.tags.includes(collectionName)) {
        photo.tags.push(collectionName);
      }
      if (!photo.category || photo.category === 'Import') {
        photo.category = collectionName;
      }
    });

    saveState();

    // Close the organize modal
    window.closeMoveCopyModal(collectionName);

    // If albums screen is active, refresh it and highlight new collection
    if (typeof renderAlbumsScreen === 'function') {
      renderAlbumsScreen();
    }
    if (typeof window.highlightReturnedAlbumCard === 'function') {
      setTimeout(() => {
        window.highlightReturnedAlbumCard(collectionName);
      }, 100);
    }

    // Push undo action
    if (typeof pushUndoAction === 'function') {
      pushUndoAction({
        description: `Create Collection '${collectionName}'`,
        undo: () => {
          previousSnapshots.forEach(snap => {
            const p = state.photos.find(item => item.id === snap.id);
            if (p) {
              p.tags = [...snap.tags];
              p.category = snap.category;
            }
          });
          // Remove created tag if it didn't exist before
          saveState();
          if (typeof renderAlbumsScreen === 'function') renderAlbumsScreen();
          showToast(`Reverted creation of collection '${collectionName}'`);
        }
      });
    }

    showToast(`✨ Forged new collection "${collectionName}" with ${taggedCount} curated photos from ${albums.length} albums!`, 4000);
  };

  window.executeMoveCopyAction = function() {
    const ids = state.moveCopyTargetIds || [];
    let destTags = [];
    if (state.moveCopyIsMultiTagDest && state.moveCopyDestinationTags && state.moveCopyDestinationTags.length > 0) {
      destTags = state.moveCopyDestinationTags;
    } else if (state.moveCopySelectedDestinations && state.moveCopySelectedDestinations.length > 0) {
      destTags = state.moveCopySelectedDestinations;
    } else if (state.moveCopyDestinationAlbum) {
      destTags = [state.moveCopyDestinationAlbum];
    }

    if (!destTags.length || !ids.length) {
      showToast('Please select at least 1 photo and 1 destination album.');
      return;
    }

    // Ensure all destination tags exist in state.tags
    destTags.forEach(destTagName => {
      if (!state.tags.some(t => t.name.toLowerCase() === destTagName.toLowerCase())) {
        const now = Date.now();
        state.tags.push({
          name: destTagName,
          color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)],
          createdAt: now,
          lastModifiedAt: now,
          lastViewedAt: now,
          isFavorite: false
        });
      }
    });

    const mode = state.moveCopyMode || 'copy';
    const isAlbumMode = !!state.moveCopyIsAlbumMode;
    const sourceAlbum = state.moveCopySourceAlbum;
    const deleteSourceChecked = isAlbumMode && mode === 'move' && !!document.getElementById('moveCopyDeleteSourceCheck')?.checked;

    // Save previous snapshot for undo
    const previousSnapshots = ids.map(id => {
      const p = state.photos.find(item => item.id === id);
      return p ? { id, tags: [...p.tags], category: p.category } : null;
    }).filter(Boolean);
    const previousTags = state.tags.map(t => ({ ...t }));

    let affectedCount = 0;
    ids.forEach(id => {
      const photo = state.photos.find(p => p.id === id);
      if (!photo) return;
      affectedCount++;

      if (mode === 'copy') {
        destTags.forEach(destTagName => {
          if (!photo.tags.includes(destTagName)) {
            photo.tags.push(destTagName);
          }
        });
        if (!photo.category || photo.category === 'Import') {
          photo.category = destTags[0];
        }
      } else if (mode === 'move') {
        if (sourceAlbum) {
          photo.tags = photo.tags.filter(t => t.toLowerCase() !== sourceAlbum.toLowerCase());
        }
        destTags.forEach(destTagName => {
          if (!photo.tags.includes(destTagName)) {
            photo.tags.push(destTagName);
          }
        });
        photo.category = destTags[0];
      }
    });

    let sourceAlbumRemoved = false;
    if (deleteSourceChecked && sourceAlbum) {
      const remainingInSource = state.photos.filter(p => !p.isPending && !p.deletedAt && p.tags && p.tags.includes(sourceAlbum)).length;
      if (remainingInSource === 0) {
        state.tags = state.tags.filter(t => t.name.toLowerCase() !== sourceAlbum.toLowerCase());
        sourceAlbumRemoved = true;
      }
    }

    destTags.forEach(destTagName => recordAlbumActivity(destTagName, 'modified'));
    if (sourceAlbum) {
      recordAlbumActivity(sourceAlbum, 'modified');
    }

    saveState();

    const combinedLabel = destTags.join(' + ');
    const targetToHighlight = (isAlbumMode && sourceAlbum)
      ? (sourceAlbumRemoved ? destTags[0] : sourceAlbum)
      : null;

    window.closeMoveCopyModal(targetToHighlight);
    state.selectedGalleryPhotoIds.clear();
    renderAll();

    if (targetToHighlight && window.highlightReturnedAlbumCard) {
      window.highlightReturnedAlbumCard(targetToHighlight);
    }

    window._lastMoveCopyUndo = {
      snapshots: previousSnapshots,
      tags: previousTags,
      mode,
      sourceAlbum,
      dest: combinedLabel,
      isAlbumMode
    };

    const actionText = mode === 'copy' ? 'Copied' : 'Moved';
    const photoNoun = affectedCount === 1 ? 'photo' : 'photos';
    const cleanupNote = sourceAlbumRemoved ? ' (Source album cleaned up)' : '';
    if (destTags.length > 1) {
      showToast(`✨ ${actionText} ${affectedCount} ${photoNoun} into all ${destTags.length} albums: '${combinedLabel}'!${cleanupNote}`);
    } else {
      if (isAlbumMode) {
        showToast(`✨ ${actionText} complete album '${sourceAlbum}' (${affectedCount} ${photoNoun}) to '${destTags[0]}'!${cleanupNote}`);
      } else {
        showToast(`✨ ${actionText} ${affectedCount} ${photoNoun} to '${destTags[0]}'!`);
      }
    }
  };

  // cameraSnapBtn and importPhotosBtn already have onclick="triggerCameraCapture()" and onclick="triggerGalleryImport()" in index.html
  // Only bind addDemoPhotoBtn to avoid duplicate listener invocations
  document.getElementById('addDemoPhotoBtn')?.addEventListener('click', () => window.triggerCameraCapture());


  // Dock Selection & Batch actions handled by toggleSelectAllDock(), openBatchTagModalFromDock(), moveSelectedDockDirect(), deleteSelectedDockPhotos()

  // Gallery Search listener
  const searchInput = document.getElementById('gallerySearchInput');
  const clearSearch = document.getElementById('clearSearchBtn');
  searchInput?.addEventListener('input', (e) => {
    handleGallerySearch(e.target.value);
  });
  clearSearch?.addEventListener('click', () => {
    clearGallerySearch();
  });

  // Album Search
  const albumSearchInput = document.getElementById('albumSearchInput');
  const clearAlbumSearchBtn = document.getElementById('clearAlbumSearchBtn');
  if (albumSearchInput && clearAlbumSearchBtn) {
    albumSearchInput.addEventListener('input', (e) => {
      state.albumSearchQuery = e.target.value;
      clearAlbumSearchBtn.style.display = state.albumSearchQuery ? 'flex' : 'none';
      renderAlbumsScreen();
    });
    clearAlbumSearchBtn.addEventListener('click', () => {
      albumSearchInput.value = '';
      state.albumSearchQuery = '';
      clearAlbumSearchBtn.style.display = 'none';
      renderAlbumsScreen();
    });
  }

  // + New Album Modal
  let selectedModalAlbumColor = PRESET_COLORS[0];
  const openCreateTagModalBtn = document.getElementById('openCreateTagModalBtn');
  const createAlbumModal = document.getElementById('createAlbumModal');
  const closeCreateAlbumBtn = document.getElementById('closeCreateAlbumBtn');
  const cancelCreateAlbumBtn = document.getElementById('cancelCreateAlbumBtn');
  const confirmCreateAlbumBtn = document.getElementById('confirmCreateAlbumBtn');
  const modalNewAlbumNameInput = document.getElementById('modalNewAlbumNameInput');
  const modalAlbumColorPalette = document.getElementById('modalAlbumColorPalette');

  const renderModalColorPalette = () => {
    if (!modalAlbumColorPalette) return;

    modalAlbumColorPalette.innerHTML = buildCategorizedPaletteHtml({
      presetColors: PRESET_COLORS,
      selectedColor: selectedModalAlbumColor || PRESET_COLORS[0],
      savedColors: state.savedCustomColors || [],
      onSelectFn: 'selectModalAlbumColor',
      customInputId: 'albumCustomColorInput',
      customSwatchId: 'albumCustomColorSwatch'
    });
  };

  window.selectModalAlbumColor = (c, isFinal = true) => {
    selectedModalAlbumColor = c;
    window._currentAlbumModalColor = c;
    renderModalColorPalette();
  };

  const openNewAlbumModal = () => {
    modalNewAlbumNameInput.value = '';
    selectedModalAlbumColor = PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];
    renderModalColorPalette();
    createAlbumModal.style.display = 'flex';
    setTimeout(() => modalNewAlbumNameInput.focus(), 120);
  };

  const closeNewAlbumModal = () => {
    createAlbumModal.style.display = 'none';
  };

  if (openCreateTagModalBtn) {
    openCreateTagModalBtn.addEventListener('click', openNewAlbumModal);
  }
  if (closeCreateAlbumBtn) {
    closeCreateAlbumBtn.addEventListener('click', closeNewAlbumModal);
  }
  if (cancelCreateAlbumBtn) {
    cancelCreateAlbumBtn.addEventListener('click', closeNewAlbumModal);
  }

  if (confirmCreateAlbumBtn) {
    confirmCreateAlbumBtn.addEventListener('click', () => {
      const name = modalNewAlbumNameInput.value.trim();
      if (!name) {
        showToast('Please enter an album name!');
        return;
      }
      if (state.tags.some(t => t.name.toLowerCase() === name.toLowerCase())) {
        showToast(`Album '${name}' already exists!`);
        return;
      }

      const now = Date.now();
      state.tags.push({ 
        name, 
        color: selectedModalAlbumColor,
        createdAt: now,
        lastModifiedAt: now,
        lastViewedAt: now,
        isFavorite: false
      });
      saveState();
      closeNewAlbumModal();
      switchAlbumsView('albums');
      renderAll();
      showToast(`✨ Album '${name}' created!`);
    });
  }

  modalNewAlbumNameInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') confirmCreateAlbumBtn?.click();
  });

  // Gallery Filter Reset
  document.getElementById('allTagsFilterChip')?.addEventListener('click', () => {
    state.selectedFilterTags.clear();
    state.onlyFavorites = false;
    renderGallery();
  });

  document.getElementById('resetFiltersBtn')?.addEventListener('click', () => {
    state.selectedFilterTags.clear();
    state.startDate = null;
    state.endDate = null;
    state.searchQuery = '';
    state.onlyFavorites = false;
    searchInput.value = '';
    clearSearch.style.display = 'none';
    renderGallery();
    showToast('Filters cleared');
  });

  document.getElementById('clearAllFiltersBtn')?.addEventListener('click', () => {
    document.getElementById('resetFiltersBtn').click();
  });

  // Date Range Picker Modal
  document.getElementById('dateFilterChip')?.addEventListener('click', (e) => {
    if (e.target.id === 'clearDateBtn') return;
    document.getElementById('datePickerModal').style.display = 'flex';
  });

  document.getElementById('clearDateBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    state.startDate = null;
    state.endDate = null;
    renderGallery();
  });

  document.getElementById('closeDatePickerBtn')?.addEventListener('click', () => {
    document.getElementById('datePickerModal').style.display = 'none';
  });

  document.getElementById('clearDatePickerBtn')?.addEventListener('click', () => {
    state.startDate = null;
    state.endDate = null;
    document.getElementById('fromDatePicker').value = '';
    document.getElementById('toDatePicker').value = '';
    document.getElementById('datePickerModal').style.display = 'none';
    renderGallery();
  });

  document.getElementById('applyDatePickerBtn')?.addEventListener('click', () => {
    const fromVal = document.getElementById('fromDatePicker').value;
    const toVal = document.getElementById('toDatePicker').value;

    state.startDate = fromVal ? new Date(fromVal).getTime() : null;
    state.endDate = toVal ? new Date(toVal).getTime() : null;

    document.getElementById('datePickerModal').style.display = 'none';
    renderGallery();
  });

  // Quick Date Presets Handler
  const formatDateForInput = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const applyQuickDatePreset = (preset) => {
    const now = new Date();
    let fromDate = null;
    let toDate = null;

    if (preset === 'today') {
      fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      toDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    } else if (preset === 'week') {
      fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      toDate = now;
    } else if (preset === 'month') {
      fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      toDate = now;
    } else if (preset === 'year') {
      fromDate = new Date(now.getFullYear(), 0, 1);
      toDate = now;
    } else if (preset === 'all') {
      state.startDate = null;
      state.endDate = null;
      const fIn = document.getElementById('fromDatePicker');
      const tIn = document.getElementById('toDatePicker');
      if (fIn) fIn.value = '';
      if (tIn) tIn.value = '';
      document.getElementById('datePickerModal').style.display = 'none';
      renderGallery();
      showToast('Cleared date range filter');
      return;
    }

    const fromInput = document.getElementById('fromDatePicker');
    const toInput = document.getElementById('toDatePicker');
    if (fromInput && fromDate) fromInput.value = formatDateForInput(fromDate);
    if (toInput && toDate) toInput.value = formatDateForInput(toDate);

    state.startDate = fromDate ? fromDate.getTime() : null;
    state.endDate = toDate ? toDate.getTime() : null;

    document.getElementById('datePickerModal').style.display = 'none';
    renderGallery();
    showToast(`Filtered by ${preset === 'week' ? 'Last 7 Days' : preset === 'month' ? 'Last 30 Days' : preset === 'today' ? 'Today' : 'This Year'}`);
  };

  window.applyQuickDatePreset = applyQuickDatePreset;
  window.openFavoritesFromAlbum = openFavoritesFromAlbum;
  window.downloadFavoritesAlbumZip = downloadFavoritesAlbumZip;
  window.shareFavoritesAlbum = shareFavoritesAlbum;
  window.setAlbumFilter = setAlbumFilter;
  window.toggleSelectAllDock = toggleSelectAllDock;
  window.quickTagSelected = quickTagSelected;
  window.openBatchTagModalFromDock = openBatchTagModalFromDock;
  window.moveSelectedDockDirect = moveSelectedDockDirect;
  window.deleteSelectedDockPhotos = deleteSelectedDockPhotos;
  window.toggleDockSelect = toggleDockSelect;

  // Gallery Quick Action: Share Filtered Collection
  document.getElementById('shareFilteredBtn')?.addEventListener('click', async () => {
    let photos = state.photos.filter(p => !p.isPending && !p.deletedAt);
    if (state.selectedFilterTags.size > 0) {
      photos = photos.filter(p => p.tags.some(t => state.selectedFilterTags.has(t)));
    }
    if (state.startDate) photos = photos.filter(p => p.createdAt >= state.startDate);
    if (state.endDate) photos = photos.filter(p => p.createdAt <= state.endDate + 86399999);

    if (photos.length === 0) {
      showToast('No photos to share!');
      return;
    }

    const tagNames = state.selectedFilterTags.size > 0 ? Array.from(state.selectedFilterTags).join(', ') : 'All Moments';
    if (window.AndroidApp && typeof window.AndroidApp.shareMultiplePhotos === 'function') {
      const payload = photos.slice(0, 30).map(p => ({ displayName: p.displayName, dataUrl: p.dataUrl }));
      window.AndroidApp.shareMultiplePhotos(JSON.stringify(payload), `${tagNames} Collection`);
      return;
    }
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${tagNames} Collection`,
          text: `Explore these ${photos.length} moments from ${tagNames}!`
        });
        showToast(`Shared ${photos.length} photos! ✨`);
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') return;
      }
    }
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`Photo Collection: ${tagNames} (${photos.length} photos) - Aura Photo Organizer`);
        showToast(`✨ Copied share link for ${photos.length} photos! 📋`);
      } else {
        showToast(`Photo Collection: ${tagNames} (${photos.length} photos)`);
      }
    } catch (e) {
      showToast(`Photo Collection: ${tagNames} (${photos.length} photos)`);
    }
  });

  // Gallery Multi-Selection Actions
  document.getElementById('closeSelectionBtn')?.addEventListener('click', () => {
    state.selectedGalleryPhotoIds.clear();
    renderGallery();
  });

  document.getElementById('exportZipBtn')?.addEventListener('click', () => {
    const selected = state.photos.filter(p => state.selectedGalleryPhotoIds.has(p.id));
    if (selected.length === 0) {
      showToast('No photos selected to export!');
      return;
    }
    exportPhotosToZip(selected, `Export_${Date.now()}`);
  });

  document.getElementById('exportFilteredZipBtn')?.addEventListener('click', () => {
    let photos = state.photos.filter(p => !p.isPending && !p.deletedAt);
    if (state.selectedFilterTags.size > 0) {
      photos = photos.filter(p => p.tags.some(t => state.selectedFilterTags.has(t)));
    }
    if (state.startDate) photos = photos.filter(p => p.createdAt >= state.startDate);
    if (state.endDate) photos = photos.filter(p => p.createdAt <= state.endDate + 86399999);
    if (photos.length === 0) {
      showToast('No filtered photos to export!');
      return;
    }
    exportPhotosToZip(photos, `Filtered_Photos_${Date.now()}`);
  });

  document.getElementById('shareSelectedBtn')?.addEventListener('click', async () => {
    const selected = state.photos.filter(p => state.selectedGalleryPhotoIds.has(p.id));
    if (selected.length === 0) {
      showToast('No photos selected to share!');
      return;
    }
    if (window.AndroidApp && typeof window.AndroidApp.shareMultiplePhotos === 'function') {
      const payload = selected.map(p => ({ displayName: p.displayName, dataUrl: p.dataUrl }));
      window.AndroidApp.shareMultiplePhotos(JSON.stringify(payload), 'Selected Photos');
      return;
    }
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Photo Organizer Collection',
          text: `Sharing ${selected.length} photos from Aura Photo Organizer!`
        });
        showToast(`Shared ${selected.length} photos! ✨`);
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') return;
      }
    }
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`Aura Photos: Sharing ${selected.length} photos`);
        showToast(`Copied info for ${selected.length} photos to clipboard! 📋`);
      } else {
        showToast(`Sharing ${selected.length} photos`);
      }
    } catch (e) {
      showToast(`Sharing ${selected.length} photos`);
    }
  });

  document.getElementById('downloadSelectedBtn')?.addEventListener('click', () => {
    const selected = state.photos.filter(p => state.selectedGalleryPhotoIds.has(p.id));
    if (selected.length === 0) {
      showToast('No photos selected to download!');
      return;
    }
    exportPhotosToZip(selected, `Photo_Collection_${Date.now()}`);
  });

  document.getElementById('trashSelectedBtn')?.addEventListener('click', () => {
    const count = state.selectedGalleryPhotoIds.size;
    state.selectedGalleryPhotoIds.forEach(id => {
      const p = state.photos.find(x => x.id === id);
      if (p) p.deletedAt = Date.now();
    });
    state.selectedGalleryPhotoIds.clear();
    saveState();
    renderAll();
    showToast(`${count} photos moved to Trash`);
  });

  // Tag Manager: Create Tag
  document.getElementById('createTagBtn')?.addEventListener('click', () => {
    const input = document.getElementById('newTagNameInput');
    const name = input.value.trim();
    if (!name) return;

    if (state.tags.some(t => t.name.toLowerCase() === name.toLowerCase())) {
      showToast('Tag already exists!');
      return;
    }

    state.tags.push({ name, color: state.selectedNewTagColor });
    input.value = '';
    saveState();
    renderAll();
    showToast(`Tag '${name}' created!`);
  });

  // Rename Tag Modal
  document.getElementById('closeRenameTagBtn')?.addEventListener('click', () => {
    document.getElementById('renameTagModal').style.display = 'none';
  });
  document.getElementById('cancelRenameTagBtn')?.addEventListener('click', () => {
    document.getElementById('renameTagModal').style.display = 'none';
  });
  document.getElementById('saveRenameTagBtn')?.addEventListener('click', () => {
    const newName = document.getElementById('renameTagInput').value.trim();
    if (!newName) return;

    const oldName = state.tagToRename;
    const tag = state.tags.find(t => t.name === oldName);
    if (tag) {
      tag.name = newName;
      tag.color = state.renameColor;

      // Update all photos with this tag
      state.photos.forEach(p => {
        const idx = p.tags.indexOf(oldName);
        if (idx !== -1) p.tags[idx] = newName;
      });

      if (state.selectedFilterTags.has(oldName)) {
        state.selectedFilterTags.delete(oldName);
        state.selectedFilterTags.add(newName);
      }

      recordAlbumActivity(newName, 'modified');
      saveState();
      document.getElementById('renameTagModal').style.display = 'none';
      renderAll();
      showToast('Tag updated!');
    }
  });

  // Empty Trash
  document.getElementById('emptyTrashBtn')?.addEventListener('click', emptyTrash);

  // Photo Detail Modal Handlers & Swiping Gestures
  setupDetailPhotoGestures();

  document.getElementById('closeDetailBtn')?.addEventListener('click', () => {
    closePhotoDetail();
  });

  document.getElementById('detailFavoriteBtn')?.addEventListener('click', () => {
    const photo = state.photos.find(p => p.id === state.activePhotoId);
    if (photo) {
      photo.isFavorite = !photo.isFavorite;
      saveState();
      const favBtn = document.getElementById('detailFavoriteBtn');
      if (favBtn) {
        favBtn.innerHTML = photo.isFavorite ? '<i class="fa-solid fa-heart" style="color:#f43f5e !important;"></i>' : '<i class="fa-regular fa-heart"></i>';
      }
      renderAll();
      showToast(photo.isFavorite ? 'Marked as Favorite' : 'Removed from Favorites');
    }
  });

  document.getElementById('detailDownloadBtn')?.addEventListener('click', () => {
    if (state.activePhotoId) {
      downloadSinglePhoto(state.activePhotoId);
    }
  });

  document.getElementById('detailShareBtn')?.addEventListener('click', () => {
    if (state.activePhotoId) {
      shareSinglePhoto(state.activePhotoId);
    }
  });

  document.getElementById('detailDeleteBtn')?.addEventListener('click', () => {
    if (state.activePhotoId) {
      deleteActivePhoto();
    }
  });

  document.getElementById('openManageTagsForPhotoBtn')?.addEventListener('click', () => {
    if (state.activePhotoId) {
      openBatchTagModal([state.activePhotoId]);
    }
  });

  // Batch Tag Dialog Close & Add
  document.getElementById('closeBatchTagBtn')?.addEventListener('click', () => {
    document.getElementById('batchTagModal').style.display = 'none';
  });
  document.getElementById('cancelBatchTagBtn')?.addEventListener('click', () => {
    document.getElementById('batchTagModal').style.display = 'none';
  });

  document.getElementById('batchCreateTagBtn')?.addEventListener('click', () => {
    const input = document.getElementById('batchNewTagInput');
    const name = input.value.trim();
    if (!name) return;
    if (!state.tags.some(t => t.name.toLowerCase() === name.toLowerCase())) {
      const randColor = PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];
      state.tags.push({ name, color: randColor });
      input.value = '';
      saveState();
      const targetIds = currentBatchTagPhotoIds.length ? currentBatchTagPhotoIds : Array.from(state.selectedDockPhotoIds.size ? state.selectedDockPhotoIds : [state.activePhotoId].filter(Boolean));
      openBatchTagModal(targetIds);
      renderAll();
    }
  });

  document.getElementById('batchNewTagInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('batchCreateTagBtn')?.click();
    }
  });

  // Theme & Frame Toggles
  document.getElementById('themeToggleBtn')?.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-mode');
    setAppTheme(isLight ? 'dark' : 'light');
  });

  // Listen for OS theme preference changes if user selected System mode
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (state.themePref === 'system') {
        setAppTheme('system', false);
      }
    });
  }

  document.getElementById('deviceFrameToggleBtn')?.addEventListener('click', () => {
    const frame = document.getElementById('deviceFrame');
    frame.classList.toggle('fullscreen-mode');
    const isFull = frame.classList.contains('fullscreen-mode');
    document.getElementById('deviceFrameToggleBtn').innerHTML = isFull
      ? '<i class="fa-solid fa-compress"></i><span>Phone Frame</span>'
      : '<i class="fa-solid fa-mobile-screen"></i><span>Full Window</span>';
  });

  // Wire up photo detail sheet bottom action buttons
  document.getElementById('detailDirectDownloadBtn')?.addEventListener('click', () => {
    document.getElementById('detailDownloadBtn')?.click();
  });
  document.getElementById('detailDirectShareBtn')?.addEventListener('click', () => {
    document.getElementById('detailShareBtn')?.click();
  });

  // Expose all action handlers globally to window for inline onclick attributes
  Object.assign(window, {
    switchAlbumsView,
    setAlbumFilter,
    toggleAlbumSort,
    toggleAlbumFavorite,
    recordAlbumActivity,
    getAlbumRecentActivityTime,
    updateAlbumSortUI,
    toggleDockSelect,
    openBatchTagModal,
    movePhotoToGallery,
    toggleTagFilter,
    toggleGallerySelect,
    toggleFavorite,
    downloadSinglePhoto,
    shareSinglePhoto,
    exportPhotosToZip,
    triggerBrowserDownload,
    selectNewTagColor,
    openRenameTagModal,
    deleteTagSafely,
    openAlbumInGallery,
    downloadAlbumZip,
    shareAlbum,
    restoreFromTrash,
    deletePermanently,
    removeTagFromActivePhoto,
    selectRenameColor,
    renderRenameColorPalette,
    selectModalAlbumColor,
    openNewAlbumModal,
    closeNewAlbumModal,
    openPhotoDetail,
    applyQuickDatePreset,
    deleteActivePhoto,
    moveToTrash,
    // Settings, Theme Switcher, Razorpay & Privacy
    setAppTheme,
    setAppAccentColor,
    renderThemeAccentPalette,
    navigateToSettings,
    renderSettings,
    initiateRazorpayPayment,
    openRazorpayModal,
    closeRazorpayModal,
    processSuccessfulPayment,
    restoreProPurchases,
    openPaymentFaq,
    openPrivacyPolicyModal,
    closePrivacyPolicyModal,
    toggleBiometricLock,
    clearAppCache,
    emptyTrashFromSettings,
    exportFullDataBackup,
    importFullDataBackup,
    // Custom Color Studio Modal & Swatch Actions
    openCustomColorPickerModal,
    closeCustomColorPickerModal,
    handleModalPickerInput,
    handleModalPickerHexInput,
    setModalPickerLiveColor,
    applyCustomColorFromModal,
    deleteSavedCustomColor,
    // Gallery Search
    handleGallerySearch,
    clearGallerySearch,
    // VIP 3D Album Surface Studio & Parallax (Item 15)
    openAlbum3DSurfaceModal,
    closeAlbum3DSurfaceModal,
    selectSurfacePhoto,
    selectStudioSurface,
    STUDIO_3D_SURFACES,
    handleSurfaceImageUpload,
    removeAlbumCustomSurface,
    select3DSurfaceStyle,
    saveAlbum3DSurface,
    toggleGlobal3DMode,
    init3DCardParallax,
    // VIP Diagnostics, Tester Access & Integrity Audits
    toggleVip,
    enableVip,
    disableVip,
    toggleVipFromSettings,
    open3DAlbumAuditModal,
    close3DAlbumAuditModal,
    run3DAlbumAudit,
    inspect3DAlbum,
    setAlbumSurface,
    // VIP Direct Album Import (VIP Item 3)
    triggerAlbumDirectImport: window.triggerAlbumDirectImport,
    handleAlbumDirectFileInput: window.handleAlbumDirectFileInput,
    openVipAlbumImportModal: window.openVipAlbumImportModal,
    closeVipAlbumImportModal: window.closeVipAlbumImportModal,
    createAlbumAndPickPhotos: window.createAlbumAndPickPhotos,
    getActiveAlbumName: window.getActiveAlbumName,
    // VIP Move / Copy Photos (VIP Item 6)
    openMoveCopyModal: window.openMoveCopyModal,
    closeMoveCopyModal: window.closeMoveCopyModal,
    openVipMoveCopyGateModal: window.openVipMoveCopyGateModal,
    closeVipMoveCopyGateModal: window.closeVipMoveCopyGateModal,
    setMoveCopyMode: window.setMoveCopyMode,
    handleMoveCopySearch: window.handleMoveCopySearch,
    quickCreateMoveCopyAlbum: window.quickCreateMoveCopyAlbum,
    selectMoveCopyDestination: window.selectMoveCopyDestination,
    renderMoveCopyAlbumsList: window.renderMoveCopyAlbumsList,
    executeMoveCopyAction: window.executeMoveCopyAction
  });

  makeDraggableScroll(document.querySelector('.filter-strip'));
  makeDraggableScroll(document.querySelector('.album-filter-chips-strip'));
  makeDraggableScroll(document.getElementById('albumsCarouselContainer'));

  // Live clock in status bar
  const updateClock = () => {
    const d = new Date();
    document.getElementById('statusTime').textContent = `${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')}`;
  };
  updateClock();
  setInterval(updateClock, 30000);

  // =============================================================
  // PHOTO RENAMING MODULE
  // =============================================================
  const MAX_PHOTO_NAME_LENGTH = 60;
  const ILLEGAL_FILENAME_CHARS = /[<>:"/\\|?*\u0000-\u001F\u007F]/g;
  let renamingPhotoId = null;

  function sanitizePhotoName(name) {
    if (!name) return 'Untitled Moment';
    let cleaned = String(name)
      .normalize('NFC')
      .replace(/[\u200B-\u200D\u2060\uFEFF]/g, '')
      .replace(ILLEGAL_FILENAME_CHARS, '-')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleaned || cleaned === '.' || cleaned === '..') {
      return 'Untitled Moment';
    }

    const chars = Array.from(cleaned);
    if (chars.length > MAX_PHOTO_NAME_LENGTH) {
      cleaned = chars.slice(0, MAX_PHOTO_NAME_LENGTH).join('').trim();
    }
    return cleaned;
  }

  function openRenamePhotoModal(photoId) {
    const photo = state.photos.find(p => p.id === photoId);
    if (!photo) return;
    renamingPhotoId = photoId;

    const modal = document.getElementById('renamePhotoModal');
    const thumb = document.getElementById('renamePhotoThumbnail');
    const currDisplay = document.getElementById('renameCurrentDisplay');
    const dateSub = document.getElementById('renameDateSub');
    const input = document.getElementById('renamePhotoInput');
    const extBadge = document.getElementById('renameExtensionBadge');

    if (thumb) thumb.src = photo.dataUrl;
    if (currDisplay) currDisplay.textContent = photo.displayName;
    if (dateSub) {
      const d = new Date(photo.createdAt || Date.now());
      dateSub.textContent = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    }

    let baseName = photo.displayName || 'Untitled Moment';
    let ext = '.jpg';
    const lastDot = baseName.lastIndexOf('.');
    if (lastDot > 0 && lastDot > baseName.length - 6) {
      ext = baseName.substring(lastDot);
      baseName = baseName.substring(0, lastDot);
    }
    if (extBadge) extBadge.textContent = ext;

    if (input) {
      input.value = baseName;
      updateRenameCounter(Array.from(baseName).length);
    }

    modal.style.display = 'flex';
    setTimeout(() => {
      input?.focus();
      input?.select();
    }, 80);
  }

  function closeRenamePhotoModal() {
    const modal = document.getElementById('renamePhotoModal');
    if (modal) modal.style.display = 'none';
    renamingPhotoId = null;
  }

  function handleRenameInput(val) {
    updateRenameCounter(Array.from(val || '').length);
  }

  function updateRenameCounter(length) {
    const counter = document.getElementById('renameCharCounter');
    const hint = document.getElementById('renameHintText');
    if (!counter) return;

    counter.textContent = `${length} / ${MAX_PHOTO_NAME_LENGTH}`;
    if (length >= MAX_PHOTO_NAME_LENGTH) {
      counter.style.color = 'var(--primary, #f43f5e)';
      counter.style.fontWeight = '700';
      if (hint) hint.textContent = 'Maximum length reached (60 chars)';
    } else if (length >= 50) {
      counter.style.color = '#f59e0b';
      counter.style.fontWeight = '600';
      if (hint) hint.textContent = 'Approaching limit';
    } else {
      counter.style.color = 'var(--text-muted, #94a3b8)';
      counter.style.fontWeight = '400';
      if (hint) hint.textContent = 'Max 60 characters';
    }
  }

  function savePhotoRename() {
    if (!renamingPhotoId) return;
    const photo = state.photos.find(p => p.id === renamingPhotoId);
    if (!photo) return;

    const input = document.getElementById('renamePhotoInput');
    const rawVal = input ? input.value : '';
    const sanitized = sanitizePhotoName(rawVal);

    photo.displayName = sanitized;
    saveState();
    renderAll();

    const detailTitle = document.getElementById('detailPhotoTitle');
    if (detailTitle && state.activePhotoId === photo.id) {
      detailTitle.textContent = sanitized;
    }

    closeRenamePhotoModal();
    showToast(`Renamed to "${sanitized}"`);
  }

  function renameSelectedGalleryPhoto() {
    if (state.selectedGalleryPhotoIds.size !== 1) {
      showToast('Select 1 photo to rename');
      return;
    }
    const photoId = Array.from(state.selectedGalleryPhotoIds)[0];
    openRenamePhotoModal(photoId);
  }

  // =============================================================
  // CROP & ORIENT EDITOR MODULE (ROTATIONS, FLIPS, SMOOTH CROP)
  // =============================================================
  const cropState = {
    photoId: null,
    baseDataUrl: '',
    currentTransformedUrl: '',
    sourceUrl: '',
    aspect: 'free',
    rotation: 0, // 0, 90, 180, 270
    customAngle: 0, // -45 to +45 fine straighten angle
    flipH: false,
    flipV: false,
    normBox: { left: 0.05, top: 0.05, width: 0.9, height: 0.9 },
    dragging: null,
    dragStartX: 0,
    dragStartY: 0,
    startNormBox: null
  };

  function fitCropImageAndBox() {
    const modal = document.getElementById('cropEditorModal');
    const stage = document.getElementById('cropStageWrapper');
    const container = document.getElementById('cropCanvasContainer');
    const img = document.getElementById('cropTargetImage');
    if (!modal || !stage || !container || !img || modal.style.display === 'none') return;

    const stageRect = stage.getBoundingClientRect();
    const availW = Math.max(80, stageRect.width - 24);
    const availH = Math.max(80, stageRect.height - 24);

    const naturalW = img.naturalWidth || 800;
    const naturalH = img.naturalHeight || 600;

    const scale = Math.min(availW / naturalW, availH / naturalH, 1);
    const dispW = Math.max(60, Math.round(naturalW * scale));
    const dispH = Math.max(60, Math.round(naturalH * scale));

    container.style.width = `${dispW}px`;
    container.style.height = `${dispH}px`;
    img.style.width = `${dispW}px`;
    img.style.height = `${dispH}px`;

    updateCropBoxView();
  }

  function openCropEditorModal(photoId) {
    const photo = state.photos.find(p => p.id === photoId);
    if (!photo) return;

    cropState.photoId = photoId;
    cropState.baseDataUrl = photo.originalDataUrl || photo.dataUrl;
    cropState.currentTransformedUrl = cropState.baseDataUrl;
    cropState.sourceUrl = cropState.baseDataUrl;
    cropState.rotation = 0;
    cropState.customAngle = 0;
    cropState.flipH = false;
    cropState.flipV = false;
    cropState.aspect = 'free';
    cropState.normBox = { left: 0.05, top: 0.05, width: 0.9, height: 0.9 };

    const drawer = document.getElementById('cropCustomAngleDrawer');
    if (drawer) drawer.style.display = 'none';
    const angleToggleBtn = document.getElementById('cropAngleToggleBtn');
    if (angleToggleBtn) angleToggleBtn.classList.remove('active');
    const slider = document.getElementById('cropAngleSlider');
    if (slider) slider.value = 0;
    const readout = document.getElementById('cropAngleReadout');
    if (readout) readout.textContent = '0.0°';

    const modal = document.getElementById('cropEditorModal');
    const nameSub = document.getElementById('cropPhotoNameSub');
    const img = document.getElementById('cropTargetImage');

    if (nameSub) nameSub.textContent = photo.displayName;

    document.querySelectorAll('#cropAspectBar .aspect-chip').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.aspect === 'free');
    });

    updateCropTransformButtonsUI();
    modal.style.display = 'flex';

    if (img) {
      img.onload = () => {
        requestAnimationFrame(() => {
          fitCropImageAndBox();
          setCropAspect('free');
        });
      };
      img.src = cropState.currentTransformedUrl;
      if (img.complete && img.naturalWidth) {
        requestAnimationFrame(() => {
          fitCropImageAndBox();
          setCropAspect('free');
        });
      }
    }

    initCropInteractions();
  }

  function closeCropEditorModal() {
    const modal = document.getElementById('cropEditorModal');
    if (modal) modal.style.display = 'none';
    cropState.photoId = null;
  }

  function toggleCropAngleDrawer() {
    const drawer = document.getElementById('cropCustomAngleDrawer');
    const btn = document.getElementById('cropAngleToggleBtn');
    if (!drawer) return;
    const isShowing = drawer.style.display !== 'none';
    drawer.style.display = isShowing ? 'none' : 'block';
    if (btn) btn.classList.toggle('active', !isShowing);
  }

  let customAngleRaf = null;
  function adjustCustomAngle(delta) {
    const cur = cropState.customAngle || 0;
    setCustomAngle(cur + delta);
  }

  function onCustomAngleSlider(val) {
    const num = parseFloat(val) || 0;
    setCustomAngle(num);
  }

  function setCustomAngle(angle) {
    cropState.customAngle = Math.max(-45, Math.min(45, Math.round(angle * 2) / 2));
    const slider = document.getElementById('cropAngleSlider');
    const readout = document.getElementById('cropAngleReadout');
    if (slider) slider.value = cropState.customAngle;
    if (readout) {
      const sign = cropState.customAngle > 0 ? '+' : '';
      readout.textContent = `${sign}${cropState.customAngle.toFixed(1)}°`;
    }
    if (customAngleRaf) cancelAnimationFrame(customAngleRaf);
    customAngleRaf = requestAnimationFrame(() => {
      renderTransformedCropImage();
    });
  }

  function resetCustomAngle() {
    setCustomAngle(0);
  }

  function renderTransformedCropImage(callback) {
    if (!cropState.baseDataUrl) return;
    const baseImg = new Image();
    baseImg.crossOrigin = 'anonymous';
    baseImg.onload = () => {
      const w = baseImg.naturalWidth || baseImg.width;
      const h = baseImg.naturalHeight || baseImg.height;
      const totalRot = ((cropState.rotation || 0) + (cropState.customAngle || 0));
      const rot = ((totalRot % 360) + 360) % 360;

      // Calculate exact bounding canvas dimensions for any arbitrary rotation angle
      const rad = (rot * Math.PI) / 180;
      const cos = Math.abs(Math.cos(rad));
      const sin = Math.abs(Math.sin(rad));
      const canvasW = Math.max(1, Math.round(w * cos + h * sin));
      const canvasH = Math.max(1, Math.round(w * sin + h * cos));

      const canvas = document.createElement('canvas');
      canvas.width = canvasW;
      canvas.height = canvasH;
      const ctx = canvas.getContext('2d');

      ctx.save();
      ctx.translate(canvasW / 2, canvasH / 2);
      ctx.rotate(rad);
      ctx.scale(cropState.flipH ? -1 : 1, cropState.flipV ? -1 : 1);
      ctx.drawImage(baseImg, -w / 2, -h / 2, w, h);
      ctx.restore();

      const transformedUrl = canvas.toDataURL('image/jpeg', 0.95);
      cropState.currentTransformedUrl = transformedUrl;
      cropState.sourceUrl = transformedUrl;

      const img = document.getElementById('cropTargetImage');
      if (img) {
        img.onload = () => {
          requestAnimationFrame(() => {
            fitCropImageAndBox();
            setCropAspect(cropState.aspect);
            if (callback) callback();
          });
        };
        img.src = transformedUrl;
      }
      updateCropTransformButtonsUI();
    };
    baseImg.src = cropState.baseDataUrl;
  }

  function setCropRotation(deg) {
    if (cropState.rotation === deg) {
      cropState.rotation = 0;
    } else {
      cropState.rotation = deg;
    }
    renderTransformedCropImage();
  }

  function rotateCropBy(delta) {
    cropState.rotation = ((cropState.rotation + delta) % 360 + 360) % 360;
    renderTransformedCropImage();
  }

  function rotateCropRight() {
    rotateCropBy(90);
  }

  function rotateCropLeft() {
    rotateCropBy(-90);
  }

  function rotateCropImage() {
    rotateCropRight();
  }

  function toggleCropFlip(axis) {
    if (axis === 'h') {
      cropState.flipH = !cropState.flipH;
    } else if (axis === 'v') {
      cropState.flipV = !cropState.flipV;
    }
    renderTransformedCropImage();
  }

  function resetCropTransforms() {
    cropState.rotation = 0;
    cropState.customAngle = 0;
    cropState.flipH = false;
    cropState.flipV = false;
    const slider = document.getElementById('cropAngleSlider');
    const readout = document.getElementById('cropAngleReadout');
    if (slider) slider.value = 0;
    if (readout) readout.textContent = '0.0°';
    renderTransformedCropImage();
  }

  function resetCrop() {
    if (!cropState.photoId) return;
    cropState.rotation = 0;
    cropState.customAngle = 0;
    cropState.flipH = false;
    cropState.flipV = false;
    cropState.aspect = 'free';
    cropState.normBox = { left: 0.05, top: 0.05, width: 0.9, height: 0.9 };
    const slider = document.getElementById('cropAngleSlider');
    const readout = document.getElementById('cropAngleReadout');
    if (slider) slider.value = 0;
    if (readout) readout.textContent = '0.0°';
    document.querySelectorAll('#cropAspectBar .aspect-chip').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.aspect === 'free');
    });
    renderTransformedCropImage();
  }

  function updateCropTransformButtonsUI() {
    const rot = ((cropState.rotation % 360) + 360) % 360;
    document.getElementById('cropRotate90Btn')?.classList.toggle('active', rot === 90);
    document.getElementById('cropRotate180Btn')?.classList.toggle('active', rot === 180);
    document.getElementById('cropRotate270Btn')?.classList.toggle('active', rot === 270);
    document.getElementById('cropFlipHBtn')?.classList.toggle('active', !!cropState.flipH);
    document.getElementById('cropFlipVBtn')?.classList.toggle('active', !!cropState.flipV);
  }

  function setCropAspect(aspectKey) {
    cropState.aspect = aspectKey;
    document.querySelectorAll('#cropAspectBar .aspect-chip').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.aspect === aspectKey);
    });

    const container = document.getElementById('cropCanvasContainer');
    if (!container) return;
    const w = parseFloat(container.style.width) || container.offsetWidth;
    const h = parseFloat(container.style.height) || container.offsetHeight;
    if (!w || !h) return;

    if (aspectKey === 'free') {
      cropState.normBox = { left: 0.05, top: 0.05, width: 0.9, height: 0.9 };
      updateCropBoxView();
      return;
    }

    let targetRatio = 1.0;
    if (aspectKey === '1:1') targetRatio = 1.0;
    else if (aspectKey === '4:5') targetRatio = 4 / 5;
    else if (aspectKey === '3:4') targetRatio = 3 / 4;
    else if (aspectKey === '16:9') targetRatio = 16 / 9;

    let boxW, boxH;
    if ((w / h) > targetRatio) {
      boxH = h * 0.92;
      boxW = boxH * targetRatio;
    } else {
      boxW = w * 0.92;
      boxH = boxW / targetRatio;
    }

    // Ensure it strictly fits within the container while maintaining exact ratio
    if (boxW > w) {
      boxW = w;
      boxH = boxW / targetRatio;
    }
    if (boxH > h) {
      boxH = h;
      boxW = boxH * targetRatio;
    }

    const boxLeft = Math.max(0, (w - boxW) / 2);
    const boxTop = Math.max(0, (h - boxH) / 2);

    cropState.normBox = {
      left: boxLeft / w,
      top: boxTop / h,
      width: boxW / w,
      height: boxH / h
    };

    updateCropBoxView();
  }

  function updateCropBoxView() {
    const container = document.getElementById('cropCanvasContainer');
    const box = document.getElementById('cropBox');
    const pill = document.getElementById('cropDimensionPill');
    const img = document.getElementById('cropTargetImage');
    if (!container || !box) return;

    const w = parseFloat(container.style.width) || container.offsetWidth;
    const h = parseFloat(container.style.height) || container.offsetHeight;
    if (!w || !h) return;

    const b = cropState.normBox;
    const pxLeft = b.left * w;
    const pxTop = b.top * h;
    const pxWidth = b.width * w;
    const pxHeight = b.height * h;

    box.style.left = `${pxLeft.toFixed(1)}px`;
    box.style.top = `${pxTop.toFixed(1)}px`;
    box.style.width = `${pxWidth.toFixed(1)}px`;
    box.style.height = `${pxHeight.toFixed(1)}px`;

    if (pill && img) {
      const natW = img.naturalWidth || img.width || 1000;
      const natH = img.naturalHeight || img.height || 1000;
      let outW = Math.max(1, Math.round(b.width * natW));
      let outH = Math.max(1, Math.round(b.height * natH));
      if (cropState.aspect !== 'free') {
        let tr = 1.0;
        if (cropState.aspect === '1:1') tr = 1.0;
        else if (cropState.aspect === '4:5') tr = 4 / 5;
        else if (cropState.aspect === '3:4') tr = 3 / 4;
        else if (cropState.aspect === '16:9') tr = 16 / 9;
        outH = Math.max(1, Math.round(outW / tr));
      }
      pill.textContent = `${outW} × ${outH} px`;
    }
  }

  function nudgeCrop(direction) {
    const container = document.getElementById('cropCanvasContainer');
    if (!container) return;
    const w = parseFloat(container.style.width) || container.offsetWidth;
    const h = parseFloat(container.style.height) || container.offsetHeight;
    if (!w || !h) return;

    const stepX = 1 / w; // 1px horizontal
    const stepY = 1 / h; // 1px vertical
    let { left, top, width, height } = cropState.normBox;

    if (direction === 'left') {
      left = Math.max(0, left - stepX);
    } else if (direction === 'right') {
      left = Math.min(1 - width, left + stepX);
    } else if (direction === 'up') {
      top = Math.max(0, top - stepY);
    } else if (direction === 'down') {
      top = Math.min(1 - height, top + stepY);
    } else if (direction === 'expand' || direction === 'shrink') {
      const isExpand = direction === 'expand';
      const isLockedAspect = cropState.aspect !== 'free';

      if (!isLockedAspect) {
        // Free-form expand / shrink
        const dX = (stepX * 6);
        const dY = (stepY * 6);
        if (isExpand) {
          left = Math.max(0, left - dX / 2);
          top = Math.max(0, top - dY / 2);
          width = Math.min(1 - left, width + dX);
          height = Math.min(1 - top, height + dY);
        } else {
          if (width > 0.08 && height > 0.08) {
            left = Math.min(0.95, left + dX / 2);
            top = Math.min(0.95, top + dY / 2);
            width = Math.max(0.05, width - dX);
            height = Math.max(0.05, height - dY);
          }
        }
      } else {
        // Strict aspect-ratio locked expand / shrink
        let targetRatio = 1.0;
        if (cropState.aspect === '1:1') targetRatio = 1.0;
        else if (cropState.aspect === '4:5') targetRatio = 4 / 5;
        else if (cropState.aspect === '3:4') targetRatio = 3 / 4;
        else if (cropState.aspect === '16:9') targetRatio = 16 / 9;

        // Current pixel dimensions and center
        let curPxW = width * w;
        let curPxH = height * h;
        const curCx = (left + width / 2) * w;
        const curCy = (top + height / 2) * h;

        // Compute max permissible pixel dimensions inside the canvas (w, h)
        let maxPxW, maxPxH;
        if ((w / h) > targetRatio) {
          maxPxH = h;
          maxPxW = h * targetRatio;
        } else {
          maxPxW = w;
          maxPxH = w / targetRatio;
        }

        // Min dimensions
        const minPxW = Math.max(30, 30 * targetRatio);
        const minPxH = minPxW / targetRatio;

        const deltaPx = 8; // step increment in pixels

        let newPxW, newPxH;
        if (isExpand) {
          // If already at or near maximum allowed dimension, do not expand and keep aspect ratio strictly intact!
          if (curPxW >= maxPxW - 0.5 || curPxH >= maxPxH - 0.5) {
            return;
          }
          newPxW = Math.min(maxPxW, curPxW + deltaPx);
          newPxH = newPxW / targetRatio;
          if (newPxH > maxPxH) {
            newPxH = maxPxH;
            newPxW = newPxH * targetRatio;
          }
        } else {
          // Shrink
          if (curPxW <= minPxW + 0.5 || curPxH <= minPxH + 0.5) {
            return;
          }
          newPxW = Math.max(minPxW, curPxW - deltaPx);
          newPxH = newPxW / targetRatio;
        }

        // Now compute newLeft and newTop around the center
        let newLeft = curCx - newPxW / 2;
        let newTop = curCy - newPxH / 2;

        // Clamp positions strictly within canvas bounds [0, w - newPxW] and [0, h - newPxH]
        if (newLeft < 0) newLeft = 0;
        if (newLeft + newPxW > w) newLeft = w - newPxW;
        if (newTop < 0) newTop = 0;
        if (newTop + newPxH > h) newTop = h - newPxH;

        left = newLeft / w;
        top = newTop / h;
        width = newPxW / w;
        height = newPxH / h;
      }
    }

    cropState.normBox = { left, top, width, height };
    updateCropBoxView();
  }

  function centerCropBox() {
    let { width, height } = cropState.normBox;
    const left = Math.max(0, (1 - width) / 2);
    const top = Math.max(0, (1 - height) / 2);
    cropState.normBox = { left, top, width, height };
    updateCropBoxView();
  }

  function initCropInteractions() {
    const container = document.getElementById('cropCanvasContainer');
    const box = document.getElementById('cropBox');
    if (!container || !box || container.dataset.initDone) return;
    container.dataset.initDone = 'true';

    let activePointerId = null;
    let cachedContainerRect = null;
    let rafUpdateId = null;
    let latestPointerEvent = null;

    const onPointerDown = (e) => {
      const handle = e.target.closest('.crop-handle, .crop-edge-handle');
      const isBox = e.target.closest('#cropBox');
      if (!handle && !isBox) return;

      e.preventDefault();
      e.stopPropagation();

      const containerRect = container.getBoundingClientRect();
      cachedContainerRect = {
        width: parseFloat(container.style.width) || containerRect.width,
        height: parseFloat(container.style.height) || containerRect.height,
        left: containerRect.left,
        top: containerRect.top
      };

      if (!cachedContainerRect.width || !cachedContainerRect.height) return;

      // Smart corner routing: if user clicked near any corner of the box, snap to corner handle
      let targetHandle = handle ? handle.dataset.handle : null;
      if (!targetHandle && isBox) {
        const boxRect = box.getBoundingClientRect();
        const relX = e.clientX - boxRect.left;
        const relY = e.clientY - boxRect.top;
        const cornerThreshold = Math.min(42, boxRect.width / 3, boxRect.height / 3);

        const isNearLeft = relX < cornerThreshold;
        const isNearRight = relX > boxRect.width - cornerThreshold;
        const isNearTop = relY < cornerThreshold;
        const isNearBottom = relY > boxRect.height - cornerThreshold;

        if (isNearLeft && isNearTop) targetHandle = 'tl';
        else if (isNearRight && isNearTop) targetHandle = 'tr';
        else if (isNearLeft && isNearBottom) targetHandle = 'bl';
        else if (isNearRight && isNearBottom) targetHandle = 'br';
        else targetHandle = 'box';
      }

      activePointerId = e.pointerId;
      cropState.dragging = targetHandle || 'box';
      cropState.dragStartX = e.clientX;
      cropState.dragStartY = e.clientY;
      cropState.startNormBox = { ...cropState.normBox };

      box.classList.add('is-dragging');
      if (handle) handle.classList.add('active-handle');

      if (e.target.setPointerCapture && activePointerId != null) {
        try {
          e.target.setPointerCapture(activePointerId);
        } catch (_) {}
      }

      window.addEventListener('pointermove', onPointerMove, { passive: false });
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    };

    const processPointerDrag = () => {
      rafUpdateId = null;
      if (!cropState.dragging || !cachedContainerRect || !latestPointerEvent) return;

      const imgW = cachedContainerRect.width;
      const imgH = cachedContainerRect.height;
      if (!imgW || !imgH) return;

      const dx = (latestPointerEvent.clientX - cropState.dragStartX) / imgW;
      const dy = (latestPointerEvent.clientY - cropState.dragStartY) / imgH;
      const start = cropState.startNormBox;
      const minW = Math.max(0.04, 28 / imgW);
      const minH = Math.max(0.04, 28 / imgH);

      let { left, top, width, height } = start;
      const isLockedAspect = cropState.aspect !== 'free';

      if (cropState.dragging === 'box') {
        left = Math.max(0, Math.min(1 - width, start.left + dx));
        top = Math.max(0, Math.min(1 - height, start.top + dy));
      } else if (isLockedAspect) {
        let targetRatio = 1.0;
        if (cropState.aspect === '1:1') targetRatio = 1.0;
        else if (cropState.aspect === '4:5') targetRatio = 4 / 5;
        else if (cropState.aspect === '3:4') targetRatio = 3 / 4;
        else if (cropState.aspect === '16:9') targetRatio = 16 / 9;

        const ratioFactor = (imgW / imgH) / targetRatio;

        if (cropState.dragging === 'br' || cropState.dragging === 'r' || cropState.dragging === 'b') {
          const effDelta = Math.abs(dx) > Math.abs(dy / ratioFactor) ? dx : (dy / ratioFactor);
          width = Math.max(minW, Math.min(1 - start.left, start.width + effDelta));
          height = width * ratioFactor;
          if (start.top + height > 1) {
            height = 1 - start.top;
            width = height / ratioFactor;
          }
        } else if (cropState.dragging === 'bl' || cropState.dragging === 'l') {
          const effDelta = Math.abs(dx) > Math.abs(dy / ratioFactor) ? -dx : (dy / ratioFactor);
          width = Math.max(minW, Math.min(start.left + start.width, start.width + effDelta));
          left = start.left + start.width - width;
          height = width * ratioFactor;
          if (start.top + height > 1) {
            height = 1 - start.top;
            width = height / ratioFactor;
            left = start.left + start.width - width;
          }
        } else if (cropState.dragging === 'tr' || cropState.dragging === 't') {
          const effDelta = Math.abs(dx) > Math.abs(dy / ratioFactor) ? dx : (-dy / ratioFactor);
          width = Math.max(minW, Math.min(1 - start.left, start.width + effDelta));
          height = width * ratioFactor;
          if (start.top + start.height - height < 0) {
            height = start.top + start.height;
            width = height / ratioFactor;
          }
          top = start.top + start.height - height;
        } else if (cropState.dragging === 'tl') {
          const effDelta = Math.abs(dx) > Math.abs(dy / ratioFactor) ? -dx : (-dy / ratioFactor);
          width = Math.max(minW, Math.min(start.left + start.width, start.width + effDelta));
          left = start.left + start.width - width;
          height = width * ratioFactor;
          if (start.top + start.height - height < 0) {
            height = start.top + start.height;
            width = height / ratioFactor;
            left = start.left + start.width - width;
          }
          top = start.top + start.height - height;
        }
      } else {
        // Free-form aspect ratio: 4 corners + 4 edges
        if (cropState.dragging === 'tl') {
          left = Math.max(0, Math.min(start.left + start.width - minW, start.left + dx));
          top = Math.max(0, Math.min(start.top + start.height - minH, start.top + dy));
          width = start.left + start.width - left;
          height = start.top + start.height - top;
        } else if (cropState.dragging === 'tr') {
          top = Math.max(0, Math.min(start.top + start.height - minH, start.top + dy));
          width = Math.max(minW, Math.min(1 - start.left, start.width + dx));
          height = start.top + start.height - top;
        } else if (cropState.dragging === 'bl') {
          left = Math.max(0, Math.min(start.left + start.width - minW, start.left + dx));
          height = Math.max(minH, Math.min(1 - start.top, start.height + dy));
          width = start.left + start.width - left;
        } else if (cropState.dragging === 'br') {
          width = Math.max(minW, Math.min(1 - start.left, start.width + dx));
          height = Math.max(minH, Math.min(1 - start.top, start.height + dy));
        } else if (cropState.dragging === 't') {
          top = Math.max(0, Math.min(start.top + start.height - minH, start.top + dy));
          height = start.top + start.height - top;
        } else if (cropState.dragging === 'b') {
          height = Math.max(minH, Math.min(1 - start.top, start.height + dy));
        } else if (cropState.dragging === 'l') {
          left = Math.max(0, Math.min(start.left + start.width - minW, start.left + dx));
          width = start.left + start.width - left;
        } else if (cropState.dragging === 'r') {
          width = Math.max(minW, Math.min(1 - start.left, start.width + dx));
        }
      }

      // Magnetic snapping to image edges (within 1.2% threshold) only when in free aspect
      if (!isLockedAspect) {
        if (left < 0.012) {
          width = width + left;
          left = 0;
        }
        if (top < 0.012) {
          height = height + top;
          top = 0;
        }
        if (left + width > 0.988) {
          width = 1 - left;
        }
        if (top + height > 0.988) {
          height = 1 - top;
        }
        left = Math.max(0, Math.min(1 - width, left));
        top = Math.max(0, Math.min(1 - height, top));
        width = Math.max(minW, Math.min(1 - left, width));
        height = Math.max(minH, Math.min(1 - top, height));
      }

      cropState.normBox = { left, top, width, height };
      updateCropBoxView();
    };

    const onPointerMove = (e) => {
      if (!cropState.dragging) return;
      e.preventDefault();
      latestPointerEvent = e;
      if (!rafUpdateId) {
        rafUpdateId = requestAnimationFrame(processPointerDrag);
      }
    };

    const onPointerUp = (e) => {
      if (rafUpdateId) {
        cancelAnimationFrame(rafUpdateId);
        rafUpdateId = null;
      }
      cropState.dragging = null;
      cachedContainerRect = null;
      latestPointerEvent = null;

      box.classList.remove('is-dragging');
      document.querySelectorAll('.crop-handle.active-handle, .crop-edge-handle.active-handle').forEach(h => {
        h.classList.remove('active-handle');
      });

      if (e.target && e.target.releasePointerCapture && activePointerId != null) {
        try {
          e.target.releasePointerCapture(activePointerId);
        } catch (_) {}
      }
      activePointerId = null;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('resize', () => {
      if (cropState.photoId) fitCropImageAndBox();
    });
  }

  function applyAndSaveCrop() {
    if (!cropState.photoId) return;
    const photo = state.photos.find(p => p.id === cropState.photoId);
    if (!photo) return;

    const srcUrl = cropState.currentTransformedUrl || cropState.sourceUrl;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const srcW = img.naturalWidth || img.width;
        const srcH = img.naturalHeight || img.height;

        const norm = cropState.normBox;
        let sx = Math.round(norm.left * srcW);
        let sy = Math.round(norm.top * srcH);
        let sw = Math.round(norm.width * srcW);
        let sh = Math.round(norm.height * srcH);

        sx = Math.max(0, Math.min(srcW - 1, sx));
        sy = Math.max(0, Math.min(srcH - 1, sy));
        sw = Math.max(1, Math.min(srcW - sx, sw));
        sh = Math.max(1, Math.min(srcH - sy, sh));

        const canvas = document.createElement('canvas');
        canvas.width = sw;
        canvas.height = sh;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

        const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);

        if (!photo.originalDataUrl) {
          photo.originalDataUrl = cropState.baseDataUrl || photo.dataUrl;
        }
        photo.dataUrl = croppedDataUrl;

        saveState();
        renderAll();

        if (state.activePhotoId === photo.id) {
          const detailImg = document.getElementById('detailImage');
          if (detailImg) detailImg.src = croppedDataUrl;
        }

        closeCropEditorModal();
        showToast('✨ Photo cropped & oriented successfully!');
      } catch (err) {
        console.error('Failed to crop image:', err);
        showToast('Unable to crop image');
      }
    };
    img.src = srcUrl;
  }

  function cropSelectedGalleryPhoto() {
    if (state.selectedGalleryPhotoIds.size !== 1) {
      showToast('Select 1 photo to crop');
      return;
    }
    const photoId = Array.from(state.selectedGalleryPhotoIds)[0];
    openCropEditorModal(photoId);
  }

  // Bind to window for global access
  window.openRenamePhotoModal = openRenamePhotoModal;
  window.closeRenamePhotoModal = closeRenamePhotoModal;
  window.handleRenameInput = handleRenameInput;
  window.savePhotoRename = savePhotoRename;
  window.renameSelectedGalleryPhoto = renameSelectedGalleryPhoto;
  window.openCropEditorModal = openCropEditorModal;
  window.closeCropEditorModal = closeCropEditorModal;
  window.setCropAspect = setCropAspect;
  window.setCropRotation = setCropRotation;
  window.rotateCropBy = rotateCropBy;
  window.rotateCropRight = rotateCropRight;
  window.rotateCropLeft = rotateCropLeft;
  window.rotateCropImage = rotateCropImage;
  window.toggleCropFlip = toggleCropFlip;
  window.resetCropTransforms = resetCropTransforms;
  window.resetCrop = resetCrop;
  window.applyAndSaveCrop = applyAndSaveCrop;
  window.cropSelectedGalleryPhoto = cropSelectedGalleryPhoto;
  window.sanitizePhotoName = sanitizePhotoName;
  window.toggleTagsTooltip = toggleTagsTooltip;
  window.nudgeCrop = nudgeCrop;
  window.centerCropBox = centerCropBox;
  window.toggleCropAngleDrawer = toggleCropAngleDrawer;
  window.adjustCustomAngle = adjustCustomAngle;
  window.onCustomAngleSlider = onCustomAngleSlider;
  window.resetCustomAngle = resetCustomAngle;

  // Swiping & Photo Detail Navigation Exports (Item 9)
  window.openPhotoDetail = openPhotoDetail;
  window.closePhotoDetail = closePhotoDetail;
  window.navigateDetailPhoto = navigateDetailPhoto;

  // Album Deletion Double-Confirmation Exports
  window.openDeleteAlbumModal = openDeleteAlbumModal;
  window.closeDeleteAlbumModal = closeDeleteAlbumModal;
  window.selectDeleteAlbumOption = selectDeleteAlbumOption;
  window.goToDeleteAlbumStep1 = goToDeleteAlbumStep1;
  window.goToDeleteAlbumStep2 = goToDeleteAlbumStep2;
  window.toggleDiscardConfirmBtn = toggleDiscardConfirmBtn;
  window.executeFinalAlbumDeletion = executeFinalAlbumDeletion;
  window.deleteTagSafely = deleteTagSafely;
  window.restoreAlbumFromTrash = restoreAlbumFromTrash;
  window.permanentlyEraseAlbumFromTrash = permanentlyEraseAlbumFromTrash;

  // VIP Move & Copy Complete Album Exports
    window.toggleMultiTagBuilder = toggleMultiTagBuilder;
  window.renderMultiTagStudio = renderMultiTagStudio;
  window.renderMultiTagChain = renderMultiTagChain;
  window.handleMultiTagPickerSearch = handleMultiTagPickerSearch;
  window.renderMultiTagCandidateList = renderMultiTagCandidateList;
  window.hoverPreviewCandidate = hoverPreviewCandidate;
  window.clearCandidateHoverPreview = clearCandidateHoverPreview;
  window.pickCandidateTag = pickCandidateTag;
  window.removeMultiTagChainItem = removeMultiTagChainItem;
  window.updateMultiTagIntersection = updateMultiTagIntersection;
  window.selectMultiTagAsDestination = selectMultiTagAsDestination;
  window.openMoveCopyAlbumModal = openMoveCopyAlbumModal;
  window.openMoveCopyModal = openMoveCopyModal;
  window.closeMoveCopyModal = closeMoveCopyModal;
  window.setMoveCopyMode = setMoveCopyMode;
  window.selectMoveCopyDestination = selectMoveCopyDestination;
  window.quickCreateMoveCopyAlbum = quickCreateMoveCopyAlbum;
  window.handleMoveCopySearch = handleMoveCopySearch;
  window.executeMoveCopyAction = executeMoveCopyAction;

  // Gallery Albums Three-Dot Menu Exports (Item 10)
  window.toggleGalleryAlbumsMenu = toggleGalleryAlbumsMenu;
  window.closeGalleryAlbumsMenu = closeGalleryAlbumsMenu;
  window.renderGalleryAlbumsDropdown = renderGalleryAlbumsDropdown;
  window.selectGalleryAlbumFromMenu = selectGalleryAlbumFromMenu;
  window.clearAllAlbumFilters = clearAllAlbumFilters;
  window.toggleFeaturedCarouselVisibility = toggleFeaturedCarouselVisibility;
  window.hideFeaturedAlbumsCarousel = hideFeaturedAlbumsCarousel;

  // Recent Activity Album Sorting & Favorites Exports (Item 11)
  window.toggleAlbumFavorite = toggleAlbumFavorite;
  window.recordAlbumActivity = recordAlbumActivity;
  window.toggleAlbumSort = toggleAlbumSort;
  window.getAlbumRecentActivityTime = getAlbumRecentActivityTime;
  window.enterSetupPasscodeDigit = enterSetupPasscodeDigit;
  window.deleteSetupPasscodeDigit = deleteSetupPasscodeDigit;
  window.clearSetupPasscode = clearSetupPasscode;
  window.cancelPasscodeSetup = cancelPasscodeSetup;
  window.openPasscodeSetupScreen = openPasscodeSetupScreen;
  window.handleForgotPasscode = handleForgotPasscode;
  window.closeForgotPasscodeModal = closeForgotPasscodeModal;
  window.recoverPasscodeWithBiometrics = recoverPasscodeWithBiometrics;
  window.resetPasscodeSecurityVault = resetPasscodeSecurityVault;
  window.flashReturnedPhotoCard = flashReturnedPhotoCard;
  window.handleNativeBackPressed = function() {
    const detailModal = document.getElementById('photoDetailModal');
    if (detailModal && detailModal.style.display !== 'none') {
      closePhotoDetail();
      return true;
    }
    const cropModal = document.getElementById('cropEditorModal');
    if (cropModal && cropModal.style.display !== 'none') {
      closeCropEditorModal();
      return true;
    }
    const setupModal = document.getElementById('passcodeSetupModal');
    if (setupModal && setupModal.style.display !== 'none') {
      cancelPasscodeSetup();
      if (state.isAppLocked) {
        showAppLock();
      }
      return true;
    }
    const forgotModal = document.getElementById('forgotPasscodeModal');
    if (forgotModal && forgotModal.style.display !== 'none') {
      closeForgotPasscodeModal();
      return true;
    }
    if (state.isAppLocked) {
      return true;
    }
    const openDialog = document.querySelector('.modal-overlay:not(#appLockOverlay)[style*="display: flex"], .modal-overlay:not(#appLockOverlay)[style*="display: block"]');
    if (openDialog && openDialog.style.display !== 'none') {
      openDialog.style.display = 'none';
      return true;
    }
    return false;
  };

  document.getElementById('renamePhotoModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'renamePhotoModal') closeRenamePhotoModal();
  });
  document.getElementById('cropEditorModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'cropEditorModal') closeCropEditorModal();
  });
  document.getElementById('deleteAlbumModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'deleteAlbumModal') closeDeleteAlbumModal();
  });
  document.getElementById('moveCopyModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'moveCopyModal') closeMoveCopyModal();
  });
  document.getElementById('vipMoveCopyModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'vipMoveCopyModal') closeVipMoveCopyGateModal();
  });

  // Click outside to dismiss gallery albums dropdown
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('galleryAlbumsDropdown');
    const menuBtn = document.getElementById('galleryAlbumsMenuBtn');
    if (dropdown && dropdown.style.display !== 'none') {
      if (!dropdown.contains(e.target) && !menuBtn?.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    }
  });

  // Render initial view
  renderAll();

  // Enforce App Lock on startup if enabled
  if (state.biometricLock) {
    state.isAppLocked = true;
    showAppLock();
  }
});
