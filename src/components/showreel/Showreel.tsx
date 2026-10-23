"use client";

import { asset } from "@/lib/basePath";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { SceneBoundary, hasWebGL } from "@/components/three/SceneBoundary";

const ShowreelPlayer = dynamic(() => import("./ShowreelPlayer"), { ssr: false });

/** Loads the Remotion player + 3D only once the section is about to be seen. */
export function Showreel() {
  const ref = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);
  const [noGL, setNoGL] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (hasWebGL()) setMount(true);
          else setNoGL(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-no-scan aria-hidden className="relative aspect-video w-full overflow-hidden rounded-[inherit] bg-ink">
      <div aria-hidden className={`bg-blueprint absolute inset-0 transition-opacity duration-700 ${ready || noGL ? "opacity-0" : "opacity-100"}`}>
        <div className="absolute inset-0 grid place-items-center">
          <div className="h-14 w-14 animate-spin rounded-full border-2 border-gold-300/20 border-t-gold-300" />
        </div>
      </div>
      {noGL ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={asset("/images/gallery/43-1280.webp")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
      ) : null}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
        {mount ? (
          <SceneBoundary>
            <ShowreelPlayer onReady={onReady} />
          </SceneBoundary>
        ) : null}
      </div>
    </div>
  );
}
