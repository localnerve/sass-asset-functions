# Asset cache buster

The `asset_cache_buster` option receives every asset URL before it is written to CSS and lets you rewrite it — most commonly to append a content hash or version query string so browsers pick up new asset versions.

## Signature

```js
assetFunctions({
  asset_cache_buster: (http_path, real_path, done) => { /* ... */ }
})
```

| parameter | meaning |
| --- | --- |
| `http_path` | The web-facing path built so far, e.g. `/images/hero.webp`. Fragment already stripped. |
| `real_path` | Absolute build-time filesystem path to the asset (query/fragment stripped) — use this to hash actual file contents. |
| `done(value)` | Completes the rewrite with one of the forms below. |

This runs **before** `asset_host`, so the host sees your rewritten path.

## Return semantics (what you pass to `done`)

| You call… | Effect |
| --- | --- |
| `done('v=123')` — a string | The string is set as the **query string** on the existing path: `/images/hero.webp?v=123` |
| `done({ path, query })` — an object | `path` **replaces** the path; `query` sets the query (omit or null to leave none). Use this for content-hashed filenames. |
| `done()` — no argument | The URL is left unmodified. A good signal that the file was not found and you're skipping busting. |

## Synchronous example

```js
const result = sass.compile(scssFilename, {
  functions: assetFunctions({
    asset_cache_buster: (http_path, real_path, done) => {
      done('v=' + process.env.ASSET_VERSION);
    }
  })
});
```

## Asynchronous example — content hash in the filename

Here we include the file's SHA-1 hexdigest in the path using the [`hexdigest`](https://github.com/koenpunt/node-hexdigest) module. `/images/myimage.png` becomes `/images/myimage-8557f1c9b01dd6fd138ba203e6a953df6a222af3.png`.

```js
const sass = require('sass');
const path = require('path');
const hexdigest = require('hexdigest');
const { default: assetFunctions } = require('@localnerve/sass-asset-functions');

await sass.compileAsync(scssFilename, {
  functions: assetFunctions({
    async: true, // required: the callback below is asynchronous
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
          done({ path: path.join(path.dirname(http_path), new_name), query: null });
        }
      });
    }
  })
});
```

A complete runnable version lives in [`examples/cache-busting/`](../examples/cache-busting/):

```sh
node examples/cache-busting/run.js
```

## Notes

- If `asset_cache_buster` is supplied but is not a function, compilation throws `'asset_cache_buster should be a function'`.
- An asynchronous callback **must** be paired with `async: true`, otherwise the sync adapter returns before your `done(...)` runs and you get broken output silently. See [api-modes.md](api-modes.md).
