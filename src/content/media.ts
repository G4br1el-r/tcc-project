export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  credit?: { author: string; url: string };
};

const UNSPLASH_PARAMS = "auto=format&fit=max&w=2400&q=85";
const AUTHORIAL_WIDTH = 1672;
const AUTHORIAL_HEIGHT = 941;

export const PHOTOS = {
  hero: {
    src: `https://images.unsplash.com/photo-1523380262778-076eb862d38f?${UNSPLASH_PARAMS}`,
    alt: "Luminária acesa sobre uma mesa de estudos com um caderno aberto, em um quarto escuro.",
    width: 3000,
    height: 2000,
    credit: {
      author: "Beth Stevenson",
      url: "https://unsplash.com/photos/okUB5th8QtQ",
    },
  },
  shelves: {
    src: "/image/image-4.webp",
    alt: "Livros acadêmicos lado a lado, com marcadores coloridos entre as páginas, iluminados de lado na penumbra.",
    width: AUTHORIAL_WIDTH,
    height: AUTHORIAL_HEIGHT,
  },
  before: {
    src: "/image/image-2.webp",
    alt: "Mesa de estudos à noite tomada por pilhas de livros, papéis soltos, post-its, bolas de papel amassado e uma caneca de café.",
    width: AUTHORIAL_WIDTH,
    height: AUTHORIAL_HEIGHT,
  },
  after: {
    src: "/image/image-3.webp",
    alt: "A mesma mesa organizada: um trabalho encadernado no centro, uma caneta ao lado e dois livros alinhados, sob a luz da luminária.",
    width: AUTHORIAL_WIDTH,
    height: AUTHORIAL_HEIGHT,
  },
  library: {
    src: "/image/image-5.webp",
    alt: "Escritório escuro à noite com a mesa vazia e um trabalho encadernado sob a única luminária acesa.",
    width: AUTHORIAL_WIDTH,
    height: AUTHORIAL_HEIGHT,
  },
} as const satisfies Record<string, Photo>;
