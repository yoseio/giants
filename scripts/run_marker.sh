#!/usr/bin/env bash
set -euo pipefail

FILE="$1"
BASENAME="$(basename "${FILE%.*}")"
OUT_DIR="papers"
mkdir -p "$OUT_DIR"

marker_single "$FILE" --output_format markdown --output_dir "$OUT_DIR"

find "$OUT_DIR/$BASENAME" -name '*.md' -print0 | while IFS= read -r -d '' md; do
  scripts/translate_markdown.py "$md"
done
