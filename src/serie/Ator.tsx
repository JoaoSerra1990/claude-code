// Ator do episódio: boneco simples, mas com atuação. Cada um tem expressão,
// pose, direção do olhar e movimento próprios. Origem (0,0) entre os pés;
// a figura tem cerca de 800 unidades de altura.

export type Expr =
  | "neutro" | "medo" | "bravo" | "firme" | "desconfiado"
  | "panico" | "triste" | "surpreso" | "congelado" | "feliz" | "sereno";

export type PoseA =
  | "parado" | "apontarDir" | "apontarEsq" | "apontarCima"
  | "alcancar" | "recuar" | "empurrar" | "abracar";

export type Visual = {
  pele: string;
  cabelo: string;
  roupa: string;
  detalhe?: string;
  calca: string;
  estilo: "curto" | "rabo" | "cacheado" | "longo" | "gorro" | "grisalho" | "coque" | "baguncado";
  oculos?: boolean;
  gravata?: boolean;
  barba?: boolean;
  /** Barba curta cheia, nesta cor. */
  barbaCor?: string;
  /** Casaco comprido, até os joelhos. */
  casaco?: boolean;
  /** Bolsa transversal, nesta cor. */
  bolsa?: string;
  sobrancelha?: string;
};

type Props = {
  v: Visual;
  t: number;
  expr?: Expr;
  pose?: PoseA;
  /** Direção do olhar, de -1 a 1 em cada eixo. */
  olhar?: [number, number];
  falando?: boolean;
  andando?: boolean;
  tremor?: boolean;
  zumbi?: boolean;
  fechado?: boolean;
  lagrima?: boolean;
  /** Balança a cabeça em negativa. */
  nega?: boolean;
  /** Defasagem para que os atores não se mexam em sincronia. */
  fase?: number;
};

const TINTA = "#14161c";

type Rosto = { b: number; up: number; olho: number; pupila: number; boca: string; suor?: boolean };
const ROSTOS: Record<Expr, Rosto> = {
  neutro: { b: 0, up: 0, olho: 1, pupila: 11, boca: "reta" },
  medo: { b: -9, up: 8, olho: 1.15, pupila: 8, boca: "medo" },
  bravo: { b: 13, up: -5, olho: 0.8, pupila: 11, boca: "tensa" },
  firme: { b: 7, up: -2, olho: 0.9, pupila: 11, boca: "reta" },
  desconfiado: { b: 9, up: -3, olho: 0.7, pupila: 10, boca: "reta" },
  panico: { b: -12, up: 12, olho: 1.3, pupila: 6, boca: "grito", suor: true },
  triste: { b: -8, up: 2, olho: 0.9, pupila: 10, boca: "triste" },
  surpreso: { b: -3, up: 14, olho: 1.28, pupila: 8, boca: "o" },
  congelado: { b: -10, up: 12, olho: 1.35, pupila: 5, boca: "tensa", suor: true },
  feliz: { b: -3, up: 5, olho: 0.92, pupila: 11, boca: "sorriso" },
  sereno: { b: 0, up: 1, olho: 0.9, pupila: 11, boca: "leve" },
};

const bracos = (pose: PoseA, t: number, fase: number): [number, number] => {
  const r = Math.sin(t * 2.2 + fase) * 3;
  switch (pose) {
    case "apontarDir": return [6, -100 + r];
    case "apontarEsq": return [100 + r, -6];
    case "apontarCima": return [6, -160 + r];
    case "alcancar": return [166 + Math.sin(t * 19) * 7, -166 - Math.sin(t * 17) * 7];
    case "recuar": return [128 + r, -128 - r];
    case "empurrar": return [84 + r, 70 + r];
    case "abracar": return [-42 + r, 42 - r];
    default: return [6 + r, -6 - r];
  }
};

const Cabelo = ({ v }: { v: Visual }) => {
  const c = v.cabelo;
  const calota = "M-102 -700 A102 110 0 0 1 102 -700 Q64 -768 0 -750 Q-62 -738 -102 -700Z";
  switch (v.estilo) {
    case "rabo":
      return (
        <>
          <path d="M92 -730 Q170 -700 150 -560 Q128 -520 112 -600 Z" fill={c} />
          <path d={calota} fill={c} />
          <path d="M-102 -700 Q-60 -730 -20 -770" stroke={c} strokeWidth={26} fill="none" />
        </>
      );
    case "cacheado":
      return (
        <>
          {[[-84, -742, 38], [-40, -786, 42], [14, -796, 44], [64, -774, 40], [98, -728, 34], [-104, -700, 30]].map(
            ([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={c} />,
          )}
        </>
      );
    case "longo":
      return (
        <>
          <path d={calota} fill={c} />
          <path d="M-104 -706 Q-128 -600 -112 -520 L-84 -520 Q-92 -620 -84 -700Z" fill={c} />
          <path d="M104 -706 Q128 -600 112 -520 L84 -520 Q92 -620 84 -700Z" fill={c} />
          <path d="M-100 -706 Q-30 -760 40 -722 Q70 -706 100 -706 L100 -740 Q0 -830 -100 -740Z" fill={c} />
        </>
      );
    case "gorro":
      return (
        <>
          <path d="M-106 -712 A106 118 0 0 1 106 -712 Z" fill={v.detalhe ?? c} />
          <rect x={-112} y={-728} width={224} height={34} rx={14} fill={c} />
        </>
      );
    case "grisalho":
      return (
        <>
          <ellipse cx={-98} cy={-706} rx={22} ry={44} fill={c} />
          <ellipse cx={98} cy={-706} rx={22} ry={44} fill={c} />
          <path d="M-70 -778 Q0 -806 70 -778" stroke={c} strokeWidth={12} fill="none" strokeLinecap="round" />
        </>
      );
    case "coque":
      return (
        <>
          <circle cx={0} cy={-806} r={40} fill={c} />
          <path d={calota} fill={c} />
          <path d="M-100 -706 Q-40 -770 30 -730 Q70 -712 100 -706 L100 -744 Q0 -826 -100 -744Z" fill={c} />
        </>
      );
    case "baguncado":
      return (
        <>
          <path d={calota} fill={c} />
          {[[-92, -742, -30], [-56, -776, -14], [-14, -792, 0], [30, -788, 14], [70, -764, 28], [100, -726, 44]].map(
            ([x, y, r], i) => <path key={i} d="M-22 14 L0 -40 L22 14Z" transform={`translate(${x} ${y}) rotate(${r})`} fill={c} />,
          )}
          <path d="M-98 -716 Q-50 -690 -6 -730 Q30 -700 98 -722 L96 -752 Q0 -810 -96 -752Z" fill={c} />
        </>
      );
    default:
      return (
        <>
          <path d={calota} fill={c} />
          <path d="M-96 -716 Q-40 -700 10 -734 Q50 -716 98 -716 L96 -752 Q0 -820 -96 -752Z" fill={c} />
        </>
      );
  }
};

export const Ator = ({
  v, t, expr = "neutro", pose = "parado", olhar = [0, 0],
  falando = false, andando = false, tremor = false, zumbi = false,
  fechado = false, lagrima = false, nega = false, fase = 0,
}: Props) => {
  const r = ROSTOS[expr];
  const pele = zumbi ? "#8aa085" : v.pele;
  const roupa = v.roupa;

  const respira = Math.sin(t * 2.2 + fase) * 3;
  const passo = andando ? Math.sin(t * 11 + fase) : 0;
  const balanco = zumbi ? Math.sin(t * 1.3 + fase) * 5 : 0;
  const treme = tremor ? Math.sin(t * 71 + fase) * 3.5 : 0;
  const quique = andando ? Math.abs(passo) * -8 : 0;

  const [bE, bD] = zumbi
    ? [22 + Math.sin(t * 1.3 + fase) * 10, -38 + Math.sin(t * 1.1 + fase) * 8]
    : bracos(pose, t, fase);

  // Piscar: desligado quando o personagem está em pânico ou é zumbi.
  const semPiscar = zumbi || expr === "panico" || expr === "congelado" || expr === "surpreso";
  const ciclo = (t * 30 + fase * 37) % 104;
  const piscar = semPiscar ? 1 : ciclo < 3 ? 0.1 : ciclo < 6 ? 0.6 : 1;
  const olhoY = r.olho * piscar;

  const px = Math.max(-1, Math.min(1, olhar[0])) * 11;
  const py = Math.max(-1, Math.min(1, olhar[1])) * 8;

  const braco = (lado: -1 | 1, ang: number) => (
    <g transform={`translate(${lado * 98} -520) rotate(${ang})`}>
      <rect x={-23} y={-12} width={46} height={196} rx={23} fill={roupa} />
      <circle cx={0} cy={196} r={25} fill={pele} />
    </g>
  );

  const fala = Math.abs(Math.sin(t * 17 + fase)) * 0.7 + Math.abs(Math.sin(t * 9.3 + fase)) * 0.3;

  const boca = () => {
    if (zumbi) return <rect x={-22} y={-642} width={44} height={16} rx={5} fill="#2a1114" />;
    if (falando) {
      const grito = r.boca === "grito";
      return (
        <g>
          <ellipse cx={0} cy={-630} rx={grito ? 30 : 21} ry={(grito ? 20 : 5) + fala * (grito ? 14 : 17)} fill="#5a1620" />
          {grito && <rect x={-18} y={-650} width={36} height={8} rx={3} fill="#f4efe6" />}
        </g>
      );
    }
    switch (r.boca) {
      case "tensa": return <path d="M-26 -626 Q0 -640 26 -626" fill="none" stroke={TINTA} strokeWidth={8} strokeLinecap="round" />;
      case "triste": return <path d="M-22 -622 Q0 -642 22 -622" fill="none" stroke={TINTA} strokeWidth={8} strokeLinecap="round" />;
      case "medo": return <ellipse cx={0} cy={-630} rx={15} ry={9} fill="#5a1620" />;
      case "grito": return <ellipse cx={0} cy={-628} rx={26} ry={24} fill="#5a1620" />;
      case "sorriso": return <path d="M-32 -642 Q0 -604 32 -642" fill="none" stroke={TINTA} strokeWidth={8} strokeLinecap="round" />;
      case "leve": return <path d="M-20 -636 Q0 -622 20 -636" fill="none" stroke={TINTA} strokeWidth={8} strokeLinecap="round" />;
      case "o": return <ellipse cx={0} cy={-630} rx={13} ry={17} fill="#5a1620" />;
      default: return <line x1={-22} y1={-630} x2={22} y2={-630} stroke={TINTA} strokeWidth={8} strokeLinecap="round" />;
    }
  };

  const sobr = (lado: -1 | 1) => {
    // b > 0: sobrancelha desce no centro (raiva). b < 0: sobe no centro (medo).
    const assim = expr === "desconfiado" && lado === 1 ? -10 : 0;
    const y = -742 - r.up + assim;
    const dentro = y + r.b;
    const fora = y - r.b;
    const x1 = lado * 14;
    const x2 = lado * 68;
    return <line x1={x1} y1={dentro} x2={x2} y2={fora} stroke={zumbi ? "transparent" : v.sobrancelha ?? (v.estilo === "grisalho" ? "#6f737b" : TINTA)} strokeWidth={9} strokeLinecap="round" />;
  };

  return (
    <g transform={`translate(${treme} ${quique}) rotate(${balanco})`}>
      {/* pernas e tênis */}
      {([-1, 1] as const).map((lado) => (
        <g key={lado} transform={`rotate(${lado * passo * 15} ${lado * 30} -250)`}>
          <rect x={lado === -1 ? -56 : 8} y={-262} width={48} height={236} rx={10} fill={v.calca} />
          <ellipse cx={lado * 34} cy={-14} rx={44} ry={19} fill={zumbi ? "#3b3b3b" : "#e9e6df"} />
        </g>
      ))}

      {/* tronco */}
      <g transform={`translate(0 ${respira * 0.5})`}>
        {v.estilo === "longo" && <rect x={-112} y={-770} width={224} height={250} rx={70} fill={v.cabelo} />}
        <rect x={-98} y={-562} width={196} height={326} rx={54} fill={roupa} />
        {v.casaco && <path d="M-98 -300 L-108 -92 L108 -92 L98 -300Z" fill={roupa} />}
        {v.casaco && <line x1={0} y1={-540} x2={0} y2={-96} stroke="#000" strokeOpacity={0.25} strokeWidth={6} />}
        {v.bolsa && (
          <g>
            <line x1={-78} y1={-556} x2={88} y2={-300} stroke={v.bolsa} strokeWidth={16} />
            <rect x={56} y={-320} width={78} height={70} rx={12} fill={v.bolsa} stroke="#1c140e" strokeWidth={5} />
          </g>
        )}
        {v.detalhe && v.estilo !== "gorro" && (
          <rect x={-30} y={-560} width={60} height={322} fill={v.detalhe} opacity={0.9} />
        )}
        {v.gravata && (
          <g>
            <path d="M-34 -562 L0 -520 L34 -562Z" fill="#f1f3f6" />
            <path d="M-12 -528 L12 -528 L18 -400 L0 -372 L-18 -400Z" fill="#7a2230" transform="rotate(6 0 -528)" />
          </g>
        )}
        {zumbi && <path d="M-60 -400 L-20 -360 L-50 -320 L-10 -300" stroke="#1b1b1b" strokeWidth={8} fill="none" opacity={0.6} />}
        {braco(-1, bE)}
        {braco(1, bD)}

        {/* pescoço e cabeça */}
        <rect x={-24} y={-604} width={48} height={56} fill={pele} />
        <g transform={`rotate(${zumbi ? 9 + balanco : py * 0.4 + (nega ? Math.sin(t * 7) * 9 : 0)} 0 -600)`}>
          <ellipse cx={0} cy={-690} rx={102} ry={110} fill={pele} />
          {v.barba && <path d="M-90 -660 Q-70 -580 0 -578 Q70 -580 90 -660 Q60 -610 0 -612 Q-60 -610 -90 -660Z" fill="#000" opacity={0.2} />}
          {v.barbaCor && <path d="M-100 -676 Q-96 -574 0 -566 Q96 -574 100 -676 Q70 -640 0 -650 Q-70 -640 -100 -676Z" fill={v.barbaCor} />}
          <Cabelo v={zumbi ? { ...v, cabelo: "#2c332b" } : v} />

          {/* olhos */}
          {([-1, 1] as const).map((lado) =>
            fechado ? (
              <path key={lado} d="M-24 0 Q0 16 24 0" transform={`translate(${lado * 41} -694)`} fill="none" stroke={TINTA} strokeWidth={7} strokeLinecap="round" />
            ) : (
              <g key={lado} transform={`translate(${lado * 41} -694) scale(1 ${olhoY})`}>
                {zumbi && <circle r={36} fill="#4f5f4c" opacity={0.55} />}
                <circle r={28} fill="#ffffff" stroke={TINTA} strokeWidth={5} />
                {!zumbi && <circle cx={px} cy={py} r={r.pupila} fill={TINTA} />}
              </g>
            ),
          )}
          {lagrima && <path d="M0 0 Q9 16 0 24 Q-9 16 0 0Z" transform={`translate(-48 ${-662 + ((t * 26 + fase * 9) % 44)})`} fill="#a9dcff" />}
          {sobr(-1)}
          {sobr(1)}
          {v.oculos && !zumbi && (
            <g fill="none" stroke="#20242c" strokeWidth={7}>
              <circle cx={-41} cy={-694} r={36} />
              <circle cx={41} cy={-694} r={36} />
              <line x1={-5} y1={-694} x2={5} y2={-694} />
            </g>
          )}
          {boca()}
          {r.suor && !zumbi && (
            <path
              d="M0 0 Q10 16 0 24 Q-10 16 0 0Z"
              transform={`translate(84 ${-760 + ((t * 60 + fase * 20) % 70)})`}
              fill="#9fd8ff"
            />
          )}
        </g>
      </g>
    </g>
  );
};
