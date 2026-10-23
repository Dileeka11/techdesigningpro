import Link from "next/link";
import { vars } from "@/lib/css";
import { Img } from "@/components/ui/Img";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { LazyScene, type SceneName } from "@/components/three/LazyScene";

type Crumb = { label: string; href?: string };

/** Inner-page hero: big title on the left, a live 3D scene on the right. */
export function PageHero({ title, crumbs, image, scene }: { title: string; crumbs: Crumb[]; image: string; scene: SceneName }) {
  return (
    <section className="relative isolate overflow-hidden pt-[var(--header-h)] md:pt-[124px]">
      <div aria-hidden className="absolute inset-0 -z-20 opacity-[0.22]">
        <Img id={image} alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/70 via-ink/80 to-ink" />
      <div aria-hidden className="bg-blueprint mask-radial absolute inset-0 -z-10 opacity-70" />
      <div aria-hidden className="absolute -right-40 top-10 -z-10 h-[520px] w-[520px] rounded-full bg-gold-500/15 blur-[120px]" />

      <div className="container-x grid min-h-[62vh] items-center gap-6 pb-12 lg:grid-cols-[1.05fr_1fr] lg:pb-16">
        <div className="relative z-10 py-10 lg:py-0">
          <nav aria-label="Breadcrumb" className="fade-up mb-6 text-sm text-mist" style={vars({ "--d": "50ms" })}>
            <ol className="flex flex-wrap items-center gap-2">
              {crumbs.map((c, i) => (
                <li key={i} className="flex items-center gap-2">
                  {c.href ? (
                    <Link href={c.href} className="transition-colors hover:text-gold-200">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-gold-200">
                      {c.label}
                    </span>
                  )}
                  {i < crumbs.length - 1 ? <span className="h-px w-5 bg-gold-400/50" aria-hidden /> : null}
                </li>
              ))}
            </ol>
          </nav>
          <SplitHeading as="h1" text={title} auto className="text-5xl font-medium leading-[1.02] sm:text-6xl lg:text-7xl xl:text-[5.4rem]" />
          <div aria-hidden className="fade-up mt-8 h-px w-40 bg-gradient-to-r from-gold-300 to-transparent" style={vars({ "--d": "600ms" })} />
        </div>
        <LazyScene scene={scene} eager className="relative h-[320px] w-full sm:h-[420px] lg:h-[540px]" />
      </div>
    </section>
  );
}
