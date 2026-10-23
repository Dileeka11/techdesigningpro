"use client";

import { asset } from "@/lib/basePath";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import type { SceneProps } from "../LazyScene";
import { SceneCanvas } from "../SceneCanvas";
import { GOLD, GOLD_LIGHT, GoldDust, GroundGrid, Lights, easeOutBack, easeOutCubic, edgeMaterial, goldMaterial, usePointerLerp } from "../common";

const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1);

const darkGlass = () =>
  new THREE.MeshStandardMaterial({ color: "#121218", metalness: 0.7, roughness: 0.15, transparent: true, opacity: 0.7, envMapIntensity: 1.3 });

function useDispose(...items: { dispose: () => void }[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => items.forEach((i) => i.dispose()), items);
}

/** Shared rig: lights, pointer parallax and a slow turntable. */
function Rig({ children, speed = 0.15, tilt = 0.35, y = 0 }: { children: ReactNode; speed?: number; tilt?: number; y?: number }) {
  const ref = useRef<THREE.Group>(null);
  const pointer = usePointerLerp(0.04);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = s.clock.elapsedTime * speed + pointer.current.x * 0.4;
    ref.current.rotation.x = tilt * 0.2 - pointer.current.y * 0.08;
  });
  return (
    <group position-y={y}>
      <group ref={ref}>{children}</group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Project Management – a 3D Gantt timeline that keeps scheduling itself
// ---------------------------------------------------------------------------
const BARS = [
  { row: 0, start: -2.4, len: 1.6 },
  { row: 1, start: -1.6, len: 2.0 },
  { row: 2, start: -0.9, len: 1.4 },
  { row: 3, start: -0.4, len: 2.2 },
  { row: 4, start: 0.6, len: 1.3 },
  { row: 5, start: 1.1, len: 1.5 },
  { row: 6, start: 1.8, len: 0.9 },
];

function Timeline() {
  const bars = useRef<(THREE.Group | null)[]>([]);
  const caps = useRef<(THREE.Mesh | null)[]>([]);
  const scan = useRef<THREE.Mesh>(null);
  const assets = useMemo(() => {
    const geo = new THREE.BoxGeometry(1, 0.3, 0.42);
    return {
      geo,
      edges: new THREE.EdgesGeometry(geo),
      cap: new THREE.OctahedronGeometry(0.11),
      gold: goldMaterial(),
      champagne: new THREE.MeshStandardMaterial({ color: GOLD_LIGHT, metalness: 0.9, roughness: 0.38, envMapIntensity: 1.2 }),
      line: edgeMaterial(0.9),
    };
  }, []);
  useDispose(assets.geo, assets.edges, assets.cap, assets.gold, assets.champagne, assets.line);

  useFrame((s) => {
    const cycle = 7;
    const t = s.clock.elapsedTime % cycle;
    BARS.forEach((b, i) => {
      const grow = easeOutCubic((t - i * 0.22) / 1.3) * (1 - easeOutCubic((t - 6.2) / 0.7));
      const bar = bars.current[i];
      if (bar) {
        bar.scale.x = Math.max(b.len * grow, 0.001);
        bar.position.x = b.start + (b.len * grow) / 2;
      }
      const cap = caps.current[i];
      if (cap) {
        cap.position.x = b.start + b.len * grow + 0.18;
        cap.scale.setScalar(easeOutBack((t - i * 0.22 - 1.1) / 0.5) * (1 - clamp01((t - 6.2) / 0.4)) + 0.0001);
        cap.rotation.y = s.clock.elapsedTime * 2;
      }
    });
    if (scan.current) scan.current.position.x = -2.8 + ((s.clock.elapsedTime * 0.55) % 5.9);
  });

  return (
    <group position={[0, -1.75, 0]}>
      {/* chart backdrop */}
      <group position={[0, 1.7, -0.45]} rotation-x={Math.PI / 2}>
        <GroundGrid size={12} pulse={false} />
      </group>
      {BARS.map((b, i) => (
        <group key={i} position={[0, 0.3 + b.row * 0.52, 0]}>
          <group ref={(el) => void (bars.current[i] = el)}>
            <mesh geometry={assets.geo} material={i % 2 ? assets.champagne : assets.gold} />
            <lineSegments geometry={assets.edges} material={assets.line} />
          </group>
          <mesh ref={(el) => void (caps.current[i] = el)} geometry={assets.cap} material={assets.gold} />
          <mesh position={[0.3, 0, -0.25]}>
            <boxGeometry args={[6.2, 0.006, 0.006]} />
            <meshBasicMaterial color={GOLD} transparent opacity={0.3} />
          </mesh>
        </group>
      ))}
      <mesh ref={scan} position={[0, 2.05, 0.05]}>
        <boxGeometry args={[0.025, 4.1, 0.025]} />
        <meshBasicMaterial color="#fff1c4" />
      </mesh>
      <GroundGrid size={16} pulse={false} />
    </group>
  );
}

export function TimelineScene({ active, reduced, onReady }: SceneProps) {
  return (
    <SceneCanvas active={active} reduced={reduced} onReady={onReady} camera={{ position: [0.5, 0.9, 8.2], fov: 36 }}>
      <Lights />
      <Rig speed={0} tilt={0.3}>
        <group rotation-y={-0.38} position-x={0.15}>
          <Timeline />
        </group>
      </Rig>
      <group position-y={-1.8}>
        <GoldDust count={160} radius={5} height={6} size={16} />
      </group>
    </SceneCanvas>
  );
}

// ---------------------------------------------------------------------------
// Revit / BIM – an exploded building model with structure + MEP risers
// ---------------------------------------------------------------------------
function ExplodedBuilding() {
  const floors = useRef<(THREE.Group | null)[]>([]);
  const assets = useMemo(() => {
    const slab = new THREE.BoxGeometry(2.6, 0.07, 2.6);
    const wall = new THREE.BoxGeometry(2.4, 0.5, 2.4);
    const col = new THREE.CylinderGeometry(0.035, 0.035, 0.5, 8);
    return { slab, wall, wallEdges: new THREE.EdgesGeometry(wall), col, gold: goldMaterial(), glass: darkGlass(), line: edgeMaterial(0.6) };
  }, []);
  useDispose(assets.slab, assets.wall, assets.wallEdges, assets.col, assets.gold, assets.glass, assets.line);

  const COUNT = 6;
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const explode = (Math.sin(t * 0.7) + 1) / 2;
    floors.current.forEach((f, i) => {
      if (f) f.position.y = i * (0.58 + explode * 0.45) - 1.6;
    });
  });

  const corners: [number, number][] = [
    [-1.1, -1.1],
    [1.1, -1.1],
    [-1.1, 1.1],
    [1.1, 1.1],
    [0, 0],
  ];
  return (
    <group>
      {Array.from({ length: COUNT }, (_, i) => (
        <group key={i} ref={(el) => void (floors.current[i] = el)}>
          <mesh geometry={assets.slab} material={assets.gold} />
          {i < COUNT - 1 ? (
            <>
              <mesh geometry={assets.wall} material={assets.glass} position-y={0.29} />
              <lineSegments geometry={assets.wallEdges} material={assets.line} position-y={0.29} />
              {corners.map(([x, z], k) => (
                <mesh key={k} geometry={assets.col} material={assets.gold} position={[x, 0.29, z]} />
              ))}
              {/* MEP risers */}
              <mesh position={[0.55, 0.29, -0.4]}>
                <cylinderGeometry args={[0.05, 0.05, 0.5, 10]} />
                <meshStandardMaterial color="#b3223d" metalness={0.5} roughness={0.3} />
              </mesh>
              <mesh position={[-0.5, 0.29, 0.6]}>
                <cylinderGeometry args={[0.04, 0.04, 0.5, 10]} />
                <meshStandardMaterial color="#e9e9f0" metalness={0.7} roughness={0.25} />
              </mesh>
            </>
          ) : null}
        </group>
      ))}
    </group>
  );
}

export function ExplodedBuildingScene({ active, reduced, onReady }: SceneProps) {
  return (
    <SceneCanvas active={active} reduced={reduced} onReady={onReady} camera={{ position: [6.5, 3.6, 11], fov: 36 }} fog={[11, 26]}>
      <Lights />
      <Rig speed={0.2} y={-0.9}>
        <ExplodedBuilding />
        <group position-y={-1.65}>
          <GroundGrid size={18} />
          <GoldDust count={160} radius={4.5} height={6} size={16} />
        </group>
      </Rig>
    </SceneCanvas>
  );
}

// ---------------------------------------------------------------------------
// AutoCAD – a floor plan drafts itself, then the walls extrude into 3D
// ---------------------------------------------------------------------------
const PLAN: [number, number, number, number][] = [
  [-2.2, -1.5, 2.2, -1.5],
  [2.2, -1.5, 2.2, 1.5],
  [2.2, 1.5, -2.2, 1.5],
  [-2.2, 1.5, -2.2, -1.5],
  [-0.6, -1.5, -0.6, -0.2],
  [-2.2, 0.3, -1.1, 0.3],
  [-0.4, 0.3, 0.7, 0.3],
  [0.7, 0.3, 0.7, 1.5],
  [0.7, -0.5, 2.2, -0.5],
  [1.4, 0.3, 2.2, 0.3],
];

function Blueprint() {
  const walls = useRef<(THREE.Mesh | null)[]>([]);
  const { lines, wallGeo, wallMat, total } = useMemo(() => {
    const pts: number[] = [];
    PLAN.forEach(([x1, z1, x2, z2]) => pts.push(x1, 0.01, z1, x2, 0.01, z2));
    // dimension lines
    pts.push(-2.2, 0.01, -2.0, 2.2, 0.01, -2.0, -2.2, 0.01, -2.1, -2.2, 0.01, -1.9, 2.2, 0.01, -2.1, 2.2, 0.01, -1.9);
    pts.push(2.7, 0.01, -1.5, 2.7, 0.01, 1.5, 2.6, 0.01, -1.5, 2.8, 0.01, -1.5, 2.6, 0.01, 1.5, 2.8, 0.01, 1.5);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    const lines = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: GOLD_LIGHT, transparent: true, opacity: 0.95 }));
    return {
      lines,
      total: pts.length / 3,
      wallGeo: new THREE.BoxGeometry(1, 1, 0.06),
      wallMat: new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.9, roughness: 0.3, transparent: true, opacity: 0.85 }),
    };
  }, []);
  useDispose(lines.geometry, lines.material as THREE.Material, wallGeo, wallMat);

  useFrame((s) => {
    const cycle = 9;
    const t = s.clock.elapsedTime % cycle;
    const draw = easeOutCubic(t / 2.6);
    lines.geometry.setDrawRange(0, Math.floor(draw * total / 2) * 2);
    const rise = easeOutCubic((t - 2.6) / 1.6) * (1 - easeOutCubic((t - 7.8) / 0.9));
    walls.current.forEach((w, i) => {
      if (!w) return;
      const h = 0.9 * Math.max(easeOutCubic((t - 2.6 - i * 0.08) / 1.4) * (1 - easeOutCubic((t - 7.8) / 0.9)), 0.001);
      w.scale.y = h;
      w.position.y = h / 2;
    });
    (lines.material as THREE.LineBasicMaterial).opacity = 0.35 + 0.6 * (1 - rise * 0.5);
  });

  return (
    <group>
      <primitive object={lines} />
      {PLAN.map(([x1, z1, x2, z2], i) => {
        const len = Math.hypot(x2 - x1, z2 - z1);
        return (
          <mesh
            key={i}
            ref={(el) => void (walls.current[i] = el)}
            geometry={wallGeo}
            material={wallMat}
            position={[(x1 + x2) / 2, 0, (z1 + z2) / 2]}
            rotation-y={-Math.atan2(z2 - z1, x2 - x1)}
            scale={[len, 0.001, 1]}
          />
        );
      })}
    </group>
  );
}

export function BlueprintScene({ active, reduced, onReady }: SceneProps) {
  return (
    <SceneCanvas active={active} reduced={reduced} onReady={onReady} camera={{ position: [0, 6.2, 6.4], fov: 38 }} fog={[9, 22]}>
      <Lights />
      <Rig speed={0.08} y={-0.6}>
        <Blueprint />
        <GroundGrid size={16} />
        <GoldDust count={120} radius={4.5} height={4} size={14} />
      </Rig>
    </SceneCanvas>
  );
}

// ---------------------------------------------------------------------------
// Procurement (FF & E) – crates arriving and stacking in a supply wave
// ---------------------------------------------------------------------------
function Crates() {
  const crates = useRef<(THREE.Group | null)[]>([]);
  const assets = useMemo(() => {
    const box = new THREE.BoxGeometry(0.62, 0.62, 0.62);
    return { box, edges: new THREE.EdgesGeometry(box), gold: goldMaterial(), glass: darkGlass(), line: edgeMaterial(0.7) };
  }, []);
  useDispose(assets.box, assets.edges, assets.gold, assets.glass, assets.line);

  const layout = useMemo(() => {
    const out: { x: number; z: number; level: number; seed: number }[] = [];
    for (let x = -1; x <= 1; x++)
      for (let z = -1; z <= 1; z++) {
        const levels = 1 + ((x + 1) * 3 + (z + 1) * 5) % 3;
        for (let l = 0; l < levels; l++) out.push({ x: x * 0.82, z: z * 0.82, level: l, seed: Math.random() });
      }
    return out;
  }, []);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    crates.current.forEach((c, i) => {
      if (!c) return;
      const d = layout[i];
      const arrive = easeOutBack((t - 0.3 - i * 0.07) / 0.9);
      const wave = Math.sin(t * 1.4 - (d.x + d.z) * 1.6) * 0.06;
      c.position.set(d.x, d.level * 0.7 + 0.31 + wave + (1 - clamp01(arrive)) * 2.5, d.z);
      c.scale.setScalar(Math.max(arrive, 0.001));
      c.rotation.y = Math.sin(t * 0.5 + d.seed * 6) * 0.06;
    });
  });

  return (
    <group position-y={-1.3}>
      {layout.map((d, i) => (
        <group key={i} ref={(el) => void (crates.current[i] = el)}>
          <mesh geometry={assets.box} material={(i + d.level) % 3 === 0 ? assets.gold : assets.glass} />
          <lineSegments geometry={assets.edges} material={assets.line} />
        </group>
      ))}
      <mesh position-y={-0.02}>
        <boxGeometry args={[2.9, 0.04, 2.9]} />
        <meshStandardMaterial color="#15151b" metalness={0.8} roughness={0.35} />
      </mesh>
      <GroundGrid size={18} />
      <Conveyor />
    </group>
  );
}

function Conveyor() {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    ref.current?.children.forEach((c, i) => {
      const a = s.clock.elapsedTime * 0.35 + (i / 10) * Math.PI * 2;
      c.position.set(Math.cos(a) * 2.6, 0.12, Math.sin(a) * 2.6);
      c.rotation.y = -a;
    });
  });
  return (
    <>
      <mesh rotation-x={-Math.PI / 2} position-y={0.005}>
        <ringGeometry args={[2.45, 2.75, 96]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
      <group ref={ref}>
        {Array.from({ length: 10 }, (_, i) => (
          <mesh key={i}>
            <boxGeometry args={[0.22, 0.22, 0.22]} />
            <meshStandardMaterial color={i % 2 ? GOLD : "#2a2a33"} metalness={0.9} roughness={0.3} />
          </mesh>
        ))}
      </group>
    </>
  );
}

export function CratesScene({ active, reduced, onReady }: SceneProps) {
  return (
    <SceneCanvas active={active} reduced={reduced} onReady={onReady} camera={{ position: [4.5, 4, 7.5], fov: 36 }} fog={[9, 22]}>
      <Lights />
      <Rig speed={0.14}>
        <Crates />
      </Rig>
      <group position-y={-1.4}>
        <GoldDust count={140} radius={5} height={6} size={16} />
      </group>
    </SceneCanvas>
  );
}

// ---------------------------------------------------------------------------
// Gallery – the project images as a floating carousel of gold frames
// ---------------------------------------------------------------------------
const GALLERY = ["43", "44", "45", "46", "47", "48"];

function Frames() {
  const ring = useRef<THREE.Group>(null);
  const [textures, setTextures] = useState<THREE.Texture[]>([]);
  const frameGeo = useMemo(() => new THREE.BoxGeometry(2.08, 1.2, 0.04), []);
  const gold = useMemo(goldMaterial, []);
  const pointer = usePointerLerp(0.04);
  useDispose(frameGeo, gold);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let alive = true;
    Promise.all(GALLERY.map((g) => loader.loadAsync(asset(`/images/gallery/${g}-640.webp`)))).then((tex) => {
      if (!alive) return tex.forEach((t) => t.dispose());
      tex.forEach((t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 4;
      });
      setTextures(tex);
    });
    return () => {
      alive = false;
    };
  }, []);
  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);

  useFrame((s) => {
    if (!ring.current) return;
    ring.current.rotation.y = s.clock.elapsedTime * 0.12 + pointer.current.x * 0.5;
    ring.current.rotation.x = -0.08 - pointer.current.y * 0.06;
    ring.current.children.forEach((c, i) => (c.position.y = Math.sin(s.clock.elapsedTime * 0.8 + i) * 0.12));
  });

  const radius = 3.3;
  return (
    <group ref={ring}>
      {GALLERY.map((g, i) => {
        const a = (i / GALLERY.length) * Math.PI * 2;
        return (
          <group key={g} position={[Math.sin(a) * radius, 0, Math.cos(a) * radius]} rotation-y={a}>
            <mesh geometry={frameGeo} material={gold} />
            {textures[i] ? (
              <mesh position-z={0.025}>
                <planeGeometry args={[2, 1.12]} />
                <meshBasicMaterial map={textures[i]} toneMapped={false} />
              </mesh>
            ) : null}
          </group>
        );
      })}
    </group>
  );
}

export function FramesScene({ active, reduced, onReady }: SceneProps) {
  return (
    <SceneCanvas active={active} reduced={reduced} onReady={onReady} camera={{ position: [0, 1.4, 9], fov: 36 }} fog={[8, 16]}>
      <Lights />
      <Frames />
      <group position-y={-1.6}>
        <GroundGrid size={20} />
        <GoldDust count={160} radius={5} height={6} size={16} />
      </group>
    </SceneCanvas>
  );
}
