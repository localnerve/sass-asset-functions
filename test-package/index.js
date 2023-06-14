// 1. run `npm pack`
// 2. unpack it to local `node_modules`
// 3. run `npm i` for `node_modules/package`
// 4. run test-import.cjs, test-import.mjs, test-require.cjs

const { spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const tar = require('tar');
const { globSync } = require('glob');

const localNodeModulesPath = path.join(__dirname, 'node_modules');
const tarGlob = 'localnerve-sass-asset-functions*';
const testFiles = [
  path.join(__dirname, 'test-require.cjs'),
  path.join(__dirname, 'test-import.cjs'),
  path.join(__dirname, 'test-import.mjs')
];

function runTests () {
  let result;
  const errors = [];
  testFiles.forEach(testFile => {
    const testFileShort = path.basename(testFile);
    console.log(`=== start ${testFileShort} ===`);
    result = spawnSync('node', [testFile], {
      cwd: __dirname,
      stdio: 'inherit',
      timeout: 3000
    });
    if (result.status !== 0) {
      const msg = `${testFileShort} failed, ${result.status}`;
      console.error(msg);
      errors.push(msg);
    } else {
      console.log(`${testFileShort} success`);
    }
    console.log(`=== end ${testFileShort} ===`);
  });

  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }
}

// run `npm run transpile`
const transpile = spawn('npm', ['run', 'transpile']);
transpile.on('close', transpileCode => {
  if (transpileCode === 0) {
    // run `npm pack`
    const pack = spawn('npm', ['pack']);
    pack.on('close', packCode => {
      if (packCode === 0) {
        // clean any existing local node_modules
        fs.rmSync(localNodeModulesPath, { force: true, recursive: true });
        fs.mkdirSync(localNodeModulesPath, { recursive: true });
        // derive the tar file name from base glob
        const tarFileName = globSync(tarGlob)[0];
        // unpack it to local `node_modules`
        tar.x({
          C: localNodeModulesPath,
          file: tarFileName,
          sync: true
        });
        // remove old tar file
        fs.rmSync(tarFileName);

        // run `npm i` for `node_modules/package`
        const install = spawn('npm', ['i'], {
          cwd: `${localNodeModulesPath}/package`
        });
        install.on('close', installCode => {
          if (installCode === 0) {
            runTests();
          } else {
            console.error('failed npm install', installCode);
          }
        });
      } else {
        console.error('npm pack failed', packCode);
      }
    });
  } else {
    console.error('npm run transpile failed', transpileCode);
  }
});