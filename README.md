# claude-code

Vídeos verticais (9:16) animados por código com [Remotion](https://www.remotion.dev):
boneco em SVG feito de formas simples, fundo de raios e legenda palavra por palavra.

## Uso

```bash
npm install
npm run dev      # abre o Remotion Studio para ver e ajustar as cenas
npm run render   # gera out/demo.mp4
```

Requer Node 18+; o Remotion já traz o próprio ffmpeg. Na primeira
renderização o Remotion baixa um Chromium próprio, a menos que `REMOTION_BROWSER`
aponte para um binário já instalado.

## Estrutura

- `src/Root.tsx` — lista de composições (um vídeo = uma composição).
- `src/scenes/` — cenas e vídeos; `Demo.tsx` é a cena de teste.
- `src/components/Character.tsx` — boneco, com poses `idle`, `wave`, `point`, `shrug`.
- `src/components/RaysBackground.tsx` — fundo de raios girando.
- `src/components/WordCaptions.tsx` — legenda sincronizada pelo tempo de cada palavra.
- `src/components/Tag.tsx` — etiqueta em pílula.
- `src/theme.ts` — cores, fonte e formato do vídeo.
