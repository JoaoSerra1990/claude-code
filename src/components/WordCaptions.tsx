import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT } from "../theme";

export type Word = {
  text: string;
  /** Início e fim em segundos — vêm do serviço de voz ou da transcrição. */
  start: number;
  end: number;
  /** Cor de destaque opcional para a palavra. */
  color?: string;
};

type Props = {
  words: Word[];
  /** Quantas palavras aparecem juntas na tela. */
  perLine?: number;
  /** Posição vertical, de 0 (topo) a 1 (base). */
  y?: number;
};

const outline = (w: number) =>
  Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    return `${Math.cos(a) * w}px ${Math.sin(a) * w}px 0 ${COLORS.ink}`;
  }).join(", ");

export const WordCaptions = ({ words, perLine = 3, y = 0.6 }: Props) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const t = frame / fps;

  // Quebra a linha a cada `perLine` palavras ou no fim de uma frase.
  const lines: Word[][] = [[]];
  for (const word of words) {
    const line = lines[lines.length - 1];
    line.push(word);
    if (line.length >= perLine || /[.!?]$/.test(word.text)) lines.push([]);
  }
  if (lines[lines.length - 1].length === 0) lines.pop();

  // A linha fica na tela do início da sua primeira palavra até a próxima linha começar.
  const index = lines.findIndex((line, i) => {
    const next = lines[i + 1];
    return t >= line[0].start && (next ? t < next[0].start : t < line[line.length - 1].end + 0.4);
  });
  if (index === -1) return null;

  return (
    <AbsoluteFill style={{ top: height * y, height: "auto", alignItems: "center" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 26px",
          padding: "0 60px",
          fontFamily: FONT,
          fontSize: 104,
          lineHeight: 1.1,
          textTransform: "uppercase",
          textShadow: outline(9),
        }}
      >
        {lines[index].map((word, i) => {
          if (t < word.start) return null;
          const pop = spring({
            frame: frame - Math.round(word.start * fps),
            fps,
            config: { damping: 12, mass: 0.5 },
          });
          return (
            <span
              key={i}
              style={{
                color: word.color ?? COLORS.white,
                display: "inline-block",
                transform: `scale(${0.6 + 0.4 * pop})`,
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
