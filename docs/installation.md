# Installation

## Requirements

- Node.js >= 20
- The [Sass JavaScript API](https://sass-lang.com/documentation/js-api) (dart-sass is the default compiler; see [api-modes.md](api-modes.md) for alternatives)

## Install

```sh
npm install @localnerve/sass-asset-functions
```

The package is ESM-first (`"type": "module"`) but ships a Babel-transpiled CJS build, so both `import` and `require` work:

| `exports` condition | Served file |
| --- | --- |
| `import` | `./index.js` (ESM source) |
| `require` | `./cjs/index.cjs` (transpiled CJS) |

## Wiring it in

The default export is a factory: `sassFunctions(options)` returns the `functions` object you pass to the Sass compiler. All options are optional — see [options.md](options.md).

### ESM

```js
import sass from 'sass';
import assetFunctions from '@localnerve/sass-asset-functions';

const result = sass.compile(scssFilename, {
  functions: assetFunctions(/* options */)
});
```

### CommonJS

```js
const sass = require('sass');
const { default: assetFunctions } = require('@localnerve/sass-asset-functions');

const result = sass.compile(scssFilename, {
  functions: assetFunctions(/* options */)
});
```

## Minimal Sass usage

```scss
.hero {
  background-image: image-url('hero.webp');
}
```

With default options this compiles to `background-image: url('/images/hero.webp')`. The file does **not** need to exist for URL functions — only `image-width`, `image-height`, and `inline-image` read from disk.
