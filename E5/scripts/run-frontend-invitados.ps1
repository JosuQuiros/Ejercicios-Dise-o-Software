$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location (Join-Path $root "frontend-invitados")
if (-not (Test-Path "node_modules")) { npm install }
npm run dev
