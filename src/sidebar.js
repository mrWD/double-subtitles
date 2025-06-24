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

  // Apply current font size to history title
  if (window.options && window.options.sidebarFontSize) {
    historyTitle.style.fontSize = `${window.options.sidebarFontSize}px`;
  }

  history.appendChild(historyTitle);

  const historySearchInput = document.createElement('input');
  historySearchInput.type = 'text';
  historySearchInput.id = 'searchHistory';
  historySearchInput.placeholder = 'Search translations...';
  historySearchInput.classList.add('search-input');

  // Apply current font size to search input
  if (window.options && window.options.sidebarFontSize) {
    historySearchInput.style.fontSize = `${window.options.sidebarFontSize}px`;
  }

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

  // Ensure the sidebar has the correct width after creation
  if (window.options && window.options.sidebarWidth) {
    sidebar.style.width = window.options.sidebarWidth;
  }

  // Set initial font size
  if (window.options && window.options.sidebarFontSize) {
    updateSidebarFontSize(window.options.sidebarFontSize);
  }

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

  // Apply current font size to new history element
  if (window.options && window.options.sidebarFontSize) {
    historyElem.style.fontSize = `${window.options.sidebarFontSize}px`;
    const spans = historyElem.querySelectorAll('span');
    spans.forEach(span => {
      span.style.fontSize = `${window.options.sidebarFontSize}px`;
    });
  }

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

  // Set initial width from options
  if (window.options && window.options.sidebarWidth) {
    sidebar.style.width = window.options.sidebarWidth;
  }

  if (window.options && window.options.showSidebar !== undefined) {
    if (!window.options.showSidebar) {
      sidebar.classList.add('hidden');
      sidebar.style.display = 'none';
    } else {
      sidebar.style.display = 'flex';
    }
  }

  // Add resize handle
  const resizeHandle = document.createElement('div');
  resizeHandle.classList.add('sidebar-resize-handle');
  sidebar.appendChild(resizeHandle);

  // Add resize functionality
  makeSidebarResizable(sidebar, resizeHandle);

  return sidebar;
}

function makeSidebarResizable(sidebar, resizeHandle) {
  let isResizing = false;
  let startX, startWidth;

  function startResize(e) {
    isResizing = true;
    startX = e.clientX;
    startWidth = parseInt(getComputedStyle(sidebar).width, 10);

    resizeHandle.classList.add('resizing');
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  }

  function doResize(e) {
    if (!isResizing) return;

    const deltaX = e.clientX - startX;
    const newWidth = startWidth - deltaX; // Subtract because sidebar is on the right

    // Apply min/max constraints
    const minWidth = 200;
    const maxWidth = window.innerWidth * 0.5;
    const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));

    sidebar.style.width = `${constrainedWidth}px`;

    // Adjust content width for Netflix
    if (window.STREAMING_PLATFORM === 'netflix') {
      const videoContainer = document.querySelector('.watch-video');
      if (videoContainer) {
        const contentWidth = 100 - (constrainedWidth / window.innerWidth * 100);
        videoContainer.style.width = `${contentWidth}%`;
      }
    }
  }

  function stopResize() {
    if (!isResizing) return;

    isResizing = false;
    resizeHandle.classList.remove('resizing');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';

    // Save the new width
    const newWidth = sidebar.style.width;
    if (window.options && newWidth) {
      window.options.sidebarWidth = newWidth;
      chrome.storage.sync.set({
        options: window.options,
      });
    }
  }

  function handleWindowResize() {
    // Ensure sidebar width is within constraints after window resize
    const currentWidth = parseInt(getComputedStyle(sidebar).width, 10);
    const maxWidth = window.innerWidth * 0.5;

    if (currentWidth > maxWidth) {
      sidebar.style.width = `${maxWidth}px`;
      if (window.options) {
        window.options.sidebarWidth = sidebar.style.width;
        chrome.storage.sync.set({
          options: window.options,
        });
      }
    }
  }

  // Add event listeners
  resizeHandle.addEventListener('mousedown', startResize);
  document.addEventListener('mousemove', doResize);
  document.addEventListener('mouseup', stopResize);
  window.addEventListener('resize', handleWindowResize);

  // Prevent text selection during resize
  resizeHandle.addEventListener('selectstart', (e) => e.preventDefault());
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
      if (sidebarVisible) {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
          const sidebarWidth = parseInt(getComputedStyle(sidebar).width, 10);
          const contentWidth = 100 - (sidebarWidth / window.innerWidth * 100);
          videoContainer.style.width = `${contentWidth}%`;
        } else {
          videoContainer.style.width = '80%';
        }
      } else {
        videoContainer.style.width = '100%';
      }
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

function updateSidebarFontSize(fontSize) {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    // Update font size for all text elements in the sidebar
    const textElements = sidebar.querySelectorAll('.historyTitle, .search-input, .historyElem, .historyElem span');
    textElements.forEach(element => {
      element.style.fontSize = `${fontSize}px`;
    });

    // Also update the global options for future elements
    if (window.options) {
      window.options.sidebarFontSize = fontSize;
    }
  }
}

// Export functions for use in other files
window.showSidebar = showSidebar;
window.hideSidebar = hideSidebar;
window.toggleSidebar = toggleSidebar;
window.createSidebarWithHistory = createSidebarWithHistory;
window.updateSidebarFontSize = updateSidebarFontSize;
