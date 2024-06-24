export default {
  source: ['./tmp/*.json'],
  preprocessors: ['tokens-studio'],
  platforms: {
    json: {
      buildPath: "dist/json/",
      transformGroup: "tokens-studio",
      files: [
        {
          destination: "variables.json",
          format: "json/nested"
        }
      ]
    }
  }
};