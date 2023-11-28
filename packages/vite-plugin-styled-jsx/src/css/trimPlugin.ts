/* eslint-disable @typescript-eslint/ban-types */
// From: https://github.com/vuejs/core/blob/HEAD/packages/compiler-sfc/src/style/pluginTrim.ts
import { PluginCreator } from "postcss";

const trimPlugin: PluginCreator<{}> = () => {
  return {
    postcssPlugin: "styled-jsx-trim",
    Once(root) {
      root.walk(({ type, raws }) => {
        if (type === "rule" || type === "atrule") {
          if (raws.before) raws.before = "\n";
          if ("after" in raws && raws.after) raws.after = "\n";
        }
      });
    },
  };
};

trimPlugin.postcss = true;
export default trimPlugin;
