import manifestoJson from "./manifest.json";
import type { Visual } from "../serie/Ator";
import {
  Episodio, Som, decai, est as e, sobe, tempos,
  type Bloco, type Contexto, type Manifesto, type Shot,
} from "../serie/motor";
import { Escada } from "../mare/cenarios";
import { Bercario, CAMERA_MERCADO, Central, CidadeFuturo, Luxo, Mercado, PAINEL, Periferia, QUEDA } from "../curtas/futurista";

// O Homem que Escondeu o Tempo — curta narrado.
// Relógios de vida sobre a cabeça de todos; o de Elias, escondido sob o chapéu, mostra o infinito.

const manifesto = manifestoJson as Manifesto;
const FPS = manifesto.fps;
const PRETO = manifestoJson.preto;
const { fim, pal } = tempos(manifesto);

const ELIAS: Visual = { pele: "#d9a074", cabelo: "#17110e", roupa: "#2b2f3b", casaco: true, calca: "#22252e", estilo: "curto", chapeu: "#0d0d10" };
const FARDA: Visual = { pele: "#e2b08a", cabelo: "#0d0d10", detalhe: "#0d0d10", roupa: "#1f2a44", casaco: true, calca: "#161d30", estilo: "gorro" };
const ELENCO: Record<string, Visual> = {
  Elias: ELIAS,
  EliasSem: { ...ELIAS, chapeu: undefined },
  Guarda: FARDA,
  Soldado1: FARDA,
  Soldado2: { ...FARDA, pele: "#c68a5e" },
  Comerciante: { pele: "#c68a5e", cabelo: "#2e211b", roupa: "#8a4f6a", calca: "#2b2f3b", estilo: "coque" },
};

const INF = "∞";
const BLOCOS: Record<string, Bloco> = {
  mercado: { Elias: e(540, 1760, 0.62, "sereno", [-0.3, 0]) },
  recusa: {
    Elias: e(420, 1760, 0.62, "triste", [1, 0]),
    Comerciante: { ...e(800, 1770, 0.64, "desconfiado", [-1, 0], "recuar"), nega: true, holo: "14 ANOS" },
  },
  praca: {
    Elias: e(540, 1760, 0.66, "firme", [1, 0]),
    EliasSem: { ...e(540, 1760, 0.66, "congelado", [0, -1]), oculto: true, holo: INF, holoCor: "#ffd166" },
    Guarda: { ...e(800, 1770, 0.7, "bravo", [-1, -0.4], "apontarEsq"), holo: "41 ANOS" },
  },
  soldados: {
    EliasSem: { ...e(300, 1760, 0.6, "panico", [1, 0], "recuar"), holo: INF, holoCor: "#ffd166" },
    Soldado1: { ...e(1150, 1700, 0.55, "bravo", [-1, 0], "apontarEsq"), holo: "52 ANOS" },
    Soldado2: { ...e(1300, 1780, 0.6, "bravo", [-1, 0]), holo: "38 ANOS" },
  },
  escada: { EliasSem: { ...e(300, 1030, 0.5, "panico", [1, 0.6]), holo: INF, holoCor: "#ffd166" } },
  central: { EliasSem: { ...e(1150, 1770, 0.64, "surpreso", [-0.6, -1]), holo: INF, holoCor: "#ffd166" } },
  painel: { EliasSem: { ...e(600, 1770, 0.66, "firme", [1, 0.2], "apontarDir"), holo: INF, holoCor: "#ffd166" } },
};

const ROSTO_MERCADO: [number, number] = [540, 1332];
const ROSTO_PRACA: [number, number] = [540, 1305];
const HOLO_PRACA: [number, number] = [540, 1146];
const ROSTO_PAINEL: [number, number] = [600, 1315];
const HOLO_PAINEL: [number, number] = [600, 1156];
const [CX, CY] = CAMERA_MERCADO;
const [PX, PY] = PAINEL;

const SHOTS: Shot[] = [
  // 00–12 s | O homem do chapéu (gancho: um relógio chegando a zero)
  { id: "contador", de: 0, ate: 2.6, fundo: "cidade", luz: "noite",
    cam: [[QUEDA[0], QUEDA[1] - 470, 3.4], [QUEDA[0], QUEDA[1] - 470, 3.8]] },
  { id: "cidade", de: 2.6, ate: pal("01", "todos") - 0.2, fundo: "cidade", luz: "noite",
    cam: [[540, 900, 1.0], [540, 1100, 1.15]] },
  { id: "relogios", de: pal("01", "todos") - 0.2, ate: pal("01", "quando") - 0.4, fundo: "cidade", luz: "noite",
    cam: [[540, 1460, 1.7], [620, 1440, 1.85]] },
  { id: "queda", de: pal("01", "quando") - 0.4, ate: fim("01") + 0.3, fundo: "cidade", luz: "noite",
    cam: [[QUEDA[0], QUEDA[1] - 260, 2.0], [QUEDA[0], QUEDA[1] - 200, 2.3]] },

  // 12–25 s | O preço da vida
  { id: "luxo", de: fim("01") + 0.3, ate: pal("02", "enquanto") - 0.2, fundo: "luxo", luz: "dourada",
    cam: [[540, 1200, 1.1], [540, 1300, 1.3]] },
  { id: "periferia", de: pal("02", "enquanto") - 0.2, ate: pal("02", "esconder") - 0.5, fundo: "periferia", luz: "noite",
    cam: [[560, 1200, 1.2], [600, 1150, 1.45]] },
  { id: "crime", de: pal("02", "esconder") - 0.5, ate: fim("02") + 0.3, fundo: "mercado", luz: "noite",
    cam: [[CX - 80, CY + 60, 2.4], [CX - 120, CY + 100, 2.0]] },

  // 25–38 s | O segredo de Elias
  { id: "elias", de: fim("02") + 0.3, ate: pal("03", "ninguém") - 0.2, fundo: "mercado", bloco: "mercado", luz: "noite",
    cam: [[620, 1300, 1.3], [560, 1300, 1.45]], at: { Elias: { x: 1200, xPara: 540 } } },
  { id: "cameras", de: pal("03", "ninguém") - 0.2, ate: pal("03", "comerciantes") - 0.4, fundo: "mercado", bloco: "mercado", luz: "noite",
    cam: [[CX - 40, CY, 2.6], [CX - 40, CY, 2.9]] },
  { id: "recusa", de: pal("03", "comerciantes") - 0.4, ate: pal("03", "câmeras") - 0.2, fundo: "mercado", bloco: "recusa", luz: "noite",
    cam: [[610, 1320, 1.6], [610, 1310, 1.75]] },
  { id: "mira", de: pal("03", "câmeras") - 0.2, ate: pal("03", "mas") - 0.2, fundo: "mercado", bloco: "mercado", luz: "noite",
    cam: [[ROSTO_MERCADO[0], ROSTO_MERCADO[1] - 60, 2.4], [ROSTO_MERCADO[0], ROSTO_MERCADO[1] - 60, 2.7]] },
  { id: "segredo", de: pal("03", "mas") - 0.2, ate: fim("03") + 0.3, fundo: "mercado", bloco: "mercado", luz: "noite",
    cam: [[ROSTO_MERCADO[0], ROSTO_MERCADO[1], 3.0], [ROSTO_MERCADO[0], ROSTO_MERCADO[1], 3.4]], at: { Elias: { expr: "firme", olhar: [0, 0] } } },

  // 38–51 s | O símbolo impossível
  { id: "arranca", de: fim("03") + 0.3, ate: pal("04", "chapéu") + 0.25, fundo: "cidade", bloco: "praca", luz: "noite",
    cam: [[660, 1350, 1.5], [640, 1320, 1.7]] },
  { id: "voa", de: pal("04", "chapéu") + 0.25, ate: pal("04", "multidão") - 0.4, fundo: "cidade", bloco: "praca", luz: "noite", tremor: 3,
    cam: [[640, 1300, 1.7], [620, 1260, 1.6]],
    at: { Elias: { oculto: true }, EliasSem: { oculto: false }, Guarda: { expr: "surpreso", pose: "recuar" } } },
  { id: "imovel", de: pal("04", "multidão") - 0.4, ate: pal("04", "acima") - 0.2, fundo: "parada", bloco: "praca", luz: "noite",
    cam: [[540, 1400, 1.05], [540, 1380, 1.1]], at: { Elias: { oculto: true }, EliasSem: { oculto: false }, Guarda: { expr: "surpreso", pose: "recuar" } } },
  { id: "sobe", de: pal("04", "acima") - 0.2, ate: pal("04", "apenas") - 0.6 - 0.2, fundo: "parada", bloco: "praca", luz: "noite",
    cam: [[ROSTO_PRACA[0], ROSTO_PRACA[1], 2.6], [HOLO_PRACA[0], HOLO_PRACA[1], 2.8]],
    at: { Elias: { oculto: true }, EliasSem: { oculto: false }, Guarda: { expr: "surpreso", pose: "recuar" } } },
  { id: "infinito", de: pal("04", "apenas") - 0.6 - 0.2, ate: fim("04") + 0.5, fundo: "parada", bloco: "praca", luz: "noite",
    cam: [[HOLO_PRACA[0], HOLO_PRACA[1] - 10, 5.6], [HOLO_PRACA[0], HOLO_PRACA[1] - 10, 6.4]],
    at: { Elias: { oculto: true }, EliasSem: { oculto: false } } },

  // 51–64 s | Caçado pela cidade
  { id: "teloes", de: fim("04") + 0.5, ate: pal("05", "ricos") - 0.4, fundo: "teloes", luz: "noite",
    cam: [[540, 640, 1.2], [540, 680, 1.35]] },
  { id: "ricos", de: pal("05", "ricos") - 0.4, ate: pal("05", "soldados") - 0.4, fundo: "luxo", luz: "dourada",
    cam: [[540, 1250, 1.3], [540, 1250, 1.45]] },
  { id: "soldados", de: pal("05", "soldados") - 0.4, ate: pal("05", "percebeu") - 0.7, fundo: "teloes", bloco: "soldados", luz: "noite", tremor: 4,
    cam: [[620, 1320, 1.3], [520, 1320, 1.45]],
    at: { Soldado1: { xPara: 760 }, Soldado2: { xPara: 900 } } },
  { id: "foge", de: pal("05", "percebeu") - 0.7, ate: fim("05") + 0.3, fundo: "escada", bloco: "escada", luz: "noite", tremor: 4,
    cam: [[420, 1060, 1.5], [760, 1250, 1.55]], at: { EliasSem: { xPara: 860, yPara: 1357 } } },

  // 64–77 s | A origem dos relógios
  { id: "tuneis", de: fim("05") + 0.3, ate: pal("06", "foi") - 0.2, fundo: "central", bloco: "central", luz: "noite",
    cam: [[540, 1100, 1.0], [600, 1150, 1.15]], at: { EliasSem: { xPara: 700 } } },
  { id: "verdade", de: pal("06", "foi") - 0.2, ate: pal("06", "números") - 0.4, fundo: "central", luz: "noite",
    cam: [[400, 800, 1.8], [500, 760, 2.0]] },
  { id: "roubo", de: pal("06", "números") - 0.4, ate: fim("06") + 0.3, fundo: "central", luz: "noite",
    cam: [[540, 1100, 1.4], [540, 420, 1.4]] },

  // 77–90 s | O último segundo
  { id: "botao", de: fim("06") + 0.3, ate: pal("07", "mas") - 0.2, fundo: "central", bloco: "painel", luz: "noite",
    cam: [[690, 1330, 1.7], [700, 1340, 1.9]] },
  { id: "infinito_some", de: pal("07", "mas") - 0.2, ate: pal("07", "restavam") - 0.2, fundo: "central", bloco: "painel", luz: "noite",
    cam: [[HOLO_PAINEL[0], HOLO_PAINEL[1] + 60, 3.0], [HOLO_PAINEL[0], HOLO_PAINEL[1] + 40, 3.3]], at: { EliasSem: { expr: "surpreso", olhar: [0, -1] } } },
  { id: "dez", de: pal("07", "restavam") - 0.2, ate: pal("07", "ele") - 0.2, fundo: "central", bloco: "painel", luz: "noite",
    cam: [[HOLO_PAINEL[0], HOLO_PAINEL[1], 4.0], [HOLO_PAINEL[0], HOLO_PAINEL[1], 4.4]] },
  { id: "aperta", de: pal("07", "ele") - 0.2, ate: pal("07", "todos") - 0.2, fundo: "central", bloco: "painel", luz: "noite", tremor: 3,
    cam: [[PX - 40, PY + 40, 2.6], [PX - 40, PY + 40, 2.8]], at: { EliasSem: { expr: "firme", lagrima: true } } },
  { id: "apagam", de: pal("07", "todos") - 0.2, ate: pal("07", "menos") - 0.2, fundo: "apagada", luz: "noite",
    cam: [[540, 1100, 1.0], [540, 1150, 1.08]] },
  { id: "bebe", de: pal("07", "menos") - 0.2, ate: PRETO, fundo: "bercario", luz: "noite",
    cam: [[480, 1220, 2.0], [450, 1110, 2.6]] },
];

const plano = (id: string) => SHOTS.find((s) => s.id === id)!;
const P_CONT = plano("contador"), P_QUEDA = plano("queda"), P_PERIF = plano("periferia"), P_MIRA = plano("mira");
const P_ARRANCA = plano("arranca"), P_VOA = plano("voa"), P_SOME = plano("infinito_some"), P_APERTA = plano("aperta");
const P_APAGAM = plano("apagam"), P_BEBE = plano("bebe"), P_SOLD = plano("soldados");
const T_ZERA = pal("07", "desapareceu") + 0.1;

/** Relógio de Elias depois que ele toca o painel. */
const relogioElias = (t: number) => {
  if (t < T_ZERA - 0.5) return INF;
  if (t < T_ZERA) return Math.sin(t * 60) > 0 ? INF : "00:00:1?";
  return `00:00:${String(Math.max(0, 10 - Math.floor(t - T_ZERA))).padStart(2, "0")}`;
};

const cenario = ({ t, shot }: Contexto) => {
  switch (shot.fundo) {
    case "luxo": return <Luxo t={t} />;
    case "periferia": return <Periferia t={t} transfere={sobe(t, P_PERIF.de + 1.2, P_PERIF.ate - 0.6)} />;
    case "mercado": return <Mercado t={t} scan={shot.id === "mira" || shot.id === "cameras" ? 1 : 0.3} />;
    case "escada": return <Escada t={t} agua={0} luz={0.85} />;
    case "central": return <Central t={t} apagado={false} botao={sobe(t, P_APERTA.de + 0.3, P_APERTA.de + 0.6)} />;
    case "bercario": {
      const acende = P_BEBE.de + 1.4;
      const resta = 79 * 365 * 86400 - Math.max(0, Math.floor(t - acende));
      const h = Math.floor((resta % 86400) / 3600), m = Math.floor((resta % 3600) / 60), s = resta % 60;
      const txt = `79A ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      return <Bercario t={t} relogio={t >= acende ? txt : undefined} />;
    }
    case "parada": return <CidadeFuturo t={t} parada />;
    case "teloes": return <CidadeFuturo t={t} noite telao={INF} parada={false} />;
    case "apagada": return <CidadeFuturo t={t} noite apagado />;
    default:
      return (
        <CidadeFuturo t={t}
          queda={shot.id === "contador" ? sobe(t, 0, P_CONT.ate) * 0.4 : shot.id === "queda" ? 0.4 + sobe(t, P_QUEDA.de, P_QUEDA.ate - 0.4) * 0.6 : null} />
      );
  }
};

// O chapéu arrancado voando, e a mira das câmeras sobre Elias.
const itens = ({ t, shot }: Contexto) => {
  if (shot.id === "voa" || shot.id === "imovel") {
    const q = sobe(t, P_VOA.de, P_VOA.de + 1.0);
    const x = 540 + q * 420, y = 1212 - q * 380 + q * q * 700;
    return [{
      y: 2000,
      el: (
        <g key="chapeu" transform={`translate(${x} ${Math.min(1760, y)}) rotate(${q * 400}) scale(0.66)`}>
          <ellipse rx={168} ry={30} fill="#0d0d10" />
          <path d="M-96 0 Q-100 -120 0 -124 Q100 -120 96 0Z" fill="#0d0d10" />
        </g>
      ),
    }];
  }
  if (shot.id === "arranca") {
    return [{
      y: 2000,
      el: <g key="mao" transform={`translate(${700 - sobe(t, P_ARRANCA.de, P_ARRANCA.ate) * 120} 1180)`}><circle r={18} fill="#e2b08a" /></g>,
    }];
  }
  return [];
};

const frente = ({ t, shot }: Contexto) => {
  if (shot.id !== "mira") return null;
  const [x, y] = [540, 1150];
  const k = 70 + Math.sin(t * 8) * 6;
  return (
    <g stroke="#ff4a3a" strokeWidth={6} fill="none" opacity={0.85}>
      <path d={`M${x - k} ${y - k + 30} v-30 h30 M${x + k} ${y - k + 30} v-30 h-30 M${x - k} ${y + k - 30} v30 h30 M${x + k} ${y + k - 30} v30 h-30`} />
      <line x1={x - k} x2={x + k} y1={y - k + ((t * 160) % (2 * k))} y2={y - k + ((t * 160) % (2 * k))} strokeWidth={3} />
    </g>
  );
};

/** O relógio de Elias muda conforme o plano. */
const comRelogio = (shots: Shot[]): Shot[] =>
  shots.map((s) => (s.bloco === "painel" ? { ...s, at: { ...(s.at ?? {}), EliasSem: { ...(s.at?.EliasSem ?? {}), holo: "__relogio__" } } } : s));

const fx = ({ t }: Contexto) => ({
  impacto: Math.max(decai(t, P_VOA.de, 0.4), decai(t, P_APAGAM.de, 0.6)),
  clarao: decai(t, P_APAGAM.de, 0.35) * 0.8,
  claraoCor: "#e8f6ff",
});

const S = "tempo/sfx/";

const shotsFinal = comRelogio(SHOTS);

export const Tempo = () => {
  return (
    <Episodio
      manifesto={manifesto} shots={shotsFinal} blocos={BLOCOS} preto={PRETO} elenco={ELENCO} vinheta={0.6}
      cenario={cenario} itens={itens} frente={frente} fx={fx} trilha={`${S}musica.mp3`}
      corLegenda={() => "#e8f6ff"}
      holo={(texto, t) => (texto === "__relogio__" ? relogioElias(t) : texto)}
      sons={
        <>
          <Som fps={FPS} em={0} src={`${S}cidade.mp3`} volume={0.4} dur={15.8} some={0.6} />
          <Som fps={FPS} em={P_QUEDA.de + 0.6} src={`${S}queda.mp3`} volume={0.8} />
          <Som fps={FPS} em={P_PERIF.de + 1.2} src={`${S}transferencia.mp3`} volume={0.7} />
          <Som fps={FPS} em={plano("cameras").de} src={`${S}cameras.mp3`} volume={0.6} />
          <Som fps={FPS} em={P_MIRA.de} src={`${S}cameras.mp3`} volume={0.5} />
          <Som fps={FPS} em={P_VOA.de - 0.2} src={`${S}chapeu.mp3`} volume={0.9} />
          <Som fps={FPS} em={plano("infinito").de} src={`${S}infinito.mp3`} volume={0.8} />
          <Som fps={FPS} em={P_SOLD.de - 2} src={`${S}alarmes.mp3`} volume={0.55} />
          <Som fps={FPS} em={plano("tuneis").de} src={`${S}central.mp3`} volume={0.5} dur={11.8} some={0.6} />
          <Som fps={FPS} em={plano("tuneis").de + 11.6} src={`${S}central.mp3`} volume={0.5} dur={Math.max(0.1, P_APAGAM.de - plano("tuneis").de - 11.6)} some={0.4} />
          <Som fps={FPS} em={T_ZERA} src={`${S}contagem.mp3`} volume={0.7} dur={P_APAGAM.de - T_ZERA} />
          <Som fps={FPS} em={P_APAGAM.de} src={`${S}apaga.mp3`} volume={1} />
          <Som fps={FPS} em={P_BEBE.de + 1.2} src={`${S}bebe.mp3`} volume={0.8} />
        </>
      }
    />
  );
};

export const TEMPO_DURACAO = Math.round(manifesto.duracao * FPS);
export const TEMPO_FPS = FPS;
