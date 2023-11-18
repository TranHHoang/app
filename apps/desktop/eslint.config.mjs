import globals from "globals";

const FOLDER = "apps/desktop";

export default {
  ignores: [`${FOLDER}/out/`, `${FOLDER}/dist/`],
  /** @type {import("eslint").Linter.FlatConfig[]} */
  configs: [
    {
      files: [`${FOLDER}/**/*.ts`],
      languageOptions: {
        globals: globals.node,
      },
    },
    {
      files: [`${FOLDER}/src/renderer/*.ts`, `${FOLDER}/src/preload/*.ts`],
      languageOptions: {
        globals: globals.browser,
      },
    },
  ],
};
