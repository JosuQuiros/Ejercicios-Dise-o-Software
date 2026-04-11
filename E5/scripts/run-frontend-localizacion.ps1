$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location (Join-Path $root "frontend-localizacion")
if (-not (Test-Path "node_modules")) { npm install }
npm run dev
