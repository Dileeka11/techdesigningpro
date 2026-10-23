"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeftIcon, ArrowIcon, CloseIcon, ExpandIcon } from "@/components/ui/Icons";
import { Tilt } from "@/components/ui/Tilt";
import { vars } from "@/lib/css";

type Item = { id: string; src: string; srcSet: string; full: string; width: number; height: number; blur: string };

/** Masonry gallery with 3D tilt and a full-screen lightbox (keyboard + swipe). */
export function GalleryGrid({ items, label }: { items: Item[]; label: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const [touchX, setTouchX] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const go = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    if (open === null) return;
    window.__lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.__lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [open, close, go]);

  return (
    <>
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {items.map((it, i) => (
          <div key={it.id} data-reveal style={vars({ "--reveal-delay": `${(i % 3) * 110}ms` })} className="mb-5 break-inside-avoid">
            <Tilt className="rounded-3xl" max={6}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`${label} ${i + 1}`}
                className="group relative block w-full overflow-hidden rounded-3xl border border-line"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={it.src}
                  srcSet={it.srcSet}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  width={it.width}
                  height={it.height}
                  alt={`${label} ${i + 1}`}
                  loading={i < 3 ? "eager" : "lazy"}
                  decoding="async"
                  style={{ backgroundImage: `url(${it.blur})`, backgroundSize: "cover" }}
                  className="h-auto w-full transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span
                  aria-hidden
                  className="absolute bottom-5 right-5 grid h-12 w-12 translate-y-3 place-items-center rounded-full bg-gold-300 text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
                >
                  <ExpandIcon />
                </span>
                <span aria-hidden className="absolute left-5 top-5 font-sans text-xs tracking-[0.35em] text-white/80">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </button>
            </Tilt>
          </div>
        ))}
      </div>

      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        data-lenis-prevent
        className={`fixed inset-0 z-[90] flex items-center justify-center bg-ink/95 transition-[opacity,visibility] duration-500 ${
          open === null ? "invisible opacity-0" : "visible opacity-100"
        }`}
        onClick={close}
        onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX === null) return;
          const dx = e.changedTouches[0].clientX - touchX;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          setTouchX(null);
        }}
      >
        {open !== null ? (
          <figure key={open} className="relative mx-4 max-h-[86vh] max-w-6xl animate-[fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)_both]" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={items[open].full}
              alt={`${label} ${open + 1}`}
              width={items[open].width}
              height={items[open].height}
              className="max-h-[86vh] w-auto rounded-2xl border border-line-strong object-contain shadow-2xl"
              style={{ backgroundImage: `url(${items[open].blur})`, backgroundSize: "cover" }}
            />
            <figcaption className="mt-4 text-center font-sans text-xs tracking-[0.35em] text-gold-200">
              {String(open + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </figcaption>
          </figure>
        ) : null}
        <button type="button" aria-label="Close" onClick={close} className="absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-full border border-line-strong text-gold-100 hover:bg-white/5">
          <CloseIcon />
        </button>
        <button
          type="button"
          aria-label="Previous"
          onClick={(e) => (e.stopPropagation(), go(-1))}
          className="absolute left-3 top-1/2 hidden h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-line-strong text-gold-100 hover:bg-white/5 sm:grid md:left-8"
        >
          <ArrowLeftIcon />
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={(e) => (e.stopPropagation(), go(1))}
          className="absolute right-3 top-1/2 hidden h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-line-strong text-gold-100 hover:bg-white/5 sm:grid md:right-8"
        >
          <ArrowIcon />
        </button>
      </div>
    </>
  );
}
