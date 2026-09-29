package com.example

import android.annotation.SuppressLint
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Matrix
import androidx.exifinterface.media.ExifInterface
import android.net.Uri
import android.os.Bundle
import android.provider.OpenableColumns
import android.util.Base64
import android.webkit.JavascriptInterface
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.fragment.app.FragmentActivity
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.FileProvider
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import android.content.ClipData
import android.content.ContentValues
import android.content.Intent
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.media.MediaScannerConnection
import android.os.Build
import android.os.Environment
import android.os.StatFs
import android.location.Location
import android.location.LocationManager
import android.location.Geocoder
import android.provider.MediaStore
import org.json.JSONArray
import org.json.JSONObject
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileOutputStream
import java.util.ArrayList
import kotlin.concurrent.thread

class MainActivity : FragmentActivity(), SensorEventListener {
    private var webView: WebView? = null
    private var filePathCallback: ValueCallback<Array<Uri>>? = null
    private var cameraPhotoUri: Uri? = null

    private var isCameraLaunching = false
    private var isGalleryLaunching = false
    private var currentTargetAlbum: String? = null
    private var isGpsMetadataEnabled = true
    private lateinit var cameraImagesDir: File

    // Native Hardware Motion & Gyroscope Sensors
    private var sensorManager: SensorManager? = null
    private var rotationSensor: Sensor? = null
    private var accelSensor: Sensor? = null
    private val rotationMatrix = FloatArray(9)
    private val orientationAngles = FloatArray(3)
    private var lastNativeGyroDispatchTime = 0L
    private var lastNativeShakeTime = 0L
    private var lastNativeAccel = floatArrayOf(0f, 0f, 0f)

    private fun parseExifDmsToDecimal(dms: String, ref: String): Double? {
        return try {
            val parts = dms.split(",")
            if (parts.isEmpty()) return null
            fun evalRational(r: String): Double {
                val sub = r.trim().split("/")
                return if (sub.size == 2) {
                    val num = sub[0].trim().toDoubleOrNull() ?: 0.0
                    val den = sub[1].trim().toDoubleOrNull() ?: 1.0
                    if (den != 0.0) num / den else 0.0
                } else {
                    r.trim().toDoubleOrNull() ?: 0.0
                }
            }
            val d = if (parts.size >= 1) evalRational(parts[0]) else 0.0
            val m = if (parts.size >= 2) evalRational(parts[1]) else 0.0
            val s = if (parts.size >= 3) evalRational(parts[2]) else 0.0
            var dec = d + (m / 60.0) + (s / 3600.0)
            if (ref.equals("S", ignoreCase = true) || ref.equals("W", ignoreCase = true)) {
                dec = -dec
            }
            if (!dec.isNaN() && dec in -180.0..180.0) dec else null
        } catch (_: Exception) {
            null
        }
    }

    private fun extractLocationMetadata(uri: Uri): JSONObject? {
        if (!isGpsMetadataEnabled) return null
        return try {
            var targetUri = uri
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                try {
                    if (android.provider.DocumentsContract.isDocumentUri(this, uri)) {
                        val docId = android.provider.DocumentsContract.getDocumentId(uri)
                        if (docId != null && docId.startsWith("image:")) {
                            val id = docId.split(":")[1].toLongOrNull()
                            if (id != null) {
                                val mediaUri = android.content.ContentUris.withAppendedId(
                                    MediaStore.Images.Media.EXTERNAL_CONTENT_URI, id
                                )
                                targetUri = MediaStore.setRequireOriginal(mediaUri)
                            }
                        }
                    } else {
                        targetUri = MediaStore.setRequireOriginal(uri)
                    }
                } catch (_: Exception) {
                    targetUri = uri
                }
            }

            var lat: Double? = null
            var lon: Double? = null

            fun parseExifStream(stream: java.io.InputStream) {
                val exif = ExifInterface(stream)
                val latLong = exif.latLong
                if (latLong != null && latLong.size >= 2) {
                    lat = latLong[0]
                    lon = latLong[1]
                } else {
                    val latAttr = exif.getAttribute(ExifInterface.TAG_GPS_LATITUDE)
                    val latRef = exif.getAttribute(ExifInterface.TAG_GPS_LATITUDE_REF) ?: "N"
                    val lonAttr = exif.getAttribute(ExifInterface.TAG_GPS_LONGITUDE)
                    val lonRef = exif.getAttribute(ExifInterface.TAG_GPS_LONGITUDE_REF) ?: "E"
                    if (!latAttr.isNullOrEmpty() && !lonAttr.isNullOrEmpty()) {
                        lat = parseExifDmsToDecimal(latAttr, latRef)
                        lon = parseExifDmsToDecimal(lonAttr, lonRef)
                    }
                }
            }

            try {
                contentResolver.openInputStream(targetUri)?.use { parseExifStream(it) }
            } catch (_: Exception) {}

            if ((lat == null || lon == null) && targetUri != uri) {
                try {
                    contentResolver.openInputStream(uri)?.use { parseExifStream(it) }
                } catch (_: Exception) {}
            }

            if (lat == null || lon == null) {
                try {
                    contentResolver.openFileDescriptor(targetUri, "r")?.use { pfd ->
                        val exif = ExifInterface(pfd.fileDescriptor)
                        val latLong = exif.latLong
                        if (latLong != null && latLong.size >= 2) {
                            lat = latLong[0]
                            lon = latLong[1]
                        } else {
                            val latAttr = exif.getAttribute(ExifInterface.TAG_GPS_LATITUDE)
                            val latRef = exif.getAttribute(ExifInterface.TAG_GPS_LATITUDE_REF) ?: "N"
                            val lonAttr = exif.getAttribute(ExifInterface.TAG_GPS_LONGITUDE)
                            val lonRef = exif.getAttribute(ExifInterface.TAG_GPS_LONGITUDE_REF) ?: "E"
                            if (!latAttr.isNullOrEmpty() && !lonAttr.isNullOrEmpty()) {
                                lat = parseExifDmsToDecimal(latAttr, latRef)
                                lon = parseExifDmsToDecimal(lonAttr, lonRef)
                            }
                        }
                    }
                } catch (_: Exception) {}
            }

            val validLat = lat
            val validLon = lon
            if (validLat != null && validLon != null && validLat in -90.0..90.0 && validLon in -180.0..180.0 && !(validLat == 0.0 && validLon == 0.0)) {
                val locObj = JSONObject().apply {
                    put("latitude", validLat)
                    put("longitude", validLon)
                    val displayCoords = String.format(java.util.Locale.US, "%.4f° %s, %.4f° %s",
                        Math.abs(validLat), if (validLat >= 0) "N" else "S",
                        Math.abs(validLon), if (validLon >= 0) "E" else "W"
                    )
                    put("displayCoords", displayCoords)
                    put("place", "")
                    put("city", "")
                    put("country", "")
                }
                try {
                    val geocoder = android.location.Geocoder(this@MainActivity, java.util.Locale.getDefault())
                    @Suppress("DEPRECATION")
                    val addresses = geocoder.getFromLocation(validLat, validLon, 1)
                    if (!addresses.isNullOrEmpty()) {
                        val addr = addresses[0]
                        val place = addr.subLocality ?: addr.thoroughfare ?: addr.featureName
                        val city = addr.locality ?: addr.subAdminArea ?: addr.adminArea
                        val country = addr.countryName
                        if (!place.isNullOrBlank()) locObj.put("place", place.trim())
                        if (!city.isNullOrBlank()) locObj.put("city", city.trim())
                        if (!country.isNullOrBlank()) locObj.put("country", country.trim())
                    }
                } catch (_: Exception) {}
                locObj
            } else null
        } catch (_: Exception) {
            null
        }
    }

    private fun getDeviceCurrentLocation(photoUri: Uri? = null): JSONObject? {
        if (!isGpsMetadataEnabled) return null
        val hasFine = checkSelfPermission(android.Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
        val hasCoarse = checkSelfPermission(android.Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED
        if (!hasFine && !hasCoarse) return null

        return try {
            val locationManager = getSystemService(LOCATION_SERVICE) as? LocationManager ?: return null
            val providers = listOf(
                LocationManager.GPS_PROVIDER,
                LocationManager.NETWORK_PROVIDER,
                LocationManager.PASSIVE_PROVIDER
            )

            var bestLocation: Location? = null
            for (provider in providers) {
                if (locationManager.isProviderEnabled(provider)) {
                    val loc = try { locationManager.getLastKnownLocation(provider) } catch (e: SecurityException) { null }
                    if (loc != null) {
                        if (bestLocation == null || loc.time > bestLocation.time || loc.accuracy < bestLocation.accuracy) {
                            bestLocation = loc
                        }
                    }
                }
            }

            val loc = bestLocation ?: return null
            val lat = loc.latitude
            val lon = loc.longitude

            // Embed coordinates into the physical captured file if Uri is given
            if (photoUri != null) {
                try {
                    contentResolver.openFileDescriptor(photoUri, "rw")?.use { pfd ->
                        val exif = ExifInterface(pfd.fileDescriptor)
                        val latRef = if (lat >= 0) "N" else "S"
                        val lonRef = if (lon >= 0) "E" else "W"
                        val absLat = Math.abs(lat)
                        val latDeg = absLat.toInt()
                        val latMin = ((absLat - latDeg) * 60).toInt()
                        val latSec = ((((absLat - latDeg) * 60) - latMin) * 60 * 1000).toInt()
                        val absLon = Math.abs(lon)
                        val lonDeg = absLon.toInt()
                        val lonMin = ((absLon - lonDeg) * 60).toInt()
                        val lonSec = ((((absLon - lonDeg) * 60) - lonMin) * 60 * 1000).toInt()

                        exif.setAttribute(ExifInterface.TAG_GPS_LATITUDE_REF, latRef)
                        exif.setAttribute(ExifInterface.TAG_GPS_LATITUDE, "$latDeg/1,$latMin/1,$latSec/1000")
                        exif.setAttribute(ExifInterface.TAG_GPS_LONGITUDE_REF, lonRef)
                        exif.setAttribute(ExifInterface.TAG_GPS_LONGITUDE, "$lonDeg/1,$lonMin/1,$lonSec/1000")
                        exif.saveAttributes()
                    }
                } catch (e: Exception) {
                    // Ignore EXIF write failure
                }
            }

            val locObj = JSONObject().apply {
                put("latitude", lat)
                put("longitude", lon)
                val displayCoords = String.format(java.util.Locale.US, "%.4f° %s, %.4f° %s",
                    Math.abs(lat), if (lat >= 0) "N" else "S",
                    Math.abs(lon), if (lon >= 0) "E" else "W"
                )
                put("displayCoords", displayCoords)
                put("place", "")
                put("city", "")
                put("country", "")
            }

            try {
                val geocoder = Geocoder(this@MainActivity, java.util.Locale.getDefault())
                @Suppress("DEPRECATION")
                val addresses = geocoder.getFromLocation(lat, lon, 1)
                if (!addresses.isNullOrEmpty()) {
                    val addr = addresses[0]
                    val place = addr.subLocality ?: addr.thoroughfare ?: addr.featureName
                    val city = addr.locality ?: addr.subAdminArea ?: addr.adminArea
                    val country = addr.countryName
                    if (!place.isNullOrBlank()) locObj.put("place", place.trim())
                    if (!city.isNullOrBlank()) locObj.put("city", city.trim())
                    if (!country.isNullOrBlank()) locObj.put("country", country.trim())
                }
            } catch (e: Exception) {
                // Geocoder offline fallback
            }

            locObj
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    // Native Camera Launcher
    private val takePictureLauncher = registerForActivityResult(
        ActivityResultContracts.TakePicture()
    ) { success ->
        isCameraLaunching = false
        val uri = cameraPhotoUri
        if (success && uri != null) {
            // Process photo in background thread to avoid UI lag
            thread {
                val base64 = uriToBase64(uri)
                var locObj = extractLocationMetadata(uri)
                if (locObj == null && isGpsMetadataEnabled) {
                    locObj = getDeviceCurrentLocation(uri)
                }
                val locStr = locObj?.toString() ?: "null"
                runOnUiThread {
                    if (filePathCallback != null) {
                        filePathCallback?.onReceiveValue(arrayOf(uri))
                        filePathCallback = null
                    }
                    if (base64 != null) {
                        val escapedBase64 = base64.replace("'", "\\'")
                        webView?.evaluateJavascript(
                            "if (window.onNativePhotoCaptured) { window.onNativePhotoCaptured('$escapedBase64', 'Camera Shot', $locStr); }",
                            null
                        )
                    }
                }
            }
        } else {
            filePathCallback?.onReceiveValue(null)
            filePathCallback = null
        }
    }

    // Camera & Location Permission Request Launcher
    private val requestCameraPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val cameraGranted = permissions[android.Manifest.permission.CAMERA] == true
        if (cameraGranted) {
            launchCameraInternal()
        } else {
            isCameraLaunching = false
            Toast.makeText(this, "Camera permission is required to capture photos", Toast.LENGTH_SHORT).show()
            filePathCallback?.onReceiveValue(null)
            filePathCallback = null
        }
    }

    // Gallery Picker Launcher
    private val galleryPickerLauncher = registerForActivityResult(
        ActivityResultContracts.GetMultipleContents()
    ) { uris: List<Uri>? ->
        isGalleryLaunching = false
        if (uris != null && uris.isNotEmpty()) {
            if (filePathCallback != null) {
                filePathCallback?.onReceiveValue(uris.toTypedArray())
                filePathCallback = null
            }
            // Also notify Web JS with loaded photos and extracted location metadata
            thread {
                val jsonArray = JSONArray()
                for (uri in uris) {
                    val base64 = uriToBase64(uri) ?: continue
                    val name = getFileName(uri)
                    val locObj = extractLocationMetadata(uri)
                    var cameraModel: String? = null
                    var dateTakenMs: Long? = null
                    try {
                        contentResolver.openInputStream(uri)?.use { stream ->
                            val exif = ExifInterface(stream)
                            val make = exif.getAttribute(ExifInterface.TAG_MAKE)?.trim()
                            val model = exif.getAttribute(ExifInterface.TAG_MODEL)?.trim()
                            if (!model.isNullOrEmpty()) {
                                cameraModel = if (!make.isNullOrEmpty() && !model.startsWith(make, ignoreCase = true)) "$make $model" else model
                            } else if (!make.isNullOrEmpty()) {
                                cameraModel = make
                            }
                            val dateStr = exif.getAttribute(ExifInterface.TAG_DATETIME_ORIGINAL) ?: exif.getAttribute(ExifInterface.TAG_DATETIME)
                            if (!dateStr.isNullOrEmpty()) {
                                val sdf = java.text.SimpleDateFormat("yyyy:MM:dd HH:mm:ss", java.util.Locale.US)
                                val d = sdf.parse(dateStr)
                                if (d != null) dateTakenMs = d.time
                            }
                        }
                    } catch (_: Exception) {}
                    val obj = JSONObject().apply {
                        put("displayName", name)
                        put("dataUrl", base64)
                        if (locObj != null) {
                            put("location", locObj)
                        }
                        if (!cameraModel.isNullOrEmpty()) {
                            put("cameraModel", cameraModel)
                        }
                        if (dateTakenMs != null) {
                            put("createdAt", dateTakenMs)
                        }
                    }
                    jsonArray.put(obj)
                }
                val album = currentTargetAlbum
                currentTargetAlbum = null
                runOnUiThread {
                    val jsonStr = jsonArray.toString()
                    if (!album.isNullOrBlank()) {
                        val albumEscaped = JSONObject.quote(album)
                        webView?.evaluateJavascript(
                            "if (window.onNativePhotosImportedToAlbum) { window.onNativePhotosImportedToAlbum($jsonStr, $albumEscaped); } else if (window.onNativePhotosImported) { window.onNativePhotosImported($jsonStr); }",
                            null
                        )
                    } else {
                        webView?.evaluateJavascript(
                            "if (window.onNativePhotosImported) { window.onNativePhotosImported($jsonStr); }",
                            null
                        )
                    }
                }
            }
        } else {
            filePathCallback?.onReceiveValue(null)
            filePathCallback = null
        }
    }

    // Gallery & Media Location Permission Request Launcher
    private val requestGalleryPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { _ ->
        launchGalleryInternal()
    }

    // Biometric & Device Credential Auth Launcher (Keyguard device credential / fingerprint / face)
    private var authActionTarget = "unlock" // "unlock" or "reset"
    private val biometricAuthLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        val success = (result.resultCode == RESULT_OK)
        runOnUiThread {
            if (authActionTarget == "reset") {
                webView?.evaluateJavascript(
                    "if (window.onNativeResetAuthResult) { window.onNativeResetAuthResult($success); }",
                    null
                )
            } else {
                webView?.evaluateJavascript(
                    "if (window.onNativeBiometricResult) { window.onNativeBiometricResult($success); }",
                    null
                )
            }
        }
    }

    fun launchCamera() {
        if (isCameraLaunching) return
        isCameraLaunching = true
        val permissions = mutableListOf(android.Manifest.permission.CAMERA)
        if (isGpsMetadataEnabled) {
            if (checkSelfPermission(android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                permissions.add(android.Manifest.permission.ACCESS_FINE_LOCATION)
            }
            if (checkSelfPermission(android.Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                permissions.add(android.Manifest.permission.ACCESS_COARSE_LOCATION)
            }
        }
        val needed = permissions.filter { checkSelfPermission(it) != PackageManager.PERMISSION_GRANTED }
        if (needed.isEmpty()) {
            launchCameraInternal()
        } else {
            requestCameraPermissionLauncher.launch(needed.toTypedArray())
        }
    }

    private fun launchCameraInternal() {
        try {
            val file = File(cameraImagesDir, "camera_${System.currentTimeMillis()}.jpg")
            val uri = FileProvider.getUriForFile(this, "${packageName}.provider", file)
            cameraPhotoUri = uri
            takePictureLauncher.launch(uri)
        } catch (e: Exception) {
            isCameraLaunching = false
            e.printStackTrace()
            Toast.makeText(this, "Error starting camera: ${e.message}", Toast.LENGTH_SHORT).show()
            filePathCallback?.onReceiveValue(null)
            filePathCallback = null
        }
    }

    fun launchGallery() {
        if (isGalleryLaunching) return
        isGalleryLaunching = true
        val permissionsToRequest = mutableListOf<String>()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            if (checkSelfPermission(android.Manifest.permission.ACCESS_MEDIA_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                permissionsToRequest.add(android.Manifest.permission.ACCESS_MEDIA_LOCATION)
            }
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (checkSelfPermission(android.Manifest.permission.READ_MEDIA_IMAGES) != PackageManager.PERMISSION_GRANTED) {
                permissionsToRequest.add(android.Manifest.permission.READ_MEDIA_IMAGES)
            }
        } else {
            if (checkSelfPermission(android.Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                permissionsToRequest.add(android.Manifest.permission.READ_EXTERNAL_STORAGE)
            }
        }

        if (permissionsToRequest.isEmpty()) {
            launchGalleryInternal()
        } else {
            requestGalleryPermissionLauncher.launch(permissionsToRequest.toTypedArray())
        }
    }

    private fun launchGalleryInternal() {
        try {
            galleryPickerLauncher.launch("image/*")
        } catch (e: Exception) {
            isGalleryLaunching = false
            e.printStackTrace()
            Toast.makeText(this, "Error opening gallery: ${e.message}", Toast.LENGTH_SHORT).show()
            filePathCallback?.onReceiveValue(null)
            filePathCallback = null
        }
    }

    private fun uriToBase64(uri: Uri, maxDimension: Int = 1600): String? {
        return try {
            contentResolver.openInputStream(uri)?.use { inputStream ->
                val options = BitmapFactory.Options().apply { inJustDecodeBounds = true }
                BitmapFactory.decodeStream(inputStream, null, options)

                var sampleSize = 1
                val maxSide = maxOf(options.outWidth, options.outHeight)
                while ((maxSide / sampleSize) > maxDimension) {
                    sampleSize *= 2
                }

                contentResolver.openInputStream(uri)?.use { stream2 ->
                    val decodeOptions = BitmapFactory.Options().apply { inSampleSize = sampleSize }
                    val bitmap = BitmapFactory.decodeStream(stream2, null, decodeOptions) ?: return null

                    val orientedBitmap = rotateBitmapIfRequired(uri, bitmap)
                    val outputStream = ByteArrayOutputStream()
                    orientedBitmap.compress(Bitmap.CompressFormat.JPEG, 85, outputStream)
                    val bytes = outputStream.toByteArray()
                    "data:image/jpeg;base64," + Base64.encodeToString(bytes, Base64.NO_WRAP)
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    private fun rotateBitmapIfRequired(uri: Uri, bitmap: Bitmap): Bitmap {
        return try {
            contentResolver.openInputStream(uri)?.use { inputStream ->
                val exif = ExifInterface(inputStream)
                val orientation = exif.getAttributeInt(
                    ExifInterface.TAG_ORIENTATION,
                    ExifInterface.ORIENTATION_NORMAL
                )
                when (orientation) {
                    ExifInterface.ORIENTATION_ROTATE_90 -> rotateBitmap(bitmap, 90f)
                    ExifInterface.ORIENTATION_ROTATE_180 -> rotateBitmap(bitmap, 180f)
                    ExifInterface.ORIENTATION_ROTATE_270 -> rotateBitmap(bitmap, 270f)
                    else -> bitmap
                }
            } ?: bitmap
        } catch (e: Exception) {
            bitmap
        }
    }

    private fun rotateBitmap(bitmap: Bitmap, degrees: Float): Bitmap {
        val matrix = Matrix().apply { postRotate(degrees) }
        return Bitmap.createBitmap(bitmap, 0, 0, bitmap.width, bitmap.height, matrix, true)
    }

    private fun getFileName(uri: Uri): String {
        var name = "Moment_${System.currentTimeMillis()}"
        try {
            val cursor = contentResolver.query(uri, null, null, null, null)
            cursor?.use {
                if (it.moveToFirst()) {
                    val index = it.getColumnIndex(OpenableColumns.DISPLAY_NAME)
                    if (index != -1) {
                        val colVal = it.getString(index)
                        if (!colVal.isNullOrBlank()) {
                            name = colVal
                        }
                    }
                }
            }
        } catch (e: Exception) {
            // fallback to default
        }
        return name.substringBeforeLast('.')
    }

    inner class AndroidAppInterface {
        @JavascriptInterface
        fun openCamera() {
            runOnUiThread {
                launchCamera()
            }
        }

        @JavascriptInterface
        fun openGallery() {
            runOnUiThread {
                launchGallery()
            }
        }

        @JavascriptInterface
        fun openGalleryForAlbum(targetAlbum: String) {
            currentTargetAlbum = targetAlbum
            runOnUiThread {
                launchGallery()
            }
        }

        @JavascriptInterface
        fun setGpsMetadataEnabled(enabled: Boolean) {
            isGpsMetadataEnabled = enabled
        }

        @JavascriptInterface
        fun authenticateBiometrics() {
            runOnUiThread {
                try {
                    authActionTarget = "unlock"
                    val biometricManager = BiometricManager.from(this@MainActivity)
                    val authenticators = BiometricManager.Authenticators.BIOMETRIC_STRONG or BiometricManager.Authenticators.DEVICE_CREDENTIAL
                    val canAuth = biometricManager.canAuthenticate(authenticators)

                    if (canAuth == BiometricManager.BIOMETRIC_SUCCESS) {
                        val executor = ContextCompat.getMainExecutor(this@MainActivity)
                        val promptInfo = BiometricPrompt.PromptInfo.Builder()
                            .setTitle("Unlock Aura Vault")
                            .setSubtitle("Verify fingerprint, face, or device screen lock")
                            .setAllowedAuthenticators(authenticators)
                            .build()

                        val prompt = BiometricPrompt(this@MainActivity, executor, object : BiometricPrompt.AuthenticationCallback() {
                            override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                                super.onAuthenticationSucceeded(result)
                                runOnUiThread {
                                    webView?.evaluateJavascript(
                                        "if (window.onNativeBiometricResult) { window.onNativeBiometricResult(true); }",
                                        null
                                    )
                                }
                            }

                            override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                                super.onAuthenticationError(errorCode, errString)
                                runOnUiThread {
                                    val escapedErr = JSONObject.quote(errString.toString())
                                    webView?.evaluateJavascript(
                                        "if (window.onNativeBiometricResult) { window.onNativeBiometricResult(false, $escapedErr); }",
                                        null
                                    )
                                }
                            }

                            override fun onAuthenticationFailed() {
                                super.onAuthenticationFailed()
                                // BiometricPrompt UI natively displays biometric failure animation
                            }
                        })

                        prompt.authenticate(promptInfo)
                        return@runOnUiThread
                    }

                    // Fallback to KeyguardManager for device credential if BiometricManager check failed
                    val keyguardManager = getSystemService(android.content.Context.KEYGUARD_SERVICE) as? android.app.KeyguardManager
                    if (keyguardManager?.isDeviceSecure == true) {
                        @Suppress("DEPRECATION")
                        val intent = keyguardManager.createConfirmDeviceCredentialIntent(
                            "Unlock Aura Vault",
                            "Verify your PIN, pattern, or password to continue"
                        )
                        if (intent != null) {
                            biometricAuthLauncher.launch(intent)
                            return@runOnUiThread
                        }
                    }

                    // No secure lock screen configured on device
                    webView?.evaluateJavascript(
                        "if (window.onNativeBiometricResult) { window.onNativeBiometricResult(false, 'no_device_lock'); }",
                        null
                    )
                } catch (e: Exception) {
                    webView?.evaluateJavascript(
                        "if (window.onNativeBiometricResult) { window.onNativeBiometricResult(false, 'auth_error'); }",
                        null
                    )
                }
            }
        }

        @JavascriptInterface
        fun authenticateForPasscodeReset() {
            runOnUiThread {
                try {
                    authActionTarget = "reset"
                    val keyguardManager = getSystemService(android.content.Context.KEYGUARD_SERVICE) as? android.app.KeyguardManager
                    val isDeviceSecure = keyguardManager?.isDeviceSecure == true
                    val biometricManager = BiometricManager.from(this@MainActivity)
                    val authenticators = BiometricManager.Authenticators.BIOMETRIC_STRONG or BiometricManager.Authenticators.DEVICE_CREDENTIAL
                    val canAuth = biometricManager.canAuthenticate(authenticators)

                    // If device has NO phone screen lock (no PIN, pattern, or password) AND no biometrics:
                    if (!isDeviceSecure && canAuth != BiometricManager.BIOMETRIC_SUCCESS) {
                        webView?.evaluateJavascript(
                            "if (window.onNativeResetAuthResult) { window.onNativeResetAuthResult(false, 'no_device_security'); }",
                            null
                        )
                        return@runOnUiThread
                    }

                    if (canAuth == BiometricManager.BIOMETRIC_SUCCESS) {
                        val executor = ContextCompat.getMainExecutor(this@MainActivity)
                        val promptInfo = BiometricPrompt.PromptInfo.Builder()
                            .setTitle("Verify Identity to Reset Passcode")
                            .setSubtitle("Enter your phone PIN, pattern, or biometric to verify identity")
                            .setAllowedAuthenticators(authenticators)
                            .build()

                        val prompt = BiometricPrompt(this@MainActivity, executor, object : BiometricPrompt.AuthenticationCallback() {
                            override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                                super.onAuthenticationSucceeded(result)
                                runOnUiThread {
                                    webView?.evaluateJavascript(
                                        "if (window.onNativeResetAuthResult) { window.onNativeResetAuthResult(true); }",
                                        null
                                    )
                                }
                            }

                            override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                                super.onAuthenticationError(errorCode, errString)
                                runOnUiThread {
                                    val escapedErr = JSONObject.quote(errString.toString())
                                    webView?.evaluateJavascript(
                                        "if (window.onNativeResetAuthResult) { window.onNativeResetAuthResult(false, $escapedErr); }",
                                        null
                                    )
                                }
                            }

                            override fun onAuthenticationFailed() {
                                super.onAuthenticationFailed()
                            }
                        })

                        prompt.authenticate(promptInfo)
                        return@runOnUiThread
                    }

                    // Fallback to KeyguardManager for device credential (PIN / Pattern / Password)
                    if (isDeviceSecure) {
                        @Suppress("DEPRECATION")
                        val intent = keyguardManager?.createConfirmDeviceCredentialIntent(
                            "Verify Identity to Reset Passcode",
                            "Enter your phone PIN, pattern, or password to reset your app passcode"
                        )
                        if (intent != null) {
                            biometricAuthLauncher.launch(intent)
                            return@runOnUiThread
                        }
                    }

                    webView?.evaluateJavascript(
                        "if (window.onNativeResetAuthResult) { window.onNativeResetAuthResult(false, 'no_device_security'); }",
                        null
                    )
                } catch (e: Exception) {
                    webView?.evaluateJavascript(
                        "if (window.onNativeResetAuthResult) { window.onNativeResetAuthResult(false, 'auth_error'); }",
                        null
                    )
                }
            }
        }

        @JavascriptInterface
        fun openDeviceSecuritySettings() {
            runOnUiThread {
                try {
                    val intent = Intent(android.provider.Settings.ACTION_SECURITY_SETTINGS)
                    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
                    startActivity(intent)
                } catch (e: Exception) {
                    try {
                        val intent = Intent(android.provider.Settings.ACTION_SETTINGS)
                        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
                        startActivity(intent)
                    } catch (_: Exception) {}
                }
            }
        }

        @JavascriptInterface
        fun getCurrentLocation(callbackId: String) {
            thread {
                val locObj = getDeviceCurrentLocation()
                val locStr = locObj?.toString() ?: "null"
                runOnUiThread {
                    webView?.evaluateJavascript(
                        "if (window.onNativeLocationReceived) { window.onNativeLocationReceived('$callbackId', $locStr); }",
                        null
                    )
                }
            }
        }

        @JavascriptInterface
        fun getDeviceStorageInfo(): String {
            return try {
                val dataPath = Environment.getDataDirectory()
                val stat = StatFs(dataPath.path)
                val blockSize = stat.blockSizeLong
                val totalBlocks = stat.blockCountLong
                val availableBlocks = stat.availableBlocksLong

                val totalBytes = totalBlocks * blockSize
                val availableBytes = availableBlocks * blockSize
                val usedBytes = totalBytes - availableBytes

                val totalGiB = totalBytes.toDouble() / (1024.0 * 1024.0 * 1024.0)
                val freeGiB = availableBytes.toDouble() / (1024.0 * 1024.0 * 1024.0)
                val usedGiB = usedBytes.toDouble() / (1024.0 * 1024.0 * 1024.0)

                // Match nominal standard consumer phone storage tiers (16, 32, 64, 128, 256, 512, 1024 GB)
                val nominalTiers = longArrayOf(16, 32, 64, 128, 256, 512, 1024)
                var nominalGb = Math.round(totalGiB)
                for (tier in nominalTiers) {
                    if (totalGiB >= tier * 0.78 && totalGiB <= tier * 1.05) {
                        nominalGb = tier
                        break
                    }
                }

                val json = JSONObject()
                json.put("totalBytes", totalBytes)
                json.put("availableBytes", availableBytes)
                json.put("usedBytes", usedBytes)
                json.put("totalGb", nominalGb)
                json.put("exactTotalGb", String.format(java.util.Locale.US, "%.1f", totalGiB))
                json.put("freeGb", String.format(java.util.Locale.US, "%.1f", freeGiB))
                json.put("usedGb", String.format(java.util.Locale.US, "%.1f", usedGiB))
                json.toString()
            } catch (e: Exception) {
                "{}"
            }
        }

        @JavascriptInterface
        fun clearCache() {
            runOnUiThread {
                try {
                    webView?.clearCache(true)
                    cacheDir.deleteRecursively()
                } catch (e: Exception) {}
            }
        }

        @JavascriptInterface
        fun sharePhoto(base64DataUrl: String, title: String) {
            thread {
                try {
                    val mimeType = when {
                        base64DataUrl.startsWith("data:image/png", ignoreCase = true) -> "image/png"
                        base64DataUrl.startsWith("data:image/webp", ignoreCase = true) -> "image/webp"
                        base64DataUrl.startsWith("data:image/gif", ignoreCase = true) -> "image/gif"
                        else -> "image/jpeg"
                    }
                    val ext = when (mimeType) {
                        "image/png" -> "png"
                        "image/webp" -> "webp"
                        "image/gif" -> "gif"
                        else -> "jpg"
                    }
                    val base64 = if (base64DataUrl.contains("base64,")) {
                        base64DataUrl.substringAfter("base64,")
                    } else {
                        base64DataUrl
                    }
                    val bytes = Base64.decode(base64, Base64.DEFAULT)
                    val cacheDir = File(cacheDir, "shared_images").apply { mkdirs() }
                    val safeName = title.ifBlank { "Photo_${System.currentTimeMillis()}" }
                        .replace(Regex("[^a-zA-Z0-9_-]"), "_")
                    val file = File(cacheDir, "$safeName.$ext")
                    FileOutputStream(file).use { it.write(bytes) }

                    val uri: Uri = FileProvider.getUriForFile(
                        this@MainActivity,
                        "${packageName}.provider",
                        file
                    )

                    val shareIntent = Intent(Intent.ACTION_SEND).apply {
                        type = mimeType
                        putExtra(Intent.EXTRA_STREAM, uri)
                        putExtra(Intent.EXTRA_TEXT, title)
                        clipData = ClipData.newUri(contentResolver, title, uri)
                        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                    }

                    val chooser = Intent.createChooser(shareIntent, "Share Photo via").apply {
                        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                    }

                    // Grant URI read permissions explicitly to all resolved target apps
                    val resInfoList = packageManager.queryIntentActivities(shareIntent, PackageManager.MATCH_DEFAULT_ONLY)
                    for (resolveInfo in resInfoList) {
                        val pkgName = resolveInfo.activityInfo.packageName
                        grantUriPermission(pkgName, uri, Intent.FLAG_GRANT_READ_URI_PERMISSION)
                    }

                    runOnUiThread {
                        try {
                            startActivity(chooser)
                        } catch (ex: Exception) {
                            ex.printStackTrace()
                            Toast.makeText(this@MainActivity, "No app available to share photo", Toast.LENGTH_SHORT).show()
                        }
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                    runOnUiThread {
                        Toast.makeText(this@MainActivity, "Share failed: ${e.message}", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }

        @JavascriptInterface
        fun shareMultiplePhotos(photosJson: String, albumTitle: String) {
            thread {
                try {
                    val jsonArr = JSONArray(photosJson)
                    if (jsonArr.length() == 0) return@thread

                    val cacheDir = File(cacheDir, "shared_images").apply { mkdirs() }
                    val urisList = ArrayList<Uri>()

                    for (i in 0 until jsonArr.length()) {
                        val item = jsonArr.getJSONObject(i)
                        val dataUrl = item.getString("dataUrl")
                        val name = item.optString("displayName", "photo_$i")
                            .replace(Regex("[^a-zA-Z0-9_-]"), "_")
                        val mimeType = when {
                            dataUrl.startsWith("data:image/png", ignoreCase = true) -> "image/png"
                            dataUrl.startsWith("data:image/webp", ignoreCase = true) -> "image/webp"
                            else -> "image/jpeg"
                        }
                        val ext = if (mimeType == "image/png") "png" else if (mimeType == "image/webp") "webp" else "jpg"
                        val base64 = if (dataUrl.contains("base64,")) dataUrl.substringAfter("base64,") else dataUrl
                        val bytes = Base64.decode(base64, Base64.DEFAULT)
                        val file = File(cacheDir, "${name}_${System.currentTimeMillis()}_$i.$ext")
                        FileOutputStream(file).use { it.write(bytes) }
                        val uri = FileProvider.getUriForFile(this@MainActivity, "${packageName}.provider", file)
                        urisList.add(uri)
                    }

                    if (urisList.isEmpty()) return@thread

                    if (urisList.size == 1) {
                        val shareIntent = Intent(Intent.ACTION_SEND).apply {
                            type = "image/*"
                            putExtra(Intent.EXTRA_STREAM, urisList[0])
                            putExtra(Intent.EXTRA_TEXT, albumTitle)
                            clipData = ClipData.newUri(contentResolver, albumTitle, urisList[0])
                            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                        }
                        val chooser = Intent.createChooser(shareIntent, "Share Photo via").apply {
                            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                        }
                        val resInfoList = packageManager.queryIntentActivities(shareIntent, PackageManager.MATCH_DEFAULT_ONLY)
                        for (resolveInfo in resInfoList) {
                            grantUriPermission(resolveInfo.activityInfo.packageName, urisList[0], Intent.FLAG_GRANT_READ_URI_PERMISSION)
                        }
                        runOnUiThread {
                            try {
                                startActivity(chooser)
                            } catch (ex: Exception) {
                                ex.printStackTrace()
                                Toast.makeText(this@MainActivity, "No app available to share", Toast.LENGTH_SHORT).show()
                            }
                        }
                    } else {
                        val shareIntent = Intent(Intent.ACTION_SEND_MULTIPLE).apply {
                            type = "image/*"
                            putParcelableArrayListExtra(Intent.EXTRA_STREAM, urisList)
                            putExtra(Intent.EXTRA_TEXT, "$albumTitle (${urisList.size} photos)")
                            val clip = ClipData("Shared Album", arrayOf("image/*"), ClipData.Item(urisList[0]))
                            for (idx in 1 until urisList.size) {
                                clip.addItem(ClipData.Item(urisList[idx]))
                            }
                            clipData = clip
                            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                        }
                        val chooser = Intent.createChooser(shareIntent, "Share Album via").apply {
                            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                        }
                        val resInfoList = packageManager.queryIntentActivities(shareIntent, PackageManager.MATCH_DEFAULT_ONLY)
                        for (resolveInfo in resInfoList) {
                            val pkg = resolveInfo.activityInfo.packageName
                            for (u in urisList) {
                                grantUriPermission(pkg, u, Intent.FLAG_GRANT_READ_URI_PERMISSION)
                            }
                        }
                        runOnUiThread {
                            try {
                                startActivity(chooser)
                            } catch (ex: Exception) {
                                ex.printStackTrace()
                                Toast.makeText(this@MainActivity, "No app available to share album", Toast.LENGTH_SHORT).show()
                            }
                        }
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                    runOnUiThread {
                        Toast.makeText(this@MainActivity, "Share album failed: ${e.message}", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }

        private fun getTodayDateString(): String {
            return java.text.SimpleDateFormat("dd-MM-yy", java.util.Locale.US).format(java.util.Date())
        }

        @Synchronized
        private fun getNextGalleryBatchFolder(dateStr: String): String {
            val prefs = getSharedPreferences("photo_organizer_export_prefs", MODE_PRIVATE)
            val key = "gallery_batch_$dateStr"
            val nextNum = prefs.getInt(key, 0) + 1
            prefs.edit().putInt(key, nextNum).apply()
            return String.format(java.util.Locale.US, "%03d", nextNum)
        }

        private fun getCollectionsSubFolder(albumName: String, dateStr: String = getTodayDateString()): String {
            val cleanAlbum = albumName.trim()
                .replace(Regex("[^a-zA-Z0-9_ -]"), "_")
                .ifBlank { "Collection" }
            return "PhotoOrganizer/Collections/$dateStr/$cleanAlbum"
        }

        private fun getGallerySubFolder(dateStr: String = getTodayDateString(), batchFolder: String? = null): String {
            val batch = batchFolder ?: getNextGalleryBatchFolder(dateStr)
            return "PhotoOrganizer/Gallery Images/$dateStr/$batch"
        }

        private fun saveImageToGallery(bytes: ByteArray, fileName: String, subFolder: String): Boolean {
            val rawName = fileName.substringBeforeLast(".")
                .ifBlank { "Photo_${System.currentTimeMillis()}" }
                .replace(Regex("[^a-zA-Z0-9_-]"), "_")
            val cleanFileName = if (fileName.endsWith(".png", ignoreCase = true)) "$rawName.png" else "$rawName.jpg"
            val mimeType = if (cleanFileName.endsWith(".png", ignoreCase = true)) "image/png" else "image/jpeg"
            val nowMs = System.currentTimeMillis()
            val nowSec = nowMs / 1000

            var saved = false
            var scannedPath: String? = null

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                try {
                    val resolver = contentResolver
                    val relativePath = "${Environment.DIRECTORY_PICTURES}/$subFolder/"
                    val contentValues = ContentValues().apply {
                        put(MediaStore.Images.Media.DISPLAY_NAME, cleanFileName)
                        put(MediaStore.Images.Media.MIME_TYPE, mimeType)
                        put(MediaStore.Images.Media.RELATIVE_PATH, relativePath)
                        put(MediaStore.Images.Media.DATE_ADDED, nowSec)
                        put(MediaStore.Images.Media.DATE_MODIFIED, nowSec)
                        put(MediaStore.Images.Media.DATE_TAKEN, nowMs)
                        put(MediaStore.Images.Media.SIZE, bytes.size)
                        put(MediaStore.Images.Media.IS_PENDING, 1)
                    }

                    val collection = MediaStore.Images.Media.EXTERNAL_CONTENT_URI
                    val itemUri = resolver.insert(collection, contentValues)

                    if (itemUri != null) {
                        resolver.openOutputStream(itemUri)?.use { out ->
                            out.write(bytes)
                            out.flush()
                        }
                        contentValues.clear()
                        contentValues.put(MediaStore.Images.Media.IS_PENDING, 0)
                        resolver.update(itemUri, contentValues, null, null)
                        saved = true

                        try {
                            val cursor = resolver.query(itemUri, arrayOf(MediaStore.Images.Media.DATA), null, null, null)
                            cursor?.use {
                                if (it.moveToFirst()) {
                                    val idx = it.getColumnIndex(MediaStore.Images.Media.DATA)
                                    if (idx != -1) scannedPath = it.getString(idx)
                                }
                            }
                        } catch (_: Exception) {}

                        if (!scannedPath.isNullOrBlank()) {
                            MediaScannerConnection.scanFile(
                                this@MainActivity,
                                arrayOf(scannedPath),
                                arrayOf(mimeType),
                                null
                            )
                        } else {
                            try {
                                val scanIntent = Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE).apply {
                                    data = itemUri
                                }
                                sendBroadcast(scanIntent)
                            } catch (_: Exception) {}
                        }
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                    saved = false
                }
            }

            if (!saved) {
                try {
                    val picturesDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES)
                    val appDir = File(picturesDir, subFolder).apply { mkdirs() }
                    val file = File(appDir, cleanFileName)
                    FileOutputStream(file).use {
                        it.write(bytes)
                        it.flush()
                    }

                    MediaScannerConnection.scanFile(
                        this@MainActivity,
                        arrayOf(file.absolutePath),
                        arrayOf(mimeType),
                        null
                    )
                    saved = true
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }

            return saved
        }

        @JavascriptInterface
        fun downloadPhoto(base64DataUrl: String, fileName: String) {
            // Default single photo download goes to Gallery with auto-incremented batch
            downloadPhotoFromGallery(base64DataUrl, fileName)
        }

        @JavascriptInterface
        fun downloadPhotoFromGallery(base64DataUrl: String, fileName: String) {
            thread {
                try {
                    val base64 = if (base64DataUrl.contains("base64,")) {
                        base64DataUrl.substringAfter("base64,")
                    } else {
                        base64DataUrl
                    }.trim()
                    val bytes = Base64.decode(base64, Base64.DEFAULT)
                    val rawName = fileName.substringBeforeLast(".")
                        .ifBlank { "Photo_${System.currentTimeMillis()}" }
                        .replace(Regex("[^a-zA-Z0-9_-]"), "_")
                    val cleanFileName = "$rawName.jpg"

                    val dateStr = getTodayDateString()
                    val batch = getNextGalleryBatchFolder(dateStr)
                    val subFolder = getGallerySubFolder(dateStr, batch)
                    val displayPath = "Pictures/$subFolder/"

                    val saved = saveImageToGallery(bytes, cleanFileName, subFolder)

                    runOnUiThread {
                        if (saved) {
                            Toast.makeText(
                                this@MainActivity,
                                "Photo saved! ($displayPath$cleanFileName)",
                                Toast.LENGTH_LONG
                            ).show()
                        } else {
                            Toast.makeText(this@MainActivity, "Failed to save photo to Gallery", Toast.LENGTH_SHORT).show()
                        }
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                    runOnUiThread {
                        Toast.makeText(this@MainActivity, "Download failed: ${e.message}", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }

        @JavascriptInterface
        fun downloadPhotoFromAlbum(base64DataUrl: String, fileName: String, albumName: String) {
            thread {
                try {
                    val base64 = if (base64DataUrl.contains("base64,")) {
                        base64DataUrl.substringAfter("base64,")
                    } else {
                        base64DataUrl
                    }.trim()
                    val bytes = Base64.decode(base64, Base64.DEFAULT)
                    val rawName = fileName.substringBeforeLast(".")
                        .ifBlank { "Photo_${System.currentTimeMillis()}" }
                        .replace(Regex("[^a-zA-Z0-9_-]"), "_")
                    val cleanFileName = "$rawName.jpg"

                    val dateStr = getTodayDateString()
                    val subFolder = getCollectionsSubFolder(albumName, dateStr)
                    val displayPath = "Pictures/$subFolder/"

                    val saved = saveImageToGallery(bytes, cleanFileName, subFolder)

                    runOnUiThread {
                        if (saved) {
                            Toast.makeText(
                                this@MainActivity,
                                "Photo saved! ($displayPath$cleanFileName)",
                                Toast.LENGTH_LONG
                            ).show()
                        } else {
                            Toast.makeText(this@MainActivity, "Failed to save photo to Collections", Toast.LENGTH_SHORT).show()
                        }
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                    runOnUiThread {
                        Toast.makeText(this@MainActivity, "Download failed: ${e.message}", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }

        @JavascriptInterface
        fun downloadMultiplePhotosToGallery(photosJson: String, albumTitle: String) {
            thread {
                try {
                    val dateStr = getTodayDateString()
                    val subFolder = getCollectionsSubFolder(albumTitle, dateStr)
                    val displayPath = "Pictures/$subFolder/"

                    val jsonArr = JSONArray(photosJson)
                    var savedCount = 0

                    for (i in 0 until jsonArr.length()) {
                        val item = jsonArr.getJSONObject(i)
                        val dataUrl = item.optString("dataUrl", "")
                        if (dataUrl.isBlank()) continue
                        val displayName = item.optString("displayName", "Photo_${i + 1}")
                            .replace(Regex("[^a-zA-Z0-9_-]"), "_")
                        val base64 = if (dataUrl.contains("base64,")) dataUrl.substringAfter("base64,") else dataUrl
                        val bytes = Base64.decode(base64.trim(), Base64.DEFAULT)
                        val fileName = "${displayName}_${System.currentTimeMillis()}_$i.jpg"

                        val ok = saveImageToGallery(bytes, fileName, subFolder)
                        if (ok) savedCount++
                    }

                    runOnUiThread {
                        if (savedCount > 0) {
                            Toast.makeText(
                                this@MainActivity,
                                "Saved $savedCount photos to $displayPath",
                                Toast.LENGTH_LONG
                            ).show()
                        } else {
                            Toast.makeText(this@MainActivity, "Failed to save photos to Collections", Toast.LENGTH_SHORT).show()
                        }
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                    runOnUiThread {
                        Toast.makeText(this@MainActivity, "Download failed: ${e.message}", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }

        @JavascriptInterface
        fun downloadMultiplePhotosFromGallery(photosJson: String) {
            thread {
                try {
                    val dateStr = getTodayDateString()
                    val batch = getNextGalleryBatchFolder(dateStr)
                    val subFolder = getGallerySubFolder(dateStr, batch)
                    val displayPath = "Pictures/$subFolder/"

                    val jsonArr = JSONArray(photosJson)
                    var savedCount = 0

                    for (i in 0 until jsonArr.length()) {
                        val item = jsonArr.getJSONObject(i)
                        val dataUrl = item.optString("dataUrl", "")
                        if (dataUrl.isBlank()) continue
                        val displayName = item.optString("displayName", "Photo_${i + 1}")
                            .replace(Regex("[^a-zA-Z0-9_-]"), "_")
                        val base64 = if (dataUrl.contains("base64,")) dataUrl.substringAfter("base64,") else dataUrl
                        val bytes = Base64.decode(base64.trim(), Base64.DEFAULT)
                        val fileName = "${displayName}_${System.currentTimeMillis()}_$i.jpg"

                        val ok = saveImageToGallery(bytes, fileName, subFolder)
                        if (ok) savedCount++
                    }

                    runOnUiThread {
                        if (savedCount > 0) {
                            Toast.makeText(
                                this@MainActivity,
                                "Saved $savedCount photos to $displayPath",
                                Toast.LENGTH_LONG
                            ).show()
                        } else {
                            Toast.makeText(this@MainActivity, "Failed to save photos to Gallery", Toast.LENGTH_SHORT).show()
                        }
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                    runOnUiThread {
                        Toast.makeText(this@MainActivity, "Download failed: ${e.message}", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }

        @JavascriptInterface
        fun downloadZip(base64ZipData: String, zipFileName: String) {
            thread {
                try {
                    val base64 = if (base64ZipData.contains("base64,")) {
                        base64ZipData.substringAfter("base64,")
                    } else {
                        base64ZipData
                    }.trim()
                    val bytes = Base64.decode(base64, Base64.DEFAULT)
                    val rawName = zipFileName.substringBeforeLast(".")
                        .ifBlank { "Archive_${System.currentTimeMillis()}" }
                        .replace(Regex("[^a-zA-Z0-9_-]"), "_")
                    val cleanFileName = "$rawName.zip"
                    val nowMs = System.currentTimeMillis()
                    val nowSec = nowMs / 1000

                    var saved = false

                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                        try {
                            val resolver = contentResolver
                            val contentValues = ContentValues().apply {
                                put(MediaStore.Downloads.DISPLAY_NAME, cleanFileName)
                                put(MediaStore.Downloads.MIME_TYPE, "application/zip")
                                put(MediaStore.Downloads.RELATIVE_PATH, "${Environment.DIRECTORY_DOWNLOADS}/AuraPhotoOrganizer/")
                                put(MediaStore.Downloads.DATE_ADDED, nowSec)
                                put(MediaStore.Downloads.DATE_MODIFIED, nowSec)
                                put(MediaStore.Downloads.IS_PENDING, 1)
                            }

                            val collection = MediaStore.Downloads.EXTERNAL_CONTENT_URI
                            val itemUri = resolver.insert(collection, contentValues)

                            if (itemUri != null) {
                                resolver.openOutputStream(itemUri)?.use { out ->
                                    out.write(bytes)
                                    out.flush()
                                }
                                contentValues.clear()
                                contentValues.put(MediaStore.Downloads.IS_PENDING, 0)
                                resolver.update(itemUri, contentValues, null, null)
                                saved = true
                            }
                        } catch (e: Exception) {
                            e.printStackTrace()
                            saved = false
                        }
                    }

                    if (!saved) {
                        try {
                            val downloadDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
                            val appDir = File(downloadDir, "AuraPhotoOrganizer").apply { mkdirs() }
                            val file = File(appDir, cleanFileName)
                            FileOutputStream(file).use {
                                it.write(bytes)
                                it.flush()
                            }
                            MediaScannerConnection.scanFile(
                                this@MainActivity,
                                arrayOf(file.absolutePath),
                                arrayOf("application/zip"),
                                null
                            )
                            saved = true
                        } catch (e: Exception) {
                            e.printStackTrace()
                        }
                    }

                    runOnUiThread {
                        if (saved) {
                            Toast.makeText(
                                this@MainActivity,
                                "ZIP saved to Downloads! (Download/AuraPhotoOrganizer/$cleanFileName)",
                                Toast.LENGTH_LONG
                            ).show()
                        } else {
                            Toast.makeText(this@MainActivity, "Failed to save ZIP", Toast.LENGTH_SHORT).show()
                        }
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                    runOnUiThread {
                        Toast.makeText(this@MainActivity, "ZIP download failed: ${e.message}", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }

        @JavascriptInterface
        fun setPushUpdatesEnabled(enabled: Boolean) {
            getSharedPreferences("app_prefs", MODE_PRIVATE).edit()
                .putBoolean("push_updates_enabled", enabled)
                .apply()

            try {
                // Topic subscription for instant Firebase push updates
                val fcmClass = Class.forName("com.google.firebase.messaging.FirebaseMessaging")
                val getInstanceMethod = fcmClass.getMethod("getInstance")
                val fcmInstance = getInstanceMethod.invoke(null)
                val method = if (enabled) "subscribeToTopic" else "unsubscribeFromTopic"
                val topicMethod = fcmClass.getMethod(method, String::class.java)
                topicMethod.invoke(fcmInstance, "app_updates")
            } catch (e: Exception) {
                // Graceful fallback when running in placeholder/offline mode
            }
        }

        @JavascriptInterface
        fun isPushUpdatesEnabled(): Boolean {
            return getSharedPreferences("app_prefs", MODE_PRIVATE)
                .getBoolean("push_updates_enabled", true)
        }

        @JavascriptInterface
        fun downloadAndInstallUpdate(apkUrl: String, versionName: String) {
            runOnUiThread {
                Toast.makeText(this@MainActivity, "Starting update download...", Toast.LENGTH_SHORT).show()
            }
            thread {
                try {
                    val updatesDir = File(cacheDir, "updates").apply { mkdirs() }
                    val cleanVersion = versionName.replace(Regex("[^a-zA-Z0-9_.-]"), "_")
                    val apkFile = File(updatesDir, "aura_update_$cleanVersion.apk")

                    if (apkUrl.startsWith("http://") || apkUrl.startsWith("https://")) {
                        val url = java.net.URL(apkUrl)
                        val connection = url.openConnection()
                        connection.connectTimeout = 15000
                        connection.readTimeout = 30000
                        val totalBytes = connection.contentLength

                        connection.getInputStream().use { input ->
                            FileOutputStream(apkFile).use { output ->
                                val buffer = ByteArray(8192)
                                var read: Int
                                var downloaded = 0L
                                while (input.read(buffer).also { read = it } != -1) {
                                    output.write(buffer, 0, read)
                                    downloaded += read
                                    if (totalBytes > 0) {
                                        val percent = ((downloaded * 100) / totalBytes).toInt()
                                        runOnUiThread {
                                            webView?.evaluateJavascript("window.onUpdateDownloadProgress && window.onUpdateDownloadProgress($percent)", null)
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (apkFile.exists() && apkFile.length() > 0) {
                        runOnUiThread {
                            installApk(apkFile)
                        }
                    } else {
                        runOnUiThread {
                            Toast.makeText(this@MainActivity, "Update file not found or download incomplete", Toast.LENGTH_LONG).show()
                        }
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                    runOnUiThread {
                        Toast.makeText(this@MainActivity, "Download failed: ${e.message}", Toast.LENGTH_LONG).show()
                    }
                }
            }
        }

        @JavascriptInterface
        fun submitFeedbackToFirebase(feedbackJson: String) {
            thread {
                try {
                    // 1. Permanently cache feedback locally in cache/feedback so submissions are never lost
                    val feedbackDir = File(cacheDir, "feedback").apply { mkdirs() }
                    val feedbackFile = File(feedbackDir, "feedback_${System.currentTimeMillis()}.json")
                    feedbackFile.writeText(feedbackJson)

                    // 2. Dispatch directly to Firebase Realtime Database
                    val projectId = "aura-photo-organizer-dummy"
                    val firebaseUrl = "https://$projectId-default-rtdb.firebaseio.com/feedback.json"

                    try {
                        val url = java.net.URL(firebaseUrl)
                        val conn = url.openConnection() as java.net.HttpURLConnection
                        conn.requestMethod = "POST"
                        conn.setRequestProperty("Content-Type", "application/json; charset=utf-8")
                        conn.connectTimeout = 10000
                        conn.readTimeout = 15000
                        conn.doOutput = true

                        conn.outputStream.use { os ->
                            os.write(feedbackJson.toByteArray(Charsets.UTF_8))
                            os.flush()
                        }
                        val responseCode = conn.responseCode
                        android.util.Log.d("AuraFeedback", "Feedback uploaded to Firebase, response code: $responseCode")
                    } catch (netEx: Exception) {
                        // Safe offline resilience: feedback is persisted in cacheDir/feedback for future sync
                        android.util.Log.w("AuraFeedback", "Direct Firebase upload deferred: ${netEx.message}")
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }

        @JavascriptInterface
        fun isNative(): Boolean = true
    }

    private fun installApk(file: File) {
        try {
            val apkUri = FileProvider.getUriForFile(this, "${applicationInfo.packageName}.provider", file)
            val intent = Intent(Intent.ACTION_VIEW).apply {
                setDataAndType(apkUri, "application/vnd.android.package-archive")
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            startActivity(intent)
        } catch (e: Exception) {
            e.printStackTrace()
            Toast.makeText(this, "Failed to launch installer: ${e.message}", Toast.LENGTH_LONG).show()
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        cameraImagesDir = File(cacheDir, "camera_images").apply { mkdirs() }

        // Initialize Native Hardware Motion & Gyroscope Sensors
        sensorManager = getSystemService(SENSOR_SERVICE) as? SensorManager
        rotationSensor = sensorManager?.getDefaultSensor(Sensor.TYPE_ROTATION_VECTOR)
        accelSensor = sensorManager?.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)

        val wv = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.databaseEnabled = true
            settings.allowFileAccess = true
            settings.allowContentAccess = true
            settings.loadWithOverviewMode = true
            settings.useWideViewPort = true
            settings.setSupportZoom(false)
            settings.setGeolocationEnabled(true)
            settings.cacheMode = WebSettings.LOAD_DEFAULT

            // Bridge native camera & gallery to JS
            addJavascriptInterface(AndroidAppInterface(), "AndroidApp")

            webViewClient = object : WebViewClient() {
                override fun onPageFinished(view: WebView?, url: String?) {
                    super.onPageFinished(view, url)
                    val statusBarInsets = ViewCompat.getRootWindowInsets(window.decorView)?.getInsets(WindowInsetsCompat.Type.statusBars())
                    val density = resources.displayMetrics.density
                    val topDp = if (statusBarInsets != null && density > 0) (statusBarInsets.top / density).toInt() else 40
                    val safeTop = if (topDp > 0) topDp else 40
                    // Ensure the app displays in full native screen mode without webpage shell
                    view?.evaluateJavascript(
                        "document.documentElement.classList.add('native-app-mode'); document.body.classList.add('native-app-mode'); document.documentElement.style.setProperty('--android-status-bar-height', '${safeTop}px');",
                        null
                    )
                }
            }

            webChromeClient = object : WebChromeClient() {
                override fun onGeolocationPermissionsShowPrompt(
                    origin: String?,
                    callback: android.webkit.GeolocationPermissions.Callback?
                ) {
                    callback?.invoke(origin, true, false)
                }

                override fun onShowFileChooser(
                    webView: WebView?,
                    filePathCallback: ValueCallback<Array<Uri>>?,
                    fileChooserParams: FileChooserParams?
                ): Boolean {
                    this@MainActivity.filePathCallback?.onReceiveValue(null)
                    this@MainActivity.filePathCallback = filePathCallback
                    val isCapture = fileChooserParams?.isCaptureEnabled == true
                    if (isCapture) {
                        launchCamera()
                    } else {
                        launchGallery()
                    }
                    return true
                }
            }

            loadUrl("file:///android_asset/web/index.html")
        }

        webView = wv
        setContentView(wv)

        ViewCompat.setOnApplyWindowInsetsListener(wv) { view, insets ->
            val statusBarInsets = insets.getInsets(WindowInsetsCompat.Type.statusBars())
            val density = resources.displayMetrics.density
            val topDp = if (density > 0) (statusBarInsets.top / density).toInt() else 40
            val safeTop = if (topDp > 0) topDp else 40
            (view as? WebView)?.evaluateJavascript(
                "document.documentElement.style.setProperty('--android-status-bar-height', '${safeTop}px');",
                null
            )
            insets
        }

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                webView?.evaluateJavascript(
                    "(function() { return (typeof window.handleNativeBackPressed === 'function') ? window.handleNativeBackPressed() : false; })()"
                ) { result ->
                    val handled = result?.trim()?.equals("true", ignoreCase = true) == true
                    if (!handled) {
                        if (webView?.canGoBack() == true) {
                            webView?.goBack()
                        } else {
                            isEnabled = false
                            onBackPressedDispatcher.onBackPressed()
                        }
                    }
                }
            }
        })
    }

    override fun onResume() {
        super.onResume()
        // Reset flags when activity regains focus (e.g., user backed out of camera or returned)
        isCameraLaunching = false
        isGalleryLaunching = false

        // Register hardware sensors for butter-smooth 60fps 3D parallax & shake physics
        rotationSensor?.let {
            sensorManager?.registerListener(this, it, SensorManager.SENSOR_DELAY_GAME)
        }
        accelSensor?.let {
            sensorManager?.registerListener(this, it, SensorManager.SENSOR_DELAY_UI)
        }

        // If app lock is enabled and locked, make sure lock screen overlay is visible
        runOnUiThread {
            webView?.evaluateJavascript(
                "if (window.state && window.state.biometricLock && window.state.isAppLocked) { if (window.showAppLock) window.showAppLock(); }",
                null
            )
        }
    }

    override fun onPause() {
        super.onPause()
        sensorManager?.unregisterListener(this)
        // Instantly lock the app when minimized or backgrounded if biometric lock is enabled
        runOnUiThread {
            webView?.evaluateJavascript(
                "if (window.state && window.state.biometricLock) { window.state.isAppLocked = true; if (window.showAppLock) window.showAppLock(); }",
                null
            )
        }
    }

    override fun onSensorChanged(event: SensorEvent?) {
        if (event == null) return
        val now = System.currentTimeMillis()

        // 1. Gyroscope / 3D Orientation tracking (~60fps throttled to 16ms)
        if (event.sensor.type == Sensor.TYPE_ROTATION_VECTOR) {
            if (now - lastNativeGyroDispatchTime >= 16) {
                lastNativeGyroDispatchTime = now
                SensorManager.getRotationMatrixFromVector(rotationMatrix, event.values)
                SensorManager.getOrientation(rotationMatrix, orientationAngles)
                // orientationAngles[1] = pitch (radians), orientationAngles[2] = roll (radians)
                val pitchDeg = Math.toDegrees(orientationAngles[1].toDouble())
                val rollDeg = Math.toDegrees(orientationAngles[2].toDouble())
                val js = "window.Aura3DMotionPhysics && window.Aura3DMotionPhysics.onNativeOrientation && window.Aura3DMotionPhysics.onNativeOrientation(${String.format(java.util.Locale.US, "%.2f", pitchDeg)}, ${String.format(java.util.Locale.US, "%.2f", rollDeg)});"
                runOnUiThread {
                    webView?.evaluateJavascript(js, null)
                }
            }
        }

        // 2. Physical Shake Detection via Accelerometer (Threshold ~13.5 m/s² delta, debounce 800ms)
        if (event.sensor.type == Sensor.TYPE_ACCELEROMETER) {
            val ax = event.values[0]
            val ay = event.values[1]
            val az = event.values[2]
            val dx = ax - lastNativeAccel[0]
            val dy = ay - lastNativeAccel[1]
            val dz = az - lastNativeAccel[2]
            lastNativeAccel[0] = ax
            lastNativeAccel[1] = ay
            lastNativeAccel[2] = az

            val deltaAccel = Math.sqrt((dx * dx + dy * dy + dz * dz).toDouble())
            if (deltaAccel > 13.5 && now - lastNativeShakeTime > 800) {
                lastNativeShakeTime = now
                val jsShake = "window.Aura3DMotionPhysics && window.Aura3DMotionPhysics.triggerShakeWave && window.Aura3DMotionPhysics.triggerShakeWave();"
                runOnUiThread {
                    webView?.evaluateJavascript(jsShake, null)
                }
            }
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
}
