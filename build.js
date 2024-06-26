import fs from "node:fs";
import { createRequire } from "node:module";
import { registerTransforms } from "@tokens-studio/sd-transforms";
import StyleDictionary from "style-dictionary";
import config from "./config.js";

const require = createRequire(import.meta.url);
const tokens = require("./tokens.json");

function slugify(str) {
  return str
    .replace(/^\s+|\s+$/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Split the tokens.json (from Tokens Studio) into its top-level keys -- useful
// if we want to e.g. prefix variables by their type
Object.entries(tokens).map(([key, value]) => {
  if (key.startsWith("$")) return; // Tokens Studio meta info, not required for variables

  try {
    fs.writeFileSync(`./src/${slugify(key)}.json`, JSON.stringify(value), {
      flag: "w",
    });
  } catch (err) {
    console.log(err);
  }
});

registerTransforms(StyleDictionary);
const sd = new StyleDictionary(config);

sd.cleanAllPlatforms();
sd.buildAllPlatforms();
