import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export type Pose = "idle" | "wave" | "point" | "shrug";

type Props = {
  pose?: Pose;
  /** Quadro em que o boneco entra em cena (pulo de entrada). */
  enterAt?: number;
  talking?: boolean;
  hoodie?: string;
  skin?: string;
  hair?: string;
  scale?: number;
};

const INK = "#1b1f27";

/**
 * Boneco original desenhado só com formas simples (círculos, retângulos e
 * curvas), cores chapadas e sem sombra. A origem (0,0) fica entre os pés.
 */
export const Character = ({
  pose = "idle",
  enterAt = 0,
  talking = false,
  hoodie = "#f2793a",
  skin = "#f3b98a",
  hair = "#3a2a22",
  scale = 1,
}: Props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const enter = spring({ frame: frame - enterAt, fps, config: { damping: 11, mass: 0.7 } });
  const bob = Math.sin(t * 2.4) * 6;

  // Pisca a cada ~3 segundos.
  const blinkPhase = frame % 92;
  const eyeOpen = interpolate(blinkPhase, [0, 3, 6], [1, 0.08, 1], {
    extrapolateRight: "clamp",
  });

  const mouthOpen = talking ? 0.5 + 0.5 * Math.sin(t * 16) : 0;

  const swing = Math.sin(t * 9) * 14;
  const arms: Record<Pose, [number, number]> = {
    idle: [8 + Math.sin(t * 2.4) * 3, -8 - Math.sin(t * 2.4) * 3],
    wave: [8, -150 + swing],
    point: [8, -92],
    shrug: [62, -62],
  };
  const [leftArm, rightArm] = arms[pose];

  const arm = (side: -1 | 1, angle: number) => (
    <g transform={`translate(${side * 92} -470) rotate(${angle})`}>
      <rect x={-24} y={-10} width={48} height={190} rx={24} fill={hoodie} />
      <circle cx={0} cy={192} r={27} fill={skin} />
    </g>
  );

  return (
    <g transform={`scale(${scale * enter}) translate(0 ${bob})`}>
      {/* pernas e tênis */}
      <rect x={-62} y={-210} width={50} height={190} fill="#2b3550" />
      <rect x={12} y={-210} width={50} height={190} fill="#2b3550" />
      <ellipse cx={-42} cy={-12} rx={50} ry={22} fill="#ffffff" />
      <ellipse cx={42} cy={-12} rx={50} ry={22} fill="#ffffff" />

      {arm(-1, leftArm)}
      {arm(1, rightArm)}

      {/* moletom */}
      <rect x={-112} y={-500} width={224} height={310} rx={70} fill={hoodie} />
      <rect x={-52} y={-300} width={104} height={56} rx={20} fill="rgba(0,0,0,0.14)" />
      <line x1={-18} y1={-492} x2={-18} y2={-420} stroke="#ffffff" strokeWidth={7} strokeLinecap="round" />
      <line x1={18} y1={-492} x2={18} y2={-420} stroke="#ffffff" strokeWidth={7} strokeLinecap="round" />

      {/* cabeça */}
      <g transform="translate(0 -640)">
        <circle r={150} fill={skin} />
        <path d="M-150 -18 A150 150 0 0 1 150 -18 Q96 -92 20 -72 Q-60 -52 -150 -18Z" fill={hair} />
        <circle cx={-34} cy={-150} r={34} fill={hair} />
        <circle cx={22} cy={-162} r={38} fill={hair} />
        <circle cx={76} cy={-136} r={30} fill={hair} />

        {[-56, 56].map((x) => (
          <g key={x} transform={`translate(${x} 4) scale(1 ${eyeOpen})`}>
            <circle r={36} fill="#ffffff" stroke={INK} strokeWidth={6} />
            <circle cx={pose === "point" ? 10 : 4} cy={2} r={15} fill={INK} />
          </g>
        ))}
        <circle cx={-98} cy={52} r={20} fill="#f08a7b" opacity={0.6} />
        <circle cx={98} cy={52} r={20} fill="#f08a7b" opacity={0.6} />

        {talking ? (
          <ellipse cx={0} cy={82} rx={30} ry={8 + mouthOpen * 20} fill="#7a1f2b" />
        ) : (
          <path d="M-42 68 Q0 108 42 68" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
        )}
      </g>
    </g>
  );
};
