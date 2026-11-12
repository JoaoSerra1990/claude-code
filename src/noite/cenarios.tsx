import { Ator, type Visual } from "../serie/Ator";
import { mix } from "../abismo/cenarios";

// Cenários do curta "Os Filhos da Noite": a cidade deserta, o quarto de Lucas,
// o refúgio subterrâneo e o laboratório clandestino.

const FONTE = "Anton, Impact, sans-serif";
const acaso = (i: number, k: number) => {
  const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return v - Math.floor(v);
};
/** Mistura duas cores hexadecimais e devolve outra cor hexadecimal (para encadear misturas). */
const mh = (a: string, b: string, p: number) => {
  const h = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const A = h(a), B = h(b), q = Math.min(1, Math.max(0, p));
  return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * q).toString(16).padStart(2, "0")).join("");
};
const TODO = { x: -200, y: -200, width: 1480, height: 2320 };

export const PALIDO: Visual = { pele: "#b9c7d9", cabelo: "#e8eef2", roupa: "#2a2f3a", casaco: true, calca: "#1c1f26", estilo: "baguncado", sobrancelha: "#8e99a3" };
export const palido = (i: number): Visual => ({
  pele: ["#b9c7d9", "#c2cfdf", "#aebccf"][i % 3], cabelo: ["#e8eef2", "#5a5f6a", "#8a8f98", "#3a3340"][i % 4],
  roupa: ["#4a5a6b", "#5a4a6b", "#3f5f5a", "#6b5a4a"][i % 4], calca: "#2a2f3a", estilo: (["longo", "curto", "coque", "cacheado", "rabo"] as const)[i % 5], sobrancelha: "#6f7a8a",
});

// ---------- a cidade ----------
export const Cidade = ({ t, noite = 0, vultos = false, veneno = 0, porta = 0, renasce = 0 }: {
  t: number;
  /** Do dia (0) à noite (1). */
  noite?: number;
  /** Figuras pálidas andando pela rua. */
  vultos?: boolean;
  /** Névoa verde do produto químico, de 0 a 1. */
  veneno?: number;
  /** Porta de Lucas aberta, com uma luz fraca, de 0 a 1. */
  porta?: number;
  /** Cidade se reconstruindo ao amanhecer, de 0 a 1. */
  renasce?: number;
}) => (
  <g>
    <defs>
      <linearGradient id="no-ceu" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={mix(mh("#7fa8c9", "#070b1a", noite), "#5f9fe0", renasce)} /><stop offset="1" stopColor={mix(mh("#e9d9b8", "#27304d", noite), "#ffd9a0", renasce)} />
      </linearGradient>
    </defs>
    <rect {...TODO} fill="url(#no-ceu)" />
    {noite > 0.5 && Array.from({ length: 40 }, (_, i) => <circle key={i} cx={acaso(i, 1) * 1080} cy={acaso(i, 2) * 800} r={1.5 + acaso(i, 3) * 2.5} fill="#fff" opacity={0.4 + 0.4 * Math.sin(t * 2 + i)} />)}
    {noite > 0.5 && <g><circle cx={820} cy={300} r={80} fill="#e9eef7" /><circle cx={820} cy={300} r={230} fill="#9fb5d9" opacity={0.18} /></g>}
    {renasce > 0 && <g opacity={renasce}><circle cx={540} cy={1120 - renasce * 260} r={150} fill="#fff6d6" /><circle cx={540} cy={1120 - renasce * 260} r={520} fill="#ffd98a" opacity={0.35} /></g>}
    {[[-90, 560, 300], [200, 400, 280], [470, 620, 260], [720, 460, 300], [1000, 580, 260]].map(([x, y, w], i) => {
      const cor = mix(mh(["#9a8f86", "#8a9098", "#a39a8a", "#8f8a96", "#9a938a"][i], ["#161a2a", "#1c2034", "#141828", "#1a1e30", "#161a2a"][i], noite), ["#d9b08a", "#b8c7d9", "#e0c9a0", "#c9b0c0", "#c2d0b0"][i], renasce);
      return (
        <g key={i}>
          <rect x={x} y={y} width={w} height={1100} fill={cor} />
          {Array.from({ length: 12 }, (_, k) => {
            const tapada = acaso(k, i) > 0.45 && renasce < 0.5;
            return (
              <g key={k} transform={`translate(${x + 30 + (k % 3) * (w / 3.3)} ${y + 60 + Math.floor(k / 3) * 190})`}>
                <rect width={w / 6} height={100} fill={renasce > 0.5 ? "#ffe9a8" : mix("#3a4048", "#0a0d18", noite)} />
                {tapada && <path d={`M-6 20 L${w / 6 + 6} 34 M-6 70 L${w / 6 + 6} 56`} stroke="#6b4f3a" strokeWidth={14} />}
              </g>
            );
          })}
          {renasce < 0.5 && <path d={`M${x + 20} ${y} q20 120 -10 260 M${x + w - 30} ${y} q-24 160 6 320`} stroke={mix("#5c8a4f", "#1c2a22", noite)} strokeWidth={12} fill="none" />}
          {renasce > 0.5 && i % 2 === 0 && <path d={`M${x + w} ${y + 200} L${x + w + 40} ${y + 200} L${x + w + 40} 1500 M${x + w} ${y + 500} L${x + w + 40} ${y + 500}`} stroke="#8a5a3a" strokeWidth={10} fill="none" />}
        </g>
      );
    })}
    {/* a casa de Lucas, com a porta */}
    <g transform="translate(140 1500)">
      <rect x={-110} y={-420} width={220} height={420} fill={porta > 0 ? "#ffe2a0" : mix("#3a2a22", "#12101a", noite)} stroke={mix("#6b4f3a", "#231a16", noite)} strokeWidth={14} />
      {porta > 0 && <path d="M-110 0 L110 0 L520 620 L-200 620Z" fill="#ffe2a0" opacity={0.22 * porta} />}
      {porta > 0 && <circle cy={-470} r={130} fill="#ffe2a0" opacity={0.25 * porta} />}
    </g>
    <rect x={-200} y={1500} width={1480} height={620} fill={mix(mh("#7d7a74", "#12141f", noite), "#b9b2a6", renasce)} />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${-100 + i * 170} ${1560 + (i % 3) * 110} l60 -20 l40 30 l70 -24`} stroke={mix("#5c5a56", "#0a0b12", noite)} strokeWidth={6} fill="none" />)}
    {renasce < 0.5 && [[760, 1640], [420, 1860]].map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y}) scale(${1 + i * 0.25})`}>
        <path d="M-150 -40 L-110 -110 L70 -110 L124 -40 L164 -34 L164 14 L-164 14 L-164 -32Z" fill={mix("#8a6a5a", "#1a1c2a", noite)} />
        <circle cx={-90} cy={16} r={28} fill="#0c0e16" /><circle cx={96} cy={16} r={28} fill="#0c0e16" />
        <path d="M-120 -108 q40 -50 90 -6 q50 -40 100 0" stroke={mix("#5c8a4f", "#1c2a22", noite)} strokeWidth={12} fill="none" />
      </g>
    ))}
    {renasce > 0.5 && [100, 420, 760, 1000].map((x, i) => <g key={x} transform={`translate(${x} 1520)`}><rect x={-60} y={-30} width={120} height={50} rx={8} fill="#a8744e" />{[-36, 0, 36].map((dx) => <g key={dx}><path d={`M${dx} -30 Q${dx + Math.sin(t * 2 + i) * 6} -60 ${dx} -84`} stroke="#5c9a4f" strokeWidth={6} fill="none" /><circle cx={dx} cy={-90} r={16} fill={["#e0572a", "#e9b730", "#f6a5a0"][(i + dx + 72) % 3]} /></g>)}</g>)}
    {vultos && Array.from({ length: 5 }, (_, i) => {
      const x = ((t * (26 + i * 8) + i * 300) % 1500) - 200, y = 1600 + (i % 3) * 110;
      return (
        <g key={i} transform={`translate(${x} ${y}) scale(${0.36 + (i % 3) * 0.06})`}>
          <Ator v={renasce > 0.5 ? palido(i) : { ...palido(i), roupa: "#0c0e18", calca: "#0c0e18", cabelo: "#0c0e18" }} t={t} andando expr={renasce > 0.5 ? "feliz" : "neutro"} olhar={[1, 0]} fase={i * 2} />
        </g>
      );
    })}
    {veneno > 0 && Array.from({ length: 10 }, (_, i) => <ellipse key={i} cx={540 + Math.sin(t * 0.4 + i * 1.7) * 260} cy={900 + i * 100} rx={560} ry={110} fill="#8fd65a" opacity={0.16 * veneno} />)}
  </g>
);

// ---------- o quarto de Lucas ----------
const CORACAO = "M0 60 C-110 -30 -60 -120 0 -50 C60 -120 110 -30 0 60Z";
export const JANELA: [number, number] = [680, 780];
export const Quarto = ({ t, coracao = 0, nome = 0, texto = "ANA", fora }: {
  t: number;
  /** Coração sendo desenhado no vidro, de 0 a 1. */
  coracao?: number;
  /** Nome sendo escrito no vidro, de 0 a 1. */
  nome?: number; texto?: string;
  /** Quem está do lado de fora da janela. */
  fora?: Visual;
}) => (
  <g>
    <rect {...TODO} fill="#1c1a24" />
    {Array.from({ length: 8 }, (_, i) => <line key={i} x1={-200} y1={i * 260} x2={1280} y2={i * 260} stroke="#000" strokeOpacity={0.2} strokeWidth={5} />)}
    {/* janela embaçada */}
    <g transform={`translate(${JANELA[0]} ${JANELA[1]})`}>
      <rect x={-300} y={-380} width={600} height={760} rx={10} fill="#1a2644" stroke="#0f0e16" strokeWidth={26} />
      <clipPath id="no-vidro"><rect x={-287} y={-367} width={574} height={734} /></clipPath>
      <g clipPath="url(#no-vidro)">
        <circle cx={170} cy={-250} r={56} fill="#e9eef7" opacity={0.8} />
        {fora && <g transform="translate(40 640) scale(0.95)"><Ator v={fora} t={t} expr="sereno" pose={coracao > 0 && coracao < 1 || nome > 0 && nome < 1 ? "apontarCima" : "parado"} olhar={[-0.4, 0]} fase={3} /></g>}
        <rect x={-287} y={-367} width={574} height={734} fill="#c9d6e8" opacity={0.3} />
        {coracao > 0 && <path d={CORACAO} transform="translate(-60 40) scale(1.5)" stroke="#f4f9ff" strokeWidth={12} fill="none" strokeLinecap="round" strokeDasharray={700} strokeDashoffset={700 * (1 - coracao)} />}
        {nome > 0 && texto.split("").map((c, i) => (
          <text key={i} x={-190 + i * 150} y={110} fontFamily="'DejaVu Sans', Arial, sans-serif" fontWeight={700} fontSize={190} fill="none" stroke="#f4f9ff" strokeWidth={9}
            opacity={Math.min(1, Math.max(0, nome * texto.length - i))}>{c}</text>
        ))}
      </g>
      <path d="M-320 -120 L320 -60 M-320 240 L320 180" stroke="#4a3428" strokeWidth={46} opacity={0.9} />
    </g>
    {/* porta trancada */}
    <rect x={40} y={620} width={260} height={1170} fill="#3a2a22" stroke="#0f0e16" strokeWidth={14} />
    {[760, 900, 1040].map((y) => <g key={y}><rect x={220} y={y} width={90} height={34} rx={8} fill="#8e99a3" /><circle cx={236} cy={y + 17} r={9} fill="#14181e" /></g>)}
    <path d="M40 1200 L300 1160" stroke="#6b4f3a" strokeWidth={40} />
    <rect {...TODO} y={1790} fill="#12101a" />
    <circle cx={JANELA[0]} cy={JANELA[1]} r={760} fill="#9fb5d9" opacity={0.06} />
  </g>
);

// ---------- o refúgio subterrâneo ----------
export const Refugio = ({ t, raio = 0, luz = 0.2, frascos = false }: {
  t: number;
  /** Facho de sol entrando por uma grade, de 0 a 1. */
  raio?: number;
  /** Intensidade das lâmpadas, de 0 a 1. */
  luz?: number; frascos?: boolean;
}) => (
  <g>
    <rect {...TODO} fill="#1a1c26" />
    <path d="M-200 700 Q540 120 1280 700 L1280 -200 L-200 -200Z" fill="#12131b" />
    {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${-100 + i * 220} 2000 L${-100 + i * 220} ${760 - Math.sin((i / 6) * Math.PI) * 420}`} stroke="#0f1016" strokeWidth={22} />)}
    {/* varal de lâmpadas suaves */}
    <path d="M-200 560 Q540 760 1280 560" stroke="#3a3340" strokeWidth={5} fill="none" />
    {Array.from({ length: 9 }, (_, i) => {
      const x = -60 + i * 150, y = 560 + Math.sin(((x + 200) / 1480) * Math.PI) * 100;
      return <g key={i}><circle cx={x} cy={y + 20} r={120 + luz * 160} fill="#ffcf8a" opacity={0.08 + luz * 0.14} /><circle cx={x} cy={y + 20} r={18} fill="#ffe2b0" /></g>;
    })}
    {/* barracas e horta */}
    {[[150, "#5a4a6b"], [900, "#3f5f5a"]].map(([x, c], i) => <g key={i} transform={`translate(${x} 1790)`}><path d="M-200 0 L0 -330 L200 0Z" fill={c as string} /><path d="M-40 0 L0 -220 L40 0Z" fill="#12131b" /></g>)}
    <g transform="translate(540 1790)"><rect x={-150} y={-70} width={300} height={70} rx={10} fill="#6b4f3a" />{[-100, -50, 0, 50, 100].map((x, i) => <g key={x}><path d={`M${x} -70 Q${x + Math.sin(t * 2 + i) * 6} -110 ${x} -140`} stroke="#5c9a4f" strokeWidth={7} fill="none" /><circle cx={x} cy={-146} r={16} fill="#6fb85a" /></g>)}</g>
    {/* moradores cuidando uns dos outros */}
    {[[330, 1760, 0.4, 1, "abracar"], [420, 1770, 0.26, 4, "parado"], [760, 1750, 0.42, 2, "apontarEsq"], [690, 1770, 0.4, 3, "parado"], [70, 1840, 0.36, 5, "parado"]].map(([x, y, s, i, pose]) => (
      <g key={i as number} transform={`translate(${x} ${y}) scale(${s})`}>
        <Ator v={palido(i as number)} t={t} expr={luz > 0.5 ? "feliz" : "sereno"} pose={pose as "parado"} olhar={[(i as number) % 2 ? 1 : -1, luz > 0.5 ? -0.8 : 0.2]} fase={i as number} />
        {frascos && <g transform="translate(120 -420)"><rect x={-18} y={-50} width={36} height={80} rx={10} fill="#5cc8ff" stroke="#fff" strokeWidth={5} /><circle r={70} fill="#5cc8ff" opacity={0.25} /></g>}
      </g>
    ))}
    {/* facho de sol pela grade */}
    {raio > 0 && (
      <g opacity={raio}>
        <path d="M760 -200 L900 -200 L1060 1790 L700 1790Z" fill="#fff3b0" opacity={0.35} />
        <rect x={740} y={-40} width={180} height={30} fill="#3a3340" />{[770, 810, 850, 890].map((x) => <rect key={x} x={x} y={-200} width={10} height={170} fill="#3a3340" />)}
        <ellipse cx={880} cy={1790} rx={190} ry={30} fill="#fff3b0" opacity={0.6} />
      </g>
    )}
    <rect {...TODO} y={1790} fill="#101118" />
    <rect {...TODO} fill="#ffcf8a" opacity={luz * 0.12} />
  </g>
);

// ---------- laboratório clandestino ----------
export const Lab = ({ t, quebra = 0 }: { t: number; quebra?: number }) => (
  <g>
    <rect {...TODO} fill="#4a4f47" />
    <path d="M-200 -200 L1280 -200 L1280 520 L-200 640Z" fill="#3a3f38" />
    {Array.from({ length: 5 }, (_, i) => <rect key={i} x={60 + i * 210} y={300} width={150} height={24} fill="#fffbe6" opacity={0.75} />)}
    {/* bancada com frascos */}
    <rect x={-200} y={1180} width={1480} height={40} fill="#2a2f28" /><rect x={-200} y={1220} width={1480} height={600} fill="#343a32" />
    {Array.from({ length: 7 }, (_, i) => (
      <g key={i} transform={`translate(${90 + i * 150} 1180)`}>
        <path d="M-22 -150 L22 -150 L22 -90 L52 0 L-52 0 L-22 -90Z" fill="#dfe6ec" opacity={0.5} stroke="#fff" strokeWidth={4} />
        <path d={`M-${30 + 14} -40 L44 -40 L52 0 L-52 0Z`} fill="#8fd65a" opacity={0.85} />
        {Array.from({ length: 3 }, (_, k) => <circle key={k} cx={-16 + k * 16} cy={-50 - ((t * 60 + k * 30 + i * 20) % 90)} r={6} fill="#c9f29a" opacity={0.7} />)}
      </g>
    ))}
    {/* tambores do produto */}
    {[150, 420, 690, 940].map((x, i) => {
      const q = Math.min(1, Math.max(0, quebra * 1.6 - i * 0.2));
      return (
        <g key={x} transform={`translate(${x} 1790) rotate(${q * (i % 2 ? 80 : -80)} 0 0)`}>
          <rect x={-90} y={-330} width={180} height={330} rx={16} fill="#5a6b3a" stroke="#14181e" strokeWidth={8} />
          <rect x={-90} y={-250} width={180} height={18} fill="#14181e" opacity={0.4} /><rect x={-90} y={-100} width={180} height={18} fill="#14181e" opacity={0.4} />
          <rect x={-66} y={-220} width={132} height={100} fill="#fffaf0" /><text x={0} y={-150} textAnchor="middle" fontFamily={FONTE} fontSize={54} fill="#5c9a4f">CURA</text>
        </g>
      );
    })}
    {quebra > 0.2 && <ellipse cx={540} cy={1830} rx={600 * quebra} ry={50} fill="#8fd65a" opacity={0.8} />}
    <rect {...TODO} y={1790} fill="#22261f" opacity={0.6} />
    <rect {...TODO} fill="#8fd65a" opacity={0.05} />
  </g>
);

/** Colar com pingente de estrela. */
export const Colar = ({ t }: { t: number }) => (
  <g transform={`rotate(${Math.sin(t * 4) * 8})`}>
    <path d="M-40 -90 Q0 -20 0 0 Q0 -20 40 -90" stroke="#e6c229" strokeWidth={6} fill="none" />
    <path d="M0 0 L12 26 L40 30 L20 50 L26 78 L0 64 L-26 78 L-20 50 L-40 30 L-12 26Z" fill="#ffd166" stroke="#8a6a1a" strokeWidth={4} />
    <circle cy={40} r={60} fill="#ffd166" opacity={0.2} />
  </g>
);
