/**
 * Example: build-time data driving CSS generation (the `data` option + lookup()).
 *
 * This is the flagship use case: an image-processing step emits a manifest of
 * images (names, sizes, types, densities) and Sass loops over it to emit the
 * matching CSS. The images and their processing become the single source of
 * truth — add or re-process an image and this CSS changes with it, no
 * stylesheet edits required. The same records can feed your HTML templates.
 *
 * In a real build the `data` object comes from your pipeline (a manifest file
 * written by your image processor, templating output, etc.). Here we build it
 * inline to keep the example self-contained.
 *
 * Run with:  node examples/data-lookup/run.js
 * Prints the compiled CSS to stdout.
 */
import * as sass from 'sass';
import assetFunctions from '../../index.js';

// What your image-processing step would produce:
const data = {
  images: [
    { name: 'hero-1920x300.webp', width: 1920, height: 300, type: 'webp', density: 2 },
    { name: 'hero-1440x300.webp', width: 1440, height: 300, type: 'webp', density: 2 },
    { name: 'hero-1024x300.png',  width: 1024, height: 300, type: 'png',  density: 1 }
  ],
  // Nested data with multiple value types:
  feature: {
    enabled: true,
    label: 'new-hero',
    breakpoints: [640, 1024, 1440]
  }
};

const source = String.raw`
// 1) One rule per processed image — dimensions come from the manifest,
//    never hand-entered. Note numbers arrive unitless, so append px.
//
// Gotcha: read map values with map-get() — Sass has no $map['key'] index
// operator (it is a parse/evaluation error in all positions on current
// dart-sass). map.get() is the modern, non-deprecated spelling.
@each $img in lookup('images') {
  $name: map-get($img, 'name');
  .hero-#{$name} {
    background-image: image-url(map-get($img, 'name'));
    width: map-get($img, 'width') * 1px;
    min-height: map-get($img, 'height') * 1px;
  }
}

// 2) Build a srcset-style list ("url density" pairs) from the same records —
//    hand it to your HTML template as an attribute value.
$hero-sources: ();
@each $img in lookup('images') {
  $hero-sources: append($hero-sources, unquote(image-url(map-get($img, 'name'), true) + ' ' + map-get($img, 'density') + 'x'), comma);
}
.generated-srcset {
  content: '#{$hero-sources}';
}

// 3) Nested access with multiple keys; booleans and lists convert too.
$feature-enabled: lookup('feature', 'enabled');
@if $feature-enabled {
  .feature-#{lookup('feature', 'label')} {
    display: block;
  }
  @each $bp in lookup('feature', 'breakpoints') {
    .hero-max-#{$bp} {
      max-width: $bp * 1px;
    }
  }
}

// 4) Missing keys resolve to null — safe to test.
$missing: lookup('images', 'nope');
$fallback: 'no';
@if $missing == null {
  $fallback: 'yes';
}
.fallback-if-missing {
  content: '#{$fallback}';
}
`;

const result = sass.compileString(source, {
  functions: assetFunctions({ data })
});

console.log(result.css);
