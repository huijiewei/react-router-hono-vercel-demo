import { env } from "node:process";
import type { Config } from "@react-router/dev/config";
import { nodePreset } from "react-router-plugins/node-preset";
import { vercelPreset } from "react-router-plugins/vercel-preset";

const appDirectory = "src";

export default {
  ssr: true,
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
} satisfies Config;
