#!/usr/bin/env bash
#
# Deploy a Firefox extension zip to addons.mozilla.org (AMO) via the Submission API v5.
#
# Required environment variables:
#   AMO_API_KEY        – JWT issuer (API key from AMO Developer Hub)
#   AMO_API_SECRET     – JWT secret (API secret from AMO Developer Hub)
#   FIREFOX_EXTENSION_ID – Add-on ID / slug on AMO
#
# Usage:
#   ./scripts/deploy-to-firefox-addons.sh <path-to-zip>
#
# Can be run locally for testing:
#   export AMO_API_KEY=user:12345:678
#   export AMO_API_SECRET=your-api-secret
#   export FIREFOX_EXTENSION_ID=double-subtitles@viktorlavrov
#   ./scripts/deploy-to-firefox-addons.sh extension-firefox.zip

set -euo pipefail

AMO_API_BASE="https://addons.mozilla.org/api/v5"
POLL_INTERVAL=5
MAX_POLLS=60

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
[ -z "${AMO_API_KEY:-}" ]          && missing+=("AMO_API_KEY")
[ -z "${AMO_API_SECRET:-}" ]       && missing+=("AMO_API_SECRET")
[ -z "${FIREFOX_EXTENSION_ID:-}" ] && missing+=("FIREFOX_EXTENSION_ID")

if [ ${#missing[@]} -ne 0 ]; then
  echo "Error: Missing required environment variables: ${missing[*]}"
  exit 1
fi

# ── JWT generation ──────────────────────────────────────────────────────
# AMO uses HS256 JWTs for API authentication.
# The JWT issuer is the API key; the secret signs the token.

base64url_encode() {
  base64 | tr -d '\n' | tr '+/' '-_' | tr -d '='
}

generate_jwt() {
  local header payload signature
  local now jti

  now=$(date +%s)
  jti=$(cat /proc/sys/kernel/random/uuid 2>/dev/null || uuidgen 2>/dev/null || python3 -c "import uuid; print(uuid.uuid4())")

  header=$(printf '{"alg":"HS256","typ":"JWT"}' | base64url_encode)

  payload=$(printf '{"iss":"%s","jti":"%s","iat":%d,"exp":%d}' \
    "$AMO_API_KEY" "$jti" "$now" "$((now + 300))" | base64url_encode)

  signature=$(printf '%s.%s' "$header" "$payload" \
    | openssl dgst -sha256 -hmac "$AMO_API_SECRET" -binary \
    | base64url_encode)

  printf '%s.%s.%s' "$header" "$payload" "$signature"
}

echo "→ Generating JWT..."
JWT=$(generate_jwt)
echo "  JWT generated (expires in 5 minutes)."

# ── Step 1: Upload the zip ──────────────────────────────────────────────

echo "→ Uploading $(basename "$ZIP_FILE") to AMO..."

UPLOAD_RESPONSE=$(curl --silent --show-error --write-out "\n%{http_code}" \
  --request POST "${AMO_API_BASE}/addons/upload/" \
  --header "Authorization: JWT ${JWT}" \
  --form "upload=@${ZIP_FILE}" \
  --form "channel=listed" \
)

HTTP_CODE=$(echo "$UPLOAD_RESPONSE" | tail -1)
UPLOAD_BODY=$(echo "$UPLOAD_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -lt 200 ] || [ "$HTTP_CODE" -ge 300 ]; then
  echo "Error: Upload failed (HTTP $HTTP_CODE)."
  echo "$UPLOAD_BODY"
  exit 1
fi

UPLOAD_UUID=$(echo "$UPLOAD_BODY" | grep -o '"uuid" *: *"[^"]*"' | head -1 | sed 's/.*: *"//;s/"//')

if [ -z "$UPLOAD_UUID" ]; then
  echo "Error: Could not parse upload UUID from response."
  echo "$UPLOAD_BODY"
  exit 1
fi

echo "  Upload UUID: $UPLOAD_UUID"

# ── Step 2: Poll until processing is complete ────────────────────────────

echo "→ Waiting for AMO to process the upload..."

for i in $(seq 1 $MAX_POLLS); do
  sleep "$POLL_INTERVAL"

  # Regenerate JWT in case the previous one is close to expiry
  if [ $((i % 50)) -eq 0 ]; then
    JWT=$(generate_jwt)
  fi

  POLL_RESPONSE=$(curl --silent --show-error \
    --request GET "${AMO_API_BASE}/addons/upload/${UPLOAD_UUID}/" \
    --header "Authorization: JWT ${JWT}" \
  )

  PROCESSED=$(echo "$POLL_RESPONSE" | grep -o '"processed" *: *[a-z]*' | head -1 | sed 's/.*: *//')

  if [ "$PROCESSED" = "true" ]; then
    VALID=$(echo "$POLL_RESPONSE" | grep -o '"valid" *: *[a-z]*' | head -1 | sed 's/.*: *//')

    if [ "$VALID" = "true" ]; then
      echo "  Upload processed and valid."
      break
    else
      echo "Error: Upload was processed but is not valid."
      echo "$POLL_RESPONSE"
      exit 1
    fi
  fi

  echo "  Still processing... (attempt $i/$MAX_POLLS)"
done

if [ "$PROCESSED" != "true" ]; then
  echo "Error: Upload processing timed out after $((MAX_POLLS * POLL_INTERVAL)) seconds."
  exit 1
fi

# ── Step 3: Create a new version ─────────────────────────────────────────

echo "→ Creating new version for add-on: $FIREFOX_EXTENSION_ID..."

# Regenerate JWT for the final request
JWT=$(generate_jwt)

VERSION_RESPONSE=$(curl --silent --show-error --write-out "\n%{http_code}" \
  --request POST "${AMO_API_BASE}/addons/addon/${FIREFOX_EXTENSION_ID}/versions/" \
  --header "Authorization: JWT ${JWT}" \
  --header "Content-Type: application/json" \
  --data "{\"upload\": \"${UPLOAD_UUID}\"}" \
)

HTTP_CODE=$(echo "$VERSION_RESPONSE" | tail -1)
VERSION_BODY=$(echo "$VERSION_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -lt 200 ] || [ "$HTTP_CODE" -ge 300 ]; then
  echo "Error: Version creation failed (HTTP $HTTP_CODE)."
  echo "$VERSION_BODY"
  exit 1
fi

VERSION_NUM=$(echo "$VERSION_BODY" | grep -o '"version" *: *"[^"]*"' | head -1 | sed 's/.*: *"//;s/"//')

echo "  Version created: $VERSION_NUM"
echo "Done. The add-on has been submitted for review."
echo "Check status at: https://addons.mozilla.org/developers/addon/${FIREFOX_EXTENSION_ID}/versions"
