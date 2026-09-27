const fs = require('fs');

const i18nPath = 'web/i18n.js';
let content = fs.readFileSync(i18nPath, 'utf8');

const backTranslations = {
  en: {
    album_back_to_albums: 'Back to Albums',
    album_back_btn: 'Albums',
    album_banner_add_photos: 'Add Photos',
    album_viewing_toast: "Viewing '{name}' album",
    favorites_viewing_toast: 'Viewing Favorites album'
  },
  hi: {
    album_back_to_albums: 'एल्बम पर वापस',
    album_back_btn: 'एल्बम',
    album_banner_add_photos: 'फ़ोटो जोड़ें',
    album_viewing_toast: "'{name}' एल्बम देख रहे हैं",
    favorites_viewing_toast: 'पसंदीदा एल्बम देख रहे हैं'
  },
  bn: {
    album_back_to_albums: 'অ্যালবামে ফিরুন',
    album_back_btn: 'অ্যালবাম',
    album_banner_add_photos: 'ছবি যোগ করুন',
    album_viewing_toast: "'{name}' অ্যালবাম দেখছেন",
    favorites_viewing_toast: 'পছন্দের অ্যালবাম দেখছেন'
  },
  te: {
    album_back_to_albums: 'ఆల్బమ్‌లకు తిరిగి వెళ్ళు',
    album_back_btn: 'ఆల్బమ్‌లు',
    album_banner_add_photos: 'ఫోటోలను జోడించండి',
    album_viewing_toast: "'{name}' ఆల్బమ్ చూస్తున్నారు",
    favorites_viewing_toast: 'ఇష్టమైన ఆల్బమ్ చూస్తున్నారు'
  },
  ta: {
    album_back_to_albums: 'ஆல்பங்களுக்குத் திரும்பு',
    album_back_btn: 'ஆல்பங்கள்',
    album_banner_add_photos: 'புகைப்படங்களைச் சேர்',
    album_viewing_toast: "'{name}' ஆல்பத்தைப் பார்க்கிறீர்கள்",
    favorites_viewing_toast: 'விருப்பமானவை ஆல்பத்தைப் பார்க்கிறீர்கள்'
  },
  mr: {
    album_back_to_albums: 'अल्बमवर परत',
    album_back_btn: 'अल्बम',
    album_banner_add_photos: 'फोटो जोडा',
    album_viewing_toast: "'{name}' अल्बम पाहत आहात",
    favorites_viewing_toast: 'आवडते अल्बम पाहत आहात'
  },
  gu: {
    album_back_to_albums: 'આલ્બમ્સ પર પાછા જાઓ',
    album_back_btn: 'આલ્બમ્સ',
    album_banner_add_photos: 'ફોટા ઉમેરો',
    album_viewing_toast: "'{name}' આલ્બમ જોઈ રહ્યા છો",
    favorites_viewing_toast: 'મનપસંદ આલ્બમ જોઈ રહ્યા છો'
  },
  kn: {
    album_back_to_albums: 'ಆಲ್ಬಮ್‌ಗಳಿಗೆ ಹಿಂತಿರುಗಿ',
    album_back_btn: 'ಆಲ್ಬಮ್‌ಗಳು',
    album_banner_add_photos: 'ಫೋಟೋಗಳನ್ನು ಸೇರಿಸಿ',
    album_viewing_toast: "'{name}' ಆಲ್ಬಮ್ ನೋಡುತ್ತಿದ್ದೀರಿ",
    favorites_viewing_toast: 'ಮೆಚ್ಚಿನ ಆಲ್ಬಮ್ ನೋಡುತ್ತಿದ್ದೀರಿ'
  },
  ml: {
    album_back_to_albums: 'ആൽബങ്ങളിലേക്ക് മടങ്ങുക',
    album_back_btn: 'ആൽബങ്ങൾ',
    album_banner_add_photos: 'ഫോട്ടോകൾ ചേർക്കുക',
    album_viewing_toast: "'{name}' ആൽബം കാണുന്നു",
    favorites_viewing_toast: 'പ്രിയപ്പെട്ടവ ആൽബം കാണുന്നു'
  },
  pa: {
    album_back_to_albums: 'ਐਲਬਮਾਂ ਤੇ ਵਾਪਸ ਜਾਓ',
    album_back_btn: 'ਐਲਬਮਾਂ',
    album_banner_add_photos: 'ਫ਼ੋਟੋਆਂ ਸ਼ਾਮਲ ਕਰੋ',
    album_viewing_toast: "'{name}' ਐਲਬਮ ਦੇਖ ਰਹੇ ਹੋ",
    favorites_viewing_toast: 'ਪਸੰਦੀਦਾ ਐਲਬਮ ਦੇਖ ਰਹੇ ਹੋ'
  }
};

for (const [lang, dict] of Object.entries(backTranslations)) {
  const entriesStr = Object.entries(dict)
    .map(([k, v]) => `      ${k}: ${JSON.stringify(v)},`)
    .join('\n');

  const langHeader = new RegExp(`(${lang}:\\s*\\{[\\s\\S]*?albums_delete_confirm_btn:\\s*['"][^'"]*['"],)`);
  if (!langHeader.test(content)) {
    console.error(`Could not match albums_delete_confirm_btn for lang: ${lang}`);
    process.exit(1);
  }
  content = content.replace(langHeader, `$1\n${entriesStr}`);
}

fs.writeFileSync(i18nPath, content, 'utf8');
console.log('Successfully injected album back keys into web/i18n.js!');
