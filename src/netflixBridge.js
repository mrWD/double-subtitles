(() => {
  // The content script passes a per-page-load nonce in the script URL fragment and
  // listens on nonce-salted names, so unrelated page scripts cannot guess the
  // channel and drive the player through this bridge.
  const nonce = document.currentScript?.src.split('#')[1];

  if (!nonce) {
    return;
  }

  const EVENT_NAME = `double-subtitles-netflix-seek-${nonce}`;
  const GET_TIME_EVENT = `double-subtitles-netflix-get-time-${nonce}`;
  const STATUS_ATTR = `data-ds-netflix-seek-status-${nonce}`;
  const BRIDGE_ATTR = `data-ds-netflix-seek-bridge-${nonce}`;
  const CURRENT_TIME_ATTR = `data-ds-netflix-current-time-ms-${nonce}`;
  const root = document.documentElement;

  if (!root || root.getAttribute(BRIDGE_ATTR) === 'ready') {
    return;
  }

  const getPlayer = () => {
    const apiCandidates = [
      () => window.netflix?.appContext?.state?.playerApp?.getAPI?.(),
      () => window.netflix?.appContext?.state?.playerApp?.player?.getAPI?.(),
      () => window.netflix?.appContext?.state?.playerApp?._api,
    ];

    let videoPlayer = null;
    for (const getApi of apiCandidates) {
      try {
        const api = getApi?.();
        if (api?.videoPlayer) {
          videoPlayer = api.videoPlayer;
          break;
        }
      } catch {
        // try next API shape
      }
    }

    if (!videoPlayer) {
      return null;
    }

    const sessionIds = videoPlayer.getAllPlayerSessionIds?.() ?? [];
    for (let index = sessionIds.length - 1; index >= 0; index -= 1) {
      const player = videoPlayer.getVideoPlayerBySessionId?.(sessionIds[index]);
      if (player) {
        return player;
      }
    }

    return null;
  };

  root.setAttribute(BRIDGE_ATTR, 'ready');

  window.addEventListener(EVENT_NAME, (event) => {
    try {
      const milliseconds = Number(event?.detail?.milliseconds);
      if (!Number.isFinite(milliseconds)) {
        root.setAttribute(STATUS_ATTR, 'invalid');
        return;
      }

      const player = getPlayer();
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

  window.addEventListener(GET_TIME_EVENT, () => {
    try {
      const player = getPlayer();
      const milliseconds = player?.getCurrentTime?.();
      if (!Number.isFinite(milliseconds) || milliseconds < 0) {
        root.setAttribute(CURRENT_TIME_ATTR, '');
        return;
      }

      root.setAttribute(CURRENT_TIME_ATTR, String(Math.round(milliseconds)));
    } catch {
      root.setAttribute(CURRENT_TIME_ATTR, '');
    }
  });
})();
