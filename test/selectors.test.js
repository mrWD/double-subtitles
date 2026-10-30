const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { validateSelectors } = require('../src/selectorsValidator');

const valid = (platforms) => ({ version: 1, platforms });

assert.deepStrictEqual(
  validateSelectors(valid({ amazon: { captionClass: 'atv-captions_text2' } })),
  valid({ amazon: { captionClass: 'atv-captions_text2' } })
);

// Unsafe or malformed values are dropped.
['a b', 'x{}', 'a.b', '.a', '1a', 'a>b', 'a,b', '', 'a'.repeat(101), 42, null].forEach((bad) => {
  assert.strictEqual(validateSelectors(valid({ amazon: { captionClass: bad } })), null, String(bad));
});

// Unknown platforms and fields are ignored; one bad entry does not drop the rest.
assert.deepStrictEqual(
  validateSelectors(valid({
    evil: { captionClass: 'ok' },
    amazon: { captionClass: 'ok', css: 'body{display:none}' },
    netflix: { captionClass: 'bad class' },
  })),
  valid({ amazon: { captionClass: 'ok' } })
);

[null, undefined, {}, { version: 2, platforms: {} }, { version: 1 }, { version: 1, platforms: {} }]
  .forEach((bad) => assert.strictEqual(validateSelectors(bad), null));

// The shipped config must pass its own validator.
const shipped = JSON.parse(fs.readFileSync(path.join(__dirname, '../selectors.json'), 'utf8'));
assert.deepStrictEqual(validateSelectors(shipped), shipped);

console.log('selectors tests passed');
