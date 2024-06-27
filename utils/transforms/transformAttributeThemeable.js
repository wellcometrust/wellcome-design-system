import { getReferences, usesReferences } from "style-dictionary/utils";

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

export const transformAttributeThemeable = (token, themeableSets, sdTokens) => {
  function isPartOfEnabledSet(token) {
    const set = token.filePath.replace(/^tokens\//g, "").replace(/.json$/g, "");

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
    const refs = getReferences(token.original.value, sdTokens);
    if (refs.some((ref) => isPartOfEnabledSet(ref))) {
      return {
        themeable: true,
      };
    }
  }
};
