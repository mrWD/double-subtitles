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
    translateList(e);
    const { text, translation } = e.target.dataset;

    openMenu({ text, translation });
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

  return sidebar;
}
