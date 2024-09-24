import fs from 'node:fs/promises';
import path from 'node:path';

async function processFile (filename) {
  const newname = filename.replace(/\.js$/, '.cjs');
  await fs.rename(filename, newname);
  const data = await fs.readFile(newname, 'utf8');
  const newData = data.replaceAll('.js")', '.cjs")');
  await fs.writeFile(newname, newData);
}

async function processDirectory (dir) {
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