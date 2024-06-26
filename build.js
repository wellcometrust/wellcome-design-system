import StyleDictionary from "style-dictionary";
import { registerTransforms } from "@tokens-studio/sd-transforms";

import filterExcludeTokens from "./utils/filters/filterExcludeTokens.js";
import transformToRem from "./utils/transforms/transformToRem.js";

registerTransforms(StyleDictionary);

const tokenGroups = ["core", "semantic"];

const common = {
  buildPath: "tokens-generated/",
  prefix: "wds",
  transformGroup: "tokens-studio",
};

const sd = new StyleDictionary({
  source: ["tokens-figma/*.json"],
  platforms: {
    css: {
      ...common,
      transforms: ["name/kebab", "custom/rem"],
      files: tokenGroups.map((groupName) => {
        return {
          destination: `css/${groupName}.css`,
          format: "css/variables",
          filter: (token) =>
            token.filePath === `tokens-figma/${groupName}.json` &&
            filterExcludeTokens(token),
        };
      }),
    },
    json: {
      ...common,
      files: [
        {
          destination: "wds-tokens.json",
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

sd.cleanAllPlatforms();
sd.buildAllPlatforms();