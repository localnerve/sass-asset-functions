import saf from 'package';
import {
  testInlineLegacy,
  testInlineModernSync,
  testInlineModernAsync
} from './functions.js';

testInlineLegacy(saf);
testInlineModernSync(saf);
testInlineModernAsync(saf);