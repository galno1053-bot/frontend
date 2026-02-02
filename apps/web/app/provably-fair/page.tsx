"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";

export default function ProvablyFair() {
  const [serverSeed, setServerSeed] = useState("");
  const [clientSeed, setClientSeed] = useState("");
  const [nonce, setNonce] = useState(1);
  const [roundId, setRoundId] = useState("");
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    apiFetch("/provablyfair/commit")
      .then((data: any) => {
        setClientSeed(data.clientSeed || "");
        setRoundId(data.roundId || "");
        if (data.nonce) setNonce(data.nonce);
      })
      .catch(() => null);
  }, []);

  const verify = async () => {
    const res = await apiFetch<{ crashPoint: number }>("/provablyfair/verify", {
      method: "POST",
      body: JSON.stringify({ serverSeed, clientSeed, nonce: Number(nonce), roundId })
    });
    setResult(res.crashPoint);
  };

  return (
    <div className="min-h-screen px-6 py-8 text-bone">
      <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-black/40 p-6">
        <h1 className="text-4xl text-acid">Provably Fair</h1>
        <p className="mt-2 text-sm text-bone/70">Verify crash point with seeds and nonce.</p>
        <div className="mt-6 grid gap-3">
          <input className="rounded-lg bg-black/40 px-3 py-2 text-sm" placeholder="Server seed" value={serverSeed} onChange={(e) => setServerSeed(e.target.value)} />
          <input className="rounded-lg bg-black/40 px-3 py-2 text-sm" placeholder="Client seed" value={clientSeed} onChange={(e) => setClientSeed(e.target.value)} />
          <input className="rounded-lg bg-black/40 px-3 py-2 text-sm" placeholder="Nonce" value={nonce} onChange={(e) => setNonce(Number(e.target.value))} />
          <input className="rounded-lg bg-black/40 px-3 py-2 text-sm" placeholder="Round ID" value={roundId} onChange={(e) => setRoundId(e.target.value)} />
          <button className="rounded-lg bg-acid px-4 py-2 text-sm font-semibold text-ink" onClick={verify}>Verify</button>
        </div>
        {result && (
          <div className="mt-6 rounded-xl border border-acid/30 bg-acid/10 p-4 text-center">
            <div className="text-sm uppercase tracking-[0.4em] text-bone/60">Crash Point</div>
            <div className="mt-2 text-4xl text-acid">{result.toFixed(2)}x</div>
          </div>
        )}
      </div>
    </div>
  );
}
