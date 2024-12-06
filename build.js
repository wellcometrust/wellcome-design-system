import StyleDictionary from "style-dictionary";
import { registerTransforms } from "@tokens-studio/sd-transforms";

import filterExcludeTokens from "./utils/filters/filterExcludeTokens.js";

import formatFontFace from "./utils/formats/formatFontFace.js";
import formatResponsiveCSS from "./utils/formats/formatResponsiveCSS.js";

import transformFont from "./utils/transforms/transformFont.js";
import transformToRem from "./utils/transforms/transformToRem.js";

registerTransforms(StyleDictionary);

const tokenGroups = ["core", "semantic"];

const common = {
  buildPath: "tokens-generated/",
  prefix: "wds",
  transformGroup: "tokens-studio",
};

const sd = new StyleDictionary({
  source: ["tokens/**/*.json"],
  platforms: {
    css: {
      ...common,
      transforms: ["name/kebab", "custom/rem"],
      files: tokenGroups.map((groupName) => {
        const extraPath =
          groupName === "semantic"
            ? ["breakpoint-lg", "breakpoint-md", "breakpoint-sm"]
            : [];

        return {
          destination: `css/${groupName}.css`,
          format: "css/variables",
          filter: (token) =>
            token.filePath === `tokens/tokens-figma/${groupName}.json` &&
            filterExcludeTokens(token, extraPath),
        };
      }),
    },
    cssResponsive: {
      ...common,
      transforms: ["name/kebab", "custom/rem"],
      files: [
        {
          destination: "css/responsive.css",
          format: "custom/css/responsive",
          filter: (token) => filterExcludeTokens(token),
        },
      ],
    },
    fonts: {
      ...common,
      transforms: ["custom/font"],
      files: [
        {
          destination: "css/fonts.css",
          format: "custom/font-face",
          filter: {
            attributes: {
              category: "asset",
              type: "font",
            },
          },
          options: {
            fontPathPrefix: "../../assets/",
          },
        },
      ],
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

sd.registerFormat({
  name: "custom/font-face",
  format: ({ dictionary: { allTokens }, options }) =>
    formatFontFace(allTokens, options),
});

sd.registerFormat({
  name: "custom/css/responsive",
  format: ({ dictionary }) => formatResponsiveCSS(dictionary),
});

sd.registerTransform({
  name: "custom/font",
  type: "attribute",
  filter: (token) => token.path[0] === "asset" && token.path[1] === "font",
  transform: (token) => transformFont(token.path),
});

sd.registerTransform({
  name: "custom/rem",
  type: "value",
  transitive: true,
  filter: (token) =>
    ["spacing", "borderRadius", "fontSizes", "letterSpacing"].includes(
      token.type,
    ),
  transform: (token) => transformToRem(token.value),
});

sd.cleanAllPlatforms();
sd.buildAllPlatforms();