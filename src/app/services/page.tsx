import type { Metadata } from "next";
import { home } from "@/content/home";
import { autocad, procurement, projectManagement, revit } from "@/content/services";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceCard } from "@/components/sections/blocks";
import { vars } from "@/lib/css";

export const metadata: Metadata = {
  title: home.services.title,
  description: projectManagement.intro.text,
  alternates: { canonical: "/services/" },
};

// First paragraph of each service page, shown on its card.
const intros: Record<string, string> = {
  [`/services/${projectManagement.slug}/`]: projectManagement.intro.text,
  [`/services/${revit.slug}/`]: revit.intro[0].paragraphs[0],
  [`/services/${autocad.slug}/`]: autocad.intro.paragraphs[0],
  [`/services/${procurement.slug}/`]: procurement.intro.text,
};

export default function ServicesPage() {
  return (
    <>
      <PageHero title={home.services.title} crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]} image="bg/services_header" scene="revit" />
      <section className="relative pb-28 pt-10 md:pb-36">
        <div className="container-x grid gap-6 md:grid-cols-2">
          {home.services.items.map((s, i) => (
            <div key={s.href} data-reveal style={vars({ "--reveal-delay": `${(i % 2) * 120}ms` })}>
              <ServiceCard href={s.href} image={s.image} title={s.title} lines={s.lines} index={i}>
                {intros[s.href]}
              </ServiceCard>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
