import { AbsoluteFill } from "remotion";
import manifestoJson from "./manifest.json";
import { FONT } from "../theme";
import { Ator, type Visual } from "../serie/Ator";
import {
  Episodio, Som, decai, est as e, sobe, tempos,
  type Bloco, type Contexto, type Manifesto, type Shot,
} from "../serie/motor";
import { ALAVANCA, ALCAPAO, Casa, Corredor, FOTO_PAINEL, MESMA_IDADE, PORTA_CASA, POCA, Praca, RELOGIO_TORRE, Subsolo } from "./cenarios";

// A Cidade Sem Amanhã — curta narrado.
// Santa Aurora presa no mesmo dia; só Elisa se lembra.

const manifesto = manifestoJson as Manifesto;
const FPS = manifesto.fps;
const PRETO = manifestoJson.preto;
const { ini, fim, pal } = tempos(manifesto);

const ELISA: Visual = { pele: "#edc09c", cabelo: "#3a2418", roupa: "#e9b730", casaco: true, mochila: "#2f6fb5", calca: "#3a3f4d", estilo: "longo" };
const CIENTISTA: Visual = { pele: "#e0b292", cabelo: "#c9ccd2", roupa: "#f4f7f8", casaco: true, calca: "#3b3f4a", estilo: "grisalho", oculos: true };
const ELENCO: Record<string, Visual> = {
  Elisa: ELISA,
  Mae: { pele: "#e8b995", cabelo: "#5a2e1c", roupa: "#8ab17d", calca: "#2b2f3b", estilo: "coque" },
  Pai: { pele: "#e2b08a", cabelo: "#2e211b", roupa: "#5b7f95", calca: "#2f3138", estilo: "curto", barbaCor: "#3b2c22" },
};

const BLOCOS: Record<string, Bloco> = {
  praca: { Elisa: e(420, 1760, 0.7, "surpreso", [0.6, -0.8]) },
  casa: {
    Mae: e(230, 1720, 0.74, "feliz", [1, 0]),
    Pai: e(450, 1740, 0.78, "feliz", [1, 0]),
    Elisa: e(740, 1770, 0.64, "medo", [-1, -0.3], "apontarEsq"),
  },
  porta: { Elisa: e(700, 1780, 0.66, "desconfiado", [1, 0.8]) },
  noite: { Elisa: e(1150, 1700, 0.5, "medo", [-0.5, -0.8]) },
  alcapao: { Elisa: e(700, 1520, 0.46, "medo", [-0.6, 0.6]) },
  subsolo: { Elisa: e(420, 1780, 0.62, "surpreso", [0.6, -1]) },
  alavanca: { Elisa: e(760, 1770, 0.62, "medo", [1, -0.4]) },
};

const [RX, RY] = RELOGIO_TORRE;
const ROSTO_PRACA: [number, number] = [420, 1277];
const ROSTO_PORTA: [number, number] = [700, 1325];
const ROSTO_SUB: [number, number] = [420, 1352];
const ROSTO_ALAV: [number, number] = [760, 1342];

const SHOTS: Shot[] = [
  // 00–12 s | O dia repetido
  { id: "relogio_volta", de: 0, ate: pal("01", "algo") - 0.1, fundo: "praca", luz: "dourada",
    cam: [[RX, RY, 3.2], [RX, RY, 3.8]] },
  { id: "elisa_surpresa", de: pal("01", "algo") - 0.1, ate: pal("01", "manhã") - 0.4, fundo: "praca", bloco: "praca", luz: "dourada",
    cam: [[ROSTO_PRACA[0], ROSTO_PRACA[1], 2.8], [ROSTO_PRACA[0], ROSTO_PRACA[1], 3.1]] },
  { id: "aerea", de: pal("01", "manhã") - 0.4, ate: pal("01", "notícias") - 0.4, fundo: "praca", luz: "dourada",
    cam: [[540, 900, 1.6], [540, 1000, 1.0]] },
  { id: "onibus", de: pal("01", "notícias") - 0.4, ate: pal("01", "até") - 0.3, fundo: "praca", luz: "dourada",
    cam: [[540, 1380, 1.6], [540, 1380, 1.7]] },
  { id: "chuva_igual", de: pal("01", "até") - 0.3, ate: fim("01") + 0.3, fundo: "praca", luz: "dourada",
    cam: [[POCA[0], POCA[1] - 60, 2.8], [POCA[0], POCA[1] - 60, 3.1]] },

  // 12–25 s | A única testemunha
  { id: "ninguem", de: fim("01") + 0.3, ate: pal("02", "exceto") - 0.3, fundo: "praca", luz: "dourada",
    cam: [[540, 1420, 1.25], [540, 1420, 1.3]] },
  { id: "elisa", de: pal("02", "exceto") - 0.3, ate: pal("02", "ela") - 0.2, fundo: "praca", bloco: "praca", luz: "dourada",
    cam: [[420, 1500, 1.4], [ROSTO_PRACA[0], ROSTO_PRACA[1], 2.6]], at: { Elisa: { expr: "desconfiado", olhar: [0.6, 0] } } },
  { id: "lembra", de: pal("02", "ela") - 0.2, ate: pal("02", "quando") - 0.2, fundo: "praca", bloco: "praca", luz: "dourada",
    cam: [[560, 1400, 1.3], [560, 1400, 1.4]], at: { Elisa: { expr: "desconfiado", olhar: [1, 0.2] } } },
  { id: "pais", de: pal("02", "quando") - 0.2, ate: fim("02") + 0.3, fundo: "casa", bloco: "casa", luz: "dourada",
    cam: [[480, 1300, 1.25], [460, 1260, 1.45]] },

  // 25–38 s | O aviso
  { id: "envelope", de: fim("02") + 0.3, ate: pal("03", "nele") - 0.2, fundo: "casa", bloco: "porta", luz: "dourada",
    cam: [[PORTA_CASA[0] - 40, 1380, 2.3], [PORTA_CASA[0] - 60, 1390, 2.6]] },
  { id: "bilhete", de: pal("03", "nele") - 0.2, ate: pal("03", "assinatura") - 0.3, fundo: "casa", bloco: "porta", luz: "dourada",
    cam: [[ROSTO_PORTA[0], ROSTO_PORTA[1], 2.4], [ROSTO_PORTA[0], ROSTO_PORTA[1], 2.5]] },
  { id: "assinatura", de: pal("03", "assinatura") - 0.3, ate: pal("03", "escrito") - 0.9, fundo: "casa", bloco: "porta", luz: "dourada",
    cam: [[ROSTO_PORTA[0], ROSTO_PORTA[1], 2.4], [ROSTO_PORTA[0], ROSTO_PORTA[1], 2.5]] },
  { id: "olhos", de: pal("03", "escrito") - 0.9, ate: fim("03") + 0.2, fundo: "casa", bloco: "porta", luz: "dourada",
    cam: [[ROSTO_PORTA[0], ROSTO_PORTA[1] - 10, 3.6], [ROSTO_PORTA[0], ROSTO_PORTA[1] - 10, 4.2]], at: { Elisa: { expr: "congelado", olhar: [0, 0] } } },
  { id: "torre_noite", de: fim("03") + 0.2, ate: pal("04", "debaixo") - 0.2, fundo: "noite", bloco: "noite", luz: "noite",
    cam: [[540, 900, 1.0], [600, 1200, 1.2]], at: { Elisa: { xPara: 680, yPara: 1560, sPara: 0.48 } } },

  // 38–52 s | A descoberta
  { id: "alcapao", de: pal("04", "debaixo") - 0.2, ate: pal("04", "ali") - 0.3, fundo: "noite", bloco: "alcapao", luz: "noite",
    cam: [[ALCAPAO[0] + 40, ALCAPAO[1] - 120, 2.0], [ALCAPAO[0] + 20, ALCAPAO[1] - 60, 2.4]], at: { Elisa: { xPara: 610, yPara: 1470 } } },
  { id: "corredor", de: pal("04", "ali") - 0.3, ate: pal("04", "mostravam") - 0.8, fundo: "corredor", luz: "abajur",
    cam: [[540, 960, 1.0], [540, 960, 1.5]] },
  { id: "fotos", de: pal("04", "mostravam") - 0.8, ate: pal("04", "mas") - 0.2, fundo: "subsolo", luz: "abajur",
    cam: [[240, 1100, 1.6], [240, 800, 1.6]] },
  { id: "mesma_idade", de: pal("04", "mas") - 0.2, ate: fim("04") + 0.3, fundo: "subsolo", luz: "abajur",
    cam: [[MESMA_IDADE[0] + 30, MESMA_IDADE[1] - 100, 3.4], [MESMA_IDADE[0] + 30, MESMA_IDADE[1] - 100, 3.8]] },

  // 52–65 s | A verdade
  { id: "maquina", de: fim("04") + 0.3, ate: pal("05", "registro") - 0.4 - 0.2, fundo: "subsolo", bloco: "subsolo", luz: "abajur",
    cam: [[620, 1100, 1.0], [620, 980, 1.15]] },
  { id: "diario", de: pal("05", "registro") - 0.4 - 0.2, ate: pal("05", "para") - 0.2, fundo: "subsolo", bloco: "subsolo", luz: "abajur",
    cam: [[ROSTO_SUB[0], ROSTO_SUB[1] + 100, 2.0], [ROSTO_SUB[0], ROSTO_SUB[1] + 100, 2.1]], at: { Elisa: { expr: "desconfiado", olhar: [0, 1], pose: "abracar" } } },
  { id: "tempestade", de: pal("05", "para") - 0.2, ate: fim("05") + 0.3, fundo: "ameaca", luz: "noite", tremor: 3,
    cam: [[540, 900, 1.0], [540, 860, 1.12]] },

  // 65–78 s | A escolha
  { id: "preco", de: fim("05") + 0.3, ate: pal("06", "elisa") - 0.2, fundo: "subsolo", bloco: "subsolo", luz: "vermelha", tremor: 2,
    cam: [[620, 1000, 1.05], [ROSTO_SUB[0], ROSTO_SUB[1], 2.3]], at: { Elisa: { expr: "medo", olhar: [0.6, -1] } } },
  { id: "alavanca", de: pal("06", "elisa") - 0.2, ate: pal("06", "só") - 0.2, fundo: "subsolo", bloco: "alavanca", luz: "vermelha",
    cam: [[820, 1360, 1.8], [840, 1340, 2.1]], at: { Elisa: { pose: "apontarDir" } } },
  { id: "ameaca", de: pal("06", "só") - 0.2, ate: pal("06", "voltaria") - 0.3, fundo: "ameaca", luz: "noite", tremor: 4,
    cam: [[540, 700, 1.3], [540, 760, 1.15]] },
  { id: "acelera", de: pal("06", "voltaria") - 0.3, ate: fim("06") + 0.4, fundo: "subsolo", bloco: "subsolo", luz: "vermelha", tremor: 4,
    cam: [[640, 1450, 2.4], [640, 1450, 2.7]] },

  // 78–90 s | A revelação
  { id: "aproxima", de: fim("06") + 0.4, ate: pal("07", "foi") - 0.2, fundo: "subsolo", bloco: "alavanca", luz: "vermelha",
    cam: [[ROSTO_ALAV[0], ROSTO_ALAV[1], 2.6], [ROSTO_ALAV[0] + 40, ROSTO_ALAV[1] + 20, 2.3]], at: { Elisa: { pose: "apontarDir", expr: "firme" } } },
  { id: "ultima_foto", de: pal("07", "foi") - 0.2, ate: pal("07", "nela") - 0.2, fundo: "subsolo", bloco: "alavanca", luz: "vermelha",
    cam: [[FOTO_PAINEL[0], FOTO_PAINEL[1] - 40, 3.0], [FOTO_PAINEL[0], FOTO_PAINEL[1] - 40, 3.4]], at: { Elisa: { expr: "surpreso", olhar: [-0.4, 0.8] } } },
  { id: "foto_frente", de: pal("07", "nela") - 0.2, ate: pal("07", "no") - 0.2, fundo: "subsolo", bloco: "alavanca", luz: "vermelha",
    cam: [[ROSTO_ALAV[0], ROSTO_ALAV[1], 2.3], [ROSTO_ALAV[0], ROSTO_ALAV[1], 2.4]] },
  { id: "foto_verso", de: pal("07", "no") - 0.2, ate: pal("07", "máquina") - 0.7, fundo: "subsolo", bloco: "alavanca", luz: "vermelha",
    cam: [[ROSTO_ALAV[0], ROSTO_ALAV[1], 2.3], [ROSTO_ALAV[0], ROSTO_ALAV[1], 2.4]] },
  { id: "desliga", de: pal("07", "máquina") - 0.7, ate: PRETO - 1.4, fundo: "subsolo", bloco: "alavanca", luz: "abajur",
    cam: [[740, 1200, 1.2], [700, 1150, 1.3]], at: { Elisa: { expr: "surpreso", pose: "recuar", olhar: [1, -0.3] } } },
  { id: "elisa_final", de: PRETO - 1.4, ate: PRETO, fundo: "subsolo", bloco: "alavanca", luz: "abajur",
    cam: [[ROSTO_ALAV[0], ROSTO_ALAV[1], 3.0], [ROSTO_ALAV[0], ROSTO_ALAV[1], 3.6]], at: { Elisa: { expr: "congelado", olhar: [0, 0], lagrima: true } } },
];

const plano = (id: string) => SHOTS.find((s) => s.id === id)!;
const P_ENVELOPE = plano("envelope"), P_BILHETE = plano("bilhete"), P_ASSIN = plano("assinatura"), P_ALC = plano("alcapao");
const P_DIARIO = plano("diario"), P_PRECO = plano("preco"), P_FRENTE = plano("foto_frente"), P_VERSO = plano("foto_verso");
const P_DESLIGA = plano("desliga"), P_ULTIMA = plano("ultima_foto"), P_ACELERA = plano("acelera");

const cenario = ({ t, shot }: Contexto) => {
  switch (shot.fundo) {
    case "praca": {
      // O relógio da torre gira para trás na abertura.
      const tRel = shot.id === "relogio_volta" ? 30000 - t * 2400 : 30000 - P_ENVELOPE.de * 2400 + t;
      return <Praca t={t} tRelogio={tRel} repete={shot.id !== "relogio_volta"} />;
    }
    case "noite":
      return <Praca t={t} tRelogio={86400 - 1300 + t * 4} noite alcapao={sobe(t, P_ALC.de + 0.2, P_ALC.de + 1.4)} chuva={false} />;
    case "ameaca":
      return <Praca t={t} tRelogio={0} noite tempestade={1} />;
    case "casa":
      return <Casa t={t} envelope={sobe(t, P_ENVELOPE.de + 0.3, P_ENVELOPE.ate - 0.4)} />;
    case "corredor":
      return <Corredor t={t} />;
    default:
      return (
        <Subsolo t={t} alarme={t >= P_PRECO.de && t < P_DESLIGA.de ? 1 : 0}
          desliga={sobe(t, P_DESLIGA.de + 0.6, PRETO - 0.3)}
          alavanca={sobe(t, P_DESLIGA.de + 0.2, P_DESLIGA.de + 1.4)}
          foto={t < P_ULTIMA.de + 0.6} />
      );
  }
};

// ---------- documentos em primeiro plano ----------
const Papel = ({ children, rot = -2, top = 420 }: { children: React.ReactNode; rot?: number; top?: number }) => (
  <AbsoluteFill style={{ background: "rgba(10,8,4,0.45)", alignItems: "center" }}>
    <div style={{ marginTop: top, width: 860, boxSizing: "border-box", padding: "60px 64px", background: "#f4ecd6", border: "6px solid #6b5232", boxShadow: "0 30px 80px rgba(0,0,0,0.5)", transform: `rotate(${rot}deg)` }}>
      {children}
    </div>
  </AbsoluteFill>
);
const MAO = "'DejaVu Serif', Georgia, serif";

const Bilhete = ({ destaque }: { destaque: number }) => (
  <Papel>
    <div style={{ fontFamily: MAO, fontStyle: "italic", fontSize: 70, lineHeight: 1.25, color: "#1f2a55" }}>
      Não deixe o relógio da praça tocar meia-noite.
    </div>
    <div style={{ marginTop: 50, textAlign: "right", fontFamily: MAO, fontStyle: "italic", fontSize: 76, color: "#1f2a55", transform: `scale(${1 + destaque * 0.25})`, transformOrigin: "right center", textShadow: destaque > 0 ? `0 0 ${24 * destaque}px #ffcf7a` : "none" }}>
      — Elisa
    </div>
  </Papel>
);

const Diario = () => (
  <Papel rot={2} top={360}>
    <div style={{ fontFamily: FONT, fontSize: 44, letterSpacing: 4, color: "#5a3a22" }}>REGISTRO 19 · 1985</div>
    <div style={{ height: 4, background: "#5a3a22", margin: "14px 0 26px", opacity: 0.5 }} />
    <svg width={720} height={380}>
      <circle cx={190} cy={190} r={150} fill="none" stroke="#5a3a22" strokeWidth={5} />
      <circle cx={190} cy={190} r={70} fill="none" stroke="#5a3a22" strokeWidth={4} strokeDasharray="12 8" />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={190} y1={190} x2={190 + Math.cos(i * 0.52) * 150} y2={190 + Math.sin(i * 0.52) * 150} stroke="#5a3a22" strokeWidth={2} opacity={0.6} />)}
      <path d="M400 80 L700 80 M400 150 L660 150 M400 220 L690 220 M400 290 L600 290" stroke="#5a3a22" strokeWidth={6} opacity={0.6} />
      <path d="M430 330 q60 -70 120 0 t120 0" stroke="#a8432e" strokeWidth={6} fill="none" />
    </svg>
    <div style={{ fontFamily: MAO, fontStyle: "italic", fontSize: 46, color: "#3b2a1b", marginTop: 10 }}>
      O mecanismo segura o dia. Se parar, a tempestade volta.
    </div>
  </Papel>
);

const FotoFrente = ({ t }: { t: number }) => (
  <Papel rot={-3} top={380}>
    <svg width={732} height={600} viewBox="0 0 732 600">
      <rect width={732} height={600} fill="#b9a27c" />
      <rect y={420} width={732} height={180} fill="#8f7a58" />
      <g transform="translate(250 690) scale(0.62)"><Ator v={CIENTISTA} t={t} expr="feliz" pose="abracar" fase={1} /></g>
      <g transform="translate(470 700) scale(0.5)"><Ator v={ELISA} t={t} expr="feliz" fase={2} /></g>
      <rect width={732} height={600} fill="#7a5a2a" opacity={0.35} />
    </svg>
    <div style={{ fontFamily: FONT, fontSize: 40, color: "#5a3a22", marginTop: 16, letterSpacing: 4 }}>SANTA AURORA · 1984</div>
  </Papel>
);

const FotoVerso = () => (
  <Papel rot={2} top={460}>
    <div style={{ fontFamily: MAO, fontStyle: "italic", fontSize: 72, lineHeight: 1.3, color: "#1f2a55" }}>
      Minha filha, você já tentou nos salvar <span style={{ color: "#a01414" }}>14.609</span> vezes.
    </div>
  </Papel>
);

const sobre = ({ t, shot }: Contexto) => {
  if (shot.id === "bilhete") return <Bilhete destaque={0} />;
  if (shot.id === "assinatura") return <Bilhete destaque={sobe(t, P_ASSIN.de, P_ASSIN.de + 0.6)} />;
  if (shot.id === "diario") return <Diario />;
  if (shot.id === "foto_frente") return <FotoFrente t={t} />;
  if (shot.id === "foto_verso") return <FotoVerso />;
  return null;
};

const fx = ({ t }: Contexto) => ({
  clarao: Math.max(decai(t, plano("corredor").de, 0.5) * 0.8, decai(t, P_DESLIGA.de + 0.2, 0.4) * 0.5),
  claraoCor: "#ffe3a8",
  impacto: decai(t, P_DESLIGA.de + 0.2, 0.6),
});

const S = "cidade/sfx/";

export const CidadeSemAmanha = () => (
  <Episodio
    manifesto={manifesto} shots={SHOTS} blocos={BLOCOS} preto={PRETO} elenco={ELENCO} vinheta={0.6}
    cenario={cenario} sobre={sobre} fx={fx} trilha={`${S}musica.mp3`}
    corLegenda={() => "#fff3d6"}
    sons={
      <>
        <Som fps={FPS} em={0} src={`${S}reverso.mp3`} volume={0.8} />
        <Som fps={FPS} em={0} src={`${S}chuva.mp3`} volume={0.35} dur={15.8} some={0.5} />
        <Som fps={FPS} em={15.6} src={`${S}chuva.mp3`} volume={0.35} dur={P_ENVELOPE.de - 15.6} some={0.8} />
        {[plano("onibus").de + 2.6, plano("onibus").de + 7.8 > plano("onibus").ate ? 0 : 0, plano("lembra").de + 1.9].filter((x) => x > 0).map((x) => (
          <Som key={x} fps={FPS} em={x} src={`${S}rebobina.mp3`} volume={0.6} />
        ))}
        <Som fps={FPS} em={P_ENVELOPE.de + 0.2} src={`${S}porta.mp3`} volume={0.8} />
        <Som fps={FPS} em={plano("torre_noite").de + 0.2} src={`${S}sino.mp3`} volume={0.6} />
        <Som fps={FPS} em={P_ALC.de + 0.2} src={`${S}alcapao.mp3`} volume={0.8} />
        <Som fps={FPS} em={plano("corredor").de} src={`${S}lampadas.mp3`} volume={0.6} dur={plano("maquina").de - plano("corredor").de} some={0.6} />
        <Som fps={FPS} em={plano("maquina").de} src={`${S}maquina.mp3`} volume={0.5} dur={15.8} />
        <Som fps={FPS} em={plano("maquina").de + 15.6} src={`${S}maquina.mp3`} volume={0.5} dur={P_DESLIGA.de - plano("maquina").de - 15.6} some={0.5} />
        <Som fps={FPS} em={P_PRECO.de} src={`${S}alarme.mp3`} volume={0.6} />
        <Som fps={FPS} em={P_ACELERA.de} src={`${S}alarme.mp3`} volume={0.6} />
        <Som fps={FPS} em={P_DESLIGA.de + 0.2} src={`${S}desliga.mp3`} volume={0.9} />
      </>
    }
  />
);

export const CIDADE_DURACAO = Math.round(manifesto.duracao * FPS);
export const CIDADE_FPS = FPS;
