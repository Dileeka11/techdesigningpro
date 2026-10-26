import type { Metadata } from "next";
import { revit } from "@/content/services";
import { PageHero } from "@/components/sections/PageHero";
import { FramedImage, MediaSplit, SectionMark } from "@/components/sections/blocks";
import { Tabs } from "@/components/sections/Tabs";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { CountUp } from "@/components/ui/CountUp";
import { vars } from "@/lib/css";

export const metadata: Metadata = {
  title: revit.title,
  description: revit.intro[0].paragraphs.join(" "),
  alternates: { canonical: `/services/${revit.slug}/` },
};

export default function RevitPage() {
  const [revitIntro, bim360] = revit.intro;
  return (
    <>
      <PageHero
        title={revit.title}
        crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services/" }, { label: revit.title }]}
        image="bg/services_header"
        scene="revit"
      />

      {/* Revit + BIM360 introduction */}
      <section className="relative py-20 md:py-28">
        <div className="container-x space-y-28">
          {[revitIntro, bim360].map((block, b) => (
            <div key={block.title} className="grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
              <div className={b ? "lg:order-2" : ""}>
                <SectionMark n={b + 1} />
                <SplitHeading text={block.title} className="text-4xl font-medium sm:text-5xl" />
                <div className="mt-8 space-y-6 text-[16.5px] leading-8 text-mist">
                  {block.paragraphs.map((p, i) => (
                    <p key={i} data-reveal style={vars({ "--reveal-delay": `${i * 120}ms` })} className={i === 0 ? "text-lg text-fog" : ""}>
                      {p}
                    </p>
                  ))}
                </div>
                {b === 1 ? (
                  <div aria-hidden className="mt-10 grid grid-cols-2 gap-4">
                    {[
                      { n: 20, label: "increase in productivity" },
                      { n: 30, label: "reduction in rework" },
                    ].map((s, i) => (
                      <div key={s.n} data-reveal="zoom" style={vars({ "--reveal-delay": `${i * 120}ms` })} className="border-gold-gradient rounded-2xl p-6">
                        <CountUp to={s.n} suffix="%" className="font-display text-5xl text-gold sm:text-6xl" />
                        <p className="mt-2 text-sm text-mist">{s.label}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
              <div data-reveal={b ? "left" : "right"} className={b ? "lg:order-1" : ""}>
                <FramedImage id={block.image} alt={block.title} sizes="(min-width: 1024px) 45vw, 100vw" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The five design stages */}
      <section className="relative pb-28 pt-8 md:pb-36">
        <div className="container-x relative">
          <div className="space-y-24 md:space-y-32">
            {revit.stages.map((s, i) => (
              <MediaSplit key={s.title} section={s} index={i} reverse={i % 2 === 1} step />
            ))}
          </div>
        </div>
      </section>

      {/* Services by discipline */}
      <section className="relative pb-28 pt-8 md:pb-36">
        <div aria-hidden className="bg-blueprint mask-fade-b absolute inset-x-0 top-0 h-[600px] opacity-50" />
        <div className="container-x relative">
          <Tabs tabs={revit.tabs.map((t) => ({ id: t.id, label: t.label }))}>
            {revit.tabs.map((t) => (
              <div key={t.id} className="space-y-24 md:space-y-32">
                {t.sections.map((s, i) => (
                  <MediaSplit key={s.title + i} section={s} index={i} reverse={i % 2 === 1} />
                ))}
              </div>
            ))}
          </Tabs>
        </div>
      </section>
    </>
  );
}
