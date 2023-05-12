import json from "../json.ts";
import makeId from "../makeId.ts";

export default async function createChannel(kv: Deno.Kv) {
  const id = makeId();

  await kv.set(["channel", id, "exists"], true);

  return json(200, id);
}
