let isMonitorActive = null;
let originalLanguage = null;
let secondLanguage = null;
let savedSubtitle = null;
let options;

async function initContent() {
  options = await loadOptionsOrSetDefaults();
  // Make options globally available
  window.options = options;

  startMonitoringForElements(0);
  secondLanguage = options.secondLanguage;
  originalLanguage = decodeLang(options.currentForeignLanguage);

  // Create sidebar immediately
  createSidebarWithHistory();

  // Initialize sidebar visibility based on options
  if (window.toggleSidebar) {
    window.toggleSidebar(options.showSidebar);
  }
}

initContent();

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'sync' || !changes.options?.newValue) {
    return;
  }

  options = changes.options.newValue;
  // Update global options
  window.options = options;

  secondLanguage = options.secondLanguage;
  originalLanguage = decodeLang(options.currentForeignLanguage);

  // Ensure sidebar exists before toggling
  if (!document.querySelector('.sidebar')) {
    createSidebarWithHistory();
  }

  // Update sidebar visibility when options change
  if (window.toggleSidebar) {
    window.toggleSidebar(options.showSidebar);
  }
});

chrome.runtime.onMessage.addListener((req) => {
  if (req.message === 'translated') {
    fillSubtitles(req.payload);
  }

  if (req.message === 'translatedList') {
    showTranslatedList(req.payload.data);
  }

  if (req.message !== 'toggleSidebar') {
    return;
  }

  if (!document.querySelector('.sidebar')) {
    createSidebarWithHistory();
  }

  if (window.toggleSidebar) {
    window.toggleSidebar(req.payload.show);
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
