"use client";

import { useState } from "react";
import { getSocket } from "../lib/socketClient";
import { useAppStore } from "../lib/store";

export function BetBar() {
  const [amount, setAmount] = useState(0.01);
  const round = useAppStore((s) => s.round);
  const balance = useAppStore((s) => s.balance);

  const placeBet = () => {
    getSocket()?.emit("bet:place", { amount }, () => null);
  };

  const cashout = () => {
    getSocket()?.emit("bet:cashout", {}, () => null);
  };

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-28 rounded-lg bg-black/50 px-3 py-2 text-sm"
          />
          {[0.001, 0.01, 0.1, 1].map((v) => (
            <button
              key={v}
              className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs"
              onClick={() => setAmount((a) => Number((a + v).toFixed(3)))}
            >
              +{v}
            </button>
          ))}
          <div className="ml-2 text-xs text-bone/60">Balance {balance.toFixed(3)}</div>
        </div>
        <div className="flex flex-1 items-center gap-3">
          <input type="range" min={0} max={100} defaultValue={30} className="w-full" />
          <div className="flex items-center gap-2 text-[10px] text-bone/60">
            {[10, 25, 50, 100].map((v) => (
              <button key={v} className="rounded-md border border-white/10 px-2 py-1">
                {v}%
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            className={`h-12 w-28 rounded-xl text-sm font-semibold ${
              round?.status === "WAITING" ? "bg-emerald-500/80 text-black" : "bg-white/10 text-bone/50"
            }`}
            onClick={placeBet}
            disabled={round?.status !== "WAITING"}
          >
            BUY
          </button>
          <button
            className={`h-12 w-28 rounded-xl text-sm font-semibold ${
              round?.status === "RUNNING" ? "bg-ember/80 text-black" : "bg-white/10 text-bone/50"
            }`}
            onClick={cashout}
            disabled={round?.status !== "RUNNING"}
          >
            SELL
          </button>
        </div>
      </div>
    </div>
  );
}
