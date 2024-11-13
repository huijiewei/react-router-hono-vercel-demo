import { createHonoNodeServer } from "react-router-plugins/node-server";
import { getLoadContext } from "~/server.base";

export const server = await createHonoNodeServer({
  getLoadContext: getLoadContext,
});
