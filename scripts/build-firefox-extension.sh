#!/usr/bin/env bash
#
# Build a Firefox-compatible extension zip from the Chrome source.
#
# Transforms the Chrome Manifest V3 into a Firefox-compatible one:
#   - Replaces background.service_worker with background.scripts
#   - Injects browser_specific_settings.gecko with the extension ID
#
# Required environment variables:
#   FIREFOX_EXTENSION_ID  – Gecko add-on ID (e.g. "{uuid}" or "addon@author")
#
# Usage:
#   FIREFOX_EXTENSION_ID="double-subtitles@viktorlavrov" \
#     ./scripts/build-firefox-extension.sh [output.zip]
#
# Output defaults to extension-firefox.zip in the current directory.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

OUTPUT_ZIP="${1:-extension-firefox.zip}"
# Resolve to absolute path so we can cd later
OUTPUT_ZIP="$(cd "$(dirname "$OUTPUT_ZIP")" 2>/dev/null && pwd)/$(basename "$OUTPUT_ZIP")" || OUTPUT_ZIP="$(pwd)/$(basename "$OUTPUT_ZIP")"

if [ -z "${FIREFOX_EXTENSION_ID:-}" ]; then
  echo "Error: FIREFOX_EXTENSION_ID is not set."
  echo "Set it to your Gecko add-on ID, e.g. double-subtitles@viktorlavrov"
  exit 1
fi

if ! command -v jq &>/dev/null; then
  echo "Error: jq is required but not installed."
  echo "Install it: https://jqlang.github.io/jq/download/"
  exit 1
fi

if [ ! -f "$REPO_ROOT/manifest.json" ]; then
  echo "Error: manifest.json not found at $REPO_ROOT"
  exit 1
fi

BUILD_DIR=$(mktemp -d)
trap 'rm -rf "$BUILD_DIR"' EXIT

echo "→ Building Firefox extension..."

# Copy all extension files
cp -r \
  "$REPO_ROOT/manifest.json" \
  "$REPO_ROOT/background.js" \
  "$REPO_ROOT/content.js" \
  "$REPO_ROOT/popup.html" \
  "$REPO_ROOT/popup.js" \
  "$REPO_ROOT/assets" \
  "$REPO_ROOT/src" \
  "$REPO_ROOT/_locales" \
  "$BUILD_DIR/"

# Transform the manifest for Firefox compatibility
jq --arg gecko_id "$FIREFOX_EXTENSION_ID" '
  # Firefox MV3 uses background.scripts instead of background.service_worker
  .background = { "scripts": [.background.service_worker] }
  # Add gecko-specific settings
  | .browser_specific_settings = {
      "gecko": {
        "id": $gecko_id,
        "strict_min_version": "109.0"
      }
    }
' "$REPO_ROOT/manifest.json" > "$BUILD_DIR/manifest.json"

echo "  Manifest transformed for Firefox."
echo "  Gecko ID: $FIREFOX_EXTENSION_ID"

# Create the zip
rm -f "$OUTPUT_ZIP"
(cd "$BUILD_DIR" && zip -r "$OUTPUT_ZIP" . -x "*.DS_Store")

echo "  Created $(basename "$OUTPUT_ZIP") ($(du -h "$OUTPUT_ZIP" | cut -f1))"

# Verify manifest is at the archive root (avoid piping unzip directly to grep
# because grep -q closes the pipe early, causing SIGPIPE under pipefail)
ZIP_LISTING=$(unzip -l "$OUTPUT_ZIP")
if ! echo "$ZIP_LISTING" | grep -q "manifest\.json"; then
  echo "Error: manifest.json missing from the zip archive."
  exit 1
fi

echo "Done."
