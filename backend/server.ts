import main from "./src/main.ts";

main()
  .catch((error) => {
    console.error(error);
    Deno.exit(1);
  });
