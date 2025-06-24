async function loadOptionsOrSetDefaults() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get('options', async (item) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }

      options = item?.options;

      if (!options) {
        options = {
          extensionOn: true,
          secondLanguage: 'en',
          currentForeignLanguage: 'en',
        };

        chrome.storage.sync.set({
          options,
        });
      }

      resolve(options);
    });
  });
}
