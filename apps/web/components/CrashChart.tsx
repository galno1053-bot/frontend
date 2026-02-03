"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (round?.status === "WAITING") {
      pointsRef.current = [];
      startRef.current = null;
    }
  }, [round?.status]);

  useEffect(() => {
    if (round?.status !== "WAITING" || !round.waitingEndsAt) {
      setCountdown(null);
      return;
    }
    const update = () => {
      const remaining = Math.max(0, round.waitingEndsAt! - Date.now());
      setCountdown(remaining / 1000);
    };
    update();
    const id = setInterval(update, 100);
    return () => clearInterval(id);
  }, [round?.status, round?.waitingEndsAt]);

  const candles = useMemo(() => {
    const ticks = pointsRef.current;
    const bucketMs = 260;
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
    return result.slice(-160);
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

    const rawMax = Math.max(...candles.map((c) => c.high), 2);
    const rawMin = Math.min(...candles.map((c) => c.low), 0.6);
    const range = rawMax - rawMin;
    const minRange = 0.55;
    const mid = (rawMax + rawMin) / 2;
    const max = range < minRange ? mid + minRange / 2 : rawMax;
    const min = range < minRange ? Math.max(0.25, mid - minRange / 2) : rawMin;

    const padX = 20;
    const padY = 18;
    const chartW = width - padX * 2;
    const chartH = height - padY * 2;

    const baseBody = width < 420 ? 6 : width < 640 ? 7 : width < 900 ? 9 : width < 1200 ? 11 : 13;
    const baseGap = baseBody * 0.7;
    const maxCandles = Math.max(10, Math.floor(chartW / (baseBody + baseGap)));
    const view = candles.slice(-maxCandles);

    const total = view.length * baseBody + (view.length - 1) * baseGap;
    const scale = Math.min(1, chartW / total);
    const bodyW = baseBody * scale;
    const gap = baseGap * scale;
    const totalScaled = view.length * bodyW + (view.length - 1) * gap;
    const startX = padX + (chartW - totalScaled) / 2;

    const mapY = (v: number) => padY + chartH - ((v - min) / (max - min)) * chartH;

    const drawLevel = (level: number) => {
      if (level < min || level > max) return;
      const y = mapY(level);
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(padX, y);
      ctx.lineTo(padX + chartW, y);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = "10px sans-serif";
      ctx.fillText(`${level.toFixed(1)}x`, padX + 6, y - 6);
    };

    drawLevel(1);
    drawLevel(1.5);
    drawLevel(2);

    ctx.lineCap = "round";

    view.forEach((candle, idx) => {
      const x = startX + idx * (bodyW + gap);
      const center = x + bodyW / 2;
      const openY = mapY(candle.open);
      const closeY = mapY(candle.close);
      const highY = mapY(candle.high);
      const lowY = mapY(candle.low);
      const up = candle.close >= candle.open;
      const color = up ? "#31f27a" : "#ff5f4a";

      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = Math.max(1, bodyW * 0.14);
      ctx.beginPath();
      ctx.moveTo(center, highY);
      ctx.lineTo(center, lowY);
      ctx.stroke();

      ctx.fillStyle = color;
      const bodyH = Math.max(3, Math.abs(openY - closeY));
      const bodyY = Math.min(openY, closeY);
      ctx.fillRect(x, bodyY, bodyW, bodyH);
    });

    const last = view[view.length - 1];
    if (last) {
      const labelY = mapY(last.close);
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(padX + chartW - 64, labelY - 13, 60, 22);
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.strokeRect(padX + chartW - 64, labelY - 13, 60, 22);
      ctx.fillStyle = "#e7e7e7";
      ctx.font = "12px sans-serif";
      ctx.fillText(`${last.close.toFixed(3)}x`, padX + chartW - 58, labelY + 4);
    }
  }, [candles, multiplier, round?.status]);

  return (
    <div className="relative h-[260px] w-full rounded-2xl border border-white/10 bg-steel/60 crash-grid sm:h-[320px] md:h-[380px] lg:h-[420px]">
      <canvas ref={canvasRef} className="h-full w-full" />
      {round?.status === "WAITING" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-[11px] uppercase tracking-[0.4em] text-bone/60">Game starts in</div>
          <div className="mt-2 text-4xl font-semibold text-bone">
            {countdown !== null ? countdown.toFixed(2) : "--"}s
          </div>
        </div>
      )}
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
