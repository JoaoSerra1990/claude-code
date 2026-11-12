import { Ator } from "../serie/Ator";
import { cidadao } from "../curtas/futurista";
import { mix } from "../abismo/cenarios";

// Cenários do curta "Quando a Névoa Chegou": rua com as estátuas, o céu aberto,
// o limite da névoa, a estação atmosférica e a escola.

const FONTE = "Anton, Impact, sans-serif";
const acaso = (i: number, k: number) => {
  const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const TODO = { x: -200, y: -200, width: 1480, height: 2320 };

/** Camadas de névoa; `n` de 0 a 1, entrando pela direita quando `frente` < 1. */
export const Nevoa = ({ t, n, frente = 1, y0 = 700, cor = "#dfe6ea" }: { t: number; n: number; frente?: number; y0?: number; cor?: string }) => (
  <g opacity={n}>
    {Array.from({ length: 10 }, (_, i) => (
      <ellipse key={i} cx={540 + Math.sin(t * 0.3 + i * 1.9) * 220 + (1 - frente) * 1400} cy={y0 + i * 130} rx={640 + acaso(i, 1) * 200} ry={120 + acaso(i, 2) * 50} fill={cor} opacity={0.2 + (i % 3) * 0.08} />
    ))}
  </g>
);

/** Pessoa da rua: anda, congela como estátua e, depois, desperta. */
export const Morador = ({ t, i, estatua, pulso = false, s = 0.5 }: { t: number; i: number; estatua: number; pulso?: boolean; s?: number }) => {
  const parada = estatua > 0.5;
  return (
    <g>
      <g transform={`scale(${s})`} style={{ filter: `grayscale(${estatua}) brightness(${1 + estatua * 0.25})` }}>
        <ellipse cx={0} cy={0} rx={120} ry={22} fill="#000" opacity={0.3} />
        <Ator v={cidadao(i + 3)} t={parada ? 3.1 + i : t} expr={parada ? "neutro" : "sereno"} andando pose={i % 3 === 0 ? "apontarDir" : "parado"} olhar={[0.6, 0]} fase={i * 1.3} />
      </g>
      {pulso && parada && (
        <g transform={`translate(${-10 * s} ${-430 * s}) scale(${0.8 + 0.25 * Math.max(0, Math.sin(t * 2.4 + i))})`}>
          <path d="M0 14 C-34 -14 -16 -38 0 -18 C16 -38 34 -14 0 14Z" fill="#ff8a8a" opacity={0.9} /><circle r={46} fill="#ff8a8a" opacity={0.2} />
        </g>
      )}
    </g>
  );
};

const Carro = ({ cor }: { cor: string }) => (
  <g>
    <path d="M-150 -40 L-110 -110 L70 -110 L124 -40 L164 -34 L164 14 L-164 14 L-164 -32Z" fill={cor} stroke="#14161c" strokeWidth={6} />
    <path d="M-90 -46 L-66 -94 L-8 -94 L-8 -46Z M8 -46 L8 -94 L58 -94 L96 -46Z" fill="#9fb2bf" />
    <circle cx={-90} cy={16} r={30} fill="#14161c" /><circle cx={96} cy={16} r={30} fill="#14161c" />
  </g>
);

// ---------- a rua ----------
export const PESSOAS: [number, number][] = [[900, 1560], [640, 1640], [380, 1580], [160, 1680], [760, 1760]];
export const Rua = ({ t, nevoa = 1, frente = 1, claro = 0, congela = 1, desperta = 0, pulsos = false, persianas = 1, rola = 0 }: {
  t: number; nevoa?: number;
  /** Avanço da névoa pela rua, da direita para a esquerda, de 0 a 1. */
  frente?: number;
  /** Do amanhecer cinzento (0) ao céu limpo (1). */
  claro?: number;
  /** Quantas pessoas a névoa já paralisou, de 0 a 1. */
  congela?: number;
  /** Pessoas voltando a se mover, de 0 a 1. */
  desperta?: number; pulsos?: boolean;
  /** Janelas se fechando, de 0 a 1. */
  persianas?: number; rola?: number;
}) => (
  <g>
    <defs><linearGradient id="nv-ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={mix("#6f7a86", "#5fa8e0", claro)} /><stop offset="1" stopColor={mix("#c9c2b8", "#ffe9c2", claro)} /></linearGradient></defs>
    <rect {...TODO} fill="url(#nv-ceu)" />
    <circle cx={260} cy={520} r={90} fill="#fff6d6" opacity={0.4 + claro * 0.6} /><circle cx={260} cy={520} r={280} fill="#ffe2a0" opacity={0.15 + claro * 0.2} />
    <g transform={`translate(${-(rola % 400)} 0)`}>
      {Array.from({ length: 8 }, (_, i) => {
        const x = -220 + i * 200, h = 620 + acaso(i % 4, 1) * 340;
        return (
          <g key={i}>
            <rect x={x} y={1420 - h} width={190} height={h} fill={mix(i % 2 ? "#7d8791" : "#8a8f98", i % 2 ? "#c9a68a" : "#b8c7d9", claro)} />
            {Array.from({ length: 12 }, (_, k) => {
              const fechada = persianas > acaso(k, i % 4) * 0.9;
              return <rect key={k} x={x + 22 + (k % 3) * 54} y={1420 - h + 50 + Math.floor(k / 3) * 130} width={36} height={70} fill={fechada ? mix("#4a525c", "#8a6f5a", claro) : "#ffe9a8"} />;
            })}
            <rect x={x + 60} y={1300} width={70} height={120} fill={mix("#3a4048", "#6b4a3a", claro)} />
          </g>
        );
      })}
    </g>
    <rect x={-200} y={1420} width={1480} height={60} fill={mix("#9aa0a6", "#d9d2c4", claro)} />
    <rect x={-200} y={1480} width={1480} height={640} fill={mix("#565c64", "#6f747a", claro)} />
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={-150 + i * 170 - (rola % 170)} y={1700} width={90} height={12} fill="#e8e4dc" opacity={0.7} />)}
    <g transform={`translate(${210 - rola} 1520)`}><Carro cor={mix("#7a858f", "#3d6fa3", claro)} /></g>
    <g transform={`translate(${860 - rola} 1840) scale(1.2)`}><Carro cor={mix("#8a8580", "#e0572a", claro)} /></g>
    {PESSOAS.map(([x, y], i) => {
      const limiar = 1 - x / 1080;
      const est = desperta > 0 ? Math.max(0, 1 - (desperta * 1.6 - i * 0.12)) : congela > limiar ? Math.min(1, (congela - limiar) * 6) : 0;
      const anda = desperta > 0 ? (1 - est) * 60 * (i % 2 ? 1 : -1) * Math.min(1, desperta) : (1 - est) * Math.sin(t * 0.8 + i) * 30;
      return <g key={i} transform={`translate(${x - rola + anda} ${y})`}><Morador t={t} i={i} estatua={est} pulso={pulsos} s={0.46 + (y - 1560) / 1200} /></g>;
    })}
    <Nevoa t={t} n={nevoa} frente={frente} />
  </g>
);

// ---------- o céu aberto ----------
export const Ceu = ({ t, abre = 1 }: { t: number; abre?: number }) => (
  <g>
    <rect {...TODO} fill="#a8b0b8" />
    <ellipse cx={540} cy={760} rx={420 * abre + 10} ry={520 * abre + 10} fill="#070a1c" />
    <clipPath id="nv-furo"><ellipse cx={540} cy={760} rx={420 * abre + 10} ry={520 * abre + 10} /></clipPath>
    <g clipPath="url(#nv-furo)">
      {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={acaso(i, 1) * 1080} cy={acaso(i, 2) * 1400} r={2 + acaso(i, 3) * 2} fill="#fff" opacity={0.6} />)}
      {Array.from({ length: 26 }, (_, i) => {
        const v = (t * (0.35 + acaso(i, 4) * 0.3) + acaso(i, 5)) % 1, x = 160 + acaso(i, 6) * 760 + v * 120;
        return (
          <g key={i} transform={`translate(${x} ${200 + v * 1200})`}>
            <line x1={0} y1={0} x2={-30} y2={-150} stroke="#ffb347" strokeWidth={8} opacity={0.6} strokeLinecap="round" />
            <circle r={12 + acaso(i, 7) * 8} fill="#fff3b0" /><circle r={34} fill="#ffb347" opacity={0.35} />
          </g>
        );
      })}
    </g>
    {Array.from({ length: 16 }, (_, i) => {
      const a = (i / 16) * Math.PI * 2;
      return <ellipse key={i} cx={540 + Math.cos(a) * (440 * abre + 150) + Math.sin(t * 0.5 + i) * 20} cy={760 + Math.sin(a) * (540 * abre + 150)} rx={260} ry={200} fill={i % 2 ? "#c2cad2" : "#b3bcc5"} />;
    })}
    {[[-80, 1500, 300, 600, -10], [820, 1560, 340, 560, 12]].map(([x, y, w, h, a], i) => (
      <g key={i} transform={`rotate(${a} ${x + w / 2} 1920)`}><rect x={x} y={y} width={w} height={h} fill="#565c64" />{Array.from({ length: 8 }, (_, k) => <rect key={k} x={x + 30 + (k % 3) * 90} y={y + 40 + Math.floor(k / 3) * 110} width={50} height={64} fill="#3a4048" />)}</g>
    ))}
  </g>
);

// ---------- o limite da névoa ----------
export const Limite = ({ t, queima = 1 }: { t: number; queima?: number }) => (
  <g>
    <defs><linearGradient id="nv-lim" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#aab2ba" /><stop offset="0.5" stopColor="#8a8fa0" /><stop offset="1" stopColor="#3a2a3a" /></linearGradient></defs>
    <rect {...TODO} fill="url(#nv-lim)" />
    <path d="M-200 1500 Q300 1380 700 1460 Q1000 1400 1280 1470 L1280 2120 L-200 2120Z" fill="#5c6b55" />
    <path d="M560 1440 Q900 1400 1280 1470 L1280 2120 L560 2120Z" fill="#3a2f2a" opacity={0.75 * queima} />
    {/* árvores: verdes sob a névoa, em brasa fora dela */}
    {[100, 300, 480, 700, 880, 1040].map((x, i) => {
      const fora = x > 560, q = fora ? queima : 0;
      return (
        <g key={x} transform={`translate(${x} ${1470 - (i % 2) * 30})`}>
          <rect x={-18} y={-260} width={36} height={260} fill={mix("#6b4a3a", "#1c1412", q)} />
          <circle cy={-330} r={120} fill={mix("#5c9a4f", "#2a1a14", q)} /><circle cx={-70} cy={-260} r={80} fill={mix("#4f8a45", "#241612", q)} /><circle cx={76} cy={-270} r={84} fill={mix("#68a85a", "#2f1c16", q)} />
          {q > 0.2 && [0, 1, 2].map((k) => <path key={k} d="M-40 0 Q-52 -90 0 -170 Q52 -90 40 0Z" transform={`translate(${(k - 1) * 80} ${-330 - k * 20}) scale(${(0.7 + 0.4 * Math.sin(t * 10 + k * 2 + i)) * q})`} fill={["#ff7a2a", "#ffd166", "#ff9a3a"][k]} opacity={0.9} />)}
          {q > 0.2 && <circle cy={-330} r={260} fill="#ff7a2a" opacity={0.12 * q} />}
        </g>
      );
    })}
    {/* partículas: apagam na névoa, queimam fora dela */}
    {Array.from({ length: 30 }, (_, i) => {
      const v = (t * (0.4 + acaso(i, 4) * 0.3) + acaso(i, 5)) % 1, x = 40 + acaso(i, 6) * 1000, y = -100 + v * 1500;
      const naNevoa = x < 560 && y > 520;
      return naNevoa ? <circle key={i} cx={x} cy={520 + (y - 520) * 0.2} r={14 * (1 - (y - 520) / 900)} fill="#fff" opacity={0.5 * (1 - (y - 520) / 900)} /> : (
        <g key={i} transform={`translate(${x} ${y})`}><line x1={0} y1={0} x2={-20} y2={-120} stroke="#ffb347" strokeWidth={7} opacity={0.6} /><circle r={11} fill="#fff3b0" /><circle r={30} fill="#ffb347" opacity={0.3} /></g>
      );
    })}
    {/* a névoa cobre o lado esquerdo */}
    {Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx={160 + Math.sin(t * 0.3 + i) * 60 + (i % 3) * 110} cy={520 + i * 130} rx={420} ry={130} fill="#e3e9ed" opacity={0.3} />)}
    <line x1={560} y1={-200} x2={560} y2={2120} stroke="#fff" strokeWidth={5} strokeDasharray="30 26" opacity={0.5} />
  </g>
);

// ---------- estação atmosférica, gerador e o ônibus elétrico ----------
export const EstacaoAtm = ({ t, energia = 0.08, cabo = 0, forca = 0.3 }: {
  t: number;
  /** Carga do sistema, de 0 a 1. */
  energia?: number;
  /** Cabo ligado do ônibus ao gerador, de 0 a 1. */
  cabo?: number;
  /** Quanto de névoa a estação está liberando, de 0 a 1. */
  forca?: number;
}) => {
  const ok = energia > 0.5;
  return (
    <g>
      <rect {...TODO} fill="#8f98a2" />
      <rect x={-200} y={1500} width={1480} height={620} fill="#5a6068" />
      {/* estação */}
      <path d="M40 1500 L40 900 Q260 640 480 900 L480 1500Z" fill="#cfd6dc" stroke="#56636e" strokeWidth={10} />
      {[150, 260, 370].map((x, i) => (
        <g key={x}>
          <rect x={x - 22} y={640 - i * 30} width={44} height={260} fill="#8e99a3" stroke="#56636e" strokeWidth={6} />
          {Array.from({ length: 5 }, (_, k) => {
            const v = (t * (0.5 + forca) + k / 5 + i * 0.2) % 1;
            return <circle key={k} cx={x + Math.sin(v * 5 + i) * 60} cy={640 - i * 30 - v * 620} r={(40 + v * 150) * (0.4 + forca * 0.8)} fill="#f4f7f8" opacity={(1 - v) * (0.25 + forca * 0.6)} />;
          })}
        </g>
      ))}
      <rect x={120} y={1010} width={280} height={150} rx={10} fill="#14181e" stroke={ok ? "#5cf29a" : "#ff5a4a"} strokeWidth={8} />
      <text x={260} y={1064} textAnchor="middle" fontFamily={FONTE} fontSize={40} fill="#cfd6e0">ENERGIA</text>
      <rect x={144} y={1084} width={232} height={50} rx={8} fill="#2a1512" />
      <rect x={144} y={1084} width={232 * energia} height={50} rx={8} fill={ok ? "#5cf29a" : "#ff5a4a"} opacity={ok || Math.sin(t * 9) > -0.2 ? 1 : 0.35} />
      <text x={260} y={1124} textAnchor="middle" fontFamily={FONTE} fontSize={40} fill="#fff">{`${Math.round(energia * 100)}%`}</text>
      {/* gerador auxiliar */}
      <g transform="translate(600 1500)">
        <rect x={-100} y={-260} width={200} height={260} rx={12} fill="#e6c229" stroke="#14181e" strokeWidth={8} />
        <path d="M-10 -210 L-50 -120 L-8 -120 L-30 -40 L46 -150 L4 -150 L26 -210Z" fill="#14181e" />
        <circle cx={70} cy={-40} r={14} fill={ok ? "#5cf29a" : "#ff5a4a"} />
      </g>
      {/* ônibus elétrico abandonado */}
      <g transform="translate(940 1560)">
        <rect x={-230} y={-330} width={460} height={300} rx={36} fill="#3f9a8a" stroke="#14181e" strokeWidth={8} />
        <rect x={-200} y={-290} width={400} height={120} rx={14} fill="#bfe3f5" /><line x1={-70} y1={-290} x2={-70} y2={-170} stroke="#14181e" strokeWidth={6} /><line x1={70} y1={-290} x2={70} y2={-170} stroke="#14181e" strokeWidth={6} />
        <rect x={-200} y={-140} width={170} height={60} rx={8} fill="#14181e" /><path d="M-170 -124 l14 26 l-12 0 l10 22" stroke="#5cf29a" strokeWidth={6} fill="none" /><text x={-130} y={-96} fontFamily={FONTE} fontSize={34} fill="#5cf29a">ELÉTRICO</text>
        <circle cx={-140} cy={-24} r={44} fill="#14181e" /><circle cx={140} cy={-24} r={44} fill="#14181e" />
      </g>
      {cabo > 0 && (
        <g>
          <path d={`M720 1470 Q${700 - 20} 1640 ${720 - cabo * 30} ${1470 + 0}`} fill="none" />
          <path d="M740 1420 Q700 1700 640 1440" stroke="#14181e" strokeWidth={16} fill="none" strokeDasharray={640} strokeDashoffset={640 * (1 - cabo)} />
          <path d="M740 1420 Q700 1700 640 1440" stroke="#e0352a" strokeWidth={6} fill="none" strokeDasharray={640} strokeDashoffset={640 * (1 - cabo)} />
          {cabo >= 1 && Array.from({ length: 6 }, (_, i) => <line key={i} x1={640} y1={1440} x2={640 + Math.cos(i + t * 20) * 70} y2={1440 + Math.sin(i * 2 + t * 20) * 70} stroke="#fff3b0" strokeWidth={6} opacity={Math.sin(t * 30 + i) > 0 ? 1 : 0} />)}
        </g>
      )}
      <Nevoa t={t} n={0.25 + forca * 0.6} y0={900} />
    </g>
  );
};

// ---------- a escola ----------
export const Escola = ({ t, claro = 1 }: { t: number; claro?: number }) => (
  <g>
    <defs><linearGradient id="nv-esc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5fa8e0" /><stop offset="1" stopColor="#ffe9c2" /></linearGradient></defs>
    <rect {...TODO} fill="url(#nv-esc)" />
    <circle cx={840} cy={360} r={100} fill="#fff6d6" /><circle cx={840} cy={360} r={300} fill="#ffe2a0" opacity={0.3} />
    {[0, 1].map((i) => <ellipse key={i} cx={(t * 12 + i * 600) % 1500 - 200} cy={300 + i * 200} rx={170} ry={40} fill="#fff" opacity={0.8} />)}
    <rect x={60} y={760} width={960} height={740} fill="#f0c9a0" />
    <path d="M20 760 L540 520 L1060 760Z" fill="#c2603a" />
    <rect x={300} y={830} width={480} height={110} rx={10} fill="#3d6fa3" /><text x={540} y={912} textAnchor="middle" fontFamily={FONTE} fontSize={84} fill="#fff" letterSpacing={8}>ESCOLA</text>
    {[130, 830].map((x) => [0, 1].map((r) => <rect key={`${x}${r}`} x={x} y={1000 + r * 220} width={130} height={150} fill="#bfe3f5" stroke="#fffaf0" strokeWidth={10} />))}
    <rect x={420} y={1080} width={240} height={420} rx={10} fill="#3a2a22" /><rect x={436} y={1096} width={100} height={404} fill="#8a5a3a" /><rect x={544} y={1096} width={100} height={404} fill="#8a5a3a" opacity={0.35} />
    <rect x={-200} y={1500} width={1480} height={620} fill="#c9c2b0" />
    <path d="M380 1500 L700 1500 L860 2120 L220 2120Z" fill="#b5ac98" />
    {[120, 960].map((x) => <g key={x} transform={`translate(${x} 1520)`}><rect x={-12} y={-200} width={24} height={200} fill="#8a5a3a" /><circle cy={-260} r={100} fill="#5c9a4f" /></g>)}
    {[[200, 1640, 2], [900, 1700, 5], [820, 1580, 8]].map(([x, y, i]) => <g key={i} transform={`translate(${x + Math.sin(t * 1.2 + i) * 20 * claro} ${y}) scale(0.34)`}><Ator v={{ ...cidadao(i), estilo: i % 2 ? "rabo" : "baguncado", mochila: "#e0572a" }} t={t} expr="feliz" andando fase={i} /></g>)}
  </g>
);
