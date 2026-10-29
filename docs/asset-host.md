# Asset host

The `asset_host` option prefixes asset URLs with a host — typically a CDN or dedicated static-asset domain — so compiled CSS can reference assets on a different origin than the page.

## Signature

```js
assetFunctions({
  asset_host: (http_path, done) => { /* ... */ }
})
```

| parameter | meaning |
| --- | --- |
| `http_path` | The web-facing path as it stands after any cache-busting rewrite, e.g. `/images/hero.webp?v=123`. |
| `done(host)` | Completes with a host (absolute or relative URL) that the path is resolved against. |

The final URL is computed by resolving `http_path` against your returned host, so queries and fragments survive:

- `done('https://assets.example.com')` + `/images/hero.webp?v=123` → `https://assets.example.com/images/hero.webp?v=123`
- Relative hosts work too — e.g. `done('/static')` produces `/static/images/hero.webp`.

This runs **after** `asset_cache_buster`, so busting sees the plain path and the host wraps whatever it produced.

## Examples

Fixed CDN:

```js
const result = sass.compile(scssFilename, {
  functions: assetFunctions({
    asset_host: (http_path, done) => {
      done('https://assets.example.com');
    }
  })
});
```

Host chosen from the path (e.g. sharded CDN hosts):

```js
assetFunctions({
  asset_host: (http_path, done) => {
    done(`https://assets${http_path.length % 4}.example.com`);
  }
})
```

A complete runnable version lives in [`examples/custom-host/`](../examples/custom-host/):

```sh
node examples/custom-host/run.js
```

## Notes

- If `asset_host` is supplied but is not a function, compilation throws `'asset_host should be a function'`.
- An asynchronous callback **must** be paired with `async: true`. See [api-modes.md](api-modes.md).
