# Sass Asset Functions — Documentation

A Sass compiler plugin that exposes asset-management functions to Sass via the `functions` option of the Sass JavaScript API. Stylesheets reference images and fonts by logical name; physical paths, cache-busting queries, asset hosts, and build-time metadata stay in your build configuration instead of your source code.

This is a Sass compiler plugin built on the [functions](https://sass-lang.com/documentation/js-api/interfaces/options/#functions) option of the Sass JavaScript API. It supports the legacy (`render`) and modern (`compile`, `compileAsync`) APIs.

## Documentation map

| Document | Contents |
| --- | --- |
| [installation.md](installation.md) | Installing, wiring into ESM and CJS projects, Node requirements |
| [api-modes.md](api-modes.md) | Legacy vs modern sync/async APIs; when `async: true` is required; using a non-dart-sass compiler |
| [functions.md](functions.md) | All Sass functions: signatures, parameters, return types |
| [options.md](options.md) | Full options reference (paths, API selection, callbacks, data) |
| [asset-cache-buster.md](asset-cache-buster.md) | Cache-busting contract: string vs object returns, async example |
| [asset-host.md](asset-host.md) | Asset host contract and examples |
| [data-and-lookup.md](data-and-lookup.md) | The `data` option and `lookup()` — build-time data driving CSS/HTML generation |

Runnable usage examples live in [`examples/`](../examples/) — each subfolder is self-contained:

```sh
node examples/basic/run.js
node examples/cache-busting/run.js
node examples/custom-host/run.js
node examples/data-lookup/run.js
```

## Why build-time data matters

The `data` option + `lookup()` exist so that *other* build-time processes — above all **image processing**, but also HTML templating — can drive CSS (and HTML) generation directly from Sass. A stylesheet loops over records produced by the build (image names, sizes, types, densities) and emits the corresponding CSS. In traditional web development these image↔CSS mappings are maintained **by hand**; with this capability the images and their processing pipeline become the **single source of truth** — the generated CSS/HTML changes automatically *with* the images and their processing, in cooperation with them. See [data-and-lookup.md](data-and-lookup.md).

## Origin / history

This module provides some of the asset functions that came with [Compass](http://compass-style.org). It is a descendant of [node-sass-asset-functions](https://github.com/fetch/node-sass-asset-functions), originally a fork that was never merged.

## Release notes

[CHANGELOG.md](../CHANGELOG.md)
