"use client";

import type { Category, Product } from "@/lib/types";
import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "./ProductCard";

// export { SORTS } from "@/lib/product-sorts";
// export type { SortKey } from "@/lib/product-sorts";

import { SORTS, type SortKey } from "@/lib/product-sorts";

// export type SortKey = "default" | "price-asc" | "price-desc" | "rise" | "fall";

// export const SORTS: { key: SortKey; label: string }[] = [
//   { key: "default", label: "ডিফল্ট" },
//   { key: "price-asc", label: "দাম: কম থেকে বেশি" },
//   { key: "price-desc", label: "দাম: বেশি থেকে কম" },
//   { key: "rise", label: "সবচেয়ে বেশি বেড়েছে" },
//   { key: "fall", label: "সবচেয়ে বেশি কমেছে" },
// ];

const PAGE = 24;
const bn = new Intl.NumberFormat("bn-BD");

export default function ProductsExplorer({
  products,
  categories,
  initialCategory = "all",
  initialQuery = "",
  initialSort = "default",
}: {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
  initialQuery?: string;
  initialSort?: SortKey;
}) {
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortKey>(initialSort);
  const [limit, setLimit] = useState(PAGE);
  const searchRef = useRef<HTMLInputElement>(null);

  // category chips (only categories that actually have products)
  const chips = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of products)
      counts.set(p.category, (counts.get(p.category) ?? 0) + 1);

    return categories
      .filter((c) => counts.has(c.slug))
      .map((c) => ({ ...c, count: counts.get(c.slug) ?? 0 }));
  }, [products, categories]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const list = products.filter(
      (p) =>
        (category === "all" || p.category === category) &&
        (!q || p.name.toLowerCase().includes(q)),
    );

    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price);
      case "rise":
        return [...list].sort((a, b) => b.change - a.change);
      case "fall":
        return [...list].sort((a, b) => a.change - b.change);
      default:
        return list;
    }
  }, [products, category, query, sort]);

  // keep the URL shareable without triggering a navigation
  useEffect(() => {
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (query.trim()) params.set("q", query.trim());
    if (sort !== "default") params.set("sort", sort);

    const qs = params.toString();
    window.history.replaceState(
      null,
      "",
      qs ? `?${qs}` : window.location.pathname,
    );
  }, [category, query, sort]);

  // "/" focuses the search box
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing =
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.isContentEditable);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtersActive =
    category !== "all" || query.trim() !== "" || sort !== "default";
  const reset = () => {
    setCategory("all");
    setQuery("");
    setSort("default");
    setLimit(PAGE);
  };

  const visible = filtered.slice(0, limit);
  const remaining = filtered.length - visible.length;

  return (
    <div className="space-y-5">
      {/* Search + sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative block flex-1">
          <span className="sr-only">পণ্য খুঁজুন</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>

          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(PAGE);
            }}
            placeholder="পণ্যের নাম লিখুন… (যেমন: চাল, পেঁয়াজ)"
            className="h-12 w-full rounded-2xl border border-base-300 bg-white pl-11 pr-20 text-sm font-medium shadow-sm outline-none transition placeholder:font-normal placeholder:text-slate-400 hover:border-primary/40 focus:border-primary/60 focus:ring-4 focus:ring-primary/10 [&::-webkit-search-cancel-button]:hidden"
          />

          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                searchRef.current?.focus();
              }}
              aria-label="মুছে ফেলুন"
              className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-primary hover:text-primary-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              ✕
            </button>
          ) : (
            <kbd className="pointer-events-none absolute right-3.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-base-300 bg-slate-50 px-1.5 py-0.5 font-mono text-xs font-bold text-slate-400 sm:block">
              /
            </kbd>
          )}
        </label>

        <label className="relative block sm:w-60">
          <span className="sr-only">সাজান</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-12 w-full cursor-pointer appearance-none rounded-2xl border border-base-300 bg-white pl-4 pr-10 text-sm font-bold text-neutral shadow-sm outline-none transition hover:border-primary/40 focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                সাজান: {s.label}
              </option>
            ))}
          </select>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </label>
      </div>

      {/* Category chips */}
      <div
        role="group"
        aria-label="ক্যাটাগরি"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {[
          { slug: "all", name: "সব পণ্য", emoji: "🛍️", count: products.length },
          ...chips,
        ].map((c) => {
          const active = category === c.slug;
          return (
            <button
              key={c.slug}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setCategory(c.slug);
                setLimit(PAGE);
              }}
              className={`group inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                active
                  ? "border-primary bg-primary text-primary-content shadow-md shadow-primary/25"
                  : "border-base-300 bg-white text-neutral/75 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:shadow-sm"
              }`}
            >
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-125"
              >
                {c.emoji}
              </span>
              {c.name}
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs ${active ? "bg-white/20" : "bg-slate-100 text-slate-500"}`}
              >
                {bn.format(c.count)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Count + reset */}
      <div
        className="flex items-center justify-between gap-3"
        aria-live="polite"
      >
        <p className="text-sm font-semibold text-slate-500">
          <strong className="text-neutral">
            {bn.format(filtered.length)}টি
          </strong>{" "}
          পণ্য পাওয়া গেছে
        </p>

        {filtersActive && (
          <button
            type="button"
            onClick={reset}
            className="cursor-pointer rounded-full px-3 py-1.5 text-sm font-bold text-primary transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            ✕ ফিল্টার মুছুন
          </button>
        )}
      </div>

      {/* Grid / empty */}
      {visible.length > 0 ? (
        <>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>

          {remaining > 0 && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setLimit((l) => l + PAGE)}
                className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-2xl border border-base-300 bg-white px-8 text-sm font-extrabold text-primary shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                আরও {bn.format(Math.min(PAGE, remaining))}টি দেখুন
                <span aria-hidden>▼</span>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="mx-auto flex max-w-sm flex-col items-center py-14 text-center">
          <span
            aria-hidden
            className="grid size-20 place-items-center rounded-full bg-primary/10 text-4xl"
          >
            🔍
          </span>
          <h2 className="mt-4 text-lg font-extrabold text-neutral">
            কোনো পণ্য পাওয়া যায়নি
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            অন্য নামে খুঁজুন অথবা ফিল্টার মুছে সব পণ্য দেখুন।
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-5 inline-flex h-11 cursor-pointer items-center rounded-xl bg-primary px-6 text-sm font-extrabold text-primary-content shadow-md shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
          >
            ফিল্টার মুছুন
          </button>
        </div>
      )}
    </div>
  );
}
