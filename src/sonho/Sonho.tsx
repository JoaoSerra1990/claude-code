import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import manifestoJson from "./manifest.json";
import { FONT } from "../theme";
import { Ator, type Visual } from "../serie/Ator";
import {
  Episodio, Som, decai, est as e, sobe, tempos,
  type Bloco, type Contexto, type Manifesto, type Shot,
} from "../serie/motor";
import { Cama, Hospital } from "../oito/cenarios";
import { CidadeDobrada, CorredorSonho, EstacaoVazia, LabSono } from "./cenarios";

// O Último Sonho — curta narrado.

const manifesto = manifestoJson as Manifesto;
const FPS = manifesto.fps;
const PRETO = manifestoJson.preto;
const { fim, pal } = tempos(manifesto);

const HELENA: Visual = { pele: "#edc09c", cabelo: "#6b2f3a", roupa: "#2f5d8a", calca: "#262a35", estilo: "longo" };
const MAIS_VELHA: Visual = { ...HELENA, cabelo: "#a8989e", roupa: "#bfe0e8", calca: "#bfe0e8", sobrancelha: "#7a6a70" };
const MENINO: Visual = { pele: "#edc09c", cabelo: "#4a2a22", roupa: "#e0572a", detalhe: "#f4e3c0", calca: "#3a4a63", estilo: "baguncado" };
const IRMAO: Visual = { ...MENINO, barbaCor: "#4a2a22" };
const ELENCO: Record<string, Visual> = { Helena: HELENA, Mulher: MAIS_VELHA, Menino: MENINO, Jovem: MENINO, Irmao: IRMAO, Paciente: MAIS_VELHA };

const BLOCOS: Record<string, Bloco> = {
  porta: { Menino: e(640, 1800, 0.44, "medo", [1, -0.3], "empurrar") },
  pede: { Helena: e(830, 1800, 0.66, "surpreso", [-1, 0.4]), Menino: e(480, 1810, 0.44, "medo", [1, -0.6], "apontarCima") },
  lab: { Helena: e(540, 1810, 0.66, "firme", [0.3, -0.5]) },
  cidade: { Menino: e(700, 1740, 0.36, "sereno", [1, 0]), Helena: e(300, 1760, 0.56, "surpreso", [1, -0.6]) },
  estacao: { Mulher: e(540, 1790, 0.66, "sereno", [0, 0]), Helena: e(150, 1800, 0.6, "surpreso", [1, 0]) },
  menino: { Menino: e(540, 1800, 0.6, "sereno", [0, -0.3]) },
  leito: { Paciente: e(460, 1790, 0.7, "sereno", [0, 0]), Menino: e(830, 1800, 0.42, "triste", [-1, -0.3]) },
  juntos: { Helena: e(620, 1810, 0.62, "firme", [-0.4, 0.3]), Menino: e(410, 1820, 0.42, "feliz", [0.6, -0.6]) },
  final: { Paciente: e(460, 1790, 0.7, "sereno", [0, 0]), Irmao: e(840, 1800, 0.66, "sereno", [-0.3, 0.9]) },
};
const R = (b: string, n: string): [number, number] => [BLOCOS[b][n].x, BLOCOS[b][n].y - 690 * BLOCOS[b][n].s];
const R_MULHER = R("estacao", "Mulher"), R_HEL = R("estacao", "Helena"), R_PAC = R("final", "Paciente"), R_IRM = R("final", "Irmao");

// "todos os dias": o irmão cresce ao lado da cama
const T_DIAS = pal("05", "que") - 0.1, T_GRAVA = pal("05", "gravava") - 0.4;
const crescer: Shot[] = [["Menino", 0.42], ["Jovem", 0.54], ["Irmao", 0.66]].map(([quem, s], k): Shot => {
  const d = (T_GRAVA - T_DIAS) / 3;
  const at: Shot["at"] = { Paciente: { fechado: true }, Menino: { oculto: true } };
  if (quem !== "Menino") at[quem as string] = { x: 830, y: 1800, s: s as number, expr: "triste", pose: "parado", olhar: [-1, -0.3] };
  else at.Menino = {};
  return { id: `dia${k}`, de: T_DIAS + k * d, ate: T_DIAS + (k + 1) * d, fundo: "hospital", bloco: "leito", luz: "fria", cam: [[600, 1300, 1.3], [620, 1300, 1.38]], at };
});

const SHOTS: Shot[] = [
  // 00–12 s | O corredor
  { id: "porta", de: 0, ate: pal("01", "ele") - 0.2, fundo: "corredor", bloco: "porta", luz: "noite",
    cam: [[540, 900, 1.0], [690, 1400, 1.7]] },
  { id: "pede", de: pal("01", "ele") - 0.2, ate: pal("01", "antes") - 0.2, fundo: "corredorAberto", bloco: "pede", luz: "noite",
    cam: [[640, 1420, 1.6], [620, 1400, 1.8]] },
  { id: "relogio", de: pal("01", "antes") - 0.2, ate: fim("01") + 0.5, fundo: "corredorAberto", bloco: "pede", luz: "noite",
    cam: [[560, 1300, 1.4], [540, 760, 2.0]] },

  // 12–25 s | A habilidade
  { id: "lab", de: fim("01") + 0.5, ate: pal("02", "mas") - 0.2, fundo: "lab", bloco: "lab", luz: "noite",
    cam: [[300, 1300, 1.5], [640, 1250, 1.25]] },
  { id: "nunca", de: pal("02", "mas") - 0.2, ate: pal("02", "entrar") - 0.2, fundo: "lab", bloco: "lab", luz: "noite",
    cam: [[R("lab", "Helena")[0], R("lab", "Helena")[1], 2.2], [R("lab", "Helena")[0], R("lab", "Helena")[1], 2.6]], at: { Helena: { expr: "desconfiado", olhar: [0, -1] } } },
  { id: "intruso", de: pal("02", "entrar") - 0.2, ate: fim("02") + 0.5, fundo: "labIntruso", bloco: "lab", luz: "noite",
    cam: [[540, 600, 1.6], [540, 540, 2.3]] },

  // 25–38 s | O mergulho
  { id: "cidade", de: fim("02") + 0.5, ate: pal("03", "no") - 0.2, fundo: "cidade", bloco: "cidade", luz: "noite", tremor: 2,
    cam: [[480, 1500, 1.5], [540, 900, 1.0]], at: { Menino: { x: 520, xPara: 900 }, Helena: { x: 100, xPara: 480 } } },
  { id: "estacao", de: pal("03", "no") - 0.2, ate: pal("03", "mulher") - 0.3, fundo: "estacao", bloco: "estacao", luz: "normal",
    cam: [[540, 1000, 1.0], [540, 1150, 1.2]], at: { Mulher: { fechado: true }, Helena: { x: -200, xPara: 150 } } },
  { id: "adormecida", de: pal("03", "mulher") - 0.3, ate: fim("03") + 0.6, fundo: "estacao", bloco: "estacao", luz: "normal",
    cam: [[540, 1400, 1.5], [R_MULHER[0], R_MULHER[1] + 40, 2.3]], at: { Mulher: { fechado: true } } },

  // 38–52 s | O rosto
  { id: "rostoM", de: fim("03") + 0.6, ate: pal("04", "helena") - 0.1, fundo: "estacao", bloco: "estacao", luz: "normal",
    cam: [[R_MULHER[0], R_MULHER[1], 3.0], [R_MULHER[0], R_MULHER[1], 3.4]], at: { Mulher: { fechado: true } } },
  { id: "rostoH", de: pal("04", "helena") - 0.1, ate: pal("04", "vinte") - 0.3, fundo: "estacao", bloco: "estacao", luz: "normal",
    cam: [[R_HEL[0], R_HEL[1], 3.0], [R_HEL[0], R_HEL[1], 3.4]], at: { Helena: { expr: "congelado", olhar: [1, 0] } } },
  { id: "velha", de: pal("04", "vinte") - 0.3, ate: pal("04", "uma") - 0.2, fundo: "estacao", bloco: "estacao", luz: "normal",
    cam: [[350, 1400, 1.7], [360, 1380, 1.9]], at: { Mulher: { fechado: true }, Helena: { expr: "congelado", olhar: [1, 0] } } },
  { id: "gravacao", de: pal("04", "uma") - 0.2, ate: fim("04") + 0.6, fundo: "estacao", bloco: "estacao", luz: "normal",
    cam: [[350, 1380, 1.9], [350, 1380, 2.0]], at: { Mulher: { fechado: true } } },

  // 52–65 s | A verdade
  { id: "estranho", de: fim("04") + 0.6, ate: pal("05", "lembrança") - 0.7, fundo: "corredorAberto", bloco: "menino", luz: "noite",
    cam: [[540, 1450, 1.6], [540, 1400, 2.3]] },
  { id: "lembranca", de: pal("05", "lembrança") - 0.7, ate: T_DIAS, fundo: "corredorAberto", bloco: "menino", luz: "noite",
    cam: [[540, 1400, 2.3], [540, 1390, 2.7]], at: { Menino: { expr: "feliz", dissolve: 0, dissolvePara: 0.55 } } },
  ...crescer,
  { id: "grava", de: T_GRAVA, ate: fim("05") + 0.6, fundo: "hospital", bloco: "final", luz: "dia",
    cam: [[R_IRM[0] - 40, R_IRM[1] + 120, 1.9], [560, 1320, 1.4]], at: { Paciente: { fechado: true } } },

  // 65–78 s | O caminho
  { id: "mao", de: fim("05") + 0.6, ate: pal("06", "seguiu") - 0.3, fundo: "corredorAberto", bloco: "juntos", luz: "noite",
    cam: [[520, 1500, 1.9], [520, 1480, 2.2]] },
  { id: "corre", de: pal("06", "seguiu") - 0.3, ate: pal("06", "relógio") - 0.5, fundo: "corredorFim", bloco: "juntos", luz: "noite", tremor: 5,
    cam: [[540, 1500, 1.3], [540, 1250, 1.6]],
    at: { Helena: { yPara: 1560, sPara: 0.36, xPara: 580 }, Menino: { yPara: 1570, sPara: 0.25, xPara: 490 } } },
  { id: "parou", de: pal("06", "relógio") - 0.5, ate: pal("06", "mas") - 0.1, fundo: "corredorFim", luz: "noite", tremor: 3,
    cam: [[540, 760, 2.2], [540, 760, 2.6]] },
  { id: "abriu", de: pal("06", "mas") - 0.1, ate: pal("07", "helena") - 0.6, fundo: "corredorFim", bloco: "juntos", luz: "noite",
    cam: [[540, 1200, 1.6], [540, 1080, 3.2]], at: { Helena: { x: 580, y: 1560, s: 0.36, yPara: 1300, sPara: 0.2 }, Menino: { x: 490, y: 1570, s: 0.25, yPara: 1300, sPara: 0.14 } } },

  // 78–90 s | O reencontro
  { id: "fechados", de: pal("07", "helena") - 0.6, ate: pal("07", "acordou") + 0.2, fundo: "hospital", bloco: "final", luz: "dia",
    cam: [[R_PAC[0], R_PAC[1], 2.8], [R_PAC[0], R_PAC[1], 3.0]], at: { Paciente: { fechado: true }, Irmao: { oculto: true } } },
  { id: "acorda", de: pal("07", "acordou") + 0.2, ate: pal("07", "seu") - 0.2, fundo: "hospital", bloco: "final", luz: "dia",
    cam: [[R_PAC[0], R_PAC[1], 3.0], [R_PAC[0], R_PAC[1] + 30, 2.3]], at: { Paciente: { expr: "surpreso", olhar: [0, -0.3] }, Irmao: { oculto: true } } },
  { id: "irmao", de: pal("07", "seu") - 0.2, ate: pal("07", "lendo") - 0.1, fundo: "hospital", bloco: "final", luz: "dia",
    cam: [[R_PAC[0] + 60, R_PAC[1] + 60, 2.0], [R_IRM[0], R_IRM[1] + 60, 2.0]], at: { Paciente: { expr: "surpreso", olhar: [1, 0] } } },
  { id: "livro", de: pal("07", "lendo") - 0.1, ate: pal("07", "desta") - 0.2, fundo: "hospital", bloco: "final", luz: "dia",
    cam: [[R_PAC[0] + 40, R_PAC[1] - 60, 1.7], [R_PAC[0] + 40, R_PAC[1] - 60, 1.9]], at: { Paciente: { expr: "feliz", olhar: [1, 0.2], lagrima: true } } },
  { id: "responde", de: pal("07", "desta") - 0.2, ate: pal("07", "pode") + 1.4, fundo: "hospital", bloco: "final", luz: "dia",
    cam: [[R_PAC[0], R_PAC[1], 2.4], [R_PAC[0], R_PAC[1], 2.8]], at: { Paciente: { expr: "feliz", olhar: [1, 0], lagrima: true } } },
  { id: "continua", de: pal("07", "pode") + 1.4, ate: PRETO, fundo: "hospital", bloco: "final", luz: "dia",
    cam: [[R_IRM[0], R_IRM[1] + 40, 2.2], [600, 1250, 1.2]],
    at: { Paciente: { expr: "feliz", olhar: [1, 0], lagrima: true }, Irmao: { expr: "feliz", olhar: [-1, -0.2], lagrima: true } } },
];

const P = Object.fromEntries(SHOTS.map((s) => [s.id, s]));
const dentro = (t: number, id: string) => sobe(t, P[id].de, P[id].ate);
const BATIDAS = [0.9, 1.3, 2.4, 2.8, 3.9];
const T_PARA = P.parou.de + 0.7;

const cenario = ({ t, shot }: Contexto) => {
  switch (shot.fundo) {
    case "corredor": return <CorredorSonho t={t} />;
    case "corredorAberto": return <CorredorSonho t={t} porta={shot.id === "pede" ? sobe(t, P.pede.de, P.pede.de + 0.5) : 1} ritmo={shot.id === "relogio" ? 1 - 0.7 * dentro(t, "relogio") : 0.6} />;
    case "corredorFim": return <CorredorSonho t={t} saida={1} parado={t >= T_PARA} ritmo={0.3}
      desfaz={shot.id === "corre" ? dentro(t, "corre") * 0.5 : shot.id === "abriu" ? 0.5 + 0.4 * dentro(t, "abriu") : 0.5} />;
    case "lab": return <LabSono t={t} />;
    case "labIntruso": return <LabSono t={t} intruso={dentro(t, "intruso")} />;
    case "cidade": return <CidadeDobrada t={t} dobra={dentro(t, "cidade")} />;
    case "estacao": return <EstacaoVazia t={t} />;
    default: return <Hospital t={t} relogio="16:20" />;
  }
};

const Livro = ({ aberto = true, s = 1 }: { aberto?: boolean; s?: number }) => (
  <g transform={`scale(${s})`}>
    {aberto ? (
      <g>
        <path d="M-90 -50 Q-45 -70 0 -50 L0 50 Q-45 30 -90 50Z" fill="#fffaf0" stroke="#7a4a3a" strokeWidth={6} />
        <path d="M90 -50 Q45 -70 0 -50 L0 50 Q45 30 90 50Z" fill="#fffaf0" stroke="#7a4a3a" strokeWidth={6} />
        {[-30, -10, 10].map((y) => <g key={y}><line x1={-74} y1={y} x2={-16} y2={y + 6} stroke="#8e99a3" strokeWidth={4} /><line x1={16} y1={y + 6} x2={74} y2={y} stroke="#8e99a3" strokeWidth={4} /></g>)}
      </g>
    ) : <rect x={-60} y={-80} width={120} height={160} rx={8} fill="#7a4a3a" />}
  </g>
);

const itens = ({ t, shot }: Contexto) => {
  const item = (el: ReactNode) => [{ y: 2000, el }];
  if (["grava", "irmao", "livro", "responde", "continua"].includes(shot.id)) {
    return item(
      <g key="l">
        <g transform={`translate(${R_IRM[0]} ${R_IRM[1] + 250})`}><Livro /></g>
        {shot.id === "grava" && (
          <g transform="translate(640 1470)">
            <rect x={-50} y={-30} width={100} height={60} rx={10} fill="#14181e" stroke="#8e99a3" strokeWidth={5} />
            <circle cx={-20} cy={0} r={12} fill="#e0352a" opacity={Math.sin(t * 5) > 0 ? 1 : 0.3} />
            {[0, 1, 2].map((i) => <circle key={i} r={40 + ((t * 130 + i * 70) % 210)} fill="none" stroke="#ffd166" strokeWidth={6} opacity={0.6 - ((t * 130 + i * 70) % 210) / 400} />)}
          </g>
        )}
      </g>,
    );
  }
  if (shot.id === "corre" || shot.id === "mao" || shot.id === "abriu") {
    return item(
      <g key="v" transform="translate(540 1070)">
        {[0, 1, 2].map((i) => <circle key={i} r={60 + ((t * 150 + i * 90) % 270)} fill="none" stroke="#ffd166" strokeWidth={6} opacity={0.5 - ((t * 150 + i * 90) % 270) / 600} />)}
      </g>,
    );
  }
  return [];
};

const frente = ({ shot }: Contexto) => (shot.fundo === "hospital" ? <Cama /> : null);

// ---------- sobreposições ----------
const Gravacao = ({ t, p }: { t: number; p: number }) => (
  <AbsoluteFill style={{ alignItems: "center", background: "rgba(10,6,24,0.55)" }}>
    <div style={{ marginTop: 240, width: 880, boxSizing: "border-box", padding: "30px 40px", background: "rgba(20,14,40,0.93)", border: "5px solid #ffd166", borderRadius: 16, boxShadow: "0 0 70px rgba(255,209,102,0.35)", color: "#f7ecd4", fontFamily: FONT }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 38, letterSpacing: 4, color: "#ffd166" }}><span>GRAVAÇÃO</span><span style={{ opacity: Math.sin(t * 6) > 0 ? 1 : 0.3 }}>● REPRODUZINDO</span></div>
      <svg width={800} height={90} viewBox="0 0 800 90" style={{ marginTop: 10 }}>{Array.from({ length: 50 }, (_, i) => <rect key={i} x={i * 16} y={45 - Math.abs(Math.sin(i * 0.7 + t * 9)) * 40} width={9} height={Math.abs(Math.sin(i * 0.7 + t * 9)) * 80 + 4} fill="#ffd166" />)}</svg>
      <div style={{ display: "flex", gap: 30, marginTop: 16, alignItems: "center" }}>
        <svg width={250} height={300} viewBox="0 0 360 430" style={{ background: "#2a2050", border: "4px solid #ffd166" }}><g transform="translate(180 810) scale(0.92)"><Ator v={MAIS_VELHA} t={t} expr="sereno" fechado fase={2} /></g></svg>
        <div style={{ fontSize: 52, lineHeight: 1.3 }}>
          <div>PACIENTE: <span style={{ color: "#ffd166" }}>HELENA</span></div>
          <div style={{ opacity: p > 0.3 ? 1 : 0 }}>ESTADO: <span style={{ color: "#ff8a5f" }}>EM COMA</span></div>
          <div style={{ opacity: p > 0.55 ? 1 : 0, fontSize: 44 }}>DESDE UM ACIDENTE</div>
          <div style={{ opacity: p > 0.55 ? 1 : 0, fontSize: 44 }}>NA INFÂNCIA</div>
        </div>
      </div>
      {/* lembrança em fragmentos */}
      <svg width={800} height={230} viewBox="0 0 800 230" style={{ marginTop: 16, opacity: sobe(p, 0.6, 0.8) }}>
        {[[40, 20, -8], [300, 40, 5], [560, 10, -4]].map(([x, y, a], i) => (
          <g key={i} transform={`translate(${x + Math.sin(t * 2 + i) * 6} ${y}) rotate(${a})`}>
            <path d="M0 20 L60 0 L200 14 L190 170 L90 190 L10 150Z" fill="#b9c7cf" stroke="#f7ecd4" strokeWidth={5} />
            {i === 0 && <g><circle cx={70} cy={130} r={26} fill="none" stroke="#3a2a4a" strokeWidth={7} /><circle cx={150} cy={130} r={26} fill="none" stroke="#3a2a4a" strokeWidth={7} /><path d="M70 130 L100 80 L140 80 L150 130 M100 80 L90 60" stroke="#b3402e" strokeWidth={7} fill="none" /></g>}
            {i === 1 && <g><rect x={60} y={60} width={90} height={80} fill="#f4f7f8" /><rect x={96} y={72} width={18} height={56} fill="#e0352a" /><rect x={77} y={91} width={56} height={18} fill="#e0352a" /></g>}
            {i === 2 && <g><g transform="translate(70 196) scale(0.16)"><Ator v={{ ...HELENA }} t={t} expr="feliz" /></g><g transform="translate(140 196) scale(0.13)"><Ator v={MENINO} t={t} expr="feliz" /></g></g>}
          </g>
        ))}
      </svg>
    </div>
  </AbsoluteFill>
);

const Pagina = ({ t }: { t: number }) => (
  <AbsoluteFill style={{ alignItems: "center" }}>
    <div style={{ marginTop: 250, width: 640, height: 430, background: "#fffaf0", border: "8px solid #7a4a3a", borderRadius: 10, fontFamily: "'DejaVu Serif', Georgia, serif", color: "#3a2a22", boxSizing: "border-box", padding: "26px 34px", transform: `rotate(${-3 + Math.sin(t) * 0.6}deg)`, boxShadow: "0 20px 60px rgba(0,0,0,0.35)" }}>
      <div style={{ fontFamily: FONT, fontSize: 54, letterSpacing: 4, textAlign: "center", color: "#b3402e" }}>ÚLTIMA PÁGINA</div>
      {[0.95, 0.85, 0.9, 0.6].map((w, i) => <div key={i} style={{ height: 16, width: `${w * 100}%`, background: "#c9bfae", marginTop: 20 }} />)}
      <svg width={560} height={150} viewBox="0 0 560 150" style={{ marginTop: 14 }}>
        <g stroke="#b3402e" strokeWidth={6} fill="none" strokeLinecap="round">
          <circle cx={200} cy={40} r={22} /><path d="M200 62 L200 110 M200 78 L170 96 M200 78 L246 90 M200 110 L182 144 M200 110 L218 144" />
          <circle cx={290} cy={64} r={16} /><path d="M290 80 L290 116 M290 92 L246 90 M290 92 L312 104 M290 116 L278 144 M290 116 L302 144" />
        </g>
        <path d="M360 40 q16 -22 32 0 q-16 26 -32 0Z" fill="#e0572a" />
      </svg>
    </div>
  </AbsoluteFill>
);

const sobre = ({ t, shot }: Contexto) => {
  switch (shot.id) {
    case "gravacao": return <Gravacao t={t} p={dentro(t, "gravacao")} />;
    case "livro": return <Pagina t={t} />;
    default: return null;
  }
};

const fx = ({ t }: Contexto) => ({
  impacto: Math.max(...BATIDAS.map((b) => decai(t, b, 0.25) * 0.4), decai(t, T_PARA, 0.6), decai(t, P.rostoH.de, 0.4)),
  flash: Math.max(decai(t, P.rostoH.de, 0.4), decai(t, T_PARA, 0.4)),
  clarao: Math.max(
    decai(t, P.cidade.de, 0.5) * 0.7, decai(t, T_DIAS, 0.5), ...crescer.slice(1).map((c) => decai(t, c.de, 0.3) * 0.9),
    decai(t, P.mao.de, 0.5) * 0.8,
    sobe(t, P.abriu.de + 0.6, P.abriu.ate) * (t < P.abriu.ate ? 1 : 0), decai(t, P.fechados.de, 1.2),
  ),
  claraoCor: "#fffbe6",
});

export const Sonho = () => (
  <Episodio
    manifesto={manifesto} shots={SHOTS} blocos={BLOCOS} preto={PRETO} elenco={ELENCO} vinheta={0.55}
    cenario={cenario} sobre={sobre} itens={itens} frente={frente} fx={fx}
    corLegenda={() => "#ffffff"}
    final={() => (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", color: "#e8e4dc", fontFamily: FONT, fontSize: 90, letterSpacing: 10 }}>FIM</AbsoluteFill>
    )}
    sons={
      <>
        <Som fps={FPS} em={0} src="sonho/sfx/musica.mp3" volume={0.32} dur={manifesto.duracao} some={1.8} />
        {BATIDAS.map((b) => <Som key={b} fps={FPS} em={b} src="ep01/sfx/batida.mp3" volume={0.7} />)}
        <Som fps={FPS} em={0} src="minutos/sfx/tique.mp3" volume={0.4} dur={3} />
        <Som fps={FPS} em={P.pede.de} src="trem/sfx/porta.mp3" volume={0.7} />
        <Som fps={FPS} em={P.relogio.de} src="minutos/sfx/tique.mp3" volume={0.7} dur={P.lab.de - P.relogio.de} some={0.3} />
        <Som fps={FPS} em={P.lab.de} src="tempo/sfx/central.mp3" volume={0.35} dur={P.cidade.de - P.lab.de} some={0.5} />
        <Som fps={FPS} em={P.intruso.de + 0.4} src="futuro/sfx/bipes.mp3" volume={0.5} dur={2.4} some={0.3} />
        <Som fps={FPS} em={P.cidade.de} src="minutos/sfx/reverso.mp3" volume={0.6} />
        <Som fps={FPS} em={P.estacao.de} src="mare01/sfx/vento.mp3" volume={0.35} dur={P.gravacao.de - P.estacao.de} some={0.6} />
        <Som fps={FPS} em={P.rostoH.de} src="ep01/sfx/impacto.mp3" volume={0.6} />
        <Som fps={FPS} em={P.gravacao.de} src="ep01/sfx/estatica.mp3" volume={0.4} />
        <Som fps={FPS} em={P.lembranca.de + 0.3} src="futuro/sfx/dissolve.mp3" volume={0.5} dur={T_DIAS - P.lembranca.de} some={0.4} />
        <Som fps={FPS} em={T_DIAS} src="ep02/sfx/bipe.mp3" volume={0.5} />
        <Som fps={FPS} em={crescer[1].de} src="ep02/sfx/bipe.mp3" volume={0.5} />
        <Som fps={FPS} em={crescer[2].de} src="ep02/sfx/bipe.mp3" volume={0.5} />
        <Som fps={FPS} em={P.corre.de} src="minutos/sfx/acelera.mp3" volume={0.6} dur={P.parou.de - P.corre.de} some={0.3} />
        <Som fps={FPS} em={P.parou.de} src="minutos/sfx/tique.mp3" volume={0.9} dur={0.7} />
        <Som fps={FPS} em={T_PARA} src="ep02/sfx/rachadura.mp3" volume={0.7} />
        <Som fps={FPS} em={P.abriu.de} src="trem/sfx/brilho.mp3" volume={0.9} />
        <Som fps={FPS} em={P.fechados.de + 0.4} src="ep02/sfx/bipe.mp3" volume={0.45} />
        <Som fps={FPS} em={P.acorda.de + 0.3} src="ep02/sfx/bipe.mp3" volume={0.45} />
        <Som fps={FPS} em={P.irmao.de + 0.8} src="ep02/sfx/bipe.mp3" volume={0.35} />
      </>
    }
  />
);

export const SONHO_DURACAO = Math.round(manifesto.duracao * FPS);
export const SONHO_FPS = FPS;
