/**
 * Custom Functions for synchronous, sass modern JS API (compile).
 * 
 * Copyright (c) 2023-2024 Alex Grant (@localnerve), LocalNerve LLC
 * Licensed under the MIT license.
 */

export default function modernAPISync (sass, processor) {
  return {
    'image-url($filename, $only_path: false)': args => {
      const filename = args[0].assertString('filename').text;
      const only_path = args[1].assertBoolean('only_path').isTruthy;
      let result = sass.sassNull;
      processor.image_url(filename, url => {
        if (!only_path) url = `url('${url}')`;
        result = new sass.SassString(url);
      });
      return result;
    },
    'inline-image($filename, $mime_type: null)': args => {
      const filename = args[0].assertString('filename').text;
      const mime_type = args[1].realNull === null ? null : args[1].assertString('mime_type').text;
      let result = sass.sassNull;
      processor.inline_image(filename, mime_type, dataUrl => {
        result = new sass.SassString(`url('${dataUrl}')`);
      });
      return result;
    },
    'image-width($filename)': args => {
      const filename = args[0].assertString('filename').text;
      let result = sass.sassNull;
      processor.image_width(filename, image_width => {
        result = new sass.SassNumber(image_width, 'px');
      });
      return result;
    },
    'image-height($filename)': args => {
      const filename = args[0].assertString('filename').text;
      let result = sass.sassNull;
      processor.image_height(filename, image_height => {
        result = new sass.SassNumber(image_height, 'px');
      });
      return result;
    },
    'font-url($filename, $only-path: false)': args => {
      const filename = args[0].assertString('filename').text;
      const only_path = args[1].assertBoolean('only_path').isTruthy;
      let result = sass.sassNull;
      processor.font_url(filename, url => {
        if (!only_path) url = `url('${url}')`;
        result = new sass.SassString(url);
      });
      return result;
    },
    'font-files($filenames...)': args => {
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
      });
      return new sass.SassList(result);
    }
  };
}