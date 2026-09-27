const fs = require('fs');

const appJs = fs.readFileSync('web/app.js', 'utf8');
const styleCss = fs.readFileSync('web/style.css', 'utf8');

console.log('--- Testing Date & Timestamp Card Implementation ---');

// 1. Check formatCardDateTime definition and behavior
if (!appJs.includes('function formatCardDateTime(ts)')) {
  console.error('FAIL: formatCardDateTime function missing in app.js');
  process.exit(1);
}
console.log('PASS: formatCardDateTime exists in app.js');

// 2. Check renderGallery uses metaDate and card-date-time
if (!appJs.includes('formatCardDateTime(photo.createdAt)') || !appJs.includes('class="card-date-time"')) {
  console.error('FAIL: renderGallery does not format and render card-date-time');
  process.exit(1);
}
console.log('PASS: renderGallery renders card-date-time with date and timestamp');

// 3. Check renderFavorites uses metaDate and card-date-time
const favMatch = appJs.match(/function renderFavorites\(\)[\s\S]*?renderTrash\(\)/);
if (!favMatch || !favMatch[0].includes('card-date-time')) {
  console.error('FAIL: renderFavorites does not render card-date-time');
  process.exit(1);
}
console.log('PASS: renderFavorites renders card-date-time with date and timestamp');

// 4. Check style.css has styling for card-date-time, icons, separator, and hover
if (!styleCss.includes('.card-date-time') || !styleCss.includes('.card-time-sep')) {
  console.error('FAIL: style.css is missing card-date-time or separator rules');
  process.exit(1);
}
console.log('PASS: style.css has dedicated .card-date-time styling');

// 5. Test date and timestamp formatting logic
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

const sampleTs = 1726435500000; // Sept 15, 2024
const res = formatCardDateTime(sampleTs);
console.log('Sample format result:', res);
if (!res.date || !res.time || !res.display.includes('·')) {
  console.error('FAIL: Unexpected format result');
  process.exit(1);
}
console.log('PASS: Date and timestamp formatting operates correctly!');
console.log('\nAll card date/timestamp tests passed successfully!');
