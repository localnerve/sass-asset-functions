/**
 * Package test functions
 * 
 * Copyright (c) 2023-2024 Alex Grant (@localnerve), LocalNerve LLC
 * Licensed under the MIT license.
 */
const assert = require('node:assert');
const fs = require('node:fs');
const util = require('node:util');
const constants = require('./constants');

function testInline (saf) {
  try {
    const res = saf();  
    const vals = Object.values(res);
    const inlineImage = vals[1];
  
    const fixture = fs.readFileSync(`./${constants.fixtureInlineBasename}`);

    inlineImage({
      getValue: () => `./${constants.fixturePngBasename}`
    }, {
      getValue: () => null
    }, data => {
      const result = util.inspect(data);
      assert.equal(result, fixture,
        `Expected ${
          constants.fixturePngBasename
        } to equal ${
          constants.fixtureInlineBasename
        }`
      );
      console.log('OK');
    });
  }
  catch(e) {
    console.error(e);
    throw e;
  }
}

module.exports = {
  testInline
};
