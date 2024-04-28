const onOff = document.querySelector('#onOff');
const languageSelect = document.querySelector('#secondLanguage');
const languageOptions = document.querySelectorAll('#secondLanguage option');
const switchText = document.querySelector('.sliderSwitchText');
const fakeSelect = document.querySelector('.fakeSelect');
const customSelect = document.querySelector('.customSelect');
const arrowDown = document.querySelector('#arrowDown');
const arrowUp = document.querySelector('#arrowUp');
const innerLanguage = document.querySelector('.innerLanguage');
let options;

window.addEventListener('DOMContentLoaded', async () => {
  options = await loadOptionsOrSetDefaults();
  setCheckbox(options);
  fillLanguages();
});

onOff.addEventListener('change', () => {
  setOptions();
});

customSelect.addEventListener('click', () => {
  fakeSelect.classList.toggle('hidden');
  arrowDown.classList.toggle('hidden');
  arrowUp.classList.toggle('hidden');
  // hide same language
  const langArr = Array.from(fakeSelect.children);
  langArr.forEach((elem) => {
    elem.classList.remove('hidden');
    if (innerLanguage.textContent == elem.textContent) {
      elem.classList.add('hidden');
    }
  });
});

fakeSelect.addEventListener('click', (e) => {
  languageOptions.forEach((option) => {
    if (option.value == e.target.attributes.value.textContent) {
      languageSelect.value = option.value;
      innerLanguage.textContent = decodeLang(languageSelect.value);
      setOptions();
    }
  });
});

function setOptions() {
  options.extensionOn = onOff.checked;
  options.secondLanguage = languageSelect.value;
  setSwitch();
  saveOptions(options);
}

function setCheckbox(options) {
  onOff.checked = options.extensionOn;
  languageSelect.value = options.secondLanguage;
  setSwitch();
  innerLanguage.textContent = decodeLang(options.secondLanguage);
}

function saveOptions(options) {
  chrome.storage.sync.set({
    options: options,
  });
}

function setSwitch() {
  if (onOff.checked) {
    switchText.classList.remove('sliderSwitchText2');
    switchText.innerText = 'on';
  } else {
    switchText.classList.add('sliderSwitchText2');
    switchText.innerText = 'off';
  }
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

document.addEventListener('keydown', (e) => {
  if (!fakeSelect.classList.contains('hidden')) {
    if (e.key == 'ArrowUp') {
      fakeSelect.scrollBy(0, -23);
    } else if (e.key == 'ArrowDown') {
      fakeSelect.scrollBy(0, 23);
    }
  }
});

fakeSelect.addEventListener('wheel', (e) => {
  if (e.deltaY < 0) {
    fakeSelect.scrollBy(0, -23);
  } else if (e.deltaY > 0) {
    fakeSelect.scrollBy(0, 23);
  }
  e.preventDefault();
});

function fillLanguages() {
  const popupText1 = document.querySelector('.text1');
  const popupText2 = document.querySelector('.text2');
  const onOffLabel = document.querySelector('#onOffLabel');
  const langLabel = document.querySelector('#langLabel');

  const popupTex1Msg = chrome.i18n.getMessage('popupTex1');
  const onOffLabelMsg = chrome.i18n.getMessage('onOffLabel');
  const langLabelMsg = chrome.i18n.getMessage('langLabel');

  popupText1.innerHTML = popupTex1Msg;
  onOffLabel.textContent = onOffLabelMsg;
  langLabel.textContent = langLabelMsg;
}
