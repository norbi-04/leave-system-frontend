import { defineConfig } from "cypress";

export default defineConfig({
  env: {
    CYPRESS: "true",
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
