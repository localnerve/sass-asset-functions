/**
 * Sass asset function suite.
 * 
 * Copyright (c) 2023-2025 Alex Grant (@localnerve), LocalNerve LLC
 * Licensed under the MIT license.
 */
import * as defaultSass from 'sass';
import Processor from './lib/processor.js';
import legacy from './lib/legacyAPI.js';
import modernSync from './lib/modernAPISync.js';
import modernAsync from './lib/modernAPIAsync.js'

export default function sassFunctions (options = {}) {
  const { sass = defaultSass, legacyAPI = false, async = false } = options;
  const processor = new Processor(options);
  const modern = async ? modernAsync : modernSync;

  return legacyAPI ? legacy(sass, processor) : modern(sass, processor);
}
