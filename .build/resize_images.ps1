$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$base = "c:/Users/Administrator/Documents/GitHub/cascadavelodenovia/images"

function Save-Jpeg($bitmap, $outPath, $quality) {
  $enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
  $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$quality)
  $bitmap.Save($outPath, $enc, $ep)
}

function Resize-Photo([string]$file, [int]$maxDim) {
  $src = Join-Path $base $file
  $tmp = Join-Path $base ($file + ".tmp.jpg")
  $img = [System.Drawing.Image]::FromFile($src)
  try {
    $scale = [Math]::Min(1.0, [Math]::Min($maxDim / $img.Width, $maxDim / $img.Height))
    $w = [int][Math]::Round($img.Width * $scale)
    $h = [int][Math]::Round($img.Height * $scale)
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    try {
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $w, $h)))
      Save-Jpeg $bmp $tmp 82
    } finally { $g.Dispose(); $bmp.Dispose() }
  } finally { $img.Dispose() }
  Move-Item -Force $tmp $src
  $f = Get-Item $src
  Write-Output ("resized  {0}  ->  {1} x {2}  ({3} bytes)" -f $file, $w, $h, $f.Length)
}

function Make-SquareIcon([string]$srcFile, [string]$outFile, [int]$size) {
  $src = Join-Path $base $srcFile
  $out = Join-Path $base $outFile
  $img = [System.Drawing.Image]::FromFile($src)
  try {
    $side = [Math]::Min($img.Width, $img.Height)
    $x = [int][Math]::Max(0, ($img.Width - $side) / 2)
    $y = [int][Math]::Max(0, ($img.Height - $side) * 0.15)
    if ($y + $side -gt $img.Height) { $y = $img.Height - $side }
    $srcRect = New-Object System.Drawing.Rectangle($x, $y, $side, $side)
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    try {
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $size, $size)), $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
      $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
    } finally { $g.Dispose(); $bmp.Dispose() }
  } finally { $img.Dispose() }
  $f = Get-Item $out
  Write-Output ("icon      {0}  ->  {1} bytes" -f $outFile, $f.Length)
}

Resize-Photo "hero.jpg" 1600
Resize-Photo "fall-main.jpg" 1400
Resize-Photo "lake-avandaro.jpg" 1400
Resize-Photo "viewpoint.jpg" 1400

Make-SquareIcon "hero.jpg" "icon-512.png" 512
Make-SquareIcon "hero.jpg" "icon-192.png" 192
Make-SquareIcon "hero.jpg" "apple-touch-icon.png" 180

Write-Output "done"
