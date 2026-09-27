const fs = require('fs');
const path = require('path');

const i18nPath = path.join(__dirname, '../web/i18n.js');
let content = fs.readFileSync(i18nPath, 'utf8');

const TAG_TRANSLATIONS = {
  en: {
    tag_input_placeholder: 'Create tag (e.g. Birthday)...',
    tag_btn_add: 'Add',
    create_album_import_vip: 'Create & Import Photos (VIP)'
  },
  hi: {
    tag_input_placeholder: 'टैग बनाएं (उदा. जन्मदिन)...',
    tag_btn_add: 'जोड़ें',
    create_album_import_vip: 'बनाएं एवं फ़ोटो आयात करें (VIP)'
  },
  bn: {
    tag_input_placeholder: 'ট্যাগ তৈরি করুন (যেমন জন্মদিন)...',
    tag_btn_add: 'যুক্ত করুন',
    create_album_import_vip: 'তৈরি ও ছবি ইম্পোর্ট করুন (VIP)'
  },
  te: {
    tag_input_placeholder: 'ట్యాగ్ సృష్టించండి (ఉదా. పుట్టినరోజు)...',
    tag_btn_add: 'జోడించు',
    create_album_import_vip: 'సృష్టించి ఫోటోలు దిగుమతి చేయండి (VIP)'
  },
  ta: {
    tag_input_placeholder: 'டேக் உருவாக்குக (எ.கா. பிறந்தநாள்)...',
    tag_btn_add: 'சேர்',
    create_album_import_vip: 'உருவாக்கி படங்கள் சேர்க்க (VIP)'
  },
  mr: {
    tag_input_placeholder: 'टॅग तयार करा (उदा. वाढदिवस)...',
    tag_btn_add: 'जोडा',
    create_album_import_vip: 'तयार करा व फोटो आयात करा (VIP)'
  },
  gu: {
    tag_input_placeholder: 'ટેગ બનાવો (દા.ત. જન્મદિવસ)...',
    tag_btn_add: 'ઉમેરો',
    create_album_import_vip: 'બનાવો અને ફોટા આયાત કરો (VIP)'
  },
  kn: {
    tag_input_placeholder: 'ಟ್ಯಾಗ್ ರಚಿಸಿ (ಉದಾ. ಜನ್ಮದಿನ)...',
    tag_btn_add: 'ಸೇರಿಸಿ',
    create_album_import_vip: 'ರಚಿಸಿ ಫೋಟೋಗಳನ್ನು ಆಮದು ಮಾಡಿ (VIP)'
  },
  ml: {
    tag_input_placeholder: 'ടാഗ് ഉണ്ടാക്കുക (ഉദാ: ജന്മദിനം)...',
    tag_btn_add: 'ചേർക്കുക',
    create_album_import_vip: 'ഉണ്ടാക്കി ഫോട്ടോ ചേർക്കുക (VIP)'
  },
  pa: {
    tag_input_placeholder: 'ਟੈਗ ਬਣਾਓ (ਜਿਵੇਂ ਜਨਮਦਿਨ)...',
    tag_btn_add: 'ਜੋੜੋ',
    create_album_import_vip: 'ਬਣਾਓ ਅਤੇ ਫੋਟੋਆਂ ਇੰਪੋਰਟ ਕਰੋ (VIP)'
  }
};

for (const [lang, dict] of Object.entries(TAG_TRANSLATIONS)) {
  for (const [key, val] of Object.entries(dict)) {
    // If key already exists in this lang section, update it
    const escapedVal = val.replace(/'/g, "\\'");
    // Check if key exists in this lang
    const langHeaderRegex = new RegExp(`${lang}:\\s*\\{([^\\}]+(?:\\}[^\\}]+)*)\\}`, 's');
    // More targeted: find `create_album_import_vip: '...'` or inject after tags_create_btn
    const keyRegex = new RegExp(`(\\b${key}:\\s*)'[^']*'`);
    
    // We can replace create_album_import_vip directly
    if (key === 'create_album_import_vip') {
      const match = content.match(new RegExp(`(${lang}:\\s*\\{[\\s\\S]*?${key}:\\s*)'[^']*'`));
      if (match) {
        content = content.replace(
          new RegExp(`(${lang}:\\s*\\{[\\s\\S]*?${key}:\\s*)'[^']*'`),
          `$1'${escapedVal}'`
        );
      }
    } else {
      // Inject after tags_create_btn: "..." or '...'
      const targetPattern = new RegExp(`(${lang}:\\s*\\{[\\s\\S]*?tags_create_btn:\\s*["'][^"']*["'],)(?!\\s*${key})`);
      if (targetPattern.test(content)) {
        content = content.replace(targetPattern, `$1\n      ${key}: '${escapedVal}',`);
      }
    }
  }
}

fs.writeFileSync(i18nPath, content, 'utf8');
console.log('✅ Injected tag keys into web/i18n.js');
