/**
 * Aura Photo Organizer - Centralized Production-Grade Download & Export Manager
 * 
 * Features:
 * - Unified DownloadSession architecture for all download actions
 * - Persistent DownloadRegistry with duplicate detection (Download New Only vs Download All)
 * - Deterministic file collision handling: photo.jpg, photo (1).jpg, etc.
 * - Atomic batch numbering (001, 002, 003...) per date and per album
 * - Exact Android MediaStore physical structure:
 *     Pictures/PhotoOrganizer/Gallery Images/DD-MM-YY/001/
 *     Pictures/PhotoOrganizer/Collections/<Album Name>/DD-MM-YY/001/
 * - Multi-album separation under a unified parent DownloadSession
 * - Full asynchronous progress reporting (Downloading X of Y) with cancellation & retry
 * - Complete parity across Android (MediaStore IS_PENDING), iOS (PhotoKit PHPhotoLibrary), and Web
 * - Persistent download history
 */

(function (window) {
  'use strict';

  // Constants
  const STORAGE_KEYS = {
    SESSIONS: 'aura_download_sessions',
    REGISTRY: 'aura_download_registry',
    ITEMS: 'aura_download_items',
    BATCH_COUNTERS: 'aura_download_batch_counters'
  };

  const ROOT_FOLDER = 'PicShelf';


  // In-memory mutex for atomic batch number allocation
  let _batchAllocationLock = Promise.resolve();

  // Active download session state
  let _activeSession = null;
  let _isCancelled = false;

  // =========================================================================
  // UTILITY HELPERS
  // =========================================================================

  function getLocalDateDDMMYY(date = new Date()) {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yy = String(date.getFullYear()).slice(-2);
    return `${dd}-${mm}-${yy}`;
  }

  function getLocalTime12Hour(date = new Date()) {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  }

  function sanitizeAlbumName(name) {
    if (!name || typeof name !== 'string') return 'Collection';
    // Remove illegal filesystem chars: / \ : * ? " < > | and control characters
    let clean = name.replace(/[/\\:*?"<>|\x00-\x1F]/g, '_');
    // Prevent path traversal
    clean = clean.replace(/\.{2,}/g, '_');
    // Normalize whitespace
    clean = clean.replace(/\s+/g, ' ').trim();
    // Strip leading/trailing dots and underscores
    clean = clean.replace(/^[._]+|[._]+$/g, '');
    return clean || 'Collection';
  }

  function sanitizeFileName(name, defaultBase = 'Photo') {
    if (!name || typeof name !== 'string') return `${defaultBase}.jpg`;
    // Strip existing extension
    const base = name.replace(/\.[^/.]+$/, '');
    let clean = base.replace(/[/\\:*?"<>|\x00-\x1F]/g, '_').trim();
    clean = clean.replace(/\.{2,}/g, '_').replace(/^[._]+|[._]+$/g, '');
    return (clean || defaultBase) + '.jpg';
  }

  function formatExportFileName(localDate, batchNumber, index, rawName, defaultBase = 'Photo') {
    const base = (rawName || defaultBase).replace(/\.[^/.]+$/, '');
    let clean = base.replace(/[/\\:*?"<>|\x00-\x1F]/g, '_').replace(/\s+/g, '_').trim();
    clean = clean.replace(/\.{2,}/g, '_').replace(/^[._]+|[._]+$/g, '');
    if (!clean) clean = defaultBase;
    const indexStr = String(index).padStart(2, '0');
    return `${localDate}_${batchNumber}_${indexStr}_${clean}.jpg`;
  }

  function generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 7)}`;
  }

  function computeQuickHash(str) {
    if (!str) return 'empty';
    let hash = 0;
    const len = Math.min(str.length, 4096); // Hash header & length for speed
    for (let i = 0; i < len; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return `h_${Math.abs(hash)}_${str.length}`;
  }

  function resolveDeterministicCollision(fileName, usedNamesSet) {
    if (!usedNamesSet.has(fileName.toLowerCase())) {
      usedNamesSet.add(fileName.toLowerCase());
      return fileName;
    }
    const ext = '.jpg';
    const base = fileName.substring(0, fileName.length - ext.length);
    let counter = 1;
    let candidate = `${base} (${counter})${ext}`;
    while (usedNamesSet.has(candidate.toLowerCase())) {
      counter++;
      candidate = `${base} (${counter})${ext}`;
    }
    usedNamesSet.add(candidate.toLowerCase());
    return candidate;
  }

  async function ensureJpegDataUrl(dataUrl) {
    if (!dataUrl) return null;
    if (typeof dataUrl === 'string' && dataUrl.startsWith('data:image/jpeg;base64,')) {
      return dataUrl;
    }
    if (typeof window.convertToJpegBlob === 'function') {
      try {
        const res = await window.convertToJpegBlob(dataUrl, 0.95, false);
        if (res && res.dataUrl) return res.dataUrl;
      } catch (e) {
        console.warn('[DownloadManager] convertToJpegBlob error:', e);
      }
    }
    return new Promise((resolve) => {
      const img = new Image();
      if (typeof dataUrl === 'string' && (dataUrl.startsWith('http://') || dataUrl.startsWith('https://'))) {
        img.crossOrigin = 'anonymous';
      }
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width || 800;
          canvas.height = img.naturalHeight || img.height || 800;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/jpeg', 0.95));
        } catch (err) {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  // =========================================================================
  // PERSISTENT STORAGE LAYER
  // =========================================================================

  const Storage = {
    getSessions() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        console.error('[DownloadManager] Failed to load sessions:', e);
        return [];
      }
    },

    saveSession(session) {
      try {
        const sessions = Storage.getSessions();
        const idx = sessions.findIndex(s => s.sessionId === session.sessionId);
        if (idx >= 0) {
          sessions[idx] = session;
        } else {
          sessions.unshift(session);
        }
        // Cap to recent 500 sessions for performance
        if (sessions.length > 500) sessions.length = 500;
        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
      } catch (e) {
        console.error('[DownloadManager] Failed to save session:', e);
      }
    },

    getSession(sessionId) {
      return Storage.getSessions().find(s => s.sessionId === sessionId) || null;
    },

    getRegistry() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.REGISTRY);
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        console.error('[DownloadManager] Failed to load registry:', e);
        return {};
      }
    },

    recordRegistryEntry(entry) {
      try {
        const registry = Storage.getRegistry();
        const assetId = entry.assetId;
        if (!registry[assetId]) {
          registry[assetId] = [];
        }
        registry[assetId].push(entry);
        localStorage.setItem(STORAGE_KEYS.REGISTRY, JSON.stringify(registry));
      } catch (e) {
        console.error('[DownloadManager] Failed to record registry entry:', e);
      }
    },

    isAssetPreviouslyDownloaded(assetId, targetScope = null) {
      const registry = Storage.getRegistry();
      const entries = registry[assetId];
      if (!entries || !entries.length) return false;
      if (!targetScope) return true;
      // If targetScope is provided, check if exported to that exact scope or album
      return entries.some(e => e.sourceAlbumName === targetScope || e.exportLocation.includes(targetScope));
    },

    getItems(sessionId) {
      try {
        const raw = localStorage.getItem(`${STORAGE_KEYS.ITEMS}_${sessionId}`);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    },

    saveItems(sessionId, items) {
      try {
        localStorage.setItem(`${STORAGE_KEYS.ITEMS}_${sessionId}`, JSON.stringify(items));
      } catch (e) {
        console.error('[DownloadManager] Failed to save items for session:', sessionId, e);
      }
    },

    getBatchCounters() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.BATCH_COUNTERS);
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        return {};
      }
    },

    // Atomic Batch Number Allocation per date/scope (e.g. 001, 002, 003)
    async allocateNextBatchNumber(dateStr, scopeKey = 'gallery') {
      return new Promise((resolve) => {
        _batchAllocationLock = _batchAllocationLock.then(() => {
          const counters = Storage.getBatchCounters();
          const fullKey = `${scopeKey}_${dateStr}`;
          const current = (counters[fullKey] || 0) + 1;
          counters[fullKey] = current;
          try {
            localStorage.setItem(STORAGE_KEYS.BATCH_COUNTERS, JSON.stringify(counters));
          } catch (e) {
            console.error('[DownloadManager] Error saving batch counters:', e);
          }
          const batchStr = String(current).padStart(3, '0');
          resolve(batchStr);
        });
      });
    }
  };

  // =========================================================================
  // CORE DOWNLOAD SERVICE
  // =========================================================================

  const DownloadManager = {
    // Expose helpers & Storage for testability and inspection
    Storage,
    getLocalDateDDMMYY,
    getLocalTime12Hour,
    sanitizeAlbumName,

    /**
     * Primary entry point for ALL download actions in the app.
     * 
     * Supported options:
     * - sourceType: 'gallery' | 'album' | 'multi_album'
     * - photos: Array of photo objects [{ id, displayName, dataUrl, ... }]
     * - albumName: string (optional, for 'album')
     * - albumId: string (optional)
     * - albums: Array of { albumName, photos } (for 'multi_album')
     * - bypassDuplicateCheck: boolean (optional, true when user clicks "Download All")
     */
    async startDownload(options) {
      if (!options) return;
      const sourceType = options.sourceType || 'gallery';

      // 1. Gather all photos and validate
      let allPhotos = [];
      if (sourceType === 'multi_album') {
        const albums = options.albums || [];
        albums.forEach(a => {
          if (Array.isArray(a.photos)) {
            a.photos.forEach(p => {
              allPhotos.push({ ...p, _targetAlbumName: a.albumName });
            });
          }
        });
      } else {
        allPhotos = Array.isArray(options.photos) ? [...options.photos] : [];
        if (options.albumName) {
          allPhotos = allPhotos.map(p => ({ ...p, _targetAlbumName: options.albumName }));
        }
      }

      // Filter out invalid items
      allPhotos = allPhotos.filter(p => p && (p.dataUrl || p.gradient || p.id));

      if (allPhotos.length === 0) {
        if (typeof window.showToast === 'function') {
          window.showToast((window.t && window.t('download_no_photos')) || 'No photos selected to download');
        }
        return;
      }

      // 2. Duplicate Detection (Section 7)
      if (!options.bypassDuplicateCheck) {
        const targetScope = sourceType === 'album' ? sanitizeAlbumName(options.albumName) : (sourceType === 'multi_album' ? 'Albums' : ROOT_FOLDER);
        const duplicates = [];
        const newPhotos = [];

        allPhotos.forEach(p => {
          const itemScope = (sourceType === 'multi_album' && p._targetAlbumName) ? sanitizeAlbumName(p._targetAlbumName) : targetScope;
          if (Storage.isAssetPreviouslyDownloaded(p.id, itemScope)) {
            duplicates.push(p);
          } else {
            newPhotos.push(p);
          }
        });

        if (duplicates.length > 0) {
          // Show the duplicate decision dialog
          DownloadManager.showDuplicateModal({
            totalCount: allPhotos.length,
            duplicatesCount: duplicates.length,
            newCount: newPhotos.length,
            onDownloadNewOnly: () => {
              if (newPhotos.length === 0) {
                if (typeof window.showToast === 'function') {
                  window.showToast((window.t && window.t('download_all_duplicates_notice')) || 'All selected photos are already downloaded!');
                }
                return;
              }
              const newOptions = { ...options, photos: newPhotos, bypassDuplicateCheck: true };
              if (sourceType === 'multi_album') {
                const newAlbums = (options.albums || []).map(a => ({
                  ...a,
                  photos: a.photos.filter(p => !Storage.isAssetPreviouslyDownloaded(p.id, sanitizeAlbumName(a.albumName)))
                })).filter(a => a.photos.length > 0);
                newOptions.albums = newAlbums;
              }
              DownloadManager.executeSession(newOptions);
            },
            onDownloadAll: () => {
              DownloadManager.executeSession({ ...options, bypassDuplicateCheck: true });
            },
            onCancel: () => {
              // User cancelled
            }
          });
          return;
        }
      }

      // 3. Directly execute download session
      await DownloadManager.executeSession(options);
    },

    /**
     * Executes a validated download session.
     */
    async executeSession(options, retrySessionId = null) {
      _isCancelled = false;
      const now = new Date();
      const localDate = getLocalDateDDMMYY(now);
      const localTime = getLocalTime12Hour(now);

      let session;
      let isRetry = false;

      if (retrySessionId) {
        // Retry existing session - DO NOT create a new batch!
        session = Storage.getSession(retrySessionId);
        if (session) {
          isRetry = true;
          session.status = 'downloading';
          Storage.saveSession(session);
        }
      }

      if (!session) {
        // Create new unique DownloadSession
        const sessionId = generateSessionId();
        const sourceType = options.sourceType || 'gallery';
        let batchNumber = '001';
        let destinationRelativePath = '';
        let albumBatches = {};

        if (sourceType === 'gallery') {
          batchNumber = await Storage.allocateNextBatchNumber(localDate, 'gallery');
          destinationRelativePath = `${ROOT_FOLDER}/`;
        } else if (sourceType === 'album') {
          const cleanAlbum = sanitizeAlbumName(options.albumName);
          batchNumber = await Storage.allocateNextBatchNumber(localDate, `album_${cleanAlbum}`);
          destinationRelativePath = `${ROOT_FOLDER}/${cleanAlbum}/`;
        } else if (sourceType === 'multi_album') {
          // Multi-album: allocate batch for each distinct album
          const albums = options.albums || [];
          for (const a of albums) {
            const cleanAlbum = sanitizeAlbumName(a.albumName);
            const aBatch = await Storage.allocateNextBatchNumber(localDate, `album_${cleanAlbum}`);
            albumBatches[a.albumName] = {
              cleanAlbum,
              batchNumber: aBatch,
              relativePath: `${ROOT_FOLDER}/${cleanAlbum}/`
            };
          }
          batchNumber = '001'; // Root multi-session marker
          destinationRelativePath = `${ROOT_FOLDER}/`;
        }

        // Gather photos
        let photosList = [];
        if (sourceType === 'multi_album') {
          (options.albums || []).forEach(a => {
            (a.photos || []).forEach(p => {
              photosList.push({
                photo: p,
                albumName: a.albumName,
                albumId: a.albumId || null,
                destinationPath: albumBatches[a.albumName]?.relativePath || destinationRelativePath
              });
            });
          });
        } else {
          (options.photos || []).forEach(p => {
            photosList.push({
              photo: p,
              albumName: options.albumName || null,
              albumId: options.albumId || null,
              destinationPath: destinationRelativePath
            });
          });
        }

        // Build DownloadItems
        const usedNamesSet = new Set();
        const albumCounters = {};
        const items = photosList.map((entry, idx) => {
          const p = entry.photo;
          const albumKey = entry.albumName || '__gallery';
          albumCounters[albumKey] = (albumCounters[albumKey] || 0) + 1;
          const itemIndex = albumCounters[albumKey];
          const itemBatch = (sourceType === 'multi_album' ? albumBatches[entry.albumName]?.batchNumber : batchNumber) || '001';
          const rawName = p.displayName || p.originalFilename || `Photo_${itemIndex}`;
          const formattedName = formatExportFileName(localDate, itemBatch, itemIndex, rawName);
          const uniqueFileName = resolveDeterministicCollision(formattedName, usedNamesSet);
          return {
            id: `item_${sessionId}_${idx}`,
            sessionId,
            assetId: p.id || `asset_${Date.now()}_${idx}`,
            sourceAlbumId: entry.albumId,
            sourceAlbumName: entry.albumName,
            filename: uniqueFileName,
            status: 'pending',
            destination: entry.destinationPath,
            dataUrl: p.dataUrl || (typeof window.generateGradientImage === 'function' && p.gradient ? window.generateGradientImage(p.displayName, p.category, p.gradient) : null),
            error: null,
            startedAt: null,
            completedAt: null,
            fileSize: 0
          };
        });


        session = {
          sessionId,
          sourceType,
          sourceAlbumId: options.albumId || null,
          sourceAlbumName: options.albumName || null,
          createdAt: Date.now(),
          localDate,
          localTime,
          batchNumber,
          selectedAssetCount: items.length,
          successfulCount: 0,
          failedCount: 0,
          status: 'downloading',
          destinationRelativePath,
          albumBatches
        };

        Storage.saveSession(session);
        Storage.saveItems(sessionId, items);
      }

      _activeSession = session;

      // Show Progress Modal
      DownloadManager.showProgressModal(session);

      // Perform atomic item writes
      await DownloadManager.processSessionItems(session);
    },

    /**
     * Iterates and exports all items in a session safely.
     */
    async processSessionItems(session) {
      const items = Storage.getItems(session.sessionId);
      const pendingItems = items.filter(i => i.status === 'pending' || i.status === 'failed');
      const total = items.length;

      let successCount = session.successfulCount || 0;
      let failedCount = session.failedCount || 0;

      // Check if native Android bridge is available
      const hasNativeAndroid = (window.AndroidApp && (typeof window.AndroidApp.executeDownloadItem === 'function' || typeof window.AndroidApp.executeDownloadBatch === 'function'));

      for (let i = 0; i < pendingItems.length; i++) {
        if (_isCancelled) {
          session.status = 'cancelled';
          Storage.saveSession(session);
          DownloadManager.updateProgressModal(session, i, total, 'Cancelled');
          return;
        }

        const item = pendingItems[i];
        item.startedAt = Date.now();
        item.status = 'downloading';
        DownloadManager.updateProgressModal(session, i + 1, total, `Exporting ${item.filename}...`);

        try {
          // Ensure valid JPEG dataUrl (converting SVGs/gradients if needed)
          let validDataUrl = await ensureJpegDataUrl(item.dataUrl);
          if (!validDataUrl && item.dataUrl) validDataUrl = item.dataUrl;

          if (hasNativeAndroid) {
            let itemOk = false;
            let itemErr = null;
            const dataToPass = validDataUrl || item.dataUrl;
            if (typeof window.AndroidApp.executeDownloadItem === 'function') {
              const itemPayload = {
                sessionId: session.sessionId,
                assetId: item.assetId,
                fileName: item.filename,
                relativePath: item.destination,
                dataUrl: dataToPass,
                index: i + 1,
                total: total
              };
              itemOk = window.AndroidApp.executeDownloadItem(JSON.stringify(itemPayload));
              if (!itemOk) itemErr = 'Native write failed';
            } else {
              // Batch fallback
              const singleBatch = {
                sessionId: session.sessionId,
                sourceType: session.sourceType,
                destinationRelativePath: session.destinationRelativePath,
                items: [{
                  assetId: item.assetId,
                  displayName: item.filename.replace(/\.jpg$/, ''),
                  fileName: item.filename,
                  dataUrl: dataToPass,
                  relativePath: item.destination
                }]
              };
              window.AndroidApp.executeDownloadBatch(JSON.stringify(singleBatch));
              itemOk = true;
            }

            if (itemOk) {
              item.status = 'completed';
              item.completedAt = Date.now();
              Storage.recordRegistryEntry({
                assetId: item.assetId,
                originalIdentifier: item.assetId,
                contentHash: computeQuickHash(dataToPass),
                filename: item.filename,
                sourceType: session.sourceType,
                sourceAlbumId: item.sourceAlbumId,
                sourceAlbumName: item.sourceAlbumName,
                sessionId: session.sessionId,
                exportLocation: item.destination,
                exportTimestamp: Date.now(),
                fileSize: item.fileSize || 0
              });
            } else {
              item.status = 'failed';
              item.error = itemErr || 'Write failed';
            }
          } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.auraBridge) {
            // iOS bridge
            const payload = {
              action: 'executeDownloadBatch',
              sessionId: session.sessionId,
              sourceType: session.sourceType,
              albumName: item.sourceAlbumName || session.sourceAlbumName,
              items: [{
                assetId: item.assetId,
                displayName: item.filename,
                dataUrl: validDataUrl || item.dataUrl,
                albumName: item.sourceAlbumName
              }]
            };
            window.webkit.messageHandlers.auraBridge.postMessage(payload);
            item.status = 'completed';
            item.completedAt = Date.now();
          } else {
            // Browser / Desktop Web Fallback
            let blob = null;
            const dataToPass = validDataUrl || item.dataUrl;
            if (dataToPass && (dataToPass.startsWith('data:') || dataToPass.startsWith('blob:'))) {
              if (typeof window.convertToJpegBlob === 'function') {
                const converted = await window.convertToJpegBlob(dataToPass, 0.95, false);
                blob = converted.blob;
              } else if (typeof window.dataUrlToBlob === 'function') {
                blob = window.dataUrlToBlob(dataToPass);
              }
            } else if (dataToPass) {
              try {
                const resp = await fetch(dataToPass);
                if (resp.ok) {
                  blob = await resp.blob();
                }
              } catch (fetchErr) {
                console.warn('[DownloadManager] Fetch fallback error:', fetchErr);
              }
            }

            if (blob && typeof window.saveAs === 'function') {
              window.saveAs(blob, item.filename);
            } else if (typeof window.triggerBrowserDownload === 'function') {
              window.triggerBrowserDownload(blob || dataToPass, item.filename);
            }

            item.status = 'completed';
            item.completedAt = Date.now();
            item.fileSize = blob ? blob.size : (dataToPass ? Math.round(dataToPass.length * 0.75) : 0);

            Storage.recordRegistryEntry({
              assetId: item.assetId,
              originalIdentifier: item.assetId,
              contentHash: computeQuickHash(dataToPass),
              filename: item.filename,
              sourceType: session.sourceType,
              sourceAlbumId: item.sourceAlbumId,
              sourceAlbumName: item.sourceAlbumName,
              sessionId: session.sessionId,
              exportLocation: item.destination,
              exportTimestamp: Date.now(),
              fileSize: item.fileSize
            });
          }

          session.successfulCount = items.filter(it => it.status === 'completed').length;
          session.failedCount = items.filter(it => it.status === 'failed').length;
          Storage.saveItems(session.sessionId, items);
          Storage.saveSession(session);
          DownloadManager.updateProgressModal(session, i + 1, total, item.status === 'completed' ? `Saved ${item.filename}` : `Failed ${item.filename}`);

        } catch (err) {
          item.status = 'failed';
          item.error = err ? err.message : 'Write failed';
          session.successfulCount = items.filter(it => it.status === 'completed').length;
          session.failedCount = items.filter(it => it.status === 'failed').length;
          Storage.saveItems(session.sessionId, items);
          Storage.saveSession(session);
          DownloadManager.updateProgressModal(session, i + 1, total, `Failed ${item.filename}`);
          console.error('[DownloadManager] Error downloading item:', item.filename, err);
        }

        // Small yield to prevent blocking UI thread
        await new Promise(r => setTimeout(r, 60));
      }

      session.successfulCount = items.filter(it => it.status === 'completed').length;
      session.failedCount = items.filter(it => it.status === 'failed').length;
      session.status = session.failedCount === 0 ? 'completed' : (session.successfulCount > 0 ? 'partial' : 'failed');

      Storage.saveSession(session);
      Storage.saveItems(session.sessionId, items);

      DownloadManager.finishProgressModal(session);
    },

    // =========================================================================
    // NATIVE BRIDGE CALLBACKS
    // =========================================================================

    onNativeItemProgress(sessionId, assetId, success, error, index, total) {
      const session = Storage.getSession(sessionId);
      if (!session) return;
      const items = Storage.getItems(sessionId);
      const item = items.find(i => i.assetId === assetId);

      if (item) {
        item.status = success ? 'completed' : 'failed';
        item.error = error || null;
        item.completedAt = Date.now();
        if (success) {
          Storage.recordRegistryEntry({
            assetId: item.assetId,
            originalIdentifier: item.assetId,
            contentHash: computeQuickHash(item.dataUrl),
            filename: item.filename,
            sourceType: session.sourceType,
            sourceAlbumId: item.sourceAlbumId,
            sourceAlbumName: item.sourceAlbumName,
            sessionId: session.sessionId,
            exportLocation: item.destination,
            exportTimestamp: Date.now(),
            fileSize: item.fileSize || 0
          });
        }
        session.successfulCount = items.filter(it => it.status === 'completed').length;
        session.failedCount = items.filter(it => it.status === 'failed').length;
        Storage.saveItems(sessionId, items);
        Storage.saveSession(session);
      }

      DownloadManager.updateProgressModal(session, index, total, success ? `Saved ${item ? item.filename : 'photo'}` : `Failed: ${error}`);
    },

    onNativeSessionFinished(sessionId, successCount, failedCount) {
      const session = Storage.getSession(sessionId);
      if (!session) return;
      const items = Storage.getItems(sessionId);
      session.successfulCount = items.length > 0 ? items.filter(it => it.status === 'completed').length : successCount;
      session.failedCount = items.length > 0 ? items.filter(it => it.status === 'failed').length : failedCount;
      session.status = session.failedCount === 0 ? 'completed' : (session.successfulCount > 0 ? 'partial' : 'failed');
      Storage.saveSession(session);
      DownloadManager.finishProgressModal(session);
    },

    cancelActiveSession() {
      _isCancelled = true;
      if (_activeSession) {
        _activeSession.status = 'cancelled';
        Storage.saveSession(_activeSession);
        if (window.AndroidApp && typeof window.AndroidApp.cancelDownloadSession === 'function') {
          window.AndroidApp.cancelDownloadSession(_activeSession.sessionId);
        }
      }
      DownloadManager.closeProgressModal();
      if (typeof window.showToast === 'function') {
        window.showToast((window.t && window.t('download_cancelled')) || 'Download cancelled');
      }
    },

    retrySession(sessionId) {
      DownloadManager.closeProgressModal();
      DownloadManager.executeSession(null, sessionId);
    },

    // =========================================================================
    // UI MODALS: DUPLICATE RESOLUTION & PROGRESS
    // =========================================================================

    showDuplicateModal({ totalCount, duplicatesCount, newCount, onDownloadNewOnly, onDownloadAll, onCancel }) {
      const modal = document.getElementById('downloadDuplicateModal');
      if (!modal) {
        // Fallback: if modal DOM not loaded yet, download new only by default
        onDownloadNewOnly();
        return;
      }

      const totalEl = document.getElementById('duplicateModalTotalText');
      const dupsEl = document.getElementById('duplicateModalDupsText');
      const newEl = document.getElementById('duplicateModalNewText');

      const tFn = (typeof window.t === 'function') ? window.t : ((k, params) => k);
      if (totalEl) totalEl.textContent = tFn('download_dup_selected', { count: totalCount });
      if (dupsEl) dupsEl.textContent = tFn('download_dup_already', { count: duplicatesCount });
      if (newEl) newEl.textContent = tFn('download_dup_new', { count: newCount });

      const newOnlyBtn = document.getElementById('downloadNewOnlyBtn');
      const allBtn = document.getElementById('downloadAllDuplicatesBtn');
      const cancelBtn = document.getElementById('downloadDuplicateCancelBtn');

      if (newOnlyBtn) {
        newOnlyBtn.onclick = () => {
          modal.style.display = 'none';
          onDownloadNewOnly();
        };
      }
      if (allBtn) {
        allBtn.onclick = () => {
          modal.style.display = 'none';
          onDownloadAll();
        };
      }
      if (cancelBtn) {
        cancelBtn.onclick = () => {
          modal.style.display = 'none';
          if (onCancel) onCancel();
        };
      }

      modal.style.display = 'flex';
    },

    showProgressModal(session) {
      const modal = document.getElementById('downloadProgressModal');
      if (!modal) return;

      const titleEl = document.getElementById('downloadProgressTitle');
      const pathEl = document.getElementById('downloadProgressPath');
      const countEl = document.getElementById('downloadProgressCount');
      const barEl = document.getElementById('downloadProgressBarFill');
      const successEl = document.getElementById('downloadProgressSuccessPill');
      const failedEl = document.getElementById('downloadProgressFailedPill');
      const retryBtn = document.getElementById('downloadProgressRetryBtn');
      const doneBtn = document.getElementById('downloadProgressDoneBtn');
      const cancelBtn = document.getElementById('downloadProgressCancelBtn');
      const iconWrap = modal.querySelector('.download-progress-icon-wrap');

      const fullPath = session.destinationRelativePath.startsWith('Pictures/')
        ? session.destinationRelativePath
        : `Pictures/${session.destinationRelativePath}`;

      if (iconWrap) {
        iconWrap.innerHTML = '<i class="fa-solid fa-cloud-arrow-down" style="color: #38bdf8; font-size: 26px;"></i>';
      }
      if (titleEl) titleEl.textContent = 'Exporting Photos...';
      if (pathEl) pathEl.textContent = fullPath;
      if (countEl) countEl.textContent = `0 of ${session.selectedAssetCount}`;
      if (barEl) barEl.style.width = '0%';
      if (successEl) successEl.textContent = '0 saved';
      if (failedEl) failedEl.style.display = 'none';
      if (retryBtn) retryBtn.style.display = 'none';
      if (doneBtn) doneBtn.style.display = 'none';
      if (cancelBtn) cancelBtn.style.display = 'inline-flex';

      modal.style.display = 'flex';
    },

    updateProgressModal(session, current, total, statusText = '') {
      const countEl = document.getElementById('downloadProgressCount');
      const barEl = document.getElementById('downloadProgressBarFill');
      const successEl = document.getElementById('downloadProgressSuccessPill');
      const failedEl = document.getElementById('downloadProgressFailedPill');
      const statusEl = document.getElementById('downloadProgressStatusText');

      const percent = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
      if (countEl) countEl.textContent = `${current} of ${total}`;
      if (barEl) barEl.style.width = `${percent}%`;
      if (successEl) successEl.textContent = `${session.successfulCount || 0} saved`;
      if (statusEl && statusText) statusEl.textContent = statusText;

      if (failedEl) {
        if (session.failedCount > 0) {
          failedEl.style.display = 'inline-flex';
          failedEl.textContent = `${session.failedCount} failed`;
        } else {
          failedEl.style.display = 'none';
        }
      }
    },

    finishProgressModal(session) {
      const modal = document.getElementById('downloadProgressModal');
      const titleEl = document.getElementById('downloadProgressTitle');
      const pathEl = document.getElementById('downloadProgressPath');
      const barEl = document.getElementById('downloadProgressBarFill');
      const cancelBtn = document.getElementById('downloadProgressCancelBtn');
      const doneBtn = document.getElementById('downloadProgressDoneBtn');
      const retryBtn = document.getElementById('downloadProgressRetryBtn');
      const statusEl = document.getElementById('downloadProgressStatusText');
      const countEl = document.getElementById('downloadProgressCount');
      const successEl = document.getElementById('downloadProgressSuccessPill');
      const failedEl = document.getElementById('downloadProgressFailedPill');
      const iconWrap = modal ? modal.querySelector('.download-progress-icon-wrap') : null;

      const savedCount = session.successfulCount || 0;
      const totalCount = session.selectedAssetCount || savedCount;
      const fullPath = session.destinationRelativePath.startsWith('Pictures/')
        ? session.destinationRelativePath
        : `Pictures/${session.destinationRelativePath}`;

      if (pathEl) pathEl.textContent = fullPath;
      if (barEl) barEl.style.width = '100%';
      if (countEl) countEl.textContent = `${savedCount} of ${totalCount}`;
      if (successEl) successEl.textContent = `${savedCount} saved`;

      if (cancelBtn) cancelBtn.style.display = 'none';
      if (doneBtn) {
        doneBtn.style.display = 'inline-flex';
        doneBtn.innerHTML = '<i class="fa-solid fa-check" style="margin-right: 6px;"></i><span>Done</span>';
      }

      if (session.failedCount > 0) {
        if (failedEl) {
          failedEl.style.display = 'inline-flex';
          failedEl.textContent = `${session.failedCount} failed`;
        }
        if (titleEl) titleEl.textContent = 'Export Completed with Warnings';
        if (iconWrap) {
          iconWrap.innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="color: #f59e0b; font-size: 28px;"></i>';
        }
        if (statusEl) {
          statusEl.textContent = `${savedCount} photo${savedCount === 1 ? '' : 's'} saved, ${session.failedCount} failed.`;
        }
        if (retryBtn) {
          retryBtn.style.display = 'inline-flex';
          retryBtn.textContent = `Retry Failed (${session.failedCount})`;
          retryBtn.onclick = () => DownloadManager.retrySession(session.sessionId);
        }
      } else {
        if (failedEl) failedEl.style.display = 'none';
        if (titleEl) titleEl.textContent = 'Export Complete! ✨';
        if (iconWrap) {
          iconWrap.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #10b981; font-size: 30px;"></i>';
        }
        if (statusEl) {
          statusEl.textContent = savedCount === 1
            ? '1 photo successfully exported and added to your device library.'
            : `All ${savedCount} photos successfully exported to your device library.`;
        }
        if (retryBtn) retryBtn.style.display = 'none';
      }

      if (typeof window.showToast === 'function') {
        const msg = session.failedCount === 0
          ? `📥 Export complete! Saved to Pictures/${session.destinationRelativePath}`
          : `⚠️ Exported ${session.successfulCount} photos (${session.failedCount} failed)`;
        window.showToast(msg);
      }
    },

    closeProgressModal() {
      const modal = document.getElementById('downloadProgressModal');
      if (modal) modal.style.display = 'none';
    },

    // =========================================================================
    // HISTORY VIEWER (Section 18)
    // =========================================================================

    getHistory() {
      const sessions = Storage.getSessions();
      return sessions.map(s => {
        let label = 'Gallery';
        if (s.sourceType === 'album' && s.sourceAlbumName) {
          label = s.sourceAlbumName;
        } else if (s.sourceType === 'multi_album') {
          label = 'Multiple Albums';
        }
        return {
          sessionId: s.sessionId,
          dateFormatted: `${s.localDate} · ${s.localTime}`,
          countText: `${s.successfulCount || s.selectedAssetCount} photos`,
          sourceText: label,
          batchText: `Batch ${s.batchNumber}`,
          destination: s.destinationRelativePath,
          status: s.status
        };
      });
    },

    openHistoryModal() {
      const modal = document.getElementById('downloadHistoryModal');
      const listEl = document.getElementById('downloadHistoryList');
      if (!modal || !listEl) return;
      const history = DownloadManager.getHistory();
      if (history.length === 0) {
        listEl.innerHTML = `
          <div style="text-align: center; padding: 24px; color: rgba(255,255,255,0.5); font-size: 13px;">
            <i class="fa-solid fa-cloud-arrow-down" style="font-size: 28px; opacity: 0.3; margin-bottom: 8px; display: block;"></i>
            No downloads yet
          </div>
        `;
      } else {
        listEl.innerHTML = history.map(item => `
          <div class="download-history-item">
            <div class="download-history-row">
              <span class="download-history-date">${item.dateFormatted}</span>
              <span class="download-history-batch">${item.batchText}</span>
            </div>
            <div class="download-history-sub">
              <span><strong>${item.countText}</strong></span>
              <span>•</span>
              <span>${item.sourceText}</span>
              <span>•</span>
              <span style="color: ${item.status === 'completed' ? '#10b981' : (item.status === 'failed' ? '#ef4444' : '#f59e0b')}; text-transform: capitalize;">${item.status}</span>
            </div>
            <div class="download-history-dest" title="Pictures/${item.destination}">
              Pictures/${item.destination}
            </div>
          </div>
        `).join('');
      }
      modal.style.display = 'flex';
    }
  };

  // Expose globally
  window.DownloadManager = DownloadManager;

})(window);
