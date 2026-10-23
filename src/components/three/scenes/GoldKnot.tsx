"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { SceneProps } from "../LazyScene";
import { SceneCanvas } from "../SceneCanvas";
import { GOLD, GOLD_LIGHT, GoldDust, Lights, easeOutCubic, usePointerLerp } from "../common";

/** A polished gold interlaced knot – a 3D nod to the TechDesigningPro emblem. */
function Knot() {
  const ref = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  const pointer = usePointerLerp(0.05);
  const start = useRef<number | null>(null);

  const { geo, mat, wire } = useMemo(() => {
    const geo = new THREE.TorusKnotGeometry(1.25, 0.2, 420, 40, 3, 4);
    const mat = new THREE.MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: 0.18, envMapIntensity: 1.6 });
    const wire = new THREE.MeshBasicMaterial({ color: GOLD_LIGHT, wireframe: true, transparent: true, opacity: 0.06 });
    return { geo, mat, wire };
  }, []);
  useEffect(() => () => (geo.dispose(), mat.dispose(), wire.dispose()), [geo, mat, wire]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (start.current === null) start.current = t;
    const p = easeOutCubic((t - start.current) / 2.2);
    if (ref.current) {
      ref.current.scale.setScalar(0.6 + p * 0.4);
      ref.current.rotation.set(0.5 + pointer.current.y * -0.25, t * 0.25 + pointer.current.x * 0.5, Math.PI / 4 + (1 - p) * 1.5);
    }
    if (inner.current) inner.current.rotation.z = -t * 0.15;
  });

  return (
    <group ref={ref}>
      <mesh geometry={geo} material={mat} />
      <mesh ref={inner} scale={1.35} material={wire}>
        <icosahedronGeometry args={[1.4, 2]} />
      </mesh>
    </group>
  );
}

function Rings() {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.children.forEach((c, i) => {
      c.rotation.x = Math.PI / 2 + Math.sin(s.clock.elapsedTime * 0.3 + i) * 0.3;
      c.rotation.y = s.clock.elapsedTime * (0.1 + i * 0.05);
    });
  });
  return (
    <group ref={ref}>
      {[2.3, 2.75, 3.2].map((r, i) => (
        <mesh key={r}>
          <torusGeometry args={[r, 0.006, 6, 200]} />
          <meshBasicMaterial color={GOLD_LIGHT} transparent opacity={0.4 - i * 0.1} />
        </mesh>
      ))}
    </group>
  );
}

export default function GoldKnot({ active, reduced, onReady }: SceneProps) {
  return (
    <SceneCanvas active={active} reduced={reduced} onReady={onReady} camera={{ position: [0, 0, 8.5], fov: 38 }} env={1.1}>
      <Lights />
      <Knot />
      <Rings />
      <group position-y={-3.5}>
        <GoldDust count={160} radius={4} height={7} size={18} />
      </group>
    </SceneCanvas>
  );
}
