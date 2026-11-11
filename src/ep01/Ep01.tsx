import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import manifesto from "./manifest.json";
import { Character, type Pose } from "../components/Character";
import { WordCaptions, type Word } from "../components/WordCaptions";
import { COLORS } from "../theme";
import { Patio, Sala, Subsolo } from "./cenarios";

type Fala = (typeof manifesto.falas)[number];
type Cena = (typeof manifesto.cenas)[number] & {
  escuro?: boolean; relogio?: string; confronto?: boolean; batidas?: number[]; sino?: number;
};

const falas = manifesto.falas as Fala[];
const cenas = manifesto.cenas as Cena[];
const FPS = manifesto.fps;

// Visual de cada personagem. Mesmo corpo do boneco base, com cores próprias.
const ELENCO: Record<string, { hoodie: string; skin: string; hair: string; scale?: number }> = {
  Daniel: { hoodie: "#f2793a", skin: "#f3b98a", hair: "#3a2a22" },
  Marina: { hoodie: "#8e4bd1", skin: "#e8b07f", hair: "#1c1410" },
  Pedro: { hoodie: "#3cb371", skin: "#f5c39b", hair: "#7a4b2a" },
  Lívia: { hoodie: "#e96f9b", skin: "#f1c3a0", hair: "#5a3420" },
  Rafael: { hoodie: "#2f7fd6", skin: "#d9a57c", hair: "#2a1d15", scale: 0.92 },
  Carlos: { hoodie: "#4a5870", skin: "#e7b58c", hair: "#9a9a9a" },
};
const ORDEM = ["Daniel", "Marina", "Pedro", "Lívia", "Rafael", "Carlos"];
const POS_PADRAO: Record<string, number> = { Daniel: 110, Marina: 290, Pedro: 470, Lívia: 650, Rafael: 830, Carlos: 1000 };
const POS_CONFRONTO: Record<string, number> = { Daniel: 180, Marina: 360, Pedro: 60, Lívia: 880, Rafael: 1000, Carlos: 620 };
const ALTURA_PES = 1640;

// ---------- personagens (só dentro da sala) ----------
const Personagens = ({ cena, t, falaAtiva }: { cena: Cena; t: number; falaAtiva?: Fala }) => {
  const { width, height } = useVideoConfig();
  const pos = cena.confronto ? POS_CONFRONTO : POS_PADRAO;
  const poseDe = (nome: string): Pose => {
    if (cena.confronto && nome === "Carlos" && falaAtiva?.p === "Carlos") return "shrug";
    if (cena.confronto && nome === "Daniel" && falaAtiva?.p === "Daniel") return "point";
    return "idle";
  };
  return (
    <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
      {ORDEM.map((nome, i) => {
        const e = ELENCO[nome];
        return (
          <g key={nome} transform={`translate(${pos[nome]} ${ALTURA_PES})`}>
            <Character
              pose={poseDe(nome)}
              talking={falaAtiva?.p === nome}
              hoodie={e.hoodie} skin={e.skin} hair={e.hair}
              scale={(e.scale ?? 1) * 0.4}
              enterAt={Math.round(i * 3)}
            />
          </g>
        );
      })}
    </svg>
  );
};

// ---------- alto-falante da Helena ----------
const Alto = ({ ativo, t }: { ativo: boolean; t: number }) => {
  if (!ativo) return null;
  const jitter = Math.sin(t * 60) * 4;
  return (
    <div style={{ position: "absolute", top: 1000, right: 80, transform: `translateX(${jitter}px)` }}>
      <div style={{ width: 170, height: 220, background: "#0d0f14", border: `8px solid ${COLORS.ink}`, borderRadius: 18, padding: 22, boxSizing: "border-box", boxShadow: "0 0 40px #7ef0ff55" }}>
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} style={{ height: 8, background: "#7ef0ff", opacity: 0.4 + 0.6 * Math.abs(Math.sin(t * 9 + i)), margin: "14px 0" }} />
        ))}
      </div>
    </div>
  );
};

// ---------- legendas com cor por personagem ----------
const corDoPersonagem = (p: string) => (p === "Helena" ? "#7ef0ff" : p === "Carlos" ? COLORS.yellow : COLORS.white);
const palavras: Word[] = falas.flatMap((f) => f.palavras.map((w) => ({ ...w, color: corDoPersonagem(f.p) })));

// ---------- episódio ----------
export const Ep01 = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cena = cenas.find((c) => t >= c.de && t < c.ate) ?? cenas[cenas.length - 1];
  const falaAtiva = falas.find((f) => t >= f.inicio - 0.05 && t < f.fim + 0.2);

  // batidas no piso: flash branco que decai + tremor da câmera
  const batidas = cenas.flatMap((c) => c.batidas ?? []);
  const batidaAtiva = batidas.find((b) => t >= b && t < b + 0.4);
  const flash = batidas.reduce((acc, b) => (t >= b && t < b + 0.35 ? Math.max(acc, 1 - (t - b) / 0.35) : acc), 0);
  const tremor = batidaAtiva !== undefined ? Math.sin(t * 90) * 12 : 0;

  // câmera: leve aproximação lenta dentro da sala
  const zoom = 1 + 0.015 * Math.sin(t * 0.35);

  return (
    <AbsoluteFill style={{ backgroundColor: "#05070b", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateX(${tremor}px) scale(${zoom})` }}>
        {cena.fundo === "sala" && <Sala t={t} escuro={cena.escuro} relogio={!!cena.relogio} />}
        {cena.fundo === "patio" && <Patio t={t} />}
        {cena.fundo === "subsolo" && <Subsolo t={t} />}
        {cena.fundo === "sala" && <Personagens cena={cena} t={t} falaAtiva={falaAtiva} />}
        {cena.fundo === "sala" && <Alto ativo={falaAtiva?.p === "Helena"} t={t} />}
      </AbsoluteFill>

      {flash > 0 && <AbsoluteFill style={{ background: "#fff", opacity: flash * 0.55 }} />}

      <WordCaptions words={palavras} perLine={3} y={0.3} />

      {/* falas */}
      {falas.map((f) => (
        <Sequence key={f.n} from={Math.round(f.inicio * FPS)}>
          <Audio src={staticFile(f.arquivo)} />
        </Sequence>
      ))}
      {/* estática no início das falas da Helena */}
      {manifesto.estatica.map((s, i) => (
        <Sequence key={`e${i}`} from={Math.round((s - 0.1) * FPS)}>
          <Audio src={staticFile("ep01/sfx/estatica.wav")} volume={0.25} />
        </Sequence>
      ))}
      {/* sino no início do episódio e no 3h17 */}
      {cenas.filter((c) => c.sino !== undefined).map((c) => (
        <Sequence key={c.id} from={Math.round((c.sino as number) * FPS)}>
          <Audio src={staticFile("ep01/sfx/sino.wav")} volume={0.5} />
        </Sequence>
      ))}
      {/* batidas no piso */}
      {batidas.map((b, i) => (
        <Sequence key={`b${i}`} from={Math.round(b * FPS)}>
          <Audio src={staticFile("ep01/sfx/batida.wav")} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const EP01_DURACAO = Math.round(manifesto.duracao * FPS);
export const EP01_FPS = FPS;
