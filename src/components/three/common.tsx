"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useLite } from "@/lib/useLite";

export const GOLD = "#d6aa48";
export const GOLD_LIGHT = "#f3d98e";
export const INK = "#070709";

/** Studio-style reflections for metallic gold without downloading an HDR. */
export function GoldEnvironment({ intensity = 1 }: { intensity?: number }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = intensity;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene, intensity]);
  return null;
}

export function Lights() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 9, 6]} intensity={1.6} color="#fff3dc" />
      <directionalLight position={[-6, 5, -7]} intensity={1.1} color={GOLD_LIGHT} />
      <pointLight position={[-3, 2, 4]} intensity={18} distance={14} color={GOLD} />
    </>
  );
}

export const goldMaterial = () =>
  new THREE.MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: 0.26, envMapIntensity: 1.25 });

export const edgeMaterial = (opacity = 0.75) =>
  new THREE.LineBasicMaterial({ color: GOLD_LIGHT, transparent: true, opacity, depthWrite: false });

/** Fading blueprint grid with a radar pulse travelling outwards. */
export function GroundGrid({ size = 40, y = 0, pulse = true }: { size?: number; y?: number; pulse?: boolean }) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(GOLD) }, uPulse: { value: pulse ? 1 : 0 } },
        vertexShader: /* glsl */ `
          varying vec2 vPos;
          void main() {
            vPos = position.xy;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uPulse;
          varying vec2 vPos;
          float grid(vec2 p, float s) {
            vec2 q = p / s;
            vec2 g = abs(fract(q - 0.5) - 0.5) / fwidth(q);
            return 1.0 - min(min(g.x, g.y), 1.0);
          }
          void main() {
            float d = length(vPos);
            float fade = 1.0 - smoothstep(1.5, 13.0, d);
            float g = grid(vPos, 0.5) * 0.35 + grid(vPos, 2.0) * 0.75;
            float r = mod(uTime * 1.6, 18.0);
            float ring = smoothstep(0.35, 0.0, abs(d - r)) * (1.0 - r / 18.0) * uPulse;
            float a = (g * 0.32 + ring * 0.55) * fade;
            gl_FragColor = vec4(uColor, a);
          }`,
      }),
    [pulse],
  );
  useFrame((_, dt) => {
    mat.uniforms.uTime.value += dt;
  });
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={y} material={mat} renderOrder={-1}>
      <planeGeometry args={[size, size]} />
    </mesh>
  );
}

/** Gold dust drifting upwards. */
export function GoldDust({ count: requested = 400, radius = 7, height = 10, size = 22 }: { count?: number; radius?: number; height?: number; size?: number }) {
  const dpr = useThree((s) => s.viewport.dpr);
  const count = useLite() ? Math.round(requested / 2) : requested;
  const { geometry, material } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = Math.sqrt(Math.random()) * radius;
      const a = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = Math.random() * height;
      pos[i * 3 + 2] = Math.sin(a) * r;
      seed[i] = Math.random();
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: size },
        uDpr: { value: 1 },
        uHeight: { value: height },
        uColor: { value: new THREE.Color(GOLD_LIGHT) },
      },
      vertexShader: /* glsl */ `
        attribute float aSeed;
        uniform float uTime, uSize, uDpr, uHeight;
        varying float vAlpha;
        void main() {
          vec3 p = position;
          p.y = mod(p.y + uTime * (0.12 + aSeed * 0.3), uHeight);
          p.x += sin(uTime * 0.4 + aSeed * 20.0) * 0.25;
          p.z += cos(uTime * 0.3 + aSeed * 12.0) * 0.25;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uSize * uDpr * (0.35 + aSeed) / -mv.z;
          vAlpha = smoothstep(0.0, 1.2, p.y) * (1.0 - smoothstep(uHeight * 0.7, uHeight, p.y)) * (0.35 + aSeed * 0.65);
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          gl_FragColor = vec4(uColor, smoothstep(0.5, 0.0, d) * vAlpha);
        }`,
    });
    return { geometry, material };
  }, [count, radius, height, size]);

  useEffect(() => () => (geometry.dispose(), material.dispose()), [geometry, material]);
  useFrame((_, dt) => {
    material.uniforms.uTime.value += dt;
    material.uniforms.uDpr.value = dpr;
  });
  return <points geometry={geometry} material={material} />;
}

/** Smoothly follows the pointer (-1..1) – used for parallax. */
export function usePointerLerp(amount = 0.05) {
  const v = useRef(new THREE.Vector2());
  useFrame((state) => {
    v.current.lerp(state.pointer, amount);
  });
  return v;
}

export const easeOutCubic = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);
export const easeOutBack = (x: number) => {
  const t = Math.min(Math.max(x, 0), 1);
  const c1 = 1.4;
  return 1 + (c1 + 1) * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
