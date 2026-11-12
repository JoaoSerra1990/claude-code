"""Gera efeitos sonoros e trilha original via API do ElevenLabs.

Uso: python3 scripts/gerar_sons.py episodios/<projeto>_sons.json
O arquivo traz {"sfx": {nome: [descrição em inglês, segundos]}, "musica": [descrição, segundos]}.
Salva em public/<projeto>/sfx/<nome>.mp3 e pula o que já existe.
"""
import json, os, sys, urllib.request

API = "https://api.elevenlabs.io/v1"

def post(caminho, corpo, saida):
    req = urllib.request.Request(f"{API}/{caminho}", data=json.dumps(corpo).encode(),
                                 headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=600) as r:
        open(saida, "wb").write(r.read())

def main(entrada):
    projeto = os.path.basename(entrada).replace("_sons.json", "")
    spec = json.load(open(entrada, encoding="utf-8"))
    pasta = f"public/{projeto}/sfx"
    os.makedirs(pasta, exist_ok=True)
    for nome, (texto, seg) in spec.get("sfx", {}).items():
        saida = f"{pasta}/{nome}.mp3"
        if not os.path.exists(saida):
            post("sound-generation", {"text": texto, "duration_seconds": seg, "prompt_influence": 0.4}, saida)
        print("ok", nome, flush=True)
    if "musica" in spec and not os.path.exists(f"{pasta}/musica.mp3"):
        texto, seg = spec["musica"]
        post("music", {"prompt": texto, "music_length_ms": int(seg * 1000)}, f"{pasta}/musica.mp3")
        print("ok musica", flush=True)

if __name__ == "__main__":
    main(sys.argv[1])
