/**
 * Example: basic asset URL functions with default and custom paths.
 *
 * Run with:  node examples/basic/run.js
 * Prints the compiled CSS to stdout.
 */
import * as sass from 'sass';
import assetFunctions from '../../index.js';

// Inline stylesheet — kept in this file so the example is self-contained.
const source = String.raw`
// With the defaults (http_images_path: '/images', http_fonts_path: '/fonts'):
.hero {
  background-image: image-url('hero.webp');   // url('/images/hero.webp')
}

// $only_path returns the bare path without the url(...) wrapper:
$bare-path: image-url('hero.webp', true);     // /images/hero.webp
.bare {
  content: '#{$bare-path}';
}

// Font helpers:
@font-face {
  font-family: 'ExampleFont';
  src: font-files(
    'example-font.woff2',
    'example-font.woff', 'woff',   // explicit format override for the previous file
    'example-font.svg#ExampleFont'
  );
}

.font-only-path {
  content: font-url('example-font.woff2', true); // /fonts/example-font.woff2
}
`;

const result = sass.compileString(source, {
  functions: assetFunctions({
    // Defaults shown explicitly for clarity:
    images_path: 'public/images',   // build-time location (not read by URL functions)
    http_images_path: '/images',    // path as seen from the browser
    fonts_path: 'public/fonts',
    http_fonts_path: '/fonts'
  })
});

console.log(result.css);
