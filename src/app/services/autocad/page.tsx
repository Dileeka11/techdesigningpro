import type { Metadata } from "next";
import { autocad } from "@/content/services";
import { PageHero } from "@/components/sections/PageHero";
import { FramedImage, MediaSplit, SectionMark } from "@/components/sections/blocks";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { vars } from "@/lib/css";

export const metadata: Metadata = {
  title: autocad.title,
  description: autocad.intro.paragraphs[0],
  alternates: { canonical: `/services/${autocad.slug}/` },
};

export default function AutocadPage() {
  return (
    <>
      <PageHero
        title={autocad.title}
        crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services/" }, { label: autocad.title }]}
        image="bg/services_header"
        scene="autocad"
      />

      <section className="relative py-20 md:py-28">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
          <div data-reveal="left">
            <FramedImage id={autocad.intro.image} alt={autocad.title} sizes="(min-width: 1024px) 45vw, 100vw" />
          </div>
          <div>
            <SectionMark n={1} />
            <SplitHeading text={autocad.intro.title} className="text-4xl font-medium sm:text-5xl" />
            <div className="mt-8 space-y-6 text-[16.5px] leading-8 text-mist">
              {autocad.intro.paragraphs.map((p, i) => (
                <p key={i} data-reveal style={vars({ "--reveal-delay": `${i * 120}ms` })} className={i === 0 ? "text-lg text-fog" : ""}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The five drafting phases */}
      <section className="relative pb-28 pt-8 md:pb-36">
        <div className="container-x relative">
          <div className="space-y-24 md:space-y-32">
            {autocad.sections.map((s, i) => (
              <MediaSplit key={s.title} section={s} index={i} reverse={i % 2 === 1} step />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
