"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { config } from "../lib/config";
import { useAppStore } from "../lib/store";
import { setSocket } from "../lib/socketClient";

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const token = useAppStore((s) => s.token);
  const setRound = useAppStore((s) => s.setRound);
  const setMultiplier = useAppStore((s) => s.setMultiplier);
  const addLastMultiplier = useAppStore((s) => s.addLastMultiplier);
  const addChat = useAppStore((s) => s.addChat);
  const setPresence = useAppStore((s) => s.setPresence);
  const setPing = useAppStore((s) => s.setPing);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;
    const socket = io(config.socketUrl, {
      auth: { token },
      transports: ["websocket"]
    });
    socketRef.current = socket;
    setSocket(socket);

    socket.on("connect", () => {
      const start = performance.now();
      socket.emit("ping", () => {
        setPing(Math.round(performance.now() - start));
      });
    });

    socket.on("round:state", (payload) => {
      setRound(payload);
    });
    socket.on("round:tick", (payload) => {
      setMultiplier(payload.currentMultiplier);
    });
    socket.on("round:crash", (payload) => {
      if (payload?.crashPoint) addLastMultiplier(Number(payload.crashPoint));
      setMultiplier(1);
    });
    socket.on("chat:new", (msg) => addChat(msg));
    socket.on("presence:update", (presence) => setPresence(presence));

    return () => {
      socket.disconnect();
      setSocket(null);
    };
  }, [token, setRound, setMultiplier, addLastMultiplier, addChat, setPresence, setPing]);

  return <>{children}</>;
}
