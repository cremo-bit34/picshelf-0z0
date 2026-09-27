const fs = require('fs');

const translationsByLang = {
  en: {
    settings_updates_section: 'APP UPDATES & NOTIFICATIONS',
    settings_push_updates_title: 'Push Update Notifications',
    settings_push_updates_desc: 'Instant alerts when a new version is released. All photos, albums & settings are preserved.',
    settings_check_update_title: 'Check for Updates',
    settings_check_update_desc: 'You are on the latest version · v2.4.0',
    settings_check_now_btn: 'Check Now',
    update_modal_eyebrow: 'UPDATE AVAILABLE',
    update_modal_title: 'New Aura Update Ready',
    update_installed_vs_latest: 'INSTALLED → LATEST',
    update_data_safety_guarantee: '100% In-Place Update · All Photos & Settings Intact',
    update_whats_new_title: "What's New:",
    update_downloading: 'Downloading update...',
    update_btn_later: 'Remind Later',
    update_btn_install: 'Download & Install',
    update_toast_checking: 'Checking for updates...',
    update_toast_latest: 'You are using the latest version of Aura (v2.4.0)!',
    update_toast_found: 'A new update is available!'
  },
  hi: {
    settings_updates_section: 'ऐप अपडेट एवं सूचनाएं',
    settings_push_updates_title: 'पुश अपडेट सूचनाएं',
    settings_push_updates_desc: 'नया संस्करण जारी होने पर तुरंत सूचना प्राप्त करें। सभी फ़ोटो एवं सेटिंग्स सुरक्षित रहेंगी।',
    settings_check_update_title: 'अपडेट की जांच करें',
    settings_check_update_desc: 'आप नवीनतम संस्करण पर हैं · v2.4.0',
    settings_check_now_btn: 'अभी जांचें',
    update_modal_eyebrow: 'अपडेट उपलब्ध है',
    update_modal_title: 'नया ऑरा अपडेट तैयार है',
    update_installed_vs_latest: 'स्थापित → नवीनतम',
    update_data_safety_guarantee: '100% इन-प्लेस अपडेट · सभी फ़ोटो एवं सेटिंग्स सुरक्षित',
    update_whats_new_title: 'नया क्या है:',
    update_downloading: 'अपडेट डाउनलोड हो रहा है...',
    update_btn_later: 'बाद में याद दिलाएं',
    update_btn_install: 'डाउनलोड एवं इंस्टॉल करें',
    update_toast_checking: 'अपडेट की जांच की जा रही है...',
    update_toast_latest: 'आप ऑरा का नवीनतम संस्करण (v2.4.0) उपयोग कर रहे हैं!',
    update_toast_found: 'एक नया अपडेट उपलब्ध है!'
  },
  bn: {
    settings_updates_section: 'অ্যাপ আপডেট ও বিজ্ঞপ্তি',
    settings_push_updates_title: 'পুশ আপডেট বিজ্ঞপ্তি',
    settings_push_updates_desc: 'নতুন সংস্করণ প্রকাশিত হলে তাত্ক্ষণিক বিজ্ঞপ্তি পান। সমস্ত ছবি ও সেটিংস সুরক্ষিত থাকে।',
    settings_check_update_title: 'আপডেট পরীক্ষা করুন',
    settings_check_update_desc: 'আপনি সর্বশেষ সংস্করণে আছেন · v2.4.0',
    settings_check_now_btn: 'এখনই পরীক্ষা করুন',
    update_modal_eyebrow: 'আপডেট উপলব্ধ',
    update_modal_title: 'নতুন অরা আপডেট প্রস্তুত',
    update_installed_vs_latest: 'ইনস্টল করা → সর্বশেষ',
    update_data_safety_guarantee: '১০০% নিরাপদ আপডেট · সমস্ত ছবি ও সেটিংস অক্ষত',
    update_whats_new_title: 'নতুন কী আছে:',
    update_downloading: 'আপডেট ডাউনলোড হচ্ছে...',
    update_btn_later: 'পরে মনে করিয়ে দিন',
    update_btn_install: 'ডাউনলোড ও ইনস্টল করুন',
    update_toast_checking: 'আপডেট পরীক্ষা করা হচ্ছে...',
    update_toast_latest: 'আপনি অরার সর্বশেষ সংস্করণ (v2.4.0) ব্যবহার করছেন!',
    update_toast_found: 'একটি নতুন আপডেট উপলব্ধ!'
  },
  te: {
    settings_updates_section: 'యాప్ అప్‌డేట్లు & నోటిఫికేషన్లు',
    settings_push_updates_title: 'పుష్ అప్‌డేట్ నోటిఫికేషన్లు',
    settings_push_updates_desc: 'కొత్త వెర్షన్ విడుదలైనప్పుడు తక్షణ అలర్ట్‌లను పొందండి. ఫోటోలు మరియు సెట్టింగ్‌లు భద్రంగా ఉంటాయి.',
    settings_check_update_title: 'అప్‌డేట్ల కోసం తనిఖీ చేయండి',
    settings_check_update_desc: 'మీరు తాజా వెర్షన్‌లో ఉన్నారు · v2.4.0',
    settings_check_now_btn: 'ఇప్పుడే తనిఖీ చేయండి',
    update_modal_eyebrow: 'అప్‌డేట్ అందుబాటులో ఉంది',
    update_modal_title: 'కొత్త ఆరా అప్‌డేట్ సిద్ధంగా ఉంది',
    update_installed_vs_latest: 'ఇన్‌స్టాల్ చేసినది → తాజా',
    update_data_safety_guarantee: '100% సురక్షిత అప్‌డేట్ · ఫోటోలు & సెట్టింగ్‌లు భద్రం',
    update_whats_new_title: 'కొత్త విశేషాలు:',
    update_downloading: 'అప్‌డేట్ డౌన్‌లోడ్ అవుతోంది...',
    update_btn_later: 'తర్వాత గుర్తుచేయి',
    update_btn_install: 'డౌన్‌లోడ్ & ఇన్‌స్టాల్',
    update_toast_checking: 'అప్‌డేట్ల కోసం తనిఖీ చేస్తోంది...',
    update_toast_latest: 'మీరు ఆరా యొక్క తాజా వెర్షన్ (v2.4.0)ను ఉపయోగిస్తున్నారు!',
    update_toast_found: 'కొత్త అప్‌డేట్ అందుబాటులో ఉంది!'
  },
  ta: {
    settings_updates_section: 'செயலி புதுப்பிப்புகள் & அறிவிப்புகள்',
    settings_push_updates_title: 'புஷ் புதுப்பிப்பு அறிவிப்புகள்',
    settings_push_updates_desc: 'புதிய பதிப்பு வெளியாகும் போது உடனடி அறிவிப்பைப் பெறுங்கள். அனைத்து புகைப்படங்களும் அமைப்புகளும் பாதுகாப்பாக இருக்கும்.',
    settings_check_update_title: 'புதுப்பிப்புகளைச் சரிபார்க்கவும்',
    settings_check_update_desc: 'நீங்கள் சமீபத்திய பதிப்பில் உள்ளீர்கள் · v2.4.0',
    settings_check_now_btn: 'இப்போது சரிபார்',
    update_modal_eyebrow: 'புதுப்பிப்பு உள்ளது',
    update_modal_title: 'புதிய ஆரா புதுப்பிப்பு தயார்',
    update_installed_vs_latest: 'நிறுவப்பட்டது → சமீபத்தியது',
    update_data_safety_guarantee: '100% பாதுகாப்பான புதுப்பிப்பு · படங்கள் மற்றும் அமைப்புகள் பாதுகாப்பானது',
    update_whats_new_title: 'புதிய அம்சங்கள்:',
    update_downloading: 'புதுப்பிப்பு பதிவிறக்கம் செய்யப்படுகிறது...',
    update_btn_later: 'பிறகு நினைவூட்டு',
    update_btn_install: 'பதிவிறக்கி நிறுவு',
    update_toast_checking: 'புதுப்பிப்புகள் சரிபார்க்கப்படுகின்றன...',
    update_toast_latest: 'நீங்கள் ஆராவின் சமீபத்திய பதிப்பைப் பயன்படுத்துகிறீர்கள் (v2.4.0)!',
    update_toast_found: 'புதிய புதுப்பிப்பு கிடைக்கிறது!'
  },
  mr: {
    settings_updates_section: 'अ‍ॅप अपडेट्स आणि सूचना',
    settings_push_updates_title: 'पुश अपडेट सूचना',
    settings_push_updates_desc: 'नवीन आवृत्ती उपलब्ध झाल्यावर तात्काळ सूचना मिळवा. सर्व फोटो आणि सेटिंग्ज सुरक्षित राहतील.',
    settings_check_update_title: 'अपडेट्स तपासा',
    settings_check_update_desc: 'तुम्ही नवीनतम आवृत्तीवर आहात · v2.4.0',
    settings_check_now_btn: 'आत्ताच तपासा',
    update_modal_eyebrow: 'अपडेट उपलब्ध',
    update_modal_title: 'नवीन ऑरा अपडेट सज्ज आहे',
    update_installed_vs_latest: 'स्थापित → नवीनतम',
    update_data_safety_guarantee: '100% सुरक्षित अपडेट · सर्व फोटो व सेटिंग्ज अबाधित',
    update_whats_new_title: 'नवीन काय आहे:',
    update_downloading: 'अपडेट डाउनलोड होत आहे...',
    update_btn_later: 'नंतर आठवण करा',
    update_btn_install: 'डाउनलोड आणि स्थापित करा',
    update_toast_checking: 'अपडेट्स तपासत आहे...',
    update_toast_latest: 'तुम्ही ऑराची नवीनतम आवृत्ती (v2.4.0) वापरत आहात!',
    update_toast_found: 'नवीन अपडेट उपलब्ध आहे!'
  },
  gu: {
    settings_updates_section: 'એપ અપડેટ્સ અને સૂચનાઓ',
    settings_push_updates_title: 'પુશ અપડેટ સૂચનાઓ',
    settings_push_updates_desc: 'નવું વર્ઝન બહાર પડતાં જ ત્વરિત સૂચના મેળવો. બધા ફોટા અને સેટિંગ્સ સુરક્ષિત રહેશે.',
    settings_check_update_title: 'અપડેટ્સ માટે તપાસો',
    settings_check_update_desc: 'તમે નવીનતમ સંસ્કરણ પર છો · v2.4.0',
    settings_check_now_btn: 'હમણાં તપાસો',
    update_modal_eyebrow: 'અપડેટ ઉપલબ્ધ છે',
    update_modal_title: 'નવું ઓરા અપડેટ તૈયાર છે',
    update_installed_vs_latest: 'ઇન્સ્ટોલ કરેલ → નવીનતમ',
    update_data_safety_guarantee: '100% સુરક્ષિત અપડેટ · બધા ફોટા અને સેટિંગ્સ અકબંધ',
    update_whats_new_title: 'નવું શું છે:',
    update_downloading: 'અપડેટ ડાઉનલોડ થઈ રહ્યું છે...',
    update_btn_later: 'પછીથી યાદ કરાવો',
    update_btn_install: 'ડાઉનલોડ અને ઇન્સ્ટોલ કરો',
    update_toast_checking: 'અપડેટ્સ ચકાસી રહ્યું છે...',
    update_toast_latest: 'તમે ઓરાનું નવીનતમ સંસ્કરણ (v2.4.0) વાપરી રહ્યા છો!',
    update_toast_found: 'નવું અપડેટ ઉપલબ્ધ છે!'
  },
  kn: {
    settings_updates_section: 'ಅಪ್ಲಿಕೇಶನ್ ನವೀಕರಣಗಳು ಮತ್ತು ಅಧಿಸೂಚನೆಗಳು',
    settings_push_updates_title: 'ಪುಶ್ ಅಪ್‌ಡೇಟ್ ಅಧಿಸೂಚನೆಗಳು',
    settings_push_updates_desc: 'ಹೊಸ ಆವೃತ್ತಿ ಬಿಡುಗಡೆಯಾದಾಗ ತ್ವರಿತ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಪಡೆಯಿರಿ. ಫೋಟೋಗಳು ಮತ್ತು ಸೆಟ್ಟಿಂಗ್‌ಗಳು ಸುರಕ್ಷಿತವಾಗಿರುತ್ತವೆ.',
    settings_check_update_title: 'ನವೀಕರಣಗಳಿಗಾಗಿ ಪರಿಶೀಲಿಸಿ',
    settings_check_update_desc: 'ನೀವು ಇತ್ತೀಚಿನ ಆವೃತ್ತಿಯಲ್ಲಿದ್ದೀರಿ · v2.4.0',
    settings_check_now_btn: 'ಈಗಲೇ ಪರಿಶೀಲಿಸಿ',
    update_modal_eyebrow: 'ಅಪ್‌ಡೇಟ್ ಲಭ್ಯವಿದೆ',
    update_modal_title: 'ಹೊಸ ಔರಾ ಅಪ್‌ಡೇಟ್ ಸಿದ್ಧವಾಗಿದೆ',
    update_installed_vs_latest: 'ಸ್ಥಾಪಿಸಲಾಗಿದೆ → ಇತ್ತೀಚಿನದು',
    update_data_safety_guarantee: '100% ಸುರಕ್ಷಿತ ಅಪ್‌ಡೇಟ್ · ಫೋಟೋಗಳು ಮತ್ತು ಸೆಟ್ಟಿಂಗ್‌ಗಳು ಭದ್ರ',
    update_whats_new_title: 'ಹೊಸದೇನಿದೆ:',
    update_downloading: 'ನವೀಕರಣ ಡೌನ್‌ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    update_btn_later: 'ನಂತರ ನೆನಪಿಸು',
    update_btn_install: 'ಡೌನ್‌ಲೋಡ್ & ಸ್ಥಾಪಿಸಿ',
    update_toast_checking: 'ನವೀಕರಣಗಳಿಗಾಗಿ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
    update_toast_latest: 'ನೀವು ಔರಾದ ಇತ್ತೀಚಿನ ಆವೃತ್ತಿಯನ್ನು (v2.4.0) ಬಳಸುತ್ತಿದ್ದೀರಿ!',
    update_toast_found: 'ಹೊಸ ನವೀಕರಣ ಲಭ್ಯವಿದೆ!'
  },
  ml: {
    settings_updates_section: 'ആപ്പ് അപ്‌ഡേറ്റുകളും അറിയിപ്പുകളും',
    settings_push_updates_title: 'പുഷ് അപ്‌ഡേറ്റ് അറിയിപ്പുകൾ',
    settings_push_updates_desc: 'പുതിയ പതിപ്പ് ഇറങ്ങുമ്പോൾ തത്സമയ അറിയിപ്പ് ലഭിക്കും. ഫോട്ടോകളും ക്രമീകരണങ്ങളും പൂർണ്ണമായും സുരക്ഷിതമായിരിക്കും.',
    settings_check_update_title: 'അപ്‌ഡേറ്റുകൾക്കായി പരിശോധിക്കുക',
    settings_check_update_desc: 'നിങ്ങൾ ഏറ്റവും പുതിയ പതിപ്പിലാണ് · v2.4.0',
    settings_check_now_btn: 'ഇപ്പോൾ പരിശോധിക്കുക',
    update_modal_eyebrow: 'അപ്‌ഡേറ്റ് ലഭ്യമാണ്',
    update_modal_title: 'പുതിയ ഓറ അപ്‌ഡേറ്റ് തയ്യാറാണ്',
    update_installed_vs_latest: 'ഇൻസ്റ്റാൾ ചെയ്തത് → ഏറ്റവും പുതിയത്',
    update_data_safety_guarantee: '100% സുരക്ഷിത അപ്‌ഡേറ്റ് · ഫോട്ടോകളും ക്രമീകരണങ്ങളും ഭദ്രം',
    update_whats_new_title: 'പുതിയതെന്തെല്ലാം:',
    update_downloading: 'അപ്‌ഡേറ്റ് ഡൗൺലോഡ് ചെയ്യുന്നു...',
    update_btn_later: 'പിന്നീട് ഓർമ്മിപ്പിക്കുക',
    update_btn_install: 'ഡൗൺലോഡ് & ഇൻസ്റ്റാൾ ചെയ്യുക',
    update_toast_checking: 'അപ്‌ഡേറ്റുകൾ പരിശോധിക്കുന്നു...',
    update_toast_latest: 'നിങ്ങൾ ഓറയുടെ ഏറ്റവും പുതിയ പതിപ്പാണ് (v2.4.0) ഉപയോഗിക്കുന്നത്!',
    update_toast_found: 'ഒരു പുതിയ അപ്‌ഡേറ്റ് ലഭ്യമാണ്!'
  },
  pa: {
    settings_updates_section: 'ਐਪ ਅੱਪਡੇਟ ਅਤੇ ਸੂਚਨਾਵਾਂ',
    settings_push_updates_title: 'ਪੁਸ਼ ਅੱਪਡੇਟ ਸੂਚਨਾਵਾਂ',
    settings_push_updates_desc: "ਨਵਾਂ ਸੰਸਕਰਣ ਜਾਰੀ ਹੋਣ 'ਤੇ ਤੁਰੰਤ ਸੂਚਨਾ ਪ੍ਰਾਪਤ ਕਰੋ। ਸਾਰੀਆਂ ਫ਼ੋਟੋਆਂ ਅਤੇ ਸੈਟਿੰਗਾਂ ਸੁਰੱਖਿਅਤ ਰਹਿੰਦੀਆਂ ਹਨ।",
    settings_check_update_title: 'ਅੱਪਡੇਟ ਲਈ ਜਾਂਚ ਕਰੋ',
    settings_check_update_desc: "ਤੁਸੀਂ ਨਵੀਨਤਮ ਸੰਸਕਰਣ 'ਤੇ ਹੋ · v2.4.0",
    settings_check_now_btn: 'ਹੁਣੇ ਜਾਂਚ ਕਰੋ',
    update_modal_eyebrow: 'ਅੱਪਡੇਟ ਉਪਲਬਧ ਹੈ',
    update_modal_title: 'ਨਵਾਂ ਔਰਾ ਅੱਪਡੇਟ ਤਿਆਰ ਹੈ',
    update_installed_vs_latest: 'ਇੰਸਟਾਲ ਕੀਤਾ → ਨਵੀਨਤਮ',
    update_data_safety_guarantee: '100% ਸੁਰੱਖਿਅਤ ਅੱਪਡੇਟ · ਸਾਰੀਆਂ ਫ਼ੋਟੋਆਂ ਤੇ ਸੈਟਿੰਗਾਂ ਸੁਰੱਖਿਅਤ',
    update_whats_new_title: 'ਨਵਾਂ ਕੀ ਹੈ:',
    update_downloading: 'ਅੱਪਡੇਟ ਡਾਊਨਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    update_btn_later: 'ਬਾਅਦ ਵਿੱਚ ਯਾਦ ਕਰਵਾਓ',
    update_btn_install: 'ਡਾਊਨਲੋਡ ਅਤੇ ਇੰਸਟਾਲ ਕਰੋ',
    update_toast_checking: 'ਅੱਪਡੇਟ ਦੀ ਜਾਂਚ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...',
    update_toast_latest: 'ਤੁਸੀਂ ਔਰਾ ਦਾ ਨਵੀਨਤਮ ਸੰਸਕਰਣ (v2.4.0) ਵਰਤ ਰਹੇ ਹੋ!',
    update_toast_found: 'ਇੱਕ ਨਵਾਂ ਅੱਪਡੇਟ ਉਪਲਬਧ ਹੈ!'
  }
};

let i18nContent = fs.readFileSync('web/i18n.js', 'utf8');

// For each language, find where settings_app_credits is located, and insert right after it
for (const lang of Object.keys(translationsByLang)) {
  const dict = translationsByLang[lang];
  let snippet = '\n';
  for (const [k, v] of Object.entries(dict)) {
    const escaped = v.replace(/'/g, "\\'");
    snippet += `      ${k}: '${escaped}',\n`;
  }

  // Regex to match the language block
  // e.g. "en: {" ... "settings_app_credits: ..."
  const langRegex = new RegExp(`(${lang}\\s*:\\s*\\{[\\s\\S]*?settings_app_credits:[^\\n]+)`, 'm');
  const match = i18nContent.match(langRegex);
  if (match) {
    i18nContent = i18nContent.replace(match[0], match[0] + snippet);
    console.log(`Successfully added update keys to [${lang}]`);
  } else {
    console.warn(`Could not find match for [${lang}]`);
  }
}

fs.writeFileSync('web/i18n.js', i18nContent, 'utf8');
console.log('Finished updating web/i18n.js');
