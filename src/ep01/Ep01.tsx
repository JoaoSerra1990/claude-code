import { AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import manifesto from "./manifest.json";
import { WordCaptions, type Word } from "../components/WordCaptions";
import { COLORS, FONT } from "../theme";
import { Ator, type Expr, type PoseA, type Visual } from "./Ator";
import { Fachada, FALANTE, JANELA_ACESA, MUNDO_ALTURA, Patio, RELOGIO, Sala, VIDRO_PORTA } from "./cenarios";

const FPS = manifesto.fps;
const falas = manifesto.falas;
const [B1, B2, B3] = manifesto.batidas;
const PRETO = manifesto.preto;

type Nome = "Daniel" | "Marina" | "Pedro" | "Lívia" | "Rafael" | "Carlos";
const NOMES: Nome[] = ["Daniel", "Marina", "Pedro", "Lívia", "Rafael", "Carlos"];

const VISUAL: Record<Nome, Visual> = {
  Daniel: { pele: "#e9b48a", cabelo: "#2e211b", roupa: "#b9532a", detalhe: "#e8e4dc", calca: "#2a3147", estilo: "curto" },
  Marina: { pele: "#d9a074", cabelo: "#17110e", roupa: "#6a3fa3", calca: "#22252e", estilo: "rabo", oculos: true },
  Pedro: { pele: "#f0c19b", cabelo: "#6e4426", roupa: "#2f8a58", detalhe: "#d8d36a", calca: "#3a3f4d", estilo: "cacheado" },
  Lívia: { pele: "#f1cbb0", cabelo: "#4d2d1c", roupa: "#b85a7c", calca: "#2b2f3b", estilo: "longo" },
  Rafael: { pele: "#c99670", cabelo: "#1d3f73", roupa: "#2b63ad", detalhe: "#2a70c9", calca: "#30343f", estilo: "gorro" },
  Carlos: { pele: "#e2b08a", cabelo: "#9a9da4", roupa: "#cfd5de", calca: "#3b3f4a", estilo: "grisalho", oculos: true, gravata: true, barba: true },
};

// ---------- tempos das falas ----------
const F = Object.fromEntries(falas.map((f) => [f.n, f]));
const ini = (n: string) => F[n].inicio;
const fim = (n: string) => F[n].fim;
/** Momento em que começa a primeira palavra da fala `n` que inicia com `prefixo`. */
const pal = (n: string, prefixo: string) =>
  F[n].palavras.find((w) => w.text.toLowerCase().startsWith(prefixo))?.start ?? ini(n);

// ---------- marcação de cena ----------
type Est = {
  x: number; y: number; s: number;
  expr: Expr; pose: PoseA; olhar: [number, number];
  xPara?: number; yPara?: number; tremor?: boolean; oculto?: boolean;
};
type Bloco = Record<Nome, Est>;
const e = (x: number, y: number, s: number, expr: Expr = "medo", olhar: [number, number] = [0, 0], pose: PoseA = "parado"): Est =>
  ({ x, y, s, expr, pose, olhar });

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

type Cam = [number, number, number]; // centro x, centro y, zoom
type Luz = "normal" | "vermelha" | "ciano" | "pisca" | "noite";
type Shot = {
  id: string; de: number; ate: number;
  fundo: "sala" | "patio" | "fachada";
  cam: [Cam, Cam];
  luz?: Luz; tremor?: number; bloco?: keyof typeof BLOCOS; mesa?: boolean;
  at?: Partial<Record<Nome, Partial<Est>>>;
};

const T1 = pal("01", "ele");
const A1 = ini("01") + (T1 - ini("01")) * 0.55;
const [FX, FY] = FALANTE;
const rosto = (b: Bloco, n: Nome): [number, number] => [b[n].x, b[n].y - 690 * b[n].s];
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
  { id: "atravessa_piso", de: B2 + 0.3, ate: B3 - 0.2, fundo: "sala", bloco: "cerco",
    cam: [[560, 1770, 2.0], [540, 2330, 1.5]],
    at: { Daniel: { x: 470, expr: "panico", pose: "recuar", olhar: [0.4, 1] }, Marina: { x: 830, expr: "panico", pose: "recuar", olhar: [-0.6, 1] } } },
  { id: "subsolo", de: B3 - 0.2, ate: PRETO, fundo: "sala", bloco: "cerco",
    cam: [[540, 2330, 1.5], [540, 2250, 1.8]],
    at: { Daniel: { x: 470, expr: "panico", pose: "recuar" }, Marina: { x: 830, expr: "panico", pose: "recuar" } } },
];

// ---------- legendas ----------
const corDoPersonagem = (p: string) => (p === "Helena" ? "#7ef0ff" : p === "Narrador" ? "#ffe9a8" : COLORS.white);
const palavras: Word[] = falas.flatMap((f) => f.palavras.map((w) => ({ ...w, color: corDoPersonagem(f.p) })));

const decai = (t: number, em: number, dur: number) => (t >= em && t < em + dur ? 1 - (t - em) / dur : 0);
const suave = Easing.inOut(Easing.cubic);

const Som = ({ em, src, volume = 1, loop = false }: { em: number; src: string; volume?: number; loop?: boolean }) => (
  <Sequence from={Math.max(0, Math.round(em * FPS))}>
    <Audio src={staticFile(`ep01/sfx/${src}.mp3`)} volume={volume} loop={loop} />
  </Sequence>
);

export const Ep01 = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const escuro = t >= PRETO;
  const shot = SHOTS.find((s) => t >= s.de && t < s.ate) ?? SHOTS[SHOTS.length - 1];
  const p = suave(Math.min(1, Math.max(0, (t - shot.de) / (shot.ate - shot.de))));
  const lerp = (a: number, b: number) => a + (b - a) * p;

  // quem está falando agora (a boca só abre durante as palavras)
  const fala = falas.find((f) => t >= f.inicio && t < f.fim);
  const emPalavra = !!fala?.palavras.some((w) => t >= w.start - 0.03 && t < w.end + 0.05);
  const helena = fala?.p === "Helena";

  // eventos
  const batida = Math.max(decai(t, B1, 0.45), decai(t, B2, 0.45));
  const soco = decai(t, B3, 0.5);
  const rachadura = t < B1 ? 0 : t < B2 ? 0.45 : 1;
  const tVulto = SHOTS.find((s) => s.id === "vulto")!;
  const fimVulto = fim("07") + 0.3;
  const vulto = t >= tVulto.de && t < fimVulto ? (t - tVulto.de) / (fimVulto - tVulto.de) : null;
  const portaTreme = decai(t, tVulto.de + 0.15, 0.6);
  const tRelogio = SHOTS.find((s) => s.id === "relogio")!;

  // câmera
  const z = lerp(shot.cam[0][2], shot.cam[1][2]);
  const impacto = Math.max(batida, soco, portaTreme) * 16;
  const forca = (shot.tremor ?? 0) + impacto;
  // O subsolo só entra em quadro quando a câmera atravessa o piso.
  const abaixo = shot.id === "atravessa_piso" || shot.id === "subsolo";
  const altura = shot.fundo !== "sala" ? 1920 : abaixo ? MUNDO_ALTURA : 2050;
  const limita = (v: number, meio: number, max: number) => Math.min(max - meio, Math.max(meio, v));
  const cx = limita(lerp(shot.cam[0][0], shot.cam[1][0]), 540 / z, 1080) + Math.sin(t * 47) * forca * 0.5 + Math.sin(t * 0.9) * 3;
  const cy = limita(lerp(shot.cam[0][1], shot.cam[1][1]), 960 / z, altura) + Math.cos(t * 53) * forca * 0.5 + Math.sin(t * 0.7) * 3;
  const viewBox = `${cx - 540 / z} ${cy - 960 / z} ${1080 / z} ${1920 / z}`;

  // luz
  const luzTipo: Luz = abaixo ? "noite" : shot.luz ?? "normal";
  const apagao = luzTipo === "pisca" ? (Math.sin(t * 23) * Math.sin(t * 7.3) > 0.1 ? 0.15 : 0.9) : 1;
  const nivelLuz = luzTipo === "vermelha" ? 0.1 : luzTipo === "ciano" ? 0.35 : 0.8 * apagao;
  const tinta: Record<Luz, string> = {
    normal: "rgba(8,14,34,0.34)",
    vermelha: `rgba(150,10,14,${0.36 + 0.2 * Math.sin(t * 9) ** 2})`,
    ciano: "rgba(10,70,96,0.36)",
    pisca: `rgba(4,6,14,${apagao < 0.5 ? 0.7 : 0.3})`,
    noite: "rgba(6,10,30,0.2)",
  };

  // atores do plano atual
  const bloco = shot.bloco ? BLOCOS[shot.bloco] : null;
  const atores = bloco
    ? NOMES.map((nome, i) => {
        const est = { ...bloco[nome], ...(shot.at?.[nome] ?? {}) };
        const x = est.xPara !== undefined ? lerp(est.x, est.xPara) : est.x;
        const y = est.yPara !== undefined ? lerp(est.y, est.yPara) : est.y;
        const andando = (est.xPara !== undefined || est.yPara !== undefined) && p > 0.02 && p < 0.98;
        return { nome, est, x, y, andando, i };
      }).sort((a, b) => a.y - b.y)
    : [];

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {!escuro && (
        <>
          <svg width={1080} height={1920} viewBox={viewBox} preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
            {shot.fundo === "patio" && <Patio t={t} />}
            {shot.fundo === "fachada" && <Fachada t={t} />}
            {shot.fundo === "sala" && (
              <Sala t={t} luz={nivelLuz} falante={helena || shot.id === "falante_volta"} vulto={vulto}
                portaTreme={portaTreme} mesa={!!shot.mesa} batida={batida} rachadura={rachadura} soco={soco} />
            )}
            {atores.map(({ nome, est, x, y, andando, i }) =>
              est.oculto ? null : (
                <g key={nome} transform={`translate(${x} ${y}) scale(${est.s})`}>
                  <ellipse cx={0} cy={0} rx={120} ry={22} fill="#000" opacity={0.35} />
                  <Ator v={VISUAL[nome]} t={t} expr={est.expr} pose={est.pose} olhar={est.olhar}
                    falando={fala?.p === nome && emPalavra} andando={andando} tremor={est.tremor} fase={i * 1.9} />
                </g>
              ),
            )}
          </svg>
          <AbsoluteFill style={{ background: tinta[luzTipo], mixBlendMode: "multiply" }} />
          {(luzTipo === "vermelha" || luzTipo === "ciano") && (
            <AbsoluteFill style={{ background: luzTipo === "vermelha" ? "rgba(255,40,40,0.10)" : "rgba(80,230,255,0.08)" }} />
          )}
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.72) 100%)" }} />
          {t >= tRelogio.de && t < tRelogio.ate && (
            <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontSize: 190, color: COLORS.red, textShadow: `0 0 34px ${COLORS.red}` }}>
              03:17
            </div>
          )}
          {(batida > 0 || soco > 0) && <AbsoluteFill style={{ background: "#fff", opacity: Math.max(batida, soco) * 0.22 }} />}
        </>
      )}

      {escuro && t > PRETO + 0.5 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT, color: "#e9e9ea", opacity: interpolate(t, [PRETO + 0.5, PRETO + 1.0], [0, 1], { extrapolateRight: "clamp" }) }}>
          <div style={{ fontSize: 120, letterSpacing: 4 }}>O ÚLTIMO SINAL</div>
          <div style={{ fontSize: 46, color: COLORS.red, marginTop: 18, letterSpacing: 6 }}>CONTINUA</div>
        </AbsoluteFill>
      )}

      {!escuro && <WordCaptions words={palavras} perLine={3} y={0.69} size={86} />}

      {/* falas */}
      {falas.map((f) => (
        <Sequence key={f.n} from={Math.round(f.inicio * FPS)}>
          <Audio src={staticFile(f.arquivo)} volume={1} />
        </Sequence>
      ))}
      {/* trilha e efeitos */}
      <Sequence durationInFrames={Math.round(PRETO * FPS)}>
        <Audio src={staticFile("ep01/sfx/drone.mp3")} volume={0.28} loop />
      </Sequence>
      <Som em={0} src="sino" volume={0.45} />
      {falas.filter((f) => f.p === "Helena").map((f) => <Som key={f.n} em={f.inicio - 0.25} src="estatica" volume={0.35} />)}
      <Sequence from={Math.round((ini("02") - 0.45) * FPS)} durationInFrames={Math.round((fim("02") + 0.95 - ini("02")) * FPS)}>
        <Audio src={staticFile("ep01/sfx/zumbis.mp3")} volume={0.5} />
      </Sequence>
      <Som em={tVulto.de + 0.15} src="porta" volume={0.9} />
      <Som em={tRelogio.de} src="luz" volume={0.5} />
      <Som em={tRelogio.de + 0.1} src="sino" volume={0.5} />
      <Som em={B1} src="batida" volume={1} />
      <Som em={B2} src="batida" volume={1} />
      <Som em={B3} src="batida" volume={1} />
      <Som em={PRETO} src="impacto" volume={0.8} />
    </AbsoluteFill>
  );
};

export const EP01_DURACAO = Math.round(manifesto.duracao * FPS);
export const EP01_FPS = FPS;
