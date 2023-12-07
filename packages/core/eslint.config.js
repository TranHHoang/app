import boundriesPlugin from "eslint-plugin-boundaries";
import importPlugin from "eslint-plugin-import";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import solidPlugin from "eslint-plugin-solid";
import globals from "globals";
import { dirname, join, relative } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const FOLDER = relative(process.cwd(), dirname(fileURLToPath(import.meta.url)));

const LAYERS = ["packages", "assets", "shared", "entities", "features", "widgets", "pages", "app"];

export default {
  ignores: [join(FOLDER, "src/assets/"), `vite-plugin/`],
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
      boundaries: boundriesPlugin,
      "simple-import-sort": simpleImportSortPlugin,
      import: importPlugin,
    },
    rules: {
      // solid
      ...solidPlugin.configs.typescript.rules,
      // boundaries
      ...boundriesPlugin.configs.strict.rules,
      "boundaries/entry-point": [
        "error",
        {
          default: "disallow",
          rules: [
            {
              target: LAYERS,
              allow: ["**/index.ts"],
            },
            {
              target: ["assets"],
              allow: ["**/*"],
            },
            {
              target: ["packages"],
              allow: ["**/index.d.ts"],
            },
          ],
        },
      ],
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: LAYERS.map((v, index, arr) => ({
            from: arr.slice(index + 1),
            allow: [v],
          })).filter((v) => v.from.length > 0),
        },
      ],
      // simple-import-sort
      "simple-import-sort/imports": [
        "warn",
        {
          groups: [
            [
              // Packages. `solid-js` related packages come first.
              "^solid-js",
              "^@",
              "^\\w",
              // Other layers
              ...LAYERS.map((v) => `^~/${v}(/.*|$)`),
              // Parent folders
              "^\\.\\.(?!/?$)",
              "^\\.\\./?$",
              // Other relative imports. Put same-folder imports and `.` last.
              "^\\./(?=.*/)(?!/?$)",
              "^\\.(?!/?$)",
              "^\\./?$",
              // Side effect imports.
              "^\\u0000",
              // Others
              ".",
            ],
          ],
        },
      ],
    },
    settings: {
      // boundaries
      "boundaries/ignore": [join(FOLDER, "src/index.tsx")],
      "boundaries/elements": [
        ...LAYERS.map((type) => ({
          type,
          pattern: join(FOLDER, `src/${type}`),
        })),
        {
          type: "packages",
          pattern: "packages/tiptap-solid/*",
        },
      ],
      "import/ignore": ["lowlight"], // Issue: https://github.com/import-js/eslint-plugin-import/issues/2556
    },
  },
};
