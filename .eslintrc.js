module.exports = {
  root: true,
  extends: [
    "airbnb-typescript/base",
    "plugin:jest/all",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
  ],
  parserOptions: {
    project: "./tsconfig.eslint.json",
  },
};
