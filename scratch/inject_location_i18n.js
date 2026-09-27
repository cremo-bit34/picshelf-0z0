const fs = require('fs');

const locationDicts = {
  en: {
    settings_location_section: 'LOCATION & GPS TAGS',
    settings_gps_extraction: 'Extract Photo GPS Metadata',
    settings_gps_extraction_desc: 'Read EXIF coordinates from imported gallery photos',
    settings_location_tags: 'Suggest Location Tags',
    settings_location_tags_desc: 'Show smart Place, City, and Country tags on photo cards',
    settings_loc_place: 'Place & Landmark',
    settings_loc_place_desc: 'e.g. Gateway of India, Central Park',
    settings_loc_city: 'City & Town',
    settings_loc_city_desc: 'e.g. Mumbai, New York, Paris, Tokyo',
    settings_loc_country: 'Country',
    settings_loc_country_desc: 'e.g. India, United States, France, Japan',
    location_suggestions_title: 'Suggested Location Tags',
    location_toast_added: "Added location tag '{tag}'",
    location_toast_removed: "Removed location tag '{tag}'",
    location_type_place: 'Place',
    location_type_city: 'City',
    location_type_country: 'Country'
  },
  hi: {
    settings_location_section: 'स्थान एवं GPS टैग्स',
    settings_gps_extraction: 'फ़ोटो GPS मेटाडेटा निकालें',
    settings_gps_extraction_desc: 'गैलरी फ़ोटो से EXIF स्थान निर्देशांक पढ़ें',
    settings_location_tags: 'स्थान टैग सुझाएं',
    settings_location_tags_desc: 'फ़ोटो कार्ड पर स्थान, शहर एवं देश टैग दिखाएं',
    settings_loc_place: 'स्थान एवं लैंडमार्क',
    settings_loc_place_desc: 'उदा. इंडिया गेट, मरीन ड्राइव',
    settings_loc_city: 'शहर एवं कस्बा',
    settings_loc_city_desc: 'उदा. मुंबई, दिल्ली, न्यूयॉर्क, पेरिस',
    settings_loc_country: 'देश',
    settings_loc_country_desc: 'उदा. भारत, संयुक्त राज्य, फ्रांस',
    location_suggestions_title: 'सुझाए गए स्थान टैग',
    location_toast_added: "स्थान टैग '{tag}' जोड़ा गया",
    location_toast_removed: "स्थान टैग '{tag}' हटाया गया",
    location_type_place: 'स्थान',
    location_type_city: 'शहर',
    location_type_country: 'देश'
  },
  bn: {
    settings_location_section: 'লোকেশন ও GPS ট্যাগ',
    settings_gps_extraction: 'ছবির GPS মেটাডেটা সংগ্রহ',
    settings_gps_extraction_desc: 'গ্যালারির ছবি থেকে EXIF স্থানাঙ্ক পড়ুন',
    settings_location_tags: 'লোকেশন ট্যাগ প্রস্তাব',
    settings_location_tags_desc: 'ছবির কার্ডে স্থান, শহর ও দেশের ট্যাগ প্রদর্শন',
    settings_loc_place: 'স্থান ও ল্যান্ডমার্ক',
    settings_loc_place_desc: 'যেমন ভিক্টোরিয়া মেমোরিয়াল, পার্ক',
    settings_loc_city: 'শহর ও নগর',
    settings_loc_city_desc: 'যেমন কলকাতা, ঢাকা, নিউ ইয়র্ক',
    settings_loc_country: 'দেশ',
    settings_loc_country_desc: 'যেমন ভারত, বাংলাদেশ, ফ্রান্স',
    location_suggestions_title: 'প্রস্তাবিত লোকেশন ট্যাগ',
    location_toast_added: "লোকেশন ট্যাগ '{tag}' যোগ করা হয়েছে",
    location_toast_removed: "লোকেশন ট্যাগ '{tag}' সরানো হয়েছে",
    location_type_place: 'স্থান',
    location_type_city: 'শহর',
    location_type_country: 'দেশ'
  },
  te: {
    settings_location_section: 'లొకేషన్ & GPS ట్యాగ్‌లు',
    settings_gps_extraction: 'ఫోటో GPS మెటాడేటాను సేకరించు',
    settings_gps_extraction_desc: 'దిగుమతి చేసుకున్న ఫోటోల నుండి EXIF కోఆర్డినేట్లను చదవండి',
    settings_location_tags: 'లొకేషన్ ట్యాగ్‌లను సూచించు',
    settings_location_tags_desc: 'ఫోటో కార్డులపై ప్రదేశం, నగరం మరియు దేశం ట్యాగ్‌లను చూపించండి',
    settings_loc_place: 'ప్రదేశం & ల్యాండ్‌మార్క్',
    settings_loc_place_desc: 'ఉదా. చార్మినార్, సెంట్రల్ పార్క్',
    settings_loc_city: 'నగరం & పట్టణం',
    settings_loc_city_desc: 'ఉదా. హైదరాబాద్, ముంబై, న్యూయార్క్',
    settings_loc_country: 'దేశం',
    settings_loc_country_desc: 'ఉదా. భారతదేశం, అమెరికా',
    location_suggestions_title: 'సూచించబడిన లొకేషన్ ట్యాగ్‌లు',
    location_toast_added: "లొకేషన్ ట్యాగ్ '{tag}' జోడించబడింది",
    location_toast_removed: "లొకేషన్ ట్యాగ్ '{tag}' తొలగించబడింది",
    location_type_place: 'ప్రదేశం',
    location_type_city: 'నగరం',
    location_type_country: 'దేశం'
  },
  ta: {
    settings_location_section: 'இருப்பிடம் & GPS குறிச்சொற்கள்',
    settings_gps_extraction: 'புகைப்பட GPS மெட்டாடேட்டாவைப் பிரித்தெடு',
    settings_gps_extraction_desc: 'பதிவேற்றிய படங்களிலிருந்து EXIF ஆயங்களை வாசிக்கவும்',
    settings_location_tags: 'இருப்பிட குறிச்சொற்களைப் பரிந்துரைக்க',
    settings_location_tags_desc: 'புகைப்பட கார்டுகளில் இடம், நகரம் மற்றும் நாடு குறிச்சொற்களைக் காட்டவும்',
    settings_loc_place: 'இடம் & அடையாள சின்னம்',
    settings_loc_place_desc: 'எ.கா. மெரினா கடற்கரை, பூங்கா',
    settings_loc_city: 'நகரம்',
    settings_loc_city_desc: 'எ.கா. சென்னை, மும்பை, பாரிஸ்',
    settings_loc_country: 'நாடு',
    settings_loc_country_desc: 'எ.கா. இந்தியா, அமெரிக்கா',
    location_suggestions_title: 'பரிந்துரைக்கப்பட்ட இருப்பிட குறிச்சொற்கள்',
    location_toast_added: "இருப்பிடக் குறிச்சொல் '{tag}' சேர்க்கப்பட்டது",
    location_toast_removed: "இருப்பிடக் குறிச்சொல் '{tag}' நீக்கப்பட்டது",
    location_type_place: 'இடம்',
    location_type_city: 'நகரம்',
    location_type_country: 'நாடு'
  },
  mr: {
    settings_location_section: 'स्थान व GPS टॅग्ज',
    settings_gps_extraction: 'फोटो GPS मेटाडेटा गोळा करा',
    settings_gps_extraction_desc: 'इंपोर्ट केलेल्या फोटोंमधून EXIF समन्वय वाचा',
    settings_location_tags: 'स्थान टॅग्ज सुचवा',
    settings_location_tags_desc: 'फोटो कार्डवर ठिकाण, शहर आणि देश टॅग्ज दाखवा',
    settings_loc_place: 'ठिकाण व लँडमार्क',
    settings_loc_place_desc: 'उदा. गेटवे ऑफ इंडिया, मरीन ड्राइव्ह',
    settings_loc_city: 'शहर व नगर',
    settings_loc_city_desc: 'उदा. मुंबई, पुणे, पॅरिस',
    settings_loc_country: 'देश',
    settings_loc_country_desc: 'उदा. भारत, अमेरिका, फ्रान्स',
    location_suggestions_title: 'सुचवलेले स्थान टॅग्ज',
    location_toast_added: "स्थान टॅग '{tag}' जोडला",
    location_toast_removed: "स्थान टॅग '{tag}' काढला",
    location_type_place: 'ठिकाण',
    location_type_city: 'शहर',
    location_type_country: 'देश'
  },
  gu: {
    settings_location_section: 'સ્થાન અને GPS ટેગ્સ',
    settings_gps_extraction: 'ફોટો GPS મેટાડેટા મેળવો',
    settings_gps_extraction_desc: 'આયાત કરેલા ફોટામાંથી EXIF કોઓર્ડિનેટ્સ વાંચો',
    settings_location_tags: 'સ્થાન ટેગ્સ સૂચવો',
    settings_location_tags_desc: 'ફોટો કાર્ડ્સ પર સ્થળ, શહેર અને દેશના ટેગ્સ બતાવો',
    settings_loc_place: 'સ્થળ અને સીમાચિહ્ન',
    settings_loc_place_desc: 'દા.ત. સાબરમતી આશ્રમ, પાર્ક',
    settings_loc_city: 'શહેર અને નગર',
    settings_loc_city_desc: 'દા.ત. અમદાવાદ, મુંબઈ, લંડન',
    settings_loc_country: 'દેશ',
    settings_loc_country_desc: 'દા.ત. ભારત, અમેરિકા, જાપાન',
    location_suggestions_title: 'સૂચવેલ સ્થાન ટેગ્સ',
    location_toast_added: "સ્થાન ટેગ '{tag}' ઉમેર્યો",
    location_toast_removed: "સ્થાન ટેગ '{tag}' હટાવ્યો",
    location_type_place: 'સ્થળ',
    location_type_city: 'શહેર',
    location_type_country: 'દેશ'
  },
  kn: {
    settings_location_section: 'ಸ್ಥಳ ಮತ್ತು GPS ಟ್ಯಾಗ್‌ಗಳು',
    settings_gps_extraction: 'ಫೋಟೋ GPS ಮೆಟಾಡೇಟಾ ಹೊರತೆಗೆಯಿರಿ',
    settings_gps_extraction_desc: 'ಆಮದು ಮಾಡಲಾದ ಫೋಟೋಗಳಿಂದ EXIF ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ಓದಿ',
    settings_location_tags: 'ಸ್ಥಳದ ಟ್ಯಾಗ್‌ಗಳನ್ನು ಸೂಚಿಸಿ',
    settings_location_tags_desc: 'ಫೋಟೋ ಕಾರ್ಡ್‌ಗಳಲ್ಲಿ ಸ್ಥಳ, ನಗರ ಮತ್ತು ದೇಶದ ಟ್ಯಾಗ್‌ಗಳನ್ನು ತೋರಿಸಿ',
    settings_loc_place: 'ಸ್ಥಳ ಮತ್ತು ಹೆಗ್ಗುರುತು',
    settings_loc_place_desc: 'ಉದಾ. ಲಾಲ್‌ಬಾಗ್, ಕಬ್ಬನ್ ಪಾರ್ಕ್',
    settings_loc_city: 'ನಗರ ಮತ್ತು ಪಟ್ಟಣ',
    settings_loc_city_desc: 'ಉದಾ. ಬೆಂಗಳೂರು, ಮೈಸೂರು, ಪ್ಯಾರಿಸ್',
    settings_loc_country: 'ದೇಶ',
    settings_loc_country_desc: 'ಉದಾ. ಭಾರತ, ಅಮೆರಿಕ, ಫ್ರಾನ್ಸ್',
    location_suggestions_title: 'ಸೂಚಿಸಲಾದ ಸ್ಥಳದ ಟ್ಯಾಗ್‌ಗಳು',
    location_toast_added: "ಸ್ಥಳದ ಟ್ಯಾಗ್ '{tag}' ಸೇರಿಸಲಾಗಿದೆ",
    location_toast_removed: "ಸ್ಥಳದ ಟ್ಯಾಗ್ '{tag}' ತೆಗೆದುಹಾಕಲಾಗಿದೆ",
    location_type_place: 'ಸ್ಥಳ',
    location_type_city: 'ನಗರ',
    location_type_country: 'ದೇಶ'
  },
  ml: {
    settings_location_section: 'ലൊക്കേഷനും GPS ടാഗുകളും',
    settings_gps_extraction: 'ഫോട്ടോ GPS മെറ്റാഡാറ്റ വേർതിരിക്കുക',
    settings_gps_extraction_desc: 'ഇമ്പോർട്ട് ചെയ്ത ഫോട്ടോകളിൽ നിന്ന് EXIF കോർഡിനേറ്റുകൾ വായിക്കുക',
    settings_location_tags: 'ലൊക്കേഷൻ ടാഗുകൾ നിർദ്ദേശിക്കുക',
    settings_location_tags_desc: 'ഫോട്ടോ കാർഡുകളിൽ സ്ഥലം, നഗരം, രാജ്യം ടാഗുകൾ കാണിക്കുക',
    settings_loc_place: 'സ്ഥലവും ലാൻഡ്‌മാർക്കും',
    settings_loc_place_desc: 'ഉദാ: കോവളം, ഫോർട്ട് കൊച്ചി',
    settings_loc_city: 'നഗരവും പട്ടണവും',
    settings_loc_city_desc: 'ഉദാ: കൊച്ചി, തിരുവനന്തപുരം, ലണ്ടൻ',
    settings_loc_country: 'രാജ്യം',
    settings_loc_country_desc: 'ഉദാ: ഇന്ത്യ, അമേരിക്ക, ഫ്രാൻസ്',
    location_suggestions_title: 'നിർദ്ദേശിച്ച ലൊക്കേഷൻ ടാഗുകൾ',
    location_toast_added: "ലൊക്കേഷൻ ടാഗ് '{tag}' ചേർത്തു",
    location_toast_removed: "ലൊക്കേഷൻ ടാഗ് '{tag}' നീക്കംചെയ്തു",
    location_type_place: 'സ്ഥലം',
    location_type_city: 'നഗരം',
    location_type_country: 'രാജ്യം'
  },
  pa: {
    settings_location_section: 'ਟਿਕਾਣਾ ਅਤੇ GPS ਟੈਗ',
    settings_gps_extraction: 'ਫੋਟੋ GPS ਮੈਟਾਡੇਟਾ ਪ੍ਰਾਪਤ ਕਰੋ',
    settings_gps_extraction_desc: 'ਇੰਪੋਰਟ ਕੀਤੀਆਂ ਫੋਟੋਆਂ ਵਿੱਚੋਂ EXIF ਨਿਰਦੇਸ਼ਾਂਕ ਪੜ੍ਹੋ',
    settings_location_tags: 'ਟਿਕਾਣਾ ਟੈਗ ਸੁਝਾਓ',
    settings_location_tags_desc: 'ਫੋਟੋ ਕਾਰਡਾਂ ਉੱਤੇ ਸਥਾਨ, ਸ਼ਹਿਰ ਅਤੇ ਦੇਸ਼ ਦੇ ਟੈਗ ਦਿਖਾਓ',
    settings_loc_place: 'ਸਥਾਨ ਅਤੇ ਲੈਂਡਮਾਰਕ',
    settings_loc_place_desc: 'ਜਿਵੇਂ ਗੋਲਡਨ ਟੈਂਪਲ, ਰੌਕ ਗਾਰਡਨ',
    settings_loc_city: 'ਸ਼ਹਿਰ ਅਤੇ ਕਸਬਾ',
    settings_loc_city_desc: 'ਜਿਵੇਂ ਅੰਮ੍ਰਿਤਸਰ, ਚੰਡੀਗੜ੍ਹ, ਨਵੀਂ ਦਿੱਲੀ',
    settings_loc_country: 'ਦੇਸ਼',
    settings_loc_country_desc: 'ਜਿਵੇਂ ਭਾਰਤ, ਅਮਰੀਕਾ, ਕੈਨੇਡਾ',
    location_suggestions_title: 'ਸੁਝਾਏ ਗਏ ਟਿਕਾਣਾ ਟੈਗ',
    location_toast_added: "ਟਿਕਾਣਾ ਟੈਗ '{tag}' ਸ਼ਾਮਲ ਕੀਤਾ",
    location_toast_removed: "ਟਿਕਾਣਾ ਟੈਗ '{tag}' ਹਟਾਇਆ",
    location_type_place: 'ਸਥਾਨ',
    location_type_city: 'ਸ਼ਹਿਰ',
    location_type_country: 'ਦੇਸ਼'
  }
};

let i18nContent = fs.readFileSync('web/i18n.js', 'utf8');

for (const [lang, keys] of Object.entries(locationDicts)) {
  const langMarker = `\n    ${lang}: {\n`;
  const idx = i18nContent.indexOf(langMarker);
  if (idx === -1) {
    console.error('Could not find lang marker for:', lang);
    continue;
  }
  
  let injection = '';
  for (const [k, v] of Object.entries(keys)) {
    const escapedVal = v.replace(/'/g, "\\'");
    injection += `      ${k}: '${escapedVal}',\n`;
  }

  const insertPos = idx + langMarker.length;
  i18nContent = i18nContent.slice(0, insertPos) + injection + i18nContent.slice(insertPos);
}

fs.writeFileSync('web/i18n.js', i18nContent, 'utf8');
console.log('Successfully injected location i18n keys for all 10 languages!');
