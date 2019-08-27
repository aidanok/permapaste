
import * as fs from 'fs-extra';
import * as path from 'path';

const Datauri = require('datauri');
const DataURI = Datauri.promise; 

export async function inlineManifest(inputFile: string, targetHtmlFile: string) {
  const manifest = fs.readJSONSync(inputFile);
  const manifestPath = path.dirname(inputFile);
  if (Array.isArray(manifest.icons)) {
    for (var i = 0; i < manifest.icons.length; i++) {
      const iconPath = path.join(manifestPath, manifest.icons[i].src)
      const encodedIcon = await DataURI(iconPath)
      manifest.icons[i].src = encodedIcon;
    }
  }
  const inlinedJSON = JSON.stringify(manifest, undefined, 2);
  const datauri = new Datauri();
  const encoded = datauri.format('.json', inlinedJSON);
  // Fix the mime type
  const inlined = encoded.content.replace('data:application/json', 'data:application/manifest+json')
  const html = `<link rel="manifest" href="${inlined}">`;
  
  const targetFileContent = fs.readFileSync(targetHtmlFile).toString();
  // just search for the closing title tag and inlined link directly after it.
  const match = targetFileContent.match(/<\/title>/mi);
  if (!match || typeof match.index !== 'number') {
    throw new Error('Could not find closing title tag, unable to inline.')
  } 
  
  const resultContent = 
    targetFileContent.substr(0, match.index+8)
    + 
    html 
    + 
    targetFileContent.substr(match.index+8);
 
  if (resultContent === targetFileContent) {
    throw new Error('Couldnt insert into HTML')
  }
  return fs.writeFile(targetHtmlFile, resultContent)
}

// Main
const manifestFile = process.argv[process.argv.length-2];
const targetFile = process.argv[process.argv.length-1];

const manifestFullPath = path.join(process.cwd(), manifestFile);
const targetFullPath = path.join(process.cwd(), targetFile)

inlineManifest(manifestFullPath, targetFullPath)
.then(() => {
  console.log('Inlined manifest file OK');
})
.catch(e => {
  console.error(e);
  console.error('Error inlining');
  process.exit(-1);
})
