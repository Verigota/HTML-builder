const fs = require('fs');
const path = require('path');
const { readdir, copyFile, mkdir, rm } = require('fs/promises');

(async () => {
  try{
    await rm(path.join(__dirname, 'project-dist'), { recursive: true });
  } catch {
    //
  }
  await mkdir(path.join(__dirname, 'project-dist'));
  await mkdir(path.join(__dirname, 'project-dist', 'assets'));
  await copyAssets(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
  await createCss(path.join(__dirname, 'styles'));
  await createHtml();
})();

async function copyAssets(from, to) {
  const assetsList = await readdir(from, { withFileTypes: true });
  for (const asset of assetsList) {
    if (asset.isFile()) {
      const name = path.basename(asset.name);
      await copyFile(path.join(from, name), path.join(to, name));
    } else {
      await mkdir(path.join(to, asset.name));
      copyAssets(path.join(from, asset.name), path.join(to, asset.name));
    }
  }
}

async function createCss(dirPath) {
  const styles = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
  const assets = await readdir(dirPath, { withFileTypes: true });
  for (const asset of assets) {
    if (asset.isFile() && path.extname(asset.name) === '.css') {
      const cssFile = fs.createReadStream(path.join(dirPath, asset.name), 'utf-8');
      cssFile.on('data', (chunk) => {
        styles.write(chunk);
      });
    }
  }
}

async function createHtml() {
  const indexHtml = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
  let tempCont = await fs.promises.readFile(path.join(__dirname, 'template.html'), 'utf-8');

  const components = await readdir(path.join(__dirname, 'components'), { withFileTypes: true });
  for (const comp of components) {
    if (path.extname(comp.name) === '.html') {
      const compCont = await fs.promises.readFile(path.join(__dirname, 'components', comp.name), 'utf-8');
      tempCont = tempCont.replace(`{{${path.basename(comp.name, '.html')}}}`, compCont);
    }
  }
  indexHtml.write(tempCont);
}