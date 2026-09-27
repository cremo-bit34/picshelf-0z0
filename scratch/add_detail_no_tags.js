const fs = require('fs');
let code = fs.readFileSync('web/i18n.js', 'utf8');

const map = [
  { after: "detail_assigned_albums: 'Albums & Tags',", add: "\n      detail_no_tags: 'No albums or tags assigned.'," },
  { after: "detail_assigned_albums: 'एल्बम और टैग',", add: "\n      detail_no_tags: 'कोई एल्बम या टैग नहीं जोड़ा गया।'," },
  { after: "detail_assigned_albums: 'অ্যালবাম ও ট্যাগ',", add: "\n      detail_no_tags: 'কোনো অ্যালবাম বা ট্যাগ বরাদ্দ নেই।'," },
  { after: "detail_assigned_albums: 'ఆల్బమ్‌లు & ట్యాగ్‌లు',", add: "\n      detail_no_tags: 'ఆల్బమ్‌లు లేదా ట్యాగ్‌లు ఏవీ కేటాయించబడలేదు.'," },
  { after: "detail_assigned_albums: 'ஆல்பங்கள் & குறிச்சொற்கள்',", add: "\n      detail_no_tags: 'ஆல்பங்கள் அல்லது குறிச்சொற்கள் எதுவும் ஒதுக்கப்படவில்லை.'," },
  { after: "detail_assigned_albums: 'अल्बम आणि टॅग्ज',", add: "\n      detail_no_tags: 'कोणतेही अल्बम किंवा टॅग्ज जोडलेले नाहीत.'," },
  { after: "detail_assigned_albums: 'આલ્બમ્સ અને ટૅગ્સ',", add: "\n      detail_no_tags: 'કોઈ આલ્બમ અથવા ટૅગ્સ અસાઇન કરેલ નથી.'," },
  { after: "detail_assigned_albums: 'ಆಲ್ಬಮ್‌ಗಳು ಮತ್ತು ಟ್ಯಾಗ್‌ಗಳು',", add: "\n      detail_no_tags: 'ಯಾವುದೇ ಆಲ್ಬಮ್ ಅಥವಾ ಟ್ಯಾಗ್‌ಗಳನ್ನು ನಿಯೋಜಿಸಲಾಗಿಲ್ಲ.'," },
  { after: "detail_assigned_albums: 'ആൽബങ്ങളും ടാഗുകളും',", add: "\n      detail_no_tags: 'ആൽബങ്ങളോ ടാഗുകളോ നൽകിയിട്ടില്ല.'," },
  { after: "detail_assigned_albums: 'ਐਲਬਮਾਂ ਅਤੇ ਟੈਗ',", add: "\n      detail_no_tags: 'ਕੋਈ ਐਲਬਮ ਜਾਂ ਟੈਗ ਨਹੀਂ ਜੋੜਿਆ ਗਿਆ।'," }
];

let count = 0;
for (const item of map) {
  if (code.includes(item.after) && !code.includes(item.add.trim())) {
    code = code.replace(item.after, item.after + item.add);
    count++;
  }
}

fs.writeFileSync('web/i18n.js', code, 'utf8');
console.log('Inserted detail_no_tags in', count, 'languages.');
