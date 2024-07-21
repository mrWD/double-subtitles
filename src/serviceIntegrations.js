const API = 'http://127.0.0.1:5000';

const temp = {
  deckName: 'Movies',
  spreadsheetId: '1SJXSHIWHrwXwn3HHsYIwmFRdTjIkyGLLIJfa1xyHu_w',
  rangeName: 'Sheet1',
}

function saveToAnki({ deckName, text, translation }) {
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
