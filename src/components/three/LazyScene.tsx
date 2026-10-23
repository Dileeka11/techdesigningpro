"use client";

import dynamic from "next/dynamic";
import { SceneBoundary, hasWebGL } from "./SceneBoundary";
import { useEffect, useRef, useState, type ComponentType } from "react";

export type SceneProps = { active: boolean; reduced: boolean; onReady?: () => void };

// Each scene is its own chunk: three.js only downloads when a scene is needed.
const scenes: Record<string, ComponentType<SceneProps>> = {
  hero: dynamic(() => import("./scenes/HeroTower"), { ssr: false }),
  globe: dynamic(() => import("./scenes/OfficeGlobe"), { ssr: false }),
  knot: dynamic(() => import("./scenes/GoldKnot"), { ssr: false }),
  pm: dynamic(() => import("./scenes/ServiceScenes").then((m) => m.TimelineScene), { ssr: false }),
  revit: dynamic(() => import("./scenes/ServiceScenes").then((m) => m.ExplodedBuildingScene), { ssr: false }),
  autocad: dynamic(() => import("./scenes/ServiceScenes").then((m) => m.BlueprintScene), { ssr: false }),
  procurement: dynamic(() => import("./scenes/ServiceScenes").then((m) => m.CratesScene), { ssr: false }),
  gallery: dynamic(() => import("./scenes/ServiceScenes").then((m) => m.FramesScene), { ssr: false }),
};

export type SceneName = keyof typeof scenes;

/**
 * Mounts a WebGL scene only when it gets near the viewport (after the browser
 * is idle), pauses rendering while it is off-screen, and fades it in once the
 * first frame is drawn. Without WebGL the decorative glow stays in place.
 */
export function LazyScene({ scene, className = "", eager = false }: { scene: SceneName; className?: string; eager?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const Scene = scenes[scene];

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = ref.current!;
    let idle = 0;
    let queued = false;
    const start = () => setMounted(true);
    const whenIdle = () => {
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(start, { timeout: eager ? 1500 : 1200 });
      else idle = globalThis.setTimeout(start, 200) as unknown as number;
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting);
        if (entry.isIntersecting && !queued && hasWebGL()) {
          queued = true;
          // Even the hero scene waits for the page load, so text, images and
          // hydration are never competing with the 3D download and setup.
          if (eager && document.readyState !== "complete") window.addEventListener("load", whenIdle, { once: true });
          else whenIdle();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.removeEventListener("load", whenIdle);
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(idle);
      window.clearTimeout(idle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} data-no-scan aria-hidden className={`pointer-events-auto ${className}`}>
      <div className={`h-full w-full transition-opacity duration-[1600ms] ${ready ? "opacity-100" : "opacity-0"}`}>
        {mounted ? (
          <SceneBoundary>
            <Scene active={active} reduced={reduced} onReady={() => setReady(true)} />
          </SceneBoundary>
        ) : null}
      </div>
    </div>
  );
}
