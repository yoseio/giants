#!/usr/bin/env bash
set -euo pipefail

FILE="$1"
DIR="${FILE%.*}"
mkdir -p "$DIR"
marker "$DIR"
