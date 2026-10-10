"use client";

import { bn, shortUnit, taka } from "@/lib/formatters";
import type { MarketPrice } from "@/lib/types";
import { ArrowUpDown, Store } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

type SortKey = "name" | "division" | "min" | "avg" | "max";
type SortDir = "asc" | "desc";

export default function MarketExplorer({
  markets,
  avg,
  unit,
  risingIsBad = true,
  division: controlledDivision,
  onDivisionChange,
  insights,
}: {
  markets: MarketPrice[];
  avg: number; // overall average across markets
  unit: string;
  risingIsBad?: boolean;
  /** Optional controlled division (use with onDivisionChange). */
  division?: string;
  onDivisionChange?: (division: string) => void;
  /** Rendered between the summary and the table toolbar. */
  insights?: ReactNode;
}) {
  const [innerDivision, setInnerDivision] = useState("all");

  const division = controlledDivision ?? innerDivision;
  const setDivision = (d: string) => {
    setInnerDivision(d);
    onDivisionChange?.(d);
  };

  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("avg");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [view, setView] = useState<"table" | "cards">("table");
  const [open, setOpen] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));

    return () => cancelAnimationFrame(id);
  }, []);

  const u = shortUnit(unit);

  // Derived data
  const divisions = useMemo(() => {
    const map = new Map<string, number>();

    for (const m of markets) {
      const d = m.division || "অন্যান্য";
      map.set(d, (map.get(d) ?? 0) + 1);
    }

    return [...map.entries()];
  }, [markets]);

  const stats = useMemo(() => {
    if (markets.length === 0) return null;

    const cheapest = markets.reduce((a, b) => (b.avg < a.avg ? b : a));

    const priciest = markets.reduce((a, b) => (b.avg > a.avg ? b : a));

    const lowest = markets.reduce((a, b) => (b.min < a.min ? b : a));

    const highest = markets.reduce((a, b) => (b.max > a.max ? b : a));

    return { cheapest, priciest, lowest, highest };
  }, [markets]);

  // Shared scale so range bars are comparable across ALL markets.
  const scale = useMemo(() => {
    if (markets.length === 0) return { lo: 0, hi: 1 };

    let lo = Math.min(...markets.map((m) => m.min));

    let hi = Math.max(...markets.map((m) => m.max));

    const pad = Math.max(hi - lo, 1) * 0.06;

    lo -= pad;
    hi += pad;

    return { lo, hi };
  }, [markets]);

  const pos = (v: number) =>
    Math.min(100, Math.max(0, ((v - scale.lo) / (scale.hi - scale.lo)) * 100));

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = markets.filter(
      (m) =>
        (division === "all" || (m.division || "অন্যান্য") === division) &&
        (!q || m.name.toLowerCase().includes(q)),
    );

    const cmp = (a: MarketPrice, b: MarketPrice) => {
      if (sortKey === "name") return a.name.localeCompare(b.name, "bn");

      if (sortKey === "division")
        return (a.division || "").localeCompare(b.division || "", "bn");

      return a[sortKey] - b[sortKey];
    };

    return [...filtered].sort((a, b) =>
      sortDir === "asc" ? cmp(a, b) : -cmp(a, b),
    );
  }, [markets, division, query, sortKey, sortDir]);

  if (!stats) {
    return (
      <div className="rounded-3xl border border-base-300 bg-white p-8 text-center text-sm text-slate-500">
        বাজারভিত্তিক দাম এখনো পাওয়া যায়নি।
      </div>
    );
  }

  const saving = Math.round(stats.priciest.avg - stats.cheapest.avg);
  const hasSpread = stats.cheapest !== stats.priciest;

  const diffTone = (d: number) =>
    d === 0
      ? "bg-slate-100 text-slate-600"
      : d > 0 === risingIsBad
        ? "bg-rose-100 text-rose-700"
        : "bg-emerald-100 text-emerald-700";

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const renderTh = (
    key: SortKey,
    label: string,
    opts: { align?: "left" | "right"; className?: string } = {},
  ) => {
    const active = sortKey === key;
    const right = opts.align === "right";

    return (
      <th
        scope="col"
        aria-sort={
          active ? (sortDir === "asc" ? "ascending" : "descending") : "none"
        }
        className={`px-4 py-3 ${right ? "text-right" : "text-left"} ${opts.className ?? ""}`}
      >
        <button
          type="button"
          onClick={() => toggleSort(key)}
          className={`group/th inline-flex items-center gap-1.5 rounded-md text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
            right ? "flex-row-reverse" : ""
          } ${active ? "text-primary" : "text-slate-500 hover:text-primary"}`}
        >
          {label}
          <span
            aria-hidden
            className={`text-[10px] leading-none transition-opacity ${
              active ? "opacity-100" : "opacity-30 group-hover/th:opacity-70"
            }`}
          >
            {active ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
          </span>
        </button>
      </th>
    );
  };

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            label: "সর্বনিম্ন দাম",
            value: stats.lowest.min,
            note: stats.lowest.name,
            icon: "📉",
            style: "from-emerald-50 to-white border-emerald-200",
            text: "text-emerald-700",
          },

          {
            label: "সব বাজারের গড়",
            value: avg,
            note: `${bn(markets.length)}টি বাজার`,
            icon: "⚖️",
            style: "from-primary/10 to-white border-primary/25",
            text: "text-primary",
          },

          {
            label: "সর্বোচ্চ দাম",
            value: stats.highest.max,
            note: stats.highest.name,
            icon: "📈",
            style: "from-rose-50 to-white border-rose-200",
            text: "text-rose-700",
          },
        ].map((c, i) => (
          <div
            key={c.label}
            className={`rounded-2xl border bg-linear-to-br p-4 shadow-sm transition-all duration-700 motion-reduce:transition-none ${c.style}`}
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "none" : "translateY(12px)",
              transitionDelay: `${i * 90}ms`,
            }}
          >
            <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
              <span aria-hidden>{c.icon}</span>
              {c.label}
            </p>

            <p className={`mt-1 text-3xl font-extrabold ${c.text}`}>
              {taka(c.value)}
              <span className="ml-1 text-sm font-semibold text-slate-400">
                /{u}
              </span>
            </p>

            <p className="truncate text-xs text-slate-500">{c.note}</p>
          </div>
        ))}
      </div>

      {/* Savings insight */}
      {saving > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-neutral">
          <span aria-hidden className="text-xl">
            💡
          </span>

          <p>
            <strong className="text-primary">{stats.cheapest.name}</strong> এ
            কিনলে <strong>{stats.priciest.name}</strong> এর তুলনায় প্রতি {u}তে
            গড়ে <strong className="text-primary">{taka(saving)}</strong>{" "}
            পর্যন্ত সাশ্রয় হতে পারে।
          </p>
        </div>
      )}

      {/* Budget Calculator */}
      {insights}

      {/* Toolbar: Division Chips & Toggle */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Division */}
        <div
          role="group"
          aria-label="বিভাগ"
          // className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
          className="-mx-4 flex gap-2 flex-wrap px-4 pb-1 scrollbar-none lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {[["all", markets.length] as const, ...divisions].map(
            ([d, count]) => {
              const active = division === d;
              return (
                <button
                  key={d}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setDivision(d)}
                  className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer ${
                    active
                      ? "border-primary bg-primary text-primary-content shadow-sm shadow-primary/30"
                      : "border-base-300 bg-white text-neutral/70 hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {d === "all" ? "সব বিভাগ" : d}
                  <span
                    className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                      active ? "bg-white/20" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {bn(count)}
                  </span>
                </button>
              );
            },
          )}
        </div>

        {/* View toggle */}
        <div
          role="group"
          aria-label="দেখার ধরন"
          className="flex shrink-0 w-fit gap-1 rounded-full border border-base-300 bg-white p-1 shadow-sm"
        >
          {(
            [
              ["table", "টেবিল", "M3 5h18M3 12h18M3 19h18"],
              [
                "cards",
                "কার্ড",
                "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
              ],
            ] as const
          ).map(([k, label, icon]) => (
            <button
              key={k}
              type="button"
              aria-pressed={view === k}
              onClick={() => setView(k)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer ${
                view === k
                  ? "bg-primary text-primary-content shadow-sm shadow-primary/30"
                  : "text-neutral/70 hover:bg-primary/10 hover:text-primary"
              }`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d={icon} />
              </svg>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Card list */}
      {view === "cards" && (
        <div className="space-y-3">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500">
              <ArrowUpDown size={16} strokeWidth={2.2} /> সাজান:
            </span>

            <div className="flex gap-1 rounded-full border border-base-300 bg-white p-1 shadow-sm">
              {(
                [
                  ["asc", "সস্তা আগে"],
                  ["desc", "দামি আগে"],
                ] as const
              ).map(([dir, label]) => {
                const on = sortKey === "avg" && sortDir === dir;
                return (
                  <button
                    key={dir}
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      setSortKey("avg");
                      setSortDir(dir);
                    }}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-grab ${
                      on
                        ? "bg-primary text-primary-content"
                        : "text-neutral/70 hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card */}
          <ul className="space-y-2.5">
            {rows.map((m, i) => {
              const isOpen = open === m.name;
              const d = Math.round(m.avg - avg);
              const isCheapest = hasSpread && m.name === stats.cheapest.name;
              const isPriciest = hasSpread && m.name === stats.priciest.name;

              return (
                <li
                  key={`${m.division}-${m.name}`}
                  className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 motion-reduce:transition-none ${
                    isOpen
                      ? "border-primary/40 shadow-lg shadow-primary/10"
                      : "border-base-300 hover:border-primary/30 hover:shadow-md"
                  }`}
                  style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "none" : "translateY(10px)",
                    transitionDelay: mounted
                      ? "0ms"
                      : `${Math.min(i, 12) * 40}ms`,
                  }}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : m.name)}
                    className="group block w-full p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate font-bold text-neutral">
                            {m.name}
                          </p>

                          {isCheapest && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                              🏆 সবচেয়ে সস্তা
                            </span>
                          )}

                          {isPriciest && (
                            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700">
                              🔺 সবচেয়ে বেশি
                            </span>
                          )}
                        </div>

                        <p className="mt-0.5 text-xs text-slate-500">
                          📍 {m.division || "অন্যান্য"}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <div className="text-right">
                          <p className="text-lg font-extrabold leading-none text-primary">
                            {taka(m.avg)}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {taka(m.min)} – {taka(m.max)}
                          </p>
                        </div>

                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                          className={`text-slate-400 transition-transform duration-300 group-hover:text-primary ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </div>
                    </div>

                    {/* Range bar */}
                    <div className="relative mt-4 h-2.5 rounded-full bg-slate-100">
                      <span
                        className="absolute top-0 h-full rounded-full bg-linear-to-r from-primary/50 to-primary transition-all duration-900 ease-out motion-reduce:transition-none"
                        style={{
                          left: `${pos(m.min)}%`,
                          width: mounted
                            ? `${Math.max(pos(m.max) - pos(m.min), 1.5)}%`
                            : "0%",
                          transitionDelay: `${Math.min(i, 12) * 40}ms`,
                        }}
                      />

                      <span
                        className="absolute -inset-y-1 w-px bg-slate-400/80"
                        style={{ left: `${pos(avg)}%` }}
                      />

                      <span
                        className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow ring-2 ring-primary transition-opacity duration-700"
                        style={{
                          left: `${pos(m.avg)}%`,
                          opacity: mounted ? 1 : 0,
                        }}
                      />
                    </div>
                  </button>

                  {/* Expandable details */}
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="space-y-3 border-t border-dashed border-base-300 p-4">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          {[
                            [
                              "সর্বনিম্ন",
                              m.min,
                              "text-emerald-700 bg-emerald-50",
                            ],
                            ["গড়", m.avg, "text-primary bg-primary/10"],
                            ["সর্বোচ্চ", m.max, "text-rose-700 bg-rose-50"],
                          ].map(([label, value, cls]) => (
                            <div
                              key={label as string}
                              className={`rounded-xl p-3 ${cls}`}
                            >
                              <p className="text-xs font-semibold opacity-80">
                                {label}
                              </p>

                              <p className="text-xl font-extrabold">
                                {taka(value as number)}
                              </p>
                            </div>
                          ))}
                        </div>

                        <p className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                          সব বাজারের গড়ের তুলনায়
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${diffTone(d)}`}
                          >
                            {d === 0
                              ? "প্রায় সমান"
                              : `${taka(Math.abs(d))} ${d > 0 ? "বেশি" : "কম"}`}
                          </span>
                          প্রতি {u}তে
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Empty Card */}
          {rows.length === 0 && (
            <p className="rounded-2xl border border-dashed border-base-300 p-8 text-center text-sm text-slate-500">
              কোনো বাজার পাওয়া যায়নি।
            </p>
          )}
        </div>
      )}

      {/* Table */}
      {view === "table" && (
        <div className="space-y-3">
          {/* Search */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500">
              <Store size={18} strokeWidth={2.2} /> বাজার অনুসন্ধান:
            </span>

            <label className="relative block w-46 sm:w-2/5 lg:w-72 lg:flex-none">
              <span className="sr-only">বাজার খুঁজুন</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>

              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="বাজারের নাম খুঁজুন…"
                className="h-10 w-full rounded-full border border-base-300 bg-white pl-10 pr-4 text-sm shadow-sm outline-none transition placeholder:text-slate-400 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
              />
            </label>
          </div>

          <div className="overflow-hidden rounded-3xl border border-base-300 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-0 text-sm">
                <caption className="sr-only">
                  বাজারভিত্তিক দাম (টাকা / {u})
                </caption>

                <thead className="bg-slate-50/80 backdrop-blur">
                  <tr>
                    {renderTh("name", "বাজার")}
                    {renderTh("division", "বিভাগ", {
                      className: "hidden sm:table-cell",
                    })}
                    {renderTh("min", "সর্বনিম্ন", { align: "right" })}
                    {renderTh("avg", "গড়", { align: "right" })}
                    {renderTh("max", "সর্বোচ্চ", { align: "right" })}
                    <th
                      scope="col"
                      className="hidden px-4 py-3 text-left text-xs font-bold text-slate-500 lg:table-cell"
                    >
                      দামের পরিসর
                    </th>

                    <th
                      scope="col"
                      className="hidden px-4 py-3 text-right text-xs font-bold text-slate-500 md:table-cell"
                    >
                      গড়ের তুলনায়
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((m, i) => {
                    const d = Math.round(m.avg - avg);
                    const isCheapest =
                      hasSpread && m.name === stats.cheapest.name;
                    const isPriciest =
                      hasSpread && m.name === stats.priciest.name;
                    const initial = Array.from(m.name)[0] ?? "ব";

                    const cell =
                      "border-t border-base-300/70 transition-colors duration-200 group-hover/row:bg-primary/[0.06]";

                    return (
                      <tr
                        key={`${m.division}-${m.name}`}
                        className="group/row transition-all duration-500 motion-reduce:transition-none"
                        style={{
                          opacity: mounted ? 1 : 0,
                          transform: mounted ? "none" : "translateY(8px)",
                          transitionDelay: mounted
                            ? "0ms"
                            : `${Math.min(i, 12) * 35}ms`,
                        }}
                      >
                        {/* Market */}
                        <td className={`relative px-4 py-3.5 ${cell}`}>
                          {/* hover accent */}
                          <span
                            aria-hidden
                            className="absolute inset-y-2 left-0 w-1 origin-center scale-y-0 rounded-r-full bg-primary transition-transform duration-300 group-hover/row:scale-y-100"
                          />
                          <div className="flex items-center gap-3">
                            <span
                              aria-hidden
                              className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-sm font-extrabold text-primary transition-all duration-300 group-hover/row:scale-110 group-hover/row:bg-primary group-hover/row:text-primary-content"
                            >
                              {initial}
                            </span>

                            <div className="min-w-0">
                              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-bold text-neutral">
                                {m.name}
                                {isCheapest && (
                                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                                    🏆 সস্তা
                                  </span>
                                )}

                                {isPriciest && (
                                  <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-700">
                                    🔺 দামি
                                  </span>
                                )}
                              </p>

                              <p className="text-xs text-slate-500 sm:hidden">
                                {m.division || "অন্যান্য"}
                              </p>

                              {/* Mobile mini range bar */}
                              <div className="relative mt-2 h-1.5 w-28 rounded-full bg-slate-100 lg:hidden">
                                <span
                                  className="absolute top-0 h-full rounded-full bg-linear-to-r from-primary/50 to-primary"
                                  style={{
                                    left: `${pos(m.min)}%`,
                                    width: `${Math.max(pos(m.max) - pos(m.min), 3)}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Division */}
                        <td
                          className={`hidden px-4 py-3.5 sm:table-cell ${cell}`}
                        >
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 transition-colors group-hover/row:bg-white">
                            📍 {m.division || "অন্যান্য"}
                          </span>
                        </td>

                        {/* Min */}
                        <td
                          className={`px-4 py-3.5 text-right tabular-nums ${cell}`}
                        >
                          <span
                            className={`inline-block rounded-lg px-2 py-1 font-semibold ${
                              m.min === stats.lowest.min
                                ? "bg-emerald-100 text-emerald-700"
                                : "text-neutral/80"
                            }`}
                          >
                            {taka(m.min)}
                          </span>
                        </td>

                        {/* Avg */}
                        <td
                          className={`px-4 py-3.5 text-right tabular-nums ${cell}`}
                        >
                          <span className="inline-block text-base font-extrabold text-primary transition-transform duration-300 group-hover/row:scale-110">
                            {taka(m.avg)}
                          </span>
                        </td>

                        {/* Max */}
                        <td
                          className={`px-4 py-3.5 text-right tabular-nums ${cell}`}
                        >
                          <span
                            className={`inline-block rounded-lg px-2 py-1 font-semibold ${
                              m.max === stats.highest.max
                                ? "bg-rose-100 text-rose-700"
                                : "text-neutral/80"
                            }`}
                          >
                            {taka(m.max)}
                          </span>
                        </td>

                        {/* Range bar */}
                        <td
                          className={`hidden w-56 px-4 py-3.5 lg:table-cell ${cell}`}
                        >
                          <div className="relative h-2.5 rounded-full bg-slate-100 transition-all duration-300 group-hover/row:h-3 group-hover/row:bg-white group-hover/row:shadow-inner">
                            <span
                              className="absolute top-0 h-full rounded-full bg-linear-to-r from-primary/50 to-primary transition-all duration-900 ease-out motion-reduce:transition-none group-hover/row:shadow-[0_0_12px] group-hover/row:shadow-primary/40"
                              style={{
                                left: `${pos(m.min)}%`,
                                width: mounted
                                  ? `${Math.max(pos(m.max) - pos(m.min), 1.5)}%`
                                  : "0%",
                                transitionDelay: `${Math.min(i, 12) * 40}ms`,
                              }}
                            />

                            <span
                              className="absolute -inset-y-1 w-px bg-slate-400/80"
                              style={{ left: `${pos(avg)}%` }}
                            />

                            <span
                              className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow ring-2 ring-primary transition-opacity duration-700"
                              style={{
                                left: `${pos(m.avg)}%`,
                                opacity: mounted ? 1 : 0,
                              }}
                            />
                          </div>
                        </td>

                        {/* Compare */}
                        <td
                          className={`hidden px-4 py-3.5 text-right md:table-cell ${cell}`}
                        >
                          <span
                            className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${diffTone(d)}`}
                          >
                            {d === 0
                              ? "প্রায় সমান"
                              : `${d > 0 ? "▲" : "▼"} ${taka(Math.abs(d))}`}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {rows.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="border-t border-base-300/70 px-4 py-12 text-center text-sm text-slate-500"
                      >
                        <span aria-hidden className="mb-2 block text-3xl">
                          🔍
                        </span>
                        কোনো বাজার পাওয়া যায়নি।
                      </td>
                    </tr>
                  )}
                </tbody>

                {rows.length > 0 && (
                  <tfoot>
                    <tr className="bg-primary/5 text-sm font-bold">
                      <td
                        className="border-t border-primary/20 px-4 py-3 text-neutral sm:col-span-2"
                        colSpan={2}
                      >
                        সব বাজারের গড় ({bn(markets.length)}টি)
                      </td>

                      <td className="border-t border-primary/20 px-4 py-3 text-right tabular-nums text-emerald-700 max-sm:hidden">
                        {taka(stats.lowest.min)}
                      </td>

                      <td className="border-t border-primary/20 px-4 py-3 text-right tabular-nums text-primary">
                        {taka(avg)}
                      </td>

                      <td className="border-t border-primary/20 px-4 py-3 text-right tabular-nums text-rose-700 max-sm:hidden">
                        {taka(stats.highest.max)}
                      </td>

                      <td className="hidden border-t border-primary/20 lg:table-cell" />

                      <td className="hidden border-t border-primary/20 md:table-cell" />
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <p
        className={`flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 ${view === "cards" ? "flex" : "hidden lg:flex"}`}
      >
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-6 rounded-full bg-linear-to-r from-primary/50 to-primary" />
          সর্বনিম্ন – সর্বোচ্চ পরিসর
        </span>

        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-white ring-2 ring-primary" />
          বাজারের গড়
        </span>

        <span className="inline-flex items-center gap-1.5">
          <span className="h-3.5 w-px bg-slate-400" />
          সব বাজারের গড় ({taka(avg)})
        </span>
      </p>
    </div>
  );
}

// "use client";

// import { bn, shortUnit, taka } from "@/lib/formatters";
// import type { MarketPrice } from "@/lib/types";
// import { useEffect, useMemo, useState, type ReactNode } from "react";

// type SortKey = "name" | "division" | "min" | "avg" | "max";
// type SortDir = "asc" | "desc";

// export default function MarketExplorer({
//   markets,
//   avg,
//   unit,
//   risingIsBad = true,
//   division: controlledDivision,
//   onDivisionChange,
//   insights,
// }: {
//   markets: MarketPrice[];
//   avg: number; // overall average across markets
//   unit: string;
//   risingIsBad?: boolean;
//   /** Optional controlled division (use with onDivisionChange). */
//   division?: string;
//   onDivisionChange?: (division: string) => void;
//   /** Rendered between the summary and the table toolbar. */
//   insights?: ReactNode;
// }) {
//   const [innerDivision, setInnerDivision] = useState("all");
//   const division = controlledDivision ?? innerDivision;
//   const setDivision = (d: string) => {
//     setInnerDivision(d);
//     onDivisionChange?.(d);
//   };
//   const [query, setQuery] = useState("");
//   const [sortKey, setSortKey] = useState<SortKey>("avg");
//   const [sortDir, setSortDir] = useState<SortDir>("asc");
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     const id = requestAnimationFrame(() => setMounted(true));
//     return () => cancelAnimationFrame(id);
//   }, []);

//   const u = shortUnit(unit);

//   // Derived data
//   const divisions = useMemo(() => {
//     const map = new Map<string, number>();
//     for (const m of markets) {
//       const d = m.division || "অন্যান্য";

//       map.set(d, (map.get(d) ?? 0) + 1);
//     }

//     return [...map.entries()];
//   }, [markets]);

//   const stats = useMemo(() => {
//     if (markets.length === 0) return null;
//     const cheapest = markets.reduce((a, b) => (b.avg < a.avg ? b : a));

//     const priciest = markets.reduce((a, b) => (b.avg > a.avg ? b : a));

//     const lowest = markets.reduce((a, b) => (b.min < a.min ? b : a));

//     const highest = markets.reduce((a, b) => (b.max > a.max ? b : a));

//     return { cheapest, priciest, lowest, highest };
//   }, [markets]);

//   // Shared scale so range bars are comparable across ALL markets.
//   const scale = useMemo(() => {
//     if (markets.length === 0) return { lo: 0, hi: 1 };

//     let lo = Math.min(...markets.map((m) => m.min));

//     let hi = Math.max(...markets.map((m) => m.max));

//     const pad = Math.max(hi - lo, 1) * 0.06;
//     lo -= pad;
//     hi += pad;

//     return { lo, hi };
//   }, [markets]);

//   const pos = (v: number) =>
//     Math.min(100, Math.max(0, ((v - scale.lo) / (scale.hi - scale.lo)) * 100));

//   const rows = useMemo(() => {
//     const q = query.trim().toLowerCase();

//     const filtered = markets.filter(
//       (m) =>
//         (division === "all" || (m.division || "অন্যান্য") === division) &&
//         (!q || m.name.toLowerCase().includes(q)),
//     );

//     const cmp = (a: MarketPrice, b: MarketPrice) => {
//       if (sortKey === "name") return a.name.localeCompare(b.name, "bn");

//       if (sortKey === "division")
//         return (a.division || "").localeCompare(b.division || "", "bn");
//       return a[sortKey] - b[sortKey];
//     };

//     return [...filtered].sort((a, b) =>
//       sortDir === "asc" ? cmp(a, b) : -cmp(a, b),
//     );
//   }, [markets, division, query, sortKey, sortDir]);

//   if (!stats) {
//     return (
//       <div className="rounded-3xl border border-base-300 bg-white p-8 text-center text-sm text-slate-500">
//         বাজারভিত্তিক দাম এখনো পাওয়া যায়নি।
//       </div>
//     );
//   }

//   const saving = Math.round(stats.priciest.avg - stats.cheapest.avg);

//   const hasSpread = stats.cheapest !== stats.priciest;

//   const diffTone = (d: number) =>
//     d === 0
//       ? "bg-slate-100 text-slate-600"
//       : d > 0 === risingIsBad
//         ? "bg-rose-100 text-rose-700"
//         : "bg-emerald-100 text-emerald-700";

//   const toggleSort = (key: SortKey) => {
//     if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
//     else {
//       setSortKey(key);
//       setSortDir("asc");
//     }
//   };

//   const renderTh = (
//     key: SortKey,
//     label: string,
//     opts: { align?: "left" | "right"; className?: string } = {},
//   ) => {
//     const active = sortKey === key;
//     const right = opts.align === "right";

//     return (
//       <th
//         scope="col"
//         aria-sort={
//           active ? (sortDir === "asc" ? "ascending" : "descending") : "none"
//         }
//         className={`px-4 py-3 ${right ? "text-right" : "text-left"} ${opts.className ?? ""}`}
//       >
//         <button
//           type="button"
//           onClick={() => toggleSort(key)}
//           className={`group/th inline-flex items-center gap-1.5 rounded-md text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
//             right ? "flex-row-reverse" : ""
//           } ${active ? "text-primary" : "text-slate-500 hover:text-primary"}`}
//         >
//           {label}
//           <span
//             aria-hidden
//             className={`text-[10px] leading-none transition-opacity ${
//               active ? "opacity-100" : "opacity-30 group-hover/th:opacity-70"
//             }`}
//           >
//             {active ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
//           </span>
//         </button>
//       </th>
//     );
//   };

//   return (
//     <div className="space-y-5">
//       {/* Summary cards */}
//       <div className="grid gap-3 sm:grid-cols-3">
//         {[
//           {
//             label: "সর্বনিম্ন দাম",
//             value: stats.lowest.min,
//             note: stats.lowest.name,
//             icon: "📉",
//             style: "from-emerald-50 to-white border-emerald-200",
//             text: "text-emerald-700",
//           },

//           {
//             label: "সব বাজারের গড়",
//             value: avg,
//             note: `${bn(markets.length)}টি বাজার`,
//             icon: "⚖️",
//             style: "from-primary/10 to-white border-primary/25",
//             text: "text-primary",
//           },

//           {
//             label: "সর্বোচ্চ দাম",
//             value: stats.highest.max,
//             note: stats.highest.name,
//             icon: "📈",
//             style: "from-rose-50 to-white border-rose-200",
//             text: "text-rose-700",
//           },
//         ].map((c, i) => (
//           <div
//             key={c.label}
//             className={`rounded-2xl border bg-linear-to-br p-4 shadow-sm transition-all duration-700 motion-reduce:transition-none ${c.style}`}
//             style={{
//               opacity: mounted ? 1 : 0,
//               transform: mounted ? "none" : "translateY(12px)",
//               transitionDelay: `${i * 90}ms`,
//             }}
//           >
//             <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
//               <span aria-hidden>{c.icon}</span>
//               {c.label}
//             </p>

//             <p className={`mt-1 text-3xl font-extrabold ${c.text}`}>
//               {taka(c.value)}
//               <span className="ml-1 text-sm font-semibold text-slate-400">
//                 /{u}
//               </span>
//             </p>

//             <p className="truncate text-xs text-slate-500">{c.note}</p>
//           </div>
//         ))}
//       </div>

//       {/* Savings insight */}
//       {saving > 0 && (
//         <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-neutral">
//           <span aria-hidden className="text-xl">
//             💡
//           </span>

//           <p>
//             <strong className="text-primary">{stats.cheapest.name}</strong> এ
//             কিনলে <strong>{stats.priciest.name}</strong> এর তুলনায় প্রতি {u}তে
//             গড়ে <strong className="text-primary">{taka(saving)}</strong>{" "}
//             পর্যন্ত সাশ্রয় হতে পারে।
//           </p>
//         </div>
//       )}

//       {/* Controls */}
//       <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
//         <div
//           role="group"
//           aria-label="বিভাগ"
//           className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
//         >
//           {[["all", markets.length] as const, ...divisions].map(
//             ([d, count]) => {
//               const active = division === d;
//               return (
//                 <button
//                   key={d}
//                   type="button"
//                   aria-pressed={active}
//                   onClick={() => {
//                     setDivision(d);
//                     setOpen(null);
//                   }}
//                   className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
//                     active
//                       ? "border-primary bg-primary text-primary-content shadow-sm shadow-primary/30"
//                       : "border-base-300 bg-white text-neutral/70 hover:border-primary/40 hover:text-primary"
//                   }`}
//                 >
//                   {d === "all" ? "সব বিভাগ" : d}
//                   <span
//                     className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
//                       active ? "bg-white/20" : "bg-slate-100 text-slate-500"
//                     }`}
//                   >
//                     {bn(count)}
//                   </span>
//                 </button>
//               );
//             },
//           )}
//         </div>

//         <div className="flex shrink-0 items-center gap-2">
//           <span className="text-sm font-semibold text-slate-500">সাজান:</span>
//           <div className="flex gap-1 rounded-full border border-base-300 bg-white p-1 shadow-sm">
//             {(
//               [
//                 ["low", "সস্তা আগে"],
//                 ["high", "দামি আগে"],
//               ] as const
//             ).map(([k, label]) => (
//               <button
//                 key={k}
//                 type="button"
//                 aria-pressed={sort === k}
//                 onClick={() => setSort(k)}
//                 className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
//                   sort === k
//                     ? "bg-primary text-primary-content"
//                     : "text-neutral/70 hover:bg-primary/10 hover:text-primary"
//                 }`}
//               >
//                 {label}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Legend */}
//       <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
//         <span className="inline-flex items-center gap-1.5">
//           <span className="h-2 w-6 rounded-full bg-linear-to-r from-primary/50 to-primary" />
//           সর্বনিম্ন – সর্বোচ্চ পরিসর
//         </span>
//         <span className="inline-flex items-center gap-1.5">
//           <span className="size-3 rounded-full bg-white ring-2 ring-primary" />
//           বাজারের গড়
//         </span>
//         <span className="inline-flex items-center gap-1.5">
//           <span className="h-3.5 w-px bg-slate-400" />
//           সব বাজারের গড় ({taka(avg)})
//         </span>
//       </p>

//       {/* Market list */}
//       <ul className="space-y-2.5">
//         {list.map((m, i) => {
//           const isOpen = open === m.name;
//           const d = Math.round(m.avg - avg);
//           const isCheapest =
//             m.name === stats.cheapest.name && stats.cheapest !== stats.priciest;
//           const isPriciest =
//             m.name === stats.priciest.name && stats.cheapest !== stats.priciest;

//           return (
//             <li
//               key={`${m.division}-${m.name}`}
//               className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 motion-reduce:transition-none ${
//                 isOpen
//                   ? "border-primary/40 shadow-lg shadow-primary/10"
//                   : "border-base-300 hover:border-primary/30 hover:shadow-md"
//               }`}
//               style={{
//                 opacity: mounted ? 1 : 0,
//                 transform: mounted ? "none" : "translateY(10px)",
//                 transitionDelay: mounted ? "0ms" : `${i * 40}ms`,
//               }}
//             >
//               <button
//                 type="button"
//                 aria-expanded={isOpen}
//                 onClick={() => setOpen(isOpen ? null : m.name)}
//                 className="group block w-full p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40"
//               >
//                 <div className="flex items-start justify-between gap-3">
//                   <div className="min-w-0">
//                     <div className="flex flex-wrap items-center gap-2">
//                       <p className="truncate font-bold text-neutral">
//                         {m.name}
//                       </p>
//                       {isCheapest && (
//                         <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
//                           🏆 সবচেয়ে সস্তা
//                         </span>
//                       )}
//                       {isPriciest && (
//                         <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700">
//                           🔺 সবচেয়ে বেশি
//                         </span>
//                       )}
//                     </div>
//                     <p className="mt-0.5 text-xs text-slate-500">
//                       📍 {m.division || "অন্যান্য"}
//                     </p>
//                   </div>

//                   <div className="flex shrink-0 items-center gap-3">
//                     <div className="text-right">
//                       <p className="text-lg font-extrabold leading-none text-primary">
//                         {taka(m.avg)}
//                       </p>
//                       <p className="mt-1 text-xs text-slate-500">
//                         {taka(m.min)} – {taka(m.max)}
//                       </p>
//                     </div>
//                     <svg
//                       width="18"
//                       height="18"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2.5"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       aria-hidden
//                       className={`text-slate-400 transition-transform duration-300 group-hover:text-primary ${
//                         isOpen ? "rotate-180" : ""
//                       }`}
//                     >
//                       <path d="m6 9 6 6 6-6" />
//                     </svg>
//                   </div>
//                 </div>

//                 {/* Range bar */}
//                 <div className="relative mt-4 h-2.5 rounded-full bg-slate-100">
//                   <span
//                     className="absolute top-0 h-full rounded-full bg-linear-to-r from-primary/50 to-primary transition-all duration-900 ease-out motion-reduce:transition-none"
//                     style={{
//                       left: `${pos(m.min)}%`,
//                       width: mounted
//                         ? `${Math.max(pos(m.max) - pos(m.min), 1.5)}%`
//                         : "0%",
//                       transitionDelay: `${i * 40}ms`,
//                     }}
//                   />
//                   {/* overall average marker */}
//                   <span
//                     className="absolute -inset-y-1 w-px bg-slate-400/80"
//                     style={{ left: `${pos(avg)}%` }}
//                   />
//                   {/* this market's average */}
//                   <span
//                     className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow ring-2 ring-primary transition-all duration-900 ease-out motion-reduce:transition-none"
//                     style={{
//                       left: `${pos(m.avg)}%`,
//                       opacity: mounted ? 1 : 0,
//                       transitionDelay: `${i * 40 + 200}ms`,
//                     }}
//                   />
//                 </div>
//               </button>

//               {/* Expandable details */}
//               <div
//                 className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
//                   isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
//                 }`}
//               >
//                 <div className="overflow-hidden">
//                   <div className="space-y-3 border-t border-dashed border-base-300 p-4">
//                     <div className="grid grid-cols-3 gap-2 text-center">
//                       {[
//                         ["সর্বনিম্ন", m.min, "text-emerald-700 bg-emerald-50"],
//                         ["গড়", m.avg, "text-primary bg-primary/10"],
//                         ["সর্বোচ্চ", m.max, "text-rose-700 bg-rose-50"],
//                       ].map(([label, value, cls]) => (
//                         <div
//                           key={label as string}
//                           className={`rounded-xl p-3 ${cls}`}
//                         >
//                           <p className="text-xs font-semibold opacity-80">
//                             {label}
//                           </p>
//                           <p className="text-xl font-extrabold">
//                             {taka(value as number)}
//                           </p>
//                         </div>
//                       ))}
//                     </div>

//                     <p className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
//                       সব বাজারের গড়ের তুলনায়
//                       <span
//                         className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${diffTone(d)}`}
//                       >
//                         {d === 0
//                           ? "প্রায় সমান"
//                           : `${taka(Math.abs(d))} ${d > 0 ? "বেশি" : "কম"}`}
//                       </span>
//                       প্রতি {u}তে
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </li>
//           );
//         })}
//       </ul>

//       {list.length === 0 && (
//         <p className="rounded-2xl border border-dashed border-base-300 p-8 text-center text-sm text-slate-500">
//           এই বিভাগে কোনো বাজার নেই।
//         </p>
//       )}

//       <h3 className="pt-2 text-lg font-extrabold text-neutral">
//         📋 সব বাজারের তালিকা
//       </h3>

//       {/* Toolbar: division chips & search */}
//       <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
//         <div
//           role="group"
//           aria-label="বিভাগ"
//           className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
//         >
//           {[["all", markets.length] as const, ...divisions].map(
//             ([d, count]) => {
//               const active = division === d;
//               return (
//                 <button
//                   key={d}
//                   type="button"
//                   aria-pressed={active}
//                   onClick={() => setDivision(d)}
//                   className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
//                     active
//                       ? "border-primary bg-primary text-primary-content shadow-sm shadow-primary/30"
//                       : "border-base-300 bg-white text-neutral/70 hover:border-primary/40 hover:text-primary"
//                   }`}
//                 >
//                   {d === "all" ? "সব বিভাগ" : d}
//                   <span
//                     className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
//                       active ? "bg-white/20" : "bg-slate-100 text-slate-500"
//                     }`}
//                   >
//                     {bn(count)}
//                   </span>
//                 </button>
//               );
//             },
//           )}
//         </div>

//         <label className="relative block lg:w-72">
//           <span className="sr-only">বাজার খুঁজুন</span>
//           <svg
//             width="16"
//             height="16"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2.5"
//             strokeLinecap="round"
//             aria-hidden
//             className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
//           >
//             <circle cx="11" cy="11" r="7" />
//             <path d="m21 21-4.3-4.3" />
//           </svg>

//           <input
//             type="search"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="বাজারের নাম খুঁজুন…"
//             className="h-10 w-full rounded-full border border-base-300 bg-white pl-10 pr-4 text-sm shadow-sm outline-none transition placeholder:text-slate-400 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
//           />
//         </label>
//       </div>

//       {/* Table */}
//       <div className="overflow-hidden rounded-3xl border border-base-300 bg-white shadow-sm">
//         <div className="overflow-x-auto">
//           <table className="w-full border-separate border-spacing-0 text-sm">
//             <caption className="sr-only">বাজারভিত্তিক দাম (টাকা / {u})</caption>

//             <thead className="bg-slate-50/80 backdrop-blur">
//               <tr>
//                 {renderTh("name", "বাজার")}
//                 {renderTh("division", "বিভাগ", {
//                   className: "hidden sm:table-cell",
//                 })}
//                 {renderTh("min", "সর্বনিম্ন", { align: "right" })}
//                 {renderTh("avg", "গড়", { align: "right" })}
//                 {renderTh("max", "সর্বোচ্চ", { align: "right" })}
//                 <th
//                   scope="col"
//                   className="hidden px-4 py-3 text-left text-xs font-bold text-slate-500 lg:table-cell"
//                 >
//                   দামের পরিসর
//                 </th>
//                 <th
//                   scope="col"
//                   className="hidden px-4 py-3 text-right text-xs font-bold text-slate-500 md:table-cell"
//                 >
//                   গড়ের তুলনায়
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {rows.map((m, i) => {
//                 const d = Math.round(m.avg - avg);
//                 const isCheapest = hasSpread && m.name === stats.cheapest.name;
//                 const isPriciest = hasSpread && m.name === stats.priciest.name;
//                 const initial = Array.from(m.name)[0] ?? "ব";

//                 const cell =
//                   "border-t border-base-300/70 transition-colors duration-200 group-hover/row:bg-primary/[0.06]";

//                 return (
//                   <tr
//                     key={`${m.division}-${m.name}`}
//                     className="group/row transition-all duration-500 motion-reduce:transition-none"
//                     style={{
//                       opacity: mounted ? 1 : 0,
//                       transform: mounted ? "none" : "translateY(8px)",
//                       transitionDelay: mounted
//                         ? "0ms"
//                         : `${Math.min(i, 12) * 35}ms`,
//                     }}
//                   >
//                     {/* Market */}
//                     <td className={`relative px-4 py-3.5 ${cell}`}>
//                       {/* hover accent */}
//                       <span
//                         aria-hidden
//                         className="absolute inset-y-2 left-0 w-1 origin-center scale-y-0 rounded-r-full bg-primary transition-transform duration-300 group-hover/row:scale-y-100"
//                       />
//                       <div className="flex items-center gap-3">
//                         <span
//                           aria-hidden
//                           className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-sm font-extrabold text-primary transition-all duration-300 group-hover/row:scale-110 group-hover/row:bg-primary group-hover/row:text-primary-content"
//                         >
//                           {initial}
//                         </span>
//                         <div className="min-w-0">
//                           <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-bold text-neutral">
//                             {m.name}
//                             {isCheapest && (
//                               <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
//                                 🏆 সস্তা
//                               </span>
//                             )}
//                             {isPriciest && (
//                               <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-700">
//                                 🔺 দামি
//                               </span>
//                             )}
//                           </p>
//                           <p className="text-xs text-slate-500 sm:hidden">
//                             {m.division || "অন্যান্য"}
//                           </p>

//                           {/* Mobile mini range bar */}
//                           <div className="relative mt-2 h-1.5 w-28 rounded-full bg-slate-100 lg:hidden">
//                             <span
//                               className="absolute top-0 h-full rounded-full bg-linear-to-r from-primary/50 to-primary"
//                               style={{
//                                 left: `${pos(m.min)}%`,
//                                 width: `${Math.max(pos(m.max) - pos(m.min), 3)}%`,
//                               }}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Division */}
//                     <td className={`hidden px-4 py-3.5 sm:table-cell ${cell}`}>
//                       <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 transition-colors group-hover/row:bg-white">
//                         📍 {m.division || "অন্যান্য"}
//                       </span>
//                     </td>

//                     {/* Min */}
//                     <td
//                       className={`px-4 py-3.5 text-right tabular-nums ${cell}`}
//                     >
//                       <span
//                         className={`inline-block rounded-lg px-2 py-1 font-semibold ${
//                           m.min === stats.lowest.min
//                             ? "bg-emerald-100 text-emerald-700"
//                             : "text-neutral/80"
//                         }`}
//                       >
//                         {taka(m.min)}
//                       </span>
//                     </td>

//                     {/* Avg */}
//                     <td
//                       className={`px-4 py-3.5 text-right tabular-nums ${cell}`}
//                     >
//                       <span className="inline-block text-base font-extrabold text-primary transition-transform duration-300 group-hover/row:scale-110">
//                         {taka(m.avg)}
//                       </span>
//                     </td>

//                     {/* Max */}
//                     <td
//                       className={`px-4 py-3.5 text-right tabular-nums ${cell}`}
//                     >
//                       <span
//                         className={`inline-block rounded-lg px-2 py-1 font-semibold ${
//                           m.max === stats.highest.max
//                             ? "bg-rose-100 text-rose-700"
//                             : "text-neutral/80"
//                         }`}
//                       >
//                         {taka(m.max)}
//                       </span>
//                     </td>

//                     {/* Range bar */}
//                     <td
//                       className={`hidden w-56 px-4 py-3.5 lg:table-cell ${cell}`}
//                     >
//                       <div className="relative h-2.5 rounded-full bg-slate-100 transition-all duration-300 group-hover/row:h-3 group-hover/row:bg-white group-hover/row:shadow-inner">
//                         <span
//                           className="absolute top-0 h-full rounded-full bg-linear-to-r from-primary/50 to-primary transition-all duration-900 ease-out motion-reduce:transition-none group-hover/row:shadow-[0_0_12px] group-hover/row:shadow-primary/40"
//                           style={{
//                             left: `${pos(m.min)}%`,
//                             width: mounted
//                               ? `${Math.max(pos(m.max) - pos(m.min), 1.5)}%`
//                               : "0%",
//                             transitionDelay: `${Math.min(i, 12) * 40}ms`,
//                           }}
//                         />
//                         <span
//                           className="absolute -inset-y-1 w-px bg-slate-400/80"
//                           style={{ left: `${pos(avg)}%` }}
//                         />
//                         <span
//                           className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow ring-2 ring-primary transition-opacity duration-700"
//                           style={{
//                             left: `${pos(m.avg)}%`,
//                             opacity: mounted ? 1 : 0,
//                           }}
//                         />
//                       </div>
//                     </td>

//                     {/* Compare */}
//                     <td
//                       className={`hidden px-4 py-3.5 text-right md:table-cell ${cell}`}
//                     >
//                       <span
//                         className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${diffTone(d)}`}
//                       >
//                         {d === 0
//                           ? "প্রায় সমান"
//                           : `${d > 0 ? "▲" : "▼"} ${taka(Math.abs(d))}`}
//                       </span>
//                     </td>
//                   </tr>
//                 );
//               })}

//               {rows.length === 0 && (
//                 <tr>
//                   <td
//                     colSpan={7}
//                     className="border-t border-base-300/70 px-4 py-12 text-center text-sm text-slate-500"
//                   >
//                     <span aria-hidden className="mb-2 block text-3xl">
//                       🔍
//                     </span>
//                     কোনো বাজার পাওয়া যায়নি।
//                   </td>
//                 </tr>
//               )}
//             </tbody>

//             {rows.length > 0 && (
//               <tfoot>
//                 <tr className="bg-primary/5 text-sm font-bold">
//                   <td
//                     className="border-t border-primary/20 px-4 py-3 text-neutral sm:col-span-2"
//                     colSpan={2}
//                   >
//                     সব বাজারের গড় ({bn(markets.length)}টি)
//                   </td>
//                   <td className="border-t border-primary/20 px-4 py-3 text-right tabular-nums text-emerald-700 max-sm:hidden">
//                     {taka(stats.lowest.min)}
//                   </td>
//                   <td className="border-t border-primary/20 px-4 py-3 text-right tabular-nums text-primary">
//                     {taka(avg)}
//                   </td>
//                   <td className="border-t border-primary/20 px-4 py-3 text-right tabular-nums text-rose-700 max-sm:hidden">
//                     {taka(stats.highest.max)}
//                   </td>
//                   <td className="hidden border-t border-primary/20 lg:table-cell" />
//                   <td className="hidden border-t border-primary/20 md:table-cell" />
//                 </tr>
//               </tfoot>
//             )}
//           </table>
//         </div>
//       </div>

//       {/* Legend */}
//       <p className="hidden flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 lg:flex">
//         <span className="inline-flex items-center gap-1.5">
//           <span className="h-2 w-6 rounded-full bg-linear-to-r from-primary/50 to-primary" />
//           সর্বনিম্ন – সর্বোচ্চ পরিসর
//         </span>

//         <span className="inline-flex items-center gap-1.5">
//           <span className="size-3 rounded-full bg-white ring-2 ring-primary" />
//           বাজারের গড়
//         </span>

//         <span className="inline-flex items-center gap-1.5">
//           <span className="h-3.5 w-px bg-slate-400" />
//           সব বাজারের গড় ({taka(avg)})
//         </span>
//       </p>

//       {insights}
//     </div>
//   );
// }
