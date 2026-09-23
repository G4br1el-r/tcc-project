# Google Search Console: passo a passo

O Google decide quando e se uma URL será indexada. Os passos abaixo preparam o site e pedem a indexação; não garantem posição nem prazo.

## 1. Publicar

1. Defina `NEXT_PUBLIC_SITE_URL` e `NEXT_PUBLIC_WHATSAPP_NUMBER` no ambiente de produção (ver `docs/ENV.md`).
2. Faça o deploy e confirme:
   - `https://SEU-DOMINIO/robots.txt` mostra `Allow: /` e a linha `Sitemap:`;
   - `https://SEU-DOMINIO/sitemap.xml` lista a home;
   - o HTML da home não contém `<meta name="robots" content="noindex">`.

## 2. Verificar o domínio

1. Acesse [search.google.com/search-console](https://search.google.com/search-console) e adicione a propriedade.
   - **Domínio** (recomendado): verificação por registro TXT no DNS.
   - **Prefixo de URL**: use a tag HTML. Copie só o valor de `content` e coloque em `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`; faça novo deploy e clique em Verificar.

## 3. Enviar o sitemap

Em **Sitemaps**, informe `sitemap.xml` e envie.

## 4. Pedir indexação da home

Em **Inspeção de URL**, cole a URL da home, aguarde o teste e clique em **Solicitar indexação**. Repita para novas páginas quando existirem.

## 5. Acompanhar

- **Páginas** (cobertura): confirme que a home aparece como indexada; investigue erros e exclusões.
- **Core Web Vitals** e **Experiência na página**: dados reais de LCP, CLS e INP chegam depois de alguns dias de tráfego.
- **Desempenho**: consultas, cliques e impressões.
- **Aprimoramentos**: valide o JSON-LD no [Teste de pesquisa aprimorada](https://search.google.com/test/rich-results) ou no [validator.schema.org](https://validator.schema.org/).

## Ao criar novas páginas

Adicione a rota em `src/lib/routes.ts` (`PUBLIC_ROUTES`): o sitemap é gerado a partir dessa lista. Cada página deve exportar `metadata` com `buildPageMetadata("/caminho")` para canonical e Open Graph corretos.
