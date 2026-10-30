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

const LOCALE_REQUEST_TIMEOUT_MS = 3000;

// Content scripts cannot fetch the extension's own files from host pages
// ("Unsafe attempt to load URL"), so they ask the background script instead.
async function loadLocaleMessages(lang) {
  try {
    if (window.location.protocol === 'chrome-extension:') {
      const res = await fetch(chrome.runtime.getURL(`_locales/${lang}/messages.json`));
      return await res.json();
    }

    return await requestLocaleFromBackground(lang);
  } catch {
    return {};
  }
}

function requestLocaleFromBackground(lang) {
  return new Promise((resolve) => {
    const finish = (messages) => {
      clearTimeout(timer);
      chrome.runtime.onMessage.removeListener(onReply);
      resolve(messages || {});
    };
    const onReply = (req, sender) => {
      if (sender?.id !== chrome.runtime.id || sender.tab) {
        return;
      }

      if (req.message === 'localeMessages' && req.payload?.lang === lang) {
        finish(req.payload.messages);
      }
    };
    const timer = setTimeout(() => finish({}), LOCALE_REQUEST_TIMEOUT_MS);

    chrome.runtime.onMessage.addListener(onReply);
    // The reply arrives as a separate message; the port closing without a
    // direct response is expected, so errors are left to the timeout.
    chrome.runtime.sendMessage({ message: 'getLocale', payload: { lang } })
      .catch(() => {});
  });
}

async function initI18n(forceLang) {
  const lang = forceLang || await getSelectedUiLanguage();

  i18nMessages = await loadLocaleMessages(lang);
  i18nFallbackMessages = lang !== 'en' ? await loadLocaleMessages('en') : {};

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
