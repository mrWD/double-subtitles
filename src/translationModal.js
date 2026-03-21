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

  // Clamp to viewport after content is added
  clampTranslatedListToViewport(translatedList);

  document.addEventListener('click', (e) => {
    if (!translatedList.contains(e.target)) {
      translatedList.remove();
    }
  });
}

function clampTranslatedListToViewport(translatedList) {
  requestAnimationFrame(() => {
    const listRect = translatedList.getBoundingClientRect();
    if (listRect.height === 0) return;

    const currentTransform = translatedList.style.transform || '';
    const hasVerticalCenter = currentTransform.includes('translateY(-50%)');

    if (hasVerticalCenter) {
      // Currently centered via translateY(-50%), compute actual visual position
      const visualTop = listRect.top;
      const visualBottom = listRect.bottom;

      if (visualTop < 0 || visualBottom > window.innerHeight) {
        // Remove translateY(-50%) and position with direct pixel values
        const newTransform = currentTransform.replace(/\s*translateY\(-50%\)/, '');
        translatedList.style.transform = newTransform;

        const currentTop = parseFloat(translatedList.style.top) || 0;
        // currentTop was the center point, now we need top edge
        let top = currentTop - listRect.height / 2;

        if (top < 0) {
          top = 0;
        } else if (top + listRect.height > window.innerHeight) {
          top = window.innerHeight - listRect.height;
        }

        translatedList.style.top = `${Math.max(0, top)}px`;
      }
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

  translatedList.addEventListener('mouseenter', () => {
    clearTimeout(_translatedListHideTimeout);
    translatedList.classList.remove('is-hidden');
  });

  translatedList.addEventListener('mouseleave', () => {
    _translatedListHideTimeout = setTimeout(() => {
      translatedList.classList.add('is-hidden');
    }, 150);
  });

  document.body.appendChild(translatedList);

  return translatedList;
}
