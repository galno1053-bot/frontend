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
    <div className="glass mt-4 rounded-2xl p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-32 rounded-lg bg-black/40 px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            {[0.001, 0.01, 0.1].map((v) => (
              <button key={v} className="rounded-full border border-white/20 px-2 py-1 text-xs" onClick={() => setAmount((a) => Number((a + v).toFixed(3)))}>
                +{v}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-1 items-center gap-4">
          <input type="range" min={0} max={100} defaultValue={20} className="w-full" />
          <div className="text-xs text-bone/60">Balance: {balance.toFixed(3)}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`rounded-full px-5 py-2 text-sm font-semibold ${round?.status === "WAITING" ? "bg-acid text-ink" : "bg-white/10 text-bone/50"}`}
            onClick={placeBet}
            disabled={round?.status !== "WAITING"}
          >
            BUY
          </button>
          <button
            className={`rounded-full px-5 py-2 text-sm font-semibold ${round?.status === "RUNNING" ? "bg-ember text-ink" : "bg-white/10 text-bone/50"}`}
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
