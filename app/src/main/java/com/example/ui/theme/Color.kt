package com.example.ui.theme

import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color

// Adobe-inspired Luxury Rose Gold & Sunset Glow Accents
val BrandPrimary = Color(0xFFF43F5E) // Luxury Rose
val BrandPrimaryDark = Color(0xFFFB7185) // Blush Rose Glow
val BrandSecondary = Color(0xFF8B5CF6) // Royal Lavender
val BrandSecondaryDark = Color(0xFFA78BFA)
val BrandTertiary = Color(0xFFF59E0B) // Warm Amber Gold
val BrandTertiaryDark = Color(0xFFFBBF24)

// Light Theme Palette
val LightBackground = Color(0xFFFFFBFB)
val LightSurface = Color(0xFFFFFFFF)
val LightSurfaceVariant = Color(0xFFFDF2F4)
val LightOnSurface = Color(0xFF1C1917)
val LightOnSurfaceVariant = Color(0xFF78716C)
val LightPrimaryContainer = Color(0xFFFFE4E6)
val LightOnPrimaryContainer = Color(0xFF9F1239)

// Dark Theme Palette - Deep Velvet Obsidian & Plum
val DarkBackground = Color(0xFF0C0A09)
val DarkSurface = Color(0xFF1C1917)
val DarkSurfaceVariant = Color(0xFF292524)
val DarkOnSurface = Color(0xFFFAFAF9)
val DarkOnSurfaceVariant = Color(0xFFA8A29E)
val DarkPrimaryContainer = Color(0xFF4C0519)
val DarkOnPrimaryContainer = Color(0xFFFFE4E6)

// Gradient Brushes
val LuxurySunsetBrush = Brush.linearGradient(
    colors = listOf(Color(0xFFF43F5E), Color(0xFFFB7185), Color(0xFFF59E0B))
)

val LavenderGlowBrush = Brush.linearGradient(
    colors = listOf(Color(0xFF8B5CF6), Color(0xFFEC4899))
)

// Predefined Tag Colors
val TagColors = listOf(
    0xFFE11D48, // Rose Red
    0xFFD97706, // Amber Gold
    0xFF059669, // Emerald
    0xFF7C3AED, // Royal Violet
    0xFF0284C7, // Sky Blue
    0xFFDB2777, // Blossom Pink
    0xFF4F46E5, // Indigo
    0xFF0891B2  // Teal
)
