import solidPlugin from "eslint-plugin-solid";
import boundriesPlugin from "eslint-plugin-boundaries";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import globals from "globals";

const FOLDER = "packages/core";
const LAYERS = ["assets", "shared", "entities", "features", "widgets", "pages", "app"];

export default {
  ignores: [`${FOLDER}/src/assets/`, `${FOLDER}/dist/`, `${FOLDER}/vite-plugin/`],
  /** @type {import("eslint").Linter.FlatConfig} */
  configs: {
    files: [`${FOLDER}/src/**/*.{ts,tsx}`],
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
      // eslint-plugin-boundaries
      "boundaries/ignore": [`${FOLDER}/src/index.tsx`],
      "boundaries/elements": LAYERS.map((type) => ({
        type,
        pattern: `${FOLDER}/src/${type}`,
      })),
    },
  },
};
