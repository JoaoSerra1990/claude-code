"""Prepara o episódio 1: linha do tempo, legendas, efeito de alto-falante e efeitos sonoros.

Lê out/ep01/falas (gerado por gerar_falas.py) e escreve:
  public/ep01/falas/*.mp3   (falas; Helena com efeito de alto-falante)
  public/ep01/sfx/*.wav     (sino, estática, batidas)
  src/ep01/manifest.json    (tempos de cada fala, palavras e cenas)
"""
import json, os, re, subprocess

FALAS = json.load(open("episodios/ep01_falas.json", encoding="utf-8"))
ORIGEM = "out/ep01/falas"
FPS = 30
INICIO = 0.4
GAP = 1.1          # pausa padrão entre falas
GAP_NARRADOR = 1.4 # o narrador respira mais
CAUDA = 6.0        # tempo final com a cena de suspense

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

def sfx():
    os.makedirs("public/ep01/sfx", exist_ok=True)
    # sino escolar: dois tons com decaimento
    sh('ffmpeg -y -v error -f lavfi -i "sine=f=1800:d=2.6" -f lavfi -i "sine=f=2400:d=2.6" '
       '-filter_complex "[0][1]amix=inputs=2,afade=t=out:st=0.3:d=2.3,volume=0.6" public/ep01/sfx/sino.wav')
    # estática para o alto-falante
    sh('ffmpeg -y -v error -f lavfi -i "anoisesrc=d=1.2:c=white:a=0.5" '
       '-af "highpass=f=800,afade=t=out:st=0.8:d=0.4" public/ep01/sfx/estatica.wav')
    # batida no piso: tom grave com ataque e queda rápida
    sh('ffmpeg -y -v error -f lavfi -i "sine=f=85:d=0.5" '
       '-af "afade=t=out:st=0.05:d=0.45,volume=2.2" public/ep01/sfx/batida.wav')

def main():
    sfx()
    clipes, cursor = [], INICIO
    for f in FALAS:
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
        cursor += dur + (GAP_NARRADOR if f["p"] == "Narrador" else GAP)
    total = cursor - GAP + CAUDA

    # Cenas: intervalos de tempo com fundo e enquadramento próprios.
    def inicio_de(n): return next(c["inicio"] for c in clipes if c["n"] == n)
    def fim_de(n): return next(c["fim"] for c in clipes if c["n"] == n)
    cenas = [
        {"id": "gancho", "de": 0, "ate": inicio_de("02") - 0.3, "fundo": "sala", "sino": 0.2},
        {"id": "terceiro_dia", "de": inicio_de("02") - 0.3, "ate": inicio_de("05") - 0.3, "fundo": "patio", "zumbis": True},
        {"id": "porta", "de": inicio_de("05") - 0.3, "ate": inicio_de("08") - 0.3, "fundo": "sala", "barricada": True},
        {"id": "sinal", "de": inicio_de("08") - 0.3, "ate": inicio_de("11") - 0.3, "fundo": "sala", "relogio": "03:17", "sino": inicio_de("08")},
        {"id": "confronto", "de": inicio_de("11") - 0.3, "ate": inicio_de("15") - 0.3, "fundo": "sala", "confronto": True},
        {"id": "subsolo", "de": inicio_de("15") - 0.3, "ate": total, "fundo": "subsolo", "batidas": [fim_de("17") + 0.8, fim_de("17") + 1.6, fim_de("17") + 2.4]},
    ]
    manifesto = {"fps": FPS, "duracao": round(total, 3), "falas": clipes, "cenas": cenas,
                 "estatica": [c["inicio"] for c in clipes if c["p"] == "Helena"]}
    os.makedirs("src/ep01", exist_ok=True)
    json.dump(manifesto, open("src/ep01/manifest.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("duracao total:", round(total, 2), "s")
    for c in clipes:
        print(c["n"], c["p"], c["inicio"], c["fim"])

if __name__ == "__main__":
    main()
