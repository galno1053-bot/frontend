"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "../lib/store";

export function CrashChart() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const multiplier = useAppStore((s) => s.multiplier);
  const round = useAppStore((s) => s.round);
  const pointsRef = useRef<Array<{ x: number; y: number }>>([]);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (round?.status === "WAITING") {
      pointsRef.current = [];
      startRef.current = null;
    }
  }, [round?.status]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (round?.status === "RUNNING") {
      if (!startRef.current) startRef.current = performance.now();
      const t = (performance.now() - startRef.current) / 1000;
      pointsRef.current.push({ x: t, y: multiplier });
    }

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = "rgba(185, 242, 39, 0.8)";
    ctx.lineWidth = 2;
    ctx.beginPath();

    const points = pointsRef.current;
    if (points.length > 0) {
      const maxX = Math.max(points[points.length - 1].x, 5);
      const maxY = Math.max(...points.map((p) => p.y), 2);

      points.forEach((p, i) => {
        const x = (p.x / maxX) * (width - 40) + 20;
        const y = height - (p.y / maxY) * (height - 40) - 20;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
    }

    ctx.stroke();
  }, [multiplier, round?.status]);

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
