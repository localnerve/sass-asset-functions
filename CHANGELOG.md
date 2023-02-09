# Sass Asset Functions Change Log

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