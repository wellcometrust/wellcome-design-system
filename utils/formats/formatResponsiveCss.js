export const foramtResponsiveCss = (dictionary) => {
    const deviceTokenName = "artboard";
    const excludeTokens = [deviceTokenName];

    let output = '';

    const excludedTokens = dictionary.allTokens.filter(token => !excludeTokens.some(exclude => token.path.includes(exclude)));
    const filterTokens = (name) => excludedTokens.filter(token => token.path.includes(name) && !token.path.includes(deviceTokenName));

    // Helper function to create CSS variables from tokens
    const createVariables = (tokens) => {
        return tokens.map(token => {
            const name = token.name.replace(/-mobile|-tablet|-desktop/, '');
            return `--${name}: ${token.value};\n`;
        }).join('');
    };

    const findDevice = (name) => {
        return dictionary.allTokens.find(token => token.path.includes(deviceTokenName) && token.name.includes(name))
    }

    // Add mobile first tokens
    const mobileTokens = filterTokens('mobile');
    if (mobileTokens?.length > 0) {
        output += `:root {\n`;
        output += createVariables(mobileTokens);
        output += `}\n\n`;
    }

    // Find artboard values
    const tablet = findDevice('tablet');
    const desktop = findDevice('desktop');

    if (tablet || desktop) {
        // Add tablet tokens inside media query
        const tabletTokens = filterTokens('tablet');

        if (tabletTokens?.length > 0) {
            output += `@media (min-width: ${tablet.value}) {\n`;
            output += `  :root {\n`;
            output += createVariables(tabletTokens);
            output += `  }\n`;
            output += `}\n\n`;
        }

        // Add desktop tokens inside media query
        const desktopTokens = filterTokens('desktop');

        if (desktopTokens?.length > 0) {
            output += `@media (min-width: ${desktop.value}) {\n`;
            output += `  :root {\n`;
            output += createVariables(desktopTokens);
            output += `  }\n`;
            output += `}\n`;
        }

    } else {
        throw new Error('Artboard tokens for tablet or desktop not found.');
    }

    return output;
};