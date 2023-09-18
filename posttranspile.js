import fs from 'node:fs/promises';
import path from 'node:path';

async function processFile (filename) {
  const data = await fs.readFile(filename, 'utf8');
  const newData = data.replace(/(require\("[a-z./]+)(\.js")(.+)$/mg, (m, req, repl, rest) => {
    return `${req}.cjs"${rest}`;
  });
  await fs.writeFile(filename, newData);
}

async function processDirectory (dir) {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const name = `${dir}${path.sep}${file}`;
    const stats = await fs.stat(name);
    if (stats.isDirectory()) {
      processDirectory(name);
    } else {
      processFile(name);
    }
  }  
}

await processDirectory('./cjs');