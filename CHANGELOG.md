# Sass Asset Functions Change Log

## 6.10.0
  * added `lookup` function, arbitrary `data` option

## 6.9.0
  * sass 1.86.0
  * image-size 2.0.1

## 6.8.0
  * sass 1.85.1
  * image-size 2.0.0, add heif, tiff64, bigtiff support

## 6.7.0
  * sass 1.85.0

## 6.6.0
  * sass 1.84.0

## 6.5.3
  * sass 1.83.4

## 6.5.2
  * license date update

## 6.5.1
  * sass 1.83.1

## 6.5.0
  * image-size 1.2.0, add jpeg-xl support

## 6.4.0
  * sass 1.83.0

## 6.3.0
  * sass 1.82.0

## 6.2.1
  * sass 1.81.1

## 6.2.0
  * sass 1.81.0

## 6.1.6
  * sass 1.80.7

## 6.1.5
  * sass 1.80.6

## 6.1.4
  * sass 1.80.5

## 6.1.3
  * sass 1.80.4

## 6.1.2
  * sass 1.80.3

## 6.1.1
  * sass 1.80.2

## 6.1.0
  * sass 1.80.1
  
## 6.0.3
  * sass 1.79.5
  * development dependencies updates

## 6.0.2
  * sass 1.79.4
  * add build/publish provenance

## 6.0.1
  * bug fix, quoted results

## 6.0.0
  * sass 1.79.3
  * BREAKING CHANGES:
  * Default supports new JS API (synchronous dartSass.compile).
  * Asynchronous modern JS API (dartSass.compileAsync) available via `async` option.  
    * Required if supplied function options (asset_host, asset_cache_buster, etc) are asynchronous AND/OR you are directly calling dartSass.compileAsync.  
  * Sass Legacy JS API, the default of this lib thru version sass-asset-functions@5, used by nodeSass/dartSass.render, available ONLY via `legacyAPI` option. This will be dropped at dart-sass@2.0.0.
  * Dropped explicit support for old node-sass, although it still works thru node 20, for now.
  * To get the old behavior, you have to supply `{ legacyAPI: true }` in the options.
    * To use with `gulp-sass@5` you must set this option.

## 5.2.1
  * sass 1.79.2

## 5.2.0
  * sass 1.79.0

## 5.1.0
  * sass 1.78.0
  * Development dependency updates, development node 20+

## 5.0.3
  * Development dependency updates

## 5.0.2
  * sass 1.77.8

## 5.0.1
  * sass 1.77.7

## 5.0.0
  * node 18+
  * sass 1.77.6
  * eslint 9+

## 4.14.0
  * sass 1.77.1

## 4.13.0
  * sass 1.76.0

## 4.12.0
  * sass 1.75.0

## 4.11.0
  * sass 1.74.1
  * Development dependency updates

## 4.10.0
  * sass 1.72.0
  * Development dependency updates

## 4.9.1
  * sass 1.71.1
  * Development dependency updates

## 4.9.0
  * sass 1.71.0
  * Development dependency updates

## 4.8.0
  * sass 1.70.0
  * Development dependency update

## 4.7.2
  * sass 1.69.7
  * image-size 1.1.1
  * Development dependency updates
  * copyright date update

## 4.7.1
  * sass 1.69.6

## 4.7.0
  * sass 1.69.5
  * dependency change: mime => mime-types@2.1.35
  * image-size@1.1.0
  * Increase coverage, inline-image synchronous readFile to fix error reporting
  * Development dependency updates

## 4.6.2
  * sass 1.69.5
  * Development dependency updates

## 4.6.1
  * sass 1.69.4
  * Development dependency updates

## 4.6.0
  * sass 1.69.3
  * Development dependency updates

## 4.5.0
  * sass 1.68.0
  * Development dependency updates

## 4.4.0
  * sass 1.67.0
  * Development dependency updates
  * Rename and update package testing suite

## 4.3.0
  * sass 1.66.1
  * Development dependency updates

## 4.2.0
  * sass 1.64.1
  * Development dependency updates

## 4.1.3
  * Development dependency updates

## 4.1.2
  * sass 1.63.6

## 4.1.1
  * Package test code cleanup

## 4.1.0
  * sass 1.63.4
  * Fix esm loading after unexpected sass api change
  * Add module loading package tests
  * Dev dependencies updates

## 4.0.0
  * Node 16+ (Drop Node 14 Support)
  * Dev dependencies updates

## 3.2.0
  * Dependency Update
  * sass 1.62.1

## 3.1.0
  * Dependency Update
  * sass 1.60.0

## 3.0.0
* **Breaking Change**
> ESM require support now requires destructuring `default` export.
```js
const { default: assetFunctions } = require('@localnerve/sass-asset-functions');
// or
const assetFunctions = require('@localnerve/sass-asset-functions').default;
```
* Dependency Update
* Full ESM module with cjs support

## 2.0.0
* Support Node 14+, update dependencies.
* Dropped support for Node 12.

## 1.0.0
* Dependency Update
* Dropped support for Node 10.