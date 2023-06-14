const fs = require('node:fs');
const util = require('node:util');
const assert = require('node:assert');
const fixtureName = '1997805.png';

import('package').then(({ default: saf }) => {
  try {
    const res = saf();  
    const vals = Object.values(res);
    const inlineImage = vals[1];
  
    const fixture = fs.readFileSync('./test-fixture.txt');

    inlineImage({
      getValue: () => `./${fixtureName}`
    }, {
      getValue: () => null
    }, data => {
      const result = util.inspect(data);
      assert.equal(result, fixture, `Expected ${fixtureName} to equal fixture`);
      console.log('OK');
    });
  }
  catch(e) {
    console.error(e);
    throw e;
  }
});