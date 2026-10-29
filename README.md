# Sass Asset Functions

> Supplies a set of functions to Sass that keep physical asset location details out of your source code. Allows one to define a cache-busting policy, specify asset hosts by url, and use arbitrary build-time metadata to drive css generation.

![Verify](https://github.com/localnerve/sass-asset-functions/workflows/Verify/badge.svg)
[![npm version](https://badge.fury.io/js/%40localnerve%2Fsass-asset-functions.svg)](https://badge.fury.io/js/%40localnerve%2Fsass-asset-functions)
[![Coverage Status](https://coveralls.io/repos/github/localnerve/sass-asset-functions/badge.svg?branch=master)](https://coveralls.io/github/localnerve/sass-asset-functions?branch=master)

## Overview

This module provides a set of Sass functions that help with asset management in web projects, similar to what Compass provided. You can use functions like `image-url()` instead of plain `url()` and the module will automatically resolve paths correctly based on your build configuration. Further, you can expose arbitrary built-time metadata (typically from image processors) for use in sass to generate image references, dimensions, types, breakpoints, etc.

The standout capability is **build-time data driving CSS generation**: other build-time processes — above all image processing, but also HTML templating — hand structured records (image names, sizes, types, densities) to Sass via the `data` option and `lookup()`. A stylesheet loops over those records and emits matching CSS. In traditional web development these image↔CSS mappings are maintained by hand; here the images and their processing pipeline become the single source of truth, and the generated CSS/HTML changes automatically with them. See [docs/data-and-lookup.md](docs/data-and-lookup.md).

_This is a sass compiler plugin that uses the [functions](https://sass-lang.com/documentation/js-api/interfaces/options/#functions) option of the sass javascript api. Supports modern and legacy sass javascript api: `render`, `compile`, and `compileAsync`_

## Origin/History

This module provides some of the asset functions that came with [Compass](http://compass-style.org). Originally a fork of  [node-sass-asset-functions](https://github.com/fetch/node-sass-asset-functions) that was never merged.

## Release Notes

[Changelog](CHANGELOG.md)

## Functions Exposed to Sass

| function | returns |
| --- | --- |
| `image-url($filename: null, $only_path: false)` | `url('…')` string (or bare path with `$only_path`) |
| `image-width($filename: null)` | width in px (reads the file) |
| `image-height($filename: null)` | height in px (reads the file) |
| `font-url($filename: null, $only-path: false)` | `url('…')` string (or bare path with `$only-path`) |
| `font-files($filenames...)` | list of `url('…') format('…')` for `@font-face src` |
| `inline-image($filename: null, $mime-type: null)` | `url('data:…;base64,…')` data URL (reads the file) |
| `lookup($keys...)` | build-time data from the `data` option (Boolean/Number/String/List/Map/Null) |

Full signatures and behavior: [docs/functions.md](docs/functions.md)

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

```scss
.hero {
  background-image: image-url('hero.webp'); // url('/images/hero.webp') with defaults
}
```

## Options

All options are optional — see [docs/options.md](docs/options.md) for the full reference, including the URL pipeline order (path → cache buster → asset host → fragment).

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

* **[Asset Cache Buster](docs/asset-cache-buster.md):** Modify URLs for cache busting (e.g., adding version numbers)
* **[Asset Host](docs/asset-host.md):** Set custom hostnames for assets
* **[Data Lookup](docs/data-and-lookup.md):** Build-time data from image processing and templating driving CSS generation via `lookup()`

## Documentation

Extended documentation lives in [`docs/`](docs/index.md):

- [Installation](docs/installation.md) — install + ESM/CJS wiring
- [API modes](docs/api-modes.md) — legacy vs modern sync/async APIs; when `async: true` is required
- [Functions](docs/functions.md) — all Sass functions, signatures, return types
- [Options](docs/options.md) — full options reference + URL pipeline order
- [Asset cache buster](docs/asset-cache-buster.md) — cache busting contracts + example
- [Asset host](docs/asset-host.md) — asset host contracts + example
- [Data & lookup](docs/data-and-lookup.md) — build-time data driving CSS/HTML generation

Runnable examples live in [`examples/`](examples/) — each subfolder is self-contained and prints its compiled CSS to stdout:

```sh
node examples/basic/run.js
node examples/cache-busting/run.js
node examples/custom-host/run.js
node examples/data-lookup/run.js
```

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## License

* [MIT](LICENSE.md)