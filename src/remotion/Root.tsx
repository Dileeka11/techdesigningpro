import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { Composition } from "remotion";
import { BIMShowreel } from "./BIMShowreel";

// Studio / MP4 renders load the brand fonts here. On the website the fonts
// come from next/font, so these loaders never reach the site bundle.
loadPlayfair("normal", { weights: ["500"], subsets: ["latin"] });
loadPoppins("normal", { weights: ["400", "500"], subsets: ["latin"] });

export const RemotionRoot = () => {
  return (
    <>
      <Composition id="BIMShowreel" component={BIMShowreel} durationInFrames={540} fps={30} width={1280} height={720} />
    </>
  );
};
