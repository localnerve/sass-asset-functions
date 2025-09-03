# Sass Asset Functions

> Supplies a set of functions to Sass that keep physical asset location details out of your source code. Allows one to define a cache-busting policy, specify asset hosts by url, and use arbitrary build-time metadata to drive css generation.

![Verify](https://github.com/localnerve/sass-asset-functions/workflows/Verify/badge.svg)
[![npm version](https://badge.fury.io/js/%40localnerve%2Fsass-asset-functions.svg)](https://badge.fury.io/js/%40localnerve%2Fsass-asset-functions)
[![Coverage Status](https://coveralls.io/repos/github/localnerve/sass-asset-functions/badge.svg?branch=master)](https://coveralls.io/github/localnerve/sass-asset-functions?branch=master)

## Overview

This module provides a set of Sass functions that help with asset management in web projects, similar to what Compass provided. You can use functions like `image-url()` instead of plain `url()` and the module will automatically resolve paths correctly based on your build configuration. Further, you can expose arbitrary built-time metadata (typically from image processors) for use in sass to generate image references, dimensions, types, breakpoints, etc.

_This is a sass compiler plugin that uses the [functions](https://sass-lang.com/documentation/js-api/interfaces/options/#functions) option of the sass javascript api. Supports modern and legacy sass javascript api: `render`, `compile`, and `compileAsync`_

## Origin/History

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
- `lookup($keys...)`

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
| `data` | Object | An object of arbitrary data to reference at build-time. Defaults to `(empty)` |

### Advanced Options Quick Links

* **[Asset Cache Buster](#asset_cache_buster-a-function-to-rewrite-the-asset-path):** Modify URLs for cache busting (e.g., adding version numbers)
* **[Asset Host](#asset_host-a-function-which-completes-with-a-string-used-as-asset-host):** Set custom hostnames for assets
* **[Data Lookup](#lookup-a-function-to-use-arbitrary-data-in-sass-stylesheets):** Pass arbitrary data from JavaScript to Sass via the lookup() function

### Examples

You can specify the paths to your resources using the following options (shown with defaults):

```js
{
  images_path: 'public/images', // local directory
  http_images_path: '/images',  // map to web path
  fonts_path: 'public/fonts',   // local directory
  http_fonts_path: '/fonts',    // map to web path
  data: {}                      // build data exposed by *lookup*
}
```

So if your project images reside in `public/img` at build-time instead of `public/images`, you use it as follows:

```js
const sass = require('sass');
const { default: assetFunctions } = require('@localnerve/sass-asset-functions');

const result = sass.compile(scss_filename, {
  functions: assetFunctions({
    images_path: 'public/img',  // the local path to the assets 
    http_images_path: '/images' // the path from the browser to the assets
  })
  [, options...]
});
```

#### `lookup`: a function to use arbitrary data in sass stylesheets

This function retrieves arbitrary build-time data for reference in stylesheet compilation. Could be an asset name, prefix, or could be a whole list or map of things. Here's the list of javascript type mappings (everything else returns SassNull):
  * Boolean => SassBoolean
  * Number => SassNumber
  * String => SassString
  * Array => SassList
  * Set => SassList
  * Object => SassMap
  * Map => SassMap

```js
const result = sass.compile(scss_filename, {
  functions: assetFunctions({
    data: {
      'hero-image-names': {
        big: 'hero-1920x300.webp',
        medium: 'hero-1440x300.webp',
        small: 'hero-1024x300.webp'
      },
      nested: {
        process: true,
        'process-map': {
          one: 'one',
          two: 'two'
        }
      }
    }
  })
});
```

```scss
$hero-images: lookup('hero-image-names');
@each $key, $val in $hero-images {
  .hero-image-#{$key} {
    background-image: image-url($val);
  }
}

$nested-process: lookup('nested', 'process');
$nested-data: lookup('nested', 'process-map');
@if $nested-process {
  @each $key, $val in $nested-data {
    .process-#{$key} {
      content: '#{$val}';
    }
  }
}
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

##### A more advanced example of `asset_cache_buster`:

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

_As of version 7.0.0, node-sass integration is no longer tested_

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## License

* [MIT](LICENSE.md)