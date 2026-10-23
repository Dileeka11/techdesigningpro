"use client";

import { Player, type PlayerRef } from "@remotion/player";
import { useEffect, useRef } from "react";
import { BIMShowreel } from "@/remotion/BIMShowreel";
import { SHOWREEL } from "@/remotion/config";
import { useLite } from "@/lib/useLite";

// The 1280x720 composition is shown at roughly that size, so a higher pixel ratio only costs GPU time.
const FULL_PROPS = { dpr: 1 };
const LITE_PROPS = { dpr: 0.75 };

/** Remotion Player running the BIM showreel live in the browser (no video file). */
export default function ShowreelPlayer({ onReady }: { onReady?: () => void }) {
  const player = useRef<PlayerRef>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const inputProps = useLite() ? LITE_PROPS : FULL_PROPS;

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const p = player.current;
    if (!p) return;
    if (reduced) {
      p.seekTo(SHOWREEL.durationInFrames - 60);
      onReady?.();
      return;
    }
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? p.play() : p.pause()), { threshold: 0.25 });
    io.observe(wrap.current!);
    onReady?.();
    return () => io.disconnect();
  }, [onReady]);

  return (
    <div ref={wrap} className="h-full w-full">
      <Player
        ref={player}
        component={BIMShowreel}
        inputProps={inputProps}
        durationInFrames={SHOWREEL.durationInFrames}
        fps={SHOWREEL.fps}
        compositionWidth={SHOWREEL.width}
        compositionHeight={SHOWREEL.height}
        loop
        controls={false}
        clickToPlay={false}
        spaceKeyToPlayOrPause={false}
        moveToBeginningWhenEnded
        initiallyMuted
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
