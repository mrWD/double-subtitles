const onOff = document.querySelector('#onOff');
const showHideSidebar = document.querySelector('#showHideSidebar');
const showHideDoubleSubtitles = document.querySelector('#showHideDoubleSubtitles');
const captionsOnPauseOnly = document.querySelector('#captionsOnPauseOnly');
const translationOnPauseOnly = document.querySelector('#translationOnPauseOnly');
const resetSubtitlePosition = document.querySelector('#resetSubtitlePosition');
const sidebarFontSize = document.querySelector('#sidebarFontSize');
const resetFontSize = document.querySelector('#resetFontSize');
const languageSelect = document.querySelector('#secondLanguage');
const currentForeignLanguageSelect = document.querySelector('#currentForeignLanguage');
const languageOptions = document.querySelectorAll('#secondLanguage option');
const savedCardsModal = document.querySelector('#savedCards');
const showCardsButton = document.querySelector('#showSavedCards');
const closeSavedCardsButton = document.querySelector('#closeSavedCards');
const uiLanguageSelect = document.querySelector('#uiLanguage');
const subtitleFontSize = document.querySelector('#subtitleFontSize');
const resetSubtitleFontSize = document.querySelector('#resetSubtitleFontSize');
const captionColorInput = document.querySelector('#captionColor');
const translationColorInput = document.querySelector('#translationColor');
const resetCaptionColor = document.querySelector('#resetCaptionColor');
const resetTranslationColor = document.querySelector('#resetTranslationColor');
const linkBtns = document.querySelectorAll('.js-link');
let options;

const DEFAULT_CAPTION_COLOR = '#ffffff';
const DEFAULT_TRANSLATION_COLOR = '#aaaaaa';

window.addEventListener('DOMContentLoaded', async () => {
  options = await loadOptionsOrSetDefaults();
  await initI18n();
  populateUiLanguageDropdown();
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

captionsOnPauseOnly.addEventListener('change', () => {
  setOptions();

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        message: 'updatePauseOnlyMode',
        payload: {
          captionsOnPauseOnly: captionsOnPauseOnly.checked,
          translationOnPauseOnly: translationOnPauseOnly.checked,
        }
      });
    }
  });
});

translationOnPauseOnly.addEventListener('change', () => {
  setOptions();

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        message: 'updatePauseOnlyMode',
        payload: {
          captionsOnPauseOnly: captionsOnPauseOnly.checked,
          translationOnPauseOnly: translationOnPauseOnly.checked,
        }
      });
    }
  });
});

resetSubtitlePosition.addEventListener('click', () => {
  options.subtitlePosition = null;
  saveOptions(options);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        message: 'resetSubtitlePosition',
      });
    }
  });
});

sidebarFontSize.addEventListener('input', () => {
  setOptions();

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        message: 'updateSidebarFontSize',
        payload: { fontSize: parseInt(sidebarFontSize.value) }
      });
    }
  });
});

resetFontSize.addEventListener('click', () => {
  sidebarFontSize.value = 16;
  setOptions();

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        message: 'updateSidebarFontSize',
        payload: { fontSize: 16 }
      });
    }
  });
});

subtitleFontSize.addEventListener('input', () => {
  setOptions();

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        message: 'updateSubtitleFontSize',
        payload: { fontSize: parseInt(subtitleFontSize.value) }
      });
    }
  });
});

resetSubtitleFontSize.addEventListener('click', () => {
  subtitleFontSize.value = '';
  options.subtitleFontSize = null;
  saveOptions(options);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        message: 'updateSubtitleFontSize',
        payload: { fontSize: null }
      });
    }
  });
});

captionColorInput.addEventListener('input', () => {
  setOptions();
  sendSubtitleColorsMessage();
});

translationColorInput.addEventListener('input', () => {
  setOptions();
  sendSubtitleColorsMessage();
});

resetCaptionColor.addEventListener('click', () => {
  captionColorInput.value = DEFAULT_CAPTION_COLOR;
  setOptions();
  sendSubtitleColorsMessage();
});

resetTranslationColor.addEventListener('click', () => {
  translationColorInput.value = DEFAULT_TRANSLATION_COLOR;
  setOptions();
  sendSubtitleColorsMessage();
});

function sendSubtitleColorsMessage() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        message: 'updateSubtitleColors',
        payload: {
          captionColor: captionColorInput.value,
          translationColor: translationColorInput.value,
        }
      });
    }
  });
}

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

uiLanguageSelect.addEventListener('change', async () => {
  options.uiLanguage = uiLanguageSelect.value;
  saveOptions(options);
  await initI18n(uiLanguageSelect.value);
  populateHtmlWithText();
});

function setOptions() {
  options.extensionOn = onOff.checked;
  options.showSidebar = showHideSidebar.checked;
  options.showDoubleSubtitles = showHideDoubleSubtitles.checked;
  options.captionsOnPauseOnly = captionsOnPauseOnly.checked;
  options.translationOnPauseOnly = translationOnPauseOnly.checked;
  options.sidebarFontSize = parseInt(sidebarFontSize.value) || 16;
  options.subtitleFontSize = parseInt(subtitleFontSize.value) || null;
  options.captionColor = captionColorInput.value;
  options.translationColor = translationColorInput.value;
  options.secondLanguage = languageSelect.value;
  options.currentForeignLanguage = currentForeignLanguageSelect.value;
  saveOptions(options);
}

function setCheckbox(options) {
  onOff.checked = options.extensionOn;
  showHideSidebar.checked = options.showSidebar;
  showHideDoubleSubtitles.checked = options.showDoubleSubtitles;
  captionsOnPauseOnly.checked = options.captionsOnPauseOnly || false;
  translationOnPauseOnly.checked = options.translationOnPauseOnly || false;
  sidebarFontSize.value = options.sidebarFontSize || 16;
  subtitleFontSize.value = options.subtitleFontSize || '';
  captionColorInput.value = options.captionColor || DEFAULT_CAPTION_COLOR;
  translationColorInput.value = options.translationColor || DEFAULT_TRANSLATION_COLOR;
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

function populateUiLanguageDropdown() {
  uiLanguageSelect.innerHTML = '';

  for (const [code, name] of Object.entries(AVAILABLE_LOCALES)) {
    const option = document.createElement('option');
    option.value = code;
    option.textContent = name;
    uiLanguageSelect.appendChild(option);
  }

  if (options.uiLanguage && AVAILABLE_LOCALES[options.uiLanguage]) {
    uiLanguageSelect.value = options.uiLanguage;
  } else {
    const browserLang = (chrome.i18n.getUILanguage() || 'en').split('-')[0];
    uiLanguageSelect.value = AVAILABLE_LOCALES[browserLang] ? browserLang : 'en';
  }
}

function populateHtmlWithText() {
  document.querySelector('.text1').innerHTML = t('popupText');
  document.querySelector('#onOffLabel').textContent = t('onOffLabel');
  document.querySelector('#showHideSidebarLabel').textContent = t('showHideSidebarLabel');
  document.querySelector('#sidebarFontSizeLabel').textContent = t('sidebarFontSizeLabel');
  document.querySelector('#showHideDoubleSubtitlesLabel').textContent = t('showHideDoubleSubtitlesLabel');
  document.querySelector('#langLabel').textContent = t('langLabel');
  document.querySelector('#currentForeignLangLabel').textContent = t('currentForeignLangLabel');
  document.querySelector('#uiLanguageLabel').textContent = t('uiLanguageLabel');
  document.querySelector('#captionsOnPauseOnlyLabel').textContent = t('captionsOnPauseOnlyLabel');
  document.querySelector('#translationOnPauseOnlyLabel').textContent = t('translationOnPauseOnlyLabel');
  document.querySelector('#resetSubtitlePositionLabel').textContent = t('resetSubtitlePosition');
  document.querySelector('#resetSubtitlePosition').textContent = t('resetButton');
  document.querySelector('#resetFontSize').textContent = t('resetButton');
  document.querySelector('#subtitleFontSizeLabel').textContent = t('subtitleFontSizeLabel');
  document.querySelector('#resetSubtitleFontSize').textContent = t('resetButton');
  document.querySelector('#captionColorLabel').textContent = t('captionColorLabel');
  document.querySelector('#translationColorLabel').textContent = t('translationColorLabel');
  document.querySelector('#resetCaptionColor').textContent = t('resetButton');
  document.querySelector('#resetTranslationColor').textContent = t('resetButton');
  document.querySelector('#showSavedCards').textContent = t('showSavedTranslations');
  document.querySelector('.donations__text').textContent = t('supportExtension');
  document.querySelector('#savedTranslationsTitle').textContent = t('savedTranslations');
  document.querySelector('#searchCards').placeholder = t('searchTranslations');
  document.querySelector('#emptyCards').textContent = t('noSavedCards');
}
