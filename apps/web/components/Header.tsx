"use client";

import { ConnectWallet } from "./ConnectWallet";
import { DepositWithdraw } from "./DepositWithdraw";
import { useAppStore } from "../lib/store";

export function Header() {
  const soundOn = useAppStore((s) => s.soundOn);
  const toggleSound = useAppStore((s) => s.toggleSound);
  const ping = useAppStore((s) => s.ping);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="text-4xl text-acid">galno</div>
        <div className="text-xs uppercase tracking-[0.4em] text-bone/60">Standard / Candleflip</div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button className="rounded-full border border-white/20 px-3 py-1 text-xs" onClick={toggleSound}>
          Sound {soundOn ? "On" : "Off"}
        </button>
        <div className="rounded-full border border-white/20 px-3 py-1 text-xs">Ping {ping}ms</div>
        <DepositWithdraw />
        <ConnectWallet />
      </div>
    </div>
  );
}
