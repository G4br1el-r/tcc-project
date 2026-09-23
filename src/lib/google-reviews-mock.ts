import type { GooglePlaceReviews } from "./google-reviews";

const FICTITIOUS_AVATAR = null;
const FICTITIOUS_URL = null;

export const MOCK_REVIEWS_PLACE: GooglePlaceReviews = {
  rating: 4.9,
  total: 47,
  mapsUrl: FICTITIOUS_URL,
  reviews: [
    {
      id: "exemplo-1",
      author: "Ana Beatriz",
      authorUrl: FICTITIOUS_URL,
      authorPhotoUrl: FICTITIOUS_AVATAR,
      rating: 5,
      text: "Acompanhamento muito próximo do início ao fim, com prazos cumpridos e clareza em cada etapa da revisão.",
      relativeTime: "há 2 semanas",
      reviewUrl: FICTITIOUS_URL,
    },
    {
      id: "exemplo-2",
      author: "Rafael Costa",
      authorUrl: FICTITIOUS_URL,
      authorPhotoUrl: FICTITIOUS_AVATAR,
      rating: 5,
      text: "Formatação ABNT impecável e suporte rápido pelo WhatsApp sempre que precisei tirar dúvidas.",
      relativeTime: "há 1 mês",
      reviewUrl: FICTITIOUS_URL,
    },
    {
      id: "exemplo-3",
      author: "Camila Ferreira",
      authorUrl: FICTITIOUS_URL,
      authorPhotoUrl: FICTITIOUS_AVATAR,
      rating: 4,
      text: "Peguei o trabalho já no meio do caminho e eles conseguiram organizar tudo dentro do prazo apertado que eu tinha.",
      relativeTime: "há 2 meses",
      reviewUrl: FICTITIOUS_URL,
    },
    {
      id: "exemplo-4",
      author: "Lucas Almeida",
      authorUrl: FICTITIOUS_URL,
      authorPhotoUrl: FICTITIOUS_AVATAR,
      rating: 5,
      text: "Fiz só a revisão e a verificação de similaridade. Entregaram no prazo e com observações bem claras do que precisava ajustar.",
      relativeTime: "há 3 meses",
      reviewUrl: FICTITIOUS_URL,
    },
    {
      id: "exemplo-5",
      author: "Beatriz Lima",
      authorUrl: FICTITIOUS_URL,
      authorPhotoUrl: FICTITIOUS_AVATAR,
      rating: 5,
      text: "Atendimento sempre educado e direto ao ponto. Deu pra entender cada etapa do trabalho sem complicação.",
      relativeTime: "há 4 meses",
      reviewUrl: FICTITIOUS_URL,
    },
  ],
};
