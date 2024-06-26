import { promises } from "node:fs";

import StyleDictionary from 'style-dictionary';
import { permutateThemes, registerTransforms } from '@tokens-studio/sd-transforms';

import { generateSemanticFiles } from "./utils/generateSemanticFiles.js";

import { formatFontFace } from "./utils/formats/formatFontFace.js";
import { formatResponsiveCSS } from "./utils/formats/formatResponsiveCSS.js";
import { transformAttributeThemeable } from "./utils/transforms/transformAttributeThemeable.js";
import { transformRem } from "./utils/transforms/transformRem.js";
import { transformFont } from "./utils/transforms/transformFont.js";

const excludedFromSemantic = ["collection-core", "collection-theme", "fonts"];

// Define the array of excluded token paths
const excludedPaths = [
  'asset',
  'annotations'
];

registerTransforms(StyleDictionary);

async function run() {
  const $themes = JSON.parse(await promises.readFile("tokens/$themes.json"));

  const themes = permutateThemes($themes);

  // collect all tokensets for all themes
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
          transforms: ["custom/attribute/themeable", "name/kebab", "custom/rem", "custom/font"],
          buildPath: 'generatedTokens/css/',
          prefix: "wds",
          files: [
            {
              destination: "core.css",
              format: "css/variables",
              filter: 'custom/coreFilter',
            },
            {
              destination: "product/collection.css",
              format: "css/variables",
              filter: 'custom/collectionFilter',
            },
            {
              destination: "fonts.css",
              format: "custom/font-face",
              filter: {
                attributes: {
                  category: "asset",
                  type: "font"
                }
              },
              options: {
                fontPathPrefix: "../../assets/"
              }
            },
            {
              destination: "responsive.css",
              format: "custom/css/responsive",
              filter: "custom/excludeTokens"
            },
            ...generateSemanticFiles(excludedFromSemantic, theme),
          ]
        }
      }
    };
  });


  for (const cfg of configs) {
    const sd = new StyleDictionary(cfg);

    sd.registerFormat({
      name: 'custom/font-face',
      format: ({ dictionary: { allTokens }, options }) => formatFontFace(allTokens, options)

    });

    sd.registerFormat({
      name: 'custom/css/responsive',
      format: ({ dictionary }) => formatResponsiveCSS(dictionary)
    });

    sd.registerTransform({
      name: "custom/attribute/themeable",
      type: "attribute",
      transform: (token) => transformAttributeThemeable(token, themeableSets, sd.tokens),
    });

    sd.registerTransform({
      name: 'custom/font',
      type: 'attribute',
      filter: token =>  token.path[0] === 'asset' && token.path[1] === 'font',
      transform: token => transformFont(token.path)
    });

    sd.registerTransform({
      name: 'custom/rem',
      type: 'value',
      transitive: true,
      filter: token =>
          ['sizing', 'spacing', 'borderRadius', 'fontSizes', 'lineHeights', 'letterSpacing'].includes(
              token.type,
          ),
      transform: token => transformRem(token.value),
    });

    sd.registerFilter({
      name: 'custom/coreFilter',
      filter: (token) => {
        return token.filePath.endsWith("core.json") && !token.filePath.includes("collection") && !token.path.some(part => excludedPaths.includes(part))
      }
    });

    sd.registerFilter({
      name: 'custom/collectionFilter',
      filter: (token) => {
        return token.filePath.includes("collection")
      }
    });

    sd.registerFilter({
      name: 'custom/excludeTokens',
      filter: (prop) => {
        return !prop.path.some(part => excludedPaths.includes(part));
      }
    });

    await sd.cleanAllPlatforms();
    await sd.buildAllPlatforms();
  }


  console.log('CSS files have been generated.');
}

run();