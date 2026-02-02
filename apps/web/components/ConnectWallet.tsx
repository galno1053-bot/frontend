"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import bs58 from "bs58";
import { apiFetch } from "../lib/api";
import { useAppStore } from "../lib/store";

export function ConnectWallet() {
  const [tab, setTab] = useState<"EVM" | "SOL">("EVM");
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const solWallet = useWallet();
  const { setVisible } = useWalletModal();

  const setToken = useAppStore((s) => s.setToken);
  const setUser = useAppStore((s) => s.setUser);

  const handleLogin = async () => {
    if (tab === "EVM") {
      if (!address) return;
      const { message } = await apiFetch<{ message: string }>("/auth/nonce", {
        method: "POST",
        body: JSON.stringify({ address })
      });
      const signature = await signMessageAsync({ message });
      const { token, user } = await apiFetch<{ token: string; user: any }>("/auth/verify", {
        method: "POST",
        body: JSON.stringify({ address, signature, chain: "EVM" })
      });
      localStorage.setItem("galno_token", token);
      setToken(token);
      setUser(user);
    } else {
      if (!solWallet.publicKey || !solWallet.signMessage) return;
      const address = solWallet.publicKey.toBase58();
      const { message } = await apiFetch<{ message: string }>("/auth/nonce", {
        method: "POST",
        body: JSON.stringify({ address })
      });
      const signed = await solWallet.signMessage(new TextEncoder().encode(message));
      const signature = bs58.encode(signed);
      const { token, user } = await apiFetch<{ token: string; user: any }>("/auth/verify", {
        method: "POST",
        body: JSON.stringify({ address, signature, chain: "SOL" })
      });
      localStorage.setItem("galno_token", token);
      setToken(token);
      setUser(user);
    }
  };

  useEffect(() => {
    if (tab === "EVM" && isConnected && address) {
      handleLogin().catch(() => null);
    }
    if (tab === "SOL" && solWallet.connected && solWallet.publicKey) {
      handleLogin().catch(() => null);
    }
  }, [tab, isConnected, address, solWallet.connected]);

  return (
    <div className="flex items-center gap-3">
      <div className="flex rounded-full bg-white/10 p-1 text-xs">
        <button className={`px-3 py-1 rounded-full ${tab === "EVM" ? "bg-acid text-ink" : "text-bone/70"}`} onClick={() => setTab("EVM")}>EVM</button>
        <button className={`px-3 py-1 rounded-full ${tab === "SOL" ? "bg-sea text-ink" : "text-bone/70"}`} onClick={() => setTab("SOL")}>Solana</button>
      </div>
      {tab === "EVM" ? (
        isConnected ? (
          <button className="rounded-full border border-white/20 px-4 py-2 text-sm" onClick={() => disconnect()}>
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </button>
        ) : (
          <button
            className="rounded-full bg-acid px-4 py-2 text-sm font-semibold text-ink"
            onClick={() => connect({ connector: connectors[0] })}
          >
            Connect
          </button>
        )
      ) : solWallet.connected ? (
        <button className="rounded-full border border-white/20 px-4 py-2 text-sm" onClick={() => solWallet.disconnect()}>
          {solWallet.publicKey?.toBase58().slice(0, 4)}...{solWallet.publicKey?.toBase58().slice(-4)}
        </button>
      ) : (
        <button className="rounded-full bg-sea px-4 py-2 text-sm font-semibold text-ink" onClick={() => setVisible(true)}>
          Connect
        </button>
      )}
    </div>
  );
}
