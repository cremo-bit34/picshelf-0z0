const fs = require('fs');
const path = require('path');

const multitagKeys = {
  en: {
    organize_multitag_title: 'Find Album with Multiple Tags',
    organize_multitag_subtitle: 'Combine 2+ tags',
    organize_multitag_placeholder: 'Select Album / Tag...',
    organize_multitag_add_btn: 'Add another tag',
    organize_multitag_match_both: '{count} {noun} have both tags',
    organize_multitag_match_all: '{count} {noun} share all {tags} tags',
    organize_multitag_select_dest: 'Select Combined Album',
    organize_multitag_selected: 'Combined Album Selected',
    organize_multitag_no_matches: '0 photos currently share all these tags',
    organize_multitag_badge: '{count} tags combined',
    organize_multitag_copy_to: "Copy to '{dest}'",
    organize_multitag_move_to: "Move to '{dest}'"
  },
  hi: {
    organize_multitag_title: 'एकाधिक टैग वाले एल्बम खोजें',
    organize_multitag_subtitle: '2+ टैग मिलाएं',
    organize_multitag_placeholder: 'एल्बम / टैग चुनें...',
    organize_multitag_add_btn: 'एक और टैग जोड़ें',
    organize_multitag_match_both: '{count} {noun} दोनों टैग साझा करते हैं',
    organize_multitag_match_all: '{count} {noun} सभी {tags} टैग साझा करते हैं',
    organize_multitag_select_dest: 'संयुक्त एल्बम चुनें',
    organize_multitag_selected: 'संयुक्त एल्बम चयनित',
    organize_multitag_no_matches: 'वर्तमान में किसी भी फोटो में ये सभी टैग नहीं हैं',
    organize_multitag_badge: '{count} टैग संयुक्त',
    organize_multitag_copy_to: "'{dest}' में कॉपी करें",
    organize_multitag_move_to: "'{dest}' में ले जाएं"
  },
  bn: {
    organize_multitag_title: 'একাধিক ট্যাগ সহ অ্যালবাম খুঁজুন',
    organize_multitag_subtitle: '২+ ট্যাগ একত্রিত করুন',
    organize_multitag_placeholder: 'অ্যালবাম / ট্যাগ নির্বাচন করুন...',
    organize_multitag_add_btn: 'আরেকটি ট্যাগ যোগ করুন',
    organize_multitag_match_both: '{count} {noun} উভয় ট্যাগ ধারণ করে',
    organize_multitag_match_all: '{count} {noun} সমস্ত {tags} ট্যাগ ধারণ করে',
    organize_multitag_select_dest: 'সম্মিলিত অ্যালবাম নির্বাচন করুন',
    organize_multitag_selected: 'সম্মিলিত অ্যালবাম নির্বাচিত',
    organize_multitag_no_matches: 'বর্তমানে কোনও ফটোতে এই সমস্ত ট্যাগ নেই',
    organize_multitag_badge: '{count}টি ট্যাগ সম্মিলিত',
    organize_multitag_copy_to: "'{dest}'-এ কপি করুন",
    organize_multitag_move_to: "'{dest}'-এ সরান"
  },
  te: {
    organize_multitag_title: 'బహుళ ట్యాగ్‌లు ఉన్న ఆల్బమ్‌ను కనుగొనండి',
    organize_multitag_subtitle: '2+ ట్యాగ్‌లను కలపండి',
    organize_multitag_placeholder: 'ఆల్బమ్ / ట్యాగ్ ఎంచుకోండి...',
    organize_multitag_add_btn: 'మరొక ట్యాగ్‌ను జోడించండి',
    organize_multitag_match_both: '{count} {noun} రెండు ట్యాగ్‌లను కలిగి ఉన్నాయి',
    organize_multitag_match_all: '{count} {noun} మొత్తం {tags} ట్యాగ్‌లను కలిగి ఉన్నాయి',
    organize_multitag_select_dest: 'కలిపిన ఆల్బమ్‌ను ఎంచుకోండి',
    organize_multitag_selected: 'కలిపిన ఆల్బమ్ ఎంపికైంది',
    organize_multitag_no_matches: 'ప్రస్తుతం ఏ ఫోటోలలోనూ ఈ ట్యాగ్‌లు లేవు',
    organize_multitag_badge: '{count} ట్యాగ్‌లు కలపబడ్డాయి',
    organize_multitag_copy_to: "'{dest}' కి కాపీ చేయండి",
    organize_multitag_move_to: "'{dest}' కి తరలించండి"
  },
  ta: {
    organize_multitag_title: 'பல குறிச்சொற்கள் உள்ள ஆல்பத்தைக் கண்டறியவும்',
    organize_multitag_subtitle: '2+ குறிச்சொற்களை இணைக்கவும்',
    organize_multitag_placeholder: 'ஆல்பம் / குறிச்சொல்லைத் தேர்ந்தெடுக்கவும்...',
    organize_multitag_add_btn: 'மற்றொரு குறிச்சொல்லைச் சேர்க்கவும்',
    organize_multitag_match_both: '{count} {noun} இரண்டு குறிச்சொற்களையும் கொண்டுள்ளன',
    organize_multitag_match_all: '{count} {noun} அனைத்து {tags} குறிச்சொற்களையும் கொண்டுள்ளன',
    organize_multitag_select_dest: 'இணைந்த ஆல்பத்தைத் தேர்ந்தெடுக்கவும்',
    organize_multitag_selected: 'இணைந்த ஆல்பம் தேர்ந்தெடுக்கப்பட்டது',
    organize_multitag_no_matches: 'தற்போது எந்தப் புகைப்படத்திலும் இந்த குறிச்சொற்கள் இல்லை',
    organize_multitag_badge: '{count} குறிச்சொற்கள் இணைக்கப்பட்டன',
    organize_multitag_copy_to: "'{dest}' க்கு நகலெடுக்கவும்",
    organize_multitag_move_to: "'{dest}' க்கு நகர்த்தவும்"
  },
  mr: {
    organize_multitag_title: 'एकाधिक टॅग असलेले अल्बम शोधा',
    organize_multitag_subtitle: '२+ टॅग एकत्र करा',
    organize_multitag_placeholder: 'अल्बम / टॅग निवडा...',
    organize_multitag_add_btn: 'आणखी एक टॅग जोडा',
    organize_multitag_match_both: '{count} {noun} दोन्ही टॅग शेअर करतात',
    organize_multitag_match_all: '{count} {noun} सर्व {tags} टॅग शेअर करतात',
    organize_multitag_select_dest: 'संयुक्त अल्बम निवडा',
    organize_multitag_selected: 'संयुक्त अल्बम निवडला',
    organize_multitag_no_matches: 'सध्या कोणत्याही फोटोमध्ये हे सर्व टॅग नाहीत',
    organize_multitag_badge: '{count} टॅग एकत्र केले',
    organize_multitag_copy_to: "'{dest}' मध्ये कॉपी करा",
    organize_multitag_move_to: "'{dest}' मध्ये हलवा"
  },
  gu: {
    organize_multitag_title: 'બહુવિધ ટૅગ્સવાળા આલ્બમ શોધો',
    organize_multitag_subtitle: '૨+ ટૅગ્સ જોડો',
    organize_multitag_placeholder: 'આલ્બમ / ટૅગ પસંદ કરો...',
    organize_multitag_add_btn: 'બીજો ટૅગ ઉમેરો',
    organize_multitag_match_both: '{count} {noun} બંને ટૅગ્સ ધરાવે છે',
    organize_multitag_match_all: '{count} {noun} બધા {tags} ટૅગ્સ ધરાવે છે',
    organize_multitag_select_dest: 'સંયુક્ત આલ્બમ પસંદ કરો',
    organize_multitag_selected: 'સંયુક્ત આલ્બમ પસંદ કરેલ છે',
    organize_multitag_no_matches: 'હાલમાં કોઈ ફોટામાં આ બધા ટૅગ્સ નથી',
    organize_multitag_badge: '{count} ટૅગ્સ સંયુક્ત',
    organize_multitag_copy_to: "'{dest}' માં કૉપિ કરો",
    organize_multitag_move_to: "'{dest}' માં ખસેડો"
  },
  kn: {
    organize_multitag_title: 'ಬಹು ಟ್ಯಾಗ್‌ಗಳಿರುವ ಆಲ್ಬಮ್ ಹುಡುಕಿ',
    organize_multitag_subtitle: '2+ ಟ್ಯಾಗ್‌ಗಳನ್ನು ಸಂಯೋಜಿಸಿ',
    organize_multitag_placeholder: 'ಆಲ್ಬಮ್ / ಟ್ಯಾಗ್ ಆಯ್ಕೆಮಾಡಿ...',
    organize_multitag_add_btn: 'ಇನ್ನೊಂದು ಟ್ಯಾಗ್ ಸೇರಿಸಿ',
    organize_multitag_match_both: '{count} {noun} ಎರಡೂ ಟ್ಯಾಗ್‌ಗಳನ್ನು ಹೊಂದಿವೆ',
    organize_multitag_match_all: '{count} {noun} ಎಲ್ಲಾ {tags} ಟ್ಯಾಗ್‌ಗಳನ್ನು ಹೊಂದಿವೆ',
    organize_multitag_select_dest: 'ಸಂಯೋಜಿತ ಆಲ್ಬಮ್ ಆಯ್ಕೆಮಾಡಿ',
    organize_multitag_selected: 'ಸಂಯೋಜಿತ ಆಲ್ಬಮ್ ಆಯ್ಕೆಯಾಗಿದೆ',
    organize_multitag_no_matches: 'ಪ್ರಸ್ತುತ ಯಾವುದೇ ಫೋಟೋಗಳು ಈ ಎಲ್ಲಾ ಟ್ಯಾಗ್‌ಗಳನ್ನು ಹೊಂದಿಲ್ಲ',
    organize_multitag_badge: '{count} ಟ್ಯಾಗ್‌ಗಳು ಸಂಯೋಜಿತಗೊಂಡಿವೆ',
    organize_multitag_copy_to: "'{dest}' ಗೆ ನಕಲಿಸಿ",
    organize_multitag_move_to: "'{dest}' ಗೆ ಸರಿಸಿ"
  },
  ml: {
    organize_multitag_title: 'ഒന്നിലധികം ടാഗുകളുള്ള ആൽബം കണ്ടെത്തുക',
    organize_multitag_subtitle: '2+ ടാഗുകൾ സംയോജിപ്പിക്കുക',
    organize_multitag_placeholder: 'ആൽബം / ടാഗ് തിരഞ്ഞെടുക്കുക...',
    organize_multitag_add_btn: 'മറ്റൊരു ടാഗ് ചേർക്കുക',
    organize_multitag_match_both: '{count} {noun} രണ്ട് ടാഗുകളും പങ്കിടുന്നു',
    organize_multitag_match_all: '{count} {noun} എല്ലാ {tags} ടാഗുകളും പങ്കിടുന്നു',
    organize_multitag_select_dest: 'സംയോജിത ആൽബം തിരഞ്ഞെടുക്കുക',
    organize_multitag_selected: 'സംയോജിത ആൽബം തിരഞ്ഞെടുത്തു',
    organize_multitag_no_matches: 'നിലവിൽ ഒരു ഫോട്ടോയിലും ഈ ടാഗുകൾ ഒന്നിച്ചില്ല',
    organize_multitag_badge: '{count} ടാഗുകൾ സംയോജിപ്പിച്ചു',
    organize_multitag_copy_to: "'{dest}' ലേക്ക് പകർത്തുക",
    organize_multitag_move_to: "'{dest}' ലേക്ക് മാറ്റുക"
  },
  pa: {
    organize_multitag_title: 'ਮਲਟੀਪਲ ਟੈਗਸ ਵਾਲੀਆਂ ਐਲਬਮਾਂ ਲੱਭੋ',
    organize_multitag_subtitle: '2+ ਟੈਗ ਜੋੜੋ',
    organize_multitag_placeholder: 'ਐਲਬਮ / ਟੈਗ ਚੁਣੋ...',
    organize_multitag_add_btn: 'ਇੱਕ ਹੋਰ ਟੈਗ ਜੋੜੋ',
    organize_multitag_match_both: '{count} {noun} ਦੋਵੇਂ ਟੈਗ ਸਾਂਝੇ ਕਰਦੇ ਹਨ',
    organize_multitag_match_all: '{count} {noun} ਸਾਰੇ {tags} ਟੈਗ ਸਾਂਝੇ ਕਰਦੇ ਹਨ',
    organize_multitag_select_dest: 'ਸੰਯੁਕਤ ਐਲਬਮ ਚੁਣੋ',
    organize_multitag_selected: 'ਸੰਯੁਕਤ ਐਲਬਮ ਚੁਣੀ ਗਈ',
    organize_multitag_no_matches: 'ਇਸ ਸਮੇਂ ਕਿਸੇ ਵੀ ਫੋਟੋ ਵਿੱਚ ਇਹ ਸਾਰੇ ਟੈਗ ਨਹੀਂ ਹਨ',
    organize_multitag_badge: '{count} ਟੈਗ ਸੰਯੁਕਤ',
    organize_multitag_copy_to: "'{dest}' ਵਿੱਚ ਕਾਪੀ ਕਰੋ",
    organize_multitag_move_to: "'{dest}' ਵਿੱਚ ਭੇਜੋ"
  }
};

function updateI18nFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  for (const lang of Object.keys(multitagKeys)) {
    // Look for lang block: e.g. en: { ... } or 'hi': { ... }
    const regex = new RegExp(`(['"]?${lang}['"]?\\s*:\\s*\\{[\\s\\S]*?)(organize_search_placeholder\\s*:[^\\n]*,)`, 'g');
    const match = regex.exec(content);
    if (match) {
      const keysObj = multitagKeys[lang];
      let injection = match[2] + '\n';
      for (const [k, v] of Object.entries(keysObj)) {
        if (!content.includes(`${k}:`)) {
          injection += `      ${k}: ${JSON.stringify(v)},\n`;
        }
      }
      content = content.replace(match[0], match[1] + injection.trimEnd());
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated i18n file at: ${filePath}`);
}

updateI18nFile(path.join(__dirname, '..', 'web', 'i18n.js'));
updateI18nFile(path.join(__dirname, '..', 'ios', 'web', 'i18n.js'));
