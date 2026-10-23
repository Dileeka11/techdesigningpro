import type { Metadata } from "next";
import { gallery } from "@/content/gallery";
import { PageHero } from "@/components/sections/PageHero";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { imageEntry } from "@/components/ui/Img";

export const metadata: Metadata = {
  title: gallery.title,
  alternates: { canonical: "/gallery/" },
};

export default function GalleryPage() {
  const items = gallery.images.map((id) => {
    const e = imageEntry(id);
    return {
      id,
      src: `${e.src}-${e.widths[1] ?? e.widths[0]}.webp`,
      srcSet: e.widths.map((w) => `${e.src}-${w}.webp ${w}w`).join(", "),
      full: `${e.src}-${e.widths.at(-1)}.webp`,
      width: e.width,
      height: e.height,
      blur: e.blur,
    };
  });

  return (
    <>
      <PageHero title={gallery.title} crumbs={[{ label: "Home", href: "/" }, { label: gallery.title }]} image="bg/about_header" scene="gallery" />
      <section className="relative pb-28 pt-10 md:pb-36">
        <div className="container-x">
          <GalleryGrid items={items} label={gallery.title} />
        </div>
      </section>
    </>
  );
}
