package com.example.data

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.UUID

@Entity(tableName = "photos")
data class Photo(
    @PrimaryKey val id: String = UUID.randomUUID().toString(),
    val localUri: String,
    val originalFilename: String,
    val displayName: String,
    val createdAt: Long = System.currentTimeMillis(),
    val importedAt: Long = System.currentTimeMillis(),
    val isPending: Boolean = true,
    val deletedAt: Long? = null,
    val isFavorite: Boolean = false
)
