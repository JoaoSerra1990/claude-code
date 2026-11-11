import { FONT } from "../theme";
import { Ator, type Visual } from "../serie/Ator";

// Cenários de "O Menino que Vendia Minutos". Presente: rua antiga sob chuva, em
// azuis e cinzas frios. Memória: cozinha banhada de dourado. Final: o quarto de Theo.

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
export const FOTO: [number, number] = [300, 690];
export const CALENDARIO: [number, number] = [780, 600];
export const CAIXA: [number, number] = [300, 1215];

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
};

export const Rua = ({ t, tChuva, tRelogio, ouro, ouroEm, suspensa }: RuaProps) => {
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
      <rect x={50} y={760} width={400} height={470} fill="#1a2436" stroke="#2a3140" strokeWidth={14} />
      {[[130, 880, 46], [250, 960, 60], [370, 870, 40], [160, 1090, 38], [350, 1100, 50]].map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill="#d9d2bd" stroke="#8b6f33" strokeWidth={6} opacity={0.85} />
          <Ponteiros cx={x} cy={y} r={r * 0.9} tempo={tRelogio + i * 733} />
        </g>
      ))}
      <path d="M70 780 L190 780 L110 1210 L60 1210Z" fill="#9fc0e8" opacity={0.12} />

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

      {/* chuva: riscos quando cai, gotas redondas quando fica suspensa */}
      {gotas.map((g, i) =>
        suspensa > 0.5 ? (
          <ellipse key={i} cx={g.x} cy={g.y} rx={5} ry={8} fill="#dcebff" opacity={0.75} />
        ) : (
          <line key={i} x1={g.x} y1={g.y} x2={g.x - 8} y2={g.y + g.l} stroke="#cfe0ff" strokeWidth={3} opacity={0.4} />
        ),
      )}
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

type QuartoProps = { t: number; elenco: { theo: Visual; mae: Visual } };

export const Quarto = ({ t, elenco }: QuartoProps) => {
  const [fx, fy] = FOTO, [cx, cy] = CALENDARIO, [bx, by] = CAIXA;
  const luz = 0.9 + 0.1 * Math.sin(t * 5) * Math.sin(t * 1.3);
  return (
    <g>
      <defs>
        <radialGradient id="abajur" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffd28a" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffd28a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="#3b3440" />
      {Array.from({ length: 10 }, (_, i) => (
        <line key={i} x1={i * 120} y1={0} x2={i * 120} y2={1400} stroke="#463e4c" strokeWidth={4} />
      ))}
      <rect x={0} y={1400} width={1080} height={520} fill="#4f3b2c" />
      {Array.from({ length: 5 }, (_, i) => <line key={i} x1={0} x2={1080} y1={1400 + i * 110} y2={1400 + i * 110} stroke="#3d2c20" strokeWidth={5} />)}
      <circle cx={560} cy={900} r={720} fill="url(#abajur)" opacity={0.55 * luz} />

      {/* janela com chuva lá fora */}
      <rect x={640} y={110} width={300} height={260} fill="#26334a" stroke="#2a2430" strokeWidth={14} />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={660 + ((i * 53) % 260)} y1={120 + ((i * 97 + t * 400) % 230)} x2={654 + ((i * 53) % 260)} y2={146 + ((i * 97 + t * 400) % 230)} stroke="#b9d0f0" strokeWidth={3} opacity={0.5} />
      ))}

      {/* prateleira com a fotografia */}
      <rect x={90} y={830} width={440} height={22} fill="#6b4a30" />
      <rect x={110} y={852} width={14} height={50} fill="#4a3220" />
      <rect x={496} y={852} width={14} height={50} fill="#4a3220" />
      <rect x={fx - 130} y={fy - 150} width={260} height={290} rx={8} fill="#b8923f" stroke="#5a431c" strokeWidth={8} />
      <rect x={fx - 108} y={fy - 128} width={216} height={246} fill="#cfe3d2" />
      <clipPath id="moldura"><rect x={fx - 108} y={fy - 128} width={216} height={246} /></clipPath>
      <g clipPath="url(#moldura)">
        <circle cx={fx + 60} cy={fy - 90} r={40} fill="#ffe9a8" />
        <g transform={`translate(${fx + 34} ${fy + 290}) scale(0.44)`}><Ator v={elenco.mae} t={0} expr="feliz" pose="abracar" fase={2} /></g>
        <g transform={`translate(${fx - 44} ${fy + 300}) scale(0.34)`}><Ator v={elenco.theo} t={0} expr="feliz" fase={5} /></g>
      </g>
      <rect x={420} y={760} width={70} height={70} rx={10} fill="#7b5a3a" />
      <rect x={130} y={780} width={24} height={50} fill="#8b3a3a" />
      <rect x={156} y={770} width={22} height={60} fill="#3a5a8b" />

      {/* calendário */}
      <rect x={cx - 190} y={cy - 250} width={380} height={470} fill="#f3ecda" stroke="#2a2430" strokeWidth={8} />
      <rect x={cx - 190} y={cy - 250} width={380} height={84} fill="#a3352b" />
      <text x={cx} y={cy - 192} textAnchor="middle" fontFamily={FONT} fontSize={50} fill="#fff" letterSpacing={6}>DEZEMBRO</text>
      {Array.from({ length: 4 }, (_, r) =>
        Array.from({ length: 5 }, (_, c) => {
          const x = cx - 160 + c * 64, y = cy - 140 + r * 62, n = r * 5 + c;
          const alvo = n === 17;
          return (
            <g key={n}>
              <rect x={x} y={y} width={56} height={54} fill="none" stroke="#bdb39a" strokeWidth={3} />
              {n < 13 && <path d={`M${x + 10} ${y + 10} L${x + 46} ${y + 44} M${x + 46} ${y + 10} L${x + 10} ${y + 44}`} stroke="#4a4136" strokeWidth={5} />}
              {alvo && <circle cx={x + 28} cy={y + 27} r={34} fill="none" stroke="#c0281f" strokeWidth={7} />}
              {alvo && <path d={`M${x + 16} ${y + 26} q6 -14 12 0 q6 -14 12 0 q0 12 -12 20 q-12 -8 -12 -20Z`} fill="#c0281f" />}
            </g>
          );
        }),
      )}
      <text x={cx} y={cy + 150} textAnchor="middle" fontFamily={FONT} fontSize={38} fill="#c0281f">O DIA EM QUE</text>
      <text x={cx} y={cy + 196} textAnchor="middle" fontFamily={FONT} fontSize={44} fill="#c0281f">MAMÃE VOLTA</text>

      {/* mesinha com o abajur e a caixa de moedas */}
      <rect x={90} y={1290} width={440} height={30} fill="#6b4a30" />
      <rect x={120} y={1320} width={22} height={330} fill="#4a3220" />
      <rect x={480} y={1320} width={22} height={330} fill="#4a3220" />
      <rect x={440} y={1180} width={16} height={110} fill="#2a2430" />
      <path d="M392 1180 L504 1180 L480 1090 L416 1090Z" fill="#ffd28a" opacity={luz} />
      <rect x={bx - 110} y={by - 10} width={220} height={86} rx={8} fill="#7a4a2a" stroke="#3d2412" strokeWidth={7} />
      <rect x={bx - 122} y={by - 90} width={244} height={30} rx={8} fill="#8a5632" stroke="#3d2412" strokeWidth={7} transform={`rotate(-58 ${bx - 110} ${by - 10})`} />
      {[[-70, 0], [-36, -8], [0, -2], [36, -10], [70, -1], [-52, -20], [-14, -22], [22, -24], [56, -20], [4, -40]].map(([dx, dy], i) => (
        <ellipse key={i} cx={bx + dx} cy={by + dy} rx={22} ry={9} fill="#e8c35a" stroke="#8b6a1f" strokeWidth={3} />
      ))}
      {/* cama */}
      <rect x={620} y={1250} width={460} height={150} rx={20} fill="#5b6d8f" />
      <rect x={640} y={1200} width={170} height={80} rx={24} fill="#e9e3d6" />
      <rect x={620} y={1380} width={460} height={60} fill="#3d2c20" />
    </g>
  );
};
