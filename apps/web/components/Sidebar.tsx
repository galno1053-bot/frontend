"use client";

import { useAppStore } from "../lib/store";

export function Sidebar() {
  const presence = useAppStore((s) => s.presence);

  return (
    <div className="glass flex h-full flex-col rounded-2xl p-4">
      <div className="text-xs uppercase tracking-[0.3em] text-bone/60">Online</div>
      <div className="mt-2 text-2xl font-semibold text-acid">{presence?.onlineCount ?? 0}</div>
      <div className="mt-3 flex-1 space-y-2 overflow-y-auto pr-2 text-xs scrollbar-hidden">
        {presence?.users.map((u) => (
          <div key={u.userId} className="flex items-center justify-between">
            <span>{u.username}</span>
            <span className="text-bone/40">?</span>
          </div>
        ))}
      </div>
      <button className="mt-4 rounded-xl border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.3em]">
        Rules
      </button>
    </div>
  );
}
