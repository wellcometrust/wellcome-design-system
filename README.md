# About

This repo is used to contain the [wellcome-design-system npm package](https://www.npmjs.com/package/@wellcometrust/wellcome-design-system) which outputs style values for import into digital products across Wellcome.

Design tokens are created in Figma via Tokens Studio and can be pushed from within the plugin to a branch where they are stored as tokens.json.

# Usage

## CSS

```css
@import '@wellcometrust/wellcome-design-system/theme.css';

.my-component {
  font-size: var(--font-size-f3);
}
```

## JS

```js
import theme from '@wellcometrust/wellcome-design-system/theme.json';
// or
import { theme } from '@wellcometrust/wellcome-design-system/theme';

const config = {
  'font-size-massive': theme.typography.['size.f6'];
};
```

# Release Process

1. A designer changes a design token in Figma.
2. The designer pushes the changes to the tokens.json file via the Tokens Studio plugin.
3. This creates a pull request in the Github repo.
4. The pull request is assigned to a developer for step 5.
5. The developer makes the necessary changes to the output files (theme.json, theme.css) on the same branch.
6. The developer asks for a review of the pull request from another developer.
7. Once approved, the developer merges the pull request and publishes the new version of the npm package.

## Publishing to NPM

Once a pull request with the necessary changes is merged, the developer:

1. Checks out a new branch, the name isn't particularly important, something appropriate such as `git checkout -b task/updates-version` is fine.
2. Set the package version using the npm cli:

  ```
  npm version <major|minor|patch> -m "Released version %s: <brief_description>"
  ```

3. Runs the following command to publish the new version of the package:

   ```
   npm publish --access public
   ```

4. Push the branch *and the tags* to the Github repo:

  ```
  git push -u origin <branch_name> --follow-tags
  ```

5. Create a pull request against `main`, request a review from other developers
6. Once approved, merge the pull request into `main`.

You can now `npm install @wellcometrust/wellcome-design-system@{version_number|latest}` to use the new version in your project.

## Troubleshooting

1. You must be a member of the @wellcometrust organization on npm to publish changes.
2. Here are instructions on [how to publish to npm](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages#publishing-scoped-public-packages).