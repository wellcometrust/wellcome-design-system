import fs from 'node:fs';
import { registerTransforms } from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';
import tokens from './tokens.json' assert { type: "json" };
import config from './config.js';
import { slugify } from './utils/slugify.js';

// Split the tokens.json (from Tokens Studio) into its top-level keys -- useful
// if we want to e.g. prefix variables by their type
if (fs.existsSync(`./src`)) {
  fs.rmSync(`./src`, { recursive: true, force: true });
}

 fs.mkdirSync(`./src`);

Object.entries(tokens).map(([key, value]) => {
  if (key.startsWith('$')) return; // Tokens Studio meta info, not required for variables

  try {
    fs.writeFileSync(`./src/${slugify(key)}.json`, JSON.stringify(value), { flag: 'w' })
  } catch (err) {
    console.log(err);
  }
});

registerTransforms(StyleDictionary);
const sd = new StyleDictionary(config);

sd.cleanAllPlatforms();
sd.buildAllPlatforms();