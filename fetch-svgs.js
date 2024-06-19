import fs from 'node:fs';
import stream from 'node:stream';
import { slugify } from './utils/slugify.js';
import streamConsumers from 'node:stream/consumers';
import 'dotenv/config';

const { text } = streamConsumers;
const apiRoot = 'https://api.figma.com/v1';
const docId = '4EC72TQpgvtio5zn1bSAVC';
const filesUrl = `${apiRoot}/files/${docId}`;
const imagesUrl = `${apiRoot}/images/${docId}?`
const headers = {
  'X-Figma-Token': process.env.FIGMA_PERSONAL_ACCESS_TOKEN
}
async function init() {
  // 1. Query the files endpoint to get the names/ids of the icons
  const filesRes = await fetch(filesUrl, {
    headers,
  });
  const filesJson = await filesRes.json();

  const icons = filesJson.document.children.map(c => {
    return c.children
      .filter(i => i.type === 'COMPONENT')
      // .filter(i => i.name.startsWith('icon.'))
      .map(i => {
        return {
          name: i.name,
          id: i.id,
        }
    });
  }).flat();

  // 2. Query the images endpoint to get URLs of the icon svgs
  const imagesRes = await fetch(imagesUrl + new URLSearchParams({
    ids: icons.map(i => i.id).join(','),
    format: 'svg',
  }), {
    headers
  });

  const imagesJson = await imagesRes.json();

  // 3. Query each icon svg URL and write it to disk
  fs.mkdir(`./dist/icons/svg`, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
    }
  });

  for (const [key, value] of Object.entries(imagesJson.images)) {
    const fileName = slugify(icons.find(i => i.id === key).name);
    const imageRes = await fetch(value);

    stream.Readable
      .fromWeb(imageRes.body)
      .pipe(fs.createWriteStream(`./dist/icons/svg/${fileName}.svg`, { flag: 'a+' })); // Create the file if it doesn't exist
  }
}

init();