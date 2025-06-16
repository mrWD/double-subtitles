function showTranslatedList(data) {
  const translatedList = createTranslatedList();

  translatedList.classList.remove('is-hidden');

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
    e.stopPropagation();
    translatedList.classList.remove('is-hidden');
  });

  translatedList.addEventListener('mouseout', (e) => {
    if (e.toElement.classList.contains('translatedList')) {
      return;
    }

    translatedList.classList.add('is-hidden');
  });

  document.body.appendChild(translatedList);

  return translatedList;
}
