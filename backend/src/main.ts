import { serve } from "../deps.ts";

export default async function main(_kv: Deno.Kv) {
  await serve(
    () => {
      return new Response("Hello WAX!");
    },
    {
      onListen: (listenData) => {
        console.log("Listening", listenData);
      },
    },
  );
}
