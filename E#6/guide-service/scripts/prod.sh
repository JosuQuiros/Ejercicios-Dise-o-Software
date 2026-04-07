#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SERVICE="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
./gradlew :guide-service:shadowJar --no-daemon
JAR="$SERVICE/build/libs/guide-service-0.1.0-all.jar"
cd "$SERVICE"
exec java -jar "$JAR"
