"use client";

import { ArrowDownWideNarrow, PackageSearch } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import ProductCard from "@/components/Product/ProductCard";
import type { Product } from "@/lib/types";

type SortOption = "default" | "price-asc" | "price-desc";

export default function CategoryProducts({
  products,
}: {
  products: Product[];
}) {
  const [sort, setSort] = useState<SortOption>("default");

  const sortedProducts = useMemo(() => {
    const result = [...products];

    switch (sort) {
      case "price-asc":
        return result.sort((a, b) => a.price - b.price);

      case "price-desc":
        return result.sort((a, b) => b.price - a.price);

      default:
        return result;
    }
  }, [products, sort]);

  return (
    <section className="scroll-mt-28 pt-10">
      {/* Section heading and sort */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            পণ্য তালিকা
          </p>

          <h2 className="mt-1.5 text-2xl font-black tracking-tight sm:text-3xl">
            সব পণ্য
          </h2>

          <p className="mt-1.5 text-sm text-slate-500">
            পণ্যের দাম দেখে আপনার পছন্দমতো বেছে নিন।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-slate-500">
            মোট {sortedProducts.length}টি
          </span>

          <label className="flex h-11 min-w-0 items-center gap-2 rounded-xl border border-base-300 bg-base-100 px-3 shadow-sm transition focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10">
            <ArrowDownWideNarrow size={17} className="shrink-0 text-primary" />

            <span className="shrink-0 text-xs font-semibold text-slate-500">
              সাজান:
            </span>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
              aria-label="পণ্য সাজান"
              className="min-w-0 cursor-pointer bg-transparent text-sm font-bold text-base-content outline-none"
            >
              <option value="default">ডিফল্ট</option>
              <option value="price-asc">দাম: কম থেকে বেশি</option>
              <option value="price-desc">দাম: বেশি থেকে কম</option>
            </select>
          </label>
        </div>
      </div>

      {/* Product grid */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-base-300 bg-base-100 px-5 py-12 text-center">
          <div className="grid size-16 place-items-center rounded-2xl bg-base-200 text-slate-400">
            <PackageSearch size={30} strokeWidth={1.5} />
          </div>

          <h3 className="mt-5 text-lg font-extrabold">
            এই ক্যাটাগরিতে কোনো পণ্য নেই
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            এই মুহূর্তে দেখানোর মতো পণ্য পাওয়া যায়নি। অন্য পণ্য দেখতে হোম পেজে
            ফিরে যান।
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-content transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      )}
    </section>
  );
}
