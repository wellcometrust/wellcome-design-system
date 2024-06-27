// filters only tokens originating from semantic sets (not core, not excluded) and also check themeable or not
export const semanticFilter =
  (excluded, themeable = false) =>
  (token) => {
    const tokenThemable = Boolean(token.attributes.themeable);
    return (
      themeable === tokenThemable &&
      ["core", ...excluded].every(
        (cat) => !token.filePath.endsWith(`${cat}.json`),
      )
    );
  };
