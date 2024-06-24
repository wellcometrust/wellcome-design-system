import StyleDictionary from 'style-dictionary';
import { registerTransforms } from '@tokens-studio/sd-transforms';

registerTransforms(StyleDictionary);

const sd = new StyleDictionary('config.json');

// Define the array of excluded token paths
const excludedPaths = [
  'tokenSetOrder',
  'asset',
  'annotations'
];

sd.registerFilter({
  name: 'custom/excludeTokens',
  filter: (prop) => {
    return !prop.path.some(part => excludedPaths.includes(part));
  }
});

sd.buildAllPlatforms();