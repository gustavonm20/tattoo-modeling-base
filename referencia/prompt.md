## Prompt para o Claude Code

Salve o HTML abaixo como index.html numa pasta vazia, abra o Claude Code nessa pasta e cole:


Neste diretório existe um index.html com a landing page "Vulto Ink" (portfólio de um tatuador fictício), feita em um único arquivo com Three.js r128 via CDN, shaders GLSL customizados, carrossel 3D em CSS, cartas que giram, baralho 3D, cursor com rastro e pós-processamento (aberração cromática, lente, onda de tinta no clique).

Quero transformar isso num projeto profissional, pronto para deploy, SEM perder nenhum efeito visual existente. Faça nesta ordem e me mostre o plano antes de começar:

1. ESTRUTURA
- Migre para Vite + JavaScript (sem framework).
- Separe em: index.html, src/styles/ (CSS por seção), src/scenes/ (hero.js, sacred-geometry.js), src/shaders/ (arquivos .glsl importados via plugin ou ?raw), src/components/ (carousel.js, deck.js, cursor.js, form.js, scramble.js, marquee.js) e src/art/ (gerador procedural das artes).
- Instale three, gsap e lenis via npm em vez de CDN. Atualize o Three.js para a versão atual e corrija as APIs que mudaram.

2. EFEITOS DE SCROLL (o que não dava para fazer no preview)
- Scroll suave com Lenis integrado ao GSAP ScrollTrigger.
- A câmera da cena do hero deve recuar e girar conforme o scroll, e a forma de tinta deve se dissolver em partículas ao sair da tela.
- Revelações das seções disparadas pelo ScrollTrigger, mantendo o estilo atual (rotateX + translateY).
- O carrossel 3D do portfólio gira também com o scroll enquanto a seção está fixada (pin).
- O baralho do processo avança uma carta por etapa de scroll, com a seção fixada.
- Transição de "tinta se espalhando" (clip-path circular) entre as seções principais.

3. PERFORMANCE E QUALIDADE
- Pause cada cena WebGL fora da viewport, limite o pixel ratio e faça dispose correto de geometrias, materiais e render targets.
- Detecção de GPU fraca/mobile: reduza a contagem de partículas, a densidade da geometria e desative o pós-processamento.
- Respeite prefers-reduced-motion em todos os efeitos.
- Fallback estático elegante se o WebGL não estiver disponível.
- Lighthouse: mire em 90+ em Performance, Acessibilidade e SEO. Adicione meta tags, Open Graph, favicon e dados estruturados (LocalBusiness).

4. CONTEÚDO
- Deixe todos os textos, a lista de trabalhos do portfólio, os depoimentos, o FAQ e os links de contato num único arquivo src/content.js, para eu trocar facilmente.
- Prepare o portfólio para aceitar fotos reais (src/assets/portfolio/) com fallback para a arte procedural quando não houver imagem. Use imagens em WebP com lazy loading.
- O formulário deve montar uma mensagem e abrir o WhatsApp (wa.me) com os dados preenchidos, mantendo a validação atual.

5. FINALIZAÇÃO
- Rode o build, teste e corrija erros de console.
- Crie um README em português explicando como rodar, como editar o conteúdo e como publicar na Vercel ou Netlify.
- Faça commits pequenos e descritivos a cada etapa concluída.
