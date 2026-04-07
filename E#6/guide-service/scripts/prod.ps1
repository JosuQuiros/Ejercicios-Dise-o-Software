$ErrorActionPreference = "Stop"
$monorepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$serviceDir = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $monorepoRoot
& .\gradlew.bat ":guide-service:shadowJar" --no-daemon
$jar = Join-Path $serviceDir "build\libs\guide-service-0.1.0-all.jar"
if (-not (Test-Path $jar)) { throw "Fat JAR not found: $jar" }
Set-Location $serviceDir
& java -jar $jar
