const SELECTORS_STORAGE_KEY = 'selectors';
const CAPTION_STYLE_ID = 'double-subtitles-caption-style';

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

// Prime captions need to be clickable and highlight on hover; the class they
// use comes from the config, so the rule is injected instead of living in CSS.
function applyCaptionStyle() {
  if (window.STREAMING_PLATFORM !== 'amazon') {
    return;
  }

  const captionClass = getSubtitleMainClass();
  let style = document.getElementById(CAPTION_STYLE_ID);

  if (!style) {
    style = document.createElement('style');
    style.id = CAPTION_STYLE_ID;
    (document.head || document.documentElement).appendChild(style);
  }

  style.textContent = `
.${captionClass} {
  pointer-events: all;
  cursor: pointer;
}

.${captionClass}:hover {
  background-color: red !important;
}
`;
}

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'local' || !changes[SELECTORS_STORAGE_KEY]) {
    return;
  }

  remoteSelectors = validateSelectors(changes[SELECTORS_STORAGE_KEY].newValue);
  applyCaptionStyle();
});
