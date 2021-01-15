module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^jose/(.*)$": "<rootDir>/node_modules/jose/dist/node/cjs/$1",
  },
  rootDir: ".",
  roots: ["<rootDir>/src/", "<rootDir>/tests/"],
  testMatch: ["**/?(*.)+(spec|test|tests).+(ts|tsx|js)"],
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  coverageDirectory: "./coverage/",
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!**/node_modules/**",
  ],
  collectCoverage: true,
  reporters: ["default", ["jest-junit", { outputDirectory: "./coverage" }]],
  globals: {
    "ts-jest": {
      diagnostics: true,
      warnOnly: true,
      ignoreCodes: [
        18002, // The ‘files’ list in config file is empty. (it is strongly recommended to include this one)
      ],
      pretty: true,
    },
  },
};
