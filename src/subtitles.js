const THREE_DOTS_SVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" height="40px" width="40px" version="1.1" id="Capa_1" viewBox="0 0 32.055 32.055" xml:space="preserve"><path d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967   C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967   s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967   c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z"/></svg>`;

function addLineToSubtitles({ text, translation }) {
  const subtitleWrapper = createSubtitlesWrapper();
  const mainText = createSubtitleElement({ text, translation });

  const translatedText = mainText.cloneNode(true);
  const isDoubleSubtitlesHidden = window.options && window.options.showDoubleSubtitles === false;

  mainText.innerHTML = text;
  translatedText.innerHTML = translation;
  subtitleWrapper.innerHTML = '';

  subtitleWrapper.appendChild(mainText);
  subtitleWrapper.appendChild(translatedText);

  if (isDoubleSubtitlesHidden) {
    translatedText.style.display = 'none';
  }

  if (window.STREAMING_PLATFORM === 'youtube') {
    toggleYoutubeNativeSubtitles(isDoubleSubtitlesHidden);
    syncYoutubeSubtitlesPosition(subtitleWrapper);
  }

  subtitleWrapper.appendChild(createMenuButton({ text, translation }));
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

    translatedList.style.right = 'auto';

    translatedList.style.top = `${subtitleWrapper.offsetTop}px`;
    translatedList.style.left = `${subtitleWrapper.offsetLeft}px`;

    translatedList.style.transform = 'translate(-50%, -100%)';
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

  return subtitleWrapper;
}

function createSubtitleElement({ text, translation }) {
  const subtitle = document.createElement('p');

  subtitle.classList.add('subtitle');
  subtitle.dataset.text = text;
  subtitle.dataset.translation = translation;

  subtitle.addEventListener('click', (e) => {
    const text = e.target.dataset.text ?? e.target.innerText;
    const translation = e.target.dataset.translation
      ?? e.target.nextElementSibling?.innerText
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

  menuButton.addEventListener('click', () => {
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

window.showDoubleSubtitles = showDoubleSubtitles;
window.hideDoubleSubtitles = hideDoubleSubtitles;
window.toggleDoubleSubtitles = toggleDoubleSubtitles;
window.toggleYoutubeNativeSubtitles = toggleYoutubeNativeSubtitles;
