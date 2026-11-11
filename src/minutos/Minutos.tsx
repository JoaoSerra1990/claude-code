import { AbsoluteFill, interpolate } from "remotion";
import manifestoJson from "./manifest.json";
import { FONT } from "../theme";
import type { Visual } from "../serie/Ator";
import {
  Episodio, Som, decai, est as e, sobe, tempos,
  type Bloco, type Contexto, type Manifesto, type Shot,
} from "../serie/motor";
import { Cosmos, Cozinha, MesaCafe, PORTA_RELOJOARIA, RELOGIO_COZINHA, RELOGIO_RUA, Rua } from "./cenarios";

// O Menino que Vendia Minutos — história avulsa de 90 segundos.
// Presente em azul frio, memória em dourado. A narração conduz; os planos mostram.
// Theo é o Guardião das Memórias: não se molha, não tem reflexo e os relógios
// param perto dele. Cada pessoa revive uma única lembrança real, por cinco minutos.

const manifesto = manifestoJson as Manifesto;
const FPS = manifesto.fps;
const PRETO = manifestoJson.preto;
const { ini, fim, pal } = tempos(manifesto);

const ELENCO: Record<string, Visual> = {
  Theo: { pele: "#edc09c", cabelo: "#6b4428", roupa: "#c9962a", calca: "#3a3f4d", estilo: "baguncado", casaco: true, bolsa: "#6b4426" },
  Arthur: { pele: "#e0b292", cabelo: "#c9ccd2", roupa: "#6b4a30", calca: "#2f3138", estilo: "curto", casaco: true, barbaCor: "#eef0f2", sobrancelha: "#aeb2b9" },
  ArthurM: { pele: "#e3b696", cabelo: "#9a9ea6", roupa: "#7a5a3c", detalhe: "#e9e2d2", calca: "#3b3f4a", estilo: "curto", barbaCor: "#d9dce0", sobrancelha: "#8f939b" },
  Helena: { pele: "#eec7a8", cabelo: "#c4c7cd", roupa: "#3f6fb5", detalhe: "#f1ede4", calca: "#4a4e5a", estilo: "coque", sobrancelha: "#a4a8af" },
};

const BLOCOS: Record<string, Bloco> = {
  ruaSo: { Theo: e(430, 1650, 0.56, "sereno", [0.3, 0], "apontarCima") },
  ruaDois: {
    Theo: e(430, 1650, 0.56, "sereno", [1, -0.8]),
    Arthur: e(760, 1670, 0.8, "triste", [-1, 0.6]),
  },
  cozinha: {
    ArthurM: e(300, 1640, 0.8, "surpreso", [0.6, 0]),
    Helena: { ...e(780, 1640, 0.76, "sereno", [-0.6, 0.4]), oculto: true },
  },
  mesa: {
    ArthurM: e(330, 1640, 0.8, "feliz", [1, 0]),
    Helena: e(770, 1640, 0.76, "feliz", [-1, 0]),
  },
  porta: { Theo: e(430, 1650, 0.56, "sereno", [-0.4, 0]) },
  cosmos: { Theo: e(540, 1760, 0.5, "sereno", [0, -1]) },
  cosmosPerto: { Theo: e(540, 1790, 0.95, "sereno", [0.3, -0.6]) },
};

const ROSTO_THEO: [number, number] = [430, 1264];
const ROSTO_ARTHUR: [number, number] = [760, 1118];
const ROSTO_ARTHUR_M: [number, number] = [300, 1088];
const ROSTO_HELENA: [number, number] = [780, 1116];
const [RX, RY] = RELOGIO_RUA;
const [KX, KY] = RELOGIO_COZINHA;

const [PX, PY] = PORTA_RELOJOARIA;

const SHOTS: Shot[] = [
  // 00–10 s | Gancho
  { id: "abertura", de: 0, ate: pal("01", "todos") - 0.1, fundo: "rua", bloco: "ruaSo", luz: "fria",
    cam: [[540, 1050, 1.0], [450, 1300, 1.75]] },
  { id: "relogios_param", de: pal("01", "todos") - 0.1, ate: pal("01", "até") - 0.1, fundo: "rua", bloco: "ruaSo", luz: "fria",
    cam: [[RX, RY, 2.3], [RX, RY, 2.9]] },
  { id: "theo_close", de: pal("01", "até") - 0.1, ate: fim("01") + 0.5, fundo: "rua", bloco: "ruaSo", luz: "fria",
    cam: [[ROSTO_THEO[0], ROSTO_THEO[1], 2.8], [ROSTO_THEO[0], ROSTO_THEO[1], 3.2]], at: { Theo: { olhar: [1, -0.3] } } },

  // 10–22 s | A compra
  { id: "arthur_chega", de: fim("01") + 0.5, ate: pal("02", "carregava") - 0.35, fundo: "rua", bloco: "ruaDois", luz: "fria",
    cam: [[820, 1150, 1.45], [620, 1200, 1.6]],
    at: { Arthur: { x: 1190, xPara: 760 }, Theo: { pose: "apontarCima", olhar: [1, -0.4] } } },
  { id: "vitrine", de: pal("02", "carregava") - 0.35, ate: pal("02", "nenhuma") - 0.1, fundo: "rua", bloco: "ruaDois", luz: "fria",
    cam: [[330, 1060, 1.9], [300, 1040, 2.3]], at: { Theo: { pose: "apontarCima", olhar: [1, -0.4] } } },
  { id: "moeda", de: pal("02", "nenhuma") - 0.1, ate: fim("02") + 0.35, fundo: "rua", bloco: "ruaDois", luz: "fria",
    cam: [[560, 1320, 2.3], [560, 1310, 2.7]], at: { Arthur: { pose: "apontarEsq" }, Theo: { pose: "apontarDir", olhar: [1, -0.5] } } },
  { id: "arthur_pergunta", de: fim("02") + 0.35, ate: fim("03") + 0.7, fundo: "rua", bloco: "ruaDois", luz: "fria",
    cam: [[ROSTO_ARTHUR[0], ROSTO_ARTHUR[1] + 10, 2.5], [ROSTO_ARTHUR[0], ROSTO_ARTHUR[1], 2.9]] },

  // 22–35 s | A passagem
  { id: "theo_relogio", de: fim("03") + 0.7, ate: pal("04", "pediu") - 0.1, fundo: "rua", bloco: "ruaDois", luz: "fria",
    cam: [[430, 1370, 2.6], [430, 1350, 3.0]], at: { Theo: { pose: "abracar" } } },
  { id: "chuva_para", de: pal("04", "pediu") - 0.1, ate: pal("04", "pensasse") - 0.1, fundo: "rua", bloco: "ruaDois", luz: "fria",
    cam: [[600, 1240, 1.55], [600, 1225, 1.65]], at: { Arthur: { pose: "abracar", olhar: [-0.4, 1] } } },
  { id: "olhos_fechados", de: pal("04", "pensasse") - 0.1, ate: fim("04") + 0.5, fundo: "rua", bloco: "ruaDois", luz: "fria",
    cam: [[ROSTO_ARTHUR[0], ROSTO_ARTHUR[1] + 60, 2.2], [ROSTO_ARTHUR[0], ROSTO_ARTHUR[1] + 40, 2.6]],
    at: { Arthur: { pose: "abracar", fechado: true, expr: "sereno" } } },
  { id: "ponteiros", de: fim("04") + 0.5, ate: ini("05") - 0.6, fundo: "rua", bloco: "ruaDois", luz: "fria",
    cam: [[600, 1225, 1.65], [640, 1200, 1.9]], at: { Arthur: { pose: "abracar", fechado: true, expr: "sereno" } } },

  // 35–50 s | O reencontro
  { id: "abre_olhos", de: ini("05") - 0.6, ate: pal("05", "estava") - 0.1, fundo: "cozinha", bloco: "cozinha", luz: "dourada",
    cam: [[ROSTO_ARTHUR_M[0], ROSTO_ARTHUR_M[1], 2.3], [ROSTO_ARTHUR_M[0], ROSTO_ARTHUR_M[1], 2.5]], at: { ArthurM: { fechado: true, expr: "sereno" } } },
  { id: "onde_queria", de: pal("05", "estava") - 0.1, ate: pal("05", "três") - 0.1, fundo: "cozinha", bloco: "cozinha", luz: "dourada",
    cam: [[ROSTO_ARTHUR_M[0], ROSTO_ARTHUR_M[1], 2.5], [ROSTO_ARTHUR_M[0], ROSTO_ARTHUR_M[1], 2.7]] },
  { id: "domingo", de: pal("05", "três") - 0.1, ate: pal("05", "helena") - 0.35, fundo: "cozinha", bloco: "cozinha", luz: "dourada",
    cam: [[540, 1040, 1.05], [500, 1100, 1.3]], at: { ArthurM: { pose: "recuar", olhar: [0.3, 1] } } },
  { id: "helena_viva", de: pal("05", "helena") - 0.35, ate: fim("05") + 0.4, fundo: "cozinha", bloco: "cozinha", luz: "dourada",
    cam: [[ROSTO_HELENA[0], ROSTO_HELENA[1] + 30, 1.9], [ROSTO_HELENA[0], ROSTO_HELENA[1], 2.4]], at: { Helena: { oculto: false } } },
  { id: "helena_fala", de: fim("05") + 0.4, ate: fim("06") + 0.4, fundo: "cozinha", bloco: "cozinha", luz: "dourada",
    cam: [[ROSTO_HELENA[0], ROSTO_HELENA[1], 2.5], [ROSTO_HELENA[0], ROSTO_HELENA[1], 2.7]],
    at: { Helena: { oculto: false, expr: "feliz", olhar: [-1, 0] } } },
  { id: "arthur_reage", de: fim("06") + 0.4, ate: ini("07") - 0.1, fundo: "cozinha", bloco: "cozinha", luz: "dourada",
    cam: [[ROSTO_ARTHUR_M[0], ROSTO_ARTHUR_M[1], 2.6], [ROSTO_ARTHUR_M[0], ROSTO_ARTHUR_M[1], 2.9]],
    at: { ArthurM: { expr: "feliz", lagrima: true, olhar: [1, 0] } } },

  // 50–65 s | O valor do instante
  { id: "abraco", de: ini("07") - 0.1, ate: pal("07", "mas") - 0.1, fundo: "cozinha", bloco: "cozinha", luz: "dourada",
    cam: [[560, 1150, 1.6], [730, 1130, 2.0]],
    at: { ArthurM: { xPara: 680, expr: "feliz", pose: "abracar", lagrima: true, olhar: [1, 0] }, Helena: { oculto: false, expr: "feliz", pose: "abracar", olhar: [-1, 0] } } },
  { id: "rindo", de: pal("07", "mas") - 0.1, ate: pal("07", "segurou") - 0.3, fundo: "cozinha", bloco: "mesa", luz: "dourada",
    cam: [[550, 1210, 1.35], [550, 1200, 1.55]] },
  { id: "maos", de: pal("07", "segurou") - 0.3, ate: fim("07") + 0.6, fundo: "cozinha", bloco: "mesa", luz: "dourada",
    cam: [[550, 1220, 2.2], [550, 1232, 3.0]],
    at: { ArthurM: { pose: "apontarDir", expr: "sereno" }, Helena: { pose: "apontarEsq", expr: "sereno" } } },
  { id: "relogio_acelera", de: fim("07") + 0.6, ate: ini("08") - 1.3, fundo: "cozinha", bloco: "mesa", luz: "dourada",
    cam: [[KX, KY, 2.2], [KX, KY, 3.0]] },

  // 65–78 s | O retorno
  { id: "volta", de: ini("08") - 1.3, ate: ini("08") - 0.15, fundo: "rua", bloco: "ruaDois", luz: "fria",
    cam: [[ROSTO_ARTHUR[0], ROSTO_ARTHUR[1], 2.4], [ROSTO_ARTHUR[0], ROSTO_ARTHUR[1], 2.6]],
    at: { Arthur: { lagrima: true, olhar: [0, 0.4] } } },
  { id: "arthur_pede", de: ini("08") - 0.15, ate: fim("08") + 0.25, fundo: "rua", bloco: "ruaDois", luz: "fria",
    cam: [[620, 1260, 1.8], [600, 1270, 2.1]],
    at: { Arthur: { pose: "apontarEsq", lagrima: true }, Theo: { pose: "abracar", olhar: [1, -0.8] } } },
  { id: "theo_nega", de: fim("08") + 0.25, ate: pal("09", "algumas") - 0.1, fundo: "rua", bloco: "ruaDois", luz: "fria",
    cam: [[ROSTO_THEO[0], ROSTO_THEO[1], 2.9], [ROSTO_THEO[0], ROSTO_THEO[1], 3.0]],
    at: { Theo: { nega: true, expr: "triste", pose: "abracar", olhar: [1, -0.6] }, Arthur: { pose: "apontarEsq" } } },
  { id: "theo_fala", de: pal("09", "algumas") - 0.1, ate: fim("09") + 0.3, fundo: "rua", bloco: "ruaDois", luz: "fria",
    cam: [[ROSTO_THEO[0], ROSTO_THEO[1], 3.0], [ROSTO_THEO[0], ROSTO_THEO[1], 3.3]], at: { Theo: { pose: "abracar", olhar: [1, -0.8] } } },
  { id: "quem_e_voce", de: fim("09") + 0.3, ate: fim("10") + 0.5, fundo: "rua", bloco: "ruaDois", luz: "fria",
    cam: [[ROSTO_ARTHUR[0], ROSTO_ARTHUR[1], 2.6], [ROSTO_ARTHUR[0], ROSTO_ARTHUR[1], 3.0]],
    at: { Arthur: { expr: "surpreso", lagrima: true, olhar: [-1, 0.7] } } },
  { id: "theo_silencio", de: fim("10") + 0.5, ate: ini("11") - 0.3, fundo: "rua", bloco: "ruaDois", luz: "fria",
    cam: [[ROSTO_THEO[0], ROSTO_THEO[1], 3.1], [ROSTO_THEO[0], ROSTO_THEO[1], 3.4]], at: { Theo: { expr: "feliz", olhar: [1, -0.8] } } },

  // 78–90 s | Revelação final
  { id: "arthur_vai", de: ini("11") - 0.3, ate: pal("11", "theo") - 0.1, fundo: "rua", bloco: "ruaDois", luz: "fria",
    cam: [[560, 1160, 1.15], [540, 1180, 1.3]], at: { Arthur: { xPara: 1260, expr: "sereno", olhar: [1, 0.3] }, Theo: { olhar: [1, 0] } } },
  { id: "porta", de: pal("11", "theo") - 0.1, ate: pal("11", "tão") - 0.1, fundo: "rua", bloco: "porta", luz: "fria",
    cam: [[470, 1180, 1.6], [PX, PY + 60, 2.2]], at: { Theo: { x: 580, xPara: 450, yPara: 1470 } } },
  { id: "cosmos", de: pal("11", "tão") - 0.1, ate: pal("11", "ele") - 0.1, fundo: "cosmos", bloco: "cosmos", luz: "noite",
    cam: [[540, 1000, 1.0], [540, 940, 1.2]], at: { Theo: { yPara: 1640 } } },
  { id: "memorias", de: pal("11", "ele") - 0.1, ate: pal("11", "mas") - 0.2, fundo: "cosmos", luz: "noite",
    cam: [[330, 620, 1.9], [720, 900, 2.1]] },
  { id: "theo_final", de: pal("11", "mas") - 0.2, ate: PRETO, fundo: "cosmos", bloco: "cosmosPerto", luz: "noite",
    cam: [[540, 1150, 1.5], [540, 1138, 1.9]], at: { Theo: { expr: "feliz" } } },
];

const plano = (id: string) => SHOTS.find((s) => s.id === id)!;
const P_PARAM = plano("relogios_param"), P_RELOGIO = plano("theo_relogio"), P_CHUVA = plano("chuva_para");
const P_PONT = plano("ponteiros"), P_ACEL = plano("relogio_acelera"), P_VOLTA = plano("volta");
const P_MOEDA = plano("moeda"), P_PEDE = plano("arthur_pede"), P_VAI = plano("arthur_vai");
const P_PORTA = plano("porta"), P_COSMOS = plano("cosmos"), P_VITRINE = plano("vitrine");

const T_PARA = P_PARAM.de + 0.7;      // os relógios da rua param
const T_SUSPENDE = P_CHUVA.de + 1.0;  // a chuva fica suspensa
const T_OURO = ini("05") - 0.6;       // a tela vira luz dourada
const T_VOLTA = P_VOLTA.de;

const cenario = ({ t, shot }: Contexto) => {
  if (shot.fundo === "cozinha") {
    const acel = Math.max(0, t - P_ACEL.de);
    return <Cozinha t={t} tRelogio={33000 + t * 2 + acel ** 3 * 500} brilho={sobe(t, P_ACEL.de + 0.4, P_ACEL.ate)} />;
  }
  if (shot.fundo === "cosmos") return <Cosmos t={t} />;
  const suspensa = t >= T_SUSPENDE && t < T_VOLTA;
  const tChuva = t < T_SUSPENDE ? t : suspensa ? T_SUSPENDE : t - (T_VOLTA - T_SUSPENDE);
  const reverso = t >= P_PONT.de && t < T_VOLTA ? (t - P_PONT.de) ** 2 * 900 : 0;
  // Os relógios param por um instante perto de Theo e depois voltam a andar.
  const parado = t < T_PARA ? t : t < T_PARA + 1.2 ? T_PARA : t - 1.2;
  const comArthur = t >= P_CHUVA.de;
  const ouro = t < P_RELOGIO.de || t >= T_VOLTA ? 0 : t < P_PONT.de ? 0.16 + 0.03 * Math.sin(t * 5) : 0.2 + sobe(t, P_PONT.de, T_OURO) * 0.9;
  return (
    <Rua t={t} tChuva={tChuva} tRelogio={37000 + parado - reverso} suspensa={suspensa ? 1 : 0}
      ouro={ouro} ouroEm={comArthur ? [760, 1368] : [430, 1436]}
      chuva={1 - sobe(t, P_VAI.de + 0.6, P_PORTA.de)} seco={[430, 1650]}
      reflexo={t >= P_VITRINE.de - 0.5 && t < P_MOEDA.de ? ELENCO.Arthur : undefined}
      porta={sobe(t, P_PORTA.de + 0.5, P_PORTA.ate - 0.3)} />
  );
};

const Placa = ({ x, y, giro }: { x: number; y: number; giro: number }) => (
  <g transform={`translate(${x} ${y}) rotate(${giro}) scale(0.6)`}>
    <rect x={-9} y={-340} width={18} height={340} fill="#6b4a30" />
    <rect x={-190} y={-560} width={380} height={230} rx={10} fill="#efe3c4" stroke="#3d2c1c" strokeWidth={9} />
    <text x={0} y={-486} textAnchor="middle" fontFamily={FONT} fontSize={50} fill="#2a2016">VENDO</text>
    <text x={0} y={-430} textAnchor="middle" fontFamily={FONT} fontSize={50} fill="#2a2016">5 MINUTOS</text>
    <text x={0} y={-356} textAnchor="middle" fontFamily={FONT} fontSize={72} fill="#b3261e">R$ 1</text>
  </g>
);

const RelogioBolso = ({ x, y, r, tempo }: { x: number; y: number; r: number; tempo: number }) => {
  const a = (tempo * 6 - 90) * (Math.PI / 180), b = ((tempo / 12) * 6 - 90) * (Math.PI / 180);
  return (
    <g>
      <rect x={x - r * 0.16} y={y - r * 1.34} width={r * 0.32} height={r * 0.34} rx={r * 0.1} fill="#b8923f" />
      <circle cx={x} cy={y} r={r} fill="#e8c35a" stroke="#8b6a1f" strokeWidth={r * 0.12} />
      <circle cx={x} cy={y} r={r * 0.76} fill="#fbf3dc" />
      <line x1={x} y1={y} x2={x + Math.cos(a) * r * 0.62} y2={y + Math.sin(a) * r * 0.62} stroke="#3d2c1c" strokeWidth={r * 0.07} strokeLinecap="round" />
      <line x1={x} y1={y} x2={x + Math.cos(b) * r * 0.42} y2={y + Math.sin(b) * r * 0.42} stroke="#3d2c1c" strokeWidth={r * 0.1} strokeLinecap="round" />
    </g>
  );
};

const Moeda = ({ x, y, r = 16 }: { x: number; y: number; r?: number }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill="#e8c35a" stroke="#8b6a1f" strokeWidth={r * 0.2} />
    <text x={x} y={y + r * 0.38} textAnchor="middle" fontFamily={FONT} fontSize={r * 1.1} fill="#8b6a1f">1</text>
  </g>
);

const itens = ({ t, shot, p }: Contexto) => {
  const lista: { y: number; el: React.ReactNode }[] = [];
  if (shot.fundo === "rua") {
    // A placa: erguida no começo, depois encostada na parede da relojoaria.
    const erguida = t < P_MOEDA.de;
    lista.push({
      y: erguida ? 1651 : 1300,
      el: <Placa key="placa" x={erguida ? 522 : 250} y={erguida ? 1372 : 1640} giro={erguida ? 0 : -10} />,
    });
    // O relógio de bolso: com Theo, depois nas mãos de Arthur, e de volta com Theo.
    const comTheo = shot.id === "theo_relogio" || (t >= T_VOLTA && t < P_VAI.de);
    if (comTheo) lista.push({ y: 1660, el: <RelogioBolso key="rel" x={430} y={1436} r={30} tempo={t} /> });
    if (t >= P_CHUVA.de && t < T_VOLTA) {
      lista.push({ y: 1680, el: <RelogioBolso key="rel" x={760} y={1368} r={34} tempo={t >= P_PONT.de ? -((t - P_PONT.de) ** 2) * 60 : t} /> });
    }
    if (shot.id === "moeda") lista.push({ y: 1690, el: <Moeda key="moeda" x={525 + 62 * p} y={1254 + 92 * p} /> });
    if (shot.id === "arthur_pede" || shot.id === "theo_nega") lista.push({ y: 1690, el: <Moeda key="moeda" x={525} y={1254} /> });
  }
  if (shot.fundo === "cozinha" && shot.bloco === "mesa") lista.push({ y: 1700, el: <MesaCafe key="mesa" t={t} /> });
  return lista;
};

// O relógio de bolso tomando a tela, com os ponteiros girando para trás.
const sobre = ({ t }: Contexto) => {
  if (t < P_PONT.de || t >= T_OURO) return null;
  const k = sobe(t, P_PONT.de, P_PONT.de + 0.5);
  return (
    <AbsoluteFill style={{ opacity: k }}>
      <svg width={1080} height={1920}>
        <circle cx={540} cy={820} r={520} fill="#ffd98a" opacity={0.25} />
        <RelogioBolso x={540} y={820} r={300 + 40 * k} tempo={-((t - P_PONT.de) ** 2) * 70} />
      </svg>
    </AbsoluteFill>
  );
};

const fx = ({ t }: Contexto) => {
  const ouro = Math.max(sobe(t, T_OURO - 0.7, T_OURO) * (t < T_OURO ? 1 : 0), decai(t, T_OURO, 1.3));
  const branco = Math.max(sobe(t, T_VOLTA - 0.7, T_VOLTA) * (t < T_VOLTA ? 1 : 0), decai(t, T_VOLTA, 1.2));
  // Atravessar a porta: a luz de dentro toma a tela e se desfaz no espaço dos relógios.
  const porta = Math.max(sobe(t, P_COSMOS.de - 0.5, P_COSMOS.de) * (t < P_COSMOS.de ? 1 : 0), decai(t, P_COSMOS.de, 1.0));
  return ouro > 0
    ? { clarao: ouro, claraoCor: "#ffe7a8" }
    : branco > 0
      ? { clarao: branco, claraoCor: "#fff6dc" }
      : { clarao: porta, claraoCor: "#fff0c4" };
};

const Final = ({ t }: { t: number }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 80px", textAlign: "center", fontFamily: FONT, color: "#f3ead2", fontSize: 84, lineHeight: 1.22, opacity: interpolate(t, [PRETO + 0.5, PRETO + 1.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
    <div>
      SE VOCÊ TIVESSE<br />
      <span style={{ color: "#e8c35a" }}>CINCO MINUTOS</span><br />
      COM ALGUÉM DO PASSADO,<br />
      QUEM ESCOLHERIA?
    </div>
  </AbsoluteFill>
);

const S = "minutos/sfx/";

export const Minutos = () => (
  <Episodio
    manifesto={manifesto} shots={SHOTS} blocos={BLOCOS} preto={PRETO} elenco={ELENCO}
    cenario={cenario} itens={itens} sobre={sobre} fx={fx} final={(t) => <Final t={t} />}
    corLegenda={(p) => (p === "Narrador" ? "#fff3d6" : "#ffd98a")} trilha={`${S}musica.mp3`}
    sons={
      <>
        <Som fps={FPS} em={0} src={`${S}chuva.mp3`} volume={0.35} dur={Math.min(19.8, T_SUSPENDE)} />
        <Som fps={FPS} em={19.5} src={`${S}chuva.mp3`} volume={0.35} dur={Math.max(0.1, T_SUSPENDE - 19.5)} />
        <Som fps={FPS} em={P_PARAM.de - 1.2} src={`${S}tique.mp3`} volume={0.7} />
        <Som fps={FPS} em={P_MOEDA.de + 1.2} src={`${S}moeda.mp3`} volume={0.6} />
        <Som fps={FPS} em={P_PONT.de - 0.2} src={`${S}reverso.mp3`} volume={0.7} />
        <Som fps={FPS} em={P_ACEL.de} src={`${S}acelera.mp3`} volume={0.6} />
        <Som fps={FPS} em={T_VOLTA + 0.2} src={`${S}chuva.mp3`} volume={0.35} dur={P_VAI.de + 1.0 - T_VOLTA} />
        <Som fps={FPS} em={P_PEDE.de + 0.4} src={`${S}moeda.mp3`} volume={0.35} />
        <Som fps={FPS} em={P_PORTA.de + 0.6} src={`${S}reverso.mp3`} volume={0.4} />
      </>
    }
  />
);

export const MINUTOS_DURACAO = Math.round(manifesto.duracao * FPS);
export const MINUTOS_FPS = FPS;
