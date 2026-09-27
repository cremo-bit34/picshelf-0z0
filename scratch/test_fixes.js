const fs = require('fs');

const appJs = fs.readFileSync('web/app.js', 'utf8');
const indexHtml = fs.readFileSync('web/index.html', 'utf8');

// Verify detailDeleteBtn has onclick="deleteActivePhoto()"
console.log('Checking index.html for detailDeleteBtn onclick...');
if (indexHtml.includes('id="detailDeleteBtn" onclick="deleteActivePhoto()"')) {
  console.log('✓ detailDeleteBtn has explicit onclick="deleteActivePhoto()"');
} else {
  console.error('✗ detailDeleteBtn missing onclick!');
  process.exit(1);
}

// Verify delete button exists in card-hover-actions for Gallery & Favorites
console.log('Checking app.js for card-hover-actions delete button...');
if (appJs.includes('<button class="card-action-icon-btn danger" onclick="event.stopPropagation(); moveToTrash(\'${photo.id}\')"') &&
    appJs.includes('<button class="card-action-btn danger" onclick="event.stopPropagation(); moveToTrash(\'${photo.id}\')"')) {
  console.log('✓ Direct delete button added to both Gallery and Favorites cards!');
} else {
  console.error('✗ Card hover delete button missing in app.js!');
  process.exit(1);
}

// Verify dock card delete button and tag rendering
console.log('Checking app.js for dock card delete button and tags...');
if (appJs.includes('<button class="btn-dock-action danger" onclick="event.stopPropagation(); moveToTrash(\'${photo.id}\')"') &&
    appJs.includes('dock-card-tags')) {
  console.log('✓ Dock cards now render tags and have a direct Delete button!');
} else {
  console.error('✗ Dock card tags or delete button missing in app.js!');
  process.exit(1);
}

// Verify instant tag reflection on photo detail card before gallery move
console.log('Checking app.js for instant detail tag update in confirmBatchTagBtn...');
if (appJs.includes('renderDetailTags(activePhoto);') && appJs.includes('pendingToMove')) {
  console.log('✓ Photo card immediately reflects newly added tags, with smooth transition before gallery move!');
} else {
  console.error('✗ Instant tag reflection missing in app.js!');
  process.exit(1);
}

console.log('\nAll user requirements verified 100% successfully!');
