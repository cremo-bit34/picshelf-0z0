# Aura Photo Organizer — iOS (iPhone & iPad)

This folder contains the complete native iOS project for **Aura Photo Organizer** ("Aura Photos"), built in **Swift** with **WebKit**, **PhotosUI**, **LocalAuthentication (Face ID / Touch ID)**, **CoreMotion (60fps Gyroscope 3D Tilt & Shake)**, and native Apple sharing sheets.

---

## Architecture & Native Features

| Native Feature | Implementation Details |
|---|---|
| **Multi-Photo Gallery Import** | Native `PHPickerViewController` (iOS 14+) with unlimited multi-selection, automatic EXIF extraction, camera make/model detection, and GPS geocoding. |
| **Instant Camera Capture** | `UIImagePickerController` with camera authorization flow and automatic orientation / base64 image optimization. |
| **Biometric Vault Lock** | `LocalAuthentication` framework supporting **Face ID**, **Touch ID**, and automatic fallback to iPhone device passcode. |
| **3D Gyroscope & Shake Physics** | `CoreMotion` (`CMMotionManager`) polling at **60 FPS (16ms)** providing real-time pitch & roll angles to `window.Aura3DMotionPhysics`, plus physical accelerometer shake detection with Apple Taptic Engine feedback. |
| **Native Sharing & AirDrop** | `UIActivityViewController` supporting AirDrop, Messages, WhatsApp, Mail, Instagram, Copy, and multi-photo batch sharing. |
| **Save Photos to Camera Roll** | `PHPhotoLibrary` saving photos directly into the iPhone's system Photos app with success haptics. |
| **Save ZIP Archives** | Export archives directly to iOS Files app (iCloud Drive / On My iPhone). |
| **Notch & Dynamic Island** | Safe area handling with `viewport-fit=cover` and CSS `env(safe-area-inset-top)` / `env(safe-area-inset-bottom)`. |

---

## How to Build & Install on iPhone

You have **3 convenient ways** to build and run this app:

---

### Option 1: Build on Windows via GitHub Actions (No Mac Required)

This repository includes an automated GitHub Actions workflow (`.github/workflows/ios-build.yml`) that compiles the native iOS `.ipa` in the cloud on Apple Silicon macOS runners for free.

1. **Initialize Git & Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit with iOS and Android apps"
   git branch -M main
   git remote add origin https://github.com/<your-username>/photoorganizer.git
   git push -u origin main
   ```
2. **Download the Compiled `.ipa`**:
   - Go to your repository on GitHub in your browser.
   - Click the **Actions** tab.
   - Select **"Build iOS App (.IPA)"** and click **Run workflow** (or wait for the automatic push build to finish).
   - Under **Artifacts**, download `AuraPhotoOrganizer-iOS-IPA` (contains `AuraPhotoOrganizer.ipa`).

3. **Install the `.ipa` onto your iPhone from Windows**:
   - **Recommended tool: Sideloadly** (Free on Windows, [sideloadly.io](https://sideloadly.io)):
     1. Download and install Sideloadly on your Windows PC.
     2. Connect your iPhone to your PC with a USB cable (tap "Trust this computer" if prompted).
     3. Drag and drop `AuraPhotoOrganizer.ipa` into Sideloadly.
     4. Enter your regular Apple ID email (used for free on-device developer signing).
     5. Click **Start**. The app installs directly onto your iPhone home screen!
     6. On your iPhone: Go to **Settings > General > VPN & Device Management**, tap your Apple ID, and tap **Trust**.
   - **Alternative tools**: AltStore, SideStore, TrollStore, or Scarlet.

---

### Option 2: Build with Xcode on a Mac

If you have a Mac:

1. Open `ios/AuraPhotoOrganizer.xcodeproj` in **Xcode**.
2. Connect your iPhone via USB / Wi-Fi (or choose an iOS Simulator).
3. In Xcode, click the top project node `AuraPhotoOrganizer` > **Signing & Capabilities**.
4. Check **"Automatically manage signing"** and select your Personal Apple ID Team.
5. Press **`Cmd + R`** (Run). The app compiles, installs, and launches on your iPhone!

---

### Option 3: Instant iPhone Safari Web Clip / PWA (Zero Setup)

If you want to test immediately on your iPhone right now without any installation tools:

1. On your PC, start the local server:
   ```bash
   node server.js
   ```
2. Find your PC's local IP address (e.g. `192.168.1.5` via `ipconfig`).
3. On your iPhone connected to the same Wi-Fi, open Safari and go to:
   ```text
   http://<your-pc-ip>:3000
   ```
4. In Safari, tap the **Share** button (box with upward arrow) > scroll down and tap **"Add to Home Screen"** > tap **Add**.
5. Launch the **Aura Photos** icon from your iPhone home screen — it runs in full-screen standalone app mode without Safari browser chrome!

---

## Project Structure

```text
ios/
├── AuraPhotoOrganizer.xcodeproj/
│   └── project.pbxproj            # Xcode project configuration & build settings
├── AuraPhotoOrganizer/
│   ├── Info.plist                  # Privacy permissions (Camera, Photos, FaceID, Gyro, Location)
│   ├── AppDelegate.swift           # Application lifecycle
│   ├── SceneDelegate.swift         # Window & security lock state triggers
│   ├── ViewController.swift        # WKWebView setup, safe area, and JS bridge injection
│   ├── AuraBridge.swift            # Native bridge: PHPicker, Camera, FaceID, CoreMotion, Share Sheet
│   ├── Base.lproj/
│   │   └── LaunchScreen.storyboard # Obsidian dark & gold splash screen
│   └── Assets.xcassets/            # AppIcon (1024x1024) & Accent colors
└── web/                            # Bundled local web assets (HTML, CSS, JS, fonts, icons)
```
