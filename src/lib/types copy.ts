export interface MarketPrice {
  market: string;
  division: string;
  min: number;
  max: number;
  price: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description?: string;
  emoji: string;
}

export interface Product {
  id: string | number;
  slug: string;
  name: string;
  emoji: string;
  image: string;
  category: string;
  categoryName: string;
  unit: string;
  price: number;
  change: number;
  changeDirection: "up" | "down" | "stable";
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  description: string;
  markets: MarketPrice[];
}

/* export interface MarketPrice {
  name: string;
  price: number;
  change?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  unit: string;
  category: string;
  tags: string[];
  description: string;
  price: number;
  change: number; // percent, +up / -down
  min: number;
  max: number;
  avg: number;
  markets: MarketPrice[];
}

export interface Category {
  slug: string;
  name: string;
  emoji: string;
} */

/* export type Category = {
  id?: string | number;
  slug: string;
  name: string;
  icon: string;
  description?: string;
}; */
