import { serve } from "../deps.ts";
import createChannel from "./handlers/createChannel.ts";
import json from "./json.ts";
import nil from "./nil.ts";

/*
  POST /channel -> id
  GET /channel/{id}?from=seq
  POST /channel/{id}
*/

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

      if (url.pathname === "/channel" && req.method === "POST") {
        return await createChannel(kv);
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
