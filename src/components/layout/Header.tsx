"use client";

import { asset } from "@/lib/basePath";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, servicesNav, site } from "@/content/site";
import { home } from "@/content/home";
import { imageUrl } from "@/components/ui/Img";
import { Magnetic } from "@/components/ui/Magnetic";
import { Socials } from "@/components/layout/Socials";
import { ArrowUpRightIcon, ChevronIcon, CloseIcon, MailIcon, MenuIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/ui/Icons";

const serviceImages = Object.fromEntries(home.services.items.map((s) => [s.href, s.image]));

const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [svcOpen, setSvcOpen] = useState(false);
  const progress = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number>(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 30);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSvcOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) window.__lenis?.stop();
    else window.__lenis?.start();
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const openSvc = () => {
    window.clearTimeout(closeTimer.current);
    setSvcOpen(true);
  };
  const closeSvc = () => {
    closeTimer.current = window.setTimeout(() => setSvcOpen(false), 140);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {/* Top contact bar (desktop) */}
        <div
          className={`hidden overflow-hidden transition-[max-height,opacity] duration-500 md:block ${scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100"}`}
        >
          <div className="container-x flex items-center justify-between border-b border-line py-2 text-[13px] text-mist">
            <div className="flex items-center gap-8">
              <a href={site.whatsappHref} target="_blank" rel="noopener" className="flex items-center gap-2 transition-colors hover:text-gold-200">
                <PhoneIcon width={15} height={15} className="text-gold-300" />
                {site.phone}
              </a>
              <a href={site.emailHref} className="flex items-center gap-2 transition-colors hover:text-gold-200">
                <MailIcon width={15} height={15} className="text-gold-300" />
                {site.email}
              </a>
              <span className="flex items-center gap-2">
                <PinIcon width={15} height={15} className="text-gold-300" />
                {site.location}
              </span>
            </div>
            <Socials className="gap-4" />
          </div>
        </div>

        {/* Main bar */}
        <div
          className={`relative transition-[background-color,border-color,backdrop-filter] duration-500 ${
            scrolled ? "border-b border-line bg-ink/85 backdrop-blur-xl [.lite_&]:bg-ink/95" : "border-b border-transparent"
          }`}
        >
          <div className="container-x flex h-[72px] items-center justify-between gap-6 md:h-[80px]">
            <Link href="/" className="relative z-10 shrink-0" aria-label={site.name}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/images/brand/logo.webp")} alt={site.name} width={592} height={140} className="h-10 w-auto sm:h-12 xl:h-14" fetchPriority="high" />
            </Link>

            <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
              {nav.map((item) =>
                item.children ? (
                  <div key={item.href} className="relative" onMouseEnter={openSvc} onMouseLeave={closeSvc}>
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        className={`relative whitespace-nowrap rounded-full px-4 py-2 text-[15px] transition-colors ${
                          isActive(pathname, item.href) ? "text-gold-200" : "text-fog hover:text-white"
                        }`}
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        aria-label={item.label}
                        aria-expanded={svcOpen}
                        aria-controls="services-menu"
                        onClick={() => setSvcOpen((v) => !v)}
                        onFocus={openSvc}
                        className="-ml-3 rounded-full p-1 text-mist hover:text-gold-200"
                      >
                        <ChevronIcon width={16} height={16} className={`transition-transform duration-300 ${svcOpen ? "rotate-180" : ""}`} />
                      </button>
                    </div>

                    <div
                      id="services-menu"
                      className={`absolute left-1/2 top-full w-[640px] -translate-x-1/2 pt-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        svcOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
                      }`}
                    >
                      <div className="glass grid grid-cols-2 gap-2 rounded-3xl border border-line-strong p-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]">
                        {item.children.map((c) => (
                          <Link
                            key={c.href}
                            href={c.href}
                            onBlur={closeSvc}
                            onFocus={openSvc}
                            className="group/s relative flex h-28 items-end overflow-hidden rounded-2xl p-4"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imageUrl(serviceImages[c.href], 480)}
                              alt=""
                              loading="lazy"
                              className="absolute inset-0 h-full w-full object-cover opacity-40 transition duration-700 group-hover/s:scale-110 group-hover/s:opacity-60"
                            />
                            <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
                            <span className="relative flex w-full items-end justify-between gap-3 font-display text-lg leading-tight text-white">
                              {c.label}
                              <ArrowUpRightIcon className="shrink-0 text-gold-300 transition-transform duration-500 group-hover/s:-translate-y-1 group-hover/s:translate-x-1" />
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative whitespace-nowrap rounded-full px-4 py-2 text-[15px] transition-colors ${
                      isActive(pathname, item.href) ? "text-gold-200" : "text-fog hover:text-white"
                    }`}
                  >
                    {item.label}
                    {isActive(pathname, item.href) ? (
                      <span className="absolute inset-x-4 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-gold-300 to-transparent" />
                    ) : null}
                  </Link>
                ),
              )}
            </nav>

            <div className="relative z-10 flex items-center gap-3">
              <div className="hidden sm:block">
              <Magnetic>
                <a href={site.whatsappHref} target="_blank" rel="noopener" className="btn btn-gold h-11 px-5 text-sm">
                  <WhatsAppIcon width={18} height={18} />
                  {site.consultNow}
                </a>
              </Magnetic>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label="Menu"
                className="grid h-11 w-11 place-items-center rounded-full border border-line-strong text-gold-100 transition-colors hover:border-gold-300/60 lg:hidden"
              >
                {menuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
          <div ref={progress} aria-hidden className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-gold-600 via-gold-200 to-gold-500" />
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        data-lenis-prevent
        className={`fixed inset-0 z-[45] overflow-y-auto bg-ink/95 transition-[opacity,visibility] duration-500 lg:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="bg-blueprint mask-radial absolute inset-0 opacity-60" aria-hidden />
        <nav aria-label="Mobile" className="container-x relative flex min-h-full flex-col pb-10 pt-28">
          <ul className="space-y-1">
            {nav.map((item, i) => (
              <li
                key={item.href}
                className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
                style={{ transitionDelay: menuOpen ? `${80 + i * 60}ms` : "0ms" }}
              >
                <Link
                  href={item.href}
                  className={`flex items-baseline gap-4 py-2 font-display text-4xl ${isActive(pathname, item.href) ? "text-gold" : "text-white"}`}
                >
                  <span className="font-sans text-xs text-gold-400/70">0{i + 1}</span>
                  {item.label}
                </Link>
                {item.children ? (
                  <ul className="mb-3 ml-9 mt-1 space-y-1 border-l border-line pl-4">
                    {servicesNav.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="block py-1.5 text-[15px] text-mist hover:text-gold-200">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
          <div
            className={`mt-auto space-y-3 border-t border-line pt-8 text-sm text-mist transition-all delay-300 duration-700 ${menuOpen ? "opacity-100" : "opacity-0"}`}
          >
            <a href={site.whatsappHref} target="_blank" rel="noopener" className="btn btn-gold w-full">
              <WhatsAppIcon width={18} height={18} />
              {site.consultNow}
            </a>
            <a href={site.phoneHref} className="flex items-center gap-3 pt-3">
              <PhoneIcon width={16} height={16} className="text-gold-300" />
              {site.phone}
            </a>
            <a href={site.emailHref} className="flex items-center gap-3">
              <MailIcon width={16} height={16} className="text-gold-300" />
              {site.email}
            </a>
            <span className="flex items-center gap-3">
              <PinIcon width={16} height={16} className="text-gold-300" />
              {site.location}
            </span>
          </div>
        </nav>
      </div>
    </>
  );
}
