/**
 * Helper: transform to codify the font's details as named attributes
 *
 * @see {@link https://github.com/amzn/style-dictionary/blob/main/examples/advanced/font-face-rules/sd.config.js#L8}
 */

export function transformFont(tokenPath) {
    return {
        category: tokenPath[0],
        type: tokenPath[1],
        family: tokenPath[2],
        weight: tokenPath[3],
        style: tokenPath[4]
    }
}