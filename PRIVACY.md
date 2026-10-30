# Privacy Policy

Double Subtitles is a Chrome extension that shows a translated subtitle line under the original one on Netflix, Prime Video, Disney+, YouTube and Twitch.

## What the extension processes

- **Subtitle text.** The extension reads the subtitle text that the video player is already showing on the page. To translate it, that text (and the words or phrases you click) is sent to Google's public translation endpoint, `translate.googleapis.com`. No account, identifier or other personal data is sent with it.
- **Settings and saved phrases.** Your settings and the phrases you choose to save are stored in `chrome.storage.sync`, so they follow your Chrome profile. The author has no access to them.
- **Session history.** The subtitle history shown in the sidebar is kept in the browser tab's `sessionStorage` and disappears when the tab is closed.

## What the extension does not do

- It does not collect, sell or share personal data.
- It does not use analytics, advertising or tracking.
- It does not send your data to any server run by the author.

## Optional integrations

If you tick the Anki, Quizlet or Google Sheets option when saving a card, the card text is sent to a companion server that you run yourself on `http://127.0.0.1:5000`. Without it, those options do nothing.

## Permissions

- Access to the supported streaming sites, to read subtitles and show the translation.
- `translate.googleapis.com`, to translate text.
- `storage`, to keep settings and saved phrases.
- `tts`, to read phrases aloud.
- `activeTab`, to talk to the page from the settings popup.

## Contact

Questions: lvigtor@gmail.com, or open an issue at https://github.com/mrWD/double-subtitles/issues.

Last updated: 2026-10-30
