export type ScatterSize = "sm" | "md" | "lg";

export type ScatteredWord = {
  label: string;
  x: string;
  y: string;
  rotate: string;
  size: ScatterSize;
};

export type FlowStep = { title: string; text: string };

export type Service = { id: string; name: string; description: string };

export type Stat = {
  id: string;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

export type ProcessStep = { title: string; text: string };

export type Principle = { title: string; text: string };

export type FaqItem = { id: string; question: string; answer: string };

export const NAV_LINKS = [
  { href: "/#servicos", label: "Serviços" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#duvidas", label: "Dúvidas" },
] as const;

export const HERO = {
  titleLines: ["Seu TCC não precisa", "dominar a sua vida."],
  lead: "Cuidamos do seu TCC, artigo ou projeto do tema à versão final: estrutura, escrita, ABNT e revisão. Você acompanha tudo pelo WhatsApp.",
  primaryCta: "Quero ajuda com meu trabalho",
  secondaryCta: "Entender como funciona",
  reassurance:
    "Todas as áreas. Prazos curtos sob análise. Pix ou cartão parcelado.",
  scrollHint: "Role para ver como funciona",
} as const;

export const STATS: ReadonlyArray<Stat> = [
  { id: "entregues", value: 1000, prefix: "+", label: "trabalhos entregues" },
  { id: "por-dia", value: 2, label: "projetos por dia, em média" },
  {
    id: "verificados",
    value: 100,
    suffix: "%",
    label: "dos trabalhos com verificação de similaridade",
  },
];

export const CHAOS = {
  title: "Quando tudo parece urgente, fica difícil saber por onde começar.",
  words: [
    { label: "prazo", x: "48", y: "44", rotate: "-4deg", size: "lg" },
    { label: "metodologia", x: "22", y: "12", rotate: "3deg", size: "md" },
    { label: "ABNT", x: "78", y: "18", rotate: "-2deg", size: "lg" },
    { label: "referências", x: "10", y: "58", rotate: "4deg", size: "md" },
    { label: "revisão", x: "62", y: "8", rotate: "-6deg", size: "sm" },
    { label: "correções", x: "86", y: "50", rotate: "5deg", size: "md" },
    { label: "orientador", x: "36", y: "28", rotate: "-3deg", size: "sm" },
    { label: "citações", x: "6", y: "30", rotate: "6deg", size: "sm" },
    { label: "apresentação", x: "58", y: "66", rotate: "-4deg", size: "md" },
    { label: "estrutura", x: "90", y: "78", rotate: "3deg", size: "sm" },
    { label: "banca", x: "24", y: "80", rotate: "-5deg", size: "lg" },
    { label: "sumário", x: "44", y: "6", rotate: "2deg", size: "sm" },
    { label: "resumo", x: "70", y: "36", rotate: "-3deg", size: "sm" },
    { label: "introdução", x: "14", y: "44", rotate: "5deg", size: "md" },
    { label: "cronograma", x: "66", y: "86", rotate: "-2deg", size: "md" },
    { label: "normas", x: "94", y: "8", rotate: "4deg", size: "sm" },
    { label: "capítulos", x: "40", y: "60", rotate: "-5deg", size: "sm" },
    { label: "bibliografia", x: "76", y: "60", rotate: "3deg", size: "md" },
    { label: "formatação", x: "4", y: "86", rotate: "-3deg", size: "sm" },
    { label: "defesa", x: "52", y: "24", rotate: "6deg", size: "lg" },
    { label: "similaridade", x: "30", y: "94", rotate: "-4deg", size: "sm" },
    { label: "justificativa", x: "84", y: "32", rotate: "2deg", size: "sm" },
  ] satisfies ReadonlyArray<ScatteredWord>,
} as const;

export const ORDER = {
  title: "Você não precisa resolver tudo de uma vez.",
  subtitle: "Precisa saber qual é o próximo passo.",
  steps: [
    {
      title: "Diagnóstico",
      text: "Entendemos o tema, o prazo e o que a sua instituição exige.",
    },
    {
      title: "Estrutura",
      text: "Definimos problema, objetivos, capítulos e metodologia.",
    },
    {
      title: "Desenvolvimento",
      text: "Pesquisa, escrita e referências, capítulo por capítulo.",
    },
    {
      title: "Revisão",
      text: "Texto, citações, similaridade e normas ABNT.",
    },
    {
      title: "Entrega",
      text: "Versão final pronta, no prazo combinado.",
    },
  ] satisfies ReadonlyArray<FlowStep>,
} as const;

export const SERVICES_INTRO = {
  title: "Cuidamos de tudo. Do tema à entrega.",
  text: "Contrate o trabalho completo ou só a etapa que falta.",
  itemCta: "Quero este serviço",
  undecidedText: "Não sabe o que precisa?",
  undecidedCta: "Descrever meu trabalho",
  scrollHint: "Role para ver os serviços",
} as const;

export const SERVICES: ReadonlyArray<Service> = [
  {
    id: "tcc-completo",
    name: "TCC completo",
    description:
      "Tema, projeto, desenvolvimento, formatação ABNT e revisão. Você recebe o trabalho pronto para entregar, acompanhando cada etapa.",
  },
  {
    id: "artigo-cientifico",
    name: "Artigo científico",
    description:
      "Estrutura, escrita e adequação às normas da revista ou do evento, pronto para submissão.",
  },
  {
    id: "projetos-integradores",
    name: "Projetos integradores",
    description:
      "Projeto, relatório e apresentação alinhados ao que o seu curso pede.",
  },
  {
    id: "formatacao-abnt",
    name: "Formatação ABNT",
    description:
      "Citações, referências, sumário, elementos pré-textuais e margens conforme o manual da sua instituição.",
  },
  {
    id: "revisao-correcao",
    name: "Revisão e correção",
    description:
      "Ortografia, gramática, coesão e clareza, com verificação de similaridade.",
  },
  {
    id: "metodologia-estrutura",
    name: "Metodologia e estrutura",
    description:
      "Problema, objetivos, justificativa e método definidos do jeito que o orientador pediu.",
  },
];

export const BEFORE_AFTER = {
  title: "Menos ruído. Mais direção.",
  beforeLabel: "Antes",
  afterLabel: "Depois",
  before: [
    "Prazo se aproximando",
    "Arquivos e versões espalhados",
    "Dúvidas sobre o que o orientador pediu",
    "Correções acumuladas",
    "Nenhuma estrutura definida",
  ],
  after: [
    "Etapas claras, com datas",
    "Um único documento organizado",
    "Pedidos do orientador resolvidos",
    "Correções feitas por prioridade",
    "Estrutura definida, capítulo por capítulo",
  ],
} as const;

export const PROCESS = {
  title: "Como funciona",
  text: "Sem formulário e sem burocracia. Uma conversa, um plano e o trabalho em andamento.",
  cta: "Contar minha situação",
  steps: [
    {
      title: "Você conta sua situação",
      text: "Pelo WhatsApp: tema, curso, prazo e em que ponto o trabalho está.",
    },
    {
      title: "Você recebe o orçamento",
      text: "Analisamos o material e enviamos etapas, prazo e valor antes de fechar.",
    },
    {
      title: "Começamos o trabalho",
      text: "Cada etapa é enviada para você acompanhar o andamento.",
    },
    {
      title: "Você entrega tranquilo",
      text: "Versão final revisada, formatada e dentro do prazo.",
    },
  ] satisfies ReadonlyArray<ProcessStep>,
} as const;

export const TRUST = {
  title: "Por que confiar na JP.",
  intro:
    "Prazo, originalidade e clareza em cada etapa, do orçamento à entrega.",
  principles: [
    {
      title: "Entrega no prazo combinado",
      text: "A data fica definida desde o orçamento.",
    },
    {
      title: "Originalidade verificada",
      text: "Todo trabalho passa por verificação de similaridade antes da entrega.",
    },
    {
      title: "Todas as áreas",
      text: "Saúde, direito, engenharia, educação, gestão e o que mais o seu curso exigir.",
    },
    {
      title: "Prazo curto? Analisamos",
      text: "Trabalhos urgentes são aceitos depois de avaliar o que dá para fazer com qualidade.",
    },
    {
      title: "Pagamento facilitado",
      text: "Pix ou cartão de crédito, com parcelamento no cartão.",
    },
  ] satisfies ReadonlyArray<Principle>,
} as const;

export const FAQ = {
  title: "Dúvidas frequentes",
  intro: "O que mais perguntam antes de começar.",
  closingText: "Não encontrou a sua dúvida?",
  closingCta: "Perguntar pelo WhatsApp",
  items: [
    {
      id: "completo",
      question: "Vocês fazem o trabalho completo?",
      answer:
        "Sim. Do tema à versão final, incluindo formatação ABNT, revisão e verificação de similaridade. Você acompanha o andamento pelo WhatsApp.",
    },
    {
      id: "prazo-curto",
      question: "Meu prazo é curto. Ainda dá tempo?",
      answer:
        "Depende do que falta fazer. Conte o prazo no primeiro contato: analisamos o material e respondemos com honestidade o que é possível dentro dele.",
    },
    {
      id: "trabalho-iniciado",
      question: "Já comecei o trabalho. Vocês pegam no meio?",
      answer:
        "Sim. Analisamos o que já existe, o que precisa de ajuste e seguimos de onde parou.",
    },
    {
      id: "somente-abnt",
      question: "Preciso só da formatação ABNT. Vocês fazem?",
      answer:
        "Sim. Formatação, revisão ou qualquer etapa específica podem ser contratadas separadamente.",
    },
    {
      id: "revisao",
      question: "Como funciona a revisão?",
      answer:
        "Revisamos ortografia, gramática, coesão, citações e referências, e fazemos verificação de similaridade para ajustar o que for necessário.",
    },
    {
      id: "atendimento",
      question: "Como é o atendimento?",
      answer:
        "Pelo WhatsApp, do primeiro contato até a entrega. Você sabe em que etapa o trabalho está e qual é o próximo passo.",
    },
    {
      id: "orcamento",
      question: "Quanto custa?",
      answer:
        "O valor depende do tipo de trabalho, da etapa, do volume e do prazo. Depois de entender a sua situação, enviamos um orçamento detalhado.",
    },
    {
      id: "areas",
      question: "Quais áreas vocês atendem?",
      answer: "Todas as áreas do conhecimento.",
    },
    {
      id: "pagamento",
      question: "Quais são as formas de pagamento?",
      answer: "Pix ou cartão de crédito, com parcelamento no cartão.",
    },
  ] satisfies ReadonlyArray<FaqItem>,
} as const;

export const FINAL_CTA = {
  title: "Seu próximo passo pode começar hoje.",
  text: "Mande um oi no WhatsApp com o tema e o prazo. Respondemos com o próximo passo.",
  cta: "Falar no WhatsApp",
} as const;

export const FOOTER = {
  statement:
    "Assessoria acadêmica completa para TCC, artigos científicos e projetos, do tema à versão final.",
} as const;
