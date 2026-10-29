# Options

`sassFunctions(options)` — all options are optional.

| name | type | default | description |
| --- | --- | --- | --- |
| `sass` | Object | dart-sass | A reference to an alternate Sass compiler to use (must expose `types`). See [api-modes.md](api-modes.md) |
| `legacyAPI` | Boolean | `false` | truthy to target the legacy `sass.render` API |
| `async` | Boolean | `false` | truthy to target `sass.compileAsync`. **Required** if `asset_cache_buster` or `asset_host` is asynchronous |
| `images_path` | String | `'public/images'` | Build-time file path to images |
| `fonts_path` | String | `'public/fonts'` | Build-time file path to fonts |
| `http_images_path` | String | `'/images'` | Path to images as seen from the web (nothing to do with http) |
| `http_fonts_path` | String | `'/fonts'` | Path to fonts as seen from the web |
| `asset_cache_buster` | Function | — | `(http_path, real_path, done)` URL rewrite, typically for cache busting. See [asset-cache-buster.md](asset-cache-buster.md) |
| `asset_host` | Function | — | `(http_path, done)` host prefix for asset URLs. See [asset-host.md](asset-host.md) |
| `data` | Object | `{}` | Build-time data referenceable via `lookup()`. See [data-and-lookup.md](data-and-lookup.md) |

## Path options

Two paths are kept deliberately separate:

- **Real path** (`images_path`, `fonts_path`) — where files live at build time. Used for filesystem reads (`image-width`, `image-height`, `inline-image`) and passed to `asset_cache_buster` so you can hash the actual bytes.
- **Http path** (`http_images_path`, `http_fonts_path`) — how assets are addressed from the browser. This is what ends up in compiled CSS.

```js
assetFunctions({
  images_path: 'public/img',   // local directory (build-time)
  http_images_path: '/images'  // path from the browser
})
```

`image-url('logo.png')` then compiles to `url('/images/logo.png')` while `inline-image('logo.png')` reads `public/img/logo.png`.

## URL pipeline

For every `image-url` / `font-url` / `font-files` call the http path is transformed in this fixed order:

1. **Build** the http path by joining `http_<segment>_path` with `$filename`; any fragment (`#…`) is stripped and remembered.
2. **Cache buster** (if supplied) runs with `(http_path, real_path)` and may rewrite the path/query.
3. **Asset host** (if supplied) receives only the (possibly rewritten) http path and resolves it against a host.
4. The remembered fragment is re-appended last.

So cache busting sees the plain web path, and the asset host sees whatever the cache buster produced.

## `asset_cache_buster`

```js
assetFunctions({
  asset_cache_buster: (http_path, real_path, done) => {
    // http_path: e.g. '/images/hero.webp' (no fragment)
    // real_path: absolute build-time path to the file
    done('v=123');            // string → set as query string on the existing path
    // or:
    done({ path: '/images/hero-abc123.webp', query: null }); // object → replace path (and optionally query)
  }
})
```

Full contract, including `done()` with no argument and the async variant, in [asset-cache-buster.md](asset-cache-buster.md). If this function is not a function (or missing when referenced), compilation throws `'asset_cache_buster should be a function'`.

## `asset_host`

```js
assetFunctions({
  asset_host: (http_path, done) => {
    done('https://assets.example.com'); // result: https://assets.example.com/images/hero.webp
  }
})
```

See [asset-host.md](asset-host.md).

## `data`

An object of arbitrary build-time data exposed to stylesheets through `lookup($keys...)`. Typically this is produced by your image-processing or templating steps, which makes the assets — not hand-edited CSS — the source of truth. See [data-and-lookup.md](data-and-lookup.md).
