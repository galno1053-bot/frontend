"use client";

import { useState } from "react";
import { getSocket } from "../lib/socketClient";
import { useAppStore } from "../lib/store";

export function ChatPanel() {
  const chat = useAppStore((s) => s.chat);
  const presence = useAppStore((s) => s.presence);
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    getSocket()?.emit("chat:send", { text }, () => null);
    setText("");
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-black/40">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-bone/70">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Online ({presence?.onlineCount ?? 0})
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button className="rounded-md border border-white/10 px-2 py-1">@</button>
          <button className="rounded-md border border-white/10 px-2 py-1">#</button>
          <button className="rounded-md border border-white/10 px-2 py-1">?</button>
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-xs scrollbar-hidden">
        {chat.map((msg) => (
          <div key={msg.id} className="space-y-1 rounded-xl border border-white/5 bg-black/30 px-3 py-2">
            <div className="text-[11px] text-acid">{msg.username}</div>
            <div className="text-bone/80">{msg.text}</div>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 p-3">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 rounded-lg bg-black/40 px-3 py-2 text-xs"
            placeholder="Say something..."
          />
          <button className="rounded-lg bg-acid px-3 py-2 text-xs font-semibold text-ink" onClick={send}>
            Send
          </button>
        </div>
        <div className="mt-2 text-[10px] text-bone/50">Connect wallet to chat.</div>
      </div>
    </div>
  );
}
