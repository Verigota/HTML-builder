const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

async function findFiles(dirPath) {
  const assets = await readdir(dirPath, { withFileTypes: true });
  let file = '';
  for (const asset of assets) {
    if (asset.isFile()) {
      const ext = path.extname(asset.name);
      const name = path.basename(asset.name, ext);
      fs.stat(path.join(dirPath, asset.name), (err, stats)=> {
        file = `${name} - ${ext.slice(1)} - ${stats.size}b`;
        console.log(file);
      });
    }
  }
}

findFiles(path.join(__dirname, 'secret-folder'));