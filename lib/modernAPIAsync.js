/**
 * Custom Functions for asynchronous, sass modern JS API (compileAsync).
 * 
 * Copyright (c) 2023-2024 Alex Grant (@localnerve), LocalNerve LLC
 * Licensed under the MIT license.
 */

export default function modernAPIAsync (sass, processor) {
  return {
    'image-url($filename, $only_path: false)': args => {
      return new Promise((resolve, reject) => {
        try {
          const filename = args[0].assertString('filename').text;
          const only_path = args[1].assertBoolean('only_path').isTruthy;
          processor.image_url(filename, url => {
            if (!only_path) url = `url('${url}')`;
            resolve(new sass.SassString(url));
          });
        } catch (err) {
          reject(err);
        }
      });
    },
    'inline-image($filename, $mime_type: null)': args => {
      return new Promise((resolve, reject) => {
        try {
          const filename = args[0].assertString('filename').text;
          const mime_type = args[1].realNull === null ? null : args[1].assertString('mime_type').text;
          processor.inline_image(filename, mime_type, dataUrl => {
            resolve(new sass.SassString(`url('${dataUrl}')`));
          });
        } catch (err) {
          reject(err);
        }
      });
    },
    'image-width($filename)': args => {
      return new Promise((resolve, reject) => {
        try {
          const filename = args[0].assertString('filename').text;
          processor.image_width(filename, image_width => {
            resolve(new sass.SassNumber(image_width, 'px'));
          });
        } catch (err) {
          reject(err);
        }
      });
    },
    'image-height($filename)': args => {
      return new Promise((resolve, reject) => {
        try {
          const filename = args[0].assertString('filename').text;
          processor.image_height(filename, image_height => {
            resolve(new sass.SassNumber(image_height, 'px'));
          });
        } catch (err) {
          reject(err);
        }
      });
    },
    'font-url($filename, $only-path: false)': args => {
      return new Promise((resolve, reject) => {
        try {
          const filename = args[0].assertString('filename').text;
          const only_path = args[1].assertBoolean('only_path').isTruthy;
          processor.font_url(filename, url => {
            if (!only_path) url = `url('${url}')`;
            resolve(new sass.SassString(url));
          });
        } catch (err) {
          reject(err);
        }
      });
    },
    'font-files($filenames...)': args => {
      return new Promise((resolve, reject) => {
        try {
          const input = args[0].asList;
          const filenames = [];
          const result = [];
          for(let i = 0; i < input.size; ++i) {
            filenames[i] = input.get(i).assertString().text;
          }
          processor.font_files(filenames, files => {
            for (let i = 0; i < files.length; ++i) {
              result[i] = new sass.SassString(`url('${files[i].url}') format('${files[i].type}')`);
            }
            resolve(new sass.SassList(result));
          });
        } catch (err) {
          reject(err);
        }
      });
    }
  };
}