import { mix } from "../abismo/cenarios";

// Cenários do curta "O Último Sonho": corredor surreal com o relógio, laboratório
// de sono, cidade que se dobra e estação suspensa. O hospital vem de `oito/cenarios`.

const FONTE = "Anton, Impact, sans-serif";
const acaso = (i: number, k: number) => {
  const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const TODO = { x: -200, y: -200, width: 1480, height: 2320 };

const Estrelas = ({ t, n = 50, h = 1200 }: { t: number; n?: number; h?: number }) => (
  <g>{Array.from({ length: n }, (_, i) => <circle key={i} cx={acaso(i, 1) * 1080} cy={acaso(i, 2) * h} r={1.5 + acaso(i, 3) * 3} fill="#fff" opacity={0.35 + 0.5 * Math.sin(t * 2 + i)} />)}</g>
);

/** Relógio enorme; `ritmo` de 1 (andando) a 0 (parado). */
export const Relogio = ({ t, ritmo = 1, parado = false, r = 260 }: { t: number; ritmo?: number; parado?: boolean; r?: number }) => {
  const ang = parado ? 304 : t * 50 * ritmo + 200;
  return (
    <g>
      <circle r={r + 60} fill="#ffe9b8" opacity={0.12} />
      <circle r={r} fill="#f7ecd4" stroke="#3a2a4a" strokeWidth={22} />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-8} y={-r + 26} width={16} height={i % 3 ? 34 : 60} fill="#3a2a4a" transform={`rotate(${i * 30})`} />)}
      <rect x={-9} y={-r * 0.5} width={18} height={r * 0.5} rx={8} fill="#3a2a4a" transform={`rotate(${ang / 12 + 40})`} />
      <rect x={-6} y={-r * 0.78} width={12} height={r * 0.78} rx={6} fill="#b3402e" transform={`rotate(${ang})`} />
      <circle r={20} fill="#3a2a4a" />
      {parado && <path d={`M-40 ${-r * 0.7} L10 -60 L-30 30 L40 ${r * 0.6}`} stroke="#3a2a4a" strokeWidth={7} fill="none" />}
    </g>
  );
};

// ---------- corredor do sonho ----------
export const CorredorSonho = ({ t, ritmo = 1, parado = false, porta = 0, saida = 0, desfaz = 0 }: {
  t: number; ritmo?: number; parado?: boolean;
  /** A porta onde o menino bate, abrindo de 0 a 1. */
  porta?: number;
  /** A porta iluminada no fim do corredor, de 0 a 1. */
  saida?: number;
  /** O piso se desfazendo, de 0 a 1. */
  desfaz?: number;
}) => {
  const linhas = 9, colunas = 8;
  const yDe = (r: number) => 1250 + 850 * (r / linhas) ** 1.7;
  const xDe = (r: number, c: number) => { const f = (yDe(r) - 1250) / 850; const esq = 380 - f * 580, dir = 700 + f * 580; return esq + (dir - esq) * (c / colunas); };
  return (
    <g>
      <defs><linearGradient id="so-ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1a1040" /><stop offset="0.55" stopColor="#5a3a8a" /><stop offset="1" stopColor="#2a8a9a" /></linearGradient></defs>
      <rect {...TODO} fill="url(#so-ceu)" />
      <Estrelas t={t} />
      {/* portas flutuando */}
      {[[130, 700, -14, 0.8], [960, 620, 12, 0.7], [210, 1080, 8, 1], [60, 360, 20, 0.5], [900, 300, -18, 0.5]].map(([x, y, a, s], i) => (
        <g key={i} transform={`translate(${x} ${y + Math.sin(t * 0.8 + i) * 18}) rotate(${a + Math.sin(t * 0.5 + i) * 4}) scale(${s})`} opacity={0.85}>
          <rect x={-70} y={-150} width={140} height={300} rx={6} fill={["#b3402e", "#3d6fa3", "#5c9a4f", "#e9b730", "#7a4fa3"][i]} stroke="#f7ecd4" strokeWidth={10} />
          <circle cx={44} cy={10} r={9} fill="#f7ecd4" />
        </g>
      ))}
      {/* piso em xadrez */}
      {Array.from({ length: linhas }, (_, r) => Array.from({ length: colunas }, (_, c) => {
        const some = desfaz > 0 && acaso(r * 9 + c, 7) < desfaz * 1.15 - (r / linhas) * 0.25;
        const queda = some ? (desfaz * 1.15 - acaso(r * 9 + c, 7)) * 1400 : 0;
        return (
          <path key={`${r}${c}`} d={`M${xDe(r, c)} ${yDe(r)} L${xDe(r, c + 1)} ${yDe(r)} L${xDe(r + 1, c + 1)} ${yDe(r + 1)} L${xDe(r + 1, c)} ${yDe(r + 1)}Z`}
            fill={(r + c) % 2 ? "#f7ecd4" : "#3a2a4a"} transform={`translate(0 ${queda})`} opacity={some ? Math.max(0, 1 - queda / 900) : 1} />
        );
      }))}
      {/* relógio ao fundo */}
      <g transform="translate(540 760)"><Relogio t={t} ritmo={ritmo} parado={parado} /></g>
      {/* porta iluminada do fim */}
      {saida > 0 && (
        <g>
          <path d={`M${540 - 100} 1250 L${540 + 100} 1250 L${540 + 560} 2100 L${540 - 560} 2100Z`} fill="#fffbe6" opacity={0.3 * saida} />
          <rect x={440} y={890} width={200} height={360} rx={8} fill="#fffbe6" stroke="#f7ecd4" strokeWidth={12} />
          <circle cx={540} cy={1070} r={420} fill="#fffbe6" opacity={0.25 * saida} />
        </g>
      )}
      {/* a porta dos sonhos de Helena */}
      {saida === 0 && (
        <g transform="translate(800 1790)">
          <rect x={-150} y={-720} width={300} height={720} fill={porta > 0 ? "#ffe9b8" : "#1a1040"} stroke="#f7ecd4" strokeWidth={18} />
          <g transform={`translate(-150 0) scale(${Math.max(0.06, 1 - porta * 0.94)} 1) translate(150 0)`}>
            <rect x={-150} y={-720} width={300} height={720} fill="#b3402e" />
            <rect x={-110} y={-670} width={220} height={260} fill="#000" opacity={0.15} /><rect x={-110} y={-360} width={220} height={300} fill="#000" opacity={0.15} />
            <circle cx={104} cy={-340} r={16} fill="#e6c229" />
          </g>
        </g>
      )}
    </g>
  );
};

// ---------- laboratório de sono ----------
export const LabSono = ({ t, intruso = 0 }: { t: number; intruso?: number }) => (
  <g>
    <rect {...TODO} fill="#0f2028" />
    {[0, 1, 2].map((i) => {
      const meio = i === 1;
      return (
        <g key={i} transform={`translate(${60 + i * 330} 330)`}>
          <rect width={300} height={meio ? 380 : 300} rx={10} fill="#07121a" stroke={meio && intruso > 0 ? "#ffd166" : "#2f6f7f"} strokeWidth={8} />
          <polyline points={Array.from({ length: 30 }, (_, k) => `${10 + k * 9.6},${120 + Math.sin(k * 0.6 + t * 4 + i * 2) * (30 + (k % 5) * 6)}`).join(" ")} stroke="#5ce0c8" strokeWidth={5} fill="none" />
          {meio && intruso > 0 && <polyline points={Array.from({ length: 30 }, (_, k) => `${10 + k * 9.6},${250 + Math.sin(k * 1.3 + t * 7) * 22 - intruso * 110}`).join(" ")} stroke="#ffd166" strokeWidth={6} fill="none" />}
          <text x={14} y={36} fontFamily={FONTE} fontSize={26} fill="#5ce0c8">{`SONHO INDUZIDO ${i + 1}`}</text>
          {meio && intruso > 0.3 && <text x={150} y={350} textAnchor="middle" fontFamily={FONTE} fontSize={40} fill="#ffd166" opacity={Math.sin(t * 9) > -0.3 ? 1 : 0.4}>SINAL EXTERNO</text>}
        </g>
      );
    })}
    {/* cápsulas de sono */}
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${-40 + i * 400} 1180)`}>
        <rect x={0} y={0} width={360} height={220} rx={110} fill="#1c3a44" stroke="#2f6f7f" strokeWidth={10} />
        <rect x={30} y={30} width={300} height={160} rx={80} fill="#5ce0c8" opacity={0.12 + 0.06 * Math.sin(t * 2 + i)} />
        <circle cx={100} cy={110} r={46} fill="#c9a68a" opacity={0.8} /><path d="M70 104 Q84 114 98 104 M108 104 Q122 114 136 104" stroke="#14161c" strokeWidth={5} fill="none" />
        <rect x={150} y={76} width={170} height={80} rx={30} fill="#dfe6ec" opacity={0.7} />
        <rect x={120} y={220} width={120} height={400} fill="#14262e" />
        <path d={`M180 0 Q${200 + i * 30} -200 ${210 + (1 - i) * 330} -470`} stroke="#2f6f7f" strokeWidth={8} fill="none" />
      </g>
    ))}
    <rect {...TODO} y={1790} fill="#0a161c" />
    <rect {...TODO} fill="#5ce0c8" opacity={0.04} />
  </g>
);

// ---------- cidade que se dobra sobre si mesma ----------
const Fileira = ({ k, cor }: { k: number; cor: string }) => (
  <g>
    {Array.from({ length: 9 }, (_, i) => {
      const h = 260 + acaso(i, k) * 300;
      return (
        <g key={i}>
          <rect x={-100 + i * 150} y={-h} width={136} height={h} fill={cor} />
          {Array.from({ length: 8 }, (_, n) => <rect key={n} x={-80 + i * 150 + (n % 2) * 56} y={-h + 30 + Math.floor(n / 2) * 66} width={34} height={40} fill="#ffe9a8" opacity={acaso(n, i + k) > 0.4 ? 0.85 : 0.15} />)}
        </g>
      );
    })}
  </g>
);
export const CidadeDobrada = ({ t, dobra = 1 }: { t: number; dobra?: number }) => (
  <g>
    <defs><linearGradient id="so-cid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a8a9a" /><stop offset="0.5" stopColor="#7a4fa3" /><stop offset="1" stopColor="#1a1040" /></linearGradient></defs>
    <rect {...TODO} fill="url(#so-cid)" />
    <Estrelas t={t} h={1900} n={40} />
    <circle cx={540} cy={900} r={130} fill="#f7ecd4" /><circle cx={540} cy={900} r={330} fill="#f7ecd4" opacity={0.14} />
    {/* a cidade de cima, de cabeça para baixo, descendo */}
    <g transform={`translate(1080 ${-520 + dobra * 620}) rotate(180) `}><Fileira k={3} cor="#3a2a6a" /></g>
    {/* laterais dobradas */}
    <g transform={`translate(${-420 + dobra * 420} 1500) rotate(90)`}><g transform="translate(-900 0)"><Fileira k={5} cor="#4a3a80" /></g></g>
    <g transform={`translate(${1500 - dobra * 420} 300) rotate(-90)`}><g transform="translate(-900 0)"><Fileira k={7} cor="#4a3a80" /></g></g>
    <g transform="translate(0 1560)"><Fileira k={1} cor="#241848" /></g>
    {/* rua que sobe pela parede */}
    <path d="M-200 1700 L700 1700 Q1000 1700 1000 1400 L1000 300" stroke="#5a4a90" strokeWidth={150} fill="none" opacity={0.9} />
    <path d="M-200 1700 L700 1700 Q1000 1700 1000 1400 L1000 300" stroke="#f7ecd4" strokeWidth={8} fill="none" strokeDasharray="50 50" strokeDashoffset={-t * 60} />
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={100 + acaso(i, 1) * 880} y={500 + acaso(i, 2) * 700 + Math.sin(t + i) * 30} width={40} height={50} fill="#ffe9a8" opacity={0.6} transform={`rotate(${t * 20 + i * 40} ${100 + acaso(i, 1) * 880} ${500 + acaso(i, 2) * 700})`} />)}
    <rect {...TODO} y={1790} fill="#1a1040" />
  </g>
);

// ---------- estação vazia, suspensa ----------
export const EstacaoVazia = ({ t }: { t: number }) => (
  <g>
    <defs><linearGradient id="so-est" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a2a6a" /><stop offset="0.6" stopColor="#c98aa8" /><stop offset="1" stopColor="#ffe2b8" /></linearGradient></defs>
    <rect {...TODO} fill="url(#so-est)" />
    <Estrelas t={t} h={800} n={30} />
    {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={(t * (10 + i * 4) + i * 380) % 1500 - 200} cy={1250 + i * 190} rx={320} ry={60} fill="#fff" opacity={0.4} />)}
    {/* arcos de ferro e relógio parado */}
    {[0, 1, 2].map((i) => <path key={i} d={`M${120 - i * 60} 1790 L${120 - i * 60} ${760 + i * 40} Q540 ${300 + i * 60} ${960 + i * 60} ${760 + i * 40} L${960 + i * 60} 1790`} stroke={mix("#3a2a4a", "#8a6a8a", i / 3)} strokeWidth={22 - i * 5} fill="none" />)}
    <line x1={540} y1={360} x2={540} y2={640} stroke="#3a2a4a" strokeWidth={8} />
    <g transform="translate(540 730)"><Relogio t={t} ritmo={0.15} r={100} /></g>
    <rect x={160} y={900} width={300} height={90} rx={8} fill="#3a2a4a" /><text x={310} y={962} textAnchor="middle" fontFamily={FONTE} fontSize={54} fill="#f7ecd4">ESTAÇÃO</text>
    {/* banco */}
    <rect x={330} y={1400} width={420} height={150} rx={16} fill="#7a4a3a" /><rect x={310} y={1540} width={460} height={40} rx={10} fill="#8a5a46" />
    <rect x={340} y={1580} width={24} height={210} fill="#3a2a4a" /><rect x={716} y={1580} width={24} height={210} fill="#3a2a4a" />
    {/* plataforma flutuante e trilhos que acabam nas nuvens */}
    <path d="M-60 1790 L1140 1790 L1040 1900 Q800 2060 540 1990 Q260 2080 40 1900Z" fill="#5a4a6a" />
    <rect x={-60} y={1790} width={1200} height={30} fill="#f7ecd4" />
    <rect x={-60} y={1820} width={1200} height={14} fill="#e6c229" />
    <path d="M1140 1860 Q1400 1900 1500 2100 M1140 1900 Q1360 1950 1440 2120" stroke="#3a2a4a" strokeWidth={10} fill="none" />
    {[0, 1, 2].map((i) => <ellipse key={i} cx={200 + i * 380 + Math.sin(t * 0.4 + i) * 40} cy={2040} rx={300} ry={70} fill="#fff" opacity={0.7} />)}
  </g>
);
