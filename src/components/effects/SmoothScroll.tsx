"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { LITE_EVENT, isLite } from "@/lib/perf";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Buttery inertia scrolling (disabled for reduced-motion users and low-end devices – native scroll is cheaper). */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || isLite()) return;
    const lenis = new Lenis({ autoRaf: true, duration: 1.1, anchors: { offset: -96 }, prevent: (node) => !!node.closest?.("[data-lenis-prevent]") });
    window.__lenis = lenis;
    const stop = () => {
      if (window.__lenis !== lenis) return;
      lenis.destroy();
      window.__lenis = undefined;
    };
    window.addEventListener(LITE_EVENT, stop, { once: true });
    return () => {
      window.removeEventListener(LITE_EVENT, stop);
      stop();
    };
  }, []);

  useEffect(() => {
    if (window.location.hash) return;
    window.__lenis?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
