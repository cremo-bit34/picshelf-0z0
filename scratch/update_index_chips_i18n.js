const fs = require('fs');

let html = fs.readFileSync('web/index.html', 'utf8');

const chips = [
  'amethyst', 'sapphire', 'ruby', 'quantum', 'damascus', 'cyberpunk',
  'platina', 'volcanic', 'supernova', 'aquamarine', 'copper', 'chameleon',
  'celestial', 'onyx', 'sunset', 'prism_noir', 'biolum', 'hyperdrive',
  'meteorite', 'vaporwave'
];

chips.forEach(key => {
  // Regex to find the chip by data-style="key"
  const regex = new RegExp(`(<div class="surface-style-chip" data-style="${key}"[\\s\\S]*?<span class="style-title">)([^<]+)(</span>\\s*<span class="style-sub">)([^<]+)(</span>)`);
  if (regex.test(html)) {
    html = html.replace(regex, `$1<span data-i18n="mat_${key}_title">$2</span>$3<span data-i18n="mat_${key}_sub">$4</span>$5`);
    console.log(`Updated chip in HTML: ${key}`);
  } else {
    // If <span class="style-title" without nested span:
    const simpleRegex = new RegExp(`(<div class="surface-style-chip" data-style="${key}"[\\s\\S]*?<div class="style-chip-text">\\s*)<span class="style-title">([^<]+)</span>\\s*<span class="style-sub">([^<]+)</span>`);
    if (simpleRegex.test(html)) {
      html = html.replace(simpleRegex, `$1<span class="style-title" data-i18n="mat_${key}_title">$2</span>\n                    <span class="style-sub" data-i18n="mat_${key}_sub">$3</span>`);
      console.log(`Updated simple chip in HTML: ${key}`);
    } else {
      console.error(`Could not match chip: ${key}`);
    }
  }
});

// Update favorites 3D studio button span
html = html.replace(
  '<i class="fa-solid fa-wand-magic-sparkles" style="color: #c084fc;"></i> <span>3D Studio</span>',
  '<i class="fa-solid fa-wand-magic-sparkles" style="color: #c084fc;"></i> <span data-i18n="surface_3d_btn">3D Studio</span>'
);

fs.writeFileSync('web/index.html', html, 'utf8');
console.log('web/index.html updated successfully with data-i18n attributes!');
