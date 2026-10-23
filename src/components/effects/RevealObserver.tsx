"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SELECTOR = "[data-reveal]:not(.is-visible), .split-heading:not(.is-visible), .draw-line:not(.is-visible)";

/**
 * One shared IntersectionObserver that adds `.is-visible` to every element
 * marked with data-reveal / .split-heading / .draw-line when it scrolls in.
 * The CSS only hides those elements once JS is running (html.js), so the
 * content is always readable for crawlers and no-JS visitors.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 },
    );

    const scan = () => document.querySelectorAll(SELECTOR).forEach((el) => io.observe(el));
    scan();

    // Pick up content that mounts later (tabs, lazy sections). Mutations inside
    // canvases / the video player are ignored – they change every frame.
    let queued = 0;
    const mo = new MutationObserver((records) => {
      if (records.every((r) => (r.target as Element).closest?.("[data-no-scan]"))) return;
      cancelAnimationFrame(queued);
      queued = requestAnimationFrame(scan);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(queued);
    };
  }, [pathname]);

  return null;
}
