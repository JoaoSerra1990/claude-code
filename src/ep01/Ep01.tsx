import { AbsoluteFill, interpolate } from "remotion";
import manifestoJson from "./manifest.json";
import { COLORS, FONT } from "../theme";
import { FALANTE, JANELA_ACESA, RELOGIO, VIDRO_PORTA } from "../serie/cenarios";
import {
  Episodio, Som, decai, est as e, rosto, tempos,
  type Bloco, type Contexto, type Manifesto, type Shot,
} from "../serie/motor";

const manifesto = manifestoJson as Manifesto;
const FPS = manifesto.fps;
const falas = manifesto.falas;
const [B1, B2, B3] = manifestoJson.batidas;
const PRETO = manifestoJson.preto;
const { ini, fim, pal } = tempos(manifesto);

// ---------- marcação de cena ----------
const BLOCOS: Record<string, Bloco> = {
  // Abertura: Carlos em cima da carteira, tentando arrancar o alto-falante.
  abertura: {
    Carlos: e(800, 1130, 0.8, "panico", [0, -1], "alcancar"),
    Daniel: e(300, 1700, 0.72, "medo", [1, -0.8]),
    Marina: e(470, 1650, 0.7, "medo", [1, -0.8]),
    Lívia: e(620, 1750, 0.7, "medo", [0.8, -0.8], "abracar"),
    Pedro: e(130, 1590, 0.68, "surpreso", [1, -0.6]),
    Rafael: e(970, 1680, 0.62, "medo", [-0.6, -1]),
  },
  comida: {
    Pedro: e(360, 1560, 0.68, "triste", [-1, 0.6], "apontarEsq"),
    Marina: e(570, 1640, 0.7, "firme", [-1, 0]),
    Daniel: e(780, 1710, 0.72, "desconfiado", [0.3, -0.6]),
    Lívia: e(940, 1640, 0.68, "triste", [-0.4, 0.6], "abracar"),
    Rafael: e(150, 1770, 0.62, "triste", [0.5, -0.4]),
    Carlos: e(545, 1400, 0.7, "firme", [0, 0.2], "empurrar"),
  },
  porta: {
    Carlos: e(700, 1440, 0.76, "firme", [-0.8, 0.3], "empurrar"),
    Daniel: e(300, 1700, 0.72, "bravo", [1, -0.5]),
    Marina: e(160, 1640, 0.7, "desconfiado", [1, -0.3]),
    Pedro: e(60, 1760, 0.68, "medo", [1, -0.3]),
    Lívia: e(930, 1730, 0.7, "medo", [-0.8, -0.2], "abracar"),
    Rafael: e(800, 1600, 0.62, "medo", [-1, -0.4]),
  },
  sinal: {
    Pedro: e(130, 1590, 0.68, "medo", [0.8, -0.8]),
    Daniel: e(320, 1700, 0.72, "desconfiado", [0.8, -0.6]),
    Marina: e(500, 1650, 0.7, "medo", [0.8, -0.8]),
    Lívia: e(660, 1760, 0.7, "medo", [0.4, -1], "abracar"),
    Rafael: e(800, 1600, 0.62, "medo", [0, -1]),
    Carlos: e(940, 1540, 0.8, "medo", [-0.5, -0.8]),
  },
  cerco: {
    Carlos: e(930, 1520, 0.8, "medo", [-0.8, 0.3], "recuar"),
    Daniel: e(570, 1690, 0.72, "bravo", [1, -0.5]),
    Marina: e(720, 1740, 0.7, "desconfiado", [1, -0.5]),
    Pedro: e(390, 1650, 0.68, "medo", [1, -0.4]),
    Rafael: e(250, 1610, 0.62, "medo", [1, -0.3]),
    Lívia: e(120, 1730, 0.7, "medo", [1, -0.3], "abracar"),
  },
};

const T1 = pal("01", "ele");
const A1 = ini("01") + (T1 - ini("01")) * 0.55;
const [FX, FY] = FALANTE;
const S = BLOCOS.sinal, C = BLOCOS.cerco;

const SHOTS: Shot[] = [
  // 1. Gancho: Carlos tenta arrancar o alto-falante enquanto Helena o acusa.
  { id: "falante", de: 0, ate: A1, fundo: "sala", bloco: "abertura", mesa: true, luz: "vermelha", tremor: 7,
    cam: [[800, 640, 1.75], [800, 600, 2.05]] },
  { id: "rostos", de: A1, ate: T1, fundo: "sala", bloco: "abertura", mesa: true, luz: "vermelha", tremor: 3,
    cam: [[290, 1195, 2.3], [600, 1225, 2.3]] },
  { id: "carlos_vira", de: T1, ate: ini("02") - 0.45, fundo: "sala", bloco: "abertura", mesa: true, luz: "vermelha", tremor: 2,
    cam: [[800, 640, 2.2], [800, 610, 2.7]],
    at: { Carlos: { expr: "congelado", pose: "recuar", olhar: [-0.9, 0.8], tremor: true } } },

  // 2. Narrador: o lado de fora.
  { id: "patio", de: ini("02") - 0.45, ate: pal("02", "e,") - 0.2, fundo: "patio", luz: "noite",
    cam: [[540, 760, 1.0], [540, 1090, 1.55]] },
  { id: "fachada", de: pal("02", "e,") - 0.2, ate: fim("02") + 0.5, fundo: "fachada", luz: "noite",
    cam: [[540, 1040, 1.0], [JANELA_ACESA[0], JANELA_ACESA[1] + 30, 2.3]] },

  // 3. A comida acabando.
  { id: "pedro", de: fim("02") + 0.5, ate: fim("03") + 0.3, fundo: "sala", bloco: "comida",
    cam: [[230, 1160, 2.0], [250, 1140, 2.2]] },
  { id: "marina", de: fim("03") + 0.3, ate: fim("04") + 0.3, fundo: "sala", bloco: "comida",
    cam: [[470, 1140, 1.9], [520, 1150, 2.2]], at: { Pedro: { expr: "medo", olhar: [1, 0], pose: "parado" } } },

  // 4. A porta.
  { id: "carlos_porta", de: fim("04") + 0.3, ate: fim("05") + 0.25, fundo: "sala", bloco: "porta",
    cam: [[600, 1010, 1.6], [620, 1000, 1.85]], at: { Carlos: { xPara: 640 } } },
  { id: "daniel_confronta", de: fim("05") + 0.25, ate: fim("06") + 0.25, fundo: "sala", bloco: "porta",
    cam: [[340, 1220, 1.9], [500, 1190, 2.05]],
    at: { Daniel: { xPara: 470, pose: "apontarDir" }, Carlos: { x: 640, pose: "parado", expr: "triste", olhar: [-1, 0.4] } } },
  { id: "vulto", de: fim("06") + 0.25, ate: ini("07") - 0.1, fundo: "sala", bloco: "porta", tremor: 5,
    cam: [[VIDRO_PORTA[0], VIDRO_PORTA[1] + 40, 2.6], [VIDRO_PORTA[0], VIDRO_PORTA[1], 3.1]],
    at: { Carlos: { x: 760, expr: "medo", pose: "recuar", olhar: [-1, -0.2] }, Daniel: { x: 300, expr: "medo", pose: "parado" } } },
  { id: "rafael_sussurra", de: ini("07") - 0.1, ate: fim("07") + 0.3, fundo: "sala", bloco: "porta",
    cam: [[720, 1160, 2.3], [700, 1150, 2.5]],
    at: { Carlos: { x: 960, expr: "medo", pose: "recuar", olhar: [-1, -0.2] }, Daniel: { x: 300, expr: "medo", pose: "parado" }, Rafael: { pose: "apontarEsq", tremor: true } } },

  // 5. 3h17: o sinal toca sem energia.
  { id: "relogio", de: fim("07") + 0.3, ate: ini("08") - 0.25, fundo: "sala", bloco: "sinal", luz: "pisca", tremor: 3,
    cam: [[RELOGIO[0], RELOGIO[1], 3.0], [RELOGIO[0], RELOGIO[1], 4.0]] },
  { id: "livia", de: ini("08") - 0.25, ate: fim("08") + 0.25, fundo: "sala", bloco: "sinal", luz: "pisca",
    cam: [[rosto(S, "Lívia")[0], rosto(S, "Lívia")[1] + 20, 2.4], [rosto(S, "Lívia")[0], rosto(S, "Lívia")[1], 2.7]] },
  { id: "rafael_falante", de: fim("08") + 0.25, ate: fim("09") + 0.3, fundo: "sala", bloco: "sinal",
    cam: [[800, 860, 1.5], [800, 820, 1.7]], at: { Rafael: { pose: "apontarCima", expr: "desconfiado" } } },
  { id: "helena_chama", de: fim("09") + 0.3, ate: pal("10", "se") - 0.1, fundo: "sala", bloco: "sinal", luz: "ciano", tremor: 4,
    cam: [[FX, FY, 2.6], [FX, FY, 3.1]] },
  { id: "daniel_ouve", de: pal("10", "se") - 0.1, ate: pal("10", "não") - 0.1, fundo: "sala", bloco: "sinal", luz: "ciano",
    cam: [[rosto(S, "Daniel")[0], rosto(S, "Daniel")[1], 2.8], [rosto(S, "Daniel")[0], rosto(S, "Daniel")[1], 3.2]],
    at: { Daniel: { expr: "surpreso", olhar: [0.6, -1] } } },
  { id: "olhar_para_carlos", de: pal("10", "não") - 0.1, ate: fim("10") + 0.35, fundo: "sala", bloco: "sinal", luz: "ciano",
    cam: [[340, 1200, 2.1], [860, 1010, 2.3]],
    at: { Daniel: { expr: "desconfiado", olhar: [1, -0.3] }, Carlos: { expr: "congelado", olhar: [-1, 0.3] } } },

  // 6. Confronto.
  { id: "daniel_avanca", de: fim("10") + 0.35, ate: fim("11") + 0.25, fundo: "sala", bloco: "sinal",
    cam: [[560, 1160, 1.5], [700, 1130, 1.75]],
    at: { Daniel: { xPara: 580, yPara: 1680, expr: "bravo", pose: "apontarDir", olhar: [1, -0.4] }, Carlos: { xPara: 975, pose: "recuar", olhar: [-1, 0.3] } } },
  { id: "carlos_grita", de: fim("11") + 0.25, ate: fim("12") + 0.25, fundo: "sala", bloco: "cerco", tremor: 9,
    cam: [[900, 970, 2.9], [900, 965, 3.2]], at: { Carlos: { expr: "panico", tremor: true, olhar: [-0.7, 0.3] } } },
  { id: "marina_pressiona", de: fim("12") + 0.25, ate: fim("13") + 0.25, fundo: "sala", bloco: "cerco",
    cam: [[690, 1260, 2.3], [720, 1255, 2.6]], at: { Marina: { x: 640, xPara: 720, pose: "apontarDir" } } },
  { id: "cerco", de: fim("13") + 0.25, ate: fim("14") + 0.3, fundo: "sala", bloco: "cerco",
    cam: [[640, 1260, 1.3], [730, 1190, 1.6]], at: { Carlos: { expr: "triste", tremor: true } } },

  // 7. Cliffhanger.
  { id: "falante_volta", de: fim("14") + 0.3, ate: ini("15") + 1.0, fundo: "sala", bloco: "cerco", luz: "ciano", tremor: 4,
    cam: [[FX, FY, 2.4], [FX, FY, 2.9]] },
  { id: "carlos_paralisa", de: ini("15") + 1.0, ate: fim("15") + 0.3, fundo: "sala", bloco: "cerco", luz: "ciano",
    cam: [[900, 975, 2.6], [900, 965, 3.4]], at: { Carlos: { expr: "congelado", pose: "parado", olhar: [0, 0], tremor: true } } },
  { id: "daniel_pergunta", de: fim("15") + 0.3, ate: fim("16") + 0.25, fundo: "sala", bloco: "cerco",
    cam: [[590, 1200, 2.5], [590, 1195, 2.7]], at: { Daniel: { expr: "surpreso", pose: "parado", olhar: [0.6, -1] } } },
  { id: "camera_desce", de: fim("16") + 0.25, ate: B1 - 0.15, fundo: "sala", bloco: "cerco", luz: "ciano",
    cam: [[620, 1240, 1.6], [560, 1780, 2.0]],
    at: { Carlos: { expr: "congelado", pose: "parado" }, Daniel: { expr: "medo", pose: "parado", olhar: [0, 1] }, Marina: { expr: "medo", olhar: [0, 1] } } },
  { id: "batidas", de: B1 - 0.15, ate: B2 + 0.3, fundo: "sala", bloco: "cerco", tremor: 3,
    cam: [[560, 1780, 2.0], [560, 1770, 2.15]],
    at: { Daniel: { xPara: 470, expr: "panico", pose: "recuar", olhar: [0.4, 1] }, Marina: { xPara: 830, expr: "panico", pose: "recuar", olhar: [-0.6, 1] }, Carlos: { expr: "congelado", pose: "parado" } } },
  { id: "atravessa_piso", de: B2 + 0.3, ate: B3 - 0.2, fundo: "sala", bloco: "cerco", subsolo: true, luz: "noite",
    cam: [[560, 1770, 2.0], [540, 2330, 1.5]],
    at: { Daniel: { x: 470, expr: "panico", pose: "recuar", olhar: [0.4, 1] }, Marina: { x: 830, expr: "panico", pose: "recuar", olhar: [-0.6, 1] } } },
  { id: "subsolo", de: B3 - 0.2, ate: PRETO, fundo: "sala", bloco: "cerco", subsolo: true, luz: "noite",
    cam: [[540, 2330, 1.5], [540, 2250, 1.8]],
    at: { Daniel: { x: 470, expr: "panico", pose: "recuar" }, Marina: { x: 830, expr: "panico", pose: "recuar" } } },
];

const plano = (id: string) => SHOTS.find((s) => s.id === id)!;
const VULTO = plano("vulto");
const FIM_VULTO = fim("07") + 0.3;
const RELOGIO_SHOT = plano("relogio");

const fx = ({ t, shot, fala }: Contexto) => {
  const batida = Math.max(decai(t, B1, 0.45), decai(t, B2, 0.45));
  const soco = decai(t, B3, 0.5);
  const portaTreme = decai(t, VULTO.de + 0.15, 0.6);
  return {
    sala: {
      falante: fala?.p === "Helena" || shot.id === "falante_volta",
      vulto: t >= VULTO.de && t < FIM_VULTO ? (t - VULTO.de) / (FIM_VULTO - VULTO.de) : null,
      portaTreme, batida, soco,
      rachadura: t < B1 ? 0 : t < B2 ? 0.45 : 1,
    },
    impacto: Math.max(batida, soco, portaTreme),
    flash: Math.max(batida, soco),
  };
};

const sobre = ({ t }: Contexto) =>
  t >= RELOGIO_SHOT.de && t < RELOGIO_SHOT.ate ? (
    <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontSize: 190, color: COLORS.red, textShadow: `0 0 34px ${COLORS.red}` }}>
      03:17
    </div>
  ) : null;

export const Titulo = ({ t, de }: { t: number; de: number }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT, color: "#e9e9ea", opacity: interpolate(t, [de, de + 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
    <div style={{ fontSize: 120, letterSpacing: 4 }}>O ÚLTIMO SINAL</div>
    <div style={{ fontSize: 46, color: COLORS.red, marginTop: 18, letterSpacing: 6 }}>CONTINUA</div>
  </AbsoluteFill>
);

export const corLegenda = (p: string) =>
  p === "Helena" ? "#7ef0ff" : p === "Narrador" ? "#ffe9a8" : p === "Desconhecida" ? "#b8bcc4" : COLORS.white;

const SFX = "ep01/sfx/";

export const Ep01 = () => (
  <Episodio
    manifesto={manifesto} shots={SHOTS} blocos={BLOCOS} preto={PRETO}
    fx={fx} sobre={sobre} corLegenda={corLegenda} trilha={`${SFX}drone.mp3`}
    final={(t) => <Titulo t={t} de={PRETO + 0.5} />}
    sons={
      <>
        <Som fps={FPS} em={0} src={`${SFX}sino.mp3`} volume={0.45} />
        {falas.filter((f) => f.p === "Helena").map((f) => (
          <Som key={f.n} fps={FPS} em={f.inicio - 0.25} src={`${SFX}estatica.mp3`} volume={0.35} />
        ))}
        <Som fps={FPS} em={ini("02") - 0.45} src={`${SFX}zumbis.mp3`} volume={0.5} dur={fim("02") + 0.95 - ini("02")} />
        <Som fps={FPS} em={VULTO.de + 0.15} src={`${SFX}porta.mp3`} volume={0.9} />
        <Som fps={FPS} em={RELOGIO_SHOT.de} src={`${SFX}luz.mp3`} volume={0.5} />
        <Som fps={FPS} em={RELOGIO_SHOT.de + 0.1} src={`${SFX}sino.mp3`} volume={0.5} />
        {[B1, B2, B3].map((b) => <Som key={b} fps={FPS} em={b} src={`${SFX}batida.mp3`} />)}
        <Som fps={FPS} em={PRETO} src={`${SFX}impacto.mp3`} volume={0.8} />
      </>
    }
  />
);

export const EP01_DURACAO = Math.round(manifesto.duracao * FPS);
export const EP01_FPS = FPS;
