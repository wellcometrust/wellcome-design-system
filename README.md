# Wellcome Design System

## About
This repo is used to build the [`wellcome-design-system` npm package](https://www.npmjs.com/package/wellcome-design-system) which outputs style values for import into digital products across Wellcome.

Design tokens are created in Figma via [Tokens Studio](https://tokens.studio/) and can be pushed from within the plugin to a branch where they are stored as [`tokens.json`](https://github.com/wellcometrust/wellcome-design-system/blob/main/tokens.json).

This tokens file is then used in conjunction with [Style Dictionary](https://amzn.github.io/style-dictionary/#/) to create style values in various required formats (css, js, tailwind).

(TODO: we're currently only generating a js format)

## Usage
After an approved PR to `main`:

1. Pull the repo
2. Run `npm run build` 
3. Update the version number in package.json with appropriate [semver](https://semver.org/)
4. Run `npm publish`
