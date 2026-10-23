import Link from "next/link";
import type { ReactNode } from "react";
import type { DetailSection, Feature, LabeledPoint } from "@/content/services";
import { Img } from "@/components/ui/Img";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Tilt } from "@/components/ui/Tilt";
import { ArrowUpRightIcon } from "@/components/ui/Icons";
import { vars } from "@/lib/css";

const pad = (n: number) => String(n).padStart(2, "0");

/** Decorative section number + gold rule (no text, purely visual). */
export function SectionMark({ n, className = "" }: { n: number; className?: string }) {
  return (
    <div aria-hidden data-reveal className={`mb-6 flex items-center gap-4 font-sans text-xs tracking-[0.35em] text-gold-300/80 ${className}`}>
      <span>{pad(n)}</span>
      <span className="h-px w-16 bg-gradient-to-r from-gold-300/70 to-transparent" />
    </div>
  );
}

/** Framed image with corner brackets and scroll parallax. */
export function FramedImage({ id, alt, className = "", sizes, aspect = "aspect-[4/3]" }: { id: string; alt: string; className?: string; sizes?: string; aspect?: string }) {
  return (
    <div className={`corners ${className}`}>
      <div className={`img-zoom relative overflow-hidden rounded-2xl border border-line ${aspect}`}>
        <div className="parallax-img absolute inset-0">
          <Img id={id} alt={alt} fill sizes={sizes} />
        </div>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
      </div>
    </div>
  );
}

/** Text + image row used by the AutoCAD and Revit detail sections. */
export function MediaSplit({ section, index, reverse, step }: { section: DetailSection; index: number; reverse?: boolean; step?: boolean }) {
  const long = (section.list?.length ?? 0) > 6;
  return (
    <article className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className={reverse ? "lg:order-2" : ""}>
        <div className="flex items-start gap-5">
          {step ? (
            <span
              aria-hidden
              data-reveal="zoom"
              className="hidden shrink-0 font-display text-6xl leading-none text-transparent [-webkit-text-stroke:1px_rgba(228,191,101,0.6)] sm:block"
            >
              {pad(index + 1)}
            </span>
          ) : null}
          <div className="min-w-0">
            <SplitHeading as="h3" text={section.title} className="draw-line text-2xl font-medium sm:text-3xl" />
            <div className="mt-8 space-y-4 text-[15.5px] leading-8 text-mist">
              {section.paragraphs.map((p, i) => (
                <p key={i} data-reveal style={vars({ "--reveal-delay": `${i * 80}ms` })}>
                  {p}
                </p>
              ))}
            </div>
            {section.subsections ? (
              <div className="mt-8 space-y-6">
                {section.subsections.map((s, i) => (
                  <div key={s.title} data-reveal style={vars({ "--reveal-delay": `${i * 60}ms` })} className="border-l border-gold-400/40 pl-5">
                    <h4 className="font-sans text-sm font-semibold tracking-[0.12em] text-gold-200">{s.title}</h4>
                    <p className="mt-2 text-[15px] leading-7 text-mist">{s.text}</p>
                  </div>
                ))}
              </div>
            ) : null}
            {section.list ? (
              <div data-reveal className="mt-8 rounded-2xl border border-line bg-panel/60 p-6">
                {section.listTitle ? <h4 className="mb-4 font-sans text-xs font-semibold tracking-[0.18em] text-gold-300">{section.listTitle}</h4> : null}
                <ul className={`gold-list grid gap-x-8 gap-y-2.5 text-[15px] text-fog ${long ? "sm:grid-cols-2" : ""}`}>
                  {section.list.map((li, i) => (
                    <li key={i}>{li}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {section.image ? (
        <div data-reveal={reverse ? "left" : "right"} className={reverse ? "lg:order-1" : ""}>
          <FramedImage id={section.image} alt={section.title} sizes="(min-width: 1024px) 45vw, 100vw" />
        </div>
      ) : null}
    </article>
  );
}

/** Grid of feature cards (Project Management / Procurement). */
export function FeatureGrid({ items }: { items: Feature[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((f, i) => (
        <div key={f.title} data-reveal style={vars({ "--reveal-delay": `${(i % 3) * 90}ms` })}>
          <Tilt className="group h-full rounded-3xl">
            <div className="border-gold-gradient relative h-full overflow-hidden rounded-3xl p-7 transition-colors duration-500">
              <div aria-hidden className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold-400/10 blur-2xl transition-all duration-700 group-hover:bg-gold-400/25" />
              <div className="tilt-pop">
                <span aria-hidden className="font-display text-4xl text-transparent [-webkit-text-stroke:1px_rgba(228,191,101,0.55)]">
                  {pad(i + 1)}
                </span>
                <h5 className="mt-5 text-xl font-medium">{f.title}</h5>
                <p className="mt-3 text-[15px] leading-7 text-mist">{f.text}</p>
              </div>
            </div>
          </Tilt>
        </div>
      ))}
    </div>
  );
}

/** "Why Choose us?" points with bold labels. */
export function LabeledPoints({ points }: { points: LabeledPoint[] }) {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {points.map((p, i) => (
        <li
          key={p.label}
          data-reveal
          style={vars({ "--reveal-delay": `${(i % 2) * 90}ms` })}
          className="group relative overflow-hidden rounded-2xl border border-line bg-panel/70 p-6 transition-colors duration-500 hover:border-gold-400/40"
        >
          <span aria-hidden className="absolute left-0 top-0 h-full w-px origin-top scale-y-0 bg-gradient-to-b from-gold-200 to-gold-600 transition-transform duration-700 group-hover:scale-y-100" />
          <p className="text-[15.5px] leading-7 text-mist">
            <strong className="mr-1 font-semibold text-gold-200">{p.label}</strong> {p.text}
          </p>
        </li>
      ))}
    </ul>
  );
}

/** Service card with image, used on Home and the Services overview. */
export function ServiceCard({ href, image, title, lines, index, children }: { href: string; image: string; title: string; lines: string[]; index: number; children?: ReactNode }) {
  return (
    <Tilt className="group h-full rounded-[28px]" max={6}>
      <Link href={href} aria-label={title} className="relative flex h-full min-h-[380px] flex-col justify-end overflow-hidden rounded-[28px] border border-line p-7">
        <div className="absolute inset-0 -z-0">
          <Img id={image} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110" />
        </div>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/10 transition-opacity duration-700 group-hover:opacity-90" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-300/70 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        <span aria-hidden className="absolute left-7 top-7 font-sans text-xs tracking-[0.35em] text-gold-300/80">{pad(index + 1)}</span>
        <span
          aria-hidden
          className="absolute right-6 top-6 grid h-11 w-11 place-items-center rounded-full border border-gold-300/40 text-gold-200 transition-all duration-500 group-hover:rotate-45 group-hover:bg-gold-300 group-hover:text-ink"
        >
          <ArrowUpRightIcon />
        </span>
        <div className="tilt-pop relative">
          <h5 className="text-2xl font-medium leading-tight text-white sm:text-[1.7rem]">
            {lines.map((l, i) => (
              <span key={i} className={i ? "block text-gold" : "block"}>
                {l}
              </span>
            ))}
          </h5>
          {children ? <div className="mt-4 text-[14.5px] leading-7 text-mist">{children}</div> : null}
          <span aria-hidden className="mt-5 block h-px w-12 bg-gold-300 transition-all duration-700 group-hover:w-24" />
        </div>
      </Link>
    </Tilt>
  );
}
