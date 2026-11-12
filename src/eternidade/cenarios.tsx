import { Ator, type Visual } from "../serie/Ator";

// Cenários do curta "Dez Minutos de Eternidade": base de lançamento, planeta da
// estrela extrema, cabine da nave, órbita da Terra, laboratório orbital e a festa.

const FONTE = "Anton, Impact, sans-serif";
const acaso = (i: number, k: number) => {
  const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const TODO = { x: -200, y: -200, width: 1480, height: 2320 };
const Estrelas = ({ t, n = 70 }: { t: number; n?: number }) => (
  <g>{Array.from({ length: n }, (_, i) => <circle key={i} cx={acaso(i, 1) * 1080} cy={acaso(i, 2) * 1920} r={1.5 + acaso(i, 3) * 3} fill="#fff" opacity={0.35 + 0.5 * Math.sin(t * 2 + i)} />)}</g>
);

/** Nave de Elisa vista de fora; `fogo` acende os motores. */
export const NaveExt = ({ t, fogo = 0 }: { t: number; fogo?: number }) => (
  <g>
    {fogo > 0 && <path d={`M-40 150 Q0 ${260 + Math.sin(t * 40) * 40 * fogo + 120 * fogo} 40 150Z`} fill="#ffb347" opacity={0.9} />}
    {fogo > 0 && <path d={`M-22 150 Q0 ${210 + 60 * fogo} 22 150Z`} fill="#fff3b0" />}
    <path d="M0 -200 Q90 -90 80 150 L-80 150 Q-90 -90 0 -200Z" fill="#e8eef2" stroke="#56636e" strokeWidth={8} />
    <path d="M-80 60 L-150 190 L-70 150Z M80 60 L150 190 L70 150Z" fill="#e0572a" stroke="#56636e" strokeWidth={6} />
    <circle cy={-60} r={36} fill="#7fc4ee" stroke="#56636e" strokeWidth={8} /><rect x={-80} y={110} width={160} height={24} fill="#56636e" />
  </g>
);

// ---------- despedida na base ----------
export const Base = ({ t }: { t: number }) => (
  <g>
    <defs><linearGradient id="et-base" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a4a8a" /><stop offset="0.6" stopColor="#f0a070" /><stop offset="1" stopColor="#ffe2b0" /></linearGradient></defs>
    <rect {...TODO} fill="url(#et-base)" />
    <circle cx={300} cy={1100} r={130} fill="#fff1c9" /><circle cx={300} cy={1100} r={360} fill="#ffd98a" opacity={0.3} />
    <rect x={720} y={500} width={30} height={1000} fill="#56636e" />
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M720 ${560 + i * 100} L880 ${610 + i * 100} M880 ${610 + i * 100} L720 ${660 + i * 100}`} stroke="#56636e" strokeWidth={8} fill="none" />)}
    <rect x={880} y={500} width={24} height={1000} fill="#56636e" />
    <g transform="translate(560 1160) scale(1.5)"><NaveExt t={t} /></g>
    <rect x={-200} y={1500} width={1480} height={620} fill="#6b6f78" />
    <rect x={-200} y={1500} width={1480} height={16} fill="#e6c229" />
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={-150 + i * 190} y={1640} width={110} height={14} fill="#fff" opacity={0.5} />)}
  </g>
);

// ---------- o planeta junto à estrela extrema ----------
export const Planeta = ({ t, tempestade = 0, pouso = 1 }: { t: number; tempestade?: number; pouso?: number }) => (
  <g>
    <defs>
      <radialGradient id="et-estrela"><stop offset="0" stopColor="#ffffff" /><stop offset="0.45" stopColor="#bfe3ff" /><stop offset="1" stopColor="#3d6fd9" stopOpacity={0} /></radialGradient>
      <linearGradient id="et-ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0c0a2a" /><stop offset="1" stopColor="#5a2a6a" /></linearGradient>
    </defs>
    <rect {...TODO} fill="url(#et-ceu)" />
    <Estrelas t={t} n={40} />
    <g transform="translate(700 560)">
      {Array.from({ length: 14 }, (_, i) => <line key={i} x1={0} y1={0} x2={Math.cos(i * 0.45 + t * 0.2) * 1100} y2={Math.sin(i * 0.45 + t * 0.2) * 1100} stroke="#bfe3ff" strokeWidth={10} opacity={0.12} />)}
      <circle r={640} fill="url(#et-estrela)" opacity={0.9} />
      <ellipse rx={560 + Math.sin(t * 2) * 12} ry={150} fill="none" stroke="#ffcf8a" strokeWidth={16} opacity={0.7} transform="rotate(-18)" />
      <circle r={210 + Math.sin(t * 6) * 6} fill="#ffffff" />
    </g>
    <path d="M-200 1500 L60 1240 L220 1420 L420 1180 L600 1440 L800 1260 L1000 1460 L1280 1300 L1280 2120 L-200 2120Z" fill="#3a1f55" />
    <path d="M-200 1640 Q200 1560 540 1620 Q880 1560 1280 1640 L1280 2120 L-200 2120Z" fill="#5a3378" />
    {[[120, 1640, 1], [900, 1700, 1.3], [700, 1600, 0.7]].map(([x, y, s], i) => <path key={i} d="M-40 0 L-10 -130 L20 -40 L50 -170 L70 0Z" transform={`translate(${x} ${y}) scale(${s})`} fill="#8a5fd0" opacity={0.85} />)}
    <g transform={`translate(760 ${1560 - (1 - pouso) * 1300})`}>
      <path d="M-70 150 L-110 240 M70 150 L110 240" stroke="#56636e" strokeWidth={14} />
      <NaveExt t={t} fogo={pouso < 1 ? 1 : 0} />
    </g>
    {tempestade > 0 && (
      <g opacity={tempestade}>
        {Array.from({ length: 40 }, (_, i) => {
          const x = ((t * (900 + acaso(i, 1) * 600) + i * 97) % 1500) - 200, y = acaso(i, 2) * 1900;
          return <line key={i} x1={x} y1={y} x2={x + 220} y2={y + 30} stroke="#d9b0ff" strokeWidth={5 + acaso(i, 3) * 6} opacity={0.5} />;
        })}
        {Math.sin(t * 7) * Math.sin(t * 3.1) > 0.55 && <path d="M300 -100 L360 300 L260 420 L380 800 L300 1000" stroke="#fff" strokeWidth={12} fill="none" />}
        <rect {...TODO} fill="#8a5fd0" opacity={0.25} />
      </g>
    )}
  </g>
);

// ---------- cabine da nave ----------
export const Cabine = ({ t, vista = "estrela" }: { t: number; vista?: "estrela" | "espaco" }) => (
  <g>
    <rect {...TODO} fill="#1c2434" />
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={-200 + i * 260} y={-200} width={14} height={2000} fill="#0f1420" />)}
    <rect x={120} y={300} width={840} height={620} rx={60} fill="#05060f" stroke="#39465c" strokeWidth={26} />
    <clipPath id="et-janela"><rect x={133} y={313} width={814} height={594} rx={50} /></clipPath>
    <g clipPath="url(#et-janela)">
      {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={140 + acaso(i, 1) * 800} cy={320 + acaso(i, 2) * 580} r={2 + acaso(i, 3) * 2} fill="#fff" opacity={0.6} />)}
      {vista === "estrela" && <g transform="translate(760 520)"><circle r={330} fill="#bfe3ff" opacity={0.25} /><circle r={130} fill="#fff" /><ellipse rx={300} ry={70} fill="none" stroke="#ffcf8a" strokeWidth={10} opacity={0.7} transform="rotate(-18)" /></g>}
    </g>
    {/* console */}
    <path d="M40 1220 L1040 1220 L1120 1790 L-40 1790Z" fill="#27324a" />
    <rect x={40} y={1190} width={1000} height={40} fill="#39465c" />
    {Array.from({ length: 30 }, (_, i) => <rect key={i} x={90 + (i % 10) * 92} y={1270 + Math.floor(i / 10) * 70} width={60} height={40} rx={8} fill={["#5cc8ff", "#ffb347", "#5cf29a"][i % 3]} opacity={0.45 + 0.4 * Math.sin(t * 4 + i)} />)}
    <rect x={380} y={980} width={320} height={200} rx={12} fill="#05060f" stroke="#5cc8ff" strokeWidth={8} />
    <polyline points={Array.from({ length: 28 }, (_, i) => `${396 + i * 10.6},${1080 + Math.sin(i * 0.7 + t * 5) * 40}`).join(" ")} stroke="#5cc8ff" strokeWidth={5} fill="none" />
    <rect {...TODO} y={1790} fill="#0f1420" />
    <rect {...TODO} fill="#5cc8ff" opacity={0.04} />
  </g>
);

// ---------- o sistema solar e a estação em órbita ----------
export const Orbita = ({ t, chegada = 0, estacao = 0 }: {
  t: number;
  /** Aproximação da Terra, de 0 (longe, entre planetas) a 1. */
  chegada?: number;
  /** A estação acendendo as luzes, de 0 a 1. */
  estacao?: number;
}) => {
  const r = 120 + chegada * 330;
  return (
    <g>
      <rect {...TODO} fill="#05060f" />
      <Estrelas t={t} />
      <circle cx={120} cy={300} r={50} fill="#fff6d6" /><circle cx={120} cy={300} r={170} fill="#ffe2a0" opacity={0.25} />
      {/* planeta com anéis, ficando para trás */}
      <g transform={`translate(${260 - chegada * 520} ${1500 + chegada * 500}) scale(${1.6 - chegada * 0.8})`}>
        <circle r={150} fill="#d9a86a" /><path d="M-150 -30 Q0 10 150 -30 M-146 30 Q0 70 146 30" stroke="#b5823f" strokeWidth={18} fill="none" />
        <ellipse rx={270} ry={56} fill="none" stroke="#f0d9a8" strokeWidth={22} opacity={0.8} transform="rotate(-14)" />
      </g>
      {/* a Terra */}
      <g transform={`translate(${600 - chegada * 60} ${760 + chegada * 120})`}>
        <circle r={r + 30} fill="#5cc8ff" opacity={0.18} />
        <circle r={r} fill="#2f7fd0" />
        <clipPath id="et-terra"><circle r={r} /></clipPath>
        <g clipPath="url(#et-terra)">
          {[[-0.4, -0.3, 0.5], [0.3, 0.1, 0.42], [-0.1, 0.55, 0.36], [0.6, -0.5, 0.3]].map(([x, y, s], i) => <ellipse key={i} cx={x * r + Math.sin(t * 0.2) * 10} cy={y * r} rx={s * r} ry={s * r * 0.7} fill="#4f9a55" />)}
          {[[-0.2, -0.6, 0.5], [0.4, 0.4, 0.6], [-0.6, 0.2, 0.4]].map(([x, y, s], i) => <ellipse key={i} cx={x * r + t * 6} cy={y * r} rx={s * r} ry={s * r * 0.16} fill="#fff" opacity={0.7} />)}
          <circle r={r} cx={r * 0.5} cy={r * 0.3} fill="#05060f" opacity={0.35} />
        </g>
        {/* estação em anel */}
        <g opacity={0.25 + 0.75 * estacao} transform="rotate(-16)">
          <ellipse rx={r * 1.55} ry={r * 0.42} fill="none" stroke="#cfd6dc" strokeWidth={r * 0.07} />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2 + t * 0.15;
            return <g key={i} transform={`translate(${Math.cos(a) * r * 1.55} ${Math.sin(a) * r * 0.42})`}><rect x={-r * 0.06} y={-r * 0.05} width={r * 0.12} height={r * 0.1} fill="#8e99a3" /><circle r={r * 0.025} fill="#ffe9a8" opacity={estacao * (0.6 + 0.4 * Math.sin(t * 5 + i))} /></g>;
          })}
          <rect x={-r * 1.55} y={-r * 0.02} width={r * 3.1} height={r * 0.04} fill="#8e99a3" opacity={0.5} />
        </g>
      </g>
      {/* a nave de Elisa */}
      <g transform={`translate(${-100 + chegada * 330 + Math.sin(t) * 10} ${1750 - chegada * 520}) rotate(32) scale(${0.7 - chegada * 0.35})`}><NaveExt t={t} fogo={0.6} /></g>
    </g>
  );
};

// ---------- laboratório orbital ----------
export const LabOrbital = ({ t }: { t: number }) => (
  <g>
    <rect {...TODO} fill="#dfe8ee" />
    <rect x={60} y={240} width={960} height={520} rx={40} fill="#05060f" stroke="#b9c7d2" strokeWidth={24} />
    <clipPath id="et-lab"><rect x={72} y={252} width={936} height={496} rx={30} /></clipPath>
    <g clipPath="url(#et-lab)">
      {Array.from({ length: 24 }, (_, i) => <circle key={i} cx={80 + acaso(i, 1) * 920} cy={260 + acaso(i, 2) * 300} r={2 + acaso(i, 3) * 2} fill="#fff" opacity={0.6} />)}
      <circle cx={540} cy={1500} r={900} fill="#2f7fd0" /><ellipse cx={380} cy={720} rx={260} ry={40} fill="#fff" opacity={0.6} /><ellipse cx={760} cy={690} rx={180} ry={50} fill="#4f9a55" />
    </g>
    {/* quadros com os estudos do tempo */}
    {[[60, 840], [760, 840]].map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y})`}>
        <rect width={260} height={330} rx={10} fill="#f7fafc" stroke="#b9c7d2" strokeWidth={8} />
        <circle cx={130} cy={110} r={64} fill="none" stroke="#3d6fa3" strokeWidth={7} /><line x1={130} y1={110} x2={130 + Math.cos(t * (i ? 3 : 0.4)) * 50} y2={110 + Math.sin(t * (i ? 3 : 0.4)) * 50} stroke="#e0572a" strokeWidth={7} />
        <path d={`M30 250 ${Array.from({ length: 10 }, (_, k) => `q10 ${k % 2 ? 36 : -36} 20 0`).join(" ")}`} stroke="#3d6fa3" strokeWidth={6} fill="none" />
        <text x={130} y={312} textAnchor="middle" fontFamily={FONTE} fontSize={32} fill="#56636e">{i ? "TEMPO: TERRA" : "TEMPO: ESTRELA"}</text>
      </g>
    ))}
    {/* base do holograma */}
    <ellipse cx={660} cy={1800} rx={170} ry={34} fill="#7ef0ff" opacity={0.5 + 0.2 * Math.sin(t * 5)} />
    <path d="M500 1800 L560 700 L760 700 L820 1800Z" fill="#7ef0ff" opacity={0.08} />
    <rect {...TODO} y={1790} fill="#c2ced6" /><rect x={-200} y={1790} width={1480} height={14} fill="#a8b5bf" />
  </g>
);

/** Holograma de alguém: boneco translúcido, azulado, com linhas de varredura. */
export const Holograma = ({ t, v, s = 0.66, expr = "sereno", pose = "parado", nega = false, olhar = [-1, 0] as [number, number] }: {
  t: number; v: Visual; s?: number; expr?: "sereno" | "feliz" | "triste"; pose?: "parado" | "apontarCima" | "abracar"; nega?: boolean; olhar?: [number, number];
}) => (
  <g opacity={0.72 + 0.08 * Math.sin(t * 9)}>
    <g transform={`scale(${s})`}><Ator v={v} t={t} expr={expr} pose={pose} nega={nega} olhar={olhar} fase={4} /></g>
    <rect x={-140 * s} y={-860 * s} width={280 * s} height={860 * s} fill="#7ef0ff" opacity={0.35} style={{ mixBlendMode: "screen" }} />
    {Array.from({ length: 14 }, (_, i) => <rect key={i} x={-140 * s} y={-860 * s + ((i * 62 + t * 80) % (860 * s))} width={280 * s} height={5} fill="#d8fbff" opacity={0.5} />)}
  </g>
);

// ---------- a festa ----------
export const Festa = ({ t }: { t: number }) => (
  <g>
    <rect {...TODO} fill="#f5d9b0" />
    <rect x={-200} y={1300} width={1480} height={500} fill="#e9c090" />
    {Array.from({ length: 14 }, (_, i) => <path key={i} d="M0 0 L60 0 L30 80Z" transform={`translate(${-60 + i * 88} ${360 + Math.sin(i * 0.5) * 60 + Math.sin(t * 2 + i) * 4})`} fill={["#e0572a", "#e9b730", "#3d6fa3", "#5c9a4f", "#7a4fa3"][i % 5]} />)}
    <path d="M-200 340 Q540 480 1280 340" stroke="#8a5a3a" strokeWidth={5} fill="none" />
    <g transform="translate(540 640)">
      <rect x={-380} y={-80} width={760} height={160} rx={16} fill="#fffaf0" stroke="#e0572a" strokeWidth={10} />
      <text x={0} y={30} textAnchor="middle" fontFamily={FONTE} fontSize={88} fill="#e0572a" letterSpacing={4}>BEM-VINDA, ELISA</text>
    </g>
    {[[90, 900, "#e0572a"], [200, 820, "#e9b730"], [900, 860, "#3d6fa3"], [1000, 940, "#5c9a4f"]].map(([x, y, c], i) => (
      <g key={i} transform={`translate(${x} ${(y as number) + Math.sin(t * 1.5 + i) * 14})`}><line x1={0} y1={70} x2={Math.sin(t + i) * 10} y2={420} stroke="#8a5a3a" strokeWidth={4} /><ellipse rx={60} ry={76} fill={c as string} /><ellipse cx={-20} cy={-26} rx={14} ry={20} fill="#fff" opacity={0.4} /></g>
    ))}
    {/* a cadeira guardada */}
    <g transform="translate(900 1790)">
      <rect x={-90} y={-520} width={180} height={300} rx={20} fill="#8a5a3a" /><rect x={-100} y={-240} width={200} height={40} rx={10} fill="#a8744e" />
      <rect x={-90} y={-200} width={20} height={200} fill="#6b4428" /><rect x={70} y={-200} width={20} height={200} fill="#6b4428" />
      <rect x={-70} y={-450} width={140} height={70} rx={8} fill="#fffaf0" /><text x={0} y={-400} textAnchor="middle" fontFamily={FONTE} fontSize={46} fill="#e0572a">ELISA</text>
    </g>
    <rect {...TODO} y={1790} fill="#c9986a" />
    {Array.from({ length: 26 }, (_, i) => <rect key={i} x={acaso(i, 1) * 1080} y={(acaso(i, 2) * 1900 + t * (60 + acaso(i, 3) * 80)) % 1900} width={14} height={8} fill={["#e0572a", "#e9b730", "#3d6fa3", "#5c9a4f"][i % 4]} transform={`rotate(${t * 100 + i * 30} ${acaso(i, 1) * 1080} ${(acaso(i, 2) * 1900 + t * 80) % 1900})`} opacity={0.8} />)}
  </g>
);

/** Bolo com uma vela; `acesa` controla a chama. */
export const Bolo = ({ t, acesa = true }: { t: number; acesa?: boolean }) => (
  <g>
    <ellipse cx={0} cy={0} rx={110} ry={20} fill="#f4f7f8" stroke="#8e99a3" strokeWidth={4} />
    <rect x={-84} y={-80} width={168} height={80} rx={14} fill="#f6a5a0" /><path d="M-84 -60 q21 26 42 0 q21 26 42 0 q21 26 42 0 q21 26 42 0 L84 -80 L-84 -80Z" fill="#fffaf0" />
    <rect x={-7} y={-140} width={14} height={62} fill="#3d6fa3" />
    {acesa ? <g><path d="M0 -140 Q-14 -166 0 -196 Q14 -166 0 -140Z" fill="#ffb347" transform={`scale(${0.95 + 0.1 * Math.sin(t * 13)})`} /><circle cy={-164} r={90} fill="#ffb347" opacity={0.18} /></g>
      : <path d={`M0 -144 q${Math.sin(t * 3) * 14} -30 0 -60 q${-Math.sin(t * 3) * 14} -30 0 -60`} stroke="#8e99a3" strokeWidth={5} fill="none" opacity={0.6} />}
  </g>
);
