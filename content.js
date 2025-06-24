let isMonitorActive = null;
let originalLanguage = null;
let secondLanguage = null;
let savedSubtitle = null;
let options;

async function initContent() {
  options = await loadOptionsOrSetDefaults();
  window.options = options;

  startMonitoringForElements(0);
  secondLanguage = options.secondLanguage;
  originalLanguage = decodeLang(options.currentForeignLanguage);

  createSidebarWithHistory();

  if (window.toggleSidebar) {
    window.toggleSidebar(options.showSidebar);
  }

  if (window.toggleDoubleSubtitles) {
    window.toggleDoubleSubtitles(options.showDoubleSubtitles);
  }
}

initContent();

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'sync' || !changes.options?.newValue) {
    return;
  }

  options = changes.options.newValue;
  window.options = options;

  secondLanguage = options.secondLanguage;
  originalLanguage = decodeLang(options.currentForeignLanguage);

  if (!document.querySelector('.sidebar')) {
    createSidebarWithHistory();
  }

  if (window.toggleSidebar) {
    window.toggleSidebar(options.showSidebar);
  }

  if (window.toggleDoubleSubtitles) {
    window.toggleDoubleSubtitles(options.showDoubleSubtitles);
  }
});

chrome.runtime.onMessage.addListener((req) => {
  if (req.message === 'translated') {
    fillSubtitles(req.payload);
  }

  if (req.message === 'translatedList') {
    showTranslatedList(req.payload.data);
  }

  if (req.message === 'toggleSidebar') {
    if (!document.querySelector('.sidebar')) {
      createSidebarWithHistory();
    }

    if (window.toggleSidebar) {
      window.toggleSidebar(req.payload.show);
    }
  }

  if (req.message === 'toggleDoubleSubtitles') {
    if (window.toggleDoubleSubtitles) {
      window.toggleDoubleSubtitles(req.payload.show);
    }
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

function translateList(target) {
  const textList = target.innerText?.match(/\b\p{L}+\b/gu);

  if (!textList) {
    return;
  }

  chrome.runtime.sendMessage({
    message: 'toTranslateClicked',
    payload: {
      textList,
      lang1: encodeLang(originalLanguage),
      lang2: secondLanguage,
    },
  });
}
