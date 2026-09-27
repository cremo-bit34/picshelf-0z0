param (
    [Parameter(Mandatory=$true)]
    [string]$SourceImagePath
)

Add-Type -AssemblyName System.Drawing

if (-not (Test-Path $SourceImagePath)) {
    Write-Error "Source image not found: $SourceImagePath"
    exit 1
}

$srcBmp = [System.Drawing.Bitmap]::FromFile($SourceImagePath)
Write-Host "Loaded source image ($($srcBmp.Width)x$($srcBmp.Height)) from: $SourceImagePath"

function Create-ResizedBitmap {
    param (
        [System.Drawing.Bitmap]$source,
        [int]$width,
        [int]$height,
        [bool]$makeCircular = $false
    )
    $dest = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    if ($makeCircular) {
        $path = New-Object System.Drawing.Drawing2D.GraphicsPath
        $path.AddEllipse(0, 0, $width, $height)
        $g.SetClip($path)
    }

    $g.DrawImage($source, 0, 0, $width, $height)
    $g.Dispose()
    return $dest
}

function Create-AdaptiveForeground {
    param (
        [System.Drawing.Bitmap]$source,
        [int]$canvasSize,
        [int]$innerSize
    )
    $dest = New-Object System.Drawing.Bitmap($canvasSize, $canvasSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $offset = [int](($canvasSize - $innerSize) / 2)
    $g.DrawImage($source, $offset, $offset, $innerSize, $innerSize)
    $g.Dispose()
    return $dest
}

$workspaceRoot = "c:\Users\svika\Downloads\AI\photoorganizer"
$resDir = Join-Path $workspaceRoot "app\src\main\res"

$densityMap = @{
    "mipmap-mdpi"    = @{ Legacy = 48;  AdaptiveCanvas = 108; AdaptiveInner = 76 }
    "mipmap-hdpi"    = @{ Legacy = 72;  AdaptiveCanvas = 162; AdaptiveInner = 114 }
    "mipmap-xhdpi"   = @{ Legacy = 96;  AdaptiveCanvas = 216; AdaptiveInner = 152 }
    "mipmap-xxhdpi"  = @{ Legacy = 144; AdaptiveCanvas = 324; AdaptiveInner = 228 }
    "mipmap-xxxhdpi" = @{ Legacy = 192; AdaptiveCanvas = 432; AdaptiveInner = 304 }
}

foreach ($folder in $densityMap.Keys) {
    $cfg = $densityMap[$folder]
    $dir = Join-Path $resDir $folder
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }

    # Legacy square/squircle icon
    $squareBmp = Create-ResizedBitmap -source $srcBmp -width $cfg.Legacy -height $cfg.Legacy -makeCircular $false
    $squarePath = Join-Path $dir "ic_launcher.png"
    $squareBmp.Save($squarePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $squareBmp.Dispose()

    # Legacy round icon for round launcher support
    $roundBmp = Create-ResizedBitmap -source $srcBmp -width $cfg.Legacy -height $cfg.Legacy -makeCircular $true
    $roundPath = Join-Path $dir "ic_launcher_round.png"
    $roundBmp.Save($roundPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $roundBmp.Dispose()

    # Android 8.0+ Adaptive foreground
    $fgBmp = Create-AdaptiveForeground -source $srcBmp -canvasSize $cfg.AdaptiveCanvas -innerSize $cfg.AdaptiveInner
    $fgPath = Join-Path $dir "ic_launcher_foreground.png"
    $fgBmp.Save($fgPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $fgBmp.Dispose()

    Write-Host "Generated $folder icons: legacy ($($cfg.Legacy)px), adaptive foreground ($($cfg.AdaptiveCanvas)px)"
}

# Play Store 512x512
$playStoreBmp = Create-ResizedBitmap -source $srcBmp -width 512 -height 512 -makeCircular $false
$playStorePath = Join-Path $workspaceRoot "app\src\main\ic_launcher-playstore.png"
$playStoreBmp.Save($playStorePath, [System.Drawing.Imaging.ImageFormat]::Png)
$playStoreBmp.Dispose()
Write-Host "Generated Play Store Icon (512x512): $playStorePath"

# Web icons (web/icon.png & web/favicon.png)
$webDir = Join-Path $workspaceRoot "web"
$webIconBmp = Create-ResizedBitmap -source $srcBmp -width 192 -height 192 -makeCircular $false
$webIconPath = Join-Path $webDir "icon.png"
$webIconBmp.Save($webIconPath, [System.Drawing.Imaging.ImageFormat]::Png)
$webIconBmp.Dispose()

$webFaviconBmp = Create-ResizedBitmap -source $srcBmp -width 64 -height 64 -makeCircular $true
$webFaviconPath = Join-Path $webDir "favicon.png"
$webFaviconBmp.Save($webFaviconPath, [System.Drawing.Imaging.ImageFormat]::Png)
$webFaviconBmp.Dispose()
Write-Host "Generated Web Icons: $webIconPath, $webFaviconPath"

# Sync web icons to app assets
$assetsDir = Join-Path $workspaceRoot "app\src\main\assets\web"
if (Test-Path $assetsDir) {
    Copy-Item -Path $webIconPath -Destination (Join-Path $assetsDir "icon.png") -Force
    Copy-Item -Path $webFaviconPath -Destination (Join-Path $assetsDir "favicon.png") -Force
    Write-Host "Synced web icons to Android assets"
}

$srcBmp.Dispose()
Write-Host "All icons generated successfully!"
