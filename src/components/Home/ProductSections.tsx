import ProductCard from "@/components/Product/ProductCard";
import type { Product } from "@/lib/types";
import { PackageSearch, TrendingDown, TrendingUp } from "lucide-react";

export default function ProductSections({ products }: { products: Product[] }) {
  const risers = [...products]
    .filter((p) => p.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, 6);

  const fallers = [...products]
    .filter((p) => p.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-14 sm:px-0">
      <ProductRail
        title="আজ দাম বেড়েছে"
        subtitle="সবচেয়ে বেশি দাম বেড়েছে যেসব পণ্যের"
        symbol="▲"
        products={risers}
        tone="up"
      />

      <ProductRail
        title="আজ দাম কমেছে"
        subtitle="সবচেয়ে বেশি দাম কমেছে যেসব পণ্যের"
        symbol="▼"
        products={fallers}
        tone="down"
      />

      <section id="সব-পণ্য" className="scroll-mt-28 py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-wider text-primary">
              সম্পূর্ণ তালিকা
            </p>

            <h2 className="mt-1 text-2xl font-black sm:text-3xl">সব পণ্য</h2>

            <p className="mt-1 text-sm text-slate-600">
              আজকের সম্ভাব্য বাজারদর এক জায়গায়।
            </p>
          </div>

          {products.length > 0 && (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary ring-1 ring-inset ring-primary/10">
              <span className="size-1.5 rounded-full bg-primary" aria-hidden />
              মোট {products.length}টি পণ্য
            </span>
          )}
        </div>

        {products.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      role="status"
      className="relative overflow-hidden rounded-3xl border border-dashed border-base-300 bg-white px-6 py-14 text-center shadow-[0_2px_12px_rgba(20,41,28,0.035)] sm:py-16"
    >
      {/* soft background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-40 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative mx-auto flex max-w-md flex-col items-center">
        <span className="grid size-16 place-items-center rounded-full border border-primary/20 bg-primary/5 text-primary ring-8 ring-primary/5">
          <PackageSearch size={28} strokeWidth={2} />
        </span>

        <h3 className="mt-6 text-xl font-extrabold sm:text-2xl">
          এই মুহূর্তে কোনো পণ্য পাওয়া যায়নি
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          বাজারদরের তথ্য এখনো আপডেট হয়নি অথবা লোড করা যায়নি। কিছুক্ষণ পর পেজটি
          রিফ্রেশ করে আবার দেখুন।
        </p>

        {/* <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link href="/" className="btn btn-primary btn-sm sm:btn-md">
            <RefreshCw size={16} strokeWidth={2.5} />
            আবার চেষ্টা করুন
          </Link>

          <Link href="/" className="btn btn-ghost btn-sm sm:btn-md">
            হোম পেজে ফিরে যান
          </Link>
        </div> */}
      </div>
    </div>
  );
}

function ProductRail({
  title,
  subtitle,
  symbol,
  products,
  tone,
}: {
  title: string;
  subtitle: string;
  symbol: string;
  products: Product[];
  tone: "up" | "down";
}) {
  if (!products.length) return null;

  const up = tone === "up";
  const Icon = up ? TrendingUp : TrendingDown;

  return (
    <section className="py-7">
      <div className="mb-4 flex items-center gap-3 sm:mb-5">
        <span
          className={`grid size-10 shrink-0 place-items-center rounded-xl border ring-1 ring-inset ${
            up
              ? "border-success/25 bg-[#e6f6ec] text-success ring-success/10"
              : "border-error/25 bg-[#fdeaea] text-error ring-error/10"
          }`}
          aria-hidden
        >
          <Icon size={20} strokeWidth={2.5} />
        </span>

        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-lg font-bold leading-snug sm:text-xl lg:text-2xl">
            {title}
            <span
              className={`text-base font-black ${up ? "text-success" : "text-error"}`}
            >
              {symbol}
            </span>
          </h2>
          <p className="truncate text-xs text-slate-500 sm:text-sm">
            {subtitle}
          </p>
        </div>

        <div
          aria-hidden
          className={`ml-2 hidden h-px flex-1 bg-linear-to-r to-transparent sm:block ${
            up ? "from-success/30" : "from-error/30"
          }`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} compact />
        ))}
      </div>
    </section>
  );
}

/* import ProductCard from "@/components/Product/ProductCard";
import type { Product } from "@/lib/types";

export default function ProductSections({ products }: { products: Product[] }) {
  const risers = [...products]
    .filter((p) => p.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, 6);

  const fallers = [...products]
    .filter((p) => p.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl pb-12">
      <ProductRail
        title="আজ দাম বেড়েছে"
        symbol="▲"
        products={risers}
        tone="up"
      />

      <ProductRail
        title="আজ দাম কমেছে"
        symbol="▼"
        products={fallers}
        tone="down"
      />

      <section id="সব-পণ্য" className="scroll-mt-28 py-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              সম্পূর্ণ তালিকা
            </p>

            <h2 className="mt-1 text-3xl font-black">সব পণ্য</h2>

            <p className="mt-1 text-sm text-slate-600">
              আজকের সম্ভাব্য বাজারদর এক জায়গায়।
            </p>
          </div>
          <span className="w-fit rounded-full bg-base-200 px-3 py-1.5 text-xs font-bold text-slate-600">
            মোট {products.length}টি পণ্য দেখানো হচ্ছে
          </span>
        </div>

        {products.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-base-300 bg-white p-12 text-center text-sm text-slate-500">
            এই মুহূর্তে কোনো পণ্য পাওয়া যায়নি।
          </div>
        )}
      </section>
    </div>
  );
}

function ProductRail({
  title,
  symbol,
  products,
  tone,
}: {
  title: string;
  symbol: string;
  products: Product[];
  tone: "up" | "down";
}) {
  if (!products.length) return null;

  return (
    <section className="py-7">
      <div className="mb-3 sm:mb-4 lg:mb-5 flex items-center gap-2">
        <span
          className={`text-base sm:text-lg lg:text-xl leading-normal font-black ${tone === "up" ? "text-success" : "text-error"}`}
        >
          {symbol}
        </span>

        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold leading-snug">
          {title}
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} compact />
        ))}
      </div>
    </section>
  );
}
 */
