import { defineConfig } from "cypress";
import path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
      viteConfig: {
        root: path.resolve(__dirname, "packages/front-end"),
        resolve: {
          alias: {
            "@": path.resolve(__dirname, "packages/front-end/src"),
          },
        },
        plugins: [react()],
      },
    },
  },
});