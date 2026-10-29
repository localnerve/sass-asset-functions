# Example: build-time data driving CSS generation

The flagship use case. An image-processing step emits a manifest of images
(names, sizes, types, densities); Sass loops over it via `lookup()` and emits
the matching CSS. The images and their processing become the single source of
truth — this CSS changes with them, no hand-maintained stylesheet edits.

Shown here:

1. one rule per image, dimensions taken from the manifest (note unitless
   numbers need `* 1px`),
2. a srcset-style `"url density"` list built for an HTML template,
3. nested key access plus boolean/list conversion,
4. missing keys resolving to `null`.

```sh
node examples/data-lookup/run.js
```
