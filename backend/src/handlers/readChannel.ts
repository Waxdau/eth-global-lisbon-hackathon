import json from "../json.ts";

export default async function readChannel(
  kv: Deno.Kv,
  id: string,
  start = 0,
) {
  const firstEntry = await kv.get(["channel", id, 0]);

  if (firstEntry.value !== "created") {
    return json(404, "Channel does not exist");
  }

  const results: unknown[] = [];

  for await (
    const entry of kv.list({
      prefix: ["channel", id],
      start: ["channel", id, start],
    })
  ) {
    results.push(entry.value);
  }

  return json(200, results);
}
