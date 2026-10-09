"use client";

import type { Product } from "@/lib/types";
import Link from "next/link";
import { useMemo } from "react";

// Props
interface PriceTickerProps {
  products: Product[];
  secondsPerItem?: number; // Seconds each item takes to cross the strip. Higher = slower. Default 4
  direction?: "left" | "right"; // Scroll direction. Default "left"
  pauseOnHover?: boolean; // Pause while hovering / focusing an item. Default true
  hrefBase?: string; // Where each item links to. Default "/product"
  label?: string; // Label shown at the left. Pass "" to hide
  risingIsBad?: boolean; // Rising price = red, falling = green (consumer view). Set false to flip.
}

// Formatting
const bnNumber = new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 2 });
const bnPercent = new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 1 });

/** "প্রতি কেজি" → "কেজি" */
const shortUnit = (unit: string) => unit.replace(/^প্রতি\s*/, "").trim();

const TREND_STYLES = {
  good: "bg-emerald-400/15 text-emerald-300",
  bad: "bg-rose-400/15 text-rose-300",
  flat: "bg-white/10 text-slate-300",
} as const;

// Single ticker item
function TickerItem({
  product,
  href,
  hidden,
  risingIsBad,
}: {
  product: Product;
  href: string;
  hidden: boolean;
  risingIsBad: boolean;
}) {
  const { trend, change } = product;

  const tone =
    trend === "flat"
      ? TREND_STYLES.flat
      : (trend === "up") === risingIsBad
        ? TREND_STYLES.bad
        : TREND_STYLES.good;

  const arrow = trend === "up" ? "▲" : trend === "down" ? "▼" : "-";
  const unit = shortUnit(product.unit);

  return (
    <li className="shrink-0 pr-3">
      <Link
        href={href}
        tabIndex={hidden ? -1 : undefined}
        className="group/item flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 py-1.5 pl-2 pr-3 text-sm whitespace-nowrap transition duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <span
          aria-hidden
          className="grid size-7 place-items-center rounded-full bg-white/10 text-sm transition-transform duration-300 group-hover/item:scale-110 group-hover/item:-rotate-6"
        >
          {product.emoji}
        </span>

        <span className="text-sm font-semibold text-white">{product.name}</span>

        <span className="text-sm text-slate-300">
          <span className="font-semibold text-white">
            {bnNumber.format(product.price)}
          </span>{" "}
          টাকা{unit && `/${unit}`}
        </span>

        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${tone}`}
        >
          <span aria-hidden>{arrow}</span>
          {trend === "flat" ? (
            <span className="sr-only">অপরিবর্তিত</span>
          ) : (
            <>
              {bnPercent.format(Math.abs(change))}%
              <span className="sr-only">
                {trend === "up" ? " বেড়েছে" : " কমেছে"}
              </span>
            </>
          )}
        </span>
      </Link>
    </li>
  );
}

// Ticker
export default function PriceTicker({
  products,
  secondsPerItem = 12,
  direction = "left",
  pauseOnHover = true,
  hrefBase = "/product",
  label = "আজকের দাম",
  risingIsBad = true,
}: PriceTickerProps) {
  // const [paused, setPaused] = useState(false);

  // Repeat short lists so one group is always wider than the viewport.
  const group = useMemo(() => {
    if (products.length === 0) return [];
    const reps = Math.max(1, Math.ceil(12 / products.length));

    return Array.from({ length: reps }, () => products).flat();
  }, [products]);

  if (group.length === 0) return null;

  // const duration = Math.max(20, group.length * secondsPerItem);
  const duration = Math.max(40, group.length * secondsPerItem);

  const renderGroup = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className={`flex shrink-0 items-center ${hidden ? "motion-reduce:hidden" : ""}`}
    >
      {group.map((product, i) => (
        <TickerItem
          key={`${hidden ? "b" : "a"}-${product.id}-${i}`}
          product={product}
          href={`${hrefBase}/${product.slug}`}
          hidden={hidden}
          risingIsBad={risingIsBad}
        />
      ))}
    </ul>
  );

  return (
    <section
      aria-label="বাজারদরের টিকার"
      className="border-b border-white/10 bg-slate-900 text-white"
    >
      <div
        className="ticker-root mx-auto flex max-w-6xl items-center gap-3 px-4 py-2"
        // data-paused={paused}
        data-hover-pause={pauseOnHover}
      >
        {/* Label */}
        {label && (
          <div className="hidden md:flex shrink-0 items-center gap-2 rounded-full bg-white/10 py-1.5 pl-2.5 pr-3 text-xs font-bold tracking-wide">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />

              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            {label}
          </div>
        )}

        {/* Marquee viewport */}
        <div
          className="min-w-0 flex-1 overflow-hidden py-0.5 motion-reduce:overflow-x-auto"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)",
          }}
        >
          <div
            className="ticker-track flex w-max"
            style={
              {
                "--ticker-duration": `${duration}s`,
                "--ticker-direction":
                  direction === "left" ? "normal" : "reverse",
              } as React.CSSProperties
            }
          >
            {renderGroup(false)}
            {renderGroup(true)}
          </div>
        </div>

        {/* Play / pause (accessibility + control) */}
        {/* <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? "টিকার চালু করুন" : "টিকার থামান"}
          className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 motion-reduce:hidden"
        >
          {paused ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
            </svg>
          )}
        </button> */}
      </div>
    </section>
  );
}
