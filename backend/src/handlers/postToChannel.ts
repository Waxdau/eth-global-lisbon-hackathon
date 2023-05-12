import assert from "../helpers/assert.ts";
import json from "../json.ts";
import nil from "../nil.ts";

export default async function postToChannel(
  kv: Deno.Kv,
  id: string,
  message: unknown,
) {
  let last: number | nil;

  for await (
    const entry of kv.list({ prefix: ["channel", id] }, { reverse: true })
  ) {
    const [, , n] = entry.key;
    assert(typeof n === "number");
    last = n;
  }

  if (last === nil) {
    return json(400, "Channel does not exist");
  }

  if (JSON.stringify(message).length > 50 * 1024) {
    return json(413, "Content too large");
  }

  const seqNo = last + 1;

  await kv.set(["channel", id, seqNo], message);

  return json(200, seqNo);
}
