import { FONT } from "../theme";
import { Ator, type Visual } from "../serie/Ator";

// Cenários de "A Última Maré". A praia, a cidade, o farol e a escola são os
// mesmos em toda a temporada: mudar aqui muda em todos os episódios.

/** Número estável entre 0 e 1 para o item `i`. */
const acaso = (i: number, k: number) => {
  const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return v - Math.floor(v);
};

const ROUPAS = ["#e76f51", "#2a9d8f", "#e9c46a", "#f4a261", "#8ab17d", "#5b8def", "#d16ba5", "#f2f2f2"];
const PELES = ["#edc09c", "#d9a074", "#c68a5e", "#f1cbb0", "#a8744e"];
const CABELOS = ["#2e211b", "#6b4428", "#17110e", "#b98a4a", "#8a8d94"];
const ESTILOS = ["curto", "rabo", "cacheado", "longo", "coque", "baguncado"] as const;
export const turista = (i: number): Visual => ({
  pele: PELES[i % PELES.length],
  cabelo: CABELOS[(i * 3) % CABELOS.length],
  roupa: ROUPAS[i % ROUPAS.length],
  calca: ["#3a4a63", "#e9dcc0", "#2b2f3b", "#5b6d8f"][i % 4],
  estilo: ESTILOS[i % ESTILOS.length],
});

/** A parede de água. `h` é a altura acima de `base`. */
const Onda = ({ t, h, base, id }: { t: number; h: number; base: number; id: string }) => {
  if (h <= 0) return null;
  const topo = base - h;
  const crista = Array.from({ length: 28 }, (_, i) => {
    const x = i * 40;
    return `${x},${topo + Math.sin(t * 2.4 + i * 0.9) * (6 + h * 0.03) + Math.sin(i * 2.3) * h * 0.04}`;
  }).join(" ");
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f3b4a" />
          <stop offset="0.5" stopColor="#0b2a38" />
          <stop offset="1" stopColor="#071d28" />
        </linearGradient>
      </defs>
      <polygon points={`0,${base} ${crista} 1080,${base}`} fill={`url(#${id})`} />
      {Array.from({ length: 16 }, (_, i) => (
        <line key={i} x1={i * 70 + 20} y1={topo + h * 0.18} x2={i * 70 + 20 + Math.sin(t + i) * 10} y2={base} stroke="#1c5568" strokeWidth={5} opacity={0.5} />
      ))}
      <polyline points={crista} fill="none" stroke="#e8f6fa" strokeWidth={Math.max(5, h * 0.035)} strokeLinejoin="round" opacity={0.95} />
      {Array.from({ length: 24 }, (_, i) => (
        <circle key={i} cx={(i * 47 + t * 60) % 1080} cy={topo - 6 - ((t * 90 + i * 37) % (20 + h * 0.08))} r={3 + (i % 3) * 2} fill="#e8f6fa" opacity={0.7} />
      ))}
    </g>
  );
};

// ---------- praia vista de cima ----------
export const PraiaAerea = ({ t, recuo }: { t: number; recuo: number }) => {
  const agua = 1060 - recuo * 860; // linha d'água: sobe (se afasta) conforme o mar recua
  const borda = Array.from({ length: 28 }, (_, i) => `${i * 40},${agua + Math.sin(t * 2 + i * 0.8) * 14}`).join(" ");
  const banhistas = Array.from({ length: 46 }, (_, i) => ({
    x: 40 + acaso(i, 1) * 1000, y: 1160 + acaso(i, 2) * 700, c: ROUPAS[i % ROUPAS.length], i,
  }));
  return (
    <g>
      <rect width={1080} height={1920} fill="#ecd9a8" />
      {/* areia molhada e fundo do mar exposto */}
      <rect x={0} y={0} width={1080} height={1100} fill="#b99e6c" />
      <rect x={0} y={0} width={1080} height={520} fill="#8f7d5c" />
      {Array.from({ length: 30 }, (_, i) => (
        <ellipse key={i} cx={acaso(i, 5) * 1080} cy={60 + acaso(i, 6) * 980} rx={30 + acaso(i, 7) * 60} ry={10 + acaso(i, 8) * 18} fill="#6f8f95" opacity={0.35} />
      ))}
      {Array.from({ length: 16 }, (_, i) => (
        <ellipse key={i} cx={acaso(i, 9) * 1080} cy={80 + acaso(i, 10) * 900} rx={22 + acaso(i, 11) * 30} ry={16 + acaso(i, 12) * 20} fill="#5a5148" />
      ))}
      {Array.from({ length: 14 }, (_, i) => (
        <path key={i} d="M0 -14 L4 -4 L14 -4 L6 3 L9 13 L0 7 L-9 13 L-6 3 L-14 -4 L-4 -4Z" transform={`translate(${acaso(i, 13) * 1080} ${140 + acaso(i, 14) * 860}) rotate(${i * 40})`} fill="#e07a3f" />
      ))}
      {/* barcos encalhados */}
      {[[250, 760, 24, "#b3402e"], [760, 520, -32, "#2e6f8a"], [520, 300, 12, "#e9dcc0"]].map(([x, y, r, c], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
          <path d="M-110 0 Q-60 -44 0 -46 Q60 -44 110 0 Q60 44 0 46 Q-60 44 -110 0Z" fill={c as string} stroke="#2b211a" strokeWidth={6} />
          <rect x={-40} y={-22} width={70} height={44} rx={8} fill="#f1e9d8" />
          <line x1={-90} y1={0} x2={90} y2={0} stroke="#2b211a" strokeWidth={4} opacity={0.4} />
        </g>
      ))}
      {/* peixes se debatendo onde a água já saiu */}
      {Array.from({ length: 22 }, (_, i) => {
        const x = acaso(i, 15) * 1080, y = 120 + acaso(i, 16) * 900;
        if (y < agua + 30) return null;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${Math.sin(t * 16 + i * 2) * 50 + i * 30})`}>
            <ellipse rx={16} ry={7} fill="#c9d6dc" />
            <path d="M14 0 L26 -8 L26 8Z" fill="#c9d6dc" />
          </g>
        );
      })}
      {/* o mar */}
      <polygon points={`0,0 1080,0 1080,${agua} ${borda.split(" ").reverse().join(" ")}`} fill="#1f7f96" />
      <polygon points={`0,0 1080,0 1080,${agua - 120} 0,${agua - 120}`} fill="#156278" opacity={0.7} />
      <polyline points={borda} fill="none" stroke="#f2fbfd" strokeWidth={16} opacity={0.9} />
      <polyline points={borda} fill="none" stroke="#f2fbfd" strokeWidth={44} opacity={0.25} transform="translate(0 -24)" />
      {/* ponta de pedra com o farol */}
      <path d="M0 150 Q170 130 230 250 Q250 380 120 430 Q40 440 0 420Z" fill="#5a5148" />
      <circle cx={130} cy={290} r={58} fill="#f2ede2" stroke="#2b211a" strokeWidth={6} />
      <circle cx={130} cy={290} r={38} fill="#b3402e" />
      <circle cx={130} cy={290} r={18} fill="#ffe7a8" />
      {/* guarda-sóis, toalhas e banhistas */}
      {Array.from({ length: 14 }, (_, i) => {
        const x = 60 + acaso(i, 3) * 960, y = 1220 + acaso(i, 4) * 600;
        return (
          <g key={i}>
            <rect x={x + 50} y={y - 20} width={90} height={46} rx={6} fill={ROUPAS[(i + 3) % ROUPAS.length]} opacity={0.85} />
            <circle cx={x} cy={y} r={56} fill={ROUPAS[i % ROUPAS.length]} stroke="#2b211a" strokeWidth={4} />
            {[0, 1, 2, 3].map((k) => <path key={k} d={`M${x} ${y} L${x + Math.cos(k * 1.57) * 56} ${y + Math.sin(k * 1.57) * 56}`} stroke="#fff" strokeWidth={10} opacity={0.5} />)}
          </g>
        );
      })}
      {banhistas.map(({ x, y, c, i }) => {
        // parte da multidão desce para a areia exposta quando o mar some
        const desce = i % 3 === 0 ? Math.max(0, recuo - 0.45) * 900 : 0;
        return (
          <g key={i} transform={`translate(${x} ${y - desce})`}>
            <ellipse cx={3} cy={8} rx={20} ry={12} fill="#000" opacity={0.18} />
            <ellipse rx={18} ry={12} fill={c} />
            <circle r={10} fill={PELES[i % PELES.length]} />
          </g>
        );
      })}
    </g>
  );
};

// ---------- praia ao nível do chão, olhando para o horizonte ----------
export const FAROL: [number, number] = [150, 420];
export const RADIO: [number, number] = [560, 1420];

type PraiaProps = {
  t: number;
  /** Altura da onda no horizonte, de 0 a 1. */
  onda: number;
  /** Revoada fugindo para os morros: progresso de 0 a 1, ou null. */
  aves: number | null;
  /** Curiosos caminhando pelo fundo do mar. */
  multidao: boolean;
  /** Fuga: de 0 (ninguém corre) a 1. */
  foge: number;
  /** Rádio do pescador: 0 desligado, 1 transmitindo. */
  radio: number;
  /** Tremor do chão: ondulações nas poças, de 0 a 1. */
  tremor: number;
};

export const Praia = ({ t, onda, aves, multidao, foge, radio, tremor }: PraiaProps) => {
  const H = 720; // linha do horizonte
  const curiosos = Array.from({ length: 11 }, (_, i) => {
    const prof = acaso(i, 21); // 0 = longe, 1 = perto
    const y0 = 800 + prof * 430;
    const y = y0 + foge * (380 + i * 30);
    return { x: 80 + acaso(i, 22) * 920 + Math.sin(t * 0.6 + i) * (foge > 0 ? 0 : 14), y, s: 0.2 + ((y - 780) / 1100) * 0.42, i };
  }).sort((a, b) => a.y - b.y);
  return (
    <g>
      <defs>
        <linearGradient id="ceuPraia" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fc4e8" />
          <stop offset="1" stopColor="#d9eef5" />
        </linearGradient>
        <linearGradient id="fundoMar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7d7460" />
          <stop offset="1" stopColor="#a8946a" />
        </linearGradient>
      </defs>
      <rect width={1080} height={H} fill="url(#ceuPraia)" />
      <circle cx={820} cy={190} r={64} fill="#fff6c9" />
      {[0, 1, 2].map((i) => (
        <ellipse key={i} cx={((t * (8 + i * 4) + i * 420) % 1400) - 160} cy={150 + i * 110} rx={170} ry={34} fill="#fff" opacity={0.75} />
      ))}

      {/* o que restou do mar, lá longe, e a onda */}
      <rect x={0} y={H - 22} width={1080} height={30} fill="#1f7f96" />
      <Onda t={t} h={onda * 640} base={H + 6} id="ondaPraia" />

      {/* morros e cidade à direita */}
      <path d="M560 720 Q700 520 860 560 Q980 480 1080 520 L1080 740 L560 740Z" fill="#4f8a5b" />
      <path d="M700 720 Q820 600 960 640 Q1040 620 1080 640 L1080 740 L700 740Z" fill="#3f7350" />
      {[[820, 640, 70, 90, "#f1d9b0"], [900, 620, 80, 110, "#e9b9a0"], [990, 650, 70, 80, "#cfe0e8"], [760, 670, 56, 60, "#f2ede2"]].map(([x, y, w, h, c], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill={c as string} />
          <path d={`M${(x as number) - 6} ${y} L${(x as number) + (w as number) / 2} ${(y as number) - 26} L${(x as number) + (w as number) + 6} ${y}Z`} fill="#b3402e" />
          <rect x={(x as number) + 14} y={(y as number) + 18} width={16} height={20} fill="#5b7f95" />
        </g>
      ))}

      {/* costão com o farol, à esquerda */}
      <path d="M0 560 Q120 520 260 560 Q330 600 360 740 L0 740Z" fill="#5a5148" />
      <path d="M0 600 Q110 570 230 600 Q290 640 310 740 L0 740Z" fill="#4a423b" />
      <path d={`M${FAROL[0] - 46} 560 L${FAROL[0] - 30} 300 L${FAROL[0] + 30} 300 L${FAROL[0] + 46} 560Z`} fill="#f2ede2" stroke="#2b211a" strokeWidth={5} />
      <path d={`M${FAROL[0] - 40} 470 L${FAROL[0] - 35} 390 L${FAROL[0] + 35} 390 L${FAROL[0] + 40} 470Z`} fill="#b3402e" />
      <rect x={FAROL[0] - 40} y={262} width={80} height={40} fill="#2b211a" />
      <rect x={FAROL[0] - 28} y={270} width={56} height={26} fill="#ffe7a8" />
      <path d={`M${FAROL[0] - 34} 262 L${FAROL[0]} 226 L${FAROL[0] + 34} 262Z`} fill="#b3402e" />

      {/* fundo do mar exposto */}
      <rect x={0} y={H + 6} width={1080} height={620} fill="url(#fundoMar)" />
      {Array.from({ length: 22 }, (_, i) => {
        const y = 760 + acaso(i, 31) * 520, k = (y - 740) / 560;
        return (
          <g key={i}>
            <ellipse cx={acaso(i, 32) * 1080} cy={y} rx={(50 + acaso(i, 33) * 120) * (0.4 + k)} ry={(8 + acaso(i, 34) * 14) * (0.4 + k)} fill="#a9cfd9" opacity={0.55} />
            {tremor > 0 && (
              <ellipse cx={acaso(i, 32) * 1080} cy={y} rx={(30 + ((t * 80 + i * 20) % 90)) * (0.4 + k)} ry={(5 + ((t * 14 + i * 4) % 14)) * (0.4 + k)} fill="none" stroke="#e8f6fa" strokeWidth={3} opacity={tremor * 0.7} />
            )}
          </g>
        );
      })}
      {Array.from({ length: 14 }, (_, i) => {
        const y = 770 + acaso(i, 41) * 500, k = 0.4 + (y - 740) / 560;
        return <ellipse key={i} cx={acaso(i, 42) * 1080} cy={y} rx={34 * k} ry={20 * k} fill="#4f4840" />;
      })}
      {Array.from({ length: 10 }, (_, i) => {
        const y = 800 + acaso(i, 51) * 460, k = 0.4 + (y - 740) / 560;
        return (
          <path key={i} d="M0 0 q-10 -30 0 -50 M0 0 q14 -24 8 -46 M0 0 q-20 -16 -22 -36" transform={`translate(${acaso(i, 52) * 1080} ${y}) scale(${k})`} stroke="#3f6b3a" strokeWidth={7} fill="none" strokeLinecap="round" />
        );
      })}
      {/* barco de pesca tombado */}
      <g transform="translate(300 1040) rotate(14)">
        <path d="M-210 -40 L210 -40 Q190 60 120 70 L-130 70 Q-200 50 -210 -40Z" fill="#b3402e" stroke="#2b211a" strokeWidth={8} />
        <rect x={-210} y={-56} width={420} height={20} fill="#f2ede2" stroke="#2b211a" strokeWidth={6} />
        <rect x={-60} y={-150} width={130} height={96} fill="#f2ede2" stroke="#2b211a" strokeWidth={6} />
        <rect x={-40} y={-130} width={40} height={36} fill="#5b7f95" />
        <rect x={16} y={-130} width={40} height={36} fill="#5b7f95" />
        <line x1={100} y1={-56} x2={100} y2={-260} stroke="#2b211a" strokeWidth={8} />
      </g>
      <g transform="translate(790 850) rotate(-10) scale(0.42)">
        <path d="M-210 -40 L210 -40 Q190 60 120 70 L-130 70 Q-200 50 -210 -40Z" fill="#2e6f8a" stroke="#2b211a" strokeWidth={8} />
        <rect x={-210} y={-56} width={420} height={20} fill="#f2ede2" stroke="#2b211a" strokeWidth={6} />
      </g>
      {/* peixes se debatendo e estrelas-do-mar */}
      {Array.from({ length: 9 }, (_, i) => {
        const y = 880 + acaso(i, 61) * 380, k = 0.5 + (y - 740) / 560;
        return (
          <g key={i} transform={`translate(${acaso(i, 62) * 1000 + 40} ${y - Math.abs(Math.sin(t * 9 + i * 2)) * 16 * k}) rotate(${Math.sin(t * 14 + i * 3) * 40}) scale(${k})`}>
            <ellipse rx={30} ry={12} fill="#c9d6dc" stroke="#6f8086" strokeWidth={3} />
            <path d="M26 0 L48 -14 L48 14Z" fill="#c9d6dc" stroke="#6f8086" strokeWidth={3} />
            <circle cx={-16} cy={-3} r={3} fill="#1c1c1c" />
          </g>
        );
      })}
      {[[640, 1150], [180, 1240], [900, 1010]].map(([x, y], i) => (
        <path key={i} d="M0 -22 L6 -7 L22 -7 L9 4 L14 20 L0 11 L-14 20 L-9 4 L-22 -7 L-6 -7Z" transform={`translate(${x} ${y}) rotate(${i * 25})`} fill="#e07a3f" stroke="#8a4520" strokeWidth={3} />
      ))}

      {/* areia seca, em primeiro plano */}
      <path d="M0 1320 Q270 1296 540 1322 Q810 1348 1080 1316 L1080 1920 L0 1920Z" fill="#ecd9a8" />
      {Array.from({ length: 18 }, (_, i) => (
        <ellipse key={i} cx={acaso(i, 71) * 1080} cy={1380 + acaso(i, 72) * 500} rx={16} ry={6} fill="#d6c08a" />
      ))}
      <g transform="translate(120 1500)">
        <line x1={0} y1={0} x2={0} y2={-230} stroke="#2b211a" strokeWidth={8} />
        <path d="M-150 -220 Q0 -330 150 -220Z" fill="#e76f51" stroke="#2b211a" strokeWidth={6} />
        <path d="M-50 -258 Q0 -300 50 -258" stroke="#fff" strokeWidth={14} fill="none" opacity={0.6} />
        <rect x={40} y={-10} width={150} height={40} rx={8} fill="#2a9d8f" />
      </g>
      <g transform="translate(940 1560)">
        <line x1={0} y1={0} x2={0} y2={-200} stroke="#2b211a" strokeWidth={8} />
        <path d="M-130 -190 Q0 -290 130 -190Z" fill="#e9c46a" stroke="#2b211a" strokeWidth={6} />
      </g>

      {/* rádio do pescador, sobre um caixote */}
      <g>
        <rect x={RADIO[0] - 90} y={RADIO[1] + 46} width={180} height={110} fill="#8a6a44" stroke="#2b211a" strokeWidth={6} />
        <line x1={RADIO[0] - 90} y1={RADIO[1] + 100} x2={RADIO[0] + 90} y2={RADIO[1] + 100} stroke="#2b211a" strokeWidth={4} />
        <g transform={`translate(${radio > 0 ? Math.sin(t * 60) * 2 : 0} 0)`}>
          <line x1={RADIO[0] + 50} y1={RADIO[1] - 40} x2={RADIO[0] + 90} y2={RADIO[1] - 150} stroke="#2b211a" strokeWidth={6} />
          <rect x={RADIO[0] - 70} y={RADIO[1] - 44} width={140} height={92} rx={10} fill="#3b4652" stroke="#14181d" strokeWidth={7} />
          <circle cx={RADIO[0] - 28} cy={RADIO[1] + 2} r={26} fill="#1c2229" />
          {[0, 1, 2].map((i) => <circle key={i} cx={RADIO[0] - 28} cy={RADIO[1] + 2} r={8 + i * 7} fill="none" stroke="#56626e" strokeWidth={2} />)}
          <rect x={RADIO[0] + 14} y={RADIO[1] - 26} width={42} height={18} fill={radio > 0 ? "#7dffb0" : "#26303a"} />
          <circle cx={RADIO[0] + 24} cy={RADIO[1] + 22} r={8} fill="#c9ccd2" />
          <circle cx={RADIO[0] + 48} cy={RADIO[1] + 22} r={8} fill={radio > 0 ? "#ff5a4a" : "#5a2a26"} />
        </g>
        {radio > 0 &&
          [0, 1, 2].map((i) => {
            const p = (t * 1.5 + i / 3) % 1;
            return <circle key={i} cx={RADIO[0] - 28} cy={RADIO[1] + 2} r={40 + p * 130} fill="none" stroke="#7dffb0" strokeWidth={5} opacity={(1 - p) * 0.7 * radio} />;
          })}
      </g>

      {/* curiosos no fundo do mar */}
      {multidao &&
        curiosos.map(({ x, y, s, i }) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            <ellipse cx={0} cy={0} rx={110} ry={20} fill="#000" opacity={0.25} />
            <Ator v={turista(i)} t={t} expr={foge > 0.05 ? "panico" : "feliz"} pose={foge > 0.05 ? "recuar" : i % 3 === 0 ? "apontarCima" : i % 3 === 1 ? "apontarDir" : "parado"}
              andando={foge > 0.05} fase={i * 1.3} />
            {foge < 0.05 && i % 3 === 0 && <rect x={150} y={-770} width={44} height={74} rx={8} fill="#14181d" />}
            {foge < 0.05 && i % 3 === 0 && Math.sin(t * 3 + i * 2) > 0.92 && <circle cx={172} cy={-790} r={60} fill="#fff" opacity={0.8} />}
          </g>
        ))}

      {/* revoada */}
      {aves !== null &&
        Array.from({ length: 34 }, (_, i) => {
          const x = -200 + aves * 1500 + acaso(i, 81) * 420 - i * 6;
          const y = 520 - aves * 260 + acaso(i, 82) * 260;
          const bate = Math.sin(t * 16 + i) * 12;
          return <path key={i} d={`M-16 ${bate} Q-8 -8 0 0 Q8 -8 16 ${bate}`} transform={`translate(${x} ${y}) scale(${0.8 + acaso(i, 83)})`} stroke="#1c2229" strokeWidth={5} fill="none" strokeLinecap="round" />;
        })}
    </g>
  );
};

// ---------- lembrança: o barco do pai ----------
export const Barco = ({ t }: { t: number }) => {
  const balanco = Math.sin(t * 1.1) * 1.6;
  return (
    <g>
      <defs>
        <linearGradient id="ceuBarco" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6c56a" />
          <stop offset="1" stopColor="#f9e3b0" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#ceuBarco)" />
      <circle cx={760} cy={620} r={130} fill="#fff1c2" />
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 760 + i * 70;
        const pts = Array.from({ length: 15 }, (_, k) => `${k * 80},${y + Math.sin(t * (1.2 + i * 0.2) + k * 0.9 + i) * (10 + i * 3)}`).join(" ");
        return <polygon key={i} points={`0,1920 ${pts} 1080,1920`} fill={["#3a8fa8", "#2f7f99", "#266f8a", "#1f607a", "#19536b"][i]} />;
      })}
      <g transform={`rotate(${balanco} 540 1500)`}>
        {/* mastro, cabine e convés */}
        <rect x={150} y={420} width={22} height={900} fill="#5a3f28" />
        <line x1={161} y1={440} x2={520} y2={1180} stroke="#3b2a1b" strokeWidth={6} />
        <line x1={161} y1={520} x2={30} y2={1200} stroke="#3b2a1b" strokeWidth={6} />
        <path d="M172 470 L330 560 L172 640Z" fill="#b3402e" />
        <rect x={700} y={820} width={380} height={420} fill="#f2ede2" stroke="#2b211a" strokeWidth={8} />
        <rect x={750} y={880} width={150} height={140} fill="#5b9fb8" stroke="#2b211a" strokeWidth={6} />
        <rect x={930} y={880} width={150} height={140} fill="#5b9fb8" stroke="#2b211a" strokeWidth={6} />
        <rect x={680} y={790} width={420} height={40} fill="#b3402e" stroke="#2b211a" strokeWidth={6} />
        <rect x={-40} y={1230} width={1160} height={720} fill="#8a6a44" />
        {Array.from({ length: 9 }, (_, i) => <line key={i} x1={-40} x2={1120} y1={1300 + i * 74} y2={1300 + i * 74} stroke="#6b4f30" strokeWidth={5} />)}
        <rect x={-40} y={1180} width={1160} height={34} fill="#f2ede2" stroke="#2b211a" strokeWidth={6} />
        {Array.from({ length: 8 }, (_, i) => <rect key={i} x={20 + i * 150} y={1100} width={16} height={86} fill="#f2ede2" stroke="#2b211a" strokeWidth={4} />)}
        <rect x={-40} y={1080} width={1160} height={22} fill="#f2ede2" stroke="#2b211a" strokeWidth={5} />
        {/* rede e caixa de peixe */}
        <rect x={60} y={1500} width={220} height={150} fill="#5b7f95" stroke="#2b211a" strokeWidth={6} />
        <path d="M800 1560 q60 -80 140 -30 q70 40 110 0 l0 90 l-250 0Z" fill="#c9a86a" opacity={0.9} />
      </g>
    </g>
  );
};

// ---------- rua da cidade, subindo para o morro ----------
export const PLACA_ESCOLA: [number, number] = [800, 980];

export const Cidade = ({ t, onda }: { t: number; onda: number }) => (
  <g>
    <defs>
      <linearGradient id="ceuCidade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8fb4c8" />
        <stop offset="1" stopColor="#cfdde2" />
      </linearGradient>
    </defs>
    <rect width={1080} height={1920} fill="url(#ceuCidade)" />
    <path d="M0 760 Q300 600 620 680 Q900 610 1080 660 L1080 900 L0 900Z" fill="#4f8a5b" />
    {/* a onda, por trás dos telhados */}
    <Onda t={t} h={onda * 760} base={900} id="ondaCidade" />
    {/* casas dos dois lados da rua */}
    {[[0, 560, 300, 760, "#f1d9b0"], [240, 700, 200, 620, "#e9b9a0"], [700, 620, 230, 700, "#cfe0e8"], [900, 520, 200, 800, "#f2ede2"]].map(([x, y, w, h, c], i) => (
      <g key={i}>
        <rect x={x} y={y} width={w} height={h} fill={c as string} stroke="#2b211a" strokeWidth={5} />
        <path d={`M${(x as number) - 16} ${y} L${(x as number) + (w as number) / 2} ${(y as number) - 70} L${(x as number) + (w as number) + 16} ${y}Z`} fill="#b3402e" stroke="#2b211a" strokeWidth={5} />
        {[0, 1].map((r) =>
          [0, 1].map((k) => (
            <rect key={`${r}${k}`} x={(x as number) + 30 + k * ((w as number) / 2 - 10)} y={(y as number) + 60 + r * 190} width={56} height={84} fill="#5b7f95" stroke="#2b211a" strokeWidth={4} />
          )),
        )}
        <rect x={(x as number) + (w as number) / 2 - 30} y={(y as number) + (h as number) - 150} width={60} height={150} fill="#6b4a30" />
      </g>
    ))}
    {/* postes e fios */}
    {[440, 660].map((x) => <rect key={x} x={x} y={640} width={12} height={700} fill="#3b332b" />)}
    <path d="M446 660 Q556 720 666 660" stroke="#2b211a" strokeWidth={4} fill="none" />
    {/* rua e calçadas */}
    <polygon points="430,1320 650,1320 1080,1920 0,1920" fill="#5a5f66" />
    <polygon points="0,1320 430,1320 0,1920" fill="#b9b3a6" />
    <polygon points="650,1320 1080,1320 1080,1920" fill="#b9b3a6" />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={532 - i * 4} y={1360 + i * 130} width={16 + i * 8} height={60 + i * 16} fill="#e9dcc0" opacity={0.7} />)}
    {/* placa da escola */}
    <rect x={PLACA_ESCOLA[0] - 8} y={PLACA_ESCOLA[1]} width={16} height={470} fill="#3b332b" />
    <rect x={PLACA_ESCOLA[0] - 190} y={PLACA_ESCOLA[1] - 130} width={380} height={170} rx={12} fill="#1f6f4a" stroke="#f2ede2" strokeWidth={10} />
    <text x={PLACA_ESCOLA[0]} y={PLACA_ESCOLA[1] - 62} textAnchor="middle" fontFamily={FONT} fontSize={50} fill="#f2ede2">ESCOLA</text>
    <text x={PLACA_ESCOLA[0] - 30} y={PLACA_ESCOLA[1] - 4} textAnchor="middle" fontFamily={FONT} fontSize={50} fill="#f2ede2">MUNICIPAL</text>
    <path d={`M${PLACA_ESCOLA[0] + 110} ${PLACA_ESCOLA[1] - 24} l44 0 l0 -16 l30 26 l-30 26 l0 -16 l-44 0Z`} fill="#f2ede2" />
    {/* gente fugindo morro acima, ao fundo */}
    {[0, 1, 2, 3].map((i) => (
      <g key={i} transform={`translate(${470 + i * 34 + Math.sin(t * 3 + i) * 6} ${1330 - ((t * 20 + i * 30) % 60)}) scale(0.16)`}>
        <Ator v={turista(i + 5)} t={t} expr="panico" pose="recuar" andando fase={i} />
      </g>
    ))}
  </g>
);

// ---------- a escola: Bia na janela, a onda acima dos telhados ----------
export const JANELA_BIA: [number, number] = [760, 900];

export const Escola = ({ t, onda, bia }: { t: number; onda: number; bia: Visual }) => {
  const [jx, jy] = JANELA_BIA;
  return (
    <g>
      <defs>
        <linearGradient id="ceuEscola" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6f8ea0" />
          <stop offset="1" stopColor="#b9c9cf" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#ceuEscola)" />
      <Onda t={t} h={onda * 1250} base={1420} id="ondaEscola" />
      {/* telhados da cidade, entre a escola e a onda */}
      {[[0, 1180, 240, "#e9b9a0"], [200, 1240, 220, "#f1d9b0"], [-40, 1340, 300, "#cfe0e8"], [230, 1400, 260, "#f2ede2"]].map(([x, y, w, c], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={760} fill={c as string} stroke="#2b211a" strokeWidth={5} />
          <path d={`M${(x as number) - 14} ${y} L${(x as number) + (w as number) / 2} ${(y as number) - 64} L${(x as number) + (w as number) + 14} ${y}Z`} fill="#b3402e" stroke="#2b211a" strokeWidth={5} />
          <rect x={(x as number) + 40} y={(y as number) + 50} width={50} height={70} fill="#5b7f95" />
        </g>
      ))}
      {/* fachada da escola */}
      <rect x={470} y={380} width={640} height={1560} fill="#f0d98a" stroke="#2b211a" strokeWidth={8} />
      <rect x={450} y={340} width={680} height={60} fill="#b3402e" stroke="#2b211a" strokeWidth={8} />
      <rect x={520} y={450} width={540} height={130} rx={10} fill="#1f6f4a" />
      <text x={790} y={510} textAnchor="middle" fontFamily={FONT} fontSize={52} fill="#f2ede2">ESCOLA MUNICIPAL</text>
      <text x={790} y={560} textAnchor="middle" fontFamily={FONT} fontSize={34} fill="#cfe7d8" letterSpacing={3}>DO LITORAL</text>
      {[[560, 1290], [860, 1290], [560, 1620], [860, 1620]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={190} height={230} fill="#3c5566" stroke="#2b211a" strokeWidth={8} />
      ))}
      {/* a janela de Bia */}
      <rect x={jx - 170} y={jy - 210} width={340} height={420} fill="#2f4656" stroke="#2b211a" strokeWidth={10} />
      <clipPath id="janelaBia"><rect x={jx - 165} y={jy - 205} width={330} height={410} /></clipPath>
      <g clipPath="url(#janelaBia)">
        <rect x={jx - 165} y={jy + 60} width={330} height={150} fill="#213441" />
        <g transform={`translate(${jx} ${jy + 520}) scale(0.82)`}>
          <Ator v={bia} t={t} expr={onda > 0.5 ? "congelado" : "medo"} olhar={[-0.9, -0.5]} tremor={onda > 0.5} fase={4} />
        </g>
        <path d={`M${jx - 150} ${jy - 190} L${jx - 60} ${jy - 190} L${jx - 130} ${jy + 190} L${jx - 160} ${jy + 190}Z`} fill="#fff" opacity={0.12} />
      </g>
      <line x1={jx - 170} y1={jy - 150} x2={jx + 170} y2={jy - 150} stroke="#2b211a" strokeWidth={8} />
      <rect x={jx - 190} y={jy + 208} width={380} height={26} fill="#e9dcc0" stroke="#2b211a" strokeWidth={6} />
    </g>
  );
};
