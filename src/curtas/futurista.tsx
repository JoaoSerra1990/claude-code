import { FONT } from "../theme";
import { Ator, type Expr, type PoseA, type Visual } from "../serie/Ator";
import { Holo } from "../serie/motor";

// Cenários futuristas compartilhados pelos curtas "O Homem que Escondeu o Tempo"
// e "O Homem que Matou Seu Futuro".

export const acaso = (i: number, k: number) => {
  const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return v - Math.floor(v);
};

const PELES = ["#edc09c", "#d9a074", "#c68a5e", "#f1cbb0", "#a8744e"];
const CABELOS = ["#2e211b", "#6b4428", "#17110e", "#b98a4a", "#8a8d94"];
const ESTILOS = ["curto", "rabo", "cacheado", "longo", "coque", "baguncado"] as const;
export const cidadao = (i: number, roupas = ["#3b4a6b", "#6a3fa3", "#2a9d8f", "#5b6d8f", "#8a4f6a", "#4f6b5a"]): Visual => ({
  pele: PELES[i % PELES.length], cabelo: CABELOS[(i * 3) % CABELOS.length], roupa: roupas[i % roupas.length],
  calca: ["#22252e", "#2b2f3b", "#3a3f4d"][i % 3], estilo: ESTILOS[i % ESTILOS.length],
});

/** Pessoa com relógio holográfico sobre a cabeça. `cai`: de 0 (em pé) a 1 (caída). */
export const Pessoa = ({ x, y, s, v, t, holo, holoCor = "#7ef0ff", expr = "sereno", pose = "parado", andando = false, cai = 0, fase = 0 }: {
  x: number; y: number; s: number; v: Visual; t: number; holo?: string; holoCor?: string;
  expr?: Expr; pose?: PoseA; andando?: boolean; cai?: number; fase?: number;
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={120} ry={22} fill="#000" opacity={0.3} />
    <g transform={`rotate(${cai * 88} 0 0)`}>
      <Ator v={v} t={t} expr={expr} pose={pose} andando={andando} fechado={cai > 0.3} fase={fase} />
      {holo && cai < 0.2 && <Holo texto={holo} cor={holoCor} t={t + fase} />}
    </g>
  </g>
);

const TEMPOS = ["38 ANOS", "2 DIAS", "17:42:09", "11 ANOS", "5 MESES", "63 DIAS", "9 ANOS", "04:12:55", "21 ANOS", "130 DIAS"];

type CidadeFuturoProps = {
  t: number;
  noite?: boolean;
  /** Texto nos telões; sem ele, os telões mostram anúncios de tempo. */
  telao?: string;
  /** Multidão na praça. */
  multidao?: boolean;
  /** Multidão paralisada. */
  parada?: boolean;
  /** Pessoa cujo relógio zera e cai: progresso de 0 a 1, ou null. */
  queda?: number | null;
  /** Todos os relógios apagados. */
  apagado?: boolean;
};

export const QUEDA: [number, number] = [640, 1640];

export const CidadeFuturo = ({ t, noite = false, telao, multidao = true, parada = false, queda = null, apagado = false }: CidadeFuturoProps) => {
  const torres = Array.from({ length: 11 }, (_, i) => ({
    x: -40 + i * 108 + acaso(i, 1) * 30, w: 90 + acaso(i, 2) * 70, h: 600 + acaso(i, 3) * 700, i,
  }));
  const pessoas = Array.from({ length: 16 }, (_, i) => {
    const prof = acaso(i, 5);
    const y = 1400 + prof * 460;
    const x = ((acaso(i, 6) * 1200 + (parada ? 0 : t * (14 + (i % 4) * 9) * (i % 2 ? 1 : -1))) % 1200 + 1200) % 1200 - 60;
    return { x, y, s: 0.16 + prof * 0.2, i };
  }).sort((a, b) => a.y - b.y);
  return (
    <g>
      <defs>
        <linearGradient id="ceuFut" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={noite ? "#05071a" : "#251a4a"} />
          <stop offset="1" stopColor={noite ? "#1d1240" : "#e07a5f"} />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#ceuFut)" />
      {noite && Array.from({ length: 50 }, (_, i) => <circle key={i} cx={acaso(i, 7) * 1080} cy={acaso(i, 8) * 700} r={1.5} fill="#fff" opacity={0.6} />)}
      {/* torres */}
      {torres.map(({ x, w, h, i }) => (
        <g key={i}>
          <rect x={x} y={1300 - h} width={w} height={h} fill={i % 2 ? "#1b1d3a" : "#24204a"} stroke="#3b3a6b" strokeWidth={3} />
          {Array.from({ length: Math.floor(h / 60) }, (_, r) =>
            Array.from({ length: 3 }, (_, c) => (
              (r + c + i) % 4 !== 0 && !apagado ? (
                <rect key={`${r}${c}`} x={x + 12 + c * ((w - 24) / 3)} y={1300 - h + 20 + r * 60} width={(w - 40) / 3} height={26}
                  fill={(r + i) % 5 === 0 ? "#ff5fa2" : "#7ef0ff"} opacity={0.5 + 0.3 * acaso(r * 7 + c, i)} />
              ) : null
            )),
          )}
          {i % 3 === 0 && <line x1={x + w / 2} y1={1300 - h} x2={x + w / 2} y2={1300 - h - 90} stroke="#7ef0ff" strokeWidth={5} />}
        </g>
      ))}
      {/* telões */}
      {[[150, 520, 260, 170], [700, 420, 300, 200], [420, 820, 220, 140]].map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} rx={10} fill="#0a0d24" stroke={telao ? "#ffd166" : "#ff5fa2"} strokeWidth={6} />
          <rect x={x} y={y} width={w} height={h} rx={10} fill={telao ? "#ffd166" : "#ff5fa2"} opacity={0.12 + 0.05 * Math.sin(t * 6 + i)} />
          <text x={x + w / 2} y={y + h / 2 + (telao === "∞" ? 46 : 18)} textAnchor="middle" fontFamily={FONT} fontSize={telao === "∞" ? h * 0.9 : h * 0.3}
            fill={telao ? "#ffd166" : "#ffe0f0"}>{apagado ? "" : telao ?? ["+100 ANOS", "COMPRE DIAS", "VIVA MAIS"][i]}</text>
        </g>
      ))}
      {/* veículos voadores */}
      {Array.from({ length: 6 }, (_, i) => {
        const x = ((t * (90 + i * 25) * (i % 2 ? 1 : -1) + i * 300) % 1400 + 1400) % 1400 - 160;
        const y = 300 + i * 120;
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <line x1={i % 2 ? -160 : 40} y1={0} x2={i % 2 ? -40 : 160} y2={0} stroke="#7ef0ff" strokeWidth={4} opacity={0.4} />
            <ellipse rx={44} ry={14} fill="#c9d3e2" /><ellipse cx={0} cy={-8} rx={20} ry={10} fill="#7ef0ff" opacity={0.7} />
          </g>
        );
      })}
      {/* passarela e praça */}
      <rect x={0} y={1080} width={1080} height={30} fill="#3b3a6b" />
      <rect x={0} y={1110} width={1080} height={8} fill="#7ef0ff" opacity={0.5} />
      <rect x={0} y={1300} width={1080} height={620} fill={noite ? "#141633" : "#2e2a52"} />
      {Array.from({ length: 10 }, (_, i) => <line key={i} x1={i * 120} y1={1300} x2={540 + (i * 120 - 540) * 2.2} y2={1920} stroke="#7ef0ff" strokeWidth={2} opacity={0.18} />)}
      {multidao &&
        pessoas.map(({ x, y, s, i }) => (
          <Pessoa key={i} x={x} y={y} s={s} v={cidadao(i)} t={t} holo={apagado ? undefined : TEMPOS[i % TEMPOS.length]}
            holoCor={i % 4 === 1 ? "#ff8a5f" : "#7ef0ff"} expr={parada ? "surpreso" : "sereno"} andando={!parada} fase={i} />
        ))}
      {queda !== null && (
        <Pessoa x={QUEDA[0]} y={QUEDA[1]} s={0.5} v={cidadao(7)} t={t}
          holo={queda < 0.45 ? `00:00:0${Math.max(0, 3 - Math.floor(queda * 8))}` : queda < 0.55 ? "00:00:00" : undefined}
          holoCor={queda < 0.3 ? "#7ef0ff" : "#ff4a3a"} expr={queda > 0.5 ? "congelado" : "medo"} cai={Math.max(0, (queda - 0.55) / 0.45)} />
      )}
    </g>
  );
};

/** Bairro dos ricos: luz dourada, torres impecáveis e números enormes. */
export const Luxo = ({ t }: { t: number }) => (
  <g>
    <defs>
      <linearGradient id="ceuLuxo" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f6d58a" />
        <stop offset="1" stopColor="#fff1d0" />
      </linearGradient>
    </defs>
    <rect width={1080} height={1920} fill="url(#ceuLuxo)" />
    {[[40, 300, 220], [300, 160, 200], [540, 260, 240], [810, 120, 230]].map(([x, y, w], i) => (
      <g key={i}>
        <rect x={x} y={y} width={w} height={1300 - (y as number)} fill="#fbf7ee" stroke="#c9a23a" strokeWidth={6} />
        {Array.from({ length: 14 }, (_, r) => <rect key={r} x={(x as number) + 18} y={(y as number) + 30 + r * 70} width={(w as number) - 36} height={30} fill="#e9d9a6" opacity={0.8} />)}
        <path d={`M${x} ${y} L${(x as number) + (w as number) / 2} ${(y as number) - 60} L${(x as number) + (w as number)} ${y}Z`} fill="#c9a23a" />
      </g>
    ))}
    <rect x={0} y={1300} width={1080} height={620} fill="#efe3c4" />
    {[160, 540, 920].map((x) => (
      <g key={x}>
        <rect x={x - 60} y={1360} width={120} height={60} rx={10} fill="#c9a23a" />
        <circle cx={x} cy={1320} r={70} fill="#7fb069" />
      </g>
    ))}
    {[0, 1, 2].map((i) => (
      <Pessoa key={i} x={220 + i * 320} y={1760 - (i % 2) * 40} s={0.62} t={t} andando fase={i * 2}
        v={cidadao(i, ["#f4f1ea", "#1f1f2e", "#c9a23a"])} holo={["312 ANOS", "540 ANOS", "287 ANOS"][i]} holoCor="#ffd166" expr="feliz" />
    ))}
  </g>
);

/** Periferia: tons frios e gastos; uma mulher troca dias de vida por comida. */
export const Periferia = ({ t, transfere }: { t: number; transfere: number }) => {
  const dias = Math.max(9, 23 - Math.round(transfere * 14));
  return (
    <g>
      <rect width={1080} height={1920} fill="#1b2638" />
      {[[0, 420, 300], [280, 560, 260], [520, 380, 280], [800, 500, 300]].map(([x, y, w], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={1300 - (y as number)} fill={["#2b3a52", "#34425a", "#263246", "#2f3d55"][i]} stroke="#141b28" strokeWidth={5} />
          {Array.from({ length: 6 }, (_, r) => <rect key={r} x={(x as number) + 30} y={(y as number) + 40 + r * 130} width={70} height={60} fill={(r + i) % 3 ? "#0f1520" : "#7ea0c8"} opacity={0.8} />)}
          <path d={`M${x} ${(y as number) + 200} q${(w as number) / 2} 40 ${w} 0`} stroke="#0c1018" strokeWidth={4} fill="none" />
        </g>
      ))}
      <rect x={0} y={1300} width={1080} height={620} fill="#222c3d" />
      <ellipse cx={300} cy={1700} rx={160} ry={30} fill="#5b7f95" opacity={0.3} />
      {/* quiosque de comida */}
      <rect x={620} y={1060} width={400} height={500} fill="#3a4a63" stroke="#141b28" strokeWidth={8} />
      <rect x={600} y={1020} width={440} height={60} fill="#b3402e" />
      <text x={820} y={1064} textAnchor="middle" fontFamily={FONT} fontSize={42} fill="#fff">COMIDA</text>
      <rect x={660} y={1120} width={200} height={140} fill="#0a0d14" stroke="#7ef0ff" strokeWidth={4} />
      <text x={760} y={1180} textAnchor="middle" fontFamily={FONT} fontSize={34} fill="#7ef0ff">PÃO + ÁGUA</text>
      <text x={760} y={1230} textAnchor="middle" fontFamily={FONT} fontSize={40} fill="#ff8a5f">−14 DIAS</text>
      {[0, 1, 2].map((k) => <rect key={k} x={680 + k * 100} y={1330} width={70} height={60} fill="#c9a86a" />)}
      {transfere > 0 && transfere < 1 && (
        <g>
          <path d="M330 860 Q520 820 760 1130" stroke="#7ef0ff" strokeWidth={10} fill="none" opacity={0.7} strokeDasharray="30 20" strokeDashoffset={-t * 200} />
          {Array.from({ length: 8 }, (_, k) => {
            const q = (t * 1.2 + k / 8) % 1;
            return <circle key={k} cx={330 + q * 430} cy={860 - Math.sin(q * Math.PI) * 60 + q * 270} r={9} fill="#7ef0ff" />;
          })}
        </g>
      )}
      <Pessoa x={330} y={1760} s={0.72} t={t} v={{ pele: "#c68a5e", cabelo: "#2e211b", roupa: "#5b6d8f", calca: "#2b2f3b", estilo: "coque" }}
        holo={`${dias} DIAS`} holoCor={transfere > 0 ? "#ff8a5f" : "#7ef0ff"} expr="triste" pose="apontarDir" fase={3} />
    </g>
  );
};

/** Mercado vigiado: câmeras tentam ler os relógios. `scan`: varredura de 0 a 1. */
export const CAMERA_MERCADO: [number, number] = [860, 520];
export const Mercado = ({ t, scan }: { t: number; scan: number }) => {
  const [cx, cy] = CAMERA_MERCADO;
  const ang = -30 + Math.sin(t * 1.4) * 25;
  return (
    <g>
      <rect width={1080} height={1920} fill="#1e1a33" />
      <rect x={0} y={1250} width={1080} height={670} fill="#2b2540" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={30 + i * 350} y={820} width={300} height={430} fill="#3a3152" stroke="#141020" strokeWidth={6} />
          <path d={`M${10 + i * 350} 820 L${30 + i * 350 + 150} 740 L${350 + i * 350} 820Z`} fill={["#b3402e", "#2a9d8f", "#e9b730"][i]} />
          {[0, 1, 2, 3].map((k) => <circle key={k} cx={70 + i * 350 + k * 60} cy={1150} r={22} fill={["#e76f51", "#8ab17d", "#f4a261", "#e9c46a"][k]} />)}
          <rect x={40 + i * 350} y={1180} width={280} height={70} fill="#5a4630" />
        </g>
      ))}
      {/* poste com câmera e cone de varredura */}
      <rect x={cx + 60} y={cy - 20} width={16} height={900} fill="#141020" />
      <g transform={`rotate(${ang} ${cx} ${cy})`}>
        <polygon points={`${cx},${cy} ${cx - 520},${cy + 900} ${cx - 220},${cy + 980}`} fill="#ff4a3a" opacity={0.12 * (0.5 + scan)} />
        <rect x={cx - 60} y={cy - 30} width={120} height={60} rx={10} fill="#c9ccd2" stroke="#141020" strokeWidth={5} />
        <circle cx={cx - 64} cy={cy} r={16} fill="#ff4a3a" />
      </g>
      {[0, 1].map((i) => (
        <Pessoa key={i} x={[180, 940][i]} y={1760} s={0.6} t={t} v={cidadao(i + 3, ["#5a4630", "#8a4f6a"])} holo={["14 ANOS", "9 ANOS"][i]} expr="desconfiado" fase={i * 3} />
      ))}
    </g>
  );
};

/** Central subterrânea: fios de luz levam o tempo dos relógios para as torres de luxo. */
export const PAINEL: [number, number] = [760, 1330];
export const Central = ({ t, apagado, botao }: { t: number; apagado: boolean; botao: number }) => {
  const [px, py] = PAINEL;
  return (
    <g>
      <rect width={1080} height={1920} fill="#0b0d1a" />
      {/* torres de luxo lá em cima, para onde a luz sobe */}
      {[200, 540, 880].map((x, i) => (
        <g key={i}>
          <rect x={x - 60} y={0} width={120} height={260} fill="#2b2540" stroke="#c9a23a" strokeWidth={4} />
          <rect x={x - 40} y={40} width={80} height={180} fill="#ffd166" opacity={apagado ? 0.05 : 0.35} />
        </g>
      ))}
      {/* paredes cobertas de pequenos relógios */}
      {Array.from({ length: 14 }, (_, r) =>
        Array.from({ length: 12 }, (_, c) => (
          <circle key={`${r}-${c}`} cx={45 + c * 90} cy={420 + r * 64} r={22} fill="#141933"
            stroke={apagado ? "#2a2f4a" : "#7ef0ff"} strokeWidth={3} opacity={apagado ? 0.5 : 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + r + c * 0.7))} />
        )),
      )}
      {!apagado &&
        Array.from({ length: 12 }, (_, i) => {
          const x0 = 45 + i * 90;
          const xf = [200, 540, 880][i % 3];
          return (
            <path key={i} d={`M${x0} 1300 C${x0} 800 ${xf} 700 ${xf} 260`} stroke="#ffd166" strokeWidth={4} fill="none" opacity={0.55}
              strokeDasharray="24 26" strokeDashoffset={t * 180 + i * 10} />
          );
        })}
      <rect x={0} y={1300} width={1080} height={620} fill="#11142a" />
      {/* painel de desligamento */}
      <rect x={px - 180} y={py - 120} width={360} height={260} rx={14} fill="#1f2340" stroke="#7ef0ff" strokeWidth={5} />
      <rect x={px - 150} y={py - 96} width={300} height={100} fill="#0a0d24" />
      <text x={px} y={py - 32} textAnchor="middle" fontFamily={FONT} fontSize={40} fill={apagado ? "#3a3f5a" : "#ff8a5f"}>DESLIGAR</text>
      <circle cx={px} cy={py + 70} r={50 - botao * 8} fill={apagado ? "#5a1a14" : "#ff4a3a"} stroke="#141020" strokeWidth={8} />
      <rect x={px - 30} y={py + 140} width={60} height={300} fill="#1f2340" />
    </g>
  );
};

/** Berçário: o relógio de um recém-nascido acende e começa a contar. */
export const Bercario = ({ t, relogio }: { t: number; relogio?: string }) => (
  <g>
    <rect width={1080} height={1920} fill="#1a1e2e" />
    <circle cx={540} cy={1250} r={520} fill="#7ef0ff" opacity={relogio ? 0.08 : 0} />
    <rect x={0} y={1500} width={1080} height={420} fill="#222840" />
    <rect x={260} y={1300} width={560} height={240} rx={30} fill="#d9dee4" stroke="#8a929b" strokeWidth={8} />
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={290 + i * 60} y={1200} width={14} height={160} fill="#c9ccd2" />)}
    <rect x={260} y={1190} width={560} height={24} rx={10} fill="#c9ccd2" />
    <ellipse cx={540} cy={1330} rx={220} ry={50} fill="#f4c7d4" />
    <circle cx={440} cy={1300} r={56} fill="#f1cbb0" />
    <path d="M420 1300 q10 8 20 0 M456 1300 q10 8 20 0" stroke="#2b211a" strokeWidth={4} fill="none" />
    <circle cx={430} cy={1270} r={10} fill="#6b4428" />
    <ellipse cx={560} cy={1320} rx={130} ry={56} fill="#9fd0e6" />
    {relogio && <g transform="translate(440 1240) scale(0.62)"><Holo texto={relogio} cor="#7ef0ff" t={t} y={-90} /></g>}
  </g>
);

// ---------- O Homem que Matou Seu Futuro ----------

/** Instalação clandestina com o portal temporal instável. */
export const Instalacao = ({ t }: { t: number }) => (
  <g>
    <rect width={1080} height={1920} fill="#0a0f1c" />
    <polygon points="0,0 1080,0 760,760 320,760" fill="#121a2e" />
    <polygon points="0,1920 1080,1920 760,1160 320,1160" fill="#18223a" />
    <polygon points="0,0 320,760 320,1160 0,1920" fill="#101729" />
    <polygon points="1080,0 760,760 760,1160 1080,1920" fill="#101729" />
    {Array.from({ length: 6 }, (_, i) => {
      const k = i / 6;
      return <rect key={i} x={320 * k} y={760 * k} width={1080 - 640 * k} height={1920 - 1520 * k} fill="none" stroke="#2f6fb5" strokeWidth={4 - k * 2} opacity={0.5} />;
    })}
    {/* o portal */}
    <g transform={`translate(540 960)`}>
      <circle r={200} fill="#7ef0ff" opacity={0.12 + 0.08 * Math.sin(t * 9)} />
      {[0, 1, 2, 3].map((i) => (
        <ellipse key={i} rx={170 - i * 30 + Math.sin(t * 7 + i) * 8} ry={190 - i * 34} fill="none" stroke={i % 2 ? "#b18cff" : "#7ef0ff"} strokeWidth={8 - i}
          transform={`rotate(${t * (60 + i * 40) * (i % 2 ? -1 : 1)})`} strokeDasharray={`${60 + i * 20} 30`} />
      ))}
      <circle r={60} fill="#e8f6ff" opacity={0.8 + 0.2 * Math.sin(t * 13)} />
      {Array.from({ length: 10 }, (_, i) => {
        const a = i * 0.63 + t * 2;
        return <line key={i} x1={Math.cos(a) * 80} y1={Math.sin(a) * 80} x2={Math.cos(a + 0.4) * (180 + (i % 3) * 30)} y2={Math.sin(a + 0.4) * (180 + (i % 3) * 30)} stroke="#e8f6ff" strokeWidth={3} opacity={Math.sin(t * 17 + i) > 0.3 ? 0.9 : 0} />;
      })}
    </g>
    <text x={540} y={1320} textAnchor="middle" fontFamily={FONT} fontSize={30} fill="#2f6fb5" letterSpacing={8}>SETOR 0 · ACESSO RESTRITO</text>
  </g>
);

/** Quarto de Gabriel, à noite, com a megacidade na janela. */
export const Quarto = ({ t }: { t: number }) => (
  <g>
    <rect width={1080} height={1920} fill="#141a2b" />
    <clipPath id="janelaQuarto"><rect x={120} y={220} width={840} height={900} /></clipPath>
    <g clipPath="url(#janelaQuarto)"><g transform="translate(120 -260) scale(0.78)"><CidadeFuturo t={t} noite multidao={false} /></g></g>
    <rect x={110} y={210} width={860} height={920} fill="none" stroke="#0a0d18" strokeWidth={22} />
    <rect x={0} y={1300} width={1080} height={620} fill="#1b2236" />
    <rect x={60} y={1260} width={360} height={30} fill="#3b4a63" />
    <rect x={80} y={1290} width={14} height={180} fill="#2b3346" /><rect x={386} y={1290} width={14} height={180} fill="#2b3346" />
    <rect x={120} y={1220} width={70} height={40} rx={6} fill="#c9ccd2" />
    <circle cx={330} cy={1240} r={20} fill="#7ef0ff" opacity={0.6 + 0.4 * Math.sin(t * 5)} />
  </g>
);

/** Laboratório do futuro, para a montagem da filha adulta. */
export const Laboratorio = ({ t }: { t: number }) => (
  <g>
    <rect width={1080} height={1920} fill="#e8f1f5" />
    <rect x={0} y={1300} width={1080} height={620} fill="#c9d6dc" />
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={i * 190} y={160} width={150} height={80} fill="#fff" opacity={0.8} />)}
    <g transform="translate(700 900)">
      {[0, 1, 2].map((i) => (
        <ellipse key={i} rx={240 - i * 50} ry={240 - i * 50} fill="none" stroke="#2f6fb5" strokeWidth={14 - i * 3} transform={`rotate(${t * (20 + i * 30)}) scale(1 0.9)`} strokeDasharray="80 30" />
      ))}
      <circle r={70} fill="#7ef0ff" opacity={0.6 + 0.3 * Math.sin(t * 6)} />
    </g>
    <rect x={80} y={1120} width={380} height={200} fill="#9fb6c8" stroke="#5b7f95" strokeWidth={6} />
    {[0, 1, 2].map((k) => <rect key={k} x={110} y={1150 + k * 50} width={320} height={22} fill="#2f6fb5" opacity={0.5} />)}
  </g>
);

/** Linha do tempo alternativa: cenário simples em uma cor dominante. */
export const Linha = ({ t, k }: { t: number; k: number }) => {
  const cores = [["#f6d58a", "#8ab17d"], ["#9fd0e6", "#e9dcc0"], ["#e7c7d8", "#8a8f99"], ["#c9a86a", "#5b7f95"]][k % 4];
  return (
    <g>
      <rect width={1080} height={1920} fill={cores[0]} />
      <rect x={0} y={1300} width={1080} height={620} fill={cores[1]} />
      {k % 4 === 0 && [200, 820].map((x) => <g key={x}><rect x={x - 14} y={1000} width={28} height={300} fill="#6b4a30" /><circle cx={x} cy={980} r={140} fill="#5f8a4c" /></g>)}
      {k % 4 === 1 && <rect x={0} y={1180} width={1080} height={120} fill="#3a8fa8" opacity={0.7} />}
      {k % 4 === 2 && <g><rect x={300} y={700} width={480} height={600} fill="#f4f1ea" stroke="#5a4630" strokeWidth={8} /><rect x={480} y={1060} width={120} height={240} fill="#7a5236" /></g>}
      {k % 4 === 3 && Array.from({ length: 30 }, (_, i) => <circle key={i} cx={acaso(i, 2) * 1080} cy={acaso(i, 3) * 1300} r={4} fill="#fff" opacity={0.6 + 0.4 * Math.sin(t * 3 + i)} />)}
    </g>
  );
};

/** Rua chuvosa à noite, com neon refletido no asfalto. */
export const RuaChuva = ({ t }: { t: number }) => (
  <g>
    <rect width={1080} height={1920} fill="#0b1020" />
    {[[0, 300, 320, "#ff5fa2"], [300, 200, 260, "#7ef0ff"], [740, 260, 340, "#ffd166"]].map(([x, y, w, c], i) => (
      <g key={i}>
        <rect x={x} y={y} width={w} height={1400 - (y as number)} fill="#151b30" stroke="#0a0d18" strokeWidth={5} />
        <rect x={(x as number) + 30} y={(y as number) + 120} width={(w as number) - 60} height={60} rx={8} fill="none" stroke={c as string} strokeWidth={6} opacity={0.8 + 0.2 * Math.sin(t * 9 + i)} />
        {Array.from({ length: 8 }, (_, r) => <rect key={r} x={(x as number) + 40} y={(y as number) + 240 + r * 120} width={60} height={50} fill={(r + i) % 3 ? "#0a0d18" : "#ffd98a"} opacity={0.7} />)}
      </g>
    ))}
    <rect x={0} y={1400} width={1080} height={520} fill="#121828" />
    {[["#ff5fa2", 160], ["#7ef0ff", 430], ["#ffd166", 880]].map(([c, x], i) => (
      <rect key={i} x={(x as number) - 40} y={1420} width={80} height={480} fill={c as string} opacity={0.12} />
    ))}
    <rect x={980} y={900} width={14} height={520} fill="#0a0d18" />
    <circle cx={987} cy={880} r={130} fill="#ffd98a" opacity={0.2} />
    {Array.from({ length: 90 }, (_, i) => {
      const x = acaso(i, 4) * 1080, y = ((acaso(i, 5) * 1920 + t * 1100) % 2000) - 40;
      return <line key={i} x1={x} y1={y} x2={x - 8} y2={y + 40} stroke="#9fb6d8" strokeWidth={3} opacity={0.45} />;
    })}
  </g>
);

/** Chuva por cima de qualquer cenário. */
export const Chuva = ({ t, n = 80 }: { t: number; n?: number }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const x = acaso(i, 6) * 1080, y = ((acaso(i, 7) * 1920 + t * 1100) % 2000) - 40;
      return <line key={i} x1={x} y1={y} x2={x - 8} y2={y + 40} stroke="#b9cde8" strokeWidth={3} opacity={0.4} />;
    })}
  </g>
);
