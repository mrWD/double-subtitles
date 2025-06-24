const SUBTITLES_CLASS = getSubtitleMainClass();
const MAIN_SUBTITLES_CLASS = `.${SUBTITLES_CLASS}:not(.secondSubtitles)`;
const SECOND_SUBTITLES_CLASS = `.${SUBTITLES_CLASS}.secondSubtitles`;

function fillSubtitles({ data, originText }) {
  const originalSubtitleLines = getSubtitlesFromDom();
  const previousTranslatedElem = getTranslatedSubtitlesFromDom();

  addLineToSubtitles({ text: originText, translation: data });
  addLineToHistory({ text: originText, translation: data });

  if (!originalSubtitleLines) {
    return;
  }

  if (previousTranslatedElem) {
    previousTranslatedElem.remove();
  }

  originalSubtitleLines.classList.add('translated');

  originalSubtitleLines.parentElement.classList.add('translated');
}

function getSubtitlesFromDom() {
  if (window.STREAMING_PLATFORM === 'disney') {
    return document.querySelector('disney-web-player')
      ?.querySelector(MAIN_SUBTITLES_CLASS);
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
  };

  return mapPlatformToClass[window.STREAMING_PLATFORM];
}

function monitorSuptitleUpdates() {
  const subtitleWrapper = getSubtitlesFromDom();

  if (
    subtitleWrapper &&
    options.extensionOn &&
    secondLanguage &&
    originalLanguage &&
    savedSubtitle != subtitleWrapper?.innerText
  ) {
    savedSubtitle = subtitleWrapper.innerText;
    handleMessage(savedSubtitle);
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
