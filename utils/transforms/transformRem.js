/**
 * Helper: Transforms dimensions to px
 *
 * @see {@link https://github.com/tokens-studio/sd-transforms/blob/5c536eb46031942de035d58a327f2871ca146d90/src/transformRem.ts}
 */

function getBasePxFontSize(options) {
    return options?.basePxFontSize || 16;
}

export function transformRem(tokenValue, options) {
    if (tokenValue === undefined) {
        return tokenValue;
    }

    if (`${tokenValue}`.endsWith('rem')) {
        return `${tokenValue}`;
    }

    const value = parseFloat(`${tokenValue}`);

    if (value === 0) {
        return '0';
    }

    const baseFont = getBasePxFontSize(options);

    return `${value / baseFont}rem`;
}