# Data & lookup — build-time data driving CSS and HTML

## The point of this feature

In traditional web development, the mappings between your assets and your stylesheets are maintained **by hand**: someone edits a stylesheet to add a new hero image, remembers its dimensions, writes a breakpoint for it. Those mappings drift out of sync with the assets themselves.

The `data` option + `lookup()` function remove that manual step. They let *other* build-time processes — above all **image processing**, but also HTML templating — hand structured records to the Sass compiler so it can generate CSS (and inform HTML templates) directly from the data:

```
images  ──▶  image-processing step  ──▶  data { images: [ {name, width, height, type, density}, … ] }
                                                 │
                        ┌────────────────────────┴───────────────────────┐
                        ▼                                               ▼
              Sass loops over the records                      HTML templates loop over
              and emits the matching CSS                       the same records
```

The images and their processing pipeline become the **single source of truth**: add, replace, or re-process an image and the generated CSS/HTML changes *with* it, in cooperation with it — no stylesheet edits required.

## The `data` option

Pass any JavaScript object as build-time data:

```js
const result = sass.compile(scssFilename, {
  functions: assetFunctions({
    data: {
      // e.g. produced by your image-processing step
      images: [
        { name: 'hero-1920x300.webp', width: 1920, height: 300, type: 'webp', density: 2 },
        { name: 'hero-1440x300.webp', width: 1440, height: 300, type: 'webp', density: 2 },
        { name: 'hero-1024x300.webp', width: 1024, height: 300, type: 'webp', density: 1 }
      ]
    }
  })
});
```

In practice you build this object from whatever your pipeline produces — a manifest written out by your image processor, the output of an HTML templating pass, anything computed at build time. The library does not care where it comes from; it only exposes it to Sass.

## `lookup($keys...)` in stylesheets

Walk the data with one or more keys:

```scss
// Loop over the processed images and emit a rule per image —
// this CSS could never drift out of sync with the images.
//
// Gotcha: read map values with map-get() — Sass has no $map['key'] index
// operator (it is an error in all positions on current dart-sass).
@each $img in lookup('images') {
  $name: map-get($img, 'name');
  .hero-#{$name} {
    background-image: image-url(map-get($img, 'name'));
    width: map-get($img, 'width') * 1px;   // real numbers from the data (unitless → append px)
    min-height: map-get($img, 'height') * 1px;
  }
}

// Density-driven source sets, straight from the processing step.
// Build a list of `url density` pairs and emit it however your template needs —
// e.g. as an attribute value in generated HTML.
$hero-sources: ();
@each $img in lookup('images') {
  $hero-sources: append($hero-sources, unquote(image-url(map-get($img, 'name'), true) + ' ' + map-get($img, 'density') + 'x'), comma);
}
// $hero-sources == /images/hero-1920x300.webp 2x, /images/hero-1440x300.webp 2x, /images/hero-1024x300.png 1x
```

> **Note on the gotcha:** Sass simply has no `$map['key']` index operator — `map.get()`/`map-get()` is *the* way to read map values, for built-in maps and looked-up records alike. It is also documented under [`lookup`](functions.md#lookupkeys--boolean--number--string--list--map--null).

// Nested access with multiple keys
$nested-process: lookup('nested', 'process');       // true
$nested-data:    lookup('nested', 'process-map');   // (one two)
@if $nested-process {
  @each $key, $val in $nested-data {
    .process-#{$key} { content: '#{$val}'; }
  }
}

// Missing keys resolve to null — safe to test
@if lookup('images', 'missing') == null { /* fallback */ }
```

The same records that drive CSS can be handed to your HTML templating step, so markup and stylesheets are generated from one shared source. That is the collaboration this feature exists for: **assets + processing → CSS + HTML**, changing together.

## JavaScript → Sass type mapping

`lookup()` converts the resolved value recursively:

| JavaScript | Sass |
| --- | --- |
| `Boolean` | Boolean |
| `Number` | Number (unitless) |
| `String` | String (unquoted) |
| `Array` | List |
| `Set` | List |
| `Object` | Map |
| `Map` | Map |
| anything else (`null`, `undefined`, `BigInt`, functions, symbols…) | Null |

Notes:

- Numbers arrive **unitless** — append units in Sass when needed (e.g. `map-get($img, 'width') * 1px`).
- Map keys are stringified from their JavaScript form; kebab-case object keys work fine (`lookup('kebab-name-style')`).

## Composing with the other functions

- `image-url()` / `font-url()` — resolve the names in your data to real URLs as you loop.
- `image-width()` / `image-height()` — if your pipeline doesn't record dimensions, read them from disk at compile time instead.
- `asset_cache_buster` / `asset_host` — applied automatically to every URL generated inside your loops, so pipeline-driven CSS gets the same busting/host treatment as hand-written CSS.

A complete runnable version lives in [`examples/data-lookup/`](../examples/data-lookup/):

```sh
node examples/data-lookup/run.js
```
