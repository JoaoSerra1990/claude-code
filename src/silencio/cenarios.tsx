import { Ator } from "../serie/Ator";
import { cidadao } from "../curtas/futurista";
import { mix } from "../abismo/cenarios";

// Cenários do curta "O Mundo em Silêncio": apartamento, telhados, estação central,
// a costa com a ilha e a fachada na manhã seguinte.

const FONTE = "Anton, Impact, sans-serif";
const acaso = (i: number, k: number) => {
  const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const TODO = { x: -200, y: -200, width: 1480, height: 2320 };

/** Anéis de sinal se abrindo a partir de um ponto. */
export const Ondas = ({ t, cor, n = 3, r = 240, w = 7 }: { t: number; cor: string; n?: number; r?: number; w?: number }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const v = ((t * 0.7 + i / n) % 1);
      return <circle key={i} r={20 + v * r} fill="none" stroke={cor} strokeWidth={w} opacity={0.8 * (1 - v)} />;
    })}
  </g>
);

/** Notas musicais subindo; `cor` muda quando é chiado de rádio. */
export const Notas = ({ t, cor = "#ffd166", n = 5 }: { t: number; cor?: string; n?: number }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const v = (t * 0.45 + i / n) % 1;
      return (
        <g key={i} transform={`translate(${Math.sin(v * 6 + i) * 50 + i * 26} ${-v * 320}) scale(${0.8 + (i % 2) * 0.3})`} opacity={1 - v}>
          <ellipse cx={0} cy={0} rx={15} ry={11} fill={cor} transform="rotate(-20)" /><rect x={11} y={-56} width={6} height={56} fill={cor} /><path d="M17 -56 Q40 -50 36 -26" stroke={cor} strokeWidth={6} fill="none" />
        </g>
      );
    })}
  </g>
);

/** Caçador de som: silhueta esguia, sem olhos, com orelhas em forma de antena. */
export const Cacador = ({ t, corre = true, fase = 0 }: { t: number; corre?: boolean; fase?: number }) => {
  const p = corre ? Math.sin(t * 13 + fase) : 0;
  const cor = "#0a0e16";
  return (
    <g>
      {[-70, -40, 46, 76].map((x, i) => <path key={x} d={`M${x} -90 L${x + (i % 2 ? p : -p) * 34} -40 L${x + (i % 2 ? p : -p) * 50 + 8} 0`} stroke={cor} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
      <path d={`M-90 -100 Q0 ${-150 - Math.abs(p) * 10} 90 -110 L110 -160 L96 -96 Q0 -60 -90 -84Z`} fill={cor} />
      <path d={`M-90 -96 Q-150 -80 -170 ${-130 + p * 20}`} stroke={cor} strokeWidth={12} fill="none" strokeLinecap="round" />
      <ellipse cx={126} cy={-176} rx={40} ry={28} fill={cor} />
      {[-1, 1].map((l) => (
        <g key={l} transform={`translate(${118 + l * 22} -196) rotate(${l * 24 + Math.sin(t * 5 + fase + l) * 8})`}>
          <path d="M0 0 L-30 -70 Q0 -96 30 -70Z" fill={cor} /><path d="M-22 -66 Q0 -84 22 -66" stroke="#7ef0ff" strokeWidth={5} fill="none" opacity={0.7} />
        </g>
      ))}
      <path d="M150 -170 L172 -164" stroke="#7ef0ff" strokeWidth={4} opacity={0.5} />
    </g>
  );
};

// ---------- telhados da cidade ----------
export type Modo = "passam" | "paradas" | "antena" | "torre" | "partem" | "nenhuma";
export const ANTENA_T: [number, number] = [760, 760];
export const TORRE_T: [number, number] = [210, 420];
export const JANELA_T: [number, number] = [505, 1250];

export const Telhados = ({ t, modo = "passam", torre = 0, antena = 0, grito = 0, dia = 0, p = 0 }: {
  t: number; modo?: Modo;
  /** Sinal da torre de comunicação, de 0 a 1. */
  torre?: number;
  /** Sinal na antena do prédio, de 0 a 1. */
  antena?: number;
  /** Pedido de socorro saindo de uma janela, de 0 a 1. */
  grito?: number; dia?: number;
  /** Progresso da ação do modo (salto, partida), de 0 a 1. */
  p?: number;
}) => {
  const predio = (i: number) => ({ x: -80 + i * 200, y: 1000 + acaso(i, 1) * 260, w: 190 });
  const bichos = Array.from({ length: 5 }, (_, i) => {
    const b = predio(1 + (i % 5));
    switch (modo) {
      case "passam": return { x: ((t * 300 + i * 260) % 1500) - 200, y: 1090 + (i % 3) * 60, s: 0.7, corre: true, vira: 1 };
      case "paradas": return { x: b.x + 90, y: b.y, s: 0.7, corre: false, vira: i % 2 ? 1 : -1 };
      case "antena": return { x: b.x + 90 + (ANTENA_T[0] - 60 + i * 30 - b.x - 90) * p, y: b.y + (ANTENA_T[1] + 240 - i * 60 - b.y) * p - Math.sin(p * Math.PI) * 260, s: 0.7, corre: true, vira: 1 };
      case "torre": { const a = t * 0.9 + i * 1.25; return { x: TORRE_T[0] + Math.cos(a) * 190, y: 900 + Math.sin(a) * 90 + i * 20, s: 0.6, corre: true, vira: Math.sin(a) > 0 ? -1 : 1 }; }
      case "partem": return { x: b.x + 90 + p * (1500 + i * 120), y: b.y - Math.abs(Math.sin(p * 9 + i)) * 80, s: 0.7, corre: true, vira: 1 };
      default: return null;
    }
  });
  return (
    <g>
      <defs><linearGradient id="si-ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={mix("#080c1c", "#6fb3e8", dia)} /><stop offset="1" stopColor={mix("#27304d", "#ffe9c2", dia)} /></linearGradient></defs>
      <rect {...TODO} fill="url(#si-ceu)" />
      {dia < 0.5 && Array.from({ length: 40 }, (_, i) => <circle key={i} cx={acaso(i, 1) * 1080} cy={acaso(i, 2) * 900} r={1.5 + acaso(i, 3) * 2.5} fill="#fff" opacity={0.4 + 0.4 * Math.sin(t * 2 + i)} />)}
      <circle cx={800} cy={300} r={90} fill={mix("#e9eef7", "#fff6d6", dia)} /><circle cx={800} cy={300} r={240} fill={mix("#9fb5d9", "#ffe2a0", dia)} opacity={0.2} />
      {Array.from({ length: 10 }, (_, i) => <rect key={i} x={-60 + i * 120} y={820 - acaso(i, 5) * 240} width={104} height={900} fill={mix("#141a2e", "#9aa8c4", dia)} />)}
      {/* torre de comunicação */}
      <g transform={`translate(${TORRE_T[0]} 1100)`}>
        <path d="M-70 0 L-12 -680 M70 0 L12 -680 M-60 -110 L50 -220 M60 -110 L-50 -220 M-44 -290 L34 -400 M44 -290 L-34 -400 M-28 -470 L20 -580 M28 -470 L-20 -580" stroke={mix("#232a40", "#56617a", dia)} strokeWidth={11} fill="none" />
        <circle cy={-690} r={13} fill="#ff5a4a" opacity={0.6 + 0.4 * Math.sin(t * 4)} />
        {torre > 0 && <g transform="translate(0 -680)" opacity={torre}><Ondas t={t} cor="#ff5a4a" r={420} w={9} /></g>}
      </g>
      {/* prédios e telhados */}
      {Array.from({ length: 7 }, (_, i) => {
        const b = predio(i);
        return (
          <g key={i}>
            <rect x={b.x} y={b.y} width={b.w} height={1100} fill={mix(i % 2 ? "#1c2238" : "#232a44", i % 2 ? "#c9a68a" : "#b8c0cf", dia)} />
            <rect x={b.x - 8} y={b.y - 16} width={b.w + 16} height={22} fill={mix("#0f1322", "#7d6a5c", dia)} />
            {Array.from({ length: 8 }, (_, k) => <rect key={k} x={b.x + 26 + (k % 2) * 86} y={b.y + 70 + Math.floor(k / 2) * 150} width={52} height={80} fill={dia > 0.5 ? "#bfe3f5" : acaso(k, i) > 0.75 ? "#ffcf7a" : "#0c1020"} opacity={0.9} />)}
            {i % 3 === 0 && <g><rect x={b.x + 40} y={b.y - 90} width={70} height={74} fill={mix("#141a2e", "#7d6a5c", dia)} /><path d={`M${b.x + 30} ${b.y - 90} L${b.x + 75} ${b.y - 120} L${b.x + 120} ${b.y - 90}Z`} fill={mix("#0f1322", "#6b5a4e", dia)} /></g>}
          </g>
        );
      })}
      {/* antena do prédio */}
      <g transform={`translate(${ANTENA_T[0]} ${predio(4).y - 16})`}>
        <line x1={0} y1={0} x2={0} y2={-(predio(4).y - 16 - ANTENA_T[1])} stroke={mix("#232a40", "#56617a", dia)} strokeWidth={10} />
        {[0.3, 0.55, 0.8].map((f) => <line key={f} x1={-50 * (1 - f)} y1={-(predio(4).y - 16 - ANTENA_T[1]) * f} x2={50 * (1 - f)} y2={-(predio(4).y - 16 - ANTENA_T[1]) * f} stroke={mix("#232a40", "#56617a", dia)} strokeWidth={8} />)}
      </g>
      {antena > 0 && <g transform={`translate(${ANTENA_T[0]} ${ANTENA_T[1]})`} opacity={antena}><Ondas t={t} cor="#ff5a4a" r={300} /></g>}
      {grito > 0 && <g transform={`translate(${JANELA_T[0]} ${JANELA_T[1]})`} opacity={grito}><Ondas t={t} cor="#ffd166" r={200} /><text x={0} y={-120} textAnchor="middle" fontFamily={FONTE} fontSize={54} fill="#ffd166">SOCORRO</text></g>}
      {bichos.map((b, i) => b && <g key={i} transform={`translate(${b.x} ${b.y}) scale(${b.s * b.vira} ${b.s})`}><Cacador t={t} corre={b.corre} fase={i * 2} /></g>)}
      {dia > 0.5 && [0, 1, 2].map((i) => { const x = (t * 60 + i * 400) % 1400 - 150, y = 500 + i * 70; return <path key={i} d={`M${x - 20} ${y} Q${x - 10} ${y - 16} ${x} ${y} Q${x + 10} ${y - 16} ${x + 20} ${y}`} stroke="#3a3340" strokeWidth={5} fill="none" />; })}
      <rect {...TODO} y={1820} fill={mix("#0a0d18", "#8a8f98", dia)} />
    </g>
  );
};

// ---------- o apartamento silencioso ----------
export const Apartamento = ({ t, radio = 0, antena = 0, bicho = false }: { t: number; radio?: number; antena?: number; bicho?: boolean }) => (
  <g>
    <rect {...TODO} fill="#2a2a3c" />
    {/* paredes forradas com cobertores */}
    {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${-200 + i * 300} -200 Q${-180 + i * 300} 600 ${-200 + i * 300} 1300`} stroke="#000" strokeOpacity={0.2} strokeWidth={10} fill="none" />)}
    {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={-100 + (i % 8) * 170 + (Math.floor(i / 8) % 2) * 85} cy={-60 + Math.floor(i / 8) * 150} r={9} fill="#000" opacity={0.18} />)}
    {/* janela */}
    <rect x={600} y={400} width={400} height={520} rx={10} fill="#0c1124" stroke="#15151f" strokeWidth={22} />
    <clipPath id="si-jan"><rect x={611} y={411} width={378} height={498} /></clipPath>
    <g clipPath="url(#si-jan)">
      <circle cx={900} cy={500} r={46} fill="#e9eef7" />
      {[620, 730, 850, 940].map((x, i) => <rect key={x} x={x} y={720 + (i % 2) * 60} width={110} height={300} fill="#1c2238" />)}
      <line x1={790} y1={730} x2={790} y2={560} stroke="#39425c" strokeWidth={8} /><line x1={766} y1={610} x2={814} y2={610} stroke="#39425c" strokeWidth={6} />
      {antena > 0 && <g transform="translate(790 560)" opacity={antena}><Ondas t={t} cor="#ff5a4a" r={200} /></g>}
      {bicho && <g transform="translate(880 740) scale(-0.42 0.42)"><Cacador t={t} corre={false} /></g>}
    </g>
    <line x1={800} y1={400} x2={800} y2={920} stroke="#15151f" strokeWidth={14} />
    {/* cartaz de silêncio */}
    <g transform="translate(330 380)">
      <rect x={-110} y={-110} width={220} height={220} rx={12} fill="#e8e4dc" />
      <path d="M-50 -24 L-14 -24 L30 -60 L30 60 L-14 24 L-50 24Z" fill="#14161c" />
      <line x1={-80} y1={80} x2={80} y2={-80} stroke="#e0352a" strokeWidth={18} /><circle r={96} fill="none" stroke="#e0352a" strokeWidth={16} />
    </g>
    {/* prateleira e rádio */}
    <rect x={90} y={820} width={420} height={20} fill="#15151f" />
    <g transform="translate(300 820)">
      <rect x={-110} y={-130} width={220} height={130} rx={14} fill="#6b4a3a" stroke="#15151f" strokeWidth={8} />
      <circle cx={-50} cy={-66} r={38} fill="#15151f" /><rect x={10} y={-104} width={80} height={30} fill="#f4e3c0" /><circle cx={30} cy={-40} r={12} fill="#15151f" /><circle cx={70} cy={-40} r={12} fill="#15151f" />
      <line x1={90} y1={-130} x2={150} y2={-250} stroke="#8e99a3" strokeWidth={6} />
      {radio > 0 && <g transform="translate(-50 -66)" opacity={radio}><Ondas t={t} cor="#ff5a4a" r={260} /></g>}
      {radio > 0 && <path d={`M-200 -180 ${Array.from({ length: 12 }, (_, i) => `l16 ${(i % 2 ? -1 : 1) * (20 + Math.sin(t * 30 + i) * 14)}`).join(" ")}`} stroke="#ff5a4a" strokeWidth={6} fill="none" opacity={radio} />}
    </g>
    {/* mesa */}
    <rect x={560} y={1200} width={520} height={30} rx={8} fill="#6b4a3a" /><rect x={600} y={1230} width={24} height={560} fill="#4a3428" /><rect x={1010} y={1230} width={24} height={560} fill="#4a3428" />
    <g transform="translate(900 1200)"><rect x={-14} y={-90} width={28} height={90} fill="#f4e3c0" /><path d="M0 -90 Q-14 -116 0 -140 Q14 -116 0 -90Z" fill="#ffb347" transform={`scale(${0.95 + 0.1 * Math.sin(t * 11)})`} /><circle cy={-110} r={260} fill="#ffb347" opacity={0.1} /></g>
    <rect {...TODO} y={1790} fill="#191923" />
    <rect x={-200} y={1790} width={1480} height={330} fill="#3a2a40" opacity={0.6} />
  </g>
);

/** Copo d'água; `quebra` desenha os cacos. */
export const Copo = () => (
  <g>
    <path d="M-34 -90 L34 -90 L26 0 L-26 0Z" fill="#bfe3f5" opacity={0.55} stroke="#e8f6ff" strokeWidth={5} />
    <path d="M-30 -50 L30 -50 L26 0 L-26 0Z" fill="#7fc4ee" opacity={0.7} />
  </g>
);

// ---------- estação central ----------
export const Estacao = ({ t, ligado = true, ilha = 0 }: { t: number; ligado?: boolean; ilha?: number }) => (
  <g>
    <rect {...TODO} fill={ligado ? "#1c2026" : "#12151a"} />
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${i * 220} -200 Q${i * 220 + 60} ${100 + (i % 2) * 120} ${i * 220 + 130} -200`} stroke="#0c0e12" strokeWidth={10} fill="none" />)}
    {/* painel-mapa com os moradores */}
    <g transform="translate(60 380)">
      <rect width={520} height={640} rx={12} fill="#0a0f16" stroke="#39424f" strokeWidth={10} />
      <text x={20} y={56} fontFamily={FONTE} fontSize={38} fill="#8e99a3">{ilha > 0 ? "NOVO FAROL" : "IDENTIFICAÇÃO DE MORADORES"}</text>
      {Array.from({ length: 20 }, (_, i) => <rect key={i} x={30 + (i % 5) * 76} y={100 + Math.floor(i / 5) * 100} width={56} height={70} fill="#1c2a3a" />)}
      {ligado && ilha === 0 && Array.from({ length: 11 }, (_, i) => <g key={i} transform={`translate(${58 + acaso(i, 1) * 300} ${130 + acaso(i, 2) * 330})`}><circle r={9 + 4 * Math.sin(t * 5 + i)} fill="#ff5a4a" /><text x={14} y={8} fontFamily={FONTE} fontSize={20} fill="#ff5a4a">{`M-${100 + i * 37}`}</text></g>)}
      <path d="M420 110 Q470 330 420 520 L520 520 L520 110Z" fill="#12304a" />
      <ellipse cx={470} cy={560} rx={34} ry={22} fill="#3a5a40" />
      {ilha > 0 && <g transform="translate(470 560)" opacity={ilha}><Ondas t={t} cor="#5cf29a" r={130} w={6} /><circle r={10} fill="#5cf29a" /></g>}
    </g>
    {/* transmissor principal */}
    <g transform="translate(800 760)">
      <rect x={-170} y={-380} width={340} height={780} rx={14} fill="#2b323d" stroke="#14181e" strokeWidth={10} />
      <rect x={-130} y={-340} width={260} height={110} fill="#0a0f16" />
      <text x={0} y={-270} textAnchor="middle" fontFamily={FONTE} fontSize={ligado ? 44 : 48} fill={ligado ? "#ff5a4a" : "#56636e"}>{ligado ? "TRANSMITINDO" : "DESLIGADO"}</text>
      {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={-100 + (i % 4) * 66} cy={-170 + Math.floor(i / 4) * 60} r={16} fill={ligado ? (Math.sin(t * 7 + i * 2) > 0 ? "#ff5a4a" : "#5a1a14") : "#1c2026"} />)}
      <rect x={-40} y={40} width={80} height={260} rx={12} fill="#14181e" />
      <line x1={0} y1={170} x2={ligado ? -90 : 90} y2={ligado ? 70 : 270} stroke="#cfd6e0" strokeWidth={20} strokeLinecap="round" />
      <circle cx={ligado ? -90 : 90} cy={ligado ? 70 : 270} r={30} fill="#e0352a" />
      {ligado && <g transform="translate(0 -420)"><Ondas t={t} cor="#ff5a4a" r={200} /></g>}
    </g>
    {/* placa antiga */}
    <g transform="translate(320 1200)">
      <rect x={-250} y={-90} width={500} height={180} rx={8} fill="#8a7a50" stroke="#4a4028" strokeWidth={8} />
      <text x={0} y={-24} textAnchor="middle" fontFamily={FONTE} fontSize={44} fill="#2a2414">REDE DE PROTEÇÃO DA CIDADE</text>
      <text x={0} y={40} textAnchor="middle" fontFamily={FONTE} fontSize={38} fill="#2a2414">INSTALADA DURANTE A CRISE</text>
      <path d="M-250 -90 L-150 -10 M-250 -30 Q-200 -40 -190 -90" stroke="#fff" strokeWidth={3} fill="none" opacity={0.5} />
    </g>
    <rect {...TODO} y={1790} fill="#0c0e12" />
    <rect {...TODO} fill={ligado ? "#ff3a2a" : "#5cc8ff"} opacity={ligado ? 0.05 + 0.03 * Math.sin(t * 6) : 0.04} />
  </g>
);

// ---------- a costa e a ilha desabitada ----------
export const Costa = ({ t, farol = 0, corrida = 0 }: { t: number; farol?: number; corrida?: number }) => (
  <g>
    <defs><linearGradient id="si-mar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0a1026" /><stop offset="0.5" stopColor="#3a3a66" /><stop offset="1" stopColor="#c9805e" /></linearGradient></defs>
    <rect {...TODO} fill="url(#si-mar)" />
    {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={acaso(i, 1) * 1080} cy={acaso(i, 2) * 600} r={2 + acaso(i, 3) * 2} fill="#fff" opacity={0.5} />)}
    <rect x={-200} y={1000} width={1480} height={1120} fill="#14213d" />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-200 + ((t * 40 + i * 190) % 1500)} ${1060 + i * 60} q40 -16 80 0 q40 16 80 0`} stroke="#3d5a8a" strokeWidth={6} fill="none" opacity={0.7} />)}
    {/* a ilha */}
    <path d="M620 1010 Q800 880 1010 1010Z" fill="#0c1424" />
    <rect x={800} y={800} width={22} height={150} fill="#0c1424" /><circle cx={811} cy={790} r={20} fill={farol > 0 ? "#5cf29a" : "#1c2a3a"} />
    {farol > 0 && <g transform="translate(811 790)" opacity={farol}><Ondas t={t} cor="#5cf29a" r={520} w={9} n={4} /><circle r={130} fill="#5cf29a" opacity={0.2} /></g>}
    {/* cidade ao fundo e a praia */}
    {Array.from({ length: 5 }, (_, i) => <rect key={i} x={-120 + i * 76} y={700 - acaso(i, 4) * 180} width={66} height={420} fill="#0c1020" />)}
    <path d="M-200 1920 L-200 1180 Q200 1150 420 1320 Q560 1500 520 1920Z" fill="#3a3448" />
    {[[470, 1330], [560, 1250], [650, 1180], [730, 1110]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={46 - i * 5} ry={16} fill="#232038" />)}
    {corrida > 0 && Array.from({ length: 6 }, (_, i) => {
      const v = Math.min(1, Math.max(0, corrida * 1.7 - i * 0.14));
      const x = -150 + v * 960, y = 1560 - v * 560 - Math.abs(Math.sin(v * 14 + i)) * 70, s = 0.75 - v * 0.5;
      return v < 1 ? <g key={i} transform={`translate(${x} ${y}) scale(${s})`}><Cacador t={t} fase={i * 2} /></g> : null;
    })}
  </g>
);

// ---------- a fachada na manhã seguinte ----------
export const Fachada = ({ t, abre = 0 }: { t: number; abre?: number }) => (
  <g>
    <rect {...TODO} fill="#e9c9a0" />
    {Array.from({ length: 16 }, (_, i) => <line key={i} x1={-200} y1={i * 130} x2={1280} y2={i * 130} stroke="#c9a57a" strokeWidth={4} />)}
    <path d="M700 -200 L1280 -200 L1280 900 L1000 1500Z" fill="#fff6d6" opacity={0.25} />
    {[[150, 420], [540, 380], [930, 420], [130, 980], [950, 980]].map(([x, y], i) => {
      const a = Math.min(1, Math.max(0, abre * 1.8 - i * 0.16));
      return (
        <g key={i} transform={`translate(${x} ${y})`}>
          <rect x={-110} y={-150} width={220} height={300} rx={10} fill="#3a4a63" stroke="#fffaf0" strokeWidth={14} />
          <clipPath id={`si-viz${i}`}><rect x={-103} y={-143} width={206} height={286} /></clipPath>
          {a > 0.3 && <g clipPath={`url(#si-viz${i})`}><g transform="translate(0 420) scale(0.52)"><Ator v={cidadao(i + 2)} t={t} expr="feliz" pose={i % 2 ? "apontarCima" : "parado"} olhar={[i < 3 ? 0.4 : -0.4, 0.5]} fase={i} /></g></g>}
          {([-1, 1] as const).map((l) => <rect key={l} x={l === -1 ? -110 - a * 104 : 6 + a * 104} y={-150} width={104} height={300} fill="#5c9a8f" stroke="#3d6f66" strokeWidth={6} transform={`skewY(${l * a * 8})`} />)}
          <rect x={-130} y={146} width={260} height={24} rx={8} fill="#fffaf0" />
          {a > 0.6 && (
            <g transform={`translate(${i % 2 ? 90 : -90} -190) scale(${0.9 + 0.1 * Math.sin(t * 5 + i)})`}>
              <rect x={-70} y={-46} width={140} height={86} rx={30} fill="#fff" stroke="#14161c" strokeWidth={5} />
              {[-34, 0, 34].map((dx, k) => <circle key={dx} cx={dx} cy={-3} r={9} fill="#14161c" opacity={Math.sin(t * 8 + k * 1.5 + i) > -0.2 ? 1 : 0.2} />)}
            </g>
          )}
        </g>
      );
    })}
    {/* a janela dos irmãos */}
    <rect x={250} y={900} width={580} height={640} rx={12} fill="#f7e6c4" stroke="#fffaf0" strokeWidth={20} />
    <rect x={260} y={910} width={560} height={300} fill="#fff6d6" opacity={0.4} />
  </g>
);
export const FachadaFrente = ({ t }: { t: number }) => (
  <g>
    <rect x={-200} y={1540} width={1480} height={600} fill="#e9c9a0" />
    <rect x={220} y={1530} width={640} height={34} rx={10} fill="#fffaf0" />
    <rect x={280} y={1564} width={520} height={90} rx={12} fill="#a8744e" />
    {Array.from({ length: 7 }, (_, i) => <g key={i} transform={`translate(${320 + i * 74} 1564)`}><path d={`M0 0 Q${Math.sin(t * 2 + i) * 8} -30 0 -56`} stroke="#5c9a4f" strokeWidth={6} fill="none" /><circle cx={Math.sin(t * 2 + i) * 6} cy={-60} r={18} fill={["#e0572a", "#e9b730", "#f6a5a0"][i % 3]} /></g>)}
    {Array.from({ length: 6 }, (_, i) => <line key={i} x1={-200} y1={1700 + i * 130} x2={1280} y2={1700 + i * 130} stroke="#c9a57a" strokeWidth={4} />)}
  </g>
);
