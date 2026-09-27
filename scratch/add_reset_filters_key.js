const fs = require('fs');
const path = require('path');

const i18nPath = path.join(__dirname, '..', 'web', 'i18n.js');
let content = fs.readFileSync(i18nPath, 'utf8');

const translations = {
  en: "      gallery_reset_filters: 'Reset All Filters',",
  hi: "      gallery_reset_filters: 'सभी फ़िल्टर रीसेट करें',",
  bn: "      gallery_reset_filters: 'সব ফিল্টার রিসেট করুন',",
  te: "      gallery_reset_filters: 'అన్ని ఫిల్టర్‌లను రీసెట్ చేయండి',",
  ta: "      gallery_reset_filters: 'அனைத்து வடிப்பான்களையும் மீட்டமை',",
  mr: "      gallery_reset_filters: 'सर्व फिल्टर्स रीसेट करा',",
  gu: "      gallery_reset_filters: 'બધા ફિલ્ટર્સ રીસેટ કરો',",
  kn: "      gallery_reset_filters: 'ಎಲ್ಲಾ ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಮರುಹೊಂದಿಸಿ',",
  ml: "      gallery_reset_filters: 'എല്ലാ ഫിൽട്ടറുകളും പുനഃക്രമീകരിക്കുക',",
  pa: "      gallery_reset_filters: 'ਸਾਰੇ ਫਿਲਟਰ ਰੀਸੈਟ ਕਰੋ',"
};

for (const [lang, lineToAdd] of Object.entries(translations)) {
  // Find gallery_empty_desc: '...' in each language section
  const regex = new RegExp(`(${lang}:\\s*\\{[\\s\\S]*?gallery_empty_desc:\\s*['"][\\s\\S]*?['"],)(\\r?\\n)`, 'm');
  const match = content.match(regex);
  if (match) {
    content = content.replace(match[0], match[1] + match[2] + lineToAdd + match[2]);
    console.log(`Added gallery_reset_filters for ${lang}`);
  } else {
    console.error(`Could not find gallery_empty_desc for ${lang}`);
  }
}

fs.writeFileSync(i18nPath, content, 'utf8');
console.log('Successfully updated web/i18n.js with gallery_reset_filters');
