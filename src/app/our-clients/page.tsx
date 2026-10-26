import type { Metadata } from "next";
import { asset } from "@/lib/basePath";
import { clients } from "@/content/clients";
import { PageHero } from "@/components/sections/PageHero";
import { vars } from "@/lib/css";

export const metadata: Metadata = {
  title: clients.title,
  alternates: { canonical: "/our-clients/" },
};

export default function OurClientsPage() {
  return (
    <>
      <PageHero title={clients.title} crumbs={[{ label: "Home", href: "/" }, { label: clients.title }]} image="bg/about_header" scene="globe" />
      {clients.intro || clients.items.length ? (
        <section className="relative pb-28 pt-6 md:pb-36">
          <div className="container-x">
            {clients.intro ? <p className="mb-12 max-w-3xl text-[16px] leading-8 text-mist">{clients.intro}</p> : null}
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {clients.items.map((c, i) => (
                <li
                  key={c.name}
                  data-reveal
                  style={vars({ "--reveal-delay": `${(i % 4) * 80}ms` })}
                  className="group grid aspect-[3/2] place-items-center rounded-3xl border border-line bg-white p-6 transition-colors duration-500 hover:border-gold-300/70"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset(c.logo)}
                    alt={c.name}
                    loading="lazy"
                    className="max-h-20 w-auto max-w-full object-contain transition duration-500 group-hover:scale-105"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
