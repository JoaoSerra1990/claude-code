import { FONT } from "../theme";
import { Ator, type Visual } from "../serie/Ator";

// Cenários de "O Menino que Vendia Minutos". Presente: rua antiga sob chuva, em
// azuis e cinzas frios. Memória: cozinha banhada de dourado. Final: a relojoaria
// se abre para um espaço de estrelas e relógios, cada um guardando uma memória.

const Ponteiros = ({ cx, cy, r, tempo, cor = "#20242c" }: { cx: number; cy: number; r: number; tempo: number; cor?: string }) => {
  const min = (tempo / 60) * 6 - 90;
  const hora = (tempo / 720) * 6 - 90 + 70;
  const seg = tempo * 6 - 90;
  const p = (ang: number, k: number) => [cx + Math.cos((ang * Math.PI) / 180) * r * k, cy + Math.sin((ang * Math.PI) / 180) * r * k];
  const [hx, hy] = p(hora, 0.5), [mx, my] = p(min, 0.74), [sx, sy] = p(seg, 0.82);
  return (
    <g strokeLinecap="round">
      {Array.from({ length: 12 }, (_, i) => {
        const [x1, y1] = p(i * 30, 0.8), [x2, y2] = p(i * 30, 0.92);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={cor} strokeWidth={r * 0.05} />;
      })}
      <line x1={cx} y1={cy} x2={hx} y2={hy} stroke={cor} strokeWidth={r * 0.1} />
      <line x1={cx} y1={cy} x2={mx} y2={my} stroke={cor} strokeWidth={r * 0.07} />
      <line x1={cx} y1={cy} x2={sx} y2={sy} stroke="#b3261e" strokeWidth={r * 0.035} />
      <circle cx={cx} cy={cy} r={r * 0.07} fill={cor} />
    </g>
  );
};

export const RELOGIO_RUA: [number, number] = [250, 420];
export const RELOGIO_COZINHA: [number, number] = [250, 420];
export const PORTA_RELOJOARIA: [number, number] = [425, 1050];

type RuaProps = {
  t: number;
  /** Tempo da chuva e dos passantes; parar de avançar congela a cena. */
  tChuva: number;
  /** Tempo mostrado pelos relógios da rua, em segundos. */
  tRelogio: number;
  /** Luz dourada que sai do relógio de bolso, de 0 a 1, e de onde ela sai. */
  ouro: number;
  ouroEm: [number, number];
  /** 1 quando a chuva está suspensa no ar. */
  suspensa: number;
  /** Intensidade da chuva, de 0 (cessou) a 1. */
  chuva: number;
  /** Onde Theo está: a chuva não o molha. */
  seco: [number, number];
  /** Mostra na vitrine o reflexo de Arthur e da placa; Theo não tem reflexo. */
  reflexo?: Visual;
  /** Abertura da porta da relojoaria, de 0 a 1. */
  porta: number;
};

export const Rua = ({ t, tChuva, tRelogio, ouro, ouroEm, suspensa, chuva, seco, reflexo, porta }: RuaProps) => {
  const gotas = Array.from({ length: 110 }, (_, i) => ({
    x: (i * 173) % 1120 - 20,
    y: ((i * 311 + tChuva * (620 + (i % 5) * 90)) % 2000) - 40,
    l: 34 + (i % 4) * 12,
  }));
  const passantes = [
    { x: ((tChuva * 70) % 1500) - 200, y: 1395, s: 0.5, dir: 1 },
    { x: 1300 - ((tChuva * 55 + 500) % 1600), y: 1420, s: 0.56, dir: -1 },
    { x: ((tChuva * 44 + 900) % 1700) - 300, y: 1365, s: 0.46, dir: 1 },
  ];
  return (
    <g>
      <defs>
        <linearGradient id="ceuRua" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a2233" />
          <stop offset="1" stopColor="#3a4a63" />
        </linearGradient>
        <radialGradient id="halo" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffd98a" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="reflexo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffcf7a" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffcf7a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#ceuRua)" />
      {/* prédios ao fundo, com janelas acesas */}
      {[[-20, 330, 220], [200, 250, 190], [390, 300, 260], [650, 220, 200], [850, 290, 260]].map(([x, y, w], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={1100} fill="#232c3d" />
          {[0, 1, 2, 3].map((r) =>
            [0, 1].map((c) => (
              <rect key={`${r}${c}`} x={x + 30 + c * (w / 2)} y={y + 50 + r * 120} width={44} height={66}
                fill={(i + r + c) % 3 === 0 ? "#f5c66e" : "#141b28"} opacity={(i + r + c) % 3 === 0 ? 0.75 : 1} />
            )),
          )}
        </g>
      ))}

      {/* fachada da esquerda: relojoaria com um grande relógio */}
      <rect x={0} y={170} width={500} height={1140} fill="#4a5568" />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={0} x2={500} y1={230 + i * 90} y2={230 + i * 90} stroke="#3a4455" strokeWidth={4} />
      ))}
      <rect x={0} y={150} width={520} height={40} fill="#353e4f" />
      <circle cx={RELOGIO_RUA[0]} cy={RELOGIO_RUA[1]} r={132} fill="#2a3140" />
      <circle cx={RELOGIO_RUA[0]} cy={RELOGIO_RUA[1]} r={116} fill="#efe6cf" stroke="#b8923f" strokeWidth={10} />
      <Ponteiros cx={RELOGIO_RUA[0]} cy={RELOGIO_RUA[1]} r={110} tempo={tRelogio} />
      <rect x={50} y={640} width={400} height={76} rx={8} fill="#2a3140" />
      <text x={250} y={694} textAnchor="middle" fontFamily={FONT} fontSize={46} fill="#d9b25e" letterSpacing={4}>RELOJOARIA</text>
      {/* vitrine */}
      <rect x={40} y={760} width={300} height={470} fill="#1a2436" stroke="#2a3140" strokeWidth={14} />
      {[[100, 870, 40], [190, 960, 54], [282, 860, 36], [116, 1090, 34], [268, 1100, 44]].map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill="#d9d2bd" stroke="#8b6f33" strokeWidth={6} opacity={0.85} />
          <Ponteiros cx={x} cy={y} r={r * 0.9} tempo={tRelogio + i * 733} />
        </g>
      ))}
      <clipPath id="vitrine"><rect x={47} y={767} width={286} height={456} /></clipPath>
      {reflexo && (
        <g clipPath="url(#vitrine)" opacity={0.34}>
          <g transform="translate(236 1300) scale(-0.6 0.6)"><Ator v={reflexo} t={t} expr="triste" fase={3} /></g>
          {/* a placa aparece no vidro, mas ninguém a segura */}
          <g transform="translate(118 1270) scale(0.42)">
            <rect x={-9} y={-340} width={18} height={340} fill="#6b4a30" />
            <rect x={-190} y={-560} width={380} height={230} rx={10} fill="#efe3c4" stroke="#3d2c1c" strokeWidth={9} />
          </g>
        </g>
      )}
      <path d="M60 780 L150 780 L90 1210 L52 1210Z" fill="#9fc0e8" opacity={0.12} />

      {/* porta da relojoaria: por dentro, estrelas e relógios */}
      <rect x={360} y={790} width={130} height={520} fill="#0b0d2e" stroke="#1c1610" strokeWidth={10} />
      <clipPath id="vaoPorta"><rect x={365} y={795} width={120} height={510} /></clipPath>
      {porta > 0 && (
        <g clipPath="url(#vaoPorta)">
          {Array.from({ length: 26 }, (_, i) => (
            <circle key={i} cx={370 + ((i * 47) % 112)} cy={800 + ((i * 131) % 500)} r={1.5 + (i % 3)} fill="#fff" opacity={0.5 + 0.5 * Math.sin(t * 3 + i)} />
          ))}
          {[[400, 900, 20], [452, 1010, 26], [396, 1130, 16], [446, 1220, 22]].map(([x, y, r], i) => (
            <g key={i}>
              <circle cx={x} cy={y + Math.sin(t * 1.2 + i) * 8} r={r * 2.2} fill="url(#halo)" />
              <circle cx={x} cy={y + Math.sin(t * 1.2 + i) * 8} r={r} fill="#fbe9b0" stroke="#e8c35a" strokeWidth={4} />
            </g>
          ))}
        </g>
      )}
      <g transform={`translate(365 0) scale(${1 - porta * 0.86} 1) translate(-365 0)`}>
        <rect x={365} y={795} width={120} height={510} fill="#4a3526" />
        <rect x={382} y={830} width={86} height={190} fill="#1a2436" stroke="#2a2018" strokeWidth={6} />
        <rect x={382} y={1060} width={86} height={200} fill="#3d2c1f" />
        <circle cx={470} cy={1050} r={9} fill="#d9b25e" />
      </g>
      {porta > 0 && <polygon points="365,1305 485,1305 660,1720 250,1720" fill="url(#reflexo)" opacity={0.9 * porta} />}
      {porta > 0 && <circle cx={425} cy={1050} r={200 + porta * 260} fill="url(#halo)" opacity={0.55 * porta} />}

      {/* loja pequena iluminada em dourado, à direita */}
      <rect x={590} y={420} width={490} height={890} fill="#5a4c40" />
      <rect x={590} y={400} width={490} height={36} fill="#3c332b" />
      <circle cx={835} cy={640} r={380} fill="url(#halo)" opacity={0.5} />
      <path d="M600 720 L1080 720 L1080 800 L570 800Z" fill="#8a3b2e" />
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={590 + i * 84} y={720} width={42} height={80} fill="#a34a3a" opacity={0.6} />)}
      <rect x={630} y={830} width={250} height={330} fill="#ffcf7a" stroke="#3c332b" strokeWidth={14} />
      <line x1={755} y1={830} x2={755} y2={1160} stroke="#3c332b" strokeWidth={10} />
      <line x1={630} y1={990} x2={880} y2={990} stroke="#3c332b" strokeWidth={10} />
      <rect x={920} y={820} width={140} height={490} fill="#6b3f26" stroke="#3c332b" strokeWidth={10} />
      <circle cx={946} cy={1070} r={10} fill="#d9b25e" />
      {/* relógio pendurado */}
      <line x1={835} y1={436} x2={835} y2={500} stroke="#23272f" strokeWidth={8} />
      <circle cx={835} cy={570} r={76} fill="#efe6cf" stroke="#23272f" strokeWidth={12} />
      <Ponteiros cx={835} cy={570} r={66} tempo={tRelogio + 1500} />

      {/* poste */}
      <rect x={540} y={560} width={16} height={760} fill="#1c2029" />
      <path d="M548 560 Q548 500 600 500" stroke="#1c2029" strokeWidth={14} fill="none" />
      <circle cx={610} cy={520} r={150} fill="url(#halo)" opacity={0.75} />
      <rect x={588} y={496} width={44} height={56} rx={10} fill="#ffe7a8" stroke="#1c2029" strokeWidth={6} />

      {/* calçamento de pedra molhado */}
      <rect x={0} y={1300} width={1080} height={620} fill="#2b3444" />
      {Array.from({ length: 9 }, (_, r) =>
        Array.from({ length: 12 }, (_, c) => (
          <rect key={`${r}-${c}`} x={c * 96 - (r % 2) * 48} y={1310 + r * 68} width={88} height={60} rx={16}
            fill={(r + c) % 3 ? "#36405299" : "#3f4a5e"} />
        )),
      )}
      <rect x={630} y={1310} width={250} height={420} fill="url(#reflexo)" />
      <rect x={570} y={1310} width={80} height={520} fill="url(#reflexo)" opacity={0.8} />
      <ellipse cx={300} cy={1560} rx={170} ry={26} fill="#8fb0d8" opacity={0.14} />
      <ellipse cx={820} cy={1760} rx={200} ry={30} fill="#8fb0d8" opacity={0.12} />

      {/* passantes com guarda-chuva, ao fundo */}
      {passantes.map((ps, i) => (
        <g key={i} transform={`translate(${ps.x} ${ps.y}) scale(${ps.s})`} opacity={0.9}>
          <rect x={-40} y={-330} width={80} height={250} rx={34} fill="#161b25" />
          <rect x={-34} y={-90} width={28} height={90} fill="#161b25" transform={`rotate(${Math.sin(tChuva * 6 + i) * 14} -20 -90)`} />
          <rect x={6} y={-90} width={28} height={90} fill="#161b25" transform={`rotate(${-Math.sin(tChuva * 6 + i) * 14} 20 -90)`} />
          <circle cx={0} cy={-370} r={44} fill="#161b25" />
          <line x1={ps.dir * 30} y1={-260} x2={ps.dir * 30} y2={-520} stroke="#161b25" strokeWidth={8} />
          <path d={`M${ps.dir * 30 - 150} -500 Q${ps.dir * 30} -640 ${ps.dir * 30 + 150} -500Z`} fill="#202838" />
        </g>
      ))}

      {/* luz dourada do relógio de bolso */}
      {ouro > 0 && <circle cx={ouroEm[0]} cy={ouroEm[1]} r={160 + ouro * 900} fill="url(#halo)" opacity={Math.min(1, ouro * 1.2)} />}

      {/* chuva: riscos quando cai, gotas redondas quando fica suspensa; nunca sobre Theo */}
      {chuva > 0 &&
        gotas.map((g, i) => {
          if (Math.abs(g.x - seco[0]) < 78 && g.y > seco[1] - 470 && g.y < seco[1] + 10) return null;
          return suspensa > 0.5 ? (
            <ellipse key={i} cx={g.x} cy={g.y} rx={5} ry={8} fill="#dcebff" opacity={0.75 * chuva} />
          ) : (
            <line key={i} x1={g.x} y1={g.y} x2={g.x - 8} y2={g.y + g.l} stroke="#cfe0ff" strokeWidth={3} opacity={0.4 * chuva} />
          );
        })}
      <rect width={1080} height={1920} fill="#0a1020" opacity={0.18} />
      <rect x={0} y={0} width={1080} height={1920} fill="#ffffff" opacity={0.02 * Math.sin(t * 3)} />
    </g>
  );
};

type CozinhaProps = { t: number; tRelogio: number; brilho: number };

export const Cozinha = ({ t, tRelogio, brilho }: CozinhaProps) => {
  const [rx, ry] = RELOGIO_COZINHA;
  const poeira = Array.from({ length: 30 }, (_, i) => ({
    x: 520 + ((i * 71) % 480), y: 1300 - ((i * 157 + t * (14 + (i % 4) * 6)) % 1000), r: 2 + (i % 3),
  }));
  return (
    <g>
      <defs>
        <linearGradient id="paredeCoz" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3d9a4" />
          <stop offset="1" stopColor="#e8bf7c" />
        </linearGradient>
        <linearGradient id="sol" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff4c9" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff4c9" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="haloCoz" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff2b8" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fff2b8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#paredeCoz)" />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={i * 135} y1={0} x2={i * 135} y2={1300} stroke="#e2c088" strokeWidth={3} opacity={0.5} />
      ))}
      <rect x={0} y={1180} width={1080} height={120} fill="#c9925a" />

      {/* janela com o sol de domingo */}
      <rect x={560} y={300} width={430} height={520} fill="#fff6d6" stroke="#8a5a34" strokeWidth={18} />
      <line x1={775} y1={300} x2={775} y2={820} stroke="#8a5a34" strokeWidth={12} />
      <line x1={560} y1={560} x2={990} y2={560} stroke="#8a5a34" strokeWidth={12} />
      <circle cx={880} cy={400} r={70} fill="#ffe08a" />
      <path d="M560 300 Q610 520 540 820 L520 300Z" fill="#d97b5c" />
      <path d="M990 300 Q940 520 1010 820 L1030 300Z" fill="#d97b5c" />
      <polygon points="560,820 990,820 700,1920 60,1920" fill="url(#sol)" opacity={0.75} />
      <rect x={640} y={790} width={280} height={36} fill="#8a5a34" />
      <ellipse cx={700} cy={760} rx={46} ry={40} fill="#4f8a4c" />
      <rect x={676} y={770} width={48} height={40} fill="#b5552f" />
      <ellipse cx={860} cy={756} rx={38} ry={44} fill="#5b9a55" />
      <rect x={838} y={770} width={44} height={40} fill="#b5552f" />

      {/* relógio de parede */}
      {brilho > 0 && <circle cx={rx} cy={ry} r={130 + brilho * 260} fill="url(#haloCoz)" opacity={brilho} />}
      <circle cx={rx} cy={ry} r={112} fill="#fbf3dc" stroke="#8a5a34" strokeWidth={14} />
      <Ponteiros cx={rx} cy={ry} r={96} tempo={tRelogio} cor="#5a3a22" />

      {/* armário, fogão e chaleira */}
      <rect x={40} y={640} width={420} height={170} rx={8} fill="#b9814c" stroke="#8a5a34" strokeWidth={8} />
      <line x1={250} y1={640} x2={250} y2={810} stroke="#8a5a34" strokeWidth={6} />
      <rect x={40} y={900} width={420} height={400} fill="#b9814c" stroke="#8a5a34" strokeWidth={8} />
      <rect x={70} y={940} width={170} height={150} fill="#3a2c22" />
      <rect x={270} y={940} width={160} height={320} fill="#a8703f" />
      <circle cx={290} cy={1100} r={9} fill="#f0d9a8" />
      <rect x={40} y={880} width={420} height={26} fill="#e9dcc0" />
      <path d="M110 880 Q110 800 170 800 Q230 800 230 880Z" fill="#8fa8b8" />
      <path d="M228 840 L270 820" stroke="#8fa8b8" strokeWidth={12} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${262 + i * 10} ${800 - ((t * 40 + i * 30) % 90)} q10 -16 0 -30`} stroke="#fff" strokeWidth={5} fill="none" opacity={0.5} />
      ))}

      {/* piso xadrez */}
      <rect x={0} y={1300} width={1080} height={620} fill="#d9a56a" />
      {Array.from({ length: 6 }, (_, r) =>
        Array.from({ length: 9 }, (_, c) =>
          (r + c) % 2 ? <rect key={`${r}-${c}`} x={c * 120} y={1300 + r * 104} width={120} height={104} fill="#c98c4f" /> : null,
        ),
      )}
      {poeira.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#fffbe6" opacity={0.6} />)}
    </g>
  );
};

/** Mesa do café, desenhada à frente de quem senta atrás dela. */
export const MesaCafe = ({ t }: { t: number }) => (
  <g>
    <rect x={150} y={1262} width={780} height={34} rx={10} fill="#8a5a34" />
    <rect x={150} y={1250} width={780} height={22} rx={8} fill="#f4ead2" />
    <rect x={190} y={1296} width={26} height={410} fill="#6b4426" />
    <rect x={864} y={1296} width={26} height={410} fill="#6b4426" />
    {[330, 750].map((x, i) => (
      <g key={x}>
        <ellipse cx={x} cy={1250} rx={52} ry={10} fill="#e6dcc2" />
        <path d={`M${x - 30} 1196 L${x + 30} 1196 L${x + 24} 1248 L${x - 24} 1248Z`} fill="#fbf6ea" stroke="#b9814c" strokeWidth={4} />
        <path d={`M${x + 28} 1206 q26 6 4 30`} stroke="#fbf6ea" strokeWidth={8} fill="none" />
        {[0, 1].map((k) => (
          <path key={k} d={`M${x - 10 + k * 18} ${1186 - ((t * 34 + k * 40 + i * 20) % 80)} q12 -18 0 -34`} stroke="#fff" strokeWidth={5} fill="none" opacity={0.55} />
        ))}
      </g>
    ))}
    <ellipse cx={540} cy={1244} rx={86} ry={16} fill="#e6dcc2" />
    <path d="M476 1240 Q540 1170 604 1240Z" fill="#c98a45" />
    <path d="M500 1218 l14 -10 M530 1206 l14 -10 M562 1212 l14 -8" stroke="#8a5a34" strokeWidth={5} />
  </g>
);

// Ícones simples das memórias guardadas nos relógios.
const Memoria = ({ tipo, r }: { tipo: number; r: number }) => {
  const c = "#b8741f";
  const k = r / 40;
  switch (tipo % 4) {
    case 0: // duas pessoas de mãos dadas
      return (
        <g transform={`scale(${k})`} fill={c}>
          <circle cx={-12} cy={-12} r={7} /><rect x={-18} y={-4} width={12} height={22} rx={5} />
          <circle cx={12} cy={-12} r={7} /><rect x={6} y={-4} width={12} height={22} rx={5} />
          <rect x={-8} y={2} width={16} height={4} />
        </g>
      );
    case 1: // casa
      return (
        <g transform={`scale(${k})`} fill={c}>
          <path d="M-20 0 L0 -20 L20 0Z" /><rect x={-14} y={0} width={28} height={18} /><rect x={-4} y={6} width={8} height={12} fill="#fbe9b0" />
        </g>
      );
    case 2: // coração
      return <path transform={`scale(${k})`} d="M0 16 Q-24 -2 -12 -14 Q-4 -20 0 -8 Q4 -20 12 -14 Q24 -2 0 16Z" fill={c} />;
    default: // adulto e criança
      return (
        <g transform={`scale(${k})`} fill={c}>
          <circle cx={-8} cy={-14} r={8} /><rect x={-15} y={-5} width={14} height={24} rx={5} />
          <circle cx={12} cy={-2} r={6} /><rect x={7} y={5} width={10} height={14} rx={4} />
        </g>
      );
  }
};

/** Número estável entre 0 e 1 para o item `i`. */
const acaso = (i: number, k: number) => {
  const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return v - Math.floor(v);
};

/** O interior da relojoaria: espaço sem fim, estrelas e relógios com memórias luminosas. */
export const Cosmos = ({ t }: { t: number }) => {
  const estrelas = Array.from({ length: 170 }, (_, i) => ({
    x: (i * 197) % 1080, y: (i * 389) % 1920, r: 1 + (i % 4) * 0.8, f: i * 0.7,
  }));
  const relogios = Array.from({ length: 44 }, (_, i) => {
    const r = 20 + Math.floor(acaso(i, 3) * 5) * 16;
    return {
      x: 40 + acaso(i, 1) * 1000 + Math.sin(t * 0.4 + i) * 16,
      y: 60 + acaso(i, 2) * 1560 + Math.cos(t * 0.33 + i * 1.7) * 22,
      r, i,
    };
  }).sort((a, b) => a.r - b.r);
  return (
    <g>
      <defs>
        <linearGradient id="espaco" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#060822" />
          <stop offset="0.6" stopColor="#1a1247" />
          <stop offset="1" stopColor="#2b1a52" />
        </linearGradient>
        <radialGradient id="nebulosa" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#6d4bd1" stopOpacity="0.5" />
          <stop offset="1" stopColor="#6d4bd1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="nebulosa2" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#2aa7b8" stopOpacity="0.35" />
          <stop offset="1" stopColor="#2aa7b8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="aura" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffd98a" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#espaco)" />
      <ellipse cx={260} cy={560} rx={620} ry={460} fill="url(#nebulosa)" />
      <ellipse cx={860} cy={1240} rx={560} ry={520} fill="url(#nebulosa2)" />
      <ellipse cx={540} cy={1700} rx={700} ry={360} fill="url(#aura)" opacity={0.35} />
      {estrelas.map((e, i) => (
        <circle key={i} cx={e.x} cy={e.y} r={e.r} fill="#fff" opacity={0.35 + 0.65 * Math.abs(Math.sin(t * 1.6 + e.f))} />
      ))}
      {relogios.map(({ x, y, r, i }) => (
        <g key={i} opacity={0.55 + 0.45 * Math.min(1, r / 70)}>
          <circle cx={x} cy={y} r={r * 2.3} fill="url(#aura)" opacity={0.55 + 0.2 * Math.sin(t * 2 + i)} />
          <rect x={x - r * 0.14} y={y - r * 1.3} width={r * 0.28} height={r * 0.34} rx={r * 0.08} fill="#b8923f" />
          <circle cx={x} cy={y} r={r} fill="#fdf0c2" stroke="#e8c35a" strokeWidth={r * 0.12} />
          {r > 34 && <g transform={`translate(${x} ${y + r * 0.1})`}><Memoria tipo={i} r={r * 0.62} /></g>}
          <Ponteiros cx={x} cy={y} r={r * 0.92} tempo={t * (20 + (i % 5) * 30) + i * 900} cor="#7a5a2a" />
        </g>
      ))}
    </g>
  );
};
