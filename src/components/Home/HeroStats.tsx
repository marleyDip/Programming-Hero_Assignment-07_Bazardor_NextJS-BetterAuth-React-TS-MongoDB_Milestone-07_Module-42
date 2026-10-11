"use client";

import type { SiteStats } from "@/lib/site-stats";
import { LayoutGrid, Package, Store } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const bnNumber = new Intl.NumberFormat("bn-BD");

/** Counts from 0 → value once the element scrolls into view. */
function CountUp({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;

    if (reduced || value === 0) {
      raf = requestAnimationFrame(() => setShown(value));
      return;
    }

    const run = () => {
      const start = performance.now();
      const duration = 1300;

      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);

        setShown(Math.round((1 - Math.pow(1 - t, 3)) * value)); // easeOutCubic

        if (t < 1) raf = requestAnimationFrame(tick);
      };

      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span
      ref={ref}
      className={`tabular-nums ${className}`}
      aria-label={bnNumber.format(value)}
    >
      <span aria-hidden>{bnNumber.format(shown)}</span>
    </span>
  );
}

export default function HeroStats({ stats }: { stats: SiteStats }) {
  const small = [
    {
      key: "markets",
      icon: Store,
      label: "বাজার অন্তর্ভুক্ত",
      value: stats.markets,
      note: "বিভাগ ধরে তুলনা",
    },
    {
      key: "categories",
      icon: LayoutGrid,
      label: "ক্যাটাগরির সংখ্যা",
      value: stats.categories,
      note: "চাল থেকে মসলা",
    },
  ] as const;

  return (
    <div className="relative w-full max-w-md justify-self-center md:max-w-none">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-4 -z-10 rounded-4xl bg-primary/10 blur-2xl"
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Products – featured tile */}
        <div className="group relative col-span-2 overflow-hidden rounded-3xl bg-linear-to-br from-primary to-secondary p-5 text-primary-content shadow-xl shadow-primary/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/30 sm:p-6">
          <span
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-10 size-40 rounded-full bg-white/15 blur-2xl transition-transform duration-500 group-hover:scale-125"
          />

          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
              backgroundSize: "20px 20px",
            }}
          />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary-content/85">
                মোট নিত্যদিনের পণ্য
              </p>

              <p className="mt-1 flex items-baseline gap-1.5">
                <CountUp
                  value={stats.products}
                  className="text-5xl font-extrabold leading-none sm:text-6xl"
                />

                <span className="text-lg font-bold text-primary-content/80">
                  টি
                </span>
              </p>

              <p className="mt-2 max-w-52 text-xs leading-5 text-primary-content/75">
                চাল, ডাল, সবজি, মাছ-মাংস ও মসলার প্রতিদিনের দাম
              </p>
            </div>

            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/20 ring-1 ring-white/30 backdrop-blur transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
              <Package size={24} strokeWidth={2} />
            </span>
          </div>
        </div>

        {/* Markets & Categories */}
        {small.map(({ key, icon: Icon, label, value, note }) => (
          <div
            key={key}
            className="group relative overflow-hidden rounded-3xl border border-base-300 bg-base-100 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 sm:p-5"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-primary/10 blur-xl transition-opacity duration-300 group-hover:opacity-100"
            />

            <span className="relative grid size-10 place-items-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-content">
              <Icon size={20} strokeWidth={2.2} />
            </span>

            <p className="relative mt-3 text-xs font-semibold text-base-content/60 sm:text-sm">
              {label}
            </p>

            <p className="relative mt-0.5 flex items-baseline gap-1">
              <CountUp
                value={value}
                className="text-3xl font-extrabold leading-none text-base-content sm:text-4xl"
              />

              <span className="text-sm font-bold text-base-content/60">টি</span>
            </p>

            <p className="relative mt-1.5 text-[11px] text-base-content/50">
              {note}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
