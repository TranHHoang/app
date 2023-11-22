import configStandard from "stylelint-config-standard";

/** @type {import("stylelint").Config} */
export default {
  ...configStandard,
  rules: {
    ...configStandard.rules,
    "selector-class-pattern": ["^[a-zA-Z_-][a-zA-Z_0-9-]*$"],
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["deep", "global"],
      },
    ],
  },
  overrides: [
    {
      files: ["**/*.tsx"],
      customSyntax: "postcss-styled-jsx",
    },
  ],
};
