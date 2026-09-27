import UIKit
import WebKit

class ViewController: UIViewController, WKNavigationDelegate, WKUIDelegate {

    private var webView: WKWebView!
    private let bridge = AuraBridge()

    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }

    override var prefersStatusBarHidden: Bool {
        return false
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(red: 10/255, green: 11/255, blue: 14/255, alpha: 1)

        setupWebView()
        loadLocalApp()
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        bridge.startSensors()
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        bridge.stopSensors()
    }

    func notifyAppActive() {
        bridge.startSensors()
        // If app lock was enabled, make sure lock screen is presented
        webView?.evaluateJavaScript(
            "if (window.state && window.state.biometricLock && window.state.isAppLocked) { if (window.showAppLock) window.showAppLock(); }",
            completionHandler: nil
        )
    }

    func notifyAppInactive() {
        bridge.stopSensors()
        // Lock the app when minimized or sent to background if biometric lock is on
        webView?.evaluateJavaScript(
            "if (window.state && window.state.biometricLock) { window.state.isAppLocked = true; if (window.showAppLock) window.showAppLock(); }",
            completionHandler: nil
        )
    }

    // MARK: - Setup WebView

    private func setupWebView() {
        let contentController = WKUserContentController()

        // 1. Add native bridge message handler
        bridge.viewController = self
        contentController.add(bridge, name: "auraBridge")

        // 2. Inject compatibility shim for AndroidApp & iOS native bridge
        let bridgeShimScript = """
        (function() {
            window.isNativeIOS = true;

            const send = function(action, payload) {
                if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.auraBridge) {
                    window.webkit.messageHandlers.auraBridge.postMessage(Object.assign({ action: action }, payload || {}));
                }
            };

            const nativeBridge = {
                openCamera: function() { send('openCamera'); },
                openGallery: function() { send('openGallery'); },
                openGalleryForAlbum: function(album) { send('openGalleryForAlbum', { album: album }); },
                authenticateBiometrics: function() { send('authenticateBiometrics'); },
                getCurrentLocation: function(callbackId) { send('getCurrentLocation', { callbackId: callbackId }); },
                sharePhoto: function(dataUrl, title) { send('sharePhoto', { dataUrl: dataUrl, title: title }); },
                shareMultiplePhotos: function(photosJson, title) { send('shareMultiplePhotos', { photos: photosJson, title: title }); },
                downloadPhoto: function(dataUrl, name) { send('downloadPhoto', { dataUrl: dataUrl, name: name }); },
                downloadZip: function(dataUrl, name) { send('downloadZip', { dataUrl: dataUrl, name: name }); },
                setGpsMetadataEnabled: function(enabled) { send('setGpsMetadataEnabled', { enabled: !!enabled }); },
                setPushUpdatesEnabled: function(enabled) {
                    try { localStorage.setItem('ios_push_enabled', enabled ? 'true' : 'false'); } catch(_) {}
                },
                isPushUpdatesEnabled: function() {
                    try { return localStorage.getItem('ios_push_enabled') !== 'false'; } catch(_) { return true; }
                },
                submitFeedbackToFirebase: function(feedbackJson) {
                    // Cache and dispatch
                    try {
                        fetch('https://aura-photo-organizer-dummy-default-rtdb.firebaseio.com/feedback.json', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: feedbackJson
                        }).catch(function() {});
                    } catch(_) {}
                },
                isNative: function() { return true; }
            };

            // Mirror on both AndroidApp and iOSApp so web/app.js runs directly with 0 modifications!
            window.AndroidApp = nativeBridge;
            window.iOSApp = nativeBridge;

            // Ensure native styling is applied
            document.documentElement.classList.add('native-app-mode');
            document.addEventListener('DOMContentLoaded', function() {
                document.documentElement.classList.add('native-app-mode');
                document.body.classList.add('native-app-mode');
            });
        })();
        """

        let userScript = WKUserScript(
            source: bridgeShimScript,
            injectionTime: .atDocumentStart,
            forMainFrameOnly: true
        )
        contentController.addUserScript(userScript)

        let config = WKWebViewConfiguration()
        config.userContentController = contentController
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []
        config.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")

        webView = WKWebView(frame: .zero, configuration: config)
        bridge.webView = webView
        webView.navigationDelegate = self
        webView.uiDelegate = self

        webView.isOpaque = false
        webView.backgroundColor = UIColor(red: 10/255, green: 11/255, blue: 14/255, alpha: 1)
        webView.scrollView.backgroundColor = UIColor(red: 10/255, green: 11/255, blue: 14/255, alpha: 1)
        webView.scrollView.bounces = false
        webView.scrollView.contentInsetAdjustmentBehavior = .never

        view.addSubview(webView)
        webView.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            webView.topAnchor.constraint(equalTo: view.topAnchor),
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
    }

    // MARK: - Load Local Web Bundle

    private func loadLocalApp() {
        // Try finding web/index.html inside the main bundle
        if let webURL = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "web") {
            let webDir = webURL.deletingLastPathComponent()
            webView.loadFileURL(webURL, allowingReadAccessTo: webDir)
        } else if let fallbackURL = Bundle.main.url(forResource: "index", withExtension: "html") {
            let baseDir = fallbackURL.deletingLastPathComponent()
            webView.loadFileURL(fallbackURL, allowingReadAccessTo: baseDir)
        } else {
            // Development fallback or error message
            let errHtml = """
            <html>
            <body style='background:#0a0b0e;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;padding:24px;text-align:center;'>
                <div>
                    <h2 style='color:#f2cd61;'>Aura Photos</h2>
                    <p style='color:#a0a6b0;'>Bundle assets loaded. If web directory is missing, please ensure 'web' folder is added to Copy Bundle Resources in Xcode.</p>
                </div>
            </body>
            </html>
            """
            webView.loadHTMLString(errHtml, baseURL: nil)
        }
    }

    // MARK: - WKNavigationDelegate

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        let safeTop = Int(view.safeAreaInsets.top > 0 ? view.safeAreaInsets.top : 47)
        let injectCss = """
        document.documentElement.classList.add('native-app-mode');
        document.body.classList.add('native-app-mode');
        document.documentElement.style.setProperty('--android-status-bar-height', '\(safeTop)px');
        """
        webView.evaluateJavaScript(injectCss, completionHandler: nil)
    }

    // MARK: - WKUIDelegate (Native Alert & Confirm Support)

    func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
        let alert = UIAlertController(title: "Aura Photos", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { _ in completionHandler() }))
        present(alert, animated: true)
    }

    func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
        let alert = UIAlertController(title: "Aura Photos", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: { _ in completionHandler(false) }))
        alert.addAction(UIAlertAction(title: "Confirm", style: .default, handler: { _ in completionHandler(true) }))
        present(alert, animated: true)
    }
}
