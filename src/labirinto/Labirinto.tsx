import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import manifestoJson from "./manifest.json";
import { FONT } from "../theme";
import { Ator, type Visual } from "../serie/Ator";
import {
  Episodio, Som, decai, est as e, sobe, tempos,
  type Bloco, type Contexto, type Manifesto, type Shot,
} from "../serie/motor";
import { Abrigo, Aereo, CidadeLivre, Corredor, MundoDevastado, Passagem, PassagemFrente, Porta, Robo, SalaMonitores } from "./cenarios";

// O Labirinto dos Esquecidos — curta narrado.

const manifesto = manifestoJson as Manifesto;
const FPS = manifesto.fps;
const PRETO = manifestoJson.preto;
const { fim, pal } = tempos(manifesto);

const CAIO: Visual = { pele: "#d9a074", cabelo: "#2e211b", roupa: "#3f6f8f", detalhe: "#d8dde3", calca: "#2a2f3a", estilo: "curto" };
const LUNA: Visual = { pele: "#f1cbb0", cabelo: "#d9dce2", roupa: "#7a4fa3", calca: "#262a35", estilo: "longo", sobrancelha: "#8a8d94" };
const PEDRO: Visual = { pele: "#a8744e", cabelo: "#17110e", roupa: "#c2772e", calca: "#3a3f4d", estilo: "cacheado" };
const NINA: Visual = { pele: "#edc09c", cabelo: "#b5432e", roupa: "#2f8a6a", calca: "#2b2f3b", estilo: "coque", oculos: true };
const ELENCO: Record<string, Visual> = {
  Caio: CAIO, Luna: LUNA, Pedro: PEDRO, Nina: NINA,
  Vulto: { pele: "#c68a5e", cabelo: "#2e211b", roupa: "#6b6f78", calca: "#2a2f3a", estilo: "baguncado" },
};

const BLOCOS: Record<string, Bloco> = {
  some: { Vulto: e(540, 1760, 0.55, "panico", [0, -0.4], "recuar") },
  centro: { Caio: e(540, 1790, 0.75, "sereno", [0, 0]) },
  abrigo: {
    Luna: e(170, 1790, 0.6, "desconfiado", [1, 0]), Pedro: e(360, 1800, 0.6, "medo", [1, 0]),
    Nina: e(770, 1790, 0.6, "triste", [0.6, 0]), Caio: e(950, 1800, 0.6, "medo", [-1, 0]),
  },
  regra: { Luna: e(300, 1800, 0.7, "firme", [0.8, -0.2], "apontarDir"), Caio: e(780, 1800, 0.7, "medo", [-0.4, -0.5]) },
  desenha: { Caio: e(540, 1800, 0.8, "firme", [0, 0.9]) },
  corre: {
    Pedro: e(250, 1740, 0.5, "medo", [0, -0.3]), Nina: e(820, 1750, 0.5, "medo", [0, -0.3]),
    Caio: e(430, 1820, 0.6, "firme", [0, -0.3]), Luna: e(650, 1840, 0.6, "firme", [0, -0.3]),
  },
  porta: {
    Luna: e(90, 1800, 0.45, "medo", [1, -0.3]), Pedro: e(190, 1830, 0.45, "medo", [1, -0.3]),
    Nina: e(60, 1870, 0.45, "medo", [1, -0.3]), Caio: e(900, 1830, 0.5, "firme", [0.4, -0.6], "apontarCima"),
  },
  captura: { Pedro: e(430, 1800, 0.8, "panico", [1, 0], "recuar") },
  puxa: { Luna: e(450, 1800, 0.62, "firme", [1, 0], "apontarDir"), Pedro: e(640, 1800, 0.62, "panico", [1, 0]) },
  sala: {
    Luna: e(190, 1820, 0.55, "surpreso", [0.3, -0.8]), Pedro: e(390, 1800, 0.55, "medo", [0.2, -0.8]),
    Caio: e(610, 1830, 0.6, "surpreso", [-0.2, -0.8]), Nina: e(850, 1800, 0.55, "medo", [-0.4, -0.8]),
  },
  apagou: { Caio: e(540, 1800, 0.75, "sereno", [0, 0]) },
  fora: {
    Luna: e(180, 1820, 0.6, "feliz", [0, -0.8]), Caio: e(410, 1830, 0.62, "feliz", [0, -0.8]),
    Pedro: e(650, 1820, 0.6, "feliz", [0, -0.8]), Nina: e(890, 1830, 0.6, "feliz", [0, -0.8]),
  },
  cidade: {
    Luna: e(330, 1880, 0.42, "feliz", [0.2, -0.9]), Caio: e(470, 1890, 0.44, "feliz", [0, -0.9], "apontarCima"),
    Pedro: e(620, 1880, 0.42, "feliz", [-0.1, -0.9]), Nina: e(760, 1890, 0.42, "feliz", [-0.2, -0.9]),
  },
};
const rostoDe = (b: string, n: string): [number, number] => [BLOCOS[b][n].x, BLOCOS[b][n].y - 690 * BLOCOS[b][n].s];
const R_CENTRO = rostoDe("centro", "Caio");
const closeAbrigo = (n: string, de: number, ate: number): Shot => {
  const [x, y] = rostoDe("abrigo", n);
  return { id: `c_${n}`, de, ate, fundo: "abrigo", bloco: "abrigo", luz: "abajur", cam: [[x, y + 20, 2.6], [x, y + 20, 2.9]], at: { [n]: { olhar: [0, 0] } } };
};

const SHOTS: Shot[] = [
  // 00–12 s | A parede que se move
  { id: "gancho", de: 0, ate: pal("01", "paredes") - 0.3, fundo: "corredor", luz: "noite", tremor: 6,
    cam: [[540, 1000, 1.0], [540, 940, 1.25]] },
  { id: "aereo", de: pal("01", "paredes") - 0.3, ate: pal("01", "quem") - 0.4, fundo: "aereo", luz: "noite", tremor: 3,
    cam: [[540, 960, 1.5], [540, 960, 1.0]] },
  { id: "some", de: pal("01", "quem") - 0.4, ate: pal("01", "naquela") - 0.2, fundo: "corredor", bloco: "some", luz: "noite", tremor: 6,
    cam: [[540, 1300, 1.2], [540, 1250, 1.7]], at: { Vulto: { yPara: 1640, sPara: 0.42, dissolve: 0, dissolvePara: 1 } } },
  { id: "dorme", de: pal("01", "naquela") - 0.2, ate: pal("01", "caio") - 0.1, fundo: "manha", bloco: "centro", luz: "normal",
    cam: [[R_CENTRO[0], R_CENTRO[1], 2.4], [R_CENTRO[0], R_CENTRO[1], 2.7]], at: { Caio: { fechado: true } } },
  { id: "acorda", de: pal("01", "caio") - 0.1, ate: pal("01", "sem") - 0.2, fundo: "manha", bloco: "centro", luz: "normal",
    cam: [[R_CENTRO[0], R_CENTRO[1], 2.9], [540, 1400, 1.4]], at: { Caio: { expr: "congelado", olhar: [0.9, -0.3], pose: "recuar" } } },
  { id: "centro", de: pal("01", "sem") - 0.2, ate: fim("01") + 0.3, fundo: "aereo", luz: "normal",
    cam: [[540, 960, 3.2], [540, 960, 1.0]] },

  // 12–25 s | Os sobreviventes
  { id: "encontro", de: fim("01") + 0.3, ate: pal("02", "luna") - 0.2, fundo: "abrigo", bloco: "abrigo", luz: "abajur",
    cam: [[620, 1350, 1.2], [540, 1400, 1.35]], at: { Caio: { x: 1250, xPara: 950 } } },
  closeAbrigo("Luna", pal("02", "luna") - 0.2, pal("02", "pedro") - 0.15),
  closeAbrigo("Pedro", pal("02", "pedro") - 0.15, pal("02", "nina") - 0.25),
  closeAbrigo("Nina", pal("02", "nina") - 0.25, pal("02", "estavam") - 0.1),
  { id: "dias", de: pal("02", "estavam") - 0.1, ate: pal("02", "conheciam") - 0.2, fundo: "abrigo", bloco: "abrigo", luz: "abajur",
    cam: [[330, 1000, 1.9], [420, 1000, 1.9]] },
  { id: "regra", de: pal("02", "conheciam") - 0.2, ate: pal("02", "mas") - 0.2, fundo: "vermelhas", bloco: "regra", luz: "noite",
    cam: [[540, 1300, 1.2], [540, 1050, 1.9]], at: { Luna: { nega: true } } },
  { id: "percebe", de: pal("02", "mas") - 0.2, ate: pal("02", "paredes") - 0.2, fundo: "manha", bloco: "centro", luz: "normal",
    cam: [[R_CENTRO[0], R_CENTRO[1], 2.2], [R_CENTRO[0], R_CENTRO[1], 2.9]], at: { Caio: { expr: "desconfiado", olhar: [0.5, -1] } } },
  { id: "desenho", de: pal("02", "paredes") - 0.2, ate: fim("02") + 0.3, fundo: "aereo", luz: "normal",
    cam: [[540, 960, 1.15], [540, 960, 1.0]] },

  // 25–38 s | A descoberta
  { id: "comida", de: fim("02") + 0.3, ate: pal("03", "caio") - 0.2, fundo: "abrigo", bloco: "abrigo", luz: "abajur",
    cam: [[440, 1400, 1.3], [700, 1400, 1.5]],
    at: { Luna: { xPara: -260 }, Pedro: { xPara: -160 }, Nina: { xPara: -60 }, Caio: { expr: "firme", olhar: [0, 0.8] } } },
  { id: "desenha", de: pal("03", "caio") - 0.2, ate: pal("03", "ao") - 0.2, fundo: "abrigo2", bloco: "desenha", luz: "abajur",
    cam: [[540, 1380, 1.5], [540, 1420, 2.0]] },
  { id: "mapas", de: pal("03", "ao") - 0.2, ate: pal("03", "eram") - 0.2, fundo: "abrigo2", bloco: "desenha", luz: "abajur",
    cam: [[540, 1420, 2.0], [540, 1420, 2.1]] },
  { id: "codigos", de: pal("03", "eram") - 0.2, ate: fim("03") + 0.4, fundo: "porta", luz: "noite",
    cam: [[620, 1150, 1.2], [900, 1160, 2.6]] },

  // 38–52 s | A corrida
  { id: "correm", de: fim("03") + 0.4, ate: pal("04", "assim") - 0.1, fundo: "corredor", bloco: "corre", luz: "normal", tremor: 5,
    cam: [[540, 1300, 1.2], [540, 1450, 1.6]],
    at: { Caio: { y: 1560, s: 0.36, yPara: 1820, sPara: 0.6 }, Luna: { y: 1570, s: 0.36, yPara: 1840, sPara: 0.6 }, Pedro: { y: 1520, s: 0.3, yPara: 1740, sPara: 0.5 }, Nina: { y: 1530, s: 0.3, yPara: 1750, sPara: 0.5 } } },
  { id: "abre", de: pal("04", "assim") - 0.1, ate: pal("04", "criaturas") - 0.2, fundo: "porta", bloco: "porta", luz: "noite",
    cam: [[640, 1300, 1.3], [540, 1200, 1.15]] },
  { id: "robos", de: pal("04", "criaturas") - 0.2, ate: pal("04", "pedro") - 0.1, fundo: "corredor", luz: "noite", tremor: 6,
    cam: [[540, 1000, 1.7], [540, 1300, 1.1]] },
  { id: "captura", de: pal("04", "pedro") - 0.1, ate: pal("04", "mas") - 0.2, fundo: "corredor", bloco: "captura", luz: "noite", tremor: 7,
    cam: [[560, 1350, 1.4], [480, 1260, 2.2]] },
  { id: "puxa", de: pal("04", "mas") - 0.2, ate: pal("04", "faltavam") - 0.1, fundo: "passagem", bloco: "puxa", luz: "noite", tremor: 4,
    cam: [[600, 1380, 1.4], [520, 1380, 1.9]], at: { Pedro: { x: 980, xPara: 640 }, Luna: { x: 560, xPara: 450 } } },
  { id: "relogio", de: pal("04", "faltavam") - 0.1, ate: fim("04") + 0.3, fundo: "corredor", bloco: "corre", luz: "noite", tremor: 6,
    cam: [[540, 1300, 1.1], [540, 1400, 1.4]], at: { Caio: { expr: "medo" }, Luna: { expr: "medo" } } },

  // 52–65 s | A última porta
  { id: "sala", de: fim("04") + 0.3, ate: pal("05", "as") - 0.2, fundo: "monitores", bloco: "sala", luz: "noite",
    cam: [[540, 1300, 1.25], [540, 1000, 1.0]],
    at: { Luna: { x: -300, xPara: 190 }, Pedro: { x: -200, xPara: 390 }, Caio: { x: -100, xPara: 610 }, Nina: { x: -400, xPara: 850 } } },
  { id: "telas", de: pal("05", "as") - 0.2, ate: pal("05", "então") - 0.1, fundo: "monitores", bloco: "sala", luz: "noite",
    cam: [[260, 480, 2.2], [820, 900, 2.2]] },
  { id: "arquivo", de: pal("05", "então") - 0.1, ate: pal("05", "ele") - 0.1, fundo: "monitores", bloco: "sala", luz: "noite",
    cam: [[540, 1300, 1.6], [540, 1300, 1.7]] },
  { id: "construiu", de: pal("05", "ele") - 0.1, ate: fim("05") + 0.4, fundo: "monitores", bloco: "sala", luz: "noite",
    cam: [[rostoDe("sala", "Caio")[0], rostoDe("sala", "Caio")[1], 2.2], [rostoDe("sala", "Caio")[0], rostoDe("sala", "Caio")[1], 3.2]],
    at: { Caio: { expr: "congelado", olhar: [0, 0] }, Pedro: { olhar: [1, 0], expr: "desconfiado" }, Nina: { olhar: [-1, 0], expr: "surpreso" } } },

  // 65–78 s | A verdade
  { id: "teste", de: fim("05") + 0.4, ate: pal("06", "sobreviver") - 0.1, fundo: "aereo", luz: "noite",
    cam: [[540, 960, 1.3], [540, 960, 1.0]] },
  { id: "mundo", de: pal("06", "sobreviver") - 0.1, ate: pal("06", "caio") - 0.3, fundo: "mundo", luz: "normal", tremor: 2,
    cam: [[540, 1300, 1.3], [540, 800, 1.1]] },
  { id: "apagou", de: pal("06", "caio") - 0.3, ate: pal("06", "mas") - 0.2, fundo: "monitores", bloco: "apagou", luz: "fria",
    cam: [[540, 1250, 1.5], [540, 1200, 2.1]], at: { Caio: { holo: "APAGAR MEMÓRIA", holoCor: "#7ef0ff" } } },
  { id: "reiniciar", de: pal("06", "mas") - 0.2, ate: fim("06") + 0.4, fundo: "monitores", bloco: "sala", luz: "vermelha",
    cam: [[540, 1200, 1.2], [540, 1200, 1.3]], at: { Caio: { expr: "bravo" }, Luna: { expr: "panico" }, Pedro: { expr: "panico" }, Nina: { expr: "panico" } } },

  // 78–90 s | A saída
  { id: "codigo", de: fim("06") + 0.4, ate: pal("07", "para") - 0.1, fundo: "monitores", bloco: "sala", luz: "noite", tremor: 2,
    cam: [[600, 1380, 1.9], [580, 1340, 2.2]], at: { Caio: { expr: "firme", pose: "empurrar", olhar: [0, 0.9] } } },
  { id: "desliga", de: pal("07", "para") - 0.1, ate: pal("07", "abrir") - 0.3, fundo: "corredor", luz: "noite",
    cam: [[540, 1450, 1.4], [540, 1500, 1.6]] },
  { id: "portas", de: pal("07", "abrir") - 0.3, ate: pal("07", "os") - 0.2, fundo: "portasol", luz: "normal",
    cam: [[540, 1200, 1.0], [540, 1150, 1.3]] },
  { id: "fora", de: pal("07", "os") - 0.2, ate: pal("07", "pela") - 0.2, fundo: "saida", bloco: "corre", luz: "dourada", tremor: 3,
    cam: [[540, 1400, 1.4], [540, 1250, 1.2]],
    at: { Caio: { yPara: 1560, sPara: 0.36, expr: "feliz" }, Luna: { yPara: 1570, sPara: 0.36, expr: "feliz" }, Pedro: { yPara: 1520, sPara: 0.3, expr: "feliz" }, Nina: { yPara: 1530, sPara: 0.3, expr: "feliz" } } },
  { id: "sol", de: pal("07", "pela") - 0.2, ate: pal("07", "encontraram") - 0.2, fundo: "ceu", bloco: "fora", luz: "dourada",
    cam: [[250, 1420, 2.3], [830, 1420, 2.3]], at: { Luna: { fechado: true }, Caio: { fechado: true }, Pedro: { fechado: true, lagrima: true }, Nina: { fechado: true } } },
  { id: "cidade", de: pal("07", "encontraram") - 0.2, ate: pal("07", "alto") - 0.6, fundo: "cidade", bloco: "cidade", luz: "dia",
    cam: [[540, 1560, 1.7], [540, 1300, 1.1]] },
  { id: "mensagem", de: pal("07", "alto") - 0.6, ate: pal("07", "vocês") + 2.4, fundo: "cidade", bloco: "cidade", luz: "dia",
    cam: [[540, 1200, 1.2], [540, 420, 1.25]] },
  { id: "livres", de: pal("07", "vocês") + 2.4, ate: PRETO, fundo: "cidade", bloco: "cidade", luz: "dia",
    cam: [[540, 420, 1.25], [540, 960, 1.0]] },
];

const P = Object.fromEntries(SHOTS.map((s) => [s.id, s]));
const dentro = (t: number, id: string) => sobe(t, P[id].de, P[id].ate);
const CODIGO = "7391";
const T_ABRE = P.abre.de + 0.35;

const cenario = ({ t, shot }: Contexto) => {
  switch (shot.fundo) {
    case "aereo":
      if (shot.id === "aereo") return <Aereo t={t} dia={dentro(t, "aereo") * 1.6} alerta={1} />;
      if (shot.id === "centro") return <Aereo t={t} dia={2} />;
      if (shot.id === "desenho") return <Aereo t={t} dia={3 + dentro(t, "desenho") * 2.6} portas />;
      return <Aereo t={t} dia={6} zoom={1 - 0.45 * dentro(t, "teste")} portas />;
    case "manha": return <Corredor t={t} ceu="manha" />;
    case "vermelhas": return <Corredor t={t} ceu="tarde" vermelhas={1} />;
    case "abrigo": case "abrigo2": return <Abrigo t={t} />;
    case "porta": return <Porta t={t} codigo={shot.id === "codigos" ? CODIGO.slice(0, Math.ceil(dentro(t, "codigos") * 5)) : CODIGO} abre={shot.id === "abre" ? sobe(t, T_ABRE, T_ABRE + 0.6) : 0} />;
    case "portasol": return <Porta t={t} codigo={CODIGO} abre={sobe(t, P.portas.de + 0.2, P.portas.ate - 0.2)} sol />;
    case "passagem": return <Passagem t={t} />;
    case "monitores": return <SalaMonitores t={t} v={[CAIO, LUNA, PEDRO, NINA]} aceito={shot.id === "codigo" && t > P.codigo.de + 1.1} />;
    case "mundo": return <MundoDevastado t={t} />;
    case "saida": return <Corredor t={t} ceu="manha" saida={1} />;
    case "ceu": return (
      <g>
        <defs><linearGradient id="lb-sol" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5fa8e0" /><stop offset="1" stopColor="#ffe9b8" /></linearGradient></defs>
        <rect x={-200} y={-200} width={1480} height={2320} fill="url(#lb-sol)" />
        <circle cx={540} cy={700} r={600} fill="#fff3c9" opacity={0.5} />
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1={540} y1={500} x2={540 + Math.cos(i * 0.52 + t * 0.15) * 1600} y2={500 + Math.sin(i * 0.52 + t * 0.15) * 1600} stroke="#fff" strokeWidth={40} opacity={0.12} />)}
        <rect x={-200} y={1820} width={1480} height={300} fill="#b9a98a" />
      </g>
    );
    case "cidade": return <CidadeLivre t={t} />;
    default: break;
  }
  switch (shot.id) {
    case "gancho": return <Corredor t={t} ceu="tarde" fecha={sobe(t, 0.3, P.gancho.ate)} vermelhas={0.7} />;
    case "some": return <Corredor t={t} ceu="tarde" fecha={0.2 + 0.75 * dentro(t, "some")} vermelhas={1} />;
    case "robos": return <Corredor t={t} ceu="tarde" robos={dentro(t, "robos")} vermelhas={0.8} />;
    case "captura": return <Corredor t={t} ceu="tarde" vermelhas={0.8} />;
    case "relogio": return <Corredor t={t} ceu="tarde" vermelhas={1} fecha={0.25 * dentro(t, "relogio")} robos={0.45} />;
    case "desliga": return <Corredor t={t} ceu="tarde" robos={0.9} robosOff={t > P.desliga.de + 0.5} />;
    default: return <Corredor t={t} ceu="tarde" />;
  }
};

const itens = ({ t, shot }: Contexto) => {
  if (shot.id === "captura") {
    const x = 1150 - dentro(t, "captura") * 330;
    return [{ y: 2000, el: <g key="r" transform={`translate(${x} 1830) scale(0.95)`}><Robo t={t} /></g> }];
  }
  if (shot.id === "desenha" || shot.id === "mapas") {
    return [{
      y: 2000, el: (
        <g key="placa" transform="translate(540 1500) rotate(-4)">
          <rect x={-150} y={-90} width={300} height={190} rx={8} fill="#7a858f" stroke="#1c2227" strokeWidth={8} />
          <path d="M-110 -50 L-40 -50 L-40 10 L40 10 L40 -40 L110 -40 M-110 50 L-10 50 L-10 70 L100 70" stroke="#e8e4dc" strokeWidth={6} fill="none" strokeDasharray={600} strokeDashoffset={600 - 600 * sobe(t, P.desenha.de, P.desenha.ate)} />
          {Math.sin(t * 30) > 0.3 && shot.id === "desenha" && <circle cx={-110 + 220 * dentro(t, "desenha")} cy={-50 + 100 * dentro(t, "desenha")} r={12} fill="#ffd166" />}
        </g>
      ),
    }];
  }
  return [];
};

const frente = ({ t, shot }: Contexto) => (shot.fundo === "passagem" ? <PassagemFrente t={t} /> : null);

// ---------- sobreposições ----------
const Etiqueta = ({ texto, sub }: { texto: string; sub?: string }) => (
  <AbsoluteFill style={{ alignItems: "center", fontFamily: FONT, color: "#fff" }}>
    <div style={{ marginTop: 250, fontSize: 130, letterSpacing: 6, textShadow: "0 6px 0 #14161c, 0 0 40px rgba(0,0,0,0.6)", borderBottom: "10px solid #7ef0ff", padding: "0 30px" }}>{texto}</div>
    {sub && <div style={{ fontSize: 54, marginTop: 14, color: "#7ef0ff", textShadow: "0 4px 0 #14161c" }}>{sub}</div>}
  </AbsoluteFill>
);

const TRILHAS = [
  "M40 120 L260 120 L260 320 L480 320 L480 180 L700 180 M260 320 L260 560 L560 560",
  "M700 620 L420 620 L420 400 L160 400 L160 660 M420 400 L420 240 L620 240",
  "M100 60 L100 260 L360 260 L360 480 L640 480 L640 700 M360 260 L560 260 L560 80",
];
const Mapas = ({ t, p }: { t: number; p: number }) => (
  <AbsoluteFill style={{ alignItems: "center", background: "rgba(4,6,10,0.55)" }}>
    <svg width={860} height={860} viewBox="-60 -60 860 860" style={{ marginTop: 300 }}>
      <rect x={-40} y={-40} width={820} height={820} rx={16} fill="#6f7a84" stroke="#1c2227" strokeWidth={12} />
      {Array.from({ length: 14 }, (_, i) => <line key={i} x1={-20 + i * 60} y1={-30} x2={-60 + i * 60} y2={770} stroke="#fff" strokeOpacity={0.05} strokeWidth={4} />)}
      {TRILHAS.map((d, i) => {
        const a = sobe(p, i * 0.22, i * 0.22 + 0.3);
        return <path key={i} d={d} stroke={["#e8e4dc", "#7ef0ff", "#ffd166"][i]} strokeWidth={10} fill="none" opacity={a * 0.9}
          transform={`translate(${(1 - a) * (i - 1) * 420} ${(1 - a) * 300}) rotate(${(1 - a) * (i - 1) * 20} 370 370)`} />;
      })}
      {CODIGO.split("").map((d, i) => {
        const a = sobe(p, 0.66 + i * 0.07, 0.72 + i * 0.07);
        const [x, y] = [[260, 320], [420, 400], [360, 260], [560, 560]][i];
        return a > 0 ? (
          <g key={i} opacity={a}>
            <circle cx={x} cy={y} r={56 + 6 * Math.sin(t * 8 + i)} fill="#ff8a5f" opacity={0.35} />
            <circle cx={x} cy={y} r={44} fill="#14161c" stroke="#ff8a5f" strokeWidth={6} />
            <text x={x} y={y + 24} textAnchor="middle" fontFamily={FONT} fontSize={68} fill="#ffd166">{d}</text>
          </g>
        ) : null;
      })}
    </svg>
  </AbsoluteFill>
);

const Painel = ({ children, cor = "#7ef0ff", top = 330 }: { children: ReactNode; cor?: string; top?: number }) => (
  <AbsoluteFill style={{ alignItems: "center", background: "rgba(2,6,12,0.45)" }}>
    <div style={{ marginTop: top, width: 900, boxSizing: "border-box", padding: "36px 44px", background: "rgba(10,20,30,0.88)", border: `5px solid ${cor}`, borderRadius: 18, boxShadow: `0 0 70px ${cor}55`, color: "#e8f6ff", fontFamily: FONT }}>
      {children}
    </div>
  </AbsoluteFill>
);

const Retrato = ({ v, t, w = 190, apagado = 0 }: { v: Visual; t: number; w?: number; apagado?: number }) => (
  <div style={{ width: w, height: w * 1.2, overflow: "hidden", border: "4px solid #7ef0ff", background: "#0a2030", position: "relative" }}>
    <svg width={w} height={w * 1.2} viewBox="0 0 360 430" style={{ opacity: 1 - apagado * 0.8 }}>
      <g transform="translate(180 810) scale(0.92)"><Ator v={v} t={t} expr="sereno" fase={1} /></g>
    </svg>
    {apagado > 0 && <div style={{ position: "absolute", inset: 0, background: `rgba(255,58,42,${apagado * 0.45})` }} />}
  </div>
);

const Arquivo = ({ t, p }: { t: number; p: number }) => (
  <Painel>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 36, letterSpacing: 4, color: "#7ef0ff" }}><span>ARQUIVO CONFIDENCIAL</span><span>PROJETO LABIRINTO</span></div>
    <div style={{ display: "flex", gap: 36, marginTop: 26 }}>
      <Retrato v={CAIO} t={t} w={300} />
      <div style={{ fontSize: 50, lineHeight: 1.45 }}>
        <div>NOME: <span style={{ color: "#ffd166" }}>CAIO</span></div>
        <div style={{ opacity: p > 0.35 ? 1 : 0.15 }}>FUNÇÃO:</div>
        <div style={{ color: "#ff8a5f", fontSize: 62, opacity: p > 0.35 ? 1 : 0 }}>ARQUITETO</div>
      </div>
    </div>
    <svg width={812} height={300} viewBox="0 0 812 300" style={{ marginTop: 24, background: "#0b2a44" }}>
      {Array.from({ length: 40 }, (_, i) => {
        const x = 30 + (i % 10) * 78, y = 30 + Math.floor(i / 10) * 66, hz = Math.sin(i * 7.3) > 0;
        return <rect key={i} x={x} y={y} width={hz ? 60 : 8} height={hz ? 8 : 52} fill="#9fd4ff" opacity={i / 40 < p * 1.4 ? 0.9 : 0} />;
      })}
      <text x={406} y={280} textAnchor="middle" fontFamily={FONT} fontSize={30} fill="#9fd4ff" letterSpacing={6}>PLANTA ORIGINAL · ASSINADO: CAIO</text>
    </svg>
  </Painel>
);

const Reinicio = ({ t, p }: { t: number; p: number }) => {
  const resta = Math.max(0, 59 - Math.floor(p * 14));
  return (
    <Painel cor="#ff5a4a" top={280}>
      <div style={{ fontSize: 44, letterSpacing: 4, color: "#ff5a4a" }}>PROTOCOLO DE REINICIALIZAÇÃO</div>
      <div style={{ fontSize: 60, marginTop: 14 }}>REINICIAR TESTE · APAGAR MEMÓRIAS</div>
      <div style={{ display: "flex", gap: 14, marginTop: 24 }}>
        {[CAIO, LUNA, PEDRO, NINA].map((v, i) => <Retrato key={i} v={v} t={t} apagado={sobe(p, 0.2 + i * 0.15, 0.4 + i * 0.15)} />)}
      </div>
      <div style={{ fontSize: 110, marginTop: 20, color: "#ffd166", textAlign: "center", opacity: Math.sin(t * 10) > -0.3 ? 1 : 0.5 }}>00:{String(resta).padStart(2, "0")}</div>
    </Painel>
  );
};

const Relogio = ({ texto, cor = "#ff5a4a", top = 240, tam = 190 }: { texto: string; cor?: string; top?: number; tam?: number }) => (
  <AbsoluteFill style={{ alignItems: "center", fontFamily: FONT }}>
    <div style={{ marginTop: top, fontSize: tam, color: cor, letterSpacing: 8, textShadow: `0 8px 0 #14161c, 0 0 60px ${cor}` }}>{texto}</div>
  </AbsoluteFill>
);

const sobre = ({ t, shot }: Contexto) => {
  switch (shot.id) {
    case "aereo": return <Relogio texto="18:00" />;
    case "c_Luna": return <Etiqueta texto="LUNA" />;
    case "c_Pedro": return <Etiqueta texto="PEDRO" />;
    case "c_Nina": return <Etiqueta texto="NINA" />;
    case "dias": return <Relogio texto="DIA 43" cor="#e8e4dc" tam={150} top={250} />;
    case "desenho": return <Relogio texto={`DIA ${41 + Math.min(2, Math.floor(dentro(t, "desenho") * 3))}`} cor="#7ef0ff" tam={150} />;
    case "mapas": return <Mapas t={t} p={dentro(t, "mapas")} />;
    case "relogio": {
      const s = Math.max(0, 120 - Math.floor((t - P.relogio.de) * 3));
      return <Relogio texto={`17:${58 + Math.floor((120 - s) / 60)}:${String((120 - s) % 60).padStart(2, "0")}`} />;
    }
    case "arquivo": return <Arquivo t={t} p={dentro(t, "arquivo")} />;
    case "teste": return <Relogio texto="TESTE 07" cor="#7ef0ff" tam={150} />;
    case "reiniciar": return <Reinicio t={t} p={dentro(t, "reiniciar")} />;
    default: return null;
  }
};

const fx = ({ t }: Contexto) => ({
  impacto: Math.max(decai(t, P.gancho.ate - 0.5, 0.8), decai(t, P.some.ate - 0.6, 0.8), decai(t, T_ABRE, 0.5), decai(t, P.captura.de, 0.6), decai(t, P.reiniciar.de, 0.6)),
  flash: Math.max(decai(t, P.acorda.de, 0.4), decai(t, P.construiu.de, 0.5), decai(t, P.codigo.de + 1.1, 0.4)),
  clarao: Math.max(decai(t, P.mundo.de, 0.3) * 0.6, decai(t, P.apagou.de, 0.4) * 0.8, sobe(t, P.fora.ate - 0.5, P.fora.ate) * (t < P.fora.ate ? 1 : 0), decai(t, P.sol.de, 0.6)),
  claraoCor: "#fff6dc",
});

const S = "labirinto/sfx/";

export const Labirinto = () => (
  <Episodio
    manifesto={manifesto} shots={SHOTS} blocos={BLOCOS} preto={PRETO} elenco={ELENCO} vinheta={0.6}
    cenario={cenario} sobre={sobre} itens={itens} frente={frente} fx={fx}
    corLegenda={() => "#ffffff"}
    final={() => (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", color: "#e8e4dc", fontFamily: FONT, fontSize: 90, letterSpacing: 10 }}>FIM</AbsoluteFill>
    )}
    sons={
      <>
        <Som fps={FPS} em={0} src="ep01/sfx/drone.mp3" volume={0.5} dur={P.dorme.de + 2} some={2} />
        <Som fps={FPS} em={P.dorme.de} src={`${S}musica.mp3`} volume={0.3} dur={manifesto.duracao - P.dorme.de} some={1.6} />
        <Som fps={FPS} em={0.2} src={`${S}paredes.mp3`} volume={0.9} />
        <Som fps={FPS} em={P.aereo.de} src="cidade/sfx/sino.mp3" volume={0.6} />
        <Som fps={FPS} em={P.some.de + 0.4} src={`${S}paredes.mp3`} volume={0.9} dur={P.dorme.de - P.some.de - 0.2} some={0.3} />
        <Som fps={FPS} em={P.some.de + 1.6} src="futuro/sfx/dissolve.mp3" volume={0.6} dur={P.dorme.de - P.some.de - 1.6} some={0.3} />
        <Som fps={FPS} em={P.regra.de + 0.6} src="futuro/sfx/pulso.mp3" volume={0.5} dur={P.percebe.de - P.regra.de - 0.6} some={0.4} />
        <Som fps={FPS} em={P.desenho.de} src={`${S}paredes.mp3`} volume={0.5} dur={P.comida.de - P.desenho.de} some={0.4} />
        <Som fps={FPS} em={P.desenha.de + 0.2} src="trem/sfx/caneta.mp3" volume={0.8} />
        <Som fps={FPS} em={P.desenha.de + 1.3} src="trem/sfx/caneta.mp3" volume={0.8} />
        <Som fps={FPS} em={P.mapas.de + 2.4} src="trem/sfx/brilho.mp3" volume={0.7} />
        <Som fps={FPS} em={P.codigos.de + 0.4} src="futuro/sfx/bipes.mp3" volume={0.5} dur={3} some={0.4} />
        <Som fps={FPS} em={T_ABRE} src="mare02/sfx/porta.mp3" volume={0.9} />
        <Som fps={FPS} em={P.robos.de} src={`${S}robos.mp3`} volume={0.9} />
        <Som fps={FPS} em={P.captura.de + 0.6} src={`${S}robos.mp3`} volume={0.7} dur={P.relogio.de - P.captura.de - 0.6} some={0.4} />
        <Som fps={FPS} em={P.relogio.de} src="futuro/sfx/tique.mp3" volume={0.9} dur={P.sala.de - P.relogio.de} some={0.2} />
        <Som fps={FPS} em={P.sala.de + 0.3} src="tempo/sfx/central.mp3" volume={0.45} dur={P.teste.de - P.sala.de} some={0.6} />
        <Som fps={FPS} em={P.arquivo.de} src="futuro/sfx/bipes.mp3" volume={0.5} dur={2.4} some={0.3} />
        <Som fps={FPS} em={P.construiu.de} src="ep01/sfx/impacto.mp3" volume={0.7} />
        <Som fps={FPS} em={P.mundo.de} src="mare01/sfx/vento.mp3" volume={0.5} dur={P.apagou.de - P.mundo.de} some={0.5} />
        <Som fps={FPS} em={P.apagou.de + 0.4} src="tempo/sfx/apaga.mp3" volume={0.7} dur={P.reiniciar.de - P.apagou.de - 0.4} some={0.3} />
        <Som fps={FPS} em={P.reiniciar.de} src="tempo/sfx/alarmes.mp3" volume={0.45} dur={P.codigo.de + 1.1 - P.reiniciar.de} some={0.3} />
        <Som fps={FPS} em={P.codigo.de + 1.1} src="trem/sfx/brilho.mp3" volume={0.7} />
        <Som fps={FPS} em={P.desliga.de + 0.5} src="cidade/sfx/desliga.mp3" volume={0.9} dur={2} some={0.5} />
        <Som fps={FPS} em={P.portas.de + 0.2} src="mare02/sfx/porta.mp3" volume={0.9} />
        <Som fps={FPS} em={P.sol.de} src="mare01/sfx/aves.mp3" volume={0.5} />
        <Som fps={FPS} em={P.cidade.de} src="tempo/sfx/cidade.mp3" volume={0.35} dur={PRETO - P.cidade.de} some={1.5} />
      </>
    }
  />
);

export const LABIRINTO_DURACAO = Math.round(manifesto.duracao * FPS);
export const LABIRINTO_FPS = FPS;
