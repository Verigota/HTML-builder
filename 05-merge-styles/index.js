const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');
const bundle = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

async function findFiles(dirPath) {
  const assets = await readdir(dirPath, { withFileTypes: true });
  for (const asset of assets) {
    if (asset.isFile() && path.extname(asset.name) === '.css') {
      const cssFile = fs.createReadStream(path.join(dirPath, asset.name), 'utf-8');
      cssFile.on('data', (chunk) => {
        bundle.write(`${chunk}\r`);
      });
    }
  }
}

findFiles(path.join(__dirname, 'styles'));