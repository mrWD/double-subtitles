#!/usr/bin/env bash
#
# Deploy a Chrome extension zip to the Chrome Web Store.
#
# Required environment variables:
#   CHROME_EXTENSION_ID   – the 32-character extension ID
#   CHROME_CLIENT_ID      – Google OAuth2 client ID
#   CHROME_CLIENT_SECRET  – Google OAuth2 client secret
#   CHROME_REFRESH_TOKEN  – Google OAuth2 refresh token
#   PUBLISH               – "true" to publish after upload (default: "true")
#
# Usage:
#   ./scripts/deploy-to-chrome-web-store.sh <path-to-zip>
#
# Can be run locally for testing:
#   export CHROME_EXTENSION_ID=abc...
#   export CHROME_CLIENT_ID=...
#   export CHROME_CLIENT_SECRET=...
#   export CHROME_REFRESH_TOKEN=...
#   ./scripts/deploy-to-chrome-web-store.sh extension.zip

set -euo pipefail

OAUTH_TOKEN_URL="https://oauth2.googleapis.com/token"
CWS_API_BASE="https://www.googleapis.com/chromewebstore/v1.1"
CWS_UPLOAD_BASE="https://www.googleapis.com/upload/chromewebstore/v1.1"

# ── Argument validation ─────────────────────────────────────────────────

ZIP_FILE="${1:-}"

if [ -z "$ZIP_FILE" ]; then
  echo "Error: No zip file specified."
  echo "Usage: $0 <path-to-zip>"
  exit 1
fi

if [ ! -f "$ZIP_FILE" ]; then
  echo "Error: Zip file not found: $ZIP_FILE"
  exit 1
fi

# ── Environment variable validation ─────────────────────────────────────

missing=()
[ -z "${CHROME_EXTENSION_ID:-}" ]   && missing+=("CHROME_EXTENSION_ID")
[ -z "${CHROME_CLIENT_ID:-}" ]       && missing+=("CHROME_CLIENT_ID")
[ -z "${CHROME_CLIENT_SECRET:-}" ]   && missing+=("CHROME_CLIENT_SECRET")
[ -z "${CHROME_REFRESH_TOKEN:-}" ]   && missing+=("CHROME_REFRESH_TOKEN")

if [ ${#missing[@]} -ne 0 ]; then
  echo "Error: Missing required environment variables: ${missing[*]}"
  exit 1
fi

PUBLISH="${PUBLISH:-true}"

# ── Step 1: Obtain an access token ──────────────────────────────────────

echo "→ Requesting access token..."

TOKEN_RESPONSE=$(curl --silent --fail-with-body \
  --request POST "$OAUTH_TOKEN_URL" \
  --header "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "client_id=${CHROME_CLIENT_ID}" \
  --data-urlencode "client_secret=${CHROME_CLIENT_SECRET}" \
  --data-urlencode "refresh_token=${CHROME_REFRESH_TOKEN}" \
  --data-urlencode "grant_type=refresh_token" \
) || {
  echo "Error: Failed to obtain access token."
  echo "$TOKEN_RESPONSE"
  exit 1
}

ACCESS_TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"access_token" *: *"[^"]*"' | head -1 | sed 's/.*: *"//;s/"//')

if [ -z "$ACCESS_TOKEN" ]; then
  echo "Error: Could not parse access token from response."
  echo "$TOKEN_RESPONSE"
  exit 1
fi

echo "  Access token obtained."

# ── Step 2: Upload the zip to Chrome Web Store ──────────────────────────

echo "→ Uploading $ZIP_FILE to Chrome Web Store (extension: $CHROME_EXTENSION_ID)..."

UPLOAD_RESPONSE=$(curl --silent --fail-with-body \
  --request PUT \
  "${CWS_UPLOAD_BASE}/items/${CHROME_EXTENSION_ID}" \
  --header "Authorization: Bearer ${ACCESS_TOKEN}" \
  --header "x-goog-api-version: 2" \
  --header "Content-Type: application/zip" \
  --data-binary "@${ZIP_FILE}" \
) || {
  echo "Error: Upload failed."
  echo "$UPLOAD_RESPONSE"
  exit 1
}

UPLOAD_STATUS=$(echo "$UPLOAD_RESPONSE" | grep -o '"uploadState" *: *"[^"]*"' | head -1 | sed 's/.*: *"//;s/"//')

echo "  Upload response status: $UPLOAD_STATUS"

if [ "$UPLOAD_STATUS" != "SUCCESS" ] && [ "$UPLOAD_STATUS" != "IN_PROGRESS" ]; then
  echo "Error: Upload did not succeed."
  echo "$UPLOAD_RESPONSE"
  exit 1
fi

echo "  Upload successful."

# ── Step 3: Publish (if requested) ──────────────────────────────────────

if [ "$PUBLISH" != "true" ]; then
  echo "→ Skipping publish (PUBLISH=$PUBLISH)."
  echo "Done. The extension was uploaded but not published."
  exit 0
fi

echo "→ Publishing extension..."

PUBLISH_RESPONSE=$(curl --silent --fail-with-body \
  --request POST \
  "${CWS_API_BASE}/items/${CHROME_EXTENSION_ID}/publish" \
  --header "Authorization: Bearer ${ACCESS_TOKEN}" \
  --header "x-goog-api-version: 2" \
  --header "Content-Length: 0" \
) || {
  echo "Error: Publish failed."
  echo "$PUBLISH_RESPONSE"
  exit 1
}

PUBLISH_STATUS=$(echo "$PUBLISH_RESPONSE" | grep -o '"status" *: *\[[^]]*\]' | head -1)

echo "  Publish response: $PUBLISH_STATUS"

if echo "$PUBLISH_STATUS" | grep -qi "OK"; then
  echo "Done. Extension published successfully."
elif echo "$PUBLISH_STATUS" | grep -qi "PUBLISHED_WITH_FRICTION_WARNING"; then
  echo "Done. Extension published with friction warning (pending review)."
elif echo "$PUBLISH_STATUS" | grep -qi "ITEM_PENDING_REVIEW"; then
  echo "Done. Extension submitted for review."
else
  echo "Warning: Unexpected publish status."
  echo "$PUBLISH_RESPONSE"
  echo "The extension was uploaded. Check the Chrome Web Store Developer Dashboard."
  exit 0
fi
