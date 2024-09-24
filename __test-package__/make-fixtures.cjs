const fs = require('node:fs');
const util = require('node:util');
const sass = require('sass');
const constants = require('./constants');
const { default: saf } = require('package');

function generateLegacyFixture () {
  try {
    const res = saf({ legacyAPI: true });
    const vals = Object.values(res);
    const inlineImage = vals[1];

    inlineImage({
      getValue: () => `./${constants.fixturePngBasename}`
    }, {
      getValue: () => null
    }, data => {
      fs.writeFileSync(`./${constants.fixtureLegacyInlineBasename}`, util.inspect(data));
      console.log('OK');
    });
  }
  catch(e) {
    console.error(e);
  }
}

function generateModernFixture () {
  try {
    const res = saf();
    const vals = Object.values(res);
    const inlineImage = vals[1];

    const data = inlineImage([
      new sass.SassString(`./${constants.fixturePngBasename}`),
      sass.sassNull
    ]);
    fs.writeFileSync(`./${constants.fixtureModernInlineBasename}`, util.inspect(data));
    console.log('OK');
  }
  catch(e) {
    console.error(e);
  }
}

generateLegacyFixture();
generateModernFixture();