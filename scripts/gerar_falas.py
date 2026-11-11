"""Gera as falas do episódio via API do ElevenLabs.

Uso: python3 scripts/gerar_falas.py episodios/ep01_falas.json out/ep01/falas
A chave da API é injetada pelo proxy do ambiente; não é lida daqui.
"""
import json, os, sys, urllib.request, urllib.error, base64

ELENCO = json.load(open(os.path.join(os.path.dirname(__file__), "elenco.json"), encoding="utf-8"))
API = "https://api.elevenlabs.io/v1/text-to-speech"

def gerar(voice_id, texto, saida_mp3):
    body = json.dumps({"text": texto, "model_id": ELENCO["modelo"], "language_code": "pt"}).encode()
    req = urllib.request.Request(f"{API}/{voice_id}/with-timestamps", data=body,
                                 headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=120) as r:
        dados = json.load(r)
    with open(saida_mp3, "wb") as f:
        f.write(base64.b64decode(dados["audio_base64"]))
    return dados.get("alignment") or dados.get("normalized_alignment")

def main(entrada, pasta):
    os.makedirs(pasta, exist_ok=True)
    falas = json.load(open(entrada, encoding="utf-8"))
    for f in falas:
        nome = f"ep01_{f['n']}_{f['p'].lower().replace('í','i')}"
        texto = f"{f['emo']} {f['t']}"
        alinhamento = gerar(ELENCO["vozes"][f["p"]], texto, os.path.join(pasta, nome + ".mp3"))
        with open(os.path.join(pasta, nome + ".json"), "w", encoding="utf-8") as j:
            json.dump(alinhamento, j, ensure_ascii=False)
        print("ok", nome, flush=True)

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
