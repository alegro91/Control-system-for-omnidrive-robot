module.exports = {
    transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    },
    testPathIgnorePatterns: ["<rootDir>/node_modules/"],
    testMatch: ["<rootDir>/tests/**/*.test.(js|jsx|ts|tsx)"],
    moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx"],
  };
  