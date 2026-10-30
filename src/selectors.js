const SELECTORS_STORAGE_KEY = 'selectors';
const CAPTION_STYLE_ID = 'double-subtitles-caption-style';
const HIDE_NATIVE_CAPTIONS_CLASS = 'double-subtitles-hide-native-captions';
const CONFIGURED_PLATFORMS = ['amazon', 'disney', 'netflix'];

let remoteSelectors = null;

async function loadSelectors() {
  try {
    const stored = await chrome.storage.local.get(SELECTORS_STORAGE_KEY);
    remoteSelectors = validateSelectors(stored[SELECTORS_STORAGE_KEY]);
  } catch {
    remoteSelectors = null;
  }

  applyCaptionStyle();
}

function getConfiguredCaptionClass(platform) {
  return remoteSelectors?.platforms?.[platform]?.captionClass || null;
}

// Rules that depend on the configured caption class are injected instead of
// living in the static stylesheet: hiding the native captions once ours are
// shown, and (Prime only) making them clickable with a hover highlight.
function applyCaptionStyle() {
  if (!CONFIGURED_PLATFORMS.includes(window.STREAMING_PLATFORM)) {
    return;
  }

  const captionClass = getSubtitleMainClass();
  let style = document.getElementById(CAPTION_STYLE_ID);

  if (!style) {
    style = document.createElement('style');
    style.id = CAPTION_STYLE_ID;
    (document.head || document.documentElement).appendChild(style);
  }

  const hideNative = `
html.${HIDE_NATIVE_CAPTIONS_CLASS} .${captionClass},
html.${HIDE_NATIVE_CAPTIONS_CLASS} :has(> .${captionClass}) {
  opacity: 0 !important;
}
`;
  const amazonClickable = window.STREAMING_PLATFORM === 'amazon' ? `
.${captionClass} {
  pointer-events: all;
  cursor: pointer;
}

.${captionClass}:hover {
  background-color: red !important;
}
` : '';

  style.textContent = hideNative + amazonClickable;
}

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'local' || !changes[SELECTORS_STORAGE_KEY]) {
    return;
  }

  remoteSelectors = validateSelectors(changes[SELECTORS_STORAGE_KEY].newValue);
  applyCaptionStyle();
});
