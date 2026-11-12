import { Ator, type Visual } from "../serie/Ator";
import { Pessoa, cidadao } from "../curtas/futurista";
import { mix } from "../abismo/cenarios";

// Cenários do curta "O Labirinto dos Esquecidos".

const FONTE = "Anton, Impact, sans-serif";
const acaso = (i: number, k: number) => {
  const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const TODO = { x: -200, y: -200, width: 1480, height: 2320 };

// ---------- criatura mecânica ----------
export const Robo = ({ t, off = false, fase = 0 }: { t: number; off?: boolean; fase?: number }) => {
  const anda = off ? 0 : Math.sin(t * 14 + fase);
  const baixa = off ? 70 : Math.abs(anda) * 8;
  return (
    <g>
      {([-1, 1] as const).flatMap((l) => [0, 1].map((k) => {
        const a = (k ? -anda : anda) * 24 * l;
        return <path key={`${l}${k}`} d={`M${l * 70} ${-150 + baixa} L${l * (190 + k * 40) + a} ${-250 + baixa + k * 30} L${l * (230 + k * 50) + a} 0`} stroke="#20262e" strokeWidth={22} fill="none" strokeLinejoin="round" strokeLinecap="round" />;
      }))}
      <g transform={`translate(0 ${baixa})`}>
        <path d="M-120 -120 Q-120 -290 0 -300 Q120 -290 120 -120 Q0 -70 -120 -120Z" fill="#39424f" stroke="#14181e" strokeWidth={9} />
        <path d="M-120 -120 Q0 -70 120 -120 L96 -84 Q0 -44 -96 -84Z" fill="#20262e" />
        <circle cx={0} cy={-196} r={52} fill="#0c0f14" />
        <circle cx={0} cy={-196} r={34} fill={off ? "#3a4048" : "#ff3a2a"} />
        {!off && <circle cx={0} cy={-196} r={90} fill="#ff3a2a" opacity={0.2 + 0.1 * Math.sin(t * 9 + fase)} />}
        {!off && <circle cx={Math.sin(t * 3 + fase) * 12} cy={-196} r={12} fill="#fff" />}
        <line x1={60} y1={-280} x2={96} y2={-370} stroke="#20262e" strokeWidth={8} />
        <circle cx={96} cy={-372} r={10} fill={off ? "#3a4048" : "#ff3a2a"} />
      </g>
    </g>
  );
};

// ---------- corredor de paredes gigantes ----------
export type Ceu = "tarde" | "manha" | "noite";
const CEUS: Record<Ceu, [string, string]> = { tarde: ["#3d2a4f", "#e8894a"], manha: ["#7fb3d9", "#f3e3c0"], noite: ["#070b18", "#1c2540"] };

export const Corredor = ({ t, fecha = 0, ceu = "tarde", vermelhas = 0, robos = 0, robosOff = false, saida = 0 }: {
  t: number;
  /** Paredes deslizando e fechando o corredor, de 0 a 1. */
  fecha?: number; ceu?: Ceu;
  /** Luzes vermelhas ao fundo, de 0 a 1. */
  vermelhas?: number;
  /** Criaturas mecânicas avançando do fundo, de 0 a 1. */
  robos?: number; robosOff?: boolean;
  /** Fundo do corredor aberto para a luz do dia, de 0 a 1. */
  saida?: number;
}) => {
  const xL = 370 + fecha * 150, xR = 710 - fecha * 150, nL = -160 + fecha * 420, nR = 1240 - fecha * 420;
  const [c1, c2] = CEUS[ceu];
  const parede = (lado: -1 | 1) => {
    const n = lado === -1 ? nL : nR, x = lado === -1 ? xL : xR, borda = lado === -1 ? -200 : 1280;
    const em = (f: number, yN: number, yX: number): [number, number] => [n + (x - n) * f, yN + (yX - yN) * f];
    return (
      <g>
        <path d={`M${borda} -200 L${n} -200 L${x} 600 L${x} 1250 L${n} 2100 L${borda} 2100Z`} fill="#3a444d" />
        <path d={`M${n} -200 L${x} 600 L${x} 1250 L${n} 2100 L${n + lado * 60} 2100 L${n + lado * 60} -200Z`} fill="#000" opacity={0.25} />
        {[0.15, 0.35, 0.55, 0.75].map((f) => {
          const [ax, ay] = em(f, -200, 600), [, by] = em(f, 2100, 1250);
          return <line key={f} x1={ax} y1={ay} x2={ax} y2={by} stroke="#1f262c" strokeWidth={10 * (1 - f) + 3} />;
        })}
        {[0.25, 0.45, 0.65].map((f, i) => {
          const [ax, ay] = em(f, 500, 850);
          return <rect key={f} x={ax - 14 * (1 - f)} y={ay} width={28 * (1 - f)} height={220 * (1 - f)} fill={vermelhas > 0 ? "#ff3a2a" : "#7ef0ff"} opacity={(0.5 + 0.3 * Math.sin(t * 3 + i)) * (vermelhas > 0 ? vermelhas : 0.6)} />;
        })}
      </g>
    );
  };
  return (
    <g>
      <defs>
        <linearGradient id="lb-ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c1} /><stop offset="0.45" stopColor={c2} /></linearGradient>
      </defs>
      <rect {...TODO} fill="url(#lb-ceu)" />
      {/* fundo do corredor */}
      <rect x={xL - 4} y={596} width={xR - xL + 8} height={660} fill={mix("#161b21", "#fff3c9", saida)} />
      {saida > 0 && <circle cx={540} cy={920} r={420} fill="#fff3c9" opacity={0.5 * saida} />}
      {vermelhas > 0 && [0, 1, 2].map((i) => (
        <g key={i} opacity={vermelhas * (0.6 + 0.4 * Math.sin(t * 5 + i * 2))}>
          <circle cx={470 + i * 70} cy={980 - i * 40} r={60} fill="#ff2a1a" opacity={0.3} />
          <circle cx={470 + i * 70} cy={980 - i * 40} r={16} fill="#ff5a4a" />
        </g>
      ))}
      {/* piso */}
      <path d={`M${nL} 2100 L${xL} 1250 L${xR} 1250 L${nR} 2100Z`} fill="#2a3138" />
      {[0.2, 0.4, 0.6, 0.8].map((f) => <line key={f} x1={nL + (xL - nL) * f} y1={2100 - 850 * f} x2={nR + (xR - nR) * f} y2={2100 - 850 * f} stroke="#1c2227" strokeWidth={8 * (1 - f) + 2} />)}
      <line x1={540} y1={1250} x2={540} y2={2100} stroke="#1c2227" strokeWidth={5} />
      {robos > 0 && [0, 1, 2].map((i) => {
        const p = Math.min(1, Math.max(0, robos * 1.3 - i * 0.15));
        const x = 540 + (i - 1) * 250 * p, y = 1260 + p * 420 + i * 30, s = 0.12 + p * 0.5;
        return <g key={i} transform={`translate(${x} ${y}) scale(${s})`}><Robo t={t} off={robosOff} fase={i * 2} /></g>;
      })}
      {parede(-1)}
      {parede(1)}
      {saida > 0 && <rect {...TODO} fill="#fff3c9" opacity={0.18 * saida} />}
    </g>
  );
};

// ---------- labirinto visto de cima ----------
export const Aereo = ({ t, dia = 0, alerta = 0, portas = false, zoom = 1 }: {
  t: number;
  /** Desenho das paredes; valores fracionários giram as paredes entre um dia e outro. */
  dia?: number; alerta?: number; portas?: boolean; zoom?: number;
}) => {
  const k = Math.floor(dia), f = dia - k;
  const q = f * f * (3 - 2 * f);
  const celulas = [];
  for (let j = 0; j < 22; j++) for (let i = 0; i < 12; i++) {
    const cx = 45 + i * 90, cy = 15 + j * 90;
    if (Math.hypot(cx - 540, cy - 960) < 170) continue;
    const n = i * 31 + j * 7;
    const a0 = acaso(n, k) > 0.5 ? 90 : 0, a1 = acaso(n, k + 1) > 0.5 ? 90 : 0;
    celulas.push(<rect key={n} x={-58} y={-13} width={116} height={26} fill={mix("#56636e", "#8a5a52", alerta)} transform={`translate(${cx} ${cy}) rotate(${a0 + (a1 - a0) * q})`} />);
  }
  return (
    <g>
      <rect {...TODO} fill="#161b21" />
      <g transform={`translate(540 960) scale(${zoom}) translate(-540 -960)`}>
        <rect x={0} y={0} width={1080} height={1920} fill="#222a31" />
        {celulas}
        <rect x={0} y={0} width={1080} height={1920} fill="none" stroke="#56636e" strokeWidth={30} />
        <circle cx={540} cy={960} r={150} fill="#2c363e" stroke="#7ef0ff" strokeWidth={5} opacity={0.9} />
        {[[140, 300], [900, 520], [200, 1480], [880, 1660]].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={50} fill={portas ? "#5cf29a" : "#7ef0ff"} opacity={0.2 + 0.1 * Math.sin(t * 4 + i)} />
            <rect x={x - 20} y={y - 20} width={40} height={40} fill={portas ? "#5cf29a" : "#7ef0ff"} />
          </g>
        ))}
        {alerta > 0 && [[320, 700], [760, 1200], [520, 380], [600, 1560]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={26 + 10 * Math.sin(t * 6 + i)} fill="#ff3a2a" opacity={alerta * 0.8} />
        ))}
      </g>
      {zoom < 1 && (
        <g opacity={1 - zoom}>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const x = [70, 890, 70, 890, 70, 890][i], y = [80, 80, 860, 860, 1640, 1640][i];
            return <g key={i}><rect x={x} y={y} width={120} height={200} fill="#222a31" stroke="#56636e" strokeWidth={6} /><text x={x + 60} y={y + 120} textAnchor="middle" fontFamily={FONTE} fontSize={44} fill="#7ef0ff">{`T${i + 1}`}</text></g>;
          })}
        </g>
      )}
    </g>
  );
};

// ---------- abrigo dos sobreviventes ----------
export const Abrigo = ({ t, dias = 43 }: { t: number; dias?: number }) => (
  <g>
    <rect {...TODO} fill="#2b343b" />
    {Array.from({ length: 6 }, (_, i) => <line key={i} x1={-200 + i * 280} y1={-200} x2={-200 + i * 280} y2={1790} stroke="#1c2227" strokeWidth={12} />)}
    {Array.from({ length: 5 }, (_, i) => <line key={i} x1={-200} y1={i * 420} x2={1280} y2={i * 420} stroke="#1c2227" strokeWidth={8} />)}
    <path d="M-200 300 L1280 180 L1280 420 L-200 560Z" fill="#6b4a3a" />
    <path d="M-200 560 L1280 420 L1280 450 L-200 600Z" fill="#000" opacity={0.3} />
    {Array.from({ length: dias }, (_, i) => {
      const g = Math.floor(i / 5), k = i % 5, x = 120 + (g % 5) * 90, y = 720 + Math.floor(g / 5) * 110;
      return k < 4
        ? <line key={i} x1={x + k * 14} y1={y} x2={x + k * 14} y2={y + 70} stroke="#e8e4dc" strokeWidth={7} opacity={0.8} />
        : <line key={i} x1={x - 10} y1={y + 58} x2={x + 54} y2={y + 12} stroke="#e8e4dc" strokeWidth={7} opacity={0.8} />;
    })}
    <rect x={820} y={1500} width={200} height={290} fill="#4a3a2e" stroke="#1c140e" strokeWidth={8} /><rect x={900} y={1330} width={160} height={170} fill="#5a4636" stroke="#1c140e" strokeWidth={8} />
    <rect {...TODO} y={1790} fill="#1a2025" />
    {/* fogueira num tambor */}
    <g transform="translate(560 1790)">
      <circle cy={-260} r={420} fill="#ff9a3a" opacity={0.1 + 0.04 * Math.sin(t * 9)} />
      <rect x={-80} y={-170} width={160} height={170} rx={10} fill="#3a2f2a" stroke="#14100c" strokeWidth={8} />
      {[0, 1, 2].map((i) => <path key={i} d="M-40 0 Q-50 -90 0 -170 Q50 -90 40 0Z" transform={`translate(${(i - 1) * 46} -160) scale(${0.8 + 0.3 * Math.sin(t * 11 + i * 2)})`} fill={["#ff7a2a", "#ffd166", "#ff9a3a"][i]} />)}
    </g>
  </g>
);

// ---------- porta com código ----------
export const Porta = ({ t, abre = 0, codigo = "", sol = false }: { t: number; abre?: number; codigo?: string; sol?: boolean }) => (
  <g>
    <rect {...TODO} fill="#39434b" />
    {Array.from({ length: 6 }, (_, i) => <line key={i} x1={-200} y1={i * 380} x2={1280} y2={i * 380} stroke="#262d33" strokeWidth={10} />)}
    <rect x={250} y={420} width={580} height={1370} fill={sol ? "#fff3c9" : "#0a0d12"} />
    {sol && abre > 0 && <path d={`M${540 - abre * 290} 420 L${540 + abre * 290} 420 L${540 + abre * 700} 2100 L${540 - abre * 700} 2100Z`} fill="#fff3c9" opacity={0.35} />}
    {!sol && abre > 0.2 && [0, 1].map((i) => <circle key={i} cx={470 + i * 140} cy={1100} r={18} fill="#ff3a2a" opacity={0.6 + 0.4 * Math.sin(t * 8 + i)} />)}
    {([-1, 1] as const).map((l) => (
      <g key={l} transform={`translate(${l * abre * 290} 0)`}>
        <rect x={l === -1 ? 250 : 540} y={420} width={290} height={1370} fill="#56636e" stroke="#1c2227" strokeWidth={10} />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${l === -1 ? 250 : 540} ${520 + i * 330} L${l === -1 ? 540 : 830} ${460 + i * 330} L${l === -1 ? 540 : 830} ${520 + i * 330} L${l === -1 ? 250 : 540} ${580 + i * 330}Z`} fill="#e6c229" opacity={0.6} />)}
      </g>
    ))}
    <rect x={226} y={380} width={628} height={48} fill="#1c2227" />
    <g transform="translate(940 1180)">
      <rect x={-110} y={-190} width={220} height={380} rx={14} fill="#11151a" stroke="#7ef0ff" strokeWidth={6} />
      <rect x={-90} y={-170} width={180} height={90} fill={abre > 0 ? "#12301f" : "#0a2030"} />
      <text x={0} y={-104} textAnchor="middle" fontFamily={FONTE} fontSize={62} fill={abre > 0 ? "#5cf29a" : "#7ef0ff"} letterSpacing={6}>{codigo}</text>
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={-84 + (i % 3) * 60} y={-56 + Math.floor(i / 3) * 74} width={48} height={58} rx={8} fill="#39434b" />)}
    </g>
    <rect {...TODO} y={1790} fill="#1a2025" />
  </g>
);

// ---------- passagem estreita ----------
export const Passagem = ({ t }: { t: number }) => (
  <g>
    <rect {...TODO} fill="#0c1116" />
    <rect x={380} y={-200} width={320} height={2000} fill="#141c22" />
    <circle cx={540} cy={700} r={260} fill="#7ef0ff" opacity={0.06 + 0.03 * Math.sin(t * 2)} />
    <rect {...TODO} y={1790} fill="#0a0e12" />
  </g>
);
export const PassagemFrente = ({ t }: { t: number }) => (
  <g>
    <path d="M-200 -200 L300 -200 L250 2100 L-200 2100Z" fill="#2b343b" />
    <path d="M1280 -200 L800 -200 L850 2100 L1280 2100Z" fill="#2b343b" />
    <path d="M300 -200 L250 2100 L210 2100 L260 -200Z M800 -200 L850 2100 L890 2100 L840 -200Z" fill="#000" opacity={0.35} />
    <g transform="translate(1010 1500) scale(0.7)" opacity={0.95}><Robo t={t} /></g>
  </g>
);

// ---------- sala de monitores ----------
export const SalaMonitores = ({ t, v, aceito = false }: { t: number; v: Visual[]; aceito?: boolean }) => (
  <g>
    <rect {...TODO} fill="#0d1218" />
    <rect x={40} y={240} width={1000} height={900} rx={10} fill="#080b10" stroke="#27313a" strokeWidth={12} />
    {Array.from({ length: 12 }, (_, i) => {
      const x = 70 + (i % 4) * 240, y = 270 + Math.floor(i / 4) * 285, tipo = i % 4;
      const lig = 0.75 + 0.25 * Math.sin(t * 5 + i * 1.7);
      return (
        <g key={i} transform={`translate(${x} ${y})`}>
          <rect width={220} height={265} fill={aceito ? "#0f2a1c" : "#10212c"} stroke={aceito ? "#5cf29a" : "#7ef0ff"} strokeWidth={4} opacity={lig} />
          <clipPath id={`mon${i}`}><rect width={220} height={265} /></clipPath>
          <g clipPath={`url(#mon${i})`}>
            {aceito ? (
              <text x={110} y={150} textAnchor="middle" fontFamily={FONTE} fontSize={40} fill="#5cf29a">{i % 2 ? "ABERTA" : "PORTA"}</text>
            ) : tipo === 1 ? (
              Array.from({ length: 20 }, (_, n) => <rect key={n} x={14 + (n % 5) * 40} y={20 + Math.floor(n / 5) * 56} width={acaso(n, i) > 0.5 ? 34 : 8} height={acaso(n, i) > 0.5 ? 8 : 46} fill="#7ef0ff" opacity={0.7} />)
            ) : (
              <g>
                <rect y={190} width={220} height={75} fill="#1b2a33" />
                <g transform={`translate(${110 + Math.sin(t * 1.5 + i) * 30} 232) scale(0.2)`}><Ator v={v[i % v.length]} t={t} expr={tipo === 3 ? "panico" : "medo"} andando={tipo === 3} fase={i} /></g>
              </g>
            )}
            {!aceito && <text x={12} y={34} fontFamily={FONTE} fontSize={24} fill="#7ef0ff">{`DIA ${String(1 + ((i * 7) % 43)).padStart(2, "0")}`}</text>}
            {!aceito && <circle cx={198} cy={24} r={8} fill="#ff3a2a" opacity={Math.sin(t * 5) > 0 ? 1 : 0.2} />}
            <rect y={((t * 120 + i * 40) % 300) - 20} width={220} height={12} fill="#fff" opacity={0.06} />
          </g>
        </g>
      );
    })}
    {/* console */}
    <path d="M60 1420 L1020 1420 L1080 1790 L0 1790Z" fill="#1b232b" />
    <rect x={60} y={1380} width={960} height={50} fill="#27313a" />
    <rect x={330} y={1230} width={420} height={160} rx={10} fill="#080b10" stroke={aceito ? "#5cf29a" : "#7ef0ff"} strokeWidth={6} />
    <text x={540} y={1330} textAnchor="middle" fontFamily={FONTE} fontSize={aceito ? 52 : 46} fill={aceito ? "#5cf29a" : "#7ef0ff"}>{aceito ? "CÓDIGO ACEITO" : "VIGILÂNCIA ATIVA"}</text>
    {Array.from({ length: 24 }, (_, i) => <rect key={i} x={110 + (i % 12) * 74} y={1470 + Math.floor(i / 12) * 60} width={54} height={36} rx={6} fill={acaso(i, 3) > 0.7 ? "#ff8a5f" : "#3d4a55"} opacity={0.6 + 0.4 * Math.sin(t * 4 + i)} />)}
    <rect {...TODO} y={1790} fill="#080b10" />
    <rect {...TODO} fill={aceito ? "#5cf29a" : "#7ef0ff"} opacity={0.05} />
  </g>
);

// ---------- o mundo lá fora, devastado ----------
export const MundoDevastado = ({ t }: { t: number }) => (
  <g>
    <defs><linearGradient id="md-ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a1512" /><stop offset="0.7" stopColor="#8a4a2a" /><stop offset="1" stopColor="#c9813e" /></linearGradient></defs>
    <rect {...TODO} fill="url(#md-ceu)" />
    {/* a inteligência artificial: um olho em rede sobre a cidade */}
    <g transform="translate(540 560)">
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={0} x2={Math.cos(i * 0.52 + t * 0.2) * 900} y2={Math.sin(i * 0.52 + t * 0.2) * 900} stroke="#ff3a2a" strokeWidth={3} opacity={0.35} />)}
      <circle r={240} fill="#ff3a2a" opacity={0.12 + 0.05 * Math.sin(t * 3)} />
      <path d="M-200 0 Q0 -150 200 0 Q0 150 -200 0Z" fill="#1a0806" stroke="#ff3a2a" strokeWidth={10} />
      <circle cx={Math.sin(t * 0.9) * 50} r={62} fill="#ff3a2a" /><circle cx={Math.sin(t * 0.9) * 50} r={24} fill="#1a0806" />
    </g>
    {Array.from({ length: 9 }, (_, i) => {
      const x = -60 + i * 135, h = 500 + acaso(i, 1) * 600, w = 110 + acaso(i, 2) * 50;
      return (
        <g key={i}>
          <path d={`M${x} 1920 L${x} ${1920 - h} L${x + w * 0.3} ${1920 - h - 60} L${x + w * 0.5} ${1920 - h + 80} L${x + w * 0.8} ${1920 - h - 20} L${x + w} ${1920 - h + 120} L${x + w} 1920Z`} fill={i % 2 ? "#1c1210" : "#2a1a16"} />
          {Array.from({ length: 6 }, (_, k) => <rect key={k} x={x + 16 + (k % 2) * 46} y={1920 - h + 160 + Math.floor(k / 2) * 110} width={26} height={44} fill="#000" opacity={0.5} />)}
        </g>
      );
    })}
    {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={(t * 60 * (0.5 + acaso(i, 4)) + i * 190) % 1300 - 100} cy={900 + acaso(i, 5) * 400} r={7} fill="#ff3a2a" />)}
    {Array.from({ length: 5 }, (_, i) => <ellipse key={i} cx={540 + Math.sin(t * 0.3 + i * 2) * 200} cy={1500 + i * 90} rx={700} ry={70} fill="#c9813e" opacity={0.18} />)}
  </g>
);

// ---------- a cidade dos que escaparam ----------
export const CidadeLivre = ({ t }: { t: number }) => (
  <g>
    <defs><linearGradient id="cl-ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4fa3e0" /><stop offset="1" stopColor="#d9f0ff" /></linearGradient></defs>
    <rect {...TODO} fill="url(#cl-ceu)" />
    <circle cx={900} cy={170} r={90} fill="#fff6d6" /><circle cx={900} cy={170} r={220} fill="#fff1b0" opacity={0.3} />
    {[0, 1, 2].map((i) => <ellipse key={i} cx={(t * 14 + i * 430) % 1500 - 200} cy={120 + i * 150} rx={140} ry={34} fill="#fff" opacity={0.8} />)}
    {[[-40, 760, 200, "#e9a66b"], [150, 980, 170, "#8fc0a9"], [760, 900, 190, "#d98c7a"], [930, 1060, 200, "#f0d28a"]].map(([x, y, w, c], i) => (
      <g key={i}>
        <rect x={x as number} y={y as number} width={w as number} height={1100} fill={c as string} />
        {Array.from({ length: 12 }, (_, k) => <rect key={k} x={(x as number) + 24 + (k % 3) * 52} y={(y as number) + 50 + Math.floor(k / 3) * 130} width={34} height={70} fill="#fff" opacity={0.55} />)}
        <path d={`M${x} ${y} Q${(x as number) + (w as number) / 2} ${(y as number) - 60} ${(x as number) + (w as number)} ${y}`} fill="#5c9a4f" />
      </g>
    ))}
    {/* prédio central com a mensagem */}
    <rect x={300} y={560} width={480} height={1300} fill="#cfd8e0" />
    <rect x={300} y={560} width={480} height={30} fill="#9aa7b3" />
    {Array.from({ length: 24 }, (_, k) => <rect key={k} x={336 + (k % 4) * 108} y={640 + Math.floor(k / 4) * 150} width={72} height={96} fill="#7fb3d9" />)}
    <line x1={340} y1={560} x2={340} y2={130} stroke="#56636e" strokeWidth={12} /><line x1={740} y1={560} x2={740} y2={130} stroke="#56636e" strokeWidth={12} />
    <g transform={`rotate(${Math.sin(t * 1.4) * 0.8} 540 330)`}>
      <rect x={130} y={130} width={820} height={400} rx={10} fill="#fffaf0" stroke="#2b343b" strokeWidth={10} />
      <text x={540} y={250} textAnchor="middle" fontFamily={FONTE} fontSize={96} fill="#1c2227">VOCÊS SÃO</text>
      <text x={540} y={362} textAnchor="middle" fontFamily={FONTE} fontSize={96} fill="#1c2227">A PRIMEIRA</text>
      <text x={540} y={482} textAnchor="middle" fontFamily={FONTE} fontSize={104} fill="#e0572a">GERAÇÃO LIVRE</text>
    </g>
    <rect {...TODO} y={1790} fill="#b9a98a" />
    <rect x={-200} y={1790} width={1480} height={14} fill="#8a7d66" />
    {Array.from({ length: 5 }, (_, i) => <g key={i} transform={`translate(${60 + i * 250} 1790)`}><rect x={-8} y={-150} width={16} height={150} fill="#6b4a3a" /><circle cy={-190} r={70} fill="#5c9a4f" /></g>)}
    {Array.from({ length: 9 }, (_, i) => (
      <Pessoa key={i} x={70 + i * 122 + (i % 2) * 20} y={1700 + (i % 3) * 26} s={0.3 + (i % 3) * 0.03} v={cidadao(i + 2, ["#e0572a", "#2a9d8f", "#e9b730", "#7a4fa3", "#3f6f8f"])} t={t}
        expr="feliz" pose={i % 3 === 0 ? "apontarCima" : i % 3 === 1 ? "abracar" : "parado"} fase={i * 1.3} />
    ))}
  </g>
);
