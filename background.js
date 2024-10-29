const urls = [
  '*://*.primevideo.com/*',
  '*://*.amazon.com/*',
  '*://*.disneyplus.com/*',
  '*://*.netflix.com/*',
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
    recentTabId = sender.tab.id;
    const { messageText, originText } = await translateRow(req.payload);
    sendTranslatedMessage(messageText, originText);
  }

  if (req.message === 'toTranslateClicked') {
    const translatedList = await Promise.all(
      req.payload.textList.map((elem) => translateRow({ ...req.payload, text: elem }))
    );
    chrome.tabs.sendMessage(recentTabId, {
      message: 'translatedList',
      payload: { data: translatedList.map((elem, index) => ({ text: req.payload.textList[index], translation: elem })) },
    });
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

    return { messageText, originText: text };
  } catch (error) {
    console.log(error.res?.status ?? error);
    return { messageText: '', originText: text };
  }
}

async function sendTranslatedMessage(data, originText) {
  if (recentTabId) {
    chrome.tabs.sendMessage(recentTabId, {
      message: 'translated',
      payload: { data, originText },
    });
  }
}
