const THREE_DOTS_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" height="40px" width="40px" version="1.1" id="Capa_1" viewBox="0 0 32.055 32.055" xml:space="preserve">
	<path d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967   C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967   s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967   c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z"/>
</svg>
`;

const QUIZLET_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="m25.3943 2.5455a21.1471 21.1471 0 0 0 -17.4149 7.3184 21.35 21.35 0 0 0 7.0043 33.2406 21.11 21.11 0 0 0 18.872-.4063.5875.5875 0 0 1 .3-.0638.5817.5817 0 0 1 .2913.0964 16.376 16.376 0 0 0 9.3119 2.7683.5932.5932 0 0 0 .5934-.5949v-7.2342a.5975.5975 0 0 0 -.1369-.3886.5863.5863 0 0 0 -.3553-.2063 8.395 8.395 0 0 1 -1.9819-.5711.5891.5891 0 0 1 -.3273-.3753.6173.6173 0 0 1 -.0177-.2551.6033.6033 0 0 1 .0892-.2389 21.3658 21.3658 0 0 0 -5.8561-29.5607 21.1237 21.1237 0 0 0 -10.3963-3.5413zm-14.217 21.273a12.9087 12.9087 0 0 1 7.9188-11.9366 12.7967 12.7967 0 0 1 14.0012 2.7921 12.9438 12.9438 0 0 1 -1.949 19.865 12.8043 12.8043 0 0 1 -16.2137-1.6038 12.9421 12.9421 0 0 1 -3.7661-9.1179z" fill="#4355ff" stroke="#4355ff" stroke-linecap="round" stroke-linejoin="round"/></svg>`

const ANKI_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="48pt" viewBox="0 0 48 48" width="48pt"><linearGradient id="a" gradientTransform="matrix(49.077 0 0 49.651 -1.017 -.909)" gradientUnits="userSpaceOnUse" x1="0" x2=".907488" y1=".5" y2=".920078"><stop offset="0" stop-color="#00c4ff"/><stop offset=".83888397938" stop-color="#0072ff"/></linearGradient><path d="m20.509 12.697c-.278 1.259-1.528 2.061-2.79 1.79-1.263-.271-2.062-1.519-1.785-2.784l1.484-6.893c.679-3.156 3.085-3.866 5.369-1.584l8.169 8.161 11.273-.91c3.218-.26 4.655 1.872 3.207 4.757l-4.934 9.829 3.826 9.915c1.162 3.012-.481 5.038-3.668 4.521l-11.318-1.836-8.939 7.36c-2.492 2.053-4.829 1.117-5.216-2.088l-1.3-10.771-9.97-6.346c-2.723-1.734-2.521-4.163.452-5.422l8.184-3.464c1.189-.503 2.562.052 3.066 1.24.503 1.188-.052 2.562-1.241 3.066l-5.369 2.281 9.254 5.884 1.24 10.296 8.505-6.996 11.126 1.801-3.744-9.698 4.761-9.465-10.973.889-7.768-7.756z" fill="url(#a)"/></svg>`

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

  document.body.appendChild(subtitleWrapper);

  return subtitleWrapper;
}

function createSubtitleElement() {
  const subtitle = document.createElement('p');

  subtitle.classList.add('subtitle');

  return subtitle;
}

function createMenuButton({ text, translation }) {
  const menuButton = document.createElement('button');
  const menu = createMenu({ text, translation });

  menuButton.classList.add('menuButton');
  menuButton.innerHTML = THREE_DOTS_SVG;

  menuButton.addEventListener('click', () => {
    menu.classList.toggle('visible');
  });

  menuButton.appendChild(menu);

  return menuButton;
}

function createMenu({ text, translation }) {
  const menu = document.createElement('div');

  menu.classList.add('menu');

  menu.appendChild(createAnkiButton({ text, translation }));
  menu.appendChild(createQuizletButton({ text, translation }));

  return menu;
}

function createAnkiButton({ text, translation }) {
  const saveButton = document.createElement('button');
  function saveToAnkiCards () {
    saveToAnki({ text, translation });
  }

  saveButton.classList.add('saveButton');
  saveButton.innerHTML = ANKI_SVG + '<span>Save to Anki</span>';

  saveButton.addEventListener('click', saveToAnkiCards);

  return saveButton;
}

function createQuizletButton({ text, translation }) {
  const saveButton = document.createElement('button');
  function saveToQuizletCards () {
    saveToQuizlet({ text, translation });
  }

  saveButton.classList.add('saveButton');
  saveButton.innerHTML = QUIZLET_SVG + '<span>Save to Quizlet</span>';

  saveButton.addEventListener('click', saveToQuizletCards);

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

function saveToQuizlet({ text, translation }) {
  fetch('http://127.0.0.1:5000/quizlet-card', {
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
  });
}
