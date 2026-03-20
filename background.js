const urls = [
  '*://*.primevideo.com/*',
  '*://*.amazon.com/*',
  '*://*.disneyplus.com/*',
  '*://*.netflix.com/*',
  '*://*.youtube.com/*',
  '*://ankiuser.net/*',
  '*://quizlet.com/*',
];

let recentTabId = null;

chrome.runtime.onInstalled.addListener((reason) => {
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

chrome.runtime.onMessage.addListener(async (req, sender, sendResponse) => {
  if (req.message === 'toTranslate') {
    recentTabId = sender.tab?.id ?? recentTabId;
    const {
      messageText,
      originText,
      requestId,
      timestamp,
    } = await translateRow(req.payload);
    sendTranslatedMessage(messageText, originText, requestId, timestamp);
  }

  if (req.message === 'toTranslateClicked') {
    const targetTabId = sender.tab?.id ?? recentTabId;

    if (targetTabId == null) {
      return;
    }

    const translatedList = await Promise.all(
      req.payload.textList.map((elem) => translateRow({ ...req.payload, text: elem }))
    );
    chrome.tabs.sendMessage(targetTabId, {
      message: 'translatedList',
      payload: {
        data: translatedList.map((elem, index) => ({
          text: req.payload.textList[index],
          translation: elem.messageText,
        })),
      },
    });
  }

  if (req.message === 'seekOnSourcePage') {
    const { sourceUrl, timestamp } = req.payload;

    const matchingTabs = await chrome.tabs.query({ url: urls });
    const targetTab = matchingTabs.find((tab) => {
      try {
        const tabUrl = new URL(tab.url);
        const srcUrl = new URL(sourceUrl);
        return tabUrl.origin + tabUrl.pathname === srcUrl.origin + srcUrl.pathname;
      } catch {
        return false;
      }
    });

    if (targetTab) {
      await chrome.tabs.update(targetTab.id, { active: true });
      chrome.tabs.sendMessage(targetTab.id, {
        message: 'seekToTimestamp',
        payload: { timestamp },
      });
    } else {
      const newTab = await chrome.tabs.create({ url: sourceUrl });
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (tabId === newTab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          setTimeout(() => {
            chrome.tabs.sendMessage(tabId, {
              message: 'seekToTimestamp',
              payload: { timestamp },
            });
          }, 3000);
        }
      });
    }
  }
});

async function translateRow(obj) {
  const sourceLang = obj.lang1;
  const targetLang = obj.lang2;
  const text = obj.text.split('%').join('%25').split('&').join('%26');
  const URL = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${text}`;

  try {
    const res = await fetch(URL, {
      method: 'GET',
      headers: {
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      },
    });

    if (res.status !== 200) {
      throw new Error('Error' + res.status);
    }

    const data = await res.json();

    const messageArr = data[0];
    const newArr = messageArr.map((elem) => elem[0]);
    const messageText = newArr.join('');

    return {
      messageText,
      originText: obj.text,
      requestId: obj.requestId,
      timestamp: obj.timestamp,
    };
  } catch (error) {
    console.log(error.res?.status ?? error);
    return {
      messageText: '',
      originText: obj.text,
      requestId: obj.requestId,
      timestamp: obj.timestamp,
    };
  }
}

async function sendTranslatedMessage(data, originText, requestId, timestamp) {
  if (recentTabId != null) {
    chrome.tabs.sendMessage(recentTabId, {
      message: 'translated',
      payload: { data, originText, requestId, timestamp },
    });
  }
}
