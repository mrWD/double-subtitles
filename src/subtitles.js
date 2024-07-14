function addLineToSubtitles({ text, translation }) {
  const subtitleWrapper = createSubtitlesWrapper();
  const mainText = createSubtitleElement();
  const translatedText = mainText.cloneNode(true);

  mainText.innerHTML = text;
  translatedText.innerHTML = translation;

  subtitleWrapper.innerHTML = '';

  subtitleWrapper.appendChild(mainText);
  subtitleWrapper.appendChild(translatedText);
}

function createSubtitlesWrapper() {
  const existedSubtitles = document.querySelector('.visibleSubtitles');

  if (existedSubtitles) {
    return existedSubtitles;
  }

  const subtitleWrapper = document.createElement('div');

  subtitleWrapper.classList.add('visibleSubtitles');

  document.body.appendChild(subtitleWrapper);

  return subtitleWrapper;
}

function createSubtitleElement() {
  const subtitle = document.createElement('p');

  subtitle.classList.add('subtitle');

  return subtitle;
}
