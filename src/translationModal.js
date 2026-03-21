function showTranslatedList(data) {
  const translatedList = createTranslatedList();

  translatedList.classList.remove('is-hidden');

  data.forEach(({ text, translation }) => {
    const translatedElem = document.createElement('div');

    translatedElem.classList.add('translatedElem');

    const textSpan = document.createElement('span');
    textSpan.textContent = `${text} - ${translation}`;
    textSpan.style.flex = '1';
    textSpan.style.pointerEvents = 'none';

    translatedElem.appendChild(textSpan);
    translatedElem.appendChild(window.createSpeakerButton(text, { inline: true }));
    translatedElem.appendChild(window.createSlowSpeakerButton(text, { inline: true }));
    translatedElem.style.display = 'flex';
    translatedElem.style.alignItems = 'center';

    translatedList.appendChild(translatedElem);

    translatedElem.addEventListener('click', (e) => {
      if (e.target.closest('.speakerButton')) return;
      const timestamp = window.getVideoCurrentTime ? window.getVideoCurrentTime() : null;
      const sourceUrl = window.location.href;
      openMenu({ text, translation, timestamp, sourceUrl });
    });
  });

  document.addEventListener('click', (e) => {
    if (!translatedList.contains(e.target)) {
      translatedList.remove();
    }
  });
}

function createTranslatedList() {
  const existedTranslatedList = document.querySelector('.translatedList');

  if (existedTranslatedList) {
    existedTranslatedList.innerHTML = '';
    return existedTranslatedList;
  }

  const translatedList = document.createElement('div');

  translatedList.classList.add('translatedList');

  translatedList.addEventListener('mouseover', (e) => {
    e.stopPropagation();
    translatedList.classList.remove('is-hidden');
  });

  translatedList.addEventListener('mouseout', (e) => {
    if (e.toElement?.classList.contains('translatedList')) {
      return;
    }

    translatedList.classList.add('is-hidden');
  });

  document.body.appendChild(translatedList);

  return translatedList;
}
