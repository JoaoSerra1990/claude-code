import type { ReactNode } from "react";
import { Ator, type Visual } from "../serie/Ator";

// Cenários do curta "O Abismo": panorama das duas torres sobre a neblina,
// cabine de vigia, travessia no cabo, instalação subterrânea e o vale ao amanhecer.

const FONTE = "Anton, Impact, sans-serif";
const acaso = (i: number, k: number) => {
  const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
/** Mistura duas cores hexadecimais. */
export const mix = (a: string, b: string, p: number) => {
  const A = hex(a), B = hex(b), q = Math.min(1, Math.max(0, p));
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * q)).join(",")})`;
};

// ---------- a criatura ----------
type Ponto = [number, number];
const Braco = ({ de, ate, cor }: { de: Ponto; ate: Ponto; cor: string }) => {
  const meio: Ponto = [(de[0] + ate[0]) / 2 + (ate[1] - de[1]) * 0.18, (de[1] + ate[1]) / 2 + 60];
  const d = `M${de[0]} ${de[1]} Q${meio[0]} ${meio[1]} ${ate[0]} ${ate[1]}`;
  const ang = (Math.atan2(ate[1] - meio[1], ate[0] - meio[0]) * 180) / Math.PI;
  return (
    <g>
      <path d={d} stroke={cor} strokeWidth={96} fill="none" strokeLinecap="round" />
      <path d={d} stroke="#000" strokeOpacity={0.22} strokeWidth={96} fill="none" strokeLinecap="round" strokeDasharray="70 46" />
      <path d={d} stroke="#5a4630" strokeWidth={13} fill="none" strokeDasharray="120 60" />
      <path d={d} stroke="#4f6b45" strokeWidth={8} fill="none" strokeDasharray="30 150" transform="translate(14 -18)" />
      <g transform={`translate(${ate[0]} ${ate[1]}) rotate(${ang})`}>
        {[-34, 0, 34].map((a) => (
          <path key={a} d="M0 0 L92 -8 L120 4 L92 18Z" transform={`rotate(${a})`} fill={cor} stroke="#23262b" strokeWidth={6} />
        ))}
        <circle r={58} fill={cor} />
      </g>
    </g>
  );
};

/** Ser gigante de pedra e raízes. Origem no centro da cabeça. */
export const Criatura = ({ t, olhos = 1, bracoE, bracoD, costas = false, cor = "#4d535a" }: {
  t: number; olhos?: number; bracoE?: Ponto; bracoD?: Ponto; costas?: boolean; cor?: string;
}) => {
  const resp = Math.sin(t * 1.1) * 6;
  return (
    <g>
      {/* tronco */}
      <path d={`M-340 ${170 + resp} Q-380 420 -280 900 L280 900 Q380 420 340 ${170 + resp} Q180 90 0 110 Q-180 90 -340 ${170 + resp}Z`} fill={cor} />
      <path d="M-300 260 L-150 220 L-200 420Z M120 240 L300 300 L210 470Z M-90 520 L90 500 L30 700Z" fill="#000" opacity={0.18} />
      <path d="M-260 300 Q-120 380 -160 620 M240 360 Q120 470 180 720 M-20 180 Q40 400 -40 800" stroke="#5a4630" strokeWidth={16} fill="none" />
      <path d="M-310 200 Q-200 160 -120 200 M150 190 Q240 170 320 220" stroke="#4f6b45" strokeWidth={26} fill="none" strokeLinecap="round" />
      {bracoE && <Braco de={[-310, 230]} ate={bracoE} cor={cor} />}
      {bracoD && <Braco de={[310, 230]} ate={bracoD} cor={cor} />}
      {/* cabeça */}
      <g transform={`translate(0 ${resp * 0.6})`}>
        <path d="M-70 -110 Q-150 -220 -110 -330 M-96 -250 Q-170 -270 -200 -340 M60 -110 Q130 -230 96 -350 M92 -260 Q160 -290 180 -360 M0 -120 Q-10 -200 20 -260" stroke="#5a4630" strokeWidth={20} fill="none" strokeLinecap="round" />
        <path d="M-115 -90 L-60 -134 L44 -128 L118 -70 L124 44 L72 114 L-62 118 L-128 30Z" fill={cor} stroke="#23262b" strokeWidth={8} />
        <path d="M-115 -90 L-60 -134 L44 -128 L10 -60 L-80 -40Z" fill="#fff" opacity={0.1} />
        <path d="M-128 30 L-62 118 L72 114 L20 60Z" fill="#000" opacity={0.2} />
        <path d="M-100 -96 Q-40 -150 30 -124" stroke="#4f6b45" strokeWidth={22} fill="none" strokeLinecap="round" />
        <path d="M-50 116 Q-56 190 -30 240 M10 116 Q14 200 -4 270 M54 112 Q70 170 60 220" stroke="#5a4630" strokeWidth={12} fill="none" strokeLinecap="round" />
        {!costas && ([-1, 1] as const).map((l) => (
          <g key={l} transform={`translate(${l * 52} -8)`}>
            <circle r={46} fill="#ffb347" opacity={0.22 * olhos} />
            <ellipse rx={25} ry={15 * olhos} fill="#ffc35a" />
            <ellipse rx={9} ry={11 * olhos} fill="#7a3d0a" />
            <line x1={-l * 34} y1={-30} x2={l * 30} y2={-22} stroke="#23262b" strokeWidth={9} strokeLinecap="round" />
          </g>
        ))}
        {!costas && <path d="M-40 66 Q0 56 40 66" stroke="#23262b" strokeWidth={8} fill="none" strokeLinecap="round" />}
      </g>
    </g>
  );
};

// ---------- panorama: as duas torres e o abismo ----------
const Torre = ({ x, t, luz, treme = 0 }: { x: number; t: number; luz: boolean; treme?: number }) => (
  <g transform={`translate(${x + Math.sin(t * 43) * 5 * treme} 760) rotate(${Math.sin(t * 31) * 1.6 * treme})`}>
    <path d="M-52 0 L-36 -150 M52 0 L36 -150 M-48 -40 L42 -100 M48 -40 L-42 -100 M-40 -110 L38 -150" stroke="#1b2029" strokeWidth={9} fill="none" />
    <rect x={-66} y={-262} width={132} height={112} fill="#262d3a" stroke="#141820" strokeWidth={6} />
    <path d="M-84 -262 L0 -316 L84 -262Z" fill="#1b2029" />
    <rect x={-44} y={-238} width={88} height={52} fill={luz ? "#fff3b0" : "#3d4f66"} />
    {luz && <circle cy={-212} r={90} fill="#fff3b0" opacity={0.28} />}
    <line x1={0} y1={-316} x2={0} y2={-372} stroke="#1b2029" strokeWidth={5} />
    <circle cy={-374} r={6} fill="#ff4a3a" opacity={0.5 + 0.5 * Math.sin(t * 3)} />
  </g>
);

export const ANCORA_O: Ponto = [296, 520];
export const ANCORA_L: Ponto = [784, 520];
/** Ponto do cabo na fração `f` (0 = torre leste, 1 = torre oeste), com a barriga do cabo. */
export const noCabo = (f: number): Ponto => [
  ANCORA_L[0] + (ANCORA_O[0] - ANCORA_L[0]) * f,
  ANCORA_L[1] + Math.sin(f * Math.PI) * 70,
];

export type PanoramaProps = {
  t: number;
  /** Quanto a criatura saiu da neblina, de 0 a 1. */
  criatura?: number;
  /** Olhos acesos sob a neblina, de 0 a 1. */
  olhos?: number;
  /** Cabo lançado, de 0 a 1; e posição de Davi no cabo (fração), ou null. */
  cabo?: number; davi?: number | null; visualDavi?: Visual;
  luzOeste?: boolean; luzLeste?: boolean;
  tremeOeste?: number;
  /** Garras subindo pela parede oeste, de 0 a 1. */
  garras?: number;
  /** Braço da criatura sustentando a rocha sob a torre oeste, de 0 a 1. */
  segura?: number;
  /** Rachaduras em brasa na rocha oeste, de 0 a 1. */
  fenda?: number;
  neblina?: number; amanhecer?: number;
  /** Barris descendo para o abismo (passado), de 0 a 1, ou null. */
  barris?: number | null;
};

export const Panorama = ({
  t, criatura = 0, olhos = 0, cabo = 0, davi = null, visualDavi, luzOeste = false, luzLeste = true,
  tremeOeste = 0, garras = 0, segura = 0, fenda = 0, neblina = 1, amanhecer = 0, barris = null,
}: PanoramaProps) => {
  const a = amanhecer;
  const rocha = mix("#2a303b", "#6b6259", a);
  const rochaE = mix("#1d222b", "#4f4a45", a);
  const cy = 1760 - criatura * 640;
  const cabeca: Ponto = [560, cy];
  const maoSegura: Ponto = [(408 - cabeca[0]) * segura - 320 * (1 - segura), (1010 - cabeca[1]) * segura + 500 * (1 - segura)];
  const pontosCabo = Array.from({ length: 25 }, (_, i) => noCabo((i / 24) * cabo));
  return (
    <g>
      <defs>
        <linearGradient id="ab-ceu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mix("#060a18", "#5b9bd5", a)} />
          <stop offset="0.6" stopColor={mix("#131c33", "#f6c88c", a)} />
          <stop offset="1" stopColor={mix("#1b2640", "#ffe2b0", a)} />
        </linearGradient>
        <linearGradient id="ab-fundo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mix("#0b1020", "#7fae6a", a)} />
          <stop offset="1" stopColor={mix("#03050b", "#3f7a46", a)} />
        </linearGradient>
      </defs>
      <rect x={-200} y={-200} width={1480} height={2320} fill="url(#ab-ceu)" />
      {a < 0.6 && Array.from({ length: 46 }, (_, i) => (
        <circle key={i} cx={acaso(i, 1) * 1080} cy={acaso(i, 2) * 700} r={1.5 + acaso(i, 3) * 2.5} fill="#fff" opacity={(0.4 + 0.5 * Math.sin(t * 2 + i)) * (1 - a / 0.6)} />
      ))}
      <circle cx={820} cy={230} r={70} fill="#e9eef7" opacity={0.85 * (1 - a)} />
      <circle cx={540} cy={1020 - a * 240} r={120} fill="#fff1c9" opacity={a} />
      <circle cx={540} cy={1020 - a * 240} r={300} fill="#ffd98a" opacity={a * 0.3} />
      {/* serras distantes */}
      <path d="M-100 1000 L120 760 L300 900 L470 720 L640 880 L820 700 L1000 860 L1200 760 L1200 1920 L-100 1920Z" fill={mix("#10172a", "#8e86a8", a)} />
      {/* fundo do abismo: vale escondido sob a neblina */}
      <rect x={380} y={1050} width={320} height={900} fill="url(#ab-fundo)" />
      <path d="M520 1920 Q470 1700 560 1560 Q620 1460 540 1330" stroke={mix("#0b1326", "#9fd4ee", a)} strokeWidth={34} fill="none" opacity={0.9} />

      {/* criatura atrás da neblina */}
      <g transform={`translate(${cabeca[0] + Math.sin(t * 0.6) * 10} ${cabeca[1]}) scale(0.92)`}>
        <Criatura t={t} olhos={Math.max(olhos, criatura)} bracoE={segura > 0 ? maoSegura.map((v) => v / 0.92) as Ponto : undefined} cor={mix("#3a4048", "#6a6f6a", a)} />
      </g>

      {/* montanhas */}
      <path d="M-80 1940 L-80 830 L110 760 L340 760 L404 900 L436 1150 L404 1500 L450 1940Z" fill={rocha} />
      <path d="M340 760 L404 900 L436 1150 L404 1500 L450 1940 L360 1940 L330 1400 L360 1100 L300 860Z" fill={rochaE} />
      <path d="M1160 1940 L1160 830 L970 760 L740 760 L676 900 L644 1150 L676 1500 L630 1940Z" fill={rocha} />
      <path d="M740 760 L676 900 L644 1150 L676 1500 L630 1940 L720 1940 L750 1400 L720 1100 L780 860Z" fill={rochaE} />
      <path d="M-80 830 L110 760 L340 760 L300 800 L120 800 L-80 880Z M1160 830 L970 760 L740 760 L780 800 L960 800 L1160 880Z" fill={mix("#353d4b", "#7fa35f", a)} />
      {fenda > 0 && (
        <g opacity={fenda}>
          <path d="M330 800 L372 880 L350 960 L400 1040 L380 1130 M372 880 L410 910 M350 960 L318 1010" stroke="#ff5a2a" strokeWidth={9} fill="none" opacity={0.7 + 0.3 * Math.sin(t * 9)} />
          <path d="M330 800 L372 880 L350 960 L400 1040 L380 1130" stroke="#ffd166" strokeWidth={3} fill="none" />
        </g>
      )}
      {garras > 0 && (
        <g transform={`translate(424 ${1420 - garras * 330})`} fill="#0b0d12">
          {[0, 1, 2].map((i) => <path key={i} d="M40 0 Q-30 -20 -50 30 Q-20 10 30 34Z" transform={`translate(${i * 6} ${i * 46}) rotate(${Math.sin(t * 5 + i) * 6})`} />)}
          <path d="M30 0 L120 60 L120 150 L30 120Z" />
        </g>
      )}
      <Torre x={230} t={t} luz={luzOeste} treme={tremeOeste} />
      <Torre x={850} t={t} luz={luzLeste} />

      {barris !== null && [0, 1, 2].map((i) => {
        const x = [420, 540, 650][i];
        const y = 820 + ((barris * 900 + i * 260) % 900);
        return (
          <g key={i}>
            <line x1={x} y1={640} x2={x} y2={y} stroke="#0c0f15" strokeWidth={5} />
            <g transform={`translate(${x} ${y}) rotate(${Math.sin(t * 2 + i) * 4})`}>
              <rect x={-30} y={0} width={60} height={84} rx={8} fill="#c9b23a" stroke="#141820" strokeWidth={5} />
              <path d="M0 22 L18 54 L-18 54Z" fill="#141820" />
            </g>
          </g>
        );
      })}
      {barris !== null && <path d="M296 640 L784 640" stroke="#0c0f15" strokeWidth={10} />}

      {/* cabo de aço e Davi na travessia */}
      {cabo > 0 && <polyline points={pontosCabo.map((p) => p.join(",")).join(" ")} stroke="#c9d3e0" strokeWidth={4} fill="none" />}
      {cabo > 0 && cabo < 1 && <circle cx={pontosCabo[24][0]} cy={pontosCabo[24][1]} r={9} fill="#fff" />}
      {davi !== null && visualDavi && (() => {
        const [x, y] = noCabo(davi);
        return (
          <g transform={`translate(${x + Math.sin(t * 3) * 3} ${y})`}>
            <line x1={0} y1={0} x2={0} y2={22} stroke="#c9d3e0" strokeWidth={3} />
            <g transform="translate(0 92) scale(0.085)"><Ator v={visualDavi} t={t} expr="medo" pose="alcancar" /></g>
          </g>
        );
      })()}

      {/* neblina */}
      {neblina > 0 && Array.from({ length: 9 }, (_, i) => (
        <ellipse key={i} cx={540 + Math.sin(t * 0.25 + i * 1.7) * 160} cy={1230 + i * 86} rx={520 + acaso(i, 7) * 200} ry={90 + acaso(i, 8) * 50}
          fill={mix("#93a3bd", "#f4ecd9", a)} opacity={(0.2 + i * 0.07) * neblina} />
      ))}
    </g>
  );
};

// ---------- cabine de vigia ----------
export type Tela = "onda" | "semSinal" | "ordem";
export const Cabine = ({ t, lado, luzFora = false, tela = "onda", alerta = 0, riscos = 0 }: {
  t: number; lado: "leste" | "oeste"; luzFora?: boolean; tela?: Tela; alerta?: number;
  /** Semanas riscadas na parede. */
  riscos?: number;
}) => {
  const parede = lado === "leste" ? "#26303a" : "#2c2a3a";
  const torreX = lado === "leste" ? 330 : 750;
  const pisca = Math.sin(t * 11) > 0;
  return (
    <g>
      <rect x={-200} y={-200} width={1480} height={2320} fill={parede} />
      {Array.from({ length: 8 }, (_, i) => <line key={i} x1={-200} y1={i * 250 + 60} x2={1280} y2={i * 250 + 60} stroke="#000" strokeOpacity={0.18} strokeWidth={5} />)}
      {/* janela para o abismo */}
      <rect x={120} y={400} width={840} height={720} rx={18} fill="#0a1022" stroke="#11161d" strokeWidth={26} />
      <clipPath id={`cab-${lado}`}><rect x={133} y={413} width={814} height={694} /></clipPath>
      <g clipPath={`url(#cab-${lado})`}>
        {Array.from({ length: 22 }, (_, i) => <circle key={i} cx={140 + acaso(i, 4) * 800} cy={420 + acaso(i, 5) * 320} r={2 + acaso(i, 6) * 2} fill="#fff" opacity={0.5 + 0.4 * Math.sin(t * 2 + i)} />)}
        <path d={`M${torreX - 330} 1120 L${torreX - 200} 860 L${torreX + 200} 860 L${torreX + 330} 1120Z`} fill="#1a2130" />
        <g transform={`translate(${torreX} 860) scale(0.9)`}>
          <path d="M-52 0 L-36 -150 M52 0 L36 -150 M-48 -40 L42 -100 M48 -40 L-42 -100" stroke="#0e1219" strokeWidth={9} fill="none" />
          <rect x={-66} y={-262} width={132} height={112} fill="#141a24" />
          <path d="M-84 -262 L0 -316 L84 -262Z" fill="#0e1219" />
          <rect x={-44} y={-238} width={88} height={52} fill={luzFora ? "#fff3b0" : "#1f2937"} />
          {luzFora && <circle cy={-212} r={130} fill="#fff3b0" opacity={0.35} />}
        </g>
        {Array.from({ length: 4 }, (_, i) => <ellipse key={i} cx={540 + Math.sin(t * 0.3 + i * 2) * 120} cy={1010 + i * 40} rx={520} ry={60} fill="#93a3bd" opacity={0.25 + i * 0.1} />)}
      </g>
      <line x1={540} y1={400} x2={540} y2={1120} stroke="#11161d" strokeWidth={18} />
      {/* bancada, monitor e rádio */}
      <rect x={60} y={1190} width={960} height={70} fill="#151a22" />
      <rect x={90} y={1260} width={900} height={560} fill="#1b222c" />
      <g transform="translate(700 1010)">
        <rect x={-150} y={-20} width={300} height={200} rx={12} fill="#0c1016" stroke="#39424f" strokeWidth={8} />
        {tela === "onda" && <polyline points={Array.from({ length: 28 }, (_, i) => `${-130 + i * 9.6},${80 + Math.sin(i * 0.9 + t * 5) * 34 * Math.sin(i * 0.2)}`).join(" ")} stroke="#5cf29a" strokeWidth={5} fill="none" />}
        {tela === "semSinal" && (
          <g opacity={pisca ? 1 : 0.35}>
            <rect x={-142} y={-12} width={284} height={184} fill="#3a0a0a" />
            <text x={0} y={70} textAnchor="middle" fontFamily={FONTE} fontSize={54} fill="#ff5a4a">SEM</text>
            <text x={0} y={136} textAnchor="middle" fontFamily={FONTE} fontSize={54} fill="#ff5a4a">SINAL</text>
          </g>
        )}
        {tela === "ordem" && (
          <g>
            <rect x={-142} y={-12} width={284} height={184} fill="#2a1a06" />
            <text x={0} y={52} textAnchor="middle" fontFamily={FONTE} fontSize={34} fill="#ffb347">ORDEM DO COMANDO</text>
            <text x={0} y={110} textAnchor="middle" fontFamily={FONTE} fontSize={50} fill="#ff5a4a" opacity={pisca ? 1 : 0.5}>NÃO</text>
            <text x={0} y={160} textAnchor="middle" fontFamily={FONTE} fontSize={44} fill="#ff5a4a" opacity={pisca ? 1 : 0.5}>ATRAVESSAR</text>
          </g>
        )}
        <rect x={-30} y={180} width={60} height={20} fill="#39424f" />
      </g>
      <g transform="translate(300 1130)">
        <rect x={-110} y={-10} width={220} height={74} rx={10} fill="#39424f" />
        <circle cx={-60} cy={27} r={22} fill="#141820" /><circle cx={60} cy={27} r={8} fill={Math.sin(t * 4) > 0 ? "#5cf29a" : "#1f3a2a"} />
        <line x1={96} y1={-10} x2={130} y2={-120} stroke="#39424f" strokeWidth={6} />
      </g>
      {/* contagem dos dias na parede */}
      {Array.from({ length: riscos }, (_, i) => {
        const g = Math.floor(i / 5), k = i % 5;
        const x = 150 + (g % 6) * 64, y = 190 + Math.floor(g / 6) * 90;
        return k < 4
          ? <line key={i} x1={x + k * 11} y1={y} x2={x + k * 11} y2={y + 56} stroke="#cfd6e0" strokeWidth={5} opacity={0.7} />
          : <line key={i} x1={x - 8} y1={y + 46} x2={x + 42} y2={y + 10} stroke="#cfd6e0" strokeWidth={5} opacity={0.7} />;
      })}
      {/* luminária */}
      <line x1={880} y1={-200} x2={880} y2={190} stroke="#11161d" strokeWidth={6} />
      <path d="M840 190 L920 190 L950 250 L810 250Z" fill="#11161d" />
      <path d="M810 250 L950 250 L1150 1300 L610 1300Z" fill={alerta > 0 ? "#ff3a2a" : "#ffe9a8"} opacity={alerta > 0 ? 0.08 + 0.1 * alerta * (pisca ? 1 : 0.3) : 0.07} />
      <rect x={-200} y={1790} width={1480} height={330} fill="#12161d" />
      {alerta > 0 && <rect x={-200} y={-200} width={1480} height={2320} fill="#ff2a1a" opacity={alerta * (0.1 + 0.12 * Math.sin(t * 9) ** 2)} />}
    </g>
  );
};

/** Lanterna de sinais na mão de um ator; `acesa` liga o facho. */
export const Lanterna = ({ x, y, acesa, s = 1 }: { x: number; y: number; acesa: boolean; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {acesa && <circle r={170} fill="#fff3b0" opacity={0.22} />}
    {acesa && <circle r={80} fill="#fff8d6" opacity={0.6} />}
    {acesa && Array.from({ length: 8 }, (_, i) => <line key={i} x1={0} y1={0} x2={Math.cos(i * 0.785) * 210} y2={Math.sin(i * 0.785) * 210} stroke="#fff3b0" strokeWidth={7} opacity={0.5} />)}
    <rect x={-26} y={-8} width={52} height={86} rx={10} fill="#39424f" stroke="#141820" strokeWidth={6} />
    <circle r={36} fill={acesa ? "#fffdf0" : "#56606e"} stroke="#141820" strokeWidth={7} />
  </g>
);

// ---------- close na travessia ----------
export const CeuCabo = ({ t, sombra = 0, x = 540, y = 1500, s = 0.8 }: { t: number; sombra?: number; x?: number; y?: number; s?: number }) => {
  const yCabo = y - 930 * s;
  return (
    <g>
      <defs>
        <linearGradient id="cc-ceu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#070b1a" /><stop offset="0.55" stopColor="#18223a" /><stop offset="1" stopColor="#5d6c86" />
        </linearGradient>
      </defs>
      <rect x={-200} y={-200} width={1480} height={2320} fill="url(#cc-ceu)" />
      {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={acaso(i, 1) * 1080} cy={acaso(i, 2) * 800} r={2 + acaso(i, 3) * 2} fill="#fff" opacity={0.5} />)}
      {/* a criatura erguendo-se ao fundo */}
      <g transform={`translate(${760} ${2500 - sombra * 1250}) scale(2.3)`} opacity={0.9}>
        <Criatura t={t} olhos={sombra} cor="#262b33" />
      </g>
      {Array.from({ length: 7 }, (_, i) => (
        <ellipse key={i} cx={540 + Math.sin(t * 0.3 + i * 1.9) * 200} cy={1500 + i * 80} rx={760} ry={110} fill="#93a3bd" opacity={0.16 + i * 0.07} />
      ))}
      {/* cabo, roldana e cadeirinha */}
      <line x1={-200} y1={yCabo - 30} x2={1280} y2={yCabo + 30} stroke="#c9d3e0" strokeWidth={9} />
      <g transform={`translate(${x} ${yCabo})`}>
        <circle r={30} fill="#39424f" stroke="#141820" strokeWidth={7} />
        <circle r={9} fill="#c9d3e0" />
        <path d={`M0 28 L${-70 * s} ${310 * s} M0 28 L${70 * s} ${310 * s}`} stroke="#d9a441" strokeWidth={10} fill="none" />
      </g>
    </g>
  );
};

// ---------- rosto do guardião ----------
export const Guardiao = ({ t, esforco = 1 }: { t: number; esforco?: number }) => (
  <g>
    <rect x={-200} y={-200} width={1480} height={2320} fill="#0d1018" />
    <path d="M-200 -200 L1280 -200 L1280 520 L900 640 L620 560 L300 680 L-200 540Z" fill="#2a303b" />
    <path d="M300 680 L620 560 L900 640 L860 700 L600 630 L340 740Z" fill="#1d222b" />
    <g opacity={0.7 + 0.3 * Math.sin(t * 9)}>
      <path d="M180 -200 L260 120 L200 330 L330 520 M260 120 L400 200 M760 -200 L700 180 L800 380 L740 600 M700 180 L590 260" stroke="#ff5a2a" strokeWidth={16} fill="none" />
      <path d="M180 -200 L260 120 L200 330 L330 520 M760 -200 L700 180 L800 380 L740 600" stroke="#ffd166" strokeWidth={5} fill="none" />
    </g>
    <g transform={`translate(${540 + Math.sin(t * 37) * 4 * esforco} ${1180 + Math.sin(t * 29) * 4 * esforco}) scale(2.1)`}>
      <Criatura t={t} olhos={0.75} bracoE={[-250, -330]} bracoD={[250, -330]} />
    </g>
    <rect x={-200} y={1300} width={1480} height={820} fill="#ff3a1a" opacity={0.1 + 0.06 * Math.sin(t * 6)} />
    {Array.from({ length: 16 }, (_, i) => (
      <rect key={i} x={acaso(i, 1) * 1080} y={(acaso(i, 2) * 1920 + t * (300 + acaso(i, 3) * 300)) % 1920} width={8 + acaso(i, 4) * 12} height={8 + acaso(i, 5) * 12} fill="#6a6f78" opacity={0.7} />
    ))}
  </g>
);

// ---------- instalação subterrânea ----------
export const Subsolo = ({ t, calor = 1, resfria = 0, comporta = 0, carga = 0, antigo = false, estavel = false }: {
  t: number;
  /** Tubulações em brasa (1) ou frias (0). */
  calor?: number;
  /** Vapor do resfriamento, de 0 a 1. */
  resfria?: number;
  comporta?: number;
  /** Sobrecarga no painel, de 0 a 100. */
  carga?: number;
  /** Versão do passado: barris chegando, sem alarmes. */
  antigo?: boolean; estavel?: boolean;
}) => {
  const tubo = mix("#56707f", "#ff6a2a", calor);
  const pisca = Math.sin(t * 10) > 0;
  const alarme = !antigo && !estavel;
  return (
    <g>
      <rect x={-200} y={-200} width={1480} height={2320} fill="#1e232c" />
      {Array.from({ length: 7 }, (_, i) => <rect key={i} x={-200 + i * 220} y={560} width={12} height={1240} fill="#000" opacity={0.25} />)}
      <rect x={-200} y={540} width={1480} height={26} fill="#11151b" />
      {/* tubulações */}
      {[250, 340, 430].map((y, i) => (
        <g key={y}>
          <rect x={-200} y={y} width={1480} height={58} fill={tubo} />
          <rect x={-200} y={y} width={1480} height={16} fill="#fff" opacity={0.16} />
          {calor > 0.3 && <rect x={-200} y={y - 14} width={1480} height={86} fill="#ff8a3a" opacity={0.16 * calor * (0.6 + 0.4 * Math.sin(t * 6 + i))} />}
          {[80, 420, 760].map((x) => <rect key={x} x={x + i * 60} y={y - 8} width={30} height={74} fill="#2b323d" />)}
        </g>
      ))}
      <rect x={180} y={488} width={46} height={900} fill={tubo} /><rect x={860} y={488} width={46} height={260} fill={tubo} />
      {/* tanques de resíduos */}
      {[40, 190].map((x, i) => (
        <g key={x} transform={`translate(${x} 0)`}>
          <rect x={0} y={900} width={130} height={890} rx={30} fill="#2f3a36" stroke="#141820" strokeWidth={8} />
          <rect x={22} y={1000} width={86} height={520} rx={16} fill="#7dff6a" opacity={0.35 + 0.2 * Math.sin(t * 2 + i)} />
          {Array.from({ length: 5 }, (_, k) => <circle key={k} cx={40 + acaso(k, i) * 50} cy={1500 - ((t * 90 + k * 110) % 480)} r={7} fill="#d9ffd0" opacity={0.6} />)}
          <path d="M65 1580 L96 1640 L34 1640Z" fill="#e6c229" stroke="#141820" strokeWidth={5} />
        </g>
      ))}
      {antigo && [0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${420 + (i % 3) * 110 + (i > 2 ? 55 : 0)} ${i > 2 ? 1566 : 1690})`}>
          <rect x={-46} y={-110} width={92} height={120} rx={10} fill="#c9b23a" stroke="#141820" strokeWidth={6} />
          <path d="M0 -84 L24 -40 L-24 -40Z" fill="#141820" />
        </g>
      ))}
      {/* painel de emergência */}
      {!antigo && (
        <g transform="translate(540 900)">
          <rect x={-220} y={-250} width={440} height={400} rx={16} fill="#0c1016" stroke="#39424f" strokeWidth={10} />
          <text x={0} y={-176} textAnchor="middle" fontFamily={FONTE} fontSize={40} fill="#cfd6e0" letterSpacing={3}>PAINEL DE EMERGÊNCIA</text>
          {estavel ? (
            <>
              <text x={0} y={-60} textAnchor="middle" fontFamily={FONTE} fontSize={92} fill="#5cf29a">ESTÁVEL</text>
              <rect x={-180} y={10} width={360} height={46} rx={10} fill="#12301f" /><rect x={-180} y={10} width={70} height={46} rx={10} fill="#5cf29a" />
            </>
          ) : (
            <>
              <text x={0} y={-84} textAnchor="middle" fontFamily={FONTE} fontSize={62} fill="#ff5a4a" opacity={pisca ? 1 : 0.4}>SOBRECARGA</text>
              <text x={0} y={-4} textAnchor="middle" fontFamily={FONTE} fontSize={72} fill="#ffd166">{Math.round(carga)}%</text>
              <rect x={-180} y={26} width={360} height={46} rx={10} fill="#3a0a0a" /><rect x={-180} y={26} width={3.6 * carga} height={46} rx={10} fill="#ff5a4a" />
            </>
          )}
          <circle cx={-150} cy={108} r={20} fill={estavel ? "#5cf29a" : "#ff5a4a"} /><circle cx={-90} cy={108} r={20} fill="#ffd166" opacity={0.6} />
          <rect x={20} y={90} width={170} height={38} rx={8} fill="#39424f" />
        </g>
      )}
      {/* comporta e, atrás dela, o guardião */}
      <g>
        <rect x={800} y={760} width={300} height={1030} fill="#04060a" />
        <clipPath id="sub-comporta"><rect x={800} y={760} width={300} height={1030} /></clipPath>
        <g clipPath="url(#sub-comporta)">
          <g transform={`translate(${960 + comporta * 60} ${1200 - Math.max(0, comporta - 0.7) * 900}) scale(1.5)`} opacity={antigo ? 0 : 1}>
            <Criatura t={t} olhos={1} />
          </g>
          <g transform={`translate(0 ${-comporta * 1000})`}>
            <rect x={800} y={760} width={300} height={1030} fill="#39424f" />
            {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M800 ${800 + i * 120} L1100 ${740 + i * 120} L1100 ${800 + i * 120} L800 ${860 + i * 120}Z`} fill="#e6c229" opacity={0.75} />)}
          </g>
        </g>
        <rect x={784} y={740} width={332} height={34} fill="#11151b" /><rect x={784} y={760} width={22} height={1030} fill="#11151b" />
      </g>
      {/* alavanca das comportas */}
      <g transform="translate(730 1330)">
        <rect x={-30} y={0} width={60} height={130} rx={8} fill="#2b323d" stroke="#141820" strokeWidth={6} />
        <line x1={0} y1={60} x2={-70 + comporta * 140} y2={-50} stroke="#cfd6e0" strokeWidth={14} strokeLinecap="round" />
        <circle cx={-70 + comporta * 140} cy={-50} r={22} fill="#ff5a4a" />
      </g>
      <rect x={-200} y={1790} width={1480} height={330} fill="#12161d" />
      {/* giroflex e vapor */}
      {alarme && [150, 930].map((x) => (
        <g key={x} transform={`translate(${x} 600)`}>
          <rect x={-22} y={0} width={44} height={40} rx={6} fill="#ff3a2a" />
          <path d={`M0 20 L${Math.cos(t * 6) * 900} ${700} L${Math.cos(t * 6 + 0.5) * 900} 700Z`} fill="#ff3a2a" opacity={0.12} />
        </g>
      ))}
      {resfria > 0 && resfria < 1 && Array.from({ length: 18 }, (_, i) => {
        const v = (t * 0.9 + acaso(i, 1)) % 1;
        return <circle key={i} cx={acaso(i, 2) * 1080} cy={520 + v * 700} r={60 + v * 130} fill="#e8f3ff" opacity={(1 - v) * 0.4 * Math.sin(resfria * Math.PI)} />;
      })}
    </g>
  );
};

// ---------- o vale ao amanhecer ----------
export const Vale = ({ t, longe = 0, olha = 0, extra }: { t: number; longe?: number; olha?: number; extra?: ReactNode }) => {
  const s = 0.36 - longe * 0.14;
  return (
    <g>
      <defs>
        <linearGradient id="va-ceu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4f93d1" /><stop offset="0.5" stopColor="#f6c88c" /><stop offset="1" stopColor="#ffe9c2" />
        </linearGradient>
      </defs>
      <rect x={-200} y={-200} width={1480} height={2320} fill="url(#va-ceu)" />
      <circle cx={540} cy={640} r={420} fill="#ffe2a0" opacity={0.35} />
      <circle cx={540} cy={640} r={130} fill="#fff6d6" />
      {Array.from({ length: 5 }, (_, i) => {
        const x = (t * 26 + i * 260) % 1400 - 160, y = 300 + i * 60 + Math.sin(t * 2 + i) * 12;
        return <path key={i} d={`M${x - 22} ${y} Q${x - 10} ${y - 16 - Math.sin(t * 9 + i) * 8} ${x} ${y} Q${x + 10} ${y - 16 - Math.sin(t * 9 + i) * 8} ${x + 22} ${y}`} stroke="#3a3340" strokeWidth={5} fill="none" />;
      })}
      <path d="M-200 960 L60 720 L260 880 L460 760 L660 900 L860 730 L1280 960 L1280 1300 L-200 1300Z" fill="#9a8fb6" />
      <path d="M-200 1920 L-200 760 L60 700 L250 760 L330 1000 L300 1400 L380 1920Z" fill="#7a6f66" />
      <path d="M1280 1920 L1280 760 L1020 700 L830 760 L750 1000 L780 1400 L700 1920Z" fill="#7a6f66" />
      <path d="M-200 760 L60 700 L250 760 L210 800 L40 780 L-200 830Z M1280 760 L1020 700 L830 760 L870 800 L1040 780 L1280 830Z" fill="#8fb56a" />
      <path d="M250 1100 Q540 980 830 1100 L900 1920 L180 1920Z" fill="#6fa85a" />
      <path d="M300 1300 Q540 1200 800 1320 L860 1920 L220 1920Z" fill="#5c9a4f" />
      <path d="M560 1080 Q470 1240 580 1400 Q680 1560 520 1920" stroke="#a9dcf2" strokeWidth={46} fill="none" />
      <path d="M560 1080 Q470 1240 580 1400 Q680 1560 520 1920" stroke="#fff" strokeWidth={8} fill="none" opacity={0.5} strokeDasharray="40 90" strokeDashoffset={-t * 60} />
      {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={280 + acaso(i, 1) * 520} cy={1240 + acaso(i, 2) * 400} r={20 + acaso(i, 3) * 22} fill="#4a8744" />)}
      {/* o guardião indo embora */}
      <g transform={`translate(${540 + Math.sin(t * 2.2) * 5} ${1120 - longe * 50 + Math.abs(Math.sin(t * 2.2)) * 8}) scale(${s})`}>
        <Criatura t={t} costas={olha < 0.5} olhos={0.9} cor="#6f746c" bracoD={olha > 0.5 ? [470, -40] : undefined} />
      </g>
      {Array.from({ length: 3 }, (_, i) => <ellipse key={i} cx={540 + Math.sin(t * 0.3 + i) * 80} cy={1360 + i * 90} rx={420} ry={34} fill="#fff" opacity={0.16} />)}
      {/* mirante em primeiro plano */}
      <path d="M-200 1920 L-200 1760 Q200 1720 540 1770 Q880 1720 1280 1760 L1280 2120 L-200 2120Z" fill="#3d3833" />
      <path d="M-200 1760 Q200 1720 540 1770 Q880 1720 1280 1760 L1280 1790 Q880 1750 540 1800 Q200 1750 -200 1790Z" fill="#6f9a55" />
      {extra}
    </g>
  );
};
