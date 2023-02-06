import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import svgLoader from "vite-svg-loader";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import commonjs from 'rollup-plugin-commonjs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ vue(), vueJsx(), svgLoader(), dts()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./packages", import.meta.url)),
    },
  },
  build: {
    target: "modules",
    lib: {
      entry: resolve(__dirname, "packages/index.ts"),
      formats: ["es", "umd"],
      fileName: "index",
      name: 'index',
    },
    copyPublicDir: false,
    rollupOptions: {
      external: ["vue", "tdesign-vue-next", "tdesign-icons-vue-next"],
      plugins: [commonjs()],
    },
  },
});
