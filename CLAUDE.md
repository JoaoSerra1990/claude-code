# Projeto: animações verticais para TikTok (Remotion)

Vídeos 9:16 (1080x1920, 30 fps) feitos 100% por código: bonecos SVG, cenários SVG,
câmera e atuação definidas plano a plano. Vozes, efeitos e trilhas vêm da API do
ElevenLabs. O usuário escreve em português e manda roteiros em PDF.

## Preferências do usuário (seguir sempre)
- Falas, legendas e pausas na velocidade **1.1x** (`VELOCIDADE` em `scripts/preparar.py`).
- **Legendas sempre ligadas**, mesmo se o roteiro disser para não ter.
- Pode passar de 90 s; não cortar texto do roteiro para caber.
- Direção com **atuação e câmera**: closes, expressões, movimento, acontecimentos
  visuais. Nunca personagens parados em fila com o texto fazendo o trabalho.
- Boca só mexe em quem está falando; voz que sai de rádio/alto-falante não mexe a boca de ninguém.
- Não inventar falas novas sem aprovação; seguir a ordem das falas do roteiro.
- Nada de clonar voz de pessoa real; não copiar personagens de marcas (ex.: Gravity Falls, filmes).
- Quando algo der errado ou fugir do roteiro, dizer claramente na resposta.

## Entrega
- Renderizar em alta (`npx remotion render <Id> out/<projeto>/<projeto>.mp4`) e enviar o MP4 no chat.
- **Não subir vídeos no Google Drive**: o conector só aceita ~3 MB por envio, e o usuário
  baixa o vídeo em alta pelo chat. (Pastas do Drive em `scripts/drive.json`, só para referência.)
- Conferir quadros (contact sheet com ffmpeg) antes de entregar; avisar que o áudio não foi ouvido.
- Commitar e dar push a cada etapa concluída, na branch de trabalho.

## Como fazer um vídeo novo
1. Falas em `episodios/<projeto>_falas.json` (`n`, `p` personagem, `emo` tags de emoção em
   inglês entre colchetes, `t` texto; `voz` opcional para reaproveitar outra voz; `filtro`
   opcional: `radio` ou `memoria`).
2. `python3 scripts/gerar_falas.py episodios/<projeto>_falas.json out/<projeto>/falas`
   (modelo `eleven_v3`, com tempo de cada palavra).
3. Pausas por projeto em `PROJETOS` de `scripts/preparar.py`, depois
   `python3 scripts/preparar.py <projeto>` → `src/<projeto>/manifest.json`.
4. Efeitos: `POST /v1/sound-generation`; trilha original: `POST /v1/music`. Salvar em
   `public/<projeto>/sfx/`. A chave do ElevenLabs é injetada pelo proxy (não há variável).
5. Planos em `src/<projeto>/<Nome>.tsx` usando o motor `src/serie/motor.tsx`
   (`Episodio`, `Shot`, `Bloco`, `est`, `tempos().pal(fala, prefixo)` para marcar tempos
   pela palavra falada). Registrar a composição em `src/Root.tsx`.
6. Prévia: `npx remotion render <Id> out/<projeto>/previa.mp4 --scale 0.4`.

Cuidado com `pal()`: ele pega a **primeira** palavra que começa com o prefixo
("no" casa com "noite", "um" com "uma"). Use prefixos únicos.

## Peças principais
- `src/serie/Ator.tsx`: boneco (expressões, poses, olhar, piscar, fala, andar, lágrima,
  olhos fechados, negar com a cabeça, chapéu, cicatriz, mochila, casaco, barba).
- `src/serie/motor.tsx`: câmera, luz, atores, hologramas sobre a cabeça, dissolver em luz,
  legendas e áudio.
- Cenários: `src/serie/cenarios.tsx` (O Último Sinal), `src/mare/cenarios.tsx`
  (A Última Maré), `src/minutos`, `src/trem`, `src/cidade`, `src/curtas/futurista.tsx`
  (cidade futurista compartilhada).

## Vozes (`scripts/elenco.json`, conta no plano Starter)
Narrador fixo em todos os vídeos (voz grave aprovada). Vozes brasileiras da biblioteca
para os personagens; personagens novos reaproveitam essas vozes pelo campo `voz`.

## Produções
- **O Último Sinal** (série, escola + zumbis): ep01, ep02 prontos. Ep03 aguarda roteiro.
- **A Última Maré** (série, tsunami): mare01, mare02 prontos. Lucas, Marina e Bia com elenco
  fixo em `src/mare01/Mare01.tsx` (`ELENCO_MARE`). Pendência: figurino da Bia (roteiro diz
  casaco rosa; ep01 mostra branco).
- **Curtas**: O Menino que Vendia Minutos (`minutos`), O Trem das 3h17 (`trem`),
  A Cidade Sem Amanhã (`cidade`), O Homem que Escondeu o Tempo (`tempo`),
  O Homem que Matou Seu Futuro (`futuro`).

## Fila em andamento: roteiros do Drive (Animacoes/Curtas/Roteiros, id 1vV0vXvNB3VFAndJpngn_3RqYNN3JsYQJ)
O usuário pediu para gerar todos, um por vez, no estilo de sempre, e continuar de onde parou
quando o limite de uso voltar. Ordem e situação (atualizar a cada curta):
- 06 O Abismo (`abismo`): pronto e entregue no chat.
- 07 O Labirinto dos Esquecidos (`labirinto`): pronto e entregue no chat.
- 08 Os Últimos Oito Minutos (`oito`): pronto e entregue no chat.
- 09 O Último Andar (`andar`): pronto e entregue no chat.
- 10 A Última Repetição (`repete`): cenas prontas e conferidas; falta render final (`npx remotion render Repete out/repete/repete.mp4`) e envio. Trilha reaproveitada (oito).
- 11 A Cidade de Mentira, 12 O Mundo em Silêncio, 13 O Último Sonho,
  14 Quando a Névoa Chegou, 15 Dez Minutos de Eternidade, 16 Os Homens do Destino,
  17 Os Filhos da Noite: a fazer.
Créditos do ElevenLabs estão curtos (ver `/v1/user/subscription`): a partir do 09, gerar só a narração e reaproveitar trilhas e efeitos de `public/*/sfx`.
Custos medidos: narração eleven_v3 ≈ 0,5 crédito por caractere (~600 por curta). Reaproveitar
efeitos de `public/*/sfx` e gerar só o que faltar com `scripts/gerar_sons.py`
(`episodios/<projeto>_sons.json`). Conferência: `scripts/folha.sh out/<projeto>/previa.mp4`.
