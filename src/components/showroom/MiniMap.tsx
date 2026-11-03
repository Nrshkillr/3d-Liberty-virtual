"use client";

import { useEffect, useRef } from "react";
import {
  MAP_FURNITURE,
  ROOM,
  WALK_BOUNDS,
} from "@/components/showroom/showroom-config";
import type { PlayerState } from "@/components/showroom/player";

const ENTRANCE_Z = ROOM.halfDepth;

function draw(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  player: PlayerState,
  time: number,
) {
  const padding = 8;
  const worldWidth = ROOM.width;
  const worldDepth = ROOM.depth;
  const scale = Math.min(
    (width - padding * 2) / worldWidth,
    (height - padding * 2) / worldDepth,
  );
  const offsetX = (width - worldWidth * scale) / 2;
  const offsetY = (height - worldDepth * scale) / 2;

  const toX = (x: number) => offsetX + (x + ROOM.halfWidth) * scale;
  const toY = (z: number) => offsetY + (z + ROOM.halfDepth) * scale;

  context.clearRect(0, 0, width, height);

  // Room floor.
  context.fillStyle = "#f6eddf";
  context.strokeStyle = "rgba(16, 42, 67, 0.28)";
  context.lineWidth = 1.25;
  context.beginPath();
  context.roundRect(
    toX(-ROOM.halfWidth),
    toY(-ROOM.halfDepth),
    ROOM.width * scale,
    ROOM.depth * scale,
    5,
  );
  context.fill();
  context.stroke();

  // Walkable area.
  context.strokeStyle = "rgba(16, 42, 67, 0.1)";
  context.setLineDash([2, 3]);
  context.lineWidth = 1;
  context.strokeRect(
    toX(WALK_BOUNDS.minX),
    toY(WALK_BOUNDS.minZ),
    (WALK_BOUNDS.maxX - WALK_BOUNDS.minX) * scale,
    (WALK_BOUNDS.maxZ - WALK_BOUNDS.minZ) * scale,
  );
  context.setLineDash([]);

  // Furniture.
  for (const item of MAP_FURNITURE) {
    context.fillStyle = item.fill;
    context.globalAlpha = item.opacity;
    context.beginPath();
    context.roundRect(
      toX(item.x - item.w / 2),
      toY(item.z - item.d / 2),
      Math.max(1.5, item.w * scale),
      Math.max(1.5, item.d * scale),
      1.5,
    );
    context.fill();
  }
  context.globalAlpha = 1;

  // Entrance marker along the front wall.
  context.strokeStyle = "#d9773f";
  context.lineWidth = 2.5;
  context.beginPath();
  context.moveTo(toX(-2.5), toY(ENTRANCE_Z) - 1);
  context.lineTo(toX(2.5), toY(ENTRANCE_Z) - 1);
  context.stroke();

  // Section labels.
  context.fillStyle = "rgba(16, 42, 67, 0.45)";
  context.font = `700 ${Math.max(6, Math.min(7.5, width / 34))}px Manrope, sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("WALKERS", toX(-9.8), toY(0.2));
  context.fillText("SWINGS", toX(-0.2), toY(0.9));
  context.fillText("RIDE-ONS", toX(9.7), toY(4.6));
  context.fillText("GIFTS", toX(0), toY(-7.4));
  context.fillText("ENTRANCE", toX(0), toY(ENTRANCE_Z) + 7);

  // Player.
  const playerX = toX(player.x);
  const playerY = toY(player.z);
  const forwardX = -Math.sin(player.yaw);
  const forwardY = -Math.cos(player.yaw);
  const rightX = Math.cos(player.yaw);
  const rightY = -Math.sin(player.yaw);
  const tip = 6.5;
  const back = 4.2;
  const side = 3.4;

  const pulse = 11 + Math.sin(time / 520) * 2.5;
  context.strokeStyle = "rgba(217, 119, 63, 0.28)";
  context.lineWidth = 1.4;
  context.beginPath();
  context.arc(playerX, playerY, pulse, 0, Math.PI * 2);
  context.stroke();

  context.fillStyle = "#d9773f";
  context.strokeStyle = "#fdfbf7";
  context.lineWidth = 1.5;
  context.beginPath();
  context.moveTo(playerX + forwardX * tip, playerY + forwardY * tip);
  context.lineTo(
    playerX - forwardX * back + rightX * side,
    playerY - forwardY * back + rightY * side,
  );
  context.lineTo(
    playerX - forwardX * back - rightX * side,
    playerY - forwardY * back - rightY * side,
  );
  context.closePath();
  context.fill();
  context.stroke();
}

export function MiniMap({
  player,
  className,
}: {
  player: PlayerState;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2.5);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const render = (time: number) => {
      if (width > 0 && height > 0) draw(context, width, height, player, time);
      frame = window.requestAnimationFrame(render);
    };
    frame = window.requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [player]);

  return (
    <div
      className={className}
      role="img"
      aria-label="Minimap of the Liberty Enterprises showroom showing your position"
    >
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
    </div>
  );
}
