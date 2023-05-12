import main from "./src/main.ts";

try {
  const kv = await Deno.openKv();
  await main(kv);
} catch (error) {
  console.error(error);
  Deno.exit(1);
}
