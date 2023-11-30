import solidPlugin from "eslint-plugin-solid";
import globals from "globals";
import { dirname, join, relative } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const FOLDER = relative(process.cwd(), dirname(fileURLToPath(import.meta.url)));

export default {
  ignores: [],
  /** @type {import("eslint").Linter.FlatConfig} */
  configs: {
    files: [join(FOLDER, "src/**/*.{ts,tsx}")],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: [`./${FOLDER}/tsconfig.json`],
      },
    },
    plugins: {
      solid: solidPlugin,
    },
    rules: {
      // solid
      ...solidPlugin.configs.typescript.rules,
    },
  },
};
