const fs = require('node:fs');
const fileToChange = './cjs/index.cjs';
fs.readFile(fileToChange, 'utf8', (err, data) => {
  if (err) throw err;
  const newData = data.replace('./lib/processor.js', './lib/processor.cjs');
  fs.writeFile(fileToChange, newData, err => {
    if (err) throw err;
  });
});