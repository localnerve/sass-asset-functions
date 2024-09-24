/**
 * Package test functions
 * 
 * Copyright (c) 2023-2024 Alex Grant (@localnerve), LocalNerve LLC
 * Licensed under the MIT license.
 */
const assert = require('node:assert');
const fs = require('node:fs');
const util = require('node:util');
const sass = require('sass');
const constants = require('./constants');

function testInlineLegacy (saf) {
  try {
    const res = saf({ legacyAPI: true });
    const vals = Object.values(res);
    const inlineImage = vals[1];
  
    const fixture = fs.readFileSync(`./${constants.fixtureLegacyInlineBasename}`);

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
          constants.fixtureLegacyInlineBasename
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

function testInlineModernSync (saf) {
  try {
    const res = saf();
    const vals = Object.values(res);
    const inlineImage = vals[1];
  
    const fixture = fs.readFileSync(`./${constants.fixtureModernInlineBasename}`);

    const data = inlineImage([
      new sass.SassString(`./${constants.fixturePngBasename}`),
      sass.sassNull
    ]);

    const result = util.inspect(data);
    assert.equal(result, fixture,
      `Expected ${
        constants.fixturePngBasename
      } to equal ${
        constants.fixtureModernInlineBasename
      }`
    );
    console.log('OK');
  }
  catch(e) {
    console.error(e);
    throw e;
  }
}

function testInlineModernAsync (saf) {
  try {
    const res = saf({ async: true });
    const vals = Object.values(res);
    const inlineImage = vals[1];
  
    const fixture = fs.readFileSync(`./${constants.fixtureModernInlineBasename}`);

    inlineImage([
      new sass.SassString(`./${constants.fixturePngBasename}`),
      sass.sassNull
    ]).then(data => {
      const result = util.inspect(data);
      assert.equal(result, fixture,
        `Expected ${
          constants.fixturePngBasename
        } to equal ${
          constants.fixtureModernInlineBasename
        }`
      );
      console.log('OK');
    }).catch(err => {
      throw err;
    });
  }
  catch(e) {
    console.error(e);
    throw e;
  }
}

module.exports = {
  testInlineLegacy,
  testInlineModernSync,
  testInlineModernAsync
};
