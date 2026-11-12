import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import manifestoJson from "./manifest.json";
import { FONT } from "../theme";
import { Ator, type Visual } from "../serie/Ator";
import {
  Episodio, Som, decai, est as e, sobe, tempos,
  type Bloco, type Contexto, type Manifesto, type Shot,
} from "../serie/motor";
import { Ceu, Escola, EstacaoAtm, Limite, Nevoa, PESSOAS, Rua } from "./cenarios";

// Quando a Névoa Chegou — curta narrado.

const manifesto = manifestoJson as Manifesto;
const FPS = manifesto.fps;
const PRETO = manifestoJson.preto;
const { fim, pal } = tempos(manifesto);

const MATEUS: Visual = { pele: "#c68a5e", cabelo: "#17110e", roupa: "#b5532e", casaco: true, calca: "#2a2f3a", estilo: "curto", barbaCor: "#17110e" };
const FILHA: Visual = { pele: "#c68a5e", cabelo: "#17110e", roupa: "#e9b730", calca: "#3a4a63", estilo: "rabo", mochila: "#3d6fa3" };
const ELENCO: Record<string, Visual> = { Mateus: MATEUS, Mascarado: { ...MATEUS, mascara: "#dfe6ec" }, Filha: FILHA };

const BLOCOS: Record<string, Bloco> = {
  porta: { Mateus: e(300, 1830, 0.72, "medo", [0.6, 0.6]) },
  mascara: { Mascarado: e(300, 1830, 0.72, "firme", [0.8, 0]) },
  corre: { Mascarado: e(300, 1850, 0.56, "firme", [1, 0]) },
  toca: { Mascarado: e(400, 1840, 0.62, "desconfiado", [1, -0.2], "apontarDir") },
  ceu: { Mascarado: e(540, 1880, 0.46, "surpreso", [0, -1]) },
  radio: { Mascarado: e(400, 1830, 0.72, "firme", [0.4, 0.7]) },
  estacao: { Mascarado: e(560, 1850, 0.58, "medo", [-0.8, -0.6]) },
  escola: { Mateus: e(360, 1850, 0.66, "feliz", [1, 0.3], "abracar"), Filha: e(520, 1860, 0.42, "feliz", [-1, -0.6], "abracar") },
};
const R = (b: string, n: string): [number, number] => [BLOCOS[b][n].x, BLOCOS[b][n].y - 690 * BLOCOS[b][n].s];
const R_PORTA = R("porta", "Mateus"), R_RADIO = R("radio", "Mascarado"), R_PAI = R("escola", "Mateus");
const S1 = 0.46 + (PESSOAS[1][1] - 1560) / 1200;
const R_EST: [number, number] = [PESSOAS[1][0], PESSOAS[1][1] - 690 * S1];
const R_MULHER: [number, number] = [PESSOAS[0][0], PESSOAS[0][1] - 690 * 0.46];

const SHOTS: Shot[] = [
  // 00–12 s | As estátuas
  { id: "chega", de: 0, ate: pal("01", "quem") - 0.2, fundo: "rua", luz: "normal",
    cam: [[540, 1100, 1.0], [600, 1250, 1.2]] },
  { id: "estatua", de: pal("01", "quem") - 0.2, ate: pal("01", "em") - 0.2, fundo: "rua", luz: "normal",
    cam: [[R_MULHER[0] - 120, R_MULHER[1] + 150, 1.9], [R_MULHER[0] - 40, R_MULHER[1] + 40, 2.9]] },
  { id: "tranca", de: pal("01", "em") - 0.2, ate: fim("01") + 0.6, fundo: "rua", luz: "normal",
    cam: [[540, 1300, 1.2], [540, 800, 1.3]] },

  // 12–25 s | O pai
  { id: "filha", de: fim("01") + 0.6, ate: pal("02", "vestiu") - 0.2, fundo: "rua", bloco: "porta", luz: "normal",
    cam: [[R_PORTA[0] + 60, R_PORTA[1] + 60, 1.8], [R_PORTA[0] + 60, R_PORTA[1] + 60, 2.1]] },
  { id: "mascara", de: pal("02", "vestiu") - 0.2, ate: pal("02", "saiu") - 0.2, fundo: "rua", bloco: "mascara", luz: "normal",
    cam: [[R_PORTA[0], R_PORTA[1], 2.6], [R_PORTA[0], R_PORTA[1], 3.0]] },
  { id: "desvia", de: pal("02", "saiu") - 0.2, ate: fim("02") + 0.6, fundo: "rua", bloco: "corre", luz: "normal", tremor: 4,
    cam: [[420, 1500, 1.4], [480, 1500, 1.5]], at: { Mascarado: { x: 200, xPara: 460 } } },

  // 25–38 s | A pista
  { id: "toca", de: fim("02") + 0.6, ate: pal("03", "percebeu") - 0.2, fundo: "rua", bloco: "toca", luz: "normal",
    cam: [[520, 1450, 1.6], [560, 1420, 1.9]], at: { Mascarado: { x: 150, xPara: 400 } } },
  { id: "respira", de: pal("03", "percebeu") - 0.2, ate: pal("03", "névoa") - 0.2, fundo: "rua", bloco: "toca", luz: "normal",
    cam: [[R_EST[0], R_EST[1] + 30, 3.0], [R_EST[0], R_EST[1] + 30, 3.5]], at: { Mascarado: { oculto: true } } },
  { id: "suspensao", de: pal("03", "névoa") - 0.2, ate: fim("03") + 0.6, fundo: "rua", bloco: "toca", luz: "normal",
    cam: [[560, 1450, 1.8], [540, 1350, 1.05]], at: { Mascarado: { expr: "surpreso", pose: "parado", olhar: [0.6, 0] } } },

  // 38–52 s | O céu
  { id: "abertura", de: fim("03") + 0.6, ate: pal("04", "onde") - 0.2, fundo: "ceu", bloco: "ceu", luz: "normal",
    cam: [[540, 1500, 1.5], [540, 800, 1.0]] },
  { id: "queimam", de: pal("04", "onde") - 0.2, ate: fim("04") + 0.6, fundo: "limite", luz: "normal", tremor: 4,
    cam: [[300, 1100, 1.4], [760, 1150, 1.3]] },

  // 52–65 s | A revelação
  { id: "radio", de: fim("04") + 0.6, ate: pal("05", "névoa") - 0.4, fundo: "rua", bloco: "radio", luz: "normal",
    cam: [[R_RADIO[0] + 40, R_RADIO[1] + 160, 1.9], [R_RADIO[0] + 40, R_RADIO[1] + 100, 2.3]] },
  { id: "defesa", de: pal("05", "névoa") - 0.4, ate: pal("05", "ela") - 0.2, fundo: "rua", bloco: "radio", luz: "normal",
    cam: [[R_RADIO[0] + 40, R_RADIO[1] + 100, 2.3], [R_RADIO[0] + 40, R_RADIO[1] + 100, 2.4]] },
  { id: "imoveis", de: pal("05", "ela") - 0.2, ate: fim("05") + 0.6, fundo: "rua", bloco: "radio", luz: "normal",
    cam: [[R_RADIO[0] + 40, R_RADIO[1] + 100, 2.4], [R_RADIO[0] + 40, R_RADIO[1] + 100, 2.5]] },

  // 65–78 s | O risco
  { id: "energia", de: fim("05") + 0.6, ate: pal("06", "mateus") - 0.2, fundo: "estacao", luz: "normal", tremor: 2,
    cam: [[300, 900, 1.2], [260, 1090, 2.4]] },
  { id: "gerador", de: pal("06", "mateus") - 0.2, ate: pal("06", "ligou") - 0.2, fundo: "estacao", bloco: "estacao", luz: "normal", tremor: 3,
    cam: [[560, 1400, 1.3], [640, 1420, 1.5]], at: { Mascarado: { x: -200, xPara: 480, olhar: [1, 0], expr: "firme" } } },
  { id: "bateria", de: pal("06", "ligou") - 0.2, ate: fim("06") + 0.8, fundo: "estacao", bloco: "estacao", luz: "normal", tremor: 3,
    cam: [[760, 1450, 1.6], [540, 1150, 1.0]], at: { Mascarado: { x: 480, pose: "apontarDir", expr: "bravo", olhar: [1, 0.3] } } },

  // 78–90 s | Depois da tempestade
  { id: "clareou", de: fim("06") + 0.8, ate: pal("07", "névoa") - 0.5, fundo: "ceuLimpo", luz: "dia",
    cam: [[540, 900, 1.1], [540, 700, 1.0]] },
  { id: "despertam", de: pal("07", "névoa") - 0.5, ate: pal("07", "mateus") - 0.2, fundo: "ruaDesperta", luz: "dia",
    cam: [[700, 1450, 1.6], [540, 1350, 1.1]] },
  { id: "encontra", de: pal("07", "mateus") - 0.2, ate: pal("07", "parecia") - 0.4, fundo: "escola", bloco: "escola", luz: "dia",
    cam: [[540, 1350, 1.1], [460, 1450, 1.6]],
    at: { Mateus: { x: -150, xPara: 360, pose: "parado", olhar: [1, 0] }, Filha: { x: 540, y: 1560, s: 0.3, xPara: 520, yPara: 1860, sPara: 0.42, pose: "parado" } } },
  { id: "abraco", de: pal("07", "parecia") - 0.4, ate: pal("07", "havia") - 0.2, fundo: "escola", bloco: "escola", luz: "dia",
    cam: [[R_PAI[0] + 70, R_PAI[1] + 60, 2.2], [R_PAI[0] + 70, R_PAI[1] + 60, 2.6]], at: { Mateus: { fechado: true, lagrima: true }, Filha: { fechado: true } } },
  { id: "salvou", de: pal("07", "havia") - 0.2, ate: PRETO, fundo: "ruaFinal", bloco: "escola", luz: "dia",
    cam: [[480, 1500, 1.5], [540, 1000, 1.0]], at: { Mateus: { expr: "feliz", olhar: [0.6, 0.4] }, Filha: { expr: "feliz", olhar: [-0.6, -0.6] } } },
];

const P = Object.fromEntries(SHOTS.map((s) => [s.id, s]));
const dentro = (t: number, id: string) => sobe(t, P[id].de, P[id].ate);
const T_LIGA = P.bateria.de + 1.5;

const cenario = ({ t, shot }: Contexto) => {
  switch (shot.fundo) {
    case "ceu": return <Ceu t={t} abre={dentro(t, "abertura")} />;
    case "ceuLimpo": {
      const p = dentro(t, "clareou");
      return <Rua t={t} nevoa={1 - p * 0.6} claro={p} pulsos persianas={1 - p} />;
    }
    case "limite": return <Limite t={t} queima={sobe(t, P.queimam.de + 0.4, P.queimam.de + 2)} />;
    case "estacao": {
      const cabo = sobe(t, P.bateria.de + 0.3, T_LIGA), en = shot.id === "bateria" ? 0.08 + 0.92 * sobe(t, T_LIGA, T_LIGA + 1.4) : 0.14 - 0.06 * dentro(t, "energia");
      return <EstacaoAtm t={t} energia={en} cabo={shot.id === "bateria" ? cabo : 0} forca={shot.id === "bateria" ? 0.2 + 0.8 * sobe(t, T_LIGA, T_LIGA + 1.4) : 0.25} />;
    }
    case "ruaDesperta": { const p = dentro(t, "despertam"); return <Rua t={t} nevoa={0.4 * (1 - p)} claro={1} desperta={p} persianas={0} />; }
    case "ruaFinal": return <Rua t={t} nevoa={0} claro={1} desperta={1} persianas={0} />;
    case "escola": return <Escola t={t} />;
    default: break;
  }
  switch (shot.id) {
    case "chega": return <Rua t={t} nevoa={1} frente={dentro(t, "chega") * 0.75} congela={dentro(t, "chega") * 0.2} persianas={0} />;
    case "estatua": return <Rua t={t} nevoa={1} frente={0.75 + 0.25 * dentro(t, "estatua")} congela={0.2 + 0.5 * dentro(t, "estatua")} persianas={0} />;
    case "tranca": return <Rua t={t} persianas={dentro(t, "tranca") * 1.2} />;
    case "desvia": return <Rua t={t} rola={dentro(t, "desvia") * 900} />;
    case "suspensao": return <Rua t={t} pulsos />;
    default: return <Rua t={t} />;
  }
};

const itens = ({ t, shot }: Contexto) => {
  const item = (el: ReactNode) => [{ y: 2000, el }];
  switch (shot.id) {
    case "filha": return item(
      <g key="f" transform={`translate(${R_PORTA[0] + 150} ${R_PORTA[1] + 230}) rotate(-6)`}>
        <rect x={-70} y={-110} width={140} height={220} rx={16} fill="#14181e" stroke="#8e99a3" strokeWidth={5} />
        <rect x={-58} y={-96} width={116} height={160} fill="#bfe3f5" />
        <g transform="translate(0 130) scale(0.24)"><Ator v={FILHA} t={t} expr="feliz" /></g>
        <rect x={-58} y={64} width={116} height={34} fill="#14181e" /><text x={0} y={90} textAnchor="middle" fontFamily={FONT} fontSize={26} fill="#fff">FILHA</text>
      </g>,
    );
    case "respira": return item(
      <g key="r" transform={`translate(${R_EST[0] + 6} ${R_EST[1] + 46})`}>
        {[0, 1, 2].map((i) => { const v = (t * 0.5 + i / 3) % 1; return <circle key={i} cx={30 + v * 70} cy={-v * 30} r={8 + v * 26} fill="#fff" opacity={(1 - v) * 0.7} />; })}
      </g>,
    );
    case "radio": case "defesa": case "imoveis": return item(
      <g key="rd" transform={`translate(${R_RADIO[0] + 110} ${R_RADIO[1] + 250})`}>
        <rect x={-40} y={-80} width={80} height={160} rx={12} fill="#2b323d" stroke="#14181e" strokeWidth={6} />
        <rect x={-28} y={-64} width={56} height={40} fill="#5cf29a" opacity={0.8} /><line x1={24} y1={-80} x2={36} y2={-190} stroke="#8e99a3" strokeWidth={7} />
        {[0, 1, 2].map((i) => <circle key={i} cy={-20} r={50 + ((t * 140 + i * 70) % 210)} fill="none" stroke="#5cf29a" strokeWidth={6} opacity={0.6 - ((t * 140 + i * 70) % 210) / 400} />)}
      </g>,
    );
    default: return [];
  }
};

const frente = ({ t, shot }: Contexto) => (shot.fundo === "ceu" ? <Nevoa t={t} n={0.5} y0={1500} /> : null);

// ---------- sobreposições ----------
const Painel = ({ children, cor = "#5cf29a", top = 240 }: { children: ReactNode; cor?: string; top?: number }) => (
  <AbsoluteFill style={{ alignItems: "center" }}>
    <div style={{ marginTop: top, width: 900, boxSizing: "border-box", padding: "28px 38px", background: "rgba(12,18,24,0.93)", border: `5px solid ${cor}`, borderRadius: 16, boxShadow: `0 0 60px ${cor}55`, color: "#e8e4dc", fontFamily: FONT }}>
      {children}
    </div>
  </AbsoluteFill>
);

const Pulso = ({ t }: { t: number }) => (
  <Painel cor="#ff8a8a" top={230}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ fontSize: 60 }}>PULSO <span style={{ color: "#ff8a8a" }}>38 BPM</span></div>
      <div style={{ fontSize: 44, color: "#5cf29a" }}>RESPIRANDO</div>
    </div>
    <svg width={820} height={120} viewBox="0 0 820 120">
      <polyline points={Array.from({ length: 82 }, (_, i) => { const k = (i + Math.floor(t * 14)) % 41; return `${i * 10},${k === 20 ? 14 : k === 21 ? 106 : k === 22 ? 44 : 60}`; }).join(" ")} stroke="#ff8a8a" strokeWidth={6} fill="none" />
    </svg>
  </Painel>
);

const Mapa = ({ t, p, parte }: { t: number; p: number; parte: 1 | 2 }) => (
  <Painel>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 38, letterSpacing: 4, color: "#5cf29a" }}><span>TRANSMISSÃO DE RÁDIO</span><span style={{ opacity: Math.sin(t * 6) > 0 ? 1 : 0.3 }}>● AO VIVO</span></div>
    <svg width={820} height={520} viewBox="0 0 820 520" style={{ marginTop: 10 }}>
      <rect width={820} height={520} fill="#0a1a24" />
      {Array.from({ length: 28 }, (_, i) => <rect key={i} x={60 + (i % 7) * 104} y={210 + Math.floor(i / 7) * 74} width={70} height={46} fill="#27475c" />)}
      {/* estação liberando a névoa em forma de cúpula */}
      <g transform="translate(410 200)">
        <path d="M-40 60 L0 -70 L40 60Z" fill="#cfd6dc" /><circle cy={-80} r={14} fill="#5cf29a" />
        <text x={0} y={-110} textAnchor="middle" fontFamily={FONT} fontSize={34} fill="#fff">ESTAÇÃO ATMOSFÉRICA</text>
      </g>
      <ellipse cx={410} cy={360} rx={380 * Math.min(1, p * 2)} ry={200 * Math.min(1, p * 2)} fill="#dfe6ea" opacity={0.3} stroke="#fff" strokeWidth={5} strokeDasharray="16 12" />
      {parte === 2 && Array.from({ length: 14 }, (_, i) => {
        const v = (t * 0.5 + i / 14) % 1, x = 40 + i * 56;
        const y = v * 200;
        return <g key={i}><line x1={x} y1={y - 40} x2={x + 10} y2={y} stroke="#ffb347" strokeWidth={5} /><circle cx={x + 10} cy={y} r={7} fill="#fff3b0" />{v > 0.85 && <circle cx={x + 10} cy={y} r={18} fill="none" stroke="#fff" strokeWidth={4} />}</g>;
      })}
      {parte === 2 && [200, 410, 620].map((x, i) => (
        <g key={x} transform={`translate(${x} 400)`} style={{ filter: "grayscale(1)" }}>
          <g transform="scale(0.14) translate(0 380)"><Ator v={MATEUS} t={2 + i} expr="neutro" andando fase={i} /></g>
        </g>
      ))}
    </svg>
    <div style={{ fontSize: 56, marginTop: 10, textAlign: "center", color: "#ffd166" }}>{parte === 1 ? "A NÉVOA É UMA DEFESA" : "IMÓVEIS ATÉ A TEMPESTADE PASSAR"}</div>
  </Painel>
);

const sobre = ({ t, shot }: Contexto) => {
  switch (shot.id) {
    case "respira": return <Pulso t={t} />;
    case "defesa": return <Mapa t={t} p={dentro(t, "defesa")} parte={1} />;
    case "imoveis": return <Mapa t={t} p={1} parte={2} />;
    default: return null;
  }
};

const fx = ({ t }: Contexto) => ({
  impacto: Math.max(decai(t, P.queimam.de + 0.5, 0.8), decai(t, T_LIGA, 0.8)),
  flash: Math.max(decai(t, P.mascara.de + 0.5, 0.3), decai(t, T_LIGA, 0.5)),
  clarao: Math.max(decai(t, P.clareou.de, 0.8), decai(t, P.encontra.de, 0.4) * 0.6),
  claraoCor: "#fff6dc",
});

export const NevoaChegou = () => (
  <Episodio
    manifesto={manifesto} shots={SHOTS} blocos={BLOCOS} preto={PRETO} elenco={ELENCO} vinheta={0.5}
    cenario={cenario} sobre={sobre} itens={itens} frente={frente} fx={fx}
    corLegenda={() => "#ffffff"}
    final={() => (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", color: "#e8e4dc", fontFamily: FONT, fontSize: 90, letterSpacing: 10 }}>FIM</AbsoluteFill>
    )}
    sons={
      <>
        <Som fps={FPS} em={0} src="nevoa/sfx/musica.mp3" volume={0.3} dur={manifesto.duracao} some={1.8} />
        <Som fps={FPS} em={0} src="mare01/sfx/vento.mp3" volume={0.45} dur={P.filha.de} some={0.6} />
        <Som fps={FPS} em={P.estatua.de + 1.6} src="tempo/sfx/apaga.mp3" volume={0.5} dur={2} some={0.4} />
        <Som fps={FPS} em={P.tranca.de + 0.3} src="mare02/sfx/janela.mp3" volume={0.6} />
        <Som fps={FPS} em={P.tranca.de + 1.2} src="ep01/sfx/porta.mp3" volume={0.6} />
        <Som fps={FPS} em={P.desvia.de} src="mare01/sfx/vento.mp3" volume={0.4} dur={P.respira.de - P.desvia.de} some={0.4} />
        <Som fps={FPS} em={P.respira.de + 0.3} src="ep02/sfx/bipe.mp3" volume={0.5} />
        <Som fps={FPS} em={P.respira.de + 1.4} src="ep02/sfx/bipe.mp3" volume={0.5} />
        <Som fps={FPS} em={P.suspensao.de + 0.6} src="trem/sfx/brilho.mp3" volume={0.6} />
        <Som fps={FPS} em={P.abertura.de + 0.5} src="futuro/sfx/portal.mp3" volume={0.6} dur={P.queimam.de - P.abertura.de} some={0.5} />
        <Som fps={FPS} em={P.queimam.de + 0.4} src="mare02/sfx/impacto.mp3" volume={0.5} dur={P.radio.de - P.queimam.de - 0.2} some={0.6} />
        <Som fps={FPS} em={P.radio.de} src="ep01/sfx/estatica.mp3" volume={0.6} />
        <Som fps={FPS} em={P.defesa.de} src="ep01/sfx/estatica.mp3" volume={0.35} />
        <Som fps={FPS} em={P.energia.de} src="tempo/sfx/alarmes.mp3" volume={0.35} dur={T_LIGA - P.energia.de} some={0.4} />
        <Som fps={FPS} em={P.bateria.de + 0.3} src="abismo/sfx/cabo.mp3" volume={0.6} />
        <Som fps={FPS} em={T_LIGA} src="trem/sfx/brilho.mp3" volume={0.8} />
        <Som fps={FPS} em={T_LIGA + 0.2} src="abismo/sfx/vapor.mp3" volume={0.7} dur={P.clareou.de - T_LIGA} some={0.5} />
        <Som fps={FPS} em={P.clareou.de + 0.6} src="mare01/sfx/aves.mp3" volume={0.5} />
        <Som fps={FPS} em={P.despertam.de + 0.8} src="tempo/sfx/cidade.mp3" volume={0.35} dur={PRETO - P.despertam.de - 0.8} some={1.5} />
        <Som fps={FPS} em={P.encontra.de} src="mare02/sfx/escola.mp3" volume={0.4} />
      </>
    }
  />
);

export const NEVOA_DURACAO = Math.round(manifesto.duracao * FPS);
export const NEVOA_FPS = FPS;
