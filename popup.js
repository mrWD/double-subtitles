const onOff = document.querySelector('#onOff');
const showHideSidebar = document.querySelector('#showHideSidebar');
const showHideDoubleSubtitles = document.querySelector('#showHideDoubleSubtitles');
const languageSelect = document.querySelector('#secondLanguage');
const currentForeignLanguageSelect = document.querySelector('#currentForeignLanguage');
const languageOptions = document.querySelectorAll('#secondLanguage option');
const savedCardsModal = document.querySelector('#savedCards');
const showCardsButton = document.querySelector('#showSavedCards');
const closeSavedCardsButton = document.querySelector('#closeSavedCards');
const linkBtns = document.querySelectorAll('.js-link');
let options;

window.addEventListener('DOMContentLoaded', async () => {
  options = await loadOptionsOrSetDefaults();
  setCheckbox(options);
  populateHtmlWithText();
  loadSavedCards();
});

languageSelect.addEventListener('change', (event) => {
  chrome.storage.sync.set({
    options: {
      ...options,
      secondLanguage: event.target.value
    },
  });
});

currentForeignLanguageSelect.addEventListener('change', (event) => {
  chrome.storage.sync.set({
    options: {
      ...options,
      currentForeignLanguage: event.target.value
    },
  });
});

onOff.addEventListener('change', () => {
  setOptions();
});

showHideSidebar.addEventListener('change', () => {
  setOptions();

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        message: 'toggleSidebar',
        payload: { show: showHideSidebar.checked }
      });
    }
  });
});

showHideDoubleSubtitles.addEventListener('change', () => {
  setOptions();

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        message: 'toggleDoubleSubtitles',
        payload: { show: showHideDoubleSubtitles.checked }
      });
    }
  });
});

showCardsButton.addEventListener('click', () => {
  savedCardsModal.showModal();
});

closeSavedCardsButton.addEventListener('click', () => {
  savedCardsModal.close();
});

linkBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    chrome.tabs.create({
      url: btn.dataset.url,
    });
  });
});

function setOptions() {
  options.extensionOn = onOff.checked;
  options.showSidebar = showHideSidebar.checked;
  options.showDoubleSubtitles = showHideDoubleSubtitles.checked;
  options.secondLanguage = languageSelect.value;
  options.currentForeignLanguage = currentForeignLanguageSelect.value;
  saveOptions(options);
}

function setCheckbox(options) {
  onOff.checked = options.extensionOn;
  showHideSidebar.checked = options.showSidebar;
  showHideDoubleSubtitles.checked = options.showDoubleSubtitles;
  languageSelect.value = options.secondLanguage;
  currentForeignLanguageSelect.value = options.currentForeignLanguage;
}

function saveOptions(options) {
  chrome.storage.sync.set({
    options: options,
  });
}

function decodeLang(lang) {
  const mapCodeToLang = {
    ar: 'العربية',
    ca: 'Català',
    da: 'Dansk',
    de: 'Deutsch',
    en: 'English',
    es: 'Español',
    eu: 'Euskara',
    fr: 'Français',
    it: 'Italiano',
    ja: '日本語',
    ko: '한국어',
    nl: 'Nederlands',
    pl: 'Polish',
    pt: 'Português',
    ru: 'Russian',
    tr: 'Türkçe',
    uk: 'Ukrainian',
    zh: 'Chinese',
  };

  return mapCodeToLang[lang];
}

function populateHtmlWithText() {
  const popupText = document.querySelector('.text1');
  const onOffLabel = document.querySelector('#onOffLabel');
  const showHideSidebarLabel = document.querySelector('#showHideSidebarLabel');
  const showHideDoubleSubtitlesLabel = document.querySelector('#showHideDoubleSubtitlesLabel');
  const langLabel = document.querySelector('#langLabel');
  const currentForeignLangLabel = document.querySelector('#currentForeignLangLabel');

  const popupTex1Msg = chrome.i18n.getMessage('popupTex1');
  const onOffLabelMsg = chrome.i18n.getMessage('onOffLabel');
  const showHideSidebarLabelMsg = chrome.i18n.getMessage('showHideSidebarLabel');
  const showHideDoubleSubtitlesLabelMsg = chrome.i18n.getMessage('showHideDoubleSubtitlesLabel');
  const langLabelMsg = chrome.i18n.getMessage('langLabel');
  const currentForeignLangLabelMsg = chrome.i18n.getMessage('currentForeignLangLabel');

  popupText.innerHTML = popupTex1Msg;
  onOffLabel.textContent = onOffLabelMsg;
  showHideSidebarLabel.textContent = showHideSidebarLabelMsg;
  showHideDoubleSubtitlesLabel.textContent = showHideDoubleSubtitlesLabelMsg;
  langLabel.textContent = langLabelMsg;
  currentForeignLangLabel.textContent = currentForeignLangLabelMsg;
}
