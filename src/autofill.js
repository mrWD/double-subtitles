let inputsAmount = 0;

handleInputListAmountChange();

function handleInputListAmountChange() {
  if (window.LEARNING_PLATFORM === 'quizlet') {
    const inputListWrapper = document.querySelector('.StudiableItems');
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          setTimeout(() => {
            handleLearningPlatformPage();
          }, 1000);
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return;
  }

  if (window.LEARNING_PLATFORM === 'anki') {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          setTimeout(() => {
            handleLearningPlatformPage();
          }, 1000);
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return;
  }
}

function handleLearningPlatformPage() {
  if (window.LEARNING_PLATFORM === 'anki'
    || window.LEARNING_PLATFORM === 'quizlet'
  ) {
    const inputList = document.querySelectorAll('[contenteditable]');

    if (!inputList.length || inputsAmount === inputList.length) {
      return;
    }

    if (window.LEARNING_PLATFORM === 'anki') {
      showTip({ target: inputList[0] });
    }

    inputList.forEach((elem) => {
      elem.removeEventListener('focus', showTip);
      elem.addEventListener('focus', showTip);
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.cardsTip') && !e.target.closest('[contenteditable]')) {
        hideTip();
      }
    });

    inputsAmount = inputList.length;
  }
}

function showTip(e) {
  const input = e.target;
  const { height, top, left } = input.getBoundingClientRect();

  hideTip();

  chrome.storage.sync.get('cards', item => {
    const tip = document.createElement('div');
    const cardList = document.createElement('ul');

    tip.style.top = `${top + height + getTopPositionMultiplier()}px`;
    tip.style.left = `${left}px`;

    tip.classList.add('cardsTip');
    cardList.classList.add('cardList');

    item.cards?.forEach(card => {
      cardList.appendChild(createTipRow(card.text, input));
      cardList.appendChild(createTipRow(card.translation, input));
    });

    tip.appendChild(cardList);
    document.body.appendChild(tip);
  });
}

function createTipRow(text, input) {
  const row = document.createElement('li');
  const textEl = document.createElement('span');
  const addBtn = document.createElement('button');
  const addAndDeleteBtn = document.createElement('button');

  row.classList.add('cardRow');
  addBtn.classList.add('suggestion-btn');
  addAndDeleteBtn.classList.add('suggestion-btn');

  textEl.textContent = text;
  addBtn.textContent = 'Add';
  addAndDeleteBtn.textContent = 'Add and delete';

  row.appendChild(textEl);
  row.appendChild(addBtn);
  row.appendChild(addAndDeleteBtn);

  addBtn.addEventListener('click', () => {
    addValueToInput(input, text);
  });

  addAndDeleteBtn.addEventListener('click', () => {
    addValueToInput(input, text);

    chrome.storage.sync.get('cards', item => {
      const newCards = item.cards.filter(card => card.text !== text);
      chrome.storage.sync.set({ cards: newCards });
    });
  });

  return row;
}

function hideTip() {
  document.querySelectorAll('.cardsTip').forEach(cardsTip => cardsTip.remove());
}

function addValueToInput(input, value) {
  if (window.LEARNING_PLATFORM === 'anki') {
    input.innerHTML = value;
  }

  if (window.LEARNING_PLATFORM === 'quizlet') {
    input.innerHTML = value;
  }

  hideTip();
}

function getTopPositionMultiplier() {
  const mapPlatformToTopPositionMultiplier = {
    anki: 5,
    quizlet: 70,
  };

  return mapPlatformToTopPositionMultiplier[window.LEARNING_PLATFORM];
}
