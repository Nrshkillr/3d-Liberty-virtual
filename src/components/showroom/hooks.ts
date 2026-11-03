"use client";

import { useEffect, useState } from "react";

export type Quality = "high" | "low";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)");
    const update = () =>
      setIsTouch(query.matches || navigator.maxTouchPoints > 0);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isTouch;
}

export function useDeviceQuality(): Quality {
  const [quality, setQuality] = useState<Quality>("high");

  useEffect(() => {
    const navigatorWithMemory = navigator as Navigator & {
      deviceMemory?: number;
    };
    const memory = navigatorWithMemory.deviceMemory ?? 8;
    const cores = navigator.hardwareConcurrency ?? 8;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const narrow = window.innerWidth < 820;

    const low = cores <= 4 || memory <= 4 || (coarse && narrow);
    setQuality(low ? "low" : "high");
  }, []);

  return quality;
}

export type WebGLState = "checking" | "ready" | "unsupported";

export function useWebGLSupport(): WebGLState {
  const [state, setState] = useState<WebGLState>("checking");

  useEffect(() => {
    let supported = false;

    try {
      const canvas = document.createElement("canvas");
      const context =
        canvas.getContext("webgl2") ??
        canvas.getContext("webgl") ??
        canvas.getContext("experimental-webgl");
      supported = Boolean(context);
      if (context && "getExtension" in context) {
        (context as WebGLRenderingContext).getExtension("WEBGL_lose_context");
      }
    } catch {
      supported = false;
    }

    setState(supported ? "ready" : "unsupported");
  }, []);

  return state;
}
