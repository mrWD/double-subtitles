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

async function initContent() {
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

chrome.runtime.onMessage.addListener((req) => {
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

  const savedHistory = sessionStorage.getItem('double-subtitles-history');
  if (savedHistory) {
    try {
      const items = JSON.parse(savedHistory);
      items.forEach((item) => addLineToHistory(item));
    } catch {}
  }

  const lastSubtitle = sessionStorage.getItem('double-subtitles-last');
  if (lastSubtitle) {
    try {
      const { text, translation } = JSON.parse(lastSubtitle);
      addLineToSubtitles({ text, translation });
    } catch {}
  }
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
