import type { Category, Product } from "@/lib/types";

export type SiteStats = {
  products: number;
  markets: number;
  categories: number;
};

/** Totals shown in the hero. Markets are counted once, even if many products list them. */
export function getSiteStats(
  products: Product[],
  categories: Category[],
): SiteStats {
  const markets = new Set<string>();

  for (const p of products) {
    for (const m of p.markets) markets.add(m.name.trim().toLowerCase());
  }

  const productCategories = new Set(
    products.map((p) => p.category).filter(Boolean),
  );

  return {
    products: products.length,
    markets: markets.size,
    categories: categories.length || productCategories.size,
  };
}
