import type { ReactNode } from "react";
import { AbsoluteFill, Audio, Easing, Sequence, staticFile, useCurrentFrame } from "remotion";
import { WordCaptions, type Word } from "../components/WordCaptions";
import { COLORS } from "../theme";
import { Ator, type Expr, type PoseA, type Visual } from "./Ator";
import { Fachada, MUNDO_ALTURA, Patio, Sala, type SalaProps } from "./cenarios";

// Motor de cena da série: cada episódio é uma lista de planos (shots). Um plano
// define o enquadramento da câmera, a luz e o que cada ator faz. O episódio
// fornece ainda os eventos de cenário (fx), objetos, sobreposições e sons.

export type Nome = "Daniel" | "Marina" | "Pedro" | "Lívia" | "Rafael" | "Carlos";
export const NOMES: Nome[] = ["Daniel", "Marina", "Pedro", "Lívia", "Rafael", "Carlos"];

// Aparência fixa do elenco em toda a temporada.
export const VISUAL: Record<Nome, Visual> = {
  Daniel: { pele: "#e9b48a", cabelo: "#2e211b", roupa: "#b9532a", detalhe: "#e8e4dc", calca: "#2a3147", estilo: "curto" },
  Marina: { pele: "#d9a074", cabelo: "#17110e", roupa: "#6a3fa3", calca: "#22252e", estilo: "rabo", oculos: true },
  Pedro: { pele: "#f0c19b", cabelo: "#6e4426", roupa: "#2f8a58", detalhe: "#d8d36a", calca: "#3a3f4d", estilo: "cacheado" },
  Lívia: { pele: "#f1cbb0", cabelo: "#4d2d1c", roupa: "#b85a7c", calca: "#2b2f3b", estilo: "longo" },
  Rafael: { pele: "#c99670", cabelo: "#1d3f73", roupa: "#2b63ad", detalhe: "#2a70c9", calca: "#30343f", estilo: "gorro" },
  Carlos: { pele: "#e2b08a", cabelo: "#9a9da4", roupa: "#cfd5de", calca: "#3b3f4a", estilo: "grisalho", oculos: true, gravata: true, barba: true },
};

export type Est = {
  x: number; y: number; s: number;
  expr: Expr; pose: PoseA; olhar: [number, number];
  xPara?: number; yPara?: number; tremor?: boolean; oculto?: boolean;
  /** Olhos fechados, lágrima no rosto e cabeça balançando em negativa. */
  fechado?: boolean; lagrima?: boolean; nega?: boolean;
};
export type Bloco = Record<string, Est>;
export const est = (
  x: number, y: number, s: number, expr: Expr = "medo",
  olhar: [number, number] = [0, 0], pose: PoseA = "parado",
): Est => ({ x, y, s, expr, pose, olhar });

/** Posição do rosto de um ator, em coordenadas de mundo. */
export const rosto = (b: Bloco, n: string): [number, number] => [b[n].x, b[n].y - 690 * b[n].s];

export type Cam = [number, number, number]; // centro x, centro y, zoom
export type Luz = "normal" | "vermelha" | "ciano" | "pisca" | "noite" | "fria" | "dourada" | "abajur" | "dia" | "ameaca";
export type Shot = {
  id: string; de: number; ate: number;
  /** "sala", "patio" e "fachada" são da série; outros nomes pedem um `cenario` próprio. */
  fundo: string;
  cam: [Cam, Cam];
  luz?: Luz; tremor?: number; bloco?: string; mesa?: boolean;
  /** Permite que a câmera desça abaixo do piso da sala. */
  subsolo?: boolean;
  at?: Record<string, Partial<Est>>;
};

export type Palavra = { text: string; start: number; end: number };
export type Fala = { n: string; p: string; arquivo: string; inicio: number; fim: number; palavras: Palavra[] };
export type Manifesto = { fps: number; duracao: number; falas: Fala[] };

export type Contexto = { t: number; shot: Shot; p: number; fala?: Fala; falando: boolean };
export type Fx = {
  sala?: Partial<SalaProps>;
  /** Tremor extra de câmera, de 0 a 1. */
  impacto?: number;
  /** Clarão branco, de 0 a 1. */
  flash?: number;
  /** Clarão que toma a tela inteira (transições), de 0 a 1, e sua cor. */
  clarao?: number;
  claraoCor?: string;
};

/** Ajudantes para marcar tempos a partir das falas. */
export const tempos = (m: Manifesto) => {
  const F = Object.fromEntries(m.falas.map((f) => [f.n, f]));
  return {
    ini: (n: string) => F[n].inicio,
    fim: (n: string) => F[n].fim,
    /** Início da primeira palavra da fala `n` que começa com `prefixo`. */
    pal: (n: string, prefixo: string) =>
      F[n].palavras.find((w) => w.text.toLowerCase().startsWith(prefixo))?.start ?? F[n].inicio,
  };
};

/** Vai de 1 a 0 ao longo de `dur` segundos a partir de `em`; 0 fora disso. */
export const decai = (t: number, em: number, dur: number) => (t >= em && t < em + dur ? 1 - (t - em) / dur : 0);
/** Vai de 0 a 1 entre `de` e `ate`, com limites. */
export const sobe = (t: number, de: number, ate: number) => Math.min(1, Math.max(0, (t - de) / (ate - de)));

export const Som = ({ em, src, fps, volume = 1, dur, some }: {
  em: number; src: string; fps: number; volume?: number; dur?: number;
  /** Segundos de fade no fim do trecho (exige `dur`). */
  some?: number;
}) => {
  const quadros = dur ? Math.round(dur * fps) : undefined;
  return (
    <Sequence from={Math.max(0, Math.round(em * fps))} durationInFrames={quadros}>
      <Audio
        src={staticFile(src)}
        volume={some && quadros ? (f) => volume * Math.min(1, Math.max(0, (quadros - f) / (some * fps))) : volume}
      />
    </Sequence>
  );
};

const suave = Easing.inOut(Easing.cubic);

type Props = {
  manifesto: Manifesto;
  shots: Shot[];
  blocos: Record<string, Bloco>;
  /** Momento do corte seco para preto. */
  preto: number;
  fx: (c: Contexto) => Fx;
  /** Objetos do cenário ordenados em profundidade junto com os atores. */
  itens?: (c: Contexto) => { y: number; el: ReactNode }[];
  /** Elementos de mundo desenhados na frente dos atores. */
  frente?: (c: Contexto) => ReactNode;
  /** Sobreposições em coordenadas de tela, abaixo das legendas. */
  sobre?: (c: Contexto) => ReactNode;
  /** Conteúdo mostrado sobre a tela preta final. */
  final?: (t: number) => ReactNode;
  corLegenda?: (personagem: string) => string;
  /** Elenco do projeto; por padrão, o da série. */
  elenco?: Record<string, Visual>;
  /** Desenha o fundo de planos cujo `fundo` não é da série. */
  cenario?: (c: Contexto) => ReactNode;
  legendas?: boolean;
  /** Força do escurecimento nas bordas, de 0 a 1. */
  vinheta?: number;
  /** Faixa contínua de fundo, em loop até o corte para preto. */
  trilha?: string;
  sons?: ReactNode;
};

export const Episodio = ({
  manifesto, shots, blocos, preto, fx, itens, frente, sobre, final, corLegenda, trilha, sons,
  elenco = VISUAL, cenario, legendas = true, vinheta = 0.72,
}: Props) => {
  const frame = useCurrentFrame();
  const fps = manifesto.fps;
  const t = frame / fps;
  const escuro = t >= preto;
  const shot = shots.find((s) => t >= s.de && t < s.ate) ?? shots[shots.length - 1];
  const p = suave(sobe(t, shot.de, shot.ate));
  const lerp = (a: number, b: number) => a + (b - a) * p;

  // A boca só abre durante as palavras de quem está falando.
  const fala = manifesto.falas.find((f) => t >= f.inicio && t < f.fim);
  const falando = !!fala?.palavras.some((w) => t >= w.start - 0.03 && t < w.end + 0.05);
  const ctx: Contexto = { t, shot, p, fala, falando };
  const efeitos = fx(ctx);

  // câmera
  const z = lerp(shot.cam[0][2], shot.cam[1][2]);
  const forca = (shot.tremor ?? 0) + (efeitos.impacto ?? 0) * 16;
  const altura = shot.fundo !== "sala" ? 1920 : shot.subsolo ? MUNDO_ALTURA : 2050;
  const limita = (v: number, meio: number, max: number) => Math.min(max - meio, Math.max(meio, v));
  const cx = limita(lerp(shot.cam[0][0], shot.cam[1][0]), 540 / z, 1080) + Math.sin(t * 47) * forca * 0.5 + Math.sin(t * 0.9) * 3;
  const cy = limita(lerp(shot.cam[0][1], shot.cam[1][1]), 960 / z, altura) + Math.cos(t * 53) * forca * 0.5 + Math.sin(t * 0.7) * 3;
  const viewBox = `${cx - 540 / z} ${cy - 960 / z} ${1080 / z} ${1920 / z}`;

  // luz
  const luzTipo: Luz = shot.luz ?? "normal";
  const apagao = luzTipo === "pisca" ? (Math.sin(t * 23) * Math.sin(t * 7.3) > 0.1 ? 0.15 : 0.9) : 1;
  const nivelLuz = luzTipo === "vermelha" ? 0.1 : luzTipo === "ciano" ? 0.35 : 0.8 * apagao;
  const tinta: Record<Luz, string> = {
    normal: "rgba(8,14,34,0.34)",
    vermelha: `rgba(150,10,14,${0.36 + 0.2 * Math.sin(t * 9) ** 2})`,
    ciano: "rgba(10,70,96,0.36)",
    pisca: `rgba(4,6,14,${apagao < 0.5 ? 0.7 : 0.3})`,
    noite: "rgba(6,10,30,0.2)",
    fria: "rgba(188,204,232,0.95)",
    dourada: "rgba(255,226,176,0.95)",
    abajur: "rgba(214,168,112,0.95)",
    dia: "rgba(255,255,255,1)",
    ameaca: "rgba(150,168,186,0.95)",
  };

  // atores e objetos do plano, ordenados por profundidade
  const bloco = shot.bloco ? blocos[shot.bloco] : null;
  const nomes = Object.keys(elenco);
  const atores = bloco
    ? Object.keys(bloco).filter((nome) => !({ ...bloco[nome], ...(shot.at?.[nome] ?? {}) }).oculto).map((nome) => {
        const e = { ...bloco[nome], ...(shot.at?.[nome] ?? {}) };
        const x = e.xPara !== undefined ? lerp(e.x, e.xPara) : e.x;
        const y = e.yPara !== undefined ? lerp(e.y, e.yPara) : e.y;
        const andando = (e.xPara !== undefined || e.yPara !== undefined) && p > 0.02 && p < 0.98;
        const i = nomes.indexOf(nome);
        return {
          y,
          el: (
            <g key={nome} transform={`translate(${x} ${y}) scale(${e.s})`}>
              <ellipse cx={0} cy={0} rx={120} ry={22} fill="#000" opacity={0.35} />
              <Ator v={elenco[nome]} t={t} expr={e.expr} pose={e.pose} olhar={e.olhar}
                falando={fala?.p === nome && falando} andando={andando} tremor={e.tremor}
                fechado={e.fechado} lagrima={e.lagrima} nega={e.nega} fase={i * 1.9} />
            </g>
          ) as ReactNode,
        };
      })
    : [];
  const cena = [...atores, ...(itens?.(ctx) ?? [])].sort((a, b) => a.y - b.y);

  const palavras: Word[] = manifesto.falas.flatMap((f) =>
    f.palavras.map((w) => ({ ...w, color: corLegenda?.(f.p) ?? COLORS.white })),
  );
  const flash = efeitos.flash ?? 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {!escuro && shot.fundo !== "preto" && (
        <>
          <svg width={1080} height={1920} viewBox={viewBox} preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
            {shot.fundo === "patio" && <Patio t={t} />}
            {shot.fundo === "fachada" && <Fachada t={t} />}
            {shot.fundo === "sala" && <Sala t={t} luz={nivelLuz} mesa={!!shot.mesa} {...efeitos.sala} />}
            {!["sala", "patio", "fachada"].includes(shot.fundo) && cenario?.(ctx)}
            {cena.map((c) => c.el)}
            {frente?.(ctx)}
          </svg>
          <AbsoluteFill style={{ background: tinta[luzTipo], mixBlendMode: "multiply" }} />
          {(luzTipo === "vermelha" || luzTipo === "ciano") && (
            <AbsoluteFill style={{ background: luzTipo === "vermelha" ? "rgba(255,40,40,0.10)" : "rgba(80,230,255,0.08)" }} />
          )}
          <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,${vinheta}) 100%)` }} />
          {flash > 0 && <AbsoluteFill style={{ background: "#fff", opacity: flash * 0.22 }} />}
        </>
      )}
      {!escuro && sobre?.(ctx)}
      {!escuro && (efeitos.clarao ?? 0) > 0 && (
        <AbsoluteFill style={{ background: efeitos.claraoCor ?? "#fff", opacity: efeitos.clarao }} />
      )}
      {escuro && final?.(t)}
      {!escuro && legendas && <WordCaptions words={palavras} perLine={3} y={0.69} size={86} />}

      {manifesto.falas.map((f) => (
        <Sequence key={f.n} from={Math.round(f.inicio * fps)}>
          <Audio src={staticFile(f.arquivo)} />
        </Sequence>
      ))}
      {trilha && (
        <Sequence durationInFrames={Math.round(preto * fps)}>
          <Audio src={staticFile(trilha)} volume={0.28} loop />
        </Sequence>
      )}
      {sons}
    </AbsoluteFill>
  );
};
