import { AbsoluteFill } from "remotion";
import manifestoJson from "./manifest.json";
import { FONT } from "../theme";
import { Ator, type Visual } from "../serie/Ator";
import {
  Episodio, Som, decai, est as e, sobe, tempos,
  type Bloco, type Contexto, type Manifesto, type Shot,
} from "../serie/motor";
import { Cabine, CeuCabo, Guardiao, Lanterna, Panorama, Subsolo, Vale, noCabo } from "./cenarios";

// O Abismo — o que vive lá embaixo. Curta narrado.

const manifesto = manifestoJson as Manifesto;
const FPS = manifesto.fps;
const PRETO = manifestoJson.preto;
const { fim, pal } = tempos(manifesto);

const DAVI: Visual = { pele: "#e2b08a", cabelo: "#3a2a1e", roupa: "#55663f", casaco: true, calca: "#2a2f3a", estilo: "baguncado", barbaCor: "#3a2a1e" };
const LARA: Visual = { pele: "#c68a5e", cabelo: "#17110e", roupa: "#b5532e", casaco: true, calca: "#262a35", estilo: "rabo" };
const ELENCO: Record<string, Visual> = { Davi: DAVI, Lara: LARA };

const BLOCOS: Record<string, Bloco> = {
  leste: { Davi: e(330, 1790, 0.72, "triste", [0.3, 0.2]) },
  oeste: { Lara: e(700, 1790, 0.72, "panico", [-0.6, -0.2], "apontarEsq") },
  chegada: { Lara: e(400, 1790, 0.72, "medo", [1, 0]), Davi: e(760, 1790, 0.72, "firme", [-1, 0]) },
  cabo: { Davi: e(540, 1500, 0.8, "medo", [-0.3, 0.9], "alcancar") },
  subsolo: { Lara: e(440, 1790, 0.6, "medo", [0.4, -0.8]), Davi: e(650, 1790, 0.6, "medo", [-0.4, -0.8]) },
  vale: { Davi: e(300, 1800, 0.62, "feliz", [0.5, -0.5]), Lara: e(790, 1800, 0.62, "feliz", [-0.5, -0.5]) },
};
const R_DAVI: [number, number] = [330, 1293];
const R_LARA: [number, number] = [700, 1293];

const SHOTS: Shot[] = [
  // 00–12 s | A coisa na neblina (gancho: algo colossal se move sob as torres)
  { id: "gancho", de: 0, ate: pal("01", "não") - 0.2, fundo: "panorama", luz: "noite", tremor: 2,
    cam: [[540, 1420, 1.7], [540, 960, 1.0]] },
  { id: "coisa", de: pal("01", "não") - 0.2, ate: fim("01") + 0.3, fundo: "panorama", luz: "noite", tremor: 3,
    cam: [[540, 1300, 1.3], [540, 1480, 2.2]] },

  // 12–25 s | A mensagem
  { id: "sozinho", de: fim("01") + 0.3, ate: pal("02", "até") - 0.2, fundo: "leste", bloco: "leste", luz: "noite",
    cam: [[540, 1000, 1.0], [R_DAVI[0] + 40, R_DAVI[1], 2.0]] },
  { id: "luz", de: pal("02", "até") - 0.2, ate: pal("02", "uma") - 0.1, fundo: "leste", bloco: "leste", luz: "noite",
    cam: [[R_DAVI[0], R_DAVI[1], 2.6], [R_DAVI[0], R_DAVI[1], 2.9]], at: { Davi: { expr: "surpreso", olhar: [0.9, -0.7] } } },
  { id: "piscou", de: pal("02", "uma") - 0.1, ate: pal("02", "era") - 0.2, fundo: "panorama", luz: "noite",
    cam: [[420, 620, 1.7], [230, 540, 3.0]] },
  { id: "binoculo", de: pal("02", "era") - 0.2, ate: pal("02", "tentando") - 0.2, fundo: "leste", bloco: "leste", luz: "noite",
    cam: [[540, 960, 1.0], [540, 960, 1.0]] },
  { id: "resposta", de: pal("02", "tentando") - 0.2, ate: fim("02") + 0.3, fundo: "leste", bloco: "leste", luz: "noite",
    cam: [[430, 1320, 1.7], [400, 1300, 2.0]], at: { Davi: { expr: "feliz", pose: "apontarDir", olhar: [0.6, -0.3] } } },

  // 25–38 s | O pedido de socorro
  { id: "desespero", de: fim("02") + 0.3, ate: pal("03", "algo") - 0.2, fundo: "oeste", bloco: "oeste", luz: "noite", tremor: 4,
    cam: [[620, 1320, 1.7], [R_LARA[0] - 40, R_LARA[1], 2.4]] },
  { id: "garras", de: pal("03", "algo") - 0.2, ate: pal("03", "sensores") - 0.5, fundo: "panorama", luz: "noite", tremor: 5,
    cam: [[400, 1280, 2.2], [330, 900, 2.0]] },
  { id: "sensores", de: pal("03", "sensores") - 0.5, ate: fim("03") + 0.4, fundo: "oeste", bloco: "oeste", luz: "noite", tremor: 3,
    cam: [[640, 1180, 1.9], [680, 1120, 2.4]], at: { Lara: { expr: "congelado", pose: "parado", olhar: [0, -0.9] } } },

  // 38–52 s | A travessia
  { id: "ordens", de: fim("03") + 0.4, ate: pal("04", "davi") - 0.2, fundo: "leste", bloco: "leste", luz: "noite",
    cam: [[520, 1180, 1.6], [R_DAVI[0], R_DAVI[1], 2.7]], at: { Davi: { expr: "bravo", olhar: [0.8, -0.6], nega: true } } },
  { id: "lanca", de: pal("04", "davi") - 0.2, ate: pal("04", "começou") - 0.3, fundo: "panorama", luz: "noite",
    cam: [[800, 540, 2.3], [300, 540, 2.3]] },
  { id: "travessia", de: pal("04", "começou") - 0.3, ate: pal("04", "mas") - 0.2, fundo: "panorama", luz: "noite",
    cam: [[760, 560, 3.0], [700, 590, 3.0]] },
  { id: "metade", de: pal("04", "mas") - 0.2, ate: pal("04", "criatura") - 0.3, fundo: "panorama", luz: "noite", tremor: 3,
    cam: [[620, 620, 2.6], [540, 1050, 1.4]] },
  { id: "emerge", de: pal("04", "criatura") - 0.3, ate: fim("04") + 0.5, fundo: "panorama", luz: "noite", tremor: 7,
    cam: [[540, 1100, 1.25], [540, 940, 1.0]] },

  // 52–65 s | A descoberta
  { id: "percebe", de: fim("04") + 0.5, ate: pal("05", "criatura") - 0.4, fundo: "cabo", bloco: "cabo", luz: "noite", tremor: 3,
    cam: [[540, 1100, 1.2], [540, 960, 2.3]], at: { Davi: { expr: "congelado", olhar: [0.9, 0.3] } } },
  { id: "passa", de: pal("05", "criatura") - 0.4, ate: pal("05", "estava") - 0.2, fundo: "panorama", luz: "noite", tremor: 3,
    cam: [[540, 900, 1.2], [420, 940, 1.6]] },
  { id: "segura", de: pal("05", "estava") - 0.2, ate: fim("05") + 0.4, fundo: "panorama", luz: "noite", tremor: 5,
    cam: [[400, 980, 1.8], [330, 900, 2.5]] },

  // 65–78 s | A verdadeira ameaça
  { id: "barris", de: fim("05") + 0.4, ate: pal("06", "esconder") - 0.2, fundo: "panorama", luz: "fria",
    cam: [[540, 800, 1.1], [540, 1150, 1.5]] },
  { id: "deposito", de: pal("06", "esconder") - 0.2, ate: pal("06", "criatura") - 0.4, fundo: "antigo", luz: "fria",
    cam: [[400, 1200, 1.3], [300, 1300, 1.7]] },
  { id: "guardiao", de: pal("06", "criatura") - 0.4, ate: pal("06", "naquela") - 0.5, fundo: "guardiao", luz: "noite", tremor: 4,
    cam: [[540, 1300, 1.0], [540, 1150, 1.5]] },
  { id: "chegada", de: pal("06", "naquela") - 0.5, ate: pal("06", "explosão") - 0.3, fundo: "oeste", bloco: "chegada", luz: "noite", tremor: 4,
    cam: [[560, 1320, 1.5], [560, 1300, 1.8]], at: { Davi: { x: 1250, xPara: 760 } } },
  { id: "painel", de: pal("06", "explosão") - 0.3, ate: fim("06") + 0.4, fundo: "subsolo", bloco: "subsolo", luz: "noite", tremor: 6,
    cam: [[540, 1250, 1.1], [540, 1000, 1.9]], at: { Lara: { x: -150, xPara: 440 }, Davi: { x: -350, xPara: 650 } } },

  // 78–90 s | O último guardião
  { id: "resfria", de: fim("06") + 0.4, ate: pal("07", "davi") - 0.2, fundo: "subsolo", bloco: "subsolo", luz: "noite", tremor: 5,
    cam: [[480, 1200, 1.5], [460, 1150, 1.8]], at: { Lara: { expr: "firme", pose: "apontarCima", olhar: [0.4, -0.9] } } },
  { id: "comportas", de: pal("07", "davi") - 0.2, ate: pal("07", "explosão") - 0.3, fundo: "subsolo", bloco: "subsolo", luz: "noite", tremor: 5,
    cam: [[700, 1350, 1.6], [820, 1250, 1.3]], at: { Davi: { expr: "bravo", pose: "apontarDir", olhar: [1, -0.2] }, Lara: { expr: "firme", olhar: [1, -0.2] } } },
  { id: "evitada", de: pal("07", "explosão") - 0.3, ate: pal("07", "pela") - 0.3, fundo: "estavel", bloco: "subsolo", luz: "noite",
    cam: [[540, 1150, 1.4], [540, 1250, 1.6]], at: { Davi: { expr: "sereno", fechado: true }, Lara: { expr: "feliz", olhar: [0.8, 0] } } },
  { id: "neblina", de: pal("07", "pela") - 0.3, ate: pal("07", "eles") - 0.3, fundo: "panorama", luz: "dia",
    cam: [[540, 1300, 1.4], [540, 960, 1.0]] },
  { id: "vale", de: pal("07", "eles") - 0.3, ate: pal("07", "mas") - 0.2, fundo: "vale", bloco: "vale", luz: "dia",
    cam: [[540, 1400, 1.3], [540, 1250, 1.1]] },
  { id: "rostos", de: pal("07", "mas") - 0.2, ate: pal("07", "único") - 0.2, fundo: "vale", bloco: "vale", luz: "dia",
    cam: [[320, 1380, 2.4], [760, 1380, 2.4]] },
  { id: "adeus", de: pal("07", "único") - 0.2, ate: PRETO, fundo: "vale", bloco: "vale", luz: "dia",
    cam: [[540, 1130, 2.4], [540, 1100, 1.0]] },
];


const P = Object.fromEntries(SHOTS.map((s) => [s.id, s]));
const dentro = (t: number, id: string) => sobe(t, P[id].de, P[id].ate);
const T_GARRA = P.garras.de, T_EMERGE = P.emerge.de, T_ALAVANCA = P.comportas.de + 0.7;
const sinal = (t: number, rapido = false) => (rapido ? Math.sin(t * 22) > -0.2 : Math.sin(t * 7) > 0.2 && Math.sin(t * 2.3) > -0.5);

const cenario = ({ t, shot }: Contexto) => {
  switch (shot.fundo) {
    case "leste": {
      const tela = shot.id === "ordens" ? "ordem" : "onda";
      const luzFora = (shot.id === "luz" && t > P.luz.de + 0.5 && sinal(t)) || (shot.id === "resposta" && sinal(t + 1));
      return <Cabine t={t} lado="leste" riscos={26} tela={tela} luzFora={luzFora} />;
    }
    case "oeste":
      return <Cabine t={t} lado="oeste" tela={shot.id === "desespero" ? "onda" : "semSinal"} alerta={shot.id === "desespero" ? 0.4 : 1} luzFora={shot.id === "desespero"} />;
    case "cabo": return <CeuCabo t={t} sombra={dentro(t, "percebe")} />;
    case "guardiao": return <Guardiao t={t} />;
    case "antigo": return <Subsolo t={t} antigo calor={0} />;
    case "subsolo":
      return <Subsolo t={t}
        calor={shot.id === "painel" ? 1 : 1 - sobe(t, P.resfria.de + 0.8, P.resfria.ate + 1.5)}
        resfria={shot.id === "painel" ? 0 : sobe(t, P.resfria.de + 0.6, P.comportas.ate)}
        comporta={sobe(t, T_ALAVANCA, T_ALAVANCA + 1.6)}
        carga={shot.id === "painel" ? 82 + dentro(t, "painel") * 15 : Math.max(41, 97 - sobe(t, P.resfria.de + 0.8, P.comportas.ate) * 56)} />;
    case "estavel": return <Subsolo t={t} estavel calor={0} comporta={1} />;
    case "vale": return <Vale t={t} longe={sobe(t, P.vale.de, PRETO)} olha={shot.id === "adeus" && t > P.adeus.de + 0.5 && t < P.adeus.de + 2.6 ? 1 : 0} />;
    default: break;
  }
  // panorama: o mesmo abismo visto em momentos diferentes
  const comum = { t, visualDavi: DAVI };
  switch (shot.id) {
    case "gancho": return <Panorama {...comum} criatura={0.12 + 0.1 * Math.sin(t * 1.4)} olhos={sobe(t, 0.5, 1.2) * (1 - sobe(t, 2.8, 3.4))} />;
    case "coisa": return <Panorama {...comum} criatura={0.16 + 0.12 * dentro(t, "coisa")} olhos={sobe(t, P.coisa.de + 1.6, P.coisa.de + 2.4)} />;
    case "piscou": return <Panorama {...comum} luzOeste={sinal(t)} />;
    case "garras": return <Panorama {...comum} garras={dentro(t, "garras")} tremeOeste={0.6 + 0.4 * dentro(t, "garras")} luzOeste={sinal(t, true)} fenda={0.3} />;
    case "lanca": return <Panorama {...comum} cabo={sobe(t, P.lanca.de + 0.3, P.lanca.ate - 0.3)} luzOeste={sinal(t, true)} tremeOeste={0.5} fenda={0.4} />;
    case "travessia": return <Panorama {...comum} cabo={1} davi={0.06 + 0.2 * dentro(t, "travessia")} tremeOeste={0.5} fenda={0.4} />;
    case "metade": return <Panorama {...comum} cabo={1} davi={0.26 + 0.24 * dentro(t, "metade")} tremeOeste={0.5} fenda={0.5} olhos={dentro(t, "metade")} criatura={0.1 * dentro(t, "metade")} />;
    case "emerge": return <Panorama {...comum} cabo={1} davi={0.5} tremeOeste={0.6} fenda={0.6} criatura={0.1 + 0.9 * sobe(t, T_EMERGE, T_EMERGE + 1.3)} />;
    case "passa": return <Panorama {...comum} cabo={1} davi={0.5} tremeOeste={0.7} fenda={0.7} criatura={1} segura={0.75 * dentro(t, "passa")} />;
    case "segura": return <Panorama {...comum} cabo={1} davi={0.5} tremeOeste={0.4} fenda={1} criatura={1} segura={0.75 + 0.25 * sobe(t, P.segura.de, P.segura.de + 0.6)} />;
    case "barris": return <Panorama {...comum} barris={dentro(t, "barris")} luzLeste luzOeste />;
    case "neblina": return <Panorama {...comum} neblina={1 - sobe(t, P.neblina.de + 0.4, P.neblina.ate - 0.6)} amanhecer={dentro(t, "neblina")} criatura={0.25} luzLeste={false} />;
    default: return <Panorama {...comum} />;
  }
};

// Lanternas de sinais e a cadeirinha no close da travessia.
const itens = ({ t, shot }: Contexto) => {
  if (shot.id === "resposta") return [{ y: 2000, el: <Lanterna key="l" x={330 + 210} y={1790 - 400} acesa={sinal(t)} s={0.8} /> }];
  if (shot.id === "desespero") return [{ y: 2000, el: <Lanterna key="l" x={700 - 210} y={1790 - 400} acesa={sinal(t, true)} s={0.8} /> }];
  return [];
};

// Vista pelos binóculos: Lara na janela da torre oeste, sinalizando.
const Binoculo = ({ t }: { t: number }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <defs>
        <clipPath id="bino"><circle cx={370} cy={820} r={330} /><circle cx={710} cy={820} r={330} /></clipPath>
      </defs>
      <g clipPath="url(#bino)">
        <rect width={1080} height={1920} fill="#0d1730" />
        <g transform={`translate(${Math.sin(t * 1.3) * 14} ${Math.cos(t * 1.7) * 10})`}>
          <rect x={150} y={420} width={780} height={900} fill="#2c2a3a" stroke="#11161d" strokeWidth={30} />
          <rect x={250} y={520} width={580} height={520} fill="#463f55" />
          <g transform="translate(540 1420) scale(0.95)"><Ator v={LARA} t={t} expr="feliz" pose="apontarCima" olhar={[0, 0]} fase={2} /></g>
          <Lanterna x={690} y={720} acesa={sinal(t)} s={0.9} />
          <rect x={150} y={1040} width={780} height={280} fill="#1b1a26" />
        </g>
        <rect width={1080} height={1920} fill="#7dffb0" opacity={0.07} />
      </g>
      <g stroke="#9fb5c9" strokeWidth={4} opacity={0.6} fill="none">
        <circle cx={370} cy={820} r={330} /><circle cx={710} cy={820} r={330} />
        <line x1={540} y1={760} x2={540} y2={880} /><line x1={480} y1={820} x2={600} y2={820} />
      </g>
    </svg>
  </AbsoluteFill>
);

const sobre = ({ t, shot }: Contexto) => (shot.id === "binoculo" ? <Binoculo t={t} /> : null);

const fx = ({ t }: Contexto) => ({
  impacto: Math.max(decai(t, T_EMERGE, 1.2), decai(t, T_GARRA, 0.5), decai(t, T_ALAVANCA, 0.8), decai(t, P.segura.de, 0.6)),
  flash: Math.max(decai(t, T_EMERGE + 0.2, 0.4), decai(t, P.evitada.de, 0.5)),
  clarao: Math.max(decai(t, P.barris.de, 0.3), decai(t, P.guardiao.de, 0.3), decai(t, P.neblina.de, 0.5)) * 0.7,
  claraoCor: "#fff4dc",
});

const S = "abismo/sfx/";
const VENTO = "mare01/sfx/vento.mp3";

export const Abismo = () => (
  <Episodio
    manifesto={manifesto} shots={SHOTS} blocos={BLOCOS} preto={PRETO} elenco={ELENCO} vinheta={0.6}
    cenario={cenario} sobre={sobre} itens={itens} fx={fx}
    corLegenda={() => "#ffffff"}
    final={() => (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", color: "#e8e4dc", fontFamily: FONT, fontSize: 90, letterSpacing: 10 }}>FIM</AbsoluteFill>
    )}
    sons={
      <>
        <Som fps={FPS} em={0} src={`${S}musica.mp3`} volume={0.3} dur={manifesto.duracao} some={1.4} />
        <Som fps={FPS} em={0} src={VENTO} volume={0.4} dur={P.sozinho.de} some={0.5} />
        <Som fps={FPS} em={0.3} src={`${S}criatura.mp3`} volume={0.8} />
        <Som fps={FPS} em={P.coisa.de + 1.2} src="ep01/sfx/drone.mp3" volume={0.5} dur={3.4} some={0.6} />
        <Som fps={FPS} em={P.piscou.de} src={VENTO} volume={0.35} dur={P.binoculo.de - P.piscou.de} some={0.3} />
        <Som fps={FPS} em={P.desespero.de} src="tempo/sfx/alarmes.mp3" volume={0.3} dur={P.garras.de - P.desespero.de} some={0.3} />
        <Som fps={FPS} em={T_GARRA} src="ep02/sfx/arranhao.mp3" volume={0.9} />
        <Som fps={FPS} em={T_GARRA + 0.2} src="ep02/sfx/rachadura.mp3" volume={0.8} />
        <Som fps={FPS} em={P.sensores.de} src="ep02/sfx/flatline.mp3" volume={0.45} />
        <Som fps={FPS} em={P.ordens.de} src="futuro/sfx/bipes.mp3" volume={0.4} dur={P.lanca.de - P.ordens.de} some={0.2} />
        <Som fps={FPS} em={P.lanca.de + 0.2} src={`${S}cabo.mp3`} volume={0.9} />
        <Som fps={FPS} em={P.travessia.de} src={VENTO} volume={0.5} dur={P.emerge.de - P.travessia.de} some={0.3} />
        <Som fps={FPS} em={T_EMERGE - 0.2} src={`${S}criatura.mp3`} volume={1} />
        <Som fps={FPS} em={T_EMERGE} src="mare02/sfx/impacto.mp3" volume={0.6} dur={4} some={1} />
        <Som fps={FPS} em={P.segura.de} src="ep02/sfx/rachadura.mp3" volume={0.9} />
        <Som fps={FPS} em={P.segura.de + 0.3} src="ep02/sfx/metal.mp3" volume={0.5} />
        <Som fps={FPS} em={P.guardiao.de} src={`${S}criatura.mp3`} volume={0.7} dur={P.chegada.de - P.guardiao.de} some={0.5} />
        <Som fps={FPS} em={P.chegada.de} src="tempo/sfx/alarmes.mp3" volume={0.4} dur={P.resfria.de + 1.4 - P.chegada.de} some={0.8} />
        <Som fps={FPS} em={P.resfria.de + 0.6} src={`${S}vapor.mp3`} volume={0.8} />
        <Som fps={FPS} em={T_ALAVANCA} src={`${S}comporta.mp3`} volume={0.9} dur={P.evitada.de - T_ALAVANCA + 0.6} some={0.6} />
        <Som fps={FPS} em={P.evitada.de} src="cidade/sfx/desliga.mp3" volume={0.7} />
        <Som fps={FPS} em={P.vale.de} src="mare01/sfx/aves.mp3" volume={0.5} />
        <Som fps={FPS} em={P.adeus.de + 0.4} src="mare01/sfx/aves.mp3" volume={0.4} />
      </>
    }
  />
);

export const ABISMO_DURACAO = Math.round(manifesto.duracao * FPS);
export const ABISMO_FPS = FPS;

