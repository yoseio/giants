#!/usr/bin/env bash
set -euo pipefail

FILE="$1"
BASENAME="$(basename "${FILE%.*}")"
OUT_DIR="papers/$BASENAME"
mkdir -p "$OUT_DIR"
marker_single "$FILE" --output_format markdown --output_dir "$OUT_DIR"

# Translate generated Markdown files to Japanese using OpenAI API.
find "$OUT_DIR" -name '*.md' -print0 | while IFS= read -r -d '' md; do
  scripts/translate_markdown.py "$md"
done
