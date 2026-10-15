# Vulto Ink

Landing page de portfólio para tatuador, feita com **Next.js + TypeScript**, **Three.js**, **GSAP ScrollTrigger** e **Lenis**.
O site é exportado como HTML estático (pasta `out/`) e pode ser publicado em qualquer hospedagem.

## Como rodar

Pré-requisito: Node.js 20 ou mais recente.

```bash
npm install        # instala as dependências
npm run dev        # ambiente de desenvolvimento em http://localhost:3000
npm run build      # gera o site estático em /out
npm start          # serve a pasta /out localmente para conferir o build
npm run typecheck  # verificação de tipos
```

## Como editar o conteúdo

Todos os textos ficam em **`src/content.ts`**: menu, hero, sobre, estilos, portfólio, processo, depoimentos, formulário, dúvidas, rodapé e contatos.

| O que mudar | Onde |
| --- | --- |
| Número do WhatsApp | `contact.whatsapp` (só números, com 55 e DDD) |
| Instagram | `contact.instagram` |
| Domínio do site (SEO, Open Graph, sitemap) | `site.url` |
| Trabalhos do portfólio | `portfolio.items` |
| Depoimentos | `testimonials.items` |
| Perguntas frequentes | `faq.items` |
| Mensagem enviada pelo WhatsApp | `booking.message` |

### Fotos reais no portfólio

1. Exporte a foto em **WebP**, retrato 3:4 (por exemplo, 900 × 1200 px).
2. Salve em `src/assets/portfolio/`, por exemplo `mandala-solar.webp`.
3. Em `src/content.ts`, importe a foto no topo e coloque-a no campo `image` do trabalho:

```ts
import mandala from '@/assets/portfolio/mandala-solar.webp';

// ...
{ style: 'blackwork', title: 'Mandala solar', description: '...', image: mandala },
```

Trabalho sem `image` usa a arte procedural do estilo (gerada em `src/art/procedural.ts`).
As fotos carregam com lazy loading.

### Formulário

O formulário valida os campos e abre o WhatsApp (`wa.me`) com a mensagem pronta. A pessoa só precisa tocar em enviar.
O wa.me não aceita anexos, então quem escolhe uma referência recebe na mensagem um aviso para enviar a imagem na conversa.

## Estrutura

```
src/
  app/            layout (metadados, fontes), página, imagem Open Graph, ícone, robots, sitemap
  content.ts      todo o conteúdo editável
  components/     seções e efeitos (Hero, Portfolio, Deck, BookingForm, SiteEffects...)
  scenes/         cenas Three.js (hero.ts, sacred-geometry.ts)
  shaders/        shaders GLSL (.glsl importados como texto)
  art/            gerador procedural das artes do portfólio
  lib/            GSAP/ScrollTrigger, ticker único, ponteiro, detecção de GPU, transição de tinta
  styles/         CSS por seção
  assets/portfolio/  fotos reais do portfólio
```

## Efeitos e acessibilidade

- **Scroll suave** com Lenis sincronizado ao ScrollTrigger, num único ticker do GSAP.
- **Hero:** a câmera recua e orbita com o scroll e a forma de tinta se desfaz em partículas ao sair da tela. Clicar dispara a onda de tinta no pós-processamento.
- **Portfólio:** a seção fica fixada enquanto o scroll dá uma volta no carrossel 3D.
- **Processo:** a seção fica fixada e cada etapa de scroll avança uma carta do baralho.
- **Transição de tinta:** as seções principais são reveladas por um clip-path circular.
- **Carregamento leve:** o hero abre com a forma em SVG. A cena 3D só carrega no primeiro gesto (mouse, toque, scroll ou tecla) e aparece com um fade.
- **Desempenho:** as cenas WebGL pausam fora da tela, o pixel ratio é limitado e os recursos são liberados (dispose) ao desmontar.
- **Qualidade adaptativa:** em celular ou GPU fraca, a cena usa menos partículas, geometria mais leve e nenhum pós-processamento.
- **Sem WebGL:** a forma e a geometria aparecem como SVG estático.
- **`prefers-reduced-motion`:** sem Lenis, pins, transições nem animações automáticas. Todo o conteúdo continua acessível.

> Dica: se o Windows estiver com "Efeitos de animação" desligados (Configurações › Acessibilidade › Efeitos visuais), o navegador avisa o site para reduzir o movimento. Nesse caso os pins e o scroll suave ficam desligados de propósito.

## Publicar

O build gera um site estático em `out/`.

### Vercel

1. Suba o projeto para um repositório no GitHub.
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório. O framework (Next.js) é detectado sozinho.
3. Clique em **Deploy**. O `vercel.json` já define os headers de cache e da imagem Open Graph.

Pela linha de comando: `npx vercel` e, para produção, `npx vercel --prod`.

### Netlify

1. Suba o projeto para um repositório no GitHub.
2. Em [app.netlify.com](https://app.netlify.com), escolha **Add new site › Import an existing project** e selecione o repositório.
3. O `netlify.toml` já define o comando (`npm run build`) e a pasta (`out`). Clique em **Deploy**.

Para publicar sem Git: rode `npm run build` e arraste a pasta `out/` para [app.netlify.com/drop](https://app.netlify.com/drop).

### Depois de publicar

Troque `site.url` em `src/content.ts` pelo domínio final e publique de novo. Os links do Open Graph, do sitemap e dos dados estruturados usam esse endereço.
