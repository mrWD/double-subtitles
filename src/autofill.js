setTimeout(() => {
  if (window.CARDS_APP === 'anki') {
    document.querySelectorAll('[contenteditable]').forEach((elem) => {
      elem.addEventListener('focus', (e) => {
        showTip(e);
      });
    });
  }
}, 3000);

function showTip(e) {
  const input = e.target;

  document.querySelectorAll('.cardsTip').forEach(cardsTip => cardsTip.remove());

  chrome.storage.sync.get('cards', item => {
    const tip = document.createElement('div');
    const cardList = document.createElement('ul');

    tip.classList.add('cardsTip');
    cardList.classList.add('cardList');

    item.cards?.forEach(card => {
      cardList.appendChild(createTipRow(card.text, input));
      cardList.appendChild(createTipRow(card.translation, input));
    });

    tip.appendChild(cardList);
    input.parentElement.appendChild(tip);
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
    input.textContent = text;
    document.querySelectorAll('.cardsTip').forEach(cardsTip => cardsTip.remove());
  });

  addAndDeleteBtn.addEventListener('click', () => {
    input.textContent = text;
    document.querySelectorAll('.cardsTip').forEach(cardsTip => cardsTip.remove());

    chrome.storage.sync.get('cards', item => {
      const newCards = item.cards.filter(card => card.text !== text);
      chrome.storage.sync.set({ cards: newCards });
    });
  });

  return row;
}
