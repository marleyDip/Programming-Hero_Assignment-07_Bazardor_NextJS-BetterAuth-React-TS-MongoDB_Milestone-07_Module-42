import { formatPercent, formatPrice } from "@/lib/formatters";
import type { Product } from "@/lib/types";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function ProductCard({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const positive = product.change > 0;
  const negative = product.change < 0;

  return (
    <Link
      href={`/product/${encodeURIComponent(product.slug)}`}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-base-300/80 bg-base-100 p-4 sm:p-5 shadow-[0_2px_12px_rgba(20,41,28,0.035)] transition-all duration-300 ease-out hover:-translate-y-1 hover:ring-1 hover:ring-inset focus-visible:outline-none focus-visible:ring- focus-visible:ring-offset-2
        ${
          positive
            ? "hover:border-success/40 hover:ring-success/15 hover:shadow-[0_12px_32px_rgba(22,163,74,0.12)] focus-visible:ring-success"
            : negative
              ? "hover:border-error/40 hover:ring-error/15 hover:shadow-[0_12px_32px_rgba(220,38,38,0.10)] focus-visible:ring-error"
              : "hover:border-slate-400/40 hover:ring-slate-300/40 hover:shadow-[0_12px_32px_rgba(100,116,139,0.12)] focus-visible:ring-slate-400"
        } ${compact ? "min-h-40" : "min-h-48"}
      `}
    >
      {/* Subtle decorative accent */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 rounded-full bg-linear-to-r transition-transform duration-300 ease-out group-hover:scale-x-100 ${
          positive
            ? "from-success/30 via-success to-success/30 shadow-[0_1px_6px] shadow-success/40"
            : negative
              ? "from-error/30 via-error to-error/30 shadow-[0_1px_6px] shadow-error/40"
              : "from-slate-300 via-slate-400 to-slate-300 shadow-[0_1px_6px] shadow-slate-300/50"
        }`}
      />

      {/* Product information */}
      <div className="flex items-start gap-3.5">
        <div className="grid size-14 shrink-0 place-items-center rounded-2xl border border-[#e8f3e9] bg-linear-to-br from-[#f5fbf5] to-[#eaf6ec] text-3xl transition-transform duration-300 group-hover:scale-105 sm:size-16 sm:text-4xl">
          <span aria-hidden="true">{product.emoji}</span>
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-[15px] font-extrabold tracking-tight text-base-content transition-colors group-hover:text-primary sm:text-base">
                {product.name}
              </h3>

              <p className="mt-1 text-xs font-medium text-slate-500">
                {product.unit}
              </p>
            </div>

            <span
              className={`grid size-7 shrink-0 place-items-center rounded-full border border-transparent text-slate-400 transition-all duration-300 ${
                positive
                  ? "group-hover:border-success/30 group-hover:bg-[#e6f6ec] group-hover:text-success group-hover:ring-2 group-hover:ring-success/10"
                  : negative
                    ? "group-hover:border-error/30 group-hover:bg-[#fdeaea] group-hover:text-error group-hover:ring-2 group-hover:ring-error/10"
                    : "group-hover:border-slate-300/70 group-hover:bg-slate-100 group-hover:text-slate-500 group-hover:ring-2 group-hover:ring-slate-200/60"
              }`}
            >
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </span>
          </div>

          {product.categoryName && (
            <span className="mt-2 inline-flex max-w-full items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px]/[1.33] font-semibold text-primary shadow-sm ring-1 ring-inset ring-primary/10 transition-colors duration-300 group-hover:border-primary/30 group-hover:bg-primary/10">
              <span aria-hidden className="shrink-0">
                {product.categoryEmoji}
              </span>
              <span className="truncate">{product.categoryName}</span>
            </span>
          )}

          {/*  {product.categoryName && (
            <span
              className={`mt-2 inline-flex max-w-full items-center gap-1 rounded-full border px-2.5 py-1 text-[11px]/[1.33] font-semibold shadow-sm ring-1 ring-inset transition-colors duration-300 ${
                positive
                  ? "border-success/25 bg-[#e6f6ec]/60 text-success ring-success/10 group-hover:border-success/40 group-hover:bg-[#e6f6ec]"
                  : negative
                    ? "border-error/25 bg-[#fdeaea]/60 text-error ring-error/10 group-hover:border-error/40 group-hover:bg-[#fdeaea]"
                    : "border-slate-300/60 bg-slate-100/60 text-slate-500 ring-slate-200/60 group-hover:border-slate-300 group-hover:bg-slate-100"
              }`}
            >
              <span aria-hidden className="shrink-0">
                {product.categoryEmoji}
              </span>
              <span className="truncate">{product.categoryName}</span>
            </span>
          )} */}
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-dashed border-slate-200/90 transition-colors duration-300 group-hover:border-slate-300" />

      {/* Price row: label and price are left-aligned */}
      <div className="mt-auto flex items-end justify-between gap-3">
        <div className="min-w-0 text-left">
          <p className="text-[11px] font-semibold text-slate-500">আজকের দাম</p>

          <p className="bangla-number mt-1 whitespace-nowrap text-xl font-black leading-none tracking-tight text-base-content sm:text-2xl">
            {formatPrice(product.price)}
            <span className="ml-1.5 text-xs font-bold tracking-normal text-slate-500">
              টাকা
            </span>
          </p>
        </div>

        <span
          className={`inline-flex items-center rounded-xl border px-2.5 py-1 gap-1 text-[11px]/[1.33] font-extrabold shadow-sm ring-1 ring-inset transition-colors ${
            positive
              ? "border-success/30 bg-[#e6f6ec] text-success ring-success/10 shadow-success/10"
              : negative
                ? "border-error/30 bg-[#fdeaea] text-error ring-error/10 shadow-error/10"
                : "border-slate-300/70 bg-slate-100 text-slate-500 ring-slate-200/60 shadow-slate-200/50"
          }`}
        >
          {positive ? "▲" : negative ? "▼" : "—"}{" "}
          {formatPercent(Math.abs(product.change))}%
        </span>
      </div>
    </Link>
  );
}

/* <span
  className={`grid size-8 shrink-0 place-items-center rounded-full border border-transparent text-slate-400 transition-all duration-300 ${
    positive
      ? "group-hover:border-success/30 group-hover:bg-[#e6f6ec] group-hover:text-success group-hover:ring-4 group-hover:ring-success/10"
      : negative
        ? "group-hover:border-error/30 group-hover:bg-[#fdeaea] group-hover:text-error group-hover:ring-4 group-hover:ring-error/10"
        : "group-hover:border-slate-300/70 group-hover:bg-slate-100 group-hover:text-slate-500 group-hover:ring-4 group-hover:ring-slate-200/60"
  }`}
>
  <ArrowUpRight
    size={16}
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
  />
</span>

*/
