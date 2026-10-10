"use client";

import { bn, shortUnit, taka } from "@/lib/formatters";
import type { MarketPrice } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

type Group = {
  name: string;
  count: number;
  avg: number;
  min: number;
  max: number;
  cheapest: MarketPrice;
};

export default function DivisionHeatTiles({
  markets,
  avg,
  unit,
  selected,
  onSelect,
}: {
  markets: MarketPrice[];
  avg: number;
  unit: string;
  selected: string; // "all" or a division name
  onSelect: (division: string) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const u = shortUnit(unit);

  const { groups, lo, hi } = useMemo(() => {
    const map = new Map<string, MarketPrice[]>();
    for (const m of markets) {
      const d = m.division || "অন্যান্য";
      map.set(d, [...(map.get(d) ?? []), m]);
    }

    const groups: Group[] = [...map.entries()]
      .map(([name, list]) => ({
        name,
        count: list.length,

        avg: list.reduce((s, m) => s + m.avg, 0) / list.length,

        min: Math.min(...list.map((m) => m.min)),

        max: Math.max(...list.map((m) => m.max)),

        cheapest: list.reduce((a, b) => (b.avg < a.avg ? b : a)),
      }))
      .sort((a, b) => a.avg - b.avg);

    return {
      groups,
      lo: groups[0]?.avg ?? 0,
      hi: groups[groups.length - 1]?.avg ?? 0,
    };
  }, [markets]);

  if (groups.length < 2) return null;

  // 0 = cheapest (green) … 1 = priciest (red)
  const heat = (v: number) => (hi === lo ? 0.5 : (v - lo) / (hi - lo));
  const hue = (v: number) => Math.round(145 - 145 * heat(v));

  return (
    <section aria-label="বিভাগ অনুযায়ী দাম" className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="text-lg font-extrabold text-neutral">
            🗺️ বিভাগ অনুযায়ী দাম
          </h3>

          <p className="text-sm text-slate-500">
            বিভাগে ক্লিক করলে নিচের হিসাব ও তালিকা সেই বিভাগের হবে
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            সস্তা
            <span
              aria-hidden
              className="h-2 w-20 rounded-full"
              style={{
                background:
                  "linear-gradient(to right, hsl(145 70% 45%), hsl(70 75% 50%), hsl(0 70% 50%))",
              }}
            />
            দামি
          </div>

          {selected !== "all" && (
            <button
              type="button"
              onClick={() => onSelect("all")}
              className="rounded-full border border-base-300 bg-white px-3 py-1 text-xs font-bold text-primary transition hover:bg-primary hover:text-primary-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              ✕ সব বিভাগ
            </button>
          )}
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {groups.map((g, i) => {
          const h = hue(g.avg);
          const isSel = selected === g.name;
          const d = Math.round(g.avg - avg);
          const isCheapest = i === 0;
          const isPriciest = i === groups.length - 1;

          return (
            <li key={g.name}>
              <button
                type="button"
                aria-pressed={isSel}
                onClick={() => onSelect(isSel ? "all" : g.name)}
                className={`group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 motion-reduce:transition-none ${
                  isSel ? "ring-2 ring-primary ring-offset-2" : ""
                }`}
                style={{
                  background: `linear-gradient(135deg, hsl(${h} 85% 95%), hsl(${h} 80% 99%))`,
                  borderColor: `hsl(${h} 60% 78%)`,
                  opacity: mounted ? 1 : 0,
                  transform: mounted
                    ? undefined
                    : "scale(0.94) translateY(8px)",
                  transitionDelay: mounted ? "0ms" : `${i * 70}ms`,
                }}
              >
                {/* glow blob */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full opacity-40 blur-2xl transition-opacity duration-300 group-hover:opacity-80"
                  style={{ background: `hsl(${h} 80% 60%)` }}
                />

                <div className="relative flex items-start justify-between gap-2">
                  <p
                    className="font-extrabold"
                    style={{ color: `hsl(${h} 70% 26%)` }}
                  >
                    {g.name}
                  </p>

                  <span className="shrink-0 text-xs font-bold">
                    {isSel ? (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-primary-content">
                        ✓ বাছাই
                      </span>
                    ) : isCheapest ? (
                      <span className="rounded-full bg-white/80 px-2 py-0.5 text-emerald-700">
                        🏆 সস্তা
                      </span>
                    ) : isPriciest ? (
                      <span className="rounded-full bg-white/80 px-2 py-0.5 text-rose-700">
                        🔺 দামি
                      </span>
                    ) : null}
                  </span>
                </div>

                <p
                  className="relative mt-2 text-3xl font-extrabold leading-none tabular-nums"
                  style={{ color: `hsl(${h} 72% 30%)` }}
                >
                  {taka(Math.round(g.avg))}
                  <span className="ml-1 text-xs font-semibold opacity-60">
                    /{u}
                  </span>
                </p>

                <p
                  className="relative mt-1 text-xs font-semibold"
                  style={{ color: `hsl(${h} 55% 30%)` }}
                >
                  {d === 0
                    ? "সব বাজারের গড়ের সমান"
                    : `${d > 0 ? "▲" : "▼"} গড়ের চেয়ে ${taka(Math.abs(d))} ${d > 0 ? "বেশি" : "কম"}`}
                </p>

                <div className="relative mt-3 space-y-0.5 border-t border-black/5 pt-2 text-xs text-slate-600">
                  <p className="truncate">
                    <span aria-hidden>🏷️ </span>
                    সস্তা: <strong>{g.cheapest.name}</strong>{" "}
                    {taka(Math.round(g.cheapest.avg))}
                  </p>

                  <p className="text-slate-500">
                    {bn(g.count)}টি বাজার · {taka(g.min)} – {taka(g.max)}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
