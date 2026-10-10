"use client";

import type { MarketPrice } from "@/lib/types";
import { useMemo, useState } from "react";
import BudgetCalculator from "./BudgetCalculator";
import DivisionHeatTiles from "./DivisionHeatTiles";
import MarketExplorer from "./MarketExplorer";

/**
 * Holds the shared "selected division" state so the heat tiles,
 * budget calculator and the table stay in sync.
 */
export default function MarketSection({
  markets,
  avg,
  unit,
  risingIsBad = true,
}: {
  markets: MarketPrice[];
  avg: number;
  unit: string;
  risingIsBad?: boolean;
}) {
  const [division, setDivision] = useState("all");

  const filtered = useMemo(
    () =>
      division === "all"
        ? markets
        : markets.filter((m) => (m.division || "অন্যান্য") === division),
    [markets, division],
  );

  return (
    <MarketExplorer
      markets={markets}
      avg={avg}
      unit={unit}
      risingIsBad={risingIsBad}
      division={division}
      onDivisionChange={setDivision}
      insights={
        <div className="space-y-6">
          <DivisionHeatTiles
            markets={markets}
            avg={avg}
            unit={unit}
            selected={division}
            onSelect={setDivision}
          />

          <BudgetCalculator
            markets={filtered}
            unit={unit}
            divisionLabel={division === "all" ? undefined : division}
          />

          <h3 className="pt-2 text-lg font-extrabold text-neutral">
            📋 সব বাজারের তালিকা
          </h3>
        </div>
      }
    />
  );
}
