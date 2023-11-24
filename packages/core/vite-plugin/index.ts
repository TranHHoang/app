import { Plugin } from "vite";
import solid from "vite-plugin-solid";
import styledJsx from "@app/vite-plugin-styled-jsx";
import icons from "unplugin-icons/vite";

const path = "../src/";

// Support HMR by rewriting alias to direct source
function hmrAliasPlugin(): Plugin {
  return {
    name: "core-hmr-alias",
    config() {
      return {
        resolve: {
          alias: {
            "@app/core": "@app/core/src/index.tsx",
            "~/": new URL(path, import.meta.url).pathname,
          },
        },
      };
    },
  };
}

export default function plugins({ mode }: { mode: string }): (Plugin | Plugin[])[] {
  if (mode === "development") return [hmrAliasPlugin(), solid(), styledJsx(), icons({ compiler: "solid" })];
  return [];
}
