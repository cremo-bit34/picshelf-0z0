package com.example.data

import android.content.Context
import android.graphics.*
import androidx.core.content.FileProvider
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileOutputStream
import java.util.UUID

class PhotoRepository(private val dao: PhotoDao) {
    fun getGalleryPhotos(): Flow<List<PhotoWithTags>> = dao.getGalleryPhotos()
    fun getPendingPhotos(): Flow<List<PhotoWithTags>> = dao.getPendingPhotos()
    fun getTrashPhotos(): Flow<List<PhotoWithTags>> = dao.getTrashPhotos()
    fun getFavoritePhotos(): Flow<List<PhotoWithTags>> = dao.getFavoritePhotos()
    fun getAllTags(): Flow<List<Tag>> = dao.getAllTags()
    fun searchPhotos(query: String): Flow<List<PhotoWithTags>> = dao.searchPhotos(query)

    suspend fun insertPhoto(photo: Photo) = dao.insertPhoto(photo)
    suspend fun updatePhoto(photo: Photo) = dao.updatePhoto(photo)
    suspend fun updatePhotos(photos: List<Photo>) = dao.updatePhotos(photos)
    suspend fun deletePhotoPermanently(photoId: String) = dao.deletePhotoPermanently(photoId)
    
    suspend fun toggleFavorite(photoId: String, isFavorite: Boolean) = dao.updateFavoriteStatus(photoId, isFavorite)
    
    suspend fun getPhotoWithTagsSync(photoId: String): PhotoWithTags? = dao.getPhotoWithTagsSync(photoId)

    suspend fun insertTag(name: String, color: Long? = null) {
        dao.insertTag(Tag(name = name, color = color))
    }
    
    suspend fun deleteTag(name: String) = dao.deleteTag(name)
    
    suspend fun renameTag(oldName: String, newName: String) = dao.renameTag(oldName, newName)

    suspend fun updateTagColor(name: String, color: Long?) = dao.updateTagColor(name, color)

    suspend fun addTagToPhoto(photoId: String, tagName: String) {
        dao.insertTag(Tag(name = tagName))
        dao.insertPhotoTag(PhotoTagCrossRef(photoId, tagName))
    }

    suspend fun assignTagsToPhotos(photoIds: List<String>, tagNames: List<String>) {
        tagNames.forEach { dao.insertTag(Tag(it)) }
        val refs = photoIds.flatMap { photoId ->
            tagNames.map { tagName -> PhotoTagCrossRef(photoId, tagName) }
        }
        dao.insertPhotoTags(refs)
    }

    suspend fun removeTagFromPhoto(photoId: String, tagName: String) {
        dao.deletePhotoTag(photoId, tagName)
    }

    suspend fun emptyTrash() {
        dao.emptyTrash()
    }
    
    suspend fun cleanOldTrash() {
        val retention = 30L * 24 * 60 * 60 * 1000 // 30 days
        val threshold = System.currentTimeMillis() - retention
        dao.cleanOldTrash(threshold)
    }

    private fun createSampleBitmapFile(
        file: File,
        title: String,
        category: String,
        gradientColors: IntArray
    ) {
        val width = 1080
        val height = 1080
        val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)

        val shader = LinearGradient(
            0f, 0f, width.toFloat(), height.toFloat(),
            gradientColors,
            null,
            Shader.TileMode.CLAMP
        )
        val paint = Paint().apply {
            isAntiAlias = true
            this.shader = shader
        }
        canvas.drawRect(0f, 0f, width.toFloat(), height.toFloat(), paint)

        // Draw decorative art shapes
        val circlePaint = Paint().apply {
            isAntiAlias = true
            color = Color.WHITE
            alpha = 35
        }
        canvas.drawCircle(width * 0.85f, height * 0.18f, 320f, circlePaint)
        canvas.drawCircle(width * 0.15f, height * 0.85f, 260f, circlePaint)

        // Draw Category Badge
        val badgePaint = Paint().apply {
            isAntiAlias = true
            color = Color.argb(140, 15, 23, 42)
        }
        val badgeRect = RectF(60f, 60f, 420f, 140f)
        canvas.drawRoundRect(badgeRect, 40f, 40f, badgePaint)

        val badgeTextPaint = Paint().apply {
            isAntiAlias = true
            color = Color.WHITE
            textSize = 38f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
        }
        canvas.drawText(category.uppercase(), 95f, 114f, badgeTextPaint)

        // Draw Title Text
        val titlePaint = Paint().apply {
            isAntiAlias = true
            color = Color.WHITE
            textSize = 68f
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            setShadowLayer(14f, 2f, 4f, Color.argb(140, 0, 0, 0))
        }
        canvas.drawText(title, 60f, height - 120f, titlePaint)

        FileOutputStream(file).use { out ->
            bitmap.compress(Bitmap.CompressFormat.JPEG, 92, out)
        }
        bitmap.recycle()
    }

    suspend fun populateDummyDataIfNeeded(context: Context) {
        if (dao.getPhotoCount() == 0) {
            withContext(Dispatchers.IO) {
                // Predefined tags with colors
                val tagsWithColors = listOf(
                    Tag("Wedding", 0xFFE11D48),
                    Tag("Birthday", 0xFFD97706),
                    Tag("Job Offer", 0xFF059669),
                    Tag("Dinner with Family", 0xFF7C3AED),
                    Tag("Trip", 0xFF0284C7)
                )
                dao.insertTags(tagsWithColors)

                val imagesDir = File(context.cacheDir, "camera_images").apply { mkdirs() }
                val now = System.currentTimeMillis()
                val oneDay = 24L * 60 * 60 * 1000

                // Sample specifications
                data class SamplePhotoSpec(
                    val id: String,
                    val filename: String,
                    val displayName: String,
                    val category: String,
                    val isPending: Boolean,
                    val daysAgo: Long,
                    val tags: List<String>,
                    val gradient: IntArray
                )

                val sampleSpecs = listOf(
                    // Pending photos (In Loading Dock!)
                    SamplePhotoSpec(
                        id = "pending_1",
                        filename = "Camera_Floral_Decor.jpg",
                        displayName = "Floral Table Decor",
                        category = "Loading Dock",
                        isPending = true,
                        daysAgo = 0,
                        tags = emptyList(),
                        gradient = intArrayOf(Color.rgb(236, 72, 153), Color.rgb(244, 63, 94))
                    ),
                    SamplePhotoSpec(
                        id = "pending_2",
                        filename = "Import_Birthday_Candles.jpg",
                        displayName = "Birthday Candles Glow",
                        category = "Loading Dock",
                        isPending = true,
                        daysAgo = 0,
                        tags = emptyList(),
                        gradient = intArrayOf(Color.rgb(245, 158, 11), Color.rgb(234, 88, 12))
                    ),
                    SamplePhotoSpec(
                        id = "pending_3",
                        filename = "Camera_Offer_Letter.jpg",
                        displayName = "Signed Offer Letter",
                        category = "Loading Dock",
                        isPending = true,
                        daysAgo = 0,
                        tags = emptyList(),
                        gradient = intArrayOf(Color.rgb(16, 185, 129), Color.rgb(5, 150, 105))
                    ),

                    // Gallery Tagged Photos
                    SamplePhotoSpec(
                        id = "gallery_1",
                        filename = "Wedding_Vows_Exchange.jpg",
                        displayName = "Wedding Vows Exchange",
                        category = "Wedding",
                        isPending = false,
                        daysAgo = 8,
                        tags = listOf("Wedding"),
                        gradient = intArrayOf(Color.rgb(225, 29, 72), Color.rgb(159, 18, 57))
                    ),
                    SamplePhotoSpec(
                        id = "gallery_2",
                        filename = "Wedding_First_Dance.jpg",
                        displayName = "First Dance Magic",
                        category = "Wedding",
                        isPending = false,
                        daysAgo = 8,
                        tags = listOf("Wedding"),
                        gradient = intArrayOf(Color.rgb(190, 18, 60), Color.rgb(136, 19, 55))
                    ),
                    SamplePhotoSpec(
                        id = "gallery_3",
                        filename = "20th_Birthday_Celebration.jpg",
                        displayName = "20th Birthday Bash",
                        category = "Birthday",
                        isPending = false,
                        daysAgo = 20,
                        tags = listOf("Birthday", "Dinner with Family"),
                        gradient = intArrayOf(Color.rgb(245, 158, 11), Color.rgb(217, 119, 6))
                    ),
                    SamplePhotoSpec(
                        id = "gallery_4",
                        filename = "Birthday_Party_Gifts.jpg",
                        displayName = "Birthday Party Surprises",
                        category = "Birthday",
                        isPending = false,
                        daysAgo = 20,
                        tags = listOf("Birthday"),
                        gradient = intArrayOf(Color.rgb(251, 146, 60), Color.rgb(234, 88, 12))
                    ),
                    SamplePhotoSpec(
                        id = "gallery_5",
                        filename = "New_Job_First_Day.jpg",
                        displayName = "Excited First Day at Work",
                        category = "Job Offer",
                        isPending = false,
                        daysAgo = 2,
                        tags = listOf("Job Offer"),
                        gradient = intArrayOf(Color.rgb(16, 185, 129), Color.rgb(13, 148, 136))
                    ),
                    SamplePhotoSpec(
                        id = "gallery_6",
                        filename = "Family_Sunday_Dinner.jpg",
                        displayName = "Grandma's Sunday Dinner",
                        category = "Family",
                        isPending = false,
                        daysAgo = 5,
                        tags = listOf("Dinner with Family"),
                        gradient = intArrayOf(Color.rgb(139, 92, 246), Color.rgb(109, 40, 217))
                    ),
                    SamplePhotoSpec(
                        id = "gallery_7",
                        filename = "Mountain_Sunset_Trail.jpg",
                        displayName = "Rocky Mountain Sunset",
                        category = "Trip",
                        isPending = false,
                        daysAgo = 35,
                        tags = listOf("Trip"),
                        gradient = intArrayOf(Color.rgb(14, 165, 233), Color.rgb(3, 105, 161))
                    )
                )

                sampleSpecs.forEach { spec ->
                    try {
                        val file = File(imagesDir, spec.filename)
                        if (!file.exists()) {
                            createSampleBitmapFile(
                                file = file,
                                title = spec.displayName,
                                category = spec.category,
                                gradientColors = spec.gradient
                            )
                        }

                        val uri = FileProvider.getUriForFile(
                            context,
                            "${context.packageName}.provider",
                            file
                        ).toString()

                        val createdAtTimestamp = now - (spec.daysAgo * oneDay)

                        dao.insertPhoto(
                            Photo(
                                id = spec.id,
                                localUri = uri,
                                originalFilename = spec.filename,
                                displayName = spec.displayName,
                                createdAt = createdAtTimestamp,
                                importedAt = createdAtTimestamp,
                                isPending = spec.isPending,
                                isFavorite = spec.tags.contains("Birthday") || spec.tags.contains("Job Offer")
                            )
                        )

                        spec.tags.forEach { tag ->
                            dao.insertPhotoTag(PhotoTagCrossRef(spec.id, tag))
                        }
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }
            }
        }
    }
}
