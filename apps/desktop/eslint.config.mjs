import globals from "globals";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const FOLDER = relative(process.cwd(), dirname(fileURLToPath(import.meta.url)));

export default {
  ignores: [],
  /** @type {import("eslint").Linter.FlatConfig[]} */
  configs: [
    {
      files: [join(FOLDER, "**/*.ts")],
      languageOptions: {
        globals: globals.node,
      },
    },
    {
      files: [join(FOLDER, "src/renderer/*.ts"), join(FOLDER, "src/preload/*.ts")],
      languageOptions: {
        globals: globals.browser,
      },
    },
  ],
};
