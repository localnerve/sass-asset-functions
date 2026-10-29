# Examples

Runnable usage examples. Each subfolder is self-contained (it imports the
library source directly via a relative path, so no install step is needed) and
prints its compiled CSS to stdout:

| example | demonstrates | run with |
| --- | --- | --- |
| [`basic/`](basic/) | `image-url`, `font-url`, `font-files`, `$only_path` / `$only-path` | `node examples/basic/run.js` |
| [`cache-busting/`](cache-busting/) | async `asset_cache_buster` with content hashing; `async: true` + `compileAsync` | `node examples/cache-busting/run.js` |
| [`custom-host/`](custom-host/) | `asset_host` (CDN) combined with cache busting — pipeline order | `node examples/custom-host/run.js` |
| [`data-lookup/`](data-lookup/) | `data` option + `lookup()` — image-processing manifests driving CSS generation | `node examples/data-lookup/run.js` |
