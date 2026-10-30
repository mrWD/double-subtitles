const SELECTORS_PLATFORMS = ['amazon', 'disney', 'netflix'];
const SELECTORS_CLASS_PATTERN = /^[A-Za-z_][A-Za-z0-9_-]{0,99}$/;

// Remote config is data only: each platform may set a single plain CSS class
// name. Anything else is dropped so a bad file can never inject selectors or CSS.
function validateSelectors(data) {
  if (!data || data.version !== 1 || typeof data.platforms !== 'object' || !data.platforms) {
    return null;
  }

  const platforms = {};

  SELECTORS_PLATFORMS.forEach((platform) => {
    const captionClass = data.platforms[platform]?.captionClass;

    if (typeof captionClass === 'string' && SELECTORS_CLASS_PATTERN.test(captionClass)) {
      platforms[platform] = { captionClass };
    }
  });

  return Object.keys(platforms).length ? { version: 1, platforms } : null;
}

if (typeof module !== 'undefined') {
  module.exports = { validateSelectors };
}
