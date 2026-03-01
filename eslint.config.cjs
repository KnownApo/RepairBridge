const js = require("@eslint/js");
const prettier = require("eslint-plugin-prettier");

module.exports = [
  {
    ignores: [
      "node_modules/**",
      "coverage/**",
      "dist/**",
      "reports/**",
      "prototypes/**",
      "modules/unused/**"
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        console: "readonly",
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        fetch: "readonly",
        URL: "readonly",
        Blob: "readonly",
        setTimeout: "readonly",
        Event: "readonly",
        SpeechSynthesisUtterance: "readonly",
        navigator: "readonly",
        HTMLElement: "readonly",
        FileReader: "readonly",
        setInterval: "readonly",
        crypto: "readonly",
        RepairBridgeState: "readonly",
        RepairBridgeConfig: "readonly",
        RepairBridgeAPI: "readonly",
        RepairBridgeDataAdapters: "readonly",
        RepairBridgeLabor: "readonly",
        showNotification: "readonly",
        showSection: "readonly",
        performVehicleSearch: "readonly",
        searchVehicle: "readonly",
        loadSearchHistory: "readonly",
        loadDashboardData: "readonly",
        loadDataAggregatorContent: "readonly",
        loadARDiagnostics: "readonly",
        loadComplianceContent: "readonly",
        module: "readonly",
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
  {
    files: ["backend/**/*.js", "data/**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        process: "readonly",
        __dirname: "readonly",
        module: "readonly",
        require: "readonly",
        console: "readonly",
      },
    },
  },
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        process: "readonly",
        console: "readonly",
      },
    },
  },
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs",
      globals: {
        require: "readonly",
        console: "readonly",
      },
    },
  },
];
