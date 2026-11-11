import { Composition } from "remotion";
import { Demo, DEMO_DURATION } from "./scenes/Demo";
import { Ep01, EP01_DURACAO, EP01_FPS } from "./ep01/Ep01";
import { VIDEO } from "./theme";

export const Root = () => (
  <>
    <Composition
      id="Ep01"
      component={Ep01}
      durationInFrames={EP01_DURACAO}
      fps={EP01_FPS}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Composition
      id="Demo"
      component={Demo}
      durationInFrames={DEMO_DURATION}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
  </>
);
