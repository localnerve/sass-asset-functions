/**
 * Custom Functions for sass Legacy JS API.
 * 
 * Copyright (c) 2023-2025 Alex Grant (@localnerve), LocalNerve LLC
 * Licensed under the MIT license.
 */

export default function legacyAPI (sass, processor) {
  return {
    'image-url($filename, $only_path: false)': (filename, only_path, done) => {
      processor.image_url(filename.getValue(), url => {
        if (!only_path.getValue()) url = `url('${url}')`;
        done(new sass.types.String(url));
      });
    },
    'inline-image($filename, $mime_type: null)': (filename, mime_type, done) => {
      mime_type = mime_type instanceof sass.types.Null ? null : mime_type.getValue();
      processor.inline_image(filename.getValue(), mime_type, dataUrl => {
        done(new sass.types.String(`url('${dataUrl}')`));
      });
    },
    'image-width($filename)': (filename, done) => {
      processor.image_width(filename.getValue(), image_width => {
        done(new sass.types.Number(image_width, 'px'));
      });
    },
    'image-height($filename)': (filename, done) => {
      processor.image_height(filename.getValue(), image_height => {
        done(new sass.types.Number(image_height, 'px'));
      });
    },
    'font-url($filename, $only-path: false)': (filename, only_path, done) => {
      processor.font_url(filename.getValue(), url => {
        if (!only_path.getValue()) url = `url('${url}')`;
        done(new sass.types.String(url));
      });
    },
    'font-files($filenames...)': (list, done) => {
      let len = list.getLength(), i = 0;
      const filenames = [];
      for(; i < len; ++i) {
        filenames[i] = list.getValue(i).getValue();
      }

      processor.font_files(filenames, files => {
        len = files.length;
        i = 0;
        list = new sass.types.List(len);
        for (; i < len; ++i) {
          list.setValue(i, new sass.types.String(`url('${files[i].url}') format('${files[i].type}')`));
        }
        done(list);
      });
    }
  };
}