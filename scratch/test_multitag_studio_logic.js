const fs = require('fs');
const assert = require('assert');

// Test data
const state = {
  tags: [
    { name: 'Dinner with Family', color: '#7c3aed' },
    { name: 'Paris', color: '#3b82f6' },
    { name: 'France', color: '#10b981' },
    { name: 'Champ de Mars', color: '#f43f5e' },
    { name: 'Gateway of India', color: '#ec4899' }
  ],
  photos: [
    { id: '1', tags: ['Dinner with Family', 'Paris'], displayName: 'Dinner Paris', dataUrl: 'data:img1' },
    { id: '2', tags: ['Dinner with Family', 'Paris', 'France'], displayName: 'Eiffel Dinner', dataUrl: 'data:img2' },
    { id: '3', tags: ['Dinner with Family'], displayName: 'Home Dinner', dataUrl: 'data:img3' },
    { id: '4', tags: ['Paris', 'France'], displayName: 'Paris City', dataUrl: 'data:img4' }
  ],
  moveCopyMultiTags: ['Dinner with Family'],
  moveCopySourceAlbum: 'Dinner with Family'
};

// 1. Tag A exclusion test
const selected = new Set(state.moveCopyMultiTags.map(t => t.toLowerCase()));
const candidates = state.tags.filter(t => !selected.has(t.name.toLowerCase()));
assert.strictEqual(candidates.length, 4);
assert(!candidates.some(c => c.name === 'Dinner with Family'));

// 2. Candidate counts
const validPhotos = state.photos.filter(p => !p.isPending && !p.deletedAt);
const counts = {};
candidates.forEach(c => {
  const combo = [...state.moveCopyMultiTags, c.name];
  const count = validPhotos.filter(p =>
    combo.every(vt => p.tags && p.tags.some(pt => pt.toLowerCase() === vt.toLowerCase()))
  ).length;
  counts[c.name] = count;
});

assert.strictEqual(counts['Paris'], 2, 'Paris must have 2 photos with Dinner with Family');
assert.strictEqual(counts['France'], 1, 'France must have 1 photo with Dinner with Family');
assert.strictEqual(counts['Champ de Mars'], 0, 'Champ de Mars must have 0 photos with Dinner with Family');

console.log('✓ Mock logic tests passed cleanly!');
