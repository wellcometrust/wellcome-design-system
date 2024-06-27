// Define the array of excluded token paths
const excludedPaths = ["asset", "annotations"];

const filterExcludeTokens = (token) =>
  !token.path.some((part) => excludedPaths.includes(part));

export default filterExcludeTokens;
