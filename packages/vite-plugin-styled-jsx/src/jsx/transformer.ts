import path from "node:path";
import * as babel from "@babel/core";
import { styledJsxPlugin } from "./plugin.js";

interface CompileResult {
  code: string;
  map: babel.BabelFileResult["map"];
  css: string;
}

export async function transform(fileName: string, code: string): Promise<CompileResult> {
  const parserPlugins: NonNullable<NonNullable<babel.TransformOptions["parserOpts"]>["plugins"]> = ["jsx"];
  if (/\.[cm]?tsx?$/i.test(fileName)) {
    parserPlugins.push("typescript");
  }

  const state: { css: string } = { css: "" };

  const result = await babel.transformAsync(code, {
    plugins: [[styledJsxPlugin, state]],
    parserOpts: {
      plugins: parserPlugins,
    },
    filename: path.basename(fileName),
    ast: false,
    sourceMaps: true,
    configFile: false,
    babelrc: false,
    sourceFileName: fileName,
  });

  if (result) return { code: result.code ?? "", map: result.map, css: state.css };
  throw new Error(`Error occured while trying to transform '${fileName}'`);
}
