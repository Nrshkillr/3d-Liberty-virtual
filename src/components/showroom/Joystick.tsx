"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { PlayerState } from "@/components/showroom/player";

const BASE = 124;
const KNOB = 52;
const MAX = (BASE - KNOB) / 2;

export function Joystick({
  player,
  disabled = false,
}: {
  player: PlayerState;
  disabled?: boolean;
}) {
  const baseRef = useRef<HTMLDivElement>(null);
  const pointerId = useRef<number | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  const reset = () => {
    pointerId.current = null;
    player.joystickX = 0;
    player.joystickY = 0;
    setOffset({ x: 0, y: 0 });
    setActive(false);
  };

  const update = (clientX: number, clientY: number) => {
    const base = baseRef.current;
    if (!base) return;

    const rect = base.getBoundingClientRect();
    const centreX = rect.left + rect.width / 2;
    const centreY = rect.top + rect.height / 2;
    let dx = clientX - centreX;
    let dy = clientY - centreY;

    const distance = Math.hypot(dx, dy);
    if (distance > MAX) {
      dx = (dx / distance) * MAX;
      dy = (dy / distance) * MAX;
    }

    setOffset({ x: dx, y: dy });
    player.joystickX = dx / MAX;
    player.joystickY = -dy / MAX;
  };

  return (
    <div
      className={cn(
        "pointer-events-auto select-none transition-opacity duration-200",
        disabled ? "opacity-35" : "opacity-100",
      )}
      aria-hidden={disabled}
    >
      <div
        ref={baseRef}
        role="application"
        aria-label="Movement joystick. Drag to walk."
        className="relative touch-none rounded-full border border-cream/25 bg-navy/35 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md"
        style={{ width: BASE, height: BASE }}
        onPointerDown={(event) => {
          if (disabled) return;
          if (pointerId.current !== null) return;
          pointerId.current = event.pointerId;
          setActive(true);
          event.currentTarget.setPointerCapture(event.pointerId);
          update(event.clientX, event.clientY);
        }}
        onPointerMove={(event) => {
          if (pointerId.current !== event.pointerId) return;
          update(event.clientX, event.clientY);
        }}
        onPointerUp={(event) => {
          if (pointerId.current !== event.pointerId) return;
          reset();
        }}
        onPointerCancel={reset}
        onLostPointerCapture={reset}
      >
        <div className="pointer-events-none absolute inset-0 rounded-full">
          <span className="absolute left-1/2 top-3 h-1 w-1 -translate-x-1/2 rounded-full bg-cream/40" />
          <span className="absolute bottom-3 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-cream/40" />
          <span className="absolute left-3 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-cream/40" />
          <span className="absolute right-3 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-cream/40" />
        </div>

        <div
          className={cn(
            "pointer-events-none absolute left-1/2 top-1/2 flex items-center justify-center rounded-full border border-white/30 bg-cream/90 shadow-lg transition-[background-color,box-shadow] duration-150",
            active && "bg-ember-soft",
          )}
          style={{
            width: KNOB,
            height: KNOB,
            transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
          }}
        >
          <span className="h-4 w-4 rounded-full border border-navy/25 bg-navy/12" />
        </div>
      </div>

      <p className="mt-2 text-center text-[0.6rem] font-bold uppercase tracking-[0.18em] text-cream/60">
        Walk
      </p>
    </div>
  );
}
