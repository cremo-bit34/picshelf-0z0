const fs = require('fs');

let content = fs.readFileSync('web/i18n.js', 'utf8');

const accurateTranslations = {
  en: {
    settings_storage_pro_active: "Aura VIP Membership Active · 100% Private On-Device & Secret Vault Unlocked",
    settings_pro_tagline: "Unlock the ultimate AI organizer with unlimited albums, 100% private on-device storage & biometric vault.",
    settings_pro_feat_4: "100% On-Device Privacy & Fast Local Backup"
  },
  hi: {
    settings_storage_pro_active: "ऑरा वीआईपी सदस्यता सक्रिय · 100% निजी ऑन-डिवाइस और गुप्त वॉल्ट अनलॉक",
    settings_pro_tagline: "असीमित एल्बम, 100% निजी ऑन-डिवाइस स्टोरेज और बायोमेट्रिक वॉल्ट अनलॉक करें।",
    settings_pro_feat_4: "100% ऑन-डिवाइस गोपनीयता और सुरक्षित लोकल बैकअप"
  },
  bn: {
    settings_storage_pro_active: "অরা ভিআইপি সদস্যপদ সক্রিয় · ১০০% অন-ডিভাইস গোপনীয় ও সিক্রেট ভল্ট আনলকড",
    settings_pro_tagline: "আনলিমিটেড অ্যালবাম, ১০০% অন-ডিভাইস প্রাইভেট স্টোরেজ এবং বায়োমেট্রিক ভল্ট আনলক করুন।",
    settings_pro_feat_4: "১০০% অন-ডিভাইস প্রাইভেসি ও দ্রুত লোকাল ব্যাকআপ"
  },
  te: {
    settings_storage_pro_active: "ఆరా వీఐపీ సభ్యత్వం సక్రియంగా ఉంది · 100% ప్రైవేట్ ఆన్-డివైస్ & రహస్య వాల్ట్ అన్‌లాక్ చేయబడింది",
    settings_pro_tagline: "అపరిమిత ఆల్బమ్‌లు, 100% ప్రైవేట్ ఆన్-డివైస్ నిల్వ మరియు బయోమెట్రిక్ వాల్ట్‌ను అన్‌లాక్ చేయండి.",
    settings_pro_feat_4: "100% ఆన్-డివైస్ గోప్యత & వేగవంతమైన స్థానిక బ్యాకప్"
  },
  ta: {
    settings_storage_pro_active: "ஆரா விஐபி உறுப்பினர் செயலில் உள்ளது · 100% சாதனத்தில் தனிப்பட்டது & ரகசிய பெட்டகம் திறக்கப்பட்டது",
    settings_pro_tagline: "வரம்பற்ற ஆல்பங்கள், 100% சாதனத்தில் பாதுகாப்பான சேமிப்பு மற்றும் பயோமெட்ரிக் பெட்டகத்தை திறக்கவும்.",
    settings_pro_feat_4: "100% சாதனத்தின் தனியுரிமை & விரைவான உள்ளூர் காப்புப்பிரதி"
  },
  mr: {
    settings_storage_pro_active: "ऑरा व्हीआयपी सदस्यत्व सक्रिय · 100% खाजगी ऑन-डिव्हाइस आणि सिक्रेट व्हॉल्ट अनलॉक",
    settings_pro_tagline: "अमर्यादित अल्बम, 100% खाजगी ऑन-डिव्हाइस स्टोरेज आणि बायोमेट्रिक व्हॉल्ट अनलॉक करा.",
    settings_pro_feat_4: "100% ऑन-डिव्हाइस गोपनीयता आणि जलद स्थानिक बॅकअप"
  },
  gu: {
    settings_storage_pro_active: "ઓરા વીઆઈપી સભ્યપદ સક્રિય · 100% ખાનગી ઑન-ડિવાઇસ અને સિક્રેટ વૉલ્ટ અનલૉક",
    settings_pro_tagline: "અમર્યાદિત આલ્બમ, 100% ખાનગી ઑન-ડિવાઇસ સ્ટોરેજ અને બાયોમેટ્રિક વૉલ્ટ અનલૉક કરો.",
    settings_pro_feat_4: "100% ઑન-ડિવાઇસ ગોપનીયતા અને સુરક્ષિત સ્થાનિક બેકઅપ"
  },
  kn: {
    settings_storage_pro_active: "ಆರಾ ವಿಐಪಿ ಸದಸ್ಯತ್ವ ಸಕ್ರಿಯವಾಗಿದೆ · 100% ಖಾಸಗಿ ಆನ್-ಡಿವೈಸ್ ಮತ್ತು ಸೀಕ್ರೆಟ್ ವಾಲ್ಟ್ ಅನ್‌ಲಾಕ್ ಆಗಿದೆ",
    settings_pro_tagline: "ಅನಿಯಮಿತ ಆಲ್ಬಮ್‌ಗಳು, 100% ಖಾಸಗಿ ಆನ್-ಡಿವೈಸ್ ಸಂಗ್ರಹಣೆ ಮತ್ತು ಬಯೋಮೆಟ್ರಿಕ್ ವಾಲ್ಟ್ ಅನ್‌ಲಾಕ್ ಮಾಡಿ.",
    settings_pro_feat_4: "100% ಆನ್-ಡಿವೈಸ್ ಗೌಪ್ಯತೆ ಮತ್ತು ವೇಗದ ಸ್ಥಳೀಯ ಬ್ಯಾಕಪ್"
  },
  ml: {
    settings_storage_pro_active: "ഓറ വിഐപി അംഗത്വം സജീവം · 100% സ്വകാര്യ ഓൺ-ഡിവൈസ് & രഹസ്യ വോൾട്ട് അൺലോക്ക് ചെയ്‌തു",
    settings_pro_tagline: "പരിധിയില്ലാത്ത ആൽബങ്ങൾ, 100% സ്വകാര്യ ഓൺ-ഡിവൈസ് സംഭരണം, ബയോമെട്രിക് വോൾട്ട് എന്നിവ നേടുക.",
    settings_pro_feat_4: "100% ഓൺ-ഡിവൈസ് സ്വകാര്യതയും വേഗതയേറിയ ലോക്കൽ ബാക്കപ്പും"
  },
  pa: {
    settings_storage_pro_active: "ਔਰਾ ਵੀਆਈਪੀ ਮੈਂਬਰਸ਼ਿਪ ਕਿਰਿਆਸ਼ੀਲ ਹੈ · 100% ਨਿੱਜੀ ਆਨ-ਡਿਵਾਈਸ ਅਤੇ ਗੁਪਤ ਵਾਲਟ ਅਨਲੌਕ",
    settings_pro_tagline: "ਅਸੀਮਤ ਐਲਬਮਾਂ, 100% ਨਿੱਜੀ ਆਨ-ਡਿਵਾਈਸ ਸਟੋਰੇਜ ਅਤੇ ਬਾਇਓਮੈਟ੍ਰਿਕ ਵਾਲਟ ਅਨਲੌਕ ਕਰੋ।",
    settings_pro_feat_4: "100% ਆਨ-ਡਿਵਾਈਸ ਗੋਪਨੀਯਤਾ ਅਤੇ ਤੇਜ਼ ਸਥਾਨਕ ਬੈਕਅੱਪ"
  }
};

// Replace each occurrence in each language block
const langRegex = /\n    ([a-z]{2}): \{([\s\S]*?)\n    \},?/g;

content = content.replace(langRegex, (match, langCode, block) => {
  const trans = accurateTranslations[langCode];
  if (!trans) return match;

  let updatedBlock = block;
  for (const [key, newVal] of Object.entries(trans)) {
    const keyRegex = new RegExp(`(${key}:\\s*)(['"][\\s\\S]*?['"]),?`);
    if (keyRegex.test(updatedBlock)) {
      updatedBlock = updatedBlock.replace(keyRegex, `$1${JSON.stringify(newVal)},`);
    } else {
      // Key doesn't exist yet, insert it near settings_storage_used
      const anchorRegex = /(settings_storage_used:[\s\S]*?,)/;
      if (anchorRegex.test(updatedBlock)) {
        updatedBlock = updatedBlock.replace(anchorRegex, `$1\n      ${key}: ${JSON.stringify(newVal)},`);
      } else {
        updatedBlock = `\n      ${key}: ${JSON.stringify(newVal)},` + updatedBlock;
      }
    }
  }
  return `\n    ${langCode}: {${updatedBlock}\n    },`;
});

fs.writeFileSync('web/i18n.js', content, 'utf8');
console.log("Successfully updated settings i18n in web/i18n.js!");
