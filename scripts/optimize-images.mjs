// Converts the original site images in /assets/original into responsive WebP
// files under /public/images and writes a manifest with sizes + blur previews.
// Runs automatically before `next build`; unchanged images are skipped.
import { readdir, mkdir, stat, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const srcDir = path.join(root, "assets", "original");
const outDir = path.join(root, "public", "images");
const manifestPath = path.join(root, "src", "content", "image-manifest.json");

const GROUPS = {
  img: { widths: [480, 960, 1600], quality: 74 },
  bg: { widths: [960, 1600, 2400], quality: 70 },
  gallery: { widths: [640, 1280, 2000], quality: 76 },
};

const isNewer = async (src, out) => {
  try {
    const [a, b] = await Promise.all([stat(src), stat(out)]);
    return a.mtimeMs > b.mtimeMs;
  } catch {
    return true;
  }
};

let previous = {};
try {
  previous = JSON.parse(await readFile(manifestPath, "utf8"));
} catch {}

const manifest = {};
let processed = 0;

for (const [group, cfg] of Object.entries(GROUPS)) {
  const dir = path.join(srcDir, group);
  const files = (await readdir(dir)).filter((f) => /\.(jpe?g|png)$/i.test(f));
  await mkdir(path.join(outDir, group), { recursive: true });

  for (const file of files) {
    const name = file.replace(/\.(jpe?g|png)$/i, "");
    const key = `${group}/${name}`;
    const src = path.join(dir, file);
    const meta = await sharp(src).metadata();
    const widths = [...new Set(cfg.widths.map((w) => Math.min(w, meta.width)))].sort((a, b) => a - b);
    const largest = path.join(outDir, group, `${name}-${widths.at(-1)}.webp`);

    if (previous[key] && !(await isNewer(src, largest))) {
      manifest[key] = previous[key];
      continue;
    }

    for (const w of widths) {
      await sharp(src)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: cfg.quality, effort: 5, alphaQuality: 90 })
        .toFile(path.join(outDir, group, `${name}-${w}.webp`));
    }
    const blur = await sharp(src).resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
    manifest[key] = {
      src: `/images/${group}/${name}`,
      width: meta.width,
      height: meta.height,
      widths,
      blur: `data:image/webp;base64,${blur.toString("base64")}`,
    };
    processed++;
  }
}

// Brand assets: logo, knot icon (favicon / app icon) and social share image.
const logoSrc = path.join(srcDir, "img", "logo.png");
const brandOut = path.join(outDir, "brand");
await mkdir(brandOut, { recursive: true });
if (await isNewer(logoSrc, path.join(root, "public", "og-image.jpg"))) {
  const logo = sharp(logoSrc);
  const { width, height } = await logo.metadata();
  await sharp(logoSrc).resize({ height: 140 }).webp({ quality: 90, alphaQuality: 100 }).toFile(path.join(brandOut, "logo.webp"));
  await sharp(logoSrc).resize({ height: 140 }).png({ compressionLevel: 9 }).toFile(path.join(brandOut, "logo.png"));

  // The interlaced knot sits in the left square of the logo.
  const knotArea = await sharp(logoSrc)
    .extract({ left: 0, top: 0, width: Math.min(height + 20, width), height })
    .png()
    .toBuffer();
  const knot = await sharp(knotArea).trim().png().toBuffer();
  const knotPng = async (size, pad, bg) => {
    const inner = await sharp(knot)
      .resize({ width: size - pad * 2, height: size - pad * 2, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    return sharp({ create: { width: size, height: size, channels: 4, background: bg } })
      .composite([{ input: inner, gravity: "center" }])
      .png({ palette: true, quality: 92, compressionLevel: 9 });
  };
  await (await knotPng(512, 24, { r: 0, g: 0, b: 0, alpha: 0 })).toFile(path.join(brandOut, "knot.png"));
  await (await knotPng(256, 12, { r: 0, g: 0, b: 0, alpha: 0 })).toFile(path.join(root, "src", "app", "icon.png"));
  await (await knotPng(180, 22, { r: 10, g: 10, b: 12, alpha: 1 })).toFile(path.join(root, "src", "app", "apple-icon.png"));

  // 1200x630 share image: logo centred on the brand black with a gold glow.
  const glow = Buffer.from(
    `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="#c9a24a" stop-opacity=".28"/><stop offset="1" stop-color="#0a0a0c" stop-opacity="0"/></radialGradient></defs><rect width="1200" height="630" fill="#0a0a0c"/><rect width="1200" height="630" fill="url(#g)"/><rect x="40" y="40" width="1120" height="550" fill="none" stroke="#c9a24a" stroke-opacity=".45"/></svg>`,
  );
  const logoWide = await sharp(logoSrc).resize({ width: 900 }).png().toBuffer();
  await sharp(glow)
    .composite([{ input: logoWide, gravity: "center" }])
    .jpeg({ quality: 86 })
    .toFile(path.join(root, "public", "og-image.jpg"));
  processed++;
}

await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`images: ${Object.keys(manifest).length} in manifest, ${processed} (re)generated`);
