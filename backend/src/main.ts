import { serve } from "../deps.ts";
import createChannel from "./handlers/createChannel.ts";
import postToChannel from "./handlers/postToChannel.ts";
import readChannel from "./handlers/readChannel.ts";
import assert from "./helpers/assert.ts";
import json from "./json.ts";
import nil from "./nil.ts";

export default async function main(kv: Deno.Kv) {
  await serve(
    async (req) => {
      if (req.method === "OPTIONS") {
        return new Response(nil, {
          headers: {
            "access-control-allow-origin": "*",
          },
        });
      }

      const url = new URL(req.url);
      const parts = url.pathname.split("/");

      if (url.pathname === "/channel" && req.method === "POST") {
        return await createChannel(kv);
      }

      if (
        url.pathname.startsWith("/channel/") && parts.length === 3 &&
        req.method === "GET"
      ) {
        const id = parts[2];

        let start: number | nil = nil;
        const startParam = url.searchParams.get("start");

        if (typeof startParam === "string") {
          const parsed = JSON.parse(startParam) as unknown;
          assert(typeof parsed === "number");
          start = parsed;
        }

        return await readChannel(kv, id, start);
      }

      if (
        url.pathname.startsWith("/channel/") && parts.length === 3 &&
        req.method === "POST"
      ) {
        const id = parts[2];

        const message = await req.json();

        return await postToChannel(kv, id, message);
      }

      return json(404, "Not found");
    },
    {
      onListen: (listenData) => {
        console.log("Listening", listenData);
      },
      port: 8000,
    },
  );
}
