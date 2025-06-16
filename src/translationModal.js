function showTranslatedList(data) {
  const translatedList = createTranslatedList();
  const visibleSubtitles = document.querySelector('.visibleSubtitles');

  translatedList.classList.remove('is-hidden');

  translatedList.style.top = `${visibleSubtitles.offsetTop}px`;
  translatedList.style.left = `${visibleSubtitles.offsetLeft}px`;

  data.forEach(({ text, translation }) => {
    const translatedElem = document.createElement('div');

    translatedElem.classList.add('translatedElem');
    translatedElem.textContent = `${text} - ${translation}`;

    translatedList.appendChild(translatedElem);

    translatedElem.addEventListener('click', () => {
      openMenu({ text, translation });
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
    translatedList.classList.remove('is-hidden');
  });

  translatedList.addEventListener('mouseout', (e) => {
    translatedList.classList.add('is-hidden');
  });

  document.body.appendChild(translatedList);

  return translatedList;
}
