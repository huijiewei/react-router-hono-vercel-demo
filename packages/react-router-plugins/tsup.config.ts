import { type Options, defineConfig } from "tsup";

const baseConfig: Options = {
  format: ["esm"],
  platform: "node",
  target: "node20",
  dts: true,
  treeshake: true,
  clean: true,
  minify: true,
};

export default defineConfig([
  {
    ...baseConfig,
    entry: {
      "dev-server": "src/dev-server/index.ts",
    },
  },
  {
    ...baseConfig,
    entry: {
      "node-server": "src/preset-node/server.ts",
      "vercel-server": "src/preset-vercel/server.ts",
    },
    external: ["virtual:react-router/server-build"],
  },
  {
    ...baseConfig,
    entry: {
      "node-preset": "src/preset-node/preset.ts",
      "vercel-preset": "src/preset-vercel/preset.ts",
    },
  },
]);
