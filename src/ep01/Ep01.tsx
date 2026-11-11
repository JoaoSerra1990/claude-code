import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import manifesto from "./manifest.json";
import { Character, type Pose } from "../components/Character";
import { WordCaptions, type Word } from "../components/WordCaptions";
import { COLORS, FONT } from "../theme";

type Fala = (typeof manifesto.falas)[number];
type Cena = (typeof manifesto.cenas)[number] & {
  barricada?: boolean; zumbis?: boolean; relogio?: string; confronto?: boolean; batidas?: number[];
  sino?: number;
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


// ---------- cenários ----------
const Cenario = ({ tipo, cena, t }: { tipo: string; cena: Cena; t: number }) => {
  const piscar = cena.relogio && Math.sin(t * 17) > 0.5 ? 0.12 : 0;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {tipo === "patio" ? (
          <>
            <rect width={1080} height={1920} fill="#16122a" />
            <rect x={0} y={0} width={1080} height={900} fill="#231b3d" />
            {/* fachada da escola */}
            <rect x={80} y={380} width={920} height={560} fill="#2e2a3e" />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={140 + i * 220} y={470} width={140} height={120} fill="#4b4670" />
            ))}
            <rect x={440} y={740} width={200} height={200} fill="#1d1a2b" />
            <rect x={0} y={1500} width={1080} height={420} fill="#2a2433" />
          </>
        ) : tipo === "subsolo" ? (
          <>
            <rect width={1080} height={1920} fill="#0b0f16" />
            {Array.from({ length: 14 }, (_, i) => (
              <line key={`h${i}`} x1={0} x2={1080} y1={i * 140} y2={i * 140} stroke="#1e2a3a" strokeWidth={4} />
            ))}
            {Array.from({ length: 9 }, (_, i) => (
              <line key={`v${i}`} x1={i * 140} x2={i * 140} y1={0} y2={1920} stroke="#1e2a3a" strokeWidth={4} />
            ))}
            <rect x={300} y={1000} width={480} height={140} rx={16} fill="#1a2433" stroke="#3b4f6b" strokeWidth={6} />
            <rect x={460} y={260} width={160} height={36} rx={8} fill={COLORS.red} />
            <text x={540} y={286} textAnchor="middle" fontFamily={FONT} fontSize={28} fill="#fff">
              LABORATÓRIO
            </text>
          </>
        ) : (
          <>
            <rect width={1080} height={1920} fill="#141b28" />
            <rect x={0} y={1280} width={1080} height={640} fill="#232b38" />
            {/* quadro-negro e janela */}
            <rect x={120} y={220} width={840} height={300} rx={14} fill="#1f3a33" stroke="#4a3a2a" strokeWidth={16} />
            <rect x={120} y={600} width={300} height={260} fill="#2d3644" />
            <rect x={130} y={610} width={280} height={240} fill="#0f1620" opacity={0.6} />
            {/* porta */}
            <rect x={700} y={640} width={220} height={560} fill="#2b2f3a" />
            <rect x={886} y={900} width={12} height={40} fill="#8b8f99" />
          </>
        )}
        {cena.barricada && (
          <g>
            {[0, 1, 2].map((i) => (
              <rect key={i} x={680} y={1040 - i * 110} width={260} height={100} rx={8} fill="#6b4a2e" stroke="#2c1f13" strokeWidth={6} />
            ))}
          </g>
        )}
        {tipo === "sala" && (
          <g>
            {[120, 480, 840].map((x) => (
              <rect key={x} x={x} y={1470} width={160} height={24} fill="#4a3728" />
            ))}
          </g>
        )}
      </svg>
      {piscar > 0 && <AbsoluteFill style={{ background: "#000", opacity: piscar }} />}
      {cena.relogio && (
        <div
          style={{
            position: "absolute", top: 560, left: 0, right: 0, textAlign: "center",
            fontFamily: FONT, fontSize: 200, color: COLORS.red,
            textShadow: `0 0 30px ${COLORS.red}`, opacity: Math.sin(t * 17) > -0.2 ? 1 : 0.35,
          }}
        >
          {cena.relogio}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- personagens ----------
const Personagens = ({ cena, t, falaAtiva, zumbis }: { cena: Cena; t: number; falaAtiva?: Fala; zumbis: boolean }) => {
  const { width, height } = useVideoConfig();
  const pos = cena.confronto ? POS_CONFRONTO : POS_PADRAO;
  const poseDe = (nome: string): Pose => {
    if (nome === "Carlos" && (falaAtiva?.p === "Carlos") && cena.confronto) return "shrug";
    if (cena.confronto && falaAtiva?.p === "Daniel" && nome === "Daniel") return "point";
    return "idle";
  };
  return (
    <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
      {zumbis &&
        [160, 380, 600, 820, 960].map((x, i) => (
          <g key={`z${i}`} transform={`translate(${x} ${1460 - (i % 2) * 40})`} opacity={0.9}>
            <Character
              pose={i % 2 ? "wave" : "idle"} scale={0.34} talking={false}
              hoodie="#4b3a2c" skin="#7fa37a" hair="#20261d"
            />
          </g>
        ))}
      {ORDEM.map((nome, i) => {
        const e = ELENCO[nome];
        return (
          <g key={nome} transform={`translate(${pos[nome]} ${ALTURA_PES})`}>
            <Character
              pose={poseDe(nome)}
              talking={falaAtiva?.p === nome && t >= (falaAtiva?.inicio ?? 0)}
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
  const { width, height } = useVideoConfig();
  const t = frame / FPS;
  const cena = cenas.find((c) => t >= c.de && t < c.ate) ?? cenas[cenas.length - 1];
  const falaAtiva = falas.find((f) => t >= f.inicio - 0.05 && t < f.fim + 0.2);

  // batidas no piso: flash branco que decai + tremor da câmera
  const batidas = cenas.flatMap((c) => c.batidas ?? []);
  const batidaAtiva = batidas.find((b) => t >= b && t < b + 0.4);
  const flash = batidas.reduce((acc, b) => (t >= b && t < b + 0.35 ? Math.max(acc, 1 - (t - b) / 0.35) : acc), 0);
  const tremor = batidaAtiva !== undefined ? Math.sin(t * 90) * 12 : 0;

  // cenas de transição: sino no início de cenas marcadas
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070b", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateX(${tremor}px)` }}>
        <Cenario tipo={cena.fundo} cena={cena} t={t} />
        <Personagens cena={cena} t={t} falaAtiva={falaAtiva} zumbis={!!cena.zumbis} />
        <Alto ativo={falaAtiva?.p === "Helena"} t={t} />
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
