# Firefox Add-ons (AMO) Deployment Guide

This document describes how the automated Firefox Add-ons deployment works and how to set it up.

---

## Overview

The `deploy-firefox` job in `.github/workflows/deploy-extension.yml` does the following:

1. Checks out the repository.
2. Validates that all Firefox-related secrets are configured.
3. Builds a Firefox-compatible extension zip (transforms the Chrome MV3 manifest).
4. Uploads the zip as a workflow artifact.
5. Uploads the extension to AMO and creates a new version via the Submission API v5.

The extension is submitted for review automatically. AMO reviews typically take minutes to a few days.

---

## Chrome → Firefox Manifest Differences

The Chrome manifest uses `background.service_worker`, which Firefox does not support. The build script (`scripts/build-firefox-extension.sh`) automatically transforms:

```json
// Chrome (original)
"background": {
  "service_worker": "background.js"
}

// Firefox (generated)
"background": {
  "scripts": ["background.js"]
}
```

It also injects `browser_specific_settings.gecko` with the extension ID and a minimum Firefox version of 109 (first version with MV3 support).

---

## Prerequisites

- A **Firefox Add-ons Developer account**: https://addons.mozilla.org/developers/
- The add-on must be **already created** on AMO (you need the add-on ID/slug).
- API credentials from AMO.

---

## Obtaining AMO API Credentials

Firefox Add-ons uses JWT-based authentication with an API key and secret.

| Secret               | Description                                         |
|----------------------|-----------------------------------------------------|
| `FIREFOX_EXTENSION_ID` | Your add-on ID (e.g. `{uuid}` or `addon@author`)  |
| `AMO_API_KEY`        | JWT issuer — your API key from AMO                  |
| `AMO_API_SECRET`     | JWT secret — your API secret from AMO               |

### Step 1: Get the Add-on ID

1. Go to the [AMO Developer Hub](https://addons.mozilla.org/developers/).
2. If your add-on is not yet listed, create it by submitting a zip manually once.
3. The add-on ID is either:
   - The UUID shown on the add-on's management page (e.g. `{12345678-1234-1234-1234-123456789abc}`).
   - Or an email-style ID you specify (e.g. `double-subtitles@viktorlavrov`).
4. This same ID is used in the `browser_specific_settings.gecko.id` field of the Firefox manifest.

### Step 2: Generate API Credentials

1. Go to: https://addons.mozilla.org/developers/addon/api/key/
2. Sign in with your AMO developer account.
3. Click **Generate new credentials**.
4. You will receive:
   - **JWT issuer** — this is your `AMO_API_KEY`.
   - **JWT secret** — this is your `AMO_API_SECRET`.
5. Copy both values immediately; the secret is only shown once.

> **Note:** API credentials do not expire, but they can be regenerated at any time from the same page. Regenerating invalidates the previous credentials.

---

## Configuring GitHub Secrets

1. Go to your GitHub repository → **Settings → Secrets and variables → Actions**.
2. Add these **Repository secrets** (or put them in an Environment named `firefox-addons`):

   | Secret name           | Value                                       |
   |-----------------------|---------------------------------------------|
   | `FIREFOX_EXTENSION_ID`| Your add-on ID (same as gecko.id)            |
   | `AMO_API_KEY`         | JWT issuer from AMO Developer Hub            |
   | `AMO_API_SECRET`      | JWT secret from AMO Developer Hub            |

---

## How Deployment Works

### Automatic

Every push to `main` triggers both the Chrome and Firefox deploy jobs in parallel.

### Manual

1. Go to the **Actions** tab.
2. Select **Deploy Extension**.
3. Click **Run workflow**.
4. Choose **target**: `firefox` (or `both`).
5. Click **Run workflow**.

### Firefox-only Manual Deploy

Select `firefox` from the target dropdown. Only the Firefox job will run.

---

## Running Locally

### Build the Firefox zip

```bash
export FIREFOX_EXTENSION_ID="double-subtitles@viktorlavrov"
./scripts/build-firefox-extension.sh extension-firefox.zip
```

This creates `extension-firefox.zip` with the transformed manifest. You can inspect it:

```bash
unzip -p extension-firefox.zip manifest.json | python3 -m json.tool
```

### Deploy to AMO

```bash
export FIREFOX_EXTENSION_ID="double-subtitles@viktorlavrov"
export AMO_API_KEY="user:12345678:900"
export AMO_API_SECRET="your-api-secret-here"

./scripts/deploy-to-firefox-addons.sh extension-firefox.zip
```

---

## Rotating Credentials

1. Go to https://addons.mozilla.org/developers/addon/api/key/
2. Click **Generate new credentials**. This invalidates the old ones immediately.
3. Update `AMO_API_KEY` and `AMO_API_SECRET` in GitHub Secrets.

---

## Rollback / Troubleshooting

### Build fails: "jq is required"

Install `jq`:
- macOS: `brew install jq`
- Ubuntu: `sudo apt-get install jq`
- It is pre-installed on GitHub Actions `ubuntu-latest` runners.

### Upload fails with 401

JWT credentials are invalid. Regenerate them at https://addons.mozilla.org/developers/addon/api/key/ and update GitHub Secrets.

### Upload is "processed" but "not valid"

The zip has validation errors. Common causes:
- Manifest is missing required fields.
- Permissions are not allowed for listed add-ons.
- The version number already exists on AMO.

Check the upload response for details, or upload the zip manually at https://addons.mozilla.org/developers/ to see detailed validation errors.

### Version creation fails

Ensure the `FIREFOX_EXTENSION_ID` matches exactly what AMO expects (the gecko ID, add-on slug, or UUID).

### Version already exists

AMO rejects duplicate versions. Bump the `version` in `manifest.json` before pushing.

### Rolling back

AMO does not support rollback. To revert:
1. Check out the older commit.
2. Bump `version` in `manifest.json` to a higher number.
3. Push to `main`.

---

## Assumptions

- The Chrome Manifest V3 extension is **compatible with Firefox** aside from the `background.service_worker` → `background.scripts` difference.
- The add-on is **already created** on AMO.
- `jq` is available in the build environment (pre-installed on `ubuntu-latest`).
- The extension is a **listed** add-on (the deploy script uses `channel=listed`).
