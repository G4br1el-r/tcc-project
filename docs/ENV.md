# Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha.

| Variável | Obrigatória | Uso |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Sim (produção) | Origem absoluta do site (`https://dominio.com.br`). Base para canonical, Open Graph, sitemap, robots e JSON-LD. Sem ela, fora da Vercel, o site fica com `noindex` e `robots.txt` bloqueando tudo. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Sim | Número no formato internacional, só dígitos ou com máscara (`+55 11 99999-9999`). Sem número válido, todos os CTAs apontam para `/#contato` (âncora da página) em vez de abrir o WhatsApp. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Não | Token da tag `google-site-verification` do Search Console. |
| `TURSO_DATABASE_URL` | Sim | URL do banco no Turso (`libsql://...`). Sem ela o build falha, porque o FAQ é lido do banco. |
| `TURSO_AUTH_TOKEN` | Sim | Token de acesso do banco no Turso. |
| `BETTER_AUTH_SECRET` | Sim | Segredo que assina as sessões do painel. Gere com `openssl rand -base64 32`. Sem ele o build falha. |
| `GOOGLE_PLACES_API_KEY` | Não | Chave da Places API (New). Sem ela a seção de avaliações simplesmente não aparece. |
| `GOOGLE_PLACE_ID` | Não | Place ID do perfil da empresa no Google. |
| `ADMIN_NAME` / `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Só local | Usadas apenas pelo `pnpm db:seed` para criar o admin (ou trocar a senha dele). O login é feito por usuário (ex. `joao.paulo`), não por e-mail. A senha precisa ter pelo menos 12 caracteres. Não cadastre na Vercel. |

Todas as variáveis sem `NEXT_PUBLIC_` ficam só no servidor e nunca chegam ao navegador.

## Banco de dados (Turso)

Um único banco, o de produção. O desenvolvimento local usa o mesmo banco, então editar o FAQ no `/admin` rodando local já altera o site no ar.

1. Crie a conta em [turso.tech](https://turso.tech) (plano Free, sem cartão) e um banco.
2. Copie a URL do banco e gere um token. Coloque os dois no `.env.local` e nas Environment Variables da Vercel.
3. Na primeira vez, rode localmente, nesta ordem:

```bash
pnpm db:migrate
pnpm db:seed
```

- `db:migrate` cria as tabelas (migrações em `drizzle/`).
- `db:seed` insere as 9 perguntas originais do FAQ (só se a tabela estiver vazia) e cria o admin a partir de `ADMIN_*`. Rodar de novo com outra `ADMIN_PASSWORD` troca a senha (busca pelo `ADMIN_USERNAME`).

Quando o schema em `src/db/schema.ts` mudar: `pnpm db:generate` e depois `pnpm db:migrate`. As migrações nunca rodam no build da Vercel.

## Painel admin

- Login em `/admin/login`. Não existe cadastro público: o único usuário é o criado pelo seed.
- Em `/admin` dá para criar, editar, publicar/despublicar, reordenar e excluir perguntas. A landing atualiza assim que a alteração é salva.
- O login tem limite de 3 tentativas a cada 10 segundos por IP.
- `/admin` tem `noindex, nofollow`, e fica fora do `robots.txt` de propósito, para o Google conseguir ler o `noindex`. `/api/` é bloqueado no `robots.txt`.

## Avaliações do Google (custo zero)

As avaliações vêm ao vivo da Places API (New), sem cache: a política do Google não permite guardar o texto delas. A busca só acontece quando o visitante chega perto do capítulo "Confiança".

A consulta usa o SKU *Place Details Enterprise + Atmosphere*, com **1.000 chamadas grátis por mês** (renovadas todo mês). Para garantir custo zero:

1. No [Google Cloud Console](https://console.cloud.google.com), crie um projeto e ative a **Places API (New)**. O Google exige uma conta de faturamento com cartão, mesmo dentro da cota grátis.
2. Em **APIs e serviços → Credenciais**, crie uma chave de API e restrinja-a à **Places API (New)**.
3. Em **APIs e serviços → Places API (New) → Cotas**, limite as requisições de Place Details a **30 por dia** (no máximo cerca de 930 por mês). Passando disso o Google recusa e a seção some até o dia seguinte, sem cobrança.
4. Em **Faturamento → Orçamentos e alertas**, crie um orçamento baixo com alerta por e-mail.
5. Encontre o Place ID da empresa no [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id) e coloque em `GOOGLE_PLACE_ID`.

A seção mostra até 3 avaliações com nome, foto e link do autor, além do link "Ver todas no Google Maps", como exige a política de atribuição do Google.

## Vercel

Cadastre em **Settings → Environment Variables**: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `BETTER_AUTH_SECRET`, `GOOGLE_PLACES_API_KEY` e `GOOGLE_PLACE_ID`.

O plano Hobby é gratuito, mas os termos da Vercel o restringem a uso pessoal e não comercial.

## Regras de indexação

`src/lib/env.ts` decide se o site é indexável:

- Na Vercel: só `VERCEL_ENV=production` é indexável (previews recebem `noindex` e `Disallow: /`).
- Fora da Vercel: exige `NODE_ENV=production` **e** `NEXT_PUBLIC_SITE_URL` válida.

Na Vercel, se `NEXT_PUBLIC_SITE_URL` não for definida, `VERCEL_PROJECT_PRODUCTION_URL` é usada como fallback.

## Analytics

Os eventos são enviados para `window.dataLayer` (`src/lib/analytics.ts`). Basta instalar o Google Tag Manager (ou qualquer tag que leia o `dataLayer`) para capturá-los. Nenhum ID de tracking está no código.

Eventos: `click_whatsapp_header`, `click_whatsapp_hero`, `click_whatsapp_service` (com `item_id`), `click_whatsapp_process`, `click_whatsapp_faq`, `click_whatsapp_final`, `click_hero_how_it_works`, `faq_open` (com `item_id`), `service_view` (com `service_id`), `scroll_depth_50`, `scroll_depth_90`.
