"use client";

import { useEffect, useMemo, useRef } from "react";
import { useAppStore } from "../lib/store";

interface TickPoint {
  t: number;
  m: number;
}

export function CrashChart() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const multiplier = useAppStore((s) => s.multiplier);
  const round = useAppStore((s) => s.round);
  const pointsRef = useRef<TickPoint[]>([]);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (round?.status === "WAITING") {
      pointsRef.current = [];
      startRef.current = null;
    }
  }, [round?.status]);

  const candles = useMemo(() => {
    const ticks = pointsRef.current;
    const bucketMs = 220;
    const result: Array<{ open: number; close: number; high: number; low: number }> = [];
    if (ticks.length === 0) return result;

    let currentBucket = Math.floor((ticks[0].t * 1000) / bucketMs);
    let open = ticks[0].m;
    let high = ticks[0].m;
    let low = ticks[0].m;
    let close = ticks[0].m;

    for (const tick of ticks) {
      const bucket = Math.floor((tick.t * 1000) / bucketMs);
      if (bucket !== currentBucket) {
        result.push({ open, high, low, close });
        currentBucket = bucket;
        open = tick.m;
        high = tick.m;
        low = tick.m;
        close = tick.m;
      } else {
        high = Math.max(high, tick.m);
        low = Math.min(low, tick.m);
        close = tick.m;
      }
    }
    result.push({ open, high, low, close });
    return result.slice(-120);
  }, [round?.status, multiplier]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (round?.status === "RUNNING") {
      if (!startRef.current) startRef.current = performance.now();
      const t = (performance.now() - startRef.current) / 1000;
      pointsRef.current.push({ t, m: multiplier });
    }

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

    ctx.clearRect(0, 0, width, height);

    if (candles.length === 0) return;

    const max = Math.max(...candles.map((c) => c.high), 2);
    const min = Math.min(...candles.map((c) => c.low), 1);
    const padX = 16;
    const padY = 16;
    const chartW = width - padX * 2;
    const chartH = height - padY * 2;
    const candleW = chartW / candles.length;

    const mapY = (v: number) => padY + chartH - ((v - min) / (max - min)) * chartH;

    candles.forEach((candle, idx) => {
      const x = padX + idx * candleW;
      const center = x + candleW / 2;
      const openY = mapY(candle.open);
      const closeY = mapY(candle.close);
      const highY = mapY(candle.high);
      const lowY = mapY(candle.low);
      const up = candle.close >= candle.open;
      const color = up ? "#31f27a" : "#ff5f4a";

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(center, highY);
      ctx.lineTo(center, lowY);
      ctx.stroke();

      ctx.fillStyle = color;
      const bodyH = Math.max(2, Math.abs(openY - closeY));
      const bodyY = Math.min(openY, closeY);
      ctx.fillRect(center - candleW * 0.25, bodyY, candleW * 0.5, bodyH);
    });
  }, [candles, multiplier, round?.status]);

  return (
    <div className="relative h-[360px] w-full rounded-2xl border border-white/10 bg-steel/60 crash-grid">
      <canvas ref={canvasRef} className="h-full w-full" />
      {round?.status === "CRASHED" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-5xl text-ember drop-shadow-md">Rugged!</div>
          <div className="mt-2 text-sm uppercase tracking-[0.4em] text-bone/70">Thanks for playing</div>
        </div>
      )}
      <div className="absolute left-6 top-6 rounded-full bg-black/40 px-4 py-2 text-xl font-semibold">
        {multiplier.toFixed(2)}x
      </div>
    </div>
  );
}
