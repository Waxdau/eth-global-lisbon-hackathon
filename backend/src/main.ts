import { serve } from "../deps.ts";

export default async function main() {
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
