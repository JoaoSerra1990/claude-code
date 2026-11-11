import { FONT } from "../theme";
import { Ator, type Visual } from "../serie/Ator";

// Cenários de "O Trem das 3h17": a estação abandonada na neblina azul e o
// interior do vagão, dourado, com janelas que mostram outras vidas.

const acaso = (i: number, k: number) => {
  const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return v - Math.floor(v);
};

const Neblina = ({ t, cor = "#9fb6d8", forca = 1 }: { t: number; cor?: string; forca?: number }) => (
  <g>
    {Array.from({ length: 9 }, (_, i) => (
      <ellipse key={i} cx={((t * (18 + i * 5) + i * 260) % 1700) - 300} cy={520 + acaso(i, 1) * 1100}
        rx={360 + acaso(i, 2) * 240} ry={70 + acaso(i, 3) * 60} fill={cor} opacity={(0.1 + acaso(i, 4) * 0.1) * forca} />
    ))}
  </g>
);

/** Relógio de ponteiros parado em 3h17. */
const Relogio317 = ({ cx, cy, r }: { cx: number; cy: number; r: number }) => {
  const h = ((3 + 17 / 60) * 30 - 90) * (Math.PI / 180), m = (17 * 6 - 90) * (Math.PI / 180);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#d8cfb6" stroke="#5a3a22" strokeWidth={r * 0.16} />
      <path d={`M${cx - r * 0.5} ${cy - r * 0.6} q${r * 0.3} ${r * 0.5} -${r * 0.1} ${r * 1.1}`} stroke="#8a5a34" strokeWidth={r * 0.1} fill="none" opacity={0.5} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        return <line key={i} x1={cx + Math.cos(a) * r * 0.74} y1={cy + Math.sin(a) * r * 0.74} x2={cx + Math.cos(a) * r * 0.86} y2={cy + Math.sin(a) * r * 0.86} stroke="#2b211a" strokeWidth={r * 0.05} />;
      })}
      <line x1={cx} y1={cy} x2={cx + Math.cos(h) * r * 0.48} y2={cy + Math.sin(h) * r * 0.48} stroke="#2b211a" strokeWidth={r * 0.1} strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={cx + Math.cos(m) * r * 0.72} y2={cy + Math.sin(m) * r * 0.72} stroke="#2b211a" strokeWidth={r * 0.07} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={r * 0.08} fill="#2b211a" />
    </g>
  );
};

export const RELOGIO_ESTACAO: [number, number] = [770, 360];
export const PORTA_TREM: [number, number] = [470, 1080];

type EstacaoProps = {
  t: number;
  /** Chegada do trem: 0 fora de quadro, 1 parado na plataforma. */
  chegada: number;
  /** Abertura da porta do vagão, de 0 a 1. */
  porta: number;
  /** Presença do trem: 1 sólido, 0 desfeito na neblina. */
  presenca: number;
  /** Quem aparece na janela do trem, olhando para fora. */
  naJanela?: Visual;
};

export const Estacao = ({ t, chegada, porta, presenca, naJanela }: EstacaoProps) => {
  const tx = 1500 - chegada * 1560; // o trem entra pela direita
  const lamp = 0.7 + 0.3 * Math.sin(t * 13) * Math.sin(t * 3.1);
  const [rx, ry] = RELOGIO_ESTACAO;
  return (
    <g>
      <defs>
        <linearGradient id="noiteEstacao" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a1220" />
          <stop offset="1" stopColor="#22344f" />
        </linearGradient>
        <radialGradient id="luzOuro" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffd98a" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="luzFria" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#cfe0ff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#cfe0ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#noiteEstacao)" />
      <circle cx={250} cy={300} r={240} fill="url(#luzFria)" opacity={0.5} />
      <circle cx={250} cy={300} r={60} fill="#dfe8ff" opacity={0.85} />
      {/* árvores e postes ao longe */}
      {[40, 300, 560, 880].map((x, i) => (
        <path key={i} d={`M${x} 1300 L${x} ${760 - i * 20} M${x} ${900 - i * 10} l-50 -70 M${x} ${860} l60 -80 M${x} 820 l-30 -90`} stroke="#0f1a2b" strokeWidth={14} fill="none" strokeLinecap="round" />
      ))}
      <Neblina t={t} forca={0.9} />

      {/* trilhos */}
      <rect x={0} y={1340} width={1080} height={60} fill="#1a2233" />
      <rect x={0} y={1352} width={1080} height={10} fill="#56627a" />
      {Array.from({ length: 14 }, (_, i) => <rect key={i} x={i * 84} y={1366} width={50} height={18} fill="#2a2018" />)}

      {/* o trem */}
      {presenca > 0 && (
        <g transform={`translate(${tx} 0)`} opacity={presenca}>
          {/* farol da locomotiva e fumaça de luz */}
          <circle cx={-10} cy={1010} r={420} fill="url(#luzOuro)" opacity={0.5} />
          {/* locomotiva */}
          <path d="M-20 1340 L-20 900 Q-10 800 90 790 L200 790 L200 1340Z" fill="#14272a" stroke="#0a1416" strokeWidth={8} />
          <circle cx={10} cy={1010} r={44} fill="#fff1c2" stroke="#b8923f" strokeWidth={8} />
          <rect x={90} y={700} width={60} height={100} fill="#14272a" stroke="#0a1416" strokeWidth={8} />
          {/* vagões */}
          {[0, 1].map((v) => {
            const x0 = 210 + v * 1060;
            return (
              <g key={v}>
                <rect x={x0} y={690} width={1040} height={650} rx={18} fill="#1d3a33" stroke="#0a1416" strokeWidth={8} />
                <rect x={x0 - 6} y={660} width={1052} height={46} rx={18} fill="#122622" stroke="#0a1416" strokeWidth={6} />
                <rect x={x0} y={1040} width={1040} height={14} fill="#b8923f" />
                <rect x={x0} y={770} width={1040} height={8} fill="#b8923f" opacity={0.7} />
                {[0, 1, 2, 3].map((i) => {
                  const wx = x0 + 60 + i * 250 + (i > 1 ? 40 : 0);
                  if (v === 0 && i === 1) return null; // aqui fica a porta
                  return (
                    <g key={i}>
                      <rect x={wx} y={800} width={170} height={210} rx={10} fill="#ffcf7a" stroke="#0a1416" strokeWidth={8} />
                      <rect x={wx} y={800} width={170} height={210} rx={10} fill="#fff" opacity={0.08 + 0.06 * Math.sin(t * 2 + i)} />
                      {v === 0 && i === 2 && naJanela && (
                        <g>
                          <clipPath id="janelaTrem"><rect x={wx + 4} y={804} width={162} height={202} rx={8} /></clipPath>
                          <g clipPath="url(#janelaTrem)">
                            <g transform={`translate(${wx + 85} 1260) scale(0.5)`}>
                              <Ator v={naJanela} t={t} expr="triste" olhar={[-0.8, 0.4]} fase={2} />
                            </g>
                          </g>
                        </g>
                      )}
                    </g>
                  );
                })}
                {[150, 480, 810].map((wx, i) => (
                  <g key={i}>
                    <circle cx={x0 + wx} cy={1352} r={44} fill="#0a1416" stroke="#3b4652" strokeWidth={8} />
                    <circle cx={x0 + wx} cy={1352} r={12} fill="#3b4652" />
                  </g>
                ))}
              </g>
            );
          })}
          {/* porta do primeiro vagão: abre para a luz dourada */}
          <rect x={470} y={800} width={160} height={530} fill="#ffd98a" stroke="#0a1416" strokeWidth={8} />
          <circle cx={550} cy={1080} r={260 + porta * 200} fill="url(#luzOuro)" opacity={0.75 * porta} />
          <rect x={470} y={800} width={80 * (1 - porta)} height={530} fill="#173029" stroke="#0a1416" strokeWidth={6} />
          <rect x={630 - 80 * (1 - porta)} y={800} width={80 * (1 - porta)} height={530} fill="#173029" stroke="#0a1416" strokeWidth={6} />
          {porta > 0.2 && <polygon points="470,1330 630,1330 760,1700 340,1700" fill="url(#luzOuro)" opacity={0.6 * porta} />}
        </g>
      )}

      {/* plataforma */}
      <rect x={0} y={1400} width={1080} height={520} fill="#2b3444" />
      <rect x={0} y={1400} width={1080} height={26} fill="#3f4a5e" />
      <rect x={0} y={1440} width={1080} height={16} fill="#b59a3c" opacity={0.45} />
      {Array.from({ length: 6 }, (_, r) =>
        Array.from({ length: 7 }, (_, c) => (
          <rect key={`${r}-${c}`} x={c * 170 - (r % 2) * 85} y={1470 + r * 78} width={162} height={70} fill={(r + c) % 3 ? "#303a4b" : "#36415480"} stroke="#222a38" strokeWidth={3} />
        )),
      )}
      <path d="M120 1500 l60 40 l-20 60 l70 50" stroke="#151b26" strokeWidth={6} fill="none" />
      <path d="M800 1620 l-50 30 l30 70" stroke="#151b26" strokeWidth={6} fill="none" />
      {[[60, 1470], [990, 1500], [520, 1900]].map(([x, y], i) => (
        <path key={i} d="M0 0 q-8 -26 0 -44 M0 0 q12 -20 8 -40 M0 0 q-18 -14 -20 -30" transform={`translate(${x} ${y})`} stroke="#3f6b3a" strokeWidth={6} fill="none" strokeLinecap="round" />
      ))}
      <ellipse cx={760} cy={1760} rx={170} ry={24} fill="#8fb0d8" opacity={0.16} />
      {/* banco enferrujado */}
      <rect x={40} y={1560} width={260} height={22} fill="#5a3a22" />
      <rect x={40} y={1480} width={260} height={18} fill="#5a3a22" />
      <rect x={60} y={1480} width={14} height={170} fill="#3b2a1b" />
      <rect x={266} y={1480} width={14} height={170} fill="#3b2a1b" />

      {/* cobertura quebrada, placa e relógio */}
      <rect x={0} y={0} width={1080} height={150} fill="#0c121d" />
      <path d="M0 150 L1080 150 L1080 200 L700 210 L640 260 L610 200 L0 190Z" fill="#141c2b" />
      {[120, 420, 900].map((x) => <rect key={x} x={x} y={150} width={26} height={1250} fill="#101825" />)}
      <path d="M300 190 l-30 150 M340 190 l10 110" stroke="#1c2536" strokeWidth={14} />
      <line x1={210} y1={190} x2={210} y2={300} stroke="#0c121d" strokeWidth={6} />
      <line x1={470} y1={190} x2={470} y2={300} stroke="#0c121d" strokeWidth={6} />
      <rect x={170} y={300} width={350} height={100} rx={8} fill="#24384d" stroke="#0c121d" strokeWidth={8} transform="rotate(-3 345 350)" />
      <text x={345} y={372} textAnchor="middle" fontFamily={FONT} fontSize={62} fill="#c9d3e2" opacity={0.75} transform="rotate(-3 345 350)" letterSpacing={6}>EST ÇÃO</text>
      <line x1={rx} y1={200} x2={rx} y2={ry - 96} stroke="#0c121d" strokeWidth={8} />
      <Relogio317 cx={rx} cy={ry} r={96} />
      {/* poste de luz piscando */}
      <rect x={980} y={900} width={14} height={520} fill="#101825" />
      <circle cx={987} cy={880} r={150} fill="url(#luzFria)" opacity={0.55 * lamp} />
      <rect x={966} y={850} width={42} height={52} rx={10} fill="#dfe8ff" opacity={0.3 + 0.7 * lamp} />
      <Neblina t={t + 40} forca={0.7} />
    </g>
  );
};

// ---------- interior do vagão ----------
export type Vista = "neblina" | "cidade" | "vidas";
export const JANELAS: [number, number][] = [[200, 760], [540, 760], [880, 760]];
const JW = 280, JH = 480;

type Vidas = { clara: Visual; miguel: Visual };

const Vinheta = ({ tipo, t, v }: { tipo: "medica" | "mae" | "viajante" | "juntos"; t: number; v: Vidas }) => {
  // Cada vinheta é desenhada num quadro de JW x JH, com origem no canto superior esquerdo.
  const chao = JH + 150;
  switch (tipo) {
    case "medica":
      return (
        <g>
          <rect width={JW} height={JH} fill="#dff1f2" />
          <rect x={20} y={40} width={90} height={120} fill="#fff" stroke="#9cc7cc" strokeWidth={6} />
          <path d="M65 70 v60 M35 100 h60" stroke="#d6453d" strokeWidth={14} />
          <rect x={0} y={JH - 110} width={JW} height={110} fill="#b9dfe2" />
          <g transform={`translate(${JW / 2 + 20} ${chao}) scale(0.5)`}>
            <Ator v={{ ...v.clara, roupa: "#f4f7f8", casaco: true, detalhe: "#7fc8d0", estilo: "coque" }} t={t} expr="feliz" fase={1} />
          </g>
        </g>
      );
    case "mae":
      return (
        <g>
          <rect width={JW} height={JH} fill="#f7dcc0" />
          <circle cx={210} cy={90} r={46} fill="#ffe9a8" />
          <rect x={0} y={JH - 110} width={JW} height={110} fill="#d9a56a" />
          <g transform={`translate(${JW / 2} ${chao}) scale(0.5)`}>
            <Ator v={{ ...v.clara, roupa: "#e9b44c" }} t={t} expr="feliz" pose="abracar" olhar={[0, 1]} fase={2} />
          </g>
          <ellipse cx={JW / 2} cy={JH - 100} rx={46} ry={30} fill="#f4f1ea" stroke="#c9b79a" strokeWidth={5} />
          <circle cx={JW / 2 - 30} cy={JH - 106} r={18} fill={v.clara.pele} />
        </g>
      );
    case "viajante":
      return (
        <g>
          <rect width={JW} height={JH} fill="#bfe3f2" />
          <path d={`M0 ${JH - 120} L80 180 L150 300 L210 150 L${JW} ${JH - 160} L${JW} ${JH} L0 ${JH}Z`} fill="#6f9a8a" />
          <path d="M60 220 L80 180 L100 220Z M190 190 L210 150 L232 196Z" fill="#fff" />
          <rect x={0} y={JH - 90} width={JW} height={90} fill="#8ab17d" />
          <g transform={`translate(${JW / 2 - 10} ${chao}) scale(0.5)`}>
            <Ator v={{ ...v.clara, roupa: "#d16b3f", mochila: "#3f6b3a", estilo: "rabo" }} t={t} expr="feliz" pose="apontarCima" fase={3} />
          </g>
        </g>
      );
    default:
      return (
        <g>
          <rect width={JW} height={JH} fill="#f3d9a4" />
          <rect x={150} y={50} width={100} height={130} fill="#fff6d6" stroke="#8a5a34" strokeWidth={8} />
          <rect x={0} y={JH - 100} width={JW} height={100} fill="#c98c4f" />
          <g transform={`translate(${JW / 2 - 62} ${chao}) scale(0.46)`}>
            <Ator v={v.clara} t={t} expr="feliz" olhar={[1, 0]} fase={4} />
          </g>
          <g transform={`translate(${JW / 2 + 66} ${chao}) scale(0.48)`}>
            <Ator v={v.miguel} t={t} expr="feliz" olhar={[-1, 0]} fase={5} />
          </g>
        </g>
      );
  }
};

type VagaoProps = {
  t: number;
  /** Quanto as luzes do vagão piscam, de 0 (estáveis) a 1. */
  pisca: number;
  vista: Vista;
  /** Transição luminosa das janelas, de 0 a 1. */
  brilho: number;
  /** Na vista "vidas", a janela do centro passa a mostrar os dois irmãos juntos. */
  juntos: boolean;
  vidas: Vidas;
};

export const Vagao = ({ t, pisca, vista, brilho, juntos, vidas }: VagaoProps) => {
  const luz = 1 - pisca * (Math.sin(t * 27) * Math.sin(t * 6.3) > 0.2 ? 0.75 : 0);
  return (
    <g>
      <defs>
        <linearGradient id="paredeVagao" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7a4a2c" />
          <stop offset="1" stopColor="#5a3420" />
        </linearGradient>
        <radialGradient id="lampada" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffe2a0" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffe2a0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="futuro" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a1247" />
          <stop offset="1" stopColor="#5b3d8f" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#paredeVagao)" />
      {/* teto abobadado e lâmpadas */}
      <path d="M0 0 L1080 0 L1080 330 Q540 230 0 330Z" fill="#e9d5a8" />
      <path d="M0 330 Q540 230 1080 330 L1080 360 Q540 262 0 360Z" fill="#b8923f" />
      {[200, 540, 880].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={330} r={300} fill="url(#lampada)" opacity={0.65 * luz} />
          <rect x={x - 6} y={250} width={12} height={50} fill="#8b6a1f" />
          <path d={`M${x - 46} 300 Q${x} 380 ${x + 46} 300Z`} fill="#fff1c2" opacity={0.25 + 0.75 * luz} stroke="#8b6a1f" strokeWidth={5} />
        </g>
      ))}
      {/* bagageiro */}
      <rect x={0} y={440} width={1080} height={16} fill="#b8923f" />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={i * 96 + 20} y1={456} x2={i * 96 + 50} y2={500} stroke="#b8923f" strokeWidth={5} />)}
      <rect x={0} y={498} width={1080} height={8} fill="#8b6a1f" />
      <rect x={90} y={380} width={150} height={62} rx={14} fill="#6b3f26" stroke="#3b2414" strokeWidth={6} />

      {/* janelas */}
      {JANELAS.map(([cx, cy], i) => {
        const x = cx - JW / 2, y = cy - JH / 2;
        const tipo = (["medica", juntos ? "juntos" : "mae", "viajante"] as const)[i];
        return (
          <g key={i}>
            <rect x={x - 16} y={y - 16} width={JW + 32} height={JH + 32} rx={18} fill="#3b2414" />
            <clipPath id={`vidro${i}`}><rect x={x} y={y} width={JW} height={JH} rx={10} /></clipPath>
            <g clipPath={`url(#vidro${i})`}>
              {vista === "neblina" && (
                <g>
                  <rect x={x} y={y} width={JW} height={JH} fill="#16233a" />
                  {[0, 1, 2].map((k) => (
                    <ellipse key={k} cx={x + ((t * (60 + k * 30) + k * 140 + i * 90) % (JW + 300)) - 150} cy={y + 120 + k * 130} rx={170} ry={46} fill="#9fb6d8" opacity={0.25} />
                  ))}
                </g>
              )}
              {vista === "cidade" && (
                <g>
                  <rect x={x} y={y} width={JW} height={JH} fill="url(#futuro)" />
                  {Array.from({ length: 7 }, (_, k) => {
                    const bx = x + ((k * 70 + i * 33 - t * 26) % (JW + 140) + JW + 140) % (JW + 140) - 70;
                    const bh = 190 + acaso(k + i * 7, 5) * 200;
                    return (
                      <g key={k}>
                        <path d={`M${bx} ${y + JH - 90} L${bx} ${y + JH - 90 - bh} L${bx + 22} ${y + JH - 120 - bh} L${bx + 44} ${y + JH - 90 - bh} L${bx + 44} ${y + JH - 90}Z`} fill="#2a2a6a" stroke="#7ef0ff" strokeWidth={2} />
                        {Array.from({ length: 6 }, (_, w) => <rect key={w} x={bx + 10} y={y + JH - 110 - bh + 24 + w * 28} width={24} height={8} fill="#7ef0ff" opacity={0.75} />)}
                      </g>
                    );
                  })}
                  <rect x={x} y={y + JH - 90} width={JW} height={90} fill="#201a45" />
                  <rect x={x} y={y + JH - 52} width={JW} height={5} fill="#7ef0ff" opacity={0.5} />
                  {/* carros sem motorista: a cabine está vazia */}
                  {[0, 1].map((k) => {
                    const px = x + ((t * (110 + k * 40) + k * 190 + i * 60) % (JW + 160)) - 80;
                    return (
                      <g key={k} transform={`translate(${px} ${y + JH - 62 - k * 4})`}>
                        <path d="M-56 16 Q-56 -20 -22 -24 L26 -24 Q56 -18 58 16Z" fill="#e9eef5" stroke="#1a1247" strokeWidth={4} />
                        <path d="M-30 -18 L22 -18 Q38 -12 40 2 L-38 2 Q-38 -12 -30 -18Z" fill="#9fdcf0" />
                        <circle cx={-30} cy={18} r={10} fill="#1a1247" /><circle cx={32} cy={18} r={10} fill="#1a1247" />
                        <rect x={-58} y={8} width={116} height={4} fill="#7ef0ff" />
                      </g>
                    );
                  })}
                </g>
              )}
              {vista === "vidas" && (
                <g transform={`translate(${x} ${y})`}><Vinheta tipo={tipo} t={t} v={vidas} /></g>
              )}
              <path d={`M${x + 14} ${y + 10} L${x + 90} ${y + 10} L${x + 34} ${y + JH - 10} L${x + 8} ${y + JH - 10}Z`} fill="#fff" opacity={0.1} />
              {brilho > 0 && <rect x={x} y={y} width={JW} height={JH} fill="#fff3c8" opacity={brilho} />}
            </g>
            {brilho > 0 && <circle cx={cx} cy={cy} r={300} fill="url(#lampada)" opacity={brilho * 0.8} />}
            <rect x={x - 22} y={y + JH + 14} width={JW + 44} height={20} rx={6} fill="#b8923f" />
          </g>
        );
      })}

      {/* lambri e piso */}
      <rect x={0} y={1040} width={1080} height={14} fill="#b8923f" />
      <rect x={0} y={1054} width={1080} height={460} fill="#4a2a18" />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={i * 96} y1={1054} x2={i * 96} y2={1514} stroke="#3b2012" strokeWidth={4} />)}
      <rect x={0} y={1514} width={1080} height={406} fill="#3a2418" />
      <polygon points="330,1514 750,1514 900,1920 180,1920" fill="#7a2a2a" />
      <polygon points="350,1514 730,1514 866,1920 214,1920" fill="none" stroke="#b8923f" strokeWidth={6} />
      {Array.from({ length: 5 }, (_, i) => <line key={i} x1={0} y1={1570 + i * 80} x2={1080} y2={1570 + i * 80} stroke="#2b1a10" strokeWidth={4} opacity={0.5} />)}
      <rect width={1080} height={1920} fill="#000" opacity={(1 - luz) * 0.55} />
    </g>
  );
};

/** Banco do vagão, desenhado à frente de quem está sentado. */
export const Banco = ({ x }: { x: number }) => (
  <g>
    <rect x={x - 150} y={1250} width={300} height={250} rx={26} fill="#2f5a45" stroke="#17301f" strokeWidth={8} />
    {[0, 1, 2].map((i) => <circle key={i} cx={x - 80 + i * 80} cy={1330} r={9} fill="#b8923f" />)}
    {[0, 1, 2].map((i) => <circle key={i} cx={x - 80 + i * 80} cy={1420} r={9} fill="#b8923f" />)}
    <rect x={x - 170} y={1490} width={340} height={56} rx={16} fill="#3a6b52" stroke="#17301f" strokeWidth={8} />
    <rect x={x - 150} y={1546} width={22} height={90} fill="#3b2414" />
    <rect x={x + 128} y={1546} width={22} height={90} fill="#3b2414" />
    <rect x={x - 176} y={1230} width={26} height={320} rx={10} fill="#6b3f26" stroke="#3b2414" strokeWidth={6} />
    <rect x={x + 150} y={1230} width={26} height={320} rx={10} fill="#6b3f26" stroke="#3b2414" strokeWidth={6} />
  </g>
);
