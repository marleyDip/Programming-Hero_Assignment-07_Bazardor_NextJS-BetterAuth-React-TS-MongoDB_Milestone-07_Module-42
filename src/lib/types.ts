export type TrendDirection = "up" | "down" | "flat";

export interface Category {
  id: string;
  slug: string;
  name: string; // Bangla name (nameBn)
  emoji: string;
}

export interface MarketPrice {
  name: string;
  division: string;
  min: number;
  max: number;
  avg: number;
}

export interface PriceHistory {
  today: number;
  yesterday: number | null;
  lastWeek: number | null;
  lastMonth: number | null;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  unit: string; // already formatted, e.g. "প্রতি কেজি"
  category: string; // category slug
  categoryName: string;
  categoryEmoji: string;
  price: number; // today's price
  history: PriceHistory;
  change: number; // signed percent (+2.1 / -1.4)
  trend: TrendDirection;
  min: number;
  max: number;
  avg: number;
  markets: MarketPrice[];
}
