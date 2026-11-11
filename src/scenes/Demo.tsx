import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { Character } from "../components/Character";
import { RaysBackground } from "../components/RaysBackground";
import { Tag } from "../components/Tag";
import { WordCaptions, type Word } from "../components/WordCaptions";
import { COLORS, VIDEO } from "../theme";

// Cena de teste: os tempos abaixo são escritos à mão. Num vídeo de verdade
// eles vêm do arquivo de voz (tempo de cada palavra).
const WORDS: Word[] = [
  { text: "Tudo", start: 0.3, end: 0.6 },
  { text: "desenhado", start: 0.6, end: 1.1 },
  { text: "por", start: 1.1, end: 1.3 },
  { text: "código,", start: 1.3, end: 1.9, color: COLORS.yellow },
  { text: "forma", start: 2.2, end: 2.6 },
  { text: "por", start: 2.6, end: 2.8 },
  { text: "forma.", start: 2.8, end: 3.4, color: COLORS.green },
  { text: "Bora", start: 4.0, end: 4.3 },
  { text: "animar?", start: 4.3, end: 5.0, color: COLORS.yellow },
];

const SCENE = 3.8 * VIDEO.fps;
export const DEMO_DURATION = Math.round(6 * VIDEO.fps);

const Stage = ({ pose }: { pose: "wave" | "point" }) => {
  const { width, height } = useVideoConfig();
  return (
    <svg width={width} height={height} style={{ position: "absolute" }}>
      <g transform={`translate(${width / 2} ${height - 60})`}>
        <Character pose={pose} talking enterAt={2} scale={0.95} />
      </g>
    </svg>
  );
};

export const Demo = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={SCENE}>
      <RaysBackground color={COLORS.blue} />
      <Stage pose="wave" />
      <Tag x={540} y={300} at={12}>Feito por código</Tag>
    </Sequence>
    <Sequence from={SCENE}>
      <RaysBackground color={COLORS.purple} />
      <Stage pose="point" />
      <Tag x={540} y={300} at={6} color={COLORS.green}>Próximo vídeo</Tag>
    </Sequence>
    <WordCaptions words={WORDS} y={0.3} />
  </AbsoluteFill>
);
