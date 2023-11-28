/* eslint-disable @typescript-eslint/no-non-null-assertion */
import path from "node:path";
import * as vite from "vite";
import { createFilter, Plugin } from "vite";
import "solid-js";
import { transform } from "./jsx/transformer.js";
import { computeHash } from "./utils.js";

declare module "solid-js" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface StyleHTMLAttributes<T> {
      jsx?: boolean;
      global?: boolean;
    }
  }
}

const PLUGIN_NAME = "styled-jsx";

// From: https://github.com/bluwy/whyframe/blob/master/packages/jsx/src/index.js#L27-L37
function repushPlugin(plugins: Plugin[], pluginName: string, pluginNames: string[]): void {
  const namesSet = new Set(pluginNames);

  let baseIndex = -1;
  let targetIndex = -1;
  let targetPlugin: Plugin;
  for (let i = 0, len = plugins.length; i < len; i += 1) {
    const current = plugins[i];
    if (namesSet.has(current!.name) && baseIndex === -1) {
      baseIndex = i;
    }
    if (current?.name === pluginName) {
      targetIndex = i;
      targetPlugin = current;
    }
  }
  if (baseIndex !== -1 && targetIndex !== -1 && baseIndex < targetIndex) {
    plugins.splice(targetIndex, 1);
    plugins.splice(baseIndex, 0, targetPlugin!);
  }
}

export default function styledJsx(): Plugin {
  const styleMap = new Map<string, string>();
  let devServer: vite.ViteDevServer | undefined;

  const jsxFilter = createFilter("**/*.{jsx,tsx}", "**/node_modules/**");
  const virtualModFilter = createFilter(/\0?virtual:styled-jsx\/.+\.css/);

  return {
    name: PLUGIN_NAME,
    enforce: "pre",
    configureServer(server) {
      devServer = server;
    },
    resolveId(id) {
      if (!virtualModFilter(id)) return;
      return `\0${id}`;
    },
    load(id) {
      if (id.startsWith(`\0virtual:${PLUGIN_NAME}`)) {
        const fileName = path.parse(id).name;
        return styleMap.get(fileName);
      }
    },
    async transform(code, file): Promise<vite.TransformResult | undefined> {
      if (!jsxFilter(file)) return;

      const result = await transform(file, code);
      const hashedFileName = computeHash(file);
      if (result.css !== "") styleMap.set(hashedFileName, result.css);

      if (devServer && result.css !== "") {
        const mod = await devServer.moduleGraph.getModuleByUrl(`\0virtual:${PLUGIN_NAME}/${hashedFileName}.css`);
        if (mod) {
          await devServer.reloadModule(mod);
        }
      }

      return { code: result.code, map: null };
    },
    configResolved(config) {
      repushPlugin(config.plugins as Plugin[], "styled-jsx", ["solid"]);
    },
  };
}
