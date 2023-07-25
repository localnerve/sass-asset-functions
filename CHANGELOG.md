# Sass Asset Functions Change Log

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