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

  if (window.STREAMING_PLATFORM === 'youtube') {
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
  const mapPlatformToClass = {
    amazon: 'atvwebplayersdk-captions-text',
    disney: 'hive-subtitle-renderer-line',
    netflix: 'player-timedtext-text-container',
    youtube: 'caption-window',
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
    const segmentText = segments.map((segment) => segment.textContent ?? '').join('');

    return normalizeSubtitleText(segmentText || captionWindow.textContent || '');
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

function startMonitoringForElements(numTries) {
  numTries++;
  const MAX_TRIES_MONITOR_SKIP = 10;
  const monitor = new MutationObserver(monitorSuptitleUpdates);

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
