import { asset } from "@/lib/basePath";
import type { CSSProperties } from "react";
import Link from "next/link";
import { footer, site } from "@/content/site";
import { Img } from "@/components/ui/Img";
import { Socials } from "@/components/layout/Socials";
import { MailIcon, PhoneIcon, PinIcon } from "@/components/ui/Icons";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative isolate overflow-hidden border-t border-line bg-ink-2">
      <div aria-hidden className="absolute inset-0 -z-10 opacity-[0.12]">
        <Img id="bg/footer_bg" alt="" fill sizes="100vw" className="grayscale" />
      </div>
      <div aria-hidden className="bg-blueprint mask-fade-b absolute inset-0 -z-10 opacity-60" />
      <div aria-hidden className="absolute left-1/2 top-0 -z-10 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold-300/60 to-transparent" />

      {/* Oversized outlined wordmark */}
      <div aria-hidden className="pointer-events-none select-none overflow-hidden pt-16">
        <div className="flex w-max animate-marquee whitespace-nowrap font-display text-[18vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(214,170,72,0.22)] md:text-[12vw]">
          <span className="pr-[6vw]">{site.name}</span>
          <span className="pr-[6vw]">{site.name}</span>
        </div>
      </div>

      <div className="container-x grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5" data-reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/images/brand/logo.webp")} alt={site.name} width={592} height={140} loading="lazy" className="h-12 w-auto" />
          <h5 className="sr-only">{footer.aboutTitle}</h5>
          <p className="mt-6 max-w-md text-[15px] leading-7 text-mist">{footer.aboutText}</p>
          <Socials boxed className="mt-6 gap-3" />
        </div>

        <div className="md:col-span-3" data-reveal style={{ "--reveal-delay": "100ms" } as CSSProperties}>
          <h5 className="font-sans text-xs font-medium uppercase tracking-[0.3em] text-gold-300">{footer.linksTitle}</h5>
          <ul className="mt-6 space-y-3">
            {footer.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="group inline-flex items-center gap-3 text-fog transition-colors hover:text-gold-200">
                  <span className="h-px w-4 bg-gold-400/50 transition-all duration-500 group-hover:w-8 group-hover:bg-gold-300" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4" data-reveal style={{ "--reveal-delay": "200ms" } as CSSProperties}>
          <h5 className="font-sans text-xs font-medium uppercase tracking-[0.3em] text-gold-300">{footer.companyTitle}</h5>
          <ul className="mt-6 space-y-4 text-fog">
            <li>
              <a href={site.phoneHref} className="flex items-center gap-3 transition-colors hover:text-gold-200">
                <span className="grid h-9 w-9 place-items-center rounded-full border border-line-strong text-gold-300">
                  <PhoneIcon width={16} height={16} />
                </span>
                {site.phone}
              </a>
            </li>
            <li>
              <a href={site.emailHref} className="flex items-center gap-3 break-all transition-colors hover:text-gold-200">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line-strong text-gold-300">
                  <MailIcon width={16} height={16} />
                </span>
                {site.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line-strong text-gold-300">
                <PinIcon width={16} height={16} />
              </span>
              <span className="pt-1.5 leading-7">
                {site.offices.map((o, i) => (
                  <span key={o}>
                    <span className="whitespace-nowrap">
                      {o}
                      {i < site.offices.length - 1 ? <span className="text-gold-500/70"> |</span> : null}
                    </span>
                    {i < site.offices.length - 1 ? " " : null}
                  </span>
                ))}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-[13px] text-mist sm:flex-row">
          <p>
            © {year} {footer.rights}
          </p>
          <div aria-hidden className="h-px w-24 bg-gradient-to-r from-gold-500/0 via-gold-400/60 to-gold-500/0" />
        </div>
      </div>
    </footer>
  );
}
