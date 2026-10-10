const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

/**
 * Convert Latin digits to Bengali digits.
 * Example: 1850 → ১৮৫০
 *
 */
export function toBn(value: string | number): string {
  return String(value).replace(/\d/g, (digit) => BN_DIGITS[Number(digit)]);
}

/**
 * Convert Bengali digits to Latin digits.
 * Example: ১,৮৫০ → 1,850
 *
 */
export function toEn(value: string): string {
  return value.replace(/[০-৯]/g, (digit) => String(BN_DIGITS.indexOf(digit)));
}

/**
 * Extract a numeric value from Bengali/English text.
 *
 * Examples:
 * 148            → 148
 * "১,৮৫০"        → 1850
 * "১৪৮ টাকা"     → 148
 * "▼ ২.৯%"       → 2.9
 *
 */
export function parseNum(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const cleaned = toEn(value).replace(/,/g, "").trim();

  const match = cleaned.match(/-?\d+(?:\.\d+)?/);

  return match ? Number(match[0]) : null;
}

/**
 * Format a price using Bengali digits and Indian-style grouping.
 *
 * Example:
 * 1850    → ১,৮৫০
 * 148     → ১৪৮
 * 1250.5  → ১,২৫০.৫
 *
 */
export function formatPrice(value: number): string {
  if (!Number.isFinite(value)) {
    return "০";
  }

  const rounded = Number.isInteger(value)
    ? value
    : Math.round(value * 100) / 100;

  return toBn(rounded.toLocaleString("en-IN"));
}

/**
 * Format percentage value.
 *
 * Example:
 * 2.14 → ২.১
 * -2.9 → ২.৯
 *
 */
export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) {
    return "০.০";
  }

  return toBn(Math.abs(value).toFixed(1));
}

/**
 * Get the current date in Bengali.
 *
 * Example:
 * শুক্রবার, ৯ অক্টোবর ২০২৬
 *
 */
export function todayBanglaDate(date = new Date()): string {
  return new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

const n2 = new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 2 });

const n1 = new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 1 });

/** 148 → ১৪৮ */
export const bn = (v: number) => n2.format(v);

/** 2.14 → ২.১ */
export const bnPct = (v: number) => n1.format(v);

/** 148 → ৳১৪৮ */
export const taka = (v: number) => `৳${n2.format(v)}`;

/** "প্রতি কেজি" → "কেজি" */
export const shortUnit = (unit: string) => unit.replace(/^প্রতি\s*/, "").trim();
