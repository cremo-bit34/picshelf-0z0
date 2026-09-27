const fs = require('fs');
const html = fs.readFileSync('web/index.html', 'utf8');
const css = fs.readFileSync('web/style.css', 'utf8');
const js = fs.readFileSync('web/app.js', 'utf8');
const kt = fs.readFileSync('app/src/main/java/com/example/MainActivity.kt', 'utf8');

console.log('1. passcodeSetupModal in index.html:', html.includes('id="passcodeSetupModal"'));
console.log('2. forgotPasscodeModal in index.html:', html.includes('id="forgotPasscodeModal"'));
console.log('3. card-return-flash in style.css:', css.includes('.photo-card-elegant.card-return-flash') && css.includes('cardReturnAuraPulse') && css.includes('cardReturnOverlayFlash'));
console.log('4. flashReturnedPhotoCard called in closePhotoDetail:', js.includes('flashReturnedPhotoCard(returningPhotoId)'));
console.log('5. openPasscodeSetupScreen implemented:', js.includes('function openPasscodeSetupScreen'));
console.log('6. No default 1234 in toggleBiometricLock:', !js.includes('Vault PIN is set to 1234 by default'));
console.log('7. handleNativeBackPressed exported:', js.includes('window.handleNativeBackPressed = function'));
console.log('8. authenticateBiometrics in MainActivity.kt:', kt.includes('fun authenticateBiometrics()'));
console.log('9. handleNativeBackPressed in MainActivity.kt:', kt.includes('handleNativeBackPressed'));
