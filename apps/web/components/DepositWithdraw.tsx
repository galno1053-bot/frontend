"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { config } from "../lib/config";
import { apiFetch } from "../lib/api";
import { useAppStore } from "../lib/store";

const escrowAbi = [
  {
    type: "function",
    name: "deposit",
    stateMutability: "payable",
    inputs: [],
    outputs: []
  }
];

export function DepositWithdraw() {
  const [open, setOpen] = useState<"deposit" | "withdraw" | null>(null);
  const [amount, setAmount] = useState("0.01");
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const solWallet = useWallet();
  const { connection } = useConnection();
  const token = useAppStore((s) => s.token);

  const onDepositEvm = async () => {
    if (!config.evmEscrowAddress) throw new Error("Missing escrow address");
    await writeContractAsync({
      address: config.evmEscrowAddress as `0x${string}`,
      abi: escrowAbi,
      functionName: "deposit",
      value: parseEther(amount)
    });
  };

  const onDepositSol = async () => {
    if (!config.solanaProgramId) throw new Error("Missing program id");
    if (!solWallet.publicKey || !solWallet.sendTransaction) throw new Error("No wallet");

    const programId = new PublicKey(config.solanaProgramId);
    const [vault] = PublicKey.findProgramAddressSync([Buffer.from("vault")], programId);
    const data = Buffer.alloc(9);
    data.writeUInt8(0, 0);
    data.writeBigUInt64LE(BigInt(Math.floor(Number(amount) * 1e9)), 1);

    const ix = new TransactionInstruction({
      programId,
      keys: [
        { pubkey: solWallet.publicKey, isSigner: true, isWritable: true },
        { pubkey: vault, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
      ],
      data
    });

    const tx = new Transaction().add(ix);
    await solWallet.sendTransaction(tx, connection);
  };

  const onWithdraw = async (chain: "EVM" | "SOL") => {
    if (!token) throw new Error("Not logged in");
    await apiFetch("/withdraw", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ amount: Number(amount), chain })
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button className="rounded-full border border-white/20 px-3 py-1 text-xs" onClick={() => setOpen("deposit")}>
        Deposit
      </button>
      <button className="rounded-full border border-white/20 px-3 py-1 text-xs" onClick={() => setOpen("withdraw")}>
        Withdraw
      </button>

      {open && (
        <div className="absolute right-6 top-20 z-20 w-72 rounded-2xl border border-white/10 bg-steel p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="text-sm uppercase tracking-[0.3em] text-bone/70">{open}</div>
            <button onClick={() => setOpen(null)} className="text-bone/60">x</button>
          </div>
          <input
            className="mt-4 w-full rounded-lg bg-black/40 px-3 py-2 text-sm"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="mt-3 flex flex-col gap-2 text-xs">
            <button className="rounded-lg bg-acid px-3 py-2 text-ink" onClick={() => open === "deposit" ? onDepositEvm() : onWithdraw("EVM")}>
              {open === "deposit" ? "Deposit EVM" : "Withdraw EVM"}
            </button>
            <button className="rounded-lg bg-sea px-3 py-2 text-ink" onClick={() => open === "deposit" ? onDepositSol() : onWithdraw("SOL")}>
              {open === "deposit" ? "Deposit Solana" : "Withdraw Solana"}
            </button>
          </div>
          {address && <div className="mt-2 text-xs text-bone/60">EVM: {address.slice(0, 6)}...{address.slice(-4)}</div>}
        </div>
      )}
    </div>
  );
}
