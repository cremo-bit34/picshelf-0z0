const fs = require('fs');
const app = fs.readFileSync('web/app.js', 'utf8');
const kt = fs.readFileSync('app/src/main/java/com/example/MainActivity.kt', 'utf8');

console.log('convertToJpegBlob present:', app.includes('convertToJpegBlob'));
console.log('Strip extension present:', app.includes("replace(/\\.[^/.]+$/, '')"));
console.log('fileName ends in .jpg:', app.includes('const fileName = `${cleanName}.jpg`;'));
console.log('Android MainActivity MIME image/jpeg:', kt.includes('"image/jpeg"'));
console.log('Android MainActivity cleanFileName .jpg:', kt.includes('val cleanFileName = "$rawName.jpg"'));
console.log('Assets app.js identical:', fs.readFileSync('app/src/main/assets/web/app.js', 'utf8') === app);
