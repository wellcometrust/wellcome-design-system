import fs from 'node:fs';
import path from 'node:path';
import { transform } from '@svgr/core';
import { pascalize } from './utils/pascalize.js';

const svgFolder = `./dist/icons/svg`;

const isFile = fileName => {
  return fs.lstatSync(fileName).isFile();
};

const files = fs.readdirSync(svgFolder)
  .map(fileName => path.join(svgFolder, fileName))
  .filter(isFile);

fs.mkdir(`./dist/icons/react`, { recursive: true }, (err) => {
  if (err) {
    console.error(err);
  }
});

fs.writeFile('./dist/icons/react/index.js', '', err => {
  if (err) {
    console.error(err);
  }
});

for (const file of files) {
  const svg = fs.readFileSync((file), (err) => {
    if (err) {
      console.error(err);
    }
  });

  const componentName = pascalize(file.split('/').at(-1).split('.')[0]);

  const code = await transform(
    svg,
    {
      icon: true,
      jsxRuntime: 'automatic',
      plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'],
    },
    { componentName: componentName },
  );

  fs.writeFile(`./dist/icons/react/index.js`, `export { default as ${componentName} } from './${componentName}.tsx';\n`, {flag: 'a+'}, err => {
    if (err) {
      console.error(err);
    }
  });

  fs.writeFile(`./dist/icons/react/${componentName}.tsx`, code, (err) => {
    if (err) {
      console.log(err);
    }
  });
}


