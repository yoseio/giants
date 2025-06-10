#!/usr/bin/env bash
set -euo pipefail

FILE="$1"
BASENAME="$(basename "${FILE%.*}")"
OUT_DIR="papers/$BASENAME"
mkdir -p "$OUT_DIR"
marker_single "$FILE" --output_format markdown --output_dir "$OUT_DIR"
