# API modes

`sassFunctions(options)` selects one of three adapters based on the `legacyAPI` and `async` options:

| `legacyAPI` | `async` | Adapter | Sass entry point | Callback behavior |
| --- | --- | --- | --- | --- |
| truthy | *(ignored)* | legacy | `sass.render()` | synchronous, via `done(...)` |
| falsy | falsy | modern sync | `sass.compile()` | synchronous, return value |
| falsy | truthy | modern async | `sass.compileAsync()` | callbacks may be asynchronous |

All three adapters register the **same seven Sass signatures** — you can write stylesheets identically regardless of mode:

```
image-url($filename, $only_path: false)
image-width($filename)
image-height($filename)
font-url($filename, $only-path: false)
font-files($filenames...)
inline-image($filename, $mime_type: null)
lookup($keys...)
```

## Choosing a mode

### Modern sync (default) — recommended

```js
const result = sass.compile(scssFilename, {
  functions: assetFunctions({
    images_path: 'public/images',
    http_images_path: '/images'
  })
});
```

Use this whenever your `asset_cache_buster` and `asset_host` callbacks are **synchronous**. It is the fastest path and works with any modern Sass compiler.

### Modern async — required for asynchronous callbacks

If your `asset_cache_buster` or `asset_host` performs I/O (reading files, hashing, network), set `async: true` and compile with `sass.compileAsync`:

```js
const result = await sass.compileAsync(scssFilename, {
  functions: assetFunctions({
    async: true,
    asset_cache_buster: (http_path, real_path, done) => {
      fs.readFile(real_path, (err, buf) => {
        if (err) return done(); // leave URL unmodified
        done('v=' + crypto.createHash('sha1').update(buf).digest('hex').slice(0, 8));
      });
    }
  })
});
```

**Warning:** forgetting `async: true` with an asynchronous callback does not throw — it produces broken output silently (the sync adapter returns before the callback has completed). Always pair async callbacks with `async: true`.

### Legacy API

For compilers or build tooling that still use `sass.render`:

```js
sass.render({
  file: scssFilename,
  functions: assetFunctions({ legacyAPI: true })
}, (err, result) => { /* ... */ });
```

The legacy adapter uses the old `sass.types.*` value objects and the callback (`done`) calling convention; from Sass's perspective the functions behave identically.

## Using a non-dart-sass compiler

Pass the compiler module via the `sass` option — it is used for constructing return values (it must expose `types`, or the modern type constructors):

```js
const mySass = require('some-sass-compiler');

const result = sass.compile(scssFilename, {
  functions: assetFunctions({ sass: mySass })
});
```

Node-Sass integration is **no longer tested** as of version 7.0.0.
