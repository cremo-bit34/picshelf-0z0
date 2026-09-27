const fs = require('fs');

let js = fs.readFileSync('web/app.js', 'utf8');

const replacements = [
  {
    target: "  .addEventListener('click', () => snapPhoto('Camera Shot'));",
    replacement: "  document.getElementById('cameraSnapBtn')?.addEventListener('click', () => snapPhoto('Camera Shot'));"
  },
  {
    target: "  .addEventListener('click', () => snapPhoto('Snap Photo'));",
    replacement: "  document.getElementById('addDemoPhotoBtn')?.addEventListener('click', () => snapPhoto('Snap Photo'));"
  },
  {
    target: "  // File import from local computer\n  .addEventListener('change', (e) => {",
    replacement: "  // File import from local computer\n  document.getElementById('imageFileInput')?.addEventListener('change', (e) => {"
  },
  {
    target: "  // Dock Selection & Batch actions\n  .addEventListener('change', (e) => {",
    replacement: "  // Dock Selection & Batch actions\n  document.getElementById('dockSelectAllCheckbox')?.addEventListener('change', (e) => {"
  },
  {
    target: "  .addEventListener('click', () => {\n    if (state.selectedDockPhotoIds.size > 0) {\n      openBatchTagModal(Array.from(state.selectedDockPhotoIds));\n    }\n  });",
    replacement: "  document.getElementById('dockBatchTagBtn')?.addEventListener('click', () => {\n    if (state.selectedDockPhotoIds.size > 0) {\n      openBatchTagModal(Array.from(state.selectedDockPhotoIds));\n    }\n  });"
  },
  {
    target: "  .addEventListener('click', () => {\n    state.selectedDockPhotoIds.forEach(id => {",
    replacement: "  document.getElementById('dockBatchMoveBtn')?.addEventListener('click', () => {\n    state.selectedDockPhotoIds.forEach(id => {"
  },
  {
    target: "  // Gallery Filter Reset\n  .addEventListener('click', () => {\n    state.selectedFilterTags.clear();",
    replacement: "  // Gallery Filter Reset\n  document.getElementById('allTagsFilterChip')?.addEventListener('click', () => {\n    state.selectedFilterTags.clear();"
  },
  {
    target: "  .addEventListener('click', () => {\n    state.selectedFilterTags.clear();\n    state.startDate = null;",
    replacement: "  document.getElementById('resetFiltersBtn')?.addEventListener('click', () => {\n    state.selectedFilterTags.clear();\n    state.startDate = null;"
  },
  {
    target: "  .addEventListener('click', () => {\n    document.getElementById('resetFiltersBtn').click();\n  });",
    replacement: "  document.getElementById('clearAllFiltersBtn')?.addEventListener('click', () => {\n    document.getElementById('resetFiltersBtn').click();\n  });"
  },
  {
    target: "  // Date Range Picker Modal\n  .addEventListener('click', (e) => {",
    replacement: "  // Date Range Picker Modal\n  document.getElementById('dateFilterChip')?.addEventListener('click', (e) => {"
  },
  {
    target: "  .addEventListener('click', (e) => {\n    e.stopPropagation();\n    state.startDate = null;",
    replacement: "  document.getElementById('clearDateBtn')?.addEventListener('click', (e) => {\n    e.stopPropagation();\n    state.startDate = null;"
  },
  {
    target: "  .addEventListener('click', () => {\n    document.getElementById('datePickerModal').style.display = 'none';\n  });\n\n  .addEventListener('click', () => {\n    state.startDate = null;",
    replacement: "  document.getElementById('closeDatePickerBtn')?.addEventListener('click', () => {\n    document.getElementById('datePickerModal').style.display = 'none';\n  });\n\n  document.getElementById('clearDatePickerBtn')?.addEventListener('click', () => {\n    state.startDate = null;"
  },
  {
    target: "  .addEventListener('click', () => {\n    const fromVal = document.getElementById('fromDatePicker').value;",
    replacement: "  document.getElementById('applyDatePickerBtn')?.addEventListener('click', () => {\n    const fromVal = document.getElementById('fromDatePicker').value;"
  },
  {
    target: "  // Gallery Multi-Selection Actions\n  .addEventListener('click', () => {\n    state.selectedGalleryPhotoIds.clear();",
    replacement: "  // Gallery Multi-Selection Actions\n  document.getElementById('closeSelectionBtn')?.addEventListener('click', () => {\n    state.selectedGalleryPhotoIds.clear();"
  },
  {
    target: "  .addEventListener('click', () => {\n    const selected = state.photos.filter(p => state.selectedGalleryPhotoIds.has(p.id));\n    exportPhotosToZip(selected, `Export_${Date.now()}`);\n  });",
    replacement: "  document.getElementById('exportZipBtn')?.addEventListener('click', () => {\n    const selected = state.photos.filter(p => state.selectedGalleryPhotoIds.has(p.id));\n    exportPhotosToZip(selected, `Export_${Date.now()}`);\n  });"
  },
  {
    target: "  .addEventListener('click', () => {\n    let photos = state.photos.filter(p => !p.isPending && !p.deletedAt);",
    replacement: "  document.getElementById('exportFilteredZipBtn')?.addEventListener('click', () => {\n    let photos = state.photos.filter(p => !p.isPending && !p.deletedAt);"
  },
  {
    target: "  .addEventListener('click', () => {\n    const selected = state.photos.filter(p => state.selectedGalleryPhotoIds.has(p.id));\n    if (navigator.share) {",
    replacement: "  document.getElementById('shareSelectedBtn')?.addEventListener('click', () => {\n    const selected = state.photos.filter(p => state.selectedGalleryPhotoIds.has(p.id));\n    if (navigator.share) {"
  },
  {
    target: "  .addEventListener('click', () => {\n    const selected = state.photos.filter(p => state.selectedGalleryPhotoIds.has(p.id));\n    exportPhotosToZip(selected, `Photo_Collection_${Date.now()}`);\n  });",
    replacement: "  document.getElementById('downloadSelectedBtn')?.addEventListener('click', () => {\n    const selected = state.photos.filter(p => state.selectedGalleryPhotoIds.has(p.id));\n    exportPhotosToZip(selected, `Photo_Collection_${Date.now()}`);\n  });"
  },
  {
    target: "  .addEventListener('click', () => {\n    const count = state.selectedGalleryPhotoIds.size;",
    replacement: "  document.getElementById('trashSelectedBtn')?.addEventListener('click', () => {\n    const count = state.selectedGalleryPhotoIds.size;"
  },
  {
    target: "  // Tag Manager: Create Tag\n  .addEventListener('click', () => {",
    replacement: "  // Tag Manager: Create Tag\n  document.getElementById('createTagBtn')?.addEventListener('click', () => {"
  },
  {
    target: "  // Rename Tag Modal\n  .addEventListener('click', () => {\n    document.getElementById('renameTagModal').style.display = 'none';\n  });\n  .addEventListener('click', () => {\n    document.getElementById('renameTagModal').style.display = 'none';\n  });\n  .addEventListener('click', () => {\n    const newName = document.getElementById('renameTagInput').value.trim();",
    replacement: "  // Rename Tag Modal\n  document.getElementById('closeRenameTagBtn')?.addEventListener('click', () => {\n    document.getElementById('renameTagModal').style.display = 'none';\n  });\n  document.getElementById('cancelRenameTagBtn')?.addEventListener('click', () => {\n    document.getElementById('renameTagModal').style.display = 'none';\n  });\n  document.getElementById('saveRenameTagBtn')?.addEventListener('click', () => {\n    const newName = document.getElementById('renameTagInput').value.trim();"
  },
  {
    target: "  // Empty Trash\n  .addEventListener('click', emptyTrash);",
    replacement: "  // Empty Trash\n  document.getElementById('emptyTrashBtn')?.addEventListener('click', emptyTrash);"
  },
  {
    target: "  // Photo Detail Modal Handlers\n  .addEventListener('click', () => {\n    document.getElementById('photoDetailModal').style.display = 'none';",
    replacement: "  // Photo Detail Modal Handlers\n  document.getElementById('closeDetailBtn')?.addEventListener('click', () => {\n    document.getElementById('photoDetailModal').style.display = 'none';"
  },
  {
    target: "  .addEventListener('click', () => {\n    const photo = state.photos.find(p => p.id === state.activePhotoId);\n    if (photo) {\n      photo.isFavorite = !photo.isFavorite;",
    replacement: "  document.getElementById('detailFavoriteBtn')?.addEventListener('click', () => {\n    const photo = state.photos.find(p => p.id === state.activePhotoId);\n    if (photo) {\n      photo.isFavorite = !photo.isFavorite;"
  },
  {
    target: "  .addEventListener('click', () => {\n    const photo = state.photos.find(p => p.id === state.activePhotoId);\n    if (photo) {\n      const a = document.createElement('a');",
    replacement: "  document.getElementById('detailDownloadBtn')?.addEventListener('click', () => {\n    const photo = state.photos.find(p => p.id === state.activePhotoId);\n    if (photo) {\n      const a = document.createElement('a');"
  },
  {
    target: "  .addEventListener('click', () => {\n    const photo = state.photos.find(p => p.id === state.activePhotoId);\n    if (photo && navigator.share) {",
    replacement: "  document.getElementById('detailShareBtn')?.addEventListener('click', () => {\n    const photo = state.photos.find(p => p.id === state.activePhotoId);\n    if (photo && navigator.share) {"
  },
  {
    target: "  .addEventListener('click', () => {\n    if (state.activePhotoId) {\n      moveToTrash(state.activePhotoId);\n      document.getElementById('photoDetailModal').style.display = 'none';\n      state.activePhotoId = null;\n    }\n  });",
    replacement: "  document.getElementById('detailDeleteBtn')?.addEventListener('click', () => {\n    if (state.activePhotoId) {\n      moveToTrash(state.activePhotoId);\n      document.getElementById('photoDetailModal').style.display = 'none';\n      state.activePhotoId = null;\n    }\n  });"
  },
  {
    target: "  .addEventListener('click', () => {\n    if (state.activePhotoId) {\n      openBatchTagModal([state.activePhotoId]);\n    }\n  });",
    replacement: "  document.getElementById('openManageTagsForPhotoBtn')?.addEventListener('click', () => {\n    if (state.activePhotoId) {\n      openBatchTagModal([state.activePhotoId]);\n    }\n  });"
  },
  {
    target: "  // Batch Tag Dialog Close & Add\n  .addEventListener('click', () => {\n    document.getElementById('batchTagModal').style.display = 'none';\n  });\n  .addEventListener('click', () => {\n    document.getElementById('batchTagModal').style.display = 'none';\n  });",
    replacement: "  // Batch Tag Dialog Close & Add\n  document.getElementById('closeBatchTagBtn')?.addEventListener('click', () => {\n    document.getElementById('batchTagModal').style.display = 'none';\n  });\n  document.getElementById('cancelBatchTagBtn')?.addEventListener('click', () => {\n    document.getElementById('batchTagModal').style.display = 'none';\n  });"
  },
  {
    target: "  .addEventListener('click', () => {\n    const input = document.getElementById('batchNewTagInput');",
    replacement: "  document.getElementById('batchCreateTagBtn')?.addEventListener('click', () => {\n    const input = document.getElementById('batchNewTagInput');"
  },
  {
    target: "  // Theme & Frame Toggles\n  .addEventListener('click', () => {\n    document.body.classList.toggle('light-mode');",
    replacement: "  // Theme & Frame Toggles\n  document.getElementById('themeToggleBtn')?.addEventListener('click', () => {\n    document.body.classList.toggle('light-mode');"
  },
  {
    target: "  .addEventListener('click', () => {\n    const frame = document.getElementById('deviceFrame');",
    replacement: "  document.getElementById('deviceFrameToggleBtn')?.addEventListener('click', () => {\n    const frame = document.getElementById('deviceFrame');"
  }
];

let applied = 0;
for (const r of replacements) {
  if (js.includes(r.target)) {
    js = js.replace(r.target, r.replacement);
    applied++;
  } else {
    console.warn('Target not found:\n', r.target.substring(0, 50));
  }
}

fs.writeFileSync('web/app.js', js, 'utf8');
console.log(`Applied ${applied} of ${replacements.length} listener restorations.`);
