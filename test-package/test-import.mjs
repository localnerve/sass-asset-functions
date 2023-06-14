import fs from 'node:fs';
import util from 'node:util';
import assert from 'node:assert';
import saf from 'package';

const fixtureName = '1997805.png';

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
catch (e) {
  console.error(e);
  throw e;
}
