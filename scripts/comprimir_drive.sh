#!/usr/bin/env bash
# Gera uma cópia leve do vídeo para enviar ao Google Drive a partir da sessão.
# Uso: scripts/comprimir_drive.sh ENTRADA SAIDA [MB] [ALTURA]
#   MB: tamanho máximo do arquivo (padrão 2.9; o envio daqui aceita cerca de 3 MB)
#   ALTURA: altura do vídeo em pixels (padrão 720)
# HEVC (H.265) com orçamento de bits calculado pela duração. É uma cópia de
# arquivo: para postar, use o MP4 original em qualidade máxima.
set -euo pipefail
entrada="$1"
saida="$2"
mb="${3:-2.9}"
altura="${4:-720}"
mkdir -p "$(dirname "$saida")"
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$entrada")
# Orçamento total em kb/s, 48 kb/s para o áudio, o resto para o vídeo.
video_k=$(python3 -c "print(max(60, int($mb*0.97*8*1024/$dur - 48)))")
ffmpeg -v error -y -i "$entrada" -vf "scale=-2:${altura}" \
  -c:v libx265 -preset slow -b:v "${video_k}k" -maxrate "$((video_k * 14 / 10))k" -bufsize "$((video_k * 25 / 10))k" \
  -tag:v hvc1 -pix_fmt yuv420p -x265-params log-level=error \
  -c:a aac -b:a 48k -ac 1 -movflags +faststart "$saida"
tamanho=$(stat -c %s "$saida")
limite=$(python3 -c "print(int($mb*1024*1024))")
echo "$saida: $((tamanho / 1024)) KB (vídeo a ${video_k} kb/s, ${altura}p)"
if [ "$tamanho" -gt "$limite" ]; then echo "ERRO: acima de ${mb} MB" >&2; exit 1; fi
