# AGENTS.md — sass-asset-functions

Guidance for AI agents (and humans) working in this repository.

## What this library is

A Sass compiler plugin that exposes asset-management functions to Sass via the `functions` option of the Sass JavaScript API. It lets stylesheets reference images/fonts by logical name and keeps physical paths, cache-busting queries, and asset hosts out of source code.

**Why build-time data matters here:** the `data` option + `lookup()` function exist so that *other* build-time processes — above all **image processing**, but also HTML templating — can drive CSS (and HTML) generation directly from Sass. A stylesheet loops over records produced by the build (image names, sizes, types, densities) and emits the corresponding CSS. In traditional web development these image↔CSS mappings are maintained **by hand**; with this capability the images and their processing pipeline become the **single source of truth** — the generated CSS/HTML changes automatically *with* the images and their processing, in cooperation with them. When documenting or demoing `data`/`lookup`, frame it as this build-pipeline collaboration, not merely "arbitrary JS data exposed to Sass".

- Package: `@localnerve/sass-asset-functions`
- ESM-first (`"type": "module"`), with a Babel-transpiled CJS build under `cjs/`.
- Node >= 20. Depends on `sass`, `immutable`, `mime-types`, `@localnerve/image-size`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm test` | Runs unit tests **and** the published-package smoke test |
| `npm run test:unit` | `node --test` against `__tests__/test.js` (also writes `coverage/lcov.info`) |
| `npm run test:package` | Builds a tarball and exercises require/import from it (`__test-package__/`) |
| `npm run lint` | ESLint (`eslint.config.js`, includes `eslint-plugin-n`) |
| `npm run transpile` | Regenerates `cjs/` from `index.js` + `lib/` via Babel (runs automatically on `prepublishOnly`) |

There is no build step for the published ESM entry — `index.js` and `lib/` are the source of truth.

## Repository layout

```
index.js            Public ESM entry: sassFunctions(options) -> functions object
cjs/                Babel output (index.cjs + lib/*.cjs). DO NOT EDIT BY HAND.
lib/
  processor.js      Core logic: path resolution, URL pipeline, all function bodies
  types.js          JS value -> Sass type conversion (used by lookup / modern APIs)
  legacyAPI.js      Adapter for sass.render (legacy API)
  modernAPISync.js  Adapter for sass.compile (modern sync API)
  modernAPIAsync.js Adapter for sass.compileAsync (modern async API)
__tests__/
  test.js           Fixture-driven test driver (node:test)
  scss/*.scss       Test inputs, one file per Sass function
  css/<suite>/      Expected compiled output; suites: basic, asset_host, asset_cache_buster/{path,query}
  err/*.scss        Inputs that must throw; paired with options in makeErrorInput()
  images/           Real image fixtures (needed for image-width/-height/inline-image)
__test-package__/   Smoke test of the packed tarball (CJS + ESM require/import)
.npmignore          Blacklist — everything else (incl. AGENTS.md, docs/, examples/) ships in the package
docs/               Extended documentation (see docs/index.md); published with the package
examples/           Runnable per-example usage scripts; each prints compiled CSS to stdout
```

## Invariants an agent must know before editing

1. **Every Sass function signature is registered in three adapters** (`legacyAPI.js`, `modernAPISync.js`, `modernAPIAsync.js`) and its body lives once in `lib/processor.js`. Any signature or behavior change must be applied consistently to all four files, plus the test fixtures.
2. **Signature naming quirk — do not "fix" it:** `image-url` uses `$only_path` (underscore) but `font-url` is registered as `font-url($filename, $only-path: false)` (hyphen). Both forms are accepted by dart-sass; the fixtures and README document both. Changing one without the other breaks callers.
3. **URL pipeline order in `processor.asset_url`:** build http path → strip/remember fragment → run `asset_cache_buster` (if set) → run `asset_host` (if set) → re-append fragment. Cache buster gets `(http_path, real_path)`; asset host only gets the (possibly rewritten) http path.
4. **Cache buster return semantics:** returning a *string* sets it as the query string on the existing path; returning an *object* `{path, query}` replaces the path and optionally the query. Passing `done()` with no argument leaves the URL unmodified.
5. **Path resolution:** `real_path` = `path.resolve(<images_path|fonts_path>, filename)` (query/fragment stripped); `http_path` = `path.join(<http_images_path|http_fonts_path>, filename)` with backslashes normalized to `/`. Only `image-width`, `image-height`, and `inline-image` touch the filesystem; the URL functions do not require files to exist.
6. **Sync vs async:** the sync/legacy adapters call `done(...)` callbacks synchronously. If a user-supplied `asset_cache_buster` or `asset_host` is asynchronous, callers must set `async: true` (uses `compileAsync`). Forgetting this produces broken output rather than an error.
7. **ESM source, CJS via Babel:** edit `index.js`/`lib/*.js`, then run `npm run transpile` to refresh `cjs/`. Never hand-edit `cjs/`. The package `exports` map serves `import` → `./index.js`, `require` → `./cjs/index.cjs`.
8. **Errors:** processor functions throw (with `cause` for read failures) rather than calling back with errors; a non-function `asset_cache_buster`/`asset_host` throws `'... should be a function'`. Error cases are covered by `__tests__/err/`.
9. **Sass language gotcha — no `$map['key']` index operator:** dart-sass has *no* bracket-index syntax for maps; it is an error in **all** positions (selectors, declarations, interpolation). When writing fixtures or examples that read values from a map produced by `lookup()`, use `map-get($m, 'key')` (or modern `map.get()`). Verified against sass 1.107.x with maps independent of this library. Also: `@debug EXPR` prints the *source* of unevaluated expressions, which misleads when debugging — assign to a variable or serialize into CSS instead.
10. **Docs ship in the published package:** `.npmignore` is a blacklist, so `AGENTS.md`, `docs/`, and `examples/` are intentionally included in the tarball (consumer-side agents read them from `node_modules`). `__test-package__/index.js` (`verifyShippedDocs`) asserts they are present after `npm pack`. If you switch to a `files` allowlist, keep them listed.

## Adding or changing a Sass function (recipe)

1. Add the body in `lib/processor.js` (follow existing `done(callback)` style).
2. Register the signature in **all three** adapters with correct Sass type assertions (`assertString`, `assertBoolean`, etc.) and return types (see `types.js` for JS→Sass conversion).
3. Add fixtures: `__tests__/scss/<name>.scss`, expected CSS under each suite in `__tests__/css/`, and if it can fail, an `__tests__/err/<name>.scss` plus its options entry in `makeErrorInput()`.
4. Update the function list in `README.md` and `docs/functions.md` in the same pass as the code.
5. Run `npm test`; then bump version and commit with the repo's message style: `@<version> - <summary>` (see `CHANGELOG.md`).

## Conventions

- JSDoc + typedef style "all the way down" for any TypeScript-adjacent surface; keep header comments (copyright/license) consistent with existing files.
- Tests are small and fixture-driven — extend the fixtures rather than writing standalone assertion-heavy tests.
- Docs must stay current with any surface change: `README.md` landing page + `docs/` pages are updated in the same commit as code.
- Commit messages: `@<version> - <summary>` (e.g. `@7.20.0 - sass@1.107.0`).

## Documentation map

For full documentation, start at [docs/index.md](docs/index.md):

- [docs/installation.md](docs/installation.md) — install + ESM/CJS wiring
- [docs/api-modes.md](docs/api-modes.md) — legacy vs modern sync/async APIs
- [docs/functions.md](docs/functions.md) — all Sass functions, signatures, return types
- [docs/options.md](docs/options.md) — full options reference
- [docs/asset-cache-buster.md](docs/asset-cache-buster.md) — cache busting contracts + example
- [docs/asset-host.md](docs/asset-host.md) — asset host contracts + example
- [docs/data-and-lookup.md](docs/data-and-lookup.md) — the `data` option and `lookup()` type mapping

Runnable examples live in `examples/` — each subfolder is self-contained and prints its compiled CSS to stdout:

```
node examples/basic/run.js
node examples/cache-busting/run.js
node examples/custom-host/run.js
node examples/data-lookup/run.js
```
