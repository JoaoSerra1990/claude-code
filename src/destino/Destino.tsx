import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import manifestoJson from "./manifest.json";
import { FONT } from "../theme";
import { Ator, type Visual } from "../serie/Ator";
import {
  Episodio, Som, decai, est as e, sobe, tempos,
  type Bloco, type Contexto, type Manifesto, type Shot,
} from "../serie/motor";
import { Vagao } from "../oito/cenarios";
import { CadernoFechado, Cafezinho, Calcada, MESA, Mercado, Ponte } from "./cenarios";

// Os Homens do Destino — curta narrado.

const manifesto = manifestoJson as Manifesto;
const FPS = manifesto.fps;
const PRETO = manifestoJson.preto;
const { fim, pal } = tempos(manifesto);

const RAFAEL: Visual = { pele: "#c68a5e", cabelo: "#17110e", roupa: "#e0572a", calca: "#2a2f3a", estilo: "cacheado", mochila: "#2a9d8f" };
const H1: Visual = { pele: "#f1cbb0", cabelo: "#17110e", roupa: "#1c1f26", casaco: true, calca: "#1c1f26", estilo: "curto", gravata: true, oculos: true };
const H2: Visual = { pele: "#d9a074", cabelo: "#9a9da4", roupa: "#23262f", casaco: true, calca: "#23262f", estilo: "grisalho", gravata: true };
const ESTRANHO: Visual = { pele: "#e2b08a", cabelo: "#4a3a2e", roupa: "#b9a88a", casaco: true, calca: "#3a3f4d", estilo: "curto", chapeu: "#4a3a2e", mochila: "#3a2a22" };
const ELENCO: Record<string, Visual> = { Rafael: RAFAEL, Homem1: H1, Homem2: H2, Estranho: ESTRANHO };

const BLOCOS: Record<string, Bloco> = {
  cafe: { Rafael: e(440, 1830, 0.66, "sereno", [-0.5, 0.6]), Estranho: e(900, 1880, 0.62, "neutro", [-1, 0]) },
  esquina: { Rafael: e(540, 1840, 0.66, "desconfiado", [1, 0.7]) },
  vitrine: { Rafael: e(380, 1840, 0.7, "medo", [1, -0.2]) },
  mercado: { Homem2: e(120, 1840, 0.54, "firme", [1, 0]), Homem1: e(290, 1860, 0.56, "firme", [1, 0]), Rafael: e(700, 1850, 0.56, "panico", [1, 0]) },
  metro: { Rafael: e(420, 1810, 0.68, "medo", [0.3, 0.8]) },
  cerco: { Homem2: e(170, 1810, 0.68, "firme", [1, 0]), Rafael: e(540, 1800, 0.66, "medo", [1, 0], "recuar"), Homem1: e(880, 1810, 0.68, "firme", [-1, 0]) },
  margem: { Rafael: e(300, 1860, 0.5, "firme", [0.6, -0.7], "apontarCima"), Homem1: e(720, 1860, 0.5, "bravo", [-1, 0]), Homem2: e(900, 1870, 0.5, "bravo", [-1, 0]) },
  final: { Rafael: e(540, 1840, 0.66, "feliz", [0, 0.7]) },
};
const R = (b: string, n: string): [number, number] => [BLOCOS[b][n].x, BLOCOS[b][n].y - 690 * BLOCOS[b][n].s];
const R_CAFE = R("cafe", "Rafael"), R_VIT = R("vitrine", "Rafael"), R_METRO = R("metro", "Rafael"), R_CERCO = R("cerco", "Rafael"), R_H1 = R("cerco", "Homem1"), R_FIM = R("final", "Rafael");

const T_CAI = pal("01", "até") + 1.6;

const SHOTS: Shot[] = [
  // 00–12 s | A previsão
  { id: "cai", de: 0, ate: pal("01", "na") - 0.1, fundo: "calcada", bloco: "cafe", luz: "dia",
    cam: [[640, 1500, 1.4], [600, 1650, 1.9]], at: { Estranho: { x: 1250, xPara: 500 } } },
  { id: "pagina", de: pal("01", "na") - 0.1, ate: pal("01", "rafael") - 0.1, fundo: "calcada", bloco: "cafe", luz: "dia",
    cam: [[R_CAFE[0], R_CAFE[1] + 100, 1.8], [R_CAFE[0], R_CAFE[1] + 100, 1.9]], at: { Estranho: { oculto: true }, Rafael: { olhar: [0, 0.9] } } },
  { id: "riu", de: pal("01", "rafael") - 0.1, ate: pal("01", "até") + 0.5, fundo: "calcada", bloco: "cafe", luz: "dia",
    cam: [[R_CAFE[0], R_CAFE[1], 2.4], [R_CAFE[0], R_CAFE[1], 2.7]], at: { Estranho: { oculto: true }, Rafael: { expr: "feliz", fechado: true } } },
  { id: "cafe", de: pal("01", "até") + 0.5, ate: fim("01") + 0.6, fundo: "calcada1004", bloco: "cafe", luz: "dia",
    cam: [[420, 1300, 1.3], [MESA[0] + 60, MESA[1] - 10, 2.6]], at: { Estranho: { oculto: true }, Rafael: { expr: "congelado", olhar: [-0.8, 0.8] } } },

  // 12–25 s | As páginas
  { id: "paginas", de: fim("01") + 0.6, ate: pal("02", "rafael") - 0.2, fundo: "calcada1004", bloco: "cafe", luz: "dia",
    cam: [[R_CAFE[0], R_CAFE[1] + 100, 1.9], [R_CAFE[0], R_CAFE[1] + 100, 2.0]], at: { Estranho: { oculto: true }, Rafael: { expr: "surpreso", olhar: [0, 0.9] } } },
  { id: "contrario", de: pal("02", "rafael") - 0.2, ate: pal("02", "imediatamente") - 0.2, fundo: "esquina", bloco: "esquina", luz: "dia",
    cam: [[620, 1500, 1.3], [440, 1450, 1.5]], at: { Rafael: { xPara: 200, expr: "firme", olhar: [-1, 0] } } },
  { id: "homens", de: pal("02", "imediatamente") - 0.2, ate: fim("02") + 0.5, fundo: "vitrine", bloco: "vitrine", luz: "dia",
    cam: [[R_VIT[0] + 60, R_VIT[1], 2.2], [760, 1200, 1.7]] },

  // 25–38 s | A perseguição
  { id: "mercado", de: fim("02") + 0.5, ate: pal("03", "entrou") - 0.2, fundo: "mercado", bloco: "mercado", luz: "dia", tremor: 7,
    cam: [[600, 1500, 1.5], [520, 1450, 1.3]], at: { Rafael: { x: 620, xPara: 820 }, Homem1: { x: 120, xPara: 360 }, Homem2: { x: -80, xPara: 160 } } },
  { id: "metro", de: pal("03", "entrou") - 0.2, ate: pal("03", "abriu") - 0.2, fundo: "metro", bloco: "metro", luz: "pisca", tremor: 5,
    cam: [[480, 1350, 1.4], [460, 1350, 1.6]], at: { Rafael: { x: -200, xPara: 420, expr: "panico", olhar: [1, 0] } } },
  { id: "ultima", de: pal("03", "abriu") - 0.2, ate: pal("03", "ali") - 0.2, fundo: "metro", bloco: "metro", luz: "dia",
    cam: [[R_METRO[0], R_METRO[1] + 140, 1.9], [R_METRO[0], R_METRO[1] + 160, 2.3]] },
  { id: "ponte11", de: pal("03", "ali") - 0.2, ate: fim("03") + 0.6, fundo: "metro", bloco: "metro", luz: "dia",
    cam: [[R_METRO[0], R_METRO[1] + 160, 2.3], [R_METRO[0], R_METRO[1] + 160, 2.4]], at: { Rafael: { expr: "congelado" } } },

  // 38–52 s | A regra
  { id: "alcancam", de: fim("03") + 0.6, ate: pal("04", "disseram") - 0.2, fundo: "metro", bloco: "cerco", luz: "dia", tremor: 3,
    cam: [[540, 1350, 1.2], [540, 1330, 1.35]], at: { Homem1: { x: 1280, xPara: 880 }, Homem2: { x: -200, xPara: 170 } } },
  { id: "ordem", de: pal("04", "disseram") - 0.2, ate: pal("04", "se") - 0.2, fundo: "metro", bloco: "cerco", luz: "dia",
    cam: [[R_H1[0] - 40, R_H1[1], 2.1], [R_H1[0] - 40, R_H1[1], 2.5]], at: { Homem1: { pose: "apontarEsq" } } },
  { id: "mapa", de: pal("04", "se") - 0.2, ate: fim("04") + 0.6, fundo: "metro", bloco: "cerco", luz: "dia",
    cam: [[540, 1330, 1.35], [540, 1330, 1.4]] },

  // 52–65 s | A escolha
  { id: "percebe", de: fim("04") + 0.6, ate: pal("05", "mas") - 0.2, fundo: "metro", bloco: "cerco", luz: "dia",
    cam: [[R_CERCO[0], R_CERCO[1], 2.2], [R_CERCO[0], R_CERCO[1], 2.8]], at: { Rafael: { expr: "desconfiado", pose: "parado", olhar: [1, 0] } } },
  { id: "funcionarios", de: pal("05", "mas") - 0.2, ate: pal("05", "preferia") - 0.2, fundo: "metro", bloco: "cerco", luz: "dia",
    cam: [[540, 1330, 1.35], [540, 1330, 1.4]], at: { Rafael: { pose: "parado", expr: "desconfiado" } } },
  { id: "sistema", de: pal("05", "preferia") - 0.2, ate: pal("05", "mudanças") - 0.3, fundo: "metro", bloco: "cerco", luz: "dia",
    cam: [[540, 1330, 1.4], [540, 1330, 1.45]], at: { Rafael: { pose: "parado", expr: "bravo" } } },
  { id: "decide", de: pal("05", "mudanças") - 0.3, ate: fim("05") + 0.6, fundo: "metro", bloco: "cerco", luz: "dia",
    cam: [[R_CERCO[0], R_CERCO[1], 2.4], [R_CERCO[0], R_CERCO[1], 3.0]], at: { Rafael: { expr: "bravo", pose: "parado", olhar: [0, 0] } } },

  // 65–78 s | A ruptura
  { id: "transmite", de: fim("05") + 0.6, ate: pal("06", "para") - 0.1, fundo: "ponte", bloco: "margem", luz: "dia",
    cam: [[340, 1560, 2.1], [340, 1540, 2.3]], at: { Homem1: { x: 1300, xPara: 720 }, Homem2: { x: 1500, xPara: 900 } } },
  { id: "alerta", de: pal("06", "para") - 0.1, ate: pal("06", "centenas") - 0.2, fundo: "ponteAlerta", bloco: "margem", luz: "dia",
    cam: [[540, 1100, 1.5], [540, 1080, 1.8]] },
  { id: "evacuam", de: pal("06", "centenas") - 0.2, ate: pal("06", "quando") - 0.2, fundo: "ponteFoge", bloco: "margem", luz: "dia", tremor: 3,
    cam: [[540, 1080, 1.8], [540, 1150, 1.2]] },
  { id: "desaba", de: pal("06", "quando") - 0.2, ate: fim("06") + 0.9, fundo: "ponteCai", bloco: "margem", luz: "dia", tremor: 8,
    cam: [[540, 1200, 1.3], [540, 1250, 1.0]], at: { Rafael: { pose: "parado", expr: "surpreso", olhar: [0.6, -0.4] }, Homem1: { expr: "congelado" }, Homem2: { expr: "congelado" } } },

  // 78–90 s | O novo capítulo
  { id: "somem", de: fim("06") + 0.9, ate: pal("07", "no") - 0.2, fundo: "ponteCaida", bloco: "margem", luz: "dia",
    cam: [[640, 1550, 1.7], [760, 1560, 2.0]],
    at: { Rafael: { pose: "parado", expr: "firme", olhar: [1, 0] }, Homem1: { expr: "congelado", dissolve: 0, dissolvePara: 1 }, Homem2: { expr: "congelado", dissolve: 0, dissolvePara: 1 } } },
  { id: "branco", de: pal("07", "no") - 0.2, ate: pal("07", "rafael") - 0.2, fundo: "calcadaSol", bloco: "final", luz: "dia",
    cam: [[R_FIM[0], R_FIM[1] + 100, 1.9], [R_FIM[0], R_FIM[1] + 100, 2.0]], at: { Rafael: { expr: "surpreso" } } },
  { id: "escreve", de: pal("07", "rafael") - 0.2, ate: pal("07", "novo") + 0.9, fundo: "calcadaSol", bloco: "final", luz: "dia",
    cam: [[R_FIM[0], R_FIM[1] + 100, 2.0], [R_FIM[0], R_FIM[1] + 100, 2.1]] },
  { id: "sol", de: pal("07", "novo") + 0.9, ate: PRETO, fundo: "calcadaSol", bloco: "final", luz: "dourada",
    cam: [[R_FIM[0], R_FIM[1], 2.2], [540, 1000, 1.0]], at: { Rafael: { olhar: [0, -0.6], yPara: 1620, sPara: 0.4 } } },
];

const P = Object.fromEntries(SHOTS.map((s) => [s.id, s]));
const dentro = (t: number, id: string) => sobe(t, P[id].de, P[id].ate);
const T_SOLTA = 1.0;
const T_QUEDA = P.desaba.de + 0.5;

const cenario = ({ t, shot }: Contexto) => {
  switch (shot.fundo) {
    case "calcada": return <Calcada t={t} relogio="10:03" />;
    case "calcada1004": return <Calcada t={t} relogio="10:04" />;
    case "esquina": return <Calcada t={t} relogio="10:12" seta />;
    case "vitrine": return <Calcada t={t} relogio="10:12" reflexo={sobe(t, P.homens.de + 0.6, P.homens.de + 1.4)} homens={[H1, H2]} />;
    case "calcadaSol": return <Calcada t={t} relogio="11:05" sol={1} />;
    case "mercado": return <Mercado t={t} rola={dentro(t, "mercado") * 900} />;
    case "metro": return <Vagao t={t} relogio={shot.id === "metro" || shot.id === "ultima" || shot.id === "ponte11" ? "10:41" : "10:52"} banco="#5c9a4f" passageiros={false} vel={shot.id === "metro" ? 1.5 : 1} />;
    case "ponte": return <Ponte t={t} />;
    case "ponteAlerta": return <Ponte t={t} alerta={sobe(t, P.alerta.de, P.alerta.de + 0.5)} />;
    case "ponteFoge": return <Ponte t={t} alerta={1} gente={1 - dentro(t, "evacuam")} />;
    case "ponteCai": return <Ponte t={t} gente={0} cai={sobe(t, T_QUEDA, T_QUEDA + 1.6)} />;
    default: return <Ponte t={t} gente={0} cai={1} />;
  }
};

const itens = ({ t, shot }: Contexto) => {
  const item = (el: ReactNode) => [{ y: 2000, el }];
  switch (shot.id) {
    case "cai": {
      const q = sobe(t, T_SOLTA, T_SOLTA + 0.6);
      return item(
        <g key="c">
          <g transform={`translate(${MESA[0]} ${MESA[1] - 4})`}><Cafezinho /></g>
          {t > T_SOLTA && <g transform={`translate(${700 - q * 40} ${1500 + q * q * 330}) rotate(${q * 200})`}><CadernoFechado /></g>}
        </g>,
      );
    }
    case "pagina": case "riu": return item(<g key="c" transform={`translate(${MESA[0]} ${MESA[1] - 4})`}><Cafezinho /></g>);
    case "cafe": case "paginas": return item(<g key="c" transform={`translate(${MESA[0]} ${MESA[1] - 4})`}><Cafezinho tomba={sobe(t, T_CAI, T_CAI + 0.5)} /></g>);
    case "ultima": return item(<g key="n" transform={`translate(${R_METRO[0] + 10} ${R_METRO[1] + 250}) scale(1.2)`}><CadernoFechado /></g>);
    case "transmite": case "alerta": return item(
      <g key="t" transform={`translate(${BLOCOS.margem.Rafael.x + 6} ${BLOCOS.margem.Rafael.y - 0.5 * 760})`}>
        <rect x={-18} y={-30} width={36} height={60} rx={6} fill="#14181e" stroke="#ff5a4a" strokeWidth={4} />
        {[0, 1, 2].map((i) => <circle key={i} r={30 + ((t * 170 + i * 80) % 240)} fill="none" stroke="#ff5a4a" strokeWidth={6} opacity={0.7 - ((t * 170 + i * 80) % 240) / 350} />)}
      </g>,
    );
    default: return [];
  }
};

// ---------- sobreposições ----------
const MAO = "'DejaVu Serif', Georgia, serif";
const Caderno = ({ linhas, p, apaga = 0, titulo, children }: { linhas: string[]; p: number; apaga?: number; titulo?: string; children?: ReactNode }) => {
  const total = linhas.join("").length;
  let visto = Math.floor(p * total);
  return (
    <AbsoluteFill style={{ alignItems: "center", background: "rgba(8,10,16,0.5)" }}>
      <div style={{ marginTop: 250, width: 800, height: 880, background: "#fbf6e6", border: "8px solid #1c2a3a", borderLeft: "44px solid #b3402e", boxSizing: "border-box", padding: "40px 46px", color: "#1f2a55", position: "relative", transform: "rotate(-2deg)", boxShadow: "0 30px 80px rgba(0,0,0,0.5)", backgroundImage: "repeating-linear-gradient(#fbf6e6 0 105px, #b9c7dc 105px 108px)" }}>
        {titulo && <div style={{ fontFamily: FONT, fontSize: 44, color: "#b3402e", letterSpacing: 4, marginBottom: 12 }}>{titulo}</div>}
        {linhas.map((l, i) => {
          const mostra = Math.max(0, Math.min(l.length, visto));
          visto -= l.length;
          return <div key={i} style={{ fontFamily: MAO, fontStyle: "italic", fontWeight: 700, fontSize: 84, lineHeight: "108px", opacity: 1 - apaga, minHeight: 108, whiteSpace: "nowrap" }}>{l.slice(0, mostra)}</div>;
        })}
        {children}
      </div>
    </AbsoluteFill>
  );
};

const Probabilidades = ({ t, p }: { t: number; p: number }) => (
  <AbsoluteFill style={{ alignItems: "center" }}>
    <div style={{ marginTop: 240, width: 900, boxSizing: "border-box", padding: "26px 34px", background: "rgba(10,12,20,0.94)", border: "5px solid #8e99a3", borderRadius: 14, color: "#e8e4dc", fontFamily: FONT }}>
      <div style={{ fontSize: 42, letterSpacing: 4, color: "#8e99a3" }}>MAPA DE PROBABILIDADES</div>
      <svg width={830} height={560} viewBox="0 0 830 560">
        {Array.from({ length: 7 }, (_, i) => {
          const y = 60 + i * 72, central = i === 3;
          return (
            <g key={i} opacity={central ? 1 : 0.25 + 0.75 * sobe(p, 0.45, 0.7)}>
              <path d={`M60 280 C260 280 300 ${y} 520 ${y} L720 ${y}`} stroke={central ? "#ff5a4a" : "#5cc8ff"} strokeWidth={central ? 12 : 5} fill="none" strokeDasharray={central ? undefined : "14 12"} strokeDashoffset={-t * 40} />
              {central ? <text x={740} y={y + 14} fontFamily={FONT} fontSize={40} fill="#ff5a4a">11:00</text> : <text x={740} y={y + 12} fontFamily={FONT} fontSize={34} fill="#5cc8ff">?</text>}
            </g>
          );
        })}
        <circle cx={60} cy={280} r={22} fill="#fff" /><text x={60} y={340} textAnchor="middle" fontFamily={FONT} fontSize={30} fill="#fff">AGORA</text>
        <g transform="translate(560 244)"><path d="M-60 20 L60 20 M-50 20 Q0 -40 50 20 M-36 20 L-36 44 M36 20 L36 44" stroke="#ff5a4a" strokeWidth={7} fill="none" /></g>
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 50, marginTop: 4 }}>
        <span style={{ color: "#ff5a4a" }}>A PONTE CAI: ORDEM</span>
        <span style={{ color: "#5cc8ff", opacity: sobe(p, 0.45, 0.6) }}>O RESTO: IMPREVISÍVEL</span>
      </div>
    </div>
  </AbsoluteFill>
);

const Crachas = ({ t }: { t: number }) => (
  <AbsoluteFill style={{ alignItems: "center", fontFamily: FONT }}>
    <div style={{ marginTop: 250, display: "flex", gap: 30 }}>
      {[H1, H2].map((v, i) => (
        <div key={i} style={{ width: 400, padding: "22px 24px", background: "#f4f7f8", border: "6px solid #14181e", borderRadius: 18, color: "#14181e", textAlign: "center", transform: `rotate(${i ? 3 : -3}deg)`, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
          <div style={{ fontSize: 34, letterSpacing: 3, color: "#56636e" }}>SISTEMA DE PREVISÃO</div>
          <svg width={220} height={250} viewBox="0 0 360 414" style={{ background: "#cfd6dc", marginTop: 8 }}><g transform="translate(180 800) scale(0.92)"><Ator v={v} t={t} expr="firme" fase={i} /></g></svg>
          <div style={{ fontSize: 60, lineHeight: 1.05 }}>FUNCIONÁRIO</div>
          <div style={{ fontSize: 40, color: "#b3402e" }}>Nº 0{417 + i * 388}</div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);

const Sistema = ({ t, p }: { t: number; p: number }) => (
  <AbsoluteFill style={{ alignItems: "center" }}>
    <div style={{ marginTop: 240, width: 900, boxSizing: "border-box", padding: "30px 38px", background: "rgba(10,12,20,0.94)", border: "5px solid #ff5a4a", borderRadius: 14, color: "#e8e4dc", fontFamily: FONT }}>
      <div style={{ fontSize: 42, letterSpacing: 4, color: "#8e99a3" }}>SIMULAÇÕES DO SISTEMA</div>
      {[["TRAGÉDIA PREVISÍVEL", "APROVADA", "#ff5a4a"], ["MUDANÇA INESPERADA", "BLOQUEADA", "#56636e"]].map(([a, b, c], i) => (
        <div key={i} style={{ marginTop: 26, opacity: p > i * 0.4 ? 1 : 0.1 }}>
          <div style={{ fontSize: 64 }}>{a}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ flex: 1, height: 40, background: "#1c2026", borderRadius: 10, overflow: "hidden" }}><div style={{ width: `${i ? 6 : 96}%`, height: "100%", background: c }} /></div>
            <div style={{ fontSize: 54, color: i ? "#8e99a3" : "#ff5a4a", opacity: i || Math.sin(t * 9) > -0.4 ? 1 : 0.5 }}>{b}</div>
          </div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);

const Grande = ({ texto, cor = "#ff5a4a", tam = 200 }: { texto: string; cor?: string; tam?: number }) => (
  <AbsoluteFill style={{ alignItems: "center", fontFamily: FONT }}>
    <div style={{ marginTop: 230, fontSize: tam, color: cor, letterSpacing: 8, lineHeight: 1, textShadow: `0 8px 0 #14161c, 0 0 60px ${cor}` }}>{texto}</div>
  </AbsoluteFill>
);

const sobre = ({ t, shot }: Contexto) => {
  switch (shot.id) {
    case "pagina": return <Caderno titulo="PÁGINA 1" linhas={["Às 10:04,", "você derrubará", "seu café."]} p={sobe(t, pal("01", "às") - 0.2, pal("01", "café") + 0.4)} />;
    case "paginas": return (
      <Caderno titulo={`PÁGINA ${2 + Math.floor(dentro(t, "paginas") * 5)}`} linhas={["10:12 vire à direita.", "10:15 a esquina.", "10:21 o sinal fecha.", "10:30 o mercado.", "10:41 o metrô."]} p={sobe(t, P.paginas.de, P.paginas.ate - 0.5)} />
    );
    case "ponte11": return (
      <Caderno titulo="ÚLTIMA PÁGINA" linhas={["Às 11:00,", "a ponte desaba."]} p={sobe(t, P.ponte11.de, pal("03", "onze"))}>
        <svg width={600} height={300} viewBox="0 0 600 300" style={{ marginTop: 60 }}>
          <path d="M20 200 L580 200 M120 200 L120 60 M480 200 L480 60 M120 60 Q300 260 480 60 M20 130 Q70 80 120 60 M480 60 Q530 80 580 130" stroke="#1f2a55" strokeWidth={8} fill="none" />
          <path d="M270 170 L300 230 L330 170 M250 200 L350 200" stroke="#b3402e" strokeWidth={9} fill="none" />
        </svg>
      </Caderno>
    );
    case "mapa": return <Probabilidades t={t} p={dentro(t, "mapa")} />;
    case "funcionarios": return <Crachas t={t} />;
    case "sistema": return <Sistema t={t} p={dentro(t, "sistema")} />;
    case "desaba": return t > T_QUEDA - 0.3 ? <Grande texto="11:00" /> : null;
    case "branco": return <Caderno titulo="" linhas={["Às 11:00,", "a ponte desaba."]} p={1} apaga={sobe(t, P.branco.de + 0.8, P.branco.ate - 0.6)} />;
    case "escreve": return <Caderno titulo="PÁGINA 1" linhas={["Amanhã,", "vou escolher", "de novo."]} p={sobe(t, pal("07", "amanhã") - 0.2, pal("07", "novo") + 0.4)} />;
    default: return null;
  }
};

const fx = ({ t }: Contexto) => ({
  impacto: Math.max(decai(t, T_CAI + 0.3, 0.4) * 0.6, decai(t, P.homens.de + 0.8, 0.5), decai(t, T_QUEDA, 1.6)),
  flash: Math.max(decai(t, P.ponte11.de + 1.2, 0.4), decai(t, P.decide.de, 0.4)),
  clarao: Math.max(decai(t, P.branco.de, 0.6) * 0.7, decai(t, P.transmite.de, 0.4) * 0.5),
  claraoCor: "#fffbe6",
});

export const Destino = () => (
  <Episodio
    manifesto={manifesto} shots={SHOTS} blocos={BLOCOS} preto={PRETO} elenco={ELENCO} vinheta={0.5}
    cenario={cenario} sobre={sobre} itens={itens} fx={fx}
    corLegenda={() => "#ffffff"}
    final={() => (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", color: "#e8e4dc", fontFamily: FONT, fontSize: 90, letterSpacing: 10 }}>FIM</AbsoluteFill>
    )}
    sons={
      <>
        <Som fps={FPS} em={0} src="destino/sfx/musica.mp3" volume={0.3} dur={manifesto.duracao} some={1.8} />
        <Som fps={FPS} em={0} src="tempo/sfx/cidade.mp3" volume={0.35} dur={P.mercado.de} some={0.5} />
        <Som fps={FPS} em={T_SOLTA + 0.5} src="ep01/sfx/batida.mp3" volume={0.5} />
        <Som fps={FPS} em={P.pagina.de} src="trem/sfx/caneta.mp3" volume={0.6} />
        <Som fps={FPS} em={P.cafe.de} src="minutos/sfx/tique.mp3" volume={0.7} dur={T_CAI - P.cafe.de} />
        <Som fps={FPS} em={T_CAI + 0.3} src="mare02/sfx/vidros.mp3" volume={0.5} dur={1.4} some={0.4} />
        <Som fps={FPS} em={P.paginas.de} src="cidade/sfx/rebobina.mp3" volume={0.5} />
        <Som fps={FPS} em={P.homens.de + 0.8} src="ep01/sfx/impacto.mp3" volume={0.6} />
        <Som fps={FPS} em={P.mercado.de} src="mare01/sfx/gritos.mp3" volume={0.25} dur={P.metro.de - P.mercado.de} some={0.3} />
        <Som fps={FPS} em={P.metro.de} src="trem/sfx/trilhos.mp3" volume={0.4} dur={P.transmite.de - P.metro.de} some={0.6} />
        <Som fps={FPS} em={P.metro.de} src="trem/sfx/porta.mp3" volume={0.7} />
        <Som fps={FPS} em={P.ponte11.de + 1.2} src="ep01/sfx/impacto.mp3" volume={0.6} />
        <Som fps={FPS} em={P.alcancam.de + 0.4} src="trem/sfx/porta.mp3" volume={0.6} />
        <Som fps={FPS} em={P.mapa.de} src="futuro/sfx/bipes.mp3" volume={0.4} dur={3} some={0.4} />
        <Som fps={FPS} em={P.sistema.de} src="futuro/sfx/bipes.mp3" volume={0.4} dur={2.2} some={0.4} />
        <Som fps={FPS} em={P.transmite.de + 0.6} src="mare01/sfx/celular.mp3" volume={0.7} />
        <Som fps={FPS} em={P.alerta.de + 0.2} src="mare01/sfx/celular.mp3" volume={0.7} />
        <Som fps={FPS} em={P.alerta.de + 0.9} src="mare01/sfx/celular.mp3" volume={0.6} />
        <Som fps={FPS} em={P.evacuam.de} src="mare01/sfx/gritos.mp3" volume={0.35} dur={P.desaba.de - P.evacuam.de} some={0.4} />
        <Som fps={FPS} em={T_QUEDA} src="mare02/sfx/predio.mp3" volume={0.9} />
        <Som fps={FPS} em={T_QUEDA + 0.4} src="ep02/sfx/metal.mp3" volume={0.7} />
        <Som fps={FPS} em={P.somem.de + 0.5} src="futuro/sfx/dissolve.mp3" volume={0.6} dur={P.branco.de - P.somem.de - 0.3} some={0.4} />
        <Som fps={FPS} em={P.branco.de + 0.8} src="tempo/sfx/apaga.mp3" volume={0.5} dur={2} some={0.5} />
        <Som fps={FPS} em={pal("07", "amanhã") - 0.2} src="trem/sfx/caneta.mp3" volume={0.7} />
        <Som fps={FPS} em={pal("07", "vou") - 0.1} src="trem/sfx/caneta.mp3" volume={0.7} />
        <Som fps={FPS} em={P.sol.de} src="mare01/sfx/aves.mp3" volume={0.5} />
      </>
    }
  />
);

export const DESTINO_DURACAO = Math.round(manifesto.duracao * FPS);
export const DESTINO_FPS = FPS;
