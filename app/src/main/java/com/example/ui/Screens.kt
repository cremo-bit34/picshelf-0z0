package com.example.ui

import android.content.Context
import android.net.Uri
import android.widget.Toast
import androidx.activity.compose.BackHandler
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.*
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.*
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.FileProvider
import coil.compose.AsyncImage
import com.example.data.PhotoWithTags
import com.example.data.Tag
import com.example.ui.theme.TagColors
import kotlinx.coroutines.launch
import java.io.File
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(viewModel: PhotoViewModel, onNavigate: (String) -> Unit = {}) {
    var currentTab by remember { mutableIntStateOf(1) } // Default to Gallery
    var activePhoto by remember { mutableStateOf<PhotoWithTags?>(null) }

    val pendingPhotos by viewModel.pendingPhotos.collectAsState()
    val trashPhotos by viewModel.trashPhotos.collectAsState()
    val favoritePhotos by viewModel.favoritePhotos.collectAsState()

    if (activePhoto != null) {
        PhotoDetailScreen(
            photoWithTags = activePhoto!!,
            viewModel = viewModel,
            onBack = { activePhoto = null }
        )
    } else {
        BackHandler(enabled = currentTab != 1) {
            currentTab = 1
        }

        Scaffold(
            bottomBar = {
                NavigationBar(
                    tonalElevation = 10.dp,
                    containerColor = MaterialTheme.colorScheme.surface
                ) {
                    // Tab 0: Loading Dock
                    NavigationBarItem(
                        selected = currentTab == 0,
                        onClick = { currentTab = 0 },
                        icon = {
                            BadgedBox(
                                badge = {
                                    if (pendingPhotos.isNotEmpty()) {
                                        Badge(
                                            containerColor = MaterialTheme.colorScheme.primary,
                                            contentColor = MaterialTheme.colorScheme.onPrimary
                                        ) {
                                            Text(pendingPhotos.size.toString())
                                        }
                                    }
                                }
                            ) {
                                Icon(
                                    imageVector = if (currentTab == 0) Icons.Filled.Inbox else Icons.Outlined.Inbox,
                                    contentDescription = "Loading Dock"
                                )
                            }
                        },
                        label = { Text("Dock", fontSize = 11.sp, fontWeight = FontWeight.SemiBold) }
                    )

                    // Tab 1: Gallery
                    NavigationBarItem(
                        selected = currentTab == 1,
                        onClick = { currentTab = 1 },
                        icon = {
                            Icon(
                                imageVector = if (currentTab == 1) Icons.Filled.PhotoLibrary else Icons.Outlined.PhotoLibrary,
                                contentDescription = "Gallery"
                            )
                        },
                        label = { Text("Gallery", fontSize = 11.sp, fontWeight = FontWeight.SemiBold) }
                    )

                    // Tab 2: Albums / Tags
                    NavigationBarItem(
                        selected = currentTab == 2,
                        onClick = { currentTab = 2 },
                        icon = {
                            Icon(
                                imageVector = Icons.AutoMirrored.Filled.Label,
                                contentDescription = "Albums"
                            )
                        },
                        label = { Text("Albums", fontSize = 11.sp, fontWeight = FontWeight.SemiBold) }
                    )

                    // Tab 3: Favorites
                    NavigationBarItem(
                        selected = currentTab == 3,
                        onClick = { currentTab = 3 },
                        icon = {
                            BadgedBox(
                                badge = {
                                    if (favoritePhotos.isNotEmpty()) {
                                        Badge(
                                            containerColor = Color(0xFFF43F5E),
                                            contentColor = Color.White
                                        ) {
                                            Text(favoritePhotos.size.toString())
                                        }
                                    }
                                }
                            ) {
                                Icon(
                                    imageVector = if (currentTab == 3) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
                                    contentDescription = "Favorites",
                                    tint = if (currentTab == 3) Color(0xFFF43F5E) else LocalContentColor.current
                                )
                            }
                        },
                        label = { Text("Favorites", fontSize = 11.sp, fontWeight = FontWeight.SemiBold) }
                    )

                    // Tab 4: Trash
                    NavigationBarItem(
                        selected = currentTab == 4,
                        onClick = { currentTab = 4 },
                        icon = {
                            BadgedBox(
                                badge = {
                                    if (trashPhotos.isNotEmpty()) {
                                        Badge(
                                            containerColor = MaterialTheme.colorScheme.error,
                                            contentColor = MaterialTheme.colorScheme.onError
                                        ) {
                                            Text(trashPhotos.size.toString())
                                        }
                                    }
                                }
                            ) {
                                Icon(
                                    imageVector = if (currentTab == 4) Icons.Filled.Delete else Icons.Outlined.Delete,
                                    contentDescription = "Trash"
                                )
                            }
                        },
                        label = { Text("Trash", fontSize = 11.sp, fontWeight = FontWeight.SemiBold) }
                    )
                }
            }
        ) { paddingValues ->
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
            ) {
                when (currentTab) {
                    0 -> LoadingDockScreen(viewModel) { photo -> activePhoto = photo }
                    1 -> GalleryScreen(viewModel) { photo -> activePhoto = photo }
                    2 -> AlbumsAndTagsScreen(
                        viewModel = viewModel,
                        onNavigateToGalleryWithTag = { tag ->
                            viewModel.filterBySingleTag(tag)
                            currentTab = 1
                        },
                        onNavigateToFavorites = {
                            currentTab = 3
                        }
                    )
                    3 -> FavoritesScreen(viewModel) { photo -> activePhoto = photo }
                    4 -> TrashScreen(viewModel)
                }
            }
        }
    }
}

// -----------------------------------------------------------------------------------------
// 1. GALLERY SCREEN (With Featured Albums Carousel, 2-Column Cards, Download & Share)
// -----------------------------------------------------------------------------------------
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GalleryScreen(
    viewModel: PhotoViewModel,
    onPhotoClick: (PhotoWithTags) -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val displayedGalleryPhotos by viewModel.galleryPhotos.collectAsState()
    val allGalleryPhotos by viewModel.allGalleryPhotos.collectAsState()
    val favoritePhotos by viewModel.favoritePhotos.collectAsState()
    val isFilterOnlyFavorites by viewModel.filterOnlyFavorites.collectAsState()
    val allTags by viewModel.allTags.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    val selectedTags by viewModel.selectedTags.collectAsState()
    val startDate by viewModel.startDate.collectAsState()
    val endDate by viewModel.endDate.collectAsState()

    var selectedPhotoIds by remember { mutableStateOf(setOf<String>()) }
    var showDatePicker by remember { mutableStateOf(false) }
    var sortOption by remember { mutableStateOf("date-desc") }
    var showSortMenu by remember { mutableStateOf(false) }

    val sortedGalleryPhotos = remember(displayedGalleryPhotos, sortOption) {
        when (sortOption) {
            "date-asc" -> displayedGalleryPhotos.sortedBy { it.photo.createdAt }
            "name-asc" -> displayedGalleryPhotos.sortedBy { it.photo.displayName.lowercase() }
            "name-desc" -> displayedGalleryPhotos.sortedByDescending { it.photo.displayName.lowercase() }
            else -> displayedGalleryPhotos.sortedByDescending { it.photo.createdAt }
        }
    }

    val dateFormat = remember { SimpleDateFormat("MMM d, yyyy", Locale.getDefault()) }

    if (showDatePicker) {
        val dateRangePickerState = rememberDateRangePickerState()
        DatePickerDialog(
            onDismissRequest = { showDatePicker = false },
            confirmButton = {
                TextButton(onClick = {
                    viewModel.setDateRange(
                        dateRangePickerState.selectedStartDateMillis,
                        dateRangePickerState.selectedEndDateMillis
                    )
                    showDatePicker = false
                }) {
                    Text("Apply Range")
                }
            },
            dismissButton = {
                TextButton(onClick = {
                    viewModel.clearDateFilter()
                    showDatePicker = false
                }) {
                    Text("Clear")
                }
            }
        ) {
            DateRangePicker(
                state = dateRangePickerState,
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                title = {
                    Text(
                        "Filter by Date Range",
                        modifier = Modifier.padding(start = 24.dp, top = 16.dp),
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                    )
                }
            )
        }
    }

    Column(modifier = Modifier.fillMaxSize()) {
        // Selection Action Bar OR Search Bar
        if (selectedPhotoIds.isNotEmpty()) {
            Surface(
                tonalElevation = 4.dp,
                color = MaterialTheme.colorScheme.secondaryContainer
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = { selectedPhotoIds = emptySet() }) {
                        Icon(Icons.Default.Close, contentDescription = "Close Selection")
                    }
                    Text(
                        "${selectedPhotoIds.size} Selected",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        modifier = Modifier.weight(1f)
                    )

                    // Download ZIP button
                    IconButton(onClick = {
                        val selectedList = displayedGalleryPhotos.filter { selectedPhotoIds.contains(it.photo.id) }
                        coroutineScope.launch {
                            val zipFile = ExportUtils.createZipExport(
                                context,
                                selectedList,
                                "Collection_${System.currentTimeMillis()}"
                            )
                            if (zipFile != null) {
                                val ok = ExportUtils.saveToDownloads(context, zipFile)
                                if (ok) {
                                    Toast.makeText(context, "Saved collection ZIP to Downloads folder!", Toast.LENGTH_LONG).show()
                                }
                            }
                        }
                    }) {
                        Icon(Icons.Default.Download, contentDescription = "Download Selected")
                    }

                    // Native Share button
                    IconButton(onClick = {
                        val selectedList = displayedGalleryPhotos.filter { selectedPhotoIds.contains(it.photo.id) }
                        coroutineScope.launch {
                            val zipFile = ExportUtils.createZipExport(
                                context,
                                selectedList,
                                "Photos_${System.currentTimeMillis()}"
                            )
                            if (zipFile != null) {
                                ExportUtils.shareZipFile(context, zipFile)
                            }
                        }
                    }) {
                        Icon(Icons.Default.Share, contentDescription = "Share Selected")
                    }

                    // Move Selected to Trash
                    IconButton(onClick = {
                        selectedPhotoIds.forEach { viewModel.moveToTrash(it) }
                        selectedPhotoIds = emptySet()
                        Toast.makeText(context, "Moved to Trash", Toast.LENGTH_SHORT).show()
                    }) {
                        Icon(Icons.Default.Delete, contentDescription = "Trash", tint = MaterialTheme.colorScheme.error)
                    }
                }
            }
        } else {
            // Search Input Field
            Surface(
                color = MaterialTheme.colorScheme.surface,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 6.dp)
            ) {
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = viewModel::updateSearchQuery,
                    placeholder = { Text("Search photos, tags, or dates...") },
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Search", tint = MaterialTheme.colorScheme.primary) },
                    trailingIcon = {
                        if (searchQuery.isNotEmpty()) {
                            IconButton(onClick = { viewModel.updateSearchQuery("") }) {
                                Icon(Icons.Default.Clear, contentDescription = "Clear")
                            }
                        }
                    },
                    shape = RoundedCornerShape(24.dp),
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = MaterialTheme.colorScheme.primary,
                        unfocusedBorderColor = MaterialTheme.colorScheme.outlineVariant
                    ),
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }

        // FEATURED ALBUMS ROW (Showing album card with photo count, including Favorites!)
        if (allTags.isNotEmpty() && selectedPhotoIds.isEmpty() && searchQuery.isBlank()) {
            Column(modifier = Modifier.fillMaxWidth().padding(top = 4.dp, bottom = 8.dp)) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 2.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        "Featured Albums",
                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.ExtraBold, letterSpacing = 0.3.sp)
                    )
                    Text(
                        "${allTags.size + 1} Albums",
                        style = MaterialTheme.typography.labelMedium.copy(color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
                    )
                }

                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.padding(top = 6.dp)
                ) {
                    // Featured Favorites Album Card
                    item(key = "featured_fav_card") {
                        val favCount = favoritePhotos.size
                        val isSelected = isFilterOnlyFavorites
                        Card(
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(
                                containerColor = if (isSelected) Color(0xFFF43F5E).copy(alpha = 0.25f) else MaterialTheme.colorScheme.surfaceVariant
                            ),
                            elevation = CardDefaults.cardElevation(defaultElevation = if (isSelected) 4.dp else 1.dp),
                            modifier = Modifier
                                .width(130.dp)
                                .clickable { viewModel.toggleFavoriteFilter() }
                                .then(
                                    if (isSelected) Modifier.border(2.dp, Color(0xFFF43F5E), RoundedCornerShape(16.dp)) else Modifier
                                )
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Box(
                                    modifier = Modifier
                                        .size(28.dp)
                                        .clip(CircleShape)
                                        .background(Color(0xFFF43F5E).copy(alpha = 0.2f)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        Icons.Default.Favorite,
                                        contentDescription = null,
                                        tint = Color(0xFFF43F5E),
                                        modifier = Modifier.size(16.dp)
                                    )
                                }
                                Spacer(Modifier.height(10.dp))
                                Text(
                                    text = "Favorites",
                                    style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold, color = Color(0xFFF43F5E)),
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                Text(
                                    text = "$favCount ${if (favCount == 1) "Photo" else "Photos"}",
                                    style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 11.sp)
                                )
                            }
                        }
                    }

                    items(allTags, key = { it.name }) { tag ->
                        val count = allGalleryPhotos.count { p -> p.tags.any { it.name == tag.name } }
                        val isSelected = selectedTags.contains(tag.name)
                        val tagColor = tag.color?.let { Color(it) } ?: MaterialTheme.colorScheme.primary

                        Card(
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(
                                containerColor = if (isSelected) tagColor.copy(alpha = 0.25f) else MaterialTheme.colorScheme.surfaceVariant
                            ),
                            elevation = CardDefaults.cardElevation(defaultElevation = if (isSelected) 4.dp else 1.dp),
                            modifier = Modifier
                                .width(130.dp)
                                .clickable { viewModel.toggleTagFilter(tag.name) }
                                .then(
                                    if (isSelected) Modifier.border(2.dp, tagColor, RoundedCornerShape(16.dp)) else Modifier
                                )
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Box(
                                    modifier = Modifier
                                        .size(28.dp)
                                        .clip(CircleShape)
                                        .background(tagColor.copy(alpha = 0.2f)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        Icons.AutoMirrored.Filled.Label,
                                        contentDescription = null,
                                        tint = tagColor,
                                        modifier = Modifier.size(16.dp)
                                    )
                                }
                                Spacer(Modifier.height(10.dp))
                                Text(
                                    text = tag.name,
                                    style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                Text(
                                    text = "$count ${if (count == 1) "Photo" else "Photos"}",
                                    style = MaterialTheme.typography.bodySmall.copy(color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 11.sp)
                                )
                            }
                        }
                    }
                }
            }
        }

        // Horizontal Filter Chips: Favorites, Multi-Tag & Date Range
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState())
                .padding(horizontal = 16.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            val isDateFilterActive = startDate != null || endDate != null
            FilterChip(
                selected = isDateFilterActive,
                onClick = { showDatePicker = true },
                leadingIcon = {
                    Icon(Icons.Default.DateRange, contentDescription = null, modifier = Modifier.size(16.dp))
                },
                label = {
                    if (isDateFilterActive) {
                        val s = startDate?.let { dateFormat.format(Date(it)) } ?: "Any"
                        val e = endDate?.let { dateFormat.format(Date(it)) } ?: "Any"
                        Text("$s - $e", fontSize = 12.sp)
                    } else {
                        Text("Date Range", fontSize = 12.sp)
                    }
                },
                trailingIcon = if (isDateFilterActive) {
                    {
                        IconButton(
                            onClick = { viewModel.clearDateFilter() },
                            modifier = Modifier.size(16.dp)
                        ) {
                            Icon(Icons.Default.Close, contentDescription = "Clear Date", modifier = Modifier.size(12.dp))
                        }
                    }
                } else null
            )

            // "All Moments" Chip with total count
            FilterChip(
                selected = selectedTags.isEmpty() && !isFilterOnlyFavorites,
                onClick = { viewModel.clearTagFilters() },
                label = { Text("All (${allGalleryPhotos.size})", fontSize = 12.sp) }
            )

            // "Favorites" Filter Chip with exact loved count
            FilterChip(
                selected = isFilterOnlyFavorites,
                onClick = { viewModel.toggleFavoriteFilter() },
                leadingIcon = {
                    Icon(
                        Icons.Default.Favorite,
                        contentDescription = null,
                        tint = Color(0xFFF43F5E),
                        modifier = Modifier.size(16.dp)
                    )
                },
                label = { Text("Favorites (${favoritePhotos.size})", fontSize = 12.sp) },
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = Color(0xFFF43F5E).copy(alpha = 0.2f),
                    selectedLabelColor = MaterialTheme.colorScheme.onSurface
                )
            )

            // Dynamic Tag Chips with true photo counts
            allTags.forEach { tag ->
                val isSelected = selectedTags.contains(tag.name)
                val count = allGalleryPhotos.count { p -> p.tags.any { it.name == tag.name } }
                val tagColor = tag.color?.let { Color(it) } ?: MaterialTheme.colorScheme.primary
                FilterChip(
                    selected = isSelected,
                    onClick = { viewModel.toggleTagFilter(tag.name) },
                    leadingIcon = {
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .clip(CircleShape)
                                .background(tagColor)
                        )
                    },
                    label = { Text("${tag.name} ($count)", fontSize = 12.sp) },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = tagColor.copy(alpha = 0.2f),
                        selectedLabelColor = MaterialTheme.colorScheme.onSurface
                    )
                )
            }

            if (selectedTags.isNotEmpty() || isFilterOnlyFavorites || isDateFilterActive || searchQuery.isNotBlank()) {
                TextButton(
                    onClick = { viewModel.clearAllFilters() },
                    contentPadding = PaddingValues(horizontal = 8.dp)
                ) {
                    Text("Reset Filters", fontSize = 12.sp, color = MaterialTheme.colorScheme.error)
                }
            }
        }

        // Subheader with Quick Download and Share
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 6.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    if (isFilterOnlyFavorites) "${displayedGalleryPhotos.size} favorite photos"
                    else "${displayedGalleryPhotos.size} photos",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                Spacer(Modifier.width(6.dp))

                Box {
                    TextButton(
                        onClick = { showSortMenu = true },
                        contentPadding = PaddingValues(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Icon(Icons.AutoMirrored.Filled.Sort, contentDescription = "Sort", modifier = Modifier.size(14.dp))
                        Spacer(Modifier.width(4.dp))
                        val sortLabel = when (sortOption) {
                            "date-asc" -> "Oldest"
                            "name-asc" -> "Name A-Z"
                            "name-desc" -> "Name Z-A"
                            else -> "Newest"
                        }
                        Text(sortLabel, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                    }

                    DropdownMenu(
                        expanded = showSortMenu,
                        onDismissRequest = { showSortMenu = false }
                    ) {
                        DropdownMenuItem(
                            text = { Text("Newest First", fontSize = 13.sp) },
                            onClick = {
                                sortOption = "date-desc"
                                showSortMenu = false
                            },
                            leadingIcon = {
                                Icon(Icons.Default.Schedule, contentDescription = null, modifier = Modifier.size(16.dp))
                            },
                            trailingIcon = if (sortOption == "date-desc") {
                                { Icon(Icons.Default.Check, contentDescription = null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(16.dp)) }
                            } else null
                        )
                        DropdownMenuItem(
                            text = { Text("Oldest First", fontSize = 13.sp) },
                            onClick = {
                                sortOption = "date-asc"
                                showSortMenu = false
                            },
                            leadingIcon = {
                                Icon(Icons.AutoMirrored.Filled.Sort, contentDescription = null, modifier = Modifier.size(16.dp))
                            },
                            trailingIcon = if (sortOption == "date-asc") {
                                { Icon(Icons.Default.Check, contentDescription = null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(16.dp)) }
                            } else null
                        )
                        HorizontalDivider()
                        DropdownMenuItem(
                            text = { Text("Name: A to Z", fontSize = 13.sp) },
                            onClick = {
                                sortOption = "name-asc"
                                showSortMenu = false
                            },
                            leadingIcon = {
                                Icon(Icons.AutoMirrored.Filled.Sort, contentDescription = null, modifier = Modifier.size(16.dp))
                            },
                            trailingIcon = if (sortOption == "name-asc") {
                                { Icon(Icons.Default.Check, contentDescription = null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(16.dp)) }
                            } else null
                        )
                        DropdownMenuItem(
                            text = { Text("Name: Z to A", fontSize = 13.sp) },
                            onClick = {
                                sortOption = "name-desc"
                                showSortMenu = false
                            },
                            leadingIcon = {
                                Icon(Icons.AutoMirrored.Filled.Sort, contentDescription = null, modifier = Modifier.size(16.dp))
                            },
                            trailingIcon = if (sortOption == "name-desc") {
                                { Icon(Icons.Default.Check, contentDescription = null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(16.dp)) }
                            } else null
                        )
                    }
                }
            }

            if (displayedGalleryPhotos.isNotEmpty() && selectedPhotoIds.isEmpty()) {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    TextButton(
                        onClick = {
                            coroutineScope.launch {
                                val zipFile = ExportUtils.createZipExport(
                                    context,
                                    displayedGalleryPhotos,
                                    "Filtered_${System.currentTimeMillis()}"
                                )
                                if (zipFile != null) {
                                    val ok = ExportUtils.saveToDownloads(context, zipFile)
                                    if (ok) {
                                        Toast.makeText(context, "Saved ZIP to Downloads folder!", Toast.LENGTH_SHORT).show()
                                    }
                                }
                            }
                        },
                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp)
                    ) {
                        Icon(Icons.Default.Download, contentDescription = null, modifier = Modifier.size(15.dp))
                        Spacer(Modifier.width(4.dp))
                        Text("Download ZIP", fontSize = 12.sp)
                    }

                    TextButton(
                        onClick = {
                            coroutineScope.launch {
                                val zipFile = ExportUtils.createZipExport(
                                    context,
                                    displayedGalleryPhotos,
                                    "Gallery_${System.currentTimeMillis()}"
                                )
                                if (zipFile != null) {
                                    ExportUtils.shareZipFile(context, zipFile)
                                }
                            }
                        },
                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp)
                    ) {
                        Icon(Icons.Default.Share, contentDescription = null, modifier = Modifier.size(15.dp))
                        Spacer(Modifier.width(4.dp))
                        Text("Share", fontSize = 12.sp)
                    }
                }
            }
        }

        // ELEGANT 2-COLUMN PHOTO GRID (Fixes text truncation)
        if (displayedGalleryPhotos.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(32.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        Icons.Outlined.PhotoCamera,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.outline,
                        modifier = Modifier.size(64.dp)
                    )
                    Spacer(Modifier.height(12.dp))
                    Text(
                        if (isFilterOnlyFavorites) "No favorite photos found"
                        else "No photos matching your filter",
                        style = MaterialTheme.typography.titleMedium
                    )
                    Spacer(Modifier.height(4.dp))
                    Text(
                        if (isFilterOnlyFavorites) "Tap the heart on any photo in the gallery to mark it as favorite!"
                        else "Try switching active tags, clearing dates, or organizing new photos in the Loading Dock.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = TextAlign.Center
                    )
                }
            }
        } else {
            LazyVerticalGrid(
                columns = GridCells.Fixed(2), // 2-Column layout gives plenty of width for titles & actions!
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(sortedGalleryPhotos, key = { it.photo.id }) { photoWithTags ->
                    val isSelected = selectedPhotoIds.contains(photoWithTags.photo.id)
                    GalleryPhotoCard(
                        photoWithTags = photoWithTags,
                        isSelected = isSelected,
                        isSelectionMode = selectedPhotoIds.isNotEmpty(),
                        onClick = {
                            if (selectedPhotoIds.isNotEmpty()) {
                                selectedPhotoIds = if (isSelected) selectedPhotoIds - photoWithTags.photo.id else selectedPhotoIds + photoWithTags.photo.id
                            } else {
                                onPhotoClick(photoWithTags)
                            }
                        },
                        onLongClick = {
                            selectedPhotoIds = if (isSelected) selectedPhotoIds - photoWithTags.photo.id else selectedPhotoIds + photoWithTags.photo.id
                        },
                        onToggleFavorite = {
                            viewModel.toggleFavorite(photoWithTags.photo.id, !photoWithTags.photo.isFavorite)
                        },
                        onDownload = {
                            coroutineScope.launch {
                                val zipFile = ExportUtils.createZipExport(
                                    context,
                                    listOf(photoWithTags),
                                    photoWithTags.photo.displayName
                                )
                                if (zipFile != null) {
                                    val ok = ExportUtils.saveToDownloads(context, zipFile)
                                    if (ok) {
                                        Toast.makeText(context, "Downloaded '${photoWithTags.photo.displayName}' to Downloads!", Toast.LENGTH_SHORT).show()
                                    }
                                }
                            }
                        },
                        onShare = {
                            coroutineScope.launch {
                                val zipFile = ExportUtils.createZipExport(
                                    context,
                                    listOf(photoWithTags),
                                    photoWithTags.photo.displayName
                                )
                                if (zipFile != null) {
                                    ExportUtils.shareZipFile(context, zipFile)
                                }
                            }
                        }
                    )
                }
            }
        }
    }
}

// -----------------------------------------------------------------------------------------
// 2. ELEGANT GALLERY PHOTO CARD (2-Column, No Text Overflow, Direct Download & Share)
// -----------------------------------------------------------------------------------------
@OptIn(ExperimentalFoundationApi::class)
@Composable
fun GalleryPhotoCard(
    photoWithTags: PhotoWithTags,
    isSelected: Boolean,
    isSelectionMode: Boolean,
    onClick: () -> Unit,
    onLongClick: () -> Unit,
    onToggleFavorite: () -> Unit,
    onDownload: () -> Unit,
    onShare: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        modifier = Modifier
            .fillMaxWidth()
            .then(
                if (isSelected) Modifier.border(2.5.dp, MaterialTheme.colorScheme.primary, RoundedCornerShape(18.dp))
                else Modifier
            )
            .combinedClickable(
                onClick = onClick,
                onLongClick = onLongClick
            )
    ) {
        Column {
            // Photo Thumbnail Box
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(1f)
                    .background(Color.DarkGray)
            ) {
                AsyncImage(
                    model = photoWithTags.photo.localUri,
                    contentDescription = photoWithTags.photo.displayName,
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop
                )

                // Selection Checkbox Button
                if (isSelectionMode) {
                    Box(
                        modifier = Modifier
                            .align(Alignment.TopStart)
                            .padding(8.dp)
                            .size(28.dp)
                            .background(Color.Black.copy(alpha = 0.5f), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = if (isSelected) Icons.Default.CheckCircle else Icons.Default.RadioButtonUnchecked,
                            contentDescription = "Select",
                            tint = if (isSelected) MaterialTheme.colorScheme.primary else Color.White,
                            modifier = Modifier.size(22.dp)
                        )
                    }
                }

                // Favorite Heart Button
                IconButton(
                    onClick = onToggleFavorite,
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(6.dp)
                        .size(30.dp)
                        .background(Color.Black.copy(alpha = 0.45f), CircleShape)
                ) {
                    Icon(
                        imageVector = if (photoWithTags.photo.isFavorite) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                        contentDescription = "Favorite",
                        tint = if (photoWithTags.photo.isFavorite) Color.Red else Color.White,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }

            // Card Footer: Display Name & Tag Pills (Never Overlaps!)
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 10.dp, vertical = 8.dp)
            ) {
                Text(
                    text = photoWithTags.photo.displayName,
                    style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )

                Spacer(Modifier.height(4.dp))

                // Tag Pill
                if (photoWithTags.tags.isNotEmpty()) {
                    val firstTag = photoWithTags.tags.first()
                    val tagColor = firstTag.color?.let { Color(it) } ?: MaterialTheme.colorScheme.primary
                    Surface(
                        color = tagColor.copy(alpha = 0.2f),
                        shape = RoundedCornerShape(6.dp),
                        modifier = Modifier.padding(bottom = 4.dp)
                    ) {
                        Text(
                            text = firstTag.name + if (photoWithTags.tags.size > 1) " +${photoWithTags.tags.size - 1}" else "",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = tagColor,
                                fontWeight = FontWeight.Bold,
                                fontSize = 10.sp
                            ),
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                } else {
                    Text("No tags", style = MaterialTheme.typography.bodySmall.copy(fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant))
                }

                // Direct Action Buttons (Download & Share right on the card!)
                HorizontalDivider(modifier = Modifier.padding(vertical = 4.dp), color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.5f))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row {
                        IconButton(onClick = onDownload, modifier = Modifier.size(28.dp)) {
                            Icon(Icons.Default.Download, contentDescription = "Download", modifier = Modifier.size(16.dp))
                        }
                        IconButton(onClick = onShare, modifier = Modifier.size(28.dp)) {
                            Icon(Icons.Default.Share, contentDescription = "Share", modifier = Modifier.size(16.dp))
                        }
                    }

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.padding(start = 4.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Schedule,
                            contentDescription = null,
                            modifier = Modifier.size(11.dp),
                            tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f)
                        )
                        Spacer(modifier = Modifier.width(3.dp))
                        Text(
                            SimpleDateFormat("MMM d · h:mm a", Locale.getDefault()).format(Date(photoWithTags.photo.createdAt)),
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontSize = 9.5.sp,
                                fontWeight = FontWeight.Medium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            ),
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }
                }
            }
        }
    }
}

// -----------------------------------------------------------------------------------------
// 3. LOADING DOCK SCREEN (Review, Tagging & Move to Gallery)
// -----------------------------------------------------------------------------------------
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoadingDockScreen(
    viewModel: PhotoViewModel,
    onPhotoClick: (PhotoWithTags) -> Unit
) {
    val context = LocalContext.current
    val pendingPhotos by viewModel.pendingPhotos.collectAsState()
    val allTags by viewModel.allTags.collectAsState()
    var selectedPhotoIds by remember { mutableStateOf(setOf<String>()) }
    var showBatchTagDialog by remember { mutableStateOf(false) }

    var currentPhotoUri by remember { mutableStateOf<Uri?>(null) }

    val cameraLauncher = rememberLauncherForActivityResult(ActivityResultContracts.TakePicture()) { success ->
        if (success) {
            currentPhotoUri?.let { uri ->
                viewModel.addPhotoToPending(uri.toString(), "Camera_${System.currentTimeMillis()}.jpg")
                Toast.makeText(context, "Added to Loading Dock", Toast.LENGTH_SHORT).show()
            }
        }
    }

    val galleryLauncher = rememberLauncherForActivityResult(ActivityResultContracts.GetMultipleContents()) { uris ->
        if (uris.isNotEmpty()) {
            uris.forEachIndexed { index, uri ->
                viewModel.addPhotoToPending(uri.toString(), "Imported_${System.currentTimeMillis()}_$index.jpg")
            }
            Toast.makeText(context, "${uris.size} photos queued in Loading Dock", Toast.LENGTH_SHORT).show()
        }
    }

    fun launchCamera() {
        val imagesDir = File(context.cacheDir, "camera_images").apply { mkdirs() }
        val photoFile = File(imagesDir, "camera_${System.currentTimeMillis()}.jpg")
        val uri = FileProvider.getUriForFile(
            context,
            "${context.packageName}.provider",
            photoFile
        )
        currentPhotoUri = uri
        cameraLauncher.launch(uri)
    }

    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (isGranted) {
            launchCamera()
        } else {
            Toast.makeText(context, "Camera permission is required", Toast.LENGTH_SHORT).show()
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("Loading Dock", style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.ExtraBold))
                        Text(
                            if (pendingPhotos.isEmpty()) "All organized" else "${pendingPhotos.size} photos to organize",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                actions = {
                    FilledTonalButton(
                        onClick = { permissionLauncher.launch(android.Manifest.permission.CAMERA) },
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Icon(Icons.Default.CameraAlt, contentDescription = "Camera", modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(6.dp))
                        Text("Snap", fontSize = 13.sp)
                    }
                    Spacer(Modifier.width(6.dp))
                    Button(
                        onClick = { galleryLauncher.launch("image/*") },
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Icon(Icons.Default.AddPhotoAlternate, contentDescription = "Import", modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(6.dp))
                        Text("Import", fontSize = 13.sp)
                    }
                    Spacer(Modifier.width(8.dp))
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // ⚡ 1-Tap Instant Quick-Tag to Album Bar (Effortless Batch Tagging for 1000s of Photos)
            if (pendingPhotos.isNotEmpty() && allTags.isNotEmpty()) {
                Surface(
                    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 4.dp)
                ) {
                    Column(modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp)) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    Icons.Default.Bolt,
                                    contentDescription = null,
                                    tint = MaterialTheme.colorScheme.primary,
                                    modifier = Modifier.size(16.dp)
                                )
                                Spacer(Modifier.width(4.dp))
                                Text(
                                    "1-Tap Quick Tag to Album",
                                    style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold),
                                    color = MaterialTheme.colorScheme.primary
                                )
                            }
                            Text(
                                if (selectedPhotoIds.isNotEmpty()) "Tap album to move ${selectedPhotoIds.size} photos" else "Select photos below first",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }

                        Spacer(Modifier.height(6.dp))

                        LazyRow(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            items(allTags, key = { it.name }) { tag ->
                                val tagColor = Color(tag.color ?: TagColors[0])
                                Surface(
                                    shape = RoundedCornerShape(50.dp),
                                    color = MaterialTheme.colorScheme.surface,
                                    border = BorderStroke(1.dp, tagColor.copy(alpha = 0.4f)),
                                    modifier = Modifier.clickable {
                                        if (selectedPhotoIds.isNotEmpty()) {
                                            val count = selectedPhotoIds.size
                                            viewModel.assignTagsAndMoveToGallery(selectedPhotoIds.toList(), listOf(tag.name))
                                            selectedPhotoIds = emptySet()
                                            Toast.makeText(context, "✨ $count photos moved to '${tag.name}' album!", Toast.LENGTH_SHORT).show()
                                        } else {
                                            Toast.makeText(context, "Select photos below, then tap '${tag.name}' to organize in 1 click!", Toast.LENGTH_SHORT).show()
                                        }
                                    }
                                ) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .size(8.dp)
                                                .background(tagColor, CircleShape)
                                        )
                                        Spacer(Modifier.width(6.dp))
                                        Text(
                                            tag.name,
                                            fontSize = 12.sp,
                                            fontWeight = FontWeight.SemiBold,
                                            color = MaterialTheme.colorScheme.onSurface
                                        )
                                    }
                                }
                            }

                            item {
                                Surface(
                                    shape = RoundedCornerShape(50.dp),
                                    color = MaterialTheme.colorScheme.primary.copy(alpha = 0.12f),
                                    modifier = Modifier.clickable {
                                        if (selectedPhotoIds.isNotEmpty()) {
                                            showBatchTagDialog = true
                                        } else {
                                            Toast.makeText(context, "Select photos below first to tag", Toast.LENGTH_SHORT).show()
                                        }
                                    }
                                ) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                                    ) {
                                        Icon(
                                            Icons.Default.Add,
                                            contentDescription = null,
                                            tint = MaterialTheme.colorScheme.primary,
                                            modifier = Modifier.size(14.dp)
                                        )
                                        Spacer(Modifier.width(4.dp))
                                        Text(
                                            "Custom Tags",
                                            fontSize = 12.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = MaterialTheme.colorScheme.primary
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (pendingPhotos.isNotEmpty()) {
                Surface(
                    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.85f),
                    shape = RoundedCornerShape(16.dp),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.4f)),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 4.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 12.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Checkbox(
                                checked = selectedPhotoIds.size == pendingPhotos.size && pendingPhotos.isNotEmpty(),
                                onCheckedChange = { checked ->
                                    selectedPhotoIds = if (checked) pendingPhotos.map { it.photo.id }.toSet() else emptySet()
                                }
                            )
                            Spacer(Modifier.width(2.dp))
                            TextButton(
                                onClick = {
                                    selectedPhotoIds = if (selectedPhotoIds.size == pendingPhotos.size) {
                                        emptySet()
                                    } else {
                                        pendingPhotos.map { it.photo.id }.toSet()
                                    }
                                },
                                contentPadding = PaddingValues(horizontal = 4.dp, vertical = 0.dp)
                            ) {
                                Text(
                                    if (selectedPhotoIds.size == pendingPhotos.size) "Deselect All" else "Select All",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                            if (selectedPhotoIds.isNotEmpty()) {
                                Spacer(Modifier.width(4.dp))
                                Surface(
                                    shape = RoundedCornerShape(50.dp),
                                    color = MaterialTheme.colorScheme.primary
                                ) {
                                    Text(
                                        "${selectedPhotoIds.size}",
                                        color = MaterialTheme.colorScheme.onPrimary,
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        modifier = Modifier.padding(horizontal = 7.dp, vertical = 2.dp)
                                    )
                                }
                            }
                        }

                        if (selectedPhotoIds.isNotEmpty()) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Button(
                                    onClick = { showBatchTagDialog = true },
                                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                                    shape = RoundedCornerShape(10.dp)
                                ) {
                                    Icon(Icons.Default.LocalOffer, contentDescription = null, modifier = Modifier.size(13.dp))
                                    Spacer(Modifier.width(4.dp))
                                    Text("Tag", fontSize = 12.sp)
                                }
                                Spacer(Modifier.width(6.dp))
                                FilledTonalButton(
                                    onClick = {
                                        val count = selectedPhotoIds.size
                                        viewModel.movePendingToGallery(selectedPhotoIds.toList())
                                        selectedPhotoIds = emptySet()
                                        Toast.makeText(context, "$count saved to Gallery", Toast.LENGTH_SHORT).show()
                                    },
                                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                                    shape = RoundedCornerShape(10.dp)
                                ) {
                                    Text("Save", fontSize = 12.sp)
                                }
                                Spacer(Modifier.width(4.dp))
                                IconButton(
                                    onClick = {
                                        val count = selectedPhotoIds.size
                                        selectedPhotoIds.forEach { viewModel.moveToTrash(it) }
                                        selectedPhotoIds = emptySet()
                                        Toast.makeText(context, "$count moved to Trash", Toast.LENGTH_SHORT).show()
                                    },
                                    modifier = Modifier.size(32.dp)
                                ) {
                                    Icon(
                                        Icons.Default.Delete,
                                        contentDescription = "Trash Selected",
                                        tint = MaterialTheme.colorScheme.error,
                                        modifier = Modifier.size(18.dp)
                                    )
                                }
                            }
                        } else {
                            TextButton(
                                onClick = {
                                    viewModel.movePendingToGallery(pendingPhotos.map { it.photo.id })
                                    Toast.makeText(context, "All saved to Gallery", Toast.LENGTH_SHORT).show()
                                },
                                contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text("Move All", fontSize = 12.sp)
                            }
                        }
                    }
                }
            }

            if (pendingPhotos.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(32.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Surface(
                            shape = CircleShape,
                            color = MaterialTheme.colorScheme.primary.copy(alpha = 0.15f),
                            modifier = Modifier.size(96.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(
                                    Icons.Default.CheckCircleOutline,
                                    contentDescription = null,
                                    tint = MaterialTheme.colorScheme.primary,
                                    modifier = Modifier.size(48.dp)
                                )
                            }
                        }
                        Spacer(Modifier.height(16.dp))
                        Text(
                            "Loading Dock is Empty",
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                        )
                        Spacer(Modifier.height(8.dp))
                        Text(
                            "Snap a photo or import photos from device storage. Photos arrive here first for tagging and review before saving!",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            textAlign = TextAlign.Center
                        )
                        Spacer(Modifier.height(24.dp))
                        Row {
                            Button(
                                onClick = { permissionLauncher.launch(android.Manifest.permission.CAMERA) },
                                shape = RoundedCornerShape(12.dp)
                            ) {
                                Icon(Icons.Default.CameraAlt, contentDescription = null, modifier = Modifier.size(18.dp))
                                Spacer(Modifier.width(8.dp))
                                Text("Take Photo")
                            }
                            Spacer(Modifier.width(12.dp))
                            OutlinedButton(
                                onClick = { galleryLauncher.launch("image/*") },
                                shape = RoundedCornerShape(12.dp)
                            ) {
                                Icon(Icons.Default.AddPhotoAlternate, contentDescription = null, modifier = Modifier.size(18.dp))
                                Spacer(Modifier.width(8.dp))
                                Text("Import")
                            }
                        }
                    }
                }
            } else {
                LazyVerticalGrid(
                    columns = GridCells.Fixed(2),
                    contentPadding = PaddingValues(16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(pendingPhotos, key = { it.photo.id }) { photoWithTags ->
                        val isSelected = selectedPhotoIds.contains(photoWithTags.photo.id)
                        PendingPhotoCard(
                            photoWithTags = photoWithTags,
                            isSelected = isSelected,
                            onToggleSelect = {
                                selectedPhotoIds = if (isSelected) selectedPhotoIds - photoWithTags.photo.id else selectedPhotoIds + photoWithTags.photo.id
                            },
                            onClick = { onPhotoClick(photoWithTags) },
                            onQuickTag = {
                                selectedPhotoIds = setOf(photoWithTags.photo.id)
                                showBatchTagDialog = true
                            },
                            onMoveToGallery = {
                                viewModel.movePendingToGallery(listOf(photoWithTags.photo.id))
                            },
                            onDelete = {
                                viewModel.moveToTrash(photoWithTags.photo.id)
                            }
                        )
                    }
                }
            }
        }
    }

    if (showBatchTagDialog) {
        BatchTagAssignmentDialog(
            allTags = allTags,
            onCreateTag = { name, color -> viewModel.createTag(name, color) },
            onDismiss = { showBatchTagDialog = false },
            onApply = { tagsToAssign ->
                viewModel.assignTagsAndMoveToGallery(selectedPhotoIds.toList(), tagsToAssign)
                selectedPhotoIds = emptySet()
                showBatchTagDialog = false
                Toast.makeText(context, "Organized into Gallery!", Toast.LENGTH_SHORT).show()
            }
        )
    }
}

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun PendingPhotoCard(
    photoWithTags: PhotoWithTags,
    isSelected: Boolean,
    onToggleSelect: () -> Unit,
    onClick: () -> Unit,
    onQuickTag: () -> Unit,
    onMoveToGallery: () -> Unit,
    onDelete: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isSelected) MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.35f)
            else MaterialTheme.colorScheme.surfaceVariant
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = if (isSelected) 6.dp else 2.dp),
        border = if (isSelected) BorderStroke(2.5.dp, MaterialTheme.colorScheme.primary)
        else BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.3f)),
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onToggleSelect() } // Tapping card anywhere toggles selection!
    ) {
        Column {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .aspectRatio(1f)
                    .background(Color.DarkGray)
            ) {
                AsyncImage(
                    model = photoWithTags.photo.localUri,
                    contentDescription = photoWithTags.photo.displayName,
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop
                )

                // Select indicator badge in top-end
                IconButton(
                    onClick = onToggleSelect,
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(6.dp)
                        .background(
                            if (isSelected) MaterialTheme.colorScheme.primary else Color.Black.copy(alpha = 0.45f),
                            CircleShape
                        )
                        .size(32.dp)
                ) {
                    Icon(
                        imageVector = if (isSelected) Icons.Default.Check else Icons.Default.RadioButtonUnchecked,
                        contentDescription = "Select",
                        tint = Color.White,
                        modifier = Modifier.size(18.dp)
                    )
                }

                // Full preview button in top-start
                IconButton(
                    onClick = onClick,
                    modifier = Modifier
                        .align(Alignment.TopStart)
                        .padding(6.dp)
                        .background(Color.Black.copy(alpha = 0.45f), CircleShape)
                        .size(32.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Visibility,
                        contentDescription = "Preview",
                        tint = Color.White,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }

            Column(modifier = Modifier.padding(10.dp)) {
                Text(
                    text = photoWithTags.photo.displayName,
                    style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )

                Spacer(Modifier.height(6.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    TextButton(
                        onClick = onQuickTag,
                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp)
                    ) {
                        Icon(Icons.Default.LocalOffer, contentDescription = null, modifier = Modifier.size(13.dp))
                        Spacer(Modifier.width(4.dp))
                        Text("Tag", fontSize = 12.sp)
                    }

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        FilledTonalButton(
                            onClick = onMoveToGallery,
                            contentPadding = PaddingValues(horizontal = 10.dp, vertical = 2.dp),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("Save", fontSize = 12.sp)
                        }
                        Spacer(Modifier.width(2.dp))
                        IconButton(
                            onClick = onDelete,
                            modifier = Modifier.size(28.dp)
                        ) {
                            Icon(
                                Icons.Default.Delete,
                                contentDescription = "Trash",
                                tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f),
                                modifier = Modifier.size(16.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}

// -----------------------------------------------------------------------------------------
// 4. ALBUMS / TAGS MANAGER SCREEN
// -----------------------------------------------------------------------------------------
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AlbumsAndTagsScreen(
    viewModel: PhotoViewModel,
    onNavigateToGalleryWithTag: (String) -> Unit,
    onNavigateToFavorites: () -> Unit = {}
) {
    val context = LocalContext.current
    var selectedSubTab by remember { mutableIntStateOf(0) } // 0 = My Albums, 1 = Tag Manager
    var showCreateAlbumDialog by remember { mutableStateOf(false) }
    var newAlbumDialogName by remember { mutableStateOf("") }
    var selectedDialogColorIndex by remember { mutableIntStateOf(0) }

    if (showCreateAlbumDialog) {
        AlertDialog(
            onDismissRequest = {
                showCreateAlbumDialog = false
                newAlbumDialogName = ""
            },
            title = {
                Text("Create New Album", fontWeight = FontWeight.Bold)
            },
            text = {
                Column(modifier = Modifier.fillMaxWidth()) {
                    Text(
                        "Enter an album name and pick a signature color palette.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(Modifier.height(12.dp))
                    OutlinedTextField(
                        value = newAlbumDialogName,
                        onValueChange = { newAlbumDialogName = it },
                        label = { Text("Album Title") },
                        placeholder = { Text("e.g. Summer in Paris, Golden Hour, Editorial...") },
                        leadingIcon = { Icon(Icons.Default.PhotoAlbum, contentDescription = null, tint = MaterialTheme.colorScheme.primary) },
                        singleLine = true,
                        shape = RoundedCornerShape(16.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = MaterialTheme.colorScheme.primary,
                            unfocusedBorderColor = MaterialTheme.colorScheme.outlineVariant
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(Modifier.height(14.dp))
                    Text("Signature Color:", style = MaterialTheme.typography.labelSmall)
                    Spacer(Modifier.height(8.dp))
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.horizontalScroll(rememberScrollState())
                    ) {
                        TagColors.forEachIndexed { index, colorVal ->
                            val color = Color(colorVal)
                            val isSelected = selectedDialogColorIndex == index
                            Box(
                                modifier = Modifier
                                    .size(32.dp)
                                    .clip(CircleShape)
                                    .background(color)
                                    .clickable { selectedDialogColorIndex = index }
                                    .then(
                                        if (isSelected) Modifier.border(2.5.dp, MaterialTheme.colorScheme.onSurface, CircleShape)
                                        else Modifier
                                    ),
                                contentAlignment = Alignment.Center
                            ) {
                                if (isSelected) {
                                    Icon(
                                        Icons.Default.Check,
                                        contentDescription = null,
                                        tint = Color.White,
                                        modifier = Modifier.size(16.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (newAlbumDialogName.isNotBlank()) {
                            viewModel.createTag(newAlbumDialogName.trim(), TagColors[selectedDialogColorIndex])
                            Toast.makeText(context, "✨ Album '${newAlbumDialogName.trim()}' created!", Toast.LENGTH_SHORT).show()
                            showCreateAlbumDialog = false
                            newAlbumDialogName = ""
                            selectedSubTab = 0 // stays on Album Cards view
                        }
                    },
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Create")
                }
            },
            dismissButton = {
                TextButton(
                    onClick = {
                        showCreateAlbumDialog = false
                        newAlbumDialogName = ""
                    }
                ) {
                    Text("Cancel")
                }
            }
        )
    }

    val allGalleryPhotosForHeader by viewModel.allGalleryPhotos.collectAsState()
    val tagsForHeader by viewModel.allTags.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            if (selectedSubTab == 0) "My Albums" else "Tag Manager",
                            style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.ExtraBold)
                        )
                        if (selectedSubTab == 0) {
                            Text(
                                "${tagsForHeader.size} Category Albums · ${allGalleryPhotosForHeader.size} Photos in Gallery",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                },
                actions = {
                    if (selectedSubTab == 0) {
                        Button(
                            onClick = { showCreateAlbumDialog = true },
                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.padding(end = 8.dp)
                        ) {
                            Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(Modifier.width(4.dp))
                            Text("New Album", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                        }
                    }
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Segmented Switcher Control
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 6.dp)
                    .background(MaterialTheme.colorScheme.surfaceVariant, RoundedCornerShape(50.dp))
                    .padding(4.dp)
            ) {
                // Albums Card View Tab
                Surface(
                    shape = RoundedCornerShape(50.dp),
                    color = if (selectedSubTab == 0) MaterialTheme.colorScheme.primary else Color.Transparent,
                    modifier = Modifier
                        .weight(1f)
                        .clickable { selectedSubTab = 0 }
                ) {
                    Row(
                        modifier = Modifier.padding(vertical = 8.dp),
                        horizontalArrangement = Arrangement.Center,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            Icons.Default.PhotoAlbum,
                            contentDescription = null,
                            tint = if (selectedSubTab == 0) Color.White else MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(Modifier.width(6.dp))
                        Text(
                            "Album Cards",
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp,
                            color = if (selectedSubTab == 0) Color.White else MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }

                // Tag Manager Tab
                Surface(
                    shape = RoundedCornerShape(50.dp),
                    color = if (selectedSubTab == 1) MaterialTheme.colorScheme.primary else Color.Transparent,
                    modifier = Modifier
                        .weight(1f)
                        .clickable { selectedSubTab = 1 }
                ) {
                    Row(
                        modifier = Modifier.padding(vertical = 8.dp),
                        horizontalArrangement = Arrangement.Center,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            Icons.AutoMirrored.Filled.Label,
                            contentDescription = null,
                            tint = if (selectedSubTab == 1) Color.White else MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(Modifier.width(6.dp))
                        Text(
                            "Tag Manager",
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp,
                            color = if (selectedSubTab == 1) Color.White else MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            if (selectedSubTab == 0) {
                AlbumsCardView(
                    viewModel = viewModel,
                    onNavigateToGalleryWithTag = onNavigateToGalleryWithTag,
                    onOpenCreateAlbum = { showCreateAlbumDialog = true },
                    onNavigateToFavorites = onNavigateToFavorites
                )
            } else {
                TagManagerView(viewModel)
            }
        }
    }
}

// -----------------------------------------------------------------------------------------
// 4A. DEDICATED ALBUMS CARD VIEW (With Search, Filter & 1-Click ZIP Download)
// -----------------------------------------------------------------------------------------
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AlbumsCardView(
    viewModel: PhotoViewModel,
    onNavigateToGalleryWithTag: (String) -> Unit,
    onOpenCreateAlbum: () -> Unit = {},
    onNavigateToFavorites: () -> Unit = {}
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val tags by viewModel.allTags.collectAsState()
    val allGalleryPhotos by viewModel.allGalleryPhotos.collectAsState()
    val favoritePhotos by viewModel.favoritePhotos.collectAsState()

    var searchQuery by remember { mutableStateOf("") }
    var selectedFilter by remember { mutableStateOf("all") } // "all", "favorites", "with_photos"
    var sortByCount by remember { mutableStateOf(false) }

    val filteredTags = remember(tags, allGalleryPhotos, searchQuery, selectedFilter, sortByCount) {
        if (selectedFilter == "favorites") {
            emptyList()
        } else {
            var list = tags.map { tag ->
                val photos = allGalleryPhotos.filter { p -> p.tags.any { it.name == tag.name } }
                Pair(tag, photos)
            }
            if (searchQuery.isNotBlank()) {
                val q = searchQuery.trim().lowercase()
                list = list.filter { it.first.name.lowercase().contains(q) }
            }
            if (selectedFilter == "with_photos") {
                list = list.filter { it.second.isNotEmpty() }
            }
            if (sortByCount) {
                list = list.sortedByDescending { it.second.size }
            }
            list
        }
    }

    val q = searchQuery.trim().lowercase()
    val showFavorites = (selectedFilter == "all" || selectedFilter == "favorites" || (selectedFilter == "with_photos" && favoritePhotos.isNotEmpty())) &&
            (q.isEmpty() || "favorites".contains(q) || "favourite".contains(q) || "loved".contains(q))

    Column(modifier = Modifier.fillMaxSize()) {
        val albumsWithPhotosCount = remember(tags, allGalleryPhotos) {
            tags.count { tag -> allGalleryPhotos.any { p -> p.tags.any { it.name == tag.name } } }
        }

        // Search Albums Input (Full-Width, High-Fashion Editorial Proportions)
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            placeholder = { Text("Search albums by name...", fontSize = 14.sp) },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Search", tint = MaterialTheme.colorScheme.primary) },
            trailingIcon = {
                if (searchQuery.isNotEmpty()) {
                    IconButton(onClick = { searchQuery = "" }) {
                        Icon(Icons.Default.Close, contentDescription = "Clear")
                    }
                }
            },
            singleLine = true,
            shape = RoundedCornerShape(18.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = MaterialTheme.colorScheme.primary,
                unfocusedBorderColor = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.6f)
            ),
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp)
        )

        // Filter & Sort chips row
        Row(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState())
                .padding(horizontal = 16.dp, vertical = 4.dp)
        ) {
            FilterChip(
                selected = selectedFilter == "all",
                onClick = { selectedFilter = "all" },
                label = { Text("All Albums (${tags.size})") }
            )
            FilterChip(
                selected = selectedFilter == "favorites",
                onClick = { selectedFilter = if (selectedFilter == "favorites") "all" else "favorites" },
                leadingIcon = {
                    Icon(
                        Icons.Default.Favorite,
                        contentDescription = null,
                        tint = Color(0xFFF43F5E),
                        modifier = Modifier.size(16.dp)
                    )
                },
                label = { Text("Favorites (${favoritePhotos.size} Photos)") }
            )
            FilterChip(
                selected = selectedFilter == "with_photos",
                onClick = { selectedFilter = if (selectedFilter == "with_photos") "all" else "with_photos" },
                label = { Text("With Photos (${albumsWithPhotosCount} Albums)") }
            )
            FilterChip(
                selected = sortByCount,
                onClick = { sortByCount = !sortByCount },
                leadingIcon = { Icon(Icons.AutoMirrored.Filled.Sort, contentDescription = null, modifier = Modifier.size(16.dp)) },
                label = { Text("Most Photos") }
            )
        }

        Spacer(Modifier.height(6.dp))

        if (!showFavorites && filteredTags.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        Icons.Default.PhotoAlbum,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f),
                        modifier = Modifier.size(48.dp)
                    )
                    Spacer(Modifier.height(8.dp))
                    Text("No albums found.", color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Spacer(Modifier.height(12.dp))
                    Button(
                        onClick = onOpenCreateAlbum,
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(6.dp))
                        Text("Create New Album")
                    }
                }
            }
        } else {
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(14.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                if (showFavorites) {
                    item(key = "favorites_album_card") {
                        val repFavPhoto = favoritePhotos.firstOrNull()

                        Card(
                            shape = RoundedCornerShape(18.dp),
                            border = BorderStroke(1.5.dp, Color(0xFFF43F5E).copy(alpha = 0.55f)),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable {
                                    onNavigateToFavorites()
                                }
                        ) {
                            Column {
                                // Favorites Cover Box
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .aspectRatio(1.2f)
                                        .background(
                                            Brush.linearGradient(
                                                listOf(Color(0xFFF43F5E), Color(0xFF9333EA))
                                            )
                                        )
                                ) {
                                    if (repFavPhoto != null) {
                                        AsyncImage(
                                            model = repFavPhoto.photo.localUri,
                                            contentDescription = "Favorites Album",
                                            modifier = Modifier.fillMaxSize(),
                                            contentScale = ContentScale.Crop
                                        )
                                    }

                                    // Loved photo count badge
                                    Surface(
                                        color = Color(0xFFE11D48),
                                        shape = RoundedCornerShape(50.dp),
                                        modifier = Modifier
                                            .align(Alignment.BottomEnd)
                                            .padding(8.dp)
                                    ) {
                                        Text(
                                            text = "${favoritePhotos.size} ${if (favoritePhotos.size == 1) "photo" else "photos"}",
                                            color = Color.White,
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.Bold,
                                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                                        )
                                    }

                                    // Featured Pill
                                    Surface(
                                        color = Color.Black.copy(alpha = 0.65f),
                                        shape = RoundedCornerShape(50.dp),
                                        modifier = Modifier
                                            .align(Alignment.TopStart)
                                            .padding(8.dp)
                                    ) {
                                        Row(
                                            verticalAlignment = Alignment.CenterVertically,
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                        ) {
                                            Icon(
                                                Icons.Default.Favorite,
                                                contentDescription = null,
                                                tint = Color(0xFFF43F5E),
                                                modifier = Modifier.size(10.dp)
                                            )
                                            Spacer(Modifier.width(3.dp))
                                            Text(
                                                "Featured",
                                                color = Color.White,
                                                fontSize = 9.sp,
                                                fontWeight = FontWeight.Bold
                                            )
                                        }
                                    }
                                }

                                // Favorites Details & Action Bar
                                Column(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(horizontal = 10.dp, vertical = 8.dp)
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Icon(
                                            Icons.Default.Favorite,
                                            contentDescription = null,
                                            tint = Color(0xFFF43F5E),
                                            modifier = Modifier.size(14.dp)
                                        )
                                        Spacer(Modifier.width(4.dp))
                                        Text(
                                            text = "Favorites",
                                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                                            color = Color(0xFFF43F5E),
                                            maxLines = 1,
                                            overflow = TextOverflow.Ellipsis
                                        )
                                    }
                                    Text(
                                        text = if (favoritePhotos.isEmpty()) "No favorites yet" else "${favoritePhotos.size} loved moments",
                                        style = MaterialTheme.typography.bodySmall.copy(
                                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                                            fontSize = 11.sp
                                        )
                                    )

                                    HorizontalDivider(
                                        modifier = Modifier.padding(vertical = 6.dp),
                                        color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.4f)
                                    )

                                    // 1-Click Download Whole Album as ZIP & Share
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        FilledTonalButton(
                                            onClick = {
                                                if (favoritePhotos.isNotEmpty()) {
                                                    coroutineScope.launch {
                                                        Toast.makeText(context, "Packaging 'Favorites' album...", Toast.LENGTH_SHORT).show()
                                                        val zipFile = ExportUtils.createZipExport(context, favoritePhotos, "Favorites_Album")
                                                        if (zipFile != null) {
                                                            val ok = ExportUtils.saveToDownloads(context, zipFile)
                                                            if (ok) {
                                                                Toast.makeText(context, "Downloaded 'Favorites' album to Downloads!", Toast.LENGTH_LONG).show()
                                                            }
                                                        }
                                                    }
                                                } else {
                                                    Toast.makeText(context, "Favorites album is empty!", Toast.LENGTH_SHORT).show()
                                                }
                                            },
                                            enabled = favoritePhotos.isNotEmpty(),
                                            contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                                            shape = RoundedCornerShape(8.dp),
                                            modifier = Modifier.height(30.dp)
                                        ) {
                                            Icon(Icons.Default.Download, contentDescription = "Download Album", modifier = Modifier.size(14.dp))
                                            Spacer(Modifier.width(4.dp))
                                            Text("Download", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                        }

                                        IconButton(
                                            onClick = {
                                                if (favoritePhotos.isNotEmpty()) {
                                                    coroutineScope.launch {
                                                        val zipFile = ExportUtils.createZipExport(context, favoritePhotos, "Favorites_Album")
                                                        if (zipFile != null) {
                                                            ExportUtils.shareZipFile(context, zipFile)
                                                        }
                                                    }
                                                } else {
                                                    Toast.makeText(context, "Favorites album is empty!", Toast.LENGTH_SHORT).show()
                                                }
                                            },
                                            enabled = favoritePhotos.isNotEmpty(),
                                            modifier = Modifier.size(30.dp)
                                        ) {
                                            Icon(Icons.Default.Share, contentDescription = "Share Album", modifier = Modifier.size(16.dp))
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                items(filteredTags, key = { it.first.name }) { (tag, albumPhotos) ->
                    val tagColor = tag.color?.let { Color(it) } ?: MaterialTheme.colorScheme.primary
                    val repPhoto = albumPhotos.firstOrNull()

                    Card(
                        shape = RoundedCornerShape(18.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable {
                                onNavigateToGalleryWithTag(tag.name)
                            }
                    ) {
                        Column {
                            // Album Cover Art Box
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .aspectRatio(1.2f)
                                    .background(
                                        Brush.linearGradient(
                                            listOf(tagColor.copy(alpha = 0.8f), MaterialTheme.colorScheme.primary)
                                        )
                                    )
                            ) {
                                if (repPhoto != null) {
                                    AsyncImage(
                                        model = repPhoto.photo.localUri,
                                        contentDescription = tag.name,
                                        modifier = Modifier.fillMaxSize(),
                                        contentScale = ContentScale.Crop
                                    )
                                }

                                // Photo count badge
                                Surface(
                                    color = Color.Black.copy(alpha = 0.65f),
                                    shape = RoundedCornerShape(50.dp),
                                    modifier = Modifier
                                        .align(Alignment.BottomEnd)
                                        .padding(8.dp)
                                ) {
                                    Text(
                                        text = "${albumPhotos.size} ${if (albumPhotos.size == 1) "photo" else "photos"}",
                                        color = Color.White,
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                                    )
                                }

                                // Tag color indicator dot
                                Surface(
                                    color = tagColor,
                                    shape = CircleShape,
                                    modifier = Modifier
                                        .align(Alignment.TopStart)
                                        .padding(8.dp)
                                        .size(12.dp)
                                ) {}
                            }

                            // Album Details & Action Bar
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 10.dp, vertical = 8.dp)
                            ) {
                                Text(
                                    text = tag.name,
                                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                Text(
                                    text = if (albumPhotos.isEmpty()) "Empty album" else "${albumPhotos.size} moments",
                                    style = MaterialTheme.typography.bodySmall.copy(
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                        fontSize = 11.sp
                                    )
                                )

                                HorizontalDivider(
                                    modifier = Modifier.padding(vertical = 6.dp),
                                    color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.4f)
                                )

                                // 1-Click Download Whole Album as ZIP & Share
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    FilledTonalButton(
                                        onClick = {
                                            if (albumPhotos.isNotEmpty()) {
                                                coroutineScope.launch {
                                                    Toast.makeText(context, "Packaging '${tag.name}' album...", Toast.LENGTH_SHORT).show()
                                                    val zipFile = ExportUtils.createZipExport(context, albumPhotos, "${tag.name}_Album")
                                                    if (zipFile != null) {
                                                        val ok = ExportUtils.saveToDownloads(context, zipFile)
                                                        if (ok) {
                                                            Toast.makeText(context, "Downloaded '${tag.name}' album to Downloads!", Toast.LENGTH_LONG).show()
                                                        }
                                                    }
                                                }
                                            } else {
                                                Toast.makeText(context, "Album is empty!", Toast.LENGTH_SHORT).show()
                                            }
                                        },
                                        enabled = albumPhotos.isNotEmpty(),
                                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                                        shape = RoundedCornerShape(8.dp),
                                        modifier = Modifier.height(30.dp)
                                    ) {
                                        Icon(Icons.Default.Download, contentDescription = "Download Album", modifier = Modifier.size(14.dp))
                                        Spacer(Modifier.width(4.dp))
                                        Text("Download", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                    }

                                    IconButton(
                                        onClick = {
                                            if (albumPhotos.isNotEmpty()) {
                                                coroutineScope.launch {
                                                    val zipFile = ExportUtils.createZipExport(context, albumPhotos, "${tag.name}_Album")
                                                    if (zipFile != null) {
                                                        ExportUtils.shareZipFile(context, zipFile)
                                                    }
                                                }
                                            } else {
                                                Toast.makeText(context, "Album is empty!", Toast.LENGTH_SHORT).show()
                                            }
                                        },
                                        enabled = albumPhotos.isNotEmpty(),
                                        modifier = Modifier.size(30.dp)
                                    ) {
                                        Icon(Icons.Default.Share, contentDescription = "Share Album", modifier = Modifier.size(16.dp))
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// -----------------------------------------------------------------------------------------
// 4B. DEDICATED TAG MANAGER VIEW (Create, Color, Rename & Safe Delete)
// -----------------------------------------------------------------------------------------
@Composable
fun TagManagerView(viewModel: PhotoViewModel) {
    val tags by viewModel.allTags.collectAsState()
    val allGalleryPhotos by viewModel.allGalleryPhotos.collectAsState()
    val context = LocalContext.current

    var newTagName by remember { mutableStateOf("") }
    var selectedColorIndex by remember { mutableIntStateOf(0) }

    var tagToEdit by remember { mutableStateOf<Tag?>(null) }
    var tagToDelete by remember { mutableStateOf<Tag?>(null) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        // Create New Tag Card
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    "Create New Album Category",
                    style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
                )
                Spacer(Modifier.height(8.dp))
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    OutlinedTextField(
                        value = newTagName,
                        onValueChange = { newTagName = it },
                        label = { Text("e.g. Wedding, Birthday, Job Offer") },
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.weight(1f)
                    )
                    Spacer(Modifier.width(8.dp))
                    Button(
                        onClick = {
                            if (newTagName.isNotBlank()) {
                                viewModel.createTag(newTagName.trim(), TagColors[selectedColorIndex])
                                newTagName = ""
                                Toast.makeText(context, "Tag created", Toast.LENGTH_SHORT).show()
                            }
                        },
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text("Add")
                    }
                }
                Spacer(Modifier.height(10.dp))
                Text("Palette Color:", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                Spacer(Modifier.height(6.dp))
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.horizontalScroll(rememberScrollState())
                ) {
                    TagColors.forEachIndexed { index, colorVal ->
                        val color = Color(colorVal)
                        val isSelected = selectedColorIndex == index
                        Box(
                            modifier = Modifier
                                .size(28.dp)
                                .clip(CircleShape)
                                .background(color)
                                .clickable { selectedColorIndex = index }
                                .then(
                                    if (isSelected) Modifier.border(2.5.dp, MaterialTheme.colorScheme.onSurface, CircleShape)
                                    else Modifier
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            if (isSelected) {
                                Icon(Icons.Default.Check, contentDescription = null, tint = Color.White, modifier = Modifier.size(16.dp))
                            }
                        }
                    }
                }
            }
        }

        Spacer(Modifier.height(16.dp))

        Text(
            "All Categories (${tags.size})",
            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
        )
        Spacer(Modifier.height(8.dp))

        if (tags.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                contentAlignment = Alignment.Center
            ) {
                Text("No tags created yet.", color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        } else {
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.weight(1f)
            ) {
                items(tags, key = { it.name }) { tag ->
                    val count = allGalleryPhotos.count { p -> p.tags.any { it.name == tag.name } }
                    val tagColor = tag.color?.let { Color(it) } ?: MaterialTheme.colorScheme.primary

                    Card(
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 16.dp, vertical = 12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(14.dp)
                                    .clip(CircleShape)
                                    .background(tagColor)
                            )
                            Spacer(Modifier.width(12.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = tag.name,
                                    style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.Bold)
                                )
                                Text(
                                    text = "$count ${if (count == 1) "photo" else "photos"} categorized",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }

                            IconButton(onClick = { tagToEdit = tag }) {
                                Icon(Icons.Default.Edit, contentDescription = "Edit Tag", tint = MaterialTheme.colorScheme.primary)
                            }
                            IconButton(onClick = { tagToDelete = tag }) {
                                Icon(Icons.Default.Delete, contentDescription = "Delete Tag", tint = MaterialTheme.colorScheme.error)
                            }
                        }
                    }
                }
            }
        }
    }

    if (tagToEdit != null) {
        var editedName by remember { mutableStateOf(tagToEdit!!.name) }
        var editedColorIndex by remember {
            mutableIntStateOf(
                TagColors.indexOf(tagToEdit!!.color).takeIf { it >= 0 } ?: 0
            )
        }

        AlertDialog(
            onDismissRequest = { tagToEdit = null },
            title = { Text("Edit Category") },
            text = {
                Column {
                    OutlinedTextField(
                        value = editedName,
                        onValueChange = { editedName = it },
                        label = { Text("Name") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(Modifier.height(12.dp))
                    Text("Palette Color:", style = MaterialTheme.typography.labelSmall)
                    Spacer(Modifier.height(6.dp))
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.horizontalScroll(rememberScrollState())
                    ) {
                        TagColors.forEachIndexed { index, colorVal ->
                            val color = Color(colorVal)
                            val isSelected = editedColorIndex == index
                            Box(
                                modifier = Modifier
                                    .size(28.dp)
                                    .clip(CircleShape)
                                    .background(color)
                                    .clickable { editedColorIndex = index }
                                    .then(
                                        if (isSelected) Modifier.border(2.5.dp, MaterialTheme.colorScheme.onSurface, CircleShape)
                                        else Modifier
                                    ),
                                contentAlignment = Alignment.Center
                            ) {
                                if (isSelected) {
                                    Icon(Icons.Default.Check, contentDescription = null, tint = Color.White, modifier = Modifier.size(16.dp))
                                }
                            }
                        }
                    }
                }
            },
            confirmButton = {
                Button(onClick = {
                    if (editedName.isNotBlank()) {
                        val newColor = TagColors[editedColorIndex]
                        if (editedName.trim() != tagToEdit!!.name) {
                            viewModel.renameTag(tagToEdit!!.name, editedName.trim())
                        }
                        viewModel.updateTagColor(editedName.trim(), newColor)
                        tagToEdit = null
                        Toast.makeText(context, "Category updated", Toast.LENGTH_SHORT).show()
                    }
                }) {
                    Text("Save")
                }
            },
            dismissButton = {
                TextButton(onClick = { tagToEdit = null }) {
                    Text("Cancel")
                }
            }
        )
    }

    if (tagToDelete != null) {
        AlertDialog(
            onDismissRequest = { tagToDelete = null },
            title = { Text("Delete '${tagToDelete!!.name}'?") },
            text = {
                Text(
                    "Photos in this album will NOT be deleted. Only the tag will be removed from them.",
                    style = MaterialTheme.typography.bodyMedium
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.deleteTag(tagToDelete!!.name)
                        tagToDelete = null
                        Toast.makeText(context, "Tag deleted safely", Toast.LENGTH_SHORT).show()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
                ) {
                    Text("Delete")
                }
            },
            dismissButton = {
                TextButton(onClick = { tagToDelete = null }) {
                    Text("Cancel")
                }
            }
        )
    }
}

// -----------------------------------------------------------------------------------------
// 5. FAVORITES SCREEN
// -----------------------------------------------------------------------------------------
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FavoritesScreen(
    viewModel: PhotoViewModel,
    onPhotoClick: (PhotoWithTags) -> Unit
) {
    val favoritePhotos by viewModel.favoritePhotos.collectAsState()
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("Favorite Photos", style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.ExtraBold))
                        Text(
                            "${favoritePhotos.size} ${if (favoritePhotos.size == 1) "loved photo" else "loved photos"}",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                actions = {
                    if (favoritePhotos.isNotEmpty()) {
                        IconButton(onClick = {
                            coroutineScope.launch {
                                val zipFile = ExportUtils.createZipExport(context, favoritePhotos, "Favorites_Album")
                                if (zipFile != null) {
                                    ExportUtils.saveToDownloads(context, zipFile)
                                    Toast.makeText(context, "Saved all favorites to Downloads!", Toast.LENGTH_SHORT).show()
                                }
                            }
                        }) {
                            Icon(Icons.Default.Download, contentDescription = "Export All Favorites ZIP")
                        }
                        IconButton(onClick = {
                            coroutineScope.launch {
                                val zipFile = ExportUtils.createZipExport(context, favoritePhotos, "Favorites_Album")
                                if (zipFile != null) {
                                    ExportUtils.shareZipFile(context, zipFile)
                                }
                            }
                        }) {
                            Icon(Icons.Default.Share, contentDescription = "Share Favorites Album")
                        }
                    }
                }
            )
        }
    ) { paddingValues ->
        if (favoritePhotos.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .padding(32.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        Icons.Default.FavoriteBorder,
                        contentDescription = null,
                        tint = Color.Red.copy(alpha = 0.6f),
                        modifier = Modifier.size(64.dp)
                    )
                    Spacer(Modifier.height(12.dp))
                    Text("No Favorites Yet", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold))
                    Spacer(Modifier.height(4.dp))
                    Text(
                        "Tap the heart icon on any photo in the Gallery to find them easily here.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = TextAlign.Center
                    )
                }
            }
        } else {
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                contentPadding = PaddingValues(16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp),
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
            ) {
                items(favoritePhotos, key = { it.photo.id }) { photoWithTags ->
                    GalleryPhotoCard(
                        photoWithTags = photoWithTags,
                        isSelected = false,
                        isSelectionMode = false,
                        onClick = { onPhotoClick(photoWithTags) },
                        onLongClick = {},
                        onToggleFavorite = {
                            viewModel.toggleFavorite(photoWithTags.photo.id, false)
                        },
                        onDownload = {
                            coroutineScope.launch {
                                val zipFile = ExportUtils.createZipExport(context, listOf(photoWithTags), photoWithTags.photo.displayName)
                                if (zipFile != null) {
                                    ExportUtils.saveToDownloads(context, zipFile)
                                    Toast.makeText(context, "Saved to Downloads!", Toast.LENGTH_SHORT).show()
                                }
                            }
                        },
                        onShare = {
                            coroutineScope.launch {
                                val zipFile = ExportUtils.createZipExport(context, listOf(photoWithTags), photoWithTags.photo.displayName)
                                if (zipFile != null) {
                                    ExportUtils.shareZipFile(context, zipFile)
                                }
                            }
                        }
                    )
                }
            }
        }
    }
}

// -----------------------------------------------------------------------------------------
// 6. TRASH SCREEN (30-day lifecycle)
// -----------------------------------------------------------------------------------------
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TrashScreen(viewModel: PhotoViewModel) {
    val trashPhotos by viewModel.trashPhotos.collectAsState()
    val context = LocalContext.current
    var showEmptyTrashConfirm by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("Trash", style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.ExtraBold))
                        Text("Retained for 30 days before permanent deletion", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                },
                actions = {
                    if (trashPhotos.isNotEmpty()) {
                        TextButton(
                            onClick = { showEmptyTrashConfirm = true },
                            colors = ButtonDefaults.textButtonColors(contentColor = MaterialTheme.colorScheme.error)
                        ) {
                            Icon(Icons.Default.DeleteSweep, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(Modifier.width(4.dp))
                            Text("Empty Trash")
                        }
                    }
                }
            )
        }
    ) { paddingValues ->
        if (trashPhotos.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .padding(32.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        Icons.Outlined.Delete,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.outline,
                        modifier = Modifier.size(64.dp)
                    )
                    Spacer(Modifier.height(12.dp))
                    Text("Trash is Empty", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold))
                    Spacer(Modifier.height(4.dp))
                    Text(
                        "Deleted photos stay here safely for 30 days before being permanently removed.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = TextAlign.Center
                    )
                }
            }
        } else {
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                contentPadding = PaddingValues(16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp),
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
            ) {
                items(trashPhotos, key = { it.photo.id }) { photoWithTags ->
                    val deletedAt = photoWithTags.photo.deletedAt ?: System.currentTimeMillis()
                    val daysPassed = (System.currentTimeMillis() - deletedAt) / (1000 * 60 * 60 * 24)
                    val daysRemaining = maxOf(0L, 30L - daysPassed)

                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .aspectRatio(1f)
                                    .background(Color.DarkGray)
                            ) {
                                AsyncImage(
                                    model = photoWithTags.photo.localUri,
                                    contentDescription = photoWithTags.photo.displayName,
                                    modifier = Modifier.fillMaxSize(),
                                    contentScale = ContentScale.Crop
                                )

                                Surface(
                                    color = Color.Black.copy(alpha = 0.75f),
                                    shape = RoundedCornerShape(4.dp),
                                    modifier = Modifier
                                        .align(Alignment.BottomCenter)
                                        .padding(4.dp)
                                ) {
                                    Text(
                                        "${daysRemaining}d left",
                                        color = Color.White,
                                        style = MaterialTheme.typography.labelSmall.copy(fontSize = 10.sp, fontWeight = FontWeight.Bold),
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                    )
                                }
                            }

                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(6.dp),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                TextButton(
                                    onClick = {
                                        viewModel.restoreFromTrash(photoWithTags.photo.id)
                                        Toast.makeText(context, "Restored to Gallery", Toast.LENGTH_SHORT).show()
                                    },
                                    contentPadding = PaddingValues(horizontal = 6.dp, vertical = 2.dp)
                                ) {
                                    Text("Restore", fontSize = 11.sp)
                                }

                                TextButton(
                                    onClick = {
                                        viewModel.deletePermanently(photoWithTags.photo.id)
                                        Toast.makeText(context, "Permanently erased", Toast.LENGTH_SHORT).show()
                                    },
                                    contentPadding = PaddingValues(horizontal = 6.dp, vertical = 2.dp)
                                ) {
                                    Text("Erase", fontSize = 11.sp, color = MaterialTheme.colorScheme.error)
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if (showEmptyTrashConfirm) {
        AlertDialog(
            onDismissRequest = { showEmptyTrashConfirm = false },
            title = { Text("Empty Trash?") },
            text = { Text("This will permanently delete all photos in the trash. This action cannot be undone.") },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.emptyTrash()
                        showEmptyTrashConfirm = false
                        Toast.makeText(context, "Trash emptied", Toast.LENGTH_SHORT).show()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
                ) {
                    Text("Empty Everything")
                }
            },
            dismissButton = {
                TextButton(onClick = { showEmptyTrashConfirm = false }) {
                    Text("Cancel")
                }
            }
        )
    }
}

// -----------------------------------------------------------------------------------------
// 7. PHOTO DETAIL SCREEN (Full Screen, Download, Share, Manage Tags)
// -----------------------------------------------------------------------------------------
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PhotoDetailScreen(
    photoWithTags: PhotoWithTags,
    viewModel: PhotoViewModel,
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val allTags by viewModel.allTags.collectAsState()
    val allGallery by viewModel.allGalleryPhotos.collectAsState()
    val favorites by viewModel.favoritePhotos.collectAsState()
    val pending by viewModel.pendingPhotos.collectAsState()

    val currentPhoto = allGallery.find { it.photo.id == photoWithTags.photo.id }
        ?: favorites.find { it.photo.id == photoWithTags.photo.id }
        ?: pending.find { it.photo.id == photoWithTags.photo.id }
        ?: photoWithTags

    var showManageTagsDialog by remember { mutableStateOf(false) }

    BackHandler(onBack = onBack)

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            currentPhoto.photo.displayName,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                        )
                        val formattedDate = SimpleDateFormat("MMM d, yyyy · h:mm a", Locale.getDefault())
                            .format(Date(currentPhoto.photo.createdAt))
                        Text(formattedDate, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    // Favorite Toggle
                    IconButton(onClick = {
                        viewModel.toggleFavorite(currentPhoto.photo.id, !currentPhoto.photo.isFavorite)
                    }) {
                        Icon(
                            imageVector = if (currentPhoto.photo.isFavorite) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                            contentDescription = "Favorite",
                            tint = if (currentPhoto.photo.isFavorite) Color.Red else LocalContentColor.current
                        )
                    }

                    // Native Share
                    IconButton(onClick = {
                        coroutineScope.launch {
                            val zipFile = ExportUtils.createZipExport(context, listOf(currentPhoto), currentPhoto.photo.displayName)
                            if (zipFile != null) {
                                ExportUtils.shareZipFile(context, zipFile)
                            }
                        }
                    }) {
                        Icon(Icons.Default.Share, contentDescription = "Share")
                    }

                    // Download to Public Downloads
                    IconButton(onClick = {
                        coroutineScope.launch {
                            val zipFile = ExportUtils.createZipExport(context, listOf(currentPhoto), currentPhoto.photo.displayName)
                            if (zipFile != null) {
                                val ok = ExportUtils.saveToDownloads(context, zipFile)
                                if (ok) {
                                    Toast.makeText(context, "Saved to device Downloads!", Toast.LENGTH_SHORT).show()
                                }
                            }
                        }
                    }) {
                        Icon(Icons.Default.Download, contentDescription = "Download")
                    }

                    // Move to Trash
                    IconButton(onClick = {
                        viewModel.moveToTrash(currentPhoto.photo.id)
                        Toast.makeText(context, "Moved to Trash", Toast.LENGTH_SHORT).show()
                        onBack()
                    }) {
                        Icon(Icons.Default.Delete, contentDescription = "Delete", tint = MaterialTheme.colorScheme.error)
                    }
                }
            )
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(Color.Black)
        ) {
            AsyncImage(
                model = currentPhoto.photo.localUri,
                contentDescription = currentPhoto.photo.displayName,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Fit
            )

            // Bottom Tags Sheet
            Surface(
                color = Color.Black.copy(alpha = 0.8f),
                modifier = Modifier
                    .fillMaxWidth()
                    .align(Alignment.BottomCenter)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            "Assigned Albums & Tags (${currentPhoto.tags.size})",
                            style = MaterialTheme.typography.titleSmall.copy(color = Color.White, fontWeight = FontWeight.Bold)
                        )
                        FilledTonalButton(
                            onClick = { showManageTagsDialog = true },
                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)
                        ) {
                            Icon(Icons.Default.LocalOffer, contentDescription = null, modifier = Modifier.size(14.dp))
                            Spacer(Modifier.width(4.dp))
                            Text("Edit Tags", fontSize = 12.sp)
                        }
                    }

                    Spacer(Modifier.height(8.dp))

                    if (currentPhoto.tags.isEmpty()) {
                        Text(
                            "No tags assigned. Tap 'Edit Tags' to categorize this photo into an album (e.g. Wedding, Birthday).",
                            color = Color.LightGray,
                            style = MaterialTheme.typography.bodySmall
                        )
                    } else {
                        LazyRow(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            items(currentPhoto.tags, key = { it.name }) { tag ->
                                val tagColor = tag.color?.let { Color(it) } ?: MaterialTheme.colorScheme.primary
                                Surface(
                                    color = tagColor,
                                    shape = RoundedCornerShape(16.dp),
                                    modifier = Modifier.padding(vertical = 2.dp)
                                ) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        modifier = Modifier.padding(start = 10.dp, end = 6.dp, top = 4.dp, bottom = 4.dp)
                                    ) {
                                        Text(tag.name, color = Color.White, style = MaterialTheme.typography.labelMedium)
                                        Spacer(Modifier.width(4.dp))
                                        IconButton(
                                            onClick = { viewModel.removeTagFromPhoto(currentPhoto.photo.id, tag.name) },
                                            modifier = Modifier.size(16.dp)
                                        ) {
                                            Icon(
                                                Icons.Default.Close,
                                                contentDescription = "Remove tag",
                                                tint = Color.White,
                                                modifier = Modifier.size(12.dp)
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if (showManageTagsDialog) {
        val assignedTagNames = currentPhoto.tags.map { it.name }.toSet()
        var selectedTagNames by remember { mutableStateOf(assignedTagNames) }
        var newTagInput by remember { mutableStateOf("") }

        AlertDialog(
            onDismissRequest = { showManageTagsDialog = false },
            title = { Text("Categorize Photo") },
            text = {
                Column(modifier = Modifier.fillMaxWidth()) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        OutlinedTextField(
                            value = newTagInput,
                            onValueChange = { newTagInput = it },
                            placeholder = { Text("New album tag name...") },
                            singleLine = true,
                            modifier = Modifier.weight(1f)
                        )
                        Spacer(Modifier.width(6.dp))
                        IconButton(
                            onClick = {
                                if (newTagInput.isNotBlank()) {
                                    val t = newTagInput.trim()
                                    viewModel.createTag(t)
                                    selectedTagNames = selectedTagNames + t
                                    newTagInput = ""
                                }
                            }
                        ) {
                            Icon(Icons.Default.AddCircle, contentDescription = "Add", tint = MaterialTheme.colorScheme.primary)
                        }
                    }

                    Spacer(Modifier.height(14.dp))
                    Text("Select albums to assign:", style = MaterialTheme.typography.labelSmall)
                    Spacer(Modifier.height(8.dp))

                    if (allTags.isEmpty()) {
                        Text("No albums exist yet. Type a name above to create one!", color = MaterialTheme.colorScheme.onSurfaceVariant)
                    } else {
                        LazyVerticalGrid(
                            columns = GridCells.Adaptive(minSize = 90.dp),
                            horizontalArrangement = Arrangement.spacedBy(6.dp),
                            verticalArrangement = Arrangement.spacedBy(6.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .heightIn(max = 220.dp)
                        ) {
                            items(allTags, key = { it.name }) { tag ->
                                val isSelected = selectedTagNames.contains(tag.name)
                                val tagColor = tag.color?.let { Color(it) } ?: MaterialTheme.colorScheme.primary
                                FilterChip(
                                    selected = isSelected,
                                    onClick = {
                                        selectedTagNames = if (isSelected) selectedTagNames - tag.name else selectedTagNames + tag.name
                                    },
                                    leadingIcon = {
                                        Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(tagColor))
                                    },
                                    label = { Text(tag.name, fontSize = 12.sp) }
                                )
                            }
                        }
                    }
                }
            },
            confirmButton = {
                Button(onClick = {
                    val toAdd = selectedTagNames - assignedTagNames
                    val toRemove = assignedTagNames - selectedTagNames
                    toAdd.forEach { viewModel.addTagToPhoto(currentPhoto.photo.id, it) }
                    toRemove.forEach { viewModel.removeTagFromPhoto(currentPhoto.photo.id, it) }
                    showManageTagsDialog = false
                    Toast.makeText(context, "Albums updated", Toast.LENGTH_SHORT).show()
                }) {
                    Text("Apply")
                }
            },
            dismissButton = {
                TextButton(onClick = { showManageTagsDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }
}

// -----------------------------------------------------------------------------------------
// 8. BATCH TAG ASSIGNMENT DIALOG
// -----------------------------------------------------------------------------------------
@Composable
fun BatchTagAssignmentDialog(
    allTags: List<Tag>,
    onCreateTag: (String, Long?) -> Unit,
    onDismiss: () -> Unit,
    onApply: (List<String>) -> Unit
) {
    var selectedTagNames by remember { mutableStateOf(setOf<String>()) }
    var newTagInput by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Assign to Albums") },
        text = {
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    "Choose one or more albums for selected photos. They will be saved to your main Gallery with these tags.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(Modifier.height(12.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    OutlinedTextField(
                        value = newTagInput,
                        onValueChange = { newTagInput = it },
                        placeholder = { Text("Create album (e.g. Wedding)...") },
                        singleLine = true,
                        modifier = Modifier.weight(1f)
                    )
                    Spacer(Modifier.width(6.dp))
                    IconButton(
                        onClick = {
                            if (newTagInput.isNotBlank()) {
                                val t = newTagInput.trim()
                                onCreateTag(t, null)
                                selectedTagNames = selectedTagNames + t
                                newTagInput = ""
                            }
                        }
                    ) {
                        Icon(Icons.Default.AddCircle, contentDescription = "Add", tint = MaterialTheme.colorScheme.primary)
                    }
                }

                Spacer(Modifier.height(14.dp))

                if (allTags.isNotEmpty()) {
                    LazyVerticalGrid(
                        columns = GridCells.Adaptive(minSize = 95.dp),
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .heightIn(max = 220.dp)
                    ) {
                        items(allTags, key = { it.name }) { tag ->
                            val isSelected = selectedTagNames.contains(tag.name)
                            val tagColor = tag.color?.let { Color(it) } ?: MaterialTheme.colorScheme.primary
                            FilterChip(
                                selected = isSelected,
                                onClick = {
                                    selectedTagNames = if (isSelected) selectedTagNames - tag.name else selectedTagNames + tag.name
                                },
                                leadingIcon = {
                                    Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(tagColor))
                                },
                                label = { Text(tag.name, fontSize = 12.sp) }
                            )
                        }
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = { onApply(selectedTagNames.toList()) },
                enabled = true
            ) {
                Text("Confirm & Move to Gallery")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}
