// From: https://github.com/vuejs/core/blob/HEAD/packages/compiler-sfc/src/compileStyle.ts
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
import postcss, { LazyResult, Message, ProcessOptions, Result, SourceMap } from "postcss";
import nestingPlugin from "postcss-nesting";
import { RawSourceMap } from "source-map-js";
import scopedPlugin from "./scopedPlugin.js";
import trimPlugin from "./trimPlugin.js";

export interface SFCStyleCompileOptions {
  source: string;
  filename: string;
  id: string;
  scoped?: boolean;
  trim?: boolean;
  isProd?: boolean;
  inMap?: RawSourceMap;
  preprocessOptions?: any;
  preprocessCustomRequire?: (id: string) => any;
  postcssOptions?: any;
  postcssPlugins?: any[];
}

export interface SFCAsyncStyleCompileOptions extends SFCStyleCompileOptions {
  isAsync?: boolean;
  // css modules support, note this requires async so that we can get the
  // resulting json
  modules?: boolean;
}

export interface SFCStyleCompileResults {
  code: string;
  map: RawSourceMap | undefined;
  rawResult: Result | LazyResult | undefined;
  errors: Error[];
  modules?: Record<string, string>;
  dependencies: Set<string>;
}

export function compileStyle(options: SFCStyleCompileOptions): SFCStyleCompileResults {
  return doCompileStyle({
    ...options,
    isAsync: false,
  }) as SFCStyleCompileResults;
}

export function compileStyleAsync(options: SFCAsyncStyleCompileOptions): Promise<SFCStyleCompileResults> {
  return doCompileStyle({
    ...options,
    isAsync: true,
  }) as Promise<SFCStyleCompileResults>;
}

export function doCompileStyle(
  options: SFCAsyncStyleCompileOptions
): SFCStyleCompileResults | Promise<SFCStyleCompileResults> {
  const { filename, id, scoped = true, postcssOptions, postcssPlugins, isAsync, inMap } = options;
  const map = inMap;
  const source = options.source;

  const longId = `s\\:${id}`;
  const plugins = [...(postcssPlugins ?? []), nestingPlugin, trimPlugin()];
  if (scoped) {
    plugins.push(scopedPlugin(longId));
  }

  const postCSSOptions: ProcessOptions = {
    ...postcssOptions,
    to: filename,
    from: filename,
  };
  if (map) {
    postCSSOptions.map = {
      inline: false,
      annotation: false,
      prev: map,
    };
  }

  let result: LazyResult | undefined;
  let code: string | undefined;
  let outMap: SourceMap | undefined;
  // stylus output include plain css. so need remove the repeat item
  const dependencies = new Set<string>([]);
  // sass has filename self when provided filename option
  dependencies.delete(filename);

  const errors: Error[] = [];

  const recordPlainCssDependencies = (messages: Message[]): Set<string> => {
    for (const msg of messages) {
      if (msg.type === "dependency") {
        // postcss output path is absolute position path
        dependencies.add(msg.file as string);
      }
    }
    return dependencies;
  };

  try {
    result = postcss(plugins).process(source, postCSSOptions);

    // In async mode, return a promise.
    if (isAsync) {
      return result
        .then((result) => ({
          code: result.css || "",
          map: result.map.toJSON(),
          errors,
          rawResult: result,
          dependencies: recordPlainCssDependencies(result.messages),
        }))
        .catch((error) => ({
          code: "",
          map: undefined,
          errors: [...errors, error],
          rawResult: undefined,
          dependencies,
        }));
    }

    recordPlainCssDependencies(result.messages);
    // force synchronous transform (we know we only have sync plugins)
    code = result.css;
    outMap = result.map;
  } catch (error) {
    errors.push(error as Error);
  }

  return {
    code: code ?? ``,
    map: outMap && outMap.toJSON(),
    errors,
    rawResult: result,
    dependencies,
  };
}
