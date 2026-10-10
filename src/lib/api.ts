import { cache } from "react";
import type { Category, MarketPrice, Product, TrendDirection } from "./types";

// Config
const API_BASES = [
  process.env.NEXT_PUBLIC_API_BASE_1 ??
    "https://api.api-store.workers.dev/api/bazardor",
  process.env.NEXT_PUBLIC_API_BASE_2 ??
    "https://api.abcz.workers.dev/api/bazardor",
  process.env.NEXT_PUBLIC_API_BASE_3 ??
    "https://openapi.programming-hero.com/api/bazardor",
] as const;

// const API_BASES = [
//   process.env.NEXT_PUBLIC_API_BASE_3 ??
//     "https://openapi.programming-hero.com/api/bazardor",
// ] as const;

const REQUEST_TIMEOUT_MS = 8_000;
/** Prices change daily; cache for 5 minutes instead of `no-store`. */
const REVALIDATE_SECONDS = 300;

const UNIT_BN = {
  kg: "কেজি",
  kgs: "কেজি",
  liter: "লিটার",
  litre: "লিটার",
  ltr: "লিটার",
  l: "লিটার",
  dozen: "ডজন",
  doz: "ডজন",
  piece: "পিস",
  pieces: "পিস",
  pcs: "পিস",
  pc: "পিস",
} as const satisfies Record<string, string>;

const FALLBACK_EMOJI = "🛒";

// Raw API shapes
interface RawCategory {
  id: string;
  slug: string;
  nameBn: string;
  icon?: string;
}

interface RawMarket {
  market: string;
  division?: string;
  min: number;
  max: number;
}

interface RawProduct {
  id: number | string;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn?: string;
  categoryIcon?: string;
  unit?: string;
  image?: string;
  today: number;
  yesterday?: number;
  lastWeek?: number;
  lastMonth?: number;
  change?: { dir?: string; pct?: number };
  markets?: RawMarket[];
}

// Small helpers
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value.replace(/,/g, ""));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

const round = (n: number, digits = 2) => {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
};

/** Accepts `[...]` or `{ data | items | results | <key>: [...] }`. */
function unwrapList<T>(json: unknown, key: string): T[] {
  if (Array.isArray(json)) return json as T[];
  if (isRecord(json)) {
    for (const k of [key, "data", "items", "results"]) {
      const v = json[k];
      if (Array.isArray(v)) return v as T[];
    }
  }
  return [];
}

/** Accepts `{...}` or `{ data | item | result | <key>: {...} }`. */
function unwrapOne<T>(json: unknown, key: string): T | null {
  if (!isRecord(json)) return null;
  for (const k of [key, "data", "item", "result"]) {
    const v = json[k];
    if (isRecord(v)) return v as T;
  }
  return json as T;
}

function formatUnit(unit: string | undefined): string {
  const raw = unit?.trim();
  if (!raw) return "";
  const bn = (UNIT_BN as Record<string, string>)[raw.toLowerCase()] ?? raw;
  return bn.startsWith("প্রতি") ? bn : `প্রতি ${bn}`;
}

/** Emoji only: reject URLs / paths / data URIs. */
function pickEmoji(...candidates: (string | undefined)[]): string {
  for (const c of candidates) {
    if (c && c.length <= 8 && !/^(https?:|data:)|\//i.test(c)) return c;
  }
  return FALLBACK_EMOJI;
}

// API client (primary → fallback, with timeout)
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Tries each base URL in order. A 404 is definitive and stops the fallback.
 */
async function getJson(path: string): Promise<unknown> {
  let lastError: unknown = new ApiError("All API requests failed");

  for (const base of API_BASES) {
    try {
      const res = await fetch(`${base}${path}`, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        next: { revalidate: REVALIDATE_SECONDS },
      });

      if (res.status === 404) throw new ApiError("NOT_FOUND", 404);
      if (!res.ok) {
        throw new ApiError(
          `Request failed with status ${res.status}`,
          res.status,
        );
      }

      return await res.json();
    } catch (error) {
      lastError = error;
      if (error instanceof ApiError && error.status === 404) break;
    }
  }

  throw lastError;
}

// Normalizers
export function normalizeCategory(raw: RawCategory): Category {
  return {
    id: String(raw.id ?? raw.slug),
    slug: raw.slug ?? String(raw.id),
    name: raw.nameBn || raw.slug,
    emoji: pickEmoji(raw.icon),
  };
}

function normalizeMarket(raw: RawMarket): MarketPrice | null {
  const min = toNumber(raw.min);
  const max = toNumber(raw.max);
  if (!raw.market || min === null || max === null) return null;

  return {
    name: raw.market,
    division: raw.division ?? "",
    min,
    max,
    avg: round((min + max) / 2),
  };
}

function resolveTrend(dir: string | undefined, pct: number): TrendDirection {
  const d = dir?.toLowerCase();
  if (d === "up" || d === "down") return d;
  if (pct === 0) return "flat";
  return pct > 0 ? "up" : "down";
}

export function normalizeProduct(raw: RawProduct): Product {
  const markets = (raw.markets ?? [])
    .map(normalizeMarket)
    .filter((m): m is MarketPrice => m !== null);

  const today = toNumber(raw.today);
  const marketAvg = markets.length
    ? markets.reduce((sum, m) => sum + m.avg, 0) / markets.length
    : null;

  const price = today ?? (marketAvg !== null ? round(marketAvg) : 0);

  // Price change: API pct (signed by dir) → else derive from yesterday.
  const yesterday = toNumber(raw.yesterday);
  const apiPct = toNumber(raw.change?.pct);

  let change = 0;
  if (apiPct !== null) {
    change = Math.abs(apiPct);
    if (raw.change?.dir?.toLowerCase() === "down") change = -change;
  } else if (yesterday) {
    change = round(((price - yesterday) / yesterday) * 100, 1);
  }

  const id = String(raw.id);
  const categoryEmoji = pickEmoji(raw.categoryIcon);

  return {
    id,
    slug: raw.slug || id,
    name: raw.nameBn || "পণ্য",
    emoji: pickEmoji(raw.image, raw.categoryIcon),
    unit: formatUnit(raw.unit),
    category: raw.category ?? "",
    categoryName: raw.categoryNameBn ?? "",
    categoryEmoji,
    price,
    history: {
      today: price,
      yesterday,
      lastWeek: toNumber(raw.lastWeek),
      lastMonth: toNumber(raw.lastMonth),
    },
    change,
    trend: resolveTrend(raw.change?.dir, change),
    min: markets.length ? Math.min(...markets.map((m) => m.min)) : price,
    max: markets.length ? Math.max(...markets.map((m) => m.max)) : price,
    avg: marketAvg !== null ? round(marketAvg) : price,
    markets,
  };
}

// Public API
export const fetchCategories = cache(async (): Promise<Category[]> => {
  const json = await getJson("/categories");
  return unwrapList<RawCategory>(json, "categories").map(normalizeCategory);
});

export const fetchCategory = cache(
  async (slug: string): Promise<Category | null> => {
    try {
      const json = await getJson(`/categories/${encodeURIComponent(slug)}`);
      const raw = unwrapOne<RawCategory>(json, "category");
      return raw?.slug ? normalizeCategory(raw) : null;
    } catch {
      return null;
    }
  },
);

export const fetchProducts = cache(
  async (category?: string): Promise<Product[]> => {
    const query = category ? `?category=${encodeURIComponent(category)}` : "";
    const json = await getJson(`/products${query}`);
    return unwrapList<RawProduct>(json, "products").map(normalizeProduct);
  },
);

export const fetchProduct = cache(
  async (slug: string): Promise<Product | null> => {
    try {
      const json = await getJson(`/products/${encodeURIComponent(slug)}`);
      const raw = unwrapOne<RawProduct>(json, "product");
      if (raw?.slug || raw?.id) return normalizeProduct(raw);
    } catch (error) {
      // A definitive 404 means the product doesn't exist; skip the fallback.
      if (error instanceof ApiError && error.status === 404) return null;
    }

    // Fallback: search the full collection.
    try {
      const products = await fetchProducts();
      return products.find((p) => p.slug === slug || p.id === slug) ?? null;
    } catch {
      return null;
    }
  },
);
