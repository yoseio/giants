#!/usr/bin/env bash
set -euo pipefail

find public/papers -mindepth 2 -maxdepth 2 -type f -name '*.md' ! -name '*.ja.md' -print0 | while IFS= read -r -d '' file; do
  scripts/translate_markdown.py "$file"
done
