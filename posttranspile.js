import fs from 'node:fs/promises';
import path from 'node:path';

async function processFile (filename) {
  console.log(`@@@ posttranspile:file ${filename}`);

  const newname = filename.replace(/\.js$/, '.cjs');
  console.log(`@@@ posttranspile:file:newname ${newname}`);
  await fs.rename(filename, newname);
  console.log('@@@ posttranspile:file:postrename');
  const data = await fs.readFile(newname, 'utf8');
  console.log('@@@ posttranspile:file:postreadfile');
  const newData = data.replaceAll('.js")', '.cjs")');
  console.log('@@@ posttranspile:file:postreplace');
  await fs.writeFile(newname, newData);
  console.log('@@@ posttranspile:file:postwritefile');
}

async function processDirectory (dir) {
  console.log(`@@@ posttranspile:directory ${dir}`);
  try {
    const files = await fs.readdir(dir);
    for (const file of files) {
      const name = `${dir}${path.sep}${file}`;
      const stats = await fs.stat(name);
      if (stats.isDirectory()) {
        await processDirectory(name);
      } else {
        await processFile(name);
      }
    }
  } catch (err) {
    console.error('posttranspile error:\n\n', err);
  }
}

await processDirectory('./cjs');