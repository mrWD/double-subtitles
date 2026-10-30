# Privacy Policy — Double Subtitles

_Last updated: 2026-10-30_

Double Subtitles is a browser extension that shows subtitles in two languages on
supported streaming sites. This document describes every piece of data the
extension handles and everywhere it goes.

## What leaves your device

**Subtitle text sent for translation.** To produce the second subtitle line, the
extension sends the text of the currently displayed subtitle to Google's
translation endpoint (`https://translate.googleapis.com`). The same happens for
individual words when you hover a subtitle or a history entry to see a word list.

- Sent: the subtitle text, the source language code, the target language code.
- Not sent: any identifier of you, the page URL, the video title, cookies, or
  browsing history. The request carries no account or extension identifier.
- Google receives your IP address as part of any network request and processes
  the text under its own terms.

This is the only case where *your data* is transmitted off your device. There is no
analytics, telemetry, crash reporting, advertising, or third-party server of ours.

**Selector config download.** So the extension can follow changes in the streaming
sites' markup without a new release, it downloads a public file (`selectors.json`)
from this project's GitHub repository (`raw.githubusercontent.com`) at browser
start and once a day. The request contains no data about you or your viewing;
GitHub sees your IP address as for any download.

**Text-to-speech.** The speaker buttons pass the subtitle text to the browser's
`chrome.tts` API. Depending on which voice your browser or operating system
selects, speech synthesis may happen locally or via the browser vendor's remote
voice service. That choice is made by the browser, not by this extension.

## What stays on your device

**Downloaded selector config** (a few class names) is kept in `chrome.storage.local`.

**Settings** (languages, colours, font sizes, sidebar state) are stored with
`chrome.storage.sync`.

**Saved cards** (subtitle text, its translation, an optional timestamp and the
source page URL) are stored with `chrome.storage.sync`. The list is capped at
200 cards.

Data in `chrome.storage.sync` is synchronised by your browser across devices
where you are signed in to the same browser profile. This synchronisation is
performed by the browser, not by this extension, and is subject to your browser
vendor's privacy policy. If you do not want this, sign out of browser sync or
disable extension sync in your browser settings.

**Subtitle history** for the current tab is kept in `sessionStorage` and is
deleted when the tab is closed.

## What the extension can access

The extension runs only on the sites listed in `manifest.json`: the supported
streaming services plus `quizlet.com` and `ankiuser.net` for the flashcard
autofill feature. It has no access to any other site, to your browsing history,
bookmarks, downloads, or the contents of other tabs.

## Sharing

No data is sold, rented, or shared with anyone. The only third party involved is
Google, solely as the translation provider described above.

## Removal

Uninstalling the extension deletes all locally stored settings and cards. To
delete saved cards while keeping the extension, remove them from the popup's
"Saved translations" list.

## Contact

Questions or reports: <https://github.com/mrWD/double-subtitles/issues>
