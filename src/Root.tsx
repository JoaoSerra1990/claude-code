import { Composition } from "remotion";
import { Demo, DEMO_DURATION } from "./scenes/Demo";
import { VIDEO } from "./theme";

export const Root = () => (
  <Composition
    id="Demo"
    component={Demo}
    durationInFrames={DEMO_DURATION}
    fps={VIDEO.fps}
    width={VIDEO.width}
    height={VIDEO.height}
  />
);
