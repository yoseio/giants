#!/usr/bin/env bash
set -euo pipefail

for pdf in public/papers/*.pdf; do
  [ -e "$pdf" ] || continue
  scripts/run_marker.sh "$pdf"
done
