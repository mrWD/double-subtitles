window.STREAMING_PLATFORM = getStreamingPlatform();
window.LEARNING_PLATFORM = getLearningPlatform();
const NETFLIX_SEEK_EVENT = 'double-subtitles-netflix-seek';
const NETFLIX_SEEK_STATUS_ATTR = 'data-double-subtitles-netflix-seek-status';
const NETFLIX_SEEK_BRIDGE_ATTR = 'data-double-subtitles-netflix-seek-bridge';

setupNetflixSeekBridge();

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
    youtube: {
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
  return mapLangToCode[window.STREAMING_PLATFORM]?.[lang];
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
    youtube: {
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

  if (window.location.hostname.includes('youtube')) {
    return 'youtube';
  }

  return null;
}

function isStreamingWatchPage() {
  if (!window.STREAMING_PLATFORM) {
    return false;
  }

  const { pathname } = window.location;
  const hasVideo = Boolean(document.querySelector('video'));

  if (window.STREAMING_PLATFORM === 'youtube') {
    return pathname === '/watch' || pathname.startsWith('/shorts/');
  }

  if (window.STREAMING_PLATFORM === 'netflix') {
    return pathname.startsWith('/watch');
  }

  if (window.STREAMING_PLATFORM === 'disney') {
    return pathname.startsWith('/video') || hasVideo;
  }

  if (window.STREAMING_PLATFORM === 'amazon') {
    return pathname.includes('/detail/') || pathname.includes('/gp/video') || hasVideo;
  }

  return hasVideo;
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

function getVideoCurrentTime() {
  const video = getPrimaryVideoElement();
  return video ? video.currentTime : null;
}

function seekVideoToTime(time) {
  if (time == null || isNaN(time)) {
    return;
  }

  if (window.STREAMING_PLATFORM === 'netflix') {
    seekNetflixToTime(time);
    return;
  }

  const video = getPrimaryVideoElement();
  if (video) {
    video.currentTime = time;
  }
}

function getPrimaryVideoElement() {
  const videos = Array.from(document.querySelectorAll('video'));

  if (videos.length === 0) {
    return null;
  }

  const activelyPlaying = videos.find((video) => !video.paused && !video.ended && video.readyState > 1);
  if (activelyPlaying) {
    return activelyPlaying;
  }

  const progressed = videos
    .filter((video) => Number.isFinite(video.currentTime) && video.currentTime > 0)
    .sort((a, b) => b.currentTime - a.currentTime)[0];
  if (progressed) {
    return progressed;
  }

  const withSource = videos.find((video) => Boolean(video.currentSrc));
  if (withSource) {
    return withSource;
  }

  return videos[0];
}

function seekNetflixToTime(timeInSeconds) {
  const root = document.documentElement;

  if (!root) {
    return false;
  }

  if (root.getAttribute(NETFLIX_SEEK_BRIDGE_ATTR) !== 'ready') {
    setupNetflixSeekBridge();
  }

  root.setAttribute(NETFLIX_SEEK_STATUS_ATTR, 'pending');

  window.dispatchEvent(new CustomEvent(NETFLIX_SEEK_EVENT, {
    detail: { milliseconds: Math.max(0, Math.round(timeInSeconds * 1000)) },
  }));

  return root.getAttribute(NETFLIX_SEEK_STATUS_ATTR) === 'ok';
}

function setupNetflixSeekBridge() {
  if (window.STREAMING_PLATFORM !== 'netflix') {
    return;
  }

  const root = document.documentElement;
  if (!root || root.getAttribute(NETFLIX_SEEK_BRIDGE_ATTR) === 'ready') {
    return;
  }

  const bridgeScript = document.createElement('script');
  bridgeScript.textContent = `
    (() => {
      const EVENT_NAME = '${NETFLIX_SEEK_EVENT}';
      const STATUS_ATTR = '${NETFLIX_SEEK_STATUS_ATTR}';
      const BRIDGE_ATTR = '${NETFLIX_SEEK_BRIDGE_ATTR}';
      const root = document.documentElement;
      if (!root || root.getAttribute(BRIDGE_ATTR) === 'ready') {
        return;
      }

      root.setAttribute(BRIDGE_ATTR, 'ready');
      window.addEventListener(EVENT_NAME, (event) => {
        try {
          const milliseconds = Number(event?.detail?.milliseconds);
          if (!Number.isFinite(milliseconds)) {
            root.setAttribute(STATUS_ATTR, 'invalid');
            return;
          }

          const videoPlayer = window.netflix
            ?.appContext
            ?.state
            ?.playerApp
            ?.getAPI
            ?.()
            ?.videoPlayer;
          const sessionId = videoPlayer?.getAllPlayerSessionIds?.()?.[0];
          const player = sessionId
            ? videoPlayer.getVideoPlayerBySessionId?.(sessionId)
            : null;

          if (!player?.seek) {
            root.setAttribute(STATUS_ATTR, 'no-player');
            return;
          }

          player.seek(Math.max(0, Math.round(milliseconds)));
          root.setAttribute(STATUS_ATTR, 'ok');
        } catch {
          root.setAttribute(STATUS_ATTR, 'error');
        }
      });
    })();
  `;

  (document.head || root).appendChild(bridgeScript);
  bridgeScript.remove();
}

function formatTimestamp(seconds) {
  if (seconds == null || isNaN(seconds)) return '';
  const totalSeconds = Math.floor(seconds);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}

window.getVideoCurrentTime = getVideoCurrentTime;
window.seekVideoToTime = seekVideoToTime;
window.formatTimestamp = formatTimestamp;
window.isStreamingWatchPage = isStreamingWatchPage;
