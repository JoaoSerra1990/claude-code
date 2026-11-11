#!/usr/bin/env bash
# Gera uma cópia do vídeo com menos de 10 MB para enviar ao Google Drive.
# Uso: scripts/comprimir_drive.sh out/trem/trem.mp4 out/drive/trem.mp4
# HEVC (H.265) a ~750 kb/s: num vídeo de 90 s fica perto de 9,7 MB.
# Para vídeos mais longos, a taxa é reduzida para caber no limite.
set -euo pipefail
entrada="$1"
saida="$2"
mkdir -p "$(dirname "$saida")"
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$entrada")
# 9,6 MB de orçamento, 80 kb/s para o áudio, o resto para o vídeo.
video_k=$(python3 -c "print(min(780, int(9.6*8*1024/$dur - 80)))")
ffmpeg -v error -y -i "$entrada" \
  -c:v libx265 -preset slow -b:v "${video_k}k" -maxrate "$((video_k * 14 / 10))k" -bufsize "$((video_k * 25 / 10))k" \
  -tag:v hvc1 -pix_fmt yuv420p -x265-params log-level=error \
  -c:a aac -b:a 80k -movflags +faststart "$saida"
tamanho=$(stat -c %s "$saida")
echo "$saida: $((tamanho / 1024)) KB (vídeo a ${video_k} kb/s)"
if [ "$tamanho" -ge 10485760 ]; then echo "ERRO: acima de 10 MB" >&2; exit 1; fi
