"use client";

import { Canvas } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import { AgentNetwork, type Tier } from "./AgentNetwork";

const TIERS: Tier[] = [
  { nodes: 220, links: 380 }, // 0 — desktop
  { nodes: 130, links: 210 }, // 1 — first downgrade
  { nodes: 70, links: 110 }, // 2 — mobile / second downgrade
];

/** Start one tier down on phones and low-core machines. */
function initialTier(): number {
  if (typeof navigator === "undefined") return 0;
  const cores = navigator.hardwareConcurrency ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.matchMedia("(max-width: 767px)").matches;
  if (coarse || narrow || cores <= 4) return 2;
  if (cores <= 8) return 1;
  return 0;
}

export default function Scene({ onGiveUp }: { onGiveUp: () => void }) {
  const [tier, setTier] = useState(initialTier);
  const [running, setRunning] = useState(true);

  // Consecutive one-second samples below the floor before we act.
  const bad = useRef(0);

  // Mirror of `tier` for the measurement callback. Written in an effect rather
  // than during render; the first sample is a full second away, so it is always
  // current by the time anything reads it.
  const tierRef = useRef(0);
  useEffect(() => {
    tierRef.current = tier;
  }, [tier]);

  const onMeasure = useCallback(
    (fps: number) => {
      if (fps >= 30) {
        bad.current = 0;
        return;
      }
      bad.current += 1;
      if (bad.current < 2) return;
      bad.current = 0;

      if (tierRef.current < TIERS.length - 1) {
        setTier((t) => t + 1);
      } else {
        // Already at the cheapest tier and still missing the floor:
        // tear the canvas down and leave the static backdrop in place.
        onGiveUp();
      }
    },
    [onGiveUp],
  );

  // Don't burn frames on a hero that has scrolled away, or a hidden tab.
  useEffect(() => {
    const hero = document.getElementById("home");

    const onVisibility = () => setRunning(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    let io: IntersectionObserver | undefined;
    if (hero) {
      io = new IntersectionObserver(
        ([entry]) => setRunning(entry.isIntersecting && !document.hidden),
        { threshold: 0 },
      );
      io.observe(hero);
    }

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      io?.disconnect();
    };
  }, []);

  return (
    <Canvas
      className="pointer-events-none"
      style={{ position: "fixed", inset: 0, zIndex: -2 }}
      frameloop={running ? "always" : "never"}
      dpr={[1, 1.5]}
      gl={{
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
        // The page never reads pixels back, so let the driver discard them.
        preserveDrawingBuffer: false,
      }}
      camera={{ position: [0, 0, 9], fov: 52 }}
      onCreated={({ gl }) => gl.setClearAlpha(0)}
    >
      <AgentNetwork tier={TIERS[tier]} onMeasure={onMeasure} />
    </Canvas>
  );
}
