const THREE_DOTS_SVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" height="40px" width="40px" version="1.1" id="Capa_1" viewBox="0 0 32.055 32.055" xml:space="preserve"><path d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967   C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967   s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967   c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z"/></svg>`;

const SPEAKER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="32px" width="32px" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;

const TURTLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" height="32px" width="32px" version="1.1" viewBox="0 0 512 512" xml:space="preserve"><path class="st0" d="M511.325,275.018c-0.416-0.982-0.974-1.799-1.54-2.432c-1.117-1.241-2.199-1.891-3.157-2.382   c-1.808-0.892-3.391-1.274-5.107-1.633c-2.982-0.592-6.348-0.916-10.13-1.183c-5.64-0.4-12.13-0.633-18.419-1.016   c-3.166-0.192-6.29-0.433-9.18-0.734c0.3-1.449,0.474-2.932,0.467-4.432c0.008-3.732-0.975-7.447-2.725-10.896   c-1.757-3.458-4.24-6.698-7.372-9.831c-2.991-2.982-6.69-7.489-10.847-12.979c-7.289-9.613-16.045-22.243-26.233-35.738   c-15.311-20.252-33.847-42.503-56.24-59.93c-11.196-8.714-23.376-16.212-36.63-21.56c-13.246-5.339-27.574-8.505-42.853-8.505   c-23.292-0.008-44.302,7.356-62.796,18.544c-13.896,8.398-26.45,18.935-37.813,30.307c-17.036,17.045-31.44,35.955-43.486,52.45   c-6.023,8.239-11.454,15.878-16.27,22.326c-2.757,3.69-5.314,6.981-7.648,9.763c-0.783-0.741-1.549-1.475-2.283-2.208   c-3.582-3.599-6.489-7.139-8.672-12.03c-2.174-4.89-3.699-11.33-3.706-20.876c-0.009-8.781,1.332-20.143,4.673-34.872   c0.642-2.832,0.95-5.656,0.95-8.43c0-6.448-1.691-12.571-4.573-17.961c-4.323-8.114-11.205-14.653-19.318-19.235   c-8.139-4.574-17.578-7.214-27.316-7.223c-9.863-0.008-20.077,2.79-29.032,9.146c-8.181,5.824-13.979,11.18-17.953,16.495   c-1.974,2.658-3.491,5.315-4.531,8.023C0.542,148.685,0,151.442,0,154.141c-0.008,3.124,0.742,6.106,1.974,8.672   c1.075,2.258,2.491,4.216,4.057,5.906c2.741,2.966,5.94,5.182,9.139,6.998c4.816,2.691,9.722,4.449,13.496,5.599   c0.332,0.1,0.649,0.2,0.974,0.283c1.442,21.226,4.307,38.638,8.081,53.033c6.131,23.392,14.728,38.87,23.317,49.425   c4.282,5.274,8.547,9.305,12.346,12.462c3.799,3.158,7.156,5.474,9.464,7.215c5.465,4.098,10.696,7.047,15.687,8.996   c3.673,1.433,7.223,2.316,10.613,2.683v0.009c4.799,2.874,16.695,9.555,35.147,16.694c-0.183,0.666-0.5,1.491-0.925,2.4   c-1.124,2.432-2.99,5.464-5.123,8.463c-3.232,4.541-7.089,9.08-10.113,12.437c-1.516,1.675-2.808,3.058-3.724,4.024   c-0.467,0.484-0.816,0.85-1.075,1.084l-0.15,0.166c-0.016,0.017-0.091,0.1-0.2,0.208c-0.792,0.758-3.816,3.69-6.956,7.898   c-1.766,2.4-3.599,5.198-5.074,8.389c-1.458,3.199-2.616,6.798-2.64,10.888c-0.017,2.899,0.666,6.056,2.274,8.93   c0.883,1.608,2.007,2.933,3.224,4.041c2.124,1.958,4.54,3.357,7.09,4.482c3.857,1.699,8.097,2.824,12.546,3.582   c4.448,0.758,9.056,1.124,13.504,1.124c5.298-0.016,10.313-0.5,14.778-1.675c2.233-0.616,4.332-1.39,6.365-2.607   c1.016-0.608,2.008-1.342,2.949-2.308c0.925-0.933,1.808-2.133,2.441-3.599c0.366-0.883,1.1-2.466,2.049-4.44   c3.316-6.94,9.297-18.802,14.404-28.857c2.566-5.04,4.907-9.63,6.606-12.954c0.85-1.674,1.55-3.024,2.033-3.965   c0.475-0.924,0.733-1.442,0.733-1.442l0.016-0.033l0.042-0.042c0.033-0.067,0.075-0.142,0.092-0.217   c23.226,4.758,50.517,8.048,81.565,8.048c1.641,0,3.266,0,4.907-0.025h0.025c23.184-0.274,43.978-2.416,62.23-5.606   c2.25,4.39,7.597,14.812,12.804,25.15c2.657,5.256,5.274,10.497,7.414,14.87c1.092,2.174,2.05,4.148,2.824,5.79   c0.774,1.624,1.383,2.956,1.716,3.723c0.624,1.466,1.491,2.666,2.432,3.599c1.666,1.666,3.433,2.699,5.256,3.507   c2.75,1.2,5.69,1.9,8.84,2.383c3.157,0.475,6.514,0.7,9.98,0.7c6.814-0.016,13.937-0.833,20.318-2.64   c3.174-0.917,6.181-2.083,8.93-3.691c1.383-0.808,2.691-1.732,3.907-2.857c1.199-1.108,2.324-2.433,3.215-4.041   c1.625-2.874,2.283-6.031,2.266-8.93c0-4.09-1.158-7.689-2.616-10.888c-2.215-4.774-5.223-8.722-7.681-11.638   c-2.099-2.457-3.799-4.132-4.374-4.648v-0.016c-0.016-0.026-0.033-0.042-0.05-0.059c-0.024-0.016-0.024-0.033-0.042-0.033   c-0.033-0.042-0.05-0.058-0.091-0.1c-0.991-0.991-5.665-5.806-10.422-11.654c-2.641-3.232-5.274-6.772-7.306-10.039   c-0.7-1.107-1.308-2.199-1.832-3.215c20.868-7.689,33.806-15.295,38.438-18.227c0.883-0.05,1.848-0.125,2.907-0.225   c7.248-0.725,18.752-2.816,30.956-7.847c6.098-2.516,12.354-5.774,18.269-10.022c5.914-4.249,11.488-9.497,16.103-15.953   l0.166-0.242l0.158-0.258c0.341-0.575,0.666-1.241,0.916-2.024c0.241-0.776,0.408-1.683,0.408-2.641   C512,277.21,511.759,276.027,511.325,275.018z" /></svg>`;

let _subtitleDragState = null;
let _translatedListHideTimeout = null;

function addLineToSubtitles({ text, translation }) {
  const subtitleWrapper = createSubtitlesWrapper();
  const mainText = createSubtitleElement({ text, translation });
  const translatedText = createSubtitleElement({ text, translation });
  const isDoubleSubtitlesHidden = window.options && window.options.showDoubleSubtitles === false;

  mainText.innerHTML = text;
  translatedText.innerHTML = translation;
  subtitleWrapper.innerHTML = '';

  subtitleWrapper.appendChild(mainText);
  subtitleWrapper.appendChild(translatedText);

  applySubtitleColors(subtitleWrapper);
  applySubtitleFontSize(subtitleWrapper);

  if (isDoubleSubtitlesHidden) {
    translatedText.style.display = 'none';
  }

  if (window.STREAMING_PLATFORM === 'youtube') {
    toggleYoutubeNativeSubtitles(isDoubleSubtitlesHidden);
    if (!window.options?.subtitlePosition) {
      syncYoutubeSubtitlesPosition(subtitleWrapper);
    }
  }

  if (window.STREAMING_PLATFORM === 'twitch') {
    toggleTwitchNativeSubtitles(isDoubleSubtitlesHidden);
  }

  const buttonGroup = document.createElement('div');
  buttonGroup.classList.add('subtitle-button-group');
  buttonGroup.appendChild(createMenuButton({ text, translation }));
  buttonGroup.appendChild(createSpeakerButton(text));
  buttonGroup.appendChild(createSlowSpeakerButton(text));
  subtitleWrapper.appendChild(buttonGroup);
  subtitleWrapper.appendChild(createDragHandle(subtitleWrapper));

  applyPauseOnlyVisibility();
}

function createSubtitlesWrapper() {
  const existedSubtitles = document.querySelector('.visibleSubtitles');

  if (existedSubtitles) {
    return existedSubtitles;
  }

  const subtitleWrapper = document.createElement('div');

  subtitleWrapper.classList.add('visibleSubtitles');

  subtitleWrapper.addEventListener('mouseenter', () => {
    clearTimeout(_translatedListHideTimeout);

    translateList(subtitleWrapper.querySelector('.subtitle'));

    const translatedList = createTranslatedList();

    translatedList.classList.remove('is-hidden');

    const rect = subtitleWrapper.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const showBelow = rect.top < 200;

    translatedList.style.right = 'auto';
    translatedList.style.left = `${centerX}px`;

    if (showBelow) {
      translatedList.style.top = `${rect.bottom}px`;
      translatedList.style.transform = 'translateX(-50%)';
    } else {
      translatedList.style.top = `${rect.top}px`;
      translatedList.style.transform = 'translate(-50%, -100%)';
    }
  });

  subtitleWrapper.addEventListener('mouseleave', () => {
    _translatedListHideTimeout = setTimeout(() => {
      document.querySelector('.translatedList')
        ?.classList.add('is-hidden');
    }, 150);
  });

  subtitleWrapper.style.display = 'flex';

  if (window.STREAMING_PLATFORM === 'youtube') {
    subtitleWrapper.classList.add('youtube-subtitles');
    document.body.appendChild(subtitleWrapper);
  } else {
    document.body.appendChild(subtitleWrapper);
  }

  setupSubtitleDrag(subtitleWrapper);
  applySavedSubtitlePosition(subtitleWrapper);

  return subtitleWrapper;
}

function createSubtitleElement({ text, translation }) {
  const subtitle = document.createElement('p');

  subtitle.classList.add('subtitle');
  subtitle.dataset.text = text;
  subtitle.dataset.translation = translation;

  subtitle.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();

    const text = e.currentTarget.dataset.text ?? e.currentTarget.innerText;
    const translation = e.currentTarget.dataset.translation
      ?? e.currentTarget.nextElementSibling?.innerText
      ?? '';
    const timestamp = window.getVideoCurrentTime ? window.getVideoCurrentTime() : null;
    const sourceUrl = window.location.href;

    openMenu({ text, translation, timestamp, sourceUrl });
  });

  return subtitle;
}

function syncYoutubeSubtitlesPosition(subtitleWrapper) {
  if (window.STREAMING_PLATFORM !== 'youtube') {
    return;
  }

  const player = document.querySelector('#movie_player');

  const captionWindows = Array.from(
    document.querySelectorAll('.ytp-caption-window-container .caption-window')
  ).filter((captionWindow) => {
    const styles = window.getComputedStyle(captionWindow);

    return styles.display !== 'none'
      && styles.visibility !== 'hidden'
      && captionWindow.textContent?.trim();
  });

  if (captionWindows.length === 0) {
    subtitleWrapper.style.removeProperty('top');
    subtitleWrapper.style.removeProperty('left');
    subtitleWrapper.style.removeProperty('width');
    subtitleWrapper.style.removeProperty('bottom');
    return;
  }

  const rects = captionWindows.map((windowElem) => windowElem.getBoundingClientRect());
  const captionBottom = Math.max(...rects.map((rect) => rect.bottom));
  const left = Math.min(...rects.map((rect) => rect.left));
  const right = Math.max(...rects.map((rect) => rect.right));

  const playerRect = player?.getBoundingClientRect();
  const maxBottom = playerRect
    ? Math.min(captionBottom, playerRect.bottom)
    : captionBottom;

  subtitleWrapper.style.top = 'auto';
  subtitleWrapper.style.bottom = `${window.innerHeight - maxBottom}px`;
  subtitleWrapper.style.left = `${left + ((right - left) / 2)}px`;
  subtitleWrapper.style.width = `${right - left}px`;
}

function toggleYoutubeNativeSubtitles(showNative) {
  const captionContainer = document.querySelector('.ytp-caption-window-container');

  if (!captionContainer) {
    return;
  }

  captionContainer.classList.toggle('double-subtitles-hide-native', !showNative);
}

function toggleTwitchNativeSubtitles(showNative) {
  const captionContainer = document.querySelector('.player-captions-container');

  if (!captionContainer) {
    return;
  }

  captionContainer.classList.toggle('double-subtitles-hide-native', !showNative);
}

function createMenuButton({ text, translation }) {
  const menuButton = document.createElement('button');

  menuButton.classList.add('menuButton');
  menuButton.innerHTML = THREE_DOTS_SVG;

  menuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();

    const timestamp = window.getVideoCurrentTime ? window.getVideoCurrentTime() : null;
    const sourceUrl = window.location.href;
    openMenu({ text, translation, timestamp, sourceUrl });
  });

  return menuButton;
}

function speakText(text, { slow = false } = {}) {
  const plainText = text.replace(/<[^>]*>/g, '').trim();
  if (!plainText) return;

  const lang = window.options?.currentForeignLanguage || 'en';

  chrome.runtime.sendMessage({
    message: 'speakText',
    payload: { text: plainText, lang, rate: slow ? 0.5 : 1.0 },
  });
}

function createSpeakerButton(text, { inline = false } = {}) {
  const speakerButton = document.createElement('button');

  speakerButton.classList.add('speakerButton');
  if (inline) {
    speakerButton.classList.add('speakerButton--inline');
  }
  speakerButton.innerHTML = SPEAKER_SVG;

  speakerButton.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    speakText(text);
  });

  return speakerButton;
}

function createSlowSpeakerButton(text, { inline = false } = {}) {
  const slowButton = document.createElement('button');

  slowButton.classList.add('speakerButton', 'slowSpeakerButton');
  if (inline) {
    slowButton.classList.add('speakerButton--inline');
  }
  slowButton.innerHTML = TURTLE_SVG;

  slowButton.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    speakText(text, { slow: true });
  });

  return slowButton;
}

function updateExistingSubtitlesVisibility(show) {
  const visibleSubtitles = document.querySelector('.visibleSubtitles');
  if (visibleSubtitles) {
    const translatedSubtitles = window.STREAMING_PLATFORM === 'youtube'
      ? visibleSubtitles.querySelectorAll('.subtitle')
      : visibleSubtitles.querySelectorAll('.subtitle:nth-child(2)');
    translatedSubtitles.forEach(subtitle => {
      subtitle.style.display = show ? 'block' : 'none';
    });
  }
}

function showDoubleSubtitles() {
  const visibleSubtitles = document.querySelector('.visibleSubtitles');
  if (visibleSubtitles) {
    visibleSubtitles.classList.remove('hidden');
    visibleSubtitles.style.display = 'flex';

    updateExistingSubtitlesVisibility(true);
  }
}

function hideDoubleSubtitles() {
  const visibleSubtitles = document.querySelector('.visibleSubtitles');
  if (visibleSubtitles) {
    updateExistingSubtitlesVisibility(false);
  }

  if (window.STREAMING_PLATFORM === 'youtube') {
    toggleYoutubeNativeSubtitles(true);
  }

  if (window.STREAMING_PLATFORM === 'twitch') {
    toggleTwitchNativeSubtitles(true);
  }
}

function toggleDoubleSubtitles(show) {
  if (show) {
    showDoubleSubtitles();
  } else {
    hideDoubleSubtitles();
  }
}

// --- Draggable subtitle position ---

function setupSubtitleDrag(wrapper) {
  wrapper.classList.add('draggable-subtitles');
}

function createDragHandle(wrapper) {
  const dragHandle = document.createElement('div');
  dragHandle.classList.add('subtitle-drag-handle');
  dragHandle.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    e.preventDefault();
    startSubtitleDrag(e, wrapper);
  });
  return dragHandle;
}

function startSubtitleDrag(e, wrapper) {
  e.preventDefault();
  const rect = wrapper.getBoundingClientRect();
  _subtitleDragState = {
    startX: e.clientX,
    startY: e.clientY,
    startLeft: rect.left,
    startTop: rect.top,
    wrapper,
    moved: false,
  };

  document.addEventListener('mousemove', onSubtitleDragMove);
  document.addEventListener('mouseup', onSubtitleDragEnd);
}

function onSubtitleDragMove(e) {
  if (!_subtitleDragState) return;

  const dx = e.clientX - _subtitleDragState.startX;
  const dy = e.clientY - _subtitleDragState.startY;

  if (!_subtitleDragState.moved && Math.abs(dx) < 3 && Math.abs(dy) < 3) {
    return;
  }
  _subtitleDragState.moved = true;

  const newLeft = _subtitleDragState.startLeft + dx;
  const newTop = _subtitleDragState.startTop + dy;

  const wrapper = _subtitleDragState.wrapper;
  wrapper.style.left = `${newLeft}px`;
  wrapper.style.top = `${newTop}px`;
  wrapper.style.bottom = 'auto';
  wrapper.style.transform = 'none';
}

function onSubtitleDragEnd() {
  if (_subtitleDragState && _subtitleDragState.moved) {
    const wrapper = _subtitleDragState.wrapper;
    const position = {
      left: wrapper.style.left,
      top: wrapper.style.top,
    };

    if (window.options) {
      window.options.subtitlePosition = position;
    }

    chrome.storage.sync.get('options', (item) => {
      if (item?.options) {
        item.options.subtitlePosition = position;
        chrome.storage.sync.set({ options: item.options });
      }
    });
  }

  _subtitleDragState = null;
  document.removeEventListener('mousemove', onSubtitleDragMove);
  document.removeEventListener('mouseup', onSubtitleDragEnd);
}

function applySavedSubtitlePosition(wrapper) {
  const position = window.options?.subtitlePosition;
  if (position && position.left && position.top) {
    wrapper.style.left = position.left;
    wrapper.style.top = position.top;
    wrapper.style.bottom = 'auto';
    wrapper.style.transform = 'none';
  }
}

function resetSubtitlePosition() {
  const wrapper = document.querySelector('.visibleSubtitles');
  if (wrapper) {
    wrapper.style.removeProperty('top');
    wrapper.style.removeProperty('left');
    wrapper.style.removeProperty('width');
    wrapper.style.removeProperty('bottom');
    wrapper.style.removeProperty('transform');
  }

  if (window.options) {
    window.options.subtitlePosition = null;
  }
}

// --- Pause-only visibility ---

let _videoPauseListener = null;
let _videoPlayListener = null;
let _trackedVideo = null;
let _lastPausedState = null;

function setupVideoPauseListeners() {
  cleanupVideoPauseListeners();

  const video = typeof getPrimaryVideoElement === 'function' ? getPrimaryVideoElement() : document.querySelector('video');
  if (!video) return;

  _trackedVideo = video;
  window._trackedVideo = video;
  _lastPausedState = video.paused;

  _videoPauseListener = () => {
    _lastPausedState = true;
    applyPauseOnlyVisibility();
  };
  _videoPlayListener = () => {
    _lastPausedState = false;
    applyPauseOnlyVisibility();
  };

  video.addEventListener('pause', _videoPauseListener);
  video.addEventListener('play', _videoPlayListener);
  video.addEventListener('playing', _videoPlayListener);

  applyPauseOnlyVisibility();
}

function cleanupVideoPauseListeners() {
  if (_trackedVideo) {
    if (_videoPauseListener) _trackedVideo.removeEventListener('pause', _videoPauseListener);
    if (_videoPlayListener) {
      _trackedVideo.removeEventListener('play', _videoPlayListener);
      _trackedVideo.removeEventListener('playing', _videoPlayListener);
    }
    _trackedVideo = null;
    window._trackedVideo = null;
    _lastPausedState = null;
  }
}

function isVideoPaused() {
  const video = typeof getPrimaryVideoElement === 'function' ? getPrimaryVideoElement() : document.querySelector('video');
  return video ? video.paused : false;
}

function applyPauseOnlyVisibility() {
  const wrapper = document.querySelector('.visibleSubtitles');
  if (!wrapper) return;

  const opts = window.options || {};
  const paused = isVideoPaused();

  const captionsOnPause = opts.captionsOnPauseOnly || false;
  const translationOnPause = opts.translationOnPauseOnly || false;

  const subtitles = wrapper.querySelectorAll('.subtitle');
  const originalSubtitle = subtitles[0];
  const translationSubtitle = subtitles[1];

  if (originalSubtitle) {
    if (captionsOnPause) {
      originalSubtitle.style.visibility = paused ? 'visible' : 'hidden';
    } else {
      originalSubtitle.style.visibility = 'visible';
    }
  }

  if (translationSubtitle) {
    if (opts.showDoubleSubtitles === false) {
      translationSubtitle.style.display = 'none';
    } else if (translationOnPause) {
      translationSubtitle.style.display = 'block';
      translationSubtitle.style.visibility = paused ? 'visible' : 'hidden';
    } else {
      translationSubtitle.style.display = 'block';
      translationSubtitle.style.visibility = 'visible';
    }
  }
}

function applySubtitleColors(wrapper) {
  if (!wrapper) return;

  const opts = window.options || {};
  const captionColor = opts.captionColor || '#ffffff';
  const translationColor = opts.translationColor || '#aaaaaa';

  const subtitles = wrapper.querySelectorAll('.subtitle');
  if (subtitles[0]) {
    subtitles[0].style.color = captionColor;
  }
  if (subtitles[1]) {
    subtitles[1].style.color = translationColor;
  }
}

function updateSubtitleColors(captionColor, translationColor) {
  if (window.options) {
    window.options.captionColor = captionColor;
    window.options.translationColor = translationColor;
  }

  const wrapper = document.querySelector('.visibleSubtitles');
  if (wrapper) {
    applySubtitleColors(wrapper);
  }
}

function applySubtitleFontSize(wrapper) {
  if (!wrapper) return;

  const fontSize = window.options?.subtitleFontSize;
  if (!fontSize) return;

  const subtitles = wrapper.querySelectorAll('.subtitle');
  subtitles.forEach((subtitle) => {
    subtitle.style.fontSize = `${fontSize}px`;
  });
}

function updateSubtitleFontSize(fontSize) {
  if (window.options) {
    window.options.subtitleFontSize = fontSize;
  }

  const wrapper = document.querySelector('.visibleSubtitles');
  if (!wrapper) return;

  const subtitles = wrapper.querySelectorAll('.subtitle');
  subtitles.forEach((subtitle) => {
    if (fontSize) {
      subtitle.style.fontSize = `${fontSize}px`;
    } else {
      subtitle.style.removeProperty('font-size');
    }
  });
}

window.showDoubleSubtitles = showDoubleSubtitles;
window.hideDoubleSubtitles = hideDoubleSubtitles;
window.toggleDoubleSubtitles = toggleDoubleSubtitles;
window.toggleYoutubeNativeSubtitles = toggleYoutubeNativeSubtitles;
window.toggleTwitchNativeSubtitles = toggleTwitchNativeSubtitles;
window.setupVideoPauseListeners = setupVideoPauseListeners;
window.applyPauseOnlyVisibility = applyPauseOnlyVisibility;
window.resetSubtitlePosition = resetSubtitlePosition;
window.updateSubtitleColors = updateSubtitleColors;
window.createSpeakerButton = createSpeakerButton;
window.createSlowSpeakerButton = createSlowSpeakerButton;
window.updateSubtitleFontSize = updateSubtitleFontSize;
window.SPEAKER_SVG = SPEAKER_SVG;
