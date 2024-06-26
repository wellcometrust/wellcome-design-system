import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const tokensFromJson = require('./dist/json/variables.json');

export const tokens = tokensFromJson;
// export const icons = someObjectContainingTheIcons
