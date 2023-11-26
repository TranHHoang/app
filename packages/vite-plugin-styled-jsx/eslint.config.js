import globals from "globals";
import { dirname, join, relative } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const FOLDER = relative(process.cwd(), dirname(fileURLToPath(import.meta.url)));

export default {
  ignores: [join(FOLDER, "**/scopedPlugin.ts")],
  /** @type {import("eslint").Linter.FlatConfig} */
  configs: {
    files: [join(FOLDER, "**/*.ts")],
    languageOptions: {
      globals: globals.node,
    },
  },
};
