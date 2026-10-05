# Privacy Policy for PicShelf

**Effective Date:** October 5, 2026  
**Application Name:** PicShelf (formerly Aura Photo Organizer)  
**Package Name:** `com.aistudio.photoorganizer.xwylza`  
**Developer:** cremo-bit34  
**GitHub Repository:** [https://github.com/cremo-bit34/picshelf-0z0](https://github.com/cremo-bit34/picshelf-0z0)  
**Hosted Privacy Policy:** [https://cremo-bit34.github.io/picshelf-0z0/privacy-policy.html](https://cremo-bit34.github.io/picshelf-0z0/privacy-policy.html)  

---

## 1. Introduction & Our Core Privacy Commitment

Welcome to **PicShelf**. We take your personal privacy seriously. Unlike traditional cloud photo platforms, **PicShelf is designed with a strict "Local-First, Zero-Cloud-Tracking" architecture**. 

Your personal photos, albums, metadata, and editing history **remain 100% on your device**. We do not operate external media servers that upload, scan, or analyze your pictures.

---

## 2. Permissions Required & How They Are Used

To provide full photo organization and studio editing functionality, PicShelf requests the following Android system permissions. Each permission is used strictly for on-device features:

| Permission | Technical Name | Purpose in PicShelf |
| :--- | :--- | :--- |
| **Photos & Media** | `READ_MEDIA_IMAGES` / `READ_EXTERNAL_STORAGE` | Allows the app to index your device's photo gallery, display albums, detect duplicate images, and allow editing and organizing. |
| **Media Location** | `ACCESS_MEDIA_LOCATION` | Allows PicShelf to read embedded EXIF GPS tags so you can view photo capture locations on the interactive world map. |
| **Camera** | `CAMERA` | Allows you to capture new photos directly into specific albums within PicShelf. |
| **Precise / Coarse Location** | `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION` | When capturing photos with the in-app camera, this allows embedding GPS coordinates into the image EXIF data (can be toggled on/off in Settings). |
| **In-App Billing** | `com.android.vending.BILLING` | Enables secure Google Play Store purchases for PicShelf Pro subscriptions and lifetime access. |
| **Notifications** | `POST_NOTIFICATIONS` | Displays background progress indicators for bulk album exports and duplicate scans. |

---

## 3. Data Collection, Storage, and Processing

### A. 100% On-Device Photo Processing
- All AI subject extraction, background blurs, optical filters, compression, and duplicate detection algorithms execute **locally on your device**.
- No image data, face hashes, or photo contents are ever transmitted to any external server.

### B. Biometric & App Lock
- If you enable the in-app biometric lock or PIN, authentication is verified locally through Android's hardware security framework (`KeyStore` / `BiometricManager`). We do not store or transmit your fingerprint, face scan, or passcode.

### C. Analytics and Advertising
- PicShelf does **not** integrate third-party ad networks, behavioural tracking SDKs, or data brokers.
- We do **not** sell, rent, or monetize your personal data.

---

## 4. Payment Information (Google Play In-App Billing)

Financial transactions and subscription management for PicShelf Pro are handled exclusively by **Google Play In-App Billing** (governed by [Google Play's Terms of Service](https://play.google.com/intl/en_us/about/play-terms/)). 
- PicShelf does not collect, receive, or store your credit card, debit card, bank account, or billing address.
- All purchases can be managed, canceled, or refunded directly through your Google Play Store account settings.

---

## 5. User Rights & Data Deletion

Because all your photos and app settings exist solely on your local device:
- **Deleting Photos**: Deleting photos or albums inside PicShelf permanently removes them from the app's local database.
- **Complete Data Erasure**: You can wipe all app data and cached files at any time by going to your phone's **Settings > Apps > PicShelf > Storage > Clear Data**, or simply by uninstalling the application.

---

## 6. Children's Privacy (COPPA)

PicShelf does not knowingly collect or solicit personal information from children under the age of 13. If you believe that a child has provided us with personal data, please contact us so we can take appropriate measures.

---

## 7. Changes to This Privacy Policy

We may update our Privacy Policy periodically. Any updates will be published directly to this repository and within the application's settings menu.

---

## 8. Contact Us

If you have questions, feedback, or concerns regarding this Privacy Policy, please contact us:
- **GitHub Issues:** [https://github.com/cremo-bit34/picshelf-0z0/issues](https://github.com/cremo-bit34/picshelf-0z0/issues)
- **Repository:** [https://github.com/cremo-bit34/picshelf-0z0](https://github.com/cremo-bit34/picshelf-0z0)
