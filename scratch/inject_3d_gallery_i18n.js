const fs = require('fs');

const i18nPath = 'web/i18n.js';
let code = fs.readFileSync(i18nPath, 'utf8');

const newKeys = {
  en: {
    gallery_3d_effects_title: '3D Effects',
    gallery_3d_effects_desc: 'Holographic Tilt & Depth',
    gallery_3d_effects_active: '3D Tilt & Depth: Active',
    gallery_3d_effects_off: '3D Effects: Disabled (Flat 2D)',
    gallery_3d_unlock_vip: 'Unlock with Aura VIP',
    gallery_3d_effects_on_toast: '✨ 3D Holographic Parallax & Depth Enabled!',
    gallery_3d_effects_off_toast: '3D Effects Disabled (Clean 2D Mode)',
    gallery_3d_vip_only: '👑 3D Effects are an Aura Pro VIP exclusive feature!'
  },
  hi: {
    gallery_3d_effects_title: '3D प्रभाव',
    gallery_3d_effects_desc: 'होलोग्राफिक टिल्ट और गहराई',
    gallery_3d_effects_active: '3D टिल्ट और गहराई: सक्रिय',
    gallery_3d_effects_off: '3D प्रभाव: बंद (2D मोड)',
    gallery_3d_unlock_vip: 'Aura VIP के साथ अनलॉक करें',
    gallery_3d_effects_on_toast: '✨ 3D होलोग्राफिक प्रभाव सक्षम!',
    gallery_3d_effects_off_toast: '3D प्रभाव अक्षम किया गया (2D मोड)',
    gallery_3d_vip_only: '👑 3D प्रभाव केवल Aura Pro VIP सदस्यों के लिए उपलब्ध है!'
  },
  bn: {
    gallery_3d_effects_title: '3D এফেক্ট',
    gallery_3d_effects_desc: 'হোলোগ্রাফিক টিল্ট ও ডেপথ',
    gallery_3d_effects_active: '3D টিল্ট ও ডেপথ: সক্রিয়',
    gallery_3d_effects_off: '3D এফেক্ট: নিষ্ক্রিয় (2D মোড)',
    gallery_3d_unlock_vip: 'Aura VIP দিয়ে আনলক করুন',
    gallery_3d_effects_on_toast: '✨ 3D হোলোগ্রাফিক এফেক্ট সক্রিয়!',
    gallery_3d_effects_off_toast: '3D এফেক্ট বন্ধ করা হয়েছে (2D মোড)',
    gallery_3d_vip_only: '👑 3D এফেক্ট শুধুমাত্র Aura Pro VIP সদস্যদের জন্য!'
  },
  te: {
    gallery_3d_effects_title: '3D ఎఫెక్ట్స్',
    gallery_3d_effects_desc: 'హోలోగ్రాఫిక్ టిల్ట్ & డెప్త్',
    gallery_3d_effects_active: '3D టిల్ట్ & డెప్త్: ఆన్',
    gallery_3d_effects_off: '3D ఎఫెక్ట్స్: ఆఫ్ (2D మోడ్)',
    gallery_3d_unlock_vip: 'Aura VIP తో అన్‌లాక్ చేయండి',
    gallery_3d_effects_on_toast: '✨ 3D హోలోగ్రాఫిక్ ఎఫెక్ట్స్ ప్రారంభించబడ్డాయి!',
    gallery_3d_effects_off_toast: '3D ఎఫెక్ట్స్ నిలిపివేయబడ్డాయి (2D మోడ్)',
    gallery_3d_vip_only: '👑 3D ఎఫెక్ట్స్ Aura Pro VIP వినియోగదారులకు మాత్రమే అందుబాటులో ఉన్నాయి!'
  },
  ta: {
    gallery_3d_effects_title: '3D எஃபெக்ட்ஸ்',
    gallery_3d_effects_desc: 'ஹாலோகிராபிக் டில்ட் மற்றும் ஆழம்',
    gallery_3d_effects_active: '3D டில்ட் மற்றும் ஆழம்: செயலில்',
    gallery_3d_effects_off: '3D எஃபெக்ட்ஸ்: முடக்கப்பட்டது (2D)',
    gallery_3d_unlock_vip: 'Aura VIP உடன் திறக்கவும்',
    gallery_3d_effects_on_toast: '✨ 3D எஃபெக்ட்ஸ் இயக்கப்பட்டது!',
    gallery_3d_effects_off_toast: '3D எஃபெக்ட்ஸ் முடக்கப்பட்டது (2D)',
    gallery_3d_vip_only: '👑 3D எஃபெக்ட்ஸ் Aura Pro VIP உறுப்பினர்களுக்கு மட்டுமே!'
  },
  mr: {
    gallery_3d_effects_title: '3D इफेक्ट्स',
    gallery_3d_effects_desc: 'होलोग्राफिक टिल्ट आणि डेप्थ',
    gallery_3d_effects_active: '3D टिल्ट आणि डेप्थ: सुरू',
    gallery_3d_effects_off: '3D इफेक्ट्स: बंद (2D मोड)',
    gallery_3d_unlock_vip: 'Aura VIP सह अनलॉक करा',
    gallery_3d_effects_on_toast: '✨ 3D होलोग्राफिक इफेक्ट्स सुरू झाले!',
    gallery_3d_effects_off_toast: '3D इफेक्ट्स बंद केले (2D मोड)',
    gallery_3d_vip_only: '👑 3D इफेक्ट्स फक्त Aura Pro VIP सदस्यांसाठी आहेत!'
  },
  gu: {
    gallery_3d_effects_title: '3D અસરો',
    gallery_3d_effects_desc: 'હોલોગ્રાફિક ટિલ્ટ અને ડેપ્થ',
    gallery_3d_effects_active: '3D ટિલ્ટ અને ડેપ્થ: ચાલુ',
    gallery_3d_effects_off: '3D અસરો: બંધ (2D મોડ)',
    gallery_3d_unlock_vip: 'Aura VIP સાથે અનલૉક કરો',
    gallery_3d_effects_on_toast: '✨ 3D હોલોગ્રાફિક અસરો સક્ષમ!',
    gallery_3d_effects_off_toast: '3D અસરો બંધ કરવામાં આવી (2D મોડ)',
    gallery_3d_vip_only: '👑 3D અસરો ફક્ત Aura Pro VIP સભ્યો માટે છે!'
  },
  kn: {
    gallery_3d_effects_title: '3D ಪರಿಣಾಮಗಳು',
    gallery_3d_effects_desc: 'ಹೋಲೋಗ್ರಾಫಿಕ್ ಟಿಲ್ಟ್ & ಡೆಪ್ತ್',
    gallery_3d_effects_active: '3D ಟಿಲ್ಟ್ & ಡೆಪ್ತ್: ಸಕ್ರಿಯ',
    gallery_3d_effects_off: '3D ಪರಿಣಾಮಗಳು: ನಿಷ್ಕ್ರಿಯ (2D)',
    gallery_3d_unlock_vip: 'Aura VIP ನೊಂದಿಗೆ ಅನ್‌ಲಾಕ್ ಮಾಡಿ',
    gallery_3d_effects_on_toast: '✨ 3D ಪರಿಣಾಮಗಳು ಸಕ್ರಿಯಗೊಂಡಿವೆ!',
    gallery_3d_effects_off_toast: '3D ಪರಿಣಾಮಗಳು ನಿಷ್ಕ್ರಿಯಗೊಂಡಿವೆ (2D)',
    gallery_3d_vip_only: '👑 3D ಪರಿಣಾಮಗಳು Aura Pro VIP ಸದಸ್ಯರಿಗೆ ಮಾತ್ರ ಲಭ್ಯ!'
  },
  ml: {
    gallery_3d_effects_title: '3D ഇഫക്റ്റുകൾ',
    gallery_3d_effects_desc: 'ഹോളോഗ്രാഫിക് ടിൽറ്റും ആഴവും',
    gallery_3d_effects_active: '3D ടിൽറ്റും ആഴവും: സജീവം',
    gallery_3d_effects_off: '3D ഇഫക്റ്റുകൾ: ഓഫാണ് (2D)',
    gallery_3d_unlock_vip: 'Aura VIP ഉപയോഗിച്ച് അൺലോക്ക് ചെയ്യുക',
    gallery_3d_effects_on_toast: '✨ 3D ഇഫക്റ്റുകൾ പ്രവർത്തനക്ഷമമാക്കി!',
    gallery_3d_effects_off_toast: '3D ഇഫക്റ്റുകൾ ഓഫാക്കി (2D മോഡ്)',
    gallery_3d_vip_only: '👑 3D ഇഫക്റ്റുകൾ Aura Pro VIP അംഗങ്ങൾക്ക് മാത്രമുള്ളതാണ്!'
  },
  pa: {
    gallery_3d_effects_title: '3D ਪ੍ਰਭਾਵ',
    gallery_3d_effects_desc: 'ਹੋਲੋਗ੍ਰਾਫਿਕ ਟਿਲਟ ਅਤੇ ਡੈਪਥ',
    gallery_3d_effects_active: '3D ਟਿਲਟ ਅਤੇ ਡੈਪਥ: ਚਾਲੂ',
    gallery_3d_effects_off: '3D ਪ੍ਰਭਾਵ: ਬੰਦ (2D ਮੋਡ)',
    gallery_3d_unlock_vip: 'Aura VIP ਨਾਲ ਅਨਲੌਕ ਕਰੋ',
    gallery_3d_effects_on_toast: '✨ 3D ਹੋਲੋਗ੍ਰਾਫਿਕ ਪ੍ਰਭਾਵ ਚਾਲੂ ਹੋਏ!',
    gallery_3d_effects_off_toast: '3D ਪ੍ਰਭਾਵ ਬੰਦ ਕੀਤੇ ਗਏ (2D ਮੋਡ)',
    gallery_3d_vip_only: '👑 3D ਪ੍ਰਭਾਵ ਸਿਰਫ਼ Aura Pro VIP ਮੈਂਬਰਾਂ ਲਈ ਹਨ!'
  }
};

for (const [lang, dict] of Object.entries(newKeys)) {
  // Regex to find `<lang>: {`
  const regex = new RegExp(`(${lang}:\\s*\\{[\\s\\S]*?)(settings_location_section:)`, 'm');
  if (regex.test(code)) {
    let insertion = '';
    for (const [k, v] of Object.entries(dict)) {
      insertion += `      ${k}: '${v.replace(/'/g, "\\'")}',\n`;
    }
    code = code.replace(regex, `$1${insertion}      $2`);
    console.log(`Added keys for ${lang}`);
  } else {
    console.log(`Pattern not matched for ${lang}`);
  }
}

fs.writeFileSync(i18nPath, code, 'utf8');
console.log('Successfully updated web/i18n.js');
