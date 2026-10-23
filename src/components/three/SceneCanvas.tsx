"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type ReactNode } from "react";
import { markLite } from "@/lib/perf";
import { useLite } from "@/lib/useLite";
import { GoldEnvironment, INK } from "./common";

type Props = {
  children: ReactNode;
  active: boolean;
  reduced: boolean;
  onReady?: () => void;
  camera?: { position: [number, number, number]; fov?: number };
  fog?: [number, number];
  env?: number;
};

/** Measures the real frame rate: drops to 1x resolution, then switches the whole site to lite mode. */
function AdaptiveQuality() {
  const setDpr = useThree((s) => s.setDpr);
  const stats = useRef({ time: 0, frames: 0, skip: 30, stage: 0 });
  useFrame((_, dt) => {
    const s = stats.current;
    if (s.stage > 1) return;
    // Ignore the first frames (shader compile, texture upload).
    if (s.skip > 0) return void s.skip--;
    s.time += Math.min(dt, 0.25);
    s.frames++;
    if (s.time < 2) return;
    const fps = s.frames / s.time;
    Object.assign(s, { time: 0, frames: 0, skip: 10 });
    if (fps >= 45) s.stage = 2;
    else if (s.stage === 0) {
      setDpr(1);
      s.stage = 1;
    } else {
      markLite();
      s.stage = 2;
    }
  });
  return null;
}

/** Lite mode: render on demand at a fixed 30 fps instead of every display frame. */
function FrameCap({ fps }: { fps: number }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const id = window.setInterval(() => invalidate(), 1000 / fps);
    return () => window.clearInterval(id);
  }, [invalidate, fps]);
  return null;
}

/** Shared Canvas setup: capped pixel ratio, pause when hidden, static frame for reduced motion. */
export function SceneCanvas({ children, active, reduced, onReady, camera = { position: [0, 2, 10], fov: 35 }, fog, env = 1 }: Props) {
  const lite = useLite();
  const animate = active && !reduced;
  return (
    <Canvas
      dpr={lite ? 1 : [1, 1.5]}
      gl={{ antialias: !lite, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: camera.fov ?? 35, near: 0.1, far: 100, position: camera.position }}
      frameloop={active ? (reduced || lite ? "demand" : "always") : "never"}
      onCreated={({ gl }) => {
        gl.setClearColor(INK, 0);
        requestAnimationFrame(() => onReady?.());
      }}
      style={{ width: "100%", height: "100%" }}
    >
      {animate && lite ? <FrameCap fps={30} /> : null}
      {animate && !lite ? <AdaptiveQuality /> : null}
      {fog ? <fog attach="fog" args={[INK, fog[0], fog[1]]} /> : null}
      <GoldEnvironment intensity={env} />
      {children}
    </Canvas>
  );
}
