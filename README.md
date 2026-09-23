# JP Assessoria Acadêmica: landing page

Landing page de conversão (WhatsApp) para assessoria acadêmica. Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, GSAP + ScrollTrigger + SplitText, Lenis.

## Comandos

```bash
pnpm dev        # desenvolvimento
pnpm build      # build de produção
pnpm start      # servir o build
pnpm lint       # biome check
pnpm typecheck  # tsc --noEmit
pnpm test       # vitest (lógica em src/lib)
```

## Configuração

Ver `docs/ENV.md` (variáveis) e `docs/SEARCH_CONSOLE.md` (publicação e indexação).

## Estrutura

```text
src/
  app/            rotas, metadata, robots, sitemap, manifest, OG/Twitter image, 404
  components/
    layout/       Header, Footer
    sections/     Hero, Stats, ChaosToOrder, Services, BeforeAfter, Chapters (Process + Trust + Faq), FinalCta
    motion/       ilhas client com GSAP (uma por seção) + SmoothScroll + MotionRuntime
    ui/           WhatsAppLink, Backdrop
    seo/          JsonLd
    analytics/    AnalyticsListener (dataLayer)
  content/        landing.ts (toda a copy), media.ts (fotos + créditos)
  lib/            env, site, seo, routes, whatsapp, analytics, gsap, motion, reveal, dom, og
```

## Conteúdo e marca

- Nome da marca: `SITE_NAME` em `src/lib/site.ts` (placeholder "JP Assessoria Acadêmica").
- Toda a copy da página está em `src/content/landing.ts`.
- Fotos: placeholders do Unsplash em `src/content/media.ts`. Para trocar por fotos próprias, coloque os arquivos em `public/` e ajuste `src`, `width`, `height`, `alt` e remova o crédito; `images.remotePatterns` em `next.config.ts` pode ser removido depois.
- Números da seção de estatísticas (`STATS` em `landing.ts`) vieram do material de divulgação do cliente e devem ser mantidos verdadeiros.

## Motion

Cada seção que anima é envolvida por uma ilha client (`src/components/motion/*Motion.tsx`) que usa `useGSAP` + `gsap.matchMedia()`. Sem JS ou com `prefers-reduced-motion`, o layout estático é servido pelo CSS; o atributo `data-motion="on"` (ligado pelo JS) ativa os layouts pinados. Breakpoint de motion desktop/mobile: 900px (`src/lib/motion.ts`).
