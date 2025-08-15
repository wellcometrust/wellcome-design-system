const fs = require('fs');
const path = require('path');

const themeJsonPath = path.join(__dirname, 'theme.json');
const themeCssPath = path.join(__dirname, 'dist/theme.css');
const themeJsPath = path.join(__dirname, 'dist/theme.js');

function toCssVarsWithMedia(obj, breakpoints, prefix = '--', indent = '  ') {
	let rootVars = '';
	let mediaVars = {};

	for (const key in obj) {
		if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
		const value = obj[key];
		if (
			typeof value === 'object' &&
			value !== null &&
			!Array.isArray(value) &&
			Object.prototype.hasOwnProperty.call(value, 'default')
		) {
			rootVars += `${indent}${prefix}${key}: ${value.default};\n`;
			for (const bp in value) {
				if (bp === 'default') continue;
				if (!breakpoints[bp]) continue;
				if (!mediaVars[bp]) mediaVars[bp] = '';
				mediaVars[bp] += `${indent}${prefix}${key}: ${value[bp]};\n`;
			}
		} else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
			const nested = toCssVarsWithMedia(value, breakpoints, `${prefix}${key}-`, indent);
			rootVars += nested.rootVars;
			for (const bp in nested.mediaVars) {
				if (!mediaVars[bp]) mediaVars[bp] = '';
				mediaVars[bp] += nested.mediaVars[bp];
			}
		} else {
			rootVars += `${indent}${prefix}${key}: ${value};\n`;
		}
	}
	return { rootVars, mediaVars };
}

function toCssCategoryBlocks(theme, breakpoints) {
	let blocks = [];
	for (const category in theme) {
		if (!Object.prototype.hasOwnProperty.call(theme, category)) continue;
		const value = theme[category];
		// Only process objects
		if (typeof value !== 'object' || value === null) continue;
		const { rootVars, mediaVars } = toCssVarsWithMedia(value, breakpoints, `--${category}-`);
		// Remove trailing newline from rootVars
		const trimmedRootVars = rootVars.replace(/\n$/, '');
		let block = `:root {\n${trimmedRootVars}\n}`;
		let mediaBlocks = [];
		for (const bp in mediaVars) {
			// Remove trailing newline from mediaVars[bp]
			let trimmedMediaVars = mediaVars[bp].replace(/\n$/, '');
			// Indent each line of trimmedMediaVars by one levels (2 spaces)
			trimmedMediaVars = trimmedMediaVars.split('\n').map(line => line ? '  ' + line : '').join('\n');
			mediaBlocks.push(`@media (min-width: ${breakpoints[bp]}) {\n  :root {\n${trimmedMediaVars}\n  }\n}`);
		}
		if (mediaBlocks.length > 0) {
			// Add an empty line between :root and first @media, and between each @media
			block += '\n\n' + mediaBlocks.join('\n\n');
		}
		blocks.push(block);
	}
	// Join blocks with a single empty line between them
	return blocks.join('\n\n');
}

function toJs(obj) {
	return 'export const theme = ' + JSON.stringify(obj, null, 2) + ';\n';
}

function main() {
	if (!fs.existsSync(themeJsonPath)) {
		console.error('theme.json not found');
		process.exit(1);
	}

	const theme = JSON.parse(fs.readFileSync(themeJsonPath, 'utf8'));
	const breakpoints = theme.breakpoints || {};

	// Write theme.css
	const css = toCssCategoryBlocks(theme, breakpoints);
	fs.writeFileSync(themeCssPath, css);

	// Write theme.js
	const js = toJs(theme);
	fs.writeFileSync(themeJsPath, js);
}

main();
