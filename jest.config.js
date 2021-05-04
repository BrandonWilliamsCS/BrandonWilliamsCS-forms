module.exports = {
  transform: { "^.+\\.tsx?$": "ts-jest" },
  testRegex: "./src/.*\\.(test|spec)\\.(ts|tsx)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleDirectories: ["node_modules", "src"],
};
