"use client";

import { asset } from "@/lib/basePath";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { SceneProps } from "../LazyScene";
import { SceneCanvas } from "../SceneCanvas";
import { GOLD, GOLD_LIGHT, GoldDust } from "../common";

const R = 2;
const DEG = Math.PI / 180;

// Offices listed on the old site: Dubai | Philippines | India | Sri Lanka
export const OFFICES = [
  { name: "Dubai", lat: 25.2048, lng: 55.2708, hq: true },
  { name: "Philippines", lat: 14.5995, lng: 120.9842 },
  { name: "India", lat: 19.076, lng: 72.8777 },
  { name: "Sri Lanka", lat: 6.9271, lng: 79.8612 },
];

const toVec = (lat: number, lng: number, r = R) => {
  const phi = (90 - lat) * DEG;
  const theta = (lng + 180) * DEG;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
};

function LandDots() {
  const [data, setData] = useState<number[] | null>(null);
  const dpr = useThree((s) => s.viewport.dpr);
  useEffect(() => {
    let alive = true;
    fetch(asset("/data/globe-land.json"))
      .then((r) => r.json())
      .then((d: number[]) => alive && setData(d))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const obj = useMemo(() => {
    if (!data) return null;
    const n = data.length / 2;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const v = toVec(data[i * 2] / 10, data[i * 2 + 1] / 10, R);
      pos.set([v.x, v.y, v.z], i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uColor: { value: new THREE.Color(GOLD_LIGHT) }, uDpr: { value: 1 } },
      vertexShader: /* glsl */ `
        uniform float uDpr;
        varying float vFacing;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vec3 n = normalize(normalMatrix * normalize(position));
          vFacing = dot(n, normalize(-mv.xyz));
          gl_Position = projectionMatrix * mv;
          gl_PointSize = 5.0 * uDpr * (6.0 / -mv.z);
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vFacing;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float a = smoothstep(0.5, 0.15, d) * mix(0.08, 0.95, smoothstep(-0.1, 0.6, vFacing));
          gl_FragColor = vec4(uColor, a);
        }`,
    });
    return new THREE.Points(geo, mat);
  }, [data]);

  useEffect(
    () => () => {
      if (!obj) return;
      obj.geometry.dispose();
      (obj.material as THREE.Material).dispose();
    },
    [obj],
  );
  useFrame(() => {
    if (obj) (obj.material as THREE.ShaderMaterial).uniforms.uDpr.value = dpr;
  });
  return obj ? <primitive object={obj} /> : null;
}

function Atmosphere() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        uniforms: { uColor: { value: new THREE.Color(GOLD) } },
        vertexShader: `varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
        fragmentShader: `uniform vec3 uColor; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0 - abs(dot(vN, vV)), 3.0); gl_FragColor = vec4(uColor, f * 0.6); }`,
      }),
    [],
  );
  return (
    <mesh material={mat} scale={1.18}>
      <sphereGeometry args={[R, 64, 64]} />
    </mesh>
  );
}

/** Animated dashed arc from Dubai to each regional office. */
function Arc({ from, to, delay }: { from: THREE.Vector3; to: THREE.Vector3; delay: number }) {
  const line = useMemo(() => {
    const mid = from.clone().add(to).multiplyScalar(0.5);
    const lift = 1 + from.distanceTo(to) * 0.22;
    const curve = new THREE.QuadraticBezierCurve3(from, mid.normalize().multiplyScalar(R * lift), to);
    const pts = curve.getPoints(80);
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    geo.setAttribute("aT", new THREE.BufferAttribute(new Float32Array(pts.map((_, i) => i / (pts.length - 1))), 1));
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(GOLD_LIGHT) } },
      vertexShader: `attribute float aT; varying float vT; void main(){ vT = aT; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `uniform float uTime; uniform vec3 uColor; varying float vT;
        void main(){
          float grow = smoothstep(vT - 0.02, vT, uTime * 0.6);
          float dash = smoothstep(0.35, 0.5, fract(vT * 14.0 - uTime * 1.2));
          float head = smoothstep(0.12, 0.0, abs(vT - fract(uTime * 0.35)));
          gl_FragColor = vec4(uColor, grow * (0.25 + dash * 0.45 + head));
        }`,
    });
    return new THREE.Line(geo, mat);
  }, [from, to]);
  useEffect(() => () => (line.geometry.dispose(), (line.material as THREE.Material).dispose()), [line]);
  useFrame((state) => {
    (line.material as THREE.ShaderMaterial).uniforms.uTime.value = Math.max(0, state.clock.elapsedTime - delay);
  });
  return <primitive object={line} />;
}

function Pin({ pos, hq, delay }: { pos: THREE.Vector3; hq?: boolean; delay: number }) {
  const ring = useRef<THREE.Mesh>(null);
  const quat = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize()), [pos]);
  useFrame((state) => {
    const t = (state.clock.elapsedTime * 0.8 + delay) % 1;
    if (ring.current) {
      ring.current.scale.setScalar(0.4 + t * 1.8);
      (ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.9;
    }
  });
  const tip = pos.clone().multiplyScalar(hq ? 1.14 : 1.09);
  return (
    <group>
      <mesh position={pos.clone().multiplyScalar(1.004)} quaternion={quat} ref={ring}>
        <ringGeometry args={[0.07, 0.09, 40]} />
        <meshBasicMaterial color={hq ? "#ff6b7d" : GOLD_LIGHT} transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={pos.clone().lerp(tip, 0.5)} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize())}>
        <cylinderGeometry args={[0.006, 0.006, pos.distanceTo(tip), 6]} />
        <meshBasicMaterial color={GOLD_LIGHT} />
      </mesh>
      <mesh position={tip}>
        <sphereGeometry args={[hq ? 0.05 : 0.035, 16, 16]} />
        <meshBasicMaterial color={hq ? "#ff6b7d" : "#fff1c4"} />
      </mesh>
    </group>
  );
}

function Globe() {
  const group = useRef<THREE.Group>(null);
  const drag = useRef({ down: false, x: 0, offset: 0, vel: 0 });
  const gl = useThree((s) => s.gl);
  const size = useThree((s) => s.size);
  const pins = useMemo(() => OFFICES.map((o) => ({ ...o, pos: toVec(o.lat, o.lng, R) })), []);
  const hq = pins[0].pos;
  const base = -(85 + 90) * DEG; // centre the view on the Gulf / South Asia

  useEffect(() => {
    const el = gl.domElement;
    el.style.touchAction = "pan-y";
    el.style.cursor = "grab";
    const down = (e: PointerEvent) => {
      drag.current.down = true;
      drag.current.x = e.clientX;
      el.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (!drag.current.down) return;
      const dx = e.clientX - drag.current.x;
      drag.current.x = e.clientX;
      drag.current.vel = (dx / size.width) * 4;
      drag.current.offset += drag.current.vel;
    };
    const up = () => {
      drag.current.down = false;
      el.style.cursor = "grab";
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [gl, size.width]);

  useFrame((state, dt) => {
    const d = drag.current;
    if (!d.down) {
      d.vel *= 0.94;
      d.offset += d.vel;
      d.offset *= 1 - Math.min(dt * 0.35, 1); // ease back towards the offices
    }
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = base + Math.sin(t * 0.25) * 0.35 + d.offset;
      group.current.rotation.x = 0.32 + state.pointer.y * 0.06;
    }
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[R * 0.995, 64, 64]} />
        <meshStandardMaterial color="#09090c" metalness={0.6} roughness={0.55} transparent opacity={0.92} />
      </mesh>
      <mesh>
        <sphereGeometry args={[R * 1.001, 36, 18]} />
        <meshBasicMaterial color={GOLD} wireframe transparent opacity={0.05} />
      </mesh>
      <LandDots />
      <Atmosphere />
      {pins.map((p, i) => (
        <Pin key={p.name} pos={p.pos} hq={p.hq} delay={i * 0.25} />
      ))}
      {pins.slice(1).map((p, i) => (
        <Arc key={p.name} from={hq} to={p.pos} delay={0.6 + i * 0.5} />
      ))}
    </group>
  );
}

export default function OfficeGlobe({ active, reduced, onReady }: SceneProps) {
  return (
    <SceneCanvas active={active} reduced={reduced} onReady={onReady} camera={{ position: [0, 0, 8.2], fov: 36 }} env={0.6}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 3, 5]} intensity={1.2} color="#fff3dc" />
      <Globe />
      <group position-y={-3}>
        <GoldDust count={140} radius={4.5} height={6} size={16} />
      </group>
    </SceneCanvas>
  );
}
