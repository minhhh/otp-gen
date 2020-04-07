module.exports = {
  files: [
    "tests/**/*.test.*",
    "!tests/exclude-files-in-this-directory",
    "!**/exclude-files-with-this-name.*",
  ],
  match: [],
  concurrency: 5,
  failFast: true,
  failWithoutAssertions: false,
  environmentVariables: {},
  verbose: true,
  require: [],
  nodeArguments: ["--trace-deprecation", "--napi-modules"],
  typescript: {
    rewritePaths: {
      "tests/": "out/tests/",
    },
  },
};
