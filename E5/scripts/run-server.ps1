$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location (Join-Path $root "backend")
if (-not (Test-Path (Join-Path $root ".venv\Scripts\python.exe"))) {
  Write-Host "Crea el venv e instala dependencias (desde la raiz E5): py -3 -m venv .venv; .\.venv\Scripts\pip install -r requirements.txt" -ForegroundColor Yellow
  exit 1
}
& (Join-Path $root ".venv\Scripts\python.exe") manage.py runserver 8000
