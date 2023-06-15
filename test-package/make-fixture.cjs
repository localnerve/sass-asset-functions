const fs = require('node:fs');
const util = require('node:util');
const constants = require('./constants');
const { default: saf } = require('package');

try {
  const res = saf();
  const vals = Object.values(res);
  const inlineImage = vals[1];

  inlineImage({
    getValue: () => `./${constants.fixturePngBasename}`
  }, {
    getValue: () => null
  }, data => {
    fs.writeFileSync(`./${constants.fixtureInlineBasename}`, util.inspect(data));
    console.log('OK');
  });
}
catch(e) {
  console.error(e);
}