#!/usr/bin/env pwsh
# Uso: .\scripts\deploy-ghpages.ps1
# Builda o PWA com as vars corretas pro GitHub Pages e copia pra docs/app/

$root = Split-Path $PSScriptRoot -Parent
$pwa  = Join-Path $root "pwa"
$dst  = Join-Path $root "docs\app"

Push-Location $pwa
$env:VITE_BASE = "/visaopost/app/"
$env:VITE_DEMO = "1"
npm run build
if ($LASTEXITCODE -ne 0) { Pop-Location; exit 1 }
Pop-Location

Copy-Item -Recurse -Force "$pwa\dist\*" "$dst\"
Write-Host "Deploy pronto em docs/app/. Commitar e dar push."
