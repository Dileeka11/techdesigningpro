import type { Metadata } from "next";
import { procurement as pr } from "@/content/services";
import { PageHero } from "@/components/sections/PageHero";
import { FeatureGrid, FramedImage, LabeledPoints, SectionMark } from "@/components/sections/blocks";
import { SplitHeading } from "@/components/ui/SplitHeading";

export const metadata: Metadata = {
  title: pr.title,
  description: pr.intro.text,
  alternates: { canonical: `/services/${pr.slug}/` },
};

export default function ProcurementPage() {
  return (
    <>
      <PageHero
        title={pr.title}
        crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services/" }, { label: pr.title }]}
        image="bg/services_header"
        scene="procurement"
      />

      <section className="relative py-20 md:py-28">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
          <div>
            <SectionMark n={1} />
            <SplitHeading as="h3" text={pr.intro.title} className="text-4xl font-medium sm:text-5xl" />
            <p data-reveal className="mt-8 text-lg leading-9 text-fog">
              {pr.intro.text}
            </p>
          </div>
          <div data-reveal="right">
            <FramedImage id={pr.image} alt={pr.title} sizes="(min-width: 1024px) 45vw, 100vw" />
          </div>
        </div>
      </section>

      <section className="relative py-16 md:py-24">
        <div aria-hidden className="bg-blueprint mask-radial absolute inset-0 opacity-50" />
        <div className="container-x relative">
          <FeatureGrid items={pr.features} />
        </div>
      </section>

      <section className="relative py-20 md:py-28">
        <div className="container-x">
          <div data-reveal className="border-gold-gradient relative overflow-hidden rounded-[32px] p-8 sm:p-12 lg:p-16">
            <div aria-hidden className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold-400/10 blur-3xl" />
            <div className="relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <div>
                <SectionMark n={2} />
                <SplitHeading as="h3" text={pr.industries.title} className="text-4xl font-medium sm:text-5xl" />
              </div>
              <p className="text-xl leading-10 text-fog">{pr.industries.text}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative pb-28 pt-10 md:pb-36">
        <div className="container-x">
          <SectionMark n={3} />
          <SplitHeading as="h3" text={pr.why.title} className="mb-12 text-4xl font-medium sm:text-5xl" />
          <LabeledPoints points={pr.why.points} />
        </div>
      </section>
    </>
  );
}
