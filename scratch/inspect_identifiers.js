const fs = require('fs');

const html = fs.readFileSync('app/src/main/assets/web/index.html', 'utf8');
const js = fs.readFileSync('app/src/main/assets/web/app.js', 'utf8');
const kt = fs.readFileSync('app/src/main/java/com/example/MainActivity.kt', 'utf8');

console.log('Crop IDs in HTML:', html.match(/id="[^"]*crop[^"]*"/gi));
console.log('Crop functions in JS:', js.match(/function\s+[a-zA-Z0-9_]*crop[a-zA-Z0-9_]*/gi));
console.log('Passcode IDs in HTML:', html.match(/id="[^"]*passcode[^"]*"/gi));
console.log('Passcode functions in JS:', js.match(/function\s+[a-zA-Z0-9_]*passcode[a-zA-Z0-9_]*/gi));
console.log('Biometric in Kotlin:', kt.match(/fun\s+[a-zA-Z0-9_]*biometric[a-zA-Z0-9_]*/gi));
console.log('3D in JS:', js.match(/[a-zA-Z0-9_]*3d[a-zA-Z0-9_]*/gi)?.slice(0, 10));
