# Chrome Web Store Deployment Guide

This document describes how the automated Chrome Web Store deployment works and how to set it up from scratch.

---

## Overview

The GitHub Actions workflow (`.github/workflows/deploy-extension.yml`) automatically packages and deploys the extension to the Chrome Web Store on every push to `main`. It can also be triggered manually from the GitHub Actions tab.

The workflow:

1. Checks out the repository.
2. Validates that all required secrets are configured.
3. Verifies that `manifest.json` exists.
4. Zips the extension files (only the files needed for the extension — no dev files).
5. Uploads the zip as a workflow artifact for auditing.
6. Calls the Chrome Web Store API to upload and (optionally) publish the extension.

---

## Prerequisites

- A **Chrome Web Store Developer account** ($5 one-time fee): https://chrome.google.com/webstore/devconsole
- The extension must be **already created** in the Developer Dashboard (you need the extension ID).
- A **Google Cloud project** with the Chrome Web Store API enabled.

---

## Obtaining OAuth Credentials

The Chrome Web Store API uses OAuth 2.0. You need four values:

| Secret                 | Description                          |
|------------------------|--------------------------------------|
| `CHROME_EXTENSION_ID`  | 32-char ID from the Developer Dashboard |
| `CHROME_CLIENT_ID`     | OAuth 2.0 client ID from Google Cloud |
| `CHROME_CLIENT_SECRET` | OAuth 2.0 client secret               |
| `CHROME_REFRESH_TOKEN` | Long-lived refresh token               |

### Step 1: Get the Extension ID

1. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).
2. If the extension is not yet listed, create a draft by uploading a zip manually once.
3. The extension ID is the 32-character string in the URL:
   `https://chrome.google.com/webstore/devconsole/.../items/<EXTENSION_ID>`

### Step 2: Create a Google Cloud Project and Enable the API

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or use an existing one).
3. Navigate to **APIs & Services → Library**.
4. Search for **Chrome Web Store API** and enable it.

### Step 3: Create OAuth 2.0 Credentials

1. In the Google Cloud Console, go to **APIs & Services → Credentials**.
2. Click **Create Credentials → OAuth client ID**.
3. If prompted, configure the OAuth consent screen:
   - User type: **External** (or Internal if using Google Workspace).
   - Fill in the required fields (app name, support email).
   - Add yourself as a test user if the app is not verified.
4. For application type, select **Desktop app** (or "Web application" — Desktop is simpler).
5. Click **Create**.
6. Copy the **Client ID** and **Client Secret**.

### Step 4: Obtain the Refresh Token

1. Construct the authorization URL (replace `YOUR_CLIENT_ID`):

   ```
   https://accounts.google.com/o/oauth2/auth?response_type=code&scope=https://www.googleapis.com/auth/chromewebstore&client_id=YOUR_CLIENT_ID&redirect_uri=urn:ietf:wg:oauth:2.0:oob
   ```

   > **Note:** If `urn:ietf:wg:oauth:2.0:oob` is not supported for your client type, use `http://localhost` as the redirect URI and copy the `code` parameter from the browser's address bar after authorization.

2. Open the URL in a browser. Sign in with the Google account that owns the extension.

3. Grant the requested permissions. You will receive an **authorization code**.

4. Exchange the code for tokens using `curl`:

   ```bash
   curl --request POST "https://oauth2.googleapis.com/token" \
     --header "Content-Type: application/x-www-form-urlencoded" \
     --data-urlencode "client_id=YOUR_CLIENT_ID" \
     --data-urlencode "client_secret=YOUR_CLIENT_SECRET" \
     --data-urlencode "code=YOUR_AUTHORIZATION_CODE" \
     --data-urlencode "grant_type=authorization_code" \
     --data-urlencode "redirect_uri=urn:ietf:wg:oauth:2.0:oob"
   ```

   The response will contain an `access_token` and a `refresh_token`.

5. **Save the `refresh_token`** — this is the value you need for the `CHROME_REFRESH_TOKEN` secret. The refresh token does not expire unless you revoke it or change the client secret.

---

## Configuring GitHub Secrets

1. Go to your GitHub repository → **Settings → Secrets and variables → Actions**.
2. Add the following **Repository secrets** (or add them to an Environment named `chrome-web-store`):

   | Secret name            | Value                                    |
   |------------------------|------------------------------------------|
   | `CHROME_EXTENSION_ID`  | Your 32-character extension ID           |
   | `CHROME_CLIENT_ID`     | OAuth 2.0 client ID                      |
   | `CHROME_CLIENT_SECRET` | OAuth 2.0 client secret                  |
   | `CHROME_REFRESH_TOKEN` | The refresh token from step 4 above      |

3. If you use a GitHub Environment (`chrome-web-store`), you can add protection rules like required reviewers for extra safety.

---

## How Deployment Works

### Automatic Deployment

Every push to the `main` branch triggers the workflow. The extension is uploaded and published automatically.

### Manual Deployment

1. Go to **Actions** tab in your GitHub repository.
2. Select the **Deploy to Chrome Web Store** workflow.
3. Click **Run workflow**.
4. Optionally set **publish** to `false` to upload without publishing (useful for testing).
5. Click **Run workflow**.

### Upload Without Publishing

When triggered manually with `publish: false`, the extension is uploaded as a draft. You can then review it in the Developer Dashboard and publish manually.

---

## Running the Deploy Script Locally

The deployment script can be run outside of CI for debugging:

```bash
# Set credentials
export CHROME_EXTENSION_ID="your-extension-id"
export CHROME_CLIENT_ID="your-client-id"
export CHROME_CLIENT_SECRET="your-client-secret"
export CHROME_REFRESH_TOKEN="your-refresh-token"

# Optional: skip publishing
export PUBLISH="false"

# Create the zip
zip -r extension.zip manifest.json background.js content.js popup.html popup.js assets/ src/ _locales/ -x "*.DS_Store"

# Deploy
./scripts/deploy-to-chrome-web-store.sh extension.zip
```

---

## Rotating Credentials

### Rotating the Client Secret

1. Go to **Google Cloud Console → APIs & Services → Credentials**.
2. Edit the OAuth 2.0 Client ID.
3. Click **Reset Secret** to generate a new client secret.
4. Update the `CHROME_CLIENT_SECRET` GitHub secret.
5. **You must also generate a new refresh token** (see Step 4 above), because the old refresh token is tied to the old client secret.
6. Update `CHROME_REFRESH_TOKEN` in GitHub secrets.

### Rotating the Refresh Token

1. Revoke the existing token (optional): `https://oauth2.googleapis.com/revoke?token=YOUR_REFRESH_TOKEN`
2. Follow Step 4 above to obtain a new refresh token.
3. Update `CHROME_REFRESH_TOKEN` in GitHub secrets.

### If the Refresh Token Stops Working

Refresh tokens can be invalidated if:
- The client secret was rotated.
- The user revoked access in their [Google Account permissions](https://myaccount.google.com/permissions).
- The OAuth consent screen is in "Testing" mode and the token expired (7 days for unverified apps).

**Fix:** Move the app to "In production" status in the OAuth consent screen settings, then generate a new refresh token.

---

## Rollback / Troubleshooting

### The workflow fails at "Validate required secrets"

One or more secrets are missing. Go to GitHub → Settings → Secrets and add the missing values.

### Upload fails with 401 Unauthorized

The refresh token or client credentials are invalid. Regenerate the refresh token (see Rotating Credentials above).

### Upload succeeds but publish fails

This can happen if:
- The extension has policy violations flagged by Chrome Web Store review.
- The manifest version was not incremented (Chrome Web Store rejects duplicate versions).

Check the [Developer Dashboard](https://chrome.google.com/webstore/devconsole) for details.

### Rolling back to a previous version

The Chrome Web Store does not support rollback directly. To revert:

1. Check out the previous commit: `git checkout <commit-sha>`
2. Bump the version in `manifest.json` (it must be higher than the current published version).
3. Push to `main` or run the workflow manually.

### Zip structure is wrong

The workflow validates that `manifest.json` is at the root of the zip. If the upload fails with a "manifest not found" error from Google, check the zip contents:

```bash
unzip -l extension.zip
```

---

## Assumptions

- The extension is a **Manifest V3** Chrome extension.
- There is **no build step** — the source files are the extension files. If a bundler is added in the future, update the workflow to run the build before zipping.
- The extension is **already created** in the Chrome Web Store Developer Dashboard.
- The zip includes: `manifest.json`, `background.js`, `content.js`, `popup.html`, `popup.js`, `assets/`, `src/`, `_locales/`.
- Files like `README.md`, `.github/`, `docs/`, `scripts/`, `.gitignore` are excluded from the zip.
