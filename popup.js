const onOff = document.querySelector('#onOff');
const languageSelect = document.querySelector('#secondLanguage');
const languageOptions = document.querySelectorAll('#secondLanguage option');
let options;

window.addEventListener('DOMContentLoaded', async () => {
  options = await loadOptionsOrSetDefaults();
  setCheckbox(options);
  populateHtmlWithText();
});

onOff.addEventListener('change', () => {
  setOptions();
});

function setOptions() {
  options.extensionOn = onOff.checked;
  options.secondLanguage = languageSelect.value;
  saveOptions(options);
}

function setCheckbox(options) {
  onOff.checked = options.extensionOn;
  languageSelect.value = options.secondLanguage;
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
  const popupText1 = document.querySelector('.text1');
  const popupText2 = document.querySelector('.text2');
  const onOffLabel = document.querySelector('#onOffLabel');
  const showHideSidebarLabel = document.querySelector('#showHideSidebarLabel');
  const showHideDoubleSubtitlesLabel = document.querySelector('#showHideDoubleSubtitlesLabel');
  const langLabel = document.querySelector('#langLabel');

  const popupTex1Msg = chrome.i18n.getMessage('popupTex1');
  const onOffLabelMsg = chrome.i18n.getMessage('onOffLabel');
  const showHideSidebarLabelMsg = chrome.i18n.getMessage('showHideSidebarLabel');
  const showHideDoubleSubtitlesLabelMsg = chrome.i18n.getMessage('showHideDoubleSubtitlesLabel');
  const langLabelMsg = chrome.i18n.getMessage('langLabel');

  popupText1.innerHTML = popupTex1Msg;
  onOffLabel.textContent = onOffLabelMsg;
  showHideSidebarLabel.textContent = showHideSidebarLabelMsg;
  showHideDoubleSubtitlesLabel.textContent = showHideDoubleSubtitlesLabelMsg;
  langLabel.textContent = langLabelMsg;
}
