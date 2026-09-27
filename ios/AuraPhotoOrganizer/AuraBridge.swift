import UIKit
import WebKit
import Photos
import PhotosUI
import LocalAuthentication
import CoreMotion
import CoreLocation
import AVFoundation
import ImageIO
import UniformTypeIdentifiers

class AuraBridge: NSObject, WKScriptMessageHandler, UIImagePickerControllerDelegate, UINavigationControllerDelegate, PHPickerViewControllerDelegate, CLLocationManagerDelegate {

    weak var viewController: UIViewController?
    weak var webView: WKWebView?

    private var targetAlbumForImport: String?
    private var isGpsMetadataEnabled: Bool = true

    // Sensors
    private let motionManager = CMMotionManager()
    private var lastNativeGyroDispatchTime: TimeInterval = 0
    private var lastNativeShakeTime: TimeInterval = 0

    // Location
    private let locationManager = CLLocationManager()
    private var pendingLocationCallbackId: String?
    private var lastKnownLocation: CLLocation?

    override init() {
        super.init()
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
    }

    // MARK: - Motion Physics (60fps Gyroscope Parallax & Shake Detection)

    func startSensors() {
        guard motionManager.isDeviceMotionAvailable else { return }
        motionManager.deviceMotionUpdateInterval = 1.0 / 60.0 // 60 FPS

        motionManager.startDeviceMotionUpdates(to: .main) { [weak self] (motion, error) in
            guard let self = self, let motion = motion, error == nil else { return }
            let now = CACurrentMediaTime()

            // 1. Gyroscope orientation (Pitch & Roll in degrees, throttled to 16ms)
            if now - self.lastNativeGyroDispatchTime >= 0.016 {
                self.lastNativeGyroDispatchTime = now
                let pitchDeg = motion.attitude.pitch * (180.0 / .pi)
                let rollDeg = motion.attitude.roll * (180.0 / .pi)
                let js = String(
                    format: "window.Aura3DMotionPhysics && window.Aura3DMotionPhysics.onNativeOrientation && window.Aura3DMotionPhysics.onNativeOrientation(%.2f, %.2f);",
                    pitchDeg,
                    rollDeg
                )
                self.webView?.evaluateJavaScript(js, completionHandler: nil)
            }

            // 2. Shake detection via user acceleration
            let userAccel = motion.userAcceleration
            let magnitude = sqrt(userAccel.x * userAccel.x + userAccel.y * userAccel.y + userAccel.z * userAccel.z)
            if magnitude > 1.6 && now - self.lastNativeShakeTime > 0.8 {
                self.lastNativeShakeTime = now
                // Trigger Taptic Engine
                let generator = UIImpactFeedbackGenerator(style: .medium)
                generator.prepare()
                generator.impactOccurred()

                let jsShake = "window.Aura3DMotionPhysics && window.Aura3DMotionPhysics.triggerShakeWave && window.Aura3DMotionPhysics.triggerShakeWave();"
                self.webView?.evaluateJavaScript(jsShake, completionHandler: nil)
            }
        }
    }

    func stopSensors() {
        motionManager.stopDeviceMotionUpdates()
    }

    // MARK: - WKScriptMessageHandler

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard message.name == "auraBridge",
              let body = message.body as? [String: Any],
              let action = body["action"] as? String else {
            return
        }

        switch action {
        case "openCamera":
            openCamera()

        case "openGallery":
            targetAlbumForImport = nil
            openGallery()

        case "openGalleryForAlbum":
            targetAlbumForImport = body["album"] as? String
            openGallery()

        case "authenticateBiometrics":
            authenticateBiometrics()

        case "sharePhoto":
            if let dataUrl = body["dataUrl"] as? String {
                let title = body["title"] as? String ?? "Photo"
                sharePhoto(dataUrl: dataUrl, title: title)
            }

        case "shareMultiplePhotos":
            if let photos = body["photos"] as? String {
                let title = body["title"] as? String ?? "Photos"
                shareMultiplePhotos(photosJson: photos, albumTitle: title)
            }

        case "downloadPhoto":
            if let dataUrl = body["dataUrl"] as? String,
               let name = body["name"] as? String {
                downloadPhoto(dataUrl: dataUrl, fileName: name)
            }

        case "downloadZip":
            if let dataUrl = body["dataUrl"] as? String,
               let name = body["name"] as? String {
                downloadZip(base64ZipData: dataUrl, zipFileName: name)
            }

        case "getCurrentLocation":
            let callbackId = body["callbackId"] as? String ?? ""
            getCurrentLocation(callbackId: callbackId)

        case "setGpsMetadataEnabled":
            if let enabled = body["enabled"] as? Bool {
                isGpsMetadataEnabled = enabled
            }

        case "haptic":
            let type = body["type"] as? String ?? "light"
            triggerHaptic(type: type)

        default:
            break
        }
    }

    // MARK: - Camera

    private func openCamera() {
        guard UIImagePickerController.isSourceTypeAvailable(.camera) else {
            showAlert(title: "Camera Unavailable", message: "Camera is not available on this device or simulator.")
            return
        }

        AVCaptureDevice.requestAccess(for: .video) { [weak self] granted in
            DispatchQueue.main.async {
                guard let self = self else { return }
                if granted {
                    let picker = UIImagePickerController()
                    picker.sourceType = .camera
                    picker.delegate = self
                    picker.allowsEditing = false
                    self.viewController?.present(picker, animated: true)
                } else {
                    self.showAlert(title: "Camera Access Required", message: "Please enable Camera access in iOS Settings > Aura Photos to capture photos.")
                }
            }
        }
    }

    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
        picker.dismiss(animated: true)

        guard let image = info[.originalImage] as? UIImage else { return }

        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }
            let base64 = self.imageToBase64(image: image, maxDimension: 1600)
            var locJson = "null"

            if self.isGpsMetadataEnabled, let loc = self.lastKnownLocation {
                let lat = loc.coordinate.latitude
                let lon = loc.coordinate.longitude
                let displayCoords = String(
                    format: "%.4f° %@, %.4f° %@",
                    abs(lat), lat >= 0 ? "N" : "S",
                    abs(lon), lon >= 0 ? "E" : "W"
                )
                locJson = "{\"latitude\": \(lat), \"longitude\": \(lon), \"displayCoords\": \"\(displayCoords)\", \"place\": \"\", \"city\": \"\", \"country\": \"\"}"
            }

            DispatchQueue.main.async {
                if let base64 = base64 {
                    let escaped = base64.replacingOccurrences(of: "'", with: "\\'")
                    let js = "if (window.onNativePhotoCaptured) { window.onNativePhotoCaptured('\(escaped)', 'Camera Shot', \(locJson)); }"
                    self.webView?.evaluateJavaScript(js, completionHandler: nil)
                }
            }
        }
    }

    func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
        picker.dismiss(animated: true)
    }

    // MARK: - Modern Photo Gallery (PHPicker with Multi-Select)

    private func openGallery() {
        var config = PHPickerConfiguration(photoLibrary: .shared())
        config.selectionLimit = 0 // 0 = unlimited selection!
        config.filter = .images

        let picker = PHPickerViewController(configuration: config)
        picker.delegate = self
        viewController?.present(picker, animated: true)
    }

    func picker(_ picker: PHPickerViewController, didFinishPicking results: [PHPickerResult]) {
        picker.dismiss(animated: true)
        guard !results.isEmpty else { return }

        let dispatchGroup = DispatchGroup()
        var importedPhotos: [[String: Any]] = []
        let lock = NSLock()

        for result in results {
            let provider = result.itemProvider
            if provider.canLoadObject(ofClass: UIImage.self) {
                dispatchGroup.enter()

                provider.loadDataRepresentation(forTypeIdentifier: UTType.image.identifier) { [weak self] data, error in
                    defer { dispatchGroup.leave() }
                    guard let self = self, let data = data, let image = UIImage(data: data) else { return }

                    var metadataDict: [String: Any]? = nil
                    var dateTakenMs: Double? = nil
                    var cameraModel: String? = nil

                    if let source = CGImageSourceCreateWithData(data as CFData, nil) {
                        if let props = CGImageSourceCopyPropertiesAtIndex(source, 0, nil) as? [CFString: Any] {
                            // EXIF
                            if let exif = props[kCGImagePropertyExifDictionary] as? [CFString: Any] {
                                if let dateStr = exif[kCGImagePropertyExifDateTimeOriginal] as? String {
                                    let formatter = DateFormatter()
                                    formatter.dateFormat = "yyyy:MM:dd HH:mm:ss"
                                    if let date = formatter.date(from: dateStr) {
                                        dateTakenMs = date.timeIntervalSince1970 * 1000
                                    }
                                }
                            }
                            // TIFF (Camera make/model)
                            if let tiff = props[kCGImagePropertyTIFFDictionary] as? [CFString: Any] {
                                let make = tiff[kCGImagePropertyTIFFMake] as? String ?? ""
                                let model = tiff[kCGImagePropertyTIFFModel] as? String ?? ""
                                if !model.isEmpty {
                                    cameraModel = (!make.isEmpty && !model.lowercased().hasPrefix(make.lowercased())) ? "\(make) \(model)" : model
                                }
                            }
                            // GPS
                            if self.isGpsMetadataEnabled, let gps = props[kCGImagePropertyGPSDictionary] as? [CFString: Any] {
                                if let latVal = gps[kCGImagePropertyGPSLatitude] as? Double,
                                   let latRef = gps[kCGImagePropertyGPSLatitudeRef] as? String,
                                   let lonVal = gps[kCGImagePropertyGPSLongitude] as? Double,
                                   let lonRef = gps[kCGImagePropertyGPSLongitudeRef] as? String {
                                    let lat = (latRef.uppercased() == "S") ? -latVal : latVal
                                    let lon = (lonRef.uppercased() == "W") ? -lonVal : lonVal
                                    let displayCoords = String(
                                        format: "%.4f° %@, %.4f° %@",
                                        abs(lat), lat >= 0 ? "N" : "S",
                                        abs(lon), lon >= 0 ? "E" : "W"
                                    )
                                    metadataDict = [
                                        "latitude": lat,
                                        "longitude": lon,
                                        "displayCoords": displayCoords,
                                        "place": "",
                                        "city": "",
                                        "country": ""
                                    ]
                                }
                            }
                        }
                    }

                    if let base64 = self.imageToBase64(image: image, maxDimension: 1600) {
                        var photoObj: [String: Any] = [
                            "displayName": provider.suggestedName ?? "Moment_\(Int(Date().timeIntervalSince1970 * 1000))",
                            "dataUrl": base64
                        ]
                        if let meta = metadataDict { photoObj["location"] = meta }
                        if let model = cameraModel { photoObj["cameraModel"] = model }
                        if let d = dateTakenMs { photoObj["createdAt"] = d }

                        lock.lock()
                        importedPhotos.append(photoObj)
                        lock.unlock()
                    }
                }
            }
        }

        dispatchGroup.notify(queue: .main) { [weak self] in
            guard let self = self, !importedPhotos.isEmpty else { return }
            do {
                let jsonData = try JSONSerialization.data(withJSONObject: importedPhotos, options: [])
                if let jsonString = String(data: jsonData, encoding: .utf8) {
                    if let targetAlbum = self.targetAlbumForImport, !targetAlbum.isEmpty {
                        self.targetAlbumForImport = nil
                        let escapedAlbum = targetAlbum.replacingOccurrences(of: "\"", with: "\\\"")
                        let js = "if (window.onNativePhotosImportedToAlbum) { window.onNativePhotosImportedToAlbum(\(jsonString), \"\(escapedAlbum)\"); } else if (window.onNativePhotosImported) { window.onNativePhotosImported(\(jsonString)); }"
                        self.webView?.evaluateJavaScript(js, completionHandler: nil)
                    } else {
                        let js = "if (window.onNativePhotosImported) { window.onNativePhotosImported(\(jsonString)); }"
                        self.webView?.evaluateJavaScript(js, completionHandler: nil)
                    }
                }
            } catch {
                print("Error serializing imported photos: \(error)")
            }
        }
    }

    // MARK: - Biometrics (Face ID / Touch ID / Passcode)

    private func authenticateBiometrics() {
        let context = LAContext()
        context.localizedCancelTitle = "Cancel"
        var error: NSError?

        let reason = "Unlock Aura Vault to access your protected memories"

        if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
            context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: reason) { [weak self] success, evalError in
                DispatchQueue.main.async {
                    if success {
                        self?.webView?.evaluateJavaScript("if (window.onNativeBiometricResult) { window.onNativeBiometricResult(true); }", completionHandler: nil)
                    } else {
                        let errMsg = evalError?.localizedDescription ?? "Authentication failed"
                        let escaped = errMsg.replacingOccurrences(of: "'", with: "\\'")
                        self?.webView?.evaluateJavaScript("if (window.onNativeBiometricResult) { window.onNativeBiometricResult(false, '\(escaped)'); }", completionHandler: nil)
                    }
                }
            }
        } else if context.canEvaluatePolicy(.deviceOwnerAuthentication, error: &error) {
            // Fallback to iPhone Device Passcode
            context.evaluatePolicy(.deviceOwnerAuthentication, localizedReason: reason) { [weak self] success, evalError in
                DispatchQueue.main.async {
                    if success {
                        self?.webView?.evaluateJavaScript("if (window.onNativeBiometricResult) { window.onNativeBiometricResult(true); }", completionHandler: nil)
                    } else {
                        let errMsg = evalError?.localizedDescription ?? "Authentication failed"
                        let escaped = errMsg.replacingOccurrences(of: "'", with: "\\'")
                        self?.webView?.evaluateJavaScript("if (window.onNativeBiometricResult) { window.onNativeBiometricResult(false, '\(escaped)'); }", completionHandler: nil)
                    }
                }
            }
        } else {
            // No biometric or passcode configured
            webView?.evaluateJavaScript("if (window.onNativeBiometricResult) { window.onNativeBiometricResult(false, 'no_device_lock'); }", completionHandler: nil)
        }
    }

    // MARK: - Native Sharing (AirDrop, Messages, WhatsApp, Mail, Copy)

    private func sharePhoto(dataUrl: String, title: String) {
        guard let image = base64ToImage(dataUrl: dataUrl) else { return }
        let activityVC = UIActivityViewController(activityItems: [image, title], applicationActivities: nil)
        if let popover = activityVC.popoverPresentationController {
            popover.sourceView = viewController?.view
            popover.sourceRect = CGRect(x: UIScreen.main.bounds.midX, y: UIScreen.main.bounds.midY, width: 0, height: 0)
            popover.permittedArrowDirections = []
        }
        viewController?.present(activityVC, animated: true)
    }

    private func shareMultiplePhotos(photosJson: String, albumTitle: String) {
        guard let data = photosJson.data(using: .utf8),
              let jsonArray = try? JSONSerialization.jsonObject(with: data) as? [[String: Any]] else {
            return
        }

        var items: [Any] = [albumTitle]
        for item in jsonArray {
            if let dataUrl = item["dataUrl"] as? String, let img = base64ToImage(dataUrl: dataUrl) {
                items.append(img)
            }
        }

        guard items.count > 1 else { return }

        let activityVC = UIActivityViewController(activityItems: items, applicationActivities: nil)
        if let popover = activityVC.popoverPresentationController {
            popover.sourceView = viewController?.view
            popover.sourceRect = CGRect(x: UIScreen.main.bounds.midX, y: UIScreen.main.bounds.midY, width: 0, height: 0)
            popover.permittedArrowDirections = []
        }
        viewController?.present(activityVC, animated: true)
    }

    // MARK: - Save Photo to Apple Photos Library

    private func downloadPhoto(dataUrl: String, fileName: String) {
        guard let image = base64ToImage(dataUrl: dataUrl) else { return }

        PHPhotoLibrary.requestAuthorization(for: .addOnly) { [weak self] status in
            DispatchQueue.main.async {
                guard let self = self else { return }
                if status == .authorized || status == .limited {
                    PHPhotoLibrary.shared().performChanges({
                        PHAssetChangeRequest.creationRequestForAsset(from: image)
                    }) { success, error in
                        DispatchQueue.main.async {
                            if success {
                                let gen = UINotificationFeedbackGenerator()
                                gen.notificationOccurred(.success)
                                self.showAlert(title: "Saved to Photos", message: "Photo was successfully saved to your Apple Photos library!")
                            } else {
                                self.showAlert(title: "Save Failed", message: error?.localizedDescription ?? "Could not save photo.")
                            }
                        }
                    }
                } else {
                    self.showAlert(title: "Photos Access Required", message: "Please enable Photos permission in iOS Settings to save photos directly to your camera roll.")
                }
            }
        }
    }

    // MARK: - Save / Export ZIP Archive

    private func downloadZip(base64ZipData: String, zipFileName: String) {
        let cleanBase64 = base64ZipData.contains("base64,") ?
            String(base64ZipData.split(separator: ",")[1]) : base64ZipData

        guard let zipData = Data(base64Encoded: cleanBase64, options: .ignoreUnknownCharacters) else { return }

        let tempDir = FileManager.default.temporaryDirectory
        let safeName = zipFileName.replacingOccurrences(of: "/", with: "_")
        let fileURL = tempDir.appendingPathComponent(safeName)

        do {
            try zipData.write(to: fileURL)
            let activityVC = UIActivityViewController(activityItems: [fileURL], applicationActivities: nil)
            if let popover = activityVC.popoverPresentationController {
                popover.sourceView = viewController?.view
                popover.sourceRect = CGRect(x: UIScreen.main.bounds.midX, y: UIScreen.main.bounds.midY, width: 0, height: 0)
                popover.permittedArrowDirections = []
            }
            viewController?.present(activityVC, animated: true)
        } catch {
            showAlert(title: "ZIP Export Error", message: error.localizedDescription)
        }
    }

    // MARK: - Location

    private func getCurrentLocation(callbackId: String) {
        pendingLocationCallbackId = callbackId
        locationManager.requestWhenInUseAuthorization()
        locationManager.startUpdatingLocation()
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let loc = locations.last else { return }
        lastKnownLocation = loc
        locationManager.stopUpdatingLocation()

        guard let callbackId = pendingLocationCallbackId else { return }
        pendingLocationCallbackId = nil

        let lat = loc.coordinate.latitude
        let lon = loc.coordinate.longitude
        let geocoder = CLGeocoder()

        geocoder.reverseGeocodeLocation(loc) { [weak self] placemarks, _ in
            guard let self = self else { return }
            var place = ""
            var city = ""
            var country = ""

            if let p = placemarks?.first {
                place = p.subLocality ?? p.name ?? ""
                city = p.locality ?? p.administrativeArea ?? ""
                country = p.country ?? ""
            }

            let displayCoords = String(
                format: "%.4f° %@, %.4f° %@",
                abs(lat), lat >= 0 ? "N" : "S",
                abs(lon), lon >= 0 ? "E" : "W"
            )

            let locObj: [String: Any] = [
                "latitude": lat,
                "longitude": lon,
                "displayCoords": displayCoords,
                "place": place,
                "city": city,
                "country": country
            ]

            if let data = try? JSONSerialization.data(withJSONObject: locObj),
               let jsonStr = String(data: data, encoding: .utf8) {
                let js = "if (window.onNativeLocationReceived) { window.onNativeLocationReceived('\(callbackId)', \(jsonStr)); }"
                self.webView?.evaluateJavaScript(js, completionHandler: nil)
            }
        }
    }

    // MARK: - Helpers

    private func triggerHaptic(type: String) {
        switch type {
        case "heavy":
            UIImpactFeedbackGenerator(style: .heavy).impactOccurred()
        case "medium":
            UIImpactFeedbackGenerator(style: .medium).impactOccurred()
        case "success":
            UINotificationFeedbackGenerator().notificationOccurred(.success)
        case "error":
            UINotificationFeedbackGenerator().notificationOccurred(.error)
        default:
            UIImpactFeedbackGenerator(style: .light).impactOccurred()
        }
    }

    private func showAlert(title: String, message: String) {
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        viewController?.present(alert, animated: true)
    }

    private func imageToBase64(image: UIImage, maxDimension: CGFloat) -> String? {
        var targetImage = image
        let size = image.size
        let maxSide = max(size.width, size.height)

        if maxSide > maxDimension {
            let scale = maxDimension / maxSide
            let newSize = CGSize(width: size.width * scale, height: size.height * scale)
            let renderer = UIGraphicsImageRenderer(size: newSize)
            targetImage = renderer.image { _ in
                image.draw(in: CGRect(origin: .zero, size: newSize))
            }
        }

        guard let data = targetImage.jpegData(compressionQuality: 0.85) else { return nil }
        return "data:image/jpeg;base64," + data.base64EncodedString()
    }

    private func base64ToImage(dataUrl: String) -> UIImage? {
        let clean = dataUrl.contains("base64,") ?
            String(dataUrl.split(separator: ",")[1]) : dataUrl
        guard let data = Data(base64Encoded: clean, options: .ignoreUnknownCharacters) else { return nil }
        return UIImage(data: data)
    }
}
