#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/backend"
if [[ ! -x "$ROOT/.venv/bin/python" ]]; then
  echo "Crea el venv: python3 -m venv .venv && .venv/bin/pip install -r requirements.txt"
  exit 1
fi
exec "$ROOT/.venv/bin/python" manage.py runserver 8000
