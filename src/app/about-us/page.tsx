import type { Metadata } from "next";
import { about } from "@/content/about";
import { PageHero } from "@/components/sections/PageHero";
import { FramedImage, SectionMark } from "@/components/sections/blocks";
import { Img } from "@/components/ui/Img";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Tilt } from "@/components/ui/Tilt";
import { vars } from "@/lib/css";

export const metadata: Metadata = {
  title: about.title,
  description: about.whoWeAre.paragraphs[0],
  alternates: { canonical: "/about-us/" },
};

/** Renders the approach text with its three pillars picked out in gold. */
function withPillars(text: string) {
  const re = new RegExp(`\\b(${about.approach.pillars.join("|")})\\b`, "g");
  return text.split(re).map((part, i) =>
    about.approach.pillars.includes(part) ? (
      <span key={i} className="font-medium text-gold-200">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHero title={about.title} crumbs={[{ label: "Home", href: "/" }, { label: about.title }]} image="bg/about_header" scene="knot" />

      {/* Who we are */}
      <section className="relative py-24 md:py-32">
        <div className="container-x grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <SectionMark n={1} />
            <SplitHeading text={about.whoWeAre.title} className="text-4xl font-medium sm:text-5xl lg:text-6xl" />
            <div className="mt-10 space-y-6 text-[16.5px] leading-8 text-mist">
              {about.whoWeAre.paragraphs.map((p, i) => (
                <p key={i} data-reveal style={vars({ "--reveal-delay": `${i * 120}ms` })} className={i === 0 ? "text-lg text-fog" : ""}>
                  {p}
                </p>
              ))}
            </div>
          </div>
          <div className="relative grid grid-cols-5 gap-4">
            <div data-reveal="right" className="col-span-3">
              <FramedImage id={about.whoWeAre.images[0]} alt={about.whoWeAre.title} aspect="aspect-[3/4]" sizes="(min-width: 1024px) 30vw, 60vw" />
            </div>
            <div data-reveal="right" style={vars({ "--reveal-delay": "160ms" })} className="col-span-2 mt-20">
              <FramedImage id={about.whoWeAre.images[1]} alt={about.whoWeAre.title} aspect="aspect-[3/5]" sizes="(min-width: 1024px) 20vw, 40vw" />
            </div>
          </div>
        </div>
      </section>

      {/* Approach + pillars */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div aria-hidden className="bg-blueprint mask-radial absolute inset-0 opacity-60" />
        <div className="container-x relative">
          <div className="max-w-4xl">
            <SectionMark n={2} />
            <SplitHeading text={about.approach.title} className="text-4xl font-medium sm:text-5xl lg:text-6xl" />
          </div>
          <div aria-hidden className="mt-14 grid gap-5 md:grid-cols-3">
            {about.approach.pillars.map((p, i) => (
              <div key={p} data-reveal style={vars({ "--reveal-delay": `${i * 120}ms` })}>
                <Tilt className="rounded-3xl">
                  <div className="border-gold-gradient relative flex h-56 flex-col justify-between overflow-hidden rounded-3xl p-8">
                    <span className="font-sans text-xs tracking-[0.35em] text-gold-300/80">0{i + 1}</span>
                    <span className="tilt-pop break-words font-display text-[2.1rem] capitalize leading-tight text-gold sm:text-4xl lg:text-[2.35rem] xl:text-[2.6rem]">{p}</span>
                    <span className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full border border-gold-300/20" />
                    <span className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full border border-gold-300/10" />
                  </div>
                </Tilt>
              </div>
            ))}
          </div>
          <div className="mt-14 grid gap-8 text-[16.5px] leading-8 text-mist md:grid-cols-2 md:gap-14">
            {about.approach.paragraphs.map((p, i) => (
              <p key={i} data-reveal style={vars({ "--reveal-delay": `${i * 120}ms` })}>
                {withPillars(p)}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="relative py-24 md:py-32">
        <div className="container-x grid items-center gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <div data-reveal="left">
            <FramedImage id={about.whyChooseUs.image} alt={about.whyChooseUs.title} aspect="aspect-[4/5]" sizes="(min-width: 1024px) 40vw, 100vw" />
          </div>
          <div>
            <SectionMark n={3} />
            <SplitHeading text={about.whyChooseUs.title} className="text-4xl font-medium sm:text-5xl lg:text-6xl" />
            <div className="mt-10 space-y-6 text-[16.5px] leading-8 text-mist">
              {about.whyChooseUs.paragraphs.map((p, i) => (
                <p key={i} data-reveal style={vars({ "--reveal-delay": `${i * 120}ms` })}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & mission */}
      <section className="relative pb-28 pt-8 md:pb-36">
        <div className="container-x grid gap-6 lg:grid-cols-2">
          {[about.vision, about.mission].map((b, i) => (
            <div key={b.title} data-reveal style={vars({ "--reveal-delay": `${i * 140}ms` })}>
              <Tilt className="h-full rounded-[32px]" max={5}>
                <article className="border-gold-gradient relative h-full overflow-hidden rounded-[32px] p-8 sm:p-12">
                  <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-400/10 blur-3xl" />
                  <div className="tilt-pop relative">
                    <div className="grid h-20 w-20 place-items-center rounded-2xl border border-gold-300/30 bg-ink/60 p-4">
                      <Img id={b.icon} alt="" sizes="80px" className="h-full w-full object-contain" />
                    </div>
                    <h3 className="mt-8 font-sans text-sm font-semibold tracking-[0.35em] text-gold-300">{b.title}</h3>
                    <p className="mt-5 text-lg leading-9 text-fog">{b.text}</p>
                  </div>
                </article>
              </Tilt>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
