import type { ReactNode } from "react";
import { Ator, type Visual } from "../serie/Ator";

// Cenários do resumão de "O Senhor dos Anéis". Desenho próprio, no estilo dos bonecos
// do projeto; nada aqui copia o visual dos filmes. O dourado é reservado ao Anel.

const FONTE = "Anton, Impact, sans-serif";
export const OURO = "#ffc83a";
const acaso = (i: number, k: number) => {
  const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const TODO = { x: -200, y: -200, width: 1480, height: 2320 };

const Ceu = ({ id, a, b }: { id: string; a: string; b: string }) => (
  <g>
    <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient></defs>
    <rect {...TODO} fill={`url(#${id})`} />
  </g>
);
const Estrelas = ({ t, n = 40, h = 900 }: { t: number; n?: number; h?: number }) => (
  <g>{Array.from({ length: n }, (_, i) => <circle key={i} cx={acaso(i, 1) * 1080} cy={acaso(i, 2) * h} r={1.5 + acaso(i, 3) * 2.5} fill="#fff" opacity={0.35 + 0.5 * Math.sin(t * 2 + i)} />)}</g>
);
const Serra = ({ y, cor, k = 1, amp = 260 }: { y: number; cor: string; k?: number; amp?: number }) => (
  <path d={`M-200 2120 L-200 ${y} ${Array.from({ length: 9 }, (_, i) => `L${-120 + i * 170} ${y - acaso(i, k) * amp}`).join(" ")} L1280 ${y} L1280 2120Z`} fill={cor} />
);
const Chao = ({ y = 1790, cor }: { y?: number; cor: string }) => <rect x={-200} y={y} width={1480} height={2120 - y} fill={cor} />;

/** O Um Anel. `fogo` acende as letras; origem no centro. */
export const Anel = ({ t, s = 1, fogo = 0, brilho = 1 }: { t: number; s?: number; fogo?: number; brilho?: number }) => (
  <g transform={`scale(${s})`}>
    <circle r={150} fill={OURO} opacity={(0.16 + 0.06 * Math.sin(t * 5)) * brilho} />
    <ellipse rx={78} ry={84} fill="none" stroke="#b8860b" strokeWidth={30} />
    <ellipse rx={78} ry={84} fill="none" stroke={OURO} strokeWidth={22} />
    <path d="M-66 -44 A78 84 0 0 1 30 -78" stroke="#fff3c0" strokeWidth={8} fill="none" strokeLinecap="round" />
    {fogo > 0 && <ellipse rx={78} ry={84} fill="none" stroke="#ff5a1a" strokeWidth={6} strokeDasharray="6 9 14 7 4 10" opacity={fogo * (0.7 + 0.3 * Math.sin(t * 12))} transform={`rotate(${t * 20})`} />}
  </g>
);

/** Orc: capacete, olhos amarelos e lança. */
export const Orc = ({ t, fase = 0, corre = false }: { t: number; fase?: number; corre?: boolean }) => {
  const p = corre ? Math.sin(t * 14 + fase) : Math.sin(t * 3 + fase) * 0.2;
  return (
    <g>
      <rect x={-20} y={-70} width={16} height={70} rx={6} fill="#1a1f1a" transform={`rotate(${p * 22} -12 -70)`} /><rect x={4} y={-70} width={16} height={70} rx={6} fill="#1a1f1a" transform={`rotate(${-p * 22} 12 -70)`} />
      <rect x={-34} y={-170} width={68} height={110} rx={22} fill="#2a332a" />
      <circle cy={-196} r={34} fill="#55664a" /><path d="M-38 -200 Q0 -260 38 -200 L38 -214 Q0 -276 -38 -214Z" fill="#14181a" />
      <circle cx={-12} cy={-198} r={6} fill="#ffe14a" /><circle cx={12} cy={-198} r={6} fill="#ffe14a" />
      <line x1={40} y1={-60} x2={56} y2={-300} stroke="#14181a" strokeWidth={7} /><path d="M56 -300 L44 -330 L68 -330Z" fill="#8e99a3" />
    </g>
  );
};
export const Horda = ({ t, n = 16, x0 = 0, y0 = 1700, dx = 70, corre = false, s = 0.6 }: { t: number; n?: number; x0?: number; y0?: number; dx?: number; corre?: boolean; s?: number }) => (
  <g>{Array.from({ length: n }, (_, i) => <g key={i} transform={`translate(${x0 + (i % 8) * dx + (Math.floor(i / 8) % 2) * 34} ${y0 + Math.floor(i / 8) * 70 + (corre ? Math.abs(Math.sin(t * 14 + i)) * -10 : 0)}) scale(${s})`}><Orc t={t} fase={i * 1.3} corre={corre} /></g>)}</g>
);

/** Cavaleiro em silhueta (cavalo e cavaleiro). */
export const Cavaleiro = ({ t, cor = "#0a0a10", fase = 0, capa = true }: { t: number; cor?: string; fase?: number; capa?: boolean }) => {
  const g = Math.sin(t * 12 + fase);
  return (
    <g transform={`translate(0 ${Math.abs(g) * -14})`}>
      {[-90, -50, 50, 90].map((x, i) => <rect key={x} x={x - 9} y={-110} width={18} height={110} rx={8} fill={cor} transform={`rotate(${(i % 2 ? g : -g) * 28} ${x} -110)`} />)}
      <ellipse cx={0} cy={-140} rx={130} ry={56} fill={cor} />
      <path d="M100 -160 Q170 -260 190 -220 L214 -170 L176 -160 Q150 -150 120 -120Z" fill={cor} />
      <path d={`M-120 -150 Q-200 -120 -190 ${-40 + g * 20}`} stroke={cor} strokeWidth={16} fill="none" strokeLinecap="round" />
      <path d="M-40 -180 L-20 -330 L40 -330 L50 -180Z" fill={cor} /><circle cx={12} cy={-356} r={34} fill={cor} />
      {capa && <path d={`M-30 -330 Q-150 ${-300 + g * 20} -200 ${-200 + g * 30} L-40 -200Z`} fill={cor} />}
      {capa && <path d="M-22 -366 Q12 -420 46 -366 L46 -340 L-22 -340Z" fill={cor} />}
    </g>
  );
};

/** Ent: árvore que anda, com rosto. */
export const Ent = ({ t, fase = 0 }: { t: number; fase?: number }) => {
  const p = Math.sin(t * 3 + fase);
  return (
    <g>
      <rect x={-70} y={-200} width={50} height={200} rx={16} fill="#5a4630" transform={`rotate(${p * 12} -45 -200)`} /><rect x={20} y={-200} width={50} height={200} rx={16} fill="#5a4630" transform={`rotate(${-p * 12} 45 -200)`} />
      <path d="M-90 -200 Q-110 -520 -60 -760 L60 -760 Q110 -520 90 -200Z" fill="#6b5236" />
      <path d={`M-70 -560 Q-220 ${-600 + p * 20} -260 ${-460 + p * 30}`} stroke="#6b5236" strokeWidth={34} fill="none" strokeLinecap="round" /><path d={`M70 -560 Q220 ${-620 - p * 20} 250 ${-760 - p * 30}`} stroke="#6b5236" strokeWidth={34} fill="none" strokeLinecap="round" />
      {[[-40, -820, 120], [50, -860, 130], [0, -940, 110], [-120, -760, 80], [130, -770, 84]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? "#4f8a45" : "#5c9a4f"} />)}
      <circle cx={-30} cy={-620} r={18} fill="#ffe9a8" /><circle cx={30} cy={-620} r={18} fill="#ffe9a8" /><circle cx={-30} cy={-620} r={8} fill="#2a1a0c" /><circle cx={30} cy={-620} r={8} fill="#2a1a0c" />
      <path d="M-40 -560 Q0 -530 40 -560 Q20 -470 0 -440 Q-20 -470 -40 -560Z" fill="#8fae6a" />
    </g>
  );
};

/** O Olho de Sauron; `olhar` desloca a pupila (-1 a 1). */
export const Olho = ({ t, olhar = 0, s = 1 }: { t: number; olhar?: number; s?: number }) => (
  <g transform={`scale(${s})`}>
    <circle r={300} fill="#ff5a1a" opacity={0.14 + 0.05 * Math.sin(t * 5)} />
    <path d="M-220 0 Q0 -170 220 0 Q0 170 -220 0Z" fill="#ff7a2a" stroke="#ffd166" strokeWidth={8} />
    <path d="M-150 0 Q0 -110 150 0 Q0 110 -150 0Z" fill="#ffb347" />
    <ellipse cx={olhar * 70} rx={18 + 6 * Math.sin(t * 7)} ry={104} fill="#0a0406" />
  </g>
);
const TorreNegra = ({ t, olhar = 0, cai = 0 }: { t: number; olhar?: number; cai?: number }) => (
  <g transform={`translate(0 ${cai * cai * 700}) rotate(${cai * 14})`} opacity={1 - cai * 0.3}>
    <path d="M-110 0 L-70 -900 L-150 -1000 L-60 -980 L-40 -1080 L0 -1000 L40 -1080 L60 -980 L150 -1000 L70 -900 L110 0Z" fill="#0c0a0e" />
    {[-700, -500, -300].map((y) => <rect key={y} x={-14} y={y} width={28} height={50} fill="#ff5a1a" opacity={0.7} />)}
    {cai < 0.6 && <g transform="translate(0 -1090)"><Olho t={t} olhar={olhar} s={0.8} /></g>}
  </g>
);

// ---------- 1. a forja e o Senhor do Escuro ----------
export const Forja = ({ t, fase = "forja", queda = 0 }: { t: number; fase?: "forja" | "senhor" | "rio"; queda?: number }) => (
  <g>
    <rect {...TODO} fill={fase === "rio" ? "#0a1622" : "#140806"} />
    {fase !== "rio" && <g>
      <circle cx={540} cy={1500} r={900} fill="#ff5a1a" opacity={0.18 + 0.05 * Math.sin(t * 4)} />
      <path d="M-200 1500 Q200 1380 540 1460 Q880 1380 1280 1500 L1280 2120 L-200 2120Z" fill="#ff5a1a" />
      <path d="M-200 1560 Q300 1470 700 1560 Q1000 1500 1280 1570 L1280 2120 L-200 2120Z" fill="#ffb347" opacity={0.8} />
      {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={acaso(i, 1) * 1080} cy={1500 - ((t * (120 + acaso(i, 2) * 200) + i * 90) % 900)} r={5 + acaso(i, 3) * 6} fill="#ffb347" opacity={0.8} />)}
      <Serra y={1300} cor="#0a0406" k={3} amp={700} />
    </g>}
    {fase === "senhor" && (
      <g transform={`translate(540 1800)`} opacity={1 - queda}>
        <g transform={`translate(${Math.sin(t * 60) * queda * 30} 0)`}>
          <path d="M-190 0 L-150 -700 L-230 -560 L-120 -760 L-90 -980 L-40 -820 L0 -1060 L40 -820 L90 -980 L120 -760 L230 -560 L150 -700 L190 0Z" fill="#050305" />
          <path d="M-60 -780 L-20 -760 M60 -780 L20 -760" stroke="#ff5a1a" strokeWidth={10} />
          <path d="M150 -640 L300 -760 L320 -720" stroke="#050305" strokeWidth={46} fill="none" strokeLinecap="round" />
          <g transform="translate(316 -752) scale(0.5)"><Anel t={t} /></g>
        </g>
      </g>
    )}
    {fase === "senhor" && queda > 0 && Array.from({ length: 26 }, (_, i) => <rect key={i} x={540 + (acaso(i, 1) - 0.5) * 300 + (acaso(i, 3) - 0.5) * 1200 * queda} y={900 + acaso(i, 2) * 800 - queda * 300 * acaso(i, 4)} width={30} height={40} fill="#050305" opacity={1 - queda * 0.6} transform={`rotate(${queda * 300 * acaso(i, 5)} 540 1300)`} />)}
    {fase === "rio" && <g>
      {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${-200 + ((t * 60 + i * 190) % 1500)} ${300 + i * 150} q40 -14 80 0 q40 14 80 0`} stroke="#27506b" strokeWidth={6} fill="none" />)}
      <path d="M-200 1700 Q300 1600 700 1700 Q1000 1640 1280 1700 L1280 2120 L-200 2120Z" fill="#1c2a22" />
      {[[200, 1720], [760, 1760], [960, 1690]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={90} ry={34} fill="#27342c" />)}
    </g>}
  </g>
);

// ---------- 2. o Condado ----------
export const Condado = ({ t, noite = 0, perto = false }: { t: number; noite?: number; perto?: boolean }) => (
  <g>
    <Ceu id="an-cond" a={noite ? "#101833" : "#6fb8e8"} b={noite ? "#2a3350" : "#f6e9c0"} />
    {noite ? <Estrelas t={t} /> : <g><circle cx={860} cy={300} r={90} fill="#fff6c9" />{[140, 620].map((x, i) => <ellipse key={x} cx={(x + t * 10) % 1400 - 100} cy={420 + i * 120} rx={150} ry={36} fill="#fff" opacity={0.85} />)}</g>}
    <path d="M-200 1100 Q200 900 560 1060 Q900 900 1280 1080 L1280 2120 L-200 2120Z" fill={noite ? "#1f3a2a" : "#7fc46a"} />
    <path d="M-200 1400 Q300 1220 700 1380 Q1000 1280 1280 1400 L1280 2120 L-200 2120Z" fill={noite ? "#1a3024" : "#6ab35a"} />
    {(perto ? [[540, 1640, 2.1, "#3f8a4a"]] : [[220, 1330, 0.8, "#3f6f8f"], [820, 1280, 0.7, "#b3402e"], [540, 1640, 1.3, "#3f8a4a"]]).map(([x, y, s, c], i) => (
      <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M-260 0 Q0 -420 260 0Z" fill={noite ? "#24452f" : "#8fd17a"} />
        <circle cy={-70} r={100} fill="#f4e3c0" /><circle cy={-70} r={84} fill={c as string} /><circle cx={0} cy={-70} r={9} fill="#f4e3c0" />
        <circle cx={-170} cy={-60} r={34} fill="#ffe9a8" stroke="#f4e3c0" strokeWidth={8} /><circle cx={170} cy={-60} r={34} fill="#ffe9a8" stroke="#f4e3c0" strokeWidth={8} />
        <rect x={110} y={-300} width={30} height={90} fill="#8a5a3a" />
        {!noite && [0, 1, 2].map((k) => <circle key={k} cx={125 + Math.sin(t + k) * 14} cy={-320 - ((t * 40 + k * 60) % 180)} r={16 + k * 6} fill="#fff" opacity={0.5} />)}
      </g>
    ))}
    {!perto && [[80, 1500], [960, 1560]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`}><rect x={-14} y={-160} width={28} height={160} fill="#8a5a3a" /><circle cy={-220} r={110} fill={noite ? "#24452f" : "#5c9a4f"} /></g>)}
    <path d="M-200 1790 Q540 1740 1280 1790 L1280 2120 L-200 2120Z" fill={noite ? "#16281e" : "#5aa04c"} />
    <path d="M380 2120 Q460 1900 540 1660 Q620 1900 700 2120Z" fill="#d9c49a" opacity={0.9} />
  </g>
);

// ---------- estrada à noite com os cavaleiros negros ----------
export const Estrada = ({ t }: { t: number }) => (
  <g>
    <Ceu id="an-estr" a="#070a18" b="#1c2438" />
    <Estrelas t={t} />
    <circle cx={200} cy={320} r={80} fill="#e9eef7" opacity={0.9} />
    {Array.from({ length: 9 }, (_, i) => <g key={i} transform={`translate(${-80 + i * 150} 1500)`}><rect x={-22} y={-700} width={44} height={700} fill="#0c1016" /><circle cy={-760} r={170} fill="#0f1a16" /></g>)}
    <rect x={-200} y={1500} width={1480} height={620} fill="#141a16" />
    <path d="M-200 1700 L1280 1620 L1280 1900 L-200 2000Z" fill="#2a2a26" />
    {Array.from({ length: 5 }, (_, i) => <g key={i} transform={`translate(${((t * 420 + i * 300) % 1700) - 300} ${1760 + (i % 2) * 70}) scale(${0.9 + (i % 2) * 0.2})`}><Cavaleiro t={t} fase={i * 2} /></g>)}
    {Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={540 + Math.sin(t * 0.4 + i * 2) * 300} cy={1560 + i * 60} rx={600} ry={50} fill="#9fb5d9" opacity={0.08} />)}
  </g>
);

// ---------- Valfenda ----------
export const Valfenda = ({ t }: { t: number }) => (
  <g>
    <Ceu id="an-valf" a="#7fb3d9" b="#f3e3c0" />
    <Serra y={1100} cor="#8a9bb0" k={5} amp={500} />
    <Serra y={1300} cor="#5f7f6a" k={6} amp={300} />
    {[260, 760].map((x, i) => <g key={x}><rect x={x - 26} y={600 + i * 80} width={52} height={900} fill="#dff3ff" opacity={0.85} /><rect x={x - 26 + ((t * 80) % 40)} y={600 + i * 80} width={8} height={900} fill="#fff" opacity={0.6} /></g>)}
    {[[160, 1200], [540, 1080], [900, 1220]].map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y})`}>
        <path d="M-130 300 L-130 0 Q0 -200 130 0 L130 300Z" fill="#f4ecd9" stroke="#b9a98a" strokeWidth={8} /><path d="M-80 300 L-80 40 Q0 -90 80 40 L80 300Z" fill="#9fc0d8" />
        <path d="M-150 0 Q0 -240 150 0" stroke="#b9a98a" strokeWidth={14} fill="none" />
      </g>
    ))}
    <Chao y={1500} cor="#c9bfa8" />
    <ellipse cx={540} cy={1700} rx={420} ry={90} fill="#b5ab94" />
    <g transform="translate(540 1640)"><rect x={-90} y={-60} width={180} height={60} rx={10} fill="#e8e0cc" stroke="#9a907a" strokeWidth={6} /><rect x={-30} y={0} width={60} height={110} fill="#b5ab94" /></g>
    {Array.from({ length: 10 }, (_, i) => <path key={i} d="M-10 0 Q0 -12 10 0 Q0 12 -10 0Z" transform={`translate(${(t * 80 + i * 130) % 1300 - 100} ${700 + acaso(i, 1) * 900 + Math.sin(t * 2 + i) * 30}) rotate(${t * 120 + i * 40})`} fill="#e0a030" />)}
  </g>
);

// ---------- Moria ----------
export const Moria = ({ t, balrog = 0, quebra = 0 }: { t: number; balrog?: number; quebra?: number }) => (
  <g>
    <rect {...TODO} fill="#07080c" />
    {Array.from({ length: 6 }, (_, i) => <g key={i}><rect x={-120 + i * 240} y={-200} width={90} height={1500} fill="#141820" /><rect x={-140 + i * 240} y={200} width={130} height={40} fill="#1c222c" /></g>)}
    <rect x={-200} y={1900} width={1480} height={300} fill="#ff5a1a" opacity={0.25 + 0.1 * Math.sin(t * 3)} />
    {balrog > 0 && (
      <g transform={`translate(${1100 - balrog * 280} 1500)`}>
        <circle cy={-420} r={520} fill="#ff5a1a" opacity={0.2} />
        <path d="M-200 0 L-170 -500 L-330 -760 L-150 -680 L-110 -900 L-40 -700 L0 -820 L40 -700 L110 -900 L150 -680 L330 -760 L170 -500 L200 0Z" fill="#1a0806" />
        <circle cx={-50} cy={-640} r={18} fill="#ffb347" /><circle cx={50} cy={-640} r={18} fill="#ffb347" />
        {[0, 1, 2, 3, 4].map((k) => <path key={k} d="M-50 0 Q-64 -110 0 -210 Q64 -110 50 0Z" transform={`translate(${-200 + k * 100} ${-760 - (k % 2) * 60}) scale(${0.8 + 0.4 * Math.sin(t * 11 + k * 2)})`} fill={["#ff7a2a", "#ffd166", "#ff5a1a"][k % 3]} opacity={0.9} />)}
        <path d={`M-170 -420 Q-420 ${-380 + Math.sin(t * 6) * 60} -520 -200`} stroke="#ff7a2a" strokeWidth={14} fill="none" />
      </g>
    )}
    {/* a ponte estreita */}
    <path d={`M-200 1500 L${520 - quebra * 40} 1500 L${500 - quebra * 40} 1560 L-200 1560Z`} fill="#2a303a" />
    <g transform={`translate(0 ${quebra * quebra * 900}) rotate(${quebra * 20} 760 1500)`}><path d="M540 1500 L1280 1500 L1280 1560 L560 1560Z" fill="#2a303a" /></g>
  </g>
);

// ---------- bosque (rio, Fangorn, clareira) ----------
export const Bosque = ({ t, tipo = "rio", luz = 0, extra }: { t: number; tipo?: "rio" | "fangorn" | "clareira"; luz?: number; extra?: ReactNode }) => (
  <g>
    <Ceu id={`an-bos-${tipo}`} a={tipo === "fangorn" ? "#16261c" : "#7fb0a8"} b={tipo === "fangorn" ? "#2f4a34" : "#e9e3b8"} />
    {Array.from({ length: 10 }, (_, i) => (
      <g key={i} transform={`translate(${-100 + i * 140} 1560)`}>
        <rect x={-30 - (i % 3) * 8} y={-1300} width={60 + (i % 3) * 16} height={1300} fill={tipo === "fangorn" ? "#2a2218" : "#5a4630"} />
        <circle cy={-1300 + (i % 2) * 200} r={230} fill={tipo === "fangorn" ? (i % 2 ? "#1f3a26" : "#27452c") : i % 2 ? "#5c9a4f" : "#6fae5a"} />
      </g>
    ))}
    {luz > 0 && <g opacity={luz}><circle cx={540} cy={1100} r={700} fill="#fff" opacity={0.5} />{Array.from({ length: 12 }, (_, i) => <line key={i} x1={540} y1={1100} x2={540 + Math.cos(i * 0.52 + t * 0.3) * 1400} y2={1100 + Math.sin(i * 0.52 + t * 0.3) * 1400} stroke="#fff" strokeWidth={40} opacity={0.15} />)}</g>}
    <Chao y={1560} cor={tipo === "fangorn" ? "#1c2a1c" : "#6a9a52"} />
    {tipo === "rio" && <g><path d="M-200 1900 Q540 1820 1280 1900 L1280 2120 L-200 2120Z" fill="#4f8fb0" />{Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-200 + ((t * 70 + i * 260) % 1500)} ${1940 + (i % 3) * 40} q40 -12 80 0`} stroke="#bfe3f5" strokeWidth={5} fill="none" />)}</g>}
    {extra}
  </g>
);

// ---------- planície de Rohan ----------
export const Planicie = ({ t, rola = 0, extra }: { t: number; rola?: number; extra?: ReactNode }) => (
  <g>
    <Ceu id="an-plan" a="#6fa8d8" b="#f0e0b0" />
    <Serra y={1200} cor="#a8b8c8" k={9} amp={380} />
    <path d="M-200 1300 Q300 1200 700 1300 Q1000 1240 1280 1300 L1280 2120 L-200 2120Z" fill="#c9b85a" />
    <path d="M-200 1600 Q400 1520 1280 1600 L1280 2120 L-200 2120Z" fill="#b5a44a" />
    {Array.from({ length: 16 }, (_, i) => <path key={i} d="M0 0 q6 -40 14 0" transform={`translate(${((i * 97 - rola) % 1400 + 1400) % 1400 - 150} ${1620 + (i % 4) * 110})`} stroke="#8a7a2a" strokeWidth={6} fill="none" />)}
    {extra}
  </g>
);

// ---------- fortalezas: Isengard e o Abismo de Helm ----------
export const Fortaleza = ({ t, tipo, brecha = 0, aurora = 0, enchente = 0 }: { t: number; tipo: "isengard" | "helm"; brecha?: number; aurora?: number; enchente?: number }) => (
  <g>
    <Ceu id={`an-fort-${tipo}`} a={aurora > 0 ? "#3a5a9a" : tipo === "helm" ? "#070a16" : "#3a3f48"} b={aurora > 0 ? "#ffd9a0" : tipo === "helm" ? "#1c2234" : "#8a8f98"} />
    {aurora > 0 && <g opacity={aurora}><circle cx={900} cy={700} r={160} fill="#fff6d6" /><circle cx={900} cy={700} r={600} fill="#ffe2a0" opacity={0.4} /></g>}
    <Serra y={1000} cor={tipo === "helm" ? "#141a26" : "#4a4f58"} k={11} amp={600} />
    {tipo === "isengard" ? (
      <g>
        <g transform="translate(540 1560)">
          <path d="M-90 0 L-70 -1000 L-130 -1180 L-40 -1080 L0 -1240 L40 -1080 L130 -1180 L70 -1000 L90 0Z" fill="#0c0e12" />
          {[-800, -560, -320].map((y) => <rect key={y} x={-12} y={y} width={24} height={50} fill="#ffe9a8" opacity={0.6} />)}
          <rect x={-120} y={-900} width={240} height={24} fill="#1c2028" />
        </g>
        <Chao y={1560} cor="#2a2a26" />
        {enchente > 0 && <g><rect x={-200} y={1900 - enchente * 480} width={1480} height={800} fill="#3d7fa8" opacity={0.9} />{Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${-200 + ((t * 200 + i * 200) % 1500)} ${1910 - enchente * 480 + (i % 3) * 30} q50 -30 100 0`} stroke="#dff3ff" strokeWidth={8} fill="none" />)}</g>}
      </g>
    ) : (
      <g>
        <path d="M-200 2120 L-200 900 L200 1000 L260 2120Z M1280 2120 L1280 860 L900 980 L840 2120Z" fill="#1c2230" />
        <g transform={`translate(0 0)`}>
          <rect x={200} y={1150} width={700} height={450} fill="#39424f" />
          {Array.from({ length: 10 }, (_, i) => <rect key={i} x={200 + i * 70} y={1100} width={40} height={60} fill="#39424f" />)}
          <rect x={760} y={900} width={150} height={700} fill="#434d5c" /><path d="M740 900 L835 780 L930 900Z" fill="#2a303a" />
          {brecha > 0 && <g>
            <path d="M420 1600 L440 1300 L520 1220 L600 1320 L640 1600Z" fill="#0a0c12" />
            <circle cx={530} cy={1420} r={60 + brecha * 420} fill="#ff7a2a" opacity={(1 - brecha) * 0.9} /><circle cx={530} cy={1420} r={30 + brecha * 240} fill="#fff3c9" opacity={(1 - brecha)} />
            {Array.from({ length: 14 }, (_, i) => <rect key={i} x={530 + Math.cos(i) * brecha * 500} y={1420 + Math.sin(i * 1.7) * brecha * 500 + brecha * brecha * 200} width={40} height={30} fill="#39424f" transform={`rotate(${brecha * 400 + i * 30} 530 1420)`} />)}
          </g>}
        </g>
        <Chao y={1600} cor="#12161f" />
        {aurora === 0 && Array.from({ length: 40 }, (_, i) => { const x = (acaso(i, 1) * 1300 + t * 200) % 1300 - 100, y = (acaso(i, 2) * 1900 + t * 1400) % 1900; return <line key={i} x1={x} y1={y} x2={x - 14} y2={y + 60} stroke="#9fb5d9" strokeWidth={3} opacity={0.5} />; })}
      </g>
    )}
  </g>
);

// ---------- pântano e o covil da aranha ----------
export const Pantano = ({ t }: { t: number }) => (
  <g>
    <Ceu id="an-pant" a="#2a3a34" b="#6f7f5a" />
    <Serra y={1100} cor="#27332c" k={13} amp={300} />
    <Chao y={1300} cor="#3a4a34" />
    {Array.from({ length: 7 }, (_, i) => <ellipse key={i} cx={acaso(i, 1) * 1080} cy={1450 + i * 90} rx={200 + acaso(i, 2) * 160} ry={36} fill="#27504a" opacity={0.9} />)}
    {Array.from({ length: 12 }, (_, i) => <path key={i} d="M0 0 q-6 -70 4 -120 M10 0 q8 -60 20 -100" transform={`translate(${acaso(i, 3) * 1080} ${1400 + acaso(i, 4) * 500})`} stroke="#6f8a4a" strokeWidth={6} fill="none" />)}
    {Array.from({ length: 5 }, (_, i) => <circle key={i} cx={150 + i * 200} cy={1380 + Math.sin(t * 1.5 + i) * 30 + (i % 2) * 200} r={14} fill="#bfffd0" opacity={0.5 + 0.4 * Math.sin(t * 3 + i)} />)}
    {Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={540 + Math.sin(t * 0.3 + i * 2) * 240} cy={1250 + i * 110} rx={640} ry={60} fill="#cfe0c0" opacity={0.12} />)}
  </g>
);
export const Covil = ({ t, aranha = 0 }: { t: number; aranha?: number }) => (
  <g>
    <rect {...TODO} fill="#0a080c" />
    <path d="M-200 -200 L1280 -200 L1280 400 Q900 700 540 520 Q200 720 -200 420Z" fill="#16121a" />
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${i * 140} -200 Q${i * 140 + 60} ${600 + (i % 3) * 200} ${i * 140 - 40} ${1300 + (i % 2) * 300}`} stroke="#cfd6e0" strokeWidth={3} fill="none" opacity={0.35} />)}
    {[[200, 700], [860, 900], [520, 400]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`} opacity={0.35}>{Array.from({ length: 8 }, (_, k) => <line key={k} x1={0} y1={0} x2={Math.cos(k * 0.785) * 220} y2={Math.sin(k * 0.785) * 220} stroke="#cfd6e0" strokeWidth={3} />)}{[70, 140, 210].map((r) => <circle key={r} r={r} fill="none" stroke="#cfd6e0" strokeWidth={3} />)}</g>)}
    {aranha > 0 && (
      <g transform={`translate(700 ${-300 + aranha * 1050})`}>
        <line x1={0} y1={-1400} x2={0} y2={-160} stroke="#cfd6e0" strokeWidth={5} />
        {[-1, 1].flatMap((l) => [0, 1, 2, 3].map((k) => <path key={`${l}${k}`} d={`M${l * 110} ${-40 + k * 30} Q${l * (330 + k * 30)} ${-300 + k * 110 + Math.sin(t * 6 + k) * 30} ${l * (400 + k * 20)} ${120 + k * 90}`} stroke="#14101a" strokeWidth={26} fill="none" strokeLinecap="round" />))}
        <ellipse cx={0} cy={-220} rx={210} ry={250} fill="#1c1624" /><ellipse cx={0} cy={60} rx={150} ry={130} fill="#241c2e" />
        {[-60, -20, 20, 60].map((x, i) => <circle key={x} cx={x} cy={70 + (i % 2) * 34} r={16} fill="#e0352a" opacity={0.7 + 0.3 * Math.sin(t * 5 + i)} />)}
        <path d="M-50 170 L-30 250 M50 170 L30 250" stroke="#cfd6e0" strokeWidth={12} strokeLinecap="round" />
      </g>
    )}
    <Chao y={1790} cor="#120e16" />
  </g>
);

// ---------- torre dos orcs ----------
export const TorreOrc = ({ t }: { t: number }) => (
  <g>
    <Ceu id="an-torc" a="#1a0806" b="#5a1a12" />
    <Serra y={1200} cor="#0c0608" k={15} amp={700} />
    <g transform="translate(700 1790)">
      <path d="M-200 0 L-170 -1300 L-230 -1400 L-110 -1380 L-60 -1500 L0 -1380 L60 -1500 L110 -1380 L230 -1400 L170 -1300 L200 0Z" fill="#14101a" />
      <rect x={-50} y={-1100} width={100} height={130} fill="#ff3a2a" opacity={0.6 + 0.3 * Math.sin(t * 4)} /><circle cy={-1040} r={220} fill="#ff3a2a" opacity={0.15} />
      <path d="M-90 0 L-90 -260 Q0 -360 90 -260 L90 0Z" fill="#050305" />
    </g>
    {Array.from({ length: 7 }, (_, i) => <rect key={i} x={-200 + i * 110} y={1790 - i * 60} width={420} height={60} fill="#1c1622" />)}
    <Chao y={1790} cor="#0c0a10" />
  </g>
);

// ---------- Gondor: a cidade branca ----------
export const Gondor = ({ t, cerco = 0, paz = false, extra }: { t: number; cerco?: number; paz?: boolean; extra?: ReactNode }) => (
  <g>
    <Ceu id="an-gond" a={paz ? "#5fa8e0" : "#2a2230"} b={paz ? "#ffe9c2" : "#8a5a4a"} />
    {paz && <g><circle cx={860} cy={300} r={90} fill="#fff6d6" /><circle cx={860} cy={300} r={280} fill="#ffe2a0" opacity={0.3} /></g>}
    <path d="M100 1500 L400 300 L540 520 L700 260 L980 1500Z" fill={paz ? "#9aa8b8" : "#3a3440"} />
    {[0, 1, 2, 3].map((i) => (
      <g key={i}>
        <path d={`M${160 + i * 70} ${1500 - i * 210} L${920 - i * 70} ${1500 - i * 210} L${900 - i * 70} ${1300 - i * 210} L${180 + i * 70} ${1300 - i * 210}Z`} fill={paz ? "#f4f7f8" : "#cfd0d6"} stroke="#9aa0a8" strokeWidth={5} />
        {Array.from({ length: 9 - i * 2 }, (_, k) => <rect key={k} x={210 + i * 70 + k * 74} y={1350 - i * 210} width={30} height={70} rx={14} fill={paz ? "#7fb3d9" : "#3a3440"} />)}
      </g>
    ))}
    <rect x={500} y={540} width={80} height={140} fill={paz ? "#f4f7f8" : "#cfd0d6"} /><path d="M490 540 L540 420 L590 540Z" fill="#9aa0a8" />
    <Chao y={1500} cor={paz ? "#8fb56a" : "#3a3028"} />
    {cerco > 0 && Array.from({ length: 5 }, (_, i) => {
      const v = (t * 0.5 + i / 5) % 1, x = -100 + v * 800 + i * 60, y = 1300 - Math.sin(v * Math.PI) * 900;
      return <g key={i} opacity={cerco}><circle cx={x} cy={y} r={34} fill="#ff7a2a" /><circle cx={x} cy={y} r={70} fill="#ffb347" opacity={0.3} /><path d={`M${x} ${y} l-90 ${40 - v * 80}`} stroke="#ffb347" strokeWidth={14} opacity={0.5} /></g>;
    })}
    {cerco > 0 && [300, 620, 800].map((x, i) => <g key={x} opacity={cerco}>{[0, 1, 2].map((k) => <circle key={k} cx={x + Math.sin(t + k + i) * 20} cy={1100 - i * 120 - ((t * 60 + k * 70) % 220)} r={40 + k * 16} fill="#2a2228" opacity={0.6} />)}</g>)}
    {extra}
  </g>
);

// ---------- campo de batalha ----------
export const Campo = ({ t, extra }: { t: number; extra?: ReactNode }) => (
  <g>
    <Ceu id="an-campo" a="#3a2a30" b="#c98a5a" />
    <Serra y={1200} cor="#2a2028" k={17} amp={300} />
    <path d="M700 1200 L830 760 L900 860 L980 720 L1100 1200Z" fill="#cfd0d6" opacity={0.6} />
    <Chao y={1300} cor="#6a5a3a" />
    {Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={540 + Math.sin(t * 0.4 + i * 2) * 300} cy={1250 + i * 90} rx={640} ry={70} fill="#8a6a5a" opacity={0.18} />)}
    {Array.from({ length: 8 }, (_, i) => <line key={i} x1={80 + i * 130} y1={1500 + (i % 3) * 120} x2={100 + i * 130} y2={1300 + (i % 3) * 120} stroke="#3a3028" strokeWidth={7} />)}
    {extra}
  </g>
);

// ---------- o Portão Negro e Mordor ----------
export const Mordor = ({ t, olhar = 0, portao = true, cai = 0, vulcao = 0 }: { t: number; olhar?: number; portao?: boolean; cai?: number; vulcao?: number }) => (
  <g>
    <Ceu id="an-mord" a="#12060a" b="#7a2a12" />
    {Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={(t * 20 + i * 300) % 1500 - 200} cy={200 + i * 110} rx={320} ry={60} fill="#1a0a0c" opacity={0.8} />)}
    {/* a Montanha da Perdição */}
    <g transform="translate(240 1500)">
      <path d="M-400 0 L-70 -760 L70 -760 L400 0Z" fill="#1a0c0c" />
      <path d="M-70 -760 L-30 -700 L10 -750 L40 -690 L70 -760Z" fill="#ff5a1a" />
      <path d="M-10 -740 Q-40 -500 30 -300 Q60 -160 20 0" stroke="#ff7a2a" strokeWidth={16} fill="none" opacity={0.8} />
      {[0, 1, 2].map((k) => <circle key={k} cx={Math.sin(t + k) * 40} cy={-800 - ((t * (60 + vulcao * 300) + k * 100) % 400)} r={50 + k * 20 + vulcao * 60} fill={vulcao > 0 ? "#ff7a2a" : "#3a1a14"} opacity={0.6} />)}
    </g>
    <g transform="translate(800 1500)"><TorreNegra t={t} olhar={olhar} cai={cai} /></g>
    <Serra y={1500} cor="#0c0608" k={19} amp={240} />
    {portao && (
      <g>
        <rect x={-200} y={1380} width={1480} height={420} fill="#141016" />
        {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-160 + i * 120} 1380 l30 -70 l30 70`} fill="#141016" />)}
        <rect x={380} y={1440} width={320} height={360} fill="#0a080c" stroke="#2a222c" strokeWidth={10} /><line x1={540} y1={1440} x2={540} y2={1800} stroke="#2a222c" strokeWidth={10} />
        {[200, 880].map((x) => <g key={x}><rect x={x - 60} y={1160} width={120} height={640} fill="#1c1620" /><path d={`M${x - 80} 1160 L${x} 1040 L${x + 80} 1160Z`} fill="#141016" /></g>)}
      </g>
    )}
    <Chao y={1800} cor="#1a1210" />
    {cai > 0.3 && <circle cx={800} cy={600} r={(cai - 0.3) * 2400} fill="none" stroke="#ffd166" strokeWidth={30} opacity={1 - cai} />}
  </g>
);

// ---------- dentro da Montanha da Perdição ----------
export const Camara = ({ t, onda = 0 }: { t: number; onda?: number }) => (
  <g>
    <rect {...TODO} fill="#140604" />
    <path d="M-200 -200 L1280 -200 L1280 500 Q900 800 540 640 Q200 820 -200 520Z" fill="#0a0304" />
    <rect x={-200} y={1500} width={1480} height={700} fill="#ff5a1a" />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${-200 + ((t * 80 + i * 200) % 1500)} ${1560 + (i % 3) * 90} q60 -30 120 0`} stroke="#ffd166" strokeWidth={10} fill="none" opacity={0.8} />)}
    <circle cx={540} cy={1900} r={1100} fill="#ff7a2a" opacity={0.2 + 0.05 * Math.sin(t * 4)} />
    {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={acaso(i, 1) * 1080} cy={1500 - ((t * (140 + acaso(i, 2) * 220) + i * 90) % 1100)} r={5 + acaso(i, 3) * 6} fill="#ffb347" opacity={0.8} />)}
    {/* a beira de pedra */}
    <path d="M-200 1790 L640 1790 L700 1840 L620 1900 L-200 1900Z" fill="#1a0c0a" /><rect x={-200} y={1890} width={820} height={300} fill="#120806" />
    {onda > 0 && <g><circle cx={860} cy={1560} r={onda * 1800} fill="none" stroke="#fff3c9" strokeWidth={40} opacity={1 - onda} /><circle cx={860} cy={1560} r={onda * 900} fill="#fff3c9" opacity={(1 - onda) * 0.6} /></g>}
  </g>
);

// ---------- a coroação ----------
export const Patio = ({ t, curva = 0, povo, rei }: { t: number; curva?: number; povo: Visual[]; rei?: Visual }) => (
  <g>
    <Ceu id="an-patio" a="#5fa8e0" b="#ffe9c2" />
    <path d="M-200 1100 L-200 500 L200 420 L200 1100Z M1280 1100 L1280 500 L880 420 L880 1100Z" fill="#f4f7f8" stroke="#b9c2cc" strokeWidth={6} />
    {[-100, 60, 940, 1100].map((x) => <rect key={x} x={x} y={600} width={70} height={500} rx={34} fill="#bfd6e8" />)}
    <rect x={-200} y={1100} width={1480} height={1100} fill="#e8e4dc" />
    {/* a árvore branca */}
    <g transform="translate(540 1200)">
      <rect x={-20} y={-420} width={40} height={420} fill="#f4f7f8" stroke="#b9c2cc" strokeWidth={4} />
      {[[-150, -520], [0, -620], [150, -520], [-80, -440], [90, -450]].map(([x, y], i) => <g key={i}><line x1={0} y1={-400} x2={x} y2={y} stroke="#f4f7f8" strokeWidth={14} /><circle cx={x} cy={y} r={70 + (i % 2) * 20} fill="#fff" stroke="#dfe6ec" strokeWidth={4} /></g>)}
      {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={(acaso(i, 1) - 0.5) * 500} cy={-640 + ((t * 60 + i * 80) % 800)} r={7} fill="#fff" />)}
    </g>
    {rei && (
      <g transform={`translate(540 1500) scale(0.6) rotate(${curva * 40} 0 -300)`}>
        <Ator v={rei} t={t} expr="sereno" fechado={curva > 0.5} fase={2} />
        <path d="M-70 -800 L-80 -870 L-40 -830 L0 -890 L40 -830 L80 -870 L70 -800Z" fill="#e8eef2" stroke="#8e99a3" strokeWidth={6} />
      </g>
    )}
    {/* o povo, que se curva */}
    {povo.map((v, i) => { const esq = i % 2 === 0, x = esq ? 60 + Math.floor(i / 2) * 120 : 1020 - Math.floor(i / 2) * 120; return <g key={i} transform={`translate(${x} ${1560 + (i % 3) * 30}) scale(0.4) rotate(${curva * (esq ? 38 : -38)} 0 -300)`}><Ator v={v} t={t} expr="feliz" fechado={curva > 0.5} olhar={[esq ? 1 : -1, 0]} fase={i} /></g>; })}
  </g>
);

// ---------- os Portos Cinzentos ----------
export const Portos = ({ t, parte = 0, v }: { t: number; parte?: number; v: Visual[] }) => (
  <g>
    <Ceu id="an-porto" a="#5a6fa8" b="#ffc98a" />
    <circle cx={760} cy={1000} r={150} fill="#fff1c9" /><circle cx={760} cy={1000} r={520} fill="#ffd98a" opacity={0.35} />
    <rect x={-200} y={1100} width={1480} height={1100} fill="#4f7fa8" />
    <rect x={640} y={1100} width={240} height={900} fill="#ffe2a0" opacity={0.25} />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-200 + ((t * 40 + i * 180) % 1500)} ${1160 + i * 60} q40 -14 80 0 q40 14 80 0`} stroke="#dff3ff" strokeWidth={5} fill="none" opacity={0.6} />)}
    {/* o navio */}
    <g transform={`translate(${420 + parte * 380} ${1320 - parte * 150 + Math.sin(t * 1.5) * 8}) scale(${1 - parte * 0.55})`}>
      <path d="M-260 0 Q-300 -60 -340 -150 Q-200 -40 0 -40 Q200 -40 300 -130 Q280 -40 230 0Z" fill="#f4f7f8" stroke="#9aa8b8" strokeWidth={6} />
      <rect x={-8} y={-520} width={16} height={480} fill="#9aa8b8" /><path d="M8 -510 Q260 -340 8 -120Z" fill="#fff" opacity={0.95} />
      {v.map((vis, i) => <g key={i} transform={`translate(${-150 + i * 110} -40) scale(${i === 0 ? 0.2 : 0.3})`}><Ator v={vis} t={t} expr="sereno" olhar={[-1, 0]} fase={i} /></g>)}
      <path d="M-260 0 Q-300 -60 -330 -120 L260 -60 Q250 -20 230 0Z" fill="#f4f7f8" />
    </g>
    {/* o cais */}
    <path d="M-200 1790 L420 1790 L420 1840 L-200 1840Z" fill="#8a7a66" />{[40, 220, 400].map((x) => <rect key={x} x={x - 12} y={1790} width={24} height={300} fill="#6b5a4a" />)}
    <path d="M-200 1840 L-200 1100 L40 1100 L120 1300 L60 1840Z" fill="#c9c2b0" /><path d="M-40 1100 Q40 900 120 1100" fill="none" stroke="#f4f7f8" strokeWidth={30} />
  </g>
);

/** Rótulo de pergaminho com o nome de um lugar. */
export const Placa = ({ texto }: { texto: string }) => (
  <g>
    <rect x={-texto.length * 26 - 40} y={-60} width={texto.length * 52 + 80} height={120} rx={12} fill="#f1e2bc" stroke="#6b4a2a" strokeWidth={8} />
    <text x={0} y={30} textAnchor="middle" fontFamily={FONTE} fontSize={84} fill="#3a2414" letterSpacing={4}>{texto}</text>
  </g>
);
