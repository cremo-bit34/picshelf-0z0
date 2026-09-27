import UIKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    var window: UIWindow?

    func scene(
        _ scene: UIScene,
        willConnectTo session: UISceneSession,
        options connectionOptions: UIScene.ConnectionOptions
    ) {
        guard let windowScene = (scene as? UIWindowScene) else { return }
        let win = UIWindow(windowScene: windowScene)
        let rootVC = ViewController()
        win.rootViewController = rootVC
        self.window = win
        win.makeKeyAndVisible()
    }

    func sceneDidDisconnect(_ scene: UIScene) {}

    func sceneDidBecomeActive(_ scene: UIScene) {
        // App resumed - notify web view to check lock screen
        if let vc = window?.rootViewController as? ViewController {
            vc.notifyAppActive()
        }
    }

    func sceneWillResignActive(_ scene: UIScene) {
        // App resigned active (control center, lock screen, switching apps) - trigger security lock
        if let vc = window?.rootViewController as? ViewController {
            vc.notifyAppInactive()
        }
    }

    func sceneWillEnterForeground(_ scene: UIScene) {}

    func sceneDidEnterBackground(_ scene: UIScene) {
        if let vc = window?.rootViewController as? ViewController {
            vc.notifyAppInactive()
        }
    }
}
