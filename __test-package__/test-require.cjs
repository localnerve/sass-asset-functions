const { default: saf } = require('package');
const {
  testInlineLegacy,
  testInlineModernSync,
  testInlineModernAsync
} = require('./functions');

testInlineLegacy(saf);
testInlineModernSync(saf);
testInlineModernAsync(saf);