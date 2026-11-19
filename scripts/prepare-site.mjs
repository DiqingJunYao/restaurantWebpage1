import { copyFile, cp, mkdir } from "node:fs/promises";

const output = new URL("../dist/", import.meta.url);
await mkdir(output, { recursive: true });

await Promise.all([
  ...["index.html", "menu.html", "contact.html"].map((page) =>
    copyFile(new URL(`../${page}`, import.meta.url), new URL(page, output)),
  ),
  cp(new URL("../assets/", import.meta.url), new URL("assets/", output), {
    recursive: true,
  }),
]);
