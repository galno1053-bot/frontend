"use client";

import { useEffect } from "react";
import { apiFetch } from "../lib/api";
import { useAppStore } from "../lib/store";

export function AuthBootstrap() {
  const setToken = useAppStore((s) => s.setToken);
  const setUser = useAppStore((s) => s.setUser);
  const setBalance = useAppStore((s) => s.setBalance);

  useEffect(() => {
    const token = localStorage.getItem("galno_token");
    if (!token) return;
    setToken(token);
    apiFetch<{ user: any; balance: number }>("/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        setUser(res.user);
        setBalance(res.balance);
      })
      .catch(() => null);
  }, [setToken, setUser, setBalance]);

  return null;
}
