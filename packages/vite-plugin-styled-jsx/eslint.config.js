import globals from "globals";

const FOLDER = "packages/vite-plugin-styled-jsx";

export default {
  ignores: [`${FOLDER}/dist/`],
  /** @type {import("eslint").Linter.FlatConfig} */
  configs: {
    files: [`${FOLDER}/**/*.ts`],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
};
