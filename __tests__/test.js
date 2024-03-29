/**
 * Test driver.
 * 
 * Copyright (c) 2023-2024 Alex Grant (@localnerve), LocalNerve LLC
 * Licensed under the MIT license.
 */
/* eslint-env jest */

import * as fs from 'node:fs';
import * as url from 'node:url';
import * as path from 'node:path';
import * as otherSass from 'node-sass';
import * as defaultSass from 'sass';
import assetFunctions from '../index.js';

const thisDir = url.fileURLToPath(new URL('.', import.meta.url));
const sassDir = path.join(thisDir, 'scss');
const cssDir = path.join(thisDir, 'css');
const errDir = path.join(thisDir, 'err');
const otherSassOpts = { sass: otherSass };
const files = fs.readdirSync(sassDir);

function renderErr (file, options, done) {
  const { sass = defaultSass } = options;

  options.images_path = `${thisDir}/images`;
  options.fonts_path = `${thisDir}/fonts`;

  return sass.render({
    functions: assetFunctions(options),
    file: `${thisDir}/err/${file}`
  }, done);
}

function renderAsync (file, options = {}, done) {
  const { sass = defaultSass } = options;

  options.images_path = `${thisDir}/images`;
  options.fonts_path = `${thisDir}/fonts`;

  return sass.render({
    functions: assetFunctions(options),
    file: `${thisDir}/scss/${file}` // dart-sass will not find w/o jest testEnvironment 'node'
  }, done);
}

function equalsFileAsync (file, suite, options, done) {
  renderAsync(file, options, (err, result) => {
    expect(err).toBeNull();
    if (err) {
      return done(err);
    }

    const cssPath = path.join(cssDir, suite, file.replace(/\.scss$/, '.css'));
    fs.readFile(cssPath, (err, expected) => {
      expect(err).toBeNull();
      if (err) {
        return done(err);
      }

      const rendered = result.css.toString();
      const raw = expected.toString();      
      
      // Output style differences between node-sass and dart-sass, spacing and quotes '|".
      // For output equality comparison, strip quotes and spaces.
      const stripRendered = rendered.replace(/\s+|"|'/g, '');
      const stripRaw = raw.replace(/\s+|"|'/g, '');

      expect(stripRendered).toEqual(stripRaw);
      done();
    });
  });
}

function asset_host (http_path, done) {
  done('http://example.com');
}

function query_asset_cache_buster (http_path, real_path, done) {
  setTimeout(done, 10, 'v=123');
}

function path_asset_cache_buster (http_path, real_path, done) {
  setTimeout(() => {
    const extname = path.extname(http_path);
    const basename = path.basename(http_path, extname);
    const dirname = path.dirname(http_path);
    
    done({
      path: `${path.join(dirname, `${basename}-v123`)}${extname}`,
      query: null
    });
  }, 10);
}

function chain (done, next, err) {
  if (err) {
    return done(err);
  }
  next();
}

describe('basic', function () {
  files.forEach(file => {
    test(file, done => {
      const run = equalsFileAsync.bind(this, file, 'basic');
      const next = chain.bind(this, done, () => {
        run(otherSassOpts, done);
      });
      run({}, next);
    });
  });
});

describe('err', function () {
  const err = fs.readdirSync(errDir);
  const defaultOpts = {};
  const errOpts = {
    'image-url.scss': {
      asset_host: 'badhost'
    },
    'image-url2.scss': {
      asset_cache_buster: 'badbuster'
    }
  };
  err.forEach(file => {
    const options = errOpts[file] || defaultOpts;
    test(file, done => {
      renderErr(file, options, err => {
        expect(err).toBeInstanceOf(Error)
        done();
      });
    });
  })
});

describe('asset_host', function () {
  files.forEach(file => {
    test(file, done => {
      const run = equalsFileAsync.bind(this, file, 'asset_host');
      const opts = { asset_host: asset_host };
      const next = chain.bind(this, done, () => {
        run({
          ...otherSassOpts,
          ...opts
        }, done);
      });
      run(opts, next);
    });
  });
});

describe('asset_cache_buster', function () {
  describe('using query', function () {
    files.forEach(file => {
      test(file, done => {
        const run = equalsFileAsync.bind(this, file, 'asset_cache_buster/query');
        const opts = { asset_cache_buster: query_asset_cache_buster };
        const next = chain.bind(this, done, () => {
          run({
            ...otherSassOpts,
            ...opts
          }, done);          
        });
        run(opts, next);
      });
    });
  });

  describe('using path', function () {
    files.forEach(file => {
      test(file, done => {
        const run = equalsFileAsync.bind(this, file, 'asset_cache_buster/path');
        const opts = { asset_cache_buster: path_asset_cache_buster };
        const next = chain.bind(this, done, () => {
          run({
            ...otherSassOpts,
            ...opts
          }, done);
        });
        run(opts, next);
      });
    });
  });
});
