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
import { Briga, Cela, Cozinha, Esteira, MesaJantar, Torre, TorreFora, Tubulacao } from "./cenarios";

// O Último Andar — curta narrado.

const manifesto = manifestoJson as Manifesto;
const FPS = manifesto.fps;
const PRETO = manifestoJson.preto;
const { fim, pal } = tempos(manifesto);

const LIA: Visual = { pele: "#c99670", cabelo: "#2e211b", roupa: "#7d8a96", detalhe: "#e0572a", calca: "#4a525c", estilo: "cacheado" };
const crianca = (i: number, roupa: string): Visual => ({ ...cidadao(i), roupa, estilo: i % 2 ? "baguncado" : "rabo" });
const ELENCO: Record<string, Visual> = {
  Lia: LIA, Vizinha: { ...cidadao(5), roupa: "#8a8f98" }, Vizinho: { ...cidadao(2), roupa: "#7d8a96", barbaCor: "#8a8d94" },
  Nino: crianca(3, "#e9b730"), Bia: crianca(6, "#2a9d8f"), Tom: crianca(7, "#e0572a"),
};

const BLOCOS: Record<string, Bloco> = {
  cela: { Lia: e(140, 1800, 0.62, "triste", [1, 0.3]) },
  tubo: { Lia: e(540, 1500, 0.6, "firme", [0, -0.9], "alcancar") },
  esteira: { Lia: e(150, 1830, 0.5, "surpreso", [1, -0.6]) },
  coz: { Lia: e(250, 1800, 0.62, "surpreso", [1, -0.3]) },
  painel: { Lia: e(480, 1800, 0.66, "firme", [1, -0.3]) },
  chega: {
    Lia: e(130, 1800, 0.56, "surpreso", [1, -0.6]), Nino: e(250, 1830, 0.38, "surpreso", [1, -0.8]),
    Vizinha: e(940, 1800, 0.56, "surpreso", [-1, -0.6]), Tom: e(850, 1830, 0.38, "surpreso", [-1, -0.8]),
  },
  jantar: {
    Lia: e(230, 1720, 0.6, "feliz", [1, 0.3]), Vizinha: e(560, 1720, 0.6, "feliz", [-0.6, 0.4]), Vizinho: e(880, 1720, 0.6, "feliz", [-1, 0.3]),
    Nino: e(400, 1660, 0.42, "feliz", [0, 0.8]), Bia: e(720, 1660, 0.42, "feliz", [0, 0.8]), Tom: e(1020, 1660, 0.42, "feliz", [-0.5, 0.8]),
  },
};
const R = (b: string, n: string): [number, number] => [BLOCOS[b][n].x, BLOCOS[b][n].y - 690 * BLOCOS[b][n].s];
const R_CELA = R("cela", "Lia"), R_COZ = R("coz", "Lia"), R_PAINEL = R("painel", "Lia");

const SHOTS: Shot[] = [
  // 00–12 s | A plataforma (gancho: a comida some andar por andar)
  { id: "desce", de: 0, ate: pal("01", "quando") - 0.2, fundo: "torre", luz: "normal", tremor: 2,
    cam: [[540, 900, 1.5], [540, 960, 1.15]] },
  { id: "vazios", de: pal("01", "quando") - 0.2, ate: pal("01", "lia") - 0.2, fundo: "torre", luz: "noite",
    cam: [[540, 960, 1.2], [540, 1100, 2.0]] },
  { id: "lia", de: pal("01", "lia") - 0.2, ate: fim("01") + 0.5, fundo: "cela", bloco: "cela", luz: "normal",
    cam: [[540, 1380, 1.6], [R_CELA[0] + 60, R_CELA[1], 2.4]] },

  // 12–25 s | A descoberta
  { id: "fresta", de: fim("01") + 0.5, ate: pal("02", "voltava") - 0.1, fundo: "celaNoite", bloco: "cela", luz: "noite",
    cam: [[R_CELA[0] + 40, R_CELA[1], 2.8], [R_CELA[0] + 40, R_CELA[1], 3.2]], at: { Lia: { expr: "desconfiado", olhar: [1, 0.2] } } },
  { id: "volta", de: pal("02", "voltava") - 0.1, ate: pal("02", "carregando") - 0.1, fundo: "celaNoite", bloco: "cela", luz: "noite",
    cam: [[540, 1500, 1.1], [540, 1100, 1.2]], at: { Lia: { expr: "surpreso", olhar: [1, -0.4] } } },
  { id: "cilindros", de: pal("02", "carregando") - 0.1, ate: pal("02", "alguém") - 0.1, fundo: "celaNoite", bloco: "cela", luz: "noite",
    cam: [[540, 1150, 2.2], [540, 620, 2.2]], at: { Lia: { expr: "surpreso", olhar: [1, -0.8] } } },
  { id: "alguem", de: pal("02", "alguém") - 0.1, ate: fim("02") + 0.4, fundo: "celaNoite", bloco: "cela", luz: "noite",
    cam: [[R_CELA[0] + 40, R_CELA[1], 2.4], [R_CELA[0] + 40, R_CELA[1], 3.1]], at: { Lia: { expr: "bravo", olhar: [0.6, -1] } } },

  // 25–38 s | A subida
  { id: "corda", de: fim("02") + 0.4, ate: pal("03", "ela") - 0.1, fundo: "celaNoite", bloco: "cela", luz: "noite",
    cam: [[400, 1300, 1.5], [420, 1000, 1.3]], at: { Lia: { x: 140, xPara: 380, expr: "firme", pose: "apontarCima", olhar: [0.4, -1] } } },
  { id: "escala", de: pal("03", "ela") - 0.1, ate: pal("03", "em") - 0.1, fundo: "tubo", bloco: "tubo", luz: "noite", tremor: 3,
    cam: [[540, 1250, 1.2], [540, 1050, 1.6]], at: { Lia: { y: 1700, yPara: 1380 } } },
  { id: "briga", de: pal("03", "em") - 0.1, ate: pal("03", "enquanto") - 0.1, fundo: "briga", luz: "normal", tremor: 3,
    cam: [[540, 1200, 1.0], [540, 1250, 1.5]] },
  { id: "maquinas", de: pal("03", "enquanto") - 0.1, ate: fim("03") + 0.5, fundo: "esteira", bloco: "esteira", luz: "normal",
    cam: [[400, 1500, 1.5], [560, 900, 1.2]] },

  // 38–52 s | A sala secreta
  { id: "cem", de: fim("03") + 0.5, ate: pal("04", "encontrou") - 0.1, fundo: "topo", bloco: "tubo", luz: "noite",
    cam: [[540, 1150, 1.3], [540, 700, 1.5]], at: { Lia: { y: 1750, yPara: 1280, olhar: [0, -1] } } },
  { id: "cozinha", de: pal("04", "encontrou") - 0.1, ate: pal("04", "não") - 0.1, fundo: "cozinha", bloco: "coz", luz: "dia",
    cam: [[400, 1100, 1.3], [300, 950, 1.6]], at: { Lia: { x: -160, xPara: 250 } } },
  { id: "ricos", de: pal("04", "não") - 0.1, ate: pal("04", "apenas") - 0.1, fundo: "cozinhaMesa", bloco: "coz", luz: "dia",
    cam: [[300, 1500, 1.7], [780, 1480, 1.7]], at: { Lia: { oculto: true } } },
  { id: "computador", de: pal("04", "apenas") - 0.1, ate: fim("04") + 0.5, fundo: "cozinha", bloco: "coz", luz: "dia",
    cam: [[640, 1000, 1.25], [800, 700, 2.1]], at: { Lia: { expr: "medo", olhar: [1, -0.7] } } },

  // 52–65 s | O erro
  { id: "criado", de: fim("04") + 0.5, ate: pal("05", "mas") - 0.2, fundo: "torreAntes", luz: "fria",
    cam: [[540, 960, 1.0], [540, 960, 1.3]] },
  { id: "terminara", de: pal("05", "mas") - 0.2, ate: pal("05", "ninguém") - 0.2, fundo: "cozinha", bloco: "coz", luz: "dia",
    cam: [[800, 720, 2.0], [800, 720, 2.1]] },
  { id: "ousara", de: pal("05", "ninguém") - 0.2, ate: fim("05") + 0.4, fundo: "cozinha", bloco: "painel", luz: "dia",
    cam: [[800, 1240, 3.0], [700, 1280, 1.8]], at: { Lia: { expr: "triste", olhar: [1, 0.2] } } },

  // 65–78 s | A decisão
  { id: "nao", de: fim("05") + 0.4, ate: pal("06", "reprogramou") - 0.2, fundo: "cozinha", bloco: "painel", luz: "dia",
    cam: [[R_PAINEL[0] + 60, R_PAINEL[1], 2.2], [R_PAINEL[0] + 60, R_PAINEL[1], 2.7]], at: { Lia: { expr: "firme", nega: true, olhar: [1, 0.3] } } },
  { id: "reprograma", de: pal("06", "reprogramou") - 0.2, ate: pal("06", "repartir") - 0.3, fundo: "cozinha", bloco: "painel", luz: "dia",
    cam: [[640, 1300, 1.5], [640, 1300, 1.6]], at: { Lia: { pose: "apontarDir", olhar: [1, -0.3] } } },
  { id: "iguais", de: pal("06", "repartir") - 0.3, ate: pal("06", "depois") - 0.2, fundo: "torreIgual", luz: "normal",
    cam: [[540, 960, 1.3], [540, 960, 1.1]] },
  { id: "verdade", de: pal("06", "depois") - 0.2, ate: pal("06", "verdade") - 0.1, fundo: "cozinhaOk", bloco: "painel", luz: "dia",
    cam: [[560, 1320, 1.9], [560, 1300, 2.2]], at: { Lia: { expr: "firme", olhar: [0, 0] } } },
  { id: "falantes", de: pal("06", "verdade") - 0.1, ate: fim("06") + 0.5, fundo: "torreOuve", luz: "normal",
    cam: [[540, 960, 1.6], [540, 960, 1.3]] },

  // 78–90 s | O primeiro jantar
  { id: "chega", de: fim("06") + 0.5, ate: pal("07", "lia") - 0.2, fundo: "celaQuente", bloco: "chega", luz: "abajur",
    cam: [[540, 900, 1.2], [540, 1350, 1.5]] },
  { id: "senta", de: pal("07", "lia") - 0.2, ate: pal("07", "torre") - 0.4, fundo: "jantar", bloco: "jantar", luz: "abajur",
    cam: [[260, 1380, 2.0], [860, 1380, 2.0]] },
  { id: "alta", de: pal("07", "torre") - 0.4, ate: pal("07", "mas") - 0.1, fundo: "fora", luz: "noite",
    cam: [[540, 1500, 1.3], [540, 500, 1.3]] },
  { id: "comer", de: pal("07", "mas") - 0.1, ate: PRETO, fundo: "jantar", bloco: "jantar", luz: "abajur",
    cam: [[560, 1420, 2.2], [540, 1250, 1.15]] },
];

const P = Object.fromEntries(SHOTS.map((s) => [s.id, s]));
const dentro = (t: number, id: string) => sobe(t, P[id].de, P[id].ate);
const facil = (x: number) => x * x * (3 - 2 * x);

const cenario = ({ t, shot }: Contexto) => {
  switch (shot.fundo) {
    case "torre": {
      if (shot.id === "desce") { const a = 1 + facil(dentro(t, "desce")) * 88; return <Torre t={t} andar={a} plat={a} comida={Math.max(0, 1 - a / 60)} />; }
      const a = 91 + facil(dentro(t, "vazios")) * 9;
      return <Torre t={t} andar={Math.min(98.6, a)} plat={a} comida={0} noite />;
    }
    case "torreAntes": { const a = 3 + dentro(t, "criado") * 5; return <Torre t={t} andar={a} plat={a} comida={1} igual={Math.floor(a)} />; }
    case "torreIgual": { const a = 60 + dentro(t, "iguais") * 6; return <Torre t={t} andar={a} plat={Math.floor(a) + Math.min(1, (a % 1) * 2)} comida={1} igual={Math.floor(a)} />; }
    case "torreOuve": return <Torre t={t} andar={93} plat={80} comida={1} igual={100} />;
    case "cela": return <Cela t={t} />;
    case "celaNoite": {
      if (shot.id === "fresta" || shot.id === "corda") return <Cela t={t} clima="noite" platY={shot.id === "corda" ? -900 : 2400} carga="cilindros" />;
      const sobeP = sobe(t, P.volta.de, P.cilindros.ate);
      return <Cela t={t} clima="noite" carga="cilindros" platY={1900 - sobeP * 1500} />;
    }
    case "celaQuente": return <Cela t={t} clima="quente" carga="cheia" platY={200 + facil(sobe(t, P.chega.de, P.chega.de + 2.6)) * 1270} />;
    case "jantar": return <Cela t={t} clima="quente" platY={3000} />;
    case "tubo": return <Tubulacao t={t} sobe={dentro(t, "escala")} />;
    case "topo": return <Tubulacao t={t} sobe={dentro(t, "cem") * 0.5} placa="100" />;
    case "briga": return <Briga t={t} />;
    case "esteira": return <Esteira t={t} />;
    case "cozinha": return <Cozinha t={t} />;
    case "cozinhaMesa": return <Cozinha t={t} mesa />;
    case "cozinhaOk": return <Cozinha t={t} igual teias={false} />;
    default: return <TorreFora t={t} />;
  }
};

const itens = ({ t, shot }: Contexto) => {
  const item = (el: ReactNode) => [{ y: 2000, el }];
  if (shot.id === "corda") {
    return item(<path key="c" d={`M${520 + dentro(t, "corda") * 0} 1320 Q560 900 540 ${1300 - dentro(t, "corda") * 1500}`} stroke="#d9b98a" strokeWidth={12} fill="none" strokeDasharray="26 8" />);
  }
  if (shot.id === "verdade") {
    return item(
      <g key="m" transform="translate(690 1420)">
        <rect x={-10} y={0} width={20} height={380} fill="#56636e" />
        <rect x={-34} y={-90} width={68} height={110} rx={30} fill="#14181e" stroke="#8e99a3" strokeWidth={6} />
        {[0, 1, 2].map((i) => <circle key={i} r={70 + ((t * 160 + i * 70) % 210)} cy={-40} fill="none" stroke="#5cf29a" strokeWidth={6} opacity={0.6 - ((t * 160 + i * 70) % 210) / 400} />)}
      </g>,
    );
  }
  return [];
};

const frente = ({ t, shot }: Contexto) => (shot.fundo === "jantar" ? <MesaJantar t={t} /> : null);

// ---------- sobreposições ----------
const Painel = ({ children, cor = "#ffb347", top = 300 }: { children: ReactNode; cor?: string; top?: number }) => (
  <AbsoluteFill style={{ alignItems: "center", background: "rgba(4,6,10,0.45)" }}>
    <div style={{ marginTop: top, width: 900, boxSizing: "border-box", padding: "34px 44px", background: "rgba(14,18,24,0.92)", border: `5px solid ${cor}`, borderRadius: 16, boxShadow: `0 0 70px ${cor}55`, color: "#e8e4dc", fontFamily: FONT }}>
      {children}
    </div>
  </AbsoluteFill>
);
const Faixa = ({ texto, cor = "#e8e4dc", top = 230, tam = 130 }: { texto: string; cor?: string; top?: number; tam?: number }) => (
  <AbsoluteFill style={{ alignItems: "center", fontFamily: FONT }}>
    <div style={{ marginTop: top, fontSize: tam, color: cor, letterSpacing: 6, textAlign: "center", lineHeight: 1.05, textShadow: `0 7px 0 #14161c, 0 0 50px ${cor}88` }}>{texto}</div>
  </AbsoluteFill>
);

const Registro = ({ t, p }: { t: number; p: number }) => (
  <Painel>
    <div style={{ fontSize: 40, letterSpacing: 4, color: "#ffb347" }}>REGISTRO DO SISTEMA · ARQUIVO ANTIGO</div>
    <div style={{ fontSize: 54, marginTop: 22, lineHeight: 1.35 }}>
      <div>PROTOCOLO: <span style={{ color: "#ffb347" }}>RACIONAMENTO</span></div>
      <div style={{ opacity: p > 0.2 ? 1 : 0 }}>EMERGÊNCIA: <span style={{ color: "#5cf29a" }}>ENCERRADA</span></div>
      <div style={{ opacity: p > 0.45 ? 1 : 0, fontSize: 84, color: "#5cf29a" }}>HÁ 11 ANOS</div>
      <div style={{ opacity: p > 0.7 ? 1 : 0 }}>SISTEMA: <span style={{ color: "#ff5a4a", opacity: Math.sin(t * 9) > 0 ? 1 : 0.4 }}>AINDA ATIVO</span></div>
    </div>
  </Painel>
);

const Rota = ({ p }: { p: number }) => (
  <Painel cor="#5cf29a" top={260}>
    <div style={{ fontSize: 44, letterSpacing: 4, color: "#5cf29a" }}>REPROGRAMAR ROTA DA PLATAFORMA</div>
    {["PARAR EM TODOS OS ANDARES", "PORÇÕES IGUAIS", "RESERVA SECRETA DO TOPO"].map((txt, i) => {
      const on = p > 0.2 + i * 0.25, ult = i === 2;
      return (
        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 26, fontSize: 50 }}>
          <span style={{ textDecoration: ult && on ? "line-through" : "none", opacity: ult && on ? 0.5 : 1 }}>{txt}</span>
          <span style={{ width: 130, height: 62, borderRadius: 40, background: on ? (ult ? "#7a1a12" : "#1f7a48") : "#39424f", position: "relative", flexShrink: 0 }}>
            <span style={{ position: "absolute", top: 7, left: on && !ult ? 74 : 8, width: 48, height: 48, borderRadius: 30, background: on ? (ult ? "#ff5a4a" : "#5cf29a") : "#8e99a3" }} />
          </span>
        </div>
      );
    })}
  </Painel>
);

const sobre = ({ t, shot }: Contexto) => {
  switch (shot.id) {
    case "desce": return <Faixa texto={`ANDAR ${String(Math.round(1 + facil(dentro(t, "desce")) * 88)).padStart(2, "0")}`} cor="#ffb347" tam={150} />;
    case "vazios": return <Faixa texto={`ANDAR ${Math.round(91 + facil(dentro(t, "vazios")) * 9)}`} cor="#ff5a4a" tam={150} />;
    case "criado": return <Faixa texto={"PROTOCOLO DE EMERGÊNCIA\nRACIONAMENTO"} cor="#bfe0ff" tam={84} />;
    case "terminara": return <Registro t={t} p={dentro(t, "terminara")} />;
    case "reprograma": return <Rota p={dentro(t, "reprograma")} />;
    case "falantes": return (
      <AbsoluteFill>
        <svg width={1080} height={1920}>
          {[[90, 420], [990, 420], [90, 1250], [990, 1250]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              {[0, 1, 2].map((k) => <circle key={k} r={40 + ((t * 170 + k * 80) % 240)} fill="none" stroke="#5cf29a" strokeWidth={7} opacity={0.7 - ((t * 170 + k * 80) % 240) / 350} />)}
              <path d={`M${i % 2 ? 30 : -30} -30 L${i % 2 ? -30 : 30} -60 L${i % 2 ? -30 : 30} 60 L${i % 2 ? 30 : -30} 30Z`} fill="#14181e" stroke="#e8e4dc" strokeWidth={6} />
            </g>
          ))}
        </svg>
      </AbsoluteFill>
    );
    default: return null;
  }
};

const fx = ({ t }: Contexto) => ({
  impacto: Math.max(decai(t, P.vazios.ate - 1.2, 0.6), decai(t, P.computador.de, 0.5), decai(t, P.iguais.de, 0.4)),
  flash: Math.max(decai(t, P.cozinha.de, 0.5), decai(t, P.verdade.de, 0.4)),
  clarao: Math.max(decai(t, P.criado.de, 0.4), decai(t, P.terminara.de, 0.3), decai(t, P.chega.de, 0.5)) * 0.7,
  claraoCor: "#fff4dc",
});

const MAQ = "cidade/sfx/maquina.mp3";

export const Andar = () => (
  <Episodio
    manifesto={manifesto} shots={SHOTS} blocos={BLOCOS} preto={PRETO} elenco={ELENCO} vinheta={0.6}
    cenario={cenario} sobre={sobre} itens={itens} frente={frente} fx={fx}
    corLegenda={() => "#ffffff"}
    final={() => (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", color: "#e8e4dc", fontFamily: FONT, fontSize: 90, letterSpacing: 10 }}>FIM</AbsoluteFill>
    )}
    sons={
      <>
        <Som fps={FPS} em={0} src="minutos/sfx/musica.mp3" volume={0.3} dur={manifesto.duracao} some={1.6} />
        <Som fps={FPS} em={0} src={MAQ} volume={0.5} dur={P.lia.de} some={0.5} />
        <Som fps={FPS} em={P.vazios.ate - 1.2} src="ep02/sfx/metal.mp3" volume={0.7} />
        <Som fps={FPS} em={P.volta.de} src={MAQ} volume={0.5} dur={P.alguem.de - P.volta.de} some={0.5} />
        <Som fps={FPS} em={P.cilindros.de} src="trem/sfx/brilho.mp3" volume={0.6} />
        <Som fps={FPS} em={P.escala.de} src="ep02/sfx/arrasto.mp3" volume={0.7} />
        <Som fps={FPS} em={P.escala.de + 1.2} src="ep02/sfx/arrasto.mp3" volume={0.6} />
        <Som fps={FPS} em={P.briga.de} src="mare01/sfx/gritos.mp3" volume={0.35} dur={P.maquinas.de - P.briga.de} some={0.4} />
        <Som fps={FPS} em={P.maquinas.de} src={MAQ} volume={0.6} dur={P.cem.de - P.maquinas.de} some={0.5} />
        <Som fps={FPS} em={P.cem.de + 0.3} src="ep02/sfx/escotilha.mp3" volume={0.7} dur={P.cozinha.de - P.cem.de} some={0.3} />
        <Som fps={FPS} em={P.computador.de} src="tempo/sfx/central.mp3" volume={0.45} dur={P.criado.de - P.computador.de} some={0.5} />
        <Som fps={FPS} em={P.terminara.de} src="futuro/sfx/bipes.mp3" volume={0.5} dur={P.ousara.de - P.terminara.de} some={0.3} />
        <Som fps={FPS} em={P.reprograma.de + 0.6} src="ep02/sfx/bipe.mp3" volume={0.7} />
        <Som fps={FPS} em={P.reprograma.de + 1.5} src="ep02/sfx/bipe.mp3" volume={0.7} />
        <Som fps={FPS} em={P.reprograma.de + 2.4} src="ep02/sfx/bipe.mp3" volume={0.7} />
        <Som fps={FPS} em={P.iguais.de} src={MAQ} volume={0.5} dur={P.verdade.de - P.iguais.de} some={0.4} />
        <Som fps={FPS} em={P.verdade.de} src="ep01/sfx/estatica.mp3" volume={0.5} />
        <Som fps={FPS} em={P.chega.de} src={MAQ} volume={0.4} dur={2.8} some={0.6} />
        <Som fps={FPS} em={P.chega.de + 2.5} src="trem/sfx/brilho.mp3" volume={0.7} />
      </>
    }
  />
);

export const ANDAR_DURACAO = Math.round(manifesto.duracao * FPS);
export const ANDAR_FPS = FPS;
