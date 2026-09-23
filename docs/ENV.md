# Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha.

| Variável | Obrigatória | Uso |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Sim (produção) | Origem absoluta do site (`https://dominio.com.br`). Base para canonical, Open Graph, sitemap, robots e JSON-LD. Sem ela, fora da Vercel, o site fica com `noindex` e `robots.txt` bloqueando tudo. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Sim | Número no formato internacional, só dígitos ou com máscara (`+55 11 99999-9999`). Sem número válido, todos os CTAs apontam para `/#contato` (âncora da página) em vez de abrir o WhatsApp. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Não | Token da tag `google-site-verification` do Search Console. |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Não | Token `msvalidate.01` do Bing Webmaster Tools. |

## Regras de indexação

`src/lib/env.ts` decide se o site é indexável:

- Na Vercel: só `VERCEL_ENV=production` é indexável (previews recebem `noindex` e `Disallow: /`).
- Fora da Vercel: exige `NODE_ENV=production` **e** `NEXT_PUBLIC_SITE_URL` válida.

Na Vercel, se `NEXT_PUBLIC_SITE_URL` não for definida, `VERCEL_PROJECT_PRODUCTION_URL` é usada como fallback.

## Analytics

Os eventos são enviados para `window.dataLayer` (`src/lib/analytics.ts`). Basta instalar o Google Tag Manager (ou qualquer tag que leia o `dataLayer`) para capturá-los. Nenhum ID de tracking está no código.

Eventos: `click_whatsapp_header`, `click_whatsapp_hero`, `click_whatsapp_service` (com `item_id`), `click_whatsapp_process`, `click_whatsapp_faq`, `click_whatsapp_final`, `click_hero_how_it_works`, `faq_open` (com `item_id`), `service_view` (com `service_id`), `scroll_depth_50`, `scroll_depth_90`.
