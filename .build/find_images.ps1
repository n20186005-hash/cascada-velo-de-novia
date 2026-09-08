param(
  [string[]]$Terms = @(
    "Cascada Velo de Novia Valle de Bravo",
    "Velo de Novia waterfall Mexico",
    "Valle de Bravo lake Avandaro",
    "Valle de Bravo centro parroquia",
    "Cascada El Molino Valle de Bravo"
  )
)
$ErrorActionPreference = "Stop"
$out = New-Object System.Collections.Generic.List[string]
foreach ($term in $Terms) {
  $enc = [uri]::EscapeDataString($term)
  $url = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=$enc&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url%7Csize%7Cextmetadata&iiurlwidth=1800&format=json"
  try {
    $r = Invoke-RestMethod -Uri $url -TimeoutSec 30
    $out.Add("### TERM: $term")
    if ($null -eq $r.query -or $null -eq $r.query.pages) {
      $out.Add("  (no results)")
    } else {
      $pages = $r.query.pages.PSObject.Properties.Value
      foreach ($p in $pages) {
        $ii = $p.imageinfo[0]
        $lic = if ($ii.extmetadata.LicenseShortName) { $ii.extmetadata.LicenseShortName.value } else { "?" }
        $artist = if ($ii.extmetadata.Artist) { ($ii.extmetadata.Artist.value -replace '<[^>]+>', '' -replace '&amp;', '&') } else { "" }
        if ($artist.Length -gt 80) { $artist = $artist.Substring(0, 80) }
        $ext = [IO.Path]::GetExtension($p.title)
        if ($ext -match '\.(jpg|jpeg|png)$') {
          $out.Add("  TITLE=$($p.title) | W=$($ii.width) H=$($ii.height) | LIC=$lic | ARTIST=$artist")
          $out.Add("    THUMB=$($ii.thumburl)")
        }
      }
    }
  } catch {
    $out.Add("  ERROR: $($_.Exception.Message)")
  }
}
$out -join "`n"
