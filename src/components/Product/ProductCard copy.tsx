import { formatPercent, formatPrice } from "@/lib/formatters";
import type { Product } from "@/lib/types";
import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  ArrowUpRight as OpenIcon,
} from "lucide-react";
import Link from "next/link";

export default function ProductCard1({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const positive = product.change > 0;
  const negative = product.change < 0;

  const changeStyle = positive
    ? "border-emerald-100 bg-emerald-50 text-emerald-700"
    : negative
      ? "border-rose-100 bg-rose-50 text-rose-700"
      : "border-slate-200 bg-slate-50 text-slate-500";

  return (
    <Link
      href={`/product/${encodeURIComponent(product.slug)}`}
      className={`
        group relative flex h-full flex-col overflow-hidden
        rounded-2xl border border-base-300/80 bg-base-100
        p-4 sm:p-5
        shadow-[0_2px_12px_rgba(20,41,28,0.035)]
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:border-primary/25
        hover:shadow-[0_12px_32px_rgba(21,128,61,0.09)]
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-primary focus-visible:ring-offset-2
        ${compact ? "min-h-40" : "min-h-48"}
      `}
    >
      {/* Subtle decorative accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />

      {/* Product information */}
      <div className="flex items-start gap-3.5">
        <div className="grid size-14 shrink-0 place-items-center rounded-2xl border border-[#e8f3e9] bg-linear-to-br from-[#f5fbf5] to-[#eaf6ec] text-[30px] transition-transform duration-300 group-hover:scale-105 sm:size-16 sm:text-[34px]">
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

            <span className="grid size-7 shrink-0 place-items-center rounded-full text-slate-400 transition-all group-hover:bg-green-50 group-hover:text-primary">
              <OpenIcon size={15} />
            </span>
          </div>

          {product.categoryName && (
            <p className="mt-2 truncate text-[11px] font-semibold text-slate-400">
              {product.categoryEmoji} {product.categoryName}
            </p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-dashed border-slate-200/90" />

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
          className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1.5 text-[11px] font-extrabold ${changeStyle}`}
        >
          {positive ? (
            <ArrowUpRight size={13} strokeWidth={2.5} />
          ) : negative ? (
            <ArrowDownRight size={13} strokeWidth={2.5} />
          ) : (
            <Minus size={12} strokeWidth={2.5} />
          )}

          <span className="bangla-number">
            {formatPercent(Math.abs(product.change))}%
          </span>
        </span>
      </div>
    </Link>
  );
}
