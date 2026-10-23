// Static-hosting fix-ups after `next build` (output: "export").
//
// Next 16 writes route prefetch segments as nested folders, e.g.
//   out/services/revit/__next.services/revit/__PAGE__.txt
// but the browser requests the flattened name
//   out/services/revit/__next.services.revit.__PAGE__.txt
// Next's own server maps one to the other; a plain shared host can't, so we
// write a flattened copy next to each file. No .htaccess magic needed.
import { copyFile, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const out = path.resolve(import.meta.dirname, "..", "out");
let copied = 0;

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "_next" || entry.name === "images") continue;
      if (entry.name.startsWith("__next.")) await flatten(dir, full);
      else await walk(full);
    }
  }
}

async function flatten(pageDir, segDir) {
  const files = [];
  const collect = async (d) => {
    for (const e of await readdir(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) await collect(f);
      else if (e.name.endsWith(".txt")) files.push(f);
    }
  };
  await collect(segDir);
  for (const f of files) {
    const rel = path.relative(pageDir, f).split(path.sep).join(".");
    const target = path.join(pageDir, rel);
    try {
      await stat(target);
    } catch {
      await copyFile(f, target);
      copied++;
    }
  }
}

await walk(out);
console.log(`postbuild: wrote ${copied} flattened prefetch segment files`);

// Sub-folder build: point .htaccess 404 page and old-URL redirects at the base path.
const base = process.env.BASE_PATH?.replace(/\/+$/, "") || "";
if (base) {
  const file = path.join(out, ".htaccess");
  const src = await readFile(file, "utf8");
  await writeFile(
    file,
    src
      .replace(/^ErrorDocument 404 \//m, `ErrorDocument 404 ${base}/`)
      .replace(/^(\s*RewriteRule \S+) \/(\S*) \[R=301,L\]$/gm, `$1 ${base}/$2 [R=301,L]`),
  );
  console.log(`postbuild: .htaccess paths prefixed with ${base}`);
}
