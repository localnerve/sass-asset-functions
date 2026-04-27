/**
 * Test driver.
 * 
 * Copyright (c) 2023-2025 Alex Grant (@localnerve), LocalNerve LLC
 * Licensed under the MIT license.
 */
import assert from 'node:assert';
import { describe, test } from 'node:test';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as defaultSass from 'sass';
import { default as assetFunctions } from '../index.js';

const thisDir = import.meta.dirname;
const sassDir = path.join(thisDir, 'scss');
const cssDir = path.join(thisDir, 'css');
const errDir = path.join(thisDir, 'err');
const files = fs.readdirSync(sassDir);

function assignBasicOpts (options) {
  options.images_path = `${thisDir}/images`;
  options.fonts_path = `${thisDir}/fonts`;
  options.data = {
    one: {
      two: 'Hello World',
      three: true,
      bool: false,
      four: [0,1,2,3],
      five: {
        one: 'one',
        two: 'two'
      },
      set: new Set(['junk', 10]),
      map: new Map([['key0', 'value0'], ['key1', 20]])
    },
    'kebab-name-style': 'works-and-is-ok',
    'image-name': 'barney.gif'
  };
}

function render (file, options = {}) {
  const { sass = defaultSass, testdir = 'scss' } = options;

  if (!sass.render) {
    return Promise.resolve('skip');
  }

  return new Promise((resolve, reject) => {
    return sass.render({
      functions: assetFunctions(options),
      file: `${thisDir}/${testdir}/${file}` // dart-sass will not find w/o jest testEnvironment 'node'
    }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

function compile (file, options = {}) {
  const { sass = defaultSass, testdir = 'scss' } = options;

  if (!sass.compile || options.async) {
    return Promise.resolve('skip');
  }

  return new Promise((resolve, reject) => {
    try {
      const result = sass.compile(`${thisDir}/${testdir}/${file}`, {
        functions: assetFunctions(options)
      });
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

function compileAsync (file, options = {}) {
  const { sass = defaultSass, testdir = 'scss' } = options;

  if (!sass.compileAsync) {
    return Promise.resolve('skip');
  }

  return sass.compileAsync(`${thisDir}/${testdir}/${file}`, {
    functions: assetFunctions(options)
  });
}

function checkCompileResult (file, suite, result) {
  if (result === 'skip') {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {  
    try {
      const cssPath = path.join(cssDir, suite, file.replace(/\.scss$/, '.css'));
      fs.readFile(cssPath, (err, expected) => {
        if (err) {
          throw err;
        }

        const rendered = result.css.toString();
        const raw = expected.toString();      

        // Output style differences between node-sass and dart-sass, spacing and quotes '|".
        // For output equality comparison, strip quotes and spaces.
        const stripRendered = rendered.replace(/\s+|"|'/g, '');
        const stripRaw = raw.replace(/\s+|"|'/g, '');

        assert.strictEqual(stripRendered, stripRaw);
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
}

async function equalsFileAsync (file, suite, options = {
  checkResult: checkCompileResult
}) {
  let result;
  assignBasicOpts(options);
  
  result = await render(file, { ...options, legacyAPI: true });
  options.checkResult(file, suite, result);

  result = await compile(file, options);
  options.checkResult(file, suite, result);

  result = await compileAsync(file, { ...options, async: true });
  options.checkResult(file, suite, result);
}

function makeErrorInput () {
  return {
    errFiles: fs.readdirSync(errDir),
    errOpts: {
      'image-url.scss': {
        asset_host: 'badhost'
      },
      'image-url2.scss': {
        asset_cache_buster: 'badbuster'
      },
      'font-url.scss': {
        asset_host: 'badhost'
      },
      'font-files.scss': {
        asset_cache_buster: 'badbuster'
      }
    }
  };
}

function asset_host (http_path, done) {
  done('http://example.com');
}

function asset_host_async (http_path, done) {
  let ahost;
  asset_host(http_path, a => ahost = a);
  setTimeout(done, 10, ahost);
}

function asset_cache_buster_query (http_path, real_path, done) {
  done('v=123');
}

function asset_cache_buster_query_async (http_path, real_path, done) {
  let query;
  asset_cache_buster_query(http_path, real_path, q => query = q);
  setTimeout(done, 10, query);
}

function asset_cache_buster_path (http_path, real_path, done) {
  const extname = path.extname(http_path);
  const basename = path.basename(http_path, extname);
  const dirname = path.dirname(http_path);
  
  done({
    path: `${path.join(dirname, `${basename}-v123`)}${extname}`,
    query: null
  });
}

function asset_cache_buster_path_async (http_path, real_path, done) {
  let arg;
  asset_cache_buster_path(http_path, real_path, a => arg = a);
  setTimeout(done, 10, arg);
}

describe('basic', () => {
  for (const file of files) {
    test(file, () => equalsFileAsync(file, 'basic'));
  }
});

describe('err:legacy', () => {
  const input = makeErrorInput();
  for (const file of input.errFiles) {
    test(file, () => {
      assert.rejects(() => {
        const options = input.errOpts[file] || {};
        assignBasicOpts(options);
        options.legacyAPI = true;
        options.testdir = 'err';
        return render(file, options);
      });
    });
  }
});

describe('err:async', () => {
  const input = makeErrorInput();
  for (const file of input.errFiles) {
    test(file, () => {
      assert.rejects(() => {
        const options = input.errOpts[file] || {};
        assignBasicOpts(options);
        options.async = true;
        options.testdir = 'err';
        return compileAsync(file, options);
      });
    });
  }
});

describe('err:compile', () => {
  const input = makeErrorInput();
  for (const file of input.errFiles) {
    test(file, () => {
      assert.rejects(() => {
        const options = input.errOpts[file] || {};
        assignBasicOpts(options);
        options.testdir = 'err';
        return compile(file, options);
      });
    });
  }
});

describe('asset_host', () => {
  for (const file of files) {
    test(file, () => equalsFileAsync(file, 'asset_host', {
      asset_host,
      checkResult: checkCompileResult
    }));
  }
});

describe('asset_host:async', () => {
  for (const file of files) {
    test(file, () => equalsFileAsync(file, 'asset_host', {
      asset_host: asset_host_async,
      async: true,
      checkResult: checkCompileResult
    }));
  }
});

describe('asset_cache_buster', () => {
  describe('using query', () => {
    for (const file of files) {
      test(file, () => equalsFileAsync(file, 'asset_cache_buster/query', {
        asset_cache_buster: asset_cache_buster_query,
        checkResult: checkCompileResult
      }));
    }
  });

  describe('using query:async', () => {
    for (const file of files) {
      test(file, () => equalsFileAsync(file, 'asset_cache_buster/query', {
        asset_cache_buster: asset_cache_buster_query_async,
        checkResult: checkCompileResult,
        async: true
      }));
    }
  });

  describe('using path', () => {
    for (const file of files) {
      test(file, () => equalsFileAsync(file, 'asset_cache_buster/path', {
        asset_cache_buster: asset_cache_buster_path,
        checkResult: checkCompileResult
      }));
    }
  });

  describe('using path:async', () => {
    for (const file of files) {
      test(file, () => equalsFileAsync(file, 'asset_cache_buster/path', {
        asset_cache_buster: asset_cache_buster_path_async,
        checkResult: checkCompileResult,
        async: true
      }));
    }
  });
});