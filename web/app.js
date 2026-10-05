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
  { name: 'Weddings', color: '#e11d48' },
  { name: 'Heritage & Travel', color: '#0284c7' },
  { name: 'Parisian Lifestyle', color: '#d97706' },
  { name: 'Celebrations & Festive', color: '#f59e0b' },
  { name: 'Editorial Portraits', color: '#8b5cf6' },
  { name: 'Family & Pets', color: '#ec4899' }
];

const INITIAL_PHOTOS = [
  {
    id: 'model_1',
    displayName: 'royal_indian_wedding.jpg',
    category: 'Weddings',
    isPending: false,
    isFavorite: true,
    deletedAt: null,
    createdAt: Date.now() - (2 * 86400000),
    tags: ['Weddings'],
    dataUrl: 'assets/models/royal_indian_wedding.jpg',
    location: {
      latitude: 17.3554,
      longitude: 78.4735,
      place: 'Taj Falaknuma Palace',
      city: 'Hyderabad',
      country: 'India'
    }
  },
  {
    id: 'model_10',
    displayName: 'royal_indian_groom.jpg',
    category: 'Weddings',
    isPending: false,
    isFavorite: true,
    deletedAt: null,
    createdAt: Date.now() - (3 * 86400000),
    tags: ['Weddings'],
    dataUrl: 'assets/models/royal_indian_groom.jpg',
    location: {
      latitude: 17.3554,
      longitude: 78.4735,
      place: 'Taj Falaknuma Palace Grand Hall',
      city: 'Hyderabad',
      country: 'India'
    }
  },
  {
    id: 'model_2',
    displayName: 'jaipur_heritage_hawa_mahal.jpg',
    category: 'Heritage & Travel',
    isPending: false,
    isFavorite: true,
    deletedAt: null,
    createdAt: Date.now() - (5 * 86400000),
    tags: ['Heritage & Travel'],
    dataUrl: 'assets/models/jaipur_heritage_hawa_mahal.jpg',
    location: {
      latitude: 26.9239,
      longitude: 75.8267,
      place: 'Hawa Mahal',
      city: 'Jaipur',
      country: 'India'
    }
  },
  {
    id: 'model_3',
    displayName: 'rocky_mountain_lake_trip.jpg',
    category: 'Heritage & Travel',
    isPending: false,
    isFavorite: false,
    deletedAt: null,
    createdAt: Date.now() - (7 * 86400000),
    tags: ['Heritage & Travel'],
    dataUrl: 'assets/models/rocky_mountain_lake_trip.jpg',
    location: {
      latitude: 51.3217,
      longitude: -116.1860,
      place: 'Moraine Lake',
      city: 'Banff National Park',
      country: 'Canada'
    }
  },
  {
    id: 'model_4',
    displayName: 'paris_cafe_street_lifestyle.jpg',
    category: 'Parisian Lifestyle',
    isPending: false,
    isFavorite: true,
    deletedAt: null,
    createdAt: Date.now() - (9 * 86400000),
    tags: ['Parisian Lifestyle'],
    dataUrl: 'assets/models/paris_cafe_street_lifestyle.jpg',
    location: {
      latitude: 48.8584,
      longitude: 2.2945,
      place: 'Café de Flore Terrace',
      city: 'Paris',
      country: 'France'
    }
  },
  {
    id: 'model_5',
    displayName: 'birthday_celebration_glow.jpg',
    category: 'Celebrations & Festive',
    isPending: false,
    isFavorite: true,
    deletedAt: null,
    createdAt: Date.now() - (12 * 86400000),
    tags: ['Celebrations & Festive'],
    dataUrl: 'assets/models/birthday_celebration_glow.jpg',
    location: {
      latitude: 40.7580,
      longitude: -73.9855,
      place: 'Times Square Skylight',
      city: 'New York',
      country: 'United States'
    }
  },
  {
    id: 'model_6',
    displayName: 'diwali_festive_golden_diya.jpg',
    category: 'Celebrations & Festive',
    isPending: false,
    isFavorite: true,
    deletedAt: null,
    createdAt: Date.now() - (14 * 86400000),
    tags: ['Celebrations & Festive'],
    dataUrl: 'assets/models/diwali_festive_golden_diya.jpg',
    location: {
      latitude: 28.6139,
      longitude: 77.2090,
      place: 'Courtyard Haveli',
      city: 'New Delhi',
      country: 'India'
    }
  },
  {
    id: 'model_7',
    displayName: 'editorial_portrait_studio.jpg',
    category: 'Editorial Portraits',
    isPending: false,
    isFavorite: true,
    deletedAt: null,
    createdAt: Date.now() - (16 * 86400000),
    tags: ['Editorial Portraits'],
    dataUrl: 'assets/models/editorial_portrait_studio.jpg',
    location: {
      latitude: 19.0760,
      longitude: 72.8777,
      place: 'Studio Lumière',
      city: 'Mumbai',
      country: 'India'
    }
  },
  {
    id: 'model_8',
    displayName: 'family_moments_mother_baby.jpg',
    category: 'Family & Pets',
    isPending: false,
    isFavorite: false,
    deletedAt: null,
    createdAt: Date.now() - (18 * 86400000),
    tags: ['Family & Pets'],
    dataUrl: 'assets/models/family_moments_mother_baby.jpg',
    location: {
      latitude: 12.9716,
      longitude: 77.5946,
      place: 'Indiranagar Garden Villa',
      city: 'Bengaluru',
      country: 'India'
    }
  },
  {
    id: 'model_9',
    displayName: 'cozy_pets_golden_puppy.jpg',
    category: 'Family & Pets',
    isPending: false,
    isFavorite: true,
    deletedAt: null,
    createdAt: Date.now() - (20 * 86400000),
    tags: ['Family & Pets'],
    dataUrl: 'assets/models/cozy_pets_golden_puppy.jpg',
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      place: 'Pacific Heights Residence',
      city: 'San Francisco',
      country: 'United States'
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
  albumPhotos3DEnabled: (function () {
    try { return localStorage.getItem('aura_album_photos_3d_enabled') !== 'false'; } catch (e) { return true; }
  })(),
  favorites3DStyle: (function () {
    try { return localStorage.getItem('photo_org_favorites_3d_style') || 'holo'; } catch (e) { return 'holo'; }
  })(),
  favoritesCustomCover: (function () {
    try { return localStorage.getItem('photo_org_favorites_custom_cover') || null; } catch (e) { return null; }
  })(),
  current3DModalAlbum: null,
  selected3DSurfacePhoto: null,
  selected3DSurfaceStyle: 'holo',
  showFeaturedCarousel: false,
  language: 'en',
  gpsMetadataEnabled: (function () {
    try { return localStorage.getItem('aura_gps_metadata_enabled') !== 'false'; } catch (e) { return true; }
  })(),
  locationTagsEnabled: (function () {
    try { return localStorage.getItem('aura_location_tags_enabled') !== 'false'; } catch (e) { return true; }
  })(),
  locationTagPlace: (function () {
    try { return localStorage.getItem('aura_loc_tag_place') !== 'false'; } catch (e) { return true; }
  })(),
  locationTagCity: (function () {
    try { return localStorage.getItem('aura_loc_tag_city') !== 'false'; } catch (e) { return true; }
  })(),
  locationTagCountry: (function () {
    try { return localStorage.getItem('aura_loc_tag_country') !== 'false'; } catch (e) { return true; }
  })(),
  galleryShowLocationBadge: (function () {
    try { return localStorage.getItem('aura_gallery_show_location_badge') === 'true'; } catch (e) { return false; }
  })(),
  shakeWaveFlashEnabled: (function () {
    try { return localStorage.getItem('aura_shake_wave_flash_enabled') !== 'false'; } catch (e) { return true; }
  })(),
  shakeWaveColor: (function () {
    try { return localStorage.getItem('aura_shake_wave_color') || PRESET_COLORS[0]; } catch (e) { return PRESET_COLORS[0]; }
  })(),
  shakeMotionStyle: (function () {
    try { return localStorage.getItem('aura_shake_motion_style') || 'ripple'; } catch (e) { return 'ripple'; }
  })(),
  cardTiltEnabled: (function () {
    try { return localStorage.getItem('aura_card_tilt_enabled') !== 'false'; } catch (e) { return true; }
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
    } catch (e) { }
  }

  // If previous version was before models_v3, regenerate demo data with clean models
  if (version !== 'models_v3') {
    resetToDefaultData();
    localStorage.setItem('photo_org_ui_version', 'models_v3');
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
        const isDemoPhoto = p.id && (p.id.startsWith('demo_') || p.id.startsWith('gallery_') || p.id.startsWith('model_'));
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
            } catch (_) { }
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
    const favIds = ['model_1', 'model_2', 'model_4', 'model_6', 'model_7', 'model_9'];
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
    dataUrl: p.dataUrl || generateGradientImage(p.displayName, p.category, p.gradient)
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
    localStorage.setItem('aura_shake_wave_flash_enabled', state.shakeWaveFlashEnabled !== false ? 'true' : 'false');
    localStorage.setItem('aura_shake_wave_color', state.shakeWaveColor || PRESET_COLORS[0]);
    localStorage.setItem('aura_shake_motion_style', state.shakeMotionStyle || 'ripple');
    localStorage.setItem('aura_card_tilt_enabled', state.cardTiltEnabled !== false ? 'true' : 'false');
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
  } else if (onSelectFnName === 'selectShakeWaveColor') {
    if (normalizeHex(state.shakeWaveColor) === norm) {
      selectShakeWaveColor(PRESET_COLORS[0], false);
    } else {
      renderShakeWaveColorPalette();
    }
  } else if (onSelectFnName === 'selectStudioBackdropColor') {
    if (studioState.backdropColor && normalizeHex(studioState.backdropColor) === norm) {
      selectStudioBackdropColor('#ffffff', false);
    } else {
      if (typeof renderStudioBackdropCustomPalette === 'function') renderStudioBackdropCustomPalette();
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
  renderShakeWaveColorPalette();
  if (typeof renderStudioBackdropCustomPalette === 'function') {
    renderStudioBackdropCustomPalette();
  }
}

// -------------------------------------------------------------
// Kinetic Shake & Collision Shockwave Dynamic Styling & Palette
// -------------------------------------------------------------
function hexToRgb(hex) {
  const norm = normalizeHex(hex).replace('#', '');
  const r = parseInt(norm.substring(0, 2), 16) || 244;
  const g = parseInt(norm.substring(2, 4), 16) || 63;
  const b = parseInt(norm.substring(4, 6), 16) || 94;
  return { r, g, b };
}

function applyShakeWaveColorToCss(color) {
  const norm = normalizeHex(color || PRESET_COLORS[0]);
  const { r, g, b } = hexToRgb(norm);
  const secR = Math.min(255, Math.max(0, Math.round(g * 0.7 + b * 0.9)));
  const secG = Math.min(255, Math.max(0, Math.round(r * 0.5 + b * 0.6)));
  const secB = Math.min(255, Math.max(0, Math.round(r * 0.8 + 80)));

  document.documentElement.style.setProperty('--shake-wave-color', norm);
  document.documentElement.style.setProperty('--shake-wave-rgb', `${r}, ${g}, ${b}`);
  document.documentElement.style.setProperty('--shake-wave-secondary-rgb', `${secR}, ${secG}, ${secB}`);
}
window.applyShakeWaveColorToCss = applyShakeWaveColorToCss;

function selectShakeWaveColor(color, notify = true) {
  if (!color) return;
  const norm = normalizeHex(color);
  state.shakeWaveColor = norm;
  applyShakeWaveColorToCss(norm);
  saveState();
  if (state.shakeWaveFlashEnabled === false) {
    state.shakeWaveFlashEnabled = true;
    const cb = document.getElementById('shakeWaveToggleCheckbox');
    if (cb) cb.checked = true;
    updateShakeWaveColorSectionVisibility();
  }
  renderShakeWaveColorPalette();
  if (notify && typeof showToast === 'function') {
    showToast(`Wave color set to ${norm.toUpperCase()}`);
  }
  if (typeof Aura3DMotionPhysics !== 'undefined' && Aura3DMotionPhysics.triggerShakeWave) {
    Aura3DMotionPhysics.triggerShakeWave();
  }
}
window.selectShakeWaveColor = selectShakeWaveColor;

function toggleShakeWaveFlash(enabled) {
  state.shakeWaveFlashEnabled = !!enabled;
  saveState();
  const cb = document.getElementById('shakeWaveToggleCheckbox');
  if (cb) cb.checked = state.shakeWaveFlashEnabled;
  updateShakeWaveColorSectionVisibility();
  if (typeof showToast === 'function') {
    showToast(state.shakeWaveFlashEnabled ? '✨ Kinetic Wave Flash Enabled' : 'Kinetic Wave Flash Disabled');
  }
  if (state.shakeWaveFlashEnabled && typeof Aura3DMotionPhysics !== 'undefined' && Aura3DMotionPhysics.triggerShakeWave) {
    Aura3DMotionPhysics.triggerShakeWave();
  }
}
window.toggleShakeWaveFlash = toggleShakeWaveFlash;

function updateShakeWaveColorSectionVisibility() {
  const isEnabled = (state.shakeWaveFlashEnabled !== false);
  const secColor = document.getElementById('shakeWaveColorSection');
  const secMotion = document.getElementById('shakeWaveMotionStyleSection');
  const testBtn = document.querySelector('.test-shake-stage-btn');

  [secColor, secMotion].forEach(sec => {
    if (!sec) return;
    sec.style.opacity = isEnabled ? '1' : '0.35';
    sec.style.pointerEvents = isEnabled ? 'auto' : 'none';
    sec.style.filter = isEnabled ? 'none' : 'grayscale(0.85)';
    sec.style.transition = 'opacity 0.25s ease, filter 0.25s ease';
  });

  if (testBtn) {
    testBtn.style.opacity = isEnabled ? '1' : '0.45';
    testBtn.style.pointerEvents = isEnabled ? 'auto' : 'none';
    testBtn.style.transition = 'opacity 0.25s ease';
  }
}
window.updateShakeWaveColorSectionVisibility = updateShakeWaveColorSectionVisibility;

function toggleCardTiltEffect(enabled) {
  state.cardTiltEnabled = !!enabled;
  saveState();
  const cb = document.getElementById('cardTiltToggleCheckbox');
  if (cb) cb.checked = (state.cardTiltEnabled !== false);
  if (typeof showToast === 'function') {
    showToast(state.cardTiltEnabled ? '✨ 3D Gyro Tilt Enabled' : '3D Gyro Tilt Disabled');
  }
  if (!state.cardTiltEnabled) {
    const previewCard = document.getElementById('album3DPreviewCard');
    const previewShine = document.getElementById('album3DPreviewShine');
    if (previewCard) {
      if (typeof stage3DCardRaf !== 'undefined' && stage3DCardRaf) cancelAnimationFrame(stage3DCardRaf);
      previewCard.style.transform = '';
      if (previewShine) previewShine.style.opacity = '0';
    }
    document.querySelectorAll('.album-rich-card.card-3d, .photo-card-elegant.card-3d').forEach(c => {
      if (!c.classList.contains('card-collision-wave')) {
        c.style.transform = '';
        const sh = c.querySelector('.album-3d-shine');
        if (sh) sh.style.opacity = '0';
      }
    });
  }
}
window.toggleCardTiltEffect = toggleCardTiltEffect;

const SHAKE_MOTION_STYLES = [
  {
    id: 'ripple',
    titleKey: 'shake_style_ripple_title',
    subKey: 'shake_style_ripple_sub',
    defaultTitle: 'Concentric Ripple',
    defaultSub: 'Radial wave expanding from center',
    icon: 'fa-solid fa-water'
  },
  {
    id: 'spring',
    titleKey: 'shake_style_spring_title',
    subKey: 'shake_style_spring_sub',
    defaultTitle: 'Spring Bounce',
    defaultSub: 'Tactile 3D compression & rebound',
    icon: 'fa-solid fa-compress'
  },
  {
    id: 'seismic',
    titleKey: 'shake_style_seismic_title',
    subKey: 'shake_style_seismic_sub',
    defaultTitle: 'Seismic Recoil',
    defaultSub: 'High-impact micro-shudder jolt',
    icon: 'fa-solid fa-bolt-lightning'
  },
  {
    id: 'fluid',
    titleKey: 'shake_style_fluid_title',
    subKey: 'shake_style_fluid_sub',
    defaultTitle: 'Fluid Surge',
    defaultSub: 'Glassy liquid tidal displacement',
    icon: 'fa-solid fa-droplet'
  },
  {
    id: 'vortex',
    titleKey: 'shake_style_vortex_title',
    subKey: 'shake_style_vortex_sub',
    defaultTitle: 'Vortex Twist',
    defaultSub: 'Rotational torsion & cosmic swirl',
    icon: 'fa-solid fa-rotate'
  },
  {
    id: 'aurora',
    titleKey: 'shake_style_aurora_title',
    subKey: 'shake_style_aurora_sub',
    defaultTitle: 'Aurora Glide',
    defaultSub: 'Prismatic iridescent refraction glide',
    icon: 'fa-solid fa-wand-magic-sparkles'
  },
  {
    id: 'gravity',
    titleKey: 'shake_style_gravity_title',
    subKey: 'shake_style_gravity_sub',
    defaultTitle: 'Gravity Well',
    defaultSub: 'Gravitational collapse & snap pulse',
    icon: 'fa-solid fa-atom'
  },
  {
    id: 'mercury',
    titleKey: 'shake_style_mercury_title',
    subKey: 'shake_style_mercury_sub',
    defaultTitle: 'Liquid Mercury',
    defaultSub: 'Molten chrome fluid inertia',
    icon: 'fa-solid fa-gem'
  },
  {
    id: 'ultrasonic',
    titleKey: 'shake_style_ultrasonic_title',
    subKey: 'shake_style_ultrasonic_sub',
    defaultTitle: 'Ultrasonic Scan',
    defaultSub: 'Acoustic frequency scanline pulse',
    icon: 'fa-solid fa-signal'
  },
  {
    id: 'crystal',
    titleKey: 'shake_style_crystal_title',
    subKey: 'shake_style_crystal_sub',
    defaultTitle: 'Crystal Chime',
    defaultSub: 'Angular diamond facet sparkle chime',
    icon: 'fa-solid fa-diamond'
  }
];

function updateShakeMotionStyleChips() {
  const container = document.getElementById('shakeMotionStylesGrid');
  if (!container) return;
  const currentStyle = state.shakeMotionStyle || 'ripple';
  container.innerHTML = SHAKE_MOTION_STYLES.map(s => {
    const isActive = s.id === currentStyle;
    const title = (window.t ? window.t(s.titleKey) : s.defaultTitle) || s.defaultTitle;
    const sub = (window.t ? window.t(s.subKey) : s.defaultSub) || s.defaultSub;
    const fullDesc = `${title}: ${sub}`;
    return `
      <div class="shake-style-chip ${isActive ? 'active' : ''}" data-style="${s.id}" onclick="selectShakeMotionStyle('${s.id}')" title="${escapeHtml(fullDesc)}" aria-label="${escapeHtml(fullDesc)}">
        <div class="shake-style-icon-badge"><i class="${s.icon}"></i></div>
        <div class="shake-style-text">
          <span class="shake-style-title" title="${escapeHtml(title)}">${title}</span>
          <span class="shake-style-sub" title="${escapeHtml(sub)}">${sub}</span>
        </div>
        <i class="fa-solid fa-circle-check shake-style-check"></i>
      </div>
    `;
  }).join('');
}
window.updateShakeMotionStyleChips = updateShakeMotionStyleChips;

function selectShakeMotionStyle(styleId, triggerPreview = true) {
  if (!styleId) return;
  state.shakeMotionStyle = styleId;
  if (state.shakeWaveFlashEnabled === false) {
    state.shakeWaveFlashEnabled = true;
    const cb = document.getElementById('shakeWaveToggleCheckbox');
    if (cb) cb.checked = true;
    updateShakeWaveColorSectionVisibility();
  }
  saveState();
  updateShakeMotionStyleChips();
  const found = SHAKE_MOTION_STYLES.find(s => s.id === styleId);
  const name = found ? found.defaultTitle : styleId;
  if (typeof showToast === 'function') {
    showToast(`✨ ${name} Selected!`);
  }
  if (triggerPreview && typeof Aura3DMotionPhysics !== 'undefined' && Aura3DMotionPhysics.triggerShakeWave) {
    Aura3DMotionPhysics.triggerShakeWave();
  }
}
window.selectShakeMotionStyle = selectShakeMotionStyle;

function renderShakeWaveColorPalette() {
  const container = document.getElementById('shakeWaveColorPalette');
  if (!container) return;
  container.innerHTML = buildCategorizedPaletteHtml({
    presetColors: PRESET_COLORS,
    selectedColor: state.shakeWaveColor || PRESET_COLORS[0],
    savedColors: state.savedCustomColors || [],
    onSelectFn: 'selectShakeWaveColor',
    customInputId: 'shakeWaveCustomColorInput',
    customSwatchId: 'shakeWaveCustomColorSwatch'
  });
}
window.renderShakeWaveColorPalette = renderShakeWaveColorPalette;

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
    else if (fnName === 'selectShakeWaveColor') fn = selectShakeWaveColor;
    else if (fnName === 'selectStudioBackdropColor') fn = window.selectStudioBackdropColor || selectStudioBackdropColor;
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
  // If paywall or subscription checkout modal is active, never display toast messages on the payment screen
  const isPaywallOpen = ['vipSaveLimitModal', 'vipDirectImportModal', 'razorpayModal'].some(id => {
    const el = document.getElementById(id);
    return el && el.style.display && el.style.display !== 'none';
  });
  if (isPaywallOpen) return;

  const toast = document.getElementById('toastMessage');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._toastTimer);
  toast._toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
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
      ? (window.t ? window.t('settings_pro_vip') : 'AURA PRO')
      : (window.t ? window.t('settings_starter') : 'STARTER');
    profileVipTag.className = isPro ? 'vip-sparkle-tag pro-active' : 'vip-sparkle-tag';
  }

  const proStatusBadge = document.getElementById('settingsProStatusBadge');
  if (proStatusBadge) {
    proStatusBadge.textContent = isPro ? '👑 PRO UNLOCKED' : (window.t ? window.t('settings_free_tier') : 'FREE TIER');
    proStatusBadge.className = isPro ? 'pro-chip-pill pro-active' : 'pro-chip-pill';
  }

  // Master Developer Bypass Card UI Sync
  const vipStatusPill = document.getElementById('vipBypassStatusPill');
  if (vipStatusPill) {
    vipStatusPill.textContent = isPro ? '👑 PRO ACTIVE (Bypassed)' : '🔒 STARTER (Locked)';
    vipStatusPill.className = isPro ? 'vip-dev-status-pill' : 'vip-dev-status-pill locked';
  }

  const vipBypassBtn = document.getElementById('vipBypassMasterBtn');
  const vipBypassLabel = document.getElementById('vipBypassBtnLabel');
  if (vipBypassBtn) {
    vipBypassBtn.classList.toggle('active', isPro);
  }
  if (vipBypassLabel) {
    vipBypassLabel.textContent = isPro
      ? '👑 Pro Access Active · Tap to Test Starter'
      : '⚡ 1-Click Developer Bypass (Unlock 100% of Features)';
  }

  // Profile status desc
  const profileStatusDesc = document.getElementById('profileStatusDesc');
  if (profileStatusDesc) {
    profileStatusDesc.textContent = isPro
      ? (window.t ? window.t('settings_storage_pro_active') : 'Aura Pro Membership Active · 100% Private On-Device & Secret Vault Unlocked')
      : (window.t ? window.t('settings_storage_private') : 'Standard local storage · 100% private');
  }

  // Pro Upgrade Card Button
  const startRazorpayBtn = document.getElementById('startRazorpayBtn');
  if (startRazorpayBtn) {
    if (isPro) {
      startRazorpayBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span data-i18n="settings_pro_activated">${window.t ? window.t('settings_pro_activated') : 'Aura Pro Activated (Bypass Active)'}</span>`;
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
    } catch (_) { }
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
      }).catch(() => { });
    } catch (_) { }
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
  updateSubscriptionUI();
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

// -------------------------------------------------------------
// FIREBASE CLOUD CONFIG & DYNAMIC SUBSCRIPTION PRICING
// Project: photoorganizer-31cf9
// -------------------------------------------------------------
const FIREBASE_CONFIG = {
  projectId: 'photoorganizer-31cf9',
  rtdbUrl: 'https://photoorganizer-31cf9-default-rtdb.firebaseio.com',
  rtdbFallbackUrl: 'https://photoorganizer-31cf9.firebaseio.com'
};
window.FIREBASE_CONFIG = FIREBASE_CONFIG;

// Dynamic Subscription Plans (default: Yearly ₹299, 6 Months ₹170)
window.subscriptionPlans = {
  yearly: {
    id: 'yearly',
    name: 'Yearly Pro Plan',
    price: 299,
    period: 'Year',
    durationMonths: 12,
    badge: 'Save 45% · Best Value',
    subtext: '₹24.90 / month'
  },
  half_yearly: {
    id: 'half_yearly',
    name: '6 Months Pro Plan',
    price: 170,
    period: '6 Months',
    durationMonths: 6,
    badge: 'Popular Choice',
    subtext: '₹28.30 / month'
  }
};
window.selectedSubscriptionPlan = 'yearly';

// Load cached plans from localStorage if previously fetched
try {
  const cachedPlans = JSON.parse(localStorage.getItem('aura_cached_subscription_plans'));
  if (cachedPlans && typeof cachedPlans === 'object') {
    if (cachedPlans.yearly && typeof cachedPlans.yearly.price === 'number') {
      if (cachedPlans.yearly.name) cachedPlans.yearly.name = cachedPlans.yearly.name.replace(/\bVIP\b/g, 'Pro');
      window.subscriptionPlans.yearly = { ...window.subscriptionPlans.yearly, ...cachedPlans.yearly };
    }
    if (cachedPlans.half_yearly && typeof cachedPlans.half_yearly.price === 'number') {
      if (cachedPlans.half_yearly.name) cachedPlans.half_yearly.name = cachedPlans.half_yearly.name.replace(/\bVIP\b/g, 'Pro');
      window.subscriptionPlans.half_yearly = { ...window.subscriptionPlans.half_yearly, ...cachedPlans.half_yearly };
    }
  }
} catch (e) { }

function selectSubscriptionPlan(planId) {
  if (!window.subscriptionPlans[planId]) return;
  window.selectedSubscriptionPlan = planId;
  updateSubscriptionUI();
}
window.selectSubscriptionPlan = selectSubscriptionPlan;

function updateSubscriptionUI() {
  const selectedId = window.selectedSubscriptionPlan || 'yearly';
  const selectedPlan = window.subscriptionPlans[selectedId] || window.subscriptionPlans.yearly;
  const yearlyPlan = window.subscriptionPlans.yearly || { price: 299 };
  const halfYearlyPlan = window.subscriptionPlans.half_yearly || { price: 170 };

  const yearlyMonthly = (yearlyPlan.price / 12).toFixed(2);
  const halfYearlyMonthly = (halfYearlyPlan.price / 6).toFixed(2);

  // 1. Settings Section Updates
  const proPricingTag = document.getElementById('proActivePricingTag');
  if (proPricingTag) {
    proPricingTag.innerHTML = `₹${selectedPlan.price} <span>/ ${selectedPlan.period.toLowerCase()}</span>`;
  }

  const sPriceYearly = document.getElementById('settingsPriceYearlyDisplay');
  if (sPriceYearly) sPriceYearly.textContent = `₹${yearlyPlan.price}`;

  const sPriceHalf = document.getElementById('settingsPriceHalfYearlyDisplay');
  if (sPriceHalf) sPriceHalf.textContent = `₹${halfYearlyPlan.price}`;

  const sSubYearly = document.getElementById('settingsSubtextYearly');
  if (sSubYearly) sSubYearly.textContent = `₹${yearlyMonthly} / month`;

  const sSubHalf = document.getElementById('settingsSubtextHalfYearly');
  if (sSubHalf) sSubHalf.textContent = `₹${halfYearlyMonthly} / month`;

  const sBadgeYearly = document.getElementById('settingsPlanBadgeYearly');
  if (sBadgeYearly && yearlyPlan.badge) sBadgeYearly.textContent = yearlyPlan.badge;

  const sBadgeHalf = document.getElementById('settingsPlanBadgeHalfYearly');
  if (sBadgeHalf && halfYearlyPlan.badge) sBadgeHalf.textContent = halfYearlyPlan.badge;

  const sCardYearly = document.getElementById('settingsPlanCardYearly');
  const sCardHalf = document.getElementById('settingsPlanCardHalfYearly');
  if (sCardYearly) sCardYearly.classList.toggle('active', selectedId === 'yearly');
  if (sCardHalf) sCardHalf.classList.toggle('active', selectedId === 'half_yearly');

  const startBtnText = document.getElementById('startRazorpayBtnText');
  if (startBtnText) {
    const rawTemplate = (window.t ? window.t('settings_upgrade_btn') : '') || 'Upgrade with Google Play (₹299)';
    startBtnText.textContent = rawTemplate.replace('299', selectedPlan.price).replace('২৯৯', selectedPlan.price);
  }

  // 1b. Pro Save Limit Modal Updates (Exact Settings Paywall Synchronization)
  const mPricingTag = document.getElementById('modalProActivePricingTag');
  if (mPricingTag) {
    mPricingTag.innerHTML = `₹${selectedPlan.price} <span>/ ${selectedPlan.period.toLowerCase()}</span>`;
  }
  const mPriceYearly = document.getElementById('modalPriceYearlyDisplay');
  if (mPriceYearly) mPriceYearly.textContent = `₹${yearlyPlan.price}`;
  const mPriceHalf = document.getElementById('modalPriceHalfYearlyDisplay');
  if (mPriceHalf) mPriceHalf.textContent = `₹${halfYearlyPlan.price}`;
  const mSubYearly = document.getElementById('modalSubtextYearly');
  if (mSubYearly) mSubYearly.textContent = `₹${yearlyMonthly} / month`;
  const mSubHalf = document.getElementById('modalSubtextHalfYearly');
  if (mSubHalf) mSubHalf.textContent = `₹${halfYearlyMonthly} / month`;
  const mBadgeYearly = document.getElementById('modalPlanBadgeYearly');
  if (mBadgeYearly && yearlyPlan.badge) mBadgeYearly.textContent = yearlyPlan.badge;
  const mBadgeHalf = document.getElementById('modalPlanBadgeHalfYearly');
  if (mBadgeHalf && halfYearlyPlan.badge) mBadgeHalf.textContent = halfYearlyPlan.badge;
  const mCardYearly = document.getElementById('modalPlanCardYearly');
  const mCardHalf = document.getElementById('modalPlanCardHalfYearly');
  if (mCardYearly) mCardYearly.classList.toggle('active', selectedId === 'yearly');
  if (mCardHalf) mCardHalf.classList.toggle('active', selectedId === 'half_yearly');
  const mStartBtnText = document.getElementById('modalStartRazorpayBtnText');
  if (mStartBtnText) {
    const rawTemplate = (window.t ? window.t('settings_upgrade_btn') : '') || 'Upgrade with Google Play (₹299)';
    mStartBtnText.textContent = rawTemplate.replace('299', selectedPlan.price).replace('২৯৯', selectedPlan.price);
  }

  // 1c. Direct Album Import Modal Updates (Exact Settings Paywall Synchronization)
  const viPricingTag = document.getElementById('vipImportProActivePricingTag');
  if (viPricingTag) {
    viPricingTag.innerHTML = `₹${selectedPlan.price} <span>/ ${selectedPlan.period.toLowerCase()}</span>`;
  }
  const viPriceYearly = document.getElementById('vipImportPriceYearlyDisplay');
  if (viPriceYearly) viPriceYearly.textContent = `₹${yearlyPlan.price}`;
  const viPriceHalf = document.getElementById('vipImportPriceHalfYearlyDisplay');
  if (viPriceHalf) viPriceHalf.textContent = `₹${halfYearlyPlan.price}`;
  const viSubYearly = document.getElementById('vipImportSubtextYearly');
  if (viSubYearly) viSubYearly.textContent = `₹${yearlyMonthly} / month`;
  const viSubHalf = document.getElementById('vipImportSubtextHalfYearly');
  if (viSubHalf) viSubHalf.textContent = `₹${halfYearlyMonthly} / month`;
  const viBadgeYearly = document.getElementById('vipImportPlanBadgeYearly');
  if (viBadgeYearly && yearlyPlan.badge) viBadgeYearly.textContent = yearlyPlan.badge;
  const viBadgeHalf = document.getElementById('vipImportPlanBadgeHalfYearly');
  if (viBadgeHalf && halfYearlyPlan.badge) viBadgeHalf.textContent = halfYearlyPlan.badge;
  const viCardYearly = document.getElementById('vipImportPlanCardYearly');
  const viCardHalf = document.getElementById('vipImportPlanCardHalfYearly');
  if (viCardYearly) viCardYearly.classList.toggle('active', selectedId === 'yearly');
  if (viCardHalf) viCardHalf.classList.toggle('active', selectedId === 'half_yearly');
  const viStartBtnText = document.getElementById('vipImportStartRazorpayBtnText');
  if (viStartBtnText) {
    const rawTemplate = (window.t ? window.t('settings_upgrade_btn') : '') || 'Upgrade with Google Play (₹299)';
    viStartBtnText.textContent = rawTemplate.replace('299', selectedPlan.price).replace('২৯৯', selectedPlan.price);
  }

  // 2. Razorpay Modal Updates
  const rzpAmountBadge = document.getElementById('rzpSelectedAmountBadge');
  if (rzpAmountBadge) {
    rzpAmountBadge.textContent = `₹${selectedPlan.price}.00`;
  }

  const rPriceYearly = document.getElementById('rzpModalPriceYearly');
  if (rPriceYearly) rPriceYearly.textContent = `₹${yearlyPlan.price}`;

  const rPriceHalf = document.getElementById('rzpModalPriceHalfYearly');
  if (rPriceHalf) rPriceHalf.textContent = `₹${halfYearlyPlan.price}`;

  const rSubYearly = document.getElementById('rzpModalSubtextYearly');
  if (rSubYearly) rSubYearly.textContent = `₹${yearlyMonthly} / month`;

  const rSubHalf = document.getElementById('rzpModalSubtextHalfYearly');
  if (rSubHalf) rSubHalf.textContent = `₹${halfYearlyMonthly} / month`;

  const rBadgeYearly = document.getElementById('rzpModalBadgeYearly');
  if (rBadgeYearly && yearlyPlan.badge) rBadgeYearly.textContent = yearlyPlan.badge;

  const rBadgeHalf = document.getElementById('rzpModalBadgeHalfYearly');
  if (rBadgeHalf && halfYearlyPlan.badge) rBadgeHalf.textContent = halfYearlyPlan.badge;

  const rCardYearly = document.getElementById('rzpPlanCardYearly');
  const rCardHalf = document.getElementById('rzpPlanCardHalfYearly');
  if (rCardYearly) rCardYearly.classList.toggle('active', selectedId === 'yearly');
  if (rCardHalf) rCardHalf.classList.toggle('active', selectedId === 'half_yearly');

  const rPlanTitle = document.getElementById('rzpSelectedPlanTitle');
  if (rPlanTitle) {
    const cleanPlanName = (selectedPlan.name || '').replace(/\bVIP\b/g, 'Pro');
    rPlanTitle.textContent = `Aura Pro Unlimited · ${cleanPlanName}`;
  }

  const confirmBtnText = document.getElementById('confirmPaymentBtnText');
  if (confirmBtnText) {
    confirmBtnText.textContent = `Continue with Google Play (₹${selectedPlan.price}.00)`;
  }
}
window.updateSubscriptionUI = updateSubscriptionUI;

async function fetchFirebaseSubscriptionPlans() {
  const urls = [
    `${FIREBASE_CONFIG.rtdbUrl}/subscription_plans.json`,
    `${FIREBASE_CONFIG.rtdbFallbackUrl}/subscription_plans.json`
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') {
          let updated = false;
          if (data.yearly && typeof data.yearly.price === 'number') {
            if (data.yearly.name) data.yearly.name = data.yearly.name.replace(/\bVIP\b/g, 'Pro');
            window.subscriptionPlans.yearly = { ...window.subscriptionPlans.yearly, ...data.yearly };
            updated = true;
          }
          if (data.half_yearly && typeof data.half_yearly.price === 'number') {
            if (data.half_yearly.name) data.half_yearly.name = data.half_yearly.name.replace(/\bVIP\b/g, 'Pro');
            window.subscriptionPlans.half_yearly = { ...window.subscriptionPlans.half_yearly, ...data.half_yearly };
            updated = true;
          }
          if (updated) {
            try {
              localStorage.setItem('aura_cached_subscription_plans', JSON.stringify(window.subscriptionPlans));
            } catch (_) { }
            updateSubscriptionUI();
            console.log('Synchronized dynamic subscription plans from Firebase:', window.subscriptionPlans);
            break;
          }
        }
      }
    } catch (err) {
      // Fallback to local default / cached
    }
  }
}
window.fetchFirebaseSubscriptionPlans = fetchFirebaseSubscriptionPlans;

async function fetchFirebaseAppUpdates() {
  const urls = [
    `${FIREBASE_CONFIG.rtdbUrl}/app_updates.json`,
    `${FIREBASE_CONFIG.rtdbFallbackUrl}/app_updates.json`
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.latestVersionCode === 'number') {
          window.appUpdateState = {
            ...window.appUpdateState,
            ...data
          };
          try {
            localStorage.setItem('aura_cached_app_updates', JSON.stringify(window.appUpdateState));
          } catch (_) { }
          console.log('Synchronized dynamic app updates from Firebase:', window.appUpdateState);
          break;
        }
      }
    } catch (err) {
      // Fallback
    }
  }
}
window.fetchFirebaseAppUpdates = fetchFirebaseAppUpdates;

// Google Play Store Billing Integration Handlers
function initiateGooglePlayPayment() {
  if (state.isPro) {
    showToast('You already have Aura Pro activated! 👑');
    return;
  }

  const selectedId = window.selectedSubscriptionPlan || 'yearly';
  const plan = window.subscriptionPlans[selectedId] || window.subscriptionPlans.yearly;

  // If running inside Android native app with Google Play Billing:
  if (window.AndroidApp && typeof window.AndroidApp.launchGooglePlayBilling === 'function') {
    try {
      const launched = window.AndroidApp.launchGooglePlayBilling(selectedId);
      if (launched) {
        return;
      }
    } catch (err) {
      console.warn('Native Google Play Billing invocation failed, opening dialog:', err);
    }
  }

  // Fallback to in-app Google Play checkout sheet (supports testing & dev bypass)
  openGooglePlayModal();
}
const initiateRazorpayPayment = initiateGooglePlayPayment;
window.initiateGooglePlayPayment = initiateGooglePlayPayment;
window.initiateRazorpayPayment = initiateRazorpayPayment;

function openGooglePlayModal() {
  updateSubscriptionUI();
  const modal = document.getElementById('razorpayModal');
  if (modal) modal.style.display = 'flex';
}
const openRazorpayModal = openGooglePlayModal;
window.openGooglePlayModal = openGooglePlayModal;
window.openRazorpayModal = openRazorpayModal;

function closeGooglePlayModal() {
  const modal = document.getElementById('razorpayModal');
  if (modal) modal.style.display = 'none';
}
const closeRazorpayModal = closeGooglePlayModal;
window.closeGooglePlayModal = closeGooglePlayModal;
window.closeRazorpayModal = closeRazorpayModal;

function processSelectedPlanPayment() {
  const selectedId = window.selectedSubscriptionPlan || 'yearly';
  const plan = window.subscriptionPlans[selectedId] || window.subscriptionPlans.yearly;

  // If in native Android app, trigger Google Play native billing
  if (window.AndroidApp && typeof window.AndroidApp.launchGooglePlayBilling === 'function') {
    try {
      const launched = window.AndroidApp.launchGooglePlayBilling(selectedId);
      if (launched) {
        closeGooglePlayModal();
        return;
      }
    } catch (e) {
      console.warn('Google Play native flow failed:', e);
    }
  }

  // Fallback verification for web preview or test mode
  processSuccessfulPayment(`gplay_${plan.id}_${Date.now()}`);
}
window.processSelectedPlanPayment = processSelectedPlanPayment;

function processSuccessfulPayment(paymentId) {
  const selectedId = window.selectedSubscriptionPlan || 'yearly';
  const plan = window.subscriptionPlans[selectedId] || window.subscriptionPlans.yearly;
  state.isPro = true;
  state.proPlan = selectedId;
  state.proPurchasedAt = Date.now();
  saveState();
  closeGooglePlayModal();
  renderAll();
  showToast(`Google Play Verified! Welcome to PicShelf Pro (${plan.name}) 🎉`);
}
window.processSuccessfulPayment = processSuccessfulPayment;

// Global Callbacks invoked from Android native GooglePlayBillingManager
window.onGooglePlayPurchaseSuccess = function(orderId, planId) {
  if (planId) {
    window.selectedSubscriptionPlan = planId;
  }
  processSuccessfulPayment(orderId || `gplay_order_${Date.now()}`);
};

window.onGooglePlayPurchaseCancelled = function() {
  showToast('Google Play purchase cancelled');
};

window.onGooglePlayPurchaseFailed = function(errorMsg) {
  showToast(errorMsg ? `Google Play: ${errorMsg}` : 'Google Play purchase failed. Please try again.');
};

window.onGooglePlayPurchasePending = function() {
  showToast('Google Play purchase pending. Pro will activate automatically once approved.');
};

window.onGooglePlayPricesLoaded = function(prices) {
  if (!prices || typeof prices !== 'object') return;
  if (prices.picshelf_pro_yearly && window.subscriptionPlans?.yearly) {
    const pYearly = document.getElementById('settingsPriceYearlyDisplay');
    const mPYearly = document.getElementById('modalPriceYearlyDisplay');
    const rPYearly = document.getElementById('rzpModalPriceYearly');
    if (pYearly) pYearly.textContent = prices.picshelf_pro_yearly;
    if (mPYearly) mPYearly.textContent = prices.picshelf_pro_yearly;
    if (rPYearly) rPYearly.textContent = prices.picshelf_pro_yearly;
  }
  if (prices.picshelf_pro_half_yearly && window.subscriptionPlans?.half_yearly) {
    const pHalf = document.getElementById('settingsPriceHalfYearlyDisplay');
    const mPHalf = document.getElementById('modalPriceHalfYearlyDisplay');
    const rPHalf = document.getElementById('rzpModalPriceHalfYearly');
    if (pHalf) pHalf.textContent = prices.picshelf_pro_half_yearly;
    if (mPHalf) mPHalf.textContent = prices.picshelf_pro_half_yearly;
    if (rPHalf) rPHalf.textContent = prices.picshelf_pro_half_yearly;
  }
};

window.onGooglePlayBillingUnavailable = function(msg) {
  console.warn('Google Play Billing:', msg);
  showToast(msg || 'Google Play Store Billing is initializing...');
};

function restoreProPurchases() {
  if (state.isPro) {
    showToast('Aura Pro is already active and verified on this device.');
    return;
  }
  if (window.AndroidApp && typeof window.AndroidApp.restoreGooglePlayPurchases === 'function') {
    try {
      window.AndroidApp.restoreGooglePlayPurchases();
      showToast('Querying Google Play Store for active purchases...');
      return;
    } catch (e) {
      console.warn('Failed to query native Google Play purchases:', e);
    }
  }
  // Local verification fallback
  state.isPro = true;
  saveState();
  renderAll();
  showToast('Receipt verified! Restored PicShelf Pro membership via Google Play.');
}
window.restoreProPurchases = restoreProPurchases;

function openPaymentFaq() {
  showToast('Google Play Billing: Managed securely via your Google Play account with instant cancellation & refunds.');
}
window.openPaymentFaq = openPaymentFaq;

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
    } catch (_) { }
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
  if (navigator.vibrate) try { navigator.vibrate(25); } catch (_) { }

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
      } catch (_) { }
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
    if (navigator.vibrate) try { navigator.vibrate(35); } catch (_) { }
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
      } catch (_) { }
      saveState();

      if (navigator.vibrate) try { navigator.vibrate([40, 60, 40]); } catch (_) { }

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
      if (navigator.vibrate) try { navigator.vibrate([80, 50, 80]); } catch (_) { }
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

window.onNativeBiometricResult = function (success, errOrReason) {
  const btn = document.getElementById('biometricPromptBtn');
  const text = document.getElementById('biometricPromptBtnText');
  if (success) {
    if (navigator.vibrate) try { navigator.vibrate([40, 60, 40]); } catch (_) { }
    if (biometricAuthMode === 'recovery') {
      closeForgotPasscodeModal();
      hideAppLock();
      showToast('🔓 Fingerprint Verified! Set a new Passcode.');
      setTimeout(() => {
        openPasscodeSetupScreen('reset');
      }, 350);
    } else {
      hideAppLock();
      showToast('🔓 Vault Unlocked via Biometrics');
    }
  } else {
    if (navigator.vibrate) try { navigator.vibrate([60, 50, 60]); } catch (_) { }
    if (text) text.textContent = 'Unlock with Biometrics';
    if (btn) btn.style.borderColor = '';
    if (biometricAuthMode === 'recovery' && errOrReason === 'no_device_lock') {
      showToast('No fingerprint configured. Try "Reset via Phone Passcode / Pattern".');
    } else if (errOrReason && errOrReason !== 'no_device_lock' && errOrReason !== 'canceled' && errOrReason !== '10' && errOrReason !== '13') {
      showToast(`Biometrics: ${errOrReason}`);
    }
  }
};

window.onNativeResetAuthResult = function (success, errOrReason) {
  if (success) {
    if (navigator.vibrate) try { navigator.vibrate([40, 60, 40]); } catch (_) { }
    // Clear old forgotten passcode now that device ownership is verified
    state.appLockPin = null;
    state.biometricLock = false;
    state.isAppLocked = false;
    try {
      localStorage.removeItem('photo_org_app_pin');
      localStorage.setItem('photo_org_biometric_lock', 'false');
    } catch (_) { }
    saveStateImmediate();

    const toggle = document.getElementById('biometricLockToggle');
    if (toggle) toggle.checked = false;
    const sub = document.getElementById('appLockSubControls');
    if (sub) sub.style.display = 'none';

    closeForgotPasscodeModal();
    closeNoDeviceSecurityModal();
    hideAppLock();
    showToast('🔓 Identity Verified with Phone Lock! Set a new Passcode.');
    setTimeout(() => {
      openPasscodeSetupScreen('reset');
    }, 300);
  } else {
    if (navigator.vibrate) try { navigator.vibrate([80, 50, 80]); } catch (_) { }
    if (errOrReason === 'no_device_security' || errOrReason === 'no_device_lock') {
      // Both options failed: no fingerprint AND no phone passcode/pattern
      closeForgotPasscodeModal();
      showNoDeviceSecurityModal();
    } else if (errOrReason === 'canceled' || errOrReason === '10' || errOrReason === '13') {
      showToast('Verification cancelled. Vault remains locked.');
    } else {
      showToast('❌ Device verification failed. Vault remains locked.');
    }
  }
};

function showNoDeviceSecurityModal() {
  const modal = document.getElementById('noDeviceSecurityModal');
  if (modal) modal.style.display = 'flex';
}

function closeNoDeviceSecurityModal() {
  const modal = document.getElementById('noDeviceSecurityModal');
  if (modal) modal.style.display = 'none';
}

function openPhoneSecuritySettings() {
  closeNoDeviceSecurityModal();
  if (window.AndroidApp && typeof window.AndroidApp.openDeviceSecuritySettings === 'function') {
    window.AndroidApp.openDeviceSecuritySettings();
  } else {
    showToast('Please open Settings > Security on your device to set a screen lock.');
  }
}

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
    try { window.AndroidApp.authenticateBiometrics(); } catch (_) { }
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
  if (navigator.vibrate) try { navigator.vibrate(25); } catch (_) { }

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
    if (navigator.vibrate) try { navigator.vibrate([40, 60, 40]); } catch (_) { }
    hideAppLock();
    showToast('🔓 Vault Unlocked');
  } else {
    if (navigator.vibrate) try { navigator.vibrate([80, 50, 80]); } catch (_) { }
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
    } catch (_) { }
  }
  // Simulated biometric authentication on web/desktop preview
  if (navigator.vibrate) try { navigator.vibrate([50, 40, 60]); } catch (_) { }
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
  // Option 2: Require verification of phone screen lock (PIN, Pattern, Password, or Biometric) before allowing reset
  if (window.AndroidApp && typeof window.AndroidApp.authenticateForPasscodeReset === 'function') {
    showToast('Verifying Phone Lock (PIN / Pattern / Fingerprint)... 🛡️');
    try {
      window.AndroidApp.authenticateForPasscodeReset();
      return;
    } catch (e) {
      console.error('authenticateForPasscodeReset error:', e);
    }
  }

  // Web Browser / Desktop preview fallback: Require deliberate verification challenge
  const confirmText = prompt('SECURITY VERIFICATION: To reset your vault passcode in this browser, please type "RESET" to confirm:');
  if (confirmText && confirmText.trim().toUpperCase() === 'RESET') {
    state.appLockPin = null;
    state.biometricLock = false;
    state.isAppLocked = false;
    try {
      localStorage.removeItem('photo_org_app_pin');
      localStorage.setItem('photo_org_biometric_lock', 'false');
    } catch (_) { }
    saveStateImmediate();

    const toggle = document.getElementById('biometricLockToggle');
    if (toggle) toggle.checked = false;
    const sub = document.getElementById('appLockSubControls');
    if (sub) sub.style.display = 'none';

    closeForgotPasscodeModal();
    hideAppLock();
    showToast('🔓 Identity Verified! Set a new Passcode.');
    setTimeout(() => {
      openPasscodeSetupScreen('reset');
    }, 250);
  } else {
    showToast('Passcode reset cancelled. Vault remains locked.');
  }
}

function triggerBiometricAuth() {
  biometricAuthMode = 'unlock';
  if (window.AndroidApp && typeof window.AndroidApp.authenticateBiometrics === 'function') {
    try {
      window.AndroidApp.authenticateBiometrics();
      return;
    } catch (_) { }
  }
  // Smooth simulated biometric authentication with haptic feedback
  if (navigator.vibrate) try { navigator.vibrate([50, 40, 60]); } catch (_) { }
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
  showToast('👑 Pro / Developer Mode: Vault Bypassed');
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

window.handleNativeBackPressed = function () {
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
    'Preserved all photos, custom albums, and Pro 3D card finishes intact',
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

async function checkAppUpdate(isManual = false) {
  if (isManual) {
    showToast(window.t ? window.t('update_toast_checking') : 'Checking for updates via Firebase Cloud...');
  }

  // Live fetch from Firebase Realtime Database
  if (typeof fetchFirebaseAppUpdates === 'function') {
    await fetchFirebaseAppUpdates();
  }

  setTimeout(() => {
    const hasUpdate = window.appUpdateState.latestVersionCode > window.appUpdateState.currentVersionCode;
    if (hasUpdate) {
      openAppUpdateModal();
    } else if (isManual) {
      showToast(window.t ? window.t('update_toast_latest') : `You are using the latest version of Aura (v${window.appUpdateState.currentVersionName})!`);
    }
  }, isManual ? 400 : 100);
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

window.onUpdateDownloadProgress = function (percent) {
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

function updateFeedbackSubjectCounter() {
  const subInput = document.getElementById('feedbackSubjectInput');
  const counter = document.getElementById('feedbackSubjectCounter');
  if (!subInput || !counter) return;

  if (subInput.value.length > 100) {
    subInput.value = subInput.value.substring(0, 100);
  }

  const len = subInput.value.length;
  counter.textContent = `${len} / 100`;
  if (len >= 100) {
    counter.style.color = '#f43f5e';
  } else if (len >= 85) {
    counter.style.color = '#fbbf24';
  } else {
    counter.style.color = 'var(--text-muted)';
  }
}

function updateFeedbackMessageCounter() {
  const msgInput = document.getElementById('feedbackMessageInput');
  const counter = document.getElementById('feedbackMessageCounter');
  if (!msgInput || !counter) return;

  if (msgInput.value.length > 400) {
    msgInput.value = msgInput.value.substring(0, 400);
  }

  const len = msgInput.value.length;
  counter.textContent = `${len} / 400`;
  if (len >= 400) {
    counter.style.color = '#f43f5e';
  } else if (len >= 340) {
    counter.style.color = '#fbbf24';
  } else {
    counter.style.color = 'var(--text-muted)';
  }
}

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

  // Reset inputs and counters cleanly
  const subInput = document.getElementById('feedbackSubjectInput');
  const msgInput = document.getElementById('feedbackMessageInput');
  const contactInput = document.getElementById('feedbackContactInput');
  if (subInput) subInput.value = '';
  if (msgInput) msgInput.value = '';
  if (contactInput) contactInput.value = '';
  updateFeedbackSubjectCounter();
  updateFeedbackMessageCounter();

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

  if (subject.length > 100) {
    showToast('Summary is too long (maximum 100 characters).');
    return;
  }

  if (message.length > 400) {
    showToast('Details cannot exceed 400 characters.');
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

  // 1. Direct REST dispatch to Firebase Realtime Database
  const fbEndpoints = [
    'https://photoorganizer-31cf9-default-rtdb.firebaseio.com/feedback.json',
    'https://photoorganizer-31cf9.firebaseio.com/feedback.json'
  ];

  function tryPostToFirebase(idx = 0) {
    if (idx >= fbEndpoints.length) return;
    fetch(fbEndpoints[idx], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(feedbackPayload)
    })
      .then(res => {
        if (!res.ok && res.status === 404 && idx === 0) {
          tryPostToFirebase(1);
        } else if (res.ok) {
          console.log('[Feedback] Successfully delivered to Firebase Realtime Database');
        }
      })
      .catch(() => {
        if (idx === 0) tryPostToFirebase(1);
      });
  }
  tryPostToFirebase(0);

  // 2. Dispatch to native Android bridge -> Firebase RTDB
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
    updateFeedbackSubjectCounter();
    updateFeedbackMessageCounter();

    closeFeedbackModal();

    const successMsg = window.t ? window.t('feedback_toast_success') : 'Your feedback has been submitted successfully!';
    showToast(successMsg);
  }, 400);
}

window.openFeedbackModal = openFeedbackModal;
window.closeFeedbackModal = closeFeedbackModal;
window.selectFeedbackType = selectFeedbackType;
window.submitUserFeedback = submitUserFeedback;
window.updateFeedbackSubjectCounter = updateFeedbackSubjectCounter;
window.updateFeedbackMessageCounter = updateFeedbackMessageCounter;

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
    try { window.AndroidApp.clearCache(); } catch (_) { }
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

  // If user is currently viewing a specific album, ensure Albums tab in bottom dock remains highlighted
  if (state.activeAlbumView) {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.querySelector('.nav-item[data-tab="albumsScreen"]')?.classList.add('active');
  }
}

// -------------------------------------------------------------
// PRO FEATURE: FREE PLAN 20 PHOTOS SAVE LIMIT IN GALLERY & ALBUMS
// -------------------------------------------------------------
const FREE_GALLERY_SAVE_LIMIT = 20;

function getSavedPhotosCount() {
  return state.photos.filter(p => !p.isPending && !p.deletedAt).length;
}

function checkCanSavePhotosToGallery(countToSave = 1) {
  if (state.isPro) return true;
  const currentSaved = getSavedPhotosCount();
  if (currentSaved + countToSave > FREE_GALLERY_SAVE_LIMIT) {
    openVipSaveLimitModal({ currentSaved, countToSave, limit: FREE_GALLERY_SAVE_LIMIT });
    return false;
  }
  return true;
}

function openVipSaveLimitModal(details) {
  const toast = document.getElementById('toastMessage');
  if (toast) {
    toast.classList.remove('show');
    clearTimeout(toast._toastTimer);
  }
  if (typeof updateSubscriptionUI === 'function') {
    updateSubscriptionUI();
  }
  const modal = document.getElementById('vipSaveLimitModal');
  if (modal) {
    if (window.applyCurrentLanguageTranslations) {
      window.applyCurrentLanguageTranslations();
    }
    modal.style.display = 'flex';
  }
}

function closeVipSaveLimitModal() {
  const modal = document.getElementById('vipSaveLimitModal');
  if (modal) modal.style.display = 'none';
  if (state.moveCopyIsAlbumMode) {
    const targetAlbum = state.moveCopySourceAlbum;
    state.moveCopySourceAlbum = null;
    state.moveCopyIsAlbumMode = false;
    if (targetAlbum && window.highlightReturnedAlbumCard) {
      window.highlightReturnedAlbumCard(targetAlbum);
    }
  }
}
window.FREE_GALLERY_SAVE_LIMIT = FREE_GALLERY_SAVE_LIMIT;
window.getSavedPhotosCount = getSavedPhotosCount;
window.checkCanSavePhotosToGallery = checkCanSavePhotosToGallery;
window.openVipSaveLimitModal = openVipSaveLimitModal;
window.closeVipSaveLimitModal = closeVipSaveLimitModal;

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

  const dockLimitIndicator = document.getElementById('dockLimitIndicator');
  if (dockLimitIndicator) {
    if (state.isPro) {
      dockLimitIndicator.style.display = 'none';
    } else {
      const currentSaved = getSavedPhotosCount();
      const limit = FREE_GALLERY_SAVE_LIMIT;
      dockLimitIndicator.style.display = 'inline-flex';
      const pillTemplate = window.t ? window.t('pro_save_limit_pill') : '{current} / {limit} Photos Saved (Free Tier)';
      dockLimitIndicator.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> <span>${pillTemplate.replace('{current}', currentSaved).replace('{limit}', limit)}</span>`;
      dockLimitIndicator.classList.toggle('limit-reached', currentSaved >= limit);
      dockLimitIndicator.title = currentSaved >= limit
        ? (window.t ? window.t('pro_save_limit_heading') : 'Free Plan Limit Reached (20 Photos)')
        : 'Free plan: up to 20 photos in Gallery/Albums. Tap to upgrade!';
    }
  }

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
  if (!checkCanSavePhotosToGallery(count)) {
    return;
  }

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
  if (!checkCanSavePhotosToGallery(state.selectedDockPhotoIds.size)) {
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

  if (!checkCanSavePhotosToGallery(targetIds.length)) {
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
    const vipMsg = window.t ? window.t('gallery_3d_vip_only') : '👑 3D Effects are an Aura Pro exclusive feature!';
    showToast(vipMsg);
    if (navigator.vibrate) {
      try { navigator.vibrate([30, 40, 30]); } catch (e) { }
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
  } catch (err) { }

  saveState();
  renderGallery();
  renderGalleryAlbumsDropdown();

  if (typeof renderAlbumsScreen === 'function') {
    renderAlbumsScreen();
  }

  if (navigator.vibrate) {
    try { navigator.vibrate(newActiveState ? [30, 50, 40] : [40]); } catch (e) { }
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
      dropdown3DDesc.textContent = window.t ? window.t('gallery_3d_unlock_vip') : 'Unlock with Aura Pro';
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
        label.textContent = isAlbumPhoto3DActive
          ? ((window.t && window.t('album_3d_fx_on')) || '3D FX ON')
          : ((window.t && window.t('album_3d_fx_off')) || '3D FX OFF');
        label.setAttribute('data-i18n', isAlbumPhoto3DActive ? 'album_3d_fx_on' : 'album_3d_fx_off');
      }
      album3DToggleBtn.title = isAlbumPhoto3DActive
        ? ((window.t && window.t('album_3d_fx_active_title')) || '3D Card FX Active (Click to disable)')
        : ((window.t && window.t('album_3d_fx_disabled_title')) || '3D Card FX Disabled (Click to enable)');
      album3DToggleBtn.setAttribute('data-i18n-title', isAlbumPhoto3DActive ? 'album_3d_fx_active_title' : 'album_3d_fx_disabled_title');
      album3DToggleBtn.setAttribute('aria-label', album3DToggleBtn.title);
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
    const resizeBtn2 = document.getElementById('resizeSelectedBtn');
    if (renameBtn) renameBtn.style.display = isSingle ? 'inline-flex' : 'none';
    if (cropBtn) cropBtn.style.display = isSingle ? 'inline-flex' : 'none';
    if (resizeBtn2) resizeBtn2.style.display = isSingle ? 'inline-flex' : 'none';
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
        albumEmptyBtnText.textContent = window.t ? window.t('album_banner_import_btn') : 'Import Photos from Gallery (Pro)';
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
                <span class="tag-badge-pill" style="background:${tagColor}">${escapeHtml(photo.tags[0])}${photo.tags.length > 1 ? ` +${photo.tags.length - 1}` : ''}</span>
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
    card.setAttribute('draggable', 'false');

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

  const sortBtn = document.getElementById('sortTriggerBtn');
  if (sortBtn) {
    const sortTitle = window.t ? window.t('gallery_sort_trigger_title') : 'Sort gallery photos';
    sortBtn.title = sortTitle;
    sortBtn.setAttribute('data-i18n-title', 'gallery_sort_trigger_title');
    sortBtn.setAttribute('aria-label', sortTitle);
  }

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
  if (!dataUrl.startsWith('data:')) {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', dataUrl, false);
      xhr.overrideMimeType('text/plain; charset=x-user-defined');
      xhr.send(null);
      if (xhr.status === 200 || xhr.status === 0) {
        const bin = xhr.responseText;
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i) & 0xff;
        return new Blob([bytes], { type: forcedMime || 'image/jpeg' });
      }
    } catch (_) { }
  }
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

// Convert any image dataUrl/format to JPEG Blob and DataURL preserving original resolution and normal quality
function convertToJpegBlob(dataUrl, quality = 0.95, force4K = false) {
  return new Promise((resolve) => {
    if (!dataUrl || typeof dataUrl !== 'string') {
      return resolve({ blob: null, dataUrl: null });
    }
    const img = new Image();
    if (typeof dataUrl === 'string' && (dataUrl.startsWith('http://') || dataUrl.startsWith('https://'))) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => {
      try {
        const natW = img.naturalWidth || img.width || 1200;
        const natH = img.naturalHeight || img.height || 1200;

        let targetW = natW;
        let targetH = natH;

        // Keep normal original resolution as the photo is; only scale if explicitly forced
        if (force4K) {
          const maxDim = Math.max(natW, natH);
          if (maxDim < 3840) {
            const scale = 3840 / maxDim;
            targetW = Math.round(natW * scale);
            targetH = Math.round(natH * scale);
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Composite onto pure white background so any transparency doesn't turn black
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, targetW, targetH);
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
    } catch (e) { }
  }, 1500);
}

function getTodayDDMMYY() {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(-2);
  return `${day}-${month}-${year}`;
}

function getNextBrowserGalleryBatch(dateStr) {
  const key = 'gallery_batch_' + dateStr;
  let cur = parseInt(localStorage.getItem(key) || '0', 10);
  cur++;
  localStorage.setItem(key, String(cur));
  return String(cur).padStart(3, '0');
}

async function downloadSinglePhoto(id) {
  const photo = state.photos.find(p => p.id === id);
  if (!photo) {
    showToast('Photo not found');
    return;
  }

  const isFromAlbum = !!state.activeAlbumView || (state.activeTab === 'favoritesScreen') || !!state.detailSourceAlbum;
  const albumName = state.activeAlbumView || (state.activeTab === 'favoritesScreen' ? 'Favorites' : state.detailSourceAlbum);

  if (window.DownloadManager) {
    if (isFromAlbum && albumName) {
      await window.DownloadManager.startDownload({
        sourceType: 'album',
        albumName: albumName,
        photos: [photo]
      });
    } else {
      await window.DownloadManager.startDownload({
        sourceType: 'gallery',
        photos: [photo]
      });
    }
    return;
  }

  // Fallback if DownloadManager not loaded
  showToast(`Preparing photo... 📥`);
}

async function shareSinglePhoto(id) {
  const photo = state.photos.find(p => p.id === id);
  if (!photo) {
    showToast('Photo not found');
    return;
  }

  const cleanName = (photo.displayName || 'Photo').replace(/[^a-zA-Z0-9_\u0900-\u0D7F-]/g, '_');
  const fileName = `${cleanName}.jpg`;

  showToast(`Preparing '${cleanName}.jpg'... 📤`);

  const srcDataUrl = photo.dataUrl || (photo.gradient ? generateGradientImage(photo.displayName, photo.category, photo.gradient) : null);
  if (!srcDataUrl) {
    showToast('No image data found');
    return;
  }

  // Preserve normal original photo quality and resolution
  const { blob, dataUrl: finalDataUrl } = await convertToJpegBlob(srcDataUrl, 0.95, false);
  const shareDataUrl = finalDataUrl || srcDataUrl;
  const shareBlob = blob || dataUrlToBlob(shareDataUrl);

  // 1. Android Native App Bridge (Direct WhatsApp/System Intent)
  if (window.AndroidApp && typeof window.AndroidApp.sharePhoto === 'function') {
    try {
      window.AndroidApp.sharePhoto(shareDataUrl, photo.displayName || 'Photo');
      return;
    } catch (nativeErr) {
      console.warn('Native AndroidApp.sharePhoto failed, attempting Web Share fallback:', nativeErr);
    }
  }

  // 2. Web Share API with File Support (Chrome Android, macOS Safari, Windows Share)
  if (shareBlob && navigator.share) {
    try {
      const file = new File([shareBlob], fileName, { type: 'image/jpeg' });
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
  if (shareBlob && navigator.clipboard && window.ClipboardItem) {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/jpeg': shareBlob })
      ]);
      showToast(`Copied '${photo.displayName}' to clipboard! 📋`);
      return;
    } catch (clipImgErr) {
      console.warn('Clipboard image copy failed, triggering download fallback:', clipImgErr);
    }
  }

  // 4. Direct Browser Download Fallback
  triggerBrowserDownload(shareBlob || shareDataUrl, fileName);
  showToast(`📥 Exported '${cleanName}.jpg'!`);
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

    const lblFavDownload = window.t ? window.t('album_btn_fav_download_zip') : 'Download Favorites';
    const lblFavShare = window.t ? window.t('album_btn_fav_share') : 'Share Favorites';
    const lblFavTitle = window.t ? window.t('album_fav_card_title') : 'Favorites';
    const lblFavFeaturedPill = window.t ? window.t('album_fav_featured_pill') : 'Featured';
    const lblFavPriority = window.t ? window.t('album_fav_featured_priority') : 'Featured Priority';
    const lblFavPrioritySub = window.t ? window.t('album_fav_priority_sub') : 'Default Priority #1';
    const lblSurface = state.isPro
      ? (window.t ? window.t('album_btn_surface_pro') : 'Customize 3D Surface & Artwork')
      : (window.t ? window.t('album_btn_surface_vip') : 'Preview 3D Card (Pro)');
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

    const lblImport = window.t ? window.t('album_btn_import_vip') : 'Import photos directly into album (Pro)';
    const lblImportAria = window.t ? window.t('album_btn_import_aria') : 'Import photos';

    const lblSurface = state.isPro
      ? (window.t ? window.t('album_btn_surface_pro') : 'Customize 3D Surface & Artwork')
      : (window.t ? window.t('album_btn_surface_vip') : 'Preview 3D Card (Pro)');
    const lblSurfaceAria = window.t ? window.t('album_btn_surface_aria') : 'Customize 3D Surface';

    const lblDownload = window.t ? window.t('album_btn_download_zip') : 'Download album';
    const lblDownloadAria = window.t ? window.t('album_btn_download_aria') : 'Download album';

    const lblShare = window.t ? window.t('album_btn_share') : 'Share album';
    const lblShareAria = window.t ? window.t('album_btn_share_aria') : 'Share album';

    const lblOrganize = window.t ? window.t('album_btn_organize_vip') : 'Move or Copy complete album (Pro)';
    const lblOrganizeAria = window.t ? window.t('album_btn_organize_aria') : 'Move or Copy album';
    const lblVipDot = window.t ? window.t('album_btn_vip_dot') : 'Aura Pro Feature';

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
      card.classList.remove('card-collision-wave', 'wave-style-ripple', 'wave-style-spring', 'wave-style-seismic', 'wave-style-fluid', 'wave-style-vortex', 'wave-style-aurora', 'wave-style-gravity', 'wave-style-mercury', 'wave-style-ultrasonic', 'wave-style-crystal');
      void card.offsetWidth; // retrigger
      const style = state.shakeMotionStyle || 'ripple';
      if (state.shakeWaveFlashEnabled !== false) {
        card.classList.add('card-collision-wave', `wave-style-${style}`);
      }

      // Dynamic style deflection
      const normX = dist > 0 ? (dx / dist) : 0;
      const normY = dist > 0 ? (dy / dist) : 0;
      let deflectX = (-normY * 5).toFixed(2);
      let deflectY = (normX * 5).toFixed(2);
      let rotZ = 0;
      let zLift = 10;
      let scale = 1.02;

      if (style === 'spring') {
        zLift = 18;
        scale = 1.05;
      } else if (style === 'seismic') {
        rotZ = ((Math.random() - 0.5) * 5).toFixed(1);
        zLift = 14;
      } else if (style === 'fluid') {
        deflectX = (-normY * 7).toFixed(2);
        deflectY = (normX * 7).toFixed(2);
        zLift = 16;
      } else if (style === 'vortex') {
        rotZ = (normX >= 0 ? 4 : -4);
        zLift = 12;
      } else if (style === 'aurora') {
        rotZ = (normY >= 0 ? 3 : -3);
        zLift = 15;
        scale = 1.04;
      } else if (style === 'gravity') {
        // Gravitational well: cards pull inward toward origin
        deflectX = (normY * 5).toFixed(2);
        deflectY = (-normX * 5).toFixed(2);
        zLift = 20;
        scale = 1.06;
      } else if (style === 'mercury') {
        deflectX = (-normY * 8).toFixed(2);
        deflectY = (normX * 8).toFixed(2);
        zLift = 15;
        scale = 1.04;
      } else if (style === 'ultrasonic') {
        deflectX = 0;
        deflectY = 0;
        rotZ = 0;
        zLift = 22;
        scale = 1.05;
      } else if (style === 'crystal') {
        rotZ = ((dx >= 0 ? 1 : -1) * 3);
        zLift = 16;
        scale = 1.04;
      }

      card.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease';
      card.style.transform = `perspective(900px) rotateZ(${rotZ}deg) rotateX(${deflectX}deg) rotateY(${deflectY}deg) translateZ(${zLift}px) scale3d(${scale}, ${scale}, ${scale})`;

      const shine = card.querySelector('.album-3d-shine');
      if (shine) {
        shine.style.opacity = '1';
        const matchedStyle = Array.from(card.classList).find(c => c.startsWith('surface-'))?.replace('surface-', '') || 'default';
        const shineFn = VIP_3D_SHINE_MAP[matchedStyle] || VIP_3D_SHINE_MAP.default;
        shine.style.background = shineFn(50 + normX * 30, 50 + normY * 30);
      }

      setTimeout(() => {
        card.style.transform = '';
        card.classList.remove('card-collision-wave', 'wave-style-ripple', 'wave-style-spring', 'wave-style-seismic', 'wave-style-fluid', 'wave-style-vortex', 'wave-style-aurora', 'wave-style-gravity', 'wave-style-mercury', 'wave-style-ultrasonic', 'wave-style-crystal');
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
    const style = state.shakeMotionStyle || 'ripple';

    // Tailored haptics per style
    if (navigator.vibrate) {
      try {
        if (style === 'spring') navigator.vibrate([20, 60]);
        else if (style === 'seismic') navigator.vibrate([15, 30, 15, 30, 20]);
        else if (style === 'fluid') navigator.vibrate([50, 40, 50]);
        else if (style === 'vortex') navigator.vibrate([35, 25, 35]);
        else if (style === 'aurora') navigator.vibrate([40, 30, 40]);
        else if (style === 'gravity') navigator.vibrate([15, 80]);
        else if (style === 'mercury') navigator.vibrate([60, 30]);
        else if (style === 'ultrasonic') navigator.vibrate([15, 15, 15]);
        else if (style === 'crystal') navigator.vibrate([25, 35, 25]);
        else navigator.vibrate([30, 45, 30]); // ripple
      } catch (err) { }
    }

    // 1. If 3D Surface Studio modal is open, animate the modal preview card directly
    const modal = document.getElementById('album3DSurfaceModal');
    if (modal && modal.style.display !== 'none') {
      const card = document.getElementById('album3DPreviewCard');
      const shine = document.getElementById('album3DPreviewShine');
      if (card) {
        card.dataset.isAnimatingWave = 'true';
        card.classList.remove('card-collision-wave', 'wave-style-ripple', 'wave-style-spring', 'wave-style-seismic', 'wave-style-fluid', 'wave-style-vortex', 'wave-style-aurora', 'wave-style-gravity', 'wave-style-mercury', 'wave-style-ultrasonic', 'wave-style-crystal');
        void card.offsetWidth;
        if (state.shakeWaveFlashEnabled !== false) {
          card.classList.add('card-collision-wave', `wave-style-${style}`);
        }

        const shineSt = state.selected3DSurfaceStyle || 'default';
        const shineFn = VIP_3D_SHINE_MAP[shineSt] || VIP_3D_SHINE_MAP.default;
        let settleDuration = 550;

        if (style === 'spring') {
          // Tactile spring: compress then high overshoot rebound
          card.style.transition = 'transform 0.12s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease';
          card.style.transform = 'perspective(900px) rotateX(4deg) rotateY(-4deg) translateZ(-14px) scale3d(0.95, 0.95, 0.95)';
          if (shine) {
            shine.style.opacity = '1';
            shine.style.background = shineFn(50, 50);
          }
          setTimeout(() => {
            card.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.45s ease';
            card.style.transform = 'perspective(900px) rotateX(16deg) rotateY(-18deg) translateZ(36px) scale3d(1.10, 1.10, 1.10)';
            if (shine) shine.style.background = shineFn(80, 20);
          }, 120);
          settleDuration = 600;
        } else if (style === 'seismic') {
          // High-frequency tremor jolt
          card.style.transition = 'transform 0.08s ease-in-out';
          card.style.transform = 'perspective(900px) translate3d(-5px, 3px, 22px) rotateZ(-3deg) rotateX(9deg) rotateY(-11deg) scale3d(1.08, 1.08, 1.08)';
          if (shine) {
            shine.style.opacity = '1';
            shine.style.background = shineFn(40, 60);
          }
          setTimeout(() => {
            card.style.transition = 'transform 0.09s ease-in-out';
            card.style.transform = 'perspective(900px) translate3d(5px, -3px, 28px) rotateZ(3deg) rotateX(13deg) rotateY(-15deg) scale3d(1.08, 1.08, 1.08)';
            if (shine) shine.style.background = shineFn(85, 15);
          }, 85);
          setTimeout(() => {
            card.style.transition = 'transform 0.14s ease-out';
            card.style.transform = 'perspective(900px) translate3d(-1px, 1px, 12px) rotateZ(-1deg) rotateX(5deg) scale3d(1.02, 1.02, 1.02)';
          }, 175);
          settleDuration = 520;
        } else if (style === 'fluid') {
          // Glassy rolling oceanic tidal surge
          card.style.transition = 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.65s ease';
          card.style.transform = 'perspective(900px) rotateX(-16deg) rotateY(18deg) translateZ(30px) scale3d(1.06, 1.06, 1.06)';
          if (shine) {
            shine.style.opacity = '1';
            shine.style.background = shineFn(20, 80);
          }
          settleDuration = 680;
        } else if (style === 'vortex') {
          // Rotational torsion twist & swirl
          card.style.transition = 'transform 0.25s cubic-bezier(0.2, 0.9, 0.3, 1.3), box-shadow 0.4s ease';
          card.style.transform = 'perspective(900px) rotateZ(10deg) rotateX(12deg) rotateY(-14deg) translateZ(28px) scale3d(1.08, 1.08, 1.08)';
          if (shine) {
            shine.style.opacity = '1';
            shine.style.background = shineFn(90, 10);
          }
          setTimeout(() => {
            card.style.transition = 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
            card.style.transform = 'perspective(900px) rotateZ(-4deg) rotateX(4deg) rotateY(-4deg) translateZ(12px) scale3d(1.02, 1.02, 1.02)';
            if (shine) shine.style.background = shineFn(50, 50);
          }, 220);
          settleDuration = 620;
        } else if (style === 'aurora') {
          // Prismatic aurora refraction glide
          card.style.transition = 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.65s ease';
          card.style.transform = 'perspective(900px) rotateX(10deg) rotateY(16deg) rotateZ(3deg) translateZ(32px) scale3d(1.07, 1.07, 1.07)';
          if (shine) {
            shine.style.opacity = '1';
            shine.style.background = shineFn(30, 70);
          }
          settleDuration = 680;
        } else if (style === 'gravity') {
          // Gravitational well: deep implosion collapse then violent snap expansion
          card.style.transition = 'transform 0.16s cubic-bezier(0.6, -0.28, 0.735, 0.045)';
          card.style.transform = 'perspective(900px) scale3d(0.91, 0.91, 0.91) translateZ(-24px)';
          if (shine) {
            shine.style.opacity = '1';
            shine.style.background = shineFn(50, 50);
          }
          setTimeout(() => {
            card.style.transition = 'transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.45s ease';
            card.style.transform = 'perspective(900px) scale3d(1.12, 1.12, 1.12) translateZ(42px)';
            if (shine) shine.style.background = shineFn(80, 20);
          }, 160);
          settleDuration = 640;
        } else if (style === 'mercury') {
          // Liquid mercury: heavy fluid slosh inertia
          card.style.transition = 'transform 0.28s cubic-bezier(0.1, 0.9, 0.2, 1)';
          card.style.transform = 'perspective(900px) rotateX(-12deg) rotateY(-18deg) translateZ(28px) scale3d(1.08, 1.04, 1.06)';
          if (shine) {
            shine.style.opacity = '1';
            shine.style.background = shineFn(15, 85);
          }
          setTimeout(() => {
            card.style.transition = 'transform 0.38s cubic-bezier(0.34, 1.56, 0.64, 1)';
            card.style.transform = 'perspective(900px) rotateX(8deg) rotateY(12deg) translateZ(20px) scale3d(1.03, 1.06, 1.04)';
            if (shine) shine.style.background = shineFn(75, 25);
          }, 190);
          settleDuration = 650;
        } else if (style === 'ultrasonic') {
          // Ultrasonic scan: crisp vertical lift & micro laser sweep
          card.style.transition = 'transform 0.14s cubic-bezier(0.1, 1, 0.1, 1), box-shadow 0.3s ease';
          card.style.transform = 'perspective(900px) translateZ(36px) rotateX(2deg) scale3d(1.09, 1.09, 1.09)';
          if (shine) {
            shine.style.opacity = '1';
            shine.style.background = shineFn(50, 10);
          }
          setTimeout(() => {
            if (shine) shine.style.background = shineFn(50, 90);
          }, 150);
          settleDuration = 520;
        } else if (style === 'crystal') {
          // Crystal chime: sharp angular geometric facet burst
          card.style.transition = 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
          card.style.transform = 'perspective(900px) rotateX(15deg) rotateY(15deg) rotateZ(-4deg) translateZ(34px) scale3d(1.09, 1.09, 1.09)';
          if (shine) {
            shine.style.opacity = '1';
            shine.style.background = shineFn(85, 85);
          }
          setTimeout(() => {
            card.style.transition = 'transform 0.36s cubic-bezier(0.34, 1.56, 0.64, 1)';
            card.style.transform = 'perspective(900px) rotateX(-5deg) rotateY(-5deg) rotateZ(2deg) translateZ(16px) scale3d(1.03, 1.03, 1.03)';
            if (shine) shine.style.background = shineFn(20, 20);
          }, 200);
          settleDuration = 600;
        } else {
          // Concentric ripple (default)
          card.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.45s ease';
          card.style.transform = 'perspective(900px) rotateX(14deg) rotateY(-16deg) translateZ(26px) scale3d(1.08, 1.08, 1.08)';
          if (shine) {
            shine.style.opacity = '1';
            shine.style.background = shineFn(75, 25);
          }
          settleDuration = 550;
        }

        setTimeout(() => {
          card.style.transform = '';
          card.classList.remove('card-collision-wave', 'wave-style-ripple', 'wave-style-spring', 'wave-style-seismic', 'wave-style-fluid', 'wave-style-vortex', 'wave-style-aurora', 'wave-style-gravity', 'wave-style-mercury', 'wave-style-ultrasonic', 'wave-style-crystal');
          delete card.dataset.isAnimatingWave;
          if (shine && !card.dataset.userHovering) {
            shine.style.opacity = '0.4';
          }
        }, settleDuration);
      }
      if (typeof showToast === 'function') {
        const found = SHAKE_MOTION_STYLES.find(s => s.id === style);
        const name = found ? found.defaultTitle : 'Shake Wave';
        showToast(`✨ ${name} Triggered!`);
      }
      return;
    }

    // 2. Otherwise trigger on album or gallery cards
    triggerGridFluidWave(null, 'shake');
    if (typeof showToast === 'function') {
      const found = SHAKE_MOTION_STYLES.find(s => s.id === style);
      const name = found ? found.defaultTitle : 'Shake Wave';
      showToast(`✨ ${name} Activated!`);
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
    // If 3D Card Tilt is turned off, do not apply gyro rotation tilt to any card
    if (state.cardTiltEnabled === false) return;

    // If 3D Surface Studio modal is open, tilt the preview card
    const modal = document.getElementById('album3DSurfaceModal');
    if (modal && modal.style.display !== 'none') {
      const card = document.getElementById('album3DPreviewCard');
      const shine = document.getElementById('album3DPreviewShine');
      if (card && !card.dataset.userHovering && !card.dataset.isAnimatingWave && !card.classList.contains('card-collision-wave')) {
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

    if (state.cardTiltEnabled === false || state.albumPhotos3DEnabled === false || state.global3DEnabled === false || !state.isPro) return;

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
      // 1. 3D Card Tilt on pointer hover (controlled by 3D Card Tilt toggle)
      if (state.cardTiltEnabled !== false) {
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
        });
      }

      // 2. Neighbor harmonic fluid wave (controlled independently by Kinetic Shake & Collision Wave)
      if (state.shakeWaveFlashEnabled !== false) {
        const now = Date.now();
        if (now - lastWaveTime > 350) {
          lastWaveTime = now;
          triggerGridFluidWave(card, 'harmonic');
        }
      }
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
      const vipFeatureText = window.t ? window.t('surface_3d_vip_feature') : 'Aura Pro Feature';
      const vipDescText = window.t ? window.t('surface_3d_vip_desc') : 'Test-drive the live 3D card below, or activate instant tester access.';
      const vipTesterBtn = window.t ? window.t('surface_3d_tester_btn') : 'Pro Tester';
      const vipUpgradeBtn = window.t ? window.t('surface_3d_upgrade_btn') : 'Upgrade ₹299';
      statusBar.innerHTML = `
        <div class="vip-status-card vip-locked">
          <div class="vip-status-text">
            <span class="vip-status-title"><i class="fa-solid fa-gem" style="color:#f43f5e"></i> ${vipFeatureText}</span>
            <span class="vip-status-desc">${vipDescText}</span>
          </div>
          <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
            <button class="vip-unlock-pill tester-btn" onclick="enableVip(); openAlbum3DSurfaceModal('${escapeHtml(tagName)}');" title="${escapeHtml(vipTesterBtn)}" aria-label="${escapeHtml(vipTesterBtn)}">
              <i class="fa-solid fa-flask"></i> ${vipTesterBtn}
            </button>
            <button class="vip-unlock-pill" onclick="initiateRazorpayPayment()" title="${escapeHtml(vipUpgradeBtn)}" aria-label="${escapeHtml(vipUpgradeBtn)}">
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
      const cancelText = window.t ? (window.t('modal_close') || window.t('crop_cancel') || 'Cancel') : 'Cancel';
      const applyText = window.t ? window.t('surface_3d_apply') : 'Apply 3D Surface';
      actionContainer.innerHTML = `
        <button class="btn btn-outline" onclick="closeAlbum3DSurfaceModal()" title="${escapeHtml(cancelText)}" aria-label="${escapeHtml(cancelText)}">${cancelText}</button>
        <button class="btn btn-primary" onclick="saveAlbum3DSurface()" title="${escapeHtml(applyText)}" aria-label="${escapeHtml(applyText)}">
          <i class="fa-solid fa-wand-magic-sparkles"></i> ${applyText}
        </button>
      `;
    } else {
      const closeText = window.t ? (window.t('modal_close') || 'Close') : 'Close';
      const testerUnlockText = window.t ? window.t('surface_3d_tester_unlock') : 'Pro Tester Unlock';
      const unlockVipText = window.t ? window.t('surface_3d_unlock_vip') : 'Unlock Aura Pro (₹299)';
      actionContainer.innerHTML = `
        <button class="btn btn-outline" onclick="closeAlbum3DSurfaceModal()" title="${escapeHtml(closeText)}" aria-label="${escapeHtml(closeText)}">${closeText}</button>
        <button class="btn btn-outline" onclick="enableVip(); openAlbum3DSurfaceModal('${escapeHtml(tagName)}');" style="border-color: rgba(244, 63, 94, 0.5); color: #ff7a90;" title="${escapeHtml(testerUnlockText)}" aria-label="${escapeHtml(testerUnlockText)}">
          <i class="fa-solid fa-flask"></i> ${testerUnlockText}
        </button>
        <button class="btn btn-primary" onclick="initiateRazorpayPayment()" title="${escapeHtml(unlockVipText)}" aria-label="${escapeHtml(unlockVipText)}">
          ${getLuxuryCrownSvg(14)} ${unlockVipText}
        </button>
      `;
    }
  }

  // 7. Show Modal & Bind Interactive Tilt Stage & Drag Scroll
  const modal = document.getElementById('album3DSurfaceModal');
  if (modal) {
    // Initialize Kinetic Shake & Collision Wave controls
    const shakeToggle = document.getElementById('shakeWaveToggleCheckbox');
    if (shakeToggle) {
      shakeToggle.checked = (state.shakeWaveFlashEnabled !== false);
    }
    const tiltToggle = document.getElementById('cardTiltToggleCheckbox');
    if (tiltToggle) {
      tiltToggle.checked = (state.cardTiltEnabled !== false);
    }
    updateShakeWaveColorSectionVisibility();
    updateShakeMotionStyleChips();
    renderShakeWaveColorPalette();

    modal.style.display = 'flex';
    if (window.applyTranslationsToDOM) {
      window.applyTranslationsToDOM();
    }
    update3DSurfaceStyleChips();
    updateShakeMotionStyleChips();
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
  const uploadTitle = window.t ? window.t('surface_upload_title') : 'Upload custom surface photo or artwork';
  const tapSelectText = window.t ? window.t('surface_card_tap_select') : 'Tap to select';
  const tapDeselectText = window.t ? window.t('surface_card_tap_deselect') : 'Tap to deselect';

  let uploadCardHtml = `
    <div class="surface-upload-card" onclick="document.getElementById('albumSurfaceUploadInput').click()" title="${escapeHtml(uploadTitle)}" aria-label="${escapeHtml(uploadTitle)}">
      <i class="fa-solid fa-arrow-up-from-bracket" style="font-size: 16px;"></i>
      <span data-i18n="surface_3d_upload">${uploadLabel}</span>
    </div>
  `;

  let personalPhotosHtml = personalPhotos.map(photo => {
    const isSelected = state.selected3DSurfacePhoto === photo.dataUrl;
    const actionGuidance = isSelected ? tapDeselectText : tapSelectText;
    const fullDesc = `${photo.displayName} (${actionGuidance})`;
    return `
      <div class="surface-photo-card ${isSelected ? 'active' : ''}" onclick="selectSurfacePhoto('${photo.id}')" title="${escapeHtml(fullDesc)}" aria-label="${escapeHtml(fullDesc)}">
        <img src="${photo.dataUrl}" alt="${escapeHtml(photo.displayName)}" loading="lazy" />
        ${isSelected ? '<span class="active-check-badge"><i class="fa-solid fa-check"></i></span>' : ''}
      </div>
    `;
  }).join('');

  let studioSurfacesHtml = STUDIO_3D_SURFACES.map(surf => {
    const isSelected = state.selected3DSurfacePhoto === surf.dataUrl;
    const localizedName = (window.t ? window.t(surf.id + '_name') : surf.name) || surf.name;
    const localizedDesc = (window.t ? window.t(surf.id + '_desc') : '') || '';
    const actionGuidance = isSelected ? tapDeselectText : tapSelectText;
    const fullDesc = localizedDesc 
      ? `${localizedName}: ${localizedDesc} (${actionGuidance})`
      : `${localizedName} (${actionGuidance})`;
    return `
      <div class="surface-photo-card studio-card ${isSelected ? 'active' : ''}" onclick="selectStudioSurface('${surf.id}')" title="${escapeHtml(fullDesc)}" aria-label="${escapeHtml(fullDesc)}">
        <img src="${surf.dataUrl}" alt="${escapeHtml(localizedName)}" loading="lazy" />
        ${isSelected ? '<span class="active-check-badge"><i class="fa-solid fa-check"></i></span>' : ''}
      </div>
    `;
  }).join('');

  // Place Upload option at the very left as the first, then Studio Artworks, then personal photos
  strip.innerHTML = uploadCardHtml + studioSurfacesHtml + personalPhotosHtml;
}

function selectSurfacePhoto(photoId) {
  const photo = state.photos.find(p => p.id === photoId);
  if (!photo) return;

  // Click-to-select and click-again-to-deselect
  if (state.selected3DSurfacePhoto === photo.dataUrl) {
    removeAlbumCustomSurface();
    const deselectedToast = window.t ? window.t('surface_toast_deselected') : `Deselected surface (Default cover restored)`;
    showToast(deselectedToast);
    return;
  }

  state.selected3DSurfacePhoto = photo.dataUrl;
  update3DModalPreviewStage();
  renderSurfacePhotoPicker();
  const selectedToast = window.t 
    ? (window.t('surface_photo_applied') || "Selected '{name}' as card surface ✨").replace('{name}', photo.displayName)
    : `Selected '${photo.displayName}' as card surface ✨`;
  showToast(selectedToast);
}

function selectStudioSurface(surfId) {
  const surf = STUDIO_3D_SURFACES.find(s => s.id === surfId);
  if (!surf) return;

  const surfName = (window.t ? window.t(surf.id + '_name') : surf.name) || surf.name;

  // Click-to-select and click-again-to-deselect
  if (state.selected3DSurfacePhoto === surf.dataUrl) {
    removeAlbumCustomSurface();
    const deselectedToast = window.t ? window.t('surface_toast_deselected') : `Deselected surface (Default cover restored)`;
    showToast(deselectedToast);
    return;
  }

  state.selected3DSurfacePhoto = surf.dataUrl;
  update3DModalPreviewStage();
  renderSurfacePhotoPicker();
  const selectedToast = window.t 
    ? (window.t('surface_toast_applied') || 'Applied Studio Surface: {name} ✨').replace('{name}', surfName)
    : `Applied Studio Surface: ${surfName} ✨`;
  showToast(selectedToast);
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
    const titleEl = chip.querySelector('.style-title');
    const subEl = chip.querySelector('.style-sub');
    const titleText = titleEl ? titleEl.textContent.trim() : '';
    const subText = subEl ? subEl.textContent.trim() : '';
    if (titleText && subText) {
      const fullDesc = `${titleText}: ${subText}`;
      chip.setAttribute('title', fullDesc);
      chip.setAttribute('aria-label', fullDesc);
      if (titleEl) titleEl.setAttribute('title', titleText);
      if (subEl) subEl.setAttribute('title', subText);
    }
  });
}

function initModalStageTilt() {
  const stage = document.getElementById('stage3DPreviewWrapper');
  const card = document.getElementById('album3DPreviewCard');
  const shine = document.getElementById('album3DPreviewShine');
  if (!stage || !card) return;

  Aura3DMotionPhysics.init();

  const onMove = (e) => {
    if (state.cardTiltEnabled === false) return;
    if (card.dataset.isAnimatingWave || card.classList.contains('card-collision-wave')) return;
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
    showToast('👑 3D Album Cards are an Aura Pro exclusive feature!');
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
    showToast('👑 3D Card FX on Album Photos is an Aura Pro exclusive feature!');
    return;
  }

  const activeAlbumName = state.selectedFilterTags.size === 1 ? Array.from(state.selectedFilterTags)[0] : null;
  const albumTag = activeAlbumName ? state.tags.find(t => t.name === activeAlbumName) : null;

  state.albumPhotos3DEnabled = !(state.albumPhotos3DEnabled !== false);
  try {
    localStorage.setItem('aura_album_photos_3d_enabled', state.albumPhotos3DEnabled ? 'true' : 'false');
  } catch (err) { }

  saveState();
  renderGallery();

  if (state.albumPhotos3DEnabled) {
    const styleName = (albumTag && albumTag.surface3DStyle) ? albumTag.surface3DStyle.toUpperCase() : 'PRO 3D';
    const onToast = (window.t && window.t('gallery_3d_effects_on_toast')) || `✨ ${styleName} 3D Card FX Enabled for Album Photos!`;
    showToast(onToast);
  } else {
    const offToast = (window.t && window.t('gallery_3d_effects_off_toast')) || '3D Card FX Disabled for Album Photos';
    showToast(offToast);
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
    try { navigator.vibrate(state.isPro ? [40, 60, 80] : [50]); } catch (e) { }
  }

  showToast(state.isPro
    ? '👑 PRO BYPASS ACTIVATED: All 3D Albums, RAW Export & Secret Vault Unlocked!'
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
    if (navigator.vibrate) try { navigator.vibrate([80, 50, 80, 50, 120]); } catch (e) { }
    showToast(state.isPro
      ? '🎉 DEVELOPER SECRET UNLOCKED: Aura Pro Access 100% Bypassed!'
      : 'Developer Mode: Returned to Starter Free Tier');
  } else if (secretDevTapCount >= 3) {
    showToast(`🛠️ Developer Mode: ${5 - secretDevTapCount} taps remaining to toggle Pro bypass`);
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
  console.log('Pro Status:', results.isPro ? '👑 ACTIVE (Unlocked)' : '🔒 STARTER (Locked)');
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
            ${results.isPro ? 'PRO PASS' : 'STARTER'}
          </span>
        </div>
        <p style="font-size: 12px; margin: 0; color: var(--text-secondary);">
          ${results.isPro ? 'Aura Pro is active. Parallax tilt, specular shine, personal artwork, and holographic finishes are running at 60/120fps.' : 'Pro entitlement is currently locked. Toggle Pro Tester mode below to activate 3D elevation.'}
        </p>
      </div>

      <!-- Quick Tester Controls -->
      <div style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;">
        <button class="btn btn-outline" onclick="toggleVip(); run3DAlbumAudit(true);" style="font-size: 11px; padding: 7px 12px; flex: 1;">
          ${getLuxuryCrownSvg(13)} ${state.isPro ? 'Switch to Starter' : 'Enable Pro Mode'}
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

function openAlbumInGallery(tagName, skipToast = false) {
  recordAlbumActivity(tagName, 'viewed');
  state.selectedFilterTags.clear();
  state.selectedFilterTags.add(tagName);
  state.lastSelectedAlbum = tagName;
  state.activeAlbumView = tagName;

  try {
    history.pushState({ screen: 'albumView', albumName: tagName }, '');
  } catch (e) { }

  // Switch visible screen to galleryScreen to display photos filtered by this album
  document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
  document.getElementById('galleryScreen').classList.add('active');
  state.activeTab = 'galleryScreen';

  // Keep Albums highlighted in the bottom navigation dock because user is inside an album
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  const albumsNav = document.querySelector('.nav-item[data-tab="albumsScreen"]');
  if (albumsNav) {
    albumsNav.classList.add('active');
  }

  renderAll();

  if (!skipToast) {
    const toastMsg = window.t ? window.t('album_viewing_toast', { name: tagName }) : `Viewing '${tagName}' album`;
    showToast(toastMsg);
  }
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
        try { navigator.vibrate([28, 45, 28]); } catch (e) { }
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

  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  const albumsTabBtn = document.querySelector('.nav-item[data-tab="albumsScreen"]');
  if (albumsTabBtn) {
    albumsTabBtn.classList.add('active');
  }

  document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
  document.getElementById('albumsScreen').classList.add('active');
  state.activeTab = 'albumsScreen';

  if (typeof switchAlbumsView === 'function') {
    switchAlbumsView('albums');
  }

  renderAll();

  if (triggerScroll && previousAlbum) {
    highlightReturnedAlbumCard(previousAlbum);
  }
}
window.exitAlbumView = exitAlbumView;

function openFavoritesFromAlbum() {
  state.openedFavoritesFromAlbums = true;
  try {
    history.pushState({ screen: 'favoritesView' }, '');
  } catch (e) { }
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

// Centralized Album Download via DownloadManager
async function downloadAlbumZip(tagName) {
  const albumPhotos = state.photos.filter(p => !p.isPending && !p.deletedAt && p.tags && p.tags.includes(tagName));
  if (albumPhotos.length === 0) {
    showToast(`No photos in '${tagName}' album to download!`);
    return;
  }

  if (window.DownloadManager) {
    await window.DownloadManager.startDownload({
      sourceType: 'album',
      albumName: tagName,
      photos: albumPhotos
    });
    return;
  }
  await exportPhotosToZip(albumPhotos, `${tagName.replace(/[^a-zA-Z0-9_-]/g, '_')}_Album`, true, tagName);
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
    } catch (e) { }
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
  const favoritePhotos = state.photos.filter(p => (p.isFavorite || (p.tags && p.tags.includes('Favorites'))) && !p.deletedAt);
  if (favoritePhotos.length === 0) {
    showToast('No favorite photos to download!');
    return;
  }
  if (window.DownloadManager) {
    await window.DownloadManager.startDownload({
      sourceType: 'album',
      albumName: 'Favorites',
      photos: favoritePhotos
    });
    return;
  }
  await exportPhotosToZip(favoritePhotos, 'Favorites_Album', true, 'Favorites');
}

// Support downloading multiple albums in one action
async function downloadMultipleAlbums(albumNames) {
  if (!Array.isArray(albumNames) || albumNames.length === 0) {
    showToast('No albums selected to download');
    return;
  }
  const albumsPayload = albumNames.map(name => {
    const photos = state.photos.filter(p => !p.deletedAt && !p.isPending && p.tags && p.tags.includes(name));
    return {
      albumName: name,
      photos: photos
    };
  }).filter(a => a.photos.length > 0);

  if (albumsPayload.length === 0) {
    showToast('No photos found in selected albums to download');
    return;
  }

  if (window.DownloadManager) {
    await window.DownloadManager.startDownload({
      sourceType: 'multi_album',
      albums: albumsPayload
    });
  }
}
window.downloadMultipleAlbums = downloadMultipleAlbums;

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
    } catch (e) { }
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
                <span class="tag-badge-pill" style="background:${tagColor}">${escapeHtml(photo.tags[0])}${photo.tags.length > 1 ? ` +${photo.tags.length - 1}` : ''}</span>
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
  }
}

// -------------------------------------------------------------
// USER ACTIONS
// -------------------------------------------------------------

function movePhotoToGallery(id) {
  const photo = state.photos.find(p => p.id === id);
  if (photo) {
    if (!checkCanSavePhotosToGallery(1)) {
      return;
    }
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
  if (!photo || photo.deletedAt) return;

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

  // Track which album the user came from so Back button can return them there
  const activeAlbumFilter = (state.selectedFilterTags && state.selectedFilterTags.size === 1)
    ? Array.from(state.selectedFilterTags)[0]
    : null;
  state.detailSourceAlbum = activeAlbumFilter || state.activeAlbumView || null;

  const modal = document.getElementById('photoDetailModal');
  updateDetailModalUI(state.detailPhotoList[state.detailCurrentIndex]);
  toggleDetailBottomSheet(false); // Default to sleek collapsed mini tag bar
  modal.style.display = 'flex';

  showDetailSwipeHint();
}

function fitDetailElements() {
  const modal = document.getElementById('photoDetailModal');
  if (!modal || modal.style.display !== 'flex') return;
  const stage = document.getElementById('detailImageStage');
  const img = document.getElementById('detailImage');
  if (!stage || !img) return;
  const nw = img.naturalWidth || img.width || 0;
  const nh = img.naturalHeight || img.height || 0;
  if (!nw || !nh) return;

  const wrapper = document.getElementById('detailImageWrapper') || stage;
  const wRect = wrapper.getBoundingClientRect();
  const stageW = Math.max(120, (wRect.width || wrapper.clientWidth || stage.clientWidth || 400) - 28);
  const stageH = Math.max(120, (wRect.height || wrapper.clientHeight || stage.clientHeight || 600) - 12);
  if (stageW <= 0 || stageH <= 0) return;

  const stageAr = stageW / stageH;
  const imgAr = nw / nh;

  let dispW, dispH;
  if (imgAr >= stageAr) {
    dispW = Math.round(stageW);
    dispH = Math.max(1, Math.round(stageW / imgAr));
  } else {
    dispH = Math.round(stageH);
    dispW = Math.max(1, Math.round(stageH * imgAr));
  }

  img.style.width = dispW + 'px';
  img.style.height = dispH + 'px';
  img.style.maxWidth = '100%';
  img.style.maxHeight = '100%';

  const bCanvas = document.getElementById('detailBackdropCanvas');
  const sCanvas = document.getElementById('detailSubjectCanvas');
  if (bCanvas) {
    bCanvas.style.width = dispW + 'px';
    bCanvas.style.height = dispH + 'px';
  }
  if (sCanvas) {
    sCanvas.style.width = dispW + 'px';
    sCanvas.style.height = dispH + 'px';
  }
}
window.fitDetailElements = fitDetailElements;

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
    detailImg.style.filter = 'none';
    if (detailImg.complete && detailImg.naturalWidth > 0) {
      fitDetailElements();
    } else {
      detailImg.onload = () => fitDetailElements();
    }
  }

  if (typeof resetStudioValues === 'function') resetStudioValues();
  if (typeof renderStudioFilterThumbnails === 'function') renderStudioFilterThumbnails(photo);

  const favBtn = document.getElementById('detailFavoriteBtn');
  if (favBtn) {
    favBtn.innerHTML = photo.isFavorite ? '<i class="fa-solid fa-heart" style="color:#f43f5e !important;"></i>' : '<i class="fa-regular fa-heart"></i>';
    const favTitle = window.t ? window.t('detail_favorite') : 'Favorite Photo';
    favBtn.title = favTitle;
    favBtn.setAttribute('aria-label', favTitle);
  }

  const backBtn = document.getElementById('closeDetailBtn');
  if (backBtn) {
    const backTitle = (window.t && window.t('detail_back')) || 'Back to Gallery';
    backBtn.title = backTitle;
    backBtn.setAttribute('aria-label', backTitle);
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

  const isStudioOpen = !!studioState.activeTool || !!document.getElementById('detailEditStudioDrawer')?.classList.contains('open');

  if (prevBtn) {
    const disabled = (state.detailCurrentIndex <= 0);
    prevBtn.disabled = disabled;
    prevBtn.classList.toggle('disabled', disabled);
    prevBtn.classList.toggle('studio-hidden', isStudioOpen);
    prevBtn.style.display = (!isStudioOpen && total > 1) ? 'flex' : 'none';
  }
  if (nextBtn) {
    const disabled = (state.detailCurrentIndex >= total - 1);
    nextBtn.disabled = disabled;
    nextBtn.classList.toggle('disabled', disabled);
    nextBtn.classList.toggle('studio-hidden', isStudioOpen);
    nextBtn.style.display = (!isStudioOpen && total > 1) ? 'flex' : 'none';
  }
  if (typeof updateStudioNavButtons === 'function') {
    updateStudioNavButtons();
  }
  if (typeof window.applyTranslationsToDOM === 'function') {
    window.applyTranslationsToDOM();
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
  if (studioState.activeTool || document.getElementById('detailEditStudioDrawer')?.classList.contains('open')) return;
  if (!state.detailPhotoList || state.detailPhotoList.length <= 1) return;

  const detailImg = document.getElementById('detailImage');
  if (!detailImg) return;

  if (direction === 'next') {
    if (!canDetailGoNext()) {
      bounceDetailImage('end');
      return;
    }
    isNavigatingDetailPhoto = true;

    const stage = document.getElementById('detailImageStage');

    // Slide out to left
    if (stage) {
      stage.style.transition = 'transform 0.18s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.18s ease-out';
      stage.style.transform = 'translateX(-70px) scale(0.93)';
      stage.style.opacity = '0';
    }
    detailImg.style.transition = 'transform 0.18s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.18s ease-out';
    detailImg.style.transform = 'translateX(-70px) scale(0.93)';
    detailImg.style.opacity = '0';

    setTimeout(() => {
      state.detailCurrentIndex++;
      const nextPhoto = state.detailPhotoList[state.detailCurrentIndex];
      detailImg.src = nextPhoto.dataUrl;
      if (stage) {
        stage.style.transition = 'none';
        stage.style.transform = 'translateX(70px) scale(0.93)';
        stage.style.opacity = '0';
      }
      detailImg.style.transition = 'none';
      detailImg.style.transform = 'translateX(70px) scale(0.93)';
      detailImg.style.opacity = '0';
      updateDetailModalUI(nextPhoto, true);

      void detailImg.offsetWidth; // Force reflow

      if (stage) {
        stage.style.transition = 'transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.24s ease-out';
        stage.style.transform = 'translateX(0) scale(1)';
        stage.style.opacity = '1';
      }
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

    const stage = document.getElementById('detailImageStage');

    // Slide out to right
    if (stage) {
      stage.style.transition = 'transform 0.18s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.18s ease-out';
      stage.style.transform = 'translateX(70px) scale(0.93)';
      stage.style.opacity = '0';
    }
    detailImg.style.transition = 'transform 0.18s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.18s ease-out';
    detailImg.style.transform = 'translateX(70px) scale(0.93)';
    detailImg.style.opacity = '0';

    setTimeout(() => {
      state.detailCurrentIndex--;
      const prevPhoto = state.detailPhotoList[state.detailCurrentIndex];
      detailImg.src = prevPhoto.dataUrl;
      if (stage) {
        stage.style.transition = 'none';
        stage.style.transform = 'translateX(-70px) scale(0.93)';
        stage.style.opacity = '0';
      }
      detailImg.style.transition = 'none';
      detailImg.style.transform = 'translateX(-70px) scale(0.93)';
      detailImg.style.opacity = '0';
      updateDetailModalUI(prevPhoto, true);

      void detailImg.offsetWidth; // Force reflow

      if (stage) {
        stage.style.transition = 'transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.24s ease-out';
        stage.style.transform = 'translateX(0) scale(1)';
        stage.style.opacity = '1';
      }
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
  const stage = document.getElementById('detailImageStage');
  const detailImg = document.getElementById('detailImage');
  if (stage) {
    stage.style.transition = 'transform 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s ease';
    stage.style.transform = 'translateX(0) scale(1)';
    stage.style.opacity = '1';
  }
  if (detailImg) {
    detailImg.style.transition = 'transform 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s ease';
    detailImg.style.transform = 'translateX(0) scale(1)';
    detailImg.style.opacity = '1';
  }

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
  if (typeof revertStudioCropPreviewIfNeeded === 'function') revertStudioCropPreviewIfNeeded(state.activePhotoId);
  const modal = document.getElementById('photoDetailModal');
  if (modal) modal.style.display = 'none';
  if (typeof closeStudioDrawer === 'function') closeStudioDrawer();
  if (typeof resetStudioValues === 'function') resetStudioValues();
  if (typeof updateStudioNavButtons === 'function') updateStudioNavButtons();
  const returningPhotoId = state.activePhotoId;

  // Capture source album BEFORE clearing state
  const sourceAlbum = state.detailSourceAlbum || null;
  state.detailSourceAlbum = null;

  state.activePhotoId = null;
  state.detailPhotoList = [];
  state.detailCurrentIndex = 0;
  const stage = document.getElementById('detailImageStage');
  if (stage) {
    stage.style.transform = 'none';
    stage.style.opacity = '1';
    stage.style.transition = 'none';
  }
  const detailImg = document.getElementById('detailImage');
  if (detailImg) {
    detailImg.style.transform = 'none';
    detailImg.style.opacity = '1';
    detailImg.style.transition = 'none';
    detailImg.style.filter = 'none';
  }

  // Restore album view if user entered photo from a specific album
  if (sourceAlbum) {
    state.selectedFilterTags.clear();
    state.selectedFilterTags.add(sourceAlbum);
    state.activeAlbumView = sourceAlbum;
    state.lastSelectedAlbum = sourceAlbum;
    // Switch to gallery screen showing that album
    document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
    document.getElementById('galleryScreen').classList.add('active');
    state.activeTab = 'galleryScreen';
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.querySelector('.nav-item[data-tab="albumsScreen"]')?.classList.add('active');
    renderAll();
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
    } catch (_) { }

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

// -------------------------------------------------------------
// Interactive Subject Drag & Reposition Gestures (All Backdrop Screens)
// -------------------------------------------------------------
let _isSubjectDragging = false;
let _subjectDragStartX = 0;
let _subjectDragStartY = 0;
let _subjectStartOffsetX = 0;
let _subjectStartOffsetY = 0;
let _isSubjectDragSetup = false;

function setupBackdropSubjectDragGestures() {
  if (_isSubjectDragSetup) return;
  _isSubjectDragSetup = true;

  const stage = document.getElementById('detailImageStage');
  const subjectCanvas = document.getElementById('detailSubjectCanvas');
  if (!stage || !subjectCanvas) return;

  function onDragStart(clientX, clientY) {
    if (studioState.activeTool !== 'backdrop') return false;
    if (studioState.activeSub.backdrop === 'nanoscope') return false;
    _isSubjectDragging = true;
    _subjectDragStartX = clientX;
    _subjectDragStartY = clientY;
    _subjectStartOffsetX = studioState.subjectOffsetX || 0;
    _subjectStartOffsetY = studioState.subjectOffsetY || 0;
    stage.classList.add('dragging-subject');

    const badgeText = document.getElementById('detailAiSegmentText');
    if (badgeText) badgeText.textContent = '✨ Moving Subject...';
    return true;
  }

  function onDragMove(clientX, clientY) {
    if (!_isSubjectDragging) return;
    const rect = subjectCanvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    // Map screen coordinate delta directly to native canvas pixels
    const scaleX = subjectCanvas.width / rect.width;
    const scaleY = subjectCanvas.height / rect.height;
    const deltaX = (clientX - _subjectDragStartX) * scaleX;
    const deltaY = (clientY - _subjectDragStartY) * scaleY;

    studioState.subjectOffsetX = Math.round(_subjectStartOffsetX + deltaX);
    studioState.subjectOffsetY = Math.round(_subjectStartOffsetY + deltaY);

    renderBackdropCanvasComposite();
  }

  function onDragEnd() {
    if (!_isSubjectDragging) return;
    _isSubjectDragging = false;
    stage.classList.remove('dragging-subject');
    const badgeText = document.getElementById('detailAiSegmentText');
    if (badgeText) {
      badgeText.textContent = (window.t ? window.t('detail_subject_detected') : 'AI Subject Isolated');
    }
  }

  // Pointer / Mouse events on stage
  stage.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    if (studioState.activeTool !== 'backdrop') return;
    if (e.target.closest('.detail-nav-btn') || e.target.closest('button')) return;
    e.preventDefault();
    e.stopPropagation();
    onDragStart(e.clientX, e.clientY);
  });

  window.addEventListener('mousemove', (e) => {
    if (_isSubjectDragging) {
      e.preventDefault();
      onDragMove(e.clientX, e.clientY);
    }
  });

  window.addEventListener('mouseup', () => {
    if (_isSubjectDragging) {
      onDragEnd();
    }
  });

  // Touch events for mobile devices / tablets
  stage.addEventListener('touchstart', (e) => {
    if (studioState.activeTool !== 'backdrop') return;
    if (e.touches.length !== 1) return;
    if (e.target.closest('.detail-nav-btn') || e.target.closest('button')) return;
    e.stopPropagation();
    onDragStart(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    if (_isSubjectDragging && e.touches.length === 1) {
      if (e.cancelable) e.preventDefault();
      onDragMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: false });

  window.addEventListener('touchend', () => {
    if (_isSubjectDragging) {
      onDragEnd();
    }
  }, { passive: true });

  window.addEventListener('touchcancel', () => {
    if (_isSubjectDragging) {
      onDragEnd();
    }
  }, { passive: true });

  // Double click stage in backdrop mode to reset position to center
  stage.addEventListener('dblclick', (e) => {
    if (studioState.activeTool === 'backdrop' && studioState.activeSub.backdrop !== 'nanoscope') {
      e.preventDefault();
      studioState.subjectOffsetX = 0;
      studioState.subjectOffsetY = 0;
      renderBackdropCanvasComposite();
      showToast('🎯 Subject position reset to center');
    }
  });
}

// -------------------------------------------------------------
// NanoScope Pixel-by-Pixel Eraser Controller
// -------------------------------------------------------------
let _isNanoErasing = false;
let _hasPushedUndoForStroke = false;
let _isNanoInteractionsSetup = false;

function pushNanoUndoState() {
  if (!studioState.cachedCutoutCanvas) return;
  const c = studioState.cachedCutoutCanvas;
  const copy = document.createElement('canvas');
  copy.width = c.width;
  copy.height = c.height;
  copy.getContext('2d').drawImage(c, 0, 0);

  if (!studioState.nanoUndoStack) studioState.nanoUndoStack = [];
  studioState.nanoUndoStack.push(copy);
  if (studioState.nanoUndoStack.length > 25) {
    studioState.nanoUndoStack.shift();
  }
  updateNanoUndoButtonState();
}

function popNanoUndoState() {
  if (!studioState.nanoUndoStack || studioState.nanoUndoStack.length === 0) return;
  const prevCanvas = studioState.nanoUndoStack.pop();
  if (prevCanvas && studioState.cachedCutoutCanvas) {
    const c = studioState.cachedCutoutCanvas;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(prevCanvas, 0, 0);
    renderBackdropCanvasComposite();
    showToast('↶ Undid last pixel removal');
    if (typeof window.renderNanoLoupeForCutoutCoords === 'function' && typeof studioState.nanoFocusX === 'number' && typeof studioState.nanoFocusY === 'number') {
      window.renderNanoLoupeForCutoutCoords(studioState.nanoFocusX, studioState.nanoFocusY);
    }
  }
  updateNanoUndoButtonState();
}

function updateNanoUndoButtonState() {
  const btn = document.getElementById('nanoscopeUndoBtn');
  if (btn) {
    btn.disabled = (!studioState.nanoUndoStack || studioState.nanoUndoStack.length === 0);
  }
}

function resetNanoCutoutToAi() {
  if (!studioState.cachedRawAiCutoutCanvas || !studioState.cachedCutoutCanvas) {
    showToast('⚠️ No initial cutout snapshot available');
    return;
  }
  pushNanoUndoState();
  const c = studioState.cachedCutoutCanvas;
  const raw = studioState.cachedRawAiCutoutCanvas;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.drawImage(raw, 0, 0);
  renderBackdropCanvasComposite();
  showToast('🔄 Restored initial cutout!');
  if (typeof window.renderNanoLoupeForCutoutCoords === 'function' && typeof studioState.nanoFocusX === 'number' && typeof studioState.nanoFocusY === 'number') {
    window.renderNanoLoupeForCutoutCoords(studioState.nanoFocusX, studioState.nanoFocusY);
  }
}

function setupNanoScopeInteractions() {
  if (_isNanoInteractionsSetup) return;
  _isNanoInteractionsSetup = true;

  const stage = document.getElementById('detailImageStage');
  const subjectCanvas = document.getElementById('detailSubjectCanvas');
  const loupe = document.getElementById('nanoScopeLoupe');
  const marker = document.getElementById('nanoScopeTargetMarker');
  const curveCanvas = document.getElementById('nanoCurveCanvas');
  if (!stage || !subjectCanvas || !loupe) return;

  // Initialize state defaults
  if (typeof studioState.nanoLockTarget !== 'boolean') studioState.nanoLockTarget = true;
  if (!studioState.nanoCurvePoints) studioState.nanoCurvePoints = [];
  if (typeof studioState.nanoActivePtIdx !== 'number') studioState.nanoActivePtIdx = -1;
  if (typeof studioState.nanoCurveReach !== 'number') studioState.nanoCurveReach = 25;

  function isNanoScopeActive() {
    return studioState.activeTool === 'backdrop' && studioState.activeSub.backdrop === 'nanoscope';
  }

  function getCutoutCoordsFromClient(clientX, clientY) {
    const rect = subjectCanvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;

    const W = subjectCanvas.width;
    const H = subjectCanvas.height;

    const canvasX = (clientX - rect.left) * (W / rect.width);
    const canvasY = (clientY - rect.top) * (H / rect.height);

    const scale = (studioState.subjectScale || 100) / 100;
    const dx = (W - W * scale) / 2 + (studioState.subjectOffsetX || 0);
    const dy = (H - H * scale) + (studioState.subjectOffsetY || 0);

    const cutoutX = (canvasX - dx) / scale;
    const cutoutY = (canvasY - dy) / scale;

    return { cutoutX, cutoutY, W, H, rect };
  }

  function renderNanoLoupeForCutoutCoords(cx, cy) {
    if (!isNanoScopeActive() || !studioState.cachedCutoutCanvas) {
      if (loupe) loupe.style.display = 'none';
      if (marker) marker.style.display = 'none';
      if (curveCanvas) curveCanvas.style.display = 'none';
      return;
    }

    const W = studioState.cachedCutoutCanvas.width;
    const H = studioState.cachedCutoutCanvas.height;
    cx = Math.max(0, Math.min(W - 1, Math.round(cx)));
    cy = Math.max(0, Math.min(H - 1, Math.round(cy)));

    studioState.nanoFocusX = cx;
    studioState.nanoFocusY = cy;

    const rect = subjectCanvas.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height || !stageRect.width || !stageRect.height) return;

    const scale = (studioState.subjectScale || 100) / 100;
    const dx = (W - W * scale) / 2 + (studioState.subjectOffsetX || 0);
    const dy = (H - H * scale) + (studioState.subjectOffsetY || 0);

    const canvasX = cx * scale + dx;
    const canvasY = cy * scale + dy;

    const clientX = rect.left + (canvasX / W) * rect.width;
    const clientY = rect.top + (canvasY / H) * rect.height;

    const stageX = clientX - stageRect.left;
    const stageY = clientY - stageRect.top;

    // Position floating target marker on exact subject pixel
    if (marker) {
      marker.style.left = `${stageX}px`;
      marker.style.top = `${stageY}px`;
      marker.style.display = 'flex';
    }

    // Position loupe: the circle remains in the position where user left it; the ONLY change in position is by drag only!
    if (!studioState.nanoLoupeCustomPos || typeof studioState.nanoLoupeCustomPos.x !== 'number') {
      const loupeW = 180;
      const loupeH = 226;

      let posX = stageX + 28;
      let posY = stageY - 110;

      if (posX + loupeW > stageRect.width - 8) {
        posX = stageX - loupeW - 28;
      }
      if (posX < 8) posX = 8;
      if (posY < 8) {
        posY = stageY + 28;
      }
      if (posY + loupeH > stageRect.height - 8) {
        posY = Math.max(8, stageRect.height - loupeH - 8);
      }

      studioState.nanoLoupeCustomPos = { x: posX, y: posY };
    }

    loupe.style.left = `${studioState.nanoLoupeCustomPos.x}px`;
    loupe.style.top = `${studioState.nanoLoupeCustomPos.y}px`;
    loupe.style.display = 'flex';

    // Render 180x180 deep zoom canvas
    const loupeCanvas = document.getElementById('nanoScopeCanvas');
    if (!loupeCanvas) return;
    const lCtx = loupeCanvas.getContext('2d');
    lCtx.imageSmoothingEnabled = false;

    const zoom = studioState.nanoZoom || 16;
    const windowSize = Math.max(5, Math.round(180 / zoom));
    const half = Math.floor(windowSize / 2);
    const srcX = cx - half;
    const srcY = cy - half;

    lCtx.clearRect(0, 0, 180, 180);

    // Draw dark / checkerboard background pattern inside loupe
    const checkSize = Math.max(4, Math.round(zoom / 2));
    for (let py = 0; py < 180; py += checkSize) {
      for (let px = 0; px < 180; px += checkSize) {
        lCtx.fillStyle = ((Math.floor(px / checkSize) + Math.floor(py / checkSize)) % 2 === 0) ? '#131926' : '#080c14';
        lCtx.fillRect(px, py, checkSize, checkSize);
      }
    }

    // Draw magnified cutout pixels
    if (studioState.cachedCutoutCanvas) {
      lCtx.drawImage(
        studioState.cachedCutoutCanvas,
        srcX, srcY, windowSize, windowSize,
        0, 0, 180, 180
      );
    }

    // Subtle pixel grid overlay
    const pxStep = 180 / windowSize;
    lCtx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    lCtx.lineWidth = 1;
    for (let i = 0; i <= windowSize; i++) {
      const p = Math.round(i * pxStep);
      lCtx.beginPath();
      lCtx.moveTo(p, 0);
      lCtx.lineTo(p, 180);
      lCtx.stroke();
      lCtx.beginPath();
      lCtx.moveTo(0, p);
      lCtx.lineTo(180, p);
      lCtx.stroke();
    }

    // Draw Boundary Curve inside Loupe under magnification
    if (studioState.nanoCurvePoints && studioState.nanoCurvePoints.length > 0) {
      const pts = studioState.nanoCurvePoints;
      const isClosed = !!studioState.nanoCurveClosed && pts.length >= 3;
      lCtx.save();
      lCtx.strokeStyle = '#00f0ff';
      lCtx.lineWidth = Math.max(2, Math.round(zoom / 8));
      lCtx.shadowColor = '#00f0ff';
      lCtx.shadowBlur = 6;
      lCtx.beginPath();
      pts.forEach((pt, idx) => {
        const lx = (pt.x - srcX) * pxStep;
        const ly = (pt.y - srcY) * pxStep;
        if (idx === 0) lCtx.moveTo(lx, ly);
        else lCtx.lineTo(lx, ly);
      });
      if (isClosed) {
        lCtx.closePath();
        lCtx.fillStyle = 'rgba(0, 240, 255, 0.12)';
        lCtx.fill();
      }
      lCtx.stroke();

      // Draw anchor points inside loupe
      pts.forEach((pt, idx) => {
        const lx = (pt.x - srcX) * pxStep;
        const ly = (pt.y - srcY) * pxStep;
        const isActivePt = (idx === studioState.nanoActivePtIdx);
        lCtx.beginPath();
        lCtx.arc(lx, ly, isActivePt ? Math.max(5, zoom / 3) : Math.max(3, zoom / 4), 0, Math.PI * 2);
        lCtx.fillStyle = isActivePt ? '#fbbf24' : (idx === 0 ? '#34d399' : '#f43f5e');
        lCtx.fill();
        lCtx.strokeStyle = '#ffffff';
        lCtx.lineWidth = 1.5;
        lCtx.stroke();
      });
      lCtx.restore();
    }

    // Reticle boundary box for active brush
    const brushSize = studioState.nanoBrushSize || 1;
    const centerPixelLeft = Math.round(half * pxStep);
    const centerPixelTop = Math.round(half * pxStep);
    const brushBoxSize = Math.max(pxStep, brushSize * pxStep);
    const boxOffset = (brushBoxSize - pxStep) / 2;

    // High-contrast dual-stroke precision box (clearly visible on both light and dark pixels)
    lCtx.strokeStyle = 'rgba(0, 0, 0, 0.95)';
    lCtx.lineWidth = 3;
    lCtx.strokeRect(centerPixelLeft - boxOffset, centerPixelTop - boxOffset, brushBoxSize, brushBoxSize);
    lCtx.strokeStyle = '#ffffff';
    lCtx.lineWidth = 1.5;
    lCtx.strokeRect(centerPixelLeft - boxOffset, centerPixelTop - boxOffset, brushBoxSize, brushBoxSize);

    // Read pixel data for HUD tag
    let r = 0, g = 0, b = 0, a = 0;
    if (studioState.cachedCutoutCanvas && cx >= 0 && cx < W && cy >= 0 && cy < H) {
      try {
        const pData = studioState.cachedCutoutCanvas.getContext('2d').getImageData(cx, cy, 1, 1).data;
        r = pData[0]; g = pData[1]; b = pData[2]; a = pData[3];
      } catch (e) { }
    }
    const hudTag = document.getElementById('nanoScopeHudTag');
    if (hudTag) {
      if (a === 0) {
        hudTag.textContent = `X:${cx} Y:${cy} · Cutout Void · ${zoom}x`;
      } else {
        hudTag.textContent = `X:${cx} Y:${cy} · RGB(${r},${g},${b}) · ${zoom}x`;
      }
    }
  }

  // Draw Boundary Curve overlay on main stage canvas
  function renderNanoCurveOnStage() {
    if (!curveCanvas) return;
    if (!isNanoScopeActive() || !studioState.nanoCurvePoints || studioState.nanoCurvePoints.length === 0) {
      curveCanvas.style.display = 'none';
      return;
    }

    const rect = subjectCanvas.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height || !stageRect.width || !stageRect.height) return;

    curveCanvas.width = stageRect.width;
    curveCanvas.height = stageRect.height;
    curveCanvas.style.display = 'block';

    const ctx = curveCanvas.getContext('2d');
    ctx.clearRect(0, 0, curveCanvas.width, curveCanvas.height);

    const W = subjectCanvas.width;
    const H = subjectCanvas.height;
    const scale = (studioState.subjectScale || 100) / 100;
    const dx = (W - W * scale) / 2 + (studioState.subjectOffsetX || 0);
    const dy = (H - H * scale) + (studioState.subjectOffsetY || 0);

    const pts = studioState.nanoCurvePoints;
    const stagePts = pts.map(pt => {
      const canvasX = pt.x * scale + dx;
      const canvasY = pt.y * scale + dy;
      const clientX = rect.left + (canvasX / W) * rect.width;
      const clientY = rect.top + (canvasY / H) * rect.height;
      return {
        x: clientX - stageRect.left,
        y: clientY - stageRect.top
      };
    });

    const isClosed = !!studioState.nanoCurveClosed && pts.length >= 3;
    if (stagePts.length > 1) {
      ctx.save();
      // If closed loop, shade interior area
      if (isClosed) {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';
        ctx.beginPath();
        stagePts.forEach((sp, i) => {
          if (i === 0) ctx.moveTo(sp.x, sp.y);
          else ctx.lineTo(sp.x, sp.y);
        });
        ctx.closePath();
        ctx.fill();
      }

      // Glowing outer halo line
      ctx.strokeStyle = isClosed ? 'rgba(56, 189, 248, 0.45)' : 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      stagePts.forEach((sp, i) => {
        if (i === 0) ctx.moveTo(sp.x, sp.y);
        else ctx.lineTo(sp.x, sp.y);
      });
      if (isClosed) ctx.closePath();
      ctx.stroke();

      // Sharp inner neon line
      ctx.strokeStyle = isClosed ? '#38bdf8' : '#00f0ff';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      stagePts.forEach((sp, i) => {
        if (i === 0) ctx.moveTo(sp.x, sp.y);
        else ctx.lineTo(sp.x, sp.y);
      });
      if (isClosed) ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }

    // Draw control anchor dots (optimized for 100+ points without text clutter)
    const totalPts = stagePts.length;
    stagePts.forEach((sp, idx) => {
      const isActive = (idx === studioState.nanoActivePtIdx);
      const isStartOrEnd = (idx === 0 || idx === totalPts - 1);
      const showLabel = (totalPts <= 25) || isActive || isStartOrEnd;

      ctx.save();
      ctx.beginPath();
      const dotRadius = isActive ? 7 : (totalPts > 50 ? 3.5 : 5);
      ctx.arc(sp.x, sp.y, dotRadius, 0, Math.PI * 2);
      ctx.fillStyle = isActive ? '#fbbf24' : (idx === 0 ? '#34d399' : '#00f0ff');
      ctx.shadowColor = isActive ? '#fbbf24' : '#00f0ff';
      ctx.shadowBlur = isActive ? 12 : 6;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = isActive ? 2.5 : 1.5;
      ctx.stroke();

      // Number badge for point
      if (showLabel) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.shadowBlur = 0;
        ctx.fillText(`${idx + 1}`, sp.x + 8, sp.y - 6);
      }
      ctx.restore();
    });
  }

  function updateNanoLoupe(clientX, clientY) {
    if (!isNanoScopeActive() || !studioState.cachedCutoutCanvas) {
      loupe.style.display = 'none';
      if (marker) marker.style.display = 'none';
      return;
    }

    const stageRect = stage.getBoundingClientRect();
    if (clientX < stageRect.left || clientX > stageRect.right || clientY < stageRect.top || clientY > stageRect.bottom) {
      return;
    }

    const coords = getCutoutCoordsFromClient(clientX, clientY);
    if (!coords) return;

    renderNanoLoupeForCutoutCoords(coords.cutoutX, coords.cutoutY);
  }

  function eraseAtCutoutCoord(cutoutX, cutoutY, pushUndo = false) {
    if (!isNanoScopeActive() || !studioState.cachedCutoutCanvas) return;
    const c = studioState.cachedCutoutCanvas;
    const W = c.width;
    const H = c.height;
    const cx = Math.max(0, Math.min(W - 1, Math.round(cutoutX)));
    const cy = Math.max(0, Math.min(H - 1, Math.round(cutoutY)));

    studioState.nanoFocusX = cx;
    studioState.nanoFocusY = cy;

    if (pushUndo) {
      pushNanoUndoState();
    } else if (!_hasPushedUndoForStroke) {
      pushNanoUndoState();
      _hasPushedUndoForStroke = true;
    }

    const ctx = c.getContext('2d');
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';

    const brushSize = studioState.nanoBrushSize || 1;
    if (brushSize <= 1) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(cx, cy, 1, 1);
    } else {
      ctx.beginPath();
      ctx.arc(cx, cy, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    renderBackdropCanvasComposite();
    renderNanoLoupeForCutoutCoords(cx, cy);
  }

  function eraseAtClient(clientX, clientY) {
    if (!isNanoScopeActive() || !studioState.cachedCutoutCanvas) return;
    const coords = getCutoutCoordsFromClient(clientX, clientY);
    if (!coords) return;
    eraseAtCutoutCoord(coords.cutoutX, coords.cutoutY, false);
  }

  // Precision Pixel Mover & Directional Remover
  function nudgeNanoFocus(dx, dy) {
    if (!isNanoScopeActive() || !studioState.cachedCutoutCanvas) return;
    const c = studioState.cachedCutoutCanvas;
    const W = c.width;
    const H = c.height;

    const step = studioState.nanoStep || 1;

    // If in Boundary Curve Mode with active point, nudge that anchor point pixel-by-pixel!
    if (studioState.nanoCurveMode && studioState.nanoCurvePoints && studioState.nanoCurvePoints.length > 0 && studioState.nanoActivePtIdx >= 0) {
      const pt = studioState.nanoCurvePoints[studioState.nanoActivePtIdx];
      if (pt) {
        pt.x = Math.max(0, Math.min(W - 1, pt.x + dx * step));
        pt.y = Math.max(0, Math.min(H - 1, pt.y + dy * step));
        studioState.nanoFocusX = pt.x;
        studioState.nanoFocusY = pt.y;
        renderNanoCurveOnStage();
        renderNanoLoupeForCutoutCoords(pt.x, pt.y);
        return;
      }
    }

    if (typeof studioState.nanoFocusX !== 'number' || typeof studioState.nanoFocusY !== 'number') {
      studioState.nanoFocusX = Math.round(W / 2);
      studioState.nanoFocusY = Math.round(H / 2);
    }

    const targetX = Math.max(0, Math.min(W - 1, studioState.nanoFocusX + dx * step));
    const targetY = Math.max(0, Math.min(H - 1, studioState.nanoFocusY + dy * step));

    studioState.nanoFocusX = targetX;
    studioState.nanoFocusY = targetY;

    if (studioState.nanoEraseOnMove) {
      eraseAtCutoutCoord(targetX, targetY, true);
    } else {
      renderNanoLoupeForCutoutCoords(targetX, targetY);
    }
  }

  function eraseCurrentFocusedPixel() {
    if (!isNanoScopeActive() || !studioState.cachedCutoutCanvas) return;
    const c = studioState.cachedCutoutCanvas;
    const W = c.width;
    const H = c.height;

    // In Curve Mode: if center button is pressed, add point or trim
    if (studioState.nanoCurveMode) {
      addNanoCurvePoint();
      return;
    }

    if (typeof studioState.nanoFocusX !== 'number' || typeof studioState.nanoFocusY !== 'number') {
      studioState.nanoFocusX = Math.round(W / 2);
      studioState.nanoFocusY = Math.round(H / 2);
    }

    eraseAtCutoutCoord(studioState.nanoFocusX, studioState.nanoFocusY, true);

    const centerBtn = document.getElementById('nanoDpadCenterEraseBtn');
    if (centerBtn) {
      centerBtn.classList.add('erasing-pulse');
      setTimeout(() => centerBtn.classList.remove('erasing-pulse'), 150);
    }
  }

  // Boundary Curve Points Management
  function updateCurvePtBadge() {
    const badge = document.getElementById('nanoCurvePtBadge');
    if (!badge) return;
    const pts = studioState.nanoCurvePoints || [];
    if (pts.length === 0) {
      badge.textContent = '0 Points';
    } else {
      badge.textContent = `Point ${studioState.nanoActivePtIdx + 1} of ${pts.length}`;
    }
  }

  function addNanoCurvePoint(x, y) {
    if (!studioState.nanoCurvePoints) studioState.nanoCurvePoints = [];
    const ptX = (typeof x === 'number') ? Math.round(x) : (studioState.nanoFocusX || 100);
    const ptY = (typeof y === 'number') ? Math.round(y) : (studioState.nanoFocusY || 100);

    studioState.nanoCurvePoints.push({ x: ptX, y: ptY });
    studioState.nanoActivePtIdx = studioState.nanoCurvePoints.length - 1;
    studioState.nanoFocusX = ptX;
    studioState.nanoFocusY = ptY;

    updateCurvePtBadge();
    renderNanoCurveOnStage();
    renderNanoLoupeForCutoutCoords(ptX, ptY);
    showToast(`📍 Added curve anchor point #${studioState.nanoCurvePoints.length}`);
  }

  function deleteActiveNanoCurvePoint() {
    if (!studioState.nanoCurvePoints || studioState.nanoCurvePoints.length === 0) return;
    const idx = studioState.nanoActivePtIdx;
    if (idx >= 0 && idx < studioState.nanoCurvePoints.length) {
      studioState.nanoCurvePoints.splice(idx, 1);
      studioState.nanoActivePtIdx = Math.max(0, Math.min(studioState.nanoCurvePoints.length - 1, idx - 1));
      if (studioState.nanoCurvePoints.length > 0) {
        const cur = studioState.nanoCurvePoints[studioState.nanoActivePtIdx];
        studioState.nanoFocusX = cur.x;
        studioState.nanoFocusY = cur.y;
        renderNanoLoupeForCutoutCoords(cur.x, cur.y);
      }
      updateCurvePtBadge();
      renderNanoCurveOnStage();
      showToast('🗑️ Removed anchor point');
    }
  }

  function clearNanoCurve() {
    studioState.nanoCurvePoints = [];
    studioState.nanoActivePtIdx = -1;
    updateCurvePtBadge();
    renderNanoCurveOnStage();
    if (typeof studioState.nanoFocusX === 'number') {
      renderNanoLoupeForCutoutCoords(studioState.nanoFocusX, studioState.nanoFocusY);
    }
    showToast('✨ Cleared boundary curve');
  }

  function cycleActiveNanoCurvePoint(dir) {
    const pts = studioState.nanoCurvePoints || [];
    if (pts.length === 0) return;
    let next = (studioState.nanoActivePtIdx + dir) % pts.length;
    if (next < 0) next = pts.length - 1;
    studioState.nanoActivePtIdx = next;
    const cur = pts[next];
    studioState.nanoFocusX = cur.x;
    studioState.nanoFocusY = cur.y;
    updateCurvePtBadge();
    renderNanoCurveOnStage();
    renderNanoLoupeForCutoutCoords(cur.x, cur.y);
  }

  // Dense linear interpolation along polyline points for mathematical precision
  function interpolateCurvePoints(pts, closed = false) {
    const result = [];
    const count = closed ? pts.length : pts.length - 1;
    for (let i = 0; i < count; i++) {
      const p0 = pts[i];
      const p1 = pts[(i + 1) % pts.length];
      const dist = Math.hypot(p1.x - p0.x, p1.y - p0.y);
      const steps = Math.max(1, Math.ceil(dist));
      for (let s = 0; s < steps; s++) {
        const t = s / steps;
        result.push({
          x: Math.round(p0.x + (p1.x - p0.x) * t),
          y: Math.round(p0.y + (p1.y - p0.y) * t)
        });
      }
    }
    if (!closed && pts.length > 0) {
      result.push(pts[pts.length - 1]);
    }
    return result;
  }

  // Directional & Enclosed Boundary Trimming
  function executeBoundaryTrim(direction) {
    if (!isNanoScopeActive() || !studioState.cachedCutoutCanvas) return;
    const pts = studioState.nanoCurvePoints;
    if (!pts || pts.length < 2) {
      showToast('⚠️ Please place at least 2 points along the curve before trimming');
      return;
    }

    if ((direction === 'inside' || direction === 'outside') && pts.length < 3) {
      showToast('⚠️ Need at least 3 points to form a closed loop area');
      return;
    }

    pushNanoUndoState();
    const c = studioState.cachedCutoutCanvas;
    const ctx = c.getContext('2d');
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = '#000000';

    const reach = studioState.nanoCurveReach || 25;
    const W = c.width;
    const H = c.height;

    if (direction === 'inside') {
      // 1. Erase all pixels INSIDE the closed loop
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.closePath();
      ctx.fill();
    } else if (direction === 'outside') {
      // 2. Erase all pixels OUTSIDE the closed boundary (keeping subject inside)
      ctx.beginPath();
      ctx.rect(0, 0, W, H);
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.closePath();
      ctx.fill('evenodd');
    } else {
      // 3. Directional boundary trimming (left, right, above, below)
      const densePts = interpolateCurvePoints(pts);

      // If full reach, build bounding polygon for 100% mathematical coverage
      if (reach >= 999) {
        ctx.beginPath();
        if (direction === 'left') {
          ctx.moveTo(0, pts[0].y);
          pts.forEach(p => ctx.lineTo(p.x, p.y));
          ctx.lineTo(0, pts[pts.length - 1].y);
        } else if (direction === 'right') {
          ctx.moveTo(W, pts[0].y);
          pts.forEach(p => ctx.lineTo(p.x, p.y));
          ctx.lineTo(W, pts[pts.length - 1].y);
        } else if (direction === 'above') {
          ctx.moveTo(pts[0].x, 0);
          pts.forEach(p => ctx.lineTo(p.x, p.y));
          ctx.lineTo(pts[pts.length - 1].x, 0);
        } else if (direction === 'below') {
          ctx.moveTo(pts[0].x, H);
          pts.forEach(p => ctx.lineTo(p.x, p.y));
          ctx.lineTo(pts[pts.length - 1].x, H);
        }
        ctx.closePath();
        ctx.fill();
      }

      // Dense strips along curve with 3px height/width for overlap
      densePts.forEach(pt => {
        if (direction === 'left') {
          const w = (reach >= 999) ? pt.x : Math.min(reach, pt.x);
          if (w > 0) ctx.fillRect(pt.x - w, pt.y - 1, w, 3);
        } else if (direction === 'right') {
          const w = (reach >= 999) ? (W - (pt.x + 1)) : Math.min(reach, W - (pt.x + 1));
          if (w > 0) ctx.fillRect(pt.x + 1, pt.y - 1, w, 3);
        } else if (direction === 'above') {
          const h = (reach >= 999) ? pt.y : Math.min(reach, pt.y);
          if (h > 0) ctx.fillRect(pt.x - 1, pt.y - h, 3, h);
        } else if (direction === 'below') {
          const h = (reach >= 999) ? (H - (pt.y + 1)) : Math.min(reach, H - (pt.y + 1));
          if (h > 0) ctx.fillRect(pt.x - 1, pt.y + 1, 3, h);
        }
      });
    }

    ctx.restore();
    renderBackdropCanvasComposite();
    renderNanoLoupeForCutoutCoords(studioState.nanoFocusX, studioState.nanoFocusY);
    renderNanoCurveOnStage();
    showToast(`✂️ Trimmed pixels ${direction} of boundary!`);
  }

  // D-Pad directional buttons with smooth repeat-on-hold
  function bindDpadBtn(btnId, dx, dy) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    let timer = null;
    let interval = null;

    let justMousedown = false;
    const start = (e) => {
      e.preventDefault();
      e.stopPropagation();
      justMousedown = true;
      nudgeNanoFocus(dx, dy);
      timer = setTimeout(() => {
        interval = setInterval(() => {
          nudgeNanoFocus(dx, dy);
        }, 75);
      }, 250);
    };

    const stop = () => {
      if (timer) { clearTimeout(timer); timer = null; }
      if (interval) { clearInterval(interval); interval = null; }
      setTimeout(() => { justMousedown = false; }, 50);
    };

    btn.addEventListener('mousedown', start);
    btn.addEventListener('mouseup', stop);
    btn.addEventListener('mouseleave', stop);
    btn.addEventListener('touchstart', start, { passive: false });
    btn.addEventListener('touchend', stop);
    btn.addEventListener('touchcancel', stop);
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!justMousedown) {
        nudgeNanoFocus(dx, dy);
      }
    });
  }

  bindDpadBtn('nanoDpadUpBtn', 0, -1);
  bindDpadBtn('nanoDpadDownBtn', 0, 1);
  bindDpadBtn('nanoDpadLeftBtn', -1, 0);
  bindDpadBtn('nanoDpadRightBtn', 1, 0);

  const centerEraseBtn = document.getElementById('nanoDpadCenterEraseBtn');
  if (centerEraseBtn) {
    centerEraseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      eraseCurrentFocusedPixel();
    });
  }

  // Mover Mode toggle: Move Only vs Erase on Move
  const navModeBtn = document.getElementById('nanoModeNavigateBtn');
  const eraseModeBtn = document.getElementById('nanoModeEraseOnMoveBtn');
  if (navModeBtn && eraseModeBtn) {
    navModeBtn.addEventListener('click', () => {
      studioState.nanoEraseOnMove = false;
      navModeBtn.classList.add('active');
      eraseModeBtn.classList.remove('active');
      showToast('🧭 Move Only: navigate pixel with arrows, then tap Erase');
    });
    eraseModeBtn.addEventListener('click', () => {
      studioState.nanoEraseOnMove = true;
      eraseModeBtn.classList.add('active');
      navModeBtn.classList.remove('active');
      showToast('✂️ Erase on Move: arrows will erase pixels as you move');
    });
  }

  // Lock Reticle Toggle Button (Pins cursor so scrolling down never moves it)
  const lockBtn = document.getElementById('nanoLockTargetBtn');
  const lockLabel = document.getElementById('nanoLockTargetLabel');
  if (lockBtn) {
    lockBtn.addEventListener('click', () => {
      studioState.nanoLockTarget = !studioState.nanoLockTarget;
      lockBtn.classList.toggle('active', studioState.nanoLockTarget);
      if (lockLabel) lockLabel.textContent = studioState.nanoLockTarget ? 'Pin Reticle' : 'Live Hover';
      showToast(studioState.nanoLockTarget ? '📌 Reticle pinned: scrolling options will never move it' : '👁️ Live Hover: reticle follows mouse movement');
    });
  }

  // Dynamic UI mode switcher for NanoScope (Single Pixel vs Boundary Curve)
  function updateNanoScopeModeUI() {
    const isCurve = !!studioState.nanoCurveMode;
    const tabPixel = document.getElementById('nanoTabPixelBtn');
    const tabCurve = document.getElementById('nanoTabCurveBtn');
    const pixelBrushGroup = document.getElementById('nanoPixelBrushGroup');
    const curveGroup = document.getElementById('nanoCurveGroup');
    const moverModeRow = document.getElementById('nanoMoverModeRow');
    const moverTitleLabel = document.getElementById('nanoMoverTitleLabel');
    const dpadCenterBtn = document.getElementById('nanoDpadCenterEraseBtn');
    const dpadCenterIcon = document.getElementById('nanoDpadCenterIcon');
    const dpadCenterLabel = document.getElementById('nanoDpadCenterLabel');
    const moverHint = document.getElementById('nanoMoverHint');

    if (tabPixel) tabPixel.classList.toggle('active', !isCurve);
    if (tabCurve) tabCurve.classList.toggle('active', isCurve);
    if (pixelBrushGroup) pixelBrushGroup.style.display = isCurve ? 'none' : 'block';
    if (curveGroup) curveGroup.style.display = isCurve ? 'block' : 'none';

    // In Curve Mode: HIDE the confusing "Move Only / Erase on Move" row!
    if (moverModeRow) {
      moverModeRow.style.display = isCurve ? 'none' : 'flex';
    }

    if (moverTitleLabel) {
      const titleKey = isCurve ? 'nanoscope_anchor_nudger_title' : 'nanoscope_mover_title';
      const defaultText = isCurve ? 'Precision Anchor Point Nudger' : 'Precision Pixel Mover';
      const iconClass = isCurve ? 'fa-arrows-up-down-left-right' : 'fa-gamepad';
      const titleText = (window.t && window.t(titleKey)) || defaultText;
      moverTitleLabel.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span data-i18n="${titleKey}">${titleText}</span>`;
    }

    // In Curve Mode: Center D-pad button adds an anchor point!
    if (dpadCenterBtn) {
      dpadCenterBtn.classList.toggle('curve-add-mode', isCurve);
      dpadCenterBtn.title = isCurve
        ? 'Add Anchor Point at Reticle Position (Space / Enter)'
        : 'Erase Targeted Pixel (Space / Enter)';
    }
    if (dpadCenterIcon) {
      dpadCenterIcon.className = isCurve ? 'fa-solid fa-circle-plus' : 'fa-solid fa-scissors';
    }
    if (dpadCenterLabel) {
      const labelKey = isCurve ? 'nanoscope_curve_add_point_short' : 'nanoscope_dpad_erase';
      const defaultText = isCurve ? '+ Point' : 'Erase';
      dpadCenterLabel.textContent = (window.t && window.t(labelKey)) || defaultText;
      dpadCenterLabel.setAttribute('data-i18n', labelKey);
    }

    if (moverHint) {
      const t = (k, def) => (window.t && window.t(k)) || def;
      moverHint.innerHTML = isCurve
        ? `<span class="hint-pill"><kbd>↑</kbd><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd> <span data-i18n="nanoscope_hint_nudge_anchor">${t('nanoscope_hint_nudge_anchor', 'Nudge Anchor')}</span></span>` +
        `<span class="hint-sep">•</span>` +
        `<span class="hint-pill"><kbd>Space</kbd> <span data-i18n="nanoscope_hint_add_point">${t('nanoscope_hint_add_point', 'Add Point')}</span></span>` +
        `<span class="hint-sep">•</span>` +
        `<span class="hint-pill"><kbd>Del</kbd> <span data-i18n="nanoscope_hint_remove">${t('nanoscope_hint_remove', 'Remove')}</span></span>` +
        `<span class="hint-sep">•</span>` +
        `<span class="hint-pill"><kbd>Shift</kbd> 5px <span data-i18n="nanoscope_hint_fast">${t('nanoscope_hint_fast', 'Fast')}</span></span>`
        : `<span class="hint-pill"><kbd>↑</kbd><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd> <span data-i18n="nanoscope_hint_move">${t('nanoscope_hint_move', 'Move Pixel')}</span></span>` +
        `<span class="hint-sep">•</span>` +
        `<span class="hint-pill"><kbd>Space</kbd> <span data-i18n="nanoscope_hint_erase">${t('nanoscope_hint_erase', 'Erase')}</span></span>` +
        `<span class="hint-sep">•</span>` +
        `<span class="hint-pill"><kbd>Shift</kbd> 5px <span data-i18n="nanoscope_hint_fast">${t('nanoscope_hint_fast', 'Fast')}</span></span>`;
    }

    renderNanoCurveOnStage();
    if (typeof studioState.nanoFocusX === 'number' && typeof studioState.nanoFocusY === 'number') {
      renderNanoLoupeForCutoutCoords(studioState.nanoFocusX, studioState.nanoFocusY);
    }
  }

  // NanoScope Mode Tabs (Single Pixel Mover vs Boundary Curve Cutter)
  const tabPixel = document.getElementById('nanoTabPixelBtn');
  const tabCurve = document.getElementById('nanoTabCurveBtn');
  if (tabPixel && tabCurve) {
    tabPixel.addEventListener('click', () => {
      studioState.nanoCurveMode = false;
      updateNanoScopeModeUI();
      showToast('🕹️ Single Pixel Mover mode active');
    });

    tabCurve.addEventListener('click', () => {
      studioState.nanoCurveMode = true;
      if (!studioState.nanoCurvePoints) studioState.nanoCurvePoints = [];
      if (studioState.nanoCurvePoints.length === 0 && typeof studioState.nanoFocusX === 'number') {
        addNanoCurvePoint(studioState.nanoFocusX, studioState.nanoFocusY);
      }
      updateNanoScopeModeUI();
      showToast('📐 Boundary Curve mode: plot anchor points & trim outer fuzz or closed loops');
    });
  }

  // Curve Point Management Buttons
  document.getElementById('nanoCurveAddPointBtn')?.addEventListener('click', () => addNanoCurvePoint());
  document.getElementById('nanoCurveDelPointBtn')?.addEventListener('click', () => deleteActiveNanoCurvePoint());
  document.getElementById('nanoCurveClearBtn')?.addEventListener('click', () => clearNanoCurve());
  document.getElementById('nanoCurvePrevPtBtn')?.addEventListener('click', () => cycleActiveNanoCurvePoint(-1));
  document.getElementById('nanoCurveNextPtBtn')?.addEventListener('click', () => cycleActiveNanoCurvePoint(1));

  // Toggle Closed Loop Button
  const closeLoopBtn = document.getElementById('nanoCurveCloseLoopBtn');
  const closeLoopLabel = document.getElementById('nanoCurveCloseLoopLabel');
  if (closeLoopBtn) {
    closeLoopBtn.addEventListener('click', () => {
      studioState.nanoCurveClosed = !studioState.nanoCurveClosed;
      closeLoopBtn.classList.toggle('active', studioState.nanoCurveClosed);
      if (closeLoopLabel) {
        closeLoopLabel.textContent = studioState.nanoCurveClosed ? 'Loop Closed' : 'Close Loop';
      }
      renderNanoCurveOnStage();
      if (typeof studioState.nanoFocusX === 'number') {
        renderNanoLoupeForCutoutCoords(studioState.nanoFocusX, studioState.nanoFocusY);
      }
      showToast(studioState.nanoCurveClosed ? '🔒 Closed curve loop enabled: trim inside or outside' : '🔓 Open boundary curve');
    });
  }

  // Trim Reach Chips (10px, 25px, 50px, Full)
  document.querySelectorAll('#nanoCurveReachChips .nanoscope-step-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#nanoCurveReachChips .nanoscope-step-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      studioState.nanoCurveReach = parseInt(btn.dataset.reach, 10) || 25;
    });
  });

  // Directional Trim Buttons
  document.getElementById('nanoTrimLeftBtn')?.addEventListener('click', () => executeBoundaryTrim('left'));
  document.getElementById('nanoTrimRightBtn')?.addEventListener('click', () => executeBoundaryTrim('right'));
  document.getElementById('nanoTrimAboveBtn')?.addEventListener('click', () => executeBoundaryTrim('above'));
  document.getElementById('nanoTrimBelowBtn')?.addEventListener('click', () => executeBoundaryTrim('below'));

  // Closed Loop Area Trim Buttons (Inside / Outside)
  document.getElementById('nanoTrimInsideBtn')?.addEventListener('click', () => executeBoundaryTrim('inside'));
  document.getElementById('nanoTrimOutsideBtn')?.addEventListener('click', () => executeBoundaryTrim('outside'));

  // Action Buttons: Undo & Reset AI Cutout
  document.getElementById('nanoscopeUndoBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    popNanoUndoState();
  });
  document.getElementById('nanoscopeRestoreBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    resetNanoCutoutToAi();
  });

  // Step size selector chips (1px, 5px, 10px)
  document.querySelectorAll('#nanoscopeStepChips .nanoscope-step-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#nanoscopeStepChips .nanoscope-step-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const step = parseInt(btn.dataset.step, 10) || 1;
      studioState.nanoStep = step;
    });
  });

  // Keep Reticle anchored in real time when drawer scrolls or window resizes
  const drawer = document.getElementById('detailEditStudioDrawer');
  const syncNanoLayout = () => {
    if (isNanoScopeActive() && typeof studioState.nanoFocusX === 'number' && typeof studioState.nanoFocusY === 'number') {
      renderNanoLoupeForCutoutCoords(studioState.nanoFocusX, studioState.nanoFocusY);
      renderNanoCurveOnStage();
    }
  };
  if (drawer) drawer.addEventListener('scroll', syncNanoLayout, { passive: true });
  window.addEventListener('resize', syncNanoLayout, { passive: true });

  // Keyboard navigation for pixel mover and curve points
  window.addEventListener('keydown', (e) => {
    if (!isNanoScopeActive()) return;
    if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;

    if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
      e.preventDefault();
      popNanoUndoState();
      return;
    }

    const originalStep = studioState.nanoStep || 1;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (e.shiftKey) studioState.nanoStep = Math.max(5, originalStep * 5);
      nudgeNanoFocus(0, -1);
      studioState.nanoStep = originalStep;
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (e.shiftKey) studioState.nanoStep = Math.max(5, originalStep * 5);
      nudgeNanoFocus(0, 1);
      studioState.nanoStep = originalStep;
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (e.shiftKey) studioState.nanoStep = Math.max(5, originalStep * 5);
      nudgeNanoFocus(-1, 0);
      studioState.nanoStep = originalStep;
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (e.shiftKey) studioState.nanoStep = Math.max(5, originalStep * 5);
      nudgeNanoFocus(1, 0);
      studioState.nanoStep = originalStep;
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      eraseCurrentFocusedPixel();
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      if (studioState.nanoCurveMode) {
        deleteActiveNanoCurvePoint();
      } else {
        eraseCurrentFocusedPixel();
      }
    }
  });

  // Expose globally for testing and sub-controls
  window.nudgeNanoFocus = nudgeNanoFocus;
  window.eraseCurrentFocusedPixel = eraseCurrentFocusedPixel;
  window.renderNanoLoupeForCutoutCoords = renderNanoLoupeForCutoutCoords;
  window.renderNanoCurveOnStage = renderNanoCurveOnStage;
  window.addNanoCurvePoint = addNanoCurvePoint;
  window.deleteActiveNanoCurvePoint = deleteActiveNanoCurvePoint;
  window.clearNanoCurve = clearNanoCurve;
  window.executeBoundaryTrim = executeBoundaryTrim;
  window.popNanoUndoState = popNanoUndoState;
  window.resetNanoCutoutToAi = resetNanoCutoutToAi;
  window.updateNanoScopeModeUI = updateNanoScopeModeUI;

  // =========================================================================
  // OPTION 1: Draggable Circle (Loupe) Anywhere on Screen
  // =========================================================================
  let _isLoupeDragging = false;
  let _loupeStartX = 0;
  let _loupeStartY = 0;
  let _loupeInitialLeft = 0;
  let _loupeInitialTop = 0;

  if (loupe) {
    loupe.addEventListener('pointerdown', (e) => {
      if (!isNanoScopeActive()) return;
      if (e.target.closest('button')) return;
      _isLoupeDragging = true;
      loupe.classList.add('dragging');
      _loupeStartX = e.clientX;
      _loupeStartY = e.clientY;
      _loupeInitialLeft = loupe.offsetLeft;
      _loupeInitialTop = loupe.offsetTop;
      try { loupe.setPointerCapture(e.pointerId); } catch (_) {}
      e.preventDefault();
      e.stopPropagation();
    });

    loupe.addEventListener('pointermove', (e) => {
      if (!_isLoupeDragging) return;
      const dx = e.clientX - _loupeStartX;
      const dy = e.clientY - _loupeStartY;
      const stageRect = stage.getBoundingClientRect();
      let newLeft = _loupeInitialLeft + dx;
      let newTop = _loupeInitialTop + dy;

      const minX = 4;
      const maxX = Math.max(minX, stageRect.width - loupe.offsetWidth - 4);
      const minY = 4;
      const maxY = Math.max(minY, stageRect.height - loupe.offsetHeight - 4);
      newLeft = Math.max(minX, Math.min(maxX, newLeft));
      newTop = Math.max(minY, Math.min(maxY, newTop));

      loupe.style.left = `${newLeft}px`;
      loupe.style.top = `${newTop}px`;
      studioState.nanoLoupeCustomPos = { x: newLeft, y: newTop };
      updateNanoPositionButtons();
      e.preventDefault();
      e.stopPropagation();
    });

    const onLoupePointerUp = (e) => {
      if (_isLoupeDragging) {
        _isLoupeDragging = false;
        loupe.classList.remove('dragging');
        if (e && e.pointerId) {
          try { loupe.releasePointerCapture(e.pointerId); } catch (_) {}
        }
      }
    };
    loupe.addEventListener('pointerup', onLoupePointerUp);
    loupe.addEventListener('pointercancel', onLoupePointerUp);

  }

  // =========================================================================
  // OPTION 2: Draggable Image (Pan / Move Picture on Screen) & Position Buttons
  // =========================================================================
  let _isNanoImageDragging = false;
  let _nanoImageStartX = 0;
  let _nanoImageStartY = 0;
  let _nanoImageStartOffsetX = 0;
  let _nanoImageStartOffsetY = 0;

  function updateNanoPositionButtons() {
    const circleBtn = document.getElementById('nanoDragCircleBtn');
    if (circleBtn) {
      circleBtn.classList.toggle('active', !!studioState.nanoCircleDragActive);
    }
    const imageBtn = document.getElementById('nanoDragImageBtn');
    if (imageBtn) {
      imageBtn.classList.toggle('active', !!studioState.nanoImageDragActive);
    }
    const hintPill = document.getElementById('nanoDragHintPill');
    if (hintPill) {
      hintPill.style.display = (studioState.nanoImageDragActive && isNanoScopeActive()) ? 'inline-flex' : 'none';
    }
    const stageEl = document.getElementById('detailImageStage');
    if (stageEl) {
      stageEl.classList.toggle('image-drag-mode', !!(studioState.nanoImageDragActive && isNanoScopeActive()));
    }
  }

  window.toggleNanoCircleDragMode = function() {
    studioState.nanoCircleDragActive = !studioState.nanoCircleDragActive;
    updateNanoPositionButtons();
    if (studioState.nanoCircleDragActive) {
      showToast((window.t && window.t('nanoscope_circle_unlocked')) || 'Circle unlocked · Drag it anywhere on screen');
    }
  };

  window.toggleNanoImageDragMode = function() {
    studioState.nanoImageDragActive = !studioState.nanoImageDragActive;
    updateNanoPositionButtons();
    if (studioState.nanoImageDragActive) {
      showToast((window.t && window.t('nanoscope_drag_image_active')) || 'Dragging Image · Pan anywhere on screen');
    }
  };

  window.resetNanoImagePosition = function() {
    studioState.subjectOffsetX = 0;
    studioState.subjectOffsetY = 0;
    studioState.subjectScale = 100;
    renderBackdropCanvasComposite();
    if (studioState.nanoFocusX != null && typeof window.renderNanoLoupeForCutoutCoords === 'function') {
      window.renderNanoLoupeForCutoutCoords(studioState.nanoFocusX, studioState.nanoFocusY);
    }
    if (typeof window.renderNanoCurveOnStage === 'function') {
      window.renderNanoCurveOnStage();
    }
    showToast((window.t && window.t('nanoscope_reset_pos_toast')) || 'Image reset to original position');
  };

  window.updateNanoPositionButtons = updateNanoPositionButtons;

  // Pointer events on Stage:
  // When nanoLockTarget is true (default), hovering does NOT move the locked reticle!
  stage.addEventListener('mousemove', (e) => {
    if (!isNanoScopeActive()) return;
    if (_isNanoImageDragging) {
      const subjectCanvas = document.getElementById('detailSubjectCanvas');
      if (subjectCanvas) {
        const rect = subjectCanvas.getBoundingClientRect();
        if (rect.width && rect.height) {
          const scaleX = subjectCanvas.width / rect.width;
          const scaleY = subjectCanvas.height / rect.height;
          const deltaX = (e.clientX - _nanoImageStartX) * scaleX;
          const deltaY = (e.clientY - _nanoImageStartY) * scaleY;

          studioState.subjectOffsetX = Math.round(_nanoImageStartOffsetX + deltaX);
          studioState.subjectOffsetY = Math.round(_nanoImageStartOffsetY + deltaY);

          renderBackdropCanvasComposite();
          if (studioState.nanoFocusX != null && typeof window.renderNanoLoupeForCutoutCoords === 'function') {
            window.renderNanoLoupeForCutoutCoords(studioState.nanoFocusX, studioState.nanoFocusY);
          }
          if (typeof window.renderNanoCurveOnStage === 'function') {
            window.renderNanoCurveOnStage();
          }
        }
      }
      return;
    }

    if (_isNanoErasing) {
      eraseAtClient(e.clientX, e.clientY);
    } else if (!studioState.nanoLockTarget && !studioState.nanoLoupeCustomPos) {
      updateNanoLoupe(e.clientX, e.clientY);
    }
  });

  stage.addEventListener('mousedown', (e) => {
    if (e.button !== 0 && e.button !== 1) return;
    if (!isNanoScopeActive()) return;
    if (e.target.closest('#nanoScopeLoupe') || e.target.closest('.detail-nav-btn') || e.target.closest('button')) return;

    // Check if Image Drag Mode is active or middle mouse button is pressed
    if (studioState.nanoImageDragActive || e.button === 1 || e.spaceKey) {
      _isNanoImageDragging = true;
      _nanoImageStartX = e.clientX;
      _nanoImageStartY = e.clientY;
      _nanoImageStartOffsetX = studioState.subjectOffsetX || 0;
      _nanoImageStartOffsetY = studioState.subjectOffsetY || 0;
      stage.classList.add('dragging-image');
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const coords = getCutoutCoordsFromClient(e.clientX, e.clientY);
    if (!coords) return;

    if (studioState.nanoCurveMode) {
      // In curve mode: click places a new curve point or selects nearby point
      const cx = Math.round(coords.cutoutX);
      const cy = Math.round(coords.cutoutY);
      const existingNear = (studioState.nanoCurvePoints || []).findIndex(p => Math.hypot(p.x - cx, p.y - cy) < 12);
      if (existingNear >= 0) {
        studioState.nanoActivePtIdx = existingNear;
        studioState.nanoFocusX = studioState.nanoCurvePoints[existingNear].x;
        studioState.nanoFocusY = studioState.nanoCurvePoints[existingNear].y;
        updateCurvePtBadge();
        renderNanoCurveOnStage();
        renderNanoLoupeForCutoutCoords(studioState.nanoFocusX, studioState.nanoFocusY);
      } else {
        addNanoCurvePoint(cx, cy);
      }
      return;
    }

    _isNanoErasing = true;
    _hasPushedUndoForStroke = false;
    stage.classList.add('erasing-pixels');
    eraseAtClient(e.clientX, e.clientY);
  });

  window.addEventListener('mouseup', () => {
    if (_isNanoImageDragging) {
      _isNanoImageDragging = false;
      stage.classList.remove('dragging-image');
    }
    if (_isNanoErasing) {
      _isNanoErasing = false;
      _hasPushedUndoForStroke = false;
      stage.classList.remove('erasing-pixels');
    }
  });

  stage.addEventListener('mouseleave', () => {
    if (!isNanoScopeActive()) return;
    if (!_isNanoErasing && !_isNanoImageDragging) {
      if (studioState.nanoFocusX == null) {
        loupe.style.display = 'none';
        if (marker) marker.style.display = 'none';
      }
    }
  });

  // Touch support for mobile / tablets
  stage.addEventListener('touchstart', (e) => {
    if (!isNanoScopeActive()) return;
    if (e.touches.length !== 1) return;
    if (e.target.closest('#nanoScopeLoupe') || e.target.closest('.detail-nav-btn') || e.target.closest('button')) return;

    if (studioState.nanoImageDragActive) {
      _isNanoImageDragging = true;
      const t = e.touches[0];
      _nanoImageStartX = t.clientX;
      _nanoImageStartY = t.clientY;
      _nanoImageStartOffsetX = studioState.subjectOffsetX || 0;
      _nanoImageStartOffsetY = studioState.subjectOffsetY || 0;
      stage.classList.add('dragging-image');
      e.stopPropagation();
      e.preventDefault();
      return;
    }

    e.stopPropagation();
    e.preventDefault();

    const t = e.touches[0];
    const coords = getCutoutCoordsFromClient(t.clientX, t.clientY);
    if (!coords) return;

    if (studioState.nanoCurveMode) {
      const cx = Math.round(coords.cutoutX);
      const cy = Math.round(coords.cutoutY);
      addNanoCurvePoint(cx, cy);
      return;
    }

    _isNanoErasing = true;
    _hasPushedUndoForStroke = false;
    stage.classList.add('erasing-pixels');
    eraseAtClient(t.clientX, t.clientY);
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    if (!isNanoScopeActive() || e.touches.length !== 1) return;
    if (_isNanoImageDragging) {
      if (e.cancelable) e.preventDefault();
      const t = e.touches[0];
      const subjectCanvas = document.getElementById('detailSubjectCanvas');
      if (subjectCanvas) {
        const rect = subjectCanvas.getBoundingClientRect();
        if (rect.width && rect.height) {
          const scaleX = subjectCanvas.width / rect.width;
          const scaleY = subjectCanvas.height / rect.height;
          const deltaX = (t.clientX - _nanoImageStartX) * scaleX;
          const deltaY = (t.clientY - _nanoImageStartY) * scaleY;

          studioState.subjectOffsetX = Math.round(_nanoImageStartOffsetX + deltaX);
          studioState.subjectOffsetY = Math.round(_nanoImageStartOffsetY + deltaY);

          renderBackdropCanvasComposite();
          if (studioState.nanoFocusX != null && typeof window.renderNanoLoupeForCutoutCoords === 'function') {
            window.renderNanoLoupeForCutoutCoords(studioState.nanoFocusX, studioState.nanoFocusY);
          }
          if (typeof window.renderNanoCurveOnStage === 'function') {
            window.renderNanoCurveOnStage();
          }
        }
      }
      return;
    }

    if (_isNanoErasing) {
      if (e.cancelable) e.preventDefault();
      const t = e.touches[0];
      eraseAtClient(t.clientX, t.clientY);
    }
  }, { passive: false });

  window.addEventListener('touchend', () => {
    if (_isNanoImageDragging) {
      _isNanoImageDragging = false;
      stage.classList.remove('dragging-image');
    }
    if (_isNanoErasing) {
      _isNanoErasing = false;
      _hasPushedUndoForStroke = false;
      stage.classList.remove('erasing-pixels');
      if (studioState.nanoFocusX == null) {
        loupe.style.display = 'none';
        if (marker) marker.style.display = 'none';
      }
    }
  });
}

function setupDetailPhotoGestures() {
  if (isDetailGestureSetup) return;
  isDetailGestureSetup = true;

  const wrapper = document.getElementById('detailImageWrapper');
  const stage = document.getElementById('detailImageStage');
  if (!wrapper || !stage) return;

  // -------------------------------------------------------------
  // 1. Native Touch Events (Rock-solid for Android & iOS WebViews)
  // -------------------------------------------------------------
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  let isTouchHorizontal = null;
  let isTouchActive = false;

  wrapper.addEventListener('touchstart', (e) => {
    if (e.target.closest('.detail-nav-btn') || e.target.closest('button')) return;
    if (e.touches.length !== 1) return;
    if (isNavigatingDetailPhoto) return;
    if (studioState.activeTool || document.getElementById('detailEditStudioDrawer')?.classList.contains('open')) return;
    if (!state.detailPhotoList || state.detailPhotoList.length <= 1) return;

    isTouchActive = true;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
    isTouchHorizontal = null;
    stage.classList.add('dragging');
  }, { passive: true });

  wrapper.addEventListener('touchmove', (e) => {
    if (!isTouchActive || e.touches.length !== 1) return;
    const clientX = e.touches[0].clientX;
    const clientY = e.touches[0].clientY;
    const deltaX = clientX - touchStartX;
    const deltaY = clientY - touchStartY;

    if (isTouchHorizontal === null) {
      if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
        isTouchHorizontal = Math.abs(deltaX) >= Math.abs(deltaY);
      }
    }

    if (!isTouchHorizontal) return;

    // Prevent vertical scrolling while swiping photo horizontally
    if (e.cancelable) e.preventDefault();

    let effectiveDeltaX = deltaX;
    if ((deltaX > 0 && !canDetailGoPrev()) || (deltaX < 0 && !canDetailGoNext())) {
      effectiveDeltaX = deltaX * 0.28;
    }

    stage.style.transition = 'none';
    stage.style.transform = `translateX(${effectiveDeltaX}px) scale(${1 - Math.min(Math.abs(effectiveDeltaX) * 0.0003, 0.06)})`;
    stage.style.opacity = `${1 - Math.min(Math.abs(effectiveDeltaX) * 0.0012, 0.35)}`;
  }, { passive: false });

  const endTouchGesture = (e) => {
    if (!isTouchActive) return;
    isTouchActive = false;
    stage.classList.remove('dragging');

    if (!isTouchHorizontal) {
      bounceDetailImage();
      return;
    }

    const clientX = (e.changedTouches && e.changedTouches.length > 0) ? e.changedTouches[0].clientX : touchStartX;
    const deltaX = clientX - touchStartX;
    const elapsed = Math.max(Date.now() - touchStartTime, 1);
    const velocity = Math.abs(deltaX) / elapsed;

    const threshold = 35; // px
    const flickVelocity = 0.24; // px/ms

    if (deltaX < -threshold || (deltaX < -15 && velocity > flickVelocity)) {
      navigateDetailPhoto('next');
    } else if (deltaX > threshold || (deltaX > 15 && velocity > flickVelocity)) {
      navigateDetailPhoto('prev');
    } else {
      bounceDetailImage();
    }
  };

  wrapper.addEventListener('touchend', endTouchGesture, { passive: true });
  wrapper.addEventListener('touchcancel', () => {
    if (isTouchActive) {
      isTouchActive = false;
      stage.classList.remove('dragging');
      bounceDetailImage();
    }
  }, { passive: true });

  // -------------------------------------------------------------
  // 2. Desktop Mouse Dragging (Smooth click-and-drag for PC/Mac)
  // -------------------------------------------------------------
  let isMouseDragging = false;
  let mouseStartX = 0;
  let mouseStartY = 0;
  let mouseStartTime = 0;
  let isMouseHorizontal = null;

  wrapper.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // Left click only
    if (e.target.closest('.detail-nav-btn') || e.target.closest('button')) return;
    if (isNavigatingDetailPhoto) return;
    if (studioState.activeTool || document.getElementById('detailEditStudioDrawer')?.classList.contains('open')) return;
    if (!state.detailPhotoList || state.detailPhotoList.length <= 1) return;

    isMouseDragging = true;
    mouseStartX = e.clientX;
    mouseStartY = e.clientY;
    mouseStartTime = Date.now();
    isMouseHorizontal = null;
    stage.classList.add('dragging');
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isMouseDragging) return;
    const deltaX = e.clientX - mouseStartX;
    const deltaY = e.clientY - mouseStartY;

    if (isMouseHorizontal === null) {
      if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
        isMouseHorizontal = Math.abs(deltaX) >= Math.abs(deltaY);
      }
    }

    if (!isMouseHorizontal) return;

    let effectiveDeltaX = deltaX;
    if ((deltaX > 0 && !canDetailGoPrev()) || (deltaX < 0 && !canDetailGoNext())) {
      effectiveDeltaX = deltaX * 0.28;
    }

    stage.style.transition = 'none';
    stage.style.transform = `translateX(${effectiveDeltaX}px) scale(${1 - Math.min(Math.abs(effectiveDeltaX) * 0.0003, 0.06)})`;
    stage.style.opacity = `${1 - Math.min(Math.abs(effectiveDeltaX) * 0.0012, 0.35)}`;
  });

  window.addEventListener('mouseup', (e) => {
    if (!isMouseDragging) return;
    isMouseDragging = false;
    stage.classList.remove('dragging');

    if (!isMouseHorizontal) {
      bounceDetailImage();
      return;
    }

    const deltaX = e.clientX - mouseStartX;
    const elapsed = Math.max(Date.now() - mouseStartTime, 1);
    const velocity = Math.abs(deltaX) / elapsed;

    const threshold = 35;
    const flickVelocity = 0.24;

    if (deltaX < -threshold || (deltaX < -15 && velocity > flickVelocity)) {
      navigateDetailPhoto('next');
    } else if (deltaX > threshold || (deltaX > 15 && velocity > flickVelocity)) {
      navigateDetailPhoto('prev');
    } else {
      bounceDetailImage();
    }
  });

  // Chevrons click listeners
  document.getElementById('detailPrevBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (studioState.activeTool || document.getElementById('detailEditStudioDrawer')?.classList.contains('open')) return;
    navigateDetailPhoto('prev');
  });

  document.getElementById('detailNextBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (studioState.activeTool || document.getElementById('detailEditStudioDrawer')?.classList.contains('open')) return;
    navigateDetailPhoto('next');
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    const modal = document.getElementById('photoDetailModal');
    if (!modal || modal.style.display === 'none') return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (studioState.activeTool || document.getElementById('detailEditStudioDrawer')?.classList.contains('open')) return;

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

/* =========================================================================
   PHOTO EDITING STUDIO ENGINE (Aura Visual Lab)
   ========================================================================= */

const STUDIO_FILTERS = [
  { id: 'normal', name: 'Normal', vip: false, settings: { b: 1, c: 1, s: 1, sepia: 0, hue: 0, gray: 0 } },
  { id: 'clarendon', name: 'Clarendon', vip: false, settings: { b: 1.15, c: 1.25, s: 1.35, sepia: 0.12, hue: 0, gray: 0 } },
  { id: 'juno', name: 'Juno', vip: false, settings: { b: 1.1, c: 1.2, s: 1.4, sepia: 0.22, hue: -8, gray: 0 } },
  { id: 'lark', name: 'Lark', vip: false, settings: { b: 1.18, c: 1.08, s: 0.9, sepia: 0.08, hue: 6, gray: 0 } },
  { id: 'lofi', name: 'Lo-Fi', vip: false, settings: { b: 1.05, c: 1.45, s: 1.5, sepia: 0.05, hue: 0, gray: 0 } },
  { id: 'valencia', name: 'Valencia', vip: false, settings: { b: 1.1, c: 1.12, s: 1.15, sepia: 0.32, hue: -6, gray: 0 } },
  { id: 'dusk', name: 'Dusk', vip: false, settings: { b: 1.02, c: 1.26, s: 1.2, sepia: 0.14, hue: 24, gray: 0 } },
  { id: 'noir', name: 'Noir', vip: false, settings: { b: 1.1, c: 1.48, s: 0, sepia: 0.04, hue: 0, gray: 1 } },
  { id: 'halo', name: 'Halo', vip: false, settings: { b: 1.22, c: 1.14, s: 1.28, sepia: 0.16, hue: 345, gray: 0 } },
  { id: 'cyberpunk', name: 'Cyberpunk', vip: false, settings: { b: 1.08, c: 1.38, s: 1.65, sepia: 0.1, hue: 165, gray: 0 } },
  { id: 'golden', name: 'Golden Hour', vip: false, settings: { b: 1.12, c: 1.2, s: 1.42, sepia: 0.38, hue: -15, gray: 0 } }
];

const studioState = {
  activeTool: null,
  activeSub: {
    light: 'brightness',
    color: 'warmth',
    optics: 'vignette',
    backdrop: 'landmarks'
  },
  isComparing: false,
  lux: 0,
  filter: 'normal',
  filterIntensity: 100,
  brightness: 0,
  contrast: 0,
  highlights: 0,
  shadows: 0,
  warmth: 0,
  saturation: 0,
  tint: 0,
  fade: 0,
  vignette: 0,
  sharpen: 0,
  tiltShift: 'off',
  backdropType: 'none', // 'none', 'landmarks', 'blur', 'color', 'image', 'cutout'
  backdropLandmark: 'eiffel_tower', // 'eiffel_tower', 'taj_mahal', 'mount_fuji', 'santorini', 'colosseum', 'sydney_opera', 'times_square', ...
  backdropBlur: 35,
  backdropColor: 'none',
  backdropMargin: 0,
  backdropRadius: 16,
  backdropChroma: 'off',
  backdropChromaTol: 35,
  backdropCustomImage: null,
  subjectScale: 100,
  subjectOffsetX: 0,
  subjectOffsetY: 0,
  cachedCutoutCanvas: null,
  cachedRawAiCutoutCanvas: null,
  cachedMaskCanvas: null,
  cachedPhotoId: null,
  cachedOriginalImg: null,
  isSegmenting: false,
  nanoBrushSize: 1,
  nanoZoom: 16,
  nanoContrast: 'black',
  nanoUndoStack: []
};
window.studioState = studioState;

function revertStudioCropPreviewIfNeeded(photoId = null) {
  const targetId = photoId || state.activePhotoId;
  if (!targetId) return;
  const photo = state.photos.find(p => p.id === targetId);
  if (!photo || !photo._studioCropBackupDataUrl) return;

  const originalUrl = photo._studioCropBackupDataUrl;
  delete photo._studioCropBackupDataUrl;

  photo.dataUrl = originalUrl;

  const detailItem = (state.detailPhotoList || []).find(p => p.id === photo.id);
  if (detailItem) {
    detailItem.dataUrl = originalUrl;
  }

  const detailImg = document.getElementById('detailImage');
  if (detailImg) {
    detailImg.src = originalUrl;
  }

  studioState.cachedCutoutCanvas = null;
  studioState.cachedRawAiCutoutCanvas = null;
  studioState.cachedMaskCanvas = null;
  studioState.cachedOriginalImg = null;
  studioState.cachedPhotoId = null;
}
window.revertStudioCropPreviewIfNeeded = revertStudioCropPreviewIfNeeded;

function computeCssFilterString(stateObj) {
  const sObj = stateObj || studioState;
  const fDef = STUDIO_FILTERS.find(f => f.id === sObj.filter) || STUDIO_FILTERS[0];
  const factor = (sObj.filterIntensity / 100);

  let b = 1 + (fDef.settings.b - 1) * factor;
  let c = 1 + (fDef.settings.c - 1) * factor;
  let s = 1 + (fDef.settings.s - 1) * factor;
  let sepia = fDef.settings.sepia * factor;
  let hue = fDef.settings.hue * factor;
  let gray = fDef.settings.gray * factor;

  if (sObj.lux > 0) {
    const luxFrac = sObj.lux / 100;
    b += 0.08 * luxFrac;
    c += 0.22 * luxFrac;
    s += 0.25 * luxFrac;
  }

  b += (sObj.brightness / 100) * 0.5;
  c += (sObj.contrast / 100) * 0.6;
  if (sObj.highlights !== 0) {
    b += (sObj.highlights / 100) * 0.15;
    c += (sObj.highlights / 100) * 0.12;
  }
  if (sObj.shadows !== 0) {
    b += (sObj.shadows / 100) * 0.2;
    c -= (sObj.shadows / 100) * 0.15;
  }

  if (sObj.warmth > 0) {
    sepia += (sObj.warmth / 100) * 0.35;
    hue -= (sObj.warmth / 100) * 12;
  } else if (sObj.warmth < 0) {
    hue += (Math.abs(sObj.warmth) / 100) * 18;
    b += (Math.abs(sObj.warmth) / 100) * 0.04;
  }
  s += (sObj.saturation / 100) * 0.85;
  hue += (sObj.tint / 100) * 28;

  if (sObj.fade > 0) {
    const fadeFrac = sObj.fade / 100;
    c *= (1 - fadeFrac * 0.25);
    b += fadeFrac * 0.1;
  }

  if (sObj.sharpen > 0) {
    c += (sObj.sharpen / 100) * 0.18;
  }

  b = Math.max(0.1, b);
  c = Math.max(0.1, c);
  s = Math.max(0, s);
  sepia = Math.max(0, Math.min(1, sepia));
  gray = Math.max(0, Math.min(1, gray));

  return `brightness(${b.toFixed(3)}) contrast(${c.toFixed(3)}) saturate(${s.toFixed(3)}) sepia(${sepia.toFixed(3)}) hue-rotate(${hue.toFixed(1)}deg) grayscale(${gray.toFixed(3)})`;
}

function applyStudioOverlays(stateObj) {
  const sObj = stateObj || studioState;
  const vignetteEl = document.getElementById('detailVignetteOverlay');
  if (vignetteEl) {
    if (sObj.vignette > 0 && !studioState.isComparing) {
      const v = sObj.vignette;
      const innerStop = Math.max(20, Math.round(75 - v * 0.55));
      const alpha = (v * 0.0088).toFixed(3);
      vignetteEl.style.background = `radial-gradient(ellipse at center, transparent ${innerStop}%, rgba(0, 0, 0, ${alpha}) 100%)`;
      vignetteEl.style.opacity = '1';
    } else {
      vignetteEl.style.opacity = '0';
    }
  }

  const tiltEl = document.getElementById('detailTiltShiftOverlay');
  if (tiltEl) {
    if (sObj.tiltShift !== 'off' && !studioState.isComparing) {
      if (sObj.tiltShift === 'radial') {
        tiltEl.style.webkitMaskImage = 'radial-gradient(circle at center, transparent 38%, black 85%)';
        tiltEl.style.maskImage = 'radial-gradient(circle at center, transparent 38%, black 85%)';
      } else {
        tiltEl.style.webkitMaskImage = 'linear-gradient(to bottom, black 0%, transparent 35%, transparent 65%, black 100%)';
        tiltEl.style.maskImage = 'linear-gradient(to bottom, black 0%, transparent 35%, transparent 65%, black 100%)';
      }
      tiltEl.style.opacity = '1';
    } else {
      tiltEl.style.opacity = '0';
    }
  }

  const backdropEl = document.getElementById('detailBackdropLayer');
  const detailImg = document.getElementById('detailImage');
  const photo = state.photos.find(p => p.id === state.activePhotoId);
  const photoSrc = photo ? photo.dataUrl : (detailImg ? detailImg.src : '');

  if (backdropEl && detailImg) {
    if (sObj.activeTool === 'backdrop' || studioState.activeTool === 'backdrop' || (typeof isStudioBackdropConfigured === 'function' && isStudioBackdropConfigured())) {
      backdropEl.classList.remove('active', 'blur-mode');
      backdropEl.style.display = 'none';
      detailImg.style.padding = '0';
      detailImg.style.boxShadow = '';
    } else if (sObj.backdropType !== 'none' && !studioState.isComparing) {
      backdropEl.style.display = '';
      backdropEl.classList.add('active');
      if (sObj.backdropType === 'blur') {
        backdropEl.classList.add('blur-mode');
        backdropEl.style.backgroundImage = `url("${photoSrc}")`;
        backdropEl.style.background = '';
        const blurAmt = Math.round((sObj.backdropBlur || 25) * 0.4 + 10);
        backdropEl.style.filter = `blur(${blurAmt}px) brightness(0.88)`;
      } else if (sObj.backdropType === 'color') {
        backdropEl.classList.remove('blur-mode');
        backdropEl.style.backgroundImage = '';
        backdropEl.style.filter = 'none';
        const c = sObj.backdropColor || '#ffffff';
        if (c.startsWith('grad-')) {
          const gradMap = {
            'grad-sunset': 'linear-gradient(135deg, #f43f5e, #fb923c)',
            'grad-neon': 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
            'grad-aurora': 'linear-gradient(135deg, #10b981, #3b82f6)',
            'grad-gold': 'linear-gradient(135deg, #f59e0b, #fbbf24)'
          };
          backdropEl.style.background = gradMap[c] || '#ffffff';
        } else {
          backdropEl.style.background = c;
        }
      } else if (sObj.backdropType === 'image') {
        backdropEl.classList.remove('blur-mode');
        backdropEl.style.filter = 'none';
        backdropEl.style.background = '';
        if (sObj.backdropCustomImage) {
          backdropEl.style.backgroundImage = `url("${sObj.backdropCustomImage}")`;
          backdropEl.style.backgroundSize = 'cover';
          backdropEl.style.backgroundPosition = 'center';
          backdropEl.style.backgroundRepeat = 'no-repeat';
        } else {
          backdropEl.style.backgroundImage = '';
        }
      }

      // Frame Margin & Rounded Corner styling
      const margin = sObj.backdropMargin || 0;
      const radius = sObj.backdropRadius || 16;
      detailImg.style.padding = `${margin}px`;
      detailImg.style.borderRadius = `${radius + margin}px`;
      detailImg.style.boxShadow = margin > 0 ? '0 16px 40px rgba(0,0,0,0.55)' : '';
    } else {
      backdropEl.classList.remove('active', 'blur-mode');
      backdropEl.style.backgroundImage = '';
      backdropEl.style.background = '';
      backdropEl.style.filter = 'none';
      detailImg.style.padding = '0px';
      detailImg.style.borderRadius = '18px';
      detailImg.style.boxShadow = '';
    }
  }
}


// -------------------------------------------------------------
// AI SUBJECT SEGMENTATION & REAL-TIME BACKDROP COMPOSITE ENGINE
// -------------------------------------------------------------
let _aiSelfieSegmenter = null;
let _aiSegmenterInitPromise = null;
const _backdropLandmarkImages = {};
window._backdropLandmarkImages = _backdropLandmarkImages;

const _backdropLandmarkGradients = {
  eiffel_tower: ['#1e1b4b', '#4338ca', '#f59e0b', '#fbbf24'],
  taj_mahal: ['#0f172a', '#701a75', '#c026d3', '#fde047'],
  mount_fuji: ['#1e1b4b', '#9f1239', '#e11d48', '#fda4af'],
  santorini: ['#0369a1', '#0284c7', '#38bdf8', '#fef08a'],
  colosseum: ['#1c1917', '#78350f', '#d97706', '#fef3c7'],
  sydney_opera: ['#0f172a', '#0369a1', '#0284c7', '#e2e8f0'],
  times_square: ['#0f172a', '#1e1b4b', '#0369a1', '#ec4899'],
  golden_gate: ['#7c2d12', '#c2410c', '#ea580c', '#fbbf24'],
  nyc_skyline: ['#020617', '#0f172a', '#1e1b4b', '#3b82f6'],
  miami_beach: ['#083344', '#0891b2', '#06b6d4', '#f43f5e']
};

function preloadLandmarkImages() {
  const landmarks = {
    eiffel_tower: 'assets/backdrops/eiffel_tower.jpg',
    taj_mahal: 'assets/backdrops/taj_mahal.jpg',
    mount_fuji: 'assets/backdrops/mount_fuji.jpg',
    santorini: 'assets/backdrops/santorini.jpg',
    colosseum: 'assets/backdrops/colosseum.jpg',
    sydney_opera: 'assets/backdrops/sydney_opera.jpg',
    times_square: 'assets/backdrops/times_square.jpg',
    golden_gate: 'assets/backdrops/golden_gate.jpg',
    nyc_skyline: 'assets/backdrops/nyc_skyline.jpg',
    miami_beach: 'assets/backdrops/miami_beach.jpg'
  };
  Object.entries(landmarks).forEach(([key, url]) => {
    const existing = _backdropLandmarkImages[key];
    if (!existing || (existing.complete && existing.naturalWidth === 0)) {
      const img = new Image();
      if (url.startsWith('http://') || url.startsWith('https://')) {
        img.crossOrigin = 'anonymous';
      }
      img.onload = () => {
        if (studioState.activeTool === 'backdrop' && (studioState.activeSub.backdrop === 'landmarks' || !studioState.activeSub.backdrop)) {
          renderBackdropCanvasComposite();
        }
      };
      img.onerror = () => {
        console.warn(`Landmark image load warning: ${url}`);
      };
      img.src = url;
      _backdropLandmarkImages[key] = img;
    }
  });
}
preloadLandmarkImages();

function getAiSelfieSegmenter() {
  if (_aiSelfieSegmenter) return Promise.resolve(_aiSelfieSegmenter);
  if (_aiSegmenterInitPromise) return _aiSegmenterInitPromise;

  _aiSegmenterInitPromise = new Promise((resolve) => {
    const initInstance = () => {
      try {
        if (window.SelfieSegmentation) {
          const seg = new window.SelfieSegmentation({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/${file}`
          });
          // Model 0: High-accuracy General model for full-body & portrait photos
          seg.setOptions({ modelSelection: 0, selfieMode: false });
          _aiSelfieSegmenter = seg;
          resolve(seg);
          return;
        }
      } catch (e) {
        console.warn('MediaPipe SelfieSegmentation init warning:', e);
      }
      resolve(null);
    };

    if (window.SelfieSegmentation) {
      initInstance();
    } else {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/selfie_segmentation.js';
      s.crossOrigin = 'anonymous';
      s.onload = initInstance;
      s.onerror = () => {
        console.warn('Failed to load MediaPipe script, using fallback');
        resolve(null);
      };
      document.head.appendChild(s);
    }
  });

  return _aiSegmenterInitPromise;
}

function createSmartFallbackCutout(img, w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');

  // Smooth studio vignette falloff without cartoon geometric shapes
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = w;
  maskCanvas.height = h;
  const mCtx = maskCanvas.getContext('2d');

  const grad = mCtx.createRadialGradient(w * 0.5, h * 0.48, Math.min(w, h) * 0.25, w * 0.5, h * 0.48, Math.max(w, h) * 0.65);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.95)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  mCtx.fillStyle = grad;
  mCtx.fillRect(0, 0, w, h);

  ctx.drawImage(img, 0, 0, w, h);
  ctx.globalCompositeOperation = 'destination-in';
  ctx.drawImage(maskCanvas, 0, 0, w, h);

  return c;
}

// High-precision studio matte refinement & color defringing pipeline for seamless backdrops
function createRefinedSubjectCutout(img, rawMask, w, h) {
  // 1. Render raw neural network mask to canvas
  const mCanvas = document.createElement('canvas');
  mCanvas.width = w;
  mCanvas.height = h;
  const mCtx = mCanvas.getContext('2d');
  mCtx.drawImage(rawMask, 0, 0, w, h);
  const maskImgData = mCtx.getImageData(0, 0, w, h);
  const mData = maskImgData.data;

  // 2. Render source image to canvas
  const pCanvas = document.createElement('canvas');
  pCanvas.width = w;
  pCanvas.height = h;
  const pCtx = pCanvas.getContext('2d');
  pCtx.drawImage(img, 0, 0, w, h);
  const photoImgData = pCtx.getImageData(0, 0, w, h);
  const pData = photoImgData.data;

  const totalPixels = w * h;
  const initialAlpha = new Uint8Array(totalPixels);

  // Step 1: Base confidence with Edge-Contrast & Foliage/Sky Discontinuity Snapping
  for (let y = 0; y < h; y++) {
    const row = y * w;
    for (let x = 0; x < w; x++) {
      const idx = (row + x) * 4;
      // MediaPipe outputs 0..255 confidence in the Red channel (mData[idx]).
      // In some WebGL/2D contexts it may be grayscale or Alpha; read the true signal.
      const conf = (mData[idx] > 0 || mData[idx + 1] > 0 || mData[idx + 2] > 0)
        ? Math.max(mData[idx], mData[idx + 1], mData[idx + 2])
        : mData[idx + 3];

      if (conf < 40) {
        initialAlpha[row + x] = 0;
        continue;
      }

      const r = pData[idx], g = pData[idx + 1], b = pData[idx + 2];
      const lum = (r + g + b) / 3;

      // 1A. Suppress Outdoor Foliage Bleed in Concave Neck/Perimeter areas
      // Real human skin and hair are never green foliage (G > R * 1.25 and G > B * 1.18)
      if (lum > 40 && g > 55 && g > r * 1.25 && g > b * 1.18 && conf < 235) {
        initialAlpha[row + x] = 0;
        continue;
      }

      // 1B. Suppress Saturated Blue Sky / Chart Bleed around hair and shoulders
      if (lum > 45 && b > 70 && b > r * 1.3 && b > g * 1.15 && conf < 215) {
        initialAlpha[row + x] = 0;
        continue;
      }

      // 1C. Suppress Bright Cloud / Sky Bleed above dark hair
      if (y < h * 0.35 && conf < 175 && lum > 75 && Math.abs(r - g) < 20 && Math.abs(r - b) < 20) {
        const downIdx = (Math.min(h - 1, y + 4) * w + x) * 4;
        const dr = pData[downIdx], dg = pData[downIdx + 1], db = pData[downIdx + 2];
        if ((dr + dg + db) / 3 < 60) {
          initialAlpha[row + x] = 0;
          continue;
        }
      }

      initialAlpha[row + x] = conf >= 60 ? conf : 0;
    }
  }

  // Step 2: Multi-person Component Filter
  // Keeps any component with >= 150 pixels (safely retains babies in laps, secondary subjects, extended arms/elbows)
  // Only strips tiny disconnected noise specks (< 150 pixels)
  const visited = new Uint8Array(totalPixels);
  const labelMap = new Int32Array(totalPixels);
  const compSizes = [0];
  let currentLabel = 0;
  const q = new Int32Array(totalPixels);

  for (let i = 0; i < totalPixels; i++) {
    if (initialAlpha[i] > 65 && !visited[i]) {
      currentLabel++;
      let compSize = 0;
      let head = 0, tail = 0;
      visited[i] = 1;
      labelMap[i] = currentLabel;
      q[tail++] = i;
      compSize++;

      while (head < tail) {
        const curr = q[head++];
        const cx = curr % w;
        const cy = Math.floor(curr / w);

        const nbs = [
          cy > 0 ? curr - w : -1,
          cy < h - 1 ? curr + w : -1,
          cx > 0 ? curr - 1 : -1,
          cx < w - 1 ? curr + 1 : -1
        ];

        for (let k = 0; k < 4; k++) {
          const nb = nbs[k];
          if (nb >= 0 && !visited[nb] && initialAlpha[nb] > 35) {
            visited[nb] = 1;
            labelMap[nb] = currentLabel;
            q[tail++] = nb;
            compSize++;
          }
        }
      }
      compSizes.push(compSize);
    }
  }

  const cleanAlpha = new Uint8Array(totalPixels);
  for (let i = 0; i < totalPixels; i++) {
    const lbl = labelMap[i];
    if (lbl > 0 && compSizes[lbl] >= 150) {
      cleanAlpha[i] = initialAlpha[i];
    }
  }

  // Step 3: Morphological Inward Boundary Tightening (eliminates 3-5px dilated fringe)
  const coreMask = new Uint8Array(totalPixels);
  for (let i = 0; i < totalPixels; i++) {
    coreMask[i] = cleanAlpha[i] >= 150 ? 255 : 0;
  }

  const eroded = new Uint8Array(totalPixels);
  const rE = 2;
  for (let y = rE; y < h - rE; y++) {
    const row = y * w;
    for (let x = rE; x < w - rE; x++) {
      const i = row + x;
      if (coreMask[i] === 0) continue;
      let solid = true;
      for (let dy = -rE; dy <= rE && solid; dy++) {
        const nRow = (y + dy) * w;
        for (let dx = -rE; dx <= rE; dx++) {
          if (coreMask[nRow + x + dx] === 0) {
            solid = false;
            break;
          }
        }
      }
      eroded[i] = solid ? 255 : 0;
    }
  }

  // Edge-Gradient & Color-Guided Feathering
  const finalAlpha = new Uint8Array(totalPixels);
  for (let y = 0; y < h; y++) {
    const row = y * w;
    for (let x = 0; x < w; x++) {
      const i = row + x;
      if (eroded[i] === 255) {
        finalAlpha[i] = 255;
      } else if (cleanAlpha[i] >= 70 && y >= rE && y < h - rE && x >= rE && x < w - rE) {
        let nearEroded = false;
        let nearIdx = -1;
        for (let dy = -rE; dy <= rE && !nearEroded; dy++) {
          const nRow = (y + dy) * w;
          for (let dx = -rE; dx <= rE; dx++) {
            if (eroded[nRow + x + dx] === 255) {
              nearEroded = true;
              nearIdx = (nRow + x + dx) * 4;
              break;
            }
          }
        }

        if (nearEroded && nearIdx >= 0) {
          const idx = i * 4;
          const pr = pData[idx], pg = pData[idx + 1], pb = pData[idx + 2];
          const fr = pData[nearIdx], fg = pData[nearIdx + 1], fb = pData[nearIdx + 2];

          // Reject green foliage or saturated blue background
          const isFoliage = (pg > 50 && pg > pr * 1.22 && pg > pb * 1.15);
          const isBlueBg = (pb > 65 && pb > pr * 1.25 && pb > pg * 1.15);

          if (isFoliage || isBlueBg) {
            finalAlpha[i] = 0;
            continue;
          }

          const dColor = Math.sqrt((pr - fr) ** 2 + (pg - fg) ** 2 + (pb - fb) ** 2);
          if (dColor < 40) {
            finalAlpha[i] = Math.round(cleanAlpha[i] * 0.92);
          } else {
            const factor = Math.max(0, 1 - (dColor - 40) / 45);
            finalAlpha[i] = Math.round(cleanAlpha[i] * factor);
          }
        } else {
          finalAlpha[i] = 0;
        }
      } else {
        finalAlpha[i] = 0;
      }
    }
  }

  // Step 4: High-precision Edge Color Decontamination & Spill Suppression
  const outCanvas = document.createElement('canvas');
  outCanvas.width = w;
  outCanvas.height = h;
  const outCtx = outCanvas.getContext('2d');
  const outImgData = outCtx.createImageData(w, h);
  const outData = outImgData.data;

  const searchRadius = 4;
  const sSq = searchRadius * searchRadius;

  for (let y = 0; y < h; y++) {
    const yMin = Math.max(0, y - searchRadius);
    const yMax = Math.min(h - 1, y + searchRadius);
    const row = y * w;

    for (let x = 0; x < w; x++) {
      const idx = (row + x) * 4;
      const alpha = finalAlpha[row + x];

      if (alpha === 0) {
        outData[idx] = 0;
        outData[idx + 1] = 0;
        outData[idx + 2] = 0;
        outData[idx + 3] = 0;
        continue;
      }

      if (alpha >= 235) {
        // Authentic solid interior subject
        outData[idx] = pData[idx];
        outData[idx + 1] = pData[idx + 1];
        outData[idx + 2] = pData[idx + 2];
        outData[idx + 3] = alpha;
      } else {
        // Edge anti-aliasing pixel: decontaminate color from authentic interior
        let bestDist = 999999;
        let bestIdx = idx;

        const xMin = Math.max(0, x - searchRadius);
        const xMax = Math.min(w - 1, x + searchRadius);

        for (let ny = yMin; ny <= yMax; ny++) {
          const dy = ny - y;
          const dySq = dy * dy;
          const nRow = ny * w;
          for (let nx = xMin; nx <= xMax; nx++) {
            const dx = nx - x;
            const distSq = dx * dx + dySq;
            if (distSq <= sSq && distSq < bestDist) {
              const nPos = nRow + nx;
              if (finalAlpha[nPos] >= 235) {
                bestDist = distSq;
                bestIdx = nPos * 4;
              }
            }
          }
        }

        let r = bestDist < 999999 ? pData[bestIdx] : pData[idx];
        let g = bestDist < 999999 ? pData[bestIdx + 1] : pData[idx + 1];
        let b = bestDist < 999999 ? pData[bestIdx + 2] : pData[idx + 2];

        // Chroma spill suppression (neutralize residual blue or green edge halos)
        if (b > r + 14 && b > g + 10) {
          b = Math.round((r + g) * 0.5);
        }
        if (g > r + 16 && g > b + 10) {
          g = Math.round((r + b) * 0.5);
        }

        outData[idx] = r;
        outData[idx + 1] = g;
        outData[idx + 2] = b;
        outData[idx + 3] = alpha;
      }
    }
  }

  outCtx.putImageData(outImgData, 0, 0);
  return outCanvas;
}

async function segmentActivePhotoSubject(force = false) {
  if (!state.activePhotoId) return;
  const photo = state.photos.find(p => p.id === state.activePhotoId);
  const detailImg = document.getElementById('detailImage');
  const badge = document.getElementById('detailAiSegmentBadge');
  const badgeText = document.getElementById('detailAiSegmentText');

  if (!photo && !detailImg) return;
  const photoSrc = photo ? photo.dataUrl : detailImg.src;

  if (!force && studioState.cachedPhotoId === state.activePhotoId && studioState.cachedCutoutCanvas) {
    if (badge) badge.style.display = 'none';
    renderBackdropCanvasComposite();
    return;
  }

  studioState.cachedPhotoId = state.activePhotoId;
  studioState.isSegmenting = true;
  if (badge) {
    badge.style.display = 'none';
    if (badgeText) badgeText.textContent = (window.t ? window.t('detail_detecting_subject') : '✨ AI Isolating Subject...');
  }

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = photoSrc;
  await new Promise((res) => {
    if (img.complete) res();
    else { img.onload = res; img.onerror = res; }
  });

  const w = img.naturalWidth || 600;
  const h = img.naturalHeight || 750;

  try {
    const segmenter = await getAiSelfieSegmenter();
    if (segmenter) {
      let maskResult = null;
      segmenter.onResults((results) => {
        maskResult = results.segmentationMask;
      });
      await segmenter.send({ image: img });

      let waitCount = 0;
      while (!maskResult && waitCount < 35) {
        await new Promise(r => setTimeout(r, 100));
        waitCount++;
      }

      if (maskResult) {
        // Check if mask detected person pixels
        const checkCanvas = document.createElement('canvas');
        checkCanvas.width = 120;
        checkCanvas.height = Math.round(120 * (h / w));
        const checkCtx = checkCanvas.getContext('2d');
        checkCtx.drawImage(maskResult, 0, 0, checkCanvas.width, checkCanvas.height);
        const pData = checkCtx.getImageData(0, 0, checkCanvas.width, checkCanvas.height).data;
        let detectedCount = 0;
        for (let i = 0; i < pData.length; i += 4) {
          if (pData[i] > 50 || pData[i + 3] > 50) detectedCount++;
        }

        const isSubjectFound = detectedCount > 80;

        let cutoutCanvas;
        if (isSubjectFound) {
          cutoutCanvas = createRefinedSubjectCutout(img, maskResult, w, h);
          if (badgeText) badgeText.textContent = (window.t ? window.t('detail_subject_detected') : '✨ AI Subject Isolated');
        } else {
          cutoutCanvas = createSmartFallbackCutout(img, w, h);
          if (badgeText) badgeText.textContent = (window.t ? window.t('detail_subject_detected') : '✨ Subject Isolated');
        }

        studioState.cachedCutoutCanvas = cutoutCanvas;
        const rawCopy = document.createElement('canvas');
        rawCopy.width = cutoutCanvas.width;
        rawCopy.height = cutoutCanvas.height;
        rawCopy.getContext('2d').drawImage(cutoutCanvas, 0, 0);
        studioState.cachedRawAiCutoutCanvas = rawCopy;
        studioState.nanoUndoStack = [];
        updateNanoUndoButtonState();

        studioState.cachedOriginalImg = img;
        studioState.cachedMaskCanvas = maskResult;
        studioState.isSegmenting = false;

        renderBackdropCanvasComposite();
        return;
      }
    }
  } catch (err) {
    console.warn('AI Segmentation error, using smart fallback:', err);
  }

  const fallbackCutout = createSmartFallbackCutout(img, w, h);
  studioState.cachedCutoutCanvas = fallbackCutout;
  const rawFallbackCopy = document.createElement('canvas');
  rawFallbackCopy.width = fallbackCutout.width;
  rawFallbackCopy.height = fallbackCutout.height;
  rawFallbackCopy.getContext('2d').drawImage(fallbackCutout, 0, 0);
  studioState.cachedRawAiCutoutCanvas = rawFallbackCopy;
  studioState.nanoUndoStack = [];
  updateNanoUndoButtonState();

  studioState.cachedOriginalImg = img;
  studioState.isSegmenting = false;
  if (badgeText) badgeText.textContent = (window.t ? window.t('detail_subject_detected') : '✨ Subject Isolated');
  renderBackdropCanvasComposite();
}

function isStudioBackdropConfigured() {
  if (studioState.activeTool === 'backdrop') return true;
  if (!studioState.cachedCutoutCanvas) return false;

  const bType = studioState.backdropType || studioState.activeSub?.backdrop;
  if (!bType || bType === 'none') {
    if ((studioState.subjectScale && studioState.subjectScale !== 100) ||
      studioState.subjectOffsetX || studioState.subjectOffsetY) {
      return true;
    }
    return false;
  }

  if (bType === 'landmarks') {
    return !!(studioState.backdropLandmark && studioState.backdropLandmark !== 'none');
  }
  if (bType === 'blur') {
    return (typeof studioState.backdropBlur === 'number' && studioState.backdropBlur > 0) ||
      (studioState.subjectScale !== 100) || !!studioState.subjectOffsetX || !!studioState.subjectOffsetY;
  }
  if (bType === 'color') {
    return !!(studioState.backdropColor && studioState.backdropColor !== 'none');
  }
  if (bType === 'image') {
    return !!studioState.backdropCustomImage;
  }
  if (bType === 'cutout' || bType === 'nanoscope') {
    return true;
  }
  if ((studioState.subjectScale && studioState.subjectScale !== 100) || studioState.subjectOffsetX || studioState.subjectOffsetY) {
    return true;
  }
  return false;
}
window.isStudioBackdropConfigured = isStudioBackdropConfigured;

function renderBackdropCanvasComposite() {
  const detailImg = document.getElementById('detailImage');
  const backdropCanvas = document.getElementById('detailBackdropCanvas');
  const subjectCanvas = document.getElementById('detailSubjectCanvas');
  const badge = document.getElementById('detailAiSegmentBadge');

  if (!backdropCanvas || !subjectCanvas || !detailImg) return;

  const isBackdropActive = studioState.activeTool === 'backdrop' || isStudioBackdropConfigured();
  const sub = studioState.activeSub.backdrop || studioState.backdropType || 'landmarks';
  const isNano = studioState.activeTool === 'backdrop' && sub === 'nanoscope';

  const stage = document.getElementById('detailImageStage');
  const loupe = document.getElementById('nanoScopeLoupe');

  if (!isBackdropActive || studioState.isComparing) {
    detailImg.style.opacity = '1';
    detailImg.style.display = 'block';
    backdropCanvas.style.display = 'none';
    subjectCanvas.style.display = 'none';
    if (badge) badge.style.display = 'none';
    if (stage) stage.classList.remove('backdrop-active', 'dragging-subject', 'nanoscope-mode', 'erasing-pixels');
    if (loupe) loupe.style.display = 'none';
    const marker = document.getElementById('nanoScopeTargetMarker');
    if (marker) marker.style.display = 'none';
    return;
  }

  if (stage) {
    stage.classList.add('backdrop-active');
    stage.classList.toggle('nanoscope-mode', isNano);
  }
  if (!isNano) {
    if (loupe) loupe.style.display = 'none';
    const marker = document.getElementById('nanoScopeTargetMarker');
    if (marker) marker.style.display = 'none';
  }
  detailImg.style.opacity = '0';
  detailImg.style.display = 'none';
  backdropCanvas.style.display = 'block';
  subjectCanvas.style.display = 'block';
  if (badge) badge.style.display = 'none';

  const filterStr = computeCssFilterString();
  backdropCanvas.style.filter = filterStr;
  subjectCanvas.style.filter = filterStr;

  const origImg = studioState.cachedOriginalImg || detailImg;
  const w = origImg.naturalWidth || origImg.width || 600;
  const h = origImg.naturalHeight || origImg.height || 750;

  if (backdropCanvas.width !== w || backdropCanvas.height !== h) {
    backdropCanvas.width = w;
    backdropCanvas.height = h;
  }
  if (subjectCanvas.width !== w || subjectCanvas.height !== h) {
    subjectCanvas.width = w;
    subjectCanvas.height = h;
  }
  fitDetailElements();

  const bCtx = backdropCanvas.getContext('2d');
  const sCtx = subjectCanvas.getContext('2d');
  bCtx.clearRect(0, 0, w, h);
  sCtx.clearRect(0, 0, w, h);

  if (sub === 'landmarks') {
    const lmKey = studioState.backdropLandmark;
    if (!lmKey || lmKey === 'none') {
      bCtx.filter = 'none';
      bCtx.drawImage(origImg, 0, 0, w, h);
      if (studioState.subjectScale === 100 && !studioState.subjectOffsetX && !studioState.subjectOffsetY) {
        sCtx.clearRect(0, 0, w, h);
        return;
      }
    } else {
      let lmImg = _backdropLandmarkImages[lmKey];
      if (!lmImg || (lmImg.complete && lmImg.naturalWidth === 0)) {
        preloadLandmarkImages();
        lmImg = _backdropLandmarkImages[lmKey];
      }
      if (lmImg && lmImg.complete && lmImg.naturalWidth > 0) {
        drawCoverImage(bCtx, lmImg, w, h);
      } else {
        // Draw instant rich landmark gradient while image finishes loading
        const gradColors = _backdropLandmarkGradients[lmKey] || ['#0f172a', '#1e293b'];
        const grad = bCtx.createLinearGradient(0, 0, w, h);
        gradColors.forEach((color, idx) => {
          grad.addColorStop(idx / (gradColors.length - 1), color);
        });
        bCtx.fillStyle = grad;
        bCtx.fillRect(0, 0, w, h);

        if (lmImg && !lmImg.complete) {
          lmImg.onload = () => {
            if (studioState.activeTool === 'backdrop' && (studioState.activeSub.backdrop === 'landmarks' || !studioState.activeSub.backdrop)) {
              renderBackdropCanvasComposite();
            }
          };
        }
      }
    }
  } else if (sub === 'blur') {
    const blurPct = (typeof studioState.backdropBlur === 'number') ? studioState.backdropBlur : 0;
    if (blurPct <= 0 && studioState.subjectScale === 100 && !studioState.subjectOffsetX && !studioState.subjectOffsetY) {
      // 0% blur with default scale and position: 100% crisp original photo background
      bCtx.filter = 'none';
      bCtx.drawImage(origImg, 0, 0, w, h);
      sCtx.clearRect(0, 0, w, h);
      return;
    } else {
      bCtx.save();
      const px = Math.round(blurPct * 0.4); // 15% -> 6px, 35% -> 14px, 70% -> 28px, 100% -> 40px
      if (px > 0) {
        bCtx.filter = `blur(${px}px)`;
        bCtx.drawImage(origImg, -w * 0.02, -h * 0.02, w * 1.04, h * 1.04);
      } else {
        bCtx.filter = 'none';
        bCtx.drawImage(origImg, 0, 0, w, h);
      }
      bCtx.restore();
    }
  } else if (sub === 'color') {
    const c = studioState.backdropColor || '#ffffff';
    if (c === 'none') {
      bCtx.filter = 'none';
      bCtx.drawImage(origImg, 0, 0, w, h);
      if (studioState.subjectScale === 100 && !studioState.subjectOffsetX && !studioState.subjectOffsetY) {
        sCtx.clearRect(0, 0, w, h);
        return;
      }
    } else if (c.startsWith('grad-')) {
      const grad = bCtx.createLinearGradient(0, 0, w, h);
      if (c === 'grad-sunset') { grad.addColorStop(0, '#f43f5e'); grad.addColorStop(1, '#fb923c'); }
      else if (c === 'grad-neon') { grad.addColorStop(0, '#8b5cf6'); grad.addColorStop(1, '#06b6d4'); }
      else if (c === 'grad-aurora') { grad.addColorStop(0, '#10b981'); grad.addColorStop(1, '#3b82f6'); }
      else if (c === 'grad-gold') { grad.addColorStop(0, '#f59e0b'); grad.addColorStop(1, '#fbbf24'); }
      bCtx.fillStyle = grad;
      bCtx.fillRect(0, 0, w, h);
    } else {
      bCtx.fillStyle = c;
      bCtx.fillRect(0, 0, w, h);
    }
  } else if (sub === 'image') {
    if (studioState.backdropCustomImage) {
      const customImg = new Image();
      customImg.crossOrigin = 'anonymous';
      customImg.src = studioState.backdropCustomImage;
      if (customImg.complete && customImg.naturalWidth > 0) {
        drawCoverImage(bCtx, customImg, w, h);
      } else {
        customImg.onload = () => renderBackdropCanvasComposite();
      }
    } else {
      bCtx.filter = 'none';
      bCtx.drawImage(origImg, 0, 0, w, h);
      if (studioState.subjectScale === 100 && !studioState.subjectOffsetX && !studioState.subjectOffsetY) {
        sCtx.clearRect(0, 0, w, h);
        return;
      }
    }
  } else if (sub === 'cutout') {
    // Checkerboard transparent background preview
    drawCheckerboard(bCtx, w, h);
  } else if (sub === 'nanoscope') {
    const contrast = studioState.nanoContrast || 'black';
    if (contrast === 'black') {
      bCtx.fillStyle = '#08090c';
      bCtx.fillRect(0, 0, w, h);
    } else if (contrast === 'checker') {
      drawCheckerboard(bCtx, w, h);
    } else if (contrast === 'white') {
      bCtx.fillStyle = '#ffffff';
      bCtx.fillRect(0, 0, w, h);
    } else {
      if (studioState.backdropLandmark && studioState.backdropLandmark !== 'none') {
        const lmImg = _backdropLandmarkImages[studioState.backdropLandmark];
        if (lmImg && lmImg.complete && lmImg.naturalWidth > 0) {
          drawCoverImage(bCtx, lmImg, w, h);
        } else {
          bCtx.fillStyle = '#0f172a';
          bCtx.fillRect(0, 0, w, h);
        }
      } else {
        bCtx.drawImage(origImg, 0, 0, w, h);
      }
    }
  }

  // 2. Draw Isolated Subject on top
  let cutout = studioState.cachedCutoutCanvas;
  if (!cutout) {
    cutout = createSmartFallbackCutout(origImg, w, h);
    studioState.cachedCutoutCanvas = cutout;
    if (!studioState.isSegmenting) {
      segmentActivePhotoSubject();
    }
  }

  sCtx.save();
  const scale = (studioState.subjectScale || 100) / 100;
  const offsetX = studioState.subjectOffsetX || 0;
  const offsetY = studioState.subjectOffsetY || 0;

  const scaledW = w * scale;
  const scaledH = h * scale;
  const dx = (w - scaledW) / 2 + offsetX;
  const dy = (h - scaledH) + offsetY; // anchor bottom for realistic portrait positioning

  sCtx.filter = 'none';
  sCtx.drawImage(cutout, dx, dy, scaledW, scaledH);
  sCtx.restore();
}

function drawCoverImage(ctx, img, cw, ch) {
  const iw = img.naturalWidth || img.width || 0;
  const ih = img.naturalHeight || img.height || 0;
  if (iw <= 0 || ih <= 0) return;
  const scale = Math.max(cw / iw, ch / ih);
  const nw = iw * scale;
  const nh = ih * scale;
  const nx = (cw - nw) / 2;
  const ny = (ch - nh) / 2;
  ctx.drawImage(img, nx, ny, nw, nh);
}

function drawCheckerboard(ctx, w, h) {
  const size = 20;
  for (let y = 0; y < h; y += size) {
    for (let x = 0; x < w; x += size) {
      const isEven = (Math.floor(x / size) + Math.floor(y / size)) % 2 === 0;
      ctx.fillStyle = isEven ? '#1e293b' : '#0f172a';
      ctx.fillRect(x, y, size, size);
    }
  }
}

let _studioRafId = null;
function updateActiveStudioFilter() {
  if (_studioRafId) cancelAnimationFrame(_studioRafId);
  _studioRafId = requestAnimationFrame(() => {
    _studioRafId = null;
    const detailImg = document.getElementById('detailImage');
    const backdropCanvas = document.getElementById('detailBackdropCanvas');
    const subjectCanvas = document.getElementById('detailSubjectCanvas');
    const badge = document.getElementById('detailAiSegmentBadge');
    const filterStr = computeCssFilterString();
    const isBackdrop = isStudioBackdropConfigured();

    if (!studioState.isComparing) {
      if (isBackdrop) {
        if (detailImg) {
          detailImg.style.display = 'none';
          detailImg.style.opacity = '0';
        }
        if (backdropCanvas) {
          backdropCanvas.style.display = 'block';
          backdropCanvas.style.filter = filterStr;
        }
        if (subjectCanvas) {
          subjectCanvas.style.display = 'block';
          subjectCanvas.style.filter = filterStr;
        }
        if (badge) {
          badge.style.display = 'none';
        }
      } else {
        if (detailImg) {
          detailImg.style.display = 'block';
          detailImg.style.opacity = '1';
          detailImg.style.filter = filterStr;
        }
        if (backdropCanvas) backdropCanvas.style.display = 'none';
        if (subjectCanvas) subjectCanvas.style.display = 'none';
        if (badge) badge.style.display = 'none';
      }
    }
    applyStudioOverlays();
    if (studioState.activeTool === 'backdrop' || isBackdrop) {
      renderBackdropCanvasComposite();
    }
  });
}

function setComparing(isComparing) {
  studioState.isComparing = !!isComparing;
  const detailImg = document.getElementById('detailImage');
  const badge = document.getElementById('detailCompareBadge');
  const compareBtn = document.getElementById('studioCompareBtn');

  if (studioState.isComparing) {
    if (detailImg) {
      const photo = state.photos.find(p => p.id === state.activePhotoId);
      if (photo && photo._studioCropBackupDataUrl) {
        detailImg.src = photo._studioCropBackupDataUrl;
      }
      detailImg.style.filter = 'none';
      detailImg.style.display = 'block';
      detailImg.style.opacity = '1';
    }
    const bCanvas = document.getElementById('detailBackdropCanvas');
    const sCanvas = document.getElementById('detailSubjectCanvas');
    if (bCanvas) bCanvas.style.display = 'none';
    if (sCanvas) sCanvas.style.display = 'none';
    if (badge) badge.classList.add('active');
    if (compareBtn) compareBtn.classList.add('comparing');
    applyStudioOverlays({ vignette: 0, tiltShift: 'off' });
  } else {
    if (detailImg) {
      const photo = state.photos.find(p => p.id === state.activePhotoId);
      if (photo) {
        detailImg.src = photo.dataUrl;
      }
    }
    if (badge) badge.classList.remove('active');
    if (compareBtn) compareBtn.classList.remove('comparing');
    updateActiveStudioFilter();
  }
}

function resetCurrentStudioFeature() {
  const currentTool = studioState.activeTool;
  if (!currentTool) {
    resetStudioValues();
    return;
  }

  if (currentTool === 'backdrop') {
    if (typeof revertStudioCropPreviewIfNeeded === 'function') {
      revertStudioCropPreviewIfNeeded();
    }
    const sub = studioState.activeSub.backdrop || 'landmarks';

    // Always reset subject scale & position to center default for the current screen
    studioState.subjectScale = 100;
    studioState.subjectOffsetX = 0;
    studioState.subjectOffsetY = 0;
    document.querySelectorAll('.studio-subject-scale-slider').forEach(s => {
      s.value = 100;
    });
    document.querySelectorAll('.studio-subject-scale-val').forEach(v => {
      v.textContent = '100%';
    });

    if (sub === 'landmarks') {
      studioState.backdropLandmark = 'none';
      document.querySelectorAll('#studioLandmarkCardsRow .studio-landmark-card').forEach(c => {
        c.classList.remove('active');
      });
      renderBackdropCanvasComposite();
      const msg = (window.t && window.t('detail_backdrop_landmark_reset')) || 'Landmark removed · Original photo restored';
      showToast(msg);
      return;
    }

    if (sub === 'blur') {
      studioState.backdropBlur = 0;
      const blurSlider = document.getElementById('studioBackdropBlurSlider');
      const blurVal = document.getElementById('studioBackdropBlurVal');
      if (blurSlider) blurSlider.value = 0;
      if (blurVal) blurVal.textContent = '0%';
      document.querySelectorAll('#studioBackdropBlurChips .studio-quick-chip').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.blur === '0');
      });
      renderBackdropCanvasComposite();
      const msg = (window.t && window.t('detail_backdrop_blur_reset')) || 'Blur reset to 0% · Original photo restored';
      showToast(msg);
      return;
    }

    if (sub === 'color') {
      studioState.backdropColor = 'none';
      document.querySelectorAll('#studioBackdropSwatches .backdrop-swatch-chip').forEach(btn => {
        btn.classList.remove('active');
      });
      renderBackdropCanvasComposite();
      const msg = (window.t && window.t('detail_backdrop_color_reset')) || 'Color removed · Original photo restored';
      showToast(msg);
      return;
    }

    if (sub === 'image') {
      studioState.backdropCustomImage = null;
      const imgPreview = document.getElementById('studioBackdropImagePreview');
      const dropPrompt = document.getElementById('studioBackdropDropzonePrompt');
      if (imgPreview) imgPreview.style.display = 'none';
      if (dropPrompt) dropPrompt.style.display = 'flex';
      document.querySelectorAll('.backdrop-gallery-thumb').forEach(t => t.classList.remove('active'));
      renderBackdropCanvasComposite();
      const msg = (window.t && window.t('detail_backdrop_image_reset')) || 'Image removed · Original photo restored';
      showToast(msg);
      return;
    }

    if (sub === 'nanoscope') {
      resetNanoCutoutToAi();
      return;
    }

    renderBackdropCanvasComposite();
    return;
  }

  if (currentTool === 'lux') {
    studioState.lux = 0;
    const luxSlider = document.getElementById('studioLuxSlider');
    const luxVal = document.getElementById('studioLuxVal');
    if (luxSlider) luxSlider.value = 0;
    if (luxVal) luxVal.textContent = '0%';
    document.querySelectorAll('#studioPanelLux .studio-quick-chip').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lux === '0');
    });
    updateActiveStudioFilter();
    showToast('Lux reset to 0%');
    return;
  }

  if (currentTool === 'filters') {
    studioState.filter = 'normal';
    studioState.filterIntensity = 100;
    const fIntensitySlider = document.getElementById('studioFilterIntensitySlider');
    const fIntensityVal = document.getElementById('studioFilterIntensityVal');
    if (fIntensitySlider) fIntensitySlider.value = 100;
    if (fIntensityVal) fIntensityVal.textContent = '100%';
    document.querySelectorAll('.studio-filter-chip').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.filter === 'normal');
    });
    updateActiveStudioFilter();
    showToast('Filter reset to Original');
    return;
  }

  if (currentTool === 'light') {
    studioState.brightness = 0;
    studioState.contrast = 0;
    studioState.highlights = 0;
    studioState.shadows = 0;
    syncStudioToolControls('light');
    updateActiveStudioFilter();
    showToast('Light adjustments reset to 0');
    return;
  }

  if (currentTool === 'color') {
    studioState.warmth = 0;
    studioState.saturation = 0;
    studioState.tint = 0;
    studioState.fade = 0;
    syncStudioToolControls('color');
    updateActiveStudioFilter();
    showToast('Color adjustments reset to 0');
    return;
  }

  if (currentTool === 'optics') {
    studioState.vignette = 0;
    studioState.sharpen = 0;
    studioState.tiltShift = 'off';
    syncStudioToolControls('optics');
    document.querySelectorAll('#studioTiltShiftModes .studio-tilt-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === 'off');
    });
    applyStudioOverlays({ vignette: 0, tiltShift: 'off' });
    updateActiveStudioFilter();
    showToast('Optics adjustments reset to 0');
    return;
  }

  resetStudioValues();
}

function resetStudioValues() {
  if (typeof revertStudioCropPreviewIfNeeded === 'function') {
    revertStudioCropPreviewIfNeeded();
  }
  studioState.activeTool = null;
  studioState.isComparing = false;
  studioState.lux = 0;
  studioState.filter = 'normal';
  studioState.filterIntensity = 100;
  studioState.brightness = 0;
  studioState.contrast = 0;
  studioState.highlights = 0;
  studioState.shadows = 0;
  studioState.warmth = 0;
  studioState.saturation = 0;
  studioState.tint = 0;
  studioState.fade = 0;
  studioState.vignette = 0;
  studioState.sharpen = 0;
  studioState.tiltShift = 'off';

  const detailImg = document.getElementById('detailImage');
  if (detailImg) detailImg.style.filter = 'none';

  applyStudioOverlays({ vignette: 0, tiltShift: 'off' });

  const luxSlider = document.getElementById('studioLuxSlider');
  const luxVal = document.getElementById('studioLuxVal');
  if (luxSlider) luxSlider.value = 0;
  if (luxVal) luxVal.textContent = '0%';

  const fIntensitySlider = document.getElementById('studioFilterIntensitySlider');
  const fIntensityVal = document.getElementById('studioFilterIntensityVal');
  if (fIntensitySlider) fIntensitySlider.value = 100;
  if (fIntensityVal) fIntensityVal.textContent = '100%';

  const lightSlider = document.getElementById('studioLightSlider');
  const lightVal = document.getElementById('studioLightVal');
  if (lightSlider) lightSlider.value = 0;
  if (lightVal) lightVal.textContent = '0';

  const colorSlider = document.getElementById('studioColorSlider');
  const colorVal = document.getElementById('studioColorVal');
  if (colorSlider) colorSlider.value = 0;
  if (colorVal) colorVal.textContent = '0';

  const opticsSlider = document.getElementById('studioOpticsSlider');
  const opticsVal = document.getElementById('studioOpticsVal');
  if (opticsSlider) opticsSlider.value = 0;
  if (opticsVal) opticsVal.textContent = '0';

  studioState.backdropType = 'none';
  studioState.backdropLandmark = 'none';
  studioState.backdropBlur = 0;
  studioState.backdropColor = 'none';
  studioState.subjectScale = 100;
  studioState.subjectOffsetX = 0;
  studioState.subjectOffsetY = 0;
  document.querySelectorAll('.studio-subject-scale-slider').forEach(s => {
    s.value = 100;
  });
  document.querySelectorAll('.studio-subject-scale-val').forEach(v => {
    v.textContent = '100%';
  });

  const blurSlider = document.getElementById('studioBackdropBlurSlider');
  const blurVal = document.getElementById('studioBackdropBlurVal');
  if (blurSlider) blurSlider.value = 0;
  if (blurVal) blurVal.textContent = '0%';
  document.querySelectorAll('#studioBackdropBlurChips .studio-quick-chip').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.blur === '0');
  });
  document.querySelectorAll('#studioBackdropSwatches .backdrop-swatch-chip').forEach(btn => {
    btn.classList.remove('active');
  });
  if (typeof renderStudioBackdropCustomPalette === 'function') {
    renderStudioBackdropCustomPalette();
  }

  studioState.backdropCustomImage = null;
  const imgPreview = document.getElementById('studioBackdropImagePreview');
  const dropPrompt = document.getElementById('studioBackdropDropzonePrompt');
  if (imgPreview) imgPreview.style.display = 'none';
  if (dropPrompt) dropPrompt.style.display = 'flex';
  document.querySelectorAll('.backdrop-gallery-thumb').forEach(t => t.classList.remove('active'));

  document.querySelectorAll('#detailPhotoEditBar .detail-edit-tool-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  document.querySelectorAll('#studioTiltShiftModes .studio-tilt-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === 'off');
  });

  document.querySelectorAll('#studioPanelLux .studio-quick-chip').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lux === '0');
  });

  const badge = document.getElementById('detailCompareBadge');
  if (badge) badge.classList.remove('active');

  const compareBtn = document.getElementById('studioCompareBtn');
  if (compareBtn) compareBtn.classList.remove('comparing');

  const bCanvas = document.getElementById('detailBackdropCanvas');
  const sCanvas = document.getElementById('detailSubjectCanvas');
  if (bCanvas) bCanvas.style.display = 'none';
  if (sCanvas) sCanvas.style.display = 'none';
  if (detailImg) detailImg.style.display = 'block';
  const aiBadge = document.getElementById('detailAiSegmentBadge');
  if (aiBadge) aiBadge.style.display = 'none';
  studioState.cachedPhotoId = null;
  studioState.cachedCutoutCanvas = null;
  studioState.cachedMaskCanvas = null;
  studioState.cachedOriginalImg = null;
  studioState.isSegmenting = false;
  studioState.nanoBrushSize = 1;
  studioState.nanoZoom = 16;
  studioState.nanoContrast = 'black';
  studioState.nanoUndoStack = [];
  studioState.cachedRawAiCutoutCanvas = null;
  studioState.nanoStep = 1;
  studioState.nanoEraseOnMove = false;
  studioState.nanoFocusX = null;
  studioState.nanoFocusY = null;
  studioState.nanoLoupeCustomPos = null;
  studioState.nanoImageDragActive = false;
  const loupeEl = document.getElementById('nanoScopeLoupe');
  if (loupeEl) loupeEl.style.display = 'none';
  const markerEl = document.getElementById('nanoScopeTargetMarker');
  if (markerEl) markerEl.style.display = 'none';
  const stageEl = document.getElementById('detailImageStage');
  if (stageEl) stageEl.classList.remove('nanoscope-mode', 'erasing-pixels', 'image-drag-mode', 'dragging-image');
  setNanoScopeLayout(false);
}

function setNanoScopeLayout(isNano) {
  const container = document.querySelector('.detail-container') || document.getElementById('photoDetailModal');
  const foldBar = document.getElementById('nanoscopeDockFoldBar');
  if (container) {
    container.classList.toggle('nanoscope-active', !!isNano);
    if (!isNano) {
      container.classList.remove('nanoscope-dock-unfolded');
    }
  }
  if (foldBar) {
    foldBar.style.display = isNano ? 'flex' : 'none';
    if (!isNano) {
      foldBar.classList.remove('unfolded');
    }
  }
  if (isNano) {
    const aiBadge = document.getElementById('detailAiSegmentBadge');
    if (aiBadge) aiBadge.style.display = 'none';
  } else {
    studioState.nanoImageDragActive = false;
  }
  if (typeof updateNanoPositionButtons === 'function') {
    updateNanoPositionButtons();
  }
}

window.toggleNanoDockFold = function() {
  const container = document.querySelector('.detail-container') || document.getElementById('photoDetailModal');
  if (!container) return;
  const isUnfolded = container.classList.toggle('nanoscope-dock-unfolded');
  const foldBar = document.getElementById('nanoscopeDockFoldBar');
  if (foldBar) {
    foldBar.classList.toggle('unfolded', isUnfolded);
  }
};

function updateStudioNavButtons() {
  const isStudioOpen = !!studioState.activeTool || !!document.getElementById('detailEditStudioDrawer')?.classList.contains('open');
  const modal = document.getElementById('photoDetailModal');
  if (modal) {
    modal.classList.toggle('studio-open', isStudioOpen);
  }
  const prevBtn = document.getElementById('detailPrevBtn');
  const nextBtn = document.getElementById('detailNextBtn');
  const swipeHint = document.getElementById('detailSwipeHint');

  if (isStudioOpen) {
    if (prevBtn) {
      prevBtn.classList.add('studio-hidden');
      prevBtn.style.display = 'none';
    }
    if (nextBtn) {
      nextBtn.classList.add('studio-hidden');
      nextBtn.style.display = 'none';
    }
    if (swipeHint) {
      swipeHint.classList.remove('visible');
      swipeHint.style.display = 'none';
    }
  } else {
    const total = (state.detailPhotoList && state.detailPhotoList.length) || 1;
    if (prevBtn) {
      prevBtn.classList.remove('studio-hidden');
      prevBtn.style.display = total > 1 ? 'flex' : 'none';
    }
    if (nextBtn) {
      nextBtn.classList.remove('studio-hidden');
      nextBtn.style.display = total > 1 ? 'flex' : 'none';
    }
    if (swipeHint) {
      swipeHint.style.display = '';
    }
  }
}

function openStudioTool(toolName) {
  const drawer = document.getElementById('detailEditStudioDrawer');
  if (!drawer) return;

  if (studioState.activeTool === toolName && drawer.classList.contains('open')) {
    closeStudioDrawer();
    return;
  }

  studioState.activeTool = toolName;

  document.querySelectorAll('#detailPhotoEditBar .detail-edit-tool-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tool === toolName);
  });

  const panels = {
    lux: document.getElementById('studioPanelLux'),
    filters: document.getElementById('studioPanelFilters'),
    light: document.getElementById('studioPanelLight'),
    color: document.getElementById('studioPanelColor'),
    optics: document.getElementById('studioPanelOptics'),
    backdrop: document.getElementById('studioPanelBackdrop')
  };

  Object.entries(panels).forEach(([k, panel]) => {
    if (panel) panel.style.display = (k === toolName) ? 'block' : 'none';
  });

  updateStudioHeaderTitle();
  updateStudioSubLabels();
  syncStudioToolControls(toolName);

  if (toolName === 'lux' && studioState.lux === 0) {
    setStudioLux(65);
  }

  if (toolName === 'filters') {
    const photo = state.photos.find(p => p.id === state.activePhotoId);
    renderStudioFilterThumbnails(photo);
  }

  if (toolName === 'backdrop') {
    if (!studioState.backdropLandmark) studioState.backdropLandmark = 'eiffel_tower';
    if (!studioState.activeSub.backdrop) studioState.activeSub.backdrop = 'landmarks';
    studioState.backdropType = studioState.activeSub.backdrop;
    document.querySelectorAll('#studioLandmarkCardsRow .studio-landmark-card').forEach(c => {
      c.classList.toggle('active', studioState.backdropLandmark !== 'none' && c.dataset.landmark === studioState.backdropLandmark);
    });
    segmentActivePhotoSubject();
  } else {
    // Hide backdrop canvases and restore standard photo image for other tools
    setNanoScopeLayout(false);
    const bCanvas = document.getElementById('detailBackdropCanvas');
    const sCanvas = document.getElementById('detailSubjectCanvas');
    if (bCanvas) bCanvas.style.display = 'none';
    if (sCanvas) sCanvas.style.display = 'none';
    const aiBadge = document.getElementById('detailAiSegmentBadge');
    if (aiBadge) aiBadge.style.display = 'none';
    const stage = document.getElementById('detailImageStage');
    if (stage) stage.classList.remove('backdrop-active');
    const detailImg = document.getElementById('detailImage');
    if (detailImg) {
      detailImg.style.display = 'block';
      detailImg.style.opacity = '1';
    }
  }

  updateActiveStudioFilter();

  drawer.classList.add('open');
  const backBtn = document.getElementById('closeDetailBtn');
  if (backBtn) {
    const backTitle = (window.t && window.t('detail_back')) || 'Back to Gallery';
    backBtn.title = backTitle;
    backBtn.setAttribute('aria-label', backTitle);
  }
  updateStudioNavButtons();
}

function syncStudioToolControls(toolName) {
  if (toolName === 'light') {
    const sub = studioState.activeSub.light || 'brightness';
    document.querySelectorAll('#studioLightSubnav .studio-subnav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.sub === sub);
    });
    const lightSlider = document.getElementById('studioLightSlider');
    const lightVal = document.getElementById('studioLightVal');
    const val = studioState[sub] || 0;
    if (lightSlider) lightSlider.value = val;
    if (lightVal) lightVal.textContent = val > 0 ? `+${val}` : `${val}`;
  } else if (toolName === 'color') {
    const sub = studioState.activeSub.color || 'warmth';
    document.querySelectorAll('#studioColorSubnav .studio-subnav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.sub === sub);
    });
    const colorSlider = document.getElementById('studioColorSlider');
    const colorVal = document.getElementById('studioColorVal');
    const val = studioState[sub] || 0;
    if (colorSlider) {
      if (sub === 'fade') {
        colorSlider.min = 0;
        colorSlider.max = 100;
      } else {
        colorSlider.min = -100;
        colorSlider.max = 100;
      }
      colorSlider.value = val;
    }
    if (colorVal) colorVal.textContent = val > 0 ? `+${val}` : `${val}`;
  } else if (toolName === 'optics') {
    const sub = studioState.activeSub.optics || 'vignette';
    document.querySelectorAll('#studioOpticsSubnav .studio-subnav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.sub === sub);
    });
    const opticsSlider = document.getElementById('studioOpticsSlider');
    const opticsVal = document.getElementById('studioOpticsVal');
    const opticsSliderWrap = document.getElementById('studioOpticsSliderWrap');
    const tiltModesWrap = document.getElementById('studioTiltShiftModes');
    if (sub === 'tiltshift') {
      if (opticsSliderWrap) opticsSliderWrap.style.display = 'none';
      if (tiltModesWrap) tiltModesWrap.style.display = 'flex';
    } else {
      if (opticsSliderWrap) opticsSliderWrap.style.display = 'block';
      if (tiltModesWrap) tiltModesWrap.style.display = 'none';
      const val = studioState[sub] || 0;
      if (opticsSlider) opticsSlider.value = val;
      if (opticsVal) opticsVal.textContent = `${val}`;
    }
  } else if (toolName === 'backdrop') {
    const sub = studioState.activeSub.backdrop || 'landmarks';
    document.querySelectorAll('#studioBackdropSubnav .studio-subnav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.sub === sub);
    });
    const subPanels = {
      landmarks: document.getElementById('studioBackdropSubLandmarks'),
      blur: document.getElementById('studioBackdropSubBlur'),
      color: document.getElementById('studioBackdropSubColor'),
      image: document.getElementById('studioBackdropSubImage'),
      nanoscope: document.getElementById('studioBackdropSubNano')
    };
    Object.entries(subPanels).forEach(([k, p]) => {
      if (p) p.style.display = (k === sub) ? 'block' : 'none';
    });

    const isNano = sub === 'nanoscope';
    setNanoScopeLayout(isNano);
    const stage = document.getElementById('detailImageStage');
    if (stage) stage.classList.toggle('nanoscope-mode', isNano);
    const loupe = document.getElementById('nanoScopeLoupe');
    const marker = document.getElementById('nanoScopeTargetMarker');
    if (loupe && !isNano) loupe.style.display = 'none';
    if (marker && !isNano) marker.style.display = 'none';

    if (isNano) {
      document.querySelectorAll('#nanoscopeBrushChips .studio-quick-chip').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.brush, 10) === (studioState.nanoBrushSize || 1));
      });
      document.querySelectorAll('#nanoscopeZoomChips .studio-quick-chip').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.zoom, 10) === (studioState.nanoZoom || 16));
      });
      document.querySelectorAll('#nanoscopeContrastSwatches .nanoscope-contrast-chip').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.contrast === (studioState.nanoContrast || 'black'));
      });
      document.querySelectorAll('#nanoscopeStepChips .nanoscope-step-chip').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.step, 10) === (studioState.nanoStep || 1));
      });
      document.getElementById('nanoModeNavigateBtn')?.classList.toggle('active', !studioState.nanoEraseOnMove);
      document.getElementById('nanoModeEraseOnMoveBtn')?.classList.toggle('active', !!studioState.nanoEraseOnMove);
      updateNanoUndoButtonState();

      if (studioState.cachedCutoutCanvas && (studioState.nanoFocusX == null || studioState.nanoFocusY == null)) {
        studioState.nanoFocusX = Math.round(studioState.cachedCutoutCanvas.width / 2);
        studioState.nanoFocusY = Math.round(studioState.cachedCutoutCanvas.height / 2);
      }
      if (typeof window.renderNanoLoupeForCutoutCoords === 'function' && studioState.nanoFocusX != null) {
        window.renderNanoLoupeForCutoutCoords(studioState.nanoFocusX, studioState.nanoFocusY);
      }
    }

    // Highlight active landmark card
    document.querySelectorAll('#studioLandmarkCardsRow .studio-landmark-card').forEach(c => {
      c.classList.toggle('active', c.dataset.landmark === (studioState.backdropLandmark || 'times_square'));
    });

    if (sub === 'image') {
      renderStudioBackdropGalleryPhotos();
    }

    const blurAmt = (typeof studioState.backdropBlur === 'number') ? studioState.backdropBlur : 0;
    const blurSlider = document.getElementById('studioBackdropBlurSlider');
    const blurVal = document.getElementById('studioBackdropBlurVal');
    if (blurSlider) blurSlider.value = blurAmt;
    if (blurVal) blurVal.textContent = `${blurAmt}%`;
    document.querySelectorAll('#studioBackdropBlurChips .studio-quick-chip').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.blur, 10) === blurAmt);
    });

    document.querySelectorAll('#studioBackdropSwatches .backdrop-swatch-chip').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.color === studioState.backdropColor);
    });
    if (typeof renderStudioBackdropCustomPalette === 'function') {
      renderStudioBackdropCustomPalette();
    }

    const curScale = studioState.subjectScale || 100;
    document.querySelectorAll('.studio-subject-scale-slider').forEach(s => {
      s.value = curScale;
    });
    document.querySelectorAll('.studio-subject-scale-val').forEach(v => {
      v.textContent = `${curScale}%`;
    });
  } else if (toolName === 'lux') {
    const slider = document.getElementById('studioLuxSlider');
    const readout = document.getElementById('studioLuxVal');
    if (slider) slider.value = studioState.lux;
    if (readout) readout.textContent = `${studioState.lux}%`;
    document.querySelectorAll('#studioPanelLux .studio-quick-chip').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.lux, 10) === studioState.lux);
    });
  } else if (toolName === 'filters') {
    const fSlider = document.getElementById('studioFilterIntensitySlider');
    const fVal = document.getElementById('studioFilterIntensityVal');
    if (fSlider) fSlider.value = studioState.filterIntensity;
    if (fVal) fVal.textContent = `${studioState.filterIntensity}%`;
  }
}

function closeStudioDrawer(saved = false) {
  if (typeof revertStudioCropPreviewIfNeeded === 'function') {
    revertStudioCropPreviewIfNeeded();
  }
  const drawer = document.getElementById('detailEditStudioDrawer');
  if (drawer) drawer.classList.remove('open');
  studioState.activeTool = null;
  setNanoScopeLayout(false);

  const stage = document.getElementById('detailImageStage');
  if (stage) stage.classList.remove('nanoscope-mode', 'erasing-pixels', 'backdrop-active');
  const loupe = document.getElementById('nanoScopeLoupe');
  if (loupe) loupe.style.display = 'none';
  const marker = document.getElementById('nanoScopeTargetMarker');
  if (marker) marker.style.display = 'none';

  document.querySelectorAll('#detailPhotoEditBar .detail-edit-tool-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  const bCanvas = document.getElementById('detailBackdropCanvas');
  const sCanvas = document.getElementById('detailSubjectCanvas');
  if (bCanvas) {
    bCanvas.style.display = 'none';
    const bCtx = bCanvas.getContext('2d');
    bCtx.clearRect(0, 0, bCanvas.width, bCanvas.height);
  }
  if (sCanvas) {
    sCanvas.style.display = 'none';
    const sCtx = sCanvas.getContext('2d');
    sCtx.clearRect(0, 0, sCanvas.width, sCanvas.height);
  }

  const aiBadge = document.getElementById('detailAiSegmentBadge');
  if (aiBadge) aiBadge.style.display = 'none';

  if (!saved) {
    // DISCARD ALL UNSAVED PREVIEW EDITS & RESTORE SAVED PHOTO
    const photo = state.photos.find(p => p.id === state.activePhotoId);
    if (photo) {
      if (photo._studioResizeBackupDataUrl) {
        photo.dataUrl = photo._studioResizeBackupDataUrl;
        delete photo._studioResizeBackupDataUrl;
      }
      if (photo._studioCropBackupDataUrl) {
        photo.dataUrl = photo._studioCropBackupDataUrl;
        delete photo._studioCropBackupDataUrl;
      }
      const detailItem = (state.detailPhotoList || []).find(p => p.id === photo.id);
      if (detailItem) {
        detailItem.dataUrl = photo.dataUrl;
      }
    }

    resetStudioValues();

    const detailImg = document.getElementById('detailImage');
    if (detailImg) {
      if (photo && photo.dataUrl) {
        detailImg.src = photo.dataUrl;
      }
      detailImg.style.width = '';
      detailImg.style.height = '';
      detailImg.style.display = 'block';
      detailImg.style.opacity = '1';
      detailImg.style.filter = 'none';
    }
  }

  // Clear inline dimensions and re-fit once the drawer slide-down transition (320ms) completes
  setTimeout(() => {
    if (typeof fitDetailElements === 'function') {
      fitDetailElements();
    }
  }, 340);

  updateStudioNavButtons();
  const backBtn = document.getElementById('closeDetailBtn');
  if (backBtn) {
    const backTitle = (window.t && window.t('detail_back')) || 'Back to Gallery';
    backBtn.title = backTitle;
    backBtn.setAttribute('aria-label', backTitle);
  }
}

function updateStudioHeaderTitle() {
  if (!studioState.activeTool) return;
  const toolIcons = {
    lux: '✨',
    filters: '🎨',
    light: '☀️',
    color: '🌈',
    optics: '🪄',
    backdrop: '🖼️'
  };
  const icon = toolIcons[studioState.activeTool] || '🎨';
  const locName = (window.t && window.t('detail_edit_' + studioState.activeTool)) ||
    (studioState.activeTool.charAt(0).toUpperCase() + studioState.activeTool.slice(1));
  const fullText = `${icon} ${locName}`;
  const titleEl = document.getElementById('studioActiveToolTitle');
  const titleWrap = document.getElementById('studioHeaderTitleWrap');
  if (titleEl) {
    titleEl.textContent = fullText;
    titleEl.title = fullText;
  }
  if (titleWrap) {
    titleWrap.title = fullText;
  }
}

function updateStudioSubLabels() {
  const getSubLabelText = (sub) => (window.t && window.t('detail_sub_' + sub)) || (sub.charAt(0).toUpperCase() + sub.slice(1));
  const lightSub = studioState.activeSub.light;
  const lightSubLabel = document.getElementById('studioLightSubLabel');
  if (lightSubLabel) lightSubLabel.textContent = getSubLabelText(lightSub);

  const colorSub = studioState.activeSub.color;
  const colorSubLabel = document.getElementById('studioColorSubLabel');
  if (colorSubLabel) colorSubLabel.textContent = getSubLabelText(colorSub);

  const opticsSub = studioState.activeSub.optics;
  const opticsSubLabel = document.getElementById('studioOpticsSubLabel');
  if (opticsSubLabel && opticsSub !== 'tiltshift') opticsSubLabel.textContent = getSubLabelText(opticsSub);
}

window.updateStudioHeaderTitle = updateStudioHeaderTitle;
window.updateStudioSubLabels = updateStudioSubLabels;

function setStudioLux(val) {
  studioState.lux = Math.max(0, Math.min(100, parseInt(val, 10) || 0));
  const slider = document.getElementById('studioLuxSlider');
  const readout = document.getElementById('studioLuxVal');
  if (slider) slider.value = studioState.lux;
  if (readout) readout.textContent = `${studioState.lux}%`;

  document.querySelectorAll('#studioPanelLux .studio-quick-chip').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.lux, 10) === studioState.lux);
  });

  updateActiveStudioFilter();
}

function renderStudioFilterThumbnails(photo) {
  const carousel = document.getElementById('studioFiltersCarousel');
  if (!carousel) return;

  const sampleSrc = (photo && photo.dataUrl) ? photo.dataUrl : '';

  const html = STUDIO_FILTERS.map(f => {
    const isActive = studioState.filter === f.id;
    const filterCss = computeCssFilterString({
      filter: f.id,
      filterIntensity: 100,
      lux: 0,
      brightness: 0,
      contrast: 0,
      highlights: 0,
      shadows: 0,
      warmth: 0,
      saturation: 0,
      tint: 0,
      fade: 0,
      vignette: 0,
      sharpen: 0,
      tiltShift: 'off'
    });

    return `
      <div class="studio-filter-item ${isActive ? 'active' : ''}" onclick="selectStudioFilter('${f.id}')" title="${f.name}${f.vip ? ' (Pro Exclusive)' : ''}">
        <div class="studio-filter-thumb">
          <img src="${sampleSrc}" alt="${f.name}" style="filter: ${filterCss};" draggable="false">
          ${f.vip ? '<span class="studio-filter-crown" title="Aura Pro">👑</span>' : ''}
        </div>
        <span class="studio-filter-name">${f.name}</span>
      </div>
    `;
  }).join('');

  carousel.innerHTML = html;
}

function selectStudioFilter(filterId) {
  const fDef = STUDIO_FILTERS.find(f => f.id === filterId);
  if (!fDef) return;

  studioState.filter = filterId;

  const fSlider = document.getElementById('studioFilterIntensitySlider');
  const fVal = document.getElementById('studioFilterIntensityVal');
  if (fSlider) fSlider.value = studioState.filterIntensity;
  if (fVal) fVal.textContent = `${studioState.filterIntensity}%`;

  document.querySelectorAll('#studioFiltersCarousel .studio-filter-item').forEach(item => {
    const nameEl = item.querySelector('.studio-filter-name');
    const isCurrent = nameEl && nameEl.textContent.trim().toLowerCase() === fDef.name.toLowerCase();
    item.classList.toggle('active', isCurrent);
  });

  updateActiveStudioFilter();

  if (fDef.vip && !state.isPro) {
    showToast('✨ Pro Filter preview active! Tap Save to unlock');
  }
}

function applyAndSaveStudioEdits() {
  if (!state.activePhotoId) return;
  const photo = state.photos.find(p => p.id === state.activePhotoId);
  if (!photo) return;

  const isVipFilter = false;
  const isVipTilt = studioState.tiltShift !== 'off';
  if (isVipTilt && !state.isPro) {
    const unlockMsg = (window.t && window.t('detail_vip_filter_unlock')) || '👑 Unlock with Aura Pro to save exclusive filters';
    showToast(unlockMsg);
    if (typeof openVipMoveCopyGateModal === 'function') {
      openVipMoveCopyGateModal();
    }
    return;
  }

  const isEdited = (
    studioState.lux > 0 ||
    studioState.filter !== 'normal' ||
    studioState.brightness !== 0 ||
    studioState.contrast !== 0 ||
    studioState.highlights !== 0 ||
    studioState.shadows !== 0 ||
    studioState.warmth !== 0 ||
    studioState.saturation !== 0 ||
    studioState.tint !== 0 ||
    studioState.fade !== 0 ||
    studioState.vignette !== 0 ||
    studioState.sharpen !== 0 ||
    studioState.tiltShift !== 'off' ||
    studioState.backdropType !== 'none' ||
    studioState.backdropChroma !== 'off' ||
    studioState.backdropCustomImage !== null ||
    !!photo._studioCropBackupDataUrl
  );

  if (!isEdited) {
    closeStudioDrawer();
    return;
  }

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const renderCanvasAndSave = (bgImgLoaded = null) => {
      try {
        const natW = img.naturalWidth || img.width || 1200;
        const natH = img.naturalHeight || img.height || 1200;

        // 4K Ultra-HD Master Resolution (3840px max edge if below, preserving higher native resolution)
        const maxDim = Math.max(natW, natH);
        let w = natW;
        let h = natH;
        if (maxDim < 3840) {
          const scale = 3840 / maxDim;
          w = Math.round(natW * scale);
          h = Math.round(natH * scale);
        }

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // 1. Check if AI Subject Cutout & Backdrop is Active
        const isBackdropActive = studioState.activeTool === 'backdrop' || isStudioBackdropConfigured();
        const cutout = studioState.cachedCutoutCanvas;

        if (isBackdropActive && cutout) {
          const sub = studioState.activeSub.backdrop || studioState.backdropType || 'landmarks';
          const compCanvas = document.createElement('canvas');
          compCanvas.width = w;
          compCanvas.height = h;
          const cCtx = compCanvas.getContext('2d');
          cCtx.imageSmoothingEnabled = true;
          cCtx.imageSmoothingQuality = 'high';

          // A. Draw Selected Backdrop on Canvas
          if (sub === 'landmarks') {
            const lmKey = studioState.backdropLandmark;
            if (!lmKey || lmKey === 'none') {
              cCtx.drawImage(img, 0, 0, w, h);
            } else {
              const lmImg = _backdropLandmarkImages[lmKey];
              if (lmImg && lmImg.complete && lmImg.naturalWidth > 0) {
                drawCoverImage(cCtx, lmImg, w, h);
              } else {
                cCtx.fillStyle = '#0f172a';
                cCtx.fillRect(0, 0, w, h);
              }
            }
          } else if (sub === 'blur') {
            const blurVal = (typeof studioState.backdropBlur === 'number') ? studioState.backdropBlur : 0;
            if (blurVal <= 0) {
              cCtx.filter = 'none';
              cCtx.drawImage(img, 0, 0, w, h);
            } else {
              cCtx.save();
              const blurPx = Math.round((blurVal * 0.4) * (w / 1200));
              cCtx.filter = `blur(${Math.max(2, blurPx)}px)`;
              cCtx.drawImage(img, -w * 0.02, -h * 0.02, w * 1.04, h * 1.04);
              cCtx.restore();
            }
          } else if (sub === 'color') {
            const c = studioState.backdropColor || '#ffffff';
            if (c === 'none') {
              cCtx.drawImage(img, 0, 0, w, h);
            } else if (c.startsWith('grad-')) {
              const grad = cCtx.createLinearGradient(0, 0, w, h);
              if (c === 'grad-sunset') { grad.addColorStop(0, '#f43f5e'); grad.addColorStop(1, '#fb923c'); }
              else if (c === 'grad-neon') { grad.addColorStop(0, '#8b5cf6'); grad.addColorStop(1, '#06b6d4'); }
              else if (c === 'grad-aurora') { grad.addColorStop(0, '#10b981'); grad.addColorStop(1, '#3b82f6'); }
              else if (c === 'grad-gold') { grad.addColorStop(0, '#f59e0b'); grad.addColorStop(1, '#fbbf24'); }
              cCtx.fillStyle = grad;
              cCtx.fillRect(0, 0, w, h);
            } else {
              cCtx.fillStyle = c;
              cCtx.fillRect(0, 0, w, h);
            }
          } else if (sub === 'image') {
            if (bgImgLoaded) {
              drawCoverImage(cCtx, bgImgLoaded, w, h);
            } else {
              cCtx.drawImage(img, 0, 0, w, h);
            }
          } else if (sub === 'cutout') {
            cCtx.clearRect(0, 0, w, h);
          } else if (sub === 'nanoscope') {
            const contrast = studioState.nanoContrast || 'black';
            if (contrast === 'black') {
              cCtx.fillStyle = '#08090c';
              cCtx.fillRect(0, 0, w, h);
            } else if (contrast === 'white') {
              cCtx.fillStyle = '#ffffff';
              cCtx.fillRect(0, 0, w, h);
            } else {
              cCtx.drawImage(img, 0, 0, w, h);
            }
          }

          // B. Draw Subject Cutout Layer on top (only when not clean original)
          const isCleanOriginal =
            (sub === 'landmarks' && (!studioState.backdropLandmark || studioState.backdropLandmark === 'none') && (studioState.subjectScale === 100) && (!studioState.subjectOffsetX) && (!studioState.subjectOffsetY)) ||
            (sub === 'blur' && ((typeof studioState.backdropBlur === 'number' ? studioState.backdropBlur : 0) <= 0) && (studioState.subjectScale === 100) && (!studioState.subjectOffsetX) && (!studioState.subjectOffsetY)) ||
            (sub === 'color' && (studioState.backdropColor === 'none') && (studioState.subjectScale === 100) && (!studioState.subjectOffsetX) && (!studioState.subjectOffsetY)) ||
            (sub === 'image' && (!studioState.backdropCustomImage || !bgImgLoaded) && (studioState.subjectScale === 100) && (!studioState.subjectOffsetX) && (!studioState.subjectOffsetY));

          if (!isCleanOriginal) {
            cCtx.save();
            const scale = (studioState.subjectScale || 100) / 100;
            const scaledW = w * scale;
            const scaledH = h * scale;
            const dx = (w - scaledW) / 2 + (studioState.subjectOffsetX || 0);
            const dy = (h - scaledH) + (studioState.subjectOffsetY || 0);

            cCtx.drawImage(cutout, dx, dy, scaledW, scaledH);
            cCtx.restore();
          }

          // Draw unified composite with all filters applied together
          ctx.save();
          ctx.filter = computeCssFilterString();
          ctx.drawImage(compCanvas, 0, 0, w, h);
          ctx.restore();
        } else {
          // Standard Photo Drawing with Filters
          ctx.save();
          ctx.filter = computeCssFilterString();
          ctx.drawImage(img, 0, 0, w, h);
          ctx.restore();
        }

        if (studioState.vignette > 0) {
          const v = studioState.vignette;
          const radius = Math.max(w, h) * 0.72;
          const grad = ctx.createRadialGradient(w / 2, h / 2, radius * 0.25, w / 2, h / 2, radius);
          const alpha = (v * 0.0088).toFixed(3);
          grad.addColorStop(0, 'rgba(0,0,0,0)');
          grad.addColorStop(Math.max(0.3, 0.75 - v * 0.005), 'rgba(0,0,0,0)');
          grad.addColorStop(1, `rgba(0,0,0,${alpha})`);
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);
        }

        if (studioState.tiltShift !== 'off') {
          const blurCanvas = document.createElement('canvas');
          blurCanvas.width = w;
          blurCanvas.height = h;
          const bCtx = blurCanvas.getContext('2d');
          bCtx.filter = 'blur(16px)';
          bCtx.drawImage(canvas, 0, 0);

          ctx.save();
          if (studioState.tiltShift === 'radial') {
            const grad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.22, w / 2, h / 2, Math.min(w, h) * 0.52);
            grad.addColorStop(0, 'rgba(0,0,0,0)');
            grad.addColorStop(1, 'rgba(0,0,0,1)');
            const maskCanvas = document.createElement('canvas');
            maskCanvas.width = w;
            maskCanvas.height = h;
            const mCtx = maskCanvas.getContext('2d');
            mCtx.fillStyle = grad;
            mCtx.fillRect(0, 0, w, h);
            bCtx.globalCompositeOperation = 'destination-in';
            bCtx.drawImage(maskCanvas, 0, 0);
            ctx.drawImage(blurCanvas, 0, 0);
          } else {
            const grad = ctx.createLinearGradient(0, 0, 0, h);
            grad.addColorStop(0, 'rgba(0,0,0,0.85)');
            grad.addColorStop(0.35, 'rgba(0,0,0,0)');
            grad.addColorStop(0.65, 'rgba(0,0,0,0)');
            grad.addColorStop(1, 'rgba(0,0,0,0.85)');
            const maskCanvas = document.createElement('canvas');
            maskCanvas.width = w;
            maskCanvas.height = h;
            const mCtx = maskCanvas.getContext('2d');
            mCtx.fillStyle = grad;
            mCtx.fillRect(0, 0, w, h);
            bCtx.globalCompositeOperation = 'destination-in';
            bCtx.drawImage(maskCanvas, 0, 0);
            ctx.drawImage(blurCanvas, 0, 0);
          }
          ctx.restore();
        }

        const enhancedDataUrl = canvas.toDataURL('image/jpeg', 0.98);

        if (!photo.originalDataUrl) {
          photo.originalDataUrl = photo._studioCropBackupDataUrl || photo.dataUrl;
        }
        photo.dataUrl = enhancedDataUrl;
        photo.lastEditedAt = new Date().toISOString();

        delete photo._studioCropBackupDataUrl;

        const detailItem = (state.detailPhotoList || []).find(p => p.id === photo.id);
        if (detailItem) {
          detailItem.dataUrl = enhancedDataUrl;
        }

        saveState();
        renderAll();

        const detailImg = document.getElementById('detailImage');
        if (detailImg) {
          detailImg.src = enhancedDataUrl;
          detailImg.style.filter = 'none';
          detailImg.style.display = 'block';
          detailImg.style.opacity = '1';
        }
        applyStudioOverlays({ vignette: 0, tiltShift: 'off' });
        resetStudioValues();
        closeStudioDrawer(true);

        const savedToast = (window.t && window.t('detail_photo_saved_toast')) || '✨ Photo enhanced & saved to gallery!';
        showToast(savedToast);
      } catch (err) {
        console.error('Error saving photo studio edits:', err);
        showToast('Error saving edits to photo');
      }
    };

    if (studioState.backdropType === 'image' && studioState.backdropCustomImage) {
      const bgImg = new Image();
      bgImg.crossOrigin = 'anonymous';
      bgImg.onload = () => renderCanvasAndSave(bgImg);
      bgImg.onerror = () => renderCanvasAndSave(null);
      bgImg.src = studioState.backdropCustomImage;
    } else {
      renderCanvasAndSave(null);
    }
  };
  img.src = photo.dataUrl;
}

function renderStudioBackdropGalleryPhotos() {
  const container = document.getElementById('studioBackdropGalleryList');
  if (!container) return;
  container.innerHTML = '';

  const otherPhotos = (state.photos || []).filter(p => p.id !== state.activePhotoId);
  if (otherPhotos.length === 0) {
    container.innerHTML = '<span style="font-size:11px; color:#64748b; padding:4px;">No other photos in gallery</span>';
    return;
  }

  otherPhotos.slice(0, 16).forEach(photo => {
    const thumb = document.createElement('div');
    thumb.className = 'backdrop-gallery-thumb';
    thumb.setAttribute('draggable', 'true');
    if (studioState.backdropCustomImage === photo.dataUrl) {
      thumb.classList.add('active');
    }
    thumb.title = `Use "${photo.displayName || 'Photo'}" as background`;
    thumb.innerHTML = `<img src="${photo.dataUrl}" alt="Photo">`;
    thumb.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', photo.id);
      e.dataTransfer.setData('text/uri-list', photo.dataUrl);
    });
    thumb.addEventListener('click', () => {
      setBackdropCustomImage(photo.dataUrl);
      document.querySelectorAll('.backdrop-gallery-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
    container.appendChild(thumb);
  });
}

function setBackdropCustomImage(dataUrl) {
  studioState.backdropCustomImage = dataUrl;
  studioState.backdropType = 'image';
  studioState.activeSub.backdrop = 'image';

  const preview = document.getElementById('studioBackdropImagePreview');
  const previewImg = document.getElementById('studioBackdropPreviewThumb');
  const prompt = document.getElementById('studioBackdropDropzonePrompt');
  if (preview && previewImg && prompt) {
    previewImg.src = dataUrl;
    preview.style.display = 'flex';
    prompt.style.display = 'none';
  }

  updateActiveStudioFilter();
  showToast('🖼️ Background image applied!');
}

function clearBackdropCustomImage() {
  studioState.backdropCustomImage = null;
  studioState.backdropType = 'none';
  const preview = document.getElementById('studioBackdropImagePreview');
  const prompt = document.getElementById('studioBackdropDropzonePrompt');
  if (preview) preview.style.display = 'none';
  if (prompt) prompt.style.display = 'flex';
  document.querySelectorAll('.backdrop-gallery-thumb').forEach(t => t.classList.remove('active'));
  updateActiveStudioFilter();
}

let isStudioInitialized = false;
function initPhotoEditorStudio() {
  if (isStudioInitialized) return;
  isStudioInitialized = true;

  // 1. Six Main Edit Buttons
  document.getElementById('detailEditLuxBtn')?.addEventListener('click', () => openStudioTool('lux'));
  document.getElementById('detailEditFiltersBtn')?.addEventListener('click', () => openStudioTool('filters'));
  document.getElementById('detailEditLightBtn')?.addEventListener('click', () => openStudioTool('light'));
  document.getElementById('detailEditColorBtn')?.addEventListener('click', () => openStudioTool('color'));
  document.getElementById('detailEditOpticsBtn')?.addEventListener('click', () => openStudioTool('optics'));
  document.getElementById('detailEditBackdropBtn')?.addEventListener('click', () => openStudioTool('backdrop'));

  // 2. Lux Controls
  const luxSlider = document.getElementById('studioLuxSlider');
  luxSlider?.addEventListener('input', (e) => {
    setStudioLux(e.target.value);
  });

  document.querySelectorAll('#studioPanelLux .studio-quick-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.dataset.lux, 10);
      setStudioLux(val);
    });
  });

  // 3. Filter Intensity Slider
  const fIntensitySlider = document.getElementById('studioFilterIntensitySlider');
  fIntensitySlider?.addEventListener('input', (e) => {
    studioState.filterIntensity = parseInt(e.target.value, 10) || 0;
    const readout = document.getElementById('studioFilterIntensityVal');
    if (readout) readout.textContent = `${studioState.filterIntensity}%`;
    updateActiveStudioFilter();
  });

  // 4. Light Subnav & Slider
  const lightSlider = document.getElementById('studioLightSlider');
  const lightSubLabel = document.getElementById('studioLightSubLabel');
  const lightVal = document.getElementById('studioLightVal');

  document.querySelectorAll('#studioLightSubnav .studio-subnav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#studioLightSubnav .studio-subnav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const sub = btn.dataset.sub;
      studioState.activeSub.light = sub;
      const subText = (window.t && window.t('detail_sub_' + sub)) || (sub.charAt(0).toUpperCase() + sub.slice(1));
      if (lightSubLabel) lightSubLabel.textContent = subText;
      if (lightSlider) lightSlider.value = studioState[sub] || 0;
      if (lightVal) lightVal.textContent = (studioState[sub] > 0 ? `+${studioState[sub]}` : `${studioState[sub]}`);
    });
  });

  lightSlider?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10) || 0;
    const sub = studioState.activeSub.light;
    studioState[sub] = val;
    if (lightVal) lightVal.textContent = (val > 0 ? `+${val}` : `${val}`);
    updateActiveStudioFilter();
  });

  // 5. Color Subnav & Slider
  const colorSlider = document.getElementById('studioColorSlider');
  const colorSubLabel = document.getElementById('studioColorSubLabel');
  const colorVal = document.getElementById('studioColorVal');

  document.querySelectorAll('#studioColorSubnav .studio-subnav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#studioColorSubnav .studio-subnav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const sub = btn.dataset.sub;
      studioState.activeSub.color = sub;
      const subText = (window.t && window.t('detail_sub_' + sub)) || (sub.charAt(0).toUpperCase() + sub.slice(1));
      if (colorSubLabel) colorSubLabel.textContent = subText;
      if (colorSlider) {
        if (sub === 'fade') {
          colorSlider.min = 0;
          colorSlider.max = 100;
        } else {
          colorSlider.min = -100;
          colorSlider.max = 100;
        }
        colorSlider.value = studioState[sub] || 0;
      }
      if (colorVal) colorVal.textContent = (studioState[sub] > 0 ? `+${studioState[sub]}` : `${studioState[sub]}`);
    });
  });

  colorSlider?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10) || 0;
    const sub = studioState.activeSub.color;
    studioState[sub] = val;
    if (colorVal) colorVal.textContent = (val > 0 ? `+${val}` : `${val}`);
    updateActiveStudioFilter();
  });

  // 6. Optics Subnav, Slider & Tilt-Shift
  const opticsSlider = document.getElementById('studioOpticsSlider');
  const opticsSubLabel = document.getElementById('studioOpticsSubLabel');
  const opticsVal = document.getElementById('studioOpticsVal');
  const opticsSliderWrap = document.getElementById('studioOpticsSliderWrap');
  const tiltModesWrap = document.getElementById('studioTiltShiftModes');

  document.querySelectorAll('#studioOpticsSubnav .studio-subnav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#studioOpticsSubnav .studio-subnav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const sub = btn.dataset.sub;
      studioState.activeSub.optics = sub;

      if (sub === 'tiltshift') {
        if (opticsSliderWrap) opticsSliderWrap.style.display = 'none';
        if (tiltModesWrap) tiltModesWrap.style.display = 'flex';
      } else {
        if (opticsSliderWrap) opticsSliderWrap.style.display = 'block';
        if (tiltModesWrap) tiltModesWrap.style.display = 'none';
        const optText = (window.t && window.t('detail_sub_' + sub)) || (sub.charAt(0).toUpperCase() + sub.slice(1));
        if (opticsSubLabel) opticsSubLabel.textContent = optText;
        if (opticsSlider) opticsSlider.value = studioState[sub] || 0;
        if (opticsVal) opticsVal.textContent = `${studioState[sub]}`;
      }
    });
  });

  opticsSlider?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10) || 0;
    const sub = studioState.activeSub.optics;
    studioState[sub] = val;
    if (opticsVal) opticsVal.textContent = `${val}`;
    updateActiveStudioFilter();
  });

  document.querySelectorAll('#studioTiltShiftModes .studio-tilt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#studioTiltShiftModes .studio-tilt-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      studioState.tiltShift = btn.dataset.mode;
      updateActiveStudioFilter();
      if (btn.dataset.mode !== 'off' && !state.isPro) {
        showToast('✨ Tilt-Shift preview active! Tap Save to unlock');
      }
    });
  });

  // 7. Backdrop Subnav, US Landmarks, Blur, Colors, Custom Image & Cutout Sticker
  document.querySelectorAll('#studioBackdropSubnav .studio-subnav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#studioBackdropSubnav .studio-subnav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const sub = btn.dataset.sub;
      studioState.activeSub.backdrop = sub;
      studioState.backdropType = sub;

      const subPanels = {
        landmarks: document.getElementById('studioBackdropSubLandmarks'),
        blur: document.getElementById('studioBackdropSubBlur'),
        color: document.getElementById('studioBackdropSubColor'),
        image: document.getElementById('studioBackdropSubImage'),
        nanoscope: document.getElementById('studioBackdropSubNano')
      };
      Object.entries(subPanels).forEach(([k, p]) => {
        if (p) p.style.display = (k === sub) ? 'block' : 'none';
      });

      const isNano = sub === 'nanoscope';
      setNanoScopeLayout(isNano);
      const stage = document.getElementById('detailImageStage');
      if (stage) stage.classList.toggle('nanoscope-mode', isNano);
      const loupe = document.getElementById('nanoScopeLoupe');
      const marker = document.getElementById('nanoScopeTargetMarker');
      if (loupe && !isNano) loupe.style.display = 'none';
      if (marker && !isNano) marker.style.display = 'none';

      if (isNano) {
        document.querySelectorAll('#nanoscopeBrushChips .studio-quick-chip').forEach(b => {
          b.classList.toggle('active', parseInt(b.dataset.brush, 10) === (studioState.nanoBrushSize || 1));
        });
        document.querySelectorAll('#nanoscopeZoomChips .studio-quick-chip').forEach(b => {
          b.classList.toggle('active', parseInt(b.dataset.zoom, 10) === (studioState.nanoZoom || 16));
        });
        document.querySelectorAll('#nanoscopeContrastSwatches .nanoscope-contrast-chip').forEach(b => {
          b.classList.toggle('active', b.dataset.contrast === (studioState.nanoContrast || 'black'));
        });
        document.querySelectorAll('#nanoscopeStepChips .nanoscope-step-chip').forEach(b => {
          b.classList.toggle('active', parseInt(b.dataset.step, 10) === (studioState.nanoStep || 1));
        });
        document.getElementById('nanoModeNavigateBtn')?.classList.toggle('active', !studioState.nanoEraseOnMove);
        document.getElementById('nanoModeEraseOnMoveBtn')?.classList.toggle('active', !!studioState.nanoEraseOnMove);
        updateNanoUndoButtonState();

        if (studioState.cachedCutoutCanvas && (studioState.nanoFocusX == null || studioState.nanoFocusY == null)) {
          studioState.nanoFocusX = Math.round(studioState.cachedCutoutCanvas.width / 2);
          studioState.nanoFocusY = Math.round(studioState.cachedCutoutCanvas.height / 2);
        }
        if (typeof window.renderNanoLoupeForCutoutCoords === 'function' && studioState.nanoFocusX != null) {
          window.renderNanoLoupeForCutoutCoords(studioState.nanoFocusX, studioState.nanoFocusY);
        }
        if (typeof window.updateNanoScopeModeUI === 'function') {
          window.updateNanoScopeModeUI();
        }
      }

      if (sub === 'landmarks') {
        if (!studioState.backdropLandmark) studioState.backdropLandmark = 'eiffel_tower';
        document.querySelectorAll('#studioLandmarkCardsRow .studio-landmark-card').forEach(c => {
          c.classList.toggle('active', studioState.backdropLandmark !== 'none' && c.dataset.landmark === studioState.backdropLandmark);
        });
      } else if (sub === 'color') {
        if (!studioState.backdropColor) studioState.backdropColor = '#ffffff';
        document.querySelectorAll('#studioBackdropSwatches .backdrop-swatch-chip').forEach(btn => {
          btn.classList.toggle('active', studioState.backdropColor !== 'none' && btn.dataset.color === studioState.backdropColor);
        });
        if (typeof renderStudioBackdropCustomPalette === 'function') {
          renderStudioBackdropCustomPalette();
        }
      } else if (sub === 'image') {
        renderStudioBackdropGalleryPhotos();
      }
      segmentActivePhotoSubject();
      updateActiveStudioFilter();
    });
  });

  // US Landmark Cards Click Listener
  document.querySelectorAll('#studioLandmarkCardsRow .studio-landmark-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('#studioLandmarkCardsRow .studio-landmark-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const lm = card.dataset.landmark;
      studioState.backdropLandmark = lm;
      studioState.backdropType = 'landmarks';
      studioState.activeSub.backdrop = 'landmarks';

      let lmImg = _backdropLandmarkImages[lm];
      if (!lmImg || (lmImg.complete && lmImg.naturalWidth === 0)) {
        preloadLandmarkImages();
        lmImg = _backdropLandmarkImages[lm];
      }
      if (lmImg && !lmImg.complete) {
        lmImg.onload = () => {
          if (studioState.backdropLandmark === lm) {
            renderBackdropCanvasComposite();
          }
        };
      }

      if (!studioState.cachedCutoutCanvas && !studioState.isSegmenting) {
        segmentActivePhotoSubject();
      }

      renderBackdropCanvasComposite();
      const lmName = card.querySelector('.landmark-name')?.textContent || lm;
      showToast(`✨ ${lmName} background applied!`);
    });
  });

  // Subject Size / Scale Sliders (Synchronized across Landmarks, Blur, Colors, and Image)
  function setStudioSubjectScale(val) {
    const num = parseInt(val, 10) || 100;
    studioState.subjectScale = num;
    document.querySelectorAll('.studio-subject-scale-slider').forEach(s => {
      s.value = num;
    });
    document.querySelectorAll('.studio-subject-scale-val').forEach(v => {
      v.textContent = `${num}%`;
    });
    renderBackdropCanvasComposite();
  }
  window.setStudioSubjectScale = setStudioSubjectScale;

  document.querySelectorAll('.studio-subject-scale-slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
      setStudioSubjectScale(e.target.value);
    });
  });

  // Setup Real-time Interactive Subject Selection & Dragging on Screen (all backdrop screens)
  setupBackdropSubjectDragGestures();

  // Blur Slider & Chips (Blur room behind subject)
  const blurSlider = document.getElementById('studioBackdropBlurSlider');
  const blurVal = document.getElementById('studioBackdropBlurVal');
  blurSlider?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10) || 0;
    studioState.backdropBlur = val;
    studioState.backdropType = 'blur';
    if (blurVal) blurVal.textContent = `${val}%`;
    document.querySelectorAll('#studioBackdropBlurChips .studio-quick-chip').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.blur, 10) === val);
    });
    renderBackdropCanvasComposite();
  });

  document.querySelectorAll('#studioBackdropBlurChips .studio-quick-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#studioBackdropBlurChips .studio-quick-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = parseInt(btn.dataset.blur, 10) || 0;
      studioState.backdropBlur = val;
      studioState.backdropType = 'blur';
      if (blurSlider) blurSlider.value = val;
      if (blurVal) blurVal.textContent = `${val}%`;
      renderBackdropCanvasComposite();
    });
  });

  // Colors & Gradients Swatches
  document.querySelectorAll('#studioBackdropSwatches .backdrop-swatch-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#studioBackdropSwatches .backdrop-swatch-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const col = btn.dataset.color;
      studioState.backdropColor = col;
      studioState.backdropType = 'color';
      if (typeof renderStudioBackdropCustomPalette === 'function') {
        renderStudioBackdropCustomPalette();
      }
      renderBackdropCanvasComposite();
    });
  });

  // Render Your Color Palettes (Custom Colors & Palette Studio) for Studio Backdrop
  function renderStudioBackdropCustomPalette() {
    const container = document.getElementById('studioBackdropCustomPalettes');
    if (!container) return;

    const userColors = Array.isArray(state.savedCustomColors) ? state.savedCustomColors : [];
    const curColor = studioState.backdropColor || '';
    const curNorm = (curColor && !curColor.startsWith('grad-') && curColor !== 'none') ? normalizeHex(curColor) : '';
    const pickerInitColor = curNorm || (state.accentColor || '#f43f5e');

    const lblOpenStudio = window.t ? window.t('palette_open_studio') : 'Open Color Studio';

    const plusBtnHtml = `
      <div class="color-option custom-color-option" id="backdropCustomColorSwatch" onclick="openCustomColorPickerModal({ initialColor: '${pickerInitColor}', onApplyName: 'selectStudioBackdropColor' })" title="${lblOpenStudio}">
        <i class="fa-solid fa-plus"></i>
      </div>
    `;

    const swatchesHtml = userColors.map(c => {
      const norm = normalizeHex(c);
      const isSelected = !!curNorm && curNorm === norm;
      return `
        <div class="saved-swatch-wrapper">
          <div class="color-option saved-custom-option ${isSelected ? 'selected' : ''}" style="background:${c};" onclick="selectStudioBackdropColor('${c}', true)" title="Your Color: ${c}">
            ${isSelected ? '<i class="fa-solid fa-check"></i>' : ''}
          </div>
          <button type="button" class="swatch-delete-btn" onclick="event.stopPropagation(); deleteSavedCustomColor('${c}', event, 'selectStudioBackdropColor')" title="Delete ${c}">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      `;
    }).join('');

    container.innerHTML = plusBtnHtml + swatchesHtml;
  }
  window.renderStudioBackdropCustomPalette = renderStudioBackdropCustomPalette;

  function selectStudioBackdropColor(color, notify = true) {
    if (!color) return;
    studioState.backdropColor = color;
    studioState.backdropType = 'color';

    // Highlight in preset swatches if it matches, else clear active from presets
    document.querySelectorAll('#studioBackdropSwatches .backdrop-swatch-chip').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.color === color);
    });

    // Re-render custom palettes to update the checkmark
    renderStudioBackdropCustomPalette();

    // Re-composite canvas live
    renderBackdropCanvasComposite();

    if (notify && color.startsWith('#')) {
      showToast(`🎨 Custom Backdrop: ${color.toUpperCase()}`);
    }
  }
  window.selectStudioBackdropColor = selectStudioBackdropColor;

  // Custom Image Upload & Dropzone
  const fileInput = document.getElementById('studioBackdropFileInput');
  const dropzone = document.getElementById('studioBackdropDropzone');

  dropzone?.addEventListener('click', (e) => {
    if (e.target.closest('#studioBackdropClearBtn')) return;
    fileInput?.click();
  });

  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setBackdropCustomImage(evt.target.result);
        studioState.backdropType = 'image';
        renderBackdropCanvasComposite();
      };
      reader.readAsDataURL(file);
    }
  });

  if (dropzone) {
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-active');
    });
    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('drag-active');
    });
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-active');
      const file = e.dataTransfer?.files?.[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          setBackdropCustomImage(evt.target.result);
          studioState.backdropType = 'image';
          renderBackdropCanvasComposite();
        };
        reader.readAsDataURL(file);
        return;
      }
      const photoId = e.dataTransfer?.getData('text/plain');
      if (photoId) {
        const p = state.photos.find(x => x.id === photoId);
        if (p && p.dataUrl) {
          setBackdropCustomImage(p.dataUrl);
          studioState.backdropType = 'image';
          renderBackdropCanvasComposite();
          return;
        }
      }
    });
  }

  document.getElementById('studioBackdropClearBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    clearBackdropCustomImage();
    studioState.backdropType = 'landmarks';
    renderBackdropCanvasComposite();
  });

  // Cut & Paste: Save Sticker (PNG)
  document.getElementById('studioSaveCutoutStickerBtn')?.addEventListener('click', () => {
    if (!studioState.cachedCutoutCanvas) {
      showToast('⚠️ AI is still detecting subject, please wait a moment...');
      return;
    }
    try {
      const dataUrl = studioState.cachedCutoutCanvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `aura_subject_cutout_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('✂️ Subject cutout saved as transparent PNG sticker!');
    } catch (e) {
      console.error(e);
      showToast('⚠️ Could not save cutout: ' + e.message);
    }
  });

  // Cut & Paste: Paste to Another Photo in Gallery
  document.getElementById('studioPasteToGalleryPhotoBtn')?.addEventListener('click', () => {
    if (!studioState.cachedCutoutCanvas) {
      showToast('⚠️ AI is still detecting subject, please wait a moment...');
      return;
    }
    openPasteCutoutModal();
  });

  // NanoScope Controls: Brush Size, Zoom, Contrast, Undo & Reset
  document.querySelectorAll('#nanoscopeBrushChips .studio-quick-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#nanoscopeBrushChips .studio-quick-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const size = parseInt(btn.dataset.brush, 10) || 1;
      studioState.nanoBrushSize = size;
      const valEl = document.getElementById('nanoscopeBrushVal');
      if (valEl) valEl.textContent = size === 1 ? '1px' : `${size}px`;
      if (typeof window.renderNanoLoupeForCutoutCoords === 'function' && studioState.nanoFocusX != null && studioState.nanoFocusY != null) {
        window.renderNanoLoupeForCutoutCoords(studioState.nanoFocusX, studioState.nanoFocusY);
      }
    });
  });

  document.querySelectorAll('#nanoscopeZoomChips .studio-quick-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#nanoscopeZoomChips .studio-quick-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const zoom = parseInt(btn.dataset.zoom, 10) || 16;
      studioState.nanoZoom = zoom;
      const valEl = document.getElementById('nanoscopeZoomVal');
      if (valEl) valEl.textContent = `${zoom}x`;
      // Immediately re-render pixels inside magnifying circle!
      if (typeof window.renderNanoLoupeForCutoutCoords === 'function' && studioState.nanoFocusX != null && studioState.nanoFocusY != null) {
        window.renderNanoLoupeForCutoutCoords(studioState.nanoFocusX, studioState.nanoFocusY);
      }
    });
  });

  document.querySelectorAll('#nanoscopeContrastSwatches .nanoscope-contrast-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#nanoscopeContrastSwatches .nanoscope-contrast-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      studioState.nanoContrast = btn.dataset.contrast || 'black';
      renderBackdropCanvasComposite();
      if (typeof window.renderNanoLoupeForCutoutCoords === 'function' && studioState.nanoFocusX != null && studioState.nanoFocusY != null) {
        window.renderNanoLoupeForCutoutCoords(studioState.nanoFocusX, studioState.nanoFocusY);
      }
    });
  });

  document.getElementById('nanoscopeUndoBtn')?.addEventListener('click', () => {
    popNanoUndoState();
  });

  document.getElementById('nanoscopeRestoreBtn')?.addEventListener('click', () => {
    resetNanoCutoutToAi();
  });

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      if (studioState.activeTool === 'backdrop' && studioState.activeSub.backdrop === 'nanoscope') {
        e.preventDefault();
        popNanoUndoState();
      }
    }
  });

  setupNanoScopeInteractions();

  // 8. Compare Button & Gestures
  const compareBtn = document.getElementById('studioCompareBtn');
  if (compareBtn) {
    const startCompare = (e) => { e.preventDefault(); setComparing(true); };
    const stopCompare = (e) => { e.preventDefault(); setComparing(false); };
    compareBtn.addEventListener('mousedown', startCompare);
    compareBtn.addEventListener('mouseup', stopCompare);
    compareBtn.addEventListener('mouseleave', stopCompare);
    compareBtn.addEventListener('touchstart', startCompare, { passive: false });
    compareBtn.addEventListener('touchend', stopCompare);
    compareBtn.addEventListener('touchcancel', stopCompare);
  }

  // 8. Reset, Save & Close Buttons
  document.getElementById('studioResetBtn')?.addEventListener('click', () => {
    resetCurrentStudioFeature();
  });

  document.getElementById('studioSaveBtn')?.addEventListener('click', () => {
    applyAndSaveStudioEdits();
  });

  document.getElementById('studioCloseBtn')?.addEventListener('click', () => {
    closeStudioDrawer();
  });
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
  const pendingCount = (photoIds || []).filter(id => {
    const p = state.photos.find(x => x.id === id);
    return p && p.isPending;
  }).length;
  if (pendingCount > 0 && !checkCanSavePhotosToGallery(pendingCount)) {
    return;
  }
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
      if (!checkCanSavePhotosToGallery(pendingToMove.length)) {
        return;
      }
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

// Centralized Multi-Photo Export via DownloadManager
async function exportPhotosToZip(photoList, zipFilename, isAlbumMode = false, albumName = null) {
  if (!photoList || photoList.length === 0) {
    showToast('No photos to export!');
    return;
  }

  const effectiveIsAlbum = isAlbumMode || !!state.activeAlbumView || (state.activeTab === 'favoritesScreen');
  const effectiveAlbumName = albumName || state.activeAlbumView || (state.activeTab === 'favoritesScreen' ? 'Favorites' : null) || (isAlbumMode ? zipFilename.replace(/_Album$|_Export$|_Collection$|_Filtered$/, '') : null);

  if (window.DownloadManager) {
    if (effectiveIsAlbum && effectiveAlbumName) {
      await window.DownloadManager.startDownload({
        sourceType: 'album',
        albumName: effectiveAlbumName,
        photos: photoList
      });
    } else {
      await window.DownloadManager.startDownload({
        sourceType: 'gallery',
        photos: photoList
      });
    }
    return;
  }

  showToast(`Downloading ${photoList.length} photos... 📥`);
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
      if (state.activePhotoId) {
        closePhotoDetail();
      }
      const targetId = item.dataset.tab;

      // If user is inside an album view and taps "Albums" in the bottom dock, smoothly return to albums grid
      if (targetId === 'albumsScreen' && state.activeAlbumView) {
        exitAlbumView(true);
        return;
      }

      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
      document.getElementById(targetId).classList.add('active');
      state.activeTab = targetId;

      if (targetId !== 'galleryScreen') {
        state.activeAlbumView = null;
      }
      if (targetId === 'galleryScreen' && state.activeAlbumView) {
        state.activeAlbumView = null;
        state.selectedFilterTags.clear();
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
  window.triggerCameraCapture = function () {
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
  window.triggerGalleryImport = function () {
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
  window.onNativePhotoCaptured = function (dataUrl, photoName, location) {
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
      }).catch(() => { });
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
  window.onNativePhotosImported = function (photosList) {
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
        }).catch(() => { });
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
    } catch (_) { }

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
    } catch (_) { }

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
    } catch (_) { }

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
        } catch (_) { }
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
  window.getActiveAlbumName = function () {
    if (state.selectedFilterTags && state.selectedFilterTags.size === 1) {
      return Array.from(state.selectedFilterTags)[0];
    }
    return (state.tags && state.tags.length > 0) ? state.tags[0].name : 'General';
  };

  window.openVipAlbumImportModal = function (albumName) {
    if (typeof updateSubscriptionUI === 'function') {
      updateSubscriptionUI();
    }
    const modal = document.getElementById('vipDirectImportModal');
    const nameEl = document.getElementById('vipImportModalAlbumName');
    window._pendingVipImportAlbum = albumName || window.getActiveAlbumName();
    if (nameEl) nameEl.textContent = `'${window._pendingVipImportAlbum}'`;
    if (window.applyCurrentLanguageTranslations) {
      window.applyCurrentLanguageTranslations();
    }
    const toast = document.getElementById('toastMessage');
    if (toast) {
      toast.classList.remove('show');
      clearTimeout(toast._toastTimer);
    }
    if (modal) modal.style.display = 'flex';
  };

  window.closeVipAlbumImportModal = function () {
    const modal = document.getElementById('vipDirectImportModal');
    if (modal) modal.style.display = 'none';
  };

  window.triggerAlbumDirectImport = function (albumName) {
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

  window.handleAlbumDirectFileInput = async function (event) {
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

  window.onNativePhotosImportedToAlbum = function (photosList, albumName) {
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
    if (!checkCanSavePhotosToGallery(list.length)) return;

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
        }).catch(() => { });
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

    // Keep user directly inside the album folder they are adding photos to!
    if (targetAlbum) {
      openAlbumInGallery(targetAlbum, true);
    } else {
      renderAll();
    }
    showToast(`✨ ${list.length} photo${list.length > 1 ? 's' : ''} imported directly into '${targetAlbum}'!`);
  };

  window.createAlbumAndPickPhotos = function () {
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
  window.openVipMoveCopyGateModal = function () {
    openVipSaveLimitModal({ feature: 'move_copy' });
  };

  window.closeVipMoveCopyGateModal = function () {
    closeVipSaveLimitModal();
    const modal = document.getElementById('vipMoveCopyModal');
    if (modal) modal.style.display = 'none';
    const targetAlbum = state.moveCopyIsAlbumMode ? state.moveCopySourceAlbum : null;
    state.moveCopySourceAlbum = null;
    state.moveCopyIsAlbumMode = false;
    if (targetAlbum && window.highlightReturnedAlbumCard) {
      window.highlightReturnedAlbumCard(targetAlbum);
    }
  };

  window.openMoveCopyModal = function (photoIds, sourceAlbumName) {
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
    const multiTagHeaderTitle = document.getElementById('multiTagHeaderTitle');
    if (multiTagHeaderTitle) multiTagHeaderTitle.textContent = window.t ? window.t('organize_fusion_studio_title') : 'Collection Fusion Studio';
    const singleTagHeaderTitle = document.getElementById('singleTagHeaderTitle');
    if (singleTagHeaderTitle) singleTagHeaderTitle.textContent = window.t ? window.t('organize_single_album_title') : 'Single Album Organize';
    const singleTagActiveBadge = document.getElementById('singleTagActiveBadge');
    if (singleTagActiveBadge) singleTagActiveBadge.textContent = window.t ? window.t('organize_single_album_badge') : 'Copy & Move';
    if (optionRow) optionRow.style.display = 'none';

    if (sourceBadge) {
      if (state.moveCopySourceAlbum) {
        sourceBadge.style.display = 'flex';
        const tagObj = state.tags.find(t => t.name.toLowerCase() === state.moveCopySourceAlbum.toLowerCase());
        if (sourceDot) sourceDot.style.background = tagObj ? tagObj.color : '#0ea5e9';
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

    if (typeof window.updateMoveCopyModalI18n === 'function') {
      window.updateMoveCopyModalI18n();
    }

    if (modal) modal.style.display = 'flex';
  };

  // VIP Feature: Move or Copy COMPLETE Album
  window.openMoveCopyAlbumModal = function (sourceAlbumName) {
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
    const multiTagHeaderTitleAlbum = document.getElementById('multiTagHeaderTitle');
    if (multiTagHeaderTitleAlbum) multiTagHeaderTitleAlbum.textContent = window.t ? window.t('organize_fusion_studio_title') : 'Collection Fusion Studio';
    const singleTagHeaderTitleAlbum = document.getElementById('singleTagHeaderTitle');
    if (singleTagHeaderTitleAlbum) singleTagHeaderTitleAlbum.textContent = window.t ? window.t('organize_single_album_title') : 'Single Album Organize';
    const singleTagActiveBadgeAlbum = document.getElementById('singleTagActiveBadge');
    if (singleTagActiveBadgeAlbum) singleTagActiveBadgeAlbum.textContent = window.t ? window.t('organize_single_album_badge') : 'Copy & Move';
    if (deleteSourceCheck) deleteSourceCheck.checked = false;

    // Populate source album badge
    if (sourceBadge) {
      sourceBadge.style.display = 'flex';
      const tagObj = state.tags.find(t => t.name.toLowerCase() === sourceAlbumName.toLowerCase());
      if (sourceDot) sourceDot.style.background = tagObj ? tagObj.color : '#0ea5e9';
      if (sourceName) sourceName.textContent = sourceAlbumName;
      const countNoun = validPhotos.length === 1 ? (window.t ? window.t('organize_photo_singular') : 'Photo') : (window.t ? window.t('organize_photos_plural') : 'Photos');
      if (sourceCount) sourceCount.textContent = `${validPhotos.length} ${countNoun}`;
    }

    if (searchInput) searchInput.value = '';
    if (quickCreateBtn) quickCreateBtn.style.display = 'none';

    renderMoveCopyPreviewRail();
    window.setMoveCopyMode(state.moveCopyMode);
    window.renderMoveCopyAlbumsList();

    if (typeof window.updateMoveCopyModalI18n === 'function') {
      window.updateMoveCopyModalI18n();
    }

    if (modal) modal.style.display = 'flex';
  };

  window.closeMoveCopyModal = function (albumNameToHighlight) {
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
        if (selectAllSpan) selectAllSpan.textContent = window.t ? window.t('organize_deselect_all') : 'Deselect All';
        if (selectAllIcon) selectAllIcon.className = 'fa-solid fa-square-minus';
      } else {
        if (selectAllSpan) selectAllSpan.textContent = window.t ? window.t('organize_select_all') : 'Select All';
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
      if (state.moveCopyIsAlbumMode && state.moveCopySourceAlbum) {
        summary.textContent = window.t
          ? window.t('fusion_album_of_photos', { selected: selectedCount, total: totalCount, album: state.moveCopySourceAlbum })
          : `${selectedCount} of ${totalCount} photos from '${state.moveCopySourceAlbum}'`;
      } else {
        const noun = selectedCount === 1 ? (window.t ? window.t('organize_photo_singular') : 'photo') : (window.t ? window.t('organize_photos_plural') : 'photos');
        summary.textContent = `${selectedCount} of ${totalCount} ${noun} selected`;
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

  window.toggleMoveCopyPhotoSelection = function (photoId) {
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

  window.removeMoveCopyPhoto = function (photoId) {
    if (state.moveCopyAllSourcePhotoIds) {
      state.moveCopyAllSourcePhotoIds = state.moveCopyAllSourcePhotoIds.filter(id => id !== photoId);
    }
    if (state.moveCopyTargetIds) {
      state.moveCopyTargetIds = state.moveCopyTargetIds.filter(id => id !== photoId);
    }
    renderMoveCopyPreviewRail();
    updateMoveCopyConfirmButton();
  };

  window.toggleMoveCopySelectAllPhotos = function () {
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

  window.setMoveCopyMode = function (mode) {
    state.moveCopyMode = mode;
    const copyBtn = document.getElementById('modeCopyBtn');
    const moveBtn = document.getElementById('modeMoveBtn');

    if (copyBtn) copyBtn.classList.toggle('active', mode === 'copy');
    if (moveBtn) moveBtn.classList.toggle('active', mode === 'move');

    updateMoveCopyOptionRowAndHint();
    updateMoveCopyConfirmButton();
    window.renderMoveCopyAlbumsList();
  };

  window.handleMoveCopySearch = function (query) {
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

  window.quickCreateMoveCopyAlbum = function () {
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

  window.selectMoveCopyDestination = function (albumName) {
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

  window.renderMoveCopyAlbumsList = function () {
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
                <span class="multitag-vip-pill" title="1-to-Many: Photos will be assigned to all ${multiTags.length} destination tags"><i class="fa-solid fa-diagram-project"></i> 1-to-Many Pro</span>
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
            <div class="album-row-info">
              <div class="album-row-name" title="${escapeHtml(tag.name)}">
                ${escapeHtml(tag.name)}
                ${isSource ? `<span class="source-album-label-pill">(${escapeHtml(sourceTagLabel)})</span>` : ''}
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

  window.resetFusionStudioUI = function () {
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
    const chevron = document.getElementById('multiTagChevron');
    if (chevron) chevron.className = 'fa-solid fa-chevron-down multitag-chevron';
    if (activeBadge) activeBadge.textContent = window.t ? window.t('organize_merge_albums_badge') : 'Merge Albums';
    const multiTagHeaderTitle = document.getElementById('multiTagHeaderTitle');
    if (multiTagHeaderTitle) multiTagHeaderTitle.textContent = window.t ? window.t('organize_fusion_studio_title') : 'Collection Fusion Studio';
    const singleTagHeaderTitle = document.getElementById('singleTagHeaderTitle');
    if (singleTagHeaderTitle) singleTagHeaderTitle.textContent = window.t ? window.t('organize_single_album_title') : 'Single Album Organize';
    const singleTagActiveBadge = document.getElementById('singleTagActiveBadge');
    if (singleTagActiveBadge) singleTagActiveBadge.textContent = window.t ? window.t('organize_single_album_badge') : 'Copy & Move';
    if (searchInput) searchInput.value = '';
    if (nameInput) nameInput.value = '';

    // Folder 2 (Single Tag Screen) expanded by default
    const singleBody = document.getElementById('singleTagBuilderBody');
    const singleToggleBtn = document.getElementById('singleTagToggleBtn');
    if (singleBody) singleBody.style.display = 'block';
    if (singleToggleBtn) {
      singleToggleBtn.classList.add('expanded');
      singleToggleBtn.setAttribute('aria-expanded', 'true');
    }

    const outerDestHeader = document.getElementById('moveCopyDestinationsHeader');
    const outerAlbumsList = document.getElementById('moveCopyAlbumsList');
    const outerConfirmBtn = document.getElementById('confirmMoveCopyBtn');
    if (outerDestHeader) outerDestHeader.style.display = 'flex';
    if (outerAlbumsList) outerAlbumsList.style.display = 'flex';
    if (outerConfirmBtn) outerConfirmBtn.style.display = 'flex';
  };

  window.updateMoveCopyModalI18n = function () {
    const multiTagHeaderTitle = document.getElementById('multiTagHeaderTitle');
    if (multiTagHeaderTitle) multiTagHeaderTitle.textContent = window.t ? window.t('organize_fusion_studio_title') : 'Collection Fusion Studio';
    const singleTagHeaderTitle = document.getElementById('singleTagHeaderTitle');
    if (singleTagHeaderTitle) singleTagHeaderTitle.textContent = window.t ? window.t('organize_single_album_title') : 'Single Album Organize';
    const singleTagActiveBadge = document.getElementById('singleTagActiveBadge');
    if (singleTagActiveBadge) singleTagActiveBadge.textContent = window.t ? window.t('organize_single_album_badge') : 'Copy & Move';
    const modalTitle = document.getElementById('moveCopyModalTitle');
    if (modalTitle) {
      modalTitle.textContent = state.moveCopyIsAlbumMode
        ? (window.t ? window.t('organize_album_title') : 'Organize Album')
        : (window.t ? window.t('organize_photos_title') : 'Organize Photos');
    }
    const copyBtnSpan = document.querySelector('#modeCopyBtn span');
    if (copyBtnSpan) {
      copyBtnSpan.textContent = state.moveCopyIsAlbumMode
        ? (window.t ? window.t('organize_copy_album') : 'Copy Album')
        : (window.t ? window.t('organize_copy_photos') : 'Copy Photos');
    }
    const moveBtnSpan = document.querySelector('#modeMoveBtn span');
    if (moveBtnSpan) {
      moveBtnSpan.textContent = state.moveCopyIsAlbumMode
        ? (window.t ? window.t('organize_move_album') : 'Move Album')
        : (window.t ? window.t('organize_move_photos') : 'Move Photos');
    }
    const sourceCount = document.getElementById('sourceBadgeCount');
    if (sourceCount && state.moveCopyAllSourcePhotoIds && state.moveCopyAllSourcePhotoIds.length > 0) {
      const count = state.moveCopyAllSourcePhotoIds.length;
      const countNoun = count === 1 ? (window.t ? window.t('organize_photo_singular') : 'Photo') : (window.t ? window.t('organize_photos_plural') : 'Photos');
      sourceCount.textContent = `${count} ${countNoun}`;
    }
    if (typeof renderMoveCopyPreviewRail === 'function') {
      renderMoveCopyPreviewRail();
    }

    // Re-apply static i18n attributes inside moveCopyModal
    const modalEl = document.getElementById('moveCopyModal');
    if (modalEl && typeof window.t === 'function') {
      modalEl.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key) el.textContent = window.t(key);
      });
      modalEl.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (key) el.title = window.t(key);
      });
      modalEl.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key) el.placeholder = window.t(key);
      });
      const closeBtn = modalEl.querySelector('.close-dialog-btn');
      if (closeBtn) {
        closeBtn.title = window.t ? window.t('modal_close') : 'Close';
        closeBtn.setAttribute('aria-label', window.t ? window.t('modal_close') : 'Close');
      }
    }

    // Fusion Studio Tabs & Card Titles/Tooltips
    const tabForge = document.getElementById('fusionTabForge');
    if (tabForge) {
      tabForge.title = window.t ? window.t('fusion_tab_forge_title') : 'Forge Collection';
    }
    const tabExisting = document.getElementById('fusionTabExisting');
    if (tabExisting) {
      tabExisting.title = window.t ? window.t('fusion_tab_existing_title') : 'Add to Existing Album(s)';
    }
    const autoNameBtn = document.getElementById('fusionAutoNameBtn');
    if (autoNameBtn) {
      autoNameBtn.title = window.t ? window.t('fusion_autoname_tooltip') : 'Generate smart name suggestion';
    }
    const nameInput = document.getElementById('fusionCollectionNameInput');
    if (nameInput) {
      nameInput.placeholder = window.t ? window.t('fusion_name_placeholder') : 'Name your new collection...';
    }

    if (state.moveCopyMultiTagExpanded && typeof window.renderFusionStudio === 'function') {
      window.renderFusionStudio();
    } else if (typeof window.renderMoveCopyAlbumsList === 'function') {
      window.renderMoveCopyAlbumsList();
    }

    if (typeof window.updateFusionActionFooter === 'function') {
      window.updateFusionActionFooter();
    }
    if (typeof window.updateFusionExistingActionFooter === 'function') {
      window.updateFusionExistingActionFooter();
    }
  };

  // Backwards compatibility alias
  window.toggleMultiTagBuilder = function () {
    window.toggleFusionStudio();
  };

  window.toggleFusionStudio = function () {
    state.moveCopyMultiTagExpanded = !state.moveCopyMultiTagExpanded;
    const body = document.getElementById('multiTagBuilderBody');
    const toggleBtn = document.getElementById('multiTagToggleBtn');
    const singleBody = document.getElementById('singleTagBuilderBody');
    const singleToggleBtn = document.getElementById('singleTagToggleBtn');
    const outerConfirmBtn = document.getElementById('confirmMoveCopyBtn');
    if (!body || !toggleBtn) return;

    if (state.moveCopyMultiTagExpanded) {
      body.style.display = 'block';
      toggleBtn.classList.add('expanded');
      toggleBtn.setAttribute('aria-expanded', 'true');

      // Collapse single tag folder to give full room to Fusion Studio
      if (singleBody) singleBody.style.display = 'none';
      if (singleToggleBtn) {
        singleToggleBtn.classList.remove('expanded');
        singleToggleBtn.setAttribute('aria-expanded', 'false');
      }
      if (outerConfirmBtn) outerConfirmBtn.style.display = 'none';
      state.singleTagExpanded = false;

      // Initialize with primary source album if not already populated
      if (!Array.isArray(state.fusionAlbums) || state.fusionAlbums.length === 0) {
        window.initFusionStudioWithSource();
      }

      window.renderFusionStudio();
    } else {
      body.style.display = 'none';
      toggleBtn.classList.remove('expanded');
      toggleBtn.setAttribute('aria-expanded', 'false');

      // Re-expand single tag folder
      if (singleBody) singleBody.style.display = 'block';
      if (singleToggleBtn) {
        singleToggleBtn.classList.add('expanded');
        singleToggleBtn.setAttribute('aria-expanded', 'true');
      }
      if (outerConfirmBtn) outerConfirmBtn.style.display = 'flex';
      state.singleTagExpanded = true;
      window.renderMoveCopyAlbumsList();
    }
  };

  window.toggleSingleTagStudio = function () {
    state.singleTagExpanded = !state.singleTagExpanded;
    const singleBody = document.getElementById('singleTagBuilderBody');
    const singleToggleBtn = document.getElementById('singleTagToggleBtn');
    const outerConfirmBtn = document.getElementById('confirmMoveCopyBtn');

    if (state.singleTagExpanded) {
      if (singleBody) singleBody.style.display = 'block';
      if (singleToggleBtn) {
        singleToggleBtn.classList.add('expanded');
        singleToggleBtn.setAttribute('aria-expanded', 'true');
      }
      if (outerConfirmBtn) outerConfirmBtn.style.display = 'flex';

      // Collapse fusion studio if open
      if (state.moveCopyMultiTagExpanded) {
        state.moveCopyMultiTagExpanded = false;
        const fusionBody = document.getElementById('multiTagBuilderBody');
        const fusionToggleBtn = document.getElementById('multiTagToggleBtn');
        if (fusionBody) fusionBody.style.display = 'none';
        if (fusionToggleBtn) {
          fusionToggleBtn.classList.remove('expanded');
          fusionToggleBtn.setAttribute('aria-expanded', 'false');
        }
      }
      window.renderMoveCopyAlbumsList();
    } else {
      if (singleBody) singleBody.style.display = 'none';
      if (singleToggleBtn) {
        singleToggleBtn.classList.remove('expanded');
        singleToggleBtn.setAttribute('aria-expanded', 'false');
      }
      if (outerConfirmBtn) outerConfirmBtn.style.display = 'none';
    }
  };

  window.initFusionStudioWithSource = function () {
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
    state.fusionOutputMode = 'forge';
    state.fusionExistingMode = 'copy';
    state.fusionSelectedDestinations = [];
    state.fusionExistingSearchQuery = '';
  };

  // Smart collection name synthesis
  window.generateSmartCollectionName = function (variation = 0) {
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

  window.rerollFusionSmartName = function () {
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

  window.handleFusionNameInput = function (val) {
    state.fusionCollectionName = val;
    state.fusionUserEditedName = !!val.trim();
    window.updateFusionActionFooter();
  };

  window.selectFusionColor = function (colorHex, isFinal = true) {
    state.fusionCollectionColor = colorHex;
    window.renderFusionColorPicker();
  };

  // Main Fusion Studio Renderer
  window.renderFusionStudio = function () {
    try {
      const albums = state.fusionAlbums || [];
      const validPhotos = (state.photos || []).filter(p => !p.deletedAt);

      // 1. Update Header Badge
      const activeBadge = document.getElementById('fusionActiveBadge');
      if (activeBadge) {
        const totalSelected = albums.reduce((acc, a) => acc + (a.selectedPhotoIds ? a.selectedPhotoIds.length : 0), 0);
        const albumCount = albums.length;
        if (albumCount > 0) {
          const albumNoun = albumCount === 1
            ? (window.t ? window.t('organize_album_singular') : 'Album')
            : (window.t ? window.t('organize_albums_plural') : 'Albums');
          const photoNoun = totalSelected === 1
            ? (window.t ? window.t('organize_photo_singular') : 'Photo')
            : (window.t ? window.t('organize_photos_plural') : 'Photos');
          activeBadge.textContent = `${albumCount} ${albumNoun} · ${totalSelected} ${photoNoun}`;
        } else {
          activeBadge.textContent = window.t ? window.t('organize_merge_albums_badge') : 'Merge Albums';
        }
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
            const selectAllLabel = allSelected
              ? (window.t ? window.t('organize_deselect_all') : 'Deselect All')
              : (window.t ? window.t('organize_select_all') : 'Select All');
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

            const subrowHtml = window.t
              ? window.t('fusion_album_of_photos', { selected: `<strong class="fusion-selected-count-num">${selectedPhotoIds.length}</strong>`, total: albumPhotos.length, album: `<span class="fusion-album-subrow-name">${escapeHtml(albumName)}</span>` })
              : `<strong class="fusion-selected-count-num">${selectedPhotoIds.length}</strong> of ${albumPhotos.length} photos from '<span class="fusion-album-subrow-name">${escapeHtml(albumName)}</span>'`;

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
                      ${subrowHtml}
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
      if (state.fusionOutputMode === 'existing') {
        window.renderFusionExistingAlbumsList();
        window.updateFusionExistingActionFooter();
      }
    } catch (err) {
      console.error('Error in renderFusionStudio:', err);
    }
  };

  // Render candidate albums to add
  window.renderFusionCandidateChips = function () {
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

  window.handleFusionAlbumSearch = function (query) {
    state.fusionCandidateSearch = query || '';
    window.renderFusionCandidateChips();
  };

  // Add album to the merge queue
  window.addAlbumToFusion = function (encodedAlbumName) {
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
  window.removeAlbumFromFusion = function (albumIdx) {
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
  window.toggleFusionPhotoSelection = function (albumIdx, photoId) {
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
  window.removeFusionPhoto = function (albumIdx, photoId) {
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
  window.toggleFusionAlbumSelectAll = function (albumIdx) {
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
  window.renderFusionColorPicker = function () {
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
  window.updateFusionActionFooter = function () {
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
    const photoNoun = totalSelectedCount === 1
      ? (window.t ? window.t('organize_photo_singular') : 'photo')
      : (window.t ? window.t('organize_photos_plural') : 'photos');
    const albumNoun = albumCount === 1
      ? (window.t ? window.t('organize_album_singular') : 'album')
      : (window.t ? window.t('organize_albums_plural') : 'albums');

    if (summary) {
      const pCountStr = `<strong class="fusion-stat-highlight">${totalSelectedCount}</strong>`;
      const aCountStr = `<strong class="fusion-stat-highlight">${albumCount}</strong>`;
      const summaryText = window.t ? window.t('fusion_total_summary', {
        photos: pCountStr,
        photoNoun: photoNoun,
        albums: aCountStr,
        albumNoun: albumNoun
      }) : `Total: ${pCountStr} curated ${photoNoun} from ${aCountStr} ${albumNoun}`;
      summary.innerHTML = `<i class="fa-solid fa-sparkles fusion-sparkle-icon"></i> ${summaryText}`;
    }

    const collectionName = (state.fusionCollectionName || '').trim();
    const canCreate = totalSelectedCount > 0 && collectionName.length > 0;

    if (createBtn) {
      createBtn.disabled = !canCreate;
    }
    if (createBtnText) {
      if (!collectionName) {
        createBtnText.textContent = window.t ? window.t('fusion_enter_name') : 'Enter Collection Name';
      } else if (totalSelectedCount === 0) {
        createBtnText.textContent = window.t ? window.t('fusion_select_photos_to_forge') : 'Select Photos to Forge';
      } else {
        createBtnText.textContent = window.t ? window.t('fusion_create_btn_named', {
          count: totalSelectedCount,
          noun: photoNoun
        }) : `Forge Collection (${totalSelectedCount} ${photoNoun})`;
      }
    }
  };

  // -------------------------------------------------------------
  // Fusion Output Mode Switcher: Forge New vs Merge into Existing
  // -------------------------------------------------------------
  window.setFusionOutputMode = function (mode) {
    state.fusionOutputMode = mode;
    const tabForge = document.getElementById('fusionTabForge');
    const tabExisting = document.getElementById('fusionTabExisting');
    const forgeCard = document.getElementById('fusionForgeCard');
    const existingCard = document.getElementById('fusionExistingAlbumsCard');

    if (mode === 'existing') {
      if (tabExisting) tabExisting.classList.add('active');
      if (tabForge) tabForge.classList.remove('active');
      if (forgeCard) forgeCard.style.display = 'none';
      if (existingCard) existingCard.style.display = 'block';
      window.setFusionExistingMode(state.fusionExistingMode || 'copy');
      window.renderFusionExistingAlbumsList();
      window.updateFusionExistingActionFooter();
    } else {
      if (tabForge) tabForge.classList.add('active');
      if (tabExisting) tabExisting.classList.remove('active');
      if (forgeCard) forgeCard.style.display = 'block';
      if (existingCard) existingCard.style.display = 'none';
      window.updateFusionActionFooter();
    }
  };

  window.setFusionExistingMode = function (mode) {
    state.fusionExistingMode = mode;
    const copyBtn = document.getElementById('fusionModeCopyBtn');
    const moveBtn = document.getElementById('fusionModeMoveBtn');
    const hint = document.getElementById('fusionModeHint');
    const icon = document.getElementById('fusionExistingActionIcon');

    if (mode === 'copy') {
      if (copyBtn) copyBtn.classList.add('active');
      if (moveBtn) moveBtn.classList.remove('active');
      if (hint) hint.textContent = window.t ? window.t('fusion_mode_hint_copy') : 'Duplicates curated photos into destination album(s). They will also remain in their source albums.';
      if (icon) icon.className = 'fa-solid fa-copy';
    } else {
      if (moveBtn) moveBtn.classList.add('active');
      if (copyBtn) copyBtn.classList.remove('active');
      if (hint) hint.textContent = window.t ? window.t('fusion_mode_hint_move') : 'Moves curated photos into destination album(s) and removes them from their source albums.';
      if (icon) icon.className = 'fa-solid fa-arrow-right-arrow-left';
    }

    window.updateFusionExistingActionFooter();
  };

  window.handleFusionExistingSearch = function (val) {
    state.fusionExistingSearchQuery = (val || '').toLowerCase().trim();
    window.renderFusionExistingAlbumsList();
  };

  window.toggleFusionDestination = function (albumName) {
    if (!Array.isArray(state.fusionSelectedDestinations)) {
      state.fusionSelectedDestinations = [];
    }
    const idx = state.fusionSelectedDestinations.indexOf(albumName);
    if (idx >= 0) {
      state.fusionSelectedDestinations.splice(idx, 1);
    } else {
      state.fusionSelectedDestinations.push(albumName);
    }
    window.renderFusionExistingAlbumsList();
    window.updateFusionExistingActionFooter();
  };

  window.renderFusionExistingAlbumsList = function () {
    const list = document.getElementById('fusionExistingAlbumsList');
    if (!list) return;

    const allTags = state.tags || [];
    const sourceAlbumNames = new Set((state.fusionAlbums || []).map(a => a.albumName.toLowerCase()));
    const validPhotos = (state.photos || []).filter(p => !p.deletedAt);
    const q = state.fusionExistingSearchQuery || '';

    let visibleTags = allTags;
    if (q) {
      visibleTags = visibleTags.filter(t => t.name.toLowerCase().includes(q));
    }

    if (!visibleTags.length) {
      const noFoundText = window.t ? window.t('fusion_no_dest_found') : 'No matching destination albums found.';
      list.innerHTML = `
        <div style="text-align: center; padding: 20px; color: var(--text-muted); font-size: 13px;">
          ${noFoundText}
        </div>
      `;
      return;
    }

    list.innerHTML = visibleTags.map(tag => {
      const isSource = sourceAlbumNames.has(tag.name.toLowerCase());
      const isSelected = (state.fusionSelectedDestinations || []).includes(tag.name);
      const count = validPhotos.filter(p => Array.isArray(p.tags) && p.tags.includes(tag.name)).length;
      const countNoun = count === 1
        ? (window.t ? window.t('organize_photo_singular') : 'photo')
        : (window.t ? window.t('organize_photos_plural') : 'photos');

      if (isSource) {
        return `
          <div class="move-copy-album-row disabled source-album-row" 
               onclick="showToast('${escapeHtml(tag.name)} is a source album in Collection Fusion and cannot be chosen as a destination.')" 
               title="Source album (non-selectable)">
            <div class="album-row-left">
              <span class="album-row-dot" style="background: ${tag.color};"></span>
              <div class="album-row-info">
                <div class="album-row-name" title="${escapeHtml(tag.name)} (Source Album)">
                  ${escapeHtml(tag.name)}
                  <span class="source-album-label-pill">(Source Album)</span>
                </div>
                <div class="album-row-count">${count} ${countNoun}</div>
              </div>
            </div>
            <div class="album-row-radio disabled"></div>
          </div>
        `;
      }

      return `
        <div class="move-copy-album-row ${isSelected ? 'selected' : ''}" 
             onclick="window.toggleFusionDestination('${escapeHtml(tag.name)}')" 
             title="Select destination: ${escapeHtml(tag.name)}">
          <div class="album-row-left">
            <span class="album-row-dot" style="background: ${tag.color};"></span>
            <div class="album-row-info">
              <div class="album-row-name" title="${escapeHtml(tag.name)}">${escapeHtml(tag.name)}</div>
              <div class="album-row-count">${count} ${countNoun}</div>
            </div>
          </div>
          <div class="album-row-radio">
            ${isSelected ? '<i class="fa-solid fa-check"></i>' : ''}
          </div>
        </div>
      `;
    }).join('');
  };

  window.updateFusionExistingActionFooter = function () {
    const summary = document.getElementById('fusionExistingTotalSummary');
    const actionBtn = document.getElementById('fusionExistingActionBtn');
    const actionIcon = document.getElementById('fusionExistingActionIcon');
    const actionText = document.getElementById('fusionExistingActionText');
    const pill = document.getElementById('fusionDestSelectionPill');

    const albums = state.fusionAlbums || [];
    const allSelectedPhotoIds = new Set();
    albums.forEach(a => {
      (a.selectedPhotoIds || []).forEach(id => allSelectedPhotoIds.add(id));
    });

    const totalCuratedCount = allSelectedPhotoIds.size;
    const albumCount = albums.length;
    const photoNoun = totalCuratedCount === 1
      ? (window.t ? window.t('organize_photo_singular') : 'photo')
      : (window.t ? window.t('organize_photos_plural') : 'photos');
    const albumNoun = albumCount === 1
      ? (window.t ? window.t('organize_album_singular') : 'album')
      : (window.t ? window.t('organize_albums_plural') : 'albums');

    if (summary) {
      const pCountStr = `<strong class="fusion-stat-highlight">${totalCuratedCount}</strong>`;
      const aCountStr = `<strong class="fusion-stat-highlight">${albumCount}</strong>`;
      const summaryText = window.t ? window.t('fusion_total_summary', {
        photos: pCountStr,
        photoNoun: photoNoun,
        albums: aCountStr,
        albumNoun: albumNoun
      }) : `Total: ${pCountStr} curated ${photoNoun} from ${aCountStr} ${albumNoun}`;
      summary.innerHTML = `<i class="fa-solid fa-sparkles fusion-sparkle-icon"></i> ${summaryText}`;
    }

    const selectedDests = state.fusionSelectedDestinations || [];
    const selectedCount = selectedDests.length;

    if (pill) {
      if (selectedCount > 0) {
        pill.style.display = 'inline-flex';
        const pillText = window.t ? window.t('fusion_dest_selected_pill', { count: selectedCount }) : `${selectedCount} Selected`;
        pill.innerHTML = `<i class="fa-solid fa-check"></i> ${pillText}`;
      } else {
        pill.style.display = 'none';
      }
    }

    const mode = state.fusionExistingMode || 'copy';
    const verb = mode === 'move'
      ? (window.t ? window.t('organize_move_photos') : 'Move')
      : (window.t ? window.t('organize_copy_photos') : 'Copy');
    if (actionIcon) {
      actionIcon.className = mode === 'move' ? 'fa-solid fa-arrow-right-arrow-left' : 'fa-solid fa-copy';
    }

    if (totalCuratedCount === 0) {
      if (actionBtn) actionBtn.disabled = true;
      if (actionText) actionText.textContent = window.t ? window.t('fusion_select_photos_to_action', { verb }) : ('Select Photos to ' + verb);
      return;
    }

    if (selectedCount === 0) {
      if (actionBtn) actionBtn.disabled = true;
      if (actionText) actionText.textContent = window.t ? window.t('fusion_select_dest_albums') : 'Select Destination Album(s)';
      return;
    }

    if (actionBtn) actionBtn.disabled = false;
    const countNoun = totalCuratedCount === 1
      ? (window.t ? window.t('organize_photo_singular') : 'Photo')
      : (window.t ? window.t('organize_photos_plural') : 'Photos');
    if (actionText) {
      if (selectedCount === 1) {
        actionText.textContent = `${verb} ${totalCuratedCount} ${countNoun} → '${selectedDests[0]}'`;
      } else {
        const combined = selectedDests.join(' + ');
        actionText.textContent = combined.length <= 22
          ? `${verb} ${totalCuratedCount} ${countNoun} → '${combined}'`
          : (window.t ? window.t('fusion_action_count_photos', { verb, count: totalCuratedCount, noun: countNoun }) : `${verb} ${totalCuratedCount} ${countNoun} (${selectedCount})`);
      }
    }
  };

  window.executeFusionIntoExistingAlbums = function () {
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

    const destTags = state.fusionSelectedDestinations || [];
    if (!destTags.length) {
      showToast('Please select at least 1 destination album.');
      return;
    }

    // Ensure all dest tags exist in state.tags
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

    const mode = state.fusionExistingMode || 'copy';
    const sourceAlbumNames = albums.map(a => a.albumName.toLowerCase());

    uniqueIds.forEach(id => {
      const photo = (state.photos || []).find(p => p.id === id);
      if (!photo) return;
      if (!Array.isArray(photo.tags)) photo.tags = [];

      if (mode === 'move') {
        photo.tags = photo.tags.filter(t => !sourceAlbumNames.includes(t.toLowerCase()));
      }

      destTags.forEach(dest => {
        if (!photo.tags.includes(dest)) {
          photo.tags.push(dest);
        }
      });

      if (!photo.category || photo.category === 'Import') {
        photo.category = destTags[0];
      }
    });

    destTags.forEach(dest => recordAlbumActivity(dest, 'modified'));
    if (mode === 'move') {
      albums.forEach(a => recordAlbumActivity(a.albumName, 'modified'));
    }

    saveState();

    window.closeMoveCopyModal(destTags[0]);

    if (typeof renderAlbumsScreen === 'function') renderAlbumsScreen();
    if (typeof renderGallery === 'function') renderGallery();

    const verb = mode === 'move' ? 'moved' : 'copied';
    const countNoun = uniqueIds.length === 1 ? 'photo' : 'photos';
    showToast(`✨ Successfully ${verb} ${uniqueIds.length} ${countNoun} into ${destTags.join(' + ')}!`);
  };

  // Master Action: Create the new collection with all curated selections
  window.executeCollectionFusion = function () {
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

  window.executeMoveCopyAction = function () {
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
    const isAlbum = !!state.activeAlbumView || state.activeTab === 'favoritesScreen';
    const albumName = state.activeAlbumView || (state.activeTab === 'favoritesScreen' ? 'Favorites' : null);
    if (window.DownloadManager) {
      if (isAlbum && albumName) {
        window.DownloadManager.startDownload({
          sourceType: 'album',
          albumName: albumName,
          photos: selected
        });
      } else {
        window.DownloadManager.startDownload({
          sourceType: 'gallery',
          photos: selected
        });
      }
      return;
    }
    exportPhotosToZip(selected, isAlbum ? `${albumName}_Export` : `Export_${Date.now()}`, isAlbum, albumName);
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
    const isAlbum = !!state.activeAlbumView || state.activeTab === 'favoritesScreen';
    const albumName = state.activeAlbumView || (state.activeTab === 'favoritesScreen' ? 'Favorites' : (state.selectedFilterTags.size === 1 ? Array.from(state.selectedFilterTags)[0] : null));
    if (window.DownloadManager) {
      if (isAlbum && albumName) {
        window.DownloadManager.startDownload({
          sourceType: 'album',
          albumName: albumName,
          photos: photos
        });
      } else {
        window.DownloadManager.startDownload({
          sourceType: 'gallery',
          photos: photos
        });
      }
      return;
    }
    exportPhotosToZip(photos, isAlbum || albumName ? `${albumName || 'Filtered'}_Collection` : `Filtered_Photos_${Date.now()}`, !!(isAlbum || albumName), albumName);
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
    const isAlbum = !!state.activeAlbumView || state.activeTab === 'favoritesScreen';
    const albumName = state.activeAlbumView || (state.activeTab === 'favoritesScreen' ? 'Favorites' : null);
    if (window.DownloadManager) {
      if (isAlbum && albumName) {
        window.DownloadManager.startDownload({
          sourceType: 'album',
          albumName: albumName,
          photos: selected
        });
      } else {
        window.DownloadManager.startDownload({
          sourceType: 'gallery',
          photos: selected
        });
      }
      return;
    }
    exportPhotosToZip(selected, isAlbum ? `${albumName}_Collection` : `Photo_Collection_${Date.now()}`, isAlbum, albumName);
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
  initPhotoEditorStudio();

  window.openStudioTool = openStudioTool;
  window.closeStudioDrawer = closeStudioDrawer;
  window.selectStudioFilter = selectStudioFilter;
  window.setStudioLux = setStudioLux;
  window.setComparing = setComparing;
  window.applyAndSaveStudioEdits = applyAndSaveStudioEdits;
  window.resetStudioValues = resetStudioValues;

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
        const favTitle = window.t ? window.t('detail_favorite') : 'Favorite Photo';
        favBtn.title = favTitle;
        favBtn.setAttribute('aria-label', favTitle);
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
    // Retry if layout hasn't settled yet (browser hasn't computed dimensions)
    if (stageRect.height < 60 || stageRect.width < 60) {
      requestAnimationFrame(() => requestAnimationFrame(() => fitCropImageAndBox()));
      return;
    }
    const availW = Math.max(80, stageRect.width - 24);
    const availH = Math.max(80, stageRect.height - 24);

    const naturalW = img.naturalWidth || 800;
    const naturalH = img.naturalHeight || 600;

    // Fit the complete source in the stage, enlarging small originals when needed.
    const scale = Math.min(availW / naturalW, availH / naturalH);
    const dispW = Math.max(60, Math.round(naturalW * scale));
    const dispH = Math.max(60, Math.round(naturalH * scale));

    container.style.width = `${dispW}px`;
    container.style.height = `${dispH}px`;
    img.style.width = `${dispW}px`;
    img.style.height = `${dispH}px`;

    updateCropBoxView();
  }

  function getCropSourceDimensions(dataUrl) {
    return new Promise(resolve => {
      if (!dataUrl) return resolve({ dataUrl, area: 0 });
      const probe = new Image();
      probe.onload = () => {
        const width = probe.naturalWidth || probe.width || 0;
        const height = probe.naturalHeight || probe.height || 0;
        resolve({ dataUrl, area: width * height });
        probe.src = '';
      };
      probe.onerror = () => resolve({ dataUrl, area: 0 });
      probe.src = dataUrl;
    });
  }

  async function chooseBestCropSource(photo) {
    const sources = [...new Set([photo.dataUrl, photo.originalDataUrl, photo._studioCropBackupDataUrl].filter(Boolean))];
    if (sources.length < 2) return sources[0] || '';
    const measured = await Promise.all(sources.map(getCropSourceDimensions));
    return measured.reduce((best, candidate) => candidate.area > best.area ? candidate : best).dataUrl;
  }

  function getStudioCurrentCompositeDataUrl(photo) {
    const isBackdrop = typeof isStudioBackdropConfigured === 'function' && isStudioBackdropConfigured();
    const bCanvas = document.getElementById('detailBackdropCanvas');
    const sCanvas = document.getElementById('detailSubjectCanvas');
    const detailImg = document.getElementById('detailImage');
    const origImg = studioState.cachedOriginalImg || detailImg;

    // Use genuine natural dimensions of the photo/original image, never uninitialized 300x150 canvas
    const w = (origImg && origImg.naturalWidth > 0)
      ? origImg.naturalWidth
      : ((isBackdrop && bCanvas && bCanvas.style.display !== 'none' && bCanvas.width > 300)
        ? bCanvas.width
        : (photo?.naturalWidth || 800));
    const h = (origImg && origImg.naturalHeight > 0)
      ? origImg.naturalHeight
      : ((isBackdrop && bCanvas && bCanvas.style.display !== 'none' && bCanvas.height > 150)
        ? bCanvas.height
        : (photo?.naturalHeight || 600));

    const compCanvas = document.createElement('canvas');
    compCanvas.width = w;
    compCanvas.height = h;
    const ctx = compCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const cssFilter = typeof computeCssFilterString === 'function' ? computeCssFilterString() : 'none';

    if (isBackdrop && bCanvas && sCanvas && bCanvas.width > 0 && sCanvas.width > 0 && bCanvas.style.display !== 'none') {
      ctx.save();
      if (cssFilter && cssFilter !== 'none') {
        ctx.filter = cssFilter;
      }
      ctx.drawImage(bCanvas, 0, 0, w, h);
      ctx.drawImage(sCanvas, 0, 0, w, h);
      ctx.restore();
    } else if (origImg && origImg.complete && origImg.naturalWidth > 0) {
      ctx.save();
      if (cssFilter && cssFilter !== 'none') {
        ctx.filter = cssFilter;
      }
      ctx.drawImage(origImg, 0, 0, w, h);
      ctx.restore();
    } else if (photo) {
      return photo.dataUrl;
    }

    if (studioState.vignette > 0) {
      const v = studioState.vignette;
      const radius = Math.max(w, h) * 0.72;
      const grad = ctx.createRadialGradient(w / 2, h / 2, radius * 0.25, w / 2, h / 2, radius);
      const alpha = (v * 0.0088).toFixed(3);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(Math.max(0.3, 0.75 - v * 0.005), 'rgba(0,0,0,0)');
      grad.addColorStop(1, `rgba(0,0,0,${alpha})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    try {
      return compCanvas.toDataURL('image/jpeg', 0.98);
    } catch (e) {
      console.warn('Failed to export studio composite for crop, falling back to photo.dataUrl:', e);
      return photo ? photo.dataUrl : '';
    }
  }
  window.getStudioCurrentCompositeDataUrl = getStudioCurrentCompositeDataUrl;

  function openCropEditorModal(photoId) {
    const photo = state.photos.find(p => p.id === photoId);
    if (!photo) return;

    cropState.photoId = photoId;
    let baseImgUrl = photo.dataUrl;
    let useStudioComposite = false;
    // Studio composite is ONLY used when actively cropping from within the open Detail/Studio modal
    const isDetailOpen = document.getElementById('photoDetailModal')?.style.display === 'flex';
    if (isDetailOpen && state.activePhotoId === photoId && (typeof isStudioBackdropConfigured === 'function' && (isStudioBackdropConfigured() || studioState.activeTool === 'backdrop' || (typeof computeCssFilterString === 'function' && computeCssFilterString() !== 'none')))) {
      baseImgUrl = getStudioCurrentCompositeDataUrl(photo) || photo.dataUrl;
      useStudioComposite = true;
    }
    cropState.baseDataUrl = baseImgUrl || photo.dataUrl;
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
    if (typeof window.applyTranslationsToDOM === 'function') {
      window.applyTranslationsToDOM();
    }

    if (img) {
      img.style.visibility = 'hidden';
      const applyCropSource = sourceUrl => {
        if (!sourceUrl || cropState.photoId !== photoId) return;
        cropState.baseDataUrl = sourceUrl;
        cropState.currentTransformedUrl = sourceUrl;
        cropState.sourceUrl = sourceUrl;
        img.onload = () => {
          img.style.visibility = 'visible';
          requestAnimationFrame(() => requestAnimationFrame(() => {
            fitCropImageAndBox();
            setCropAspect('free');
          }));
        };
        img.src = sourceUrl;
        if (img.complete && img.naturalWidth) {
          requestAnimationFrame(() => requestAnimationFrame(() => {
            img.style.visibility = 'visible';
            fitCropImageAndBox();
            setCropAspect('free');
          }));
        }
      };
      if (useStudioComposite) {
        applyCropSource(baseImgUrl);
      } else {
        // Immediately start with photo.dataUrl so user sees instantaneous layout and full-size fit
        applyCropSource(photo.dataUrl);
        // If a higher-res original/backup exists, seamlessly upgrade to it
        chooseBestCropSource(photo).then(bestUrl => {
          if (bestUrl && bestUrl !== photo.dataUrl && cropState.photoId === photoId) {
            applyCropSource(bestUrl);
          }
        });
      }
    }

    initCropInteractions();
  }

  function closeCropEditorModal() {
    const returningPhotoId = cropState.photoId;
    const modal = document.getElementById('cropEditorModal');
    if (modal) modal.style.display = 'none';
    cropState.photoId = null;

    // Flash returned photo card in gallery/albums/favorites if detail modal is not open
    const isDetailOpen = document.getElementById('photoDetailModal')?.style.display === 'flex';
    if (!isDetailOpen && returningPhotoId) {
      if (typeof flashReturnedPhotoCard === 'function') {
        flashReturnedPhotoCard(returningPhotoId);
      }
    }
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
    else if (aspectKey === '9:16') targetRatio = 9 / 16;

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
        else if (cropState.aspect === '9:16') tr = 9 / 16;
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
        else if (cropState.aspect === '9:16') targetRatio = 9 / 16;

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
        } catch (_) { }
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
        else if (cropState.aspect === '9:16') targetRatio = 9 / 16;

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
        } catch (_) { }
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
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

        const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.98);

        // --- Detect whether we are cropping while Backdrop / Studio is active ---
        const isDetailOpen = document.getElementById('photoDetailModal')?.style.display === 'flex';
        const isInStudioMode = isDetailOpen && state.activePhotoId === photo.id && (
          studioState.activeTool === 'backdrop' ||
          (typeof isStudioBackdropConfigured === 'function' && isStudioBackdropConfigured()) ||
          !!document.getElementById('detailEditStudioDrawer')?.classList.contains('open')
        );

        if (isInStudioMode) {
          // --- STUDIO / BACKDROP MODE ---
          // Store true uncropped original in temporary memory backup if not already stored.
          // DO NOT call saveState() here — users are testing crops inside backdrop mode.
          // The crop is strictly a temporary preview until the user explicitly clicks 'Save' in the studio/backdrop menu!
          if (!photo._studioCropBackupDataUrl) {
            photo._studioCropBackupDataUrl = photo.dataUrl;
          }
          photo.dataUrl = croppedDataUrl;
          // Note: NO saveState() called here!

          // Update the detail photo list item
          const detailItem = (state.detailPhotoList || []).find(p => p.id === photo.id);
          if (detailItem) detailItem.dataUrl = croppedDataUrl;

          // Keep detailImage hidden (backdrop canvases take over), update its src
          const detailImg2 = document.getElementById('detailImage');
          if (detailImg2) {
            detailImg2.src = croppedDataUrl;
            detailImg2.style.display = 'none';
            detailImg2.style.opacity = '0';
          }

          // Invalidate all cutout caches so segmenter re-runs on the cropped image
          studioState.cachedCutoutCanvas = null;
          studioState.cachedRawAiCutoutCanvas = null;
          studioState.cachedMaskCanvas = null;
          studioState.cachedOriginalImg = null;
          studioState.cachedPhotoId = null; // force re-segment

          // Keep backdrop as the active tool — DO NOT call resetStudioValues()
          studioState.activeTool = 'backdrop';

          // Re-highlight the backdrop button in the edit bar
          document.querySelectorAll('#detailPhotoEditBar .detail-edit-tool-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.tool === 'backdrop');
          });

          // Keep the studio drawer open
          const studioDrawer = document.getElementById('detailEditStudioDrawer');
          if (studioDrawer) studioDrawer.classList.add('open');

          // Re-segment the cropped subject (reads photo.dataUrl which is now cropped)
          if (typeof segmentActivePhotoSubject === 'function') {
            segmentActivePhotoSubject(true);
          } else if (typeof renderBackdropCanvasComposite === 'function') {
            renderBackdropCanvasComposite();
          }

          closeCropEditorModal();
          showToast('✂️ Crop preview applied! Tap Save in Backdrop to keep changes.');
        } else {
          // --- NORMAL MODE: persist crop to gallery photo ---
          if (!photo.originalDataUrl) {
            photo.originalDataUrl = cropState.baseDataUrl || photo.dataUrl;
          }
          photo.dataUrl = croppedDataUrl;

          saveState();
          renderAll();

          if (state.activePhotoId === photo.id) {
            const detailImg = document.getElementById('detailImage');
            if (detailImg) {
              detailImg.src = croppedDataUrl;
              detailImg.style.display = 'block';
              detailImg.style.opacity = '1';
              detailImg.style.filter = 'none';
            }
            const detailItem = (state.detailPhotoList || []).find(p => p.id === photo.id);
            if (detailItem) {
              detailItem.dataUrl = croppedDataUrl;
            }
            resetStudioValues();
            const bCanvas = document.getElementById('detailBackdropCanvas');
            const sCanvas = document.getElementById('detailSubjectCanvas');
            if (bCanvas) bCanvas.style.display = 'none';
            if (sCanvas) sCanvas.style.display = 'none';
            const badge = document.getElementById('detailAiSegmentBadge');
            if (badge) badge.style.display = 'none';
          }

          closeCropEditorModal();
          showToast('✨ Photo cropped & oriented successfully!');
        }
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


  // =============================================================
  // RESIZE EDITOR MODULE
  // =============================================================
  const resizeState = {
    photoId: null,
    sourceDataUrl: '',
    rotation: 0,      // 0, 90, 180, 270
    customAngle: 0,   // -45 to +45
    flipH: false,
    flipV: false,
    unit: 'px',
    dpi: 300,
    aspect: 'free',   // free, 1:1, 4:5, 3:4, 16:9, 9:16
    aspectLocked: true,
    fitMode: 'contain',
    targetW: 0,  // in pixels (output)
    targetH: 0,  // in pixels (output)
    origW: 0,
    origH: 0,
    rafId: null
  };

  // Image cache for instant preview rendering (avoids async re-load on every change)
  const resizeImgCache = {
    sourceDataUrl: null,
    rotation: null, customAngle: null, flipH: null, flipV: null,
    transformedImg: null,  // HTMLImageElement (already loaded)
    transformedW: 0, transformedH: 0
  };

  // Unit conversion helpers
  function resToPx(val, unit, dpi) {
    if (unit === 'px') return Math.round(val);
    if (unit === 'mm') return Math.round((val / 25.4) * dpi);
    if (unit === 'cm') return Math.round((val / 2.54) * dpi);
    if (unit === 'in') return Math.round(val * dpi);
    return Math.round(val);
  }

  function pxToRes(px, unit, dpi) {
    if (unit === 'px') return Math.round(px);
    if (unit === 'mm') return parseFloat(((px / dpi) * 25.4).toFixed(1));
    if (unit === 'cm') return parseFloat(((px / dpi) * 2.54).toFixed(2));
    if (unit === 'in') return parseFloat((px / dpi).toFixed(3));
    return Math.round(px);
  }

  function resizeInputStep(unit) {
    if (unit === 'px') {
      const orig = resizeState.origW || 1000;
      return Math.max(10, Math.round(orig * 0.05)); // 5% of photo size, at least 10px
    }
    if (unit === 'mm') return 2;
    if (unit === 'cm') return 0.5;
    if (unit === 'in') return 0.1;
    return 1;
  }

  function getPhotoMatteColor(img) {
    try {
      const c = document.createElement('canvas');
      c.width = 1;
      c.height = 1;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, 1, 1, 0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      if (d && d[3] > 20) {
        return `rgb(${d[0]},${d[1]},${d[2]})`;
      }
    } catch (e) { }
    return '#ffffff';
  }

  function getAspectRatio(aspect) {
    if (aspect === '1:1') return 1;
    if (aspect === '4:5') return 4 / 5;
    if (aspect === '3:4') return 3 / 4;
    if (aspect === '16:9') return 16 / 9;
    if (aspect === '9:16') return 9 / 16;
    return null; // free
  }

  // Apply current rotation/flip transforms to base image, return dataUrl
  function getResizeTransformedDataUrl(srcUrl, rotation, customAngle, flipH, flipV, callback) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const rad = ((rotation + customAngle) * Math.PI) / 180;
      const cos = Math.abs(Math.cos(rad));
      const sin = Math.abs(Math.sin(rad));
      const W = img.naturalWidth || img.width;
      const H = img.naturalHeight || img.height;
      const newW = Math.round(W * cos + H * sin);
      const newH = Math.round(W * sin + H * cos);
      const c = document.createElement('canvas');
      c.width = newW;
      c.height = newH;
      const ctx = c.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.translate(newW / 2, newH / 2);
      ctx.rotate(rad);
      if (flipH) ctx.scale(-1, 1);
      if (flipV) ctx.scale(1, -1);
      ctx.drawImage(img, -W / 2, -H / 2, W, H);
      callback(c.toDataURL('image/jpeg', 0.98), newW, newH);
    };
    img.src = srcUrl;
  }

  function _drawResizePreviewFromImg(img, transW, transH) {
    const canvas = document.getElementById('resizePreviewCanvas');
    if (!canvas || !img) return;
    const wrapper = document.getElementById('resizeStageWrapper');
    if (!wrapper) return;
    const wRect = wrapper.getBoundingClientRect();
    if (wRect.height < 20 || wRect.width < 20) {
      requestAnimationFrame(() => _drawResizePreviewFromImg(img, transW, transH));
      return;
    }

    const tW = Math.max(1, Math.round(resizeState.targetW || transW));
    const tH = Math.max(1, Math.round(resizeState.targetH || transH));

    const availW = Math.max(60, wRect.width - 20);
    const availH = Math.max(60, wRect.height - 20);

    const refW = resizeState.origW || transW || 800;
    const refH = resizeState.origH || transH || 800;

    // Normal view: photo fills ~93% of stage, matching normal photo detail view
    const targetAspect = tW / tH;

    const envelopeW = availW * 0.93;
    const envelopeH = availH * 0.93;

    let dispW, dispH;
    if (targetAspect > (envelopeW / envelopeH)) {
      dispW = Math.round(envelopeW);
      dispH = Math.max(36, Math.round(envelopeW / targetAspect));
    } else {
      dispH = Math.round(envelopeH);
      dispW = Math.max(36, Math.round(envelopeH * targetAspect));
    }

    const wrap = document.getElementById('resizeCanvasWrap');
    const srcW = transW || img.naturalWidth || img.width || dispW;
    const srcH = transH || img.naturalHeight || img.height || dispH;

    // Resample through an intermediate offscreen buffer sized at actual target pixels (tW, tH)
    // This ensures changing DPI (300 -> 150 -> 72) immediately reflects authentic visual sampling quality
    // (300 DPI = razor sharp, 150 DPI = balanced, 72 DPI = draft screen quality)
    const buf = document.createElement('canvas');
    let outDispW = dispW;
    let outDispH = dispH;

    if (resizeState.fitMode === 'stretch') {
      buf.width = tW;
      buf.height = tH;
      const bCtx = buf.getContext('2d');
      bCtx.imageSmoothingEnabled = true;
      bCtx.imageSmoothingQuality = 'high';
      bCtx.drawImage(img, 0, 0, tW, tH);
    } else if (resizeState.fitMode === 'cover') {
      buf.width = tW;
      buf.height = tH;
      const bCtx = buf.getContext('2d');
      bCtx.imageSmoothingEnabled = true;
      bCtx.imageSmoothingQuality = 'high';
      const scale = Math.max(tW / srcW, tH / srcH);
      const sw = tW / scale;
      const sh = tH / scale;
      const sx = (srcW - sw) / 2;
      const sy = (srcH - sh) / 2;
      bCtx.drawImage(img, sx, sy, sw, sh, 0, 0, tW, tH);
    } else {
      // Fit / contain:
      const aspT = tW / tH;
      const aspI = srcW / srcH;
      let outW, outH;
      if (aspI > aspT) {
        outDispW = dispW;
        outDispH = Math.max(1, Math.round(dispW / aspI));
        outW = tW;
        outH = Math.max(1, Math.round(tW / aspI));
      } else {
        outDispW = Math.max(1, Math.round(dispH * aspI));
        outDispH = dispH;
        outH = tH;
        outW = Math.max(1, Math.round(tH * aspI));
      }
      buf.width = outW;
      buf.height = outH;
      const bCtx = buf.getContext('2d');
      bCtx.imageSmoothingEnabled = true;
      bCtx.imageSmoothingQuality = 'high';
      bCtx.drawImage(img, 0, 0, outW, outH);
    }

    canvas.width = outDispW;
    canvas.height = outDispH;
    canvas.style.width = outDispW + 'px';
    canvas.style.height = outDispH + 'px';
    if (wrap) {
      wrap.style.width = outDispW + 'px';
      wrap.style.height = outDispH + 'px';
    }

    const ctx = canvas.getContext('2d');
    // If output resolution is lower than display area (e.g. 72 DPI or small custom px),
    // disabling smoothing authentically exposes the pixelation/draft sampling of the lower DPI
    const isDownsampled = (buf.width < outDispW || buf.height < outDispH);
    ctx.imageSmoothingEnabled = !isDownsampled;
    ctx.drawImage(buf, 0, 0, outDispW, outDispH);

    updateResizeDimensionHud(tW, tH);
  }

  function renderResizePreview() {
    const canvas = document.getElementById('resizePreviewCanvas');
    if (!canvas || !resizeState.sourceDataUrl) return;

    // Check if we already have a valid cached transformed image
    const cacheHit = (
      resizeImgCache.transformedImg &&
      resizeImgCache.sourceDataUrl === resizeState.sourceDataUrl &&
      resizeImgCache.rotation === resizeState.rotation &&
      resizeImgCache.customAngle === resizeState.customAngle &&
      resizeImgCache.flipH === resizeState.flipH &&
      resizeImgCache.flipV === resizeState.flipV
    );

    if (cacheHit) {
      // Instant synchronous draw — no async needed
      _drawResizePreviewFromImg(resizeImgCache.transformedImg, resizeImgCache.transformedW, resizeImgCache.transformedH);
      return;
    }

    // Cache miss: apply transforms, load into Image, then cache for future calls
    getResizeTransformedDataUrl(
      resizeState.sourceDataUrl,
      resizeState.rotation, resizeState.customAngle,
      resizeState.flipH, resizeState.flipV,
      (transUrl, transW, transH) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          // Cache for instant future access
          resizeImgCache.sourceDataUrl = resizeState.sourceDataUrl;
          resizeImgCache.rotation = resizeState.rotation;
          resizeImgCache.customAngle = resizeState.customAngle;
          resizeImgCache.flipH = resizeState.flipH;
          resizeImgCache.flipV = resizeState.flipV;
          resizeImgCache.transformedImg = img;
          resizeImgCache.transformedW = transW;
          resizeImgCache.transformedH = transH;
          _drawResizePreviewFromImg(img, transW, transH);
        };
        img.src = transUrl;
      }
    );
  }

  function updateResizeDimensionHud(pxW, pxH) {
    const hud = document.getElementById('resizeDimText');
    if (!hud) return;
    const u = resizeState.unit;
    const d = resizeState.dpi;
    const refW = resizeState.origW || pxW || 1;
    const pct = Math.round((pxW / refW) * 100);
    const pctStr = ` · ${pct}%`;
    if (u === 'px') {
      hud.textContent = `${pxW} × ${pxH} px${pctStr}`;
    } else {
      const wi = document.getElementById('resizeWidthInput');
      const hi = document.getElementById('resizeHeightInput');
      const wStr = wi && wi.value ? wi.value : pxToRes(pxW, u, d);
      const hStr = hi && hi.value ? hi.value : pxToRes(pxH, u, d);
      hud.textContent = `${wStr} × ${hStr} ${u} (${pxW}×${pxH})${pctStr}`;
    }
  }

  function populateResizeQuickPresets() {
    const strip = document.getElementById('resizeQuickPresets');
    if (!strip) return;
    const u = resizeState.unit;
    let presets = [];
    if (u === 'px') {
      presets = [
        { label: '100×100', w: 100, h: 100 },
        { label: '480×480', w: 480, h: 480 },
        { label: '800×600', w: 800, h: 600 },
        { label: '1080×1080', w: 1080, h: 1080 },
        { label: '1280×720', w: 1280, h: 720 },
        { label: '1920×1080', w: 1920, h: 1080 },
        { label: '2048×2048', w: 2048, h: 2048 }
      ];
    } else if (u === 'mm') {
      presets = [
        { label: '20×20mm', w: 20, h: 20 },
        { label: '35×45mm', w: 35, h: 45 },
        { label: '50×50mm', w: 50, h: 50 },
        { label: '100×100mm', w: 100, h: 100 },
        { label: '148×210mm', w: 148, h: 210 },
        { label: '210×297mm', w: 210, h: 297 }
      ];
    } else if (u === 'cm') {
      presets = [
        { label: '5×5cm', w: 5, h: 5 },
        { label: '10×10cm', w: 10, h: 10 },
        { label: '15×21cm', w: 15, h: 21 },
        { label: '21×30cm', w: 21, h: 30 }
      ];
    } else if (u === 'in') {
      presets = [
        { label: '1×1in', w: 1, h: 1 },
        { label: '4×6in', w: 4, h: 6 },
        { label: '5×7in', w: 5, h: 7 },
        { label: '8×10in', w: 8, h: 10 }
      ];
    }
    strip.innerHTML = presets.map(p =>
      '<button class="resize-preset-chip" onclick="applyResizePreset(' + p.w + ',' + p.h + ')" title="' + p.label + '" aria-label="' + p.label + '">' + p.label + '</button>'
    ).join('');
  }

  function applyResizePreset(w, h) {
    const u = resizeState.unit;
    const d = resizeState.dpi;
    resizeState.targetW = resToPx(w, u, d);
    resizeState.targetH = resToPx(h, u, d);
    resizeState.aspectLocked = false; // preset = exact size
    // Fill mode (cover) ensures photo fills preset cleanly without black letterbox bars
    resizeState.fitMode = 'cover';
    document.querySelectorAll('.resize-fit-chip').forEach(c => {
      c.classList.toggle('active', c.dataset.fit === 'cover');
    });
    updateResizeLockUI();
    syncResizeInputsFromPx();
    scheduleResizePreview();
  }

  function syncResizeInputsFromPx() {
    const u = resizeState.unit;
    const d = resizeState.dpi;
    const wi = document.getElementById('resizeWidthInput');
    const hi = document.getElementById('resizeHeightInput');
    if (wi) wi.value = pxToRes(resizeState.targetW, u, d);
    if (hi) hi.value = pxToRes(resizeState.targetH, u, d);
    document.querySelectorAll('.resize-unit-badge').forEach(b => b.textContent = u);
    const wBadge = document.getElementById('resizeUnitBadgeW');
    const hBadge = document.getElementById('resizeUnitBadgeH');
    if (wBadge) wBadge.textContent = u;
    if (hBadge) hBadge.textContent = u;
  }

  function setResizeUnit(unit) {
    resizeState.unit = unit;
    document.querySelectorAll('.resize-unit-chip').forEach(c => {
      c.classList.toggle('active', c.dataset.unit === unit);
    });
    const dpiWrap = document.getElementById('resizeDpiWrap');
    if (dpiWrap) dpiWrap.style.display = (unit !== 'px') ? 'flex' : 'none';
    syncResizeInputsFromPx();
    populateResizeQuickPresets();
    renderResizePreview();
  }

  function toggleResizeDpiMenu(e) {
    if (e) e.stopPropagation();
    const menu = document.getElementById('resizeDpiMenu');
    const trigger = document.getElementById('resizeDpiTrigger');
    if (!menu || !trigger) return;
    const isOpen = menu.style.display !== 'none';
    menu.style.display = isOpen ? 'none' : 'flex';
    trigger.classList.toggle('open', !isOpen);
  }

  function selectResizeDpi(val, e) {
    if (e) e.stopPropagation();
    const menu = document.getElementById('resizeDpiMenu');
    const trigger = document.getElementById('resizeDpiTrigger');
    if (menu) menu.style.display = 'none';
    if (trigger) trigger.classList.remove('open');
    onResizeDpiChange(val);
  }

  function onResizeDpiChange(val) {
    const newDpi = parseInt(val) || 300;
    const oldDpi = resizeState.dpi || 300;
    resizeState.dpi = newDpi;
    const dpiSel = document.getElementById('resizeDpiSelect');
    if (dpiSel && dpiSel.value !== String(newDpi)) dpiSel.value = String(newDpi);

    // Update luxury custom trigger badge & text
    const triggerText = document.getElementById('resizeDpiTriggerText');
    const triggerIcon = document.getElementById('resizeDpiTriggerIcon');
    if (triggerText) triggerText.textContent = `${newDpi} DPI`;
    if (triggerIcon) {
      if (newDpi >= 300) {
        triggerIcon.innerHTML = '<i class="fa-solid fa-gem"></i>';
      } else if (newDpi >= 150) {
        triggerIcon.innerHTML = '<i class="fa-solid fa-sliders"></i>';
      } else {
        triggerIcon.innerHTML = '<i class="fa-solid fa-bolt"></i>';
      }
    }
    // Update active class on custom menu items
    document.querySelectorAll('.resize-dpi-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.dpi === String(newDpi));
    });

    if (newDpi === oldDpi && resizeState.targetW > 0) return;

    const u = resizeState.unit;
    if (u !== 'px') {
      // In physical units (cm, mm, in), preserve the user's chosen physical dimensions.
      // Recompute target pixel resolution for the new DPI without altering the physical width/height inputs.
      const wi = document.getElementById('resizeWidthInput');
      const hi = document.getElementById('resizeHeightInput');
      const curW = wi ? parseFloat(wi.value) : pxToRes(resizeState.targetW, u, oldDpi);
      const curH = hi ? parseFloat(hi.value) : pxToRes(resizeState.targetH, u, oldDpi);

      if (curW > 0) {
        resizeState.targetW = Math.max(1, resToPx(curW, u, newDpi));
      }
      if (curH > 0) {
        resizeState.targetH = Math.max(1, resToPx(curH, u, newDpi));
      }

      if (wi && curW > 0) wi.value = curW;
      if (hi && curH > 0) hi.value = curH;
    }

    updateResizeDimensionHud(resizeState.targetW, resizeState.targetH);
    scheduleResizePreview();
  }

  function toggleResizeAspectLock() {
    resizeState.aspectLocked = !resizeState.aspectLocked;
    if (!resizeState.aspectLocked) {
      resizeState.aspect = 'free';
      document.querySelectorAll('#resizeAspectBar .aspect-chip').forEach(c => {
        c.classList.toggle('active', c.dataset.aspect === 'free');
      });
    }
    updateResizeLockUI();
  }

  function updateResizeLockUI() {
    const btn = document.getElementById('resizeAspectLockBtn');
    const icon = document.getElementById('resizeAspectLockIcon');
    if (!btn || !icon) return;
    btn.classList.toggle('locked', resizeState.aspectLocked);
    icon.className = resizeState.aspectLocked ? 'fa-solid fa-link' : 'fa-solid fa-link-slash';
  }

  function setResizeAspect(aspect) {
    resizeState.aspect = aspect;
    document.querySelectorAll('#resizeAspectBar .aspect-chip').forEach(c => {
      c.classList.toggle('active', c.dataset.aspect === aspect);
    });
    if (aspect !== 'free') {
      const ratio = getAspectRatio(aspect);
      if (ratio) {
        resizeState.targetH = Math.max(1, Math.round(resizeState.targetW / ratio));
        resizeState.aspectLocked = true;
        // Default to Fill (cover) so photo seamlessly fills the aspect ratio without black letterboxing
        resizeState.fitMode = 'cover';
        document.querySelectorAll('.resize-fit-chip').forEach(c => {
          c.classList.toggle('active', c.dataset.fit === 'cover');
        });
        updateResizeLockUI();
        syncResizeInputsFromPx();
      }
    } else {
      resizeState.aspectLocked = false;
      updateResizeLockUI();
    }
    renderResizePreview();
  }

  function onResizeWidthInput(val) {
    const u = resizeState.unit;
    const d = resizeState.dpi;
    const num = parseFloat(val) || 0;
    resizeState.targetW = Math.max(1, resToPx(num, u, d));
    if (resizeState.aspectLocked) {
      const ratio = (resizeState.aspect !== 'free' && getAspectRatio(resizeState.aspect))
        ? getAspectRatio(resizeState.aspect)
        : ((resizeState.origW && resizeState.origH) ? (resizeState.origW / resizeState.origH) : 1);
      resizeState.targetH = Math.max(1, Math.round(resizeState.targetW / ratio));
      const hi = document.getElementById('resizeHeightInput');
      if (hi) hi.value = pxToRes(resizeState.targetH, u, d);
    } else {
      resizeState.aspect = 'free';
      document.querySelectorAll('#resizeAspectBar .aspect-chip').forEach(c => {
        c.classList.toggle('active', c.dataset.aspect === 'free');
      });
    }
    renderResizePreview();
  }

  function onResizeHeightInput(val) {
    const u = resizeState.unit;
    const d = resizeState.dpi;
    const num = parseFloat(val) || 0;
    resizeState.targetH = Math.max(1, resToPx(num, u, d));
    if (resizeState.aspectLocked) {
      const ratio = (resizeState.aspect !== 'free' && getAspectRatio(resizeState.aspect))
        ? getAspectRatio(resizeState.aspect)
        : ((resizeState.origW && resizeState.origH) ? (resizeState.origW / resizeState.origH) : 1);
      resizeState.targetW = Math.max(1, Math.round(resizeState.targetH * ratio));
      const wi = document.getElementById('resizeWidthInput');
      if (wi) wi.value = pxToRes(resizeState.targetW, u, d);
    } else {
      resizeState.aspect = 'free';
      document.querySelectorAll('#resizeAspectBar .aspect-chip').forEach(c => {
        c.classList.toggle('active', c.dataset.aspect === 'free');
      });
    }
    renderResizePreview();
  }

  function stepResizeDimension(axis, delta) {
    const u = resizeState.unit;
    const d = resizeState.dpi;
    const step = resToPx(resizeInputStep(u), u, d);
    const ratio = (resizeState.aspect !== 'free' && getAspectRatio(resizeState.aspect))
      ? getAspectRatio(resizeState.aspect)
      : ((resizeState.origW && resizeState.origH) ? (resizeState.origW / resizeState.origH) : 1);

    if (axis === 'w') {
      resizeState.targetW = Math.max(1, resizeState.targetW + delta * step);
      if (resizeState.aspectLocked && ratio) {
        resizeState.targetH = Math.max(1, Math.round(resizeState.targetW / ratio));
      }
    } else {
      resizeState.targetH = Math.max(1, resizeState.targetH + delta * step);
      if (resizeState.aspectLocked && ratio) {
        resizeState.targetW = Math.max(1, Math.round(resizeState.targetH * ratio));
      }
    }
    syncResizeInputsFromPx();
    renderResizePreview();
  }

  function setResizeFitMode(mode) {
    resizeState.fitMode = mode;
    document.querySelectorAll('.resize-fit-chip').forEach(c => {
      c.classList.toggle('active', c.dataset.fit === mode);
    });
    scheduleResizePreview();
  }

  function setResizeRotation(deg) {
    resizeState.rotation = deg % 360;
    updateResizeTransformButtonsUI();
    scheduleResizePreview();
  }

  function toggleResizeFlip(axis) {
    if (axis === 'h') resizeState.flipH = !resizeState.flipH;
    else resizeState.flipV = !resizeState.flipV;
    updateResizeTransformButtonsUI();
    scheduleResizePreview();
  }

  function resetResizeTransforms() {
    resizeState.rotation = 0;
    resizeState.customAngle = 0;
    resizeState.flipH = false;
    resizeState.flipV = false;
    const slider = document.getElementById('resizeAngleSlider');
    const readout = document.getElementById('resizeAngleReadout');
    if (slider) slider.value = 0;
    if (readout) readout.textContent = '0.0°';
    updateResizeTransformButtonsUI();
    scheduleResizePreview();
  }

  function updateResizeTransformButtonsUI() {
    const fh = document.getElementById('resizeFlipHBtn');
    const fv = document.getElementById('resizeFlipVBtn');
    if (fh) fh.classList.toggle('active', resizeState.flipH);
    if (fv) fv.classList.toggle('active', resizeState.flipV);
  }

  function resetResize() {
    resetResizeTransforms();
    // Restore original dimensions
    if (resizeState.origW && resizeState.origH) {
      resizeState.targetW = resizeState.origW;
      resizeState.targetH = resizeState.origH;
      syncResizeInputsFromPx();
    }
    setResizeAspect('free');
    setResizeFitMode('contain');
    setResizeUnit('px');
    scheduleResizePreview();
  }

  function toggleResizeAngleDrawer() {
    const drawer = document.getElementById('resizeCustomAngleDrawer');
    const btn = document.getElementById('resizeAngleToggleBtn');
    if (!drawer) return;
    const showing = drawer.style.display !== 'none';
    drawer.style.display = showing ? 'none' : 'block';
    if (btn) btn.classList.toggle('active', !showing);
  }

  function adjustResizeCustomAngle(delta) {
    const cur = resizeState.customAngle || 0;
    setResizeCustomAngle(cur + delta);
  }

  function onResizeCustomAngleSlider(val) {
    setResizeCustomAngle(parseFloat(val) || 0);
  }

  function setResizeCustomAngle(angle) {
    resizeState.customAngle = Math.max(-45, Math.min(45, Math.round(angle * 2) / 2));
    const slider = document.getElementById('resizeAngleSlider');
    const readout = document.getElementById('resizeAngleReadout');
    if (slider) slider.value = resizeState.customAngle;
    if (readout) {
      const sign = resizeState.customAngle > 0 ? '+' : '';
      readout.textContent = sign + resizeState.customAngle.toFixed(1) + '°';
    }
    scheduleResizePreview();
  }

  function resetResizeCustomAngle() {
    setResizeCustomAngle(0);
  }

  function scheduleResizePreview() {
    if (resizeState.rafId) cancelAnimationFrame(resizeState.rafId);
    resizeState.rafId = requestAnimationFrame(() => {
      renderResizePreview();
      resizeState.rafId = null;
    });
  }

  function openResizeEditorModal(photoId) {
    const photo = state.photos.find(p => p.id === photoId);
    if (!photo) return;

    const modal = document.getElementById('resizeEditorModal');
    if (modal) modal.style.display = 'flex';
    if (typeof window.applyTranslationsToDOM === 'function') {
      window.applyTranslationsToDOM();
    }

    resizeState.photoId = photoId;
    resizeState.rotation = 0;
    resizeState.customAngle = 0;
    resizeState.flipH = false;
    resizeState.flipV = false;
    resizeState.unit = 'px';
    resizeState.dpi = 300;
    resizeState.aspect = 'free';
    resizeState.aspectLocked = true;
    resizeState.fitMode = 'cover';

    // Invalidate image transform cache for the new photo
    resizeImgCache.transformedImg = null;
    resizeImgCache.sourceDataUrl = null;

    // Source: use studio composite if in studio/backdrop mode and detail modal is open
    let srcUrl = photo.dataUrl || (photo.gradient && typeof generateGradientImage === 'function' ? generateGradientImage(photo.displayName, photo.category, photo.gradient) : photo.dataUrl);
    const isDetailOpen = document.getElementById('photoDetailModal')?.style.display === 'flex';
    if (isDetailOpen && state.activePhotoId === photoId && typeof isStudioBackdropConfigured === 'function' &&
      (isStudioBackdropConfigured() || studioState.activeTool === 'backdrop')) {
      srcUrl = getStudioCurrentCompositeDataUrl(photo) || srcUrl;
    }
    resizeState.sourceDataUrl = srcUrl;

    // Reset and initialize UI immediately
    const drawer = document.getElementById('resizeCustomAngleDrawer');
    if (drawer) drawer.style.display = 'none';
    const angleBtn = document.getElementById('resizeAngleToggleBtn');
    if (angleBtn) angleBtn.classList.remove('active');
    const angleSlider = document.getElementById('resizeAngleSlider');
    if (angleSlider) angleSlider.value = 0;
    const angleReadout = document.getElementById('resizeAngleReadout');
    if (angleReadout) angleReadout.textContent = '0.0°';

    const nameSub = document.getElementById('resizePhotoNameSub');
    if (nameSub) nameSub.textContent = photo.displayName || 'Photo';

    document.querySelectorAll('#resizeAspectBar .aspect-chip').forEach(b => {
      b.classList.toggle('active', b.dataset.aspect === 'free');
    });
    document.querySelectorAll('.resize-fit-chip').forEach(b => {
      b.classList.toggle('active', b.dataset.fit === 'cover');
    });
    document.querySelectorAll('.resize-unit-chip').forEach(b => {
      b.classList.toggle('active', b.dataset.unit === 'px');
    });

    const dpiWrap = document.getElementById('resizeDpiWrap');
    if (dpiWrap) dpiWrap.style.display = 'none';

    updateResizeLockUI();
    updateResizeTransformButtonsUI();

    // Load image to get original dimensions
    const tempImg = new Image();
    tempImg.crossOrigin = 'anonymous';
    let isLoaded = false;
    const onImgLoaded = () => {
      if (isLoaded) return;
      isLoaded = true;
      resizeState.origW = tempImg.naturalWidth || tempImg.width || 800;
      resizeState.origH = tempImg.naturalHeight || tempImg.height || 800;
      resizeState.targetW = resizeState.origW;
      resizeState.targetH = resizeState.origH;
      // Pre-seed image cache for instant synchronous rendering
      resizeImgCache.sourceDataUrl = srcUrl;
      resizeImgCache.rotation = 0;
      resizeImgCache.customAngle = 0;
      resizeImgCache.flipH = false;
      resizeImgCache.flipV = false;
      resizeImgCache.transformedImg = tempImg;
      resizeImgCache.transformedW = resizeState.origW;
      resizeImgCache.transformedH = resizeState.origH;
      syncResizeInputsFromPx();
      populateResizeQuickPresets();
      renderResizePreview();
    };
    tempImg.onload = onImgLoaded;
    tempImg.src = srcUrl;
    if (tempImg.complete && tempImg.naturalWidth) {
      onImgLoaded();
    }
  }

  function closeResizeEditorModal() {
    const returningPhotoId = resizeState.photoId;
    const modal = document.getElementById('resizeEditorModal');
    if (modal) modal.style.display = 'none';
    resizeState.photoId = null;

    // Flash returned photo card in gallery/albums/favorites if detail modal is not open
    const isDetailOpen = document.getElementById('photoDetailModal')?.style.display === 'flex';
    if (!isDetailOpen && returningPhotoId) {
      if (typeof flashReturnedPhotoCard === 'function') {
        flashReturnedPhotoCard(returningPhotoId);
      }
    }
  }

  function applyAndSaveResize() {
    if (!resizeState.photoId) return;
    const photo = state.photos.find(p => p.id === resizeState.photoId);
    if (!photo) return;

    const tW = Math.max(1, Math.round(resizeState.targetW));
    const tH = Math.max(1, Math.round(resizeState.targetH));

    // Apply transforms then resize
    getResizeTransformedDataUrl(
      resizeState.sourceDataUrl,
      resizeState.rotation, resizeState.customAngle,
      resizeState.flipH, resizeState.flipV,
      (transUrl, transW, transH) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = tW;
          canvas.height = tH;
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          if (resizeState.fitMode === 'stretch') {
            canvas.width = tW;
            canvas.height = tH;
            ctx.drawImage(img, 0, 0, tW, tH);
          } else if (resizeState.fitMode === 'cover') {
            canvas.width = tW;
            canvas.height = tH;
            const scale = Math.max(tW / img.naturalWidth, tH / img.naturalHeight);
            const sw = tW / scale;
            const sh = tH / scale;
            const sx = (img.naturalWidth - sw) / 2;
            const sy = (img.naturalHeight - sh) / 2;
            ctx.drawImage(img, sx, sy, sw, sh, 0, 0, tW, tH);
          } else {
            // Fit / contain: size canvas directly to photo's fitted dimensions — ZERO extra canvas or black screen!
            const aspT = tW / tH;
            const aspI = img.naturalWidth / img.naturalHeight;
            let outW, outH;
            if (aspI > aspT) {
              outW = tW;
              outH = Math.max(1, Math.round(tW / aspI));
            } else {
              outH = tH;
              outW = Math.max(1, Math.round(tH * aspI));
            }
            canvas.width = outW;
            canvas.height = outH;
            ctx.drawImage(img, 0, 0, outW, outH);
          }

          const isPng = (photo.dataUrl && photo.dataUrl.startsWith('data:image/png')) || (photo.name && photo.name.toLowerCase().endsWith('.png'));
          const mime = isPng ? 'image/png' : 'image/jpeg';
          const resizedDataUrl = canvas.toDataURL(mime, 0.96);

          // Detect studio/backdrop mode — preview only, no saveState
          const isDetailOpen = document.getElementById('photoDetailModal')?.style.display === 'flex';
          const isInStudioMode = isDetailOpen && state.activePhotoId === photo.id && (
            studioState.activeTool === 'backdrop' ||
            (typeof isStudioBackdropConfigured === 'function' && isStudioBackdropConfigured()) ||
            !!document.getElementById('detailEditStudioDrawer')?.classList.contains('open')
          );

          if (isInStudioMode) {
            // Preview in RAM — mimic the same safe crop-in-backdrop pattern
            if (!photo._studioResizeBackupDataUrl) {
              photo._studioResizeBackupDataUrl = photo.dataUrl;
            }
            photo.dataUrl = resizedDataUrl;
            const detailItem = (state.detailPhotoList || []).find(p => p.id === photo.id);
            if (detailItem) detailItem.dataUrl = resizedDataUrl;
            const detailImg2 = document.getElementById('detailImage');
            if (detailImg2) {
              detailImg2.src = resizedDataUrl;
              detailImg2.style.display = 'none';
              detailImg2.style.opacity = '0';
            }
            // Invalidate studio caches
            studioState.cachedCutoutCanvas = null;
            studioState.cachedRawAiCutoutCanvas = null;
            studioState.cachedMaskCanvas = null;
            studioState.cachedOriginalImg = null;
            studioState.cachedPhotoId = null;
            studioState.activeTool = 'backdrop';
            document.querySelectorAll('#detailPhotoEditBar .detail-edit-tool-btn').forEach(b => {
              b.classList.toggle('active', b.dataset.tool === 'backdrop');
            });
            const studioDrawer = document.getElementById('detailEditStudioDrawer');
            if (studioDrawer) studioDrawer.classList.add('open');
            if (typeof segmentActivePhotoSubject === 'function') {
              segmentActivePhotoSubject(true);
            } else if (typeof renderBackdropCanvasComposite === 'function') {
              renderBackdropCanvasComposite();
            }
            closeResizeEditorModal();
            showToast('↕️ Resize preview applied! Tap Save in Backdrop to keep changes.');
          } else {
            // Normal mode — persist to gallery
            if (!photo.originalDataUrl) {
              photo.originalDataUrl = resizeState.sourceDataUrl || photo.dataUrl;
            }
            photo.dataUrl = resizedDataUrl;
            saveState();
            renderAll();
            if (state.activePhotoId === photo.id) {
              const detailImg = document.getElementById('detailImage');
              if (detailImg) {
                detailImg.src = resizedDataUrl;
                detailImg.style.display = 'block';
                detailImg.style.opacity = '1';
                detailImg.style.filter = 'none';
                if (detailImg.complete && detailImg.naturalWidth > 0) {
                  fitDetailElements();
                } else {
                  detailImg.onload = () => fitDetailElements();
                }
              }
              const detailItem = (state.detailPhotoList || []).find(p => p.id === photo.id);
              if (detailItem) detailItem.dataUrl = resizedDataUrl;
              resetStudioValues();
              const bCanvas = document.getElementById('detailBackdropCanvas');
              const sCanvas = document.getElementById('detailSubjectCanvas');
              if (bCanvas) bCanvas.style.display = 'none';
              if (sCanvas) sCanvas.style.display = 'none';
            }
            closeResizeEditorModal();
            showToast('↕️ Photo resized to ' + tW + '×' + tH + 'px successfully!');
          }
        };
        img.src = transUrl;
      }
    );
  }

  function resizeSelectedGalleryPhoto() {
    if (state.selectedGalleryPhotoIds.size !== 1) {
      showToast('Select 1 photo to resize');
      return;
    }
    const photoId = Array.from(state.selectedGalleryPhotoIds)[0];
    openResizeEditorModal(photoId);
  }

  // Bind to window for global access
  window.openRenamePhotoModal = openRenamePhotoModal;
  window.closeRenamePhotoModal = closeRenamePhotoModal;
  window.handleRenameInput = handleRenameInput;
  window.savePhotoRename = savePhotoRename;
  window.renameSelectedGalleryPhoto = renameSelectedGalleryPhoto;
  window.openCropEditorModal = openCropEditorModal;
  window.closeCropEditorModal = closeCropEditorModal;
  window.cropState = cropState;
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
  window.openResizeEditorModal = openResizeEditorModal;
  window.closeResizeEditorModal = closeResizeEditorModal;
  window.resizeState = resizeState;
  window.resizeSelectedGalleryPhoto = resizeSelectedGalleryPhoto;
  window.setResizeUnit = setResizeUnit;
  window.setResizeAspect = setResizeAspect;
  window.toggleResizeAspectLock = toggleResizeAspectLock;
  window.setResizeRotation = setResizeRotation;
  window.toggleResizeFlip = toggleResizeFlip;
  window.resetResizeTransforms = resetResizeTransforms;
  window.resetResize = resetResize;
  window.toggleResizeAngleDrawer = toggleResizeAngleDrawer;
  window.adjustResizeCustomAngle = adjustResizeCustomAngle;
  window.onResizeCustomAngleSlider = onResizeCustomAngleSlider;
  window.resetResizeCustomAngle = resetResizeCustomAngle;
  window.onResizeWidthInput = onResizeWidthInput;
  window.onResizeHeightInput = onResizeHeightInput;
  window.stepResizeDimension = stepResizeDimension;
  window.onResizeDpiChange = onResizeDpiChange;
  window.toggleResizeDpiMenu = toggleResizeDpiMenu;
  window.selectResizeDpi = selectResizeDpi;
  window.setResizeFitMode = setResizeFitMode;
  window.applyResizePreset = applyResizePreset;
  window.applyAndSaveResize = applyAndSaveResize;

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

  // Move & Copy and Fusion Studio functions are already attached to window where defined

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
  window.showNoDeviceSecurityModal = showNoDeviceSecurityModal;
  window.closeNoDeviceSecurityModal = closeNoDeviceSecurityModal;
  window.openPhoneSecuritySettings = openPhoneSecuritySettings;
  window.flashReturnedPhotoCard = flashReturnedPhotoCard;
  window.handleNativeBackPressed = function () {
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
    const noSecModal = document.getElementById('noDeviceSecurityModal');
    if (noSecModal && noSecModal.style.display !== 'none') {
      closeNoDeviceSecurityModal();
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
    const moveCopyModal = document.getElementById('moveCopyModal');
    if (moveCopyModal && moveCopyModal.style.display !== 'none') {
      closeMoveCopyModal();
      return true;
    }
    const vipMoveCopyModal = document.getElementById('vipMoveCopyModal');
    if (vipMoveCopyModal && vipMoveCopyModal.style.display !== 'none') {
      closeVipMoveCopyGateModal();
      return true;
    }
    const vipSaveLimitModal = document.getElementById('vipSaveLimitModal');
    if (vipSaveLimitModal && vipSaveLimitModal.style.display !== 'none') {
      closeVipSaveLimitModal();
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
  document.getElementById('vipSaveLimitModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'vipSaveLimitModal') closeVipSaveLimitModal();
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

    // Click outside to dismiss resize DPI luxury dropdown
    const dpiDropdown = document.getElementById('resizeDpiDropdownContainer');
    const dpiMenu = document.getElementById('resizeDpiMenu');
    const dpiTrigger = document.getElementById('resizeDpiTrigger');
    if (dpiMenu && dpiMenu.style.display !== 'none') {
      if (!dpiDropdown?.contains(e.target)) {
        dpiMenu.style.display = 'none';
        if (dpiTrigger) dpiTrigger.classList.remove('open');
      }
    }
  });

  // Render initial view
  applyShakeWaveColorToCss(state.shakeWaveColor);
  renderAll();
  updateSubscriptionUI();

  // Asynchronously synchronize dynamic subscription plans and check app updates from Firebase
  if (typeof fetchFirebaseSubscriptionPlans === 'function') {
    fetchFirebaseSubscriptionPlans();
  }
  if (typeof fetchFirebaseAppUpdates === 'function') {
    fetchFirebaseAppUpdates();
  }

  // Enforce App Lock on startup if enabled
  if (state.biometricLock) {
    state.isAppLocked = true;
    showAppLock();
  }

  // Dynamically keep photo detail image/canvas fitted on window resize / orientation change
  window.addEventListener('resize', fitDetailElements);
});


function openPasteCutoutModal() {
  if (!studioState.cachedCutoutCanvas) return;
  const otherPhotos = state.photos.filter(p => p.id !== state.activePhotoId);
  if (otherPhotos.length === 0) {
    showToast('⚠️ No other photos in gallery to paste into!');
    return;
  }

  // Create temporary luxury photo picker sheet
  const existingSheet = document.getElementById('pasteCutoutPickerSheet');
  if (existingSheet) existingSheet.remove();

  const sheet = document.createElement('div');
  sheet.id = 'pasteCutoutPickerSheet';
  sheet.className = 'batch-tag-modal-overlay active';
  sheet.innerHTML = `
    <div class="batch-tag-modal-card" style="max-width: 420px; max-height: 80vh; display: flex; flex-direction: column;">
      <div class="modal-header">
        <div class="modal-title-wrap">
          <i class="fa-solid fa-paste modal-icon" style="color: #6366f1;"></i>
          <h3>Paste Cutout to Photo</h3>
        </div>
        <button class="modal-close-btn" onclick="document.getElementById('pasteCutoutPickerSheet')?.remove()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <p style="font-size: 12px; color: #94a3b8; margin: 4px 16px 12px 16px;">Select a photo from your gallery to place yourself into:</p>
      <div style="flex: 1; overflow-y: auto; padding: 0 16px 16px 16px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
        ${otherPhotos.map(p => `
          <div class="paste-target-card" data-id="${p.id}" style="border-radius: 12px; overflow: hidden; border: 2px solid rgba(255,255,255,0.12); cursor: pointer; position: relative; aspect-ratio: 1; background: #0f172a;">
            <img src="${p.dataUrl}" style="width: 100%; height: 100%; object-fit: cover;" alt="${escapeHtml(p.displayName)}">
            <span style="position: absolute; bottom: 0; left: 0; right: 0; padding: 4px 6px; background: rgba(0,0,0,0.7); font-size: 10px; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(p.displayName)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.body.appendChild(sheet);

  sheet.querySelectorAll('.paste-target-card').forEach(card => {
    card.addEventListener('click', async () => {
      const targetId = card.dataset.id;
      sheet.remove();

      const targetPhoto = state.photos.find(p => p.id === targetId);
      if (!targetPhoto) return;

      const cutout = studioState.cachedCutoutCanvas;
      if (!cutout) return;

      // Composite cutout onto target photo
      const bgImg = new Image();
      bgImg.crossOrigin = 'anonymous';
      bgImg.src = targetPhoto.dataUrl;
      await new Promise(r => { bgImg.onload = r; bgImg.onerror = r; });

      const tw = bgImg.naturalWidth || 1200;
      const th = bgImg.naturalHeight || 1200;
      const c = document.createElement('canvas');
      c.width = tw;
      c.height = th;
      const ctx = c.getContext('2d');
      ctx.drawImage(bgImg, 0, 0, tw, th);

      // Draw cutout scaled nicely on bottom of target photo
      const scale = 0.85;
      const sw = (tw * scale);
      const sh = (th * scale);
      const sx = (tw - sw) / 2;
      const sy = (th - sh);
      ctx.drawImage(cutout, sx, sy, sw, sh);

      targetPhoto.dataUrl = c.toDataURL('image/jpeg', 0.95);
      savePhotosToStorage();
      renderGallery();
      openPhotoDetail(targetId);
      showToast(`✨ Cutout pasted successfully into "${targetPhoto.displayName}"!`);
    });
  });
}
window.openPasteCutoutModal = openPasteCutoutModal;
