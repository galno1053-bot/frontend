"use client";

import { useEffect, useState } from "react";
import { AuthBootstrap } from "../components/AuthBootstrap";
import { WalletProviders } from "../components/WalletProviders";
import { SocketProvider } from "../components/SocketProvider";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { CrashChart } from "../components/CrashChart";
import { Leaderboard } from "../components/Leaderboard";
import { BetBar } from "../components/BetBar";
import { LastMultipliers } from "../components/LastMultipliers";
import { ChatPanel } from "../components/ChatPanel";
import { apiFetch } from "../lib/api";
import { useAppStore } from "../lib/store";

export default function Home() {
  const setChat = useAppStore((s) => s.setChat);
  const setLast100 = useAppStore((s) => s.setLast100);
  const setLeaderboard = useAppStore((s) => s.setLeaderboard);
  const setRound = useAppStore((s) => s.setRound);
  const [range, setRange] = useState<"24h" | "7d" | "30d">("7d");

  useEffect(() => {
    apiFetch<any[]>("/chat/history")
      .then((msgs) => setChat(msgs))
      .catch(() => null);
    apiFetch<any[]>(`/round/history?limit=100`)
      .then((rounds) => {
        const values = rounds
          .filter((r) => r.crashPoint)
          .map((r) => Number(r.crashPoint))
          .slice(0, 100);
        setLast100(values);
      })
      .catch(() => null);
    apiFetch<any>("/round/current")
      .then((round) => setRound(round))
      .catch(() => null);
  }, [setChat, setLast100, setRound]);

  useEffect(() => {
    apiFetch(`/leaderboard?range=${range}`).then(setLeaderboard).catch(() => null);
  }, [range, setLeaderboard]);

  return (
    <WalletProviders>
      <AuthBootstrap />
      <SocketProvider>
        <div className="min-h-screen px-4 py-6 md:px-8">
          <Header />
          <div className="mt-6 grid gap-4 md:grid-cols-[220px_1fr_260px]">
            <div className="hidden md:block">
              <Sidebar />
            </div>
            <div className="space-y-4">
              <div className="glass rounded-2xl p-4">
                <LastMultipliers />
              </div>
              <CrashChart />
              <BetBar />
              <div className="grid gap-4 md:hidden">
                <Sidebar />
                <ChatPanel />
              </div>
            </div>
            <div className="hidden md:flex md:flex-col md:gap-4">
              <div className="glass rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-[0.3em] text-bone/60">Leaderboard</div>
                  <div className="flex gap-2 text-[10px]">
                    {(["24h", "7d", "30d"] as const).map((r) => (
                      <button
                        key={r}
                        className={`rounded-full px-2 py-1 ${range === r ? "bg-acid text-ink" : "border border-white/10 text-bone/60"}`}
                        onClick={() => setRange(r)}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <Leaderboard />
              <ChatPanel />
            </div>
          </div>
        </div>
      </SocketProvider>
    </WalletProviders>
  );
}
