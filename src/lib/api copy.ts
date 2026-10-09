import { parseNum } from "./formatters";
import type { MarketPrice } from "./types copy";

const DEFAULT_API_BASES = [
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
] as const;

const API_BASES = [
  process.env.BAZARDOR_API_URL,
  process.env.NEXT_PUBLIC_API_BASE_1,
  process.env.NEXT_PUBLIC_API_BASE_2,
  ...DEFAULT_API_BASES,
]
  .filter((base): base is string => Boolean(base))
  .map((base) => base.replace(/\/+$/, ""))
  .filter((base, index, bases) => bases.indexOf(base) === index);

type RawObject = Record<string, unknown>;

const UNIT_MAP: Record<string, string> = {
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
};

const CATEGORY_EMOJI: Record<string, string> = {
  chal: "🍚",
  dal: "🫘",
  tel: "🫙",
  sobji: "🥔",
  mach: "🐟",
  mangsho: "🍗",
  dim: "🥚",
  moshla: "🌶️",
};

const EMPTY_MARKET_PRICES: MarketPrice[] = [];

function isObject(value: unknown): value is RawObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function pick(object: RawObject, keys: readonly string[]): unknown {
  for (const key of keys) {
    const value = object[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

function toString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "bigint")
    return String(value);
  return fallback;
}

function toObject(value: unknown): RawObject | null {
  return isObject(value) ? value : null;
}

function unwrapList(json: unknown, keys: readonly string[] = []): RawObject[] {
  if (Array.isArray(json)) return json.filter(isObject);
  if (!isObject(json)) return [];

  for (const key of [...keys, "data", "items", "results"]) {
    const value = json[key];
    if (Array.isArray(value)) return value.filter(isObject);

    // Some APIs wrap the list one level deeper, e.g. { data: { products: [] } }.
    if (isObject(value)) {
      for (const nestedKey of [...keys, "items", "results"]) {
        const nested = value[nestedKey];
        if (Array.isArray(nested)) return nested.filter(isObject);
      }
    }
  }

  return [];
}

function unwrapOne(
  json: unknown,
  keys: readonly string[] = [],
): RawObject | null {
  if (!isObject(json)) return null;

  for (const key of [...keys, "data", "item", "result"]) {
    const value = json[key];
    if (isObject(value)) {
      for (const nestedKey of keys) {
        if (isObject(value[nestedKey])) return value[nestedKey] as RawObject;
      }
      return value;
    }
  }

  return json;
}

function normalizeUnit(value: unknown): string {
  const unit = toString(value).trim();
  if (!unit) return "";
  const normalized = UNIT_MAP[unit.toLowerCase()] ?? unit;
  return normalized.startsWith("প্রতি") ? normalized : `প্রতি ${normalized}`;
}

function getCategoryEmoji(category: string): string {
  return CATEGORY_EMOJI[category.toLowerCase()] ?? "🛒";
}

function getCategoryValue(value: unknown): string {
  if (!isObject(value)) return toString(value);
  return toString(pick(value, ["slug", "id", "nameBn", "name_bn", "name"]));
}

function normalizeDirection(value: unknown, change: number): string {
  const direction = toString(value).toLowerCase();
  if (["down", "fall", "decrease", "negative"].includes(direction))
    return "down";
  if (["up", "rise", "increase", "positive"].includes(direction)) return "up";
  if (["stable", "same", "unchanged", "flat"].includes(direction))
    return "stable";
  return change > 0 ? "up" : change < 0 ? "down" : "stable";
}

class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Requests the primary API first, then tries the fallback endpoint. */
async function getJson(path: string): Promise<unknown> {
  let lastError: unknown = new Error("All BazarDor API requests failed");

  for (const base of API_BASES) {
    try {
      const response = await fetch(`${base}${path}`, {
        headers: { Accept: "application/json" },
        next: { revalidate: 300 },
      });

      if (!response.ok) {
        throw new ApiError(
          `API request failed with status ${response.status}`,
          response.status,
        );
      }

      return await response.json();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

function marketEntries(value: unknown): RawObject[] {
  if (Array.isArray(value)) return value.filter(isObject);

  if (isObject(value)) {
    return Object.entries(value).map(([market, details]) =>
      isObject(details) ? { market, ...details } : { market, price: details },
    );
  }

  return [];
}

/**
 * The API gives each market a min/max range rather than one exact price.
 * Use the midpoint as the existing MarketPrice.price value.
 */
/* function normalizeMarkets(value: unknown): MarketPrice[] {
  return marketEntries(value)
    .map((market) => {
      const name = toString(
        pick(market, ["market", "name", "bazar", "bazaar", "title", "label"]),
      );
      const directPrice = parseNum(
        pick(market, ["price", "value", "today_price", "todayPrice", "amount"]),
      );
      const min = parseNum(pick(market, ["min", "min_price", "minPrice"]));
      const max = parseNum(pick(market, ["max", "max_price", "maxPrice"]));
      const price =
        directPrice ??
        (min !== null && max !== null ? (min + max) / 2 : (min ?? max));

      return { name, price: price ?? Number.NaN };
    })
    .filter(
      (market) => market.name.length > 0 && Number.isFinite(market.price),
    );
} */

function getMarketBounds(value: unknown): {
  min: number | null;
  max: number | null;
} {
  const entries = marketEntries(value);
  const mins = entries
    .map((market) => parseNum(pick(market, ["min", "min_price", "minPrice"])))
    .filter((price): price is number => price !== null);
  const maxes = entries
    .map((market) => parseNum(pick(market, ["max", "max_price", "maxPrice"])))
    .filter((price): price is number => price !== null);

  return {
    min: mins.length ? Math.min(...mins) : null,
    max: maxes.length ? Math.max(...maxes) : null,
  };
}

/* export function normalizeProduct(raw: RawObject): Product {
  const category = getCategoryValue(
    pick(raw, ["category", "category_slug", "categorySlug", "category_id"]),
  );

  const rawMarkets = pick(raw, [
    "markets",
    "bazars",
    "bazaars",
    "market_prices",
    "marketPrices",
    "prices",
  ]);
  const markets = normalizeMarkets(rawMarkets);
  const marketPrices = markets.map((market) => market.price);
  const marketAverage = marketPrices.length
    ? marketPrices.reduce((total, price) => total + price, 0) /
      marketPrices.length
    : null;
  const marketBounds = getMarketBounds(rawMarkets);

  // BazarDor's current schema uses `today`, historical price fields, and
  // a nested `change: { dir, pct }` object.
  const rawPrice = pick(raw, [
    "today",
    "price",
    "today_price",
    "todayPrice",
    "current_price",
    "currentPrice",
    "avg_price",
    "average_price",
    "avgPrice",
  ]);
  const priceObject = toObject(rawPrice);
  const price =
    (priceObject
      ? parseNum(
          pick(priceObject, ["avg", "average", "today", "current", "price"]),
        )
      : parseNum(rawPrice)) ??
    marketAverage ??
    0;

  const min =
    parseNum(
      pick(raw, ["min", "min_price", "minPrice", "minimum_price", "lowest"]),
    ) ??
    marketBounds.min ??
    (marketPrices.length ? Math.min(...marketPrices) : price);

  const max =
    parseNum(
      pick(raw, ["max", "max_price", "maxPrice", "maximum_price", "highest"]),
    ) ??
    marketBounds.max ??
    (marketPrices.length ? Math.max(...marketPrices) : price);

  const avg =
    parseNum(
      pick(raw, ["avg", "avg_price", "average", "average_price", "avgPrice"]),
    ) ??
    marketAverage ??
    price;

  const rawChange = pick(raw, [
    "change",
    "change_percent",
    "changePercent",
    "percent",
    "percentage",
    "price_change",
    "priceChange",
    "delta",
    "diff",
  ]);
  const changeObject = toObject(rawChange);
  let change =
    parseNum(
      changeObject
        ? pick(changeObject, ["pct", "percent", "percentage", "value"])
        : rawChange,
    ) ?? 0;

  const yesterday = parseNum(
    pick(raw, [
      "yesterday",
      "previous_price",
      "prev_price",
      "yesterday_price",
      "yesterdayPrice",
    ]),
  );

  if (rawChange === undefined && yesterday !== null && yesterday !== 0) {
    change = ((price - yesterday) / yesterday) * 100;
  }

  const direction = normalizeDirection(
    pick(changeObject ?? raw, ["dir", "trend", "direction", "status"]),
    change,
  );

  if (direction === "down" && change > 0) change = -change;
  if (direction === "up" && change < 0) change = Math.abs(change);
  if (direction === "stable") change = 0;

  const rawEmoji = toString(
    pick(raw, ["emoji", "icon", "categoryIcon", "category_icon", "image"]),
  );
  const emoji =
    rawEmoji && rawEmoji.length <= 8 && !/^https?:|\/|^data:/i.test(rawEmoji)
      ? rawEmoji
      : getCategoryEmoji(category);

  const rawTags = pick(raw, ["tags", "categories", "category_tags"]);
  const tags = Array.isArray(rawTags)
    ? rawTags
        .map((tag) =>
          typeof tag === "string"
            ? tag
            : isObject(tag)
              ? toString(pick(tag, ["nameBn", "name_bn", "name", "slug"]))
              : "",
        )
        .filter(Boolean)
    : category
      ? [category]
      : [];

  const id = toString(pick(raw, ["id", "_id"]));
  const name = toString(
    pick(raw, ["nameBn", "name_bn", "bn_name", "name", "title"]),
    "পণ্য",
  );

  return {
    id,
    slug: toString(pick(raw, ["slug"])) || id,
    name,
    emoji,
    unit: normalizeUnit(pick(raw, ["unit", "unit_bn", "per"])),
    category,
    tags,
    description: toString(
      pick(raw, ["description", "summary", "subtitle", "details"]),
    ),
    price,
    change,
    min,
    max,
    avg,
    markets: markets.length ? markets : EMPTY_MARKET_PRICES,
  };
} */

/* export function normalizeCategory(raw: RawObject): Category {
  const slug = toString(pick(raw, ["slug", "id"]));
  return {
    slug,
    name: toString(
      pick(raw, ["nameBn", "name_bn", "name", "title", "label"]),
      slug,
    ),
    emoji: toString(pick(raw, ["icon", "emoji"])) || getCategoryEmoji(slug),
  };
} */

/* export async function fetchProducts(category?: string): Promise<Product[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  const json = await getJson(`/products${query}`);
  return unwrapList(json, ["products"]).map(normalizeProduct);
} */

/* export async function fetchProduct(slug: string): Promise<Product | null> {
  try {
    const json = await getJson(`/products/${encodeURIComponent(slug)}`);
    const product = unwrapOne(json, ["product"]);

    if (product && !("error" in product)) {
      return normalizeProduct(product);
    }
  } catch {
    // The API may not support individual product lookups; try the list instead.
  }

  try {
    const products = await fetchProducts();
    return (
      products.find(
        (product) => product.slug === slug || product.id === slug,
      ) ?? null
    );
  } catch {
    return null;
  }
} */

/* export async function fetchCategories(): Promise<Category[]> {
  const json = await getJson("/categories");
  return unwrapList(json, ["categories"]).map(normalizeCategory);
} */

/* export async function fetchCategory(slug: string): Promise<Category | null> {
  try {
    const json = await getJson(`/categories/${encodeURIComponent(slug)}`);
    const category = unwrapOne(json, ["category"]);
    return category && !("error" in category)
      ? normalizeCategory(category)
      : null;
  } catch {
    return null;
  }
} */
