const fs = require('fs');
const path = require('path');

console.log('--- Applying Luxury VIP Multi-Tag Studio Upgrade ---');

// ==========================================
// 1. UPDATE web/index.html
// ==========================================
const indexHtmlPath = path.join(__dirname, '../web/index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

const oldContainerRegex = /<!-- Multi-Tag Album Intersection Builder \(Collapsible VIP Feature\) -->[\s\S]*?<!-- Destination Album Selection List -->/;

const newContainerHtml = `<!-- Multi-Tag Album Intersection Studio (Luxury VIP Feature) -->
          <div class="move-copy-multitag-container" id="moveCopyMultiTagContainer">
            <!-- Header Toggle Bar -->
            <button type="button" class="multitag-toggle-btn" id="multiTagToggleBtn" onclick="toggleMultiTagBuilder()" aria-expanded="false">
              <div class="multitag-toggle-left">
                <span class="multitag-icon-badge">
                  <i class="fa-solid fa-layer-group"></i>
                </span>
                <div class="multitag-title-wrap">
                  <span class="multitag-title" id="multiTagHeaderTitle">Multi-Tag Studio</span>
                  <span class="multitag-badge" id="multiTagActiveBadge" style="display: none;">0 tags</span>
                </div>
              </div>
              <div class="multitag-toggle-right">
                <span class="multitag-pro-pill"><i class="fa-solid fa-crown" style="color: #fbbf24; font-size: 10px;"></i> VIP</span>
                <i class="fa-solid fa-chevron-down multitag-chevron" id="multiTagChevron"></i>
              </div>
            </button>

            <!-- Spacious Luxury Studio Body -->
            <div class="multitag-builder-body" id="multiTagBuilderBody" style="display: none;">
              <!-- Formula Row: Selected Tags & Connectors -->
              <div class="multitag-formula-section">
                <div class="multitag-section-label" id="multiTagFormulaLabel">Active Combination:</div>
                <div class="multitag-chain-row" id="multiTagChainRow">
                  <!-- Rendered by JS: Chips for Tag 1, Tag 2, Tag 3 + Plus Button -->
                </div>
              </div>

              <!-- Available Tags to Combine (Directly Visible - No Hidden Sub-Drawers) -->
              <div class="multitag-candidates-section" id="multiTagCandidatesSection">
                <div class="multitag-candidates-header">
                  <span class="multitag-candidates-title" id="multiTagCandidatesTitle">Select Tag to Combine:</span>
                  <span class="multitag-hover-hint"><i class="fa-solid fa-arrow-pointer"></i> Hover to preview</span>
                </div>
                <!-- Search filter for tags -->
                <div class="multitag-picker-search-wrap">
                  <i class="fa-solid fa-magnifying-glass multitag-picker-search-icon"></i>
                  <input type="text" class="multitag-picker-search-input" id="multiTagPickerSearchInput" placeholder="Filter available tags..." oninput="handleMultiTagPickerSearch(this.value)">
                </div>
                <!-- Scrollable Candidate Cards with Live Counts -->
                <div class="multitag-candidate-list" id="multiTagCandidateList" onmouseleave="clearCandidateHoverPreview()">
                  <!-- Rendered by JS: Candidates with photo counts & hover events -->
                </div>
              </div>

              <!-- Live Preview / Destination Summary Card -->
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
                    <i class="fa-solid fa-check"></i> <span id="multiTagSelectBtnText" data-i18n="organize_multitag_select_dest">Select Destination</span>
                  </button>
                </div>
                <!-- Thumbnail Rail of Matching Intersection Photos -->
                <div class="multitag-matching-thumbs" id="multiTagMatchingThumbs" style="display: none;"></div>
              </div>
            </div>
          </div>

          <!-- Destination Album Selection List -->`;

indexHtml = indexHtml.replace(oldContainerRegex, newContainerHtml);
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('✓ Updated web/index.html with Luxury Studio markup');

// ==========================================
// 2. UPDATE web/style.css
// ==========================================
const styleCssPath = path.join(__dirname, '../web/style.css');
let styleCss = fs.readFileSync(styleCssPath, 'utf8');

const oldCssRegex = /\/\* Multi-Tag Album Intersection Builder \(Luxury VIP Aesthetic\) \*\/[\s\S]*?(?=\.move-copy-albums-list \{)/;

const newStudioCss = `/* Multi-Tag Album Intersection Studio (Luxury VIP Aesthetic) */
.move-copy-multitag-container {
  background: linear-gradient(145deg, rgba(22, 29, 49, 0.95) 0%, rgba(13, 18, 32, 0.98) 100%);
  border: 1.5px solid rgba(251, 191, 36, 0.35);
  border-radius: 16px;
  margin-bottom: 14px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: visible;
}

.move-copy-multitag-container:hover {
  border-color: rgba(251, 191, 36, 0.55);
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.5), 0 0 16px rgba(251, 191, 36, 0.18);
}

.move-copy-multitag-container.highlighted-dest {
  border-color: #fbbf24;
  box-shadow: 0 0 24px rgba(251, 191, 36, 0.32), inset 0 0 12px rgba(251, 191, 36, 0.1);
}

.multitag-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 14px;
  background: transparent;
  border: none;
  cursor: pointer;
  user-select: none;
  border-radius: 15px;
  transition: background 0.18s ease;
}

.multitag-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

.multitag-toggle-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.multitag-icon-badge {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.25) 0%, rgba(244, 63, 94, 0.2) 100%);
  color: #fbbf24;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(251, 191, 36, 0.4);
  flex-shrink: 0;
  box-shadow: 0 0 10px rgba(251, 191, 36, 0.2);
}

.multitag-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.multitag-title {
  font-size: 13.5px;
  font-weight: 700;
  color: #f8fafc;
  letter-spacing: 0.2px;
}

.multitag-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.25) 0%, rgba(245, 158, 11, 0.2) 100%);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.5);
  flex-shrink: 0;
}

.multitag-toggle-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.multitag-pro-pill {
  font-size: 10.5px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 10px;
  background: rgba(251, 191, 36, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.35);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  letter-spacing: 0.5px;
}

.multitag-chevron {
  font-size: 12px;
  color: #94a3b8;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), color 0.18s ease;
}

.multitag-toggle-btn.expanded .multitag-chevron {
  transform: rotate(180deg);
  color: #fbbf24;
}

.multitag-builder-body {
  padding: 14px 16px 16px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(10, 15, 28, 0.5);
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
}

/* Formula Row */
.multitag-formula-section {
  margin-bottom: 12px;
}

.multitag-section-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #94a3b8;
  margin-bottom: 6px;
}

.multitag-chain-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  min-height: 40px;
}

.multitag-tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%);
  border: 1.5px solid rgba(251, 191, 36, 0.45);
  border-radius: 20px;
  padding: 6px 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

.multitag-tag-chip:hover {
  border-color: #fbbf24;
  box-shadow: 0 0 14px rgba(251, 191, 36, 0.4);
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
  font-size: 13px;
  font-weight: 700;
  color: #f8fafc;
  letter-spacing: 0.2px;
}

.multitag-tag-remove {
  background: rgba(255, 255, 255, 0.12);
  border: none;
  color: rgba(255, 255, 255, 0.7);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s ease;
  margin-left: 2px;
}

.multitag-tag-remove:hover {
  background: #f43f5e;
  color: #ffffff;
  transform: scale(1.15);
}

.multitag-waiting-slot {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #fbbf24;
  font-size: 12px;
  font-weight: 600;
  font-style: italic;
  padding: 6px 10px;
  background: rgba(251, 191, 36, 0.08);
  border: 1px dashed rgba(251, 191, 36, 0.35);
  border-radius: 12px;
}

.multitag-chain-plus-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.22) 0%, rgba(245, 158, 11, 0.18) 100%);
  border: 1.5px dashed rgba(251, 191, 36, 0.7);
  color: #fbbf24;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.multitag-chain-plus-btn:hover {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #0f172a;
  border-style: solid;
  transform: scale(1.05);
  box-shadow: 0 0 16px rgba(251, 191, 36, 0.6);
}

/* Candidate Tags Section (Directly Visible) */
.multitag-candidates-section {
  margin-top: 12px;
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(251, 191, 36, 0.25);
  border-radius: 14px;
  padding: 12px;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.3);
}

.multitag-candidates-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.multitag-candidates-title {
  font-size: 12px;
  font-weight: 700;
  color: #fbbf24;
  letter-spacing: 0.2px;
}

.multitag-hover-hint {
  font-size: 11px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 4px;
}

.multitag-picker-search-wrap {
  display: flex;
  align-items: center;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 6px 10px;
  margin-bottom: 8px;
  gap: 8px;
  transition: all 0.18s ease;
}

.multitag-picker-search-wrap:focus-within {
  border-color: #fbbf24;
  box-shadow: 0 0 12px rgba(251, 191, 36, 0.25);
}

.multitag-picker-search-icon {
  color: #94a3b8;
  font-size: 12px;
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
  gap: 6px;
  max-height: 180px;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
}

.multitag-candidate-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 12px;
  border-radius: 10px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

.multitag-candidate-card:hover,
.multitag-candidate-card.hovered {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(30, 41, 59, 0.95) 100%);
  border-color: rgba(251, 191, 36, 0.65);
  transform: translateX(3px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
}

.candidate-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.candidate-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 6px currentColor;
}

.candidate-name {
  font-size: 13px;
  font-weight: 700;
  color: #f1f5f9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.candidate-count-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.candidate-count-badge.has-photos {
  background: rgba(16, 185, 129, 0.22);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.5);
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.25);
}

.candidate-count-badge.zero-photos {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Result / Preview Card */
.multitag-result-card {
  margin-top: 14px;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.12) 0%, rgba(244, 63, 94, 0.1) 100%);
  border: 1.5px solid rgba(251, 191, 36, 0.45);
  border-radius: 12px;
  padding: 12px 14px;
  transition: all 0.25s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

.multitag-result-card.hover-previewing {
  border-color: #38bdf8;
  box-shadow: 0 0 20px rgba(56, 189, 248, 0.35);
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(30, 41, 59, 0.9) 100%);
}

.multitag-result-card.active-destination {
  border-color: #fbbf24;
  box-shadow: 0 0 22px rgba(251, 191, 36, 0.38);
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.18) 0%, rgba(244, 63, 94, 0.12) 100%);
}

.multitag-result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.multitag-result-info {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.multitag-result-dot-stack {
  display: inline-flex;
  align-items: center;
  margin-right: 4px;
}

.multitag-stack-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #0f172a;
  margin-right: -6px;
  display: inline-block;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.6);
}

.multitag-result-label {
  font-size: 11.5px;
  color: #cbd5e1;
  font-weight: 600;
}

.multitag-result-count {
  font-size: 13.5px;
  font-weight: 800;
  color: #ffffff;
}

.multitag-select-btn {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.25) 0%, rgba(245, 158, 11, 0.2) 100%);
  border: 1px solid rgba(251, 191, 36, 0.6);
  color: #fbbf24;
  font-size: 12px;
  font-weight: 700;
  padding: 7px 14px;
  border-radius: 10px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.multitag-select-btn:hover {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #0f172a;
  box-shadow: 0 0 16px rgba(251, 191, 36, 0.55);
}

.multitag-select-btn.selected {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  border-color: #10b981;
  box-shadow: 0 0 16px rgba(16, 185, 129, 0.5);
}

.multitag-matching-thumbs {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 0;
  scrollbar-width: none;
}

.multitag-match-thumb {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  object-fit: cover;
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  flex-shrink: 0;
}

.multitag-match-more {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px dashed rgba(255, 255, 255, 0.3);
}

.move-copy-album-row.multitag-combined-row {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.14) 0%, rgba(244, 63, 94, 0.1) 100%);
  border: 1.5px dashed rgba(251, 191, 36, 0.6);
}

.move-copy-album-row.multitag-combined-row.selected {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.25) 0%, rgba(244, 63, 94, 0.16) 100%);
  border-style: solid;
  border-color: #fbbf24;
  box-shadow: 0 0 18px rgba(251, 191, 36, 0.32);
}

.move-copy-album-row.multitag-combined-row .album-row-radio {
  border-color: #fbbf24;
}

.move-copy-album-row.multitag-combined-row.selected .album-row-radio {
  background: #fbbf24;
  border-color: #fbbf24;
  color: #0f172a;
}
`;

styleCss = styleCss.replace(oldCssRegex, newStudioCss);
fs.writeFileSync(styleCssPath, styleCss, 'utf8');
console.log('✓ Updated web/style.css with Luxury Studio styles');

// ==========================================
// 3. UPDATE web/app.js (Clean, Bulletproof Logic)
// ==========================================
const appJsPath = path.join(__dirname, '../web/app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

const oldAppJsEngineRegex = /\/\/ -------------------------------------------------------------\s*\/\/ VIP MULTI-TAG ALBUM INTERSECTION ENGINE\s*\/\/ -------------------------------------------------------------[\s\S]*?(?=window\.selectMultiTagAsDestination = function)/;

const newAppJsEngine = `// -------------------------------------------------------------
  // VIP MULTI-TAG ALBUM INTERSECTION ENGINE (LUXURY STUDIO)
  // -------------------------------------------------------------
  function resetMultiTagUI() {
    const multiTagContainer = document.getElementById('moveCopyMultiTagContainer');
    const multiTagToggleBtn = document.getElementById('multiTagToggleBtn');
    const multiTagBody = document.getElementById('multiTagBuilderBody');
    const multiTagBadge = document.getElementById('multiTagActiveBadge');
    const multiTagCard = document.getElementById('multiTagResultCard');
    const multiTagRow = document.getElementById('multiTagChainRow');
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

      // Initialize with source album if in album mode, else with first available tag
      if (!Array.isArray(state.moveCopyMultiTags) || state.moveCopyMultiTags.length === 0) {
        if (state.moveCopySourceAlbum) {
          state.moveCopyMultiTags = [state.moveCopySourceAlbum];
        } else if (state.tags && state.tags.length > 0) {
          state.moveCopyMultiTags = [state.tags[0].name];
        } else {
          state.moveCopyMultiTags = [];
        }
      }

      window.renderMultiTagStudio();
    } else {
      body.style.display = 'none';
      toggleBtn.classList.remove('expanded');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  };

  // Main Studio Render: Updates formula row & candidate options simultaneously
  window.renderMultiTagStudio = function() {
    window.renderMultiTagChain();
    window.renderMultiTagCandidateList();
    window.updateMultiTagIntersection();
  };

  window.renderMultiTagChain = function() {
    const chainRow = document.getElementById('multiTagChainRow');
    const badge = document.getElementById('multiTagActiveBadge');
    if (!chainRow) return;

    const allTags = state.tags || [];
    const validTags = (state.moveCopyMultiTags || []).filter(t => t && String(t).trim().length > 0);

    // Update active badge in toggle header
    if (badge) {
      if (validTags.length > 0) {
        badge.style.display = 'inline-block';
        badge.textContent = \`\${validTags.length} \${validTags.length === 1 ? 'tag active' : 'tags combined'}\`;
      } else {
        badge.style.display = 'none';
      }
    }

    // Render tag chips
    const chipsHtml = validTags.map((tagName, idx) => {
      const tagObj = allTags.find(t => t.name.toLowerCase() === String(tagName).toLowerCase());
      const dotColor = tagObj ? tagObj.color : '#fbbf24';

      return \`
        <div class="multitag-tag-chip" title="\${escapeHtml(tagName)}">
          <span class="multitag-tag-dot" style="background: \${dotColor}; color: \${dotColor};"></span>
          <span class="multitag-tag-name">\${escapeHtml(tagName)}</span>
          <button type="button" class="multitag-tag-remove" onclick="event.stopPropagation(); window.removeMultiTagChainItem(\${idx});" title="Remove tag" aria-label="Remove tag">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      \`;
    }).join('');

    // Check if remaining unselected tags exist
    const selectedSet = new Set(validTags.map(t => String(t).toLowerCase()));
    const unselectedRemaining = allTags.filter(t => !selectedSet.has(t.name.toLowerCase()));

    let extraSlotHtml = '';
    if (validTags.length === 1 && unselectedRemaining.length > 0) {
      extraSlotHtml = \`<span class="multitag-waiting-slot"><i class="fa-solid fa-arrow-down" style="font-size: 10px;"></i> Select second tag below</span>\`;
    } else if (validTags.length >= 2 && unselectedRemaining.length > 0) {
      extraSlotHtml = \`
        <button type="button" class="multitag-chain-plus-btn" onclick="document.getElementById('multiTagCandidatesSection')?.scrollIntoView({ behavior: 'smooth' })" title="Add another tag" aria-label="Add another tag">
          <i class="fa-solid fa-plus"></i>
          <span>Add \${validTags.length + 1}th Tag...</span>
        </button>
      \`;
    }

    chainRow.innerHTML = chipsHtml + extraSlotHtml;
  };

  window.handleMultiTagPickerSearch = function(query) {
    window.renderMultiTagCandidateList(query);
  };

  window.renderMultiTagCandidateList = function(searchQuery) {
    const listEl = document.getElementById('multiTagCandidateList');
    const titleEl = document.getElementById('multiTagCandidatesTitle');
    if (!listEl) return;

    const allTags = state.tags || [];
    const validTags = (state.moveCopyMultiTags || []).filter(t => t && String(t).trim().length > 0);
    const selectedSet = new Set(validTags.map(t => String(t).toLowerCase()));

    // STRICT EXCLUSION: If a tag is already selected in the chain, it NEVER appears in the candidates list!
    let candidates = allTags.filter(t => !selectedSet.has(t.name.toLowerCase()));

    // Title explanation
    if (titleEl) {
      if (validTags.length === 0) {
        titleEl.textContent = 'Select starting tag:';
      } else if (validTags.length === 1) {
        titleEl.textContent = \`Select second tag to combine with '\${validTags[0]}':\`;
      } else {
        titleEl.textContent = \`Combine with '\${validTags.join(' + ')}':\`;
      }
    }

    const q = (searchQuery !== undefined ? searchQuery : (document.getElementById('multiTagPickerSearchInput')?.value || '')).trim().toLowerCase();
    if (q) {
      candidates = candidates.filter(t => t.name.toLowerCase().includes(q));
    }

    if (candidates.length === 0) {
      listEl.innerHTML = \`
        <div style="text-align: center; padding: 18px 10px; color: var(--text-muted); font-size: 12.5px;">
          \${allTags.length === validTags.length ? 'All available tags are already selected in this combination!' : 'No matching tags found.'}
        </div>
      \`;
      return;
    }

    const validPhotos = (state.photos || []).filter(p => !p.isPending && !p.deletedAt);

    listEl.innerHTML = candidates.map(candidate => {
      // Calculate intersection count of [current valid tags] + [this candidate]
      const hypotheticalCombination = [...validTags, candidate.name];
      const matchCount = validPhotos.filter(p =>
        Array.isArray(p.tags) && hypotheticalCombination.every(vt =>
          p.tags.some(pt => pt && String(pt).toLowerCase() === String(vt).toLowerCase())
        )
      ).length;

      const countNoun = matchCount === 1 ? 'photo' : 'photos';

      const badgeHtml = matchCount > 0
        ? \`<span class="candidate-count-badge has-photos"><i class="fa-solid fa-sparkles"></i> \${matchCount} \${countNoun} in common</span>\`
        : \`<span class="candidate-count-badge zero-photos">0 common photos</span>\`;

      // Safe parameter passing using encodeURIComponent to avoid quote breakage in inline handlers
      const safeCandidateName = encodeURIComponent(candidate.name);

      return \`
        <div class="multitag-candidate-card" 
             onmouseenter="window.hoverPreviewCandidate('\${safeCandidateName}')" 
             onclick="window.pickCandidateTag('\${safeCandidateName}')"
             title="Combine with \${escapeHtml(candidate.name)}">
          <div class="candidate-left">
            <span class="candidate-dot" style="background: \${candidate.color}; color: \${candidate.color};"></span>
            <span class="candidate-name">\${escapeHtml(candidate.name)}</span>
          </div>
          \${badgeHtml}
        </div>
      \`;
    }).join('');
  };

  // Live Hover Preview
  window.hoverPreviewCandidate = function(encodedCandidateTagName) {
    const candidateTagName = decodeURIComponent(encodedCandidateTagName);
    const card = document.getElementById('multiTagResultCard');
    const dotStack = document.getElementById('multiTagDotStack');
    const label = document.getElementById('multiTagResultLabel');
    const countEl = document.getElementById('multiTagResultCount');
    const thumbsRail = document.getElementById('multiTagMatchingThumbs');
    if (!card) return;

    const validTags = (state.moveCopyMultiTags || []).filter(t => t && String(t).trim().length > 0);
    const hypothetical = [...validTags, candidateTagName];

    card.style.display = 'block';
    card.classList.add('hover-previewing');

    // Dot stack
    if (dotStack) {
      const allTags = state.tags || [];
      dotStack.innerHTML = hypothetical.map(t => {
        const tagObj = allTags.find(tag => tag.name.toLowerCase() === String(t).toLowerCase());
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
      Array.isArray(p.tags) && hypothetical.every(vt =>
        p.tags.some(pt => pt && String(pt).toLowerCase() === String(vt).toLowerCase())
      )
    );

    if (countEl) {
      if (matchingPhotos.length === 0) {
        countEl.textContent = '0 photos currently match this combination';
      } else {
        const countNoun = matchingPhotos.length === 1 ? 'photo' : 'photos';
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

  window.pickCandidateTag = function(encodedCandidateTagName) {
    const candidateTagName = decodeURIComponent(encodedCandidateTagName);
    if (!Array.isArray(state.moveCopyMultiTags)) state.moveCopyMultiTags = [];

    if (!state.moveCopyMultiTags.some(t => String(t).toLowerCase() === candidateTagName.toLowerCase())) {
      state.moveCopyMultiTags.push(candidateTagName);
    }

    const validTags = state.moveCopyMultiTags.filter(t => t && String(t).trim().length > 0);

    // If at least 2 tags are now chosen, automatically set as combined destination!
    if (validTags.length >= 2) {
      state.moveCopyIsMultiTagDest = true;
      state.moveCopyDestinationTags = [...validTags];
      state.moveCopyDestinationAlbum = validTags.join(' + ');
      updateMoveCopyConfirmButton();
      showToast(\`✨ Combined '\${state.moveCopyDestinationAlbum}' as destination!\`);
    }

    window.renderMultiTagStudio();
    window.renderMoveCopyAlbumsList();
  };

  window.removeMultiTagChainItem = function(idx) {
    if (!Array.isArray(state.moveCopyMultiTags)) return;
    state.moveCopyMultiTags.splice(idx, 1);

    const validTags = state.moveCopyMultiTags.filter(t => t && String(t).trim().length > 0);
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

    window.renderMultiTagStudio();
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

    const validTags = (state.moveCopyMultiTags || []).filter(t => t && String(t).trim().length > 0);

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
        const tagObj = allTags.find(tag => tag.name.toLowerCase() === String(t).toLowerCase());
        const color = tagObj ? tagObj.color : '#fbbf24';
        return \`<span class="multitag-stack-dot" style="background: \${color};" title="\${escapeHtml(t)}"></span>\`;
      }).join('');
    }

    // Label
    if (label) {
      label.innerHTML = validTags.length === 2
        ? \`Both tags match: <strong>\${escapeHtml(validTags.join(' + '))}</strong>\`
        : \`All \${validTags.length} tags match: <strong>\${escapeHtml(validTags.join(' + '))}</strong>\`;
    }

    // Calculate intersection
    const validPhotos = (state.photos || []).filter(p => !p.isPending && !p.deletedAt);
    const matchingPhotos = validPhotos.filter(p =>
      Array.isArray(p.tags) && validTags.every(vt =>
        p.tags.some(pt => pt && String(pt).toLowerCase() === String(vt).toLowerCase())
      )
    );

    if (countEl) {
      if (matchingPhotos.length === 0) {
        countEl.textContent = '0 photos currently match all tags';
      } else {
        const countNoun = matchingPhotos.length === 1 ? 'photo' : 'photos';
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
        ? 'Destination Selected'
        : 'Select Combined Destination';
    }
  };

  `;

appJs = appJs.replace(oldAppJsEngineRegex, newAppJsEngine);

// Update exports at bottom
const exportsOldRegex = /window\.toggleMultiTagBuilder = toggleMultiTagBuilder;[\s\S]*?window\.selectMultiTagAsDestination = selectMultiTagAsDestination;/;

const newExports = `window.toggleMultiTagBuilder = toggleMultiTagBuilder;
  window.renderMultiTagStudio = renderMultiTagStudio;
  window.renderMultiTagChain = renderMultiTagChain;
  window.handleMultiTagPickerSearch = handleMultiTagPickerSearch;
  window.renderMultiTagCandidateList = renderMultiTagCandidateList;
  window.hoverPreviewCandidate = hoverPreviewCandidate;
  window.clearCandidateHoverPreview = clearCandidateHoverPreview;
  window.pickCandidateTag = pickCandidateTag;
  window.removeMultiTagChainItem = removeMultiTagChainItem;
  window.updateMultiTagIntersection = updateMultiTagIntersection;
  window.selectMultiTagAsDestination = selectMultiTagAsDestination;`;

appJs = appJs.replace(exportsOldRegex, newExports);

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('✓ Updated web/app.js with bulletproof Luxury Studio logic');
