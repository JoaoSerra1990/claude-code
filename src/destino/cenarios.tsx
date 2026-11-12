import { Ator, type Visual } from "../serie/Ator";
import { cidadao } from "../curtas/futurista";

// Cenários do curta "Os Homens do Destino": calçada com o café, mercado e a ponte.
// O metrô vem de `oito/cenarios`.

const FONTE = "Anton, Impact, sans-serif";
const acaso = (i: number, k: number) => {
  const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const TODO = { x: -200, y: -200, width: 1480, height: 2320 };

// ---------- calçada: café, vitrine e relógio de rua ----------
export const MESA: [number, number] = [250, 1500];
export const Calcada = ({ t, relogio = "10:03", seta = false, reflexo = 0, homens, sol = 0 }: {
  t: number; relogio?: string;
  /** Seta pintada indicando o caminho previsto. */
  seta?: boolean;
  /** Os homens de terno aparecendo no reflexo da vitrine, de 0 a 1. */
  reflexo?: number; homens?: [Visual, Visual];
  /** Luz de fim de manhã, de 0 a 1. */
  sol?: number;
}) => (
  <g>
    <defs><linearGradient id="de-ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6fb0e0" /><stop offset="1" stopColor="#f6e3c0" /></linearGradient></defs>
    <rect {...TODO} fill="url(#de-ceu)" />
    {sol > 0 && <g opacity={sol}><circle cx={540} cy={620} r={150} fill="#fff6d6" /><circle cx={540} cy={620} r={520} fill="#ffe2a0" opacity={0.35} /></g>}
    {[[-80, 420, 300, "#c98a6a"], [220, 300, 320, "#8a9bb0"], [540, 380, 560, "#d9b98a"], [1000, 260, 300, "#9a7f8f"]].map(([x, y, w, c], i) => (
      <g key={i}>
        <rect x={x as number} y={y as number} width={w as number} height={1300} fill={c as string} />
        {Array.from({ length: 12 }, (_, k) => <rect key={k} x={(x as number) + 30 + (k % 3) * ((w as number) / 3.3)} y={(y as number) + 60 + Math.floor(k / 3) * 150} width={(w as number) / 6} height={84} fill="#e8f3fa" opacity={0.7} />)}
      </g>
    ))}
    {/* toldo e balcão do café */}
    <path d="M-80 1020 L420 1020 L460 1140 L-120 1140Z" fill="#b3402e" />
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-80 + i * 100} 1020 L${-30 + i * 100} 1020 L${-22 + i * 100} 1140 L${-84 + i * 100} 1140Z`} fill="#fffaf0" opacity={0.85} />)}
    <rect x={-40} y={1140} width={440} height={300} fill="#3a2a22" /><text x={180} y={1250} textAnchor="middle" fontFamily={FONTE} fontSize={90} fill="#f4e3c0" letterSpacing={6}>CAFÉ</text>
    {/* vitrine com reflexos */}
    <rect x={600} y={900} width={440} height={540} fill="#27323f" stroke="#14181e" strokeWidth={16} />
    <clipPath id="de-vitrine"><rect x={608} y={908} width={424} height={524} /></clipPath>
    <g clipPath="url(#de-vitrine)">
      <rect x={608} y={908} width={424} height={524} fill="#5f7f96" opacity={0.5} />
      <path d="M608 1100 L760 908 L860 908 L608 1230Z" fill="#fff" opacity={0.12} />
      {reflexo > 0 && homens && homens.map((v, i) => (
        <g key={i} transform={`translate(${720 + i * 190} ${1620 - reflexo * 60}) scale(0.62)`} opacity={reflexo * 0.75}><Ator v={v} t={t} expr="firme" olhar={[-1, 0]} fase={i * 2} /></g>
      ))}
    </g>
    {/* relógio de rua */}
    <g transform="translate(500 1440)">
      <rect x={-8} y={-640} width={16} height={640} fill="#3a4048" />
      <rect x={-120} y={-770} width={240} height={130} rx={14} fill="#14181e" stroke="#3a4048" strokeWidth={8} />
      <text x={0} y={-676} textAnchor="middle" fontFamily={FONTE} fontSize={92} fill="#ffb347">{relogio}</text>
    </g>
    <rect x={-200} y={1440} width={1480} height={460} fill="#cfc7b8" />
    {Array.from({ length: 8 }, (_, i) => <line key={i} x1={-200 + i * 200} y1={1440} x2={-260 + i * 220} y2={1900} stroke="#b3ab9c" strokeWidth={5} />)}
    <rect {...TODO} y={1880} fill="#6f747a" />
    {seta && (
      <g transform="translate(700 1700)" opacity={0.7 + 0.3 * Math.sin(t * 6)}>
        <path d="M-200 -30 L80 -30 L80 -80 L220 0 L80 80 L80 30 L-200 30Z" fill="#ffd166" stroke="#14181e" strokeWidth={8} />
        <text x={-60} y={18} textAnchor="middle" fontFamily={FONTE} fontSize={44} fill="#14181e">PREVISTO</text>
      </g>
    )}
    {/* mesa do café */}
    <g transform={`translate(${MESA[0]} ${MESA[1]})`}>
      <ellipse rx={150} ry={26} fill="#f4f7f8" stroke="#8e99a3" strokeWidth={6} /><rect x={-10} y={0} width={20} height={300} fill="#56636e" /><ellipse cy={300} rx={90} ry={16} fill="#56636e" />
    </g>
  </g>
);

/** Copo de café; `tomba` de 0 (em pé) a 1 (derramado). */
export const Cafezinho = ({ tomba = 0 }: { tomba?: number }) => (
  <g>
    {tomba > 0.4 && <ellipse cx={120 + tomba * 50} cy={8} rx={(tomba - 0.4) * 230} ry={(tomba - 0.4) * 30} fill="#5a3320" />}
    <g transform={`rotate(${tomba * 88})`}>
      <path d="M-34 -100 L34 -100 L26 0 L-26 0Z" fill="#fffaf0" stroke="#8e99a3" strokeWidth={5} />
      <rect x={-38} y={-112} width={76} height={16} rx={6} fill="#3a2a22" /><rect x={-30} y={-66} width={60} height={34} fill="#b3402e" />
    </g>
  </g>
);

/** O caderno do estranho, fechado. */
export const CadernoFechado = () => (
  <g>
    <rect x={-56} y={-74} width={112} height={148} rx={8} fill="#1c2a3a" stroke="#0c1016" strokeWidth={6} />
    <rect x={-56} y={-74} width={20} height={148} fill="#b3402e" /><rect x={-20} y={-40} width={60} height={26} fill="#f4e3c0" />
  </g>
);

// ---------- mercado ----------
export const Mercado = ({ t, rola = 0 }: { t: number; rola?: number }) => (
  <g>
    <rect {...TODO} fill="#f0d9b0" />
    <rect x={-200} y={-200} width={1480} height={700} fill="#8a6a50" />
    {Array.from({ length: 9 }, (_, i) => <line key={i} x1={-200 + i * 190} y1={-200} x2={-200 + i * 190} y2={500} stroke="#6b4f3a" strokeWidth={14} />)}
    {Array.from({ length: 12 }, (_, i) => <g key={i} transform={`translate(${((i * 170 - rola * 0.5) % 2040 + 2040) % 2040 - 200} 500)`}><line x1={0} y1={-200} x2={0} y2={-40} stroke="#3a2a22" strokeWidth={4} /><path d="M-30 -40 L30 -40 L20 20 L-20 20Z" fill="#ffd166" /><circle cy={10} r={60} fill="#ffd166" opacity={0.15} /></g>)}
    <g transform={`translate(${-(rola % 520)} 0)`}>
      {[0, 1, 2, 3].map((i) => {
        const x = -200 + i * 520, cores = [["#e0572a", "#e9b730"], ["#5c9a4f", "#b3402e"], ["#7a4fa3", "#e9b730"], ["#e0572a", "#5c9a4f"]][i];
        return (
          <g key={i} transform={`translate(${x} 0)`}>
            <path d="M0 760 L460 760 L490 900 L-30 900Z" fill={i % 2 ? "#3d6fa3" : "#b3402e"} />
            {Array.from({ length: 5 }, (_, k) => <path key={k} d={`M${k * 92} 760 L${46 + k * 92} 760 L${52 + k * 92} 900 L${-6 + k * 92} 900Z`} fill="#fffaf0" opacity={0.8} />)}
            <rect x={10} y={900} width={16} height={520} fill="#6b4f3a" /><rect x={434} y={900} width={16} height={520} fill="#6b4f3a" />
            <rect x={0} y={1240} width={460} height={260} fill="#a8744e" stroke="#6b4f3a" strokeWidth={8} />
            {Array.from({ length: 18 }, (_, k) => <circle key={k} cx={34 + (k % 6) * 78 + (Math.floor(k / 6) % 2) * 30} cy={1220 - Math.floor(k / 6) * 50} r={34} fill={cores[(k + Math.floor(k / 6)) % 2]} stroke="#14161c" strokeOpacity={0.15} strokeWidth={4} />)}
            <g transform="translate(230 1250) scale(0.4)"><Ator v={cidadao(i + 4)} t={t} expr="surpreso" olhar={[1, 0.4]} fase={i} /></g>
            <rect x={0} y={1240} width={460} height={60} fill="#a8744e" />
          </g>
        );
      })}
    </g>
    <rect {...TODO} y={1500} fill="#c9b08a" />
    {Array.from({ length: 7 }, (_, i) => <ellipse key={i} cx={((i * 220 - rola) % 1540 + 1540) % 1540 - 200} cy={1880} rx={50} ry={12} fill="#a8906a" />)}
  </g>
);

// ---------- a ponte ----------
export const Ponte = ({ t, gente = 1, alerta = 0, cai = 0 }: {
  t: number;
  /** Quanta gente ainda está sobre a ponte, de 1 a 0. */
  gente?: number;
  /** Celulares tocando o alerta, de 0 a 1. */
  alerta?: number;
  /** Desabamento do vão central, de 0 a 1. */
  cai?: number;
}) => {
  const q = cai * cai;
  return (
    <g>
      <defs><linearGradient id="de-rio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7fb8e0" /><stop offset="1" stopColor="#f3e3c0" /></linearGradient></defs>
      <rect {...TODO} fill="url(#de-rio)" />
      <circle cx={820} cy={420} r={90} fill="#fff6d6" /><circle cx={820} cy={420} r={280} fill="#ffe2a0" opacity={0.3} />
      {Array.from({ length: 10 }, (_, i) => <rect key={i} x={-60 + i * 120} y={900 - acaso(i, 1) * 260} width={104} height={500} fill="#9fb0c4" opacity={0.7} />)}
      <rect x={-200} y={1360} width={1480} height={760} fill="#3d7fa8" />
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-200 + ((t * 30 + i * 180) % 1500)} ${1440 + i * 44} q40 -14 80 0 q40 14 80 0`} stroke="#bfe3f5" strokeWidth={5} fill="none" opacity={0.6} />)}
      {/* torres e cabos */}
      {[230, 850].map((x) => <g key={x}><rect x={x - 26} y={620} width={52} height={900} fill="#8a4a3a" /><rect x={x - 40} y={600} width={80} height={40} fill="#6b3a2e" /></g>)}
      <path d="M-200 900 Q20 660 230 630" stroke="#6b3a2e" strokeWidth={10} fill="none" /><path d="M850 630 Q1060 660 1280 900" stroke="#6b3a2e" strokeWidth={10} fill="none" />
      {cai < 0.2 && <path d="M230 630 Q540 1040 850 630" stroke="#6b3a2e" strokeWidth={10} fill="none" />}
      {cai < 0.2 && Array.from({ length: 9 }, (_, i) => { const x = 290 + i * 62, y = 630 + Math.sin(((x - 230) / 620) * Math.PI) * 300; return <line key={i} x1={x} y1={y} x2={x} y2={1100} stroke="#6b3a2e" strokeWidth={4} />; })}
      {/* tabuleiro: margens firmes e vão central que desaba */}
      <rect x={-200} y={1100} width={500} height={44} fill="#56636e" /><rect x={780} y={1100} width={500} height={44} fill="#56636e" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={300 + i * 120} y={1100} width={120} height={44} fill="#56636e" stroke="#3a4048" strokeWidth={3}
          transform={`translate(0 ${q * (500 + i * 60)}) rotate(${q * (i % 2 ? 50 : -40)} ${360 + i * 120} 1122)`} />
      ))}
      {cai > 0.5 && Array.from({ length: 8 }, (_, i) => <circle key={i} cx={320 + i * 60} cy={1400 - (cai - 0.5) * 300 * acaso(i, 2)} r={30 + (cai - 0.5) * 120} fill="#fff" opacity={(1 - cai) * 1.6} />)}
      {/* pessoas e carros sobre a ponte */}
      {Array.from({ length: 12 }, (_, i) => {
        const x0 = 120 + i * 76, lado = x0 < 540 ? -1 : 1, fuga = Math.max(0, 1 - gente) * (700 + i * 30);
        const x = x0 + lado * fuga;
        if (x < -150 || x > 1230) return null;
        return (
          <g key={i} transform={`translate(${x} 1100)`}>
            <g transform="scale(0.16)"><Ator v={cidadao(i)} t={t} expr={alerta > 0 ? "medo" : "sereno"} andando={gente < 1} pose={alerta > 0 && gente === 1 ? "apontarCima" : "parado"} fase={i} /></g>
            {alerta > 0 && gente > 0.9 && (
              <g transform="translate(26 -120)" opacity={alerta}>
                <rect x={-14} y={-24} width={28} height={48} rx={5} fill="#14181e" stroke="#ff5a4a" strokeWidth={4} />
                <circle r={20 + ((t * 80 + i * 13) % 50)} fill="none" stroke="#ff5a4a" strokeWidth={4} opacity={1 - ((t * 80 + i * 13) % 50) / 50} />
              </g>
            )}
          </g>
        );
      })}
      <rect x={-200} y={1096} width={500} height={8} fill="#e6c229" /><rect x={780} y={1096} width={500} height={8} fill="#e6c229" />
      {/* margem em primeiro plano */}
      <path d="M-200 1760 Q300 1700 700 1780 Q1000 1740 1280 1790 L1280 2120 L-200 2120Z" fill="#7a9a5f" />
    </g>
  );
};
