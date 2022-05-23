const fs = require('fs');
const path = require('path');
const { readdir, copyFile, mkdir} = require('fs/promises');


fs.rm(path.join(__dirname, 'files-copy'), { recursive: true }, ()=>{
  copyFolder(path.join(__dirname, 'files'));
});

async function copyFolder(dirPath) {
  await mkdir(path.join(__dirname, 'files-copy'));
  const assets = await readdir(dirPath, { withFileTypes: true });
  for (const asset of assets) {
    const name = path.basename(asset.name);
    await copyFile(path.join(__dirname, 'files', name), path.join(__dirname, 'files-copy', name));
  }
}
