// 3D building that is designed, modelled, coordinated and built over the
// showreel timeline. Everything is driven by useCurrentFrame() so it renders
// identically in the Player, in Studio and in an MP4 render.
import { useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo } from "react";
import { Easing, interpolate, random, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const GOLD = "#d6aa48";
const GOLD_LIGHT = "#f3d98e";
const CRIMSON = "#d0314f";
const FLOORS = 8;
const FH = 0.55;
const W = 2.4;
const HEIGHT = FLOORS * FH;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

/** Frame-driven orbit camera. */
function CameraRig() {
  const frame = useCurrentFrame();
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  useLayoutEffect(() => {
    // Shift the frame so the building sits right of centre, clear of the captions.
    camera.setViewOffset(size.width, size.height, -size.width * 0.17, 0, size.width, size.height);
    const angle = interpolate(frame, [0, 540], [0.85, 0.85 + Math.PI * 1.05], clamp);
    const radius = interpolate(frame, [0, 80, 240, 470, 540], [9, 10.5, 12.5, 13.5, 16], { ...clamp, easing: Easing.inOut(Easing.cubic) });
    const height = interpolate(frame, [0, 80, 170, 470, 540], [9.5, 7.6, 5.6, 5.8, 7.4], { ...clamp, easing: Easing.inOut(Easing.cubic) });
    const lookY = interpolate(frame, [0, 170, 540], [0.2, 2.0, 2.3], clamp);
    camera.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
    camera.lookAt(0, lookY, 0);
  }, [frame, camera, size]);
  return null;
}

function Environment() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

function Ground() {
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(30, 60, GOLD, GOLD);
    const m = g.material as THREE.LineBasicMaterial;
    m.transparent = true;
    m.opacity = 0.14;
    return g;
  }, []);
  return <primitive object={grid} />;
}

/** Schematic floor plan drawn line by line on the ground. */
function FloorPlan({ progress, opacity }: { progress: number; opacity: number }) {
  const line = useMemo(() => {
    const h = W / 2;
    const s: number[] = [
      -h, -h, h, -h, h, -h, h, h, h, h, -h, h, -h, h, -h, -h, // outline
      -h, 0.2, 0.3, 0.2, 0.3, 0.2, 0.3, h, // inner walls
      -0.4, -h, -0.4, -0.4, 0.6, -0.5, h, -0.5,
      -h - 0.35, -h, -h - 0.35, h, h + 0.35, -h, h + 0.35, h, // dimension lines
      -h, -h - 0.35, h, -h - 0.35,
    ];
    const pts: number[] = [];
    for (let i = 0; i < s.length; i += 4) pts.push(s[i], 0.012, s[i + 1], s[i + 2], 0.012, s[i + 3]);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: GOLD_LIGHT, transparent: true }));
  }, []);
  const count = line.geometry.getAttribute("position").count;
  line.geometry.setDrawRange(0, Math.floor((progress * count) / 2) * 2);
  (line.material as THREE.LineBasicMaterial).opacity = opacity;
  return <primitive object={line} />;
}

/** Design-development massing: a wireframe volume extruding from the plan. */
function Massing({ progress, opacity }: { progress: number; opacity: number }) {
  const obj = useMemo(() => {
    const box = new THREE.BoxGeometry(W, HEIGHT, W);
    return new THREE.LineSegments(new THREE.EdgesGeometry(box), new THREE.LineBasicMaterial({ color: GOLD_LIGHT, transparent: true }));
  }, []);
  const s = Math.max(progress, 0.001);
  obj.scale.set(1, s, 1);
  obj.position.y = (HEIGHT * s) / 2;
  (obj.material as THREE.LineBasicMaterial).opacity = opacity;
  return <primitive object={obj} />;
}

function windowTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 32 * FLOORS;
  const g = c.getContext("2d")!;
  g.fillStyle = "#000";
  g.fillRect(0, 0, c.width, c.height);
  const cols = 9;
  const cw = c.width / cols;
  for (let r = 0; r < FLOORS; r++)
    for (let k = 0; k < cols; k++) {
      if (random(`win-${r}-${k}`) < 0.35) continue;
      const warm = 180 + random(`warm-${r}-${k}`) * 60;
      g.fillStyle = `rgba(255, ${Math.round(warm)}, ${Math.round(warm * 0.45)}, ${0.4 + random(`a-${r}-${k}`) * 0.6})`;
      g.fillRect(k * cw + 3, r * 32 + 7, cw - 6, 20);
    }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function Floors({ frame }: { frame: number }) {
  const assets = useMemo(() => {
    const tex = windowTexture();
    const glassGeo = new THREE.BoxGeometry(W * 0.94, FH - 0.07, W * 0.94);
    return {
      slab: new THREE.BoxGeometry(W + 0.1, 0.07, W + 0.1),
      col: new THREE.CylinderGeometry(0.04, 0.04, FH, 8),
      glassGeo,
      glassEdges: new THREE.EdgesGeometry(glassGeo),
      gold: new THREE.MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: 0.25 }),
      line: new THREE.LineBasicMaterial({ color: GOLD_LIGHT, transparent: true, opacity: 0.7 }),
      glass: Array.from({ length: FLOORS }, (_, i) => {
        const t = tex.clone();
        t.repeat.set(1, 1 / FLOORS);
        t.offset.set(0, i / FLOORS);
        t.needsUpdate = true;
        return new THREE.MeshStandardMaterial({
          color: "#0d0d13",
          metalness: 0.85,
          roughness: 0.1,
          emissive: new THREE.Color("#ffc36b"),
          emissiveMap: t,
          transparent: true,
        });
      }),
    };
  }, []);

  const lit = interpolate(frame, [400, 450], [0.15, 1.8], { ...clamp, easing: ease });
  const corners: [number, number][] = [
    [-W / 2 + 0.1, -W / 2 + 0.1],
    [W / 2 - 0.1, -W / 2 + 0.1],
    [-W / 2 + 0.1, W / 2 - 0.1],
    [W / 2 - 0.1, W / 2 - 0.1],
  ];

  return (
    <>
      {Array.from({ length: FLOORS }, (_, i) => {
        // 3D BIM: slabs + columns rise floor by floor
        const s = interpolate(frame, [165 + i * 8, 190 + i * 8], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
        // 4D sequencing: facade glass installed bottom-up
        const g = interpolate(frame, [325 + i * 8, 345 + i * 8], [0, 1], { ...clamp, easing: ease });
        const mat = assets.glass[i];
        mat.opacity = g * 0.92;
        mat.emissiveIntensity = lit;
        const y = i * FH;
        return (
          <group key={i} position-y={y}>
            <mesh geometry={assets.slab} material={assets.gold} scale={[Math.max(s, 0.001), 1, Math.max(s, 0.001)]} />
            {corners.map(([x, z], k) => (
              <mesh key={k} geometry={assets.col} material={assets.gold} position={[x, FH / 2, z]} scale={[1, Math.max(s, 0.001), 1]} />
            ))}
            {g > 0.001 ? (
              <group position-y={FH / 2 + (1 - g) * 0.6}>
                <mesh geometry={assets.glassGeo} material={mat} />
                <lineSegments geometry={assets.glassEdges} material={assets.line} />
              </group>
            ) : null}
          </group>
        );
      })}
      {/* roof slab */}
      <mesh
        geometry={assets.slab}
        material={assets.gold}
        position-y={HEIGHT}
        scale={Math.max(interpolate(frame, [235, 255], [0, 1], { ...clamp, easing: ease }), 0.001)}
      />
    </>
  );
}

/** MEP risers + a duct that clashes, gets flagged and is then resolved. */
function Mep({ frame }: { frame: number }) {
  const grow = interpolate(frame, [245, 285], [0, 1], { ...clamp, easing: ease });
  const duct = interpolate(frame, [255, 285], [0, 1], { ...clamp, easing: ease });
  const resolved = interpolate(frame, [298, 312], [0, 1], { ...clamp, easing: ease });
  const pulse = 1 + Math.sin(frame * 0.5) * 0.25 * (1 - resolved);
  const marker = interpolate(frame, [280, 290, 305, 318], [0, 1, 1, 0], clamp);
  const fade = interpolate(frame, [400, 430], [1, 0.35], clamp);
  const h = Math.max(HEIGHT * grow, 0.001);
  const ductY = 4 * FH + 0.28 + resolved * 0.16;
  return (
    <group>
      <mesh position={[0.45, h / 2, -0.35]}>
        <cylinderGeometry args={[0.06, 0.06, h, 12]} />
        <meshStandardMaterial color={CRIMSON} metalness={0.4} roughness={0.35} transparent opacity={fade} />
      </mesh>
      <mesh position={[-0.5, h / 2, 0.45]}>
        <cylinderGeometry args={[0.05, 0.05, h, 12]} />
        <meshStandardMaterial color="#eef0f6" metalness={0.6} roughness={0.25} transparent opacity={fade} />
      </mesh>
      <mesh position={[0, ductY, -0.35]} rotation-z={Math.PI / 2} scale={[1, Math.max(duct, 0.001), 1]}>
        <cylinderGeometry args={[0.07, 0.07, W * 0.9, 12]} />
        <meshStandardMaterial color={GOLD_LIGHT} metalness={0.8} roughness={0.3} transparent opacity={fade} />
      </mesh>
      {marker > 0.001 ? (
        <mesh position={[0.45, 4 * FH + 0.28, -0.35]} scale={0.22 * pulse * marker}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshBasicMaterial color={resolved > 0.5 ? GOLD_LIGHT : CRIMSON} transparent opacity={0.55} depthWrite={false} />
        </mesh>
      ) : null}
    </group>
  );
}

/** Facility management: a scanning ring sweeping the finished building. */
function ScanRing({ frame }: { frame: number }) {
  const p = interpolate(frame, [405, 470], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const o = interpolate(frame, [405, 415, 462, 472], [0, 1, 1, 0], clamp);
  if (o <= 0.001) return null;
  return (
    <mesh position-y={p * HEIGHT} rotation-x={Math.PI / 2}>
      <torusGeometry args={[W * 0.95, 0.012, 8, 120]} />
      <meshBasicMaterial color={GOLD_LIGHT} transparent opacity={o} />
    </mesh>
  );
}

export function BuildingModel() {
  const frame = useCurrentFrame();
  const plan = interpolate(frame, [6, 70], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const planOpacity = interpolate(frame, [0, 6, 160, 200], [0, 1, 1, 0.35], clamp);
  const massing = interpolate(frame, [82, 150], [0, 1], { ...clamp, easing: ease });
  const massingOpacity = interpolate(frame, [82, 95, 165, 230], [0, 0.95, 0.95, 0.08], clamp);
  return (
    <>
      <CameraRig />
      <Environment />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 9, 6]} intensity={1.6} color="#fff3dc" />
      <directionalLight position={[-6, 5, -7]} intensity={1.1} color={GOLD_LIGHT} />
      <pointLight position={[-3, 2, 4]} intensity={16} distance={14} color={GOLD} />
      <fog attach="fog" args={["#070709", 12, 30]} />
      <Ground />
      <FloorPlan progress={plan} opacity={planOpacity} />
      <Massing progress={massing} opacity={massingOpacity} />
      <Floors frame={frame} />
      <Mep frame={frame} />
      <ScanRing frame={frame} />
    </>
  );
}
