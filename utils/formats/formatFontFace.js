/**
 *
 * @param allTokens
 * @param options
 * @returns {*}
 *
 * @see @see {@link https://github.com/amzn/style-dictionary/blob/main/examples/advanced/font-face-rules/sd.config.js#L18}
 */
export const formatFontFace = (allTokens, options) => {
    const fontPathPrefix = options.fontPathPrefix || '../';

    // https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/src
    const formatsMap = {
        'woff2': 'woff2',
        'woff': 'woff',
        'ttf': 'truetype',
        'otf': 'opentype',
        'svg': 'svg',
        'eot': 'embedded-opentype'
    };

    return allTokens.reduce((fontList, prop) => {
        const {
            attributes: { family, weight, style },
            formats,
            value: path
        } = prop;

        const urls = formats
            .map(extension => `url("${fontPathPrefix}${path}.${extension}") format("${formatsMap[extension]}")`);

        const fontCss = [
            '@font-face {',
            '\n\tfont-display: swap;',
            `\n\tfont-family: "${family}";`,
            `\n\tfont-style: ${style};`,
            `\n\tfont-weight: ${weight};`,
            `\n\tsrc: ${urls.join(',\n\t\t\t ')};`,
            '\n}\n'
        ].join('');

        fontList.push(fontCss);

        return fontList;

    }, []).join('\n');
};