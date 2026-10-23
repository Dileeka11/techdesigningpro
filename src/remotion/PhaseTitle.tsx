import { Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

const DISPLAY = 'var(--font-display, "Playfair Display"), Georgia, serif';
const SANS = 'var(--font-sans, "Poppins"), system-ui, sans-serif';

type Props = {
  readonly title: string;
  readonly index: number;
};

const PhaseTitleInner = ({ title, index }: Props) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const exit = durationInFrames - Math.round(0.4 * fps);

  return (
    <>
      <div style={{ position: "absolute", left: 88, bottom: 92, maxWidth: 820 }}>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 30,
            letterSpacing: 8,
            color: "#e4bf65",
            opacity: interpolate(frame, [0, 0.4 * fps, exit, durationInFrames], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [0, 0.5 * fps], ["-30px 0px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          {String(index).padStart(2, "0")} / 06
        </div>
        <div style={{ overflow: "hidden", paddingBottom: 8, marginTop: 10 }}>
          <div
            style={{
              fontFamily: DISPLAY,
              fontSize: 68,
              lineHeight: 1.05,
              color: "#ffffff",
              textShadow: "0 6px 40px rgba(0,0,0,0.7)",
              translate: interpolate(frame, [0, 0.6 * fps, exit, durationInFrames], ["0px 110%", "0px 0%", "0px 0%", "0px -110%"], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            marginTop: 18,
            height: 3,
            width: 160,
            background: "linear-gradient(90deg, #f0d58f, rgba(214,170,72,0))",
            transformOrigin: "left",
            scale: interpolate(frame, [0.2 * fps, 0.9 * fps, exit, durationInFrames], ["0 1", "1 1", "1 1", "0 1"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        />
      </div>
    </>
  );
};

/** One phase caption of the BIM workflow; each instance is editable in Studio. */
export const PhaseTitle = Interactive.create({
  Component: PhaseTitleInner,
  layout: "absolute-fill",
  schema: {
    title: { type: "string", default: "", description: "Title" },
    index: { type: "number", default: 1, min: 1, max: 6, step: 1, hiddenFromList: false, description: "Phase number" },
  },
});
