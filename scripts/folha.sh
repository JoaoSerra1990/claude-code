#!/bin/bash
# Folhas de contato para conferência: um quadro a cada N segundos.
# Uso: scripts/folha.sh out/<projeto>/previa.mp4 [intervalo=3]
v="$1"; n="${2:-3}"; d="$(dirname "$v")"
rm -f "$d"/folha_*.jpg
ffmpeg -y -v error -i "$v" -vf "fps=1/$n,scale=216:-1,tile=5x3" -q:v 4 "$d/folha_%02d.jpg"
ls "$d"/folha_*.jpg
