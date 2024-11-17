import { env } from "node:process";
import { fileURLToPath } from "node:url";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { devServer } from "react-router-plugins/dev-server";
import { nodePreset } from "react-router-plugins/node-preset";
import { vercelPreset } from "react-router-plugins/vercel-preset";
import { defineConfig } from "vite";
import viteInspect from "vite-plugin-inspect";
import tsconfigPaths from "vite-tsconfig-paths";

const appDirectory = "src";

export default defineConfig(({ command, isSsrBuild }) => {
  const isBuild = command == "build";

  const __dirname = fileURLToPath(new URL(".", import.meta.url));

  return {
    plugins: [
      devServer({
        appDirectory: appDirectory,
        entryFile: "server.node.ts",
      }),
      tailwindcss(),
      reactRouter({
        appDirectory: appDirectory,
        presets: [
          env.VERCEL == "1"
            ? vercelPreset({
                regions: "sin1",
                copyParentModules: ["@node-rs/bcrypt"],
                entryFile: "server.vercel.ts",
              })
            : nodePreset({
                entryFile: "server.node.ts",
              }),
        ],
      }),
      tsconfigPaths(),
      !isBuild && viteInspect(),
    ].filter(Boolean),
    build: {
      target: isSsrBuild ? "node20" : "modules",
      cssTarget: ["edge88", "firefox78", "chrome87", "safari14"],
      rollupOptions: {
        output: {
          manualChunks: isSsrBuild
            ? undefined
            : (id) => {
                if (
                  id.includes("/node_modules/react/") ||
                  id.includes("/node_modules/react-dom/") ||
                  id.includes("/node_modules/react-is/") ||
                  id.includes("/node_modules/scheduler/")
                ) {
                  return "react";
                }

                if (
                  id.includes("/node_modules/react-router/") ||
                  id.includes("react-router/with-props") ||
                  id.includes("/node_modules/turbo-stream/")
                ) {
                  return "react-router";
                }
              },
        },
      },
    },
  };
});
