package com.example.data

import androidx.room.Embedded
import androidx.room.Junction
import androidx.room.Relation

data class PhotoWithTags(
    @Embedded val photo: Photo,
    @Relation(
        parentColumn = "id",
        entityColumn = "name",
        associateBy = Junction(
            value = PhotoTagCrossRef::class,
            parentColumn = "photoId",
            entityColumn = "tagName"
        )
    )
    val tags: List<Tag>
)
