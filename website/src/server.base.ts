import { env } from "node:process";
import type { HttpBindings } from "@hono/node-server";
import type { Context } from "hono";
import type { HonoServerOptions } from "react-router-plugins/node-server";
import { getClientIp, getRequestOrigin } from "~/utils/http";

export const getLoadContext: HonoServerOptions["getLoadContext"] = (c: Context<{ Bindings: HttpBindings }>) => {
  const proxy = env.RX_PROXY == 1;

  return {
    remoteAddress: getClientIp(c.req.raw, c.env.incoming.socket, {
      proxy: proxy,
      proxyCount: env.RX_PROXY_COUNT,
    }),
    requestOrigin: getRequestOrigin(c.req.raw, c.env.incoming.socket, proxy),
  };
};
