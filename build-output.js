import fs from 'node:fs';
import { registerTransforms } from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';
import tokens from './tokens.json' assert { type: "json" };

function slugify(str) {
  return str
    .replace(/^\s+|\s+$/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}


Object.entries(tokens).map(([key, value]) => {
  if (key.startsWith('$')) return; // meta stuff

  try {
    fs.writeFileSync(`./src/${slugify(key)}.json`, JSON.stringify(value), { flag: 'w' })
  } catch (err) {
  }
});


registerTransforms(StyleDictionary);
StyleDictionary.registerTransform({
  name: 'wds',
  type: 'name',
  transform: (prop) => {
    const prefix = prop.filePath.split('/').at(-1).split('.').at(0);
    const titlePrefix = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    const propName = prop.name;
    const titlePropName = propName.charAt(0).toUpperCase() + propName.slice(1);

    return `wds${titlePrefix}${titlePropName}`;
  }
});


const sd = new StyleDictionary({

  source: ['./src/*.json'],
  preprocessors: ['tokens-studio'],
  platforms: {
    js: {
      transforms: ['wds'],
      transformGroup: 'tokens-studio',
      buildPath: 'dist/js/',
      files: [
        {
          destination: 'variables.js',
          format: 'javascript/es6'
        }
      ]
    }
  }
});

sd.cleanAllPlatforms();
sd.buildAllPlatforms();