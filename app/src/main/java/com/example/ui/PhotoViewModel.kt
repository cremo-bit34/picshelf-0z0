package com.example.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.data.Photo
import com.example.data.PhotoRepository
import com.example.data.PhotoWithTags
import com.example.data.Tag
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.util.UUID

class PhotoViewModel(private val repository: PhotoRepository) : ViewModel() {

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery

    private val _startDate = MutableStateFlow<Long?>(null)
    val startDate: StateFlow<Long?> = _startDate

    private val _endDate = MutableStateFlow<Long?>(null)
    val endDate: StateFlow<Long?> = _endDate

    private val _selectedTags = MutableStateFlow<Set<String>>(emptySet())
    val selectedTags: StateFlow<Set<String>> = _selectedTags

    private val _filterOnlyFavorites = MutableStateFlow(false)
    val filterOnlyFavorites: StateFlow<Boolean> = _filterOnlyFavorites

    // Unfiltered gallery photos (Used by Albums screen so album counts & photos are never corrupted by temporary filters!)
    val allGalleryPhotos: StateFlow<List<PhotoWithTags>> = repository.getGalleryPhotos()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Filtered gallery photos (Used for the interactive Gallery grid)
    val galleryPhotos: StateFlow<List<PhotoWithTags>> = combine(
        allGalleryPhotos,
        _searchQuery,
        combine(_startDate, _endDate) { s, e -> Pair(s, e) },
        _selectedTags,
        _filterOnlyFavorites
    ) { photos, query, dateRange, tags, onlyFavorites ->
        val (start, end) = dateRange
        var filtered = photos
        if (onlyFavorites) {
            filtered = filtered.filter { it.photo.isFavorite }
        }
        if (query.isNotBlank()) {
            filtered = filtered.filter { p ->
                p.photo.displayName.contains(query, ignoreCase = true) ||
                p.tags.any { it.name.contains(query, ignoreCase = true) }
            }
        }
        if (tags.isNotEmpty()) {
            filtered = filtered.filter { p ->
                p.tags.any { tag -> tags.contains(tag.name) }
            }
        }
        if (start != null) {
            filtered = filtered.filter { it.photo.createdAt >= start }
        }
        if (end != null) {
            // Include entire end day (end + 23:59:59.999)
            val endOfDay = end + (24L * 60 * 60 * 1000 - 1)
            filtered = filtered.filter { it.photo.createdAt <= endOfDay }
        }
        filtered
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val favoritePhotos: StateFlow<List<PhotoWithTags>> = repository.getFavoritePhotos()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val pendingPhotos: StateFlow<List<PhotoWithTags>> = repository.getPendingPhotos()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val trashPhotos: StateFlow<List<PhotoWithTags>> = repository.getTrashPhotos()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val allTags: StateFlow<List<Tag>> = repository.getAllTags()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun updateSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun toggleTagFilter(tagName: String) {
        val current = _selectedTags.value
        _selectedTags.value = if (current.contains(tagName)) {
            current - tagName
        } else {
            current + tagName
        }
    }

    fun filterBySingleTag(tagName: String) {
        _selectedTags.value = setOf(tagName)
        _filterOnlyFavorites.value = false
        _searchQuery.value = ""
    }

    fun toggleFavoriteFilter() {
        _filterOnlyFavorites.value = !_filterOnlyFavorites.value
    }

    fun setFavoriteFilter(active: Boolean) {
        _filterOnlyFavorites.value = active
    }

    fun clearTagFilters() {
        _selectedTags.value = emptySet()
        _filterOnlyFavorites.value = false
    }

    fun setDateRange(start: Long?, end: Long?) {
        _startDate.value = start
        _endDate.value = end
    }

    fun clearDateFilter() {
        _startDate.value = null
        _endDate.value = null
    }

    fun clearAllFilters() {
        _searchQuery.value = ""
        _selectedTags.value = emptySet()
        _startDate.value = null
        _endDate.value = null
        _filterOnlyFavorites.value = false
    }

    fun addPhotoToPending(uri: String, filename: String) {
        viewModelScope.launch {
            repository.insertPhoto(
                Photo(
                    id = UUID.randomUUID().toString(),
                    localUri = uri,
                    originalFilename = filename,
                    displayName = filename.substringBeforeLast('.'),
                    isPending = true
                )
            )
        }
    }

    fun movePendingToGallery(photoIds: List<String>) {
        viewModelScope.launch {
            val photosToUpdate = pendingPhotos.value
                .filter { photoIds.contains(it.photo.id) }
                .map { it.photo.copy(isPending = false) }
            repository.updatePhotos(photosToUpdate)
        }
    }

    fun assignTagsAndMoveToGallery(photoIds: List<String>, tags: List<String>) {
        viewModelScope.launch {
            if (tags.isNotEmpty()) {
                repository.assignTagsToPhotos(photoIds, tags)
            }
            movePendingToGallery(photoIds)
        }
    }

    fun moveToTrash(photoId: String) {
        viewModelScope.launch {
            val photo = repository.getPhotoWithTagsSync(photoId)?.photo ?: return@launch
            repository.updatePhoto(photo.copy(deletedAt = System.currentTimeMillis()))
        }
    }

    fun restoreFromTrash(photoId: String) {
        viewModelScope.launch {
            val photo = repository.getPhotoWithTagsSync(photoId)?.photo ?: return@launch
            repository.updatePhoto(photo.copy(deletedAt = null))
        }
    }

    fun emptyTrash() {
        viewModelScope.launch {
            repository.emptyTrash()
        }
    }

    fun deletePermanently(photoId: String) {
        viewModelScope.launch {
            repository.deletePhotoPermanently(photoId)
        }
    }

    fun toggleFavorite(photoId: String, isFavorite: Boolean) {
        viewModelScope.launch {
            repository.toggleFavorite(photoId, isFavorite)
        }
    }

    fun createTag(name: String, color: Long? = null) {
        viewModelScope.launch {
            repository.insertTag(name, color)
        }
    }

    fun deleteTag(name: String) {
        viewModelScope.launch {
            // Remove from active filters if present
            if (_selectedTags.value.contains(name)) {
                _selectedTags.value = _selectedTags.value - name
            }
            repository.deleteTag(name)
        }
    }

    fun renameTag(oldName: String, newName: String) {
        viewModelScope.launch {
            if (_selectedTags.value.contains(oldName)) {
                _selectedTags.value = (_selectedTags.value - oldName) + newName
            }
            repository.renameTag(oldName, newName)
        }
    }

    fun updateTagColor(name: String, color: Long?) {
        viewModelScope.launch {
            repository.updateTagColor(name, color)
        }
    }

    fun addTagToPhoto(photoId: String, tagName: String) {
        viewModelScope.launch {
            repository.addTagToPhoto(photoId, tagName)
            movePendingToGallery(listOf(photoId))
        }
    }

    fun removeTagFromPhoto(photoId: String, tagName: String) {
        viewModelScope.launch {
            repository.removeTagFromPhoto(photoId, tagName)
        }
    }

    init {
        viewModelScope.launch {
            repository.cleanOldTrash()
        }
    }
}

class PhotoViewModelFactory(private val repository: PhotoRepository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(PhotoViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return PhotoViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
