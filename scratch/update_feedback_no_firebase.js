const fs = require('fs');
const path = require('path');

const i18nPath = path.join(__dirname, '..', 'web', 'i18n.js');
let content = fs.readFileSync(i18nPath, 'utf8');

const updates = {
  en: {
    desc: "Submit bug reports, feature requests, or suggestions to improve Aura",
    btn: "Submit Feedback",
    toast: "Your feedback has been submitted successfully!"
  },
  hi: {
    desc: "ऑरा को बेहतर बनाने के लिए बग रिपोर्ट, सुझाव या नई सुविधाओं का अनुरोध भेजें",
    btn: "फ़ीडबैक भेजें",
    toast: "आपका फ़ीडबैक सफलतापूर्वक सबमिट कर दिया गया है!"
  },
  bn: {
    desc: "অরা উন্নত করতে বাগের রিপোর্ট, নতুন বৈশিষ্ট্যের অনুরোধ বা পরামর্শ পাঠান",
    btn: "মতামত পাঠান",
    toast: "আপনার মতামত সফলভাবে জমা দেওয়া হয়েছে!"
  },
  te: {
    desc: "ఆరాను మెరుగుపరచడానికి బగ్ నివేదికలు, ఫీచర్ అభ్యర్థనలు లేదా సూచనలను పంపండి",
    btn: "అభిప్రాయాన్ని సమర్పించండి",
    toast: "మీ అభిప్రాయం విజయవంతంగా సమర్పించబడింది!"
  },
  ta: {
    desc: "ஆராவை மேம்படுத்த பிழை அறிக்கைகள், அம்சக் கோரிக்கைகள் அல்லது பரிந்துரைகளை அனுப்பவும்",
    btn: "கருத்தைச் சமர்ப்பிக்கவும்",
    toast: "உங்கள் கருத்து வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!"
  },
  mr: {
    desc: "ऑरा अधिक चांगला बनवण्यासाठी बग रिपोर्ट्स, वैशिष्ट्यांची विनंती किंवा सूचना पाठवा",
    btn: "अभिप्राय पाठवा",
    toast: "तुमचा अभिप्राय यशस्वीरीत्या सबमिट केला गेला आहे!"
  },
  gu: {
    desc: "ઑરાને વધુ બહેતર બનાવવા માટે બગ રિપોર્ટ, સુવિધાઓની વિનંતી અથવા સૂચનો મોકલો",
    btn: "પ્રતિસાદ સબમિટ કરો",
    toast: "તમારો પ્રતિસાદ સફળતાપૂર્વક સબમિટ થઈ ગયો છે!"
  },
  kn: {
    desc: "ಆರಾವನ್ನು ಸುಧಾರಿಸಲು ದೋಷ ವರದಿಗಳು, ವೈಶಿಷ್ಟ್ಯ ವಿನಂತಿಗಳು ಅಥವಾ ಸಲಹೆಗಳನ್ನು ಕಳುಹಿಸಿ",
    btn: "ಪ್ರತಿಕ್ರಿಯೆ ಸಲ್ಲಿಸಿ",
    toast: "ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ!"
  },
  ml: {
    desc: "ഔറ മെച്ചപ്പെടുത്താൻ ബഗ് റിപ്പോർട്ടുകൾ, ഫീച്ചർ അഭ്യർത്ഥനകൾ അല്ലെങ്കിൽ നിർദ്ദേശങ്ങൾ അയയ്ക്കുക",
    btn: "അഭിപ്രായം സമർപ്പിക്കുക",
    toast: "നിങ്ങളുടെ അഭിപ്രായം വിജയകരമായി സമർപ്പിച്ചു!"
  },
  pa: {
    desc: "ਔਰਾ ਨੂੰ ਬਿਹਤਰ ਬਣਾਉਣ ਲਈ ਬੱਗ ਰਿਪੋਰਟਾਂ, ਫ਼ੀਚਰ ਬੇਨਤੀਆਂ ਜਾਂ ਸੁਝਾਅ ਭੇਜੋ",
    btn: "ਫੀਡਬੈਕ ਭੇਜੋ",
    toast: "ਤੁਹਾਡਾ ਫੀਡਬੈਕ ਸਫ਼ਲਤਾਪੂਰਵਕ ਸਬਮਿਟ ਹੋ ਗਿਆ ਹੈ!"
  }
};

for (const [lang, val] of Object.entries(updates)) {
  // Replace settings_feedback_desc
  const descRegex = new RegExp(`(${lang}:\\s*\\{[\\s\\S]*?settings_feedback_desc:\\s*)['"][\\s\\S]*?['"],`, 'm');
  if (descRegex.test(content)) {
    content = content.replace(descRegex, `$1'${val.desc}',`);
    console.log(`Updated settings_feedback_desc for ${lang}`);
  } else {
    console.error(`Missing settings_feedback_desc for ${lang}`);
  }

  // Replace feedback_submit_btn
  const btnRegex = new RegExp(`(${lang}:\\s*\\{[\\s\\S]*?feedback_submit_btn:\\s*)['"][\\s\\S]*?['"],`, 'm');
  if (btnRegex.test(content)) {
    content = content.replace(btnRegex, `$1'${val.btn}',`);
    console.log(`Updated feedback_submit_btn for ${lang}`);
  } else {
    console.error(`Missing feedback_submit_btn for ${lang}`);
  }

  // Replace feedback_toast_success
  const toastRegex = new RegExp(`(${lang}:\\s*\\{[\\s\\S]*?feedback_toast_success:\\s*)['"][\\s\\S]*?['"],`, 'm');
  if (toastRegex.test(content)) {
    content = content.replace(toastRegex, `$1'${val.toast}',`);
    console.log(`Updated feedback_toast_success for ${lang}`);
  } else {
    console.error(`Missing feedback_toast_success for ${lang}`);
  }
}

fs.writeFileSync(i18nPath, content, 'utf8');
console.log('Successfully updated i18n without Firebase user-facing text.');
