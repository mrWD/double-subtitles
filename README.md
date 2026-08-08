# Double Subtitles Browser Extension

## Overview
Double Subtitles is a browser extension that enhances your video-watching experience by displaying dual subtitles. This is especially useful for language learners who want to see subtitles in both their native language and the language they are learning.

## Features
- Display two sets of subtitles simultaneously.
- Customize subtitle styles and positioning.
- Compatible with various video streaming sites.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/mrWD/double-subtitles.git
   ```
2. Open your browser's extensions page.
3. Enable Developer mode.
4. Click "Load unpacked" and select the cloned repository folder.

## Usage
1. Open a video on a supported site.
2. Click on the Double Subtitles extension icon.
3. Configure your subtitle settings through the popup interface.
4. Enjoy watching with dual subtitles!

## Supported Streaming Services
* Netflix
* Amazon Prime Video
* Disney+

## Supported Learning Platforms
* Anki
* Quizlet

## Planned Improvements

### 1. New Platform Support
- **Apple TV**

### 2. Multi-Browser Support
- [ ] **Firefox** - Firefox WebExtensions API
- [ ] **Opera** - Opera browser compatibility
- [ ] **Safari** - Safari App Extensions

### 3. Language Learning Enhancements
- [ ] Show initial forms of verbs and nouns for better language understanding
- [ ] Display word roots and grammatical information

### 4. Advanced Configuration
- [ ] Add comprehensive style configuration options
- [ ] Customizable subtitle appearance and positioning
- [ ] Theme support and user preferences

### 5. Synchronization Features
- [ ] Bind subtitles to video timeline for precise synchronization
- [ ] Automatic subtitle timing adjustment
- [ ] Support for external subtitle files

### 6. Accessibility
- [ ] ARIA labels and keyboard navigation

### 7. Other
- [ ] Screen reader support
- [ ] Add a way to hide the sidebar
- [ ] Add a way to hide the double subtitles
- [ ] Add a way to hide the saved cards
- [ ] Add a way to hide the translation modal
- [ ] Add a way to hide the translation history
- [ ] Add a way to hide the translation settings
- [ ] Add a way to export all the history
- [ ] Split the history by movie name

## Files
* background.js: Handles background tasks.
* content.js: Injects scripts into the video pages.
* manifest.json: Configuration file for the extension.
* popup.html: HTML for the extension's popup interface.
* popup.js: JavaScript for the popup interface.

## Deployment

Pushing to `main` releases to the Chrome Web Store and Firefox Add-ons — but only
when the `version` in `manifest.json` is higher than on the previous commit.

**To ship a release:** bump `version` in `manifest.json` in the pull request, then
merge it. Merges that leave the version untouched (docs, refactors, CI changes)
run the version check and stop — nothing is uploaded. The stores reject a re-upload
of an already published version, so the version bump is what makes a merge a release.

Both store deployments run in parallel and are independent. Uploads are published
automatically, which submits them to store review.

**Required GitHub Secrets:**

| Secret | Store | Description |
|--------|-------|-------------|
| `CHROME_EXTENSION_ID` | Chrome | 32-character extension ID from the Developer Dashboard |
| `CHROME_CLIENT_ID` | Chrome | Google OAuth 2.0 client ID |
| `CHROME_CLIENT_SECRET` | Chrome | Google OAuth 2.0 client secret |
| `CHROME_REFRESH_TOKEN` | Chrome | OAuth refresh token for the Chrome Web Store API |
| `FIREFOX_EXTENSION_ID` | Firefox | Gecko add-on ID (e.g. `addon@author` or `{uuid}`) |
| `AMO_API_KEY` | Firefox | JWT issuer from AMO Developer Hub |
| `AMO_API_SECRET` | Firefox | JWT secret from AMO Developer Hub |

The Chrome job reads its secrets from a GitHub Environment named `chrome-web-store`
and the Firefox job from `firefox-addons`; repository-level secrets work too.

**Manual deployment:** Actions tab → "Deploy Extension" → Run workflow. You can
target `chrome`, `firefox`, or `both`, and choose whether to publish. A manual run
deploys whatever version is in `manifest.json`, without the bump check.

Setup guides:
- Chrome: [docs/chrome-web-store-deploy.md](docs/chrome-web-store-deploy.md)
- Firefox: [docs/firefox-addons-deploy.md](docs/firefox-addons-deploy.md)

## Contributing
1. Fork the repository.
2. Create a new branch (git checkout -b feature-branch).
3. Commit your changes (git commit -am 'Add new feature').
4. Push to the branch (git push origin feature-branch).
5. Create a new Pull Request.
