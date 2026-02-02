"use client";

import { useAppStore } from "../lib/store";

const badgeColors = ["bg-emerald-500", "bg-amber-400", "bg-rose-500", "bg-sky-500", "bg-purple-500"];

export function Leaderboard() {
  const rows = useAppStore((s) => s.leaderboard);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-black/40">
      <div className="border-b border-white/10 px-4 py-3">
        <div className="text-xs uppercase tracking-[0.3em] text-bone/60">Top gainers</div>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3 text-xs scrollbar-hidden">
        {rows.map((row, i) => (
          <div key={row.userId} className="flex items-center justify-between rounded-xl border border-white/5 bg-black/30 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className={`h-6 w-6 rounded-full ${badgeColors[i % badgeColors.length]} opacity-80`} />
              <div>
                <div className="text-bone">{row.username}</div>
                <div className="text-[10px] text-bone/50">#{i + 1}</div>
              </div>
            </div>
            <div className={`text-xs font-semibold ${Number(row.profit) >= 0 ? "text-emerald-400" : "text-ember"}`}>
              {Number(row.profit).toFixed(3)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
