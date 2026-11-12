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
import { Corredor } from "../cidade/cenarios";
import { MundoReal, Observacao, Parede, RuaPerfeita, SalaTV } from "./cenarios";

// A Cidade de Mentira — curta narrado.

const manifesto = manifestoJson as Manifesto;
const FPS = manifesto.fps;
const PRETO = manifestoJson.preto;
const { fim, pal } = tempos(manifesto);

const BRUNO: Visual = { pele: "#e2b08a", cabelo: "#6b4428", roupa: "#f0c94a", calca: "#3a4a63", estilo: "curto" };
const DIRETOR: Visual = { pele: "#edc09c", cabelo: "#17110e", roupa: "#1c1f26", casaco: true, calca: "#1c1f26", estilo: "curto", gravata: true, oculos: true };
const V1: Visual = { ...cidadao(1), roupa: "#f6a5a0" }, V2: Visual = { ...cidadao(4), roupa: "#9fd4c0" }, V3: Visual = { ...cidadao(8), roupa: "#a9c4f0" };
const ELENCO: Record<string, Visual> = { Bruno: BRUNO, Diretor: DIRETOR, Ana: V1, Joel: V2, Rita: V3 };

const BLOCOS: Record<string, Bloco> = {
  rua: { Bruno: e(760, 1830, 0.62, "feliz", [-0.6, 0.2]) },
  parede: { Bruno: e(330, 1820, 0.66, "congelado", [0.6, -0.5], "empurrar") },
  corredor: { Bruno: e(540, 1700, 0.5, "medo", [0, -0.3]) },
  obs: { Bruno: e(150, 1830, 0.52, "congelado", [1, -0.6]) },
  console: { Bruno: e(300, 1820, 0.66, "bravo", [1, 0]), Diretor: e(800, 1820, 0.68, "bravo", [-1, 0]) },
  casa: { Ana: e(280, 1800, 0.56, "surpreso", [0.5, -0.9]), Joel: e(540, 1810, 0.58, "surpreso", [0, -0.9]), Rita: e(800, 1800, 0.56, "surpreso", [-0.5, -0.9]) },
  saida: { Bruno: e(540, 1840, 0.6, "firme", [0, -0.3]), Ana: e(300, 1860, 0.54, "medo", [0.5, -0.3]), Joel: e(780, 1860, 0.56, "medo", [-0.5, -0.3]), Rita: e(140, 1880, 0.5, "medo", [0.6, -0.3]) },
  real: { Rita: e(170, 1860, 0.56, "surpreso", [0.8, -0.5]), Ana: e(370, 1870, 0.58, "surpreso", [0.5, -0.6]), Bruno: e(600, 1880, 0.64, "surpreso", [-0.3, -0.6]), Joel: e(850, 1870, 0.6, "surpreso", [-0.7, -0.5]) },
};
const R = (b: string, n: string): [number, number] => [BLOCOS[b][n].x, BLOCOS[b][n].y - 690 * BLOCOS[b][n].s];
const R_RUA = R("rua", "Bruno"), R_PAR = R("parede", "Bruno"), R_BC = R("console", "Bruno"), R_DIR = R("console", "Diretor"), R_REAL = R("real", "Bruno");

const T_REP = pal("01", "mesmo") - 0.2, T_REP_FIM = pal("01", "quando") - 0.1;
const DIAS = ["SEGUNDA", "TERÇA", "QUARTA"];
const repeticoes: Shot[] = DIAS.map((_, k): Shot => {
  const d = (T_REP_FIM - T_REP) / 3;
  return { id: `rep${k}`, de: T_REP + k * d, ate: T_REP + (k + 1) * d, fundo: "rua", bloco: "rua", luz: "dia", cam: [[540, 1450, 1.3], [540, 1450, 1.36]] };
});

const SHOTS: Shot[] = [
  // 00–12 s | O cachorro
  { id: "rotina", de: 0, ate: T_REP, fundo: "rua", bloco: "rua", luz: "dia",
    cam: [[540, 1000, 1.25], [540, 1250, 1.1]] },
  ...repeticoes,
  { id: "impede", de: T_REP_FIM, ate: pal("01", "animal") - 0.2, fundo: "rua", bloco: "rua", luz: "dia",
    cam: [[560, 1450, 1.4], [600, 1480, 1.7]], at: { Bruno: { y: 1830, yPara: 1690, x: 760, xPara: 700, expr: "firme", pose: "abracar", olhar: [-1, 0.6] } } },
  { id: "some", de: pal("01", "animal") - 0.2, ate: fim("01") + 0.6, fundo: "rua", bloco: "rua", luz: "dia",
    cam: [[560, 1480, 1.9], [640, 1420, 2.3]], at: { Bruno: { y: 1690, x: 700, expr: "congelado", olhar: [-1, 0.7] } } },

  // 12–25 s | A falha
  { id: "ceu", de: fim("01") + 0.6, ate: pal("02", "bruno") - 0.2, fundo: "rua", bloco: "rua", luz: "dia", tremor: 3,
    cam: [[R_RUA[0], R_RUA[1], 2.0], [540, 620, 1.2]], at: { Bruno: { expr: "medo", olhar: [-0.3, -1] } } },
  { id: "corre", de: pal("02", "bruno") - 0.2, ate: pal("02", "encontrou") - 0.4, fundo: "rua", bloco: "rua", luz: "dia", tremor: 5,
    cam: [[700, 1500, 1.5], [720, 1500, 1.6]], at: { Bruno: { expr: "panico", x: 700, xPara: 760, olhar: [1, 0] } } },
  { id: "parede", de: pal("02", "encontrou") - 0.4, ate: pal("02", "pintada") - 0.2, fundo: "parede", bloco: "parede", luz: "dia",
    cam: [[540, 1100, 1.0], [460, 1300, 1.5]], at: { Bruno: { x: -200, xPara: 330, pose: "parado" } } },
  { id: "toca", de: pal("02", "pintada") - 0.2, ate: fim("02") + 0.5, fundo: "parede", bloco: "parede", luz: "dia",
    cam: [[R_PAR[0] + 80, R_PAR[1] + 80, 2.0], [R_PAR[0] + 100, R_PAR[1] + 60, 2.5]] },

  // 25–38 s | A porta
  { id: "placa", de: fim("02") + 0.5, ate: pal("03", "havia") - 0.1, fundo: "parede", bloco: "parede", luz: "dia",
    cam: [[480, 1250, 1.4], [540, 1200, 1.8]], at: { Bruno: { pose: "parado", expr: "desconfiado", olhar: [1, -0.5] } } },
  { id: "porta", de: pal("03", "havia") - 0.1, ate: pal("03", "do") - 0.1, fundo: "parede", bloco: "parede", luz: "dia",
    cam: [[540, 1250, 1.7], [540, 1320, 1.9]], at: { Bruno: { pose: "apontarDir", expr: "surpreso", olhar: [1, -0.2] } } },
  { id: "corredor", de: pal("03", "do") - 0.1, ate: pal("03", "dezenas") - 0.1, fundo: "corredor", bloco: "corredor", luz: "noite", tremor: 2,
    cam: [[540, 1200, 1.2], [540, 1150, 1.5]], at: { Bruno: { y: 1900, s: 0.7, yPara: 1560, sPara: 0.42 } } },
  { id: "observam", de: pal("03", "dezenas") - 0.1, ate: fim("03") + 0.5, fundo: "obs", bloco: "obs", luz: "noite",
    cam: [[300, 1450, 1.6], [540, 960, 1.0]] },

  // 38–52 s | A explicação
  { id: "experiencia", de: fim("03") + 0.5, ate: pal("04", "os") - 0.1, fundo: "obs", bloco: "obs", luz: "noite",
    cam: [[300, 500, 1.9], [780, 800, 1.9]] },
  { id: "aceitaram", de: pal("04", "os") - 0.1, ate: pal("04", "mas") - 0.1, fundo: "obs", bloco: "obs", luz: "noite",
    cam: [[540, 960, 1.0], [540, 960, 1.05]] },
  { id: "bloqueadas", de: pal("04", "mas") - 0.1, ate: fim("04") + 0.5, fundo: "obs", bloco: "obs", luz: "noite",
    cam: [[540, 960, 1.05], [540, 960, 1.1]] },

  // 52–65 s | A traição
  { id: "contrato", de: fim("04") + 0.5, ate: pal("05", "só") - 0.1, fundo: "obs", bloco: "console", luz: "noite",
    cam: [[R_BC[0], R_BC[1], 2.0], [R_BC[0], R_BC[1], 2.2]], at: { Bruno: { olhar: [0.2, 0.9] }, Diretor: { oculto: true } } },
  { id: "diretor", de: pal("05", "só") - 0.1, ate: pal("05", "para") - 0.1, fundo: "obs", bloco: "console", luz: "noite",
    cam: [[R_DIR[0], R_DIR[1] + 100, 1.7], [R_DIR[0], R_DIR[1], 2.7]], at: { Diretor: { x: 1250, xPara: 800 } } },
  { id: "bloqueia", de: pal("05", "para") - 0.1, ate: fim("05") + 0.5, fundo: "obsBloq", bloco: "console", luz: "vermelha", tremor: 5,
    cam: [[540, 1400, 1.4], [540, 1420, 1.6]], at: { Diretor: { xPara: 660, pose: "alcancar" }, Bruno: { xPara: 400, pose: "apontarDir" } } },

  // 65–78 s | A transmissão
  { id: "microfone", de: fim("05") + 0.5, ate: pal("06", "leu") - 0.1, fundo: "obs", bloco: "console", luz: "noite", tremor: 3,
    cam: [[500, 1400, 1.5], [440, 1380, 1.9]], at: { Bruno: { x: 400, expr: "firme", pose: "apontarDir" }, Diretor: { x: 900, expr: "panico", pose: "recuar" } } },
  { id: "le", de: pal("06", "leu") - 0.1, ate: pal("06", "cada") - 0.7, fundo: "obs", bloco: "console", luz: "noite",
    cam: [[430, R_BC[1], 2.3], [430, R_BC[1], 2.7]], at: { Bruno: { x: 400, expr: "firme", olhar: [0.4, 0] }, Diretor: { oculto: true } } },
  { id: "casas", de: pal("06", "cada") - 0.7, ate: pal("06", "localização") - 0.4, fundo: "casa", bloco: "casa", luz: "dia",
    cam: [[540, 1250, 1.15], [540, 800, 1.6]] },
  { id: "saidas", de: pal("06", "localização") - 0.4, ate: fim("06") + 0.6, fundo: "casaMapa", bloco: "casa", luz: "dia",
    cam: [[540, 760, 1.7], [540, 1200, 1.15]], at: { Ana: { expr: "feliz" }, Joel: { expr: "feliz", pose: "apontarCima" }, Rita: { expr: "feliz" } } },

  // 78–90 s | O mundo real
  { id: "ultima", de: fim("06") + 0.6, ate: pal("07", "mundo") - 0.2, fundo: "paredeSaida", bloco: "saida", luz: "dia",
    cam: [[540, 1350, 1.2], [540, 1300, 1.6]],
    at: { Bruno: { yPara: 1600, sPara: 0.36 }, Ana: { xPara: 470, yPara: 1620, sPara: 0.34 }, Joel: { xPara: 610, yPara: 1620, sPara: 0.34 }, Rita: { xPara: 420, yPara: 1660, sPara: 0.34 } } },
  { id: "real", de: pal("07", "mundo") - 0.2, ate: pal("07", "ele") - 0.2, fundo: "real", bloco: "real", luz: "dia",
    cam: [[300, 1100, 1.35], [760, 1250, 1.2]] },
  { id: "sorriu", de: pal("07", "ele") - 0.2, ate: pal("07", "cada") - 0.2, fundo: "real", bloco: "real", luz: "dia",
    cam: [[R_REAL[0], R_REAL[1], 2.2], [R_REAL[0], R_REAL[1], 2.7]], at: { Bruno: { expr: "feliz", olhar: [0.2, -0.6] } } },
  { id: "eles", de: pal("07", "cada") - 0.2, ate: PRETO, fundo: "real", bloco: "real", luz: "dia",
    cam: [[520, 1500, 1.7], [540, 1050, 1.0]],
    at: { Bruno: { expr: "feliz" }, Ana: { expr: "feliz" }, Joel: { expr: "feliz", pose: "abracar" }, Rita: { expr: "feliz", fechado: true } } },
];

const P = Object.fromEntries(SHOTS.map((s) => [s.id, s]));
const dentro = (t: number, id: string) => sobe(t, P[id].de, P[id].ate);
const T_SOME = P.some.de + 0.5;
const T_GLITCH = pal("02", "céu") - 0.3;
const T_ABRE = P.porta.de + 0.2;

// ---------- telas ----------
const Clausula = ({ w = 760, h = 540, escala = 1 }: { w?: number; h?: number; escala?: number }) => (
  <g>
    <rect width={w} height={h} fill="#12301f" />
    <text x={w / 2} y={h * 0.22} textAnchor="middle" fontFamily={FONT} fontSize={70 * escala} fill="#5cf29a" letterSpacing={4}>A VERDADE</text>
    <text x={w / 2} y={h * 0.45} textAnchor="middle" fontFamily={FONT} fontSize={52 * escala} fill="#fff">CLÁUSULA 9</text>
    <text x={w / 2} y={h * 0.62} textAnchor="middle" fontFamily={FONT} fontSize={48 * escala} fill="#ffd166">VOCÊ PODE SAIR</text>
    <text x={w / 2} y={h * 0.78} textAnchor="middle" fontFamily={FONT} fontSize={48 * escala} fill="#ffd166">A QUALQUER MOMENTO</text>
  </g>
);
const MapaSaidas = ({ t }: { t: number }) => (
  <g>
    <rect width={760} height={540} fill="#0f2233" />
    <text x={380} y={76} textAnchor="middle" fontFamily={FONT} fontSize={58} fill="#fff" letterSpacing={4}>SAÍDAS DA CIDADE</text>
    <rect x={110} y={130} width={540} height={350} rx={20} fill="none" stroke="#7ef0ff" strokeWidth={8} />
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={170 + (i % 4) * 110} y={180 + Math.floor(i / 4) * 90} width={70} height={54} fill="#3d6fa3" />)}
    {[[110, 220], [650, 300], [380, 480], [380, 130]].map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y})`}>
        <circle r={24 + ((t * 60 + i * 20) % 50)} fill="none" stroke="#5cf29a" strokeWidth={6} opacity={1 - ((t * 60 + i * 20) % 50) / 50} />
        <circle r={22} fill="#5cf29a" />
      </g>
    ))}
  </g>
);

const cenario = ({ t, shot }: Contexto) => {
  const todos = [BRUNO, V1, V2, V3];
  switch (shot.fundo) {
    case "rua": {
      if (shot.id.startsWith("rep")) return <RuaPerfeita t={t - shot.de} cao={0.1 + 0.4 * dentro(t, shot.id)} />;
      if (shot.id === "rotina") return <RuaPerfeita t={t} />;
      if (shot.id === "impede") return <RuaPerfeita t={t} cao={0.05 + 0.33 * dentro(t, "impede")} />;
      if (shot.id === "some") return <RuaPerfeita t={t} cao={0.38 + 0.04 * sobe(t, P.some.de, T_SOME)} some={sobe(t, T_SOME, T_SOME + 0.9)} />;
      if (shot.id === "ceu") return <RuaPerfeita t={t} glitch={t > T_GLITCH ? 1 : 0} />;
      return <RuaPerfeita t={t} rola={(t - P.corre.de) * 1500} glitch={0.8} />;
    }
    case "parede": return <Parede t={t} placa={shot.id === "porta" ? sobe(t, T_ABRE, T_ABRE + 0.9) : 0} />;
    case "paredeSaida": return <Parede t={t} placa={1} luz={1} saidas={sobe(t, P.ultima.de, P.ultima.de + 1.2)} />;
    case "corredor": return <Corredor t={t} />;
    case "obs": return <Observacao t={t} v={todos} verdade={shot.id === "le"} />;
    case "obsBloq": return <Observacao t={t} v={todos} bloqueio />;
    case "casa": return <SalaTV t={t} tela={<Clausula />} />;
    case "casaMapa": return <SalaTV t={t} tela={<MapaSaidas t={t} />} />;
    default: return <MundoReal t={t} />;
  }
};

const itens = ({ t, shot }: Contexto) => {
  if (shot.id === "microfone" || shot.id === "le") {
    return [{
      y: 2000, el: (
        <g key="m" transform="translate(560 1440)">
          <rect x={-10} y={0} width={20} height={130} fill="#56636e" />
          <rect x={-34} y={-90} width={68} height={110} rx={30} fill="#14181e" stroke="#8e99a3" strokeWidth={6} />
          {shot.id === "le" && [0, 1, 2].map((i) => <circle key={i} r={60 + ((t * 160 + i * 70) % 210)} cy={-40} fill="none" stroke="#5cf29a" strokeWidth={6} opacity={0.6 - ((t * 160 + i * 70) % 210) / 400} />)}
        </g>
      ) as ReactNode,
    }];
  }
  return [];
};

// ---------- sobreposições ----------
const Faixa = ({ texto, cor = "#fff", top = 230, tam = 130, sub }: { texto: string; cor?: string; top?: number; tam?: number; sub?: string }) => (
  <AbsoluteFill style={{ alignItems: "center", fontFamily: FONT }}>
    <div style={{ marginTop: top, fontSize: tam, color: cor, letterSpacing: 6, textAlign: "center", lineHeight: 1.05, textShadow: `0 7px 0 #14161c, 0 0 50px ${cor}66` }}>{texto}</div>
    {sub && <div style={{ fontSize: 60, color: "#fff", marginTop: 12, letterSpacing: 4, textShadow: "0 5px 0 #14161c" }}>{sub}</div>}
  </AbsoluteFill>
);

/** Vídeo antigo: moradores assinando o consentimento; depois, memórias bloqueadas. */
const Arquivo = ({ t, bloqueio }: { t: number; bloqueio: number }) => (
  <AbsoluteFill style={{ alignItems: "center", background: "rgba(4,6,10,0.6)" }}>
    <svg width={900} height={860} viewBox="0 0 900 860" style={{ marginTop: 260, filter: "sepia(0.55)" }}>
      <rect width={900} height={860} rx={14} fill="#d9d2c0" stroke="#14161c" strokeWidth={12} />
      <rect x={30} y={30} width={840} height={800} fill="#b9c7cf" />
      <rect x={30} y={600} width={840} height={230} fill="#8a7a66" />
      {[BRUNO, V1, V2].map((v, i) => (
        <g key={i}>
          <g transform={`translate(${190 + i * 260} 1010) scale(0.62)`}><Ator v={v} t={t} expr={bloqueio > 0.5 ? "neutro" : "feliz"} olhar={[0, 0.8]} fechado={bloqueio > 0.5} fase={i} /></g>
          <rect x={120 + i * 260} y={640} width={140} height={100} fill="#fffaf0" stroke="#14161c" strokeWidth={4} transform={`rotate(-4 ${190 + i * 260} 690)`} />
          <path d={`M${140 + i * 260} 716 q20 -20 40 0 q20 20 46 -6`} stroke="#1f2a55" strokeWidth={5} fill="none" strokeDasharray={120} strokeDashoffset={120 - 120 * sobe(t % 3, 0.3, 1.6)} />
          {bloqueio > 0 && (
            <g transform={`translate(${190 + i * 260} 470)`} opacity={sobe(bloqueio, i * 0.2, i * 0.2 + 0.25)}>
              <rect x={-52} y={-10} width={104} height={84} rx={12} fill="#e0352a" stroke="#14161c" strokeWidth={6} />
              <path d="M-30 -10 L-30 -40 A30 30 0 0 1 30 -40 L30 -10" stroke="#14161c" strokeWidth={14} fill="none" />
            </g>
          )}
        </g>
      ))}
      <rect x={30} y={30} width={840} height={90} fill="#14161c" opacity={0.75} />
      <text x={50} y={92} fontFamily={FONT} fontSize={50} fill="#fff">{bloqueio > 0 ? "ETAPA 2 · BLOQUEIO DE MEMÓRIA" : "ETAPA 1 · TERMO DE CONSENTIMENTO"}</text>
      <circle cx={830} cy={170} r={16} fill="#e0352a" opacity={Math.sin(t * 6) > 0 ? 1 : 0.2} /><text x={800} y={186} textAnchor="end" fontFamily={FONT} fontSize={40} fill="#14161c">REC · ANO 1</text>
      {Array.from({ length: 5 }, (_, i) => <rect key={i} x={30} y={((t * 240 + i * 180) % 800) + 30} width={840} height={6} fill="#fff" opacity={0.15} />)}
    </svg>
  </AbsoluteFill>
);

const Contrato = ({ t, p }: { t: number; p: number }) => {
  const tira = sobe(p, 0.35, 0.75);
  return (
    <AbsoluteFill style={{ alignItems: "center", background: "rgba(4,6,10,0.55)" }}>
      <div style={{ marginTop: 250, width: 800, height: 900, background: "#fffaf0", border: "6px solid #14161c", boxSizing: "border-box", padding: "40px 50px", fontFamily: FONT, color: "#14161c", transform: "rotate(-2deg)", position: "relative" }}>
        <div style={{ fontSize: 66, letterSpacing: 4, textAlign: "center" }}>CONTRATO DO PARTICIPANTE</div>
        {[0.9, 0.75, 0.85, 0.6].map((w, i) => <div key={i} style={{ height: 22, width: `${w * 100}%`, background: "#b9b2a6", marginTop: 24 }} />)}
        <div style={{ marginTop: 44, padding: "22px 26px", border: "6px solid #e0352a", position: "relative", background: tira > 0.9 ? "#fff3b0" : "transparent" }}>
          <div style={{ fontSize: 50, color: "#e0352a" }}>CLÁUSULA 9</div>
          <div style={{ fontSize: 58, lineHeight: 1.15 }}>O PARTICIPANTE PODE SAIR A QUALQUER MOMENTO.</div>
          <div style={{ position: "absolute", left: -6, top: -6, bottom: -6, width: `${(1 - tira) * 102}%`, background: "#14161c", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", color: "#56636e", fontSize: 44, letterSpacing: 6 }}>{tira < 0.5 ? "OCULTADO PELA DIREÇÃO" : ""}</div>
        </div>
        {[0.8, 0.7, 0.9].map((w, i) => <div key={i} style={{ height: 22, width: `${w * 100}%`, background: "#b9b2a6", marginTop: 26 }} />)}
        <svg width={260} height={80} style={{ position: "absolute", right: 50, bottom: 50 }}><path d="M10 60 q30 -60 60 -10 q30 40 60 -20 q30 -30 110 20" stroke="#1f2a55" strokeWidth={6} fill="none" /></svg>
        <div style={{ position: "absolute", left: 50, bottom: 60, fontSize: 34, opacity: 0.6 }}>{Math.sin(t) > 2 ? "" : "ASSINADO: BRUNO"}</div>
      </div>
    </AbsoluteFill>
  );
};

const sobre = ({ t, shot }: Contexto) => {
  if (shot.id.startsWith("rep")) return <Faixa texto={DIAS[Number(shot.id.slice(3))]} cor="#fff" tam={150} sub="08:15" />;
  switch (shot.id) {
    case "experiencia": return <Faixa texto={"REALIDADE\nCONTROLADA"} cor="#7ef0ff" tam={100} top={1500} />;
    case "aceitaram": return <Arquivo t={t} bloqueio={0} />;
    case "bloqueadas": return <Arquivo t={t} bloqueio={dentro(t, "bloqueadas")} />;
    case "contrato": return <Contrato t={t} p={dentro(t, "contrato")} />;
    default: return null;
  }
};

const fx = ({ t }: Contexto) => ({
  impacto: Math.max(decai(t, T_SOME, 0.5), decai(t, T_GLITCH, 0.8), decai(t, P.toca.de, 0.3), decai(t, P.bloqueia.de, 0.6)),
  flash: Math.max(decai(t, T_SOME, 0.4), decai(t, T_GLITCH, 0.3), decai(t, P.le.de, 0.4)),
  clarao: Math.max(
    ...repeticoes.map((r) => decai(t, r.de, 0.18) * 0.9),
    decai(t, P.observam.de, 0.3) * 0.5, decai(t, P.aceitaram.de, 0.3) * 0.6,
    sobe(t, P.ultima.ate - 0.7, P.ultima.ate) * (t < P.ultima.ate ? 1 : 0), decai(t, P.real.de, 0.8),
  ),
  claraoCor: "#ffffff",
});

export const Mentira = () => (
  <Episodio
    manifesto={manifesto} shots={SHOTS} blocos={BLOCOS} preto={PRETO} elenco={ELENCO} vinheta={0.5}
    cenario={cenario} sobre={sobre} itens={itens} fx={fx}
    corLegenda={() => "#ffffff"}
    final={() => (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", color: "#e8e4dc", fontFamily: FONT, fontSize: 90, letterSpacing: 10 }}>FIM</AbsoluteFill>
    )}
    sons={
      <>
        <Som fps={FPS} em={0} src="trem/sfx/musica.mp3" volume={0.3} dur={manifesto.duracao} some={1.6} />
        <Som fps={FPS} em={0} src="mare01/sfx/aves.mp3" volume={0.5} />
        {repeticoes.map((r) => <Som key={r.id} fps={FPS} em={r.de} src="cidade/sfx/rebobina.mp3" volume={0.6} />)}
        <Som fps={FPS} em={T_SOME} src="futuro/sfx/dissolve.mp3" volume={0.7} dur={2} some={0.5} />
        <Som fps={FPS} em={T_GLITCH} src="futuro/sfx/glitch.mp3" volume={0.8} dur={P.parede.de - T_GLITCH} some={0.4} />
        <Som fps={FPS} em={T_GLITCH} src="ep01/sfx/estatica.mp3" volume={0.6} />
        <Som fps={FPS} em={P.parede.de} src="mare01/sfx/vento.mp3" volume={0.4} dur={P.corredor.de - P.parede.de} some={0.4} />
        <Som fps={FPS} em={P.toca.de + 0.2} src="ep01/sfx/batida.mp3" volume={0.6} />
        <Som fps={FPS} em={T_ABRE} src="cidade/sfx/porta.mp3" volume={0.8} />
        <Som fps={FPS} em={P.corredor.de} src="cidade/sfx/lampadas.mp3" volume={0.5} dur={P.observam.de - P.corredor.de} some={0.3} />
        <Som fps={FPS} em={P.observam.de} src="tempo/sfx/central.mp3" volume={0.45} dur={P.contrato.de - P.observam.de} some={0.6} />
        <Som fps={FPS} em={P.aceitaram.de} src="tempo/sfx/cameras.mp3" volume={0.5} />
        <Som fps={FPS} em={P.bloqueadas.de + 0.4} src="tempo/sfx/apaga.mp3" volume={0.6} dur={3} some={0.5} />
        <Som fps={FPS} em={P.contrato.de + 1.2} src="trem/sfx/caneta.mp3" volume={0.7} />
        <Som fps={FPS} em={P.bloqueia.de} src="tempo/sfx/alarmes.mp3" volume={0.4} dur={P.le.de - P.bloqueia.de} some={0.4} />
        <Som fps={FPS} em={P.le.de} src="ep01/sfx/estatica.mp3" volume={0.5} />
        <Som fps={FPS} em={P.casas.de} src="trem/sfx/brilho.mp3" volume={0.6} />
        <Som fps={FPS} em={P.ultima.de} src="mare02/sfx/porta.mp3" volume={0.7} />
        <Som fps={FPS} em={P.real.de} src="tempo/sfx/cidade.mp3" volume={0.5} dur={PRETO - P.real.de} some={1.5} />
        <Som fps={FPS} em={P.real.de} src="mare01/sfx/vento.mp3" volume={0.35} dur={9} some={2} />
      </>
    }
  />
);

export const MENTIRA_DURACAO = Math.round(manifesto.duracao * FPS);
export const MENTIRA_FPS = FPS;
