"use client";

import { useAppStore } from "../lib/store";

export function LastMultipliers() {
  const last100 = useAppStore((s) => s.last100);
  return (
    <div className="flex flex-wrap gap-2">
      {last100.map((m, idx) => (
        <span
          key={`${m}-${idx}`}
          className={`rounded-full px-2 py-1 text-[10px] font-semibold ${m > 2 ? "bg-acid/80 text-ink" : "bg-ember/80 text-ink"}`}
        >
          {m.toFixed(2)}x
        </span>
      ))}
    </div>
  );
}
