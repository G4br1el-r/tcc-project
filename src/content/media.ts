export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  credit: { author: string; url: string };
};

const UNSPLASH_PARAMS = "auto=format&fit=max&w=2400&q=85";

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
    src: `https://images.unsplash.com/photo-1680449786212-de3b835dc467?${UNSPLASH_PARAMS}`,
    alt: "Estante de biblioteca cheia de livros, em sombra.",
    width: 6000,
    height: 4000,
    credit: {
      author: "Spencer Scott Pugh",
      url: "https://unsplash.com/photos/CyMGg5QoyLw",
    },
  },
  before: {
    src: `https://images.unsplash.com/photo-1630561535290-24c621d6b463?${UNSPLASH_PARAMS}&sat=-40&exp=-12`,
    alt: "Mesa tomada por pilhas de papéis e pastas desorganizadas.",
    width: 5184,
    height: 3456,
    credit: {
      author: "Nick Sorockin",
      url: "https://unsplash.com/photos/VjyKHF6k0yQ",
    },
  },
  after: {
    src: `https://images.unsplash.com/photo-1582319193453-d841c7a5e586?${UNSPLASH_PARAMS}`,
    alt: "Caderno fechado e uma caneta sobre uma mesa limpa e organizada.",
    width: 5760,
    height: 3840,
    credit: {
      author: "Markus Spiske",
      url: "https://unsplash.com/photos/RiSAjGsa0vg",
    },
  },
  library: {
    src: `https://images.unsplash.com/photo-1704391904759-11e28009335d?${UNSPLASH_PARAMS}`,
    alt: "Biblioteca antiga com estantes de madeira e um lustre aceso.",
    width: 6000,
    height: 4000,
    credit: {
      author: "Jonathan Gong",
      url: "https://unsplash.com/photos/A32Uo8lf-JE",
    },
  },
} as const satisfies Record<string, Photo>;
