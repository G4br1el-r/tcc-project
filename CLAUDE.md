# CLAUDE.md — Regras permanentes do projeto

Leia este arquivo antes de alterar o projeto.

## 1. Norte do projeto

Landing page premium para serviço acadêmico, com foco em:

- conversão;
- clareza;
- confiança;
- direção visual sofisticada;
- motion de alto nível;
- performance;
- SEO;
- acessibilidade.

Referência de qualidade: experiências editoriais/motion de alto nível como MotionSites/Awwwards, sem copiar layout, identidade, animações ou conteúdo de terceiros.

## 2. Direção visual

A interface deve ser:

- clean;
- minimalista;
- editorial;
- premium;
- espaçosa;
- tipograficamente forte;
- intencional.

Evitar:

- excesso de cards;
- glow/neon gratuito;
- glassmorphism genérico;
- aparência de dashboard/SaaS;
- excesso de ícones;
- visual “cara de IA”;
- decoração sem função.

Sempre preferir menos elementos com mais intenção.

## 3. Storytelling

Narrativa principal:

```text
CAOS
→ DIREÇÃO
→ PROCESSO
→ CONFIANÇA
→ AÇÃO
```

Toda seção deve contribuir para essa narrativa.

## 4. Conversão

Objetivo principal: gerar contato qualificado pelo WhatsApp.

Priorizar:

1. proposta clara;
2. redução de objeções;
3. prova/credibilidade quando houver dados reais;
4. processo compreensível;
5. CTA contextual;
6. baixa fricção.

Nunca inventar métricas, depoimentos, clientes, certificações ou resultados.

## 5. Stack

Base obrigatória:

- Next.js;
- React;
- TypeScript;
- App Router;
- GSAP;
- ScrollTrigger.

Server Components por padrão.

Client Components somente quando interação/motion exigir.

## 6. Motion

GSAP + ScrollTrigger são a base de motion.

Usar quando fizer sentido:

- pin;
- scrub;
- timelines;
- masks;
- text reveal;
- scale;
- parallax;
- transições contínuas.

Motion deve servir à narrativa.

Obrigatório:

- cleanup correto;
- `gsap.context()` quando aplicável;
- `gsap.matchMedia()` para responsividade;
- `prefers-reduced-motion`;
- evitar scroll-jacking agressivo;
- adaptar pins e timelines para mobile.

## 7. Performance

Performance é requisito de produto.

Priorizar:

- baixo JS;
- pouco client-side;
- imagens/fontes otimizadas;
- transform/opacity para motion;
- evitar layout shift;
- evitar bibliotecas redundantes;
- evitar efeitos caros em áreas grandes.

Referência:

- LCP <= 2.5s;
- CLS <= 0.1;
- INP <= 200ms.

## 8. SEO

SEO técnico e indexabilidade são obrigatórios desde o início.

Manter:

- Metadata API;
- canonical;
- Open Graph;
- robots;
- sitemap;
- HTML semântico;
- heading hierarchy;
- alt text;
- links rastreáveis;
- JSON-LD quando adequado;
- conteúdo principal disponível sem depender de interação JS.

Preparar integração com Google Search Console.

Nunca prometer indexação garantida.

## 9. Documentação atualizada

Usar Context7 antes de implementar APIs/bibliotecas que possam ter mudado, especialmente:

- Next.js;
- React;
- GSAP;
- ScrollTrigger;
- Metadata API;
- robots/sitemap;
- bibliotecas novas.

Não implementar API antiga por memória quando houver documentação atual disponível.

## 10. Skills

Antes de tarefa especializada, usar FindSkills para localizar a skill mais competente.

Escolher poucas skills altamente relevantes.

Não carregar dezenas de skills similares.

## 11. Orquestração de subagents

O agente principal é o orquestrador e integrador final.

Ele tem autonomia para criar/reutilizar subagents quando houver benefício real de:

- especialização;
- contexto isolado;
- paralelismo;
- análise extensa;
- revisão independente.

### Regra inegociável

```text
UM AGENTE = UM OBJETIVO
```

Nunca criar agente com múltiplas responsabilidades.

Se houver três objetivos independentes, usar até três agentes especializados.

Não criar subagent para tarefa trivial, edição pequena ou trabalho que dependa integralmente do contexto atual.

Antes de criar um agente permanente, verificar se já existe em:

```text
.claude/agents/
```

Definições recorrentes de subagents pertencem a:

```text
.claude/agents/<nome-do-agente>.md
```

A política completa de delegação está em:

```text
.claude/rules/agent-orchestration.md
```

O agente principal continua responsável por:

1. decompor;
2. delegar;
3. integrar;
4. resolver conflitos;
5. validar;
6. entregar.

Por padrão, preferir subagents coordenados pelo agente principal em vez de Agent Teams.

## 12. Código

- TypeScript estrito;
- sem `any` desnecessário;
- sem código morto;
- sem logs de debug em produção;
- sem dependência sem uso;
- nomes semânticos;
- componentes focados;
- HTML semântico;
- acessibilidade nativa primeiro.

## 13. Mobile

Mobile deve ser projetado, não apenas empilhado.

Revisar pelo menos:

- 360px;
- 390px;
- 430px;
- tablet.

Pins podem ser reduzidos ou substituídos quando necessário.

## 14. Validação

Antes de concluir tarefa relevante, rodar quando aplicável:

```bash
lint
typecheck
build
```

Também revisar:

- console;
- hydration;
- responsive;
- SEO;
- motion;
- performance;
- acessibilidade.

## 15. Definição de pronto

Uma tarefa só está pronta quando:

- funciona;
- está visualmente refinada;
- respeita o briefing;
- não quebra mobile;
- mantém performance;
- mantém SEO;
- mantém acessibilidade;
- integra-se à narrativa;
- passou por validação final.

## 16. Regra final

Sempre otimizar a combinação:

```text
CLAREZA
+ CONVERSÃO
+ DESIGN
+ MOTION
+ PERFORMANCE
+ SEO
+ ACESSIBILIDADE
```
