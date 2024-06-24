import { promises } from "node:fs";

import StyleDictionary from 'style-dictionary';
import { getReferences, usesReferences } from "style-dictionary/utils";
import { permutateThemes, registerTransforms } from '@tokens-studio/sd-transforms';


// list of components that we have tokens for, assume the tokenset path for it is tokens/${comp}.json
const components = ["button"];

// filters only tokens originating from core.json
export const coreFilter = (token) => token.filePath.endsWith("core.json");

// filters only tokens originating from semantic sets (not core, not components) and also check themeable or not
export const semanticFilter =
    (components, themeable = false) =>
        (token) => {
          const tokenThemable = Boolean(token.attributes.themeable);
          return (
              themeable === tokenThemable &&
              ["core", ...components].every(
                  (cat) => !token.filePath.endsWith(`${cat}.json`)
              )
          );
        };

const commonFileOptions = {
  format: "css/variables",
  options: {
    selector: ":host",
  },
};

export const generateSemanticFiles = (components, theme) => {
  const filesArr = [];
  // theme-specific outputs
  filesArr.push({
    ...commonFileOptions,
    filter: semanticFilter(components, true),
    destination: `product/${theme.toLowerCase().replace(' ', '-')}.css`,
  });

  // not theme-specific outputs
  filesArr.push({
    ...commonFileOptions,
    filter: semanticFilter(components, false),
    destination: `semantic.css`,
  });

  return filesArr;
};

// Define the array of excluded token paths
const excludedPaths = [
  'tokenSetOrder',
  'asset',
  'annotations'
];

registerTransforms(StyleDictionary);

StyleDictionary.registerFilter({
  name: 'custom/excludeTokens',
  filter: (prop) => {
    return !prop.path.some(part => excludedPaths.includes(part));
  }
});

async function run() {
  const $themes = JSON.parse(await promises.readFile("tokens/$themes.json"));

  const themes = permutateThemes($themes);

  // collect all tokensets for all themes and dedupe
  const tokensets = [
    ...new Set(
        Object.values(themes).reduce((acc, sets) => [...acc, ...sets], [])
    ),
  ];

  // figure out which tokensets are theme-specific
  // this is determined by checking if a certain tokenset is used for EVERY theme dimension variant
  // if it is, then it is not theme-specific
  const themeableSets = tokensets.filter((set) => {
    return !Object.values(themes).every((sets) => sets.includes(set));
  });

  const configs = Object.entries(themes).map(([theme, sets]) => {
    return {
      source: sets.map((tokenset) => `tokens/${tokenset}.json`),
      platforms: {
        css: {
          transformGroup: 'tokens-studio',
          transforms: ["attribute/themeable", "name/kebab"],
          buildPath: 'build/css/',
          files: [
            // core tokens, e.g. for application developer
            {
              destination: "core.css",
              format: "css/variables",
              filter: coreFilter,
            },
            // {
            //   destination: `${theme}.css`,
            //   format: 'css/variables',
            //   filter: 'custom/excludeTokens'
            // }
            // semantic tokens, e.g. for application developer
            ...generateSemanticFiles(components, theme),
          ]
        }
      }
    };
  });


  for (const cfg of configs) {
    const sd = new StyleDictionary(cfg);

    /**
     * This transform checks for each token whether that token's value could change
     * due to Tokens Studio theming.
     * Any tokenset from Tokens Studio marked as "enabled" in the $themes.json is considered
     * a set in which any token could change if the theme changes.
     * Any token that is inside such a set or is a reference with a token in that reference chain
     * that is inside such a set, is considered "themeable",
     * which means it could change by theme switching.
     *
     * This metadata is applied to the token so we can use it as a way of filtering outputs
     * later in the "format" stage.
     */
    sd.registerTransform({
      name: "attribute/themeable",
      type: "attribute",
      transform: (token) => {
        function isPartOfEnabledSet(token) {
          const set = token.filePath
              .replace(/^tokens\//g, "")
              .replace(/.json$/g, "");

          return themeableSets.includes(set);
        }

        // Set token to themeable if it's part of an enabled set
        if (isPartOfEnabledSet(token)) {
          return {
            themeable: true,
          };
        }

        // Set token to themeable if it's using a reference and inside the reference chain
        // any one of them is from a themeable set
        if (usesReferences(token.original.value)) {
          const refs = getReferences(token.original.value, sd.tokens);
          if (refs.some((ref) => isPartOfEnabledSet(ref))) {
            return {
              themeable: true,
            };
          }
        }
      },
    });

    await sd.cleanAllPlatforms();
    await sd.buildAllPlatforms();
  }


  console.log('CSS files have been generated.');
}

run();