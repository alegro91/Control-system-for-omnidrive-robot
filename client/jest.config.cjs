module.exports = {
  preset: "@testing-library/react-native",
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
  testMatch: ["<rootDir>/tests/**/*.test.(js|jsx|ts|tsx)"],
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx"],
};
