import { Ator, type Visual } from "../serie/Ator";
import { mix } from "../abismo/cenarios";

// Cenários do curta "A Última Repetição": campo de batalha na cidade, alojamento,
// corte do subsolo com o reator e centro de comando.

const FONTE = "Anton, Impact, sans-serif";
const acaso = (i: number, k: number) => {
  const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const TODO = { x: -200, y: -200, width: 1480, height: 2320 };
export const SOLDADO: Visual = { pele: "#c68a5e", cabelo: "#17110e", roupa: "#4f5d3f", calca: "#3a4530", estilo: "gorro", detalhe: "#3a4530" };

/** Máquina visitante: disco metálico flutuante com uma luz central. */
export const Visitante = ({ t, cor = "#7ef0ff", fase = 0 }: { t: number; cor?: string; fase?: number }) => {
  const b = Math.sin(t * 2.4 + fase) * 10;
  return (
    <g transform={`translate(0 ${b})`}>
      {[-1, 0, 1].map((l) => (
        <path key={l} d={`M${l * 46} 20 Q${l * 70 + Math.sin(t * 3 + fase + l) * 14} 90 ${l * 56 + Math.sin(t * 3 + fase + l) * 22} 170`} stroke="#6f7c88" strokeWidth={12} fill="none" strokeLinecap="round" />
      ))}
      <ellipse cx={0} cy={0} rx={130} ry={44} fill="#b9c4cf" stroke="#3d4853" strokeWidth={7} />
      <path d="M-74 -18 Q0 -110 74 -18Z" fill="#dfe6ec" stroke="#3d4853" strokeWidth={7} />
      <ellipse cx={0} cy={6} rx={130} ry={16} fill="#3d4853" opacity={0.5} />
      <circle cx={0} cy={-34} r={22} fill={cor} /><circle cx={0} cy={-34} r={60} fill={cor} opacity={0.22 + 0.1 * Math.sin(t * 5 + fase)} />
      {[-90, -45, 45, 90].map((x) => <circle key={x} cx={x} cy={8} r={7} fill={cor} opacity={0.5 + 0.5 * Math.sin(t * 6 + x)} />)}
    </g>
  );
};

// ---------- a cidade sob invasão ----------
export type Formacao = "ataque" | "desvio" | "guarda" | "sobem" | "calmo" | "nenhuma";
export const HOSPITAL: [number, number] = [210, 1180];
export const ANTENA: [number, number] = [830, 720];

export const Campo = ({ t, sol = 0, tiros = 0, formacao = "ataque", antena = 0, corLuz = "#ffb347", descida = 1 }: {
  t: number;
  /** Do escuro antes do amanhecer (0) ao sol nascido (1). */
  sol?: number;
  /** Intensidade do combate, de 0 a 1. */
  tiros?: number; formacao?: Formacao;
  /** Brilho da antena, de 0 a 1. */
  antena?: number; corLuz?: string;
  /** Chegada das máquinas vindas do céu, de 0 a 1. */
  descida?: number;
}) => {
  const n = 7;
  const pos = (i: number): [number, number, number] => {
    const s = 0.34 + (i % 3) * 0.1;
    switch (formacao) {
      case "desvio": { const a = ((t * 0.5 + i / n) % 1) * Math.PI; return [HOSPITAL[0] + 60 - Math.cos(a) * 420, HOSPITAL[1] - 230 - Math.sin(a) * 330, s]; }
      case "guarda": { const a = (i / n) * Math.PI * 2 + t * 0.5; return [ANTENA[0] - 40 + Math.cos(a) * 250, ANTENA[1] + 200 + Math.sin(a) * 120, s]; }
      case "sobem": return [140 + i * 130, 900 - i * 40 - ((t * 120) % 4000) * 0.5, s];
      case "calmo": return [140 + i * 130, 700 + (i % 3) * 90, s];
      default: return [120 + i * 138 + Math.sin(t * 0.8 + i) * 60, 520 + (i % 3) * 150 + Math.cos(t * 0.6 + i * 2) * 50 - (1 - descida) * 1200, s];
    }
  };
  return (
    <g>
      <defs>
        <linearGradient id="rp-ceu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mix("#141a33", "#5fa3dd", sol)} /><stop offset="0.6" stopColor={mix("#5a3a55", "#f6c88c", sol)} /><stop offset="1" stopColor={mix("#c9703e", "#ffe9b8", sol)} />
        </linearGradient>
      </defs>
      <rect {...TODO} fill="url(#rp-ceu)" />
      <circle cx={540} cy={1320 - sol * 420} r={150} fill="#fff1c9" opacity={0.4 + sol * 0.6} /><circle cx={540} cy={1320 - sol * 420} r={420} fill="#ffd98a" opacity={0.25} />
      {Array.from({ length: 11 }, (_, i) => <rect key={i} x={-60 + i * 110} y={1050 - acaso(i, 1) * 330} width={96} height={900} fill={mix("#2a2238", "#7f7396", sol)} />)}
      {tiros > 0 && Array.from({ length: 4 }, (_, i) => {
        const v = (t * 0.7 + acaso(i, 9)) % 1;
        return <circle key={i} cx={100 + acaso(i, 5) * 880} cy={1000 - acaso(i, 6) * 200} r={30 + v * 90} fill="#ffb347" opacity={(1 - v) * 0.5 * tiros} />;
      })}
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={-90 + i * 160} y={1250 - acaso(i, 2) * 180} width={140} height={700} fill={mix("#1c1826", "#5a5068", sol)} />)}
      {/* hospital */}
      <g>
        <rect x={50} y={1040} width={330} height={480} fill={mix("#b9c2cc", "#f4f7f8", sol)} />
        {Array.from({ length: 12 }, (_, i) => <rect key={i} x={76 + (i % 4) * 76} y={1160 + Math.floor(i / 4) * 100} width={46} height={60} fill="#ffe9a8" opacity={0.85} />)}
        <rect x={170} y={1058} width={90} height={90} fill="#fff" /><rect x={204} y={1066} width={22} height={74} fill="#e0352a" /><rect x={178} y={1092} width={74} height={22} fill="#e0352a" />
        {formacao === "desvio" && <path d="M-30 1540 Q-30 880 215 880 Q460 880 460 1540" fill="none" stroke="#7ef0ff" strokeWidth={8} strokeDasharray="26 22" opacity={0.6 + 0.3 * Math.sin(t * 6)} />}
      </g>
      {/* antena antiga */}
      <g transform="translate(830 1520)">
        <path d="M-90 0 L-14 -800 M90 0 L14 -800 M-78 -130 L64 -260 M78 -130 L-64 -260 M-58 -330 L44 -460 M58 -330 L-44 -460 M-38 -530 L28 -660 M38 -530 L-28 -660" stroke={mix("#2a2a33", "#56566a", sol)} strokeWidth={12} fill="none" />
        <line x1={0} y1={-800} x2={0} y2={-900} stroke="#2a2a33" strokeWidth={8} />
        <circle cy={-900} r={14} fill="#ff5a4a" opacity={0.6 + 0.4 * Math.sin(t * 4)} />
        {antena > 0 && [0, 1, 2].map((i) => <circle key={i} cy={-800} r={60 + ((t * 140 + i * 90) % 270)} fill="none" stroke="#7ef0ff" strokeWidth={8} opacity={antena * (0.7 - ((t * 140 + i * 90) % 270) / 400)} />)}
        {antena > 0 && <circle cy={-800} r={150} fill="#7ef0ff" opacity={0.2 * antena} />}
      </g>
      {/* chão */}
      <rect x={-200} y={1520} width={1480} height={600} fill={mix("#15131c", "#4a4552", sol)} />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-100 + i * 150} 1540 l40 -34 l50 20 l30 -16 l40 30Z`} fill={mix("#221f2b", "#5e5866", sol)} />)}
      {/* rajadas */}
      {tiros > 0 && Array.from({ length: 10 }, (_, i) => {
        const v = (t * 3 + acaso(i, 3)) % 1, x = 60 + acaso(i, 4) * 960;
        return <line key={i} x1={x} y1={1500 - v * 900} x2={x + (acaso(i, 7) - 0.5) * 60} y2={1500 - v * 900 - 90} stroke="#ffd166" strokeWidth={6} opacity={tiros * (1 - v)} />;
      })}
      {formacao !== "nenhuma" && Array.from({ length: n }, (_, i) => {
        const [x, y, s] = pos(i);
        return <g key={i} transform={`translate(${x} ${y}) scale(${s})`}><Visitante t={t} cor={corLuz} fase={i * 1.7} /></g>;
      })}
    </g>
  );
};

// ---------- alojamento ----------
export const Alojamento = ({ t, hora = "05:58" }: { t: number; hora?: string }) => (
  <g>
    <rect {...TODO} fill="#39403a" />
    {Array.from({ length: 7 }, (_, i) => <line key={i} x1={-200 + i * 240} y1={-200} x2={-200 + i * 240} y2={1790} stroke="#000" strokeOpacity={0.16} strokeWidth={6} />)}
    <rect x={640} y={420} width={330} height={300} rx={8} fill="#5a3a55" stroke="#22261f" strokeWidth={18} />
    <rect x={640} y={600} width={330} height={120} fill="#c9703e" opacity={0.8} />
    <g transform="translate(260 420)">
      <rect x={-180} y={-74} width={360} height={148} rx={14} fill="#0c0f14" stroke="#56636e" strokeWidth={8} />
      <text x={0} y={36} textAnchor="middle" fontFamily={FONTE} fontSize={108} fill="#ff5a4a" letterSpacing={4}>{hora.slice(0, 2)}<tspan opacity={Math.sin(t * 6) > 0 ? 1 : 0.3}>:</tspan>{hora.slice(3)}</text>
    </g>
    {/* beliche */}
    <rect x={120} y={820} width={30} height={970} fill="#22261f" /><rect x={930} y={820} width={30} height={970} fill="#22261f" />
    <rect x={120} y={900} width={840} height={36} fill="#22261f" /><rect x={150} y={840} width={780} height={64} rx={16} fill="#6b7460" />
    <rect x={120} y={1380} width={840} height={36} fill="#22261f" /><rect x={150} y={1300} width={780} height={84} rx={18} fill="#6b7460" />
    <rect x={180} y={1250} width={220} height={70} rx={30} fill="#e8e4dc" />
    <rect x={990} y={900} width={200} height={890} fill="#2c332d" stroke="#22261f" strokeWidth={8} />
    <rect {...TODO} y={1790} fill="#22261f" />
  </g>
);

// ---------- corte: combate em cima, reator embaixo ----------
export const Corte = ({ t, calor = 1, tiros = 1, abre = 0, desce = 0, feixes = 0 }: {
  t: number;
  /** Núcleo em brasa (1) a estável (0). */
  calor?: number; tiros?: number;
  /** Comporta de segurança aberta, de 0 a 1. */
  abre?: number;
  /** Máquinas descendo até o núcleo, de 0 a 1. */
  desce?: number; feixes?: number;
}) => {
  const nucleo = mix("#5cc8ff", "#ff5a2a", calor);
  return (
    <g>
      <rect {...TODO} fill="#1a1626" />
      <rect x={-200} y={-200} width={1480} height={1000} fill="#3a2a45" />
      <circle cx={540} cy={640} r={420} fill="#c9703e" opacity={0.3} />
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={-80 + i * 140} y={420 - acaso(i, 1) * 200} width={120} height={500} fill="#201a2c" />)}
      {/* soldados e rajadas na superfície */}
      {[90, 210, 880, 990].map((x, i) => <g key={x} transform={`translate(${x} 800) scale(0.22)`}><Ator v={SOLDADO} t={t} expr="bravo" pose={i < 2 ? "apontarDir" : "apontarEsq"} olhar={[i < 2 ? 1 : -1, -0.6]} fase={i} /></g>)}
      {tiros > 0 && Array.from({ length: 10 }, (_, i) => {
        const v = (t * 3.5 + acaso(i, 3)) % 1, esq = i % 2 === 0, x0 = esq ? 240 : 860, x1 = 540 + (acaso(i, 4) - 0.5) * 300;
        return <line key={i} x1={x0 + (x1 - x0) * v} y1={720 - v * 300} x2={x0 + (x1 - x0) * (v + 0.08)} y2={720 - (v + 0.08) * 300} stroke="#ffd166" strokeWidth={6} opacity={tiros} />;
      })}
      {/* máquinas tentando descer */}
      {[0, 1, 2].map((i) => {
        const x = 540 + (i - 1) * 190 * (1 - desce * 0.4), y = 330 + i * 30 + desce * (900 + (i % 2) * 60) + (desce === 0 ? Math.sin(t * 9 + i) * 14 * tiros : 0);
        return (
          <g key={i}>
            {feixes > 0 && <line x1={x} y1={y} x2={540} y2={1560} stroke="#7ef0ff" strokeWidth={14 + 6 * Math.sin(t * 20 + i)} opacity={0.75 * feixes} />}
            <g transform={`translate(${x} ${y}) scale(0.42)`}><Visitante t={t} fase={i * 2} /></g>
          </g>
        );
      })}
      {/* laje e comporta */}
      <rect x={-200} y={800} width={1480} height={120} fill="#3d454d" />
      <rect x={-200} y={800} width={1480} height={16} fill="#56636e" />
      <rect x={380} y={800} width={320} height={120} fill="#0a0d12" />
      {([-1, 1] as const).map((l) => <rect key={l} x={l === -1 ? 380 - abre * 150 : 540 + abre * 150} y={806} width={160} height={108} fill="#e6c229" stroke="#14181e" strokeWidth={8} />)}
      {/* câmara do reator */}
      <rect x={-200} y={920} width={1480} height={1200} fill="#141821" />
      {[120, 960].map((x) => <rect key={x} x={x - 40} y={920} width={80} height={900} fill={mix("#39424f", "#8a3a22", calor)} />)}
      <rect x={-200} y={1840} width={1480} height={300} fill="#0c0f14" />
      <path d="M160 1560 L400 1560 M680 1560 L920 1560" stroke={mix("#56636e", "#c2522a", calor)} strokeWidth={50} />
      <circle cx={540} cy={1560} r={330 + 30 * Math.sin(t * 5) * calor} fill={nucleo} opacity={0.16} />
      <circle cx={540} cy={1560} r={210} fill="#14181e" stroke="#56636e" strokeWidth={16} />
      <circle cx={540} cy={1560} r={170 + 8 * Math.sin(t * 8) * calor} fill={nucleo} />
      <circle cx={540} cy={1560} r={90} fill="#fff" opacity={0.5} />
      {calor > 0.4 && <path d="M400 1420 L470 1500 L440 1580 L520 1650 M660 1440 L610 1530 L680 1600 M520 1380 L560 1450" stroke="#fff3c9" strokeWidth={8} fill="none" opacity={calor * (0.6 + 0.4 * Math.sin(t * 13))} />}
      {calor > 0.4 && [0, 1].map((i) => <rect key={i} x={i ? 880 : 140} y={1000} width={60} height={34} fill="#ff3a2a" opacity={Math.sin(t * 9 + i * 3) > 0 ? 1 : 0.2} />)}
      <g transform="translate(540 1040)">
        <rect x={-210} y={-50} width={420} height={100} rx={10} fill="#0a0d12" stroke={calor > 0.4 ? "#ff5a4a" : "#5cf29a"} strokeWidth={6} />
        <text x={0} y={22} textAnchor="middle" fontFamily={FONTE} fontSize={56} fill={calor > 0.4 ? "#ff5a4a" : "#5cf29a"}>{calor > 0.4 ? "NÚCLEO CRÍTICO" : "NÚCLEO ESTÁVEL"}</text>
      </g>
    </g>
  );
};

// ---------- centro de comando ----------
export const Comando = ({ t, falha = 0, cessar = false }: { t: number; falha?: number; cessar?: boolean }) => (
  <g>
    <rect {...TODO} fill="#121a26" />
    <rect x={60} y={280} width={960} height={740} rx={14} fill="#07101a" stroke="#2c3b4f" strokeWidth={14} />
    {Array.from({ length: 9 }, (_, i) => <line key={`v${i}`} x1={110 + i * 108} y1={300} x2={110 + i * 108} y2={1000} stroke="#1c3a55" strokeWidth={3} />)}
    {Array.from({ length: 7 }, (_, i) => <line key={`h${i}`} x1={80} y1={340 + i * 100} x2={1000} y2={340 + i * 100} stroke="#1c3a55" strokeWidth={3} />)}
    <path d="M100 760 L300 620 L420 700 L620 520 L780 640 L980 480" stroke="#3d6fa3" strokeWidth={10} fill="none" />
    {!cessar && Array.from({ length: 7 }, (_, i) => <circle key={i} cx={160 + acaso(i, 1) * 760} cy={380 + acaso(i, 2) * 300} r={14 + 5 * Math.sin(t * 6 + i)} fill="#ff5a4a" />)}
    <rect x={150} y={840} width={80} height={80} fill="#fff" /><rect x={180} y={848} width={20} height={64} fill="#e0352a" /><rect x={158} y={870} width={64} height={20} fill="#e0352a" />
    {falha > 0 && (
      <g transform="translate(600 860)" opacity={falha}>
        <circle r={40 + ((t * 120) % 120)} fill="none" stroke="#ffd166" strokeWidth={8} opacity={1 - ((t * 120) % 120) / 120} />
        <path d="M0 0 L-26 -60 A28 28 0 1 1 26 -60Z" fill="#ffd166" stroke="#14181e" strokeWidth={5} />
        <rect x={50} y={-70} width={330} height={96} rx={8} fill="#14181e" stroke="#ffd166" strokeWidth={5} />
        <text x={66} y={-30} fontFamily={FONTE} fontSize={34} fill="#ffd166">FALHA NO REATOR</text><text x={66} y={10} fontFamily={FONTE} fontSize={34} fill="#fff">SUBSOLO · SETOR 7</text>
      </g>
    )}
    <rect x={80} y={300} width={920} height={70} fill={cessar ? "#12301f" : "#3a0a0a"} />
    <text x={540} y={352} textAnchor="middle" fontFamily={FONTE} fontSize={50} fill={cessar ? "#5cf29a" : "#ff5a4a"} letterSpacing={4} opacity={cessar || Math.sin(t * 8) > -0.3 ? 1 : 0.4}>{cessar ? "CESSAR-FOGO" : "CIDADE SOB ATAQUE"}</text>
    {/* consoles e operadores */}
    {[130, 950].map((x, i) => <g key={x} transform={`translate(${x} 1800) scale(0.42)`}><Ator v={SOLDADO} t={t} expr={cessar ? "surpreso" : "medo"} olhar={[i ? -1 : 1, -0.5]} fase={i + 3} /></g>)}
    <path d="M-40 1560 L330 1560 L360 1800 L-80 1800Z M750 1560 L1120 1560 L1160 1800 L720 1800Z" fill="#1c2836" />
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={(i < 6 ? 0 : 770) + (i % 6) * 54} y={1586} width={36} height={24} rx={5} fill={i % 4 ? "#3d6fa3" : "#ffb347"} opacity={0.5 + 0.5 * Math.sin(t * 5 + i)} />)}
    <rect {...TODO} y={1790} fill="#0b111a" />
    <rect {...TODO} fill={cessar ? "#5cf29a" : "#ff3a2a"} opacity={cessar ? 0.04 : 0.05 + 0.03 * Math.sin(t * 8)} />
  </g>
);
