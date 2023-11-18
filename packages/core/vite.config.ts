import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";
import styledJsx from "@app/vite-plugin-styled-jsx";
import dts from "vite-plugin-dts";

export default defineConfig(({ mode }) => ({
  plugins: [solid(), styledJsx(), tsconfigPaths(), dts({ rollupTypes: true })],
  build: {
    sourcemap: "inline",
    lib: {
      formats: ["es"],
      entry: {
        index: "src/index.tsx",
        vite: "vite-plugin/index.ts",
      },
    },
    emptyOutDir: true,
    rollupOptions: {
      external: ["vite-plugin-solid", "vite", "@app/vite-plugin-styled-jsx"],
      output: {
        entryFileNames: "[name]",
        intro(chunkInfo) {
          if (chunkInfo.name === "index") {
            return `import "./style.css"`;
          }
          return "";
        },
      },
    },
  },
}));
