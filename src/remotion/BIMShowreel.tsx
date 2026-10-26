// "BIM workflow" showreel – a 3D building goes from a schematic plan to a
// lit, operating tower. Embedded on the home page with @remotion/player and
// renderable to MP4 from Remotion Studio (npm run studio).
// All captions are phrases taken from the TechDesigningPro website.
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, Easing, Img, Interactive, Sequence, Track, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BuildingModel } from "./BuildingModel";
import { PhaseTitle } from "./PhaseTitle";

const DISPLAY = 'var(--font-display, "Playfair Display"), Georgia, serif';
const SANS = 'var(--font-sans, "Poppins"), system-ui, sans-serif';
const PHASES = 6;
const PHASE_LEN = 78;

/** `dpr` and `logo` are only passed by the website player (3D resolution cap, sub-folder-safe logo URL); Studio/MP4 renders keep the defaults. */
export const BIMShowreel = ({ dpr, logo = staticFile("images/brand/logo.webp") }: { dpr?: number; logo?: string }) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#070709",
        backgroundImage:
          "radial-gradient(ellipse at 60% 40%, rgba(214,170,72,0.16), transparent 60%), linear-gradient(rgba(214,170,72,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(214,170,72,0.05) 1px, transparent 1px)",
        backgroundSize: "100% 100%, 64px 64px, 64px 64px",
      }}
    >
      <ThreeCanvas name="Building model" width={width} height={height} dpr={dpr} camera={{ fov: 34, position: [7, 8, 7] }}>
        <BuildingModel />
      </ThreeCanvas>

      {/* Vignette for legibility */}
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(7,7,9,0.85) 0%, rgba(7,7,9,0) 45%), radial-gradient(ellipse at center, transparent 55%, rgba(7,7,9,0.7))" }} />

      <Interactive.Div
        name="Logo"
        style={{
          position: "absolute",
          left: 88,
          top: 64,
          opacity: interpolate(frame, [8, 30, 455, 470], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <Img src={logo} style={{ height: 58, width: "auto" }} />
      </Interactive.Div>

      {/* Phase progress */}
      <div style={{ position: "absolute", right: 88, top: 82, display: "flex", gap: 10 }}>
        {Array.from({ length: PHASES }, (_, i) => (
          <div key={i} style={{ width: 56, height: 3, background: "rgba(255,255,255,0.15)", overflow: "hidden", borderRadius: 3 }}>
            <div
              style={{
                height: "100%",
                background: "#e4bf65",
                transformOrigin: "left",
                scale: `${interpolate(frame, [i * PHASE_LEN, (i + 1) * PHASE_LEN], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} 1`,
              }}
            />
          </div>
        ))}
      </div>

      <Track name="Phase titles">
        <PhaseTitle name="Schematic Design" from={0} durationInFrames={PHASE_LEN} title="Schematic Design" index={1} />
        <PhaseTitle name="Design Development" from={PHASE_LEN} durationInFrames={PHASE_LEN} title="DESIGN DEVELOPMENT" index={2} />
        <PhaseTitle name="3D BIM" from={2 * PHASE_LEN} durationInFrames={PHASE_LEN} title="3D BUILDING INFORMATION MODELLING" index={3} />
        <PhaseTitle name="Clash detection" from={3 * PHASE_LEN} durationInFrames={PHASE_LEN} title="CLASH DETECTION & REPORTING" index={4} />
        <PhaseTitle name="4D sequencing" from={4 * PHASE_LEN} durationInFrames={PHASE_LEN} title="4D CONSTRUCTION SEQUENCING" index={5} />
        <PhaseTitle name="Facility management" from={5 * PHASE_LEN} durationInFrames={PHASE_LEN} title="FACILITY MANAGEMENT & OPERATIONS" index={6} />
      </Track>

      <Sequence name="Outro" from={PHASES * PHASE_LEN} durationInFrames={durationInFrames - PHASES * PHASE_LEN}>
        <Outro logo={logo} />
      </Sequence>

      {/* Fade in / out so the loop is seamless */}
      <AbsoluteFill
        style={{
          backgroundColor: "#070709",
          pointerEvents: "none",
          opacity: interpolate(frame, [0, 10, durationInFrames - 12, durationInFrames - 1], [1, 0, 0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
};

const Outro = ({ logo }: { logo: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = (delay: number) => ({
    opacity: interpolate(frame, [delay, delay + 0.5 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    translate: interpolate(frame, [delay, delay + 0.7 * fps], ["0px 40px", "0px 0px"], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }),
  });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: "rgba(7,7,9,0.55)" }}>
      <Interactive.Div name="Outro logo" style={{ ...enter(0) }}>
        <Img src={logo} style={{ height: 120, width: "auto" }} />
      </Interactive.Div>
      <Interactive.Div
        name="Outro kicker"
        style={{ marginTop: 36, fontFamily: SANS, fontSize: 30, letterSpacing: 8, color: "#e4bf65", textTransform: "uppercase", ...enter(6) }}
      >
        Building the Future:
      </Interactive.Div>
      <Interactive.Div
        name="Outro headline"
        style={{ marginTop: 12, fontFamily: DISPLAY, fontSize: 76, color: "#ffffff", textAlign: "center", ...enter(12) }}
      >
        Transforming Ideas into Reality!
      </Interactive.Div>
    </AbsoluteFill>
  );
};
