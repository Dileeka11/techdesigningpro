import type { Metadata } from "next";
import { projects } from "@/content/projects";
import { PageHero } from "@/components/sections/PageHero";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { RequestInfoBar } from "@/components/sections/RequestInfoBar";
import { imageEntry } from "@/components/ui/Img";

export const metadata: Metadata = {
  title: projects.title,
  alternates: { canonical: "/projects/" },
};

export default function ProjectsPage() {
  const items = projects.images.map((id) => {
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
      <PageHero title={projects.title} crumbs={[{ label: "Home", href: "/" }, { label: projects.title }]} image="bg/about_header" scene="revit" />
      <section className="relative pb-28 pt-6 md:pb-36">
        <div className="container-x space-y-14">
          <RequestInfoBar />
          <GalleryGrid items={items} label={projects.title} />
        </div>
      </section>
    </>
  );
}
