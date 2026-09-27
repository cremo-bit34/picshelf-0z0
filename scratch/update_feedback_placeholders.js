const fs = require('fs');

const filePath = 'web/i18n.js';
let content = fs.readFileSync(filePath, 'utf8');

const updates = {
  en: {
    feedback_desc_placeholder: 'Share your feedback, suggestions, or ideas to improve Aura...',
    settings_feedback_title: 'Feedback & Suggestions',
    settings_feedback_desc: 'Share your thoughts, feature ideas, or suggestions to improve Aura',
    feedback_modal_title: 'Feedback & Suggestions',
    feedback_subject_placeholder: 'Brief summary of your feedback or idea...'
  },
  hi: {
    feedback_desc_placeholder: 'ऑरा को बेहतर बनाने के लिए अपने विचार, सुझाव या अनुभव साझा करें...',
    settings_feedback_title: 'सुझाव एवं प्रतिक्रिया',
    settings_feedback_desc: 'ऑरा को और बेहतर बनाने के लिए अपने विचार, सुझाव या नए फीचर बताएं',
    feedback_modal_title: 'सुझाव एवं प्रतिक्रिया',
    feedback_subject_placeholder: 'अपने सुझाव या विचार का संक्षिप्त सारांश...'
  },
  bn: {
    feedback_desc_placeholder: 'অরা আরও ভালো করতে আপনার মতামত, পরামর্শ বা অভিজ্ঞতা জানান...',
    settings_feedback_title: 'মতামত ও পরামর্শ',
    settings_feedback_desc: 'অরা আরও উন্নত করতে আপনার মতামত, নতুন ধারণার অনুরোধ বা পরামর্শ জানান',
    feedback_modal_title: 'মতামত ও পরামর্শ',
    feedback_subject_placeholder: 'আপনার মতামত বা ধারণার সংক্ষিপ্ত বিবরণ...'
  },
  te: {
    feedback_desc_placeholder: 'ఆరా అనుభవాన్ని మరింత మెరుగుపరచడానికి మీ ఆలోచనలు లేదా సూచనలను పంచుకోండి...',
    settings_feedback_title: 'ఫీడ్‌బ్యాక్ & సూచనలు',
    settings_feedback_desc: 'ఆరాను మరింత మెరుగుపరచడానికి మీ ఆలోచనలు, కొత్త ఫీచర్లు లేదా సూచనలను పంచుకోండి',
    feedback_modal_title: 'ఫీడ్‌బ్యాక్ & సూచనలు',
    feedback_subject_placeholder: 'మీ అభిప్రాయం లేదా ఆలోచన యొక్క సంక్షిప్త సారాంశం...'
  },
  ta: {
    feedback_desc_placeholder: 'ஆராவை மேலும் சிறப்பாக்க உங்கள் கருத்துகள், ஆலோசனைகள் அல்லது புதிய யோசனைகளைப் பகிரவும்...',
    settings_feedback_title: 'கருத்துகள் & ஆலோசனைகள்',
    settings_feedback_desc: 'ஆராவை மேம்படுத்த உங்கள் எண்ணங்கள், புதிய அம்ச யோசனைகள் அல்லது ஆலோசனைகளைப் பகிரவும்',
    feedback_modal_title: 'கருத்துகள் & ஆலோசனைகள்',
    feedback_subject_placeholder: 'உங்கள் கருத்து அல்லது யோசனையின் சுருக்கம்...'
  },
  mr: {
    feedback_desc_placeholder: 'ऑरा अधिक चांगला बनवण्यासाठी आपले विचार, सूचना किंवा कल्पना शेअर करा...',
    settings_feedback_title: 'अभिप्राय आणि सूचना',
    settings_feedback_desc: 'ऑरा अधिक चांगला बनवण्यासाठी आपले विचार, नवीन वैशिष्ट्यांची कल्पना किंवा सूचना पाठवा',
    feedback_modal_title: 'अभिप्राय आणि सूचना',
    feedback_subject_placeholder: 'आपल्या अभिप्रायाचा किंवा कल्पनेचा संक्षिप्त सारांश...'
  },
  gu: {
    feedback_desc_placeholder: 'ઑરાને વધુ બહેતર બનાવવા માટે તમારા વિચારો, સૂચનો અથવા અનુભવ શેર કરો...',
    settings_feedback_title: 'પ્રતિસાદ અને સૂચનો',
    settings_feedback_desc: 'ઑરાને વધુ બહેતર બનાવવા માટે તમારા વિચારો, નવી સુવિધાઓની વિનંતી અથવા સૂચનો મોકલો',
    feedback_modal_title: 'પ્રતિસાદ અને સૂચનો',
    feedback_subject_placeholder: 'તમારા પ્રતિસાદ અથવા વિચારનો સંક્ષિપ્ત સારાંશ...'
  },
  kn: {
    feedback_desc_placeholder: 'ಆರಾವನ್ನು ಇನ್ನಷ್ಟು ಉತ್ತಮಗೊಳಿಸಲು ನಿಮ್ಮ ಅನಿಸಿಕೆಗಳು, ಸಲಹೆಗಳು ಅಥವಾ ಹೊಸ ಆಲೋಚನೆಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ...',
    settings_feedback_title: 'ಪ್ರತಿಕ್ರಿಯೆ ಮತ್ತು ಸಲಹೆಗಳು',
    settings_feedback_desc: 'ಆರಾವನ್ನು ಸುಧಾರಿಸಲು ನಿಮ್ಮ ಆಲೋಚನೆಗಳು, ವೈಶಿಷ್ಟ್ಯಗಳ ಕಲ್ಪನೆ ಅಥವಾ ಸಲಹೆಗಳನ್ನು ಕಳುಹಿಸಿ',
    feedback_modal_title: 'ಪ್ರತಿಕ್ರಿಯೆ ಮತ್ತು ಸಲಹೆಗಳು',
    feedback_subject_placeholder: 'ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ ಅಥವಾ ಕಲ್ಪನೆಯ ಸಂಕ್ಷಿಪ್ತ ಸಾರಾಂಶ...'
  },
  ml: {
    feedback_desc_placeholder: 'ഔറ കൂടുതൽ മികച്ചതാക്കാൻ നിങ്ങളുടെ ചിന്തകളും നിർദ്ദേശങ്ങളും പങ്കിടുക...',
    settings_feedback_title: 'അഭിപ്രായങ്ങളും നിർദ്ദേശങ്ങളും',
    settings_feedback_desc: 'ഔറ മെച്ചപ്പെടുത്താൻ നിങ്ങളുടെ ആശയങ്ങൾ, ഫീച്ചർ നിർദ്ദേശങ്ങൾ എന്നിവ അയയ്ക്കുക',
    feedback_modal_title: 'അഭിപ്രായങ്ങളും നിർദ്ദേശങ്ങളും',
    feedback_subject_placeholder: 'നിങ്ങളുടെ നിർദ്ദേശത്തിന്റെ അല്ലെങ്കിൽ ആശയത്തിന്റെ സംഗ്രഹം...'
  },
  pa: {
    feedback_desc_placeholder: 'ਔਰਾ ਨੂੰ ਹੋਰ ਬਿਹਤਰ ਬਣਾਉਣ ਲਈ ਆਪਣੇ ਵਿਚਾਰ, ਸੁਝਾਅ ਜਾਂ ਨਵੇਂ ਆਈਡੀਆ ਸਾਂਝੇ ਕਰੋ...',
    settings_feedback_title: 'ਫੀਡਬੈਕ ਅਤੇ ਸੁਝਾਅ',
    settings_feedback_desc: 'ਔਰਾ ਨੂੰ ਹੋਰ ਬਿਹਤਰ ਬਣਾਉਣ ਲਈ ਆਪਣੇ ਵਿਚਾਰ, ਫ਼ੀਚਰ ਆਈਡੀਆ ਜਾਂ ਸੁਝਾਅ ਭੇਜੋ',
    feedback_modal_title: 'ਫੀਡਬੈਕ ਅਤੇ ਸੁਝਾਅ',
    feedback_subject_placeholder: 'ਆਪਣੇ ਫੀਡਬੈਕ ਜਾਂ ਵਿਚਾਰ ਦਾ ਸੰਖੇਪ ਸਾਰ...'
  }
};

// Split by language sections
const langKeys = ['en', 'hi', 'bn', 'te', 'ta', 'mr', 'gu', 'kn', 'ml', 'pa'];

for (let i = 0; i < langKeys.length; i++) {
  const lang = langKeys[i];
  const nextLang = langKeys[i + 1];
  
  // Find where this language block begins and ends
  // Format in i18n.js is: `en: {` or `hi: {`
  const langStartRegex = new RegExp(`(^|\\n)\\s*${lang}:\\s*\\{`, 'm');
  const match = content.match(langStartRegex);
  if (!match) {
    console.error(`Could not find language section for '${lang}'`);
    continue;
  }
  
  const startIndex = match.index;
  let endIndex;
  if (nextLang) {
    const nextRegex = new RegExp(`(^|\\n)\\s*${nextLang}:\\s*\\{`, 'm');
    const nextMatch = content.match(nextRegex);
    endIndex = nextMatch ? nextMatch.index : content.length;
  } else {
    // For 'pa', look for the closing of TRANSLATIONS object
    const endObjRegex = /\n\s*\};\s*\n\s*\/\*\*\s*\n\s*\* Returns the localized string/;
    const endMatch = content.match(endObjRegex);
    endIndex = endMatch ? endMatch.index : content.length;
  }

  let langSection = content.substring(startIndex, endIndex);

  // Apply updates for this language
  const langUpdates = updates[lang];
  for (const [key, newVal] of Object.entries(langUpdates)) {
    const keyRegex = new RegExp(`(${key}\\s*:\\s*)(['"][^'"]*['"])`, 'g');
    if (keyRegex.test(langSection)) {
      langSection = langSection.replace(keyRegex, `$1'${newVal.replace(/'/g, "\\'")}'`);
      console.log(`Updated [${lang}] ${key}`);
    } else {
      console.warn(`Key not found in [${lang}]: ${key}`);
    }
  }

  content = content.substring(0, startIndex) + langSection + content.substring(endIndex);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Saved updated web/i18n.js');
