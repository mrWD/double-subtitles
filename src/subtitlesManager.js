const SUBTITLES_CLASS = getSubtitleMainClass();
const MAIN_SUBTITLES_CLASS = `.${SUBTITLES_CLASS}:not(.secondSubtitles)`;
const SECOND_SUBTITLES_CLASS = `.${SUBTITLES_CLASS}.secondSubtitles`;

function fillSubtitles({ data, originText, timestamp }) {
  const originalSubtitleLines = getSubtitlesFromDom();
  const previousTranslatedElem = getTranslatedSubtitlesFromDom();

  sessionStorage.setItem('double-subtitles-last', JSON.stringify({ text: originText, translation: data }));
  addLineToSubtitles({ text: originText, translation: data });
  addLineToHistory({
    text: originText,
    translation: data,
    timestamp,
    sourceUrl: window.location.href,
  });

  if (!originalSubtitleLines) {
    return;
  }

  if (previousTranslatedElem) {
    previousTranslatedElem.remove();
  }

  if (
    window.STREAMING_PLATFORM === 'youtube'
    || window.STREAMING_PLATFORM === 'twitch'
    || window.STREAMING_PLATFORM === 'hbo'
    || window.STREAMING_PLATFORM === 'hulu'
  ) {
    return;
  }

  originalSubtitleLines.classList.add('translated');

  originalSubtitleLines.parentElement.classList.add('translated');
}

function getSubtitlesFromDom() {
  if (window.STREAMING_PLATFORM === 'disney') {
    return document.querySelector('disney-web-player')
      ?.querySelector(MAIN_SUBTITLES_CLASS);
  }

  if (window.STREAMING_PLATFORM === 'youtube') {
    return document.querySelector('.ytp-caption-window-container');
  }

  if (window.STREAMING_PLATFORM === 'twitch') {
    return document.querySelector('.player-captions-container');
  }

  if (window.STREAMING_PLATFORM === 'hbo') {
    // TODO: replace with the actual HBO Max captions container selector.
    return document.querySelector('.hbo-captions-container');
  }

  if (window.STREAMING_PLATFORM === 'hulu') {
    // TODO: confirm Hulu captions container selector.
    return document.querySelector('.captions-layer');
  }

  // Amazon and Netflix
  return document.querySelector(MAIN_SUBTITLES_CLASS);
}

function getTranslatedSubtitlesFromDom() {
  if (window.STREAMING_PLATFORM === 'disney') {
    return document.querySelector('disney-web-player')
      ?.querySelector(SECOND_SUBTITLES_CLASS);
  }

  // Amazon and Netflix
  return document.querySelector(SECOND_SUBTITLES_CLASS);
}

function getSubtitleMainClass() {
  // TODO: replace `hbo` and `hulu` placeholder classes with real ones from the actual DOM.
  const mapPlatformToClass = {
    amazon: 'atvwebplayersdk-captions-text',
    disney: 'hive-subtitle-renderer-line',
    netflix: 'player-timedtext-text-container',
    youtube: 'caption-window',
    twitch: 'player-captions-container__caption-line',
    hbo: 'hbo-captions-container__caption-line',
    hulu: 'captions-layer__caption-line',
  };

  return mapPlatformToClass[window.STREAMING_PLATFORM];
}

function normalizeSubtitleText(text) {
  return text
    ?.replace(/\u200b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getYoutubeSubtitleText() {
  const captionWindows = Array.from(document.querySelectorAll(
    '.ytp-caption-window-container .caption-window'
  )).filter((captionWindow) => {
    const styles = window.getComputedStyle(captionWindow);

    return styles.display !== 'none' && styles.visibility !== 'hidden';
  });

  const lines = captionWindows.map((captionWindow) => {
    const segments = Array.from(captionWindow.querySelectorAll('.ytp-caption-segment'));
    const segmentText = segments.map((segment) => segment.textContent ?? '').join(' ');

    return normalizeSubtitleText(segmentText || captionWindow.textContent || '');
  }).filter(Boolean);

  const uniqueLines = lines.filter((line, index) => lines.indexOf(line) === index);

  return uniqueLines.join('\n');
}

function getTwitchSubtitleText() {
  const captionLines = Array.from(document.querySelectorAll(
    '.player-captions-container .player-captions-container__caption-line'
  ));

  const lines = captionLines.map((line) => {
    return normalizeSubtitleText(line.textContent || '');
  }).filter(Boolean);

  const uniqueLines = lines.filter((line, index) => lines.indexOf(line) === index);

  return uniqueLines.join('\n');
}

function getHboSubtitleText() {
  // TODO: refine selectors once the real HBO Max DOM is known.
  const captionLines = Array.from(document.querySelectorAll(
    '.hbo-captions-container .hbo-captions-container__caption-line'
  ));

  const lines = captionLines.map((line) => {
    return normalizeSubtitleText(line.textContent || '');
  }).filter(Boolean);

  const uniqueLines = lines.filter((line, index) => lines.indexOf(line) === index);

  return uniqueLines.join('\n');
}

function getHuluSubtitleText() {
  // TODO: refine selectors once the real Hulu DOM is known.
  // Hulu may render captions to a canvas; in that case DOM scraping won't work
  // and a different strategy (e.g. WebVTT track interception) will be needed.
  const captionLines = Array.from(document.querySelectorAll(
    '.captions-layer .captions-layer__caption-line'
  ));

  const lines = captionLines.map((line) => {
    return normalizeSubtitleText(line.textContent || '');
  }).filter(Boolean);

  const uniqueLines = lines.filter((line, index) => lines.indexOf(line) === index);

  return uniqueLines.join('\n');
}

function monitorSuptitleUpdates() {
  if (window.isStreamingWatchPage && !window.isStreamingWatchPage()) {
    savedSubtitle = null;
    return;
  }

  const subtitleWrapper = getSubtitlesFromDom();
  const currentSubtitleText = window.STREAMING_PLATFORM === 'youtube'
    ? getYoutubeSubtitleText()
    : window.STREAMING_PLATFORM === 'twitch'
      ? getTwitchSubtitleText()
      : window.STREAMING_PLATFORM === 'hbo'
        ? getHboSubtitleText()
        : window.STREAMING_PLATFORM === 'hulu'
          ? getHuluSubtitleText()
          : normalizeSubtitleText(subtitleWrapper?.innerText);

  if (!currentSubtitleText) {
    savedSubtitle = currentSubtitleText;
    if (window.STREAMING_PLATFORM === 'youtube') {
      if (
        window.toggleYoutubeNativeSubtitles
        && window.options
        && window.options.showDoubleSubtitles === false
      ) {
        window.toggleYoutubeNativeSubtitles(true);
      }
    }
    if (window.STREAMING_PLATFORM === 'twitch') {
      if (
        window.toggleTwitchNativeSubtitles
        && window.options
        && window.options.showDoubleSubtitles === false
      ) {
        window.toggleTwitchNativeSubtitles(true);
      }
    }
    if (window.STREAMING_PLATFORM === 'hbo') {
      if (
        window.toggleHboNativeSubtitles
        && window.options
        && window.options.showDoubleSubtitles === false
      ) {
        window.toggleHboNativeSubtitles(true);
      }
    }
    if (window.STREAMING_PLATFORM === 'hulu') {
      if (
        window.toggleHuluNativeSubtitles
        && window.options
        && window.options.showDoubleSubtitles === false
      ) {
        window.toggleHuluNativeSubtitles(true);
      }
    }
    return;
  }

  if (
    subtitleWrapper &&
    options.extensionOn &&
    secondLanguage &&
    originalLanguage &&
    savedSubtitle != currentSubtitleText
  ) {
    savedSubtitle = currentSubtitleText;
    const timestamp = window.getVideoCurrentTime
      ? window.getVideoCurrentTime()
      : null;
    handleMessage(savedSubtitle, timestamp);
  }

  if (!originalLanguage && options.currentForeignLanguage) {
    originalLanguage = decodeLang(options.currentForeignLanguage);
  }
}

// The observer watches the whole body subtree, so on a busy page it can fire
// hundreds of times per second. Leading-edge throttle keeps subtitle updates
// immediate while capping the work done per second.
const SUBTITLE_CHECK_INTERVAL = 100;
let lastSubtitleCheckAt = 0;
let subtitleCheckTimer = null;

function scheduleSubtitleCheck() {
  if (subtitleCheckTimer !== null) {
    return;
  }

  const elapsed = Date.now() - lastSubtitleCheckAt;

  if (elapsed >= SUBTITLE_CHECK_INTERVAL) {
    lastSubtitleCheckAt = Date.now();
    monitorSuptitleUpdates();
    return;
  }

  subtitleCheckTimer = setTimeout(() => {
    subtitleCheckTimer = null;
    lastSubtitleCheckAt = Date.now();
    monitorSuptitleUpdates();
  }, SUBTITLE_CHECK_INTERVAL - elapsed);
}

function startMonitoringForElements(numTries) {
  numTries++;
  const MAX_TRIES_MONITOR_SKIP = 10;
  const monitor = new MutationObserver(scheduleSubtitleCheck);

  if (!isMonitorActive) {
    monitor.observe(document.querySelector('body'), {
      attributes: true,
      childList: true,
      subtree: true,
    });
    isMonitorActive = true;

    return;
  }

  if (numTries > MAX_TRIES_MONITOR_SKIP) {
    return;
  }

  setTimeout(() => {
    startMonitoringForElements(numTries);
  }, 100 * numTries);
}
