import { Composition } from "remotion";
import { Demo, DEMO_DURATION } from "./scenes/Demo";
import { Ep01, EP01_DURACAO, EP01_FPS } from "./ep01/Ep01";
import { Ep02, EP02_DURACAO, EP02_FPS } from "./ep02/Ep02";
import { Minutos, MINUTOS_DURACAO, MINUTOS_FPS } from "./minutos/Minutos";
import { Mare01, MARE01_DURACAO, MARE01_FPS } from "./mare01/Mare01";
import { Trem, TREM_DURACAO, TREM_FPS } from "./trem/Trem";
import { Mare02, MARE02_DURACAO, MARE02_FPS } from "./mare02/Mare02";
import { CidadeSemAmanha, CIDADE_DURACAO, CIDADE_FPS } from "./cidade/Cidade";
import { Tempo, TEMPO_DURACAO, TEMPO_FPS } from "./tempo/Tempo";
import { Futuro, FUTURO_DURACAO, FUTURO_FPS } from "./futuro/Futuro";
import { Abismo, ABISMO_DURACAO, ABISMO_FPS } from "./abismo/Abismo";
import { Labirinto, LABIRINTO_DURACAO, LABIRINTO_FPS } from "./labirinto/Labirinto";
import { Oito, OITO_DURACAO, OITO_FPS } from "./oito/Oito";
import { Andar, ANDAR_DURACAO, ANDAR_FPS } from "./andar/Andar";
import { Repete, REPETE_DURACAO, REPETE_FPS } from "./repete/Repete";
import { Mentira, MENTIRA_DURACAO, MENTIRA_FPS } from "./mentira/Mentira";
import { Silencio, SILENCIO_DURACAO, SILENCIO_FPS } from "./silencio/Silencio";
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
      id="Minutos"
      component={Minutos}
      durationInFrames={MINUTOS_DURACAO}
      fps={MINUTOS_FPS}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Composition
      id="Mare01"
      component={Mare01}
      durationInFrames={MARE01_DURACAO}
      fps={MARE01_FPS}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Composition
      id="Trem"
      component={Trem}
      durationInFrames={TREM_DURACAO}
      fps={TREM_FPS}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Composition
      id="Mare02"
      component={Mare02}
      durationInFrames={MARE02_DURACAO}
      fps={MARE02_FPS}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Composition
      id="Cidade"
      component={CidadeSemAmanha}
      durationInFrames={CIDADE_DURACAO}
      fps={CIDADE_FPS}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Composition
      id="Tempo"
      component={Tempo}
      durationInFrames={TEMPO_DURACAO}
      fps={TEMPO_FPS}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Composition
      id="Futuro"
      component={Futuro}
      durationInFrames={FUTURO_DURACAO}
      fps={FUTURO_FPS}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Composition id="Abismo" component={Abismo} durationInFrames={ABISMO_DURACAO} fps={ABISMO_FPS} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="Labirinto" component={Labirinto} durationInFrames={LABIRINTO_DURACAO} fps={LABIRINTO_FPS} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="Oito" component={Oito} durationInFrames={OITO_DURACAO} fps={OITO_FPS} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="Andar" component={Andar} durationInFrames={ANDAR_DURACAO} fps={ANDAR_FPS} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="Repete" component={Repete} durationInFrames={REPETE_DURACAO} fps={REPETE_FPS} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="Mentira" component={Mentira} durationInFrames={MENTIRA_DURACAO} fps={MENTIRA_FPS} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="Silencio" component={Silencio} durationInFrames={SILENCIO_DURACAO} fps={SILENCIO_FPS} width={VIDEO.width} height={VIDEO.height} />
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
