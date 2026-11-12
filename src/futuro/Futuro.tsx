import { AbsoluteFill } from "remotion";
import manifestoJson from "./manifest.json";
import { FONT } from "../theme";
import { Ator, type Visual } from "../serie/Ator";
import {
  Episodio, Som, decai, est as e, sobe, tempos,
  type Bloco, type Contexto, type Manifesto, type Shot,
} from "../serie/motor";
import { Estacao } from "../trem/cenarios";
import { Chuva, CidadeFuturo, Instalacao, Laboratorio, Linha, Quarto, RuaChuva } from "../curtas/futurista";

// O Homem que Matou Seu Futuro — curta narrado sobre paradoxos temporais.

const manifesto = manifestoJson as Manifesto;
const FPS = manifesto.fps;
const PRETO = manifestoJson.preto;
const { fim, pal } = tempos(manifesto);

const GABRIEL: Visual = { pele: "#e2b08a", cabelo: "#5a3a22", roupa: "#23262f", casaco: true, calca: "#1c1f26", estilo: "curto" };
const VELHO: Visual = { pele: "#d9a888", cabelo: "#b9bcc2", roupa: "#3b3f4a", casaco: true, calca: "#22252e", estilo: "curto", cicatriz: true, barbaCor: "#c9ccd2", sobrancelha: "#9a9ea6" };
const MENINA: Visual = { pele: "#c99670", cabelo: "#2e211b", roupa: "#e9b730", casaco: true, calca: "#3a4a63", estilo: "cacheado" };
const ELENCO: Record<string, Visual> = {
  Gabriel: GABRIEL,
  Velho: VELHO,
  Menina: MENINA,
  Filha: { pele: "#c99670", cabelo: "#2e211b", roupa: "#f4f7f8", casaco: true, calca: "#2b2f3b", estilo: "cacheado" },
  Mulher: { pele: "#e8b995", cabelo: "#17110e", roupa: "#4a1f2e", casaco: true, calca: "#1c1f26", estilo: "longo" },
  Preso: { pele: "#c68a5e", cabelo: "#2e211b", roupa: "#b3402e", calca: "#b3402e", estilo: "curto" },
};

const BLOCOS: Record<string, Bloco> = {
  encontro: { Gabriel: e(360, 1790, 0.72, "medo", [1, -0.2]), Velho: e(740, 1790, 0.74, "sereno", [-1, -0.2]) },
  portal: { Preso: e(540, 1260, 0.34, "panico", [0, 0], "recuar") },
  quarto: { Gabriel: e(420, 1790, 0.72, "triste", [0.4, 0.3]) },
  missao: { Gabriel: e(540, 1780, 0.6, "firme", [0, 0]) },
  lab: { Filha: e(380, 1780, 0.74, "firme", [1, -0.6], "apontarDir") },
  linha: { Menina: e(540, 1780, 0.66, "feliz", [0, 0]) },
  rua: { Gabriel: e(320, 1790, 0.72, "desconfiado", [1, -0.2]), Mulher: e(740, 1790, 0.72, "sereno", [-1, -0.2], "abracar") },
};

const ROSTO_G: [number, number] = [360, 1293];
const ROSTO_V: [number, number] = [740, 1279];
const ROSTO_GQ: [number, number] = [420, 1293];

const SHOTS: Shot[] = [
  // 00–12 s | O trabalho proibido (gancho: o jovem diante de si mesmo, mais velho)
  { id: "gancho", de: 0, ate: pal("01", "viajar") - 0.3, fundo: "estacao", bloco: "encontro", luz: "noite",
    cam: [[550, 1290, 1.7], [550, 1290, 1.9]] },
  { id: "megacidade", de: pal("01", "viajar") - 0.3, ate: pal("01", "mas") - 0.2, fundo: "cidade", luz: "noite",
    cam: [[540, 700, 1.0], [540, 900, 1.2]] },
  { id: "instalacao", de: pal("01", "mas") - 0.2, ate: pal("01", "onde") - 0.2, fundo: "instalacao", luz: "noite",
    cam: [[540, 960, 1.0], [540, 960, 1.55]] },
  { id: "apagados", de: pal("01", "onde") - 0.2, ate: fim("01") + 0.3, fundo: "instalacao", bloco: "portal", luz: "noite", tremor: 3,
    cam: [[540, 1060, 2.0], [540, 1060, 2.3]], at: { Preso: { yPara: 1060, sPara: 0.18, dissolve: 0, dissolvePara: 1 } } },

  // 12–25 s | O executor
  { id: "gabriel", de: fim("01") + 0.3, ate: pal("02", "sua") - 0.2, fundo: "quarto", bloco: "quarto", luz: "noite",
    cam: [[420, 1400, 1.4], [ROSTO_GQ[0], ROSTO_GQ[1], 2.2]] },
  { id: "missao", de: pal("02", "sua") - 0.2, ate: pal("02", "até") - 0.2, fundo: "instalacao", bloco: "missao", luz: "noite",
    cam: [[540, 1300, 1.3], [540, 1350, 1.45]] },
  { id: "dossie", de: pal("02", "até") - 0.2, ate: fim("02") + 0.3, fundo: "quarto", bloco: "quarto", luz: "noite",
    cam: [[ROSTO_GQ[0], ROSTO_GQ[1], 2.2], [ROSTO_GQ[0], ROSTO_GQ[1], 2.3]] },

  // 25–38 s | O rosto conhecido
  { id: "foto_velho", de: fim("02") + 0.3, ate: pal("03", "mesmos") - 0.2, fundo: "quarto", bloco: "quarto", luz: "noite",
    cam: [[ROSTO_GQ[0], ROSTO_GQ[1], 2.2], [ROSTO_GQ[0], ROSTO_GQ[1], 2.3]] },
  { id: "jovem", de: pal("03", "mesmos") - 0.2, ate: pal("03", "arquivo") - 0.3, fundo: "quarto", bloco: "quarto", luz: "noite",
    cam: [[ROSTO_GQ[0], ROSTO_GQ[1] - 20, 3.4], [ROSTO_GQ[0], ROSTO_GQ[1] - 20, 3.9]], at: { Gabriel: { expr: "congelado", olhar: [0, 0] } } },
  { id: "arquivo", de: pal("03", "arquivo") - 0.3, ate: pal("03", "chegada") - 0.6, fundo: "quarto", bloco: "quarto", luz: "noite",
    cam: [[ROSTO_GQ[0], ROSTO_GQ[1], 2.2], [ROSTO_GQ[0], ROSTO_GQ[1], 2.3]] },
  { id: "chegada", de: pal("03", "chegada") - 0.6, ate: fim("03") + 0.4, fundo: "quarto", bloco: "quarto", luz: "noite",
    cam: [[ROSTO_GQ[0], ROSTO_GQ[1], 2.6], [ROSTO_GQ[0], ROSTO_GQ[1], 3.0]], at: { Gabriel: { expr: "medo", olhar: [0.6, 0.6] } } },

  // 38–51 s | O encontro
  { id: "estacao", de: fim("03") + 0.4, ate: pal("04", "mas") - 0.2, fundo: "estacao", bloco: "encontro", luz: "noite",
    cam: [[540, 1150, 1.0], [540, 1200, 1.12]], at: { Gabriel: { x: -120, xPara: 360 } } },
  { id: "nao_foge", de: pal("04", "mas") - 0.2, ate: pal("04", "apenas") - 0.2, fundo: "estacao", bloco: "encontro", luz: "noite",
    cam: [[ROSTO_V[0], ROSTO_V[1], 2.7], [ROSTO_V[0], ROSTO_V[1], 3.0]] },
  { id: "entrega", de: pal("04", "apenas") - 0.2, ate: pal("04", "apontou") - 0.3, fundo: "estacao", bloco: "encontro", luz: "noite",
    cam: [[550, 1340, 1.8], [550, 1340, 2.0]], at: { Velho: { pose: "apontarEsq" }, Gabriel: { pose: "apontarDir", olhar: [1, 0.4] } } },
  { id: "foto_menina", de: pal("04", "apontou") - 0.3, ate: fim("04") + 0.4, fundo: "estacao", bloco: "encontro", luz: "noite",
    cam: [[550, 1300, 1.8], [550, 1300, 1.85]] },

  // 51–64 s | A menina do futuro
  { id: "filha", de: fim("04") + 0.4, ate: pal("05", "futuro") - 0.6, fundo: "estacao", bloco: "encontro", luz: "noite",
    cam: [[ROSTO_G[0], ROSTO_G[1], 2.8], [ROSTO_G[0], ROSTO_G[1], 3.1]], at: { Gabriel: { expr: "surpreso", olhar: [0.3, 0.8] } } },
  { id: "laboratorio", de: pal("05", "futuro") - 0.6, ate: pal("05", "organização") - 0.3, fundo: "lab", bloco: "lab", luz: "normal",
    cam: [[540, 1100, 1.0], [560, 1120, 1.15]] },
  { id: "agentes", de: pal("05", "organização") - 0.3, ate: pal("05", "mas") - 0.2, fundo: "instalacao", luz: "noite",
    cam: [[540, 960, 1.1], [540, 960, 1.2]] },
  { id: "atonito", de: pal("05", "mas") - 0.2, ate: fim("05") + 0.4, fundo: "estacao", bloco: "encontro", luz: "noite",
    cam: [[ROSTO_G[0], ROSTO_G[1], 2.6], [ROSTO_G[0], ROSTO_G[1], 2.9]], at: { Gabriel: { expr: "triste", olhar: [1, 0] } } },

  // 64–77 s | O paradoxo
  { id: "tentou", de: fim("05") + 0.4, ate: pal("06", "em") - 0.2, fundo: "estacao", bloco: "encontro", luz: "noite",
    cam: [[ROSTO_V[0], ROSTO_V[1], 2.6], [ROSTO_V[0], ROSTO_V[1], 2.9]], at: { Velho: { expr: "triste", olhar: [-1, 0.2] } } },
  ...[0, 1, 2, 3].map((k): Shot => {
    const de0 = pal("06", "em") - 0.2, ate0 = pal("06", "até") - 0.2, d = (ate0 - de0) / 4;
    return {
      id: `linha${k}`, de: de0 + k * d, ate: de0 + (k + 1) * d, fundo: `linha${k}`, bloco: "linha", luz: "normal",
      cam: [[540, 1300, 1.25], [540, 1300, 1.35]],
      at: { Menina: { x: 360 + k * 120, expr: k % 2 ? "sereno" : "feliz", dissolve: 0, dissolvePara: 1 } },
    };
  }),
  { id: "descobre", de: pal("06", "até") - 0.2, ate: pal("06", "organização") - 0.3, fundo: "estacao", bloco: "encontro", luz: "noite",
    cam: [[ROSTO_G[0], ROSTO_G[1], 2.7], [ROSTO_G[0], ROSTO_G[1], 3.1]], at: { Gabriel: { expr: "congelado", olhar: [0, 1] } } },
  { id: "rastreador", de: pal("06", "organização") - 0.3, ate: fim("06") + 0.4, fundo: "estacao", bloco: "encontro", luz: "noite",
    cam: [[ROSTO_G[0], ROSTO_G[1] + 120, 2.2], [ROSTO_G[0], ROSTO_G[1] + 120, 2.3]] },

  // 77–90 s | A última escolha
  { id: "destroi", de: fim("06") + 0.4, ate: pal("07", "imediatamente") - 0.2, fundo: "estacao", bloco: "encontro", luz: "noite", tremor: 3,
    cam: [[ROSTO_G[0], ROSTO_G[1] + 120, 2.2], [ROSTO_G[0], ROSTO_G[1] + 120, 2.3]], at: { Gabriel: { expr: "bravo", olhar: [0, 1] } } },
  { id: "desaparece", de: pal("07", "imediatamente") - 0.2, ate: pal("07", "naquela") - 0.3, fundo: "estacao", bloco: "encontro", luz: "noite",
    cam: [[640, 1300, 1.8], [ROSTO_V[0], ROSTO_V[1], 2.4]],
    at: { Velho: { expr: "feliz", olhar: [-1, 0], dissolve: 0, dissolvePara: 1 }, Gabriel: { expr: "surpreso", olhar: [1, -0.2] } } },
  { id: "rua", de: pal("07", "naquela") - 0.3, ate: pal("07", "verso") - 0.4 - 0.2, fundo: "rua", bloco: "rua", luz: "noite",
    cam: [[540, 1300, 1.2], [600, 1280, 1.5]] },
  { id: "verso", de: pal("07", "verso") - 0.4 - 0.2, ate: PRETO, fundo: "rua", bloco: "rua", luz: "noite",
    cam: [[740, 1300, 2.0], [740, 1300, 2.1]] },
];

const plano = (id: string) => SHOTS.find((s) => s.id === id)!;
const P_DOSSIE = plano("dossie"), P_FOTOV = plano("foto_velho"), P_ARQ = plano("arquivo"), P_CHEG = plano("chegada");
const P_FOTOM = plano("foto_menina"), P_AGENTES = plano("agentes"), P_RAST = plano("rastreador"), P_DESTROI = plano("destroi");
const P_DESAP = plano("desaparece"), P_VERSO = plano("verso");
const T_ESMAGA = P_DESTROI.de + 1.4;
const T_PAI = pal("07", "“pai") - 0.2;

const cenario = ({ t, shot }: Contexto) => {
  if (shot.fundo === "cidade") return <CidadeFuturo t={t} noite multidao={false} />;
  if (shot.fundo === "instalacao") return <Instalacao t={t} />;
  if (shot.fundo === "quarto") return <Quarto t={t} />;
  if (shot.fundo === "lab") return <Laboratorio t={t} />;
  if (shot.fundo === "rua") return <RuaChuva t={t} />;
  if (shot.fundo.startsWith("linha")) return <Linha t={t} k={Number(shot.fundo.slice(5))} />;
  return (
    <g>
      <Estacao t={t} chegada={0} porta={0} presenca={0} />
      <Chuva t={t} />
    </g>
  );
};

// ---------- painéis e objetos em primeiro plano ----------
const Holograma = ({ children, top = 360 }: { children: React.ReactNode; top?: number }) => (
  <AbsoluteFill style={{ alignItems: "center", background: "rgba(2,6,16,0.35)" }}>
    <div style={{ marginTop: top, width: 880, boxSizing: "border-box", padding: "36px 44px", background: "rgba(16,60,90,0.55)", border: "4px solid #7ef0ff", borderRadius: 18, boxShadow: "0 0 70px rgba(126,240,255,0.35)", color: "#d8fbff", fontFamily: FONT }}>
      {children}
    </div>
  </AbsoluteFill>
);

const Retrato = ({ v, t, borrado = 0, w = 360, h = 420 }: { v: Visual; t: number; borrado?: number; w?: number; h?: number }) => (
  <div style={{ width: w, height: h, overflow: "hidden", border: "4px solid #7ef0ff", background: "#0a2030", position: "relative" }}>
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ filter: `blur(${borrado * 18}px)` }}>
      <g transform={`translate(${w / 2} ${h + 380}) scale(0.92)`}><Ator v={v} t={t} expr="sereno" fase={1} /></g>
    </svg>
    <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(126,240,255,0.12) 0 3px, transparent 3px 7px)" }} />
  </div>
);

const Dossie = ({ t, revela, dados, contagem }: { t: number; revela: number; dados: boolean; contagem?: string }) => (
  <Holograma>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 34, letterSpacing: 4, opacity: 0.85 }}>
      <span>DOSSIÊ SIGILOSO</span><span style={{ color: "#ff8a5f" }}>PRÓXIMO ALVO</span>
    </div>
    <div style={{ display: "flex", gap: 36, marginTop: 26, alignItems: "flex-start" }}>
      <Retrato v={VELHO} t={t} borrado={1 - revela} />
      <div style={{ fontSize: 42, lineHeight: 1.5, opacity: dados ? 1 : 0.25 }}>
        <div>NOME: {dados ? "GABRIEL" : "████"}</div>
        <div>IDADE: {dados ? "63" : "██"}</div>
        <div>SINAL: CICATRIZ</div>
        {contagem && <div style={{ color: "#ff8a5f", fontSize: 64, marginTop: 14 }}>CHEGADA {contagem}</div>}
      </div>
    </div>
  </Holograma>
);

const FotoMenina = ({ t, verso, texto }: { t: number; verso: number; texto: React.ReactNode }) => {
  const escalaX = Math.abs(Math.cos(verso * Math.PI));
  return (
    <AbsoluteFill style={{ alignItems: "center", background: "rgba(2,4,10,0.45)" }}>
      <div style={{ marginTop: 420, width: 760, height: 900, transform: `rotate(-3deg) scaleX(${escalaX})`, background: "#f1ead8", border: "6px solid #2b211a", boxSizing: "border-box", padding: 34 }}>
        {verso < 0.5 ? (
          <svg width={680} height={820} viewBox="0 0 680 820">
            <rect width={680} height={820} fill="#9fc0d8" />
            <rect y={560} width={680} height={260} fill="#8ab17d" />
            <g transform="translate(340 1300) scale(0.98)"><Ator v={MENINA} t={t} expr="feliz" fase={3} /></g>
          </svg>
        ) : (
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: "'DejaVu Serif', Georgia, serif", fontStyle: "italic", fontSize: 76, lineHeight: 1.3, color: "#1f2a55" }}>
            {texto}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

const Rastreador = ({ t, quebra }: { t: number; quebra: number }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: "rgba(2,4,10,0.4)" }}>
    <svg width={760} height={760} viewBox="-380 -380 760 760" style={{ marginTop: -200 }}>
      <rect x={-300} y={-160} width={600} height={320} rx={60} fill="#1c2230" stroke="#3b4652" strokeWidth={14} />
      <rect x={-380} y={-70} width={90} height={140} fill="#2b3346" /><rect x={290} y={-70} width={90} height={140} fill="#2b3346" />
      <circle r={110} fill="#0a0d18" stroke={quebra > 0 ? "#5a5f6a" : "#ff4a3a"} strokeWidth={10} opacity={quebra > 0 ? 1 : 0.7 + 0.3 * Math.sin(t * 8)} />
      {/* emblema da organização: uma ampulheta dentro de um olho */}
      <path d="M-80 0 Q0 -70 80 0 Q0 70 -80 0Z" fill="none" stroke={quebra > 0 ? "#5a5f6a" : "#ff4a3a"} strokeWidth={8} />
      <path d="M-26 -34 L26 -34 L-26 34 L26 34Z" fill={quebra > 0 ? "#5a5f6a" : "#ff4a3a"} />
      {quebra > 0 && (
        <g stroke="#e8f6ff" strokeWidth={6} fill="none">
          <path d="M-60 -150 L-10 -40 L-50 20 L10 150" /><path d="M90 -140 L40 -20 L120 60" />
          {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={Math.cos(i) * 200 * quebra} cy={Math.sin(i * 1.7) * 200 * quebra} r={8} fill="#ffd166" stroke="none" opacity={1 - quebra} />)}
        </g>
      )}
    </svg>
  </AbsoluteFill>
);

const PainelAlvo = ({ t }: { t: number }) => (
  <Holograma top={300}>
    <div style={{ fontSize: 36, letterSpacing: 4, color: "#ff8a5f" }}>ALVO PRIORITÁRIO · ELIMINAR ANTES DO NASCIMENTO</div>
    <div style={{ display: "flex", gap: 30, marginTop: 24 }}>
      <Retrato v={MENINA} t={t} w={300} h={360} />
      <Retrato v={{ ...MENINA, roupa: "#f4f7f8" }} t={t} w={300} h={360} />
    </div>
  </Holograma>
);

const sobre = ({ t, shot }: Contexto) => {
  switch (shot.id) {
    case "dossie": return <Dossie t={t} revela={0} dados={false} />;
    case "foto_velho": return <Dossie t={t} revela={sobe(t, P_FOTOV.de, P_FOTOV.ate - 0.4)} dados={false} />;
    case "arquivo": return <Dossie t={t} revela={1} dados={sobe(t, P_ARQ.de, P_ARQ.de + 0.8) > 0.5} />;
    case "chegada": {
      const resta = Math.max(0, 300 - Math.floor((t - P_CHEG.de) * 12));
      return <Dossie t={t} revela={1} dados contagem={`${String(Math.floor(resta / 60)).padStart(2, "0")}:${String(resta % 60).padStart(2, "0")}`} />;
    }
    case "foto_menina": return <FotoMenina t={t} verso={sobe(t, pal("04", "verso") - 0.3, pal("04", "verso") + 0.2)} texto={<span>14 · MARÇO · 2089<br /><span style={{ fontSize: 48 }}>(amanhã)</span></span>} />;
    case "agentes": return <PainelAlvo t={t} />;
    case "rastreador": return <Rastreador t={t} quebra={0} />;
    case "destroi": return <Rastreador t={t} quebra={sobe(t, T_ESMAGA, T_ESMAGA + 0.6)} />;
    case "verso": return <FotoMenina t={t} verso={sobe(t, P_VERSO.de + 0.6, P_VERSO.de + 1.1)} texto="Pai, desta vez não confie na mamãe." />;
    default: return null;
  }
};

// A foto passando de mão em mão, e a que a mulher carrega.
const itens = ({ shot }: Contexto) => {
  const foto = (x: number, y: number) => ({
    y: 2000,
    el: (
      <g key="foto" transform={`translate(${x} ${y}) rotate(-8)`}>
        <rect x={-34} y={-44} width={68} height={88} fill="#f1ead8" stroke="#2b211a" strokeWidth={4} />
        <rect x={-26} y={-36} width={52} height={60} fill="#9fc0d8" />
      </g>
    ),
  });
  if (shot.id === "entrega") return [foto(560, 1440)];
  if (shot.id === "rua") return [foto(740, 1400)];
  return [];
};

const fx = ({ t }: Contexto) => ({
  impacto: Math.max(decai(t, T_ESMAGA, 0.5), decai(t, plano("apagados").de + 1.5, 0.5)),
  flash: decai(t, T_ESMAGA, 0.4),
  clarao: Math.max(...[0, 1, 2, 3].map((k) => decai(t, plano(`linha${k}`).de, 0.25))) * 0.7,
  claraoCor: "#e8f6ff",
});

const S = "futuro/sfx/";

export const Futuro = () => (
  <Episodio
    manifesto={manifesto} shots={SHOTS} blocos={BLOCOS} preto={PRETO} elenco={ELENCO} vinheta={0.62}
    cenario={cenario} sobre={sobre} itens={itens} fx={fx}
    corLegenda={() => "#e8f6ff"}
    sons={
      <>
        {/* trilha até a frase final; depois, silêncio */}
        <Som fps={FPS} em={0} src={`${S}musica.mp3`} volume={0.28} dur={T_PAI} some={0.8} />
        <Som fps={FPS} em={0} src={`${S}chuva.mp3`} volume={0.4} dur={plano("megacidade").de} some={0.3} />
        <Som fps={FPS} em={plano("megacidade").de} src={`${S}pulso.mp3`} volume={0.6} />
        <Som fps={FPS} em={plano("instalacao").de} src={`${S}portal.mp3`} volume={0.6} />
        <Som fps={FPS} em={P_DOSSIE.de} src={`${S}bipes.mp3`} volume={0.6} />
        <Som fps={FPS} em={P_CHEG.de} src={`${S}tique.mp3`} volume={0.7} />
        <Som fps={FPS} em={plano("estacao").de} src={`${S}chuva.mp3`} volume={0.45} dur={15.8} some={0.5} />
        <Som fps={FPS} em={plano("estacao").de + 15.6} src={`${S}chuva.mp3`} volume={0.45} dur={plano("laboratorio").de - plano("estacao").de - 15.6} some={0.4} />
        <Som fps={FPS} em={P_AGENTES.de} src={`${S}bipes.mp3`} volume={0.5} />
        <Som fps={FPS} em={plano("linha0").de} src={`${S}glitch.mp3`} volume={0.7} />
        <Som fps={FPS} em={plano("tentou").de} src={`${S}chuva.mp3`} volume={0.4} dur={plano("linha0").de - plano("tentou").de} some={0.3} />
        <Som fps={FPS} em={plano("descobre").de} src={`${S}chuva.mp3`} volume={0.4} dur={plano("rua").de - plano("descobre").de} some={0.4} />
        <Som fps={FPS} em={P_RAST.de} src={`${S}bipes.mp3`} volume={0.5} />
        <Som fps={FPS} em={T_ESMAGA} src={`${S}esmaga.mp3`} volume={1} />
        <Som fps={FPS} em={P_DESAP.de + 0.6} src={`${S}dissolve.mp3`} volume={0.8} />
        <Som fps={FPS} em={plano("rua").de} src={`${S}rua.mp3`} volume={0.5} dur={T_PAI - plano("rua").de} some={0.6} />
      </>
    }
  />
);

export const FUTURO_DURACAO = Math.round(manifesto.duracao * FPS);
export const FUTURO_FPS = FPS;
