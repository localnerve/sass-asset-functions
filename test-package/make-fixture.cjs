const fs = require('node:fs');
const util = require('node:util');
const { default: saf } = require('package');
const fixtureName = '1997805';

try {
  const res = saf();
  const vals = Object.values(res);
  const inlineImage = vals[1];

  inlineImage({
    getValue: () => `./${fixtureName}.png`
  }, {
    getValue: () => null
  }, data => {
    fs.writeFileSync('./test-fixture.txt', util.inspect(data));
    console.log('OK');
  });
}
catch(e) {
  console.error(e);
}