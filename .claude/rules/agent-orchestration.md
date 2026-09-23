# Agent Orchestration — política permanente

Esta regra complementa o `CLAUDE.md`.

## Princípio

O agente principal atua como orquestrador.

Subagents são trabalhadores especializados com contexto isolado.

A delegação deve melhorar qualidade, foco ou paralelismo — nunca existir por ritual.

## Regra absoluta

```text
1 agente = 1 objetivo = 1 definição de sucesso
```

Se a descrição do agente exigir várias responsabilidades independentes, dividir.

### Correto

```text
motion-gsap
Objetivo: implementar/revisar motion GSAP + ScrollTrigger.

seo-technical
Objetivo: garantir SEO técnico e indexabilidade.

performance-web
Objetivo: localizar e corrigir gargalos de performance.

cro-conversion
Objetivo: melhorar conversão da landing.

copy-conversion
Objetivo: refinar copy orientada à conversão.

accessibility-audit
Objetivo: auditar acessibilidade.

frontend-architecture
Objetivo: revisar arquitetura Next.js/React.

visual-qa
Objetivo: revisar acabamento visual e responsividade.
```

### Incorreto

```text
design-seo-motion
frontend-performance-copy
marketing-accessibility
```

## Quando delegar

Criar/reutilizar subagent quando a tarefa:

- pode rodar de forma independente;
- exige especialidade específica;
- exige leitura/análise extensa;
- se beneficia de contexto isolado;
- pode ser executada em paralelo;
- precisa de revisão independente;
- possui critério de sucesso verificável.

## Quando NÃO delegar

Trabalhar diretamente quando for:

- ajuste simples;
- edição pequena em um arquivo;
- busca trivial;
- rename;
- mudança sequencial totalmente dependente do contexto atual;
- tarefa em que delegar gera mais overhead que benefício.

## Autonomia

O agente principal pode criar subagents sem perguntar ao usuário quando:

1. a delegação está dentro do escopo solicitado;
2. não introduz mudança destrutiva fora do briefing;
3. há benefício real;
4. o agente tem um objetivo único;
5. existe critério de conclusão.

## Agentes permanentes

Especialidades recorrentes devem ser definidas em:

```text
.claude/agents/<kebab-case>.md
```

Antes de criar:

1. listar/verificar agentes existentes;
2. reutilizar agente compatível;
3. evitar duplicatas semânticas.

## Contrato mínimo de cada agente

Cada agente deve possuir:

```text
NOME
OBJETIVO ÚNICO
ESCOPO
ENTRADAS
FERRAMENTAS/SKILLS
RESTRIÇÕES
CRITÉRIO DE SUCESSO
FORMATO DE RETORNO
```

O objetivo deve caber em uma frase clara.

## Contexto

Passe somente o contexto necessário.

O subagent deve receber:

- objetivo exato;
- arquivos/áreas relevantes;
- restrições aplicáveis;
- critérios de sucesso;
- permissões de alteração;
- formato de retorno.

Não enviar histórico inteiro quando não for necessário.

Subagent não deve expandir silenciosamente o próprio escopo.

Achados fora do objetivo devem ser reportados ao orquestrador.

## Skills

Antes de tarefa especializada:

1. usar FindSkills;
2. encontrar a skill mais competente;
3. selecionar somente skills relevantes ao objetivo;
4. evitar múltiplas skills redundantes.

Exemplos:

```text
motion-gsap -> skill GSAP/motion
seo-technical -> skill SEO técnico
cro-conversion -> skill CRO
performance-web -> skill performance web
```

## Context7

Consultar Context7 quando a tarefa depender de documentação que possa mudar.

Prioridade:

- Next.js;
- React;
- GSAP;
- ScrollTrigger;
- Metadata API;
- robots;
- sitemap;
- bibliotecas externas.

## Paralelismo

Paralelizar somente objetivos independentes.

### Bom

```text
seo-technical
performance-web
accessibility-audit
```

podem auditar a mesma versão em paralelo.

### Sequencial

```text
frontend-architecture
↓
motion-gsap
```

Se motion depende da estrutura final, não executar antes.

## Concorrência de escrita

Evitar dois agentes alterando simultaneamente:

- mesmo arquivo;
- mesma seção;
- mesmo componente;
- mesma configuração global.

Quando houver risco:

1. um agente analisa;
2. retorna recomendações;
3. o orquestrador integra;

ou execute sequencialmente.

## Resultado esperado do subagent

Retorno objetivo:

```text
OBJETIVO
STATUS
ACHADOS
ALTERAÇÕES
ARQUIVOS AFETADOS
VALIDAÇÕES
RISCOS/PENDÊNCIAS
RECOMENDAÇÃO AO ORQUESTRADOR
```

Evitar texto genérico.

## Revisão independente

Para alterações relevantes, considerar separar implementação de revisão.

Exemplos:

```text
motion-gsap implementa
visual-qa revisa

frontend-architecture refatora
performance-web mede impacto

seo-technical implementa
orquestrador valida indexabilidade
```

O revisor também deve ter um único objetivo.

## Catálogo possível deste projeto

Criar somente conforme necessidade:

| Agent | Objetivo único |
|---|---|
| `art-direction` | direção/composição visual |
| `cro-conversion` | conversão |
| `copy-conversion` | copy |
| `motion-gsap` | GSAP/ScrollTrigger |
| `frontend-architecture` | arquitetura React/Next |
| `performance-web` | performance/Core Web Vitals |
| `seo-technical` | SEO técnico/indexabilidade |
| `accessibility-audit` | acessibilidade |
| `visual-qa` | acabamento visual/responsividade |

Não criar todos automaticamente.

## Anti-overengineering

Antes de delegar, avaliar:

```text
Este objetivo realmente se beneficia
de especialização, isolamento ou paralelismo?
```

Se não, trabalhar diretamente.

Poucos agentes específicos são melhores que muitos agentes redundantes.

## Responsabilidade do orquestrador

O agente principal:

1. entende a solicitação;
2. divide em objetivos;
3. decide o que delegar;
4. cria/reutiliza agentes;
5. coordena dependências;
6. integra resultados;
7. resolve conflitos;
8. valida o conjunto;
9. entrega a solução final.

Subagents não substituem a responsabilidade final do orquestrador.

## Subagents vs Agent Teams

Padrão deste projeto:

```text
MAIN ORCHESTRATOR
├── subagent objetivo A
├── subagent objetivo B
└── subagent objetivo C
```

Usar Agent Teams somente quando houver necessidade real de:

- sessões independentes;
- comunicação peer-to-peer;
- lista de tarefas compartilhada;
- coordenação distribuída ampla.

Para o trabalho normal deste projeto, preferir subagents.
