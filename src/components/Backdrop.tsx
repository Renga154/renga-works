"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

// The WebGL layer is a separate chunk and is never part of the initial
// payload. ssr:false keeps three.js out of the server render entirely.
const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

/**
 * Decides whether the animated layer is allowed to load at all.
 *
 * It is skipped outright — not loaded and then hidden — when the user asks for
 * reduced motion, when the browser reports Save-Data, when the device looks
 * too weak to hold 30fps, or when WebGL is unavailable. Otherwise the import
 * is deferred to idle time so it cannot compete with first paint.
 */
function useAllow3D() {
  const [allow, setAllow] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Both are non-standard but widely shipped on the Chromium/Android side,
    // which is exactly where the weak-device case matters.
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
      deviceMemory?: number;
    };

    if (nav.connection?.saveData) return;
    if (nav.connection?.effectiveType?.endsWith("2g")) return;

    if ((nav.hardwareConcurrency ?? 4) < 4) return;
    if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return;

    // Cheap capability probe; the context is released immediately.
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      if (!gl) return;
      (
        gl.getExtension("WEBGL_lose_context") as WEBGL_lose_context | null
      )?.loseContext();
    } catch {
      return;
    }

    let cancelled = false;
    const start = () => {
      if (!cancelled) setAllow(true);
    };

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (h: number) => void;
    };

    let idle: number | undefined;
    let timer: number | undefined;
    if (typeof w.requestIdleCallback === "function") {
      idle = w.requestIdleCallback(start, { timeout: 2500 });
    } else {
      timer = window.setTimeout(start, 1500);
    }

    return () => {
      cancelled = true;
      if (idle !== undefined) w.cancelIdleCallback?.(idle);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);

  return allow;
}

export function Backdrop() {
  const allow = useAllow3D();
  const [dead, setDead] = useState(false);
  const onGiveUp = useCallback(() => setDead(true), []);

  return (
    <>
      {/*
       * These two layers are the baseline. They render on the server, cost
       * nothing, and are the whole backdrop whenever the scene is absent —
       * before it loads, on devices that skip it, and after the FPS guard
       * gives up. The scene sits between them and is purely additive.
       */}
      <div className="backdrop-static" aria-hidden="true" />
      {allow && !dead ? <Scene onGiveUp={onGiveUp} /> : null}
      <div className="backdrop-noise" aria-hidden="true" />
    </>
  );
}
