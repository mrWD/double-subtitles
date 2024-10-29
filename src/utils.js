window.STREAMING_PLATFORM = getStreamingPlatform();
window.LEARNING_PLATFORM = getLearningPlatform();

function encodeLang(lang) {
  const mapLangToCode = {
    amazon: {
      'العربية (العالم)': 'ar',
      'العربية (مصر)': 'ar',
      العربية: 'ar',
      Català: 'ca',
      Dansk: 'da',
      Deutsch: 'de',
      DeutschUT: 'de',
      EnglishCC: 'en',
      English: 'en',
      Español: 'es',
      'Español (España)': 'es',
      'Español (Latinoamérica)': 'es',
      'Español (Latinoamérica)CC': 'es',
      Euskara: 'eu',
      Filipino: 'fil',
      Français: 'fr',
      'Français (Canada)': 'fr',
      'Français (France)': 'fr',
      Galego: 'gl',
      עברית: 'he',
      हिन्दी: 'hi',
      Indonesia: 'id',
      Italiano: 'it',
      ಕನ್ನಡ: 'kn',
      മലയാളം: 'ml',
      'Bahasa Melayu': 'ms',
      Magyar: 'hu',
      Nederlands: 'nl',
      'Norsk Bokmål': 'nb',
      Polski: 'pl',
      Português: 'pt',
      'Português (Brasil)': 'pt',
      'Português (Portugal)': 'pt',
      'Português (Brasil)CC': 'pt',
      Română: 'ro',
      Русский: 'ru',
      Slovenčina: 'sk',
      Suomi: 'fi',
      Svenska: 'sv',
      தமிழ்: 'ta',
      తెలుగు: 'te',
      ไทย: 'th',
      Türkçe: 'tr',
      Čeština: 'cs',
      Ελληνικά: 'el',
      日本語: 'ja',
      한국어: 'ko',
      Українська: 'uk',
      'Tiếng Việt': 'vi',
      '中文（简体）': 'zh',
      '中文（繁體）': 'zh',
    },
    disney: {
      'العربية (العالم)': 'ar',
      'العربية (مصر)': 'ar',
      العربية: 'ar',
      Català: 'ca',
      Dansk: 'da',
      Deutsch: 'de',
      EnglishCC: 'en',
      English: 'en',
      Español: 'es',
      'Español (España)': 'es',
      'Español (Latinoamérica)': 'es',
      'Español (Latinoamérica)CC': 'es',
      Euskara: 'eu',
      Filipino: 'fil',
      Français: 'fr',
      'Français (Canada)': 'fr',
      'Français (France)': 'fr',
      Galego: 'gl',
      עברית: 'he',
      हिन्दी: 'hi',
      Indonesia: 'id',
      Italiano: 'it',
      ಕನ್ನಡ: 'kn',
      മലയാളം: 'ml',
      'Bahasa Melayu': 'ms',
      Magyar: 'hu',
      Nederlands: 'nl',
      'Norsk Bokmål': 'nb',
      Polski: 'pl',
      Português: 'pt',
      'Português (Brasil)': 'pt',
      'Português (Portugal)': 'pt',
      'Português (Brasil)CC': 'pt',
      Română: 'ro',
      Русский: 'ru',
      Slovenčina: 'sk',
      Suomi: 'fi',
      Svenska: 'sv',
      தமிழ்: 'ta',
      తెలుగు: 'te',
      ไทย: 'th',
      Türkçe: 'tr',
      Čeština: 'cs',
      Ελληνικά: 'el',
      日本語: 'ja',
      한국어: 'ko',
      Українська: 'uk',
      'Tiếng Việt': 'vi',
      '中文（简体）': 'zh',
      '中文（繁體）': 'zh',
    },
    netflix: {
      'العربية (العالم)': 'ar',
      'العربية (مصر)': 'ar',
      العربية: 'ar',
      Català: 'ca',
      Dansk: 'da',
      Deutsch: 'de',
      EnglishCC: 'en',
      English: 'en',
      Español: 'es',
      'Español (España)': 'es',
      'Español (Latinoamérica)': 'es',
      'Español (Latinoamérica)CC': 'es',
      Euskara: 'eu',
      Filipino: 'fil',
      Français: 'fr',
      'Français (Canada)': 'fr',
      'Français (France)': 'fr',
      Galego: 'gl',
      עברית: 'he',
      हिन्दी: 'hi',
      Indonesia: 'id',
      Italiano: 'it',
      ಕನ್ನಡ: 'kn',
      മലയാളം: 'ml',
      'Bahasa Melayu': 'ms',
      Magyar: 'hu',
      Nederlands: 'nl',
      'Norsk Bokmål': 'nb',
      Polski: 'pl',
      Português: 'pt',
      'Português (Brasil)': 'pt',
      'Português (Portugal)': 'pt',
      'Português (Brasil)CC': 'pt',
      Română: 'ro',
      Русский: 'ru',
      Slovenčina: 'sk',
      Suomi: 'fi',
      Svenska: 'sv',
      தமிழ்: 'ta',
      తెలుగు: 'te',
      ไทย: 'th',
      Türkçe: 'tr',
      Čeština: 'cs',
      Ελληνικά: 'el',
      日本語: 'ja',
      한국어: 'ko',
      Українська: 'uk',
      'Tiếng Việt': 'vi',
      '中文（简体）': 'zh',
      '中文（繁體）': 'zh',
    },
  };
  return mapLangToCode[window.STREAMING_PLATFORM][lang];
}

function decodeLang(lang) {
  const mapCodeToLang = {
    amazon: {
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
      ru: 'Русский',
      tr: 'Türkçe',
      uk: 'Ukrainian',
      zh: 'Chinese',
    },
    disney: {
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
      ru: 'Русский',
      tr: 'Türkçe',
      uk: 'Ukrainian',
      zh: 'Chinese',
    },
    netflix: {
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
      ru: 'Русский',
      tr: 'Türkçe',
      uk: 'Ukrainian',
      zh: 'Chinese',
    },
  };
  return mapCodeToLang[window.STREAMING_PLATFORM]?.[lang];
}

function getStreamingPlatform() {
  if (window.location.hostname.includes('disney')) {
    return 'disney';
  }

  if (window.location.hostname.includes('netflix')) {
    return 'netflix';
  }

  if (window.location.hostname.includes('amazon')) {
    return 'amazon';
  }

  return null;
}

function getLearningPlatform() {
  if (window.location.hostname.includes('ankiuser')) {
    return 'anki';
  }

  if (window.location.hostname.includes('quizlet')) {
    return 'quizlet';
  }

  if (window.location.hostname.includes('sheets')) {
    return 'googleSheets';
  }

  return null;
}
