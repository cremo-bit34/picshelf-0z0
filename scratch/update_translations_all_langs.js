const fs = require('fs');

let code = fs.readFileSync('web/i18n.js', 'utf8');

// 1. Remove all occurrences of " (LANGUAGE)"
code = code.replace(/ \(LANGUAGE\)/g, '');

// Extra dictionary keys for each language
const extraKeys = {
  en: {
    gallery_download_zip: 'Download ZIP',
    settings_storage_used: '{used} MB of {total} GB',
    settings_storage_pro_active: 'Aura VIP Membership Active · Cloud & Secret Vault Unlocked',
    settings_pro_activated: 'Aura Pro VIP Activated',
    albums_category_count: 'Category Albums',
    albums_gallery_count: 'Photos in Gallery',
    albums_empty_tag: 'No photos yet',
    albums_favorite_album: 'Favorite Album',
    albums_personal_surface: 'Personal Surface',
    gallery_all_tags: 'All Tags ({count})',
    trash_days_left: '{days}d left',
    trash_restore_btn: 'Restore',
    trash_erase_btn: 'Erase',
    tags_all_count: 'All Tags ({count})',
    tags_photo_count: '{count} photos tagged'
  },
  hi: {
    gallery_download_zip: 'ज़िप डाउनलोड करें',
    settings_storage_used: '{total} GB में से {used} MB प्रयुक्त',
    settings_storage_pro_active: 'ऑरा वीआईपी सदस्यता सक्रिय · क्लाउड और गुप्त वॉल्ट अनलॉक',
    settings_pro_activated: 'ऑरा प्रो वीआईपी सक्रिय',
    albums_category_count: 'श्रेणी एल्बम',
    albums_gallery_count: 'गैलरी में तस्वीरें',
    albums_empty_tag: 'अभी कोई तस्वीर नहीं',
    albums_favorite_album: 'पसंदीदा एल्बम',
    albums_personal_surface: 'व्यक्तिगत सतह',
    gallery_all_tags: 'सभी टैग ({count})',
    trash_days_left: '{days} दिन शेष',
    trash_restore_btn: 'पुनर्स्थापित करें',
    trash_erase_btn: 'मिटाएं',
    tags_all_count: 'सभी टैग ({count})',
    tags_photo_count: '{count} तस्वीरें टैग की गईं'
  },
  bn: {
    gallery_download_zip: 'জিপ ডাউনলোড',
    settings_storage_used: '{total} GB-এর মধ্যে {used} MB ব্যবহৃত',
    settings_storage_pro_active: 'অরা ভিআইপি সদস্যপদ সক্রিয় · ক্লাউড ও সিক্রেট ভল্ট আনলকড',
    settings_pro_activated: 'অরা প্রো ভিআইপি সক্রিয়',
    albums_category_count: 'ক্যাটাগরি অ্যালবাম',
    albums_gallery_count: 'গ্যালারিতে ছবি',
    albums_empty_tag: 'এখনো কোনো ছবি নেই',
    albums_favorite_album: 'প্রিয় অ্যালবাম',
    albums_personal_surface: 'ব্যক্তিগত সারফেস',
    gallery_all_tags: 'সব ট্যাগ ({count})',
    trash_days_left: '{days} দিন বাকি',
    trash_restore_btn: 'পুনরুদ্ধার',
    trash_erase_btn: 'মুছে ফেলুন',
    tags_all_count: 'সব ট্যাগ ({count})',
    tags_photo_count: '{count}টি ছবি ট্যাগ করা হয়েছে'
  },
  te: {
    gallery_download_zip: 'జిప్ డౌన్‌లోడ్',
    settings_storage_used: '{total} GB లో {used} MB ఉపయోగించబడింది',
    settings_storage_pro_active: 'ఆరా వీఐపీ సభ్యత్వం సక్రియంగా ఉంది · క్లౌడ్ & రహస్య వాల్ట్ అన్‌లాక్ చేయబడింది',
    settings_pro_activated: 'ఆరా ప్రో వీఐపీ యాక్టివేట్ చేయబడింది',
    albums_category_count: 'వర్గం ఆల్బమ్‌లు',
    albums_gallery_count: 'గ్యాలరీలో ఫోటోలు',
    albums_empty_tag: 'ఇంకా ఫోటోలు లేవు',
    albums_favorite_album: 'ఇష్టమైన ఆల్బమ్',
    albums_personal_surface: 'వ్యక్తిగత ఉపరితలం',
    gallery_all_tags: 'అన్ని ట్యాగ్‌లు ({count})',
    trash_days_left: '{days} రోజులు మిగిలి ఉన్నాయి',
    trash_restore_btn: 'పునరుద్ధరించు',
    trash_erase_btn: 'శాశ్వతంగా తొలగించు',
    tags_all_count: 'అన్ని ట్యాగ్‌లు ({count})',
    tags_photo_count: '{count} ఫోటోలు ట్యాగ్ చేయబడ్డాయి'
  },
  ta: {
    gallery_download_zip: 'ஜிப் பதிவிறக்கு',
    settings_storage_used: '{total} GB இல் {used} MB பயன்படுத்தப்பட்டது',
    settings_storage_pro_active: 'ஆரா விஐபி உறுப்பினர் செயலில் உள்ளது · கிளவுட் & ரகசிய பெட்டகம் திறக்கப்பட்டது',
    settings_pro_activated: 'ஆரா ப்ரோ விஐபி செயல்படுத்தப்பட்டது',
    albums_category_count: 'பிரிவு ஆல்பங்கள்',
    albums_gallery_count: 'கேலரியில் புகைப்படங்கள்',
    albums_empty_tag: 'இன்னும் புகைப்படங்கள் இல்லை',
    albums_favorite_album: 'விருப்பமான ஆல்பம்',
    albums_personal_surface: 'தனிப்பயன் மேற்பரப்பு',
    gallery_all_tags: 'அனைத்து குறிச்சொற்கள் ({count})',
    trash_days_left: '{days} நாட்கள் மீதமுள்ளன',
    trash_restore_btn: 'மீட்டமை',
    trash_erase_btn: 'அழி',
    tags_all_count: 'அனைத்து குறிச்சொற்கள் ({count})',
    tags_photo_count: '{count} புகைப்படங்கள் குறிக்கப்பட்டன'
  },
  mr: {
    gallery_download_zip: 'झिप डाउनलोड करा',
    settings_storage_used: '{total} GB पैकी {used} MB वापरले',
    settings_storage_pro_active: 'ऑरा व्हीआयपी सदस्यत्व सक्रिय · क्लाउड आणि सिक्रेट व्हॉल्ट अनलॉक',
    settings_pro_activated: 'ऑरा प्रो व्हीआयपी सक्रिय',
    albums_category_count: 'श्रेणी अल्बम',
    albums_gallery_count: 'गॅलरीत फोटो',
    albums_empty_tag: 'अद्याप कोणतेही फोटो नाहीत',
    albums_favorite_album: 'आवडते अल्बम',
    albums_personal_surface: 'वैयक्तिक पृष्ठभाग',
    gallery_all_tags: 'सर्व टॅग्ज ({count})',
    trash_days_left: '{days} दिवस बाकी',
    trash_restore_btn: 'पुनर्संचयित करा',
    trash_erase_btn: 'नष्ट करा',
    tags_all_count: 'सर्व टॅग्ज ({count})',
    tags_photo_count: '{count} फोटो टॅग केले'
  },
  gu: {
    gallery_download_zip: 'ઝિપ ડાઉનલોડ કરો',
    settings_storage_used: '{total} GB માંથી {used} MB વપરાયેલ',
    settings_storage_pro_active: 'ઓરા વીઆઈપી સભ્યપદ સક્રિય · ક્લાઉડ અને સિક્રેટ વૉલ્ટ અનલૉક',
    settings_pro_activated: 'ઓરા પ્રો વીઆઈપી સક્રિય',
    albums_category_count: 'શ્રેણી આલ્બમ્સ',
    albums_gallery_count: 'ગેલેરીમાં ફોટા',
    albums_empty_tag: 'હજી સુધી કોઈ ફોટા નથી',
    albums_favorite_album: 'મનપસંદ આલ્બમ',
    albums_personal_surface: 'વ્યક્તિગત સપાટી',
    gallery_all_tags: 'બધા ટૅગ્સ ({count})',
    trash_days_left: '{days} દિવસ બાકી',
    trash_restore_btn: 'પુનઃસ્થાપિત કરો',
    trash_erase_btn: 'ભૂંસી નાખો',
    tags_all_count: 'બધા ટૅગ્સ ({count})',
    tags_photo_count: '{count} ફોટા ટૅગ કર્યા'
  },
  kn: {
    gallery_download_zip: 'ಜಿಪ್ ಡೌನ್‌ಲೋಡ್',
    settings_storage_used: '{total} GB ಯಲ್ಲಿ {used} MB ಬಳಸಲಾಗಿದೆ',
    settings_storage_pro_active: 'ಆರಾ ವಿಐಪಿ ಸದಸ್ಯತ್ವ ಸಕ್ರಿಯವಾಗಿದೆ · ಕ್ಲೌಡ್ ಮತ್ತು ಸೀಕ್ರೆಟ್ ವಾಲ್ಟ್ ಅನ್‌ಲಾಕ್ ಆಗಿದೆ',
    settings_pro_activated: 'ಆರಾ ಪ್ರೊ ವಿಐಪಿ ಸಕ್ರಿಯವಾಗಿದೆ',
    albums_category_count: 'ವರ್ಗ ಆಲ್ಬಮ್‌ಗಳು',
    albums_gallery_count: 'ಗ್ಯಾಲರಿಯಲ್ಲಿ ಫೋಟೋಗಳು',
    albums_empty_tag: 'ಇನ್ನೂ ಫೋಟೋಗಳಿಲ್ಲ',
    albums_favorite_album: 'ಮೆಚ್ಚಿನ ಆಲ್ಬಮ್',
    albums_personal_surface: 'ವೈಯಕ್ತಿಕ ಮೇಲ್ಮೈ',
    gallery_all_tags: 'ಎಲ್ಲಾ ಟ್ಯಾಗ್‌ಗಳು ({count})',
    trash_days_left: '{days} ದಿನಗಳು ಬಾಕಿ',
    trash_restore_btn: 'ಮರುಸ್ಥಾಪಿಸಿ',
    trash_erase_btn: 'ಅಳಿಸಿಹಾಕಿ',
    tags_all_count: 'ಎಲ್ಲಾ ಟ್ಯಾಗ್‌ಗಳು ({count})',
    tags_photo_count: '{count} ಫೋಟೋಗಳನ್ನು ಟ್ಯಾಗ್ ಮಾಡಲಾಗಿದೆ'
  },
  ml: {
    gallery_download_zip: 'സിപ്പ് ഡൗൺലോഡ്',
    settings_storage_used: '{total} GB-ൽ {used} MB ഉപയോഗിച്ചു',
    settings_storage_pro_active: 'ഓറ വിഐപി അംഗത്വം സജീവം · ക്ലൗഡ് & രഹസ്യ വോൾട്ട് അൺലോക്ക് ചെയ്‌തു',
    settings_pro_activated: 'ഓറ പ്രോ വിഐപി സജീവമാക്കി',
    albums_category_count: 'വിഭാഗം ആൽബങ്ങൾ',
    albums_gallery_count: 'ഗാലറിയിലെ ഫോട്ടോകൾ',
    albums_empty_tag: 'ഫോട്ടോകൾ ഇതുവരെയില്ല',
    albums_favorite_album: 'ഇഷ്ടപ്പെട്ട ആൽബം',
    albums_personal_surface: 'വ്യക്തിഗത പ്രതലം',
    gallery_all_tags: 'എല്ലാ ടാഗുകളും ({count})',
    trash_days_left: '{days} ദിവസം ബാക്കി',
    trash_restore_btn: 'പുനഃസ്ഥാപിക്കുക',
    trash_erase_btn: 'മായ്ക്കുക',
    tags_all_count: 'എല്ലാ ടാഗുകളും ({count})',
    tags_photo_count: '{count} ഫോട്ടോകൾ ടാഗ് ചെയ്‌തു'
  },
  pa: {
    gallery_download_zip: 'ਜ਼ਿਪ ਡਾਊਨਲੋਡ ਕਰੋ',
    settings_storage_used: '{total} GB ਵਿੱਚੋਂ {used} MB ਵਰਤਿਆ ਗਿਆ',
    settings_storage_pro_active: 'ਔਰਾ ਵੀਆਈਪੀ ਮੈਂਬਰਸ਼ਿਪ ਕਿਰਿਆਸ਼ੀਲ ਹੈ · ਕਲਾਉਡ ਅਤੇ ਗੁਪਤ ਵਾਲਟ ਅਨਲੌਕ',
    settings_pro_activated: 'ਔਰਾ ਪ੍ਰੋ ਵੀਆਈਪੀ ਕਿਰਿਆਸ਼ੀਲ',
    albums_category_count: 'ਸ਼੍ਰੇਣੀ ਐਲਬਮਾਂ',
    albums_gallery_count: 'ਗੈਲਰੀ ਵਿੱਚ ਫ਼ੋਟੋਆਂ',
    albums_empty_tag: 'ਹਾਲੇ ਕੋਈ ਫ਼ੋਟੋ ਨਹੀਂ',
    albums_favorite_album: 'ਮਨਪਸੰਦ ਐਲਬਮ',
    albums_personal_surface: 'ਨਿੱਜੀ ਸਤ੍ਹਾ',
    gallery_all_tags: 'ਸਾਰੇ ਟੈਗ ({count})',
    trash_days_left: '{days} ਦਿਨ ਬਾਕੀ',
    trash_restore_btn: 'ਮੁੜ ਬਹਾਲ ਕਰੋ',
    trash_erase_btn: 'ਮਿਟਾਓ',
    tags_all_count: 'ਸਾਰੇ ਟੈਗ ({count})',
    tags_photo_count: '{count} ਫ਼ੋਟੋਆਂ ਟੈਗ ਕੀਤੀਆਂ ਗਈਆਂ'
  }
};

for (const [lang, dict] of Object.entries(extraKeys)) {
  // Find where this language dict starts: e.g. "hi: {"
  const langKey = `${lang}: {`;
  const pos = code.indexOf(langKey);
  if (pos !== -1) {
    const insertPos = pos + langKey.length;
    let extraStr = '\n';
    for (const [k, v] of Object.entries(dict)) {
      extraStr += `      ${k}: ${JSON.stringify(v)},\n`;
    }
    code = code.slice(0, insertPos) + extraStr + code.slice(insertPos);
  }
}

fs.writeFileSync('web/i18n.js', code, 'utf8');
console.log('Successfully injected extra keys and removed (LANGUAGE) from web/i18n.js');
