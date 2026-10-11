import MarketSection from "@/components/Product/MarketSection";
import PriceHistoryChart from "@/components/Product/PriceHistoryChart";
import ProductCard from "@/components/Product/ProductCard";

import { fetchProduct, fetchProducts } from "@/lib/api";
import { bn, bnPct, shortUnit, taka } from "@/lib/formatters";

import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

/* Metadata */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug); // deduped by react cache()

  return {
    title: product
      ? `${product.name} এর আজকের দাম – ${taka(product.price)}`
      : "পণ্য পাওয়া যায়নি",
  };
}

/* Section Title */
function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span
        aria-hidden
        className="grid size-10 place-items-center rounded-xl bg-primary/10 text-xl"
      >
        {icon}
      </span>

      <div>
        <h2 className="text-xl font-extrabold text-neutral sm:text-2xl">
          {title}
        </h2>

        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
    </div>
  );
}

/* Main Page */
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) notFound();

  /* if (!product) {
    return (
      <EmptyState
        code="৪০৪"
        emoji="🥺"
        title="পণ্যটি খুঁজে পাওয়া যায়নি"
        description="আপনি যে পণ্যটি খুঁজছেন তা হয়তো সরানো হয়েছে অথবা লিংকটি ভুল।"
      />
    );
  } */

  const related = (await fetchProducts(product.category).catch(() => []))
    .filter((p) => p.slug !== product.slug && p.category === product.category)
    .slice(0, 4);

  const unit = shortUnit(product.unit);
  const { trend, change, history } = product;

  const yesterdayDiff =
    history.yesterday !== null ? product.price - history.yesterday : null;

  const badgeTone =
    trend === "flat"
      ? "bg-slate-100 text-slate-600"
      : trend === "up"
        ? "bg-rose-100 text-rose-700"
        : "bg-emerald-100 text-emerald-700";

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-4 pt-6 pb-16 md:pb-24 sm:space-y-12 sm:pt-8">
      {/* Breadcrumb */}
      <nav
        aria-label="breadcrumb"
        className="text-sm text-slate-500 flex items-center"
      >
        <Link href="/" className="transition-colors hover:text-primary group">
          হোম
        </Link>

        <span aria-hidden className="mx-2">
          <ChevronRight size={16} />
        </span>

        {product.category && (
          <>
            <Link
              href={`/category/${product.category}`}
              className="transition-colors hover:text-primary"
            >
              {product.categoryName || product.category}
            </Link>

            <span aria-hidden className="mx-2">
              <ChevronRight size={16} />
            </span>
          </>
        )}

        <span className="font-semibold text-neutral">{product.name}</span>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-4xl border border-base-300 bg-linear-to-br from-primary/15 via-white to-white p-6 shadow-sm sm:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-primary/15 blur-3xl"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-secondary/10 blur-3xl"
        />

        <div className="relative grid items-center gap-8 md:grid-cols-[auto_1fr_auto]">
          {/* Emoji */}
          <div className="relative mx-auto md:mx-0">
            <div
              aria-hidden
              className="absolute inset-0 scale-110 rounded-[2.5rem] bg-primary/25 blur-2xl"
            />

            <span
              aria-hidden
              className="relative grid size-32 place-items-center rounded-[2.25rem] bg-base-200 text-7xl shadow-xl shadow-primary/20 ring-1 ring-base-300 sm:size-36 sm:text-8xl"
            >
              {product.emoji}
            </span>
          </div>

          {/* Info */}
          <div className="text-center md:text-left">
            {product.category && (
              <Link
                href={`/category/${product.category}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-primary ring-1 ring-primary/20 transition hover:bg-primary hover:text-primary-content"
              >
                <span aria-hidden>{product.categoryEmoji}</span>
                {product.categoryName || product.category}
              </Link>
            )}

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-neutral sm:text-5xl">
              {product.name}
            </h1>

            {product.unit && (
              <p className="mt-1 text-base text-slate-500">{product.unit}</p>
            )}

            <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
              {product.markets.length > 0 && (
                <>
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-neutral/80 ring-1 ring-base-300">
                    🏪 {bn(product.markets.length)}টি বাজার
                  </span>

                  <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-neutral/80 ring-1 ring-base-300">
                    📊 {taka(product.min)} – {taka(product.max)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Price card */}
          <div className="rounded-3xl bg-white/80 p-5 text-center shadow-lg shadow-primary/10 ring-1 ring-base-300 backdrop-blur md:min-w-60 md:text-right">
            <p className="text-sm font-semibold text-slate-500">আজকের দাম</p>

            <p className="mt-1 text-5xl font-extrabold leading-none text-primary">
              {taka(product.price)}
            </p>

            {unit && (
              <p className="mt-1 text-sm font-semibold text-slate-400">
                টাকা / {unit}
              </p>
            )}

            <div className="mt-4 flex flex-col items-center gap-1.5 md:items-end">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold ${badgeTone}`}
              >
                <span aria-hidden>
                  {trend === "up" ? "▲" : trend === "down" ? "▼" : "-"}
                </span>

                {trend === "flat"
                  ? "অপরিবর্তিত"
                  : `${bnPct(Math.abs(change))}%`}
              </span>

              {yesterdayDiff !== null && yesterdayDiff !== 0 && (
                <p className="text-xs text-slate-500">
                  {/* গতকালের চেয়ে {taka(Math.abs(yesterdayDiff))}{" "}
                  {yesterdayDiff > 0 ? "বেশি" : "কম"} */}
                  গতকালের তুলনায় আজ দাম {taka(Math.abs(yesterdayDiff))}{" "}
                  {yesterdayDiff > 0 ? "টাকা বেড়েছে" : "টাকা কমেছে"}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Price history */}
      <section aria-label="দামের ইতিহাস">
        <SectionTitle
          icon="📈"
          title="দামের সারসংক্ষেপ"
          subtitle="চার্টে বা নিচের কার্ডে ক্লিক করে যেকোনো সময়ের সাথে তুলনা করুন"
        />

        <PriceHistoryChart history={history} unit={product.unit} />
      </section>

      {/* Market prices */}
      <section aria-label="বাজারভিত্তিক দাম">
        <SectionTitle
          icon="🏪"
          title="বাজারভিত্তিক আজকের দাম"
          subtitle="বিভাগ ধরে তুলনা করুন, বাজেট হিসাব করুন, আর পুরো তালিকা সাজিয়ে দেখুন"
        />

        <MarketSection
          markets={product.markets}
          avg={product.avg}
          unit={product.unit}
        />
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section>
          <SectionTitle
            icon="🧺"
            title={`${product.categoryName || "একই ক্যাটাগরির"} ক্যাটাগরির আরও পণ্য`}
          />

          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
