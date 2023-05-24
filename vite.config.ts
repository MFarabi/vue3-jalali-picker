import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

// https://vitejs.dev/config/
export default defineConfig({
  // resolve: {
  //   alias: {
  //     "@/": new URL("./src/", import.meta.url).pathname,
  //   },
  // },
  plugins: [vue(), cssInjectedByJsPlugin()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "DatePicker",
      fileName: (format) => `date-picker.${format}.js`,
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
