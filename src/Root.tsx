import { Composition } from "remotion";
import { Demo, DEMO_DURATION } from "./scenes/Demo";
import { Ep01, EP01_DURACAO, EP01_FPS } from "./ep01/Ep01";
import { Ep02, EP02_DURACAO, EP02_FPS } from "./ep02/Ep02";
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
      id="Ep02"
      component={Ep02}
      durationInFrames={EP02_DURACAO}
      fps={EP02_FPS}
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
