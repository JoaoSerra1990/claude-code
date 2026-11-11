import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT } from "../theme";

type Props = {
  children: string;
  x: number;
  y: number;
  at?: number;
  color?: string;
};

/** Etiqueta em pílula que entra com um pulinho. */
export const Tag = ({ children, x, y, at = 0, color = COLORS.yellow }: Props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - at, fps, config: { damping: 10, mass: 0.6 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${pop})`,
        backgroundColor: color,
        color: COLORS.ink,
        border: `6px solid ${COLORS.ink}`,
        borderRadius: 22,
        padding: "10px 30px",
        fontFamily: FONT,
        fontSize: 58,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};
