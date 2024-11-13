import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { isbot } from "isbot";
import { type RenderToPipeableStreamOptions, renderToPipeableStream } from "react-dom/server";
import { type EntryContext, ServerRouter } from "react-router";

const ABORT_DELAY = 10_000;

// noinspection JSUnusedGlobalSymbols
export const streamTimeout = ABORT_DELAY - 50;

// noinspection JSUnusedGlobalSymbols
export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  const ready: keyof RenderToPipeableStreamOptions = isbot(request.headers.get("user-agent"))
    ? "onAllReady"
    : "onShellReady";

  return new Promise((resolve, reject) => {
    let shellRendered = false;

    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={routerContext} url={request.url} abortDelay={ABORT_DELAY} />,
      {
        [ready]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          // biome-ignore lint/style/noParameterAssign: <explanation>
          responseStatusCode = 500;

          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
