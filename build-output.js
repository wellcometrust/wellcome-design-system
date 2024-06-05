import { registerTransforms } from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';

// will register them on StyleDictionary object
// that is installed as a dependency of this package.
registerTransforms(StyleDictionary);

StyleDictionary.registerTransform({
  name: 'addPrefix',
  type: 'name',
  transform: (prop) => {
    const prefix = prop.filePath.split('/').at(-1).split('.').at(0);

    return `${prefix}.${prop.path.join('.')}`;
  }
});


const sd = new StyleDictionary({

  source: ['src/*.json'],
  preprocessors: ['tokens-studio'],
  platforms: {
    js: {
      transforms: ['addPrefix'],
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