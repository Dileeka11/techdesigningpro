"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { SceneProps } from "../LazyScene";
import { SceneCanvas } from "../SceneCanvas";
import { GOLD, GOLD_LIGHT, GoldDust, GroundGrid, Lights, easeOutBack, easeOutCubic, edgeMaterial, goldMaterial, usePointerLerp } from "../common";

const FLOORS = 18;
const FLOOR_H = 0.4;
const TWIST = 0.075;

/** Night-time facade: rows of warm lit / dark windows painted on a canvas. */
function windowTexture(rows: number) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 32 * rows;
  const g = c.getContext("2d")!;
  g.fillStyle = "#000";
  g.fillRect(0, 0, c.width, c.height);
  const cols = 16;
  const cw = c.width / cols;
  for (let r = 0; r < rows; r++) {
    for (let k = 0; k < cols; k++) {
      if (Math.random() < 0.5) continue;
      const warm = 180 + Math.random() * 60;
      g.fillStyle = `rgba(255, ${Math.round(warm)}, ${Math.round(warm * 0.45)}, ${0.35 + Math.random() * 0.65})`;
      g.fillRect(k * cw + 2, r * 32 + 6, cw - 4, 22);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function Tower() {
  const group = useRef<THREE.Group>(null);
  const floors = useRef<(THREE.Group | null)[]>([]);
  const beacon = useRef<THREE.Mesh>(null);
  const viewport = useThree((s) => s.viewport);
  const pointer = usePointerLerp(0.04);
  const start = useRef<number | null>(null);

  const assets = useMemo(() => {
    const slabGeo = new THREE.BoxGeometry(2, 0.05, 2);
    const glassGeo = new THREE.BoxGeometry(1.86, FLOOR_H - 0.05, 1.86);
    const edges = new THREE.EdgesGeometry(glassGeo);
    const tex = windowTexture(FLOORS);
    const slab = goldMaterial();
    const line = edgeMaterial(0.55);
    const glass = Array.from({ length: FLOORS }, (_, i) => {
      const t = tex.clone();
      t.repeat.set(1, 1 / FLOORS);
      t.offset.set(0, i / FLOORS);
      t.needsUpdate = true;
      return new THREE.MeshStandardMaterial({
        color: "#0c0c12",
        metalness: 0.85,
        roughness: 0.12,
        emissive: new THREE.Color("#ffc36b"),
        emissiveMap: t,
        emissiveIntensity: 1.25,
        envMapIntensity: 1.4,
      });
    });
    return { slabGeo, glassGeo, edges, slab, line, glass, tex };
  }, []);

  useEffect(
    () => () => {
      assets.slabGeo.dispose();
      assets.glassGeo.dispose();
      assets.edges.dispose();
      assets.slab.dispose();
      assets.line.dispose();
      assets.tex.dispose();
      assets.glass.forEach((m) => (m.emissiveMap?.dispose(), m.dispose()));
    },
    [assets],
  );

  const wide = viewport.aspect > 1.05;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (start.current === null) start.current = t;
    const local = t - start.current;
    const scroll = Math.min(window.scrollY / window.innerHeight, 1.2);
    const explode = easeOutCubic(scroll) * 0.55;

    floors.current.forEach((f, i) => {
      if (!f) return;
      const p = easeOutBack((local - 0.25 - i * 0.075) / 0.9);
      const s = Math.max(p, 0.0001);
      f.scale.set(s, s, s);
      f.position.y = i * FLOOR_H * (1 + explode) + (1 - easeOutCubic((local - 0.25 - i * 0.075) / 0.9)) * 2.2;
      f.rotation.y = i * TWIST + Math.sin(t * 0.5 + i * 0.35) * 0.012 + explode * i * 0.03;
    });

    if (beacon.current) {
      const m = beacon.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.35 + 0.65 * Math.max(0, Math.sin(t * 3));
      beacon.current.position.y = FLOORS * FLOOR_H * (1 + explode) + 0.95;
    }

    if (group.current) {
      group.current.rotation.y = t * 0.12 + pointer.current.x * 0.35;
      group.current.rotation.x = -pointer.current.y * 0.05;
    }
  });

  const towerTop = FLOORS * FLOOR_H;

  return (
    <group position={[wide ? 3.3 : 1.25, wide ? -3.1 : -4.7, 0]} scale={wide ? 0.8 : 0.6}>
      <group ref={group}>
        {Array.from({ length: FLOORS }, (_, i) => {
          const taper = 1 - i * 0.012;
          return (
            <group key={i} ref={(el) => void (floors.current[i] = el)}>
              <group scale={[taper, 1, taper]}>
                <mesh geometry={assets.slabGeo} material={assets.slab} />
                <mesh geometry={assets.glassGeo} material={assets.glass[i]} position-y={FLOOR_H / 2} />
                <lineSegments geometry={assets.edges} material={assets.line} position-y={FLOOR_H / 2} />
              </group>
            </group>
          );
        })}
        {/* crown + spire */}
        <mesh position-y={towerTop + 0.35} material={assets.slab}>
          <cylinderGeometry args={[0.015, 0.06, 1.2, 8]} />
        </mesh>
        <mesh ref={beacon} position-y={towerTop + 0.95}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color="#ff5a6e" transparent />
        </mesh>
        <OrbitRings radius={2.6} height={towerTop * 0.55} />
      </group>
      <GlowDisc />
      <GroundGrid size={36} />
      <GoldDust count={wide ? 420 : 220} radius={6} height={9} />
    </group>
  );
}

function OrbitRings({ radius, height }: { radius: number; height: number }) {
  const sat = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Group>(null);
  const cubes = useRef<THREE.Group>(null);
  const cubeAssets = useMemo(() => {
    const geo = new THREE.BoxGeometry(0.22, 0.22, 0.22);
    return { geo, edges: new THREE.EdgesGeometry(geo), line: edgeMaterial(0.9) };
  }, []);
  useEffect(() => () => (cubeAssets.geo.dispose(), cubeAssets.edges.dispose(), cubeAssets.line.dispose()), [cubeAssets]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (sat.current) sat.current.position.set(Math.cos(t * 0.6) * radius, 0, Math.sin(t * 0.6) * radius);
    if (ring.current) ring.current.rotation.z = Math.sin(t * 0.2) * 0.08;
    cubes.current?.children.forEach((c, i) => {
      const a = t * (0.18 + i * 0.03) + i * 1.3;
      const r = radius + 0.6 + (i % 3) * 0.5;
      c.position.set(Math.cos(a) * r, height * 0.3 + Math.sin(t * 0.7 + i) * 0.8 + i * 0.5, Math.sin(a) * r);
      c.rotation.set(t * 0.4 + i, t * 0.3, 0);
    });
  });

  return (
    <>
      <group ref={ring} position-y={height} rotation-x={0.32}>
        <mesh rotation-x={Math.PI / 2}>
          <torusGeometry args={[radius, 0.008, 8, 160]} />
          <meshBasicMaterial color={GOLD_LIGHT} transparent opacity={0.55} />
        </mesh>
        <mesh ref={sat}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="#fff2c9" />
        </mesh>
      </group>
      <group ref={cubes}>
        {Array.from({ length: 6 }, (_, i) => (
          <lineSegments key={i} geometry={cubeAssets.edges} material={cubeAssets.line} />
        ))}
      </group>
    </>
  );
}

function GlowDisc() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uColor: { value: new THREE.Color(GOLD) } },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `uniform vec3 uColor; varying vec2 vUv; void main(){ float d = length(vUv - 0.5) * 2.0; float a = pow(1.0 - clamp(d,0.0,1.0), 2.4) * 0.55; gl_FragColor = vec4(uColor, a); }`,
      }),
    [],
  );
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={0.01} material={mat}>
      <planeGeometry args={[9, 9]} />
    </mesh>
  );
}

export default function HeroTower({ active, reduced, onReady }: SceneProps) {
  return (
    <SceneCanvas active={active} reduced={reduced} onReady={onReady} camera={{ position: [0, 2.6, 15], fov: 34 }} fog={[14, 32]}>
      <Lights />
      <pointLight position={[3, 1, 3]} intensity={10} distance={10} color={GOLD} />
      <Tower />
    </SceneCanvas>
  );
}
