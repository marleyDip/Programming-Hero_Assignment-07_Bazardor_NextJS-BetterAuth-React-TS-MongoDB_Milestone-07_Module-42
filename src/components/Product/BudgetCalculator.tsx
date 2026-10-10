"use client";

import { bn, shortUnit, taka } from "@/lib/formatters";
import type { MarketPrice } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

type Basis = "avg" | "min" | "max";

const BASIS: { key: Basis; label: string }[] = [
  { key: "avg", label: "গড় দাম" },
  { key: "min", label: "সর্বনিম্ন" },
  { key: "max", label: "সর্বোচ্চ" },
];

const QUICK = [0.5, 1, 2, 5, 10];

/** "১২.৫" / "12.5" / "12,5" → 12.5 (invalid → 0) */
function parseAmount(text: string): number {
  const en = text
    .replace(/[০-৯]/g, (d) => String("০১২৩৪৫৬৭৮৯".indexOf(d)))
    .replace(/,/g, ".")
    .replace(/[^\d.]/g, "");

  const n = parseFloat(en);

  return Number.isFinite(n) && n > 0 ? Math.min(n, 100000) : 0;
}

export default function BudgetCalculator({
  markets,
  unit,
  divisionLabel,
}: {
  markets: MarketPrice[];
  unit: string;
  divisionLabel?: string; // shown when a division is selected
}) {
  const [qtyText, setQtyText] = useState("1");
  const [budgetText, setBudgetText] = useState("");
  const [basis, setBasis] = useState<Basis>("avg");
  const [showAll, setShowAll] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const u = shortUnit(unit);
  const qty = parseAmount(qtyText);
  const budget = parseAmount(budgetText);

  const results = useMemo(
    () =>
      markets
        .map((m) => ({ m, total: Math.round(m[basis] * qty) }))
        .sort((a, b) => a.total - b.total),
    [markets, basis, qty],
  );

  const best = results[0];

  const worst = results[results.length - 1];

  const avgTotal = results.length
    ? results.reduce((s, r) => s + r.total, 0) / results.length
    : 0;

  const maxTotal = worst?.total || 1;

  const savedVsWorst = best && worst ? worst.total - best.total : 0;

  const savedVsAvg = best ? Math.round(avgTotal - best.total) : 0;

  const inBudget =
    budget > 0 ? results.filter((r) => r.total <= budget).length : 0;

  const visible = showAll ? results : results.slice(0, 5);

  const step = (delta: number) => {
    const next = Math.max(0.5, (qty || 0) + delta);
    setQtyText(String(Number(next.toFixed(2))));
  };

  const inputCls =
    "h-12 w-full rounded-2xl border border-base-300 bg-white px-4 text-lg font-bold text-neutral shadow-sm outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-primary/50 focus:ring-4 focus:ring-primary/10";

  return (
    <section
      aria-label="বাজেট ক্যালকুলেটর"
      className="overflow-hidden rounded-3xl border border-base-300 bg-white shadow-sm"
    >
      {/* Header */}
      <div className="border-b border-base-300/70 bg-linear-to-r from-primary/10 via-white to-white px-5 py-4 sm:px-6">
        <h3 className="text-lg font-extrabold text-neutral">
          🧮 আমি কতটুকু কিনব?
        </h3>

        <p className="text-sm text-slate-500">
          পরিমাণ লিখুন, দেখুন কোন বাজারে মোট কত লাগবে
          {divisionLabel && (
            <>
              {" "}
              · <strong className="text-primary">{divisionLabel}</strong> বিভাগ
            </>
          )}
        </p>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-[minmax(0,320px)_1fr]">
        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="bc-qty"
              className="mb-1.5 block text-sm font-semibold text-slate-600"
            >
              পরিমাণ ({u})
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="কমান"
                onClick={() => step(-0.5)}
                className="grid size-12 shrink-0 place-items-center rounded-2xl border border-base-300 bg-white text-xl font-bold text-neutral/70 transition hover:border-primary/40 hover:text-primary active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                -
              </button>

              <input
                id="bc-qty"
                inputMode="decimal"
                value={qtyText}
                onChange={(e) => setQtyText(e.target.value)}
                className={`${inputCls} text-center`}
              />

              <button
                type="button"
                aria-label="বাড়ান"
                onClick={() => step(0.5)}
                className="grid size-12 shrink-0 place-items-center rounded-2xl border border-base-300 bg-white text-xl font-bold text-neutral/70 transition hover:border-primary/40 hover:text-primary active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                +
              </button>
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {QUICK.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQtyText(String(q))}
                  aria-pressed={qty === q}
                  className={`rounded-full border px-3 py-1 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                    qty === q
                      ? "border-primary bg-primary text-primary-content"
                      : "border-base-300 bg-white text-neutral/70 hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {bn(q)} {u}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="bc-budget"
              className="mb-1.5 block text-sm font-semibold text-slate-600"
            >
              আমার বাজেট (ঐচ্ছিক)
            </label>

            <div className="relative">
              <span
                aria-hidden
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400"
              >
                ৳
              </span>

              <input
                id="bc-budget"
                inputMode="decimal"
                value={budgetText}
                onChange={(e) => setBudgetText(e.target.value)}
                placeholder="যেমন: ৫০০"
                className={`${inputCls} pl-9`}
              />
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-sm font-semibold text-slate-600">
              কোন দাম ধরে হিসাব?
            </p>

            <div
              role="group"
              className="flex gap-1 rounded-full border border-base-300 bg-slate-50 p-1"
            >
              {BASIS.map((b) => (
                <button
                  key={b.key}
                  type="button"
                  aria-pressed={basis === b.key}
                  onClick={() => setBasis(b.key)}
                  className={`flex-1 rounded-full px-2 py-1.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                    basis === b.key
                      ? "bg-primary text-primary-content shadow-sm shadow-primary/30"
                      : "text-neutral/70 hover:text-primary"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="min-w-0 space-y-4" aria-live="polite">
          {qty === 0 || !best ? (
            <div className="grid min-h-48 place-items-center rounded-2xl border border-dashed border-base-300 p-8 text-center text-sm text-slate-500">
              <p>
                <span aria-hidden className="mb-2 block text-3xl">
                  ⚖️
                </span>
                হিসাব দেখতে একটি পরিমাণ লিখুন।
              </p>
            </div>
          ) : (
            <>
              {/* Best card */}
              <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary to-secondary p-5 text-primary-content shadow-lg shadow-primary/25">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-white/15 blur-2xl"
                />

                <p className="relative text-sm font-semibold opacity-90">
                  🏆 সবচেয়ে সস্তা: {best.m.name}
                </p>

                <p className="relative mt-1 text-4xl font-extrabold tabular-nums sm:text-5xl">
                  {taka(best.total)}
                </p>

                <p className="relative text-sm opacity-90">
                  {bn(qty)} {u} এর জন্য মোট
                </p>

                {results.length > 1 && (
                  <div className="relative mt-3 flex flex-wrap gap-2 text-xs font-bold">
                    {savedVsWorst > 0 && (
                      <span className="rounded-full bg-white/20 px-3 py-1">
                        সবচেয়ে দামি বাজারের চেয়ে {taka(savedVsWorst)} সাশ্রয়
                      </span>
                    )}
                    {savedVsAvg > 0 && (
                      <span className="rounded-full bg-white/20 px-3 py-1">
                        গড়ের চেয়ে {taka(savedVsAvg)} কম
                      </span>
                    )}
                  </div>
                )}
              </div>

              {budget > 0 && (
                <p
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${
                    inBudget > 0
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {inBudget > 0
                    ? `✅ ${taka(budget)} বাজেটে ${bn(inBudget)}টি বাজারে কেনা যাবে`
                    : `⚠️ কোনো বাজারেই ${taka(budget)} বাজেটে ${bn(qty)} ${u} হবে না — সবচেয়ে কম ${taka(best.total)}`}
                </p>
              )}

              {/* Ranked list */}
              <ol className="space-y-2">
                {visible.map(({ m, total }, i) => {
                  const over = budget > 0 && total > budget;
                  const ok = budget > 0 && total <= budget;

                  return (
                    <li
                      key={`${m.division}-${m.name}`}
                      className={`group/r rounded-2xl border border-base-300 bg-white p-3 transition-all duration-200 hover:border-primary/40 hover:bg-primary/4 hover:shadow-md ${
                        over ? "opacity-60 hover:opacity-100" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden
                          className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-extrabold ${
                            i === 0
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {bn(i + 1)}
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-bold text-neutral">
                            {m.name}
                            {ok && (
                              <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                                ✅ বাজেটে
                              </span>
                            )}
                          </p>

                          <p className="text-xs text-slate-500">
                            {m.division || "অন্যান্য"} · {taka(m[basis])}/{u}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-extrabold tabular-nums text-primary">
                            {taka(total)}
                          </p>

                          <p className="text-xs font-semibold text-slate-500">
                            {over
                              ? `বাজেটের চেয়ে ${taka(total - budget)} বেশি`
                              : i === 0
                                ? "সবচেয়ে কম"
                                : `+${taka(total - best.total)}`}
                          </p>
                        </div>
                      </div>

                      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-linear-to-r from-primary/60 to-primary transition-[width] duration-700 ease-out motion-reduce:transition-none"
                          style={{
                            width: mounted
                              ? `${Math.max((total / maxTotal) * 100, 4)}%`
                              : "0%",
                            transitionDelay: `${i * 50}ms`,
                          }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ol>

              {results.length > 5 && (
                <button
                  type="button"
                  onClick={() => setShowAll((s) => !s)}
                  className="w-full rounded-xl border border-base-300 py-2.5 text-sm font-bold text-primary transition hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  {showAll
                    ? "কম দেখান ▲"
                    : `আরও ${bn(results.length - 5)}টি বাজার দেখুন ▼`}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
