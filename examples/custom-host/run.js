/**
 * Example: serving assets from a custom host (CDN).
 *
 * `asset_host` receives the (possibly cache-busted) http path and resolves it
 * against the host you supply. Here hosts are sharded by path length, as is
 * common with CDN setups; a fixed host would be just as easy:
 *   asset_host: (http_path, done) => done('https://assets.example.com')
 *
 * Run with:  node examples/custom-host/run.js
 * Prints the compiled CSS to stdout.
 */
import * as sass from 'sass';
import assetFunctions from '../../index.js';

const source = String.raw`
.hero {
  background-image: image-url('hero.webp');
}

@font-face {
  font-family: 'ExampleFont';
  src: font-url('example-font.woff2');
}
`;

const result = sass.compileString(source, {
  functions: assetFunctions({
    // Sharded CDN hosts — the host is computed from the path itself.
    asset_host: (http_path, done) => {
      done(`https://assets${http_path.length % 4}.example.com`);
    },
    // Cache busting still applies first; the host wraps its result.
    asset_cache_buster: (http_path, real_path, done) => {
      done('v=20261029');
    }
  })
});

console.log(result.css);
