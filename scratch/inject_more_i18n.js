const fs = require('fs');

const moreKeys = {
  en: {
    albums_my_albums: 'My Albums',
    albums_tag_manager_tab: 'Tag Manager',
    albums_filter_all: 'All Albums',
    albums_filter_with_photos: 'With Photos',
    albums_filter_3d: '3D Cards',
    crop_title: 'Crop & Orient',
    crop_fine_rotation: 'Fine Rotation & Straighten',
    crop_free: 'Free',
    rename_modal_eyebrow: 'PHOTO DETAILS',
    rename_modal_desc: 'Give your moment a clean, descriptive title.',
    rename_modal_input_label: 'New Photo Title',
    rename_modal_placeholder: 'Enter descriptive title...',
    rename_modal_max_chars: 'Max 60 characters'
  },
  hi: {
    albums_my_albums: 'मेरे एल्बम',
    albums_tag_manager_tab: 'टैग प्रबंधक',
    albums_filter_all: 'सभी एल्बम',
    albums_filter_with_photos: 'तस्वीरों सहित',
    albums_filter_3d: '3D कार्ड',
    crop_title: 'क्रॉप एवं ओरिएंट',
    crop_fine_rotation: 'बारीक घुमाव और सीधा करें',
    crop_free: 'मुक्त',
    rename_modal_eyebrow: 'फ़ोटो विवरण',
    rename_modal_desc: 'अपने पल को एक साफ और वर्णनात्मक शीर्षक दें।',
    rename_modal_input_label: 'नया फ़ोटो शीर्षक',
    rename_modal_placeholder: 'वर्णनात्मक शीर्षक दर्ज करें...',
    rename_modal_max_chars: 'अधिकतम 60 अक्षर'
  },
  bn: {
    albums_my_albums: 'আমার অ্যালবাম',
    albums_tag_manager_tab: 'ট্যাগ ম্যানেজার',
    albums_filter_all: 'সব অ্যালবাম',
    albums_filter_with_photos: 'ছবিসহ',
    albums_filter_3d: '3D কার্ড',
    crop_title: 'ক্রপ ও ওরিয়েন্ট',
    crop_fine_rotation: 'সূক্ষ্ম ঘূর্ণন ও সোজা করুন',
    crop_free: 'মুক্ত',
    rename_modal_eyebrow: 'ছবির বিবরণ',
    rename_modal_desc: 'আপনার মুহূর্তকে একটি পরিষ্কার, বর্ণনামূলক শিরোনাম দিন।',
    rename_modal_input_label: 'নতুন ছবির শিরোনাম',
    rename_modal_placeholder: 'বর্ণনামূলক শিরোনাম লিখুন...',
    rename_modal_max_chars: 'সর্বোচ্চ ৬০টি অক্ষর'
  },
  te: {
    albums_my_albums: 'నా ఆల్బమ్‌లు',
    albums_tag_manager_tab: 'ట్యాగ్ మేనేజర్',
    albums_filter_all: 'అన్ని ఆల్బమ్‌లు',
    albums_filter_with_photos: 'ఫోటోలతో',
    albums_filter_3d: '3D కార్డ్‌లు',
    crop_title: 'క్రాప్ & ఓరియంట్',
    crop_fine_rotation: 'ఫైన్ రొటేషన్ & స్ట్రెయిటెన్',
    crop_free: 'ఉచితం',
    rename_modal_eyebrow: 'ఫోటో వివరాలు',
    rename_modal_desc: 'మీ క్షణానికి స్పష్టమైన, వివరణాత్మక శీర్షికను ఇవ్వండి.',
    rename_modal_input_label: 'కొత్త ఫోటో శీర్షిక',
    rename_modal_placeholder: 'వివరణాత్మక శీర్షికను నమోదు చేయండి...',
    rename_modal_max_chars: 'గరిష్టంగా 60 అక్షరాలు'
  },
  ta: {
    albums_my_albums: 'எனது ஆல்பங்கள்',
    albums_tag_manager_tab: 'குறிச்சொல் மேலாளர்',
    albums_filter_all: 'அனைத்து ஆல்பங்கள்',
    albums_filter_with_photos: 'புகைப்படங்களுடன்',
    albums_filter_3d: '3D கார்டுகள்',
    crop_title: 'கிராப் & நோக்குநிலை',
    crop_fine_rotation: 'நுண்ணிய சுழற்சி & நேராக்கு',
    crop_free: 'இலவச',
    rename_modal_eyebrow: 'புகைப்பட விவரங்கள்',
    rename_modal_desc: 'உங்கள் தருணத்திற்கு சுத்தமான, விளக்கமான தலைப்பைக் கொடுங்கள்.',
    rename_modal_input_label: 'புதிய புகைப்பட தலைப்பு',
    rename_modal_placeholder: 'விளக்கமான தலைப்பை உள்ளிடவும்...',
    rename_modal_max_chars: 'அதிகபட்சம் 60 எழுத்துக்கள்'
  },
  mr: {
    albums_my_albums: 'माझे अल्बम',
    albums_tag_manager_tab: 'टॅग व्यवस्थापक',
    albums_filter_all: 'सर्व अल्बम',
    albums_filter_with_photos: 'तस्वीरांसह',
    albums_filter_3d: '3D कार्डे',
    crop_title: 'क्रॉप आणि ओरिएंट',
    crop_fine_rotation: 'सूक्ष्म रोटेशन आणि सरळ करा',
    crop_free: 'मुक्त',
    rename_modal_eyebrow: 'फोटो तपशील',
    rename_modal_desc: 'तुमच्या क्षणाला एक स्वच्छ, वर्णनात्मक शीर्षक द्या.',
    rename_modal_input_label: 'नवीन फोटो शीर्षक',
    rename_modal_placeholder: 'वर्णनात्मक शीर्षक प्रविष्ट करा...',
    rename_modal_max_chars: 'कमाल 60 वर्ण'
  },
  gu: {
    albums_my_albums: 'મારા આલ્બમ્સ',
    albums_tag_manager_tab: 'ટેગ મેનેજર',
    albums_filter_all: 'બધા આલ્બમ્સ',
    albums_filter_with_photos: 'ફોટા સાથે',
    albums_filter_3d: '3D કાર્ડ્સ',
    crop_title: 'ક્રોપ અને ઓરિએન્ટ',
    crop_fine_rotation: 'ફાઇન રોટેશન અને સીધું કરો',
    crop_free: 'મુક્ત',
    rename_modal_eyebrow: 'ફોટો વિગતો',
    rename_modal_desc: 'તમારી ક્ષણને એક સ્વચ્છ, વર્ણનાત્મક શીર્ષક આપો.',
    rename_modal_input_label: 'નવું ફોટો શીર્ષક',
    rename_modal_placeholder: 'વર્ણનાત્મક શીર્ષક દાખલ કરો...',
    rename_modal_max_chars: 'મહત્તમ 60 અક્ષરો'
  },
  kn: {
    albums_my_albums: 'ನನ್ನ ಆಲ್ಬಮ್‌ಗಳು',
    albums_tag_manager_tab: 'ಟ್ಯಾಗ್ ಮ್ಯಾನೇಜರ್',
    albums_filter_all: 'ಎಲ್ಲಾ ಆಲ್ಬಮ್‌ಗಳು',
    albums_filter_with_photos: 'ಫೋಟೋಗಳೊಂದಿಗೆ',
    albums_filter_3d: '3D ಕಾರ್ಡ್‌ಗಳು',
    crop_title: 'ಕ್ರಾಪ್ & ಓರಿಯಂಟ್',
    crop_fine_rotation: 'ಫೈನ್ ರೊಟೇಶನ್ & ಸ್ಟ್ರೈಟ್ ಮಾಡಿ',
    crop_free: 'ಮುಕ್ತ',
    rename_modal_eyebrow: 'ಫೋಟೋ ವಿವರಗಳು',
    rename_modal_desc: 'ನಿಮ್ಮ ಕ್ಷಣಕ್ಕೆ ಸ್ವಚ್ಛವಾದ, ವಿವರಣಾತ್ಮಕ ಶೀರ್ಷಿಕೆಯನ್ನು ನೀಡಿ.',
    rename_modal_input_label: 'ಹೊಸ ಫೋಟೋ ಶೀರ್ಷಿಕೆ',
    rename_modal_placeholder: 'ವಿವರಣಾತ್ಮಕ ಶೀರ್ಷಿಕೆಯನ್ನು ನಮೂದಿಸಿ...',
    rename_modal_max_chars: 'ಗರಿಷ್ಠ 60 ಅಕ್ಷರಗಳು'
  },
  ml: {
    albums_my_albums: 'എന്റെ ആൽബങ്ങൾ',
    albums_tag_manager_tab: 'ടാഗ് മാനേജർ',
    albums_filter_all: 'എല്ലാ ആൽബങ്ങളും',
    albums_filter_with_photos: 'ഫോട്ടോകളോടെ',
    albums_filter_3d: '3D കാർഡുകൾ',
    crop_title: 'ക്രോപ്പും ഓറിയന്റും',
    crop_fine_rotation: 'ഫൈൻ റൊട്ടേഷനും നേരെയുമാക്കലും',
    crop_free: 'ഫ്രീ',
    rename_modal_eyebrow: 'ഫോട്ടോ വിശദാംശങ്ങൾ',
    rename_modal_desc: 'നിങ്ങളുടെ നിമിഷത്തിന് വ്യക്തവും വിവരണാത്മകവുമായ ഒരു പേര് നൽകുക.',
    rename_modal_input_label: 'പുതിയ ഫോട്ടോ തലക്കെട്ട്',
    rename_modal_placeholder: 'വിവരണാത്മക തലക്കെട്ട് നൽകുക...',
    rename_modal_max_chars: 'പരമാവധി 60 അക്ഷരങ്ങൾ'
  },
  pa: {
    albums_my_albums: 'ਮੇਰੇ ਐਲਬਮ',
    albums_tag_manager_tab: 'ਟੈਗ ਮੈਨੇਜਰ',
    albums_filter_all: 'ਸਾਰੇ ਐਲਬਮ',
    albums_filter_with_photos: 'ਫੋਟੋਆਂ ਸਮੇਤ',
    albums_filter_3d: '3D ਕਾਰਡ',
    crop_title: 'ਕ੍ਰੌਪ ਅਤੇ ਓਰੀਐਂਟ',
    crop_fine_rotation: 'ਵਧੀਆ ਘੁਮਾਓ ਅਤੇ ਸਿੱਧਾ ਕਰੋ',
    crop_free: 'ਮੁਕਤ',
    rename_modal_eyebrow: 'ਫੋਟੋ ਵੇਰਵੇ',
    rename_modal_desc: 'ਆਪਣੇ ਪਲ ਨੂੰ ਇੱਕ ਸਪਸ਼ਟ, ਵਰਣਨਯੋਗ ਸਿਰਲੇਖ ਦਿਓ।',
    rename_modal_input_label: 'ਨਵਾਂ ਫੋਟੋ ਸਿਰਲੇਖ',
    rename_modal_placeholder: 'ਵਰਣਨਯੋਗ ਸਿਰਲੇਖ ਦਰਜ ਕਰੋ...',
    rename_modal_max_chars: 'ਵੱਧ ਤੋਂ ਵੱਧ 60 ਅੱਖਰ'
  }
};

let content = fs.readFileSync('web/i18n.js', 'utf8');

for (const [lang, keys] of Object.entries(moreKeys)) {
  const target = `${lang}: {`;
  const idx = content.indexOf(target);
  if (idx === -1) {
    console.error(`Target not found for ${lang}`);
    process.exit(1);
  }
  
  let formatted = '';
  for (const [k, v] of Object.entries(keys)) {
    // If key already exists in that language block, don't duplicate
    const keyRegex = new RegExp(`\\b${k}\\s*:`);
    // Find next closing brace
    const endIdx = content.indexOf('    },', idx);
    const slice = content.slice(idx, endIdx);
    if (!keyRegex.test(slice)) {
      formatted += `\n      ${k}: ${JSON.stringify(v)},`;
    }
  }
  
  if (formatted) {
    content = content.slice(0, idx + target.length) + formatted + content.slice(idx + target.length);
  }
}

fs.writeFileSync('web/i18n.js', content, 'utf8');
console.log('Successfully injected additional crop, rename, and album keys across all 10 languages!');
