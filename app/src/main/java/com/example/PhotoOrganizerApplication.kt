package com.example

import android.app.Application
import com.example.data.AppDatabase

class PhotoOrganizerApplication : Application() {
    val database by lazy { AppDatabase.getDatabase(this) }
}
