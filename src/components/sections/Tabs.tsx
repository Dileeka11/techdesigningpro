"use client";

import { Children, useEffect, useRef, useState, type ReactNode, type KeyboardEvent } from "react";

type Tab = { id: string; label: string };

/**
 * Accessible tabs. Every panel is rendered on the server (good for SEO);
 * inactive panels are just hidden. Supports #hash deep links.
 */
export function Tabs({ tabs, children }: { tabs: Tab[]; children: ReactNode }) {
  const panels = Children.toArray(children);
  const [active, setActive] = useState(0);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fromHash = tabs.findIndex((t) => `#${t.id}` === window.location.hash);
    if (fromHash >= 0) setActive(fromHash);
  }, [tabs]);

  useEffect(() => {
    const update = () => {
      const b = buttons.current[active];
      if (b) setIndicator({ left: b.offsetLeft, width: b.offsetWidth });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [active]);

  const select = (i: number, focus = false) => {
    setActive(i);
    history.replaceState(null, "", `#${tabs[i].id}`);
    if (focus) buttons.current[i]?.focus();
    buttons.current[i]?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    const top = wrap.current!.getBoundingClientRect().top + window.scrollY - 90;
    if (window.scrollY > top) {
      if (window.__lenis) window.__lenis.scrollTo(top);
      else window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") select((active + 1) % tabs.length, true);
    if (e.key === "ArrowLeft") select((active - 1 + tabs.length) % tabs.length, true);
  };

  return (
    <div ref={wrap}>
      <div className="sticky top-[76px] z-30 -mx-5 mb-16 px-5 md:top-[88px] md:mx-0 md:px-0">
        <div
          role="tablist"
          aria-label="Revit"
          onKeyDown={onKey}
          className="glass relative mx-auto flex w-full max-w-4xl gap-1 overflow-x-auto rounded-full border border-line-strong p-1.5 [scrollbar-width:none]"
        >
          <span
            aria-hidden
            className="bg-gold absolute top-1.5 bottom-1.5 rounded-full shadow-[0_8px_30px_-8px_rgba(214,170,72,0.7)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ left: indicator.left, width: indicator.width }}
          />
          {tabs.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => void (buttons.current[i] = el)}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={active === i}
              aria-controls={`panel-${t.id}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => select(i)}
              className={`relative z-10 flex-1 whitespace-nowrap rounded-full px-5 py-3 text-sm font-medium transition-colors duration-300 sm:text-[15px] ${
                active === i ? "text-ink" : "text-fog hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {panels.map((panel, i) => (
        <div
          key={tabs[i].id}
          role="tabpanel"
          id={`panel-${tabs[i].id}`}
          aria-labelledby={`tab-${tabs[i].id}`}
          hidden={active !== i}
          className={active === i ? "animate-[fade-up_0.8s_cubic-bezier(0.16,1,0.3,1)_both]" : undefined}
        >
          {panel}
        </div>
      ))}
    </div>
  );
}
