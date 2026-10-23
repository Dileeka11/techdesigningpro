import type { Metadata } from "next";
import { projectManagement as pm } from "@/content/services";
import { PageHero } from "@/components/sections/PageHero";
import { FeatureGrid, FramedImage, LabeledPoints, SectionMark } from "@/components/sections/blocks";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { vars } from "@/lib/css";

export const metadata: Metadata = {
  title: pm.title,
  description: pm.intro.text,
  alternates: { canonical: `/services/${pm.slug}/` },
};

export default function ProjectManagementPage() {
  return (
    <>
      <PageHero
        title={pm.title}
        crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services/" }, { label: pm.title }]}
        image="bg/services_header"
        scene="pm"
      />

      <section className="relative py-20 md:py-28">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
          <div>
            <SectionMark n={1} />
            <SplitHeading text={pm.intro.title} className="text-4xl font-medium sm:text-5xl" />
            <p data-reveal className="mt-8 text-lg leading-9 text-fog">
              {pm.intro.text}
            </p>
          </div>
          <div data-reveal="right">
            <FramedImage id={pm.image} alt={pm.title} sizes="(min-width: 1024px) 45vw, 100vw" />
          </div>
        </div>
      </section>

      <section className="relative py-16 md:py-24">
        <div aria-hidden className="bg-blueprint mask-radial absolute inset-0 opacity-50" />
        <div className="container-x relative">
          <FeatureGrid items={pm.features} />
        </div>
      </section>

      <section className="relative py-20 md:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionMark n={2} />
            <SplitHeading as="h3" text={pm.industries.title} className="text-4xl font-medium sm:text-5xl" />
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {pm.industries.items.map((it, i) => (
              <li
                key={it}
                data-reveal
                style={vars({ "--reveal-delay": `${(i % 2) * 80}ms` })}
                className="group flex items-center gap-4 rounded-2xl border border-line bg-panel/60 px-6 py-5 text-lg text-fog transition-colors duration-500 hover:border-gold-400/50 hover:text-white"
              >
                <span aria-hidden className="h-2.5 w-2.5 shrink-0 rotate-45 bg-gradient-to-br from-gold-100 to-gold-600 transition-transform duration-500 group-hover:rotate-[225deg]" />
                {it}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative pb-28 pt-10 md:pb-36">
        <div className="container-x">
          <SectionMark n={3} />
          <SplitHeading as="h3" text={pm.why.title} className="mb-12 text-4xl font-medium sm:text-5xl" />
          <LabeledPoints points={pm.why.points} />
        </div>
      </section>
    </>
  );
}
