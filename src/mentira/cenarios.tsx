import type { ReactNode } from "react";
import { Ator, type Visual } from "../serie/Ator";
import { cidadao } from "../curtas/futurista";

// Cenários do curta "A Cidade de Mentira": a rua perfeita, a parede pintada de
// horizonte, a sala de observação, a sala de casa e o mundo real.

const FONTE = "Anton, Impact, sans-serif";
const acaso = (i: number, k: number) => {
  const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const TODO = { x: -200, y: -200, width: 1480, height: 2320 };
const PASTEIS = ["#f6c9c0", "#c9e4c5", "#c5d9f0", "#f5e3b0"];

/** Cachorro em passo de trote; `some` desfaz o animal em quadradinhos. */
export const Cao = ({ t, some = 0 }: { t: number; some?: number }) => {
  const p = Math.sin(t * 12);
  if (some >= 1) return null;
  return (
    <g>
      <g opacity={1 - some}>
        {[-50, -26, 30, 54].map((x, i) => <rect key={x} x={x - 8} y={-46} width={16} height={46} rx={7} fill="#8a5a36" transform={`rotate(${(i % 2 ? p : -p) * 22} ${x} -46)`} />)}
        <ellipse cx={0} cy={-66} rx={74} ry={34} fill="#b0763f" />
        <path d={`M-70 -76 Q-110 ${-120 + p * 16} -96 ${-150 + p * 20}`} stroke="#b0763f" strokeWidth={14} fill="none" strokeLinecap="round" />
        <circle cx={78} cy={-100} r={36} fill="#b0763f" /><ellipse cx={108} cy={-92} rx={24} ry={16} fill="#c98e55" />
        <circle cx={128} cy={-96} r={7} fill="#14161c" /><circle cx={84} cy={-108} r={6} fill="#14161c" />
        <path d="M54 -124 Q40 -90 60 -76" stroke="#6b4428" strokeWidth={18} fill="none" strokeLinecap="round" />
        <rect x={40} y={-76} width={50} height={10} rx={5} fill="#e0352a" />
      </g>
      {some > 0 && Array.from({ length: 34 }, (_, i) => (
        <rect key={i} x={-90 + acaso(i, 1) * 220 + (acaso(i, 3) - 0.5) * 300 * some} y={-150 + acaso(i, 2) * 150 - some * 200 * acaso(i, 4)} width={16} height={16} fill={i % 3 ? "#b0763f" : "#7ef0ff"} opacity={1 - some} />
      ))}
    </g>
  );
};

const Casa = ({ x, cor }: { x: number; cor: string }) => (
  <g transform={`translate(${x} 1400)`}>
    <rect x={-150} y={-300} width={300} height={300} fill={cor} />
    <path d="M-180 -300 L0 -440 L180 -300Z" fill="#e07a6a" />
    <rect x={-36} y={-150} width={72} height={150} rx={6} fill="#fffaf0" /><circle cx={20} cy={-76} r={6} fill="#e6c229" />
    <rect x={-124} y={-230} width={70} height={70} fill="#bfe3f5" stroke="#fffaf0" strokeWidth={8} /><rect x={54} y={-230} width={70} height={70} fill="#bfe3f5" stroke="#fffaf0" strokeWidth={8} />
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={-176 + i * 44} y={-60} width={14} height={60} rx={6} fill="#fffaf0" />)}
    <rect x={-180} y={-40} width={360} height={10} fill="#fffaf0" />
  </g>
);

// ---------- a rua perfeita ----------
export const RuaPerfeita = ({ t, cao = null, some = 0, glitch = 0, rola = 0, relogio = "08:15" }: {
  t: number;
  /** Posição do cachorro na faixa, de 0 a 1, ou null. */
  cao?: number | null; some?: number;
  /** Falha no céu, de 0 a 1. */
  glitch?: number;
  /** Deslocamento lateral do cenário (corrida). */
  rola?: number; relogio?: string;
}) => {
  const falha = glitch > 0 && Math.sin(t * 37) * Math.sin(t * 11) > -0.3;
  return (
    <g>
      <rect {...TODO} fill="#6ec6ff" />
      <circle cx={860} cy={300} r={90} fill="#fff6c9" />
      {[140, 500, 860].map((x) => <g key={x} transform={`translate(${x} ${560})`}><ellipse rx={110} ry={34} fill="#fff" /><ellipse cx={-40} cy={-26} rx={56} ry={30} fill="#fff" /><ellipse cx={36} cy={-30} rx={60} ry={34} fill="#fff" /></g>)}
      {falha && (
        <g opacity={glitch}>
          <rect x={-200} y={-200} width={1480} height={1100} fill="#05070c" />
          {Array.from({ length: 12 }, (_, i) => <line key={i} x1={i * 100} y1={-200} x2={i * 100} y2={900} stroke="#7ef0ff" strokeWidth={3} opacity={0.5} />)}
          {Array.from({ length: 10 }, (_, i) => <line key={i} x1={-200} y1={i * 100} x2={1280} y2={i * 100} stroke="#7ef0ff" strokeWidth={3} opacity={0.5} />)}
          {["#e0352a", "#e6c229", "#5cf29a", "#7ef0ff", "#7a4fa3"].map((c, i) => <rect key={c} x={i * 216} y={(Math.floor(t * 9) * 97 + i * 60) % 700} width={216} height={70} fill={c} opacity={0.8} />)}
          <text x={540} y={480} textAnchor="middle" fontFamily={FONTE} fontSize={110} fill="#fff">SINAL PERDIDO</text>
        </g>
      )}
      <path d="M-200 1000 Q200 860 540 960 Q880 860 1280 1000 L1280 1420 L-200 1420Z" fill="#8fd17a" />
      <g transform={`translate(${-(rola % 360)} 0)`}>
        {[-180, 180, 540, 900, 1260, 1620].map((x, i) => <Casa key={x} x={x} cor={PASTEIS[i % 4]} />)}
        {[0, 360, 720, 1080, 1440].map((x) => <g key={x} transform={`translate(${x} 1400)`}><rect x={-10} y={-150} width={20} height={150} fill="#a8744e" /><circle cy={-200} r={74} fill="#5fb85a" /></g>)}
      </g>
      {/* relógio da rua */}
      <g transform="translate(540 1400)">
        <rect x={-8} y={-560} width={16} height={560} fill="#56636e" />
        <rect x={-110} y={-680} width={220} height={120} rx={14} fill="#fffaf0" stroke="#56636e" strokeWidth={8} />
        <text x={0} y={-594} textAnchor="middle" fontFamily={FONTE} fontSize={78} fill="#14161c">{relogio}</text>
      </g>
      <rect x={-200} y={1400} width={1480} height={60} fill="#e8e4dc" />
      <rect x={-200} y={1460} width={1480} height={240} fill="#7d8791" />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-120 + i * 110 - (rola % 110)} y={1530} width={66} height={100} fill="#fffaf0" opacity={0.9} />)}
      <rect {...TODO} y={1700} fill="#e8e4dc" /><rect x={-200} y={1700} width={1480} height={14} fill="#c9c4b8" />
      {cao !== null && <g transform={`translate(${-160 + cao * 1400} 1640) scale(1.15)`}><Cao t={t} some={some} /></g>}
    </g>
  );
};

// ---------- a parede pintada de horizonte ----------
export const Parede = ({ t, placa = 0, saidas = 0, luz = 0 }: {
  t: number;
  /** Placa de publicidade girando para revelar a porta, de 0 a 1. */
  placa?: number;
  /** Outras saídas abrindo ao longo da parede, de 0 a 1. */
  saidas?: number;
  /** Luz de fora atravessando a porta, de 0 a 1. */
  luz?: number;
}) => (
  <g>
    <defs><linearGradient id="mt-pint" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5fb4ee" /><stop offset="1" stopColor="#d6efff" /></linearGradient></defs>
    <rect {...TODO} fill="url(#mt-pint)" />
    <circle cx={260} cy={520} r={80} fill="#fff6c9" />
    <path d="M-200 1260 Q160 1080 480 1220 Q760 1090 1280 1250 L1280 1560 L-200 1560Z" fill="#9bd68a" />
    <path d="M-200 1380 Q300 1280 700 1380 Q980 1320 1280 1390 L1280 1560 L-200 1560Z" fill="#82c573" />
    {/* emendas, rebites e tinta escorrida: é só uma parede */}
    {Array.from({ length: 8 }, (_, i) => (
      <g key={i}>
        <line x1={-140 + i * 190} y1={-200} x2={-140 + i * 190} y2={1560} stroke="#2a3a4a" strokeWidth={5} opacity={0.45} />
        {Array.from({ length: 9 }, (_, k) => <circle key={k} cx={-128 + i * 190} cy={k * 200} r={6} fill="#2a3a4a" opacity={0.5} />)}
      </g>
    ))}
    {[[90, 700, 160], [640, 300, 110], [930, 880, 200]].map(([x, y, h], i) => <rect key={i} x={x} y={y} width={14} height={h} rx={7} fill="#fff" opacity={0.5} />)}
    <path d="M700 1100 l60 -30 l40 50 l-50 40Z" fill="#8e99a3" opacity={0.7} />
    {/* andaime */}
    <path d="M900 1560 L900 500 M1060 1560 L1060 500 M900 760 L1060 760 M900 1100 L1060 1100 M900 760 L1060 1100" stroke="#56636e" strokeWidth={12} fill="none" />
    {/* saídas extras */}
    {saidas > 0 && [140, 780].map((x) => (
      <g key={x}>
        <rect x={x - 80} y={1180} width={160} height={380} fill="#fffbe6" />
        <path d={`M${x - 80} 1560 L${x + 80} 1560 L${x + 220} 2100 L${x - 220} 2100Z`} fill="#fffbe6" opacity={0.3 * saidas} />
        <rect x={x - 80} y={1180} width={160 * (1 - saidas)} height={380} fill="#5fb4ee" stroke="#2a3a4a" strokeWidth={5} />
        <rect x={x - 70} y={1100} width={140} height={60} rx={8} fill="#1f7a48" /><text x={x} y={1144} textAnchor="middle" fontFamily={FONTE} fontSize={40} fill="#fff">SAÍDA</text>
      </g>
    ))}
    {/* porta de manutenção atrás da placa */}
    <g transform="translate(540 1560)">
      <rect x={-130} y={-470} width={260} height={470} fill={luz > 0 ? "#fffbe6" : "#10141a"} stroke="#2a3a4a" strokeWidth={10} />
      {luz > 0 && <path d="M-130 0 L130 0 L420 560 L-420 560Z" fill="#fffbe6" opacity={0.35 * luz} />}
      {luz === 0 && <g><rect x={-100} y={-430} width={200} height={70} fill="#e6c229" /><text x={0} y={-380} textAnchor="middle" fontFamily={FONTE} fontSize={40} fill="#14161c">MANUTENÇÃO</text><circle cx={90} cy={-220} r={12} fill="#8e99a3" /></g>}
      <g transform={`translate(-270 0) scale(${Math.max(0.04, Math.cos(placa * 1.45))} 1) translate(270 0)`} opacity={placa >= 1 ? 0.9 : 1}>
        <rect x={-270} y={-640} width={540} height={560} rx={10} fill="#ffd9e0" stroke="#fffaf0" strokeWidth={14} />
        <circle cx={0} cy={-430} r={100} fill="#ffd166" stroke="#14161c" strokeWidth={8} />
        <circle cx={-36} cy={-456} r={12} fill="#14161c" /><circle cx={36} cy={-456} r={12} fill="#14161c" />
        <path d="M-50 -408 Q0 -352 50 -408" stroke="#14161c" strokeWidth={10} fill="none" strokeLinecap="round" />
        <text x={0} y={-250} textAnchor="middle" fontFamily={FONTE} fontSize={76} fill="#e0352a">SORRIA!</text>
        <text x={0} y={-160} textAnchor="middle" fontFamily={FONTE} fontSize={52} fill="#14161c">AQUI TUDO É PERFEITO</text>
        <rect x={-190} y={-80} width={20} height={80} fill="#56636e" /><rect x={170} y={-80} width={20} height={80} fill="#56636e" />
      </g>
    </g>
    <rect {...TODO} y={1560} fill="#9a8f80" />
    {Array.from({ length: 14 }, (_, i) => <ellipse key={i} cx={acaso(i, 1) * 1080} cy={1620 + acaso(i, 2) * 280} rx={30 + acaso(i, 3) * 40} ry={8} fill="#857a6c" />)}
    <rect x={-200} y={1560} width={1480} height={10} fill="#6f6558" />
    {luz > 0 && <rect {...TODO} fill="#fffbe6" opacity={0.12 * luz + 0 * t} />}
  </g>
);

// ---------- sala de observação ----------
export const Observacao = ({ t, v, bloqueio = false, verdade = false }: { t: number; v: Visual[]; bloqueio?: boolean; verdade?: boolean }) => (
  <g>
    <rect {...TODO} fill="#10131a" />
    <rect x={40} y={200} width={1000} height={800} rx={12} fill="#07090d" stroke="#2c3440" strokeWidth={12} />
    {Array.from({ length: 6 }, (_, i) => {
      const x = 70 + (i % 3) * 320, y = 290 + Math.floor(i / 3) * 350;
      return (
        <g key={i} transform={`translate(${x} ${y})`}>
          <clipPath id={`ob${i}`}><rect width={300} height={320} /></clipPath>
          <g clipPath={`url(#ob${i})`}>
            <rect width={300} height={320} fill={verdade ? "#12301f" : "#6ec6ff"} />
            {verdade ? (
              <text x={150} y={180} textAnchor="middle" fontFamily={FONTE} fontSize={54} fill="#5cf29a">{i % 2 ? "SAÍDA" : "VERDADE"}</text>
            ) : (
              <g>
                <rect y={230} width={300} height={90} fill="#e8e4dc" />
                <rect x={30} y={110} width={150} height={120} fill={PASTEIS[i % 4]} /><path d="M14 110 L105 40 L196 110Z" fill="#e07a6a" />
                <g transform={`translate(${220 + Math.sin(t * 1.2 + i) * 30} 300) scale(0.19)`}><Ator v={v[i % v.length]} t={t} expr="feliz" andando fase={i} /></g>
              </g>
            )}
            <rect y={((t * 110 + i * 50) % 360) - 20} width={300} height={12} fill="#fff" opacity={0.08} />
          </g>
          <rect width={300} height={320} fill="none" stroke="#2c3440" strokeWidth={8} />
          <text x={12} y={34} fontFamily={FONTE} fontSize={26} fill="#fff">{`CÂMERA ${i + 1}`}</text>
        </g>
      );
    })}
    <rect x={390} y={212} width={300} height={62} rx={8} fill="#e0352a" opacity={Math.sin(t * 5) > -0.4 ? 1 : 0.5} />
    <text x={540} y={258} textAnchor="middle" fontFamily={FONTE} fontSize={46} fill="#fff" letterSpacing={4}>AO VIVO</text>
    {/* console central */}
    <path d="M300 1500 L780 1500 L840 1790 L240 1790Z" fill="#1c2430" />
    <rect x={300} y={1470} width={480} height={40} fill="#2c3440" />
    <rect x={400} y={1340} width={280} height={130} rx={8} fill="#07090d" stroke={bloqueio ? "#ff5a4a" : "#7ef0ff"} strokeWidth={6} />
    <text x={540} y={1420} textAnchor="middle" fontFamily={FONTE} fontSize={bloqueio ? 40 : 44} fill={bloqueio ? "#ff5a4a" : "#7ef0ff"}>{bloqueio ? "BLOQUEANDO…" : "CONTROLE"}</text>
    {/* plateia de observadores, de costas */}
    {Array.from({ length: 12 }, (_, i) => {
      const fila = Math.floor(i / 6), x = 70 + (i % 6) * 188 + fila * 60, y = 1220 + fila * 170;
      if (fila === 1 && i % 6 > 0 && i % 6 < 4) return null;
      return (
        <g key={i} transform={`translate(${x} ${y})`}>
          <rect x={-70} y={40} width={140} height={260} rx={40} fill="#232b38" />
          <circle cy={0} r={52} fill="#1a202b" />
          <path d="M-56 -10 Q0 -80 56 -10" stroke="#3d4a5c" strokeWidth={10} fill="none" />
        </g>
      );
    })}
    <rect {...TODO} y={1790} fill="#090b10" />
  </g>
);

// ---------- sala de uma casa da cidade ----------
export const SalaTV = ({ t, tela }: { t: number; tela: ReactNode }) => (
  <g>
    <rect {...TODO} fill="#f5e3b0" />
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={-200 + i * 190} y={-200} width={95} height={1700} fill="#fff" opacity={0.18} />)}
    <rect x={130} y={420} width={820} height={600} rx={20} fill="#14161c" />
    <clipPath id="mt-tv"><rect x={160} y={450} width={760} height={540} /></clipPath>
    <g clipPath="url(#mt-tv)"><g transform="translate(160 450)">{tela}</g></g>
    <rect x={160} y={((t * 150) % 540) + 450} width={760} height={10} fill="#fff" opacity={0.08} />
    <rect x={440} y={1020} width={200} height={50} fill="#56636e" /><rect x={300} y={1070} width={480} height={30} rx={10} fill="#a8744e" />
    <circle cx={540} cy={720} r={700} fill="#bfe3f5" opacity={0.08} />
    <rect {...TODO} y={1500} fill="#d9b98a" />
    <rect x={40} y={1560} width={1000} height={300} rx={50} fill="#c5786a" /><rect x={40} y={1500} width={1000} height={160} rx={50} fill="#d98c7a" />
  </g>
);

// ---------- o mundo real ----------
const Carro = ({ cor }: { cor: string }) => (
  <g>
    <path d="M-110 -30 L-80 -80 L50 -80 L90 -30 L120 -26 L120 10 L-120 10 L-120 -24Z" fill={cor} stroke="#14161c" strokeWidth={5} />
    <path d="M-66 -34 L-48 -68 L-6 -68 L-6 -34Z M6 -34 L6 -68 L42 -68 L70 -34Z" fill="#bfe3f5" />
    <circle cx={-66} cy={12} r={22} fill="#14161c" /><circle cx={70} cy={12} r={22} fill="#14161c" />
  </g>
);
export const MundoReal = ({ t }: { t: number }) => (
  <g>
    <defs><linearGradient id="mt-real" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7fa8c9" /><stop offset="1" stopColor="#f3d9b0" /></linearGradient></defs>
    <rect {...TODO} fill="url(#mt-real)" />
    <circle cx={220} cy={520} r={110} fill="#fff1c9" /><circle cx={220} cy={520} r={320} fill="#ffd98a" opacity={0.3} />
    {[[200, 260, 190, 40], [700, 400, 260, 52], [960, 180, 150, 30]].map(([x, y, w, h], i) => <ellipse key={i} cx={(x + t * (8 + i * 5)) % 1500 - 150} cy={y} rx={w} ry={h} fill="#fff" opacity={0.75} />)}
    {[[-60, 640, 230, "#8a7f8f"], [150, 860, 180, "#b5654a"], [310, 520, 250, "#6f7f8c"], [540, 780, 200, "#c9a66b"], [720, 600, 190, "#7a8a6f"], [890, 720, 260, "#9a6a7a"]].map(([x, y, w, c], i) => (
      <g key={i}>
        <rect x={x as number} y={y as number} width={w as number} height={1000} fill={c as string} />
        {Array.from({ length: 15 }, (_, k) => <rect key={k} x={(x as number) + 22 + (k % 3) * ((w as number) / 3.4)} y={(y as number) + 50 + Math.floor(k / 3) * 120} width={(w as number) / 6} height={64} fill={acaso(k, i) > 0.5 ? "#ffe9a8" : "#2a3340"} opacity={0.85} />)}
        <rect x={(x as number) + 20} y={(y as number) - 40} width={50} height={40} fill="#56636e" />
        {i % 2 === 0 && <path d={`M${(x as number) + 20} ${(y as number) + 520} q30 -40 60 0 q30 40 60 0`} stroke="#e0572a" strokeWidth={10} fill="none" />}
      </g>
    ))}
    <path d="M-200 700 Q300 780 620 660 Q900 720 1280 640" stroke="#14161c" strokeWidth={5} fill="none" /><path d="M-200 760 Q400 860 1280 730" stroke="#14161c" strokeWidth={4} fill="none" />
    {/* rua com trânsito */}
    <rect x={-200} y={1400} width={1480} height={320} fill="#4a4f57" />
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={-150 + i * 190} y={1552} width={100} height={12} fill="#e6c229" />)}
    <path d="M300 1460 q40 -14 70 10 q-30 30 -70 -10Z M760 1650 q60 -10 90 16 q-50 20 -90 -16Z" fill="#3a3f47" />
    {[0, 1, 2].map((i) => <g key={i} transform={`translate(${(t * (300 + i * 60) + i * 520) % 1600 - 260} ${1500})`}><Carro cor={["#e0572a", "#3d6fa3", "#e9b730"][i]} /></g>)}
    {[0, 1].map((i) => <g key={i} transform={`translate(${1340 - ((t * (260 + i * 90) + i * 700) % 1600)} ${1650}) scale(-1.15 1.15)`}><Carro cor={["#5c9a4f", "#8a8f98"][i]} /></g>)}
    <g transform="translate(980 1400)"><rect x={-8} y={-360} width={16} height={360} fill="#2a2f38" /><rect x={-34} y={-470} width={68} height={130} rx={10} fill="#14161c" /><circle cy={-438} r={16} fill={Math.floor(t / 2) % 2 ? "#e0352a" : "#3a1512"} /><circle cy={-374} r={16} fill={Math.floor(t / 2) % 2 ? "#12301f" : "#5cf29a"} /></g>
    <rect {...TODO} y={1720} fill="#b9b2a6" /><rect x={-200} y={1720} width={1480} height={14} fill="#8f887c" />
    {/* vento: folhas e papéis */}
    {Array.from({ length: 12 }, (_, i) => {
      const x = (t * (220 + acaso(i, 1) * 200) + i * 130) % 1400 - 160, y = 900 + acaso(i, 2) * 900 + Math.sin(t * 3 + i) * 40;
      return <path key={i} d="M-14 0 Q0 -14 14 0 Q0 14 -14 0Z" transform={`translate(${x} ${y}) rotate(${t * 200 + i * 40})`} fill={i % 3 ? "#c98a3a" : "#f4f7f8"} />;
    })}
    {[0, 1, 2].map((i) => <g key={i} transform={`translate(${60 + i * 480} 1716) scale(0.3)`} opacity={0.9}><Ator v={cidadao(i + 11)} t={t} andando expr="neutro" fase={i * 2} /></g>)}
  </g>
);
