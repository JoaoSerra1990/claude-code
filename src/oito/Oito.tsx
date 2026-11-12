import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import manifestoJson from "./manifest.json";
import { FONT } from "../theme";
import { Ator, type Visual } from "../serie/Ator";
import {
  Episodio, Som, decai, est as e, sobe, tempos,
  type Bloco, type Contexto, type Manifesto, type Shot,
} from "../serie/motor";
import { cidadao } from "../curtas/futurista";
import { Cama, Escotilha, Exterior, FimVagao, Hospital, Reportagem, Vagao } from "./cenarios";

// Os Últimos Oito Minutos — curta narrado.

const manifesto = manifestoJson as Manifesto;
const FPS = manifesto.fps;
const PRETO = manifestoJson.preto;
const { fim, pal } = tempos(manifesto);

const MIGUEL: Visual = { pele: "#e2b08a", cabelo: "#2e211b", roupa: "#3d5a80", detalhe: "#e8e4dc", calca: "#2a2f3a", estilo: "curto" };
const MULHER: Visual = { pele: "#c68a5e", cabelo: "#17110e", roupa: "#e9b730", casaco: true, calca: "#262a35", estilo: "coque" };
const TECNICO: Visual = { pele: "#edc09c", cabelo: "#56636e", detalhe: "#e0572a", roupa: "#6b7680", calca: "#6b7680", estilo: "gorro", barbaCor: "#4a3a2e" };
const ELENCO: Record<string, Visual> = {
  Miguel: MIGUEL, Mulher: MULHER, Tecnico: TECNICO,
  Paciente: { ...MIGUEL, roupa: "#bfe0e8", detalhe: undefined },
};

const BLOCOS: Record<string, Bloco> = {
  banco: { Miguel: e(540, 1760, 0.72, "panico", [0, 0]) },
  ninguem: { Miguel: e(540, 1800, 0.66, "panico", [-0.8, 0], "alcancar") },
  cabine: { Miguel: e(540, 1810, 0.7, "bravo", [0, -0.3], "empurrar") },
  nota: { Mulher: e(640, 1790, 0.6, "sereno", [1, 0]), Miguel: e(230, 1830, 0.78, "desconfiado", [1, 0]) },
  segue: { Mulher: e(760, 1790, 0.6, "sereno", [1, 0]), Miguel: e(300, 1800, 0.62, "desconfiado", [1, 0]) },
  dois: { Miguel: e(320, 1800, 0.72, "surpreso", [1, 0]), Mulher: e(760, 1800, 0.72, "firme", [-1, 0]) },
  tecnico: { Tecnico: e(540, 1800, 0.72, "desconfiado", [-0.8, -0.4], "apontarCima") },
  corre: { Tecnico: e(700, 1790, 0.6, "medo", [1, 0]), Miguel: e(300, 1800, 0.62, "bravo", [1, 0]) },
  luta: { Miguel: e(360, 1800, 0.75, "bravo", [1, 0], "apontarDir"), Tecnico: e(760, 1800, 0.75, "panico", [-1, 0], "apontarEsq") },
  lanca: { Miguel: e(300, 1800, 0.72, "bravo", [1, -0.5], "apontarDir") },
  alivio: { Miguel: e(540, 1800, 0.7, "sereno", [0, 0]) },
  hosp: { Paciente: e(460, 1790, 0.7, "sereno", [0, 0]), Mulher: e(820, 1790, 0.6, "feliz", [-1, 0]) },
};
const R_BANCO: [number, number] = [540, 1760 - 497];
const R_HOSP: [number, number] = [460, 1790 - 483];
const R_MULHER: [number, number] = [760, 1800 - 497];
const R_MIG2: [number, number] = [320, 1800 - 497];

const T_BOOM1 = pal("01", "explodiu") - 0.1;
const T_ACORDA = pal("01", "nove") - 0.7;
const T_BOOM2 = pal("02", "explosão") - 0.1;
const T_BOOM3 = pal("06", "explosão") - 0.2;
const T_SIM = pal("03", "numa") - 0.8;
const T_VIRA = fim("07") - 0.3;

const SHOTS: Shot[] = [
  // 00–12 s | Oito minutos (gancho: a explosão em silhueta)
  { id: "explosao", de: 0, ate: T_ACORDA, fundo: "ext", luz: "normal", tremor: 4,
    cam: [[540, 1000, 1.25], [540, 960, 1.0]] },
  { id: "acorda", de: T_ACORDA, ate: pal("01", "era") - 0.1, fundo: "vagao", bloco: "banco", luz: "dia",
    cam: [[R_BANCO[0], R_BANCO[1], 3.0], [R_BANCO[0], R_BANCO[1] - 200, 1.5]] },
  { id: "quarta", de: pal("01", "era") - 0.1, ate: pal("01", "ninguém") - 0.3, fundo: "vagao", bloco: "banco", luz: "dia",
    cam: [[R_BANCO[0], R_BANCO[1], 2.4], [R_BANCO[0], R_BANCO[1], 2.9]], at: { Miguel: { expr: "congelado" } } },
  { id: "ninguem", de: pal("01", "ninguém") - 0.3, ate: fim("01") + 0.4, fundo: "vagao", bloco: "ninguem", luz: "dia",
    cam: [[540, 1350, 1.3], [300, 1420, 1.7]], at: { Miguel: { x: 540, xPara: 420 } } },

  // 12–25 s | O aviso
  { id: "maquinista", de: fim("01") + 0.4, ate: pal("02", "puxou") - 0.3, fundo: "cabine", bloco: "cabine", luz: "dia", tremor: 4,
    cam: [[480, 1350, 1.2], [540, 1150, 1.8]], at: { Miguel: { x: -250, xPara: 540, expr: "panico" } } },
  { id: "freio", de: pal("02", "puxou") - 0.3, ate: pal("02", "em") - 0.2, fundo: "cabine", bloco: "cabine", luz: "dia", tremor: 9,
    cam: [[820, 1150, 1.9], [900, 1050, 2.6]], at: { Miguel: { x: 700, pose: "apontarDir", olhar: [1, -0.4] } } },
  { id: "tentativas", de: pal("02", "em") - 0.2, ate: T_BOOM2 - 0.2, fundo: "vagao", bloco: "ninguem", luz: "pisca", tremor: 6,
    cam: [[540, 1300, 1.5], [540, 1320, 2.1]] },
  { id: "explosao2", de: T_BOOM2 - 0.2, ate: pal("02", "até") - 0.2, fundo: "ext", luz: "normal", tremor: 6,
    cam: [[540, 1000, 1.1], [540, 1000, 1.3]] },
  { id: "mulher", de: pal("02", "até") - 0.2, ate: fim("02") + 0.3, fundo: "vagao", bloco: "nota", luz: "dia",
    cam: [[430, 1340, 1.5], [760, 1340, 1.8]], at: { Mulher: { xPara: 1220 }, Miguel: { expr: "surpreso" } } },

  // 25–38 s | A suspeita
  { id: "segue", de: fim("02") + 0.3, ate: pal("03", "ela") - 0.2, fundo: "passagem", bloco: "segue", luz: "dia", tremor: 5,
    cam: [[540, 1300, 1.2], [600, 1300, 1.4]], at: { Mulher: { x: 440, xPara: 560, sPara: 0.5, yPara: 1740 }, Miguel: { x: -200, xPara: 300 } } },
  { id: "nome", de: pal("03", "ela") - 0.2, ate: pal("03", "disse") - 0.3, fundo: "vagao2", bloco: "dois", luz: "dia",
    cam: [[R_MULHER[0], R_MULHER[1], 2.5], [R_MULHER[0], R_MULHER[1], 2.9]], at: { Mulher: { expr: "sereno" } } },
  { id: "preso", de: pal("03", "disse") - 0.3, ate: T_SIM, fundo: "vagao2", bloco: "dois", luz: "dia",
    cam: [[540, 1350, 1.5], [R_MIG2[0] + 60, R_MIG2[1], 2.3]], at: { Mulher: { pose: "apontarEsq" } } },
  { id: "simulacao", de: T_SIM, ate: fim("03") + 0.4, fundo: "vagao2", bloco: "dois", luz: "ciano",
    cam: [[540, 1300, 1.5], [540, 1250, 1.1]], at: { Miguel: { expr: "congelado", olhar: [0, -0.8] }, Mulher: { pose: "apontarCima" } } },

  // 38–52 s | O culpado
  { id: "investigadora", de: fim("03") + 0.4, ate: pal("04", "verdadeiro") - 0.3, fundo: "vagao2", bloco: "dois", luz: "dia",
    cam: [[R_MULHER[0], R_MULHER[1] + 60, 2.0], [R_MULHER[0], R_MULHER[1] + 60, 2.2]] },
  { id: "tecnico", de: pal("04", "verdadeiro") - 0.3, ate: pal("04", "fingia") - 0.2, fundo: "ar", bloco: "tecnico", luz: "dia",
    cam: [[540, 1100, 1.1], [540, 1250, 1.9]] },
  { id: "fingia", de: pal("04", "fingia") - 0.2, ate: pal("04", "miguel") - 0.2, fundo: "ar", bloco: "tecnico", luz: "dia",
    cam: [[540, 700, 1.9], [600, 1560, 2.2]], at: { Tecnico: { olhar: [0.9, 0.4] } } },
  { id: "detonador", de: pal("04", "miguel") - 0.2, ate: fim("04") + 0.4, fundo: "ar", bloco: "tecnico", luz: "dia",
    cam: [[660, 1650, 2.6], [660, 1650, 2.8]] },

  // 52–65 s | A escolha
  { id: "dois", de: fim("04") + 0.4, ate: pal("05", "investigadora") - 0.5, fundo: "vagao2", bloco: "dois", luz: "dia", tremor: 3,
    cam: [[540, 1300, 1.3], [540, 1300, 1.4]], at: { Miguel: { expr: "medo" } } },
  { id: "aviso", de: pal("05", "investigadora") - 0.5, ate: pal("05", "mesmo") - 0.2, fundo: "vagao2", bloco: "dois", luz: "dia", tremor: 3,
    cam: [[R_MULHER[0] - 60, R_MULHER[1], 2.1], [R_MIG2[0] + 40, R_MIG2[1] - 60, 2.0]],
    at: { Mulher: { pose: "apontarEsq", expr: "medo" }, Miguel: { expr: "medo", holo: "MEMÓRIA", holoCor: "#ff5a4a" } } },
  { id: "decide", de: pal("05", "mesmo") - 0.2, ate: pal("05", "correu") - 0.2, fundo: "vagao2", bloco: "dois", luz: "dia",
    cam: [[R_MIG2[0], R_MIG2[1], 2.6], [R_MIG2[0], R_MIG2[1], 3.1]], at: { Miguel: { expr: "bravo", olhar: [-1, 0] } } },
  { id: "corre", de: pal("05", "correu") - 0.2, ate: fim("05") + 0.4, fundo: "vagao", bloco: "corre", luz: "pisca", tremor: 8,
    cam: [[440, 1560, 1.5], [640, 1560, 1.6]], at: { Tecnico: { xPara: 1300 }, Miguel: { x: -200, xPara: 620 } } },

  // 65–78 s | A virada
  { id: "arranca", de: fim("05") + 0.4, ate: pal("06", "lançou") - 0.4, fundo: "escotilha", bloco: "luta", luz: "dia", tremor: 8,
    cam: [[560, 1350, 1.5], [560, 1380, 1.9]], at: { Tecnico: { xPara: 900 } } },
  { id: "lanca", de: pal("06", "lançou") - 0.4, ate: pal("06", "sobre") - 0.2, fundo: "escotilha", bloco: "lanca", luz: "dia", tremor: 5,
    cam: [[480, 1200, 1.4], [540, 900, 1.8]] },
  { id: "trecho", de: pal("06", "sobre") - 0.2, ate: T_BOOM3, fundo: "ext", luz: "normal",
    cam: [[620, 1040, 1.6], [420, 1200, 1.3]] },
  { id: "longe", de: T_BOOM3, ate: fim("06") + 0.5, fundo: "ext", luz: "normal", tremor: 5,
    cam: [[420, 1200, 1.3], [540, 1000, 1.0]] },
  { id: "alivio", de: fim("06") + 0.5, ate: pal("07", "miguel") - 0.6, fundo: "vagaoFim", bloco: "alivio", luz: "dia",
    cam: [[540, 1320, 1.5], [540, 1300, 2.2]], at: { Miguel: { fechado: true } } },

  // 78–90 s | O despertar
  { id: "olhos", de: pal("07", "miguel") - 0.6, ate: pal("07", "olhos") - 0.1, fundo: "hospital", bloco: "hosp", luz: "dia",
    cam: [[R_HOSP[0], R_HOSP[1], 2.8], [R_HOSP[0], R_HOSP[1], 3.0]], at: { Paciente: { fechado: true }, Mulher: { oculto: true } } },
  { id: "abre", de: pal("07", "olhos") - 0.1, ate: pal("07", "atentado") - 0.5, fundo: "hospital", bloco: "hosp", luz: "dia",
    cam: [[R_HOSP[0], R_HOSP[1], 3.0], [R_HOSP[0], R_HOSP[1] + 40, 2.0]], at: { Paciente: { expr: "surpreso" }, Mulher: { oculto: true } } },
  { id: "real", de: pal("07", "atentado") - 0.5, ate: pal("07", "televisão") - 0.7, fundo: "hospital", bloco: "hosp", luz: "dia",
    cam: [[540, 1250, 1.15], [640, 1300, 1.5]], at: { Paciente: { olhar: [1, 0] } } },
  { id: "tv", de: pal("07", "televisão") - 0.7, ate: pal("07", "primeira") - 0.7, fundo: "hospital", bloco: "hosp", luz: "dia",
    cam: [[700, 500, 1.5], [820, 355, 2.3]], at: { Paciente: { olhar: [0.8, -0.9] } } },
  { id: "sorriso", de: pal("07", "primeira") - 0.7, ate: pal("07", "relógio") - 0.3, fundo: "hospital", bloco: "hosp", luz: "dia",
    cam: [[R_HOSP[0], R_HOSP[1], 2.4], [R_HOSP[0], R_HOSP[1], 2.8]], at: { Paciente: { expr: "feliz", olhar: [-0.6, -0.9], lagrima: true } } },
  { id: "relogio", de: pal("07", "relógio") - 0.3, ate: T_VIRA + 1.6, fundo: "hospital", bloco: "hosp", luz: "dia",
    cam: [[250, 320, 2.2], [250, 320, 2.8]] },
  { id: "final", de: T_VIRA + 1.6, ate: PRETO, fundo: "hospital", bloco: "hosp", luz: "dia",
    cam: [[400, 900, 1.5], [540, 960, 1.0]], at: { Paciente: { expr: "feliz", olhar: [-0.6, -0.9] } } },
];

const P = Object.fromEntries(SHOTS.map((s) => [s.id, s]));
const dentro = (t: number, id: string) => sobe(t, P[id].de, P[id].ate);
const T_FREIO = P.freio.de + 0.5;
const HORAS: Record<string, string> = {
  acorda: "08:09", quarta: "08:09", ninguem: "08:10", maquinista: "08:11", freio: "08:12", tentativas: "08:16", mulher: "08:13",
  segue: "08:13", nome: "08:14", preso: "08:14", simulacao: "08:14", investigadora: "08:14", tecnico: "08:15", fingia: "08:15",
  detonador: "08:15", dois: "08:15", aviso: "08:15", decide: "08:16", corre: "08:16", alivio: "08:17",
};
const PASSAGEIROS = [3, 5, 7, 9, 11].map((i) => cidadao(i));

const cenario = ({ t, shot }: Contexto) => {
  const hora = HORAS[shot.id] ?? "08:09";
  switch (shot.fundo) {
    case "vagao": return <Vagao t={t} relogio={hora} vel={shot.luz === "pisca" ? 1.6 : 1} />;
    case "vagao2": return <Vagao t={t} relogio={hora} banco="#c2772e" passageiros={false} />;
    case "vagaoFim": return <Vagao t={t} relogio={hora} agachados />;
    case "ar": return <Vagao t={t} relogio={hora} banco="#c2772e" ar passageiros={false} />;
    case "cabine": return <FimVagao t={t} tipo="cabine" relogio={hora} />;
    case "passagem": return <FimVagao t={t} tipo="passagem" relogio={hora} abre={sobe(t, P.segue.de, P.segue.de + 0.5)} />;
    case "escotilha": return <Escotilha t={t} />;
    case "hospital": return <Hospital t={t} relogio={t >= T_VIRA ? "08:18" : "08:17"} tv={<Reportagem t={t} elenco={PASSAGEIROS} />} />;
    default: break;
  }
  switch (shot.id) {
    case "explosao": return <Exterior t={t} trem={0.25 + 0.35 * dentro(t, "explosao")} boom={sobe(t, T_BOOM1, T_BOOM1 + 1.8)} boomEm={[540, 1010]} />;
    case "explosao2": return <Exterior t={t} trem={0.5} boom={dentro(t, "explosao2")} boomEm={[540, 1010]} />;
    case "trecho": return <Exterior t={t} trem={0.55 + 0.2 * dentro(t, "trecho")} caixa={dentro(t, "trecho")} boomEm={[200, 1640]} />;
    default: return <Exterior t={t} trem={0.75 + 0.35 * dentro(t, "longe")} boom={sobe(t, T_BOOM3, T_BOOM3 + 2)} boomEm={[200, 1640]} />;
  }
};

const Caixa = ({ aberta = false, s = 1 }: { aberta?: boolean; s?: number }) => (
  <g transform={`scale(${s})`}>
    <rect x={-70} y={-70} width={140} height={70} rx={8} fill="#b3402e" stroke="#14181e" strokeWidth={6} />
    <path d="M-30 -70 L-30 -100 L30 -100 L30 -70" stroke="#14181e" strokeWidth={10} fill="none" />
    <rect x={-12} y={-46} width={24} height={16} fill="#e6c229" />
    {aberta && <path d="M-70 -70 L-90 -130 L50 -130 L70 -70Z" fill="#8a2e22" stroke="#14181e" strokeWidth={6} />}
  </g>
);

const itens = ({ t, shot }: Contexto) => {
  const item = (el: ReactNode) => [{ y: 2000, el }];
  switch (shot.id) {
    case "tecnico": case "fingia": case "detonador":
      return item(<g key="c" transform="translate(690 1800)"><Caixa aberta s={1.1} /></g>);
    case "corre": {
      const x = 700 + dentro(t, "corre") * 600 + 110;
      return item(<g key="c" transform={`translate(${x} 1560)`}><Caixa s={0.8} /></g>);
    }
    case "arranca": {
      const p = dentro(t, "arranca");
      return item(<g key="c" transform={`translate(${620 - p * 90 + Math.sin(t * 30) * 12} 1420) rotate(${Math.sin(t * 22) * 10})`}><Caixa /></g>);
    }
    case "lanca": {
      const p = sobe(t, P.lanca.de + 0.5, P.lanca.de + 1.2);
      return p < 1 ? item(<g key="c" transform={`translate(${470 + p * 80} ${1380 - p * 520}) rotate(${p * 300}) scale(${1 - p * 0.6})`}><Caixa /></g>) : [];
    }
    default: return [];
  }
};

const frente = ({ shot }: Contexto) => (shot.fundo === "hospital" ? <Cama /> : null);

// ---------- sobreposições ----------
const Grande = ({ texto, cor = "#ff5a4a", top = 230, tam = 220, sub }: { texto: string; cor?: string; top?: number; tam?: number; sub?: string }) => (
  <AbsoluteFill style={{ alignItems: "center", fontFamily: FONT }}>
    <div style={{ marginTop: top, fontSize: tam, color: cor, letterSpacing: 8, lineHeight: 1, textShadow: `0 8px 0 #14161c, 0 0 60px ${cor}` }}>{texto}</div>
    {sub && <div style={{ fontSize: 64, color: "#fff", marginTop: 16, letterSpacing: 4, textShadow: "0 5px 0 #14161c" }}>{sub}</div>}
  </AbsoluteFill>
);

const Simulacao = ({ t, p }: { t: number; p: number }) => (
  <AbsoluteFill>
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {Array.from({ length: 13 }, (_, i) => <line key={`v${i}`} x1={i * 90} y1={0} x2={i * 90} y2={1920} stroke="#7ef0ff" strokeWidth={3} opacity={0.35 * p} />)}
      {Array.from({ length: 22 }, (_, i) => <line key={`h${i}`} x1={0} y1={i * 90 + ((t * 60) % 90)} x2={1080} y2={i * 90 + ((t * 60) % 90)} stroke="#7ef0ff" strokeWidth={3} opacity={0.35 * p} />)}
      {Array.from({ length: 6 }, (_, i) => <rect key={i} x={0} y={(Math.sin(t * 3 + i * 9) * 0.5 + 0.5) * 1900} width={1080} height={10 + i * 6} fill="#7ef0ff" opacity={0.2 * p} />)}
    </svg>
    <AbsoluteFill style={{ alignItems: "center", fontFamily: FONT, opacity: p }}>
      <div style={{ marginTop: 210, padding: "22px 40px", border: "5px solid #7ef0ff", background: "rgba(6,24,36,0.85)", color: "#d8fbff", textAlign: "center", boxShadow: "0 0 60px rgba(126,240,255,0.4)" }}>
        <div style={{ fontSize: 100, letterSpacing: 8 }}>SIMULAÇÃO Nº 4</div>
        <div style={{ fontSize: 46, color: "#ffb347", marginTop: 6 }}>ORIGEM DO ATENTADO: <span style={{ opacity: Math.sin(t * 8) > 0 ? 1 : 0.3 }}>NÃO LOCALIZADA</span></div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);

const Distintivo = ({ t }: { t: number }) => (
  <AbsoluteFill style={{ alignItems: "center", fontFamily: FONT }}>
    <div style={{ marginTop: 240, width: 640, padding: "26px 34px", background: "#14202e", border: "6px solid #e6c229", borderRadius: 20, color: "#fff", display: "flex", gap: 28, alignItems: "center", transform: `rotate(${Math.sin(t * 2) * 1.5 - 2}deg)`, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
      <svg width={170} height={200} viewBox="0 0 360 430" style={{ background: "#2a3a50" }}><g transform="translate(180 810) scale(0.92)"><Ator v={MULHER} t={t} expr="firme" fase={2} /></g></svg>
      <div>
        <div style={{ fontSize: 34, color: "#e6c229", letterSpacing: 3 }}>UNIDADE ANTITERROR</div>
        <div style={{ fontSize: 66, lineHeight: 1.1 }}>INVESTIGADORA</div>
        <div style={{ fontSize: 30, opacity: 0.7, marginTop: 6 }}>CREDENCIAL 0417 · ACESSO TOTAL</div>
      </div>
    </div>
  </AbsoluteFill>
);

const Detonador = ({ t, p }: { t: number; p: number }) => (
  <AbsoluteFill style={{ alignItems: "center", background: "rgba(4,6,10,0.5)" }}>
    <svg width={900} height={760} viewBox="-450 -380 900 760" style={{ marginTop: 300 }}>
      <rect x={-400} y={-220} width={800} height={520} rx={24} fill="#8a2e22" stroke="#14181e" strokeWidth={14} />
      <rect x={-360} y={-180} width={720} height={440} rx={12} fill="#2a1512" />
      <path d="M-320 -120 L-200 -140 L-190 -100 L-310 -80Z" fill="#8e99a3" /><rect x={-330} y={-40} width={180} height={34} rx={10} fill="#e6c229" />
      <circle cx={-250} cy={90} r={46} fill="none" stroke="#8e99a3" strokeWidth={18} /><rect x={-150} y={150} width={200} height={30} fill="#56636e" />
      <g opacity={sobe(p, 0.15, 0.4)}>
        <rect x={-40} y={-150} width={360} height={250} rx={14} fill="#14181e" stroke={Math.sin(t * 10) > 0 ? "#ff3a2a" : "#7a1a12"} strokeWidth={10} />
        <rect x={0} y={-116} width={280} height={110} fill="#1a0806" />
        <text x={140} y={-30} textAnchor="middle" fontFamily={FONT} fontSize={96} fill="#ff3a2a">08:17</text>
        <circle cx={40} cy={50} r={18} fill="#ff3a2a" opacity={Math.sin(t * 10) > 0 ? 1 : 0.2} />
        <path d="M100 50 Q200 140 60 200 Q-80 240 -140 150" stroke="#ff3a2a" strokeWidth={12} fill="none" />
        <path d="M180 50 Q300 160 260 230" stroke="#3d6fa3" strokeWidth={12} fill="none" />
        <rect x={-180} y={110} width={90} height={60} rx={8} fill="#e8e4dc" />
      </g>
    </svg>
  </AbsoluteFill>
);

const sobre = ({ t, shot }: Contexto) => {
  switch (shot.id) {
    case "explosao": return t < T_BOOM1 + 2.2 ? <Grande texto="08:17" /> : null;
    case "quarta": return <Grande texto={`${Math.min(4, 1 + Math.floor(dentro(t, "quarta") * 4))}ª VEZ`} cor="#ffb347" tam={190} />;
    case "tentativas": return <Grande texto={`TENTATIVA ${5 + Math.min(3, Math.floor(dentro(t, "tentativas") * 4))}`} cor="#ffb347" tam={130} />;
    case "explosao2": return <Grande texto="08:17" />;
    case "simulacao": return <Simulacao t={t} p={sobe(t, T_SIM, T_SIM + 0.5)} />;
    case "investigadora": return <Distintivo t={t} />;
    case "detonador": return <Detonador t={t} p={dentro(t, "detonador")} />;
    case "dois": return <Grande texto="08:15" sub="FALTAM 2 MINUTOS" />;
    case "corre": return <Grande texto={`01:${String(Math.max(0, 12 - Math.floor((t - P.corre.de) * 4))).padStart(2, "0")}`} tam={170} />;
    case "longe": return t > T_BOOM3 + 1.4 ? <Grande texto="TREM INTACTO" cor="#5cf29a" tam={130} /> : null;
    default: return null;
  }
};

const fx = ({ t }: Contexto) => ({
  impacto: Math.max(decai(t, T_BOOM1, 1.4), decai(t, T_BOOM2, 1.2), decai(t, T_FREIO, 0.8), decai(t, T_BOOM3, 1.2) * 0.6, decai(t, P.arranca.de, 0.5)),
  flash: Math.max(decai(t, T_BOOM1, 0.5), decai(t, T_BOOM2, 0.5), decai(t, T_BOOM3, 0.4), decai(t, T_SIM, 0.4)),
  clarao: Math.max(
    decai(t, T_ACORDA, 0.5), decai(t, P.mulher.de, 0.4),
    ...[0, 1, 2, 3].map((k) => decai(t, P.quarta.de + (k * (P.quarta.ate - P.quarta.de)) / 4, 0.18) * 0.8),
    ...[0, 1, 2].map((k) => decai(t, P.tentativas.de + (k * (P.tentativas.ate - P.tentativas.de)) / 3, 0.2) * 0.8),
    sobe(t, P.alivio.ate - 0.6, P.alivio.ate) * (t < P.alivio.ate ? 1 : 0), decai(t, P.olhos.de, 0.8),
  ),
  claraoCor: "#ffffff",
});

const S = "oito/sfx/";
const TRILHOS = "trem/sfx/trilhos.mp3";

export const Oito = () => (
  <Episodio
    manifesto={manifesto} shots={SHOTS} blocos={BLOCOS} preto={PRETO} elenco={ELENCO} vinheta={0.5}
    cenario={cenario} sobre={sobre} itens={itens} frente={frente} fx={fx}
    corLegenda={() => "#ffffff"}
    final={() => (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", color: "#e8e4dc", fontFamily: FONT, fontSize: 90, letterSpacing: 10 }}>FIM</AbsoluteFill>
    )}
    sons={
      <>
        <Som fps={FPS} em={T_ACORDA} src={`${S}musica.mp3`} volume={0.3} dur={manifesto.duracao - T_ACORDA} some={1.6} />
        <Som fps={FPS} em={0} src={TRILHOS} volume={0.5} dur={T_BOOM1} />
        <Som fps={FPS} em={T_BOOM1} src={`${S}explosao.mp3`} volume={1} dur={T_ACORDA - T_BOOM1} some={0.2} />
        <Som fps={FPS} em={T_ACORDA} src={TRILHOS} volume={0.3} dur={T_BOOM2 - T_ACORDA} some={0.2} />
        <Som fps={FPS} em={T_ACORDA} src="minutos/sfx/reverso.mp3" volume={0.6} dur={1.2} some={0.3} />
        <Som fps={FPS} em={P.maquinista.de + 1.2} src="ep01/sfx/batida.mp3" volume={0.8} />
        <Som fps={FPS} em={P.maquinista.de + 1.9} src="ep01/sfx/batida.mp3" volume={0.8} />
        <Som fps={FPS} em={T_FREIO} src={`${S}freio.mp3`} volume={0.8} dur={P.tentativas.de - T_FREIO + 0.4} some={0.4} />
        <Som fps={FPS} em={T_BOOM2} src={`${S}explosao.mp3`} volume={1} dur={P.mulher.de - T_BOOM2} some={0.2} />
        <Som fps={FPS} em={P.mulher.de} src="minutos/sfx/reverso.mp3" volume={0.5} dur={1.2} some={0.3} />
        <Som fps={FPS} em={P.mulher.de} src={TRILHOS} volume={0.3} dur={20} some={1} />
        <Som fps={FPS} em={P.segue.de + 0.1} src="trem/sfx/porta.mp3" volume={0.8} />
        <Som fps={FPS} em={T_SIM} src="futuro/sfx/glitch.mp3" volume={0.7} dur={fim("03") + 0.4 - T_SIM} some={0.4} />
        <Som fps={FPS} em={P.mulher.de + 20} src={TRILHOS} volume={0.3} dur={P.trecho.de - P.mulher.de - 20} some={0.3} />
        <Som fps={FPS} em={P.detonador.de + 0.4} src="futuro/sfx/tique.mp3" volume={0.9} dur={P.dois.de - P.detonador.de - 0.4} some={0.2} />
        <Som fps={FPS} em={P.dois.de} src="futuro/sfx/tique.mp3" volume={0.7} dur={1.6} some={0.2} />
        <Som fps={FPS} em={P.aviso.de + 2.2} src="tempo/sfx/apaga.mp3" volume={0.5} dur={2.4} some={0.4} />
        <Som fps={FPS} em={P.corre.de} src="futuro/sfx/tique.mp3" volume={0.8} dur={P.arranca.de - P.corre.de} some={0.2} />
        <Som fps={FPS} em={P.arranca.de + 0.2} src="ep01/sfx/impacto.mp3" volume={0.7} />
        <Som fps={FPS} em={P.lanca.de + 0.5} src="mare01/sfx/vento.mp3" volume={0.7} dur={T_BOOM3 - P.lanca.de - 0.5} some={0.3} />
        <Som fps={FPS} em={T_BOOM3} src={`${S}explosao.mp3`} volume={0.75} />
        <Som fps={FPS} em={P.alivio.de} src={TRILHOS} volume={0.25} dur={P.olhos.de - P.alivio.de} some={0.6} />
        <Som fps={FPS} em={P.olhos.de + 0.3} src="ep02/sfx/bipe.mp3" volume={0.5} />
        <Som fps={FPS} em={P.abre.de + 0.6} src="ep02/sfx/bipe.mp3" volume={0.5} />
        <Som fps={FPS} em={P.real.de + 0.5} src="ep02/sfx/bipe.mp3" volume={0.4} />
        <Som fps={FPS} em={P.tv.de} src="tempo/sfx/cidade.mp3" volume={0.25} dur={P.sorriso.de - P.tv.de} some={0.5} />
        <Som fps={FPS} em={T_VIRA} src="trem/sfx/brilho.mp3" volume={0.8} />
      </>
    }
  />
);

export const OITO_DURACAO = Math.round(manifesto.duracao * FPS);
export const OITO_FPS = FPS;
