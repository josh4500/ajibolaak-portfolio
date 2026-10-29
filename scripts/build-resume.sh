#!/usr/bin/env bash
# Prints resume/resume.html to public/Ajibola-Akinmosin-Resume.pdf with headless Chrome.
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --virtual-time-budget=10000 \
  --print-to-pdf="public/Ajibola-Akinmosin-Resume.pdf" \
  "file://$PWD/resume/resume.html" 2>/dev/null

echo "Wrote public/Ajibola-Akinmosin-Resume.pdf"
