"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  clampPitch,
  EYE_HEIGHT,
  MOVE_SPEED,
  SPRINT_MULTIPLIER,
  type PlayerState,
} from "@/components/showroom/player";
import { resolveMovement } from "@/components/showroom/collision";
import { useReducedMotion } from "@/components/showroom/hooks";

const KEY_MAP: Record<string, string> = {
  KeyW: "w",
  ArrowUp: "w",
  KeyS: "s",
  ArrowDown: "s",
  KeyA: "a",
  ArrowLeft: "a",
  KeyD: "d",
  ArrowRight: "d",
  ShiftLeft: "shift",
  ShiftRight: "shift",
};

function forwardFromYaw(yaw: number) {
  return { x: -Math.sin(yaw), z: -Math.cos(yaw) };
}

function rightFromYaw(yaw: number) {
  return { x: Math.cos(yaw), z: -Math.sin(yaw) };
}

export function CameraControls({
  player,
  enabled,
}: {
  player: PlayerState;
  enabled: boolean;
}) {
  const { camera, gl } = useThree();
  const reducedMotion = useReducedMotion();
  const enabledRef = useRef(enabled);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    camera.rotation.order = "YXZ";
    camera.position.set(player.x, EYE_HEIGHT, player.z);
    camera.rotation.set(player.pitch, player.yaw, 0);
    // Position is intentionally synced once on mount; the frame loop takes over.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera]);

  useEffect(() => {
    const element = gl.domElement;
    element.style.touchAction = "none";

    let dragging = false;
    let pointerId: number | null = null;
    let lastX = 0;
    let lastY = 0;

    const onKeyDown = (event: KeyboardEvent) => {
      const key = KEY_MAP[event.code];
      if (!key) return;

      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.code.startsWith("Arrow")) event.preventDefault();
      player.keys.add(key);
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const key = KEY_MAP[event.code];
      if (key) player.keys.delete(key);
    };

    const clearKeys = () => {
      player.keys.clear();
      player.joystickX = 0;
      player.joystickY = 0;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!enabledRef.current) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;
      if (pointerId !== null) return;

      dragging = true;
      pointerId = event.pointerId;
      lastX = event.clientX;
      lastY = event.clientY;

      try {
        element.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture is not supported in some older browsers.
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== pointerId) return;

      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;

      const sensitivity = event.pointerType === "touch" ? 0.0041 : 0.0026;
      player.yaw -= dx * sensitivity;
      player.pitch = clampPitch(player.pitch - dy * sensitivity);
    };

    const endDrag = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      dragging = false;
      pointerId = null;
      try {
        element.releasePointerCapture(event.pointerId);
      } catch {
        // Ignore.
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (!enabledRef.current) return;
      event.preventDefault();

      const step = Math.max(
        -0.85,
        Math.min(0.85, -event.deltaY * (event.deltaMode === 1 ? 0.035 : 0.0016)),
      );

      const forward = forwardFromYaw(player.yaw);
      const resolved = resolveMovement(
        player.x,
        player.z,
        player.x + forward.x * step,
        player.z + forward.z * step,
      );

      player.x = resolved.x;
      player.z = resolved.z;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", clearKeys);
    element.addEventListener("pointerdown", onPointerDown);
    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerup", endDrag);
    element.addEventListener("pointercancel", endDrag);
    element.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", clearKeys);
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerup", endDrag);
      element.removeEventListener("pointercancel", endDrag);
      element.removeEventListener("wheel", onWheel);
    };
  }, [gl, player]);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.06);
    const p = player;

    if (enabled) {
      let forwardInput =
        (p.keys.has("w") ? 1 : 0) - (p.keys.has("s") ? 1 : 0) + p.joystickY;
      let strafeInput =
        (p.keys.has("d") ? 1 : 0) - (p.keys.has("a") ? 1 : 0) + p.joystickX;

      const magnitude = Math.hypot(forwardInput, strafeInput);
      if (magnitude > 1) {
        forwardInput /= magnitude;
        strafeInput /= magnitude;
      }

      const moving = magnitude > 0.02;
      p.moving = moving;

      if (moving) {
        const speed =
          MOVE_SPEED *
          (p.keys.has("shift") ? SPRINT_MULTIPLIER : 1) *
          Math.min(1, magnitude);

        const forward = forwardFromYaw(p.yaw);
        const right = rightFromYaw(p.yaw);

        const nextX =
          p.x +
          (forward.x * forwardInput + right.x * strafeInput) * speed * delta;
        const nextZ =
          p.z +
          (forward.z * forwardInput + right.z * strafeInput) * speed * delta;

        const resolved = resolveMovement(p.x, p.z, nextX, nextZ);
        p.x = resolved.x;
        p.z = resolved.z;

        p.bobPhase += delta * (p.keys.has("shift") ? 11 : 8.5) * Math.min(1, magnitude);
      }
    } else {
      p.moving = false;
    }

    const bobAmount = p.moving && !reducedMotion ? 0.017 : 0;
    const idleSway = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.7) * 0.004;
    const bob =
      Math.sin(p.bobPhase) * bobAmount +
      (p.moving && !reducedMotion ? Math.abs(Math.cos(p.bobPhase)) * 0.004 : 0);

    camera.position.set(p.x, EYE_HEIGHT + bob + idleSway, p.z);
    camera.rotation.set(p.pitch, p.yaw, 0);
  });

  return null;
}
