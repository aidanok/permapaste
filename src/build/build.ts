
import { exec } from 'child_process'

function parcelBuild() {
  exec('npx parcel build index.html', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`${stdout}`);
    console.error(`${stderr}`);
    arweavePackage();
  });
}

function arweavePackage() {
  exec('arweave package dist/index.html dist/packaged.html', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`${stdout}`);
    console.error(`${stderr}`);
    inlineManifest();
  });
}

function inlineManifest() {
  exec('npx ts-node src/build/inline-manifest.ts src/favicons/site.webmanifest dist/packaged.html', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`${stdout}`);
    console.error(`${stderr}`);
    console.log(`Build finished, output to dist/packaged.html`)
  }); 
}

parcelBuild();
