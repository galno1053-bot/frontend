"use client";

import { useAppStore } from "../lib/store";

export function Leaderboard() {
  const rows = useAppStore((s) => s.leaderboard);

  return (
    <div className="glass h-full rounded-2xl p-4">
      <div className="text-xs uppercase tracking-[0.3em] text-bone/60">Top gainers</div>
      <div className="mt-3 space-y-2">
        {rows.map((row, i) => (
          <div key={row.userId} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-bone/50">#{i + 1}</span>
              <span>{row.username}</span>
            </div>
            <span className={Number(row.profit) >= 0 ? "text-acid" : "text-ember"}>
              {Number(row.profit).toFixed(3)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
