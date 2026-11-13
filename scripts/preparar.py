"""Prepara um episódio: exporta as falas no ritmo da série e monta a linha do tempo.

Uso: python3 scripts/preparar.py ep02

Lê out/<projeto>/falas (gerado por gerar_falas.py) e escreve:
  public/<projeto>/falas/*.mp3   (falas aceleradas; com filtro quando a voz pede)
  src/<projeto>/manifest.json   (tempo de cada fala e de cada palavra, e eventos finais)
"""
import json, os, subprocess, sys

FPS = 30
# Ritmo da série: falas, legendas e pausas saem 10% mais rápidas.
VELOCIDADE = 1.1
GAP = 0.6  # pausa padrão entre falas, antes da aceleração

# Filtros de voz por personagem, na série O Último Sinal.
FILTROS_SERIE = {
    "Helena": ["highpass=f=380", "lowpass=f=2900", "acrusher=bits=9:mode=log:aa=1:mix=0.25", "volume=1.4"],
    "Desconhecida": ["lowpass=f=560", "aecho=0.8:0.7:70:0.45", "volume=2.4"],
}

# Filtros que uma fala pode pedir pelo campo "filtro".
FILTROS_NOMEADOS = {
    "radio": ["highpass=f=420", "lowpass=f=2600", "acrusher=bits=8:mode=log:aa=1:mix=0.35", "volume=1.5"],
    "memoria": ["aecho=0.8:0.6:45:0.28"],
}

# Por projeto: quando a primeira fala começa, as pausas maiores antes de certas
# falas (que dão tempo às ações sem diálogo) e o tempo final depois da última.
PROJETOS = {
    "ep01": {"inicio": 0.6, "filtros": FILTROS_SERIE,
             "gaps": {"02": 0.9, "03": 1.0, "05": 0.9, "07": 1.8, "08": 2.2, "10": 1.0,
                      "11": 0.7, "15": 1.4, "16": 0.5, "17": 0.5}},
    "ep02": {"inicio": 1.9, "filtros": FILTROS_SERIE, "preto": 0.6, "cauda": 2.8,
             "gaps": {"02": 0.5, "03": 1.6, "05": 3.6, "06": 0.5, "07": 0.7, "08": 2.8,
                      "09": 0.5, "10": 0.5, "11": 0.8, "12": 0.5, "13": 0.7, "14": 2.6,
                      "15": 0.8, "17": 10.6}},
    "mare01": {"inicio": 0.4, "filtros": {}, "preto": 0.5, "cauda": 2.4,
               "gaps": {"02": 0.7, "03": 2.0, "04": 0.8, "05": 0.9, "06": 0.7, "07": 2.8, "08": 0.6,
                        "09": 1.8, "10": 0.8, "11": 2.4, "12": 0.5, "13": 1.3}},
    "trem": {"inicio": 0.5, "filtros": {}, "preto": 5.2, "cauda": 3.4,
             "gaps": {"02": 0.9, "03": 0.7, "04": 1.0, "05": 0.8, "06": 1.7, "07": 1.0, "08": 1.0,
                      "09": 1.5, "10": 0.8, "11": 0.7, "12": 2.1}},
    "mare02": {"inicio": 0.3, "filtros": {}, "preto": 0.35, "cauda": 2.6,
               "gaps": {"02": 0.8, "03": 1.2, "04": 0.8, "05": 4.0, "06": 9.0, "07": 1.2, "08": 2.2,
                        "09": 9.0, "10": 1.2, "11": 4.4, "12": 0.8}},
    "cidade": {"inicio": 0.4, "filtros": {}, "preto": 0.6, "cauda": 1.6, "gaps": {"07": 0.9}},
    "tempo": {"inicio": 0.4, "filtros": {}, "preto": 0.7, "cauda": 1.6, "gaps": {"04": 0.9, "07": 0.8}},
    "futuro": {"inicio": 0.4, "filtros": {}, "preto": 0.6, "cauda": 2.6, "gaps": {"03": 0.8, "07": 0.6}},
    "abismo": {"inicio": 0.4, "filtros": {}, "preto": 2.2, "cauda": 1.6, "gaps": {"04": 0.9, "07": 0.9}},
    "labirinto": {"inicio": 0.4, "filtros": {}, "preto": 2.4, "cauda": 1.6, "gaps": {"04": 0.8, "07": 0.8}},
    "oito": {"inicio": 1.5, "filtros": {}, "preto": 2.6, "cauda": 1.6, "gaps": {"02": 0.9, "05": 0.8, "06": 0.9, "07": 2.2}},
    "andar": {"inicio": 0.6, "filtros": {}, "preto": 2.6, "cauda": 1.6, "gaps": {"02": 1.0, "03": 0.9, "04": 1.2, "05": 0.9, "06": 0.9, "07": 1.2}},
    "repete": {"inicio": 0.6, "filtros": {}, "preto": 3.0, "cauda": 1.6, "gaps": {"02": 1.2, "03": 1.0, "04": 1.0, "05": 1.0, "06": 1.0, "07": 1.6}},
    "mentira": {"inicio": 0.6, "filtros": {}, "preto": 3.0, "cauda": 1.6, "gaps": {"02": 1.2, "03": 1.0, "04": 1.0, "05": 1.0, "06": 1.0, "07": 1.4}},
    "silencio": {"inicio": 1.4, "filtros": {}, "preto": 3.4, "cauda": 1.6, "gaps": {"02": 1.2, "03": 1.2, "04": 1.0, "05": 1.0, "06": 1.0, "07": 1.8}},
    "sonho": {"inicio": 0.8, "filtros": {}, "preto": 3.6, "cauda": 1.6, "gaps": {"02": 1.2, "03": 1.2, "04": 1.2, "05": 1.2, "06": 1.2, "07": 2.0}},
    "nevoa": {"inicio": 0.8, "filtros": {}, "preto": 3.4, "cauda": 1.6, "gaps": {"02": 1.2, "03": 1.2, "04": 1.2, "05": 1.2, "06": 1.2, "07": 1.8}},
    "eternidade": {"inicio": 0.8, "filtros": {}, "preto": 3.6, "cauda": 1.6, "gaps": {"02": 1.2, "03": 1.2, "04": 0.9, "05": 1.6, "06": 1.2, "07": 1.2, "08": 1.4, "09": 0.7, "10": 1.4}},
    "destino": {"inicio": 0.8, "filtros": {}, "preto": 3.6, "cauda": 1.6, "gaps": {"02": 1.2, "03": 1.0, "04": 1.2, "05": 1.2, "06": 1.2, "07": 1.8}},
    "noite": {"inicio": 0.8, "filtros": {}, "preto": 3.6, "cauda": 1.6, "gaps": {"02": 1.2, "03": 1.2, "04": 1.2, "05": 1.2, "06": 1.2, "07": 1.8}},
    "aneis": {"inicio": 0.5, "velocidade": 1.5, "filtros": {}, "preto": 2.4, "cauda": 1.4,
              "gaps": {"02": 0.5, "03": 0.5, "04": 0.5, "05": 0.5, "06": 0.5, "07": 0.5, "08": 0.5, "09": 0.5, "10": 0.6, "11": 0.7, "12": 1.4}},
    "minutos": {"inicio": 0.5, "filtros": {}, "preto": 1.4, "cauda": 4.8,
                "gaps": {"02": 1.0, "03": 0.8, "04": 2.4, "05": 3.6, "06": 1.2, "07": 1.8,
                         "08": 3.6, "09": 0.8, "10": 0.8, "11": 3.0}},
}


def sh(cmd):
    subprocess.run(cmd, shell=True, check=True, capture_output=True)


def duracao(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "csv=p=0", path], capture_output=True, text=True).stdout
    return float(out.strip())


def palavras(alinhamento, inicio_clipe, VELOCIDADE=VELOCIDADE):
    """Agrupa caracteres em palavras, ignorando marcações [entre colchetes]."""
    chars = alinhamento["characters"]
    starts = [x / VELOCIDADE for x in alinhamento["character_start_times_seconds"]]
    ends = [x / VELOCIDADE for x in alinhamento["character_end_times_seconds"]]
    resultado, atual, dentro_tag = [], None, False
    for c, s, e in zip(chars, starts, ends):
        if c == "[":
            dentro_tag = True
        if not dentro_tag:
            if c.isspace():
                if atual:
                    resultado.append(atual)
                    atual = None
            else:
                if atual is None:
                    atual = {"text": "", "start": inicio_clipe + s, "end": inicio_clipe + e}
                atual["text"] += c
                atual["end"] = inicio_clipe + e
        if c == "]":
            dentro_tag = False
    if atual:
        resultado.append(atual)
    return resultado


def exportar(entrada, saida, filtros_voz, VELOCIDADE=VELOCIDADE):
    filtros = [f"atempo={VELOCIDADE}"] + filtros_voz
    sh(f'ffmpeg -y -v error -i "{entrada}" -af "{",".join(filtros)}" "{saida}"')


def nome_arquivo(projeto, fala):
    p = fala["p"].lower().replace("í", "i")
    return f"{projeto}_{fala['n']}_{p}"


def main(projeto):
    cfg = PROJETOS[projeto]
    VEL = cfg.get("velocidade", VELOCIDADE)  # ritmo próprio do projeto, se houver
    falas = json.load(open(f"episodios/{projeto}_falas.json", encoding="utf-8"))
    origem = f"out/{projeto}/falas"
    os.makedirs(f"public/{projeto}/falas", exist_ok=True)
    clipes, cursor = [], cfg["inicio"]
    for i, f in enumerate(falas):
        if i > 0:
            cursor += cfg["gaps"].get(f["n"], GAP) / VEL
        nome = nome_arquivo(projeto, f)
        destino = f"public/{projeto}/falas/{nome}.mp3"
        filtros = FILTROS_NOMEADOS[f["filtro"]] if "filtro" in f else cfg["filtros"].get(f["p"], [])
        exportar(os.path.join(origem, nome + ".mp3"), destino, filtros, VEL)
        dur = duracao(destino)
        alinh = json.load(open(os.path.join(origem, nome + ".json"), encoding="utf-8"))
        clipes.append({
            "n": f["n"], "p": f["p"], "arquivo": f"{projeto}/falas/{nome}.mp3",
            "inicio": round(cursor, 3), "fim": round(cursor + dur, 3),
            "palavras": palavras(alinh, cursor, VEL),
        })
        cursor += dur

    manifesto = {"fps": FPS, "falas": clipes}
    if projeto == "ep01":
        # Três batidas vindas de baixo do piso, depois corte seco para preto.
        b1 = cursor + 0.9
        manifesto["batidas"] = [round(b1, 3), round(b1 + 1.0, 3), round(b1 + 2.5, 3)]
        manifesto["preto"] = round(manifesto["batidas"][2] + 0.7, 3)
        manifesto["duracao"] = round(manifesto["preto"] + 1.8, 3)
    else:
        manifesto["preto"] = round(cursor + cfg["preto"], 3)
        manifesto["duracao"] = round(manifesto["preto"] + cfg["cauda"], 3)

    os.makedirs(f"src/{projeto}", exist_ok=True)
    json.dump(manifesto, open(f"src/{projeto}/manifest.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(projeto, "duracao total:", manifesto["duracao"], "s")


if __name__ == "__main__":
    main(sys.argv[1])
