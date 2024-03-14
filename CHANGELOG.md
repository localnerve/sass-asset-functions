# Sass Asset Functions Change Log

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