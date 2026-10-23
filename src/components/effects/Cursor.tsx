"use client";

import { useEffect, useRef } from "react";
import { isLite } from "@/lib/perf";

/** Soft gold cursor ring for mouse users; grows over links and buttons. */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || isLite()) return;
    const r = ring.current!;
    const d = dot.current!;
    let x = -100,
      y = -100,
      rx = -100,
      ry = -100,
      raf = 0,
      active = false;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      d.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      const target = e.target as Element | null;
      const hot = !!target?.closest?.("a, button, [role=tab], input, textarea, [data-cursor]");
      if (hot !== active) {
        active = hot;
        r.dataset.active = hot ? "1" : "";
      }
      r.style.opacity = d.style.opacity = "1";
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => (r.style.opacity = d.style.opacity = "0");
    // The ring eases towards the pointer and the loop sleeps once it has caught up.
    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.2 ? requestAnimationFrame(tick) : 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[70] -ml-5 -mt-5 hidden h-10 w-10 rounded-full border border-gold-300/60 opacity-0 transition-[width,height,margin,background-color,border-color,opacity] duration-300 data-[active=1]:-ml-8 data-[active=1]:-mt-8 data-[active=1]:h-16 data-[active=1]:w-16 data-[active=1]:border-gold-200/80 data-[active=1]:bg-gold-300/10 [@media(hover:hover)_and_(pointer:fine)]:block"
      />
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[70] -ml-[3px] -mt-[3px] hidden h-1.5 w-1.5 rounded-full bg-gold-200 opacity-0 [@media(hover:hover)_and_(pointer:fine)]:block"
      />
    </>
  );
}
