const {
  testInlineLegacy,
  testInlineModernSync,
  testInlineModernAsync
} = require('./functions');

import('package').then(({ default: saf }) => {
  testInlineLegacy(saf);
  testInlineModernSync(saf);
  testInlineModernAsync(saf);
});