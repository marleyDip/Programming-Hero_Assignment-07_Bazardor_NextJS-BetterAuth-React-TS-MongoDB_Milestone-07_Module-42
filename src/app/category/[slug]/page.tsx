import EmptyState from "@/components/Common/EmptyState";
import SortControl, {
  parseSort,
  type SortKey,
} from "@/components/Common/SortControl";
import ProductCard from "@/components/Product/ProductCard";
import { fetchCategory, fetchProducts } from "@/lib/api";
import type { Product } from "@/lib/types";
import { MoveLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string | string[] }>;
};

const bnNumber = new Intl.NumberFormat("bn-BD");

function sortProducts(products: Product[], sort: SortKey): Product[] {
  if (sort === "price-asc")
    return [...products].sort((a, b) => a.price - b.price);
  if (sort === "price-desc")
    return [...products].sort((a, b) => b.price - a.price);

  return products; // default: API order
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await fetchCategory(slug); // deduped by react cache()

  return {
    title: category
      ? `${category.name} এর আজকের দাম`
      : "ক্যাটাগরি পাওয়া যায়নি",
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  await new Promise((r) => setTimeout(r, 4000));

  const { slug } = await params;

  const sort = parseSort((await searchParams).sort);

  const [category, fetched] = await Promise.all([
    fetchCategory(slug),
    fetchProducts(slug),
  ]);

  // console.log(category);
  // console.log(fetched);

  // Safety net in case the API ignores the ?category= filter.
  const products = sortProducts(
    fetched.filter((p) => p.category === slug),
    sort,
  );

  // Fall back to product data if the category endpoint failed.
  const title = category?.name ?? products[0]?.categoryName;
  const emoji = category?.emoji ?? products[0]?.categoryEmoji ?? "🛒";

  // Invalid slug → 404-style state
  if (!title) {
    return (
      <EmptyState
        code="৪০৪"
        emoji="🥺"
        title="ক্যাটাগরিটি খুঁজে পাওয়া যায়নি"
        description="আপনি যে ক্যাটাগরিটি খুঁজছেন তা হয়তো সরানো হয়েছে অথবা লিংকটি ভুল।"
      />
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:pt-8">
      {/* Breadcrumb */}
      <nav
        aria-label="breadcrumb"
        className="mb-4 flex items-center text-sm text-slate-500"
      >
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition duration-300 hover:text-primary"
        >
          <MoveLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          হোম পেজ
        </Link>

        {/* <Link href="/" className="transition-colors hover:text-primary">
          হোম
        </Link> */}

        <span aria-hidden className="mx-2">
          /
        </span>

        <span className="font-semibold text-neutral">{title}</span>
      </nav>

      {/* Title & icon & sort */}
      <header className="mt-3 mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-3xl"
          >
            {emoji}
          </span>

          <div>
            <h1 className="text-2xl font-extrabold text-neutral sm:text-3xl">
              {title}
            </h1>

            <p className="text-sm text-slate-500">
              {products.length > 0
                ? `${bnNumber.format(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন`
                : "কোনো পণ্য নেই"}
            </p>
          </div>
        </div>

        {products.length > 1 && (
          <SortControl basePath={`/category/${slug}`} active={sort} />
        )}
      </header>

      {/* List or empty state */}
      {products.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          emoji={emoji}
          title="এই ক্যাটাগরিতে এখনো কোনো পণ্য নেই"
          description="অন্য ক্যাটাগরি দেখুন অথবা কিছুক্ষণ পরে আবার চেষ্টা করুন।"
        />
      )}
    </main>
  );
}

/* // Invalid category or unavailable category metadata.
  if (!category) {
    return (
      <section className="mx-auto flex min-h-[60vh] w-full max-w-6xl items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto grid size-20 place-items-center rounded-3xl border border-base-300 bg-base-100 text-4xl shadow-sm">
            🔎
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            404 · ক্যাটাগরি পাওয়া যায়নি
          </p>

          <h1 className="mt-3 text-2xl font-black sm:text-3xl">
            এই ক্যাটাগরিটি খুঁজে পাওয়া যায়নি
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-500">
            ক্যাটাগরিটি মুছে ফেলা হয়েছে অথবা ঠিকানা পরিবর্তন হয়েছে।
            হোম পেজ থেকে অন্য ক্যাটাগরি বেছে নিন।
          </p>

          <Link
            href="/"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-content shadow-sm transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <House size={17} />
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </section>
    );
  }


  <section className="relative mt-6 overflow-hidden rounded-3xl border border-base-300/80 bg-base-100 p-5 shadow-[0_4px_24px_rgba(20,41,28,0.04)] sm:p-8 lg:p-10">
    <div className="pointer-events-none absolute -right-12 -top-16 size-48 rounded-full bg-green-100/60 blur-3xl" />

    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="grid size-20 shrink-0 place-items-center rounded-2xl border border-green-100 bg-linear-to-br from-green-50 to-emerald-100/60 text-5xl shadow-sm sm:size-24">
        <span aria-hidden="true">{emoji}</span>
        </div>

        <div className="min-w-0 flex-1">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            বাজারদর · ক্যাটাগরি
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight text-base-content sm:text-4xl">
            {title}
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            {title} বিভাগের পণ্যের বর্তমান দাম, বাজারের মূল্য পরিবর্তন এবং দর
            তুলনা করুন।
        </p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200/70 px-3 py-1.5 text-xs font-semibold text-slate-600">
            <ShoppingBasket size={14} className="text-primary" />
            {products.length}টি পণ্য
        </div>
        </div>
    </div>
    </section>

    <CategoryProducts products={products} />
*/
