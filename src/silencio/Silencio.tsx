import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import manifestoJson from "./manifest.json";
import { FONT } from "../theme";
import type { Visual } from "../serie/Ator";
import {
  Episodio, Som, decai, est as e, sobe, tempos,
  type Bloco, type Contexto, type Manifesto, type Shot,
} from "../serie/motor";
import { Apartamento, Copo, Costa, Estacao, Fachada, FachadaFrente, Notas, Telhados } from "./cenarios";

// O Mundo em Silêncio — curta narrado.

const manifesto = manifestoJson as Manifesto;
const FPS = manifesto.fps;
const PRETO = manifestoJson.preto;
const { fim, pal } = tempos(manifesto);

const SOFIA: Visual = { pele: "#d9a074", cabelo: "#17110e", roupa: "#3f7f7a", calca: "#2b2f3b", estilo: "rabo", mochila: "#8a4f3a" };
const IRMAO: Visual = { pele: "#d9a074", cabelo: "#17110e", roupa: "#e0a030", calca: "#3a4a63", estilo: "baguncado" };
const ELENCO: Record<string, Visual> = { Sofia: SOFIA, Irmao: IRMAO };

const BLOCOS: Record<string, Bloco> = {
  copo: { Sofia: e(330, 1800, 0.7, "congelado", [1, 0.3], "apontarDir") },
  irmaos: { Sofia: e(360, 1800, 0.68, "medo", [0.5, 0.3], "abracar"), Irmao: e(560, 1810, 0.44, "medo", [-0.4, -0.5]) },
  aparelho: { Sofia: e(420, 1800, 0.72, "firme", [0.3, 0.8]) },
  rua: { Sofia: e(620, 1890, 0.4, "medo", [-0.8, -0.8]) },
  estacao: { Sofia: e(400, 1810, 0.62, "surpreso", [-0.6, -0.4]) },
  chave: { Sofia: e(560, 1810, 0.66, "firme", [1, -0.2], "apontarDir") },
  janela: { Irmao: e(430, 1700, 0.62, "feliz", [0.3, -0.6]), Sofia: e(670, 1800, 0.8, "medo", [0.4, -0.6]) },
};
const R = (b: string, n: string): [number, number] => [BLOCOS[b][n].x, BLOCOS[b][n].y - 690 * BLOCOS[b][n].s];
const R_COPO = R("copo", "Sofia"), R_IRM = R("irmaos", "Irmao"), R_APA = R("aparelho", "Sofia"), R_CHAVE = R("chave", "Sofia");

const SHOTS: Shot[] = [
  // 00–12 s | Não faça barulho (gancho: o copo quase cai)
  { id: "copo", de: 0, ate: 1.5, fundo: "apto", bloco: "copo", luz: "noite",
    cam: [[580, 1180, 3.0], [550, 1360, 2.6]] },
  { id: "pegou", de: 1.5, ate: pal("01", "criaturas") - 0.2, fundo: "apto", bloco: "copo", luz: "noite",
    cam: [[540, 1400, 2.6], [R_COPO[0] + 40, R_COPO[1], 2.6]] },
  { id: "sombras", de: pal("01", "criaturas") - 0.2, ate: pal("01", "sofia") - 0.2, fundo: "telhadosGrito", luz: "noite", tremor: 3,
    cam: [[540, 1000, 1.0], [520, 1150, 1.4]] },
  { id: "irmaos", de: pal("01", "sofia") - 0.2, ate: fim("01") + 0.6, fundo: "apto", bloco: "irmaos", luz: "noite",
    cam: [[460, 1400, 1.5], [480, 1450, 1.9]] },

  // 12–25 s | O sinal
  { id: "cantarola", de: fim("01") + 0.6, ate: pal("02", "nada") - 0.2, fundo: "apto", bloco: "irmaos", luz: "noite",
    cam: [[R_IRM[0], R_IRM[1], 2.6], [R_IRM[0] - 60, R_IRM[1] - 60, 2.0]], at: { Irmao: { expr: "feliz", olhar: [0, -0.4] }, Sofia: { expr: "panico", olhar: [1, -0.6], pose: "recuar" } } },
  { id: "nada", de: pal("02", "nada") - 0.2, ate: pal("02", "mas") - 0.2, fundo: "aptoBicho", bloco: "irmaos", luz: "noite",
    cam: [[800, 660, 1.9], [800, 680, 2.3]] },
  { id: "radio", de: pal("02", "mas") - 0.2, ate: pal("02", "criaturas") - 0.3, fundo: "aptoRadio", bloco: "irmaos", luz: "noite", tremor: 2,
    cam: [[300, 740, 2.6], [560, 760, 1.5]], at: { Sofia: { expr: "congelado", olhar: [-0.8, -0.8], pose: "abracar" }, Irmao: { expr: "medo" } } },
  { id: "ataque", de: pal("02", "criaturas") - 0.3, ate: fim("02") + 0.6, fundo: "telhadosAntena", luz: "noite", tremor: 6,
    cam: [[600, 1050, 1.2], [740, 860, 1.8]] },

  // 25–38 s | A hipótese
  { id: "descobre", de: fim("02") + 0.6, ate: pal("03", "emitido") - 0.1, fundo: "apto", bloco: "aparelho", luz: "noite",
    cam: [[R_APA[0], R_APA[1] + 100, 1.8], [R_APA[0], R_APA[1] + 40, 2.4]] },
  { id: "torres", de: pal("03", "emitido") - 0.1, ate: pal("03", "voz") - 0.3, fundo: "telhadosTorre", luz: "noite",
    cam: [[540, 1000, 1.0], [300, 700, 1.6]] },
  { id: "rastreador", de: pal("03", "voz") - 0.3, ate: fim("03") + 0.5, fundo: "apto", bloco: "aparelho", luz: "noite",
    cam: [[R_APA[0], R_APA[1] + 40, 2.4], [R_APA[0], R_APA[1] + 40, 2.5]] },

  // 38–52 s | A torre
  { id: "chega", de: fim("03") + 0.5, ate: pal("04", "encontrou") - 0.1, fundo: "telhadosCerco", bloco: "rua", luz: "noite", tremor: 2,
    cam: [[540, 1300, 1.2], [400, 1100, 1.4]], at: { Sofia: { x: 1150, xPara: 620 } } },
  { id: "transmissores", de: pal("04", "encontrou") - 0.1, ate: pal("04", "rede") - 0.4, fundo: "estacao", bloco: "estacao", luz: "noite",
    cam: [[640, 1100, 1.15], [330, 720, 1.9]], at: { Sofia: { x: 1200, xPara: 400 } } },
  { id: "crise", de: pal("04", "rede") - 0.4, ate: fim("04") + 0.5, fundo: "estacao", bloco: "estacao", luz: "noite",
    cam: [[330, 1100, 2.0], [330, 1200, 2.4]], at: { Sofia: { oculto: true } } },

  // 52–65 s | A origem
  { id: "erro", de: fim("04") + 0.5, ate: pal("05", "cada") - 0.2, fundo: "estacao", bloco: "estacao", luz: "noite",
    cam: [[540, 1100, 1.2], [540, 1100, 1.25]] },
  { id: "socorro", de: pal("05", "cada") - 0.2, ate: fim("05") + 0.5, fundo: "telhadosSocorro", luz: "noite", tremor: 4,
    cam: [[500, 1200, 1.7], [420, 950, 1.2]] },

  // 65–78 s | A solução
  { id: "desliga", de: fim("05") + 0.5, ate: pal("06", "ativou") - 0.4, fundo: "estacaoChave", bloco: "chave", luz: "noite", tremor: 3,
    cam: [[R_CHAVE[0] + 60, R_CHAVE[1], 2.0], [760, 880, 1.7]] },
  { id: "mapa", de: pal("06", "ativou") - 0.4, ate: pal("06", "longe") - 0.1, fundo: "estacaoIlha", bloco: "chave", luz: "noite",
    cam: [[420, 760, 1.6], [470, 900, 2.4]], at: { Sofia: { x: 700, pose: "apontarEsq", olhar: [-1, -0.3] } } },
  { id: "farol", de: pal("06", "longe") - 0.1, ate: pal("06", "criaturas") - 0.7, fundo: "costa", luz: "noite",
    cam: [[400, 1200, 1.1], [760, 950, 1.7]] },
  { id: "seguem", de: pal("06", "criaturas") - 0.7, ate: fim("06") + 0.8, fundo: "costaCorrida", luz: "noite", tremor: 3,
    cam: [[340, 1400, 1.4], [620, 1150, 1.15]] },

  // 78–90 s | A primeira canção
  { id: "manha", de: fim("06") + 0.8, ate: pal("07", "nenhuma") - 0.2, fundo: "predio", bloco: "janela", luz: "dia",
    cam: [[540, 1250, 1.5], [520, 1220, 1.9]] },
  { id: "nenhuma", de: pal("07", "nenhuma") - 0.2, ate: pal("07", "aos") - 0.2, fundo: "telhadosDia", luz: "dia",
    cam: [[540, 900, 1.3], [540, 1000, 1.1]] },
  { id: "falar", de: pal("07", "aos") - 0.2, ate: PRETO, fundo: "predioAbre", bloco: "janela", luz: "dia",
    cam: [[560, 1220, 1.8], [540, 960, 1.0]], at: { Sofia: { expr: "feliz", olhar: [-0.5, -0.3] } } },
];

const P = Object.fromEntries(SHOTS.map((s) => [s.id, s]));
const dentro = (t: number, id: string) => sobe(t, P[id].de, P[id].ate);
const T_CHIA = pal("02", "rádio") - 0.2;
const T_SALTO = P.ataque.de + 0.3;
const T_CHAVE = P.desliga.de + 1.2;

const cenario = ({ t, shot }: Contexto) => {
  switch (shot.fundo) {
    case "apto": return <Apartamento t={t} />;
    case "aptoBicho": return <Apartamento t={t} bicho />;
    case "aptoRadio": return <Apartamento t={t} bicho radio={sobe(t, T_CHIA, T_CHIA + 0.3)} antena={sobe(t, T_CHIA + 1.2, T_CHIA + 1.6)} />;
    case "telhadosGrito": return <Telhados t={t} modo="passam" grito={sobe(t, P.sombras.de + 0.6, P.sombras.de + 1)} torre={sobe(t, P.sombras.de + 0.9, P.sombras.de + 1.3)} />;
    case "telhadosAntena": return <Telhados t={t} modo="antena" antena={1} p={sobe(t, T_SALTO, T_SALTO + 0.9)} />;
    case "telhadosTorre": return <Telhados t={t} modo="torre" torre={1} />;
    case "telhadosCerco": return <Telhados t={t} modo="torre" torre={0.6} />;
    case "telhadosSocorro": return <Telhados t={t} modo={t > P.socorro.de + 1.3 ? "partem" : "paradas"} grito={1} torre={sobe(t, P.socorro.de + 0.7, P.socorro.de + 1.1)} p={-sobe(t, P.socorro.de + 1.3, P.socorro.ate) * 0.25} />;
    case "telhadosDia": return <Telhados t={t} modo="nenhuma" dia={1} />;
    case "estacao": return <Estacao t={t} />;
    case "estacaoChave": return <Estacao t={t} ligado={t < T_CHAVE} />;
    case "estacaoIlha": return <Estacao t={t} ligado={false} ilha={sobe(t, P.mapa.de + 0.5, P.mapa.de + 1)} />;
    case "costa": return <Costa t={t} farol={sobe(t, P.farol.de + 0.4, P.farol.de + 0.9)} />;
    case "costaCorrida": return <Costa t={t} farol={1} corrida={dentro(t, "seguem")} />;
    case "predio": return <Fachada t={t} />;
    default: return <Fachada t={t} abre={dentro(t, "falar")} />;
  }
};

const Aparelho = ({ t, alerta }: { t: number; alerta: boolean }) => (
  <g>
    <rect x={-90} y={-60} width={180} height={130} rx={14} fill="#2b323d" stroke="#14181e" strokeWidth={7} />
    <rect x={-74} y={-46} width={148} height={70} fill="#0a1a12" />
    <polyline points={Array.from({ length: 16 }, (_, i) => `${-70 + i * 9.4},${-11 + Math.sin(i * 1.1 + t * 9) * 22}`).join(" ")} stroke={alerta ? "#ff5a4a" : "#5cf29a"} strokeWidth={5} fill="none" />
    <circle cx={-50} cy={46} r={12} fill={alerta ? "#ff5a4a" : "#5cf29a"} /><line x1={70} y1={-60} x2={96} y2={-150} stroke="#8e99a3" strokeWidth={6} />
  </g>
);

const itens = ({ t, shot }: Contexto) => {
  const item = (el: ReactNode) => [{ y: 2000, el }];
  switch (shot.id) {
    case "copo": {
      const q = sobe(t, 0.55, 1.25), queda = q * q;
      return item(<g key="c" transform={`translate(${580 - queda * 46} ${1200 + queda * 215}) rotate(${Math.sin(t * 22) * 5 * (1 - q) - q * 70})`}><Copo /></g>);
    }
    case "pegou": return item(<g key="c" transform="translate(534 1415) rotate(-70)"><Copo /></g>);
    case "cantarola": return item(<g key="n" transform={`translate(${R_IRM[0] + 60} ${R_IRM[1] - 120})`}><Notas t={t} /></g>);
    case "descobre": case "rastreador": return item(<g key="a" transform={`translate(${R_APA[0]} ${R_APA[1] + 250})`}><Aparelho t={t} alerta={shot.id === "rastreador"} /></g>);
    case "manha": case "falar": return item(<g key="n" transform={`translate(${R("janela", "Irmao")[0] + 40} ${R("janela", "Irmao")[1] - 130})`}><Notas t={t} n={6} /></g>);
    default: return [];
  }
};

const frente = ({ t, shot }: Contexto) => (shot.fundo.startsWith("predio") ? <FachadaFrente t={t} /> : null);

// ---------- sobreposições ----------
const Painel = ({ children, cor = "#7ef0ff", top = 250 }: { children: ReactNode; cor?: string; top?: number }) => (
  <AbsoluteFill style={{ alignItems: "center", background: "rgba(4,6,10,0.5)" }}>
    <div style={{ marginTop: top, width: 900, boxSizing: "border-box", padding: "30px 40px", background: "rgba(10,16,24,0.93)", border: `5px solid ${cor}`, borderRadius: 16, boxShadow: `0 0 70px ${cor}55`, color: "#e8e4dc", fontFamily: FONT }}>
      {children}
    </div>
  </AbsoluteFill>
);

const onda = (t: number, amp: number, fase: number) => Array.from({ length: 40 }, (_, i) => `${i * 20},${60 + Math.sin(i * 0.55 + t * 8 + fase) * amp}`).join(" ");
const Frequencias = ({ t, p }: { t: number; p: number }) => (
  <Painel cor={p > 0.6 ? "#ff5a4a" : "#5cf29a"}>
    <div style={{ fontSize: 40, letterSpacing: 4, color: "#8e99a3" }}>COMPARADOR DE FREQUÊNCIAS</div>
    <div style={{ fontSize: 44, marginTop: 16, color: "#ffd166" }}>VOZ HUMANA</div>
    <svg width={800} height={120} viewBox="0 0 800 120"><polyline points={onda(t, 34, 0)} stroke="#ffd166" strokeWidth={7} fill="none" /></svg>
    <div style={{ fontSize: 44, color: "#ff5a4a", opacity: p > 0.3 ? 1 : 0.2 }}>SINAL DAS TORRES</div>
    <svg width={800} height={120} viewBox="0 0 800 120" style={{ opacity: p > 0.3 ? 1 : 0.2 }}><polyline points={onda(t, 34, (1 - sobe(p, 0.3, 0.6)) * 3)} stroke="#ff5a4a" strokeWidth={7} fill="none" /></svg>
    <div style={{ fontSize: 70, marginTop: 10, textAlign: "center", color: "#ff5a4a", opacity: p > 0.6 ? (Math.sin(t * 10) > -0.4 ? 1 : 0.5) : 0 }}>RASTREADOR ACIONADO</div>
  </Painel>
);

const Diagrama = ({ t, p }: { t: number; p: number }) => {
  const erro = p > 0.42;
  return (
    <Painel cor={erro ? "#ff5a4a" : "#5cf29a"} top={240}>
      <div style={{ fontSize: 40, letterSpacing: 4, color: "#8e99a3" }}>GRAVAÇÃO DE EMERGÊNCIA · REDE DE ALERTA</div>
      <svg width={820} height={640} viewBox="0 0 820 640" style={{ marginTop: 10 }}>
        <g transform="translate(130 150)">
          <rect x={-70} y={-40} width={140} height={110} fill="#3d6fa3" /><path d="M-90 -40 L0 -110 L90 -40Z" fill="#e07a6a" />
          <text x={10} y={130} textAnchor="middle" fontFamily={FONT} fontSize={40} fill="#fff">SOCORRO</text>
        </g>
        <path d="M230 150 L360 150" stroke="#ffd166" strokeWidth={10} strokeDasharray="18 14" strokeDashoffset={-t * 80} />
        <g transform="translate(430 150)">
          <path d="M-40 70 L0 -110 L40 70 M-26 10 L26 10" stroke="#cfd6e0" strokeWidth={10} fill="none" />
          <text x={0} y={130} textAnchor="middle" fontFamily={FONT} fontSize={40} fill="#fff">TORRE</text>
        </g>
        <path d="M500 150 L630 150" stroke={erro ? "#ff5a4a" : "#5cf29a"} strokeWidth={10} strokeDasharray="18 14" strokeDashoffset={-t * 80} />
        <g transform="translate(720 150)">
          <circle r={62} fill="none" stroke={erro ? "#ff5a4a" : "#5cf29a"} strokeWidth={10} />
          <text x={0} y={22} textAnchor="middle" fontFamily={FONT} fontSize={64} fill={erro ? "#ff5a4a" : "#5cf29a"}>{erro ? "!" : "✓"}</text>
          <text x={0} y={130} textAnchor="middle" fontFamily={FONT} fontSize={40} fill="#fff">{erro ? "FAROL" : "ALERTA"}</text>
        </g>
        {erro && (
          <g>
            <text x={410} y={380} textAnchor="middle" fontFamily={FONT} fontSize={76} fill="#ff5a4a" opacity={Math.sin(t * 9) > -0.4 ? 1 : 0.5}>ERRO NO SISTEMA</text>
            {[0, 1, 2, 3].map((i) => {
              const v = sobe(p, 0.55 + i * 0.05, 0.95);
              return <path key={i} d="M-50 0 L0 -26 L50 0 L20 0 L0 30 L-20 0Z" transform={`translate(${120 + i * 190 + (720 - 120 - i * 190) * v * 0.8} ${520 - v * 200}) scale(${1 - v * 0.3})`} fill="#0a0e16" stroke="#7ef0ff" strokeWidth={5} />;
            })}
            <text x={410} y={620} textAnchor="middle" fontFamily={FONT} fontSize={44} fill="#fff">AS CRIATURAS SEGUEM O FAROL</text>
          </g>
        )}
      </svg>
    </Painel>
  );
};

const sobre = ({ t, shot }: Contexto) => {
  switch (shot.id) {
    case "rastreador": return <Frequencias t={t} p={dentro(t, "rastreador")} />;
    case "erro": return <Diagrama t={t} p={dentro(t, "erro")} />;
    default: return null;
  }
};

const fx = ({ t }: Contexto) => ({
  impacto: Math.max(decai(t, P.sombras.de + 0.6, 0.5), decai(t, T_SALTO + 0.8, 0.8), decai(t, T_CHAVE, 0.6)),
  flash: Math.max(decai(t, 1.25, 0.3), decai(t, T_CHAVE, 0.4)),
  clarao: Math.max(decai(t, P.torres.de, 0.3) * 0.4, decai(t, P.manha.de, 0.8)),
  claraoCor: "#fff6dc",
});

export const Silencio = () => (
  <Episodio
    manifesto={manifesto} shots={SHOTS} blocos={BLOCOS} preto={PRETO} elenco={ELENCO} vinheta={0.6}
    cenario={cenario} sobre={sobre} itens={itens} frente={frente} fx={fx}
    corLegenda={() => "#ffffff"}
    final={() => (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", color: "#e8e4dc", fontFamily: FONT, fontSize: 90, letterSpacing: 10 }}>FIM</AbsoluteFill>
    )}
    sons={
      <>
        <Som fps={FPS} em={1.4} src="abismo/sfx/musica.mp3" volume={0.26} dur={manifesto.duracao - 1.4} some={1.6} />
        <Som fps={FPS} em={P.sombras.de + 0.5} src="mare01/sfx/gritos.mp3" volume={0.3} dur={1.4} some={0.4} />
        <Som fps={FPS} em={P.sombras.de + 0.9} src="labirinto/sfx/robos.mp3" volume={0.5} dur={P.irmaos.de - P.sombras.de - 0.9} some={0.4} />
        <Som fps={FPS} em={T_CHIA} src="ep01/sfx/estatica.mp3" volume={0.8} />
        <Som fps={FPS} em={T_CHIA + 1.3} src="ep01/sfx/estatica.mp3" volume={0.7} />
        <Som fps={FPS} em={T_SALTO} src="abismo/sfx/criatura.mp3" volume={0.7} dur={P.descobre.de - T_SALTO} some={0.5} />
        <Som fps={FPS} em={T_SALTO + 0.8} src="ep02/sfx/metal.mp3" volume={0.8} />
        <Som fps={FPS} em={P.torres.de} src="futuro/sfx/pulso.mp3" volume={0.6} dur={P.rastreador.de - P.torres.de} some={0.4} />
        <Som fps={FPS} em={P.rastreador.de + 0.5} src="futuro/sfx/bipes.mp3" volume={0.5} dur={2.4} some={0.3} />
        <Som fps={FPS} em={P.chega.de} src="mare01/sfx/vento.mp3" volume={0.4} dur={P.transmissores.de - P.chega.de} some={0.3} />
        <Som fps={FPS} em={P.transmissores.de} src="tempo/sfx/central.mp3" volume={0.45} dur={T_CHAVE - P.transmissores.de} some={0.3} />
        <Som fps={FPS} em={P.erro.de + 2.2} src="tempo/sfx/alarmes.mp3" volume={0.35} dur={P.socorro.de - P.erro.de - 2.2} some={0.4} />
        <Som fps={FPS} em={P.socorro.de + 1.3} src="labirinto/sfx/robos.mp3" volume={0.6} dur={P.desliga.de - P.socorro.de - 1.3} some={0.4} />
        <Som fps={FPS} em={T_CHAVE} src="cidade/sfx/desliga.mp3" volume={0.9} dur={2.4} some={0.5} />
        <Som fps={FPS} em={P.mapa.de + 0.5} src="trem/sfx/brilho.mp3" volume={0.6} />
        <Som fps={FPS} em={P.farol.de} src="mare01/sfx/praia.mp3" volume={0.5} dur={P.manha.de - P.farol.de} some={0.8} />
        <Som fps={FPS} em={P.seguem.de} src="labirinto/sfx/robos.mp3" volume={0.5} dur={P.manha.de - P.seguem.de} some={1} />
        <Som fps={FPS} em={P.manha.de} src="mare01/sfx/aves.mp3" volume={0.5} />
        <Som fps={FPS} em={P.nenhuma.de} src="mare01/sfx/aves.mp3" volume={0.4} />
        <Som fps={FPS} em={P.falar.de + 0.6} src="tempo/sfx/cidade.mp3" volume={0.3} dur={PRETO - P.falar.de - 0.6} some={1.5} />
      </>
    }
  />
);

export const SILENCIO_DURACAO = Math.round(manifesto.duracao * FPS);
export const SILENCIO_FPS = FPS;
