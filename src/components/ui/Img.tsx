import manifest from "@/content/image-manifest.json";
import { asset } from "@/lib/basePath";

type Entry = { src: string; width: number; height: number; widths: number[]; blur: string };
const images = manifest as Record<string, Entry>;

export function imageEntry(id: string): Entry {
  const entry = images[id];
  if (!entry) throw new Error(`Unknown image "${id}" – run \`npm run images\``);
  return { ...entry, src: asset(entry.src) };
}

export function imageUrl(id: string, maxWidth = 1600) {
  const e = imageEntry(id);
  const w = e.widths.filter((x) => x <= maxWidth).at(-1) ?? e.widths[0];
  return `${e.src}-${w}.webp`;
}

type Props = {
  id: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
  /** Stretch to cover the parent (parent must be positioned). */
  fill?: boolean;
};

/**
 * Responsive WebP image with a blurred placeholder baked in as a background,
 * fixed dimensions to avoid layout shift and native lazy loading.
 */
export function Img({ id, alt, sizes = "(min-width: 1024px) 50vw, 100vw", className = "", priority, fill }: Props) {
  const e = imageEntry(id);
  const srcSet = e.widths.map((w) => `${e.src}-${w}.webp ${w}w`).join(", ");
  const mid = e.widths[Math.min(1, e.widths.length - 1)];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${e.src}-${mid}.webp`}
      srcSet={srcSet}
      sizes={sizes}
      width={e.width}
      height={e.height}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      className={`${fill ? "absolute inset-0 h-full w-full object-cover" : ""} ${className}`}
      style={{ backgroundImage: `url(${e.blur})`, backgroundSize: "cover", backgroundPosition: "center" }}
    />
  );
}
