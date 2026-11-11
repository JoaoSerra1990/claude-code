import { AbsoluteFill, interpolate } from "remotion";
import manifestoJson from "./manifest.json";
import { COLORS, FONT } from "../theme";
import type { Visual } from "../serie/Ator";
import {
  Episodio, Som, decai, est as e, sobe, tempos,
  type Bloco, type Contexto, type Manifesto, type Shot,
} from "../serie/motor";
import { Barco, Cidade, Escola, JANELA_BIA, PLACA_ESCOLA, Praia, PraiaAerea, RADIO, turista } from "../mare/cenarios";

// A Última Maré — Episódio 1: O Dia em que o Mar Desapareceu.
// Ritmo: estranheza até os 30 s, urgência até os 60 s, perigo iminente no fim.

const manifesto = manifestoJson as Manifesto;
const FPS = manifesto.fps;
const PRETO = manifestoJson.preto;
const { ini, fim, pal } = tempos(manifesto);

// Elenco fixo da temporada.
export const ELENCO_MARE: Record<string, Visual> = {
  Lucas: { pele: "#e2b08a", cabelo: "#2e211b", roupa: "#2a9d8f", calca: "#3a4a63", estilo: "curto", mochila: "#b3402e" },
  Marina: { pele: "#d9a074", cabelo: "#17110e", roupa: "#e76f51", calca: "#3b4a6b", estilo: "rabo" },
  Rogerio: { pele: "#c99670", cabelo: "#173e57", detalhe: "#1f4f6b", roupa: "#d08c2a", calca: "#2f3138", estilo: "gorro", casaco: true, barbaCor: "#3b2c22" },
  Bia: { pele: "#e2b08a", cabelo: "#2e211b", roupa: "#f2f2f2", detalhe: "#2f6fb5", calca: "#2f4f8a", estilo: "rabo" },
};
const ELENCO: Record<string, Visual> = {
  ...ELENCO_MARE,
  T1: turista(2),
  T2: turista(5),
  Crianca: { pele: "#d9a074", cabelo: "#2e211b", roupa: "#e9c46a", calca: "#2a9d8f", estilo: "baguncado" },
};

const BLOCOS: Record<string, Bloco> = {
  crianca: { Crianca: e(640, 1260, 0.34, "feliz", [0.6, 0.6], "apontarDir") },
  praia: { Lucas: e(380, 1720, 0.72, "desconfiado", [0.2, -0.8]) },
  dois: {
    Lucas: e(380, 1720, 0.72, "medo", [0.1, -0.9]),
    Marina: e(720, 1740, 0.7, "medo", [-0.2, -0.9]),
  },
  turistas: {
    T1: e(300, 1700, 0.7, "feliz", [0.8, 0], "apontarCima"),
    T2: e(560, 1720, 0.66, "feliz", [-0.8, 0]),
    Lucas: e(900, 1640, 0.6, "panico", [-1, 0], "recuar"),
  },
  radio: { Lucas: e(300, 1760, 0.72, "surpreso", [0.9, 0.5], "apontarDir") },
  barco: { Rogerio: e(480, 1620, 0.95, "firme", [0.2, 0.3]) },
  cidade: {
    Lucas: e(520, 1760, 0.74, "panico", [1, -0.3]),
    Marina: e(330, 1790, 0.72, "panico", [1, -0.3]),
  },
};

const ROSTO_LUCAS: [number, number] = [380, 1223];
const ROSTO_MARINA: [number, number] = [720, 1257];
const ROSTO_LUCAS_CIDADE: [number, number] = [520, 1249];
const [RX, RY] = RADIO;

const SHOTS: Shot[] = [
  // 00–08 s | A praia impossível
  { id: "aerea", de: 0, ate: pal("01", "quase") - 0.2, fundo: "aerea", luz: "dia",
    cam: [[540, 1120, 1.0], [540, 720, 1.3]] },
  { id: "peixes", de: pal("01", "quase") - 0.2, ate: fim("01") + 0.35, fundo: "praia", luz: "dia",
    cam: [[330, 1120, 2.2], [420, 1070, 1.75]] },

  // 08–20 s | O espetáculo
  { id: "espetaculo", de: fim("01") + 0.35, ate: pal("02", "centenas") - 0.1, fundo: "praia", luz: "dia",
    cam: [[540, 1160, 1.0], [560, 1080, 1.25]] },
  { id: "crianca", de: pal("02", "centenas") - 0.1, ate: pal("02", "agora") - 0.1, fundo: "praia", bloco: "crianca", luz: "dia",
    cam: [[690, 1100, 2.6], [700, 1085, 2.9]] },
  { id: "barco_tombado", de: pal("02", "agora") - 0.1, ate: fim("02") + 0.4, fundo: "praia", luz: "dia",
    cam: [[300, 1010, 1.6], [330, 980, 1.9]] },

  // 20–33 s | A lembrança do pai
  { id: "lucas_olha", de: fim("02") + 0.4, ate: ini("03") - 0.35, fundo: "praia", bloco: "praia", luz: "dia",
    cam: [[ROSTO_LUCAS[0], ROSTO_LUCAS[1] + 20, 2.4], [ROSTO_LUCAS[0], ROSTO_LUCAS[1], 2.8]] },
  { id: "lembranca", de: ini("03") - 0.35, ate: fim("03") + 0.3, fundo: "barco", bloco: "barco", luz: "dourada",
    cam: [[480, 1010, 1.5], [480, 975, 2.1]] },
  { id: "sangue_gelar", de: fim("03") + 0.3, ate: fim("04") + 0.3, fundo: "praia", bloco: "praia", luz: "ameaca",
    cam: [[ROSTO_LUCAS[0], ROSTO_LUCAS[1], 2.8], [ROSTO_LUCAS[0], ROSTO_LUCAS[1], 3.2]], at: { Lucas: { expr: "congelado" } } },

  // 33–47 s | Ninguém acredita
  { id: "lucas_grita", de: fim("04") + 0.3, ate: fim("05") + 0.3, fundo: "praia", bloco: "praia", luz: "ameaca", tremor: 3,
    cam: [[320, 1290, 1.5], [600, 1290, 1.65]], at: { Lucas: { x: 200, xPara: 640, expr: "panico", pose: "recuar", olhar: [0, -0.6] } } },
  { id: "riram", de: fim("05") + 0.3, ate: pal("06", "outros") - 0.1, fundo: "praia", bloco: "turistas", luz: "ameaca",
    cam: [[450, 1250, 1.9], [470, 1240, 2.15]], at: { T1: { pose: "parado" } } },
  { id: "filmando", de: pal("06", "outros") - 0.1, ate: pal("06", "mas") - 0.1, fundo: "praia", bloco: "turistas", luz: "ameaca",
    cam: [[330, 1200, 2.5], [340, 1190, 2.8]] },
  { id: "marina_percebe", de: pal("06", "mas") - 0.1, ate: pal("06", "até") - 0.1, fundo: "praia", bloco: "dois", luz: "ameaca",
    cam: [[ROSTO_MARINA[0], ROSTO_MARINA[1], 2.4], [ROSTO_MARINA[0], ROSTO_MARINA[1], 2.8]],
    at: { Marina: { expr: "desconfiado", olhar: [0.7, -1] } } },
  { id: "passaros", de: pal("06", "até") - 0.1, ate: fim("06") + 0.4, fundo: "praia", bloco: "dois", luz: "ameaca",
    cam: [[640, 470, 1.6], [820, 400, 1.9]] },

  // 47–60 s | O aviso no rádio
  { id: "celular", de: fim("06") + 0.4, ate: ini("07") - 0.9, fundo: "praia", bloco: "dois", luz: "ameaca",
    cam: [[ROSTO_LUCAS[0], ROSTO_LUCAS[1] + 60, 2.1], [ROSTO_LUCAS[0], ROSTO_LUCAS[1] + 50, 2.3]], at: { Lucas: { expr: "surpreso", olhar: [0, 1] } } },
  { id: "radio", de: ini("07") - 0.9, ate: pal("07", "não") - 0.1, fundo: "praia", bloco: "radio", luz: "ameaca", tremor: 2,
    cam: [[RX, RY - 10, 2.5], [RX, RY - 10, 3.0]] },
  { id: "lucas_ouve", de: pal("07", "não") - 0.1, ate: fim("07") + 0.3, fundo: "praia", bloco: "radio", luz: "ameaca",
    cam: [[300, 1263, 2.8], [300, 1263, 3.2]], at: { Lucas: { expr: "congelado", pose: "parado", olhar: [0.9, 0.6] } } },
  { id: "voz_do_pai", de: fim("07") + 0.3, ate: pal("08", "mas") - 0.1, fundo: "praia", bloco: "radio", luz: "ameaca",
    cam: [[440, 1400, 1.8], [460, 1400, 2.0]] },
  { id: "sinal_some", de: pal("08", "mas") - 0.1, ate: fim("08") + 0.4, fundo: "praia", bloco: "radio", luz: "ameaca",
    cam: [[RX, RY - 10, 2.8], [RX, RY - 10, 3.3]] },

  // 60–72 s | A parede no horizonte
  { id: "o_som", de: fim("08") + 0.4, ate: pal("09", "não") - 0.1, fundo: "praia", bloco: "dois", luz: "ameaca", tremor: 4,
    cam: [[540, 1160, 1.0], [540, 1110, 1.12]] },
  { id: "horizonte", de: pal("09", "não") - 0.1, ate: fim("09") + 0.3, fundo: "praia", bloco: "dois", luz: "ameaca", tremor: 4,
    cam: [[540, 730, 1.6], [540, 690, 3.2]] },
  { id: "marina_grita", de: fim("09") + 0.3, ate: fim("10") + 0.2, fundo: "praia", bloco: "dois", luz: "ameaca", tremor: 6,
    cam: [[550, 1250, 1.9], [550, 1240, 2.2]], at: { Lucas: { expr: "panico" }, Marina: { expr: "panico", pose: "apontarCima" } } },
  { id: "parede", de: fim("10") + 0.2, ate: ini("11") - 0.35, fundo: "praia", bloco: "dois", luz: "ameaca", tremor: 8,
    cam: [[540, 1000, 1.0], [540, 900, 1.15]], at: { Lucas: { oculto: true }, Marina: { oculto: true } } },

  // 72–85 s | O impossível de escolher
  { id: "correm", de: ini("11") - 0.35, ate: pal("11", "mas") - 0.1, fundo: "cidade", bloco: "cidade", luz: "ameaca", tremor: 6,
    cam: [[330, 1300, 1.3], [500, 1280, 1.45]],
    at: { Lucas: { x: 60, xPara: 520, pose: "apontarEsq" }, Marina: { x: -130, xPara: 330 } } },
  { id: "placa", de: pal("11", "mas") - 0.1, ate: pal("11", "coração") - 0.3, fundo: "cidade", bloco: "cidade", luz: "ameaca", tremor: 4,
    cam: [[PLACA_ESCOLA[0], PLACA_ESCOLA[1] - 40, 2.0], [PLACA_ESCOLA[0], PLACA_ESCOLA[1] - 50, 2.5]] },
  { id: "lucas_para", de: pal("11", "coração") - 0.3, ate: fim("11") + 0.25, fundo: "cidade", bloco: "cidade", luz: "ameaca", tremor: 4,
    cam: [[ROSTO_LUCAS_CIDADE[0], ROSTO_LUCAS_CIDADE[1], 2.7], [ROSTO_LUCAS_CIDADE[0], ROSTO_LUCAS_CIDADE[1], 3.1]],
    at: { Lucas: { expr: "congelado", olhar: [1, -0.4] } } },
  { id: "a_bia", de: fim("11") + 0.25, ate: fim("12") + 0.3, fundo: "cidade", bloco: "cidade", luz: "ameaca", tremor: 9,
    cam: [[480, 1255, 2.3], [500, 1250, 2.8]], at: { Lucas: { pose: "recuar", tremor: true }, Marina: { expr: "congelado" } } },
  { id: "bia", de: fim("12") + 0.3, ate: PRETO, fundo: "escola", luz: "ameaca", tremor: 7,
    cam: [[JANELA_BIA[0], JANELA_BIA[1] - 20, 2.7], [540, 1000, 1.0]] },
];

const plano = (id: string) => SHOTS.find((s) => s.id === id)!;
const P_LEMB = plano("lembranca"), P_GELAR = plano("sangue_gelar"), P_MARINA = plano("marina_percebe"), P_PASS = plano("passaros");
const P_CEL = plano("celular"), P_RADIO = plano("radio"), P_SOME = plano("sinal_some"), P_SOM = plano("o_som");
const P_HOR = plano("horizonte"), P_PAREDE = plano("parede"), P_CORREM = plano("correm"), P_BIA = plano("bia");
const P_ESPET = plano("espetaculo"), P_FILMA = plano("filmando");

const cenario = ({ t, shot }: Contexto) => {
  if (shot.fundo === "aerea") return <PraiaAerea t={t} recuo={sobe(t, 0.7, 5.6) ** 0.7} />;
  if (shot.fundo === "barco") return <Barco t={t} />;
  if (shot.fundo === "cidade") return <Cidade t={t} onda={0.3 + sobe(t, P_CORREM.de, P_BIA.de) * 0.2} />;
  if (shot.fundo === "escola") return <Escola t={t} onda={0.62 + sobe(t, P_BIA.de, PRETO) * 0.38} bia={ELENCO.Bia} />;
  const onda = t < P_HOR.de ? 0 : t < P_PAREDE.de ? 0.02 + sobe(t, P_HOR.de, P_PAREDE.de) * 0.3 : 0.32 + sobe(t, P_PAREDE.de, P_PAREDE.ate) * 0.5;
  return (
    <Praia t={t} onda={onda} multidao={t >= P_ESPET.de}
      aves={t >= P_MARINA.de + 0.4 && t < P_CEL.de + 1 ? sobe(t, P_MARINA.de + 0.4, P_PASS.ate) : null}
      foge={sobe(t, P_PAREDE.de, P_PAREDE.ate)}
      radio={t >= P_RADIO.de && t < P_SOME.de + 0.7 ? 1 : 0}
      tremor={t >= P_SOM.de ? 1 : 0} />
  );
};

const itens = ({ t, shot }: Contexto) => {
  if (shot.id === "crianca") {
    return [{
      y: 1261,
      el: <path key="estrela" d="M0 -22 L6 -7 L22 -7 L9 4 L14 20 L0 11 L-14 20 L-9 4 L-22 -7 L-6 -7Z" transform={`translate(742 ${1080 + Math.sin(t * 3) * 3}) scale(0.9)`} fill="#e07a3f" stroke="#8a4520" strokeWidth={3} />,
    }];
  }
  if (shot.id === "filmando" || shot.id === "riram") {
    const flash = shot.id === "filmando" && Math.sin((t - P_FILMA.de) * 9) > 0.8;
    return [{
      y: 1701,
      el: (
        <g key="celular">
          <rect x={398} y={1150} width={40} height={68} rx={7} fill="#14181d" stroke="#3b4652" strokeWidth={3} />
          {flash && <circle cx={418} cy={1160} r={70} fill="#fff" opacity={0.85} />}
        </g>
      ),
    }];
  }
  return [];
};

// A chamada do pai que cai: tela do celular de Lucas.
const sobre = ({ t }: Contexto) => {
  if (t < P_CEL.de || t >= P_CEL.ate) return null;
  const caiu = t > P_CEL.de + (P_CEL.ate - P_CEL.de) * 0.6;
  const vibra = caiu ? 0 : Math.sin(t * 70) * 6;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.35)" }}>
      <div style={{ width: 560, height: 980, marginTop: -140, borderRadius: 60, background: "#0f1418", border: "14px solid #2b3138", transform: `translateX(${vibra}px) rotate(-3deg)`, fontFamily: FONT, color: "#f2f2f2", textAlign: "center", boxSizing: "border-box", paddingTop: 150 }}>
        <div style={{ width: 190, height: 190, borderRadius: 95, background: "#d08c2a", margin: "0 auto", fontSize: 110, lineHeight: "190px", color: "#3b2c22" }}>P</div>
        <div style={{ fontSize: 104, marginTop: 40 }}>PAI</div>
        <div style={{ fontSize: 44, marginTop: 14, color: caiu ? COLORS.red : "#9ad7a8", letterSpacing: 3 }}>{caiu ? "CHAMADA INTERROMPIDA" : "CHAMANDO…"}</div>
        <div style={{ fontSize: 36, marginTop: 120, color: "#8a929b", letterSpacing: 4 }}>{caiu ? "SEM SINAL" : ""}</div>
      </div>
    </AbsoluteFill>
  );
};

const fx = ({ t }: Contexto) => {
  const lembranca = Math.max(decai(t, P_LEMB.de, 0.6), decai(t, P_GELAR.de, 0.5));
  const estrondo = t < P_SOM.de ? 0 : 0.15 + sobe(t, P_SOM.de, PRETO) * 0.45;
  return { clarao: lembranca * 0.9, claraoCor: "#ffe7a8", impacto: estrondo };
};

const Final = ({ t }: { t: number }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT, color: "#e9eef0", opacity: interpolate(t, [PRETO + 0.5, PRETO + 1.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
    <div style={{ fontSize: 124, letterSpacing: 4 }}>A ÚLTIMA MARÉ</div>
    <div style={{ fontSize: 46, color: "#4fb3c8", marginTop: 18, letterSpacing: 6 }}>CONTINUA</div>
  </AbsoluteFill>
);

const S = "mare01/sfx/";

export const Mare01 = () => (
  <Episodio
    manifesto={manifesto} shots={SHOTS} blocos={BLOCOS} preto={PRETO} elenco={ELENCO} vinheta={0.5}
    cenario={cenario} itens={itens} sobre={sobre} fx={fx} final={(t) => <Final t={t} />}
    corLegenda={(p) => (p === "Narrador" ? "#fff3d6" : p === "Rogerio" ? "#ffd98a" : COLORS.white)}
    trilha={`${S}musica.mp3`}
    sons={
      <>
        <Som fps={FPS} em={0} src={`${S}praia.mp3`} volume={0.45} />
        <Som fps={FPS} em={11.6} src={`${S}praia.mp3`} volume={0.4} dur={Math.max(0.1, P_LEMB.de - 11.6)} />
        <Som fps={FPS} em={0.6} src={`${S}recuo.mp3`} volume={0.85} />
        <Som fps={FPS} em={P_GELAR.de} src={`${S}vento.mp3`} volume={0.45} />
        <Som fps={FPS} em={P_GELAR.de + 9.8} src={`${S}vento.mp3`} volume={0.45} />
        <Som fps={FPS} em={P_MARINA.de + 0.4} src={`${S}aves.mp3`} volume={0.8} />
        <Som fps={FPS} em={P_CEL.de} src={`${S}celular.mp3`} volume={0.8} dur={P_CEL.ate - P_CEL.de} />
        <Som fps={FPS} em={P_RADIO.de} src="ep01/sfx/estatica.mp3" volume={0.5} />
        <Som fps={FPS} em={P_SOME.de + 0.4} src="ep01/sfx/estatica.mp3" volume={0.5} />
        <Som fps={FPS} em={P_SOM.de} src={`${S}estrondo.mp3`} volume={0.75} />
        <Som fps={FPS} em={P_SOM.de + 19.5} src={`${S}estrondo.mp3`} volume={0.9} dur={Math.max(0.1, PRETO - P_SOM.de - 19.5)} />
        <Som fps={FPS} em={P_PAREDE.de} src={`${S}gritos.mp3`} volume={0.6} />
        <Som fps={FPS} em={PRETO} src="ep01/sfx/impacto.mp3" volume={0.9} />
      </>
    }
  />
);

export const MARE01_DURACAO = Math.round(manifesto.duracao * FPS);
export const MARE01_FPS = FPS;
