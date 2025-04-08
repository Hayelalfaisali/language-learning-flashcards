
export interface Card {
  id: string;
  front: string;
  back: string;
  lastReviewed: string | null;
  nextReview: string | null;
  level: number; // Familiarity level (0-5)
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  cards: Card[];
}
