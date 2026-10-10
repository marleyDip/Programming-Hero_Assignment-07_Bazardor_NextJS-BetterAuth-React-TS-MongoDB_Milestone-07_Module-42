"use client";

import { bn, bnPct, shortUnit, taka } from "@/lib/formatters";
import type { PriceHistory } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

const W = 640;
const H = 220;
const PX = 28;
const PT = 28;
const PB = 24;

type Point = { key: string; label: string; value: number };

export default function PriceHistoryChart({
  history,
  unit,
  risingIsBad = true,
}: {
  history: PriceHistory;
  unit: string;
  risingIsBad?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const points = useMemo<Point[]>(() => {
    const raw = [
      { key: "lastMonth", label: "৩০ দিন আগে", value: history.lastMonth },
      { key: "lastWeek", label: "৭ দিন আগে", value: history.lastWeek },
      { key: "yesterday", label: "গতকাল", value: history.yesterday },
      { key: "today", label: "আজ", value: history.today },
    ];
    return raw.filter((p): p is Point => p.value !== null);
  }, [history]);

  const geo = useMemo(() => {
    const vals = points.map((p) => p.value);
    let lo = Math.min(...vals);
    let hi = Math.max(...vals);
    if (hi === lo) {
      lo -= 1;
      hi += 1;
    }
    const pad = (hi - lo) * 0.3;
    lo -= pad;
    hi += pad;

    const xs = points.map(
      (_, i) => PX + (i * (W - 2 * PX)) / Math.max(points.length - 1, 1),
    );
    const ys = points.map(
      (p) => PT + (1 - (p.value - lo) / (hi - lo)) * (H - PT - PB),
    );

    // Smooth curve that never overshoots between points.
    let line = `M ${xs[0]} ${ys[0]}`;
    for (let i = 1; i < xs.length; i++) {
      const mx = (xs[i - 1] + xs[i]) / 2;
      line += ` C ${mx} ${ys[i - 1]}, ${mx} ${ys[i]}, ${xs[i]} ${ys[i]}`;
    }
    const area = `${line} L ${xs[xs.length - 1]} ${H - PB} L ${xs[0]} ${H - PB} Z`;

    return { xs, ys, line, area };
  }, [points]);

  if (points.length < 2) {
    return (
      <div className="rounded-3xl border border-base-300 bg-white p-8 text-center text-sm text-slate-500">
        দামের ইতিহাস এখনো পাওয়া যায়নি।
      </div>
    );
  }

  const last = points.length - 1;
  const active = hover ?? selected ?? last;
  const current = points[active];
  const today = points[last].value;

  // Comparison: today vs the selected moment
  const diff = today - current.value;
  const pct = current.value ? (diff / current.value) * 100 : 0;
  const isToday = active === last;
  const up = diff > 0;
  const tone =
    diff === 0
      ? "text-slate-600 bg-slate-100"
      : up === risingIsBad
        ? "text-rose-700 bg-rose-100"
        : "text-emerald-700 bg-emerald-100";

  const nearest = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    let best = 0;
    geo.xs.forEach((px, i) => {
      if (Math.abs(px - x) < Math.abs(geo.xs[best] - x)) best = i;
    });
    return best;
  };

  const motion = "transition-all duration-300 motion-reduce:transition-none";

  return (
    <div className="rounded-3xl border border-base-300 bg-white p-5 shadow-sm sm:p-7">
      {/* Readout */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500">
            {current.label}
          </p>
          <p className="text-4xl font-extrabold leading-tight text-neutral">
            <span className="text-primary">{taka(current.value)}</span>
            <span className="ml-1.5 text-base font-semibold text-slate-400">
              /{shortUnit(unit)}
            </span>
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold ${
            isToday ? "bg-primary/10 text-primary" : tone
          }`}
        >
          {isToday ? (
            "বর্তমান দাম"
          ) : diff === 0 ? (
            `${current.label} থেকে অপরিবর্তিত`
          ) : (
            <>
              <span aria-hidden>{up ? "▲" : "▼"}</span>
              {current.label} থেকে আজ {taka(Math.abs(diff))}{" "}
              {up ? "বেশি" : "কম"} ({bnPct(Math.abs(pct))}%)
            </>
          )}
        </span>
      </div>

      {/* Chart */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="দামের ইতিহাসের চার্ট"
        className="mt-4 h-auto w-full touch-pan-y text-primary select-none"
        onPointerMove={(e) => setHover(nearest(e))}
        onPointerDown={(e) => {
          const i = nearest(e);
          setSelected(i);
          setHover(i);
        }}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="phc-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {[0.25, 0.5, 0.75].map((t) => (
          <line
            key={t}
            x1={PX}
            x2={W - PX}
            y1={PT + t * (H - PT - PB)}
            y2={PT + t * (H - PT - PB)}
            stroke="#e2e8f0"
            strokeDasharray="4 6"
          />
        ))}

        {/* Area */}
        <path
          d={geo.area}
          fill="url(#phc-fill)"
          className="transition-opacity delay-500 duration-1000 motion-reduce:transition-none"
          style={{ opacity: mounted ? 1 : 0 }}
        />

        {/* Line (draws itself) */}
        <path
          d={geo.line}
          pathLength={1}
          fill="none"
          stroke="currentColor"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeDasharray={1}
          strokeDashoffset={mounted ? 0 : 1}
          className="transition-[stroke-dashoffset] duration-1200 ease-out motion-reduce:transition-none"
        />

        {/* Guide line */}
        <line
          x1={0}
          x2={0}
          y1={PT - 12}
          y2={H - PB}
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeDasharray="3 5"
          className={motion}
          style={{ transform: `translateX(${geo.xs[active]}px)` }}
        />

        {/* Dots */}
        {geo.xs.map((x, i) => (
          <circle
            key={points[i].key}
            cx={x}
            cy={geo.ys[i]}
            r={5}
            fill="#fff"
            stroke="currentColor"
            strokeWidth={2.5}
            className="transition-opacity duration-700 motion-reduce:transition-none"
            style={{
              opacity: mounted ? 1 : 0,
              transitionDelay: `${i * 250}ms`,
            }}
          />
        ))}

        {/* Active marker */}
        <g
          className={motion}
          style={{
            transform: `translate(${geo.xs[active]}px, ${geo.ys[active]}px)`,
          }}
        >
          <circle r={16} fill="currentColor" fillOpacity={0.14} />
          <circle r={8} fill="currentColor" stroke="#fff" strokeWidth={3} />
        </g>
      </svg>

      {/* Period chips (also the keyboard-accessible control) */}
      <div
        role="group"
        aria-label="সময় বেছে নিন"
        className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4"
      >
        {points.map((p, i) => {
          const isActive = i === active;
          return (
            <button
              key={p.key}
              type="button"
              aria-pressed={i === (selected ?? last)}
              onClick={() => setSelected(i)}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              className={`rounded-2xl border px-3 py-2.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                isActive
                  ? "border-primary/40 bg-primary/10 shadow-sm"
                  : "border-base-300 bg-white hover:border-primary/30 hover:bg-primary/5"
              }`}
            >
              <span className="block text-xs font-semibold text-slate-500">
                {p.label}
              </span>
              <span
                className={`block text-lg font-extrabold ${
                  isActive ? "text-primary" : "text-neutral"
                }`}
              >
                ৳{bn(p.value)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
