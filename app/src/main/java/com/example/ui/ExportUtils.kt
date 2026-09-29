package com.example.ui

import android.content.ContentValues
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import androidx.core.content.FileProvider
import com.example.data.PhotoWithTags
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.BufferedOutputStream
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

object ExportUtils {
    
    suspend fun createZipExport(context: Context, photos: List<PhotoWithTags>, collectionName: String): File? = withContext(Dispatchers.IO) {
        if (photos.isEmpty()) return@withContext null
        
        val cacheDir = File(context.cacheDir, "exports").apply { mkdirs() }
        val zipFile = File(cacheDir, "${collectionName.replace(" ", "_")}.zip")
        
        try {
            val usedNames = mutableSetOf<String>()
            ZipOutputStream(BufferedOutputStream(FileOutputStream(zipFile))).use { out ->
                photos.forEachIndexed { index, photoWithTags ->
                    val sourceUri = Uri.parse(photoWithTags.photo.localUri)
                    val inputStream = context.contentResolver.openInputStream(sourceUri) ?: return@forEachIndexed
                    
                    var entryName = photoWithTags.photo.originalFilename.ifBlank { "photo_${photoWithTags.photo.id}.jpg" }
                    if (usedNames.contains(entryName)) {
                        val ext = entryName.substringAfterLast('.', "jpg")
                        val base = entryName.substringBeforeLast('.')
                        entryName = "${base}_${index + 1}.$ext"
                    }
                    usedNames.add(entryName)

                    val entry = ZipEntry(entryName)
                    out.putNextEntry(entry)
                    
                    inputStream.use { input ->
                        input.copyTo(out)
                    }
                    out.closeEntry()
                }
            }
            return@withContext zipFile
        } catch (e: Exception) {
            e.printStackTrace()
            return@withContext null
        }
    }

    fun shareZipFile(context: Context, zipFile: File) {
        val uri = FileProvider.getUriForFile(
            context,
            "${context.packageName}.provider",
            zipFile
        )
        
        val intent = Intent(Intent.ACTION_SEND).apply {
            type = "application/zip"
            putExtra(Intent.EXTRA_STREAM, uri)
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }
        
        context.startActivity(Intent.createChooser(intent, "Share Collection"))
    }

    suspend fun saveToDownloads(context: Context, zipFile: File): Boolean = withContext(Dispatchers.IO) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val contentValues = ContentValues().apply {
                put(MediaStore.Downloads.DISPLAY_NAME, zipFile.name)
                put(MediaStore.Downloads.MIME_TYPE, "application/zip")
                put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS)
            }
            
            val uri = context.contentResolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, contentValues)
            if (uri != null) {
                try {
                    context.contentResolver.openOutputStream(uri)?.use { out ->
                        FileInputStream(zipFile).use { input ->
                            input.copyTo(out)
                        }
                    }
                    return@withContext true
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        } else {
            val downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
            val destFile = File(downloadsDir, zipFile.name)
            try {
                zipFile.copyTo(destFile, overwrite = true)
                return@withContext true
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
        return@withContext false
    }

    const val APP_FOLDER_NAME = "PhotoOrganizer"

    data class SaveResult(
        val success: Boolean,
        val fullDisplayPath: String,
        val fileName: String = "",
        val count: Int = 1
    )

    fun getTodayDateString(): String {
        return java.text.SimpleDateFormat("dd-MM-yy", java.util.Locale.US).format(java.util.Date())
    }

    @Synchronized
    fun getNextGalleryBatchFolder(context: Context, dateStr: String = getTodayDateString()): String {
        val prefs = context.getSharedPreferences("photo_organizer_export_prefs", Context.MODE_PRIVATE)
        val key = "gallery_batch_$dateStr"
        val nextNum = prefs.getInt(key, 0) + 1
        prefs.edit().putInt(key, nextNum).apply()
        return String.format(java.util.Locale.US, "%03d", nextNum)
    }

    fun getCollectionsRelativePath(albumName: String, dateStr: String = getTodayDateString()): String {
        val cleanAlbum = albumName.trim()
            .replace(Regex("[^a-zA-Z0-9_ -]"), "_")
            .ifBlank { "Collection" }
        return "$APP_FOLDER_NAME/Collections/$dateStr/$cleanAlbum"
    }

    fun getGalleryRelativePath(context: Context, dateStr: String = getTodayDateString(), batchFolder: String? = null): String {
        val batch = batchFolder ?: getNextGalleryBatchFolder(context, dateStr)
        return "$APP_FOLDER_NAME/Gallery Images/$dateStr/$batch"
    }

    suspend fun savePhotoToGallery(
        context: Context,
        photoWithTags: PhotoWithTags,
        isFromCollection: Boolean = false,
        albumName: String? = null,
        batchFolder: String? = null
    ): SaveResult = withContext(Dispatchers.IO) {
        val nowMs = System.currentTimeMillis()
        val nowSec = nowMs / 1000
        val rawName = photoWithTags.photo.displayName.ifBlank { "Photo_$nowMs" }
            .replace(Regex("[^a-zA-Z0-9_-]"), "_")
        val cleanFileName = "$rawName.jpg"
        val mimeType = "image/jpeg"
        val sourceUri = Uri.parse(photoWithTags.photo.localUri)

        val dateStr = getTodayDateString()
        val subPath = if (isFromCollection && !albumName.isNullOrBlank()) {
            getCollectionsRelativePath(albumName, dateStr)
        } else {
            getGalleryRelativePath(context, dateStr, batchFolder)
        }

        val relativePath = "${Environment.DIRECTORY_PICTURES}/$subPath/"
        val displayPath = "Pictures/$subPath/"

        var saved = false
        var scannedPath: String? = null

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            try {
                val resolver = context.contentResolver
                val contentValues = ContentValues().apply {
                    put(MediaStore.Images.Media.DISPLAY_NAME, cleanFileName)
                    put(MediaStore.Images.Media.MIME_TYPE, mimeType)
                    put(MediaStore.Images.Media.RELATIVE_PATH, relativePath)
                    put(MediaStore.Images.Media.DATE_ADDED, nowSec)
                    put(MediaStore.Images.Media.DATE_MODIFIED, nowSec)
                    put(MediaStore.Images.Media.DATE_TAKEN, nowMs)
                    put(MediaStore.Images.Media.IS_PENDING, 1)
                }

                val itemUri = resolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, contentValues)
                if (itemUri != null) {
                    resolver.openOutputStream(itemUri)?.use { out ->
                        resolver.openInputStream(sourceUri)?.use { input ->
                            input.copyTo(out)
                        }
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
                        android.media.MediaScannerConnection.scanFile(
                            context,
                            arrayOf(scannedPath),
                            arrayOf(mimeType),
                            null
                        )
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }

        if (!saved) {
            try {
                val picturesDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES)
                val targetDir = File(picturesDir, subPath).apply { mkdirs() }
                val file = File(targetDir, cleanFileName)
                FileOutputStream(file).use { out ->
                    context.contentResolver.openInputStream(sourceUri)?.use { input ->
                        input.copyTo(out)
                    }
                    out.flush()
                }
                android.media.MediaScannerConnection.scanFile(
                    context,
                    arrayOf(file.absolutePath),
                    arrayOf(mimeType),
                    null
                )
                saved = true
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }

        return@withContext SaveResult(
            success = saved,
            fullDisplayPath = displayPath,
            fileName = cleanFileName,
            count = if (saved) 1 else 0
        )
    }

    suspend fun savePhotosToGallery(
        context: Context,
        photos: List<PhotoWithTags>,
        isFromCollection: Boolean = false,
        albumName: String? = null
    ): SaveResult = withContext(Dispatchers.IO) {
        if (photos.isEmpty()) {
            return@withContext SaveResult(false, "", "", 0)
        }

        val dateStr = getTodayDateString()
        // If from gallery, all photos in this batch share the SAME batch folder (e.g. 001)
        val batchFolder = if (!isFromCollection) getNextGalleryBatchFolder(context, dateStr) else null
        val subPath = if (isFromCollection && !albumName.isNullOrBlank()) {
            getCollectionsRelativePath(albumName, dateStr)
        } else {
            getGalleryRelativePath(context, dateStr, batchFolder)
        }
        val displayPath = "Pictures/$subPath/"

        var count = 0
        photos.forEach { photo ->
            val res = savePhotoToGallery(
                context = context,
                photoWithTags = photo,
                isFromCollection = isFromCollection,
                albumName = albumName,
                batchFolder = batchFolder
            )
            if (res.success) {
                count++
            }
        }

        return@withContext SaveResult(
            success = count > 0,
            fullDisplayPath = displayPath,
            count = count
        )
    }
}
