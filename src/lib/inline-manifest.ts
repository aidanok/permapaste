
import * as fs from 'fs-extra';
import * as path from 'path';

const Datauri = require('datauri');
const DataURI = Datauri.promise; 


async function inlineManifest(inputFile: string): Promise<string> {
  //const manifest = JSON.parse();
  const manifest = await fs.readJSON(inputFile);
  const manifestPath = path.dirname(inputFile);
  if (Array.isArray(manifest.icons)) {
    for (var i = 0; i < manifest.icons.length; i++) {
      const iconPath = path.join(manifestPath, manifest.icons[i].src)
      const encodedIcon = await DataURI(iconPath)
      manifest.icons[i].src = encodedIcon;
    }
  }
  return JSON.stringify(manifest, undefined, 2);
}

// Main
const file = process.argv[process.argv.length-1]
const fullPath = path.join(process.cwd(), file);

fs.exists(fullPath, (async (exists: boolean) => {
  
  if (exists) {
    let inlined = await inlineManifest(fullPath);
    const datauri = new Datauri();
    const encoded = datauri.format('.json', inlined);
    //console.log(encoded.content)
    // fix mime-type 
    inlined = encoded.content.replace('data:application/json', 'data:application/manifest+json')
    console.log(`<link rel="manifest" href="${inlined}">`);
  } 
  else {
    console.error(`File ${fullPath} does not exist`);
    process.exit(-1);
  }

}));
