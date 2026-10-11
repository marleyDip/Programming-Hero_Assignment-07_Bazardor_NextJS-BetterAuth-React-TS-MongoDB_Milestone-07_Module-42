// import ProductsExplorer, {
//   type SortKey,
// } from "@/components/Product/ProductsExplorer";

import ProductsExplorer from "@/components/Product/ProductsExplorer";

import { fetchCategories, fetchProducts } from "@/lib/api";
import { SORTS, type SortKey } from "@/lib/product-sorts";

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "সব পণ্যের আজকের দাম",
  description:
    "চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার বাজারভিত্তিক দাম এক জায়গায়।",
};

type SP = {
  category?: string | string[];
  q?: string | string[];
  sort?: string | string[];
};

const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;

  const [products, categories] = await Promise.all([
    fetchProducts(),
    fetchCategories().catch(() => []),
  ]);

  // validate the URL params before trusting them
  const cat = first(sp.category);

  const initialCategory =
    cat && products.some((p) => p.category === cat) ? cat : "all";

  // console.log("SORTS:", SORTS);
  // console.log("Array:", Array.isArray(SORTS));

  /* console.log("SORTS diagnostic:", {
    value: SORTS,
    isArray: Array.isArray(SORTS),
    type: typeof SORTS,
    constructor: SORTS?.constructor?.name,
    someType: typeof SORTS?.some,
  }); */

  const sortParam = first(sp.sort);

  /* const validSortKeys = [
    "default",
    "price-asc",
    "price-desc",
    "rise",
    "fall",
  ] as const;

  const initialSort: SortKey = validSortKeys.includes(
    sortParam as (typeof validSortKeys)[number],
  )
    ? (sortParam as SortKey)
    : "default"; */

  const initialSort = (
    SORTS.some((s) => s.key === sortParam) ? sortParam : "default"
  ) as SortKey;

  const initialQuery = (first(sp.q) ?? "").slice(0, 80);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <nav aria-label="breadcrumb" className="mb-4 text-sm text-slate-500">
        <Link href="/" className="transition-colors hover:text-primary">
          হোম
        </Link>

        <span aria-hidden className="mx-2">
          /
        </span>

        <span className="font-semibold text-neutral">সব পণ্য</span>
      </nav>

      <header className="mb-6 flex items-center gap-3">
        <span
          aria-hidden
          className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-3xl"
        >
          🛍️
        </span>

        <div>
          <h1 className="text-2xl font-extrabold text-neutral sm:text-3xl">
            সব পণ্যের আজকের দাম
          </h1>
          <p className="text-sm text-slate-500">
            খুঁজুন, ফিল্টার করুন আর সাজিয়ে তুলনা করুন
          </p>
        </div>
      </header>

      <ProductsExplorer
        products={products}
        categories={categories}
        initialCategory={initialCategory}
        initialQuery={initialQuery}
        initialSort={initialSort}
      />
    </main>
  );
}

/* 

 Server  SORTS: Array(5)
    0: {key: 'default', label: 'ডিফল্ট'}
    1: {key: 'price-asc', label: 'দাম: কম থেকে বেশি'}
    2: {key: 'price-desc', label: 'দাম: বেশি থেকে কম'}
    3: {key: 'rise', label: 'সবচেয়ে বেশি বেড়েছে'}
    4: {key: 'fall', label: 'সবচেয়ে বেশি কমেছে'}

Server  Array: false


Server  SORTS diagnostic: 
 {value: Array(5), isArray: false, type: 'function', someType: 'undefined'}

    constructor: "Function"
    isArray: false
    someType: "undefined"
    type: "function"
    value: Array(5)
        0: {key: 'default', label: 'ডিফল্ট'}
        1: {key: 'price-asc', label: 'দাম: কম থেকে বেশি'}
        2: {key: 'price-desc', label: 'দাম: বেশি থেকে কম'}
        3: {key: 'rise', label: 'সবচেয়ে বেশি বেড়েছে'}
        4: {key: 'fall', label: 'সবচেয়ে বেশি কমেছে'}

*/
