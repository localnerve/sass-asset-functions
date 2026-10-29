# Sass functions

All seven functions are registered in every API mode (legacy, modern sync, modern async). Paths are resolved per [options.md](options.md): the **http path** is what appears in your CSS; the **real path** is where files live at build time.

## `image-url($filename: null, $only_path: false)` → String

Returns the image URL as a ready-to-use `url('...')` string. Pass `$only_path: true` to get the bare path (no `url()` wrapper) when you need to compose it yourself.

```scss
.hero {
  background-image: image-url('hero.webp');      // url('/images/hero.webp')
}
$bare: image-url('hero.webp', true);             // /images/hero.webp
```

The file does not need to exist. Fragments in `$filename` are preserved through any cache-buster/host rewriting (see the URL pipeline in [options.md](options.md)).

## `font-url($filename: null, $only-path: false)` → String

Same behavior as `image-url`, but resolved against the fonts paths (`fonts_path` / `http_fonts_path`).

> **Signature quirk:** registered with a hyphen — `font-url($filename, $only-path: false)` — while `image-url` uses an underscore (`$only_path`). Both call styles work in style sheets; do not "fix" one to match the other.

## `font-files($filenames...)` → List of Strings

Builds a full `src:` value for `@font-face`. Each entry becomes `url('<path>') format('<type>')`; the type is taken from the file extension unless you override it by passing the type as the argument immediately after the filename:

```scss
@font-face {
  font-family: 'MyFont';
  src: font-files(
    'my-font.woff2',
    'my-font.woff', 'woff',   // explicit format override for the previous file
    'my-font.svg#MyFont'
  );
}
```

Recognized extension/type names: `woff`, `woff2`, `otf`/`opentype`, `ttf`/`truetype`, `svg`, `eot` (`embedded-opentype`). Fragment identifiers (e.g. `#MyFont`) survive cache-buster/host rewriting.

## `image-width($filename)` → Number (px)

Reads the image from `images_path` at build time and returns its width in px. **Requires the file to exist.** Throws with a descriptive message (and `cause`) if it cannot be read.

```scss
.hero {
  width: image-width('hero.webp');
}
```

## `image-height($filename)` → Number (px)

Same as `image-width`, returning height.

These two functions are the bridge between your images and generated CSS: pair them with [data-driven loops](data-and-lookup.md) so dimensions come from the actual processed assets, not hand-entered values.

## `inline-image($filename: null, $mime_type: null)` → String (data URL)

Reads the image and returns it as a ready-to-use data URL: `url('data:<mime>;base64,...')`. The MIME type defaults to a lookup from the file extension; pass `$mime_type` explicitly to override. **Requires the file to exist.**

```scss
.favicon {
  background-image: inline-image('favicon.svg');
}
```

Use for small icons and similar assets where the request round-trip costs more than the payload does.

## `lookup($keys...)` → Boolean | Number | String | List | Map | Null

Retrieves build-time data supplied via the [`data` option](options.md#data) by walking a chain of keys:

```scss
$name: lookup('hero-image-names', 'big');   // nested access with multiple keys
$all:  lookup('hero-image-names');          // the whole subtree at that key
```

If the chain does not resolve to data you supplied, the result is `null`. JavaScript-to-Sass type mapping is documented in [data-and-lookup.md](data-and-lookup.md). This is the function that lets image-processing and templating steps drive CSS/HTML generation — see that document for the full picture.

> **Reading map values:** Sass has no `$map['key']` index operator — it is an error in *all* positions (selectors, declarations, interpolation) on current dart-sass. Use `map.get($m, 'key')` (modern) or `map-get($m, 'key')` (legacy, deprecated). This applies to any map, including records looked up from the `data` option.
