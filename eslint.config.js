import globals from "globals";
import pluginJs from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-plugin-prettier/recommended";

export default [
  {
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      prettier,
    },
  },
  pluginJs.configs.recommended,
  prettierConfig,
];
