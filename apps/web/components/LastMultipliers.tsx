"use client";

import { useMemo } from "react";
import { useAppStore } from "../lib/store";

const hashSeed = (value: number, index: number) => {
  const str = `${value}-${index}`;
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
};

const buildCandle = (value: number, index: number) => {
  const seed = hashSeed(value, index);
  const vol = 0.08 + (seed % 20) / 100; // 0.08 - 0.28
  const direction = seed % 2 === 0 ? 1 : -1;
  const open = Math.max(1, value * (1 - vol * (direction > 0 ? 0.6 : 1)));
  const close = Math.max(1, value * (1 + vol * (direction > 0 ? 1 : 0.6)));
  const high = Math.max(open, close) * (1 + vol * 0.6);
  const low = Math.min(open, close) * (1 - vol * 0.6);
  return { open, close, high, low };
};

export function LastMultipliers() {
  const last100 = useAppStore((s) => s.last100);
  const stats = useMemo(() => {
    const over2 = last100.filter((m) => m >= 2).length;
    const over10 = last100.filter((m) => m >= 10).length;
    const over50 = last100.filter((m) => m >= 50).length;
    return { over2, over10, over50 };
  }, [last100]);

  const recent = last100.slice(0, 12);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-bone/60">Last 100</div>
          <div className="mt-1 text-2xl font-semibold text-bone">{last100[0]?.toFixed(2) ?? "1.00"}x</div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="rounded-full border border-white/10 bg-black/30 px-3 py-1">
            <span className="text-acid">2x+</span> {stats.over2}
          </div>
          <div className="rounded-full border border-white/10 bg-black/30 px-3 py-1">
            <span className="text-sea">10x+</span> {stats.over10}
          </div>
          <div className="rounded-full border border-white/10 bg-black/30 px-3 py-1">
            <span className="text-ember">50x+</span> {stats.over50}
          </div>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hidden">
        {recent.map((value, idx) => {
          const candle = buildCandle(value, idx);
          const max = Math.max(candle.high, 2);
          const min = Math.min(candle.low, 1);
          const mapY = (v: number) => 32 - ((v - min) / (max - min)) * 24;
          const openY = mapY(candle.open);
          const closeY = mapY(candle.close);
          const highY = mapY(candle.high);
          const lowY = mapY(candle.low);
          const up = candle.close >= candle.open;
          const color = up ? "#31f27a" : "#ff5f4a";

          return (
            <div key={`${value}-${idx}`} className="min-w-[72px] rounded-xl border border-white/10 bg-black/30 p-2">
              <svg width="56" height="32" viewBox="0 0 56 32" className="mx-auto block">
                <line x1="28" y1={highY} x2="28" y2={lowY} stroke={color} strokeWidth="2" />
                <rect
                  x="22"
                  y={Math.min(openY, closeY)}
                  width="12"
                  height={Math.max(2, Math.abs(openY - closeY))}
                  fill={color}
                  rx="2"
                />
              </svg>
              <div className="mt-1 text-center text-[10px] font-semibold text-bone/80">{value.toFixed(2)}x</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
