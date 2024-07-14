const SUBTITLES_CLASS = getSubtitleMainClass();
const MAIN_SUBTITLES_CLASS = `.${SUBTITLES_CLASS}:not(.secondSubtitles)`;
const SECOND_SUBTITLES_CLASS = `.${SUBTITLES_CLASS}.secondSubtitles`;

function fillSubtitles({ data, originText }) {
  const originalSubtitleLines = getSubtitlesFromDom();
  const previousTranslatedElem = getTranslatedSubtitlesFromDom();

  addLineToSubtitles({ text: originText, translation: data });

  addLineToHistory(originText + '<br>');
  addLineToHistory(data + '<hr>');

  if (!originalSubtitleLines) {
    return;
  }

  if (previousTranslatedElem) {
    previousTranslatedElem.remove();
  }

  originalSubtitleLines.addEventListener('click', (e) => {
    translateList(e.target);
  });

  originalSubtitleLines.classList.add('translated');

  originalSubtitleLines.parentElement.classList.add('translated');
}

function getSubtitlesFromDom() {
  if (window.STREAMING_PLATFORM === 'disney') {
    return document.querySelector('disney-web-player')?.shadowRoot?.querySelector(MAIN_SUBTITLES_CLASS);
  }

  // Amazon and Netflix
  return document.querySelector(MAIN_SUBTITLES_CLASS);
}

function getTranslatedSubtitlesFromDom() {
  if (window.STREAMING_PLATFORM === 'disney') {
    return document.querySelector('disney-web-player')?.shadowRoot?.querySelector(SECOND_SUBTITLES_CLASS);
  }

  // Amazon and Netflix
  return document.querySelector(SECOND_SUBTITLES_CLASS);
}

function getSubtitleMainClass() {
  const mapPlatformToClass = {
    amazon: 'atvwebplayersdk-captions-text',
    disney: 'dss-subtitle-renderer-cue',
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
    savedSubtitle != subtitleWrapper?.innerText
  ) {
    savedSubtitle = subtitleWrapper.innerText;
    handleMessage(savedSubtitle);
  }

  const subtitlePicker = document.querySelectorAll('.f1dqudmj')[0];

  if (subtitlePicker && subtitlePicker.children.length > 0) {
    const originalLanguageList = Array.from(
      document.querySelectorAll('.f1dqudmj')[0].children
    );
    originalLanguageList.forEach((elem) => {
      if (elem.children[1].classList.contains('f1bhki25')) {
        originalLanguage = elem.innerText;
      }
    });
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
