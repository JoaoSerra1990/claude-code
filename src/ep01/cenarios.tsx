import { AbsoluteFill } from "remotion";
import { COLORS, FONT } from "../theme";

// ---------- helpers ----------
const piscada = (t: number, fase: number) => 0.9 + 0.1 * Math.sin(t * 31 + fase) * Math.sin(t * 7 + fase);
const apagao = (t: number) => (Math.sin(t * 2.3) > 0.985 ? 0.45 : 1);

// ---------- zumbi visto de cima e de frente ----------
// Olhos brancos e vazios (sem pupila), boca reta e aberta, sem sorriso.
// Caminham um pouco para a direita ou para a esquerda, com um leve balanço.
export const Zumbi = ({ x, y, t, fase, dir, camisa }: {
  x: number; y: number; t: number; fase: number; dir: 1 | -1; camisa: string;
}) => {
  const dx = dir * (10 + 12 * Math.sin(t * 1.1 + fase));
  const dy = Math.sin(t * 2.4 + fase) * 3;
  const giro = Math.sin(t * 1.6 + fase) * 7;
  const olhar = Math.sin(t * 2.2 + fase) * 1.5; // os olhos se mexem, sem pupila
  return (
    <g transform={`translate(${x + dx} ${y + dy}) rotate(${giro})`}>
      <ellipse cx={0} cy={44} rx={36} ry={22} fill={camisa} />
      <rect x={-14} y={14} width={28} height={22} fill="#6e8a68" />
      <circle cx={0} cy={0} r={26} fill="#7fa37a" />
      <circle cx={-10 + olhar} cy={-4} r={8} fill="#ffffff" />
      <circle cx={10 + olhar} cy={-4} r={8} fill="#ffffff" />
      <rect x={-9} y={11} width={18} height={5} rx={2} fill="#2b0f12" />
      <path d="M-13 -20 L-4 -16" stroke="#3b4d38" strokeWidth={3} />
      <circle cx={14} cy={-18} r={3} fill="#5b2a2a" opacity={0.7} />
    </g>
  );
};

const CAMISAS = ["#4b3a2c", "#2a3b52", "#5a2e2e", "#3a4a3a", "#3b3146", "#48423a"];

// ---------- visão aérea do pátio ----------
export const Patio = ({ t }: { t: number }) => {
  const zumbis = Array.from({ length: 30 }, (_, i) => ({
    x: 170 + ((i * 127) % 740),
    y: 700 + ((i * 181) % 720),
    fase: i * 0.83,
    dir: (i % 2 ? 1 : -1) as 1 | -1,
    camisa: CAMISAS[i % CAMISAS.length],
  }));
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <rect width={1080} height={1920} fill="#14161d" />
        {/* rua e carros abandonados */}
        <rect x={0} y={1520} width={1080} height={400} fill="#1f2229" />
        <rect x={0} y={1560} width={1080} height={8} fill="#c9b458" opacity={0.5} />
        <rect x={120} y={1640} width={220} height={110} rx={18} fill="#5a2e2e" />
        <rect x={150} y={1660} width={70} height={40} fill="#27303a" />
        <rect x={700} y={1700} width={240} height={110} rx={18} fill="#2e4a5a" />
        <rect x={740} y={1720} width={80} height={40} fill="#27303a" />
        {/* prédio da escola, visto de cima */}
        <rect x={60} y={120} width={960} height={520} rx={22} fill="#2a2f3d" stroke="#3b4456" strokeWidth={10} />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={120 + i * 180} y={180} width={130} height={60} fill="#3b4a5e" />
        ))}
        {[0, 1, 2].map((i) => (
          <rect key={`s${i}`} x={130 + i * 290} y={420} width={210} height={150} rx={6} fill="#3a4658" />
        ))}
        {/* pátio de concreto com marcações */}
        <rect x={120} y={660} width={840} height={860} fill="#3a3d46" />
        <rect x={120} y={660} width={840} height={860} fill="none" stroke="#cfd3dc" strokeWidth={6} opacity={0.4} />
        <circle cx={540} cy={1090} r={130} fill="none" stroke="#cfd3dc" strokeWidth={6} opacity={0.35} />
        <line x1={540} y1={660} x2={540} y2={1520} stroke="#cfd3dc" strokeWidth={5} opacity={0.3} />
        {/* manchas e poças escuras */}
        {[[260, 900], [780, 1280], [420, 1410]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx={70} ry={26} fill="#15171c" opacity={0.55} />
        ))}
        {/* grade do portão */}
        <rect x={470} y={1500} width={140} height={24} fill="#4b505c" />
        {zumbis.map((z, i) => (
          <Zumbi key={i} x={z.x} y={z.y} t={t} fase={z.fase} dir={z.dir} camisa={z.camisa} />
        ))}
        <rect width={1080} height={1920} fill="url(#vinheta)" />
        <defs>
          <radialGradient id="vinheta" cx="50%" cy="50%" r="70%">
            <stop offset="55%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.6" />
          </radialGradient>
        </defs>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- sala trancada: ambiente fixo da história ----------
export const Sala = ({ t, escuro, relogio }: { t: number; escuro?: boolean; relogio?: boolean }) => {
  const luz = piscada(t, 0) * apagao(t);
  const poeira = Array.from({ length: 40 }, (_, i) => ({
    x: (i * 97) % 1080,
    y: 1920 - ((i * 211 + t * (25 + (i % 3) * 14)) % 1920),
    r: 1.5 + (i % 3),
  }));
  const ponteiroHora = ((3 + 17 / 60) * 30 - 90) * (Math.PI / 180);
  const ponteiroMin = (17 * 6 - 90) * (Math.PI / 180);
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="parede" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1b2435" />
            <stop offset="1" stopColor="#141b29" />
          </linearGradient>
          <linearGradient id="chao" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a2e38" />
            <stop offset="1" stopColor="#15171d" />
          </linearGradient>
          <linearGradient id="feixe" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff3c4" stopOpacity="0.55" />
            <stop offset="1" stopColor="#fff3c4" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="brilho" cx="50%" cy="0%" r="60%">
            <stop offset="0" stopColor="#fff6d8" stopOpacity="0.5" />
            <stop offset="1" stopColor="#fff6d8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* parede, teto e chão */}
        <rect width={1080} height={1920} fill="#0c1018" />
        <rect x={0} y={0} width={1080} height={1300} fill="url(#parede)" />
        <rect x={0} y={0} width={1080} height={90} fill="#0d111a" />
        <rect x={0} y={1290} width={1080} height={630} fill="url(#chao)" />
        {/* azulejos da parede e rodapé */}
        {Array.from({ length: 14 }, (_, i) => (
          <line key={`a${i}`} x1={i * 80} y1={90} x2={i * 80} y2={1100} stroke="#202b3e" strokeWidth={2} />
        ))}
        <rect x={0} y={1100} width={1080} height={22} fill="#2c3a52" />
        {/* linhas do chão */}
        {[1340, 1420, 1520, 1640, 1790].map((y, i) => (
          <line key={`c${i}`} x1={0} y1={y} x2={1080} y2={y} stroke="#343944" strokeWidth={3} />
        ))}
        {/* rachaduras e mancha de água no teto */}
        <path d="M900 90 L930 170 L915 230 L960 290" fill="none" stroke="#0a0d14" strokeWidth={4} />
        <ellipse cx={330} cy={60} rx={160} ry={30} fill="#2a2c20" opacity={0.7} />

        {/* luzes do teto que piscam */}
        {[180, 540, 900].map((x, i) => (
          <g key={`l${i}`}>
            <rect x={x - 120} y={30} width={240} height={22} fill="#fff7d6" opacity={piscada(t, i * 2) * apagao(t + i)} />
            <ellipse cx={x} cy={300} rx={420} ry={520} fill="url(#brilho)" opacity={luz * 0.7} />
          </g>
        ))}

        {/* quadro-negro com giz */}
        <rect x={250} y={150} width={580} height={300} rx={10} fill="#173b32" stroke="#6b4b2e" strokeWidth={16} />
        <rect x={270} y={458} width={540} height={14} fill="#5a4026" />
        <text x={540} y={270} textAnchor="middle" fontFamily={FONT} fontSize={112} fill="#e8f3ef" opacity={0.92}>3 DIAS</text>
        <text x={540} y={352} textAnchor="middle" fontFamily={FONT} fontSize={54} fill="#e8f3ef" opacity={0.7}>NÃO SAIAM DAQUI</text>
        <line x1={300} y1={380} x2={560} y2={372} stroke="#e8f3ef" strokeWidth={3} opacity={0.35} />
        <line x1={320} y1={400} x2={700} y2={412} stroke="#e8f3ef" strokeWidth={3} opacity={0.25} />

        {/* relógio de parede parado às 3:17 */}
        <circle cx={910} cy={300} r={70} fill="#efe9d8" stroke="#222831" strokeWidth={12} />
        <line x1={910} y1={300} x2={910 + Math.cos(ponteiroHora) * 36} y2={300 + Math.sin(ponteiroHora) * 36} stroke="#222831" strokeWidth={9} strokeLinecap="round" />
        <line x1={910} y1={300} x2={910 + Math.cos(ponteiroMin) * 56} y2={300 + Math.sin(ponteiroMin) * 56} stroke="#222831" strokeWidth={6} strokeLinecap="round" />
        <circle cx={910} cy={300} r={6} fill="#222831" />

        {/* cartazes */}
        <g transform="rotate(-4 130 260)">
          <rect x={60} y={170} width={150} height={190} fill="#e9d9a6" />
          {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={78} y={200 + i * 26} width={114} height={8} fill="#7a6a3a" />)}
          <circle cx={135} cy={172} r={8} fill={COLORS.red} />
        </g>
        <g transform="rotate(3 110 480)">
          <rect x={50} y={430} width={120} height={150} fill="#8fd3c2" />
          <rect x={70} y={460} width={80} height={60} fill="#2f6f63" />
          <rect x={70} y={535} width={80} height={6} fill="#2f6f63" />
        </g>

        {/* janela tabuada à esquerda, com luz entrando pelas frestas */}
        <rect x={60} y={660} width={250} height={340} fill="#101824" stroke="#3b4a60" strokeWidth={14} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={40} y={700 + i * 70} width={290} height={40} fill="#6b4a2e" transform={`rotate(${-3 + i} 185 ${720 + i * 70})`} />
        ))}
        <polygon points="70,1000 310,1000 560,1300 150,1300" fill="url(#feixe)" opacity={0.5 * luz} />

        {/* armários à direita */}
        <rect x={860} y={560} width={180} height={560} fill="#2b3a55" stroke="#1a2435" strokeWidth={6} />
        {[0, 1, 2].map((i) => (
          <g key={`lk${i}`}>
            <line x1={860 + 60 * (i + 1)} y1={560} x2={860 + 60 * (i + 1)} y2={1120} stroke="#1a2435" strokeWidth={5} />
            <rect x={862 + 60 * i} y={600} width={56} height={6} fill="#6b7790" />
            {[0, 1, 2, 3].map((v) => <rect key={v} x={870 + 60 * i} y={640 + v * 14} width={40} height={4} fill="#1a2435" />)}
          </g>
        ))}

        {/* porta trancada com carteiras empilhadas e placa de saída bloqueada */}
        <rect x={410} y={600} width={260} height={690} fill="#262a34" stroke="#171a22" strokeWidth={8} />
        <rect x={428} y={620} width={224} height={40} rx={6} fill="#7a1a1a" opacity={0.5 + 0.5 * Math.sin(t * 4) ** 2} />
        <text x={540} y={650} textAnchor="middle" fontFamily={FONT} fontSize={34} fill="#fff">SAÍDA</text>
        <g transform="rotate(-6 540 1000)">
          <rect x={390} y={900} width={300} height={44} fill="#6b4a2e" stroke="#2c1f13" strokeWidth={5} />
          <rect x={380} y={960} width={320} height={44} fill="#7a5638" stroke="#2c1f13" strokeWidth={5} />
          <rect x={400} y={1020} width={280} height={44} fill="#6b4a2e" stroke="#2c1f13" strokeWidth={5} />
          <rect x={390} y={1080} width={300} height={44} fill="#7a5638" stroke="#2c1f13" strokeWidth={5} />
          <rect x={410} y={1140} width={260} height={44} fill="#6b4a2e" stroke="#2c1f13" strokeWidth={5} />
        </g>

        {/* carteiras e cadeiras no chão */}
        {[60, 300, 700].map((x, i) => (
          <g key={`cd${i}`}>
            <rect x={x} y={1330} width={190} height={24} fill="#6b5238" />
            <rect x={x + 20} y={1354} width={10} height={60} fill="#3a2c1e" />
            <rect x={x + 160} y={1354} width={10} height={60} fill="#3a2c1e" />
          </g>
        ))}

        {/* mesa de comida no canto */}
        <rect x={40} y={1200} width={260} height={28} fill="#4a3728" />
        <rect x={60} y={1228} width={12} height={90} fill="#3a2c1e" />
        <rect x={270} y={1228} width={12} height={90} fill="#3a2c1e" />
        {[["#c83a2b", 80], ["#e0b13a", 118], ["#3a8fd0", 156], ["#2fa86b", 194]].map(([c, x], i) => (
          <rect key={i} x={x as number} y={1158} width={26} height={42} rx={6} fill={c as string} stroke="#111" strokeWidth={2} />
        ))}
        <rect x={230} y={1140} width={56} height={60} rx={6} fill="#f3c97a" />
        <rect x={100} y={1150} width={24} height={50} rx={10} fill="#7fc8ff" opacity={0.55} />

        {/* mochilas no chão */}
        <rect x={120} y={1820} width={170} height={180} rx={44} fill="#2f4f8a" />
        <rect x={150} y={1860} width={110} height={60} rx={14} fill="#1f3766" />
        <rect x={720} y={1840} width={150} height={160} rx={40} fill="#a13a3a" />
        <rect x={750} y={1876} width={90} height={56} rx={12} fill="#7a2a2a" />

        {/* poeira no feixe de luz */}
        {poeira.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#fff6d8" opacity={0.25 * luz} />
        ))}

        {/* escuridão no início (Helena fala no escuro) */}
        {escuro && <rect width={1080} height={1920} fill="#000" opacity={0.55} />}
      </svg>
      {relogio && (
        <div style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontSize: 200, color: COLORS.red, textShadow: `0 0 30px ${COLORS.red}`, opacity: Math.sin(t * 17) > -0.2 ? 1 : 0.35 }}>
          03:17
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- subsolo ----------
export const Subsolo = ({ t }: { t: number }) => {
  const rachadura = Math.min(1, Math.max(0, (t - 58) / 10));
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <rect width={1080} height={1920} fill="#0b0f16" />
        {Array.from({ length: 14 }, (_, i) => <line key={`h${i}`} x1={0} x2={1080} y1={i * 140} y2={i * 140} stroke="#1e2a3a" strokeWidth={4} />)}
        {Array.from({ length: 9 }, (_, i) => <line key={`v${i}`} x1={i * 140} x2={i * 140} y1={0} y2={1920} stroke="#1e2a3a" strokeWidth={4} />)}
        <rect x={300} y={1000} width={480} height={140} rx={16} fill="#1a2433" stroke="#3b4f6b" strokeWidth={6} />
        <rect x={460} y={260} width={160} height={36} rx={8} fill={COLORS.red} />
        <text x={540} y={286} textAnchor="middle" fontFamily={FONT} fontSize={28} fill="#fff">LABORATÓRIO</text>
        <path d={`M200 1500 L${200 + 700 * rachadura} ${1500 + 40 * rachadura} L${200 + 880 * rachadura} ${1600}`} fill="none" stroke={COLORS.red} strokeWidth={8} opacity={rachadura} />
      </svg>
    </AbsoluteFill>
  );
};
