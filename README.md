# Sass Asset Functions

> Supplies a set of functions to Sass that keep physical asset location details out of your source code. Also allows one to define a cache-busting policy or specify asset hosts by url.

![Verify](https://github.com/localnerve/sass-asset-functions/workflows/Verify/badge.svg)
[![npm version](https://badge.fury.io/js/%40localnerve%2Fsass-asset-functions.svg)](https://badge.fury.io/js/%40localnerve%2Fsass-asset-functions)
[![Coverage Status](https://coveralls.io/repos/github/localnerve/sass-asset-functions/badge.svg?branch=master)](https://coveralls.io/github/localnerve/sass-asset-functions?branch=master)

This module supplies functions to a Sass compiler which can be called from your Sass code.
For example, the `image-url` used here in place of `url` adds build-time configuration to resolve the file to the proper location as seen from the web:

```css
.some-selector {
  background-image: image-url('cat.jpg');
}
```

_**NB** Please note that the `functions` option of dart-sass/node-sass is still experimental (>= v3.0.0)._

## Origin

This module provides some of the asset functions that came with [Compass](http://compass-style.org). Originally a fork of  [node-sass-asset-functions](https://github.com/fetch/node-sass-asset-functions) that was never merged.

## Release Notes

[Changelog](CHANGELOG.md)

## Functions Exposed to Sass

- `image-url($filename: null, $only_path: false)`
- `image-width($filename: null)`
- `image-height($filename: null)`
- `font-url($filename: null, $only-path: false)`
- `font-files($filenames...)`
- `inline-image($filename: null, $mime-type: null)`

## Usage

Basic usage is as easy as setting the `functions` property:

```js
// non-module, require usage
const sass = require('sass');
const { default: assetFunctions } = require('@localnerve/sass-asset-functions');

const result = sass.compile(scss_filename, {
  functions: assetFunctions(/* options */)
  [, options...]
});
```

```js
// module usage
import sass from 'sass';
import assetFunctions from '@localnerve/sass-asset-functions';

const result = sass.compile(scss_filename, {
  functions: assetFunctions(/* options */)
  [, options...]
});
```

## Options

All options are optional.

| name | type | description |
| --- | --- | --- |
| `sass` | Object | A reference to an alternate Sass compiler to use other than dart-sass (must expose `types`). Defaults to `undefined` and a dart-sass reference is used |
| `legacyAPI` | Boolean | truthy to use the legacy sass API via the sass `render` function. Defaults to `false` |
| `async` | Boolean | truthy to use modern sass API via the `compileAsync` function. Required if supplied `asset_cache_buster` or `asset_host` function options are asynchronous. Defaults to `false` |
| `images_path` | String | The build-time file path to images. Defaults to `public/images` |
| `fonts_path` | String | The build-time file path to fonts. Defaults to `public/fonts` |
| `http_images_path` | String | The path to images as seen from the web (nothing to do with http). Defaults to `/images` |
| `http_fonts_path` | String | The path to images as seen from the web (nothing to do with http). Defaults to `/fonts` |
| `asset_cache_buster` | Function | Signature (http_path, real_path, callback(new_url)). Supply to perform url transform for `image-url` or `font-url`, presumably for asset cache busting, but useful for any change to the url path (before fragment) |
| `asset_host` | Function | Signature (http_path, callback(new_url)). Supply to perform url transform for `image-url` or `font-url`, presumably to define an asset host, but useful for any change to the url before the path |

### Examples

You can specify the paths to your resources using the following options (shown with defaults):

```js
{
  images_path: 'public/images', // local directory
  fonts_path: 'public/fonts',
  http_images_path: '/images', // web path
  http_fonts_path: '/fonts'
}
```

So if your project images reside in `public/img` at build-time instead of `public/images`, you use it as follows:

```js
const sass = require('sass');
const { default: assetFunctions } = require('@localnerve/sass-asset-functions');

const result = sass.compile(scss_filename, {
  functions: assetFunctions({
    images_path: 'public/img',
    http_images_path: '/images'
  })
  [, options...]
});
```

#### `sass`: Overriding the default compiler with Node-Sass

Example using the node-sass compiler using the new option `sass`.

```js
const sass = require('node-sass');
const { default: assetFunctions } = require('@localnerve/sass-asset-functions');

const result = sass.compile(scss_filename, {
  functions: assetFunctions({ sass })
  [, options...]
});
```

#### `asset_host`: a function which completes with a string used as asset host.

```js
const result = sass.compile(scss_filename, {
  functions: assetFunctions({
    asset_host: (http_path, done) => {
      done('http://assets.example.com');
      // or use the supplied path to calculate a host
      done(`http://assets${http_path.length % 4}.example.com`);
    }
  })
  [, options...]
});
```

#### `asset_cache_buster`: a function to rewrite the asset path

When this function returns a string, it's set as the query of the path. When returned an object, `path` and `query` will be used.

```js
const result = sass.compile(scss_filename, {
  functions: assetFunctions({
    asset_cache_buster: (http_path, real_path, done) => {
      done('v=123');
    }
  })
  [, options...]
});
```

##### A more advanced example:

Here we include the file's  hexdigest in the path, using the [`hexdigest`](https://github.com/koenpunt/node-hexdigest) module.

For example, `/images/myimage.png` would become `/images/myimage-8557f1c9b01dd6fd138ba203e6a953df6a222af3.png`.

```js
const sass = require('sass');
const path = require('path');
const fs = require('fs');
const hexdigest = require('hexdigest');
const { default: assetFunctions } = require('@localnerve/sass-asset-functions');

const result = sass.compileAsync(scss_filename, {
  functions: assetFunctions({
    async: true,
    asset_cache_buster: (http_path, real_path, done) => {
      hexdigest(real_path, 'sha1', (err, digest) => {
        if (err) {
          // an error occurred, maybe the file doesn't exist.
          // Calling `done` without arguments will result in an unmodified path.
          done();
        } else {
          const extname = path.extname(http_path);
          const basename = path.basename(http_path, extname);
          const new_name = `${basename}-${digest}${extname}`;
          done({path: path.join(path.dirname(http_path), new_name), query: null});
        }
      });
    }
  })
  [, options...]
});
```

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
