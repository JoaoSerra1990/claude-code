import type { ReactNode } from "react";
import { Ator, type Visual } from "../serie/Ator";
import { cidadao } from "../curtas/futurista";

// Cenários do curta "Os Últimos Oito Minutos": trem urbano por fora e por dentro, e o hospital.

const FONTE = "Anton, Impact, sans-serif";
const acaso = (i: number, k: number) => {
  const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const TODO = { x: -200, y: -200, width: 1480, height: 2320 };

/** Clarão de explosão em silhueta; `p` de 0 a 1. */
const Bum = ({ p, t, s = 1 }: { p: number; t: number; s?: number }) => (
  <g transform={`scale(${s})`} opacity={p > 0 ? 1 : 0}>
    <circle r={60 + p * 520} fill="#ff7a2a" opacity={0.5 * (1 - p * 0.6)} />
    <circle r={40 + p * 360} fill="#ffb347" opacity={0.8 * (1 - p * 0.5)} />
    <circle r={20 + p * 220} fill="#fff3c9" opacity={1 - p * 0.6} />
    {Array.from({ length: 14 }, (_, i) => {
      const a = i * 0.45 + acaso(i, 1), d = p * (300 + acaso(i, 2) * 500);
      return <rect key={i} x={Math.cos(a) * d - 10} y={Math.sin(a) * d - 10 + p * p * 200} width={14 + acaso(i, 3) * 22} height={10 + acaso(i, 4) * 14} fill="#1a1210" transform={`rotate(${t * 300 + i * 40} ${Math.cos(a) * d} ${Math.sin(a) * d})`} />;
    })}
    {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={(acaso(i, 5) - 0.5) * 400 * p} cy={-p * (200 + i * 90)} r={(70 + i * 20) * p} fill="#2a2422" opacity={0.6 * p} />)}
  </g>
);

// ---------- o trem visto de fora ----------
export const Exterior = ({ t, trem = 0.5, boom = 0, boomEm = [540, 1010], caixa = null }: {
  t: number;
  /** Posição do trem na ponte, de 0 (entrando à esquerda) a 1. */
  trem?: number; boom?: number; boomEm?: [number, number];
  /** Caixa caindo do trem até o ponto da explosão, de 0 a 1. */
  caixa?: number | null;
}) => {
  const x0 = -900 + trem * 1300;
  return (
    <g>
      <defs><linearGradient id="oi-ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#27406b" /><stop offset="0.55" stopColor="#e9925a" /><stop offset="1" stopColor="#ffd9a0" /></linearGradient></defs>
      <rect {...TODO} fill="url(#oi-ceu)" />
      <circle cx={760} cy={880} r={130} fill="#fff1c9" /><circle cx={760} cy={880} r={320} fill="#ffd98a" opacity={0.3} />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-60 + i * 100} y={760 - acaso(i, 1) * 260} width={86} height={700} fill="#5a3f55" opacity={0.75} />)}
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={-90 + i * 140} y={880 - acaso(i, 2) * 180} width={120} height={700} fill="#3a2a40" />)}
      {/* viaduto */}
      <rect x={-200} y={1060} width={1480} height={46} fill="#1a1418" />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-160 + i * 260} 1106 L${-160 + i * 260} 1920 L${-110 + i * 260} 1920 L${-110 + i * 260} 1300 Q${-30 + i * 260} 1120 ${50 + i * 260} 1300 L${50 + i * 260} 1920 L${100 + i * 260} 1920 L${100 + i * 260} 1106Z`} fill="#1a1418" />)}
      <rect x={-200} y={1700} width={1480} height={420} fill="#120e12" />
      {/* trem em silhueta */}
      <g transform={`translate(${x0} ${1060 + Math.sin(t * 30) * 1.5})`}>
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${i * 236} 0)`}>
            <rect x={0} y={-104} width={226} height={96} rx={i === 3 ? 30 : 10} fill="#141018" />
            {[0, 1, 2, 3].map((k) => <rect key={k} x={16 + k * 52} y={-88} width={38} height={34} fill="#ffe9a8" opacity={0.9} />)}
            <circle cx={40} cy={-6} r={12} fill="#141018" /><circle cx={186} cy={-6} r={12} fill="#141018" />
          </g>
        ))}
        <path d="M944 -70 L1010 -90" stroke="#fff3c9" strokeWidth={10} opacity={0.5} />
      </g>
      {caixa !== null && (
        <rect x={x0 + 300 - caixa * 420 - 16} y={1000 + (boomEm[1] - 1000) * caixa * caixa - 60 * Math.sin(caixa * Math.PI) - 12} width={32} height={24} fill="#b3402e" stroke="#141018" strokeWidth={4} transform={`rotate(${t * 500} ${x0 + 300 - caixa * 420} ${1000 + (boomEm[1] - 1000) * caixa * caixa})`} />
      )}
      {boom > 0 && <g transform={`translate(${boomEm[0]} ${boomEm[1]})`}><Bum p={boom} t={t} /></g>}
    </g>
  );
};

// ---------- interior do vagão ----------
const Paisagem = ({ t, vel, id, x, y, w, h }: { t: number; vel: number; id: string; x: number; y: number; w: number; h: number }) => (
  <g>
    <clipPath id={id}><rect x={x} y={y} width={w} height={h} rx={26} /></clipPath>
    <g clipPath={`url(#${id})`}>
      <rect x={x} y={y} width={w} height={h} fill="#f0b77a" />
      <rect x={x} y={y} width={w} height={h * 0.45} fill="#7fa3cf" opacity={0.8} />
      {Array.from({ length: 8 }, (_, i) => {
        const px = ((i * 260 - t * 900 * vel) % 2080 + 2080) % 2080 - 300;
        return <rect key={i} x={px} y={y + h * 0.3 + acaso(i, 3) * h * 0.3} width={150 + acaso(i, 4) * 80} height={h} fill="#5a3f55" opacity={0.85} />;
      })}
      {Array.from({ length: 5 }, (_, i) => {
        const px = ((i * 420 - t * 2600 * vel) % 2100 + 2100) % 2100 - 300;
        return <rect key={i} x={px} y={y - 20} width={26} height={h + 40} fill="#2a2030" />;
      })}
    </g>
    <rect x={x} y={y} width={w} height={h} rx={26} fill="none" stroke="#39424f" strokeWidth={16} />
  </g>
);

const Placar = ({ relogio, t, x = 540, y = 410 }: { relogio: string; t: number; x?: number; y?: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-190} y={-50} width={380} height={100} rx={12} fill="#0c0f14" stroke="#39424f" strokeWidth={8} />
    <text x={-170} y={22} fontFamily={FONTE} fontSize={64} fill="#ffb347">{relogio.slice(0, 2)}<tspan opacity={Math.sin(t * 6) > 0 ? 1 : 0.25}>:</tspan>{relogio.slice(3)}</text>
    <text x={170} y={16} textAnchor="end" fontFamily={FONTE} fontSize={34} fill="#ffb347" opacity={0.8}>CENTRAL →</text>
  </g>
);

export const Vagao = ({ t, vel = 1, relogio = "08:09", banco = "#3d6fa3", ar = false, passageiros = true, agachados = false }: {
  t: number; vel?: number; relogio?: string; banco?: string;
  /** Painel do ar-condicionado aberto no teto. */
  ar?: boolean; passageiros?: boolean; agachados?: boolean;
}) => (
  <g>
    <rect {...TODO} fill="#cdd5dc" />
    <rect x={-200} y={-200} width={1480} height={540} fill="#aab4bd" />
    <rect x={-200} y={320} width={1480} height={24} fill="#7f8a94" />
    {[160, 920].map((x) => <rect key={x} x={x - 130} y={150} width={260} height={36} rx={18} fill="#fffbe6" opacity={0.7 + 0.3 * Math.sin(t * 40 + x) * (vel > 1.2 ? 1 : 0.1)} />)}
    {/* ar-condicionado */}
    <rect x={410} y={200} width={260} height={110} rx={10} fill={ar ? "#14181e" : "#8e99a3"} stroke="#56636e" strokeWidth={8} />
    {!ar && Array.from({ length: 6 }, (_, i) => <line key={i} x1={430} y1={218 + i * 15} x2={650} y2={218 + i * 15} stroke="#56636e" strokeWidth={5} />)}
    {ar && (
      <g>
        <path d="M410 310 L670 310 L690 520 L430 520Z" fill="#8e99a3" stroke="#56636e" strokeWidth={8} opacity={0.95} transform="rotate(8 410 310)" />
        <path d="M470 230 Q500 300 480 380 M560 230 Q540 320 590 400 M610 230 Q640 290 620 350" stroke="#e0572a" strokeWidth={7} fill="none" />
        <path d="M520 230 Q500 330 540 420" stroke="#e6c229" strokeWidth={7} fill="none" />
      </g>
    )}
    <Paisagem t={t} vel={vel} id="oi-j1" x={-140} y={540} w={460} h={470} />
    <Paisagem t={t} vel={vel} id="oi-j2" x={380} y={540} w={320} h={470} />
    <Paisagem t={t} vel={vel} id="oi-j3" x={760} y={540} w={460} h={470} />
    <Placar relogio={relogio} t={t} />
    <line x1={-200} y1={470} x2={1280} y2={470} stroke="#e6c229" strokeWidth={14} />
    {[60, 300, 780, 1020].map((x, i) => <g key={x} transform={`translate(${x} 470) rotate(${Math.sin(t * 5 + i) * 5 * vel})`}><line x1={0} y1={0} x2={0} y2={70} stroke="#56636e" strokeWidth={8} /><path d="M-26 70 L26 70 L18 116 L-18 116Z" fill="none" stroke="#56636e" strokeWidth={9} /></g>)}
    {/* bancos */}
    <rect x={-200} y={1090} width={1480} height={700} fill="#b4bec7" />
    {[-150, 400, 760].map((x, i) => (
      <g key={x}>
        <rect x={x} y={1120} width={i === 1 ? 280 : 470} height={230} rx={30} fill={banco} />
        <rect x={x - 10} y={1330} width={(i === 1 ? 280 : 470) + 20} height={90} rx={20} fill={banco} />
        <rect x={x - 10} y={1330} width={(i === 1 ? 280 : 470) + 20} height={26} rx={12} fill="#fff" opacity={0.18} />
        <rect x={x + 20} y={1420} width={20} height={370} fill="#56636e" /><rect x={x + (i === 1 ? 240 : 430)} y={1420} width={20} height={370} fill="#56636e" />
      </g>
    ))}
    {passageiros && [[-10, 3], [170, 5], [860, 7], [1040, 9]].map(([x, i]) => (
      <g key={i} transform={`translate(${x} ${agachados ? 1700 : 1560}) scale(0.5)`}>
        <Ator v={cidadao(i)} t={t} expr={agachados ? "panico" : i % 2 ? "sereno" : "neutro"} pose={agachados ? "abracar" : "parado"} olhar={[i % 2 ? -0.5 : 0.5, 0.6]} fase={i} />
      </g>
    ))}
    {passageiros && [-150, 760].map((x) => <rect key={x} x={x - 10} y={1330} width={490} height={90} rx={20} fill={banco} />)}
    <rect {...TODO} y={1790} fill="#3d454d" />
    <rect x={-200} y={1790} width={1480} height={16} fill="#e6c229" opacity={0.7} />
  </g>
);

// ---------- fim do vagão: cabine do maquinista ou passagem ----------
export const FimVagao = ({ t, tipo, abre = 0, relogio = "08:11" }: { t: number; tipo: "cabine" | "passagem"; abre?: number; relogio?: string }) => (
  <g>
    <rect {...TODO} fill="#bcc6ce" />
    <rect x={-200} y={-200} width={1480} height={540} fill="#aab4bd" />
    <rect x={-200} y={320} width={1480} height={24} fill="#7f8a94" />
    <Placar relogio={relogio} t={t} x={540} y={420} />
    <rect x={290} y={520} width={500} height={1270} fill={tipo === "cabine" ? "#14181e" : "#2a3138"} />
    {tipo === "passagem" && (
      <g>
        <rect x={330} y={600} width={420} height={1190} fill="#cdd5dc" />
        <rect x={330} y={1150} width={420} height={640} fill="#c2772e" opacity={0.55} />
        <line x1={330} y1={760} x2={750} y2={760} stroke="#e6c229" strokeWidth={10} />
      </g>
    )}
    {tipo === "cabine" && (
      <g>
        <rect x={330} y={600} width={420} height={520} fill="#f0b77a" />
        <g transform="translate(540 1500) scale(0.9)"><Ator v={{ pele: "#141018", cabelo: "#141018", roupa: "#141018", calca: "#141018", estilo: "curto", chapeu: "#141018" }} t={t} expr="neutro" /></g>
      </g>
    )}
    {([-1, 1] as const).map((l) => (
      <g key={l} transform={`translate(${l * abre * 240} 0)`}>
        <rect x={l === -1 ? 290 : 540} y={520} width={250} height={1270} fill="#8e99a3" stroke="#56636e" strokeWidth={8} />
        <rect x={l === -1 ? 330 : 570} y={620} width={180} height={420} rx={20} fill={tipo === "cabine" ? "#3a2a40" : "#dfe6ec"} opacity={tipo === "cabine" ? 0.75 : 0.5} stroke="#56636e" strokeWidth={8} />
      </g>
    ))}
    <rect x={300} y={470} width={480} height={50} fill={tipo === "cabine" ? "#b3402e" : "#3d6fa3"} />
    <text x={540} y={508} textAnchor="middle" fontFamily={FONTE} fontSize={38} fill="#fff" letterSpacing={3}>{tipo === "cabine" ? "CABINE · ACESSO RESTRITO" : "VAGÃO 4"}</text>
    {/* freio de emergência */}
    <g transform="translate(940 1000)">
      <rect x={-80} y={-110} width={160} height={220} rx={12} fill="#b3402e" stroke="#14181e" strokeWidth={8} />
      <text x={0} y={-60} textAnchor="middle" fontFamily={FONTE} fontSize={34} fill="#fff">FREIO</text>
      <rect x={-18} y={-30} width={36} height={110} rx={14} fill="#e8e4dc" />
    </g>
    <rect {...TODO} y={1790} fill="#3d454d" />
    <rect x={-200} y={1790} width={1480} height={16} fill="#e6c229" opacity={0.7} />
  </g>
);

// ---------- janela de manutenção ----------
export const Escotilha = ({ t }: { t: number }) => (
  <g>
    <rect {...TODO} fill="#9aa5ae" />
    {Array.from({ length: 6 }, (_, i) => <line key={i} x1={-200 + i * 300} y1={-200} x2={-200 + i * 300} y2={1790} stroke="#7f8a94" strokeWidth={10} />)}
    <Paisagem t={t} vel={1.3} id="oi-esc" x={250} y={560} w={580} h={560} />
    {Array.from({ length: 9 }, (_, i) => {
      const x = ((i * 190 - t * 1900) % 900 + 900) % 900 + 160;
      return <line key={i} x1={x} y1={600 + i * 56} x2={x + 150} y2={600 + i * 56} stroke="#fff" strokeWidth={6} opacity={0.6} />;
    })}
    <path d="M250 560 L830 560 L900 380 L180 380Z" fill="#7f8a94" stroke="#56636e" strokeWidth={10} />
    <rect x={300} y={1170} width={480} height={64} fill="#e6c229" />
    <text x={540} y={1218} textAnchor="middle" fontFamily={FONTE} fontSize={42} fill="#14181e">JANELA DE MANUTENÇÃO</text>
    <rect {...TODO} y={1790} fill="#3d454d" />
  </g>
);

// ---------- hospital ----------
export const Hospital = ({ t, relogio = "08:17", tv }: { t: number; relogio?: string; tv?: ReactNode }) => (
  <g>
    <rect {...TODO} fill="#cfe3e0" />
    <rect x={-200} y={1300} width={1480} height={500} fill="#b7d0cc" />
    <rect x={-200} y={1290} width={1480} height={16} fill="#8fb0ab" />
    {/* janela com sol da manhã */}
    <rect x={-60} y={460} width={330} height={560} rx={10} fill="#bfe3f5" stroke="#f4f7f8" strokeWidth={22} />
    <circle cx={120} cy={640} r={70} fill="#fff6d6" />
    <path d="M270 460 L900 1790 L300 1790 L-60 1020Z" fill="#fff6d6" opacity={0.18} />
    {/* relógio digital */}
    <g transform="translate(250 320)">
      <rect x={-170} y={-70} width={340} height={140} rx={14} fill="#0c0f14" stroke="#56636e" strokeWidth={8} />
      <text x={0} y={34} textAnchor="middle" fontFamily={FONTE} fontSize={104} fill={relogio === "08:17" ? "#ff5a4a" : "#5cf29a"} letterSpacing={4}>{relogio}</text>
    </g>
    {/* televisão */}
    <g transform="translate(600 210)">
      <rect x={-14} y={-14} width={468} height={318} rx={12} fill="#14181e" />
      <clipPath id="oi-tv"><rect width={440} height={290} /></clipPath>
      <g clipPath="url(#oi-tv)">{tv ?? <rect width={440} height={290} fill="#1c2a3a" />}</g>
    </g>
    {/* monitor cardíaco e soro */}
    <g transform="translate(930 1050)">
      <rect x={-100} y={-90} width={200} height={170} rx={12} fill="#14181e" stroke="#56636e" strokeWidth={8} />
      <polyline points={Array.from({ length: 20 }, (_, i) => `${-84 + i * 9},${((i + Math.floor(t * 8)) % 10 === 4 ? -50 : (i + Math.floor(t * 8)) % 10 === 5 ? 40 : 0)}`).join(" ")} stroke="#5cf29a" strokeWidth={5} fill="none" />
      <rect x={-10} y={80} width={20} height={660} fill="#8e99a3" />
    </g>
    {/* cabeceira e travesseiro */}
    <rect x={140} y={1040} width={640} height={520} rx={30} fill="#8fb0ab" />
    <rect x={250} y={1130} width={420} height={240} rx={60} fill="#f4f7f8" />
    <rect {...TODO} y={1790} fill="#9fb9b5" />
  </g>
);
/** Lençol e grade da cama, na frente do paciente. */
export const Cama = () => (
  <g>
    <path d="M120 1560 Q460 1500 800 1560 L860 1900 L60 1900Z" fill="#f4f7f8" />
    <path d="M120 1560 Q460 1500 800 1560 L806 1620 Q460 1560 114 1620Z" fill="#9fd4e8" />
    <rect x={60} y={1840} width={820} height={90} fill="#8e99a3" />
  </g>
);

/** Passageiros saindo do trem, vistos na televisão (440x290). */
export const Reportagem = ({ t, elenco }: { t: number; elenco: Visual[] }) => (
  <g>
    <rect width={440} height={290} fill="#9fc7e8" />
    <rect y={200} width={440} height={90} fill="#8e99a3" />
    <rect x={-20} y={60} width={300} height={150} rx={14} fill="#dfe6ec" stroke="#56636e" strokeWidth={5} />
    <rect x={150} y={84} width={70} height={126} fill="#14181e" />
    {[0, 1, 2].map((i) => <rect key={i} x={i * 50 + 4} y={84} width={38} height={44} fill="#3d6fa3" />)}
    {elenco.map((v, i) => {
      const x = 190 + ((t * 26 + i * 62) % 250);
      return <g key={i} transform={`translate(${x} 262) scale(0.11)`}><Ator v={v} t={t} expr="feliz" andando pose={i % 2 ? "abracar" : "parado"} fase={i} /></g>;
    })}
    <rect y={236} width={440} height={54} fill="#b3402e" />
    <text x={14} y={272} fontFamily={FONTE} fontSize={30} fill="#fff">AO VIVO · ATENTADO IMPEDIDO</text>
  </g>
);
