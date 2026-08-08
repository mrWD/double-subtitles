const urls = [
  'https://*.primevideo.com/*',
  'https://*.amazon.com/*',
  'https://*.amazon.co.uk/*',
  'https://*.amazon.de/*',
  'https://*.amazon.co.jp/*',
  'https://*.disneyplus.com/*',
  'https://*.netflix.com/*',
  'https://*.youtube.com/*',
  'https://*.twitch.tv/*',
  'https://*.max.com/*',
  'https://*.hbomax.com/*',
  'https://*.hulu.com/*',
  'https://ankiuser.net/*',
  'https://quizlet.com/*',
];

// Hosts we are willing to open or focus a tab for. Source URLs travel through the
// page (sessionStorage is same-origin and writable there), so they are untrusted
// input by the time they reach chrome.tabs.*.
const ALLOWED_SOURCE_HOSTS = [
  'primevideo.com',
  'amazon.com',
  'amazon.co.uk',
  'amazon.de',
  'amazon.co.jp',
  'disneyplus.com',
  'netflix.com',
  'youtube.com',
  'twitch.tv',
  'max.com',
  'hbomax.com',
  'hulu.com',
];

const MAX_TRANSLATION_LENGTH = 1000;
const MAX_LIST_ITEMS = 60;

chrome.runtime.onInstalled.addListener(() => {
  reloadTabs();
});

function reloadTabs() {
  urls.forEach((url) => {
    chrome.tabs.query({ url }, function (tabs) {
      if (tabs.length > 0) {
        tabs.forEach((tab) => {
          chrome.tabs.reload(tab.id);
        });
      }
    });
  });
}

function parseAllowedSourceUrl(rawUrl) {
  if (typeof rawUrl !== 'string' || rawUrl.length > 2000) {
    return null;
  }

  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return null;
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return null;
  }

  const host = parsed.hostname.toLowerCase();
  const isAllowed = ALLOWED_SOURCE_HOSTS.some(
    (domain) => host === domain || host.endsWith(`.${domain}`)
  );

  return isAllowed ? parsed : null;
}

function isExtensionPageSender(sender) {
  // The popup and other extension pages have no sender.tab.
  return !sender.tab && typeof sender.url === 'string'
    && sender.url.startsWith(chrome.runtime.getURL(''));
}

function isContentScriptSender(sender) {
  // A content script of ours, running in a top-level tab on a host we asked for.
  return typeof sender.tab?.id === 'number'
    && parseAllowedSourceUrl(sender.url ?? sender.tab.url) !== null;
}

function isTrustedSender(sender) {
  if (sender?.id !== chrome.runtime.id) {
    return false;
  }

  return isExtensionPageSender(sender) || isContentScriptSender(sender);
}

function toFiniteTimestamp(value) {
  const timestamp = Number(value);
  return Number.isFinite(timestamp) && timestamp >= 0 ? timestamp : null;
}

async function focusOrOpenSource(rawSourceUrl, rawTimestamp) {
  const source = parseAllowedSourceUrl(rawSourceUrl);

  if (!source) {
    console.warn('Double Subtitles: refused to open a source URL outside the allowed hosts.');
    return;
  }

  const timestamp = toFiniteTimestamp(rawTimestamp);
  const matchingTabs = await chrome.tabs.query({ url: urls });
  const targetTab = matchingTabs.find((tab) => {
    const tabUrl = parseAllowedSourceUrl(tab.url);
    return tabUrl !== null
      && tabUrl.origin + tabUrl.pathname === source.origin + source.pathname;
  });

  if (targetTab) {
    await chrome.tabs.update(targetTab.id, { active: true });

    if (timestamp != null) {
      await sendSeekMessage(targetTab.id, timestamp);
    }

    return;
  }

  const newTab = await chrome.tabs.create({ url: source.href });

  if (timestamp == null) {
    return;
  }

  chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
    if (tabId === newTab.id && changeInfo.status === 'complete') {
      chrome.tabs.onUpdated.removeListener(listener);
      setTimeout(() => sendSeekMessage(tabId, timestamp), 3000);
    }
  });
}

async function sendSeekMessage(tabId, timestamp) {
  try {
    await chrome.tabs.sendMessage(tabId, {
      message: 'seekToTimestamp',
      payload: { timestamp },
    });
  } catch {
    console.warn('Double Subtitles: could not deliver seekToTimestamp to tab', tabId);
  }
}

chrome.runtime.onMessage.addListener(async (req, sender) => {
  if (!isTrustedSender(sender)) {
    return;
  }

  // Messages that address a specific tab are only meaningful from a content script.
  const tabId = sender.tab?.id ?? null;

  if (req.message === 'toTranslate' && tabId !== null) {
    const {
      messageText,
      originText,
      requestId,
      timestamp,
    } = await translateRow(req.payload);

    // Reply to the tab that asked, not to a shared "most recent tab" — otherwise a
    // slow translation can land in a different tab on a different origin.
    await sendTranslatedMessage(tabId, messageText, originText, requestId, timestamp);
  }

  if (req.message === 'toTranslateClicked' && tabId !== null) {
    const textList = Array.isArray(req.payload?.textList)
      ? req.payload.textList.slice(0, MAX_LIST_ITEMS)
      : [];

    if (textList.length === 0) {
      return;
    }

    const translatedList = await Promise.all(
      textList.map((elem) => translateRow({ ...req.payload, text: elem }))
    );

    try {
      await chrome.tabs.sendMessage(tabId, {
        message: 'translatedList',
        payload: {
          data: translatedList.map((elem, index) => ({
            text: textList[index],
            translation: elem.messageText,
          })),
        },
      });
    } catch {
      console.warn('Double Subtitles: could not deliver translatedList to tab', tabId);
    }
  }

  if (req.message === 'navigateToSource' || req.message === 'seekOnSourcePage') {
    await focusOrOpenSource(req.payload?.sourceUrl, req.payload?.timestamp);
  }

  if (req.message === 'speakText') {
    const text = typeof req.payload?.text === 'string'
      ? req.payload.text.slice(0, MAX_TRANSLATION_LENGTH)
      : '';

    if (!text) {
      return;
    }

    chrome.tts.stop();
    chrome.tts.speak(text, {
      lang: typeof req.payload.lang === 'string' ? req.payload.lang : 'en',
      rate: Number.isFinite(req.payload.rate) ? req.payload.rate : 1.0,
    });
  }
});

async function translateRow(obj) {
  const text = typeof obj.text === 'string' ? obj.text.slice(0, MAX_TRANSLATION_LENGTH) : '';
  const empty = {
    messageText: '',
    originText: obj.text,
    requestId: obj.requestId,
    timestamp: obj.timestamp,
  };

  if (!text) {
    return empty;
  }

  const url = 'https://translate.googleapis.com/translate_a/single'
    + '?client=gtx&dt=t'
    + `&sl=${encodeURIComponent(obj.lang1 ?? 'auto')}`
    + `&tl=${encodeURIComponent(obj.lang2 ?? 'en')}`
    + `&q=${encodeURIComponent(text)}`;

  try {
    const res = await fetch(url, { method: 'GET', headers: { Accept: '*/*' } });

    if (!res.ok) {
      throw new Error(`Translation request failed with status ${res.status}`);
    }

    const data = await res.json();

    if (!Array.isArray(data) || !Array.isArray(data[0])) {
      throw new Error('Unexpected translation response shape');
    }

    const messageText = data[0]
      .map((elem) => (Array.isArray(elem) && typeof elem[0] === 'string' ? elem[0] : ''))
      .join('');

    return { ...empty, messageText };
  } catch (error) {
    // Deliberately does not log the request or the subtitle text.
    console.warn('Double Subtitles: translation failed —', error.message);
    return empty;
  }
}

async function sendTranslatedMessage(tabId, data, originText, requestId, timestamp) {
  try {
    await chrome.tabs.sendMessage(tabId, {
      message: 'translated',
      payload: { data, originText, requestId, timestamp },
    });
  } catch {
    console.warn('Double Subtitles: could not deliver translation to tab', tabId);
  }
}
