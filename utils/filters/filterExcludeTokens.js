// Define the array of excluded token paths
const excludedPaths = ["asset", "annotations"];

const filterExcludeTokens = (token, extraPaths = []) => {
  const allExcludedPaths = [...excludedPaths, ...extraPaths];

  return !token.path.some((part) => allExcludedPaths.includes(part));
};

export default filterExcludeTokens;