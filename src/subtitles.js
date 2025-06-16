const THREE_DOTS_SVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" height="40px" width="40px" version="1.1" id="Capa_1" viewBox="0 0 32.055 32.055" xml:space="preserve"><path d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967   C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967   s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967   c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z"/></svg>`;

function addLineToSubtitles({ text, translation }) {
  const subtitleWrapper = createSubtitlesWrapper();
  const mainText = createSubtitleElement();

  const translatedText = mainText.cloneNode(true);

  mainText.innerHTML = text;
  translatedText.innerHTML = translation;
  subtitleWrapper.innerHTML = '';

  subtitleWrapper.appendChild(mainText);
  subtitleWrapper.appendChild(translatedText);
  subtitleWrapper.appendChild(createMenuButton({ text, translation }));
}

function createSubtitlesWrapper() {
  const existedSubtitles = document.querySelector('.visibleSubtitles');

  if (existedSubtitles) {
    return existedSubtitles;
  }

  const subtitleWrapper = document.createElement('div');

  subtitleWrapper.classList.add('visibleSubtitles');

  subtitleWrapper.addEventListener('mouseover', (e) => {
    e.stopPropagation();
    translateList(subtitleWrapper.querySelector('.subtitle'));
  });

  subtitleWrapper.addEventListener('mouseout', (e) => {
    if (
      e.toElement.classList.contains('translatedList')
      || e.toElement.classList.contains('subtitle')
    ) {
      return;
    }

    document.querySelector('.translatedList')
      ?.classList.add('is-hidden');
  });

  document.body.appendChild(subtitleWrapper);

  return subtitleWrapper;
}

function createSubtitleElement() {
  const subtitle = document.createElement('p');

  subtitle.classList.add('subtitle');

  subtitle.addEventListener('click', (e) => {
    const text = e.target.innerText;
    const translation = e.target.nextElementSibling.innerText;

    openMenu({ text, translation });
  });

  return subtitle;
}

function createMenuButton({ text, translation }) {
  const menuButton = document.createElement('button');

  menuButton.classList.add('menuButton');
  menuButton.innerHTML = THREE_DOTS_SVG;

  menuButton.addEventListener('click', () => {
    openMenu({ text, translation });
  });


  return menuButton;
}
