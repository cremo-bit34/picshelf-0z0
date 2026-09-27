const fs = require('fs');
let code = fs.readFileSync('web/i18n.js', 'utf8');

const map = [
  { after: "detail_no_tags: 'No albums or tags assigned.',", add: "\n      detail_edit_location: 'Edit Location'," },
  { after: "detail_no_tags: 'कोई एल्बम या टैग नहीं जोड़ा गया।',", add: "\n      detail_edit_location: 'स्थान संपादित करें'," },
  { after: "detail_no_tags: 'কোনো অ্যালবাম বা ট্যাগ বরাদ্দ নেই।',", add: "\n      detail_edit_location: 'অবস্থান সম্পাদনা করুন'," },
  { after: "detail_no_tags: 'ఆల్బమ్‌లు లేదా ట్యాగ్‌లు ఏవీ కేటాయించబడలేదు.',", add: "\n      detail_edit_location: 'స్థానాన్ని సవరించండి'," },
  { after: "detail_no_tags: 'ஆல்பங்கள் அல்லது குறிச்சொற்கள் எதுவும் ஒதுக்கப்படவில்லை.',", add: "\n      detail_edit_location: 'இருப்பிடத்தைத் திருத்து'," },
  { after: "detail_no_tags: 'कोणतेही अल्बम किंवा टॅग्ज जोडलेले नाहीत.',", add: "\n      detail_edit_location: 'स्थान संपादित करा'," },
  { after: "detail_no_tags: 'કોઈ આલ્બમ અથવા ટૅગ્સ અસાઇન કરેલ નથી.',", add: "\n      detail_edit_location: 'સ્થાન સંપાદિત કરો'," },
  { after: "detail_no_tags: 'ಯಾವುದೇ ಆಲ್ಬಮ್ ಅಥವಾ ಟ್ಯಾಗ್‌ಗಳನ್ನು ನಿಯೋಜಿಸಲಾಗಿಲ್ಲ.',", add: "\n      detail_edit_location: 'ಸ್ಥಳವನ್ನು ಸಂಪಾದಿಸಿ'," },
  { after: "detail_no_tags: 'ആൽബങ്ങളോ ടാഗുകളോ നൽകിയിട്ടില്ല.',", add: "\n      detail_edit_location: 'ലൊക്കേഷൻ എഡിറ്റ് ചെയ്യുക'," },
  { after: "detail_no_tags: 'ਕੋਈ ਐਲਬਮ ਜਾਂ ਟੈਗ ਨਹੀਂ ਜੋੜਿਆ ਗਿਆ।',", add: "\n      detail_edit_location: 'ਟਿਕਾਣਾ ਸੰਪਾਦਿਤ ਕਰੋ'," }
];

let count = 0;
for (const item of map) {
  if (code.includes(item.after) && !code.includes(item.add.trim())) {
    code = code.replace(item.after, item.after + item.add);
    count++;
  }
}

fs.writeFileSync('web/i18n.js', code, 'utf8');
console.log('Inserted detail_edit_location in', count, 'languages.');
