"use client";

import { ConnectWallet } from "./ConnectWallet";
import { DepositWithdraw } from "./DepositWithdraw";
import { useAppStore } from "../lib/store";

export function Header() {
  const soundOn = useAppStore((s) => s.soundOn);
  const toggleSound = useAppStore((s) => s.toggleSound);
  const ping = useAppStore((s) => s.ping);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-semibold text-bone">GALNO</div>
            <div className="text-[10px] uppercase tracking-[0.4em] text-bone/50">BETA</div>
          </div>
          <div className="flex items-center gap-2">
            {[
              { label: "Standard", active: true },
              { label: "BBC", active: false },
              { label: "Candleflip", active: false }
            ].map((tab) => (
              <button
                key={tab.label}
                className={`rounded-full px-4 py-2 text-xs font-semibold ${
                  tab.active
                    ? "bg-ember/20 text-ember ring-1 ring-ember/50"
                    : "bg-white/5 text-bone/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <button className="rounded-full border border-white/20 px-3 py-1" onClick={toggleSound}>
              Sound {soundOn ? "On" : "Off"}
            </button>
            <div className="rounded-full border border-white/20 px-3 py-1">{ping}ms</div>
          </div>
          <DepositWithdraw />
          <ConnectWallet />
        </div>
      </div>
    </div>
  );
}
