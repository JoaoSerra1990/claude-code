import { COLORS, FONT } from "../theme";
import { Ator, type Visual } from "./Ator";

// Todos os cenários são grupos SVG em coordenadas de "mundo". A câmera do
// episódio escolhe qual parte do mundo aparece (viewBox), então dá para
// aproximar em qualquer detalhe sem perder nitidez.

export const MUNDO_ALTURA = 3000;

const ZUMBI_ROUPAS = ["#4b3a2c", "#2a3b52", "#5a2e2e", "#3a4a3a", "#3b3146", "#48423a"];
const zumbiVisual = (i: number): Visual => ({
  pele: "#8aa085",
  cabelo: "#2c332b",
  roupa: ZUMBI_ROUPAS[i % ZUMBI_ROUPAS.length],
  calca: "#23262d",
  estilo: (["curto", "longo", "cacheado", "curto"] as const)[i % 4],
});

// ---------- zumbi visto de cima ----------
const ZumbiAereo = ({ x, y, t, fase, dir, camisa }: {
  x: number; y: number; t: number; fase: number; dir: 1 | -1; camisa: string;
}) => {
  const dx = dir * (14 + 16 * Math.sin(t * 0.9 + fase));
  const dy = Math.sin(t * 2.1 + fase) * 4;
  const giro = Math.sin(t * 1.4 + fase) * 8;
  const olhar = Math.sin(t * 2 + fase) * 2;
  return (
    <g transform={`translate(${x + dx} ${y + dy}) rotate(${giro}) scale(1.35)`}>
      <ellipse cx={4} cy={58} rx={40} ry={14} fill="#000" opacity={0.35} />
      <ellipse cx={0} cy={44} rx={36} ry={22} fill={camisa} />
      <circle cx={-34} cy={50 + Math.sin(t * 2 + fase) * 5} r={9} fill="#7fa37a" />
      <circle cx={34} cy={40 - Math.sin(t * 2 + fase) * 5} r={9} fill="#7fa37a" />
      <circle cx={0} cy={0} r={26} fill="#7fa37a" />
      <circle cx={-10 + olhar} cy={-4} r={8} fill="#ffffff" />
      <circle cx={10 + olhar} cy={-4} r={8} fill="#ffffff" />
      <rect x={-9} y={11} width={18} height={5} rx={2} fill="#2b0f12" />
      <path d="M-18 -20 Q0 -34 18 -20" stroke="#2c332b" strokeWidth={8} fill="none" />
    </g>
  );
};

// ---------- visão aérea do pátio ----------
export const Patio = ({ t }: { t: number }) => {
  const zumbis = Array.from({ length: 26 }, (_, i) => ({
    x: 190 + ((i * 127) % 700),
    y: 730 + ((i * 181) % 700),
    fase: i * 0.83,
    dir: (i % 2 ? 1 : -1) as 1 | -1,
    camisa: ZUMBI_ROUPAS[i % ZUMBI_ROUPAS.length],
  }));
  return (
    <g>
      <rect width={1080} height={1920} fill="#12141b" />
      <rect x={0} y={1520} width={1080} height={400} fill="#1c1f26" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={40 + i * 230} y={1700} width={120} height={10} fill="#c9b458" opacity={0.45} />
      ))}
      <g transform="rotate(-8 230 1620)">
        <rect x={120} y={1570} width={230} height={110} rx={20} fill="#5a2e2e" />
        <rect x={160} y={1586} width={90} height={78} rx={8} fill="#1d232b" />
      </g>
      <g transform="rotate(14 820 1800)">
        <rect x={700} y={1750} width={240} height={110} rx={20} fill="#2e4a5a" />
        <rect x={790} y={1766} width={90} height={78} rx={8} fill="#1d232b" />
      </g>
      {/* telhado da escola */}
      <rect x={60} y={120} width={960} height={520} rx={22} fill="#272c39" stroke="#3b4456" strokeWidth={10} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line key={i} x1={60} x2={1020} y1={190 + i * 76} y2={190 + i * 76} stroke="#1f2430" strokeWidth={5} />
      ))}
      <rect x={140} y={200} width={150} height={110} fill="#343b4b" />
      <rect x={760} y={440} width={170} height={120} fill="#343b4b" />
      <circle cx={540} cy={380} r={46} fill="#1f2430" />
      {/* uma janela ainda acesa: os sobreviventes */}
      <rect x={640} y={630} width={90} height={18} fill="#ffd27a" opacity={0.75 + 0.25 * Math.sin(t * 13)} />
      {/* pátio */}
      <rect x={120} y={660} width={840} height={860} fill="#34373f" />
      <rect x={120} y={660} width={840} height={860} fill="none" stroke="#cfd3dc" strokeWidth={6} opacity={0.35} />
      <circle cx={540} cy={1090} r={130} fill="none" stroke="#cfd3dc" strokeWidth={6} opacity={0.3} />
      <line x1={120} y1={1090} x2={960} y2={1090} stroke="#cfd3dc" strokeWidth={5} opacity={0.25} />
      {[[260, 900], [780, 1280], [420, 1410], [700, 820]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={80} ry={30} fill="#111318" opacity={0.6} />
      ))}
      <rect x={160} y={1380} width={150} height={40} rx={6} fill="#4a3728" transform="rotate(20 235 1400)" />
      <circle cx={830} cy={760} r={26} fill="#a3552e" />
      {/* portão arrombado */}
      <rect x={120} y={1508} width={330} height={22} fill="#565b68" />
      <rect x={640} y={1508} width={320} height={22} fill="#565b68" />
      <rect x={450} y={1500} width={170} height={16} fill="#565b68" transform="rotate(24 450 1508)" />
      {zumbis.map((z, i) => <ZumbiAereo key={i} {...z} t={t} />)}
    </g>
  );
};

// ---------- fachada da escola à noite ----------
export const JANELA_ACESA: [number, number] = [705, 800];

export const Fachada = ({ t }: { t: number }) => {
  const luz = 0.75 + 0.25 * Math.sin(t * 9) * Math.sin(t * 2.3);
  return (
    <g>
      <defs>
        <linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#070b1c" />
          <stop offset="1" stopColor="#231a36" />
        </linearGradient>
        <radialGradient id="lua" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#dfe6ff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#dfe6ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#ceu)" />
      <circle cx={860} cy={230} r={220} fill="url(#lua)" />
      <circle cx={860} cy={230} r={70} fill="#e6ebff" />
      {[0, 1, 2].map((i) => (
        <ellipse key={i} cx={((t * (14 + i * 6) + i * 420) % 1500) - 200} cy={170 + i * 120} rx={220} ry={34} fill="#0c1022" opacity={0.75} />
      ))}
      {/* prédio */}
      <rect x={70} y={430} width={940} height={1080} fill="#1d2130" />
      <rect x={50} y={400} width={980} height={46} fill="#2a2f42" />
      <rect x={300} y={470} width={480} height={84} rx={8} fill="#141824" />
      <text x={540} y={510} textAnchor="middle" fontFamily={FONT} fontSize={30} fill="#aab2c8">ESCOLA MUNICIPAL</text>
      <text x={540} y={544} textAnchor="middle" fontFamily={FONT} fontSize={34} fill="#d5dbeb">SANTA HELENA</text>
      {[0, 1, 2].map((andar) =>
        [0, 1, 2, 3].map((col) => {
          const x = 130 + col * 225;
          const y = 620 + andar * 270;
          const acesa = andar === 0 && col === 2;
          if (andar === 2 && (col === 1 || col === 2)) return null;
          return (
            <g key={`${andar}-${col}`}>
              <rect x={x} y={y} width={150} height={180} fill={acesa ? "#ffcf70" : "#0c0f18"} opacity={acesa ? luz : 1} stroke="#31384c" strokeWidth={8} />
              {acesa ? (
                [0, 1, 2].map((i) => (
                  <rect key={i} x={x - 10} y={y + 26 + i * 52} width={170} height={30} fill="#5a3f28" transform={`rotate(${-4 + i * 4} ${x + 75} ${y + 40 + i * 52})`} />
                ))
              ) : (
                <path d={`M${x + 20} ${y + 30} L${x + 80} ${y + 90} L${x + 50} ${y + 150}`} stroke="#2a3146" strokeWidth={4} fill="none" />
              )}
            </g>
          );
        }),
      )}
      {/* entrada acorrentada */}
      <rect x={400} y={1170} width={280} height={340} fill="#10131c" stroke="#31384c" strokeWidth={8} />
      <line x1={540} y1={1170} x2={540} y2={1510} stroke="#31384c" strokeWidth={6} />
      <path d="M440 1330 Q540 1380 640 1330" stroke="#8a8f9c" strokeWidth={9} fill="none" />
      {/* chão e grade */}
      <rect x={0} y={1510} width={1080} height={410} fill="#12141b" />
      {Array.from({ length: 16 }, (_, i) => (
        <rect key={i} x={i * 72 + 10} y={1380} width={10} height={170} fill="#0a0c12" transform={i === 7 || i === 8 ? `rotate(${i === 7 ? -28 : 22} ${i * 72 + 15} 1550)` : undefined} />
      ))}
      <rect x={0} y={1400} width={480} height={10} fill="#0a0c12" />
      <rect x={640} y={1400} width={440} height={10} fill="#0a0c12" />
      {/* zumbis: ao fundo, pequenos; à frente, grandes */}
      {[120, 300, 470, 650, 800, 960].map((x, i) => (
        <g key={`f${i}`} transform={`translate(${x + (i % 2 ? 1 : -1) * (18 + 14 * Math.sin(t * 0.8 + i))} ${1640 + (i % 3) * 22}) scale(0.3)`}>
          <Ator v={zumbiVisual(i)} t={t} zumbi fase={i * 1.7} andando />
        </g>
      ))}
      {[150, 480, 880].map((x, i) => (
        <g key={`p${i}`} transform={`translate(${x + (i % 2 ? -1 : 1) * (30 + 26 * Math.sin(t * 0.7 + i * 2))} ${2040 + i * 14}) scale(0.82)`}>
          <Ator v={zumbiVisual(i + 3)} t={t} zumbi fase={i * 2.3 + 1} />
        </g>
      ))}
      <rect width={1080} height={1920} fill="#060912" opacity={0.25} />
    </g>
  );
};

// ---------- sala trancada + subsolo (um único mundo) ----------
export const FALANTE: [number, number] = [800, 440];
export const RELOGIO: [number, number] = [960, 240];
export const VIDRO_PORTA: [number, number] = [540, 765];

export type SalaProps = {
  t: number;
  /** Nível das luzes do teto, de 0 a 1. */
  luz: number;
  falante?: boolean;
  /** Vulto passando atrás do vidro da porta: progresso 0..1, ou null. */
  vulto?: number | null;
  /** Infectado arranhando o vidro da porta: progresso 0..1, ou null. */
  arranha?: number | null;
  portaTreme?: number;
  /** Carteira em que Carlos sobe para alcançar o alto-falante. */
  mesa?: boolean;
  /** Intensidade da batida no piso (1 no impacto, cai até 0). */
  batida?: number;
  /** Quanto o piso já rachou, de 0 a 1. */
  rachadura?: number;
  /** Tábuas soltas se afastando e revelando a placa metálica, de 0 a 1. */
  afasta?: number;
  /** Abertura da escotilha, de 0 a 1. */
  escotilha?: number;
  /** Mão pálida saindo da escotilha com a fotografia, de 0 a 1. */
  maoFoto?: number;
  /** Soco de baixo para cima, visto no subsolo (1 no impacto). */
  soco?: number;
};

export const Sala = ({
  t, luz, falante = false, vulto = null, arranha = null, portaTreme = 0, mesa = false,
  batida = 0, rachadura = 0, afasta = 0, escotilha = 0, maoFoto = 0, soco = 0,
}: SalaProps) => {
  const poeira = Array.from({ length: 36 }, (_, i) => ({
    x: 60 + ((i * 97) % 520),
    y: 1300 - ((i * 211 + t * (22 + (i % 3) * 12)) % 700),
    r: 1.5 + (i % 3),
  }));
  const hora = ((3 + 17 / 60) * 30 - 90) * (Math.PI / 180);
  const min = (17 * 6 - 90) * (Math.PI / 180);
  const seg = ((Math.floor(t * 2) % 2 ? 43 : 42) * 6 - 90) * (Math.PI / 180);
  const [fx, fy] = FALANTE;
  const [rx, ry] = RELOGIO;
  const tremePorta = Math.sin(t * 80) * 7 * portaTreme;
  const salto = -24 * batida;

  return (
    <g>
      <defs>
        <linearGradient id="parede" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c2333" />
          <stop offset="1" stopColor="#121724" />
        </linearGradient>
        <linearGradient id="feixe" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#cfe0ff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#cfe0ff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="brilho" cx="50%" cy="0%" r="60%">
          <stop offset="0" stopColor="#fff2cc" stopOpacity="0.45" />
          <stop offset="1" stopColor="#fff2cc" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rubro" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ff3324" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ff3324" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="verde" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#4dffb0" stopOpacity="0.5" />
          <stop offset="1" stopColor="#4dffb0" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ===== sala ===== */}
      <rect x={0} y={0} width={1080} height={1300} fill="url(#parede)" />
      <rect x={0} y={0} width={1080} height={90} fill="#0c1018" />
      {Array.from({ length: 14 }, (_, i) => (
        <line key={i} x1={i * 80} y1={90} x2={i * 80} y2={1100} stroke="#212a3b" strokeWidth={2} />
      ))}
      <rect x={0} y={1100} width={1080} height={22} fill="#2a364b" />
      <path d="M1030 90 L1050 190 L1020 260 L1060 340" fill="none" stroke="#0a0d14" strokeWidth={4} />
      <ellipse cx={330} cy={62} rx={170} ry={30} fill="#2a2c20" opacity={0.7} />

      {/* luzes do teto */}
      {[180, 540, 900].map((x, i) => {
        const nivel = luz * (0.88 + 0.12 * Math.sin(t * 31 + i * 2) * Math.sin(t * 7 + i));
        return (
          <g key={i}>
            <rect x={x - 120} y={34} width={240} height={22} fill="#fff7d6" opacity={0.15 + 0.85 * nivel} />
            <ellipse cx={x} cy={300} rx={420} ry={560} fill="url(#brilho)" opacity={nivel * 0.75} />
          </g>
        );
      })}

      {/* quadro-negro */}
      <rect x={90} y={170} width={560} height={300} rx={10} fill="#16372f" stroke="#6b4b2e" strokeWidth={16} />
      <rect x={110} y={478} width={520} height={14} fill="#5a4026" />
      <text x={370} y={290} textAnchor="middle" fontFamily={FONT} fontSize={108} fill="#e8f3ef" opacity={0.92}>3 DIAS</text>
      <text x={370} y={366} textAnchor="middle" fontFamily={FONT} fontSize={50} fill="#e8f3ef" opacity={0.7}>NÃO SAIAM DAQUI</text>
      {[0, 1, 2].map((i) => (
        <line key={i} x1={140 + i * 22} y1={400} x2={140 + i * 22} y2={446} stroke="#e8f3ef" strokeWidth={6} opacity={0.6} />
      ))}
      <path d="M470 410 Q520 396 600 430" stroke="#e8f3ef" strokeWidth={3} fill="none" opacity={0.3} />

      {/* relógio parado às 3:17 */}
      <circle cx={rx} cy={ry} r={66} fill="#efe9d8" stroke="#222831" strokeWidth={12} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        return <line key={i} x1={rx + Math.cos(a) * 46} y1={ry + Math.sin(a) * 46} x2={rx + Math.cos(a) * 54} y2={ry + Math.sin(a) * 54} stroke="#222831" strokeWidth={4} />;
      })}
      <line x1={rx} y1={ry} x2={rx + Math.cos(hora) * 30} y2={ry + Math.sin(hora) * 30} stroke="#222831" strokeWidth={8} strokeLinecap="round" />
      <line x1={rx} y1={ry} x2={rx + Math.cos(min) * 46} y2={ry + Math.sin(min) * 46} stroke="#222831" strokeWidth={5} strokeLinecap="round" />
      <line x1={rx} y1={ry} x2={rx + Math.cos(seg) * 48} y2={ry + Math.sin(seg) * 48} stroke={COLORS.red} strokeWidth={3} strokeLinecap="round" />
      <circle cx={rx} cy={ry} r={6} fill="#222831" />

      {/* alto-falante com fio até o teto */}
      <path d={`M${fx} ${fy - 80} Q${fx - 26} 220 ${fx + 10} 90`} stroke="#0a0d14" strokeWidth={6} fill="none" />
      <g transform={`translate(${falante ? Math.sin(t * 64) * 3 : 0} 0)`}>
        <rect x={fx - 62} y={fy - 80} width={124} height={160} rx={12} fill="#22262f" stroke="#0d1016" strokeWidth={8} />
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={i} x={fx - 44} y={fy - 60 + i * 18} width={88} height={8} rx={4}
            fill={falante ? "#7ef0ff" : "#3b424f"} opacity={falante ? 0.45 + 0.55 * Math.abs(Math.sin(t * 9 + i)) : 1} />
        ))}
        <circle cx={fx + 44} cy={fy + 64} r={6} fill={falante ? COLORS.red : "#3b1a1a"} />
      </g>
      {falante &&
        [0, 1, 2].map((i) => {
          const p = ((t * 1.6 + i / 3) % 1);
          return <circle key={i} cx={fx} cy={fy} r={90 + p * 170} fill="none" stroke="#7ef0ff" strokeWidth={6} opacity={(1 - p) * 0.6} />;
        })}

      {/* cartazes */}
      <g transform="rotate(-4 760 620)">
        <rect x={700} y={560} width={120} height={150} fill="#e9d9a6" />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={716} y={590 + i * 26} width={88} height={8} fill="#7a6a3a" />)}
      </g>

      {/* janela tabuada, com luar pelas frestas */}
      <rect x={60} y={600} width={240} height={340} fill="#0b111b" stroke="#3b4a60" strokeWidth={14} />
      <rect x={76} y={616} width={208} height={308} fill="#31456b" opacity={0.5} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={40} y={636 + i * 74} width={280} height={44} fill="#5f4129" stroke="#2c1f13" strokeWidth={4} transform={`rotate(${-4 + i * 2.5} 180 ${658 + i * 74})`} />
      ))}
      <polygon points="76,940 284,940 620,1300 170,1300" fill="url(#feixe)" opacity={0.55} />

      {/* armários */}
      <rect x={880} y={560} width={180} height={560} fill="#27354e" stroke="#182233" strokeWidth={6} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <line x1={880 + 60 * (i + 1)} y1={560} x2={880 + 60 * (i + 1)} y2={1120} stroke="#182233" strokeWidth={5} />
          {[0, 1, 2, 3].map((v) => <rect key={v} x={890 + 60 * i} y={600 + v * 14} width={40} height={4} fill="#182233" />)}
          <rect x={918 + 60 * i} y={820} width={8} height={36} fill="#7c879d" />
        </g>
      ))}
      <rect x={884} y={760} width={52} height={300} fill="#1f2b40" transform="rotate(7 884 760)" />

      {/* porta com vidro e barricada */}
      <g transform={`translate(${tremePorta} 0)`}>
        <rect x={430} y={620} width={220} height={672} fill="#2a2f3a" stroke="#161920" strokeWidth={8} />
        <rect x={462} y={676} width={156} height={180} fill="#3a4d63" stroke="#161920" strokeWidth={8} />
        <line x1={470} y1={690} x2={520} y2={760} stroke="#9fb6cf" strokeWidth={4} opacity={0.35} />
        {vulto !== null && (
          <g clipPath="url(#vidro)">
            <g transform={`translate(${440 + vulto * 200} 0)`}>
              <ellipse cx={0} cy={790 + Math.sin(t * 5) * 6} rx={52} ry={62} fill="#07090d" />
              <rect x={-70} y={840} width={140} height={60} fill="#07090d" />
              <circle cx={-18} cy={778} r={9} fill="#f2f5f7" />
              <circle cx={20} cy={778} r={9} fill="#f2f5f7" />
            </g>
          </g>
        )}
        {arranha !== null && (
          <g clipPath="url(#vidro)">
            <ellipse cx={530} cy={800 + Math.sin(t * 3) * 5} rx={64} ry={78} fill="#7d957a" />
            <rect x={450} y={860} width={170} height={40} fill="#3a4a3a" />
            <circle cx={506} cy={786} r={14} fill="#f2f5f7" />
            <circle cx={556} cy={786} r={14} fill="#f2f5f7" />
            <rect x={510} y={826} width={42} height={12} rx={4} fill="#2a1114" />
            {[0, 1, 2].map((i) => (
              <line key={i} x1={578 + i * 12} y1={696} x2={574 + i * 12} y2={696 + arranha * 140} stroke="#dbe8f0" strokeWidth={3} opacity={0.75} />
            ))}
            <g transform={`translate(590 ${700 + arranha * 140 + Math.sin(t * 30) * 3})`}>
              <circle r={22} fill="#8aa085" />
              {[0, 1, 2].map((i) => <rect key={i} x={-18 + i * 13} y={-40} width={10} height={26} rx={5} fill="#8aa085" />)}
            </g>
          </g>
        )}
        <clipPath id="vidro"><rect x={466} y={680} width={148} height={172} /></clipPath>
        <rect x={630} y={960} width={12} height={44} fill="#8b8f99" />
      </g>
      <rect x={452} y={566} width={176} height={44} rx={6} fill="#5c1717" opacity={0.6 + 0.4 * Math.sin(t * 4) ** 2} />
      <text x={540} y={599} textAnchor="middle" fontFamily={FONT} fontSize={32} fill="#fff">SAÍDA</text>
      <g transform={`translate(${tremePorta * 0.6} 0) rotate(-5 540 1090)`}>
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={392 + (i % 2) * 14} y={930 + i * 62} width={296} height={46} fill={i % 2 ? "#75533a" : "#664730"} stroke="#2c1f13" strokeWidth={5} />
        ))}
      </g>
      <g transform="rotate(8 620 1230)">
        <rect x={560} y={1170} width={170} height={24} fill="#6b5238" />
        <rect x={574} y={1194} width={10} height={96} fill="#3a2c1e" />
        <rect x={706} y={1194} width={10} height={96} fill="#3a2c1e" />
      </g>

      {/* mesa de comida */}
      <rect x={40} y={1200} width={260} height={28} fill="#4a3728" />
      <rect x={60} y={1228} width={12} height={90} fill="#3a2c1e" />
      <rect x={270} y={1228} width={12} height={90} fill="#3a2c1e" />
      <rect x={84} y={1168} width={54} height={32} rx={5} fill="#c8a24a" stroke="#111" strokeWidth={3} />
      <rect x={150} y={1176} width={46} height={24} rx={5} fill="#b5552f" stroke="#111" strokeWidth={3} />
      <rect x={222} y={1140} width={26} height={60} rx={9} fill="#7fc8ff" opacity={0.55} />
      <rect x={222} y={1176} width={26} height={24} rx={6} fill="#7fc8ff" opacity={0.5} />

      {/* piso de tábuas */}
      <rect x={0} y={1290} width={1080} height={630} fill="#2b2a2c" />
      {Array.from({ length: 6 }, (_, i) => {
        const y = 1290 + i * 105;
        return (
          <g key={i}>
            <line x1={0} y1={y} x2={1080} y2={y} stroke="#1a191b" strokeWidth={4} />
            {Array.from({ length: 5 }, (_, j) => (
              <line key={j} x1={j * 260 + (i % 2) * 130} y1={y} x2={j * 260 + (i % 2) * 130} y2={y + 105} stroke="#1a191b" strokeWidth={3} />
            ))}
          </g>
        );
      })}
      <rect x={0} y={1290} width={1080} height={630} fill="#0b0d12" opacity={0.35} />
      {/* papéis e mochilas pelo chão */}
      <rect x={300} y={1420} width={70} height={50} fill="#d9d4c4" transform="rotate(-18 335 1445)" opacity={0.8} />
      <rect x={740} y={1380} width={60} height={44} fill="#d9d4c4" transform="rotate(24 770 1402)" opacity={0.7} />
      <rect x={20} y={1800} width={150} height={150} rx={40} fill="#2f4f8a" />
      <rect x={46} y={1836} width={98} height={52} rx={12} fill="#1f3766" />
      <rect x={930} y={1810} width={140} height={140} rx={38} fill="#8e3434" />

      {mesa && (
        <g>
          <rect x={690} y={1130} width={220} height={28} fill="#6b5238" stroke="#2c1f13" strokeWidth={4} />
          <rect x={704} y={1158} width={14} height={134} fill="#3a2c1e" />
          <rect x={882} y={1158} width={14} height={134} fill="#3a2c1e" />
        </g>
      )}

      {/* placa metálica sob as tábuas; ela é a escotilha */}
      {(afasta > 0 || escotilha > 0) && (
        <g>
          <rect x={426} y={1744} width={268} height={98} fill="#040506" />
          {escotilha > 0 && <rect x={426} y={1744} width={268} height={98} fill="#ff2a1f" opacity={0.8 * escotilha} />}
          {escotilha > 0 && <polygon points="426,1800 694,1800 960,820 160,820" fill="url(#rubro)" opacity={0.6 * escotilha} />}
          {maoFoto > 0 && (
            <g transform={`translate(600 ${1810 - 96 * maoFoto})`}>
              <rect x={-16} y={10} width={32} height={90} rx={14} fill="#aab6af" />
              <g transform="rotate(-10)">
                <rect x={-58} y={-74} width={116} height={84} rx={4} fill="#efe8d6" stroke="#1a1a1a" strokeWidth={4} />
                <rect x={-48} y={-64} width={96} height={56} fill="#27433c" />
                {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={-38 + i * 15} cy={-30} r={6} fill="#d8c3a8" />)}
              </g>
              <circle cx={0} cy={6} r={22} fill="#c3cec7" />
              {[0, 1, 2, 3].map((d) => <rect key={d} x={-24 + d * 13} y={-18} width={10} height={24} rx={5} fill="#b4c0b9" />)}
            </g>
          )}
          <g transform={`translate(0 ${-52 * escotilha}) rotate(${-8 * escotilha} 430 1795)`}>
            <rect x={434} y={1750} width={252} height={86} rx={6} fill="#5b6470" stroke="#23282f" strokeWidth={6} />
            {[[448, 1764], [672, 1764], [448, 1822], [672, 1822]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={6} fill="#2c323a" />)}
            <text x={560} y={1792} textAnchor="middle" fontFamily={FONT} fontSize={38} fill="#e9d36a">SETOR H</text>
            <text x={560} y={1822} textAnchor="middle" fontFamily={FONT} fontSize={21} fill="#d7dbe2" letterSpacing={2}>ACESSO RESTRITO</text>
          </g>
        </g>
      )}
      {/* tábuas soltas: pulam com as batidas e se afastam para revelar a placa */}
      <g transform={`translate(${-152 * afasta} ${salto})`}>
        <rect x={420} y={1740} width={140} height={105} fill="#39363a" stroke="#141315" strokeWidth={5} />
      </g>
      <g transform={`translate(${152 * afasta} ${salto})`}>
        <rect x={560} y={1740} width={140} height={105} fill="#39363a" stroke="#141315" strokeWidth={5} />
      </g>
      {rachadura > 0 && (
        <g opacity={Math.min(1, rachadura * 2)} stroke="#050506" strokeWidth={7} fill="none" strokeLinecap="round">
          <path d={`M420 1790 L${420 - 150 * rachadura} ${1770 - 30 * rachadura} L${420 - 230 * rachadura} ${1800}`} />
          <path d={`M700 1800 L${700 + 140 * rachadura} ${1830} L${700 + 240 * rachadura} ${1800 - 20 * rachadura}`} />
          <path d={`M560 1845 L${560 + 30 * rachadura} ${1845 + 60 * rachadura}`} />
        </g>
      )}
      {batida > 0.05 &&
        Array.from({ length: 12 }, (_, i) => (
          <circle key={i} cx={430 + i * 24} cy={1740 - (1 - batida) * (60 + (i % 4) * 30)} r={5 + (i % 3) * 2} fill="#b9b2a6" opacity={batida * 0.7} />
        ))}

      {poeira.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#dbe6ff" opacity={0.22} />)}

      {/* ===== laje e subsolo ===== */}
      <rect x={0} y={1920} width={1080} height={130} fill="#3b3d44" />
      {Array.from({ length: 40 }, (_, i) => (
        <circle key={i} cx={(i * 131) % 1080} cy={1935 + ((i * 47) % 100)} r={4 + (i % 3) * 2} fill="#2a2c32" />
      ))}
      <rect x={0} y={2050} width={1080} height={MUNDO_ALTURA - 2050} fill="#07110f" />
      {/* tubulação no teto */}
      <rect x={0} y={2080} width={1080} height={30} fill="#1d2b29" />
      <rect x={0} y={2140} width={1080} height={16} fill="#162220" />
      {[150, 520, 900].map((x) => <rect key={x} x={x} y={2072} width={26} height={46} fill="#2c403c" />)}
      {/* tanques com líquido verde */}
      {[170, 910].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={2560} r={300} fill="url(#verde)" opacity={0.7 + 0.3 * Math.sin(t * 2 + i)} />
          <rect x={x - 90} y={2320} width={180} height={520} rx={40} fill="#0d2a22" stroke="#2f5a4d" strokeWidth={8} />
          <rect x={x - 76} y={2420} width={152} height={406} rx={30} fill="#2bd98c" opacity={0.55} />
          {[0, 1, 2, 3].map((b) => (
            <circle key={b} cx={x - 40 + b * 26} cy={2800 - ((t * (60 + b * 20) + b * 90) % 360)} r={6 + b} fill="#b6ffe0" opacity={0.6} />
          ))}
          <ellipse cx={x} cy={2640} rx={34} ry={70} fill="#0a1f19" opacity={0.75} />
        </g>
      ))}
      <rect x={410} y={2250} width={260} height={64} rx={8} fill="#6d1c1c" />
      <text x={540} y={2296} textAnchor="middle" fontFamily={FONT} fontSize={40} fill="#f3e9e9">SETOR H</text>
      <circle cx={700} cy={2282} r={12} fill={COLORS.red} opacity={0.3 + 0.7 * (Math.sin(t * 6) > 0 ? 1 : 0)} />
      {/* piso gradeado */}
      <rect x={0} y={2880} width={1080} height={120} fill="#0c1715" />
      {Array.from({ length: 28 }, (_, i) => <line key={i} x1={i * 40} y1={2880} x2={i * 40} y2={3000} stroke="#1f3531" strokeWidth={3} />)}
      {/* escada e o vulto que bate no teto */}
      <rect x={470} y={2300} width={10} height={580} fill="#28403b" />
      <rect x={600} y={2300} width={10} height={580} fill="#28403b" />
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={470} y={2340 + i * 62} width={140} height={8} fill="#28403b" />)}
      <ellipse cx={540} cy={2520} rx={230} ry={420} fill="url(#verde)" opacity={0.8} />
      <g transform={`translate(540 ${2398 - soco * 38})`} stroke="#3fe6a0" strokeWidth={5} strokeOpacity={0.55}>
        <rect x={-66} y={400} width={52} height={170} fill="#06110e" />
        <rect x={14} y={400} width={52} height={170} fill="#06110e" />
        <path d="M-70 60 Q-80 -40 0 -60 Q80 -40 70 60 L84 420 L-84 420Z" fill="#06110e" />
        <rect x={38} y={-250} width={44} height={300} rx={22} fill="#06110e" transform="rotate(8 60 50)" />
        <ellipse cx={0} cy={-20} rx={62} ry={72} fill="#06110e" />
        {/* mão pálida fechada, batendo na laje */}
        <circle cx={34} cy={-256} r={34} fill="#c3cec7" stroke="none" />
        {[0, 1, 2, 3].map((d) => <rect key={d} x={8 + d * 14} y={-288} width={11} height={28} rx={5} fill="#aab6af" stroke="none" />)}
      </g>
      {soco > 0.05 &&
        Array.from({ length: 10 }, (_, i) => (
          <circle key={i} cx={480 + i * 14} cy={2056 + (1 - soco) * (80 + (i % 4) * 50)} r={4 + (i % 3) * 2} fill="#9a9c9f" opacity={soco} />
        ))}
    </g>
  );
};
