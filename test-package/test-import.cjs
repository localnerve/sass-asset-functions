const { testInline } = require('./functions');

import('package').then(({ default: saf }) => {
  testInline(saf);
});