let isMonitorActive = null;
let originalLanguage = decodeLang('de');
let secondLanguage = decodeLang('ru');
let savedSubtitle = null;
let options;

console.log('URL: ', window.location.hostname);

async function initContent() {
  options = await loadOptionsOrSetDefaults();
  startMonitoringForElements(0);
  secondLanguage = options.secondLanguage;
}

initContent();

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync' && changes.options?.newValue) {
    options = changes.options.newValue;
    secondLanguage = options.secondLanguage;
  }
});

chrome.runtime.onMessage.addListener((req) => {
  if (req.message == 'translated') {
    fillSubtitles(req.payload);
  }

  if (req.message == 'translatedList') {
    showTranslatedList(req.payload.data);
  }
});

function handleMessage(text) {
  if (!originalLanguage || !secondLanguage) {
    console.log('no languages');
    return;
  }

  chrome.runtime.sendMessage({
    message: 'toTranslate',
    payload: {
      text,
      lang1: encodeLang(originalLanguage),
      lang2: secondLanguage,
    },
  });
}

function translateList(htmlEl) {
  const textList = htmlEl.innerText.match(/\b\p{L}+\b/gu);
  chrome.runtime.sendMessage({
    message: 'toTranslateClicked',
    payload: {
      textList,
      lang1: encodeLang(originalLanguage),
      lang2: secondLanguage,
    },
  });
}
