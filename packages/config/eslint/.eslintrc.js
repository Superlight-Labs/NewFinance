module.export = {
  parserOptions: {
    sourceType: "module",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json"],
    tsconfigRootDir: ".",
    ecmaVersion: 2022,
    sourceType: "module",
    ecmaFeatures: {
      modules: true,
    },
  },

  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
};
