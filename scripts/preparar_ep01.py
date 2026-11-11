"""Prepara o episódio 1: linha do tempo, legendas, efeito de alto-falante e efeitos sonoros.

Lê out/ep01/falas (gerado por gerar_falas.py) e escreve:
  public/ep01/falas/*.mp3   (falas; Helena com efeito de alto-falante)
  src/ep01/manifest.json    (tempos de cada fala, palavras e cenas)
"""
import json, os, re, subprocess

FALAS = json.load(open("episodios/ep01_falas.json", encoding="utf-8"))
ORIGEM = "out/ep01/falas"
FPS = 30
INICIO = 0.6
GAP = 0.6  # pausa padrão entre falas
# Pausas maiores antes de certas falas, para dar tempo a ações sem diálogo.
GAPS = {"02": 0.9, "03": 1.0, "05": 0.9, "07": 1.8, "08": 2.2, "10": 1.0,
        "11": 0.7, "15": 1.4, "16": 0.5, "17": 0.5}

def sh(cmd):
    subprocess.run(cmd, shell=True, check=True, capture_output=True)

def duracao(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "csv=p=0", path], capture_output=True, text=True).stdout
    return float(out.strip())

def palavras(alinhamento, inicio_clipe):
    """Agrupa caracteres em palavras, ignorando marcações [entre colchetes]."""
    chars = alinhamento["characters"]
    starts = alinhamento["character_start_times_seconds"]
    ends = alinhamento["character_end_times_seconds"]
    resultado, atual, dentro_tag = [], None, False
    for c, s, e in zip(chars, starts, ends):
        if c == "[":
            dentro_tag = True
        if not dentro_tag:
            if c.isspace():
                if atual: resultado.append(atual); atual = None
            else:
                if atual is None:
                    atual = {"text": "", "start": inicio_clipe + s, "end": inicio_clipe + e}
                atual["text"] += c
                atual["end"] = inicio_clipe + e
        if c == "]":
            dentro_tag = False
    if atual: resultado.append(atual)
    # pontuação final encerra a frase para a legenda quebrar a linha
    return resultado

def efeito_alto_falante(entrada, saida):
    sh(f'ffmpeg -y -v error -i "{entrada}" -af "highpass=f=380,lowpass=f=2900,'
       f'acrusher=bits=9:mode=log:aa=1:mix=0.25,volume=1.4" "{saida}"')

def main():
    clipes, cursor = [], INICIO
    for i, f in enumerate(FALAS):
        if i > 0:
            cursor += GAPS.get(f["n"], GAP)
        nome = f"ep01_{f['n']}_{f['p'].lower().replace('í','i')}"
        origem_mp3 = os.path.join(ORIGEM, nome + ".mp3")
        dur = duracao(origem_mp3)
        destino = f"public/ep01/falas/{nome}.mp3"
        if f["p"] == "Helena":
            efeito_alto_falante(origem_mp3, destino)
        else:
            sh(f'cp "{origem_mp3}" "{destino}"')
        alinh = json.load(open(os.path.join(ORIGEM, nome + ".json"), encoding="utf-8"))
        clipes.append({
            "n": f["n"], "p": f["p"], "arquivo": f"ep01/falas/{nome}.mp3",
            "inicio": round(cursor, 3), "fim": round(cursor + dur, 3),
            "palavras": palavras(alinh, cursor),
        })
        cursor += dur
    # Três batidas vindas de baixo do piso, depois corte seco para preto.
    b1 = cursor + 0.9
    batidas = [round(b1, 3), round(b1 + 1.0, 3), round(b1 + 2.5, 3)]
    preto = round(batidas[2] + 0.7, 3)
    total = round(preto + 1.8, 3)
    manifesto = {"fps": FPS, "duracao": total, "falas": clipes, "batidas": batidas, "preto": preto}
    os.makedirs("src/ep01", exist_ok=True)
    json.dump(manifesto, open("src/ep01/manifest.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("duracao total:", total, "s")

if __name__ == "__main__":
    main()
