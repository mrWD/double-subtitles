const AVAILABLE_LOCALES = {
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  it: 'Italiano',
  ja: '日本語',
  ko: '한국어',
  pl: 'Polski',
  pt: 'Português',
  ru: 'Русский',
  tr: 'Türkçe',
  uk: 'Українська',
  zh: '中文',
};

let i18nMessages = {};
let i18nFallbackMessages = {};
let i18nReady = false;

async function initI18n(forceLang) {
  const lang = forceLang || await getSelectedUiLanguage();

  try {
    const url = chrome.runtime.getURL(`_locales/${lang}/messages.json`);
    const res = await fetch(url);
    i18nMessages = await res.json();
  } catch {
    i18nMessages = {};
  }

  if (lang !== 'en') {
    try {
      const url = chrome.runtime.getURL('_locales/en/messages.json');
      const res = await fetch(url);
      i18nFallbackMessages = await res.json();
    } catch {
      i18nFallbackMessages = {};
    }
  } else {
    i18nFallbackMessages = {};
  }

  i18nReady = true;
}

async function getSelectedUiLanguage() {
  try {
    const { options } = await chrome.storage.sync.get('options');
    if (options?.uiLanguage && AVAILABLE_LOCALES[options.uiLanguage]) {
      return options.uiLanguage;
    }
  } catch {}

  const browserLang = (chrome.i18n.getUILanguage() || 'en').split('-')[0];
  return AVAILABLE_LOCALES[browserLang] ? browserLang : 'en';
}

function t(key) {
  return i18nMessages[key]?.message
    || i18nFallbackMessages[key]?.message
    || key;
}
