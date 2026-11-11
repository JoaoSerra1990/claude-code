import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

type Props = {
  color: string;
  /** Cor dos raios claros; por padrão, branco translúcido sobre a cor base. */
  rayColor?: string;
  rays?: number;
  /** Graus por segundo. */
  speed?: number;
};

export const RaysBackground = ({
  color,
  rayColor = "rgba(255,255,255,0.13)",
  rays = 18,
  speed = 6,
}: Props) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const cx = width / 2;
  const cy = height * 0.42;
  const radius = Math.hypot(width, height);
  const step = (Math.PI * 2) / rays;

  const wedges = Array.from({ length: rays }, (_, i) => {
    const a0 = i * step;
    const a1 = a0 + step / 2;
    const p = (a: number) => `${cx + Math.cos(a) * radius},${cy + Math.sin(a) * radius}`;
    return <polygon key={i} points={`${cx},${cy} ${p(a0)} ${p(a1)}`} fill={rayColor} />;
  });

  return (
    <AbsoluteFill style={{ backgroundColor: color }}>
      <svg width={width} height={height}>
        <g transform={`rotate(${(frame / fps) * speed} ${cx} ${cy})`}>{wedges}</g>
      </svg>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.38) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
