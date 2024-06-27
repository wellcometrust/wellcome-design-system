import StyleDictionary from "style-dictionary";
import { registerTransforms } from "@tokens-studio/sd-transforms";

import filterExcludeTokens from "./utils/filters/filterExcludeTokens.js";
import transformToRem from "./utils/transforms/transformtoRem.js";

registerTransforms(StyleDictionary);

const tokenGroups = ["core", "semantic", "collection-core"];

const common = {
  buildPath: "generatedTokens/",
  prefix: "wds",
  transformGroup: "tokens-studio",
};

const sd = new StyleDictionary({
  source: ["tokens/*.json"],
  platforms: {
    css: {
      ...common,
      transforms: ["name/kebab", "custom/rem"],
      files: tokenGroups.map((groupName) => {
        return {
          destination: `css/${groupName}.css`,
          format: "css/variables",
          filter: (token) =>
            token.filePath === `tokens/${groupName}.json` &&
            filterExcludeTokens(token),
        };
      }),
    },
    json: {
      ...common,
      files: [
        {
          destination: "wds-tokes.json",
          format: "json/nested",
          filter: (token) => filterExcludeTokens(token),
        },
      ],
    },
  },
});

sd.registerTransform({
  name: "custom/rem",
  type: "value",
  transitive: true,
  filter: (token) =>
    [
      "sizing",
      "spacing",
      "borderRadius",
      "fontSizes",
      "letterSpacing",
    ].includes(token.type),
  transform: (token) => transformToRem(token.value),
});

sd.buildAllPlatforms();