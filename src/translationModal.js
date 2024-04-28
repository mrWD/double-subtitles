function showTranslatedList(data) {
  const translatedList = document.createElement('div');
  translatedList.classList.add('translatedList');

  document.body.appendChild(translatedList);

  data.forEach(({ text, translation }) => {
    const translatedElem = document.createElement('div');

    translatedElem.classList.add('translatedElem');
    translatedElem.textContent = `${text} - ${translation}`;

    translatedList.appendChild(translatedElem);
  });

  document.addEventListener('click', (e) => {
    if (!translatedList.contains(e.target)) {
      translatedList.remove();
    }
  });
}
