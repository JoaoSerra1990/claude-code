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
import { Base, Bolo, Cabine, Festa, Holograma, LabOrbital, Orbita, Planeta } from "./cenarios";

// Dez Minutos de Eternidade — curta narrado, com duas falas de personagem.

const manifesto = manifestoJson as Manifesto;
const FPS = manifesto.fps;
const PRETO = manifestoJson.preto;
const { fim, pal, ini } = tempos(manifesto);

const ELISA: Visual = { pele: "#d9a074", cabelo: "#2e211b", roupa: "#e8eef2", detalhe: "#e0572a", calca: "#cfd6dc", estilo: "coque" };
const BASE_F = { pele: "#d9a074", calca: "#3a4a63" };
const MENINA: Visual = { ...BASE_F, cabelo: "#2e211b", roupa: "#f0c94a", estilo: "rabo" };
const MOCA: Visual = { ...BASE_F, cabelo: "#2e211b", roupa: "#2a9d8f", estilo: "longo" };
const ADULTA: Visual = { ...BASE_F, cabelo: "#2e211b", roupa: "#f4f7f8", casaco: true, estilo: "longo", oculos: true };
const IDOSA: Visual = { ...BASE_F, cabelo: "#c9ccd2", roupa: "#8a6fb0", estilo: "coque", oculos: true, sobrancelha: "#8a8d94" };
const ELENCO: Record<string, Visual> = {
  Elisa: ELISA, Menina: MENINA,
  Bisneta: { ...BASE_F, cabelo: "#2e211b", roupa: "#e0572a", estilo: "cacheado" },
  Neto: { ...cidadao(2), pele: "#d9a074", roupa: "#3d6fa3", barbaCor: "#8a8d94" }, Neta: { ...cidadao(5), pele: "#c99670", roupa: "#5c9a4f" },
  Primo: { ...cidadao(8), roupa: "#e9b730" }, Prima: { ...cidadao(1), roupa: "#7a4fa3", estilo: "rabo" },
};

const BLOCOS: Record<string, Bloco> = {
  despedida: { Elisa: e(430, 1830, 0.7, "triste", [0.6, 0.6], "abracar"), Menina: e(640, 1840, 0.42, "triste", [-0.7, -0.7], "abracar") },
  planeta: { Elisa: e(340, 1850, 0.6, "firme", [0.5, 0.7]) },
  cabine: { Elisa: e(540, 1810, 0.7, "medo", [0, -0.7]) },
  lab: { Elisa: e(300, 1810, 0.66, "surpreso", [1, 0]) },
  festa: {
    Primo: e(90, 1800, 0.56, "feliz", [1, 0]), Elisa: e(270, 1830, 0.62, "surpreso", [1, 0.2]), Bisneta: e(530, 1850, 0.44, "feliz", [-1, -0.6]),
    Neto: e(700, 1810, 0.6, "feliz", [-1, 0]), Prima: e(820, 1840, 0.5, "feliz", [-1, 0]), Neta: e(1020, 1810, 0.58, "feliz", [-1, 0]),
  },
};
const R = (b: string, n: string): [number, number] => [BLOCOS[b][n].x, BLOCOS[b][n].y - 690 * BLOCOS[b][n].s];
const R_CAB = R("cabine", "Elisa"), R_LAB = R("lab", "Elisa"), R_BIS = R("festa", "Bisneta"), R_FESTA = R("festa", "Elisa");
const HOLO: [number, number] = [660, 1800];

const SHOTS: Shot[] = [
  // 00–12 s | Dez minutos
  { id: "despedida", de: 0, ate: pal("01", "num") - 0.2, fundo: "base", bloco: "despedida", luz: "dourada",
    cam: [[540, 1450, 1.9], [540, 1300, 1.3]] },
  { id: "pouso", de: pal("01", "num") - 0.2, ate: pal("01", "ela") - 0.2, fundo: "planetaPouso", luz: "normal", tremor: 3,
    cam: [[640, 800, 1.0], [700, 1200, 1.3]] },
  { id: "promessa", de: pal("01", "ela") - 0.2, ate: fim("01") + 0.6, fundo: "planeta", bloco: "planeta", luz: "normal",
    cam: [[420, 1500, 1.7], [400, 1480, 2.1]] },

  // 12–25 s | O atraso
  { id: "tempestade", de: fim("01") + 0.6, ate: pal("02", "quando") - 0.2, fundo: "planetaTempestade", bloco: "planeta", luz: "normal", tremor: 7,
    cam: [[440, 1450, 1.4], [540, 1400, 1.5]], at: { Elisa: { x: 120, xPara: 560, expr: "medo", pose: "empurrar", olhar: [1, 0] } } },
  { id: "retorna", de: pal("02", "quando") - 0.2, ate: pal("02", "computador") - 0.3, fundo: "cabine", bloco: "cabine", luz: "noite",
    cam: [[540, 1300, 1.2], [540, 1250, 1.5]], at: { Elisa: { x: -200, xPara: 540, olhar: [1, 0] } } },
  { id: "tela", de: pal("02", "computador") - 0.3, ate: pal("02", "terra") - 0.3, fundo: "cabine", bloco: "cabine", luz: "noite",
    cam: [[540, 1250, 1.5], [540, 1250, 1.6]] },
  { id: "oitenta", de: pal("02", "terra") - 0.3, ate: fim("02") + 0.6, fundo: "cabine", bloco: "cabine", luz: "noite",
    cam: [[R_CAB[0], R_CAB[1], 2.2], [R_CAB[0], R_CAB[1], 2.9]], at: { Elisa: { expr: "congelado", olhar: [0, -0.4], lagrima: true } } },

  // 25–38 s | A mensagem
  { id: "mensagens", de: fim("02") + 0.6, ate: pal("03", "elisa") - 0.2, fundo: "cabine", bloco: "cabine", luz: "noite",
    cam: [[540, 1300, 1.5], [540, 1300, 1.55]], at: { Elisa: { expr: "triste" } } },
  { id: "montagem", de: pal("03", "elisa") - 0.2, ate: ini("04") - 0.4, fundo: "cabine", bloco: "cabine", luz: "noite",
    cam: [[540, 1300, 1.55], [540, 1300, 1.6]], at: { Elisa: { expr: "triste" } } },
  { id: "ultima", de: ini("04") - 0.4, ate: fim("04") + 0.3, fundo: "cabine", bloco: "cabine", luz: "noite",
    cam: [[540, 1300, 1.6], [540, 1300, 1.65]], at: { Elisa: { expr: "triste" } } },
  { id: "reage", de: fim("04") + 0.3, ate: pal("05", "elisa") - 0.4, fundo: "cabine", bloco: "cabine", luz: "noite",
    cam: [[R_CAB[0], R_CAB[1], 2.6], [R_CAB[0], R_CAB[1], 2.9]], at: { Elisa: { expr: "feliz", olhar: [0, -0.3], lagrima: true } } },

  // 38–52 s | A viagem
  { id: "viagem", de: pal("05", "elisa") - 0.4, ate: pal("05", "em") - 0.2, fundo: "orbita", luz: "normal",
    cam: [[400, 1300, 1.3], [540, 1000, 1.0]] },
  { id: "estacao", de: pal("05", "em") - 0.2, ate: fim("05") + 0.6, fundo: "orbita", luz: "normal",
    cam: [[540, 1000, 1.0], [560, 880, 1.5]] },

  // 52–65 s | O legado
  { id: "ia", de: fim("05") + 0.6, ate: pal("06", "ela") - 0.2, fundo: "lab", bloco: "lab", luz: "dia",
    cam: [[480, 1300, 1.2], [520, 1330, 1.5]], at: { Elisa: { x: -200, xPara: 300 } } },
  { id: "estudo", de: pal("06", "ela") - 0.2, ate: pal("06", "para") - 0.2, fundo: "lab", bloco: "lab", luz: "dia",
    cam: [[700, 1100, 1.5], [200, 1050, 1.7]] },
  { id: "sozinha", de: pal("06", "para") - 0.2, ate: fim("06") + 0.6, fundo: "lab", bloco: "lab", luz: "dia",
    cam: [[R_LAB[0] + 40, R_LAB[1], 2.2], [R_LAB[0] + 40, R_LAB[1], 2.8]], at: { Elisa: { expr: "triste", lagrima: true } } },

  // 65–78 s | O presente
  { id: "passado", de: fim("06") + 0.6, ate: pal("07", "mas") - 0.2, fundo: "lab", bloco: "lab", luz: "dia",
    cam: [[HOLO[0], HOLO[1] - 440, 2.0], [HOLO[0], HOLO[1] - 440, 2.4]] },
  { id: "arquivo", de: pal("07", "mas") - 0.2, ate: pal("07", "comunidade") - 0.4, fundo: "lab", bloco: "lab", luz: "dia",
    cam: [[480, 1330, 1.5], [480, 1330, 1.55]] },
  { id: "descendentes", de: pal("07", "comunidade") - 0.4, ate: fim("07") + 0.6, fundo: "lab", bloco: "lab", luz: "dia",
    cam: [[480, 1330, 1.55], [480, 1330, 1.6]] },

  // 78–90 s | O aniversário
  { id: "sala", de: fim("07") + 0.6, ate: pal("08", "sua") - 0.2, fundo: "festa", bloco: "festa", luz: "abajur",
    cam: [[540, 1100, 1.0], [420, 1350, 1.4]], at: { Elisa: { x: -200, xPara: 270 } } },
  { id: "bisneta", de: pal("08", "sua") - 0.2, ate: ini("09") - 0.3, fundo: "festa", bloco: "festa", luz: "abajur",
    cam: [[R_BIS[0], R_BIS[1] + 120, 1.9], [R_BIS[0], R_BIS[1] + 60, 2.4]] },
  { id: "fala", de: ini("09") - 0.3, ate: pal("09", "guardássemos") - 0.1, fundo: "festa", bloco: "festa", luz: "abajur",
    cam: [[R_BIS[0], R_BIS[1] + 40, 2.6], [R_BIS[0], R_BIS[1] + 40, 2.8]] },
  { id: "lugar", de: pal("09", "guardássemos") - 0.1, ate: ini("10") - 0.5, fundo: "festa", bloco: "festa", luz: "abajur",
    cam: [[700, 1450, 1.7], [900, 1400, 2.2]] },
  { id: "sopra", de: ini("10") - 0.5, ate: pal("10", "cercada") - 0.2, fundo: "festa", bloco: "festa", luz: "abajur",
    cam: [[400, 1500, 2.1], [410, 1500, 2.4]], at: { Elisa: { expr: "feliz", olhar: [1, 0.8], lagrima: true } } },
  { id: "familia", de: pal("10", "cercada") - 0.2, ate: PRETO, fundo: "festa", bloco: "festa", luz: "abajur",
    cam: [[R_FESTA[0] + 30, R_FESTA[1], 2.3], [540, 1150, 1.0]],
    at: { Elisa: { expr: "feliz", olhar: [0.6, 0], lagrima: true }, Primo: { pose: "apontarCima" }, Neta: { pose: "apontarCima" }, Neto: { pose: "abracar" } } },
];

const P = Object.fromEntries(SHOTS.map((s) => [s.id, s]));
const dentro = (t: number, id: string) => sobe(t, P[id].de, P[id].ate);
const T_SOPRO = pal("10", "soprou") + 0.4;
const T_ESTACAO = pal("05", "viu") - 0.1;

const cenario = ({ t, shot }: Contexto) => {
  switch (shot.fundo) {
    case "base": return <Base t={t} />;
    case "planetaPouso": return <Planeta t={t} pouso={sobe(t, P.pouso.de, P.pouso.ate - 0.5)} />;
    case "planeta": return <Planeta t={t} />;
    case "planetaTempestade": return <Planeta t={t} tempestade={sobe(t, P.tempestade.de, P.tempestade.de + 0.6)} />;
    case "cabine": return <Cabine t={t} vista={shot.id === "reage" ? "espaco" : "estrela"} />;
    case "orbita": return shot.id === "viagem" ? <Orbita t={t} chegada={dentro(t, "viagem") * 0.7} /> : <Orbita t={t} chegada={0.7 + 0.3 * dentro(t, "estacao")} estacao={sobe(t, T_ESTACAO, T_ESTACAO + 1.2)} />;
    case "lab": return <LabOrbital t={t} />;
    default: return <Festa t={t} />;
  }
};

const itens = ({ t, shot }: Contexto) => {
  const item = (el: ReactNode, y = 2000) => [{ y, el }];
  if (shot.id === "promessa") {
    return item(
      <g key="f" transform={`translate(${R("planeta", "Elisa")[0] + 140} ${R("planeta", "Elisa")[1] + 220}) rotate(6)`}>
        <rect x={-60} y={-76} width={120} height={152} rx={10} fill="#fffaf0" stroke="#14181e" strokeWidth={5} />
        <rect x={-50} y={-66} width={100} height={110} fill="#bfe3f5" /><g transform="translate(0 92) scale(0.2)"><Ator v={MENINA} t={t} expr="feliz" /></g>
      </g>,
    );
  }
  if (shot.fundo === "lab") {
    const aparece = shot.id === "ia" ? sobe(t, P.ia.de + 1.4, P.ia.de + 2.4) : 1;
    return [{
      y: HOLO[1] - 1, el: (
        <g key="h" transform={`translate(${HOLO[0]} ${HOLO[1]})`} opacity={aparece}>
          <Holograma t={t} v={IDOSA} expr={shot.id === "passado" ? "triste" : "sereno"} nega={shot.id === "passado"} pose={shot.id === "estudo" ? "apontarCima" : "parado"} />
        </g>
      ) as ReactNode,
    }];
  }
  if (shot.fundo === "festa") {
    return item(<g key="b" transform={`translate(${BLOCOS.festa.Bisneta.x - 14} ${BLOCOS.festa.Bisneta.y - 150}) scale(0.62)`}><Bolo t={t} acesa={t < T_SOPRO} /></g>);
  }
  return [];
};

// ---------- sobreposições ----------
const Painel = ({ children, cor = "#5cc8ff", top = 240 }: { children: ReactNode; cor?: string; top?: number }) => (
  <AbsoluteFill style={{ alignItems: "center" }}>
    <div style={{ marginTop: top, width: 900, boxSizing: "border-box", padding: "28px 38px", background: "rgba(8,12,26,0.93)", border: `5px solid ${cor}`, borderRadius: 16, boxShadow: `0 0 60px ${cor}55`, color: "#e8f6ff", fontFamily: FONT }}>
      {children}
    </div>
  </AbsoluteFill>
);
const Faixa = ({ texto, cor = "#5cc8ff", sub, tam = 150 }: { texto: string; cor?: string; sub?: string; tam?: number }) => (
  <AbsoluteFill style={{ alignItems: "center", fontFamily: FONT }}>
    {sub && <div style={{ marginTop: 220, fontSize: 56, color: "#fff", letterSpacing: 4, textShadow: "0 5px 0 #14161c" }}>{sub}</div>}
    <div style={{ marginTop: sub ? 0 : 230, fontSize: tam, color: cor, letterSpacing: 6, lineHeight: 1.05, textShadow: `0 7px 0 #14161c, 0 0 50px ${cor}88` }}>{texto}</div>
  </AbsoluteFill>
);
const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

const Relogios = ({ t, p, fim: acabou }: { t: number; p: number; fim: boolean }) => {
  const anos = acabou ? 80 : Math.floor(p * p * 79);
  return (
    <Painel cor={acabou ? "#ff8a5f" : "#5cc8ff"}>
      <div style={{ display: "flex", gap: 30 }}>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 44, color: "#5cc8ff", letterSpacing: 3 }}>TEMPO NA NAVE</div>
          <div style={{ fontSize: 120 }}>00:14</div>
          <div style={{ fontSize: 40, opacity: 0.7 }}>MINUTOS</div>
        </div>
        <div style={{ width: 5, background: "#39465c" }} />
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 44, color: "#ff8a5f", letterSpacing: 3 }}>TEMPO NA TERRA</div>
          <div style={{ fontSize: 120, color: "#ff8a5f", opacity: acabou && Math.sin(t * 9) < -0.4 ? 0.5 : 1 }}>+{anos}</div>
          <div style={{ fontSize: 40, opacity: 0.7 }}>ANOS</div>
        </div>
      </div>
    </Painel>
  );
};

const Retrato = ({ v, t, w = 360, falando = false, expr = "feliz" }: { v: Visual; t: number; w?: number; falando?: boolean; expr?: "feliz" | "sereno" }) => (
  <svg width={w} height={w * 1.15} viewBox="0 0 360 414" style={{ background: "#1c2a44", border: "5px solid #5cc8ff", borderRadius: 10 }}>
    <g transform="translate(180 800) scale(0.92)"><Ator v={v} t={t} expr={expr} falando={falando} fase={1} /></g>
    {Array.from({ length: 5 }, (_, i) => <rect key={i} y={((t * 150 + i * 90) % 414)} width={360} height={6} fill="#fff" opacity={0.08} />)}
  </svg>
);
const FASES: [Visual, string][] = [[MENINA, "ANO 1"], [MOCA, "ANO 12"], [ADULTA, "ANO 35"], [IDOSA, "ANO 79"]];

const Caixa = ({ t, p }: { t: number; p: number }) => (
  <Painel>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 40, letterSpacing: 4, color: "#5cc8ff" }}><span>MENSAGENS DA FILHA</span><span style={{ color: "#ffd166" }}>{Math.floor(p * 12418).toLocaleString("pt-BR")}</span></div>
    <div style={{ display: "flex", gap: 14, marginTop: 20, flexWrap: "wrap" }}>
      {Array.from({ length: 8 }, (_, i) => <div key={i} style={{ opacity: p * 9 > i ? 1 : 0.1 }}><Retrato v={FASES[Math.min(3, Math.floor(i / 2))][0]} t={t} w={193} /></div>)}
    </div>
  </Painel>
);
const Video = ({ t, fase, falando, coordenadas }: { t: number; fase: number; falando: boolean; coordenadas: boolean }) => (
  <Painel cor={fase === 3 ? "#ffd166" : "#5cc8ff"}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 40, letterSpacing: 4, color: fase === 3 ? "#ffd166" : "#5cc8ff" }}>
      <span>{fase === 3 ? "ÚLTIMA MENSAGEM" : "MENSAGEM DA FILHA"}</span><span>{FASES[fase][1]}</span>
    </div>
    <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}><Retrato v={FASES[fase][0]} t={t} w={560} falando={falando} expr={fase === 3 ? "sereno" : "feliz"} /></div>
    {coordenadas && <div style={{ fontSize: 52, marginTop: 14, textAlign: "center", color: "#5cf29a" }}>COORDENADAS: ÓRBITA DA TERRA</div>}
  </Painel>
);

const Memorias = ({ t, p }: { t: number; p: number }) => (
  <Painel cor="#7ef0ff">
    <div style={{ fontSize: 44, letterSpacing: 4, color: "#7ef0ff" }}>ARQUIVO DE MEMÓRIAS</div>
    <div style={{ display: "flex", gap: 14, marginTop: 18 }}>
      {FASES.map(([v, rot], i) => (
        <div key={i} style={{ opacity: p * 5 > i ? 1 : 0.08, textAlign: "center", fontSize: 30 }}><Retrato v={v} t={t} w={193} /><div>{rot}</div></div>
      ))}
    </div>
  </Painel>
);
const NOS: [number, number, Visual][] = [
  [410, 70, ELISA], [410, 230, IDOSA], [240, 390, ELENCO.Neto], [580, 390, ELENCO.Neta],
  [130, 550, ELENCO.Primo], [330, 550, ELENCO.Prima], [520, 550, ELENCO.Bisneta], [700, 550, cidadao(6)],
];
const Arvore = ({ t, p }: { t: number; p: number }) => (
  <Painel cor="#5cf29a">
    <div style={{ fontSize: 44, letterSpacing: 4, color: "#5cf29a" }}>DESCENDENTES DE ELISA</div>
    <svg width={820} height={640} viewBox="0 0 820 640">
      {[[0, 1], [1, 2], [1, 3], [2, 4], [2, 5], [3, 6], [3, 7]].map(([a, b], i) => p * 9 > b && <line key={i} x1={NOS[a][0]} y1={NOS[a][1]} x2={NOS[b][0]} y2={NOS[b][1]} stroke="#5cf29a" strokeWidth={6} />)}
      {NOS.map(([x, y, v], i) => p * 9 > i && (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle r={62} fill="#12301f" stroke={i === 0 ? "#ffd166" : "#5cf29a"} strokeWidth={6} />
          <clipPath id={`et-no${i}`}><circle r={58} /></clipPath>
          <g clipPath={`url(#et-no${i})`}><g transform="translate(0 232) scale(0.42)"><Ator v={v} t={t} expr="feliz" fase={i} /></g></g>
        </g>
      ))}
    </svg>
  </Painel>
);

const sobre = ({ t, shot, fala, falando }: Contexto) => {
  switch (shot.id) {
    case "pouso": return <Faixa texto="10:00" sub="DURAÇÃO DA MISSÃO" />;
    case "tempestade": return <Faixa texto={mmss(600 + dentro(t, "tempestade") * 277)} cor="#ff5a4a" sub="DECOLAGEM ATRASADA" />;
    case "tela": return <Relogios t={t} p={dentro(t, "tela")} fim={false} />;
    case "oitenta": return t < P.oitenta.de + 1.3 ? <Relogios t={t} p={1} fim /> : null;
    case "mensagens": return <Caixa t={t} p={dentro(t, "mensagens")} />;
    case "montagem": return <Video t={t} fase={Math.min(3, Math.floor(dentro(t, "montagem") * 4))} falando={false} coordenadas={false} />;
    case "ultima": return <Video t={t} fase={3} falando={fala?.p === "Filha" && falando} coordenadas={t > pal("04", "siga") - 0.1} />;
    case "arquivo": return <Memorias t={t} p={dentro(t, "arquivo")} />;
    case "descendentes": return <Arvore t={t} p={dentro(t, "descendentes")} />;
    default: return null;
  }
};

const fx = ({ t }: Contexto) => ({
  impacto: Math.max(decai(t, P.pouso.ate - 0.5, 0.6), decai(t, P.oitenta.de, 0.5)),
  flash: Math.max(decai(t, P.oitenta.de, 0.4), decai(t, T_ESTACAO, 0.4), decai(t, T_SOPRO, 0.3)),
  clarao: Math.max(decai(t, P.pouso.de, 0.5) * 0.7, decai(t, P.viagem.de, 0.6) * 0.6, decai(t, P.ia.de, 0.5), decai(t, P.sala.de, 0.6) * 0.8,
    ...[1, 2, 3].map((k) => decai(t, P.montagem.de + (k * (P.montagem.ate - P.montagem.de)) / 4, 0.2) * 0.5)),
  claraoCor: "#fffbe6",
});

export const Eternidade = () => (
  <Episodio
    manifesto={manifesto} shots={SHOTS} blocos={BLOCOS} preto={PRETO} elenco={ELENCO} vinheta={0.55}
    cenario={cenario} sobre={sobre} itens={itens} fx={fx}
    corLegenda={(p) => (p === "Filha" ? "#ffd166" : p === "Bisneta" ? "#ffb0a0" : "#ffffff")}
    final={() => (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", color: "#e8e4dc", fontFamily: FONT, fontSize: 90, letterSpacing: 10 }}>FIM</AbsoluteFill>
    )}
    sons={
      <>
        <Som fps={FPS} em={0} src="eternidade/sfx/musica.mp3" volume={0.3} dur={manifesto.duracao} some={1.8} />
        <Som fps={FPS} em={P.pouso.de} src="mare01/sfx/estrondo.mp3" volume={0.4} dur={P.promessa.de - P.pouso.de} some={0.5} />
        <Som fps={FPS} em={P.tempestade.de} src="mare01/sfx/vento.mp3" volume={0.8} dur={P.retorna.de - P.tempestade.de} some={0.4} />
        <Som fps={FPS} em={P.tempestade.de + 0.8} src="ep01/sfx/impacto.mp3" volume={0.5} />
        <Som fps={FPS} em={P.retorna.de} src="ep02/sfx/escotilha.mp3" volume={0.6} dur={2} some={0.4} />
        <Som fps={FPS} em={P.tela.de} src="futuro/sfx/tique.mp3" volume={0.7} dur={P.oitenta.de - P.tela.de} some={0.2} />
        <Som fps={FPS} em={P.oitenta.de} src="ep01/sfx/impacto.mp3" volume={0.7} />
        <Som fps={FPS} em={P.mensagens.de} src="futuro/sfx/bipes.mp3" volume={0.4} dur={P.montagem.de - P.mensagens.de} some={0.3} />
        <Som fps={FPS} em={P.ultima.de} src="mare01/sfx/celular.mp3" volume={0.4} dur={0.5} />
        <Som fps={FPS} em={P.viagem.de} src="futuro/sfx/pulso.mp3" volume={0.5} dur={P.estacao.de - P.viagem.de} some={0.5} />
        <Som fps={FPS} em={T_ESTACAO} src="trem/sfx/brilho.mp3" volume={0.8} />
        <Som fps={FPS} em={P.ia.de + 1.4} src="futuro/sfx/portal.mp3" volume={0.5} dur={2.4} some={0.6} />
        <Som fps={FPS} em={P.arquivo.de} src="tempo/sfx/cameras.mp3" volume={0.4} dur={2} some={0.4} />
        <Som fps={FPS} em={P.descendentes.de} src="trem/sfx/brilho.mp3" volume={0.5} />
        <Som fps={FPS} em={P.sala.de} src="trem/sfx/porta.mp3" volume={0.6} />
        <Som fps={FPS} em={T_SOPRO + 0.3} src="mare02/sfx/escola.mp3" volume={0.35} />
      </>
    }
  />
);

export const ETERNIDADE_DURACAO = Math.round(manifesto.duracao * FPS);
export const ETERNIDADE_FPS = FPS;
