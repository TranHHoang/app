import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";
import importPlugin from "eslint-plugin-import";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import unicornPlugin from "eslint-plugin-unicorn";
import appDesktop from "./apps/desktop/eslint.config.mjs";
import packageCore from "./packages/core/eslint.config.js";
import packageVitePluginStyledJsx from "./packages/vite-plugin-styled-jsx/eslint.config.js";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    ignores: [
      "**/node_modules/*",
      "**/*.config.*",
      "**/*.d.ts",
      ...appDesktop.ignores,
      ...packageCore.ignores,
      ...packageVitePluginStyledJsx.ignores,
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      globals: globals["shared-node-browser"],
      parserOptions: {
        project: ["./tsconfig.json"],
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      import: importPlugin,
      unicorn: unicornPlugin,
      "simple-import-sort": simpleImportSortPlugin,
    },
    rules: {
      // eslint
      "no-unused-vars": "off", // @typescript-eslint
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../../*"],
            },
          ],
        },
      ],
      eqeqeq: ["error", "smart"],
      "prefer-const": "warn",
      "no-else-return": "warn",
      "no-useless-return": "warn",
      "no-var": "warn",
      "object-shorthand": ["error", "methods"],
      "prefer-arrow-callback": "error",
      "prefer-template": "warn",
      "no-param-reassign": ["warn", { props: false }],

      // Unicorn
      ...unicornPlugin.configs.recommended.rules,
      "unicorn/prevent-abbreviations": "off",
      "unicorn/no-null": "off",
      "unicorn/filename-case": "off",
      "unicorn/no-array-reduce": "off",

      // @typescript-eslint
      ...tsPlugin.configs["eslint-recommended"].rules,
      ...tsPlugin.configs["strict-type-checked"].rules,
      ...tsPlugin.configs["stylistic-type-checked"].rules,
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/ban-ts-comment": ["error", { "ts-ignore": "allow-with-description" }],
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            arguments: false,
            attributes: false,
          },
        },
      ],
      "@typescript-eslint/no-confusing-void-expression": ["error", { ignoreArrowShorthand: true }],
      "@typescript-eslint/member-ordering": "error",

      // import
      ...importPlugin.configs.recommended.rules,
      ...importPlugin.configs.typescript.rules,
      "import/no-unresolved": "error",
      "import/first": "error",
      "import/newline-after-import": "warn",

      // simple-import-sort
      "simple-import-sort/imports": [
        "warn",
        {
          groups: [
            [
              "^\\w",
              "^@",
              // Import alias ~
              "^~(/.*|$)",
              // Side effect imports.
              "^\\u0000",
              // Parent folders
              "^\\.\\.(?!/?$)",
              "^\\.\\./?$",
              // Other relative imports. Put same-folder imports and `.` last.
              "^\\./(?=.*/)(?!/?$)",
              "^\\.(?!/?$)",
              "^\\./?$",
              // Others
              ".",
            ],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts"],
      },
      "import/resolver": {
        typescript: {
          project: ["apps/*/tsconfig.json", "packages/*/tsconfig.json"],
        },
      },
    },
  },
  ...appDesktop.configs,
  packageCore.configs,
  packageVitePluginStyledJsx.configs,
  prettierConfig,
];
