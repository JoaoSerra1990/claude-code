"""Prepara um episódio: exporta as falas no ritmo da série e monta a linha do tempo.

Uso: python3 scripts/preparar.py 02

Lê out/epNN/falas (gerado por gerar_falas.py) e escreve:
  public/epNN/falas/*.mp3   (falas aceleradas; com filtro quando a voz pede)
  src/epNN/manifest.json    (tempo de cada fala e de cada palavra, e eventos finais)
"""
import json, os, subprocess, sys

FPS = 30
# Ritmo da série: falas, legendas e pausas saem 10% mais rápidas.
VELOCIDADE = 1.1
GAP = 0.6  # pausa padrão entre falas, antes da aceleração

# Filtros de voz por personagem.
FILTROS = {
    "Helena": ["highpass=f=380", "lowpass=f=2900", "acrusher=bits=9:mode=log:aa=1:mix=0.25", "volume=1.4"],
    "Desconhecida": ["lowpass=f=560", "aecho=0.8:0.7:70:0.45", "volume=2.4"],
}

# Por episódio: quando a primeira fala começa e as pausas maiores antes de
# certas falas, que dão tempo às ações sem diálogo.
EPISODIOS = {
    "01": {"inicio": 0.6, "gaps": {"02": 0.9, "03": 1.0, "05": 0.9, "07": 1.8, "08": 2.2, "10": 1.0,
                                   "11": 0.7, "15": 1.4, "16": 0.5, "17": 0.5}},
    "02": {"inicio": 1.9, "gaps": {"02": 0.5, "03": 1.6, "05": 3.6, "06": 0.5, "07": 0.7, "08": 2.8,
                                   "09": 0.5, "10": 0.5, "11": 0.8, "12": 0.5, "13": 0.7, "14": 2.6,
                                   "15": 0.8, "17": 10.6}},
}


def sh(cmd):
    subprocess.run(cmd, shell=True, check=True, capture_output=True)


def duracao(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "csv=p=0", path], capture_output=True, text=True).stdout
    return float(out.strip())


def palavras(alinhamento, inicio_clipe):
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


def exportar(entrada, saida, personagem):
    filtros = [f"atempo={VELOCIDADE}"] + FILTROS.get(personagem, [])
    sh(f'ffmpeg -y -v error -i "{entrada}" -af "{",".join(filtros)}" "{saida}"')


def nome_arquivo(ep, fala):
    p = fala["p"].lower().replace("í", "i")
    return f"ep{ep}_{fala['n']}_{p}"


def main(ep):
    cfg = EPISODIOS[ep]
    falas = json.load(open(f"episodios/ep{ep}_falas.json", encoding="utf-8"))
    origem = f"out/ep{ep}/falas"
    os.makedirs(f"public/ep{ep}/falas", exist_ok=True)
    clipes, cursor = [], cfg["inicio"]
    for i, f in enumerate(falas):
        if i > 0:
            cursor += cfg["gaps"].get(f["n"], GAP) / VELOCIDADE
        nome = nome_arquivo(ep, f)
        destino = f"public/ep{ep}/falas/{nome}.mp3"
        exportar(os.path.join(origem, nome + ".mp3"), destino, f["p"])
        dur = duracao(destino)
        alinh = json.load(open(os.path.join(origem, nome + ".json"), encoding="utf-8"))
        clipes.append({
            "n": f["n"], "p": f["p"], "arquivo": f"ep{ep}/falas/{nome}.mp3",
            "inicio": round(cursor, 3), "fim": round(cursor + dur, 3),
            "palavras": palavras(alinh, cursor),
        })
        cursor += dur

    manifesto = {"fps": FPS, "falas": clipes}
    if ep == "01":
        # Três batidas vindas de baixo do piso, depois corte seco para preto.
        b1 = cursor + 0.9
        manifesto["batidas"] = [round(b1, 3), round(b1 + 1.0, 3), round(b1 + 2.5, 3)]
        manifesto["preto"] = round(manifesto["batidas"][2] + 0.7, 3)
        manifesto["duracao"] = round(manifesto["preto"] + 1.8, 3)
    else:
        # Corte seco para preto logo após a última fala; o tom contínuo segura o final.
        manifesto["preto"] = round(cursor + 0.6, 3)
        manifesto["duracao"] = round(manifesto["preto"] + 2.8, 3)

    os.makedirs(f"src/ep{ep}", exist_ok=True)
    json.dump(manifesto, open(f"src/ep{ep}/manifest.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"ep{ep} duracao total:", manifesto["duracao"], "s")


if __name__ == "__main__":
    main(sys.argv[1])
