module.exports = {
  preset: "@testing-library/react-native",
  setupFilesAfterEnv: ["@testing-library/react-native/jest-preset"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
  testMatch: ["<rootDir>/tests/**/*.test.(js|jsx|ts|tsx)"],
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx"],
};
