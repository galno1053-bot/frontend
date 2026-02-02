"use client";

import { useState } from "react";
import { getSocket } from "../lib/socketClient";
import { useAppStore } from "../lib/store";

export function ChatPanel() {
  const chat = useAppStore((s) => s.chat);
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    getSocket()?.emit("chat:send", { text }, () => null);
    setText("");
  };

  return (
    <div className="glass flex h-full flex-col rounded-2xl p-4">
      <div className="text-xs uppercase tracking-[0.3em] text-bone/60">Chat</div>
      <div className="mt-3 flex-1 space-y-3 overflow-y-auto pr-2 scrollbar-hidden">
        {chat.map((msg) => (
          <div key={msg.id} className="text-xs">
            <span className="text-acid">{msg.username}</span>
            <span className="text-bone/60">:</span> {msg.text}
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
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
    </div>
  );
}
