import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import manifestoJson from "./manifest.json";
import { FONT } from "../theme";
import type { Visual } from "../serie/Ator";
import {
  Episodio, Som, decai, est as e, sobe, tempos,
  type Bloco, type Contexto, type Manifesto, type Shot,
} from "../serie/motor";
import { cidadao } from "../curtas/futurista";
import {
  Anel, Bosque, Camara, Campo, Cavaleiro, Condado, Covil, Ent, Estrada, Forja, Fortaleza, Gondor, Horda,
  Mordor, Moria, OURO, Pantano, Patio, Planicie, Portos, TorreOrc, Valfenda,
} from "./cenarios";

// Resumão de "O Senhor dos Anéis" (os três livros), só narração, em ritmo de 1,5x.
// Texto próprio; desenho próprio no estilo do projeto, sem copiar o visual dos filmes.

const manifesto = manifestoJson as Manifesto;
const FPS = manifesto.fps;
const PRETO = manifestoJson.preto;
const { fim, pal } = tempos(manifesto);

const H = { pele: "#f1cbb0", calca: "#5a3a22" };
const FRODO: Visual = { ...H, cabelo: "#3a2414", roupa: "#5a7a4a", detalhe: "#f4e3c0", estilo: "cacheado" };
const SAM: Visual = { ...H, cabelo: "#c9a04a", roupa: "#8a6a3a", estilo: "cacheado", mochila: "#5a4630" };
const MERRY: Visual = { ...H, cabelo: "#a8744e", roupa: "#c9b23a", estilo: "baguncado" };
const PIPPIN: Visual = { ...H, cabelo: "#6b4428", roupa: "#3f6f8f", estilo: "baguncado" };
const BILBO: Visual = { ...H, cabelo: "#c9ccd2", roupa: "#7a2f3a", estilo: "grisalho" };
const GANDALF: Visual = { pele: "#e8c4a8", cabelo: "#b9bcc2", roupa: "#7d8088", casaco: true, calca: "#5a5f68", estilo: "longo", barbaCor: "#c9ccd2", chapeu: "#6f737b", sobrancelha: "#9a9da4" };
const BRANCO: Visual = { ...GANDALF, cabelo: "#f4f7f8", roupa: "#f4f7f8", calca: "#dfe6ec", barbaCor: "#ffffff", chapeu: undefined };
const ARAGORN: Visual = { pele: "#d9a888", cabelo: "#2e211b", roupa: "#3a4a3a", casaco: true, calca: "#2a2f2a", estilo: "longo", barbaCor: "#2e211b" };
const LEGOLAS: Visual = { pele: "#f4dcc8", cabelo: "#e9d9a0", roupa: "#6f8a5a", calca: "#4a5a3a", estilo: "longo", sobrancelha: "#b9a060" };
const GIMLI: Visual = { pele: "#e2b08a", cabelo: "#8e99a3", detalhe: "#56636e", roupa: "#6b3a2e", calca: "#3a2a22", estilo: "gorro", barbaCor: "#a8442e" };
const BOROMIR: Visual = { pele: "#e2b08a", cabelo: "#6b4428", roupa: "#7a2f2a", casaco: true, calca: "#3a2a22", estilo: "baguncado", barbaCor: "#6b4428" };
const GOLLUM: Visual = { pele: "#b9c4b8", cabelo: "#b9c4b8", roupa: "#b9c4b8", calca: "#5a4a3a", estilo: "grisalho", sobrancelha: "#8a968a" };
const SARUMAN: Visual = { ...BRANCO, cabelo: "#e8eef2", roupa: "#e8e4dc", sobrancelha: "#3a3340" };
const EOWYN: Visual = { pele: "#f4dcc8", cabelo: "#e9d9a0", roupa: "#8e99a3", calca: "#56636e", estilo: "longo", sobrancelha: "#b9a060" };
const BRUXO: Visual = { pele: "#08080c", cabelo: "#08080c", roupa: "#08080c", casaco: true, calca: "#08080c", estilo: "curto", sobrancelha: "#08080c" };
const ELENCO: Record<string, Visual> = {
  Frodo: FRODO, Sam: SAM, Merry: MERRY, Pippin: PIPPIN, Bilbo: BILBO, Gandalf: GANDALF, Branco: BRANCO, Aragorn: ARAGORN,
  Legolas: LEGOLAS, Gimli: GIMLI, Boromir: BOROMIR, Gollum: GOLLUM, Saruman: SARUMAN, Eowyn: EOWYN, Bruxo: BRUXO,
};
const HB = 0.44, HM = 0.62, AN = 0.48; // escalas: hobbit, homem, anão

const BLOCOS: Record<string, Bloco> = {
  bilbo: { Bilbo: e(540, 1830, 0.6, "desconfiado", [0, 0.8]) },
  heranca: { Bilbo: e(360, 1830, 0.58, "triste", [1, 0.2], "apontarDir"), Frodo: e(700, 1830, 0.56, "surpreso", [-1, 0.4]) },
  gandalf: { Gandalf: e(540, 1820, 0.74, "medo", [0, 0.9]) },
  fuga: { Frodo: e(360, 1830, HB, "medo", [1, 0]), Sam: e(240, 1850, HB, "medo", [1, 0]), Merry: e(120, 1830, HB, "panico", [1, 0]), Pippin: e(0, 1850, HB, "panico", [1, 0]) },
  conselho: { Gandalf: e(150, 1800, 0.5, "firme", [1, 0.3]), Frodo: e(330, 1840, 0.4, "medo", [1, 0.4]), Aragorn: e(880, 1800, 0.5, "firme", [-1, 0.3]) },
  nove: {
    Frodo: e(70, 1820, 0.3, "firme", [1, 0]), Sam: e(170, 1830, 0.3, "firme", [1, 0]), Merry: e(270, 1820, 0.3, "feliz", [1, 0]), Pippin: e(370, 1830, 0.3, "feliz", [1, 0]),
    Gandalf: e(490, 1820, 0.44, "firme", [1, 0]), Legolas: e(620, 1820, 0.42, "sereno", [1, 0]), Gimli: e(730, 1830, 0.33, "bravo", [1, 0]),
    Aragorn: e(850, 1820, 0.42, "firme", [1, 0]), Boromir: e(980, 1820, 0.42, "firme", [1, 0]),
  },
  ponte: { Gandalf: e(480, 1500, 0.5, "bravo", [1, -0.3], "apontarDir") },
  cobica: { Frodo: e(380, 1620, HB, "medo", [1, -0.4], "recuar"), Boromir: e(680, 1620, HM, "bravo", [-1, 0.4], "alcancar") },
  defesa: { Boromir: e(540, 1620, HM, "bravo", [1, 0], "empurrar"), Merry: e(260, 1640, HB, "panico", [1, 0]), Pippin: e(160, 1650, HB, "panico", [1, 0]) },
  dupla: { Frodo: e(480, 1640, HB, "triste", [1, -0.3]), Sam: e(620, 1640, HB, "firme", [1, -0.3]) },
  cacada: { Aragorn: e(300, 1820, 0.5, "firme", [1, 0]), Legolas: e(500, 1830, 0.5, "firme", [1, 0]), Gimli: e(680, 1850, 0.4, "bravo", [1, 0]) },
  branco: { Branco: e(540, 1600, 0.74, "sereno", [0, 0]), Aragorn: e(140, 1640, 0.5, "surpreso", [1, -0.4], "recuar"), Gimli: e(940, 1650, 0.4, "surpreso", [-1, -0.5], "recuar") },
  saruman: { Saruman: e(540, 1820, 0.74, "bravo", [0, 0.6], "apontarCima") },
  pantano: { Frodo: e(420, 1820, HB + 0.1, "desconfiado", [1, 0]), Sam: e(260, 1830, HB + 0.1, "bravo", [1, 0]), Gollum: e(760, 1840, 0.44, "medo", [-1, -0.2], "recuar") },
  gollum: { Gollum: e(540, 1820, 0.7, "feliz", [0, 0.9], "abracar") },
  covil: { Frodo: e(420, 1830, HB, "panico", [0.6, -1], "recuar"), Sam: e(260, 1840, HB, "panico", [0.6, -1], "recuar") },
  sam: { Sam: e(540, 1830, 0.66, "triste", [0, 0.8]) },
  torre: { Sam: e(140, 1850, 0.5, "bravo", [1, -0.5], "apontarDir") },
  eowyn: { Eowyn: e(340, 1820, 0.62, "bravo", [1, -0.3], "apontarDir"), Bruxo: e(740, 1820, 0.8, "bravo", [-1, 0.3]) },
  mortos: { Aragorn: e(540, 1840, 0.6, "firme", [0, 0], "apontarCima") },
  espada: { Aragorn: e(420, 1820, 0.7, "firme", [0.4, 0.5]), Branco: e(720, 1820, 0.66, "sereno", [-1, 0]) },
  subida: { Sam: e(430, 1860, HB, "bravo", [1, -0.6]), Frodo: e(600, 1850, HB, "triste", [1, -0.6]) },
  beira: { Sam: e(180, 1800, 0.5, "medo", [1, 0]), Frodo: e(520, 1800, 0.52, "triste", [1, 0.5], "apontarDir") },
  luta: { Sam: e(140, 1800, 0.5, "panico", [1, 0]), Gollum: e(560, 1800, 0.52, "feliz", [0, -0.9], "apontarCima") },
  rei: { Aragorn: e(540, 1700, 0.72, "sereno", [0, 0]) },
  quatro: { Frodo: e(360, 1820, 0.46, "surpreso", [0, -0.4]), Sam: e(480, 1830, 0.46, "surpreso", [0, -0.4]), Merry: e(600, 1820, 0.46, "feliz", [0, -0.4]), Pippin: e(720, 1830, 0.46, "feliz", [0, -0.4]) },
  frodo: { Frodo: e(540, 1830, 0.7, "triste", [0.3, 0.6]) },
  cais: { Sam: e(160, 1790, 0.5, "triste", [1, -0.2]) },
  porta: { Sam: e(300, 1850, 0.62, "feliz", [0.8, 0]) },
};
const R = (b: string, n: string): [number, number] => [BLOCOS[b][n].x, BLOCOS[b][n].y - 690 * BLOCOS[b][n].s];
const perto = (b: string, n: string, z0: number, z1: number, dy = 0): Shot["cam"] => { const [x, y] = R(b, n); return [[x, y + dy, z0], [x, y + dy, z1]]; };

const T_QUEDA = pal("01", "derrotado") - 0.1;
const T_ANOS = pal("01", "três") - 0.3;
const T_NOVE = pal("03", "nove") - 0.1;
const T_BRECHA = pal("06", "cai") - 0.3;
const T_DESTROI = pal("11", "destruído") - 0.4;
const T_DESABA = pal("11", "torre") - 0.3;

const SHOTS: Shot[] = [
  // 01 | o Anel
  { id: "forja", de: 0, ate: pal("01", "seu") - 0.1, fundo: "forja", luz: "normal", tremor: 2, cam: [[540, 1000, 2.2], [540, 1000, 1.3]] },
  { id: "senhor", de: pal("01", "seu") - 0.1, ate: pal("01", "mas") - 0.1, fundo: "senhor", luz: "normal", tremor: 3, cam: [[600, 1100, 1.6], [560, 1250, 1.1]] },
  { id: "sobreviveu", de: pal("01", "mas") - 0.1, ate: T_ANOS, fundo: "rio", luz: "noite", cam: [[540, 1600, 2.4], [540, 1600, 3.0]] },
  { id: "bilbo", de: T_ANOS, ate: fim("01") + 0.15, fundo: "condado", bloco: "bilbo", luz: "dia", cam: [[540, 1200, 1.0], [540, 1500, 2.0]] },
  // 02 | a fuga
  { id: "heranca", de: fim("01") + 0.15, ate: pal("02", "mago") - 0.2, fundo: "condado", bloco: "heranca", luz: "dia", cam: [[530, 1560, 1.9], [530, 1560, 2.2]] },
  { id: "gandalf", de: pal("02", "mago") - 0.2, ate: pal("02", "sauron") - 0.1, fundo: "condadoNoite", bloco: "gandalf", luz: "abajur", cam: perto("gandalf", "Gandalf", 1.7, 2.3, 120) },
  { id: "voltou", de: pal("02", "sauron") - 0.1, ate: pal("02", "foge") - 0.9, fundo: "mordorLonge", luz: "normal", tremor: 3, cam: [[700, 700, 1.3], [800, 480, 2.2]] },
  { id: "foge", de: pal("02", "foge") - 0.9, ate: pal("02", "perseguido") - 0.1, fundo: "condadoNoite", bloco: "fuga", luz: "noite", tremor: 4, cam: [[400, 1650, 1.7], [700, 1650, 1.7]],
    at: { Frodo: { xPara: 980 }, Sam: { xPara: 860 }, Merry: { xPara: 740 }, Pippin: { xPara: 620 } } },
  { id: "cavaleiros", de: pal("02", "perseguido") - 0.1, ate: fim("02") + 0.15, fundo: "estrada", luz: "noite", tremor: 5, cam: [[540, 1500, 1.5], [540, 1600, 1.2]] },
  // 03 | o conselho e os nove
  { id: "valfenda", de: fim("02") + 0.15, ate: pal("03", "anel") - 0.1, fundo: "valfenda", bloco: "conselho", luz: "dia", cam: [[540, 1000, 1.0], [540, 1300, 1.3]] },
  { id: "mesa", de: pal("03", "anel") - 0.1, ate: pal("03", "montanha") - 0.3, fundo: "valfenda", bloco: "conselho", luz: "dia", cam: [[540, 1560, 2.4], [540, 1560, 3.2]] },
  { id: "mapa", de: pal("03", "montanha") - 0.3, ate: T_NOVE, fundo: "valfenda", luz: "dia", cam: [[540, 1300, 1.3], [540, 1300, 1.3]] },
  { id: "nove", de: T_NOVE, ate: fim("03") + 0.15, fundo: "planicie", bloco: "nove", luz: "dia", cam: [[220, 1640, 2.0], [900, 1640, 2.0]] },
  // 04 | Moria e a quebra
  { id: "moria", de: fim("03") + 0.15, ate: pal("04", "demônio") - 0.2, fundo: "moria", bloco: "ponte", luz: "noite", cam: [[540, 1100, 1.0], [520, 1300, 1.5]], at: { Gandalf: { x: 100, xPara: 480, pose: "parado" } } },
  { id: "balrog", de: pal("04", "demônio") - 0.2, ate: pal("04", "cai") - 0.05, fundo: "moriaFogo", bloco: "ponte", luz: "noite", tremor: 6, cam: [[640, 1250, 1.3], [700, 1150, 1.5]] },
  { id: "queda", de: pal("04", "cai") - 0.05, ate: pal("04", "pouco") - 0.05, fundo: "moriaQuebra", bloco: "ponte", luz: "noite", tremor: 8, cam: [[620, 1400, 1.5], [640, 1750, 1.5]],
    at: { Gandalf: { x: 620, yPara: 2400, expr: "panico", pose: "alcancar" } } },
  { id: "cobica", de: pal("04", "pouco") - 0.05, ate: pal("04", "morre") - 0.05, fundo: "rio", bloco: "cobica", luz: "dia", cam: [[530, 1350, 1.7], [520, 1320, 2.1]], at: { Boromir: { x: 860, xPara: 680 } } },
  { id: "defesa", de: pal("04", "morre") - 0.05, ate: pal("04", "sociedade") - 0.3, fundo: "rioOrcs", bloco: "defesa", luz: "dia", tremor: 5, cam: [[560, 1350, 1.4], [540, 1280, 2.0]] },
  { id: "parte", de: pal("04", "sociedade") - 0.3, ate: pal("04", "frodo") - 0.1, fundo: "rio", luz: "dia", cam: [[540, 1300, 1.2], [540, 1300, 1.2]] },
  { id: "dupla", de: pal("04", "frodo") - 0.1, ate: fim("04") + 0.15, fundo: "rumo", bloco: "dupla", luz: "normal", cam: [[540, 1450, 1.9], [620, 1100, 1.2]], at: { Frodo: { xPara: 640 }, Sam: { xPara: 780 } } },
  // 05 | ents e o mago branco
  { id: "levados", de: fim("04") + 0.15, ate: pal("05", "escapam") - 0.1, fundo: "planicieOrcs", luz: "dia", tremor: 5, cam: [[400, 1600, 1.5], [640, 1600, 1.5]] },
  { id: "ents", de: pal("05", "escapam") - 0.1, ate: pal("05", "aragorn") - 0.1, fundo: "fangorn", luz: "normal", tremor: 2, cam: [[540, 1500, 1.5], [540, 1050, 1.1]] },
  { id: "cacada", de: pal("05", "aragorn") - 0.1, ate: pal("05", "reencontram") - 0.2, fundo: "planicieCorre", bloco: "cacada", luz: "dia", tremor: 4, cam: [[440, 1600, 1.6], [560, 1600, 1.7]],
    at: { Aragorn: { x: 120, xPara: 420 }, Legolas: { x: 320, xPara: 620 }, Gimli: { x: 500, xPara: 760 } } },
  { id: "branco", de: pal("05", "reencontram") - 0.2, ate: fim("05") + 0.15, fundo: "clareira", bloco: "branco", luz: "dia", cam: [[540, 1300, 1.2], [540, 1120, 2.0]] },
  // 06 | Helm e Isengard
  { id: "saruman", de: fim("05") + 0.15, ate: pal("06", "dez") - 0.1, fundo: "isengard", bloco: "saruman", luz: "normal", cam: perto("saruman", "Saruman", 2.0, 1.4, 60) },
  { id: "helm", de: pal("06", "dez") - 0.1, ate: T_BRECHA, fundo: "helm", luz: "noite", tremor: 4, cam: [[540, 1300, 1.0], [540, 1500, 1.4]] },
  { id: "brecha", de: T_BRECHA, ate: pal("06", "mas") - 0.1, fundo: "helmBrecha", luz: "noite", tremor: 10, cam: [[530, 1400, 1.6], [530, 1420, 1.9]] },
  { id: "aurora", de: pal("06", "mas") - 0.1, ate: pal("06", "ents") - 0.5, fundo: "helmAurora", luz: "dia", tremor: 5, cam: [[800, 900, 1.6], [560, 1300, 1.1]] },
  { id: "inundam", de: pal("06", "ents") - 0.5, ate: fim("06") + 0.15, fundo: "isengardAgua", luz: "normal", tremor: 4, cam: [[540, 1400, 1.2], [540, 1200, 1.0]] },
  // 07 | Gollum
  { id: "guia", de: fim("06") + 0.15, ate: pal("07", "gollum") - 0.1, fundo: "pantano", bloco: "pantano", luz: "normal", cam: [[420, 1500, 1.5], [620, 1520, 1.7]] },
  { id: "gollum", de: pal("07", "gollum") - 0.1, ate: pal("07", "ele") - 0.1, fundo: "pantano", bloco: "gollum", luz: "normal", cam: perto("gollum", "Gollum", 1.8, 3.0, 40) },
  { id: "promete", de: pal("07", "ele") - 0.1, ate: pal("07", "leva") - 0.2, fundo: "pantano", bloco: "pantano", luz: "normal", cam: [[600, 1500, 1.7], [640, 1500, 1.8]],
    at: { Gollum: { pose: "apontarDir", expr: "feliz", olhar: [-1, 0] } } },
  { id: "aranha", de: pal("07", "leva") - 0.2, ate: fim("07") + 0.15, fundo: "covil", bloco: "covil", luz: "noite", tremor: 5, cam: [[480, 1500, 1.5], [560, 1100, 1.1]] },
  // 08 | Sam
  { id: "picado", de: fim("07") + 0.15, ate: pal("08", "sam") - 0.1, fundo: "covilOrcs", luz: "noite", tremor: 3, cam: [[400, 1600, 1.7], [640, 1600, 1.7]] },
  { id: "pega", de: pal("08", "sam") - 0.1, ate: pal("08", "sozinho") - 0.1, fundo: "covilFim", bloco: "sam", luz: "noite", cam: perto("sam", "Sam", 2.0, 2.6, 80), at: { Sam: { lagrima: true } } },
  { id: "invade", de: pal("08", "sozinho") - 0.1, ate: fim("08") + 0.15, fundo: "torre", bloco: "torre", luz: "normal", tremor: 5, cam: [[300, 1600, 1.6], [620, 1250, 1.2]],
    at: { Sam: { xPara: 520, yPara: 1610 } } },
  // 09 | Gondor
  { id: "gondor", de: fim("08") + 0.15, ate: pal("09", "quando") - 0.1, fundo: "gondor", luz: "normal", tremor: 4, cam: [[540, 800, 1.0], [540, 1100, 1.4]] },
  { id: "rohan", de: pal("09", "quando") - 0.1, ate: pal("09", "éowyn") - 0.1, fundo: "carga", luz: "dia", tremor: 8, cam: [[400, 1500, 1.4], [640, 1500, 1.2]] },
  { id: "eowyn", de: pal("09", "éowyn") - 0.1, ate: pal("09", "derruba") - 0.1, fundo: "campo", bloco: "eowyn", luz: "normal", cam: perto("eowyn", "Eowyn", 2.6, 2.0, 60) },
  { id: "bruxo", de: pal("09", "derruba") - 0.1, ate: pal("09", "aragorn") - 0.3, fundo: "campo", bloco: "eowyn", luz: "normal", tremor: 7, cam: [[560, 1400, 1.5], [640, 1350, 1.8]],
    at: { Eowyn: { xPara: 520 }, Bruxo: { expr: "panico", pose: "recuar", dissolve: 0, dissolvePara: 1 } } },
  { id: "mortos", de: pal("09", "aragorn") - 0.3, ate: fim("09") + 0.2, fundo: "campoMortos", bloco: "mortos", luz: "ciano", tremor: 4, cam: [[540, 1500, 1.7], [540, 1350, 1.1]] },
  // 10 | o Portão Negro
  { id: "espada", de: fim("09") + 0.2, ate: pal("10", "aragorn") - 0.1, fundo: "gondorPaz", bloco: "espada", luz: "normal", cam: perto("espada", "Aragorn", 2.2, 2.6, 60) },
  { id: "portao", de: pal("10", "aragorn") - 0.1, ate: pal("10", "olho") - 0.3, fundo: "portao", luz: "normal", tremor: 3, cam: [[540, 1600, 1.6], [540, 1300, 1.0]] },
  { id: "olho", de: pal("10", "olho") - 0.3, ate: pal("10", "dar") - 0.15, fundo: "portaoOlho", luz: "normal", cam: [[800, 500, 2.2], [800, 480, 2.8]] },
  { id: "chance", de: pal("10", "dar") - 0.15, ate: fim("10") + 0.25, fundo: "encosta", bloco: "subida", luz: "normal", tremor: 3, cam: [[520, 1600, 1.9], [400, 1300, 1.3]],
    at: { Sam: { x: 330, xPara: 430, y: 1900, yPara: 1860 }, Frodo: { x: 500, xPara: 600, y: 1900, yPara: 1850 } } },
  // 11 | o fogo
  { id: "beira", de: fim("10") + 0.25, ate: pal("11", "ele") - 0.1, fundo: "camara", bloco: "beira", luz: "normal", tremor: 3, cam: [[420, 1500, 1.4], [560, 1480, 2.0]] },
  { id: "toma", de: pal("11", "ele") - 0.1, ate: pal("11", "gollum") - 0.1, fundo: "camara", bloco: "beira", luz: "normal", tremor: 3, cam: perto("beira", "Frodo", 2.4, 2.8, 60),
    at: { Frodo: { expr: "bravo", pose: "parado", olhar: [0, 0], dissolve: 0, dissolvePara: 0.9 }, Sam: { expr: "panico" } } },
  { id: "ataca", de: pal("11", "gollum") - 0.1, ate: pal("11", "cai") - 0.2, fundo: "camara", bloco: "luta", luz: "normal", tremor: 9, cam: [[460, 1500, 1.6], [560, 1420, 2.2]], at: { Gollum: { x: 900, xPara: 560 } } },
  { id: "lava", de: pal("11", "cai") - 0.2, ate: T_DESTROI, fundo: "camara", bloco: "luta", luz: "normal", cam: [[720, 1500, 1.6], [820, 1700, 1.9]],
    at: { Gollum: { x: 700, xPara: 860, y: 1800, yPara: 2250, expr: "feliz", fechado: true }, Sam: { expr: "congelado" } } },
  { id: "destruido", de: T_DESTROI, ate: T_DESABA, fundo: "camaraOnda", luz: "normal", tremor: 10, cam: [[860, 1560, 2.4], [760, 1500, 1.3]] },
  { id: "desaba", de: T_DESABA, ate: fim("11") + 0.6, fundo: "mordorCai", luz: "normal", tremor: 10, cam: [[800, 700, 1.5], [660, 950, 1.1]] },
  // 12 | a volta
  { id: "coroado", de: fim("11") + 0.6, ate: pal("12", "curva") - 0.6, fundo: "coroa", bloco: "rei", luz: "dia", cam: [[540, 1100, 1.2], [540, 1200, 1.9]] },
  { id: "curva", de: pal("12", "curva") - 0.6, ate: pal("12", "eles") - 0.1, fundo: "coroaCurva", bloco: "quatro", luz: "dia", cam: [[540, 1500, 1.2], [540, 1560, 1.8]] },
  { id: "casa", de: pal("12", "eles") - 0.1, ate: pal("12", "mas") - 0.1, fundo: "condado", bloco: "quatro", luz: "dia", cam: [[540, 1300, 1.1], [540, 1500, 1.5]],
    at: { Frodo: { x: -260, xPara: 360, expr: "sereno" }, Sam: { x: -140, xPara: 480, expr: "feliz" }, Merry: { x: -20, xPara: 600 }, Pippin: { x: 100, xPara: 720 } } },
  { id: "curou", de: pal("12", "mas") - 0.1, ate: pal("12", "anos") - 0.1, fundo: "condado", bloco: "frodo", luz: "normal", cam: perto("frodo", "Frodo", 2.2, 2.8) },
  { id: "navio", de: pal("12", "anos") - 0.1, ate: pal("12", "sam") - 0.3, fundo: "portos", bloco: "cais", luz: "dourada", cam: [[420, 1400, 1.4], [600, 1250, 1.1]], at: { Sam: { lagrima: true } } },
  { id: "volta", de: pal("12", "sam") - 0.3, ate: pal("12", "bem") - 0.1, fundo: "porta", bloco: "porta", luz: "dourada", cam: [[540, 1300, 1.1], [480, 1500, 1.5]], at: { Sam: { x: -200, xPara: 300, expr: "sereno" } } },
  { id: "deVolta", de: pal("12", "bem") - 0.1, ate: PRETO, fundo: "porta", bloco: "porta", luz: "dourada", cam: perto("porta", "Sam", 2.4, 1.7, 40) },
];

const P = Object.fromEntries(SHOTS.map((s) => [s.id, s]));
const dentro = (t: number, id: string) => sobe(t, P[id].de, P[id].ate);
const POVO = Array.from({ length: 10 }, (_, i) => cidadao(i + 1, ["#3d6fa3", "#8e99a3", "#7a2f3a", "#5c9a4f"]));

const Fantasmas = ({ t }: { t: number }) => (
  <g opacity={0.75}>
    {Array.from({ length: 14 }, (_, i) => (
      <g key={i} transform={`translate(${40 + (i % 7) * 160 + Math.sin(t * 2 + i) * 20} ${1500 + Math.floor(i / 7) * 150}) scale(0.5)`}>
        <path d="M-50 0 Q-70 -200 0 -300 Q70 -200 50 0 L30 -30 L10 0 L-10 -30 L-30 0Z" fill="#8fffc0" opacity={0.6} /><circle cx={-16} cy={-220} r={9} fill="#0a2a1a" /><circle cx={16} cy={-220} r={9} fill="#0a2a1a" />
        <line x1={50} y1={-60} x2={66} y2={-330} stroke="#8fffc0" strokeWidth={8} />
      </g>
    ))}
  </g>
);

const cenario = ({ t, shot }: Contexto) => {
  switch (shot.fundo) {
    case "forja": return <Forja t={t} />;
    case "senhor": return <Forja t={t} fase="senhor" queda={sobe(t, T_QUEDA, P.senhor.ate)} />;
    case "rio": return shot.id === "sobreviveu" ? <Forja t={t} fase="rio" /> : <Bosque t={t} tipo="rio" />;
    case "condado": return <Condado t={t} />;
    case "condadoNoite": return <Condado t={t} noite={1} />;
    case "porta": return <Condado t={t} perto />;
    case "mordorLonge": return <Mordor t={t} portao={false} />;
    case "estrada": return <Estrada t={t} />;
    case "valfenda": return <Valfenda t={t} />;
    case "planicie": return <Planicie t={t} rola={dentro(t, "nove") * 300} />;
    case "planicieCorre": return <Planicie t={t} rola={dentro(t, "cacada") * 900} />;
    case "planicieOrcs": return (
      <Planicie t={t} rola={dentro(t, "levados") * 900} extra={
        <g><Horda t={t} n={8} x0={260} y0={1760} corre s={0.8} dx={90} />
          {[MERRY, PIPPIN].map((_, i) => <g key={i} transform={`translate(${470 + i * 180} ${1560 + Math.abs(Math.sin(t * 14 + i)) * -10}) rotate(90)`}><rect x={-30} y={-90} width={60} height={150} rx={26} fill={i ? "#3f6f8f" : "#c9b23a"} /><circle cy={-110} r={34} fill="#f1cbb0" /></g>)}
        </g>} />
    );
    case "moria": return <Moria t={t} />;
    case "moriaFogo": return <Moria t={t} balrog={dentro(t, "balrog")} />;
    case "moriaQuebra": return <Moria t={t} balrog={1} quebra={dentro(t, "queda")} />;
    case "rioOrcs": return <Bosque t={t} tipo="rio" extra={<Horda t={t} n={6} x0={720} y0={1640} corre s={0.8} dx={70} />} />;
    case "rumo": return <Mordor t={t} portao={false} />;
    case "fangorn": return (
      <Bosque t={t} tipo="fangorn" extra={
        <g transform={`translate(${380 + dentro(t, "ents") * 240} 1640)`}>
          <Ent t={t} />
          {[MERRY, PIPPIN].map((_, i) => <g key={i} transform={`translate(${-60 + i * 120} -800)`}><rect x={-22} y={-60} width={44} height={70} rx={18} fill={i ? "#3f6f8f" : "#c9b23a"} /><circle cy={-84} r={30} fill="#f1cbb0" /><circle cx={-9} cy={-88} r={5} fill="#14161c" /><circle cx={9} cy={-88} r={5} fill="#14161c" /></g>)}
        </g>} />
    );
    case "clareira": return <Bosque t={t} tipo="clareira" luz={sobe(t, P.branco.de + 0.2, P.branco.de + 0.9)} />;
    case "isengard": return <Fortaleza t={t} tipo="isengard" />;
    case "isengardAgua": return (
      <g><Fortaleza t={t} tipo="isengard" enchente={dentro(t, "inundam")} />
        {[160, 900].map((x, i) => <g key={x} transform={`translate(${x} 1700) scale(0.7)`}><Ent t={t} fase={i * 2} /></g>)}</g>
    );
    case "helm": return <g><Fortaleza t={t} tipo="helm" /><Horda t={t} n={32} x0={180} y0={1680} corre s={0.5} dx={90} /></g>;
    case "helmBrecha": return <g><Fortaleza t={t} tipo="helm" brecha={dentro(t, "brecha")} /><Horda t={t} n={24} x0={220} y0={1700} corre s={0.5} dx={80} /></g>;
    case "helmAurora": return (
      <g><Fortaleza t={t} tipo="helm" aurora={1} brecha={1} />
        {Array.from({ length: 6 }, (_, i) => { const v = dentro(t, "aurora"); return <g key={i} transform={`translate(${1150 - v * (500 + i * 70)} ${900 + v * (640 + i * 20) + i * 30}) scale(${-(0.35 + v * 0.3)} ${0.35 + v * 0.3})`}><Cavaleiro t={t} cor={i === 0 ? "#f4f7f8" : "#3a2a22"} fase={i} capa={i === 0} /></g>; })}
      </g>
    );
    case "pantano": return <Pantano t={t} />;
    case "covil": return <Covil t={t} aranha={dentro(t, "aranha")} />;
    case "covilOrcs": return (
      <g><Covil t={t} /><Horda t={t} n={4} x0={300} y0={1800} corre s={0.9} dx={150} />
        <g transform={`translate(${520 + Math.sin(t * 14) * 6} 1520) rotate(90)`}><rect x={-50} y={-170} width={100} height={300} rx={46} fill="#e8eef2" stroke="#cfd6e0" strokeWidth={5} /><path d="M-50 -100 L50 -60 M-50 -20 L50 20 M-50 60 L50 100" stroke="#b9c2cc" strokeWidth={5} /></g></g>
    );
    case "covilFim": return <Covil t={t} />;
    case "torre": return <g><TorreOrc t={t} /><g transform={`translate(${700 + dentro(t, "invade") * 500} 0)`}><Horda t={t} n={3} x0={0} y0={1500} corre s={0.7} dx={110} /></g></g>;
    case "gondor": return <g><Gondor t={t} cerco={1} /><Horda t={t} n={24} x0={120} y0={1640} s={0.5} dx={110} /></g>;
    case "gondorPaz": return <Gondor t={t} />;
    case "carga": return (
      <Campo t={t} extra={<g>
        {Array.from({ length: 7 }, (_, i) => <g key={i} transform={`translate(${-300 + dentro(t, "rohan") * 900 + i * 150} ${1560 + (i % 3) * 110}) scale(${0.7 + (i % 3) * 0.12})`}><Cavaleiro t={t} cor={["#5a3a22", "#3a2a22", "#8a6a4a"][i % 3]} fase={i * 1.3} capa={false} /></g>)}
        <g transform={`translate(${900 + dentro(t, "rohan") * 400} 0)`}><Horda t={t} n={8} x0={0} y0={1620} corre s={0.6} dx={60} /></g>
      </g>} />
    );
    case "campo": return <Campo t={t} />;
    case "campoMortos": return <Campo t={t} extra={<Fantasmas t={t} />} />;
    case "portao": return <g><Mordor t={t} />{Array.from({ length: 5 }, (_, i) => <g key={i} transform={`translate(${260 + i * 140} ${1880 + (i % 2) * 30}) scale(0.34)`}><Cavaleiro t={t} cor={i === 2 ? "#f4f7f8" : "#3a2a22"} fase={i} capa={false} /></g>)}</g>;
    case "portaoOlho": return <Mordor t={t} olhar={1 - 2 * dentro(t, "olho")} />;
    case "encosta": return (
      <g><Mordor t={t} portao={false} olhar={1} />
        <path d="M-200 2120 L-200 1700 L1280 1200 L1280 2120Z" fill="#1a0c0c" /><path d="M-200 1700 L1280 1200 L1280 1240 L-200 1750Z" fill="#3a1a14" /></g>
    );
    case "camara": return <Camara t={t} />;
    case "camaraOnda": return <Camara t={t} onda={dentro(t, "destruido")} />;
    case "mordorCai": return <Mordor t={t} portao={false} cai={dentro(t, "desaba")} vulcao={1} />;
    case "coroa": return <Patio t={t} povo={POVO} />;
    case "coroaCurva": return <Patio t={t} povo={POVO} rei={ARAGORN} curva={sobe(t, P.curva.de + 0.2, P.curva.de + 1)} />;
    case "portos": return <Portos t={t} parte={dentro(t, "navio")} v={[FRODO, GANDALF]} />;
    default: return <Condado t={t} />;
  }
};

const itens = ({ t, shot }: Contexto) => {
  const item = (el: ReactNode, y = 2000) => [{ y, el }];
  const anel = (x: number, y: number, s = 0.4, fogo = 0) => item(<g key="a" transform={`translate(${x} ${y})`}><Anel t={t} s={s} fogo={fogo} /></g>);
  switch (shot.id) {
    case "forja": return anel(540, 1000, 1.5, sobe(t, 0.3, 1.4));
    case "sobreviveu": return anel(540, 1620, 0.6);
    case "bilbo": return anel(R("bilbo", "Bilbo")[0], R("bilbo", "Bilbo")[1] + 250, 0.34);
    case "heranca": return anel(360 + 180 + dentro(t, "heranca") * 60, 1830 - 0.58 * 540, 0.3);
    case "gandalf": return anel(540, R("gandalf", "Gandalf")[1] + 300, 0.5, 1);
    case "mesa": return anel(540, 1560, 0.5, 0.4);
    case "cobica": return anel(BLOCOS.cobica.Frodo.x + 20, BLOCOS.cobica.Frodo.y - HB * 470, 0.22);
    case "gollum": return anel(540, R("gollum", "Gollum")[1] + 250 + Math.sin(t * 3) * 10, 0.5, 0.3);
    case "pega": return anel(540, R("sam", "Sam")[1] + 290, 0.36);
    case "beira": return anel(BLOCOS.beira.Frodo.x + 0.52 * 300, BLOCOS.beira.Frodo.y - 0.52 * 556, 0.26, 1);
    case "toma": return anel(R("beira", "Frodo")[0], R("beira", "Frodo")[1] + 190, 0.34, 1);
    case "ataca": return anel(560 + 0.52 * 6, 1800 - 0.52 * 880, 0.3, 1);
    case "lava": { const p = dentro(t, "lava"); return anel(700 + p * 160, 1800 - 0.52 * 880 + p * 450, 0.3, 1); }
    case "destruido": { const p = dentro(t, "destruido"); return p < 0.5 ? anel(860, 1560, 0.5 * (1 - p * 2), 1) : []; }
    case "coroado": return item(
      <g key="c" transform={`translate(540 ${R("rei", "Aragorn")[1] - 130 - (1 - sobe(t, P.coroado.de, P.coroado.de + 0.9)) * 300})`}>
        <path d="M-70 0 L-80 -70 L-40 -30 L0 -90 L40 -30 L80 -70 L70 0Z" fill="#e8eef2" stroke="#8e99a3" strokeWidth={6} /><circle cy={-30} r={9} fill="#5cc8ff" />
      </g>,
    );
    case "eowyn": case "bruxo": return item(
      <g key="e">
        <line x1={BLOCOS.eowyn.Eowyn.x + 150 + (shot.id === "bruxo" ? dentro(t, "bruxo") * 180 : 0)} y1={1820 - 0.62 * 540} x2={BLOCOS.eowyn.Eowyn.x + 300 + (shot.id === "bruxo" ? dentro(t, "bruxo") * 180 : 0)} y2={1820 - 0.62 * 620} stroke="#e8eef2" strokeWidth={12} strokeLinecap="round" />
        <path d="M-60 0 L-70 -60 L-34 -26 L0 -80 L34 -26 L70 -60 L60 0Z" transform={`translate(740 ${1820 - 0.8 * 800})`} fill="#3a3340" opacity={shot.id === "bruxo" ? 1 - dentro(t, "bruxo") : 1} />
      </g>,
    );
    case "espada": return item(<line key="s" x1={R("espada", "Aragorn")[0] + 150} y1={R("espada", "Aragorn")[1] + 330} x2={R("espada", "Aragorn")[0] + 190} y2={R("espada", "Aragorn")[1] - 160} stroke="#e8eef2" strokeWidth={14} strokeLinecap="round" />);
    default: return [];
  }
};

// ---------- sobreposições ----------
const Faixa = ({ texto, cor = "#f1e2bc", tam = 110, sub, top = 230 }: { texto: string; cor?: string; tam?: number; sub?: string; top?: number }) => (
  <AbsoluteFill style={{ alignItems: "center", fontFamily: FONT }}>
    <div style={{ marginTop: top, fontSize: tam, color: cor, letterSpacing: 6, lineHeight: 1.05, textAlign: "center", textShadow: "0 7px 0 #14161c, 0 0 40px rgba(0,0,0,0.7)" }}>{texto}</div>
    {sub && <div style={{ fontSize: 56, color: "#fff", marginTop: 8, letterSpacing: 4, textShadow: "0 5px 0 #14161c" }}>{sub}</div>}
  </AbsoluteFill>
);
const LOCAIS: [number, number, string][] = [[110, 210, "CONDADO"], [330, 170, "VALFENDA"], [430, 330, "MORIA"], [520, 470, "ROHAN"], [690, 520, "GONDOR"], [770, 350, "MORDOR"]];
const ROTA = "M110 210 Q220 120 330 170 Q420 220 430 330 Q440 430 520 470 Q620 540 690 520 Q760 470 770 350";
const Mapa = ({ t, p, racha = 0 }: { t: number; p: number; racha?: number }) => (
  <AbsoluteFill style={{ alignItems: "center", background: "rgba(10,8,6,0.45)" }}>
    <svg width={920} height={760} viewBox="0 0 920 700" style={{ marginTop: 260 }}>
      <rect width={920} height={700} rx={18} fill="#f1e2bc" stroke="#6b4a2a" strokeWidth={12} />
      <path d="M560 60 L640 200 L600 330 L700 420 L860 300 L880 80Z" fill="#c9b08a" opacity={0.6} />
      <path d="M380 240 l30 -50 l30 50 l30 -60 l30 60" stroke="#8a6a4a" strokeWidth={8} fill="none" />
      <path d={ROTA} stroke="#b3402e" strokeWidth={10} fill="none" strokeDasharray="18 12" pathLength={1000} style={{ strokeDasharray: `${p * 1000} 1000` }} />
      {LOCAIS.map(([x, y, n], i) => (
        <g key={n} opacity={p * 6 >= i ? 1 : 0.25}>
          {i === 5 ? <g><path d={`M${x - 46} ${y + 30} L${x} ${y - 50} L${x + 46} ${y + 30}Z`} fill="#3a1a14" /><circle cx={x} cy={y - 56} r={16 + 5 * Math.sin(t * 8)} fill="#ff5a1a" /></g> : <circle cx={x} cy={y} r={16} fill="#3a2414" />}
          <text x={x} y={y + 76} textAnchor="middle" fontFamily={FONT} fontSize={40} fill="#3a2414">{n}</text>
        </g>
      ))}
      {racha > 0 && (
        <g opacity={racha}>
          <path d="M470 400 Q360 470 300 600" stroke="#3d6fa3" strokeWidth={10} fill="none" strokeDasharray="14 10" /><path d="M470 400 Q560 440 640 430" stroke="#5c9a4f" strokeWidth={10} fill="none" strokeDasharray="14 10" /><path d="M470 400 Q620 330 760 360" stroke={OURO} strokeWidth={12} fill="none" />
          <text x={300} y={650} textAnchor="middle" fontFamily={FONT} fontSize={34} fill="#3d6fa3">MERRY E PIPPIN</text><text x={610} y={480} textAnchor="middle" fontFamily={FONT} fontSize={30} fill="#5c9a4f">OS TRÊS</text><text x={660} y={300} textAnchor="middle" fontFamily={FONT} fontSize={34} fill="#8a6a1a">FRODO E SAM</text>
        </g>
      )}
    </svg>
  </AbsoluteFill>
);

const NOMES: [string, string][] = [["hobbits", "4 HOBBITS"], ["mago", "GANDALF"], ["elfo", "LEGOLAS"], ["anão", "GIMLI"], ["homens", "ARAGORN E BOROMIR"]];
const sobre = ({ t, shot }: Contexto) => {
  switch (shot.id) {
    case "bilbo": return <Faixa texto="3.000 ANOS DEPOIS" tam={96} />;
    case "voltou": return <Faixa texto="SAURON VOLTOU" cor="#ff7a2a" />;
    case "cavaleiros": return <Faixa texto="9 CAVALEIROS NEGROS" tam={84} cor="#cfd6e0" />;
    case "valfenda": return <Faixa texto="VALFENDA" />;
    case "mapa": return <Mapa t={t} p={dentro(t, "mapa")} />;
    case "nove": { const atual = [...NOMES].reverse().find(([w]) => t >= pal("03", w) - 0.2); return <Faixa texto={atual ? atual[1] : "A SOCIEDADE DO ANEL"} tam={atual ? 96 : 84} sub={atual ? undefined : "NOVE COMPANHEIROS"} />; }
    case "moria": return <Faixa texto="MORIA" />;
    case "parte": return <Mapa t={t} p={0.55} racha={sobe(t, P.parte.de, P.parte.de + 0.5)} />;
    case "helm": return <Faixa texto="ABISMO DE HELM" tam={96} sub="10.000 ORCS" />;
    case "saruman": return <Faixa texto="SARUMAN" cor="#e8e4dc" />;
    case "gollum": return <Faixa texto="500 ANOS" cor={OURO} sub="“MEU PRECIOSO”" />;
    case "gondor": return <Faixa texto="GONDOR" />;
    case "portao": return <Faixa texto="PORTÃO NEGRO" tam={96} />;
    case "beira": return <Faixa texto={"MONTANHA\nDA PERDIÇÃO"} tam={84} cor="#ffb347" />;
    default: return null;
  }
};

const fx = ({ t }: Contexto) => ({
  impacto: Math.max(decai(t, T_QUEDA, 0.6), decai(t, P.queda.de, 0.5), decai(t, T_BRECHA + 0.1, 0.8), decai(t, P.bruxo.de + 0.3, 0.5), decai(t, T_DESTROI, 1.0), decai(t, T_DESABA + 0.4, 1.2)),
  flash: Math.max(decai(t, T_QUEDA, 0.4), decai(t, T_BRECHA + 0.1, 0.4), decai(t, P.bruxo.de + 0.3, 0.4), decai(t, T_DESTROI, 0.6)),
  clarao: Math.max(decai(t, P.bilbo.de, 0.3) * 0.6, decai(t, P.branco.de + 0.2, 0.5) * 0.8, decai(t, P.aurora.de, 0.4) * 0.7, decai(t, T_DESTROI, 0.5), decai(t, P.coroado.de, 0.7)),
  claraoCor: "#fff6dc",
});

const M1 = "labirinto/sfx/musica.mp3", M2 = "noite/sfx/musica.mp3";
const T_M2 = P.beira.de;

export const Aneis = () => (
  <Episodio
    manifesto={manifesto} shots={SHOTS} blocos={BLOCOS} preto={PRETO} elenco={ELENCO} vinheta={0.55}
    cenario={cenario} sobre={sobre} itens={itens} fx={fx}
    corLegenda={() => "#ffffff"}
    final={() => (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", color: "#e8e4dc", fontFamily: FONT, fontSize: 90, letterSpacing: 10 }}>FIM</AbsoluteFill>
    )}
    sons={
      <>
        {/* trilha: uma até a beira do fogo; silêncio antes de o Anel ser destruído; outra até o fim */}
        <Som fps={FPS} em={0} src={M1} volume={0.26} dur={T_M2} some={1} />
        <Som fps={FPS} em={T_M2} src={M2} volume={0.28} desde={50} dur={T_DESTROI - 0.7 - T_M2} some={0.4} />
        <Som fps={FPS} em={T_DESTROI} src={M2} volume={0.32} desde={58} dur={manifesto.duracao - T_DESTROI} some={1.6} />
        <Som fps={FPS} em={0.2} src="ep02/sfx/metal.mp3" volume={0.6} />
        <Som fps={FPS} em={T_QUEDA} src="ep01/sfx/impacto.mp3" volume={0.8} />
        <Som fps={FPS} em={P.voltou.de} src="ep01/sfx/drone.mp3" volume={0.5} dur={P.foge.de - P.voltou.de} some={0.3} />
        <Som fps={FPS} em={P.cavaleiros.de} src="abismo/sfx/criatura.mp3" volume={0.5} dur={P.valfenda.de - P.cavaleiros.de} some={0.3} />
        <Som fps={FPS} em={P.balrog.de} src="abismo/sfx/criatura.mp3" volume={0.8} dur={P.cobica.de - P.balrog.de} some={0.3} />
        <Som fps={FPS} em={P.queda.de} src="ep02/sfx/rachadura.mp3" volume={0.9} />
        <Som fps={FPS} em={P.defesa.de} src="labirinto/sfx/robos.mp3" volume={0.4} dur={P.parte.de - P.defesa.de} some={0.3} />
        <Som fps={FPS} em={P.branco.de + 0.2} src="trem/sfx/brilho.mp3" volume={0.8} />
        <Som fps={FPS} em={P.helm.de} src="mare02/sfx/impacto.mp3" volume={0.45} dur={P.aurora.de - P.helm.de} some={0.3} />
        <Som fps={FPS} em={T_BRECHA + 0.1} src="oito/sfx/explosao.mp3" volume={0.8} dur={1.6} some={0.5} />
        <Som fps={FPS} em={P.inundam.de} src="mare02/sfx/correnteza.mp3" volume={0.6} dur={P.guia.de - P.inundam.de} some={0.4} />
        <Som fps={FPS} em={P.aranha.de + 0.3} src="ep02/sfx/arranhao.mp3" volume={0.7} />
        <Som fps={FPS} em={P.gondor.de} src="mare02/sfx/impacto.mp3" volume={0.45} dur={P.eowyn.de - P.gondor.de} some={0.3} />
        <Som fps={FPS} em={P.bruxo.de + 0.3} src="ep01/sfx/impacto.mp3" volume={0.9} />
        <Som fps={FPS} em={P.mortos.de} src="futuro/sfx/dissolve.mp3" volume={0.5} dur={P.espada.de - P.mortos.de} some={0.3} />
        <Som fps={FPS} em={P.ataca.de} src="ep02/sfx/arrasto.mp3" volume={0.7} />
        <Som fps={FPS} em={T_DESTROI} src="oito/sfx/explosao.mp3" volume={1} dur={2.4} some={0.8} />
        <Som fps={FPS} em={T_DESABA + 0.4} src="mare02/sfx/predio.mp3" volume={0.8} dur={P.coroado.de - T_DESABA - 0.4} some={0.4} />
        <Som fps={FPS} em={P.navio.de} src="mare01/sfx/praia.mp3" volume={0.4} dur={P.volta.de - P.navio.de} some={0.5} />
        <Som fps={FPS} em={P.volta.de} src="mare01/sfx/aves.mp3" volume={0.5} />
      </>
    }
  />
);

export const ANEIS_DURACAO = Math.round(manifesto.duracao * FPS);
export const ANEIS_FPS = FPS;

