import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import manifestoJson from "./manifest.json";
import { FONT } from "../theme";
import type { Visual } from "../serie/Ator";
import {
  Episodio, Som, decai, est as e, sobe, tempos,
  type Bloco, type Contexto, type Manifesto, type Shot,
} from "../serie/motor";
import { Alojamento, Campo, Comando, Corte, SOLDADO, Visitante } from "./cenarios";

// A Última Repetição — curta narrado.

const manifesto = manifestoJson as Manifesto;
const FPS = manifesto.fps;
const PRETO = manifestoJson.preto;
const { fim, pal } = tempos(manifesto);

const ANDRE: Visual = { pele: "#c68a5e", cabelo: "#17110e", roupa: "#4f5d3f", detalhe: "#6b7a55", calca: "#3a4530", estilo: "curto" };
const COMANDANTE: Visual = { pele: "#e2b08a", cabelo: "#9a9da4", roupa: "#2f3a4a", calca: "#252e3b", estilo: "grisalho", chapeu: "#2f3a4a", barbaCor: "#c9ccd2", sobrancelha: "#8a8d94" };
const ELENCO: Record<string, Visual> = { Andre: ANDRE, Comandante: COMANDANTE, Soldado: SOLDADO };

const BLOCOS: Record<string, Bloco> = {
  campo: { Andre: e(420, 1800, 0.66, "medo", [0.6, -0.6]) },
  cama: { Andre: e(540, 1790, 0.75, "panico", [0, 0]) },
  antena: { Andre: e(300, 1800, 0.6, "firme", [1, -0.6], "recuar") },
  comando: { Andre: e(330, 1800, 0.66, "firme", [1, -0.2]), Comandante: e(760, 1800, 0.68, "desconfiado", [-1, 0]) },
  final: { Andre: e(400, 1810, 0.62, "feliz", [0.3, -0.9]), Comandante: e(700, 1810, 0.62, "sereno", [-0.2, -0.9]), Soldado: e(900, 1830, 0.52, "feliz", [-0.4, -0.9]) },
};
const R = (b: string, n: string): [number, number] => [BLOCOS[b][n].x, BLOCOS[b][n].y - 690 * BLOCOS[b][n].s];
const R_CAMPO = R("campo", "Andre"), R_CAMA = R("cama", "Andre"), R_AND = R("comando", "Andre"), R_COM = R("comando", "Comandante");

const T_VEZES = pal("01", "já") - 0.2, T_FIM1 = fim("01") + 0.5;
const montagem: Shot[] = Array.from({ length: 6 }, (_, k): Shot => {
  const d = (T_FIM1 - T_VEZES) / 6, de = T_VEZES + k * d;
  return k % 2 === 0
    ? { id: `m${k}`, de, ate: de + d, fundo: "campoAtaque", bloco: "campo", luz: "noite", tremor: 6, cam: [[R_CAMPO[0], R_CAMPO[1], 1.6 + k * 0.1], [R_CAMPO[0], R_CAMPO[1], 1.9 + k * 0.1]], at: { Andre: { expr: "panico", pose: "recuar" } } }
    : { id: `m${k}`, de, ate: de + d, fundo: "alojamento", bloco: "cama", luz: "normal", cam: [[R_CAMA[0], R_CAMA[1], 2.2 + k * 0.1], [R_CAMA[0], R_CAMA[1], 2.5 + k * 0.1]], at: { Andre: { expr: k === 5 ? "triste" : "congelado" } } };
});

const SHOTS: Shot[] = [
  // 00–12 s | O mesmo céu
  { id: "invasao", de: 0, ate: pal("01", "andré") - 0.2, fundo: "campoChegada", luz: "noite", tremor: 4,
    cam: [[540, 700, 1.0], [540, 900, 1.2]] },
  { id: "morre", de: pal("01", "andré") - 0.2, ate: pal("01", "despertava") - 0.3, fundo: "campoAtaque", bloco: "campo", luz: "noite", tremor: 8,
    cam: [[420, 1400, 1.5], [R_CAMPO[0], R_CAMPO[1], 2.4]], at: { Andre: { x: 150, xPara: 420, expr: "panico" } } },
  { id: "desperta", de: pal("01", "despertava") - 0.3, ate: T_VEZES, fundo: "alojamento", bloco: "cama", luz: "normal",
    cam: [[R_CAMA[0], R_CAMA[1], 3.0], [R_CAMA[0], R_CAMA[1] - 120, 1.6]] },
  ...montagem,

  // 12–25 s | A pista
  { id: "nota", de: T_FIM1, ate: pal("02", "invasores") - 0.2, fundo: "campoAtaque", bloco: "campo", luz: "noite", tremor: 3,
    cam: [[R_CAMPO[0], R_CAMPO[1], 2.6], [R_CAMPO[0], R_CAMPO[1], 2.2]], at: { Andre: { expr: "desconfiado", olhar: [-0.8, -0.5] } } },
  { id: "hospital", de: pal("02", "invasores") - 0.2, ate: pal("02", "protegiam") - 0.4, fundo: "campoDesvio", luz: "noite",
    cam: [[330, 1150, 1.5], [260, 1100, 1.9]] },
  { id: "antena", de: pal("02", "protegiam") - 0.4, ate: pal("02", "aquilo") - 0.2, fundo: "campoGuarda", luz: "noite",
    cam: [[700, 1200, 1.4], [800, 850, 1.8]] },
  { id: "conquista", de: pal("02", "aquilo") - 0.2, ate: fim("02") + 0.5, fundo: "campoGuarda", bloco: "campo", luz: "noite",
    cam: [[R_CAMPO[0], R_CAMPO[1], 2.3], [R_CAMPO[0], R_CAMPO[1], 3.0]], at: { Andre: { expr: "surpreso", olhar: [1, -0.7] } } },

  // 25–38 s | A aproximação
  { id: "arma", de: fim("02") + 0.5, ate: pal("03", "caminhou") - 0.1, fundo: "campoGuarda", bloco: "campo", luz: "noite",
    cam: [[440, 1560, 1.9], [440, 1620, 2.2]], at: { Andre: { expr: "firme", olhar: [0.4, 0.8] } } },
  { id: "maos", de: pal("03", "caminhou") - 0.1, ate: pal("03", "uma") - 0.1, fundo: "campoGuarda", bloco: "antena", luz: "noite", tremor: 2,
    cam: [[400, 1350, 1.3], [620, 1250, 1.5]], at: { Andre: { x: 120, xPara: 560 } } },
  { id: "projeta", de: pal("03", "uma") - 0.1, ate: fim("03") + 0.5, fundo: "campoCalmo", bloco: "antena", luz: "ciano",
    cam: [[560, 1250, 1.4], [540, 1000, 1.1]], at: { Andre: { x: 330, expr: "surpreso", pose: "parado", olhar: [0.6, -1] } } },

  // 38–52 s | A verdade
  { id: "reator", de: fim("03") + 0.5, ate: pal("04", "os") - 0.1, fundo: "corte", luz: "normal", tremor: 6,
    cam: [[540, 1560, 2.0], [540, 1450, 1.35]] },
  { id: "visitantes", de: pal("04", "os") - 0.1, ate: pal("04", "exército") - 0.3, fundo: "corte", luz: "normal", tremor: 4,
    cam: [[540, 1300, 1.3], [540, 700, 1.4]] },
  { id: "exercito", de: pal("04", "exército") - 0.3, ate: fim("04") + 0.5, fundo: "corte", luz: "normal", tremor: 7,
    cam: [[300, 640, 2.0], [760, 600, 1.8]] },

  // 52–65 s | O plano
  { id: "codigos", de: fim("04") + 0.5, ate: pal("05", "quando") - 0.1, fundo: "campoCalmo", bloco: "antena", luz: "ciano",
    cam: [[R("antena", "Andre")[0] + 30, R("antena", "Andre")[1], 2.4], [R("antena", "Andre")[0] + 30, R("antena", "Andre")[1], 2.9]],
    at: { Andre: { x: 330, expr: "firme", pose: "parado", olhar: [0.5, -1] } } },
  { id: "reinicia", de: pal("05", "quando") - 0.1, ate: pal("05", "correu") - 0.1, fundo: "alojamento", bloco: "cama", luz: "normal",
    cam: [[R_CAMA[0], R_CAMA[1], 2.8], [R_CAMA[0], R_CAMA[1], 2.2]], at: { Andre: { expr: "firme" } } },
  { id: "corre", de: pal("05", "correu") - 0.1, ate: pal("05", "mostrou") - 0.1, fundo: "comando", bloco: "comando", luz: "noite", tremor: 5,
    cam: [[440, 1400, 1.3], [540, 1350, 1.5]], at: { Andre: { x: -250, xPara: 330 }, Comandante: { expr: "surpreso" } } },
  { id: "mostra", de: pal("05", "mostrou") - 0.1, ate: fim("05") + 0.5, fundo: "comandoFalha", bloco: "comando", luz: "noite",
    cam: [[480, 1250, 1.4], [640, 860, 2.0]], at: { Andre: { pose: "apontarCima", olhar: [0.6, -0.9] }, Comandante: { olhar: [-0.4, -0.9] } } },

  // 65–78 s | A última chance
  { id: "duvida", de: fim("05") + 0.5, ate: pal("06", "andré") - 0.1, fundo: "comandoFalha", bloco: "comando", luz: "noite",
    cam: [[R_COM[0], R_COM[1], 2.4], [R_COM[0], R_COM[1], 2.9]], at: { Comandante: { nega: true } } },
  { id: "mensagem", de: pal("06", "andré") - 0.1, ate: pal("06", "enviada") - 0.2, fundo: "comandoFalha", bloco: "comando", luz: "noite",
    cam: [[R_AND[0] + 60, R_AND[1], 2.0], [R_AND[0] + 60, R_AND[1], 2.2]], at: { Andre: { pose: "apontarDir" } } },
  { id: "espanto", de: pal("06", "enviada") - 0.2, ate: pal("06", "convencido") - 0.1, fundo: "comandoFalha", bloco: "comando", luz: "noite",
    cam: [[R_COM[0], R_COM[1], 2.6], [R_COM[0], R_COM[1], 3.2]], at: { Comandante: { expr: "congelado", olhar: [-0.6, 0.4] } } },
  { id: "ordena", de: pal("06", "convencido") - 0.1, ate: pal("06", "cessar") - 0.1, fundo: "comandoFalha", bloco: "comando", luz: "noite",
    cam: [[620, 1350, 1.6], [700, 1330, 1.9]], at: { Comandante: { expr: "firme", pose: "apontarDir", olhar: [1, 0] } } },
  { id: "silencio", de: pal("06", "cessar") - 0.1, ate: pal("06", "abriu") - 0.3, fundo: "campoSilencio", luz: "noite",
    cam: [[540, 1100, 1.2], [540, 1000, 1.05]] },
  { id: "acesso", de: pal("06", "abriu") - 0.3, ate: fim("06") + 0.7, fundo: "corteAbre", luz: "normal", tremor: 3,
    cam: [[540, 760, 2.0], [540, 1000, 1.3]] },

  // 78–90 s | Amanhã
  { id: "estabiliza", de: fim("06") + 0.7, ate: pal("07", "às") - 0.1, fundo: "corteEstavel", luz: "normal", tremor: 2,
    cam: [[540, 1350, 1.3], [540, 1540, 1.9]] },
  { id: "vivo", de: pal("07", "às") - 0.1, ate: pal("07", "relógio") - 0.4, fundo: "manha", bloco: "final", luz: "dia",
    cam: [[R("final", "Andre")[0], R("final", "Andre")[1], 2.6], [R("final", "Andre")[0], R("final", "Andre")[1], 2.2]],
    at: { Andre: { expr: "surpreso", olhar: [0, 0.8] } } },
  { id: "avancou", de: pal("07", "relógio") - 0.4, ate: pal("07", "pela") - 0.1, fundo: "manha", bloco: "final", luz: "dia",
    cam: [[540, 1300, 1.3], [540, 1300, 1.35]] },
  { id: "amanha", de: pal("07", "pela") - 0.1, ate: PRETO, fundo: "manha", bloco: "final", luz: "dia",
    cam: [[480, 1380, 2.0], [540, 900, 1.0]] },
];

const P = Object.fromEntries(SHOTS.map((s) => [s.id, s]));
const dentro = (t: number, id: string) => sobe(t, P[id].de, P[id].ate);
const T_QUEDA = P.morre.ate - 0.5;
const T_VIRA = pal("07", "avançou") + 0.1;

const cenario = ({ t, shot }: Contexto) => {
  switch (shot.fundo) {
    case "campoChegada": return <Campo t={t} tiros={sobe(t, 1.6, 2.6)} descida={sobe(t, 0.2, 2.2)} corLuz="#ffb347" />;
    case "campoAtaque": return <Campo t={t} tiros={1} corLuz="#ffb347" />;
    case "campoDesvio": return <Campo t={t} tiros={0.5} formacao="desvio" corLuz="#7ef0ff" />;
    case "campoGuarda": return <Campo t={t} tiros={0.3} formacao="guarda" antena={1} corLuz="#7ef0ff" />;
    case "campoCalmo": return <Campo t={t} formacao="guarda" antena={1} corLuz="#7ef0ff" />;
    case "campoSilencio": return <Campo t={t} tiros={1 - sobe(t, P.silencio.de, P.silencio.de + 0.5)} formacao="calmo" corLuz="#7ef0ff" sol={0.3} />;
    case "manha": return <Campo t={t} formacao={shot.id === "amanha" ? "sobem" : "calmo"} corLuz="#7ef0ff" sol={0.6 + 0.4 * sobe(t, P.vivo.de, PRETO)} />;
    case "alojamento": return <Alojamento t={t} hora="05:58" />;
    case "corte": return <Corte t={t} calor={1} tiros={shot.id === "reator" ? 0.4 : 1} />;
    case "corteAbre": return <Corte t={t} calor={1} tiros={0} abre={sobe(t, P.acesso.de + 0.2, P.acesso.de + 1.2)} desce={sobe(t, P.acesso.de + 1.0, P.acesso.ate)} />;
    case "corteEstavel": return <Corte t={t} calor={1 - sobe(t, P.estabiliza.de + 0.5, P.estabiliza.ate - 0.5)} tiros={0} abre={1} desce={1} feixes={1} />;
    case "comando": return <Comando t={t} />;
    case "comandoFalha": return <Comando t={t} falha={1} cessar={shot.id === "ordena" && t > P.ordena.de + 1.5} />;
    default: return <Campo t={t} />;
  }
};

const Arma = () => (
  <g>
    <rect x={-70} y={-12} width={140} height={24} rx={6} fill="#2a2f38" /><rect x={40} y={-6} width={70} height={12} fill="#2a2f38" />
    <path d="M-70 -12 L-110 -4 L-110 30 L-80 30 L-60 12Z" fill="#4a3a2e" /><rect x={-10} y={12} width={18} height={34} fill="#2a2f38" />
  </g>
);

const itens = ({ t, shot }: Contexto) => {
  const item = (el: ReactNode) => [{ y: 2000, el }];
  if (shot.id === "arma") {
    const p = sobe(t, P.arma.de + 0.3, P.arma.de + 0.9);
    return item(<g key="a" transform={`translate(${560} ${1500 + p * p * 300}) rotate(${p * 70})`}><Arma /></g>);
  }
  if (shot.id === "maos") return item(<g key="a" transform="translate(180 1800) rotate(70)"><Arma /></g>);
  if (shot.id === "projeta" || shot.id === "codigos") {
    return item(
      <g key="v">
        <path d="M700 1130 L250 420 L830 420Z" fill="#7ef0ff" opacity={0.12 + 0.04 * Math.sin(t * 9)} />
        <g transform="translate(700 1200) scale(0.9)"><Visitante t={t} /></g>
      </g>,
    );
  }
  return [];
};

// ---------- sobreposições ----------
const Grande = ({ texto, cor = "#ff5a4a", top = 230, tam = 220, sub }: { texto: string; cor?: string; top?: number; tam?: number; sub?: string }) => (
  <AbsoluteFill style={{ alignItems: "center", fontFamily: FONT }}>
    <div style={{ marginTop: top, fontSize: tam, color: cor, letterSpacing: 8, lineHeight: 1, textShadow: `0 8px 0 #14161c, 0 0 60px ${cor}` }}>{texto}</div>
    {sub && <div style={{ fontSize: 64, color: "#fff", marginTop: 16, letterSpacing: 4, textShadow: "0 5px 0 #14161c" }}>{sub}</div>}
  </AbsoluteFill>
);

/** Holograma projetado no ar: a usina da cidade explodindo. */
const Futuro = ({ t, p }: { t: number; p: number }) => {
  const boom = sobe(p, 0.45, 1);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <svg width={760} height={560} viewBox="0 0 760 560" style={{ marginTop: 230, opacity: 0.92, filter: "drop-shadow(0 0 40px rgba(126,240,255,0.6))" }}>
        <rect width={760} height={560} rx={16} fill="rgba(8,40,60,0.75)" stroke="#7ef0ff" strokeWidth={6} />
        <text x={24} y={50} fontFamily={FONT} fontSize={34} fill="#7ef0ff" letterSpacing={3}>PROJEÇÃO · 07:00</text>
        {Array.from({ length: 9 }, (_, i) => <rect key={i} x={20 + i * 82} y={360 - (i * 37) % 120} width={66} height={200} fill="#2f7f99" opacity={0.7} />)}
        {[250, 430].map((x) => <path key={x} d={`M${x - 60} 470 Q${x - 30} 330 ${x - 44} 250 L${x + 44} 250 Q${x + 30} 330 ${x + 60} 470Z`} fill="#7ef0ff" opacity={0.75} />)}
        <rect x={0} y={470} width={760} height={90} fill="#0d3a4f" />
        {boom > 0 && (
          <g transform="translate(340 300)">
            <circle r={40 + boom * 330} fill="#ff7a2a" opacity={0.6 * (1 - boom * 0.5)} />
            <circle r={20 + boom * 200} fill="#ffd166" opacity={0.85 * (1 - boom * 0.4)} />
            <circle r={10 + boom * 110} fill="#fff" opacity={1 - boom * 0.5} />
          </g>
        )}
        {Array.from({ length: 6 }, (_, i) => <rect key={i} y={((t * 200 + i * 100) % 560)} width={760} height={6} fill="#fff" opacity={0.07} />)}
      </svg>
    </AbsoluteFill>
  );
};

const Codigos = ({ t, p }: { t: number; p: number }) => (
  <AbsoluteFill style={{ alignItems: "center", fontFamily: FONT }}>
    <div style={{ marginTop: 240, width: 780, padding: "26px 36px", background: "rgba(8,40,60,0.85)", border: "5px solid #7ef0ff", borderRadius: 16, color: "#d8fbff", boxShadow: "0 0 60px rgba(126,240,255,0.45)" }}>
      <div style={{ fontSize: 40, letterSpacing: 4, color: "#7ef0ff" }}>FALHA DO REATOR</div>
      {["SUBSOLO · SETOR 7", "VÁLVULA 3", "CÓDIGO 4 · 9 · 1 · 7"].map((x, i) => (
        <div key={i} style={{ fontSize: 66, marginTop: 10, opacity: p > 0.15 + i * 0.22 ? 1 : 0.12, color: p > 0.15 + i * 0.22 && Math.sin(t * 10 + i) > 0.6 ? "#fff" : "#ffd166" }}>{x}</div>
      ))}
    </div>
  </AbsoluteFill>
);

const Mensagem = ({ t, p }: { t: number; p: number }) => (
  <AbsoluteFill style={{ alignItems: "center", fontFamily: FONT, background: "rgba(4,6,10,0.4)" }}>
    <div style={{ marginTop: 250, width: 820, padding: "30px 38px", background: "#111a26", border: "5px solid #ffb347", borderRadius: 18, color: "#e8e4dc", boxShadow: "0 20px 70px rgba(0,0,0,0.6)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 38, letterSpacing: 3, color: "#ffb347" }}><span>MENSAGEM PRIVADA</span><span>RASCUNHO</span></div>
      <div style={{ fontSize: 50, marginTop: 20 }}>DE: COMANDANTE</div>
      <div style={{ fontSize: 50, opacity: p > 0.25 ? 1 : 0 }}>ENVIO PROGRAMADO: <span style={{ color: "#ff5a4a" }}>09:40</span></div>
      <div style={{ marginTop: 18, opacity: p > 0.45 ? 1 : 0 }}>
        {[0.95, 0.8, 0.6].map((w, i) => <div key={i} style={{ height: 26, width: `${w * 100}%`, background: "#56636e", borderRadius: 8, marginTop: 14 }} />)}
      </div>
      <div style={{ fontSize: 60, marginTop: 22, color: "#ffd166", opacity: p > 0.6 ? (Math.sin(t * 9) > -0.4 ? 1 : 0.5) : 0 }}>AINDA NÃO ENVIADA</div>
    </div>
  </AbsoluteFill>
);

const sobre = ({ t, shot }: Contexto) => {
  if (/^m\d$/.test(shot.id)) {
    const p = sobe(t, T_VEZES, T_FIM1 - 0.6);
    return <Grande texto={`DIA ${Math.round(1 + p * p * 111)}`} cor="#ffb347" tam={190} />;
  }
  switch (shot.id) {
    case "invasao": return <Grande texto="06:00" />;
    case "morre": return <Grande texto="06:58" />;
    case "projeta": return <Futuro t={t} p={dentro(t, "projeta")} />;
    case "codigos": return <Codigos t={t} p={dentro(t, "codigos")} />;
    case "reinicia": return <Grande texto="DIA 113" cor="#5cf29a" tam={190} />;
    case "mensagem": return <Mensagem t={t} p={dentro(t, "mensagem")} />;
    case "silencio": return <Grande texto="CESSAR-FOGO" cor="#5cf29a" tam={140} />;
    case "vivo": return <Grande texto="07:01" cor="#5cf29a" />;
    case "avancou": case "amanha": return t < P.amanha.de + 1.5 ? <Grande texto={t >= T_VIRA ? "07:02" : "07:01"} cor="#5cf29a" /> : null;
    default: return null;
  }
};

const fx = ({ t }: Contexto) => ({
  impacto: Math.max(decai(t, 1.8, 0.8), decai(t, T_QUEDA, 0.6), decai(t, P.reator.de, 0.6), decai(t, P.exercito.de, 0.5)),
  flash: Math.max(decai(t, P.projeta.de + 2.0, 0.5), decai(t, P.mostra.de, 0.3), decai(t, T_VIRA, 0.4)),
  clarao: Math.max(
    sobe(t, T_QUEDA, P.morre.ate) * (t < P.morre.ate ? 1 : 0), decai(t, P.desperta.de, 0.5),
    ...montagem.map((m) => decai(t, m.de, 0.16) * 0.85),
    decai(t, P.reinicia.de, 0.5), decai(t, P.vivo.de, 0.5) * 0.7,
  ),
  claraoCor: "#ffffff",
});

const BAT = "mare02/sfx/impacto.mp3";

export const Repete = () => (
  <Episodio
    manifesto={manifesto} shots={SHOTS} blocos={BLOCOS} preto={PRETO} elenco={ELENCO} vinheta={0.55}
    cenario={cenario} sobre={sobre} itens={itens} fx={fx}
    corLegenda={() => "#ffffff"}
    final={() => (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", color: "#e8e4dc", fontFamily: FONT, fontSize: 90, letterSpacing: 10 }}>FIM</AbsoluteFill>
    )}
    sons={
      <>
        <Som fps={FPS} em={0} src="oito/sfx/musica.mp3" volume={0.3} dur={manifesto.duracao} some={1.6} />
        <Som fps={FPS} em={0.2} src="mare02/sfx/sirenes.mp3" volume={0.45} dur={P.desperta.de} some={0.3} />
        <Som fps={FPS} em={1.6} src={BAT} volume={0.6} dur={P.desperta.de - 1.6} some={0.2} />
        <Som fps={FPS} em={T_QUEDA} src="oito/sfx/explosao.mp3" volume={0.8} dur={1.4} some={0.4} />
        <Som fps={FPS} em={P.desperta.de} src="minutos/sfx/reverso.mp3" volume={0.6} dur={1.2} some={0.3} />
        <Som fps={FPS} em={T_VEZES} src="futuro/sfx/glitch.mp3" volume={0.6} dur={T_FIM1 - T_VEZES} some={0.3} />
        <Som fps={FPS} em={T_FIM1} src={BAT} volume={0.4} dur={P.arma.de - T_FIM1} some={0.6} />
        <Som fps={FPS} em={P.antena.de} src="futuro/sfx/pulso.mp3" volume={0.6} dur={P.arma.de - P.antena.de} some={0.4} />
        <Som fps={FPS} em={P.arma.de + 0.9} src="ep02/sfx/metal.mp3" volume={0.7} dur={1.2} some={0.3} />
        <Som fps={FPS} em={P.projeta.de + 0.2} src="futuro/sfx/portal.mp3" volume={0.6} dur={P.reator.de - P.projeta.de} some={0.4} />
        <Som fps={FPS} em={P.reator.de} src="tempo/sfx/alarmes.mp3" volume={0.4} dur={P.exercito.de - P.reator.de} some={0.4} />
        <Som fps={FPS} em={P.exercito.de} src={BAT} volume={0.6} dur={P.codigos.de - P.exercito.de} some={0.4} />
        <Som fps={FPS} em={P.codigos.de + 0.4} src="futuro/sfx/bipes.mp3" volume={0.5} dur={2.6} some={0.3} />
        <Som fps={FPS} em={P.reinicia.de} src="minutos/sfx/reverso.mp3" volume={0.6} dur={1.2} some={0.3} />
        <Som fps={FPS} em={P.corre.de} src="tempo/sfx/central.mp3" volume={0.4} dur={P.silencio.de - P.corre.de} some={0.5} />
        <Som fps={FPS} em={P.mostra.de + 0.6} src="trem/sfx/brilho.mp3" volume={0.6} />
        <Som fps={FPS} em={P.mensagem.de + 0.3} src="mare01/sfx/celular.mp3" volume={0.6} />
        <Som fps={FPS} em={P.silencio.de} src="cidade/sfx/desliga.mp3" volume={0.8} dur={2.4} some={0.5} />
        <Som fps={FPS} em={P.acesso.de + 0.2} src="abismo/sfx/comporta.mp3" volume={0.8} dur={P.estabiliza.de - P.acesso.de} some={0.4} />
        <Som fps={FPS} em={P.estabiliza.de + 0.4} src="abismo/sfx/vapor.mp3" volume={0.6} dur={P.vivo.de - P.estabiliza.de - 0.2} some={0.4} />
        <Som fps={FPS} em={P.vivo.de} src="mare01/sfx/aves.mp3" volume={0.5} />
        <Som fps={FPS} em={T_VIRA} src="trem/sfx/brilho.mp3" volume={0.8} />
      </>
    }
  />
);

export const REPETE_DURACAO = Math.round(manifesto.duracao * FPS);
export const REPETE_FPS = FPS;
