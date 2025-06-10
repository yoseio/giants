#!/usr/bin/env bash
set -euo pipefail

FILE="$1"
DIR="${FILE%.*}"
mkdir -p "$DIR"
marker_single "$FILE" --output_dir "$DIR"
