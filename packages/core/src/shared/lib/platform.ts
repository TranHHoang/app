import { createContext, useContext } from "solid-js";

export type PlatformConfigs = Partial<{
  openTextFile: () => Promise<{ name: string; content: string } | null>;
  /** @returns {string} The name of written file */
  saveTextFile: (name: string | null, content: string) => Promise<string | null>;
}>;

export function createPlatformConfigs(configs: PlatformConfigs): Readonly<Required<PlatformConfigs>> {
  return {
    openTextFile: configs.openTextFile ?? stub,
    saveTextFile: configs.saveTextFile ?? stub,
  };
}

export const PlatformConfigsCtx = createContext<ReturnType<typeof createPlatformConfigs>>();

export function usePlatformConfigs(): ReturnType<typeof createPlatformConfigs> {
  const ctx = useContext(PlatformConfigsCtx);
  if (!ctx) throw new Error("usePlatformConfigs must be used within PlatformConfigsProvider");
  return ctx;
}

function stub(): never {
  throw new Error("Not implemented");
}
