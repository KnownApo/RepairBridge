const js = require("@eslint/js");
const prettier = require("eslint-plugin-prettier");

module.exports = [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
    },
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
  {
    files: ["backend/**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        process: "readonly",
        __dirname: "readonly",
        module: "readonly",
        require: "readonly",
      },
    },
  },
];
