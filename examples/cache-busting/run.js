/**
 * Example: asynchronous content-hash cache busting.
 *
 * Each asset URL gets a SHA-1 digest of the real file's bytes embedded in its
 * filename, e.g. /images/hero.svg -> /images/hero-a1b2c3....svg.
 * Because the callback performs I/O (reading the file), `async: true` +
 * sass.compileAsync are required.
 *
 * Run with:  node examples/cache-busting/run.js
 * Prints the compiled CSS to stdout.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import * as sass from 'sass';
import assetFunctions from '../../index.js';

const thisDir = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(thisDir, 'images');

const source = String.raw`
.hero {
  background-image: image-url('hero.svg');
}

.icon {
  background-image: image-url('missing.png'); // file absent -> URL left unmodified
}
`;

const result = await sass.compileStringAsync(source, {
  functions: assetFunctions({
    async: true, // required: the callback below is asynchronous
    images_path: imagesDir,
    http_images_path: '/images',
    asset_cache_buster: (http_path, real_path, done) => {
      fs.readFile(real_path, (err, buffer) => {
        if (err) {
          // file doesn't exist; `done()` with no arguments leaves the URL unmodified.
          return done();
        }
        const digest = crypto.createHash('sha1').update(buffer).digest('hex');
        const extname = path.extname(http_path);
        const basename = path.basename(http_path, extname);
        const new_name = `${basename}-${digest}${extname}`;
        // object form: replace the path (query left unset)
        done({ path: path.join(path.dirname(http_path), new_name).replace(/\\/g, '/'), query: null });
      });
    }
  })
});

console.log(result.css);
