import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

const isCypress = process.env.CYPRESS === "true";

export default defineConfig(async () => {
  const plugins = [
    react(),
    tsconfigPaths(),
  ];

  if (!isCypress) {
    const { reactRouter } = await import("@react-router/dev/vite");
    plugins.push(reactRouter());
  }

  return {
    plugins,
    server: {
      hmr: false,
      fs: {
        allow: [
          ".",
          "cypress",
        ],
      },
    },
  };
});