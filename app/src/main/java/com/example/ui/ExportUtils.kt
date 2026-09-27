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
}
