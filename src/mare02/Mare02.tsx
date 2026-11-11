import { AbsoluteFill, interpolate } from "remotion";
import manifestoJson from "./manifest.json";
import { COLORS, FONT } from "../theme";
import {
  Episodio, Som, decai, est as e, sobe, tempos,
  type Bloco, type Contexto, type Manifesto, type Shot,
} from "../serie/motor";
import {
  AguaRua, Cidade, Entrada, Escada, Escritorio, ESCOLA_LONGE, JANELA_SILHUETA, Orla, PLACA_ESCOLA, Submersa,
} from "../mare/cenarios";
import { ELENCO_MARE } from "../mare01/Mare01";

// A Última Maré — Episódio 2: A Primeira Onda.
// Começa no grito de Lucas; termina com a silhueta na janela da escola.

const manifesto = manifestoJson as Manifesto;
const FPS = manifesto.fps;
const PRETO = manifestoJson.preto;
const { ini, fim, pal } = tempos(manifesto);
const ELENCO = { Lucas: ELENCO_MARE.Lucas, Marina: ELENCO_MARE.Marina };

const BLOCOS: Record<string, Bloco> = {
  cidade: {
    Lucas: e(520, 1760, 0.74, "panico", [1, -0.3]),
    Marina: e(330, 1790, 0.72, "panico", [1, -0.3]),
  },
  fuga: {
    Lucas: e(560, 1450, 0.4, "panico", [0, 0], "recuar"),
    Marina: e(400, 1460, 0.4, "panico", [0, 0], "recuar"),
  },
  entrada: {
    Lucas: e(470, 1770, 0.76, "panico", [-0.6, -0.2]),
    Marina: e(760, 1790, 0.74, "panico", [-0.8, -0.2]),
  },
  escada1: {
    Marina: e(160, 1778, 0.5, "panico", [1, -0.6]),
    Lucas: e(40, 1800, 0.52, "panico", [1, -0.6]),
  },
  escada2: {
    Marina: e(860, 1357, 0.5, "panico", [-1, -0.6]),
    Lucas: e(960, 1380, 0.52, "panico", [-1, -0.6]),
  },
  escada3: {
    Marina: e(220, 937, 0.5, "panico", [1, -0.6]),
    Lucas: e(120, 960, 0.52, "panico", [1, -0.6]),
  },
  janela: {
    Marina: e(330, 1760, 0.74, "medo", [0.6, -1]),
    Lucas: e(720, 1760, 0.76, "medo", [-0.6, -1]),
  },
};

const ROSTO_LUCAS_RUA: [number, number] = [520, 1249];
const ROSTO_MARINA_PORTA: [number, number] = [760, 1279];
const ROSTO_MARINA_JANELA: [number, number] = [330, 1249];
const ROSTO_LUCAS_JANELA: [number, number] = [720, 1236];
const [EX, EY] = ESCOLA_LONGE;
const [SX, SY] = JANELA_SILHUETA;

const T_ORLA = fim("04") + 0.5;
const T_PORTA = fim("05") + 1.6;
const T_OMBRO = T_PORTA + 2.6;
const T_ESCADA = fim("07") + 0.4;

const SHOTS: Shot[] = [
  // 00–09 s | O grito de Lucas
  { id: "grito", de: 0, ate: fim("01") + 0.15, fundo: "cidade", bloco: "cidade", luz: "ameaca", tremor: 8,
    cam: [[ROSTO_LUCAS_RUA[0], ROSTO_LUCAS_RUA[1], 2.6], [ROSTO_LUCAS_RUA[0], ROSTO_LUCAS_RUA[1], 2.9]],
    at: { Lucas: { pose: "recuar", tremor: true } } },
  { id: "muralha", de: fim("01") + 0.15, ate: pal("02", "mas") - 0.1, fundo: "cidade", bloco: "cidade", luz: "ameaca", tremor: 6,
    cam: [[540, 980, 1.0], [540, 930, 1.12]], at: { Lucas: { olhar: [0, -1] }, Marina: { olhar: [0.3, -1] } } },
  { id: "caminho", de: pal("02", "mas") - 0.1, ate: fim("02") + 0.3, fundo: "cidade", bloco: "cidade", luz: "ameaca", tremor: 5,
    cam: [[PLACA_ESCOLA[0] - 120, PLACA_ESCOLA[1] + 40, 1.5], [ROSTO_LUCAS_RUA[0] + 60, ROSTO_LUCAS_RUA[1] - 60, 1.9]],
    at: { Lucas: { expr: "triste", olhar: [1, -0.6] } } },

  // 09–20 s | A fuga
  { id: "puxa", de: fim("02") + 0.3, ate: fim("03") + 0.2, fundo: "cidade", bloco: "cidade", luz: "ameaca", tremor: 6,
    cam: [[450, 1240, 1.7], [380, 1240, 1.85]],
    at: {
      Marina: { x: 380, xPara: 250, pose: "apontarDir", olhar: [1, 0] },
      Lucas: { x: 560, xPara: 430, pose: "recuar", olhar: [1, -0.4] },
    } },
  { id: "correm", de: fim("03") + 0.2, ate: T_ORLA, fundo: "cidade", bloco: "fuga", luz: "ameaca", tremor: 7,
    cam: [[540, 1150, 1.0], [540, 1260, 1.12]],
    at: { Lucas: { xPara: 640, yPara: 1880, sPara: 0.9 }, Marina: { xPara: 330, yPara: 1900, sPara: 0.88 } } },

  // 20–33 s | O impacto
  { id: "impacto", de: T_ORLA, ate: ini("05") + 1.6, fundo: "orla", luz: "ameaca", tremor: 10,
    cam: [[540, 1000, 1.0], [600, 1000, 1.06]] },
  { id: "carros", de: ini("05") + 1.6, ate: pal("05", "o") + 2.0, fundo: "orla", luz: "ameaca", tremor: 8,
    cam: [[560, 1400, 1.7], [420, 1360, 1.85]] },
  { id: "esquina", de: pal("05", "o") + 2.0, ate: T_PORTA, fundo: "orla", luz: "ameaca", tremor: 5,
    cam: [[800, 1150, 1.35], [260, 1180, 1.35]] },

  // 33–46 s | A porta travada
  { id: "chegam", de: T_PORTA, ate: T_OMBRO, fundo: "entrada", bloco: "entrada", luz: "ameaca", tremor: 3,
    cam: [[620, 1340, 1.25], [560, 1340, 1.4]],
    at: { Lucas: { x: 1160, xPara: 470 }, Marina: { x: 1300, xPara: 760 } } },
  { id: "ombro", de: T_OMBRO, ate: ini("06") - 0.3, fundo: "entrada", bloco: "entrada", luz: "ameaca", tremor: 4,
    cam: [[470, 1330, 1.85], [470, 1330, 2.05]],
    at: { Lucas: { x: 430, pose: "empurrar", expr: "bravo", tremor: true, olhar: [-1, 0] } } },
  { id: "a_escada", de: ini("06") - 0.3, ate: fim("06") + 0.3, fundo: "entrada", bloco: "entrada", luz: "ameaca",
    cam: [[ROSTO_MARINA_PORTA[0], ROSTO_MARINA_PORTA[1], 2.5], [ROSTO_MARINA_PORTA[0], ROSTO_MARINA_PORTA[1], 2.8]],
    at: { Marina: { pose: "apontarEsq", olhar: [-1, 0] }, Lucas: { x: 430 } } },
  { id: "entram", de: fim("06") + 0.3, ate: T_ESCADA, fundo: "entrada", bloco: "entrada", luz: "ameaca", tremor: 3,
    cam: [[560, 1340, 1.3], [540, 1300, 1.45]],
    at: { Lucas: { x: 430, xPara: 470, yPara: 1650, sPara: 0.62 }, Marina: { xPara: 610, yPara: 1660, sPara: 0.6 } } },

  // 46–59 s | Subindo contra o tempo
  { id: "lance1", de: T_ESCADA, ate: pal("08", "lucas") - 0.1, fundo: "escada", bloco: "escada1", luz: "noite", tremor: 4,
    cam: [[420, 1560, 1.5], [660, 1420, 1.6]],
    at: { Marina: { xPara: 760, yPara: 1455 }, Lucas: { xPara: 640, yPara: 1520 } } },
  { id: "lance2", de: pal("08", "lucas") - 0.1, ate: pal("08", "cada") - 0.1, fundo: "escada", bloco: "escada2", luz: "noite", tremor: 7,
    cam: [[760, 1200, 1.55], [420, 1060, 1.65]],
    at: { Marina: { xPara: 300, yPara: 1030 }, Lucas: { xPara: 420, yPara: 1100 } } },
  { id: "lance3", de: pal("08", "cada") - 0.1, ate: fim("08") + 1.6, fundo: "escada", bloco: "escada3", luz: "noite", tremor: 5,
    cam: [[380, 780, 1.6], [760, 560, 1.75]],
    at: { Marina: { xPara: 900, yPara: 540 }, Lucas: { xPara: 780, yPara: 610 } } },
  { id: "agua_sobe", de: fim("08") + 1.6, ate: fim("08") + 3.6, fundo: "escada", luz: "noite", tremor: 4,
    cam: [[540, 1420, 1.1], [540, 1380, 1.2]] },

  // 59–71 s | A cidade submersa
  { id: "abre", de: fim("08") + 3.6, ate: ini("09") - 0.2, fundo: "submersa", luz: "ameaca",
    cam: [[540, 900, 1.0], [540, 900, 1.06]] },
  { id: "marina_ve", de: ini("09") - 0.2, ate: fim("09") + 0.4, fundo: "escritorio", bloco: "janela", luz: "ameaca",
    cam: [[ROSTO_MARINA_JANELA[0], ROSTO_MARINA_JANELA[1], 2.5], [ROSTO_MARINA_JANELA[0], ROSTO_MARINA_JANELA[1], 2.8]],
    at: { Marina: { expr: "congelado", olhar: [1, 0.2] } } },
  { id: "cidade_alagada", de: fim("09") + 0.4, ate: pal("10", "lucas") - 0.1, fundo: "submersa", luz: "ameaca",
    cam: [[640, 1300, 1.0], [520, 1000, 1.35]] },
  { id: "lucas_ve", de: pal("10", "lucas") - 0.1, ate: fim("10") + 0.6, fundo: "escritorio", bloco: "janela", luz: "ameaca",
    cam: [[ROSTO_LUCAS_JANELA[0], ROSTO_LUCAS_JANELA[1], 2.6], [ROSTO_LUCAS_JANELA[0], ROSTO_LUCAS_JANELA[1], 2.9]],
    at: { Lucas: { expr: "triste", lagrima: true, olhar: [-0.8, -0.5] } } },
  { id: "escola_longe", de: fim("10") + 0.6, ate: ini("11") - 0.1, fundo: "submersa", luz: "ameaca",
    cam: [[EX, EY, 2.0], [EX + 20, EY - 10, 2.7]] },

  // 71–85 s | Gancho: a escola
  { id: "lucas_grita", de: ini("11") - 0.1, ate: fim("11") + 0.3, fundo: "escritorio", bloco: "janela", luz: "ameaca", tremor: 6,
    cam: [[ROSTO_LUCAS_JANELA[0] - 40, ROSTO_LUCAS_JANELA[1], 2.3], [ROSTO_LUCAS_JANELA[0] - 40, ROSTO_LUCAS_JANELA[1], 2.6]],
    at: { Lucas: { expr: "panico", pose: "apontarEsq", lagrima: true, olhar: [-1, -0.6], tremor: true } } },
  { id: "onda_escola", de: fim("11") + 0.3, ate: pal("12", "mas") - 0.1, fundo: "submersa", luz: "ameaca", tremor: 4,
    cam: [[EX + 120, EY + 40, 2.2], [EX + 40, EY, 2.6]] },
  { id: "silhueta", de: pal("12", "mas") - 0.1, ate: PRETO, fundo: "submersa", luz: "ameaca",
    cam: [[SX, SY, 4.2], [SX, SY, 5.4]] },
];

const plano = (id: string) => SHOTS.find((s) => s.id === id)!;
const P_CORREM = plano("correm"), P_ESQ = plano("esquina"), P_CARROS = plano("carros"), P_ENTRAM = plano("entram");
const P_A_ESCADA = plano("a_escada"), P_L1 = plano("lance1"), P_L2 = plano("lance2"), P_AGUA = plano("agua_sobe");
const P_ABRE = plano("abre"), P_ONDA = plano("onda_escola"), P_SIL = plano("silhueta");
const T_BATE = P_ONDA.de + (P_ONDA.ate - P_ONDA.de) * 0.82;

/** Nível da água na rua em frente ao prédio. */
const aguaRua = (t: number) => 0.45 + sobe(t, T_PORTA, P_ENTRAM.ate) * 0.55;

const cenario = ({ t, shot }: Contexto) => {
  switch (shot.fundo) {
    case "cidade":
      return <Cidade t={t} onda={0.5 + sobe(t, 0, T_ORLA) * 0.35} povo={t < plano("puxa").de ? 6 : 14} />;
    case "orla":
      return <Orla t={t} frente={sobe(t, T_ORLA + 0.6, P_ESQ.ate - 1.2)} />;
    case "entrada":
      return (
        <Entrada t={t} agua={aguaRua(t)}
          porta={sobe(t, P_A_ESCADA.de - 0.5, P_A_ESCADA.de)}
          chacoalha={t >= T_OMBRO && t < P_A_ESCADA.de - 0.5 ? 1 : 0}
          invade={sobe(t, P_ENTRAM.de, P_ENTRAM.ate)} />
      );
    case "escada": {
      const agua = sobe(t, P_L1.de, P_AGUA.ate);
      const luz = t < P_L2.de ? 1 : t < plano("lance3").de ? 0.78 : 0.68;
      return <Escada t={t} agua={agua * 0.78} luz={luz} />;
    }
    case "escritorio":
      return <Escritorio t={t} onda={0} silhueta={0} />;
    default: {
      const onda = sobe(t, P_ONDA.de, T_BATE);
      return <Submersa t={t} onda={t >= P_ONDA.de ? onda : 0} silhueta={sobe(t, P_SIL.de + 0.6, P_SIL.de + 1.6)}
        moldura={shot.id === "abre"} abre={sobe(t, P_ABRE.de + 0.6, P_ABRE.ate - 0.6)} />;
    }
  }
};

// A água da rua passa na frente dos pés de Lucas e Marina.
const frente = ({ t, shot }: Contexto) => (shot.fundo === "entrada" ? <AguaRua t={t} agua={aguaRua(t) * 0.6} /> : null);

const fx = ({ t, shot }: Contexto) => {
  const bate = decai(t, T_BATE, 0.7);
  const onda = shot.fundo === "orla" ? 0.5 : 0;
  const predio = t >= P_L2.de && t < P_L2.ate ? 0.4 + 0.3 * Math.abs(Math.sin(t * 5)) : 0;
  return { impacto: Math.max(bate, onda, predio), flash: bate * 0.6 };
};

const Final = ({ t }: { t: number }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT, color: "#e9eef0", opacity: interpolate(t, [PRETO + 1.0, PRETO + 1.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
    <div style={{ fontSize: 124, letterSpacing: 4 }}>A ÚLTIMA MARÉ</div>
    <div style={{ fontSize: 46, color: "#4fb3c8", marginTop: 18, letterSpacing: 6 }}>CONTINUA</div>
  </AbsoluteFill>
);

const S = "mare02/sfx/", S1 = "mare01/sfx/";

export const Mare02 = () => (
  <Episodio
    manifesto={manifesto} shots={SHOTS} blocos={BLOCOS} preto={PRETO} elenco={ELENCO} vinheta={0.55}
    cenario={cenario} frente={frente} fx={fx} final={(t) => <Final t={t} />}
    corLegenda={(p) => (p === "Narrador" ? "#fff3d6" : COLORS.white)}
    trilha={`${S}musica.mp3`}
    sons={
      <>
        <Som fps={FPS} em={0} src={`${S1}estrondo.mp3`} volume={0.8} dur={T_ORLA} some={0.6} />
        <Som fps={FPS} em={0.4} src={`${S}sirenes.mp3`} volume={0.7} />
        <Som fps={FPS} em={P_CORREM.de - 0.6} src={`${S}sirenes.mp3`} volume={0.7} dur={T_ORLA - P_CORREM.de + 0.6} some={0.5} />
        <Som fps={FPS} em={T_ORLA} src={`${S}impacto.mp3`} volume={1} />
        <Som fps={FPS} em={P_CARROS.de} src={`${S}vidros.mp3`} volume={0.8} />
        <Som fps={FPS} em={P_CARROS.de + 0.8} src={`${S}correnteza.mp3`} volume={0.6} dur={T_ESCADA - P_CARROS.de - 0.8} some={0.8} />
        <Som fps={FPS} em={T_OMBRO} src={`${S}porta.mp3`} volume={1} />
        <Som fps={FPS} em={T_ESCADA} src={`${S}escada.mp3`} volume={0.85} />
        <Som fps={FPS} em={P_L2.de} src={`${S}predio.mp3`} volume={0.8} />
        <Som fps={FPS} em={P_L2.de} src="ep01/sfx/luz.mp3" volume={0.5} />
        <Som fps={FPS} em={P_ABRE.de + 0.5} src={`${S}janela.mp3`} volume={0.8} />
        <Som fps={FPS} em={T_BATE - 0.2} src={`${S}escola.mp3`} volume={1} />
      </>
    }
  />
);

export const MARE02_DURACAO = Math.round(manifesto.duracao * FPS);
export const MARE02_FPS = FPS;
