let isMonitorActive = null;
let originalLanguage = null;
let secondLanguage = null;
let savedSubtitle = null;
let options;
let latestTranslationRequestId = 0;
let latestAppliedTranslationRequestId = 0;
let isWatchPageActive = false;
let lastKnownLocation = window.location.href;
let isRuntimeUnavailable = false;

const MAX_STORED_TEXT_LENGTH = 1000;
const MAX_RESTORED_HISTORY_ITEMS = 200;

async function initContent() {
  await initI18n();
  options = await loadOptionsOrSetDefaults();
  window.options = options;

  secondLanguage = options.secondLanguage;
  originalLanguage = decodeLang(options.currentForeignLanguage);

  startMonitoringForElements(0);
  syncPageUiState();
  startPageContextWatcher();
}

initContent();

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'sync' || !changes.options?.newValue) {
    return;
  }

  options = changes.options.newValue;
  window.options = options;

  secondLanguage = options.secondLanguage;
  originalLanguage = decodeLang(options.currentForeignLanguage);

  syncPageUiState();
});

chrome.runtime.onMessage.addListener((req, sender) => {
  // Only our own service worker and extension pages may drive the in-page UI.
  if (sender?.id !== chrome.runtime.id) {
    return;
  }

  if (req.message === 'translated') {
    if (!isWatchPageActive) {
      return;
    }

    if (
      window.STREAMING_PLATFORM === 'youtube'
      && req.payload.requestId
      && req.payload.requestId < latestAppliedTranslationRequestId
    ) {
      return;
    }

    latestAppliedTranslationRequestId = Math.max(
      latestAppliedTranslationRequestId,
      req.payload.requestId ?? 0
    );
    fillSubtitles(req.payload);
  }

  if (req.message === 'translatedList') {
    if (!isWatchPageActive) {
      return;
    }

    showTranslatedList(req.payload.data);
  }

  if (req.message === 'toggleSidebar') {
    if (!isWatchPageActive) {
      forceHideExtensionUi();
      return;
    }

    if (!document.querySelector('.double-subtitles-sidebar')) {
      createSidebarWithHistory();
    }

    if (window.toggleSidebar) {
      window.toggleSidebar(req.payload.show);
    }
  }

  if (req.message === 'toggleDoubleSubtitles') {
    if (!isWatchPageActive) {
      forceHideExtensionUi();
      return;
    }

    if (window.toggleDoubleSubtitles) {
      window.toggleDoubleSubtitles(req.payload.show);
    }
  }

  if (req.message === 'updatePauseOnlyMode') {
    if (window.options) {
      window.options.captionsOnPauseOnly = req.payload.captionsOnPauseOnly;
      window.options.translationOnPauseOnly = req.payload.translationOnPauseOnly;
    }
    if (window.applyPauseOnlyVisibility) {
      window.applyPauseOnlyVisibility();
    }
  }

  if (req.message === 'resetSubtitlePosition') {
    if (window.resetSubtitlePosition) {
      window.resetSubtitlePosition();
    }
  }

  if (req.message === 'updateSubtitleColors') {
    if (window.updateSubtitleColors) {
      window.updateSubtitleColors(req.payload.captionColor, req.payload.translationColor);
    }
  }

  if (req.message === 'updateSubtitleFontSize') {
    if (window.updateSubtitleFontSize) {
      window.updateSubtitleFontSize(req.payload.fontSize);
    }
  }

  if (req.message === 'updateSidebarFontSize') {
    if (window.updateSidebarFontSize) {
      window.updateSidebarFontSize(req.payload.fontSize);
    }
  }

  if (req.message === 'seekToTimestamp') {
    if (window.seekVideoToTime) {
      window.seekVideoToTime(req.payload.timestamp);
    }
  }
});

function handleMessage(text, timestamp) {
  if (!originalLanguage || !secondLanguage) {
    console.log('no languages');
    return;
  }

  latestTranslationRequestId += 1;

  safeRuntimeSendMessage({
    message: 'toTranslate',
    payload: {
      text,
      lang1: encodeLang(originalLanguage),
      lang2: secondLanguage,
      requestId: latestTranslationRequestId,
      timestamp,
    },
  });
}

function translateList(target) {
  const textList = target.innerText?.match(/\b\p{L}+\b/gu);

  if (!textList) {
    return;
  }

  safeRuntimeSendMessage({
    message: 'toTranslateClicked',
    payload: {
      textList,
      lang1: encodeLang(originalLanguage),
      lang2: secondLanguage,
    },
  });
}

function isWatchPage() {
  if (!window.STREAMING_PLATFORM || !window.isStreamingWatchPage) {
    return false;
  }

  return window.isStreamingWatchPage();
}

function applyExtensionUiState() {
  if (!document.querySelector('.double-subtitles-sidebar')) {
    createSidebarWithHistory();
  }

  if (window.toggleSidebar) {
    window.toggleSidebar(options.showSidebar);
  }

  if (window.toggleDoubleSubtitles) {
    window.toggleDoubleSubtitles(options.showDoubleSubtitles);
  }

  if (window.updateSidebarFontSize) {
    window.updateSidebarFontSize(options.sidebarFontSize || 16);
  }

  if (window.updateSubtitleFontSize && options.subtitleFontSize) {
    window.updateSubtitleFontSize(options.subtitleFontSize);
  }

  if (window.setupVideoPauseListeners) {
    window.setupVideoPauseListeners();
  }

  readStoredHistory().forEach((item) => addLineToHistory(item));

  const lastSubtitle = readStoredLastSubtitle();
  if (lastSubtitle) {
    addLineToSubtitles(lastSubtitle);
  }
}

// sessionStorage is ordinary same-origin storage: the page can read it and write
// anything into it. Everything restored from it is untrusted input, so it gets
// shape-checked, length-capped, and stripped of source URLs we would not open.
function readStoredEntry(key) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function sanitizeStoredText(value) {
  return typeof value === 'string' ? value.slice(0, MAX_STORED_TEXT_LENGTH) : '';
}

function sanitizeHistoryItem(item) {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const text = sanitizeStoredText(item.text);

  if (!text.trim()) {
    return null;
  }

  const timestamp = Number(item.timestamp);

  return {
    text,
    translation: sanitizeStoredText(item.translation),
    timestamp: Number.isFinite(timestamp) && timestamp >= 0 ? timestamp : null,
    sourceUrl: window.isSafeSourceUrl?.(item.sourceUrl) ? item.sourceUrl : null,
  };
}

function readStoredHistory() {
  const items = readStoredEntry('double-subtitles-history');

  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .slice(-MAX_RESTORED_HISTORY_ITEMS)
    .map(sanitizeHistoryItem)
    .filter(Boolean);
}

function readStoredLastSubtitle() {
  const entry = readStoredEntry('double-subtitles-last');

  if (!entry || typeof entry !== 'object') {
    return null;
  }

  const text = sanitizeStoredText(entry.text);

  if (!text.trim()) {
    return null;
  }

  return { text, translation: sanitizeStoredText(entry.translation) };
}

function forceHideExtensionUi() {
  const sidebar = document.querySelector('.double-subtitles-sidebar');
  if (sidebar) {
    if (window.hideSidebar) {
      window.hideSidebar();
    }
    sidebar.remove();
  }

  const visibleSubtitles = document.querySelector('.visibleSubtitles');
  if (visibleSubtitles) {
    visibleSubtitles.remove();
  }

  if (window.toggleYoutubeNativeSubtitles) {
    window.toggleYoutubeNativeSubtitles(true);
  }

  if (window.toggleTwitchNativeSubtitles) {
    window.toggleTwitchNativeSubtitles(true);
  }

  if (window.toggleHboNativeSubtitles) {
    window.toggleHboNativeSubtitles(true);
  }

  if (window.toggleHuluNativeSubtitles) {
    window.toggleHuluNativeSubtitles(true);
  }
}

function syncPageUiState() {
  const shouldBeActive = isWatchPage();

  if (shouldBeActive === isWatchPageActive) {
    if (shouldBeActive && !document.querySelector('.double-subtitles-sidebar')) {
      applyExtensionUiState();
    }
    return;
  }

  isWatchPageActive = shouldBeActive;

  if (isWatchPageActive) {
    applyExtensionUiState();
  } else {
    forceHideExtensionUi();
  }
}

function startPageContextWatcher() {
  setInterval(() => {
    const hasLocationChanged = window.location.href !== lastKnownLocation;
    if (hasLocationChanged) {
      lastKnownLocation = window.location.href;
    }

    // Re-check even without URL change because some platforms (e.g. Amazon)
    // mount the playback <video> later than initial content script execution.
    syncPageUiState();

    // Re-attach video pause listeners if the video element appeared or changed.
    if (isWatchPageActive && window.setupVideoPauseListeners) {
      const currentVideo = typeof getPrimaryVideoElement === 'function'
        ? getPrimaryVideoElement()
        : document.querySelector('video');
      if (currentVideo && currentVideo !== window._trackedVideo) {
        window.setupVideoPauseListeners();
      }
    }
  }, 500);
}

function safeRuntimeSendMessage(message) {
  if (isRuntimeUnavailable || !chrome?.runtime?.id) {
    isRuntimeUnavailable = true;
    return;
  }

  try {
    chrome.runtime.sendMessage(message, () => {
      const runtimeError = chrome.runtime.lastError;

      if (
        runtimeError
        && runtimeError.message
        && runtimeError.message.includes('Extension context invalidated')
      ) {
        isRuntimeUnavailable = true;
      }
    });
  } catch {
    isRuntimeUnavailable = true;
  }
}
