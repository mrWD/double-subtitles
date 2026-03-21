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
          showSidebar: true,
          showDoubleSubtitles: true,
          sidebarWidth: '20%',
          sidebarFontSize: 16,
        };

        chrome.storage.sync.set({
          options,
        });
      }

      resolve(options);
    });
  });
}
