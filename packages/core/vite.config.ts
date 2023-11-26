import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";
import styledJsx from "@app/vite-plugin-styled-jsx";
import dts from "vite-plugin-dts";
import icons from "unplugin-icons/vite";

export default defineConfig({
  plugins: [icons({ compiler: "solid" }), solid(), styledJsx(), tsconfigPaths(), dts({ rollupTypes: true })],
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
      external: ["vite-plugin-solid", "vite", "@app/vite-plugin-styled-jsx", "unplugin-icons/vite"],
      output: {
        entryFileNames: "[name].js",
        intro(chunkInfo) {
          if (chunkInfo.name === "index") {
            return `import "./style.css"`;
          }
          return "";
        },
      },
    },
  },
});
