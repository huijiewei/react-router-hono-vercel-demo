import { env } from "node:process";
import type { Env } from "hono";
import type { BlankEnv } from "hono/types";
import { handle } from "hono/vercel";
import type { ServerBuild } from "react-router";
import { type HonoServerOptions, createHonoServer } from "../base/hono-server";

export type HonoVercelServerOptions<E extends Env = BlankEnv> = HonoServerOptions<E>;

// noinspection JSUnusedGlobalSymbols
export const createHonoVercelServer = async <E extends Env = BlankEnv>(options: HonoVercelServerOptions<E> = {}) => {
  const mode = env.NODE_ENV == "test" ? "development" : env.NODE_ENV;

  // @ts-expect-error it's not typed
  const build = (await import("virtual:react-router/server-build")) as ServerBuild;

  const server = await createHonoServer(mode, build, {
    configure: options.configure,
    getLoadContext: options.getLoadContext,
    honoOptions: options.honoOptions,
  });

  return handle(server);
};
