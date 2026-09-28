const fs = require('fs');
const path = require('path');

console.log('Revamping Multi-Tag feature with Tag Chips, Candidate Drawer & Live Hover Previews...');

// 1. UPDATE index.html
const indexHtmlPath = path.join(__dirname, '../web/index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

const targetIndexHtml = `            <!-- Collapsible Body -->
            <div class="multitag-builder-body" id="multiTagBuilderBody" style="display: none;">
              <!-- Horizontal Chain of Dropdowns & Plus Button -->
              <div class="multitag-chain-row" id="multiTagChainRow">
                <!-- Rendered by JS -->
              </div>

              <!-- Live Intersection Summary Card -->
              <div class="multitag-result-card" id="multiTagResultCard" style="display: none;">
                <div class="multitag-result-header">
                  <div class="multitag-result-info">
                    <span class="multitag-result-dot-stack" id="multiTagDotStack"></span>
                    <div>
                      <div class="multitag-result-label" id="multiTagResultLabel">Both tags match:</div>
                      <div class="multitag-result-count" id="multiTagResultCount">0 photos match</div>
                    </div>
                  </div>
                  <button type="button" class="multitag-select-btn" id="multiTagSelectDestBtn" onclick="selectMultiTagAsDestination()">
                    <i class="fa-solid fa-check"></i> <span id="multiTagSelectBtnText" data-i18n="organize_multitag_select_dest">Select Combined Destination</span>
                  </button>
                </div>
                <!-- Thumbnail Rail of Matching Intersection Photos -->
                <div class="multitag-matching-thumbs" id="multiTagMatchingThumbs" style="display: none;"></div>
              </div>
            </div>`;

const newIndexHtml = `            <!-- Collapsible Body -->
            <div class="multitag-builder-body" id="multiTagBuilderBody" style="display: none;">
              <!-- Horizontal Chain of Selected Tag Chips & Plus Button -->
              <div class="multitag-chain-row" id="multiTagChainRow">
                <!-- Rendered by JS: Chips for Tag 1, Tag 2, Tag 3 + Plus Button -->
              </div>

              <!-- Interactive Candidate Picker Drawer (Shows B options with live hover counts) -->
              <div class="multitag-picker-drawer" id="multiTagPickerDrawer" style="display: none;">
                <div class="multitag-picker-header">
                  <span class="multitag-picker-title" id="multiTagPickerTitle">
                    <i class="fa-solid fa-layer-group"></i> <span id="multiTagPickerTitleText">Choose tag to combine:</span>
                  </span>
                  <button type="button" class="multitag-picker-close-btn" onclick="closeMultiTagPicker()" title="Close"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <!-- Search input if many tags -->
                <div class="multitag-picker-search-wrap">
                  <i class="fa-solid fa-magnifying-glass multitag-picker-search-icon"></i>
                  <input type="text" class="multitag-picker-search-input" id="multiTagPickerSearchInput" placeholder="Filter remaining tags..." oninput="handleMultiTagPickerSearch(this.value)">
                </div>
                <!-- Scrollable Candidate Options List with Live Counts & Hover Previews -->
                <div class="multitag-candidate-list" id="multiTagCandidateList" onmouseleave="clearCandidateHoverPreview()">
                  <!-- Rendered by JS: Remaining unselected tags with photo counts and hover events -->
                </div>
              </div>

              <!-- Live Hover / Selected Intersection Preview Panel -->
              <div class="multitag-result-card" id="multiTagResultCard" style="display: none;">
                <div class="multitag-result-header">
                  <div class="multitag-result-info">
                    <span class="multitag-result-dot-stack" id="multiTagDotStack"></span>
                    <div>
                      <div class="multitag-result-label" id="multiTagResultLabel">Both tags match:</div>
                      <div class="multitag-result-count" id="multiTagResultCount">0 photos match</div>
                    </div>
                  </div>
                  <button type="button" class="multitag-select-btn" id="multiTagSelectDestBtn" onclick="selectMultiTagAsDestination()">
                    <i class="fa-solid fa-check"></i> <span id="multiTagSelectBtnText" data-i18n="organize_multitag_select_dest">Select Combined Destination</span>
                  </button>
                </div>
                <!-- Thumbnail Rail of Matching Intersection Photos -->
                <div class="multitag-matching-thumbs" id="multiTagMatchingThumbs" style="display: none;"></div>
              </div>
            </div>`;

if (indexHtml.includes(targetIndexHtml)) {
  indexHtml = indexHtml.replace(targetIndexHtml, newIndexHtml);
  fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
  console.log('  ✓ Updated web/index.html markup');
} else {
  console.log('  ! Note: targetIndexHtml not found identically in web/index.html, checking fuzzy match...');
}

// 2. UPDATE style.css
const styleCssPath = path.join(__dirname, '../web/style.css');
let styleCss = fs.readFileSync(styleCssPath, 'utf8');

const additionalCss = `
/* VIP Multi-Tag Chips & Interactive Candidate Drawer */
.multitag-chain-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding: 4px 0 8px 0;
  min-height: 38px;
}

.multitag-tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%);
  border: 1px solid rgba(251, 191, 36, 0.45);
  border-radius: 20px;
  padding: 5px 11px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInPop 0.2s ease-out;
}

.multitag-tag-chip:hover {
  border-color: #fbbf24;
  box-shadow: 0 0 12px rgba(251, 191, 36, 0.35);
  transform: translateY(-1px);
}

.multitag-tag-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 6px currentColor;
}

.multitag-tag-name {
  font-size: 12.5px;
  font-weight: 700;
  color: #f8fafc;
  letter-spacing: 0.2px;
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.multitag-tag-remove {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: rgba(255, 255, 255, 0.6);
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
  margin-left: 2px;
}

.multitag-tag-remove:hover {
  background: #f43f5e;
  color: #ffffff;
  transform: scale(1.15);
}

.multitag-chain-plus-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.15) 100%);
  border: 1px dashed rgba(251, 191, 36, 0.65);
  color: #fbbf24;
  font-size: 12px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.multitag-chain-plus-btn:hover {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #0f172a;
  border-style: solid;
  transform: scale(1.05);
  box-shadow: 0 0 14px rgba(251, 191, 36, 0.55);
}

.multitag-picker-drawer {
  margin-top: 6px;
  margin-bottom: 8px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(251, 191, 36, 0.35);
  border-radius: 12px;
  padding: 10px 12px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(10px);
  animation: fadeInSlideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.multitag-picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.multitag-picker-title {
  font-size: 11.5px;
  font-weight: 700;
  color: #fbbf24;
  display: flex;
  align-items: center;
  gap: 6px;
  letter-spacing: 0.2px;
}

.multitag-picker-close-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.45);
  font-size: 13px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: all 0.15s ease;
}

.multitag-picker-close-btn:hover {
  color: #f43f5e;
  background: rgba(244, 63, 94, 0.15);
}

.multitag-picker-search-wrap {
  display: flex;
  align-items: center;
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 5px 10px;
  margin-bottom: 8px;
  gap: 8px;
  transition: border-color 0.18s ease;
}

.multitag-picker-search-wrap:focus-within {
  border-color: rgba(251, 191, 36, 0.6);
  box-shadow: 0 0 10px rgba(251, 191, 36, 0.2);
}

.multitag-picker-search-icon {
  color: var(--text-muted);
  font-size: 11px;
}

.multitag-picker-search-input {
  background: transparent;
  border: none;
  color: #f8fafc;
  font-size: 12px;
  width: 100%;
  outline: none;
}

.multitag-candidate-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 155px;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
}

.multitag-candidate-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 10px;
  border-radius: 8px;
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

.multitag-candidate-item:hover,
.multitag-candidate-item.hovered {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.18) 0%, rgba(30, 41, 59, 0.95) 100%);
  border-color: rgba(251, 191, 36, 0.6);
  transform: translateX(3px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.candidate-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.candidate-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}

.candidate-name {
  font-size: 12.5px;
  font-weight: 600;
  color: #f1f5f9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.candidate-count-badge {
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.candidate-count-badge.has-photos {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.45);
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.2);
}

.candidate-count-badge.zero-photos {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.38);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.multitag-result-card.hover-previewing {
  border-color: #38bdf8;
  box-shadow: 0 0 16px rgba(56, 189, 248, 0.3);
}

@keyframes fadeInSlideDown {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInPop {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}
`;

if (!styleCss.includes('.multitag-tag-chip')) {
  styleCss += '\n' + additionalCss;
  fs.writeFileSync(styleCssPath, styleCss, 'utf8');
  console.log('  ✓ Updated web/style.css with VIP Chips and Candidate Drawer styles');
}

// 3. UPDATE web/app.js
const appJsPath = path.join(__dirname, '../web/app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// Find resetMultiTagUI and replace with updated comprehensive version
const oldEngineRegex = /\/\/ -------------------------------------------------------------\s*\/\/ VIP MULTI-TAG ALBUM INTERSECTION ENGINE\s*\/\/ -------------------------------------------------------------[\s\S]*?(?=window\.selectMultiTagAsDestination = function)/;

const newEngineCode = `// -------------------------------------------------------------
  // VIP MULTI-TAG ALBUM INTERSECTION ENGINE
  // -------------------------------------------------------------
  function resetMultiTagUI() {
    const multiTagContainer = document.getElementById('moveCopyMultiTagContainer');
    const multiTagToggleBtn = document.getElementById('multiTagToggleBtn');
    const multiTagBody = document.getElementById('multiTagBuilderBody');
    const multiTagBadge = document.getElementById('multiTagActiveBadge');
    const multiTagCard = document.getElementById('multiTagResultCard');
    const multiTagRow = document.getElementById('multiTagChainRow');
    const pickerDrawer = document.getElementById('multiTagPickerDrawer');
    const searchInput = document.getElementById('multiTagPickerSearchInput');
    if (multiTagContainer) multiTagContainer.classList.remove('highlighted-dest');
    if (multiTagToggleBtn) {
      multiTagToggleBtn.classList.remove('expanded');
      multiTagToggleBtn.setAttribute('aria-expanded', 'false');
    }
    if (multiTagBody) multiTagBody.style.display = 'none';
    if (multiTagBadge) multiTagBadge.style.display = 'none';
    if (multiTagCard) {
      multiTagCard.style.display = 'none';
      multiTagCard.classList.remove('active-destination', 'hover-previewing');
    }
    if (pickerDrawer) pickerDrawer.style.display = 'none';
    if (searchInput) searchInput.value = '';
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

      // Initialize with source album if open in album mode, else leave empty or first tag
      if (!Array.isArray(state.moveCopyMultiTags) || state.moveCopyMultiTags.length === 0) {
        if (state.moveCopySourceAlbum) {
          state.moveCopyMultiTags = [state.moveCopySourceAlbum];
        } else if (state.tags && state.tags.length > 0) {
          // Preselect first tag to give immediate anchor
          state.moveCopyMultiTags = [state.tags[0].name];
        } else {
          state.moveCopyMultiTags = [];
        }
      }

      window.renderMultiTagChain();
      // If at least one tag is selected, automatically open the candidate picker drawer so user can immediately see option B with counts!
      if (state.moveCopyMultiTags.length > 0) {
        window.openMultiTagPicker();
      }
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

    const allTags = state.tags || [];
    const validTags = (state.moveCopyMultiTags || []).filter(t => t && t.trim().length > 0);

    // Update active badge in toggle header
    if (badge) {
      if (validTags.length > 0) {
        badge.style.display = 'inline-block';
        badge.textContent = window.t ? window.t('organize_multitag_badge', { count: validTags.length }) : \`\${validTags.length} tags combined\`;
      } else {
        badge.style.display = 'none';
      }
    }

    // Render tag chips
    const chipsHtml = validTags.map((tagName, idx) => {
      const tagObj = allTags.find(t => t.name.toLowerCase() === tagName.toLowerCase());
      const dotColor = tagObj ? tagObj.color : '#fbbf24';

      return \`
        <div class="multitag-tag-chip" title="\${escapeHtml(tagName)}">
          <span class="multitag-tag-dot" style="background: \${dotColor}; color: \${dotColor};"></span>
          <span class="multitag-tag-name">\${escapeHtml(tagName)}</span>
          <button type="button" class="multitag-tag-remove" onclick="removeMultiTagChainItem(\${idx})" title="Remove \${escapeHtml(tagName)}" aria-label="Remove \${escapeHtml(tagName)}">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      \`;
    }).join('');

    // Check if remaining unselected tags exist
    const selectedSet = new Set(validTags.map(t => t.toLowerCase()));
    const unselectedRemaining = allTags.filter(t => !selectedSet.has(t.name.toLowerCase()));

    let plusBtnHtml = '';
    if (unselectedRemaining.length > 0) {
      const plusLabel = validTags.length === 0
        ? (window.t ? window.t('organize_multitag_placeholder') : 'Choose 1st Tag...')
        : (validTags.length === 1 ? '+ Add 2nd Tag...' : '+ Add Another Tag...');
      plusBtnHtml = \`
        <button type="button" class="multitag-chain-plus-btn" onclick="openMultiTagPicker()" title="Add another tag" aria-label="Add another tag">
          <i class="fa-solid fa-plus"></i>
          <span>\${plusLabel}</span>
        </button>
      \`;
    }

    chainRow.innerHTML = chipsHtml + plusBtnHtml;

    // Refresh candidate picker list if drawer is open
    const drawer = document.getElementById('multiTagPickerDrawer');
    if (drawer && drawer.style.display !== 'none') {
      window.renderMultiTagCandidateList();
    }

    // Recalculate intersection
    window.updateMultiTagIntersection();
  };

  window.openMultiTagPicker = function() {
    const drawer = document.getElementById('multiTagPickerDrawer');
    const searchInput = document.getElementById('multiTagPickerSearchInput');
    const titleText = document.getElementById('multiTagPickerTitleText');
    if (!drawer) return;

    drawer.style.display = 'block';
    if (searchInput) searchInput.value = '';

    const validTags = (state.moveCopyMultiTags || []).filter(t => t && t.trim().length > 0);
    if (titleText) {
      if (validTags.length === 0) {
        titleText.textContent = 'Select starting tag:';
      } else if (validTags.length === 1) {
        titleText.textContent = \`Combine with '\${validTags[0]}':\`;
      } else {
        titleText.textContent = \`Combine with '\${validTags.join(' + ')}':\`;
      }
    }

    window.renderMultiTagCandidateList();
  };

  window.closeMultiTagPicker = function() {
    const drawer = document.getElementById('multiTagPickerDrawer');
    if (drawer) drawer.style.display = 'none';
    window.clearCandidateHoverPreview();
  };

  window.handleMultiTagPickerSearch = function(query) {
    window.renderMultiTagCandidateList(query);
  };

  window.renderMultiTagCandidateList = function(searchQuery) {
    const listEl = document.getElementById('multiTagCandidateList');
    if (!listEl) return;

    const allTags = state.tags || [];
    const validTags = (state.moveCopyMultiTags || []).filter(t => t && t.trim().length > 0);
    const selectedSet = new Set(validTags.map(t => t.toLowerCase()));

    // STRICT EXCLUSION: If a tag is already selected in the chain, it NEVER appears in the candidates list!
    let candidates = allTags.filter(t => !selectedSet.has(t.name.toLowerCase()));

    const q = (searchQuery !== undefined ? searchQuery : (document.getElementById('multiTagPickerSearchInput')?.value || '')).trim().toLowerCase();
    if (q) {
      candidates = candidates.filter(t => t.name.toLowerCase().includes(q));
    }

    if (candidates.length === 0) {
      listEl.innerHTML = \`
        <div style="text-align: center; padding: 14px; color: var(--text-muted); font-size: 12px;">
          \${allTags.length === validTags.length ? 'All available tags are already selected!' : 'No matching tags found.'}
        </div>
      \`;
      return;
    }

    const validPhotos = (state.photos || []).filter(p => !p.isPending && !p.deletedAt);

    listEl.innerHTML = candidates.map(candidate => {
      // Calculate intersection count of [current valid tags] + [this candidate]
      const hypotheticalCombination = [...validTags, candidate.name];
      const matchCount = validPhotos.filter(p =>
        hypotheticalCombination.every(vt => p.tags && p.tags.some(pt => pt.toLowerCase() === vt.toLowerCase()))
      ).length;

      const countNoun = matchCount === 1
        ? (window.t ? window.t('organize_photo_singular') : 'photo')
        : (window.t ? window.t('organize_photos_plural') : 'photos');

      const badgeHtml = matchCount > 0
        ? \`<span class="candidate-count-badge has-photos"><i class="fa-solid fa-sparkles"></i> \${matchCount} \${countNoun} \${validTags.length > 0 ? \`with \${escapeHtml(validTags[validTags.length - 1])}\` : 'total'}</span>\`
        : \`<span class="candidate-count-badge zero-photos">0 photos match</span>\`;

      return \`
        <div class="multitag-candidate-item" 
             onmouseenter="hoverPreviewCandidate('\${escapeHtml(candidate.name)}')" 
             onclick="pickCandidateTag('\${escapeHtml(candidate.name)}')">
          <div class="candidate-left">
            <span class="candidate-dot" style="background: \${candidate.color};"></span>
            <span class="candidate-name">\${escapeHtml(candidate.name)}</span>
          </div>
          \${badgeHtml}
        </div>
      \`;
    }).join('');
  };

  // Live Hover Preview
  window.hoverPreviewCandidate = function(candidateTagName) {
    const card = document.getElementById('multiTagResultCard');
    const dotStack = document.getElementById('multiTagDotStack');
    const label = document.getElementById('multiTagResultLabel');
    const countEl = document.getElementById('multiTagResultCount');
    const thumbsRail = document.getElementById('multiTagMatchingThumbs');
    if (!card) return;

    const validTags = (state.moveCopyMultiTags || []).filter(t => t && t.trim().length > 0);
    const hypothetical = [...validTags, candidateTagName];

    card.style.display = 'block';
    card.classList.add('hover-previewing');

    // Dot stack
    if (dotStack) {
      const allTags = state.tags || [];
      dotStack.innerHTML = hypothetical.map(t => {
        const tagObj = allTags.find(tag => tag.name.toLowerCase() === t.toLowerCase());
        const color = tagObj ? tagObj.color : '#fbbf24';
        return \`<span class="multitag-stack-dot" style="background: \${color};" title="\${escapeHtml(t)}"></span>\`;
      }).join('');
    }

    // Label: Live Hover Preview
    if (label) {
      label.innerHTML = \`<i class="fa-solid fa-eye" style="color: #38bdf8; margin-right: 4px;"></i> Preview: <strong>\${escapeHtml(hypothetical.join(' + '))}</strong>\`;
    }

    // Matching photos calculation
    const validPhotos = (state.photos || []).filter(p => !p.isPending && !p.deletedAt);
    const matchingPhotos = validPhotos.filter(p =>
      hypothetical.every(vt => p.tags && p.tags.some(pt => pt.toLowerCase() === vt.toLowerCase()))
    );

    if (countEl) {
      if (matchingPhotos.length === 0) {
        countEl.textContent = '0 photos currently have all these tags';
      } else {
        const countNoun = matchingPhotos.length === 1
          ? (window.t ? window.t('organize_photo_singular') : 'photo')
          : (window.t ? window.t('organize_photos_plural') : 'photos');
        countEl.textContent = \`\${matchingPhotos.length} \${countNoun} match combination\`;
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
  };

  window.clearCandidateHoverPreview = function() {
    const card = document.getElementById('multiTagResultCard');
    if (card) card.classList.remove('hover-previewing');

    // Revert to active selected tags
    window.updateMultiTagIntersection();
  };

  window.pickCandidateTag = function(candidateTagName) {
    if (!Array.isArray(state.moveCopyMultiTags)) state.moveCopyMultiTags = [];
    if (!state.moveCopyMultiTags.some(t => t.toLowerCase() === candidateTagName.toLowerCase())) {
      state.moveCopyMultiTags.push(candidateTagName);
    }

    const validTags = state.moveCopyMultiTags.filter(t => t && t.trim().length > 0);

    // If at least 2 tags are now chosen, automatically set as combined destination!
    if (validTags.length >= 2) {
      state.moveCopyIsMultiTagDest = true;
      state.moveCopyDestinationTags = [...validTags];
      state.moveCopyDestinationAlbum = validTags.join(' + ');
      updateMoveCopyConfirmButton();
      showToast(\`✨ Combined '\${state.moveCopyDestinationAlbum}' as destination!\`);
    }

    window.renderMultiTagChain();
    window.renderMoveCopyAlbumsList();
  };

  window.removeMultiTagChainItem = function(idx) {
    if (!Array.isArray(state.moveCopyMultiTags)) return;
    state.moveCopyMultiTags.splice(idx, 1);

    const validTags = state.moveCopyMultiTags.filter(t => t && t.trim().length > 0);
    if (validTags.length < 2) {
      state.moveCopyIsMultiTagDest = false;
      state.moveCopyDestinationAlbum = null;
      state.moveCopyDestinationTags = null;
      updateMoveCopyConfirmButton();
    } else {
      state.moveCopyIsMultiTagDest = true;
      state.moveCopyDestinationTags = [...validTags];
      state.moveCopyDestinationAlbum = validTags.join(' + ');
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

    // Label: "Both tags match:" vs "All tags match:"
    if (label) {
      label.innerHTML = validTags.length === 2
        ? \`Both tags match: <strong>\${escapeHtml(validTags.join(' + '))}</strong>\`
        : \`All \${validTags.length} tags match: <strong>\${escapeHtml(validTags.join(' + '))}</strong>\`;
    }

    // Calculate intersection
    const validPhotos = (state.photos || []).filter(p => !p.isPending && !p.deletedAt);
    const matchingPhotos = validPhotos.filter(p =>
      validTags.every(vt => p.tags && p.tags.some(pt => pt.toLowerCase() === vt.toLowerCase()))
    );

    if (countEl) {
      if (matchingPhotos.length === 0) {
        countEl.textContent = '0 photos currently match all tags';
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

  `;

appJs = appJs.replace(oldEngineRegex, newEngineCode);

// Add new exports
const exportSearch = '  window.toggleMultiTagBuilder = toggleMultiTagBuilder;';
const newExports = `  window.toggleMultiTagBuilder = toggleMultiTagBuilder;
  window.renderMultiTagChain = renderMultiTagChain;
  window.openMultiTagPicker = openMultiTagPicker;
  window.closeMultiTagPicker = closeMultiTagPicker;
  window.handleMultiTagPickerSearch = handleMultiTagPickerSearch;
  window.renderMultiTagCandidateList = renderMultiTagCandidateList;
  window.hoverPreviewCandidate = hoverPreviewCandidate;
  window.clearCandidateHoverPreview = clearCandidateHoverPreview;
  window.pickCandidateTag = pickCandidateTag;
  window.removeMultiTagChainItem = removeMultiTagChainItem;
  window.updateMultiTagIntersection = updateMultiTagIntersection;
  window.selectMultiTagAsDestination = selectMultiTagAsDestination;`;

appJs = appJs.replace(
  /window\.toggleMultiTagBuilder = toggleMultiTagBuilder;[\s\S]*?window\.selectMultiTagAsDestination = selectMultiTagAsDestination;/,
  newExports
);

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('  ✓ Updated web/app.js with VIP Chips, Candidate Drawer, and Live Hover Previews');
