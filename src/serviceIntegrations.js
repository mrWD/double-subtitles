// chrome.storage.sync limits a single item to QUOTA_BYTES_PER_ITEM (8 KB), and the
// whole card list is stored under one key. Without a cap, writes start failing
// silently once the list grows past that, so the list is trimmed here instead.
const MAX_CARDS = 200;
const MAX_FIELD_LENGTH = 500;
const SYNC_ITEM_BUDGET = 7800;

function truncateField(value) {
  const text = typeof value === 'string' ? value : String(value ?? '');
  return text.length > MAX_FIELD_LENGTH ? text.slice(0, MAX_FIELD_LENGTH) : text;
}

function fitCardsToQuota(cards) {
  let fitted = cards.slice(-MAX_CARDS);

  // Drop the oldest cards until the serialized item fits the per-item quota.
  while (fitted.length > 1 && new Blob([JSON.stringify(fitted)]).size > SYNC_ITEM_BUDGET) {
    fitted = fitted.slice(1);
  }

  return fitted;
}

function saveToSyncStorage({ text, translation, timestamp, sourceUrl }, onDone) {
  chrome.storage.sync.get(['cards'], result => {
    if (chrome.runtime.lastError) {
      console.warn('Double Subtitles: could not read saved cards.');
      onDone?.(false);
      return;
    }

    const cards = Array.isArray(result.cards) ? result.cards : [];

    const card = {
      text: truncateField(text),
      translation: truncateField(translation),
    };
    if (typeof timestamp === 'number' && Number.isFinite(timestamp)) {
      card.timestamp = timestamp;
    }
    if (sourceUrl && isSafeSourceUrl(sourceUrl)) {
      card.sourceUrl = sourceUrl;
    }

    chrome.storage.sync.set({ cards: fitCardsToQuota([...cards, card]) }, () => {
      if (chrome.runtime.lastError) {
        console.warn('Double Subtitles: could not save the card.');
        onDone?.(false);
        return;
      }

      onDone?.(true);
    });
  });
}
