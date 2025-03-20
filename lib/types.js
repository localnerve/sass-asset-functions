/**
 * Convert javascript types to sass types.
 * 
 * Supported Mappings:
 * Boolean => Sass.Boolean
 * Number => Sass.Number
 * String => Sass.String
 * Array => Sass.List
 * Set => Sass.List
 * Object => Sass.Map
 * Map => Sass.Map
 * BigInt => Sass.Null
 * Function => Sass.Null
 * Null => Sass.Null
 * Undefined => Sass.Null
 * Symbol => Sass.Null
 * AnythingElse => Sass.Null
 * 
 * Copyright (c) 2023-2025 Alex Grant (@localnerve), LocalNerve LLC
 * Licensed under the MIT license.
 */
import { OrderedMap } from 'immutable';

/**
 * Convert a javascript value to a sass value of corresponding type.
 * Modern Sass version.
 * 
 * @param {Sass} sass - Sass javascript API
 * @param {*} value - A javascript value
 * @returns {SassType} - A Sass typed value for the given javascript value
 */
export function convertToSassTypesModern (sass, value) {
  switch (typeof value) {
    case 'boolean':
      return value ? sass.sassTrue : sass.sassFalse;
    case 'number':
      return new sass.SassNumber(value);
    case 'string':
      return new sass.SassString(value, { quotes: false });
    case 'object':
      if (value === null) {
        return sass.sassNull;
      } else if (Array.isArray(value)) {
        const sassArray = [];
        for (let i = 0; i < value.length; ++i) {
          sassArray[i] = convertToSassTypesModern(sass, value[i]);
        }
        return new sass.SassList(sassArray);
      } else if (value instanceof Set) {
        let i = 0;
        const sassArray = [];
        for (const item of value) {
          sassArray[i++] = convertToSassTypesModern(sass, item);
        }
        return new sass.SassList(sassArray);
      } else {
        const sassArray = [];
        const obj = value instanceof Map ? Object.fromEntries(value) : value;
        for (const [key, val] of Object.entries(obj)) {
          sassArray.push([
            convertToSassTypesModern(sass, key),
            convertToSassTypesModern(sass, val)
          ]);
        }
        return new sass.SassMap(new OrderedMap(sassArray));
      }
    default:
      return sass.sassNull;
  }
}

/**
 * Convert a javascript value to a sass value of corresponding type.
 * Legacy Sass version.
 * 
 * @param {Sass} sass - Sass javascript API
 * @param {*} value - A javascript value
 * @returns {SassType} - A Sass typed value for the given javascript value
 */
export function convertToSassTypesLegacy (sass, value) {
  switch (typeof value) {
    case 'boolean':
      return value ? sass.types.Boolean.TRUE : sass.types.Boolean.FALSE;
    case 'number':
      return new sass.types.Number(value);
    case 'string':
      return new sass.types.String(value);
    case 'object':
      if (value === null) {
        return sass.types.Null.NULL;
      } else if (Array.isArray(value)) {
        const list = new sass.types.List(value.length);
        for (let i = 0; i < value.length; ++i) {
          list.setValue(i, convertToSassTypesLegacy(sass, value[i]));
        }
        return list;
      } else if (value instanceof Set) {
        const list = new sass.types.List(value.size);
        let i = 0;
        for (let val of value) {
          list.setValue(i++, convertToSassTypesLegacy(sass, val));
        }
        return list;
      } else {
        const obj = value instanceof Map ? Object.fromEntries(value) : value;
        const map = new sass.types.Map(Object.keys(obj).length);
        let i = 0;
        for (const [key, val] of Object.entries(obj)) {
          map.setKey(i, convertToSassTypesLegacy(sass, key));
          map.setValue(i++, convertToSassTypesLegacy(sass, val));
        }
        return map;
      }
    default:
      return sass.types.Null.NULL;
  }
}