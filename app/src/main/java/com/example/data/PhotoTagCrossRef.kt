package com.example.data

import androidx.room.Entity
import androidx.room.Index

@Entity(
    tableName = "photo_tags",
    primaryKeys = ["photoId", "tagName"],
    indices = [Index(value = ["tagName"])]
)
data class PhotoTagCrossRef(
    val photoId: String,
    val tagName: String
)
