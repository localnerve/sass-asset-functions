# Example: custom asset host (CDN)

`asset_host` resolves every asset path against a host you supply — here sharded
CDN hosts computed from the path length, combined with a simple version-query
cache buster to show the pipeline order: **cache buster first, host wraps its
result**.

```sh
node examples/custom-host/run.js
```
