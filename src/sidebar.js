function createSidebarWithHistory() {
  const existedHistory = document.querySelector('.history');
  const existedHistoryList = document.querySelector('.historyList');

  if (existedHistory && existedHistoryList) {
    return { history: existedHistory, historyList: existedHistoryList };
  }

  const wrapper = preparePageForSidebar();
  const sidebar = createSidebar();

  wrapper.appendChild(sidebar);

  const history = document.createElement('div');
  history.classList.add('history');
  sidebar.appendChild(history);

  const historyTitle = document.createElement('div');
  historyTitle.classList.add('historyTitle');
  historyTitle.textContent = 'HISTORY';
  history.appendChild(historyTitle);

  const historySearchInput = document.createElement('input');
  historySearchInput.type = 'text';
  historySearchInput.id = 'searchHistory';
  historySearchInput.placeholder = 'Search translations...';
  historySearchInput.classList.add('search-input');

  historySearchInput.addEventListener('input', (e) => {
    const searchValue = e.target.value?.toLowerCase();
    const historyList = document.querySelector('.historyList');
    const historyElems = historyList.querySelectorAll('.historyElem');

    historyElems.forEach((elem) => {
      if (elem.textContent?.toLowerCase().includes(searchValue)) {
        elem.style.display = 'block';
      } else {
        elem.style.display = 'none';
      }
    });
  });

  const historySearch = document.createElement('div');
  historySearch.classList.add('historySearch');
  historySearch.appendChild(historySearchInput);

  history.appendChild(historySearch);

  const historyList = document.createElement('div');
  historyList.classList.add('historyList');
  history.appendChild(historyList);

  return { history, historyList };
}

function addLineToHistory({ text, translation }) {
  const { historyList } = createSidebarWithHistory();

  const historyElem = document.createElement('div');

  historyElem.classList.add('historyElem');
  historyElem.dataset.text = text;
  historyElem.dataset.translation = translation;

  historyElem.innerHTML = `
    <span>${text}</span>
    <span>${translation}</span>
  `;

  historyElem.addEventListener('click', (e) => {
    translateList(e.target);
    const { text, translation } = e.target.dataset;

    openMenu({ text, translation });
  });

  historyElem.addEventListener('mouseover', () => {
    translateList(historyElem.querySelector('span'));

    const translatedList = createTranslatedList();

    translatedList.classList.remove('is-hidden');

    translatedList.style.left = 'auto';

    translatedList.style.top = `${historyElem.offsetTop}px`;
    translatedList.style.right = `${historyElem.offsetWidth}px`;

    translatedList.style.transform = null;
  });

  historyElem.addEventListener('mouseout', (e) => {
    if (
      e.toElement?.classList.contains('translatedList')
      || e.toElement?.classList.contains('historyElem')
    ) {
      return;
    }

    document.querySelector('.translatedList')
      ?.classList.add('is-hidden');
  });

  historyList.appendChild(historyElem);

  document.querySelector('.sidebar').scrollTop = document.querySelector('.sidebar')
    .scrollHeight;
}

function preparePageForSidebar() {
  if (window.STREAMING_PLATFORM === 'amazon') {
    return document.querySelector('#dv-web-player');
  }

  if (window.STREAMING_PLATFORM === 'disney') {
    return document.querySelector('.video_view--theater');
  }

  const videoContainer = document.querySelector('.watch-video');

  videoContainer.style.width = '80%';

  return document.querySelector('body');;
}

function createSidebar() {
  const sidebar = document.createElement('div');
  sidebar.classList.add('sidebar');

  if (window.STREAMING_PLATFORM === 'netflix') {
    sidebar.style.position = 'absolute';
    sidebar.style.top = 0;
    sidebar.style.right = 0;
  }

  if (window.options && window.options.showSidebar !== undefined) {
    if (!window.options.showSidebar) {
      sidebar.classList.add('hidden');
      sidebar.style.display = 'none';
    } else {
      sidebar.style.display = 'flex';
    }
  }

  return sidebar;
}

function showSidebar() {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebar.classList.remove('hidden');
    sidebar.style.display = 'flex';
    adjustContentWidth(true);
  }
}

function hideSidebar() {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebar.classList.add('hidden');
    sidebar.style.display = 'none';
    adjustContentWidth(false);
  }
}

function toggleSidebar(show) {
  if (show) {
    showSidebar();
  } else {
    hideSidebar();
  }
}

function adjustContentWidth(sidebarVisible) {
  if (window.STREAMING_PLATFORM === 'netflix') {
    const videoContainer = document.querySelector('.watch-video');
    if (videoContainer) {
      videoContainer.style.width = sidebarVisible ? '80%' : '100%';
    }
  }

  if (window.STREAMING_PLATFORM === 'amazon') {
    // Amazon uses flexbox, so the sidebar visibility is handled by display property
    // No additional width adjustment needed
  }

  if (window.STREAMING_PLATFORM === 'disney') {
    // Disney uses flexbox, so the sidebar visibility is handled by display property
    // No additional width adjustment needed
  }
}

// Export functions for use in other files
window.showSidebar = showSidebar;
window.hideSidebar = hideSidebar;
window.toggleSidebar = toggleSidebar;
window.createSidebarWithHistory = createSidebarWithHistory;
