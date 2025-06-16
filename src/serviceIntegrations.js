const API = 'http://127.0.0.1:5000';

const temp = {
  deckName: 'Movies',
  spreadsheetId: '1SJXSHIWHrwXwn3HHsYIwmFRdTjIkyGLLIJfa1xyHu_w',
  rangeName: 'Sheet1',
}

function saveToSyncStorage({ text, translation }) {
  chrome.storage.sync.get(['cards'], result => {
    const cards = result.cards ?? [];

    chrome.storage.sync.set({
      cards: [
        ...cards,
        { text, translation },
      ],
    });
  });
}

function saveToAnki({ deckName, text, translation }) {
  if (!deckName || !text || !translation) {
    return;
  }

  fetch(`${API}/anki-card`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      deckName,
      note: {
        front: text,
        back: translation,
      },
    }),
  })
  .then(res => res.json())
  .catch(rejected => {
    console.log(rejected);
  });
}

function saveToQuizlet({ deckName, text, translation }) {
  if (!deckName || !text || !translation) {
    return;
  }

  fetch(`${API}/quizlet-card`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      deckName,
      note: {
        front: text,
        back: translation,
      },
    }),
  })
  .then(res => res.json())
  .catch(rejected => {
    console.log(rejected);
  });
}

function saveToGSheet({ spreadsheetId, rangeName, text, translation }) {
  if (!spreadsheetId || !rangeName || !text || !translation) {
    return;
  }

  fetch(`${API}/gsheet-card`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      spreadsheetId,
      rangeName,
      values: [text, translation],
    }),
  })
  .then(res => res.json())
  .catch(rejected => {
    console.log(rejected);
  });
}
