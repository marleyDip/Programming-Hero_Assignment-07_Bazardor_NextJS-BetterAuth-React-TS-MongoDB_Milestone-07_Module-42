import { formatPercent, formatPrice } from "@/lib/formatters";
import type { Product } from "@/lib/types";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function ProductCard2({
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
      href={`/product/${product.slug}`}
      className={`group rounded-2xl border border-base-300 bg-base-100 p-4 transition hover:-translate-y-0.5 hover:border-[#b8d8bf] card-shadow ${compact ? "" : "min-h-39.5"}`}
    >
      <div className="flex items-start gap-3 lg:gap-4">
        <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-primary-content text-3xl/[1.33]">
          {product.emoji}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="truncate font-extrabold group-hover:text-primary">
                {product.name}
              </h3>

              <p className="mt-1 text-xs/[1.33] text-slate-500">
                {product.unit}
              </p>
            </div>

            <ArrowUpRight
              size={16}
              className="shrink-0 text-slate-300 transition group-hover:text-primary"
            />
          </div>

          <div className="mt-4 flex items-end justify-between gap-2">
            <div>
              <p className="text-[10px] font-semibold text-slate-500">
                আজকের দাম
              </p>

              <p className="mt-0.5 bangla-number text-xl font-black">
                {formatPrice(product.price)}{" "}
                <span className="text-xs font-bold text-slate-500">টাকা</span>
              </p>
            </div>

            <span
              className={`rounded-xl px-2.5 py-1 gap-1 text-[11px]/[1.33] font-extrabold ${
                positive
                  ? "bg-[#e6f6ec] text-success"
                  : negative
                    ? "bg-[#fdeaea] text-error"
                    : "bg-slate-100 text-slate-500"
              }`}
            >
              {positive ? "▲" : negative ? "▼" : "—"}{" "}
              {formatPercent(Math.abs(product.change))}%
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
