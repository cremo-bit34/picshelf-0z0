const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../web/i18n.js');
let content = fs.readFileSync(filePath, 'utf8');

const translations = {
  en: { edit: 'Edit Tags', albums: 'Albums & Tags' },
  hi: { edit: 'टैग संपादित करें', albums: 'एल्बम और टैग' },
  bn: { edit: 'ট্যাগ সম্পাদনা করুন', albums: 'অ্যালবাম ও ট্যাগ' },
  te: { edit: 'ట్యాగ్‌లను సవరించండి', albums: 'ఆల్బమ్‌లు & ట్యాగ్‌లు' },
  ta: { edit: 'டேக்குகளைத் திருத்து', albums: 'ஆல்பங்கள் & குறிச்சொற்கள்' },
  mr: { edit: 'टॅग संपादित करा', albums: 'अल्बम आणि टॅग्ज' },
  gu: { edit: 'ટૅગ્સ સંપાદિત કરો', albums: 'આલ્બમ્સ અને ટૅગ્સ' },
  kn: { edit: 'ಟ್ಯಾಗ್‌ಗಳನ್ನು ಎಡಿಟ್ ಮಾಡಿ', albums: 'ಆಲ್ಬಮ್‌ಗಳು ಮತ್ತು ಟ್ಯಾಗ್‌ಗಳು' },
  ml: { edit: 'ടാഗുകൾ എഡിറ്റ് ചെയ്യുക', albums: 'ആൽബങ്ങളും ടാഗുകളും' },
  pa: { edit: 'ਟੈਗ ਸੰਪਾਦਿਤ ਕਰੋ', albums: 'ਐਲਬਮਾਂ ਅਤੇ ਟੈਗ' }
};

for (const [lang, t] of Object.entries(translations)) {
  const langRegex = new RegExp(`(${lang}:\\s*\\{[\\s\\S]*?)(dock_tag_and_save:\\s*['"][^'"]*['"],)`);
  if (langRegex.test(content)) {
    content = content.replace(langRegex, `$1$2\n      detail_edit_tags: '${t.edit}',\n      detail_assigned_albums: '${t.albums}',`);
  } else {
    console.warn(`Could not match language ${lang}`);
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully injected detail_edit_tags and detail_assigned_albums into i18n.js');
