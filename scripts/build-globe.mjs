// Generates the dotted-continent data used by the 3D office globe.
// Points are spread evenly over a sphere (Fibonacci lattice) and only the ones
// that fall on land are kept. Output: /public/data/globe-land.json
// (flat array of [lat*10, lng*10] integers to keep the file tiny).
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { geoContains } from "d3-geo";
import { feature } from "topojson-client";

const root = path.resolve(import.meta.dirname, "..");
const topo = JSON.parse(await readFile(path.join(root, "node_modules", "world-atlas", "land-110m.json"), "utf8"));
const land = feature(topo, topo.objects.land);

const N = 22000;
const golden = Math.PI * (3 - Math.sqrt(5));
const out = [];
for (let i = 0; i < N; i++) {
  const y = 1 - (i / (N - 1)) * 2;
  const theta = golden * i;
  const lat = (Math.asin(y) * 180) / Math.PI;
  const lng = ((((theta * 180) / Math.PI) % 360) + 540) % 360 - 180;
  if (lat < -60) continue; // skip Antarctica, it only adds noise at the bottom
  if (geoContains(land, [lng, lat])) out.push(Math.round(lat * 10), Math.round(lng * 10));
}

await mkdir(path.join(root, "public", "data"), { recursive: true });
await writeFile(path.join(root, "public", "data", "globe-land.json"), JSON.stringify(out));
console.log(`globe: ${out.length / 2} land points`);
