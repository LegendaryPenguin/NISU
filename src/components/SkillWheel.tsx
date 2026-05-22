"use client";

import { useRef, useEffect, useCallback } from "react";
import type { SkillItem } from "@/lib/types";

const SEGMENT_COLORS = [
  "#ff787e", // coral
  "#73d9ff", // sky blue
  "#fdb95c", // amber
  "#ffb0ab", // pink
  "#ddf5ff", // light blue
  "#fdb95c", // amber (repeat for more variety)
  "#ff787e", // coral
  "#73d9ff", // sky blue
];

const TEXT_COLORS: Record<string, string> = {
  "#ff787e": "#fff",
  "#73d9ff": "#1a1a2e",
  "#fdb95c": "#1a1a2e",
  "#ffb0ab": "#1a1a2e",
  "#ddf5ff": "#1a1a2e",
};

interface SkillWheelProps {
  skills: SkillItem[];
  targetSkill: SkillItem | null;
  spinning: boolean;
  onSpinComplete: () => void;
}

export default function SkillWheel({
  skills,
  targetSkill,
  spinning,
  onSpinComplete,
}: SkillWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const animRef = useRef<number | null>(null);
  const spinCompleteCalledRef = useRef(false);

  const segmentCount = skills.length;
  const segmentArc = segmentCount > 0 ? (2 * Math.PI) / segmentCount : 0;

  const drawWheel = useCallback(
    (rotation: number) => {
      const canvas = canvasRef.current;
      if (!canvas || segmentCount === 0) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const size = canvas.clientWidth;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.scale(dpr, dpr);

      const cx = size / 2;
      const cy = size / 2;
      const radius = size / 2 - 4;

      ctx.clearRect(0, 0, size, size);

      // Draw segments
      for (let i = 0; i < segmentCount; i++) {
        const startAngle = rotation + i * segmentArc - Math.PI / 2;
        const endAngle = startAngle + segmentArc;
        const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length];

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();

        // Segment border
        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Text
        const textAngle = startAngle + segmentArc / 2;
        const textRadius = radius * 0.62;
        const tx = cx + Math.cos(textAngle) * textRadius;
        const ty = cy + Math.sin(textAngle) * textRadius;

        ctx.save();
        ctx.translate(tx, ty);
        ctx.rotate(textAngle + Math.PI / 2);

        const textColor = TEXT_COLORS[color] || "#1a1a2e";
        ctx.fillStyle = textColor;
        const fontSize = Math.max(10, Math.min(14, size / segmentCount / 2.2));
        ctx.font = `bold ${fontSize}px system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const label = skills[i].name;
        const maxWidth = radius * 0.52;
        if (ctx.measureText(label).width > maxWidth) {
          const words = label.split(" ");
          let line = "";
          const lines: string[] = [];
          for (const word of words) {
            const test = line ? `${line} ${word}` : word;
            if (ctx.measureText(test).width > maxWidth && line) {
              lines.push(line);
              line = word;
            } else {
              line = test;
            }
          }
          if (line) lines.push(line);
          const lineH = fontSize * 1.2;
          const startY = -((lines.length - 1) * lineH) / 2;
          lines.forEach((l, li) => {
            ctx.fillText(l, 0, startY + li * lineH);
          });
        } else {
          ctx.fillText(label, 0, 0);
        }

        ctx.restore();
      }

      // Center circle
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.15, 0, 2 * Math.PI);
      ctx.fillStyle = "#1a1a2e";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.1, 0, 2 * Math.PI);
      ctx.fillStyle = "#fff";
      ctx.fill();

      // Pointer (top triangle)
      const pointerSize = size * 0.05;
      ctx.beginPath();
      ctx.moveTo(cx, 2);
      ctx.lineTo(cx - pointerSize, -2);
      ctx.lineTo(cx + pointerSize, -2);
      ctx.closePath();
      ctx.fillStyle = "#1a1a2e";
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx, pointerSize * 1.6 + 2);
      ctx.lineTo(cx - pointerSize * 0.8, 0);
      ctx.lineTo(cx + pointerSize * 0.8, 0);
      ctx.closePath();
      ctx.fillStyle = "#1a1a2e";
      ctx.fill();
    },
    [skills, segmentCount, segmentArc]
  );

  // Static draw on mount and when skills change
  useEffect(() => {
    drawWheel(rotationRef.current);
  }, [drawWheel]);

  // Spin animation
  useEffect(() => {
    if (!spinning || !targetSkill || segmentCount === 0) return;

    spinCompleteCalledRef.current = false;

    const targetIndex = skills.findIndex((s) => s.id === targetSkill.id);
    if (targetIndex === -1) return;

    // Target angle: the pointer is at top (12 o'clock = -PI/2).
    // Segment i center is at i * segmentArc.
    // We need rotation such that segment center aligns with top.
    // rotation + targetIndex * segmentArc = 0 (mod 2PI) means center is at -PI/2 (where we offset)
    // So: targetRotation = -targetIndex * segmentArc
    // Add extra full rotations for visual effect
    const extraSpins = 4 + Math.random() * 2;
    const jitter = (Math.random() - 0.5) * segmentArc * 0.5;
    const targetRotation =
      extraSpins * 2 * Math.PI - targetIndex * segmentArc + jitter;

    const startRotation = rotationRef.current % (2 * Math.PI);
    const totalDelta = targetRotation - startRotation;
    const duration = 3500 + Math.random() * 1000;
    const startTime = performance.now();

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(t);
      const currentRotation = startRotation + totalDelta * eased;
      rotationRef.current = currentRotation;
      drawWheel(currentRotation);

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        animRef.current = null;
        if (!spinCompleteCalledRef.current) {
          spinCompleteCalledRef.current = true;
          onSpinComplete();
        }
      }
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
        animRef.current = null;
      }
    };
  }, [spinning, targetSkill, skills, segmentCount, segmentArc, drawWheel, onSpinComplete]);

  if (segmentCount === 0) return null;

  return (
    <div className="flex justify-center py-4">
      <canvas
        ref={canvasRef}
        className="w-64 h-64 sm:w-72 sm:h-72"
        style={{ maxWidth: "100%" }}
      />
    </div>
  );
}
