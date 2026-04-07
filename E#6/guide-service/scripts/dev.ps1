$ErrorActionPreference = "Stop"
$monorepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
Set-Location $monorepoRoot
& .\gradlew.bat ":guide-service:run"
