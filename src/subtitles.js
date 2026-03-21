const THREE_DOTS_SVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" height="40px" width="40px" version="1.1" id="Capa_1" viewBox="0 0 32.055 32.055" xml:space="preserve"><path d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967   C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967   s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967   c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z"/></svg>`;

let _subtitleDragState = null;

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

  if (isDoubleSubtitlesHidden) {
    translatedText.style.display = 'none';
  }

  if (window.STREAMING_PLATFORM === 'youtube') {
    toggleYoutubeNativeSubtitles(isDoubleSubtitlesHidden);
    if (!window.options?.subtitlePosition) {
      syncYoutubeSubtitlesPosition(subtitleWrapper);
    }
  }

  subtitleWrapper.appendChild(createMenuButton({ text, translation }));
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

  subtitleWrapper.addEventListener('mouseover', () => {
    translateList(subtitleWrapper.querySelector('.subtitle'));

    const translatedList = createTranslatedList();

    translatedList.classList.remove('is-hidden');

    const rect = subtitleWrapper.getBoundingClientRect();
    const showBelow = rect.top < 200;

    translatedList.style.right = 'auto';

    if (showBelow) {
      translatedList.style.top = `${rect.bottom}px`;
      translatedList.style.left = `${rect.left}px`;
      translatedList.style.transform = 'none';
    } else {
      translatedList.style.top = `${rect.top}px`;
      translatedList.style.left = `${rect.left}px`;
      translatedList.style.transform = 'translateY(-100%)';
    }
  });

  subtitleWrapper.addEventListener('mouseout', (e) => {
    if (
      e.toElement?.classList.contains('translatedList')
      || e.toElement?.classList.contains('subtitle')
    ) {
      return;
    }

    document.querySelector('.translatedList')
      ?.classList.add('is-hidden');
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

window.showDoubleSubtitles = showDoubleSubtitles;
window.hideDoubleSubtitles = hideDoubleSubtitles;
window.toggleDoubleSubtitles = toggleDoubleSubtitles;
window.toggleYoutubeNativeSubtitles = toggleYoutubeNativeSubtitles;
window.setupVideoPauseListeners = setupVideoPauseListeners;
window.applyPauseOnlyVisibility = applyPauseOnlyVisibility;
window.resetSubtitlePosition = resetSubtitlePosition;
window.updateSubtitleColors = updateSubtitleColors;
