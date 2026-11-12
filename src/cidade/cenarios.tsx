import { FONT } from "../theme";
import { Ator, type Visual } from "../serie/Ator";

// Cenários de "A Cidade Sem Amanhã": a praça de Santa Aurora com a torre do
// relógio, a casa de Elisa, o corredor e a sala subterrânea com a máquina.

const acaso = (i: number, k: number) => {
  const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return v - Math.floor(v);
};

const Ponteiros = ({ cx, cy, r, tempo, cor = "#2b211a" }: { cx: number; cy: number; r: number; tempo: number; cor?: string }) => {
  const p = (ang: number, k: number) => [cx + Math.cos((ang * Math.PI) / 180) * r * k, cy + Math.sin((ang * Math.PI) / 180) * r * k];
  const [hx, hy] = p((tempo / 720) * 6 - 90, 0.5), [mx, my] = p((tempo / 60) * 6 - 90, 0.76);
  return (
    <g strokeLinecap="round">
      {Array.from({ length: 12 }, (_, i) => {
        const [x1, y1] = p(i * 30, 0.8), [x2, y2] = p(i * 30, 0.92);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={cor} strokeWidth={r * 0.05} />;
      })}
      <line x1={cx} y1={cy} x2={hx} y2={hy} stroke={cor} strokeWidth={r * 0.1} />
      <line x1={cx} y1={cy} x2={mx} y2={my} stroke={cor} strokeWidth={r * 0.06} />
      <circle cx={cx} cy={cy} r={r * 0.07} fill={cor} />
    </g>
  );
};

export const RELOGIO_TORRE: [number, number] = [540, 430];
export const ALCAPAO: [number, number] = [540, 1440];
export const POCA: [number, number] = [300, 1700];

type PracaProps = {
  t: number;
  /** Tempo mostrado pelo relógio da torre, em segundos de relógio. */
  tRelogio: number;
  noite?: boolean;
  /** Tempestade ameaçando a cidade, de 0 a 1. */
  tempestade?: number;
  /** Abertura do alçapão na base da torre, de 0 a 1. */
  alcapao?: number;
  /** Mostra o dia se repetindo (ônibus, pedestres e chuva voltam ao início). */
  repete?: boolean;
  chuva?: boolean;
};

const CASAS = ["#f1d9b0", "#e9b9a0", "#cfe0e8", "#d8e2c4", "#f2ede2", "#e7c7d8"];

export const Praca = ({ t, tRelogio, noite = false, tempestade = 0, alcapao = 0, repete = false, chuva = true }: PracaProps) => {
  const [rx, ry] = RELOGIO_TORRE;
  // O dia se repete num ciclo curto: perto do fim, tudo volta depressa ao começo.
  const ciclo = 5.2;
  const fase = (t % ciclo) / ciclo;
  const volta = repete && fase > 0.9;
  const prog = repete ? (fase < 0.9 ? fase / 0.9 : 1 - (fase - 0.9) / 0.1) : (t * 0.12) % 1;
  const onibusX = 1300 - prog * 1750;
  const relampago = tempestade > 0 && Math.sin(t * 5.3) * Math.sin(t * 2.1) > 0.45 ? 1 : 0;
  return (
    <g>
      <defs>
        <linearGradient id="ceuPraca" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={noite ? "#0b1024" : "#f3a77a"} />
          <stop offset="1" stopColor={noite ? "#28304f" : "#fde3b8"} />
        </linearGradient>
        <radialGradient id="ambar" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffc66e" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ffc66e" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#ceuPraca)" />
      {!noite && <circle cx={860} cy={640} r={90} fill="#fff1c2" opacity={0.9} />}
      {noite && Array.from({ length: 40 }, (_, i) => <circle key={i} cx={acaso(i, 1) * 1080} cy={acaso(i, 2) * 600} r={1.5 + (i % 3)} fill="#fff" opacity={0.6} />)}
      {/* nuvens; viram tempestade */}
      {Array.from({ length: 5 }, (_, i) => (
        <ellipse key={i} cx={((t * (10 + i * 4) + i * 300) % 1500) - 200} cy={160 + i * 90} rx={260} ry={60}
          fill={tempestade > 0 ? "#2a2f3d" : noite ? "#1a2038" : "#fff6ea"} opacity={tempestade > 0 ? 0.6 + tempestade * 0.4 : 0.7} />
      ))}
      {tempestade > 0 && <rect width={1080} height={1300} fill="#1b2030" opacity={tempestade * 0.55} />}
      {relampago > 0 && (
        <g>
          <rect width={1080} height={1920} fill="#e9f0ff" opacity={0.35} />
          <path d="M820 0 L770 220 L830 230 L760 470" stroke="#fff" strokeWidth={10} fill="none" />
        </g>
      )}
      {/* casas coloniais dos dois lados */}
      {[[-20, 760, 260], [220, 820, 200], [700, 800, 200], [880, 740, 240]].map(([x, y, w], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={1340 - (y as number)} fill={CASAS[i]} stroke="#2b211a" strokeWidth={5} />
          <path d={`M${(x as number) - 16} ${y} L${(x as number) + (w as number) / 2} ${(y as number) - 80} L${(x as number) + (w as number) + 16} ${y}Z`} fill="#a8432e" stroke="#2b211a" strokeWidth={5} />
          {[0, 1].map((r) =>
            [0, 1].map((k) => (
              <rect key={`${r}${k}`} x={(x as number) + 30 + k * ((w as number) / 2 - 10)} y={(y as number) + 50 + r * 190} width={60} height={96}
                fill={noite && (i + r + k) % 2 === 0 ? "#ffcf7a" : "#4f6b7d"} stroke="#2b211a" strokeWidth={4} />
            )),
          )}
        </g>
      ))}
      {/* torre do relógio */}
      <path d={`M${rx - 70} 200 L${rx} 70 L${rx + 70} 200Z`} fill="#6b3f26" stroke="#2b211a" strokeWidth={6} />
      <rect x={rx - 100} y={200} width={200} height={1110} fill="#d8c9a8" stroke="#2b211a" strokeWidth={6} />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={rx - 100} x2={rx + 100} y1={600 + i * 60} y2={600 + i * 60} stroke="#b9a988" strokeWidth={3} />)}
      {noite && <circle cx={rx} cy={ry} r={260} fill="url(#ambar)" />}
      <circle cx={rx} cy={ry} r={124} fill="#5a3a22" />
      <circle cx={rx} cy={ry} r={110} fill={noite ? "#ffe3a8" : "#f4ecd6"} />
      <Ponteiros cx={rx} cy={ry} r={104} tempo={tRelogio} />
      <rect x={rx - 46} y={1150} width={92} height={160} rx={46} fill="#3b2a1b" />
      <rect x={rx - 130} y={1290} width={260} height={40} fill="#b9a988" stroke="#2b211a" strokeWidth={5} />
      {/* praça de pedra */}
      <rect x={0} y={1330} width={1080} height={590} fill={noite ? "#3b3f4f" : "#a99c86"} />
      {Array.from({ length: 8 }, (_, r) =>
        Array.from({ length: 12 }, (_, c) => (
          <rect key={`${r}-${c}`} x={c * 96 - (r % 2) * 48} y={1340 + r * 74} width={88} height={64} rx={14} fill={noite ? "#454a5c" : "#b8ab93"} opacity={0.8} />
        )),
      )}
      {/* alçapão escondido diante da torre */}
      <g>
        <rect x={ALCAPAO[0] - 90} y={ALCAPAO[1] - 34} width={180} height={68} fill="#0a0806" />
        {alcapao > 0 && <rect x={ALCAPAO[0] - 90} y={ALCAPAO[1] - 34} width={180} height={68} fill="#ffc66e" opacity={0.25 * alcapao} />}
        <g transform={`translate(0 ${-alcapao * 110}) scale(1 ${1 - alcapao * 0.7})`} style={{ transformOrigin: `${ALCAPAO[0]}px ${ALCAPAO[1] - 34}px` }}>
          <rect x={ALCAPAO[0] - 90} y={ALCAPAO[1] - 34} width={180} height={68} fill="#5a5148" stroke="#2b211a" strokeWidth={5} />
          <rect x={ALCAPAO[0] - 20} y={ALCAPAO[1] - 6} width={40} height={12} rx={6} fill="#2b211a" />
        </g>
      </g>
      {/* rua com o ônibus que passa sempre no mesmo horário */}
      <rect x={0} y={1360} width={1080} height={130} fill={noite ? "#2b2f3c" : "#6d6a64"} opacity={0.85} />
      {!noite && (
        <g transform={`translate(${onibusX} 1440)`} opacity={volta ? 0.55 : 1}>
          {volta && [1, 2, 3].map((k) => <rect key={k} x={-200 + k * 90} y={-150} width={400} height={160} rx={20} fill="#e9b730" opacity={0.15} />)}
          <rect x={-200} y={-150} width={400} height={160} rx={20} fill="#e9b730" stroke="#2b211a" strokeWidth={6} />
          {[0, 1, 2, 3].map((k) => <rect key={k} x={-180 + k * 90} y={-130} width={70} height={60} fill="#5b7f95" />)}
          <circle cx={-120} cy={14} r={28} fill="#1c1c1c" /><circle cx={120} cy={14} r={28} fill="#1c1c1c" />
        </g>
      )}
      {/* pedestres que repetem os mesmos passos */}
      {!noite &&
        [0, 1, 2].map((i) => {
          const pp = repete ? prog : ((t * 0.08 + i * 0.33) % 1);
          const x = 100 + ((pp * 800 + i * 280) % 900);
          return (
            <g key={i} transform={`translate(${x} ${1560 + i * 40}) scale(0.24)`} opacity={volta ? 0.5 : 1}>
              <Ator v={{ pele: ["#edc09c", "#c68a5e", "#f1cbb0"][i], cabelo: "#2e211b", roupa: ["#5b8def", "#8ab17d", "#d16ba5"][i], calca: "#3a4a63", estilo: (["curto", "rabo", "coque"] as const)[i] }}
                t={t} expr="sereno" andando fase={i * 2} />
              <path d="M-150 -840 Q0 -960 150 -840Z" fill={["#2b3a46", "#a8432e", "#2a9d8f"][i]} />
              <line x1={0} y1={-860} x2={0} y2={-560} stroke="#2b211a" strokeWidth={10} />
            </g>
          );
        })}
      {/* poça onde as gotas caem sempre no mesmo lugar */}
      <ellipse cx={POCA[0]} cy={POCA[1]} rx={170} ry={44} fill="#7f97a8" opacity={0.55} />
      {chuva && !noite &&
        [0, 1, 2, 3].map((k) => {
          const q = ((t / (repete ? 1.3 : 1.1) + k * 0.25) % 1);
          return <ellipse key={k} cx={POCA[0] - 90 + k * 60} cy={POCA[1] - 6 + (k % 2) * 10} rx={10 + q * 60} ry={3 + q * 14} fill="none" stroke="#eaf3fa" strokeWidth={3} opacity={1 - q} />;
        })}
      {/* temporal */}
      {tempestade > 0 &&
        Array.from({ length: 140 }, (_, i) => {
          const x = acaso(i, 13) * 1100, y = ((acaso(i, 14) * 1920 + t * 1700) % 2000) - 40;
          return <line key={`tp${i}`} x1={x} y1={y} x2={x - 26} y2={y + 60} stroke="#b9cde8" strokeWidth={3} opacity={0.5 * tempestade} />;
        })}
      {/* chuva fina */}
      {chuva && tempestade === 0 &&
        Array.from({ length: 70 }, (_, i) => {
          const x = acaso(i, 3) * 1080;
          const y = ((acaso(i, 4) * 1920 + (repete ? (t % ciclo) : t) * 900) % 2000) - 40;
          return <line key={i} x1={x} y1={y} x2={x - 6} y2={y + 34} stroke={noite ? "#9fb6d8" : "#eef4fa"} strokeWidth={3} opacity={0.4} />;
        })}
    </g>
  );
};

// ---------- a casa de Elisa ----------
export const PORTA_CASA: [number, number] = [920, 1300];

export const Casa = ({ t, envelope }: { t: number; envelope: number }) => (
  <g>
    <rect width={1080} height={1920} fill="#f0dcc0" />
    {Array.from({ length: 9 }, (_, i) => <line key={i} x1={i * 130} y1={0} x2={i * 130} y2={1400} stroke="#e6cfae" strokeWidth={4} />)}
    <rect x={0} y={1400} width={1080} height={520} fill="#a9774e" />
    {Array.from({ length: 6 }, (_, i) => <line key={i} x1={0} x2={1080} y1={1440 + i * 90} y2={1440 + i * 90} stroke="#8f6340" strokeWidth={4} />)}
    {/* janela com a mesma chuva */}
    <rect x={90} y={300} width={360} height={440} fill="#9fbad0" stroke="#7a5236" strokeWidth={16} />
    <line x1={270} y1={300} x2={270} y2={740} stroke="#7a5236" strokeWidth={10} />
    {Array.from({ length: 14 }, (_, i) => {
      const x = 110 + acaso(i, 7) * 320, y = 310 + ((acaso(i, 8) * 420 + t * 300) % 420);
      return <line key={i} x1={x} y1={y} x2={x - 4} y2={y + 24} stroke="#eef4fa" strokeWidth={3} opacity={0.6} />;
    })}
    {/* quadros, estante e mesa */}
    <rect x={540} y={360} width={170} height={130} fill="#fff" stroke="#7a5236" strokeWidth={8} />
    <circle cx={590} cy={420} r={22} fill="#e9b730" /><circle cx={650} cy={430} r={26} fill="#5b7f95" />
    <rect x={540} y={560} width={220} height={240} fill="#8f6340" />
    {[0, 1, 2].map((r) => <rect key={r} x={540} y={620 + r * 70} width={220} height={10} fill="#6b4a30" />)}
    {[0, 1, 2, 3, 4].map((k) => <rect key={k} x={556 + k * 38} y={580} width={26} height={40} fill={["#a8432e", "#2a9d8f", "#e9c46a", "#5b8def", "#d16ba5"][k]} />)}
    <rect x={120} y={1180} width={420} height={30} fill="#7a5236" />
    <rect x={140} y={1210} width={18} height={200} fill="#5a3a22" /><rect x={500} y={1210} width={18} height={200} fill="#5a3a22" />
    <rect x={200} y={1140} width={60} height={40} rx={8} fill="#fff" /><rect x={380} y={1150} width={90} height={30} rx={8} fill="#e9b730" />
    {/* a porta da frente, com o envelope surgindo por baixo */}
    <rect x={PORTA_CASA[0] - 110} y={760} width={220} height={640} fill="#7a4a2c" stroke="#4a2a18" strokeWidth={10} />
    <rect x={PORTA_CASA[0] - 80} y={800} width={160} height={240} fill="#8a5a3a" />
    <rect x={PORTA_CASA[0] - 80} y={1080} width={160} height={260} fill="#8a5a3a" />
    <circle cx={PORTA_CASA[0] - 80} cy={1090} r={12} fill="#d9b25e" />
    {envelope > 0 && (
      <g transform={`translate(${1060 - envelope * 230} 1418)`}>
        <rect x={-70} y={-10} width={140} height={40} fill="#f4ecd6" stroke="#8a7a5a" strokeWidth={4} />
        <path d="M-70 -10 L0 16 L70 -10" fill="none" stroke="#8a7a5a" strokeWidth={4} />
      </g>
    )}
  </g>
);

// ---------- corredor subterrâneo ----------
export const Corredor = ({ t }: { t: number }) => {
  const pisca = (i: number) => (Math.sin(t * (13 + i * 3)) * Math.sin(t * (4.1 + i)) > 0.35 ? 0.25 : 1);
  return (
    <g>
      <rect width={1080} height={1920} fill="#1c1712" />
      <polygon points="0,0 1080,0 760,700 320,700" fill="#2a221a" />
      <polygon points="0,1920 1080,1920 760,1220 320,1220" fill="#3a2f24" />
      <polygon points="0,0 320,700 320,1220 0,1920" fill="#2f271e" />
      <polygon points="1080,0 760,700 760,1220 1080,1920" fill="#2f271e" />
      <rect x={320} y={700} width={440} height={520} fill="#0d0a07" />
      {/* fotos já começando nas paredes */}
      {[0, 1, 2].map((i) => {
        const k = 1 - i * 0.28;
        return (
          <g key={i}>
            <rect x={40 + i * 100} y={760 - k * 80} width={110 * k} height={140 * k} fill="#d8c9a8" stroke="#3b2a1b" strokeWidth={5} />
            <rect x={1040 - i * 100 - 110 * k} y={760 - k * 80} width={110 * k} height={140 * k} fill="#d8c9a8" stroke="#3b2a1b" strokeWidth={5} />
          </g>
        );
      })}
      {/* lâmpadas que piscam */}
      {[[540, 120, 1.2], [540, 420, 0.8], [540, 620, 0.5]].map(([x, y, s], i) => (
        <g key={i} opacity={pisca(i)}>
          <circle cx={x} cy={y + 40 * (s as number)} r={300 * (s as number)} fill="#ffc66e" opacity={0.18} />
          <line x1={x} y1={0} x2={x} y2={y} stroke="#0d0a07" strokeWidth={4} />
          <circle cx={x} cy={(y as number) + 20 * (s as number)} r={20 * (s as number)} fill="#ffe3a8" />
        </g>
      ))}
      {Array.from({ length: 50 }, (_, i) => (
        <circle key={i} cx={260 + acaso(i, 9) * 560} cy={((acaso(i, 10) * 1700 + t * (20 + (i % 4) * 8)) % 1700) + 100} r={1.5 + (i % 3)} fill="#ffe3a8" opacity={0.3} />
      ))}
    </g>
  );
};

// ---------- sala subterrânea com a máquina ----------
export const ALAVANCA: [number, number] = [880, 1420];
export const FOTO_PAINEL: [number, number] = [700, 1380];
export const MESMA_IDADE: [number, number] = [190, 760];

type SubsoloProps = {
  t: number;
  /** Luzes da máquina em vermelho (alarme). */
  alarme: number;
  /** Desligamento: luzes apagando em sequência e engrenagens parando, de 0 a 1. */
  desliga: number;
  /** Alavanca: 0 em cima, 1 puxada. */
  alavanca: number;
  /** Mostra a última fotografia sobre o painel. */
  foto: boolean;
};

export const Subsolo = ({ t, alarme, desliga, alavanca, foto }: SubsoloProps) => {
  const giro = t * 18 * (1 - desliga) + (desliga > 0 ? 0 : 0);
  const cor = alarme > 0.5 ? "#ff4a3a" : "#ffc66e";
  const aneis = 5;
  const anos = [1952, 1961, 1974, 1983, 1990, 1998, 2004, 2011, 1968, 1977, 1986, 2015];
  return (
    <g>
      <defs>
        <radialGradient id="nucleo" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={cor} stopOpacity="0.9" />
          <stop offset="1" stopColor={cor} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="#17120d" />
      {Array.from({ length: 16 }, (_, r) => <line key={r} x1={0} x2={1080} y1={r * 120} y2={r * 120} stroke="#211a13" strokeWidth={4} />)}
      {/* parede de fotografias */}
      {Array.from({ length: 4 }, (_, r) =>
        Array.from({ length: 3 }, (_, c) => {
          const i = r * 3 + c;
          const x = 40 + c * 130, y = 520 + r * 180;
          const pessoa: Visual = { pele: ["#edc09c", "#c68a5e", "#f1cbb0", "#d9a074"][i % 4], cabelo: ["#2e211b", "#6b4428", "#b98a4a"][i % 3], roupa: ["#8a7a5a", "#5b6d8f", "#7a5236"][i % 3], calca: "#3a3f4d", estilo: (["curto", "coque", "rabo", "baguncado"] as const)[i % 4] };
          // As duas primeiras fotos mostram a mesma moradora, com 46 anos de diferença.
          const p = i < 2 ? { pele: "#f1cbb0", cabelo: "#6b4428", roupa: "#a8432e", calca: "#3a3f4d", estilo: "coque" as const } : pessoa;
          return (
            <g key={i} transform={`rotate(${(acaso(i, 11) - 0.5) * 8} ${x + 55} ${y + 70})`}>
              <rect x={x} y={y} width={110} height={150} fill="#e9dcc0" stroke="#3b2a1b" strokeWidth={5} />
              <rect x={x + 10} y={y + 10} width={90} height={100} fill="#b9a27c" />
              <clipPath id={`foto${i}`}><rect x={x + 10} y={y + 10} width={90} height={100} /></clipPath>
              <g clipPath={`url(#foto${i})`}><g transform={`translate(${x + 55} ${y + 230}) scale(0.22)`}><Ator v={p} t={0} expr="sereno" fase={i} /></g></g>
              <rect x={x + 10} y={y + 10} width={90} height={100} fill="#8a6a3a" opacity={0.3} />
              <text x={x + 55} y={y + 138} textAnchor="middle" fontFamily={FONT} fontSize={24} fill="#3b2a1b">{i < 2 ? (i === 0 ? 1952 : 1998) : anos[i]}</text>
            </g>
          );
        }),
      )}
      {/* a máquina */}
      <g transform="translate(640 980)">
        <circle r={520} fill="url(#nucleo)" opacity={0.45 * (1 - desliga)} />
        {[[0, 0, 330, 24], [-260, -300, 150, 14], [250, 330, 170, -18]].map(([x, y, r, v], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${giro * (v as number) / 18})`}>
            {Array.from({ length: 16 }, (_, k) => (
              <rect key={k} x={-18} y={-(r as number) - 30} width={36} height={60} fill="#6b5232" transform={`rotate(${k * 22.5})`} />
            ))}
            <circle r={r as number} fill="#4a3826" stroke="#2b211a" strokeWidth={8} />
            <circle r={(r as number) * 0.55} fill="#3a2c1e" />
            {[0, 1, 2, 3].map((k) => <rect key={k} x={-8} y={-(r as number) * 0.9} width={16} height={(r as number) * 0.8} fill="#2b211a" transform={`rotate(${k * 45})`} />)}
          </g>
        ))}
        {Array.from({ length: aneis }, (_, i) => {
          const aceso = desliga < 1 - i / aneis;
          return <ellipse key={i} cx={0} cy={0} rx={120 + i * 70} ry={40 + i * 22} fill="none" stroke={cor} strokeWidth={8} opacity={aceso ? 0.85 : 0.08} transform={`rotate(${i * 18 + giro * 0.3})`} />;
        })}
        <circle r={70} fill={cor} opacity={desliga < 0.95 ? 0.9 : 0.1} />
        {/* mostradores */}
        {[-300, -150, 150, 300].map((x, i) => {
          const ag = alarme > 0.5 ? t * (200 + i * 90) : Math.sin(t * 0.8 + i) * 40;
          const a = ((ag * (1 - desliga)) - 90) * (Math.PI / 180);
          return (
            <g key={i} transform={`translate(${x} 470)`}>
              <circle r={60} fill="#efe6cf" stroke="#5a3a22" strokeWidth={8} />
              <line x1={0} y1={0} x2={Math.cos(a) * 46} y2={Math.sin(a) * 46} stroke="#b3261e" strokeWidth={6} strokeLinecap="round" />
              <circle r={7} fill="#2b211a" />
              <circle cx={0} cy={-80} r={10} fill={cor} opacity={desliga < 1 - (i + 1) / 5 ? 1 : 0.15} />
            </g>
          );
        })}
      </g>
      {/* painel, alavanca e a última fotografia */}
      <rect x={560} y={1330} width={480} height={30} fill="#5a4630" />
      <rect x={590} y={1360} width={420} height={260} fill="#3a2c1e" stroke="#2b211a" strokeWidth={6} />
      {foto && (
        <g transform={`translate(${FOTO_PAINEL[0]} ${FOTO_PAINEL[1] - 40}) rotate(-8)`}>
          <rect x={-60} y={-46} width={120} height={92} fill="#e9dcc0" stroke="#3b2a1b" strokeWidth={4} />
          <rect x={-50} y={-38} width={100} height={64} fill="#a88b5c" />
        </g>
      )}
      <rect x={ALAVANCA[0] - 50} y={ALAVANCA[1] - 20} width={100} height={60} rx={10} fill="#2b211a" />
      <g transform={`rotate(${-35 + alavanca * 90} ${ALAVANCA[0]} ${ALAVANCA[1]})`}>
        <rect x={ALAVANCA[0] - 10} y={ALAVANCA[1] - 200} width={20} height={200} fill="#8a8f99" />
        <circle cx={ALAVANCA[0]} cy={ALAVANCA[1] - 210} r={30} fill="#b3261e" />
      </g>
      <rect x={0} y={1620} width={1080} height={300} fill="#221a12" />
      <rect width={1080} height={1920} fill="#000" opacity={desliga * 0.55} />
    </g>
  );
};

/** Flash da tragédia: o céu ameaçador sobre Santa Aurora. */
export const Ameaca = ({ t }: { t: number }) => (
  <Praca t={t} tRelogio={0} noite tempestade={1} chuva repete={false} />
);
