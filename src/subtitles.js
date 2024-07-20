function addLineToSubtitles({ text, translation }) {
  const subtitleWrapper = createSubtitlesWrapper();
  const mainText = createSubtitleElement();
  const translatedText = mainText.cloneNode(true);

  mainText.innerHTML = text;
  translatedText.innerHTML = translation;

  subtitleWrapper.innerHTML = '';

  subtitleWrapper.appendChild(mainText);
  subtitleWrapper.appendChild(translatedText);
  subtitleWrapper.appendChild(createSaveButton({ text, translation }));
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

function createSaveButton({ text, translation }) {
  const saveButton = document.createElement('button');
  function saveToAnkiCards () {
    saveToAnki({ text, translation });
  }

  saveButton.classList.add('saveButton');
  saveButton.textContent = 'A';

  saveButton.addEventListener('click', saveToAnkiCards);

  return saveButton;
}

function saveToAnki({ text, translation }) {
  fetch('http://127.0.0.1:5000/anki-card', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      deckName: 'Movies',
      note: {
        front: text,
        back: translation,
        tags: ['movies'],
      },
    }),
  })
  .then(res => res.json())
  .then(data => {
    // do something with data
  })
  .catch(rejected => {
      console.log(rejected);
  });
}
