import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import manifestoJson from "./manifest.json";
import { FONT } from "../theme";
import type { Visual } from "../serie/Ator";
import {
  Episodio, Som, decai, est as e, sobe, tempos,
  type Bloco, type Contexto, type Manifesto, type Shot,
} from "../serie/motor";
import { Cidade, Colar, JANELA, Lab, PALIDO, Quarto, Refugio } from "./cenarios";

// Os Filhos da Noite — curta narrado.
// O roteiro não dá o nome da irmã; no vidro aparece "ANA" (escolha da produção).

const manifesto = manifestoJson as Manifesto;
const FPS = manifesto.fps;
const PRETO = manifestoJson.preto;
const { fim, pal } = tempos(manifesto);
const NOME_IRMA = "ANA";

const LUCAS: Visual = { pele: "#c99670", cabelo: "#2e211b", roupa: "#5a6b4a", calca: "#2a2f3a", estilo: "curto", mochila: "#8a4f3a" };
const IRMA: Visual = { pele: "#bccada", cabelo: "#2e211b", roupa: "#6a4f8a", calca: "#2a2f3a", estilo: "longo", sobrancelha: "#4a4f5a" };
const DIURNO: Visual = { pele: "#e2b08a", cabelo: "#6b4428", roupa: "#e6c229", casaco: true, calca: "#3a3f2a", estilo: "curto", mascara: "#3a3f38" };
const ELENCO: Record<string, Visual> = {
  Lucas: LUCAS, Criatura: PALIDO, Irma: IRMA, IrmaSol: { ...IRMA, pele: "#d2bfb4" },
  Diurno1: DIURNO, Diurno2: { ...DIURNO, cabelo: "#17110e", estilo: "gorro", detalhe: "#e6c229" },
};

const BLOCOS: Record<string, Bloco> = {
  busca: { Lucas: e(300, 1850, 0.6, "medo", [1, 0.5]) },
  quarto: { Lucas: e(260, 1810, 0.7, "medo", [1, -0.3]) },
  porta: { Lucas: e(170, 1830, 0.6, "medo", [1, 0]), Criatura: e(640, 1850, 0.6, "medo", [-1, 0]) },
  refugio: { Lucas: e(560, 1860, 0.5, "surpreso", [0.4, -0.5]) },
  irmaos: { Lucas: e(480, 1860, 0.6, "feliz", [1, 0], "abracar"), Irma: e(650, 1860, 0.56, "feliz", [-1, 0], "abracar") },
  lab: { Diurno1: e(300, 1820, 0.62, "firme", [1, 0.4]), Diurno2: e(800, 1820, 0.62, "firme", [-1, 0.4], "apontarEsq") },
  destroem: { Lucas: e(300, 1830, 0.6, "bravo", [1, 0.5], "empurrar"), Irma: e(790, 1830, 0.56, "bravo", [-1, 0.5], "empurrar") },
  sol: { Lucas: e(420, 1860, 0.6, "feliz", [0.6, -0.3]), IrmaSol: e(650, 1860, 0.56, "medo", [-0.2, -0.9], "recuar") },
};
const R = (b: string, n: string): [number, number] => [BLOCOS[b][n].x, BLOCOS[b][n].y - 690 * BLOCOS[b][n].s];
const R_Q = R("quarto", "Lucas"), R_CRI = R("porta", "Criatura"), R_IRMA = R("irmaos", "Irma"), R_SOL = R("sol", "IrmaSol");

const SHOTS: Shot[] = [
  // 00–12 s | As janelas
  { id: "noite", de: 0, ate: pal("01", "lucas") - 0.2, fundo: "cidadeNoite", luz: "noite",
    cam: [[540, 900, 1.0], [540, 1300, 1.3]] },
  { id: "dias", de: pal("01", "lucas") - 0.2, ate: pal("01", "noites") - 0.3, fundo: "cidadeDia", bloco: "busca", luz: "dia",
    cam: [[420, 1450, 1.4], [560, 1450, 1.5]], at: { Lucas: { x: 120, xPara: 560 } } },
  { id: "trancado", de: pal("01", "noites") - 0.3, ate: pal("01", "até") - 0.2, fundo: "quarto", bloco: "quarto", luz: "noite",
    cam: [[260, 1300, 1.5], [220, 1150, 1.9]], at: { Lucas: { x: 200, pose: "empurrar", olhar: [-1, -0.4] } } },
  { id: "coracao", de: pal("01", "até") - 0.2, ate: fim("01") + 0.7, fundo: "quartoCoracao", bloco: "quarto", luz: "noite",
    cam: [[R_Q[0], R_Q[1], 2.2], [JANELA[0], JANELA[1] + 40, 1.5]], at: { Lucas: { expr: "congelado" } } },

  // 12–25 s | O sinal
  { id: "nome", de: fim("01") + 0.7, ate: pal("02", "ele") - 0.2, fundo: "quartoNome", bloco: "quarto", luz: "noite",
    cam: [[JANELA[0], JANELA[1] + 40, 1.5], [JANELA[0], JANELA[1] + 60, 1.9]], at: { Lucas: { oculto: true } } },
  { id: "percebe", de: pal("02", "ele") - 0.2, ate: fim("02") + 0.6, fundo: "quartoNome", bloco: "quarto", luz: "noite",
    cam: [[R_Q[0] + 40, R_Q[1], 2.4], [R_Q[0] + 120, R_Q[1], 2.0]], at: { Lucas: { expr: "surpreso", pose: "apontarDir", lagrima: true } } },

  // 25–38 s | O encontro
  { id: "porta", de: fim("02") + 0.6, ate: pal("03", "criatura") - 0.4, fundo: "cidadePorta", bloco: "porta", luz: "noite",
    cam: [[300, 1400, 1.5], [420, 1420, 1.35]], at: { Criatura: { x: 520 } } },
  { id: "recua", de: pal("03", "criatura") - 0.4, ate: pal("03", "mas") - 0.1, fundo: "cidadePorta", bloco: "porta", luz: "noite",
    cam: [[560, 1420, 1.6], [640, 1420, 1.8]], at: { Criatura: { x: 520, xPara: 700, pose: "recuar" } } },
  { id: "colar", de: pal("03", "mas") - 0.1, ate: fim("03") + 0.6, fundo: "cidadePorta", bloco: "porta", luz: "noite",
    cam: [[560, 1480, 2.0], [470, 1470, 2.5]], at: { Criatura: { x: 700, xPara: 600, pose: "apontarEsq", expr: "triste", tremor: true }, Lucas: { expr: "surpreso", olhar: [1, 0.3] } } },

  // 38–52 s | A descoberta
  { id: "segue", de: fim("03") + 0.6, ate: pal("04", "lucas") - 0.1, fundo: "cidadeNoite2", bloco: "porta", luz: "noite",
    cam: [[500, 1450, 1.4], [700, 1450, 1.5]], at: { Criatura: { x: 600, xPara: 1250 }, Lucas: { x: 170, xPara: 700, expr: "firme" } } },
  { id: "comunidade", de: pal("04", "lucas") - 0.1, ate: pal("04", "os") - 0.1, fundo: "refugio", bloco: "refugio", luz: "abajur",
    cam: [[540, 1500, 1.5], [540, 1050, 1.0]], at: { Lucas: { x: 1250, xPara: 560 } } },
  { id: "humanos", de: pal("04", "os") - 0.1, ate: pal("04", "mas") - 0.1, fundo: "refugio", bloco: "refugio", luz: "abajur",
    cam: [[360, 1580, 2.2], [740, 1560, 2.2]], at: { Lucas: { oculto: true } } },
  { id: "solar", de: pal("04", "mas") - 0.1, ate: fim("04") + 0.6, fundo: "refugioRaio", bloco: "refugio", luz: "abajur",
    cam: [[760, 1300, 1.3], [820, 1500, 1.8]], at: { Lucas: { expr: "triste", olhar: [1, 0] } } },

  // 52–65 s | A ameaça
  { id: "diurnos", de: fim("04") + 0.6, ate: pal("05", "espalhando") - 0.1, fundo: "lab", bloco: "lab", luz: "dia",
    cam: [[540, 1300, 1.2], [540, 1350, 1.5]] },
  { id: "produto", de: pal("05", "espalhando") - 0.1, ate: pal("05", "diziam") - 0.2, fundo: "cidadeVeneno", luz: "normal",
    cam: [[540, 1300, 1.3], [540, 1000, 1.0]] },
  { id: "cura", de: pal("05", "diziam") - 0.2, ate: fim("05") + 0.6, fundo: "lab", bloco: "lab", luz: "dia",
    cam: [[540, 1350, 1.5], [540, 1350, 1.55]] },

  // 65–78 s | A decisão
  { id: "irma", de: fim("05") + 0.6, ate: pal("06", "ajudou") - 0.3, fundo: "refugio", bloco: "irmaos", luz: "abajur",
    cam: [[R_IRMA[0] - 80, R_IRMA[1] + 40, 2.3], [R_IRMA[0] - 80, R_IRMA[1] + 40, 2.7]], at: { Lucas: { fechado: true, lagrima: true }, Irma: { fechado: true } } },
  { id: "radio", de: pal("06", "ajudou") - 0.3, ate: pal("06", "juntos") - 0.2, fundo: "refugio", bloco: "irmaos", luz: "abajur",
    cam: [[560, 1500, 1.8], [560, 1480, 2.0]], at: { Lucas: { pose: "parado", expr: "firme", olhar: [0, 0] }, Irma: { pose: "parado", expr: "firme", olhar: [-1, 0] } } },
  { id: "destroem", de: pal("06", "juntos") - 0.2, ate: pal("06", "distribuíram") - 0.4, fundo: "labNoite", bloco: "destroem", luz: "noite", tremor: 6,
    cam: [[540, 1450, 1.3], [540, 1500, 1.5]] },
  { id: "tratamento", de: pal("06", "distribuíram") - 0.4, ate: fim("06") + 0.7, fundo: "refugioLuz", bloco: "irmaos", luz: "abajur",
    cam: [[540, 1500, 1.6], [540, 1100, 1.05]], at: { Lucas: { pose: "parado", olhar: [0, -0.6] }, Irma: { pose: "parado", olhar: [0, -0.8] } } },

  // 78–90 s | O amanhecer
  { id: "sol", de: fim("06") + 0.7, ate: pal("07", "sol") - 0.2, fundo: "amanhecer", bloco: "sol", luz: "dia",
    cam: [[540, 1300, 1.2], [560, 1450, 1.6]], at: { Lucas: { x: 180, xPara: 420 }, IrmaSol: { x: 410, xPara: 650 } } },
  { id: "primeiro", de: pal("07", "sol") - 0.2, ate: pal("07", "cidade") - 0.4, fundo: "amanhecer", bloco: "sol", luz: "dourada",
    cam: [[R_SOL[0], R_SOL[1], 2.4], [R_SOL[0], R_SOL[1], 2.8]], at: { IrmaSol: { pose: "parado", expr: "feliz", lagrima: true, olhar: [-0.2, -0.9] } } },
  { id: "pessoas", de: pal("07", "cidade") - 0.4, ate: PRETO, fundo: "amanhecerGente", bloco: "sol", luz: "dia",
    cam: [[540, 1480, 1.7], [540, 1000, 1.0]], at: { IrmaSol: { pose: "abracar", expr: "feliz", olhar: [-0.6, -0.4] }, Lucas: { pose: "abracar" } } },
];

const P = Object.fromEntries(SHOTS.map((s) => [s.id, s]));
const dentro = (t: number, id: string) => sobe(t, P[id].de, P[id].ate);
const T_QUEBRA = P.destroem.de + 0.6;

const cenario = ({ t, shot }: Contexto) => {
  switch (shot.fundo) {
    case "cidadeNoite": return <Cidade t={t} noite={1} vultos />;
    case "cidadeNoite2": return <Cidade t={t} noite={1} porta={1} />;
    case "cidadeDia": return <Cidade t={t} />;
    case "cidadePorta": return <Cidade t={t} noite={1} porta={shot.id === "porta" ? sobe(t, P.porta.de + 0.3, P.porta.de + 1) : 1} />;
    case "cidadeVeneno": return <Cidade t={t} noite={0.45} veneno={dentro(t, "produto")} />;
    case "amanhecer": return <Cidade t={t} renasce={0.5 + 0.5 * sobe(t, P.sol.de, P.primeiro.ate)} />;
    case "amanhecerGente": return <Cidade t={t} renasce={1} vultos />;
    case "quarto": return <Quarto t={t} />;
    case "quartoCoracao": return <Quarto t={t} fora={PALIDO} coracao={sobe(t, pal("01", "desenhar") - 0.2, fim("01") + 0.2)} />;
    case "quartoNome": return <Quarto t={t} fora={PALIDO} texto={NOME_IRMA} nome={shot.id === "nome" ? sobe(t, pal("02", "escreveu") - 0.3, pal("02", "lucas")) : 1} />;
    case "refugio": return <Refugio t={t} />;
    case "refugioRaio": return <Refugio t={t} raio={sobe(t, P.solar.de + 0.2, P.solar.de + 0.8)} />;
    case "refugioLuz": return <Refugio t={t} frascos luz={0.2 + 0.8 * dentro(t, "tratamento")} />;
    case "labNoite": return <Lab t={t} quebra={sobe(t, T_QUEBRA, T_QUEBRA + 1.6)} />;
    default: return <Lab t={t} />;
  }
};

const itens = ({ t, shot }: Contexto) => {
  const item = (el: ReactNode) => [{ y: 2000, el }];
  switch (shot.id) {
    case "porta": case "recua": return item(
      <g key="l" transform={`translate(${BLOCOS.porta.Lucas.x + 110} ${BLOCOS.porta.Lucas.y - 300})`}>
        <circle r={150} fill="#ffe2a0" opacity={0.16 + 0.04 * Math.sin(t * 9)} /><rect x={-20} y={-34} width={40} height={68} rx={8} fill="#3a2a22" /><circle r={18} fill="#fff3c9" />
      </g>,
    );
    case "colar": {
      const x = 700 - dentro(t, "colar") * 100 - 150;
      return item(<g key="c" transform={`translate(${x} ${1850 - 0.6 * 520 + 30}) scale(0.8)`}><Colar t={t} /></g>);
    }
    case "radio": return item(
      <g key="m" transform="translate(560 1560)">
        <rect x={-10} y={0} width={20} height={300} fill="#56636e" /><rect x={-30} y={-84} width={60} height={100} rx={28} fill="#14181e" stroke="#8e99a3" strokeWidth={6} />
        {[0, 1, 2].map((i) => <circle key={i} r={60 + ((t * 160 + i * 80) % 240)} cy={-40} fill="none" stroke="#ffd166" strokeWidth={6} opacity={0.6 - ((t * 160 + i * 80) % 240) / 400} />)}
      </g>,
    );
    default: return [];
  }
};

// ---------- sobreposições ----------
const Panfleto = ({ t, p }: { t: number; p: number }) => {
  const rasga = sobe(p, 0.45, 0.8);
  return (
    <AbsoluteFill style={{ alignItems: "center", background: "rgba(6,8,10,0.45)" }}>
      <div style={{ marginTop: 250, width: 720, height: 860, background: "#fffaf0", border: "8px solid #14181e", boxSizing: "border-box", fontFamily: FONT, color: "#14181e", textAlign: "center", position: "relative", overflow: "hidden", transform: `rotate(${-3 + Math.sin(t) * 0.5}deg)`, boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: 40, background: "#2a1512", color: "#fff" }}>
          <div style={{ fontSize: 60, color: "#ff8a5f", letterSpacing: 4 }}>NA VERDADE</div>
          <div style={{ fontSize: 96, lineHeight: 1.05, marginTop: 20 }}>IMPEDE A RECUPERAÇÃO</div>
          <div style={{ fontSize: 60, marginTop: 20, color: "#8fd65a" }}>DOS INFECTADOS</div>
        </div>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(1 - rasga) * 100}%`, background: "#fffaf0", overflow: "hidden", borderRight: rasga > 0 ? "10px dashed #b9b2a6" : "none" }}>
          <div style={{ width: 704, padding: 40, boxSizing: "border-box" }}>
            <div style={{ fontSize: 70, color: "#5c9a4f", letterSpacing: 6 }}>FINALMENTE</div>
            <div style={{ fontSize: 260, lineHeight: 1, color: "#5c9a4f" }}>A CURA</div>
            <svg width={300} height={260} viewBox="-150 -200 300 260" style={{ marginTop: 10 }}>
              <path d="M-40 -180 L40 -180 L40 -100 L90 20 L-90 20 L-40 -100Z" fill="#dfe6ec" stroke="#14181e" strokeWidth={8} /><path d="M-66 -30 L66 -30 L90 20 L-90 20Z" fill="#8fd65a" />
            </svg>
            <div style={{ fontSize: 54 }}>PULVERIZAÇÃO EM TODA A CIDADE</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
const Faixa = ({ texto, cor = "#ffd166", tam = 120, sub }: { texto: string; cor?: string; tam?: number; sub?: string }) => (
  <AbsoluteFill style={{ alignItems: "center", fontFamily: FONT }}>
    <div style={{ marginTop: 230, fontSize: tam, color: cor, letterSpacing: 6, lineHeight: 1.05, textAlign: "center", textShadow: `0 7px 0 #14161c, 0 0 50px ${cor}88` }}>{texto}</div>
    {sub && <div style={{ fontSize: 60, color: "#fff", marginTop: 10, letterSpacing: 4, textShadow: "0 5px 0 #14161c" }}>{sub}</div>}
  </AbsoluteFill>
);

const sobre = ({ t, shot }: Contexto) => {
  switch (shot.id) {
    case "cura": return <Panfleto t={t} p={dentro(t, "cura")} />;
    case "radio": return <Faixa texto="A VERDADE" sub="TRANSMISSÃO PARA TODA A CIDADE" />;
    case "tratamento": return <Faixa texto={`LUZ ${Math.round(10 + dentro(t, "tratamento") * 50)}%`} cor="#5cc8ff" sub="TRATAMENTO: UM POUCO A CADA DIA" />;
    default: return null;
  }
};

const fx = ({ t }: Contexto) => ({
  impacto: Math.max(decai(t, P.solar.de + 0.9, 0.5), decai(t, T_QUEBRA, 1.2)),
  flash: Math.max(decai(t, P.solar.de + 0.9, 0.3), decai(t, T_QUEBRA, 0.4)),
  clarao: Math.max(decai(t, P.dias.de, 0.5) * 0.7, decai(t, P.trancado.de, 0.3) * 0.3, decai(t, P.diurnos.de, 0.4) * 0.6, decai(t, P.sol.de, 1.0)),
  claraoCor: "#fff6dc",
});

export const FilhosDaNoite = () => (
  <Episodio
    manifesto={manifesto} shots={SHOTS} blocos={BLOCOS} preto={PRETO} elenco={ELENCO} vinheta={0.6}
    cenario={cenario} sobre={sobre} itens={itens} fx={fx}
    corLegenda={() => "#ffffff"}
    final={() => (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", color: "#e8e4dc", fontFamily: FONT, fontSize: 90, letterSpacing: 10 }}>FIM</AbsoluteFill>
    )}
    sons={
      <>
        <Som fps={FPS} em={0} src="noite/sfx/musica.mp3" volume={0.3} dur={manifesto.duracao} some={1.8} />
        <Som fps={FPS} em={0} src="trem/sfx/noite.mp3" volume={0.5} dur={P.dias.de} some={0.5} />
        <Som fps={FPS} em={P.dias.de} src="mare01/sfx/vento.mp3" volume={0.4} dur={P.trancado.de - P.dias.de} some={0.3} />
        <Som fps={FPS} em={P.trancado.de + 0.2} src="ep01/sfx/porta.mp3" volume={0.7} />
        <Som fps={FPS} em={P.coracao.de + 0.6} src="ep02/sfx/arranhao.mp3" volume={0.35} />
        <Som fps={FPS} em={P.nome.de + 1.4} src="ep02/sfx/arranhao.mp3" volume={0.35} />
        <Som fps={FPS} em={P.nome.de + 2.6} src="ep02/sfx/arranhao.mp3" volume={0.3} />
        <Som fps={FPS} em={P.percebe.de} src="trem/sfx/brilho.mp3" volume={0.5} />
        <Som fps={FPS} em={P.porta.de + 0.3} src="cidade/sfx/porta.mp3" volume={0.7} />
        <Som fps={FPS} em={P.porta.de} src="trem/sfx/noite.mp3" volume={0.45} dur={P.comunidade.de - P.porta.de} some={0.6} />
        <Som fps={FPS} em={P.colar.de + 0.5} src="minutos/sfx/moeda.mp3" volume={0.6} />
        <Som fps={FPS} em={P.comunidade.de} src="tempo/sfx/cidade.mp3" volume={0.25} dur={P.diurnos.de - P.comunidade.de} some={0.6} />
        <Som fps={FPS} em={P.solar.de + 0.9} src="ep01/sfx/luz.mp3" volume={0.6} />
        <Som fps={FPS} em={P.diurnos.de} src="cidade/sfx/maquina.mp3" volume={0.4} dur={P.cura.de - P.diurnos.de} some={0.5} />
        <Som fps={FPS} em={P.produto.de} src="abismo/sfx/vapor.mp3" volume={0.5} dur={P.cura.de - P.produto.de} some={0.4} />
        <Som fps={FPS} em={P.cura.de + 1.2} src="cidade/sfx/rebobina.mp3" volume={0.5} />
        <Som fps={FPS} em={P.radio.de} src="ep01/sfx/estatica.mp3" volume={0.5} />
        <Som fps={FPS} em={T_QUEBRA} src="mare02/sfx/vidros.mp3" volume={0.8} />
        <Som fps={FPS} em={T_QUEBRA + 0.6} src="ep02/sfx/metal.mp3" volume={0.7} />
        <Som fps={FPS} em={P.tratamento.de + 0.4} src="trem/sfx/brilho.mp3" volume={0.6} />
        <Som fps={FPS} em={P.sol.de + 0.4} src="mare01/sfx/aves.mp3" volume={0.5} />
        <Som fps={FPS} em={P.pessoas.de} src="tempo/sfx/cidade.mp3" volume={0.3} dur={PRETO - P.pessoas.de} some={1.5} />
      </>
    }
  />
);

export const NOITE_DURACAO = Math.round(manifesto.duracao * FPS);
export const NOITE_FPS = FPS;
