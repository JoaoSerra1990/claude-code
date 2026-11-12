import { Ator, type Visual } from "../serie/Ator";
import { cidadao } from "../curtas/futurista";
import { mix } from "../abismo/cenarios";

// Cenários do curta "O Último Andar": a torre em corte, a cela, a tubulação,
// a cozinha do centésimo andar e o jantar.

const FONTE = "Anton, Impact, sans-serif";
const acaso = (i: number, k: number) => {
  const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const TODO = { x: -200, y: -200, width: 1480, height: 2320 };
const CORES = ["#e0572a", "#e9b730", "#8fc05a", "#f4e3c0", "#b3402e", "#f0a05a"];

/** Comida sobre uma superfície de largura `w`; `q` de 0 (só pratos vazios) a 1 (farta). */
export const Comida = ({ w, q, n = 7 }: { w: number; q: number; n?: number }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const x = -w / 2 + (w / n) * (i + 0.5), tem = i / n < q;
      return (
        <g key={i} transform={`translate(${x} 0)`}>
          <ellipse cx={0} cy={-6} rx={w / n / 2.4} ry={9} fill="#f4f7f8" stroke="#8e99a3" strokeWidth={3} />
          {tem && (i % 3 === 0
            ? <path d={`M${-w / n / 3.4} -10 Q0 ${-64 - (i % 2) * 14} ${w / n / 3.4} -10Z`} fill={CORES[i % 6]} />
            : i % 3 === 1
              ? <g><circle cx={-10} cy={-22} r={14} fill={CORES[i % 6]} /><circle cx={10} cy={-22} r={14} fill={CORES[(i + 2) % 6]} /><circle cx={0} cy={-40} r={13} fill={CORES[(i + 4) % 6]} /></g>
              : <rect x={-w / n / 3.6} y={-44} width={w / n / 1.8} height={34} rx={8} fill={CORES[i % 6]} />)}
        </g>
      );
    })}
  </g>
);

const Cilindros = ({ t, n = 6, w = 400 }: { t: number; n?: number; w?: number }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const x = -w / 2 + (w / n) * (i + 0.5);
      return (
        <g key={i} transform={`translate(${x} 0)`}>
          <circle cy={-50} r={70} fill="#5cc8ff" opacity={0.16 + 0.06 * Math.sin(t * 4 + i)} />
          <rect x={-20} y={-100} width={40} height={100} rx={14} fill="#5cc8ff" stroke="#d8f4ff" strokeWidth={4} />
          <rect x={-20} y={-100} width={40} height={18} rx={8} fill="#8e99a3" />
          <rect x={-10} y={-70} width={8} height={50} rx={4} fill="#fff" opacity={0.6} />
        </g>
      );
    })}
  </g>
);

// ---------- a torre em corte ----------
const H = 230;
export const Torre = ({ t, andar, plat, comida = 1, igual = 0, noite = false }: {
  t: number;
  /** Andar que fica no centro da tela (fracionário rola a torre). */
  andar: number;
  /** Andar onde está a plataforma. */
  plat: number; comida?: number;
  /** Andares já servidos com porções iguais (até este número). */
  igual?: number; noite?: boolean;
}) => {
  const base = Math.floor(andar);
  const andares = Array.from({ length: 12 }, (_, i) => base - 5 + i).filter((n) => n >= 1 && n <= 100);
  const yDe = (n: number) => 960 + (n - andar) * H;
  return (
    <g>
      <rect {...TODO} fill={noite ? "#1a1f29" : "#3d444d"} />
      <rect x={400} y={-200} width={280} height={2320} fill="#0b0d12" />
      {andares.map((n) => {
        const y = yDe(n), fome = n / 100, servido = igual >= n;
        return (
          <g key={n}>
            {([-1, 1] as const).map((l) => {
              const x = l === -1 ? 50 : 680;
              return (
                <g key={l}>
                  <rect x={x} y={y - H / 2 + 12} width={350} height={H - 24} fill={mix("#59626d", "#2c3038", fome)} />
                  {servido && <rect x={x} y={y - H / 2 + 12} width={350} height={H - 24} fill="#ffb347" opacity={0.25} />}
                  <g transform={`translate(${x + 175 - l * 60} ${y + H / 2 - 14}) scale(0.2)`}>
                    <Ator v={cidadao(n * 2 + (l + 1) / 2)} t={t} expr={servido ? "feliz" : fome < 0.3 ? "sereno" : fome < 0.7 ? "triste" : "medo"} pose={!servido && fome > 0.8 ? "alcancar" : "parado"} olhar={[l * -1, -0.3]} fase={n} />
                  </g>
                  {servido && <g transform={`translate(${x + 175 + l * 70} ${y + H / 2 - 16}) scale(0.5)`}><Comida w={120} q={1} n={2} /></g>}
                </g>
              );
            })}
            <rect x={-200} y={y + H / 2 - 12} width={600} height={24} fill="#1c2026" /><rect x={680} y={y + H / 2 - 12} width={600} height={24} fill="#1c2026" />
            <text x={388} y={y - 40} textAnchor="end" fontFamily={FONTE} fontSize={54} fill="#e8e4dc" opacity={0.85}>{n}</text>
          </g>
        );
      })}
      {/* plataforma */}
      <g transform={`translate(540 ${yDe(plat) + H / 2 - 30})`}>
        <line x1={-120} y1={-2000} x2={-120} y2={0} stroke="#56636e" strokeWidth={5} /><line x1={120} y1={-2000} x2={120} y2={0} stroke="#56636e" strokeWidth={5} />
        <rect x={-134} y={0} width={268} height={22} fill="#8e99a3" />
        <Comida w={250} q={comida} n={5} />
        <rect x={-134} y={-80} width={268} height={110} fill="#ffe9a8" opacity={0.1} />
      </g>
    </g>
  );
};

// ---------- a cela do andar 99 ----------
export type Carga = "vazia" | "cilindros" | "cheia";
export const Cela = ({ t, platY = 1470, carga = "vazia", clima = "dia", numero = "99" }: {
  t: number; platY?: number; carga?: Carga; clima?: "dia" | "noite" | "quente"; numero?: string;
}) => {
  const parede = clima === "noite" ? "#232a38" : clima === "quente" ? "#5a4a40" : "#4a525c";
  return (
    <g>
      <rect {...TODO} fill={parede} />
      {Array.from({ length: 6 }, (_, i) => <line key={i} x1={-200} y1={300 + i * 300} x2={1280} y2={300 + i * 300} stroke="#000" strokeOpacity={0.16} strokeWidth={6} />)}
      <text x={170} y={760} textAnchor="middle" fontFamily={FONTE} fontSize={260} fill="#fff" opacity={0.14}>{numero}</text>
      <rect x={830} y={560} width={300} height={36} fill="#2a2f38" /><rect x={830} y={596} width={300} height={90} rx={12} fill="#8a8f98" opacity={0.7} />
      <rect x={-200} y={-200} width={1480} height={420} fill="#22262d" /><rect {...TODO} y={1790} fill="#22262d" />
      <rect x={290} y={-200} width={500} height={420} fill="#07090d" /><rect x={290} y={1790} width={500} height={330} fill="#07090d" />
      {clima === "quente" && <circle cx={540} cy={900} r={700} fill="#ffb347" opacity={0.14 + 0.03 * Math.sin(t * 6)} />}
      {clima === "noite" && carga === "cilindros" && <circle cx={540} cy={platY - 60} r={520} fill="#5cc8ff" opacity={0.12} />}
      {/* plataforma */}
      <g transform={`translate(540 ${platY})`}>
        {[-220, 220].map((x) => <line key={x} x1={x} y1={-2400} x2={x} y2={0} stroke="#8e99a3" strokeWidth={8} />)}
        <rect x={-250} y={0} width={500} height={44} rx={6} fill="#aab4bd" stroke="#56636e" strokeWidth={6} />
        <rect x={-250} y={44} width={500} height={16} fill="#56636e" />
        {carga === "cilindros" ? <Cilindros t={t} /> : <Comida w={470} q={carga === "cheia" ? 1 : 0} />}
      </g>
    </g>
  );
};

// ---------- tubulação de serviço ----------
export const Tubulacao = ({ t, sobe = 0, placa }: { t: number; sobe?: number; placa?: string }) => {
  const rola = (sobe * 2600) % 300;
  return (
    <g>
      <rect {...TODO} fill="#12161c" />
      {placa && <rect x={240} y={-200} width={600} height={700} fill="#fff3c9" opacity={0.25} />}
      {[[40, 150, "#39424f"], [220, 70, "#4a3a2e"], [790, 70, "#39424f"], [900, 150, "#4a525c"]].map(([x, w, c], i) => (
        <g key={i}>
          <rect x={x as number} y={-200} width={w as number} height={2320} fill={c as string} />
          <rect x={x as number} y={-200} width={(w as number) * 0.25} height={2320} fill="#fff" opacity={0.08} />
          {Array.from({ length: 9 }, (_, k) => <rect key={k} x={(x as number) - 8} y={-300 + k * 300 + rola} width={(w as number) + 16} height={34} fill="#20262e" />)}
        </g>
      ))}
      {Array.from({ length: 12 }, (_, k) => <rect key={k} x={330} y={-300 + k * 200 + (rola % 200)} width={420} height={18} rx={8} fill="#56636e" />)}
      <line x1={540} y1={-200} x2={540 + Math.sin(t * 2) * 12} y2={2100} stroke="#d9b98a" strokeWidth={12} strokeDasharray="26 8" />
      {placa && (
        <g transform="translate(540 330)">
          <rect x={-230} y={-120} width={460} height={240} rx={14} fill="#14181e" stroke="#e6c229" strokeWidth={10} />
          <text x={0} y={-30} textAnchor="middle" fontFamily={FONTE} fontSize={60} fill="#e6c229">ANDAR</text>
          <text x={0} y={90} textAnchor="middle" fontFamily={FONTE} fontSize={130} fill="#fff">{placa}</text>
        </g>
      )}
    </g>
  );
};

// ---------- o que ela vê pelas grades: briga por migalhas ----------
export const Briga = ({ t }: { t: number }) => {
  const puxa = Math.sin(t * 9) * 26;
  return (
    <g>
      <rect {...TODO} fill="#2c2a2e" />
      <text x={540} y={620} textAnchor="middle" fontFamily={FONTE} fontSize={300} fill="#fff" opacity={0.1}>87</text>
      <circle cx={540} cy={500} r={700} fill="#ff6a3a" opacity={0.07} />
      <rect {...TODO} y={1790} fill="#1a191c" />
      <g transform={`translate(${330 + puxa} 1790) scale(0.72)`}><Ator v={cidadao(4)} t={t} expr="bravo" pose="apontarDir" olhar={[1, 0]} tremor /></g>
      <g transform={`translate(${760 + puxa} 1790) scale(0.72)`}><Ator v={cidadao(7)} t={t} expr="bravo" pose="apontarEsq" olhar={[-1, 0]} tremor fase={2} /></g>
      <g transform={`translate(${545 + puxa} 1400) rotate(${Math.sin(t * 13) * 10})`}>
        <ellipse rx={90} ry={22} fill="#f4f7f8" stroke="#8e99a3" strokeWidth={5} />
        <circle cx={-20} cy={-8} r={9} fill="#d9b98a" /><circle cx={24} cy={-6} r={6} fill="#d9b98a" />
      </g>
      {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={480 + i * 26} cy={1440 + ((t * 300 + i * 70) % 340)} r={5} fill="#d9b98a" />)}
      <g transform="translate(160 1790) scale(0.4)"><Ator v={cidadao(9)} t={t} expr="triste" olhar={[1, 0]} fase={4} /></g>
      {/* grade da tubulação, em primeiro plano */}
      {Array.from({ length: 7 }, (_, i) => <rect key={i} x={-60 + i * 190} y={-200} width={44} height={2320} fill="#0b0d12" />)}
      <rect x={-200} y={-200} width={1480} height={340} fill="#0b0d12" /><rect x={-200} y={1860} width={1480} height={300} fill="#0b0d12" />
    </g>
  );
};

// ---------- máquinas levando comida intacta para o topo ----------
export const Esteira = ({ t }: { t: number }) => (
  <g>
    <rect {...TODO} fill="#1b222b" />
    <rect x={330} y={-200} width={420} height={2320} fill="#0e1218" />
    {[340, 720].map((x) => <rect key={x} x={x} y={-200} width={20} height={2320} fill="#8e99a3" />)}
    <rect x={330} y={-200} width={420} height={2320} fill="#9fd4ff" opacity={0.06} />
    {Array.from({ length: 6 }, (_, i) => {
      const y = 2100 - ((t * 260 + i * 400) % 2400);
      return (
        <g key={i} transform={`translate(540 ${y})`}>
          <rect x={-170} y={0} width={340} height={26} rx={6} fill="#cfd6dc" stroke="#56636e" strokeWidth={5} />
          <Comida w={320} q={1} n={4} />
          <rect x={-170} y={-90} width={340} height={120} fill="#fff" opacity={0.05} />
        </g>
      );
    })}
    {[[330, 520, 1], [750, 1180, -1], [330, 1620, 1]].map(([x, y, l], i) => (
      <g key={i} transform={`translate(${x} ${y})`}>
        <path d={`M0 0 L${-l * 150} ${-90 + Math.sin(t * 2 + i) * 30} L${-l * 60} ${-200 + Math.sin(t * 2 + i) * 40}`} stroke="#56636e" strokeWidth={26} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <circle r={30} fill="#39424f" /><circle cx={-l * 150} cy={-90 + Math.sin(t * 2 + i) * 30} r={20} fill="#e6c229" />
        <circle r={10} fill="#ff3a2a" opacity={0.6 + 0.4 * Math.sin(t * 6 + i)} />
      </g>
    ))}
    <rect {...TODO} y={1790} fill="#12161c" />
  </g>
);

// ---------- a cozinha do centésimo andar ----------
export const Cozinha = ({ t, mesa = false, igual = false, teias = true }: { t: number; mesa?: boolean; igual?: boolean; teias?: boolean }) => (
  <g>
    <rect {...TODO} fill="#dfe6ea" />
    <rect x={-200} y={-200} width={1480} height={420} fill="#c5cfd6" />
    {[200, 540, 880].map((x) => <g key={x}><rect x={x - 90} y={200} width={180} height={30} rx={10} fill="#fffbe6" /><path d={`M${x - 90} 230 L${x + 90} 230 L${x + 260} 1790 L${x - 260} 1790Z`} fill="#fffbe6" opacity={0.08} /></g>)}
    {/* prateleiras fartas */}
    {[0, 1, 2, 3].map((r) => (
      <g key={r}>
        <rect x={20} y={560 + r * 190} width={500} height={18} fill="#8e99a3" />
        {Array.from({ length: 6 }, (_, i) => {
          const x = 60 + i * 80, c = CORES[(i + r * 2) % 6];
          return (i + r) % 3 === 0
            ? <rect key={i} x={x - 26} y={560 + r * 190 - 96} width={52} height={96} rx={10} fill={c} stroke="#fff" strokeWidth={4} />
            : (i + r) % 3 === 1
              ? <g key={i}><circle cx={x - 12} cy={560 + r * 190 - 24} r={22} fill={c} /><circle cx={x + 16} cy={560 + r * 190 - 22} r={20} fill={CORES[(i + r) % 6]} /><circle cx={x} cy={560 + r * 190 - 54} r={20} fill={c} /></g>
              : <path key={i} d={`M${x - 34} ${560 + r * 190} Q${x} ${560 + r * 190 - 100} ${x + 34} ${560 + r * 190}Z`} fill={c} />;
        })}
      </g>
    ))}
    <rect x={20} y={420} width={16} height={900} fill="#8e99a3" /><rect x={504} y={420} width={16} height={900} fill="#8e99a3" />
    {/* o computador */}
    <g transform="translate(800 720)">
      <rect x={-240} y={-320} width={480} height={640} rx={18} fill="#14181e" stroke="#56636e" strokeWidth={10} />
      <circle cx={0} cy={-250} r={34} fill="#0a0d12" /><circle cx={0} cy={-250} r={20} fill={igual ? "#5cf29a" : "#ff3a2a"} opacity={0.7 + 0.3 * Math.sin(t * 4)} />
      <text x={0} y={-150} textAnchor="middle" fontFamily={FONTE} fontSize={36} fill={igual ? "#5cf29a" : "#ffb347"} letterSpacing={2}>{igual ? "PORÇÕES IGUAIS" : "FOME SUPORTADA POR ANDAR"}</text>
      {Array.from({ length: 25 }, (_, i) => {
        const h = igual ? 190 : 40 + (i / 24) ** 1.6 * 260 + Math.sin(t * 3 + i) * 6;
        return <rect key={i} x={-204 + i * 16.6} y={170 - h} width={11} height={h} fill={igual ? "#5cf29a" : mix("#e6c229", "#ff3a2a", i / 24)} />;
      })}
      <text x={-204} y={220} fontFamily={FONTE} fontSize={30} fill="#8e99a3">1</text><text x={204} y={220} textAnchor="end" fontFamily={FONTE} fontSize={30} fill="#8e99a3">100</text>
      <rect x={-204} y={250} width={408} height={36} fill="#0a0d12" />
      <rect x={-204} y={250} width={((t * 90) % 408)} height={36} fill={igual ? "#5cf29a" : "#ffb347"} opacity={0.5} />
    </g>
    {/* chave geral, esquecida */}
    <g transform="translate(800 1240)">
      <rect x={-130} y={-90} width={260} height={180} rx={14} fill="#b3402e" stroke="#14181e" strokeWidth={8} />
      <text x={0} y={-36} textAnchor="middle" fontFamily={FONTE} fontSize={44} fill="#fff">DESLIGAR</text>
      <rect x={-22} y={-10} width={44} height={84} rx={16} fill="#e8e4dc" stroke="#14181e" strokeWidth={6} />
      {teias && <path d="M-130 -90 L-10 10 M-130 -30 Q-70 -40 -60 -90 M-130 20 Q-40 0 -10 -90 M130 -90 L40 -10 M130 -40 Q80 -40 70 -90" stroke="#fff" strokeWidth={3} fill="none" opacity={0.7} />}
    </g>
    <rect x={-200} y={1400} width={1480} height={400} fill="#b7c2ca" /><rect x={-200} y={1390} width={1480} height={22} fill="#8e99a3" />
    <rect {...TODO} y={1790} fill="#9aa5ae" />
    {mesa && (
      <g>
        <rect x={60} y={1500} width={960} height={40} rx={8} fill="#f4f7f8" stroke="#8e99a3" strokeWidth={5} />
        <path d="M80 1540 L1000 1540 L960 1700 L120 1700Z" fill="#e8e4dc" />
        <g transform="translate(540 1500)"><Comida w={900} q={0} n={6} /></g>
        {[150, 410, 670, 930].map((x) => <g key={x}><rect x={x - 70} y={1300} width={140} height={200} rx={20} fill="#7a2f3a" /><path d={`M${x - 70} 1300 L${x} 1380 L${x + 70} 1300 M${x - 40} 1300 Q${x} 1340 ${x + 40} 1300`} stroke="#fff" strokeWidth={3} fill="none" opacity={0.6} /></g>)}
      </g>
    )}
  </g>
);

// ---------- a torre por fora, à noite ----------
export const TorreFora = ({ t }: { t: number }) => (
  <g>
    <defs><linearGradient id="an-noite" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#070b18" /><stop offset="1" stopColor="#27304d" /></linearGradient></defs>
    <rect {...TODO} fill="url(#an-noite)" />
    {Array.from({ length: 50 }, (_, i) => <circle key={i} cx={acaso(i, 1) * 1080} cy={acaso(i, 2) * 1500} r={1.5 + acaso(i, 3) * 2.5} fill="#fff" opacity={0.4 + 0.5 * Math.sin(t * 2 + i)} />)}
    <rect x={370} y={-200} width={340} height={2100} fill="#1c212b" />
    <rect x={370} y={-200} width={40} height={2100} fill="#000" opacity={0.25} />
    {Array.from({ length: 34 }, (_, r) => [0, 1, 2, 3].map((c) => (
      <rect key={`${r}${c}`} x={398 + c * 76} y={-180 + r * 60} width={48} height={34} fill="#ffcf7a" opacity={0.75 + 0.25 * Math.sin(t * 3 + r * 2 + c)} />
    )))}
    <rect x={300} y={-200} width={480} height={2100} fill="#ffb347" opacity={0.07} />
    <rect {...TODO} y={1830} fill="#0c0f16" />
    {[0, 1, 2].map((i) => <ellipse key={i} cx={(t * 10 + i * 500) % 1500 - 200} cy={300 + i * 380} rx={220} ry={36} fill="#8e99b3" opacity={0.18} />)}
  </g>
);

/** Mesa do jantar, na frente de quem está sentado. */
export const MesaJantar = ({ t }: { t: number }) => (
  <g>
    <rect x={-40} y={1500} width={1160} height={48} rx={8} fill="#aab4bd" stroke="#56636e" strokeWidth={6} />
    <path d="M-40 1548 L1120 1548 L1120 2000 L-40 2000Z" fill="#6b5a4e" />
    <g transform="translate(540 1500)"><Comida w={1060} q={1} n={11} /></g>
    {[200, 880].map((x) => <g key={x} transform={`translate(${x} 1500)`}><rect x={-10} y={-70} width={20} height={70} fill="#f4e3c0" /><path d="M0 -70 Q-16 -100 0 -124 Q16 -100 0 -70Z" fill="#ffb347" transform={`scale(${0.9 + 0.2 * Math.sin(t * 12 + x)})`} /><circle cy={-96} r={90} fill="#ffb347" opacity={0.14} /></g>)}
  </g>
);

export type { Visual };
