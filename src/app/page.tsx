import { home } from "@/content/home";
import { site } from "@/content/site";
import { Img } from "@/components/ui/Img";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Magnetic } from "@/components/ui/Magnetic";
import { LazyScene } from "@/components/three/LazyScene";
import { Showreel } from "@/components/showreel/Showreel";
import { FramedImage, SectionMark, ServiceCard } from "@/components/sections/blocks";
import { OfficeList } from "@/components/sections/OfficeList";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { vars } from "@/lib/css";

// Technologies named in the original "Who We Are" text, used for the marquee.
const TECH = ["Project Management", "Revit", "BIM360", "AutoCAD", "Procurement Management (FF & E)"];

export default function HomePage() {
  return (
    <>
      {/* ------------------------------------------------------------ HERO */}
      <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-30 opacity-[0.28]">
          <Img id="bg/intro_bg" alt="" fill sizes="100vw" className="object-cover object-bottom" />
        </div>
        <div aria-hidden className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_70%_40%,rgba(214,170,72,0.18),transparent_55%),linear-gradient(90deg,#070709_10%,rgba(7,7,9,0.75)_55%,rgba(7,7,9,0.35))]" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-20 h-48 bg-gradient-to-t from-ink to-transparent" />
        <LazyScene scene="hero" eager className="absolute inset-0 -z-10 opacity-60 md:opacity-100" />

        <div className="container-x flex flex-1 items-center pb-24 pt-36 md:pt-44">
          <div className="max-w-3xl">
            <h4 className="fade-up flex items-center gap-4 font-sans text-sm font-medium uppercase tracking-[0.35em] text-gold-300 sm:text-base" style={vars({ "--d": "100ms" })}>
              <span aria-hidden className="h-px w-12 bg-gold-300" />
              {home.hero.kicker}
            </h4>
            <SplitHeading
              as="h1"
              auto
              delay={250}
              text={home.hero.title}
              gold={["Reality!"]}
              className="mt-6 text-[3.1rem] font-medium leading-[1.02] sm:text-7xl lg:text-[6.2rem]"
            />
            <div className="fade-up mt-12 flex flex-wrap items-center gap-4" style={vars({ "--d": "900ms" })}>
              <Magnetic>
                <a href={site.phoneHref} className="btn btn-gold">
                  <PhoneIcon width={18} height={18} />
                  {home.hero.cta}
                </a>
              </Magnetic>
              <Magnetic>
                <a href={site.whatsappHref} target="_blank" rel="noopener" className="btn btn-ghost">
                  <WhatsAppIcon width={18} height={18} />
                  {site.consultNow}
                </a>
              </Magnetic>
            </div>
          </div>
        </div>

        {/* Technology marquee */}
        <div aria-hidden className="relative border-y border-line bg-ink/80 py-5">
          <div className="flex w-max animate-marquee">
            {[0, 1].map((k) => (
              <div key={k} className="flex shrink-0 items-center">
                {[...TECH, ...TECH].map((t, i) => (
                  <span key={i} className="flex items-center gap-10 pr-10 font-display text-xl text-fog/80 sm:text-2xl">
                    {t}
                    <span className="h-2 w-2 rotate-45 bg-gold-300/80" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ WHO WE ARE */}
      <section className="relative py-24 md:py-36">
        <div aria-hidden className="absolute -left-40 top-1/3 h-[480px] w-[480px] rounded-full bg-gold-500/10 blur-[140px]" />
        <div className="container-x grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="relative order-2 lg:order-1">
            <div data-reveal="left" className="relative w-[82%]">
              <FramedImage id={home.whoWeAre.images[0]} alt={home.whoWeAre.title} aspect="aspect-[4/5]" sizes="(min-width: 1024px) 40vw, 80vw" />
            </div>
            <div data-reveal="zoom" style={vars({ "--reveal-delay": "200ms" })} className="absolute -bottom-10 right-0 w-[52%] rounded-2xl border-4 border-ink shadow-2xl">
              <FramedImage id={home.whoWeAre.images[1]} alt={home.whoWeAre.title} aspect="aspect-square" sizes="(min-width: 1024px) 25vw, 50vw" />
            </div>
            <div
              aria-hidden
              className="absolute -right-2 top-6 select-none font-display text-[9rem] leading-none text-transparent [-webkit-text-stroke:1px_rgba(228,191,101,0.35)] sm:text-[12rem]"
            >
              20<span className="text-gold-300/60 [-webkit-text-stroke:0]">+</span>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <SectionMark n={1} />
            <SplitHeading text={home.whoWeAre.title} className="text-4xl font-medium sm:text-5xl lg:text-6xl" />
            <div className="mt-10 space-y-6 text-[16.5px] leading-8 text-mist">
              {home.whoWeAre.paragraphs.map((p, i) => (
                <p key={i} data-reveal style={vars({ "--reveal-delay": `${i * 120}ms` })} className={i === 0 ? "text-lg leading-8 text-fog" : ""}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ SHOWREEL (Remotion) */}
      <section className="relative py-12 md:py-20">
        <div className="container-x">
          <div data-reveal="zoom" className="relative rounded-[32px] border border-line-strong p-2 shadow-[0_60px_120px_-40px_rgba(214,170,72,0.25)] md:p-3">
            <div aria-hidden className="absolute -inset-px -z-10 rounded-[32px] bg-gradient-to-br from-gold-300/40 via-transparent to-gold-600/30" />
            <div className="overflow-hidden rounded-[24px]">
              <Showreel />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ SERVICES */}
      <section className="relative py-24 md:py-32">
        <div className="container-x">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionMark n={2} />
              <SplitHeading text={home.services.title} className="text-4xl font-medium sm:text-5xl lg:text-6xl" />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {home.services.items.map((s, i) => (
              <div key={s.href} data-reveal style={vars({ "--reveal-delay": `${i * 100}ms` })}>
                <ServiceCard href={s.href} image={s.image} title={s.title} lines={s.lines} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ WHY CHOOSE US */}
      <section className="relative overflow-hidden py-24 md:py-36">
        <div aria-hidden className="bg-blueprint mask-radial absolute inset-0 opacity-70" />
        <div className="container-x relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionMark n={3} />
            <SplitHeading text={home.whyChooseUs.title} className="text-4xl font-medium sm:text-5xl lg:text-6xl" />
            <ul aria-hidden className="mt-10 flex flex-wrap gap-3">
              {TECH.map((t, i) => (
                <li
                  key={t}
                  data-reveal="zoom"
                  style={vars({ "--reveal-delay": `${i * 70}ms` })}
                  className="rounded-full border border-gold-400/30 bg-gold-400/5 px-4 py-2 text-sm text-gold-100"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-10">
            {home.whyChooseUs.paragraphs.map((p, i) => (
              <div key={i} data-reveal style={vars({ "--reveal-delay": `${i * 120}ms` })} className="border-gold-gradient rounded-3xl p-8 md:p-10">
                <span aria-hidden className="font-display text-5xl text-gold-300/40">“</span>
                <p className="-mt-4 text-lg leading-9 text-fog">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ CTA + GLOBE */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="container-x">
          <div className="relative isolate overflow-hidden rounded-[36px] border border-line-strong bg-panel">
            <div aria-hidden className="absolute inset-0 -z-10 opacity-25">
              <Img id="bg/services_bg" alt="" fill sizes="100vw" />
            </div>
            <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
            <div className="grid items-center lg:grid-cols-2">
              <div className="p-8 sm:p-12 lg:p-16">
                <h2 className="text-4xl font-medium sm:text-5xl lg:text-[3.6rem]">
                  <span data-reveal className="block text-gold">
                    {home.cta.title}
                  </span>
                  <span data-reveal style={vars({ "--reveal-delay": "150ms" })} className="mt-4 block text-2xl leading-snug text-fog sm:text-3xl">
                    {home.cta.text}
                  </span>
                </h2>
                <div data-reveal style={vars({ "--reveal-delay": "300ms" })} className="mt-10 flex flex-wrap items-center gap-4">
                  <Magnetic>
                    <a href={site.phoneHref} className="btn btn-gold">
                      <PhoneIcon width={18} height={18} />
                      {home.cta.button}
                    </a>
                  </Magnetic>
                  <a href={site.whatsappHref} target="_blank" rel="noopener" aria-label={`WhatsApp ${site.phone}`} className="btn btn-ghost w-[3.25rem] px-0">
                    <WhatsAppIcon width={20} height={20} />
                  </a>
                </div>
                <OfficeList className="mt-12" />
              </div>
              <LazyScene scene="globe" className="relative h-[380px] w-full sm:h-[460px] lg:h-[560px]" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
