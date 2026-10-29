# Example: basic asset URLs

Demonstrates the URL functions with default-style path options:

- `image-url()` — wraps the resolved web path in `url('…')`
- `image-url($filename, true)` — bare path via `$only_path`
- `font-url($filename, true)` — bare font path via `$only-path` (note the hyphen)
- `font-files(...)` — full `@font-face src` list with an explicit `format()` override

URL functions do **not** require the files to exist on disk.

```sh
node examples/basic/run.js
```
