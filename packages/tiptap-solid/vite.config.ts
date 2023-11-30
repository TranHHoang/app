import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [solid(), dts({ rollupTypes: true })],
  build: {
    sourcemap: "inline",
    lib: {
      formats: ["es"],
      entry: "src/index.ts",
    },
    emptyOutDir: true,
    rollupOptions: {
      external: [/^solid-js/, /^@tiptap/],
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
});
