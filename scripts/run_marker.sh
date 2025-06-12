#!/usr/bin/env bash
set -euo pipefail

FILE="$1"
BASENAME="$(basename "${FILE%.*}")"
OUT_DIR="public/papers"
mkdir -p "$OUT_DIR"

if [[ -n "${GEMINI_API_KEY:-}" ]]; then
  marker_single "$FILE" --output_format markdown --output_dir "$OUT_DIR" --use_llm --gemini_api_key "$GEMINI_API_KEY"
else
  marker_single "$FILE" --output_format markdown --output_dir "$OUT_DIR"
fi

find "$OUT_DIR/$BASENAME" -name '*.md' -print0 | while IFS= read -r -d '' md; do
  scripts/translate_markdown.py "$md"
done
