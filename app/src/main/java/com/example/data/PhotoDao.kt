package com.example.data

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface PhotoDao {
    @Query("SELECT COUNT(*) FROM photos")
    suspend fun getPhotoCount(): Int

    @Transaction
    @Query("SELECT * FROM photos WHERE isPending = 0 AND deletedAt IS NULL ORDER BY createdAt DESC")
    fun getGalleryPhotos(): Flow<List<PhotoWithTags>>

    @Transaction
    @Query("SELECT * FROM photos WHERE isFavorite = 1 AND deletedAt IS NULL ORDER BY createdAt DESC")
    fun getFavoritePhotos(): Flow<List<PhotoWithTags>>

    @Query("UPDATE photos SET isFavorite = :isFavorite WHERE id = :photoId")
    suspend fun updateFavoriteStatus(photoId: String, isFavorite: Boolean)

    @Transaction
    @Query("SELECT * FROM photos WHERE isPending = 1 AND deletedAt IS NULL ORDER BY createdAt DESC")
    fun getPendingPhotos(): Flow<List<PhotoWithTags>>
    
    @Transaction
    @Query("SELECT * FROM photos WHERE deletedAt IS NOT NULL ORDER BY deletedAt DESC")
    fun getTrashPhotos(): Flow<List<PhotoWithTags>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPhoto(photo: Photo)

    @Update
    suspend fun updatePhoto(photo: Photo)

    @Update
    suspend fun updatePhotos(photos: List<Photo>)

    @Query("DELETE FROM photo_tags WHERE photoId = :photoId")
    suspend fun deletePhotoTagsForPhoto(photoId: String)

    @Query("DELETE FROM photo_tags WHERE tagName = :tagName")
    suspend fun deletePhotoTagsForTag(tagName: String)

    @Transaction
    suspend fun deletePhotoPermanently(photoId: String) {
        deletePhotoTagsForPhoto(photoId)
        deletePhotoById(photoId)
    }

    @Query("DELETE FROM photos WHERE id = :photoId")
    suspend fun deletePhotoById(photoId: String)
    
    @Transaction
    suspend fun emptyTrash() {
        deleteTrashPhotoTags()
        deleteAllTrashPhotos()
    }

    @Query("DELETE FROM photo_tags WHERE photoId IN (SELECT id FROM photos WHERE deletedAt IS NOT NULL)")
    suspend fun deleteTrashPhotoTags()

    @Query("DELETE FROM photos WHERE deletedAt IS NOT NULL")
    suspend fun deleteAllTrashPhotos()

    @Query("DELETE FROM photo_tags WHERE photoId IN (SELECT id FROM photos WHERE deletedAt IS NOT NULL AND deletedAt < :retentionThreshold)")
    suspend fun deleteOldTrashPhotoTags(retentionThreshold: Long)

    @Query("DELETE FROM photos WHERE deletedAt IS NOT NULL AND deletedAt < :retentionThreshold")
    suspend fun deleteOldTrashPhotos(retentionThreshold: Long)

    @Transaction
    suspend fun cleanOldTrash(retentionThreshold: Long) {
        deleteOldTrashPhotoTags(retentionThreshold)
        deleteOldTrashPhotos(retentionThreshold)
    }

    @Query("SELECT * FROM tags ORDER BY name ASC")
    fun getAllTags(): Flow<List<Tag>>

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insertTag(tag: Tag)

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insertTags(tags: List<Tag>)

    @Query("UPDATE tags SET color = :color WHERE name = :tagName")
    suspend fun updateTagColor(tagName: String, color: Long?)

    @Query("DELETE FROM tags WHERE name = :tagName")
    suspend fun deleteTagOnly(tagName: String)

    @Transaction
    suspend fun deleteTag(tagName: String) {
        deletePhotoTagsForTag(tagName)
        deleteTagOnly(tagName)
    }

    @Query("SELECT * FROM tags WHERE name = :tagName")
    suspend fun getTagSync(tagName: String): Tag?

    @Query("UPDATE photo_tags SET tagName = :newName WHERE tagName = :oldName")
    suspend fun renameTagInCrossRef(oldName: String, newName: String)

    @Transaction
    suspend fun renameTag(oldName: String, newName: String) {
        if (oldName == newName) return
        val oldTag = getTagSync(oldName) ?: return
        val existingNew = getTagSync(newName)
        if (existingNew == null) {
            insertTag(Tag(name = newName, color = oldTag.color))
        }
        renameTagInCrossRef(oldName, newName)
        deleteTagOnly(oldName)
    }

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insertPhotoTag(crossRef: PhotoTagCrossRef)

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insertPhotoTags(crossRefs: List<PhotoTagCrossRef>)

    @Query("DELETE FROM photo_tags WHERE photoId = :photoId AND tagName = :tagName")
    suspend fun deletePhotoTag(photoId: String, tagName: String)

    @Transaction
    @Query("SELECT * FROM photos WHERE isPending = 0 AND deletedAt IS NULL AND (displayName LIKE '%' || :query || '%' OR id IN (SELECT photoId FROM photo_tags WHERE tagName LIKE '%' || :query || '%')) ORDER BY createdAt DESC")
    fun searchPhotos(query: String): Flow<List<PhotoWithTags>>
    
    @Transaction
    @Query("SELECT * FROM photos WHERE id = :photoId")
    suspend fun getPhotoWithTagsSync(photoId: String): PhotoWithTags?
}
