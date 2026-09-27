const fs = require('fs');
const path = require('path');

const i18nPath = path.join(__dirname, '..', 'web', 'i18n.js');
let content = fs.readFileSync(i18nPath, 'utf8');

const newKeys = {
  en: {
    settings_load_gps_sample: 'Load Sample GPS Photos',
    settings_load_gps_sample_desc: 'Add 3 sample photos with Mumbai, Paris & New York GPS tags',
    dock_sample_gps: 'Sample GPS',
    location_no_gps_hint: 'No GPS metadata in this photo'
  },
  hi: {
    settings_load_gps_sample: 'सैंपल GPS फ़ोटो लोड करें',
    settings_load_gps_sample_desc: 'मुंबई, पेरिस और न्यूयॉर्क GPS टैग्स वाली 3 फ़ोटो जोड़ें',
    dock_sample_gps: 'सैंपल GPS',
    location_no_gps_hint: 'इस फ़ोटो में कोई GPS मेटाडेटा नहीं है'
  },
  bn: {
    settings_load_gps_sample: 'নমুনা GPS ছবি লোড করুন',
    settings_load_gps_sample_desc: 'মুম্বাই, প্যারিস ও নিউ ইয়র্কের GPS ট্যাগযুক্ত ৩টি ছবি যোগ করুন',
    dock_sample_gps: 'নমুনা GPS',
    location_no_gps_hint: 'এই ছবিতে কোনো GPS মেটাডেটা নেই'
  },
  te: {
    settings_load_gps_sample: 'నమూనా GPS ఫోటోలను లోడ్ చేయండి',
    settings_load_gps_sample_desc: 'ముంబై, పారిస్, న్యూయార్క్ GPS ట్యాగ్‌లతో 3 ఫోటోలను జోడించండి',
    dock_sample_gps: 'నమూనా GPS',
    location_no_gps_hint: 'ఈ ఫోటోలో GPS మెటాడేటా లేదు'
  },
  ta: {
    settings_load_gps_sample: 'மாதிரி GPS புகைப்படங்களை ஏற்றவும்',
    settings_load_gps_sample_desc: 'மும்பை, பாரிஸ் மற்றும் நியூயார்க் GPS குறிச்சொற்களுடன் 3 புகைப்படங்களைச் சேர்க்கவும்',
    dock_sample_gps: 'மாதிரி GPS',
    location_no_gps_hint: 'இந்தப் படத்தில் GPS மெட்டாடேட்டா இல்லை'
  },
  mr: {
    settings_load_gps_sample: 'सॅम्पल GPS फोटो लोड करा',
    settings_load_gps_sample_desc: 'मुंबई, पॅरिस आणि न्यूयॉर्क GPS टॅग असलेले ३ फोटो जोडा',
    dock_sample_gps: 'सॅम्पल GPS',
    location_no_gps_hint: 'या फोटोमध्ये GPS मेटाडेटा नाही'
  },
  gu: {
    settings_load_gps_sample: 'નમૂના GPS ફોટા લોડ કરો',
    settings_load_gps_sample_desc: 'મુંબઈ, પેરિસ અને ન્યુ યોર્ક GPS ટૅગ્સવાળા 3 ફોટા ઉમેરો',
    dock_sample_gps: 'નમૂના GPS',
    location_no_gps_hint: 'આ ફોટામાં કોઈ GPS મેટાડેટા નથી'
  },
  kn: {
    settings_load_gps_sample: 'ಮಾದರಿ GPS ಫೋಟೋಗಳನ್ನು ಲೋಡ್ ಮಾಡಿ',
    settings_load_gps_sample_desc: 'ಮುಂಬೈ, ಪ್ಯಾರಿಸ್ ಮತ್ತು ನ್ಯೂಯಾರ್ಕ್ GPS ಟ್ಯಾಗ್‌ಗಳೊಂದಿಗೆ 3 ಫೋಟೋಗಳನ್ನು ಸೇರಿಸಿ',
    dock_sample_gps: 'ಮಾದರಿ GPS',
    location_no_gps_hint: 'ಈ ಫೋಟೋದಲ್ಲಿ GPS ಮೆಟಾಡೇಟಾ ಇಲ್ಲ'
  },
  ml: {
    settings_load_gps_sample: 'സാമ്പിൾ GPS ഫോട്ടോകൾ ലോഡ് ചെയ്യുക',
    settings_load_gps_sample_desc: 'മുംബൈ, പാരീസ്, ന്യൂയോർക്ക് GPS ടാഗുകളുള്ള 3 ഫോട്ടോകൾ ചേർക്കുക',
    dock_sample_gps: 'സാമ്പിൾ GPS',
    location_no_gps_hint: 'ഈ ഫോട്ടോയിൽ GPS മെറ്റാഡാറ്റ ലഭ്യമല്ല'
  },
  pa: {
    settings_load_gps_sample: 'ਨਮੂਨਾ GPS ਫ਼ੋਟੋਆਂ ਲੋਡ ਕਰੋ',
    settings_load_gps_sample_desc: 'ਮੁੰਬਈ, ਪੈਰਿਸ ਅਤੇ ਨਿਊਯਾਰਕ GPS ਟੈਗਾਂ ਵਾਲੀਆਂ 3 ਫ਼ੋਟੋਆਂ ਸ਼ਾਮਲ ਕਰੋ',
    dock_sample_gps: 'ਨਮੂਨਾ GPS',
    location_no_gps_hint: 'ਇਸ ਫ਼ੋਟੋ ਵਿੱਚ ਕੋਈ GPS ਮੈਟਾਡੇਟਾ ਨਹੀਂ ਹੈ'
  }
};

for (const [lang, dict] of Object.entries(newKeys)) {
  const targetPattern = new RegExp(`(\\b${lang}:\\s*\\{[\\s\\S]*?)(location_suggestions_title:\\s*['"][^'"]+['"],?)`, 'm');
  const match = content.match(targetPattern);
  if (match) {
    let injection = `${match[2]}\n`;
    for (const [k, v] of Object.entries(dict)) {
      const escaped = v.replace(/'/g, "\\'");
      injection += `    ${k}: '${escaped}',\n`;
    }
    content = content.replace(targetPattern, `$1${injection}`);
    console.log(`Injected keys for language: ${lang}`);
  } else {
    console.warn(`Could not find anchor for language: ${lang}`);
  }
}

fs.writeFileSync(i18nPath, content, 'utf8');
console.log('Successfully injected batch location i18n keys!');
