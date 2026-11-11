import { AbsoluteFill } from "remotion";
import manifestoJson from "./manifest.json";
import { FONT } from "../theme";
import { Ator } from "../serie/Ator";
import { FALANTE, VIDRO_PORTA } from "../serie/cenarios";
import {
  Episodio, NOMES, Som, VISUAL, decai, est as e, rosto, sobe, tempos,
  type Bloco, type Contexto, type Manifesto, type Shot,
} from "../serie/motor";
import { Titulo, corLegenda } from "../ep01/Ep01";

// Episódio 2 — O que existe sob o chão?
// Retoma o instante das três batidas: mesma sala, mesmas roupas e posições do
// final do episódio 1. A luz segue azul fria; o vermelho só entra quando a
// escotilha abre.

const manifesto = manifestoJson as Manifesto;
const FPS = manifesto.fps;
const PRETO = manifestoJson.preto;
const { ini, fim, pal } = tempos(manifesto);

const BLOCOS: Record<string, Bloco> = {
  inicio: {
    Daniel: e(500, 1680, 0.72, "medo", [0, 1]),
    Pedro: e(250, 1620, 0.68, "medo", [0.8, 0.8]),
    Rafael: e(110, 1640, 0.62, "medo", [0.9, 0.8]),
    Lívia: e(1010, 1630, 0.68, "medo", [-0.8, 0.8], "abracar"),
    Marina: e(900, 1750, 0.7, "medo", [-0.8, 0.8]),
    Carlos: e(930, 1520, 0.8, "congelado", [-0.6, 1]),
  },
  mesa: {
    Daniel: e(350, 1700, 0.72, "desconfiado", [1, -0.2]),
    Pedro: e(250, 1620, 0.68, "medo", [1, 0.2]),
    Rafael: e(110, 1640, 0.62, "medo", [1, 0.6]),
    Lívia: e(1010, 1630, 0.68, "medo", [-0.8, 0.6], "abracar"),
    Marina: e(900, 1750, 0.7, "desconfiado", [-1, -0.3]),
    Carlos: e(760, 1610, 0.8, "medo", [-0.5, 0.8]),
  },
  placa: {
    Daniel: e(350, 1700, 0.72, "medo", [0.8, 0.8]),
    Pedro: e(250, 1620, 0.68, "medo", [1, 0.2]),
    Rafael: e(400, 1800, 0.62, "surpreso", [0.6, 1], "apontarDir"),
    Lívia: e(1010, 1630, 0.68, "medo", [-0.8, 0.6], "abracar"),
    Marina: e(900, 1750, 0.7, "desconfiado", [-1, -0.3]),
    Carlos: e(760, 1610, 0.8, "medo", [-0.5, 0.8]),
  },
  recuo: {
    Daniel: e(300, 1720, 0.72, "panico", [0.8, 0.8], "recuar"),
    Pedro: e(190, 1610, 0.68, "panico", [1, 0.8], "recuar"),
    Rafael: e(110, 1800, 0.62, "panico", [1, 0.6], "recuar"),
    Lívia: e(1020, 1640, 0.68, "congelado", [-0.8, 0.8], "abracar"),
    Marina: e(930, 1770, 0.7, "panico", [-1, 0.6], "recuar"),
    Carlos: e(830, 1600, 0.8, "congelado", [-0.6, 1], "recuar"),
  },
};

const [FX, FY] = FALANTE;
const G = ini("17") - fim("16"); // intervalo sem falas: escotilha, mão e fotografia
const T_ABRE = fim("16") + 0.15;
const T_MAO = fim("16") + 0.3 * G;
const T_FRENTE = fim("16") + 0.5 * G;
const T_VERSO = fim("16") + 0.74 * G;
const T_DANIEL = fim("16") + 0.97 * G;
const P = BLOCOS.placa;

const SHOTS: Shot[] = [
  // 1. Gancho: preto, três batidas; o alto-falante acende e chama Daniel.
  { id: "preto", de: 0, ate: 1.5, fundo: "preto", cam: [[540, 960, 1], [540, 960, 1]] },
  { id: "falante_chama", de: 1.5, ate: pal("01", "não") - 0.1, fundo: "sala", bloco: "inicio", luz: "ciano", tremor: 3,
    cam: [[FX, FY, 2.4], [FX, FY, 2.9]] },
  { id: "daniel_ouve", de: pal("01", "não") - 0.1, ate: fim("01") + 0.2, fundo: "sala", bloco: "inicio", luz: "ciano",
    cam: [[650, 830, 1.3], [640, 850, 1.45]],
    at: { Daniel: { expr: "congelado", olhar: [0.7, -1] }, Carlos: { olhar: [-0.6, -1] }, Marina: { olhar: [-0.4, -1] }, Lívia: { olhar: [-0.8, -1] } } },
  { id: "daniel_grita", de: fim("01") + 0.2, ate: fim("02") + 0.3, fundo: "sala", bloco: "inicio", tremor: 4,
    cam: [[560, 1180, 1.7], [540, 1190, 2.0]], at: { Daniel: { expr: "panico", olhar: [0.7, -1] } } },

  // 2. Carlos perde o controle.
  { id: "carlos_mesa", de: fim("02") + 0.3, ate: fim("03") + 0.25, fundo: "sala", bloco: "inicio", tremor: 3,
    cam: [[800, 1340, 1.45], [650, 1380, 1.65]],
    at: {
      Carlos: { x: 960, xPara: 760, y: 1520, yPara: 1610, expr: "panico", pose: "empurrar", olhar: [-0.8, 0.8] },
      Daniel: { xPara: 350, yPara: 1700, pose: "recuar", olhar: [1, 0.4] },
    } },
  { id: "marina_pergunta", de: fim("03") + 0.25, ate: fim("04") + 0.2, fundo: "sala", bloco: "mesa",
    cam: [[864, 1270, 2.3], [864, 1262, 2.6]] },
  { id: "vibra", de: fim("04") + 0.2, ate: ini("05") - 1.2, fundo: "sala", bloco: "mesa", tremor: 5,
    cam: [[560, 1780, 2.1], [560, 1790, 2.5]] },

  // 3. A descoberta.
  { id: "placa", de: ini("05") - 1.2, ate: ini("05") + 1.0, fundo: "sala", bloco: "mesa",
    cam: [[520, 1740, 2.0], [560, 1790, 3.0]],
    at: { Rafael: { xPara: 400, yPara: 1800, pose: "apontarDir", expr: "surpreso", olhar: [0.6, 1] } } },
  { id: "rafael_rosto", de: ini("05") + 1.0, ate: fim("05") + 0.2, fundo: "sala", bloco: "placa",
    cam: [[410, 1380, 2.5], [410, 1372, 2.8]] },
  { id: "pedro_pergunta", de: fim("05") + 0.2, ate: fim("06") + 0.2, fundo: "sala", bloco: "placa",
    cam: [[rosto(P, "Pedro")[0], rosto(P, "Pedro")[1], 2.6], [rosto(P, "Pedro")[0], rosto(P, "Pedro")[1], 2.8]] },
  { id: "carlos_enterrada", de: fim("06") + 0.2, ate: fim("07") + 0.35, fundo: "sala", bloco: "placa",
    cam: [[760, 1070, 2.3], [760, 1058, 2.9]], at: { Carlos: { expr: "triste", olhar: [-0.9, -0.5] } } },

  // 4. Alguém está observando.
  { id: "zumbi_vidro", de: fim("07") + 0.35, ate: ini("08") - 0.45, fundo: "sala", bloco: "placa", tremor: 2,
    cam: [[VIDRO_PORTA[0], VIDRO_PORTA[1] + 30, 2.6], [VIDRO_PORTA[0], VIDRO_PORTA[1] + 10, 3.2]] },
  { id: "falante", de: ini("08") - 0.45, ate: fim("08") + 0.2, fundo: "sala", bloco: "placa", luz: "ciano", tremor: 4,
    cam: [[FX, FY, 2.5], [FX, FY, 3.0]] },
  { id: "carlos_implora", de: fim("08") + 0.2, ate: fim("09") + 0.2, fundo: "sala", bloco: "placa", luz: "ciano",
    cam: [[775, 800, 1.5], [775, 780, 1.7]], at: { Carlos: { expr: "panico", pose: "recuar", olhar: [0.2, -1] } } },
  { id: "marina_acusa", de: fim("09") + 0.2, ate: fim("10") + 0.3, fundo: "sala", bloco: "placa",
    cam: [[850, 1230, 1.95], [850, 1225, 2.2]],
    at: { Marina: { expr: "bravo", pose: "apontarEsq", olhar: [-1, -0.5] }, Carlos: { expr: "medo", olhar: [0.8, 0.5] } } },

  // 5. O segredo começa a aparecer.
  { id: "carlos_daniel", de: fim("10") + 0.3, ate: fim("11") + 0.2, fundo: "sala", bloco: "placa",
    cam: [[410, 1160, 2.1], [410, 1150, 2.5]],
    at: { Carlos: { x: 480, y: 1690, expr: "firme", pose: "empurrar", olhar: [-1, 0.2], tremor: true }, Daniel: { expr: "medo", olhar: [1, -0.2] }, Rafael: { x: 720 } } },
  { id: "daniel_explode", de: fim("11") + 0.2, ate: fim("12") + 0.2, fundo: "sala", bloco: "placa", tremor: 6,
    cam: [[350, 1210, 2.8], [350, 1203, 3.1]],
    at: { Carlos: { x: 520, y: 1690, expr: "medo", pose: "recuar" }, Daniel: { expr: "panico", pose: "recuar", olhar: [0.6, -0.6] } } },
  { id: "helena_responde", de: fim("12") + 0.2, ate: pal("13", "motivo") - 0.05, fundo: "sala", bloco: "placa", luz: "ciano", tremor: 3,
    cam: [[FX, FY, 2.5], [FX, FY, 2.9]] },
  { id: "livia_reconhece", de: pal("13", "motivo") - 0.05, ate: fim("13") + 0.45, fundo: "sala", bloco: "placa", luz: "ciano",
    cam: [[900, 1175, 2.5], [900, 1162, 3.2]], at: { Lívia: { expr: "congelado", olhar: [0, 0], tremor: true } } },

  // 6. Contagem regressiva.
  { id: "contagem", de: fim("13") + 0.45, ate: ini("14") - 0.15, fundo: "sala", bloco: "placa",
    cam: [[540, 1240, 1.12], [540, 1220, 1.22]],
    at: { Daniel: { olhar: [0.6, -1] }, Pedro: { olhar: [0.8, -1] }, Rafael: { olhar: [0.6, -1] }, Marina: { expr: "medo", olhar: [-0.3, -1] }, Lívia: { olhar: [-0.5, -1] }, Carlos: { expr: "congelado", olhar: [0.2, -1] } } },
  { id: "dez_segundos", de: ini("14") - 0.15, ate: fim("14") + 0.25, fundo: "sala", bloco: "placa", luz: "ciano", tremor: 4,
    cam: [[FX, FY, 2.8], [FX, FY, 3.2]] },
  { id: "pedro_chao", de: fim("14") + 0.25, ate: fim("15") + 0.2, fundo: "sala", bloco: "placa", tremor: 6,
    cam: [[320, 1400, 1.7], [430, 1560, 1.95]],
    at: { Pedro: { expr: "panico", pose: "apontarDir", olhar: [1, 1], tremor: true }, Daniel: { expr: "panico", pose: "recuar" } } },
  { id: "carlos_agora", de: fim("15") + 0.2, ate: T_ABRE, fundo: "sala", bloco: "placa", tremor: 9,
    cam: [[760, 1075, 2.2], [760, 1060, 2.5]], at: { Carlos: { expr: "panico", pose: "recuar", olhar: [-0.4, 0.4], tremor: true } } },

  // 7. Cliffhanger: a escotilha, a mão e a fotografia.
  { id: "escotilha", de: T_ABRE, ate: T_MAO, fundo: "sala", bloco: "recuo", luz: "vermelha", tremor: 6,
    cam: [[560, 1620, 1.5], [560, 1730, 2.2]] },
  { id: "mao", de: T_MAO, ate: T_FRENTE, fundo: "sala", bloco: "recuo", luz: "vermelha",
    cam: [[585, 1740, 2.5], [595, 1715, 3.1]] },
  { id: "foto", de: T_FRENTE, ate: T_DANIEL, fundo: "sala", bloco: "recuo", luz: "vermelha",
    cam: [[300, 1223, 2.4], [300, 1223, 2.6]] },
  { id: "daniel_final", de: T_DANIEL, ate: pal("17", "como") - 0.1, fundo: "sala", bloco: "recuo", luz: "vermelha",
    cam: [[300, 1228, 2.7], [300, 1223, 3.0]],
    at: { Daniel: { expr: "congelado", pose: "parado", olhar: [1, -0.4], tremor: true } } },
  { id: "carlos_final", de: pal("17", "como") - 0.1, ate: PRETO, fundo: "sala", bloco: "recuo", luz: "vermelha",
    cam: [[830, 1052, 2.7], [830, 1048, 3.4]],
    at: { Carlos: { expr: "congelado", pose: "parado", olhar: [-1, 0.3], tremor: true }, Daniel: { expr: "congelado", pose: "parado" } } },
];

const plano = (id: string) => SHOTS.find((s) => s.id === id)!;
const MESA = plano("carlos_mesa"), VIBRA = plano("vibra"), PLACA = plano("placa");
const ZUMBI = plano("zumbi_vidro"), CONTAGEM = plano("contagem"), PEDRO_CHAO = plano("pedro_chao");
const BATIDAS = [0.15, 0.6, 1.05];
const BIPES = [CONTAGEM.de + 0.2, CONTAGEM.de + 0.8, CONTAGEM.de + 1.4];

/** Tremor contínuo do piso, de 0 a 1. */
const tremorPiso = (t: number) =>
  (t >= VIBRA.de && t < VIBRA.ate) || (t >= PEDRO_CHAO.de && t < T_ABRE + 1.2) ? 0.3 + 0.25 * Math.abs(Math.sin(t * 38)) : 0;

const fx = ({ t, fala, shot }: Contexto) => {
  const piso = tremorPiso(t);
  return {
    sala: {
      falante: fala?.p === "Helena" || fala?.p === "Desconhecida" || shot.id === "falante" || shot.id === "falante_chama" || shot.id === "contagem",
      arranha: t >= ZUMBI.de && t < ZUMBI.ate ? sobe(t, ZUMBI.de, ZUMBI.ate - 0.2) : null,
      rachadura: 1,
      batida: piso * 0.5,
      afasta: sobe(t, PLACA.de + 0.4, PLACA.de + 1.6),
      escotilha: sobe(t, T_ABRE + 0.7, T_MAO - 0.2),
      maoFoto: t < T_FRENTE ? sobe(t, T_MAO + 0.2, T_FRENTE - 0.5) : 0,
    },
    impacto: piso * 0.6,
    flash: Math.max(...BIPES.map((b) => decai(t, b, 0.25))) * 0.6,
  };
};

// Mesa que Carlos arrasta para cima do piso; a escotilha a derruba.
const itens = ({ t, shot, p }: Contexto) => {
  if (t < MESA.de) return [];
  const voa = sobe(t, T_ABRE + 0.3, T_ABRE + 1.0);
  if (voa >= 1) return [];
  const x = shot.id === "carlos_mesa" ? 770 - 200 * p : 570 + voa * 520 + Math.sin(t * 60) * tremorPiso(t) * 8;
  return [{
    y: 1795,
    el: (
      <g key="mesa" transform={`translate(${x} 0) rotate(${voa * 70} 0 1795)`}>
        <rect x={-150} y={1640} width={300} height={30} fill="#6b5238" stroke="#2c1f13" strokeWidth={5} />
        <rect x={-136} y={1670} width={16} height={125} fill="#3a2c1e" />
        <rect x={120} y={1670} width={16} height={125} fill="#3a2c1e" />
      </g>
    ),
  }];
};

// Lanterna de Rafael apontada para a placa.
const frente = ({ t, shot, p }: Contexto) => {
  if (t < PLACA.de || t >= T_ABRE) return null;
  const rx = shot.id === "placa" ? 110 + 290 * p : 400;
  const ry = shot.id === "placa" ? 1640 + 160 * p : 1800;
  const mx = rx + 185, my = ry - 322;
  const pisca = 0.85 + 0.15 * Math.sin(t * 40);
  return (
    <g>
      <polygon points={`${mx},${my} 430,1850 700,1850`} fill="#fff3c8" opacity={0.2 * pisca} />
      <ellipse cx={565} cy={1795} rx={170} ry={62} fill="#fff3c8" opacity={0.3 * pisca} />
      <rect x={mx - 26} y={my - 12} width={46} height={24} rx={6} fill="#20242c" />
    </g>
  );
};

// A fotografia: frente (os seis no laboratório) e verso (o registro).
const Foto = ({ t }: { t: number }) => {
  const giro = sobe(t, T_VERSO - 0.25, T_VERSO + 0.25); // 0 = frente, 1 = verso
  const escalaX = Math.abs(Math.cos(giro * Math.PI));
  const verso = giro > 0.5;
  const entra = sobe(t, T_FRENTE, T_FRENTE + 0.35);
  return (
    <AbsoluteFill style={{ background: `rgba(10,0,0,${0.55 * entra})` }}>
      <div style={{ position: "absolute", left: 110, top: 430 + (1 - entra) * 500, width: 860, height: 640, transform: `rotate(${-4 + Math.sin(t * 1.7) * 1.2}deg) scaleX(${escalaX})` }}>
        {verso ? (
          <div style={{ width: "100%", height: "100%", background: "#e9e0c8", border: "6px solid #16130f", boxSizing: "border-box", fontFamily: FONT, color: "#1c1814", padding: "70px 60px", textAlign: "center" }}>
            <div style={{ fontSize: 40, letterSpacing: 8, opacity: 0.7 }}>REGISTRO INTERNO</div>
            <div style={{ fontSize: 104, marginTop: 26 }}>EXPERIMENTO 47</div>
            <div style={{ height: 6, background: "#1c1814", margin: "26px 40px" }} />
            <div style={{ fontSize: 88, color: "#a01414", lineHeight: 1.12, transform: "rotate(-3deg)", border: "8px solid #a01414", padding: "14px 10px", margin: "0 20px" }}>
              TODOS FALECERAM<br />HÁ TRÊS DIAS
            </div>
          </div>
        ) : (
          <svg width={860} height={640} viewBox="0 0 860 640" style={{ background: "#efe8d6", border: "6px solid #16130f", boxSizing: "border-box" }}>
            <rect x={36} y={36} width={788} height={500} fill="#0e211d" />
            <rect x={36} y={36} width={788} height={60} fill="#17302a" />
            {[90, 770].map((x) => (
              <g key={x}>
                <rect x={x - 46} y={130} width={92} height={330} rx={26} fill="#0d2a22" stroke="#2f5a4d" strokeWidth={6} />
                <rect x={x - 36} y={200} width={72} height={250} rx={20} fill="#2bd98c" opacity={0.55} />
              </g>
            ))}
            <rect x={36} y={470} width={788} height={66} fill="#162622" />
            {NOMES.map((nome, i) => (
              <g key={nome} transform={`translate(${205 + i * 90} ${nome === "Carlos" ? 520 : 516}) scale(${nome === "Carlos" ? 0.36 : 0.31})`}>
                <Ator v={{ ...VISUAL[nome], roupa: "#d9dee4", detalhe: undefined }} t={0} expr="neutro" fase={i} />
              </g>
            ))}
            <rect x={36} y={36} width={788} height={500} fill="#c9a86a" opacity={0.14} />
          </svg>
        )}
      </div>
      {/* dedos de Daniel segurando a foto */}
      <div style={{ position: "absolute", left: 250, top: 1060 + (1 - entra) * 500, width: 110, height: 150, borderRadius: 55, background: VISUAL.Daniel.pele, border: "6px solid #14161c" }} />
      <div style={{ position: "absolute", left: 700, top: 1040 + (1 - entra) * 500, width: 110, height: 150, borderRadius: 55, background: VISUAL.Daniel.pele, border: "6px solid #14161c" }} />
    </AbsoluteFill>
  );
};

// Na abertura em preto, cada batida aparece escrita na tela.
const Toc = ({ t }: { t: number }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: 230, color: "#e9e9ea" }}>
    {BATIDAS.map((b, i) => {
      const k = decai(t, b, 0.4);
      return k > 0 ? (
        <div key={b} style={{ position: "absolute", opacity: k, transform: `translate(${(i - 1) * 190}px, ${(i - 1) * 150 + Math.sin(t * 90) * 10 * k}px) scale(${0.9 + 0.3 * k})` }}>TOC</div>
      ) : null;
    })}
  </AbsoluteFill>
);

const sobre = ({ t }: Contexto) =>
  t < 1.5 ? <Toc t={t} /> : t >= T_FRENTE && t < T_DANIEL ? <Foto t={t} /> : null;

// Tela preta final: a linha do monitor cardíaco fica reta.
const Final = ({ t }: { t: number }) => (
  <AbsoluteFill>
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <line x1={0} y1={700} x2={1080} y2={700} stroke="#35e08a" strokeWidth={6} opacity={0.9} />
      <circle cx={((t - PRETO) * 520) % 1080} cy={700} r={12} fill="#b6ffd8" />
    </svg>
    <Titulo t={t} de={PRETO + 0.9} />
  </AbsoluteFill>
);

const S1 = "ep01/sfx/", S2 = "ep02/sfx/";

export const Ep02 = () => (
  <Episodio
    manifesto={manifesto} shots={SHOTS} blocos={BLOCOS} preto={PRETO}
    fx={fx} itens={itens} frente={frente} sobre={sobre} corLegenda={corLegenda}
    trilha={`${S1}drone.mp3`} final={(t) => <Final t={t} />}
    sons={
      <>
        {BATIDAS.map((b) => <Som key={b} fps={FPS} em={b} src={`${S1}batida.mp3`} />)}
        <Som fps={FPS} em={MESA.de} src={`${S2}arrasto.mp3`} volume={0.8} />
        <Som fps={FPS} em={VIBRA.de} src={`${S2}metal.mp3`} volume={0.9} />
        <Som fps={FPS} em={VIBRA.de + 0.7} src={`${S2}rachadura.mp3`} volume={0.8} />
        <Som fps={FPS} em={ZUMBI.de} src={`${S2}arranhao.mp3`} volume={0.9} />
        {manifesto.falas.filter((f) => f.p === "Helena" || f.p === "Desconhecida").map((f) => (
          <Som key={f.n} fps={FPS} em={f.inicio - 0.3} src={`${S1}estatica.mp3`} volume={0.35} />
        ))}
        {BIPES.map((b) => <Som key={b} fps={FPS} em={b} src={`${S2}bipe.mp3`} volume={0.8} />)}
        <Som fps={FPS} em={PEDRO_CHAO.de} src={`${S2}metal.mp3`} volume={0.7} />
        <Som fps={FPS} em={T_ABRE + 0.3} src={`${S2}escotilha.mp3`} volume={1} />
        <Som fps={FPS} em={T_VERSO} src={`${S1}impacto.mp3`} volume={0.5} />
        <Som fps={FPS} em={PRETO} src={`${S2}flatline.mp3`} volume={0.7} />
      </>
    }
  />
);

export const EP02_DURACAO = Math.round(manifesto.duracao * FPS);
export const EP02_FPS = FPS;
