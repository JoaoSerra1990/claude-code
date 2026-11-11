import { AbsoluteFill, interpolate } from "remotion";
import manifestoJson from "./manifest.json";
import { COLORS, FONT } from "../theme";
import type { Visual } from "../serie/Ator";
import {
  Episodio, Som, decai, est as e, sobe, tempos,
  type Bloco, type Contexto, type Manifesto, type Shot,
} from "../serie/motor";
import { Banco, Estacao, JANELAS, RELOGIO_ESTACAO, Vagao, type Vista } from "./cenarios";

// O Trem das 3h17 — curta independente.
// Neblina azul do lado de fora, luz dourada dentro do trem. O trem não leva
// pessoas: leva as vidas que poderiam ter existido.

const manifesto = manifestoJson as Manifesto;
const FPS = manifesto.fps;
const PRETO = manifestoJson.preto;
const { ini, fim, pal } = tempos(manifesto);

const ELENCO: Record<string, Visual> = {
  Clara: { pele: "#e8b995", cabelo: "#5a2e1c", roupa: "#7b3f52", calca: "#2b2f3b", estilo: "longo", casaco: true, bolsa: "#3b2414" },
  Miguel: { pele: "#e2b08a", cabelo: "#5a2e1c", roupa: "#3f5a4a", detalhe: "#d9d2c0", calca: "#30343f", estilo: "curto", barbaCor: "#4a2a1a" },
  Cobrador: { pele: "#d9d0c6", cabelo: "#c9a23a", detalhe: "#1f2a44", roupa: "#1f2a44", calca: "#161d30", estilo: "gorro", casaco: true, sobrancelha: "#7d828c" },
};

const BLOCOS: Record<string, Bloco> = {
  plataforma: { Clara: e(700, 1800, 0.8, "medo", [-0.7, -0.3]) },
  vagao: {
    Clara: e(260, 1760, 0.8, "medo", [1, -0.2]),
    Miguel: e(850, 1600, 0.8, "triste", [0, 1]),
  },
  juntos: {
    Clara: e(640, 1760, 0.8, "medo", [1, -0.3]),
    Miguel: e(850, 1600, 0.8, "medo", [-1, 0.2]),
  },
  cobrador: {
    Cobrador: e(170, 1780, 0.86, "sereno", [1, 0], "apontarDir"),
    Clara: e(640, 1760, 0.8, "medo", [-1, 0]),
    Miguel: e(850, 1600, 0.8, "triste", [-1, 0.4]),
  },
  sentados: {
    Clara: e(600, 1610, 0.8, "triste", [1, 0]),
    Miguel: e(850, 1600, 0.8, "triste", [-1, 0]),
  },
};

const ROSTO_CLARA: [number, number] = [260, 1208];
const ROSTO_CLARA_PERTO: [number, number] = [640, 1208];
const ROSTO_CLARA_SENTADA: [number, number] = [600, 1058];
const ROSTO_MIGUEL: [number, number] = [850, 1048];
const [RX, RY] = RELOGIO_ESTACAO;
const T_FIM = fim("12");

const SHOTS: Shot[] = [
  // 00–10 s | O trem impossível
  { id: "estacao", de: 0, ate: pal("01", "mas") - 0.1, fundo: "estacao", luz: "noite",
    cam: [[540, 1010, 1.0], [540, 960, 1.15]] },
  { id: "relogio", de: pal("01", "mas") - 0.1, ate: pal("01", "um") - 0.1, fundo: "estacao", luz: "noite",
    cam: [[RX, RY, 2.4], [RX, RY, 3.0]] },
  { id: "trem_surge", de: pal("01", "um") - 0.1, ate: pal("01", "naquela") - 0.2, fundo: "estacao", luz: "noite",
    cam: [[540, 1060, 1.0], [540, 1040, 1.1]] },
  { id: "clara_decide", de: pal("01", "naquela") - 0.2, ate: fim("01") + 0.4, fundo: "estacao", bloco: "plataforma", luz: "noite",
    cam: [[650, 1240, 1.6], [620, 1250, 2.1]], at: { Clara: { x: 780, xPara: 640 } } },

  // 10–23 s | A passageira
  { id: "entra", de: fim("01") + 0.4, ate: pal("02", "e") - 0.1, fundo: "vagao", bloco: "vagao", luz: "dourada",
    cam: [[540, 1160, 1.0], [500, 1170, 1.15]], at: { Clara: { x: -120, xPara: 260 } } },
  { id: "ultimo_banco", de: pal("02", "e") - 0.1, ate: fim("02") + 0.3, fundo: "vagao", bloco: "vagao", luz: "dourada",
    cam: [[740, 1130, 1.6], [850, 1070, 2.4]] },
  { id: "clara_reconhece", de: fim("02") + 0.3, ate: fim("03") + 0.5, fundo: "vagao", bloco: "vagao", luz: "dourada",
    cam: [[ROSTO_CLARA[0], ROSTO_CLARA[1], 2.6], [ROSTO_CLARA[0], ROSTO_CLARA[1], 2.9]], at: { Clara: { expr: "surpreso" } } },

  // 23–37 s | O reencontro
  { id: "miguel_ergue", de: fim("03") + 0.5, ate: fim("04") + 0.4, fundo: "vagao", bloco: "vagao", luz: "dourada",
    cam: [[ROSTO_MIGUEL[0], ROSTO_MIGUEL[1], 2.6], [ROSTO_MIGUEL[0], ROSTO_MIGUEL[1], 2.9]], at: { Miguel: { expr: "medo", olhar: [-1, 0.2] } } },
  { id: "tenta_abracar", de: fim("04") + 0.4, ate: pal("05", "mas") - 0.1, fundo: "vagao", bloco: "vagao", luz: "dourada",
    cam: [[560, 1180, 1.4], [720, 1150, 1.7]],
    at: { Clara: { xPara: 640, pose: "abracar", expr: "triste" }, Miguel: { expr: "medo", olhar: [-1, 0.2] } } },
  { id: "aponta", de: pal("05", "mas") - 0.1, ate: pal("05", "do") - 0.1, fundo: "vagao", bloco: "juntos", luz: "dourada",
    cam: [[700, 1060, 1.5], [680, 1000, 1.6]], at: { Miguel: { pose: "apontarCima", olhar: [-0.6, -1] }, Clara: { olhar: [-0.3, -1] } } },
  { id: "cidade", de: pal("05", "do") - 0.1, ate: pal("05", "carros") - 0.3, fundo: "vagao", bloco: "juntos", luz: "dourada",
    cam: [[JANELAS[1][0], JANELAS[1][1] - 20, 1.9], [JANELAS[1][0], JANELAS[1][1] - 40, 2.3]] },
  { id: "carros", de: pal("05", "carros") - 0.3, ate: fim("05") + 0.4, fundo: "vagao", bloco: "juntos", luz: "dourada",
    cam: [[JANELAS[1][0], JANELAS[1][1] + 170, 3.1], [JANELAS[1][0], JANELAS[1][1] + 175, 3.5]] },

  // 37–51 s | O bilhete
  { id: "cobrador", de: fim("05") + 0.4, ate: pal("06", "apenas") - 0.1, fundo: "vagao", bloco: "cobrador", luz: "dourada",
    cam: [[200, 1200, 2.1], [190, 1190, 2.5]] },
  { id: "bilhete", de: pal("06", "apenas") - 0.1, ate: fim("06") + 0.7, fundo: "vagao", bloco: "cobrador", luz: "dourada",
    cam: [[640, 1300, 1.8], [640, 1300, 1.9]] },
  { id: "miguel_explica", de: fim("06") + 0.7, ate: pal("07", "vidas") - 0.6, fundo: "vagao", bloco: "juntos", luz: "dourada",
    cam: [[745, 1130, 1.8], [750, 1120, 2.0]], at: { Miguel: { expr: "triste", olhar: [-1, 0.3] } } },
  { id: "janelas_mudam", de: pal("07", "vidas") - 0.6, ate: fim("07") + 0.4, fundo: "vagao", bloco: "juntos", luz: "dourada",
    cam: [[540, 920, 1.05], [540, 860, 1.25]], at: { Clara: { olhar: [-0.4, -1] }, Miguel: { expr: "triste", olhar: [-0.6, -1] } } },

  // 51–65 s | A verdade
  { id: "vida_medica", de: fim("07") + 0.4, ate: pal("08", "sete") - 0.1, fundo: "vagao", luz: "dourada",
    cam: [[JANELAS[0][0], JANELAS[0][1], 2.3], [JANELAS[0][0], JANELAS[0][1], 2.7]] },
  { id: "vida_mae", de: pal("08", "sete") - 0.1, ate: pal("08", "entrado") - 0.1, fundo: "vagao", luz: "dourada",
    cam: [[JANELAS[1][0], JANELAS[1][1], 2.3], [JANELAS[1][0], JANELAS[1][1], 2.7]] },
  { id: "vida_viajante", de: pal("08", "entrado") - 0.1, ate: pal("08", "escolhido") - 0.1, fundo: "vagao", luz: "dourada",
    cam: [[JANELAS[2][0], JANELAS[2][1], 2.3], [JANELAS[2][0], JANELAS[2][1], 2.7]] },
  { id: "vida_juntos", de: pal("08", "escolhido") - 0.1, ate: pal("08", "sua") - 0.1, fundo: "vagao", luz: "dourada",
    cam: [[JANELAS[1][0], JANELAS[1][1], 2.2], [JANELAS[1][0], JANELAS[1][1] + 20, 2.9]] },
  { id: "clara_compreende", de: pal("08", "sua") - 0.1, ate: fim("08") + 0.4, fundo: "vagao", bloco: "juntos", luz: "dourada",
    cam: [[ROSTO_CLARA_PERTO[0], ROSTO_CLARA_PERTO[1], 2.5], [ROSTO_CLARA_PERTO[0], ROSTO_CLARA_PERTO[1], 2.9]],
    at: { Clara: { expr: "triste", lagrima: true, olhar: [0, -0.6] } } },

  // 65–78 s | A decisão
  { id: "ultima_parada", de: fim("08") + 0.4, ate: ini("09") - 0.15, fundo: "vagao", bloco: "cobrador", luz: "dourada",
    cam: [[200, 1150, 2.0], [200, 1140, 2.3]], at: { Cobrador: { pose: "apontarCima", olhar: [0.6, 0] } } },
  { id: "miguel_mao", de: ini("09") - 0.15, ate: fim("09") + 0.3, fundo: "vagao", bloco: "sentados", luz: "dourada",
    cam: [[725, 1120, 1.9], [725, 1110, 2.3]],
    at: { Miguel: { pose: "apontarEsq", olhar: [-1, 0] }, Clara: { pose: "apontarDir", lagrima: true } } },
  { id: "quase_aceita", de: fim("09") + 0.3, ate: pal("10", "mas") - 0.1, fundo: "vagao", bloco: "sentados", luz: "dourada",
    cam: [[ROSTO_CLARA_SENTADA[0], ROSTO_CLARA_SENTADA[1] + 80, 2.0], [ROSTO_CLARA_SENTADA[0], ROSTO_CLARA_SENTADA[1] + 80, 2.1]],
    at: { Clara: { olhar: [0, 1], lagrima: true } } },
  { id: "olha_irmao", de: pal("10", "mas") - 0.1, ate: fim("10") + 0.3, fundo: "vagao", bloco: "sentados", luz: "dourada",
    cam: [[ROSTO_CLARA_SENTADA[0], ROSTO_CLARA_SENTADA[1], 2.6], [ROSTO_CLARA_SENTADA[0], ROSTO_CLARA_SENTADA[1], 2.8]], at: { Clara: { lagrima: true } } },
  { id: "pergunta", de: fim("10") + 0.3, ate: fim("11") + 0.4, fundo: "vagao", bloco: "sentados", luz: "dourada",
    cam: [[ROSTO_CLARA_SENTADA[0], ROSTO_CLARA_SENTADA[1], 2.8], [ROSTO_CLARA_SENTADA[0], ROSTO_CLARA_SENTADA[1], 3.1]], at: { Clara: { lagrima: true } } },

  // 78–90 s | A última parada
  { id: "miguel_abaixa", de: fim("11") + 0.4, ate: ini("12") - 0.6, fundo: "vagao", bloco: "sentados", luz: "dourada",
    cam: [[ROSTO_MIGUEL[0], ROSTO_MIGUEL[1], 2.7], [ROSTO_MIGUEL[0], ROSTO_MIGUEL[1], 3.0]], at: { Miguel: { olhar: [0, 1], lagrima: true } } },
  { id: "compreende", de: ini("12") - 0.6, ate: ini("12") - 0.05, fundo: "vagao", bloco: "sentados", luz: "dourada",
    cam: [[ROSTO_CLARA_SENTADA[0], ROSTO_CLARA_SENTADA[1], 2.9], [ROSTO_CLARA_SENTADA[0], ROSTO_CLARA_SENTADA[1], 3.0]], at: { Clara: { fechado: true, lagrima: true } } },
  { id: "marca", de: ini("12") - 0.05, ate: pal("12", "não") - 0.1, fundo: "vagao", bloco: "sentados", luz: "dourada",
    cam: [[ROSTO_CLARA_SENTADA[0], ROSTO_CLARA_SENTADA[1] + 80, 2.0], [ROSTO_CLARA_SENTADA[0], ROSTO_CLARA_SENTADA[1] + 80, 2.1]],
    at: { Clara: { olhar: [0, 1], lagrima: true } } },
  { id: "desce", de: pal("12", "não") - 0.1, ate: pal("12", "mas") - 0.1, fundo: "estacao", bloco: "plataforma", luz: "noite",
    cam: [[600, 1260, 1.4], [660, 1270, 1.6]], at: { Clara: { x: 520, xPara: 700, expr: "triste", lagrima: true, olhar: [0.6, 0.4] } } },
  { id: "olha_trem", de: pal("12", "mas") - 0.1, ate: T_FIM + 0.5, fundo: "estacao", bloco: "plataforma", luz: "noite",
    cam: [[720, 1120, 1.4], [790, 980, 2.0]], at: { Clara: { expr: "triste", lagrima: true, olhar: [0.4, -1] } } },
  { id: "some", de: T_FIM + 0.5, ate: T_FIM + 2.4, fundo: "estacao", bloco: "plataforma", luz: "noite",
    cam: [[540, 1060, 1.0], [540, 1050, 1.08]], at: { Clara: { expr: "triste", olhar: [-0.4, -0.6] } } },
  { id: "obrigado", de: T_FIM + 2.4, ate: PRETO, fundo: "estacao", bloco: "plataforma", luz: "noite",
    cam: [[700, 1300, 2.0], [700, 1300, 2.1]], at: { Clara: { expr: "surpreso", olhar: [0, 1], lagrima: true } } },
];

const plano = (id: string) => SHOTS.find((s) => s.id === id)!;
const P_SURGE = plano("trem_surge"), P_DECIDE = plano("clara_decide"), P_ENTRA = plano("entra"), P_APONTA = plano("aponta");
const P_COBRADOR = plano("cobrador"), P_BILHETE = plano("bilhete"), P_MUDAM = plano("janelas_mudam"), P_JUNTOS = plano("vida_juntos");
const P_PARADA = plano("ultima_parada"), P_QUASE = plano("quase_aceita"), P_MARCA = plano("marca");
const P_DESCE = plano("desce"), P_OLHA = plano("olha_trem"), P_SOME = plano("some"), P_OBRIGADO = plano("obrigado");

const cenario = ({ t, shot }: Contexto) => {
  if (shot.fundo === "estacao") {
    const volta = t >= P_DESCE.de;
    return (
      <Estacao t={t}
        chegada={volta ? 1 : 1 - (1 - sobe(t, P_SURGE.de, P_SURGE.ate)) ** 2}
        porta={volta ? 1 - sobe(t, P_OLHA.de + 0.3, P_OLHA.de + 1.3) : sobe(t, P_DECIDE.de + 0.3, P_DECIDE.de + 1.5)}
        presenca={t < P_SURGE.de ? 0 : 1 - sobe(t, P_SOME.de, P_SOME.ate - 0.3)}
        naJanela={volta ? ELENCO.Miguel : undefined} />
    );
  }
  // As visões somem quando o cobrador anuncia a última parada.
  const vista: Vista = t < P_APONTA.de || t >= P_PARADA.de ? "neblina" : t < P_MUDAM.de + 0.5 ? "cidade" : "vidas";
  const brilho = Math.max(decai(t, P_APONTA.de, 0.6), decai(t, P_MUDAM.de + 0.5, 0.9), sobe(t, P_MUDAM.de, P_MUDAM.de + 0.5) * (t < P_MUDAM.de + 0.5 ? 1 : 0), decai(t, P_JUNTOS.de, 0.7), decai(t, P_PARADA.de, 0.8));
  return (
    <Vagao t={t} vista={vista} brilho={brilho} juntos={t >= P_JUNTOS.de}
      pisca={t < P_ENTRA.de + 2.4 ? 1 : 0} vidas={{ clara: ELENCO.Clara, miguel: ELENCO.Miguel }} />
  );
};

const itens = ({ shot }: Contexto) =>
  shot.fundo === "vagao"
    ? [230, 540, 850].map((x) => ({ y: 1640, el: <Banco key={`banco${x}`} x={x} /> }))
    : [];

// O bilhete dourado, em primeiro plano.
const Bilhete = ({ t, destaque, marcado, obrigado }: { t: number; destaque: boolean; marcado: number; obrigado: number }) => {
  const caixa = (rotulo: string, aceso: boolean, ok: number) => (
    <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 26, opacity: 1 }}>
      <div style={{ width: 84, height: 84, border: "8px solid #3d2c12", borderRadius: 12, background: aceso ? "#fff3c8" : "transparent", boxShadow: aceso ? "0 0 40px #fff3c8" : "none", position: "relative" }}>
        {ok > 0 && (
          <svg width={110} height={110} style={{ position: "absolute", left: -10, top: -26 }}>
            <path d="M14 62 L44 92 L100 18" fill="none" stroke="#a01414" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={170} strokeDashoffset={170 * (1 - ok)} />
          </svg>
        )}
      </div>
      <div style={{ fontSize: 116, letterSpacing: 6 }}>{rotulo}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "rgba(8,6,2,0.5)", alignItems: "center" }}>
      <div style={{ marginTop: 430, width: 860, padding: "44px 60px 54px", boxSizing: "border-box", background: "linear-gradient(135deg, #f3d57a, #d9a93a 60%, #f0cf72)", border: "8px solid #3d2c12", borderRadius: 26, color: "#3d2c12", fontFamily: FONT, transform: `rotate(${-3 + Math.sin(t * 1.4)}deg)`, boxShadow: "0 0 90px rgba(255,217,138,0.55)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 40, letterSpacing: 6, opacity: 0.8 }}>
          <span>BILHETE ÚNICO</span><span>3H17</span>
        </div>
        <div style={{ height: 6, background: "#3d2c12", margin: "18px 0 6px", opacity: 0.6 }} />
        {caixa("FICAR", destaque, 0)}
        {caixa("VOLTAR", false, marcado)}
        {obrigado > 0 && (
          <div style={{ marginTop: 34, overflow: "hidden", width: `${obrigado * 100}%`, whiteSpace: "nowrap", fontFamily: "Georgia, 'DejaVu Serif', serif", fontStyle: "italic", fontSize: 62, color: "#1c2a55", transform: "rotate(-2deg)" }}>
            Obrigado. — Miguel
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

const sobre = ({ t, shot }: Contexto) => {
  if (shot.id === "bilhete") return <Bilhete t={t} destaque={false} marcado={0} obrigado={0} />;
  if (shot.id === "quase_aceita") return <Bilhete t={t} destaque={sobe(t, P_QUASE.de + 0.5, P_QUASE.de + 0.9) > 0.5} marcado={0} obrigado={0} />;
  if (shot.id === "marca") return <Bilhete t={t} destaque={false} marcado={sobe(t, P_MARCA.de + 0.5, P_MARCA.de + 1.0)} obrigado={0} />;
  if (shot.id === "obrigado") return <Bilhete t={t} destaque={false} marcado={1} obrigado={sobe(t, P_OBRIGADO.de + 0.7, P_OBRIGADO.de + 2.1)} />;
  return null;
};

const fx = ({ t }: Contexto) => {
  const entra = decai(t, P_ENTRA.de, 0.7), sai = decai(t, P_DESCE.de, 0.6);
  return entra > 0 ? { clarao: entra, claraoCor: "#ffe7a8" } : { clarao: sai * 0.9, claraoCor: "#cfe0ff" };
};

const Final = ({ t }: { t: number }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 80px", textAlign: "center", fontFamily: FONT, color: "#eef1f6", fontSize: 76, lineHeight: 1.24, opacity: interpolate(t, [PRETO + 0.6, PRETO + 1.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
    <div>
      VOCÊ ESCOLHERIA UMA VIDA<br />
      <span style={{ color: "#e8c35a" }}>SEM SOFRIMENTO</span>,<br />
      MESMO QUE PRECISASSE<br />
      ESQUECER ALGUÉM QUE AMA?
    </div>
  </AbsoluteFill>
);

const S = "trem/sfx/";
const DENTRO = P_DESCE.de - P_ENTRA.de;

export const Trem = () => (
  <Episodio
    manifesto={manifesto} shots={SHOTS} blocos={BLOCOS} preto={PRETO} elenco={ELENCO} vinheta={0.62}
    cenario={cenario} itens={itens} sobre={sobre} fx={fx} final={(t) => <Final t={t} />}
    corLegenda={(p) => (p === "Narrador" ? "#fff3d6" : p === "Cobrador" ? "#e8c35a" : COLORS.white)}
    sons={
      <>
        {/* música até o trem sumir; depois, silêncio na revelação */}
        <Som fps={FPS} em={0} src={`${S}musica.mp3`} volume={0.3} dur={P_SOME.ate - 0.2} some={1.8} />
        <Som fps={FPS} em={0} src={`${S}noite.mp3`} volume={0.5} dur={Math.min(13.8, P_ENTRA.de)} some={0.6} />
        <Som fps={FPS} em={P_DECIDE.de + 0.3} src={`${S}porta.mp3`} volume={0.7} />
        <Som fps={FPS} em={P_ENTRA.de} src="ep01/sfx/luz.mp3" volume={0.5} />
        {[0, 1, 2, 3].map((i) =>
          i * 19.5 < DENTRO ? (
            <Som key={i} fps={FPS} em={P_ENTRA.de + i * 19.5} src={`${S}trilhos.mp3`} volume={0.32} dur={Math.min(20, DENTRO - i * 19.5)} some={0.5} />
          ) : null,
        )}
        <Som fps={FPS} em={P_APONTA.de} src={`${S}brilho.mp3`} volume={0.5} />
        <Som fps={FPS} em={P_COBRADOR.de} src={`${S}sineta.mp3`} volume={0.6} />
        <Som fps={FPS} em={P_BILHETE.de} src={`${S}brilho.mp3`} volume={0.4} />
        <Som fps={FPS} em={P_MUDAM.de} src={`${S}brilho.mp3`} volume={0.6} />
        <Som fps={FPS} em={P_JUNTOS.de} src={`${S}brilho.mp3`} volume={0.5} />
        <Som fps={FPS} em={P_PARADA.de} src={`${S}sineta.mp3`} volume={0.7} />
        <Som fps={FPS} em={P_MARCA.de + 0.5} src={`${S}caneta.mp3`} volume={0.9} />
        <Som fps={FPS} em={P_DESCE.de} src={`${S}noite.mp3`} volume={0.45} dur={P_SOME.ate - P_DESCE.de} some={1.5} />
      </>
    }
  />
);

export const TREM_DURACAO = Math.round(manifesto.duracao * FPS);
export const TREM_FPS = FPS;
