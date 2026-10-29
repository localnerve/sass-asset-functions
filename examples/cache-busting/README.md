# Example: asynchronous content-hash cache busting

`asset_cache_buster` reads each asset from disk and embeds its SHA-1 digest in
the filename (`hero.svg` → `hero-a1b2c3….svg`). Because the callback performs
I/O, this uses `async: true` with `sass.compileAsync`.

It also shows the "file missing" path: `done()` with no arguments leaves the
URL unmodified.

```sh
node examples/cache-busting/run.js
```

The fixture at `images/hero.svg` is a real (tiny) file so the digest is
computed from actual bytes.
