#!/usr/bin/env pwsh
# Uso: .\infra\devops\deploy-ghpages.ps1
# Builda o painel com as vars corretas pro GitHub Pages e copia pra docs/app/

$root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$pwa  = Join-Path $root "frontend\painel"
$dst  = Join-Path $root "docs\app"

Push-Location $pwa
$env:VITE_BASE = "/visaopost/app/"
$env:VITE_DEMO = "1"
$env:VITE_GALLERY_URL = "/visaopost/dilorenzo/galeria/"
$env:VITE_CATALOG_URL = "/visaopost/dilorenzo/catalogo/"
npm run build
if ($LASTEXITCODE -ne 0) { Pop-Location; exit 1 }
Pop-Location

Remove-Item -Recurse -Force "$dst\assets"
Copy-Item -Recurse -Force "$pwa\dist\*" "$dst\"
Write-Host "Deploy pronto em docs/app/. Commitar e dar push."
