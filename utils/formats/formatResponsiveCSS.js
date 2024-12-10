import CONSTANTS from "../constants.js";

const createRegex = () => {
  const regexStr = Object.values(CONSTANTS.BREAKPOINTS)
    .map((value) => `-${value}`)
    .join("|");

  return new RegExp(regexStr, "g");
};

const formatResponsiveCSS = (dictionary) => {
  const breakpoints = CONSTANTS.BREAKPOINTS;

  const deviceTokenName = "grid";
  const excludeTokens = [deviceTokenName];

  let output = "";

  const excludedTokens = dictionary.allTokens.filter(
    (token) => !excludeTokens.some((exclude) => token.path.includes(exclude)),
  );

  const filterTokens = (name) =>
    excludedTokens.filter(
      (token) =>
        token.path.includes(name) && !token.path.includes(deviceTokenName),
    );

  // Helper function to create CSS variables from tokens
  const createVariables = (tokens) => {
    return tokens
      .map((token) => {
        const name = token.name.replace(createRegex(), "");
        return `--${name}: ${token.value};\n`;
      })
      .join("");
  };

  const findDevice = (name) => {
    return dictionary.allTokens.find(
      (token) =>
        token.path.includes(deviceTokenName) && token.name.includes(name),
    );
  };

  // Add mobile first tokens
  const mobileTokens = filterTokens(breakpoints.mobile);
  if (mobileTokens?.length > 0) {
    output += `:root {\n`;
    output += createVariables(mobileTokens);
    output += `}\n\n`;
  }

  // Find breakpoint values
  const tablet = findDevice(breakpoints.tablet);
  const desktop = findDevice(breakpoints.desktop);

  if (tablet || desktop) {
    // Add tablet tokens inside media query
    const tabletTokens = filterTokens(breakpoints.tablet);

    if (tabletTokens?.length > 0) {
      output += `@media (min-width: ${tablet.value}) {\n`;
      output += `  :root {\n`;
      output += createVariables(tabletTokens);
      output += `  }\n`;
      output += `}\n\n`;
    }

    // Add desktop tokens inside media query
    const desktopTokens = filterTokens(breakpoints.desktop);

    if (desktopTokens?.length > 0) {
      output += `@media (min-width: ${desktop.value}) {\n`;
      output += `  :root {\n`;
      output += createVariables(desktopTokens);
      output += `  }\n`;
      output += `}\n`;
    }
  } else {
    throw new Error("Tokens for tablet or desktop not found.");
  }

  return output;
};

export default formatResponsiveCSS;