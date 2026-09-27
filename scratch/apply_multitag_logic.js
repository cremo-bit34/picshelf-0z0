const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '../web/app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// 1. Reset logic in openMoveCopyModal
const openModalResetSnippet = `
    state.moveCopyTargetIds = ids;
    state.moveCopyIsAlbumMode = false;
    state.moveCopySourceAlbum = sourceAlbumName || (state.selectedFilterTags && state.selectedFilterTags.size === 1 ? Array.from(state.selectedFilterTags)[0] : null);
    state.moveCopyMode = state.moveCopyMode || 'copy';
    state.moveCopyDestinationAlbum = null;
    state.moveCopySearchQuery = '';
    state.moveCopyMultiTags = [];
    state.moveCopyIsMultiTagDest = false;
    state.moveCopyDestinationTags = null;
    state.moveCopyMultiTagExpanded = false;

    resetMultiTagUI();`;

appJs = appJs.replace(
  /state\.moveCopyTargetIds = ids;\s*state\.moveCopyIsAlbumMode = false;\s*state\.moveCopySourceAlbum = sourceAlbumName \|\| \(state\.selectedFilterTags && state\.selectedFilterTags\.size === 1 \? Array\.from\(state\.selectedFilterTags\)\[0\] : null\);\s*state\.moveCopyMode = state\.moveCopyMode \|\| 'copy';\s*state\.moveCopyDestinationAlbum = null;\s*state\.moveCopySearchQuery = '';/,
  openModalResetSnippet
);

// 2. Reset logic in openMoveCopyAlbumModal
const openAlbumModalResetSnippet = `
    state.moveCopyTargetIds = validPhotos.map(p => p.id);
    state.moveCopyMode = state.moveCopyMode || 'copy';
    state.moveCopyDestinationAlbum = null;
    state.moveCopySearchQuery = '';
    state.moveCopyMultiTags = [];
    state.moveCopyIsMultiTagDest = false;
    state.moveCopyDestinationTags = null;
    state.moveCopyMultiTagExpanded = false;

    resetMultiTagUI();`;

appJs = appJs.replace(
  /state\.moveCopyTargetIds = validPhotos\.map\(p => p\.id\);\s*state\.moveCopyMode = state\.moveCopyMode \|\| 'copy';\s*state\.moveCopyDestinationAlbum = null;\s*state\.moveCopySearchQuery = '';/,
  openAlbumModalResetSnippet
);

// 3. Reset logic in closeMoveCopyModal
const closeModalResetSnippet = `
    state.moveCopyTargetIds = [];
    state.moveCopyDestinationAlbum = null;
    state.moveCopySourceAlbum = null;
    state.moveCopyIsAlbumMode = false;
    state.moveCopyMultiTags = [];
    state.moveCopyIsMultiTagDest = false;
    state.moveCopyDestinationTags = null;
    state.moveCopyMultiTagExpanded = false;

    resetMultiTagUI();`;

appJs = appJs.replace(
  /state\.moveCopyTargetIds = \[\];\s*state\.moveCopyDestinationAlbum = null;\s*state\.moveCopySourceAlbum = null;\s*state\.moveCopyIsAlbumMode = false;/,
  closeModalResetSnippet
);

// 4. Update selectMoveCopyDestination
const selectDestSnippet = `window.selectMoveCopyDestination = function(albumName) {
    state.moveCopyIsMultiTagDest = false;
    state.moveCopyDestinationTags = null;
    state.moveCopyDestinationAlbum = albumName;
    updateMoveCopyConfirmButton();
    window.renderMoveCopyAlbumsList();
    if (typeof window.updateMultiTagIntersection === 'function') {
      window.updateMultiTagIntersection();
    }
  };`;

appJs = appJs.replace(
  /window\.selectMoveCopyDestination = function\(albumName\) \{[\s\S]*?window\.renderMoveCopyAlbumsList\(\);\s*\};/,
  selectDestSnippet
);

// 5. Update updateMoveCopyConfirmButton to support multi-tag destination
const confirmBtnTarget = `    const count = (state.moveCopyTargetIds || []).length;
    const dest = state.moveCopyDestinationAlbum;`;

const confirmBtnReplacement = `    const count = (state.moveCopyTargetIds || []).length;
    const dest = state.moveCopyDestinationAlbum;

    if (state.moveCopyIsMultiTagDest && state.moveCopyDestinationTags && state.moveCopyDestinationTags.length > 0) {
      btn.disabled = false;
      const combinedName = state.moveCopyDestinationTags.join(' + ');
      const actionLabel = state.moveCopyMode === 'copy'
        ? (window.t ? window.t('organize_multitag_copy_to', { dest: combinedName }) : \`Copy to '\${combinedName}'\`)
        : (window.t ? window.t('organize_multitag_move_to', { dest: combinedName }) : \`Move to '\${combinedName}'\`);
      text.textContent = actionLabel;
      const countNoun = count === 1 ? (window.t ? window.t('organize_photo_singular') : 'photo') : (window.t ? window.t('organize_photos_plural') : 'photos');
      btn.title = \`\${actionLabel} (\${count} \${countNoun})\`;
      if (icon) icon.className = state.moveCopyMode === 'copy' ? 'fa-solid fa-copy' : 'fa-solid fa-arrow-right-arrow-left';
      return;
    }`;

appJs = appJs.replace(confirmBtnTarget, confirmBtnReplacement);

// 6. Update renderMoveCopyAlbumsList to prepend multi-tag row when >= 2 tags
const renderListTarget = `    const validPhotos = state.photos.filter(p => !p.isPending && !p.deletedAt);

    list.innerHTML = availableTags.map(tag => {`;

const renderListReplacement = `    const validPhotos = state.photos.filter(p => !p.isPending && !p.deletedAt);

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
        return \`<span class="multitag-stack-dot" style="background: \${color};" title="\${escapeHtml(t)}"></span>\`;
      }).join('');

      multiTagTopRowHtml = \`
        <div class="move-copy-album-row multitag-combined-row \${isMultiSelected ? 'selected' : ''}" 
             onclick="selectMultiTagAsDestination()" title="Select combined multi-tag destination">
          <div class="album-row-left">
            <div class="multitag-result-dot-stack">
              \${dotStackHtml}
            </div>
            <div>
              <div class="album-row-name" style="color: #fbbf24; font-weight: 700;">
                \${escapeHtml(combinedName)}
                <span style="font-size: 10px; background: rgba(251, 191, 36, 0.2); color: #fbbf24; padding: 1px 6px; border-radius: 8px; margin-left: 6px;">VIP MULTI-TAG</span>
              </div>
              <div class="album-row-count">\${matchCount} \${escapeHtml(countNoun)} match</div>
            </div>
          </div>
          <div class="album-row-radio">
            <i class="fa-solid fa-check"></i>
          </div>
        </div>
      \`;
    }

    list.innerHTML = multiTagTopRowHtml + availableTags.map(tag => {`;

appJs = appJs.replace(renderListTarget, renderListReplacement);

// 7. Update executeMoveCopyAction to handle multi-tag destination
const executeActionTarget = `  window.executeMoveCopyAction = function() {
    const dest = state.moveCopyDestinationAlbum;
    const ids = state.moveCopyTargetIds || [];
    if (!dest || !ids.length) return;`;

const executeActionReplacement = `  window.executeMoveCopyAction = function() {
    const dest = state.moveCopyDestinationAlbum;
    const ids = state.moveCopyTargetIds || [];
    if (!dest || !ids.length) return;

    // Multi-tag Destination Execution
    if (state.moveCopyIsMultiTagDest && state.moveCopyDestinationTags && state.moveCopyDestinationTags.length > 0) {
      const destTags = state.moveCopyDestinationTags;
      
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
      if (isAlbumMode) {
        const cleanupNote = sourceAlbumRemoved ? ' (Source album cleaned up)' : '';
        showToast(\`✨ \${actionText} complete album '\${sourceAlbum}' (\${affectedCount} photo\${affectedCount === 1 ? '' : 's'}) to multi-tag destination '\${combinedLabel}'!\${cleanupNote}\`);
      } else {
        showToast(\`✨ \${actionText} \${affectedCount} photo\${affectedCount === 1 ? '' : 's'} to multi-tag destination '\${combinedLabel}'!\`);
      }
      return;
    }`;

appJs = appJs.replace(executeActionTarget, executeActionReplacement);

// 8. Add Multi-Tag Engine implementation functions before executeMoveCopyAction
const multiTagEngineCode = `
  // -------------------------------------------------------------
  // VIP MULTI-TAG ALBUM INTERSECTION ENGINE
  // -------------------------------------------------------------
  function resetMultiTagUI() {
    const multiTagContainer = document.getElementById('moveCopyMultiTagContainer');
    const multiTagToggleBtn = document.getElementById('multiTagToggleBtn');
    const multiTagBody = document.getElementById('multiTagBuilderBody');
    const multiTagBadge = document.getElementById('multiTagActiveBadge');
    const multiTagCard = document.getElementById('multiTagResultCard');
    const multiTagRow = document.getElementById('multiTagChainRow');
    if (multiTagContainer) multiTagContainer.classList.remove('highlighted-dest');
    if (multiTagToggleBtn) {
      multiTagToggleBtn.classList.remove('expanded');
      multiTagToggleBtn.setAttribute('aria-expanded', 'false');
    }
    if (multiTagBody) multiTagBody.style.display = 'none';
    if (multiTagBadge) multiTagBadge.style.display = 'none';
    if (multiTagCard) {
      multiTagCard.style.display = 'none';
      multiTagCard.classList.remove('active-destination');
    }
    if (multiTagRow) multiTagRow.innerHTML = '';
  }

  window.toggleMultiTagBuilder = function() {
    state.moveCopyMultiTagExpanded = !state.moveCopyMultiTagExpanded;
    const body = document.getElementById('multiTagBuilderBody');
    const toggleBtn = document.getElementById('multiTagToggleBtn');
    if (!body || !toggleBtn) return;

    if (state.moveCopyMultiTagExpanded) {
      body.style.display = 'block';
      toggleBtn.classList.add('expanded');
      toggleBtn.setAttribute('aria-expanded', 'true');
      if (!Array.isArray(state.moveCopyMultiTags) || state.moveCopyMultiTags.length === 0) {
        const available = state.tags || [];
        state.moveCopyMultiTags = available.length > 0 ? [available[0].name] : [''];
      }
      window.renderMultiTagChain();
    } else {
      body.style.display = 'none';
      toggleBtn.classList.remove('expanded');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  };

  window.renderMultiTagChain = function() {
    const chainRow = document.getElementById('multiTagChainRow');
    const badge = document.getElementById('multiTagActiveBadge');
    if (!chainRow) return;

    if (!Array.isArray(state.moveCopyMultiTags) || state.moveCopyMultiTags.length === 0) {
      state.moveCopyMultiTags = [''];
    }

    const allTags = state.tags || [];
    const validTags = state.moveCopyMultiTags.filter(t => t && t.trim().length > 0);

    // Update active badge in toggle header
    if (badge) {
      if (validTags.length > 0) {
        badge.style.display = 'inline-block';
        badge.textContent = window.t ? window.t('organize_multitag_badge', { count: validTags.length }) : \`\${validTags.length} tags\`;
      } else {
        badge.style.display = 'none';
      }
    }

    const itemsHtml = state.moveCopyMultiTags.map((currentTag, idx) => {
      const tagObj = allTags.find(t => t.name.toLowerCase() === (currentTag || '').toLowerCase());
      const dotColor = tagObj ? tagObj.color : '#64748b';

      // Other selected tags to exclude from this dropdown
      const selectedElsewhere = new Set(
        state.moveCopyMultiTags
          .filter((t, k) => k !== idx && t && t.trim().length > 0)
          .map(t => t.toLowerCase())
      );

      const availableForThisSlot = allTags.filter(t => !selectedElsewhere.has(t.name.toLowerCase()));

      const placeholderText = window.t ? window.t('organize_multitag_placeholder') : 'Select album tag...';
      const optionsHtml = [
        \`<option value="" \${!currentTag ? 'selected' : ''}>\${placeholderText}</option>\`,
        ...availableForThisSlot.map(t => {
          const isSelected = currentTag && t.name.toLowerCase() === currentTag.toLowerCase();
          return \`<option value="\${escapeHtml(t.name)}" \${isSelected ? 'selected' : ''}>\${escapeHtml(t.name)}</option>\`;
        })
      ].join('');

      const removeBtnHtml = (state.moveCopyMultiTags.length > 1 || currentTag)
        ? \`<button type="button" class="multitag-remove-btn" onclick="removeMultiTagChainItem(\${idx})" title="Remove tag" aria-label="Remove tag"><i class="fa-solid fa-xmark"></i></button>\`
        : '';

      return \`
        <div class="multitag-item \${currentTag ? 'selected' : ''}">
          <span class="multitag-dot" style="background: \${dotColor};"></span>
          <select class="multitag-select" onchange="handleMultiTagChainChange(\${idx}, this.value)" aria-label="Select Album Tag \${idx + 1}">
            \${optionsHtml}
          </select>
          \${removeBtnHtml}
        </div>
      \`;
    }).join('');

    // Check if at least one tag is selected and there are remaining unselected tags in state.tags
    const selectedSet = new Set(state.moveCopyMultiTags.filter(t => t && t.trim().length > 0).map(t => t.toLowerCase()));
    const unselectedRemaining = allTags.filter(t => !selectedSet.has(t.name.toLowerCase()));
    const hasAtLeastOneSelected = state.moveCopyMultiTags.some(t => t && t.trim().length > 0);

    const plusBtnHtml = (hasAtLeastOneSelected && unselectedRemaining.length > 0)
      ? \`<button type="button" class="multitag-add-tag-btn" onclick="addMultiTagChainItem()" title="\${window.t ? window.t('organize_multitag_add_btn') : 'Add another tag'}" aria-label="Add another tag"><i class="fa-solid fa-plus"></i></button>\`
      : '';

    chainRow.innerHTML = itemsHtml + plusBtnHtml;

    // Recalculate intersection
    window.updateMultiTagIntersection();
  };

  window.addMultiTagChainItem = function() {
    const allTags = state.tags || [];
    const selectedSet = new Set((state.moveCopyMultiTags || []).filter(t => t && t.trim().length > 0).map(t => t.toLowerCase()));
    const unselected = allTags.filter(t => !selectedSet.has(t.name.toLowerCase()));

    if (unselected.length > 0) {
      state.moveCopyMultiTags.push(unselected[0].name);
      window.renderMultiTagChain();
      window.renderMoveCopyAlbumsList();
    }
  };

  window.removeMultiTagChainItem = function(idx) {
    if (!Array.isArray(state.moveCopyMultiTags)) return;
    state.moveCopyMultiTags.splice(idx, 1);
    if (state.moveCopyMultiTags.length === 0) {
      state.moveCopyMultiTags = [''];
    }

    const validTags = state.moveCopyMultiTags.filter(t => t && t.trim().length > 0);
    if (validTags.length < 2 && state.moveCopyIsMultiTagDest) {
      state.moveCopyIsMultiTagDest = false;
      state.moveCopyDestinationAlbum = null;
      state.moveCopyDestinationTags = null;
      updateMoveCopyConfirmButton();
    }

    window.renderMultiTagChain();
    window.renderMoveCopyAlbumsList();
  };

  window.handleMultiTagChainChange = function(idx, value) {
    if (!Array.isArray(state.moveCopyMultiTags)) state.moveCopyMultiTags = [];
    state.moveCopyMultiTags[idx] = value;

    const validTags = state.moveCopyMultiTags.filter(t => t && t.trim().length > 0);
    if (state.moveCopyIsMultiTagDest) {
      if (validTags.length >= 2) {
        state.moveCopyDestinationTags = [...validTags];
        state.moveCopyDestinationAlbum = validTags.join(' + ');
      } else {
        state.moveCopyIsMultiTagDest = false;
        state.moveCopyDestinationAlbum = null;
        state.moveCopyDestinationTags = null;
      }
      updateMoveCopyConfirmButton();
    }

    window.renderMultiTagChain();
    window.renderMoveCopyAlbumsList();
  };

  window.updateMultiTagIntersection = function() {
    const card = document.getElementById('multiTagResultCard');
    const dotStack = document.getElementById('multiTagDotStack');
    const label = document.getElementById('multiTagResultLabel');
    const countEl = document.getElementById('multiTagResultCount');
    const selectDestBtn = document.getElementById('multiTagSelectDestBtn');
    const selectBtnText = document.getElementById('multiTagSelectBtnText');
    const thumbsRail = document.getElementById('multiTagMatchingThumbs');
    const container = document.getElementById('moveCopyMultiTagContainer');

    if (!card) return;

    const validTags = (state.moveCopyMultiTags || []).filter(t => t && t.trim().length > 0);

    if (validTags.length < 2) {
      card.style.display = 'none';
      if (container) container.classList.remove('highlighted-dest');
      return;
    }

    card.style.display = 'block';

    // Dot stack
    if (dotStack) {
      const allTags = state.tags || [];
      dotStack.innerHTML = validTags.map(t => {
        const tagObj = allTags.find(tag => tag.name.toLowerCase() === t.toLowerCase());
        const color = tagObj ? tagObj.color : '#fbbf24';
        return \`<span class="multitag-stack-dot" style="background: \${color};" title="\${escapeHtml(t)}"></span>\`;
      }).join('');
    }

    // Label: "Photos with both tags:" vs "Photos with all tags:"
    if (label) {
      label.textContent = validTags.length === 2
        ? (window.t ? window.t('organize_multitag_match_both') : 'Photos with both tags:')
        : (window.t ? window.t('organize_multitag_match_all') : \`Photos with all \${validTags.length} tags:\`);
    }

    // Calculate intersection
    const validPhotos = (state.photos || []).filter(p => !p.isPending && !p.deletedAt);
    const matchingPhotos = validPhotos.filter(p =>
      validTags.every(vt => p.tags && p.tags.some(pt => pt.toLowerCase() === vt.toLowerCase()))
    );

    if (countEl) {
      if (matchingPhotos.length === 0) {
        countEl.textContent = window.t ? window.t('organize_multitag_no_matches') : 'No photos currently match all tags';
      } else {
        const countNoun = matchingPhotos.length === 1
          ? (window.t ? window.t('organize_photo_singular') : 'photo')
          : (window.t ? window.t('organize_photos_plural') : 'photos');
        countEl.textContent = \`\${matchingPhotos.length} \${countNoun} match\`;
      }
    }

    // Thumbnails
    if (thumbsRail) {
      if (matchingPhotos.length > 0) {
        thumbsRail.style.display = 'flex';
        const maxThumbs = 6;
        const displayThumbs = matchingPhotos.slice(0, maxThumbs);
        const extraCount = matchingPhotos.length - displayThumbs.length;

        let thumbsHtml = displayThumbs.map(p => \`
          <img src="\${p.dataUrl}" alt="\${escapeHtml(p.displayName || 'Photo')}" class="multitag-match-thumb" title="\${escapeHtml(p.displayName || '')}">
        \`).join('');

        if (extraCount > 0) {
          thumbsHtml += \`<div class="multitag-match-more">+\${extraCount}</div>\`;
        }
        thumbsRail.innerHTML = thumbsHtml;
      } else {
        thumbsRail.style.display = 'none';
        thumbsRail.innerHTML = '';
      }
    }

    // Destination button state
    const isSelectedDest = !!state.moveCopyIsMultiTagDest;
    if (card) card.classList.toggle('active-destination', isSelectedDest);
    if (container) container.classList.toggle('highlighted-dest', isSelectedDest);
    if (selectDestBtn) selectDestBtn.classList.toggle('selected', isSelectedDest);
    if (selectBtnText) {
      selectBtnText.textContent = isSelectedDest
        ? (window.t ? window.t('organize_multitag_selected') : 'Destination Selected')
        : (window.t ? window.t('organize_multitag_select_dest') : 'Select Combined Destination');
    }
  };

  window.selectMultiTagAsDestination = function() {
    const validTags = (state.moveCopyMultiTags || []).filter(t => t && t.trim().length > 0);
    if (validTags.length < 2) {
      showToast('Select at least 2 tags to create a combined destination!');
      return;
    }

    state.moveCopyIsMultiTagDest = true;
    state.moveCopyDestinationTags = [...validTags];
    state.moveCopyDestinationAlbum = validTags.join(' + ');

    window.updateMultiTagIntersection();
    updateMoveCopyConfirmButton();
    window.renderMoveCopyAlbumsList();

    showToast(\`✨ Selected combined destination: '\${state.moveCopyDestinationAlbum}'\`);
  };
`;

// Insert multiTagEngineCode right before executeMoveCopyAction
appJs = appJs.replace(
  '  window.executeMoveCopyAction = function() {',
  multiTagEngineCode + '\n  window.executeMoveCopyAction = function() {'
);

// 9. Add exports at the bottom
const exportsSnippet = `  window.toggleMultiTagBuilder = toggleMultiTagBuilder;
  window.renderMultiTagChain = renderMultiTagChain;
  window.addMultiTagChainItem = addMultiTagChainItem;
  window.removeMultiTagChainItem = removeMultiTagChainItem;
  window.handleMultiTagChainChange = handleMultiTagChainChange;
  window.updateMultiTagIntersection = updateMultiTagIntersection;
  window.selectMultiTagAsDestination = selectMultiTagAsDestination;\n`;

appJs = appJs.replace(
  '  window.openMoveCopyAlbumModal = openMoveCopyAlbumModal;',
  exportsSnippet + '  window.openMoveCopyAlbumModal = openMoveCopyAlbumModal;'
);

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('Successfully injected multi-tag logic into web/app.js');
